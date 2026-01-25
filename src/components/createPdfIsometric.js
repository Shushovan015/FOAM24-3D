import * as PDF from "pdf-lib";
import templateUrl from "../assets/pdf-template.pdf";

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
    const tplBytes = await fetch(templateUrl).then((r) => r.arrayBuffer());
    const tplPdf = await PDF.PDFDocument.load(tplBytes);
    const [tplPage] = await tplPdf.getPages();
    const W = tplPage.getWidth(),
      H = tplPage.getHeight();

    const pdf = await PDF.PDFDocument.create();
    const page = pdf.addPage([W, H]);
    const font = await pdf.embedFont(PDF.StandardFonts.Helvetica);

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

    const allTopXY = [];
    for (const s of shapesArray) {
      for (const pr of extrudeShape(s)) {
        allTopXY.push(...pr.top.map(([x, y]) => [x, y]));
      }
    }
    const bbShapes = allTopXY.length
      ? bbox2(allTopXY)
      : { minX: 0, minY: 0, maxX: 0, maxY: 0 };

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

    const pocketColors = [
      PDF.rgb(0.89, 0.1, 0.11),
      PDF.rgb(0.22, 0.49, 0.73),
      PDF.rgb(0.31, 0.68, 0.31),
      PDF.rgb(0.6, 0.31, 0.64),
      PDF.rgb(1, 0.5, 0),
      PDF.rgb(1, 1, 0.2),
      PDF.rgb(0.65, 0.34, 0.16),
      PDF.rgb(0.97, 0.13, 0.75),
      PDF.rgb(0.6, 0.6, 0.6),
      PDF.rgb(0.4, 0.76, 0.65),
    ];

    // main drawTop
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

    //   // Draw foam outline
    //   drawLoop(page, foamCorners.map(T), {
    //     color: PDF.rgb(0, 0, 0),
    //     thickness: cfg.strokeThickness || 1,
    //   });

    //   const foamCenterX = (foamRect.minX + foamRect.maxX) / 2;

    //   // Dimension helpers
    //   const dimH = (x1, x2, y, color, txtBelow = false) => {
    //     const A = T([x1, y]),
    //       B = T([x2, y]);
    //     line(page, A, B, { color, thickness: cfg.dimStroke });

    //     const ah = cfg.arrow;
    //     const dir = Math.sign(B[0] - A[0]) || 1;

    //     line(page, A, [A[0] + ah * dir, A[1] + ah / 2], {
    //       color,
    //       thickness: cfg.dimStroke,
    //     });
    //     line(page, A, [A[0] + ah * dir, A[1] - ah / 2], {
    //       color,
    //       thickness: cfg.dimStroke,
    //     });
    //     line(page, B, [B[0] - ah * dir, B[1] + ah / 2], {
    //       color,
    //       thickness: cfg.dimStroke,
    //     });
    //     line(page, B, [B[0] - ah * dir, B[1] - ah / 2], {
    //       color,
    //       thickness: cfg.dimStroke,
    //     });

    //     const midX = (A[0] + B[0]) / 2;
    //     const ty = A[1] + (txtBelow ? -10 : 4);
    //     const label = absmm(x2 - x1);

    //     page.drawText(label, {
    //       x: midX - font.widthOfTextAtSize(label, cfg.fontSize) / 2,
    //       y: ty,
    //       size: cfg.fontSize,
    //       font,
    //       color,
    //     });
    //   };

    //   const dimV = (x, y1, y2, color, txtRight = false) => {
    //     const A = T([x, y1]),
    //       B = T([x, y2]);
    //     line(page, A, B, { color, thickness: cfg.dimStroke });

    //     const ah = cfg.arrow;
    //     const dir = Math.sign(B[1] - A[1]) || 1;

    //     line(page, A, [A[0] + ah / 2, A[1] + ah * dir], {
    //       color,
    //       thickness: cfg.dimStroke,
    //     });
    //     line(page, A, [A[0] - ah / 2, A[1] + ah * dir], {
    //       color,
    //       thickness: cfg.dimStroke,
    //     });
    //     line(page, B, [B[0] + ah / 2, B[1] - ah * dir], {
    //       color,
    //       thickness: cfg.dimStroke,
    //     });
    //     line(page, B, [B[0] - ah / 2, B[1] - ah * dir], {
    //       color,
    //       thickness: cfg.dimStroke,
    //     });

    //     const midY = (A[1] + B[1]) / 2;
    //     const tx = txtRight
    //       ? A[0] + 4
    //       : A[0] - 4 - font.widthOfTextAtSize("0000", cfg.fontSize);

    //     const label = absmm(y2 - y1);

    //     page.drawText(label, {
    //       x: tx,
    //       y: midY - cfg.fontSize / 2,
    //       size: cfg.fontSize,
    //       font,
    //       color,
    //     });
    //   };

    //   // Draw pockets
    //   for (let i = 0; i < pockets.length; i++) {
    //     const p = pockets[i];
    //     const color = pocketColors[i % pocketColors.length];

    //     drawLoop(page, p.top2.map(T), {
    //       color,
    //       thickness: cfg.strokeThickness || 1,
    //     });

    //     const { minX, maxX, minY, maxY } = p.bb;
    //     const OUT = 14 / (fit.s || 1);
    //     const pocketCenter = (minX + maxX) / 2;

    //     // Horizontal dimensions
    //     dimH(minX, maxX, maxY + OUT + OUT, color);
    //     if (pocketCenter < foamCenterX) {
    //       dimH(foamRect.minX, minX, maxY + OUT, color, false);
    //     } else {
    //       dimH(maxX, foamRect.maxX, maxY + OUT, color, false);
    //     }

    //     // Vertical dimensions
    //     dimV(minX - OUT, foamRect.minY, minY, color, false);
    //     dimV(maxX + OUT, maxY, foamRect.maxY, color, true);

    //     // Pocket label
    //     const c = T([(minX + maxX) / 2, (minY + maxY) / 2]);
    //     const lbl = safeText(p.name);
    //     page.drawText(lbl, {
    //       x: c[0] - font.widthOfTextAtSize(lbl, cfg.fontSize) / 2,
    //       y: c[1] - cfg.fontSize / 2,
    //       size: cfg.fontSize,
    //       font,
    //       color,
    //     });
    //   }

    //   // Caption
    //   const cap = "Top View";
    //   page.drawText(cap, {
    //     x: boxTop.cx - font.widthOfTextAtSize(cap, cfg.fontSize) / 2,
    //     y: boxTop.cy - boxTop.h / 2 + 4,
    //     size: cfg.fontSize,
    //     font,
    //   });
    // };

    let here;
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

      drawLoop(page, foamCorners.map(T), {
        color: PDF.rgb(0, 0, 0),
        thickness: cfg.strokeThickness || 1,
      });

      const RED = PDF.rgb(1, 0, 0);
      const EXT = 10 / (fit.s || 1);
      const AH = 2 / (fit.s || 1);
      const AHV = 3 / (fit.s || 1);

      const topLaneRight = [-Infinity, -Infinity];
      const bottomLaneRight = [-Infinity, -Infinity];

      const placeDimLabel = (midX, y, label, isTop) => {
        const tp = T([midX, y]);
        const w = font.widthOfTextAtSize(label, cfg.fontSize);
        const gap = 4;
        const lanes = isTop ? topLaneRight : bottomLaneRight;

        const left = tp[0] - w / 2;

        let lane = 0;
        if (left < lanes[0] + gap && left >= lanes[1] + gap) lane = 1;
        else if (left < lanes[0] + gap && left < lanes[1] + gap) lane = lanes[0] <= lanes[1] ? 0 : 1;

        const offset = (cfg.fontSize + 2) * lane;
        const ty = isTop ? tp[1] + 6 + offset : tp[1] - 10 - offset;

        lanes[lane] = Math.max(lanes[lane], left + w);

        page.drawText(label, {
          x: left,
          y: ty,
          size: cfg.fontSize,
          font,
          color: RED,
        });
      };

      const drawLine = (A, B, color) => {
        page.drawLine({
          start: { x: A[0], y: A[1] },
          end: { x: B[0], y: B[1] },
          thickness: cfg.dimStroke,
          color,
        });
      };

      const lineV = (x, y1, y2, color) => drawLine(T([x, y1]), T([x, y2]), color);
      const lineH = (x1, x2, y, color) => drawLine(T([x1, y]), T([x2, y]), color);

      const arrowH = (x1, x2, y, textAbove) => {
        lineH(x1, x2, y, RED);

        const L = T([x1, y]);
        drawLine([L[0], L[1]], [L[0] + AH, L[1] + AH / 2], RED);
        drawLine([L[0], L[1]], [L[0] + AH, L[1] - AH / 2], RED);

        const R = T([x2, y]);
        drawLine([R[0], R[1]], [R[0] - AH, R[1] + AH / 2], RED);
        drawLine([R[0], R[1]], [R[0] - AH, R[1] - AH / 2], RED);

        const label = absmm(x2 - x1);
        const midX = (x1 + x2) / 2;
        placeDimLabel(midX, y, label, textAbove);
      };

      const arrowVRed = (x, y1, y2) => {
        lineV(x, y1, y2, RED);

        const T1 = T([x, y2]);
        drawLine([T1[0], T1[1]], [T1[0] + AHV / 2, T1[1] - AHV], RED);
        drawLine([T1[0], T1[1]], [T1[0] - AHV / 2, T1[1] - AHV], RED);

        const B1 = T([x, y1]);
        drawLine([B1[0], B1[1]], [B1[0] + AHV / 2, B1[1] + AHV], RED);
        drawLine([B1[0], B1[1]], [B1[0] - AHV / 2, B1[1] + AHV], RED);
      };

      const xRangeAtY = (pts, y) => {
        const xs = [];
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % pts.length];
          const y1 = a[1],
            y2 = b[1];

          if (y < Math.min(y1, y2) || y > Math.max(y1, y2)) continue;

          if (Math.abs(y2 - y1) < 1e-6) {
            xs.push(a[0], b[0]);
            continue;
          }

          const t = (y - y1) / (y2 - y1);
          if (t >= 0 && t <= 1) {
            xs.push(a[0] + t * (b[0] - a[0]));
          }
        }

        if (xs.length < 2) return null;
        return { minX: Math.min(...xs), maxX: Math.max(...xs), width: Math.max(...xs) - Math.min(...xs) };
      };

      const yRangeAtX = (pts, x) => {
        const ys = [];
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % pts.length];
          const x1 = a[0],
            x2 = b[0];

          if (x < Math.min(x1, x2) || x > Math.max(x1, x2)) continue;

          if (Math.abs(x2 - x1) < 1e-6) {
            ys.push(a[1], b[1]);
            continue;
          }

          const t = (x - x1) / (x2 - x1);
          if (t >= 0 && t <= 1) {
            ys.push(a[1] + t * (b[1] - a[1]));
          }
        }

        if (ys.length < 2) return null;
        return { minY: Math.min(...ys), maxY: Math.max(...ys) };
      };

      const uniqSorted = (arr) => {
        const out = [];
        const sorted = [...arr].sort((a, b) => a - b);
        const EPS = 1e-4;
        for (let i = 0; i < sorted.length; i++) {
          if (out.length === 0 || Math.abs(sorted[i] - out[out.length - 1]) > EPS) {
            out.push(sorted[i]);
          }
        }
        return out;
      };

      const topXs = [foamRect.minX, foamRect.maxX];
      const bottomXs = [foamRect.minX, foamRect.maxX];

      for (let i = 0; i < pockets.length; i++) {
        const p = pockets[i];

        drawLoop(page, p.top2.map(T), {
          color: PDF.rgb(0, 0, 0),
          thickness: cfg.strokeThickness || 1,
        });

        const { minY, maxY } = p.bb;
        const h = maxY - minY;
        const inset = h * 0.06;

        const topRange = xRangeAtY(p.top2, maxY - inset);

        let bestBottom = null;
        const yStart = minY + inset;
        const yEnd = minY + h * 0.5;
        const steps = 20;

        for (let s = 0; s <= steps; s++) {
          const y = yStart + ((yEnd - yStart) * s) / steps;
          const r = xRangeAtY(p.top2, y);
          if (!r) continue;
          if (!bestBottom || r.width > bestBottom.width) bestBottom = r;
        }

        if (!topRange || !bestBottom) continue;

        const topLeftY = yRangeAtX(p.top2, topRange.minX)?.maxY ?? (maxY - inset);
        const topRightY = yRangeAtX(p.top2, topRange.maxX)?.maxY ?? (maxY - inset);

        const botLeftY = yRangeAtX(p.top2, bestBottom.minX)?.minY ?? (minY + inset);
        const botRightY = yRangeAtX(p.top2, bestBottom.maxX)?.minY ?? (minY + inset);

        lineV(topRange.minX, foamRect.maxY + EXT, topLeftY, RED);
        lineV(topRange.maxX, foamRect.maxY + EXT, topRightY, RED);

        lineV(bestBottom.minX, botLeftY, foamRect.minY - EXT, RED);
        lineV(bestBottom.maxX, botRightY, foamRect.minY - EXT, RED);

        topXs.push(topRange.minX, topRange.maxX);
        bottomXs.push(bestBottom.minX, bestBottom.maxX);

        const heightX = p.bb.minX - (10 / (fit.s || 1));
        const yHit = yRangeAtX(p.top2, heightX);
        const heightTopY = yHit ? yHit.maxY : p.bb.maxY;
        const heightBotY = yHit ? yHit.minY : p.bb.minY;

        arrowVRed(heightX, heightBotY, heightTopY);

        const topEdge = xRangeAtY(p.top2, heightTopY);
        const botEdge = xRangeAtY(p.top2, heightBotY);

        if (topEdge) lineH(heightX, topEdge.minX, heightTopY, RED);
        if (botEdge) lineH(heightX, botEdge.minX, heightBotY, RED);

        const hLabel = absmm(heightTopY - heightBotY);
        const midY = (heightTopY + heightBotY) / 2;
        const pMid = T([heightX, midY]);
        const w = font.widthOfTextAtSize(hLabel, cfg.fontSize);
        page.drawText(hLabel, {
          x: pMid[0] + 11,
          y: pMid[1] - w / 2,
          size: cfg.fontSize,
          font,
          color: RED,
          rotate: PDF.degrees(90),
        });

        const GAP_AH = 3 / (fit.s || 1);

        const drawGapArrow = (x, y1, y2) => {
          lineV(x, y1, y2, RED);

          const T1 = T([x, y2]);
          drawLine([T1[0], T1[1]], [T1[0] + GAP_AH / 2, T1[1] - GAP_AH], RED);
          drawLine([T1[0], T1[1]], [T1[0] - GAP_AH / 2, T1[1] - GAP_AH], RED);

          const B1 = T([x, y1]);
          drawLine([B1[0], B1[1]], [B1[0] + GAP_AH / 2, B1[1] + GAP_AH], RED);
          drawLine([B1[0], B1[1]], [B1[0] - GAP_AH / 2, B1[1] + GAP_AH], RED);
        };

        drawGapArrow(heightX, heightTopY, foamRect.maxY);
        const topGapLabel = absmm(foamRect.maxY - heightTopY);
        const topGapMid = (foamRect.maxY + heightTopY) / 2;
        const tg = T([heightX, topGapMid]);
        page.drawText(topGapLabel, {
          x: tg[0] + 4,
          y: tg[1] - cfg.fontSize / 2,
          size: cfg.fontSize,
          font,
          color: RED,
        });

        drawGapArrow(heightX, foamRect.minY, heightBotY);
        const botGapLabel = absmm(heightBotY - foamRect.minY);
        const botGapMid = (foamRect.minY + heightBotY) / 2;
        const bg = T([heightX, botGapMid]);
        page.drawText(botGapLabel, {
          x: bg[0] + 4,
          y: bg[1] - cfg.fontSize / 2,
          size: cfg.fontSize,
          font,
          color: RED,
        });
      }

      const topY = foamRect.maxY + EXT;
      const bottomY = foamRect.minY - EXT;

      const tx = uniqSorted(topXs);
      for (let i = 0; i < tx.length - 1; i++) {
        arrowH(tx[i], tx[i + 1], topY, true);
      }

      const bx = uniqSorted(bottomXs);
      for (let i = 0; i < bx.length - 1; i++) {
        arrowH(bx[i], bx[i + 1], bottomY, false);
      }

      lineV(foamRect.minX, foamRect.maxY, foamRect.maxY + EXT, RED);
      lineH(foamRect.minX - EXT, foamRect.minX, foamRect.maxY, RED);

      lineV(foamRect.maxX, foamRect.maxY, foamRect.maxY + EXT, RED);
      lineH(foamRect.maxX, foamRect.maxX + EXT, foamRect.maxY, RED);

      lineV(foamRect.minX, foamRect.minY - EXT, foamRect.minY, RED);
      lineH(foamRect.minX - EXT, foamRect.minX, foamRect.minY, RED);

      lineV(foamRect.maxX, foamRect.minY - EXT, foamRect.minY, RED);
      lineH(foamRect.maxX, foamRect.maxX + EXT, foamRect.minY, RED);

      const cap = "Top View";
      page.drawText(cap, {
        x: boxTop.cx - font.widthOfTextAtSize(cap, cfg.fontSize) / 2,
        y: boxTop.cy - boxTop.h / 2 - 23,
        size: cfg.fontSize,
        font,
      });
    };

    const drawFront = () => {
      const all = [
        [foamRect.minX, 0],
        [foamRect.maxX, foam.sizeZ],
        ...pockets.flatMap((p) => [
          [p.bb.minX, p.depth || 0],
          [p.bb.maxX, p.depth || 0],
        ]),
      ];
      const fit = fit2rect(all, boxFront, 18);
      const T = (p) => fit.transform(p);

      const drawLoopStyled = (pts, thickness = cfg.stroke, color = PDF.rgb(0, 0, 0)) => {
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % pts.length];
          page.drawLine({
            start: { x: a[0], y: a[1] },
            end: { x: b[0], y: b[1] },
            thickness: safeThickness(thickness),
            color,
          });
        }
      };

      drawLoopStyled(
        [
          [foamRect.minX, 0],
          [foamRect.maxX, 0],
          [foamRect.maxX, foam.sizeZ],
          [foamRect.minX, foam.sizeZ],
        ].map(T),
        cfg.stroke,
        PDF.rgb(0, 0, 0)
      );

      pockets.forEach((p) => {
        const depth = p.depth || 0;
        const rect = [
          [p.bb.minX, 0],
          [p.bb.maxX, 0],
          [p.bb.maxX, depth],
          [p.bb.minX, depth],
        ].map(T);

        drawLoopStyled(rect, cfg.stroke, PDF.rgb(0, 0, 0));

        if (depth > 0 && cfg.showDepthInside) {
          const mid = [
            (rect[0][0] + rect[1][0]) / 2,
            (rect[1][1] + rect[2][1]) / 2,
          ];
          const lbl = absmm(depth);
          page.drawText(lbl, {
            x: mid[0] - font.widthOfTextAtSize(lbl, cfg.fontSize) / 2,
            y: mid[1] - cfg.fontSize / 2,
            size: cfg.fontSize,
            font,
            color: PDF.rgb(0, 0, 0),
          });
        }
      });

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
        ...pockets.flatMap((p) => [
          [p.bb.minY, p.depth || 0],
          [p.bb.maxY, p.depth || 0],
        ]),
      ];
      const fit = fit2rect(all, boxSide, 18);
      const T = (p) => fit.transform(p);

      const drawLoopStyled = (pts, thickness = cfg.stroke, color = PDF.rgb(0, 0, 0)) => {
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % pts.length];
          page.drawLine({
            start: { x: a[0], y: a[1] },
            end: { x: b[0], y: b[1] },
            thickness: safeThickness(thickness),
            color,
          });
        }
      };

      drawLoopStyled(
        [
          [foamRect.minY, 0],
          [foamRect.maxY, 0],
          [foamRect.maxY, foam.sizeZ],
          [foamRect.minY, foam.sizeZ],
        ].map(T),
        cfg.stroke,
        PDF.rgb(0, 0, 0)
      );

      pockets.forEach((p) => {
        const depth = p.depth || 0;
        const rect = [
          [p.bb.minY, 0],
          [p.bb.maxY, 0],
          [p.bb.maxY, depth],
          [p.bb.minY, depth],
        ].map(T);

        drawLoopStyled(rect, cfg.stroke, PDF.rgb(0, 0, 0));

        if (depth > 0 && cfg.showDepthInside) {
          const mid = [
            (rect[0][0] + rect[1][0]) / 2,
            (rect[1][1] + rect[2][1]) / 2,
          ];
          const lbl = absmm(depth);
          page.drawText(lbl, {
            x: mid[0] - font.widthOfTextAtSize(lbl, cfg.fontSize) / 2,
            y: mid[1] - cfg.fontSize / 2,
            size: cfg.fontSize,
            font,
            color: PDF.rgb(0, 0, 0),
          });

          const dimX = rect[1][0] + 10;
          page.drawLine({
            start: { x: dimX, y: rect[0][1] },
            end: { x: dimX, y: rect[1][1] },
            thickness: safeThickness(cfg.dimStroke),
            color: PDF.rgb(0, 0, 0),
          });
          page.drawLine({
            start: { x: dimX - 4, y: rect[0][1] },
            end: { x: dimX + 4, y: rect[0][1] },
            thickness: safeThickness(cfg.dimStroke),
            color: PDF.rgb(0, 0, 0),
          });
          page.drawLine({
            start: { x: dimX - 4, y: rect[1][1] },
            end: { x: dimX + 4, y: rect[1][1] },
            thickness: safeThickness(cfg.dimStroke),
            color: PDF.rgb(0, 0, 0),
          });
          page.drawText(lbl, {
            x: dimX + 6,
            y: mid[1] - cfg.fontSize / 2,
            size: cfg.fontSize,
            font,
            color: PDF.rgb(0, 0, 0),
          });
        }
      });

      const cap = "Side View";
      page.drawText(cap, {
        x: boxSide.cx - font.widthOfTextAtSize(cap, cfg.fontSize) / 2,
        y: boxSide.cy - boxSide.h / 2 + 4,
        size: cfg.fontSize,
        font,
      });
    };

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

    drawTop();
    drawIso();
    drawFront();
    drawSide();

    // const bytes = await pdf.save();
    // const blob = new Blob([bytes], { type: "application/pdf" });
    // const a = document.createElement("a");
    // a.href = URL.createObjectURL(blob);
    // a.download = "foam_pockets_projection.pdf";
    // a.click();

    const bytes = await pdf.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };
};
