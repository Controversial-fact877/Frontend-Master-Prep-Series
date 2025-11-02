# Essential 50 Flashcards

> **The top 50 questions that appear in 80%+ of frontend interviews**

**Time to review:** 25-30 minutes
**Best for:** Final review before interview, assessing your knowledge gaps

---

## Card 1: Closures
**Q:** What is a closure in JavaScript?

**A:** A function that has access to variables in its outer lexical scope, even after the outer function has returned. Used for data privacy and maintaining state.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #closures #fundamentals
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 2: Event Loop
**Q:** Explain the JavaScript event loop.

**A:** The event loop continuously checks the call stack and task queues. It executes synchronous code first, then processes microtasks (Promises), then macrotasks (setTimeout, setInterval).

**Difficulty:** 🟡 Medium
**Tags:** #javascript #async #event-loop
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 3: Promises
**Q:** What are the three states of a Promise?

**A:** Pending (initial state), Fulfilled (operation completed successfully), Rejected (operation failed).

**Difficulty:** 🟢 Easy
**Tags:** #javascript #promises #async
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 4: this Keyword
**Q:** How is the value of 'this' determined?

**A:** Determined by how a function is called: 1) Method call (object.method) - 'this' is the object, 2) Regular function - undefined (strict) or window, 3) Arrow function - lexical 'this', 4) new keyword - new object, 5) call/apply/bind - explicitly set.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #this #context
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 5: Prototypal Inheritance
**Q:** How does prototypal inheritance work in JavaScript?

**A:** Objects can inherit properties and methods from other objects through the prototype chain. When accessing a property, JavaScript looks up the chain until found or reaches null.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #prototypes #inheritance
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 6: Hoisting
**Q:** What is hoisting in JavaScript?

**A:** JavaScript's behavior of moving declarations to the top of their scope during compilation. var is hoisted and initialized with undefined; let/const are hoisted but in Temporal Dead Zone until declaration.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #hoisting #fundamentals
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 7: async/await
**Q:** What is async/await?

**A:** Syntactic sugar over Promises that makes asynchronous code look synchronous. async functions always return a Promise; await pauses execution until Promise resolves.

**Difficulty:** 🟢 Easy
**Tags:** #javascript #async #promises
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 8: Virtual DOM
**Q:** What is the Virtual DOM in React?

**A:** A lightweight JavaScript representation of the actual DOM. React uses it to calculate the minimal set of changes needed to update the real DOM efficiently (reconciliation).

**Difficulty:** 🟡 Medium
**Tags:** #react #virtual-dom #performance
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 9: React Hooks Rules
**Q:** What are the two main rules of React Hooks?

**A:** 1) Only call Hooks at the top level (not inside loops, conditions, or nested functions), 2) Only call Hooks from React function components or custom Hooks.

**Difficulty:** 🟢 Easy
**Tags:** #react #hooks #rules
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 10: useEffect
**Q:** When does useEffect run?

**A:** After every render by default. Runs after browser paint. Can be controlled with dependency array: [] (mount only), [deps] (when deps change), or no array (every render).

**Difficulty:** 🟡 Medium
**Tags:** #react #hooks #useEffect
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 11: useState
**Q:** Why use functional updates with useState?

**A:** When new state depends on previous state, use functional update setState(prev => prev + 1) to avoid stale closures and ensure correct value with batched updates.

**Difficulty:** 🟡 Medium
**Tags:** #react #hooks #useState
**Frequency:** ⭐⭐⭐⭐

---

## Card 12: useMemo vs useCallback
**Q:** What's the difference between useMemo and useCallback?

**A:** useMemo memoizes a computed value (returns the value), useCallback memoizes a function itself (returns the function). Both prevent unnecessary recalculations/recreations.

**Difficulty:** 🟡 Medium
**Tags:** #react #hooks #optimization
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 13: CSS Box Model
**Q:** Describe the CSS box model.

**A:** Every element is a box with: content, padding, border, and margin. box-sizing: border-box makes width include padding and border.

**Difficulty:** 🟢 Easy
**Tags:** #css #box-model #fundamentals
**Frequency:** ⭐⭐⭐⭐

---

## Card 14: Flexbox
**Q:** When would you use flexbox vs grid?

**A:** Flexbox: One-dimensional layouts (rows OR columns), content-driven sizing. Grid: Two-dimensional layouts (rows AND columns), layout-driven sizing.

