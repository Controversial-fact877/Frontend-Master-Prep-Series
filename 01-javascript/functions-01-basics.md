# Functions Fundamentals

> **Focus**: JavaScript fundamentals and advanced concepts

---

## Question 1: What are higher-order functions in JavaScript?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Apple

### Question
What are higher-order functions? Provide examples of built-in higher-order functions and explain how to create custom ones.

### Answer

A **higher-order function** is a function that either:
1. Takes one or more functions as arguments, OR
2. Returns a function as its result

Higher-order functions are a fundamental concept in functional programming and are widely used in JavaScript.

1. **Why Higher-Order Functions**
   - Code reusability
   - Abstraction
   - Function composition
   - More declarative code

2. **Built-in Higher-Order Functions**
   - Array methods: `map()`, `filter()`, `reduce()`, `forEach()`, `find()`, `some()`, `every()`
   - `setTimeout()`, `setInterval()`
   - Event listeners

3. **Benefits**
   - Separate concerns (what vs how)
   - Easier to test
   - More maintainable
   - Enables functional programming patterns

### Code Example

```javascript
// 1. FUNCTIONS THAT TAKE FUNCTIONS AS ARGUMENTS

// Array.map() - transforms array
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(num) {
  return num * 2;
});
console.log(doubled); // [2, 4, 6, 8, 10]

// Array.filter() - filters array
const evens = numbers.filter(function(num) {
  return num % 2 === 0;
});
console.log(evens); // [2, 4]

// Array.reduce() - reduces to single value
const sum = numbers.reduce(function(acc, num) {
  return acc + num;
}, 0);
console.log(sum); // 15

// 2. FUNCTIONS THAT RETURN FUNCTIONS

// Function factory
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// 3. CUSTOM HIGHER-ORDER FUNCTION

// Custom forEach implementation
function customForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}

customForEach([1, 2, 3], function(item, index) {
  console.log(`Index ${index}: ${item}`);
});

// 4. FUNCTION COMPOSITION

function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;

const addOneThenDouble = compose(multiplyByTwo, addOne);
console.log(addOneThenDouble(5)); // 12 (5 + 1 = 6, 6 * 2 = 12)

// 5. PRACTICAL EXAMPLE - LOGGER WRAPPER

function withLogging(fn) {
  return function(...args) {
    console.log(`Calling with args:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

const add = (a, b) => a + b;
const addWithLogging = withLogging(add);

addWithLogging(3, 4);
// Calling with args: [3, 4]
// Result: 7
// Returns: 7

// 6. CURRYING (HIGHER-ORDER PATTERN)

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
}

const sum3 = (a, b, c) => a + b + c;
const curriedSum = curry(sum3);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6

// 7. PRACTICAL - RETRY LOGIC

function retry(fn, maxAttempts) {
  return async function(...args) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        console.log(`Attempt ${attempt} failed, retrying...`);
      }
    }
  };
}

const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const fetchWithRetry = retry(fetchData, 3);

// 8. MEMOIZATION (HIGHER-ORDER PATTERN)

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('Returning cached result');
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveOperation = (n) => {
  console.log('Computing...');
  return n * n;
};

const memoized = memoize(expensiveOperation);

console.log(memoized(5)); // Computing... 25
console.log(memoized(5)); // Returning cached result 25
```

### Common Mistakes

- ❌ **Mistake:** Not returning value from callback
  ```javascript
  const numbers = [1, 2, 3];
  const doubled = numbers.map(num => {
    num * 2; // Missing return!
  });
  console.log(doubled); // [undefined, undefined, undefined]
  ```

- ❌ **Mistake:** Breaking closure scope
  ```javascript
  function createFunctions() {
    const funcs = [];
    for (var i = 0; i < 3; i++) {
      funcs.push(function() { return i; }); // All reference same i
    }
    return funcs;
  }

  const functions = createFunctions();
  console.log(functions[0]()); // 3 (not 0!)
  ```

- ✅ **Correct:** Use arrow functions and proper closures
  ```javascript
  const numbers = [1, 2, 3];
  const doubled = numbers.map(num => num * 2); // Implicit return
  console.log(doubled); // [2, 4, 6]
  ```

### Follow-up Questions

- "What is the difference between map() and forEach()?"
- "How does reduce() work internally?"
- "What is function currying?"
- "Explain the concept of function composition"
- "How do higher-order functions help with code reusability?"

### Resources

- [MDN: Higher-Order Functions](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)
- [JavaScript.info: Function Object](https://javascript.info/function-object)
- [Eloquent JavaScript: Higher-Order Functions](https://eloquentjavascript.net/05_higher_order.html)

<details>
<summary><strong>🔍 Deep Dive: Higher-Order Functions Implementation</strong></summary>

**How V8 Handles Higher-Order Functions:**

```javascript
// Your code:
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);

// V8 optimization process:
// 1. Initial interpretation (slow)
// 2. After ~10k calls, TurboFan kicks in
// 3. Inlines callback function
// 4. Eliminates function call overhead

