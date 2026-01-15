import axios from "axios";
import * as getImageOutline from "image-outline";
import { getBase64, generateId } from "../../utils/common";

// export const createShapePhotoShape = (
//   millimeters,
//   selected,
//   shapesArray,
//   commit,
//   showPanelFromLeft,
//   showPanelFromRight,
//   doCsg,
//   display2D,
//   callback,
//   callback1,
//   camera,
//   renderer,
//   scene
//   // createEditor
// ) => {
//   const stepUI = {
//     container: document.querySelector("#photoshape-stepper"),
//     steps: Array.from(document.querySelectorAll("[data-photoshape-step]")),
//     note: document.querySelector("#photoshape-step-note"),
//     back: document.querySelector("#photoshape-step-back"),
//     next: document.querySelector("#photoshape-step-next"),
//   };

//   let photoshapeFlowActive = false;
//   let photoshapeFlowReady = false;
//   let photoshapeStep = 1;

//   const setPhotoshapeFlowActive = (active) => {
//     photoshapeFlowActive = active;
//     if (stepUI.container) {
//       stepUI.container.style.display = active ? "block" : "none";
//     }
//   };

//   const setPhotoshapeStep = (step, options = {}) => {
//     photoshapeStep = step;

//     if (stepUI.note && typeof options.note === "string") {
//       stepUI.note.textContent = options.note;
//     }
//     if (stepUI.back && typeof options.canBack === "boolean") {
//       stepUI.back.disabled = !options.canBack;
//     }
//     if (stepUI.next && typeof options.canNext === "boolean") {
//       stepUI.next.disabled = !options.canNext;
//     }
//     if (stepUI.next && typeof options.nextLabel === "string") {
//       stepUI.next.textContent = options.nextLabel;
//     }
//     if (stepUI.back && typeof options.backLabel === "string") {
//       stepUI.back.textContent = options.backLabel;
//     }

//     if (stepUI.steps && stepUI.steps.length) {
//       stepUI.steps.forEach((el) => {
//         const stepNum = parseInt(el.getAttribute("data-photoshape-step"), 10);
//         if (!Number.isNaN(stepNum)) {
//           el.style.opacity = stepNum <= photoshapeStep ? "1" : "0.35";
//           el.style.fontWeight = stepNum === photoshapeStep ? "700" : "400";
//         }
//       });
//     }
//   };

//   setPhotoshapeFlowActive(false);
//   setPhotoshapeStep(1, {
//     note: "Upload an image to start.",
//     canBack: false,
//     canNext: false,
//     nextLabel: "Edit",
//   });

//   if (stepUI.back) {
//     stepUI.back.addEventListener("click", () => {
//       if (!photoshapeFlowActive) return;

//       if (photoshapeStep === 3) {
//         callback1(false);
//         setPhotoshapeStep(2, {
//           note: "Outline ready. Click Edit to adjust points.",
//           canBack: true,
//           canNext: true,
//           nextLabel: "Edit",
//         });
//       } else if (photoshapeStep === 2) {
//         setPhotoshapeStep(1, {
//           note: "Upload an image to start.",
//           canBack: false,
//           canNext: false,
//           nextLabel: "Edit",
//         });
//       }
//     });
//   }

//   if (stepUI.next) {
//     stepUI.next.addEventListener("click", () => {
//       if (!photoshapeFlowActive) return;

//       if (photoshapeStep === 2) {
//         callback1(true);
//         setPhotoshapeStep(3, {
//           note: "Edit outline: drag the red points.",
//           canBack: true,
//           canNext: true,
//           nextLabel: "Finish",
//         });
//         showPanelFromLeft("upload-photo-panel");
//       } else if (photoshapeStep === 3) {
//         callback1(false);
//         setPhotoshapeStep(2, {
//           note: "Outline ready. Click Edit to adjust again.",
//           canBack: true,
//           canNext: true,
//           nextLabel: "Edit",
//         });
//         setPhotoshapeFlowActive(false);
//         if (selected) {
//           showPanelFromRight(selected.kind + "-panel");
//         }
//       }
//     });
//   }

//   const editShapeButton = document.querySelector("#edit-shape");
//   if (editShapeButton) {
//     editShapeButton.addEventListener("click", () => {
//       if (!photoshapeFlowReady) return;

//       setPhotoshapeFlowActive(true);
//       setPhotoshapeStep(3, {
//         note: "Edit outline: drag the red points.",
//         canBack: true,
//         canNext: true,
//         nextLabel: "Finish",
//       });
//       showPanelFromLeft("upload-photo-panel");
//     });
//   }