**Difficulty:** 🟢 Easy
**Tags:** #css #flexbox #grid #layout
**Frequency:** ⭐⭐⭐⭐

---

## Card 15: Semantic HTML
**Q:** Why use semantic HTML?

**A:** Improves accessibility (screen readers), SEO (search engines understand structure), maintainability (clearer code intent), and default styling.

**Difficulty:** 🟢 Easy
**Tags:** #html #semantic #accessibility
**Frequency:** ⭐⭐⭐⭐

---

## Card 16: REST vs GraphQL
**Q:** Main differences between REST and GraphQL?

**A:** REST: Multiple endpoints, over/under-fetching, versioning needed. GraphQL: Single endpoint, request exactly what you need, strongly typed schema, no versioning.

**Difficulty:** 🟡 Medium
**Tags:** #api #rest #graphql
**Frequency:** ⭐⭐⭐⭐

---

## Card 17: HTTP Methods
**Q:** When to use POST vs PUT vs PATCH?

**A:** POST: Create new resource, PUT: Replace entire resource, PATCH: Partial update. POST is not idempotent; PUT and PATCH are idempotent.

**Difficulty:** 🟢 Easy
**Tags:** #http #api #methods
**Frequency:** ⭐⭐⭐⭐

---

## Card 18: CORS
**Q:** What is CORS and why does it exist?

**A:** Cross-Origin Resource Sharing. Browser security feature that blocks requests to different origins unless server explicitly allows it via Access-Control-Allow-Origin header.

**Difficulty:** 🟡 Medium
**Tags:** #security #cors #browser
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 19: JWT
**Q:** What is a JWT token structure?

**A:** Three base64-encoded parts separated by dots: Header (algorithm), Payload (claims/data), Signature (verification). Format: xxxxx.yyyyy.zzzzz

**Difficulty:** 🟡 Medium
**Tags:** #security #jwt #auth
**Frequency:** ⭐⭐⭐⭐

---

## Card 20: LocalStorage vs SessionStorage
**Q:** Difference between localStorage and sessionStorage?

**A:** localStorage persists across browser sessions (no expiration), sessionStorage clears when tab closes. Both have ~5-10MB limit and are synchronous.

**Difficulty:** 🟢 Easy
**Tags:** #browser #storage #api
**Frequency:** ⭐⭐⭐⭐

---

## Card 21: Critical Rendering Path
**Q:** What is the critical rendering path?

**A:** Sequence of steps browser takes to render page: DOM construction, CSSOM construction, Render tree, Layout, Paint. Blocking resources delay rendering.

**Difficulty:** 🟡 Medium
**Tags:** #performance #browser #rendering
**Frequency:** ⭐⭐⭐⭐

---

## Card 22: Core Web Vitals
**Q:** Name the three Core Web Vitals.

**A:** LCP (Largest Contentful Paint - loading performance), FID (First Input Delay - interactivity), CLS (Cumulative Layout Shift - visual stability).

**Difficulty:** 🟢 Easy
**Tags:** #performance #web-vitals #seo
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 23: Debounce vs Throttle
**Q:** What's the difference?

**A:** Debounce delays execution until after inactivity period. Throttle executes at most once per time interval. Debounce for search input, throttle for scroll events.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #performance #patterns
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 24: Pure Functions
**Q:** What makes a function pure?

