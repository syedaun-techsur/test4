# STORY MAP: Basic To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | TodoApp |
| **Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related Personas** | PERSONAS-TodoApp.md v1.0 |
| **Related Journeys** | JOURNEYS-TodoApp.md v1.0 |
| **Related JTBD** | JTBD-TodoApp.md v1.0 |
| **Related User Stories** | UserStories-TodoApp.md v1.0 |
| **Related PRD** | PRD-TodoApp.md v1.0 |

---

## Overview

This Story Map organises the 20 user stories of TodoApp into a two-dimensional grid:

- **X-axis (columns):** Journey stages derived from JOURNEYS-TodoApp.md — representing the sequential moments in each persona's interaction with the product.
- **Y-axis (rows):** User stories (US-X.Y) grouped by Epic (F0–F3), placed at the stage where the story's capability is first exercised.
- **NaC column:** Natural Acceptance Criteria — testable statements derived from the intersection of a JTBD outcome, a journey stage, and the story itself. NaC are **not invented**; every NaC traces back to a specific JTBD-ID.
- **Release column:** Increment assignment. Because all 20 stories are P0 (MVP-critical), they form a single release. However, the map uses two increment bands — **R1a: Core Interaction Loop** and **R1b: Resilience & Accessibility** — to support sprint-level planning within the MVP.

### Story Map ID Convention

`SM-{Epic}.{NN}` — e.g., SM-0.1 maps to Epic 0 (F0), entry 1.

### NaC Derivation Formula

> **JTBD Outcome** × **Journey Stage Context** → **Testable Criterion**

Each NaC is written in the format: *"Given [context], when [action], then [observable result]."*

---

## Story Map Matrix

### Persona: PER-01 Maya Torres — Busy Professional / Personal Task Tracker

Journey flows: JRN-01.1 (Mid-Day Task Capture) → JRN-01.2 (Morning Triage)

