# FRD: Basic To-Do App (TodoApp)

**Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Based on PRD:** PRD-TodoApp.md v1.0

---

## Scope

This Functional Requirements Document specifies the exact behavior of all four v1 features of the TodoApp: Add Task (F0), View Task List (F1), Mark Task Complete (F2), and Delete Task (F3). TodoApp is a fully client-side, single-user task management application with no backend, no authentication, and no network dependency. All persistence is achieved via the browser's `localStorage` API.

This document is the authoritative reference for implementation. Every input, output, validation rule, error state, data structure, and module interface is defined here. No feature outside F0–F3 is in scope for v1.

---

## Conventions

- **Feature IDs** follow the format `F{n}` (single-digit), matching PRD feature numbers.
- **Field names** are written in `monospace` and correspond exactly to keys used in code and localStorage.
- **Required** / **Optional** markers appear in the Inputs section of each feature.
- **Error codes** are `SCREAMING_SNAKE_CASE` strings surfaced to the UI as human-readable messages.
- **Process steps** are numbered and must be executed in order unless branching is indicated.
- Cross-references use the format `see F1 §Process` or `see §Y0 §Task` (sections within this document).
- All timestamps are ISO 8601 strings (`YYYY-MM-DDTHH:mm:ss.sssZ`) generated client-side via `new Date().toISOString()`.
- **"Persist"** always means writing the current task list to `localStorage` under the key `todoapp_tasks`.

---

## Table of Contents

| Section | Contents |
|---------|----------|
| Header | This section — title, scope, conventions, shared terminology |
| F0 | Add Task |
| F1 | View Task List |
| F2 | Mark Task Complete |
| F3 | Delete Task |
| Y0 | Data schema (localStorage structure, Task object) |
| Y1 | Client-side module interface (JavaScript function signatures) |
| Y2 | Cross-feature error catalog |
| Y3 | External integration points (localStorage, browser APIs) |

---

## Shared Terminology

- **Task** — A single user-created to-do item consisting of a text description, a completion flag, a unique identifier, and a creation timestamp.
- **Task List** — The ordered collection of all tasks currently stored in the application. Persisted in `localStorage`.
- **localStorage** — The browser's Web Storage API used as the sole persistence layer. Key: `todoapp_tasks`. Value: JSON-serialized array of Task objects.
- **In-memory State** — The JavaScript runtime representation of the task list (e.g., an array held in a module variable). Kept in sync with localStorage after every mutating operation.
- **Empty State** — The UI condition when the task list contains zero tasks.
- **Completed Task** — A task whose `completed` field is `true`.
- **Incomplete Task** — A task whose `completed` field is `false`.
- **Task ID** — A unique string identifier assigned at task creation time (e.g., a UUID v4 or a `Date.now().toString(36) + Math.random().toString(36)` composite). Must be unique within the task list.
- **Persist** — Write the current in-memory task list to `localStorage` as a JSON string.
- **Hydrate** — Read the task list from `localStorage` on app load and populate in-memory state.
- **UI Render** — Re-draw the task list in the DOM to reflect current in-memory state.

---

*End of header — continue reading feature sections F0 through F3, then cross-feature sections Y0–Y3.*

---

## F0: Add Task

**Description:** This feature allows a user to create a new task by typing a text description and submitting it. On successful submission the task is immediately inserted into the task list, persisted to `localStorage`, and rendered in the UI. This is the primary capture action and the entry point for every user workflow in TodoApp.

---

### Terminology

- **Input Field** — The `<input type="text">` element where the user types the task description.
- **Submit Control** — Either the Add button or the Enter key press that triggers task creation.
- **Trimmed Text** — The task description after leading and trailing whitespace has been removed via `.trim()`.
- **Submission** — The act of triggering task creation via button click or Enter keypress.

---

### Sub-features

- Input field is auto-focused on page load — no click required before typing
- Text input field for capturing task description
- Submit via "Add" button click
- Submit via Enter key press on the input field
- Input validation: prevent empty or whitespace-only submission
- Newly created task appears at the **top** of the task list immediately after submission
- Input field is cleared after successful submission
- Input field receives focus after successful submission (ready for the next task)

---

### Process

#### On Page Load

0. System sets focus to the Input Field automatically (`autofocus` attribute or `element.focus()` call on `DOMContentLoaded`). No user click is required before typing.

#### On Submission

