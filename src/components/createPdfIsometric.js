// import * as PDF from "pdf-lib";
// import templateUrl from "../assets/pdf-template.pdf";
// import { drawResponsiveText } from "../utils/common"; // keep if you still use it elsewhere

// /**
//  * Create an orthographic (top/front/side) + isometric PDF from extruded 2D shapes.
//  * shapesArray[i] must have:
//  *   - sizeZ: number (height)
//  *   - shapeToGeom2(shape) -> { sides: [ [ [x,y], [x,y] ], ... ] }
//  */
// export const createPdfIso = (foam, shapesArray, shapeToGeom2, opts = {}) => {
//   const { elevationZScale = 1 } = opts;

//   document.querySelector("#pdf-iso-button").onclick = async () => {
//     // --- load template & page ---
//     const templateBytes = await fetch(templateUrl).then((r) => r.arrayBuffer());
//     const templatePdf = await PDF.PDFDocument.load(templateBytes);
//     const pdf = await PDF.PDFDocument.create();
//     const font = await pdf.embedFont(PDF.StandardFonts.Helvetica);

//     const [templatePage] = await pdf.copyPages(templatePdf, [0]);
//     pdf.addPage(templatePage);
//     const page = templatePage;
//     const w = page.getWidth();
//     const h = page.getHeight();

//     // ====== MASK THE TITLE BLOCK (paint white over it) ======
//     // Tweak these numbers to match your template exactly.
//     // This mask hides the bottom-right table (approx. A3 German title block area).
//     page.drawRectangle({
//       x: w - 330, // left edge of mask
//       y: 0, // bottom
//       width: 330, // mask width
//       height: 185, // mask height
//       color: PDF.rgb(1, 1, 1),
//       borderWidth: 0,
//     });
//     // (Optional) If there’s a bottom strip with arrows/labels you also want gone, uncomment below:
//     // page.drawRectangle({ x: 0, y: 0, width: w, height: 40, color: PDF.rgb(1,1,1), borderWidth: 0 });

//     // --- utils ---
//     const ansiSafe = (s) =>
//       String(s).replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, "-");

//     // Build ordered polygon loops from geom2.sides (outer + holes)
//     function buildLoops(geom2) {
//       const key = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;
//       const unkey = (k) => k.split(",").map(Number);

//       const adj = new Map();
//       for (const e of geom2.sides || []) {
//         if (!Array.isArray(e) || e.length < 2) continue;
//         const [a, b] = e;
//         const ka = key(a),
//           kb = key(b);
//         if (!adj.has(ka)) adj.set(ka, new Set());
//         if (!adj.has(kb)) adj.set(kb, new Set());
//         adj.get(ka).add(kb);
//         adj.get(kb).add(ka);
//       }

//       const visitedEdge = new Set();
//       const loops = [];

//       for (const startK of adj.keys()) {
//         for (const nxtK of adj.get(startK)) {
//           const edgeK = `${startK}->${nxtK}`;
//           if (visitedEdge.has(edgeK)) continue;

//           const loop = [unkey(startK)];
//           let prev = startK,
//             curr = nxtK;
//           visitedEdge.add(edgeK);

//           while (curr !== startK) {
//             loop.push(unkey(curr));
//             const nbrs = Array.from(adj.get(curr) || []);
//             let choice = nbrs.find((k) => k !== prev);
//             if (nbrs.length > 2) {
//               // choose the left-most turn for consistent orientation
//               const P = unkey(prev),
//                 C = unkey(curr);
//               let best = null,
//                 bestAngle = Infinity;
//               for (const cand of nbrs) {
//                 if (cand === prev) continue;
//                 const N = unkey(cand);
//                 const v1 = [C[0] - P[0], C[1] - P[1]];
//                 const v2 = [N[0] - C[0], N[1] - C[1]];
//                 const ang = Math.atan2(
//                   v1[0] * v2[1] - v1[1] * v2[0],
//                   v1[0] * v2[0] + v1[1] * v2[1]
//                 );
//                 const leftTurn = ang <= 0 ? ang + 2 * Math.PI : ang;
//                 if (leftTurn < bestAngle) {
//                   bestAngle = leftTurn;
//                   best = cand;
//                 }
//               }
//               if (best) choice = best;
//             }
//             const eK = `${curr}->${choice}`;
//             if (visitedEdge.has(eK)) break;
//             visitedEdge.add(eK);
//             prev = curr;
//             curr = choice;
//           }

//           if (loop.length >= 3) {
//             // orient CCW for outer, CW for holes
//             const area = loop.reduce((s, p, i) => {
//               const q = loop[(i + 1) % loop.length];
//               return s + (p[0] * q[1] - p[1] * q[0]);
//             }, 0);
//             if (area < 0) loop.reverse();
//             loops.push(loop);
//           }
//         }
//       }

