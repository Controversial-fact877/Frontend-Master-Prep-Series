# Promises & Error Handling

> **Focus**: JavaScript fundamentals and advanced concepts

---

## Question 1: How do Promises work in JavaScript? Explain promise chaining and error handling

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8-12 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Apple

### Question
What are Promises in JavaScript? How do you create them, chain them, and handle errors? What are the three states of a Promise?

### Answer

**Promise Basics:**
- A Promise is an **object representing eventual completion or failure** of an async operation
- Created with `new Promise((resolve, reject) => { })` constructor
- Returns a promise object immediately, settles (resolves/rejects) later

**Three States:**
1. **Pending:** Initial state, neither fulfilled nor rejected
2. **Fulfilled:** Operation completed successfully (resolved with value)
3. **Rejected:** Operation failed (rejected with reason/error)

**Important characteristics:**
- A promise can only settle **once** (immutable result)
- **Cannot change** from fulfilled to rejected or vice versa
- Promises are **not cancellable** once started
- Handlers (.then/.catch) always execute asynchronously (microtasks)

**Promise Chaining:**
- `.then()` returns a **new promise**, enabling chaining
- Each `.then()` can **transform** the value for the next handler
- Errors **propagate down** the chain until caught
- Return value from `.then()` becomes the resolved value for next `.then()`

### Code Example

```javascript
// ============================================
// Example 1: Creating a basic Promise
// ============================================
const promise = new Promise((resolve, reject) => {
  // Async operation
  const success = true;

  setTimeout(() => {
    if (success) {
      resolve('Operation successful!'); // Fulfills promise
    } else {
      reject(new Error('Operation failed!')); // Rejects promise
    }
  }, 1000);
});

promise
  .then(result => {
    console.log(result); // "Operation successful!"
  })
  .catch(error => {
    console.error(error.message);
  });


// ============================================
// Example 2: Promise states
// ============================================
const pendingPromise = new Promise((resolve) => {
  setTimeout(() => resolve('done'), 1000);
});

console.log(pendingPromise); // Promise { <pending> }

setTimeout(() => {
  console.log(pendingPromise); // Promise { 'done' }
}, 1500);

// Once settled, state never changes
const fulfilledPromise = Promise.resolve('value');
console.log(fulfilledPromise); // Promise { 'value' }

const rejectedPromise = Promise.reject(new Error('error'));
console.log(rejectedPromise); // Promise { <rejected> Error: error }


// ============================================
// Example 3: Promise chaining
// ============================================
fetch('/api/user/1')
  .then(response => {
    console.log('Got response');
    return response.json(); // Returns new promise
  })
  .then(user => {
    console.log('Parsed user:', user.name);
    return fetch(`/api/posts/${user.id}`); // Returns new promise
  })
  .then(response => {
    return response.json();
  })
  .then(posts => {
    console.log('User posts:', posts);
  })
  .catch(error => {
    console.error('Error anywhere in chain:', error);
  });


// ============================================
// Example 4: Transforming values in chain
// ============================================
Promise.resolve(5)
  .then(num => {
    console.log(num); // 5
    return num * 2; // Pass 10 to next .then()
  })
  .then(num => {
    console.log(num); // 10
    return num + 3; // Pass 13 to next .then()
  })
  .then(num => {
    console.log(num); // 13
    return `Result: ${num}`;
  })
  .then(result => {
    console.log(result); // "Result: 13"
  });


// ============================================
// Example 5: Error handling patterns
// ============================================

// Pattern 1: Single catch at the end
Promise.resolve()
  .then(() => {
    throw new Error('Error in step 1');
  })
  .then(() => {
    console.log('This will not execute');
  })
  .catch(error => {
    console.error('Caught:', error.message); // Catches error from any .then()
  });

// Pattern 2: Multiple catch blocks
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch(error => {
    console.error('Caught error 1:', error.message);
    return 'recovered'; // Chain continues
  })
  .then(value => {
    console.log('Continuing with:', value); // "recovered"
    throw new Error('Error 2');
  })
  .catch(error => {
    console.error('Caught error 2:', error.message);
  });

// Pattern 3: finally (always executes)
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    console.log('Data:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
    console.log('Cleanup always runs'); // Runs regardless of success/failure
  });


// ============================================
// Example 6: Common Promise patterns
// ============================================

// Promisifying callback-based functions
function readFilePromise(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Delay utility
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000).then(() => console.log('1 second later'));

// Timeout wrapper
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });

  return Promise.race([promise, timeout]);
}

withTimeout(fetch('/api/data'), 5000)
  .then(response => console.log('Completed in time'))
  .catch(error => console.error('Timed out or failed'));


// ============================================
// Example 7: Returning promises vs values
// ============================================

// Returning a value
Promise.resolve(1)
  .then(num => {
    return num + 1; // Returns value
  })
  .then(num => {
    console.log(num); // 2
  });

// Returning a promise
Promise.resolve(1)
  .then(num => {
    return Promise.resolve(num + 1); // Returns promise
  })
  .then(num => {
    console.log(num); // 2 (unwrapped automatically)
  });

// Returning nothing (undefined)
Promise.resolve(1)
  .then(num => {
    console.log(num); // 1
    // No return statement
  })
  .then(num => {
    console.log(num); // undefined
  });


// ============================================
// Example 8: Error propagation
// ============================================
Promise.resolve()
  .then(() => {
    return fetch('/api/user'); // Might fail
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`); // Explicit throw
    }
    return response.json();
  })
  .then(user => {
    console.log('User:', user);
  })
  .catch(error => {
    // Catches network errors, parse errors, and thrown errors
    console.error('Failed to load user:', error.message);
  });


// ============================================
// Example 9: Promise constructor patterns
// ============================================

// Async operation wrapper
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    // Simulating API call
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: 'John' });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}

fetchUserData(1)
  .then(user => console.log('User:', user))
  .catch(error => console.error('Error:', error.message));

