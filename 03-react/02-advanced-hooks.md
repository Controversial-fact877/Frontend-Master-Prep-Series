# React Advanced Hooks

> useCallback, useMemo, useRef, useImperativeHandle, useLayoutEffect, useId, and performance optimization hooks.

---

## Question 1: useCallback vs useMemo

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Amazon, Airbnb

### Question
Explain the difference between useCallback and useMemo. When should you use each?

### Answer

**useCallback** - Memoizes functions
**useMemo** - Memoizes values

```jsx
// useCallback - Memoize function reference
const handleClick = useCallback(() => {
  console.log('Clicked', count);
}, [count]); // New function only when count changes

// useMemo - Memoize computed value
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]); // Recompute only when a or b changes

// When to use:
// useCallback: Passing callbacks to optimized child components
// useMemo: Expensive calculations, avoiding re-renders
```

**Practical Example:**

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ Without useCallback - new function every render
  const handleClick = () => {
    console.log('Clicked');
  };

  // ✅ With useCallback - same function reference
  const memoizedHandleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // No dependencies - same function always

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <MemoizedChild onClick={memoizedHandleClick} />
    </>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});
// Without useCallback: Child re-renders on every Parent render
// With useCallback: Child only renders when callback actually changes
```

### Resources
- [React Hooks API Reference](https://react.dev/reference/react/hooks)

---

*[File continues with useRef, useImperativeHandle, etc.]*