// Optimized assembly (simplified):
// Instead of calling callback 3 times:
//   result[0] = callback(1)
//   result[1] = callback(2)
//   result[2] = callback(3)
//
// TurboFan inlines to:
//   result[0] = 1 * 2
//   result[1] = 2 * 2
//   result[2] = 3 * 2
```

**Closure Memory Implications:**

```javascript
// Functions returned from higher-order functions create closures
function createCounter() {
  let count = 0; // Stored in heap, not garbage collected

  return function increment() {
    return ++count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

// Memory:
// - counter1 closure: { count: 0 } (~48 bytes)
// - counter2 closure: { count: 0 } (~48 bytes)
// Each has its own separate closure scope!

counter1(); // 1
counter1(); // 2
counter2(); // 1 (separate count variable)

// Memory leak risk:
function createLeakyHandler() {
  const largeData = new Array(1000000).fill('data'); // 8MB

  return function handler() {
    console.log('handled');
    // largeData not used, but still kept in closure!
  };
}

// Fix: Only capture what you need
function createFixedHandler() {
  const largeData = new Array(1000000).fill('data');
  const summary = largeData.length; // Only keep what's needed

  return function handler() {
    console.log('handled', summary);
    // largeData can be garbage collected!
  };
}
```

**Performance: map() vs for Loop:**

```javascript
// Benchmark: 1 million elements
const arr = Array.from({ length: 1000000 }, (_, i) => i);

// Test 1: for loop
console.time('for');
const result1 = [];
for (let i = 0; i < arr.length; i++) {
  result1[i] = arr[i] * 2;
}
console.timeEnd('for'); // ~12ms

// Test 2: map()
console.time('map');
const result2 = arr.map(x => x * 2);
console.timeEnd('map'); // ~15ms

// Test 3: map() with function reference (faster!)
function double(x) { return x * 2; }
console.time('map-ref');
const result3 = arr.map(double);
console.timeEnd('map-ref'); // ~14ms

// Performance insights:
// - for loop: Fastest (~20% faster)
// - map: Slightly slower (function call overhead)
// - BUT: map is optimized by TurboFan after warm-up
// - Hot code (called many times): map approaches for loop speed
```

**Hidden Classes and Inline Caching:**

```javascript
// Higher-order functions benefit from inline caching

// Monomorphic (fast - single type)
function processNumbers(arr, fn) {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
processNumbers(numbers, x => x * 2); // V8 learns: array of numbers
processNumbers(numbers, x => x + 1); // V8 optimizes

// Polymorphic (slower - multiple types)
processNumbers([1, 2, 3], x => x * 2);        // Numbers
processNumbers(['a', 'b'], x => x + '!');     // Strings
processNumbers([{id: 1}], x => x.id);         // Objects
// V8 must check types each time, slower!

// Megamorphic (slowest - too many types)
// After ~4-5 different types, V8 gives up optimizing
```

**Function Composition Performance:**

```javascript
// Naive composition (multiple passes)
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

// Bad: 3 passes over array
const numbers = [1, 2, 3];
const result = numbers
  .map(addOne)   // Pass 1: [2, 3, 4]
  .map(double)   // Pass 2: [4, 6, 8]
  .map(square);  // Pass 3: [16, 36, 64]

// Good: Single pass with composed function
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const transform = compose(square, double, addOne);

const betterResult = numbers.map(transform); // Single pass!

// Performance:
// - Naive (3 passes): ~45ms per million elements
// - Composed (1 pass): ~15ms per million elements (3x faster)
```

**Transducers for Ultimate Performance:**

```javascript
// Transducer pattern: Compose transformations without intermediate arrays

// Traditional (creates intermediate arrays)
const result = [1, 2, 3, 4, 5]
  .map(x => x + 1)        // [2, 3, 4, 5, 6] (intermediate)
  .filter(x => x % 2 === 0) // [2, 4, 6] (intermediate)
  .map(x => x * 2);       // [4, 8, 12] (final)

// Transducer (no intermediate arrays, single pass)
const transduce = (xform, reducer, init, coll) => {
  return coll.reduce(xform(reducer), init);
};

const mapping = fn => reducer => (acc, val) => reducer(acc, fn(val));
const filtering = pred => reducer => (acc, val) =>
  pred(val) ? reducer(acc, val) : acc;

const xform = compose(
  filtering(x => x % 2 === 0),
  mapping(x => x * 2)
);

const transducerResult = transduce(
  xform,
  (acc, x) => [...acc, x],
  [],
  [2, 3, 4, 5, 6].map(x => x + 1)
);

// Memory: Transducers save 2 intermediate array allocations
// Performance: ~30% faster for large datasets
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Array Method Performance Bug</strong></summary>

**Scenario:** Your dashboard's user list is freezing the browser when loading 50,000+ users. The team is using multiple chained map/filter operations, each creating intermediate arrays.

**The Problem:**

```javascript
// ❌ BUG: Multiple passes, multiple intermediate arrays
function processUsers(users) {
  return users
    .map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`
    }))                                    // Pass 1: 50k objects allocated
    .filter(user => user.isActive)        // Pass 2: ~25k objects (50% active)
    .map(user => ({
      id: user.id,
      name: user.fullName,
      email: user.email
    }))                                    // Pass 3: 25k new objects
    .sort((a, b) => a.name.localeCompare(b.name)); // Pass 4: sorting
}

// Production impact:
// - Processing 50,000 users: 4.5 seconds
// - Memory: 150MB peak (3 intermediate arrays)
// - Browser freezes during processing
// - Users report: "app is slow and laggy"
// - Bounce rate increased from 5% to 18%
```

**Performance Metrics Before Fix:**

```javascript
// Profiling results:
// - 50,000 users:
//   - Total time: 4,500ms
//   - Pass 1 (map): 800ms, 80MB allocated
//   - Pass 2 (filter): 600ms, 40MB allocated
//   - Pass 3 (map): 500ms, 30MB allocated
//   - Pass 4 (sort): 2,600ms
// - Memory pressure triggers GC: +400ms
// - Total: 4.5 seconds of frozen UI
```

**Solution 1: Single Pass with reduce:**

```javascript
// ✅ FIX: Single pass, no intermediate arrays
function processUsersFaster(users) {
  const processed = users.reduce((acc, user) => {
    // Filter
    if (!user.isActive) return acc;

    // Map transformations in one go
    acc.push({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    });

    return acc;
  }, []);

  // Sort only once at the end
  return processed.sort((a, b) => a.name.localeCompare(b.name));
}

// Performance:
// - 50,000 users: 2,100ms (2.1x faster!)
// - Memory: 50MB peak (1 array only)
// - No intermediate allocations
// - Still freezes UI, but 54% faster
```

**Solution 2: Web Worker + Chunking:**

```javascript
// ✅ BETTER: Process in chunks, use Web Worker
// Main thread:
function processUsersAsync(users) {
  return new Promise((resolve) => {
    const worker = new Worker('user-processor.js');

    worker.postMessage({ users });

    worker.onmessage = (e) => {
      resolve(e.data.processed);
      worker.terminate();
    };
  });
}

// user-processor.js (Web Worker):
self.onmessage = function(e) {
  const users = e.data.users;
  const chunkSize = 5000;
  const processed = [];

  // Process in chunks to avoid blocking
  for (let i = 0; i < users.length; i += chunkSize) {
    const chunk = users.slice(i, i + chunkSize);

    for (const user of chunk) {
      if (!user.isActive) continue;

      processed.push({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      });
    }

    // Yield to prevent worker from freezing
    if (i % 10000 === 0) {
      self.postMessage({ progress: i / users.length });
    }
  }

  // Sort
  processed.sort((a, b) => a.name.localeCompare(b.name));

  self.postMessage({ processed });
};

// Usage:
async function loadUsers() {
  const users = await fetchUsers(); // 50k users
  showLoading(true);

  const processed = await processUsersAsync(users);

  showLoading(false);
  renderUsers(processed);
}

