# Chrome DevTools and Debugging

> DevTools features, debugging techniques, performance profiling, network debugging, and advanced debugging strategies.

---

## Question 1: Chrome DevTools Performance Profiling

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Netflix

### Question
How do you use Chrome DevTools to identify performance issues?

### Answer

**Key Tools:**
1. Performance tab (record timeline)
2. Lighthouse (automated audits)
3. Coverage tab (unused code)
4. Network tab (slow requests)
5. Memory tab (memory leaks)

```javascript
// Mark performance events
performance.mark('start-operation');
// ... expensive operation
performance.mark('end-operation');
performance.measure('operation-duration', 'start-operation', 'end-operation');

// View in DevTools Performance tab
```

### Resources
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

