# UX Mockup: Basic To-Do App (TodoApp)

**Project:** TodoApp
**Generated:** 2026-05-07
**Version:** 1.0
**Based on:** UserStories-TodoApp.md v1.0, PRD-TodoApp.md v1.0, FRD-TodoApp.md v1.0, JOURNEYS-TodoApp.md v1.0

---

## Overview

TodoApp is a single-screen, single-page application. There is exactly one view — the main task management surface — and all interactions happen inline on that page. No navigation, no modals, no routes.

### Design Principles

1. **Zero friction first** — The input field is auto-focused on load. The user can type and press Enter without touching the mouse. Every action takes one step.
2. **Immediate feedback** — All mutations (add, complete, delete) reflect visually in < 100ms. No spinners, no save buttons, no loading states for primary actions.
3. **Non-blocking errors only** — Validation errors appear inline below the input. Storage errors appear as dismissible banners. No `alert()`, no modals, no blocking dialogs.
4. **Always-visible controls** — The completion toggle and delete button are visible on every task at all times, not hover-only. This ensures keyboard accessibility and reduces discovery friction.
5. **Silence is golden** — Internal errors (malformed task, task not found) are console-only. Users are never interrupted for problems they cannot act on.

### Personas & Journey Reference

| Persona | Key Need | Critical UX Moment |
|---------|----------|--------------------|
| Maya Torres (Busy Professional) | Zero-friction task capture in < 10s | Auto-focused input on page load (JRN-01.1) |
| Liam Okafor (Privacy-Conscious Offline) | Full offline operation, local-only data | No network indicators; storage notice on unavailability (JRN-02.1) |
| Dev Sharma (Developer Evaluator) | Keyboard accessibility, graceful edge cases | All controls keyboard-reachable; graceful localStorage fallbacks (JRN-03.1) |

---

## User Flows

### Flow 1: Add Task (F0)

**Trigger:** User opens the app or finishes a previous task capture
**User Stories:** US-0.1, US-0.2, US-0.3, US-0.4, US-0.5
**Personas:** Maya Torres (JRN-01.1), Liam Okafor (JRN-02.1), Dev Sharma (JRN-03.1)

```
[Page Load]
    │
    ▼
[Input field auto-focused, cursor ready]
    │
    ▼
[User types task description]
    │
    ├── User presses Enter ──────────────────┐
    │                                        │
    └── User clicks "Add" button ────────────┤
                                             ▼
                                    [System trims input text]
                                             │
                          ┌──────────────────┼──────────────────┐
                          ▼                  ▼                   ▼
                    [Empty text]      [Text > 500 chars]   [Valid text]
                          │                  │                   │
                          ▼                  ▼                   ▼
                  [Inline error:       [Inline error:      [Task created,
                  "Task description   "Task description    prepended to list]
                  cannot be empty."]  must be 500 chars        │
                  Input cleared +     or fewer."]              ▼
                  refocused]          No task created    [localStorage write]
                                                               │
                                              ┌────────────────┼────────────────┐
                                              ▼                                 ▼
                                      [Write succeeds]                  [Write fails]
                                              │                                 │
                                              ▼                                 ▼
                                      [List re-renders,           [Task shown in UI for
                                      input cleared,              session; amber banner:
                                      input refocused]            "Your task was added but
                                                                  could not be saved..."]
```

**Steps:**
1. Input field is visible at top of page, auto-focused on `DOMContentLoaded` (US-0.1, US-0.2)
2. User types a description (up to 500 chars enforced by `maxlength` attribute)
3. User submits via Enter key or "Add" button click
4. System trims input; validates against empty and max-length rules (US-0.3, US-0.4)
5. On validation failure: inline error appears below input; input cleared and refocused; no task created
6. On validation success: new task prepended to list, input cleared, focus restored to input
7. If localStorage write fails: task still visible in session; amber non-blocking banner shown (US-0.5)

---

### Flow 2: View Task List (F1)

**Trigger:** Page load / any mutation to the task list
**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-1.5
**Personas:** Maya Torres (JRN-01.2), Liam Okafor (JRN-02.1), Dev Sharma (JRN-03.1)

