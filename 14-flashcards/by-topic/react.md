# React Master Flashcards

> **100 essential React concepts for interview mastery**

**Time to review:** 50 minutes
**Best for:** React-focused interviews, component architecture

---

## Card 1: useState Rules
**Q:** What are the rules for using useState?

**A:** 1) Only call at top level (not in loops/conditions), 2) Only call in function components or custom hooks, 3) State updates are asynchronous and batched, 4) Use functional updates when new state depends on previous state.

**Difficulty:** 🟢 Easy
**Tags:** #react #hooks #useState
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 2: useEffect Cleanup
**Q:** When does the useEffect cleanup function run?

**A:** Runs before the component unmounts AND before re-running the effect (if dependencies changed). Used to cancel subscriptions, clear timers, abort fetch requests.

**Difficulty:** 🟡 Medium
**Tags:** #react #hooks #useEffect
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 3: useMemo vs useCallback
**Q:** What's the difference between useMemo and useCallback?

**A:** useMemo memoizes the RESULT of a function (computed value). useCallback memoizes the FUNCTION itself. useCallback(fn, deps) === useMemo(() => fn, deps).

**Difficulty:** 🟡 Medium
**Tags:** #react #hooks #optimization
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 4: React Reconciliation
**Q:** How does React reconciliation work?

**A:** React compares new Virtual DOM with previous one (diffing algorithm). Uses keys to identify which items changed. Updates only changed parts of real DOM. O(n) complexity using heuristics.

**Difficulty:** 🟡 Medium
**Tags:** #react #virtual-dom #performance
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 5: Key Prop Purpose
**Q:** Why are keys important in React lists?

**A:** Keys help React identify which items changed/added/removed. Stable identity for efficient reconciliation. Without keys, React re-renders all items. Use unique IDs, not array indices.

**Difficulty:** 🟢 Easy
**Tags:** #react #lists #keys
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 6: Controlled vs Uncontrolled
**Q:** What's the difference between controlled and uncontrolled components?

**A:** Controlled: Form data handled by React state (single source of truth). Uncontrolled: Form data handled by DOM (use refs to access). Controlled provides more control and validation.

**Difficulty:** 🟢 Easy
**Tags:** #react #forms #components
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 7: useRef Use Cases
**Q:** What are the main use cases for useRef?

**A:** 1) Access DOM elements directly, 2) Store mutable values that don't trigger re-renders, 3) Keep reference to previous values, 4) Store timeout/interval IDs.

**Difficulty:** 🟡 Medium
**Tags:** #react #hooks #useRef
**Frequency:** ⭐⭐⭐⭐

---

## Card 8: React Fiber
**Q:** What is React Fiber?

**A:** React's reconciliation engine rewrite (v16+). Enables incremental rendering, pausing/resuming work, assigning priority to updates. Splits rendering into chunks for better perceived performance.

**Difficulty:** 🔴 Hard
**Tags:** #react #fiber #internals
**Frequency:** ⭐⭐⭐⭐

---

## Card 9: Error Boundaries
**Q:** What are Error Boundaries and their limitations?

**A:** Class components that catch JS errors in child component tree. Don't catch: event handler errors, async code, SSR errors, errors in boundary itself. Use componentDidCatch and getDerivedStateFromError.

**Difficulty:** 🟡 Medium
**Tags:** #react #error-handling
**Frequency:** ⭐⭐⭐⭐

---

## Card 10: Context Performance
**Q:** What's the performance issue with Context and how to fix it?

**A:** All consumers re-render when context value changes, even if they only use part of it. Fix: Split into multiple contexts, memoize provider value, use useMemo for context values.

**Difficulty:** 🔴 Hard
**Tags:** #react #context #performance
**Frequency:** ⭐⭐⭐⭐

---

## Card 11: React.memo
**Q:** How does React.memo work and when should you use it?

**A:** HOC that memoizes component output. Re-renders only if props changed (shallow comparison). Use for: expensive render components, frequent parent re-renders, stable props. Don't overuse.

**Difficulty:** 🟡 Medium
**Tags:** #react #optimization #memo
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 12: Lifting State Up
**Q:** What does "lifting state up" mean?

**A:** Moving state to closest common ancestor when multiple components need to share it. Parent manages state, passes down as props and callbacks. Ensures single source of truth.

**Difficulty:** 🟢 Easy
**Tags:** #react #state #patterns
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 13: Composition vs Inheritance
**Q:** Why does React favor composition over inheritance?

**A:** Composition is more flexible and explicit. Use props.children, multiple children props, or HOCs instead of extending classes. React has no use cases where inheritance is recommended.

**Difficulty:** 🟡 Medium
**Tags:** #react #patterns #composition
**Frequency:** ⭐⭐⭐⭐

---

