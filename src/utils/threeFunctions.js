import circle from "@jscad/modeling/src/primitives/circle";
import rectangle from "@jscad/modeling/src/primitives/rectangle";
import roundedRectangle from "@jscad/modeling/src/primitives/roundedRectangle";
import geom2 from "@jscad/modeling/src/geometries/geom2";
import measureBoundingBox from "@jscad/modeling/src/measurements/measureBoundingBox";
import offset from "@jscad/modeling/src/operations/expansions/offset";
import intersect from "@jscad/modeling/src/operations/booleans/intersect";
import union from "@jscad/modeling/src/operations/booleans/union";
import extrudeLinear from "@jscad/modeling/src/operations/extrusions/extrudeLinear";
import generalize from "@jscad/modeling/src/operations/modifiers/generalize";
import vec2Rotate from "@jscad/modeling/src/maths/vec2/rotate";
import degToRad from "@jscad/modeling/src/utils/degToRad";

import earcut from "earcut";
import { isOverlapping } from "./shapeOverlapping";
import { state } from "../setup/state";
import { isValidPolygonPoints } from "./freehandUtils";
import { showToast } from "./freehandUtils";

import {
  Vector2,
  Vector3,
  Box2,
  BufferGeometry,
  BufferAttribute,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  BoxHelper,
  MathUtils,
  Raycaster,
  Plane
} from "three";


const jscad = {
  primitives: { circle, rectangle, roundedRectangle },
  geometries: { geom2 },
  measurements: { measureBoundingBox },
  expansions: { offset },
  booleans: { intersect, union },
  extrusions: { extrudeLinear },
  modifiers: { generalize },
  maths: { vec2: { rotate: vec2Rotate } },
  utils: { degToRad },
};


const CORNER_SEGMENTS = 16;

function getDefaultCornerRadius() {
  return typeof state?.cornerRadius === "number" && !isNaN(state.cornerRadius)
    ? state.cornerRadius
    : 5;
}

function clampCornerRadius(sizeX, sizeY, radius) {
  const maxR = Math.max(0, Math.min(sizeX, sizeY) / 2 - 0.001);
  return Math.min(radius, maxR);
}

function roundGeom2(geom, radius) {
  if (!radius || radius <= 0) return geom;

  const bounds = jscad.measurements.measureBoundingBox(geom);
  if (!bounds) return geom;

  const sizeX = bounds[1][0] - bounds[0][0];
  const sizeY = bounds[1][1] - bounds[0][1];
  const useR = clampCornerRadius(sizeX, sizeY, radius);
  if (useR <= 0) return geom;

  let g = jscad.expansions.offset(
    { delta: -useR, corners: "round", segments: CORNER_SEGMENTS },
    geom
  );
  g = jscad.expansions.offset(
    { delta: useR, corners: "round", segments: CORNER_SEGMENTS },
    g
  );
  return g;
}

export function project(p0, camera, ctx) {
  return p0
    .project(camera)
    .multiply(new Vector3(1, -1, 1))
    .addScalar(1.0)
    .multiplyScalar(0.5)
    .multiply(new Vector3(ctx.canvas.width, ctx.canvas.height, 1));
}

export function shapeToGeom2(shape) {
  function num(v, fallback = 0) {
    return typeof v === "number" && !isNaN(v) ? v : fallback;
  }

  if (!shape || typeof shape.kind !== "string") {
    return jscad.primitives.rectangle({ center: [0, 0], size: [1, 1] });
  }

  switch (shape.kind) {
    case "circle": {
      const cx = num(shape.x),
        cy = num(shape.y),
        r = num(shape.radius, 1);
      return jscad.primitives.circle({
        center: [cx, cy],
        radius: r,
        segments: 20,
      });
    }
    case "line":
      return Array.isArray(shape) ? shape : [];
    case "rectangle": {
      const cx = num(shape.x),
        cy = num(shape.y);
      const sx = num(shape.sizeX, 1),
        sy = num(shape.sizeY, 1);
      const radius = clampCornerRadius(
        sx,
        sy,
        shape.cornerRadius ?? getDefaultCornerRadius()
      );
      let rect =
        radius > 0
          ? jscad.primitives.roundedRectangle({
            center: [cx, cy],
            size: [sx, sy],
            roundRadius: radius,
            segments: CORNER_SEGMENTS,
          })
          : jscad.primitives.rectangle({
            center: [cx, cy],
            size: [sx, sy],
          });

      const rot = num(shape.rotation, 0);
      if (rot !== 0) {
        for (let side of rect.sides) {
          for (let vert of side) {
            jscad.maths.vec2.rotate(
              vert,
              vert,
              [cx, cy],
              jscad.utils.degToRad(rot)
            );
          }
        }
      }
      return rect;
    }
    case "polygon": {
      const useR =
        shape?.source === "photoshape"
          ? 0
          : num(shape.cornerRadius, getDefaultCornerRadius());
      if (shape.geom) {
        return roundGeom2(shape.geom, useR);
      }
      const cx = num(shape.x),
        cy = num(shape.y),
        rot = num(shape.rotation, 0);
      if (!Array.isArray(shape.points) || shape.points.length < 3) {
        return jscad.primitives.rectangle({ center: [cx, cy], size: [1, 1] });
      }
      let pts = shape.points.map(([x, y]) => {
        const px = num(x),
          py = num(y);
        let v = [px, py];
        jscad.maths.vec2.rotate(v, v, [0, 0], jscad.utils.degToRad(rot));
        return [v[0] + cx, v[1] + cy];
      });
      if (!isValidPolygonPoints(pts)) {
        return jscad.primitives.rectangle({ center: [cx, cy], size: [1, 1] });
      }

      try {
        const geom = jscad.geometries.geom2.fromPoints(pts);
        return roundGeom2(geom, useR);
      } catch (err) {
        console.error("Invalid polygon points", err, pts);
        return jscad.primitives.rectangle({ center: [cx, cy], size: [1, 1] });
      }
    }
    case "photoshape": {
      const cx = num(shape.x),
        cy = num(shape.y),
        rot = num(shape.rotation, 0);
      if (!Array.isArray(shape.polygon) || shape.polygon.length === 0) {
        return jscad.primitives.rectangle({ center: [cx, cy], size: [1, 1] });
      }
      let geoms = [];
      for (let contour of shape.polygon) {
        if (!Array.isArray(contour) || contour.length === 0) continue;
        let pts = contour.map((pt) => {
          const x = Array.isArray(pt) && pt.length === 2 ? num(pt[0]) : 0;
          const y = Array.isArray(pt) && pt.length === 2 ? num(pt[1]) : 0;
          let v = [x, y];
          jscad.maths.vec2.rotate(v, v, [0, 0], jscad.utils.degToRad(rot));
          return [v[0] + cx, v[1] + cy];
        });
        if (pts.length > 2) {
          geoms.push(jscad.geometries.geom2.fromPoints(pts));
        }
      }
      return geoms.length === 1 ? geoms[0] : geoms;
    }
    default:
      return jscad.primitives.rectangle({
        center: [num(shape.x), num(shape.y)],
        size: [1, 1],
      });
  }
}