//       const absArea = (L) =>
//         Math.abs(
//           L.reduce((s, p, i) => {
//             const q = L[(i + 1) % L.length];
//             return s + (p[0] * q[1] - p[1] * q[0]);
//           }, 0)
//         );
//       loops.sort((A, B) => absArea(B) - absArea(A));
//       return loops;
//     }

//     // Extrude ordered loops to prisms (may include holes)
//     function extrude(shape) {
//       const geom2 = shapeToGeom2(shape);
//       const loops = buildLoops(geom2);
//       const z0 = 0;
//       const z1 = shape.sizeZ ?? 0;
//       return loops.map((loop) => ({
//         bottom: loop.map(([x, y]) => [x, y, z0]),
//         top: loop.map(([x, y]) => [x, y, z1]),
//       }));
//     }

//     // projections
//     const projTop = ([x, y]) => [x, y];
//     const projFront = ([x, , z]) => [x, z * elevationZScale];
//     const projSide = ([, y, z]) => [y, z * elevationZScale];
//     const projIso = ([x, y, z]) => {
//       const a = Math.PI / 6;
//       const X = (x - y) * Math.cos(a);
//       const Y = (x + y) * Math.sin(a) - z;
//       return [X, Y];
//     };

//     // 2D helpers
//     function bbox2(pts) {
//       let minX = Infinity,
//         minY = Infinity,
//         maxX = -Infinity,
//         maxY = -Infinity;
//       for (const [x, y] of pts) {
//         if (x < minX) minX = x;
//         if (y < minY) minY = y;
//         if (x > maxX) maxX = x;
//         if (y > maxY) maxY = y;
//       }
//       return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
//     }

//     function fit2rect(pts, rect, pad = 8) {
//       if (!pts.length) return { transform: (p) => p, s: 1, tx: 0, ty: 0 };
//       const bb = bbox2(pts);
//       const sx = (rect.w - 2 * pad) / (bb.w || 1);
//       const sy = (rect.h - 2 * pad) / (bb.h || 1);
//       const s = Math.min(sx, sy);
//       const tx = rect.cx - (bb.minX + bb.w / 2) * s;
//       const ty = rect.cy - (bb.minY + bb.h / 2) * s;
//       return { s, tx, ty, transform: (p) => [p[0] * s + tx, p[1] * s + ty] };
//     }

//     function drawLoop2D(pts, thickness = 1) {
//       if (pts.length < 2) return;
//       for (let i = 0; i < pts.length; i++) {
//         const a = pts[i],
//           b = pts[(i + 1) % pts.length];
//         page.drawLine({
//           start: { x: a[0], y: a[1] },
//           end: { x: b[0], y: b[1] },
//           thickness,
//         });
//       }
//     }

//     function convexHull2D(points) {
//       if (points.length <= 1) return points.slice();
//       const pts = points
//         .map((p) => [p[0], p[1]])
//         .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
//       const cross = (o, a, b) =>
//         (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
//       const lower = [];
//       for (const p of pts) {
//         while (
//           lower.length >= 2 &&
//           cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
//         )
//           lower.pop();
//         lower.push(p);
//       }
//       const upper = [];
//       for (let i = pts.length - 1; i >= 0; i--) {
//         const p = pts[i];
//         while (
//           upper.length >= 2 &&
//           cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
//         )
//           upper.pop();
//         upper.push(p);
//       }
//       upper.pop();
//       lower.pop();
//       return lower.concat(upper);
//     }

//     // --- layout rects (adjust if your template differs) ---
//     const margin = 36;
//     const viewW = (w - margin * 3) / 2;
//     const viewH = (h - margin * 3) / 2;

//     const boxTop = {
//       cx: margin + viewW / 2,
//       cy: h - margin - viewH / 2,
//       w: viewW,
//       h: viewH,
//     };
//     const boxIso = {
//       cx: margin * 2 + viewW + viewW / 2,
//       cy: h - margin - viewH / 2,
//       w: viewW,
//       h: viewH,
//     };
//     const boxFront = {
//       cx: margin + viewW / 2,
//       cy: margin + viewH / 2,
//       w: viewW,
//       h: viewH,
//     };
//     const boxSide = {
//       cx: margin * 2 + viewW + viewW / 2,
//       cy: margin + viewH / 2,
//       w: viewW,
//       h: viewH,
//     };

//     function gatherProjected2D(projFn) {
//       const all = [];
//       for (const shape of shapesArray) {
//         const prisms = extrude(shape);
//         for (const pr of prisms) {
//           all.push(...pr.top.map(projFn), ...pr.bottom.map(projFn));
//         }
//       }
//       return all;
//     }

//     // ---- TOP (true outline) ----
//     function drawTopView(box) {
//       const all2D = [];
//       for (const shape of shapesArray) {
//         const prisms = extrude(shape);
//         for (const pr of prisms) all2D.push(...pr.top.map(([x, y]) => [x, y]));
//       }
//       const fit = fit2rect(all2D, box, 16);