// Validation wrapper
function validateAndFetch(url) {
  return new Promise((resolve, reject) => {
    if (!url || typeof url !== 'string') {
      reject(new Error('Invalid URL'));
      return; // Important: exit after reject
    }

    fetch(url)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}


// ============================================
// Example 10: Anti-patterns to avoid
// ============================================

// ❌ Anti-pattern 1: Nesting promises (promise hell)
fetch('/api/user')
  .then(response => {
    return response.json().then(user => {
      return fetch(`/api/posts/${user.id}`).then(response => {
        return response.json().then(posts => {
          console.log(posts); // Deeply nested
        });
      });
    });
  });

// ✅ Correct: Flat promise chain
fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(response => response.json())
  .then(posts => console.log(posts));

// ❌ Anti-pattern 2: Not returning promises
fetch('/api/user')
  .then(response => {
    response.json(); // Missing return!
  })
  .then(user => {
    console.log(user); // undefined!
  });

// ✅ Correct: Always return
fetch('/api/user')
  .then(response => response.json()) // Returns promise
  .then(user => console.log(user)); // Gets user object

// ❌ Anti-pattern 3: Uncaught rejections
const promise = Promise.reject(new Error('Failed'));
// No .catch() handler - unhandled rejection warning

// ✅ Correct: Always handle rejections
Promise.reject(new Error('Failed'))
  .catch(error => console.error('Handled:', error.message));


// ============================================
// Example 11: Advanced chaining scenarios
// ============================================

// Conditional chaining
function loadUserAndMaybePosts(userId, includePosts = false) {
  return fetch(`/api/user/${userId}`)
    .then(response => response.json())
    .then(user => {
      if (includePosts) {
        return fetch(`/api/posts/${userId}`)
          .then(response => response.json())
          .then(posts => ({ ...user, posts })); // Merge user and posts
      }
      return user; // Return user only
    });
}

// Parallel operations within chain
fetch('/api/user/1')
  .then(response => response.json())
  .then(user => {
    // Start multiple operations in parallel
    return Promise.all([
      fetch(`/api/posts/${user.id}`).then(r => r.json()),
      fetch(`/api/comments/${user.id}`).then(r => r.json()),
      fetch(`/api/likes/${user.id}`).then(r => r.json())
    ]).then(([posts, comments, likes]) => {
      return { user, posts, comments, likes };
    });
  })
  .then(data => {
    console.log('All data loaded:', data);
  });


// ============================================
// Example 12: Real-world usage patterns
// ============================================

// API client with error handling
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  request(endpoint, options = {}) {
    return fetch(`${this.baseURL}${endpoint}`, options)
      .then(response => {
        if (!response.ok) {
          return response.json()
            .then(error => {
              throw new Error(error.message || 'Request failed');
            })
            .catch(() => {
              throw new Error(`HTTP ${response.status}`);
            });
        }
        return response.json();
      })
      .catch(error => {
        console.error('API request failed:', error);
        throw error; // Re-throw for caller to handle
      });
  }

  getUser(id) {
    return this.request(`/users/${id}`);
  }

  updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}

const api = new APIClient('https://api.example.com');

api.getUser(123)
  .then(user => {
    console.log('User loaded:', user);
    return api.updateUser(123, { name: 'Updated' });
  })
  .then(updatedUser => {
    console.log('User updated:', updatedUser);
  })
  .catch(error => {
    console.error('Operation failed:', error.message);
  });


// ============================================
// Example 13: Promise static methods
// ============================================

// Promise.resolve() - immediately resolved
const resolved = Promise.resolve('value');
resolved.then(v => console.log(v)); // 'value'

// Promise.reject() - immediately rejected
const rejected = Promise.reject(new Error('error'));
rejected.catch(e => console.error(e.message)); // 'error'

// Wrapping non-promise values
Promise.resolve(42).then(v => console.log(v)); // 42
Promise.resolve(Promise.resolve(42)).then(v => console.log(v)); // 42 (flattened)
```

### Common Mistakes

- ❌ **Mistake:** Forgetting to return promises in chain
  ```javascript
  fetch('/api/user')
    .then(response => {
      response.json(); // Missing return!
    })
    .then(user => {
      console.log(user); // undefined
    });
  ```

- ❌ **Mistake:** Creating promise hell with nesting
  ```javascript
  fetch('/api/user').then(r1 => {
    r1.json().then(user => {
      fetch('/api/posts').then(r2 => {
        r2.json().then(posts => {
          // Too nested!
        });
      });
    });
  });
  ```

- ❌ **Mistake:** Not handling rejections
  ```javascript
  const promise = fetch('/api/data').then(r => r.json());
  // No .catch() - unhandled rejection if fetch fails
  ```

- ✅ **Correct:** Proper chaining and error handling
  ```javascript
  fetch('/api/user')
    .then(response => response.json()) // Return promise
    .then(user => fetch(`/api/posts/${user.id}`)) // Return promise
    .then(response => response.json()) // Return promise
    .then(posts => console.log(posts))
    .catch(error => console.error(error)); // Handle all errors
  ```

<details>
<summary><strong>🔍 Deep Dive: V8 Promise Implementation</strong></summary>

**Internal Architecture:**

Promises in V8 are implemented as **PromiseCapability** objects with internal slots:

```cpp
// Simplified V8 internal representation
class JSPromise {
  PromiseState state_;        // pending, fulfilled, rejected
  JSAny result_;              // value or reason
  PromiseReaction* reactions_; // list of .then() handlers
  bool has_handler_;           // for unhandled rejection tracking
};

enum PromiseState {
  kPending,    // 0
  kFulfilled,  // 1
  kRejected    // 2
};
```

**Promise State Machine:**

```javascript
// When you create a promise, V8 allocates a PromiseCapability

const promise = new Promise((resolve, reject) => {
  // V8 creates:
  // - PromiseCapability { [[Promise]], [[Resolve]], [[Reject]] }
  // - [[Promise]]: The promise object
  // - [[Resolve]]: Internal resolve function
  // - [[Reject]]: Internal reject function

  setTimeout(() => {
    resolve('value'); // Calls internal [[Resolve]]
  }, 1000);
});

// Internal state transitions (irreversible):
// pending → fulfilled (with value)
// pending → rejected (with reason)
// Cannot transition from fulfilled/rejected to any other state
```

**Promise Chaining Mechanism:**

```javascript
// Every .then() creates a new promise

const p1 = Promise.resolve(1);

const p2 = p1.then(value => {
  return value * 2;
});

// Internally, V8:
// 1. Creates new promise (p2)
// 2. Registers reaction on p1
// 3. When p1 fulfills, reaction fires
// 4. Reaction result fulfills p2

// V8 uses PromiseReaction objects:
class PromiseReaction {
  PromiseCapability capability;  // The new promise
  JobCallback handler;           // The .then() callback
  PromiseReaction* next;         // Linked list
};
```

**Microtask Queue Integration:**

```javascript
// Promises use the microtask queue (higher priority than timers)

console.log('1: Sync');

Promise.resolve().then(() => {
  console.log('2: Microtask');
});

setTimeout(() => {
  console.log('3: Macrotask');
}, 0);

console.log('4: Sync');

// V8 execution:
// 1. Execute sync code: "1: Sync", "4: Sync"
// 2. Call stack empty → check microtask queue
// 3. Execute microtask: "2: Microtask"
// 4. Microtask queue empty → check macrotask queue
// 5. Execute macrotask: "3: Macrotask"
```

**Promise Resolution Procedure:**

```javascript
// V8 follows spec's Promise Resolution Procedure

// Case 1: Resolve with value
Promise.resolve(42)
  .then(v => console.log(v)); // 42

// Case 2: Resolve with promise (flattening)
Promise.resolve(Promise.resolve(42))
  .then(v => console.log(v)); // 42 (not Promise)

// Internally, V8 unwraps nested promises:
function resolvePromise(promise, value) {
  if (value === promise) {
    // TypeError: Cannot resolve promise with itself
    rejectPromise(promise, new TypeError('Chaining cycle'));
  } else if (value instanceof Promise) {
    // Unwrap: adopt the state of the inner promise
    value.then(
      (v) => resolvePromise(promise, v),
      (r) => rejectPromise(promise, r)
    );
  } else {
    // Regular value: fulfill immediately
    fulfillPromise(promise, value);
  }
}
```

**Memory Layout:**

```javascript
// Promise memory structure in V8

const promise = new Promise((resolve) => {
  setTimeout(() => resolve('value'), 1000);
});

// Heap allocation:
// ┌─────────────────────────┐
// │ JSPromise               │
// │  state: kPending        │ ← 4 bytes
// │  result: undefined      │ ← pointer (8 bytes on 64-bit)
// │  reactions: [...]       │ ← pointer to linked list
// │  has_handler: false     │ ← 1 byte
// └─────────────────────────┘
// Total: ~32 bytes (+ reactions list)

// After resolution:
// ┌─────────────────────────┐
// │ JSPromise               │
// │  state: kFulfilled      │
// │  result: 'value'        │ ← now points to string
// │  reactions: null        │ ← cleared after settlement
// │  has_handler: true      │
// └─────────────────────────┘

// Reactions are garbage collected after promise settles
```

**Performance Characteristics:**

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Create promise | O(1) | Allocates PromiseCapability |
| Add .then() handler | O(1) | Appends to reactions list |
| Resolve promise | O(n) | Where n = number of handlers |
| Chain promises | O(1) | Creates new promise |
| Promise.resolve() | O(1) | Immediate if not thenable |

**Optimization - Promise Inlining:**

```javascript
// V8 can optimize simple promise chains via TurboFan

// Unoptimized (generic promise handling):
function fetchUser(id) {
  return fetch(`/api/user/${id}`)
    .then(r => r.json());
}

// After warming up (10+ calls), TurboFan:
// 1. Inlines the .then() callback
// 2. Eliminates intermediate promise allocations
// 3. Direct jump to callback when promise resolves
// → 30-50% faster execution

// Benchmark:
console.time('cold');
for (let i = 0; i < 10; i++) {
  await fetchUser(i);
}
console.timeEnd('cold'); // ~150ms

console.time('hot');
for (let i = 0; i < 10; i++) {
  await fetchUser(i);
}
console.timeEnd('hot'); // ~100ms (optimized!)
```

**Error Handling Internals:**

```javascript
// V8 tracks unhandled rejections

const promise = Promise.reject(new Error('Failed'));
// No .catch() handler!

// V8's behavior:
// 1. Promise transitions to rejected state
// 2. Check: has_handler === false
// 3. Add to unhandled rejection list
// 4. On next microtask checkpoint:
//    - Trigger 'unhandledrejection' event
//    - Console warning in development
//    - Crash in strict mode (Node.js --unhandled-rejections=strict)

// Later, if you add a handler:
promise.catch(err => console.error(err));
// V8 removes from unhandled list
// Triggers 'rejectionhandled' event
```

**Thenable Support:**

```javascript
// V8 recognizes "thenable" objects (duck typing)

const thenable = {
  then(onFulfilled, onRejected) {
    setTimeout(() => onFulfilled('value'), 1000);
  }
};

// V8 treats this as promise-like:
Promise.resolve(thenable)
  .then(value => console.log(value)); // 'value'

// Internally, V8 calls the .then() method
// and waits for it to call onFulfilled/onRejected
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Promise Chain Memory Leak</strong></summary>

**Scenario**: Your single-page application (SPA) becomes slower over time, memory usage grows continuously, and after 30 minutes of use, the browser tab crashes with "Out of Memory" error.

**The Problem:**

```javascript
// ❌ MEMORY LEAK: Promises holding references

class DataService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  async fetchUser(userId) {
    // Check cache first
    if (this.cache.has(userId)) {
      return this.cache.get(userId);
    }

    // Check if request is already in progress
    if (this.pendingRequests.has(userId)) {
      return this.pendingRequests.get(userId);
    }

    // Create new request
    const promise = fetch(`/api/user/${userId}`)
      .then(response => response.json())
      .then(user => {
        this.cache.set(userId, user);
        this.pendingRequests.delete(userId); // ⚠️ Deletes AFTER promise resolves
        return user;
      })
      .catch(error => {
        console.error(`Failed to fetch user ${userId}:`, error);
        this.pendingRequests.delete(userId);
        throw error;
      });

    // Store pending promise
    this.pendingRequests.set(userId, promise);
    return promise;
  }

  clearCache() {
    this.cache.clear();
    // ❌ BUG: Forgot to clear pendingRequests!
    // Promises keep references to old data
  }
}

// Usage in SPA (router changes every 5 seconds):
const service = new DataService();

setInterval(() => {
  // Load 100 users on each page
  const userIds = Array.from({length: 100}, (_, i) => i);

  userIds.forEach(id => {
    service.fetchUser(id)
      .then(user => displayUser(user))
      .catch(err => showError(err));
  });

  // Clear cache after page load
  setTimeout(() => {
    service.clearCache(); // Doesn't clear pendingRequests!
  }, 1000);
}, 5000);

// Result after 30 minutes:
// - 360 page loads × 100 users = 36,000 user fetches
// - Many failed requests stay in pendingRequests Map
// - Each promise holds closure over response data
// - Memory grows: 0MB → 500MB → 1GB → CRASH
```

**Debugging Steps:**

1. **Take heap snapshots in Chrome DevTools**:
   ```javascript
   // Before page load
   // Memory: 50MB

   // After 10 minutes
   // Memory: 300MB (should be ~50MB)

   // Heap snapshot comparison shows:
   // - 10,000+ Promise objects retained
   // - 10,000+ pending fetch responses
   // - Closure scopes holding large objects
   ```

2. **Identify memory growth**:
   ```javascript
   console.log('Cache size:', service.cache.size);
   // 100 (as expected - cleared regularly)

   console.log('Pending requests:', service.pendingRequests.size);
   // 5,234 (PROBLEM! Should be ~0)

   // Failed requests never get deleted from pendingRequests
   ```

3. **Analyze promise chain**:
   ```javascript
   // Chrome DevTools → Memory → Heap Snapshot
   // Search for "Promise"
   // Find retained promises with closure scopes
   // Holding references to old DOM nodes, data, event listeners
   ```

**Solution 1: Proper cleanup**

```javascript
// ✅ FIX: Clean up properly

class DataService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.abortControllers = new Map(); // NEW: Track abort controllers
  }

  async fetchUser(userId) {
    if (this.cache.has(userId)) {
      return this.cache.get(userId);
    }

    if (this.pendingRequests.has(userId)) {
      return this.pendingRequests.get(userId);
    }

    // Create abort controller
    const controller = new AbortController();
    this.abortControllers.set(userId, controller);

    const promise = fetch(`/api/user/${userId}`, {
      signal: controller.signal
    })
      .then(response => response.json())
      .then(user => {
        this.cache.set(userId, user);
        return user;
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.log(`Request for user ${userId} was aborted`);
          return null;
        }
        console.error(`Failed to fetch user ${userId}:`, error);
        throw error;
      })
      .finally(() => {
        // CRITICAL: Always clean up
        this.pendingRequests.delete(userId);
        this.abortControllers.delete(userId);
      });

    this.pendingRequests.set(userId, promise);
    return promise;
  }

  clearCache() {
    this.cache.clear();

    // Abort all pending requests
    for (const [userId, controller] of this.abortControllers) {
      controller.abort();
    }

    this.pendingRequests.clear();
    this.abortControllers.clear();
  }

  destroy() {
    // Call on component unmount
    this.clearCache();
    this.cache = null;
    this.pendingRequests = null;
    this.abortControllers = null;
  }
}
```

**Solution 2: WeakMap for automatic cleanup**

```javascript
// ✅ BETTER: Use WeakMap for automatic garbage collection

class DataService {
  constructor() {
    // WeakMap allows garbage collection of unused keys
    this.cache = new WeakMap();
    this.pendingRequests = new Map(); // Still need Map for iteration
    this.requestTimeouts = new Map();
    this.MAX_PENDING_TIME = 30000; // 30 seconds
  }

  async fetchUser(userKey, userId) {
    // userKey is an object (for WeakMap)
    // userId is the actual ID to fetch

    if (this.cache.has(userKey)) {
      return this.cache.get(userKey);
    }

    if (this.pendingRequests.has(userId)) {
      return this.pendingRequests.get(userId);
    }

    const promise = fetch(`/api/user/${userId}`)
      .then(response => response.json())
      .then(user => {
        this.cache.set(userKey, user); // WeakMap
        return user;
      })
      .finally(() => {
        this.pendingRequests.delete(userId);
        clearTimeout(this.requestTimeouts.get(userId));
        this.requestTimeouts.delete(userId);
      });

    this.pendingRequests.set(userId, promise);

    // Auto-cleanup after timeout
    const timeoutId = setTimeout(() => {
      this.pendingRequests.delete(userId);
      this.requestTimeouts.delete(userId);
      console.warn(`Cleaned up stale request for user ${userId}`);
    }, this.MAX_PENDING_TIME);

    this.requestTimeouts.set(userId, timeoutId);

    return promise;
  }
}

// Usage with WeakMap:
const userKeys = {}; // Create object keys
const service = new DataService();

// When userKey goes out of scope, WeakMap entry is garbage collected
let userKey = { id: 1 };
service.fetchUser(userKey, 1);

userKey = null; // Cache entry can now be GC'd
```

**Solution 3: LRU Cache with size limit**

```javascript
// ✅ BEST: Implement LRU cache with automatic eviction

class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first entry)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

class DataService {
  constructor() {
    this.cache = new LRUCache(100); // Max 100 cached users
    this.pendingRequests = new Map();

    // Periodic cleanup of old pending requests
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [userId, data] of this.pendingRequests) {
        if (now - data.timestamp > 30000) {
          this.pendingRequests.delete(userId);
          console.log(`Cleaned up stale request for user ${userId}`);
        }
      }
    }, 60000); // Every minute
  }

  async fetchUser(userId) {
    const cached = this.cache.get(userId);
    if (cached) return cached;

    if (this.pendingRequests.has(userId)) {
      return this.pendingRequests.get(userId).promise;
    }

    const timestamp = Date.now();
    const promise = fetch(`/api/user/${userId}`)
      .then(response => response.json())
      .then(user => {
        this.cache.set(userId, user);
        return user;
      })
      .finally(() => {
        this.pendingRequests.delete(userId);
      });

    this.pendingRequests.set(userId, { promise, timestamp });
    return promise;
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
    this.pendingRequests.clear();
  }
}
```

**Performance Comparison:**

| Approach | Memory (30 min) | Request Speed | Cleanup Complexity |
|----------|----------------|---------------|-------------------|
| **Original (leak)** | 1GB+ (crash) | Fast | None |
| **Manual cleanup** | 50-80MB | Fast | High |
| **WeakMap** | 60-90MB | Fast | Medium |
| **LRU Cache** | 40-60MB | Fast | Low (automatic) |

**Production Metrics After Fix:**

```javascript
// Before (Memory leak):
// - Memory after 30 min: 1GB+
// - Pending requests: 10,000+
// - Browser crashes
// - User complaints: "Page becomes slow and freezes"

// After (LRU Cache):
// - Memory after 30 min: 50MB (stable)
// - Pending requests: <10 (healthy)
// - No crashes
// - Cache hit rate: 85%
// - User satisfaction: "Fast and smooth"
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Promise Patterns</strong></summary>

**1. Promise Creation: new Promise() vs Promise.resolve()**

```javascript
// Pattern 1: new Promise() - Full control
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('success');
    } else {
      reject(new Error('failed'));
    }
  }, 1000);
});

// Pattern 2: Promise.resolve() - Immediate resolution
const promise2 = Promise.resolve('success');

// Pattern 3: Async function - Cleaner syntax
async function createPromise() {
  await delay(1000);
  if (Math.random() > 0.5) {
    return 'success';
  }
  throw new Error('failed');
}
```

| Approach | Use When | Pros | Cons |
|----------|----------|------|------|
| **new Promise()** | Wrapping callbacks, complex logic | Full control, explicit | Verbose, easy to forget reject |
| **Promise.resolve()** | Wrapping known values | Fast, simple | Limited use cases |
| **async/await** | Modern code, readability | Clean syntax, try-catch works | Requires function wrapper |

**2. Error Handling: .catch() vs try-catch**

```javascript
// Pattern 1: .catch() at end of chain
fetch('/api/data')
  .then(r => r.json())
  .then(data => processData(data))
  .then(result => saveResult(result))
  .catch(error => {
    console.error('Error anywhere in chain:', error);
  });

// Pattern 2: Multiple .catch() blocks
fetch('/api/data')
  .then(r => r.json())
  .catch(parseError => {
    console.error('Parse failed, using default');
    return { default: true };
  })
  .then(data => processData(data))
  .catch(processError => {
    console.error('Process failed');
    throw processError;
  });

// Pattern 3: try-catch with async/await
async function loadData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    const result = await processData(data);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Pattern 4: try-catch per operation
async function loadDataDetailed() {
  let response;
  try {
    response = await fetch('/api/data');
  } catch (fetchError) {
    console.error('Fetch failed:', fetchError);
    throw new Error('Network error');
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error('Parse failed:', parseError);
    throw new Error('Invalid JSON');
  }

  return data;
}
```

| Approach | Granularity | Readability | Error Detail | Use Case |
|----------|-------------|-------------|--------------|----------|
| **.catch() at end** | Coarse | Good | Low | Simple chains |
| **Multiple .catch()** | Fine | Medium | High | Recovery logic |
| **Single try-catch** | Coarse | Excellent | Low | Clean code |
| **Multiple try-catch** | Fine | Good | High | Detailed errors |

**3. Promise Chaining vs Promise.all()**

```javascript
// Scenario: Load user data + posts + comments

// Pattern 1: Sequential (slow)
async function loadSequential(userId) {
  console.time('sequential');

  const user = await fetchUser(userId);      // 300ms
  const posts = await fetchPosts(userId);    // 300ms
  const comments = await fetchComments(userId); // 300ms

  console.timeEnd('sequential'); // ~900ms total
  return { user, posts, comments };
}

// Pattern 2: Parallel (fast)
async function loadParallel(userId) {
  console.time('parallel');

  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchComments(userId)
  ]);

  console.timeEnd('parallel'); // ~300ms total (3x faster!)
  return { user, posts, comments };
}

// Pattern 3: Dependent sequential
async function loadDependent(userId) {
  console.time('dependent');

  const user = await fetchUser(userId);        // 300ms

  // These depend on user data, must wait
  const [posts, comments] = await Promise.all([
    fetchPosts(user.id),                       // 300ms (parallel)
    fetchComments(user.id)
  ]);

  console.timeEnd('dependent'); // ~600ms total
  return { user, posts, comments };
}
```

**Performance Impact:**

| Pattern | Time | Network Usage | Complexity | Use When |
|---------|------|---------------|------------|----------|
| **Sequential** | 900ms | 1 request at a time | Low | Dependencies exist |
| **Parallel** | 300ms | 3 concurrent requests | Low | Independent data |
| **Mixed** | 600ms | Optimized | Medium | Partial dependencies |

**4. Memory Trade-offs:**

```javascript
// Pattern 1: Store all promises (high memory)
const promises = [];
for (let i = 0; i < 10000; i++) {
  promises.push(fetchData(i));
}
await Promise.all(promises);
// Memory: 10,000 promises × ~100 bytes = ~1MB

// Pattern 2: Process in batches (lower memory)
for (let i = 0; i < 10000; i += 100) {
  const batch = Array.from({length: 100}, (_, j) => i + j);
  const promises = batch.map(id => fetchData(id));
  await Promise.all(promises);
}
// Memory: 100 promises × ~100 bytes = ~10KB per batch

// Pattern 3: Sequential (lowest memory, slowest)
for (let i = 0; i < 10000; i++) {
  await fetchData(i);
}
// Memory: 1 promise × ~100 bytes = ~100 bytes
```

| Approach | Time | Peak Memory | Throughput | Server Load |
|----------|------|-------------|------------|-------------|
| **All at once** | Fast (~1s) | High (1MB) | High | Spike (10k concurrent) |
| **Batched** | Medium (~10s) | Low (10KB) | Medium | Steady (100 concurrent) |
| **Sequential** | Slow (~50s) | Lowest (100B) | Low | Minimal (1 at a time) |

**5. Error Recovery Strategies:**

```javascript
// Strategy 1: Fail fast (Promise.all)
try {
  await Promise.all([fetch1(), fetch2(), fetch3()]);
} catch (error) {
  // If ANY fails, entire operation fails
  // Use when: All data is critical
}

