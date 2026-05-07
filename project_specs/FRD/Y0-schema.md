
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
| `id` | string | Yes | Yes (after creation) | Unique within the list; non-empty; URL-safe characters recommended | F00 §Process step 6 |
| `text` | string | Yes | No (future v2+; read-only in v1) | 1–500 characters after trim; no newlines | F00 §Process step 7 |
| `completed` | boolean | Yes | No | `true` or `false`; default `false` on creation | F00 (created), F02 (mutated) |
| `createdAt` | string | Yes | Yes (after creation) | Valid ISO 8601 datetime string; set at creation; never updated | F00 §Process step 7 |

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
3. If `setItem` throws (e.g., `QuotaExceededError`): surface `STORAGE_WRITE_FAILED` error (see Y2-errors.md); continue with in-memory state intact.

#### Read Contract

On page load only:
1. Call `localStorage.getItem("todoapp_tasks")`.
2. If result is `null`: initialize task list as `[]`.
3. If result is a non-null string: call `JSON.parse(result)`.
   - If parse succeeds and result is an array: use as task list.
   - If parse fails or result is not an array: initialize task list as `[]`; call `localStorage.removeItem("todoapp_tasks")`; surface `STORAGE_PARSE_FAILED` notice (see Y2-errors.md).
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
