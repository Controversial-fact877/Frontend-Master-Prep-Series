# DOM Events - Part 2 (Advanced Topics)

## Question 5: What's the difference between addEventListener and onclick, and which should you use?

**Answer:**

`addEventListener` and `onclick` are both ways to attach event handlers, but they have important differences in functionality, flexibility, and best practices.

**Key Differences:**

```javascript
const button = document.querySelector('button');

// Method 1: onclick property
button.onclick = function() {
  console.log('Clicked with onclick');
};

// Problem: Overwrites previous handler
button.onclick = function() {
  console.log('This replaces the first handler!');
};
// Only the second handler runs

// Method 2: addEventListener
button.addEventListener('click', () => {
  console.log('First handler');
});

button.addEventListener('click', () => {
  console.log('Second handler');
});
// Both handlers run!
```

**Feature Comparison:**

| Feature | onclick | addEventListener |
|---------|---------|------------------|
| **Multiple handlers** | ❌ No (last one wins) | ✅ Yes |
| **Remove handler** | Set to null | `removeEventListener()` |
| **Capture phase** | ❌ No | ✅ Yes (`{ capture: true }`) |
| **Event options** | ❌ No | ✅ Yes (`once`, `passive`, `signal`) |
| **Memory leaks** | Easier | Requires careful cleanup |
| **HTML attributes** | ✅ Yes (`<button onclick="...">`) | ❌ No |
| **Best practice** | ❌ Avoid | ✅ Recommended |

**Real-World Examples:**

```javascript
// Example 1: Multiple analytics trackers
const button = document.getElementById('checkout-btn');

// With onclick - PROBLEM
button.onclick = () => {
  trackGoogleAnalytics('checkout_click');
};

button.onclick = () => {
  trackMixpanel('checkout_click'); // This replaces Google Analytics!
};
// Only Mixpanel tracks

// With addEventListener - SOLUTION
button.addEventListener('click', () => {
  trackGoogleAnalytics('checkout_click');
});

button.addEventListener('click', () => {
  trackMixpanel('checkout_click');
});
// Both track successfully!

// Example 2: Event options
button.addEventListener('click', handleClick, {
  once: true,      // Auto-remove after first trigger
  passive: true,   // Improves scroll performance
  capture: true,   // Use capture phase
  signal: abortController.signal // Abort listener
});

// Example 3: Removing handlers
function handleClick() {
  console.log('Clicked');
}

// With onclick
button.onclick = handleClick;
button.onclick = null; // Remove

// With addEventListener
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // Must be same function reference

// Example 4: Anonymous functions (can't remove with removeEventListener)
button.addEventListener('click', () => {
  console.log('Cannot remove this!');
});
// No way to remove - must use named function
```

**Advanced addEventListener Options:**

```javascript
// once: true - Auto-remove after one execution
button.addEventListener('click', () => {
  console.log('Runs only once');
}, { once: true });

// Equivalent to:
function handler() {
  console.log('Runs only once');
  button.removeEventListener('click', handler);
}
button.addEventListener('click', handler);

// passive: true - Indicates handler won't call preventDefault()
// Improves scroll performance
scrollableElement.addEventListener('touchstart', (e) => {
  // Cannot call e.preventDefault() here
  console.log('Touch started');
}, { passive: true });

// signal - Use AbortController to remove multiple listeners
const controller = new AbortController();

button.addEventListener('click', handler1, { signal: controller.signal });
button.addEventListener('mouseover', handler2, { signal: controller.signal });
button.addEventListener('focus', handler3, { signal: controller.signal });

// Remove all listeners at once
controller.abort();
```

---

### 🔍 Deep Dive: Event Handler Registration Internals

**Browser Implementation of onclick vs addEventListener:**

```javascript
// Simplified browser implementation
class HTMLElementEventHandlers {
  constructor() {
    // onclick is a property
    this._onclick = null;

    // addEventListener uses an internal list
    this._eventListeners = new Map();
    // Map structure: { 'click': Set([handler1, handler2, ...]) }
  }

  // onclick setter
  set onclick(handler) {
    // Remove old handler from event system
    if (this._onclick) {
      this.removeEventListener('click', this._onclick);
    }

    this._onclick = handler;

    // Add to event system if not null
    if (handler) {
      this.addEventListener('click', handler);
    }
  }

  get onclick() {
    return this._onclick;
  }

  // addEventListener implementation
  addEventListener(type, listener, options = {}) {
    if (!this._eventListeners.has(type)) {
      this._eventListeners.set(type, new Set());
    }

    const listeners = this._eventListeners.get(type);

    // Check for duplicates
    if (!listeners.has(listener)) {
      listeners.add(listener);

      // Store options with listener
      listener._options = options;
    }
  }

  removeEventListener(type, listener) {
    const listeners = this._eventListeners.get(type);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  // Event dispatch
  dispatchEvent(event) {
    const listeners = this._eventListeners.get(event.type);

    if (!listeners) return;

    for (const listener of listeners) {
      const options = listener._options || {};

      // Check capture phase
      if (options.capture && event.eventPhase !== Event.CAPTURING_PHASE) {
        continue;
      }

      // Call handler
      listener.call(this, event);

      // Remove if once
      if (options.once) {
        this.removeEventListener(event.type, listener);
      }

      // Stop if immediate propagation stopped
      if (event._immediatePropagationStopped) {
        break;
      }
    }
  }
}
```

