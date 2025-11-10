# Performance Optimization Flashcards

> **40 essential performance concepts for web optimization**

**Time to review:** 20 minutes
**Best for:** Performance-focused interviews, optimization roles

---

## Card 1: Core Web Vitals
**Q:** What are the 3 Core Web Vitals and their thresholds?

**A:** LCP (Largest Contentful Paint < 2.5s), FID (First Input Delay < 100ms), CLS (Cumulative Layout Shift < 0.1). Google's key metrics for page experience.

**Difficulty:** 🟡 Medium
**Tags:** #performance #web-vitals #metrics
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 2: LCP Optimization
**Q:** How to improve Largest Contentful Paint (LCP)?

**A:** 1) Optimize server response time, 2) Eliminate render-blocking resources, 3) Optimize images (WebP, lazy load), 4) Use CDN, 5) Preload key resources.

**Difficulty:** 🟡 Medium
**Tags:** #performance #lcp
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 3: CLS Prevention
**Q:** How to prevent Cumulative Layout Shift (CLS)?

**A:** 1) Set explicit width/height on images/videos, 2) Reserve space for ads, 3) Avoid inserting content above existing, 4) Use transform instead of top/left, 5) Font loading strategies.

**Difficulty:** 🟡 Medium
**Tags:** #performance #cls
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 4: Critical Rendering Path
**Q:** What is the critical rendering path?

**A:** Steps browser takes to convert HTML/CSS/JS to pixels: DOM → CSSOM → Render Tree → Layout → Paint. Optimizing reduces time to first render.

**Difficulty:** 🟡 Medium
**Tags:** #performance #rendering
**Frequency:** ⭐⭐⭐⭐

---

## Card 5: Lazy Loading
**Q:** When should you lazy load?

**A:** Images/videos below fold, non-critical components, heavy libraries, route components. Use Intersection Observer or native loading="lazy". Improves initial load time.

**Difficulty:** 🟢 Easy
**Tags:** #performance #lazy-loading
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 6: Code Splitting
**Q:** What are code splitting strategies?

**A:** 1) Route-based (lazy load routes), 2) Component-based (lazy heavy components), 3) Library splitting (dynamic import), 4) Vendor splitting (separate bundle).

**Difficulty:** 🟡 Medium
**Tags:** #performance #code-splitting
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 7: Tree Shaking
**Q:** What is tree shaking and when does it work?

**A:** Removing unused code during build. Requires ES modules (import/export), not CommonJS. Side-effect-free code. Reduces bundle size significantly.

**Difficulty:** 🟡 Medium
**Tags:** #performance #bundling
**Frequency:** ⭐⭐⭐⭐

---

## Card 8: Resource Hints
**Q:** Difference between preload, prefetch, and preconnect?

**A:** preload: fetch resource for current page (high priority). prefetch: fetch for future navigation (low priority). preconnect: establish early connection to origin.

**Difficulty:** 🔴 Hard
**Tags:** #performance #resource-hints
**Frequency:** ⭐⭐⭐⭐

---

## Card 9: Image Optimization
**Q:** Best practices for image optimization?

**A:** 1) Use WebP/AVIF, 2) Responsive images (srcset), 3) Lazy load below fold, 4) Compress (TinyPNG), 5) Use CDN, 6) Set dimensions, 7) Blur-up placeholder.

**Difficulty:** 🟡 Medium
**Tags:** #performance #images
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 10: Caching Strategies
**Q:** What are effective caching strategies?

**A:** 1) Cache-Control headers, 2) Service Worker caching, 3) CDN caching, 4) Immutable assets with hashes, 5) Stale-while-revalidate, 6) Cache API, 7) Memory caching (Map).

**Difficulty:** 🔴 Hard
**Tags:** #performance #caching
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 11: Bundle Size
**Q:** How to reduce JavaScript bundle size?

**A:** 1) Code splitting, 2) Tree shaking, 3) Minification, 4) Remove unused dependencies, 5) Use smaller alternatives, 6) Dynamic imports, 7) Analyze with webpack-bundle-analyzer.

**Difficulty:** 🟡 Medium
**Tags:** #performance #bundling
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 12: Render Blocking
**Q:** How to eliminate render-blocking resources?

**A:** 1) Inline critical CSS, 2) Async/defer scripts, 3) Preload key resources, 4) Extract critical path CSS, 5) Load non-critical CSS async.

**Difficulty:** 🟡 Medium
**Tags:** #performance #rendering
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 13: JavaScript Performance
**Q:** JavaScript performance optimization techniques?

**A:** 1) Debounce/throttle, 2) Web Workers for heavy tasks, 3) RequestAnimationFrame for animations, 4) Avoid memory leaks, 5) Use efficient algorithms, 6) Minimize DOM access.

**Difficulty:** 🟡 Medium
**Tags:** #performance #javascript
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 14: Memory Leaks
**Q:** Common causes of memory leaks in JavaScript?

