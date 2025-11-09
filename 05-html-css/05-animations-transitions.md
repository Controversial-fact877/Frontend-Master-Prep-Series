# CSS Animations and Transitions

> Transitions, animations, keyframes, transforms, performance considerations, and modern animation techniques.

---

## Question 1: CSS Transitions vs Animations

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Airbnb

### Question
What's the difference between CSS transitions and animations? When should you use each?

### Answer

**Transitions** - Animate between two states (A → B)
**Animations** - Complex multi-step animations with keyframes

### Code Example

```css
/* TRANSITION - Simple state change */
.button {
  background: blue;
  transition: background 0.3s ease;
}

.button:hover {
  background: red;
}

/* ANIMATION - Complex multi-step */
.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

**Performance:**

```css
/* ✅ GPU-accelerated properties (smooth) */
transform, opacity

/* ❌ Avoid animating (causes layout recalculation) */
width, height, top, left, margin, padding
```

### Resources
- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [High Performance Animations](https://web.dev/animations-guide/)

---

*[File continues with keyframes, timing functions, will-change, etc.]*

