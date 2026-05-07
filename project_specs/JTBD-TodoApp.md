# JTBD: Basic To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | TodoApp |
| **Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related Personas** | PERSONAS-TodoApp.md v1.0 (PER-01, PER-02, PER-03) |
| **Related PRD** | PRD-TodoApp.md v1.0 |
| **Derived From** | PRD §2 Problem Statement, §5 Features, §7 Success Metrics; Personas Goals, Pain Points, Top Tasks |

---

## JTBD Summary Table

| JTBD-ID | Persona | Job Statement (abbreviated) | Priority |
|---|---|---|---|
| JTBD-01.1 | PER-01 Maya | Capture a task instantly before the thought is lost | P0 |
| JTBD-01.2 | PER-01 Maya | Scan the full task list and decide what to work on next | P0 |
| JTBD-01.3 | PER-01 Maya | Close the loop on a completed task with a satisfying acknowledgment | P0 |
| JTBD-01.4 | PER-01 Maya | Remove tasks that are no longer relevant to keep the list clean | P0 |
| JTBD-02.1 | PER-02 Liam | Manage tasks entirely on-device with no data leaving the browser | P0 |
| JTBD-02.2 | PER-02 Liam | Use the task list fully offline without any network dependency | P0 |
| JTBD-02.3 | PER-02 Liam | Trust that tasks will still be there after closing and reopening the browser | P0 |
| JTBD-02.4 | PER-02 Liam | Undo a completion when plans change without re-entering the task | P0 |
| JTBD-03.1 | PER-03 Dev | Assess whether the implementation follows clean, minimal frontend patterns | P0 |
| JTBD-03.2 | PER-03 Dev | Verify that all four core interactions work correctly including edge cases | P0 |
| JTBD-03.3 | PER-03 Dev | Confirm localStorage integration behaves predictably under adverse scenarios | P0 |
| JTBD-03.4 | PER-03 Dev | Evaluate keyboard accessibility compliance as a signal of code quality | P0 |

---

## PER-01: Maya Torres — Busy Professional / Personal Task Tracker

---

### JTBD-01.1: Zero-Friction Task Capture

**Job Statement:**
When a task or obligation surfaces mid-workday and I have only a moment to record it, I want to capture it immediately without navigating sign-up or setup flows, so I can preserve the thought and return to what I was doing in under 5 seconds.

**Current Alternatives:**
- Opens a notes app (e.g., Apple Notes, Notion) but must navigate folders or pages before typing
- Types a quick email to herself — unreliable and buried in inbox later
- Tries Todoist or Reminders but abandons when sign-in is required before the first task

**Hiring Criteria:**
- Input field is focused and ready to type immediately on page load — no clicks required
- Submit works via Enter key as well as button click
- Empty submissions are blocked (no accidental blank entries)
- Newly added task appears in the list within 100ms of submission
- No account, login, or onboarding step stands between opening the app and typing

**Success Measure:** Maya adds her first task within 10 seconds of opening the app with zero instructions required.

**Related Features:** F0, F1
**Priority:** P0

---

### JTBD-01.2: At-a-Glance Priority Scan

**Job Statement:**
When I sit down to work and need to decide what to tackle first, I want to see all my pending tasks in a single uncluttered view, so I can quickly identify my highest-priority item without scrolling through completed noise or switching between tools.

**Current Alternatives:**
- Cross-references 2–3 open browser tabs or app windows to assemble a mental picture
- Relies on email subject lines as a makeshift to-do list
- Reviews handwritten notes that are frequently out of sync with digital captures

**Hiring Criteria:**
- All active tasks are visible in one scrollable list — no pagination or filtering required
- Completed tasks are visually distinct (e.g., strikethrough, muted color) so incomplete items stand out
- Empty state message is shown when the list has no tasks (no blank white screen)
- List renders correctly with no duplicates or phantom items

**Success Measure:** Maya identifies her next actionable task within 30 seconds of opening the app, without performing any manual filtering or sorting.

**Related Features:** F1, F2
**Priority:** P0

---

### JTBD-01.3: Progress Acknowledgment on Completion

**Job Statement:**
When I finish a task during the day, I want to mark it done with a single action and see a clear visual change, so I can feel the satisfaction of progress and keep my attention on what remains.

**Current Alternatives:**
- Physically crosses out items in a paper notebook for visual satisfaction
- Deletes completed tasks immediately in other apps — loses the sense of accomplishment
- Uses Todoist's completion animation but finds the rest of the tool too heavy

**Hiring Criteria:**
- Completion toggles with a single click or keyboard action — no confirmation dialog
- Visual change is immediate and unambiguous (strikethrough and/or checkmark)
- Completed state persists after page refresh so she doesn't lose her progress record
- Completed task can be toggled back to incomplete if she made a mistake