// Performance:
// - 50,000 users: 2,000ms (off main thread!)
// - Main thread: Never blocks
// - UI stays responsive
// - User can scroll, interact while processing
```

**Solution 3: Virtual Scrolling + Lazy Processing:**

```javascript
// ✅ BEST: Don't process everything upfront!
class UserListVirtualized {
  constructor(users, containerHeight = 600, rowHeight = 50) {
    this.users = users;
    this.containerHeight = containerHeight;
    this.rowHeight = rowHeight;
    this.visibleCount = Math.ceil(containerHeight / rowHeight);

    // Only process active users (filter once)
    this.activeUsers = users.filter(u => u.isActive);

    // Sort only IDs (cheap)
    this.sortedIds = this.activeUsers
      .map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}` }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(u => u.id);

    // Cache for processed users
    this.cache = new Map();
  }

  getVisibleUsers(scrollTop) {
    const startIndex = Math.floor(scrollTop / this.rowHeight);
    const endIndex = startIndex + this.visibleCount;

    // Only process visible users (10-20 at a time)
    return this.sortedIds
      .slice(startIndex, endIndex)
      .map(id => this.getProcessedUser(id));
  }

  getProcessedUser(id) {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    // Process only when needed
    const user = this.activeUsers.find(u => u.id === id);
    const processed = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    };

    this.cache.set(id, processed);
    return processed;
  }
}

// Usage:
const virtualList = new UserListVirtualized(users);

function renderUserList(scrollTop) {
  const visibleUsers = virtualList.getVisibleUsers(scrollTop);
  // Render only 10-20 users
  renderUsers(visibleUsers);
}

// Performance:
// - Initial load: 150ms (filter + sort IDs only)
// - Scroll performance: 16ms (60 FPS)
// - Memory: 10MB (only visible users processed)
// - Perceived performance: Instant!
```

**Real Metrics After Fix:**

```javascript
// Before (naive chained operations):
// - Time to interactive: 4.5 seconds
// - Memory: 150MB peak
// - UI frozen: 4.5 seconds
// - User complaints: 45/week
// - Bounce rate: 18%

// After (virtual scrolling + lazy processing):
// - Time to interactive: 150ms (30x faster!)
// - Memory: 10MB peak (15x less)
// - UI frozen: 0ms (never blocks!)
// - User complaints: 2/week (96% reduction)
// - Bounce rate: 5% (back to normal)
// - Performance score: 45 → 95 (Lighthouse)
```

**Complex Real-World Pattern:**

```javascript
// Production-ready user processing with all optimizations
class OptimizedUserProcessor {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 1000;
    this.useWorker = options.useWorker ?? true;
    this.cache = new Map();
  }

  async process(users) {
    // Step 1: Quick filter (cheap operation)
    const active = users.filter(u => u.isActive);

    // Step 2: Decide processing strategy
    if (active.length < 1000) {
      // Small dataset: process synchronously
      return this.processSyncoptimized(active);
    } else if (this.useWorker) {
      // Large dataset: use Web Worker
      return this.processInWorker(active);
    } else {
      // Fallback: chunked processing with RAF
      return this.processChunked(active);
    }
  }

  processSyncoptimized(users) {
    // Single pass with for loop (fastest for small datasets)
    const result = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      result.push({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      });
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  async processInWorker(users) {
    // Use Web Worker for large datasets
    return new Promise((resolve, reject) => {
      const worker = new Worker('user-processor.js');

      worker.postMessage({ users });
      worker.onmessage = (e) => {
        resolve(e.data.processed);
        worker.terminate();
      };
      worker.onerror = reject;

      // Timeout fallback
      setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker timeout'));
      }, 30000);
    });
  }

  async processChunked(users) {
    // Process in chunks using requestAnimationFrame
    const result = [];

    for (let i = 0; i < users.length; i += this.chunkSize) {
      const chunk = users.slice(i, i + this.chunkSize);

      // Process chunk
      for (const user of chunk) {
        result.push({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        });
      }

      // Yield to browser
      await new Promise(resolve => requestAnimationFrame(resolve));
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }
}

// Usage:
const processor = new OptimizedUserProcessor({ useWorker: true });
const processed = await processor.process(users);
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Higher-Order Functions vs Alternatives</strong></summary>

### 1. map/filter/reduce vs for Loop

```javascript
// Pattern 1: Higher-order functions
const doubled = numbers.map(n => n * 2);

// Pattern 2: for loop
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled[i] = numbers[i] * 2;
}
```

| Aspect | map/filter/reduce | for Loop |
|--------|------------------|----------|
| **Readability** | ✅ Very clear intent | ⚠️ More verbose |
| **Performance** | ⚠️ ~15% slower | ✅ Fastest |
| **Memory** | ⚠️ New array always | ✅ Can mutate in-place |
| **Chainability** | ✅ Easy to chain | ❌ Need multiple loops |
| **Break/continue** | ❌ Can't break early | ✅ Full control |
| **Modern code** | ✅ Preferred | ⚠️ Looks old-school |

**When to use each:**

```javascript
// ✅ Use map/filter for transformations (readability)
const activeUsers = users.filter(u => u.isActive);
const names = activeUsers.map(u => u.name);

// ✅ Use for loop when performance critical (hot paths)
function sumLargeArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]; // 20% faster than reduce
  }
  return sum;
}

// ✅ Use for loop when need early exit
function findFirst(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return arr[i]; // Early exit!
  }
}
```

### 2. Composition vs Intermediate Variables

```javascript
// Pattern 1: Function composition
const result = users
  .filter(u => u.isActive)
  .map(u => u.name)
  .sort();

// Pattern 2: Intermediate variables
const activeUsers = users.filter(u => u.isActive);
const names = activeUsers.map(u => u.name);
const sorted = names.sort();
```

| Aspect | Composition | Intermediate Variables |
|--------|------------|----------------------|
| **Readability** | ⚠️ Can be unclear | ✅ Step-by-step clear |
| **Performance** | ❌ Multiple passes | ⚠️ Same (multiple passes) |
| **Debugging** | ❌ Harder to inspect | ✅ Can log each step |
| **Memory** | ❌ Multiple arrays | ❌ Multiple arrays |
| **Conciseness** | ✅ Fewer lines | ⚠️ More verbose |

### 3. Callback vs Named Function

```javascript
// Pattern 1: Inline callback
numbers.map(n => n * 2);

// Pattern 2: Named function
const double = n => n * 2;
numbers.map(double);
```

| Aspect | Inline Callback | Named Function |
|--------|----------------|---------------|
| **Readability** | ✅ Context right there | ⚠️ Need to find definition |
| **Reusability** | ❌ Not reusable | ✅ Reusable |
| **Testing** | ❌ Can't test alone | ✅ Easy to test |
| **Performance** | ⚠️ Same after JIT | ⚠️ Same after JIT |
| **Semantics** | ⚠️ What, not why | ✅ Name explains intent |

**When to use each:**

```javascript
// ✅ Inline for simple, one-time operations
const doubled = numbers.map(n => n * 2);

// ✅ Named for reusable, testable logic
const isEven = n => n % 2 === 0;
const isPrime = n => { /* complex logic */ };

numbers.filter(isEven);
numbers.filter(isPrime);

// Easy to test:
assert(isEven(4) === true);
assert(isPrime(7) === true);
```

### 4. Currying vs Multiple Parameters

```javascript
// Pattern 1: Curried function
const multiply = a => b => a * b;
const double = multiply(2);
const triple = multiply(3);

// Pattern 2: Regular function
function multiply(a, b) {
  return a * b;
}
```

| Aspect | Currying | Regular Function |
|--------|----------|-----------------|
| **Partial application** | ✅ Easy | ⚠️ Need bind/wrapper |
| **Readability** | ⚠️ Unclear to beginners | ✅ Familiar |
| **Performance** | ⚠️ Slower (more closures) | ✅ Faster |
| **Flexibility** | ✅ Highly composable | ⚠️ Less flexible |
| **TypeScript** | ⚠️ Complex types | ✅ Simple types |

### 5. Eager vs Lazy Evaluation

```javascript
// Pattern 1: Eager (array methods)
const result = numbers
  .map(n => n * 2)     // Processes all immediately
  .filter(n => n > 10) // Processes all immediately
  .slice(0, 5);        // Take first 5

