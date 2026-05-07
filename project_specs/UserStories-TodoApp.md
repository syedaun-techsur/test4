# User Stories: Basic To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | TodoApp |
| **Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related PRD** | PRD-TodoApp.md v1.0 |
| **Related FRD** | FRD-TodoApp.md v1.0 |
| **Related Personas** | PERSONAS-TodoApp.md v1.0 |

---

## Priority Definitions

| Priority | Label | Description |
|---|---|---|
| **P0** | Critical | Required for MVP launch — app is non-functional without it |
| **P1** | High | High value; target for v1 if time allows |
| **P2** | Nice to Have | Candidate for v2 |
| **P3** | Low | Future consideration |

---

## Epic 0: Add Task (F0)

Users can capture a new task by entering a text description and submitting it. This is the primary entry point into every user workflow.

### US-0.1: Add a Task via Button Click
**As a** busy professional like Maya Torres, **I want to** type a task description and click the Add button, **so that** my task is immediately captured and visible in the list without any friction.

**Acceptance Criteria:**
- [ ] An input field is visible and focused on page load
- [ ] Clicking the Add button with a non-empty input creates a new task
- [ ] The new task appears at the top of the task list immediately (< 100ms)
- [ ] The input field is cleared after successful submission
- [ ] Focus returns to the input field after submission, ready for the next task

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Add a Task via Enter Key
**As a** keyboard-first user like Liam Okafor, **I want to** press Enter to submit a task instead of clicking the Add button, **so that** I can capture tasks quickly without reaching for the mouse.

**Acceptance Criteria:**
- [ ] Pressing Enter while the input field has focus submits the task
- [ ] Behavior is identical to button-click submission (task appears at top, field clears, focus restores)
- [ ] Enter key submission works in all supported browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Prevent Empty Task Submission
**As a** busy professional like Maya Torres, **I want to** be prevented from accidentally submitting a blank task, **so that** my task list stays clean and free of meaningless entries.

**Acceptance Criteria:**
- [ ] Submitting an empty or whitespace-only input does not create a task
- [ ] An inline error message "Task description cannot be empty." appears below the input field
- [ ] The input field is cleared and receives focus after the error is shown
- [ ] The error message disappears when the user starts typing again
- [ ] No `alert()` dialogs are used

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: Enforce Maximum Task Length
**As a** developer evaluator like Dev Sharma, **I want to** confirm that the app enforces a 500-character maximum on task descriptions, **so that** I can trust the input validation is production-quality.

**Acceptance Criteria:**
- [ ] The input field has a `maxlength="500"` HTML attribute
- [ ] JavaScript validation also enforces the 500-character limit as a safety net
- [ ] Submitting text longer than 500 characters shows the inline error: "Task description must be 500 characters or fewer."
- [ ] No task is created when the text exceeds the limit
- [ ] Leading and trailing whitespace is silently stripped before validation (not treated as an error)

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.5: Graceful Handling of Storage Write Failure on Add
**As a** privacy-conscious user like Liam Okafor, **I want to** be notified if my newly added task cannot be saved to storage, **so that** I know my data may be lost on refresh and can take appropriate action.

**Acceptance Criteria:**
- [ ] If `localStorage.setItem` fails during task creation, the task is still shown in the UI for the current session
- [ ] A non-blocking notice is displayed: "Your task was added but could not be saved. It will be lost on page refresh."
- [ ] The notice does not block further interaction with the app
- [ ] The notice uses a visually distinct style (e.g., amber/yellow warning) and does not use `alert()`

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: View Task List (F1)

Users can see all their tasks in a single scrollable list that clearly distinguishes completed from incomplete tasks. The list loads from localStorage on startup and re-renders after every change.

### US-1.1: View All Tasks on Page Load
**As a** privacy-conscious user like Liam Okafor, **I want to** open the app and immediately see all my previously added tasks, **so that** I can pick up where I left off without losing any work.

**Acceptance Criteria:**
- [ ] On `DOMContentLoaded`, the app reads `localStorage` key `todoapp_tasks` and renders all stored tasks
- [ ] Tasks are displayed newest-first (most recently added at the top)
- [ ] Each task item shows its description text, a completion toggle, and a delete control
- [ ] The task list renders within 100ms of page load
- [ ] The list is scrollable when task count exceeds the visible viewport

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Distinguish Completed Tasks Visually
**As a** busy professional like Maya Torres, **I want to** immediately see which of my tasks are done and which are still pending, **so that** I can quickly focus on what still needs my attention.

**Acceptance Criteria:**
- [ ] Completed tasks display with strikethrough text decoration and muted/gray text color
- [ ] Incomplete tasks display with normal text styling
- [ ] The visual distinction is clear without requiring instructions or a legend
- [ ] Completion state styling is consistent across all supported browsers

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: See an Empty State When No Tasks Exist
**As a** new user or someone who has cleared their list, **I want to** see a helpful message when there are no tasks, **so that** I understand the app is working and know what to do next.

