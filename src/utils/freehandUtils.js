import * as THREE from "three";

export function isValidPolygonPoints(pts) {
    if (!Array.isArray(pts) || pts.length < 3) return false;
    const clean = [];
    for (const p of pts) {
        if (!clean.length) {
            clean.push(p);
            continue;
        }
        const last = clean[clean.length - 1];
        if (last[0] !== p[0] || last[1] !== p[1]) clean.push(p);
    }
    if (clean.length < 3) return false;

    let area = 0;
    for (let i = 0; i < clean.length; i++) {
        const [x1, y1] = clean[i];
        const [x2, y2] = clean[(i + 1) % clean.length];
        area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area) > 1e-6;
}

export function projectToScreen(vec3, camera) {
    const v = vec3.clone().project(camera);
    const x = (v.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-v.y * 0.5 + 0.5) * window.innerHeight;
    return { x, y };
}

export function drawAngleArc(prev, curr, next, angleCtx, angleOverlay, camera) {
    angleCtx.clearRect(0, 0, angleOverlay.width, angleOverlay.height);

    const pPrev = projectToScreen(prev, camera);
    const pCurr = projectToScreen(curr, camera);
    const pNext = projectToScreen(next, camera);

    const v1x = pPrev.x - pCurr.x;
    const v1y = pPrev.y - pCurr.y;
    const v2x = pNext.x - pCurr.x;
    const v2y = pNext.y - pCurr.y;

    const len1 = Math.hypot(v1x, v1y);
    const len2 = Math.hypot(v2x, v2y);
    if (len1 === 0 || len2 === 0) return;

    const dot = (v1x * v2x + v1y * v2y) / (len1 * len2);
    const angleDeg = THREE.MathUtils.radToDeg(
        Math.acos(THREE.MathUtils.clamp(dot, -1, 1))
    );

    const a1 = Math.atan2(v1y, v1x);
    const a2 = Math.atan2(v2y, v2x);

    let delta = a2 - a1;
    while (delta <= -Math.PI) delta += Math.PI * 2;
    while (delta > Math.PI) delta -= Math.PI * 2;

    const start = a1;
    const end = a1 + delta;
    const anticlockwise = delta < 0;

    const dpr = window.devicePixelRatio || 1;
    const radius = 30 * dpr;

    angleCtx.save();
    angleCtx.setTransform(1, 0, 0, 1, 0, 0);
    angleCtx.scale(dpr, dpr);
    angleCtx.strokeStyle = "yellow";
    angleCtx.fillStyle = "yellow";
    angleCtx.lineWidth = 2;

    angleCtx.beginPath();
    angleCtx.arc(pCurr.x, pCurr.y, radius / dpr, start, end, anticlockwise);
    angleCtx.stroke();

    const mid = (start + end) / 2;
    const lx = pCurr.x + Math.cos(mid) * 40;
    const ly = pCurr.y + Math.sin(mid) * 40;

    angleCtx.font = "bold 16px sans-serif";
    angleCtx.strokeStyle = "black";
    angleCtx.lineWidth = 3;
    angleCtx.strokeText(`${angleDeg.toFixed(1)}°`, lx, ly);
    angleCtx.fillText(`${angleDeg.toFixed(1)}°`, lx, ly);
    angleCtx.restore();
}

export function buildPreviewMesh(points, objectZ) {
    const newPoints = points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    const shape = new THREE.Shape(newPoints.map((p) => new THREE.Vector2(p.x, p.y)));
    const extrudeSettings = { depth: 0, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = objectZ;
    return mesh;
}

export function makePolygonShape(points, millimeters) {
    return {
        id: `shape-${Date.now()}`,
        kind: "polygon",
        x: 0,
        y: 0,
        sizeZ: 300 * millimeters,
        sizeX: 200 * millimeters,
        sizeY: 200 * millimeters,
        points,
        rotation: 0,
        free: true,
    };
}

export function showToast(message, opts = {}) {
    const {
        top = "16px",
        duration = 2000,
        background = "#1e7d34",
        color = "#fff",
    } = opts;

    const msg = document.createElement("div");
    msg.textContent = message;
    Object.assign(msg.style, {
        position: "fixed",
        top,
        left: "50%",
        transform: "translateX(-50%)",
        background,
        color,
        padding: "10px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        zIndex: 10000,
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), duration);
}

export function getFoamWorldBox(foamMesh) {
    foamMesh.geometry.computeBoundingBox();
    const box = foamMesh.geometry.boundingBox.clone();
    foamMesh.updateMatrixWorld();
    box.applyMatrix4(foamMesh.matrixWorld);
    return box;
}

export function createDistanceTextElement() {
    const distanceText = document.createElement("div");
    Object.assign(distanceText.style, {
        position: "absolute",
        top: "10px",
        left: "10px",
        color: "white",
    });
    document.body.appendChild(distanceText);
    return distanceText;
}

export function createAngleOverlayCanvas() {
    const angleOverlay = document.createElement("canvas");
    angleOverlay.style.position = "absolute";
    angleOverlay.style.top = "0";
    angleOverlay.style.left = "0";
    angleOverlay.style.pointerEvents = "none";
    angleOverlay.style.zIndex = "10";
    document.body.appendChild(angleOverlay);
    return angleOverlay;
}

export function resizeOverlayCanvas(overlay) {
    overlay.width = window.innerWidth * (window.devicePixelRatio || 1);
    overlay.height = window.innerHeight * (window.devicePixelRatio || 1);
    overlay.style.width = window.innerWidth + "px";
    overlay.style.height = window.innerHeight + "px";
}

export function disposeObject3D(obj) {
    if (!obj) return;
    if (obj.geometry && typeof obj.geometry.dispose === "function") {
        obj.geometry.dispose();
    }
    if (obj.material) {
        if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m && m.dispose && m.dispose());
        } else if (typeof obj.material.dispose === "function") {
            obj.material.dispose();
        }
    }
}

export function disposeListFromScene(scene, list) {
    list.forEach((obj) => {
        scene.remove(obj);
        disposeObject3D(obj);
    });
}

export function createFreehandPoint(point, zOffset = 1) {
    const geometry = new THREE.CircleGeometry(3, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.set(point.x, point.y, point.z + zOffset);
    return circle;
}

export function createFreehandSegment(points) {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffa500, linewidth: 15 });
    return new THREE.Line(lineGeometry, lineMaterial);
}
