# Roadmap: Basic To-Do App

**Created:** 2026-05-07
**Milestone:** v1
**Granularity:** Standard
**Coverage:** 6/6 requirements mapped ✓

---

## Phases

- [ ] **Phase 1: Core Task Loop** - Users can add, view, complete, and delete tasks (in-memory)
- [ ] **Phase 2: Persistence & Accessibility** - Tasks survive page refresh and the app is fully keyboard-navigable

---

## Phase Details

### Phase 1: Core Task Loop

**Status**: executing
**Goal**: Users can perform the full capture-and-completion loop — add a task, see it in the list, mark it done, and delete it
**Depends on**: Nothing (first phase)
**Requirements**: TASK-01, TASK-02, TASK-03, TASK-04
**Success Criteria** (what must be TRUE):
  1. User can type a task description and submit it; the new task immediately appears at the top of the list
  2. User sees all tasks on page load with a clear empty state message when no tasks exist
  3. User can click a checkbox/toggle on any task to mark it complete, and completed tasks display with strikethrough styling
  4. User can click delete on any task and it is immediately removed from the list
  5. Empty text submission is rejected with an inline validation error message
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — TDD: taskStore.js in-memory store with validation (RED→GREEN→REFACTOR)
- [ ] 01-02-PLAN.md — index.html app shell + styles.css with completion/error/empty state styling
- [ ] 01-03-PLAN.md — ui.js rendering module + full event binding (Add/Toggle/Delete/Error)
- [ ] 01-04-PLAN.md — main.js bootstrap + Playwright E2E tests for all 5 Phase 1 success criteria

### Phase 2: Persistence & Accessibility

**Goal**: Tasks persist across page refreshes and every core action is completable without a mouse
**Depends on**: Phase 1
**Requirements**: PERS-01, ACCS-01
**Success Criteria** (what must be TRUE):
  1. After adding, completing, or deleting tasks then refreshing the page, the task list is exactly as the user left it
  2. User can add a task, toggle completion, and delete a task using only the keyboard (Tab, Enter, Space — no mouse)
  3. The input field receives focus automatically on page load so the user can begin typing immediately
  4. Delete buttons and toggle checkboxes are keyboard-focusable and activatable via Enter or Space
**Plans**: TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Task Loop | 0/4 | Not started | - |
| 2. Persistence & Accessibility | 0/? | Not started | - |

---

## Coverage Map

| Requirement | Phase | Description |
|-------------|-------|-------------|
| TASK-01 | Phase 1 | User can add a new task |
| TASK-02 | Phase 1 | User can view task list (including empty state) |
| TASK-03 | Phase 1 | User can mark a task complete (toggle) |
| TASK-04 | Phase 1 | User can delete a task |
| PERS-01 | Phase 2 | Tasks persist via localStorage |
| ACCS-01 | Phase 2 | Fully keyboard navigable |

**Total v1:** 6 requirements | **Mapped:** 6 | **Orphaned:** 0 ✓

---

*Roadmap created: 2026-05-07*