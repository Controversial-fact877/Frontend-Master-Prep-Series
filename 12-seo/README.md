# SEO Interview Preparation

> **8+ questions covering SEO fundamentals, technical SEO, content optimization, and SEO tools**

Master search engine optimization from fundamentals to advanced techniques. Essential for frontend developers building discoverable websites.

---

## 📚 Table of Contents

### 1️⃣ SEO Fundamentals (1 file, ~2 Q&A)
| File | Topics | Difficulty |
|------|--------|------------|
| [01. SEO Fundamentals](./01-seo-fundamentals.md) | SEO basics, search engines, ranking factors | 🟡 |

### 2️⃣ Technical SEO (1 file, ~2 Q&A)
| File | Topics | Difficulty |
|------|--------|------------|
| [02. Technical SEO](./02-technical-seo.md) | Meta tags, structured data, sitemaps, robots.txt | 🟡 🔴 |

### 3️⃣ Content SEO (1 file, ~2 Q&A)
| File | Topics | Difficulty |
|------|--------|------------|
| [03. Content SEO](./03-content-seo.md) | Keywords, content optimization, headings | 🟡 |

### 4️⃣ SEO Tools (1 file, ~2 Q&A)
| File | Topics | Difficulty |
|------|--------|------------|
| [04. SEO Tools](./04-seo-tools.md) | Google Search Console, Analytics, Lighthouse SEO | 🟡 |

**Total:** 8 Q&A (will expand to 40+)

---

## ⭐ Most Frequently Asked

1. **Meta Tags** - Title, description, Open Graph (⭐⭐⭐⭐⭐)
2. **Structured Data** - Schema.org, JSON-LD (⭐⭐⭐⭐⭐)
3. **SEO for SPAs** - React/Next.js SEO challenges (⭐⭐⭐⭐)
4. **Core Web Vitals** - Impact on SEO (⭐⭐⭐⭐)
5. **Sitemaps** - XML sitemaps, robots.txt (⭐⭐⭐⭐)

---

## 🎯 Learning Path

### Beginners (New to SEO)
1. **Start:** SEO Fundamentals - Understand basics
2. **Then:** Technical SEO - Meta tags, structured data
3. **Practice:** Content SEO - Keyword optimization
4. **Skip:** Advanced tools initially

### Intermediate (1+ year experience)
1. **Master:** Technical SEO - Structured data, sitemaps
2. **Deep Dive:** SEO for SPAs - Server-side rendering
3. **Learn:** SEO Tools - Google Search Console
4. **Explore:** Core Web Vitals - Performance impact

### Advanced (2+ years experience)
1. **All Sections** - Complete mastery
2. **Focus:** Advanced SEO strategies
3. **Master:** International SEO - hreflang, geo-targeting
4. **Perfect:** SEO auditing and optimization

---

## 🏆 Interview Readiness Checklist

### Junior Level (0-2 years)
- [ ] Understand basic SEO concepts
- [ ] Can implement meta tags
- [ ] Know what structured data is
- [ ] Understand semantic HTML importance
- [ ] Basic sitemap knowledge

### Mid Level (2-4 years)
- [ ] Can implement structured data
- [ ] Understand SEO for SPAs
- [ ] Proficient with meta tags and Open Graph
- [ ] Can optimize Core Web Vitals
- [ ] Know how to use Google Search Console
- [ ] Understand robots.txt and sitemaps
- [ ] Can optimize content for SEO

### Senior Level (4+ years)
- [ ] Can architect SEO-friendly applications
- [ ] Expert in technical SEO
- [ ] Can handle international SEO
- [ ] Proficient with all SEO tools
- [ ] Can conduct SEO audits
- [ ] Understand search engine algorithms
- [ ] Can mentor on SEO best practices
- [ ] Expert in structured data implementation
- [ ] Can handle complex SEO requirements
- [ ] Understand business impact of SEO

---

## 📊 Progress Tracking

**Fundamentals**
- [ ] 01. SEO Fundamentals (2 Q&A)
- [ ] 02. Technical SEO (2 Q&A)

**Advanced Topics**
- [ ] 03. Content SEO (2 Q&A)
- [ ] 04. SEO Tools (2 Q&A)