1. User types a task description into the Input Field.
2. User triggers a Submission (button click or Enter key).
3. System reads the value from the Input Field.
4. System applies `.trim()` to the value → `trimmedText`.
5. **Validation branch:**
   - If `trimmedText` is empty string (`""`): system displays an inline validation error (see Error States), clears the input field, sets focus back to the input field, and **halts** — no task is created.
   - If `trimmedText.length > 500`: system displays an inline validation error `TASK_TEXT_TOO_LONG` (see Error States), preserves the input field text so the user can edit it, sets focus to the input field, and **halts** — no task is created.
   - If `trimmedText` is non-empty and ≤ 500 characters: continue to step 6.
6. System generates a new `taskId` (unique string — see §Y0 §ID Generation).
7. System creates a new Task object:
   ```
   { id: taskId, text: trimmedText, completed: false, createdAt: <ISO8601 timestamp> }
   ```
8. System **prepends** the new Task to the in-memory task list array (index 0 = newest).
9. System persists the updated task list to `localStorage` (see §Y0 §Persistence).
10. System triggers a UI Render to reflect the updated list (see F1 §Process).
11. System clears the Input Field value to `""`.
12. System sets focus to the Input Field.

---

### Inputs

| Field | Type | Required | Source | Constraints |
|-------|------|----------|--------|-------------|
| `text` | string | Yes | Input Field (user-typed) | 1–500 characters after trim; must not be empty or whitespace-only |

**Notes:**
- Maximum length of 500 characters is enforced both via HTML `maxlength="500"` attribute and via JavaScript validation before task creation.
- Leading/trailing whitespace is silently stripped (not shown as an error).
- The input field uses `type="text"` (not `textarea`); newlines are not supported.

---

### Outputs

- **Input field auto-focused** on page load (before any user interaction).
- **New Task object** inserted at index 0 of the in-memory task list.
- **Updated localStorage** entry `todoapp_tasks` containing the new task.
- **Rendered task item** appearing at the top of the visible task list (see F1).
- **Cleared input field** (`value = ""`).
- **Focus restored** to the input field after submission.

---

### Validation Rules

- `trimmedText.length === 0` → reject; show `EMPTY_TASK_TEXT` error.
- `trimmedText.length > 500` → reject; show `TASK_TEXT_TOO_LONG` error. (HTML `maxlength` attribute should prevent this in normal use, but JS validation must also enforce it as a safety net.)
- Duplicate task text is **allowed** — users may create multiple tasks with identical descriptions.
- Task ID uniqueness: the system must ensure no two tasks share the same `id`. If a collision is detected (extremely unlikely with the chosen ID strategy), regenerate the ID.

---

### Error States

| Scenario | Trigger | Error Code | UI Behavior |
|----------|---------|------------|-------------|
| Empty submission | `trimmedText === ""` | `EMPTY_TASK_TEXT` | Show inline message: *"Task description cannot be empty."* below/near the input field. Input is cleared and focused. No task created. |
| Text too long | `trimmedText.length > 500` | `TASK_TEXT_TOO_LONG` | Show inline message: *"Task description must be 500 characters or fewer."* Input text is preserved (not cleared) so the user can edit it down. Focus set to input field. No task created. |
| localStorage write failure | `localStorage.setItem` throws | `STORAGE_WRITE_FAILED` | Task is still shown in-memory/UI for the current session. Show a non-blocking notice: *"Your changes could not be saved. They will be lost on page refresh."* See §Y2 for full storage failure handling. |

---

### API Surface (this feature)

See §Y1 §addTask for the full JavaScript function signature, parameters, return value, and thrown errors.

**Summary:**
- `addTask(text: string): Task` — validates, creates, persists, and returns the new Task object.
- Throws `ValidationError` on empty/too-long text.
- Throws `StorageError` on localStorage write failure (task still returned for in-session use).

---

### Schema Surface (this feature)

Uses the `Task` object and the `todoapp_tasks` localStorage key.
See §Y0 §Task and §Y0 §Persistence for full structure.

**Task fields created by this feature:** `id`, `text`, `completed` (always `false` on creation), `createdAt`.

---

## F1: View Task List

**Description:** This feature renders the full task list in the UI, making all tasks visible to the user at all times. The list is the central surface of the application — it is displayed on initial page load (hydrated from `localStorage`), updated after every mutating operation (add, complete, delete), and clearly distinguishes completed from incomplete tasks. When no tasks exist, a friendly empty state message is shown instead.

---

### Terminology

- **Task List Container** — The DOM element (e.g., `<ul>` or `<ol>`) that holds all rendered task items.
- **Task Item** — A single DOM element (e.g., `<li>`) representing one Task object.
- **Empty State** — The UI displayed when the task list array contains zero items.
- **Hydration** — Loading the task list from `localStorage` into in-memory state on page load (see §Y3 §localStorage API).
- **Re-render** — Clearing and re-drawing the Task List Container to reflect current in-memory state. Triggered after every mutation.
- **Completion Indicator** — Visual cue on a Task Item showing whether the task is complete (e.g., checkbox checked, strikethrough text, muted color).