**Success Measure:** Maya marks a task complete in under 2 seconds and the visual change is immediately visible — completion state is preserved after a page reload.

**Related Features:** F2, F1
**Priority:** P0

---

### JTBD-01.4: List Hygiene via Task Deletion

**Job Statement:**
When my task list accumulates items that are no longer relevant or were resolved outside the app, I want to delete them instantly without confirmation prompts, so I can keep the list focused and free of clutter.

**Current Alternatives:**
- Leaves stale tasks in the list until they mentally fade — creates noise
- Archives tasks in other tools which adds a management burden
- Starts a fresh list elsewhere, losing historical capture context

**Hiring Criteria:**
- Delete control is visibly associated with each task item (no hunting for the button)
- Task is removed from the list immediately on deletion — no delay or animation blocking re-use
- Deletion persists across page refreshes (deleted task does not reappear)
- No confirmation dialog required for delete action

**Success Measure:** Maya removes an unwanted task within 3 seconds; the task does not reappear after a page reload.

**Related Features:** F3
**Priority:** P0

---

## PER-02: Liam Okafor — Privacy-Conscious Offline User

---

### JTBD-02.1: Local-Only Data Ownership

**Job Statement:**
When I add and manage tasks throughout my workday, I want all task data to remain exclusively in my local browser with no transmissions to any external server, so I can maintain full ownership of my information without depending on or trusting a third-party service.

**Current Alternatives:**
- Uses a plain text file on his local machine — works but requires a text editor to be open
- Self-hosts a minimal web app — functional but adds maintenance burden
- Paper notebooks — no digital integration, harder to update on the fly

**Hiring Criteria:**
- App operates entirely client-side — no network requests are made for task data
- No account creation or login step exists anywhere in the product
- All data is stored in browser localStorage (inspectable via DevTools)
- No analytics, telemetry, or tracking scripts that could transmit data

**Success Measure:** Liam confirms via browser DevTools Network tab that zero outbound requests are made during a full add/complete/delete session.

**Related Features:** F0, F1, F2, F3, localStorage Persistence
**Priority:** P0

---

### JTBD-02.2: Fully Offline Task Management

**Job Statement:**
When I work in a café, library, or other location with no reliable internet connection, I want the app to load and function completely without a network connection, so I can manage my tasks regardless of connectivity without worrying about the app failing or showing errors.

**Current Alternatives:**
- Avoids web-based task tools altogether when offline — reverts to paper
- Uses a local desktop app (e.g., Obsidian) but it is heavier than needed
- Pre-loads cloud tools before going offline, but they break when sessions expire

**Hiring Criteria:**
- App loads and is fully interactive from a cached browser tab or local file with no network
- All four core actions (add, view, complete, delete) work without any network connection
- No network error messages or degraded states appear during offline use
- No service worker, CDN, or external resource dependencies required to operate

**Success Measure:** Liam opens the app with network disabled in DevTools and successfully adds, views, completes, and deletes a task — all with zero network errors.

**Related Features:** F0, F1, F2, F3
**Priority:** P0

---

### JTBD-02.3: Cross-Session Task Persistence

**Job Statement:**
When I close my browser and return to the app the next day, I want my full task list to be exactly as I left it — with no re-entry or recovery required, so I can trust the app as a reliable single source of truth for my active tasks.

**Current Alternatives:**
- Re-enters tasks from memory each session when using tools without persistence
- Maintains a parallel paper backup as insurance against digital loss
- Uses tools that require a cloud account for persistence — violates his privacy preference

**Hiring Criteria:**
- 100% of tasks (text, completion state) survive a full page reload via localStorage
- localStorage is read on app initialization — list is restored before any user interaction
- If localStorage is unavailable (private mode, quota exceeded), app falls back gracefully with a user-visible notice rather than silently failing
- Tasks are written to localStorage immediately on each state change — no "save" button required

**Success Measure:** After adding 5 tasks and closing the browser tab, reopening the app restores all 5 tasks with their exact completion states intact — verified 100% of the time.

**Related Features:** F1, F2, F3, localStorage Persistence
**Priority:** P0

---

### JTBD-02.4: Completion Undo Without Re-entry

**Job Statement:**
When I mark a task complete but circumstances change and the task is back in play, I want to toggle it back to incomplete with a single action, so I can adjust my task state without deleting and re-entering the same task.

**Current Alternatives:**
- Deletes the completed task and types it again — loses the original capture
- Uses a separate "re-open" note somewhere else — fragments his task tracking
- Switches to a more complex tool that supports undo — adds overhead he wants to avoid

