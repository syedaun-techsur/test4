# PERSONAS: Basic To-Do App (TodoApp)

| Field | Value |
|---|---|
| **Product Name** | TodoApp |
| **Version** | 1.0 |
| **Date** | 2026-05-07 |
| **Status** | Draft |
| **Related PRD** | PRD-TodoApp.md v1.0 |
| **Derived From** | PRD §2 Problem Statement, §3 Target Users, §5 Features, §7 Success Metrics |

---

## Persona Summary

| ID | Name | Role | Primary Goal |
|---|---|---|---|
| PER-01 | Maya Torres | Busy Professional / Personal Task Tracker | Capture and clear daily personal tasks with zero friction |
| PER-02 | Liam Okafor | Privacy-Conscious Offline User | Manage tasks without cloud accounts or network dependency |
| PER-03 | Dev Sharma | Developer / Early Adopter Evaluator | Evaluate the tool's minimal design as a reference implementation |

---

## PER-01: Maya Torres

**Role & Context:**
Maya is a 31-year-old marketing coordinator who juggles multiple responsibilities across her workday. She keeps a running list of personal errands, reminders, and side-project action items that don't belong in her employer's project management system. She has tried Todoist, Notion, and Apple Reminders but finds them overwhelming for simple personal use — they demand setup, accounts, and decisions before she can even type a task. She opens her browser throughout the day from a laptop or desktop, and needs to capture a thought in under 5 seconds before losing it. She is not technically sophisticated but is comfortable with everyday web apps.

**Goals:**
- Capture a task the instant it surfaces without navigating sign-up or onboarding (F0, PRD §2 "Speed of capture")
- See her full pending task list at a glance in one scroll (F1)
- Mark tasks done as she completes them for a sense of progress (F2)
- Clean up her list by removing tasks that are no longer relevant (F3)

**Pain Points:**
- Complex productivity tools add cognitive overhead before she can record anything (PRD §2 "Cognitive overhead")
- Sign-up walls block immediate use — she abandons tools that require an account just to try them (PRD §2 "Signup friction")
- Feature bloat (due dates, labels, integrations) creates decision fatigue for a simple "what do I need to do" list (PRD §2 "Feature bloat")
- Multi-step capture flows cause her to lose tasks mentally before she can type them (PRD §2 "Speed of capture")

**Technical Expertise:** Low–Intermediate — uses web apps daily, avoids CLI or developer tools, expects self-evident UI with no instructions

**Top Tasks:**
1. Add a new task quickly from the input field (multiple times/day, critical)
2. Scan the task list to decide what to work on next (daily, critical)
3. Mark completed tasks as done to track progress (daily, high)
4. Delete tasks that are no longer needed (weekly, medium)

**Success Criteria:**
- Adds first task within 10 seconds of opening the app with no instructions (PRD §7 "Time-to-first-task")
- Zero failed captures — no empty submissions slip through; the input is always responsive (PRD §7 "Zero broken states")
- Completed tasks are visually distinct without confusion about what is still pending (F1, F2)
- Task list is intact after closing and reopening the browser (PRD §7 "Persistence reliability")

---

## PER-02: Liam Okafor

**Role & Context:**
Liam is a 27-year-old freelance writer and researcher who is deliberate about digital privacy. He works from cafés, libraries, and home — often in offline or low-connectivity environments. He has opted out of cloud-sync services wherever possible and is skeptical of any tool that requires an account, sends data to a server, or stops working without internet. He needs a task list that lives entirely on his device, opens instantly in a browser tab, and works reliably whether or not he has a network connection. He is comfortable with browsers and static file tools and has basic familiarity with developer tools, but primarily cares about reliability and data ownership, not features.

**Goals:**
- Keep his task list entirely on his local device with no data leaving his browser (PRD §4 "No backend", localStorage)
- Use the app fully offline — no network dependency at any point (PRD §6 "Reliability: No network dependency")
- Have tasks persist reliably across browser sessions without an account (F1, PRD §6 "Persistence")
- Toggle completed tasks back to incomplete when plans change (F2 "Completed tasks can be toggled back to incomplete")

**Pain Points:**
- Cloud-first tools break or become inaccessible without internet (PRD §2 "Signup friction", §6 Reliability)
- Account-based tools require sharing personal data just to track a grocery list (PRD §2 "Signup friction")
- Apps with complex sync state create confusion about which version of his list is current (PRD §2 "Feature bloat")
- Heavy frameworks or online-only apps load slowly in low-bandwidth environments (PRD §6 "Performance")

**Technical Expertise:** Intermediate — comfortable with browsers, dev tools, static file hosting, and localStorage concepts; evaluates tools on a privacy/simplicity axis

**Top Tasks:**
1. Open the app offline and see his full task list immediately (daily, critical)
2. Add new tasks during a work session with no account or login barrier (daily, critical)
3. Mark tasks complete and undo if circumstances change (daily, high)
4. Verify that tasks survive a browser refresh (periodic, high)
5. Delete stale tasks to keep the list clean (weekly, medium)

**Success Criteria:**
- App loads and is fully functional with no network connection (PRD §7 "Offline operation")
- 100% of tasks survive a page reload via localStorage (PRD §7 "Persistence reliability")
- No personal data is transmitted — fully client-side operation confirmed (PRD §4 "No backend")
- All core actions are completable by keyboard alone (PRD §7 "Keyboard usability", §6 Accessibility)

---

## PER-03: Dev Sharma