```
[DOMContentLoaded fires]
    │
    ▼
[localStorage read attempt]
    │
    ├── [localStorage unavailable] ──▶ [In-memory mode; persistent amber banner:
    │                                   "Storage is unavailable. Tasks will not
    │                                    be saved across sessions."]
    │                                          │
    ├── [JSON parse fails] ──▶ [taskList = [];  ▼
    │                           Clears bad key; [All 4 actions still work in-session]
    │                           One-time dismissible amber banner:
    │                           "Previous tasks could not be loaded. Starting fresh."]
    │
    └── [Valid JSON array] ──▶ [Populate in-memory taskList]
                                        │
                                        ▼
                              [renderTaskList() called]
                                        │
                              ┌─────────┴──────────┐
                              ▼                     ▼
                        [List is empty]      [List has tasks]
                              │                     │
                              ▼                     ▼
                       [Empty state:        [Render task items,
                        "No tasks yet.       newest first;
                         Add one above!"]    each item shows:
                                             - Completion toggle
                                             - Task description text
                                             - Delete button]
```

**Steps:**
1. On page load, app reads `todoapp_tasks` from localStorage (US-1.1)
2. Three branches: unavailable storage → in-memory mode with persistent notice; corrupted data → reset + one-time notice; valid data → populate list (US-1.4, US-1.5)
3. List renders newest-first; completed tasks show strikethrough + muted grey text (US-1.2)
4. Empty list shows "No tasks yet. Add one above!" message (US-1.3)
5. List re-renders automatically after every add, toggle, or delete

---

### Flow 3: Mark Task Complete / Incomplete (F2)

**Trigger:** User clicks or keyboard-activates the completion toggle on a task item
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5
**Personas:** Maya Torres (JRN-01.2), Liam Okafor (JRN-02.1)

```
[User activates completion toggle]
(click, Space, or Enter when toggle has focus)
    │
    ▼
[System locates task by ID in in-memory array]
    │
    ├── [Task not found] ──▶ [console.error; no state change; UI unchanged]
    │                        (should not occur in normal use)
    │
    └── [Task found] ──▶ [task.completed = !task.completed]
                                    │
                                    ▼
                          [localStorage write attempt]
                                    │
                         ┌──────────┴──────────┐
                         ▼                      ▼
                  [Write succeeds]        [Write fails]
                         │                      │
                         ▼                      ▼
                  [UI re-renders:        [UI still re-renders
                   task shows new         (in-memory updated);
                   completion state       Amber banner:
                   immediately]           "Changes could not be
                                          saved. They will be
                                          lost on page refresh."]
```

**Completion visual states:**
- `completed: false` → normal text, unchecked checkbox
- `completed: true` → strikethrough text, muted/grey color, checked checkbox

**Steps:**
1. Each task item has a visible checkbox/toggle control (US-2.1)
2. One click/activation flips the completion state in either direction (US-2.2)
3. Toggle is keyboard-accessible via Tab + Space/Enter (US-2.3)
4. Visual change appears in < 100ms; state persists across page refreshes (US-2.4)
5. If localStorage write fails: UI still updates for session; amber notice shown (US-2.5)

---

### Flow 4: Delete Task (F3)

**Trigger:** User clicks or keyboard-activates the delete button on a task item
**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4, US-3.5
**Personas:** Maya Torres (JRN-01.2), Dev Sharma (JRN-03.1)

```
[User activates delete button]
(click, or Enter/Space when button has focus)
    │
    ▼
[System locates task by ID in in-memory array]
    │
    ├── [Task not found] ──▶ [console.error; no state change; UI unchanged]
    │                        (should not occur in normal use)
    │
    └── [Task found] ──▶ [Remove task from in-memory array]
                                    │
                                    ▼
                          [localStorage write attempt]
                                    │
                         ┌──────────┴──────────┐
                         ▼                      ▼
                  [Write succeeds]        [Write fails]
                         │                      │
                         ▼                      ▼
                  [UI re-renders]        [UI still re-renders;
                         │               Amber banner:
                         │               "Changes could not be saved.
                         │               The deleted task may reappear
                         │               on page refresh."]
                         │
                ┌────────┴──────────┐
                ▼                   ▼
         [List still         [List now empty]
          has tasks]               │
                │                  ▼
                ▼           [Empty state shown:
         [Remaining           "No tasks yet.
          tasks render]        Add one above!"]
                │
                ▼
         [Focus moves to
          next task or
          input field]
```

**Steps:**
1. Delete button is always visible on every task item — not hover-only (US-3.1, US-3.2)
2. No confirmation dialog — deletion is immediate (US-3.1, PRD §F3)
3. Works for both completed and incomplete tasks (US-3.2)
4. After deleting the last task, empty state appears; app does not crash (US-3.3)
5. Delete button is keyboard-accessible; focus moves logically after deletion (US-3.4)
6. Deleted tasks are gone after page refresh; storage failure shows notice (US-3.5)