| SM-ID | Journey Stage | Epic | Story | NaC (derived from JTBD) | Release |
|---|---|---|---|---|---|
| SM-0.1 | **Land** — App opens; input field appears | Epic 0: Add Task (F0) | US-0.1: Add a Task via Button Click | JTBD-01.1 → Given the app is open, when Maya types a task and clicks Add, then the task appears in the list within 100ms and the input clears | R1a |
| SM-0.2 | **Land** — Input is focused and ready | Epic 0: Add Task (F0) | US-0.2: Add a Task via Enter Key | JTBD-01.1 → Given the input has focus, when Maya presses Enter on a non-empty input, then the task is submitted identically to a button click with no mouse required | R1a |
| SM-0.3 | **Capture #1** — Submitting a task | Epic 0: Add Task (F0) | US-0.3: Prevent Empty Task Submission | JTBD-01.1 → Given the input is empty, when Maya submits via button or Enter, then no blank task is created and an inline error message appears | R1a |
| SM-0.4 | **Capture #1** — Validating input length | Epic 0: Add Task (F0) | US-0.4: Enforce Maximum Task Length | JTBD-03.2 → Given input exceeds 500 characters, when submitted, then no task is created and an inline error message is shown with zero console errors | R1a |
| SM-0.5 | **Capture #1** — Storage write on add | Epic 0: Add Task (F0) | US-0.5: Graceful Handling of Storage Write Failure on Add | JTBD-02.3 → Given localStorage.setItem fails, when a task is added, then the task appears in-session UI and a non-blocking amber warning is shown | R1b |
| SM-1.1 | **Open / Return** — Page load restores list | Epic 1: View Task List (F1) | US-1.1: View All Tasks on Page Load | JTBD-01.2 → Given the app is reopened, when the page loads, then all previously added tasks are rendered newest-first within 100ms with no re-entry | R1a |
| SM-1.2 | **Scan** — Distinguishing pending from done | Epic 1: View Task List (F1) | US-1.2: Distinguish Completed Tasks Visually | JTBD-01.2 → Given tasks with mixed completion states exist, when Maya scans the list, then completed tasks show strikethrough+muted styling and incomplete tasks show normal styling | R1a |
| SM-1.3 | **Decide** — Empty list after clean-up | Epic 1: View Task List (F1) | US-1.3: See an Empty State When No Tasks Exist | JTBD-01.2 → Given the task list is empty (first load or post-delete), when the page renders, then a non-blank empty-state message is shown instead of a blank screen | R1a |
| SM-1.4 | **Open** — Corrupted storage data | Epic 1: View Task List (F1) | US-1.4: Recover Gracefully from Corrupted Storage Data | JTBD-03.3 → Given localStorage contains invalid JSON, when the app loads, then it initialises with an empty list and shows a dismissible notice with zero uncaught errors | R1b |
| SM-1.5 | **Open** — Storage unavailable | Epic 1: View Task List (F1) | US-1.5: Use the App When localStorage Is Unavailable | JTBD-02.3 → Given localStorage is unavailable (private mode), when the app loads, then all four core actions work in-memory and a persistent session notice is displayed | R1b |
| SM-2.1 | **Complete** — Marking a task done | Epic 2: Mark Task Complete (F2) | US-2.1: Mark an Incomplete Task as Complete | JTBD-01.3 → Given an incomplete task exists, when Maya clicks the completion toggle, then strikethrough+checkmark appears within 100ms and the state is written to localStorage | R1a |
| SM-2.2 | **Undo Completion** — Reversing a toggle | Epic 2: Mark Task Complete (F2) | US-2.2: Toggle a Completed Task Back to Incomplete | JTBD-01.3 / JTBD-02.4 → Given a completed task exists, when the toggle is clicked again, then the task reverts to incomplete styling within 100ms and the state persists on reload | R1a |
| SM-2.3 | **Complete** — Keyboard toggle | Epic 2: Mark Task Complete (F2) | US-2.3: Toggle Tasks Using the Keyboard | JTBD-03.4 → Given a task toggle has keyboard focus, when Space or Enter is pressed, then the toggle activates with identical visual/persistence result as a mouse click | R1b |
| SM-2.4 | **Return Next Day** — Cross-session state | Epic 2: Mark Task Complete (F2) | US-2.4: Persist Completion State Across Page Refreshes | JTBD-02.3 → Given tasks have been marked complete/incomplete, when the page is reloaded, then all completion states are exactly as left with 100% fidelity | R1a |
| SM-2.5 | **Privacy Check** — Storage write failure on toggle | Epic 2: Mark Task Complete (F2) | US-2.5: Graceful Handling of Storage Write Failure on Toggle | JTBD-03.3 → Given localStorage.setItem fails during a toggle, when the toggle is activated, then the UI updates correctly in-session and a non-blocking notice is shown | R1b |
| SM-3.1 | **Delete Stale** — Removing a task | Epic 3: Delete Task (F3) | US-3.1: Delete a Task from the List | JTBD-01.4 → Given a task exists, when Maya clicks the delete control, then the task is removed from the UI within 100ms and deleted from localStorage with no confirmation dialog | R1a |
| SM-3.2 | **Delete Stale** — Any completion state | Epic 3: Delete Task (F3) | US-3.2: Delete Both Complete and Incomplete Tasks | JTBD-01.4 → Given tasks in both complete and incomplete states exist, when the delete control is used on either, then deletion behaviour is identical regardless of completion state | R1a |
| SM-3.3 | **Decide** — Empty state after last delete | Epic 3: Delete Task (F3) | US-3.3: See Empty State After Deleting the Last Task | JTBD-01.2 → Given one task remains, when it is deleted, then the empty-state message appears, localStorage is updated to [], and a new task can be added immediately | R1a |
| SM-3.4 | **Privacy Check / Keyboard Audit** — Keyboard delete | Epic 3: Delete Task (F3) | US-3.4: Delete Tasks Using the Keyboard | JTBD-03.4 → Given the delete button has keyboard focus, when Enter or Space is pressed, then the task is removed and focus moves to a logical next element | R1b |
| SM-3.5 | **Return Next Day** — Persistence of deletions | Epic 3: Delete Task (F3) | US-3.5: Confirm Deleted Tasks Do Not Reappear After Refresh | JTBD-02.3 / JTBD-01.4 → Given tasks have been deleted, when the page is reloaded, then no deleted tasks reappear and localStorage does not contain their data | R1a |

---

## Journey Stage → Story Coverage Map

This table shows which stories activate at each journey stage across all four journey scenarios.