// Strategy 2: Partial success (Promise.allSettled)
const results = await Promise.allSettled([fetch1(), fetch2(), fetch3()]);
const successful = results.filter(r => r.status === 'fulfilled');
// Use when: Some data is acceptable

// Strategy 3: Retry on failure
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
}
// Use when: Transient failures expected

// Strategy 4: Fallback sources
async function fetchWithFallback(urls) {
  for (const url of urls) {
    try {
      return await fetch(url);
    } catch (error) {
      console.log(`${url} failed, trying next...`);
    }
  }
  throw new Error('All sources failed');
}
// Use when: Multiple data sources available
```

**Decision Matrix:**

| Requirement | Choose | Why |
|-------------|--------|-----|
| **All must succeed** | Promise.all + fail fast | Simplest, clearest intent |
| **Some can fail** | Promise.allSettled | Partial data acceptable |
| **Fastest result** | Promise.race | Timeout or fallback |
| **Any success** | Promise.any | Multiple sources |
| **Dependencies** | Sequential await | Order matters |
| **Independent** | Promise.all parallel | Maximize speed |
| **Many requests** | Batched | Control concurrency |

</details>

<details>
<summary><strong>💬 Explain to Junior: Promises Explained</strong></summary>

**Simple Analogy: Restaurant Order**

Imagine you're at a restaurant:

**Synchronous (Blocking):**
- You order food
- You **stand at the counter waiting** until it's ready
- You can't do anything else
- When food arrives, you eat
- **Total time**: 30 minutes of standing

**Asynchronous (Promise):**
- You order food → Get a **receipt with order number** (Promise)
- You go sit down (continue with life)
- When food is ready, they call your number (Promise resolves)
- You go get your food
- **Total time**: 2 minutes waiting at counter + 28 minutes doing other things

```javascript
// Synchronous (blocking)
function orderFoodSync() {
  const food = waitForFood(); // Blocks for 30 minutes!
  eat(food);
}

// Asynchronous (Promise)
function orderFoodAsync() {
  const receipt = orderFood(); // Returns immediately

  receipt.then(food => {
    // Called when food is ready
    eat(food);
  });

  // Can do other things while waiting!
  checkPhone();
  chatWithFriends();
}
```

**Promise States = Order Status**

```javascript
// 1. PENDING: Order is being prepared
const order = new Promise((resolve) => {
  setTimeout(() => resolve('🍕 Pizza'), 1000);
});
console.log(order); // Promise { <pending> }

// 2. FULFILLED: Order is ready!
setTimeout(() => {
  console.log(order); // Promise { '🍕 Pizza' }
}, 1500);

// 3. REJECTED: Kitchen ran out of ingredients
const failedOrder = new Promise((resolve, reject) => {
  reject(new Error('Out of pizza dough'));
});
console.log(failedOrder); // Promise { <rejected> Error }
```

**Promise Chaining = Multi-step Order**

```javascript
// Step 1: Order pizza
// Step 2: Wait for pizza
// Step 3: Get drinks
// Step 4: Find table
// Step 5: Eat!

orderPizza()
  .then(pizza => {
    console.log('Got pizza!');
    return getDrinks(); // Next step
  })
  .then(drinks => {
    console.log('Got drinks!');
    return findTable(); // Next step
  })
  .then(table => {
    console.log('Found table!');
    return 'Ready to eat!';
  })
  .then(status => {
    console.log(status);
  })
  .catch(error => {
    console.error('Something went wrong:', error);
  });

// vs Callback hell (nested):
orderPizza((pizza) => {
  getDrinks((drinks) => {
    findTable((table) => {
      console.log('Ready to eat!'); // Deeply nested!
    });
  });
});
```

**Explaining to PM:**

"Promises are like tracking numbers for packages:

1. **Order package** (create promise)
   - You get a tracking number immediately
   - You can check status anytime
   - You can tell others the tracking number

2. **Package in transit** (pending)
   - You're not stuck waiting at door
   - You do other things
   - Check status occasionally

3. **Package delivered** (fulfilled)
   - Notification arrives
   - You get your package
   - Happy!

4. **Package lost** (rejected)
   - Notification of problem
   - You handle it (refund, reorder)
   - Not happy, but you know what happened

**Why it matters:**
- Users can keep browsing while we load data
- App doesn't freeze
- Better user experience
- We can handle errors gracefully"

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Not returning promises
fetch('/api/user')
  .then(response => {
    response.json(); // MISSING return!
  })
  .then(user => {
    console.log(user); // undefined! ❌
  });

// ✅ CORRECT: Always return
fetch('/api/user')
  .then(response => response.json()) // return!
  .then(user => console.log(user)); // Works! ✅


// ❌ MISTAKE 2: Nesting promises (callback hell 2.0)
fetch('/api/user').then(response => {
  response.json().then(user => {
    fetch('/api/posts').then(response => {
      response.json().then(posts => {
        // Nested mess! ❌
      });
    });
  });
});

// ✅ CORRECT: Flat chain
fetch('/api/user')
  .then(r => r.json())
  .then(user => fetch('/api/posts'))
  .then(r => r.json())
  .then(posts => console.log(posts)); // Clean! ✅


// ❌ MISTAKE 3: Forgetting error handling
fetch('/api/data')
  .then(r => r.json())
  .then(data => console.log(data));
// No .catch() - error goes unhandled! ❌

// ✅ CORRECT: Always catch errors
fetch('/api/data')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(error => {
    console.error('Failed:', error);
    showErrorMessage('Could not load data');
  }); // Handled! ✅
```

**Visual Execution Order:**

```javascript
console.log('1: Start');

Promise.resolve()
  .then(() => console.log('2: Promise'));

console.log('3: End');

// Output:
// 1: Start
// 3: End
// 2: Promise

// Why?
// 1. Synchronous code runs first (1, 3)
// 2. Promises go to microtask queue
// 3. After synchronous code, microtasks run (2)
```

**Practice Exercise:**

```javascript
// Guess the output:

console.log('A');

Promise.resolve()
  .then(() => {
    console.log('B');
    return Promise.resolve();
  })
  .then(() => console.log('C'));

setTimeout(() => console.log('D'), 0);

console.log('E');

// Answer: A, E, B, C, D

// Why?
// A, E: Synchronous (run immediately)
// B, C: Microtasks (Promise callbacks)
// D: Macrotask (setTimeout) - runs last
```

**Key Takeaways for Juniors:**

1. **Promises are objects** representing future values
2. **Three states**: pending → fulfilled or rejected
3. **Always return** in .then() to chain
4. **Always catch** errors with .catch()
5. **Don't nest** - keep chains flat
6. **Microtasks run before macrotasks** (Promises before setTimeout)

**When to Use What:**

```javascript
// ✅ Use Promise when:
// - Working with APIs (fetch)
// - Any async operation
// - Need to handle success/failure

// ✅ Use async/await when:
// - Writing new code (cleaner syntax)
// - Multiple async operations
// - Need try-catch for errors

// ❌ Don't use callbacks when:
// - Promises are available (avoid callback hell)
// - You control the API (use Promises instead)
```

</details>

### Follow-up Questions

- "What is the difference between Promise.all and Promise.allSettled?"
- "How would you implement a retry mechanism for failed promises?"
- "Can you cancel a promise? If not, how would you work around it?"
- "What is promise resolve thenable, and how does it work?"
- "How do you handle promise memory leaks in long-running applications?"

### Resources

- [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [JavaScript.info: Promises](https://javascript.info/promise-basics)
- [JavaScript.info: Promise chaining](https://javascript.info/promise-chaining)
- [You Don't Know JS: Async & Performance](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20&%20performance/ch3.md)

---

## Question 2: Explain Promise.all, Promise.race, Promise.allSettled, and Promise.any

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-12 minutes
**Companies:** Google, Meta, Amazon, Apple, Netflix

### Question
What are the differences between Promise.all, Promise.race, Promise.allSettled, and Promise.any? When would you use each one? What happens when promises reject?

### Answer

**Promise.all(promises):**
- Waits for **all** promises to fulfill
- Returns **array of results** in same order as input
- **Fails fast**: Rejects immediately if ANY promise rejects
- Use when: All operations must succeed

**Promise.race(promises):**
- Returns **first settled** promise (fulfilled or rejected)
- Ignores remaining promises (they still run, but results ignored)
- Use when: Only need fastest result, timeout implementations

**Promise.allSettled(promises):**
- Waits for **all** promises to settle (fulfill OR reject)
- **Never rejects** - always fulfills with array of results
- Each result has `{status, value}` or `{status, reason}`
- Use when: Need results from all, regardless of success/failure

**Promise.any(promises):**
- Returns **first fulfilled** promise
- Ignores rejections until all promises reject
- Rejects only if ALL promises reject (AggregateError)
- Use when: Need any successful result, fallback scenarios

### Code Example

```javascript
// ============================================
// Example 1: Promise.all - all must succeed
// ============================================

// All succeed
Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(results => {
  console.log(results); // [1, 2, 3]
});

// One fails - entire operation fails
Promise.all([
  Promise.resolve(1),
  Promise.reject(new Error('Failed')),
  Promise.resolve(3)
])
.then(results => {
  console.log('Success:', results); // Never executes
})
.catch(error => {
  console.error('Failed:', error.message); // "Failed"
  // Note: We don't know about result 1 or 3
});

// Real-world example: Loading multiple resources
async function loadPageData() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetch('/api/user/1').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/comments').then(r => r.json())
    ]);

    console.log('All data loaded:', { user, posts, comments });
    return { user, posts, comments };
  } catch (error) {
    console.error('Failed to load page data:', error);
    // Can't render page if any resource fails
    throw error;
  }
}


// ============================================
// Example 2: Promise.race - first to settle wins
// ============================================

// First to resolve
Promise.race([
  new Promise(resolve => setTimeout(() => resolve('slow'), 2000)),
  new Promise(resolve => setTimeout(() => resolve('fast'), 100))
]).then(result => {
  console.log(result); // "fast"
});

// First to reject
Promise.race([
  new Promise((_, reject) => setTimeout(() => reject('error'), 100)),
  new Promise(resolve => setTimeout(() => resolve('success'), 200))
])
.then(result => {
  console.log(result); // Never executes
})
.catch(error => {
  console.error(error); // "error"
});

// Timeout implementation
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

fetchWithTimeout('/api/data', 3000)
  .then(response => response.json())
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error or timeout:', error.message));

// First successful API (primary/fallback)
Promise.race([
  fetch('https://api-primary.com/data'),
  fetch('https://api-backup.com/data')
])
.then(response => response.json())
.then(data => console.log('Got data from fastest server:', data));


// ============================================
// Example 3: Promise.allSettled - all results matter
// ============================================

Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error('Failed')),
  Promise.resolve(3),
  Promise.reject(new Error('Also failed'))
]).then(results => {
  console.log(results);
  /* [
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: Error: Failed },
    { status: 'fulfilled', value: 3 },
    { status: 'rejected', reason: Error: Also failed }
  ] */

  // Process results
  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  console.log('Successful:', successful); // [1, 3]
  console.log('Failed:', failed.length); // 2
});

// Real-world: Load multiple users (some may not exist)
async function loadUsers(ids) {
  const results = await Promise.allSettled(
    ids.map(id =>
      fetch(`/api/user/${id}`)
        .then(r => {
          if (!r.ok) throw new Error(`User ${id} not found`);
          return r.json();
        })
    )
  );

  const users = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason.message);

  console.log(`Loaded ${users.length} users, ${errors.length} failed`);

  return { users, errors };
}

loadUsers([1, 2, 999, 3, 888]).then(result => {
  console.log('Result:', result);
  // { users: [user1, user2, user3], errors: ['User 999...', 'User 888...'] }
});


// ============================================
// Example 4: Promise.any - first success wins
// ============================================

// First to fulfill
Promise.any([
  Promise.reject(new Error('Error 1')),
  new Promise(resolve => setTimeout(() => resolve('Success!'), 100)),
  Promise.reject(new Error('Error 2'))
]).then(result => {
  console.log(result); // "Success!"
});

// All rejected - AggregateError
Promise.any([
  Promise.reject(new Error('Error 1')),
  Promise.reject(new Error('Error 2')),
  Promise.reject(new Error('Error 3'))
])
.then(result => {
  console.log(result); // Never executes
})
.catch(error => {
  console.error(error); // AggregateError
  console.error(error.errors); // [Error: Error 1, Error: Error 2, Error: Error 3]
});

// Real-world: Multiple image CDNs
async function loadImageFromCDN(imagePath) {
  const cdnUrls = [
    `https://cdn1.example.com/${imagePath}`,
    `https://cdn2.example.com/${imagePath}`,
    `https://cdn3.example.com/${imagePath}`
  ];

  try {
    const response = await Promise.any(
      cdnUrls.map(url => fetch(url))
    );

    if (!response.ok) {
      throw new Error('Image not found on any CDN');
    }

    return await response.blob();
  } catch (error) {
    console.error('All CDNs failed:', error);
    throw error;
  }
}


// ============================================
// Example 5: Comparison of all four methods
// ============================================
const promises = [
  new Promise(resolve => setTimeout(() => resolve('A'), 1000)),
  new Promise((_, reject) => setTimeout(() => reject('B error'), 500)),
  new Promise(resolve => setTimeout(() => resolve('C'), 1500))
];

// Promise.all - fails fast
Promise.all(promises)
  .then(r => console.log('all:', r))
  .catch(e => console.log('all error:', e)); // "all error: B error"

// Promise.race - first to settle
Promise.race(promises)
  .then(r => console.log('race:', r))
  .catch(e => console.log('race error:', e)); // "race error: B error" (first to settle)

// Promise.allSettled - all results
Promise.allSettled(promises)
  .then(r => console.log('allSettled:', r));
  // All three results with status

// Promise.any - first success
Promise.any(promises)
  .then(r => console.log('any:', r)) // "any: A" (first success)
  .catch(e => console.log('any error:', e));


// ============================================
// Example 6: Timing and performance
// ============================================

// Promise.all - waits for slowest
console.time('all');
Promise.all([
  delay(100),
  delay(200),
  delay(300)
]).then(() => {
  console.timeEnd('all'); // ~300ms (slowest)
});

// Promise.race - waits for fastest
console.time('race');
Promise.race([
  delay(100),
  delay(200),
  delay(300)
]).then(() => {
  console.timeEnd('race'); // ~100ms (fastest)
});

// Promise.allSettled - waits for slowest (like .all)
console.time('allSettled');
Promise.allSettled([
  delay(100),
  delay(200),
  delay(300)
]).then(() => {
  console.timeEnd('allSettled'); // ~300ms (slowest)
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ============================================
// Example 7: Practical use cases
// ============================================

// Use case 1: Parallel validation (all must pass)
async function validateForm(formData) {
  try {
    await Promise.all([
      validateEmail(formData.email),
      validatePassword(formData.password),
      validateUsername(formData.username)
    ]);

    console.log('All validations passed');
    return true;
  } catch (error) {
    console.error('Validation failed:', error.message);
    return false;
  }
}

// Use case 2: Competitive requests (fastest wins)
async function getCurrencyRate(from, to) {
  const apis = [
    fetch(`https://api1.com/rate/${from}/${to}`),
    fetch(`https://api2.com/rate/${from}/${to}`),
    fetch(`https://api3.com/rate/${from}/${to}`)
  ];

  try {
    const response = await Promise.race(apis);
    return await response.json();
  } catch (error) {
    console.error('All APIs too slow or failed');
    throw error;
  }
}

// Use case 3: Partial success acceptable
async function sendNotifications(users, message) {
  const results = await Promise.allSettled(
    users.map(user => sendEmail(user.email, message))
  );

  const sent = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`Sent: ${sent}, Failed: ${failed}`);

  return {
    sent,
    failed,
    details: results
  };
}

// Use case 4: Fallback servers (any success)
async function fetchFromMirrors(path) {
  const mirrors = [
    fetch(`https://mirror1.com/${path}`),
    fetch(`https://mirror2.com/${path}`),
    fetch(`https://mirror3.com/${path}`)
  ];

  try {
    const response = await Promise.any(mirrors);
    return await response.json();
  } catch (error) {
    console.error('All mirrors failed:', error.errors);
    throw new Error('Resource unavailable from all mirrors');
  }
}


// ============================================
// Example 8: Custom implementations
// ============================================

// Implementing Promise.all manually
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;

          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject); // Fail fast
    });
  });
}

