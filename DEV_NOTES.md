# DEV Notes: Editing/Freehand Interaction Rules

## Scope
This note documents current UI interaction contracts for:
- Point editing (`src/setup/UI.js`, `src/utils/threeFunctions.js`)
- Freehand creation (`src/components/shapes/createShapeFreehand.js`)
- Selection/button state (`src/setup/scene.js`, `src/utils/buttonClick.js`)

## Point Editing Contract
- Enter point edit only for selected polygon.
- On enter:
  - start `pointEditSession`
  - capture snapshot of polygon points
  - switch to 2D/top view
  - enable `Add point` and `Delete point` buttons
- On `Finish Edit`:
  - keep modified points
  - clear snapshot
  - run `doCsg()` + `commit()`
  - exit 2D/edit mode
- On `Back` while editing:
  - cancel session
  - restore snapshot points exactly
  - do **not** persist edits
  - exit edit mode

## Point Interaction Rules
- `Ctrl`/`Cmd + Click` toggles multi-select point set.
- Drag any selected point => all selected points move together.
- `Alt + Click` on point => delete point (minimum polygon point count enforced).
- `Shift + Click` (or add-point mode edge click) => insert point.
- Selected points must stay highlighted.
- Angle labels are hidden during active point-edit mode.

## Freehand Contract
- Entering freehand:
  - disable polygon edit button (`#edit-shape`)
  - keep polygon depth/rotate/delete disabled during drawing/closed-preview state
- Closing loop alone must **not** enable polygon depth/rotate/delete.
- Only after shape creation (`Done`) should polygon actions become enabled for selected polygon.
- Exiting freehand restores previous Back-button behavior and re-enables `#edit-shape`.

## Back Button Ownership Rule
- Any feature that temporarily overrides `#back-button.onclick` must restore previous handler on cleanup.
- Do not leave stale Back handlers after leaving freehand/edit/photoshape flow.

## Selection/Button State Rule
- `updateDeleteButtons(selected)` is source of truth for shape selection button enable/disable.
- For polygon selection, depth/rotate must be enabled.
- For no selection, polygon action buttons must be disabled.

## Smoke Test Checklist (run after edits)
1. Edit points -> drag -> Finish Edit => changes persist.
2. Edit points -> drag/add/delete -> Back => changes revert.
3. Multi-select (`Ctrl`/`Cmd`) + drag => all selected points move.
4. Add/Delete point modes reset when leaving edit mode.
5. Enter/exit edit mode repeatedly => no stale listeners/state.
6. Freehand close loop => polygon depth/rotate/delete still disabled.
7. Freehand Done => selecting created polygon enables expected controls.
8. Back works correctly across freehand, point edit, and normal panel navigation.