---

### Sub-features

- Display all tasks in a scrollable list
- Show task description text for each item
- Show a completion toggle/checkbox per task (see F2)
- Show a delete control per task (see F3)
- Visually distinguish completed tasks (strikethrough text + muted/gray color)
- List is ordered newest-first (most recently added task at the top)
- List persists across page refreshes via `localStorage` hydration
- Empty state message displayed when the task list is empty
- List re-renders immediately (< 100ms) after any mutation

---

### Process

#### On Page Load

1. System reads `localStorage` key `todoapp_tasks`.
2. **Branch:**
   - If key exists and value is valid JSON array: parse into in-memory task list array.
   - If key does not exist: initialize in-memory task list as empty array `[]`.
   - If key exists but value is invalid JSON or not an array: log a console warning, initialize in-memory task list as `[]`, and clear the corrupted `localStorage` key (see Error States).
3. System calls Render (step below) with the loaded task list.

#### Render (called after every mutation and on page load)

1. System reads the current in-memory task list array.
2. System clears the Task List Container (removes all child DOM nodes).
3. **Branch:**
   - If task list array is empty: insert the Empty State message element — text content must be exactly *"No tasks yet. Add one above!"* — into the Task List Container. Halt render.
   - If task list array is non-empty: continue to step 4.
4. For each Task in the array (index 0 first = newest at top):
   a. Create a Task Item element.
   b. Render the completion toggle/checkbox (checked if `task.completed === true`).
   c. Render the task description text (`task.text`). Apply strikethrough + muted styling if `task.completed === true`.
   d. Render the delete button/control.
   e. Attach event listeners for the toggle (→ F2) and delete (→ F3) controls.
   f. Append the Task Item to the Task List Container.
5. Render is complete.

---

### Inputs

| Source | Type | Description |
|--------|------|-------------|
| In-memory task list | `Task[]` | Current array of Task objects to render |
| `localStorage` (page load only) | JSON string | Serialized task array read during hydration |

---

### Outputs

- **DOM:** Task List Container populated with Task Items (one per Task), or Empty State element if list is empty.
- **In-memory state:** Task list array fully populated from `localStorage` on page load.
- **Visual:** Each Task Item shows text, a completion toggle reflecting `completed` state, and a delete control.
- **Visual:** Completed tasks have strikethrough text and muted/gray color.
- **Visual:** Incomplete tasks have normal text styling.
- **Visual:** Empty State message — exactly *"No tasks yet. Add one above!"* — displayed when list is empty.

---

### Validation Rules

- Every Task Item rendered must correspond to exactly one Task object in the in-memory array — no duplicates, no missing items.
- Task ordering: newest task (index 0) renders at the top of the list; oldest task renders at the bottom.
- `completed` state of each Task Item must match the `completed` field of its corresponding Task object.
- The Empty State element must not be visible when the task list contains one or more tasks.
- The Task List Container must not be visible (or must show only the Empty State) when the task list is empty.
- On page load, if `localStorage` data cannot be parsed, the app must not crash — it must fall back to an empty list gracefully (see Error States).

---

### Error States

| Scenario | Trigger | Error Code | UI Behavior |
|----------|---------|------------|-------------|
| localStorage data corrupted | JSON.parse throws on stored value | `STORAGE_PARSE_FAILED` | Initialize empty list; show non-blocking notice: *"Previous tasks could not be loaded. Starting fresh."* Clear corrupted localStorage key. |
| localStorage unavailable | `localStorage` access throws (e.g., private browsing, quota) | `STORAGE_UNAVAILABLE` | Initialize empty in-memory list; show persistent notice: *"Storage is unavailable. Tasks will not be saved across sessions."* App continues in-memory only. |
| Render with null/undefined task | Task object in array is malformed | `MALFORMED_TASK_SKIPPED` | Skip malformed task silently (log console warning); render all valid tasks normally. |

---

### API Surface (this feature)

See §Y1 §getTasks and §Y1 §renderTaskList for full signatures.

**Summary:**
- `getTasks(): Task[]` — returns the current in-memory task list array.
- `renderTaskList(tasks: Task[]): void` — clears and re-renders the Task List Container DOM element.
- `hydrateFromStorage(): Task[]` — reads and parses `localStorage`, returns task array (or `[]` on failure).

---

### Schema Surface (this feature)