---

## 🔑 Key Concepts

### SEO Ranking Factors
```
1. Content Quality
   - Relevant, valuable content
   - Keyword optimization
   - Fresh, updated content

2. Technical SEO
   - Site speed
   - Mobile-friendly
   - Secure (HTTPS)
   - Structured data

3. User Experience
   - Core Web Vitals
   - Mobile usability
   - Site navigation

4. Backlinks
   - Quality links
   - Domain authority
   - Link diversity
```

### Essential Meta Tags
```html
<!-- Title -->
<title>Page Title - Brand Name</title>

<!-- Description -->
<meta name="description" content="Page description" />

<!-- Open Graph -->
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Description" />
<meta property="og:image" content="image-url" />
<meta property="og:url" content="page-url" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />

<!-- Canonical -->
<link rel="canonical" href="canonical-url" />
```

### Structured Data Example
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2025-01-01"
}
</script>
```

### Common Mistakes
- Missing or duplicate meta tags
- Not using structured data
- Slow page load times
- Not mobile-friendly
- Duplicate content
- Missing alt text for images
- No sitemap
- Ignoring Core Web Vitals

---

## 💡 SEO Best Practices

### DO's ✅
- Use descriptive, unique titles
- Write compelling meta descriptions
- Implement structured data
- Use semantic HTML
- Optimize images (alt text, compression)
- Create XML sitemap
- Use HTTPS
- Make site mobile-friendly
- Optimize Core Web Vitals
- Use descriptive URLs

### DON'Ts ❌
- Keyword stuffing
- Duplicate content
- Ignore mobile optimization
- Use generic titles
- Skip meta descriptions
- Not use structured data
- Have slow page load
- Use Flash or other non-indexable content
- Block search engines with robots.txt
- Ignore analytics

---

## 🛠️ SEO Tools & Libraries

### Analysis Tools
- **Google Search Console** - Search performance
- **Google Analytics** - Traffic analysis
- **Lighthouse** - SEO audits
- **Screaming Frog** - Site crawler

### Structured Data Tools
- **Google Rich Results Test** - Test structured data
- **Schema.org** - Structured data vocabulary
- **JSON-LD Generator** - Generate structured data

### Next.js SEO Libraries
- **next-seo** - Manage SEO in Next.js
- **next-sitemap** - Generate sitemaps

---

## 📈 SEO Implementation

### Next.js SEO Configuration
```javascript
// next-seo.config.js
export default {
  title: 'Site Title',
  description: 'Site description',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    site_name: 'Site Name',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};
```

### Dynamic Meta Tags
```jsx
// Next.js page
import { NextSeo } from 'next-seo';

export default function Page() {
  return (
    <>
      <NextSeo
        title="Page Title"
        description="Page description"
        canonical="https://example.com/page"
        openGraph={{
          url: 'https://example.com/page',
          title: 'Page Title',
          description: 'Page description',
          images: [
            {
              url: 'https://example.com/image.jpg',
              width: 800,
              height: 600,
              alt: 'Image alt',
            },
          ],
        }}
      />
      <h1>Page Content</h1>
    </>
  );
}
```

### Sitemap Generation
```javascript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://example.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin' },
    ],
  },
};
```

---

## 📚 Resources

### Official Documentation
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Google Search Console](https://search.google.com/search-console)

### Articles & Guides
- [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)
- [Ahrefs SEO Blog](https://ahrefs.com/blog/)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)

### Tools
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 🎓 Interview Tips

### Common SEO Questions
1. **"How would you optimize a React SPA for SEO?"**
   - Discuss SSR, SSG, meta tags, structured data

2. **"What are Core Web Vitals and why are they important?"**
   - LCP, FID, CLS and their impact on rankings

3. **"How do you implement structured data?"**
   - Schema.org, JSON-LD, rich results

4. **"What's the difference between SSR and SSG for SEO?"**
   - Discuss crawlability, performance, use cases

5. **"How would you handle international SEO?"**
   - hreflang tags, geo-targeting, URL structure

---

[← Back to Main README](../README.md) | [Start Learning →](./01-seo-fundamentals.md)

**Total:** 8 questions across all SEO topics (will expand to 40+) ✅