**Hiring Criteria:**
- Completed tasks can be clicked/toggled a second time to return to incomplete state
- Toggle-back is immediate with a visible state change (removes strikethrough, clears checkmark)
- Re-opened task state persists across a page refresh
- No separate "undo" mechanism required — the toggle itself is reversible

**Success Measure:** Liam marks a task complete, toggles it back to incomplete, and refreshes the page — the task appears as incomplete with the correct visual state.

**Related Features:** F2
**Priority:** P0

---

## PER-03: Dev Sharma — Developer / Early Adopter Evaluator

---

### JTBD-03.1: Clean Architecture Assessment

**Job Statement:**
When I evaluate a minimal web app as a potential reference implementation or starting point, I want to quickly determine whether its source code follows clean, minimal frontend patterns without unnecessary dependencies, so I can decide whether to recommend it to junior developers or adapt it for my own projects.

**Current Alternatives:**
- Reviews GitHub repositories directly — time-consuming to assess code quality without running the app
- Evaluates TodoMVC implementations — useful but often include framework comparisons that obscure simplicity
- Reads blog posts about minimal implementations — disconnected from live, working code

**Hiring Criteria:**
- No unnecessary frameworks, libraries, or build tools beyond what the problem requires
- Source code is readable and directly maps to the four core features (F0–F3)
- State management approach is evident and consistent (localStorage as single source of truth)
- No over-engineered abstractions that hide the core patterns

**Success Measure:** Dev confirms in under 10 minutes via source inspection that the app uses no unnecessary dependencies and the state management pattern is clear and consistent throughout.

**Related Features:** F0, F1, F2, F3, localStorage Persistence
**Priority:** P0

---

### JTBD-03.2: Full Feature Correctness Verification

**Job Statement:**
When I run through the four core interactions (add, view, complete, delete) during my evaluation, I want every feature to work correctly on the first attempt with no broken states or unexpected behavior, so I can form a confident judgment about the app's production quality and reliability.

**Current Alternatives:**
- Manually tests each feature in sequence using trial and error — no structured evaluation path
- Relies on the presence of unit tests as a proxy for correctness — tests may not cover UI interactions
- Trusts demo videos — cannot verify edge case handling

**Hiring Criteria:**
- All four features (F0–F3) work correctly in sequence: add → view → complete → delete
- Empty task submission is blocked by input validation — blank tasks never appear in the list
- No UI states exist where tasks are stuck, duplicated, or unresponsive
- Deleted tasks do not reappear after a page refresh

**Success Measure:** Dev completes the full add→view→complete→delete sequence in one pass with zero broken states, including an attempted empty submission that is correctly rejected.

**Related Features:** F0, F1, F2, F3
**Priority:** P0

---

### JTBD-03.3: localStorage Resilience Verification

**Job Statement:**
When I probe the app's data persistence layer during evaluation, I want to verify that localStorage integration behaves predictably under both normal and adverse scenarios (refresh, storage-clear, private mode), so I can assess the app's handling of real-world edge cases as a quality signal.

**Current Alternatives:**
- Manually tests localStorage behavior via DevTools Application tab — no automated verification
- Infers persistence behavior from source code without live testing — misses runtime quirks
- Skips edge case testing for tools not intended for production use — misses quality signals

**Hiring Criteria:**
- Tasks persist correctly across a page reload — restored from localStorage on initialization
- Clearing localStorage and reloading shows an empty list (no stale data or errors)
- When localStorage is unavailable (private mode, quota exceeded), app degrades gracefully with a user-visible notice
- localStorage writes happen synchronously on each state change — no race conditions

**Success Measure:** Dev triggers three localStorage scenarios (normal reload, storage-cleared reload, simulated storage-unavailable) and each produces the expected behavior with no unhandled errors.

**Related Features:** F1, F2, F3, localStorage Persistence
**Priority:** P0

---

### JTBD-03.4: Keyboard Accessibility Audit

**Job Statement:**
When I evaluate the app's accessibility implementation during my review, I want to complete all four core actions using only the keyboard without touching a mouse, so I can assess whether the author has applied real usability standards rather than mouse-only shortcuts — a key signal of overall code quality.

**Current Alternatives:**
- Uses axe DevTools extension for automated accessibility checks — doesn't verify interactive keyboard flows
- Checks for ARIA attributes in source — doesn't confirm functional keyboard operability
- Skips keyboard testing for tools not explicitly targeting accessibility — misses quality signals

**Hiring Criteria:**
- Task can be added by pressing Enter after typing in the input field (no mouse click on submit button required)
- Completion toggle is reachable and operable via Tab + Space/Enter keyboard sequence
- Delete action is reachable via keyboard without a mouse
- Tab order is logical and follows visual reading order through the UI

**Success Measure:** Dev completes the full add→complete→delete sequence without touching the mouse — each action triggered solely via keyboard with correct visual feedback.