// Implementing Promise.allSettled manually
function promiseAllSettled(promises) {
  return Promise.all(
    promises.map(promise =>
      Promise.resolve(promise)
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
    )
  );
}


// ============================================
// Example 9: Error handling patterns
// ============================================

// With Promise.all
async function loadAllOrNone() {
  try {
    const data = await Promise.all([
      fetchData1(),
      fetchData2(),
      fetchData3()
    ]);
    return data;
  } catch (error) {
    console.error('Operation failed, no partial results');
    throw error;
  }
}

// With Promise.allSettled
async function loadAllWithPartial() {
  const results = await Promise.allSettled([
    fetchData1(),
    fetchData2(),
    fetchData3()
  ]);

  const data = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  if (data.length === 0) {
    throw new Error('All requests failed');
  }

  return data; // Return whatever succeeded
}

// With Promise.any
async function loadFirstSuccess() {
  try {
    const data = await Promise.any([
      fetchData1(),
      fetchData2(),
      fetchData3()
    ]);
    return data;
  } catch (error) {
    console.error('All sources failed:', error.errors);
    throw new Error('No data available from any source');
  }
}


// ============================================
// Example 10: Advanced patterns
// ============================================

// Batch processing with concurrency limit
async function processBatchesWithLimit(items, batchSize, processor) {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    // Process batch in parallel
    const batchResults = await Promise.allSettled(
      batch.map(item => processor(item))
    );

    results.push(...batchResults);

    console.log(`Processed batch ${i / batchSize + 1}`);
  }

  return results;
}

// Retry with fallbacks
async function fetchWithFallbacks(urls, maxRetries = 3) {
  for (const url of urls) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.log(`${url} attempt ${attempt} failed`);

        if (attempt === maxRetries) {
          console.log(`${url} exhausted, trying next URL`);
        }
      }
    }
  }

  throw new Error('All URLs and retries exhausted');
}

// First N successes
async function getFirstNSuccesses(promises, n) {
  const results = [];

  for (const promise of promises) {
    try {
      const result = await promise;
      results.push(result);

      if (results.length === n) {
        return results;
      }
    } catch (error) {
      // Continue to next promise
      console.log('Promise failed, trying next');
    }
  }

  if (results.length < n) {
    throw new Error(`Only got ${results.length} successes, needed ${n}`);
  }

  return results;
}
```

### Common Mistakes

- ❌ **Mistake:** Using Promise.all when partial success is acceptable
  ```javascript
  // Fails if any request fails
  const data = await Promise.all([
    fetchOptionalData1(), // Might not exist
    fetchOptionalData2(),
    fetchOptionalData3()
  ]);
  // Should use Promise.allSettled instead
  ```

- ❌ **Mistake:** Thinking Promise.race cancels other promises
  ```javascript
  Promise.race([
    longRunningTask(),
    timeout(1000)
  ]);
  // longRunningTask() continues running even after timeout wins!
  ```

- ❌ **Mistake:** Not handling AggregateError from Promise.any
  ```javascript
  Promise.any([...promises])
    .catch(error => {
      console.log(error.message); // Not enough info
      // Should check error.errors array
    });
  ```

- ✅ **Correct:** Choose the right method for your use case
  ```javascript
  // All must succeed
  await Promise.all(criticalRequests);

  // Get all results regardless
  await Promise.allSettled(nonCriticalRequests);

  // Need any one success
  await Promise.any(fallbackSources);

  // Need fastest result
  await Promise.race([primary, backup]);
  ```

<details>
<summary><strong>🔍 Deep Dive: Promise Combinator Internals</strong></summary>

**V8 Implementation of Promise.all:**

```javascript
// Simplified V8 internal algorithm for Promise.all
Promise.all = function(iterable) {
  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);
    const results = new Array(promises.length);
    let remainingCount = promises.length;

    // Edge case: empty array
    if (remainingCount === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      // Wrap in Promise.resolve to handle non-promise values
      Promise.resolve(promise).then(
        (value) => {
          results[index] = value; // Preserve order
          remainingCount--;

          if (remainingCount === 0) {
            resolve(results); // All succeeded
          }
        },
        (reason) => {
          reject(reason); // FAIL FAST - reject immediately
        }
      );
    });
  });
};

// Key characteristics:
// 1. Creates ONE result promise
// 2. Tracks completion count
// 3. Rejects on FIRST failure (fail-fast)
// 4. Preserves order (results[index])
// 5. Handles non-promise values via Promise.resolve
```

**V8 Implementation of Promise.race:**

```javascript
// Simplified V8 internal algorithm for Promise.race
Promise.race = function(iterable) {
  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);

    // Edge case: empty array (never settles)
    if (promises.length === 0) {
      return; // Promise stays pending forever
    }

    promises.forEach((promise) => {
      Promise.resolve(promise).then(
        (value) => resolve(value),   // First to resolve wins
        (reason) => reject(reason)   // First to reject wins
      );
    });
  });
};

// Key characteristics:
// 1. First settled promise wins (fulfilled OR rejected)
// 2. Other promises are NOT cancelled (still run)
// 3. Empty array = pending forever
// 4. No order preservation (first is first)
```

**V8 Implementation of Promise.allSettled:**

```javascript
// Simplified V8 internal algorithm for Promise.allSettled
Promise.allSettled = function(iterable) {
  return new Promise((resolve) => { // Note: NEVER rejects
    const promises = Array.from(iterable);
    const results = new Array(promises.length);
    let remainingCount = promises.length;

    if (remainingCount === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          results[index] = {
            status: 'fulfilled',
            value: value
          };
          remainingCount--;
          if (remainingCount === 0) resolve(results);
        },
        (reason) => {
          results[index] = {
            status: 'rejected',
            reason: reason
          };
          remainingCount--;
          if (remainingCount === 0) resolve(results);
        }
      );
    });
  });
};

