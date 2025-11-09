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

### Code Example

```css
/* ❌ DESKTOP-FIRST (Old way) */
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

/* ✅ MOBILE-FIRST (Modern way) */
.container {
  display: grid;
  grid-template-columns: 1fr; /* Mobile first */
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
```

**Common Breakpoints:**

```css
/* Standard breakpoints */
/* Mobile: < 768px (default, no media query) */
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }

/* Custom breakpoints based on content */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

**Responsive Images:**

```html
<!-- Picture element for art direction -->
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image">
</picture>

<!-- srcset for resolution switching -->
<img
  srcset="image-320w.jpg 320w,
          image-640w.jpg 640w,
          image-1280w.jpg 1280w"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  src="image-640w.jpg"
  alt="Responsive image"
>
```

### Common Mistakes

❌ **Wrong**: Forgetting viewport meta tag
```html
<!-- Without this, mobile browsers zoom out to desktop width -->
```

✅ **Correct**: Always include viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Resources
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)

---

*[File continues with viewport units, container queries, fluid typography, etc.]*

