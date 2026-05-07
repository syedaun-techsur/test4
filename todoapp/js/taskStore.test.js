import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  hydrateFromStorage,
  getTasks,
  addTask,
  toggleTaskComplete,
  deleteTask,
  ValidationError,
  TaskNotFoundError,
} from './taskStore.js';

// Reset store state before each test
beforeEach(() => {
  hydrateFromStorage();
});

// ─── addTask ────────────────────────────────────────────────────────────────

describe('addTask', () => {
  it('returns a Task with text, completed=false, non-empty id and ISO createdAt', () => {
    const task = addTask('Buy groceries');
    assert.equal(task.text, 'Buy groceries');
    assert.equal(task.completed, false);
    assert.ok(task.id && task.id.length > 0, 'id should be non-empty');
    assert.ok(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(task.createdAt),
      'createdAt should be ISO 8601 string'
    );
  });

  it('trims leading/trailing whitespace from text', () => {
    const task = addTask('  Buy groceries  ');
    assert.equal(task.text, 'Buy groceries');
  });

  it('throws ValidationError with code EMPTY_TASK_TEXT for empty string', () => {
    assert.throws(
      () => addTask(''),
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.equal(err.code, 'EMPTY_TASK_TEXT');
        assert.equal(err.message, 'Task description cannot be empty.');
        return true;
      }
    );
  });

  it('throws ValidationError with code EMPTY_TASK_TEXT for whitespace-only string', () => {
    assert.throws(
      () => addTask('   '),
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.equal(err.code, 'EMPTY_TASK_TEXT');
        return true;
      }
    );
  });

  it('throws ValidationError with code TASK_TEXT_TOO_LONG for text > 500 chars', () => {
    const longText = 'a'.repeat(501);
    assert.throws(
      () => addTask(longText),
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.equal(err.code, 'TASK_TEXT_TOO_LONG');
        assert.equal(err.message, 'Task description must be 500 characters or fewer.');
        return true;
      }
    );
  });

  it('accepts text of exactly 500 chars (boundary test)', () => {
    const text500 = 'a'.repeat(500);
    const task = addTask(text500);
    assert.equal(task.text, text500);
  });

  it('newest task appears at index 0 after two addTask calls', () => {
    addTask('First task');
    addTask('Second task');
    const tasks = getTasks();
    assert.equal(tasks[0].text, 'Second task');
    assert.equal(tasks[1].text, 'First task');
  });
});

// ─── getTasks ────────────────────────────────────────────────────────────────

describe('getTasks', () => {
  it('returns empty array when no tasks added', () => {
    const tasks = getTasks();
    assert.deepEqual(tasks, []);
  });

  it('returns a shallow copy (mutating result does not affect store)', () => {
    addTask('Test task');
    const tasks = getTasks();
    tasks.push({ id: 'fake', text: 'injected', completed: false, createdAt: '' });
    assert.equal(getTasks().length, 1, 'Store should still have only 1 task');
  });
});

// ─── toggleTaskComplete ──────────────────────────────────────────────────────

describe('toggleTaskComplete', () => {
  it('flips completed from false to true', () => {
    const task = addTask('Toggle me');
    const updated = toggleTaskComplete(task.id);
    assert.equal(updated.completed, true);
  });

  it('flips completed from true back to false (bidirectional)', () => {
    const task = addTask('Toggle me');
    toggleTaskComplete(task.id);
    const updated = toggleTaskComplete(task.id);
    assert.equal(updated.completed, false);
  });

  it('throws TaskNotFoundError for unknown id', () => {
    assert.throws(
      () => toggleTaskComplete('non-existent-id'),
      (err) => {
        assert.ok(err instanceof TaskNotFoundError);
        assert.equal(err.code, 'TASK_NOT_FOUND');
        return true;
      }
    );
  });

  it('only changes completed field; id, text, createdAt remain unchanged', () => {
    const task = addTask('Stable task');
    const updated = toggleTaskComplete(task.id);
    assert.equal(updated.id, task.id);
    assert.equal(updated.text, task.text);
    assert.equal(updated.createdAt, task.createdAt);
    assert.equal(updated.completed, true);
  });
});

// ─── deleteTask ──────────────────────────────────────────────────────────────

describe('deleteTask', () => {
  it('removes task from getTasks()', () => {
    const task = addTask('Delete me');
    deleteTask(task.id);
    const tasks = getTasks();
    assert.ok(!tasks.find(t => t.id === task.id), 'Deleted task should not be in list');
  });

  it('throws TaskNotFoundError for unknown id', () => {
    assert.throws(
      () => deleteTask('non-existent-id'),
      (err) => {
        assert.ok(err instanceof TaskNotFoundError);
        assert.equal(err.code, 'TASK_NOT_FOUND');
        return true;
      }
    );
  });

  it('after deleting all tasks, getTasks() returns []', () => {
    const t1 = addTask('Task 1');
    const t2 = addTask('Task 2');
    deleteTask(t1.id);
    deleteTask(t2.id);
    assert.deepEqual(getTasks(), []);
  });
});

// ─── hydrateFromStorage ──────────────────────────────────────────────────────

describe('hydrateFromStorage', () => {
  it('does not throw', () => {
    assert.doesNotThrow(() => hydrateFromStorage());
  });

  it('after call, getTasks() returns []', () => {
    addTask('Something');
    hydrateFromStorage();
    assert.deepEqual(getTasks(), []);
  });
});

// ─── Phase 1 constraint: no localStorage writes ──────────────────────────────

describe('Phase 1 constraint: no localStorage writes', () => {
  it('addTask does not call localStorage.setItem', () => {
    let called = false;
    const original = globalThis.localStorage;
    globalThis.localStorage = {
      setItem: () => { called = true; },
      getItem: () => null,
      removeItem: () => {},
      clear: () => {},
    };
    try {
      addTask('Constrained task');
    } finally {
      if (original !== undefined) {
        globalThis.localStorage = original;
      } else {
        delete globalThis.localStorage;
      }
    }
    assert.equal(called, false, 'addTask must not call localStorage.setItem in Phase 1');
  });

  it('toggleTaskComplete does not call localStorage.setItem', () => {
    const task = addTask('Toggle constrained');
    let called = false;
    const original = globalThis.localStorage;
    globalThis.localStorage = {
      setItem: () => { called = true; },
      getItem: () => null,
      removeItem: () => {},
      clear: () => {},
    };
    try {
      toggleTaskComplete(task.id);
    } finally {
      if (original !== undefined) {
        globalThis.localStorage = original;
      } else {
        delete globalThis.localStorage;
      }
    }
    assert.equal(called, false, 'toggleTaskComplete must not call localStorage.setItem in Phase 1');
  });

  it('deleteTask does not call localStorage.setItem', () => {
    const task = addTask('Delete constrained');
    let called = false;
    const original = globalThis.localStorage;
    globalThis.localStorage = {
      setItem: () => { called = true; },
      getItem: () => null,
      removeItem: () => {},
      clear: () => {},
    };
    try {
      deleteTask(task.id);
    } finally {
      if (original !== undefined) {
        globalThis.localStorage = original;
      } else {
        delete globalThis.localStorage;
      }
    }
    assert.equal(called, false, 'deleteTask must not call localStorage.setItem in Phase 1');
  });
});