**Acceptance Criteria:**
- [ ] When the task list is empty, a message such as "No tasks yet. Add one above!" is displayed in the task list area
- [ ] The empty state message is not shown when one or more tasks exist
- [ ] The empty state appears after deleting the last remaining task
- [ ] The empty state appears on first load when `localStorage` contains no tasks

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.4: Recover Gracefully from Corrupted Storage Data
**As a** developer evaluator like Dev Sharma, **I want to** verify that the app handles corrupted `localStorage` data without crashing, **so that** I can trust the app's robustness in edge-case production scenarios.

**Acceptance Criteria:**
- [ ] If `localStorage` contains invalid JSON, the app initializes with an empty task list
- [ ] A non-blocking notice is shown: "Previous tasks could not be loaded. Starting fresh."
- [ ] The corrupted `localStorage` key is cleared to prevent repeated failures on subsequent loads
- [ ] The app does not throw an uncaught error or render a broken UI
- [ ] The notice is dismissible and does not block interaction

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.5: Use the App When localStorage Is Unavailable
**As a** privacy-conscious user like Liam Okafor, **I want to** still be able to use the app in environments where storage is blocked (e.g., private browsing), **so that** the app is still useful even if data won't persist.

**Acceptance Criteria:**
- [ ] If `localStorage` is unavailable, the app initializes with an empty in-memory list
- [ ] A persistent notice is displayed for the entire session: "Storage is unavailable. Tasks will not be saved across sessions."
- [ ] All four core actions (add, view, complete, delete) remain functional in-memory for the session
- [ ] The notice does not block interaction and uses a non-modal style

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Mark Task Complete (F2)

Users can toggle any task between complete and incomplete. Completion state is immediately reflected visually and persisted to localStorage.

### US-2.1: Mark an Incomplete Task as Complete
**As a** busy professional like Maya Torres, **I want to** check off a task when I finish it, **so that** I get a clear sense of progress and can see what I've accomplished.

**Acceptance Criteria:**
- [ ] Each task item has a visible checkbox/toggle control
- [ ] Clicking the toggle on an incomplete task marks it as complete
- [ ] The task immediately shows strikethrough text, muted color, and a checked checkbox (< 100ms)
- [ ] The updated `completed: true` state is written to `localStorage`
- [ ] The task remains visible in the list (not hidden or filtered out)

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Toggle a Completed Task Back to Incomplete
**As a** privacy-conscious user like Liam Okafor, **I want to** uncheck a completed task when my plans change, **so that** I can reactivate it without having to re-type it.

**Acceptance Criteria:**
- [ ] Clicking the toggle on a completed task marks it as incomplete
- [ ] The task immediately reverts to normal text styling and an unchecked checkbox (< 100ms)
- [ ] The updated `completed: false` state is written to `localStorage`
- [ ] The toggle is bidirectional: every click flips the state once (no double-click cancellation)
- [ ] No separate "undo" button is required — the same toggle control handles both directions

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Toggle Tasks Using the Keyboard
**As a** keyboard-first user like Liam Okafor, **I want to** complete and un-complete tasks using only the keyboard, **so that** I can manage my task list without switching to the mouse.

**Acceptance Criteria:**
- [ ] The completion toggle is focusable via Tab key navigation
- [ ] Pressing Space or Enter when the toggle has focus activates it
- [ ] Keyboard activation produces the identical visual and persistence result as a click
- [ ] Focus order through the task list is logical and sequential

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: Persist Completion State Across Page Refreshes
**As a** privacy-conscious user like Liam Okafor, **I want to** reload the page and see my tasks' completion states exactly as I left them, **so that** my progress is not lost between sessions.

**Acceptance Criteria:**
- [ ] After marking tasks complete or incomplete, refreshing the page shows the same states
- [ ] `localStorage` is updated synchronously after every toggle
- [ ] Completion state survives multiple consecutive page reloads
- [ ] 100% of completion state changes are reflected in `localStorage`

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.5: Graceful Handling of Storage Write Failure on Toggle
**As a** developer evaluator like Dev Sharma, **I want to** verify that a storage write failure during a toggle does not break the UI, **so that** I can confirm the app degrades gracefully under adverse conditions.

**Acceptance Criteria:**
- [ ] If `localStorage.setItem` fails during a toggle, the in-memory state and UI still update correctly for the session
- [ ] A non-blocking notice is shown: "Changes could not be saved. They will be lost on page refresh."
- [ ] The app continues to function normally for subsequent interactions
- [ ] No uncaught errors are thrown

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: Delete Task (F3)

Users can permanently remove any task from the list. Deletion is immediate, requires no confirmation, and removes the task from both the UI and localStorage.

### US-3.1: Delete a Task from the List
**As a** busy professional like Maya Torres, **I want to** remove tasks that are no longer relevant, **so that** my list stays clean and focused on what actually matters.

**Acceptance Criteria:**
- [ ] Each task item has a visible delete control (button or icon, e.g., "×" or trash icon)
- [ ] Clicking the delete control removes the task from the UI immediately (< 100ms)
- [ ] The task is also removed from `localStorage` on deletion
- [ ] No confirmation dialog is shown before deletion
- [ ] The remaining tasks are rendered correctly after deletion

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: Delete Both Complete and Incomplete Tasks
**As a** busy professional like Maya Torres, **I want to** delete any task regardless of its completion state, **so that** I have full control over my list at all times.