---

## Screen Designs

### Screen: Main Task Management View

**Purpose:** The only screen in the application. Handles all four features (F0–F3) inline.
**User Stories:** US-0.1 through US-3.5 (all stories)

#### Layout — With Tasks

```
┌─────────────────────────────────────────────────────┐
│                     TodoApp                         │  ← App title / header
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Storage Notice Banner — amber, dismissible]       │  ← Conditional: shown only
│   ⚠ "Storage is unavailable. Tasks will not be      │    on storage error states
│      saved across sessions."           [×]          │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────┐  ┌──────────┐  │
│  │ Add a new task...               │  │   Add    │  │  ← Input + Add button (F0)
│  └─────────────────────────────────┘  └──────────┘  │    Auto-focused on load
│                                                     │
│  ✕ Task description cannot be empty.               │  ← Inline error (conditional)
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Task List                                          │  ← Section header (optional)
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ☐  Buy groceries                      [✕]  │   │  ← Incomplete task item
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ☑  ~~Read chapter 3~~               [✕]  │   │  ← Completed task item
│  └─────────────────────────────────────────────┘   │    (strikethrough + muted)
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ☐  Call landlord about weekend        [✕]  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ☐  Pick up prescription               [✕]  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [list scrolls if content exceeds viewport]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Layout — Empty State

```
┌─────────────────────────────────────────────────────┐
│                     TodoApp                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────┐  ┌──────────┐  │
│  │ Add a new task...               │  │   Add    │  │
│  └─────────────────────────────────┘  └──────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│           No tasks yet. Add one above!              │  ← Empty state message
│                                                     │    (centered, muted text)
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Layout — Inline Validation Error State

```
┌─────────────────────────────────────────────────────┐
│                     TodoApp                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────┐  ┌──────────┐  │
│  │                                 │  │   Add    │  │  ← Input cleared, focused
│  └─────────────────────────────────┘  └──────────┘  │
│  ⚠ Task description cannot be empty.               │  ← Inline error below input
│                                                     │    Disappears on next keypress
│  ...task list below...                              │
└─────────────────────────────────────────────────────┘
```

---

#### Information Hierarchy

| Priority | Content | Placement | Rationale |
|----------|---------|-----------|-----------|
| **Primary** | Task input field + Add button | Top of content area, full-width | Entry point to every workflow; must be immediately available |
| **Primary** | Task list | Main content body, fills remaining height | The core output users read on every visit |
| **Secondary** | Completion toggle (checkbox) | Left of each task item | Functional but not the first thing the eye lands on |
| **Secondary** | Task description text | Center of each task item | The actual content; visually weighted |
| **Secondary** | Delete button | Right of each task item | Available but not the focus; right-side placement is conventional |
| **Tertiary** | App title / header | Top of page | Brand/orientation; not the action |
| **Tertiary** | Storage notice banner | Below header, above input | Only shown conditionally; amber colour draws attention without blocking |
| **Tertiary** | Inline validation error | Below input field | Contextual, appears only on error |
| **Tertiary** | Empty state message | In list area when empty | Replaces list when no content exists |

---

#### States

| State | Trigger | Visual Appearance | User Feedback |
|-------|---------|-------------------|---------------|
| **Default (tasks present)** | Normal operation with tasks | Task list with items; input focused | N/A |
| **Empty** | No tasks in list | "No tasks yet. Add one above!" message in list area | Prompt to add first task (US-1.3, US-3.3) |
| **Inline validation error** | Empty or too-long submission | Red/amber text below input field; input cleared and refocused | "Task description cannot be empty." or "Task description must be 500 characters or fewer." (US-0.3, US-0.4) |
| **Storage unavailable** | localStorage inaccessible on load | Persistent amber banner at top; app runs in-memory | "Storage is unavailable. Tasks will not be saved across sessions." (US-1.5) |
| **Corrupted storage** | JSON parse fails on load | Dismissible amber banner at top; fresh empty list | "Previous tasks could not be loaded. Starting fresh." (US-1.4) |
| **Storage write failure** | localStorage.setItem throws on add/toggle/delete | Amber banner; action still works in-session | "Your task was added but could not be saved. It will be lost on page refresh." (US-0.5, US-2.5, US-3.5) |
| **Task completed** | Completion toggle activated | Strikethrough text + muted grey color + checked checkbox on that task item | Immediate visual change < 100ms (US-1.2, US-2.1) |
| **Task incomplete (toggled back)** | Completed task toggle activated again | Normal text, normal color, unchecked checkbox | Immediate visual revert < 100ms (US-2.2) |

