import * as jscad from "@jscad/modeling";
import * as THREE from "three";
import * as earcut from "earcut";

export function project(p0, camera, ctx) {
  return p0
    .project(camera)
    .multiply(new THREE.Vector3(1, -1, 1))
    .addScalar(1.0)
    .multiplyScalar(0.5)
    .multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1));
}

export function shapeToGeom2(shape) {
  switch (shape?.kind) {
    case "circle":
      return jscad.primitives.circle({
        center: [shape.x, shape.y],
        radius: shape.radius,
        segments: 20,
      });
    case "line":
      return shape;
    case "rectangle":
      let rect = jscad.primitives.rectangle({
        center: [shape.x, shape.y],
        size: [shape.sizeX, shape.sizeY],
      });
      for (let side of rect.sides) {
        for (let vert of side) {
          jscad.maths.vec2.rotate(
            vert,
            vert,
            [shape.x, shape.y],
            jscad.utils.degToRad(shape.rotation)
          );
        }
      }
      return rect;
    case "polygon":
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
      return jscad.geometries.geom2.fromPoints(polygon);
    case "photoshape":
      let photoshapePolygon = shape.polygon
        .map(([x, y]) => [x, y])
        .map((v) =>
          jscad.maths.vec2.rotate(
            v,
            v,
            [0, 0],
            jscad.utils.degToRad(shape.rotation)
          )
        );
      photoshapePolygon = photoshapePolygon.map(([x, y]) => [
        x + shape.x,
        y + shape.y,
      ]);
      return jscad.geometries.geom2.fromPoints(photoshapePolygon);
  }
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
  let geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3, false)
  );
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial());
}

export function geom2ToMesh(geom2) {
  let positions = [];
  for (let line of geom2.sides) {
    for (let vertex of line) {
      positions.push(vertex[0]);
      positions.push(vertex[1]);
      positions.push(0);
    }
  }
  let indices = earcut(positions, [], 3);
  let geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3, false)
  );
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
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
    let polygon = shape.polygon
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

export function drawOutline(shape, style, width, z, ctx, camera) {
  ctx.lineWidth = width;
  ctx.strokeStyle = style;

  let geom2 = shapeToGeom2(shape);
  ctx.beginPath();
  let line = geom2?.sides[0];
  let p0 = project(new THREE.Vector3(line[0][0], line[0][1], z), camera, ctx);
  ctx.moveTo(p0.x, p0.y);
  for (let line of geom2?.sides) {
    let p1 = project(new THREE.Vector3(line[0][0], line[0][1], z), camera, ctx);
    ctx.lineTo(p1.x, p1.y);
  }
  ctx.lineTo(p0.x, p0.y);
  ctx.stroke();
}

export function drawMeasurementsPhotoshape(
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
