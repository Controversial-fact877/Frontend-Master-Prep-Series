# Responsive Design

> Media queries, mobile-first approach, viewport units, responsive images, container queries, and modern responsive patterns.

---

## Question 1: Mobile-First Responsive Design

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Amazon, Airbnb

### Question
What is mobile-first design? How do you implement it with media queries?

### Answer

**Mobile-first** means designing for mobile devices first, then progressively enhancing for larger screens using `min-width` media queries.

**Key Points:**

1. **Start Small** - Base styles for smallest screens, add complexity for larger
2. **min-width Over max-width** - Build up instead of breaking down
3. **Performance** - Mobile users load minimal CSS first
4. **Accessibility** - Forces focus on essential content
5. **Future-Proof** - Easier to add features than remove them

### Code Example

```css
/* =========================================== */
/* 1. MOBILE-FIRST APPROACH */
/* =========================================== */

/* ❌ DESKTOP-FIRST (Old way - avoid) */
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Desktop first */
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: repeat(2, 1fr); /* Override for tablet */
  }
}

@media (max-width: 480px) {
  .container {
    grid-template-columns: 1fr; /* Override for mobile */
  }
}

/* ✅ MOBILE-FIRST (Modern way - recommended) */
.container {
  display: grid;
  grid-template-columns: 1fr; /* Mobile first (base) */
}

@media (min-width: 480px) {
  .container {
    grid-template-columns: repeat(2, 1fr); /* Tablet */
  }
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: repeat(4, 1fr); /* Desktop */
  }
}

/*
MOBILE-FIRST BENEFITS:
- Simpler code (add vs remove)
- Better performance (progressive enhancement)
- Accessibility first
*/
```

```css
/* =========================================== */
/* 2. COMMON BREAKPOINTS */
/* =========================================== */

/* Mobile first breakpoints */
/* Base: Mobile (< 480px) */

/* Small devices (landscape phones, 480px and up) */
@media (min-width: 480px) { }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { }

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) { }

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) { }

/* Using CSS custom properties for consistency */
:root {
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

```css
/* =========================================== */
/* 3. PRACTICAL EXAMPLE */
/* =========================================== */

/* Typography - mobile first */
body {
  font-size: 16px; /* Mobile base */
  line-height: 1.5;
}

@media (min-width: 768px) {
  body {
    font-size: 18px; /* Tablet */
  }
}

@media (min-width: 1024px) {
  body {
    font-size: 20px; /* Desktop */
  }
}

/* Navigation - mobile first */
.nav {
  display: flex;
  flex-direction: column; /* Stacked on mobile */
}

@media (min-width: 768px) {
  .nav {
    flex-direction: row; /* Horizontal on tablet+ */
  }
}

/* Layout - mobile first */
.layout {
  display: grid;
  grid-template-areas:
    "header"
    "content"
    "sidebar"
    "footer";
}

@media (min-width: 1024px) {
  .layout {
    grid-template-areas:
      "header header"
      "content sidebar"
      "footer footer";
    grid-template-columns: 1fr 300px;
  }
}
```

### Common Mistakes

❌ **Wrong**: Desktop-first with max-width
```css
.element {
  width: 1200px; /* Desktop first */
}

@media (max-width: 768px) {
  .element {
    width: 100%; /* Undo desktop styles */
  }
}
```

✅ **Correct**: Mobile-first with min-width
```css
.element {
  width: 100%; /* Mobile first */
}

@media (min-width: 768px) {
  .element {
    width: 1200px; /* Add desktop styles */
  }
}
```

### Follow-up Questions
1. "What are the standard breakpoints?"
2. "How do you test responsive designs?"
3. "What's the difference between responsive and adaptive design?"
4. "How do you handle images in responsive design?"

### Resources
- [MDN: Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Responsive Design Best Practices](https://web.dev/responsive-web-design-basics/)

---

## Question 2: Viewport Units and Responsive Typography

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain viewport units (vw, vh, vmin, vmax). How do you create fluid typography?

### Answer

**Viewport units** are relative to the browser viewport size, enabling truly responsive designs.

**Key Points:**

1. **vw (Viewport Width)** - 1vw = 1% of viewport width
2. **vh (Viewport Height)** - 1vh = 1% of viewport height
3. **vmin** - 1vmin = 1% of smaller viewport dimension
4. **vmax** - 1vmax = 1% of larger viewport dimension
5. **Fluid Typography** - Combines viewport units with calc() for scalable text

### Code Example

```css
/* =========================================== */
/* 1. VIEWPORT UNITS BASICS */
/* =========================================== */

