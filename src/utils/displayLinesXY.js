export function displayLineXY() {
  const xLine = document.querySelector(".x-line");
  const yLine = document.querySelector(".y-line");
  const xCoordinates = document.querySelector(".x-coordinates");
  const yCoordinates = document.querySelector(".y-coordinates");

  document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Update X line position and X coordinates text
    xLine.style.top = `${mouseY}px`;
    xCoordinates.textContent = `X: ${mouseX}px`;
    xCoordinates.style.top = `${mouseY}px`;

    // Update Y line position and Y coordinates text
    yLine.style.left = `${mouseX}px`;
    yCoordinates.textContent = `Y: ${mouseY}px`;
    yCoordinates.style.left = `${mouseX}px`;
  });
}

export function lineFunction(name1, name2, boolValue) {
  document.getElementById("buttonContainer").style.display = `${name2}`;
  document.getElementById("saveButtonContainer").style.display = `${name2}`;
  document.getElementById("saveButtonContainer").disabled = boolValue;
  document.querySelector(".x-line").style.display = `${name1}`;
  document.querySelector(".y-line").style.display = `${name1}`;
  document.querySelector(".x-coordinates").style.display = `${name1}`;
  document.querySelector(".y-coordinates").style.display = `${name1}`;
}
