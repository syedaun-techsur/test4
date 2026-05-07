# JOURNEYS: Basic To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | TodoApp |
| **Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related Personas** | PERSONAS-TodoApp.md v1.0 (PER-01, PER-02, PER-03) |
| **Related JTBD** | JTBD-TodoApp.md v1.0 |
| **Related PRD** | PRD-TodoApp.md v1.0 |
| **Derived From** | Personas Goals/Top Tasks, JTBD Hiring Criteria & Success Measures, PRD §5 Features |

---

## Journey Index

| JRN-ID | Persona | Scenario | Key JTBD | Stages |
|---|---|---|---|---|
| JRN-01.1 | PER-01 Maya Torres | Mid-day task capture during a busy workday | JTBD-01.1 | 5 |
| JRN-01.2 | PER-01 Maya Torres | Morning triage — scanning the list and closing out completed tasks | JTBD-01.2, JTBD-01.3, JTBD-01.4 | 6 |
| JRN-02.1 | PER-02 Liam Okafor | Offline work session at a café — full task lifecycle with persistence check | JTBD-02.1, JTBD-02.2, JTBD-02.3, JTBD-02.4 | 6 |
| JRN-03.1 | PER-03 Dev Sharma | 15-minute technical evaluation — feature correctness, localStorage, and keyboard accessibility | JTBD-03.1, JTBD-03.2, JTBD-03.3, JTBD-03.4 | 6 |

---

## PER-01: Maya Torres — Busy Professional / Personal Task Tracker

---

### JRN-01.1: Mid-Day Task Capture

**Persona:** PER-01 (Maya Torres)

**Scenario:** It's 2:30 PM on a Tuesday. Maya is deep in a work project when a thought surfaces: she needs to pick up a prescription and call her landlord before the weekend. She has about 5 seconds before her attention snaps back to her primary task. She opens a new browser tab, navigates to TodoApp, and needs to capture both items before the thought is gone — with zero friction standing between the impulse and the record.

**Related Jobs:** JTBD-01.1 (Zero-Friction Task Capture)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Trigger** | Interrupting thought surfaces mid-task; opens new browser tab and types the app URL | Browser new tab | "I need to remember this before I forget — let me get it down fast" | Mildly anxious, rushed | Context-switching from primary work increases risk of losing the thought | Browser bookmark or pinned tab reduces navigation steps to near-zero |
| **Land** | App loads; input field appears at top of page | App home / F0 Input | "Is the cursor already in the field? Good, just start typing" | Focused, slightly relieved | If input is not auto-focused, she wastes a click and may lose train of thought | Auto-focus the input field on page load — no click required before typing |
| **Capture #1** | Types "Pick up prescription" and presses Enter | F0 Input, F1 Task List | "There it is — now the second one" | Briefly satisfied | If Enter doesn't submit, she has to find the button and clicks interrupt her rhythm | Enter key submits task and clears input instantly; task appears in list within 100ms |
| **Capture #2** | Types "Call landlord about weekend" and presses Enter | F0 Input, F1 Task List | "Done. Two tasks saved. Back to work." | Relieved, closed | Multi-step capture (click Save, navigate to confirm) would have caused her to abandon the second task | Input clears immediately after submit; cursor stays in field ready for the next entry |
| **Return** | Closes the tab and returns to primary work | Browser | "My list is safe. I'll deal with those later." | Calm, uninterrupted | No confirmation screen or redirect means a clean exit | No forced navigation after submit — she stays in control of where she goes next |

### Key Moments
- **Decision Point:** Land stage — if the input is not focused and ready, Maya may switch to a notes app instead; **first-impression auto-focus is the make-or-break moment**
- **Risk of Abandonment:** Trigger stage — any extra step between opening the app and typing (account screen, onboarding modal, unfocused input) causes task loss and app abandonment
- **Delight Opportunity:** Capture #1/2 stages — Enter key submitting instantly, input clearing, and task appearing immediately creates a "it just works" satisfaction that builds habit