// Pattern 2: Lazy (generators)
function* lazyMap(arr, fn) {
  for (const item of arr) {
    yield fn(item);
  }
}

function* lazyFilter(iterable, predicate) {
  for (const item of iterable) {
    if (predicate(item)) yield item;
  }
}

const lazy = lazyFilter(
  lazyMap(numbers, n => n * 2),
  n => n > 10
);

// Only processes 5 items!
const result = Array.from(lazy).slice(0, 5);
```

| Aspect | Eager (Arrays) | Lazy (Generators) |
|--------|---------------|------------------|
| **Performance** | ❌ Processes all | ✅ Only what's needed |
| **Memory** | ❌ Intermediate arrays | ✅ No intermediate storage |
| **Readability** | ✅ Straightforward | ⚠️ Requires understanding generators |
| **Debugging** | ✅ Can inspect arrays | ⚠️ Harder to inspect |
| **Compatibility** | ✅ Works everywhere | ⚠️ Generators only (ES6+) |

### Decision Matrix

| Use Case | Best Pattern | Reason |
|----------|-------------|--------|
| **Transform array** | map() | Clear intent |
| **Hot path (millions of calls)** | for loop | Performance |
| **Early exit needed** | for loop | Can break |
| **Reusable logic** | Named function | Testable |
| **Partial application** | Curried function | Flexible |
| **Large dataset** | Lazy/generators | Memory efficient |
| **Multiple passes** | Single reduce | Performance |
| **Simple one-liners** | Inline callback | Concise |

</details>

<details>
<summary><strong>💬 Explain to Junior: Higher-Order Functions Simplified</strong></summary>

**Simple Analogy: Functions as Tools**

Think of higher-order functions like a **power tool shop**:

```javascript
// Regular function: A specific tool
function hammer(nail) {
  return `hammered ${nail}`;
}

// Higher-order function: A tool that MAKES tools
function createTool(action) {
  return function(item) {
    return `${action} ${item}`;
  };
}

const hammer = createTool('hammered');
const saw = createTool('sawed');
const drill = createTool('drilled');

hammer('nail');  // "hammered nail"
saw('wood');     // "sawed wood"
drill('hole');   // "drilled hole"
```

**Two Types of Higher-Order Functions:**

```javascript
// Type 1: Takes a function as input
function doTwice(fn, value) {
  fn(value);
  fn(value);
}

doTwice(console.log, "Hello"); // Logs "Hello" twice

// Type 2: Returns a function as output
function createGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

sayHello("Alice"); // "Hello, Alice!"
sayHi("Bob");      // "Hi, Bob!"
```

**Real-World Example: Array Methods**

```javascript
// map: "Do this to every item"
const numbers = [1, 2, 3];

// Without map (repetitive)
const doubled = [];
doubled.push(numbers[0] * 2);
doubled.push(numbers[1] * 2);
doubled.push(numbers[2] * 2);

// With map (clean!)
const doubled = numbers.map(n => n * 2);

// Think of map as: "Hey array, transform each item using this function"
```

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Forgetting to return
const numbers = [1, 2, 3];
const doubled = numbers.map(n => {
  n * 2; // Where's the return?!
});
console.log(doubled); // [undefined, undefined, undefined]

// ✅ FIX:
const doubled = numbers.map(n => n * 2); // Implicit return
// OR
const doubled = numbers.map(n => {
  return n * 2; // Explicit return
});


// ❌ MISTAKE 2: Using map when you want forEach
numbers.map(n => console.log(n)); // Returns [undefined, undefined, undefined]

// ✅ FIX: Use forEach when you don't need a new array
numbers.forEach(n => console.log(n)); // Just logs, no return


// ❌ MISTAKE 3: Mutating original array
const users = [{ name: 'Alice', age: 25 }];
const older = users.map(user => {
  user.age++; // Mutates original!
  return user;
});

console.log(users[0].age); // 26 (original changed!)

// ✅ FIX: Return new objects
const older = users.map(user => ({
  ...user,
  age: user.age + 1
}));
console.log(users[0].age); // 25 (original unchanged)
```

**Explaining to PM:**

"Higher-order functions are like assembly lines in a factory.

**Without higher-order functions:**
- You manually process each item one by one
- Write the same loop code repeatedly
- More chances for mistakes
- Harder to see what the code does

**With higher-order functions:**
- Set up an assembly line (the higher-order function)
- Tell it what to do (pass in a function)
- It processes everything automatically
- Code reads like instructions: 'filter active users, then map to names, then sort'

**Business value:**
- Code is 60% faster to write (less boilerplate)
- 40% fewer bugs (less manual iteration)
- Easier for new developers to understand
- Industry standard (React, Node.js use them everywhere)
- Example: Instead of 20 lines of loops, express intent in 3 lines"

**Practical Patterns:**

```javascript
// 1. Transform data
const users = [
  { firstName: 'John', lastName: 'Doe', age: 25 },
  { firstName: 'Jane', lastName: 'Smith', age: 30 }
];

// Old way (verbose):
const fullNames = [];
for (let i = 0; i < users.length; i++) {
  fullNames.push(users[i].firstName + ' ' + users[i].lastName);
}

// New way (declarative):
const fullNames = users.map(u => `${u.firstName} ${u.lastName}`);


// 2. Filter data
// Old way:
const adults = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age >= 18) {
    adults.push(users[i]);
  }
}

// New way:
const adults = users.filter(u => u.age >= 18);


// 3. Combine operations (chaining!)
const result = users
  .filter(u => u.age >= 18)              // Keep adults
  .map(u => `${u.firstName} ${u.lastName}`) // Get names
  .sort();                                // Sort alphabetically

// Reads like plain English!
```

**Key Rules:**

1. **Higher-order function takes or returns a function**
2. **Always return from map/filter/reduce** (unless using forEach)
3. **Don't mutate original data** (return new values)
4. **Chain methods** for multiple transformations
5. **Use forEach** when you just want to do something (logging), not transform

**Quick Test:**

```javascript
// Which are higher-order functions?

function add(a, b) {
  return a + b;
}
// ❌ Regular function (doesn't take/return function)

function map(array, fn) {
  const result = [];
  for (let item of array) {
    result.push(fn(item));
  }
  return result;
}
// ✅ Higher-order (takes function as parameter)

function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}
// ✅ Higher-order (returns a function)

[1, 2, 3].map(x => x * 2);
// ✅ Higher-order (map takes a function)
```

</details>

---

## Question 2: What is a pure function?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Airbnb

### Question
Explain what a pure function is in JavaScript. Why are pure functions important and how do they differ from impure functions?

### Answer

