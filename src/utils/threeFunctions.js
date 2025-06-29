import * as jscad from "@jscad/modeling";
import * as THREE from "three";
import earcut from "earcut";
import { isOverlapping } from "./shapeOverlapping";

export function project(p0, camera, ctx) {
  return p0
    .project(camera)
    .multiply(new THREE.Vector3(1, -1, 1))
    .addScalar(1.0)
    .multiplyScalar(0.5)
    .multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1));
}

export function shapeToGeom2(shape) {
  // helper to be extra-sure we always have numbers
  function num(v, fallback = 0) {
    return typeof v === "number" && !isNaN(v) ? v : fallback;
  }

  if (!shape || typeof shape.kind !== "string") {
    console.error("shapeToGeom2: bad shape", shape);
    // empty 1×1 square at origin
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
      // assume your line shapes already encode valid geometry
      return Array.isArray(shape) ? shape : [];
    case "rectangle": {
      const cx = num(shape.x),
        cy = num(shape.y);
      const sx = num(shape.sizeX, 1),
        sy = num(shape.sizeY, 1);
      let rect = jscad.primitives.rectangle({
        center: [cx, cy],
        size: [sx, sy],
      });
      // apply rotation if present
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
      const cx = num(shape.x),
        cy = num(shape.y),
        rot = num(shape.rotation, 0);
      if (!Array.isArray(shape.points) || shape.points.length === 0) {
        return jscad.primitives.rectangle({ center: [cx, cy], size: [1, 1] });
      }
      // rotate around origin then translate
      let pts = shape.points.map(([x, y]) => {
        const px = num(x),
          py = num(y);
        let v = [px, py];
        jscad.maths.vec2.rotate(v, v, [0, 0], jscad.utils.degToRad(rot));
        return [v[0] + cx, v[1] + cy];
      });
      return jscad.geometries.geom2.fromPoints(pts);
    }
    case "photoshape": {
      const cx = num(shape.x),
        cy = num(shape.y),
        rot = num(shape.rotation, 0);
      if (!Array.isArray(shape.polygon) || shape.polygon.length === 0) {
        console.error("shapeToGeom2: bad photoshape.polygon", shape.polygon);
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
      console.error("shapeToGeom2: unsupported kind", shape.kind);
      return jscad.primitives.rectangle({
        center: [num(shape.x), num(shape.y)],
        size: [1, 1],
      });
  }
}
// delete from here is any problem
export function getGeom2Points(shape) {
  const geom = shapeToGeom2(shape);
  // jscad.geometries.geom2.toPoints handles both single‐ and multi‐contour
  return Array.isArray(geom)
    ? geom.flatMap((g) => jscad.geometries.geom2.toPoints(g))
    : jscad.geometries.geom2.toPoints(geom);
}

export function getBoundingBox(shape) {
  let pts = [];
  try {
    pts = jscad.geometries.geom2.toPoints(shapeToGeom2(shape));
  } catch (_) {
    /* ignore */
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
  // if boxes don’t overlap, no shape intersection
  if (
    A.maxX < B.minX ||
    A.minX > B.maxX ||
    A.maxY < B.minY ||
    A.minY > B.maxY
  ) {
    return false;
  }
  // perform real 2D intersection
  let inter = jscad.booleans.intersect(shapeToGeom2(a), shapeToGeom2(b));
  if (Array.isArray(inter)) {
    return inter.some((g) => jscad.geometries.geom2.toPoints(g).length > 0);
  }
  return !!inter && jscad.geometries.geom2.toPoints(inter).length > 0;
}

export function mergeIntoPolygon(a, b) {
  // 1) Union their 2D geoms
  let u = jscad.booleans.union(shapeToGeom2(a), shapeToGeom2(b));
  if (Array.isArray(u)) u = u[0];

  // 2) Build adjacency from every side in u.sides
  const adj = {}; // key -> Set of neighbor keys
  const coord = {}; // key -> [x,y]
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

  // 3) Walk the loop starting from any key
  const keys = Object.keys(adj);
  if (keys.length === 0) {
    console.error("mergeIntoPolygon: no sides!", u);
    return {
      kind: "polygon",
      points: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      rotation: 0,
      x: 0,
      y: 0,
      sizeX: 1,
      sizeY: 1,
      sizeZ: 0,
    };
  }

  const loop = [];
  let start = keys[0],
    prev = null,
    cur = start;
  do {
    loop.push(cur);
    // pick the one neighbor that isn’t the vertex we came from
    const neigh = Array.from(adj[cur]).filter((k) => k !== prev);
    if (neigh.length === 0) break; // dead end
    const next = neigh[0];
    prev = cur;
    cur = next;
  } while (cur !== start);

  // 4) Convert keys back to [x,y]
  const pts = loop.map((k) => coord[k]);

  // 5) Compute bounding box for sizeX/sizeY
  const xs = pts.map((p) => p[0]),
    ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);

  // 6) Return the merged polygon shape
  return {
    kind: "polygon",
    free: true,
    id: `shape-${Date.now()}`,
    points: pts,
    rotation: 0,
    x: 0,
    y: 0,
    sizeX: maxX - minX,
    sizeY: maxY - minY,
    sizeZ: Math.max(a.sizeZ || 0, b.sizeZ || 0),
  };
}

/** Helper: get a shape’s AABB from its geom2 points */

export function shapesIntersect(a, b) {
  // first cheap‐out: if AABBs don't overlap, no intersection
  if (!isOverlapping(a, b)) return false;

  // now true geometry intersect
  let inter = jscad.booleans.intersect(shapeToGeom2(a), shapeToGeom2(b));
  if (Array.isArray(inter)) return inter.length > 0;
  return !!inter;
}

// delete till here
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
  let geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3, false)
  );
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial());
}

