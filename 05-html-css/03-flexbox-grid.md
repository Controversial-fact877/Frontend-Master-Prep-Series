# Flexbox and CSS Grid

> Complete guide to Flexbox and CSS Grid layouts, when to use each, common patterns, and modern layout techniques.

---

## Question 1: Flexbox Fundamentals - When and How to Use It

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Uber, Airbnb

### Question
Explain Flexbox. What problems does it solve? Explain main axis, cross axis, and common flex properties.

### Answer

**Flexbox** is a one-dimensional layout method for arranging items in rows or columns. Items flex (grow/shrink) to fill available space.

**Main Concepts:**
- **Flex Container** - Parent with `display: flex`
- **Flex Items** - Direct children of flex container
- **Main Axis** - Primary axis (default: horizontal)
- **Cross Axis** - Perpendicular to main axis

### Code Example

```css
/* BASIC FLEXBOX */
.container {
  display: flex; /* Enable flexbox */

  /* Main axis direction */
  flex-direction: row; /* default: left to right */
  /* row-reverse | column | column-reverse */

  /* Wrap items */
  flex-wrap: nowrap; /* default: single line */
  /* wrap | wrap-reverse */

  /* Shorthand */
  flex-flow: row wrap; /* direction + wrap */
}

/* ALIGNMENT */
.container {
  /* Main axis alignment */
  justify-content: flex-start; /* default */
  /* flex-end | center | space-between | space-around | space-evenly */

  /* Cross axis alignment */
  align-items: stretch; /* default */
  /* flex-start | flex-end | center | baseline */

  /* Multi-line cross axis */
  align-content: stretch; /* default */
  /* Same values as justify-content */
}

/* FLEX ITEMS */
.item {
  /* Growth factor */
  flex-grow: 0; /* default: don't grow */

  /* Shrink factor */
  flex-shrink: 1; /* default: can shrink */

  /* Base size */
  flex-basis: auto; /* default: content size */

  /* Shorthand */
  flex: 0 1 auto; /* grow shrink basis */
  flex: 1; /* Common: flex-grow: 1, shrink: 1, basis: 0 */

  /* Override container alignment */
  align-self: auto; /* flex-start | flex-end | center | baseline | stretch */

  /* Order */
  order: 0; /* default: source order */
}
```

**Common Patterns:**

```html
<!-- CENTERING (Most Famous Flexbox Use) -->
<div class="center">
  <div class="content">Perfectly Centered</div>
</div>

<style>
.center {
  display: flex;
  justify-content: center; /* Horizontal center */
  align-items: center;     /* Vertical center */
  height: 100vh;
}
</style>

<!-- NAVBAR -->
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
  <button>Login</button>
</nav>

<style>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Space between logo and nav */
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
}
</style>

<!-- EQUAL HEIGHT CARDS -->
<div class="card-container">
  <div class="card">Short content</div>
  <div class="card">Much longer content that spans multiple lines</div>
  <div class="card">Medium content</div>
</div>

<style>
.card-container {
  display: flex;
  gap: 1rem;
}

.card {
  flex: 1; /* Equal width, equal height automatically! */
  padding: 1rem;
  border: 1px solid #ccc;
}
</style>

<!-- SIDEBAR LAYOUT -->
<div class="layout">
  <aside class="sidebar">Sidebar</aside>
  <main class="content">Main Content</main>
</div>

<style>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  flex-basis: 250px; /* Fixed width */
  flex-shrink: 0;     /* Don't shrink */
}

.content {
  flex: 1; /* Take remaining space */
}
</style>
```

### Common Mistakes

❌ **Wrong**: Using Flexbox for 2D layouts
```css
/* ❌ Flexbox not ideal for complex grids */
.grid {
  display: flex;
  flex-wrap: wrap;
}

.item {
  flex-basis: 33.33%; /* Trying to make grid - use CSS Grid! */
}
```

✅ **Correct**: Use CSS Grid for 2D layouts
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

### Follow-up Questions
1. "What's the difference between Flexbox and Grid?"
2. "How does flex-basis interact with width?"
3. "What's the difference between space-between and space-evenly?"
4. "Can you nest flex containers?"

### Resources
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [CSS Tricks: Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Flexbox Froggy](https://flexboxfroggy.com/) - Interactive tutorial

---

## Question 2: CSS Grid - Two-Dimensional Layouts

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 12-15 minutes
**Companies:** Google, Meta, Amazon, Airbnb

### Question
Explain CSS Grid. How does it differ from Flexbox? Demonstrate common grid patterns.

### Answer

**CSS Grid** is a two-dimensional layout system for rows AND columns simultaneously. More powerful than Flexbox for complex layouts.

### Code Example

```css
/* BASIC GRID */
.container {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 200px 200px; /* 3 columns, fixed width */
  grid-template-columns: 1fr 1fr 1fr; /* 3 equal columns */
  grid-template-columns: repeat(3, 1fr); /* Shorthand */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive */

  /* Define rows */
  grid-template-rows: 100px auto 100px; /* Header, content, footer */

  /* Gaps */
  gap: 1rem; /* row and column gap */
  row-gap: 1rem;
  column-gap: 1rem;
}

/* GRID ITEMS - PLACEMENT */
.item {
  /* By line numbers */
  grid-column-start: 1;
  grid-column-end: 3; /* Span columns 1-2 */

  /* Shorthand */
  grid-column: 1 / 3; /* start / end */
  grid-column: 1 / span 2; /* start / span */

  /* Rows */
  grid-row: 1 / 3;

  /* Area shorthand */
  grid-area: 1 / 1 / 3 / 3; /* row-start / col-start / row-end / col-end */
}
```

**Common Patterns:**

```css
/* HOLY GRAIL LAYOUT */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }

/* RESPONSIVE CARD GRID */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
/* Automatically fits cards, wraps to new rows */

/* MAGAZINE LAYOUT */
.magazine {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 1rem;
}

.feature {
  grid-column: span 2; /* 2 columns wide */
  grid-row: span 2;    /* 2 rows tall */
}

.small {
  grid-column: span 1;
  grid-row: span 1;
}
```

**Flexbox vs Grid Decision Tree:**

```css
/* USE FLEXBOX WHEN: */
- One-dimensional (row OR column)
- Content-first (size based on content)
- Small-scale layouts
- Components (navbar, button groups)

/* USE GRID WHEN: */
- Two-dimensional (rows AND columns)
- Layout-first (defined structure)
- Large-scale layouts
- Page layouts, complex grids

/* EXAMPLE: Flexbox inside Grid */
.page-layout {
  display: grid; /* Grid for page structure */
  grid-template-columns: 250px 1fr;
}

.navbar {
  display: flex; /* Flex for component */
  justify-content: space-between;
}
```

### Common Mistakes

❌ **Wrong**: Using Grid for simple one-dimensional layouts
```css
.simple-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Overkill */
}
```

✅ **Correct**: Use Flexbox for simple layouts
```css
.simple-row {
  display: flex;
  gap: 1rem;
}

.item {
  flex: 1;
}
```

### Follow-up Questions
1. "What's the difference between fr unit and percentage?"
2. "How does auto-fit differ from auto-fill?"
3. "Can you nest grids?"
4. "How do you handle responsive grid layouts?"

### Resources
- [MDN: CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Tricks: Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Grid Garden](https://cssgridgarden.com/) - Interactive tutorial

---

*[File continues with advanced grid techniques, alignment, sizing, etc.]*