// Key characteristics:
// 1. NEVER rejects (always resolves)
// 2. Waits for ALL promises to settle
// 3. Each result has status + value/reason
// 4. Preserves order
// 5. Useful for partial success scenarios
```

**V8 Implementation of Promise.any:**

```javascript
// Simplified V8 internal algorithm for Promise.any
Promise.any = function(iterable) {
  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);
    const errors = [];
    let rejectionCount = 0;

    if (promises.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          resolve(value); // First success wins
        },
        (reason) => {
          errors[index] = reason;
          rejectionCount++;

          if (rejectionCount === promises.length) {
            // All rejected - aggregate errors
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
};

// Key characteristics:
// 1. First fulfilled promise wins
// 2. Ignores rejections until ALL reject
// 3. Rejects with AggregateError (contains all errors)
// 4. Empty array = immediate AggregateError
```

**Memory Usage Comparison:**

```javascript
// Scenario: 1,000 promises, each 1KB result

// Promise.all
// - 1 result promise
// - 1 results array (1,000 elements)
// - Temporary: 1,000 promise wrappers
// Memory: ~1MB results + ~50KB overhead = ~1.05MB

// Promise.race
// - 1 result promise
// - No results array
// - Temporary: 1,000 promise wrappers
// - Winner's result stored
// Memory: ~1KB result + ~50KB overhead = ~51KB (20x less!)

// Promise.allSettled
// - 1 result promise
// - 1 results array with status objects (2x size)
// Memory: ~2MB results + ~50KB overhead = ~2.05MB (2x Promise.all)

// Promise.any
// - 1 result promise
// - 1 errors array (if all fail)
// - Winner's result stored
// Memory: ~1KB result (success) OR ~1MB errors (all fail) + ~50KB overhead
```

**Microtask Queue Behavior:**

```javascript
// How combinators interact with microtask queue

console.log('1: Sync start');

Promise.all([
  Promise.resolve('A'),
  Promise.resolve('B'),
  Promise.resolve('C')
]).then(results => {
  console.log('3: Promise.all resolved:', results);
});

console.log('2: Sync end');

// Execution order:
// 1: Sync start
// 2: Sync end
// 3: Promise.all resolved: ['A', 'B', 'C']

// Why?
// 1. Synchronous code runs first (1, 2)
// 2. Promise.all schedules microtask
// 3. After call stack empty, microtask runs (3)

// With mixed async/sync:
Promise.all([
  Promise.resolve('instant'),
  new Promise(resolve => setTimeout(() => resolve('delayed'), 100))
]).then(results => {
  console.log('All done:', results);
});
// Waits for slowest promise before resolving
```

**Performance Optimizations in V8:**

```javascript
// V8 optimizations for promise combinators

// 1. Fast path for already-resolved promises
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

// V8 can optimize this to synchronous-like execution
// No setTimeout delays, minimal overhead
Promise.all(promises).then(r => console.log(r));
// Runs in ~0.01ms instead of ~1ms

// 2. TurboFan optimization after warmup
async function heavyLoop() {
  for (let i = 0; i < 1000; i++) {
    await Promise.all([
      fetchData(i),
      fetchData(i + 1)
    ]);
  }
}

// First 100 iterations: ~10ms each (interpreter)
// After warmup: ~3ms each (TurboFan optimized)
// 3x faster!

// 3. Hidden classes for result objects
// Promise.allSettled creates many {status, value/reason} objects
// V8 optimizes with hidden classes (shapes)
const results = await Promise.allSettled(promises);
// All result objects share same hidden class
// Faster property access: 30% improvement
```

**Internal State Tracking:**

```cpp
// V8 internal state for Promise.all
class PromiseAllResolveElementContext {
  int remaining_elements_;           // Count of pending promises
  JSArray* values_;                  // Result array
  bool is_rejected_;                 // Fast path: already rejected?
  PromiseCapability* capability_;    // The outer promise
  int index_;                        // Position in array
};

// When promise at index 3 resolves:
// 1. values_[3] = resolved_value
// 2. remaining_elements_--
// 3. if (remaining_elements_ == 0) resolve(capability_)

// When any promise rejects:
// 1. if (!is_rejected_) { is_rejected_ = true; reject(capability_) }
// 2. Other promises still run (no cancellation)
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Promise.all Failure in Production</strong></summary>

**Scenario:** Your e-commerce checkout page has a 15% failure rate, causing significant revenue loss. Users report "checkout failed" errors even when their payment succeeds.

**The Problem:**

```javascript
// ❌ PROBLEM: Using Promise.all for mixed critical/optional data
class CheckoutService {
  async processOrder(cart, user) {
    try {
      // Loading ALL data in parallel
      const [
        inventory,       // CRITICAL
        userProfile,     // CRITICAL
        paymentMethods,  // CRITICAL
        shippingOptions, // CRITICAL
        taxInfo,         // OPTIONAL (can estimate)
        promoCode        // OPTIONAL (can skip)
      ] = await Promise.all([
        this.checkInventory(cart.items),        // 98% success
        this.getUserProfile(user.id),           // 99% success
        this.getPaymentMethods(user.id),        // 98% success
        this.getShippingOptions(cart.total),    // 99% success
        this.getTaxInfo(cart.items),            // 85% success (3rd party)
        this.validatePromoCode(cart.promoCode)  // 90% success (can fail)
      ]);

      // If ANY fails, entire checkout fails
      return this.createOrder({
        inventory,
        userProfile,
        paymentMethods,
        shippingOptions,
        taxInfo,
        promoCode
      });
    } catch (error) {
      // Generic error - user has no idea what failed
      throw new Error('Unable to process order. Please try again.');
    }
  }
}

// Production metrics (7-day average):
// - Total checkout attempts: 10,000
// - Successful checkouts: 8,500 (85%)
// - Failed checkouts: 1,500 (15%)
// - Revenue impact: $50,000/month in abandoned carts
// - User frustration: High (support tickets +300%)

// Failure breakdown:
// - taxInfo fails: 800 failures (8% of attempts)
// - promoCode fails: 500 failures (5% of attempts)
// - Other services: 200 failures (2% of attempts)
```

**Debugging Steps:**

```javascript
// Step 1: Add detailed error logging
class CheckoutService {
  async processOrder(cart, user) {
    const startTime = Date.now();

    try {
      console.log('[Checkout] Starting order processing', {
        userId: user.id,
        cartTotal: cart.total,
        timestamp: new Date().toISOString()
      });

      const [inventory, userProfile, paymentMethods, shippingOptions, taxInfo, promoCode] =
        await Promise.all([
          this.checkInventory(cart.items).catch(err => {
            console.error('[Checkout] Inventory check failed:', err);
            throw err;
          }),
          this.getUserProfile(user.id).catch(err => {
            console.error('[Checkout] User profile failed:', err);
            throw err;
          }),
          this.getPaymentMethods(user.id).catch(err => {
            console.error('[Checkout] Payment methods failed:', err);
            throw err;
          }),
          this.getShippingOptions(cart.total).catch(err => {
            console.error('[Checkout] Shipping options failed:', err);
            throw err;
          }),
          this.getTaxInfo(cart.items).catch(err => {
            console.error('[Checkout] Tax info failed:', err); // Logging reveals this fails often!
            throw err;
          }),
          this.validatePromoCode(cart.promoCode).catch(err => {
            console.error('[Checkout] Promo code failed:', err); // This too!
            throw err;
          })
        ]);

      console.log('[Checkout] All data loaded successfully', {
        duration: Date.now() - startTime
      });

      return this.createOrder({ inventory, userProfile, paymentMethods, shippingOptions, taxInfo, promoCode });
    } catch (error) {
      console.error('[Checkout] Order processing failed:', {
        error: error.message,
        userId: user.id,
        duration: Date.now() - startTime
      });
      throw new Error('Unable to process order. Please try again.');
    }
  }
}

// Logs reveal:
// - 8% failures from taxInfo (3rd party API timeout)
// - 5% failures from promoCode (validation service issues)
// - These are OPTIONAL but blocking checkout!
```

**Solution 1: Separate Critical from Optional (Promise.allSettled)**

```javascript
// ✅ FIX: Use Promise.all for critical, Promise.allSettled for optional
class CheckoutService {
  async processOrder(cart, user) {
    // STEP 1: Load CRITICAL data (must succeed)
    let criticalData;
    try {
      criticalData = await Promise.all([
        this.checkInventory(cart.items),
        this.getUserProfile(user.id),
        this.getPaymentMethods(user.id),
        this.getShippingOptions(cart.total)
      ]);
    } catch (error) {
      console.error('[Checkout] Critical data load failed:', error);
      throw new Error('Unable to load checkout data. Please try again.');
    }

    const [inventory, userProfile, paymentMethods, shippingOptions] = criticalData;

    // STEP 2: Load OPTIONAL data (partial success OK)
    const optionalResults = await Promise.allSettled([
      this.getTaxInfo(cart.items),
      this.validatePromoCode(cart.promoCode)
    ]);

    // Extract optional data with fallbacks
    const taxInfo = optionalResults[0].status === 'fulfilled'
      ? optionalResults[0].value
      : {
          estimated: true,
          rate: 0.08, // Default tax rate
          message: 'Tax rate estimated'
        };

    const promoCode = optionalResults[1].status === 'fulfilled'
      ? optionalResults[1].value
      : null; // No promo code, continue without it

    // Log optional failures for monitoring
    optionalResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        const service = index === 0 ? 'taxInfo' : 'promoCode';
        console.warn(`[Checkout] Optional service ${service} failed:`, result.reason);
      }
    });

    // Create order with available data
    return this.createOrder({
      inventory,
      userProfile,
      paymentMethods,
      shippingOptions,
      taxInfo,
      promoCode,
      metadata: {
        taxEstimated: taxInfo.estimated,
        promoCodeApplied: promoCode !== null
      }
    });
  }
}

// After fix:
// - Success rate: 99% (from 85%)
// - Revenue recovered: $45,000/month
// - Support tickets: -280 (93% reduction)
// - User satisfaction: +40%
```

**Solution 2: Timeout + Fallback Strategy**

```javascript
// ✅ BETTER: Add timeouts and progressive enhancement
class CheckoutService {
  async processOrder(cart, user) {
    // Critical data with aggressive timeout
    const criticalData = await Promise.all([
      this.withTimeout(
        this.checkInventory(cart.items),
        3000,
        'Inventory check timeout'
      ),
      this.withTimeout(
        this.getUserProfile(user.id),
        2000,
        'User profile timeout'
      ),
      this.withTimeout(
        this.getPaymentMethods(user.id),
        3000,
        'Payment methods timeout'
      ),
      this.withTimeout(
        this.getShippingOptions(cart.total),
        2000,
        'Shipping options timeout'
      )
    ]);

    // Optional data with shorter timeout + fallback
    const optionalData = await Promise.allSettled([
      this.withTimeout(
        this.getTaxInfo(cart.items),
        1000, // Shorter timeout (it's optional)
        'Tax info timeout'
      ),
      this.withTimeout(
        this.validatePromoCode(cart.promoCode),
        1000,
        'Promo code timeout'
      )
    ]);

    const [inventory, userProfile, paymentMethods, shippingOptions] = criticalData;

    // Smart fallbacks for optional data
    const taxInfo = this.extractOrFallback(
      optionalData[0],
      () => this.estimateTax(cart.items)
    );

    const promoCode = this.extractOrFallback(
      optionalData[1],
      () => null
    );

    return this.createOrder({
      inventory,
      userProfile,
      paymentMethods,
      shippingOptions,
      taxInfo,
      promoCode
    });
  }

  withTimeout(promise, ms, errorMessage) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(errorMessage)), ms)
      )
    ]);
  }

  extractOrFallback(result, fallbackFn) {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    console.warn('Using fallback due to:', result.reason.message);
    return fallbackFn();
  }

  estimateTax(items) {
    // Quick estimation based on item types
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    return {
      estimated: true,
      amount: totalPrice * 0.08, // Default 8%
      rate: 0.08,
      message: 'Tax rate estimated (actual rate will be calculated on confirmation)'
    };
  }
}

// Performance improvement:
// - Checkout speed: 2.5s avg (from 3.2s)
// - Success rate: 99.2%
// - Timeouts prevent hanging requests
```

**Solution 3: Progressive Enhancement with Retry**

```javascript
// ✅ BEST: Multi-tiered approach with retry
class CheckoutService {
  async processOrder(cart, user) {
    // Tier 1: Critical data (with retry)
    const criticalData = await Promise.all([
      this.retry(() => this.checkInventory(cart.items), 2),
      this.retry(() => this.getUserProfile(user.id), 2),
      this.retry(() => this.getPaymentMethods(user.id), 2),
      this.retry(() => this.getShippingOptions(cart.total), 2)
    ]);

    const [inventory, userProfile, paymentMethods, shippingOptions] = criticalData;

    // Tier 2: Optional data (single attempt, fast timeout)
    const optionalData = await Promise.allSettled([
      this.withTimeout(this.getTaxInfo(cart.items), 1500),
      this.withTimeout(this.validatePromoCode(cart.promoCode), 1000)
    ]);

    // Tier 3: Deferred data (load after order created)
    const deferredData = this.loadDeferredData(user.id);

    const taxInfo = this.extractWithFallback(optionalData[0], () =>
      this.estimateTax(cart.items)
    );

    const promoCode = this.extractWithFallback(optionalData[1], () => null);

    const order = await this.createOrder({
      inventory,
      userProfile,
      paymentMethods,
      shippingOptions,
      taxInfo,
      promoCode
    });

    // Trigger deferred data load (doesn't block order creation)
    deferredData.then(data => {
      this.enhanceOrder(order.id, data);
    });

    return order;
  }

  async retry(fn, maxAttempts, delay = 500) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  async loadDeferredData(userId) {
    // Load recommendations, recently viewed, etc. after checkout
    return Promise.allSettled([
      this.getRecommendations(userId),
      this.getRecentlyViewed(userId),
      this.getSimilarProducts(userId)
    ]);
  }

  extractWithFallback(result, fallbackFn) {
    return result.status === 'fulfilled' ? result.value : fallbackFn();
  }
}

// Final metrics:
// - Success rate: 99.5% (from 85%)
// - Checkout speed: 2.1s (from 3.2s)
// - Revenue recovered: $47,000/month
// - Retry resolves: 3% of requests (transient failures)
```

**Performance Comparison:**

| Approach | Success Rate | Avg Time | Revenue Lost/Month | User Experience |
|----------|-------------|----------|-------------------|-----------------|
| **Original (Promise.all)** | 85% | 3.2s | $50,000 | ❌ Poor |
| **Separated (allSettled)** | 99% | 2.8s | $5,000 | ✅ Good |
| **Timeout + Fallback** | 99.2% | 2.5s | $4,000 | ✅ Good |
| **Progressive + Retry** | 99.5% | 2.1s | $2,500 | ✅✅ Excellent |

**Key Lessons:**

1. **Don't use Promise.all for mixed critical/optional data**
2. **Always add timeouts to prevent hanging requests**
3. **Provide fallbacks for optional services**
4. **Retry transient failures with exponential backoff**
5. **Monitor metrics to identify failure patterns**

</details>

<details>
<summary><strong>⚖️ Trade-offs: Choosing the Right Combinator</strong></summary>

**1. Promise.all vs Promise.allSettled**

```javascript
// Scenario: Loading dashboard widgets

// Promise.all - Fail fast (all-or-nothing)
async function loadDashboardAll() {
  try {
    const [weather, news, stocks, calendar] = await Promise.all([
      fetchWeather(),
      fetchNews(),
      fetchStocks(),
      fetchCalendar()
    ]);

    return { weather, news, stocks, calendar };
  } catch (error) {
    // If ANY widget fails, show error page
    return { error: 'Failed to load dashboard' };
  }
}

// Promise.allSettled - Partial success (graceful degradation)
async function loadDashboardSettled() {
  const results = await Promise.allSettled([
    fetchWeather(),
    fetchNews(),
    fetchStocks(),
    fetchCalendar()
  ]);

  return {
    weather: results[0].status === 'fulfilled' ? results[0].value : null,
    news: results[1].status === 'fulfilled' ? results[1].value : null,
    stocks: results[2].status === 'fulfilled' ? results[2].value : null,
    calendar: results[3].status === 'fulfilled' ? results[3].value : null,
    errors: results.filter(r => r.status === 'rejected').length
  };
  // Show dashboard with available widgets, empty states for failed ones
}
```

**Trade-off Matrix:**

| Requirement | Use Promise.all | Use Promise.allSettled |
|-------------|----------------|----------------------|
| All data required | ✅ Yes | ❌ No |
| Partial data acceptable | ❌ No | ✅ Yes |
| Fast failure needed | ✅ Yes | ❌ No |
| Want all error details | ❌ Limited | ✅ Yes |
| User experience | All-or-nothing | Graceful degradation |
| Network efficiency | Stops early | Always waits for all |

**2. Promise.race vs Promise.any**

```javascript
// Scenario: Loading image from multiple CDNs

// Promise.race - First to settle (success OR failure)
async function loadImageRace(cdns) {
  try {
    const blob = await Promise.race(
      cdns.map(cdn => fetch(`${cdn}/image.jpg`).then(r => r.blob()))
    );
    return blob;
  } catch (error) {
    // If fastest CDN fails, entire operation fails
    throw error;
  }
}

// Promise.any - First to fulfill (only success)
async function loadImageAny(cdns) {
  try {
    const blob = await Promise.any(
      cdns.map(cdn => fetch(`${cdn}/image.jpg`).then(r => r.blob()))
    );
    return blob;
  } catch (error) {
    // Only fails if ALL CDNs fail
    throw new AggregateError(error.errors, 'All CDNs failed');
  }
}
```

**Comparison:**

| Combinator | Returns | When | Best For |
|------------|---------|------|----------|
| **Promise.race** | First settled (success/fail) | Fastest wins | Timeout implementation |
| **Promise.any** | First fulfilled | First success | Fallback sources |

**Use Cases:**

```javascript
// ✅ Promise.race: Timeout pattern
const data = await Promise.race([
  fetchData('/api/data'),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
]);
// If timeout wins, request fails (even if it would have succeeded later)

// ✅ Promise.any: Fallback sources
const data = await Promise.any([
  fetchData('https://cdn1.com/data'),
  fetchData('https://cdn2.com/data'),
  fetchData('https://cdn3.com/data')
]);
// Returns first successful response, ignores failures
```

**3. Sequential vs Parallel Execution**

```javascript
// Scenario: Processing 1,000 user uploads

// Sequential (slow but safe)
async function processSequential(uploads) {
  const results = [];
  for (const upload of uploads) {
    results.push(await processUpload(upload));
  }
  return results;
}
// Time: 1,000 uploads × 100ms = 100 seconds
// Memory: 1 upload at a time (~10MB)
// Server load: 1 concurrent request

// Parallel all-at-once (fast but risky)
async function processParallelAll(uploads) {
  return await Promise.all(
    uploads.map(upload => processUpload(upload))
  );
}
// Time: ~100ms (limited by slowest upload)
// Memory: 1,000 uploads at once (~10GB!)
// Server load: 1,000 concurrent requests (may crash server)

// Parallel batched (balanced)
async function processParallelBatched(uploads, batchSize = 50) {
  const results = [];
  for (let i = 0; i < uploads.length; i += batchSize) {
    const batch = uploads.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(upload => processUpload(upload))
    );
    results.push(...batchResults);
  }
  return results;
}
// Time: 1,000 / 50 batches × 100ms = 2 seconds
// Memory: 50 uploads at a time (~500MB)
// Server load: 50 concurrent requests (manageable)
```

**Performance vs Safety Trade-off:**

| Approach | Time | Memory | Server Load | Crash Risk |
|----------|------|--------|-------------|------------|
| **Sequential** | Slowest (100s) | Lowest (10MB) | Lowest (1 req) | None |
| **All-at-once** | Fastest (0.1s) | Highest (10GB) | Highest (1000 req) | High |
| **Batched** | Medium (2s) | Medium (500MB) | Medium (50 req) | Low |

**4. Memory Trade-offs: Storing Promises vs Results**

```javascript
// Pattern 1: Store all promises (higher memory during execution)
const promises = [];
for (let i = 0; i < 10000; i++) {
  promises.push(fetchData(i));
}
const results = await Promise.all(promises);

// Memory during execution:
// - 10,000 pending promises: ~1MB
// - 10,000 results after resolution: ~10MB
// - Peak memory: ~11MB

// Pattern 2: Process in batches (lower peak memory)
const results = [];
for (let i = 0; i < 10000; i += 100) {
  const batch = Array.from({ length: 100 }, (_, j) => i + j);
  const batchResults = await Promise.all(
    batch.map(id => fetchData(id))
  );
  results.push(...batchResults);
}

// Memory during execution:
// - 100 pending promises per batch: ~0.01MB
// - Results accumulate: grows to ~10MB
// - Peak memory: ~10MB (10% less)

// Pattern 3: Stream processing (lowest memory)
async function* processStream(count) {
  for (let i = 0; i < count; i++) {
    yield await fetchData(i);
  }
}

for await (const result of processStream(10000)) {
  handleResult(result); // Process immediately, don't store
}

// Memory during execution:
// - 1 promise at a time: ~0.0001MB
// - No result accumulation: ~0MB
// - Peak memory: ~0.001MB (99.99% less!)
```

**5. Error Recovery Trade-offs**

```javascript
// Strategy 1: Fail fast (Promise.all)
async function loadAllOrFail(urls) {
  return await Promise.all(urls.map(fetch));
}
// ✅ Simple, clear semantics
// ✅ Fast failure (stops early)
// ❌ No partial data
// ❌ Wastes successful requests

// Strategy 2: Load all, filter failures (Promise.allSettled)
async function loadAllFilterFailed(urls) {
  const results = await Promise.allSettled(urls.map(fetch));
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}
// ✅ Partial data available
// ✅ All errors available for debugging
// ❌ Slower (waits for all)
// ❌ More complex code

// Strategy 3: Retry failed (Custom)
async function loadWithRetry(urls, maxRetries = 3) {
  let failed = urls;
  let results = [];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const attemptResults = await Promise.allSettled(
      failed.map(fetch)
    );

    results.push(
      ...attemptResults
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value)
    );

    failed = attemptResults
      .filter(r => r.status === 'rejected')
      .map((_, i) => failed[i]);

    if (failed.length === 0) break;

    await delay(1000 * Math.pow(2, attempt)); // Exponential backoff
  }

  return { results, failed: failed.length };
}
// ✅ Recovers from transient failures
// ✅ Partial data with failure count
// ❌ Much slower
// ❌ Complex implementation
```

**Decision Tree:**

```
Do all operations MUST succeed?
├─ YES → Use Promise.all (fail fast)
└─ NO → Are failures common?
    ├─ YES → Use Promise.allSettled (partial success)
    └─ NO → Can you retry?
        ├─ YES → Custom retry with Promise.all
        └─ NO → Use Promise.allSettled

Do you need the FASTEST result?
├─ YES → Do failures matter?
│   ├─ YES → Use Promise.race (first settled)
│   └─ NO → Use Promise.any (first success)
└─ NO → See above

Are you processing MANY items?
├─ < 100 → Promise.all (all at once)
├─ 100-1000 → Batched Promise.all
└─ > 1000 → Stream processing or batched

Is memory constrained?
├─ YES → Sequential or small batches
└─ NO → Large batches or all-at-once
```

</details>

<details>
<summary><strong>💬 Explain to Junior: Promise Combinators</strong></summary>

**Simple Analogy: Food Delivery Apps**

Think of promise combinators like different strategies for ordering food:

**Promise.all - Group Order (everyone must agree)**

```javascript
// Like ordering food for your team
// If ANYONE doesn't get their food, the whole order is considered failed

const teamLunch = await Promise.all([
  orderFor('Alice'),  // Pizza
  orderFor('Bob'),    // Burger
  orderFor('Carol'),  // Salad
  orderFor('Dave')    // Sushi
]);

// If Bob's burger is unavailable:
// ❌ Entire order fails
// ❌ Alice, Carol, and Dave don't get food either
// ❌ Everyone is hungry!

// Real output:
// Success: [{pizza}, {burger}, {salad}, {sushi}]
// Failure: Error: "Burger unavailable" (no one gets food)
```

**Promise.allSettled - Individual Orders (everyone orders separately)**

```javascript
// Like everyone ordering for themselves
// You get your food regardless of others

const teamLunch = await Promise.allSettled([
  orderFor('Alice'),  // Pizza ✅
  orderFor('Bob'),    // Burger ❌ (out of stock)
  orderFor('Carol'),  // Salad ✅
  orderFor('Dave')    // Sushi ✅
]);

// Bob's burger failed, but others still get food
// ✅ Alice: Pizza delivered
// ❌ Bob: Order failed (hungry)
// ✅ Carol: Salad delivered
// ✅ Dave: Sushi delivered

// Output: [
//   { status: 'fulfilled', value: {pizza} },
//   { status: 'rejected', reason: Error },
//   { status: 'fulfilled', value: {salad} },
//   { status: 'fulfilled', value: {sushi} }
// ]
```

**Promise.race - First Delivery Wins**

```javascript
// Like ordering from 3 restaurants
// Eat whichever arrives first, cancel others

const dinner = await Promise.race([
  orderFrom('Restaurant A'), // Delivers in 30 min
  orderFrom('Restaurant B'), // Delivers in 20 min ⚡
  orderFrom('Restaurant C')  // Delivers in 25 min
]);

// Restaurant B arrives first at 20 min
// ✅ Eat from Restaurant B
// ❌ A and C arrive later (wasted, or give to someone else)

// Note: Other restaurants still deliver!
// You just ignore them
```

**Promise.any - First Successful Delivery**

```javascript
// Like having backup plans
// Keep trying until ONE restaurant successfully delivers

const dinner = await Promise.any([
  orderFrom('Restaurant A'), // Closed ❌
  orderFrom('Restaurant B'), // Out of delivery area ❌
  orderFrom('Restaurant C'), // Success! ✅
  orderFrom('Restaurant D')  // Also delivers, but too late
]);

// A failed, B failed, C succeeded first
// ✅ Eat from Restaurant C
// ✅ D's delivery ignored (C already succeeded)

// Only fails if ALL restaurants fail
```

**Visual Timeline:**

```
Time →  0s    10s   20s   30s   40s   50s

Promise.all:
Alice   |====|✅    (order ready)
Bob     |=====|❌   (failed - everyone loses)
Carol   |======|    (cancelled - no point)
Dave    |=======|   (cancelled - no point)
Result: ❌ ALL FAILED at 20s

Promise.allSettled:
Alice   |====|✅    (got pizza)
Bob     |=====|❌   (no burger, but others OK)
Carol   |======|✅   (got salad)
Dave    |=======|✅  (got sushi)
Result: ✅ 3/4 succeeded at 35s

Promise.race:
Rest A  |====|✅    (winner!)
Rest B  |=====|✅   (ignored)
Rest C  |======|✅  (ignored)
Result: ✅ FIRST at 20s

Promise.any:
Rest A  |====|❌    (failed)
Rest B  |=====|❌   (failed)
Rest C  |======|✅  (first success!)
Rest D  |=======|✅ (ignored)
Result: ✅ FIRST SUCCESS at 30s
```

**Explaining to PM (Non-technical):**

"These are like different strategies for hiring contractors:

**Promise.all** = 'All contractors must finish'
- Building a house: need foundation, walls, roof ALL done
- If electrician fails, entire project stops
- Use when: Everything is critical

**Promise.allSettled** = 'Get whoever finishes'
- Planning a conference: want catering, venue, speakers
- If DJ cancels, conference still happens (no music, but OK)
- Use when: Some things are optional

**Promise.race** = 'Hire fastest to respond'
- Need a plumber ASAP: call 3 plumbers, hire first to pick up
- Others might still call back, but you already hired someone
- Use when: Speed matters most

**Promise.any** = 'Hire first available'
- Need a graphic designer: email 5 designers
- First one to say 'yes' gets the job
- Others might respond later, but position filled
- Use when: You need ONE success, don't care who"

**Common Junior Mistakes:**

```javascript
// ❌ MISTAKE 1: Using wrong combinator
// Scenario: Loading dashboard widgets (some can fail)
const widgets = await Promise.all([
  loadWeather(),  // Critical
  loadNews(),     // Optional
  loadStocks(),   // Optional
  loadCalendar()  // Critical
]);
// If news fails, entire dashboard fails!

// ✅ CORRECT: Separate critical from optional
const [critical, optional] = await Promise.all([
  Promise.all([loadWeather(), loadCalendar()]), // Must succeed
  Promise.allSettled([loadNews(), loadStocks()]) // Can fail
]);


// ❌ MISTAKE 2: Thinking Promise.race cancels others
const result = await Promise.race([
  expensiveQuery1(), // Starts running
  expensiveQuery2(), // Starts running
  expensiveQuery3()  // Starts running
]);
// All 3 queries run to completion!
// race just returns first result, doesn't cancel

// ✅ CORRECT: Use AbortController to cancel
const controller = new AbortController();
const result = await Promise.race([
  fetch('/api/1', { signal: controller.signal }),
  fetch('/api/2', { signal: controller.signal }),
  fetch('/api/3', { signal: controller.signal })
]);
controller.abort(); // Cancel losers


// ❌ MISTAKE 3: Not checking AggregateError
Promise.any([promise1, promise2, promise3])
  .catch(error => {
    console.log(error.message); // "All promises rejected"
    // But WHY did they reject?
  });

// ✅ CORRECT: Check errors array
Promise.any([promise1, promise2, promise3])
  .catch(error => {
    console.log('All failed:', error.errors);
    error.errors.forEach((err, i) => {
      console.log(`Promise ${i + 1}:`, err.message);
    });
  });
```

**Practice Exercise:**

```javascript
// Which combinator would you use?

// 1. Loading user profile + posts (both critical)
// Answer: Promise.all (all must succeed)

// 2. Trying 3 different image CDNs (need one to work)
// Answer: Promise.any (first success)

// 3. Timeout implementation (5 seconds max)
// Answer: Promise.race (fetch vs timeout)

// 4. Sending notifications to 1000 users (some may fail)
// Answer: Promise.allSettled (partial success OK)

// 5. Loading dashboard: profile (critical) + widgets (optional)
// Answer: Promise.all for profile, Promise.allSettled for widgets
```

**Memory Trick: "ARAS"**

- **A**ll = **A**ll must succeed (fail-fast)
- **R**ace = **R**eturns first to finish
- **A**llSettled = **A**ll results (success + failures)
- **any** = **S**uccess needed (first success)

</details>

### Follow-up Questions

- "How would you implement a Promise.some that resolves when N promises succeed?"
- "What happens to promises that 'lose' in Promise.race - do they get cancelled?"
- "How would you implement a timeout for Promise.all?"
- "Can you implement Promise.map with concurrency limit using these methods?"
- "What are the memory implications of using Promise.allSettled with many promises?"

### Resources

- [MDN: Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN: Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [MDN: Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN: Promise.any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
- [JavaScript.info: Promise API](https://javascript.info/promise-api)

---

## Question 3: What are common async error handling strategies?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
How do you handle errors in async code? Explain different strategies for error handling, retry logic, and graceful degradation.

### Answer

**Async error handling** requires careful consideration to prevent unhandled rejections, provide user feedback, and maintain application stability.

**Key Strategies:**

1. **Try-Catch with Async/Await** - Wrap async operations in try-catch blocks
2. **Promise .catch()** - Handle rejections in promise chains
3. **Error Boundaries** - Catch errors at component level (React)
4. **Retry Logic** - Automatically retry failed operations with backoff
5. **Graceful Degradation** - Continue with partial data when some operations fail

### Code Example

```javascript
// ============================================
// 1. BASIC TRY-CATCH
// ============================================

async function fetchUser(id) {
  try {
    const response = await fetch(`/api/user/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw or handle
  }
}


// ============================================
// 2. RETRY WITH EXPONENTIAL BACKOFF
// ============================================

async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    onRetry = () => {}
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        onRetry(attempt, waitTime, error);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw new Error(`Failed after ${maxAttempts} attempts: ${lastError.message}`);
}

// Usage
const data = await retry(
  () => fetch('/api/data').then(r => r.json()),
  {
    maxAttempts: 5,
    delay: 1000,
    backoff: 2,
    onRetry: (attempt, wait) => {
      console.log(`Retry ${attempt} after ${wait}ms`);
    }
  }
);


// ============================================
// 3. CIRCUIT BREAKER PATTERN
// ============================================

class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.warn('Circuit breaker opened!');
    }
  }
}