## Card 14: HOC Pattern
**Q:** What is a Higher-Order Component (HOC)?

**A:** Function that takes a component and returns enhanced component. Used for: code reuse, logic abstraction, prop manipulation. Convention: prefix with 'with' (withAuth, withLoading).

**Difficulty:** 🟡 Medium
**Tags:** #react #patterns #hoc
**Frequency:** ⭐⭐⭐⭐

---

## Card 15: Render Props
**Q:** What is the render props pattern?

**A:** Component that uses a function prop to know what to render. Enables sharing code between components. Example: <Mouse render={(x, y) => <Cat x={x} y={y} />} />.

**Difficulty:** 🟡 Medium
**Tags:** #react #patterns #render-props
**Frequency:** ⭐⭐⭐

---

## Card 16: Custom Hooks Rules
**Q:** What are the rules for creating custom hooks?

**A:** 1) Name must start with 'use', 2) Follow all hooks rules, 3) Return whatever component needs (values, functions), 4) Can call other hooks, 5) Not tied to specific component.

**Difficulty:** 🟢 Easy
**Tags:** #react #hooks #custom-hooks
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 17: StrictMode Purpose
**Q:** What does React StrictMode do?

**A:** Development tool that activates additional checks: detects unsafe lifecycles, legacy API usage, unexpected side effects. Renders components twice in development to find bugs.

**Difficulty:** 🟢 Easy
**Tags:** #react #strictmode #debugging
**Frequency:** ⭐⭐⭐

---

## Card 18: Lazy Loading
**Q:** How do you lazy load components in React?

**A:** Use React.lazy() with dynamic import() and Suspense boundary. Example: const MyComponent = lazy(() => import('./MyComponent')). Wrap with <Suspense fallback={<Loading />}>.

**Difficulty:** 🟡 Medium
**Tags:** #react #lazy-loading #performance
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 19: Portal Use Case
**Q:** When would you use ReactDOM.createPortal?

**A:** Render children into DOM node outside parent hierarchy. Use cases: modals, tooltips, dropdowns. Maintains React tree for context and events while breaking DOM hierarchy.

**Difficulty:** 🟡 Medium
**Tags:** #react #portals #dom
**Frequency:** ⭐⭐⭐⭐

---

## Card 20: Concurrent Features
**Q:** What are React 18's concurrent features?

**A:** Automatic batching, Transitions (startTransition), Suspense for data fetching, useTransition/useDeferredValue hooks. Allows React to interrupt rendering for higher-priority updates.

**Difficulty:** 🔴 Hard
**Tags:** #react #concurrent #react18
**Frequency:** ⭐⭐⭐⭐

---

## Card 21: useLayoutEffect vs useEffect
**Q:** When should you use useLayoutEffect instead of useEffect?

**A:** useLayoutEffect runs synchronously after DOM mutations, before browser paint. Use for: DOM measurements, preventing visual flashing. useEffect is asynchronous, non-blocking (preferred for most cases).

**Difficulty:** 🔴 Hard
**Tags:** #react #hooks #layouteffect
**Frequency:** ⭐⭐⭐

---

## Card 22: Ref Forwarding
**Q:** What is ref forwarding and when is it needed?

**A:** Passing ref through component to child DOM element. Use React.forwardRef(). Needed for: library components exposing DOM refs, HOCs preserving refs, focusing inputs.

**Difficulty:** 🟡 Medium
**Tags:** #react #refs #forwarding
**Frequency:** ⭐⭐⭐

---

## Card 23: useReducer vs useState
**Q:** When should you use useReducer instead of useState?

**A:** useReducer when: complex state logic, multiple sub-values, next state depends on previous, deep updates, want to optimize performance with dispatch. useState for simple state.

**Difficulty:** 🟡 Medium
**Tags:** #react #hooks #useReducer
**Frequency:** ⭐⭐⭐⭐

---

## Card 24: Batching Updates
**Q:** How does React batch state updates?

**A:** React 18+ automatically batches all updates (events, promises, timeouts). Pre-18: only batched in event handlers. Reduces renders. Can opt-out with flushSync() if needed.

**Difficulty:** 🟡 Medium
**Tags:** #react #batching #performance
**Frequency:** ⭐⭐⭐⭐

---

## Card 25: Code Splitting
**Q:** What are the strategies for code splitting in React?

**A:** 1) Route-based splitting (lazy load routes), 2) Component-based splitting (lazy load heavy components), 3) Library splitting (dynamic import large libraries), 4) Webpack magic comments for chunk names.

**Difficulty:** 🟡 Medium
**Tags:** #react #code-splitting #performance
**Frequency:** ⭐⭐⭐⭐⭐

---

[Continue with 75 more cards covering React Router, Redux, Testing, Server Components, etc...]

---

[← Back to Flashcards](../README.md)