//   document.querySelector("#upload-photo-input").onchange = (e) => {
//     setPhotoshapeFlowActive(true);
//     setPhotoshapeStep(1, {
//       note: "Upload an image to start.",
//       canBack: false,
//       canNext: false,
//       nextLabel: "Edit",
//     });
//     photoshapeFlowReady = false;
//     callback1(false);

//     document.querySelector("#back-button").removeAttribute("disabled");
//     document.querySelector("#back-button").onclick = () => {
//       document.querySelector("#back-button").setAttribute("disabled", "");
//       showPanelFromLeft("main-panel");
//       callback1(false);
//       selected = null;
//       setPhotoshapeFlowActive(false);
//       photoshapeFlowReady = false;
//       setPhotoshapeStep(1, {
//         note: "Upload an image to start.",
//         canBack: false,
//         canNext: false,
//         nextLabel: "Edit",
//       });

//     };
//     document.querySelector("#edit-shape").onclick = () => {
//       callback1(true);
//     };
//     const file = e.target.files[0];
//     if (file) {
//       // Display the selected image
//       const imgElement = document.getElementById("upload-photo-img");
//       const reader = new FileReader();
//       setPhotoshapeStep(2, {
//         note: "Removing background and detecting outline...",
//         canBack: true,
//         canNext: false,
//         nextLabel: "Edit",
//       });

//       reader.onload = function (e) {
//         imgElement.src = e.target.result;

//         // After the image is loaded, upload it
//         uploadImage(file, e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }

//     function uploadImage(file, imageSrc) {
//       setPhotoshapeStep(2, {
//         note: "Removing background and detecting outline...",
//         canBack: true,
//         canNext: false,
//         nextLabel: "Edit",
//       });

//       getBase64(file)
//         .then((base64Image) => {
//           // Send the image to Remove.bg API to remove the background
//           return fetch("https://api.remove.bg/v1.0/removebg", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               // "X-API-Key": "ivUjq457ecL51sn2vzD2umUw",
//               "X-API-Key": "y7X524wbiR3cUWL9AinkUAqq",
//             },
//             body: JSON.stringify({
//               image_file_b64: base64Image,
//             }),
//           });
//         })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Failed to remove background");
//           }
//           return response.blob();
//         })
//         .then((blob) => {
//           // Convert the blob back to a file and send it to the contour detection API
//           const formData = new FormData();
//           formData.append("image", blob, "image.png");

//           return fetch("http://localhost:5000/detect_contours", {
//             // return fetch("https://fm24api.com/detect_contours", {

//             method: "POST",
//             body: formData,
//           });
//         })
//         .then((response) => response.json())
//         .then((data) => {
//           const contoursData = data?.contours;
//           if (contoursData) {
//             createShape(contoursData, imageSrc);
//           } else {
//             console.error("Contours data is null");
//           }
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//         });
//     }

//     function createShape(contoursData, imageSrc) {
//       const imgElement = document.querySelector("#upload-photo-img");

//       imgElement.onload = () => {
//         // let shape = {
//         //   kind: "photoshape",
//         //   x: 0, // mouseRayPlaneIntersection.x,
//         //   y: 0, // mouseRayPlaneIntersection.y,
//         //   sizeZ: 300 * millimeters,
//         //   sizeX: 200 * millimeters,
//         //   sizeZ: 250 * millimeters,
//         //   polygon: contoursData,
//         //   rotation: 0,
//         // };
//         // shapesArray.push(shape);
//         // commit();
//         // selected = shape;
//         // showPanelFromRight(selected.kind + "-panel");
//         // doCsg();

//         // // Call the callback with the modified selected variable
//         // callback(selected);

//         contoursData.forEach((contour, index) => {
//           let shape = {
//             id: generateId(),
//             kind: "polygon",
//             x: -225, // Update x based on requirements
//             y: -225, // Update y based on requirements
//             sizeZ: 300 * millimeters,
//             sizeX: 200 * millimeters,
//             sizeY: 250 * millimeters,
//             points: contour, // Each contour as the polygon
//             rotation: 0,
//             free: true,
//           };