---

#### Interactive Elements

| Element | Type | Location | Keyboard | Behavior |
|---------|------|----------|----------|----------|
| Task input field | `<input type="text" maxlength="500">` | Top of content, full-width minus Add button | Auto-focused on load; Enter submits | Accepts task description; trimmed before validation |
| Add button | Primary action button | Right of input field | Tab-reachable; Enter/Space activates | Submits task; same behavior as Enter in input |
| Completion toggle | `<input type="checkbox">` or equivalent | Left of each task item | Tab-reachable; Space/Enter activates | Flips task.completed; triggers re-render |
| Delete button | Destructive action button (icon or "×") | Right of each task item | Tab-reachable; Enter/Space activates | Removes task; focus moves to next task or input |
| Storage banner dismiss | Icon button "×" | Right of storage notice banner | Tab-reachable; Enter/Space activates | Hides banner (except STORAGE_UNAVAILABLE which persists) |

---

## Interaction Patterns

### Pattern 1: Inline Validation Error

**When to use:** On empty submission (US-0.3) or text exceeding 500 characters (US-0.4)
**Trigger:** User submits with invalid input

**Behavior:**
1. Error message text appears directly below the input field in a small, styled element
2. Input field is cleared and immediately refocused
3. Error message disappears automatically when the user starts typing (`input` event listener)
4. Error message also disappears on next successful submission
5. No task is created

**Visual spec:**
- Error text: small font, amber/red color (`#dc2626` or similar), appearing flush-left below input
- No background box required — inline text is sufficient
- Icon optional: `⚠` prefix acceptable but not required

**Examples in app:** Task Description Cannot Be Empty, Task Too Long

---

### Pattern 2: Non-Blocking Storage Notice Banner

**When to use:** Storage write failure (US-0.5, US-2.5, US-3.5), corrupted storage on load (US-1.4), unavailable storage (US-1.5)
**Trigger:** localStorage errors

**Behavior:**
1. Amber/yellow banner appears below the app header and above the input field
2. Banner has a short, plain-language message explaining the situation
3. "×" dismiss button on the right (except STORAGE_UNAVAILABLE which persists for the session)
4. Banner does not block any interaction — user can type, add, complete, and delete normally
5. STORAGE_WRITE_FAILED banner: auto-dismissed on next successful write or page reload
6. STORAGE_PARSE_FAILED banner: user-dismissible, shown once
7. STORAGE_UNAVAILABLE banner: persists entire session, not dismissible

**Visual spec:**
- Background: amber/yellow (`#fef3c7` or similar)
- Border: `#d97706` left-side accent or full border
- Icon: `⚠` warning icon prefix
- Text: dark foreground (`#92400e` or similar) for contrast
- Dismiss button: `×` or `✕`, visually subtle

**Examples in app:** All three storage error states

---

### Pattern 3: Task Item Completion Toggle

**When to use:** User marks a task complete or incomplete (US-2.1, US-2.2, US-2.3)
**Trigger:** Click or keyboard activation of the checkbox/toggle

**Behavior:**
1. Single activation flips the state exactly once
2. If completing: strikethrough text, muted grey color, checkbox checked — all applied simultaneously
3. If reverting: normal text, normal color, checkbox unchecked — all applied simultaneously
4. Visual update within 100ms — no animation required, but a subtle transition is acceptable
5. Completed tasks remain in list at their original position (no sorting, no filtering in v1)

**Visual spec — Incomplete task:**
- Checkbox: unchecked (`☐`)
- Text: normal weight, default text color (e.g., `#111827`)
- Background: default (white or very light)

**Visual spec — Completed task:**
- Checkbox: checked (`☑` or native browser checked)
- Text: `text-decoration: line-through`, color: muted grey (e.g., `#6b7280`)
- Background: optional subtle grey (`#f9fafb`) for additional visual distinction

---

### Pattern 4: Immediate Deletion (No Confirmation)

**When to use:** User deletes any task (US-3.1, US-3.2)
**Trigger:** Click or keyboard activation of the delete button

**Behavior:**
1. Task item is immediately removed from the DOM
2. No confirmation dialog, no undo action, no toast notification for successful deletion
3. If list becomes empty: empty state message replaces the list
4. Focus moves to the next task item's delete button, or — if no tasks remain — to the input field
5. Deletion is final within the session (no undo in v1)

