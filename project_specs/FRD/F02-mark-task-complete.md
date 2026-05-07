
---

## F02: Mark Task Complete

**Description:** This feature allows the user to toggle the completion state of any task between incomplete and complete. When a task is marked complete it receives an immediate visual change (strikethrough text, muted color, checked checkbox) and the updated state is persisted to `localStorage`. The toggle is bidirectional: a completed task can be toggled back to incomplete, providing an undo-completion capability without a separate undo action.

---

### Terminology

- **Completion Toggle** — The checkbox or clickable control on each Task Item that triggers the complete/incomplete state change.
- **Toggle Action** — A single user interaction (click or keyboard activation) that flips `task.completed` from `false → true` or `true → false`.
- **Completion Visual** — The set of CSS styles applied to a Task Item when `completed === true`: strikethrough text decoration, muted/gray text color, and a checked checkbox state.
- **Revert Action** — Toggling a completed task back to incomplete (same Toggle Action; no separate control needed).

---

### Sub-features

- Checkbox/toggle control rendered per Task Item (see F01 §Render)
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
7. System triggers a UI Re-render (see F01 §Render §Re-render) to reflect the new state.
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

- The `taskId` derived from the DOM must match exactly one Task in the in-memory array. (Enforced by the event listener setup in F01 §Render; `data-id` is set to `task.id` at render time.)
- No field other than `completed` is modified by this action. `id`, `text`, and `createdAt` remain unchanged.
- The toggle must be idempotent per activation: one click = one state flip. Double-click must not silently cancel itself (each click is processed independently).
- Completed tasks remain visible in the list — they are not hidden or moved (v1 has no filtering).

---

### Error States

| Scenario | Trigger | Error Code | UI Behavior |
|----------|---------|------------|-------------|
| Task ID not found | Toggle event fires for an `id` not in in-memory array | `TASK_NOT_FOUND` | Log `console.error`; no state change; no re-render. UI remains as-is. (Should not occur in normal operation.) |
| localStorage write failure on toggle | `localStorage.setItem` throws during persist | `STORAGE_WRITE_FAILED` | In-memory state and UI are updated (toggle visually works for the session). Show non-blocking notice: *"Changes could not be saved. They will be lost on page refresh."* See Y2-errors.md. |

---

### API Surface (this feature)

See `Y1-api.md §toggleTaskComplete` for the full function signature.

**Summary:**
- `toggleTaskComplete(taskId: string): Task` — finds the task by ID, flips `completed`, persists, and returns the updated Task object.
- Throws `TaskNotFoundError` if `taskId` does not match any task.
- Throws `StorageError` on localStorage write failure (state is still updated in-memory).

---

### Schema Surface (this feature)

Mutates the `completed` field of an existing Task object in the `todoapp_tasks` localStorage array.
See `Y0-schema.md §Task`.

**Task field mutated by this feature:** `completed` only.