**Performance Comparison:**

```javascript
class EventHandlerPerformance {
  static benchmarkRegistration(iterations = 10000) {
    const results = {};

    // Test 1: onclick assignment
    const button1 = document.createElement('button');
    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
      button1.onclick = function() {};
    }
    results.onclickAssignment = performance.now() - start;

    // Test 2: addEventListener
    const button2 = document.createElement('button');
    const handlers = Array.from({ length: iterations }, () => function() {});
    start = performance.now();
    for (const handler of handlers) {
      button2.addEventListener('click', handler);
    }
    results.addEventListener = performance.now() - start;

    // Test 3: addEventListener with options
    const button3 = document.createElement('button');
    start = performance.now();
    for (const handler of handlers) {
      button3.addEventListener('click', handler, {
        once: true,
        passive: true,
        capture: false
      });
    }
    results.addEventListenerWithOptions = performance.now() - start;

    return results;
    // Typical results (10k iterations):
    // onclickAssignment: 2ms (fastest, but only one handler)
    // addEventListener: 45ms
    // addEventListenerWithOptions: 52ms (slight overhead for options)
  }

  static benchmarkRemoval(iterations = 1000) {
    const results = {};

    // Test 1: onclick removal
    const button1 = document.createElement('button');
    for (let i = 0; i < iterations; i++) {
      button1.onclick = function() {};
    }

    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
      button1.onclick = null;
    }
    results.onclickRemoval = performance.now() - start;

    // Test 2: removeEventListener
    const button2 = document.createElement('button');
    const handlers = Array.from({ length: iterations }, () => function() {});

    for (const handler of handlers) {
      button2.addEventListener('click', handler);
    }

    start = performance.now();
    for (const handler of handlers) {
      button2.removeEventListener('click', handler);
    }
    results.removeEventListener = performance.now() - start;

    return results;
    // Typical results (1k iterations):
    // onclickRemoval: 0.5ms
    // removeEventListener: 8ms (must search listener list)
  }
}
```

**Memory Implications:**

```javascript
class EventHandlerMemoryProfiler {
  static measureMemoryUsage() {
    if (!performance.memory) {
      return 'Memory API not available (Chrome only)';
    }

    const results = [];
    const initialHeap = performance.memory.usedJSHeapSize;

    // Test 1: onclick on 1000 elements
    const onclickElements = [];
    for (let i = 0; i < 1000; i++) {
      const btn = document.createElement('button');
      btn.onclick = function() { console.log('Click'); };
      onclickElements.push(btn);
    }

    results.push({
      method: 'onclick',
      elements: 1000,
      heapIncrease: performance.memory.usedJSHeapSize - initialHeap
    });

    // Clean up
    onclickElements.length = 0;

    // Force GC (Chrome with --expose-gc)
    if (global.gc) global.gc();

    const afterCleanup = performance.memory.usedJSHeapSize;

    // Test 2: addEventListener on 1000 elements (3 listeners each)
    const addListenerElements = [];
    for (let i = 0; i < 1000; i++) {
      const btn = document.createElement('button');
      btn.addEventListener('click', () => console.log('Handler 1'));
      btn.addEventListener('click', () => console.log('Handler 2'));
      btn.addEventListener('click', () => console.log('Handler 3'));
      addListenerElements.push(btn);
    }

    results.push({
      method: 'addEventListener (3 each)',
      elements: 1000,
      heapIncrease: performance.memory.usedJSHeapSize - afterCleanup
    });

    return results;
    // Typical results:
    // onclick: ~50KB for 1000 elements
    // addEventListener (3 each): ~180KB for 1000 elements
    // Trade-off: flexibility vs memory
  }
}
```

---

### 🐛 Real-World Scenario: Memory Leak in SPA Navigation

**The Problem:**

A single-page application (SPA) had severe memory leaks causing browser crashes after users navigated between views multiple times. The issue was caused by improper event listener cleanup.

**Initial Metrics:**
- Memory growth: 50MB per view navigation
- Browser crashes: After 8-10 navigations (400MB+ memory)
- User complaints: "App gets slower over time"
- Bounce rate: 34% (users closing tab)
- Performance degradation: 300% slower after 5 navigations

**Buggy Implementation:**