| Journey Stage | JRN Reference | Stories Active |
|---|---|---|
| **Trigger / Land** | JRN-01.1 Land | US-0.1, US-0.2 |
| **Capture (Add & Validate)** | JRN-01.1 Capture #1, #2 | US-0.3, US-0.4, US-0.5 |
| **Open / Page Load** | JRN-01.2 Open, JRN-02.1 Open Offline, JRN-03.1 Initial Load | US-1.1, US-1.4, US-1.5 |
| **Scan (Visual Distinction)** | JRN-01.2 Scan, JRN-02.1 Toggle | US-1.2 |
| **Empty State** | JRN-01.2 Decide, JRN-03.1 localStorage Resilience | US-1.3, US-3.3 |
| **Complete / Undo Completion** | JRN-01.2 Complete, JRN-01.2 Undo, JRN-02.1 Toggle | US-2.1, US-2.2, US-2.3 |
| **Delete Stale** | JRN-01.2 Delete Stale | US-3.1, US-3.2 |
| **Privacy Check / Keyboard Audit** | JRN-02.1 Privacy Check, JRN-03.1 Keyboard Audit | US-2.3, US-2.5, US-3.4, US-0.5 |
| **End Session / Return Next Day** | JRN-02.1 End Session, JRN-02.1 Return, JRN-01.2 Open | US-2.4, US-3.5 |
| **localStorage Resilience** | JRN-03.1 localStorage Resilience | US-1.4, US-1.5, US-2.5 |
| **Architecture Review / Feature Sequence Test** | JRN-03.1 Feature Sequence, JRN-03.1 Architecture Review | US-0.3, US-0.4, US-1.1, US-2.1, US-3.1 |

---

## NaC Derivation Table

Full traceability chain: **JTBD-ID → Journey Stage → NaC → Story**

