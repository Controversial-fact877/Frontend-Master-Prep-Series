# React Internals

> Fiber architecture, reconciliation, virtual DOM, concurrent rendering, Suspense, and how React works under the hood.

---

## Question 1: React Fiber Architecture

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐
**Time:** 15 minutes
**Companies:** Meta, Google

### Question
What is React Fiber? How does it improve React's performance?

### Answer

**Fiber** is React's complete rewrite of the reconciliation algorithm (React 16+) that enables incremental rendering, pause/resume work, and prioritize updates.

**Key Points:**
1. **Incremental rendering** - Split work into chunks, spread over multiple frames
2. **Priority-based updates** - Urgent updates (user input) over less urgent (data fetching)
3. **Interruptible** - Can pause work and return to it later
4. **Concurrent rendering** - Prepare multiple versions of UI simultaneously
5. **Better UX** - Keeps UI responsive during heavy updates

### Code Example

```jsx
// BEFORE FIBER (React 15)
// Problem: Entire component tree rendered synchronously
// If rendering takes 100ms, UI freezes for 100ms

function App() {
  const [count, setCount] = useState(0);

  // Heavy computation blocks UI
  const expensiveValue = calculateExpensiveValue(count); // blocks for 100ms

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Click me - UI freezes during update
      </button>
      <HeavyComponent value={expensiveValue} />
    </div>
  );
}

// AFTER FIBER (React 16+)
// Fiber breaks work into units that can be paused/resumed
// UI stays responsive even during heavy updates

// 1. FIBER STRUCTURE (simplified concept)
// Each component has a corresponding "fiber" node
const fiber = {
  type: 'div',              // Component type
  props: { className: 'container' },
  stateNode: domNode,       // Actual DOM node
  child: childFiber,        // First child fiber
  sibling: siblingFiber,    // Next sibling fiber
  return: parentFiber,      // Parent fiber
  alternate: currentFiber,  // Previous version (for diffing)
  effectTag: 'UPDATE',      // What work needs doing
  updateQueue: [],          // Pending state updates
};

// 2. WORK LOOP (simplified)
function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    // Do a small chunk of work
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    // Check if we need to yield to browser
    shouldYield = deadline.timeRemaining() < 1;
  }

  // If there's more work and time left, continue
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  }
}

// 3. CONCURRENT FEATURES ENABLED BY FIBER

// useTransition - Mark updates as non-urgent
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;

    // Urgent: Update input immediately
    setQuery(value);

    // Non-urgent: Search can wait
    startTransition(() => {
      const searchResults = performExpensiveSearch(value);
      setResults(searchResults);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <ResultsList results={results} />}
    </div>
  );
}

// useDeferredValue - Defer updating less important parts
function ProductList({ query }) {
  const deferredQuery = useDeferredValue(query);

  // Input shows latest query instantly
  // List updates with deferred query (can lag behind)
  return (
    <div>
      <input value={query} />
      <ExpensiveList query={deferredQuery} />
    </div>
  );
}

// 4. PRIORITY LEVELS IN FIBER
const PriorityLevels = {
  ImmediatePriority: 1,     // User input, clicks (1ms timeout)
  UserBlockingPriority: 2,  // User interactions (250ms)
  NormalPriority: 3,        // Data fetching (5s)
  LowPriority: 4,           // Analytics (10s)
  IdlePriority: 5,          // Background work (no timeout)
};

// Example: Input stays responsive while list updates
function FilteredList() {
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState(largeDataSet);

  const handleFilterChange = (e) => {
    // HIGH PRIORITY: Update input immediately
    setFilter(e.target.value);

    // LOW PRIORITY: Filter list can wait
    startTransition(() => {
      const filtered = filterLargeDataSet(e.target.value);
      setItems(filtered);
    });
  };

  return (
    <div>
      <input value={filter} onChange={handleFilterChange} />
      {items.map(item => <Item key={item.id} data={item} />)}
    </div>
  );
}
```

### Common Mistakes

- ❌ Assuming all updates render immediately (Fiber can delay low-priority updates)
- ❌ Not using `useTransition` for expensive operations
- ❌ Blocking the main thread with synchronous expensive operations
- ✅ Use `useTransition` for non-urgent updates
- ✅ Use `useDeferredValue` for expensive derived values
- ✅ Understand that Fiber enables concurrent rendering

### Follow-up Questions

1. How does Fiber decide which updates to prioritize?
2. What's the difference between Fiber and the Virtual DOM?
3. How does `useTransition` work under the hood?

### Resources
- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
- [Concurrent React](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)

---

## Question 2: Reconciliation and Virtual DOM

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Time:** 12 minutes
**Companies:** Meta, Google, Amazon

### Question
How does React's reconciliation algorithm work? What is the Virtual DOM and why is it important?

### Answer

**Reconciliation** - Process of determining what changed in the UI and how to efficiently update the real DOM.

**Virtual DOM** - Lightweight JavaScript representation of the actual DOM that React uses for efficient diffing.

