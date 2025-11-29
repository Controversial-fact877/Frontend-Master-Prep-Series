# HTML & CSS Flashcards

> **60 HTML/CSS concepts for frontend interviews**

**Time to review:** 30 minutes
**Best for:** All frontend roles, UI implementation

---

## Card 1: Semantic HTML
**Q:** Why use semantic HTML elements?

**A:** 1) Better accessibility (screen readers), 2) Improved SEO, 3) Cleaner code structure, 4) Default styling, 5) Easier maintenance. Use <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>.

**Difficulty:** 🟢 Easy
**Tags:** #html #semantics #accessibility
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 2: Box Model
**Q:** Explain CSS box model layers.

**A:** From outside to inside: Margin → Border → Padding → Content. box-sizing: content-box (default, width = content only) vs border-box (width includes padding + border).

**Difficulty:** 🟢 Easy
**Tags:** #css #box-model
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 3: Flexbox vs Grid
**Q:** When to use Flexbox vs CSS Grid?

**A:** Flexbox: one-dimensional layout (row/column), component-level, content-first. Grid: two-dimensional, page-level layouts, layout-first. Can combine both.

**Difficulty:** 🟡 Medium
**Tags:** #css #layout #flexbox #grid
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 4: Specificity
**Q:** CSS specificity order from highest to lowest?

**A:** !important > Inline styles (1000) > IDs (100) > Classes/attributes/pseudo-classes (10) > Elements/pseudo-elements (1) > Universal selector (0).

**Difficulty:** 🟡 Medium
**Tags:** #css #specificity
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 5: Position Values
**Q:** Difference between position values?

**A:** static (default, normal flow), relative (offset from normal position), absolute (positioned to nearest positioned ancestor), fixed (viewport), sticky (relative + fixed hybrid).

**Difficulty:** 🟡 Medium
**Tags:** #css #position
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 6: BEM Methodology
**Q:** What is BEM in CSS?

**A:** Block Element Modifier. Naming convention: .block__element--modifier. Example: .card__title--large. Benefits: avoids specificity wars, self-documenting, scalable.

**Difficulty:** 🟡 Medium
**Tags:** #css #architecture #bem
**Frequency:** ⭐⭐⭐⭐

---

## Card 7: Viewport Units
**Q:** Difference between vh/vw and %?

**A:** vh/vw: relative to viewport (100vh = full height). %: relative to parent element. vh/vw ignore parent size, good for full-screen sections.

**Difficulty:** 🟢 Easy
**Tags:** #css #units
**Frequency:** ⭐⭐⭐⭐

---

## Card 8: em vs rem
**Q:** Difference between em and rem units?

**A:** em: relative to parent font-size (compounds). rem: relative to root font-size (doesn't compound). Use rem for consistency, em for proportional scaling.

**Difficulty:** 🟡 Medium
**Tags:** #css #units
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 9: Pseudo-classes vs Pseudo-elements
**Q:** Difference between pseudo-classes and pseudo-elements?

**A:** Pseudo-classes (:hover, :focus, :nth-child) - select element state. Pseudo-elements (::before, ::after, ::first-line) - style part of element. Double colon for pseudo-elements.

**Difficulty:** 🟡 Medium
**Tags:** #css #selectors
**Frequency:** ⭐⭐⭐⭐

---

## Card 10: Cascade & Inheritance
**Q:** How does CSS cascade work?

**A:** Order: 1) Importance (!important), 2) Specificity, 3) Source order (last wins). Inherited properties: color, font, text. Non-inherited: margin, padding, border.

**Difficulty:** 🟡 Medium
**Tags:** #css #cascade
**Frequency:** ⭐⭐⭐⭐

---

## Card 11: Flexbox Properties
**Q:** Main flexbox properties on container?

**A:** display: flex, flex-direction (row/column), justify-content (main axis), align-items (cross axis), flex-wrap, gap. On items: flex-grow, flex-shrink, flex-basis, align-self.

**Difficulty:** 🟡 Medium
**Tags:** #css #flexbox
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 12: Grid Template
**Q:** Key CSS Grid properties?

**A:** grid-template-columns, grid-template-rows, gap, grid-column/row (items), grid-template-areas (named regions), auto-fit/auto-fill (responsive).

**Difficulty:** 🟡 Medium
**Tags:** #css #grid
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 13: Media Queries
**Q:** Best practices for responsive design?

**A:** Mobile-first (min-width), common breakpoints (768px, 1024px, 1280px), prefer em/rem over px, use relative units, test on real devices.