| JTBD-ID | JTBD Outcome | Journey Stage | Natural Acceptance Criteria (NaC) | Story |
|---|---|---|---|---|
| JTBD-01.1 | Capture a task instantly before the thought is lost | JRN-01.1: Land | Given the app is open, when the user types a task and presses Enter, then the task appears in the list within 100ms and the input field clears | US-0.1, US-0.2 |
| JTBD-01.1 | Empty submissions must be blocked | JRN-01.1: Capture #1 | Given the input is empty or whitespace-only, when the user submits via button or Enter, then no task is created and an inline error message appears with no alert() | US-0.3 |
| JTBD-01.1 | Input validation is production-quality | JRN-01.1: Capture #1 | Given input exceeds 500 characters, when submitted, then no task is created and the error "Task description must be 500 characters or fewer." is shown | US-0.4 |
| JTBD-01.2 | Pending tasks visible at a glance after restore | JRN-01.2: Open | Given the app is reopened, when the page loads, then all tasks are rendered newest-first within 100ms with no re-entry required | US-1.1 |
| JTBD-01.2 | Completed and incomplete tasks visually distinct | JRN-01.2: Scan | Given tasks with mixed states exist, when the list is displayed, then completed tasks show strikethrough+muted styling and incomplete tasks show normal styling | US-1.2 |
| JTBD-01.2 | Empty state prevents blank-screen confusion | JRN-01.2: Decide / JRN-01.1: Land (first use) | Given the task list is empty, when the page loads or the last task is deleted, then a helpful non-blank message is displayed in the list area | US-1.3, US-3.3 |
| JTBD-01.3 | Completion acknowledged with immediate visual change | JRN-01.2: Complete | Given an incomplete task exists, when the completion toggle is activated, then strikethrough+checkmark appears within 100ms | US-2.1 |
| JTBD-01.3 | Completed state persists across reload | JRN-01.2: Complete | Given a task has been marked complete, when the page is reloaded, then the task remains in completed state | US-2.4 |
| JTBD-01.3 | Toggle-back is immediate and reversible | JRN-01.2: Undo Completion | Given a completed task exists, when the toggle is clicked again, then the task reverts to incomplete styling within 100ms with no confirmation dialog | US-2.2 |
| JTBD-01.4 | Task permanently removed without confirmation | JRN-01.2: Delete Stale | Given a task exists, when the delete control is activated, then the task is removed from UI within 100ms and does not reappear after a page reload | US-3.1, US-3.5 |
| JTBD-01.4 | Delete works regardless of completion state | JRN-01.2: Delete Stale | Given tasks in both complete and incomplete states exist, when either is deleted, then deletion is immediate and identical for both states | US-3.2 |
| JTBD-02.1 | Zero outbound network requests during task operations | JRN-02.1: Privacy Check | Given the app is running, when any task action (add, complete, delete) is performed, then the browser Network tab shows zero requests to any external server | US-0.1, US-2.1, US-3.1 |
| JTBD-02.2 | Full functionality with network disabled | JRN-02.1: Open Offline | Given the device is offline (network disabled), when the user opens the app and performs all four core actions, then all succeed with no network errors | US-1.1, US-0.1, US-2.1, US-3.1 |
| JTBD-02.3 | 100% persistence across session close and reopen | JRN-02.1: Return Next Day | Given tasks are added and the browser tab is closed, when the tab is reopened, then all tasks appear with their original completion states intact | US-1.1, US-2.4, US-3.5 |
| JTBD-02.3 | Graceful localStorage fallback with user-visible notice | JRN-02.1: Open Offline (storage unavailable) | Given localStorage is unavailable, when the app loads, then a persistent session notice is shown and all four actions remain functional in-memory | US-1.5 |
| JTBD-02.3 | Storage write failures notify without breaking the app | JRN-02.1: Add Tasks / Privacy Check | Given localStorage.setItem fails, when a task is added or toggled, then the UI updates in-session and a non-blocking amber notice is shown | US-0.5, US-2.5 |
| JTBD-02.4 | Toggle-back preserves original task text and persists | JRN-02.1: Toggle Completion | Given a task is marked complete, when the user toggles it back to incomplete, then the original text is preserved and the incomplete state survives a page reload | US-2.2 |
| JTBD-03.1 | No unnecessary dependencies in source | JRN-03.1: Initial Load & Source Scan | Given the app source is inspected, when all script and style files are reviewed, then no frameworks or libraries beyond what F0–F3 require are present | US-1.1 (arch signal) |
| JTBD-03.2 | Zero broken states in full evaluation pass | JRN-03.1: Feature Sequence Test | Given the evaluator tests F0→F1→F2→F3 in sequence including empty submission, then all features behave correctly with no stuck, duplicated, or unresponsive states | US-0.3, US-1.2, US-2.1, US-3.1 |
| JTBD-03.3 | localStorage scenarios produce expected behaviour | JRN-03.1: localStorage Resilience | Given normal reload, post-clear reload, and storage-unavailable scenarios are tested, then each produces the expected result with no unhandled JavaScript errors | US-1.4, US-1.5, US-2.5 |
| JTBD-03.4 | Full keyboard-only task lifecycle | JRN-03.1: Keyboard Accessibility Audit | Given a keyboard-only user, when they add (Enter), complete (Tab+Space), and delete (Tab+Enter/Space) a task, then each action succeeds without mouse interaction | US-0.2, US-2.3, US-3.4 |

---

## Release Planning

### Release Strategy

All 20 stories are **P0 (MVP-Critical)**. The release is a single MVP delivery, but stories are divided into two **sprint bands** to ensure the core interaction loop ships as a coherent, demonstrable increment before resilience/accessibility polish is added.

| Band | Theme | Stories | Rationale |
|---|---|---|---|
| **R1a** | Core Interaction Loop | US-0.1, US-0.2, US-0.3, US-0.4, US-1.1, US-1.2, US-1.3, US-2.1, US-2.2, US-2.4, US-3.1, US-3.2, US-3.3, US-3.5 | Delivers the complete capture → view → complete → delete loop for all three personas; app is usable end-to-end after this band |
| **R1b** | Resilience & Accessibility | US-0.5, US-1.4, US-1.5, US-2.3, US-2.5, US-3.4 | Adds storage failure handling, corrupted-data recovery, unavailable-storage fallback, and keyboard accessibility; completes the quality bar for Dev Sharma's evaluation criteria |

---

### R1a: Core Interaction Loop

**Theme:** Deliver the full add → view → complete → delete workflow with immediate visual feedback, localStorage persistence, and input validation. Every persona can complete their primary journey after R1a.

**Stories:**

