import { units } from "../setup/state";
import { getBoundingBox, mouseOverShape, simplifyPointsForDrag } from "./threeFunctions";
import { pointInsidePolygon, structuredClone } from "./common";

const EPS = 0.001;
const MIN_SIZE = 10;
const GAP_MM = 10;

export function cleanShapeRuntimeFields(shape) {
    if (!shape) return;
    delete shape.controlPoints;
    delete shape.cleanup;
    delete shape._controlPointsSetup;
    delete shape._controlPointHandlersInitialized;
    delete shape._selectedPointIndex;
    delete shape._draggingPoint;
    delete shape._dragOriginalPoints;
    delete shape._drawPointsCache;
    delete shape._drawPointsCacheTarget;
    delete shape._pointsDirty;
    delete shape._selectedPointIndices;
}

function boxesOverlap(a, b, eps = EPS) {
    return !(
        a.maxX <= b.minX + eps ||
        a.minX >= b.maxX - eps ||
        a.maxY <= b.minY + eps ||
        a.minY >= b.maxY - eps
    );
}

function isPreviewInsideFoam(copyShape, foam) {
    const foamLeft = foam.x - foam.sizeX / 2;
    const foamRight = foam.x + foam.sizeX / 2;
    const foamBottom = foam.y - foam.sizeY / 2;
    const foamTop = foam.y + foam.sizeY / 2;

    const box = getBoundingBox(copyShape);

    return (
        box.minX >= foamLeft - EPS &&
        box.maxX <= foamRight + EPS &&
        box.minY >= foamBottom - EPS &&
        box.maxY <= foamTop + EPS
    );
}

function isPreviewBlockedByExistingShape(previewShape, occupiedBoxes) {
    const previewBox = getBoundingBox(previewShape);

    for (const { shape, box } of occupiedBoxes) {
        const samePosition =
            Math.abs(shape.x - previewShape.x) < EPS &&
            Math.abs(shape.y - previewShape.y) < EPS;

        if (samePosition || boxesOverlap(previewBox, box)) {
            return true;
        }
    }

    return false;
}

export function buildCopyPreviewShapes({ sourceShape, foam, shapesArray }) {
    const box = getBoundingBox(sourceShape);
    const width = Math.max(MIN_SIZE, box.maxX - box.minX);
    const height = Math.max(MIN_SIZE, box.maxY - box.minY);
    const gap = GAP_MM * units.millimeters;

    const offsets = [
        [width + gap, 0],
        [-(width + gap), 0],
        [0, height + gap],
        [0, -(height + gap)],
    ];

    const occupiedBoxes = shapesArray
        .filter((shape) => shape && shape.id !== sourceShape.id)
        .map((shape) => ({ shape, box: getBoundingBox(shape) }));

    const previews = [];
    const seen = new Set();

    for (const [dx, dy] of offsets) {
        const preview = structuredClone(sourceShape);
        cleanShapeRuntimeFields(preview);

        preview.x = sourceShape.x + dx;
        preview.y = sourceShape.y + dy;

        if (!isPreviewInsideFoam(preview, foam)) continue;
        if (isPreviewBlockedByExistingShape(preview, occupiedBoxes)) continue;

        const key = `${preview.x.toFixed(3)},${preview.y.toFixed(3)}`;
        if (seen.has(key)) continue;
        seen.add(key);

        preview.id = `${sourceShape.id || "shape"}-copy-preview-${previews.length}`;
        previews.push(preview);
    }

    return previews;
}

export function getCopyPreviewUnderMouse({
    copyPlacementActive,
    mouseRayPlaneIntersection,
    copyPreviewShapes,
}) {
    if (!copyPlacementActive || !mouseRayPlaneIntersection) return null;

    for (const preview of copyPreviewShapes.slice().reverse()) {
        if (mouseOverShape(preview, mouseRayPlaneIntersection, pointInsidePolygon)) {
            return preview;
        }
    }

    return null;
}

export function cloneShapeForCopyCommit({ sourceShape, previewShape, generateId }) {
    const newShape = structuredClone(sourceShape);
    cleanShapeRuntimeFields(newShape);
    newShape.id = generateId();
    newShape.x = previewShape.x;
    newShape.y = previewShape.y;
    return newShape;
}

export function getShapeUnderMouse(shapesArray, mouseRayPlaneIntersection) {
    if (!mouseRayPlaneIntersection) return null;

    for (const shape of shapesArray.slice().reverse()) {
        if (mouseOverShape(shape, mouseRayPlaneIntersection, pointInsidePolygon)) {
            return shape;
        }
    }
    return null;
}

export function resolveCopySourceShape({
    selected,
    copyPlacementSourceId,
    shapesArray,
}) {
    if (selected && selected.id === copyPlacementSourceId) return selected;
    return shapesArray.find((s) => s.id === copyPlacementSourceId) || null;
}

export function maybeSimplifyForDrag(shape, maxPoints = 200) {
    if (!shape || shape.kind !== "polygon" || !Array.isArray(shape.points)) return;
    if (shape.points.length <= maxPoints) return;

    if (!shape._dragOriginalPoints) {
        shape._dragOriginalPoints = shape.points;
        shape.points = simplifyPointsForDrag(shape.points, maxPoints);
    }
}

export function restoreAfterDrag(shape) {
    if (!shape || !shape._dragOriginalPoints) return;
    shape.points = shape._dragOriginalPoints;
    delete shape._dragOriginalPoints;
}