//       for (const shape of shapesArray) {
//         const prisms = extrude(shape);
//         for (const pr of prisms) {
//           const top2 = pr.top.map(([x, y]) => fit.transform([x, y]));
//           drawLoop2D(top2, 1.4);
//         }
//       }

//       const label = "top view";
//       page.drawText(ansiSafe(label), {
//         x: box.cx - font.widthOfTextAtSize(label, 12) / 2,
//         y: box.cy - box.h / 2 + 6,
//         size: 12,
//         font,
//       });
//     }

//     // ---- FRONT/SIDE (silhouette via hull) ----
//     function drawOrthographic(projFn, box, label) {
//       const allPts = gatherProjected2D(projFn);
//       const fit = fit2rect(allPts, box, 16);

//       for (const shape of shapesArray) {
//         const prisms = extrude(shape);
//         const pts = [];
//         for (const pr of prisms) {
//           pts.push(...pr.top.map(projFn), ...pr.bottom.map(projFn));
//         }
//         const hull = convexHull2D(pts).map(fit.transform);
//         drawLoop2D(hull, 1.4);
//       }

//       page.drawText(ansiSafe(label), {
//         x: box.cx - font.widthOfTextAtSize(label, 12) / 2,
//         y: box.cy - box.h / 2 + 6,
//         size: 12,
//         font,
//       });
//     }

//     // ---- ISOMETRIC (ordered; clean wireframe) ----
//     function drawIsometric(box) {
//       const allPts = gatherProjected2D(projIso);
//       const fit = fit2rect(allPts, box, 18);

//       for (const shape of shapesArray) {
//         const prisms = extrude(shape);
//         for (const pr of prisms) {
//           const top2 = pr.top.map(projIso).map(fit.transform);
//           const bot2 = pr.bottom.map(projIso).map(fit.transform);

//           drawLoop2D(bot2, 0.9);
//           for (let i = 0; i < bot2.length; i++) {
//             page.drawLine({
//               start: { x: bot2[i][0], y: bot2[i][1] },
//               end: { x: top2[i][0], y: top2[i][1] },
//               thickness: 1.0,
//             });
//           }
//           drawLoop2D(top2, 1.5);
//         }
//       }

//       const label = "3-dimensional isometric projection";
//       page.drawText(ansiSafe(label), {
//         x: box.cx - font.widthOfTextAtSize(label, 12) / 2,
//         y: box.cy - box.h / 2 + 6,
//         size: 12,
//         font,
//       });
//     }

//     // ---- header text (keep) ----
//     page.drawText(
//       ansiSafe("Orthographic and isometric projections of an object"),
//       { x: 36, y: h - 36 + 8, size: 14, font }
//     );

//     // ---- draw views ----
//     drawTopView(boxTop);
//     drawIsometric(boxIso);
//     drawOrthographic(projFront, boxFront, "front view");
//     drawOrthographic(projSide, boxSide, "side view");

//     // ---- save ----
//     const bytes = await pdf.save();
//     const blob = new Blob([bytes], { type: "application/pdf" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "projection_drawing.pdf";
//     link.click();
//   };
// };

import * as PDF from "pdf-lib";
import templateUrl from "../assets/pdf-template.pdf";

/**
 * createPdfIso(foam, shapesArray, shapeToGeom2, opts?)
 *
 * foam: { sizeX, sizeY, sizeZ }
 * shapesArray: [ { sizeZ, name?, ... } ]
 * shapeToGeom2(shape) -> { sides: [ [[x,y],[x,y]], ... ] }  // same XY system as foam
 *
 * opts:
 *  - originMode: "auto" | "min" | "center"  (default "auto")
 *  - foamOrigin: { x, y }  // only if you want to offset both modes
 *  - elevationZScale, labelUnit, stroke, dimStroke, arrow, fontSize, showDepthInside
 */