```javascript
// ❌ WRONG: Event listeners never removed
class BuggyView {
  constructor(data) {
    this.data = data;
    this.container = document.getElementById('view-container');
  }

  render() {
    this.container.innerHTML = `
      <div class="view">
        <button class="action-btn">Click Me</button>
        <div class="data-list"></div>
      </div>
    `;

    // BUG 1: onclick prevents multiple handlers but leaks memory
    const button = this.container.querySelector('.action-btn');
    button.onclick = () => {
      this.handleAction(); // 'this' keeps entire view in memory
    };

    // BUG 2: Anonymous addEventListener can't be removed
    button.addEventListener('click', () => {
      this.trackClick(); // Another memory leak
    });

    // BUG 3: Document-level listeners never cleaned up
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close(); // View stays in memory forever
      }
    });

    // BUG 4: Interval/timer with reference to view
    this.updateInterval = setInterval(() => {
      this.updateData(); // Prevents garbage collection
    }, 1000);

    this.renderData();
  }

  handleAction() {
    console.log('Action triggered');
  }

  trackClick() {
    console.log('Click tracked');
  }

  close() {
    // BUG: No cleanup before removing view
    this.container.innerHTML = ''; // Removes DOM but listeners remain!
  }

  updateData() {
    console.log('Updating data...');
  }

  renderData() {
    const list = this.container.querySelector('.data-list');
    list.innerHTML = this.data.map(item => `<div>${item}</div>`).join('');
  }

  destroy() {
    // BUG: Incomplete cleanup
    this.container.innerHTML = '';
    // Forgot to:
    // - Remove document listeners
    // - Clear intervals
    // - Remove event handlers
  }
}

// Simulating SPA navigation
function navigate(viewData) {
  const view = new BuggyView(viewData);
  view.render();
}

// Each navigation leaks memory
for (let i = 0; i < 10; i++) {
  navigate([{ id: i, name: `Item ${i}` }]);
}
// After 10 navigations: ~500MB memory leaked!
```

**Debugging Process:**

```javascript
class MemoryLeakDetector {
  static detectListenerLeaks() {
    const getListenerCount = () => {
      // Chrome DevTools method
      const listeners = getEventListeners(document);
      return Object.keys(listeners).reduce((total, type) => {
        return total + listeners[type].length;
      }, 0);
    };

    console.log('Initial listeners:', getListenerCount());

    // Navigate 5 times
    for (let i = 0; i < 5; i++) {
      navigate([{ id: i }]);
      console.log(`After navigation ${i + 1}:`, getListenerCount());
    }

    // Expected: Listener count should stay constant
    // Actual: Listener count keeps growing!
    // Output:
    // Initial listeners: 5
    // After navigation 1: 8
    // After navigation 2: 11
    // After navigation 3: 14
    // After navigation 4: 17
    // After navigation 5: 20 (Memory leak confirmed!)
  }

  static profileMemoryGrowth() {
    if (!performance.memory) return;

    const measurements = [];

    measurements.push({
      navigation: 0,
      heapSize: performance.memory.usedJSHeapSize / 1024 / 1024
    });

    for (let i = 1; i <= 10; i++) {
      navigate([{ id: i }]);

      // Force layout
      document.body.offsetHeight;

      measurements.push({
        navigation: i,
        heapSize: performance.memory.usedJSHeapSize / 1024 / 1024
      });
    }

    console.table(measurements);
    // Shows steady memory growth: 45MB → 480MB
  }
}
```

**Fixed Implementation:**

```javascript
// ✅ CORRECT: Proper lifecycle management and cleanup
class FixedView {
  constructor(data) {
    this.data = data;
    this.container = document.getElementById('view-container');

    // Store handler references for cleanup
    this.handlers = {
      action: this.handleAction.bind(this),
      trackClick: this.trackClick.bind(this),
      keydown: this.handleKeydown.bind(this)
    };

    this.updateInterval = null;
    this.destroyed = false;
  }

  render() {
    // Clear previous content and listeners
    this.cleanup();

    this.container.innerHTML = `
      <div class="view">
        <button class="action-btn">Click Me</button>
        <div class="data-list"></div>
      </div>
    `;

    const button = this.container.querySelector('.action-btn');

    // Use addEventListener with named functions
    button.addEventListener('click', this.handlers.action);
    button.addEventListener('click', this.handlers.trackClick);

    // Store document listener for cleanup
    document.addEventListener('keydown', this.handlers.keydown);

    // Use AbortController for automatic cleanup (modern approach)
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    button.addEventListener('mouseenter', () => {
      console.log('Hover');
    }, { signal });

    // Set interval with proper cleanup
    this.updateInterval = setInterval(() => {
      if (!this.destroyed) {
        this.updateData();
      }
    }, 1000);

    this.renderData();
  }

  handleAction(e) {
    console.log('Action triggered');
  }

  trackClick(e) {
    console.log('Click tracked');
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.destroy();
    }
  }

  updateData() {
    if (this.destroyed) return;
    console.log('Updating data...');
  }

  renderData() {
    const list = this.container.querySelector('.data-list');
    list.innerHTML = this.data.map(item => `<div>${item.name}</div>`).join('');
  }

  cleanup() {
    // Remove all event listeners
    const button = this.container.querySelector('.action-btn');
    if (button) {
      button.removeEventListener('click', this.handlers.action);
      button.removeEventListener('click', this.handlers.trackClick);
    }

    // Remove document listeners
    document.removeEventListener('keydown', this.handlers.keydown);

    // Abort all listeners registered with signal
    if (this.abortController) {
      this.abortController.abort();
    }

    // Clear intervals/timeouts
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  destroy() {
    if (this.destroyed) return;

    this.destroyed = true;
    this.cleanup();
    this.container.innerHTML = '';

    // Clear references
    this.data = null;
    this.handlers = null;
  }
}

// Modern pattern: Using WeakRef and FinalizationRegistry
class ModernView {
  static #registry = new FinalizationRegistry((cleanupData) => {
    // Cleanup when view is garbage collected
    console.log('View garbage collected, cleaning up:', cleanupData);
  });

  constructor(data) {
    this.data = data;

    // Register for cleanup
    ModernView.#registry.register(this, {
      viewId: Date.now(),
      timestamp: new Date().toISOString()
    });
  }

  // ... rest of implementation
}
```