// export function geom2ToMesh(geom2) {
//   console.log(geom2, "geom2");
//   let positions = [];
//   for (let line of geom2.sides) {
//     for (let vertex of line) {
//       positions.push(vertex[0]);
//       positions.push(vertex[1]);
//       positions.push(0);
//     }
//   }
//   let indices = earcut(positions, [], 3);
//   let geo = new THREE.BufferGeometry();
//   geo.setAttribute(
//     "position",
//     new THREE.BufferAttribute(new Float32Array(positions), 3, false)
//   );
//   geo.setIndex(indices);
//   geo.computeVertexNormals();
//   return new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
// }

//New Geom 2 mesh function(updated)
export function geom2ToMesh(geom2) {
  let positions = [];
  let indices = [];

  if (Array.isArray(geom2)) {
    // Handle array of geometries
    let indexOffset = 0;
    for (let geometry of geom2) {
      let geoData = processGeometry(geometry);
      positions.push(...geoData.positions);

      // Adjust indices for each geometry in the array
      let geoIndices = geoData.indices.map((idx) => idx + indexOffset);
      indices.push(...geoIndices);

      // Update index offset for the next geometry
      indexOffset += geoData.positions.length / 3;
    }
  } else {
    // Handle single geometry object
    let geoData = processGeometry(geom2);
    positions = geoData.positions;
    indices = geoData.indices;
  }

  let geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3, false)
  );
  geo.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
  geo.computeVertexNormals();

  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
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
// end of new Geom 2 mesh function

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
    let p0 = new THREE.Vector3(...triangle.vertices[0]);
    let p1 = new THREE.Vector3(...triangle.vertices[1]);
    let p2 = new THREE.Vector3(...triangle.vertices[2]);
    let normal = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(p1, p0),
      new THREE.Vector3().subVectors(p2, p0)
    );
    if (normal.lengthSq() > 0.001) {
      normal = normal.normalize();
    }
    points.push(p0, p1, p2);
    normals.push(normal, normal, normal);
  }

  // slow
  //normals = smoothNormals(points);

  let flatNormals = [];
  for (let normal of normals) {
    flatNormals.push(...normal.toArray());
  }

  let geo = new THREE.BufferGeometry();
  geo.setFromPoints(points);
  geo.setAttribute(
    "normal",
    new THREE.BufferAttribute(new Float32Array(flatNormals), 3, false)
  );
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
}

// if in future get any error regarding array of object try this function instead

// export function geom3ToMesh(geom3) {
//   let points = [];
//   let normals = [];

//   // Check if geom3 is an array or a single object
//   if (Array.isArray(geom3)) {
//     // If it's an array, process each object in the array
//     for (let geometry of geom3) {
//       let { geoPoints, geoNormals } = processGeom3(geometry);
//       points.push(...geoPoints);
//       normals.push(...geoNormals);
//     }
//   } else {
//     // If it's a single object, process it directly
//     let { geoPoints, geoNormals } = processGeom3(geom3);
//     points = geoPoints;
//     normals = geoNormals;
//   }

//   // Flatten normals for buffer attribute
//   let flatNormals = [];
//   for (let normal of normals) {
//     flatNormals.push(...normal.toArray());
//   }

//   let geo = new THREE.BufferGeometry();
//   geo.setFromPoints(points);
//   geo.setAttribute(
//     "normal",
//     new THREE.BufferAttribute(new Float32Array(flatNormals), 3, false)
//   );
//   return new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
// }

// // Helper function to process individual geom3 object
// function processGeom3(geometry) {
//   let points = [];
//   let normals = [];

