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

function polygonArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  }
  return area / 2;
}

function normalizePolygonPoints(points) {
  const clean = [];

  for (const point of points) {
    if (!Array.isArray(point) || point.length < 2) continue;

    const [x, y] = point;
    if (!clean.length) {
      clean.push([x, y]);
      continue;
    }

    const last = clean[clean.length - 1];
    if (last[0] !== x || last[1] !== y) {
      clean.push([x, y]);
    }
  }

  if (clean.length > 1) {
    const first = clean[0];
    const last = clean[clean.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) {
      clean.pop();
    }
  }

  if (polygonArea(clean) < 0) {
    clean.reverse();
  }

  return clean;
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
              .slice()
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
    case "polygon": {
      if (!Array.isArray(shape.points) || shape.points.length < 3) return null;

      const basePts = normalizePolygonPoints(
        shape.points.map(([x, y]) => [x, y])
      );

      if (basePts.length < 3 || Math.abs(polygonArea(basePts)) < 1e-6) {
        return null;
      }

      try {
        const poly = basePts
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

        return jscad.geometries.geom2.fromPoints(poly);
      } catch {
        return null;
      }
    }
  }

}

function shapeToGeom3(shape) {
  let geom2 = shapeToGeom2(shape);

  if (!geom2) return null;
  if (Array.isArray(geom2)) {
    geom2 = geom2.filter((g) => g?.sides?.length);
    if (!geom2.length) return null;
  } else if (!geom2.sides || !geom2.sides.length) {
    return null;
  }

  try {
    return jscad.extrusions.extrudeLinear(
      {
        height: shape.sizeZ,
      },
      geom2
    );
  } catch {
    return null;
  }
}

onmessage = (e) => {
  const { id, foam, shapesArray } = e.data;

  const foamGeom3 = shapeToGeom3(foam);
  if (!foamGeom3) {
    postMessage({ id, geom: null });
    return;
  }

  const cutters = [];
  for (const shape of shapesArray) {
    if (shape?.source === "photoshape" && shape?._draft) continue;

    let geom3 = shapeToGeom3(shape);
    if (!geom3) continue;
    geom3 = jscad.transforms.translateZ(foam.sizeZ - shape.sizeZ, geom3);
    cutters.push(geom3);
  }

  if (cutters.length === 0) {
    postMessage({ id, geom: foamGeom3 });
    return;
  }

  try {
    const result = jscad.booleans.subtract(foamGeom3, ...cutters);
    postMessage({ id, geom: result || foamGeom3 });
  } catch (err) {
    console.error("CSG subtract failed:", err);
    postMessage({ id, geom: foamGeom3 });
  }
};


export { };