**Visual spec — Delete button:**
- `×` character, trash icon, or "Delete" label (text implementation choice)
- Always visible (not hover-only — required for keyboard accessibility)
- Positioned at the far right of the task item row
- Color: neutral (`#6b7280`) default; `#ef4444` red on hover/focus for destructive affordance

---

### Pattern 5: Auto-Focus on Load and Post-Submit

**When to use:** Page load, after any successful task submission (US-0.1, US-0.2)
**Trigger:** DOMContentLoaded; successful addTask()

**Behavior:**
1. On DOMContentLoaded: input field receives focus programmatically
2. After successful submission: input field value is cleared, then focus is set back
3. After a validation error: input field is cleared and refocused (error message visible below)
4. Result: user can immediately begin typing for the next task after each capture — zero clicks required

---

## Responsive Considerations

### Desktop (> 1024px)

- **Layout:** Single-column, centered, max-width ~640px or ~720px. Generous whitespace on sides.
- **Input row:** Input field takes ~80% width; "Add" button ~20%. Inline on one row.
- **Task items:** Full-width rows within the centered container. Checkbox left, text center, delete button right.
- **Typography:** Comfortable reading size (16px base), no cramping.
- **List height:** Scrollable if list grows beyond viewport. Task area is the primary scroll container.

```
     ┌─── max-width: 640px centered ───────────────────┐
     │  [Input field 80%         ] [  Add  ]            │
     │  ─────────────────────────────────────────────── │
     │  ☐  Task description text                  [✕]  │
     │  ☑  ~~Completed task~~                     [✕]  │
     └─────────────────────────────────────────────────┘
```

### Tablet (768px – 1024px)

- **Layout:** Same single-column layout; container fills more of the viewport width (~90%).
- **Input row:** Unchanged — input + button side by side.
- **Task items:** Touch targets enlarged slightly (min 44px height per task row).
- **Delete button:** Slightly larger tap target; remains always visible.
- **Fonts:** Same as desktop; no scaling needed.

### Mobile (< 768px)

- **Layout:** Full-width container, 16px horizontal padding.
- **Input row:** Input field full-width on its own row; "Add" button full-width below it OR keeps inline layout with narrower button label (e.g., "+" or "Add").
- **Task items:** Min 48px row height for comfortable tap targets (WCAG 2.5.5 recommendation).
- **Completion toggle:** Checkbox enlarged to min 24×24px tap area; consider wrapping in a larger clickable region.
- **Delete button:** Min 44×44px tap target; `×` character with generous padding.
- **Error messages:** Full-width below input, slightly larger font for readability.
- **Storage banners:** Full-width, stacked above input area.

```
     ┌── full width, 16px padding ────────────────────┐
     │  [Input field, full width                     ] │
     │  [     Add button, full width or inline       ] │
     │  ─────────────────────────────────────────────  │
     │  ☐  Task description text                 [✕]  │
     │  ☑  ~~Completed~~                         [✕]  │
     └────────────────────────────────────────────────┘
```

**Note:** A mobile-first CSS approach (base styles for mobile, `min-width` media queries for wider layouts) is recommended given the app's simplicity.

---

## Accessibility Notes

### Color Contrast

- **Normal task text:** Must meet WCAG AA (4.5:1 ratio) against the background. `#111827` on `#ffffff` passes.
- **Completed task text:** Muted grey (`#6b7280`) on white is ~4.63:1 — passes AA for normal text.
- **Inline error text:** Red/amber must meet 4.5:1. `#dc2626` on `#ffffff` = 5.74:1 — passes.
- **Storage banner:** `#92400e` (dark amber text) on `#fef3c7` (light yellow) = ~7.2:1 — passes AAA.
- **Delete button (default):** `#6b7280` on white = ~4.63:1 — passes AA.

### Keyboard Navigation

All interactive elements must be reachable and operable without a mouse (US-0.2, US-2.3, US-3.4, PRD §6):

| Tab Order | Element | Key to Activate |
|-----------|---------|-----------------|
| 1 | Task input field | Enter (submit task) |
| 2 | Add button | Enter or Space |
| 3 | Storage banner dismiss (if shown) | Enter or Space |
| 4+ | For each task item (top to bottom): | |
|   | — Completion toggle | Space or Enter |
|   | — Delete button | Enter or Space |

- Tab order through task items must be **sequential and logical** (top to bottom, toggle before delete within each item)
- After deleting a task via keyboard: focus moves to the **next task's toggle**, or to the **input field** if no tasks remain
- After adding a task: focus returns to the **input field** automatically
- Inline error state: focus stays on / returns to the **input field**

