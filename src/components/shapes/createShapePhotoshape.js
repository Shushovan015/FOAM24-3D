import axios from "axios";
import * as getImageOutline from "image-outline";
import { getBase64 } from "../../utils/common";

export const createShapePhotoShape = (
  millimeters,
  selected,
  shapesArray,
  commit,
  showPanelFromLeft,
  showPanelFromRight,
  doCsg,
  callback
) => {
  document.querySelector("#upload-photo-input").onchange = (e) => {
    document.querySelector("#back-button").removeAttribute("disabled");
    document.querySelector("#back-button").onclick = () => {
      document.querySelector("#back-button").setAttribute("disabled", "");
      showPanelFromLeft("main-panel");
      selected = null;
    };
    const file = e.target.files[0];
    if (file) {
      // Display the selected image
      const imgElement = document.getElementById("upload-photo-img");
      const reader = new FileReader();
      reader.onload = function (e) {
        imgElement.src = e.target.result;

        // After the image is loaded, upload it
        uploadImage(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }

    function uploadImage(file, imageSrc) {
      getBase64(file)
        .then((base64Image) => {
          // Send the image to Remove.bg API to remove the background
          return fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": "ivUjq457ecL51sn2vzD2umUw",
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

          // return fetch("http://localhost:5000/detect_contours", {
            return fetch("https://fm24api.com/detect_contours", {

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

        contoursData.forEach((contour, index) => {
          let shape = {
            kind: "polygon",
            x: -225, // Update x based on requirements
            y: -225, // Update y based on requirements
            sizeZ: 300 * millimeters,
            sizeX: 200 * millimeters,
            sizeY: 250 * millimeters,
            points: contour, // Each contour as the polygon
            rotation: 0,
          };

          shapesArray.push(shape);

          // Set the first shape as selected
          if (index === 0) {
            selected = shape;
            showPanelFromRight(selected.kind + "-panel");
            doCsg();
            callback(selected); // Call the callback with the first selected shape
          }
        });
        commit();
      };

      // Set the image source to trigger the onload event
      imgElement.src = imageSrc;
    }
  };
};