**A:** 1) Forgotten timers/intervals, 2) Closures holding references, 3) Detached DOM nodes, 4) Global variables, 5) Event listeners not removed, 6) Large caches without limits.

**Difficulty:** 🔴 Hard
**Tags:** #performance #memory
**Frequency:** ⭐⭐⭐⭐

---

## Card 15: Reflow vs Repaint
**Q:** Difference between reflow and repaint?

**A:** Reflow: recalculate layout (position/size changes, expensive). Repaint: redraw pixels (color changes, cheaper). Minimize by batching DOM changes, use transform/opacity.

**Difficulty:** 🟡 Medium
**Tags:** #performance #rendering
**Frequency:** ⭐⭐⭐⭐

---

## Card 16: requestAnimationFrame
**Q:** When to use requestAnimationFrame?

**A:** For animations and visual updates. Syncs with browser repaint (~60fps). Better than setTimeout. Pauses when tab inactive. Use for smooth animations.

**Difficulty:** 🟡 Medium
**Tags:** #performance #animation
**Frequency:** ⭐⭐⭐⭐

---

## Card 17: Web Workers
**Q:** When to use Web Workers?

**A:** For CPU-intensive tasks: image processing, data parsing, calculations, encryption. Runs in separate thread, no DOM access. Prevents blocking main thread.

**Difficulty:** 🟡 Medium
**Tags:** #performance #workers
**Frequency:** ⭐⭐⭐⭐

---

## Card 18: Service Workers
**Q:** What are Service Worker use cases?

**A:** 1) Offline support, 2) Background sync, 3) Push notifications, 4) Cache management, 5) Network request interception, 6) Performance optimization.

**Difficulty:** 🔴 Hard
**Tags:** #performance #service-workers
**Frequency:** ⭐⭐⭐⭐

---

## Card 19: Font Loading
**Q:** Best practices for font loading?

**A:** 1) font-display: swap/optional, 2) Preload fonts, 3) Self-host fonts, 4) Use system fonts, 5) Subset fonts, 6) WOFF2 format, 7) Avoid FOIT/FOUT.

**Difficulty:** 🟡 Medium
**Tags:** #performance #fonts
**Frequency:** ⭐⭐⭐⭐

---

## Card 20: Compression
**Q:** What compression techniques improve performance?

**A:** 1) Gzip/Brotli (text), 2) Image compression (lossy/lossless), 3) Minification (JS/CSS), 4) Video compression, 5) Asset optimization, 6) Enable in server config.

**Difficulty:** 🟢 Easy
**Tags:** #performance #compression
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 21: CDN Benefits
**Q:** How does CDN improve performance?

**A:** 1) Reduces latency (geographically closer), 2) Caching at edge, 3) Reduces origin load, 4) DDoS protection, 5) HTTP/2, 6) Compression, 7) Image optimization.

**Difficulty:** 🟢 Easy
**Tags:** #performance #cdn
**Frequency:** ⭐⭐⭐⭐

---

## Card 22: HTTP/2 Benefits
**Q:** What are HTTP/2 performance benefits?

**A:** 1) Multiplexing (parallel requests), 2) Header compression, 3) Server push, 4) Binary protocol (faster parsing), 5) Stream prioritization. Eliminates need for domain sharding.

**Difficulty:** 🟡 Medium
**Tags:** #performance #http
**Frequency:** ⭐⭐⭐⭐

---

## Card 23: Lighthouse Score
**Q:** What does Lighthouse measure?

**A:** Performance (FCP, LCP, TBT, CLS, TTI), Accessibility, Best Practices, SEO, PWA. Scores 0-100. Run in Chrome DevTools or CI/CD.

**Difficulty:** 🟢 Easy
**Tags:** #performance #lighthouse
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 24: Time to Interactive
**Q:** What is Time to Interactive (TTI)?

**A:** Time until page is fully interactive (main thread idle for 5s). Measures when user can reliably interact. Improve by reducing JavaScript execution time.

**Difficulty:** 🟡 Medium
**Tags:** #performance #metrics
**Frequency:** ⭐⭐⭐⭐

---

## Card 25: Total Blocking Time
**Q:** What is Total Blocking Time (TBT)?

**A:** Sum of blocking time of long tasks (>50ms) between FCP and TTI. Measures responsiveness during load. Lower is better. Optimize by code splitting.

**Difficulty:** 🟡 Medium
**Tags:** #performance #metrics
**Frequency:** ⭐⭐⭐⭐

---

## Card 26: Throttling vs Debouncing
**Q:** When to use throttling vs debouncing for performance?

**A:** Throttle: Execute at regular intervals (scroll, mouse move, resize). Debounce: Execute after inactivity (search input, window resize completion). Both reduce function calls.

**Difficulty:** 🟡 Medium
**Tags:** #performance #optimization
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 27: Virtual Scrolling
**Q:** What is virtual scrolling and when to use it?