**Metrics After Fix:**

```javascript
// Before fix:
// - Memory per navigation: +50MB
// - Total after 10 navigations: 500MB
// - Browser crashes: After 8-10 navigations
// - Listener count growth: 3 per navigation
// - Performance: 300% degradation

// After fix:
// - Memory per navigation: +2MB (98% reduction!)
// - Total after 10 navigations: 65MB (87% reduction!)
// - Browser crashes: None
// - Listener count growth: 0 (all cleaned up)
// - Performance: Stable across navigations

// User impact:
// - Bounce rate: 34% → 8%
// - Session duration: 3.2min → 12.5min
// - User complaints: 156/week → 4/week
```

---

### ⚖️ Trade-offs: onclick vs addEventListener

**When onclick is Acceptable:**

| Scenario | Why onclick is OK | Example |
|----------|-------------------|---------|
| **Simple prototypes** | Quick testing, no production code | CodePen demos |
| **Single handler needed** | One action, no need for multiple | Simple button |
| **Inline event attributes** | HTML-based event handling | `<button onclick="submit()">` |
| **Overriding existing handler** | Intentionally replace old handler | Reset functionality |

**When addEventListener is Required:**

| Scenario | Why addEventListener | Example |
|----------|---------------------|---------|
| **Multiple handlers** | Different systems need to react | Analytics + UI + logging |
| **Event options needed** | `once`, `passive`, `capture`, `signal` | Scroll optimization |
| **Removable handlers** | Dynamic adding/removing | Modal lifecycle |
| **Library/framework code** | Don't interfere with user code | Plugin systems |
| **Best practices** | Industry standard, maintainable | Production applications |

**Decision Matrix:**

```javascript
class EventHandlerSelector {
  static selectMethod(requirements) {
    const {
      needsMultipleHandlers,
      needsRemoval,
      needsOptions,
      isProduction,
      isPrototype
    } = requirements;

    // Production code: always addEventListener
    if (isProduction) {
      return {
        method: 'addEventListener',
        reason: 'Best practice for production',
        confidence: 'high'
      };
    }

    // Quick prototype: onclick is fine
    if (isPrototype && !needsMultipleHandlers && !needsRemoval) {
      return {
        method: 'onclick',
        reason: 'Simple and quick for prototyping',
        confidence: 'medium'
      };
    }

    // Need advanced features: addEventListener
    if (needsOptions || needsMultipleHandlers || needsRemoval) {
      return {
        method: 'addEventListener',
        reason: 'Required features only in addEventListener',
        confidence: 'high'
      };
    }

    // Default: addEventListener
    return {
      method: 'addEventListener',
      reason: 'More flexible and future-proof',
      confidence: 'high'
    };
  }
}

// Usage
const recommendation = EventHandlerSelector.selectMethod({
  needsMultipleHandlers: true,
  needsRemoval: true,
  needsOptions: false,
  isProduction: true,
  isPrototype: false
});

console.log(recommendation);
// { method: 'addEventListener', reason: 'Best practice for production', confidence: 'high' }
```

---

### 💬 Explain to Junior: onclick vs addEventListener

**Simple Analogy:**

Think of event handlers like phone contacts:

- **onclick**: Like having one "Emergency Contact" field. You can only store one number. Adding a new number replaces the old one.

- **addEventListener**: Like a contact list. You can have multiple numbers for the same person (work, mobile, home). Each one stays in the list.

**Visual Comparison:**

```
onclick:                              addEventListener:
========                              =================

element.onclick = handler1            element.addEventListener('click', handler1)
element.onclick = handler2            element.addEventListener('click', handler2)
                                      element.addEventListener('click', handler3)

Result: Only handler2 runs            Result: All three run in order
```

**Interview Answer Template:**

> "The main difference between `onclick` and `addEventListener` is that `onclick` can only attach one handler at a time, while `addEventListener` can attach multiple handlers.
>
> With `onclick`, if you assign a new handler, it replaces the previous one:
> ```javascript
> button.onclick = () => console.log('First');
> button.onclick = () => console.log('Second'); // Replaces first
> ```
>
> With `addEventListener`, you can add multiple handlers and they'll all run:
> ```javascript
> button.addEventListener('click', () => console.log('First'));
> button.addEventListener('click', () => console.log('Second')); // Both run
> ```
>
> Additionally, `addEventListener` supports advanced options like:
> - `once: true` - Handler auto-removes after first execution
> - `passive: true` - Improves scroll performance
> - `capture: true` - Listen during capture phase
> - `signal` - Use AbortController to remove multiple listeners at once
>
> In production code, I always use `addEventListener` because it's more flexible, supports these options, and is the industry best practice. `onclick` is only acceptable for quick prototypes or demos."

**Quick Reference:**

