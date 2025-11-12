# Next.js Deployment and Optimization

> Vercel deployment, optimization techniques, environment variables, and production best practices.

---

## Question 1: What Are the Essential Performance Optimizations for Next.js in Production?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Vercel, Meta, Netflix, Airbnb, Shopify

### Question
Explain the key performance optimizations you should implement before deploying a Next.js application to production. How do you optimize images, fonts, scripts, and bundles?

### Answer

**Next.js Production Optimization** - Systematic approach to minimizing bundle size, optimizing assets, and improving Core Web Vitals for production deployment.

**Key Points:**

1. **Image Optimization with next/image** - Automatic lazy loading, responsive images, WebP conversion, and blur placeholders
2. **Font Optimization** - Self-host Google Fonts, preload critical fonts, eliminate layout shift during font loading
3. **Code Splitting and Lazy Loading** - Automatic route-based splitting, dynamic imports for heavy components
4. **Bundle Analysis** - Identify and eliminate large dependencies, tree-shake unused code
5. **Script Loading Strategies** - Defer non-critical scripts, preconnect to third-party origins

### Code Example

```typescript
// ==========================================
// 1. IMAGE OPTIMIZATION WITH NEXT/IMAGE
// ==========================================

// ❌ BAD: Regular img tag (no optimization)
<img src="/hero.jpg" alt="Hero" />
// Problems: No lazy loading, no size optimization, no format conversion

// ✅ GOOD: Using next/image with optimization
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div>
      {/* Priority image (above fold) - preloads for LCP */}
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={1920}
        height={1080}
        priority // Disables lazy loading, preloads image
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Blur placeholder
        quality={90} // Default is 75
      />

      {/* Lazy-loaded images (below fold) */}
      <Image
        src="/product.jpg"
        alt="Product"
        width={800}
        height={600}
        loading="lazy" // Default behavior
        sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes
      />

      {/* External images require domains config */}
      <Image
        src="https://example.com/image.jpg"
        alt="External image"
        width={500}
        height={300}
        unoptimized={false} // Allow optimization
      />
    </div>
  );
}

// next.config.js - Image optimization config
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
  },
};

// ==========================================
// 2. FONT OPTIMIZATION
// ==========================================

// ❌ BAD: Loading fonts from CDN (extra request, FOUT/FOIT)
// _document.tsx
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
  rel="stylesheet"
/>

// ✅ GOOD: Self-hosted fonts with next/font
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

// Primary font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // FOUT strategy (better than FOIT)
  variable: '--font-inter', // CSS variable
  preload: true, // Preload font
  weight: ['400', '500', '700'], // Only weights you need
});

// Monospace font
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  weight: ['400', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

// Use in CSS
// styles/globals.css
body {
  font-family: var(--font-inter), sans-serif;
}

code {
  font-family: var(--font-roboto-mono), monospace;
}

// Custom/Local fonts
import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    {
      path: './fonts/MyFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/MyFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
});

// ==========================================
// 3. SCRIPT OPTIMIZATION
// ==========================================

import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Critical analytics - load early */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
          strategy="afterInteractive" // Load after page is interactive
        />

        {/* Non-critical scripts - load lazily */}
        <Script
          src="https://widget.intercom.io/widget/APP_ID"
          strategy="lazyOnload" // Load after everything else
          onLoad={() => console.log('Intercom loaded')}
        />

        {/* Inline script with strategy */}
        <Script id="analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_TRACKING_ID');
          `}
        </Script>

        {/* Preconnect to third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.example.com" />

        {children}
      </body>
    </html>
  );
}

// ==========================================
// 4. CODE SPLITTING & LAZY LOADING
// ==========================================

import dynamic from 'next/dynamic';

// ❌ BAD: Importing heavy component directly
import HeavyChart from '@/components/HeavyChart';
import VideoPlayer from '@/components/VideoPlayer';

// ✅ GOOD: Dynamic imports with loading states
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Don't render on server (if using client-only APIs)
});

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <Skeleton height={400} />,
  ssr: false,
});

// Conditional loading based on user interaction
export default function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>

      {/* Only load when needed */}
      {showChart && <HeavyChart data={chartData} />}
    </div>
  );
}

