# Next.js App Router Fundamentals

> **Master the new App Router - file-based routing, layouts, Server Components, and modern data fetching patterns**

---

## Question 1: What is the App Router and how does it differ from Pages Router?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Vercel, Airbnb, Netflix, Shopify

### Question
Explain Next.js App Router. How does it differ from the Pages Router? What are the key benefits?

### Answer

The App Router is Next.js 13+'s new routing system built on React Server Components, offering enhanced performance and developer experience.

1. **Key Differences**
   - `app/` directory vs `pages/` directory
   - Server Components by default vs Client Components by default
   - Layouts and nested routes vs _app.js wrapper
   - Built-in loading and error states
   - Streaming and Suspense support

2. **File Conventions**
   - `page.js` - Route segment UI
   - `layout.js` - Shared UI for route segment
   - `loading.js` - Loading UI with Suspense
   - `error.js` - Error boundary UI
   - `template.js` - Re-rendered layout
   - `not-found.js` - 404 UI

3. **Benefits**
   - Better performance (Server Components reduce bundle size)
   - Improved data fetching (fetch in Server Components)
   - Automatic code splitting
   - Better TypeScript support
   - Nested layouts without prop drilling

4. **Migration Path**
   - App Router and Pages Router can coexist
   - Gradual migration route by route
   - `app/` takes precedence over `pages/`

### Code Example

```javascript
// Pages Router (OLD) - pages/dashboard/settings.js
import { useRouter } from 'next/router';

export default function Settings({ user }) {
  const router = useRouter();

  return (
    <div>
      <h1>Settings for {user.name}</h1>
    </div>
  );
}

export async function getServerSideProps() {
  const user = await fetchUser();
  return { props: { user } };
}

// App Router (NEW) - app/dashboard/settings/page.js
import { fetchUser } from '@/lib/api';

export default async function SettingsPage() {
  // Fetch directly in Server Component
  const user = await fetchUser();

  return (
    <div>
      <h1>Settings for {user.name}</h1>
    </div>
  );
}

// App Router with Layout - app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <nav>
        <a href="/dashboard">Home</a>
        <a href="/dashboard/settings">Settings</a>
      </nav>
      <main>{children}</main>
    </div>
  );
}
```

### File Structure Comparison

```
Pages Router:
pages/
├── _app.js          # Global wrapper
├── index.js         # /
├── about.js         # /about
└── blog/
    ├── index.js     # /blog
    └── [slug].js    # /blog/:slug

App Router:
app/
├── layout.js        # Root layout
├── page.js          # /
├── about/
│   └── page.js      # /about
└── blog/
    ├── layout.js    # Blog layout
    ├── page.js      # /blog
    └── [slug]/
        ├── page.js  # /blog/:slug
        └── loading.js # Loading state
```

### Common Mistakes

❌ **Mistake:** Using Client Component for everything
```javascript
'use client'; // Don't add this everywhere!

export default function Page() {
  // This could be a Server Component
  const data = await fetch('/api/data'); // Error: can't use async in Client Component
}
```

✅ **Correct:** Use Server Components by default
```javascript
// No 'use client' - this is a Server Component
export default async function Page() {
  const data = await fetch('/api/data'); // Works!
  return <div>{data.title}</div>;
}
```

### Follow-up Questions

- "When would you use Pages Router over App Router?"
- "How do you handle client-side interactivity in App Router?"
- "What's the performance impact of Server Components?"
- "How does data fetching work differently in App Router?"

### Resources

