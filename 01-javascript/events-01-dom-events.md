# DOM Events - Complete Guide

## Question 1: What are event bubbling and capturing phases, and how do they work?

**Answer:**

Event bubbling and capturing are the two phases of event propagation in the DOM. When an event occurs on an element, it doesn't just trigger on that element—it propagates through the DOM tree in a specific order.

**Event Propagation Phases:**

1. **Capturing Phase (Capture)**: Event travels from the window down to the target element
2. **Target Phase**: Event reaches the actual target element
3. **Bubbling Phase (Bubble)**: Event travels back up from target to window

```javascript
// HTML structure
<div id="outer">
  <div id="middle">
    <button id="inner">Click Me</button>
  </div>
</div>

// Capturing phase (useCapture = true)
document.getElementById('outer').addEventListener('click', () => {
  console.log('Outer - Capturing');
}, true);

document.getElementById('middle').addEventListener('click', () => {
  console.log('Middle - Capturing');
}, true);

document.getElementById('inner').addEventListener('click', () => {
  console.log('Inner - Capturing');
}, true);

// Bubbling phase (useCapture = false, default)
document.getElementById('outer').addEventListener('click', () => {
  console.log('Outer - Bubbling');
}, false);

document.getElementById('middle').addEventListener('click', () => {
  console.log('Middle - Bubbling');
}, false);

document.getElementById('inner').addEventListener('click', () => {
  console.log('Inner - Bubbling');
}, false);

// Click on button outputs:
// Outer - Capturing
// Middle - Capturing
// Inner - Capturing
// Inner - Bubbling
// Middle - Bubbling
// Outer - Bubbling
```

**Key Characteristics:**

```javascript
// Most events bubble (except focus, blur, load, unload)
const bubblingEvents = ['click', 'mousedown', 'keypress', 'submit'];
const nonBubblingEvents = ['focus', 'blur', 'load', 'scroll'];

// Check if event bubbles
element.addEventListener('click', (e) => {
  console.log(e.bubbles); // true for click
});

element.addEventListener('focus', (e) => {
  console.log(e.bubbles); // false for focus
});
```

**Event Object Properties:**

```javascript
element.addEventListener('click', (event) => {
  console.log(event.target);        // Element that triggered the event
  console.log(event.currentTarget); // Element with the listener attached
  console.log(event.eventPhase);    // 1: Capturing, 2: Target, 3: Bubbling
});
```

---

### 🔍 Deep Dive: Browser Event System Internals

**How Browsers Implement Event Propagation:**

1. **Event Target Chain Construction:**
```javascript
// Browser builds the propagation path at event creation time
class EventPath {
  constructor(target) {
    this.path = [];
    let current = target;

    // Build path from target to window
    while (current) {
      this.path.push(current);
      current = current.parentNode || current.host; // Handle Shadow DOM
    }
    this.path.push(window);
  }

  // Capture phase: iterate forward
  capturePhase() {
    return this.path.slice().reverse();
  }

  // Bubble phase: iterate backward
  bubblePhase() {
    return this.path;
  }
}

// Example usage
const button = document.getElementById('btn');
const eventPath = new EventPath(button);

console.log('Capture:', eventPath.capturePhase());
// [window, document, html, body, div, button]

console.log('Bubble:', eventPath.bubblePhase());
// [button, div, body, html, document, window]
```

2. **Event Listener Registration Optimization:**
```javascript
// Browser maintains listener maps per element
class EventTarget {
  constructor() {
    this.listeners = new Map();
    // Map structure: { 'click': { capture: [...], bubble: [...] } }
  }

  addEventListener(type, listener, useCapture = false) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, { capture: [], bubble: [] });
    }

    const phase = useCapture ? 'capture' : 'bubble';
    const listeners = this.listeners.get(type)[phase];

    // Prevent duplicates (browsers deduplicate identical listeners)
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }
  }

  dispatchEvent(event) {
    const path = new EventPath(event.target);

    // Capture phase
    if (!event.propagationStopped) {
      for (const element of path.capturePhase()) {
        this.invokeListeners(element, event, 'capture');
        if (event.propagationStopped) break;
      }
    }

    // Bubble phase
    if (!event.propagationStopped) {
      for (const element of path.bubblePhase()) {
        this.invokeListeners(element, event, 'bubble');
        if (event.propagationStopped) break;
      }
    }
  }
}
```

**Performance Characteristics:**

```javascript
// Benchmark: Capture vs Bubble performance
class EventPropagationBenchmark {
  constructor() {
    this.metrics = {
      pathConstruction: 0,
      capturePhase: 0,
      bubblePhase: 0,
      totalListeners: 0
    };
  }

  measurePropagation(element, depth = 10) {
    const start = performance.now();

    // Build DOM tree
    let current = element;
    for (let i = 0; i < depth; i++) {
      const parent = document.createElement('div');
      parent.appendChild(current);
      current = parent;
    }

    this.metrics.pathConstruction = performance.now() - start;

    // Add listeners at each level
    const captureStart = performance.now();
    let node = element;
    while (node) {
      node.addEventListener('click', () => {}, true);
      this.metrics.totalListeners++;
      node = node.parentElement;
    }
    this.metrics.capturePhase = performance.now() - captureStart;

    // Dispatch event
    const bubbleStart = performance.now();
    element.click();
    this.metrics.bubblePhase = performance.now() - bubbleStart;

    return this.metrics;
  }
}

// Results on deep DOM tree (100 levels):
// Path construction: ~0.1ms
// Capture phase setup: ~0.3ms
// Bubble phase execution: ~0.5ms
// Total: ~0.9ms for 100 listeners
```

**Shadow DOM and Event Retargeting:**

```javascript
// Shadow DOM changes event.target during propagation
class ShadowEventPropagation {
  createShadowExample() {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });

    const button = document.createElement('button');
    button.textContent = 'Shadow Button';
    shadow.appendChild(button);

    // Listener outside shadow boundary
    host.addEventListener('click', (e) => {
      console.log('Event target:', e.target); // host (retargeted!)
      console.log('Composed path:', e.composedPath());
      // [button, shadow-root, host, ...]
    });

    // Listener inside shadow
    button.addEventListener('click', (e) => {
      console.log('Event target:', e.target); // button (actual target)
    });

    return { host, shadow, button };
  }
}
```

**Memory and Performance Impact:**

```javascript
// Event listener memory profiling
class EventListenerProfiler {
  static measureMemoryImpact() {
    const measurements = [];

    // Baseline memory
    if (performance.memory) {
      measurements.push({
        phase: 'baseline',
        heapUsed: performance.memory.usedJSHeapSize
      });
    }

    // Add 1000 capture listeners
    const elements = [];
    for (let i = 0; i < 1000; i++) {
      const el = document.createElement('div');
      el.addEventListener('click', () => {}, true);
      elements.push(el);
    }

    measurements.push({
      phase: 'capture-listeners',
      heapUsed: performance.memory.usedJSHeapSize,
      increase: performance.memory.usedJSHeapSize - measurements[0].heapUsed
    });

    // Add 1000 bubble listeners
    for (const el of elements) {
      el.addEventListener('click', () => {}, false);
    }

    measurements.push({
      phase: 'bubble-listeners',
      heapUsed: performance.memory.usedJSHeapSize,
      increase: performance.memory.usedJSHeapSize - measurements[1].heapUsed
    });

    return measurements;
    // Typical: ~50KB per 1000 listeners (Chrome V8)
  }
}
```

---

### 🐛 Real-World Scenario: Modal Click-Outside Handler Bug

**The Problem:**

A production e-commerce site had a modal that should close when clicking outside, but it was also closing when clicking inside due to event propagation issues.

**Initial Metrics:**
- Bug reports: 234 users in 2 days
- Cart abandonment increased by 12%
- Mobile users affected more (87% of reports)
- Average session time dropped from 4.2min to 2.1min

**Buggy Implementation:**

```javascript
// ❌ WRONG: Modal closes even when clicking inside
class BuggyModal {
  constructor() {
    this.modal = document.getElementById('modal');
    this.overlay = document.getElementById('overlay');
    this.content = document.getElementById('modal-content');
  }

  open() {
    this.modal.classList.add('active');

    // Problem: This fires for ALL clicks, even inside modal
    document.addEventListener('click', (e) => {
      this.close();
    });
  }

  close() {
    this.modal.classList.remove('active');
  }
}

// What happens:
// 1. User clicks button inside modal
// 2. Click event bubbles from button → modal → document
// 3. Document listener fires and closes modal
// 4. User frustrated, can't interact with modal!
```

**Root Cause Analysis:**

```javascript
// Debugging with event phase tracking
class EventDebugger {
  trackEventPropagation(elementId, eventType) {
    const element = document.getElementById(elementId);
    const propagationPath = [];

    // Track capture phase
    let current = element;
    while (current) {
      current.addEventListener(eventType, (e) => {
        propagationPath.push({
          phase: 'capture',
          element: e.currentTarget.tagName || 'document',
          target: e.target.tagName,
          timestamp: performance.now()
        });
      }, true);
      current = current.parentNode;
    }

    // Track bubble phase
    current = element;
    while (current) {
      current.addEventListener(eventType, (e) => {
        propagationPath.push({
          phase: 'bubble',
          element: e.currentTarget.tagName || 'document',
          target: e.target.tagName,
          timestamp: performance.now()
        });
      }, false);
      current = current.parentNode;
    }

    return propagationPath;
  }
}

// Output when clicking modal button:
// [
//   { phase: 'capture', element: 'DOCUMENT', target: 'BUTTON', timestamp: 100.2 },
//   { phase: 'capture', element: 'BODY', target: 'BUTTON', timestamp: 100.3 },
//   { phase: 'capture', element: 'DIV', target: 'BUTTON', timestamp: 100.4 },
//   { phase: 'bubble', element: 'BUTTON', target: 'BUTTON', timestamp: 100.5 },
//   { phase: 'bubble', element: 'DIV', target: 'BUTTON', timestamp: 100.6 },
//   { phase: 'bubble', element: 'BODY', target: 'BUTTON', timestamp: 100.7 },
//   { phase: 'bubble', element: 'DOCUMENT', target: 'BUTTON', timestamp: 100.8 }
//   // ^^^ This is where modal closes incorrectly!
// ]
```

**Solution with Proper Propagation Handling:**

```javascript
// ✅ CORRECT: Multiple approaches
class FixedModal {
  constructor() {
    this.modal = document.getElementById('modal');
    this.overlay = document.getElementById('overlay');
    this.content = document.getElementById('modal-content');
    this.closeHandler = null;
  }

  // Approach 1: Check event.target
  open() {
    this.modal.classList.add('active');

    this.closeHandler = (e) => {
      // Only close if clicking directly on overlay, not children
      if (e.target === this.overlay) {
        this.close();
      }
    };

    document.addEventListener('click', this.closeHandler);
  }

  // Approach 2: Stop propagation from modal content
  openWithStopPropagation() {
    this.modal.classList.add('active');

    // Prevent clicks inside modal from reaching document
    this.content.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Now safe to close on any document click
    this.closeHandler = () => this.close();
    document.addEventListener('click', this.closeHandler);
  }

  // Approach 3: Use capture phase to check before bubbling
  openWithCapture() {
    this.modal.classList.add('active');

    this.closeHandler = (e) => {
      // Check if click is outside modal during capture phase
      if (!this.modal.contains(e.target)) {
        this.close();
      }
    };

    // Use capture phase - fires before any bubble listeners
    document.addEventListener('click', this.closeHandler, true);
  }

  close() {
    this.modal.classList.remove('active');
    if (this.closeHandler) {
      document.removeEventListener('click', this.closeHandler);
      document.removeEventListener('click', this.closeHandler, true);
      this.closeHandler = null;
    }
  }
}
```

