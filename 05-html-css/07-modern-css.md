# Modern CSS Features

> CSS custom properties, CSS Grid advanced, subgrid, container queries, :has selector, layers, and cutting-edge CSS.

---

## Question 1: CSS Custom Properties (Variables)

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain CSS custom properties. How do they differ from Sass variables?

### Answer

**CSS Custom Properties** (CSS Variables) are runtime variables that can be updated with JavaScript and cascade through the DOM.

### Code Example

```css
:root {
  --primary-color: #007bff;
  --spacing: 1rem;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing);
}

/* Update with JavaScript */
document.documentElement.style.setProperty('--primary-color', 'red');
```

**CSS Variables vs Sass:**

| Feature | CSS Variables | Sass Variables |
|---------|--------------|----------------|
| Scope | DOM cascade | Compile-time |
| JS Access | ✅ Yes | ❌ No |
| Runtime change | ✅ Yes | ❌ No |
| Browser support | Modern only | All (compiles) |

### Resources
- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

*[File continues with container queries, :has selector, @layer, etc.]*