```javascript
// onclick - Simple but limited
button.onclick = () => console.log('Click');
button.onclick = null; // Remove

// addEventListener - Flexible and powerful
button.addEventListener('click', handler);
button.removeEventListener('click', handler);

// Advanced options
button.addEventListener('click', handler, {
  once: true,      // Run once then auto-remove
  passive: true,   // Won't call preventDefault()
  capture: true,   // Use capture phase
  signal: controller.signal // Cleanup with AbortController
});

// AbortController for easy cleanup
const controller = new AbortController();

btn1.addEventListener('click', handler1, { signal: controller.signal });
btn2.addEventListener('click', handler2, { signal: controller.signal });
btn3.addEventListener('click', handler3, { signal: controller.signal });

controller.abort(); // Removes all three listeners
```

**Common Mistakes:**

```javascript
// ❌ Mistake 1: Using onclick in production
button.onclick = () => handleClick(); // What if analytics needs to track too?

// ✅ Correct: Use addEventListener
button.addEventListener('click', () => handleClick());
button.addEventListener('click', () => trackAnalytics());

// ❌ Mistake 2: Anonymous function can't be removed
button.addEventListener('click', () => console.log('Click'));
// No way to remove this handler!

// ✅ Correct: Use named function
function handleClick() {
  console.log('Click');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // Can remove

// ❌ Mistake 3: Forgetting to cleanup
function showModal() {
  document.addEventListener('keydown', handleEscape);
  // Never removed - memory leak!
}

// ✅ Correct: Cleanup on destroy
class Modal {
  constructor() {
    this.handleEscape = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this.handleEscape);
  }

  destroy() {
    document.removeEventListener('keydown', this.handleEscape);
  }
}
```

---

## Question 6: How does removeEventListener work and why do memory leaks occur?

**Answer:**

`removeEventListener` removes an event handler previously added with `addEventListener`. Memory leaks occur when event listeners are not properly removed, keeping DOM elements and their associated data in memory even after they're no longer needed.

**Basic Usage:**

```javascript
// Named function - can be removed
function handleClick(e) {
  console.log('Clicked', e.target);
}

button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // ✅ Works

// Anonymous function - cannot be removed
button.addEventListener('click', (e) => {
  console.log('Clicked', e.target);
});

// This doesn't work - different function reference!
button.removeEventListener('click', (e) => {
  console.log('Clicked', e.target);
}); // ❌ Doesn't remove
```

**Why Memory Leaks Happen:**

```javascript
// Memory Leak Scenario 1: Detached DOM with listeners
class LeakyComponent {
  constructor() {
    this.element = document.createElement('div');
    this.data = new Array(10000).fill('large data'); // 10KB+ of data

    // Listener keeps component in memory
    this.element.addEventListener('click', () => {
      console.log(this.data.length); // References 'this'
    });

    document.body.appendChild(this.element);
  }

  destroy() {
    // Remove from DOM but listener still attached
    this.element.remove(); // Element gone from DOM
    // BUT: Element + listener + component still in memory!
  }
}

// Create and destroy 100 components
for (let i = 0; i < 100; i++) {
  const component = new LeakyComponent();
  component.destroy();
}
// All 100 components still in memory! (~1MB leaked)

// Memory Leak Scenario 2: Global listeners never removed
class AnotherLeakyComponent {
  constructor() {
    this.data = new Array(10000).fill('data');

    // Document listener keeps component alive forever
    document.addEventListener('click', () => {
      this.handleGlobalClick();
    });
  }

  handleGlobalClick() {
    console.log('Global click', this.data.length);
  }

  destroy() {
    // Forgot to remove document listener!
    // Component stays in memory forever
  }
}
```

**How to Properly Remove Listeners:**

```javascript
class ProperCleanupComponent {
  constructor() {
    this.element = document.createElement('div');
    this.data = new Array(10000).fill('data');

    // Store bound handlers for cleanup
    this.handlers = {
      click: this.handleClick.bind(this),
      mouseenter: this.handleMouseEnter.bind(this),
      keydown: this.handleKeydown.bind(this)
    };

    // Attach listeners
    this.element.addEventListener('click', this.handlers.click);
    this.element.addEventListener('mouseenter', this.handlers.mouseenter);
    document.addEventListener('keydown', this.handlers.keydown);

    document.body.appendChild(this.element);
  }

  handleClick(e) {
    console.log('Click', this.data.length);
  }

  handleMouseEnter(e) {
    console.log('Mouse enter');
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.destroy();
    }
  }

  destroy() {
    // Remove all listeners
    this.element.removeEventListener('click', this.handlers.click);
    this.element.removeEventListener('mouseenter', this.handlers.mouseenter);
    document.removeEventListener('keydown', this.handlers.keydown);

    // Remove from DOM
    this.element.remove();

    // Clear references
    this.element = null;
    this.data = null;
    this.handlers = null;
  }
}
```

**Modern Cleanup with AbortController:**

```javascript
class ModernCleanupComponent {
  constructor() {
    this.element = document.createElement('div');
    this.controller = new AbortController();
    const { signal } = this.controller;

    // All listeners share same signal
    this.element.addEventListener('click', () => {
      this.handleClick();
    }, { signal });

    this.element.addEventListener('mouseenter', () => {
      this.handleMouseEnter();
    }, { signal });

    document.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    }, { signal });

    // Even works for fetch requests!
    fetch('/api/data', { signal })
      .then(response => response.json())
      .then(data => this.handleData(data));

    document.body.appendChild(this.element);
  }

  handleClick() {
    console.log('Click');
  }

  handleMouseEnter() {
    console.log('Mouse enter');
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.destroy();
    }
  }

  handleData(data) {
    console.log('Data loaded', data);
  }

  destroy() {
    // One line removes ALL listeners and cancels fetch!
    this.controller.abort();

    this.element.remove();
    this.element = null;
  }
}
```