Reads the full `Task[]` array from `localStorage` key `todoapp_tasks`.
See §Y0 §Task and §Y0 §Persistence.

**Task fields consumed by this feature:** `id`, `text`, `completed`, `createdAt` (ordering reference).

---

## F2: Mark Task Complete

**Description:** This feature allows the user to toggle the completion state of any task between incomplete and complete. When a task is marked complete it receives an immediate visual change (strikethrough text, muted color, checked checkbox) and the updated state is persisted to `localStorage`. The toggle is bidirectional: a completed task can be toggled back to incomplete, providing an undo-completion capability without a separate undo action.

---

### Terminology

- **Completion Toggle** — The checkbox or clickable control on each Task Item that triggers the complete/incomplete state change.
- **Toggle Action** — A single user interaction (click or keyboard activation) that flips `task.completed` from `false → true` or `true → false`.
- **Completion Visual** — The set of CSS styles applied to a Task Item when `completed === true`: strikethrough text decoration, muted/gray text color, and a checked checkbox state.
- **Revert Action** — Toggling a completed task back to incomplete (same Toggle Action; no separate control needed).

---

### Sub-features

- Checkbox/toggle control rendered per Task Item (see F1 §Render)
- Single click/activation flips `completed` state
- Immediate visual update on toggle (< 100ms)
- Completed state persisted to `localStorage` after every toggle
- Bidirectional toggle: complete → incomplete supported
- Keyboard accessible: toggle activatable via Space or Enter when the checkbox has focus

---

### Process

1. User clicks (or keyboard-activates) the Completion Toggle on a Task Item.
2. System identifies the target Task by its `id` (stored as a `data-id` attribute on the Task Item element, or via closure in the event listener).
3. System looks up the Task in the in-memory task list by `id`.
4. **Not-found branch:** If no Task with the given `id` exists in the array (should not occur in normal use), log a console error and halt — no state change, no render. See Error States.
5. System flips the `completed` field: `task.completed = !task.completed`.
6. System persists the updated task list to `localStorage`.
7. System triggers a UI Re-render (see F1 §Render) to reflect the new state.
8. The Task Item for the toggled task now shows the updated completion visual (strikethrough + muted if completed; normal if incomplete).

---

### Inputs

| Field | Type | Required | Source | Constraints |
|-------|------|----------|--------|-------------|
| `taskId` | string | Yes | `data-id` attribute on Task Item DOM element (or event listener closure) | Must match the `id` of an existing Task in the in-memory array |

---

### Outputs

- **In-memory state:** Target Task's `completed` field flipped (`false → true` or `true → false`).
- **localStorage:** Updated `todoapp_tasks` JSON written with the new `completed` value.
- **DOM:** Task Item re-rendered with updated completion visual styling.
  - If now `completed === true`: strikethrough text, muted color, checked checkbox.
  - If now `completed === false`: normal text, normal color, unchecked checkbox.

---

### Validation Rules

- The `taskId` derived from the DOM must match exactly one Task in the in-memory array. (Enforced by the event listener setup in F1 §Render; `data-id` is set to `task.id` at render time.)
- No field other than `completed` is modified by this action. `id`, `text`, and `createdAt` remain unchanged.
- The toggle must be idempotent per activation: one click = one state flip. Double-click must not silently cancel itself (each click is processed independently).
- Completed tasks remain visible in the list — they are not hidden or moved (v1 has no filtering).

---

### Error States

| Scenario | Trigger | Error Code | UI Behavior |
|----------|---------|------------|-------------|
| Task ID not found | Toggle event fires for an `id` not in in-memory array | `TASK_NOT_FOUND` | Log `console.error`; no state change; no re-render. UI remains as-is. (Should not occur in normal operation.) |
| localStorage write failure on toggle | `localStorage.setItem` throws during persist | `STORAGE_WRITE_FAILED` | In-memory state and UI are updated (toggle visually works for the session). Show non-blocking notice: *"Your changes could not be saved. They will be lost on page refresh."* See §Y2. |

---

### API Surface (this feature)

See §Y1 §toggleTaskComplete for the full function signature.

**Summary:**
- `toggleTaskComplete(taskId: string): Task` — finds the task by ID, flips `completed`, persists, and returns the updated Task object.
- Throws `TaskNotFoundError` if `taskId` does not match any task.
- Throws `StorageError` on localStorage write failure (state is still updated in-memory).

---

### Schema Surface (this feature)

Mutates the `completed` field of an existing Task object in the `todoapp_tasks` localStorage array.
See §Y0 §Task.

**Task field mutated by this feature:** `completed` only.

---

## F3: Delete Task

