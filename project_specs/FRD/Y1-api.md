
---

## Y1: Client-Side Module Interface (API)

> TodoApp has **no HTTP API or backend**. This section defines the JavaScript module-level function interface — the "internal API" that separates data logic from UI rendering logic. Implementations should expose these functions from a single `taskStore` module (or equivalent).

---

### §Overview

The application is organized into two logical layers:

| Layer | Responsibility |
|-------|---------------|
| **Store (data layer)** | Manages in-memory task list, validates inputs, persists to localStorage |
| **UI (presentation layer)** | Reads from the store, renders DOM, attaches event listeners |

The functions defined below are the store's public interface. UI code must not directly mutate `taskList` or call `localStorage` — it must go through these functions.

---

### §Error Types

```javascript
class ValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ValidationError";
    this.code = code; // e.g. "EMPTY_TASK_TEXT"
  }
}

class TaskNotFoundError extends Error {
  constructor(taskId) {
    super(`Task not found: ${taskId}`);
    this.name = "TaskNotFoundError";
    this.code = "TASK_NOT_FOUND";
  }
}

class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = "StorageError";
    this.code = "STORAGE_WRITE_FAILED";
  }
}
```

---

### §hydrateFromStorage

```
hydrateFromStorage(): Task[]
```

**Description:** Reads the task list from `localStorage` on application startup. Initializes the in-memory `taskList`. Called once on `DOMContentLoaded`.

**Parameters:** None.

**Returns:** `Task[]` — the loaded (and validated) task array. Returns `[]` on any failure.

**Side effects:**
- Sets the module-internal `taskList` variable.
- Calls `localStorage.getItem("todoapp_tasks")`.
- On parse failure: calls `localStorage.removeItem("todoapp_tasks")`.

**Throws:** Never throws. All errors are handled internally; failures result in an empty list and a console warning.

**Error behavior:**
| Condition | Behavior |
|-----------|----------|
| Key not present | Returns `[]` |
| Value is invalid JSON | Returns `[]`; removes key; logs warning |
| Value is valid JSON but not an array | Returns `[]`; removes key; logs warning |
| Individual task objects malformed | Skips malformed tasks; returns valid ones |

---

### §getTasks

```
getTasks(): Task[]
```

**Description:** Returns a shallow copy of the current in-memory task list. UI code uses this to get the current state for rendering.

**Parameters:** None.

**Returns:** `Task[]` — current task list (newest first, index 0).

**Side effects:** None (read-only).

**Throws:** Never.

---

### §addTask

```
addTask(text: string): Task
```

**Description:** Validates the input, creates a new Task, prepends it to the in-memory list, persists to localStorage, and returns the new Task. Called by F00.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `text` | string | Yes | Raw user input from the input field (will be trimmed internally) |

**Returns:** `Task` — the newly created Task object.

**Side effects:**
- Prepends new Task to `taskList`.
- Calls `localStorage.setItem("todoapp_tasks", ...)`.

**Throws:**
| Condition | Error |
|-----------|-------|
| `text.trim() === ""` | `ValidationError("EMPTY_TASK_TEXT", "Task description cannot be empty.")` |
| `text.trim().length > 500` | `ValidationError("TASK_TEXT_TOO_LONG", "Task description must be 500 characters or fewer.")` |
| localStorage write fails | `StorageError` (task still added to in-memory list; caller should surface a non-blocking notice) |

**Example:**
```javascript
const task = addTask("Buy groceries");
// Returns: { id: "lhk4a2f0xyz9e", text: "Buy groceries", completed: false, createdAt: "2026-05-07T15:00:00.000Z" }
```

---

### §toggleTaskComplete

```
toggleTaskComplete(taskId: string): Task
```

**Description:** Finds the task by ID, flips its `completed` field, persists to localStorage, and returns the updated Task. Called by F02.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | Yes | The `id` of the task to toggle |

**Returns:** `Task` — the updated Task object (with flipped `completed` value).

**Side effects:**
- Mutates the matching Task's `completed` field in `taskList`.
- Calls `localStorage.setItem("todoapp_tasks", ...)`.

**Throws:**
| Condition | Error |
|-----------|-------|
| No task with `taskId` found | `TaskNotFoundError(taskId)` |
| localStorage write fails | `StorageError` (in-memory state still updated; caller should surface a non-blocking notice) |

---

### §deleteTask

```
deleteTask(taskId: string): void
```

**Description:** Finds the task by ID, removes it from the in-memory list, persists to localStorage. Called by F03.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | Yes | The `id` of the task to delete |

**Returns:** `void`

**Side effects:**
- Filters the matching Task out of `taskList`.
- Calls `localStorage.setItem("todoapp_tasks", ...)`.

**Throws:**
| Condition | Error |
|-----------|-------|
| No task with `taskId` found | `TaskNotFoundError(taskId)` |
| localStorage write fails | `StorageError` (in-memory state still updated; caller should surface a non-blocking notice) |

---

### §renderTaskList

```
renderTaskList(tasks: Task[]): void
```

**Description:** Pure UI function. Clears the Task List Container DOM element and re-renders it from the provided task array. Attaches event listeners for toggle (F02) and delete (F03) controls. Called after every mutation and on page load. Defined in the UI layer, not the store.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `tasks` | `Task[]` | Yes | The current task array to render (from `getTasks()`) |

**Returns:** `void`

**Side effects:**
- Clears and repopulates the Task List Container DOM element.
- Attaches `click` event listeners to all Toggle and Delete controls.

**Throws:** Never (UI rendering errors are caught and logged; the DOM is the source of truth for rendering failures).

**Behavior when `tasks` is empty:** renders the Empty State message element instead of task items.

---

### §Usage Pattern (per mutation)

Every mutation follows this three-step pattern:

```javascript
// 1. Call store function (may throw — catch in UI layer)
const updatedTask = toggleTaskComplete(taskId);

// 2. Re-render from updated store state
renderTaskList(getTasks());

// 3. Handle StorageError if thrown (show non-blocking notice)
```