---

### 🔍 Deep Dive: Memory Leak Detection and Prevention

**How Browser Tracks Event Listeners:**

```javascript
// Simplified browser internal representation
class BrowserEventListenerRegistry {
  constructor() {
    // WeakMap: element → Map<eventType → Set<listener>>
    this.listeners = new WeakMap();
  }

  addEventListener(element, type, listener, options) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }

    const elementListeners = this.listeners.get(element);

    if (!elementListeners.has(type)) {
      elementListeners.set(type, new Set());
    }

    const typeListeners = elementListeners.get(type);

    // Store listener with its options
    typeListeners.add({
      listener,
      options,
      // Store bound references
      boundListener: listener
    });
  }

  removeEventListener(element, type, listener) {
    const elementListeners = this.listeners.get(element);
    if (!elementListeners) return false;

    const typeListeners = elementListeners.get(type);
    if (!typeListeners) return false;

    // Must find exact same function reference
    for (const entry of typeListeners) {
      if (entry.listener === listener || entry.boundListener === listener) {
        typeListeners.delete(entry);
        return true;
      }
    }

    return false; // Listener not found
  }

  // Garbage collection interaction
  cleanupDetachedElements() {
    // WeakMap automatically removes entries when element is GC'd
    // BUT listeners prevent GC if they reference the element!

    // This is the root cause of many memory leaks:
    // element → listeners → closures → element (circular reference)
  }
}
```

**Circular Reference Problem:**

```javascript
class CircularReferenceLeak {
  demonstrateProblem() {
    const element = document.createElement('div');
    const bigData = new Array(100000).fill('x'); // ~100KB

    // LEAK: Closure captures 'element' and 'bigData'
    element.addEventListener('click', function() {
      console.log(element.id, bigData.length);
      // 'this' is element
      // closure captures bigData
      // → Circular reference: element → listener → element
    });

    document.body.appendChild(element);
    element.remove(); // Element detached but still in memory!

    // Memory chain:
    // element → event listener → closure → { element, bigData }
    // ↑_________________________________________________|
    //                 Circular reference!
  }

  demonstrateSolution() {
    const element = document.createElement('div');
    const bigData = new Array(100000).fill('x');

    // SOLUTION 1: Use WeakRef
    const weakElement = new WeakRef(element);
    const weakData = new WeakRef(bigData);

    function handleClick() {
      const el = weakElement.deref();
      const data = weakData.deref();

      if (el && data) {
        console.log(el.id, data.length);
      } else {
        // Element or data was garbage collected
        // Remove this listener
        document.removeEventListener('click', handleClick);
      }
    }

    element.addEventListener('click', handleClick);

    // SOLUTION 2: Explicit cleanup
    const controller = new AbortController();
    element.addEventListener('click', () => {
      console.log(element.id, bigData.length);
    }, { signal: controller.signal });

    // When done:
    controller.abort(); // Breaks circular reference
  }
}
```

**Memory Leak Detection Tools:**

```javascript
class MemoryLeakDetector {
  constructor() {
    this.listenerCount = new Map();
    this.elementCount = 0;
  }

  // Track listener additions
  trackAddListener(element, type) {
    const key = this.getElementKey(element);

    if (!this.listenerCount.has(key)) {
      this.listenerCount.set(key, new Map());
      this.elementCount++;
    }

    const elementListeners = this.listenerCount.get(key);
    elementListeners.set(type, (elementListeners.get(type) || 0) + 1);
  }

  // Track listener removals
  trackRemoveListener(element, type) {
    const key = this.getElementKey(element);
    const elementListeners = this.listenerCount.get(key);

    if (elementListeners) {
      const count = elementListeners.get(type) || 0;
      if (count > 0) {
        elementListeners.set(type, count - 1);
      }
    }
  }

  // Find potential leaks
  findLeaks() {
    const leaks = [];

    for (const [key, listeners] of this.listenerCount) {
      for (const [type, count] of listeners) {
        if (count > 0) {
          leaks.push({
            element: key,
            eventType: type,
            listenerCount: count,
            severity: count > 10 ? 'high' : 'medium'
          });
        }
      }
    }

    return leaks;
  }

  getElementKey(element) {
    if (!element._leakDetectorId) {
      element._leakDetectorId = `element-${this.elementCount}`;
    }
    return element._leakDetectorId;
  }

  // Chrome DevTools integration
  static getListenersFromDevTools() {
    // This only works in Chrome DevTools console
    const allElements = document.querySelectorAll('*');
    const report = [];

    allElements.forEach(el => {
      const listeners = getEventListeners(el);
      const listenerCount = Object.keys(listeners).reduce((sum, type) => {
        return sum + listeners[type].length;
      }, 0);

      if (listenerCount > 0) {
        report.push({
          element: el.tagName + (el.id ? `#${el.id}` : ''),
          listeners: listeners,
          count: listenerCount
        });
      }
    });

    return report.sort((a, b) => b.count - a.count);
  }
}

// Usage
const detector = new MemoryLeakDetector();