// Usage
const breaker = new CircuitBreaker(5, 60000);

try {
  const data = await breaker.execute(() =>
    fetch('/api/data').then(r => r.json())
  );
} catch (error) {
  console.error('Request failed or circuit open:', error);
}


// ============================================
// 4. GRACEFUL DEGRADATION
// ============================================

async function loadDashboard(userId) {
  const results = await Promise.allSettled([
    fetchUserProfile(userId),
    fetchUserPosts(userId),
    fetchRecommendations(userId),
    fetchNotifications(userId)
  ]);

  const [profile, posts, recommendations, notifications] = results;

  // Critical data - must succeed
  if (profile.status === 'rejected') {
    throw new Error('Cannot load dashboard without user profile');
  }

  // Build dashboard with available data
  return {
    user: profile.value,
    posts: posts.status === 'fulfilled' ? posts.value : [],
    recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
    notifications: notifications.status === 'fulfilled' ? notifications.value : [],
    errors: results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason.message)
  };
}


// ============================================
// 5. GLOBAL ERROR HANDLER
// ============================================

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);

  // Report to error tracking service
  reportError(event.reason);

  // Prevent default browser behavior
  event.preventDefault();
});

// Catch global errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  reportError(event.error);
});


// ============================================
// 6. TIMEOUT WITH ERROR
// ============================================

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}


// ============================================
// 7. ERROR AGGREGATION
// ============================================

async function fetchMultiple(urls) {
  const results = await Promise.allSettled(
    urls.map(url => fetch(url).then(r => r.json()))
  );

  const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
  const failed = results.filter(r => r.status === 'rejected').map(r => ({
    url: urls[results.indexOf(r)],
    error: r.reason.message
  }));

  if (failed.length > 0) {
    console.warn(`${failed.length} requests failed:`, failed);
  }

  if (successful.length === 0) {
    throw new Error('All requests failed');
  }

  return { data: successful, errors: failed };
}
```

### Common Mistakes

- ❌ **Mistake:** Not handling errors in async functions
  ```javascript
  // ❌ Unhandled error!
  async function loadData() {
    const data = await fetch('/api/data').then(r => r.json());
    return data; // What if fetch fails?
  }

  // ✅ Always wrap in try-catch
  async function loadData() {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Load failed:', error);
      throw error;
    }
  }
  ```

- ❌ **Mistake:** Swallowing errors silently
  ```javascript
  // ❌ Silent failure!
  try {
    await fetchData();
  } catch (error) {
    // Do nothing - user never knows it failed
  }

  // ✅ At minimum, log the error
  try {
    await fetchData();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    showErrorToUser('Unable to load data');
  }
  ```

<details>
<summary><strong>🔍 Deep Dive: Unhandled Rejection Tracking in V8</strong></summary>

**How V8 Tracks Unhandled Rejections:**

```javascript
// When a promise rejects without a .catch() handler

const promise = fetch('/api/data')
  .then(r => r.json());
// No .catch()! What happens?

// V8 internal tracking:
// 1. Promise transitions to rejected state
// 2. Check: Does promise have rejection handler? (has_handler_ flag)
// 3. If no → Add to unhandled_rejections_ list
// 4. Schedule microtask checkpoint
// 5. At checkpoint: Trigger 'unhandledrejection' event

// PromiseRejectEvent structure in V8:
interface PromiseRejectionEvent {
  promise: Promise<any>;      // The rejected promise
  reason: any;                // The rejection reason (error)
  type: 'unhandledrejection'; // Event type
}
```

**Node.js vs Browser Handling:**

```javascript
// BROWSER: Warning in console
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  event.preventDefault(); // Prevent default logging
});

Promise.reject(new Error('Test error'));
// Output: Unhandled rejection: Error: Test error

// NODE.JS: Can crash the process
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: process.exit(1)
});

// Node.js flags:
// --unhandled-rejections=strict  → Crash immediately (default in v15+)
// --unhandled-rejections=warn    → Log warning only
// --unhandled-rejections=none    → Ignore (not recommended)
```

**V8 Promise Rejection Tracking Algorithm:**

```cpp
// Simplified V8 internal implementation

class Isolate {
  std::vector<Promise*> unhandled_rejections_;

  void OnPromiseReject(Promise* promise) {
    if (!promise->has_handler()) {
      // No rejection handler attached
      unhandled_rejections_.push_back(promise);

      // Schedule microtask to trigger event
      EnqueueMicrotask([this, promise]() {
        if (!promise->has_handler()) {
          // Still no handler after microtask checkpoint
          TriggerUnhandledRejectionEvent(promise);
        }
      });
    }
  }

  void OnPromiseHandlerAdded(Promise* promise) {
    // Remove from unhandled list if present
    auto it = std::find(unhandled_rejections_.begin(),
                        unhandled_rejections_.end(),
                        promise);
    if (it != unhandled_rejections_.end()) {
      unhandled_rejections_.erase(it);
      TriggerRejectionHandledEvent(promise);
    }
  }
};
```

**Error Propagation Through Promise Chains:**

```javascript
// How errors bubble through promise chains

fetch('/api/user/1')
  .then(r => r.json())        // Step 1
  .then(user => {
    console.log(user.name);    // Step 2
    return fetch(`/api/posts/${user.id}`);
  })
  .then(r => r.json())        // Step 3
  .then(posts => {
    console.log(posts);        // Step 4
  })
  .catch(error => {
    console.error('Error:', error); // Catches errors from ANY step
  });

// Error flow in V8:
// 1. Step 1 throws → Skip to .catch()
// 2. Step 2 throws → Skip to .catch()
// 3. Step 3 throws → Skip to .catch()
// 4. Step 4 throws → Skip to .catch()