**Key Points:**
1. **Diffing algorithm** - Compares old and new virtual DOM trees
2. **Keys** - Help React identify which items changed, moved, or deleted
3. **Component types** - Different types always create new trees
4. **Batching** - Groups multiple updates for efficiency
5. **Heuristics** - React uses assumptions to make diffing O(n) instead of O(n³)

### Code Example

```jsx
// 1. VIRTUAL DOM CONCEPT
// Real DOM
<div id="app">
  <h1>Hello</h1>
  <button>Click</button>
</div>

// Virtual DOM (JavaScript object)
const vdom = {
  type: 'div',
  props: { id: 'app' },
  children: [
    { type: 'h1', props: {}, children: ['Hello'] },
    { type: 'button', props: {}, children: ['Click'] }
  ]
};

// 2. RECONCILIATION ALGORITHM

// ❌ WITHOUT KEYS - React can't track items efficiently
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li>{todo.text}</li>  // No key!
      ))}
    </ul>
  );
}

// When a todo is added at the start:
// OLD: [Buy milk, Walk dog]
// NEW: [Write code, Buy milk, Walk dog]
// React re-renders ALL items (inefficient)

// ✅ WITH KEYS - React tracks items efficiently
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>  // Unique key
      ))}
    </ul>
  );
}

// With keys:
// React knows "Write code" is new, others stayed same
// Only renders the new item

// 3. ELEMENT TYPE CHANGES
function App() {
  const [isButton, setIsButton] = useState(true);

  return isButton ? (
    <button onClick={() => setIsButton(false)}>
      I'm a button
    </button>
  ) : (
    <div onClick={() => setIsButton(true)}>
      I'm a div
    </div>
  );
}

// When type changes (button → div):
// - Old button is DESTROYED (unmounted)
// - New div is CREATED (mounted fresh)
// - Component state is LOST

// 4. SAME TYPE, DIFFERENT PROPS
function App() {
  const [className, setClassName] = useState('blue');

  return (
    <div className={className}>
      <Child />
    </div>
  );
}

// When className changes:
// - div stays (not destroyed)
// - Only className attribute updates
// - Child component NOT re-rendered (same instance)

// 5. COMPONENT KEYS RESET STATE
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Task 1' },
    { id: 2, text: 'Task 2' }
  ]);

  return todos.map(todo => (
    // key prop forces React to create new instance if id changes
    <TodoItem key={todo.id} todo={todo} />
  ));
}

// 6. BATCHING UPDATES
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // These are BATCHED into one re-render
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Result: count = 1 (not 3!)
    // Because all use same initial count value
  };

  const handleClickCorrect = () => {
    // Use functional updates for correct behavior
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
    // Result: count = 3 ✅
  };

  return <button onClick={handleClickCorrect}>Count: {count}</button>;
}

// 7. RECONCILIATION HEURISTICS

// Heuristic 1: Different types = new tree
// Bad: switching component types loses state
function Parent({ useNewComponent }) {
  return useNewComponent ? <NewVersion /> : <OldVersion />;
  // State is lost on switch!
}

// Good: Keep same type, change props
function Parent({ useNewComponent }) {
  return <Component isNew={useNewComponent} />;
  // State preserved!
}

// Heuristic 2: Keys identify elements across renders
function List({ items }) {
  return items.map((item, index) => (
    // ❌ BAD: Using index as key
    <Item key={index} data={item} />
    // Problems:
    // - Reordering items causes incorrect renders
    // - Removing items causes incorrect state association
  ));
}

function List({ items }) {
  return items.map(item => (
    // ✅ GOOD: Using stable unique ID
    <Item key={item.id} data={item} />
  ));
}

// 8. DIFFING CHILDREN (Simplified algorithm)
function diffChildren(oldChildren, newChildren) {
  // React's actual algorithm is more complex, but concept:

  // 1. Build map of old children by key
  const oldMap = new Map();
  oldChildren.forEach((child, i) => {
    const key = child.key || i;
    oldMap.set(key, child);
  });

  // 2. Iterate new children
  newChildren.forEach((newChild, i) => {
    const key = newChild.key || i;
    const oldChild = oldMap.get(key);

    if (!oldChild) {
      // New child - mount
      mount(newChild);
    } else if (needsUpdate(oldChild, newChild)) {
      // Existing child - update
      update(oldChild, newChild);
    }
    // else - no change, reuse existing
  });

  // 3. Remove old children not in new list
  oldChildren.forEach(oldChild => {
    if (!newChildren.includes(oldChild)) {
      unmount(oldChild);
    }
  });
}
```

### Common Mistakes

- ❌ Using index as key when list can reorder/filter
- ❌ Using random values as keys (new key = new component instance)
- ❌ Not understanding that type changes destroy component state
- ❌ Forgetting that batching affects multiple setState calls
- ✅ Use stable, unique IDs for keys
- ✅ Keep component types consistent to preserve state
- ✅ Use functional updates when new state depends on old state

### Follow-up Questions

1. Why are keys important in React lists?
2. What happens when a component's type changes?
3. How does React achieve O(n) diffing complexity?