| Story | Title | Personas Served | JTBD Addressed |
|---|---|---|---|
| US-0.1 | Add a Task via Button Click | PER-01 Maya, PER-03 Dev | JTBD-01.1, JTBD-03.2 |
| US-0.2 | Add a Task via Enter Key | PER-02 Liam, PER-03 Dev | JTBD-01.1, JTBD-03.4 |
| US-0.3 | Prevent Empty Task Submission | PER-01 Maya, PER-03 Dev | JTBD-01.1, JTBD-03.2 |
| US-0.4 | Enforce Maximum Task Length | PER-03 Dev | JTBD-03.2 |
| US-1.1 | View All Tasks on Page Load | PER-02 Liam, PER-03 Dev | JTBD-01.2, JTBD-02.2, JTBD-02.3 |
| US-1.2 | Distinguish Completed Tasks Visually | PER-01 Maya, PER-03 Dev | JTBD-01.2, JTBD-03.2 |
| US-1.3 | See an Empty State When No Tasks Exist | All personas | JTBD-01.2 |
| US-2.1 | Mark an Incomplete Task as Complete | PER-01 Maya, PER-03 Dev | JTBD-01.3, JTBD-03.2 |
| US-2.2 | Toggle a Completed Task Back to Incomplete | PER-02 Liam, PER-01 Maya | JTBD-01.3, JTBD-02.4 |
| US-2.4 | Persist Completion State Across Page Refreshes | PER-02 Liam | JTBD-02.3 |
| US-3.1 | Delete a Task from the List | PER-01 Maya, PER-03 Dev | JTBD-01.4, JTBD-03.2 |
| US-3.2 | Delete Both Complete and Incomplete Tasks | PER-01 Maya | JTBD-01.4 |
| US-3.3 | See Empty State After Deleting the Last Task | All personas | JTBD-01.2 |
| US-3.5 | Confirm Deleted Tasks Do Not Reappear After Refresh | PER-02 Liam | JTBD-02.3, JTBD-01.4 |

**R1a Success Gate:** A new user (Maya) can open the app, add tasks, mark them complete, undo a completion, delete stale items, and return next day to find the list intact — all without any instructions, account, or network connection.

---

### R1b: Resilience & Accessibility

**Theme:** Add failure-mode handling and keyboard accessibility to pass Dev Sharma's evaluation criteria and Liam's privacy/reliability requirements in adverse conditions.

**Stories:**

| Story | Title | Personas Served | JTBD Addressed |
|---|---|---|---|
| US-0.5 | Graceful Handling of Storage Write Failure on Add | PER-02 Liam, PER-03 Dev | JTBD-02.3, JTBD-03.3 |
| US-1.4 | Recover Gracefully from Corrupted Storage Data | PER-03 Dev | JTBD-03.3 |
| US-1.5 | Use the App When localStorage Is Unavailable | PER-02 Liam, PER-03 Dev | JTBD-02.3, JTBD-03.3 |
| US-2.3 | Toggle Tasks Using the Keyboard | PER-02 Liam, PER-03 Dev | JTBD-03.4 |
| US-2.5 | Graceful Handling of Storage Write Failure on Toggle | PER-03 Dev | JTBD-02.3, JTBD-03.3 |
| US-3.4 | Delete Tasks Using the Keyboard | PER-03 Dev | JTBD-03.4 |

**R1b Success Gate:** Dev Sharma can complete his 15-minute evaluation — localStorage resilience scenarios (normal reload, post-clear, unavailable) all produce expected results, and the full add→complete→delete sequence is completable via keyboard alone with no mouse.

---

## Coverage Analysis

### Persona Coverage by Release Band

| Persona | R1a | R1b | Full MVP |
|---|---|---|---|
| PER-01 Maya Torres | ✅ Primary journey complete (capture, scan, complete, undo, delete) | — (secondary benefit from resilience stories) | ✅ |
| PER-02 Liam Okafor | ✅ Core offline loop + persistence (US-1.1, US-2.2, US-2.4, US-3.5) | ✅ Storage fallback + keyboard (US-0.5, US-1.5, US-2.3) | ✅ |
| PER-03 Dev Sharma | ✅ Feature sequence test passes (US-0.3, US-0.4, US-1.2, US-2.1, US-3.1) | ✅ Resilience + accessibility audit passes (US-1.4, US-1.5, US-2.3, US-2.5, US-3.4) | ✅ |

