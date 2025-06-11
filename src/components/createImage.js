import * as THREE from "three";

export function createImage(renderer, scene, camera) {
    const exportBtn = document.getElementById("export-image");
  
    if (!exportBtn) {
      console.error("Export button not found");
      return;
    }
  
    exportBtn.addEventListener("click", () => {
      const canvas = document.getElementById("foam-canvas");
  
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }
  
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;
  
      // High-resolution scale factor
      const scaleFactor = 4;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = originalWidth * scaleFactor;
      tempCanvas.height = originalHeight * scaleFactor;
      const tempCtx = tempCanvas.getContext("2d");
  
      // Save previous renderer state
      const prevSize = renderer.getSize(new THREE.Vector2());
      const prevPixelRatio = renderer.getPixelRatio();
  
      // Set renderer to high resolution temporarily
      renderer.setSize(tempCanvas.width, tempCanvas.height, false);
      renderer.setPixelRatio(1);
      renderer.render(scene, camera);
  
      // Draw the rendered image to the temp canvas
      tempCtx.drawImage(renderer.domElement, 0, 0, tempCanvas.width, tempCanvas.height);
  
      // Restore original renderer state
      renderer.setSize(prevSize.x, prevSize.y, false);
      renderer.setPixelRatio(prevPixelRatio);
  
      // Convert to image and trigger download
      tempCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "foam-shape.png";
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    });
  }
  