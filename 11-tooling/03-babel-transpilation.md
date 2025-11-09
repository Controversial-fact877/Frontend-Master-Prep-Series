# Babel and JavaScript Transpilation

> Babel fundamentals, presets, plugins, polyfills, and browser targeting.

---

## Question 1: What is Babel and Why Use It?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐
**Time:** 7 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain Babel's role in modern JavaScript development.

### Answer

**Babel** transpiles modern JavaScript (ES6+) to backwards-compatible versions for older browsers.

```javascript
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead",
      "useBuiltIns": "usage",
      "corejs": 3
    }],
    "@babel/preset-react"
  ]
}

// Input (ES6+)
const greet = (name) => `Hello, ${name}`;

// Output (ES5)
var greet = function(name) {
  return "Hello, " + name;
};
```

### Resources
- [Babel Docs](https://babeljs.io/docs/)

---

