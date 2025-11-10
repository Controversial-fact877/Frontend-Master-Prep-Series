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

**Fiber** is React's reconciliation algorithm rewrite that enables:
- Incremental rendering
- Pause/resume work
- Prioritize updates
- Concurrent features

**Key Concepts:**
- Work can be split into chunks
- Different priorities for updates
- Better user experience (no blocking)

### Resources
- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)

---