A **pure function** is a function that:
1. Always returns the same output for the same input (deterministic)
2. Has no side effects (doesn't modify external state)

Pure functions are a key concept in functional programming.

1. **Characteristics of Pure Functions**
   - Deterministic (same input = same output)
   - No side effects
   - No external dependencies
   - Easier to test
   - Predictable behavior

2. **Side Effects (What Pure Functions Avoid)**
   - Modifying global variables
   - Modifying input parameters
   - Making HTTP requests
   - Writing to database
   - Logging to console
   - Modifying DOM
   - Getting current time

3. **Benefits of Pure Functions**
   - Easier to test (no mocking needed)
   - Easier to debug
   - Cacheable (memoization)
   - Parallelizable
   - Easier to reason about

### Code Example

```javascript
// 1. PURE FUNCTIONS - Same input = Same output, No side effects

// Pure: Simple calculation
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // Always 5
console.log(add(2, 3)); // Always 5

// Pure: Array transformation (doesn't modify input)
function double(numbers) {
  return numbers.map(n => n * 2);
}

const nums = [1, 2, 3];
console.log(double(nums)); // [2, 4, 6]
console.log(nums); // [1, 2, 3] (unchanged)

// Pure: String manipulation
function capitalize(str) {
  return str.toUpperCase();
}

// 2. IMPURE FUNCTIONS - Side effects or non-deterministic

// Impure: Modifies external state
let counter = 0;

function incrementCounter() {
  counter++; // Side effect: modifying global variable
  return counter;
}

console.log(incrementCounter()); // 1
console.log(incrementCounter()); // 2 (different output!)

// Impure: Non-deterministic (depends on external state)
function getCurrentTime() {
  return new Date().getTime(); // Different each call
}

// Impure: Modifies input parameter
function addToArray(arr, item) {
  arr.push(item); // Mutates input!
  return arr;
}

// Impure: Console logging
function calculateAndLog(a, b) {
  const result = a + b;
  console.log(result); // Side effect: I/O
  return result;
}

// 3. CONVERTING IMPURE TO PURE

// Impure version
let total = 0;

function addToTotal(value) {
  total += value; // Modifies external state
  return total;
}

// Pure version
function addToValue(currentTotal, value) {
  return currentTotal + value; // Returns new value, doesn't modify
}

let total2 = 0;
total2 = addToValue(total2, 5); // 5
total2 = addToValue(total2, 10); // 15

// 4. PURE ARRAY OPERATIONS

// Pure: map, filter, reduce
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2); // Pure: returns new array
const evens = numbers.filter(n => n % 2 === 0); // Pure
const sum = numbers.reduce((acc, n) => acc + n, 0); // Pure

console.log(numbers); // [1, 2, 3, 4, 5] (unchanged)

// Impure: push, pop, splice (modify original)
const arr = [1, 2, 3];
arr.push(4); // Impure: modifies arr

// 5. PURE OBJECT OPERATIONS

// Impure: mutates object
function updateUserAge(user, age) {
  user.age = age; // Mutates input!
  return user;
}

// Pure: returns new object
function setUserAge(user, age) {
  return { ...user, age }; // New object
}

const user = { name: 'John', age: 25 };
const updated = setUserAge(user, 26);

console.log(user.age); // 25 (unchanged)
console.log(updated.age); // 26

// 6. TESTING PURE VS IMPURE

// Pure function: Easy to test
function calculateDiscount(price, discountPercent) {
  return price * (1 - discountPercent / 100);
}

// Test (no setup needed)
console.assert(calculateDiscount(100, 10) === 90);
console.assert(calculateDiscount(100, 10) === 90); // Always same result

// Impure function: Harder to test
let tax = 0.1;

function calculateTotal(price) {
  return price * (1 + tax); // Depends on external variable
}

// Test (need to control external state)
tax = 0.1;
console.assert(calculateTotal(100) === 110); // Fragile!

// 7. MEMOIZATION WITH PURE FUNCTIONS

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Only works reliably with pure functions
const fibonacci = memoize(function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

// 8. PURE FUNCTIONS IN REACT

// Pure component (same props = same output)
function UserCard({ name, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

// Impure (uses external state)
let theme = 'dark';

function UserCardImpure({ name, age }) {
  return (
    <div className={theme}> {/* Depends on external state */}
      <h2>{name}</h2>
    </div>
  );
}
```

### Common Mistakes

- ❌ **Mistake:** Mutating input parameters
  ```javascript
  function addItem(arr, item) {
    arr.push(item); // Impure: mutates input!
    return arr;
  }
  ```

- ❌ **Mistake:** Depending on external state
  ```javascript
  let multiplier = 2;

  function multiply(n) {
    return n * multiplier; // Impure: depends on external variable
  }
  ```

- ✅ **Correct:** Return new values, don't mutate
  ```javascript
  function addItem(arr, item) {
    return [...arr, item]; // Pure: returns new array
  }

  function multiply(n, multiplier) {
    return n * multiplier; // Pure: all inputs are parameters
  }
  ```

### Follow-up Questions

- "What are side effects in JavaScript?"
- "How do pure functions relate to Redux reducers?"
- "Can async functions be pure?"
- "What is referential transparency?"
- "How do pure functions help with testing?"

### Resources

- [MDN: Pure Functions](https://developer.mozilla.org/en-US/docs/Glossary/Pure_function)
- [JavaScript.info: Function Purity](https://javascript.info/function-basics)
- [Understanding Pure Functions](https://www.freecodecamp.org/news/what-is-a-pure-function-in-javascript-acb887375dfe/)

<details>
<summary><strong>🔍 Deep Dive: Pure Functions & Referential Transparency</strong></summary>

**Referential Transparency:**

Pure functions exhibit **referential transparency** - any function call can be replaced with its return value without changing program behavior.

```javascript
// Pure function
function add(a, b) {
  return a + b;
}

// These are equivalent:
const result1 = add(2, 3) + add(2, 3);
const result2 = 5 + 5; // Can replace add(2, 3) with 5

// Compiler/optimizer can safely do this replacement!
```

**Why Memoization Only Works with Pure Functions:**

```javascript
// Pure function: Same input always gives same output
function expensiveCalculation(n) {
  // Simulate expensive operation
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += i;
  }
  return result;
}

const memoized = memoize(expensiveCalculation);

memoized(100); // Takes 50ms, caches result
memoized(100); // Takes <1ms, returns cached result ✅

// Impure function: Memoization breaks correctness
let globalMultiplier = 2;

function impureCalc(n) {
  return n * globalMultiplier; // Depends on external state
}

const memoizedImpure = memoize(impureCalc);

memoizedImpure(5);      // 10 (globalMultiplier = 2, cached)
globalMultiplier = 3;
memoizedImpure(5);      // Still returns 10! ❌ (should be 15)
```

**V8 Optimization and Pure Functions:**

```javascript
// V8 can inline and optimize pure functions more aggressively

// Pure function
function square(x) {
  return x * x;
}

// After TurboFan optimization:
[1, 2, 3].map(square);
// Inlined to:
// [1 * 1, 2 * 2, 3 * 3]
// Further optimized to:
// [1, 4, 9] (compile-time constant folding!)

// Impure function
let multiplier = 2;
function impureSquare(x) {
  return x * multiplier; // Can't inline safely
}

// V8 can't optimize as aggressively - must check multiplier each time
```

**Parallelization Potential:**

```javascript
// Pure functions are inherently parallelizable

// Sequential (current)
const results = largeArray.map(pureFn);

// Parallel (Web Workers)
// Can safely split into chunks without worrying about shared state
function parallelMap(array, pureFn, workerCount = 4) {
  const chunkSize = Math.ceil(array.length / workerCount);
  const workers = [];

  for (let i = 0; i < workerCount; i++) {
    const chunk = array.slice(i * chunkSize, (i + 1) * chunkSize);
    workers.push(
      new Promise(resolve => {
        const worker = new Worker('map-worker.js');
        worker.postMessage({ chunk, fn: pureFn.toString() });
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
      })
    );
  }

  return Promise.all(workers).then(chunks => chunks.flat());
}

// Safe because pureFn has no side effects!
```

</details>

<details>
<parameter name="🐛 Real-World Scenario: Redux Reducer Mutation Bug</strong></summary>

**Scenario:** Your React app's shopping cart randomly loses items. Users add products, but after other actions, items disappear. The bug is intermittent and hard to reproduce.

**The Problem:**

```javascript
// ❌ BUG: Impure reducer mutating state
function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      // Mutating state directly!
      state.items.push(action.payload);
      return state; // Same reference, React won't detect change!

    case 'REMOVE_ITEM':
      const index = state.items.findIndex(item => item.id === action.payload.id);
      state.items.splice(index, 1); // Mutation!
      return state;

    case 'UPDATE_QUANTITY':
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity; // Mutation!
      }
      return state;

    default:
      return state;
  }
}

// Production impact:
// - Cart items randomly disappear (30% of transactions)
// - Users complain: "Added items but cart is empty at checkout"
// - Lost revenue: $15k/month (abandoned carts)
// - React DevTools shows state updated, but UI doesn't re-render
```

**Why It Breaks:**

```javascript
// React Redux uses shallow equality check
function mapStateToProps(state) {
  return {
    cart: state.cart // Same object reference!
  };
}

// Component doesn't re-render because:
prevState.cart === nextState.cart // true (same reference!)

// Even though cart.items changed internally
```

**Solution: Pure Reducer:**

```javascript
// ✅ FIX: Pure reducer returning new state
function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload] // New array!
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity } // New object!
            : item
        )
      };

    default:
      return state;
  }
}

// Now:
prevState.cart !== nextState.cart // true (new reference!)
// React detects change and re-renders ✅
```

**Real Metrics After Fix:**

```javascript
// Before (impure reducer):
// - Cart sync issues: 30% of users
// - Items disappearing: 150 reports/week
// - Abandoned carts: 45%
// - Lost revenue: $15k/month
// - Time debugging: 20 hours/week

// After (pure reducer):
// - Cart sync issues: 0%
// - Items disappearing: 0 reports
// - Abandoned carts: 12% (normal rate)
// - Revenue recovered: $15k/month
// - Redux DevTools time-travel debugging works perfectly
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Pure vs Impure Functions</strong></summary>

### Performance Tradeoffs

| Aspect | Pure Functions | Impure Functions |
|--------|---------------|-----------------|
| **Memoization** | ✅ Can cache results | ❌ Can't cache safely |
| **Parallelization** | ✅ Safe to parallelize | ❌ Race conditions |
| **V8 Optimization** | ✅ Aggressive inlining | ⚠️ Conservative |
| **Memory** | ⚠️ Creates new objects | ✅ Can mutate in-place |
| **GC Pressure** | ⚠️ More allocations | ✅ Less garbage |

**When Impure is Faster:**

```javascript
// Pure (slower for large arrays)
function addItemPure(arr, item) {
  return [...arr, item]; // O(n) copy
}

// Impure (faster)
function addItemImpure(arr, item) {
  arr.push(item); // O(1)
  return arr;
}

// Benchmark: 10,000 items
// Pure: ~120ms (copying overhead)
// Impure: ~2ms (direct mutation)

// But: Impure breaks React/Redux assumptions!
```

### Testability Tradeoffs

```javascript
// Pure: Easy to test
function calculateTax(price, taxRate) {
  return price * taxRate;
}

// Test (simple)
assert(calculateTax(100, 0.1) === 10);

// Impure: Hard to test
let globalTaxRate = 0.1;
function calculateTaxImpure(price) {
  return price * globalTaxRate;
}

// Test (needs setup/teardown)
beforeEach(() => { globalTaxRate = 0.1; });
afterEach(() => { globalTaxRate = 0; });
assert(calculateTaxImpure(100) === 10);
```

### When to Use Impure Functions

```javascript
// ✅ I/O operations (inherently impure)
async function saveUser(user) {
  await db.users.insert(user); // Side effect: database write
}

// ✅ Logging/debugging
function debugLog(message) {
  console.log(`[DEBUG] ${message}`); // Side effect: console
}

// ✅ Event handlers
button.addEventListener('click', () => {
  counter++; // Side effect: DOM update
  updateDisplay();
});

// ✅ Performance-critical hot paths
function sumLargeArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]; // Mutation faster than reduce
  }
  return sum;
}
```

### Hybrid Approach (Best of Both Worlds)

```javascript
// Keep business logic pure
function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Wrap side effects at boundaries
async function checkout(items) {
  const total = calculateCartTotal(items); // Pure!

  // Impure operations isolated
  await saveOrder({ items, total });
  await sendEmail(user.email, { total });
  analytics.track('checkout', { total });

  return { success: true, total };
}

// Benefits:
// - Pure core (testable, cacheable)
// - Impure shell (necessary side effects)
```

</details>

<details>
<summary><strong>💬 Explain to Junior: Pure Functions Simplified</strong></summary>

**Simple Analogy: Vending Machine vs Magic Genie**

**Pure Function = Vending Machine:**
- Put in $1, get soda every time
- Same input → Same output (always)
- Doesn't affect anything outside
- Predictable!

```javascript
function vendingMachine(money) {
  if (money >= 1) return 'soda';
  return 'nothing';
}

vendingMachine(1); // 'soda'
vendingMachine(1); // 'soda' (always same!)
```

**Impure Function = Magic Genie:**
- Sometimes grants wishes, sometimes doesn't
- Depends on mood (external state)
- Changes the world around you
- Unpredictable!

```javascript
let genieMood = 'happy';

function magicGenie(wish) {
  if (genieMood === 'happy') {
    genieMood = 'tired'; // Changes external state!
    return `Granted: ${wish}`;
  }
  return 'Not today';
}

magicGenie('car'); // 'Granted: car' (genie now tired)
magicGenie('car'); // 'Not today' (different output!)
```

**Two Rules of Pure Functions:**

1. **Same input = Same output** (always!)
2. **No side effects** (doesn't change anything outside)

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Mutating input
function addExclamation(arr) {
  arr.push('!'); // Modifies original!
  return arr;
}

const words = ['Hello'];
addExclamation(words);
console.log(words); // ['Hello', '!'] (original changed!)

// ✅ FIX: Return new array
function addExclamationPure(arr) {
  return [...arr, '!'];
}

const words2 = ['Hello'];
const result = addExclamationPure(words2);
console.log(words2); // ['Hello'] (unchanged!)
console.log(result); // ['Hello', '!']


// ❌ MISTAKE 2: Using external variables
let discount = 0.1;

function applyDiscount(price) {
  return price * (1 - discount); // Depends on 'discount'!
}

applyDiscount(100); // 90
discount = 0.2;
applyDiscount(100); // 80 (different output!)

// ✅ FIX: Pass everything as parameters
function applyDiscountPure(price, discount) {
  return price * (1 - discount);
}

applyDiscountPure(100, 0.1); // Always 90
applyDiscountPure(100, 0.1); // Always 90 (predictable!)


// ❌ MISTAKE 3: Hidden side effects
function getUserAge(user) {
  console.log('Getting age...'); // Side effect: logging!
  return user.age;
}

// ✅ FIX: Remove side effects
function getUserAgePure(user) {
  return user.age; // Just return, no logging
}
```

**Explaining to PM:**

"Pure functions are like recipes in a cookbook.

**Pure function (recipe):**
- Same ingredients → Same dish every time
- Recipe doesn't change your kitchen
- Anyone can follow it and get same result
- Easy to teach, easy to repeat

**Impure function (no recipe):**
- 'Add some salt' - how much?
- 'Cook until done' - when is that?
- Results vary each time
- Hard to reproduce

**Business value:**
- Bugs reduced by 60% (predictable behavior)
- Testing is 5x faster (no setup needed)
- New developers onboard faster
- Can cache results (performance boost)
- Example: Calculate shipping cost - pure function always gives same cost for same items, impure might change randomly"

**Key Rules:**

1. **Don't modify inputs** - return new values
2. **Don't use external variables** - pass as parameters
3. **No side effects** - no logging, no API calls, no DOM changes (inside the function logic)
4. **Same input = Same output** - always predictable

</details>

---

## Question 3: Arrow Functions vs Regular Functions - What's the difference?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
What are the differences between arrow functions and regular functions?

### Answer

**Arrow functions** have different `this` binding, no `arguments`, cannot be constructors, and have concise syntax.

1. **Key Differences**
   - Lexical `this` (doesn't bind own `this`)
   - No `arguments` object
   - Cannot be used as constructors
   - No `prototype` property
   - Cannot be generators

2. **When to Use Arrow**
   - Callbacks and higher-order functions
   - Methods that don't need own `this`
   - Preserving outer `this` context

3. **When NOT to Use Arrow**
   - Object methods that need `this`
   - Event handlers that need `this`
   - Functions needing `arguments`
   - Constructor functions

### Code Example

```javascript
// 1. THIS BINDING
const obj = {
  name: "Alice",

  // Regular function: own 'this'
  regularMethod() {
    console.log(this.name); // "Alice"
  },

  // Arrow function: lexical 'this' (from surrounding scope)
  arrowMethod: () => {
    console.log(this.name); // undefined (this from outer scope)
  }
};

// 2. CALLBACKS
const numbers = [1, 2, 3];

// Regular function
numbers.map(function(n) {
  return n * 2;
});

// Arrow function (concise!)
numbers.map(n => n * 2);

// 3. ARGUMENTS OBJECT
function regularFunc() {
  console.log(arguments); // [1, 2, 3]
}

const arrowFunc = () => {
  console.log(arguments); // ReferenceError!
};

regularFunc(1, 2, 3);

// 4. CONSTRUCTOR
function RegularFunc() {
  this.value = 42;
}

const ArrowFunc = () => {
  this.value = 42;
};

new RegularFunc(); // OK
// new ArrowFunc(); // TypeError!

// 5. PRACTICAL - REACT COMPONENT
class Component {
  state = { count: 0 };

  // ❌ Regular method loses 'this' when passed as callback
  regularIncrement() {
    this.setState({ count: this.state.count + 1 });
  }

  // ✅ Arrow function preserves 'this'
  arrowIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <button onClick={this.arrowIncrement}>+</button>
    );
  }
}
```

### Resources

- [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

<details>
<summary><strong>🔍 Deep Dive: Arrow Functions Internals</strong></summary>

**Lexical `this` Binding:**

Arrow functions don't have their own `this` - they inherit from enclosing scope at **definition time**, not call time.

```javascript
// Regular function: 'this' determined at CALL time
function Regular() {
  this.value = 42;

  setTimeout(function() {
    console.log(this.value); // undefined (this = window/global)
  }, 100);
}

// Arrow function: 'this' captured at DEFINITION time
function Arrow() {
  this.value = 42;

  setTimeout(() => {
    console.log(this.value); // 42 (this from Arrow scope)
  }, 100);
}

// Internal mechanism (simplified):
// Arrow function stores reference to outer 'this' in [[HomeObject]]
```

**Performance: Arrow vs Regular:**

```javascript
// Benchmark: 10 million calls
const iterations = 10000000;

// Test 1: Regular function
function regular(x) {
  return x * 2;
}

console.time('regular');
for (let i = 0; i < iterations; i++) {
  regular(i);
}
console.timeEnd('regular'); // ~180ms

// Test 2: Arrow function
const arrow = x => x * 2;

console.time('arrow');
for (let i = 0; i < iterations; i++) {
  arrow(i);
}
console.timeEnd('arrow'); // ~185ms

// Performance: Nearly identical after JIT compilation
// Slight overhead (~3%) for arrow due to closure maintenance
```

**Memory: Arrow Functions in Classes:**

```javascript
class Component {
  // Regular method: Shared on prototype
  regularMethod() {
    console.log(this.value);
  }

  // Arrow function: Created per instance
  arrowMethod = () => {
    console.log(this.value);
  };
}

// Memory analysis:
const instances = Array.from({ length: 1000 }, () => new Component());

// regularMethod: 1 function shared across 1000 instances (~100 bytes total)
// arrowMethod: 1000 separate functions (~40 bytes × 1000 = 40KB)

// Trade-off: Memory for convenience (auto-bound this)
```

**Why Arrow Functions Can't Be Constructors:**

```javascript
// Regular function has [[Construct]] internal method
function Regular() {
  this.value = 42;
}

// Arrow function does NOT have [[Construct]]
const Arrow = () => {
  this.value = 42;
};

new Regular(); // ✅ Creates { value: 42 }
new Arrow();   // ❌ TypeError: Arrow is not a constructor

// Also no prototype property:
console.log(Regular.prototype); // { constructor: Regular }
console.log(Arrow.prototype);   // undefined
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: React Event Handler Bug</strong></summary>

**Scenario:** Your React component's buttons stop working after initial render. Click events don't fire, or show "Cannot read property 'setState' of undefined."

**The Problem:**

```javascript
// ❌ BUG: Regular method loses 'this' context
class TodoList extends React.Component {
  state = {
    todos: [],
    input: ''
  };

  // Regular method
  handleSubmit(e) {
    e.preventDefault();
    // 'this' is undefined when called from event!
    this.setState({
      todos: [...this.state.todos, this.state.input],
      input: ''
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          value={this.state.input}
          onChange={(e) => this.setState({ input: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
    );
  }
}

// Error: "Cannot read property 'setState' of undefined"
// Because: handleSubmit loses 'this' when passed as callback
```

**Why It Breaks:**

```javascript
// What React does internally:
const handler = component.handleSubmit; // Extracts method
handler(event); // Calls without 'this' context

// Equivalent to:
function handleSubmit(e) {
  // 'this' is undefined (strict mode)
  this.setState(...); // TypeError!
}
handleSubmit.call(undefined, event);
```

**Solution 1: Arrow Function (Best):**

```javascript
// ✅ FIX: Arrow function auto-binds 'this'
class TodoList extends React.Component {
  state = {
    todos: [],
    input: ''
  };

  // Arrow function preserves 'this'
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      todos: [...this.state.todos, this.state.input],
      input: ''
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* Works! 'this' is bound */}
      </form>
    );
  }
}
```

**Solution 2: Bind in Constructor:**

```javascript
// ✅ ALTERNATIVE: Bind in constructor
class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { todos: [], input: '' };

    // Bind once in constructor
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      todos: [...this.state.todos, this.state.input],
      input: ''
    });
  }

  render() {
    return <form onSubmit={this.handleSubmit}>...</form>;
  }
}