### JTBD Coverage by Release Band

| JTBD-ID | Job Summary | R1a | R1b |
|---|---|---|---|
| JTBD-01.1 | Zero-friction task capture | ✅ US-0.1, US-0.2, US-0.3, US-0.4 | — |
| JTBD-01.2 | At-a-glance priority scan | ✅ US-1.1, US-1.2, US-1.3, US-3.3 | — |
| JTBD-01.3 | Progress acknowledgment on completion | ✅ US-2.1, US-2.2, US-2.4 | — |
| JTBD-01.4 | List hygiene via task deletion | ✅ US-3.1, US-3.2, US-3.5 | — |
| JTBD-02.1 | Local-only data ownership | ✅ (no-network architecture via US-1.1, US-0.1) | ✅ US-0.5 (storage write notice) |
| JTBD-02.2 | Fully offline task management | ✅ US-1.1 (localStorage restore), all F0–F3 | — |
| JTBD-02.3 | Cross-session task persistence | ✅ US-1.1, US-2.4, US-3.5 | ✅ US-0.5, US-1.5, US-2.5 |
| JTBD-02.4 | Completion undo without re-entry | ✅ US-2.2 | — |
| JTBD-03.1 | Clean architecture assessment | ✅ (inherent in minimal implementation across F0–F3) | — |
| JTBD-03.2 | Full feature correctness verification | ✅ US-0.3, US-1.2, US-2.1, US-3.1 | — |
| JTBD-03.3 | localStorage resilience verification | — | ✅ US-1.4, US-1.5, US-2.5 |
| JTBD-03.4 | Keyboard accessibility audit | ✅ US-0.2 (Enter submit) | ✅ US-2.3, US-3.4 |

### Gap Analysis

**Journey Stages with No Story Coverage:**

- `JRN-01.1: Return` (user closes tab and returns to primary work) — No story required; this is a browser-level action, not a product capability. No gap.
- `JRN-02.1: End Session` (closing the browser) — Covered by the auto-save behaviour implemented via US-2.4 and US-3.5 (synchronous localStorage writes on every state change). No dedicated story needed.
- `JRN-03.1: Judgment & Share` (Dev forms recommendation) — Post-evaluation outcome, not a product capability. No gap.

**JTBD Outcomes with No Dedicated Story:**

- `JTBD-03.1: No unnecessary dependencies` — This outcome is an architectural constraint (no frameworks, plain HTML/CSS/JS) enforced at implementation time, not a user story. It manifests as an observable quality of all F0–F3 stories collectively. ⚠️ *Consider adding an architecture decision record (ADR) if traceability is required for audit purposes.*

**Orphan Stories (Not Mapped to Any Journey Stage):**

- None. All 20 stories (US-0.1–US-3.5) are mapped to at least one journey stage in the Story Map Matrix above.

**Cross-Persona Coverage Note:**

- US-1.3 and US-3.3 are listed as "All personas" in the UserStories doc. Both are mapped to the `Decide/Empty State` journey stage which appears in JRN-01.2 (post-delete), JRN-02.1 (first open with no tasks), and JRN-03.1 (post-storage-clear). Full coverage confirmed.

---

## NaC-to-Acceptance Criteria Alignment

This table verifies that each NaC aligns with (and is testable by) the acceptance criteria already defined in UserStories-TodoApp.md.