### Success Outcome
Maya captures both tasks within 10 seconds of opening the app with zero instructions — meeting JTBD-01.1 success measure. No account, no setup, no clicks beyond typing.

### Feature Touchpoints

| Stage | Features |
|---|---|
| Trigger | — (browser navigation) |
| Land | F0 (Add Task — input auto-focus) |
| Capture #1 | F0 (Add Task — Enter submit, input clear), F1 (View Task List — immediate render) |
| Capture #2 | F0 (Add Task — repeat capture), F1 (View Task List — updated list) |
| Return | — (browser tab) |

---

### JRN-01.2: Morning Triage — Scan, Complete, and Clean Up

**Persona:** PER-01 (Maya Torres)

**Scenario:** It's Monday morning. Maya opens TodoApp to get oriented for the week. She has 9 tasks from last week — some are done, some are still live, and two are stale because circumstances changed. She needs to: quickly read through the list to plan her morning, mark what she finished over the weekend, and delete the tasks that are no longer relevant. This is a routine 2–3 minute interaction that should feel like checking off a physical to-do list, not managing a productivity system.

**Related Jobs:** JTBD-01.2 (At-a-Glance Priority Scan), JTBD-01.3 (Progress Acknowledgment), JTBD-01.4 (List Hygiene via Task Deletion)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Open** | Navigates to app; page loads with full task list intact from last session | App home / F1 Task List | "Let me see where I left off" | Neutral, expectant | If the list doesn't load or is missing tasks, trust collapses immediately | localStorage restores list before first paint — zero re-entry of existing tasks |
| **Scan** | Reads through the task list top to bottom in one scroll | F1 Task List | "What's still pending? What's already done? What can I ignore?" | Focused | If completed and pending tasks look identical, she can't quickly triage | Visual distinction (strikethrough + muted color) makes completed vs. pending immediately obvious |
| **Complete** | Clicks the checkbox/toggle on two tasks she finished over the weekend | F2 Mark Task Complete | "Check. And check. Those are off my plate." | Satisfied, accomplished | If the toggle requires precision clicking on a small target, she misses and gets frustrated | Generous click/tap target on the completion toggle; immediate visual response within 100ms |
| **Undo Completion** | Accidentally marks a task complete that isn't done yet; clicks toggle again to undo | F2 Mark Task Complete (toggle-back) | "Wait, that one isn't done — let me un-check it" | Momentarily anxious, then relieved | If there's no undo toggle, she must delete and re-type the task, which is a trust-breaking experience | Toggle is reversible in a single click — no confirmation dialog, no re-entry required |
| **Delete Stale** | Clicks the delete button on two tasks that are no longer relevant | F3 Delete Task | "These aren't happening anymore — gone" | Cleansed, lighter | If a confirmation dialog interrupts deletion, the rhythm breaks and the list feels heavy to manage | Instant deletion with no confirmation — the list updates immediately and feels responsive |
| **Decide** | Scans the remaining clean list; picks the first task to work on | F1 Task List | "OK — three live tasks. Start with the top one." | Clear, ready | If the list still shows visual clutter (phantom items, slow re-render), it creates decision hesitation | Immediate re-render after delete and complete gives a clean, current list on every review |

### Key Moments
- **Decision Point:** Scan stage — Maya's ability to quickly separate done from pending determines whether she trusts the list as her source of truth or falls back to paper/email
- **Risk of Abandonment:** Complete stage — a non-reversible completion toggle or a broken state after toggling would undermine confidence; she'd stop using the app
- **Delight Opportunity:** Delete stage — the list visibly shrinking with each deletion creates a satisfying "clearing" feeling that reinforces the morning ritual

### Success Outcome
Maya scans her list, marks 2 tasks complete, undoes 1 accidental completion, and deletes 2 stale tasks in under 3 minutes — addressing JTBD-01.2, JTBD-01.3, and JTBD-01.4 in a single natural interaction.

### Feature Touchpoints

