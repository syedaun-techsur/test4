// taskStore.js — Stub for RED phase (all functions throw "not implemented")

export class ValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
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

export function hydrateFromStorage() {
  throw new Error("not implemented");
}

export function getTasks() {
  throw new Error("not implemented");
}

export function addTask(text) {
  throw new Error("not implemented");
}

export function toggleTaskComplete(id) {
  throw new Error("not implemented");
}

export function deleteTask(id) {
  throw new Error("not implemented");
}