**Performance Metrics After Fix:**

```javascript
// Monitoring solution
class ModalMetrics {
  constructor() {
    this.metrics = {
      opens: 0,
      closes: 0,
      clicksInside: 0,
      clicksOutside: 0,
      falseCloses: 0,
      avgOpenDuration: 0
    };
    this.openTime = null;
  }

  trackOpen() {
    this.metrics.opens++;
    this.openTime = performance.now();
  }

  trackClose(wasOutsideClick) {
    this.metrics.closes++;

    if (wasOutsideClick) {
      this.metrics.clicksOutside++;
    }

    const duration = performance.now() - this.openTime;
    this.metrics.avgOpenDuration =
      (this.metrics.avgOpenDuration * (this.metrics.closes - 1) + duration)
      / this.metrics.closes;
  }

  trackClickInside() {
    this.metrics.clicksInside++;

    // Detect false close (modal closed but should stay open)
    setTimeout(() => {
      if (!document.querySelector('.modal.active')) {
        this.metrics.falseCloses++;
      }
    }, 10);
  }
}

// Results after fix:
// Before: falseCloses: 234, avgOpenDuration: 2.1s, abandonment: 12%
// After:  falseCloses: 0, avgOpenDuration: 18.3s, abandonment: 2%
```

---

### ⚖️ Trade-offs: Capture vs Bubble Phase

**When to Use Capture Phase:**

| Use Case | Why Capture | Example |
|----------|-------------|---------|
| **Event Interception** | Process before target | Analytics tracking, security checks |
| **Click-outside Detection** | Check before child handlers | Modals, dropdowns, tooltips |
| **Global Event Handling** | Override child behavior | Keyboard shortcuts, drag-and-drop |
| **Performance Critical** | Avoid unnecessary bubbling | High-frequency events (mousemove) |

**When to Use Bubble Phase:**

| Use Case | Why Bubble | Example |
|----------|------------|---------|
| **Event Delegation** | Handle child events at parent | List items, table rows |
| **Normal Event Flow** | Most intuitive pattern | Form submissions, button clicks |
| **React to User Actions** | After target processed | Toast notifications, logging |
| **Default Browser Behavior** | Works with native handlers | Links, form inputs |

**Performance Comparison:**

```javascript
class PhasePerformanceComparison {
  static benchmark(iterations = 10000) {
    const results = {
      captureOnly: 0,
      bubbleOnly: 0,
      both: 0,
      neither: 0
    };

    const container = document.createElement('div');
    for (let i = 0; i < 10; i++) {
      const child = document.createElement('div');
      container.appendChild(child);
    }
    document.body.appendChild(container);

    const target = container.firstChild;

    // Test 1: Capture only
    const captureHandler = () => {};
    container.addEventListener('click', captureHandler, true);

    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
      target.click();
    }
    results.captureOnly = performance.now() - start;
    container.removeEventListener('click', captureHandler, true);

    // Test 2: Bubble only
    const bubbleHandler = () => {};
    container.addEventListener('click', bubbleHandler, false);

    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      target.click();
    }
    results.bubbleOnly = performance.now() - start;
    container.removeEventListener('click', bubbleHandler, false);

    // Test 3: Both phases
    container.addEventListener('click', captureHandler, true);
    container.addEventListener('click', bubbleHandler, false);

    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      target.click();
    }
    results.both = performance.now() - start;

    document.body.removeChild(container);

    return results;
    // Typical results (10k iterations):
    // captureOnly: 45ms
    // bubbleOnly: 48ms
    // both: 89ms (not quite 2x due to shared path construction)
  }
}
```

**Decision Matrix:**

```javascript
class EventPhaseStrategy {
  static selectPhase(scenario) {
    const strategies = {
      // High priority interception
      'modal-click-outside': {
        phase: 'capture',
        reason: 'Need to check before child handlers',
        performance: 'excellent',
        complexity: 'low'
      },

      // Event delegation
      'list-item-clicks': {
        phase: 'bubble',
        reason: 'Handle many children with one listener',
        performance: 'excellent',
        complexity: 'low'
      },

      // Global keyboard shortcuts
      'keyboard-shortcuts': {
        phase: 'capture',
        reason: 'Override child input handlers',
        performance: 'good',
        complexity: 'medium'
      },

      // Form validation
      'form-validation': {
        phase: 'bubble',
        reason: 'Validate after input processing',
        performance: 'good',
        complexity: 'low'
      },

      // Analytics tracking
      'analytics': {
        phase: 'capture',
        reason: 'Track all events before handlers',
        performance: 'good',
        complexity: 'medium'
      }
    };

    return strategies[scenario];
  }

  static recommendPhase(requirements) {
    const {
      needsEarlyAccess,
      preventDefaultBehavior,
      handlesMultipleChildren,
      performanceCritical
    } = requirements;

    if (needsEarlyAccess || preventDefaultBehavior) {
      return { phase: 'capture', confidence: 'high' };
    }

    if (handlesMultipleChildren) {
      return { phase: 'bubble', confidence: 'high' };
    }

    if (performanceCritical) {
      return {
        phase: 'capture',
        confidence: 'medium',
        note: 'Can stop propagation early'
      };
    }

    return { phase: 'bubble', confidence: 'medium', note: 'Default choice' };
  }
}
```

---

### 💬 Explain to Junior: Event Propagation

**Simple Analogy:**

Imagine you're in a tall building with many floors (DOM hierarchy). When you press a button on the 5th floor:

1. **Capture Phase**: A message travels from the roof (window) down through each floor to the 5th floor
   - "Someone's pressing a button, heads up everyone above!"

2. **Target Phase**: The message reaches the button on the 5th floor
   - "I'm the button being pressed!"

3. **Bubble Phase**: The message travels back up from the 5th floor to the roof
   - "Hey everyone, the button on the 5th floor was pressed!"

Each floor (element) can choose to listen during the "going down" phase (capture) or "coming back up" phase (bubble).

**Visual Diagram:**

```
Capture Phase (↓)          Bubble Phase (↑)
================          ================

Window (1)               Window (6)
   ↓                        ↑
Document (2)             Document (5)
   ↓                        ↑
<html> (3)               <html> (4)
   ↓                        ↑
<body>                   <body>
   ↓                        ↑
<div>                    <div>
   ↓                        ↑
<button> ← TARGET → <button>
```

**Interview Answer Template:**

> "Event propagation in the DOM has three phases. When you click an element, the event doesn't just fire on that element—it travels through the entire DOM tree.
>
> First is the **capture phase**, where the event travels from the window down to the target element. Think of it like a message going down a chain of command.
>
> Then the **target phase** where the event reaches the actual element you clicked.
>
> Finally, the **bubble phase** where the event travels back up from the target to the window.
>
> By default, event listeners use the bubble phase, but you can specify `addEventListener(type, handler, true)` to listen during capture.
>
> This is important because it enables patterns like event delegation—where you attach one listener to a parent instead of many listeners to children. For example, instead of adding a click listener to 100 list items, you add one to the parent `<ul>` and check `event.target` to see which item was clicked.
>
> You can also stop propagation with `event.stopPropagation()` to prevent the event from continuing to bubble or capture."

**Common Mistakes:**

```javascript
// ❌ Mistake 1: Not understanding event.target vs event.currentTarget
parent.addEventListener('click', (e) => {
  console.log(e.target);        // Child that was clicked
  console.log(e.currentTarget); // Parent with the listener (always parent)
});

// ❌ Mistake 2: Stopping propagation unnecessarily
button.addEventListener('click', (e) => {
  e.stopPropagation(); // Blocks all parent listeners!
  // This might break event delegation patterns
});

// ❌ Mistake 3: Adding document listeners without cleanup
function showModal() {
  document.addEventListener('click', closeModal); // Memory leak!
  // Should remove listener when modal closes
}

// ✅ Correct patterns
class EventPropagationPatterns {
  // Pattern 1: Event delegation
  handleListClicks() {
    this.list.addEventListener('click', (e) => {
      if (e.target.matches('li')) {
        console.log('List item clicked:', e.target.textContent);
      }
    });
  }

  // Pattern 2: Capture for early interception
  handleClickOutside() {
    this.handler = (e) => {
      if (!this.modal.contains(e.target)) {
        this.close();
      }
    };
    document.addEventListener('click', this.handler, true);
  }

  // Pattern 3: Proper cleanup
  destroy() {
    if (this.handler) {
      document.removeEventListener('click', this.handler, true);
    }
  }
}
```

**Quick Reference:**

```javascript
// Bubble phase (default) - most common
element.addEventListener('click', handler);
element.addEventListener('click', handler, false);

// Capture phase - for interception
element.addEventListener('click', handler, true);
element.addEventListener('click', handler, { capture: true });

// Stop propagation
event.stopPropagation();        // Stop capture or bubble
event.stopImmediatePropagation(); // Stop + prevent other listeners on same element

// Check propagation info
console.log(event.bubbles);      // Does this event bubble?
console.log(event.eventPhase);   // 1: Capture, 2: Target, 3: Bubble
console.log(event.target);       // Element that triggered event
console.log(event.currentTarget); // Element with listener attached
```

---

## Question 2: What is event delegation and why is it important?

**Answer:**

Event delegation is a pattern where you attach a single event listener to a parent element to handle events for multiple child elements, instead of attaching listeners to each child individually. It leverages event bubbling to catch events from child elements at a common ancestor.

**Basic Implementation:**

```javascript
// ❌ Without delegation - inefficient
const buttons = document.querySelectorAll('.item-button');
buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    console.log('Button clicked:', e.target.textContent);
  });
});
// Problem: 100 buttons = 100 event listeners = more memory

// ✅ With delegation - efficient
const container = document.querySelector('.items-container');
container.addEventListener('click', (e) => {
  if (e.target.matches('.item-button')) {
    console.log('Button clicked:', e.target.textContent);
  }
});
// Solution: 1 event listener handles all buttons
```

**Advantages:**

1. **Memory Efficiency**: One listener instead of many
2. **Dynamic Content**: Works with elements added after page load
3. **Performance**: Fewer listeners = faster page load
4. **Maintainability**: Single point of control

**Real-World Example:**

```html
<ul id="todo-list">
  <li data-id="1">
    <span class="todo-text">Buy milk</span>
    <button class="delete-btn">Delete</button>
    <button class="edit-btn">Edit</button>
  </li>
  <li data-id="2">
    <span class="todo-text">Walk dog</span>
    <button class="delete-btn">Delete</button>
    <button class="edit-btn">Edit</button>
  </li>
  <!-- More items added dynamically -->
</ul>
```

```javascript
class TodoList {
  constructor(listElement) {
    this.list = listElement;
    this.init();
  }

  init() {
    // Single delegated listener handles all interactions
    this.list.addEventListener('click', (e) => {
      const target = e.target;
      const listItem = target.closest('li');

      if (!listItem) return;

      const todoId = listItem.dataset.id;

      if (target.matches('.delete-btn')) {
        this.deleteTodo(todoId);
      } else if (target.matches('.edit-btn')) {
        this.editTodo(todoId);
      } else if (target.matches('.todo-text')) {
        this.toggleComplete(todoId);
      }
    });
  }

  addTodo(text) {
    const li = document.createElement('li');
    li.dataset.id = Date.now();
    li.innerHTML = `
      <span class="todo-text">${text}</span>
      <button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
    `;
    this.list.appendChild(li);
    // No need to attach new listeners - delegation handles it!
  }

  deleteTodo(id) {
    const item = this.list.querySelector(`[data-id="${id}"]`);
    item?.remove();
  }

  editTodo(id) {
    console.log('Edit todo:', id);
  }

  toggleComplete(id) {
    const item = this.list.querySelector(`[data-id="${id}"]`);
    item?.classList.toggle('completed');
  }
}
```

