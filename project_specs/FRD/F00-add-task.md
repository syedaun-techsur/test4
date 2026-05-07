
---

## F00: Add Task

**Description:** This feature allows a user to create a new task by typing a text description and submitting it. On successful submission the task is immediately inserted into the task list, persisted to `localStorage`, and rendered in the UI. This is the primary capture action and the entry point for every user workflow in TodoApp.

---

### Terminology

- **Input Field** — The `<input type="text">` element where the user types the task description.
- **Submit Control** — Either the Add button or the Enter key press that triggers task creation.
- **Trimmed Text** — The task description after leading and trailing whitespace has been removed via `.trim()`.
- **Submission** — The act of triggering task creation via button click or Enter keypress.

---

### Sub-features

- Text input field for capturing task description
- Submit via "Add" button click
- Submit via Enter key press on the input field
- Input validation: prevent empty or whitespace-only submission
- Newly created task appears at the **top** of the task list immediately after submission
- Input field is cleared after successful submission
- Input field receives focus after successful submission (ready for the next task)

---

### Process

1. User types a task description into the Input Field.
2. User triggers a Submission (button click or Enter key).
3. System reads the value from the Input Field.
4. System applies `.trim()` to the value → `trimmedText`.
5. **Validation branch:**
   - If `trimmedText` is empty string (`""`): system displays an inline validation error (see Error States), clears the input field, sets focus back to the input field, and **halts** — no task is created.
   - If `trimmedText` is non-empty: continue to step 6.
6. System generates a new `taskId` (unique string — see Y0-schema.md §Task).
7. System creates a new Task object:
   ```
   { id: taskId, text: trimmedText, completed: false, createdAt: <ISO8601 timestamp> }
   ```
8. System **prepends** the new Task to the in-memory task list array (index 0 = newest).
9. System persists the updated task list to `localStorage` (see Y0-schema.md §Persistence).
10. System triggers a UI Render to reflect the updated list (see F01 §Process).
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

- **New Task object** inserted at index 0 of the in-memory task list.
- **Updated localStorage** entry `todoapp_tasks` containing the new task.
- **Rendered task item** appearing at the top of the visible task list (see F01).
- **Cleared input field** (`value = ""`).
- **Focus restored** to the input field.

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
| Text too long | `trimmedText.length > 500` | `TASK_TEXT_TOO_LONG` | Show inline message: *"Task description must be 500 characters or fewer."* No task created. |
| localStorage write failure | `localStorage.setItem` throws | `STORAGE_WRITE_FAILED` | Task is still shown in-memory/UI for the current session. Show a non-blocking notice: *"Your task was added but could not be saved. It will be lost on page refresh."* See Y2-errors.md for full storage failure handling. |

---

### API Surface (this feature)

See `Y1-api.md §addTask` for the full JavaScript function signature, parameters, return value, and thrown errors.

**Summary:**
- `addTask(text: string): Task` — validates, creates, persists, and returns the new Task object.
- Throws `ValidationError` on empty/too-long text.
- Throws `StorageError` on localStorage write failure (task still returned for in-session use).

---

### Schema Surface (this feature)

Uses the `Task` object and the `todoapp_tasks` localStorage key.
See `Y0-schema.md §Task` and `Y0-schema.md §Persistence` for full structure.

**Task fields created by this feature:** `id`, `text`, `completed` (always `false` on creation), `createdAt`.
