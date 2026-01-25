export const createDFX = (
  foam,
  shapesArray,
  shapeToGeom2,
  filename = "foam_shapes.dxf",
  buttonSelector = "#dfx-button",
) => {
  const btn = document.querySelector(buttonSelector);
  if (!btn) {
    console.error(`Button not found: ${buttonSelector}`);
    return;
  }

  btn.onclick = async () => {
    const foamGeom = shapeToGeom2(foam);
    const foamPts = foamGeom.sides.map(side => side[0]);
    if (foamPts.length && (
      foamPts[0][0] !== foamPts[foamPts.length - 1][0] ||
      foamPts[0][1] !== foamPts[foamPts.length - 1][1]
    )) foamPts.push(foamPts[0]);

    const others = shapesArray.map(shape => {
      const geom = shapeToGeom2(shape);
      const pts = geom.sides.map(side => side[0]);
      if (pts.length && (
        pts[0][0] !== pts[pts.length - 1][0] ||
        pts[0][1] !== pts[pts.length - 1][1]
      )) pts.push(pts[0]);
      return { id: shape.id, pts };
    });

    const xs = foamPts.map(p => p[0]), ys = foamPts.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);

    const push = (arr, code, val) => arr.push(code.toString(), val.toString());
    const lines = [];

    lines.push('0', 'SECTION', '2', 'HEADER');
    push(lines, 9, '$ACADVER'); push(lines, 1, 'AC1009');
    push(lines, 9, '$INSBASE');
    push(lines, 10, 0); push(lines, 20, 0); push(lines, 30, 0);
    push(lines, 9, '$EXTMIN');
    push(lines, 10, minX.toFixed(3)); push(lines, 20, minY.toFixed(3));
    push(lines, 9, '$EXTMAX');
    push(lines, 10, maxX.toFixed(3)); push(lines, 20, maxY.toFixed(3));
    lines.push('0', 'ENDSEC');

    lines.push('0', 'SECTION', '2', 'TABLES');
    lines.push('0', 'TABLE', '2', 'LTYPE', '70', '1');
    lines.push(
      '0', 'LTYPE', '2', 'CONTINUOUS', '70', '64',
      '3', 'Solid line', '72', '65', '73', '0', '40', '0.000'
    );
    lines.push('0', 'ENDTAB');
    lines.push('0', 'TABLE', '2', 'LAYER', '70', '1');
    lines.push('0', 'LAYER', '2', 'Shapes', '70', '64', '62', '7', '6', 'CONTINUOUS');
    lines.push('0', 'ENDTAB');
    lines.push('0', 'TABLE', '2', 'STYLE', '70', '1');
    lines.push(
      '0', 'STYLE', '2', 'STANDARD', '70', '0', '40', '0', '41', '40',
      '50', '50', '71', '0', '42', '1', '3', 'ARIAL.TTF', '4', ''
    );
    lines.push('0', 'ENDTAB');
    lines.push('0', 'TABLE', '2', 'VIEW', '70', '1');
    lines.push(
      '0', 'VIEW', '2', 'Normal', '70', '0', '40', '1',
      '10', '0.500', '20', '0.500', '41', '1',
      '11', '0.000', '21', '0.000', '31', '1.000',
      '12', '0.000', '22', '0.000', '32', '0.000',
      '42', '50', '43', '0', '44', '0', '50', '0', '71', '0'
    );
    lines.push('0', 'ENDTAB');
    lines.push('0', 'ENDSEC');

    lines.push('0', 'SECTION', '2', 'BLOCKS', '0', 'ENDSEC');

    lines.push('0', 'SECTION', '2', 'ENTITIES');
    lines.push('0', 'LWPOLYLINE');
    push(lines, 8, 'Shapes');
    push(lines, 70, '0');
    push(lines, 90, foamPts.length.toString());
    foamPts.forEach(([x, y]) => {
      push(lines, 10, x.toFixed(3));
      push(lines, 20, y.toFixed(3));
    });

    others.forEach(({ id, pts }) => {
      lines.push('0', 'LWPOLYLINE');
      push(lines, 8, 'Shapes');
      push(lines, 70, '0');
      push(lines, 90, pts.length.toString());
      pts.forEach(([x, y]) => {
        push(lines, 10, x.toFixed(3));
        push(lines, 20, y.toFixed(3));
      });
    });

    lines.push('0', 'ENDSEC', '0', 'EOF');

    const dxfString = lines.join('\r\n');
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
};