**A:** 1) Same inputs always return same output, 2) No side effects (doesn't modify external state), 3) Doesn't depend on external mutable state.

**Difficulty:** 🟢 Easy
**Tags:** #javascript #functional #patterns
**Frequency:** ⭐⭐⭐⭐

---

## Card 25: Memoization
**Q:** What is memoization?

**A:** Optimization technique that caches function results based on inputs. Subsequent calls with same inputs return cached result instead of recalculating.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #optimization #caching
**Frequency:** ⭐⭐⭐⭐

---

## Card 26: Event Delegation
**Q:** What is event delegation and why use it?

**A:** Attach single event listener to parent instead of multiple listeners on children. Uses event bubbling. Benefits: Better performance, handles dynamically added elements.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #events #dom
**Frequency:** ⭐⭐⭐⭐

---

## Card 27: SSR vs CSR
**Q:** Server-Side Rendering vs Client-Side Rendering?

**A:** SSR: HTML generated on server, better SEO and initial load. CSR: HTML generated in browser, better interactivity and subsequent navigation. Next.js offers both.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #react #rendering
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 28: Static Generation vs SSR
**Q:** Difference in Next.js?

**A:** Static: HTML generated at build time (getStaticProps), cached and reused. SSR: HTML generated on each request (getServerSideProps). Static is faster but less dynamic.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #rendering #performance
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 29: TypeScript Interface vs Type
**Q:** When to use interface vs type?

**A:** Interface: Object shapes, can be extended, declaration merging. Type: Unions, intersections, primitives, tuples. Prefer interface for objects, type for everything else.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #types #interfaces
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 30: TypeScript Generics
**Q:** Why use generics?

**A:** Create reusable components that work with multiple types while maintaining type safety. Like function parameters but for types.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #generics #patterns
**Frequency:** ⭐⭐⭐⭐

---

## Card 31: Git Rebase vs Merge
**Q:** When to use rebase vs merge?

**A:** Merge: Preserves history, creates merge commit, use for public branches. Rebase: Linear history, rewrites commits, use for feature branches before merging.

**Difficulty:** 🟡 Medium
**Tags:** #git #version-control
**Frequency:** ⭐⭐⭐

---

## Card 32: Accessibility ARIA
**Q:** When should you use ARIA attributes?

**A:** Only when native HTML semantics don't exist (complex widgets). First rule of ARIA: Don't use ARIA if native HTML works. Examples: aria-label, aria-live, role.

**Difficulty:** 🟡 Medium
**Tags:** #accessibility #aria #a11y
**Frequency:** ⭐⭐⭐⭐

---

## Card 33: Webpack vs Vite
**Q:** Main advantages of Vite over Webpack?

**A:** Vite: Faster dev server (ESM, no bundling), faster HMR, simpler config. Uses esbuild for deps. Webpack: More mature, larger ecosystem, better for complex configs.

**Difficulty:** 🟡 Medium
**Tags:** #tooling #bundlers #build
**Frequency:** ⭐⭐⭐

---

## Card 34: React Keys
**Q:** Why are keys important in React lists?

**A:** Help React identify which items changed, added, or removed. Keys should be stable, unique among siblings. Using index as key can cause bugs with reordering.

**Difficulty:** 🟡 Medium
**Tags:** #react #performance #lists
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 35: Controlled vs Uncontrolled
**Q:** Difference in React forms?

**A:** Controlled: React state is source of truth (value + onChange). Uncontrolled: DOM is source of truth (useRef). Controlled gives more control, uncontrolled is simpler.

**Difficulty:** 🟡 Medium
**Tags:** #react #forms #state
**Frequency:** ⭐⭐⭐⭐

---

## Card 36: React Context
**Q:** When to use Context vs props?

**A:** Context: Data needed by many components at different nesting levels (theme, user, language). Props: Most data passing, keeps component reusable and testable.

**Difficulty:** 🟡 Medium
**Tags:** #react #context #state-management
**Frequency:** ⭐⭐⭐⭐

---

## Card 37: useRef
**Q:** What are the two main uses of useRef?

**A:** 1) Access DOM elements directly (like document.querySelector), 2) Store mutable values that persist across renders without causing re-renders.

**Difficulty:** 🟡 Medium
**Tags:** #react #hooks #useRef
**Frequency:** ⭐⭐⭐⭐

---

## Card 38: React Fiber
**Q:** What is React Fiber?

**A:** React's reconciliation algorithm. Breaks rendering work into chunks, can pause/resume work, prioritize updates. Enables Concurrent Mode and Suspense.

**Difficulty:** 🔴 Hard
**Tags:** #react #fiber #internals
**Frequency:** ⭐⭐⭐

---

## Card 39: CSS Specificity
**Q:** How is CSS specificity calculated?

**A:** Count: inline styles (1000), IDs (100), classes/attributes/pseudo-classes (10), elements (1). Higher total wins. !important overrides all.

**Difficulty:** 🟡 Medium
**Tags:** #css #specificity #fundamentals
**Frequency:** ⭐⭐⭐⭐

---

## Card 40: Position Values
**Q:** Explain CSS position values.

**A:** static (default, normal flow), relative (offset from normal position), absolute (offset from positioned ancestor), fixed (offset from viewport), sticky (relative until threshold, then fixed).