**Advanced Pattern Matching:**

```javascript
class EventDelegator {
  constructor(root) {
    this.root = root;
    this.handlers = new Map();
  }

  // Register handlers for specific selectors
  on(selector, eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);

      // Set up delegated listener for this event type
      this.root.addEventListener(eventType, (e) => {
        this.handleEvent(e);
      });
    }

    this.handlers.get(eventType).push({ selector, handler });
  }

  handleEvent(event) {
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;

    // Check each registered selector
    for (const { selector, handler } of handlers) {
      // Find matching element in event path
      const matchedElement = event.target.closest(selector);

      if (matchedElement && this.root.contains(matchedElement)) {
        handler.call(matchedElement, event);
      }
    }
  }

  off(selector, eventType) {
    const handlers = this.handlers.get(eventType);
    if (!handlers) return;

    const index = handlers.findIndex(h => h.selector === selector);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}

// Usage
const delegator = new EventDelegator(document.body);

delegator.on('.delete-btn', 'click', function(e) {
  console.log('Delete clicked:', this);
});

delegator.on('.edit-btn', 'click', function(e) {
  console.log('Edit clicked:', this);
});

delegator.on('input[type="checkbox"]', 'change', function(e) {
  console.log('Checkbox toggled:', this.checked);
});
```

---

### 🔍 Deep Dive: Event Delegation Optimization

**Memory Impact Analysis:**

```javascript
class EventListenerMemoryProfiler {
  static compareMemoryUsage(numElements = 1000) {
    const results = {
      individual: { memory: 0, time: 0 },
      delegated: { memory: 0, time: 0 }
    };

    // Test 1: Individual listeners
    if (performance.memory) {
      const beforeIndividual = performance.memory.usedJSHeapSize;
      const startTime = performance.now();

      const container1 = document.createElement('div');
      for (let i = 0; i < numElements; i++) {
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        button.addEventListener('click', function() {
          console.log(this.textContent);
        });
        container1.appendChild(button);
      }
      document.body.appendChild(container1);

      results.individual.time = performance.now() - startTime;
      results.individual.memory =
        performance.memory.usedJSHeapSize - beforeIndividual;

      container1.remove();

      // Force garbage collection (Chrome with --expose-gc flag)
      if (global.gc) global.gc();

      // Test 2: Delegated listeners
      const beforeDelegated = performance.memory.usedJSHeapSize;
      const startTime2 = performance.now();

      const container2 = document.createElement('div');
      container2.addEventListener('click', (e) => {
        if (e.target.matches('button')) {
          console.log(e.target.textContent);
        }
      });

      for (let i = 0; i < numElements; i++) {
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        container2.appendChild(button);
      }
      document.body.appendChild(container2);

      results.delegated.time = performance.now() - startTime2;
      results.delegated.memory =
        performance.memory.usedJSHeapSize - beforeDelegated;

      container2.remove();
    }

    return results;
  }
}

// Typical results for 1000 elements:
// Individual:
//   - Memory: ~450KB (each closure + event listener registration)
//   - Time: ~85ms
//
// Delegated:
//   - Memory: ~45KB (single listener + element creation)
//   - Time: ~12ms
//
// Savings: 90% memory, 86% faster setup time
```

**Browser Event Listener Registration:**

```javascript
// How browsers internally handle event delegation
class BrowserEventSystem {
  constructor() {
    // Each element has a listener map
    this.elementListeners = new WeakMap();
    // Global event handler registry
    this.globalHandlers = new Map();
  }

  addEventListener(element, type, handler, options) {
    const capture = options?.capture || false;

    if (!this.elementListeners.has(element)) {
      this.elementListeners.set(element, new Map());
    }

    const elementMap = this.elementListeners.get(element);
    const key = `${type}:${capture}`;

    if (!elementMap.has(key)) {
      elementMap.set(key, new Set());
    }

    elementMap.get(key).add(handler);

    // Register with global handler if first listener of this type
    if (!this.globalHandlers.has(key)) {
      this.setupGlobalHandler(type, capture);
    }
  }

  setupGlobalHandler(type, capture) {
    const key = `${type}:${capture}`;

    // Browser's actual event dispatch mechanism
    const globalHandler = (nativeEvent) => {
      const path = this.buildEventPath(nativeEvent.target);

      // Capture phase or bubble phase
      const elements = capture ? path.reverse() : path;

      for (const element of elements) {
        if (nativeEvent.cancelBubble) break;

        const listeners = this.elementListeners.get(element)?.get(key);
        if (listeners) {
          for (const handler of listeners) {
            handler.call(element, nativeEvent);
          }
        }
      }
    };

    this.globalHandlers.set(key, globalHandler);
  }

  buildEventPath(target) {
    const path = [];
    let current = target;

    while (current) {
      path.push(current);
      current = current.parentNode;
    }

    return path;
  }
}

// Why delegation is faster:
// Individual: Browser must check 1000 elements during propagation
// Delegated: Browser only checks 1 element (parent)
```

**Advanced Selector Matching Performance:**

```javascript
class DelegationSelectorPerformance {
  static benchmarkMatchers(iterations = 10000) {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="level-1">
        <div class="level-2">
          <button class="target-btn" data-action="delete">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    const button = container.querySelector('.target-btn');
    const results = {};

    // Test 1: matches()
    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
      button.matches('.target-btn');
    }
    results.matches = performance.now() - start;

    // Test 2: closest()
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      button.closest('.target-btn');
    }
    results.closest = performance.now() - start;

    // Test 3: classList.contains()
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      button.classList.contains('target-btn');
    }
    results.classListContains = performance.now() - start;

    // Test 4: getAttribute()
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      button.getAttribute('data-action') === 'delete';
    }
    results.getAttribute = performance.now() - start;

    // Test 5: Manual class check
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      button.className.includes('target-btn');
    }
    results.manualClassCheck = performance.now() - start;

    container.remove();

    return results;
    // Typical results (10k iterations):
    // classListContains: 0.8ms (fastest)
    // getAttribute: 1.2ms
    // manualClassCheck: 1.5ms
    // matches: 3.5ms
    // closest: 4.2ms (slowest, but most flexible)
  }

  static optimizedDelegation(root) {
    // Use fastest methods when possible
    root.addEventListener('click', (e) => {
      const target = e.target;

      // Fast path: class-based delegation
      if (target.classList.contains('delete-btn')) {
        return handleDelete(target);
      }

      if (target.classList.contains('edit-btn')) {
        return handleEdit(target);
      }

      // Slow path: complex selectors only when needed
      const complexTarget = target.closest('[data-action]');
      if (complexTarget) {
        handleComplexAction(complexTarget);
      }
    });
  }
}
```

**Event Delegation with Shadow DOM:**

```javascript
class ShadowDOMDelegation {
  constructor() {
    this.host = document.createElement('div');
    this.shadow = this.host.attachShadow({ mode: 'open' });
  }

  setupDelegation() {
    // Problem: Delegation across shadow boundary
    document.addEventListener('click', (e) => {
      // e.target is retargeted to host, not actual button!
      console.log(e.target); // <div> (host), not <button>
    });

    // Solution 1: Use composedPath()
    document.addEventListener('click', (e) => {
      const path = e.composedPath();

      for (const element of path) {
        if (element.matches && element.matches('.shadow-button')) {
          console.log('Shadow button clicked:', element);
          break;
        }
      }
    });

    // Solution 2: Delegate within shadow root
    this.shadow.addEventListener('click', (e) => {
      // Inside shadow, target is correct
      if (e.target.matches('.shadow-button')) {
        console.log('Button clicked:', e.target);
      }
    });
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        .shadow-button { padding: 10px; }
      </style>
      <div class="container">
        <button class="shadow-button">Click Me</button>
        <button class="shadow-button">Click Me Too</button>
      </div>
    `;
  }
}
```

---

### 🐛 Real-World Scenario: Performance Crisis in Large Data Table

**The Problem:**

A financial dashboard displayed 10,000 row table with 5 action buttons per row (50,000 total buttons). Individual event listeners caused severe performance issues.

**Initial Metrics:**
- Page load time: 18.5 seconds
- Time to Interactive (TTI): 24.3 seconds
- Memory usage: 245MB
- Click response: 800ms delay
- Browser warnings: "Page unresponsive"
- User complaints: 89% of active users

**Problematic Code:**

```javascript
// ❌ DISASTER: 50,000 event listeners
class SlowDataTable {
  renderTable(data) {
    const tbody = document.getElementById('table-body');

    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.name}</td>
        <td>${row.amount}</td>
        <td class="actions">
          <button class="view-btn">View</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <button class="export-btn">Export</button>
          <button class="share-btn">Share</button>
        </td>
      `;

      // Problem: Adding 5 listeners per row × 10,000 rows = 50,000 listeners!
      tr.querySelector('.view-btn').addEventListener('click', () => {
        this.viewRow(row.id);
      });

      tr.querySelector('.edit-btn').addEventListener('click', () => {
        this.editRow(row.id);
      });

      tr.querySelector('.delete-btn').addEventListener('click', () => {
        this.deleteRow(row.id);
      });

      tr.querySelector('.export-btn').addEventListener('click', () => {
        this.exportRow(row.id);
      });

      tr.querySelector('.share-btn').addEventListener('click', () => {
        this.shareRow(row.id);
      });

      tbody.appendChild(tr);
    });
  }
}

// Performance breakdown:
// - querySelector calls: 50,000 (100ms each) = 5000ms
// - addEventListener calls: 50,000 (20ms each) = 1000ms
// - Memory per listener: ~5KB × 50,000 = 250MB
// - Total setup time: ~6000ms just for event listeners!
```

**Debugging Process:**

```javascript
class PerformanceDebugger {
  static profileEventListeners() {
    // Chrome DevTools method
    const listeners = getEventListeners(document.body);

    console.table({
      click: listeners.click?.length || 0,
      mouseover: listeners.mouseover?.length || 0,
      mouseout: listeners.mouseout?.length || 0,
      total: Object.values(listeners).reduce((sum, arr) => sum + arr.length, 0)
    });

    // Memory profiling
    if (performance.memory) {
      console.log('JS Heap Size:',
        (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2), 'MB'
      );
    }
  }

  static measureEventLatency() {
    const measurements = [];

    document.addEventListener('click', (e) => {
      const start = performance.now();

      // Measure time from click to handler execution
      requestAnimationFrame(() => {
        const latency = performance.now() - start;
        measurements.push(latency);

        if (measurements.length >= 100) {
          console.log('Average latency:',
            measurements.reduce((a, b) => a + b) / measurements.length, 'ms'
          );
        }
      });
    });
  }
}

// Results showed:
// - 50,142 click listeners registered
// - 245MB heap size
// - 800ms average click latency (unacceptable!)
```

**Solution with Event Delegation:**

```javascript
// ✅ OPTIMIZED: Single delegated listener
class FastDataTable {
  constructor() {
    this.tbody = document.getElementById('table-body');
    this.setupDelegation();
  }

  setupDelegation() {
    // ONE listener handles ALL button clicks
    this.tbody.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      // Get row ID from closest tr
      const row = button.closest('tr');
      const rowId = row.dataset.id;

      // Route based on button class
      if (button.classList.contains('view-btn')) {
        this.viewRow(rowId);
      } else if (button.classList.contains('edit-btn')) {
        this.editRow(rowId);
      } else if (button.classList.contains('delete-btn')) {
        this.deleteRow(rowId);
      } else if (button.classList.contains('export-btn')) {
        this.exportRow(rowId);
      } else if (button.classList.contains('share-btn')) {
        this.shareRow(rowId);
      }
    });
  }

  renderTable(data) {
    // Use DocumentFragment for batch insert
    const fragment = document.createDocumentFragment();

    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.dataset.id = row.id; // Store ID in data attribute
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.name}</td>
        <td>${row.amount}</td>
        <td class="actions">
          <button class="view-btn">View</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <button class="export-btn">Export</button>
          <button class="share-btn">Share</button>
        </td>
      `;
      fragment.appendChild(tr);
    });

    // Single DOM operation
    this.tbody.appendChild(fragment);
  }

  // Action methods
  viewRow(id) {
    console.log('View row:', id);
  }

  editRow(id) {
    console.log('Edit row:', id);
  }

  deleteRow(id) {
    const row = this.tbody.querySelector(`tr[data-id="${id}"]`);
    row?.remove();
  }

  exportRow(id) {
    console.log('Export row:', id);
  }

  shareRow(id) {
    console.log('Share row:', id);
  }
}
```

**Further Optimization with Event Target Caching:**

```javascript
class UltraFastDataTable extends FastDataTable {
  constructor() {
    super();
    // Cache action types for faster lookup
    this.actionMap = new Map([
      ['view-btn', this.viewRow],
      ['edit-btn', this.editRow],
      ['delete-btn', this.deleteRow],
      ['export-btn', this.exportRow],
      ['share-btn', this.shareRow]
    ]);
  }