// Dynamic import with named exports
const DynamicComponent = dynamic(
  () => import('@/components/MyComponent').then(mod => mod.SpecificExport),
  { ssr: false }
);

// ==========================================
// 5. BUNDLE ANALYSIS
// ==========================================

// Install: npm install @next/bundle-analyzer

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
  reactStrictMode: true,

  // Tree shaking improvements
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.logs
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle size optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for node_modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }

    return config;
  },
});

// Run bundle analyzer
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}

// Then run: npm run analyze

// ==========================================
// 6. OPTIMIZING DEPENDENCIES
// ==========================================

// ❌ BAD: Importing entire library
import _ from 'lodash'; // Imports all of lodash (~70kb)
import * as dateFns from 'date-fns'; // Imports all functions

// ✅ GOOD: Named imports (tree-shakeable)
import { debounce, throttle } from 'lodash-es'; // Only what you need
import { format, parseISO } from 'date-fns'; // Tree-shakeable

// Even better: Use lighter alternatives
import debounce from 'just-debounce-it'; // 1kb vs lodash 70kb
import { formatDistance } from 'date-fns/formatDistance'; // Direct import

// Replace moment.js (heavy) with date-fns or dayjs
// moment.js: ~70kb minified + gzipped
// date-fns: ~2-15kb (only what you import)
// dayjs: ~2kb

// ==========================================
// 7. COMPRESSION & CACHING
// ==========================================

// next.config.js
module.exports = {
  // Enable gzip/brotli compression
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production'
    ? 'https://cdn.example.com'
    : '',

  // Headers for caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

// ==========================================
// 8. MEASURING PERFORMANCE
// ==========================================

// Enable Web Vitals reporting
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics /> {/* Automatic Web Vitals tracking */}
      </body>
    </html>
  );
}