export function getGeom2Points(shape) {
  const geom = shapeToGeom2(shape);
  return Array.isArray(geom)
    ? geom.flatMap((g) => jscad.geometries.geom2.toPoints(g))
    : jscad.geometries.geom2.toPoints(geom);
}

export function simplifyPointsForDrag(points, targetCount = 200) {
  if (!Array.isArray(points) || points.length <= targetCount) return points;
  const step = Math.ceil(points.length / targetCount);
  const simplified = [];
  for (let i = 0; i < points.length; i += step) {
    simplified.push(points[i]);
  }
  return simplified.length >= 3 ? simplified : points;
}

function measurementFont(basePx) {
  const dpr = window.devicePixelRatio || 1;
  const scale = window.innerWidth <= 768 ? 0.5 : 1;
  return "bold " + basePx * dpr * scale + "px sans-serif";
}

export function getBoundingBox(shape) {
  let pts = [];
  try {
    pts = jscad.geometries.geom2.toPoints(shapeToGeom2(shape));
  } catch (_) {
  }
  if (!pts.length && Array.isArray(shape.points)) {
    pts = shape.points;
  }
  if (!pts.length) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }
  let minX = pts[0][0],
    maxX = pts[0][0];
  let minY = pts[0][1],
    maxY = pts[0][1];
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, maxX, minY, maxY };
}

export function isNearGeneric(a, b, t) {
  const A = getBoundingBox(a);
  const B = getBoundingBox(b);
  return !(
    A.maxX + t < B.minX ||
    A.minX - t > B.maxX ||
    A.maxY + t < B.minY ||
    A.minY - t > B.maxY
  );
}

export function shapesIntersectGeneric(a, b) {
  const A = getBoundingBox(a);
  const B = getBoundingBox(b);
  if (
    A.maxX < B.minX ||
    A.minX > B.maxX ||
    A.maxY < B.minY ||
    A.minY > B.maxY
  ) {
    return false;
  }
  let inter = jscad.booleans.intersect(shapeToGeom2(a), shapeToGeom2(b));
  if (Array.isArray(inter)) {
    return inter.some((g) => jscad.geometries.geom2.toPoints(g).length > 0);
  }
  return !!inter && jscad.geometries.geom2.toPoints(inter).length > 0;
}

export function mergeIntoPolygon(a, b) {
  let u = jscad.booleans.union(shapeToGeom2(a), shapeToGeom2(b));
  if (Array.isArray(u)) u = u[0];

  const adj = {},
    coord = {};
  const keyOf = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;
  for (const side of u.sides || []) {
    if (!Array.isArray(side) || side.length < 2) continue;
    const [p1, p2] = side;
    const k1 = keyOf(p1),
      k2 = keyOf(p2);
    coord[k1] = [p1[0], p1[1]];
    coord[k2] = [p2[0], p2[1]];
    adj[k1] = adj[k1] || new Set();
    adj[k2] = adj[k2] || new Set();
    adj[k1].add(k2);
    adj[k2].add(k1);
  }

  const keys = Object.keys(adj);
  if (keys.length < 3) {
    console.error("mergeIntoPolygon: not enough vertices");
    return {
      kind: "polygon",
      points: [],
      sizeZ: Math.max(a.sizeZ || 0, b.sizeZ || 0),
    };
  }

  keys.sort((k1, k2) => {
    const [x1, y1] = coord[k1],
      [x2, y2] = coord[k2];
    return y1 === y2 ? x1 - x2 : y1 - y2;
  });
  let start = keys[0],
    prev = null,
    cur = start;
  let dir = [1, 0];
  const loop = [cur];

  while (true) {
    const neighbors = Array.from(adj[cur]).filter((k) => k !== prev);
    if (neighbors.length === 0) break;

    let best = null,
      bestAngle = Infinity;
    const [cx, cy] = coord[cur];
    for (const nbr of neighbors) {
      const [nx, ny] = coord[nbr];
      let vx = nx - cx,
        vy = ny - cy;
      const mag = Math.hypot(vx, vy);
      if (mag === 0) continue;
      vx /= mag;
      vy /= mag;
      const cross = dir[0] * vy - dir[1] * vx;
      const dot = dir[0] * vx + dir[1] * vy;
      let angle = Math.atan2(cross, dot);
      if (angle < 0) angle += 2 * Math.PI;
      if (angle < bestAngle) {
        bestAngle = angle;
        best = nbr;
      }
    }
    if (!best || best === start) break;

    prev = cur;
    cur = best;
    loop.push(cur);
    const [px, py] = coord[prev],
      [cx2, cy2] = coord[cur];
    const dx = cx2 - px,
      dy = cy2 - py,
      dmag = Math.hypot(dx, dy);
    dir = dmag ? [dx / dmag, dy / dmag] : dir;
  }

  const pts = loop.map((k) => coord[k]);

  const xs = pts.map((p) => p[0]),
    ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const translatedPoints = pts.map(([x, y]) => [x - minX, y - minY]);

  return {
    kind: "polygon",
    free: false,
    id: `shape-${Date.now()}`,
    points: translatedPoints,
    rotation: 0,
    x: minX,
    y: minY,
    sizeX: maxX - minX,
    sizeY: maxY - minY,
    sizeZ: Math.max(a.sizeZ || 0, b.sizeZ || 0),
  };
}


export function shapesIntersect(a, b) {
  if (!isOverlapping(a, b)) return false;

  let inter = jscad.booleans.intersect(shapeToGeom2(a), shapeToGeom2(b));
  if (Array.isArray(inter)) return inter.length > 0;
  return !!inter;
}

export function shapeToGeom3(shape) {
  let geom2 = shapeToGeom2(shape);
  return jscad.extrusions.extrudeLinear(
    {
      height: shape?.sizeZ,
    },
    geom2
  );
}