  setupDelegation() {
    this.tbody.addEventListener('click', (e) => {
      const button = e.target;

      // Fast path: Check if target is button directly
      if (button.tagName !== 'BUTTON') {
        // Slow path: Check parents (for icon clicks inside buttons)
        const parentButton = button.closest('button');
        if (!parentButton) return;
        this.handleButtonClick(parentButton);
      } else {
        this.handleButtonClick(button);
      }
    });
  }

  handleButtonClick(button) {
    // Find handler using class list (faster than multiple if/else)
    for (const className of button.classList) {
      const handler = this.actionMap.get(className);
      if (handler) {
        const rowId = button.closest('tr').dataset.id;
        handler.call(this, rowId);
        break;
      }
    }
  }
}
```

**Performance Metrics After Fix:**

```javascript
class TablePerformanceMonitor {
  static compareImplementations(rowCount = 10000) {
    const metrics = {
      slow: {},
      fast: {},
      improvement: {}
    };

    // Measure slow implementation
    const slowStart = performance.now();
    const slowTable = new SlowDataTable();
    const slowData = this.generateData(rowCount);
    slowTable.renderTable(slowData);
    metrics.slow.renderTime = performance.now() - slowStart;
    metrics.slow.listenerCount = 50000;
    metrics.slow.memory = performance.memory?.usedJSHeapSize || 0;

    // Clean up
    document.getElementById('table-body').innerHTML = '';

    // Measure fast implementation
    const fastStart = performance.now();
    const fastTable = new FastDataTable();
    const fastData = this.generateData(rowCount);
    fastTable.renderTable(fastData);
    metrics.fast.renderTime = performance.now() - fastStart;
    metrics.fast.listenerCount = 1;
    metrics.fast.memory = performance.memory?.usedJSHeapSize || 0;

    // Calculate improvements
    metrics.improvement = {
      renderTime: `${((1 - metrics.fast.renderTime / metrics.slow.renderTime) * 100).toFixed(1)}% faster`,
      listenerCount: `${((1 - metrics.fast.listenerCount / metrics.slow.listenerCount) * 100).toFixed(1)}% fewer`,
      memory: `${((1 - metrics.fast.memory / metrics.slow.memory) * 100).toFixed(1)}% less`
    };

    return metrics;
  }

  static generateData(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      amount: Math.random() * 1000
    }));
  }
}

// Real results:
// BEFORE (Individual listeners):
//   - Render time: 6,200ms
//   - Listener count: 50,000
//   - Memory: 245MB
//   - Click latency: 800ms
//
// AFTER (Event delegation):
//   - Render time: 180ms (97% faster!)
//   - Listener count: 1 (99.998% fewer!)
//   - Memory: 18MB (93% less!)
//   - Click latency: 12ms (98.5% faster!)
//
// User Impact:
//   - Page load: 18.5s → 2.1s
//   - TTI: 24.3s → 3.2s
//   - User satisfaction: 11% → 94%
```

---

### ⚖️ Trade-offs: Event Delegation vs Individual Listeners

**When Event Delegation Wins:**

| Scenario | Why Delegation | Performance Gain |
|----------|----------------|------------------|
| **Large lists/tables** | 1 listener vs thousands | 90-95% memory savings |
| **Dynamic content** | No need to re-attach listeners | Eliminates re-render overhead |
| **Simple interactions** | Class/attribute matching is fast | Minimal latency increase |
| **Mobile devices** | Lower memory footprint | Better on constrained devices |

**When Individual Listeners Win:**

| Scenario | Why Individual | Trade-off |
|----------|----------------|-----------|
| **Complex event logic** | Direct access to element context | Clearer code vs memory |
| **Performance-critical handlers** | No selector matching overhead | ~2-5ms faster per click |
| **Different event types per element** | Avoid complex routing logic | Maintainability vs memory |
| **Small number of elements** | Negligible memory difference | Simplicity vs optimization |

**Decision Matrix:**

```javascript
class EventStrategySelector {
  static selectStrategy(config) {
    const {
      elementCount,
      isDynamic,
      eventTypes,
      handlerComplexity,
      memorySensitive
    } = config;

    // Rule 1: Always delegate for large lists
    if (elementCount > 100) {
      return {
        strategy: 'delegation',
        reason: 'High element count',
        confidence: 'high'
      };
    }

    // Rule 2: Always delegate for dynamic content
    if (isDynamic) {
      return {
        strategy: 'delegation',
        reason: 'Dynamic content requires delegation',
        confidence: 'high'
      };
    }

    // Rule 3: Individual for complex, different handlers
    if (eventTypes > 3 && handlerComplexity === 'high') {
      return {
        strategy: 'individual',
        reason: 'Complex different handlers per element',
        confidence: 'medium'
      };
    }

    // Rule 4: Delegation for memory-constrained environments
    if (memorySensitive && elementCount > 20) {
      return {
        strategy: 'delegation',
        reason: 'Memory-sensitive environment',
        confidence: 'high'
      };
    }

    // Default: Individual for simplicity
    return {
      strategy: 'individual',
      reason: 'Small count, simple handlers',
      confidence: 'low'
    };
  }

  static estimatePerformance(strategy, elementCount) {
    const estimates = {
      individual: {
        memory: elementCount * 5 * 1024, // 5KB per listener
        setupTime: elementCount * 0.02, // 0.02ms per listener
        clickLatency: 1 // ~1ms
      },
      delegation: {
        memory: 5 * 1024, // One listener
        setupTime: 0.02, // Single listener
        clickLatency: 3 + (elementCount / 1000) // ~3ms + selector matching
      }
    };

    return estimates[strategy];
  }
}

// Usage example
const config = {
  elementCount: 500,
  isDynamic: true,
  eventTypes: 2,
  handlerComplexity: 'low',
  memorySensitive: false
};

const recommendation = EventStrategySelector.selectStrategy(config);
console.log(recommendation);
// { strategy: 'delegation', reason: 'High element count', confidence: 'high' }

const perf = EventStrategySelector.estimatePerformance('delegation', 500);
console.log(perf);
// { memory: 5120, setupTime: 0.02, clickLatency: 3.5 }
```

**Hybrid Approach:**

```javascript
class HybridEventStrategy {
  constructor(container) {
    this.container = container;
    this.individualListeners = new Map();
  }

  // Use delegation for common actions
  setupDelegation() {
    this.container.addEventListener('click', (e) => {
      if (e.target.matches('.delete-btn')) {
        this.handleDelete(e.target);
      } else if (e.target.matches('.edit-btn')) {
        this.handleEdit(e.target);
      }
    });
  }

  // Use individual listeners for complex/unique handlers
  addSpecialHandler(element, handler) {
    element.addEventListener('click', handler);
    this.individualListeners.set(element, handler);
  }

  cleanup() {
    // Clean up individual listeners
    for (const [element, handler] of this.individualListeners) {
      element.removeEventListener('click', handler);
    }
    this.individualListeners.clear();
  }
}
```

---

### 💬 Explain to Junior: Event Delegation

**Simple Analogy:**

Imagine a classroom with 30 students. Instead of giving each student a phone to call you when they have a question (30 phones = expensive!), you hire one teaching assistant who listens for all questions and routes them to you (1 person = efficient!).

Event delegation works the same way:
- **Without delegation**: 30 buttons = 30 event listeners (expensive)
- **With delegation**: 1 parent element = 1 event listener handles all 30 buttons (efficient)

**Visual Diagram:**

```
WITHOUT DELEGATION:              WITH DELEGATION:
===================              ================

<ul> (no listener)               <ul> ← ONE listener here!
  <li> ← listener 1                <li> (no listener)
  <li> ← listener 2                <li> (no listener)
  <li> ← listener 3                <li> (no listener)
  ...                              ...
  <li> ← listener 100              <li> (no listener)

100 listeners = slow!            1 listener = fast!
```

**Interview Answer Template:**

> "Event delegation is a pattern where instead of attaching event listeners to many child elements, you attach a single listener to their parent. It works because of event bubbling—when you click a child element, the event bubbles up to the parent.
>
> For example, if you have a list with 100 items, instead of adding 100 click listeners (one per item), you add one listener to the `<ul>` parent. When any `<li>` is clicked, the event bubbles up to the `<ul>`, and you can check `event.target` to see which specific `<li>` was clicked.
>
> The main advantages are:
> 1. **Memory efficiency**: 1 listener instead of 100
> 2. **Works with dynamic content**: If you add new items later, they automatically work
> 3. **Faster setup**: Less time spent attaching listeners
>
> I've used this pattern extensively in data tables and dynamic lists. For instance, in a todo app with hundreds of items, using delegation reduced memory usage by 90% and made the page load much faster."

**Common Patterns:**

```javascript
// Pattern 1: Basic delegation with matches()
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    console.log('Item clicked:', e.target.textContent);
  }
});

// Pattern 2: Delegation with closest() (handles clicks on child elements)
container.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item) {
    console.log('Item clicked:', item.textContent);
  }
});

// Pattern 3: Multiple action types
container.addEventListener('click', (e) => {
  const target = e.target;

  if (target.matches('.delete')) {
    deleteItem(target.closest('.item'));
  } else if (target.matches('.edit')) {
    editItem(target.closest('.item'));
  } else if (target.matches('.complete')) {
    completeItem(target.closest('.item'));
  }
});

// Pattern 4: Getting data from clicked element
container.addEventListener('click', (e) => {
  const item = e.target.closest('[data-id]');
  if (item) {
    const id = item.dataset.id;
    handleItemClick(id);
  }
});
```

**Common Mistakes:**

```javascript
// ❌ Mistake 1: Forgetting to check if target matches
container.addEventListener('click', (e) => {
  // This fires for ALL clicks in container, even whitespace!
  deleteItem(e.target);
});

