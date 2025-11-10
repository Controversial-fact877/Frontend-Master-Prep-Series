# Screen Readers and Assistive Technology

> ARIA attributes, screen reader testing, semantic HTML, and accessible patterns.

---

## Question 1: ARIA Roles and Attributes

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Google, Meta, Airbnb

### Question
What are ARIA roles and when should you use them?

### Answer

**ARIA (Accessible Rich Internet Applications)** - Provides accessibility information to assistive technologies.

```html
<!-- ❌ Bad: Using div without semantics -->
<div onclick="toggleMenu()">Menu</div>

<!-- ✅ Better: Using button -->
<button onclick="toggleMenu()">Menu</button>

<!-- ✅ When needed: ARIA for custom widgets -->
<div
  role="button"
  tabindex="0"
  aria-label="Toggle menu"
  aria-expanded="false"
  onclick="toggleMenu()"
  onkeypress="handleKeyPress(event)"
>
  Menu
</div>

<!-- Common ARIA attributes -->
<button aria-label="Close dialog">×</button>
<input aria-describedby="password-hint" />
<div role="alert" aria-live="polite">Changes saved</div>
<nav aria-label="Main navigation">...</nav>
```

**Key Rules:**
1. First rule: Don't use ARIA (use semantic HTML)
2. Only use ARIA when semantic HTML isn't enough
3. Don't change native semantics

### Resources
- [WAI-ARIA Basics](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics)

---