### Resources
- [Reconciliation](https://react.dev/learn/preserving-and-resetting-state)
- [Virtual DOM](https://react.dev/learn/render-and-commit)

---

## Question 3: React 18 Concurrent Features

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Meta, Modern React shops

### Question
What are React 18's concurrent features? How do `useTransition`, `useDeferredValue`, and Suspense work together?

### Answer

**Concurrent React** - Allows React to prepare multiple versions of the UI simultaneously and interrupt rendering to handle urgent updates.

**Key Points:**
1. **useTransition** - Mark state updates as non-urgent (can be interrupted)
2. **useDeferredValue** - Show stale value while new value is preparing
3. **Suspense** - Declaratively handle async operations
4. **Automatic batching** - All state updates are batched (even in promises/setTimeout)
5. **Streaming SSR** - Send HTML to browser progressively

### Code Example

```jsx
import { useState, useTransition, useDeferredValue, Suspense } from 'react';

// 1. useTransition - Non-urgent updates
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    const value = e.target.value;

    // URGENT: Update input immediately (high priority)
    setQuery(value);

    // NON-URGENT: Search can wait (low priority)
    startTransition(() => {
      // This update can be interrupted by urgent updates
      const filtered = expensiveSearchOperation(value);
      setResults(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </div>
  );
}

// 2. useDeferredValue - Defer expensive renders
function ProductGrid({ searchQuery }) {
  // Deferred value "lags behind" the actual value
  const deferredQuery = useDeferredValue(searchQuery);

  // Input shows searchQuery (immediate)
  // Grid shows deferredQuery (can lag behind)
  return (
    <div>
      <h2>Searching for: {searchQuery}</h2>
      {/* This expensive list uses deferred value */}
      <ExpensiveProductList query={deferredQuery} />
    </div>
  );
}

// 3. COMBINING useTransition + useDeferredValue
function TabContainer() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const handleTabClick = (newTab) => {
    startTransition(() => {
      setTab(newTab);
    });
  };

  return (
    <div>
      <TabBar tab={tab} onTabClick={handleTabClick} />
      {/* Show old tab content while new tab is loading */}
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <TabContent tab={tab} />
      </div>
    </div>
  );
}

// 4. SUSPENSE FOR DATA FETCHING
// Resource-based data fetching (React 18+)
const resource = fetchUserData();

function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<PostsSkeleton />}>
        <ProfilePosts resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  // This "suspends" rendering until data is ready
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

// 5. SUSPENSE + TRANSITIONS
function App() {
  const [userId, setUserId] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handleUserChange = (newId) => {
    startTransition(() => {
      // Navigation is non-urgent
      setUserId(newId);
    });
  };

  return (
    <div>
      <UserSelector onChange={handleUserChange} />
      {/* Keep showing old user while new user loads */}
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile userId={userId} />
      </Suspense>
    </div>
  );
}

// 6. AUTOMATIC BATCHING (React 18)
function Counter() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  // Before React 18: Only batched in React event handlers
  // After React 18: Batched EVERYWHERE (promises, setTimeout, etc.)

  const handleClick = () => {
    // Both batched into one re-render
    setCount(c => c + 1);
    setFlag(f => !f);
  };

  const handleClickAsync = () => {
    fetch('/api').then(() => {
      // NOW BATCHED (wasn't in React 17)
      setCount(c => c + 1);
      setFlag(f => !f);
    });
  };

  const handleClickTimeout = () => {
    setTimeout(() => {
      // NOW BATCHED (wasn't in React 17)
      setCount(c => c + 1);
      setFlag(f => !f);
    }, 1000);
  };

  return <button onClick={handleClick}>Update</button>;
}

// 7. STREAMING SSR
// server.js
import { renderToPipeableStream } from 'react-dom/server';

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      // Send initial HTML shell immediately
      res.setHeader('Content-Type', 'text/html');
      pipe(res);
    },
    // Components wrapped in Suspense stream in later
  });
});

// 8. COMPARING APPROACHES

// Without Transition (blocking)
function SearchBlocking() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Blocks UI until search completes
    setResults(expensiveSearch(value));
  };

  return <input value={query} onChange={handleChange} />;
  // Input feels sluggish
}

// With Transition (non-blocking)
function SearchTransition() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // Updates immediately
    startTransition(() => {
      setResults(expensiveSearch(value)); // Can be interrupted
    });
  };

  return <input value={query} onChange={handleChange} />;
  // Input stays responsive
}
```

### Common Mistakes

- ❌ Not using `startTransition` for expensive non-urgent updates
- ❌ Wrapping urgent updates in transitions (makes UI feel slow)
- ❌ Expecting immediate updates inside `startTransition`
- ❌ Not understanding automatic batching in React 18
- ✅ Use transitions for navigation, filtering, searching
- ✅ Keep urgent updates (user input) outside transitions
- ✅ Combine Suspense + transitions for smooth UX

### Follow-up Questions

1. When should you use `useTransition` vs `useDeferredValue`?
2. How does Suspense know when to show fallback?
3. What's the difference between batching in React 17 vs 18?

### Resources
- [React 18 Concurrent Features](https://react.dev/blog/2022/03/29/react-v18)
- [useTransition](https://react.dev/reference/react/useTransition)
- [Suspense](https://react.dev/reference/react/Suspense)

---

**[← Back to React README](./README.md)**