**Difficulty:** 🟡 Medium
**Tags:** #css #position #layout
**Frequency:** ⭐⭐⭐⭐

---

## Card 41: JavaScript Modules
**Q:** ESM vs CommonJS?

**A:** ESM: import/export, static analysis, tree-shaking, async loading. CommonJS: require/module.exports, dynamic, synchronous. ESM is modern standard.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #modules #import
**Frequency:** ⭐⭐⭐⭐

---

## Card 42: Lazy Loading
**Q:** How to lazy load images?

**A:** Use loading="lazy" attribute (native), Intersection Observer API, or libraries. Defers loading until near viewport. Improves initial page load.

**Difficulty:** 🟢 Easy
**Tags:** #performance #images #optimization
**Frequency:** ⭐⭐⭐⭐

---

## Card 43: Web Workers
**Q:** What are Web Workers?

**A:** Run JavaScript in background threads, don't block main thread. No DOM access. Use for heavy computations. Communicate via postMessage.

**Difficulty:** 🟡 Medium
**Tags:** #javascript #performance #threading
**Frequency:** ⭐⭐⭐

---

## Card 44: Service Workers
**Q:** What do Service Workers enable?

**A:** Offline functionality, push notifications, background sync, caching strategies. Acts as proxy between app and network. Required for PWAs.

**Difficulty:** 🟡 Medium
**Tags:** #pwa #service-workers #offline
**Frequency:** ⭐⭐⭐

---

## Card 45: XSS Attack
**Q:** What is XSS and how to prevent it?

**A:** Cross-Site Scripting: Injecting malicious scripts into web pages. Prevent: Sanitize user input, escape output, use Content Security Policy, avoid innerHTML with user data.

**Difficulty:** 🟡 Medium
**Tags:** #security #xss #vulnerabilities
**Frequency:** ⭐⭐⭐⭐

---

## Card 46: CSRF Attack
**Q:** What is CSRF and how to prevent it?

**A:** Cross-Site Request Forgery: Trick user into unwanted actions on authenticated site. Prevent: CSRF tokens, SameSite cookies, verify origin headers.

**Difficulty:** 🟡 Medium
**Tags:** #security #csrf #vulnerabilities
**Frequency:** ⭐⭐⭐

---

## Card 47: HTTP Status Codes
**Q:** Common status codes?

**A:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.

**Difficulty:** 🟢 Easy
**Tags:** #http #status-codes #api
**Frequency:** ⭐⭐⭐⭐

---

## Card 48: Responsive Design
**Q:** Mobile-first vs desktop-first?

**A:** Mobile-first: Start with mobile styles, add complexity for larger screens (min-width). Desktop-first: Start with desktop, simplify for mobile (max-width). Mobile-first is recommended.

**Difficulty:** 🟢 Easy
**Tags:** #css #responsive #mobile
**Frequency:** ⭐⭐⭐⭐

---

## Card 49: REST API Design
**Q:** Best practices for REST APIs?

**A:** Use nouns for resources, HTTP methods for actions, proper status codes, versioning, pagination, filtering, consistent naming, HATEOAS (optional).

**Difficulty:** 🟡 Medium
**Tags:** #api #rest #design
**Frequency:** ⭐⭐⭐⭐

---

## Card 50: Testing Types
**Q:** Unit vs Integration vs E2E tests?

**A:** Unit: Test individual functions in isolation. Integration: Test multiple components together. E2E: Test entire user flows. Pyramid: Lots of unit, some integration, few E2E.

**Difficulty:** 🟢 Easy
**Tags:** #testing #quality #types
**Frequency:** ⭐⭐⭐⭐

---

## 🎯 How to Use These Cards

1. **First Pass:** Go through all 50, mark the ones you struggle with
2. **Focus on Weak Areas:** Review marked cards daily
3. **Spaced Repetition:** Review Day 1, 3, 7, 14, 30
4. **Before Interview:** Quick 25-minute review of all 50
5. **Explain Out Loud:** Teaching solidifies understanding

---

## 📊 Your Progress

- [ ] Reviewed all 50 cards once
- [ ] Can explain 40+ without looking
- [ ] Reviewed weak cards 3+ times
- [ ] Can explain all 50 confidently
- [ ] Ready for interview!

---

[← Back to Flashcards](../README.md) | [Next: Pre-Interview 30 →](./pre-interview-30.md)