// Works, but verbose
```

**Solution 3: Arrow in Render (Bad):**

```javascript
// ❌ BAD: Creates new function every render
class TodoList extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    this.setState(...);
  }

  render() {
    // New function created EVERY render!
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        ...
      </form>
    );
  }
}

// Performance impact:
// - 1000 renders = 1000 function allocations
// - Breaks PureComponent/React.memo optimization
// - Child components re-render unnecessarily
```

**Real Metrics:**

```javascript
// Before fix (regular method, no binding):
// - Button clicks: 0% success rate
// - Error reports: 250/week ("setState of undefined")
// - User frustration: 85% bounce rate
// - Support tickets: 40/week

// After fix (arrow function):
// - Button clicks: 100% success rate
// - Error reports: 0/week
// - User frustration: 8% bounce rate (normal)
// - Support tickets: 2/week (unrelated)
// - Developer onboarding: 50% faster (no binding confusion)
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Arrow vs Regular Functions</strong></summary>

### When to Use Arrow Functions

| Use Case | Arrow Function | Reason |
|----------|---------------|--------|
| **Array callbacks** | ✅ Preferred | Concise, clear |
| **React class methods** | ✅ Preferred | Auto-bound this |
| **Preserving context** | ✅ Required | Lexical this |
| **Short callbacks** | ✅ Preferred | Readable |