export function geom2ToLineSegments(geom2) {
  let positions = [];
  for (let line of geom2?.sides) {
    for (let vertex of line) {
      positions?.push(vertex[0]);
      positions?.push(vertex[1]);
      positions?.push(0);
    }
  }
  let geo = new BufferGeometry();
  geo.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(positions), 3, false)
  );
  return new LineSegments(geo, new LineBasicMaterial());
}

export function geom2ToMesh(geom2) {
  let positions = [];
  let indices = [];

  if (Array.isArray(geom2)) {
    let indexOffset = 0;
    for (let geometry of geom2) {
      let geoData = processGeometry(geometry);
      positions.push(...geoData.positions);

      let geoIndices = geoData.indices.map((idx) => idx + indexOffset);
      indices.push(...geoIndices);

      indexOffset += geoData.positions.length / 3;
    }
  } else {
    let geoData = processGeometry(geom2);
    positions = geoData.positions;
    indices = geoData.indices;
  }

  let geo = new BufferGeometry();
  geo.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(positions), 3, false)
  );
  geo.setIndex(new BufferAttribute(new Uint16Array(indices), 1));
  geo.computeVertexNormals();

  return new Mesh(geo, new MeshBasicMaterial());
}

function processGeometry(geometry) {
  let positions = [];
  let indices = [];

  if (geometry && geometry.sides) {
    for (let line of geometry.sides) {
      if (Array.isArray(line)) {
        for (let vertex of line) {
          if (Array.isArray(vertex) && vertex.length >= 2) {
            positions.push(vertex[0]);
            positions.push(vertex[1]);
            positions.push(0);
          }
        }
      }
    }

    indices = earcut(positions, [], 3);
  } else {
    console.error("Invalid geometry:", geometry);
  }

  return { positions, indices };
}

export function geom3ToMesh(geom3) {
  geom3 = jscad.modifiers.generalize(
    {
      triangulate: true,
    },
    geom3
  );

  let points = [];
  let normals = [];
  for (let triangle of geom3.polygons) {
    let p0 = new Vector3(...triangle.vertices[0]);
    let p1 = new Vector3(...triangle.vertices[1]);
    let p2 = new Vector3(...triangle.vertices[2]);
    let normal = new Vector3().crossVectors(
      new Vector3().subVectors(p1, p0),
      new Vector3().subVectors(p2, p0)
    );
    if (normal.lengthSq() > 0.001) {
      normal = normal.normalize();
    }
    points.push(p0, p1, p2);
    normals.push(normal, normal, normal);
  }

  let flatNormals = [];
  for (let normal of normals) {
    flatNormals.push(...normal.toArray());
  }

  let geo = new BufferGeometry();
  geo.setFromPoints(points);
  geo.setAttribute(
    "normal",
    new BufferAttribute(new Float32Array(flatNormals), 3, false)
  );
  return new Mesh(geo, new MeshBasicMaterial());
}

export function mouseOverShape(
  shape,
  mouseRayPlaneIntersection,
  pointInsidePolygon
) {
  if (shape.kind == "circle") {
    let shapeCenter = new Vector2(shape.x, shape.y);
    if (shapeCenter.distanceTo(mouseRayPlaneIntersection) < shape.radius) {
      return true;
    }
  } else if (shape.kind == "rectangle") {
    let shapeBox = new Box2(
      new Vector2(shape.x - shape.sizeX / 2, shape.y - shape.sizeY / 2),
      new Vector2(shape.x + shape.sizeX / 2, shape.y + shape.sizeY / 2)
    );
    let v = mouseRayPlaneIntersection;
    v = v.clone();
    v = v.rotateAround(
      new Vector2(shape.x, shape.y),
      jscad.utils.degToRad(-shape.rotation)
    );
    if (shapeBox.containsPoint(v)) {
      return true;
    }
  } else if (shape.kind == "photoshape") {
    let v = mouseRayPlaneIntersection;
    let polygons = shape.polygon.map((polygon) => {
      let rotatedPolygon = polygon.map(([x, y]) =>
        jscad.maths.vec2.rotate(
          [x, y],
          [x, y],
          [0, 0],
          jscad.utils.degToRad(shape.rotation)
        )
      );
      return rotatedPolygon.map(([x, y]) => [x + shape.x, y + shape.y]);
    });
    let isInside = polygons.some((polygon) =>
      pointInsidePolygon([v.x, v.y], polygon)
    );
    return isInside;
  } else if (shape.kind == "polygon") {
    let v = mouseRayPlaneIntersection;
    let polygon = shape.points
      .map(([x, y]) => [x, y])
      .map((v) =>
        jscad.maths.vec2.rotate(
          v,
          v,
          [0, 0],
          jscad.utils.degToRad(shape.rotation)
        )
      );
    polygon = polygon.map(([x, y]) => [x + shape.x, y + shape.y]);
    return pointInsidePolygon([v.x, v.y], polygon);
  }
  return false;
}