**Acceptance Criteria:**
- [ ] Completed tasks can be deleted
- [ ] Incomplete tasks can be deleted
- [ ] The delete control is always visible on every task item (not hover-only)
- [ ] Deletion behavior is identical for both task states

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: See Empty State After Deleting the Last Task
**As a** new user, **I want to** see a friendly empty state message after deleting my last task, **so that** I know the app is working and my list is now empty — not broken.

**Acceptance Criteria:**
- [ ] Deleting the last task in the list triggers the empty state message (e.g., "No tasks yet. Add one above!")
- [ ] The app does not crash or render a broken state when the list reaches zero tasks
- [ ] `localStorage` is updated to an empty array `[]` (or the key contains `"[]"`)
- [ ] A new task can be added normally from the empty state

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.4: Delete Tasks Using the Keyboard
**As a** developer evaluator like Dev Sharma, **I want to** confirm that the delete control is keyboard-accessible, **so that** I can verify the app meets accessibility and code-quality standards.

**Acceptance Criteria:**
- [ ] The delete button is focusable via Tab key navigation
- [ ] Pressing Enter or Space when the delete button has focus activates deletion
- [ ] Keyboard deletion produces the identical result as a click (task removed, list re-renders, localStorage updated)
- [ ] Focus moves to a logical next element after deletion (e.g., the next task or the input field)

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.5: Confirm Deleted Tasks Do Not Reappear After Refresh
**As a** privacy-conscious user like Liam Okafor, **I want to** be sure that a deleted task is permanently gone after refreshing the page, **so that** I trust the app's data integrity.

**Acceptance Criteria:**
- [ ] After deleting a task and refreshing the page, the deleted task does not reappear
- [ ] `localStorage` does not contain the deleted task's data after the delete operation
- [ ] Multiple deletions followed by a page refresh all persist correctly
- [ ] If `localStorage` write fails during deletion, a non-blocking notice is shown: "Changes could not be saved. The deleted task may reappear on page refresh."

**Priority:** P0 | **Feature Ref:** F3

---

## Story Index

| Story ID | Title | Persona(s) | Priority | Feature Ref |
|---|---|---|---|---|
| US-0.1 | Add a Task via Button Click | Maya Torres | P0 | F0 |
| US-0.2 | Add a Task via Enter Key | Liam Okafor | P0 | F0 |
| US-0.3 | Prevent Empty Task Submission | Maya Torres | P0 | F0 |
| US-0.4 | Enforce Maximum Task Length | Dev Sharma | P0 | F0 |
| US-0.5 | Graceful Handling of Storage Write Failure on Add | Liam Okafor | P0 | F0 |
| US-1.1 | View All Tasks on Page Load | Liam Okafor | P0 | F1 |
| US-1.2 | Distinguish Completed Tasks Visually | Maya Torres | P0 | F1 |
| US-1.3 | See an Empty State When No Tasks Exist | All users | P0 | F1 |
| US-1.4 | Recover Gracefully from Corrupted Storage Data | Dev Sharma | P0 | F1 |
| US-1.5 | Use the App When localStorage Is Unavailable | Liam Okafor | P0 | F1 |
| US-2.1 | Mark an Incomplete Task as Complete | Maya Torres | P0 | F2 |
| US-2.2 | Toggle a Completed Task Back to Incomplete | Liam Okafor | P0 | F2 |
| US-2.3 | Toggle Tasks Using the Keyboard | Liam Okafor | P0 | F2 |
| US-2.4 | Persist Completion State Across Page Refreshes | Liam Okafor | P0 | F2 |
| US-2.5 | Graceful Handling of Storage Write Failure on Toggle | Dev Sharma | P0 | F2 |
| US-3.1 | Delete a Task from the List | Maya Torres | P0 | F3 |
| US-3.2 | Delete Both Complete and Incomplete Tasks | Maya Torres | P0 | F3 |
| US-3.3 | See Empty State After Deleting the Last Task | All users | P0 | F3 |
| US-3.4 | Delete Tasks Using the Keyboard | Dev Sharma | P0 | F3 |
| US-3.5 | Confirm Deleted Tasks Do Not Reappear After Refresh | Liam Okafor | P0 | F3 |

---

## Coverage Summary

| Feature | Stories | All PRD Capabilities Covered |
|---|---|---|
| F0 — Add Task | US-0.1 through US-0.5 | ✅ Button submit, Enter submit, empty validation, max-length validation, storage failure |
| F1 — View Task List | US-1.1 through US-1.5 | ✅ Page load hydration, visual distinction, empty state, corrupted data, unavailable storage |
| F2 — Mark Task Complete | US-2.1 through US-2.5 | ✅ Mark complete, toggle back, keyboard access, persistence, storage failure |
| F3 — Delete Task | US-3.1 through US-3.5 | ✅ Delete task, all completion states, empty state, keyboard access, persistence |

---

*Document generated: 2026-05-07 | Project: TodoApp | UserStories Version: 1.0*