// Monkey-patch addEventListener
const originalAdd = Element.prototype.addEventListener;
Element.prototype.addEventListener = function(type, listener, options) {
  detector.trackAddListener(this, type);
  return originalAdd.call(this, type, listener, options);
};

const originalRemove = Element.prototype.removeEventListener;
Element.prototype.removeEventListener = function(type, listener, options) {
  detector.trackRemoveListener(this, type);
  return originalRemove.call(this, type, listener, options);
};

// Check for leaks
setTimeout(() => {
  const leaks = detector.findLeaks();
  console.table(leaks);
}, 5000);
```

---

### 🐛 Real-World Scenario: Infinite Feed Memory Leak

**The Problem:**

A social media feed application had memory leaks causing the browser to crash after scrolling through ~500 posts. Each post had event listeners that were never removed.

**Initial Metrics:**
- Memory growth: 2MB per post viewed
- Browser crash: After viewing ~500 posts (1GB+ memory)
- Scroll performance: Degraded from 60fps to 15fps after 100 posts
- User complaints: "App freezes after scrolling for a while"
- Mobile impact: Crashes on devices with <4GB RAM

**Buggy Implementation:**

```javascript
// ❌ WRONG: Listeners never removed, infinite memory growth
class BuggyPostComponent {
  constructor(postData) {
    this.data = postData;
    this.element = this.createElement();
    this.images = [];
    this.setupListeners();
  }

  createElement() {
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = `
      <div class="post-header">
        <img class="avatar" src="${this.data.avatar}" />
        <span class="username">${this.data.username}</span>
        <button class="follow-btn">Follow</button>
      </div>
      <img class="post-image" src="${this.data.image}" />
      <div class="post-actions">
        <button class="like-btn">Like</button>
        <button class="comment-btn">Comment</button>
        <button class="share-btn">Share</button>
      </div>
      <div class="comments"></div>
    `;
    return post;
  }

  setupListeners() {
    // BUG 1: Anonymous functions can't be removed
    this.element.querySelector('.like-btn').addEventListener('click', () => {
      this.likePost();
    });

    this.element.querySelector('.comment-btn').addEventListener('click', () => {
      this.showComments();
    });

    this.element.querySelector('.share-btn').addEventListener('click', () => {
      this.sharePost();
    });

    this.element.querySelector('.follow-btn').addEventListener('click', () => {
      this.followUser();
    });

    // BUG 2: Image load listener never removed
    const postImage = this.element.querySelector('.post-image');
    postImage.addEventListener('load', () => {
      this.onImageLoad();
    });

    this.images.push(postImage); // Keeps image in memory

    // BUG 3: Global listener for visibility tracking
    document.addEventListener('scroll', () => {
      this.trackVisibility(); // Every post adds a scroll listener!
    });

    // BUG 4: Intersection Observer not disconnected
    this.observer = new IntersectionObserver((entries) => {
      this.handleIntersection(entries);
    });
    this.observer.observe(this.element);
  }

  likePost() {
    console.log('Liked', this.data.id);
  }

  showComments() {
    // Loads more data without cleanup
    fetch(`/api/posts/${this.data.id}/comments`)
      .then(r => r.json())
      .then(comments => {
        this.renderComments(comments); // More event listeners added!
      });
  }

  renderComments(comments) {
    const container = this.element.querySelector('.comments');
    comments.forEach(comment => {
      const div = document.createElement('div');
      div.textContent = comment.text;

      // BUG 5: More listeners that never get removed
      div.addEventListener('click', () => {
        this.likeComment(comment.id);
      });

      container.appendChild(div);
    });
  }

  sharePost() {
    console.log('Shared', this.data.id);
  }

  followUser() {
    console.log('Followed', this.data.username);
  }

  onImageLoad() {
    console.log('Image loaded');
  }

  trackVisibility() {
    // Expensive calculation on every scroll!
    const rect = this.element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      console.log('Post visible:', this.data.id);
    }
  }

  handleIntersection(entries) {
    console.log('Intersection', entries);
  }

  // NO CLEANUP METHOD!
}

class BuggyFeed {
  constructor() {
    this.container = document.getElementById('feed');
    this.posts = [];
    this.page = 0;

    this.setupInfiniteScroll();
  }

  setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        this.loadMore();
      }
    });
  }

  async loadMore() {
    this.page++;
    const response = await fetch(`/api/posts?page=${this.page}`);
    const newPosts = await response.json();

    newPosts.forEach(postData => {
      const post = new BuggyPostComponent(postData);
      this.posts.push(post);
      this.container.appendChild(post.element);
    });

    // BUG: Old posts never removed from DOM or memory!
    // After viewing 500 posts:
    // - 500 posts in DOM
    // - 500 * 4 = 2000 button listeners
    // - 500 scroll listeners (!)
    // - 500 intersection observers
    // - 500 * average 10 comments = 5000 comment listeners
    // Total: ~8000 listeners + 500 observers = CRASH!
  }
}
```

**Fixed Implementation:**

```javascript
// ✅ CORRECT: Proper lifecycle and memory management
class FixedPostComponent {
  constructor(postData) {
    this.data = postData;
    this.element = this.createElement();
    this.controller = new AbortController();
    this.observers = [];

    this.setupListeners();
  }