**Difficulty:** 🟢 Easy
**Tags:** #css #responsive
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 14: Z-index
**Q:** How does z-index work?

**A:** Controls stacking order. Only works on positioned elements (not static). Creates stacking context. Higher value = on top. Parent context matters.

**Difficulty:** 🟡 Medium
**Tags:** #css #z-index
**Frequency:** ⭐⭐⭐⭐

---

## Card 15: Display Property
**Q:** Common display values and use cases?

**A:** block (full width, new line), inline (no width/height), inline-block (inline with dimensions), flex (flexbox), grid (CSS grid), none (hidden).

**Difficulty:** 🟢 Easy
**Tags:** #css #display
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 16: CSS Variables
**Q:** Benefits of CSS custom properties?

**A:** Runtime changeable (JS), cascading/inheriting, scoped, media query support, no build step. Syntax: --name: value; use: var(--name).

**Difficulty:** 🟢 Easy
**Tags:** #css #variables
**Frequency:** ⭐⭐⭐⭐

---

## Card 17: Transitions vs Animations
**Q:** When to use CSS transitions vs animations?

**A:** Transitions: simple A→B state changes (hover, focus). Animations: complex, multi-step, repeating, auto-starting. Keyframes for animations.

**Difficulty:** 🟡 Medium
**Tags:** #css #animations
**Frequency:** ⭐⭐⭐⭐

---

## Card 18: Transform Property
**Q:** Common CSS transform functions?

**A:** translate(x, y), rotate(deg), scale(x, y), skew(x, y). Hardware accelerated. Use for animations (better than left/top). No reflow.

**Difficulty:** 🟢 Easy
**Tags:** #css #transform
**Frequency:** ⭐⭐⭐⭐

---

## Card 19: Will-change
**Q:** What is will-change property?

**A:** Hints browser to optimize element. Use sparingly: will-change: transform, opacity. Apply before change, remove after. Overuse hurts performance.

**Difficulty:** 🔴 Hard
**Tags:** #css #performance
**Frequency:** ⭐⭐⭐

---

## Card 20: Contain Property
**Q:** What does CSS contain do?

**A:** Isolates element for performance. Values: layout, paint, size, style. Tells browser element content won't affect outside. Improves rendering performance.

**Difficulty:** 🔴 Hard
**Tags:** #css #performance
**Frequency:** ⭐⭐⭐

---

## Card 21: Aspect Ratio
**Q:** How to maintain aspect ratio?

**A:** Modern: aspect-ratio: 16/9. Legacy: padding-top hack (padding: 56.25% for 16:9). Use for responsive images, videos.

**Difficulty:** 🟡 Medium
**Tags:** #css #layout
**Frequency:** ⭐⭐⭐⭐

---

## Card 22: Object-fit
**Q:** What does object-fit do?

**A:** Controls replaced element content fitting. Values: fill, contain (fit inside), cover (fill, crop), none, scale-down. Use for images, videos.

**Difficulty:** 🟡 Medium
**Tags:** #css #images
**Frequency:** ⭐⭐⭐⭐

---

## Card 23: Overflow
**Q:** Overflow property values?

**A:** visible (default, overflow visible), hidden (clip), scroll (always scrollbars), auto (scrollbars when needed). overflow-x/y for specific axis.

**Difficulty:** 🟢 Easy
**Tags:** #css #overflow
**Frequency:** ⭐⭐⭐⭐

---

## Card 24: Float & Clear
**Q:** When to use float (if ever)?

**A:** Mostly legacy (use flexbox/grid instead). Still valid for: text wrapping around images. Use clear to prevent wrapping. Clearfix hack for container height.

**Difficulty:** 🟡 Medium
**Tags:** #css #float
**Frequency:** ⭐⭐⭐

---

## Card 25: Vertical Centering
**Q:** Modern ways to center vertically?

**A:** Flexbox: display: flex; align-items: center. Grid: display: grid; place-items: center. Position: position: absolute; top: 50%; transform: translateY(-50%).

**Difficulty:** 🟢 Easy
**Tags:** #css #centering
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 26: CSS Reset vs Normalize
**Q:** Difference between CSS reset and normalize?

**A:** Reset: removes all default styles (zero everything). Normalize: preserves useful defaults, fixes inconsistencies. Normalize preferred for modern projects.

**Difficulty:** 🟡 Medium
**Tags:** #css #architecture
**Frequency:** ⭐⭐⭐

---

## Card 27: Form Elements
**Q:** Important form accessibility attributes?