// Custom Web Vitals tracking
// app/layout.tsx
export function reportWebVitals(metric) {
  const { id, name, label, value } = metric;

  // Send to analytics
  window.gtag?.('event', name, {
    event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js Metric',
    event_label: id,
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    non_interaction: true,
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
}

// Lighthouse CI configuration
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

### Common Mistakes

- ❌ **Not using next/image** - Missing automatic optimization, lazy loading, and format conversion
- ❌ **Loading heavy libraries entirely** - Importing whole lodash/moment instead of specific functions
- ❌ **Blocking scripts** - Loading analytics synchronously, blocking page render
- ❌ **No bundle analysis** - Shipping bloated bundles without knowing what's inside
- ✅ **Use next/image with priority flag** - Preload above-fold images for better LCP
- ✅ **Self-host fonts with next/font** - Eliminates external requests, improves performance
- ✅ **Lazy load non-critical components** - Use dynamic imports for heavy components
- ✅ **Analyze and optimize bundles** - Regular bundle analysis to catch size regressions

### Follow-up Questions

1. **What are Core Web Vitals and how do you optimize them in Next.js?** LCP (Largest Contentful Paint) - optimize with priority images and font preloading. FID (First Input Delay) - reduce JavaScript execution time. CLS (Cumulative Layout Shift) - use next/image with dimensions and font-display: swap.

2. **How do you reduce initial page load time?** Code splitting with dynamic imports, optimize images with next/image, defer non-critical scripts, enable compression, use CDN for static assets, implement proper caching headers.

3. **When should you use SSR vs SSG vs ISR for performance?** SSG for fastest performance (pre-rendered at build), ISR for dynamic content with caching (best of both worlds), SSR only when you need real-time data for every request.

### Resources
- [Next.js Production Optimization](https://nextjs.org/docs/going-to-production)
- [next/image Documentation](https://nextjs.org/docs/api-reference/next/image)
- [next/font Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Web Vitals](https://web.dev/vitals/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## Question 2: How Do You Deploy Next.js Applications to Vercel and Other Platforms?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Vercel, Meta, Amazon, Microsoft

### Question
Explain the deployment process for Next.js applications on Vercel and alternative platforms. How do you manage environment variables, configure build settings, and handle different environments (staging, production)?

### Answer

**Next.js Deployment** - Deploying Next.js applications to various platforms with proper configuration for environment variables, build optimization, and environment management.

**Key Points:**

1. **Vercel Advantages** - Zero-config deployment, automatic preview deployments, edge network, built-in analytics
2. **Environment Variables** - Separate variables for build-time (NEXT_PUBLIC_) vs runtime, secure secrets management
3. **Build Configuration** - Output modes (standalone, static export), custom build commands, caching strategies
4. **Alternative Platforms** - Docker containers, AWS Amplify, Netlify, self-hosted with PM2/Docker
5. **CI/CD Integration** - Automated testing, deployment pipelines, rollback strategies

### Code Example

```typescript
// ==========================================
// 1. VERCEL DEPLOYMENT (EASIEST)
// ==========================================

// Install Vercel CLI
// npm i -g vercel

// Deploy to preview environment
// vercel

// Deploy to production
// vercel --prod

// vercel.json configuration
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"], // US East (specific region)
  "env": {
    "DATABASE_URL": "@database-url", // Reference to secret
    "NEXT_PUBLIC_API_URL": "https://api.example.com"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_ANALYTICS_ID": "UA-XXXXXXXXX"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-blog/:slug",
      "destination": "/blog/:slug",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}

// ==========================================
// 2. ENVIRONMENT VARIABLES
// ==========================================

// .env.local (local development, NOT committed)
DATABASE_URL=postgresql://localhost:5432/mydb
SECRET_KEY=local-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000/api

// .env.production (production defaults, CAN be committed)
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_ANALYTICS_ID=UA-PRODUCTION-ID

// .env.development (development defaults, CAN be committed)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

// Accessing environment variables
// Server-side (API routes, getServerSideProps, Server Components)
export async function GET() {
  const dbUrl = process.env.DATABASE_URL; // ✅ Available
  const secretKey = process.env.SECRET_KEY; // ✅ Available
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅ Available

  // These are NOT exposed to the client
  return Response.json({ message: 'Connected to DB' });
}

// Client-side (only NEXT_PUBLIC_ variables)
export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅ Available
  const secretKey = process.env.SECRET_KEY; // ❌ undefined (not accessible)

  return <div>API URL: {apiUrl}</div>;
}

// Type-safe environment variables
// env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SECRET_KEY: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);

// Now use env.DATABASE_URL instead of process.env.DATABASE_URL

// ==========================================
// 3. DOCKER DEPLOYMENT
// ==========================================

// Dockerfile (standalone output mode)
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

// next.config.js - Enable standalone output
module.exports = {
  output: 'standalone', // Creates optimized standalone build
};

// docker-compose.yml
version: '3.8'
services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://db:5432/mydb
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

// ==========================================
// 4. AWS DEPLOYMENT (AMPLIFY)
// ==========================================

// amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*

// Environment variables in AWS Amplify Console:
// - Go to App Settings > Environment variables
// - Add: DATABASE_URL, SECRET_KEY, etc.

// ==========================================
// 5. NETLIFY DEPLOYMENT
// ==========================================

// netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

// ==========================================
// 6. SELF-HOSTED WITH PM2
// ==========================================

// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nextjs-app',
    script: 'npm',
    args: 'start',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};

// Start with PM2
// pm2 start ecosystem.config.js --env production
// pm2 save
// pm2 startup

// ==========================================
// 7. CI/CD PIPELINE (GITHUB ACTIONS)
// ==========================================

// .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

// ==========================================
// 8. MULTI-ENVIRONMENT SETUP
// ==========================================

// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:staging": "env-cmd -f .env.staging next build",
    "build:production": "env-cmd -f .env.production next build",
    "start": "next start",
    "deploy:staging": "vercel --env staging",
    "deploy:production": "vercel --prod"
  }
}

// .env.staging
NEXT_PUBLIC_API_URL=https://api-staging.example.com
NEXT_PUBLIC_ENVIRONMENT=staging

// .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENVIRONMENT=production

// Use in code
export default function ApiClient() {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div>
      <p>Environment: {env}</p>
      <p>API: {apiUrl}</p>
    </div>
  );
}
```

### Common Mistakes

- ❌ **Committing .env.local** - Exposing secrets in version control
- ❌ **Using server-only env vars in client** - Expecting process.env.SECRET_KEY to work in browser
- ❌ **Not testing build locally** - Deploying without running `npm run build` first
- ❌ **Hardcoding environment values** - Putting production URLs directly in code
- ✅ **Use NEXT_PUBLIC_ prefix for client vars** - Only these are accessible in browser
- ✅ **Separate env files per environment** - .env.local, .env.staging, .env.production
- ✅ **Test builds before deploying** - Always run `npm run build && npm start` locally
- ✅ **Use Vercel secrets for sensitive data** - Store in platform, not in code

### Follow-up Questions

1. **What's the difference between NEXT_PUBLIC_ and regular env variables?** NEXT_PUBLIC_ variables are embedded in the client bundle at build time and accessible in browser. Regular env vars are only available on server-side (API routes, getServerSideProps, Server Components).

2. **How do you handle database migrations in production?** Run migrations before deployment using CI/CD pipeline, use migration tools like Prisma Migrate or Drizzle, always test migrations on staging first, have rollback plan ready.

3. **What's the benefit of Vercel's Edge Network?** Globally distributed CDN, automatic caching of static assets, edge functions run close to users (low latency), automatic HTTPS/SSL, DDoS protection included.

### Resources
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Self-Hosting Next.js](https://nextjs.org/docs/deployment#self-hosting)

---

## Question 3: What Are the Best Practices for Next.js Error Handling and Monitoring in Production?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Netflix, Airbnb, Uber, Stripe

### Question
How do you implement comprehensive error handling and monitoring for Next.js applications in production? Explain error boundaries, API error handling, logging strategies, and monitoring tools.

### Answer

**Production Error Handling** - Systematic approach to catching, logging, and monitoring errors in Next.js applications with proper user feedback and alerting systems.

**Key Points:**

1. **Error Boundaries for React Errors** - Catch rendering errors, provide fallback UI, log errors to monitoring service
2. **API Route Error Handling** - Standardized error responses, proper status codes, error logging
3. **Global Error Pages** - Custom 404, 500 error pages with helpful messaging
4. **Monitoring and Alerting** - Sentry, LogRocket, Datadog for real-time error tracking and user session replay
5. **Logging Strategy** - Structured logging, different log levels, correlation IDs for tracing requests

### Code Example

```typescript
// ==========================================
// 1. ERROR BOUNDARIES (APP ROUTER)
// ==========================================

// app/error.tsx - Global error boundary
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    Sentry.captureException(error);
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      {error.digest && <p className="error-id">Error ID: {error.digest}</p>}

      <button onClick={reset}>
        Try again
      </button>

      <a href="/">Go home</a>
    </div>
  );
}

// app/dashboard/error.tsx - Section-specific error boundary
'use client';

export default function DashboardError({ error, reset }) {
  return (
    <div>
      <h2>Dashboard Error</h2>
      <p>Failed to load dashboard data</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}

// app/not-found.tsx - Custom 404 page
export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Return Home</a>
    </div>
  );
}

// Trigger 404 programmatically
import { notFound } from 'next/navigation';

export default async function PostPage({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound(); // Triggers app/not-found.tsx
  }

  return <div>{post.title}</div>;
}

// ==========================================
// 2. API ROUTE ERROR HANDLING
// ==========================================

// lib/api-error.ts - Custom error classes
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public errors: Record<string, string>) {
    super(400, message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// lib/error-handler.ts - Global error handler
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { ApiError } from './api-error';

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  // Handle known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          ...(error instanceof ValidationError && { errors: error.errors }),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: Record<string, unknown> };

    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        { error: { message: 'Resource already exists', code: 'DUPLICATE' } },
        { status: 409 }
      );
    }

    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        { error: { message: 'Resource not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }
  }

  // Log unknown errors to Sentry
  Sentry.captureException(error);

  // Generic error response
  return NextResponse.json(
    {
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 }
  );
}

// app/api/users/[id]/route.ts - Using error handler
import { NextRequest } from 'next/server';
import { handleApiError, NotFoundError, ValidationError } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      throw new ValidationError('User ID is required', {
        id: 'User ID cannot be empty',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

// ==========================================
// 3. SENTRY INTEGRATION
// ==========================================

// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0, // Adjust for production (0.1 = 10%)

  // Session replay for debugging
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  beforeSend(event, hint) {
    // Filter out known issues
    if (event.exception) {
      const error = hint.originalException;
      if (error && error.message?.includes('ResizeObserver')) {
        return null; // Don't send to Sentry
      }
    }
    return event;
  },
});

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// next.config.js - Sentry webpack plugin
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  // Your Next.js config
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: 'your-org',
  project: 'your-project',
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);

// ==========================================
// 4. STRUCTURED LOGGING
// ==========================================

// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
});

// Usage in API routes
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    logger.info({ requestId, path: request.url }, 'Processing request');

    // ... business logic

    logger.info({ requestId, userId: user.id }, 'Request completed');

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(
      { requestId, error: error.message, stack: error.stack },
      'Request failed'
    );

    return handleApiError(error);
  }
}

// ==========================================
// 5. CLIENT-SIDE ERROR TRACKING
// ==========================================

// app/layout.tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Global error handler
    window.addEventListener('error', (event) => {
      Sentry.captureException(event.error);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      Sentry.captureException(event.reason);
    });
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

// Custom error tracking hook
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function useErrorTracking(componentName: string) {
  useEffect(() => {
    Sentry.setContext('component', { name: componentName });

    return () => {
      Sentry.setContext('component', null);
    };
  }, [componentName]);
}

// Usage
export default function Dashboard() {
  useErrorTracking('Dashboard');

  return <div>Dashboard</div>;
}
```

### Common Mistakes

- ❌ **Not catching API errors** - Letting errors crash the application without proper handling
- ❌ **Exposing stack traces in production** - Showing detailed error info to users
- ❌ **No error monitoring** - Deploying without Sentry/LogRocket and being blind to issues
- ❌ **Generic error messages** - "Something went wrong" without any context
- ✅ **Use error boundaries** - Catch React rendering errors and show fallback UI
- ✅ **Implement structured logging** - Use correlation IDs to trace requests across services
- ✅ **Monitor production errors** - Set up Sentry with alerting for critical errors
- ✅ **Custom error pages** - Provide helpful 404/500 pages with navigation

### Follow-up Questions

1. **How do you handle errors in Server Components?** Use error.tsx files for error boundaries, return error states from async functions, use try-catch in server actions, redirect to error pages with proper messages.

2. **What's the difference between error.tsx and global-error.tsx?** error.tsx catches errors in specific route segments, global-error.tsx catches errors in root layout (must be in app directory root). global-error.tsx replaces entire page including layout.

3. **How do you prevent error monitoring from impacting performance?** Sample errors (don't send 100%), use async error reporting, filter out known issues, set appropriate trace sample rates (10-20% for production).

### Resources
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Pino Logger](https://github.com/pinojs/pino)
- [LogRocket](https://logrocket.com/)

---