**Description:** This feature allows the user to permanently remove any task from the list. Deletion is immediate — the task disappears from the UI the moment the delete control is activated and is simultaneously removed from `localStorage`. There is no confirmation dialog (v1 keeps it simple). A deleted task cannot be recovered within the application.

---

### Terminology

- **Delete Control** — The button or icon (e.g., "×", "Delete", trash icon) rendered on each Task Item that triggers permanent task removal.
- **Permanent Deletion** — Removal of the Task object from both the in-memory array and `localStorage`; no soft-delete, trash, or undo mechanism exists in v1.

---

### Sub-features

- Delete button/control visible on each Task Item at all times (not hover-only, to ensure keyboard accessibility)
- Single click/activation of the Delete Control removes the task immediately
- No confirmation dialog (v1 design decision — see PRD §9 out-of-scope)
- Task removed from UI immediately (< 100ms)
- Task removed from `localStorage` on deletion
- After deletion, if the task list becomes empty, the Empty State message is shown (see F1 §Render)
- Keyboard accessible: delete button focusable and activatable via Enter/Space

---

### Process

1. User clicks (or keyboard-activates) the Delete Control on a Task Item.
2. System identifies the target Task by its `id` (stored as a `data-id` attribute on the Task Item element, or via closure in the event listener).
3. System looks up the Task in the in-memory task list by `id`.
4. **Not-found branch:** If no Task with the given `id` exists in the array, log a console error and halt — no state change. See Error States.
5. System removes the Task object from the in-memory task list array (filter out the matching `id`).
6. System persists the updated (smaller) task list to `localStorage`.
7. System triggers a UI Re-render (see F1 §Render) to reflect the removed task.
8. **Post-deletion branch:**
   - If the task list is now empty: the Empty State message is displayed (see F1 §Sub-features); system sets focus to the Input Field.
   - If the task list is non-empty: the remaining tasks are displayed normally; system sets focus to the next Task Item in the list (the one that now occupies the same visual position as the deleted task, i.e., the task that was immediately below it). If the deleted task was the last item in the list, focus moves to the Input Field.

---

### Inputs

| Field | Type | Required | Source | Constraints |
|-------|------|----------|--------|-------------|
| `taskId` | string | Yes | `data-id` attribute on Task Item DOM element (or event listener closure) | Must match the `id` of an existing Task in the in-memory array |

---

### Outputs

- **In-memory state:** Target Task object removed from the task list array.
- **localStorage:** Updated `todoapp_tasks` JSON written without the deleted task.
- **DOM:** Task Item element for the deleted task removed from the Task List Container. Remaining tasks rendered unchanged.
- **DOM (if now empty):** Empty State message displayed in Task List Container.
- **Focus:** Moved to the next Task Item in the list (the item that was immediately below the deleted one). If the deleted task was the last in the list (or the list is now empty), focus moves to the Input Field.

---

### Validation Rules

- The `taskId` derived from the DOM must identify exactly one Task in the in-memory array. (Duplicate IDs are prevented at creation time; see F0 §Validation.)
- Deletion is permanent and irrecoverable within the app — no soft-delete, undo queue, or trash bin.
- Deleting the last task in the list must not crash the app; it must render the Empty State (see F1 §Process §Render).
- Both completed and incomplete tasks can be deleted — there is no restriction on deletion by completion state.

---

### Error States

| Scenario | Trigger | Error Code | UI Behavior |
|----------|---------|------------|-------------|
| Task ID not found | Delete event fires for an `id` not in in-memory array | `TASK_NOT_FOUND` | Log `console.error`; no state change; no re-render. UI remains as-is. (Should not occur in normal operation.) |
| localStorage write failure on delete | `localStorage.setItem` throws during persist | `STORAGE_WRITE_FAILED` | In-memory state and UI are updated (task visually removed for the session). Show non-blocking notice: *"Your changes could not be saved. They will be lost on page refresh."* See §Y2. |

---

### API Surface (this feature)

See §Y1 §deleteTask for the full function signature.

**Summary:**
- `deleteTask(taskId: string): void` — finds the task by ID, removes it from the array, persists, and returns nothing.
- Throws `TaskNotFoundError` if `taskId` does not match any task.
- Throws `StorageError` on localStorage write failure (task is still removed from in-memory state).

---

### Schema Surface (this feature)

Removes one Task object from the `todoapp_tasks` localStorage array.
See §Y0 §Task and §Y0 §Persistence.

**Task fields affected:** entire Task object deleted from array; no individual field mutations.

---

## Y0: Data Schema