export function drawOutline(
  shape,
  style,
  width,
  z,
  ctx,
  camera,
  display2D,
  renderer,
  selected,
  scene,
  displayDot
) {
  ctx.lineWidth = width;
  ctx.strokeStyle = style;

  const showControlPoints = display2D && displayDot;

  if (showControlPoints && shape.kind === "polygon" && Array.isArray(shape.points)) {
    drawPolygonFromPoints(shape.points, shape, z, ctx, camera, renderer);
  } else {
    const geom2 = shapeToGeom2(shape);
    const geometries = Array.isArray(geom2) ? geom2 : [geom2];

    geometries.forEach((geometry) => {
      if (!geometry?.sides?.length) return;

      ctx.beginPath();
      const firstPoint = geometry.sides[0][0];
      const p0 = projectPoint(firstPoint[0], firstPoint[1], z, camera, renderer);
      ctx.moveTo(p0.x, p0.y);

      geometry.sides.forEach((line) => {
        const point = line[1];
        const p1 = projectPoint(point[0], point[1], z, camera, renderer);
        ctx.lineTo(p1.x, p1.y);
      });

      ctx.lineTo(p0.x, p0.y);
      ctx.stroke();
    });
  }

  if (showControlPoints && Array.isArray(shape.points)) {
    if (
      !shape.controlPoints ||
      shape.controlPoints.length !== shape.points.length * 2
    ) {
      clearControlPoints(shape, scene);
      shape.controlPoints = [];

      const CP_Z = z;
      shape.points.forEach(([x, y], index) => {
        const sphere = new Mesh(
          new SphereGeometry(3, 16, 16),
          new MeshBasicMaterial({ color: 0x00ffff })
        );
        sphere.position.set(x + shape.x, y + shape.y, CP_Z);
        sphere.name = `controlPoint-${index}`;
        sphere.userData.pointIndex = index;
        sphere.userData.isControlSphere = true;
        scene.add(sphere);
        shape.controlPoints.push(sphere);

        const helper = new BoxHelper(sphere, 0xffff00);
        helper.material.opacity = 0;
        helper.material.transparent = true;
        helper.material.colorWrite = false;
        helper.visible = true;
        helper.userData.pointIndex = index;
        helper.userData.isControlHelper = true;
        scene.add(helper);
        shape.controlPoints.push(helper);
      });
    } else {
      const CP_Z = z;
      if (!shape._draggingPoint) {
        for (let i = 0; i < shape.controlPoints.length; i += 2) {
          const sphere = shape.controlPoints[i];
          const pt = shape.points[sphere.userData.pointIndex];
          if (!pt) continue;
          sphere.position.set(pt[0] + shape.x, pt[1] + shape.y, CP_Z);
        }
      }
    }

    if (
      showControlPoints &&
      Array.isArray(shape.points) &&
      shape.points.length >= 3 &&
      typeof shape._selectedPointIndex === "number"
    ) {
      const i = shape._selectedPointIndex;
      const n = shape.points.length;

      const prev = shape.points[(i - 1 + n) % n];
      const curr = shape.points[i];
      const next = shape.points[(i + 1) % n];

      const v1 = new Vector2(prev[0] - curr[0], prev[1] - curr[1]);
      const v2 = new Vector2(next[0] - curr[0], next[1] - curr[1]);

      const denom = v1.length() * v2.length();
      if (denom > 0) {
        const cos = MathUtils.clamp(v1.dot(v2) / denom, -1, 1);
        const angleDeg = MathUtils.radToDeg(Math.acos(cos));

        const p = projectPoint(curr[0] + shape.x, curr[1] + shape.y, z, camera, renderer);
        ctx.save();
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = measurementFont(18);
        const label = `${angleDeg.toFixed(1)}°`;
        ctx.strokeText(label, p.x + 8, p.y - 8);
        ctx.fillText(label, p.x + 8, p.y - 8);
        ctx.restore();
      }
    }
    if (
      shape.points.length >= 3 &&
      typeof shape._selectedPointIndex === "number"
    ) {
      const i = shape._selectedPointIndex;
      const n = shape.points.length;

      const prev = shape.points[(i - 1 + n) % n];
      const curr = shape.points[i];
      const next = shape.points[(i + 1) % n];

      const pPrev = projectPoint(prev[0] + shape.x, prev[1] + shape.y, z, camera, renderer);
      const pCurr = projectPoint(curr[0] + shape.x, curr[1] + shape.y, z, camera, renderer);
      const pNext = projectPoint(next[0] + shape.x, next[1] + shape.y, z, camera, renderer);

      const v1x = pPrev.x - pCurr.x;
      const v1y = pPrev.y - pCurr.y;
      const v2x = pNext.x - pCurr.x;
      const v2y = pNext.y - pCurr.y;

      const len1 = Math.hypot(v1x, v1y);
      const len2 = Math.hypot(v2x, v2y);

      if (len1 > 0 && len2 > 0) {
        const dot = (v1x * v2x + v1y * v2y) / (len1 * len2);
        const angleDeg = MathUtils.radToDeg(Math.acos(MathUtils.clamp(dot, -1, 1)));
        const a1 = Math.atan2(v1y, v1x);
        const a2 = Math.atan2(v2y, v2x);
        let start = a1;
        let end = a2;
        let delta = end - start;
        if (delta > Math.PI) end -= Math.PI * 2;
        if (delta < -Math.PI) end += Math.PI * 2;
        const radius = 22;
        ctx.save();
        ctx.strokeStyle = "yellow";
        ctx.fillStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pCurr.x, pCurr.y, radius, start, end, false);
        ctx.stroke();
        const mid = (start + end) / 2;
        const lx = pCurr.x + Math.cos(mid) * (radius + 10);
        const ly = pCurr.y + Math.sin(mid) * (radius + 10);
        ctx.font = measurementFont(18);
        const label = `${angleDeg.toFixed(1)}°`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(label, lx, ly);
        ctx.fillText(label, lx, ly);
        ctx.restore();
      }
    }

    if (!shape._controlPointsSetup) {
      shape._controlPointsSetup = true;
      setupControlPointInteractions(shape, scene, camera, renderer, z);
    }
  } else {
    clearControlPoints(shape, scene);
  }
}

function clearControlPoints(shape, scene) {
  if (shape.cleanup) {
    shape.cleanup();
    delete shape.cleanup;
  }
  if (shape.controlPoints) {
    shape.controlPoints.forEach((obj) => scene.remove(obj));
  }
  shape.controlPoints = [];
  shape._controlPointsSetup = false;
}