// ✅ Correct: Always check before acting
container.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    deleteItem(e.target);
  }
});

// ❌ Mistake 2: Not handling clicks on child elements
button.innerHTML = '<span class="icon">×</span> Delete';
container.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    // Won't work if user clicks the <span> icon!
    deleteItem(e.target);
  }
});

// ✅ Correct: Use closest() to find button even if clicking child
container.addEventListener('click', (e) => {
  const button = e.target.closest('.delete-btn');
  if (button) {
    deleteItem(button);
  }
});

// ❌ Mistake 3: Forgetting event delegation doesn't work for all events
container.addEventListener('focus', (e) => {
  // Problem: focus doesn't bubble!
  console.log('This might not fire as expected');
});

// ✅ Correct: Use capture phase or focusin (bubbles)
container.addEventListener('focusin', (e) => {
  // focusin bubbles, unlike focus
  console.log('This works!');
});
```

**Quick Reference:**

```javascript
// Check if element matches selector
element.matches('.class-name')        // true/false

// Find closest parent matching selector
element.closest('.parent-class')      // element or null

// Get data from element
element.dataset.id                    // Access data-id attribute
element.getAttribute('data-action')   // Access any attribute

// Multiple selectors
element.matches('.btn, .link')        // Matches either class

// Events that bubble (work with delegation)
// click, mousedown, mouseup, mousemove, keydown, keyup, submit, change

// Events that DON'T bubble (need special handling)
// focus, blur, load, unload, scroll
// Use focusin/focusout (bubble) instead of focus/blur
```

---

## Question 3: What's the difference between preventDefault() and stopPropagation()?

**Answer:**

`preventDefault()` and `stopPropagation()` are two different methods that control different aspects of event behavior:

**preventDefault():**
- Prevents the browser's default action for an event
- Does NOT stop event propagation
- Example: Prevents form submission, link navigation, context menu

**stopPropagation():**
- Stops the event from bubbling/capturing further
- Does NOT prevent default browser behavior
- Example: Prevents parent handlers from firing

```javascript
// preventDefault() - Stop default action
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevents form submission
  // Event still bubbles to parent elements
  console.log('Form not submitted, but event bubbles');
});

// stopPropagation() - Stop event propagation
const link = document.querySelector('a');
link.addEventListener('click', (e) => {
  e.stopPropagation(); // Stops bubbling
  // But link still navigates (default action)
  console.log('Link navigates, but parent handlers don\'t fire');
});

// Both together
link.addEventListener('click', (e) => {
  e.preventDefault();     // Don't navigate
  e.stopPropagation();    // Don't bubble
  // Complete control over event
});
```

**Real-World Examples:**

```javascript
// Example 1: Custom form validation
class FormValidator {
  constructor(form) {
    this.form = form;
    this.form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent default submission

      if (this.validate()) {
        // Submit via AJAX instead
        this.submitAjax();
      }
      // Event still bubbles for analytics tracking
    });
  }

  validate() {
    const inputs = this.form.querySelectorAll('input[required]');
    return Array.from(inputs).every(input => input.value.trim() !== '');
  }

  submitAjax() {
    const formData = new FormData(this.form);
    fetch('/api/submit', {
      method: 'POST',
      body: formData
    });
  }
}

// Example 2: Dropdown menu that shouldn't close parent
class Dropdown {
  constructor(element) {
    this.element = element;
    this.button = element.querySelector('.dropdown-button');
    this.menu = element.querySelector('.dropdown-menu');

    this.button.addEventListener('click', (e) => {
      e.stopPropagation(); // Don't trigger document click handler
      this.toggle();
    });

    this.menu.addEventListener('click', (e) => {
      e.stopPropagation(); // Clicking menu items doesn't close dropdown
    });

    // Close on outside click
    document.addEventListener('click', () => {
      this.close();
    });
  }

  toggle() {
    this.menu.classList.toggle('open');
  }

  close() {
    this.menu.classList.remove('open');
  }
}

// Example 3: Custom right-click menu
class ContextMenu {
  constructor() {
    this.menu = document.getElementById('context-menu');

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // Prevent browser context menu
      this.show(e.pageX, e.pageY);
    });

    document.addEventListener('click', () => {
      this.hide(); // Hide on any click
    });

    this.menu.addEventListener('click', (e) => {
      e.stopPropagation(); // Menu clicks don't trigger document click
    });
  }

  show(x, y) {
    this.menu.style.left = x + 'px';
    this.menu.style.top = y + 'px';
    this.menu.classList.add('visible');
  }

  hide() {
    this.menu.classList.remove('visible');
  }
}
```

**stopImmediatePropagation():**

```javascript
// stopImmediatePropagation() - Stops ALL handlers, even on same element
const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  console.log('Handler 1');
  e.stopImmediatePropagation(); // Stops everything after this
});

button.addEventListener('click', (e) => {
  console.log('Handler 2'); // Never executes
});

document.body.addEventListener('click', (e) => {
  console.log('Parent handler'); // Never executes
});

// Click output: "Handler 1" only
```

**Comparison Table:**

| Method | Stops Propagation | Prevents Default | Stops Other Handlers on Same Element |
|--------|-------------------|------------------|--------------------------------------|
| `preventDefault()` | ❌ No | ✅ Yes | ❌ No |
| `stopPropagation()` | ✅ Yes | ❌ No | ❌ No |
| `stopImmediatePropagation()` | ✅ Yes | ❌ No | ✅ Yes |
| Both `preventDefault()` + `stopPropagation()` | ✅ Yes | ✅ Yes | ❌ No |

---

### 🔍 Deep Dive: Browser Event Cancellation Mechanism

**How preventDefault() Works Internally:**

```javascript
// Browser's internal event implementation
class BrowserEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.defaultPrevented = false;
    this.cancelable = options.cancelable !== false;
    this.bubbles = options.bubbles !== false;
    this.propagationStopped = false;
    this.immediatePropagationStopped = false;
  }

  preventDefault() {
    if (this.cancelable) {
      this.defaultPrevented = true;
    } else {
      console.warn(`Event '${this.type}' is not cancelable`);
    }
  }

  stopPropagation() {
    this.propagationStopped = true;
  }

  stopImmediatePropagation() {
    this.propagationStopped = true;
    this.immediatePropagationStopped = true;
  }

  // Check if default can be prevented
  get cancelable() {
    return this._cancelable;
  }
}

// Browser checks defaultPrevented before executing default action
class BrowserEventDispatcher {
  dispatchClickEvent(element) {
    const event = new BrowserEvent('click', { cancelable: true });

    // Execute all handlers
    this.executeHandlers(element, event);

    // Check if default action should execute
    if (!event.defaultPrevented) {
      this.executeDefaultAction(element, event);
    }
  }

  executeDefaultAction(element, event) {
    if (element.tagName === 'A') {
      // Navigate to href
      window.location.href = element.href;
    } else if (element.tagName === 'FORM' && event.type === 'submit') {
      // Submit form
      element.submit();
    }
    // ... other default actions
  }
}
```

**Cancelable vs Non-Cancelable Events:**

```javascript
class EventCancelability {
  static checkCancelable(eventType) {
    const cancelableEvents = [
      'click', 'mousedown', 'keydown', 'submit',
      'contextmenu', 'wheel', 'touchstart', 'dragstart'
    ];

    const nonCancelableEvents = [
      'load', 'unload', 'abort', 'error',
      'focus', 'blur', 'resize', 'scroll' // These can't be prevented
    ];

    return {
      cancelable: cancelableEvents.includes(eventType),
      nonCancelable: nonCancelableEvents.includes(eventType)
    };
  }

  static testCancelability() {
    // Try preventing non-cancelable event
    window.addEventListener('load', (e) => {
      e.preventDefault(); // Does nothing!
      console.log('Default prevented:', e.defaultPrevented); // false
      console.log('Cancelable:', e.cancelable); // false
    });

    // Prevent cancelable event
    document.addEventListener('click', (e) => {
      e.preventDefault(); // Works!
      console.log('Default prevented:', e.defaultPrevented); // true
      console.log('Cancelable:', e.cancelable); // true
    });
  }
}
```

**Propagation Flow with stopPropagation:**

```javascript
class PropagationFlowVisualizer {
  static demonstrateFlow() {
    const structure = `
      <div id="grandparent">
        <div id="parent">
          <button id="child">Click Me</button>
        </div>
      </div>
    `;

    const logs = [];

    // Setup listeners
    grandparent.addEventListener('click', (e) => {
      logs.push('Grandparent - Capture');
    }, true);

    parent.addEventListener('click', (e) => {
      logs.push('Parent - Capture');
      // e.stopPropagation(); // Uncomment to see effect
    }, true);

    child.addEventListener('click', (e) => {
      logs.push('Child - Target');
      e.stopPropagation(); // Stop here
    });

    parent.addEventListener('click', (e) => {
      logs.push('Parent - Bubble'); // Never reaches here
    });

    grandparent.addEventListener('click', (e) => {
      logs.push('Grandparent - Bubble'); // Never reaches here
    });

    // Click child
    child.click();

    console.log(logs);
    // ['Grandparent - Capture', 'Parent - Capture', 'Child - Target']
    // Bubble phase never executes
  }
}
```

**Performance Impact of Propagation Stopping:**

```javascript
class PropagationPerformance {
  static benchmark() {
    const container = document.createElement('div');

    // Create deep nesting
    let current = container;
    for (let i = 0; i < 100; i++) {
      const div = document.createElement('div');
      current.appendChild(div);
      current = div;
    }
    const deepButton = current;

    // Test 1: Full propagation (no stopPropagation)
    let handlerCount = 0;
    current = container;
    while (current) {
      current.addEventListener('click', () => handlerCount++);
      current = current.firstChild;
    }

    const start1 = performance.now();
    for (let i = 0; i < 1000; i++) {
      handlerCount = 0;
      deepButton.click();
    }
    const fullPropTime = performance.now() - start1;
    console.log('Full propagation:', fullPropTime, 'ms');
    console.log('Handlers executed per click:', handlerCount / 1000);

    // Test 2: Stop propagation at target
    container.innerHTML = '';
    current = container;
    for (let i = 0; i < 100; i++) {
      const div = document.createElement('div');
      current.appendChild(div);
      current = div;
    }
    const deepButton2 = current;

    handlerCount = 0;
    current = container;
    while (current) {
      if (current === deepButton2) {
        current.addEventListener('click', (e) => {
          handlerCount++;
          e.stopPropagation();
        });
      } else {
        current.addEventListener('click', () => handlerCount++);
      }
      current = current.firstChild;
    }

    const start2 = performance.now();
    for (let i = 0; i < 1000; i++) {
      handlerCount = 0;
      deepButton2.click();
    }
    const stoppedPropTime = performance.now() - start2;
    console.log('Stopped propagation:', stoppedPropTime, 'ms');
    console.log('Handlers executed per click:', handlerCount / 1000);

    return {
      fullPropagation: fullPropTime,
      stoppedPropagation: stoppedPropTime,
      speedup: ((fullPropTime / stoppedPropTime - 1) * 100).toFixed(1) + '%'
    };
    // Typical: 40-60% faster with stopped propagation
  }
}
```

---

### 🐛 Real-World Scenario: Modal Form with Nested Click Handlers

**The Problem:**

An e-commerce checkout modal had a bug where clicking form fields would close the modal. The issue stemmed from improper use of stopPropagation and preventDefault.

**Initial Metrics:**
- Cart abandonment rate: 34% (industry average: 18%)
- User complaints: 156 in one week
- Mobile completion rate: 23% (desktop: 67%)
- Support tickets: "Form keeps closing when I try to fill it"

**Buggy Implementation:**

```javascript
// ❌ WRONG: Misused stopPropagation and preventDefault
class BuggyCheckoutModal {
  constructor() {
    this.modal = document.getElementById('checkout-modal');
    this.form = this.modal.querySelector('form');
    this.overlay = document.querySelector('.modal-overlay');

    this.init();
  }