```javascript
// ✅ Good: Array methods
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

// ✅ Good: React event handlers
handleClick = () => {
  this.setState({ clicked: true });
};

// ✅ Good: Callbacks preserving context
setTimeout(() => {
  console.log(this.value); // Access outer 'this'
}, 1000);
```

### When to Use Regular Functions

| Use Case | Regular Function | Reason |
|----------|-----------------|--------|
| **Object methods** | ✅ Preferred | Need dynamic this |
| **Constructors** | ✅ Required | Need prototype |
| **Generators** | ✅ Required | Arrow can't be generator |
| **Need arguments** | ✅ Required | Arrow has no arguments |

```javascript
// ✅ Good: Object methods
const obj = {
  name: 'Alice',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

// ❌ Bad: Arrow in object
const obj = {
  name: 'Alice',
  greet: () => {
    console.log(this.name); // undefined!
  }
};

// ✅ Good: Constructor
function User(name) {
  this.name = name;
}

// ✅ Good: Generator
function* generator() {
  yield 1;
  yield 2;
}
```

### Performance Comparison

```javascript
// Scenario: 1000 component instances

// Arrow function (class property)
class Component {
  handleClick = () => {}; // 1000 separate functions
}
// Memory: ~40KB (40 bytes × 1000)

// Regular function (prototype)
class Component {
  handleClick() {}; // 1 shared function
}
// Memory: ~100 bytes total

// Trade-off: 400x more memory for convenience
```

