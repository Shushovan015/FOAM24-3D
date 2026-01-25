let panels = null;
let currPanel = null;

export function initPanels() {
  panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => {
    panel.style.opacity = 0;
    panel.style.pointerEvents = "none";
  });
  currPanel = panels[0];
  currPanel.style.opacity = 1;
  currPanel.style.pointerEvents = "auto";
}

export function showPanelFromRight(id) {
  const nextPanel = document.querySelector(`#${id}`);
  if (nextPanel === currPanel) return;

  currPanel.style.animationName = "disappear-left";
  currPanel.style.animationDuration = "0.25s";
  currPanel.style.animationFillMode = "forwards";
  currPanel.style.pointerEvents = "none";

  nextPanel.style.animationName = "appear-right";
  nextPanel.style.animationDuration = "0.25s";
  nextPanel.style.animationFillMode = "forwards";
  nextPanel.style.pointerEvents = "auto";

  currPanel = nextPanel;
}

export function showPanelFromLeft(id) {
  const nextPanel = document.querySelector(`#${id}`);
  if (nextPanel === currPanel) return;

  currPanel.style.animationName = "disappear-right";
  currPanel.style.animationDuration = "0.25s";
  currPanel.style.animationFillMode = "forwards";
  currPanel.style.pointerEvents = "none";

  nextPanel.style.animationName = "appear-left";
  nextPanel.style.animationDuration = "0.25s";
  nextPanel.style.animationFillMode = "forwards";
  nextPanel.style.pointerEvents = "auto";

  currPanel = nextPanel;
}

export function getCurrentPanel() {
  return currPanel;
}