  createElement() {
    const post = document.createElement('div');
    post.className = 'post';
    post.dataset.postId = this.data.id;
    post.innerHTML = `
      <div class="post-header">
        <img class="avatar" src="${this.data.avatar}" />
        <span class="username">${this.data.username}</span>
        <button class="follow-btn">Follow</button>
      </div>
      <img class="post-image" src="${this.data.image}" loading="lazy" />
      <div class="post-actions">
        <button class="like-btn">Like</button>
        <button class="comment-btn">Comment</button>
        <button class="share-btn">Share</button>
      </div>
      <div class="comments"></div>
    `;
    return post;
  }

  setupListeners() {
    const { signal } = this.controller;

    // Use event delegation on post element
    this.element.addEventListener('click', (e) => {
      const target = e.target;

      if (target.matches('.like-btn')) {
        this.likePost();
      } else if (target.matches('.comment-btn')) {
        this.showComments();
      } else if (target.matches('.share-btn')) {
        this.sharePost();
      } else if (target.matches('.follow-btn')) {
        this.followUser();
      }
    }, { signal });

    // Image load with cleanup
    const postImage = this.element.querySelector('.post-image');
    postImage.addEventListener('load', () => {
      this.onImageLoad();
    }, { signal, once: true });

    // Intersection Observer for visibility (better than scroll)
    const observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.5 }
    );
    observer.observe(this.element);
    this.observers.push(observer);
  }

  async showComments() {
    const container = this.element.querySelector('.comments');

    // Use same AbortController for fetch
    try {
      const response = await fetch(
        `/api/posts/${this.data.id}/comments`,
        { signal: this.controller.signal }
      );
      const comments = await response.json();

      // Event delegation for comments too
      container.innerHTML = comments.map(c => `
        <div class="comment" data-id="${c.id}">${c.text}</div>
      `).join('');

      container.addEventListener('click', (e) => {
        const comment = e.target.closest('.comment');
        if (comment) {
          this.likeComment(comment.dataset.id);
        }
      }, { signal: this.controller.signal });

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Comments fetch aborted');
      }
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Track visibility
        console.log('Post visible:', this.data.id);
      }
    });
  }

  likePost() {
    console.log('Liked', this.data.id);
  }

  likeComment(commentId) {
    console.log('Liked comment', commentId);
  }

  sharePost() {
    console.log('Shared', this.data.id);
  }

  followUser() {
    console.log('Followed', this.data.username);
  }

  onImageLoad() {
    console.log('Image loaded');
  }

  destroy() {
    // Abort all listeners and fetches
    this.controller.abort();

    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // Remove from DOM
    this.element.remove();

    // Clear references
    this.element = null;
    this.data = null;
  }
}

class FixedFeed {
  constructor() {
    this.container = document.getElementById('feed');
    this.posts = new Map(); // Use Map for O(1) lookup
    this.page = 0;
    this.maxPostsInDOM = 50; // Virtual scrolling threshold

    this.setupInfiniteScroll();
  }

  setupInfiniteScroll() {
    // Use IntersectionObserver instead of scroll listener
    this.sentinel = document.createElement('div');
    this.sentinel.className = 'scroll-sentinel';
    this.container.appendChild(this.sentinel);

    this.scrollObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    });

    this.scrollObserver.observe(this.sentinel);
  }

  async loadMore() {
    this.page++;
    const response = await fetch(`/api/posts?page=${this.page}`);
    const newPosts = await response.json();

    newPosts.forEach(postData => {
      const post = new FixedPostComponent(postData);
      this.posts.set(postData.id, post);
      this.container.insertBefore(post.element, this.sentinel);
    });

    // Virtual scrolling: Remove old posts from DOM
    if (this.posts.size > this.maxPostsInDOM) {
      this.recycleOldPosts();
    }
  }

  recycleOldPosts() {
    const postsArray = Array.from(this.posts.values());
    const toRemove = postsArray.slice(0, postsArray.length - this.maxPostsInDOM);

    toRemove.forEach(post => {
      post.destroy(); // Proper cleanup!
      this.posts.delete(post.data.id);
    });

    console.log(`Recycled ${toRemove.length} posts`);
  }

  destroy() {
    // Cleanup all posts
    this.posts.forEach(post => post.destroy());
    this.posts.clear();

    // Disconnect scroll observer
    this.scrollObserver.disconnect();

    this.sentinel.remove();
  }
}
```

**Metrics After Fix:**

```javascript
// Before fix:
// - Memory growth: 2MB per post
// - Total after 500 posts: 1GB+
// - Listeners after 500 posts: ~8,000
// - Observers: 500
// - Scroll performance: 15fps
// - Crash: After ~500 posts

// After fix:
// - Memory growth: Stable (50 posts max in DOM)
// - Total after 500 posts: 65MB (94% reduction!)
// - Listeners after 500 posts: ~50 (99% reduction!)
// - Observers: 50
// - Scroll performance: Stable 60fps
// - Crash: Never

// Virtual scrolling impact:
// - Only 50 posts in DOM at any time
// - Old posts properly destroyed
// - Memory usage capped
// - Performance maintained
```

---

*Due to length constraints, I'll continue with the remaining content (Trade-offs, Explain to Junior, and Questions 7-8) in the next edit.*