| Stage | Features |
|---|---|
| Open | F1 (View Task List — localStorage restore) |
| Scan | F1 (View Task List — visual completion state) |
| Complete | F2 (Mark Task Complete — toggle + visual feedback) |
| Undo Completion | F2 (Mark Task Complete — toggle-back) |
| Delete Stale | F3 (Delete Task — instant removal) |
| Decide | F1 (View Task List — clean re-render) |

---

## PER-02: Liam Okafor — Privacy-Conscious Offline User

---

### JRN-02.1: Offline Work Session at a Café

**Persona:** PER-02 (Liam Okafor)

**Scenario:** Liam is at his neighbourhood café for a 3-hour deep-work session on a freelance research article. He intentionally disables Wi-Fi to minimize distractions. He already has TodoApp open from his last session (or opens it as a local cached file). He needs to trust that: (a) his existing task list is right there, (b) he can add new tasks during the session, (c) he can toggle tasks as plans shift, and (d) everything will still be intact when he reopens the browser tomorrow. This journey also includes his periodic habit of verifying that no data is leaving his browser.

**Related Jobs:** JTBD-02.1 (Local-Only Data Ownership), JTBD-02.2 (Fully Offline Task Management), JTBD-02.3 (Cross-Session Persistence), JTBD-02.4 (Completion Undo Without Re-entry)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Open Offline** | Navigates to app (or switches to pinned tab) with network disabled; checks that the list loads | App home / F1 Task List | "Please be there. I don't have a connection right now." | Slightly tense, watchful | A cloud-dependent tool shows a network error here — Liam immediately closes it and reverts to paper | App loads and renders full task list from localStorage with zero network — offline operation is the baseline, not a special mode |
| **Add Tasks** | Adds 3 new tasks during the session: research subtopics surfacing as he works | F0 Add Task | "This is working exactly as it should — no account, no spinner, just a list." | Calm, confident | Any network spinner or "syncing…" indicator would signal that his data is being sent somewhere | All state changes are local-only; no loading indicators for sync operations — the add is instantaneous |
| **Toggle Completion** | Marks a research sub-task complete mid-session; later, as the scope changes, toggles it back to incomplete | F2 Mark Task Complete (toggle + toggle-back) | "Done… actually, wait. This is back in scope. Un-check." | Focused, slightly frustrated by scope change (not the app) | If toggling back creates a new entry or loses the original text, that is a trust violation | Toggle is a true bi-directional state switch — the task text is preserved on both transitions |
| **Privacy Check** | Opens DevTools → Network tab; performs an add, complete, and delete; confirms zero outbound requests | Browser DevTools + F0, F2, F3 | "Let me just verify — no external requests. Good." | Analytical, reassured | Any network request to an analytics endpoint or CDN-loaded asset would fail his trust threshold | App is entirely self-contained — no external scripts, no telemetry, no CDN dependencies; Network tab stays empty |
| **End Session** | Closes the browser tab (or the whole browser) and packs up | Browser | "Everything's saved. I'll pick this up tomorrow." | Relaxed, trusting | Cloud tools have betrayed him here before — data was "lost" or tied to an expired session | No save button required — every state change writes to localStorage immediately; close is always safe |
| **Return Next Day** | Opens a new browser session; navigates to app; verifies all 8 tasks are intact with correct completion states | App home / F1 Task List | "All there — exactly as I left them. Perfect." | Relieved, validated | If even one task is missing or the completion states are wrong, he loses confidence and adds a paper backup | localStorage restores full task list including completion states before any user interaction |

### Key Moments
- **Decision Point:** Open Offline stage — the first paint is the trust gate; if the app fails to load or shows a network error, Liam abandons it permanently and never returns
- **Risk of Abandonment:** Privacy Check stage — a single outbound request in the Network tab (even a favicon or font fetch) raises a red flag and causes Liam to distrust the entire app
- **Delight Opportunity:** Return Next Day stage — seeing all tasks restored exactly as left creates genuine "it just works" satisfaction, fulfilling Liam's requirement for a reliable local source of truth

