import * as jscad from "@jscad/modeling";

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
    case "photoshape":
      if (Array.isArray(shape.polygon) && Array.isArray(shape.polygon[0])) {
        // Process each contour (polygon) individually
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
          .filter(Boolean); // Remove any null values from error handling

        return polygons;
      } else {
        console.error(
          "Expected an array of arrays for shape.polygon, but got:",
          shape.polygon
        );
        return []; // Return an empty array if the format is incorrect
      }

    // case "photoshape":
    //   let polygon = shape.polygon
    //     .reverse()
    //     .map(([x, y]) => [x, y])
    //     .map((v) =>
    //       jscad.maths.vec2.rotate(
    //         v,
    //         v,
    //         [0, 0],
    //         jscad.utils.degToRad(shape.rotation)
    //       )
    //     );
    //   polygon = polygon.map(([x, y]) => [x + shape.x, y + shape.y]);
    //   return jscad.geometries.geom2.fromPoints(polygon);
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
      return jscad.geometries.geom2.fromPoints(poly);
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
  let { foam, shapesArray } = e.data;
  let geom3s = [shapeToGeom3(foam)];
  for (let shape of shapesArray) {
    let geom3 = shapeToGeom3(shape);
    geom3 = jscad.transforms.translateZ(foam.sizeZ - shape.sizeZ, geom3);
    geom3s.push(geom3);
  }
  postMessage(jscad.booleans.subtract(geom3s));
};

export {};
