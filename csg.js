import * as jscad from "@jscad/modeling";

const CORNER_SEGMENTS = 16;

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

function shapeToGeom2(shape) {
  switch (shape.kind) {
    case "circle":
      return jscad.primitives.circle({
        center: [shape.x, shape.y],
        radius: shape.radius,
        segments: 20,
      });
    case "line":
      return shape;
    case "rectangle": {
      const sx = shape.sizeX;
      const sy = shape.sizeY;
      const radius = clampCornerRadius(sx, sy, shape.cornerRadius || 0);
      let rect =
        radius > 0
          ? jscad.primitives.roundedRectangle({
            center: [shape.x, shape.y],
            size: [sx, sy],
            roundRadius: radius,
            segments: CORNER_SEGMENTS,
          })
          : jscad.primitives.rectangle({
            center: [shape.x, shape.y],
            size: [sx, sy],
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
    }
    case "photoshape":
      if (Array.isArray(shape.polygon) && Array.isArray(shape.polygon[0])) {
        let polygons = shape.polygon
          .map((contour, index) => {
            if (!Array.isArray(contour)) {
              console.error(
                `Contour at index ${index} is not an array:`,
                contour
              );
              return null;
            }

            let polygon = contour
              .reverse()
              .map(([x, y]) => [x, y])
              .map((v) =>
                jscad.maths.vec2.rotate(
                  v,
                  v,
                  [0, 0],
                  jscad.utils.degToRad(shape.rotation)
                )
              )
              .map(([x, y]) => [x + shape.x, y + shape.y]);

            return jscad.geometries.geom2.fromPoints(polygon);
          })
          .filter(Boolean);

        return polygons;
      } else {
        console.error(
          "Expected an array of arrays for shape.polygon, but got:",
          shape.polygon
        );
        return [];
      }
    case "polygon":
      let newShape = shape.free ? shape.points.slice().reverse() : shape.points;
      let poly = newShape
        .map(([x, y]) => [x, y])
        .map((v) =>
          jscad.maths.vec2.rotate(
            v,
            v,
            [0, 0],
            jscad.utils.degToRad(shape.rotation)
          )
        );
      poly = poly.map(([x, y]) => [x + shape.x, y + shape.y]);
      return roundGeom2(
        jscad.geometries.geom2.fromPoints(poly),
        shape?.source === "photoshape" ? 0 : shape.cornerRadius || 0
      );
  }
}

function shapeToGeom3(shape) {
  let geom2 = shapeToGeom2(shape);
  return jscad.extrusions.extrudeLinear(
    {
      height: shape.sizeZ,
    },
    geom2
  );
}

onmessage = (e) => {
  let { id, foam, shapesArray } = e.data;
  let geom3s = [shapeToGeom3(foam)];
  for (let shape of shapesArray) {
    let geom3 = shapeToGeom3(shape);
    geom3 = jscad.transforms.translateZ(foam.sizeZ - shape.sizeZ, geom3);
    geom3s.push(geom3);
  }
  const result = jscad.booleans.subtract(geom3s);
  postMessage({ id, geom: result });
};

export { };