**A:** Render only visible items in large lists. Recycle DOM nodes. Use for 1000+ items. Libraries: react-window, react-virtualized. Improves render performance dramatically.

**Difficulty:** 🔴 Hard
**Tags:** #performance #virtualization
**Frequency:** ⭐⭐⭐⭐

---

## Card 28: Memoization
**Q:** When to use memoization in React?

**A:** React.memo for components, useMemo for expensive calculations, useCallback for function identity. Don't overuse - adds memory overhead. Profile first.

**Difficulty:** 🟡 Medium
**Tags:** #performance #react
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 29: Bundle Analysis
**Q:** How to analyze bundle size?

**A:** webpack-bundle-analyzer, source-map-explorer, Next.js Bundle Analyzer. Identify large dependencies, duplicate code, unused exports. Optimize imports.

**Difficulty:** 🟡 Medium
**Tags:** #performance #bundling
**Frequency:** ⭐⭐⭐⭐

---

## Card 30: Critical CSS
**Q:** What is critical CSS?

**A:** CSS needed for above-the-fold content. Inline in <head> to prevent render blocking. Extract with tools like critical, criticalCSS. Load rest async.

**Difficulty:** 🟡 Medium
**Tags:** #performance #css
**Frequency:** ⭐⭐⭐⭐

---

## Card 31: DNS Prefetch
**Q:** When to use dns-prefetch?

**A:** For third-party domains used later. `<link rel="dns-prefetch" href="//example.com">`. Resolves DNS early. Low overhead. Use for analytics, fonts, APIs.

**Difficulty:** 🟢 Easy
**Tags:** #performance #optimization
**Frequency:** ⭐⭐⭐

---

## Card 32: RAIL Model
**Q:** What is the RAIL performance model?

**A:** Response (<100ms), Animation (60fps = 16ms/frame), Idle (use idle time for work), Load (<5s). Google's user-centric performance model.

**Difficulty:** 🟡 Medium
**Tags:** #performance #metrics
**Frequency:** ⭐⭐⭐⭐

---

## Card 33: Long Tasks
**Q:** What are long tasks and how to fix?

**A:** Tasks >50ms that block main thread. Fix: code splitting, Web Workers, break into smaller tasks, use requestIdleCallback, async/await to yield.

**Difficulty:** 🔴 Hard
**Tags:** #performance #optimization
**Frequency:** ⭐⭐⭐⭐

---

## Card 34: Asset Optimization
**Q:** How to optimize static assets?

**A:** 1) Minify JS/CSS, 2) Compress images, 3) Use modern formats (WebP, AVIF), 4) Add cache headers, 5) Use CDN, 6) Version/hash filenames.

**Difficulty:** 🟢 Easy
**Tags:** #performance #assets
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 35: Intersection Observer
**Q:** How does Intersection Observer improve performance?

**A:** Efficiently detect element visibility without scroll listeners. Use for: lazy loading, infinite scroll, analytics, animations. Better than getBoundingClientRect polling.

**Difficulty:** 🟡 Medium
**Tags:** #performance #api
**Frequency:** ⭐⭐⭐⭐

---

## Card 36: Memory Profiling
**Q:** How to find memory leaks?

**A:** Chrome DevTools Memory profiler. Take heap snapshots, compare. Look for detached DOM, growing arrays/objects. Use Performance Monitor for real-time.

**Difficulty:** 🔴 Hard
**Tags:** #performance #debugging
**Frequency:** ⭐⭐⭐

---

## Card 37: Network Optimization
**Q:** Network performance optimization techniques?

**A:** 1) Reduce requests, 2) Use HTTP/2, 3) Enable compression, 4) CDN, 5) Connection pooling, 6) Reduce payload size, 7) Caching headers.

**Difficulty:** 🟡 Medium
**Tags:** #performance #network
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 38: Server-Side Rendering
**Q:** How does SSR improve performance?

**A:** Faster First Contentful Paint, better SEO, content visible before JS loads. Trade-off: longer TTFB, more server load. Use for content-heavy apps.

**Difficulty:** 🟡 Medium
**Tags:** #performance #ssr
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 39: Incremental Static Regeneration
**Q:** What is ISR in Next.js?

**A:** Regenerate static pages after deployment. Best of SSG (fast) and SSR (fresh). Set revalidate time. Good for content that updates occasionally.

**Difficulty:** 🟡 Medium
**Tags:** #performance #nextjs
**Frequency:** ⭐⭐⭐⭐

---

## Card 40: Performance Budget
**Q:** What is a performance budget?

**A:** Limits on metrics: bundle size, load time, LCP, etc. Enforced in CI/CD. Prevents performance regression. Example: JS bundle <200KB, LCP <2.5s.

**Difficulty:** 🟢 Easy
**Tags:** #performance #metrics
**Frequency:** ⭐⭐⭐⭐

---

[← Back to Flashcards](../README.md)