  init() {
    // Close modal on overlay click
    this.overlay.addEventListener('click', (e) => {
      e.preventDefault(); // BUG: Prevents link clicks in modal!
      this.close();
    });

    // Handle form submission
    this.form.addEventListener('submit', (e) => {
      e.stopPropagation(); // BUG: Stops event, but doesn't prevent submission
      // Form still submits because preventDefault() not called!
      this.processPayment();
    });

    // Close button
    this.modal.querySelector('.close-btn').addEventListener('click', (e) => {
      // BUG: No stopPropagation - triggers overlay click handler too!
      this.close();
    });

    // Form field focus
    this.form.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', (e) => {
        e.stopPropagation(); // Useless - focus doesn't bubble
      });
    });
  }

  close() {
    this.modal.style.display = 'none';
  }

  processPayment() {
    console.log('Processing payment...');
  }
}

// What goes wrong:
// 1. Clicking "Terms of Service" link in modal doesn't work (preventDefault on overlay)
// 2. Form submits page reload (missing preventDefault)
// 3. Close button closes modal twice (no stopPropagation, triggers both handlers)
// 4. stopPropagation on focus does nothing (focus doesn't bubble)
```

**Debugging Process:**

```javascript
class EventDebugger {
  static trackEventFlow(selector) {
    const element = document.querySelector(selector);
    const originalPreventDefault = Event.prototype.preventDefault;
    const originalStopPropagation = Event.prototype.stopPropagation;

    Event.prototype.preventDefault = function() {
      console.log('preventDefault called:', {
        type: this.type,
        target: this.target,
        cancelable: this.cancelable,
        stackTrace: new Error().stack
      });
      originalPreventDefault.call(this);
    };

    Event.prototype.stopPropagation = function() {
      console.log('stopPropagation called:', {
        type: this.type,
        target: this.target,
        bubbles: this.bubbles,
        stackTrace: new Error().stack
      });
      originalStopPropagation.call(this);
    };
  }

  static logEventPhases(root) {
    const phases = { capture: [], bubble: [] };

    function addLogger(el, phase) {
      el.addEventListener('click', (e) => {
        phases[phase].push({
          element: el.tagName + (el.className ? '.' + el.className : ''),
          defaultPrevented: e.defaultPrevented,
          propagationStopped: e.cancelBubble,
          timestamp: performance.now()
        });
      }, phase === 'capture');
    }

    let current = root;
    while (current) {
      addLogger(current, 'capture');
      addLogger(current, 'bubble');
      current = current.parentElement;
    }

    return phases;
  }
}

// Debug output revealed:
// 1. preventDefault() called on overlay, preventing ALL child link clicks
// 2. stopPropagation() called on form submit (useless without preventDefault)
// 3. Close button click event reached overlay (caused double close attempt)
```

**Fixed Implementation:**

```javascript
// ✅ CORRECT: Proper use of both methods
class FixedCheckoutModal {
  constructor() {
    this.modal = document.getElementById('checkout-modal');
    this.form = this.modal.querySelector('form');
    this.overlay = document.querySelector('.modal-overlay');
    this.modalContent = this.modal.querySelector('.modal-content');

    this.init();
  }

  init() {
    // Close on overlay click, but not modal content
    this.overlay.addEventListener('click', (e) => {
      // Only close if clicking directly on overlay
      if (e.target === this.overlay) {
        this.close();
      }
      // No preventDefault - allow links to work
      // No stopPropagation - allow event delegation
    });

    // Alternative: Stop propagation from modal content
    this.modalContent.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent overlay click handler
      // No preventDefault - allow buttons, links, etc.
    });

    // Handle form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent page reload
      // No stopPropagation needed - we want analytics to track this
      this.processPayment();
    });

    // Close button
    this.modal.querySelector('.close-btn').addEventListener('click', (e) => {
      e.stopPropagation(); // Don't trigger overlay handler
      // No preventDefault needed - button has no default action
      this.close();
    });

    // Terms link should work normally
    const termsLink = this.modal.querySelector('.terms-link');
    termsLink.addEventListener('click', (e) => {
      // Let default action happen (open link)
      // Event still bubbles for analytics
    });

    // Keyboard: Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        // No preventDefault - allow other Escape handlers
        // No stopPropagation - allow global keyboard shortcuts
        this.close();
      }
    });
  }

  isOpen() {
    return this.modal.style.display !== 'none';
  }

  close() {
    this.modal.style.display = 'none';
  }

  processPayment() {
    const formData = new FormData(this.form);

    fetch('/api/checkout', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.showSuccess();
      }
    });
  }

  showSuccess() {
    alert('Payment successful!');
    this.close();
  }
}
```

**Testing Strategy:**

```javascript
class ModalEventTester {
  static runTests() {
    const modal = new FixedCheckoutModal();
    const tests = [];

    // Test 1: Click overlay directly
    tests.push({
      name: 'Overlay click closes modal',
      run: () => {
        modal.open();
        document.querySelector('.modal-overlay').click();
        return modal.isOpen() === false;
      }
    });

    // Test 2: Click inside modal content
    tests.push({
      name: 'Content click doesn\'t close modal',
      run: () => {
        modal.open();
        document.querySelector('.modal-content').click();
        return modal.isOpen() === true;
      }
    });

    // Test 3: Submit form
    tests.push({
      name: 'Form submit prevents reload',
      run: () => {
        let reloaded = false;
        const originalSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = () => { reloaded = true; };

        modal.form.dispatchEvent(new Event('submit'));

        HTMLFormElement.prototype.submit = originalSubmit;
        return !reloaded;
      }
    });

    // Test 4: Links work
    tests.push({
      name: 'Links inside modal work',
      run: () => {
        const link = document.querySelector('.modal .terms-link');
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        });

        link.dispatchEvent(event);
        return !event.defaultPrevented;
      }
    });

    // Test 5: Close button
    tests.push({
      name: 'Close button closes modal',
      run: () => {
        modal.open();
        document.querySelector('.close-btn').click();
        return modal.isOpen() === false;
      }
    });

    // Run all tests
    const results = tests.map(test => ({
      name: test.name,
      passed: test.run()
    }));

    console.table(results);
    return results.every(r => r.passed);
  }
}
```

**Metrics After Fix:**

```javascript
// Before fix:
// - Cart abandonment: 34%
// - User complaints: 156/week
// - Mobile completion: 23%
// - Form submission errors: 12%

// After fix:
// - Cart abandonment: 19% (↓ 44%)
// - User complaints: 8/week (↓ 95%)
// - Mobile completion: 64% (↑ 178%)
// - Form submission errors: 0.3% (↓ 97.5%)

// Revenue impact: +$47,000/month from reduced abandonment
```

---

### ⚖️ Trade-offs: When to Use Each Method

**preventDefault() Use Cases:**

| Scenario | Why preventDefault | Alternative |
|----------|-------------------|-------------|
| **Form validation** | Prevent submission until valid | Use `novalidate` + manual submit |
| **Custom link behavior** | Navigate programmatically (SPA) | Use `<button>` instead of `<a>` |
| **Right-click menus** | Show custom context menu | CSS-only limited alternative |
| **Drag and drop** | Prevent default drag behavior | No alternative |
| **Custom keyboard shortcuts** | Override browser shortcuts | Limited options |

**stopPropagation() Use Cases:**

| Scenario | Why stopPropagation | Alternative |
|----------|---------------------|-------------|
| **Modal click-outside** | Prevent document handler | Check `event.target` instead |
| **Nested click handlers** | Prevent parent handlers | Event delegation pattern |
| **Dropdown menus** | Keep menu open on interaction | Check `contains()` |
| **Complex nested widgets** | Isolate component events | Better component boundaries |

**Decision Matrix:**

```javascript
class EventMethodSelector {
  static selectMethod(scenario) {
    const strategies = {
      'form-submission': {
        method: 'preventDefault',
        reason: 'Prevent page reload, handle via AJAX',
        alternatives: ['novalidate attribute'],
        confidence: 'high'
      },

      'link-navigation': {
        method: 'preventDefault',
        reason: 'Handle navigation programmatically (SPA)',
        alternatives: ['Use buttons for actions', 'History API'],
        confidence: 'high'
      },

      'modal-close-on-outside-click': {
        method: 'neither',
        reason: 'Check event.target instead',
        alternatives: ['if (e.target === overlay) close()'],
        confidence: 'high',
        avoid: 'stopPropagation - breaks delegation'
      },

      'dropdown-menu': {
        method: 'stopPropagation',
        reason: 'Prevent document click handler',
        alternatives: ['Check if contains(e.target)'],
        confidence: 'medium'
      },

      'nested-buttons': {
        method: 'stopPropagation',
        reason: 'Prevent parent button click',
        alternatives: ['Check event.target in parent'],
        confidence: 'medium'
      }
    };

    return strategies[scenario];
  }

  static shouldPreventDefault(event) {
    // Rules for when to prevent default
    const preventCases = [
      // Forms
      event.type === 'submit' && !event.target.hasAttribute('novalidate'),

      // Links in SPAs
      event.type === 'click' &&
      event.target.matches('a[href]') &&
      event.target.hasAttribute('data-spa-link'),

      // Context menus
      event.type === 'contextmenu',

      // Drag and drop
      event.type === 'dragover' || event.type === 'drop'
    ];

    return preventCases.some(condition => condition);
  }

  static shouldStopPropagation(event) {
    // Rules for when to stop propagation
    const stopCases = [
      // Modals/dropdowns with explicit stop attribute
      event.target.closest('[data-stop-propagation]'),

      // Nested interactive elements
      event.target.matches('button') &&
      event.target.closest('button') !== event.target
    ];

    return stopCases.some(condition => condition);
  }
}
```

**Anti-Patterns to Avoid:**

```javascript
// ❌ Anti-pattern 1: Always stopping propagation
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // Breaks event delegation!
    handleClick(btn);
  });
});

// ✅ Better: Only stop when necessary
document.body.addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    handleClick(e.target);
  }
});

// ❌ Anti-pattern 2: Preventing default on wrong events
document.addEventListener('click', (e) => {
  e.preventDefault(); // Breaks all clicks!
});

// ✅ Better: Prevent only specific elements
document.addEventListener('click', (e) => {
  if (e.target.matches('.custom-action')) {
    e.preventDefault();
    handleCustomAction(e.target);
  }
});

// ❌ Anti-pattern 3: Return false (jQuery-style)
element.onclick = function(e) {
  return false; // Does both preventDefault + stopPropagation (unclear!)
};

// ✅ Better: Be explicit
element.addEventListener('click', (e) => {
  e.preventDefault();     // Clear intent
  e.stopPropagation();    // Clear intent
});
```

---

### 💬 Explain to Junior: preventDefault vs stopPropagation

**Simple Analogy:**

Imagine you're watching a movie in a theater:

- **preventDefault()**: You prevent the projectionist from changing the film (stop the default action), but people can still whisper comments to each other (event still propagates)

- **stopPropagation()**: You tell people to stop whispering to others (stop propagation), but the movie still plays (default action still happens)

**Visual Diagram:**

```
preventDefault():
==================
User clicks link
     ↓
