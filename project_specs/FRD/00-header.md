# FRD: Basic To-Do App (TodoApp)

**Version:** 1.0
**Date:** 2026-05-07
**Status:** Draft
**Based on PRD:** PRD-TodoApp.md v1.0

---

## Scope

This Functional Requirements Document specifies the exact behavior of all four v1 features of the TodoApp: Add Task (F00), View Task List (F01), Mark Task Complete (F02), and Delete Task (F03). TodoApp is a fully client-side, single-user task management application with no backend, no authentication, and no network dependency. All persistence is achieved via the browser's `localStorage` API.

This document is the authoritative reference for implementation. Every input, output, validation rule, error state, data structure, and module interface is defined here. No feature outside F00–F03 is in scope for v1.

---

## Conventions

- **Feature IDs** follow the format `F{nn}` (zero-padded), matching PRD feature numbers.
- **Field names** are written in `monospace` and correspond exactly to keys used in code and localStorage.
- **Required** / **Optional** markers appear in the Inputs section of each feature.
- **Error codes** are `SCREAMING_SNAKE_CASE` strings surfaced to the UI as human-readable messages.
- **Process steps** are numbered and must be executed in order unless branching is indicated.
- Cross-references use the format `see F01 §Process` or `see Y0-schema.md §Task`.
- All timestamps are ISO 8601 strings (`YYYY-MM-DDTHH:mm:ss.sssZ`) generated client-side via `new Date().toISOString()`.
- **"Persist"** always means writing the current task list to `localStorage` under the key `todoapp_tasks`.

---

## Table of Contents

| Chunk File | Contents |
|------------|----------|
| `00-header.md` | This file — title, scope, conventions, TOC, shared terminology |
| `F00-add-task.md` | F00: Add Task |
| `F01-view-task-list.md` | F01: View Task List |
| `F02-mark-task-complete.md` | F02: Mark Task Complete |
| `F03-delete-task.md` | F03: Delete Task |
| `Y0-schema.md` | Data schema (localStorage structure, Task object) |
| `Y1-api.md` | Client-side module interface (JavaScript function signatures) |
| `Y2-errors.md` | Cross-feature error catalog |
| `Y3-integrations.md` | External integration points (localStorage, browser APIs) |

---

## Shared Terminology

- **Task** — A single user-created to-do item consisting of a text description, a completion flag, a unique identifier, and a creation timestamp.
- **Task List** — The ordered collection of all tasks currently stored in the application. Persisted in `localStorage`.
- **localStorage** — The browser's Web Storage API used as the sole persistence layer. Key: `todoapp_tasks`. Value: JSON-serialized array of Task objects.
- **In-memory State** — The JavaScript runtime representation of the task list (e.g., an array held in a module variable). Kept in sync with localStorage after every mutating operation.
- **Empty State** — The UI condition when the task list contains zero tasks.
- **Completed Task** — A task whose `completed` field is `true`.
- **Incomplete Task** — A task whose `completed` field is `false`.
- **Task ID** — A unique string identifier assigned at task creation time (e.g., a UUID v4 or a `Date.now().toString(36) + Math.random().toString(36)` composite). Must be unique within the task list.
- **Persist** — Write the current in-memory task list to `localStorage` as a JSON string.
- **Hydrate** — Read the task list from `localStorage` on app load and populate in-memory state.
- **UI Render** — Re-draw the task list in the DOM to reflect current in-memory state.

---

*End of header — continue reading feature chunks F00 through F03, then cross-feature chunks Y0–Y3.*
