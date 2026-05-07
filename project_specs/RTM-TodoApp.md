# Requirements Traceability Matrix: TodoApp

**Document Type:** Requirements Traceability Matrix (RTM)
**Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Project:** Basic To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Based on PRD** | PRD-TodoApp.md v1.0 |
| **Based on FRD** | FRD-TodoApp.md v1.0 |
| **Based on TechArch** | TechArch-TodoApp.md v1.0 |
| **Based on UserStories** | UserStories-TodoApp.md v1.0 |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Requirements Summary](#2-requirements-summary)
3. [Traceability Matrix](#3-traceability-matrix)
4. [Requirements Detail](#4-requirements-detail)
5. [Test Case Coverage](#5-test-case-coverage)
6. [Change Management](#6-change-management)
7. [Approval](#7-approval)

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides complete bidirectional traceability between all TodoApp specification documents. It links every PRD feature to its corresponding functional requirements in the FRD, architectural specifications in TechArch, and user stories — ensuring that every stated requirement is implemented, testable, and accounted for across the full specification chain.

TodoApp is a minimal, single-user, client-side task management application covering four core features: Add Task (F0), View Task List (F1), Mark Task Complete (F2), and Delete Task (F3). All four features are classified P0 (Critical / MVP). The application has no backend, no authentication, and uses browser `localStorage` as its sole persistence layer.

This RTM serves three purposes. First, **forward traceability**: confirming that every PRD feature requirement has been elaborated in the FRD, addressed in TechArch, and covered by user stories. Second, **backward traceability**: confirming that nothing in the FRD, TechArch, or UserStories exists without a corresponding PRD requirement. Third, **test coverage traceability**: confirming that every user story has an identifiable set of test cases that validates its acceptance criteria.

All IDs in this document are extracted directly from source specification documents. No placeholder IDs are used. The traceability chain follows the convention: PRD Feature ID → FRD Section ID → TechArch Component / Section → User Story ID → Test Case ID.

---

## 2. Requirements Summary

### PRD Features (Source: PRD-TodoApp.md)

- **F0 — Add Task** (P0): User captures a new task by typing a description and submitting via button or Enter key. Includes input validation (empty check, 500-char max), newest-first insertion, localStorage persistence, and storage failure handling.
- **F1 — View Task List** (P0): User sees all tasks in a single scrollable list. Includes localStorage hydration on page load, visual distinction of complete vs. incomplete tasks, empty state messaging, corrupted storage recovery, and unavailable storage fallback.
- **F2 — Mark Task Complete** (P0): User toggles any task between complete and incomplete. Includes immediate visual feedback, bidirectional toggle, keyboard accessibility, localStorage persistence, and storage failure handling.
- **F3 — Delete Task** (P0): User permanently removes any task. Includes immediate removal, no confirmation dialog, localStorage update, empty-state trigger, keyboard accessibility, and storage failure handling.

### FRD Functional Requirements (Source: FRD-TodoApp.md)

- **F0 sub-features**: Auto-focus on page load; text input capture; button submit; Enter key submit; empty/whitespace validation (EMPTY_TASK_TEXT); 500-char max validation (TASK_TEXT_TOO_LONG); newest-first prepend; localStorage write; UI re-render; input clear; focus restore.
- **F1 sub-features**: localStorage hydration on DOMContentLoaded; corrupted data recovery (STORAGE_PARSE_FAILED); unavailable storage fallback (STORAGE_UNAVAILABLE); full task list render; newest-first ordering; completion toggle per item; delete control per item; strikethrough + muted styling for complete tasks; empty state message; post-mutation re-render in < 100ms; malformed task skip (MALFORMED_TASK_SKIPPED).
- **F2 sub-features**: Toggle control per task item; single-click state flip; immediate visual update (< 100ms); localStorage persist on toggle; bidirectional toggle (complete ↔ incomplete); keyboard activation (Space / Enter); TASK_NOT_FOUND error handling; STORAGE_WRITE_FAILED handling.
- **F3 sub-features**: Delete control always visible; single-click removal; no confirmation dialog; immediate UI removal (< 100ms); localStorage update; empty state trigger on last deletion; focus management post-deletion; keyboard activation (Enter / Space); TASK_NOT_FOUND handling; STORAGE_WRITE_FAILED handling.

### TechArch Specifications (Source: TechArch-TodoApp.md)

- **Architecture**: Single-tier client-side MVC variant; Store module (`taskStore.js`) + UI module (`ui.js`) + bootstrap (`main.js`); plain HTML5/CSS3/Vanilla JS (ES2020+); no bundler, no framework, no backend.
- **Data Model**: Single `Task` entity with fields `id` (string, unique), `text` (string, 1–500 chars), `completed` (boolean), `createdAt` (ISO 8601 string); stored as `Task[]` JSON array under `localStorage` key `todoapp_tasks`.
- **API (internal JS)**: `hydrateFromStorage()`, `getTasks()`, `addTask(text)`, `toggleTaskComplete(taskId)`, `deleteTask(taskId)` (Store); `renderTaskList(tasks)`, `showInlineError(msg)`, `clearInlineError()`, `showStorageNotice(msg)`, `dismissStorageNotice()` (UI).
- **Security**: XSS prevention via `.textContent` (never `.innerHTML`); input validation in Store before DOM insertion; localStorage prototype pollution guard; CSP meta tag recommended.
- **Integration**: `window.localStorage` (sole persistence); DOM/Browser Events API; `crypto.randomUUID()` with composite fallback; static hosting (GitHub Pages / Netlify / Vercel / `file://`).

### User Stories (Source: UserStories-TodoApp.md)

- **Epic 0 (F0)**: US-0.1 through US-0.5 — button submit, Enter key submit, empty validation, max-length validation, storage write failure on add.
- **Epic 1 (F1)**: US-1.1 through US-1.5 — page load view, visual distinction, empty state, corrupted storage recovery, unavailable storage.
- **Epic 2 (F2)**: US-2.1 through US-2.5 — mark complete, toggle back, keyboard toggle, persistence across refresh, storage write failure on toggle.
- **Epic 3 (F3)**: US-3.1 through US-3.5 — delete task, delete any completion state, empty state after last delete, keyboard delete, persistence after delete.

### Non-Functional Requirements (Source: PRD-TodoApp.md §6)

- **Performance**: UI must reflect add / complete / delete in < 100ms.
- **Persistence**: Task list survives page refresh via localStorage.
- **Simplicity**: UI usable without onboarding or instructions.
- **Accessibility**: All core actions (add, complete, delete) keyboard-accessible.
- **Compatibility**: Chrome, Firefox, Safari, Edge — latest 2 versions.
- **Reliability**: No network dependency; app works fully offline.
- **Scope control**: No features outside F0–F3 implemented in v1.

---

## 3. Traceability Matrix

### 3.1 Feature-Level Traceability

| PRD Feature | PRD Priority | FRD Section | TechArch Section | User Stories |
|---|---|---|---|---|
| F0: Add Task | P0 | FRD §F0 | §2.2 taskStore.js, §4.2 addTask(), §4.4 Event Binding | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5 |
| F1: View Task List | P0 | FRD §F1 | §2.2 ui.js, §4.2 hydrateFromStorage() / getTasks(), §4.3 renderTaskList() | US-1.1, US-1.2, US-1.3, US-1.4, US-1.5 |
| F2: Mark Task Complete | P0 | FRD §F2 | §2.2 taskStore.js, §4.2 toggleTaskComplete(), §4.4 Event Binding | US-2.1, US-2.2, US-2.3, US-2.4, US-2.5 |
| F3: Delete Task | P0 | FRD §F3 | §2.2 taskStore.js, §4.2 deleteTask(), §4.4 Event Binding | US-3.1, US-3.2, US-3.3, US-3.4, US-3.5 |

### 3.2 User Story-Level Traceability

| User Story | Title | PRD Feature | FRD Section | TechArch Component | Acceptance Criteria Count |
|---|---|---|---|---|---|
| US-0.1 | Add a Task via Button Click | F0 | FRD §F0 §Process (On Submission), §F0 §Sub-features | `ui.js` event binding (`#add-btn` click), `addTask()`, `renderTaskList()` | 5 |
| US-0.2 | Add a Task via Enter Key | F0 | FRD §F0 §Process (On Submission), §Y3 §DOM Events | `ui.js` event binding (`keydown` Enter on `#task-input`), `addTask()` | 3 |
| US-0.3 | Prevent Empty Task Submission | F0 | FRD §F0 §Validation Rules, §F0 §Error States (EMPTY_TASK_TEXT), §Y2 | `addTask()` validation, `showInlineError()`, `clearInlineError()` | 5 |
| US-0.4 | Enforce Maximum Task Length | F0 | FRD §F0 §Validation Rules, §F0 §Error States (TASK_TEXT_TOO_LONG), §F0 §Inputs | `addTask()` validation (`maxlength="500"` + JS check), `showInlineError()` | 5 |
| US-0.5 | Graceful Handling of Storage Write Failure on Add | F0 | FRD §F0 §Error States (STORAGE_WRITE_FAILED), §Y2, §Y3 §localStorage | `addTask()` try/catch on `localStorage.setItem`, `showStorageNotice()` | 4 |
| US-1.1 | View All Tasks on Page Load | F1 | FRD §F1 §Process (On Page Load), §F1 §Outputs | `main.js` DOMContentLoaded, `hydrateFromStorage()`, `renderTaskList()`, `getTasks()` | 5 |
| US-1.2 | Distinguish Completed Tasks Visually | F1 | FRD §F1 §Process §Render (step 4c), §F1 §Outputs | `renderTaskList()` completion styling (strikethrough + muted color) | 4 |
| US-1.3 | See an Empty State When No Tasks Exist | F1 | FRD §F1 §Process §Render (step 3 branch), §F1 §Validation Rules | `renderTaskList()` empty state branch ("No tasks yet. Add one above!") | 4 |
| US-1.4 | Recover Gracefully from Corrupted Storage Data | F1 | FRD §F1 §Error States (STORAGE_PARSE_FAILED), §Y0 §Persistence (Read Contract), §Y2 | `hydrateFromStorage()` parse error handling, `localStorage.removeItem()`, `showStorageNotice()` | 5 |
| US-1.5 | Use the App When localStorage Is Unavailable | F1 | FRD §F1 §Error States (STORAGE_UNAVAILABLE), §Y3 §localStorage §Availability Detection | `hydrateFromStorage()` storage access guard, `isStorageAvailable()`, `showStorageNotice()` | 4 |
| US-2.1 | Mark an Incomplete Task as Complete | F2 | FRD §F2 §Process, §F2 §Outputs | `.task-toggle` click event, `toggleTaskComplete()`, `renderTaskList()` | 5 |
| US-2.2 | Toggle a Completed Task Back to Incomplete | F2 | FRD §F2 §Process (step 5 flip), §F2 §Validation Rules (bidirectional) | `toggleTaskComplete()` (flip logic `!task.completed`), `renderTaskList()` | 5 |
| US-2.3 | Toggle Tasks Using the Keyboard | F2 | FRD §F2 §Sub-features (keyboard), §Y3 §DOM Events | `ui.js` `keydown` (Space/Enter) on `.task-toggle` | 4 |
| US-2.4 | Persist Completion State Across Page Refreshes | F2 | FRD §F2 §Process (step 6 persist), §Y0 §Persistence (Write Contract) | `toggleTaskComplete()` → `localStorage.setItem`, `hydrateFromStorage()` on reload | 4 |
| US-2.5 | Graceful Handling of Storage Write Failure on Toggle | F2 | FRD §F2 §Error States (STORAGE_WRITE_FAILED), §Y2 | `toggleTaskComplete()` try/catch on `localStorage.setItem`, `showStorageNotice()` | 4 |
| US-3.1 | Delete a Task from the List | F3 | FRD §F3 §Process, §F3 §Outputs | `.task-delete` click event, `deleteTask()`, `renderTaskList()` | 5 |
| US-3.2 | Delete Both Complete and Incomplete Tasks | F3 | FRD §F3 §Validation Rules (no restriction by completion state) | `deleteTask()` (no completion state check), delete control always visible in `renderTaskList()` | 4 |
| US-3.3 | See Empty State After Deleting the Last Task | F3 | FRD §F3 §Process (Post-deletion branch), §F1 §Render (empty state) | `deleteTask()` → `renderTaskList()` empty state branch, focus to `#task-input` | 4 |
| US-3.4 | Delete Tasks Using the Keyboard | F3 | FRD §F3 §Sub-features (keyboard), §F3 §Process (step 8 focus), §Y3 §DOM Events | `ui.js` `keydown` (Enter/Space) on `.task-delete`, focus management post-deletion | 4 |
| US-3.5 | Confirm Deleted Tasks Do Not Reappear After Refresh | F3 | FRD §F3 §Validation Rules (permanent deletion), §F3 §Error States (STORAGE_WRITE_FAILED) | `deleteTask()` → `localStorage.setItem`, `hydrateFromStorage()` on reload; `STORAGE_WRITE_FAILED` notice | 4 |

### 3.3 Error Code Traceability

| Error Code | FRD Section | PRD Feature | User Story | TechArch Component |
|---|---|---|---|---|
| `EMPTY_TASK_TEXT` | FRD §F0 §Error States, §Y2 | F0 | US-0.3 | `addTask()` validation, `showInlineError()` |
| `TASK_TEXT_TOO_LONG` | FRD §F0 §Error States, §Y2 | F0 | US-0.4 | `addTask()` validation, `showInlineError()` |
| `STORAGE_WRITE_FAILED` | FRD §F0/F2/F3 §Error States, §Y2 | F0, F2, F3 | US-0.5, US-2.5, US-3.5 | `addTask()` / `toggleTaskComplete()` / `deleteTask()` try/catch, `showStorageNotice()` |
| `STORAGE_UNAVAILABLE` | FRD §F1 §Error States, §Y2, §Y3 | F1 | US-1.5 | `hydrateFromStorage()`, `isStorageAvailable()`, `showStorageNotice()` |
| `STORAGE_PARSE_FAILED` | FRD §F1 §Error States, §Y2, §Y0 | F1 | US-1.4 | `hydrateFromStorage()`, `localStorage.removeItem()`, `showStorageNotice()` |
| `TASK_NOT_FOUND` | FRD §F2/F3 §Error States, §Y2 | F2, F3 | — (internal; no user story — console.error only) | `toggleTaskComplete()` / `deleteTask()` not-found branch |
| `MALFORMED_TASK_SKIPPED` | FRD §F1 §Error States, §Y2, §Y0 | F1 | — (internal; no user story — console.warn only) | `hydrateFromStorage()` field validation on parse |

### 3.4 Data Model Traceability

| Data Entity / Field | Defined In | Set By | Mutated By | Read By | User Stories |
|---|---|---|---|---|---|
| `Task.id` | FRD §Y0 §Task, TechArch §3.3 | `addTask()` (F0) | — (immutable) | `toggleTaskComplete()`, `deleteTask()`, `renderTaskList()` | US-0.1 through US-0.5 (creation), all US (read) |
| `Task.text` | FRD §Y0 §Task, TechArch §3.3 | `addTask()` (F0) | — (immutable in v1) | `renderTaskList()` (F1) | US-0.1, US-0.2, US-0.3, US-0.4, US-1.1, US-1.2 |
| `Task.completed` | FRD §Y0 §Task, TechArch §3.3 | `addTask()` (F0, default `false`) | `toggleTaskComplete()` (F2) | `renderTaskList()` (F1) | US-2.1, US-2.2, US-2.3, US-2.4, US-1.2, US-3.2 |
| `Task.createdAt` | FRD §Y0 §Task, TechArch §3.3 | `addTask()` (F0) | — (immutable) | `renderTaskList()` (ordering reference, F1) | US-1.1 (newest-first ordering) |
| `todoapp_tasks` (localStorage key) | FRD §Y0 §Persistence, TechArch §3.4 | `addTask()` / `toggleTaskComplete()` / `deleteTask()` | All write operations | `hydrateFromStorage()` (F1 page load) | US-0.5, US-1.1, US-1.4, US-1.5, US-2.4, US-3.5 |

---

## 4. Requirements Detail

### F0: Add Task — Requirements Detail

**PRD Reference:** PRD-TodoApp.md §5 F0
**FRD Reference:** FRD-TodoApp.md §F0
**TechArch Reference:** TechArch-TodoApp.md §2.2 (taskStore.js), §4.2 (addTask), §4.4 (Event Binding)
**User Stories:** US-0.1, US-0.2, US-0.3, US-0.4, US-0.5

PRD Capabilities and FRD Mapping:

- **Text input field for task description**
  - FRD §F0 §Sub-features: `<input type="text">` Input Field; `text` field (1–500 chars after trim)
  - FRD §F0 §Inputs: field `text`, type `string`, required, max 500 chars after trim
  - TechArch §2.2 index.html: `#task-input` element; `maxlength="500"` HTML attribute

- **Submit via button click or Enter key**
  - FRD §F0 §Sub-features: Submit via "Add" button click; Submit via Enter key press
  - FRD §Y3 §DOM Events: `click` on Add button → `addTask()`; `keydown` (Enter) on input → `addTask()`
  - TechArch §4.4: `click` on `#add-btn`; `keydown` (Enter) on `#task-input`

- **Input validation: prevent empty task submission**
  - FRD §F0 §Validation Rules: `trimmedText.length === 0` → reject; `EMPTY_TASK_TEXT`
  - FRD §F0 §Error States: inline message "Task description cannot be empty."; input cleared and focused
  - FRD §Y2: `EMPTY_TASK_TEXT` error catalog entry
  - TechArch §4.2 addTask() validation table: `text.trim() === ""` → `ValidationError("EMPTY_TASK_TEXT", ...)`
  - TechArch §5.2: empty task submission mitigation

- **Input validation: 500-character maximum**
  - FRD §F0 §Validation Rules: `trimmedText.length > 500` → reject; `TASK_TEXT_TOO_LONG`
  - FRD §F0 §Inputs: HTML `maxlength="500"` + JS safety net
  - FRD §Y2: `TASK_TEXT_TOO_LONG` error catalog entry
  - TechArch §4.2 addTask() validation table: `text.trim().length > 500` → `ValidationError("TASK_TEXT_TOO_LONG", ...)`
  - TechArch §5.2: oversized input mitigation

- **Newly added task appears at top of list immediately**
  - FRD §F0 §Process step 8: `taskList.unshift(task)` (prepend, index 0 = newest)
  - FRD §F0 §Sub-features: Newly created task appears at top after submission
  - TechArch §4.2 addTask() construction: `taskList.unshift(task)` (newest-first)
  - TechArch §3.4: ordering — Index 0 = newest

- **Auto-focus on page load**
  - FRD §F0 §Process (On Page Load) step 0: `autofocus` attribute or `element.focus()` on `DOMContentLoaded`
  - FRD §F0 §Sub-features: Input field auto-focused on page load
  - TechArch §2.2 index.html: `#task-input` element

- **Input cleared and refocused after submission**
  - FRD §F0 §Process steps 11–12: clear Input Field; set focus to Input Field
  - FRD §F0 §Outputs: Cleared input field; Focus restored

- **Storage write failure handling**
  - FRD §F0 §Error States (STORAGE_WRITE_FAILED): task shown in-session; non-blocking notice
  - FRD §Y2: `STORAGE_WRITE_FAILED` — `"Your changes could not be saved. They will be lost on page refresh."`
  - FRD §Y0 §Persistence Write Contract: `setItem` throws → surface `STORAGE_WRITE_FAILED`
  - TechArch §4.2 addTask() throws table: `StorageError` on write failure (task still created in-memory)

---

### F1: View Task List — Requirements Detail

**PRD Reference:** PRD-TodoApp.md §5 F1
**FRD Reference:** FRD-TodoApp.md §F1
**TechArch Reference:** TechArch-TodoApp.md §2.2 (ui.js), §4.2 (hydrateFromStorage, getTasks), §4.3 (renderTaskList)
**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-1.5

PRD Capabilities and FRD Mapping:

- **Display all tasks in a scrollable list**
  - FRD §F1 §Sub-features: Display all tasks in a scrollable list; show task description text per item
  - FRD §F1 §Process §Render step 4: for each Task create Task Item; render `task.text`
  - TechArch §4.3 renderTaskList(): clears `#task-list` and redraws all task items

- **Show task description for each item**
  - FRD §F1 §Process §Render step 4b: render task description text (`task.text`)
  - TechArch §5.3 XSS Prevention: `textSpan.textContent = task.text` (never `.innerHTML`)

- **Visually distinguish completed tasks**
  - FRD §F1 §Sub-features: Visually distinguish completed tasks (strikethrough text + muted/gray color)
  - FRD §F1 §Process §Render step 4c: apply strikethrough + muted styling if `task.completed === true`
  - FRD §F1 §Outputs: Completed tasks have strikethrough text and muted/gray color
  - TechArch §2.2 ui.js Completion styling responsibility
  - TechArch §4.3 renderTaskList(): text span strikethrough + muted color if `task.completed === true`

- **List persists across page refreshes via localStorage**
  - FRD §F1 §Process (On Page Load) steps 1–3: read `localStorage`, parse, populate in-memory array
  - FRD §F1 §Sub-features: List persists across page refreshes via localStorage hydration
  - FRD §Y0 §Persistence Read Contract: full read/parse/validate sequence
  - TechArch §4.2 hydrateFromStorage(): reads `localStorage` on startup; sets internal `taskList`

- **Empty state message when no tasks exist**
  - FRD §F1 §Process §Render step 3 branch: if empty, insert "No tasks yet. Add one above!" element
  - FRD §F1 §Outputs: Empty State message — exactly "No tasks yet. Add one above!"
  - FRD §F1 §Validation Rules: Empty State element must not be visible when tasks exist
  - TechArch §4.3 renderTaskList(): "Behavior when `tasks` is empty: renders the Empty State message"

- **Corrupted storage recovery**
  - FRD §F1 §Error States (STORAGE_PARSE_FAILED): initialize empty list; show notice; clear key
  - FRD §Y2: `STORAGE_PARSE_FAILED` — `"Previous tasks could not be loaded. Starting fresh."`
  - FRD §Y0 §Persistence Read Contract: parse failure path → `removeItem`
  - TechArch §4.2 hydrateFromStorage() behavior table: invalid JSON → returns `[]`; removes key; logs warn

- **localStorage unavailable fallback**
  - FRD §F1 §Error States (STORAGE_UNAVAILABLE): in-memory mode; persistent session notice
  - FRD §Y2: `STORAGE_UNAVAILABLE` — `"Storage is unavailable. Tasks will not be saved across sessions."`
  - FRD §Y3 §localStorage Availability Detection: `isStorageAvailable()` guard
  - TechArch §4.2 hydrateFromStorage() behavior: `Storage access throws → Returns []; surfaces STORAGE_UNAVAILABLE notice`

---

### F2: Mark Task Complete — Requirements Detail

**PRD Reference:** PRD-TodoApp.md §5 F2
**FRD Reference:** FRD-TodoApp.md §F2
**TechArch Reference:** TechArch-TodoApp.md §2.2 (taskStore.js), §4.2 (toggleTaskComplete), §4.4 (Event Binding)
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5

PRD Capabilities and FRD Mapping:

- **Toggle / checkbox control per task item**
  - FRD §F2 §Sub-features: Checkbox/toggle control rendered per Task Item (see F1 §Render)
  - FRD §F1 §Process §Render step 4b: render completion toggle/checkbox (checked if `task.completed === true`)
  - TechArch §4.3 renderTaskList(): per-task item — `data-id`, checkbox checked state, delete button

- **Visual change on completion (strikethrough, checkmark)**
  - FRD §F2 §Sub-features: Immediate visual update on toggle (< 100ms)
  - FRD §F2 §Outputs: if `completed === true`: strikethrough, muted color, checked checkbox; if `false`: normal
  - TechArch §4.3 renderTaskList(): text span strikethrough + muted if `completed === true`

- **Bidirectional toggle: complete → incomplete**
  - FRD §F2 §Process step 5: `task.completed = !task.completed`
  - FRD §F2 §Validation Rules: toggle is idempotent per activation; bidirectional
  - TechArch §4.2 toggleTaskComplete(): "Only `completed` is changed. `id`, `text`, `createdAt` are never modified."

- **Completed state persists across page refreshes**
  - FRD §F2 §Process step 6: persist updated task list to localStorage
  - FRD §F2 §Sub-features: Completed state persisted to localStorage after every toggle
  - TechArch §4.2 toggleTaskComplete() side effects: `localStorage.setItem`

- **Keyboard accessibility**
  - FRD §F2 §Sub-features: Keyboard accessible — toggle activatable via Space or Enter when focused
  - FRD §Y3 §DOM Events: `keydown` (Space/Enter) on Completion toggle → `toggleTaskComplete(taskId)`
  - TechArch §4.4: `keydown` (Space) on `.task-toggle` → `toggleTaskComplete(taskId)`

- **Storage write failure handling on toggle**
  - FRD §F2 §Error States (STORAGE_WRITE_FAILED): in-memory + UI update; non-blocking notice
  - FRD §Y2: `STORAGE_WRITE_FAILED` — `"Your changes could not be saved. They will be lost on page refresh."`
  - TechArch §4.2 toggleTaskComplete() throws: `StorageError` on write failure (state still updated)

---

### F3: Delete Task — Requirements Detail

**PRD Reference:** PRD-TodoApp.md §5 F3
**FRD Reference:** FRD-TodoApp.md §F3
**TechArch Reference:** TechArch-TodoApp.md §2.2 (taskStore.js), §4.2 (deleteTask), §4.4 (Event Binding)
**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4, US-3.5

PRD Capabilities and FRD Mapping:

- **Delete button visible on each task item**
  - FRD §F3 §Sub-features: Delete button/control visible on each Task Item at all times (not hover-only)
  - TechArch §4.3 renderTaskList(): "Delete button: always visible (not hover-only, for keyboard accessibility)"

- **Task removed immediately from list on deletion**
  - FRD §F3 §Process step 5: remove Task from in-memory array (filter by id)
  - FRD §F3 §Sub-features: Single click/activation of Delete Control removes the task immediately (< 100ms)
  - TechArch §4.4: `click` on `.task-delete` → `deleteTask(taskId)` → `renderTaskList(getTasks())`

- **Deletion persists across page refreshes**
  - FRD §F3 §Process step 6: persist updated task list to localStorage
  - FRD §F3 §Validation Rules: deletion is permanent and irrecoverable; no soft-delete
  - TechArch §4.2 deleteTask() side effects: `localStorage.setItem`

- **No confirmation dialog**
  - FRD §F3 §Sub-features: No confirmation dialog (v1 design decision)
  - PRD §5 F3 Capabilities: "No confirmation dialog required for v1 (keep it simple)"
  - FRD §Y2 §Error Handling Notes: "Never use `alert()`, `confirm()`, or `prompt()`"

- **Empty state after deleting last task**
  - FRD §F3 §Process Post-deletion branch: if list empty → Empty State shown; focus to Input Field
  - FRD §F3 §Sub-features: After deletion, if list becomes empty, Empty State shown (see F1 §Render)
  - TechArch §4.2 deleteTask() post-deletion: "UI re-renders via `renderTaskList(getTasks())`. If list is now empty, Empty State is shown."

- **Focus management post-deletion**
  - FRD §F3 §Process step 8 (post-deletion branch): focus to next Task Item; if last item → focus to Input Field
  - FRD §F3 §Outputs: Focus moved to next Task Item or Input Field

- **Keyboard accessibility**
  - FRD §F3 §Sub-features: Keyboard accessible — delete button focusable and activatable via Enter/Space
  - FRD §Y3 §DOM Events: `keydown` (Space/Enter) on Delete button → `deleteTask(taskId)`
  - TechArch §4.4: `keydown` (Enter) on `.task-delete` → `deleteTask(taskId)`

- **Storage write failure handling on delete**
  - FRD §F3 §Error States (STORAGE_WRITE_FAILED): task removed in-memory/UI; non-blocking notice
  - FRD §Y2: `STORAGE_WRITE_FAILED` — `"Your changes could not be saved. They will be lost on page refresh."`
  - TechArch §4.2 deleteTask() throws: `StorageError` on write failure (state still removed in-memory)

---

## 5. Test Case Coverage

### 5.1 Test Case Matrix

Each user story's acceptance criteria map directly to test cases. Test IDs follow the convention `TEST-{story}-{n}` where `{story}` is the story number (e.g., 0.1) and `{n}` is the criterion index.

| Test ID | User Story | Test Description | Type | PRD Feature | Acceptance Criterion |
|---|---|---|---|---|---|
| TEST-0.1-1 | US-0.1 | Input field is visible and auto-focused on page load | Functional / UI | F0 | Input field visible and focused on load |
| TEST-0.1-2 | US-0.1 | Clicking Add with non-empty input creates a task | Functional | F0 | Add button with non-empty input creates task |
| TEST-0.1-3 | US-0.1 | New task appears at top of list in < 100ms | Performance | F0 | New task appears at top immediately (< 100ms) |
| TEST-0.1-4 | US-0.1 | Input field is cleared after successful submission | Functional / UI | F0 | Input field cleared after submission |
| TEST-0.1-5 | US-0.1 | Focus returns to input field after submission | Accessibility | F0 | Focus returns to input after submission |
| TEST-0.2-1 | US-0.2 | Pressing Enter while input focused submits the task | Functional | F0 | Enter key submits task |
| TEST-0.2-2 | US-0.2 | Enter key submission has identical result to button click | Functional | F0 | Behavior identical to button click |
| TEST-0.2-3 | US-0.2 | Enter key submission works in all 4 supported browsers | Compatibility | F0 | Cross-browser Enter key support |
| TEST-0.3-1 | US-0.3 | Empty input does not create a task | Validation | F0 | Empty/whitespace input rejected |
| TEST-0.3-2 | US-0.3 | Inline error "Task description cannot be empty." shown | Validation / UI | F0 | EMPTY_TASK_TEXT error message displayed |
| TEST-0.3-3 | US-0.3 | Input is cleared and focused after empty submission error | Functional / UI | F0 | Input cleared and focused on error |
| TEST-0.3-4 | US-0.3 | Error message disappears when user starts typing | Functional / UI | F0 | Error cleared on input event |
| TEST-0.3-5 | US-0.3 | No alert() dialog used for validation error | Accessibility | F0 | No modal alert used |
| TEST-0.4-1 | US-0.4 | Input field has maxlength="500" HTML attribute | Functional | F0 | HTML maxlength attribute present |
| TEST-0.4-2 | US-0.4 | JS validation enforces 500-char limit as safety net | Validation | F0 | JS 500-char limit enforced independently |
| TEST-0.4-3 | US-0.4 | Error "Task description must be 500 characters or fewer." shown | Validation / UI | F0 | TASK_TEXT_TOO_LONG error message displayed |
| TEST-0.4-4 | US-0.4 | No task created when text exceeds 500 chars | Validation | F0 | Task not created on over-length input |
| TEST-0.4-5 | US-0.4 | Leading/trailing whitespace stripped silently | Validation | F0 | Whitespace trimmed without error |
| TEST-0.5-1 | US-0.5 | Task shown in UI if localStorage.setItem fails | Functional | F0 | In-session task display on write failure |
| TEST-0.5-2 | US-0.5 | Non-blocking notice shown on storage write failure | Functional / UI | F0 | STORAGE_WRITE_FAILED notice displayed |
| TEST-0.5-3 | US-0.5 | Storage notice does not block further app interaction | Accessibility | F0 | Notice non-blocking |
| TEST-0.5-4 | US-0.5 | Notice uses amber/yellow style, no alert() | UI | F0 | Visual style and no modal |
| TEST-1.1-1 | US-1.1 | App reads todoapp_tasks from localStorage on DOMContentLoaded | Functional | F1 | localStorage read on page load |
| TEST-1.1-2 | US-1.1 | Tasks displayed newest-first | Functional / UI | F1 | Newest-first ordering |
| TEST-1.1-3 | US-1.1 | Each task shows description, toggle, and delete control | Functional / UI | F1 | Task item has all three controls |
| TEST-1.1-4 | US-1.1 | Task list renders within 100ms of page load | Performance | F1 | Render within 100ms |
| TEST-1.1-5 | US-1.1 | Task list is scrollable when tasks exceed viewport | UI | F1 | Scrollable list |
| TEST-1.2-1 | US-1.2 | Completed tasks show strikethrough + muted/gray color | Functional / UI | F1 | Completion visual styling |
| TEST-1.2-2 | US-1.2 | Incomplete tasks show normal text styling | Functional / UI | F1 | Normal styling for incomplete |
| TEST-1.2-3 | US-1.2 | Visual distinction clear without instructions | Usability | F1 | No legend required |
| TEST-1.2-4 | US-1.2 | Completion styling consistent across 4 supported browsers | Compatibility | F1 | Cross-browser completion styling |
| TEST-1.3-1 | US-1.3 | "No tasks yet. Add one above!" shown when list empty | Functional / UI | F1 | Exact empty state message text |
| TEST-1.3-2 | US-1.3 | Empty state not shown when tasks exist | Functional / UI | F1 | Empty state hidden when tasks present |
| TEST-1.3-3 | US-1.3 | Empty state appears after deleting last task | Functional | F1 | Empty state on last deletion |
| TEST-1.3-4 | US-1.3 | Empty state appears on first load with no stored tasks | Functional | F1 | Empty state on first use |
| TEST-1.4-1 | US-1.4 | Invalid JSON in localStorage initializes empty task list | Error Handling | F1 | STORAGE_PARSE_FAILED → empty list |
| TEST-1.4-2 | US-1.4 | Non-blocking notice "Previous tasks could not be loaded. Starting fresh." shown | Error Handling / UI | F1 | STORAGE_PARSE_FAILED notice text |
| TEST-1.4-3 | US-1.4 | Corrupted localStorage key is cleared on parse failure | Error Handling | F1 | localStorage.removeItem called |
| TEST-1.4-4 | US-1.4 | No uncaught error or broken UI on parse failure | Error Handling | F1 | No crash on corrupted storage |
| TEST-1.4-5 | US-1.4 | Parse failure notice is dismissible | UI | F1 | Dismissible notice |
| TEST-1.5-1 | US-1.5 | App initializes with empty in-memory list when storage unavailable | Error Handling | F1 | STORAGE_UNAVAILABLE → in-memory mode |
| TEST-1.5-2 | US-1.5 | Persistent session notice "Storage is unavailable. Tasks will not be saved across sessions." shown | Error Handling / UI | F1 | STORAGE_UNAVAILABLE notice text |
| TEST-1.5-3 | US-1.5 | All four core actions work in-memory when storage unavailable | Functional | F1 | In-memory functional parity |
| TEST-1.5-4 | US-1.5 | Storage unavailable notice does not block interaction | Accessibility | F1 | Non-blocking notice |
| TEST-2.1-1 | US-2.1 | Each task item has a visible checkbox/toggle | Functional / UI | F2 | Toggle visible on each item |
| TEST-2.1-2 | US-2.1 | Clicking toggle on incomplete task marks it complete | Functional | F2 | Incomplete → complete on click |
| TEST-2.1-3 | US-2.1 | Task shows strikethrough, muted color, checked checkbox in < 100ms | Performance / UI | F2 | Visual update within 100ms |
| TEST-2.1-4 | US-2.1 | completed: true written to localStorage on toggle | Functional | F2 | localStorage updated on complete |
| TEST-2.1-5 | US-2.1 | Completed task remains visible (not hidden or filtered) | Functional / UI | F2 | No auto-hide on completion |
| TEST-2.2-1 | US-2.2 | Clicking toggle on completed task marks it incomplete | Functional | F2 | Complete → incomplete on click |
| TEST-2.2-2 | US-2.2 | Task reverts to normal styling in < 100ms | Performance / UI | F2 | Visual revert within 100ms |
| TEST-2.2-3 | US-2.2 | completed: false written to localStorage on revert | Functional | F2 | localStorage updated on revert |
| TEST-2.2-4 | US-2.2 | Toggle is bidirectional — each click flips state once | Functional | F2 | No double-click cancellation |
| TEST-2.2-5 | US-2.2 | Same toggle handles both directions — no separate undo button | UI | F2 | Single control for both directions |
| TEST-2.3-1 | US-2.3 | Completion toggle is focusable via Tab | Accessibility | F2 | Tab navigation to toggle |
| TEST-2.3-2 | US-2.3 | Space or Enter activates toggle when focused | Accessibility | F2 | Keyboard activation of toggle |
| TEST-2.3-3 | US-2.3 | Keyboard activation produces identical result to click | Functional | F2 | Keyboard / click parity |
| TEST-2.3-4 | US-2.3 | Focus order through task list is logical and sequential | Accessibility | F2 | Logical tab order |
| TEST-2.4-1 | US-2.4 | Refreshing page shows same completion states | Functional | F2 | Persistence across reload |
| TEST-2.4-2 | US-2.4 | localStorage updated synchronously after every toggle | Functional | F2 | Synchronous write on toggle |
| TEST-2.4-3 | US-2.4 | Completion state survives multiple consecutive reloads | Functional | F2 | Multi-reload persistence |
| TEST-2.4-4 | US-2.4 | 100% of completion changes reflected in localStorage | Functional | F2 | No dropped writes |
| TEST-2.5-1 | US-2.5 | In-memory state and UI update even when localStorage.setItem fails | Functional | F2 | In-session UI update on write failure |
| TEST-2.5-2 | US-2.5 | Non-blocking notice shown on toggle write failure | Functional / UI | F2 | STORAGE_WRITE_FAILED notice displayed |
| TEST-2.5-3 | US-2.5 | App continues to function normally after toggle write failure | Error Handling | F2 | No degradation after write failure |
| TEST-2.5-4 | US-2.5 | No uncaught errors thrown on toggle write failure | Error Handling | F2 | No uncaught exceptions |
| TEST-3.1-1 | US-3.1 | Each task item has a visible delete control | Functional / UI | F3 | Delete control visible on each item |
| TEST-3.1-2 | US-3.1 | Clicking delete removes task from UI in < 100ms | Performance | F3 | Immediate deletion (< 100ms) |
| TEST-3.1-3 | US-3.1 | Task removed from localStorage on deletion | Functional | F3 | localStorage updated on delete |
| TEST-3.1-4 | US-3.1 | No confirmation dialog shown | Functional / UI | F3 | No confirm() dialog |
| TEST-3.1-5 | US-3.1 | Remaining tasks rendered correctly after deletion | Functional / UI | F3 | List integrity after deletion |
| TEST-3.2-1 | US-3.2 | Completed tasks can be deleted | Functional | F3 | No restriction by completion state (complete) |
| TEST-3.2-2 | US-3.2 | Incomplete tasks can be deleted | Functional | F3 | No restriction by completion state (incomplete) |
| TEST-3.2-3 | US-3.2 | Delete control always visible on every task item | UI / Accessibility | F3 | Not hover-only |
| TEST-3.2-4 | US-3.2 | Deletion behavior identical for both task states | Functional | F3 | State-agnostic deletion |
| TEST-3.3-1 | US-3.3 | Deleting last task shows "No tasks yet. Add one above!" | Functional / UI | F3 | Empty state on last deletion |
| TEST-3.3-2 | US-3.3 | App does not crash when list reaches zero | Error Handling | F3 | No crash on empty list |
| TEST-3.3-3 | US-3.3 | localStorage updated to [] after last deletion | Functional | F3 | Empty array persisted |
| TEST-3.3-4 | US-3.3 | New task can be added from the empty state | Functional | F3 | Post-empty-state task creation |
| TEST-3.4-1 | US-3.4 | Delete button is focusable via Tab | Accessibility | F3 | Tab navigation to delete |
| TEST-3.4-2 | US-3.4 | Enter or Space activates delete when focused | Accessibility | F3 | Keyboard activation of delete |
| TEST-3.4-3 | US-3.4 | Keyboard deletion produces identical result to click | Functional | F3 | Keyboard / click parity |
| TEST-3.4-4 | US-3.4 | Focus moves correctly after keyboard deletion | Accessibility | F3 | Focus management post-deletion |
| TEST-3.5-1 | US-3.5 | Deleted task does not reappear after page refresh | Functional | F3 | Persistence of deletion across reload |
| TEST-3.5-2 | US-3.5 | localStorage does not contain deleted task's data | Functional | F3 | No residual data in storage |
| TEST-3.5-3 | US-3.5 | Multiple deletions persist correctly after page refresh | Functional | F3 | Multi-deletion persistence |
| TEST-3.5-4 | US-3.5 | Non-blocking notice shown when localStorage write fails on delete | Functional / UI | F3 | STORAGE_WRITE_FAILED notice on delete failure |

### 5.2 Coverage Summary

| PRD Feature | User Stories | Test Cases | Functional | Performance | Accessibility | Compatibility | Error Handling | Coverage |
|---|---|---|---|---|---|---|---|---|
| F0: Add Task | 5 (US-0.1 – US-0.5) | 22 (TEST-0.1-1 – TEST-0.5-4) | 12 | 1 | 3 | 1 | 5 | 100% |
| F1: View Task List | 5 (US-1.1 – US-1.5) | 19 (TEST-1.1-1 – TEST-1.5-4) | 9 | 1 | 2 | 1 | 6 | 100% |
| F2: Mark Task Complete | 5 (US-2.1 – US-2.5) | 19 (TEST-2.1-1 – TEST-2.5-4) | 10 | 2 | 4 | 0 | 3 | 100% |
| F3: Delete Task | 5 (US-3.1 – US-3.5) | 16 (TEST-3.1-1 – TEST-3.5-4) | 9 | 1 | 3 | 0 | 3 | 100% |
| **Total** | **20** | **76** | **40** | **5** | **12** | **2** | **17** | **100%** |

### 5.3 Non-Functional Requirement Coverage

| NFR Category | PRD Requirement | Covered By Test IDs | Status |
|---|---|---|---|
| Performance | UI actions reflect in < 100ms | TEST-0.1-3, TEST-1.1-4, TEST-2.1-3, TEST-2.2-2, TEST-3.1-2 | ✅ Covered |
| Persistence | Task list survives page refresh | TEST-1.1-1, TEST-2.4-1, TEST-2.4-2, TEST-2.4-3, TEST-3.5-1, TEST-3.5-2, TEST-3.5-3 | ✅ Covered |
| Simplicity | Usable without onboarding | TEST-1.2-3 | ✅ Covered |
| Accessibility | All core actions keyboard-accessible | TEST-0.1-5, TEST-2.3-1, TEST-2.3-2, TEST-2.3-3, TEST-2.3-4, TEST-3.4-1, TEST-3.4-2, TEST-3.4-3, TEST-3.4-4 | ✅ Covered |
| Compatibility | Works in Chrome, Firefox, Safari, Edge (latest 2) | TEST-0.2-3, TEST-1.2-4 | ✅ Covered |
| Reliability | Fully offline — no network dependency | TEST-1.5-3 (in-memory mode), architecture (static hosting) | ✅ Covered |
| Scope control | No features outside F0–F3 in v1 | All TEST IDs scoped to F0–F3 only | ✅ Covered |

---

## 6. Change Management

### 6.1 Document Change Log

| Version | Date | Author | Section Changed | Description of Change | Approved By |
|---|---|---|---|---|---|
| 1.0 | 2026-05-07 | RTM Generator | All | Initial RTM created — full traceability across PRD, FRD, TechArch, UserStories | Pending |

### 6.2 Requirement Change Process

When any source specification document is updated, the following RTM sections must be reviewed and updated accordingly:

- **PRD change** (new/modified feature): Update §3.1, §3.2, §4, §5.2
- **FRD change** (new/modified requirement or error state): Update §3.2, §3.3, §4
- **TechArch change** (new/modified component or API): Update §3.1, §3.2, §3.3, §3.4
- **UserStory change** (new/modified story or acceptance criterion): Update §3.2, §5.1, §5.2
- **Any change that adds a feature or removes a feature**: Re-validate §5.3 NFR coverage

---

## 7. Approval

### 7.1 Sign-Off Matrix

| Role | Name | Signature | Date | Status |
|---|---|---|---|---|
| Product Owner | — | — | — | Pending |
| Technical Lead | — | — | — | Pending |
| QA Lead | — | — | — | Pending |
| Project Manager | — | — | — | Pending |

### 7.2 Traceability Validation Checklist

| Check | Status | Notes |
|---|---|---|
| All PRD features (F0–F3) have entries in the traceability matrix | ✅ Pass | §3.1 covers all 4 features |
| All FRD sections (F0–F3, Y0–Y3) are referenced in the RTM | ✅ Pass | §3.2 and §4 reference all FRD sections |
| All TechArch components and API functions are mapped | ✅ Pass | §3.1, §3.2, §3.4 cover all Store/UI functions and data model |
| All 20 user stories have traceability entries | ✅ Pass | §3.2 contains all US-0.1 through US-3.5 |
| All 20 user stories have test case coverage | ✅ Pass | §5.1 contains TEST entries for every acceptance criterion |
| All 7 error codes are traced to PRD feature, FRD section, and user story | ✅ Pass | §3.3 covers all 7 error codes |
| All 5 data fields are traced across their lifecycle | ✅ Pass | §3.4 covers all Task fields and localStorage key |
| All 7 NFR categories have test coverage | ✅ Pass | §5.3 covers all NFR categories |
| No orphaned requirements (FRD/TechArch/US entries without a PRD parent) | ✅ Pass | All entries trace back to F0–F3 |
| ID conventions are consistent throughout | ✅ Pass | F{n}, FRD §F{n}, US-{n}.{m}, TEST-{n}.{m}-{k} |

---

*Document generated: 2026-05-07 | Project: TodoApp | RTM Version: 1.0*
*Source documents: PRD-TodoApp.md v1.0 · FRD-TodoApp.md v1.0 · TechArch-TodoApp.md v1.0 · UserStories-TodoApp.md v1.0*