Event bubbles normally: child → parent → document
     ↓
Browser SKIPS default action (navigation) ✗


stopPropagation():
==================
User clicks link
     ↓
Event STOPS at current element (no further bubbling) ✗
     ↓
Browser executes default action (navigation) ✓
```

**Interview Answer Template:**

> "`preventDefault()` and `stopPropagation()` control different aspects of events:
>
> **preventDefault()** stops the browser's default action. For example:
> - On a form submit event, it prevents the form from submitting
> - On a link click, it prevents navigation
> - On a right-click, it prevents the context menu
>
> But the event still bubbles up to parent elements.
>
> **stopPropagation()** stops the event from bubbling up (or capturing down) to other elements. Parent handlers won't fire. But it doesn't prevent the browser's default action.
>
> A common use case: in a modal, I'll use `stopPropagation()` on the modal content to prevent clicks from reaching the overlay's click-outside handler, while allowing buttons and links to work normally. For forms, I use `preventDefault()` to stop the page reload and handle submission via AJAX instead.
>
> There's also `stopImmediatePropagation()` which is like `stopPropagation()` but also prevents other handlers on the same element from running."

**Quick Reference:**

```javascript
// Prevent form submission (but event still bubbles)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitViaAjax();
});

// Stop event from reaching parent (but link still navigates)
link.addEventListener('click', (e) => {
  e.stopPropagation();
  // Link still navigates!
});

// Do both: prevent navigation AND stop bubbling
link.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  customNavigation();
});

// Stop immediately (prevents other handlers on same element too)
button.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  // No other click handlers on this button will run
});

// Check if already prevented/stopped
element.addEventListener('click', (e) => {
  if (e.defaultPrevented) {
    console.log('Someone already prevented default');
  }

  if (e.cancelBubble) {
    console.log('Propagation was stopped');
  }
});
```

**Common Gotchas:**

```javascript
// 1. preventDefault() only works on cancelable events
window.addEventListener('scroll', (e) => {
  e.preventDefault(); // Does nothing! Scroll isn't cancelable
  console.log(e.cancelable); // false
});

// 2. stopPropagation() doesn't prevent default
link.addEventListener('click', (e) => {
  e.stopPropagation();
  // Link STILL navigates - need preventDefault() too!
});

// 3. Return false in inline handlers
<button onclick="return false"> // Prevents default only
<button onclick="event.stopPropagation(); return false;"> // Does both

// 4. Passive listeners can't preventDefault()
element.addEventListener('touchstart', (e) => {
  e.preventDefault(); // ERROR if listener is passive
}, { passive: true });
```

---

## Question 4: How do you create and dispatch custom events using the CustomEvent API?

**Answer:**

The CustomEvent API allows you to create and dispatch custom events with custom data, enabling communication between different parts of your application without tight coupling.

**Basic Usage:**

```javascript
// Create custom event
const event = new CustomEvent('userLogin', {
  detail: {
    username: 'john_doe',
    timestamp: Date.now(),
    role: 'admin'
  },
  bubbles: true,
  cancelable: true
});

// Dispatch event
document.dispatchEvent(event);

// Listen for custom event
document.addEventListener('userLogin', (e) => {
  console.log('User logged in:', e.detail.username);
  console.log('Role:', e.detail.role);
});
```

**CustomEvent vs Event:**

```javascript
// Event (basic, no custom data)
const basicEvent = new Event('customAction', {
  bubbles: true,
  cancelable: true
});

// CustomEvent (with custom data in detail property)
const customEvent = new CustomEvent('customAction', {
  detail: { message: 'Hello', count: 42 },
  bubbles: true,
  cancelable: true
});

// Listen and access data
element.addEventListener('customAction', (e) => {
  console.log(e.detail); // { message: 'Hello', count: 42 }
});
```

**Real-World Example: Component Communication:**

```javascript
// Component 1: Shopping Cart
class ShoppingCart {
  constructor() {
    this.items = [];
    this.element = document.getElementById('cart');
  }

  addItem(product) {
    this.items.push(product);
    this.update();

    // Dispatch custom event
    const event = new CustomEvent('cart:item-added', {
      detail: {
        product,
        totalItems: this.items.length,
        totalPrice: this.calculateTotal()
      },
      bubbles: true
    });

    this.element.dispatchEvent(event);
  }

  removeItem(productId) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index > -1) {
      const removed = this.items.splice(index, 1)[0];

      const event = new CustomEvent('cart:item-removed', {
        detail: {
          product: removed,
          totalItems: this.items.length,
          totalPrice: this.calculateTotal()
        },
        bubbles: true
      });

      this.element.dispatchEvent(event);
    }
  }

  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  update() {
    this.element.textContent = `Cart (${this.items.length})`;
  }
}

// Component 2: Cart Badge
class CartBadge {
  constructor() {
    this.badge = document.getElementById('cart-badge');

    // Listen for cart events
    document.addEventListener('cart:item-added', (e) => {
      this.updateBadge(e.detail.totalItems);
      this.showAnimation('added');
    });

    document.addEventListener('cart:item-removed', (e) => {
      this.updateBadge(e.detail.totalItems);
      this.showAnimation('removed');
    });
  }

  updateBadge(count) {
    this.badge.textContent = count;
    this.badge.style.display = count > 0 ? 'block' : 'none';
  }

  showAnimation(type) {
    this.badge.classList.add(`animate-${type}`);
    setTimeout(() => {
      this.badge.classList.remove(`animate-${type}`);
    }, 300);
  }
}

// Component 3: Analytics
class Analytics {
  constructor() {
    document.addEventListener('cart:item-added', (e) => {
      this.track('add_to_cart', {
        product_id: e.detail.product.id,
        product_name: e.detail.product.name,
        price: e.detail.product.price,
        cart_total: e.detail.totalPrice
      });
    });

    document.addEventListener('cart:item-removed', (e) => {
      this.track('remove_from_cart', {
        product_id: e.detail.product.id
      });
    });
  }

  track(eventName, data) {
    console.log(`[Analytics] ${eventName}`, data);
    // Send to analytics service
  }
}

// Initialize components (no direct coupling!)
const cart = new ShoppingCart();
const badge = new CartBadge();
const analytics = new Analytics();

// Add item - automatically updates badge and tracks analytics
cart.addItem({ id: 1, name: 'Laptop', price: 999 });
```

**Advanced Pattern: Event Bus:**

```javascript
class EventBus {
  constructor() {
    this.bus = document.createElement('div');
  }

  on(event, callback) {
    this.bus.addEventListener(event, callback);
  }

  off(event, callback) {
    this.bus.removeEventListener(event, callback);
  }

  emit(event, detail = {}) {
    const customEvent = new CustomEvent(event, { detail });
    this.bus.dispatchEvent(customEvent);
  }

  once(event, callback) {
    const onceCallback = (e) => {
      callback(e);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
}

// Usage
const eventBus = new EventBus();

// Module A
eventBus.on('user:login', (e) => {
  console.log('User logged in:', e.detail.user);
});

// Module B
eventBus.emit('user:login', {
  user: { id: 1, name: 'John' }
});

// One-time listener
eventBus.once('app:ready', () => {
  console.log('App initialized');
});
```

---

### 🔍 Deep Dive: Custom Event Implementation Details

**Browser Implementation of CustomEvent:**

```javascript
// Simplified browser implementation
class CustomEventPolyfill {
  constructor(type, options = {}) {
    // Create base event
    const event = document.createEvent('CustomEvent');

    // Initialize with type and options
    event.initCustomEvent(
      type,
      options.bubbles || false,
      options.cancelable || false,
      options.detail || null
    );

    return event;
  }
}

// Modern browser native implementation (conceptual)
class BrowserCustomEvent extends Event {
  constructor(type, options = {}) {
    super(type, {
      bubbles: options.bubbles,
      cancelable: options.cancelable,
      composed: options.composed
    });

    // Store custom data
    this._detail = options.detail !== undefined ? options.detail : null;

    // Make detail read-only
    Object.defineProperty(this, 'detail', {
      get: () => this._detail,
      enumerable: true
    });
  }
}
```

**Memory and Performance Characteristics:**

```javascript
class CustomEventPerformance {
  static benchmarkEventCreation(iterations = 10000) {
    const results = {
      basicEvent: 0,
      customEvent: 0,
      customEventWithLargePayload: 0
    };

    // Test 1: Basic Event
    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
      new Event('test');
    }
    results.basicEvent = performance.now() - start;

    // Test 2: CustomEvent with small payload
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      new CustomEvent('test', {
        detail: { id: i, value: 'test' }
      });
    }
    results.customEvent = performance.now() - start;

    // Test 3: CustomEvent with large payload
    start = performance.now();
    const largePayload = new Array(1000).fill({ data: 'test' });
    for (let i = 0; i < iterations; i++) {
      new CustomEvent('test', {
        detail: { items: largePayload }
      });
    }
    results.customEventWithLargePayload = performance.now() - start;

    return results;
    // Typical results (10k iterations):
    // basicEvent: 8ms
    // customEvent: 12ms (50% slower, but still fast)
    // customEventWithLargePayload: 15ms (payload is referenced, not copied)
  }

  static benchmarkEventDispatch(iterations = 10000) {
    const element = document.createElement('div');
    const results = {};

    // No listeners
    const event1 = new CustomEvent('test1');
    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
      element.dispatchEvent(event1);
    }
    results.noListeners = performance.now() - start;

    // One listener
    element.addEventListener('test2', () => {});
    const event2 = new CustomEvent('test2');
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      element.dispatchEvent(event2);
    }
    results.oneListener = performance.now() - start;

    // Ten listeners
    for (let i = 0; i < 10; i++) {
      element.addEventListener('test3', () => {});
    }
    const event3 = new CustomEvent('test3');
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
      element.dispatchEvent(event3);
    }
    results.tenListeners = performance.now() - start;

    return results;
    // Typical results (10k iterations):
    // noListeners: 12ms
    // oneListener: 18ms
    // tenListeners: 45ms (scales linearly with listeners)
  }
}
```

**Event Detail Deep Copying:**

```javascript
class EventDetailBehavior {
  static demonstrateDetailReference() {
    const data = { count: 0, items: [] };

    const event = new CustomEvent('test', { detail: data });

    // Detail is a REFERENCE, not a copy
    console.log(event.detail.count); // 0

    // Mutating original object affects event detail
    data.count = 10;
    console.log(event.detail.count); // 10 (!)

    // This can cause bugs if not careful
  }

  static safeEventCreation(data) {
    // Deep clone to prevent mutations
    return new CustomEvent('test', {
      detail: JSON.parse(JSON.stringify(data))
    });

    // Or use structured clone (modern browsers)
    return new CustomEvent('test', {
      detail: structuredClone(data)
    });
  }
}
```

**Event Bubbling Through Shadow DOM:**

```javascript
class ShadowDOMEvents {
  static demonstrateComposedEvents() {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });

    const button = document.createElement('button');
    shadow.appendChild(button);
    document.body.appendChild(host);

    // Listen outside shadow boundary
    document.addEventListener('custom-event', (e) => {
      console.log('Event reached document');
      console.log('Event target:', e.target); // Retargeted to host
    });

    // Non-composed event (default)
    const nonComposedEvent = new CustomEvent('custom-event', {
      bubbles: true,
      composed: false // Doesn't cross shadow boundary
    });
    button.dispatchEvent(nonComposedEvent);
    // Output: (nothing - event stops at shadow boundary)

    // Composed event
    const composedEvent = new CustomEvent('custom-event', {
      bubbles: true,
      composed: true // Crosses shadow boundary
    });
    button.dispatchEvent(composedEvent);
    // Output: "Event reached document", "Event target: <div>"
  }
}
```

---

### 🐛 Real-World Scenario: Race Conditions in Custom Event System

**The Problem:**

A multi-tab dashboard application used custom events for widget communication, but race conditions caused data inconsistencies and duplicate API calls.

**Initial Metrics:**
- Duplicate API calls: 34% of requests
- Stale data shown: 18% of widget updates
- User confusion: "Why are numbers different in different widgets?"
- Server load: 2.3x expected
- Support tickets: 89 in one week

**Buggy Implementation:**

```javascript
// ❌ WRONG: Race conditions and event timing issues
class BuggyDataManager {
  constructor() {
    this.data = null;
    this.loading = false;

    // Listen for data requests
    document.addEventListener('data:fetch', (e) => {
      this.fetchData(e.detail.endpoint);
    });
  }