### Screen Reader Support

- App title/heading: `<h1>TodoApp</h1>` (or equivalent landmark)
- Input field: `<label for="task-input">Add a new task</label>` (visible or visually hidden)
- Add button: descriptive text "Add" (no icon-only)
- Task list: `<ul role="list">` containing `<li>` elements
- Completion toggle: native `<input type="checkbox">` preferred; if custom, use `role="checkbox"` + `aria-checked`
- Delete button: `aria-label="Delete task: [task description]"` to identify which task is being deleted
- Error messages: `role="alert"` or `aria-live="polite"` so screen readers announce them on appearance
- Storage notice banners: `role="status"` or `aria-live="polite"` for non-blocking announcements
- Empty state: plain text within the list container; no special ARIA needed

### ARIA Labels Needed

| Element | ARIA Requirement |
|---------|-----------------|
| Task input | `<label>` associated with `for` attribute |
| Add button | Descriptive text label ("Add"); no additional ARIA needed |
| Completion toggle | `aria-label="Mark complete: [task text]"` or `aria-label="Mark incomplete: [task text]"` depending on state |
| Delete button | `aria-label="Delete: [task text]"` |
| Inline error | `role="alert"` (so it's announced immediately on insertion) |
| Storage banners | `role="status"` or `aria-live="polite"` |
| Empty state message | No special ARIA; it's static text in the list area |

### Focus Management

- `autofocus` attribute on input field for page load (US-0.1)
- Programmatic `.focus()` call after task submission to return focus to input (US-0.1, US-0.2)
- After deletion: focus management required to prevent focus being lost to `<body>` (US-3.4)
  - Preferred: move to the **next task's toggle** in DOM order
  - Fallback (last task deleted): move to the **input field**
- Completion toggle click: focus stays on toggle (no focus movement needed)

### Touch & Pointer

- Minimum tap target: 44×44px for all interactive elements (WCAG 2.5.5 — AA)
- Completion toggle area: expand the clickable region beyond the checkbox visual via padding
- Delete button: use `padding` to create a generous tap target even if the `×` glyph is small
- No hover-only affordances — all controls must be visible at rest (US-3.2, FRD F03)

---

## Story Coverage Checklist

| Story ID | UX Element | Covered In |
|----------|------------|------------|
| US-0.1 | Auto-focused input; Add button submit | Flow 1, Pattern 5, Screen States |
| US-0.2 | Enter key submit | Flow 1, Pattern 5 |
| US-0.3 | Inline "cannot be empty" error | Flow 1, Pattern 1, Screen States |
| US-0.4 | Inline "500 chars max" error; maxlength attribute | Flow 1, Pattern 1 |
| US-0.5 | Amber banner on add write failure | Flow 1, Pattern 2, Screen States |
| US-1.1 | List renders on page load from localStorage | Flow 2, Screen Layout |
| US-1.2 | Strikethrough + muted color for completed tasks | Pattern 3, Screen Layout, Screen States |
| US-1.3 | "No tasks yet" empty state | Flow 2, Screen Empty State, Screen States |
| US-1.4 | Dismissible banner on corrupted storage | Flow 2, Pattern 2, Screen States |
| US-1.5 | Persistent banner when storage unavailable | Flow 2, Pattern 2, Screen States |
| US-2.1 | Checkbox toggle; completion visual | Flow 3, Pattern 3, Interactive Elements |
| US-2.2 | Bidirectional toggle (revert to incomplete) | Flow 3, Pattern 3 |
| US-2.3 | Tab + Space/Enter to toggle | Flow 3, Keyboard Navigation |
| US-2.4 | State persists (localStorage write on toggle) | Flow 3 |
| US-2.5 | Amber banner on toggle write failure | Flow 3, Pattern 2, Screen States |
| US-3.1 | Delete button; immediate removal | Flow 4, Pattern 4, Interactive Elements |
| US-3.2 | Delete visible on all tasks; works for both states | Flow 4, Pattern 4 |
| US-3.3 | Empty state after last task deleted | Flow 4, Screen Empty State |
| US-3.4 | Tab + Enter/Space delete; focus management | Flow 4, Keyboard Navigation, Focus Management |
| US-3.5 | Deleted task gone after refresh; banner on failure | Flow 4, Pattern 2 |

---

*Document generated: 2026-05-07 | Project: TodoApp | UX Mockup Version: 1.0*
