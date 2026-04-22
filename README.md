# FOAM24-3D Shape Editor

FOAM24-3D is a browser-based 3D editor for designing custom foam inserts around real product cases. Users can create and adjust cutout shapes, preview results in 3D, and export manufacturing-ready outputs.

<!-- ## Screenshots

Add screenshots in `docs/screenshots/` and keep these names to render automatically in this README.

![Main editor](docs/screenshots/main-editor.png)
![Shape controls](docs/screenshots/shape-controls.png)
![Photoshape flow](docs/screenshots/photoshape-flow.png)
![PDF export preview](docs/screenshots/pdf-export.png) -->

## What Problem This Solves

Designing protective foam inserts manually is slow and error-prone when done in generic CAD tools.

This project solves that by providing a focused workflow for:
- Building foam cutouts directly on top of case dimensions
- Editing shapes interactively (circle, rectangle, freehand, photo-derived)
- Running live CSG subtraction previews
- Exporting outputs for production documentation (PDF) and geometry handoff (DXF)

## Tech Stack

Frontend:
- JavaScript (ES modules)
- Three.js for 3D scene rendering and interaction
- Vite for local dev/build pipeline

Geometry and export:
- `@jscad/modeling` for CSG operations
- `dxf-writer` for DXF generation
- `pdf-lib` for PDF export
- `martinez-polygon-clipping` and `earcut` for polygon processing

Photo contour workflow:
- remove.bg API integration (background removal)
- Optional Python Flask microservice (`src/outline_detection_service`) with OpenCV for contour detection

## Architecture Decisions

1. Three.js-first interaction model
The app keeps direct, imperative control of the scene and interaction states instead of introducing a UI framework. This reduces abstraction overhead for complex 3D editing behavior.

2. CSG offloaded to a Web Worker
Boolean geometry updates run in `src/setup/csgWorker.js` and `csg.js` so UI interactions remain responsive during expensive recomputation.

3. Centralized mutable editor state
`src/setup/state.js` holds editor-wide runtime state (foam config, selected shape, undo history, camera references). This keeps multi-panel UI and scene behavior synchronized.

4. Action-based history snapshots
Undo/redo is implemented via commit snapshots in `src/setup/history.js` with bounded history (`MAX_HISTORY`) for predictable memory usage.

5. Optional decoupled contour service
Photo contour extraction is handled by a separate Flask service. The frontend can point to local or remote endpoints using `VITE_CONTOUR_API_BASE`, keeping deployment flexible.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Run the frontend

```bash
npm install
npm run dev
```

Open `http://localhost:5174`.

### Build for production

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env.local` file if needed:

```env
VITE_REMOVE_BG_KEY=your_remove_bg_key
VITE_CONTOUR_API_BASE=http://localhost:5000
```

## Optional: Run Contour Detection Service

The service is located at `src/outline_detection_service`.

```bash
cd src/outline_detection_service
pip install -r requirements.txt
python app.py
```

Default endpoint: `http://localhost:5000/detect_contours`

## Project Structure

```text
src/
  components/                 UI + creation/export modules
  setup/                      scene bootstrap, state, UI wiring, worker bridge
  utils/                      geometry, camera, interaction, photoshape helpers
  outline_detection_service/  optional Flask + OpenCV service
models/                       OBJ case models
```
