# Performance Optimization Techniques

> **Master web performance - Core Web Vitals, rendering optimization, bundle size reduction, and caching strategies**

---

## Question 1: What are Core Web Vitals and how do you optimize them?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Netflix, Airbnb

### Question
Explain Core Web Vitals. What are LCP, FID, and CLS? How do you measure and optimize each?

### Answer

Core Web Vitals are Google's key metrics for measuring user experience on the web.

1. **The Three Metrics**
   - **LCP (Largest Contentful Paint)** - Loading performance (should be < 2.5s)
   - **FID (First Input Delay)** - Interactivity (should be < 100ms)
   - **CLS (Cumulative Layout Shift)** - Visual stability (should be < 0.1)

2. **LCP Optimization**
   - Optimize server response time
   - Preload critical resources
   - Optimize images (WebP, lazy loading)
   - Remove render-blocking JavaScript/CSS
   - Use CDN for static assets

3. **FID Optimization**
   - Minimize JavaScript execution time
   - Code splitting and lazy loading
   - Use Web Workers for heavy tasks
   - Defer non-critical JavaScript
   - Reduce main thread work

4. **CLS Optimization**
   - Reserve space for images/ads (width/height attributes)
   - Avoid inserting content above existing content
   - Use CSS transform for animations
   - Preload fonts with font-display: swap
   - Avoid dynamic content injection

### Code Example

```javascript
// LCP OPTIMIZATION

// 1. Preload critical resources
<link rel="preload" href="/hero-image.jpg" as="image">
<link rel="preload" href="/critical-font.woff2" as="font" crossorigin>

// 2. Optimize images
<img
  src="hero.jpg"
  alt="Hero"
  width="1200"
  height="600"  // Prevents CLS
  loading="lazy"  // Lazy load below fold
  decoding="async"  // Non-blocking
/>

// 3. Modern image formats
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero">
</picture>

// 4. Responsive images
<img
  srcset="
    hero-small.jpg 480w,
    hero-medium.jpg 800w,
    hero-large.jpg 1200w
  "
  sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px"
  src="hero-large.jpg"
  alt="Hero"
/>

// FID OPTIMIZATION

// 1. Code splitting with dynamic imports
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}

// 2. Defer non-critical JavaScript
<script src="analytics.js" defer></script>
<script src="chat-widget.js" async></script>

// 3. Use Web Workers for heavy computation
// main.js
const worker = new Worker('heavy-calc.js');

worker.postMessage({ data: largeDataset });

worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// heavy-calc.js (Web Worker)
self.onmessage = (e) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
};

// 4. Request Idle Callback
function processQueue(deadline) {
  while (deadline.timeRemaining() > 0 && queue.length > 0) {
    const task = queue.shift();
    processTask(task);
  }

  if (queue.length > 0) {
    requestIdleCallback(processQueue);
  }
}

requestIdleCallback(processQueue);

// CLS OPTIMIZATION

// 1. Reserve space for images
<img
  src="banner.jpg"
  width="1200"
  height="300"  // Browser reserves space
  style={{ aspectRatio: '4/1' }}  // Modern CSS
  alt="Banner"
/>

// 2. Reserve space for ads
<div class="ad-container" style={{ minHeight: '250px' }}>
  <!-- Ad loads here -->
</div>

// 3. Avoid layout shifts from fonts
<style>
  @font-face {
    font-family: 'Custom Font';
    src: url('/font.woff2') format('woff2');
    font-display: swap;  // Show fallback until loaded
  }
</style>

// 4. Preload fonts
<link
  rel="preload"
  href="/font.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

// 5. Avoid dynamic content injection
// ❌ Bad: Causes CLS
function loadBanner() {
  const banner = document.createElement('div');
  banner.textContent = 'Breaking News!';
  document.body.prepend(banner);  // Shifts all content down
}

// ✅ Good: Reserve space
<div id="banner-slot" style={{ minHeight: '60px' }}>
  <!-- Banner loads here without shifting content -->
</div>

// 6. Use CSS transform for animations (doesn't trigger layout)
// ❌ Bad: Triggers layout
.box {
  transition: top 0.3s;
}
.box:hover {
  top: -10px;  // Triggers layout recalculation
}

// ✅ Good: GPU accelerated
.box {
  transition: transform 0.3s;
}
.box:hover {
  transform: translateY(-10px);  // GPU layer, no layout
}

// MEASURING CORE WEB VITALS

// 1. Web Vitals Library (Google)
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

// 2. Performance Observer API
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.renderTime || entry.loadTime);
    }
  }
});

observer.observe({ entryTypes: ['largest-contentful-paint'] });

// 3. Measure FID
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'first-input') {
      console.log('FID:', entry.processingStart - entry.startTime);
    }
  }
});

observer.observe({ entryTypes: ['first-input'] });

// 4. Measure CLS
let clsScore = 0;

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsScore += entry.value;
      console.log('CLS:', clsScore);
    }
  }
});

observer.observe({ entryTypes: ['layout-shift'] });

// REAL-WORLD: Next.js Optimization
// next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,  // Optimize CSS
  },
};

// pages/_app.js - Load analytics after interaction
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Load analytics after page is interactive
    const loadAnalytics = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          import('./analytics').then(({ init }) => init());
        });
      } else {
        setTimeout(() => {
          import('./analytics').then(({ init }) => init());
        }, 1);
      }
    };

    loadAnalytics();
  }, []);

  return <Component {...pageProps} />;
}
```

### Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| FID | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

### Common Mistakes

❌ **Mistake:** Not reserving space for images
```html
<!-- Causes CLS -->
<img src="hero.jpg" alt="Hero">
```

✅ **Correct:** Always specify dimensions
```html
<img src="hero.jpg" width="1200" height="600" alt="Hero">
```

❌ **Mistake:** Blocking rendering with large JavaScript
```html
<!-- Blocks rendering -->
<script src="heavy-app.js"></script>
```

✅ **Correct:** Defer or code-split
```html
<script src="heavy-app.js" defer></script>
<!-- Or use dynamic imports for code splitting -->
```

### Follow-up Questions

- "How do you measure Core Web Vitals in production?"
- "What tools do you use for performance monitoring?"
- "How does server-side rendering affect LCP?"
- "What's the difference between FID and Total Blocking Time (TBT)?"

### Resources

- [Web Vitals](https://web.dev/vitals/)
- [Optimize LCP](https://web.dev/optimize-lcp/)
- [Optimize FID](https://web.dev/optimize-fid/)
- [Optimize CLS](https://web.dev/optimize-cls/)

---

## Question 2: How do you optimize JavaScript bundle size?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Netflix

### Question
Explain techniques for reducing JavaScript bundle size. How do code splitting, tree shaking, and lazy loading work?

### Answer

Reducing bundle size improves load time and performance, especially on slower networks.

1. **Code Splitting**
   - Split code into chunks
   - Load only what's needed
   - Route-based and component-based splitting

2. **Tree Shaking**
   - Remove unused code
   - ES modules required
   - Works with static imports

3. **Lazy Loading**
   - Load components on demand
   - React.lazy() and dynamic imports
   - Reduce initial bundle

4. **Dependency Optimization**
   - Analyze bundle with tools
   - Replace heavy libraries
   - Import only what you need

### Code Example

```javascript
// CODE SPLITTING

// 1. Route-based splitting (React Router)
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// 2. Component-based splitting
function HeavyFeature() {
  const [showChart, setShowChart] = useState(false);
  const [Chart, setChart] = useState(null);

  const loadChart = async () => {
    const module = await import('./Chart');
    setChart(() => module.default);
    setShowChart(true);
  };

  return (
    <div>
      <button onClick={loadChart}>Show Chart</button>
      {showChart && Chart && <Chart />}
    </div>
  );
}

// 3. Webpack magic comments for chunk naming
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ './Dashboard')
);

const AdminPanel = lazy(() =>
  import(/* webpackChunkName: "admin" */ './AdminPanel')
);

// 4. Prefetch for likely routes
<link rel="prefetch" href="/dashboard.chunk.js" />

// TREE SHAKING

// ❌ Bad: Imports entire library
import _ from 'lodash';  // 70KB!
const result = _.uniq([1, 2, 2, 3]);

// ✅ Good: Import only what you need
import uniq from 'lodash/uniq';  // 2KB
const result = uniq([1, 2, 2, 3]);

// ❌ Bad: CommonJS prevents tree shaking
const { format } = require('date-fns');

// ✅ Good: ES modules enable tree shaking
import { format } from 'date-fns';

// Ensure sideEffects in package.json
{
  "name": "my-app",
  "sideEffects": false  // All files can be tree-shaken
}

// Or specify files with side effects
{
  "sideEffects": ["*.css", "*.scss"]
}

// DEPENDENCY OPTIMIZATION

// 1. Analyze bundle
// package.json
{
  "scripts": {
    "analyze": "webpack-bundle-analyzer dist/stats.json"
  }
}

// Next.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

// 2. Replace heavy libraries
// ❌ moment.js: 67KB
import moment from 'moment';
const date = moment().format('YYYY-MM-DD');

// ✅ date-fns: 2-3KB (tree-shakeable)
import { format } from 'date-fns';
const date = format(new Date(), 'yyyy-MM-dd');

// ✅ dayjs: 2KB
import dayjs from 'dayjs';
const date = dayjs().format('YYYY-MM-DD');

// 3. Remove duplicate dependencies
// Use npm dedupe or yarn dedupe
npm dedupe
yarn dedupe

// 4. Use lighter alternatives
// ❌ axios: 13KB
import axios from 'axios';

// ✅ fetch (native): 0KB
const response = await fetch('/api/data');

// ✅ ky: 3KB (fetch wrapper)
import ky from 'ky';
const data = await ky.get('/api/data').json();

// LAZY LOADING IMAGES

// 1. Native lazy loading
<img src="image.jpg" loading="lazy" alt="Description" />

// 2. Intersection Observer
function LazyImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return <img ref={imgRef} src={imageSrc} alt={alt} />;
}

// DYNAMIC IMPORTS FOR UTILITIES

// utils.js
export function heavyCalculation(data) { /* ... */ }
export function lightHelper(str) { /* ... */ }

// ❌ Bad: Imports everything
import { heavyCalculation } from './utils';

// ✅ Good: Load only when needed
async function processData(data) {
  const { heavyCalculation } = await import('./utils');
  return heavyCalculation(data);
}

// WEBPACK OPTIMIZATION

// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Separate vendor bundle
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        // Common code shared across routes
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    // Minimize bundle
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,  // Remove console.logs
          },
        },
      }),
    ],
  },
};

// NEXT.JS OPTIMIZATION

// next.config.js
module.exports = {
  // Webpack bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Replace heavy modules
        'moment': 'dayjs',
      };
    }
    return config;
  },

  // Dynamic imports
  experimental: {
    optimizeCss: true,
    modern Build: true,
  },
};

// PROGRESSIVE HYDRATION (React)
function App() {
  return (
    <div>
      {/* Critical content hydrates immediately */}
      <Header />
      <MainContent />

      {/* Non-critical components hydrate later */}
      <ClientOnly>
        <Comments />
        <RelatedArticles />
      </ClientOnly>
    </div>
  );
}

function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return children;
}

// REAL-WORLD: Conditional polyfills
// Load polyfills only for browsers that need them
if (!('IntersectionObserver' in window)) {
  import('intersection-observer');
}

if (!('fetch' in window)) {
  import('whatwg-fetch');
}
```

### Bundle Size Optimization Checklist

- [ ] Analyze bundle with webpack-bundle-analyzer
- [ ] Implement route-based code splitting
- [ ] Use React.lazy() for heavy components
- [ ] Import only needed functions from libraries
- [ ] Replace heavy libraries (moment → date-fns)
- [ ] Remove unused dependencies
- [ ] Enable tree shaking (ES modules)
- [ ] Minimize production bundle
- [ ] Use compression (gzip/brotli)
- [ ] Implement lazy loading for images
- [ ] Use CDN for static assets
- [ ] Set proper cache headers

### Common Mistakes

❌ **Mistake:** Importing entire library
```javascript
import _ from 'lodash';  // 70KB
import * as R from 'ramda';  // 50KB
```

✅ **Correct:** Import specific functions
```javascript
import debounce from 'lodash/debounce';  // 2KB
import pipe from 'ramda/src/pipe';  // 1KB
```

### Follow-up Questions

- "How do you analyze your bundle size?"
- "What's the difference between defer and async for scripts?"
- "How does webpack's splitChunks work?"
- "What are the tradeoffs of code splitting?"

### Resources

- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Code Splitting](https://reactjs.org/docs/code-splitting.html)
- [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)

---

## Question 3: How do you optimize React rendering performance?

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 12-15 minutes
**Companies:** Meta, Google, Amazon, Netflix, Airbnb

### Question
Explain React rendering optimization techniques. When should you use React.memo, useMemo, useCallback? What are the pitfalls?

### Answer

React re-renders can be expensive. Optimization prevents unnecessary renders and computations.

1. **Prevent Re-renders**
   - React.memo for components
   - PureComponent for classes
   - Key prop for list stability

2. **Memoization**
   - useMemo for expensive calculations
   - useCallback for function identity
   - Avoid premature optimization

3. **Virtualization**
   - React Window / React Virtualized
   - Render only visible items
   - Essential for long lists

4. **React 18 Features**
   - Concurrent rendering
   - Automatic batching
   - useTransition for non-urgent updates
   - useDeferredValue

### Code Example

```javascript
// REACT.MEMO

// ❌ Bad: Re-renders every time parent renders
function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
}

// ✅ Good: Only re-renders when props change
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
});

// Custom comparison function
const MemoizedComponent = React.memo(
  Component,
  (prevProps, nextProps) => {
    // Return true if props are equal (don't re-render)
    return prevProps.id === nextProps.id &&
           prevProps.name === nextProps.name;
  }
);

// USEMEMO

function SearchResults({ query, items }) {
  // ❌ Bad: Recalculates on every render
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  // ✅ Good: Only recalculates when dependencies change
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, items]);

  return <List items={filteredItems} />;
}

// USECALLBACK

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ Bad: New function on every render
  const handleClick = () => {
    console.log('Clicked', count);
  };

  // ✅ Good: Same function reference if count hasn't changed
  const handleClick = useCallback(() => {
    console.log('Clicked', count);
  }, [count]);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <MemoizedChild onClick={handleClick} />
    </div>
  );
}

const MemoizedChild = React.memo(function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

// LIST VIRTUALIZATION (React Window)
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// REACT 18: useTransition
import { useState, useTransition } from 'react';

function SearchApp() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);  // Urgent: Update input immediately

    // Non-urgent: Mark search as low priority
    startTransition(() => {
      const filtered = heavySearch(value);
      setResults(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <Results items={results} />
    </div>
  );
}

// REACT 18: useDeferredValue
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => {
    return heavySearch(deferredQuery);
  }, [deferredQuery]);

  return <List items={results} />;
}

// LAZY INITIALIZATION
function ExpensiveComponent() {
  // ❌ Bad: Runs on every render
  const [state, setState] = useState(expensiveCalculation());

  // ✅ Good: Runs only once
  const [state, setState] = useState(() => expensiveCalculation());
}

// SPLIT STATE TO PREVENT UNNECESSARY RENDERS
function Form() {
  // ❌ Bad: Single state causes all fields to re-render
  const [formData, setFormData] = useState({ name: '', email: '', age: 0 });

  // ✅ Good: Independent state updates
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
}

// CONTEXT OPTIMIZATION
// ❌ Bad: All consumers re-render on any state change
const AppContext = createContext();

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [settings, setSettings] = useState({});

  const value = { user, setUser, theme, setTheme, settings, setSettings };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ✅ Good: Split contexts by update frequency
const UserContext = createContext();
const ThemeContext = createContext();
const SettingsContext = createContext();

function Providers({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [settings, setSettings] = useState({});

  return (
    <UserContext.Provider value={useMemo(() => ({ user, setUser }), [user])}>
      <ThemeContext.Provider value={useMemo(() => ({ theme, setTheme }), [theme])}>
        <SettingsContext.Provider value={useMemo(() => ({ settings, setSettings }), [settings])}>
          {children}
        </SettingsContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// DEBOUNCE INPUT
function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        onSearch(value);
      }, 300),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);  // Update input immediately
    debouncedSearch(value);  // Debounced API call
  };

  return <input value={query} onChange={handleChange} />;
}

// KEYS FOR LIST STABILITY
function TodoList({ todos }) {
  // ❌ Bad: Using index as key (unstable on reorder/filter)
  return todos.map((todo, index) => (
    <Todo key={index} {...todo} />
  ));

  // ✅ Good: Using stable ID
  return todos.map(todo => (
    <Todo key={todo.id} {...todo} />
  ));
}

// PROFILER API
import { Profiler } from 'react';

function onRenderCallback(
  id,  // Component ID
  phase,  // "mount" or "update"
  actualDuration,  // Time spent rendering
  baseDuration,  // Estimated time without memoization
  startTime,
  commitTime,
  interactions
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="Dashboard" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

### When to Optimize

**DO optimize:**
- Large lists (100+ items)
- Expensive calculations
- High-frequency updates
- Deep component trees
- Identified performance bottlenecks (measured!)

**DON'T optimize prematurely:**
- Small lists (<50 items)
- Simple components
- Infrequent updates
- Without measuring first

### Common Mistakes

❌ **Mistake:** Using useMemo/useCallback everywhere
```javascript
// Over-optimization (unnecessary)
const Component = () => {
  const value = useMemo(() => 2 + 2, []);  // Overkill!
  const handleClick = useCallback(() => {}, []);  // Unnecessary if parent isn't memoized
};
```

✅ **Correct:** Optimize based on measurements
```javascript
// Only optimize when needed
const Component = () => {
  const value = 4;  // Simple calculation
  const handleClick = () => {};  // OK if child isn't memoized

  // Only add useMemo for truly expensive operations
  const expensiveResult = useMemo(() => {
    return heavyCalculation(data);  // Worth memoizing
  }, [data]);
};
```

### Follow-up Questions

- "When is useMemo actually beneficial?"
- "How do you identify performance bottlenecks in React?"
- "What's the difference between React.memo and useMemo?"
- "How does React's reconciliation algorithm work?"

### Resources

- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [React.memo](https://react.dev/reference/react/memo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useMemo](https://react.dev/reference/react/useMemo)

---

[← Back to Performance README](./README.md)

**Progress:** 3 of 5 performance questions