### Success Outcome
Liam completes a full 3-hour offline work session with add, view, complete, toggle-back, and delete operations — all with zero network requests — and returns the next day to find his full task list intact. JTBD-02.1 through JTBD-02.4 are all satisfied in a single continuous scenario.

### Feature Touchpoints

| Stage | Features |
|---|---|
| Open Offline | F1 (View Task List — offline localStorage restore) |
| Add Tasks | F0 (Add Task — local-only write) |
| Toggle Completion | F2 (Mark Task Complete — toggle + toggle-back + persistence) |
| Privacy Check | F0, F2, F3 (all client-side — no network activity) |
| End Session | localStorage Persistence (auto-save on every state change) |
| Return Next Day | F1 (View Task List — full session restore) |

---

## PER-03: Dev Sharma — Developer / Early Adopter Evaluator

---

### JRN-03.1: 15-Minute Technical Evaluation

**Persona:** PER-03 (Dev Sharma)

**Scenario:** Dev is evaluating TodoApp as a potential reference implementation to recommend to junior developers on his team who are building their first full-feature web app. He has DevTools open from the moment the page loads. His evaluation is structured and deliberate: he runs through all four core features, tests edge cases (empty submit, large list, refresh, storage clear, private mode simulation), and audits keyboard accessibility — all within a 15-minute window. He forms a binary judgment: "recommend" or "reject."

**Related Jobs:** JTBD-03.1 (Clean Architecture Assessment), JTBD-03.2 (Full Feature Correctness Verification), JTBD-03.3 (localStorage Resilience Verification), JTBD-03.4 (Keyboard Accessibility Audit)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Initial Load & Source Scan** | Opens app; immediately opens DevTools (Elements + Sources); scans HTML structure and linked scripts | App home / Browser DevTools | "How many files are there? Any frameworks? What's the state management pattern?" | Analytical, skeptical | Seeing a `node_modules` reference, a bundled output, or a CDN-loaded framework lowers the signal-to-noise ratio immediately | Minimal, readable source — plain HTML, one CSS file, one JS file — with localStorage as the single state source; structure is self-evident in under 2 minutes |
| **Feature Sequence Test** | Runs F0→F1→F2→F3 in order: adds 3 tasks, views the list, marks 2 complete, deletes 1; then attempts an empty submission | F0 Add Task, F1 View Task List, F2 Mark Task Complete, F3 Delete Task | "Does each feature work on the first try? Any ghost items? Does empty submit create a blank entry?" | Methodical, alert to defects | A single broken state (blank task appears, completed task un-toggles incorrectly, deleted task lingers) triggers a "reject" assessment | Zero broken states across the entire sequence; empty submit is silently blocked — no console errors, no blank entries, no UI glitches |
| **localStorage Resilience** | Adds 5 tasks → refreshes page (verifies persistence) → opens DevTools Application → clears localStorage → refreshes (verifies empty state and graceful fallback) | Browser DevTools Application tab / F1 View Task List | "Does it restore correctly? What happens on a clean slate — error or empty state? Is there a race condition on init?" | Forensic, slightly impressed when it works | A missing graceful fallback (silent failure, JS error in console, stale ghost data) signals poor production readiness | Tasks persist correctly on reload; empty state message shown after clear; user-visible notice if localStorage is unavailable; zero console errors in all three scenarios |
| **Keyboard Accessibility Audit** | Tabs through the UI without touching the mouse; adds a task via Enter, navigates to a task via Tab, completes via Space, deletes via Tab + Enter/Space | F0, F2, F3 / Keyboard navigation | "Can I complete the entire loop without the mouse? Is the tab order logical? Are the interactive targets keyboard-reachable?" | Evaluative, focused | If any core action requires a mouse click (completion checkbox not focusable, delete button not in tab order), keyboard compliance fails entirely | All interactive elements in logical tab order; completion and delete operable via keyboard; Enter submits from input field; no mouse required for any core action |
| **Architecture Review** | Views page source; reads JS file end-to-end; notes state management pattern, event binding approach, and localStorage integration points | Browser DevTools Sources tab | "Is the code clean enough to show a junior dev? Is the state management obvious? Are there any footguns?" | Critical but fair | Nested callbacks, global state leaking into the DOM, or inconsistent localStorage writes suggest the pattern is hard to teach | Source is readable, consistent, and maps directly to the four features; localStorage is the single source of truth with synchronous writes on every state change |
| **Judgment & Share** | Closes DevTools; forms recommendation; may copy the URL to share with the team or open the repo link | Browser / Team communication | "This is a solid example. Clean, no bloat, handles the edge cases. I'll recommend it." | Confident, satisfied — or (rejection scenario) dismissive and disappointed | If even one quality signal fails (broken state, missing keyboard support, unnecessary dependency), the recommendation is withheld | Perfect execution on all four evaluation criteria converts Dev from evaluator to active advocate — he recommends the repo to junior devs and potentially adapts the pattern |

