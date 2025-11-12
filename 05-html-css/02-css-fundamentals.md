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

**Key Points:**

1. **Four Layers** - Every element has content, padding, border, and margin areas
2. **box-sizing Property** - Controls how width/height are calculated (`content-box` vs `border-box`)
3. **Margin Collapse** - Vertical margins collapse; horizontal margins don't
4. **Border-box is Modern Standard** - Simplifies layout calculations and prevents overflow
5. **Visual Debugging** - Use browser DevTools to visualize box model for any element

### Code Example

```css
/* =========================================== */
/* 1. BOX MODEL COMPONENTS */
/* =========================================== */

.box {
  /* Content area */
  width: 200px;
  height: 100px;

  /* Padding (inside border, adds to size) */
  padding: 20px;

  /* Border (around padding) */
  border: 5px solid black;

  /* Margin (outside border, doesn't add to size) */
  margin: 10px;
}

/*
VISUAL REPRESENTATION:
======================

┌────────────── Margin (10px) ──────────────┐
│                                             │
│  ┌────────── Border (5px) ────────────┐   │
│  │                                      │   │
│  │  ┌──── Padding (20px) ────┐        │   │
│  │  │                          │        │   │
│  │  │  Content (200×100)      │        │   │
│  │  │                          │        │   │
│  │  └──────────────────────────┘        │   │
│  │                                      │   │
│  └──────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘

DEFAULT (content-box) TOTAL SIZE:
- Width: 200 (content) + 40 (padding) + 10 (border) = 250px
- Height: 100 (content) + 40 (padding) + 10 (border) = 150px
- Margin adds 10px space around but doesn't affect element size
*/
```

**box-sizing: content-box vs border-box:**

```css
/* =========================================== */
/* 2. BOX-SIZING PROPERTY */
/* =========================================== */

/* ❌ DEFAULT: content-box (old behavior) */
.content-box {
  box-sizing: content-box; /* default */
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
/*
CALCULATION:
- Specified width: 200px (content only)
- Total width: 200 + 40 (padding) + 10 (border) = 250px
- Content area: 200px
*/

/* ✅ MODERN: border-box (recommended) */
.border-box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
/*
CALCULATION:
- Specified width: 200px (includes padding & border)
- Total width: 200px
- Content area: 200 - 40 (padding) - 10 (border) = 150px
*/

/* ✅ BEST PRACTICE: Apply globally */
*,
*::before,
*::after {
  box-sizing: border-box;
}
/* Now all elements use intuitive border-box sizing */
```

**Practical Layout Example:**

```html
<div class="container">
  <div class="box box-1">Box 1</div>
  <div class="box box-2">Box 2</div>
</div>
```

```css
/* =========================================== */
/* 3. REAL-WORLD EXAMPLE */
/* =========================================== */

.container {
  width: 400px;
  background: #f0f0f0;
  padding: 20px;
}

/* ❌ WITHOUT border-box - boxes overflow! */
.box {
  /* box-sizing: content-box; */ /* default */
  width: 50%; /* 200px */
  padding: 20px; /* adds 40px */
  border: 5px solid blue; /* adds 10px */
  /* Total: 250px each - OVERFLOWS 400px container! */
  float: left;
}

/* ✅ WITH border-box - boxes fit perfectly */
.box {
  box-sizing: border-box;
  width: 50%; /* 200px total including padding & border */
  padding: 20px;
  border: 5px solid blue;
  float: left;
  /* Content shrinks to: 200 - 40 - 10 = 150px */
}
```

**Margin Collapse:**

```css
/* =========================================== */
/* 4. MARGIN COLLAPSE */
/* =========================================== */

/* Vertical margins collapse (take larger value) */
.section-1 {
  margin-bottom: 30px;
}

.section-2 {
  margin-top: 20px;
}

/*
ACTUAL GAP: 30px (not 50px!)
Vertical margins collapse - larger value wins

WHY? Prevents excessive spacing in vertical flow layouts
*/

/* Horizontal margins DON'T collapse */
.inline-box-1 {
  display: inline-block;
  margin-right: 30px;
}

.inline-box-2 {
  display: inline-block;
  margin-left: 20px;
}

/* ACTUAL GAP: 50px (30px + 20px) */

/* Preventing margin collapse */
.parent {
  padding: 1px; /* Creates BFC, prevents collapse */
  /* OR */
  border: 1px solid transparent;
  /* OR */
  overflow: hidden;
}
```

