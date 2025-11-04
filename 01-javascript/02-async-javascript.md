# Asynchronous JavaScript

> **Navigation:** [← Back to JavaScript](README.md) | [Home](../README.md)

---

## Question 1: Explain synchronous vs asynchronous code execution in JavaScript

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Netflix

### Question
What is the difference between synchronous and asynchronous code execution in JavaScript? Why is asynchronous programming important for web applications?

### Answer

**Synchronous execution:**
- Code runs **sequentially**, one line at a time
- Each operation must **complete** before the next one starts
- **Blocks** the main thread while waiting for operations to finish
- Simple and predictable flow of execution

**Asynchronous execution:**
- Code can run **concurrently** without blocking
- Operations can be **initiated** and continue in the background
- Allows the program to **continue** while waiting for time-consuming tasks
- Uses callbacks, promises, or async/await to handle results

**Why asynchronous is crucial:**
- **User experience:** Prevents UI freezing during network requests or heavy computations
- **Performance:** Makes efficient use of I/O operations (file reads, API calls)
- **Responsiveness:** Application remains interactive while waiting for operations
- **Scalability:** Handles multiple operations simultaneously without spawning threads

### Code Example

```javascript
// ============================================
// Example 1: Synchronous blocking code
// ============================================
console.log('Start');

function slowOperation() {
  // Simulating slow operation with blocking loop
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Blocks for 3 seconds
  }
  return 'Done';
}

console.log(slowOperation()); // Blocks here for 3 seconds
console.log('End');

// Output (takes 3+ seconds):
// Start
// Done (after 3 seconds)
// End


// ============================================
// Example 2: Asynchronous non-blocking code
// ============================================
console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 3000);

console.log('End');

// Output (immediate):
// Start
// End
// Timeout callback (after 3 seconds)


// ============================================
// Example 3: Real-world API call comparison
// ============================================

// ❌ Synchronous approach (if it existed - hypothetical)
// function getUserSync(userId) {
//   const response = fetch(`/api/user/${userId}`); // Would block
//   return response.json();
// }
// console.log('Before');
// const user = getUserSync(123); // Blocks entire app
// console.log('After', user);

// ✅ Asynchronous approach (actual implementation)
function getUserAsync(userId) {
  return fetch(`/api/user/${userId}`)
    .then(response => response.json());
}

console.log('Before');
getUserAsync(123)
  .then(user => console.log('User:', user));
console.log('After'); // Executes immediately

// Output:
// Before
// After
// User: { id: 123, name: '...' } (when request completes)


// ============================================
// Example 4: Multiple async operations
// ============================================
console.log('Start fetching data...');

// All three requests start simultaneously
Promise.all([
  fetch('/api/user/1').then(r => r.json()),
  fetch('/api/user/2').then(r => r.json()),
  fetch('/api/user/3').then(r => r.json())
])
.then(users => {
  console.log('All users:', users);
});

console.log('Requests sent, continuing...');

// Output:
// Start fetching data...
// Requests sent, continuing...
// All users: [...] (when all complete)


// ============================================
// Example 5: Async/await syntax (still asynchronous)
// ============================================
async function loadUserData(userId) {
  console.log('Loading user...');

  // Non-blocking despite looking synchronous
  const user = await fetch(`/api/user/${userId}`).then(r => r.json());

  console.log('User loaded:', user.name);
  return user;
}

console.log('Before');
loadUserData(123); // Returns promise immediately
console.log('After');

// Output:
// Before
// Loading user...
// After
// User loaded: John (when request completes)


// ============================================
// Example 6: File reading comparison
// ============================================

// Node.js synchronous file read (blocks)
const fs = require('fs');

console.log('Start');
const content = fs.readFileSync('file.txt', 'utf8'); // Blocks
console.log('File content:', content);
console.log('End');

// Node.js asynchronous file read (non-blocking)
console.log('Start');
fs.readFile('file.txt', 'utf8', (err, content) => {
  console.log('File content:', content); // Executes later
});
console.log('End'); // Executes immediately

// Output:
// Start
// End
// File content: ... (when read completes)


// ============================================
// Example 7: UI responsiveness example
// ============================================

// ❌ Synchronous: Freezes UI
document.getElementById('btn').addEventListener('click', () => {
  // Heavy computation blocks UI
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  console.log(result); // UI frozen during loop
});

// ✅ Asynchronous: Keeps UI responsive
document.getElementById('btn').addEventListener('click', async () => {
  console.log('Processing...');

  // Offload to Web Worker or use setTimeout
  await new Promise(resolve => {
    setTimeout(() => {
      let result = 0;
      for (let i = 0; i < 1000000000; i++) {
        result += i;
      }
      console.log(result);
      resolve();
    }, 0);
  });

  console.log('Done!');
});


// ============================================
// Example 8: Sequential vs concurrent
// ============================================

// Sequential (slower - operations wait for each other)
async function loadSequential() {
  console.time('sequential');

  const user = await fetch('/api/user/1').then(r => r.json()); // Wait
  const posts = await fetch('/api/posts/1').then(r => r.json()); // Wait
  const comments = await fetch('/api/comments/1').then(r => r.json()); // Wait

  console.timeEnd('sequential'); // ~900ms (300ms each)
  return { user, posts, comments };
}

// Concurrent (faster - operations run in parallel)
async function loadConcurrent() {
  console.time('concurrent');

  // Start all requests simultaneously
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user/1').then(r => r.json()),
    fetch('/api/posts/1').then(r => r.json()),
    fetch('/api/comments/1').then(r => r.json())
  ]);

  console.timeEnd('concurrent'); // ~300ms (all parallel)
  return { user, posts, comments };
}


// ============================================
// Example 9: Error handling comparison
// ============================================

// Synchronous error handling
try {
  const result = JSON.parse('invalid json'); // Throws immediately
  console.log(result);
} catch (error) {
  console.error('Sync error:', error.message);
}

// Asynchronous error handling
fetch('/api/data')
  .then(response => response.json())
  .catch(error => {
    console.error('Async error:', error.message);
  });

// With async/await
async function loadData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Async error:', error.message);
  }
}


// ============================================
// Example 10: Real-world patterns
// ============================================

// Loading state management with async
class DataLoader {
  constructor() {
    this.loading = false;
    this.data = null;
    this.error = null;
  }

  async load(url) {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(url);
      this.data = await response.json();
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }

    return this.data;
  }
}

const loader = new DataLoader();

// UI remains responsive while loading
loader.load('/api/users').then(users => {
  console.log('Loaded:', users);
});

console.log('Loading state:', loader.loading); // true immediately
```

### Common Mistakes

- ❌ **Mistake:** Using synchronous APIs in the browser (blocking UI)
  ```javascript
  // No synchronous fetch exists (good thing!)
  // This would freeze the entire browser
  const data = fetchSync('/api/data'); // Doesn't exist
  ```

