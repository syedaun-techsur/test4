
---

## F03: Delete Task

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
- After deletion, if the task list becomes empty, the Empty State message is shown (see F01 §Render)
- Keyboard accessible: delete button focusable and activatable via Enter/Space

---

### Process

1. User clicks (or keyboard-activates) the Delete Control on a Task Item.
2. System identifies the target Task by its `id` (stored as a `data-id` attribute on the Task Item element, or via closure in the event listener).
3. System looks up the Task in the in-memory task list by `id`.
4. **Not-found branch:** If no Task with the given `id` exists in the array, log a console error and halt — no state change. See Error States.
5. System removes the Task object from the in-memory task list array (filter out the matching `id`).
6. System persists the updated (smaller) task list to `localStorage`.
7. System triggers a UI Re-render (see F01 §Render §Re-render) to reflect the removed task.
8. **Post-deletion branch:**
   - If the task list is now empty: the Empty State message is displayed (see F01 §Sub-features).
   - If the task list is non-empty: the remaining tasks are displayed normally.

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

---

### Validation Rules

- The `taskId` derived from the DOM must identify exactly one Task in the in-memory array. (Duplicate IDs are prevented at creation time; see F00 §Validation.)
- Deletion is permanent and irrecoverable within the app — no soft-delete, undo queue, or trash bin.
- Deleting the last task in the list must not crash the app; it must render the Empty State (see F01 §Process §Render).
- Both completed and incomplete tasks can be deleted — there is no restriction on deletion by completion state.

---

### Error States

| Scenario | Trigger | Error Code | UI Behavior |
|----------|---------|------------|-------------|
| Task ID not found | Delete event fires for an `id` not in in-memory array | `TASK_NOT_FOUND` | Log `console.error`; no state change; no re-render. UI remains as-is. (Should not occur in normal operation.) |
| localStorage write failure on delete | `localStorage.setItem` throws during persist | `STORAGE_WRITE_FAILED` | In-memory state and UI are updated (task visually removed for the session). Show non-blocking notice: *"Changes could not be saved. The deleted task may reappear on page refresh."* See Y2-errors.md. |

---

### API Surface (this feature)

See `Y1-api.md §deleteTask` for the full function signature.

**Summary:**
- `deleteTask(taskId: string): void` — finds the task by ID, removes it from the array, persists, and returns nothing.
- Throws `TaskNotFoundError` if `taskId` does not match any task.
- Throws `StorageError` on localStorage write failure (task is still removed from in-memory state).

---

### Schema Surface (this feature)

Removes one Task object from the `todoapp_tasks` localStorage array.
See `Y0-schema.md §Task` and `Y0-schema.md §Persistence`.

**Task fields affected:** entire Task object deleted from array; no individual field mutations.
