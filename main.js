import { init3D } from "./src/setup/scene";
import { initUI } from "./src/setup/UI";
import { commit } from "./src/setup/history";

if (typeof window === "object") {
  init3D();
  initUI();
  commit();
}

export {};