- ❌ **Mistake:** Not understanding that async code doesn't execute immediately
  ```javascript
  let user = null;
  fetch('/api/user').then(data => {
    user = data;
  });
  console.log(user); // null! Promise hasn't resolved yet
  ```

- ❌ **Mistake:** Using async when not needed (adds unnecessary complexity)
  ```javascript
  // Overkill for synchronous operations
  async function add(a, b) {
    return a + b; // No async operation here
  }
  ```

- ✅ **Correct:** Understand execution order and use async for I/O operations
  ```javascript
  let user = null;

  fetch('/api/user')
    .then(data => {
      user = data;
      console.log(user); // Correct: logs when data arrives
    });

  console.log(user); // null - this runs first
  ```

### Follow-up Questions

- "What is the JavaScript event loop and how does it enable asynchronous execution?"
- "Can you explain the difference between parallelism and concurrency in JavaScript?"
- "How would you handle multiple async operations that depend on each other?"
- "What are the performance implications of using too many async operations?"
- "How does Node.js handle asynchronous I/O differently from the browser?"

### Resources

- [MDN: Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [JavaScript.info: Introduction to callbacks](https://javascript.info/callbacks)
- [JavaScript.info: Promise](https://javascript.info/promise-basics)
- [Understanding the Event Loop](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

---

## Question 2: Explain the JavaScript event loop, call stack, and callback queue

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-15 minutes
**Companies:** Google, Meta, Amazon, Netflix, Uber

### Question
How does the JavaScript event loop work? Explain the role of the call stack, callback queue (task queue), and microtask queue in the execution model.

### Answer

**Call Stack:**
- **LIFO** (Last In, First Out) data structure
- Keeps track of **function execution contexts**
- JavaScript is **single-threaded**, so only one stack
- When stack is empty, event loop checks queues

**Callback Queue (Task Queue/Macrotask Queue):**
- Holds **callbacks** from async operations (setTimeout, setInterval, I/O)
- Processed **after** call stack is empty
- **One task per event loop iteration**
- Examples: setTimeout, setInterval, setImmediate (Node.js)

**Microtask Queue:**
- **Higher priority** than callback queue
- Processed **immediately** after current task completes
- **All microtasks** execute before next macrotask
- Examples: Promise callbacks (.then, .catch, .finally), queueMicrotask, MutationObserver

**Event Loop Process:**
1. Execute code on call stack
2. When stack is empty, check microtask queue
3. Execute **all** microtasks
4. Check callback queue, execute **one** macrotask
5. Repeat from step 2

### Code Example

```javascript
// ============================================
// Example 1: Basic event loop demonstration
// ============================================
console.log('1: Start');

setTimeout(() => {
  console.log('2: setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise');
});

console.log('4: End');

// Output:
// 1: Start
// 4: End
// 3: Promise (microtask - executes first)
// 2: setTimeout (macrotask - executes after microtasks)

// Explanation:
// 1. "Start" and "End" execute synchronously on call stack
// 2. setTimeout callback goes to macrotask queue
// 3. Promise callback goes to microtask queue
// 4. Microtasks execute before macrotasks


// ============================================
// Example 2: Call stack visualization
// ============================================
function third() {
  console.log('third');
  // Call stack: [global, first, second, third]
}

function second() {
  console.log('second');
  third();
  // Call stack: [global, first, second]
}

function first() {
  console.log('first');
  second();
  // Call stack: [global, first]
}

first();
// Call stack: [global]

// Call stack evolution:
// [global] → [global, first] → [global, first, second]
// → [global, first, second, third] → [global, first, second]
// → [global, first] → [global] → []


// ============================================
// Example 3: Multiple microtasks vs macrotasks
// ============================================
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve().then(() => console.log('Promise 1'));
Promise.resolve().then(() => console.log('Promise 2'));

console.log('End');

// Output:
// Start
// End
// Promise 1
// Promise 2
// Timeout 1
// Timeout 2

// All microtasks (Promise 1 & 2) complete before any macrotask (Timeout 1 & 2)


// ============================================
// Example 4: Nested microtasks and macrotasks
// ============================================
console.log('Script start');

setTimeout(() => {
  console.log('setTimeout 1');

  Promise.resolve().then(() => {
    console.log('Promise in setTimeout 1');
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');

    setTimeout(() => {
      console.log('setTimeout in Promise 1');
    }, 0);
  })
  .then(() => {
    console.log('Promise 2');
  });

console.log('Script end');

// Output:
// Script start
// Script end
// Promise 1
// Promise 2
// setTimeout 1
// Promise in setTimeout 1
// setTimeout in Promise 1


// ============================================
// Example 5: Chained promises (all microtasks)
// ============================================
Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    return Promise.resolve();
  })
  .then(() => {
    console.log('Promise 2');
  })
  .then(() => {
    console.log('Promise 3');
  });

setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('Sync');

// Output:
// Sync
// Promise 1
// Promise 2
// Promise 3
// Timeout


// ============================================
// Example 6: Stack overflow example
// ============================================

// ❌ Synchronous recursion - stack overflow
function recursiveSync(n) {
  if (n === 0) return;
  recursiveSync(n - 1); // Grows call stack
}

// recursiveSync(100000); // RangeError: Maximum call stack size exceeded

// ✅ Async recursion - no stack overflow
function recursiveAsync(n) {
  if (n === 0) return;

  setTimeout(() => {
    recursiveAsync(n - 1); // Stack clears between calls
  }, 0);
}

recursiveAsync(100000); // Works! Each call starts with empty stack


// ============================================
// Example 7: queueMicrotask API
// ============================================
console.log('Start');

setTimeout(() => console.log('Timeout'), 0);

queueMicrotask(() => {
  console.log('Microtask 1');
});

Promise.resolve().then(() => {
  console.log('Promise');
});

queueMicrotask(() => {
  console.log('Microtask 2');
});

console.log('End');

// Output:
// Start
// End
// Microtask 1
// Promise
// Microtask 2
// Timeout


// ============================================
// Example 8: Complex event loop scenario
// ============================================
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end'); // Microtask
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1();

new Promise((resolve) => {
  console.log('promise1');
  resolve();
}).then(() => {
  console.log('promise2');
});

console.log('script end');

// Output:
// script start
// async1 start
// async2
// promise1
// script end
// async1 end (microtask)
// promise2 (microtask)
// setTimeout (macrotask)


// ============================================
// Example 9: Visualizing with delays
// ============================================
console.log('1: Sync');

setTimeout(() => {
  console.log('2: Macro 1');

  Promise.resolve().then(() => {
    console.log('3: Micro inside Macro 1');
  });

  setTimeout(() => {
    console.log('4: Macro inside Macro 1');
  }, 0);
}, 0);

Promise.resolve()
  .then(() => {
    console.log('5: Micro 1');

    return new Promise(resolve => {
      setTimeout(() => {
        console.log('6: Macro inside Micro 1');
        resolve();
      }, 0);
    });
  })
  .then(() => {
    console.log('7: Micro 2');
  });

console.log('8: Sync');

// Output:
// 1: Sync
// 8: Sync
// 5: Micro 1
// 2: Macro 1
// 3: Micro inside Macro 1
// 6: Macro inside Micro 1
// 7: Micro 2
// 4: Macro inside Macro 1


// ============================================
// Example 10: Blocking the event loop
// ============================================

// ❌ Bad: Long-running task blocks event loop
function blockingTask() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Blocks event loop for 3 seconds
  }
  console.log('Blocking task done');
}

setTimeout(() => console.log('This will be delayed'), 0);
blockingTask(); // Blocks everything
// "This will be delayed" won't execute until blockingTask completes

// ✅ Good: Break into chunks
async function nonBlockingTask() {
  for (let i = 0; i < 1000; i++) {
    // Do some work

    if (i % 100 === 0) {
      // Yield to event loop every 100 iterations
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  console.log('Non-blocking task done');
}

setTimeout(() => console.log('This will execute'), 0);
nonBlockingTask(); // Event loop can process other tasks


// ============================================
// Example 11: Node.js setImmediate vs setTimeout
// ============================================
// In Node.js, setImmediate has special behavior

setTimeout(() => {
  console.log('setTimeout');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});

// Output order is NOT guaranteed outside I/O cycle
// But within I/O cycle, setImmediate always executes first

const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('setTimeout in I/O');
  }, 0);

  setImmediate(() => {
    console.log('setImmediate in I/O'); // Always first
  });
});


// ============================================
// Example 12: MutationObserver (microtask in browser)
// ============================================
const observer = new MutationObserver(() => {
  console.log('DOM mutation'); // Microtask
});

observer.observe(document.body, { childList: true });

console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

document.body.appendChild(document.createElement('div')); // Triggers observer

console.log('End');

// Output:
// Start
// End
// DOM mutation (microtask)
// Timeout (macrotask)
```

### Common Mistakes

- ❌ **Mistake:** Thinking setTimeout(fn, 0) executes immediately
  ```javascript
  setTimeout(() => console.log('Later'), 0);
  console.log('Now');
  // Output: Now, Later (not Later, Now)
  ```

- ❌ **Mistake:** Not understanding microtask priority
  ```javascript
  setTimeout(() => console.log('Timeout'), 0);
  Promise.resolve().then(() => console.log('Promise'));
  // Output: Promise, Timeout (not Timeout, Promise)
  ```

- ❌ **Mistake:** Blocking the event loop with long-running sync code
  ```javascript
  // This freezes the entire app
  while (true) {
    // CPU-intensive work
  }
  ```

- ✅ **Correct:** Understand execution order and break up long tasks
  ```javascript
  // Proper order understanding
  console.log('1: Sync');
  setTimeout(() => console.log('3: Macro'), 0);
  Promise.resolve().then(() => console.log('2: Micro'));

  // Breaking up long tasks
  async function processLargeArray(items) {
    for (let i = 0; i < items.length; i++) {
      processItem(items[i]);

      if (i % 1000 === 0) {
        await new Promise(r => setTimeout(r, 0)); // Yield
      }
    }
  }
  ```

### Follow-up Questions

- "What happens if a microtask creates another microtask infinitely?"
- "How would you debug an event loop blocking issue in production?"
- "What is the difference between process.nextTick and setImmediate in Node.js?"
- "Can you explain the phases of the Node.js event loop?"
- "How do Web Workers relate to the event loop?"

### Resources

- [MDN: Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [JavaScript.info: Event loop](https://javascript.info/event-loop)
- [What the heck is the event loop anyway? (Video)](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [Jake Archibald: In The Loop (Video)](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
- [Node.js Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

---

## Question 3: How do Promises work in JavaScript? Explain promise chaining and error handling

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

## Question 4: Explain async/await syntax. How does it differ from promises?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Netflix, Airbnb

### Question
What is async/await in JavaScript? How does it compare to using promises with .then()? What are the advantages and potential pitfalls of async/await?

### Answer

**Async/Await Basics:**
- **Syntactic sugar** over promises, not a replacement
- `async` function **always returns a promise**
- `await` **pauses** function execution until promise settles
- Makes asynchronous code **look synchronous**

**Key Characteristics:**
- `await` can only be used inside `async` functions (or top-level in modules)
- `await` unwraps promise value (no need for .then())
- Errors can be caught with **try/catch** blocks
- Still **non-blocking** - other code continues to execute
- Returns are automatically wrapped in `Promise.resolve()`

**Advantages over .then():**
- More **readable**, resembles synchronous code
- Easier **error handling** with try/catch
- Better **debugging** (clearer stack traces)
- Simpler **conditionals and loops** with async operations

**Potential Pitfalls:**
- Sequential `await` calls may be **slower** than Promise.all
- Easy to forget `await`, getting promise instead of value
- Try/catch can hide errors if not careful
- Cannot await in regular functions

### Code Example

```javascript
// ============================================
// Example 1: Basic async/await syntax
// ============================================

// Promise-based approach
function getUserPromise(id) {
  return fetch(`/api/user/${id}`)
    .then(response => response.json())
    .then(user => {
      console.log('User:', user);
      return user;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

// Async/await approach (cleaner)
async function getUserAsync(id) {
  try {
    const response = await fetch(`/api/user/${id}`);
    const user = await response.json();
    console.log('User:', user);
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


// ============================================
// Example 2: Async functions always return promises
// ============================================
async function returnNumber() {
  return 42; // Automatically wrapped in Promise.resolve(42)
}

returnNumber().then(num => {
  console.log(num); // 42
});

// Equivalent to:
function returnNumberPromise() {
  return Promise.resolve(42);
}

// Throwing in async function creates rejected promise
async function throwError() {
  throw new Error('Failed'); // Automatically wrapped in Promise.reject()
}

throwError().catch(error => {
  console.error(error.message); // 'Failed'
});


// ============================================
// Example 3: Error handling comparison
// ============================================

// With promises - single catch
fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error('Error:', error));

// With async/await - try/catch
async function loadUserAndPosts() {
  try {
    const userResponse = await fetch('/api/user');
    const user = await userResponse.json();

    const postsResponse = await fetch(`/api/posts/${user.id}`);
    const posts = await postsResponse.json();

    console.log(posts);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Multiple try/catch blocks for granular error handling
async function loadDataWithGranularErrors() {
  let user;

  try {
    const response = await fetch('/api/user');
    user = await response.json();
  } catch (error) {
    console.error('Failed to load user:', error);
    return; // Exit early
  }

  try {
    const response = await fetch(`/api/posts/${user.id}`);
    const posts = await response.json();
    console.log('Posts:', posts);
  } catch (error) {
    console.error('Failed to load posts (continuing anyway):', error);
    // Continue with user data only
  }

  return user;
}


// ============================================
// Example 4: Sequential vs parallel execution
// ============================================

// ❌ Slow: Sequential execution (3 seconds total)
async function loadSequential() {
  const user1 = await fetch('/api/user/1').then(r => r.json()); // 1s
  const user2 = await fetch('/api/user/2').then(r => r.json()); // 1s
  const user3 = await fetch('/api/user/3').then(r => r.json()); // 1s

  return [user1, user2, user3];
}

// ✅ Fast: Parallel execution (1 second total)
async function loadParallel() {
  const [user1, user2, user3] = await Promise.all([
    fetch('/api/user/1').then(r => r.json()),
    fetch('/api/user/2').then(r => r.json()),
    fetch('/api/user/3').then(r => r.json())
  ]);

  return [user1, user2, user3];
}

// Alternative parallel syntax
async function loadParallelAlt() {
  // Start all requests simultaneously
  const promise1 = fetch('/api/user/1').then(r => r.json());
  const promise2 = fetch('/api/user/2').then(r => r.json());
  const promise3 = fetch('/api/user/3').then(r => r.json());

  // Wait for all to complete
  const user1 = await promise1;
  const user2 = await promise2;
  const user3 = await promise3;

  return [user1, user2, user3];
}


// ============================================
// Example 5: Conditional logic with async/await
// ============================================

// Complex with promises
function loadUserDataPromise(userId, includePosts) {
  return fetch(`/api/user/${userId}`)
    .then(response => response.json())
    .then(user => {
      if (includePosts) {
        return fetch(`/api/posts/${userId}`)
          .then(response => response.json())
          .then(posts => {
            user.posts = posts;
            return user;
          });
      }
      return user;
    });
}

// Cleaner with async/await
async function loadUserDataAsync(userId, includePosts) {
  const response = await fetch(`/api/user/${userId}`);
  const user = await response.json();

  if (includePosts) {
    const postsResponse = await fetch(`/api/posts/${userId}`);
    user.posts = await postsResponse.json();
  }

  return user;
}


// ============================================
// Example 6: Loops with async/await
// ============================================

// Processing items sequentially
async function processItemsSequential(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item); // Wait for each
    results.push(result);
  }

  return results;
}

// Processing items in parallel (faster)
async function processItemsParallel(items) {
  const promises = items.map(item => processItem(item));
  return await Promise.all(promises);
}

// Processing with concurrency limit
async function processItemsWithLimit(items, limit = 5) {
  const results = [];

  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    results.push(...batchResults);
  }

  return results;
}


// ============================================
// Example 7: Top-level await (ES2022)
// ============================================

// In module files (.mjs or type: "module")
// No need for async wrapper

// Old way:
(async () => {
  const data = await fetch('/api/data').then(r => r.json());
  console.log(data);
})();

// New way (top-level await):
const data = await fetch('/api/data').then(r => r.json());
console.log(data);

// Useful for module initialization
const config = await fetch('/config.json').then(r => r.json());
export default config;


// ============================================
// Example 8: Async/await with Promise.all variants
// ============================================

// Promise.all - fails fast
async function loadAllUsers(ids) {
  try {
    const users = await Promise.all(
      ids.map(id => fetch(`/api/user/${id}`).then(r => r.json()))
    );
    return users; // All succeeded
  } catch (error) {
    console.error('At least one request failed:', error);
    return [];
  }
}

// Promise.allSettled - never rejects
async function loadAllUsersSettled(ids) {
  const results = await Promise.allSettled(
    ids.map(id => fetch(`/api/user/${id}`).then(r => r.json()))
  );

  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  console.log(`Loaded ${successful.length}, failed ${failed.length}`);
  return successful;
}

// Promise.race - first to settle
async function loadWithFallback(primaryUrl, fallbackUrl) {
  try {
    const result = await Promise.race([
      fetch(primaryUrl).then(r => r.json()),
      fetch(fallbackUrl).then(r => r.json())
    ]);
    return result; // Whichever completes first
  } catch (error) {
    console.error('Both requests failed:', error);
    throw error;
  }
}


// ============================================
// Example 9: Retry logic with async/await
// ============================================
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json(); // Success
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying...`);

      // Wait before retry (exponential backoff)
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Usage
try {
  const data = await fetchWithRetry('/api/data', 3);
  console.log('Data:', data);
} catch (error) {
  console.error('All retries exhausted:', error.message);
}


// ============================================
// Example 10: Timeout with async/await
// ============================================
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([
      fetch(url),
      timeout(ms)
    ]);

    return await response.json();
  } catch (error) {
    if (error.message === 'Timeout') {
      console.error(`Request timed out after ${ms}ms`);
    }
    throw error;
  }
}

// Usage
try {
  const data = await fetchWithTimeout('/api/slow-endpoint', 3000);
  console.log('Data:', data);
} catch (error) {
  console.error('Request failed:', error.message);
}


// ============================================
// Example 11: Common pitfalls
// ============================================

// ❌ Pitfall 1: Forgetting await
async function loadUserPitfall(id) {
  const user = fetch(`/api/user/${id}`).then(r => r.json());
  console.log(user); // Promise, not user data!
  return user;
}

// ✅ Correct: Always await
async function loadUserCorrect(id) {
  const user = await fetch(`/api/user/${id}`).then(r => r.json());
  console.log(user); // Actual user data
  return user;
}

// ❌ Pitfall 2: Using await in non-async function
function regularFunction() {
  // const data = await fetch('/api/data'); // SyntaxError!
}

// ✅ Correct: Make function async
async function asyncFunction() {
  const data = await fetch('/api/data');
  return data;
}

// ❌ Pitfall 3: Swallowing errors with empty catch
async function silentFailure() {
  try {
    await fetch('/api/data');
  } catch (error) {
    // Empty catch - error disappears!
  }
}

// ✅ Correct: Handle or re-throw errors
async function properErrorHandling() {
  try {
    await fetch('/api/data');
  } catch (error) {
    console.error('Error occurred:', error);
    throw error; // Or handle appropriately
  }
}


// ============================================
// Example 12: Real-world patterns
// ============================================

// Data fetching with loading states
class DataLoader {
  constructor() {
    this.cache = new Map();
  }

  async fetchUser(id) {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    try {
      const response = await fetch(`/api/user/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const user = await response.json();

      // Cache result
      this.cache.set(id, user);

      return user;
    } catch (error) {
      console.error(`Failed to load user ${id}:`, error);
      throw error;
    }
  }

  async fetchMultipleUsers(ids) {
    const results = await Promise.allSettled(
      ids.map(id => this.fetchUser(id))
    );

    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
  }
}

// Usage
const loader = new DataLoader();

async function displayUsers() {
  try {
    const users = await loader.fetchMultipleUsers([1, 2, 3]);
    console.log('Loaded users:', users);
  } catch (error) {
    console.error('Failed to display users:', error);
  }
}


// ============================================
// Example 13: Async iterators
// ============================================
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();

    yield data.items; // Yield page data

    hasMore = data.hasNext;
    page++;
  }
}

// Usage
async function processAllPages() {
  for await (const items of fetchPages('/api/items')) {
    console.log('Processing page:', items.length);
    // Process items...
  }
}
```

### Common Mistakes

- ❌ **Mistake:** Forgetting to await async function calls
  ```javascript
  async function getData() {
    const data = fetchData(); // Missing await!
    console.log(data); // Promise, not data
  }
  ```

- ❌ **Mistake:** Making everything sequential when it doesn't need to be
  ```javascript
  // Slow: 6 seconds total
  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  // Fast: 2 seconds total (all parallel)
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  ```

- ❌ **Mistake:** Using async/await with array methods incorrectly
  ```javascript
  // Doesn't work as expected!
  const results = items.map(async item => {
    return await processItem(item);
  }); // results is array of promises!

  // Correct:
  const results = await Promise.all(
    items.map(async item => await processItem(item))
  );
  ```

- ✅ **Correct:** Understand when to parallelize and how to handle arrays
  ```javascript
  // Sequential when order matters
  for (const item of items) {
    await processItem(item);
  }

  // Parallel when order doesn't matter
  await Promise.all(items.map(item => processItem(item)));
  ```

### Follow-up Questions

- "How would you implement a queue system for async operations with concurrency control?"
- "What happens if you don't await an async function - where does the error go?"
- "Can you use async/await with setTimeout? How would you implement sleep()?"
- "How do async generators work and when would you use them?"
- "What are the performance implications of using async/await vs raw promises?"

### Resources

- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [JavaScript.info: Async/await](https://javascript.info/async-await)
- [Async/Await Best Practices](https://maximorlov.com/linting-rules-for-asynchronous-code-in-javascript/)

---

## Question 5: Explain Promise.all, Promise.race, Promise.allSettled, and Promise.any

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

## Question 6: Explain microtasks vs macrotasks and their execution order

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-12 minutes
**Companies:** Google, Meta, Netflix, Uber

### Question
What is the difference between microtasks and macrotasks in JavaScript? How does their execution order work in the event loop? Give examples of each.

### Answer

**Macrotasks (Task Queue):**
- **Examples:** setTimeout, setInterval, setImmediate (Node.js), I/O operations, UI rendering
- Added to **task queue**
- **One macrotask** processed per event loop iteration
- Lower priority than microtasks
- Represent "major" units of work

**Microtasks (Microtask Queue):**
- **Examples:** Promise callbacks (.then, .catch, .finally), queueMicrotask, MutationObserver, process.nextTick (Node.js)
- Added to **microtask queue**
- **ALL microtasks** processed before next macrotask
- Higher priority - always execute before macrotasks
- Represent "smaller" units of work that should complete quickly

**Execution Order:**
1. Execute synchronous code (call stack)
2. Execute **ALL** microtasks in queue
3. Render UI (if needed)
4. Execute **ONE** macrotask
5. Repeat from step 2

**Key Difference:**
- Macrotasks: One per loop iteration
- Microtasks: ALL before next macrotask

### Code Example

```javascript
// ============================================
// Example 1: Basic microtask vs macrotask
// ============================================
console.log('1: Sync start');

setTimeout(() => {
  console.log('2: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

console.log('4: Sync end');

// Output:
// 1: Sync start
// 4: Sync end
// 3: Microtask (Promise)
// 2: Macrotask (setTimeout)


// ============================================
// Example 2: Multiple microtasks before macrotask
// ============================================
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve().then(() => console.log('Promise 1'));
Promise.resolve().then(() => console.log('Promise 2'));
Promise.resolve().then(() => console.log('Promise 3'));

console.log('End');

// Output:
// Start
// End
// Promise 1
// Promise 2
// Promise 3
// Timeout 1
// Timeout 2

// All 3 microtasks complete before any macrotask


// ============================================
// Example 3: Nested microtasks
// ============================================
console.log('Start');

Promise.resolve()
  .then(() => {
    console.log('Promise 1');

    // Creates new microtask
    Promise.resolve().then(() => {
      console.log('Promise 2 (nested)');
    });

    console.log('Promise 1 continued');
  })
  .then(() => {
    console.log('Promise 3');
  });

setTimeout(() => console.log('Timeout'), 0);

console.log('End');

// Output:
// Start
// End
// Promise 1
// Promise 1 continued
// Promise 2 (nested)
// Promise 3
// Timeout


// ============================================
// Example 4: queueMicrotask API
// ============================================
console.log('Start');

setTimeout(() => console.log('Macrotask'), 0);

queueMicrotask(() => {
  console.log('Microtask 1');

  queueMicrotask(() => {
    console.log('Microtask 2 (nested)');
  });
});

Promise.resolve().then(() => console.log('Promise'));

console.log('End');

// Output:
// Start
// End
// Microtask 1
// Promise
// Microtask 2 (nested)
// Macrotask


// ============================================
// Example 5: Microtask queue starvation
// ============================================

// ⚠️ Warning: This creates infinite microtasks
function infiniteMicrotasks() {
  Promise.resolve().then(() => {
    console.log('Microtask');
    infiniteMicrotasks(); // Creates another microtask
  });
}

// infiniteMicrotasks(); // Never reaches macrotask queue!

// Macrotasks allow other work between iterations
function safeMacrotasks() {
  setTimeout(() => {
    console.log('Macrotask');
    safeMacrotasks(); // Allows other tasks to run
  }, 0);
}


// ============================================
// Example 6: Event loop iteration visualization
// ============================================
console.log('=== Iteration 1 ===');
console.log('Sync 1');

setTimeout(() => console.log('Macro 1'), 0);
setTimeout(() => console.log('Macro 2'), 0);

Promise.resolve().then(() => {
  console.log('Micro 1');

  setTimeout(() => console.log('Macro 3'), 0);

  Promise.resolve().then(() => console.log('Micro 2'));
});

console.log('Sync 2');

// Execution breakdown:
//
// Call Stack (Synchronous):
//   - Sync 1
//   - Sync 2
//
// Microtask Queue (All execute):
//   - Micro 1 → adds Macro 3 and Micro 2
//   - Micro 2
//
// Macrotask Queue (One per iteration):
//   - Iteration 2: Macro 1
//   - Iteration 3: Macro 2
//   - Iteration 4: Macro 3


// ============================================
// Example 7: Promise timing nuances
// ============================================
Promise.resolve().then(() => {
  console.log('Promise then 1');
}).then(() => {
  console.log('Promise then 2');
});

queueMicrotask(() => {
  console.log('queueMicrotask');
});

// Output:
// Promise then 1
// queueMicrotask
// Promise then 2

// Why? First .then() completes, adding second .then() to queue
// queueMicrotask was already in queue before second .then()


// ============================================
// Example 8: Async/await and microtasks
// ============================================
async function asyncFunc() {
  console.log('Async start');

  await Promise.resolve(); // Yields to microtask queue

  console.log('After await'); // Microtask
}

console.log('Start');

setTimeout(() => console.log('Timeout'), 0);

asyncFunc();

console.log('End');

// Output:
// Start
// Async start
// End
// After await (microtask)
// Timeout (macrotask)


// ============================================
// Example 9: Node.js process.nextTick (special microtask)
// ============================================
// In Node.js, process.nextTick has even higher priority

console.log('Start');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => console.log('Promise'));

process.nextTick(() => console.log('nextTick'));

console.log('End');

// Output (Node.js):
// Start
// End
// nextTick (highest priority)
// Promise (regular microtask)
// Timeout (macrotask)


// ============================================
// Example 10: Real-world implications
// ============================================

// Problem: UI blocking with too many microtasks
function processItems(items) {
  items.forEach(item => {
    // Each creates microtask - blocks UI rendering
    Promise.resolve().then(() => processItem(item));
  });
}

// Solution: Break into macrotasks
async function processItemsSafe(items) {
  for (const item of items) {
    processItem(item);

    // Yield to event loop every 100 items
    if (items.indexOf(item) % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}


// ============================================
// Example 11: Detailed execution trace
// ============================================
console.log('1: Script start');

setTimeout(() => {
  console.log('2: setTimeout 1');

  Promise.resolve().then(() => {
    console.log('3: Promise in setTimeout 1');
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('4: Promise 1');

    setTimeout(() => {
      console.log('5: setTimeout in Promise 1');
    }, 0);
  })
  .then(() => {
    console.log('6: Promise 2');
  });

setTimeout(() => {
  console.log('7: setTimeout 2');
}, 0);

Promise.resolve().then(() => {
  console.log('8: Promise 3');
});

console.log('9: Script end');

// Output:
// 1: Script start
// 9: Script end
// 4: Promise 1
// 8: Promise 3
// 6: Promise 2
// 2: setTimeout 1
// 3: Promise in setTimeout 1
// 7: setTimeout 2
// 5: setTimeout in Promise 1


// ============================================
// Example 12: Browser rendering and tasks
// ============================================

// Microtasks can delay rendering
button.addEventListener('click', () => {
  // Starts paint cycle
  element.style.background = 'red';

  // Blocks painting (runs before render)
  Promise.resolve().then(() => {
    doHeavyWork(); // Delays paint
  });
});

// Macrotasks allow rendering between tasks
button.addEventListener('click', () => {
  element.style.background = 'red';

  // Allows paint to happen first
  setTimeout(() => {
    doHeavyWork();
  }, 0);
});


// ============================================
// Example 13: Complex nesting scenario
// ============================================
console.log('A');

setTimeout(() => {
  console.log('B');
  Promise.resolve().then(() => console.log('C'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('D');
    setTimeout(() => console.log('E'), 0);
  })
  .then(() => {
    console.log('F');
  });

setTimeout(() => {
  console.log('G');
  Promise.resolve().then(() => console.log('H'));
}, 0);

Promise.resolve().then(() => {
  console.log('I');
});

console.log('J');

// Output:
// A
// J
// D
// I
// F
// B
// C
// G
// H
// E


// ============================================
// Example 14: Understanding "run to completion"
// ============================================

// Each task runs to completion before next task
setTimeout(() => {
  console.log('Task 1 start');

  // Long-running synchronous code blocks everything
  for (let i = 0; i < 1000000000; i++) {}

  console.log('Task 1 end');
}, 0);

setTimeout(() => {
  console.log('Task 2'); // Waits for Task 1 to complete
}, 0);


// ============================================
// Example 15: Microtask checkpoint timing
// ============================================
console.log('Start');

// Macrotask 1
setTimeout(() => {
  console.log('Timeout 1');

  // Adds to microtask queue
  Promise.resolve()
    .then(() => console.log('Micro A'))
    .then(() => console.log('Micro B'));
}, 0);

// Macrotask 2
setTimeout(() => {
  console.log('Timeout 2');

  Promise.resolve().then(() => console.log('Micro C'));
}, 0);

console.log('End');

// Output:
// Start
// End
// Timeout 1 (first macrotask)
// Micro A (microtasks after macrotask)
// Micro B
// Timeout 2 (second macrotask)
// Micro C (microtasks after second macrotask)
```

### Common Mistakes

- ❌ **Mistake:** Thinking setTimeout(fn, 0) executes before promises
  ```javascript
  setTimeout(() => console.log('Timeout'), 0);
  Promise.resolve().then(() => console.log('Promise'));
  // Output: Promise, Timeout (not Timeout, Promise)
  ```

- ❌ **Mistake:** Creating too many microtasks (starving macrotasks)
  ```javascript
  // Blocks event loop indefinitely
  function recurse() {
    Promise.resolve().then(recurse);
  }
  recurse(); // UI freezes, no rendering
  ```

- ❌ **Mistake:** Not understanding microtask queue draining
  ```javascript
  Promise.resolve().then(() => {
    console.log('A');
    Promise.resolve().then(() => console.log('B'));
  });
  setTimeout(() => console.log('C'), 0);

  // Output: A, B, C
  // B executes before C (all microtasks first)
  ```

- ✅ **Correct:** Understand execution phases and priorities
  ```javascript
  // Synchronous code → Microtasks → Macrotask → repeat
  console.log('1: Sync');
  Promise.resolve().then(() => console.log('2: Micro'));
  setTimeout(() => console.log('3: Macro'), 0);
  // Always: 1, 2, 3
  ```

### Follow-up Questions

- "How does queueMicrotask differ from Promise.resolve().then()?"
- "What is process.nextTick in Node.js and how does it fit into the event loop?"
- "Can you have too many microtasks? What happens to performance?"
- "How do MutationObserver callbacks fit into this model?"
- "What is the relationship between requestAnimationFrame and these queues?"

### Resources

- [MDN: Microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- [JavaScript.info: Microtasks](https://javascript.info/microtask-queue)
- [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [Node.js: Event Loop Phases](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

---

## Question 7: What are common async patterns and anti-patterns in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-12 minutes
**Companies:** Google, Meta, Amazon, Airbnb

### Question
What are some common patterns for handling asynchronous code in JavaScript? What are the anti-patterns to avoid? How do you handle error propagation and cancellation?

### Answer

**Common Patterns:**
- **Sequential execution:** One operation after another (using await)
- **Parallel execution:** Multiple operations simultaneously (Promise.all)
- **Retry logic:** Attempt operations with exponential backoff
- **Timeout:** Limit operation duration with Promise.race
- **Debounce/throttle:** Control operation frequency
- **Cancellation:** AbortController for fetch requests
- **Queue:** Process items with concurrency limit

**Anti-Patterns:**
- **Promise hell:** Excessive nesting of promises
- **Missing error handling:** Unhandled promise rejections
- **Sequential when parallel:** Not using Promise.all
- **Blocking event loop:** Long synchronous operations
- **Memory leaks:** Not cleaning up listeners/timers

**Error Handling Best Practices:**
- Always add .catch() or try/catch
- Propagate errors appropriately
- Provide context in error messages
- Use finally for cleanup
- Handle partial failures with allSettled

### Code Example

```javascript
// ============================================
// Pattern 1: Sequential execution
// ============================================
async function loadUserData(userId) {
  // Operations that depend on previous results
  const user = await fetchUser(userId);
  const preferences = await fetchPreferences(user.id);
  const history = await fetchHistory(user.id, preferences.limit);

  return { user, preferences, history };
}


// ============================================
// Pattern 2: Parallel execution
// ============================================
async function loadDashboard(userId) {
  // Independent operations can run in parallel
  const [user, stats, notifications, friends] = await Promise.all([
    fetchUser(userId),
    fetchStats(userId),
    fetchNotifications(userId),
    fetchFriends(userId)
  ]);

  return { user, stats, notifications, friends };
}


// ============================================
// Pattern 3: Retry with exponential backoff
// ============================================
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (i < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000;
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}


// ============================================
// Pattern 4: Timeout wrapper
// ============================================
function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]);
}

// Usage
try {
  const data = await withTimeout(
    fetch('/api/slow-endpoint'),
    5000
  );
} catch (error) {
  if (error.message === 'Operation timed out') {
    console.error('Request took too long');
  }
}


// ============================================
// Pattern 5: Debounce (async version)
// ============================================
function debounce(func, delay) {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        resolve(await func.apply(this, args));
      }, delay);
    });
  };
}

// Usage
const debouncedSearch = debounce(async (query) => {
  const results = await fetch(`/api/search?q=${query}`);
  return results.json();
}, 300);

// Only last call within 300ms executes
debouncedSearch('hello');
debouncedSearch('hello world'); // Only this executes


// ============================================
// Pattern 6: AbortController for cancellation
// ============================================
async function searchWithCancel(query, signal) {
  try {
    const response = await fetch(`/api/search?q=${query}`, { signal });
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Search cancelled');
      return null;
    }
    throw error;
  }
}

// Usage
const controller = new AbortController();

searchWithCancel('query', controller.signal);

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

// Or cancel on user action
button.addEventListener('click', () => controller.abort());


// ============================================
// Pattern 7: Queue with concurrency limit
// ============================================
class AsyncQueue {
  constructor(concurrency = 5) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  async add(asyncFn) {
    while (this.running >= this.concurrency) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.running++;

    try {
      return await asyncFn();
    } finally {
      this.running--;
      const resolve = this.queue.shift();
      if (resolve) resolve();
    }
  }
}

// Usage
const queue = new AsyncQueue(3); // Max 3 concurrent

const tasks = Array.from({ length: 100 }, (_, i) =>
  queue.add(() => fetchUser(i))
);

const results = await Promise.all(tasks);


// ============================================
// Pattern 8: Graceful degradation
// ============================================
async function loadDataWithFallback(userId) {
  let data = {};

  // Critical data - must succeed
  try {
    data.user = await fetchUser(userId);
  } catch (error) {
    console.error('Failed to load user');
    throw error; // Can't continue without user
  }

  // Optional data - continue if fails
  try {
    data.preferences = await fetchPreferences(userId);
  } catch (error) {
    console.warn('Using default preferences');
    data.preferences = DEFAULT_PREFERENCES;
  }

  // Optional data - just skip if fails
  try {
    data.recommendations = await fetchRecommendations(userId);
  } catch (error) {
    console.warn('Recommendations unavailable');
    // Don't set recommendations key
  }

  return data;
}


// ============================================
// Anti-Pattern 1: Promise hell (nested promises)
// ============================================

// ❌ Bad: Nested promises
fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    fetch(`/api/posts/${user.id}`)
      .then(response => response.json())
      .then(posts => {
        fetch(`/api/comments/${posts[0].id}`)
          .then(response => response.json())
          .then(comments => {
            console.log(comments);
          });
      });
  });

// ✅ Good: Flat promise chain
fetch('/api/user')
  .then(r => r.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(r => r.json())
  .then(posts => fetch(`/api/comments/${posts[0].id}`))
  .then(r => r.json())
  .then(comments => console.log(comments));

// ✅ Better: Async/await
async function loadData() {
  const user = await fetch('/api/user').then(r => r.json());
  const posts = await fetch(`/api/posts/${user.id}`).then(r => r.json());
  const comments = await fetch(`/api/comments/${posts[0].id}`).then(r => r.json());
  return comments;
}


// ============================================
// Anti-Pattern 2: Unhandled rejections
// ============================================

// ❌ Bad: No error handling
async function loadUser(id) {
  const response = await fetch(`/api/user/${id}`);
  return response.json(); // What if fetch fails?
}

// ✅ Good: Proper error handling
async function loadUserSafe(id) {
  try {
    const response = await fetch(`/api/user/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to load user ${id}:`, error);
    throw new Error(`User ${id} unavailable: ${error.message}`);
  }
}


// ============================================
// Anti-Pattern 3: Sequential when parallel
// ============================================

// ❌ Bad: Sequential (slow - 9 seconds total)
async function loadAllUsersSlow(ids) {
  const users = [];

  for (const id of ids) {
    const user = await fetchUser(id); // Wait 3s each
    users.push(user);
  }

  return users;
}

// ✅ Good: Parallel (fast - 3 seconds total)
async function loadAllUsersFast(ids) {
  return await Promise.all(
    ids.map(id => fetchUser(id))
  );
}


// ============================================
// Anti-Pattern 4: Not returning promises
// ============================================

// ❌ Bad: Missing return
async function loadData() {
  fetch('/api/data').then(r => r.json()); // Missing return!
}

const result = await loadData(); // undefined!

// ✅ Good: Return the promise
async function loadDataCorrect() {
  return fetch('/api/data').then(r => r.json());
}


// ============================================
// Anti-Pattern 5: Async in forEach
// ============================================

// ❌ Bad: forEach doesn't wait for async
async function processItems(items) {
  items.forEach(async (item) => {
    await processItem(item); // forEach doesn't wait!
  });
  console.log('Done'); // Executes immediately!
}

// ✅ Good: Use for...of
async function processItemsCorrect(items) {
  for (const item of items) {
    await processItem(item);
  }
  console.log('Done'); // Executes after all items
}

// ✅ Good: Parallel with Promise.all
async function processItemsParallel(items) {
  await Promise.all(
    items.map(item => processItem(item))
  );
  console.log('Done'); // Executes after all items
}


// ============================================
// Pattern 9: Error aggregation
// ============================================
async function loadMultipleWithErrors(urls) {
  const results = await Promise.allSettled(
    urls.map(url => fetch(url).then(r => r.json()))
  );

  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason.message);

  if (failed.length > 0) {
    console.warn(`${failed.length} requests failed:`, failed);
  }

  if (successful.length === 0) {
    throw new Error('All requests failed');
  }

  return {
    data: successful,
    errors: failed
  };
}


// ============================================
// Pattern 10: Memoization for async functions
// ============================================
function memoizeAsync(fn) {
  const cache = new Map();

  return async function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = await fn.apply(this, args);
    cache.set(key, result);

    return result;
  };
}

// Usage
const fetchUserMemoized = memoizeAsync(async (id) => {
  console.log(`Fetching user ${id}...`);
  return fetch(`/api/user/${id}`).then(r => r.json());
});

await fetchUserMemoized(1); // Fetches from API
await fetchUserMemoized(1); // Returns from cache


// ============================================
// Pattern 11: Cleanup with finally
// ============================================
async function loadWithSpinner(url) {
  showSpinner();

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    showError(error.message);
    throw error;
  } finally {
    hideSpinner(); // Always executes
  }
}


// ============================================
// Pattern 12: Race conditions prevention
// ============================================
class SearchBox {
  constructor() {
    this.lastSearchId = 0;
  }

  async search(query) {
    const searchId = ++this.lastSearchId;

    const results = await fetch(`/api/search?q=${query}`).then(r => r.json());

    // Only use results if this is still the latest search
    if (searchId === this.lastSearchId) {
      this.displayResults(results);
    } else {
      console.log('Ignoring stale results');
    }
  }

  displayResults(results) {
    // Update UI
  }
}


// ============================================
// Pattern 13: Progressive loading
// ============================================
async function loadUserWithProgress(userId, onProgress) {
  onProgress(0, 'Loading user...');
  const user = await fetchUser(userId);

  onProgress(33, 'Loading posts...');
  const posts = await fetchPosts(userId);

  onProgress(66, 'Loading comments...');
  const comments = await fetchComments(userId);

  onProgress(100, 'Complete!');

  return { user, posts, comments };
}

// Usage
await loadUserWithProgress(123, (percent, message) => {
  updateProgressBar(percent);
  updateStatusText(message);
});


// ============================================
// Pattern 14: Lazy loading with cache
// ============================================
class LazyLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }

  async load(key, loader) {
    // Return cached value
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Return in-progress load
    if (this.loading.has(key)) {
      return this.loading.get(key);
    }

    // Start new load
    const promise = loader().then(value => {
      this.cache.set(key, value);
      this.loading.delete(key);
      return value;
    }).catch(error => {
      this.loading.delete(key);
      throw error;
    });

    this.loading.set(key, promise);
    return promise;
  }
}

const loader = new LazyLoader();

// Multiple calls return same promise
Promise.all([
  loader.load('user-1', () => fetchUser(1)),
  loader.load('user-1', () => fetchUser(1)),
  loader.load('user-1', () => fetchUser(1))
]); // Only one actual fetch


// ============================================
// Pattern 15: Batch requests
// ============================================
class BatchLoader {
  constructor(batchFn, delay = 10) {
    this.batchFn = batchFn;
    this.delay = delay;
    this.queue = [];
    this.timeoutId = null;
  }

  load(id) {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, resolve, reject });

      if (!this.timeoutId) {
        this.timeoutId = setTimeout(() => this.flush(), this.delay);
      }
    });
  }

  async flush() {
    const queue = this.queue.slice();
    this.queue = [];
    this.timeoutId = null;

    try {
      const ids = queue.map(item => item.id);
      const results = await this.batchFn(ids);

      queue.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      queue.forEach(item => item.reject(error));
    }
  }
}

// Usage
const userLoader = new BatchLoader(async (ids) => {
  // Fetch multiple users in one request
  return fetch(`/api/users?ids=${ids.join(',')}`).then(r => r.json());
});

// These get batched into single request
const user1 = userLoader.load(1);
const user2 = userLoader.load(2);
const user3 = userLoader.load(3);

const [u1, u2, u3] = await Promise.all([user1, user2, user3]);
```

### Common Mistakes

- ❌ **Mistake:** Using async/await with forEach
  ```javascript
  // Doesn't work as expected!
  items.forEach(async item => {
    await processItem(item); // forEach doesn't wait
  });
  console.log('Done'); // Executes immediately
  ```

- ❌ **Mistake:** Creating promise hell with nesting
  ```javascript
  fetch('/api/user').then(r1 => {
    r1.json().then(user => {
      fetch('/api/posts').then(r2 => {
        // Too nested!
      });
    });
  });
  ```

- ❌ **Mistake:** Not handling all rejection cases
  ```javascript
  const promise = fetch('/api/data'); // No .catch()
  // Unhandled rejection if fetch fails!
  ```

- ✅ **Correct:** Use appropriate patterns for each scenario
  ```javascript
  // Sequential when needed
  for (const item of items) {
    await processItem(item);
  }

  // Parallel when possible
  await Promise.all(items.map(item => processItem(item)));

  // Always handle errors
  try {
    await operation();
  } catch (error) {
    handleError(error);
  }
  ```

### Follow-up Questions

- "How would you implement request deduplication for identical concurrent requests?"
- "What strategies would you use to prevent memory leaks in long-running async operations?"
- "How do you handle token refresh in async API calls?"
- "What's the best way to implement optimistic updates with rollback?"
- "How would you design a resilient retry system with circuit breaker pattern?"

### Resources

- [MDN: Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript Promises: An introduction](https://web.dev/promises/)
- [Async JavaScript Patterns](https://www.patterns.dev/posts/async-patterns/)
- [You Don't Know JS: Async & Performance](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20&%20performance/README.md)

---

> **Navigation:** [← Back to JavaScript](README.md) | [Home](../README.md)