### Key Moments
- **Decision Point:** Initial Load & Source Scan — seeing a clean minimal file structure vs. a bundled/framework-heavy output determines Dev's prior going into every subsequent test; a bad first impression biases all observations
- **Risk of Abandonment:** Feature Sequence Test — one broken state (blank task, ghost item after delete, stuck toggle) causes an immediate "reject" verdict regardless of how the rest of the evaluation goes
- **Delight Opportunity:** localStorage Resilience stage — the graceful fallback message when storage is unavailable is a signal that the author has thought beyond the happy path; this specifically converts skepticism into respect

### Success Outcome
Dev completes all four evaluation passes (feature correctness, localStorage resilience, keyboard accessibility, architecture review) in under 15 minutes with zero findings that trigger a "reject." He confirms via DevTools: no unnecessary dependencies, no broken states, no console errors, no mouse required. He adds the repo to his recommended resources list — satisfying JTBD-03.1 through JTBD-03.4.

### Feature Touchpoints

| Stage | Features |
|---|---|
| Initial Load & Source Scan | F0, F1 (source structure, state management pattern) |
| Feature Sequence Test | F0 (Add Task + input validation), F1 (View Task List), F2 (Mark Task Complete), F3 (Delete Task) |
| localStorage Resilience | F1 (persistence restore), localStorage Persistence (graceful fallback) |
| Keyboard Accessibility Audit | F0 (Enter submit), F2 (Tab + Space toggle), F3 (Tab + Enter/Space delete) |
| Architecture Review | F0, F1, F2, F3, localStorage Persistence (source code review) |
| Judgment & Share | — (post-evaluation outcome) |

---

## Cross-Journey Patterns

### Common Pain Points Across All Personas

| Pain Point | Appears In | Shared Opportunity |
|---|---|---|
| **First interaction determines trust** — if the app doesn't work immediately, all three personas abandon it for a fallback | JRN-01.1 (unfocused input), JRN-02.1 (offline load fail), JRN-03.1 (broken state on first test) | The initial page load and first action must be flawless — auto-focus, instant list render from localStorage, zero network dependency |
| **Broken states destroy confidence permanently** — a single stuck, duplicated, or phantom task causes abandonment (Maya), distrust (Liam), or "reject" verdict (Dev) | JRN-01.2 (stuck toggle), JRN-02.1 (toggle-back losing text), JRN-03.1 (ghost item after delete) | Zero broken states is a non-negotiable quality bar; state transitions must be synchronous and deterministic |
| **No confirmation dialogs or extra steps** — all three personas want actions to execute immediately with no friction layers | JRN-01.2 (delete confirmation), JRN-02.1 (save button), JRN-03.1 (any blocking UI) | F0–F3 should all be single-action operations with immediate effect; no modals, no confirms, no loading states |

### Shared Opportunities Across Multiple Personas

