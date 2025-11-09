# CSS Fundamentals

> Box model, display properties, positioning, specificity, cascade, inheritance, and CSS core concepts.

---

## Question 1: Explain the CSS Box Model

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Airbnb

### Question
What is the CSS box model? Explain content, padding, border, and margin. What's the difference between `box-sizing: content-box` and `border-box`?

### Answer

The **CSS Box Model** describes how elements are rendered as rectangular boxes with content, padding, border, and margin.

**Components (inside to outside):**
1. **Content** - Actual content (text, images)
2. **Padding** - Space between content and border
3. **Border** - Border around padding
4. **Margin** - Space outside border

### Code Example

```css
/* BOX MODEL VISUALIZATION */
.box {
  /* Content area */
  width: 200px;
  height: 100px;

  /* Padding (inside border) */
  padding: 20px;

  /* Border */
  border: 5px solid black;

  /* Margin (outside border) */
  margin: 10px;
}

/*
TOTAL DIMENSIONS (content-box):
================================
Width: 200px (content) + 40px (padding) + 10px (border) = 250px
Height: 100px (content) + 40px (padding) + 10px (border) = 150px
+ 10px margin on all sides (doesn't affect element size)

Visual:
┌─────────────── Margin (10px) ────────────────┐
│ ┌─────────── Border (5px) ──────────────┐   │
│ │ ┌──────── Padding (20px) ────────┐   │   │
│ │ │                                  │   │   │
│ │ │    Content (200px × 100px)      │   │   │
│ │ │                                  │   │   │
│ │ └──────────────────────────────────┘   │   │
│ └────────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
*/
```

**box-sizing Property:**

```css
/* DEFAULT: content-box */
.content-box {
  box-sizing: content-box; /* default */
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
/* Total width: 200 + 40 + 10 = 250px */

/* MODERN: border-box (includes padding and border in width) */
.border-box {
  box-sizing: border-box;
  width: 200px; /* Total width including padding and border */
  padding: 20px;
  border: 5px solid black;
}
/* Total width: 200px (content shrinks to fit)
   Content width: 200 - 40 - 10 = 150px */

/* BEST PRACTICE: Apply to all elements */
*, *::before, *::after {
  box-sizing: border-box;
}
```

**Practical Example:**

```html
<div class="container">
  <div class="box">Content</div>
</div>

<style>
.container {
  width: 300px;
  background: lightgray;
}

/* ❌ Without border-box - box overflows! */
.box {
  width: 100%; /* 300px */
  padding: 20px; /* +40px */
  border: 5px solid black; /* +10px */
  /* Total: 350px - OVERFLOWS container! */
}

/* ✅ With border-box - fits perfectly */
.box {
  box-sizing: border-box;
  width: 100%; /* 300px total */
  padding: 20px;
  border: 5px solid black;
  /* Content shrinks to: 300 - 40 - 10 = 250px */
}
</style>
```

**Margin Collapse:**

```css
/* Vertical margins collapse (take the larger) */
.box1 {
  margin-bottom: 30px;
}

.box2 {
  margin-top: 20px;
}

/*  Actual gap between boxes: 30px (not 50px!)
    Margins collapse - larger value wins
*/

/* Horizontal margins DON'T collapse */
.inline-box1 {
  display: inline-block;
  margin-right: 30px;
}

.inline-box2 {
  display: inline-block;
  margin-left: 20px;
}

/* Actual gap: 30px + 20px = 50px */
```

### Common Mistakes

❌ **Wrong**: Forgetting box-sizing affects total size
```css
.container {
  width: 200px;
}

.child {
  width: 100%;
  padding: 20px; /* Makes it 240px wide - overflows! */
}
```

✅ **Correct**: Use border-box
```css
*, *::before, *::after {
  box-sizing: border-box;
}

.child {
  width: 100%; /* Stays 200px including padding */
  padding: 20px;
}
```

### Follow-up Questions
1. "Why does margin collapse happen?"
2. "How does box-sizing affect layouts?"
3. "What's the difference between padding and margin?"
4. "Can you have negative margins?"

### Resources
- [MDN: CSS Box Model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
- [Box Sizing](https://css-tricks.com/box-sizing/)

---

*[File continues with CSS specificity, cascade, inheritance, display properties, positioning, z-index, etc.]*