//           shapesArray.push(shape);
//           // Set the first shape as selected
//           if (index === 0) {
//             selected = shape;
//             showPanelFromRight(selected.kind + "-panel");
//             doCsg();
//             callback(selected); // Call the callback with the first selected shape
//           }
//         });
//         commit();
//         photoshapeFlowReady = true;
//         setPhotoshapeFlowActive(true);
//         setPhotoshapeStep(2, {
//           note: "Outline ready. Click Edit to adjust points.",
//           canBack: true,
//           canNext: true,
//           nextLabel: "Edit",
//         });
//         showPanelFromLeft("upload-photo-panel");

//       };
//       // Set the image source to trigger the onload event
//       imgElement.src = imageSrc;
//     }
//   };
// };


export const createShapePhotoShape = (
  millimeters,
  selected,
  shapesArray,
  commit,
  showPanelFromLeft,
  showPanelFromRight,
  doCsg,
  display2D,
  callback,
  callback1,
  camera,
  renderer,
  scene
  // createEditor
) => {
  const stepUI = {
    container: document.querySelector("#photoshape-stepper"),
    steps: Array.from(document.querySelectorAll("[data-photoshape-step]")),
    note: document.querySelector("#photoshape-step-note"),
    back: document.querySelector("#photoshape-step-back"),
    next: document.querySelector("#photoshape-step-next"),
  };

  let photoshapeFlowActive = false;
  let photoshapeFlowReady = false;
  let photoshapeStep = 1;

  const setPhotoshapeFlowActive = (active) => {
    photoshapeFlowActive = active;
    if (stepUI.container) {
      stepUI.container.style.display = active ? "block" : "none";
    }
  };

  const setPhotoshapeStep = (step, options = {}) => {
    photoshapeStep = step;

    if (stepUI.note && typeof options.note === "string") {
      stepUI.note.textContent = options.note;
    }
    if (stepUI.back && typeof options.canBack === "boolean") {
      stepUI.back.disabled = !options.canBack;
    }
    if (stepUI.next && typeof options.canNext === "boolean") {
      stepUI.next.disabled = !options.canNext;
    }
    if (stepUI.next && typeof options.nextLabel === "string") {
      stepUI.next.textContent = options.nextLabel;
    }
    if (stepUI.back && typeof options.backLabel === "string") {
      stepUI.back.textContent = options.backLabel;
    }

    if (stepUI.steps && stepUI.steps.length) {
      stepUI.steps.forEach((el) => {
        const stepNum = parseInt(el.getAttribute("data-photoshape-step"), 10);
        if (!Number.isNaN(stepNum)) {
          el.style.opacity = stepNum <= photoshapeStep ? "1" : "0.35";
          el.style.fontWeight = stepNum === photoshapeStep ? "700" : "400";
        }
      });
    }
  };

  const photoshapeSession = {
    ids: [],
    index: 0,
  };

  const selectPhotoshapeByIndex = (idx) => {
    if (!photoshapeSession.ids.length) return;
    const id = photoshapeSession.ids[idx];
    const nextShape = shapesArray.find((s) => s.id === id);
    if (!nextShape) return;
    selected = nextShape;
    callback(selected);
    showPanelFromRight(selected.kind + "-panel");
  };

  const getPhotoshapeNextLabel = () => {
    if (!photoshapeSession.ids.length) return "Finish";
    return photoshapeSession.index < photoshapeSession.ids.length - 1
      ? "Next"
      : "Finish";
  };

  photoshapeSession.visited = new Set();
  photoshapeSession.remaining = 0;

  const beginPhotoshapeEditSession = () => {
    photoshapeSession.visited.clear();
    photoshapeSession.remaining = photoshapeSession.ids.length;
    let startIdx = 0;
    if (selected && selected.id) {
      const idx = photoshapeSession.ids.indexOf(selected.id);
      if (idx !== -1) startIdx = idx;
    }
    photoshapeSession.index = startIdx;
  };

  const markCurrentAsVisited = () => {
    const id = photoshapeSession.ids[photoshapeSession.index];
    if (id && !photoshapeSession.visited.has(id)) {
      photoshapeSession.visited.add(id);
      photoshapeSession.remaining = Math.max(0, photoshapeSession.remaining - 1);
    }
  };

  const findNextUnvisitedIndex = () => {
    const total = photoshapeSession.ids.length;
    for (let step = 1; step <= total; step++) {
      const idx = (photoshapeSession.index + step) % total;
      const id = photoshapeSession.ids[idx];
      if (!photoshapeSession.visited.has(id)) return idx;
    }
    return -1;
  };

  const advanceToNextUnvisited = () => {
    markCurrentAsVisited();
    if (photoshapeSession.remaining <= 0) return false;
    const nextIdx = findNextUnvisitedIndex();
    if (nextIdx === -1) return false;
    photoshapeSession.index = nextIdx;
    selectPhotoshapeByIndex(nextIdx);
    return true;
  };

  const getPhotoshapeNextLabelCycle = () => {
    return photoshapeSession.remaining > 1 ? "Next" : "Finish";
  };



  setPhotoshapeFlowActive(false);
  setPhotoshapeStep(1, {
    note: "Upload an image to start.",
    canBack: false,
    canNext: false,
    nextLabel: "Edit",
  });

  if (stepUI.back) {
    stepUI.back.addEventListener("click", () => {
      if (!photoshapeFlowActive) return;

      if (photoshapeStep === 3) {
        callback1(false);
        setPhotoshapeStep(2, {
          note: "Outline ready. Click Edit to adjust points.",
          canBack: true,
          canNext: true,
          nextLabel: "Edit",
        });
      } else if (photoshapeStep === 2) {
        setPhotoshapeStep(1, {
          note: "Upload an image to start.",
          canBack: false,
          canNext: false,
          nextLabel: "Edit",
        });
      }
    });
  }

  if (stepUI.next) {
    stepUI.next.addEventListener("click", () => {
      if (!photoshapeFlowActive) return;
      if (photoshapeStep === 3 && photoshapeSession.ids.length) {
        const moved = advanceToNextUnvisited();
        if (moved) {
          callback1(true);
          setPhotoshapeStep(3, {
            note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.ids.length}`,
            canBack: true,
            canNext: true,
            nextLabel: getPhotoshapeNextLabelCycle(),
          });
          showPanelFromLeft("upload-photo-panel");
          return;
        }
      }

      if (
        photoshapeStep === 3 &&
        photoshapeSession.ids.length > 0 &&
        photoshapeSession.index < photoshapeSession.ids.length - 1
      ) {
        photoshapeSession.index += 1;
        selectPhotoshapeByIndex(photoshapeSession.index);
        callback1(true);
        setPhotoshapeStep(3, {
          note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.ids.length}`,
          canBack: true,
          canNext: true,
          nextLabel: getPhotoshapeNextLabel(),
        });
        showPanelFromLeft("upload-photo-panel");
        return;
      }


      if (photoshapeStep === 2) {
        callback1(true);
        setPhotoshapeStep(3, {
          note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.ids.length}`,
          canBack: true,
          canNext: true,
          nextLabel: getPhotoshapeNextLabel(),
        });
        beginPhotoshapeEditSession();
        setPhotoshapeStep(3, {
          note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.ids.length}`,
          canBack: true,
          canNext: true,
          nextLabel: getPhotoshapeNextLabelCycle(),
        });


        showPanelFromLeft("upload-photo-panel");
      } else if (photoshapeStep === 3) {
        callback1(false);
        setPhotoshapeStep(2, {
          note: "Outline ready. Click Edit to adjust again.",
          canBack: true,
          canNext: true,
          nextLabel: "Edit",
        });
        setPhotoshapeFlowActive(false);
        document.getElementById("photoshape-step-note").style.display = `none`;
        document.getElementById("photoshape-button").style.display = `none`;
        if (selected) {
          showPanelFromRight(selected.kind + "-panel");
        }
      }
    });
  }

  const editShapeButton = document.querySelector("#edit-shape");
  if (editShapeButton) {
    editShapeButton.addEventListener("click", () => {
      if (!photoshapeFlowReady) return;

      setPhotoshapeFlowActive(true);
      setPhotoshapeStep(3, {
        note: "Edit outline: drag the red points.",
        canBack: true,
        canNext: true,
        nextLabel: "Finish",
      });
      setPhotoshapeStep(3, {
        note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.ids.length}`,
        canBack: true,
        canNext: true,
        nextLabel: getPhotoshapeNextLabel(),
      });
      beginPhotoshapeEditSession();
      setPhotoshapeStep(3, {
        note: `Edit outline: shape ${photoshapeSession.index + 1} of ${photoshapeSession.ids.length}`,
        canBack: true,
        canNext: true,
        nextLabel: getPhotoshapeNextLabelCycle(),
      });


      showPanelFromLeft("upload-photo-panel");
    });
  }


  document.querySelector("#upload-photo-input").onchange = (e) => {
    photoshapeSession.ids = [];
    photoshapeSession.index = 0;

    setPhotoshapeFlowActive(true);
    setPhotoshapeStep(1, {
      note: "Upload an image to start.",
      canBack: false,
      canNext: false,
      nextLabel: "Edit",
    });
    photoshapeFlowReady = false;
    document.getElementById("photoshape-step-note").style.display = `flex`;
    document.getElementById("photoshape-button").style.display = `flex`;
    callback1(false);

    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      document.getElementById("photoshape-step-note").style.display = `none`;
      document.getElementById("photoshape-button").style.display = `none`;
      showPanelFromLeft("main-panel");
      callback1(false);
      selected = null;
      setPhotoshapeFlowActive(false);
      photoshapeFlowReady = false;
      setPhotoshapeStep(1, {
        note: "Upload an image to start.",
        canBack: false,
        canNext: false,
        nextLabel: "Edit",
      });

    };
    document.querySelector("#edit-shape").onclick = () => {
      callback1(true);
    };
    const file = e.target.files[0];
    if (file) {
      // Display the selected image
      const imgElement = document.getElementById("upload-photo-img");
      const reader = new FileReader();
      setPhotoshapeStep(2, {
        note: "Removing background and detecting outline...",
        canBack: true,
        canNext: false,
        nextLabel: "Edit",
      });

      reader.onload = function (e) {
        imgElement.src = e.target.result;

        // After the image is loaded, upload it
        uploadImage(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }

    function uploadImage(file, imageSrc) {
      setPhotoshapeStep(2, {
        note: "Removing background and detecting outline...",
        canBack: true,
        canNext: false,
        nextLabel: "Edit",
      });

      getBase64(file)
        .then((base64Image) => {
          // Send the image to Remove.bg API to remove the background
          return fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // "X-API-Key": "ivUjq457ecL51sn2vzD2umUw",
              "X-API-Key": "y7X524wbiR3cUWL9AinkUAqq",
            },
            body: JSON.stringify({
              image_file_b64: base64Image,
            }),
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to remove background");
          }
          return response.blob();
        })
        .then((blob) => {
          // Convert the blob back to a file and send it to the contour detection API
          const formData = new FormData();
          formData.append("image", blob, "image.png");

          return fetch("http://localhost:5000/detect_contours", {
            // return fetch("https://fm24api.com/detect_contours", {

            method: "POST",
            body: formData,
          });
        })
        .then((response) => response.json())
        .then((data) => {
          const contoursData = data?.contours;
          if (contoursData) {
            createShape(contoursData, imageSrc);
          } else {
            console.error("Contours data is null");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    function createShape(contoursData, imageSrc) {
      const imgElement = document.querySelector("#upload-photo-img");

      imgElement.onload = () => {
        // let shape = {
        //   kind: "photoshape",
        //   x: 0, // mouseRayPlaneIntersection.x,
        //   y: 0, // mouseRayPlaneIntersection.y,
        //   sizeZ: 300 * millimeters,
        //   sizeX: 200 * millimeters,
        //   sizeZ: 250 * millimeters,
        //   polygon: contoursData,
        //   rotation: 0,
        // };
        // shapesArray.push(shape);
        // commit();
        // selected = shape;
        // showPanelFromRight(selected.kind + "-panel");
        // doCsg();

        // // Call the callback with the modified selected variable
        // callback(selected);
        photoshapeSession.ids = [];
        photoshapeSession.index = 0;

        contoursData.forEach((contour, index) => {
          let shape = {
            id: generateId(),
            kind: "polygon",
            x: -225, // Update x based on requirements
            y: -225, // Update y based on requirements
            sizeZ: 300 * millimeters,
            sizeX: 200 * millimeters,
            sizeY: 250 * millimeters,
            points: contour, // Each contour as the polygon
            rotation: 0,
            free: true,
          };

          shapesArray.push(shape);
          photoshapeSession.ids.push(shape.id);

          // Set the first shape as selected
          if (index === 0) {
            selected = shape;
            showPanelFromRight(selected.kind + "-panel");
            doCsg();
            callback(selected); // Call the callback with the first selected shape
          }
        });
        commit();
        photoshapeSession.index = 0;
        beginPhotoshapeEditSession();

        photoshapeFlowReady = true;
        setPhotoshapeFlowActive(true);
        setPhotoshapeStep(2, {
          note: "Outline ready. Click Edit to adjust points.",
          canBack: true,
          canNext: true,
          nextLabel: "Edit",
        });
        showPanelFromLeft("upload-photo-panel");

      };
      // Set the image source to trigger the onload event
      imgElement.src = imageSrc;
    }
  };
};