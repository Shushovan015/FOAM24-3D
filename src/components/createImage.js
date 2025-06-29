import * as THREE from "three";

export function createImage(
  renderer,
  scene,
  camera,
  { buttonId = "export-image", scaleFactor = 4, filename = "foam-hd.png" } = {}
) {
  const btn = document.getElementById(buttonId);
  if (!btn) {
    console.error(`createImage: no button found with id="${buttonId}"`);
    return;
  }

  btn.addEventListener("click", () => {
    const origSize = renderer.getSize(new THREE.Vector2());
    const origDPR = renderer.getPixelRatio();

    const width = origSize.x * scaleFactor;
    const height = origSize.y * scaleFactor;

    const rt = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      encoding: renderer.outputEncoding,
      samples: 0,
    });

    // 4) render scene into the RT
    renderer.setRenderTarget(rt);
    renderer.setPixelRatio(origDPR);
    renderer.setSize(width, height, false);

    if (camera.isPerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    const buffer = new Uint8Array(width * height * 4);
    renderer.readRenderTargetPixels(rt, 0, 0, width, height, buffer);

    const rowBytes = width * 4;
    for (let y = 0; y < height / 2; y++) {
      const topRowOffset = y * rowBytes;
      const botRowOffset = (height - y - 1) * rowBytes;
      for (let i = 0; i < rowBytes; i++) {
        const tmp = buffer[topRowOffset + i];
        buffer[topRowOffset + i] = buffer[botRowOffset + i];
        buffer[botRowOffset + i] = tmp;
      }
    }

    renderer.setRenderTarget(null);
    rt.dispose();

    const canvas2d = document.createElement("canvas");
    canvas2d.width = width;
    canvas2d.height = height;
    const ctx = canvas2d.getContext("2d");
    const imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);
    ctx.putImageData(imageData, 0, 0);

    canvas2d.toBlob((blob) => {
      if (!blob) {
        console.error("createImage: toBlob returned null");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      renderer.setPixelRatio(origDPR);
      renderer.setSize(origSize.x, origSize.y, false);
      if (camera.isPerspectiveCamera) {
        camera.aspect = origSize.x / origSize.y;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
    }, "image/png");
  });
}