function setupControlPointInteractions(
  shape,
  scene,
  camera,
  renderer,
  CP_Z = 0
) {
  if (shape._controlPointHandlersInitialized) return;
  shape._controlPointHandlersInitialized = true;

  const cpState = {
    isDragging: false,
    selectedPoint: null,
    raycaster: new Raycaster(),
    mouse: new Vector2(),
    CP_Z: CP_Z,
  };
  cpState.dragRaf = null;
  cpState.lastClientX = 0;
  cpState.lastClientY = 0;


  const target = renderer.domElement;
  target.style.pointerEvents = "auto";

  const getRect = () => renderer.domElement.getBoundingClientRect();
  const ndcFromEvent = (evt) => {
    const r = getRect();
    return {
      x: ((evt.clientX - r.left) / r.width) * 2 - 1,
      y: -((evt.clientY - r.top) / r.height) * 2 + 1,
    };
  };

  function syncRaycast(evt) {
    scene.updateMatrixWorld(true);
    shape.controlPoints.forEach((p) => p.updateMatrixWorld(true));
    const ndc = ndcFromEvent(evt);
    cpState.mouse.set(ndc.x, ndc.y);
    cpState.raycaster.setFromCamera(cpState.mouse, camera);
  }

  function getPlaneHit(evt) {
    syncRaycast(evt);
    const dragPlane = new Plane(new Vector3(0, 0, 1), -cpState.CP_Z);
    const pos = new Vector3();
    const hit = cpState.raycaster.ray.intersectPlane(dragPlane, pos);
    return hit ? pos : null;
  }

  function dist2PointToSegment(p, a, b) {
    const ax = a[0], ay = a[1];
    const bx = b[0], by = b[1];
    const px = p[0], py = p[1];

    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;

    const abLen2 = abx * abx + aby * aby;
    const t = abLen2 === 0 ? 0 : Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLen2));
    const cx = ax + abx * t;
    const cy = ay + aby * t;

    const dx = px - cx;
    const dy = py - cy;
    return { dist2: dx * dx + dy * dy, t };
  }

  function dist2PointToSegment2D(p, a, b) {
    const ax = a.x, ay = a.y;
    const bx = b.x, by = b.y;
    const px = p.x, py = p.y;

    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;

    const abLen2 = abx * abx + aby * aby;
    const t = abLen2 === 0 ? 0 : Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLen2));
    const cx = ax + abx * t;
    const cy = ay + aby * t;

    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy;
  }

  function projectToClient(x, y, z) {
    const v = new Vector3(x, y, z);
    v.project(camera);
    const r = getRect();
    return {
      x: r.left + (v.x + 1) * 0.5 * r.width,
      y: r.top + (1 - v.y) * 0.5 * r.height,
    };
  }

  function getNearestPointIndex(evt, pixelThreshold = 10) {
    if (!evt || !Array.isArray(shape.points)) return -1;

    const mx = evt.clientX;
    const my = evt.clientY;

    let bestIdx = -1;
    let bestDist2 = Infinity;

    for (let i = 0; i < shape.points.length; i++) {
      const pt = shape.points[i];
      const screen = projectToClient(pt[0] + shape.x, pt[1] + shape.y, cpState.CP_Z);
      const dx = screen.x - mx;
      const dy = screen.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist2) {
        bestDist2 = d2;
        bestIdx = i;
      }
    }

    return bestDist2 <= pixelThreshold * pixelThreshold ? bestIdx : -1;
  }

  function isNearExistingPoint(evt, pixelThreshold = 45) {
    if (!evt || !Array.isArray(shape.points)) return false;

    const mx = evt.clientX;
    const my = evt.clientY;

    for (let i = 0; i < shape.points.length; i++) {
      const pt = shape.points[i];
      const screen = projectToClient(pt[0] + shape.x, pt[1] + shape.y, cpState.CP_Z);
      const dx = screen.x - mx;
      const dy = screen.y - my;
      if (dx * dx + dy * dy <= pixelThreshold * pixelThreshold) {
        return true;
      }
    }

    return false;
  }

  function dist2PointToSegment2D(p, a, b) {
    const ax = a.x, ay = a.y;
    const bx = b.x, by = b.y;
    const px = p.x, py = p.y;

    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;

    const abLen2 = abx * abx + aby * aby;
    const t = abLen2 === 0 ? 0 : Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLen2));
    const cx = ax + abx * t;
    const cy = ay + aby * t;

    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy;
  }

  function getEdgeHit(evt, pixelThreshold = 12) {
    const pos = getPlaneHit(evt);
    if (!pos || !Array.isArray(shape.points) || shape.points.length < 2) {
      return null;
    }

    const mouse = { x: evt.clientX, y: evt.clientY };

    let best = { i: 0, dist2: Infinity };

    for (let i = 0; i < shape.points.length; i++) {
      const a = shape.points[i];
      const b = shape.points[(i + 1) % shape.points.length];

      const aScreen = projectToClient(a[0] + shape.x, a[1] + shape.y, cpState.CP_Z);
      const bScreen = projectToClient(b[0] + shape.x, b[1] + shape.y, cpState.CP_Z);

      const dist2 = dist2PointToSegment2D(mouse, aScreen, bScreen);
      if (dist2 < best.dist2) best = { i, dist2 };
    }

    return best.dist2 <= pixelThreshold * pixelThreshold
      ? { pos, edgeIndex: best.i }
      : null;
  }

  function insertPointAtWorldPos(worldPos, evt) {
    if (!Array.isArray(shape.points) || shape.points.length < 2) return;

    if (isNearExistingPoint(evt, 10)) return;

    const local = [worldPos.x - shape.x, worldPos.y - shape.y];

    let best = { i: 0, dist2: Infinity };
    for (let i = 0; i < shape.points.length; i++) {
      const a = shape.points[i];
      const b = shape.points[(i + 1) % shape.points.length];
      const { dist2 } = dist2PointToSegment(local, a, b);
      if (dist2 < best.dist2) best = { i, dist2 };
    }

    const prev = shape.points[best.i];
    const next = shape.points[(best.i + 1) % shape.points.length];

    if (
      (prev && prev[0] === local[0] && prev[1] === local[1]) ||
      (next && next[0] === local[0] && next[1] === local[1])
    ) {
      return;
    }

    const newPoints = shape.points.slice();
    newPoints.splice(best.i + 1, 0, local);

    if (!isValidPolygonPoints(newPoints)) return;

    shape.points = newPoints;
    clearControlPoints(shape, scene);
  }

  function removePointAtIndex(idx) {
    if (!Array.isArray(shape.points) || shape.points.length <= 3) return;
    shape.points.splice(idx, 1);
    clearControlPoints(shape, scene);
  }

  function onMouseDown(evt) {
    evt.stopPropagation();
    if (state.deletePointMode) {
      if (!Array.isArray(shape.points) || shape.points.length <= 3) {
        showToast("No more point delete possible", { background: "#b00020" });
        return;
      }
      const idx = getNearestPointIndex(evt, 10);
      if (idx === -1) return;
      removePointAtIndex(idx);
      return;
    }

    syncRaycast(evt);
    const hit = cpState.raycaster.intersectObjects(shape.controlPoints, true);

    if (hit.length) {
      evt.preventDefault();
      const obj = hit[0].object;
      const idx = obj.userData.pointIndex;
      shape._selectedPointIndex = idx;

      if (evt.altKey) {
        removePointAtIndex(idx);
        return;
      }

      cpState.isDragging = true;
      shape._draggingPoint = true;
      cpState.selectedPoint =
        shape.controlPoints.find(
          (p) => p.userData.pointIndex === idx && p.userData.isControlSphere
        ) || obj;

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return;
    }

    if (state.addPointMode) {
      const edgeHit = getEdgeHit(evt);
      if (!edgeHit) return;
      insertPointAtWorldPos(edgeHit.pos, evt);
      return;
    }

    if (evt.shiftKey) {
      const pos = getPlaneHit(evt);
      if (pos) insertPointAtWorldPos(pos, evt);
    }
  }

  function onHover(evt) {
    if (state.deletePointMode) {
      if (!Array.isArray(shape.points) || shape.points.length <= 3) {
        delete shape._selectedPointIndex;
        target.style.cursor = "not-allowed";
        return;
      }
      const idx = getNearestPointIndex(evt, 10);
      if (idx !== -1) {
        shape._selectedPointIndex = idx;
        target.style.cursor = "pointer";
      } else {
        delete shape._selectedPointIndex;
        target.style.cursor = "not-allowed";
      }
      return;
    }

    syncRaycast(evt);
    const hit = cpState.raycaster.intersectObjects(shape.controlPoints, true);

    if (hit.length) {
      const obj = hit[0].object;
      const idx = obj.userData.pointIndex;
      shape._selectedPointIndex = idx;
      target.style.cursor = evt.altKey ? "not-allowed" : "move";
      return;
    }

    delete shape._selectedPointIndex;

    if (state.addPointMode) {
      const edgeHit = getEdgeHit(evt);
      target.style.cursor = edgeHit ? "copy" : "not-allowed";
      return;
    }

    target.style.cursor = evt.shiftKey ? "copy" : "";
  }

  function onMouseMove(evt) {
    if (!cpState.isDragging || !cpState.selectedPoint) return;

    cpState.lastClientX = evt.clientX;
    cpState.lastClientY = evt.clientY;

    if (cpState.dragRaf) return;

    cpState.dragRaf = requestAnimationFrame(() => {
      cpState.dragRaf = null;
      if (!cpState.isDragging || !cpState.selectedPoint) return;

      const fakeEvt = {
        clientX: cpState.lastClientX,
        clientY: cpState.lastClientY,
      };

      syncRaycast(fakeEvt);

      const dragPlane = new Plane(new Vector3(0, 0, 1), -cpState.CP_Z);
      const pos = new Vector3();
      cpState.raycaster.ray.intersectPlane(dragPlane, pos);

      cpState.selectedPoint.position.set(pos.x, pos.y, cpState.CP_Z);

      const i = cpState.selectedPoint.userData.pointIndex;
      shape.points[i] = [pos.x - shape.x, pos.y - shape.y];
    });
  }

  function onMouseUp() {
    if (!cpState.isDragging) return;

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    cpState.isDragging = false;
    cpState.selectedPoint = null;
    shape._draggingPoint = false;

    if (cpState.dragRaf) {
      cancelAnimationFrame(cpState.dragRaf);
      cpState.dragRaf = null;
    }
  }

  target.addEventListener("mousedown", onMouseDown, { capture: true });
  window.addEventListener("mousemove", onHover);

  shape.cleanup = () => {
    target.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onHover);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    shape._controlPointHandlersInitialized = false;
    delete shape._selectedPointIndex;
  };
}

