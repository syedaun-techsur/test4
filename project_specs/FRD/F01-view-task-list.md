
---

## F01: View Task List

**Description:** This feature renders the full task list in the UI, making all tasks visible to the user at all times. The list is the central surface of the application — it is displayed on initial page load (hydrated from `localStorage`), updated after every mutating operation (add, complete, delete), and clearly distinguishes completed from incomplete tasks. When no tasks exist, a friendly empty state message is shown instead.

---

### Terminology

- **Task List Container** — The DOM element (e.g., `<ul>` or `<ol>`) that holds all rendered task items.
- **Task Item** — A single DOM element (e.g., `<li>`) representing one Task object.
- **Empty State** — The UI displayed when the task list array contains zero items.
- **Hydration** — Loading the task list from `localStorage` into in-memory state on page load (see Y3-integrations.md §localStorage).
- **Re-render** — Clearing and re-drawing the Task List Container to reflect current in-memory state. Triggered after every mutation.
- **Completion Indicator** — Visual cue on a Task Item showing whether the task is complete (e.g., checkbox checked, strikethrough text, muted color).

---

### Sub-features

- Display all tasks in a scrollable list
- Show task description text for each item
- Show a completion toggle/checkbox per task (see F02)
- Show a delete control per task (see F03)
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
   - If task list array is empty: insert the Empty State message element into the Task List Container. Halt render.
   - If task list array is non-empty: continue to step 4.
4. For each Task in the array (index 0 first = newest at top):
   a. Create a Task Item element.
   b. Render the completion toggle/checkbox (checked if `task.completed === true`).
   c. Render the task description text (`task.text`). Apply strikethrough + muted styling if `task.completed === true`.
   d. Render the delete button/control.
   e. Attach event listeners for the toggle (→ F02) and delete (→ F03) controls.
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
- **Visual:** Empty State message (e.g., *"No tasks yet. Add one above!"*) when list is empty.

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

See `Y1-api.md §getTasks` and `Y1-api.md §renderTaskList` for full signatures.

**Summary:**
- `getTasks(): Task[]` — returns the current in-memory task list array.
- `renderTaskList(tasks: Task[]): void` — clears and re-renders the Task List Container DOM element.
- `hydrateFromStorage(): Task[]` — reads and parses `localStorage`, returns task array (or `[]` on failure).

---

### Schema Surface (this feature)

Reads the full `Task[]` array from `localStorage` key `todoapp_tasks`.
See `Y0-schema.md §Task` and `Y0-schema.md §Persistence`.

**Task fields consumed by this feature:** `id`, `text`, `completed`, `createdAt` (ordering reference).
