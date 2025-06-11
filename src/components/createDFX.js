import DxfWriter from 'dxf-writer';

export function createDFX(foamShapes, filename = 'foam_shapes.dxf') {
  // Attach event listener to the button inside the function
  const button = document.getElementById('dfx-button');
  if (!button) {
    console.error('Button with id "dfx-button" not found.');
    return;
  }

  button.addEventListener('click', () => {
    const dxf = new DxfWriter();
    dxf.setUnits('Millimeters'); 
    dxf.addLayer('Shapes', DxfWriter.ACI.RED, 'CONTINUOUS');

    foamShapes.forEach(shape => {
      if (!shape.polygon || !Array.isArray(shape.polygon) || shape.polygon.length < 3) return;
      dxf.addPolyline(shape.polygon, true);
    });

    const dxfString = dxf.toDxfString();

    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  });
}








// Sets DXF units to Millimeters.

// Adds a layer for shapes.

// Iterates over each shape:

// Validates it's a proper polygon.

// Adds it to the DXF as a closed polyline.

// Converts the DXF to string.

// Triggers a file download using a Blob.

// This is all you need for CNC-compatible DXF files, 
// assuming your shapes are correctly formatted (i.e., as arrays of [x, y] points).

// What the DXF function does not include compared to the PDF:
// No styling (colors, fills — DXF doesn't handle these in a printable way).

// No images or visual decorations.

// No titles, legends, or metadata.

// No scaling or page layout — DXF is not page-based, it's canvas-based.

//  Summary:
//  Yes, the function is complete for generating a DXF from foam shapes.

//  It's smaller than PDF export because DXF is simpler and geometry-focused.

// It produces a CNC-compatible DXF (e.g., for laser cutting or routing).