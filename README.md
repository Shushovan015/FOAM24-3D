# FOAM24-3D Shape Editor

FOAM24-3D Shape Editor is a web-based 3D design application built using **Three.js**. It allows users to create, manipulate, and visualize 3D shapes in real time through an intuitive and interactive interface. The tool supports drawing basic and freehand shapes, modifying dimensions and rotations, and exporting designs.

---

## 🚀 Features

- Create circles, rectangles, and freehand 3D shapes
- Modify width, height, depth, and rotation in real time
- Undo and redo actions
- Export 3D designs to PDF
- Clean and intuitive user interface

---

## 🧰 Tech Stack

- **Three.js**
- **JavaScript / HTML / CSS**
- **Node.js & npm**

---

## 📦 Prerequisites

Make sure you have the following installed:

- **Node.js** v14.0.0 or higher
- **npm** v6.0.0 or higher

---

## 🏁 Getting Started

Follow the steps below to run the project locally:

```bash
# Clone the repository
git clone https://github.com/MA-INDUSTRIE/FOAM24-3D-V3-Shakya-

# Navigate to the project directory
cd FOAM24-3D-V3-Shakya-

# Install dependencies
npm install

# Run the development server
npm run dev


Once running, open **http://localhost:5174** in your browser.


## 🏗️ Build for Production

To create a production build:

```bash
npm run build


## 📁 Project Structure

```text
FOAM24-3D-V3-Shakya-
│
├── public/                 # Static files and assets
│   └── index.html
│
├── src/                    # Application source code
│   ├── components/         # Reusable UI and 3D components
│   ├── utils/              # Helper functions and utilities
│   ├── styles/             # Global and component styles
│   ├── main.js             # Application entry point
│   └── scene.js            # Three.js scene setup and rendering
│
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Dependency lock file
├── README.md               # Project documentation
└── LICENSE                 # License information