| SM-ID | Story | NaC Summary | Aligned UserStory AC | Alignment |
|---|---|---|---|---|
| SM-0.1 | US-0.1 | Task appears in list within 100ms of button click; input clears | "New task appears at top of list immediately (< 100ms)" / "Input field is cleared after submission" | ✅ Direct |
| SM-0.2 | US-0.2 | Enter key submits identically to button; no mouse required | "Pressing Enter while input has focus submits the task" / "Behavior is identical to button-click submission" | ✅ Direct |
| SM-0.3 | US-0.3 | No blank task created on empty submit; inline error shown | "Submitting empty/whitespace-only input does not create a task" / "Inline error message appears below input" | ✅ Direct |
| SM-0.4 | US-0.4 | >500 char input blocked; inline error shown; no console errors | "Submitting text longer than 500 characters shows inline error" / "No task is created when text exceeds limit" | ✅ Direct |
| SM-0.5 | US-0.5 | Task shown in session UI; non-blocking amber warning if write fails | "Task still shown in UI for current session" / "Non-blocking notice displayed (amber/yellow warning)" | ✅ Direct |
| SM-1.1 | US-1.1 | All tasks rendered newest-first within 100ms on load | "App reads localStorage and renders all stored tasks" / "Task list renders within 100ms of page load" | ✅ Direct |
| SM-1.2 | US-1.2 | Completed: strikethrough+muted; incomplete: normal styling | "Completed tasks display with strikethrough and muted color" / "Incomplete tasks display with normal styling" | ✅ Direct |
| SM-1.3 | US-1.3 | Non-blank empty-state message shown; not shown when tasks exist | "Message displayed in task list area when empty" / "Empty state message is not shown when tasks exist" | ✅ Direct |
| SM-1.4 | US-1.4 | Invalid JSON → empty list + dismissible notice; zero uncaught errors | "App initialises with empty task list if localStorage has invalid JSON" / "Non-blocking notice shown" / "No uncaught error or broken UI" | ✅ Direct |
| SM-1.5 | US-1.5 | In-memory fallback; persistent notice; all four actions work | "App initialises with in-memory list if localStorage unavailable" / "All four core actions remain functional" | ✅ Direct |
| SM-2.1 | US-2.1 | Strikethrough+checkmark within 100ms; completed: true in localStorage | "Task immediately shows strikethrough, muted color, checked checkbox (< 100ms)" / "updated completed: true state written to localStorage" | ✅ Direct |
| SM-2.2 | US-2.2 | Reverts to incomplete within 100ms; persists on reload; original text preserved | "Task immediately reverts to normal styling and unchecked checkbox" / "Toggle is bidirectional: every click flips state once" | ✅ Direct |
| SM-2.3 | US-2.3 | Tab focuses toggle; Space/Enter activates it; identical to click | "Completion toggle is focusable via Tab" / "Pressing Space or Enter activates it" / "Identical visual and persistence result as a click" | ✅ Direct |
| SM-2.4 | US-2.4 | All completion states survive reload; 100% fidelity | "Refreshing page shows the same states" / "localStorage updated synchronously after every toggle" | ✅ Direct |
| SM-2.5 | US-2.5 | In-session UI correct; non-blocking notice; no uncaught errors | "In-memory state and UI still update correctly" / "Non-blocking notice shown" / "No uncaught errors thrown" | ✅ Direct |
| SM-3.1 | US-3.1 | Task removed within 100ms; deleted from localStorage; no confirmation | "Clicking delete removes task from UI immediately (< 100ms)" / "Task also removed from localStorage" / "No confirmation dialog" | ✅ Direct |
| SM-3.2 | US-3.2 | Delete works on both complete and incomplete tasks; always visible | "Completed tasks can be deleted" / "Incomplete tasks can be deleted" / "Delete control always visible on every task item" | ✅ Direct |
| SM-3.3 | US-3.3 | Empty-state shown after last delete; localStorage = []; new task addable | "Deleting last task triggers empty state message" / "localStorage updated to empty array" / "New task can be added from empty state" | ✅ Direct |
| SM-3.4 | US-3.4 | Delete button Tab-focusable; Enter/Space activates; focus moves logically | "Delete button is focusable via Tab" / "Enter or Space activates deletion" / "Focus moves to logical next element after deletion" | ✅ Direct |
| SM-3.5 | US-3.5 | Deleted tasks absent after reload; localStorage clean; write failure noticed | "After deleting and refreshing, deleted task does not reappear" / "localStorage does not contain deleted task's data" / "Storage write failure triggers non-blocking notice" | ✅ Direct |

**Alignment Summary:** All 20 NaC statements align directly (✅) with at least one explicit acceptance criterion in the corresponding UserStory. No NaC required revision. No AC is left un-covered by a NaC.

---

*Document generated: 2026-05-07 | Project: TodoApp | Story Map Version: 1.0*
*All 20 user stories mapped. Zero orphans. Zero uncovered JTBD outcomes (JTBD-03.1 noted as architectural constraint, not a story). 100% NaC-to-AC alignment confirmed.*
