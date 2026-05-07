// taskStore.js — In-memory task store (Phase 1: no localStorage writes)

// ─── Error classes ────────────────────────────────────────────────────────────

export class ValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ValidationError";
    this.code = code; // "EMPTY_TASK_TEXT" | "TASK_TEXT_TOO_LONG"
  }
}

export class TaskNotFoundError extends Error {
  constructor(taskId) {
    super(`Task not found: ${taskId}`);
    this.name = "TaskNotFoundError";
    this.code = "TASK_NOT_FOUND";
  }
}

export class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = "StorageError";
    this.code = "STORAGE_WRITE_FAILED";
  }
}

// ─── Module state ─────────────────────────────────────────────────────────────

let taskList = [];

// ─── ID generation ────────────────────────────────────────────────────────────

function generateId() {
  let id;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    id = crypto.randomUUID();
  } else {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  // Collision guard: check against existing taskList before use
  while (taskList.some((t) => t.id === id)) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  return id;
}

// ─── Store functions ──────────────────────────────────────────────────────────

/**
 * hydrateFromStorage() — Phase 1: sets taskList to [] and returns.
 * Phase 2: localStorage reads activated here
 */
export function hydrateFromStorage() {
  taskList = [];
  // Phase 2: localStorage reads activated here
}

/**
 * getTasks() — Returns a shallow copy of taskList (newest first).
 */
export function getTasks() {
  return [...taskList];
}

/**
 * addTask(text) — Validates, creates a Task, prepends to list, returns the Task.
 * Phase 1: no localStorage writes.
 */
export function addTask(text) {
  const trimmed = text.trim();

  if (trimmed === "") {
    throw new ValidationError("EMPTY_TASK_TEXT", "Task description cannot be empty.");
  }

  if (trimmed.length > 500) {
    throw new ValidationError(
      "TASK_TEXT_TOO_LONG",
      "Task description must be 500 characters or fewer."
    );
  }

  const task = {
    id: generateId(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  taskList.unshift(task);

  // Phase 2: localStorage writes activated here

  return task;
}

/**
 * toggleTaskComplete(id) — Flips the completed field, returns updated Task.
 * Phase 1: no localStorage writes.
 */
export function toggleTaskComplete(id) {
  const task = taskList.find((t) => t.id === id);

  if (!task) {
    throw new TaskNotFoundError(id);
  }

  task.completed = !task.completed;

  // Phase 2: localStorage writes activated here

  return task;
}

/**
 * deleteTask(id) — Removes task from list; throws if not found.
 * Phase 1: no localStorage writes.
 */
export function deleteTask(id) {
  const index = taskList.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new TaskNotFoundError(id);
  }

  taskList.splice(index, 1);

  // Phase 2: localStorage writes activated here
}
