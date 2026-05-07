// ui.js — Presentation layer: rendering, event binding, error display

import {
  getTasks,
  addTask,
  toggleTaskComplete,
  deleteTask,
  ValidationError,
  StorageError,
} from "./taskStore.js";

// ─── Helper handlers (defined in module scope, used by renderTaskList) ────────

function handleToggle(taskId) {
  try {
    toggleTaskComplete(taskId);
    renderTaskList(getTasks());
  } catch (err) {
    if (err.name === "StorageError") {
      renderTaskList(getTasks());
      showStorageNotice(
        "Your changes could not be saved. They will be lost on page refresh."
      );
    } else {
      console.error("Toggle error:", err);
    }
  }
}

function handleDelete(taskId) {
  // Capture focus position before deletion (FRD §F3 step 8 + US-3.4)
  const taskListEl = document.getElementById("task-list");
  const items = Array.from(taskListEl.querySelectorAll(".task-item"));
  const deletedIndex = items.findIndex((el) => el.dataset.id === taskId);

  try {
    deleteTask(taskId);
    renderTaskList(getTasks());

    // Move focus: to next task item's delete button, or #task-input if list empty
    const newItems = Array.from(taskListEl.querySelectorAll(".task-item"));
    if (newItems.length === 0) {
      document.getElementById("task-input").focus();
    } else {
      const nextIndex = Math.min(deletedIndex, newItems.length - 1);
      const nextDelete = newItems[nextIndex]?.querySelector(".task-delete");
      if (nextDelete) nextDelete.focus();
      else document.getElementById("task-input").focus();
    }
  } catch (err) {
    if (err.name === "StorageError") {
      renderTaskList(getTasks());
      showStorageNotice(
        "Your changes could not be saved. They will be lost on page refresh."
      );
    } else {
      console.error("Delete error:", err);
    }
  }
}

// ─── renderTaskList(tasks) ────────────────────────────────────────────────────

/**
 * renderTaskList(tasks) — Clears #task-list and renders all tasks.
 * Shows empty state if tasks array is empty.
 * Task text is ALWAYS set via .textContent (XSS prevention — never innerHTML).
 */
export function renderTaskList(tasks) {
  const taskListEl = document.getElementById("task-list");
  taskListEl.innerHTML = "";

  if (tasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "No tasks yet. Add one above!";
    taskListEl.appendChild(emptyItem);
    return;
  }

  for (const task of tasks) {
    // a. Create <li class="task-item"> with data-id
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    // b. Apply 'completed' class if task is done
    if (task.completed === true) {
      li.classList.add("completed");
    }

    // c. Checkbox (.task-toggle)
    const checkboxEl = document.createElement("input");
    checkboxEl.type = "checkbox";
    checkboxEl.className = "task-toggle";
    checkboxEl.checked = task.completed;
    checkboxEl.setAttribute("aria-label", "Mark complete");

    checkboxEl.addEventListener("click", () => handleToggle(task.id));
    checkboxEl.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleToggle(task.id);
      }
    });

    // d. Text span (.task-text) — textContent only, never innerHTML (XSS)
    const spanEl = document.createElement("span");
    spanEl.className = "task-text";
    spanEl.textContent = task.text;

    // e. Delete button (.task-delete)
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "task-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", "Delete task: " + task.text);

    deleteBtn.addEventListener("click", () => handleDelete(task.id));
    deleteBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleDelete(task.id);
      }
    });

    // f. Assemble and append
    li.appendChild(checkboxEl);
    li.appendChild(spanEl);
    li.appendChild(deleteBtn);
    taskListEl.appendChild(li);
  }
}

// ─── showInlineError(message) ─────────────────────────────────────────────────

/**
 * showInlineError(message) — Sets #error-msg text and removes .hidden.
 */
export function showInlineError(message) {
  const errorEl = document.getElementById("error-msg");
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

// ─── clearInlineError() ───────────────────────────────────────────────────────

/**
 * clearInlineError() — Clears #error-msg text and adds .hidden.
 */
export function clearInlineError() {
  const errorEl = document.getElementById("error-msg");
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
}

// ─── showStorageNotice(message) ───────────────────────────────────────────────

/**
 * showStorageNotice(message) — Sets #storage-notice text and removes .hidden.
 */
export function showStorageNotice(message) {
  const noticeEl = document.getElementById("storage-notice");
  noticeEl.textContent = message;
  noticeEl.classList.remove("hidden");
}

// ─── dismissStorageNotice() ───────────────────────────────────────────────────

/**
 * dismissStorageNotice() — Adds .hidden to #storage-notice and clears text.
 */
export function dismissStorageNotice() {
  const noticeEl = document.getElementById("storage-notice");
  noticeEl.classList.add("hidden");
  noticeEl.textContent = "";
}

// ─── bindUIEvents() ───────────────────────────────────────────────────────────

/**
 * bindUIEvents() — Wires all static DOM event listeners.
 * Dynamic listeners (toggle/delete) are attached inside renderTaskList.
 */
export function bindUIEvents() {
  function handleAddTask() {
    const input = document.getElementById("task-input");
    const text = input.value;
    try {
      addTask(text);
      renderTaskList(getTasks());
      clearInlineError();
      input.value = "";
      input.focus(); // Return focus after successful add (FRD §F0 step 12)
    } catch (err) {
      if (err.name === "ValidationError") {
        showInlineError(err.message);
        if (err.code === "EMPTY_TASK_TEXT") {
          input.value = ""; // FRD §F0: clear input on empty error
        }
        // TASK_TEXT_TOO_LONG: PRESERVE input text (FRD §F0: do NOT clear)
        input.focus();
      } else if (err.name === "StorageError") {
        // Task added in memory — render it but show notice
        renderTaskList(getTasks());
        clearInlineError();
        input.value = "";
        input.focus();
        showStorageNotice(
          "Your changes could not be saved. They will be lost on page refresh."
        );
      }
    }
  }

  document.getElementById("add-btn").addEventListener("click", handleAddTask);
  document.getElementById("task-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAddTask();
  });

  // Clear inline error while user is typing (FRD §F0 + TechArch §4.4)
  document.getElementById("task-input").addEventListener("input", () => {
    clearInlineError();
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────
// All exports declared with inline export keyword above.
// API surface: renderTaskList, showInlineError, clearInlineError,
//              showStorageNotice, dismissStorageNotice, bindUIEvents