.full-screen {
  width: 100vw; /* Full viewport width */
  height: 100vh; /* Full viewport height */
}

.half-screen {
  width: 50vw; /* Half viewport width */
  height: 50vh; /* Half viewport height */
}

.responsive-text {
  font-size: 5vw; /* Scales with viewport width */
}

/*
VIEWPORT DIMENSIONS (1920x1080 screen):
- 1vw = 19.2px
- 1vh = 10.8px
- 1vmin = 10.8px (smaller dimension)
- 1vmax = 19.2px (larger dimension)
*/
```

```css
/* =========================================== */
/* 2. FLUID TYPOGRAPHY (Modern Approach) */
/* =========================================== */

/* Basic fluid typography */
h1 {
  font-size: calc(1.5rem + 2vw);
  /* Minimum: 1.5rem, grows with viewport */
}

/* Clamped fluid typography (best) */
h1 {
  font-size: clamp(2rem, 5vw, 5rem);
  /* Min: 2rem, Preferred: 5vw, Max: 5rem */
}

/* Full responsive type scale */
:root {
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.5vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --font-size-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
  --font-size-xl: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  --font-size-2xl: clamp(2.25rem, 2rem + 1.5vw, 3.5rem);
}

h1 { font-size: var(--font-size-2xl); }
h2 { font-size: var(--font-size-xl); }
h3 { font-size: var(--font-size-lg); }
p { font-size: var(--font-size-base); }
small { font-size: var(--font-size-sm); }
```

```css
/* =========================================== */
/* 3. RESPONSIVE SPACING */
/* =========================================== */

.container {
  padding: clamp(1rem, 5vw, 3rem);
  /* Padding scales between 1rem and 3rem */
}

.section {
  margin-bottom: clamp(2rem, 10vh, 6rem);
  /* Vertical spacing based on viewport height */
}

/* Fluid gap */
.grid {
  display: grid;
  gap: clamp(1rem, 3vw, 2rem);
}
```

```css
/* =========================================== */
/* 4. HERO SECTION WITH VIEWPORT UNITS */
/* =========================================== */

.hero {
  min-height: 100vh; /* Full viewport height */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vh, 4rem);
}

.hero__title {
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1.1;
}

.hero__subtitle {
  font-size: clamp(1.25rem, 3vw, 2rem);
  margin-top: clamp(1rem, 3vh, 2rem);
}
```

### Common Mistakes

❌ **Wrong**: Using vh without accounting for mobile browsers
```css
.section {
  height: 100vh; /* ❌ Doesn't account for mobile browser UI */
}
```

✅ **Correct**: Use modern viewport units or fallback
```css
.section {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height (modern) */
}
```

❌ **Wrong**: Unbounded viewport units
```css
.text {
  font-size: 10vw; /* ❌ Can be huge on large screens */
}
```

✅ **Correct**: Clamp values
```css
.text {
  font-size: clamp(2rem, 10vw, 5rem); /* ✅ Bounded */
}
```

### Follow-up Questions
1. "What are dvh, svh, and lvh viewport units?"
2. "How do you prevent horizontal scrollbars with 100vw?"
3. "What's the accessibility impact of viewport units?"
4. "How do you calculate fluid typography values?"

### Resources
- [MDN: Viewport Units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths)
- [Fluid Typography](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)

---

## Question 3: Container Queries - The Future of Responsive Design

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta

### Question
What are container queries? How do they differ from media queries?

### Answer

**Container Queries** allow components to respond to their container's size, not just the viewport size.

**Key Points:**

1. **Component-Level Responsive** - Components adapt to container, not viewport
2. **True Modularity** - Same component works in any context
3. **container-type Property** - Establishes query container
4. **@container Rule** - Query syntax similar to @media
5. **Better Than Media Queries** - For component-based architectures

### Code Example

```css
/* =========================================== */
/* 1. CONTAINER QUERY BASICS */
/* =========================================== */

