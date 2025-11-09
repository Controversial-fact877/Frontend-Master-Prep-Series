# HTML Fundamentals

> Semantic HTML, HTML5 features, forms, accessibility attributes, meta tags, and modern HTML best practices.

---

## Question 1: What is Semantic HTML and Why is it Important?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Airbnb

### Question
Explain semantic HTML. Why should you use semantic elements instead of divs?

### Answer

**Semantic HTML** uses HTML elements that clearly describe their meaning to both the browser and developer. Elements like `<header>`, `<nav>`, `<article>`, `<section>`, `<aside>`, and `<footer>` convey meaning about the content they contain.

**Benefits:**
1. **Accessibility** - Screen readers can navigate better
2. **SEO** - Search engines understand content structure
3. **Maintainability** - Easier to read and maintain code
4. **Browser Features** - Better browser parsing and features

### Code Example

```html
<!-- ❌ NON-SEMANTIC (Bad Practice) -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
    <div class="nav-item">About</div>
  </div>
</div>

<div class="main">
  <div class="article">
    <div class="article-title">Title</div>
    <div class="article-content">Content...</div>
  </div>
</div>

<div class="footer">
  <div class="copyright">© 2025</div>
</div>

<!-- ✅ SEMANTIC (Best Practice) -->
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2025 Company Name</p>
</footer>
```

**Common Semantic Elements:**

```html
<!-- Page Structure -->
<header>     <!-- Page or section header -->
<nav>        <!-- Navigation links -->
<main>       <!-- Main content (only one per page) -->
<section>    <!-- Thematic grouping of content -->
<article>    <!-- Self-contained content -->
<aside>      <!-- Sidebar or tangential content -->
<footer>     <!-- Page or section footer -->

<!-- Content -->
<figure>     <!-- Image with caption -->
  <img src="photo.jpg" alt="Description">
  <figcaption>Photo caption</figcaption>
</figure>

<time datetime="2025-11-09">November 9, 2025</time>
<mark>Highlighted text</mark>
<details>
  <summary>Click to expand</summary>
  <p>Hidden content</p>
</details>

<!-- Text Semantics -->
<strong>   <!-- Important text (not just bold) -->
<em>       <!-- Emphasized text (not just italic) -->
<code>     <!-- Code snippet -->
<pre>      <!-- Preformatted text -->
<blockquote> <!-- Quoted content -->
```

**Complete Page Structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description for SEO">
  <title>Page Title</title>
</head>
<body>
  <header>
    <h1>Website Name</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Article Title</h2>
        <p>
          Published on <time datetime="2025-11-09">November 9, 2025</time>
          by <address>John Doe</address>
        </p>
      </header>

      <section>
        <h3>Introduction</h3>
        <p>Article introduction...</p>
      </section>

      <section>
        <h3>Main Content</h3>
        <p>Main content...</p>

        <figure>
          <img src="diagram.png" alt="Architecture diagram">
          <figcaption>System architecture overview</figcaption>
        </figure>
      </section>

      <footer>
        <p>Tags: <a href="/tag/html">HTML</a>, <a href="/tag/semantic">Semantic</a></p>
      </footer>
    </article>

    <aside>
      <h3>Related Articles</h3>
      <ul>
        <li><a href="/article1">Article 1</a></li>
        <li><a href="/article2">Article 2</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2025 Website Name. All rights reserved.</p>
    <nav>
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
    </nav>
  </footer>
</body>
</html>
```

### Common Mistakes

❌ **Wrong**: Using div for everything
```html
<div class="button" onclick="submit()">Submit</div>
<!-- Screen readers won't understand this is clickable -->
```

✅ **Correct**: Use appropriate elements
```html
<button type="submit">Submit</button>
<!-- Semantic, accessible, keyboard-friendly -->
```

❌ **Wrong**: Multiple `<main>` elements
```html
<main>First main</main>
<main>Second main</main>  <!-- ❌ Only one main per page! -->
```

✅ **Correct**: One main element
```html
<main>
  <section>First section</section>
  <section>Second section</section>
</main>
```

### Follow-up Questions
1. "What's the difference between `<section>` and `<article>`?"
2. "When should you use `<div>` vs semantic elements?"
3. "How do semantic elements help with SEO?"
4. "What is ARIA and when do you need it?"

### Resources
- [MDN: HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [HTML5 Semantic Elements](https://www.w3schools.com/html/html5_semantic_elements.asp)

---

*[File continues with 17 more comprehensive Q&A on HTML5 features, forms, meta tags, data attributes, web components, etc.]*