  async fetchData(endpoint) {
    // BUG: No check if already loading
    this.loading = true;

    const response = await fetch(endpoint);
    const data = await response.json();

    this.data = data;
    this.loading = false;

    // BUG: Event dispatched before state fully updated
    document.dispatchEvent(new CustomEvent('data:loaded', {
      detail: { data }
    }));
  }
}

class BuggyWidget {
  constructor(id) {
    this.id = id;

    // BUG: No unsubscribe mechanism
    document.addEventListener('data:loaded', (e) => {
      // BUG: All widgets respond to all data loads
      this.render(e.detail.data);
    });
  }

  loadData() {
    // BUG: Multiple widgets trigger multiple fetches
    document.dispatchEvent(new CustomEvent('data:fetch', {
      detail: { endpoint: '/api/data' }
    }));
  }

  render(data) {
    console.log(`Widget ${this.id} rendering:`, data);
  }
}

// Create 3 widgets
const widget1 = new BuggyWidget(1);
const widget2 = new BuggyWidget(2);
const widget3 = new BuggyWidget(3);

// All widgets request data simultaneously
widget1.loadData();
widget2.loadData(); // Duplicate fetch!
widget3.loadData(); // Duplicate fetch!

// Problems:
// 1. Three simultaneous API calls for same data
// 2. All widgets respond to each other's data loads
// 3. Race conditions - last response wins, may show stale data
// 4. Memory leak - event listeners never removed
```

**Fixed Implementation:**

```javascript
// ✅ CORRECT: Proper event coordination and state management
class FixedDataManager {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.subscribers = new Map();

    document.addEventListener('data:request', (e) => {
      this.handleDataRequest(e);
    });
  }

  async handleDataRequest(event) {
    const { endpoint, requestId } = event.detail;

    // Check cache first
    if (this.cache.has(endpoint)) {
      this.dispatchDataLoaded(endpoint, this.cache.get(endpoint), requestId);
      return;
    }

    // Check if already fetching
    if (this.pendingRequests.has(endpoint)) {
      // Add to subscribers for this endpoint
      if (!this.subscribers.has(endpoint)) {
        this.subscribers.set(endpoint, []);
      }
      this.subscribers.get(endpoint).push(requestId);
      return;
    }

    // Start new fetch
    this.pendingRequests.set(endpoint, true);
    this.subscribers.set(endpoint, [requestId]);

    try {
      const response = await fetch(endpoint);
      const data = await response.json();

      // Cache the data
      this.cache.set(endpoint, data);

      // Notify all subscribers
      const subscribers = this.subscribers.get(endpoint) || [];
      subscribers.forEach(id => {
        this.dispatchDataLoaded(endpoint, data, id);
      });

    } catch (error) {
      // Notify subscribers of error
      const subscribers = this.subscribers.get(endpoint) || [];
      subscribers.forEach(id => {
        this.dispatchDataError(endpoint, error, id);
      });
    } finally {
      // Clean up
      this.pendingRequests.delete(endpoint);
      this.subscribers.delete(endpoint);
    }
  }

  dispatchDataLoaded(endpoint, data, requestId) {
    // Use microtask to ensure state consistency
    queueMicrotask(() => {
      document.dispatchEvent(new CustomEvent('data:loaded', {
        detail: {
          endpoint,
          data: structuredClone(data), // Prevent mutations
          requestId,
          timestamp: Date.now()
        }
      }));
    });
  }

  dispatchDataError(endpoint, error, requestId) {
    document.dispatchEvent(new CustomEvent('data:error', {
      detail: { endpoint, error: error.message, requestId }
    }));
  }

  clearCache(endpoint) {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }
}

class FixedWidget {
  constructor(id, config) {
    this.id = id;
    this.config = config;
    this.requestId = null;
    this.destroyed = false;

    this.dataLoadedHandler = this.handleDataLoaded.bind(this);
    this.dataErrorHandler = this.handleDataError.bind(this);

    document.addEventListener('data:loaded', this.dataLoadedHandler);
    document.addEventListener('data:error', this.dataErrorHandler);
  }

  handleDataLoaded(event) {
    // Only process events meant for this widget
    if (event.detail.requestId !== this.requestId) {
      return;
    }

    if (this.destroyed) {
      return;
    }

    this.render(event.detail.data);
  }

  handleDataError(event) {
    if (event.detail.requestId !== this.requestId) {
      return;
    }

    console.error(`Widget ${this.id} error:`, event.detail.error);
    this.renderError(event.detail.error);
  }

  loadData() {
    // Generate unique request ID
    this.requestId = `widget-${this.id}-${Date.now()}`;

    document.dispatchEvent(new CustomEvent('data:request', {
      detail: {
        endpoint: this.config.endpoint,
        requestId: this.requestId
      },
      bubbles: true
    }));
  }

  render(data) {
    console.log(`Widget ${this.id} rendering (ID: ${this.requestId}):`, data);
  }

  renderError(error) {
    console.error(`Widget ${this.id} error:`, error);
  }

  destroy() {
    this.destroyed = true;
    document.removeEventListener('data:loaded', this.dataLoadedHandler);
    document.removeEventListener('data:error', this.dataErrorHandler);
  }
}

// Initialize
const dataManager = new FixedDataManager();

const widget1 = new FixedWidget(1, { endpoint: '/api/data' });
const widget2 = new FixedWidget(2, { endpoint: '/api/data' });
const widget3 = new FixedWidget(3, { endpoint: '/api/data' });

// All widgets request data - only ONE API call made!
widget1.loadData();
widget2.loadData();
widget3.loadData();

// Each widget only processes its own response
```

**Metrics After Fix:**

```javascript
// Before:
// - Duplicate API calls: 34%
// - Stale data: 18%
// - Server requests: 23,400/hour
// - Memory leaks: Yes (listeners never removed)
// - Response time: 450ms avg

// After:
// - Duplicate API calls: 0%
// - Stale data: 0%
// - Server requests: 6,800/hour (71% reduction!)
// - Memory leaks: None (proper cleanup)
// - Response time: 180ms avg (60% faster)

// Cost savings: $4,200/month in server costs
```

---

### ⚖️ Trade-offs: Custom Events vs Other Patterns

**Custom Events vs Direct Method Calls:**

| Aspect | Custom Events | Direct Calls | Winner |
|--------|---------------|--------------|--------|
| **Coupling** | Loose (pub/sub) | Tight (direct dependency) | Events |
| **Performance** | ~2-5ms overhead | Instant | Direct |
| **Testability** | Easy to mock | Harder to mock | Events |
| **Debugging** | Harder to trace | Easy to trace | Direct |
| **Async** | Natural async | Requires promises | Events |

**When to Use Custom Events:**

```javascript
// ✅ Good use case: Decoupled components
class GoodEventUse {
  // Multiple components need to react to one action
  handleUserAction() {
    document.dispatchEvent(new CustomEvent('user:action', {
      detail: { action: 'purchase' }
    }));
    // Analytics, UI updates, cache invalidation all happen independently
  }
}

// ❌ Bad use case: Simple parent-child communication
class BadEventUse {
  // Overkill for direct parent-child
  handleClick() {
    this.element.dispatchEvent(new CustomEvent('button:click'));
    // Just call a callback instead!
  }
}

// ✅ Better:
class BetterDirectCall {
  constructor(onClick) {
    this.onClick = onClick;
  }

  handleClick() {
    this.onClick(); // Simple and direct
  }
}
```

**Decision Matrix:**

```javascript
class CommunicationPatternSelector {
  static selectPattern(scenario) {
    const patterns = {
      'one-to-many-notification': {
        recommended: 'Custom Events',
        reason: 'Multiple listeners, loose coupling',
        alternative: 'Observer pattern',
        confidence: 'high'
      },

      'parent-child-simple': {
        recommended: 'Callbacks/Props',
        reason: 'Direct, simple, fast',
        alternative: 'Custom events (overkill)',
        confidence: 'high'
      },

      'cross-module-communication': {
        recommended: 'Event Bus or Custom Events',
        reason: 'Modules shouldn\'t know about each other',
        alternative: 'Dependency injection',
        confidence: 'high'
      },

      'state-management': {
        recommended: 'State management library',
        reason: 'Centralized state, time-travel debugging',
        alternative: 'Custom events (too fragmented)',
        confidence: 'high'
      },

      'plugin-system': {
        recommended: 'Custom Events',
        reason: 'Plugins shouldn\'t depend on host internals',
        alternative: 'Hook system',
        confidence: 'high'
      }
    };

    return patterns[scenario];
  }
}
```

---

### 💬 Explain to Junior: Custom Events

**Simple Analogy:**

Think of custom events like a messaging app for your code:

- **Direct method calls**: Like calling someone on the phone (you need their number, they must answer)
- **Custom events**: Like posting in a group chat (anyone interested can listen, sender doesn't need to know who's listening)

**Visual Diagram:**

```
DIRECT CALLS:                    CUSTOM EVENTS:
=============                    ==============

Component A                      Component A
    |                                |
    |--- calls --->                  |--- emits event --->
    |                                         |
Component B                              Event Bus
                                          /   |   \
                                         /    |    \
                                        B     C     D
                                    (all listening)

Tight coupling                    Loose coupling
```

**Interview Answer Template:**

> "Custom events let you create your own event types with custom data. They're perfect for component communication without tight coupling.
>
> You create them with `new CustomEvent('eventName', { detail: data })` where `detail` holds your custom data. Then dispatch with `element.dispatchEvent(event)`.
>
> For example, in an e-commerce app, when a user adds an item to the cart, I can dispatch a `cart:item-added` event. Then multiple components can listen for it:
> - Cart badge updates the count
> - Analytics tracks the event
> - Inventory system reserves the item
>
> None of these components need to know about each other. The cart just dispatches the event and anyone interested can listen.
>
> The main advantage is loose coupling - components communicate without direct dependencies, making code more maintainable and testable."

**Quick Reference:**

```javascript
// Create and dispatch
const event = new CustomEvent('my-event', {
  detail: { data: 'hello' },
  bubbles: true,
  cancelable: true
});
element.dispatchEvent(event);

// Listen
element.addEventListener('my-event', (e) => {
  console.log(e.detail); // { data: 'hello' }
});

// Event bus pattern
class EventBus {
  constructor() {
    this.bus = document.createElement('div');
  }
  on(event, callback) {
    this.bus.addEventListener(event, callback);
  }
  emit(event, detail) {
    this.bus.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

// Usage
const bus = new EventBus();
bus.on('user:login', (e) => console.log(e.detail.user));
bus.emit('user:login', { user: { name: 'John' } });
```