| Opportunity | Benefits | Journeys |
|---|---|---|
| **localStorage auto-save on every state change** | Maya trusts the list between sessions; Liam relies on it as a core requirement; Dev verifies it as a quality signal | JRN-01.2, JRN-02.1, JRN-03.1 |
| **Graceful localStorage fallback with visible notice** | Liam needs it for trust; Dev tests it as a resilience quality signal | JRN-02.1, JRN-03.1 |
| **Keyboard-first input and completion controls** | Liam prefers keyboard workflows; Dev audits it as an accessibility requirement | JRN-02.1, JRN-03.1 |
| **Visual distinction between complete and incomplete tasks** | Maya scans for pending tasks; Liam uses the same distinction to triage offline; Dev verifies it as correct rendering | JRN-01.2, JRN-02.1, JRN-03.1 |

### Convergence Point: The Empty State
All three personas encounter the empty task list in different contexts (Maya on first use, Liam after clearing stale tasks, Dev after clearing localStorage). An explicit empty state message prevents all three from experiencing a "blank white screen" that reads as a broken app rather than an empty list.

---

## Journey-to-JTBD Traceability

| JRN-ID | Stage | JTBD-ID | Expected Outcome |
|---|---|---|---|
| JRN-01.1 | Land | JTBD-01.1 | Input is auto-focused; typing begins immediately with zero clicks |
| JRN-01.1 | Capture #1 | JTBD-01.1 | Task appears in list within 100ms of Enter; input clears for next capture |
| JRN-01.1 | Capture #2 | JTBD-01.1 | Second task captured without re-clicking input; Enter submits again |
| JRN-01.2 | Open | JTBD-01.2 | Full task list restored from localStorage on page load; no re-entry required |
| JRN-01.2 | Scan | JTBD-01.2 | Completed and incomplete tasks are visually distinct; pending tasks identifiable in one pass |
| JRN-01.2 | Complete | JTBD-01.3 | Visual change (strikethrough + checkmark) appears within 100ms; state persists after reload |
| JRN-01.2 | Undo Completion | JTBD-01.3 | Toggle-back is immediate; task returns to incomplete state; persists on reload |
| JRN-01.2 | Delete Stale | JTBD-01.4 | Task removed immediately; does not reappear after page reload; no confirmation dialog |
| JRN-01.2 | Decide | JTBD-01.2 | Remaining list is clean and current; pending items are immediately scannable |
| JRN-02.1 | Open Offline | JTBD-02.2 | App loads fully with network disabled; all four core actions available offline |
| JRN-02.1 | Add Tasks | JTBD-02.1 | No network requests made during add; task stored in localStorage only |
| JRN-02.1 | Toggle Completion | JTBD-02.4 | Toggle-back restores task to incomplete with original text preserved; persists on reload |
| JRN-02.1 | Privacy Check | JTBD-02.1 | DevTools Network tab shows zero outbound requests across all core actions |
| JRN-02.1 | End Session | JTBD-02.3 | All state written to localStorage on each change; no "save" action required; close is safe |
| JRN-02.1 | Return Next Day | JTBD-02.3 | 100% of tasks (text + completion state) restored on next session open |
| JRN-03.1 | Initial Load & Source Scan | JTBD-03.1 | No unnecessary dependencies detected; state management pattern evident from source |
| JRN-03.1 | Feature Sequence Test | JTBD-03.2 | F0→F1→F2→F3 all pass in one sequence; empty submit blocked; zero broken states |
| JRN-03.1 | localStorage Resilience | JTBD-03.3 | Normal reload, post-clear reload, and storage-unavailable scenarios all produce expected behavior |
| JRN-03.1 | Keyboard Accessibility Audit | JTBD-03.4 | Full add→complete→delete sequence completable via keyboard alone with no mouse |
| JRN-03.1 | Architecture Review | JTBD-03.1 | Code is readable, consistent, and maps directly to four features; no footguns or obscured patterns |

---

*Document generated: 2026-05-07 | Project: TodoApp | Journeys Version: 1.0*
