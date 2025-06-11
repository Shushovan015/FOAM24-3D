import * as PDF from "pdf-lib";
import templateUrl from "../assets/pdf-template.pdf";
import { drawResponsiveText } from "../utils/common";

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
    const templateBytes = await fetch(templateUrl).then((res) =>
      res.arrayBuffer()
    );
    const templatePdf = await PDF.PDFDocument.load(templateBytes);
    let pdf = await PDF.PDFDocument.create();
    let font = await pdf.embedFont(PDF.StandardFonts.Helvetica);

    //PDF.PDFDocument.create().then((pdf) => {
    const [templatePage] = await pdf.copyPages(templatePdf, [0]);
    pdf.addPage(templatePage);
    const page = templatePage;
    const w = page.getWidth();
    const h = page.getHeight();

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
      const l = leftestPoint(shape, shapeToGeom2);
      const r = rightestPoint(shape, shapeToGeom2);
      const t = highestPoint(shape, shapeToGeom2);
      const b = lowestPoint(shape, shapeToGeom2);
      const c = [(l[0] + r[0]) / 2, (t[1] + b[1]) / 2];

      // width
      const wm = { points: [l, r], values: [l[0], r[0]] };
      wm.magnitude = r[0] - l[0];
      wm.overlaps = [];
      (c[1] < 0 ? measurements.bottom : measurements.top).push(wm);

      // height
      const hm = { points: [b, t], values: [b[1], t[1]] };
      hm.magnitude = t[1] - b[1];
      hm.overlaps = [];
      (c[0] < 0 ? measurements.left : measurements.right).push(hm);
    });

    ["left", "right", "top", "bottom"].forEach((dir) => {
      for (const m of measurements[dir]) {
        for (const o of measurements[dir]) {
          if (
            m !== o &&
            m.values[0] < o.values[1] &&
            m.values[1] > o.values[0]
          ) {
            m.overlaps.push(o);
          }
        }
      }

      const sets = [],
        visited = new Set();
      function dfs(m) {
        if (visited.has(m)) return [];
        visited.add(m);
        return [m, ...m.overlaps.flatMap(dfs)];
      }
      for (const m of measurements[dir]) {
        if (!visited.has(m)) {
          const group = dfs(m).sort((a, b) => a.magnitude - b.magnitude);
          sets.push(group);
        }
      }
      measurements[dir] = sets;
    });

    // drawShape(foam);
    shapesArray.forEach((shape) => drawShape(shape));
    shapesArray.forEach((shape) => drawDepthMeasurement(shape));
    // shapesArray.forEach((shape) => drawHeightMeasurement(shape))
    // shapesArray.forEach((shape) => drawWidthMeasurement(shape))

    // Draw each set of measurements

    const drawMeasurements = (
      sets,
      getMargin,
      setMargin,
      drawOffset,
      rotate = false
    ) => {
      sets.forEach((group) => {
        let margin = getMargin();
        group.forEach((m) => {
          m.points.forEach((p) => {
            const px = p[0] + w / 2;
            const py = p[1] + h / 2;
            const mx = rotate ? margin + w / 2 : px;
            const my = rotate ? py : margin + h / 2;
            page.drawLine({
              start: { x: px, y: py },
              end: { x: mx, y: my },
              opacity: 0.5,
            });
          });

          const mid = rotate
            ? (m.points[0][1] + m.points[1][1]) / 2
            : (m.points[0][0] + m.points[1][0]) / 2;

          const fontSize = 16;
          const text = m.magnitude.toFixed(2);
          const textW = font.widthOfTextAtSize(text, fontSize);
          const textH = font.heightAtSize(fontSize);

          if (rotate) {
            page.drawLine({
              start: { x: margin + 5 + w / 2, y: m.points[0][1] + h / 2 },
              end: { x: margin + 5 + w / 2, y: m.points[1][1] + h / 2 },
              opacity: 0.5,
            });
            page.drawText(text, {
              x: margin + w / 2 - textH / 2,
              y: mid + h / 2 - textW / 2,
              size: fontSize,
              rotate: { angle: 90, type: "degrees" },
              font,
            });
          } else {
            page.drawLine({
              start: { x: m.points[0][0] + w / 2, y: margin + 5 + h / 2 },
              end: { x: m.points[1][0] + w / 2, y: margin + 5 + h / 2 },
              opacity: 0.5,
            });
            page.drawText(text, {
              x: mid + w / 2 - textW / 2,
              y: margin + h / 2 + textH / 2 - 2,
              size: fontSize,
              font,
            });
          }
          setMargin(textH * 2);
        });
      });
    };
    const SAFE_MARGIN = 20;
    // let lMargin = -w / 2 - 15;
    let lMargin = -w / 2 + SAFE_MARGIN;
    drawMeasurements(
      measurements.left,
      () => lMargin,
      (d) => (lMargin -= d),
      5,
      true
    );

    // let rMargin = w / 2 + 15;
    let rMargin = w / 2 - SAFE_MARGIN;
    drawMeasurements(
      measurements.right,
      () => rMargin,
      (d) => (rMargin += d),
      -5,
      true
    );

    // let tMargin = h / 2 + 15;
    let tMargin = h / 2 - SAFE_MARGIN;
    drawMeasurements(
      measurements.top,
      () => tMargin,
      (d) => (tMargin += d),
      -5,
      false
    );

    // let bMargin = -h / 2 - 15;
    let bMargin = -h / 2 + SAFE_MARGIN;
    drawMeasurements(
      measurements.bottom,
      () => bMargin,
      (d) => (bMargin -= d),
      5,
      false
    );
    const OFFSET_Y = 8;
    const formData = {
      kunde: "Müller GmbH",
      zeichnung: "123-456",
      beschreibung: "Abdeckplatte für Elektronikgehäuse",
      projekt: "Projekt Phoenix",
      material: "PA66 GF30",
      gewicht: "245g",
    };

    // Adjusted Y positions (shifted up slightly)
    drawResponsiveText(page, font, formData.kunde, 920, 115 + OFFSET_Y, 200);
    drawResponsiveText(
      page,
      font,
      formData.zeichnung,
      1050,
      115 + OFFSET_Y,
      120
    );
    drawResponsiveText(
      page,
      font,
      formData.beschreibung,
      920,
      95 + OFFSET_Y,
      250
    );
    drawResponsiveText(page, font, formData.projekt, 920, 75 + OFFSET_Y, 200);
    drawResponsiveText(page, font, formData.material, 1050, 55 + OFFSET_Y, 120);
    drawResponsiveText(page, font, formData.gewicht, 1050, 135 + OFFSET_Y, 80);

    const bytes = await pdf.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "custom_drawing.pdf";
    link.click();
  };
};
