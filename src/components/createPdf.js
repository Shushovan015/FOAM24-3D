import * as PDF from "pdf-lib";

export const createPdf = (
  foam,
  shapesArray,
  shapeToGeom2,
  rightestPoint,
  leftestPoint,
  highestPoint,
  lowestPoint
) => {
  document.querySelector("#pdf-button").onclick = async () => {
    let pdf = await PDF.PDFDocument.create();
    let font = await pdf.embedFont(PDF.StandardFonts.Helvetica);

    //PDF.PDFDocument.create().then((pdf) => {
    let w = PDF.PageSizes.A3[1];
    let h = PDF.PageSizes.A3[0];
    let page = pdf.addPage([w, h]);

    //page.drawText("Hello, world!")

    function drawShape(shape) {
      let geom2 = shapeToGeom2(shape);
      geom2.sides.forEach((side) => {
        page.drawLine({
          start: { x: side[0][0] + w / 2, y: side[0][1] + h / 2 },
          end: { x: side[1][0] + w / 2, y: side[1][1] + h / 2 },
          thickness: 2,
        });
      });
    }

    function drawDepthMeasurement(shape) {
      let geom2 = shapeToGeom2(shape);

      let centroidx = 0;
      let centroidy = 0;

      geom2.sides.forEach((side) => {
        centroidx += side[0][0];
        centroidy += side[0][1];
      });

      centroidx /= geom2.sides.length;
      centroidy /= geom2.sides.length;

      let fontSize = 16;
      let text = "T=" + shape.sizeZ.toFixed(2);
      let textw = font.widthOfTextAtSize(text, fontSize);
      let texth = font.heightAtSize(fontSize);
      //let texth = font.heightOfTextAtSize(text, fontSize)
      page.drawText(text, {
        x: centroidx + w / 2 - textw / 2,
        y: centroidy + h / 2 - texth / 2,
        size: fontSize,
      });
    }

    function drawHeightMeasurement(shape) {
      let rightestP = rightestPoint(shape, shapeToGeom2);
      let leftestP = leftestPoint(shape, shapeToGeom2);
      let highestP = highestPoint(shape, shapeToGeom2);
      let lowestP = lowestPoint(shape, shapeToGeom2);
      let midX = (rightestP[0] + leftestP[0]) / 2;
      let margin;
      let angle;
      if (midX > 0) {
        margin = foam.sizeX / 2 + 10;
        angle = -90;
      } else {
        margin = -foam.sizeX / 2 - 10;
        angle = 90;
      }
      page.drawLine({
        start: { x: highestP[0] + w / 2, y: highestP[1] + h / 2 },
        end: { x: margin + w / 2, y: highestP[1] + h / 2 },
        opacity: 0.5,
      });
      page.drawLine({
        start: { x: lowestP[0] + w / 2, y: lowestP[1] + h / 2 },
        end: { x: margin + w / 2, y: lowestP[1] + h / 2 },
        opacity: 0.5,
      });
      let midY = (highestP[1] + lowestP[1]) / 2;
      let fontSize = 16;
      let text = (highestP[1] - lowestP[1]).toFixed(2);
      let textw = font.widthOfTextAtSize(text, fontSize);
      let texth = font.heightAtSize(fontSize);
      //let texth = font.heightOfTextAtSize(text, fontSize)
      page.drawText(text, {
        x: margin + w / 2 - texth / 2,
        y: midY + h / 2 - textw / 2,
        size: fontSize,
        rotate: { angle: angle, type: "degrees" },
      });
    }

    function drawWidthMeasurement(shape) {
      let rightestP = rightestPoint(shape, shapeToGeom2);
      let leftestP = leftestPoint(shape, shapeToGeom2);
      let highestP = highestPoint(shape, shapeToGeom2);
      let lowestP = lowestPoint(shape, shapeToGeom2);
      let midY = (highestP[1] + lowestP[1]) / 2;
      let margin;
      if (midY > 0) {
        margin = foam.sizeY / 2 + 10;
      } else {
        margin = -foam.sizeY / 2 - 10;
      }
      page.drawLine({
        start: { x: rightestP[0] + w / 2, y: rightestP[1] + h / 2 },
        end: { x: rightestP[0] + w / 2, y: margin + h / 2 },
        opacity: 0.5,
      });
      page.drawLine({
        start: { x: leftestP[0] + w / 2, y: leftestP[1] + h / 2 },
        end: { x: leftestP[0] + w / 2, y: margin + h / 2 },
        opacity: 0.5,
      });
      let midX = (rightestP[0] + leftestP[0]) / 2;
      let fontSize = 16;
      let text = (rightestP[0] - leftestP[0]).toFixed(2);
      let textw = font.widthOfTextAtSize(text, fontSize);
      let texth = font.heightAtSize(fontSize);
      //let texth = font.heightOfTextAtSize(text, fontSize)
      page.drawText(text, {
        x: midX + w / 2 - textw / 2,
        y: margin + h / 2 - texth / 2,
        size: fontSize,
      });
    }

    let measurements = {
      left: [],
      right: [],
      top: [],
      bottom: [],
    };

    // Calculate all the measurements we want for each of the shapes
    shapesArray.forEach((shape) => {
      // Points
      let l = leftestPoint(shape, shapeToGeom2);
      let r = rightestPoint(shape, shapeToGeom2);
      let t = highestPoint(shape, shapeToGeom2);
      let b = lowestPoint(shape, shapeToGeom2);
      let c = [(l[0] + r[0]) / 2, (t[1] + b[1]) / 2];
      // Width measurements
      {
        let m = {};
        (m.points = [l, r]), (m.values = [l[0], r[0]]);
        m.magnitude = r[0] - l[0];
        m.overlaps = [];
        m.type = "width";
        if (c[1] < 0) {
          measurements.bottom.push(m);
          //debugger
        } else {
          measurements.top.push(m);
          //debugger
        }
      }
      // Height measurements
      {
        let m = {};
        (m.points = [b, t]), (m.values = [b[1], t[1]]);
        m.magnitude = t[1] - b[1];
        m.overlaps = [];
        m.type = "height";
        if (c[0] < 0) {
          measurements.left.push(m);
          //debugger
        } else {
          measurements.right.push(m);
          //debugger
        }
      }
    });

    // Calculate overlaps for each group of measurments
    ["left", "right", "top", "bottom"].forEach((dir) => {
      for (let m of measurements[dir]) {
        for (let other of measurements[dir]) {
          if (m === other) {
            continue;
          }
          if (m.values[0] < other.values[1] && m.values[1] > other.values[0]) {
            m.overlaps.push(other);
          }
        }
      }
    });

    // Split each group of measurements into non-overlapping sets using DFS
    ["left", "right", "top", "bottom"].forEach((dir) => {
      let currentSet = [];
      let sets = [];
      let visited = new Set();
      function dfs(m) {
        if (visited.has(m)) return;
        visited.add(m);
        currentSet.push(m);
        for (let next of m.overlaps) {
          dfs(next);
        }
      }
      for (let m of measurements[dir]) {
        dfs(m);

        // Also sort the set by measurement magnitude (smaller first)
        currentSet.sort((a, b) => a.magnitude < b.magnitude);

        if (currentSet.length > 0) {
          sets.push(currentSet);
        }
        currentSet = [];
      }
      measurements[dir] = sets;
    });

    drawShape(foam);
    shapesArray.forEach((shape) => drawShape(shape));
    shapesArray.forEach((shape) => drawDepthMeasurement(shape));
    // shapesArray.forEach((shape) => drawHeightMeasurement(shape))
    // shapesArray.forEach((shape) => drawWidthMeasurement(shape))

    // Draw each set of measurements

    measurements.left.forEach((ms) => {
      let margin = -foam.sizeX / 2 - 15;
      for (let m of ms) {
        // Helper lines
        for (let p of m.points) {
          page.drawLine({
            start: { x: p[0] + w / 2, y: p[1] + h / 2 },
            end: { x: margin + w / 2, y: p[1] + h / 2 },
            opacity: 0.5,
          });
        }
        page.drawLine({
          start: { x: margin + 5 + w / 2, y: m.points[0][1] + h / 2 },
          end: { x: margin + 5 + w / 2, y: m.points[1][1] + h / 2 },
          opacity: 0.5,
        });
        let mid = (m.points[0][1] + m.points[1][1]) / 2;
        let fontSize = 16;
        let text = m.magnitude.toFixed(2);
        let textw = font.widthOfTextAtSize(text, fontSize);
        let texth = font.heightAtSize(fontSize);
        page.drawText(text, {
          x: margin + w / 2 - texth / 2,
          y: mid + h / 2 - textw / 2,
          size: fontSize,
          rotate: { angle: 90, type: "degrees" },
        });
        margin -= texth * 2;
      }
    });

    measurements.right.forEach((ms) => {
      let margin = foam.sizeX / 2 + 15;
      for (let m of ms) {
        // Helper lines
        for (let p of m.points) {
          page.drawLine({
            start: { x: p[0] + w / 2, y: p[1] + h / 2 },
            end: { x: margin + w / 2, y: p[1] + h / 2 },
            opacity: 0.5,
          });
        }
        page.drawLine({
          start: { x: margin - 5 + w / 2, y: m.points[0][1] + h / 2 },
          end: { x: margin - 5 + w / 2, y: m.points[1][1] + h / 2 },
          opacity: 0.5,
        });
        let mid = (m.points[0][1] + m.points[1][1]) / 2;
        let fontSize = 16;
        let text = m.magnitude.toFixed(2);
        let textw = font.widthOfTextAtSize(text, fontSize);
        let texth = font.heightAtSize(fontSize);
        page.drawText(text, {
          x: margin + w / 2 + texth / 2,
          y: mid + h / 2 - textw / 2,
          size: fontSize,
          rotate: { angle: 90, type: "degrees" },
        });
        margin += texth * 2;
      }
    });

    measurements.top.forEach((ms) => {
      let margin = foam.sizeY / 2 + 15;
      for (let m of ms) {
        // Helper lines
        for (let p of m.points) {
          page.drawLine({
            start: { x: p[0] + w / 2, y: p[1] + h / 2 },
            end: { x: p[0] + w / 2, y: margin + h / 2 },
            opacity: 0.5,
          });
        }
        page.drawLine({
          start: { x: m.points[0][0] + w / 2, y: margin - 5 + h / 2 },
          end: { x: m.points[1][0] + w / 2, y: margin - 5 + h / 2 },
          opacity: 0.5,
        });
        let mid = (m.points[0][0] + m.points[1][0]) / 2;
        let fontSize = 16;
        let text = m.magnitude.toFixed(2);

        let textw = font.widthOfTextAtSize(text, fontSize);
        let texth = font.heightAtSize(fontSize);

        page.drawText(text, {
          x: mid + w / 2 - textw / 2,
          y: margin + h / 2 + texth / 2 - 2,
          size: fontSize,
        });
        margin += texth * 2;
      }
    });

    measurements.bottom.forEach((ms) => {
      let margin = -foam.sizeY / 2 - 15;
      for (let m of ms) {
        // Helper lines
        for (let p of m.points) {
          page.drawLine({
            start: { x: p[0] + w / 2, y: p[1] + h / 2 },
            end: { x: p[0] + w / 2, y: margin + h / 2 },
            opacity: 0.5,
          });
        }
        page.drawLine({
          start: { x: m.points[0][0] + w / 2, y: margin + 5 + h / 2 },
          end: { x: m.points[1][0] + w / 2, y: margin + 5 + h / 2 },
          opacity: 0.5,
        });
        let mid = (m.points[0][0] + m.points[1][0]) / 2;
        let fontSize = 16;
        let text = m.magnitude.toFixed(2);

        let textw = font.widthOfTextAtSize(text, fontSize);
        let texth = font.heightAtSize(fontSize);

        page.drawText(text, {
          x: mid + w / 2 - textw / 2,
          y: margin + h / 2 - texth / 2,
          size: fontSize,
        });
        margin -= texth * 2;
      }
    });

    //return pdf.save()
    //}).then((bytes) => {

    let bytes = await pdf.save();

    let link = document.createElement("a");
    let blob = new Blob([bytes], { type: "application/pdf" });
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "test.pdf");
    link.click();
    //})
  };
};