- [Next.js Docs: App Router](https://nextjs.org/docs/app)
- [Server Components Explained](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

## Question 2: How does file-based routing work in App Router?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Vercel, Shopify, Meta, Airbnb

### Question
Explain file-based routing in App Router. How do dynamic routes, route groups, and parallel routes work?

### Answer

App Router uses folder structure to define routes, with special file conventions for different UI segments.

1. **Basic Routing**
   - Each folder = route segment
   - `page.js` makes route publicly accessible
   - Nested folders = nested routes

2. **Dynamic Routes**
   - `[slug]` - Single dynamic segment
   - `[...slug]` - Catch-all segment
   - `[[...slug]]` - Optional catch-all

3. **Route Groups**
   - `(folder)` - Group routes without affecting URL
   - Organize without adding path segments
   - Multiple root layouts

4. **Parallel Routes**
   - `@folder` - Render multiple pages in same layout
   - Useful for dashboards, modals
   - Independent navigation

5. **Intercepting Routes**
   - `(.)folder` - Intercept same level
   - `(..)folder` - Intercept one level up
   - Useful for modals

### Code Example

```javascript
// BASIC ROUTING
// app/blog/page.js → /blog
export default function BlogPage() {
  return <h1>Blog</h1>;
}

// app/blog/[slug]/page.js → /blog/post-1
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>;
}

// DYNAMIC ROUTES
// app/shop/[category]/[product]/page.js → /shop/electronics/laptop
export default function ProductPage({ params }) {
  const { category, product } = params;
  return (
    <div>
      <h1>{product}</h1>
      <p>Category: {category}</p>
    </div>
  );
}

// CATCH-ALL ROUTES
// app/docs/[...slug]/page.js → /docs/a/b/c
export default function DocsPage({ params }) {
  const path = params.slug.join('/'); // "a/b/c"
  return <h1>Docs: {path}</h1>;
}

// OPTIONAL CATCH-ALL
// app/shop/[[...slug]]/page.js → /shop OR /shop/a/b
export default function ShopPage({ params }) {
  const segments = params.slug || [];
  return <div>Segments: {segments.length}</div>;
}

// ROUTE GROUPS (URL not affected)
// app/(marketing)/about/page.js → /about (NOT /marketing/about)
// app/(marketing)/layout.js - Layout only for marketing pages
export default function MarketingLayout({ children }) {
  return (
    <div className="marketing">
      <header>Marketing Header</header>
      {children}
    </div>
  );
}

// app/(shop)/layout.js - Different layout for shop
export default function ShopLayout({ children }) {
  return (
    <div className="shop">
      <header>Shop Header</header>
      {children}
    </div>
  );
}

// PARALLEL ROUTES
// app/dashboard/layout.js
export default function DashboardLayout({ children, analytics, team }) {
  return (
    <div>
      <div>{children}</div>
      <div>{analytics}</div>
      <div>{team}</div>
    </div>
  );
}

// app/dashboard/@analytics/page.js
export default function Analytics() {
  return <div>Analytics Panel</div>;
}

// app/dashboard/@team/page.js
export default function Team() {
  return <div>Team Panel</div>;
}

// INTERCEPTING ROUTES (Modals)
// app/photos/page.js - Photo grid
export default function PhotosPage() {
  return (
    <div className="grid">
      <Link href="/photos/1">Photo 1</Link>
      <Link href="/photos/2">Photo 2</Link>
    </div>
  );
}

// app/photos/(..)photos/[id]/page.js - Intercept and show modal
export default function PhotoModal({ params }) {
  return (
    <dialog open>
      <h1>Photo {params.id}</h1>
      <img src={`/photos/${params.id}.jpg`} />
    </dialog>
  );
}

// app/photos/[id]/page.js - Full page when directly accessed
export default function PhotoPage({ params }) {
  return (
    <div>
      <h1>Photo {params.id}</h1>
      <img src={`/photos/${params.id}.jpg`} />
    </div>
  );
}
```

### File Structure Examples

```
Advanced routing structure:

app/
├── (marketing)/              # Route group - URL: /
│   ├── layout.js            # Marketing layout
│   ├── page.js              # Home page
│   └── about/
│       └── page.js          # /about
├── (shop)/                   # Route group - URL: /
│   ├── layout.js            # Shop layout
│   ├── products/
│   │   ├── page.js          # /products
│   │   └── [id]/
│   │       └── page.js      # /products/:id
├── dashboard/
│   ├── layout.js
│   ├── page.js              # /dashboard
│   ├── @analytics/          # Parallel route
│   │   └── page.js
│   └── @team/               # Parallel route
│       └── page.js
├── blog/
│   ├── [slug]/
│   │   └── page.js          # /blog/:slug
│   └── [...catchAll]/
│       └── page.js          # /blog/a/b/c
└── photos/
    ├── page.js              # /photos (grid)
    ├── (..)photos/          # Intercept
    │   └── [id]/
    │       └── page.js      # Modal when navigating from grid
    └── [id]/
        └── page.js          # /photos/:id (full page)
```

### Common Mistakes

❌ **Mistake:** Forgetting page.js
```
app/
└── blog/
    └── [slug]/
        └── layout.js  # ❌ Route not accessible without page.js
```

❌ **Mistake:** Wrong catch-all syntax
```javascript
// app/docs/[...]/page.js  ❌ Wrong
// app/docs/[...slug]/page.js  ✅ Correct
```

✅ **Correct:** Include page.js for accessible routes
```
app/
└── blog/
    └── [slug]/
        ├── page.js    # ✅ Route is accessible
        └── layout.js  # Optional
```

### Follow-up Questions

- "How do you generate static params for dynamic routes?"
- "What's the difference between catch-all and optional catch-all?"
- "When would you use route groups?"
- "How do parallel routes affect data fetching?"

### Resources

- [Next.js Docs: Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

---

## Question 3: What are layouts and how do they work?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Vercel, Shopify, Netflix

### Question
Explain layouts in App Router. How do nested layouts work? What's the difference between layout and template?

### Answer

Layouts are UI that's shared between multiple pages, maintaining state across navigations.

1. **Layout Characteristics**
   - Preserve state across route changes
   - Don't re-render on navigation
   - Can be nested
   - Can't access route params (use page.js)

2. **Root Layout**
   - Required at app root
   - Must include <html> and <body>
   - Applied to all routes

3. **Nested Layouts**
   - Each route segment can have layout
   - Layouts nest automatically
   - Child layout wraps page

4. **Templates vs Layouts**
   - Templates re-render on navigation
   - Layouts preserve state
   - Templates useful for animations, resetting state

### Code Example

```javascript
// ROOT LAYOUT - app/layout.js (REQUIRED)
export const metadata = {
  title: 'My App',
  description: 'App description'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>Global Header</header>
        {children}
        <footer>Global Footer</footer>
      </body>
    </html>
  );
}

// NESTED LAYOUT - app/dashboard/layout.js
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// PAGE - app/dashboard/analytics/page.js
export default function AnalyticsPage() {
  return <h1>Analytics</h1>;
}

// Rendering hierarchy:
// RootLayout
//   └─ DashboardLayout
//       └─ AnalyticsPage

// TEMPLATE (re-renders) - app/dashboard/template.js
'use client';
import { motion } from 'framer-motion';

export default function DashboardTemplate({ children }) {
  // This re-renders on every navigation
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

// LAYOUT WITH SHARED STATE
'use client';
import { useState } from 'react';

export default function ShopLayout({ children }) {
  const [cart, setCart] = useState([]);

  // Cart state persists across /shop routes
  return (
    <div>
      <nav>Cart: {cart.length} items</nav>
      {children}
    </div>
  );
}

// MULTIPLE LAYOUTS (Route Groups)
// app/(marketing)/layout.js
export default function MarketingLayout({ children }) {
  return (
    <div className="marketing">
      <nav>Marketing Nav</nav>
      {children}
    </div>
  );
}

// app/(app)/layout.js
export default function AppLayout({ children }) {
  return (
    <div className="app">
      <nav>App Nav</nav>
      {children}
    </div>
  );
}

// LAYOUT WITH DATA FETCHING
import { fetchCategories } from '@/lib/api';

export default async function ShopLayout({ children }) {
  const categories = await fetchCategories();

  return (
    <div>
      <nav>
        {categories.map(cat => (
          <a key={cat.id} href={`/shop/${cat.slug}`}>
            {cat.name}
          </a>
        ))}
      </nav>
      {children}
    </div>
  );
}

// CONDITIONAL LAYOUT CONTENT
export default function DashboardLayout({ children }) {
  return (
    <div>
      <aside>
        {/* Sidebar visible on all dashboard routes */}
      </aside>
      <main>{children}</main>
    </div>
  );
}
```

### Layout Composition Example

```
URL: /shop/products/123

Renders:
├─ app/layout.js (Root Layout)
│   └─ <html><body>
│       ├─ Global Header
│       └─ [children] ↓
│
├─ app/(shop)/layout.js (Shop Layout)
│   └─ <div className="shop">
│       ├─ Shop Nav
│       └─ [children] ↓
│
├─ app/(shop)/products/layout.js (Products Layout)
│   └─ <div>
│       ├─ Filters Sidebar
│       └─ [children] ↓
│
└─ app/(shop)/products/[id]/page.js (Product Page)
    └─ <div>Product 123 Details</div>
```

### Common Mistakes

❌ **Mistake:** Trying to access params in layout
```javascript
// app/blog/[slug]/layout.js
export default function Layout({ params }) {
  // ❌ params not available in layout
  return <div>{params.slug}</div>;
}
```

❌ **Mistake:** Missing root layout
```
app/
├── page.js  # ❌ No layout.js - Error!
```

❌ **Mistake:** Not including html/body in root layout
```javascript
// app/layout.js
export default function RootLayout({ children }) {
  return <div>{children}</div>; // ❌ Missing <html><body>
}
```

✅ **Correct:** Use params in page, pass to client components
```javascript
// app/blog/[slug]/page.js
import { ClientComponent } from './ClientComponent';

export default function BlogPost({ params }) {
  return <ClientComponent slug={params.slug} />;
}
```

### Layout vs Template

| Feature | Layout | Template |
|---------|--------|----------|
| Re-renders on navigation | ❌ No | ✅ Yes |
| Preserves state | ✅ Yes | ❌ No |
| Shares UI | ✅ Yes | ✅ Yes |
| Best for | Navigation, sidebars | Animations, form resets |

### Follow-up Questions

- "How do you share data between layouts and pages?"
- "Can layouts be client components?"
- "How do you handle authentication in layouts?"
- "What happens when you nest multiple layouts?"

### Resources

- [Next.js Docs: Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Templates](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#templates)

---

## Question 4: How do loading and error states work?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 6-8 minutes
**Companies:** Vercel, Netflix, Airbnb

### Question
Explain loading.js and error.js in App Router. How do they integrate with React Suspense and Error Boundaries?

### Answer

App Router provides built-in UI states with automatic Error Boundaries and Suspense integration.

1. **loading.js**
   - Automatic Suspense boundary
   - Shows while page/layout loads
   - Instant loading states
   - Streaming friendly

2. **error.js**
   - Automatic Error Boundary
   - Catches errors in page and children
   - Must be Client Component
   - Can recover from errors

3. **not-found.js**
   - 404 UI
   - Triggered by notFound() function
   - Can be nested

4. **Benefits**
   - No manual Suspense/ErrorBoundary setup
   - Better UX with loading states
   - Graceful error handling

### Code Example

```javascript
// LOADING STATE - app/dashboard/loading.js
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>Loading dashboard...</p>
    </div>
  );
}

// PAGE - app/dashboard/page.js
export default async function DashboardPage() {
  // While this fetches, loading.js shows
  const data = await fetchDashboardData();

  return <div>{data.title}</div>;
}

// ERROR BOUNDARY - app/dashboard/error.js
'use client'; // Must be Client Component

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="error">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// NOT FOUND - app/blog/[slug]/not-found.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>Could not find the requested post.</p>
      <Link href="/blog">Back to Blog</Link>
    </div>
  );
}

// PAGE WITH NOT FOUND - app/blog/[slug]/page.js
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/api';

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound(); // Triggers not-found.js
  }

  return <article>{post.content}</article>;
}

// NESTED LOADING STATES
// app/dashboard/loading.js - Dashboard loading
export default function DashboardLoading() {
  return <div>Loading dashboard...</div>;
}

// app/dashboard/analytics/loading.js - More specific loading
export default function AnalyticsLoading() {
  return <div>Loading analytics...</div>;
}

// STREAMING WITH SUSPENSE
import { Suspense } from 'react';
import { Analytics } from '@/components/Analytics';
import { RecentSales } from '@/components/RecentSales';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This loads immediately */}
      <div>Static content</div>

      {/* These stream in when ready */}
      <Suspense fallback={<div>Loading analytics...</div>}>
        <Analytics />
      </Suspense>

      <Suspense fallback={<div>Loading sales...</div>}>
        <RecentSales />
      </Suspense>
    </div>
  );
}

// GLOBAL ERROR - app/global-error.js
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>Application Error</h2>
        <button onClick={() => reset()}>Reset</button>
      </body>
    </html>
  );
}

// SKELETON LOADING - app/products/loading.js
export default function ProductsLoading() {
  return (
    <div className="grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton">
          <div className="skeleton-image" />
          <div className="skeleton-title" />
          <div className="skeleton-price" />
        </div>
      ))}
    </div>
  );
}

// ERROR WITH RETRY LOGIC
'use client';

import { useRouter } from 'next/navigation';

export default function Error({ error, reset }) {
  const router = useRouter();

  return (
    <div>
      <h2>Error loading data</h2>
      <div className="actions">
        <button onClick={() => reset()}>
          Retry
        </button>
        <button onClick={() => router.back()}>
          Go Back
        </button>
        <button onClick={() => router.push('/')}>
          Home
        </button>
      </div>
    </div>
  );
}
```

### File Hierarchy for Errors/Loading

```
app/
├── layout.js
├── loading.js         # Root loading (all routes)
├── error.js           # Root error boundary
├── global-error.js    # Catches errors in root layout
├── not-found.js       # Global 404
└── dashboard/
    ├── layout.js
    ├── loading.js     # Dashboard loading (overrides root)
    ├── error.js       # Dashboard errors (scoped)
    ├── page.js
    └── analytics/
        ├── loading.js # Most specific loading
        ├── error.js   # Most specific error
        └── page.js
```

### Common Mistakes

❌ **Mistake:** error.js as Server Component
```javascript
// app/error.js
export default function Error({ error }) {
  // ❌ Missing 'use client'
  return <div>{error.message}</div>;
}
```

❌ **Mistake:** Not using loading for async pages
```javascript
// Slow page with no loading state
export default async function Page() {
  const data = await slowFetch(); // User sees blank page
  return <div>{data}</div>;
}
```

✅ **Correct:** Add loading.js for better UX
```javascript
// app/error.js
'use client'; // ✅ Must be client component

export default function Error({ error, reset }) {
  return <div>{error.message}</div>;
}

// app/loading.js
export default function Loading() {
  return <div>Loading...</div>;
}
```

### Follow-up Questions

- "How do you handle errors in layouts?"
- "Can you have multiple Suspense boundaries on one page?"
- "What's the difference between error.js and global-error.js?"
- "How do you test error boundaries in App Router?"

### Resources

- [Next.js Docs: Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

---

## Question 5: What are Server Components and Client Components?

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 12-15 minutes
**Companies:** Vercel, Meta, Netflix, Airbnb

### Question
Explain Server Components and Client Components. When should you use each? How do they interact? What are the constraints?

### Answer

React Server Components (RSC) render on the server and send minimal JavaScript to the client. Client Components render in the browser.

1. **Server Components (Default)**
   - Render on server
   - Can access backend directly
   - Zero JavaScript sent to client
   - Can't use hooks or browser APIs
   - Async by default

2. **Client Components**
   - Marked with 'use client'
   - Render on client
   - Can use hooks, event handlers
   - Access to browser APIs
   - Interactive

3. **When to Use Each**
   - Server: Data fetching, backend access, large dependencies
   - Client: Interactivity, hooks, browser APIs, event handlers

4. **Interaction Rules**
   - Server Components can import Client Components
   - Client Components CAN'T import Server Components directly
   - Pass Server Components as children to Client Components

### Code Example

```javascript
// SERVER COMPONENT (default) - app/page.js
import { db } from '@/lib/database';

export default async function HomePage() {
  // Direct database access - runs on server
  const posts = await db.post.findMany();

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

// CLIENT COMPONENT - components/SearchBar.js
'use client'; // This directive makes it a Client Component

import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

// MIXING SERVER AND CLIENT - app/blog/page.js
import { db } from '@/lib/database';
import { SearchBar } from '@/components/SearchBar';
import { PostList } from '@/components/PostList';

export default async function BlogPage() {
  // Server Component - fetch on server
  const posts = await db.post.findMany();

  return (
    <div>
      {/* Client Component - interactive */}
      <SearchBar />

      {/* Pass server data to client */}
      <PostList posts={posts} />
    </div>
  );
}

// CLIENT COMPONENT WITH SERVER CHILDREN
'use client';

export function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab(0)}>Tab 1</button>
        <button onClick={() => setActiveTab(1)}>Tab 2</button>
      </div>
      {/* children can be Server Components! */}
      {children}
    </div>
  );
}

// USAGE - app/dashboard/page.js
import { Tabs } from '@/components/Tabs';
import { fetchData } from '@/lib/api';

export default async function DashboardPage() {
  const data = await fetchData(); // Server Component

  return (
    <Tabs>
      {/* This runs on server even though wrapped by client component */}
      <div>{data.title}</div>
    </Tabs>
  );
}

// WRONG: Can't import Server Component in Client Component
'use client';

import { ServerComponent } from './ServerComponent'; // ❌ Error!

export function ClientComponent() {
  return <ServerComponent />; // Won't work
}

// RIGHT: Pass as children
'use client';

export function ClientWrapper({ children }) {
  return <div className="wrapper">{children}</div>;
}

// Usage in Server Component:
export default function Page() {
  return (
    <ClientWrapper>
      <ServerComponent /> {/* ✅ Works! */}
    </ClientWrapper>
  );
}

// SERVER COMPONENT BENEFITS
import fs from 'fs'; // Can import Node.js modules
import { sql } from '@/lib/db';

export default async function DataPage() {
  // Direct file system access
  const file = fs.readFileSync('./data.txt', 'utf-8');

  // Direct database query
  const users = await sql`SELECT * FROM users`;

  // Environment variables (server-only)
  const apiKey = process.env.SECRET_API_KEY;

  return <div>{file}</div>;
}

// CLIENT COMPONENT FOR INTERACTIVITY
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function InteractiveForm() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Browser APIs
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <form>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <button onClick={() => router.push('/success')}>
        Submit
      </button>
    </form>
  );
}

// ASYNC CLIENT COMPONENT (for data fetching)
'use client';

import { useEffect, useState } from 'react';

export function ClientDataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Client-side fetch
    fetch('/api/data')
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;
  return <div>{data.title}</div>;
}

// BETTER: Fetch in Server Component
export default async function ServerDataFetcher() {
  // Runs on server - more efficient
  const data = await fetch('http://localhost:3000/api/data')
    .then(r => r.json());

  return <div>{data.title}</div>;
}
```

### Decision Tree: Server vs Client Component

```
Need interactivity (onClick, onChange, hooks)?
├─ YES → Client Component ('use client')
└─ NO → Continue

Need browser APIs (localStorage, window, document)?
├─ YES → Client Component
└─ NO → Continue

Need to fetch data or access backend?
├─ YES → Server Component (default)
└─ NO → Continue

Static UI with no state?
└─ Server Component (default)
```

### Common Mistakes

❌ **Mistake:** Using 'use client' everywhere
```javascript
'use client'; // ❌ Don't add this by default

export default function StaticPage() {
  // This doesn't need client
  return <h1>Hello</h1>;
}
```

❌ **Mistake:** Trying to use hooks in Server Component
```javascript
// Server Component (no 'use client')
export default function Page() {
  const [count, setCount] = useState(0); // ❌ Error!
  return <div>{count}</div>;
}
```

❌ **Mistake:** Importing Server Component in Client Component
```javascript
'use client';
import { ServerComponent } from './ServerComponent'; // ❌ Error

export function Client() {
  return <ServerComponent />;
}
```

✅ **Correct:** Use composition pattern
```javascript
// Client Component
'use client';
export function Client({ children }) {
  return <div>{children}</div>;
}

// Server Component
export default function Page() {
  return (
    <Client>
      <ServerComponent /> {/* ✅ Works */}
    </Client>
  );
}
```

### Server vs Client Component Comparison

| Feature | Server Component | Client Component |
|---------|-----------------|------------------|
| Default in App Router | ✅ Yes | ❌ No (needs 'use client') |
| Can be async | ✅ Yes | ❌ No |
| Can use hooks | ❌ No | ✅ Yes |
| Can access backend directly | ✅ Yes | ❌ No |
| JavaScript to client | ❌ None | ✅ Full component |
| Can have event handlers | ❌ No | ✅ Yes |
| Can use browser APIs | ❌ No | ✅ Yes |
| SEO friendly | ✅ Yes | ⚠️ Depends |

### Follow-up Questions

- "How do you pass data from Server to Client Components?"
- "What's the performance impact of Client Components?"
- "Can you use Context API with Server Components?"
- "How do you handle authentication in Server Components?"
- "What happens when you import a Client Component in a Server Component?"

### Resources

- [Next.js Docs: Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React Docs: Server Components](https://react.dev/reference/rsc/server-components)

---

[← Back to Next.js README](./README.md)

**Progress:** 5 of 6 Next.js questions

_More questions (API Routes, Middleware, Deployment) will be added..._
