import { structuredClone, updateUndoRedoButtons } from "../utils/common";
import { showPanelFromLeft } from "./panels";
import { state } from "./state";
import { doCsg } from "./csgWorker";
import { cleanupShapeEditArtifacts } from "../utils/threeFunctions";

const MAX_HISTORY = 50;

export function commit() {
  if (state.undoRedoPosition !== state.undoRedoHistory.length - 1) {
    state.undoRedoHistory.splice(state.undoRedoPosition + 1);
  }
  state.undoRedoHistory.push(structuredClone(state.shapesArray));

  if (state.undoRedoHistory.length > MAX_HISTORY) {
    const overflow = state.undoRedoHistory.length - MAX_HISTORY;
    state.undoRedoHistory.splice(0, overflow);
    state.undoRedoPosition = Math.max(0, state.undoRedoPosition - overflow);
  }

  state.undoRedoPosition = state.undoRedoHistory.length - 1;
  updateUndoRedoButtons(state.undoRedoPosition, state.undoRedoHistory);
}

function replaceShapesArray(nextShapes) {
  state.shapesArray.length = 0;
  state.shapesArray.push(...nextShapes);
}

export function undo() {
  if (state.undoRedoPosition > 0) {
    cleanupShapeEditArtifacts(state.shapesArray, state.sceneCopy);
    state.undoRedoPosition -= 1;
    replaceShapesArray(structuredClone(state.undoRedoHistory[state.undoRedoPosition]));
    doCsg();
  }
  updateUndoRedoButtons(state.undoRedoPosition, state.undoRedoHistory);
  document.querySelector("#back-button").setAttribute("disabled", "");
  showPanelFromLeft("main-panel");
  state.selected = null;
}

export function redo() {
  if (state.undoRedoPosition < state.undoRedoHistory.length - 1) {
    cleanupShapeEditArtifacts(state.shapesArray, state.sceneCopy);
    state.undoRedoPosition += 1;
    replaceShapesArray(structuredClone(state.undoRedoHistory[state.undoRedoPosition]));
    doCsg();
  }
  updateUndoRedoButtons(state.undoRedoPosition, state.undoRedoHistory);
  document.querySelector("#back-button").setAttribute("disabled", "");
  showPanelFromLeft("main-panel");
  state.selected = null;
}

