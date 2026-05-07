// main.js — Bootstrap: DOMContentLoaded entry point
// From TechArch §2.2:
//   document.addEventListener("DOMContentLoaded", () => {
//     hydrateFromStorage();       // Load state from localStorage
//     renderTaskList(getTasks()); // Initial render
//     bindUIEvents();             // Attach all event listeners
//   });

import { hydrateFromStorage, getTasks } from "./taskStore.js";
import { renderTaskList, bindUIEvents } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  hydrateFromStorage();         // Phase 1: no-op (sets taskList = [])
  renderTaskList(getTasks());   // Render empty state on first load
  bindUIEvents();               // Attach all UI event listeners
});
