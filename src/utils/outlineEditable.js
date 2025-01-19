export function makeExistingOutlineEditable(
  canvas,
  polygonPoints,
  onPolygonUpdated
) {
  const ctx = canvas.getContext("2d");
  let isDragging = false;
  let draggedPointIndex = -1;

  const pointRadius = 5; // Radius of the draggable points

  // Helper: Redraw the outline and points
  function redrawOutline() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the polygon outline
    ctx.beginPath();
    ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for (let i = 1; i < polygonPoints.length; i++) {
      ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw draggable points
    polygonPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
    });
  }

  // Helper: Find the point under the mouse
  function findPointIndex(mouseX, mouseY) {
    return polygonPoints.findIndex(
      (point) => Math.hypot(point.x - mouseX, point.y - mouseY) <= pointRadius
    );
  }

  // Event: Mouse Down (Start dragging)
  canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const index = findPointIndex(mouseX, mouseY);
    if (index !== -1) {
      isDragging = true;
      draggedPointIndex = index;
    }
  });

  // Event: Mouse Move (Dragging in progress)
  canvas.addEventListener("mousemove", (event) => {
    if (!isDragging || draggedPointIndex === -1) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Update the dragged point's position
    polygonPoints[draggedPointIndex] = { x: mouseX, y: mouseY };
    redrawOutline();
  });

  // Event: Mouse Up (Stop dragging)
  canvas.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      draggedPointIndex = -1;

      // Notify about the updated polygon
      if (onPolygonUpdated) {
        onPolygonUpdated(polygonPoints);
      }
    }
  });

  // Initial draw of the polygon and points
  redrawOutline();
}
