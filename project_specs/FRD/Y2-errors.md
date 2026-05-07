
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
| `EMPTY_TASK_TEXT` | Validation | F00 | `trimmedText === ""` on submission | *"Task description cannot be empty."* | — | Show inline error; clear & focus input; do not create task |
| `TASK_TEXT_TOO_LONG` | Validation | F00 | `trimmedText.length > 500` | *"Task description must be 500 characters or fewer."* | — | Show inline error; do not create task |
| `STORAGE_WRITE_FAILED` | Storage | F00, F02, F03 | `localStorage.setItem` throws (e.g., `QuotaExceededError`, security error) | *"Your changes could not be saved. They will be lost on page refresh."* | `console.warn` | Proceed with in-memory state; show persistent non-blocking banner until page reload |
| `STORAGE_UNAVAILABLE` | Storage | F01 (page load) | `localStorage` access itself throws on page load | *"Storage is unavailable. Tasks will not be saved across sessions."* | `console.warn` | Initialize empty in-memory list; show persistent banner; app functions in-session only |
| `STORAGE_PARSE_FAILED` | Storage | F01 (page load) | `JSON.parse` throws on stored value, or parsed value is not an array | *"Previous tasks could not be loaded. Starting fresh."* | `console.warn` | Initialize `taskList = []`; call `localStorage.removeItem("todoapp_tasks")` |
| `TASK_NOT_FOUND` | Internal | F02, F03 | Toggle or delete event fires for a `taskId` not in `taskList` | None (silent to user) | `console.error` | No state change; no re-render; task list unaffected |
| `MALFORMED_TASK_SKIPPED` | Internal | F01 (page load) | Parsed task object missing `id`, `text`, or `completed` field | None (silent to user) | `console.warn` | Skip the malformed object; continue with valid tasks |

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