// Internal mechanism:
// Each .then() creates a new promise
// If previous promise rejects, skip .then() callback
// Jump directly to next .catch() in chain
```

**Try-Catch vs .catch() Performance:**

```javascript
// Benchmark: 1 million error handles

// Pattern 1: try-catch with async/await
async function withTryCatch() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    return handleError(error);
  }
}

// Pattern 2: .catch() chaining
function withCatch() {
  return fetchData()
    .then(data => data)
    .catch(error => handleError(error));
}

// Performance results (V8 optimized):
// try-catch:    ~0.02ms per call (faster)
// .catch():     ~0.03ms per call (50% slower)

// Why try-catch is faster?
// 1. V8 can optimize try-catch blocks with TurboFan
// 2. .catch() creates additional promise wrappers
// 3. try-catch uses native exception handling (C++ level)
// 4. .catch() goes through JavaScript microtask queue

// However: Difference is negligible in real apps
// Choose based on code readability, not performance
```

**Circuit Breaker State Machine:**

```javascript
// V8 doesn't have built-in circuit breaker
// But understanding state transitions is key

class CircuitBreaker {
  constructor() {
    this.state = 'CLOSED';  // States: CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.threshold = 5;
    this.timeout = 60000;
    this.nextAttempt = Date.now();
  }

  // State transition diagram:
  //
  //     CLOSED ──[failures >= threshold]──> OPEN
  //        ↑                                  │
  //        │                [timeout expires]  │
  //        │                                  ↓
  //        └────[success]───── HALF_OPEN <────┘
  //
  //     HALF_OPEN ──[failure]──> OPEN
  //

  async call(fn) {
    switch (this.state) {
      case 'CLOSED':
        try {
          const result = await fn();
          this.failures = 0;
          return result;
        } catch (error) {
          this.failures++;
          if (this.failures >= this.threshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.timeout;
            console.error('Circuit breaker OPENED');
          }
          throw error;
        }

      case 'OPEN':
        if (Date.now() < this.nextAttempt) {
          throw new Error('Circuit breaker is OPEN');
        }
        this.state = 'HALF_OPEN';
        // Fall through to HALF_OPEN

      case 'HALF_OPEN':
        try {
          const result = await fn();
          this.state = 'CLOSED';
          this.failures = 0;
          console.log('Circuit breaker CLOSED');
          return result;
        } catch (error) {
          this.state = 'OPEN';
          this.nextAttempt = Date.now() + this.timeout;
          console.error('Circuit breaker re-OPENED');
          throw error;
        }
    }
  }
}
```

**Memory Leak from Unhandled Rejections:**

```javascript
// Unhandled rejections can cause memory leaks

// ❌ LEAK: Creating promises without handlers
setInterval(() => {
  fetch('/api/data')
    .then(r => r.json())
    .then(data => {
      if (!data.valid) {
        throw new Error('Invalid data');
      }
      processData(data);
    });
  // No .catch()! Unhandled rejections accumulate
}, 1000);

// After 1 hour:
// - 3,600 unhandled rejections
// - V8 keeps reference to each promise
// - Memory usage: ~50MB (should be ~1MB)
// - Eventually: Out of memory

// ✅ FIX: Always add .catch()
setInterval(() => {
  fetch('/api/data')
    .then(r => r.json())
    .then(data => {
      if (!data.valid) {
        throw new Error('Invalid data');
      }
      processData(data);
    })
    .catch(error => {
      console.error('Data fetch failed:', error);
      // Error handled, promise can be GC'd
    });
}, 1000);

// After 1 hour:
// - 0 unhandled rejections
// - Memory usage: ~1MB (healthy)
```

**Advanced: Error Context Preservation:**

```javascript
// V8 preserves stack traces through async boundaries

async function level3() {
  throw new Error('Something failed');
}

async function level2() {
  await level3(); // Error originates here
}

async function level1() {
  await level2(); // Error propagates through here
}

try {
  await level1();
} catch (error) {
  console.error(error.stack);
  // Output:
  // Error: Something failed
  //     at level3 (file.js:2:9)
  //     at level2 (file.js:6:9)
  //     at level1 (file.js:10:9)
  //     at <anonymous> (file.js:14:9)

  // V8 uses async stack traces (added in V8 6.3)
  // Internally: Maintains AsyncStackTrace linked list
}
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Silent Failure in Payment System</strong></summary>

**Scenario:** Your payment processing system is silently failing. Users report "payment successful" messages, but charges never appear in the database. Audit logs show 8% of payments are lost.

**The Problem:**

```javascript
// ❌ SILENT FAILURE: Errors swallowed
class PaymentService {
  async processPayment(userId, amount, paymentMethod) {
    // Step 1: Charge the card
    const charge = await this.chargeCard(paymentMethod, amount)
      .catch(error => {
        console.log('Card charge failed:', error);
        // ⚠️ SWALLOWED! No throw, no return
      });

    // Step 2: Save to database (charge might be undefined!)
    const payment = await this.savePayment({
      userId,
      amount,
      chargeId: charge.id, // ❌ charge is undefined if step 1 failed!
      status: 'completed'
    }).catch(error => {
      console.log('Database save failed:', error);
      // ⚠️ SWALLOWED AGAIN! Payment charged but not recorded
    });

    // Step 3: Send confirmation email
    await this.sendConfirmationEmail(userId, amount)
      .catch(error => {
        console.log('Email failed:', error);
        // ⚠️ SWALLOWED! User doesn't know payment succeeded
      });

    // Always returns undefined (implicit return)
    // UI shows "success" even if everything failed!
  }
}

// Production metrics (30-day period):
// - Total payment attempts: 10,000
// - Payments shown as "successful" to users: 10,000 (100%)
// - Actual charges in Stripe: 9,500 (95%)
// - Payments recorded in DB: 9,200 (92%)
// - Confirmation emails sent: 8,900 (89%)
// - Revenue discrepancy: $45,000 (charged but not recorded)
// - User complaints: "Charged but no confirmation" (+500 support tickets)
```

**Debugging the Silent Failure:**

```javascript
// Step 1: Add detailed logging with error propagation
class PaymentService {
  async processPayment(userId, amount, paymentMethod) {
    console.log('[Payment] Starting payment processing', {
      userId,
      amount,
      timestamp: new Date().toISOString()
    });

    let charge;
    try {
      charge = await this.chargeCard(paymentMethod, amount);
      console.log('[Payment] Card charged successfully', { chargeId: charge.id });
    } catch (error) {
      console.error('[Payment] Card charge FAILED:', error);
      // DON'T SWALLOW! Re-throw
      throw new Error(`Card charge failed: ${error.message}`);
    }

    let payment;
    try {
      payment = await this.savePayment({
        userId,
        amount,
        chargeId: charge.id,
        status: 'completed'
      });
      console.log('[Payment] Payment saved to DB', { paymentId: payment.id });
    } catch (error) {
      console.error('[Payment] Database save FAILED:', error);
      // CRITICAL: Card was charged but not recorded!
      // Need to refund or retry save
      await this.handleDatabaseFailure(charge.id, error);
      throw new Error(`Payment recorded but database failed: ${error.message}`);
    }

    try {
      await this.sendConfirmationEmail(userId, amount);
      console.log('[Payment] Confirmation email sent');
    } catch (error) {
      console.error('[Payment] Email FAILED:', error);
      // Email is non-critical, but log for follow-up
      // Don't throw - payment already succeeded
    }

    return payment;
  }
}

// Logs reveal the issue:
// [Payment] Card charge FAILED: Card declined
// [Payment] Database save FAILED: chargeId is undefined
// → 5% card charges fail (expected)
// → 8% database saves fail (charge.id is undefined from failed step 1)
```

**Solution 1: Proper Error Propagation**

```javascript
// ✅ FIX: Don't swallow errors, propagate them
class PaymentService {
  async processPayment(userId, amount, paymentMethod) {
    let charge, payment;

    // CRITICAL STEP 1: Charge card (must succeed)
    try {
      charge = await this.chargeCard(paymentMethod, amount);
    } catch (error) {
      throw new PaymentError('CHARGE_FAILED', {
        message: 'Failed to charge payment method',
        originalError: error,
        userId,
        amount
      });
    }

    // CRITICAL STEP 2: Save to database (must succeed)
    try {
      payment = await this.savePayment({
        userId,
        amount,
        chargeId: charge.id,
        status: 'completed'
      });
    } catch (error) {
      // Card charged but database failed - CRITICAL!
      // Attempt refund
      console.error('[Payment] DB save failed, attempting refund');

      try {
        await this.refundCharge(charge.id);
        throw new PaymentError('DB_SAVE_FAILED_REFUNDED', {
          message: 'Payment database save failed, charge refunded',
          originalError: error,
          chargeId: charge.id
        });
      } catch (refundError) {
        // WORST CASE: Charge succeeded, DB failed, refund failed
        // Need manual intervention
        await this.alertOps({
          severity: 'CRITICAL',
          message: 'Payment charged but not recorded, refund failed',
          data: { charge, error, refundError }
        });

        throw new PaymentError('DB_SAVE_FAILED_REFUND_FAILED', {
          message: 'Payment system error, support team notified',
          chargeId: charge.id
        });
      }
    }

    // OPTIONAL STEP 3: Send email (can fail gracefully)
    try {
      await this.sendConfirmationEmail(userId, amount);
    } catch (error) {
      // Log but don't throw - payment already succeeded
      console.error('[Payment] Email failed (non-critical):', error);
      // Queue for retry
      await this.queueEmailRetry(userId, payment.id);
    }

    return {
      success: true,
      payment,
      charge
    };
  }
}

// Custom error class for better error handling
class PaymentError extends Error {
  constructor(code, details) {
    super(details.message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
  }
}

// Usage:
try {
  const result = await paymentService.processPayment(userId, amount, paymentMethod);
  showSuccessMessage('Payment successful!');
} catch (error) {
  if (error instanceof PaymentError) {
    switch (error.code) {
      case 'CHARGE_FAILED':
        showErrorMessage('Payment method declined. Please try a different card.');
        break;
      case 'DB_SAVE_FAILED_REFUNDED':
        showErrorMessage('Payment failed, no charge was made. Please try again.');
        break;
      case 'DB_SAVE_FAILED_REFUND_FAILED':
        showErrorMessage('Payment error. Our support team has been notified and will contact you.');
        break;
      default:
        showErrorMessage('Payment failed. Please try again or contact support.');
    }
  }
}

// After fix:
// - Payment accuracy: 100% (from 92%)
// - Revenue discrepancy: $0 (from $45,000)
// - Failed charges properly refunded: 100%
// - Support tickets: -450 (90% reduction)
```

**Solution 2: Transaction Pattern with Rollback**

```javascript
// ✅ BETTER: Implement transaction-like pattern
class PaymentService {
  async processPayment(userId, amount, paymentMethod) {
    const transaction = new PaymentTransaction();

    try {
      // Step 1: Charge card
      const charge = await this.chargeCard(paymentMethod, amount);
      transaction.addStep('charge', charge, async () => {
        await this.refundCharge(charge.id);
      });

      // Step 2: Save to database
      const payment = await this.savePayment({
        userId,
        amount,
        chargeId: charge.id,
        status: 'completed'
      });
      transaction.addStep('payment', payment, async () => {
        await this.deletePayment(payment.id);
      });

      // Step 3: Update inventory
      const inventory = await this.updateInventory(userId, payment.items);
      transaction.addStep('inventory', inventory, async () => {
        await this.restoreInventory(inventory.id);
      });

      // All critical steps succeeded
      transaction.commit();

      // Non-critical: Send email (outside transaction)
      this.sendConfirmationEmail(userId, amount).catch(error => {
        console.error('Email failed (non-critical):', error);
      });

      return {
        success: true,
        payment,
        charge
      };

    } catch (error) {
      // Rollback all completed steps
      console.error('[Payment] Transaction failed, rolling back:', error);
      await transaction.rollback();
      throw error;
    }
  }
}

// Transaction manager
class PaymentTransaction {
  constructor() {
    this.steps = [];
    this.committed = false;
  }

  addStep(name, data, rollbackFn) {
    this.steps.push({ name, data, rollbackFn });
  }

  async rollback() {
    // Rollback in reverse order
    for (let i = this.steps.length - 1; i >= 0; i--) {
      const step = this.steps[i];
      try {
        console.log(`[Transaction] Rolling back step: ${step.name}`);
        await step.rollbackFn();
      } catch (error) {
        console.error(`[Transaction] Rollback failed for ${step.name}:`, error);
        // Continue rolling back other steps
      }
    }
  }

  commit() {
    this.committed = true;
    this.steps = [];
  }
}
```

**Solution 3: Saga Pattern for Distributed Transactions**

```javascript
// ✅ BEST: Saga pattern for complex multi-service payments
class PaymentSaga {
  constructor() {
    this.steps = [];
    this.completedSteps = [];
  }

  addStep(name, action, compensation) {
    this.steps.push({ name, action, compensation });
  }

  async execute() {
    for (const step of this.steps) {
      try {
        console.log(`[Saga] Executing: ${step.name}`);
        const result = await step.action();
        this.completedSteps.push({ ...step, result });
      } catch (error) {
        console.error(`[Saga] Step failed: ${step.name}`, error);
        await this.compensate();
        throw new Error(`Saga failed at ${step.name}: ${error.message}`);
      }
    }
    return this.completedSteps.map(s => s.result);
  }

  async compensate() {
    console.log('[Saga] Starting compensation');

    // Compensate in reverse order
    for (let i = this.completedSteps.length - 1; i >= 0; i--) {
      const step = this.completedSteps[i];
      try {
        console.log(`[Saga] Compensating: ${step.name}`);
        await step.compensation(step.result);
      } catch (error) {
        console.error(`[Saga] Compensation failed for ${step.name}:`, error);
        // Log for manual intervention but continue
      }
    }
  }
}

// Usage:
class PaymentService {
  async processPayment(userId, amount, paymentMethod) {
    const saga = new PaymentSaga();

    // Define saga steps
    saga.addStep(
      'charge',
      () => this.chargeCard(paymentMethod, amount),
      (charge) => this.refundCharge(charge.id)
    );

    saga.addStep(
      'savePayment',
      () => this.savePayment({ userId, amount, chargeId: saga.completedSteps[0].result.id }),
      (payment) => this.deletePayment(payment.id)
    );

    saga.addStep(
      'updateInventory',
      () => this.updateInventory(userId),
      (inventory) => this.restoreInventory(inventory.id)
    );

    saga.addStep(
      'notifyWarehouse',
      () => this.notifyWarehouse(userId),
      () => this.cancelWarehouseNotification(userId)
    );

    try {
      const [charge, payment, inventory, notification] = await saga.execute();

      // Send email outside saga (non-critical)
      this.sendConfirmationEmail(userId, amount);

      return { success: true, payment, charge };
    } catch (error) {
      // Saga automatically compensated
      throw new PaymentError('PAYMENT_FAILED', {
        message: 'Payment processing failed, all changes have been reversed',
        originalError: error
      });
    }
  }
}
```

**Metrics After Implementing Solutions:**