function drawPolygonFromPoints(points, shape, z, ctx, camera, renderer) {
  if (!points || points.length < 2) return;

  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    const v = new Vector3(
      x + shape.x,
      y + shape.y,
      z
    );

    const p = projectPoint(v.x, v.y, v.z, camera, renderer);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.stroke();
}

function projectPoint(x, y, z, camera, renderer) {
  const vector = new Vector3(x, y, z);
  vector.project(camera);

  return {
    x: ((vector.x + 1) * renderer.domElement.width) / 2,
    y: ((1 - vector.y) * renderer.domElement.height) / 2,
  };
}

export function drawMeasurementsPhotoshape(
  shape,
  ctx,
  camera,
  currPanel,
  centimeters
) {
  ctx.fillStyle = "orange";

  const { minX, minY } = getBoundingBox(shape);

  function transform(v, camera) {
    return project(
      v
        .sub(new Vector3(shape.x, shape.y, 0))
        .applyAxisAngle(
          new Vector3(0, 0, 1),
          jscad.utils.degToRad(shape?.rotation || 0)
        )
        .add(new Vector3(shape.x, shape.y, 0)),
      camera,
      ctx
    );
  }

  if (currPanel.id.endsWith("-depth-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new Vector3(minX, minY, 37 * centimeters),
      camera
    );
    let p1 = transform(
      new Vector3(minX, minY, 37 * centimeters - shape.sizeZ),
      camera
    );
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  if (currPanel.id.endsWith("-depth-panel")) {
    let p0 = transform(
      new Vector3(minX, minY, 37 * centimeters),
      camera
    );
    let p1 = transform(
      new Vector3(minX, minY, 37 * centimeters - shape.sizeZ),
      camera
    );
    let pMid = new Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = measurementFont(20);

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
}

export function drawMeasurementsRectangle(
  shape,
  ctx,
  camera,
  currPanel,
  centimeters
) {
  ctx.fillStyle = "orange";

  function transform(v, camera) {
    return project(
      v
        .sub(new Vector3(shape.x, shape.y, 0))
        .applyAxisAngle(
          new Vector3(0, 0, 1),
          jscad.utils.degToRad(shape.rotation)
        )
        .add(new Vector3(shape.x, shape.y, 0)),
      camera,
      ctx
    );
  }

  if (currPanel.id.endsWith("-depth-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters - shape.sizeZ
      ),
      camera
    );
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  if (currPanel.id.endsWith("-resize-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new Vector3(
        shape.x + shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  if (currPanel.id.endsWith("-resize-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y + shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  if (currPanel.id.endsWith("-depth-panel")) {
    let p0 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters - shape.sizeZ
      ),
      camera
    );
    let pMid = new Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = measurementFont(20);

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
  if (currPanel.id.endsWith("-resize-panel")) {
    let p0 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new Vector3(
        shape.x + shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let pMid = new Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = measurementFont(20);

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeX.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeX.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
  if (currPanel.id.endsWith("-resize-panel")) {
    let p0 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new Vector3(
        shape.x - shape.sizeX / 2,
        shape.y + shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let pMid = new Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = measurementFont(20);

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeY.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeY.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
}

export function drawMeasurementsPolygon(
  shape,
  ctx,
  camera,
  currPanel,
  centimeters
) {
  ctx.fillStyle = "orange";
  const { minX, minY } = getBoundingBox(shape);

  function transform(v, camera) {
    return project(
      v
        .sub(new Vector3(shape?.x, shape?.y, 0))
        .applyAxisAngle(
          new Vector3(0, 0, 1),
          jscad.utils.degToRad(shape?.rotation)
        )
        .add(new Vector3(shape?.x, shape?.y, 0)),
      camera,
      ctx
    );
  }

  if (currPanel.id.endsWith("-depth-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new Vector3(minX, minY, 37 * centimeters),
      camera
    );
    let p1 = transform(
      new Vector3(minX, minY, 37 * centimeters - shape.sizeZ),
      camera
    );
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  if (currPanel.id.endsWith("-depth-panel")) {
    let p0 = transform(
      new Vector3(minX, minY, 37 * centimeters),
      camera
    );
    let p1 = transform(
      new Vector3(minX, minY, 37 * centimeters - shape.sizeZ),
      camera
    );
    let pMid = new Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = measurementFont(20);

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
}

export function drawMeasurementsCircle(
  shape,
  ctx,
  camera,
  currPanel,
  centimeters
) {
  ctx.fillStyle = "orange";
  {
    let p0 = project(
      new Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    let p1 = project(
      new Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ),
      camera,
      ctx
    );
    let p2 = project(
      new Vector3(shape.x + shape.radius, shape.y, 37 * centimeters),
      camera,
      ctx
    );

    if (
      currPanel.id.endsWith("radius-panel") ||
      currPanel.id.endsWith("depth-panel")
    ) {
      ctx.beginPath();
      ctx.arc(p0.x, p0.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (currPanel.id.endsWith("depth-panel")) {
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (currPanel.id.endsWith("radius-panel")) {
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  if (currPanel.id.endsWith("depth-panel")) {
    ctx.beginPath();
    let p0 = project(
      new Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    ctx.moveTo(p0.x, p0.y);
    let p1 = project(
      new Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ),
      camera,
      ctx
    );
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  if (currPanel.id.endsWith("radius-panel")) {
    ctx.beginPath();
    let p0 = project(
      new Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    ctx.moveTo(p0.x, p0.y);
    let p1 = project(
      new Vector3(shape.x + shape.radius, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  if (currPanel.id.endsWith("depth-panel")) {
    let p0 = project(
      new Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    let p1 = project(
      new Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ),
      camera,
      ctx
    );
    let pMid = new Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = measurementFont(20);

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }

  if (currPanel.id.endsWith("radius-panel")) {
    let p0 = project(
      new Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    let p1 = project(
      new Vector3(shape.x + shape.radius, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    let pMid = new Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = measurementFont(20);

    ctx.textAlign = "center";
    ctx.fillText(shape.radius.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.radius.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
}

export function drawMeasurementsLine(shape, ctx, camera, centimeters) {
  ctx.strokeStyle = shape.color || "blue";
  ctx.lineWidth = shape.thickness;

  let p0 = project(
    new Vector3(shape.startX, shape.startY, 37 * centimeters),
    camera,
    ctx
  );
  let p1 = project(
    new Vector3(shape.endX, shape.endY, 37 * centimeters),
    camera,
    ctx
  );

  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

export function drawEdgeToFoamMeasurements(shape, foam, ctx, camera) {
  if (!shape || !foam) return;

  const { minX, maxX, minY, maxY } = getBoundingBox(shape);

  const foamLeft = foam.x - foam.sizeX / 2;
  const foamTop = foam.y + foam.sizeY / 2;
  const baseZ = foam.sizeZ;

  const leftDist = minX - foamLeft;
  const topDist = foamTop - maxY;

  if (leftDist < 0 || topDist < 0) return;

  const midY = (minY + maxY) / 2;
  const midX = (minX + maxX) / 2;

  const pLeftEdge = project(new Vector3(foamLeft, midY, baseZ), camera, ctx);
  const pLeftVertex = project(new Vector3(minX, midY, baseZ), camera, ctx);

  const pTopEdge = project(new Vector3(midX, foamTop, baseZ), camera, ctx);
  const pTopVertex = project(new Vector3(midX, maxY, baseZ), camera, ctx);

  ctx.save();
  ctx.strokeStyle = "orange";
  ctx.fillStyle = "orange";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(pLeftEdge.x, pLeftEdge.y);
  ctx.lineTo(pLeftVertex.x, pLeftVertex.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pTopEdge.x, pTopEdge.y);
  ctx.lineTo(pTopVertex.x, pTopVertex.y);
  ctx.stroke();

  ctx.font = measurementFont(20);
  ctx.textAlign = "center";

  const leftMidX = (pLeftEdge.x + pLeftVertex.x) / 2;
  const leftMidY = (pLeftEdge.y + pLeftVertex.y) / 2;
  const leftLabel = leftDist.toFixed(0) + "mm";
  ctx.fillText(leftLabel, leftMidX, leftMidY - 6);
  ctx.strokeText(leftLabel, leftMidX, leftMidY - 6);

  const topMidX = (pTopEdge.x + pTopVertex.x) / 2;
  const topMidY = (pTopEdge.y + pTopVertex.y) / 2;
  const topLabel = topDist.toFixed(0) + "mm";
  ctx.fillText(topLabel, topMidX + 6, topMidY);
  ctx.strokeText(topLabel, topMidX + 6, topMidY);

  ctx.restore();
}

export function drawCircle(shape, ctx, camera, centimeters) {
  ctx.fillStyle = "red";

  // function project(p0, camera, ctx, centimeters) {
  //   return new Vector3(p0.x, p0.y, 37 * centimeters)
  //     .project(camera)
  //     .addScalar(1.0)
  //     .multiplyScalar(0.5)
  //     .multiply(new Vector3(ctx.canvas.width, ctx.canvas.height, 1));
  // }

  // function project(p0, camera, ctx, centimeters) {
  //   return p0
  //     .project(camera)
  //     .multiply(new Vector3(p0.x, p0.y, 37 * centimeters))
  //     .addScalar(1.0)
  //     .multiplyScalar(0.5)
  //     .multiply(new Vector3(ctx.canvas.width, ctx.canvas.height, 1));
  // }

  // Project the normalized mouse coordinates into 3D space
  // let center = project(
  //   new Vector3(shape.x, shape.y, 37 * centimeters),
  //   camera,
  //   ctx,
  //   centimeters
  // );

  ctx.beginPath();
  ctx.arc(center.x, center.y, shape.radius, 0, 2 * Math.PI);
  ctx.fill();
}

export function worldToWindow(world, ctx, camera) {
  return world
    .clone()
    .project(camera)
    .multiply(new Vector3(1, -1, 0))
    .addScalar(1)
    .divideScalar(2)
    .multiply(
      new Vector3(
        ctx.domElement.clientWidth,
        ctx.domElement.clientHeight,
        0
      )
    );
}

function smoothNormals(points) {
  let n = points.length / 3;

  let faceNormals = [];
  for (let i = 0; i < n; i++) {
    let p0 = points[i * 3 + 0];
    let p1 = points[i * 3 + 1];
    let p2 = points[i * 3 + 2];
    let normal = new Vector3().crossVectors(
      new Vector3().subVectors(p1, p0),
      new Vector3().subVectors(p2, p0)
    );
    faceNormals.push(normal, normal, normal);
  }

  let faceNormalWeights = [];
  for (let i = 0; i < n; i++) {
    let p0 = points[i * 3 + 0];
    let p1 = points[i * 3 + 1];
    let p2 = points[i * 3 + 2];
    let a0 = new Vector3()
      .subVectors(p1, p0)
      .angleTo(new Vector3().subVectors(p2, p0));
    let a1 = new Vector3()
      .subVectors(p2, p1)
      .angleTo(new Vector3().subVectors(p0, p1));
    let a2 = new Vector3()
      .subVectors(p0, p2)
      .angleTo(new Vector3().subVectors(p1, p2));
    faceNormalWeights.push(a0, a1, a2);
  }

  let smoothNormals = [];
  for (let i = 0; i < n * 3; i++) {
    smoothNormals.push([
      faceNormals[i].clone().multiplyScalar(faceNormalWeights[i]),
    ]);
  }

  for (let i = 0; i < n * 3 - 1; i++) {
    for (let j = i + 1; j < n * 3; j++) {
      let angleLimit = 30;
      if (
        faceNormals[i]
          .clone()
          .normalize()
          .dot(faceNormals[j].clone().normalize()) <
        Math.cos(MathUtils.degToRad(angleLimit))
      ) {
        continue;
      }
      if (points[i].distanceTo(points[j]) > 0.001) {
        continue;
      }
      smoothNormals[i].push(
        faceNormals[j].clone().multiplyScalar(faceNormalWeights[j])
      );
      smoothNormals[j].push(
        faceNormals[i].clone().multiplyScalar(faceNormalWeights[i])
      );
    }
  }

  return smoothNormals.map((ns) => {
    let nn = new Vector3(0, 0, 0);
    ns.forEach((n) => nn.add(n));
    nn = nn.normalize();
    return nn;
  });
}

export function createEditor(shape, camera, renderer, onUpdate) {
  const controlPoints = [];
  let selectedPoint = null;
  let isDragging = false;

  const overlay = document.createElement("canvas");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.pointerEvents = "auto";
  overlay.width = renderer.domElement.width;
  overlay.height = renderer.domElement.height;
  renderer.domElement.parentElement.appendChild(overlay);
  const ctx = overlay.getContext("2d");

  const projectPoint = (x, y, z) => {
    const vector = new Vector3(x, y, z);
    vector.project(camera);
    return {
      x: (vector.x * 0.5 + 0.5) * overlay.width,
      y: -(vector.y * 0.5 - 0.5) * overlay.height,
    };
  };

  const unprojectPoint = (screenX, screenY) => {
    const vector = new Vector3(
      (screenX / overlay.width) * 2 - 1,
      -(screenY / overlay.height) * 2 + 1,
      0.5
    );
    return vector.unproject(camera);
  };

  const drawControlPoints = () => {
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const geom2 = shapeToGeom2(shape);
    const geometries = Array.isArray(geom2) ? geom2 : [geom2];

    geometries.forEach((geometry) => {
      if (!geometry?.sides?.length) return;

      const points = new Set();
      geometry.sides.forEach((side) => {
        points.add(JSON.stringify(side[0]));
        points.add(JSON.stringify(side[1]));
      });

      Array.from(points).forEach((pointStr, i) => {
        const point = JSON.parse(pointStr);
        const screenPos = projectPoint(point[0], point[1], 0);

        if (!controlPoints[i]) {
          controlPoints[i] = {
            worldPos: [point[0], point[1]],
            screenPos: screenPos,
            index: i,
            originalWorldPos: [point[0], point[1]],
          };
        } else {
          controlPoints[i].screenPos = screenPos;
        }

        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
        ctx.fill();
      });
    });
  };

  drawControlPoints();

  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const mousePos = getMousePos(overlay, e);

    selectedPoint = controlPoints.find((point) => {
      const dx = point.screenPos.x - mousePos.x;
      const dy = point.screenPos.y - mousePos.y;
      return Math.sqrt(dx * dx + dy * dy) < 10;
    });

    if (selectedPoint) {
      isDragging = true;
      document.body.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedPoint) return;

    const mousePos = getMousePos(overlay, e);

    const worldPos = unprojectPoint(mousePos.x, mousePos.y);

    selectedPoint.worldPos = [worldPos.x, worldPos.y];

    const geom2 = shapeToGeom2(shape);
    const geometries = Array.isArray(geom2) ? geom2 : [geom2];

    geometries.forEach((geometry) => {
      if (!geometry?.sides?.length) return;

      geometry.sides.forEach((side) => {
        const startStr = JSON.stringify(side[0]);
        if (startStr === JSON.stringify(selectedPoint.originalWorldPos)) {
          side[0] = [worldPos.x, worldPos.y];
        }
        const endStr = JSON.stringify(side[1]);
        if (endStr === JSON.stringify(selectedPoint.originalWorldPos)) {
          side[1] = [worldPos.x, worldPos.y];
        }
      });
    });

    drawControlPoints();

    if (onUpdate) onUpdate(shape);
  };

  const handleMouseUp = () => {
    isDragging = false;
    selectedPoint = null;
    document.body.style.cursor = "";
  };

  const handleResize = () => {
    overlay.width = renderer.domElement.width;
    overlay.height = renderer.domElement.height;
    drawControlPoints();
  };

  overlay.addEventListener("mousedown", handleMouseDown);
  overlay.addEventListener("mousemove", handleMouseMove);
  overlay.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("resize", handleResize);

  return () => {
    overlay.removeEventListener("mousedown", handleMouseDown);
    overlay.removeEventListener("mousemove", handleMouseMove);
    overlay.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("resize", handleResize);
    overlay.remove();
  };
}