//   // Generalize the geometry with triangulation
//   geometry = jscad.modifiers.generalize(
//     {
//       triangulate: true,
//     },
//     geometry
//   );

//   // Process each triangle and calculate points and normals
//   for (let triangle of geometry.polygons) {
//     let p0 = new THREE.Vector3(...triangle.vertices[0]);
//     let p1 = new THREE.Vector3(...triangle.vertices[1]);
//     let p2 = new THREE.Vector3(...triangle.vertices[2]);
//     let normal = new THREE.Vector3().crossVectors(
//       new THREE.Vector3().subVectors(p1, p0),
//       new THREE.Vector3().subVectors(p2, p0)
//     );
//     if (normal.lengthSq() > 0.001) {
//       normal = normal.normalize();
//     }
//     points.push(p0, p1, p2);
//     normals.push(normal, normal, normal);
//   }

//   return { geoPoints: points, geoNormals: normals };
// }

export function mouseOverShape(
  shape,
  mouseRayPlaneIntersection,
  pointInsidePolygon
) {
  if (shape.kind == "circle") {
    let shapeCenter = new THREE.Vector2(shape.x, shape.y);
    if (shapeCenter.distanceTo(mouseRayPlaneIntersection) < shape.radius) {
      return true;
    }
  } else if (shape.kind == "rectangle") {
    let shapeBox = new THREE.Box2(
      new THREE.Vector2(shape.x - shape.sizeX / 2, shape.y - shape.sizeY / 2),
      new THREE.Vector2(shape.x + shape.sizeX / 2, shape.y + shape.sizeY / 2)
    );
    let v = mouseRayPlaneIntersection;
    v = v.clone();
    v = v.rotateAround(
      new THREE.Vector2(shape.x, shape.y),
      jscad.utils.degToRad(-shape.rotation)
    );
    if (shapeBox.containsPoint(v)) {
      return true;
    }
  } else if (shape.kind == "photoshape") {
    let v = mouseRayPlaneIntersection;
    // change of function for multiple shapes coming at once
    // Assuming shape.polygon is an array of polygons, each a list of vertices
    let polygons = shape.polygon.map((polygon) => {
      // Rotate each vertex in the polygon
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
    // let polygon = shape.polygon
    //   .map(([x, y]) => [x, y])
    //   .map((v) =>
    //     jscad.maths.vec2.rotate(
    //       v,
    //       v,
    //       [0, 0],
    //       jscad.utils.degToRad(shape.rotation)
    //     )
    //   );
    // polygon = polygon.map(([x, y]) => [x + shape.x, y + shape.y]);
    // return pointInsidePolygon([v.x, v.y], polygon);
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

// draw outline function before converting to 2d
// export function drawOutline(shape, style, width, z, ctx, camera, display2D) {
//   ctx.lineWidth = width;
//   ctx.strokeStyle = style;

//   let geom2 = shapeToGeom2(shape);

//   // Check if geom2 is an array or a single object
//   if (Array.isArray(geom2)) {
//     // Handle array of geometries
//     for (let geom of geom2) {
//       drawGeometry(geom, z, ctx, camera);
//     }
//   } else {
//     // Handle single geometry object
//     drawGeometry(geom2, z, ctx, camera);
//   }

//   function drawGeometry(geometry, z, ctx, camera) {
//     ctx.beginPath();
//     let line = geometry?.sides[0];
//     if (line) {
//       let p0 = project(
//         new THREE.Vector3(line[0][0], line[0][1], z),
//         camera,
//         ctx
//       );
//       ctx.moveTo(p0.x, p0.y);

//       for (let line of geometry.sides) {
//         let p1 = project(
//           new THREE.Vector3(line[1][0], line[1][1], z),
//           camera,
//           ctx
//         );
//         ctx.lineTo(p1.x, p1.y);
//       }

//       // Close the path by connecting to the first point
//       let firstLine = geometry.sides[0];
//       let p0x = project(
//         new THREE.Vector3(firstLine[0][0], firstLine[0][1], z),
//         camera,
//         ctx
//       );
//       ctx.lineTo(p0x.x, p0x.y);

//       ctx.stroke();
//     }
//   }
// }
// Modified drawOutline function
export function drawOutline(
  shape,
  style,
  width,
  z,
  ctx,
  camera,
  display2D, // This flag controls dot visibility
  renderer,
  selected, // Your selected shape object
  scene,
  displayDot,
  numSamples
) {
  ctx.lineWidth = width;
  ctx.strokeStyle = style;

  const geom2 = shapeToGeom2(shape);
  const geometries = Array.isArray(geom2) ? geom2 : [geom2];

  // Check if we should show control points
  const showControlPoints = display2D && displayDot;

  geometries.forEach((geometry) => {
    if (!geometry?.sides?.length) return;

    ctx.beginPath();

    // Get first point
    const firstPoint = geometry.sides[0][0];
    let p0 = projectPoint(firstPoint[0], firstPoint[1], z, camera, renderer);
    ctx.moveTo(p0.x, p0.y);

    // Draw subsequent points
    geometry.sides.forEach((line) => {
      const point = line[1];
      const p1 = projectPoint(point[0], point[1], z, camera, renderer);
      ctx.lineTo(p1.x, p1.y);
    });

    // Close path
    ctx.lineTo(p0.x, p0.y);
    ctx.stroke();

    // If control points should be displayed, add or remove them
    if (showControlPoints) {
      // Remove existing control points from the scene if they exist
      if (shape.controlPoints) {
        shape.controlPoints.forEach((pointObj) => {
          scene.remove(pointObj);
        });
      }

      // // Use Set to avoid duplicate points
      // const uniquePoints = new Set(
      //   geometry.sides
      //     .flatMap((side) => [side[0], side[1]])
      //     .map((point) => JSON.stringify(point))
      // );

      // // Store control points in the shape object for later removal
      // shape.controlPoints = [];

      // // Create THREE.Points for control points
      // const positions = [];
      // uniquePoints.forEach((pointStr) => {
      //   const point = JSON.parse(pointStr);
      //   positions.push(point[0], point[1], z);
      // });

      shape.controlPoints = [];
      const positions = [];

      geometry.sides.forEach((side) => {
        const p1 = side[0];
        const p2 = side[1];

        // const numSamples = 2; // Increase this for more dots
        for (let i = 0; i <= numSamples; i++) {
          const t = i / numSamples;
          const x = p1[0] + (p2[0] - p1[0]) * t;
          const y = p1[1] + (p2[1] - p1[1]) * t;
          positions.push(x, y, z);
        }
      });

      const pointsGeometry = new THREE.BufferGeometry();
      pointsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      const pointsMaterial = new THREE.PointsMaterial({
        // color: 0xff0000, // change the color of the dot to red
        color: 0x00ffff,
        size: 7,
        sizeAttenuation: false,
      });

      const points = new THREE.Points(pointsGeometry, pointsMaterial);
      scene.add(points);
      shape.controlPoints.push(points); // Store the point object for later removal

      setupControlPointInteractions(
        shape,
        scene,
        camera,
        renderer,
        display2D,
        displayDot
      );
    } else {
      // If control points are not shown, remove them from the scene
      if (shape.controlPoints) {
        shape.controlPoints.forEach((pointObj) => {
          scene.remove(pointObj);
        });
        shape.controlPoints = []; // Clear the array of control points
      }
    }
  });
}

function setupControlPointInteractions(shape, scene, camera, renderer) {
  const state = {
    isDragging: false,
    selectedPoint: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    originalPoints: [...shape.points], // Store initial points
  };

  // Create overlay div
  const controlPointOverlay = document.createElement("div");
  Object.assign(controlPointOverlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "10000",
    pointerEvents: "none",
    opacity: "0",
    cursor: "default",
  });
  document.body.appendChild(controlPointOverlay);

  // Convert screen coordinates
  function getMouseCoordinates(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
  }

  // Create visual indicators and map control points to shape points
  shape.controlPoints.forEach((point, index) => {
    const indicator = document.createElement("div");
    Object.assign(indicator.style, {
      position: "absolute",
      width: "20px",
      height: "20px",
      background: "rgba(255,0,0,0.3)",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
    });
    controlPointOverlay.appendChild(indicator);

    point.userData = {
      indicator,
      pointIndex: index, // Maps to shape.points array
      updatePosition: () => {
        const vector = point.position.clone().project(camera);
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
        indicator.style.left = `${x}px`;
        indicator.style.top = `${y}px`;
      },
    };
  });

  // Mouse down handler
  function onMouseDown(event) {
    const coords = getMouseCoordinates(event);
    state.mouse.set(coords.x, coords.y);
    state.raycaster.setFromCamera(state.mouse, camera);

    const intersects = state.raycaster.intersectObjects(shape.controlPoints);
    if (intersects.length > 0) {
      event.preventDefault();
      state.isDragging = true;
      state.selectedPoint = intersects[0].object;

      // Log initial points
      console.group("Initial Points");
      console.log("Before editing:", JSON.parse(JSON.stringify(shape.points)));
      console.groupEnd();

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  }

  // Mouse move handler
  function onMouseMove(event) {
    if (!state.isDragging || !state.selectedPoint) return;

    const coords = getMouseCoordinates(event);
    state.mouse.set(coords.x, coords.y);
    state.raycaster.setFromCamera(state.mouse, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const newPosition = new THREE.Vector3();
    state.raycaster.ray.intersectPlane(plane, newPosition);

    // Update control point position
    state.selectedPoint.position.copy(newPosition);

    // Update corresponding point in shape.points array
    const pointIndex = state.selectedPoint.userData.pointIndex;
    shape.points[pointIndex] = [newPosition.x, newPosition.y];

    // Update visual indicator
    if (state.selectedPoint.userData.updatePosition) {
      state.selectedPoint.userData.updatePosition();
    }

    // Update shape geometry
    updateShapeGeometry(shape, state.selectedPoint, newPosition);
  }

  function updateShapeGeometry(shape, controlPoint, newPosition) {
    const pointIndex = controlPoint.userData.pointIndex;

    if (shape.geometry?.attributes?.position) {
      const positions = shape.geometry.attributes.position.array;
      positions[pointIndex * 3] = newPosition.x;
      positions[pointIndex * 3 + 1] = newPosition.y;
      positions[pointIndex * 3 + 2] = newPosition.z;

      shape.geometry.attributes.position.needsUpdate = true;
      if (shape.geometry.index) shape.geometry.computeVertexNormals();
    }
  }

  // Mouse up handler
  function onMouseUp() {
    if (state.isDragging) {
      // Log final points
      console.group("Final Points");
      console.log("After editing:", JSON.parse(JSON.stringify(shape.points)));
      console.log(
        "Changes:",
        getChangedPoints(state.originalPoints, shape.points)
      );
      console.groupEnd();

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      state.isDragging = false;
      state.selectedPoint = null;
    }
  }

  // Helper to show changed points
  function getChangedPoints(original, updated) {
    return original
      .map((point, index) => {
        const [origX, origY] = point;
        const [updatedX, updatedY] = updated[index];
        return {
          point: index,
          original: [origX, origY],
          updated: [updatedX, updatedY],
          changed: origX !== updatedX || origY !== updatedY,
        };
      })
      .filter((p) => p.changed);
  }

  function onDocumentMouseMove(event) {
    const coords = getMouseCoordinates(event);
    state.mouse.set(coords.x, coords.y);
    state.raycaster.setFromCamera(state.mouse, camera);

    const intersects = state.raycaster.intersectObjects(shape.controlPoints);

    if (intersects.length > 0) {
      controlPointOverlay.style.pointerEvents = "auto"; // allow dragging
      controlPointOverlay.style.cursor = "move"; // show move cursor
    } else {
      controlPointOverlay.style.pointerEvents = "none"; // allow clicking buttons
      controlPointOverlay.style.cursor = "default"; // normal cursor
    }
  }

  window.addEventListener("mousemove", onDocumentMouseMove);

  // Animation loop
  function updateIndicators() {
    shape.controlPoints.forEach((point) => {
      if (point.userData.updatePosition) {
        point.userData.updatePosition();
      }
    });
    requestAnimationFrame(updateIndicators);
  }
  updateIndicators();

  // Event listeners
  controlPointOverlay.addEventListener("mousedown", onMouseDown);
  controlPointOverlay.addEventListener(
    "touchstart",
    (e) => {
      onMouseDown(e.touches[0]);
    },
    { passive: false }
  );

  // Cleanup
  shape.cleanup = () => {
    cancelAnimationFrame(updateIndicators);
    controlPointOverlay.removeEventListener("mousedown", onMouseDown);
    controlPointOverlay.removeEventListener("touchstart", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    document.body.removeChild(controlPointOverlay);
  };
}
// Unified projection function
function projectPoint(x, y, z, camera, renderer) {
  const vector = new THREE.Vector3(x, y, z);
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

  // Calculate canvas center
  const canvasCenterX = ctx.canvas.width / 2;
  const canvasCenterY = ctx.canvas.height / 2;

  // Calculate the shape's bounding box center
  const shapeCenterX = shape.sizeX / 2;
  const shapeCenterY = shape.sizeY / 2;

  // Offset to move the shape's center to the canvas center
  const offsetX = canvasCenterX - shapeCenterX;
  const offsetY = canvasCenterY - shapeCenterY;

  // Modify the transformation function to include centering offset
  // function transform(v) {
  //   // Center the shape by subtracting half of sizeX and sizeY
  //   const centeredV = v
  //     .sub(new THREE.Vector3(shape.sizeX / 2, shape.sizeY / 2, 0)) // Move shape center to (0,0)
  //     .applyAxisAngle(
  //       new THREE.Vector3(0, 0, 1),
  //       jscad.utils.degToRad(shape?.rotation)
  //     )
  //     .add(new THREE.Vector3(offsetX, offsetY, 0)); // Center on canvas

  //   return project(centeredV, camera, ctx);
  // }

  function transform(v, is2DMode, object, shape) {
    const clonedV = v.clone();

    if (is2DMode) {
      // Use offsetX/Y directly from the outer scope
      clonedV
        .sub(new THREE.Vector3(shape.sizeX / 2, shape.sizeY / 2, 0))
        .applyAxisAngle(
          new THREE.Vector3(0, 0, 1),
          jscad.utils.degToRad(shape?.rotation || 0)
        )
        .add(new THREE.Vector3(offsetX, offsetY, 0)); // Direct access
    } else {
      clonedV.applyMatrix4(object.matrixWorld);
    }

    return project(clonedV, camera, ctx);
  }

  // Draw depth line if it's a depth panel
  if (currPanel.id.endsWith("-depth-panel")) {
    ctx.beginPath();
    let p0 = transform(new THREE.Vector3(shape.x, shape.y, 37 * centimeters));
    let p1 = transform(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ)
    );
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  // Draw depth text if it's a depth panel
  if (currPanel.id.endsWith("-depth-panel")) {
    let p0 = transform(new THREE.Vector3(shape.x, shape.y, 37 * centimeters));
    let p1 = transform(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ)
    );
    let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = "bold " + 20 * window.devicePixelRatio + "px sans-serif";

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
        .sub(new THREE.Vector3(shape.x, shape.y, 0))
        .applyAxisAngle(
          new THREE.Vector3(0, 0, 1),
          jscad.utils.degToRad(shape.rotation)
        )
        .add(new THREE.Vector3(shape.x, shape.y, 0)),
      camera,
      ctx
    );
  }

  // depth line
  if (currPanel.id.endsWith("-depth-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new THREE.Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new THREE.Vector3(
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
  // width line
  if (currPanel.id.endsWith("-resize-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new THREE.Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new THREE.Vector3(
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
  // height line
  if (currPanel.id.endsWith("-resize-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new THREE.Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new THREE.Vector3(
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

  // depth text
  if (currPanel.id.endsWith("-depth-panel")) {
    let p0 = transform(
      new THREE.Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new THREE.Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters - shape.sizeZ
      ),
      camera
    );
    let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = "bold " + 20 * window.devicePixelRatio + "px sans-serif";

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
  // width text
  if (currPanel.id.endsWith("-resize-panel")) {
    let p0 = transform(
      new THREE.Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new THREE.Vector3(
        shape.x + shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = "bold " + 20 * window.devicePixelRatio + "px sans-serif";

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeX.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeX.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
  // height text
  if (currPanel.id.endsWith("-resize-panel")) {
    let p0 = transform(
      new THREE.Vector3(
        shape.x - shape.sizeX / 2,
        shape.y - shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let p1 = transform(
      new THREE.Vector3(
        shape.x - shape.sizeX / 2,
        shape.y + shape.sizeY / 2,
        37 * centimeters
      ),
      camera
    );
    let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = "bold " + 20 * window.devicePixelRatio + "px sans-serif";

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

  function transform(v, camera) {
    return project(
      v
        .sub(new THREE.Vector3(shape?.x, shape?.y, 0))
        .applyAxisAngle(
          new THREE.Vector3(0, 0, 1),
          jscad.utils.degToRad(shape?.rotation)
        )
        .add(new THREE.Vector3(shape?.x, shape?.y, 0)),
      camera,
      ctx
    );
  }

  // depth line
  if (currPanel.id.endsWith("-depth-panel")) {
    ctx.beginPath();
    let p0 = transform(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters),
      camera
    );
    let p1 = transform(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ),
      camera
    );
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  // depth text
  if (currPanel.id.endsWith("-depth-panel")) {
    let p0 = transform(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters),
      camera
    );
    let p1 = transform(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ),
      camera
    );
    let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = "bold " + 20 * window.devicePixelRatio + "px sans-serif";

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
  // points
  {
    let p0 = project(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    let p1 = project(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ),
      camera,
      ctx
    );
    let p2 = project(
      new THREE.Vector3(shape.x + shape.radius, shape.y, 37 * centimeters),
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

  // depth line
  if (currPanel.id.endsWith("depth-panel")) {
    ctx.beginPath();
    let p0 = project(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    ctx.moveTo(p0.x, p0.y);
    let p1 = project(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ),
      camera,
      ctx
    );
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  // radius line
  if (currPanel.id.endsWith("radius-panel")) {
    ctx.beginPath();
    let p0 = project(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    ctx.moveTo(p0.x, p0.y);
    let p1 = project(
      new THREE.Vector3(shape.x + shape.radius, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  // depth text
  if (currPanel.id.endsWith("depth-panel")) {
    let p0 = project(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    let p1 = project(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters - shape.sizeZ),
      camera,
      ctx
    );
    let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = "bold " + 20 * window.devicePixelRatio + "px sans-serif";

    ctx.textAlign = "left";
    ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }

  // radius text
  if (currPanel.id.endsWith("radius-panel")) {
    let p0 = project(
      new THREE.Vector3(shape.x, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    let p1 = project(
      new THREE.Vector3(shape.x + shape.radius, shape.y, 37 * centimeters),
      camera,
      ctx
    );
    let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2);
    ctx.font = "bold " + 20 * window.devicePixelRatio + "px sans-serif";

    ctx.textAlign = "center";
    ctx.fillText(shape.radius.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "black";
    ctx.strokeText(shape.radius.toFixed(0) + "mm", pMid.x, pMid.y);
    ctx.strokeStyle = "orange";
  }
}

// export function drawMeasurementsLine(shape, ctx, camera) {
//   ctx.strokeStyle = shape.color || "black";
//   ctx.beginPath();

//   function transform(x, y, camera) {
//     return project(new THREE.Vector3(x, y, 0), camera, ctx);
//   }

//   let startPoint = transform(shape.startX, shape.startY, camera);
//   let endPoint = transform(shape.endX, shape.endY, camera);

//   ctx.moveTo(startPoint.x, startPoint.y);
//   ctx.lineTo(endPoint.x, endPoint.y);
//   ctx.stroke();
// }

export function drawMeasurementsLine(shape, ctx, camera, centimeters) {
  ctx.strokeStyle = shape.color || "blue";
  ctx.lineWidth = shape.thickness;

  let p0 = project(
    new THREE.Vector3(shape.startX, shape.startY, 37 * centimeters),
    camera,
    ctx
  );
  let p1 = project(
    new THREE.Vector3(shape.endX, shape.endY, 37 * centimeters),
    camera,
    ctx
  );

  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
}

export function drawCircle(shape, ctx, camera, centimeters) {
  ctx.fillStyle = "red";

  // function project(p0, camera, ctx, centimeters) {
  //   return new THREE.Vector3(p0.x, p0.y, 37 * centimeters)
  //     .project(camera)
  //     .addScalar(1.0)
  //     .multiplyScalar(0.5)
  //     .multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1));
  // }

  // function project(p0, camera, ctx, centimeters) {
  //   return p0
  //     .project(camera)
  //     .multiply(new THREE.Vector3(p0.x, p0.y, 37 * centimeters))
  //     .addScalar(1.0)
  //     .multiplyScalar(0.5)
  //     .multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1));
  // }

  // Project the normalized mouse coordinates into 3D space
  // let center = project(
  //   new THREE.Vector3(shape.x, shape.y, 37 * centimeters),
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
    .multiply(new THREE.Vector3(1, -1, 0))
    .addScalar(1)
    .divideScalar(2)
    .multiply(
      new THREE.Vector3(
        ctx.domElement.clientWidth,
        ctx.domElement.clientHeight,
        0
      )
    );
}

// Selectively smooth normals
function smoothNormals(points) {
  // Triangle count
  let n = points.length / 3;

  // Calculate face normals for each vertex
  let faceNormals = [];
  for (let i = 0; i < n; i++) {
    let p0 = points[i * 3 + 0];
    let p1 = points[i * 3 + 1];
    let p2 = points[i * 3 + 2];
    let normal = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(p1, p0),
      new THREE.Vector3().subVectors(p2, p0)
    );
    faceNormals.push(normal, normal, normal);
  }

  // Calculate face normal weights for each vertex
  // (https://stackoverflow.com/a/45496726)
  let faceNormalWeights = [];
  for (let i = 0; i < n; i++) {
    let p0 = points[i * 3 + 0];
    let p1 = points[i * 3 + 1];
    let p2 = points[i * 3 + 2];
    let a0 = new THREE.Vector3()
      .subVectors(p1, p0)
      .angleTo(new THREE.Vector3().subVectors(p2, p0));
    let a1 = new THREE.Vector3()
      .subVectors(p2, p1)
      .angleTo(new THREE.Vector3().subVectors(p0, p1));
    let a2 = new THREE.Vector3()
      .subVectors(p0, p2)
      .angleTo(new THREE.Vector3().subVectors(p1, p2));
    faceNormalWeights.push(a0, a1, a2);
  }

  // For each vertex store list of normals to later average
  let smoothNormals = [];
  for (let i = 0; i < n * 3; i++) {
    smoothNormals.push([
      faceNormals[i].clone().multiplyScalar(faceNormalWeights[i]),
    ]);
  }

  // For every pair of vertices
  for (let i = 0; i < n * 3 - 1; i++) {
    for (let j = i + 1; j < n * 3; j++) {
      // Skip if angle between their faces too big
      let angleLimit = 30;
      if (
        faceNormals[i]
          .clone()
          .normalize()
          .dot(faceNormals[j].clone().normalize()) <
        Math.cos(THREE.MathUtils.degToRad(angleLimit))
      ) {
        continue;
      }
      // Skip if not same position
      if (points[i].distanceTo(points[j]) > 0.001) {
        continue;
      }
      // Add the face normal of one to the smooth list of the other
      smoothNormals[i].push(
        faceNormals[j].clone().multiplyScalar(faceNormalWeights[j])
      );
      smoothNormals[j].push(
        faceNormals[i].clone().multiplyScalar(faceNormalWeights[i])
      );
    }
  }

  // Add up and normalize the normals from the smooth lists
  return smoothNormals.map((ns) => {
    let nn = new THREE.Vector3(0, 0, 0);
    ns.forEach((n) => nn.add(n));
    nn = nn.normalize();
    return nn;
  });
}

export function createEditor(shape, camera, renderer, onUpdate) {
  const controlPoints = [];
  let selectedPoint = null;
  let isDragging = false;

  // Create overlay canvas for control points
  const overlay = document.createElement("canvas");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.pointerEvents = "auto";
  overlay.width = renderer.domElement.width;
  overlay.height = renderer.domElement.height;
  renderer.domElement.parentElement.appendChild(overlay);
  const ctx = overlay.getContext("2d");

  // Same projection as drawOutline
  const projectPoint = (x, y, z) => {
    const vector = new THREE.Vector3(x, y, z);
    vector.project(camera);
    return {
      x: (vector.x * 0.5 + 0.5) * overlay.width,
      y: -(vector.y * 0.5 - 0.5) * overlay.height,
    };
  };

  // Convert screen to world coordinates
  const unprojectPoint = (screenX, screenY) => {
    const vector = new THREE.Vector3(
      (screenX / overlay.width) * 2 - 1,
      -(screenY / overlay.height) * 2 + 1,
      0.5
    );
    return vector.unproject(camera);
  };

  // Draw all control points
  const drawControlPoints = () => {
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const geom2 = shapeToGeom2(shape);
    const geometries = Array.isArray(geom2) ? geom2 : [geom2];

    geometries.forEach((geometry) => {
      if (!geometry?.sides?.length) return;

      // Store all unique points
      const points = new Set();
      geometry.sides.forEach((side) => {
        points.add(JSON.stringify(side[0]));
        points.add(JSON.stringify(side[1]));
      });

      // Draw each point
      Array.from(points).forEach((pointStr, i) => {
        const point = JSON.parse(pointStr);
        const screenPos = projectPoint(point[0], point[1], 0);

        // Store in controlPoints array
        if (!controlPoints[i]) {
          controlPoints[i] = {
            worldPos: point,
            screenPos: screenPos,
            index: i,
          };
        } else {
          controlPoints[i].screenPos = screenPos;
        }

        // Draw red dot
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
        ctx.fill();
      });
    });
  };

  // Initial draw
  drawControlPoints();

  // Mouse event handlers
  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const mousePos = getMousePos(overlay, e);

    // Find clicked point
    selectedPoint = controlPoints.find((point) => {
      const dx = point.screenPos.x - mousePos.x;
      const dy = point.screenPos.y - mousePos.y;
      return Math.sqrt(dx * dx + dy * dy) < 10; // 10px hit radius
    });

    if (selectedPoint) {
      isDragging = true;
      document.body.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedPoint) return;

    const mousePos = getMousePos(overlay, e);

    // Convert screen to world coordinates
    const worldPos = unprojectPoint(mousePos.x, mousePos.y);

    // Update shape point
    selectedPoint.worldPos = [worldPos.x, worldPos.y];

    // Update the actual shape data
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

    // Redraw
    drawControlPoints();

    // Notify parent of changes
    if (onUpdate) onUpdate(shape);
  };

  const handleMouseUp = () => {
    isDragging = false;
    selectedPoint = null;
    document.body.style.cursor = "";
  };

  // Handle window resize
  const handleResize = () => {
    overlay.width = renderer.domElement.width;
    overlay.height = renderer.domElement.height;
    drawControlPoints();
  };

  // Add event listeners
  overlay.addEventListener("mousedown", handleMouseDown);
  overlay.addEventListener("mousemove", handleMouseMove);
  overlay.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("resize", handleResize);

  // Cleanup function
  return () => {
    overlay.removeEventListener("mousedown", handleMouseDown);
    overlay.removeEventListener("mousemove", handleMouseMove);
    overlay.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("resize", handleResize);
    overlay.remove();
  };
}
