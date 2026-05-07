
---

## Y3: External Integration Points

> TodoApp is a fully client-side application with no backend. Its only external integration is the browser platform itself. This section documents every browser API the application depends on, the contract for each, and how failures are handled.

---

### §localStorage API

**Used by:** F00 (write), F01 (read on load), F02 (write), F03 (write)
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

**Used by:** All features (F00–F03)
**Purpose:** Event-driven UI — user interactions (click, keydown) trigger store mutations and re-renders.

| Event | Element | Feature | Handler |
|-------|---------|---------|---------|
| `click` | Add button | F00 | Calls `addTask(inputField.value)` |
| `keydown` (Enter) | Input field | F00 | Calls `addTask(inputField.value)` when `event.key === "Enter"` |
| `click` | Completion toggle / checkbox | F02 | Calls `toggleTaskComplete(taskId)` |
| `keydown` (Space/Enter) | Completion toggle | F02 | Calls `toggleTaskComplete(taskId)` when focused via keyboard |
| `click` | Delete button | F03 | Calls `deleteTask(taskId)` |
| `keydown` (Enter) | Delete button | F03 | Calls `deleteTask(taskId)` when focused via keyboard |
| `DOMContentLoaded` | `document` | F01 | Calls `hydrateFromStorage()`, then `renderTaskList(getTasks())` |

---

### §crypto.randomUUID (Optional)

**Used by:** F00 §ID Generation (optional)
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