> TodoApp has **no backend database**. All data is stored client-side in the browser's `localStorage`. This section defines the data structures, localStorage key contract, and serialization format that serve as the application's sole persistence layer.

---

### §Task — Core Data Object

The `Task` object is the only data entity in TodoApp. It is a plain JavaScript object serialized to JSON for storage.

#### TypeScript-style Interface

```typescript
interface Task {
  id: string;          // Unique task identifier (see §ID Generation)
  text: string;        // User-supplied task description (1–500 chars, trimmed)
  completed: boolean;  // false = incomplete, true = complete
  createdAt: string;   // ISO 8601 timestamp, e.g. "2026-05-07T14:32:00.000Z"
}
```

#### Field Specifications

| Field | Type | Required | Immutable? | Constraints | Set By |
|-------|------|----------|------------|-------------|--------|
| `id` | string | Yes | Yes (after creation) | Unique within the list; non-empty; URL-safe characters recommended | F0 §Process step 6 |
| `text` | string | Yes | No (future v2+; read-only in v1) | 1–500 characters after trim; no newlines | F0 §Process step 7 |
| `completed` | boolean | Yes | No | `true` or `false`; default `false` on creation | F0 (created), F2 (mutated) |
| `createdAt` | string | Yes | Yes (after creation) | Valid ISO 8601 datetime string; set at creation; never updated | F0 §Process step 7 |

---

### §ID Generation

Task IDs must be unique within the task list. The recommended generation strategy for v1 (no external library required):

```javascript
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
// Example output: "lhk3z9q0abc4d"
```

**Alternative:** `crypto.randomUUID()` if the target browsers support it (all modern browsers do as of 2023).

**Collision handling:** After generating a candidate ID, check that it does not already exist in the in-memory task list. If a collision is detected, regenerate. (Collisions are astronomically unlikely with the above strategy but must be handled defensively.)

---

### §Persistence — localStorage Contract

| Property | Value |
|----------|-------|
| **localStorage key** | `todoapp_tasks` |
| **Value type** | JSON string |
| **Parsed type** | `Task[]` (array of Task objects) |
| **Ordering** | Index 0 = most recently added task; last index = oldest task |
| **Empty state** | `"[]"` (JSON empty array) or key not present |
| **Max items** | Not enforced in v1; practical limit governed by browser localStorage quota (~5MB) |

#### Write Contract

Every mutating operation (add, toggle complete, delete) must:
1. Update the in-memory task list array.
2. Call `localStorage.setItem("todoapp_tasks", JSON.stringify(taskList))`.
3. If `setItem` throws (e.g., `QuotaExceededError`): surface `STORAGE_WRITE_FAILED` error (see §Y2); continue with in-memory state intact.

#### Read Contract

On page load only:
1. Call `localStorage.getItem("todoapp_tasks")`.
2. If result is `null`: initialize task list as `[]`.
3. If result is a non-null string: call `JSON.parse(result)`.
   - If parse succeeds and result is an array: use as task list.
   - If parse fails or result is not an array: initialize task list as `[]`; call `localStorage.removeItem("todoapp_tasks")`; surface `STORAGE_PARSE_FAILED` notice (see §Y2).
4. Validate each parsed object has at minimum `id` (string), `text` (string), `completed` (boolean). Skip any object that fails validation (log warning; surface `MALFORMED_TASK_SKIPPED`).

---

### §In-Memory State

The runtime state is a single module-scoped variable:

```javascript
let taskList = []; // Task[] — authoritative in-memory representation
```

All reads and writes go through this variable. `localStorage` is the persistence mirror — always written after every mutation, read only on page load.

---

### §Example Stored Value

```json
[
  {
    "id": "lhk4a2f0xyz9e",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2026-05-07T15:00:00.000Z"
  },
  {
    "id": "lhk3z9q0abc4d",
    "text": "Read chapter 3",
    "completed": true,
    "createdAt": "2026-05-07T14:32:00.000Z"
  }
]
```

Note: index 0 (`"Buy groceries"`) was added after index 1 (`"Read chapter 3"`), consistent with newest-first ordering.

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

**Description:** Validates the input, creates a new Task, prepends it to the in-memory list, persists to localStorage, and returns the new Task. Called by F0.

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

**Description:** Finds the task by ID, flips its `completed` field, persists to localStorage, and returns the updated Task. Called by F2.

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

**Description:** Finds the task by ID, removes it from the in-memory list, persists to localStorage. Called by F3.

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

**Description:** Pure UI function. Clears the Task List Container DOM element and re-renders it from the provided task array. Attaches event listeners for toggle (F2) and delete (F3) controls. Called after every mutation and on page load. Defined in the UI layer, not the store.

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

