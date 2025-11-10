# Caching Strategies

> Browser caching, service workers, CDN caching, cache invalidation, and performance optimization.

---

## Question 1: Browser Caching Strategies

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Netflix

### Question
Explain browser caching strategies. How do Cache-Control headers work?

### Answer

**Cache-Control Directives:**
- `no-cache` - Revalidate before using
- `no-store` - Don't cache at all
- `public` - Can be cached by any cache
- `private` - Only browser cache
- `max-age=3600` - Cache for 1 hour

```javascript
// HTTP Headers
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

// Service Worker caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(['/css/style.css', '/js/app.js']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**Strategies:**
1. **Cache-First** - Use cache, fallback to network
2. **Network-First** - Try network, fallback to cache
3. **Stale-While-Revalidate** - Return cache, update in background

### Resources
- [HTTP Caching](https://web.dev/http-cache/)

---