**Role & Context:**
Dev is a 34-year-old frontend developer who evaluates minimal open-source tools as reference implementations and starting points for their own projects. He is not a daily task-list user — he is assessing TodoApp specifically to understand how a production-quality minimal web app is structured: its HTML/CSS/JS architecture, localStorage integration pattern, state management approach, and UI interaction model. He opens the app in a browser with DevTools open, inspects the source, tests edge cases (empty input, large task lists, localStorage clearing), and forms a judgment within 10–15 minutes. He may fork or adapt the codebase, or recommend it to junior developers as a clean example.

**Goals:**
- Quickly assess whether the app's implementation follows clean, minimal frontend patterns (PRD §3 "clean, extensible foundation for potential future enhancements")
- Confirm that all four core interactions (add, view, complete, delete) work correctly and edge cases are handled (F0–F3)
- Verify localStorage integration behaves predictably under refresh and storage-clear scenarios (PRD §8 Risk: localStorage unavailable)
- Evaluate keyboard accessibility compliance as a signal of code quality (PRD §6 Accessibility, §7 "Keyboard usability")

**Pain Points:**
- Over-engineered tools with unnecessary dependencies obscure the core pattern he's trying to evaluate (PRD §8 Risk: Over-engineering)
- Broken states (stuck tasks, duplicate renders, lost input) indicate poor state management (PRD §7 "Zero broken states")
- Apps that fail gracefully under edge cases (empty input, localStorage quota) lower confidence in production quality (PRD §8 Risk: localStorage unavailable)
- Lack of keyboard accessibility suggests the author hasn't considered real usability (PRD §6 Accessibility)

**Technical Expertise:** High — expert frontend developer, uses DevTools fluently, reads and evaluates source code, tests edge cases deliberately

**Top Tasks:**
1. Test all four core features (F0–F3) in sequence to verify the capture-to-completion loop (one-time evaluation, critical)
2. Inspect localStorage behavior: add tasks, refresh, verify persistence; clear storage, verify graceful fallback (one-time, critical)
3. Test empty input submission to confirm validation prevents broken state (one-time, high)
4. Test keyboard-only interaction for all four core actions (one-time, high)
5. Review source code architecture for patterns worth reusing or recommending (one-time, medium)

**Success Criteria:**
- All F0–F3 features work correctly with zero broken states on first evaluation (PRD §7 "Zero broken states")
- localStorage graceful fallback triggers correctly when storage is unavailable (PRD §8 Mitigation)
- Empty task submission is blocked by input validation (F0 "prevent empty task submission")
- All core actions are keyboard-accessible without mouse (PRD §7 "Keyboard usability")
- No unnecessary dependencies or frameworks beyond what the problem requires (PRD §8 Risk: Over-engineering)

---

## Persona Relationships

| Persona | Interacts With | Nature of Interaction |
|---|---|---|
| PER-01 Maya (Personal User) | PER-02 Liam (Offline User) | Parallel end-users of the same product; Maya values speed, Liam values privacy/offline — both are served by the same no-account local-state design |
| PER-01 Maya (Personal User) | PER-03 Dev (Evaluator) | Dev evaluates the tool that Maya uses daily; Maya's frictionless experience validates Dev's assessment of usability quality |
| PER-02 Liam (Offline User) | PER-03 Dev (Evaluator) | Liam's offline/localStorage requirements are exactly the edge cases Dev probes during evaluation; Dev's approval validates that Liam's scenario is handled correctly |

> **Note:** TodoApp is a single-user tool with no collaboration features. Personas do not interact *within* the product — they are independent users of the same interface. Relationships above reflect how their needs reinforce or stress-test each other.

---

## Feature-Persona Matrix

| Feature | Description | PER-01 Maya (Personal User) | PER-02 Liam (Offline User) | PER-03 Dev (Evaluator) |
|---|---|---|---|---|
| **F0** | Add Task | **Primary** — core daily capture action | **Primary** — primary input to the offline task list | **Primary** — first feature tested in evaluation sequence |
| **F1** | View Task List | **Primary** — scans list multiple times daily | **Primary** — must load correctly offline and after refresh | **Primary** — tests list rendering, empty state, and persistence |
| **F2** | Mark Task Complete | **Primary** — closes the capture-completion loop | **Primary** — uses toggle-back when plans change | **Primary** — tests checkbox state, visual feedback, and persistence |
| **F3** | Delete Task | **Primary** — removes resolved or irrelevant tasks | **Secondary** — uses less frequently, but confirms localStorage cleanup | **Primary** — tests immediate removal and no ghost reappearance after refresh |
| **localStorage Persistence** | Data survives refresh | **Secondary** — benefits from it, rarely thinks about it explicitly | **Primary** — a core requirement; explicitly verifies it | **Primary** — deliberately tests with refresh and storage-clear scenarios |
| **Offline Operation** | No network dependency | **Secondary** — occasionally useful (café, travel) | **Primary** — non-negotiable requirement | **Primary** — tests as a quality signal during evaluation |
| **Input Validation** | Prevent empty submission | **Primary** — prevents accidental blank tasks | **Secondary** — functional correctness expectation | **Primary** — deliberately tests empty submission as edge case |
| **Keyboard Accessibility** | Core actions without mouse | **Secondary** — occasional keyboard shortcut user | **Primary** — prefers keyboard-first workflows | **Primary** — explicit evaluation criterion for code quality |

**Matrix Key:**
- **Primary** — This persona is a direct, high-frequency user of this capability; design must serve their needs first
- **Secondary** — This persona benefits from this capability but it is not central to their primary workflow
- *(blank)* — Not applicable to this persona

---

*Document generated: 2026-05-07 | Project: TodoApp | Personas Version: 1.0*
