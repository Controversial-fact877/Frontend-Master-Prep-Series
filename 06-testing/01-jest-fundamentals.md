# Jest Testing Fundamentals

> **Master Jest testing framework - test structure, matchers, mocking, and best practices**

---

## Question 1: What is Jest and how do you write basic tests?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain Jest testing framework. What are describe blocks, test cases, and matchers?

### Answer

Jest is a JavaScript testing framework built by Facebook. It provides test runners, assertions, mocking, and code coverage.

1. **Basic Structure**
   - `describe()` - groups related tests
   - `test()` or `it()` - individual test cases
   - `expect()` - assertions with matchers

2. **Common Matchers**
   - `toBe()` - strict equality (===)
   - `toEqual()` - deep equality for objects/arrays
   - `toBeNull()`, `toBeUndefined()`, `toBeTruthy()`, `toBeFalsy()`

3. **Setup and Teardown**
   - `beforeEach()` - runs before each test
   - `afterEach()` - runs after each test
   - `beforeAll()`, `afterAll()` - once per suite

### Code Example

```javascript
// functions.js
export function add(a, b) {
  return a + b;
}

export function fetchUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// functions.test.js
import { add, fetchUser } from './functions';

describe('Math functions', () => {
  test('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  test('handles decimals', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});

describe('Array operations', () => {
  test('checks array equality', () => {
    const arr = [1, 2, 3];
    expect(arr).toEqual([1, 2, 3]); // Deep equality
    expect(arr).not.toBe([1, 2, 3]); // Different reference
  });

  test('checks array contents', () => {
    expect([1, 2, 3]).toContain(2);
    expect([1, 2, 3]).toHaveLength(3);
  });
});

describe('Object assertions', () => {
  test('checks object properties', () => {
    const user = { name: 'John', age: 30 };

    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('name', 'John');
    expect(user).toMatchObject({ name: 'John' });
  });
});

describe('Setup and teardown', () => {
  let data;

  beforeEach(() => {
    data = { count: 0 };
  });

  afterEach(() => {
    data = null;
  });

  test('increments count', () => {
    data.count++;
    expect(data.count).toBe(1);
  });

  test('starts fresh', () => {
    expect(data.count).toBe(0); // beforeEach reset it
  });
});

// Async testing
describe('Async operations', () => {
  test('fetches user data', async () => {
    const user = await fetchUser(1);
    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('name');
  });

  test('handles promises', () => {
    return fetchUser(1).then(user => {
      expect(user.id).toBe(1);
    });
  });
});

// Testing errors
describe('Error handling', () => {
  test('throws on invalid input', () => {
    expect(() => {
      throw new Error('Invalid');
    }).toThrow('Invalid');
  });

  test('rejects promise', async () => {
    await expect(
      fetchUser(-1)
    ).rejects.toThrow('User not found');
  });
});
```

### Common Mistakes

❌ **Mistake:** Forgetting to return/await promises
```javascript
test('bad async test', () => {
  fetchUser(1).then(user => {
    expect(user.id).toBe(1); // Never runs!
  });
});
```

✅ **Correct:** Use async/await or return
```javascript
test('good async test', async () => {
  const user = await fetchUser(1);
  expect(user.id).toBe(1);
});
```

### Resources

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Jest Matchers](https://jestjs.io/docs/expect)

---

## Question 2: How do you mock functions and modules in Jest?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain mocking in Jest. How do you mock functions, modules, and API calls?

### Answer

Mocking replaces real implementations with test doubles to isolate code under test.

1. **Mock Functions**
   - `jest.fn()` - creates mock function
   - Track calls, arguments, return values
   - Control implementation

2. **Mock Modules**
   - `jest.mock()` - mocks entire module
   - `jest.spyOn()` - spies on specific methods
   - Useful for external dependencies

3. **Why Mock**
   - Isolate unit being tested
   - Avoid external dependencies (DB, API)
   - Control test environment
   - Speed up tests

### Code Example

```javascript
// Mock functions
describe('Mock functions', () => {
  test('tracks calls', () => {
    const mockFn = jest.fn();

    mockFn('arg1', 'arg2');
    mockFn('arg3');

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(mockFn).toHaveBeenLastCalledWith('arg3');
  });

  test('returns values', () => {
    const mockFn = jest.fn()
      .mockReturnValue('default')
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second');

    expect(mockFn()).toBe('first');
    expect(mockFn()).toBe('second');
    expect(mockFn()).toBe('default');
  });

  test('implements custom logic', () => {
    const mockFn = jest.fn(x => x * 2);
    expect(mockFn(5)).toBe(10);
  });
});

// Mock modules
jest.mock('./api');
import { fetchUser } from './api';

test('mocks API call', async () => {
  fetchUser.mockResolvedValue({ id: 1, name: 'John' });

  const user = await fetchUser(1);
  expect(user.name).toBe('John');
  expect(fetchUser).toHaveBeenCalledWith(1);
});

// Spy on methods
import * as utils from './utils';

test('spies on method', () => {
  const spy = jest.spyOn(utils, 'formatDate');
  spy.mockReturnValue('2025-01-01');

  const result = utils.formatDate(new Date());
  expect(result).toBe('2025-01-01');
  expect(spy).toHaveBeenCalled();

  spy.mockRestore(); // Restore original
});

// Mock timers
jest.useFakeTimers();

test('advances time', () => {
  const callback = jest.fn();
  setTimeout(callback, 1000);

  expect(callback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalled();
});
```

### Resources

- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
- [Jest Mock Modules](https://jestjs.io/docs/mock-modules)

---

[← Back to Testing README](./README.md)

**Progress:** 2 of 6 testing questions
