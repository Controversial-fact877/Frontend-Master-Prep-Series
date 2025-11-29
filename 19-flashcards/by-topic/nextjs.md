# Next.js Flashcards

> **40 Next.js concepts for modern React frameworks**

**Time to review:** 20 minutes
**Best for:** Next.js-focused roles, full-stack React positions

---

## Card 1: App Router vs Pages Router
**Q:** Key differences between App Router and Pages Router?

**A:** App Router (v13+): server components default, nested layouts, streaming, colocation. Pages Router: client components, file-based routing, getServerSideProps. App Router is future.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #routing
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 2: Server Components
**Q:** What are React Server Components in Next.js?

**A:** Components that render on server, don't ship JS to client. Default in App Router. Can't use hooks/browser APIs. Great for data fetching, reduce bundle size.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #rsc
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 3: Client Components
**Q:** When to use 'use client' directive?

**A:** When need: hooks (useState, useEffect), browser APIs, event handlers, Context, class components. Place as low as possible in tree.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #client-components
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 4: Data Fetching Methods
**Q:** Data fetching in Next.js App Router?

**A:** async/await in server components, fetch with cache options, Server Actions for mutations. No getServerSideProps/getStaticProps in App Router.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #data-fetching
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 5: Rendering Strategies
**Q:** What rendering strategies does Next.js support?

**A:** SSG (static), SSR (server-side), ISR (incremental static regeneration), CSR (client-side). Choose based on: data freshness, performance, SEO needs.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #rendering
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 6: ISR Revalidation
**Q:** How does ISR revalidation work?

**A:** revalidate: seconds in fetch or export. Regenerates page after time expires. Stale-while-revalidate pattern. Good for content that updates occasionally.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #isr
**Frequency:** ⭐⭐⭐⭐

---

## Card 7: Dynamic Routes
**Q:** How to create dynamic routes in App Router?

**A:** [param] folder for single, [...param] for catch-all, [[...param]] for optional catch-all. Access via params prop in page/layout.

**Difficulty:** 🟢 Easy
**Tags:** #nextjs #routing
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 8: Layouts
**Q:** How do layouts work in App Router?

**A:** layout.js wraps pages, persists across navigation, maintains state. Nested layouts supported. Can't access route params. Root layout required.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #layouts
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 9: Loading States
**Q:** How to show loading states in App Router?

**A:** loading.js for automatic loading UI, Suspense for granular control, streaming with loading.js. Shows while page/component loads.

**Difficulty:** 🟢 Easy
**Tags:** #nextjs #loading
**Frequency:** ⭐⭐⭐⭐

---

## Card 10: Error Handling
**Q:** Error boundaries in Next.js App Router?

**A:** error.js for automatic error UI, must be client component ('use client'). Catches errors in child components/pages. global-error.js for root errors.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #error-handling
**Frequency:** ⭐⭐⭐⭐

---

## Card 11: Route Handlers
**Q:** What are Route Handlers (API routes in App Router)?

**A:** route.js in app directory. Export GET, POST, etc functions. Replace pages/api. Can be in any folder. Support streaming, cookies, headers.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #api
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 12: Server Actions
**Q:** What are Server Actions?

**A:** 'use server' functions for mutations. Called from client components. Alternative to API routes. Built-in form support. Automatic revalidation.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #server-actions
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 13: Metadata
**Q:** How to add metadata in App Router?

**A:** Export metadata object or generateMetadata function. Static or dynamic. Supports: title, description, Open Graph, Twitter, icons, viewport.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #seo
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 14: Image Optimization
**Q:** Benefits of next/image?

**A:** Automatic optimization, responsive, lazy loading, WebP/AVIF, blur placeholder, prevents CLS. Required width/height or fill. Use priority for LCP images.

**Difficulty:** 🟢 Easy
**Tags:** #nextjs #images #performance
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 15: Font Optimization
**Q:** How does next/font work?

**A:** Automatic font optimization, self-hosting, zero layout shift, variable fonts support. Import from next/font/google or next/font/local.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #fonts #performance
**Frequency:** ⭐⭐⭐⭐

---

## Card 16: Middleware
**Q:** Use cases for Next.js middleware?

**A:** Auth checks, redirects, rewrites, A/B testing, geolocation, rate limiting. Runs before request completes. Edge runtime. Use matcher for specific paths.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #middleware
**Frequency:** ⭐⭐⭐⭐

---

## Card 17: Environment Variables
**Q:** How to use env variables in Next.js?

**A:** .env.local for secrets. NEXT_PUBLIC_ prefix for client-side. process.env.VAR_NAME. Different files for production/development.

**Difficulty:** 🟢 Easy
**Tags:** #nextjs #config
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 18: Caching Strategies
**Q:** What caching does Next.js provide?

**A:** Request memoization, Data Cache (fetch), Full Route Cache (SSG), Router Cache (client). Control with: cache, revalidate, no-store options.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #caching #performance
**Frequency:** ⭐⭐⭐⭐

---

## Card 19: Parallel Routes
**Q:** What are parallel routes?

**A:** @folder notation for simultaneous route rendering. Independent loading/error states. Use slots in layout. Good for modals, dashboards.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #routing
**Frequency:** ⭐⭐⭐

---

## Card 20: Intercepting Routes
**Q:** What are intercepting routes?

**A:** (..) notation to intercept routes. Show modal on soft navigation, full page on hard refresh. Good for photo modals, login forms.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #routing
**Frequency:** ⭐⭐⭐

---

## Card 21: Streaming
**Q:** How does streaming work in Next.js?