export const createPdfIso = (foam, shapesArray, shapeToGeom2, opts = {}) => {
  const cfg = {
    originMode: opts.originMode || "auto", // "auto" | "min" | "center"
    foamOrigin: opts.foamOrigin || { x: 0, y: 0 },

    elevationZScale: opts.elevationZScale ?? 1,
    labelUnit: opts.labelUnit || "mm",
    stroke: opts.stroke ?? 1.2,
    dimStroke: opts.dimStroke ?? 0.9,
    arrow: opts.arrow ?? 5,
    fontSize: opts.fontSize ?? 10,
    showDepthInside: opts.showDepthInside ?? true,
  };

  // ---------- helpers ----------
  const safeText = (s) => String(s).replace(/[\u2010-\u2015\u2212]/g, "-");
  const absmm = (v) => `${Math.round(Math.abs(v))} ${cfg.labelUnit}`;

  const bbox2 = (pts) => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const [x, y] of pts) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
    return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
  };

  const fit2rect = (pts, rect, pad = 8) => {
    if (!pts.length) return { transform: (p) => p, s: 1, tx: 0, ty: 0 };
    const bb = bbox2(pts);
    const sx = (rect.w - 2 * pad) / (bb.w || 1);
    const sy = (rect.h - 2 * pad) / (bb.h || 1);
    const s = Math.min(sx, sy);
    const tx = rect.cx - (bb.minX + bb.w / 2) * s;
    const ty = rect.cy - (bb.minY + bb.h / 2) * s;
    return { s, tx, ty, transform: (p) => [p[0] * s + tx, p[1] * s + ty] };
  };

  // build polygon loops from geom2 edges (outer first)
  const loopsFromGeom2 = (geom2) => {
    const key = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;
    const un = (k) => k.split(",").map(Number);
    const adj = new Map();
    for (const e of geom2.sides || []) {
      if (!e || e.length < 2) continue;
      const [a, b] = e,
        ka = key(a),
        kb = key(b);
      if (!adj.has(ka)) adj.set(ka, new Set());
      if (!adj.has(kb)) adj.set(kb, new Set());
      adj.get(ka).add(kb);
      adj.get(kb).add(ka);
    }
    const visited = new Set(),
      loops = [];
    for (const s of adj.keys()) {
      for (const n of adj.get(s)) {
        const e0 = `${s}->${n}`;
        if (visited.has(e0)) continue;
        const loop = [un(s)];
        let prev = s,
          cur = n;
        visited.add(e0);
        while (cur !== s) {
          loop.push(un(cur));
          const nbr = [...adj.get(cur)];
          let pick = nbr.find((k) => k !== prev);
          if (nbr.length > 2) {
            const P = un(prev),
              C = un(cur);
            let best = null,
              bestAng = 1e9;
            for (const cand of nbr) {
              if (cand === prev) continue;
              const N = un(cand),
                v1 = [C[0] - P[0], C[1] - P[1]],
                v2 = [N[0] - C[0], N[1] - C[1]];
              const ang = Math.atan2(
                v1[0] * v2[1] - v1[1] * v2[0],
                v1[0] * v2[0] + v1[1] * v2[1]
              );
              const lt = ang <= 0 ? ang + 2 * Math.PI : ang;
              if (lt < bestAng) {
                bestAng = lt;
                best = cand;
              }
            }
            if (best) pick = best;
          }
          const e1 = `${cur}->${pick}`;
          if (visited.has(e1)) break;
          visited.add(e1);
          prev = cur;
          cur = pick;
        }
        if (loop.length >= 3) {
          const A = loop.reduce((s, p, i) => {
            const q = loop[(i + 1) % loop.length];
            return s + (p[0] * q[1] - p[1] * q[0]);
          }, 0);
          if (A < 0) loop.reverse();
          loops.push(loop);
        }
      }
    }
    const area = (L) =>
      Math.abs(
        L.reduce((s, p, i) => {
          const q = L[(i + 1) % L.length];
          return s + (p[0] * q[1] - p[1] * q[0]);
        }, 0)
      );
    loops.sort((A, B) => area(B) - area(A));
    return loops;
  };

  const extrudeShape = (shape) => {
    const loops = loopsFromGeom2(shapeToGeom2(shape));
    const z = shape.sizeZ ?? 0;
    return loops.map((loop) => ({
      top: loop.map(([x, y]) => [x, y, z]),
      bottom: loop.map(([x, y]) => [x, y, 0]),
    }));
  };

  // orthographic projections
  const projFront = ([x, , z]) => [x, z * cfg.elevationZScale];
  const projSide = ([, y, z]) => [y, z * cfg.elevationZScale];
  const projIso = ([x, y, z]) => {
    const a = Math.PI / 6;
    return [(x - y) * Math.cos(a), (x + y) * Math.sin(a) - z];
  };
  const safeThickness = (th) => {
    const num = Number(th);
    return isNaN(num) ? 1 : num;
  };
  // draw helpers
  const drawLoop = (page, pts, th) => {
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i],
        b = pts[(i + 1) % pts.length];
      page.drawLine({
        start: { x: a[0], y: a[1] },
        end: { x: b[0], y: b[1] },
        thickness: safeThickness(th),
      });
    }
  };
  const line = (page, a, b, th) =>
    page.drawLine({
      start: { x: a[0], y: a[1] },
      end: { x: b[0], y: b[1] },
      thickness: safeThickness(th),
    });

  document.querySelector("#pdf-iso-button").onclick = async () => {
    // 0) page size from template
    const tplBytes = await fetch(templateUrl).then((r) => r.arrayBuffer());
    const tplPdf = await PDF.PDFDocument.load(tplBytes);
    const [tplPage] = await tplPdf.getPages();
    const W = tplPage.getWidth(),
      H = tplPage.getHeight();

    const pdf = await PDF.PDFDocument.create();
    const page = pdf.addPage([W, H]);
    const font = await pdf.embedFont(PDF.StandardFonts.Helvetica);

    // 1) frame
    const FRAME = { inset: 18, thick: 1.5 };
    const fx = FRAME.inset,
      fy = FRAME.inset;
    const fw = W - 2 * FRAME.inset,
      fh = H - 2 * FRAME.inset;
    page.drawRectangle({
      x: fx,
      y: fy,
      width: fw,
      height: fh,
      borderWidth: FRAME.thick,
      color: PDF.rgb(1, 1, 1),
    });
    page.drawText("Orthographic and isometric projections of foam pockets", {
      x: fx,
      y: H - FRAME.inset + 6,
      size: 12,
      font,
    });

    // 2) collect all top XY points (as-is)
    const allTopXY = [];
    for (const s of shapesArray) {
      for (const pr of extrudeShape(s)) {
        allTopXY.push(...pr.top.map(([x, y]) => [x, y]));
      }
    }
    const bbShapes = allTopXY.length
      ? bbox2(allTopXY)
      : { minX: 0, minY: 0, maxX: 0, maxY: 0 };

    // 3) dynamically pick foam rect (auto center vs min)
    const origin = cfg.foamOrigin || { x: 0, y: 0 };
    const candidateMin = {
      minX: origin.x,
      minY: origin.y,
      maxX: origin.x + foam.sizeX,
      maxY: origin.y + foam.sizeY,
      w: foam.sizeX,
      h: foam.sizeY,
    };
    const candidateCenter = {
      minX: origin.x - foam.sizeX / 2,
      minY: origin.y - foam.sizeY / 2,
      maxX: origin.x + foam.sizeX / 2,
      maxY: origin.y + foam.sizeY / 2,
      w: foam.sizeX,
      h: foam.sizeY,
    };

    const overflowCost = (rect) => {
      const ox =
        Math.max(0, rect.minX - bbShapes.minX) +
        Math.max(0, bbShapes.maxX - rect.maxX);
      const oy =
        Math.max(0, rect.minY - bbShapes.minY) +
        Math.max(0, bbShapes.maxY - rect.maxY);
      return ox + oy;
    };

    let foamRect;
    if (cfg.originMode === "min") {
      foamRect = candidateMin;
    } else if (cfg.originMode === "center") {
      foamRect = candidateCenter;
    } else {
      // auto: pick rect with least overflow; if tie, prefer the one whose center
      // is closest to the shapes bbox center.
      const cMin = overflowCost(candidateMin);
      const cCtr = overflowCost(candidateCenter);
      if (cMin === cCtr) {
        const centerShapes = [
          (bbShapes.minX + bbShapes.maxX) / 2,
          (bbShapes.minY + bbShapes.maxY) / 2,
        ];
        const dMin = Math.hypot(
          centerShapes[0] - (candidateMin.minX + candidateMin.maxX) / 2,
          centerShapes[1] - (candidateMin.minY + candidateMin.maxY) / 2
        );
        const dCtr = Math.hypot(
          centerShapes[0] - (candidateCenter.minX + candidateCenter.maxX) / 2,
          centerShapes[1] - (candidateCenter.minY + candidateCenter.maxY) / 2
        );
        foamRect = dMin <= dCtr ? candidateMin : candidateCenter;
      } else {
        foamRect = cMin < cCtr ? candidateMin : candidateCenter;
      }
    }

    // 4) prepare pockets (no shifting — use your exact positions)
    const pockets = shapesArray.map((s, i) => {
      const ex = extrudeShape(s)[0]; // outer loop first
      const top2 = ex.top.map(([x, y]) => [x, y]);
      const bb = bbox2(top2);
      return {
        name: s.name || `Pocket ${i + 1}`,
        top2,
        bb,
        depth: s.sizeZ ?? 0,
      };
    });

    // 5) layout areas
    const margin = FRAME.inset + 28;
    const viewW = (W - margin * 3) / 2;
    const viewH = (H - margin * 3) / 2;
    const boxTop = {
      cx: margin + viewW / 2,
      cy: H - margin - viewH / 2,
      w: viewW,
      h: viewH,
    };
    const boxIso = {
      cx: margin * 2 + viewW + viewW / 2,
      cy: H - margin - viewH / 2,
      w: viewW,
      h: viewH,
    };
    const boxFront = {
      cx: margin + viewW / 2,
      cy: margin + viewH / 2,
      w: viewW,
      h: viewH,
    };
    const boxSide = {
      cx: margin * 2 + viewW + viewW / 2,
      cy: margin + viewH / 2,
      w: viewW,
      h: viewH,
    };

    // 6) draw TOP with edge dimensions
    // const drawTop = () => {
    //   const foamCorners = [
    //     [foamRect.minX, foamRect.minY],
    //     [foamRect.maxX, foamRect.minY],
    //     [foamRect.maxX, foamRect.maxY],
    //     [foamRect.minX, foamRect.maxY],
    //   ];
    //   const all = [...foamCorners, ...pockets.flatMap((p) => p.top2)];
    //   const fit = fit2rect(all, boxTop, 18);
    //   const T = (p) => fit.transform(p);

    //   drawLoop(page, foamCorners.map(T), cfg.stroke);
    //   for (const p of pockets) drawLoop(page, p.top2.map(T), cfg.stroke);

    //   const dimH = (x1, x2, y, txtBelow = false) => {
    //     const A = T([x1, y]),
    //       B = T([x2, y]);
    //     line(page, A, B, cfg.dimStroke);
    //     const ah = cfg.arrow,
    //       dir = Math.sign(B[0] - A[0]) || 1;
    //     line(page, A, [A[0] + ah * dir, A[1] + ah / 2], cfg.dimStroke);
    //     line(page, A, [A[0] + ah * dir, A[1] - ah / 2], cfg.dimStroke);
    //     line(page, B, [B[0] - ah * dir, B[1] + ah / 2], cfg.dimStroke);
    //     line(page, B, [B[0] - ah * dir, B[1] - ah / 2], cfg.dimStroke);
    //     const midX = (A[0] + B[0]) / 2,
    //       ty = A[1] + (txtBelow ? -10 : 4);
    //     const label = absmm(x2 - x1);
    //     page.drawText(label, {
    //       x: midX - font.widthOfTextAtSize(label, cfg.fontSize) / 2,
    //       y: ty,
    //       size: cfg.fontSize,
    //       font,
    //     });
    //   };
    //   const dimV = (x, y1, y2, txtRight = false) => {
    //     const A = T([x, y1]),
    //       B = T([x, y2]);
    //     line(page, A, B, cfg.dimStroke);
    //     const ah = cfg.arrow,
    //       dir = Math.sign(B[1] - A[1]) || 1;
    //     line(page, A, [A[0] + ah / 2, A[1] + ah * dir], cfg.dimStroke);
    //     line(page, A, [A[0] - ah / 2, A[1] + ah * dir], cfg.dimStroke);
    //     line(page, B, [B[0] + ah / 2, B[1] - ah * dir], cfg.dimStroke);
    //     line(page, B, [B[0] - ah / 2, B[1] - ah * dir], cfg.dimStroke);
    //     const midY = (A[1] + B[1]) / 2;
    //     const tx =
    //       A[0] +
    //       (txtRight ? 4 : -4 - font.widthOfTextAtSize("0000", cfg.fontSize));
    //     const label = absmm(y2 - y1);
    //     page.drawText(label, {
    //       x: tx,
    //       y: midY - cfg.fontSize / 2,
    //       size: cfg.fontSize,
    //       font,
    //     });
    //   };

    //   for (const p of pockets) {
    //     const { minX, maxX, minY, maxY } = p.bb;
    //     const OUT = 14 / (fit.s || 1);
    //     dimH(foamRect.minX, minX, minY - OUT, true); // left gap
    //     dimH(maxX, foamRect.maxX, maxY + OUT, false); // right gap
    //     dimV(minX - OUT, foamRect.minY, minY, false); // bottom gap
    //     dimV(maxX + OUT, maxY, foamRect.maxY, true); // top gap

    //     const c = T([(minX + maxX) / 2, (minY + maxY) / 2]);
    //     const lbl = safeText(p.name);
    //     page.drawText(lbl, {
    //       x: c[0] - font.widthOfTextAtSize(lbl, cfg.fontSize) / 2,
    //       y: c[1] - cfg.fontSize / 2,
    //       size: cfg.fontSize,
    //       font,
    //     });
    //   }

    //   const cap = "Top View";
    //   page.drawText(cap, {
    //     x: boxTop.cx - font.widthOfTextAtSize(cap, cfg.fontSize) / 2,
    //     y: boxTop.cy - boxTop.h / 2 + 4,
    //     size: cfg.fontSize,
    //     font,
    //   });
    // };

    const pocketColors = [
      PDF.rgb(0.89, 0.1, 0.11), // #e41a1c
      PDF.rgb(0.22, 0.49, 0.73), // #377eb8
      PDF.rgb(0.31, 0.68, 0.31), // #4daf4a
      PDF.rgb(0.6, 0.31, 0.64), // #984ea3
      PDF.rgb(1, 0.5, 0), // #ff7f00
      PDF.rgb(1, 1, 0.2), // #ffff33
      PDF.rgb(0.65, 0.34, 0.16), // #a65628
      PDF.rgb(0.97, 0.13, 0.75), // #f781bf
      PDF.rgb(0.6, 0.6, 0.6), // #999999
      PDF.rgb(0.4, 0.76, 0.65), // #66c2a5
    ];

    const drawTop = () => {
      const foamCorners = [
        [foamRect.minX, foamRect.minY],
        [foamRect.maxX, foamRect.minY],
        [foamRect.maxX, foamRect.maxY],
        [foamRect.minX, foamRect.maxY],
      ];

      const all = [...foamCorners, ...pockets.flatMap((p) => p.top2)];
      const fit = fit2rect(all, boxTop, 18);
      const T = (p) => fit.transform(p);

      // Draw foam outline
      drawLoop(page, foamCorners.map(T), {
        color: PDF.rgb(0, 0, 0),
        thickness: cfg.strokeThickness || 1,
      });

      const foamCenterX = (foamRect.minX + foamRect.maxX) / 2;

      // Dimension helpers
      const dimH = (x1, x2, y, color, txtBelow = false) => {
        const A = T([x1, y]),
          B = T([x2, y]);
        line(page, A, B, { color, thickness: cfg.dimStroke });

        const ah = cfg.arrow;
        const dir = Math.sign(B[0] - A[0]) || 1;

        line(page, A, [A[0] + ah * dir, A[1] + ah / 2], {
          color,
          thickness: cfg.dimStroke,
        });
        line(page, A, [A[0] + ah * dir, A[1] - ah / 2], {
          color,
          thickness: cfg.dimStroke,
        });
        line(page, B, [B[0] - ah * dir, B[1] + ah / 2], {
          color,
          thickness: cfg.dimStroke,
        });
        line(page, B, [B[0] - ah * dir, B[1] - ah / 2], {
          color,
          thickness: cfg.dimStroke,
        });

        const midX = (A[0] + B[0]) / 2;
        const ty = A[1] + (txtBelow ? -10 : 4);
        const label = absmm(x2 - x1);

        page.drawText(label, {
          x: midX - font.widthOfTextAtSize(label, cfg.fontSize) / 2,
          y: ty,
          size: cfg.fontSize,
          font,
          color,
        });
      };

      const dimV = (x, y1, y2, color, txtRight = false) => {
        const A = T([x, y1]),
          B = T([x, y2]);
        line(page, A, B, { color, thickness: cfg.dimStroke });

        const ah = cfg.arrow;
        const dir = Math.sign(B[1] - A[1]) || 1;

        line(page, A, [A[0] + ah / 2, A[1] + ah * dir], {
          color,
          thickness: cfg.dimStroke,
        });
        line(page, A, [A[0] - ah / 2, A[1] + ah * dir], {
          color,
          thickness: cfg.dimStroke,
        });
        line(page, B, [B[0] + ah / 2, B[1] - ah * dir], {
          color,
          thickness: cfg.dimStroke,
        });
        line(page, B, [B[0] - ah / 2, B[1] - ah * dir], {
          color,
          thickness: cfg.dimStroke,
        });

        const midY = (A[1] + B[1]) / 2;
        const tx = txtRight
          ? A[0] + 4
          : A[0] - 4 - font.widthOfTextAtSize("0000", cfg.fontSize);

        const label = absmm(y2 - y1);

        page.drawText(label, {
          x: tx,
          y: midY - cfg.fontSize / 2,
          size: cfg.fontSize,
          font,
          color,
        });
      };

      // Draw pockets
      for (let i = 0; i < pockets.length; i++) {
        const p = pockets[i];
        const color = pocketColors[i % pocketColors.length];

        drawLoop(page, p.top2.map(T), {
          color,
          thickness: cfg.strokeThickness || 1,
        });

        const { minX, maxX, minY, maxY } = p.bb;
        const OUT = 14 / (fit.s || 1);
        const pocketCenter = (minX + maxX) / 2;

        // Horizontal dimensions
        dimH(minX, maxX, maxY + OUT + OUT, color);
        if (pocketCenter < foamCenterX) {
          dimH(foamRect.minX, minX, maxY + OUT, color, false);
        } else {
          dimH(maxX, foamRect.maxX, maxY + OUT, color, false);
        }

        // Vertical dimensions
        dimV(minX - OUT, foamRect.minY, minY, color, false);
        dimV(maxX + OUT, maxY, foamRect.maxY, color, true);

        // Pocket label
        const c = T([(minX + maxX) / 2, (minY + maxY) / 2]);
        const lbl = safeText(p.name);
        page.drawText(lbl, {
          x: c[0] - font.widthOfTextAtSize(lbl, cfg.fontSize) / 2,
          y: c[1] - cfg.fontSize / 2,
          size: cfg.fontSize,
          font,
          color,
        });
      }

      // Caption
      const cap = "Top View";
      page.drawText(cap, {
        x: boxTop.cx - font.widthOfTextAtSize(cap, cfg.fontSize) / 2,
        y: boxTop.cy - boxTop.h / 2 + 4,
        size: cfg.fontSize,
        font,
      });
    };

    // 7) Front (X–Z) and Side (Y–Z)
    const drawFront = () => {
      const all = [
        [foamRect.minX, 0],
        [foamRect.maxX, foam.sizeZ],
      ];
      const fit = fit2rect(all, boxFront, 18);
      const T = (p) => fit.transform(p);

      drawLoop(
        page,
        [
          [foamRect.minX, 0],
          [foamRect.maxX, 0],
          [foamRect.maxX, foam.sizeZ],
          [foamRect.minX, foam.sizeZ],
        ].map(T),
        cfg.stroke
      );

      for (const p of pockets) {
        const r = [
          [p.bb.minX, 0],
          [p.bb.maxX, 0],
          [p.bb.maxX, p.depth],
          [p.bb.minX, p.depth],
        ].map(T);
        drawLoop(page, r, cfg.stroke);
        if (cfg.showDepthInside && p.depth > 0) {
          const mid = [(r[0][0] + r[1][0]) / 2, (r[1][1] + r[2][1]) / 2];
          const lbl = absmm(p.depth);
          page.drawText(lbl, {
            x: mid[0] - font.widthOfTextAtSize(lbl, cfg.fontSize) / 2,
            y: mid[1] - cfg.fontSize / 2,
            size: cfg.fontSize,
            font,
          });
        }
      }

      const cap = "Front View";
      page.drawText(cap, {
        x: boxFront.cx - font.widthOfTextAtSize(cap, cfg.fontSize) / 2,
        y: boxFront.cy - boxFront.h / 2 + 4,
        size: cfg.fontSize,
        font,
      });
    };

    const drawSide = () => {
      const all = [
        [foamRect.minY, 0],
        [foamRect.maxY, foam.sizeZ],
      ];
      const fit = fit2rect(all, boxSide, 18);
      const T = (p) => fit.transform(p);

      drawLoop(
        page,
        [
          [foamRect.minY, 0],
          [foamRect.maxY, 0],
          [foamRect.maxY, foam.sizeZ],
          [foamRect.minY, foam.sizeZ],
        ].map(T),
        cfg.stroke
      );

      for (const p of pockets) {
        const r = [
          [p.bb.minY, 0],
          [p.bb.maxY, 0],
          [p.bb.maxY, p.depth],
          [p.bb.minY, p.depth],
        ].map(T);
        drawLoop(page, r, cfg.stroke);
        if (cfg.showDepthInside && p.depth > 0) {
          const mid = [(r[0][0] + r[1][0]) / 2, (r[1][1] + r[2][1]) / 2];
          const lbl = absmm(p.depth);
          page.drawText(lbl, {
            x: mid[0] - font.widthOfTextAtSize(lbl, cfg.fontSize) / 2,
            y: mid[1] - cfg.fontSize / 2,
            size: cfg.fontSize,
            font,
          });
        }
      }

      const cap = "Side View";
      page.drawText(cap, {
        x: boxSide.cx - font.widthOfTextAtSize(cap, cfg.fontSize) / 2,
        y: boxSide.cy - boxSide.h / 2 + 4,
        size: cfg.fontSize,
        font,
      });
    };

    // 8) Isometric
    const drawIso = () => {
      const foamPrism = [
        [foamRect.minX, foamRect.minY, 0],
        [foamRect.maxX, foamRect.minY, 0],
        [foamRect.maxX, foamRect.maxY, 0],
        [foamRect.minX, foamRect.maxY, 0],
        [foamRect.minX, foamRect.minY, foam.sizeZ],
        [foamRect.maxX, foamRect.minY, foam.sizeZ],
        [foamRect.maxX, foamRect.maxY, foam.sizeZ],
        [foamRect.minX, foamRect.maxY, foam.sizeZ],
      ].map(projIso);

      const shapesIso = [];
      for (const s of shapesArray) {
        for (const pr of extrudeShape(s)) {
          shapesIso.push(...pr.top.map(projIso), ...pr.bottom.map(projIso));
        }
      }

      const fit = fit2rect([...foamPrism, ...shapesIso], boxIso, 18);
      const T = (p) => fit.transform(p);

      const F = foamPrism.map(T);
      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
      ];
      for (const [a, b] of edges) line(page, F[a], F[b], 0.7);

      for (const s of shapesArray) {
        for (const pr of extrudeShape(s)) {
          const top = pr.top.map(projIso).map(T);
          const bot = pr.bottom.map(projIso).map(T);
          drawLoop(page, bot, 0.9);
          for (let i = 0; i < bot.length; i++) line(page, bot[i], top[i], 1.0);
          drawLoop(page, top, 1.4);
        }
      }

      const cap = "3D Isometric";
      page.drawText(cap, {
        x: boxIso.cx - font.widthOfTextAtSize(cap, cfg.fontSize) / 2,
        y: boxIso.cy - boxIso.h / 2 + 4,
        size: cfg.fontSize,
        font,
      });
    };

    // 9) Draw all
    drawTop();
    drawIso();
    drawFront();
    drawSide();

    // 10) Save
    // const bytes = await pdf.save();
    // const blob = new Blob([bytes], { type: "application/pdf" });
    // const a = document.createElement("a");
    // a.href = URL.createObjectURL(blob);
    // a.download = "foam_pockets_projection.pdf";
    // a.click();

    const bytes = await pdf.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Open the PDF in a new browser tab
    window.open(url, "_blank");
  };
};
