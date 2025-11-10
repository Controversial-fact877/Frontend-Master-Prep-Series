# Performance Monitoring and Profiling

> Web Vitals, performance APIs, monitoring tools, and profiling techniques.

---

## Question 1: Core Web Vitals

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Google, Meta, Vercel

### Question
What are Core Web Vitals and how do you measure them?

### Answer

**Core Web Vitals** - Google's metrics for user experience.

**Three key metrics:**
1. **LCP (Largest Contentful Paint)** - Loading performance
   - Good: < 2.5s
   - Needs improvement: 2.5-4s
   - Poor: > 4s

2. **FID (First Input Delay)** - Interactivity
   - Good: < 100ms
   - Needs improvement: 100-300ms
   - Poor: > 300ms

3. **CLS (Cumulative Layout Shift)** - Visual stability
   - Good: < 0.1
   - Needs improvement: 0.1-0.25
   - Poor: > 0.25

```javascript
// Measuring with web-vitals library
import { onLCP, onFID, onCLS } from 'web-vitals';

onLCP(console.log);
onFID(console.log);
onCLS(console.log);

// Using Performance Observer API
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.renderTime || entry.loadTime);
  }
});
observer.observe({ type: 'largest-contentful-paint', buffered: true });

// Custom reporting
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  }
}

onCLS(sendToAnalytics);
```

### Resources
- [Web Vitals](https://web.dev/vitals/)
- [web-vitals Library](https://github.com/GoogleChrome/web-vitals)

---

## Question 2: Performance APIs

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 7 minutes
**Companies:** Google, Meta

### Question
How do you use the Performance API for monitoring?

### Answer

```javascript
// Navigation Timing API
const perfData = performance.getEntriesByType('navigation')[0];
console.log('DNS lookup:', perfData.domainLookupEnd - perfData.domainLookupStart);
console.log('TCP connection:', perfData.connectEnd - perfData.connectStart);
console.log('Time to first byte:', perfData.responseStart - perfData.requestStart);
console.log('DOM processing:', perfData.domComplete - perfData.domInteractive);

// Resource Timing API
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(`${resource.name}: ${resource.duration}ms`);
});

// User Timing API (custom marks)
performance.mark('start-render');
// ... rendering code
performance.mark('end-render');
performance.measure('render-time', 'start-render', 'end-render');

const measure = performance.getEntriesByName('render-time')[0];
console.log('Render took:', measure.duration, 'ms');

// Memory usage (Chrome only)
if (performance.memory) {
  console.log('Used JS heap:', performance.memory.usedJSHeapSize / 1048576, 'MB');
  console.log('Total JS heap:', performance.memory.totalJSHeapSize / 1048576, 'MB');
}
```

### Resources
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)

---

## Question 3: React Profiler

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 7 minutes
**Companies:** Meta, Vercel

### Question
How do you profile React applications?

### Answer

**React DevTools Profiler:**

1. Open React DevTools → Profiler tab
2. Click record, interact with app, stop recording
3. Analyze:
   - Flame graph (component render times)
   - Ranked chart (slowest components)
   - Component chart (why component rendered)

**Programmatic profiling:**

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id, // component id
  phase, // "mount" or "update"
  actualDuration, // time to render
  baseDuration, // estimated time without memoization
  startTime,
  commitTime,
  interactions
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

**Chrome DevTools Performance:**
- Record → Interact → Stop
- Analyze: Main thread activity, JS execution, rendering

### Resources
- [React Profiler](https://react.dev/reference/react/Profiler)

---