---

## Y2: Cross-Feature Error Catalog

> This section catalogs all error states across all features in one place. For per-feature error tables, see the individual feature chunks. This document is the definitive reference for error codes, messages, and handling guidance.

> **Note:** TodoApp has no HTTP API, so there are no HTTP status codes. Errors are surfaced as UI notices or console messages. All error codes are `SCREAMING_SNAKE_CASE` strings.

---

### §Error Classification

| Class | Description | User-Visible? | Recovery |
|-------|-------------|---------------|----------|
| **Validation Error** | User input fails a rule (e.g., empty text) | Yes — inline message near the input | User corrects input and resubmits |
| **Storage Write Error** | localStorage write fails after a mutation | Yes — non-blocking notice | Operation succeeded in-memory; user warned data won't persist |
| **Storage Read Error** | localStorage data is corrupted or unreadable on page load | Yes — non-blocking notice | App resets to empty list; bad data cleared |
| **Task Not Found** | Internal: event fires for a task ID that doesn't exist in state | No (console only) | No user action needed; should not occur in normal use |
| **Malformed Task** | Internal: a persisted task object is missing required fields | No (console only) | Malformed task skipped; valid tasks still rendered |

---

### §Full Error Catalog

| Error Code | Class | Feature(s) | Trigger | User-Facing Message | Console Level | Recovery Action |
|------------|-------|------------|---------|--------------------|--------------------|-----------------|
| `EMPTY_TASK_TEXT` | Validation | F0 | `trimmedText === ""` on submission | *"Task description cannot be empty."* | — | Show inline error; clear & focus input; do not create task |
| `TASK_TEXT_TOO_LONG` | Validation | F0 | `trimmedText.length > 500` | *"Task description must be 500 characters or fewer."* | — | Show inline error; preserve input text; focus input; do not create task |
| `STORAGE_WRITE_FAILED` | Storage | F0, F2, F3 | `localStorage.setItem` throws (e.g., `QuotaExceededError`, security error) | *"Your changes could not be saved. They will be lost on page refresh."* | `console.warn` | Proceed with in-memory state; show persistent non-blocking banner until page reload |
| `STORAGE_UNAVAILABLE` | Storage | F1 (page load) | `localStorage` access itself throws on page load | *"Storage is unavailable. Tasks will not be saved across sessions."* | `console.warn` | Initialize empty in-memory list; show persistent banner; app functions in-session only |
| `STORAGE_PARSE_FAILED` | Storage | F1 (page load) | `JSON.parse` throws on stored value, or parsed value is not an array | *"Previous tasks could not be loaded. Starting fresh."* | `console.warn` | Initialize `taskList = []`; call `localStorage.removeItem("todoapp_tasks")` |
| `TASK_NOT_FOUND` | Internal | F2, F3 | Toggle or delete event fires for a `taskId` not in `taskList` | None (silent to user) | `console.error` | No state change; no re-render; task list unaffected |
| `MALFORMED_TASK_SKIPPED` | Internal | F1 (page load) | Parsed task object missing `id`, `text`, or `completed` field | None (silent to user) | `console.warn` | Skip the malformed object; continue with valid tasks |

---

### §UI Notice Behavior

**Inline validation error** (EMPTY_TASK_TEXT, TASK_TEXT_TOO_LONG):
- Rendered as a small text element directly below the input field.
- Disappears when the user starts typing again (on `input` event) or on next successful submission.
- Does not use `alert()`.

**Non-blocking storage notice** (STORAGE_WRITE_FAILED, STORAGE_UNAVAILABLE, STORAGE_PARSE_FAILED):
- Rendered as a dismissible banner or toast at the top of the page.
- Uses a visually distinct style (e.g., yellow/amber warning).
- Does not block interaction.
- `STORAGE_WRITE_FAILED` banner: dismissed automatically on next successful write or page reload.
- `STORAGE_UNAVAILABLE` banner: persists for the entire session (storage won't come back).
- `STORAGE_PARSE_FAILED` banner: shown once on page load; user can dismiss.

---

### §Error Handling Implementation Notes

1. All store functions (`addTask`, `toggleTaskComplete`, `deleteTask`) should wrap `localStorage.setItem` in a `try/catch` and re-throw a `StorageError` if it fails. Callers (UI layer) catch `StorageError` and surface the notice.
2. `hydrateFromStorage` must never throw — all errors are handled internally with graceful fallback to `[]`.
3. Validation errors from `addTask` are caught by the UI layer to display inline messages.
4. `TASK_NOT_FOUND` errors (from `toggleTaskComplete` and `deleteTask`) in normal usage indicate a bug in event listener setup — log and ignore.
5. Never use `alert()`, `confirm()`, or `prompt()` for any error or confirmation in v1.

---

## Y3: External Integration Points

> TodoApp is a fully client-side application with no backend. Its only external integration is the browser platform itself. This section documents every browser API the application depends on, the contract for each, and how failures are handled.

---

### §localStorage API

**Used by:** F0 (write), F1 (read on load), F2 (write), F3 (write)
**Purpose:** Sole persistence layer for the task list across page sessions.

| Property | Value |
|----------|-------|
| API | `window.localStorage` (Web Storage API, WHATWG standard) |
| Key | `todoapp_tasks` |
| Value format | JSON string — serialized `Task[]` array |
| Browser support | All modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions) |
| Availability | May be unavailable in: private/incognito mode (some browsers), embedded iframes with restrictive policies, when storage quota is exceeded |

