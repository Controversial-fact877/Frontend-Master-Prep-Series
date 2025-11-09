# CSS Architecture

> BEM methodology, CSS modules, CSS-in-JS, preprocessors, PostCSS, and modern CSS organization strategies.

---

## Question 1: BEM Methodology

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Airbnb

### Question
What is BEM? Explain Block, Element, Modifier.

### Answer

**BEM** (Block Element Modifier) is a naming convention for CSS classes that makes code more maintainable and understandable.

**Structure:** `block__element--modifier`

### Code Example

```html
<!-- BLOCK: Standalone component -->
<div class="card">

  <!-- ELEMENT: Part of block -->
  <h2 class="card__title">Title</h2>
  <p class="card__description">Description</p>
  <button class="card__button">Action</button>

  <!-- MODIFIER: Variation -->
  <button class="card__button card__button--primary">Primary</button>
</div>

<style>
/* Block */
.card {
  border: 1px solid #ccc;
  padding: 1rem;
}

/* Elements */
.card__title { font-size: 1.5rem; }
.card__description { color: #666; }
.card__button { padding: 0.5rem 1rem; }

/* Modifiers */
.card__button--primary {
  background: blue;
  color: white;
}
</style>
```

### Resources
- [BEM Methodology](http://getbem.com/)

---

*[File continues with CSS modules, styled-components, SASS, etc.]*