.container {
  container-type: inline-size; /* Enable container queries */
  container-name: card-container; /* Optional name */
}

/* Component responds to container size, not viewport */
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container (min-width: 600px) {
  .card {
    grid-template-columns: 300px 1fr;
  }
}

/*
RESULT: Same .card component adapts differently
based on where it's placed!

Small sidebar: vertical card
Main content: horizontal card
Wide section: expanded card
*/
```

```css
/* =========================================== */
/* 2. MEDIA QUERIES VS CONTAINER QUERIES */
/* =========================================== */

/* ❌ MEDIA QUERIES: Viewport-based */
.product-card {
  display: block;
}

@media (min-width: 768px) {
  .product-card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}

/*
PROBLEM: Card always horizontal on tablets,
even in narrow sidebar!
*/

/* ✅ CONTAINER QUERIES: Container-based */
.products-container {
  container-type: inline-size;
}

.product-card {
  display: block; /* Base: stacked */
}

@container (min-width: 500px) {
  .product-card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}

/*
SOLUTION: Card adapts to available space,
works in sidebar, main, modals, etc!
*/
```

```css
/* =========================================== */
/* 3. PRACTICAL EXAMPLE */
/* =========================================== */

.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  padding: 1rem;
  border: 1px solid #ddd;
}

.card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.card__title {
  font-size: 1.25rem;
}

/* Small container: stacked layout */
@container card (min-width: 300px) {
  .card__title {
    font-size: 1.5rem;
  }
}

/* Medium container: side-by-side */
@container card (min-width: 500px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
  }

  .card__image {
    aspect-ratio: 1 / 1;
  }

  .card__title {
    font-size: 1.75rem;
  }
}

/* Large container: expanded */
@container card (min-width: 700px) {
  .card {
    grid-template-columns: 300px 1fr;
    gap: 2rem;
  }

  .card__title {
    font-size: 2rem;
  }
}
```

```css
/* =========================================== */
/* 4. CONTAINER QUERY UNITS */
/* =========================================== */

.container {
  container-type: inline-size;
}

.child {
  /* Container query length units */
  font-size: 5cqw; /* 5% of container width */
  padding: 2cqh; /* 2% of container height */
  margin: 1cqi; /* 1% of container inline size */
  gap: 1cqb; /* 1% of container block size */

  /* Min/Max */
  width: 50cqmin; /* 50% of smaller container dimension */
  height: 50cqmax; /* 50% of larger container dimension */
}
```

### Common Mistakes

❌ **Wrong**: Not setting container-type
```css
.container {
  /* ❌ Missing container-type */
}

@container (min-width: 500px) {
  .card { /* Won't work! */
    display: grid;
  }
}
```

✅ **Correct**: Define container
```css
.container {
  container-type: inline-size; /* ✅ Required */
}

@container (min-width: 500px) {
  .card { /* ✅ Works */
    display: grid;
  }
}
```

### Follow-up Questions
1. "What's the browser support for container queries?"
2. "Can you nest container queries?"
3. "What's the difference between size, inline-size, and normal container-type?"
4. "How do container queries affect performance?"

### Resources
- [MDN: Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [CSS Container Queries Guide](https://ishadeed.com/article/css-container-query-guide/)

---

## Summary Table

| Topic | Use Case | Key Property |
|-------|----------|-------------|
| Mobile-First | Progressive enhancement | @media (min-width) |
| Viewport Units | Fluid sizing | vw, vh, clamp() |
| Container Queries | Component responsiveness | container-type, @container |

---

**Next Topics**: Animations, Transitions, CSS Architecture