**Read operations:**
- `localStorage.getItem("todoapp_tasks")` — called once on `DOMContentLoaded`.
- Wrapped in `try/catch`. On error: surface `STORAGE_UNAVAILABLE`; fall back to in-memory mode.

**Write operations:**
- `localStorage.setItem("todoapp_tasks", JSON.stringify(taskList))` — called after every mutation.
- Wrapped in `try/catch`. On `QuotaExceededError` or any other error: surface `STORAGE_WRITE_FAILED`; continue with in-memory state.

**Delete operations:**
- `localStorage.removeItem("todoapp_tasks")` — called on `STORAGE_PARSE_FAILED` to clear corrupted data.

**Availability detection (page load):**
```javascript
function isStorageAvailable() {
  try {
    const testKey = "__todoapp_storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
```
If this returns `false`, the app initializes in in-memory mode and shows the `STORAGE_UNAVAILABLE` notice for the entire session.

---

### §DOM / Browser Events API

**Used by:** All features (F0–F3)
**Purpose:** Event-driven UI — user interactions (click, keydown) trigger store mutations and re-renders.

| Event | Element | Feature | Handler |
|-------|---------|---------|---------|
| `click` | Add button | F0 | Calls `addTask(inputField.value)` |
| `keydown` (Enter) | Input field | F0 | Calls `addTask(inputField.value)` when `event.key === "Enter"` |
| `click` | Completion toggle / checkbox | F2 | Calls `toggleTaskComplete(taskId)` |
| `keydown` (Space/Enter) | Completion toggle | F2 | Calls `toggleTaskComplete(taskId)` when focused via keyboard |
| `click` | Delete button | F3 | Calls `deleteTask(taskId)` |
| `keydown` (Space/Enter) | Delete button | F3 | Calls `deleteTask(taskId)` when focused via keyboard |
| `DOMContentLoaded` | `document` | F1 | Calls `hydrateFromStorage()`, then `renderTaskList(getTasks())` |

---

### §crypto.randomUUID (Optional)

**Used by:** F0 §ID Generation (optional)
**Purpose:** Generating cryptographically random task IDs.

| Property | Value |
|----------|-------|
| API | `crypto.randomUUID()` |
| Browser support | Chrome 92+, Firefox 95+, Safari 15.4+, Edge 92+ |
| Fallback | If unavailable, use `Date.now().toString(36) + Math.random().toString(36).slice(2)` |

---

### §Static Hosting / Deployment

**Used by:** Application delivery
**Purpose:** Serving the HTML/CSS/JS files to the browser.

| Property | Value |
|----------|-------|
| Deployment targets | GitHub Pages, Netlify, Vercel, or local file (`file://`) |
| Network dependency | None at runtime — app is fully static; no XHR/fetch calls |
| Offline operation | Fully functional with no network once assets are cached |
| CDN dependencies | None required; all assets should be self-contained (no external CDN links that would break offline use) |

---

### §Browser Compatibility Matrix

| Browser | Min Version | localStorage | crypto.randomUUID | Notes |
|---------|-------------|-------------|-------------------|-------|
| Chrome | Latest 2 | ✅ | ✅ (92+) | Full support |
| Firefox | Latest 2 | ✅ | ✅ (95+) | Full support |
| Safari | Latest 2 | ✅ | ✅ (15.4+) | localStorage may be restricted in ITP private mode |
| Edge | Latest 2 | ✅ | ✅ (92+) | Full support |

**Note on Safari private mode:** localStorage is accessible but quota is limited to ~1MB per origin in some versions. The `STORAGE_UNAVAILABLE` / `STORAGE_WRITE_FAILED` handlers must cover this case.

---

*End of FRD — TodoApp v1.0*