**Related Features:** F0, F2, F3, Keyboard Accessibility
**Priority:** P0

---

## Outcome-to-Feature Traceability

| JTBD-ID | Related Feature(s) | Expected Outcome |
|---|---|---|
| JTBD-01.1 | F0 | New task captured within 5 seconds of the thought surfacing; zero sign-up or navigation required |
| JTBD-01.2 | F1, F2 | All pending tasks visible in one view; completed tasks visually distinct in under 30 seconds |
| JTBD-01.3 | F2, F1 | Completion acknowledged visually within 100ms; state persists across reload |
| JTBD-01.4 | F3 | Task removed immediately and permanently; no reappearance after refresh |
| JTBD-02.1 | F0, F1, F2, F3, localStorage | Zero outbound network requests during any task operation; all data in localStorage |
| JTBD-02.2 | F0, F1, F2, F3 | Full app functionality confirmed with network disabled; no degraded states |
| JTBD-02.3 | F1, F2, F3, localStorage | 100% task and completion-state survival across browser close/reopen; graceful fallback on storage failure |
| JTBD-02.4 | F2 | Completed task toggled back to incomplete and state preserved after page reload |
| JTBD-03.1 | F0, F1, F2, F3, localStorage | No unnecessary dependencies detected; state management pattern is clear and consistent |
| JTBD-03.2 | F0, F1, F2, F3 | All four features pass correctness verification with zero broken states in one evaluation pass |
| JTBD-03.3 | F1, F2, F3, localStorage | Three localStorage scenarios (reload, clear, unavailable) all produce expected behavior |
| JTBD-03.4 | F0, F2, F3, Keyboard Accessibility | Full add→complete→delete sequence completable via keyboard alone |

---

## NaC Preview

| JTBD-ID | Outcome | Candidate Natural Acceptance Criteria |
|---|---|---|
| JTBD-01.1 | First task added within 10s with no instructions | Given the app is open, when a user types a task and presses Enter, then the task appears in the list within 100ms and the input field is cleared |
| JTBD-01.1 | Empty submissions are blocked | Given the input field is empty, when the user submits via button or Enter, then no task is added and no blank entry appears in the list |
| JTBD-01.2 | Pending tasks visible at a glance | Given tasks exist, when the page loads, then all tasks are displayed in a single scrollable list with completed tasks visually distinct from incomplete ones |
| JTBD-01.2 | Empty state shown when no tasks | Given the task list is empty, when the page loads, then a non-blank empty-state message is displayed |
| JTBD-01.3 | Completion acknowledged visually within 100ms | Given an incomplete task exists, when the user toggles completion, then a visual change (strikethrough/checkmark) appears within 100ms |
| JTBD-01.3 | Completion state persists across reload | Given a task has been marked complete, when the page is reloaded, then the task remains in completed state |
| JTBD-01.4 | Task permanently removed on delete | Given a task exists, when the user deletes it, then it is removed from the list immediately and does not reappear after a page reload |
| JTBD-02.1 | Zero outbound network requests | Given the app is running, when a task is added, completed, or deleted, then the browser Network tab shows zero requests to any external server |
| JTBD-02.2 | Full functionality with no network | Given the device is offline (network disabled), when the user opens the app and performs all four core actions, then all actions succeed with no network errors |
| JTBD-02.3 | 100% persistence across session close | Given 5 tasks are added and the browser tab is closed, when the tab is reopened, then all 5 tasks appear with their original completion states |
| JTBD-02.3 | Graceful localStorage fallback | Given localStorage is unavailable (simulated), when the app loads, then a user-visible notice is shown and the app remains operable in-memory |
| JTBD-02.4 | Toggle-back from complete to incomplete | Given a task is marked complete, when the user toggles it again, then the task returns to incomplete state; after a page reload the task remains incomplete |
| JTBD-03.1 | No unnecessary dependencies | Given the app source is inspected, when all script and style files are reviewed, then no frameworks or libraries beyond what F0–F3 require are present |
| JTBD-03.2 | Zero broken states in full evaluation pass | Given the evaluator tests F0→F1→F2→F3 in sequence including empty submission, then all features behave correctly with no stuck, duplicated, or unresponsive UI states |
| JTBD-03.3 | localStorage scenarios produce expected behavior | Given the evaluator tests normal reload, post-clear reload, and storage-unavailable scenarios, then each produces the expected result with no unhandled JavaScript errors |
| JTBD-03.4 | Full keyboard-only task lifecycle | Given a keyboard-only user, when they add a task (Enter), complete it (Tab + Space), and delete it (Tab + Enter/Space), then each action succeeds without mouse interaction |

---

*Document generated: 2026-05-07 | Project: TodoApp | JTBD Version: 1.0*
