// e2e/todo-core.spec.js
// Covers all 5 Phase 1 ROADMAP success criteria + key acceptance criteria from UserStories
import { test, expect } from "@playwright/test";

test.describe("Phase 1: Core Task Loop", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Phase 1 is in-memory only — no localStorage state to clear between tests
  });

  // ─── F0: Add Task ───────────────────────────────────────────────────────────

  test("SC1 – User can add a task via Add button; task appears at top of list", async ({ page }) => {
    // US-0.1 AC: input visible; submit via button; new task prepended; input cleared
    await page.fill("#task-input", "Buy groceries");
    await page.click("#add-btn");

    const listItems = page.locator("#task-list .task-item");
    await expect(listItems).toHaveCount(1);
    await expect(listItems.first().locator(".task-text")).toHaveText("Buy groceries");
    await expect(page.locator("#task-input")).toHaveValue(""); // input cleared
  });

  test("SC1 – User can add a task via Enter key; task appears at top", async ({ page }) => {
    // US-0.1 AC: submit via Enter
    await page.fill("#task-input", "Read chapter 3");
    await page.press("#task-input", "Enter");

    const listItems = page.locator("#task-list .task-item");
    await expect(listItems).toHaveCount(1);
    await expect(listItems.first().locator(".task-text")).toHaveText("Read chapter 3");
  });

  test("SC1 – Second task added appears above first (newest first)", async ({ page }) => {
    // US-1.1 AC: newest first ordering
    await page.fill("#task-input", "First task");
    await page.click("#add-btn");
    await page.fill("#task-input", "Second task");
    await page.click("#add-btn");

    const items = page.locator("#task-list .task-item .task-text");
    await expect(items.nth(0)).toHaveText("Second task");
    await expect(items.nth(1)).toHaveText("First task");
  });

  test("US-0.2 – Input field is auto-focused on page load", async ({ page }) => {
    // US-0.2 AC: input field auto-focused on DOMContentLoaded
    await expect(page.locator("#task-input")).toBeFocused();
  });

  test("US-0.3 – Empty submission shows 'Task description cannot be empty.' error", async ({ page }) => {
    // US-0.3 AC: empty/whitespace shows error; no task created; input cleared + focused
    await page.fill("#task-input", "");
    await page.click("#add-btn");

    await expect(page.locator("#error-msg")).toBeVisible();
    await expect(page.locator("#error-msg")).toHaveText("Task description cannot be empty.");
    await expect(page.locator("#task-list .task-item")).toHaveCount(0);
    await expect(page.locator("#task-input")).toHaveValue(""); // cleared on empty error
  });

  test("US-0.3 – Whitespace-only submission shows empty error", async ({ page }) => {
    await page.fill("#task-input", "   ");
    await page.click("#add-btn");
    await expect(page.locator("#error-msg")).toBeVisible();
    await expect(page.locator("#error-msg")).toHaveText("Task description cannot be empty.");
  });

  test("US-0.4 – 501-char submission shows too-long error; input text preserved", async ({ page }) => {
    // US-0.4 AC: >500 chars shows error; input text PRESERVED; focused
    // Note: maxlength=500 on the input prevents typing >500 chars normally
    // We test via JS to simulate the validation bypass scenario
    const longText = "a".repeat(501);
    await page.evaluate((text) => {
      document.getElementById("task-input").value = text;
    }, longText);
    await page.click("#add-btn");

    await expect(page.locator("#error-msg")).toBeVisible();
    await expect(page.locator("#error-msg")).toHaveText("Task description must be 500 characters or fewer.");
    // Input text PRESERVED (not cleared) for TASK_TEXT_TOO_LONG
    const inputValue = await page.locator("#task-input").inputValue();
    expect(inputValue.length).toBe(501);
  });

  test("Error message clears when user starts typing", async ({ page }) => {
    // US-0.3 — error clears on input event
    await page.click("#add-btn"); // trigger empty error
    await expect(page.locator("#error-msg")).toBeVisible();
    await page.fill("#task-input", "a");
    await expect(page.locator("#error-msg")).not.toBeVisible();
  });

  // ─── F1: View Task List ──────────────────────────────────────────────────────

  test("SC2 – Empty state message shown on page load with no tasks", async ({ page }) => {
    // US-1.3 AC: EXACTLY "No tasks yet. Add one above!" when list is empty
    await expect(page.locator("#task-list")).toContainText("No tasks yet. Add one above!");
  });

  test("SC2 – Empty state disappears once a task is added", async ({ page }) => {
    await page.fill("#task-input", "Test task");
    await page.click("#add-btn");
    await expect(page.locator("#task-list")).not.toContainText("No tasks yet. Add one above!");
  });

  // ─── F2: Mark Task Complete ───────────────────────────────────────────────────

  test("SC3 – Clicking checkbox marks task complete with strikethrough styling", async ({ page }) => {
    // US-2.1 AC: checkbox toggles completed; re-renders; styling updates
    await page.fill("#task-input", "Complete me");
    await page.click("#add-btn");

    const taskItem = page.locator("#task-list .task-item").first();
    const checkbox = taskItem.locator(".task-toggle");
    await checkbox.click();

    // task-item should have class 'completed'
    await expect(taskItem).toHaveClass(/completed/);
    // Task text should have strikethrough (via CSS class) — verify class applied
    await expect(taskItem.locator(".task-text")).toBeVisible();
  });

  test("SC3 – Unchecking a completed task reverts to normal (bidirectional toggle)", async ({ page }) => {
    // US-2.2 + US-2.3 AC: toggle works in both directions
    await page.fill("#task-input", "Toggle me");
    await page.click("#add-btn");

    const taskItem = page.locator("#task-list .task-item").first();
    const checkbox = taskItem.locator(".task-toggle");

    // Complete
    await checkbox.click();
    await expect(taskItem).toHaveClass(/completed/);

    // Revert
    await checkbox.click();
    await expect(taskItem).not.toHaveClass(/completed/);
  });

  // ─── F3: Delete Task ──────────────────────────────────────────────────────────

  test("SC4 – Clicking delete removes task immediately", async ({ page }) => {
    // US-3.1 + US-3.2 AC: single click deletes; no confirmation
    await page.fill("#task-input", "Delete me");
    await page.click("#add-btn");

    await expect(page.locator("#task-list .task-item")).toHaveCount(1);

    await page.locator("#task-list .task-item").first().locator(".task-delete").click();
    await expect(page.locator("#task-list .task-item")).toHaveCount(0);
  });

  test("SC4 – Deleting last task shows empty state message", async ({ page }) => {
    // US-3.3 AC: deleting last task shows exactly "No tasks yet. Add one above!"
    await page.fill("#task-input", "Only task");
    await page.click("#add-btn");

    await page.locator("#task-list .task-item").first().locator(".task-delete").click();
    await expect(page.locator("#task-list")).toContainText("No tasks yet. Add one above!");
  });

  // ─── SC5: Empty submission rejected ─────────────────────────────────────────
  // Already covered by US-0.3 tests above

  // ─── Integration: Full loop ───────────────────────────────────────────────────

  test("Full loop: add two tasks, complete one, delete the other", async ({ page }) => {
    // Combined acceptance test for the entire Phase 1 capture-and-completion loop
    await page.fill("#task-input", "First");
    await page.click("#add-btn");
    await page.fill("#task-input", "Second");
    await page.click("#add-btn");

    // Second should be at top
    await expect(page.locator("#task-list .task-item").nth(0).locator(".task-text")).toHaveText("Second");

    // Complete "Second"
    await page.locator("#task-list .task-item").nth(0).locator(".task-toggle").click();
    await expect(page.locator("#task-list .task-item").nth(0)).toHaveClass(/completed/);

    // Delete "First" (now at index 1)
    await page.locator("#task-list .task-item").nth(1).locator(".task-delete").click();
    await expect(page.locator("#task-list .task-item")).toHaveCount(1);
    await expect(page.locator("#task-list .task-item").nth(0).locator(".task-text")).toHaveText("Second");
  });

});
