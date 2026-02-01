import { getBoundingBox } from "./threeFunctions";

export const getPhotoshapeNextLabel = (session) =>
    session.index < session.order.length - 1 ? "Next" : "Finish";

export const getPhotoshapeDepthLabel = (session) =>
    session.index < session.order.length - 1 ? "Next Shape" : "Finish";

export const rebuildOrderAndIndex = (session, shapesArray, selected) => {
    session.order = session.ids
        .map((id) => shapesArray.find((s) => s.id === id))
        .filter(Boolean)
        .sort((a, b) => getBoundingBox(a).minX - getBoundingBox(b).minX)
        .map((s) => s.id);

    if (selected && selected.id) {
        const idx = session.order.indexOf(selected.id);
        session.index = idx !== -1 ? idx : 0;
    } else {
        session.index = 0;
    }
};

export const beginPhotoshapeEditSession = (session, shapesArray, selected) => {
    rebuildOrderAndIndex(session, shapesArray, selected);
};

export const selectPhotoshapeByIndex = (
    idx,
    session,
    shapesArray,
    setSelected,
    callback,
    showPanelFromRight
) => {
    if (!session.order.length) return false;
    if (idx < 0 || idx >= session.order.length) return false;

    const id = session.order[idx];
    const nextShape = shapesArray.find((s) => s.id === id);
    if (!nextShape) return false;

    setSelected(nextShape);
    session.index = idx;
    callback(nextShape);

    showPanelFromRight(nextShape.kind + "-panel");
    return true;
};

export const advanceToNextUnvisited = (
    session,
    shapesArray,
    selected,
    setSelected,
    callback,
    showPanelFromRight
) => {
    rebuildOrderAndIndex(session, shapesArray, selected);

    const nextIdx = session.index + 1;
    if (nextIdx >= session.order.length) return false;

    return selectPhotoshapeByIndex(
        nextIdx,
        session,
        shapesArray,
        setSelected,
        callback,
        showPanelFromRight
    );
};