| Metric | Before | After (Sol 1) | After (Sol 2) | After (Sol 3) |
|--------|--------|---------------|---------------|---------------|
| Payment accuracy | 92% | 99.9% | 99.95% | 99.99% |
| Revenue discrepancy | $45,000/mo | $500/mo | $200/mo | $50/mo |
| Failed refunds | 200/mo | 5/mo | 2/mo | 0/mo |
| Support tickets | 500/mo | 50/mo | 20/mo | 5/mo |
| Manual interventions | 50/mo | 5/mo | 2/mo | 0/mo |

</details>

<details>
<summary><strong>⚖️ Trade-offs: Error Handling Strategies</strong></summary>

**1. Try-Catch vs .catch() Chaining**

```javascript
// Pattern 1: try-catch with async/await (procedural)
async function loadUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts.map(p => p.id));
    return { user, posts, comments };
  } catch (error) {
    console.error('Load failed:', error);
    throw error;
  }
}

// Pattern 2: .catch() chaining (functional)
function loadUserData(userId) {
  return fetchUser(userId)
    .then(user =>
      fetchPosts(user.id)
        .then(posts =>
          fetchComments(posts.map(p => p.id))
            .then(comments => ({ user, posts, comments }))
        )
    )
    .catch(error => {
      console.error('Load failed:', error);
      throw error;
    });
}

// Pattern 3: Flat promise chain (best of both)
function loadUserData(userId) {
  let user;
  return fetchUser(userId)
    .then(u => {
      user = u;
      return fetchPosts(user.id);
    })
    .then(posts => {
      return fetchComments(posts.map(p => p.id))
        .then(comments => ({ user, posts, comments }));
    })
    .catch(error => {
      console.error('Load failed:', error);
      throw error;
    });
}
```

**Comparison:**

| Aspect | try-catch | .catch() | Flat chain |
|--------|-----------|----------|------------|
| **Readability** | ✅ Excellent | ❌ Poor (nesting) | ✅ Good |
| **Debugging** | ✅ Clear stack traces | ❌ Harder to debug | ✅ Clear |
| **Error granularity** | ✅ Per-operation | ❌ Single handler | ❌ Single handler |
| **Performance** | ✅ Slightly faster | ❌ Slower | ❌ Slower |
| **Code length** | ✅ Shorter | ❌ Longer | ⚠️ Medium |

**2. Fail-Fast vs Fail-Safe Strategies**

```javascript
// Fail-Fast: Stop on first error (default)
async function loadPageDataFailFast() {
  const user = await fetchUser(); // Throws on error
  const posts = await fetchPosts(); // Never runs if user fails
  return { user, posts };
}
// ✅ Simple, clear failure mode
// ✅ Fast failure (no wasted work)
// ❌ No partial data
// Use when: All data is critical

// Fail-Safe: Continue on errors, return partial data
async function loadPageDataFailSafe() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);

  return {
    user: results[0].status === 'fulfilled' ? results[0].value : null,
    posts: results[1].status === 'fulfilled' ? results[1].value : [],
    comments: results[2].status === 'fulfilled' ? results[2].value : [],
    errors: results.filter(r => r.status === 'rejected').map(r => r.reason)
  };
}
// ✅ Partial data available
// ✅ User sees something (better UX)
// ❌ More complex error handling
// Use when: Partial data is useful
```

**3. Retry Strategies Comparison**

```javascript
// Strategy 1: Fixed delay retry
async function retryFixed(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(delay); // Always wait 1s
    }
  }
}
// ✅ Simple
// ✅ Predictable
// ❌ May overwhelm recovering service
// ❌ No adaptation to server load

// Strategy 2: Exponential backoff
async function retryExponential(fn, maxAttempts = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await sleep(delay); // 1s, 2s, 4s, 8s...
    }
  }
}
// ✅ Gives service time to recover
// ✅ Reduces load during recovery
// ❌ Slower for transient failures
// ✅ Industry standard

// Strategy 3: Exponential backoff with jitter
async function retryWithJitter(fn, maxAttempts = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const exponential = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * exponential;
      await sleep(jitter); // Randomized delay
    }
  }
}
// ✅ Prevents thundering herd
// ✅ Distributes load
// ✅ Best for distributed systems
// ❌ Most complex
```

**Retry Strategy Comparison:**

| Strategy | Delay Pattern | Thundering Herd | Recovery Time | Use Case |
|----------|---------------|-----------------|---------------|----------|
| **Fixed** | 1s, 1s, 1s | ❌ High risk | Fast | Single client |
| **Exponential** | 1s, 2s, 4s | ⚠️ Medium risk | Medium | Multiple clients |
| **Jitter** | Random(1s), Random(2s), Random(4s) | ✅ Low risk | Medium | Many clients |

**4. Circuit Breaker vs Simple Retry**

```javascript
// Simple Retry: Always try, waste resources
async function withSimpleRetry(fn) {
  for (let i = 0; i < 3; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === 2) throw error;
      await sleep(1000);
    }
  }
}
// Service is down → Every request retries 3x
// 100 requests = 300 total attempts (overload!)

// Circuit Breaker: Fail fast when service is down
class CircuitBreaker {
  async call(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit open');
    }
    try {
      return await fn();
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }
}
// Service is down → Circuit opens
// 100 requests = 5 attempts (until circuit opens)
// → Saves 295 attempts, server recovers faster
```

**When to Use Each:**

| Situation | Use Retry | Use Circuit Breaker |
|-----------|-----------|---------------------|
| Transient network errors | ✅ Yes | ❌ No (overkill) |
| Service degradation | ⚠️ Maybe | ✅ Yes |
| Service completely down | ❌ No (wasteful) | ✅ Yes |
| Single client | ✅ Yes | ⚠️ Maybe |
| Many clients | ⚠️ Maybe | ✅ Yes |

**5. Error Logging Strategies**

```javascript
// Strategy 1: Log everything (verbose)
try {
  const result = await fetchData();
  console.log('[SUCCESS] Data fetched:', result);
} catch (error) {
  console.error('[ERROR] Fetch failed:', error);
  console.error('[ERROR] Stack:', error.stack);
  console.error('[ERROR] Timestamp:', new Date());
}
// ✅ Maximum information
// ❌ Log spam (80% noise)
// ❌ Hard to find real issues
// ❌ Storage costs

// Strategy 2: Log errors only (minimal)
try {
  return await fetchData();
} catch (error) {
  console.error('Fetch failed:', error.message);
  throw error;
}
// ✅ Clean logs
// ❌ Missing context
// ❌ Hard to reproduce issues

// Strategy 3: Structured logging with context (balanced)
const logger = {
  error: (message, context, error) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      message,
      context,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      timestamp: new Date().toISOString()
    }));
  }
};

try {
  return await fetchData();
} catch (error) {
  logger.error('Data fetch failed', { userId, operation: 'fetchData' }, error);
  throw error;
}
// ✅ Structured, searchable
// ✅ Context included
// ✅ Moderate verbosity
// ✅ Easy aggregation
```

**6. Error Recovery Trade-offs**

```javascript
// Option 1: Crash on error (strict)
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1); // Crash
});
// ✅ Forces proper error handling
// ✅ Prevents silent failures
// ❌ Service downtime
// Use: Development, critical systems

// Option 2: Log and continue (lenient)
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  // Continue running
});
// ✅ Service stays up
// ❌ May hide bugs
// ❌ Degraded state
// Use: Non-critical systems

// Option 3: Restart on error (resilient)
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  setTimeout(() => process.exit(1), 1000); // Graceful shutdown
});
// Container orchestrator (Docker, K8s) restarts
// ✅ Self-healing
// ✅ Forces error handling
// ⚠️ Brief downtime
// Use: Production (with orchestration)
```

</details>

<details>
<summary><strong>💬 Explain to Junior: Error Handling Best Practices</strong></summary>

**Simple Analogy: Package Delivery**

Error handling is like planning for when package delivery goes wrong:

**No Error Handling = Ignoring Problems**
```javascript
// ❌ Like ordering a package and never checking if it arrived
async function orderPackage() {
  const package = await deliveryService.send();
  usePackage(package); // What if package never arrived?
}
// No tracking, no Plan B, just hope it works!
```

**Try-Catch = Having a Backup Plan**
```javascript
// ✅ Like having a backup plan if package doesn't arrive
async function orderPackage() {
  try {
    const package = await deliveryService.send();
    usePackage(package);
  } catch (error) {
    console.error('Package lost:', error);
    // Order from local store instead
    const package = await localStore.buy();
    usePackage(package);
  }
}
// You checked, it failed, you had a backup!
```

**Retry Logic = Trying Multiple Delivery Services**
```javascript
// ✅ Like trying 3 different delivery services
async function orderPackage() {
  const services = [fastDelivery, standardDelivery, slowDelivery];

  for (const service of services) {
    try {
      return await service.send();
    } catch (error) {
      console.log(`${service.name} failed, trying next...`);
    }
  }

  throw new Error('All delivery services failed!');
}
```

**Real-World Example: Online Shopping**

```javascript
// Scenario: Buying a product online

// ❌ NO ERROR HANDLING (Bad UX)
async function checkout() {
  const payment = await processPayment();
  const order = await createOrder();
  const email = await sendConfirmation();

  return 'Success!';
}
// If payment fails → Crashes
// If email fails → Crashes
// User sees: "Something went wrong" (no details!)

// ✅ WITH ERROR HANDLING (Good UX)
async function checkout() {
  let payment, order;

  // Critical: Payment must succeed
  try {
    payment = await processPayment();
  } catch (error) {
    return {
      success: false,
      message: 'Payment failed. Please check your card details.',
      error: 'PAYMENT_FAILED'
    };
  }

  // Critical: Order must be created
  try {
    order = await createOrder(payment.id);
  } catch (error) {
    // Payment succeeded but order failed - refund!
    await refundPayment(payment.id);
    return {
      success: false,
      message: 'Order creation failed. Your card was not charged.',
      error: 'ORDER_FAILED'
    };
  }

  // Optional: Email can fail gracefully
  try {
    await sendConfirmation(order.id);
  } catch (error) {
    console.warn('Email failed (non-critical):', error);
    // Order succeeded, just email failed
    // Queue for retry later
  }

  return {
    success: true,
    message: 'Order placed successfully!',
    orderId: order.id
  };
}
// User always gets clear feedback!
```

**Explaining to PM:**

"Error handling is like insurance:

**No Error Handling** = No insurance
- House burns down → You're homeless
- In code: App crashes → User loses work

**Basic Try-Catch** = Home insurance
- House burns down → Insurance rebuilds
- In code: Error occurs → Show user-friendly message

**Retry Logic** = Multiple contractors
- First contractor unavailable → Call second contractor
- In code: Primary server down → Try backup server

**Circuit Breaker** = Knowing when to stop
- Contractor no-shows 5 times → Stop calling them
- In code: Service down → Stop sending requests, try later

**Why it matters for business:**
- Without: 20% of users abandon checkout on errors
- With proper error handling: Only 2% abandon
- Revenue impact: $500,000/year difference"

**Common Junior Mistakes:**

```javascript
// ❌ MISTAKE 1: Catching but not handling
try {
  await saveData();
} catch (error) {
  // Empty catch - error disappears!
}

// ✅ CORRECT: At minimum, log it
try {
  await saveData();
} catch (error) {
  console.error('Save failed:', error);
  showErrorToUser('Could not save. Please try again.');
}


// ❌ MISTAKE 2: Generic error messages
try {
  await processPayment();
} catch (error) {
  alert('Something went wrong');
  // User has no idea what failed!
}

// ✅ CORRECT: Specific, actionable messages
try {
  await processPayment();
} catch (error) {
  if (error.code === 'CARD_DECLINED') {
    alert('Your card was declined. Please use a different payment method.');
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    alert('Insufficient funds. Please check your balance.');
  } else {
    alert('Payment failed. Please try again or contact support.');
  }
}


// ❌ MISTAKE 3: Not cleaning up on error
async function uploadFile(file) {
  const tempFile = await createTempFile();
  const result = await uploadToServer(tempFile);
  await deleteTempFile(tempFile);
  return result;
}
// If uploadToServer fails, tempFile never gets deleted!

// ✅ CORRECT: Use finally for cleanup
async function uploadFile(file) {
  const tempFile = await createTempFile();

  try {
    const result = await uploadToServer(tempFile);
    return result;
  } finally {
    // Always runs, success or failure
    await deleteTempFile(tempFile);
  }
}
```

**Visual: Error Handling Levels**

```
Level 0: No error handling
  Code: await fetchData()
  Result: ❌ Crashes on error

Level 1: Basic try-catch
  Code: try { await fetchData() } catch (e) { console.log(e) }
  Result: ⚠️ Logs error, doesn't crash

Level 2: User-friendly messages
  Code: try { ... } catch (e) { showError('Load failed') }
  Result: ✅ User sees friendly message

Level 3: Retry logic
  Code: try { ... } catch (e) { retry 3x with backoff }
  Result: ✅✅ Recovers from transient failures

Level 4: Circuit breaker
  Code: Circuit opens after 5 failures
  Result: ✅✅✅ Prevents overwhelming failing service

Level 5: Saga pattern
  Code: Multi-step transaction with rollback
  Result: ✅✅✅✅ Production-grade resilience
```

**Practice Exercise:**

```javascript
// Scenario: Weather app loading data from API
// The API is slow and sometimes fails

// Try writing error handling for this:
async function loadWeather(city) {
  const data = await fetch(`/api/weather/${city}`).then(r => r.json());
  return data;
}

// What could go wrong?
// 1. Network failure (no internet)
// 2. API timeout (>5 seconds)
// 3. City not found (404)
// 4. API rate limit (429)
// 5. Server error (500)

// Your turn: Add proper error handling!

// Solution:
async function loadWeather(city) {
  try {
    const response = await fetchWithTimeout(
      `/api/weather/${city}`,
      5000 // 5 second timeout
    );

    if (response.status === 404) {
      return {
        error: 'CITY_NOT_FOUND',
        message: `City "${city}" not found. Please check spelling.`
      };
    }

    if (response.status === 429) {
      return {
        error: 'RATE_LIMIT',
        message: 'Too many requests. Please try again in a minute.'
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    if (error.message.includes('Timeout')) {
      return {
        error: 'TIMEOUT',
        message: 'Weather service is slow. Please try again.'
      };
    }

    return {
      error: 'NETWORK_ERROR',
      message: 'Could not load weather. Check your internet connection.'
    };
  }
}
```

**Key Takeaways:**

1. **Always handle errors** - Don't let them crash your app
2. **Be specific** - Tell users exactly what went wrong
3. **Have a Plan B** - Retry, fallback, or graceful degradation
4. **Clean up resources** - Use finally for cleanup
5. **Log for debugging** - Future you will thank you

</details>

### Follow-up Questions

- "How would you implement a retry with jitter to avoid thundering herd?"
- "What's the difference between fail-fast and fail-safe strategies?"
- "How do you test error handling in async code?"
- "When should you use circuit breaker vs simple retry?"

### Resources

- [Error Handling in JavaScript](https://javascript.info/try-catch)
- [Promise Error Handling](https://javascript.info/promise-error-handling)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)

---

