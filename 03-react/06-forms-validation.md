# React Forms and Validation

> Controlled components, form libraries (React Hook Form, Formik), validation strategies, and form best practices.

---

## Question 1: Controlled vs Uncontrolled Components

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Meta, Google, Amazon

### Question
What's the difference between controlled and uncontrolled components in React?

### Answer

**Controlled** - React state controls input value
**Uncontrolled** - DOM controls input value (use refs)

```jsx
// Controlled Component (React way)
function ControlledForm() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}

// Uncontrolled Component (rare use)
function UncontrolledForm() {
  const inputRef = useRef();

  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };

  return <input ref={inputRef} defaultValue="initial" />;
}
```

**When to Use:**
- **Controlled**: Most cases, validation, conditional rendering
- **Uncontrolled**: File inputs, integrating non-React libraries

### Resources
- [React Forms](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)

---

