import * as jscad from "@jscad/modeling"

function shapeToGeom2(shape) {
   switch (shape.kind) {
      case "circle":
          return jscad.primitives.circle({
             center: [shape.x, shape.y],
             radius: shape.radius,
             segments: 20,
          })
      case "rectangle":
          let rect = jscad.primitives.rectangle({
             center: [shape.x, shape.y],
             size: [shape.sizeX, shape.sizeY],
          })
          for (let side of rect.sides) {
              for (let vert of side) {  
                jscad.maths.vec2.rotate(vert, vert, [shape.x, shape.y], jscad.utils.degToRad(shape.rotation))
              }
          }
          return rect
      case "photoshape":
        let polygon = shape.polygon.map(([x, y]) => [x, y]).map(v => jscad.maths.vec2.rotate(v, v, [0, 0], jscad.utils.degToRad(shape.rotation)))
        polygon = polygon.map(([x, y]) => [x + shape.x, y + shape.y])
        return jscad.geometries.geom2.fromPoints(polygon)
   }
}

function shapeToGeom3(shape) {
   let geom2 = shapeToGeom2(shape);
   return jscad.extrusions.extrudeLinear({
      height: shape.sizeZ
   }, geom2)
}

onmessage = (e) => {
   let {foam, shapesArray} = e.data
   let geom3s = [shapeToGeom3(foam)]
   for (let shape of shapesArray) {
      let geom3 = shapeToGeom3(shape);
      geom3 = jscad.transforms.translateZ(foam.sizeZ - shape.sizeZ, geom3)
      geom3s.push(geom3)
   }
   postMessage(jscad.booleans.subtract(geom3s));
}

export {}