### Decision Matrix

| Situation | Use Arrow | Use Regular |
|-----------|-----------|-------------|
| Array callback | ✅ | |
| React class method | ✅ | |
| Object method | | ✅ |
| Constructor | | ✅ |
| Need `arguments` | | ✅ |
| Generator | | ✅ |
| Event handler (React) | ✅ | |
| Higher-order return | ✅ | |

</details>

<details>
<summary><strong>💬 Explain to Junior: Arrow Functions Simplified</strong></summary>

**Simple Analogy: Name Badge vs No Badge**

**Regular Function = Person with name badge:**
- Badge says who they are RIGHT NOW
- Changes depending on where they are
- At work: "Employee"
- At home: "Family Member"

```javascript
const person = {
  name: "Alice",
  greet: function() {
    console.log(this.name); // "Alice" (person's badge)
  }
};

person.greet(); // "Alice"
```

**Arrow Function = Person with no badge:**
- No own identity
- Borrows identity from where they were born
- Always remembers original place

```javascript
const person = {
  name: "Alice",
  greet: () => {
    console.log(this.name); // undefined (no badge, borrows from outside)
  }
};

person.greet(); // undefined
```

**The `this` Problem:**

```javascript
// Regular function: 'this' changes
const counter = {
  count: 0,

  increment: function() {
    setTimeout(function() {
      this.count++; // ❌ 'this' is window/global, not counter!
      console.log(this.count); // NaN
    }, 1000);
  }
};

// Arrow function: 'this' stays same
const counter = {
  count: 0,

  increment: function() {
    setTimeout(() => {
      this.count++; // ✅ 'this' is still counter!
      console.log(this.count); // 1
    }, 1000);
  }
};
```

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Arrow in object method
const calculator = {
  value: 42,

  getValue: () => {
    return this.value; // undefined! Arrow has no 'this'
  }
};

// ✅ FIX: Use regular function
const calculator = {
  value: 42,

  getValue() {
    return this.value; // 42 ✅
  }
};


// ❌ MISTAKE 2: Using 'arguments' in arrow
const sum = () => {
  console.log(arguments); // ReferenceError!
};

// ✅ FIX: Use rest parameters
const sum = (...numbers) => {
  console.log(numbers); // Works!
};


// ❌ MISTAKE 3: Arrow as constructor
const User = (name) => {
  this.name = name;
};

new User('Alice'); // TypeError!

// ✅ FIX: Use regular function
function User(name) {
  this.name = name;
}

new User('Alice'); // Works!
```

**When to Use Each:**

```javascript
// ✅ Use ARROW for:

// 1. Array methods (short and sweet)
const doubled = [1, 2, 3].map(n => n * 2);

// 2. Callbacks that need outer 'this'
class Component {
  value = 42;

  render() {
    setTimeout(() => {
      console.log(this.value); // Works!
    }, 1000);
  }
}

// 3. React event handlers
handleClick = () => {
  this.setState({ clicked: true });
};


// ✅ Use REGULAR for:

// 1. Object methods
const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};

// 2. Constructors
function User(name) {
  this.name = name;
}

// 3. When you need 'arguments'
function sum() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

**Key Rules:**

1. **Arrow functions don't have `this`** - they borrow from outside
2. **Arrow functions can't be constructors** - can't use `new`
3. **Arrow functions don't have `arguments`** - use rest parameters instead
4. **Use arrow for callbacks**, regular for object methods
5. **In React classes**, arrow functions auto-bind `this`

</details>

---

