# Technical Architecture: TodoApp

**Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Based on:** PRD-TodoApp.md v1.0, FRD-TodoApp.md v1.0

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Component Architecture](#2-component-architecture)
3. [Data Model](#3-data-model)
4. [API Design](#4-api-design)
5. [Security Architecture](#5-security-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Integration Points](#7-integration-points)

---

## 1. Architectural Overview

### 1.1 Pattern

TodoApp uses a **single-tier, client-side-only architecture**. There is no backend, no server, and no network dependency at runtime. The entire application — logic, state, and persistence — runs in the browser.

The architectural pattern is a **Module-based MVC variant**:

- **Model (Store module):** Manages in-memory task state, validates input, reads/writes localStorage.
- **View (UI module):** Renders the DOM from state provided by the Store. Attaches event listeners.
- **Controller (event handlers):** Thin glue code in the UI module that translates DOM events into Store function calls followed by a re-render.

This is intentionally the simplest architecture that satisfies the requirements. There is no build step, no bundler required, and no framework dependency — plain HTML, CSS, and JavaScript files served statically.

### 1.2 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser Tab                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    index.html                            │    │
│  │                                                          │    │
│  │   ┌──────────────────┐    ┌──────────────────────────┐  │    │
│  │   │   UI Module      │    │     Store Module         │  │    │
│  │   │  (ui.js)         │    │     (taskStore.js)       │  │    │
│  │   │                  │    │                          │  │    │
│  │   │  renderTaskList()│◄───│  getTasks()              │  │    │
│  │   │  attachListeners │    │  addTask()               │  │    │
│  │   │  showError()     │    │  toggleTaskComplete()    │  │    │
│  │   │  showNotice()    │    │  deleteTask()            │  │    │
│  │   │                  │───►│  hydrateFromStorage()    │  │    │
│  │   └──────────────────┘    └───────────┬──────────────┘  │    │
│  │           │                           │                  │    │
│  │           │ DOM events                │ read/write       │    │
│  │           ▼                           ▼                  │    │
│  │   ┌──────────────┐          ┌─────────────────────┐     │    │
│  │   │   DOM / HTML │          │    localStorage     │     │    │
│  │   │  (task list, │          │  key: todoapp_tasks  │     │    │
│  │   │   input,     │          │  value: Task[] JSON  │     │    │
│  │   │   buttons)   │          └─────────────────────┘     │    │
│  │   └──────────────┘                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

### 1.3 Deployment Topology

```
┌──────────────────────────────────────────────┐
│            Static Hosting                    │
│   (GitHub Pages / Netlify / Vercel / file:// │
│                                              │
│   /index.html                                │
│   /css/styles.css                            │
│   /js/taskStore.js    ← Store module         │
│   /js/ui.js           ← UI module            │
│   /js/main.js         ← Bootstrap / init     │
└──────────────────────┬───────────────────────┘
                       │  HTTP GET (initial load only)
                       │  No runtime network calls
                       ▼
             ┌─────────────────┐
             │   User Browser  │
             │  Chrome/Firefox │
             │  Safari/Edge    │
             └─────────────────┘
```

**Key architectural decisions:**

| Decision | Rationale |
|----------|-----------|
| No backend | Single-user personal tool; local state is sufficient for v1 |
| No framework (e.g., React/Vue) | Minimal complexity; plain JS satisfies all requirements |
| localStorage as sole persistence | No server required; survives page reload; simple API |
| Module separation (Store + UI) | Keeps data logic testable and decoupled from rendering |
| Newest-first ordering in memory | Matches natural task entry flow; no sort operation required |

---

## 2. Component Architecture

### 2.1 File Structure

```
todoapp/
├── index.html              # App shell, markup structure
├── css/
│   └── styles.css          # All visual styles
└── js/
    ├── taskStore.js        # Store module: data, validation, persistence
    ├── ui.js               # UI module: rendering, event binding
    └── main.js             # Entry point: DOMContentLoaded bootstrap
```

### 2.2 Component Responsibilities

#### `taskStore.js` — Store Module

The authoritative source of truth for task state. Owns the in-memory `taskList` array and all interactions with `localStorage`.

| Responsibility | Details |
|----------------|---------|
| In-memory state | Owns `let taskList = []` — the single source of truth at runtime |
| Input validation | Validates task text (empty check, length ≤ 500) before mutation |
| Task creation | Generates unique IDs, constructs Task objects, prepends to list |
| Persistence | Wraps every `localStorage.setItem` call in try/catch; throws `StorageError` on failure |
| Hydration | Reads, parses, and validates localStorage on startup; never throws |
| Public interface | Exports: `hydrateFromStorage`, `getTasks`, `addTask`, `toggleTaskComplete`, `deleteTask` |

**Must NOT:** Touch the DOM, attach event listeners, or call `renderTaskList`.

---

#### `ui.js` — UI Module

Responsible for all DOM interactions. Reads state from the Store; never directly mutates `taskList` or calls `localStorage`.

| Responsibility | Details |
|----------------|---------|
| Rendering | `renderTaskList(tasks)` — clears and redraws the task list container |
| Empty state | Renders the "No tasks yet" message when list is empty |
| Completion styling | Applies strikethrough + muted color to tasks where `completed === true` |
| Event binding | Attaches click/keydown listeners to Add button, input field, toggle, and delete controls |
| Error display | `showInlineError(message)` — shows validation errors below the input field |
| Notice display | `showStorageNotice(message)` — shows non-blocking banner for storage failures |
| Task ID routing | Reads `data-id` attribute from Task Item elements; passes to Store functions |

**Must NOT:** Contain business logic, validation rules, or localStorage calls.

---

#### `main.js` — Bootstrap

Thin entry point. Runs on `DOMContentLoaded`.

```javascript
// main.js — pseudocode
document.addEventListener("DOMContentLoaded", () => {
  hydrateFromStorage();      // Load state from localStorage
  renderTaskList(getTasks()); // Initial render
  bindUIEvents();             // Attach all event listeners
});
```

---

#### `index.html` — App Shell

Defines the static markup structure. All dynamic content is managed by `ui.js`.

| Element | Role |
|---------|------|
| `#task-input` | Text input for new task description |
| `#add-btn` | Submit button for adding a task |
| `#error-msg` | Inline validation error container (initially hidden) |
| `#storage-notice` | Storage warning banner (initially hidden) |
| `#task-list` | Task List Container — `<ul>` repopulated on every render |

---

### 2.3 Data Flow

```
User types text → clicks Add (or presses Enter)
        │
        ▼
   ui.js: reads #task-input value
        │
        ▼
   taskStore.addTask(text)
        │
        ├─ validation fails → throw ValidationError
        │       │
        │       ▼
        │   ui.js: showInlineError(message)
        │
        ├─ validation passes → create Task, prepend to taskList
        │       │
        │       ▼
        │   localStorage.setItem(...)
        │       │
        │       ├─ write succeeds → return Task
        │       └─ write fails   → throw StorageError (Task still in memory)
        │                │
        │                ▼
        │           ui.js: showStorageNotice(message)
        │
        ▼
   ui.js: renderTaskList(getTasks())
        │
        ▼
   DOM updated (< 100ms)
```

---

## 3. Data Model

### 3.1 Overview

TodoApp has **one data entity: `Task`**. There is no relational database. The persistence layer is `localStorage`, which stores a single JSON-serialized array of Task objects under the key `todoapp_tasks`.

### 3.2 Entity-Relationship Diagram

```
┌──────────────────────────────────────────┐
│                  Task                    │
├──────────────┬───────────────────────────┤
│ id           │ string (PK, unique)       │
│ text         │ string (1–500 chars)      │
│ completed    │ boolean                   │
│ createdAt    │ ISO 8601 string           │
└──────────────┴───────────────────────────┘

Stored as: localStorage["todoapp_tasks"] = JSON.stringify(Task[])

Ordering: Task[] index 0 = newest (most recently created)
```

There are no foreign keys, joins, or related entities. The entire data model is a single flat list.

### 3.3 TypeScript Interface (Canonical Schema)

```typescript
/**
 * Core data entity. The only object type stored in TodoApp.
 * Persisted as a JSON array in localStorage under key "todoapp_tasks".
 */
interface Task {
  /** Unique task identifier. Generated at creation; never modified.
   *  Generated via: crypto.randomUUID() or Date.now().toString(36) + Math.random().toString(36).slice(2)
   *  Collision check required at creation time. */
  id: string;

  /** User-supplied task description.
   *  Trimmed of leading/trailing whitespace before storage.
   *  Constraints: 1–500 characters; no newlines. */
  text: string;

  /** Completion state.
   *  false = incomplete (default on creation).
   *  true  = complete (set by toggleTaskComplete). */
  completed: boolean;

  /** Creation timestamp. ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).
   *  Set once at creation via new Date().toISOString(). Never updated. */
  createdAt: string;
}
```

### 3.4 localStorage Schema (Equivalent of DDL)

Since TodoApp uses localStorage rather than a SQL database, the following table serves as the schema definition equivalent to DDL:

#### Key: `todoapp_tasks`

| Property | Value |
|----------|-------|
| Storage key | `todoapp_tasks` |
| Storage type | `window.localStorage` |
| Value format | JSON string — serialized `Task[]` array |
| Parsed type | `Task[]` |
| Ordering | Index 0 = newest (most recently added); ascending index = older |
| Empty state | Key absent **or** value `"[]"` |
| Max items | Not enforced (practical limit: ~5MB browser quota) |

#### Task Object Field Specifications

| Field | JSON Type | Required | Immutable | Constraints | Set By | Mutated By |
|-------|-----------|----------|-----------|-------------|--------|------------|
| `id` | `string` | Yes | Yes | Non-empty; unique within array; URL-safe chars | `addTask` | — |
| `text` | `string` | Yes | Yes (v1) | 1–500 chars after trim; no newlines | `addTask` | — |
| `completed` | `boolean` | Yes | No | `true` or `false`; default `false` | `addTask` | `toggleTaskComplete` |
| `createdAt` | `string` | Yes | Yes | Valid ISO 8601 datetime; UTC | `addTask` | — |

#### Read/Write Contract

```
READ (page load only):
  localStorage.getItem("todoapp_tasks")
  → null            : initialize taskList = []
  → invalid JSON    : initialize taskList = []; removeItem("todoapp_tasks"); surface STORAGE_PARSE_FAILED
  → not an array    : initialize taskList = []; removeItem("todoapp_tasks"); surface STORAGE_PARSE_FAILED
  → valid Task[]    : validate each object; skip malformed (MALFORMED_TASK_SKIPPED); use remainder

WRITE (after every mutation):
  localStorage.setItem("todoapp_tasks", JSON.stringify(taskList))
  → success : continue
  → throws  : surface STORAGE_WRITE_FAILED; continue with in-memory state

DELETE (on parse failure only):
  localStorage.removeItem("todoapp_tasks")
```

### 3.5 Example Stored Value

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

Index 0 (`"Buy groceries"`) was added after index 1 (`"Read chapter 3"`), consistent with newest-first ordering.

---

## 4. API Design

> **TodoApp has no HTTP API.** The "API" is the client-side JavaScript module interface that separates the Store (data layer) from the UI (presentation layer). All function calls are synchronous. There are no network requests.

### 4.1 TypeScript Interfaces

```typescript
// ─── Core Data Types ───────────────────────────────────────────────────────

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// ─── Error Types ───────────────────────────────────────────────────────────

interface ValidationError extends Error {
  name: "ValidationError";
  code: "EMPTY_TASK_TEXT" | "TASK_TEXT_TOO_LONG";
  message: string;
}

interface TaskNotFoundError extends Error {
  name: "TaskNotFoundError";
  code: "TASK_NOT_FOUND";
  message: string;
}

interface StorageError extends Error {
  name: "StorageError";
  code: "STORAGE_WRITE_FAILED";
  message: string;
}

// ─── Store Module Interface ─────────────────────────────────────────────────

interface TaskStore {
  hydrateFromStorage(): Task[];
  getTasks(): Task[];
  addTask(text: string): Task;
  toggleTaskComplete(taskId: string): Task;
  deleteTask(taskId: string): void;
}

// ─── UI Module Interface ────────────────────────────────────────────────────

interface TaskUI {
  renderTaskList(tasks: Task[]): void;
  showInlineError(message: string): void;
  clearInlineError(): void;
  showStorageNotice(message: string): void;
  dismissStorageNotice(): void;
}
```

### 4.2 Store Module Function Signatures

#### `hydrateFromStorage(): Task[]`

| Property | Value |
|----------|-------|
| **Layer** | Store |
| **Called by** | `main.js` on `DOMContentLoaded` |
| **Called when** | Once, on application startup |
| **Returns** | Validated `Task[]` from localStorage; `[]` on any failure |
| **Side effects** | Sets internal `taskList`; may call `localStorage.removeItem` on parse failure |
| **Throws** | Never — all errors handled internally |

```typescript
function hydrateFromStorage(): Task[]
```

**Behavior table:**

| Condition | Result |
|-----------|--------|
| Key absent | Returns `[]` |
| Value is invalid JSON | Returns `[]`; removes key; logs `console.warn` |
| Value is valid JSON but not an array | Returns `[]`; removes key; logs `console.warn` |
| Individual task missing required fields | Skips that task; logs `console.warn`; returns valid remainder |
| Storage access throws | Returns `[]`; surfaces `STORAGE_UNAVAILABLE` notice |

---

#### `getTasks(): Task[]`

| Property | Value |
|----------|-------|
| **Layer** | Store |
| **Called by** | UI module before every `renderTaskList` call |
| **Returns** | Shallow copy of current `taskList` (newest-first) |
| **Side effects** | None (read-only) |
| **Throws** | Never |

```typescript
function getTasks(): Task[]
```

---

#### `addTask(text: string): Task`

| Property | Value |
|----------|-------|
| **Layer** | Store |
| **Called by** | UI module on Add button click or Enter keypress |
| **Parameters** | `text` — raw string from `#task-input` (trimmed internally) |
| **Returns** | Newly created `Task` object |
| **Side effects** | Prepends Task to `taskList`; calls `localStorage.setItem` |
| **Throws** | `ValidationError` on invalid text; `StorageError` on write failure (task still created in-memory) |

```typescript
function addTask(text: string): Task
```

**Validation rules:**

| Rule | Error code | Message |
|------|------------|---------|
| `text.trim() === ""` | `EMPTY_TASK_TEXT` | `"Task description cannot be empty."` |
| `text.trim().length > 500` | `TASK_TEXT_TOO_LONG` | `"Task description must be 500 characters or fewer."` |

**Task construction:**

```typescript
const task: Task = {
  id: generateId(),          // crypto.randomUUID() or fallback composite
  text: text.trim(),
  completed: false,
  createdAt: new Date().toISOString(),
};
taskList.unshift(task);      // prepend (index 0 = newest)
```

---

#### `toggleTaskComplete(taskId: string): Task`

| Property | Value |
|----------|-------|
| **Layer** | Store |
| **Called by** | UI module on completion toggle click/keypress |
| **Parameters** | `taskId` — value of `data-id` attribute on the Task Item element |
| **Returns** | Updated `Task` object with flipped `completed` value |
| **Side effects** | Mutates `completed` on matching task in `taskList`; calls `localStorage.setItem` |
| **Throws** | `TaskNotFoundError` if no task matches `taskId`; `StorageError` on write failure |

```typescript
function toggleTaskComplete(taskId: string): Task
```

**Mutation:** Only `completed` is changed. `id`, `text`, and `createdAt` are never modified.

---

#### `deleteTask(taskId: string): void`

| Property | Value |
|----------|-------|
| **Layer** | Store |
| **Called by** | UI module on delete button click/keypress |
| **Parameters** | `taskId` — value of `data-id` attribute on the Task Item element |
| **Returns** | `void` |
| **Side effects** | Filters matching task out of `taskList`; calls `localStorage.setItem` |
| **Throws** | `TaskNotFoundError` if no task matches `taskId`; `StorageError` on write failure |

```typescript
function deleteTask(taskId: string): void
```

**Post-deletion:** UI re-renders via `renderTaskList(getTasks())`. If list is now empty, Empty State is shown.

---

### 4.3 UI Module Function Signatures

#### `renderTaskList(tasks: Task[]): void`

Clears the `#task-list` DOM element and re-renders all task items from the provided array. Attaches event listeners to every toggle and delete control. Renders the Empty State element if `tasks.length === 0`.

```typescript
function renderTaskList(tasks: Task[]): void
```

**Per-task item rendered:**
- `data-id` attribute set to `task.id`
- Checkbox: `checked` if `task.completed === true`
- Text span: strikethrough + muted color if `task.completed === true`; normal otherwise
- Delete button: always visible (not hover-only, for keyboard accessibility)

---

#### `showInlineError(message: string): void`

Displays a validation error message in `#error-msg` below the input field. Cleared on next `input` event or successful submission.

#### `clearInlineError(): void`

Hides and clears `#error-msg`.

#### `showStorageNotice(message: string): void`

Displays a non-blocking amber banner in `#storage-notice`. Non-blocking — does not prevent interaction.

#### `dismissStorageNotice(): void`

Hides `#storage-notice`. Called on successful localStorage write or user dismiss.

---

### 4.4 Event Binding Table

| Event | Source Element | Trigger | Store Call | UI Call After |
|-------|---------------|---------|------------|---------------|
| `click` | `#add-btn` | User clicks Add | `addTask(input.value)` | `renderTaskList(getTasks())` |
| `keydown` (Enter) | `#task-input` | User presses Enter | `addTask(input.value)` | `renderTaskList(getTasks())` |
| `input` | `#task-input` | User types | — | `clearInlineError()` |
| `click` | `.task-toggle` | User clicks checkbox | `toggleTaskComplete(taskId)` | `renderTaskList(getTasks())` |
| `keydown` (Space) | `.task-toggle` | Keyboard activation | `toggleTaskComplete(taskId)` | `renderTaskList(getTasks())` |
| `click` | `.task-delete` | User clicks delete | `deleteTask(taskId)` | `renderTaskList(getTasks())` |
| `keydown` (Enter) | `.task-delete` | Keyboard activation | `deleteTask(taskId)` | `renderTaskList(getTasks())` |
| `DOMContentLoaded` | `document` | Page load | `hydrateFromStorage()` | `renderTaskList(getTasks())` |

---

### 4.5 ID Generation Algorithm

```javascript
// Primary: use crypto.randomUUID() when available (all modern browsers 2023+)
function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: composite of timestamp + random suffix
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Collision guard (called at Task creation)
function generateUniqueId(taskList) {
  let id;
  do {
    id = generateId();
  } while (taskList.some(t => t.id === id));
  return id;
}
```

---

## 5. Security Architecture

### 5.1 Authentication & Authorization

**There is no authentication or authorization in TodoApp v1.** This is an explicit design decision (see PRD §4, §10): TodoApp is a single-user, local-only tool. There are no user accounts, sessions, tokens, or server-side access controls.

**Implication:** All data in `localStorage` is accessible to any JavaScript running on the same origin. This is acceptable for a personal, single-user tool with no sensitive data.

### 5.2 Input Validation & Sanitization

All user input passes through validation in the Store module before being accepted into state.

| Threat | Mitigation |
|--------|-----------|
| Empty task submission (accidental or scripted) | `trimmedText === ""` check in `addTask`; rejected with `EMPTY_TASK_TEXT` |
| Oversized input exhausting localStorage quota | Max 500-char limit enforced via HTML `maxlength="500"` attribute AND JavaScript validation in `addTask` |
| XSS via task text in DOM | Task text rendered via DOM text node (`.textContent = task.text`) — **not** `innerHTML`. No HTML interpretation. |
| Prototype pollution via localStorage | Parsed JSON objects are validated for required fields (`id`, `text`, `completed`) before use; no dynamic property access |
| localStorage data tampering | Malformed objects are silently skipped (`MALFORMED_TASK_SKIPPED`); app resets gracefully |

### 5.3 XSS Prevention

The single most important security concern for a client-side app that renders user-supplied strings is XSS. TodoApp mitigates this by:

1. **Always using `.textContent`** (not `.innerHTML`) when inserting `task.text` into the DOM.
2. **Never calling `eval()`, `Function()`, or `document.write()`.**
3. **No external script tags** — all assets are self-contained; no CDN dependencies that could be compromised.

```javascript
// CORRECT — safe text insertion
const textSpan = document.createElement("span");
textSpan.textContent = task.text;   // ← .textContent, never .innerHTML

// WRONG — do not do this
taskItem.innerHTML = `<span>${task.text}</span>`; // ← XSS risk
```

### 5.4 Data Protection

| Concern | Approach |
|---------|---------|
| Data at rest | localStorage is unencrypted (browser-standard); acceptable for non-sensitive personal tasks |
| Data in transit | No data transmission — fully offline; no server calls |
| Data loss on browser clear | Accepted v1 trade-off; noted in README |
| localStorage unavailable | Graceful fallback to in-memory session (see `STORAGE_UNAVAILABLE`) |
| Quota exhaustion | `STORAGE_WRITE_FAILED` handler; in-memory state preserved for session |

### 5.5 Content Security Policy (Recommended)

For deployments on GitHub Pages, Netlify, or Vercel, add the following CSP header (or `<meta>` tag) to restrict execution to same-origin scripts only:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none';">
```

This prevents any injected content (e.g., via a compromised localStorage read) from loading external scripts.

---

## 6. Technology Stack

### 6.1 Runtime Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Markup | HTML5 | — | App shell, semantic structure |
| Styles | CSS3 | — | Layout, task completion styling, responsive design |
| Logic | Vanilla JavaScript (ES2020+) | ES2020+ | Store module, UI module, event handling |
| Persistence | Web Storage API (`localStorage`) | WHATWG standard | Task list persistence across page sessions |
| ID generation | `crypto.randomUUID()` | Browser native | Unique task ID generation (with composite fallback) |
| Module system | ES Modules (`type="module"`) | Native browser | Code organisation without a bundler |

### 6.2 Build & Tooling

| Tool | Version | Purpose | Required? |
|------|---------|---------|-----------|
| No bundler | — | No build step; plain JS files served directly | N/A |
| No transpiler | — | Target browsers support ES2020+ natively | N/A |
| No framework | — | Vanilla JS sufficient for 4 features | N/A |
| Live server (dev) | Any (e.g., VS Code Live Server, `npx serve`) | Local development server | Dev only |

**Philosophy:** The PRD explicitly warns against over-engineering. No build pipeline is needed for v1. If a framework is introduced in v2, the Store module's interface is designed to be framework-agnostic.

### 6.3 Deployment

| Option | Notes |
|--------|-------|
| GitHub Pages | Free static hosting; auto-deploys from repo |
| Netlify | Free tier; drag-and-drop deploy or Git integration |
| Vercel | Free tier; Git integration |
| Local file (`file://`) | Works directly; localStorage operates in `file://` origin context |
| Any static CDN/web server | No server-side runtime required |

### 6.4 Browser Compatibility Matrix

| Browser | Min Version | localStorage | `crypto.randomUUID` | ES Modules | Status |
|---------|-------------|-------------|---------------------|------------|--------|
| Chrome | Latest 2 | ✅ | ✅ (92+) | ✅ | Full support |
| Firefox | Latest 2 | ✅ | ✅ (95+) | ✅ | Full support |
| Safari | Latest 2 | ✅ | ✅ (15.4+) | ✅ | Full support (localStorage limited in ITP private mode) |
| Edge | Latest 2 | ✅ | ✅ (92+) | ✅ | Full support |

### 6.5 Dependencies

**Runtime dependencies:** None. Zero external libraries.

**Dev dependencies (optional, for local development):**

| Tool | Purpose |
|------|---------|
| VS Code Live Server | Local dev server with hot reload |
| `npx serve` | Lightweight local static server |

---

## 7. Integration Points

### 7.1 External Integrations Overview

TodoApp integrates with **browser platform APIs only**. There are no third-party services, no analytics, no CDN dependencies, and no network calls at runtime.

```
┌─────────────────────────────────────────────┐
│              TodoApp (Browser)               │
│                                             │
│  ┌──────────────┐   ┌─────────────────────┐ │
│  │  Store       │   │  UI Module          │ │
│  │  Module      │──►│                     │ │
│  └──────┬───────┘   └──────────┬──────────┘ │
│         │                      │             │
│         ▼                      ▼             │
│  ┌─────────────┐     ┌──────────────────┐   │
│  │ localStorage│     │  DOM / Events    │   │
│  │ Browser API │     │  Browser API     │   │
│  └─────────────┘     └──────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  crypto.randomUUID() — Browser API      ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘

No external network calls. No third-party services.
```

### 7.2 localStorage API

| Property | Value |
|----------|-------|
| API | `window.localStorage` (WHATWG Web Storage) |
| Used by | Store module (taskStore.js) |
| Operations | `getItem`, `setItem`, `removeItem` |
| Key | `todoapp_tasks` |
| Value format | JSON string (`Task[]`) |
| Failure handling | `STORAGE_UNAVAILABLE`, `STORAGE_WRITE_FAILED`, `STORAGE_PARSE_FAILED` |

All three operations are wrapped in `try/catch`. Failures surface non-blocking notices; the app continues to function in-session using in-memory state.

### 7.3 DOM / Browser Events API

| Event | Element | Purpose |
|-------|---------|---------|
| `DOMContentLoaded` | `document` | Bootstrap: hydrate + initial render |
| `click` | `#add-btn`, `.task-toggle`, `.task-delete` | Primary user actions |
| `keydown` | `#task-input`, `.task-toggle`, `.task-delete` | Keyboard accessibility |
| `input` | `#task-input` | Clear inline validation errors on typing |

### 7.4 `crypto.randomUUID()` API

| Property | Value |
|----------|-------|
| API | `crypto.randomUUID()` |
| Purpose | Generate unique, cryptographically random task IDs |
| Browser support | Chrome 92+, Firefox 95+, Safari 15.4+, Edge 92+ |
| Fallback | `Date.now().toString(36) + Math.random().toString(36).slice(2)` if unavailable |

### 7.5 Static Hosting Integration

The application integrates with static hosting platforms at the **deployment level**, not the runtime level.

| Platform | Integration Type | Runtime network calls | Notes |
|----------|-----------------|----------------------|-------|
| GitHub Pages | Git push → auto-deploy | None | Free; works with public repos |
| Netlify | Git push or drag-and-drop | None | Free tier; custom domain support |
| Vercel | Git push | None | Free tier; instant deploys |
| `file://` | Direct file open | None | Works for local/offline use |

**No runtime CDN links.** All assets (HTML, CSS, JS) are self-contained. This ensures full offline operation once the page is loaded.

### 7.6 Out-of-Scope Integrations (v1)

The following integrations are explicitly **not present** in v1 (deferred to v2+):

| Integration | Status | Reason |
|-------------|--------|--------|
| Backend API / database server | Out of scope | No server required for single-user local tool |
| Authentication provider (OAuth, etc.) | Out of scope | No accounts in v1 |
| Analytics (Google Analytics, etc.) | Out of scope | Not needed for v1 |
| Push notifications | Out of scope | No due dates in v1 |
| Cloud sync | Out of scope | Local state is sufficient for v1 |
| Service Worker / PWA | Out of scope | Can be added in v2 for offline-first PWA experience |

---

*Document generated: 2026-05-07 | Project: TodoApp | Version: 1.0*
*Based on: PRD-TodoApp.md v1.0, FRD-TodoApp.md v1.0*