**Padding vs Margin:**

```css
/* =========================================== */
/* 5. PADDING VS MARGIN */
/* =========================================== */

.clickable-button {
  padding: 15px 30px; /* ✅ Expands click area */
  margin: 10px; /* ✅ Space from other elements */
  background: blue;
  color: white;
}

/*
PADDING:
- Inside element
- Expands background/border area
- Included in click/hover area
- Can't be negative
- Use for: Internal spacing, clickable area

MARGIN:
- Outside element
- Creates space between elements
- Not part of click/hover area
- Can be negative (overlap elements)
- Use for: External spacing, element separation
*/

/* Negative margins */
.overlap {
  margin-top: -20px; /* Moves element up, can overlap */
}
```

### Common Mistakes

❌ **Wrong**: Not using border-box globally
```css
.container {
  width: 300px;
}

.child {
  width: 100%;
  padding: 20px; /* Makes it 340px - overflow! */
}
```

✅ **Correct**: Use border-box
```css
*, *::before, *::after {
  box-sizing: border-box;
}

.child {
  width: 100%; /* Stays 300px total */
  padding: 20px; /* Included in width */
}
```

❌ **Wrong**: Confusing margin and padding
```css
/* Don't use margin for internal spacing */
.card {
  margin: 20px; /* ❌ Won't expand background */
}

/* Don't use padding for element separation */
.section {
  padding-bottom: 40px; /* ❌ Expands section unnecessarily */
}
```

✅ **Correct**: Use appropriate spacing
```css
.card {
  padding: 20px; /* ✅ Internal spacing with background */
  margin-bottom: 20px; /* ✅ Space from other cards */
}
```

### Follow-up Questions
1. "Why does margin collapse happen and when doesn't it occur?"
2. "Can you have negative padding? Why or why not?"
3. "How does outline differ from border?"
4. "What is a Block Formatting Context (BFC)?"