**A:** Send UI in chunks with Suspense. loading.js enables streaming. Improves TTFB and perceived performance. Shows content progressively.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #streaming #performance
**Frequency:** ⭐⭐⭐⭐

---

## Card 22: Revalidation
**Q:** Types of revalidation in Next.js?

**A:** Time-based (revalidate: seconds), On-demand (revalidatePath/Tag), Automatic (Server Actions). Choose based on data update frequency.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #revalidation
**Frequency:** ⭐⭐⭐⭐

---

## Card 23: generateStaticParams
**Q:** What is generateStaticParams?

**A:** Replacement for getStaticPaths. Generate params for dynamic routes at build. Used with SSG. Can generate more at runtime with dynamicParams.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #ssg
**Frequency:** ⭐⭐⭐⭐

---

## Card 24: Route Groups
**Q:** What are route groups ()?

**A:** (folder) notation to organize without affecting URL. Multiple root layouts, route organization. Parentheses not in URL.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #routing
**Frequency:** ⭐⭐⭐

---

## Card 25: Not Found
**Q:** How to handle 404s in App Router?

**A:** not-found.js for custom 404 UI. notFound() function to trigger. Automatic for unmatched routes. Can have per-route 404s.

**Difficulty:** 🟢 Easy
**Tags:** #nextjs #error-handling
**Frequency:** ⭐⭐⭐⭐

---

## Card 26: Deployment
**Q:** Best practices for Next.js deployment?

**A:** Vercel (optimal), self-hosting (Node.js/Docker), static export, edge runtime. Use ISR for dynamic, SSG for static. Configure caching headers.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #deployment
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 27: Performance Monitoring
**Q:** How to monitor Next.js performance?

**A:** Built-in Web Vitals reporting, Vercel Analytics, custom instrumentation.ts, OpenTelemetry support. Monitor: LCP, FID, CLS, TTFB.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #performance
**Frequency:** ⭐⭐⭐⭐

---

## Card 28: Static Export
**Q:** When to use static export?

**A:** next export for pure static sites. No server features: API routes, ISR, SSR, middleware. Good for: blogs, docs, simple marketing sites.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #export
**Frequency:** ⭐⭐⭐

---

## Card 29: Turbopack
**Q:** What is Turbopack?

**A:** Next.js's Rust-based bundler (successor to Webpack). Faster dev builds, HMR. Use with --turbo flag. Still beta but production-ready soon.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #tooling
**Frequency:** ⭐⭐⭐

---

## Card 30: Draft Mode
**Q:** What is Draft Mode?

**A:** Preview unpublished content. draftMode() in route handlers. Bypasses cache. Good for CMS integration. Replace Preview Mode from Pages Router.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #cms
**Frequency:** ⭐⭐⭐

---

## Card 31: Cookies & Headers
**Q:** How to access cookies/headers in App Router?

**A:** Import from next/headers: cookies(), headers(). Only in Server Components/Actions/Route Handlers. Makes route dynamic.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #server
**Frequency:** ⭐⭐⭐⭐

---

## Card 32: Redirects & Rewrites
**Q:** Difference between redirects and rewrites?

**A:** Redirect: changes URL, user sees new URL. Rewrite: proxies to different URL, user sees original. Configure in next.config.js or use redirect() function.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #routing
**Frequency:** ⭐⭐⭐⭐

---

## Card 33: Internationalization
**Q:** How to implement i18n in Next.js?

**A:** App Router: middleware + route groups. Pages Router: next.config.js i18n. Use next-intl or similar. Dynamic segments for locales.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #i18n
**Frequency:** ⭐⭐⭐

---

## Card 34: Edge Runtime
**Q:** When to use Edge Runtime?

**A:** For: middleware, some API routes, fast global responses. Limitations: no Node.js APIs, smaller bundle, different environment. Deploy to edge locations.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #edge
**Frequency:** ⭐⭐⭐

---

## Card 35: Bundle Analysis
**Q:** How to analyze Next.js bundle?

**A:** @next/bundle-analyzer package. Visualize bundle size, identify large dependencies. Run with ANALYZE=true. Optimize imports, lazy load, code split.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #performance
**Frequency:** ⭐⭐⭐⭐

---

## Card 36: Authentication
**Q:** Auth strategies in Next.js?

**A:** Middleware for protected routes, Server Actions for login, cookies for sessions. Libraries: NextAuth.js, Auth0. Check auth in Server Components.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #auth
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 37: Database Integration
**Q:** Best practices for database in Next.js?

**A:** Use in Server Components/Actions/Route Handlers. Connection pooling (Prisma, Drizzle). Never expose DB credentials client-side. Use ORMs.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #database
**Frequency:** ⭐⭐⭐⭐

---

## Card 38: Testing Next.js
**Q:** How to test Next.js apps?

**A:** Jest + React Testing Library for components, Playwright/Cypress for E2E, API route testing with supertest. Mock next/router, next/navigation.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #testing
**Frequency:** ⭐⭐⭐⭐

---

## Card 39: Migration Strategies
**Q:** How to migrate Pages Router to App Router?

**A:** Incremental adoption (both routers coexist), start with new features, move pages gradually. Use compatibility mode, update imports, refactor data fetching.

**Difficulty:** 🔴 Hard
**Tags:** #nextjs #migration
**Frequency:** ⭐⭐⭐⭐

---

## Card 40: Configuration
**Q:** Common next.config.js options?

**A:** reactStrictMode, images config, redirects/rewrites, headers, env variables, webpack config, experimental features, output: 'export'.

**Difficulty:** 🟡 Medium
**Tags:** #nextjs #config
**Frequency:** ⭐⭐⭐⭐⭐

---

[← Back to Flashcards](../README.md)
