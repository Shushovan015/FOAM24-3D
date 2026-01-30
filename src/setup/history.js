import { structuredClone, updateUndoRedoButtons } from "../utils/common";
import { showPanelFromLeft } from "./panels";
import { state } from "./state";
import { doCsg } from "./csgWorker";

export function commit() {
  if (state.undoRedoPosition !== state.undoRedoHistory.length - 1) {
    state.undoRedoHistory.splice(state.undoRedoPosition + 1);
  }
  state.undoRedoHistory.push(structuredClone(state.shapesArray));
  state.undoRedoPosition = state.undoRedoHistory.length - 1;
  updateUndoRedoButtons(state.undoRedoPosition, state.undoRedoHistory);
}

function replaceShapesArray(nextShapes) {
  state.shapesArray.length = 0;
  state.shapesArray.push(...nextShapes);
}

export function undo() {
  if (state.undoRedoPosition > 0) {
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
    state.undoRedoPosition += 1;
    replaceShapesArray(structuredClone(state.undoRedoHistory[state.undoRedoPosition]));
    doCsg();
  }
  updateUndoRedoButtons(state.undoRedoPosition, state.undoRedoHistory);
  document.querySelector("#back-button").setAttribute("disabled", "");
  showPanelFromLeft("main-panel");
  state.selected = null;
}