### Resources
- [MDN: CSS Box Model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
- [CSS Tricks: Box Sizing](https://css-tricks.com/box-sizing/)

---

## Question 2: Explain CSS Specificity and the Cascade

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
How does CSS specificity work? Explain the cascade and specificity calculation.

### Answer

**CSS Specificity** determines which styles apply when multiple rules target the same element. **The Cascade** is the algorithm browsers use to combine styles from multiple sources.

**Key Points:**

1. **Specificity is Calculated** - Each selector has a weight: inline styles (1000), IDs (100), classes/attributes/pseudo-classes (10), elements/pseudo-elements (1)
2. **Cascade Order Matters** - When specificity is equal, last rule wins
3. **!important Overrides** - `!important` beats everything (use sparingly)
4. **Inheritance** - Some properties inherit from parent (color, font-family) while others don't (margin, padding)
5. **Specificity Wars** - Avoid overly specific selectors; use classes over IDs for styling

### Code Example

```css
/* =========================================== */
/* 1. SPECIFICITY CALCULATION */
/* =========================================== */

/*
SPECIFICITY WEIGHT:
===================
Inline style:      1,0,0,0 (1000 points)
ID:                0,1,0,0 (100 points)
Class/Attribute:   0,0,1,0 (10 points)
Element:           0,0,0,1 (1 point)
Universal (*):     0,0,0,0 (0 points)
*/

/* Specificity: 0,0,0,1 (1 point) */
p {
  color: black;
}

/* Specificity: 0,0,1,0 (10 points) */
.text {
  color: blue; /* ✅ WINS over 'p' */
}

/* Specificity: 0,1,0,0 (100 points) */
#heading {
  color: red; /* ✅ WINS over '.text' */
}

/* Specificity: 1,0,0,0 (1000 points) */
<p style="color: green;">Text</p> /* ✅ WINS over all CSS rules */

/* !important overrides everything */
p {
  color: purple !important; /* ✅ WINS over inline styles */
}
```

**Specificity Examples:**

```css
/* =========================================== */
/* 2. CALCULATING SPECIFICITY */
/* =========================================== */

/* Specificity: 0,0,0,1 */
div { color: black; }

/* Specificity: 0,0,0,2 */
div p { color: blue; }

/* Specificity: 0,0,1,1 */
div .text { color: green; }

/* Specificity: 0,0,2,1 */
div.container .text { color: red; }

/* Specificity: 0,1,0,1 */
div#main { color: purple; }

/* Specificity: 0,1,1,2 */
div#main .content p { color: orange; }

/* Specificity: 0,2,1,1 */
#header #nav .link { color: yellow; }

/*
REMEMBER:
- ID always beats class
- Class always beats element
- More specific selector wins
- Same specificity? Last one wins
*/
```

**The Cascade:**

```css
/* =========================================== */
/* 3. CASCADE ORDER */
/* =========================================== */

/* 1. User agent styles (browser defaults) */
p {
  display: block;
  margin: 1em 0;
}

/* 2. User styles (user's browser settings) */

/* 3. Author styles (your CSS) */
p {
  color: blue; /* Overrides browser default */
}

p {
  color: red; /* ✅ WINS - same specificity, comes last */
}

/* 4. !important author styles */
p {
  color: green !important; /* ✅ WINS - !important */
}

/* 5. !important user styles */

/* 6. !important user agent styles */

/*
CASCADE PRIORITY (high to low):
1. !important user agent declarations
2. !important user declarations
3. !important author declarations
4. Normal author declarations
5. Normal user declarations
6. Normal user agent declarations
*/
```

**Inheritance:**

```css
/* =========================================== */
/* 4. INHERITANCE */
/* =========================================== */

.parent {
  /* These properties INHERIT to children */
  color: blue;
  font-family: Arial;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;

  /* These properties DON'T inherit */
  margin: 20px;
  padding: 10px;
  border: 1px solid black;
  background: yellow;
  width: 300px;
}

.child {
  /* Inherits: color, font-family, font-size, line-height, text-align */
  /* Doesn't inherit: margin, padding, border, background, width */
}

/* Force inheritance */
.child {
  border: inherit; /* Inherit parent's border */
  all: inherit; /* Inherit ALL properties from parent */
}

/* Reset inheritance */
.child {
  color: initial; /* Reset to initial value */
  all: unset; /* Remove all inherited/set values */
}
```

**Practical Example:**

```html
<div id="container" class="wrapper">
  <p class="text highlight">Hello World</p>
</div>
```

```css
/* =========================================== */
/* 5. REAL-WORLD SPECIFICITY BATTLE */
/* =========================================== */

/* Specificity: 0,0,0,1 - WON'T APPLY */
p {
  color: black;
}

/* Specificity: 0,0,1,0 - WON'T APPLY */
.text {
  color: blue;
}

/* Specificity: 0,0,2,0 - WON'T APPLY */
.text.highlight {
  color: green;
}

/* Specificity: 0,1,0,1 - WON'T APPLY */
#container p {
  color: red;
}

/* Specificity: 0,1,2,1 - ✅ WINS! */
#container .text.highlight {
  color: purple;
}

/* Override with !important (avoid in production) */
.text {
  color: orange !important; /* ✅ WINS over everything */
}
```

### Common Mistakes

❌ **Wrong**: Using IDs for styling
```css
#header { /* 0,1,0,0 - Too specific! */
  background: blue;
}

#header .nav { /* 0,1,1,0 - Even worse! */
  color: white;
}
/* Hard to override later */
```

✅ **Correct**: Use classes
```css
.header { /* 0,0,1,0 - Flexible */
  background: blue;
}

.header__nav { /* BEM naming */
  color: white;
}
```

❌ **Wrong**: Overusing !important
```css
.button {
  background: blue !important;
  color: white !important;
  padding: 10px !important; /* ❌ Specificity war! */
}
```

✅ **Correct**: Increase specificity properly
```css
.page .button {
  background: blue;
  color: white;
  padding: 10px;
}
```

### Follow-up Questions
1. "How does the universal selector affect specificity?"
2. "What happens when two selectors have the same specificity?"
3. "Can you explain the :not() pseudo-class specificity?"
4. "How do CSS custom properties (variables) inherit?"

### Resources
- [MDN: Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- [Specificity Calculator](https://specificity.keegan.st/)

---

## Question 3: CSS Display Property - Block vs Inline vs Inline-Block

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain the differences between `display: block`, `display: inline`, and `display: inline-block`.

### Answer

The **display property** controls how an element participates in layout and generates boxes.

**Key Points:**

1. **Block Elements** - Take full width, start on new line, accept width/height
2. **Inline Elements** - Take only content width, flow with text, ignore width/height
3. **Inline-Block Elements** - Flow like inline but accept width/height like block
4. **Default Display** - Each HTML element has a default (`div` is block, `span` is inline, etc.)
5. **Modern Layout** - Flexbox and Grid often replace display hacks

### Code Example

```css
/* =========================================== */
/* 1. BLOCK ELEMENTS */
/* =========================================== */

.block {
  display: block;
}

/*
CHARACTERISTICS:
- Takes full available width (100% of parent)
- Starts on new line
- Can set width and height
- Can set all margins and paddings
- Stacks vertically
- Examples: div, p, h1-h6, section, article

BEHAVIOR:
┌────── Container ────────┐
│  Block Element 1        │
├─────────────────────────┤
│  Block Element 2        │
├─────────────────────────┤
│  Block Element 3        │
└─────────────────────────┘
*/

div {
  display: block;
  width: 200px; /* ✅ Works */
  height: 100px; /* ✅ Works */
  margin: 20px; /* ✅ All sides work */
  padding: 15px; /* ✅ All sides work */
}
```

```css
/* =========================================== */
/* 2. INLINE ELEMENTS */
/* =========================================== */

.inline {
  display: inline;
}

/*
CHARACTERISTICS:
- Takes only content width
- Flows with text (doesn't break line)
- width and height IGNORED
- Vertical margins/padding don't push other elements
- Horizontal margins/padding work
- Examples: span, a, strong, em, img (inline by default)

BEHAVIOR:
┌────── Container ────────┐
│ Text [inline][inline]   │
│ [inline] more text      │
└─────────────────────────┘
*/

span {
  display: inline;
  width: 200px; /* ❌ IGNORED */
  height: 100px; /* ❌ IGNORED */
  margin: 20px; /* ⚠️  Only left/right work */
  padding: 15px; /* ⚠️  Top/bottom don't push other elements */
}
```

```css
/* =========================================== */
/* 3. INLINE-BLOCK ELEMENTS */
/* =========================================== */

.inline-block {
  display: inline-block;
}

/*
CHARACTERISTICS:
- Flows like inline (doesn't break line)
- Accepts width/height like block
- All margins and paddings work
- Useful for navigation menus, buttons
- Has whitespace bug (space between elements)

BEHAVIOR:
┌────── Container ────────┐
│ [I-B] [I-B] [I-B]      │
│ [I-B] text             │
└─────────────────────────┘
*/

.button {
  display: inline-block;
  width: 150px; /* ✅ Works */
  height: 40px; /* ✅ Works */
  margin: 10px; /* ✅ All sides work */
  padding: 8px 16px; /* ✅ All sides work */
}
```

**Comparison Table:**

```css
/* =========================================== */
/* 4. SIDE-BY-SIDE COMPARISON */
/* =========================================== */

/*
┌──────────────┬─────────┬────────┬──────────────┐
│ Property     │ Block   │ Inline │ Inline-Block │
├──────────────┼─────────┼────────┼──────────────┤
│ New line     │ Yes     │ No     │ No           │
│ Full width   │ Yes     │ No     │ No           │
│ Width/Height │ Yes     │ No     │ Yes          │
│ Margin (all) │ Yes     │ H only │ Yes          │
│ Padding (all)│ Yes     │ Partial│ Yes          │
│ Line wrapping│ No      │ Yes    │ Yes          │
└──────────────┴─────────┴────────┴──────────────┘
*/
```

**Practical Examples:**

```html
<nav class="navigation">
  <a href="#" class="nav-link">Home</a>
  <a href="#" class="nav-link">About</a>
  <a href="#" class="nav-link">Contact</a>
</nav>
```

```css
/* =========================================== */
/* 5. PRACTICAL USE CASES */
/* =========================================== */

/* ❌ BAD: Inline links ignore dimensions */
.nav-link {
  display: inline; /* Default for <a> */
  width: 120px; /* IGNORED */
  padding: 15px 20px; /* Vertical padding doesn't push */
}

/* ✅ GOOD: Inline-block for clickable area */
.nav-link {
  display: inline-block;
  width: 120px; /* ✅ Works */
  padding: 15px 20px; /* ✅ Expands click area */
  text-align: center;
}

/* Modern alternative: Flexbox */
.navigation {
  display: flex;
  gap: 10px;
}

.nav-link {
  padding: 15px 20px;
  /* No need to set display: inline-block */
}
```

**Inline-Block Whitespace Bug:**

```html
<div class="container">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>
```

```css
/* =========================================== */
/* 6. INLINE-BLOCK WHITESPACE BUG */
/* =========================================== */

.box {
  display: inline-block;
  width: 100px;
  height: 100px;
}

/*
PROBLEM: Whitespace in HTML creates gaps between boxes!

SOLUTIONS:
*/

/* Solution 1: Remove HTML whitespace */
<div class="box">1</div><div class="box">2</div><div class="box">3</div>

/* Solution 2: Negative margin */
.box {
  margin-right: -4px;
}

/* Solution 3: Font size 0 on parent */
.container {
  font-size: 0;
}
.box {
  font-size: 16px;
}

/* ✅ Solution 4: Use Flexbox instead */
.container {
  display: flex;
  gap: 0;
}
.box {
  /* No display: inline-block needed */
}
```

### Common Mistakes

❌ **Wrong**: Trying to set width on inline elements
```css
span {
  display: inline;
  width: 200px; /* Ignored */
  height: 50px; /* Ignored */
}
```

✅ **Correct**: Use inline-block or block
```css
span {
  display: inline-block;
  width: 200px; /* ✅ Works */
  height: 50px; /* ✅ Works */
}
```

❌ **Wrong**: Using inline-block for layout
```css
.column {
  display: inline-block;
  width: 33.33%;
  /* Whitespace bug causes wrapping */
}
```

✅ **Correct**: Use Flexbox or Grid
```css
.container {
  display: flex;
}
.column {
  flex: 1;
}
```

### Follow-up Questions
1. "What's the difference between `display: none` and `visibility: hidden`?"
2. "How does `display: contents` work?"
3. "What is the difference between `display: flex` and `display: inline-flex`?"
4. "Can you explain `display: table` and its use cases?"

### Resources
- [MDN: Display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [CSS Display Property](https://css-tricks.com/almanac/properties/d/display/)

---

## Question 4: CSS Positioning - Static, Relative, Absolute, Fixed, Sticky

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 12-15 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain the different CSS positioning values: static, relative, absolute, fixed, and sticky.

### Answer

The **position property** controls how an element is positioned in the document flow.

**Key Points:**

1. **Static** - Default, normal flow, ignores top/left/right/bottom
2. **Relative** - Positioned relative to its normal position, reserves original space
3. **Absolute** - Removed from flow, positioned relative to nearest positioned ancestor
4. **Fixed** - Removed from flow, positioned relative to viewport, stays on scroll
5. **Sticky** - Hybrid of relative and fixed, toggles based on scroll position

### Code Example

```css
/* =========================================== */
/* 1. STATIC POSITIONING (DEFAULT) */
/* =========================================== */

.static {
  position: static; /* Default value */
  top: 100px; /* IGNORED */
  left: 50px; /* IGNORED */
}

/*
- Normal document flow
- top, right, bottom, left have no effect
- z-index has no effect
- Default for all elements
*/
```

```css
/* =========================================== */
/* 2. RELATIVE POSITIONING */
/* =========================================== */

.relative {
  position: relative;
  top: 20px; /* Move 20px DOWN from original position */
  left: 30px; /* Move 30px RIGHT from original position */
}

/*
- Positioned relative to its NORMAL position
- Original space is RESERVED (doesn't affect other elements)
- Can use top, right, bottom, left
- Creates positioning context for absolute children
- Stays in document flow

VISUAL:
┌─────────────────┐
│ Element 1       │
├─────────────────┤
│ [empty space]   │ ← Original position reserved
│     Element 2   │ ← Shifted by top/left
├─────────────────┤
│ Element 3       │
└─────────────────┘
*/
```

```css
/* =========================================== */
/* 3. ABSOLUTE POSITIONING */
/* =========================================== */

.container {
  position: relative; /* Create positioning context */
}

.absolute {
  position: absolute;
  top: 20px; /* 20px from TOP of .container */
  right: 10px; /* 10px from RIGHT of .container */
}

/*
- Removed from document flow (doesn't reserve space)
- Positioned relative to nearest POSITIONED ancestor
  (ancestor with position: relative/absolute/fixed/sticky)
- If no positioned ancestor, uses <html>
- Can use top, right, bottom, left
- Can overlap other elements

VISUAL (without positioned parent):
┌─────────────────┐
│ Element 1       │
├─────────────────┤
│ Element 2       │ ← Absolute element overlaps here
└─────────────────┘
    ┌──────────┐
    │ Absolute │
    └──────────┘

VISUAL (with positioned parent):
┌──── .container ──────┐
│                 ┌───┐│ ← Absolute positioned
│ Element 1      │Abs││
│                └───┘│
│ Element 2            │
└──────────────────────┘
*/
```

```css
/* =========================================== */
/* 4. FIXED POSITIONING */
/* =========================================== */

.fixed {
  position: fixed;
  top: 0; /* Stick to TOP of viewport */
  right: 0; /* Stick to RIGHT of viewport */
}

/*
- Removed from document flow
- Positioned relative to VIEWPORT
- Stays in same position during scroll
- Common for: headers, modals, chat widgets

USE CASES:
- Fixed navigation bar
- Floating action button
- Cookie consent banner
- Back to top button
*/

/* Fixed Header Example */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  z-index: 1000;
}

/* Compensate for fixed header */
.content {
  margin-top: 60px; /* Header height */
}
```

```css
/* =========================================== */
/* 5. STICKY POSITIONING */
/* =========================================== */

.sticky {
  position: sticky;
  top: 0; /* Stick when reaching TOP of container */
}

/*
- Hybrid: relative + fixed
- Behaves like relative until scroll threshold
- Then behaves like fixed within parent container
- Returns to flow when parent scrolls out
- Requires threshold (top, right, bottom, or left)

COMMON USES:
- Table headers
- Section headings
- Sidebar navigation
- Scroll progress indicators
*/

/* Sticky Table Header */
thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

/* Sticky Sidebar */
.sidebar {
  position: sticky;
  top: 20px; /* 20px from top when stuck */
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}
```

**Positioning Context:**

```html
<div class="grandparent">
  <div class="parent">
    <div class="child">
      <div class="absolute">I'm absolutely positioned</div>
    </div>
  </div>
</div>
```

```css
/* =========================================== */
/* 6. POSITIONING CONTEXT */
/* =========================================== */

.grandparent {
  /* position: static; */ /* Not a positioning context */
}

.parent {
  position: relative; /* ✅ Creates positioning context */
  width: 400px;
  height: 300px;
  background: lightblue;
}

.child {
  /* position: static; */ /* Not a positioning context */
}

.absolute {
  position: absolute;
  top: 10px; /* Relative to .parent (nearest positioned ancestor) */
  left: 10px;
}

/*
RULE: Absolute elements position relative to nearest ancestor with:
- position: relative
- position: absolute
- position: fixed
- position: sticky

If none exist, positions relative to <html>
*/
```

**Centering with Absolute:**

```css
/* =========================================== */
/* 7. CENTERING TECHNIQUES */
/* =========================================== */

/* Method 1: Absolute + Transform */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Method 2: Absolute + Margin Auto */
.center-margin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 200px; /* Must have width */
  height: 100px; /* Must have height */
}

/* Method 3: Absolute + Calc */
.center-calc {
  position: absolute;
  top: calc(50% - 50px); /* 50px = half height */
  left: calc(50% - 100px); /* 100px = half width */
  width: 200px;
  height: 100px;
}
```

### Common Mistakes

❌ **Wrong**: Forgetting to set positioning context
```css
.child {
  position: absolute;
  top: 20px;
  /* Positions relative to <html>, not parent! */
}
```

✅ **Correct**: Set parent to relative
```css
.parent {
  position: relative; /* Create context */
}

.child {
  position: absolute;
  top: 20px; /* Now relative to .parent */
}
```

❌ **Wrong**: Using fixed for content that should scroll
```css
.article {
  position: fixed; /* ❌ Won't scroll with page */
}
```

✅ **Correct**: Use static or relative
```css
.article {
  position: relative; /* ✅ Scrolls normally */
}
```

❌ **Wrong**: Sticky without threshold
```css
.sticky-header {
  position: sticky; /* ❌ Won't work without threshold */
}
```

✅ **Correct**: Set top/bottom/left/right
```css
.sticky-header {
  position: sticky;
  top: 0; /* ✅ Required threshold */
}
```

### Follow-up Questions
1. "How does z-index work with different positioning values?"
2. "What happens if you set both top and bottom on an absolute element?"
3. "Can you explain containing blocks?"
4. "How does position: sticky work with overflow: hidden parent?"

### Resources
- [MDN: Position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [CSS Positioning Explained](https://css-tricks.com/almanac/properties/p/position/)

---

## Question 5: What is z-index and How Does Stacking Context Work?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain z-index and stacking context. Why doesn't z-index always work as expected?

### Answer

**z-index** controls the stacking order of positioned elements along the z-axis (depth). **Stacking contexts** are groups of elements with their own stacking order.

**Key Points:**

1. **Requires Positioning** - z-index only works on positioned elements (not static)
2. **Stacking Contexts** - Created by various CSS properties, elements inside can't escape their context
3. **Higher Wins** - Within same context, higher z-index appears on top
4. **Context Hierarchy** - Parent context always wins over child z-index
5. **Common Triggers** - position + z-index, opacity < 1, transform, filter, etc.

### Code Example

```css
/* =========================================== */
/* 1. BASIC Z-INDEX */
/* =========================================== */

.box-1 {
  position: relative;
  z-index: 1;
  background: red;
}

.box-2 {
  position: relative;
  z-index: 2; /* ✅ Appears on top */
  background: blue;
}

.box-3 {
  position: relative;
  z-index: 3; /* ✅ Appears on top of both */
  background: green;
}

/*
RULE: Higher z-index = closer to viewer
- Default z-index: auto (0)
- Can be negative (goes behind)
- Only works on positioned elements
*/
```

```css
/* =========================================== */
/* 2. Z-INDEX WITHOUT POSITIONING (DOESN'T WORK) */
/* =========================================== */

.static-box {
  position: static; /* Default */
  z-index: 9999; /* ❌ IGNORED - no effect! */
}

.relative-box {
  position: relative; /* Any value except static */
  z-index: 1; /* ✅ Works */
}

/*
Z-INDEX REQUIRES ONE OF:
- position: relative
- position: absolute
- position: fixed
- position: sticky
*/
```

```css
/* =========================================== */
/* 3. STACKING CONTEXT */
/* =========================================== */

.parent-1 {
  position: relative;
  z-index: 1; /* ✅ Creates stacking context */
}

.child-1 {
  position: relative;
  z-index: 9999; /* ❌ Can't escape parent context! */
}

.parent-2 {
  position: relative;
  z-index: 2; /* ✅ Wins over parent-1 */
}

.child-2 {
  position: relative;
  z-index: 1; /* Still appears on top of child-1! */
}

/*
STACKING CONTEXT CREATED BY:
1. Root element (<html>)
2. position + z-index (not auto)
3. position: fixed or sticky
4. flex/grid child + z-index
5. opacity < 1
6. transform (not none)
7. filter (not none)
8. will-change
9. isolation: isolate
*/
```

**Visual Example:**

```html
<div class="context-1">
  <div class="box-a">Box A (z-index: 9999)</div>
</div>

<div class="context-2">
  <div class="box-b">Box B (z-index: 1)</div>
</div>
```

```css
/* =========================================== */
/* 4. STACKING CONTEXT TRAP */
/* =========================================== */

.context-1 {
  position: relative;
  z-index: 1; /* Parent context z-index: 1 */
}

.box-a {
  position: relative;
  z-index: 9999; /* ❌ Trapped in context-1 */
  background: red;
}

.context-2 {
  position: relative;
  z-index: 2; /* Parent context z-index: 2 WINS */
}

.box-b {
  position: relative;
  z-index: 1; /* ✅ Appears on top because parent wins */
  background: blue;
}

/*
RESULT: box-b appears on top even though box-a has higher z-index!
WHY? Stacking contexts are independent
     Parent context-2 (z-index: 2) > context-1 (z-index: 1)
*/
```

**Common Stacking Context Triggers:**

```css
/* =========================================== */
/* 5. PROPERTIES THAT CREATE STACKING CONTEXT */
/* =========================================== */

/* 1. Positioned with z-index */
.positioned {
  position: relative;
  z-index: 1; /* ✅ Creates context */
}

/* 2. Opacity */
.transparent {
  opacity: 0.99; /* ✅ Creates context */
}

/* 3. Transform */
.transformed {
  transform: translateX(0); /* ✅ Creates context */
}

/* 4. Filter */
.filtered {
  filter: blur(0); /* ✅ Creates context */
}

/* 5. Flex/Grid children */
.flex-container {
  display: flex;
}

.flex-child {
  z-index: 1; /* ✅ Creates context (even without position) */
}

/* 6. Isolation */
.isolated {
  isolation: isolate; /* ✅ Creates context explicitly */
}

/* 7. Will-change */
.will-change {
  will-change: transform; /* ✅ Creates context */
}
```

**Debugging Stacking Issues:**

```css
/* =========================================== */
/* 6. DEBUGGING Z-INDEX PROBLEMS */
/* =========================================== */

/* Problem: Modal behind other elements */
.modal {
  position: fixed;
  z-index: 999; /* ❌ Still behind some elements */
}

/* Cause: Parent has stacking context */
.modal-container {
  position: relative;
  z-index: 1; /* Creates context, traps modal */
  opacity: 0.99; /* Also creates context! */
}

/* ✅ Solution 1: Move modal outside stacking context */
/* Render modal at root level in DOM */
<body>
  <div class="app">...</div>
  <div class="modal">Modal</div> <!-- Outside app context -->
</body>

/* ✅ Solution 2: Remove stacking context from parent */
.modal-container {
  /* Remove position, opacity, transform, etc. */
}

/* ✅ Solution 3: Increase parent z-index */
.modal-container {
  z-index: 1000; /* Higher than competing contexts */
}
```

**Natural Stacking Order (No z-index):**

```css
/* =========================================== */
/* 7. DEFAULT STACKING ORDER (BOTTOM TO TOP) */
/* =========================================== */

/*
1. Root element background and borders
2. Non-positioned blocks (in document order)
3. Non-positioned floats
4. Non-positioned inline elements
5. Positioned elements with z-index: auto or z-index: 0
6. Positioned elements with positive z-index (lowest to highest)

EXAMPLE:
*/

.background {
  /* 1. Rendered first (bottom) */
}

.static-block {
  /* 2. On top of background */
}

.float {
  float: left; /* 3. On top of static blocks */
}

.inline {
  display: inline; /* 4. On top of floats */
}

.positioned-auto {
  position: relative; /* 5. On top of inline */
  /* z-index: auto (default) */
}

.positioned-positive {
  position: relative;
  z-index: 1; /* 6. On top of everything (top) */
}
```

### Common Mistakes

❌ **Wrong**: Using extremely high z-index
```css
.modal {
  z-index: 999999999; /* ❌ Overkill, causes maintainability issues */
}
```

✅ **Correct**: Use reasonable values with system
```css
/* Define z-index scale */
:root {
  --z-dropdown: 100;
  --z-modal: 200;
  --z-tooltip: 300;
}

.modal {
  z-index: var(--z-modal); /* ✅ Maintainable */
}
```

❌ **Wrong**: Forgetting stacking context trap
```css
.parent {
  opacity: 0.99; /* Creates stacking context */
}

.child {
  z-index: 9999; /* ❌ Trapped in parent context */
}
```

✅ **Correct**: Understand context hierarchy
```css
/* Move element outside stacking context in DOM */
/* Or remove context-creating properties from parent */
```

### Follow-up Questions
1. "How do you debug z-index issues in DevTools?"
2. "What's the difference between `z-index: 0` and `z-index: auto`?"
3. "Can you have negative z-index values?"
4. "How does `isolation: isolate` work?"

### Resources
- [MDN: Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
- [What The Heck, z-index??](https://www.joshwcomeau.com/css/stacking-contexts/)

---

## Summary Table

| Topic | Key Concept | Common Pitfall |
|-------|-------------|----------------|
| Box Model | border-box includes padding/border in width | Forgetting content-box adds to width |
| Specificity | ID (100) > Class (10) > Element (1) | Overusing IDs and !important |
| Display | Block vs Inline vs Inline-block | Setting width on inline elements |
| Position | Absolute relative to positioned ancestor | Forgetting to set parent to relative |
| Z-index | Requires positioning, stacking contexts | Not understanding stacking context traps |

---

**Next Topics**: Flexbox, Grid, Responsive Design, Animations