**A:** <label for="id">, aria-label, aria-describedby, required, aria-required, role, type, name, autocomplete. Associate labels with inputs.

**Difficulty:** 🟡 Medium
**Tags:** #html #forms #accessibility
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 28: ARIA Roles
**Q:** What are ARIA roles?

**A:** Accessibility attributes. role="button", "navigation", "main", "complementary". Use semantic HTML first. ARIA when semantic HTML insufficient.

**Difficulty:** 🟡 Medium
**Tags:** #html #aria #accessibility
**Frequency:** ⭐⭐⭐⭐

---

## Card 29: Alt Text
**Q:** Best practices for alt text?

**A:** Describe image content/function. Empty alt="" for decorative. Don't say "image of". Be concise. Essential for accessibility and SEO.

**Difficulty:** 🟢 Easy
**Tags:** #html #accessibility #seo
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 30: Picture Element
**Q:** When to use <picture> element?

**A:** Multiple image sources: art direction (different crops), format fallbacks (WebP → JPG), responsive images. More control than img srcset.

**Difficulty:** 🟡 Medium
**Tags:** #html #images
**Frequency:** ⭐⭐⭐⭐

---

## Card 31: Lazy Loading
**Q:** How to lazy load images?

**A:** Native: loading="lazy" attribute. Modern browsers only. Intersection Observer for more control. Improves initial page load.

**Difficulty:** 🟢 Easy
**Tags:** #html #performance
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 32: Meta Tags
**Q:** Essential meta tags for SEO?

**A:** <title>, <meta name="description">, viewport, charset="UTF-8", Open Graph (og:), Twitter Card, canonical. robots meta for crawling.

**Difficulty:** 🟡 Medium
**Tags:** #html #seo
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 33: Preload vs Prefetch
**Q:** Difference between preload and prefetch link?

**A:** <link rel="preload">: high-priority, current page. <link rel="prefetch">: low-priority, future navigation. Use preload for critical resources.

**Difficulty:** 🟡 Medium
**Tags:** #html #performance
**Frequency:** ⭐⭐⭐⭐

---

## Card 34: Content Visibility
**Q:** What is content-visibility CSS property?

**A:** Skips rendering off-screen content. Values: auto (skip when off-screen), hidden (always skip), visible (default). Huge performance boost for long pages.

**Difficulty:** 🔴 Hard
**Tags:** #css #performance
**Frequency:** ⭐⭐⭐

---

## Card 35: Clip-path
**Q:** Use cases for clip-path?

**A:** Create non-rectangular shapes, masks, reveals, interesting designs. Values: polygon(), circle(), ellipse(), inset(). Can animate.

**Difficulty:** 🟡 Medium
**Tags:** #css #shapes
**Frequency:** ⭐⭐⭐

---

## Card 36: CSS Grid Auto-placement
**Q:** How does CSS Grid auto-placement work?

**A:** grid-auto-flow: row (default), column, dense (fill holes). Auto-places items if not explicitly positioned. Dense packs tightly.

**Difficulty:** 🔴 Hard
**Tags:** #css #grid
**Frequency:** ⭐⭐⭐

---

## Card 37: Line Clamping
**Q:** How to truncate multi-line text?

**A:** display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden. Shows ellipsis after N lines.

**Difficulty:** 🟡 Medium
**Tags:** #css #text
**Frequency:** ⭐⭐⭐⭐

---

## Card 38: Scrollbar Styling
**Q:** How to style scrollbars?

**A:** Webkit: ::-webkit-scrollbar, ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-track. Firefox: scrollbar-width, scrollbar-color. Limited cross-browser.

**Difficulty:** 🟡 Medium
**Tags:** #css #scrollbar
**Frequency:** ⭐⭐⭐

---

## Card 39: Focus States
**Q:** Why are focus states important?

**A:** Accessibility (keyboard navigation), usability, WCAG requirement. Never remove :focus outline without replacement. Use :focus-visible for mouse vs keyboard.

**Difficulty:** 🟡 Medium
**Tags:** #css #accessibility
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 40: CSS Container Queries
**Q:** What are container queries?

**A:** Style based on parent size (not viewport). @container (min-width: 400px). Useful for responsive components. Better than media queries for components.

**Difficulty:** 🔴 Hard
**Tags:** #css #responsive
**Frequency:** ⭐⭐⭐⭐

---

[Continue with 20 more advanced HTML/CSS cards...]

---

[← Back to Flashcards](../README.md)
