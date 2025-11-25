# Next.js Optimization

> Performance optimization: images, fonts, bundles, and production best practices

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

---

### 🔍 Deep Dive: Deployment Architecture & Platform Internals

**Vercel's Edge Network Architecture:**
Vercel uses a globally distributed edge network built on top of AWS, Cloudflare, and custom infrastructure. When you deploy to Vercel, your Next.js application gets compiled into three distinct outputs: API lambdas for serverless routes, static assets for images/CSS/JS, and HTML pages for SSR. The build process uses intelligent bundling—your application is analyzed for dependencies, and common chunks are extracted to maximize cache hits across deployments.

The key architectural difference: Vercel automatically parallelizes your build into multiple lambdas (one per API route + one for rendering). Each lambda is isolated, meaning if one API route has a memory leak, it doesn't affect others. The platform handles scaling transparently—if your `/api/users` endpoint suddenly gets 10,000 requests, Vercel spins up additional lambda instances automatically.

**Environment Variable Resolution at Build vs Runtime:**
This is where many deployments fail. `NEXT_PUBLIC_` variables are embedded into your JavaScript bundle at build time—they become literal strings in your compiled code. This means: (1) They're visible to anyone inspecting network traffic, (2) They must be set BEFORE the build runs, (3) Changing them requires a new build and deployment.

Regular environment variables are only available to Node.js processes on the server. They're loaded into `process.env` after the lambda starts. This means: (1) They can be changed without rebuilding, (2) They're never exposed to the client, (3) Server Components and API routes can access them.

**Docker Deployment Internals:**
When you use Docker with standalone output mode (`output: 'standalone'`), Next.js generates a minified `.next/standalone` directory containing only necessary dependencies. This is crucial for Docker efficiency—instead of bundling all 500MB of node_modules, Docker only copies ~150MB of production-only packages. The multi-stage Dockerfile (base → deps → builder → runner) allows Docker to cache each layer independently, reducing rebuild times from 5 minutes to 30 seconds when only your code changes.

The runner stage uses a non-root user (uid:1001) for security, adds comprehensive signal handlers for graceful shutdown, and configures memory limits. Most production failures occur because applications don't handle SIGTERM properly—your Node.js process needs 30 seconds to close connections, but the orchestrator only waits 10 seconds before force-killing.

**Self-Hosting with PM2:**
PM2 cluster mode uses Node's built-in cluster module. With `instances: 'max'`, PM2 spawns one process per CPU core. When a request arrives, the OS kernel's load balancer (not PM2) routes it to the least-loaded process. This is more efficient than thread pools because each process is independent—if one has a memory leak, others continue operating. However, you lose horizontal scaling (can't add more servers without manual config) and must implement your own health checks.

**CI/CD Integration Patterns:**
Most deployment failures happen in CI/CD. The issue: your test environment and CI environment are different. A common mistake is setting environment variables in GitHub Actions but forgetting that `NEXT_PUBLIC_` variables need to be embedded DURING build, not at runtime. Solution: use separate build secrets (for build-time public variables) and deployment secrets (for runtime variables).

**Caching Strategies Across Platforms:**
Vercel aggressively caches `.next/static` files with 1-year cache headers (immutable content). However, your HTML files use 0-second cache to ensure users get fresh content. AWS Amplify uses different defaults (30-second cache on HTML), which can cause stale pages. Self-hosted solutions need manual cache configuration in nginx/Apache.

---

### 🐛 Real-World Scenario: Multi-Environment E-Commerce Deployment

**Context:** You're deploying an e-commerce platform to staging and production. Staging must use a test payment processor (Stripe test mode) and test database. Production uses live payment processing.

**Metrics Before Optimization:**
- Staging deployments: 12 minutes (waiting for builds, environment variables mismatch)
- Production incidents: 2-3 per month due to environment variable misconfiguration
- Rollback time: 8 minutes (manual process)
- Environment variable errors: Account for 40% of production incidents

**The Problem You Hit:**
1. Developer sets `NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx` in staging by mistake
2. Staging builds with production Stripe key embedded
3. Users in staging accidentally charge their real credit cards
4. By the time you notice (30 minutes later), 15 charges have been made

**Root Cause Analysis:**
- No automated checks for environment variable safety
- `NEXT_PUBLIC_` vs regular variables confusion
- No pre-deployment validation
- Different staging/production configurations weren't validated

**Solution Implementation:**

1. **Create environment variable schema validation:**
```typescript
// lib/env.ts - Validates env vars at build time AND runtime
import { z } from 'zod';

const envSchema = z.object({
  // These must match between environments
  NODE_ENV: z.enum(['development', 'production', 'staging']),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'production', 'staging']),

  // Payment processor - never embed live keys in staging
  NEXT_PUBLIC_STRIPE_KEY: z.string().refine(
    (key) => {
      if (process.env.NODE_ENV === 'staging' && key.startsWith('pk_live')) {
        throw new Error('❌ Live Stripe key detected in staging build!');
      }
      return true;
    },
    'Cannot use live Stripe key in staging'
  ),

  // Database URL - staging/production must be different
  DATABASE_URL: z.string().url().refine(
    (url) => {
      if (process.env.NODE_ENV === 'production' && url.includes('staging')) {
        throw new Error('❌ Staging database URL detected in production!');
      }
      return true;
    },
    'Database URL mismatch detected'
  ),
});

export const env = envSchema.parse(process.env);
```

2. **Configure separate environment files with validation:**
```
.env.staging:
  NODE_ENV=staging
  NEXT_PUBLIC_ENVIRONMENT=staging
  NEXT_PUBLIC_STRIPE_KEY=pk_test_xxxxx (test key)
  DATABASE_URL=postgresql://staging-db:5432/ecommerce

.env.production:
  NODE_ENV=production
  NEXT_PUBLIC_ENVIRONMENT=production
  NEXT_PUBLIC_STRIPE_KEY=pk_live_xxxxx (live key)
  DATABASE_URL=postgresql://prod-db:5432/ecommerce
```

3. **Pre-deployment validation in CI/CD:**
```yaml
# .github/workflows/deploy.yml
- name: Validate Environment Variables
  run: |
    npm run validate:env  # Custom script checking for live keys in staging

- name: Build with environment validation
  env:
    NODE_ENV: ${{ matrix.environment }}
    NEXT_PUBLIC_STRIPE_KEY: ${{ secrets[matrix.stripe_key] }}
  run: npm run build  # Build fails if env validation fails
```

**Metrics After Implementation:**
- Staging deployments: 3 minutes (cached builds, validated env vars)
- Production incidents: 0 related to environment variables (12-month track record)
- Rollback time: 1 minute (automated rollback in CI/CD)
- Build failures caught immediately: 100% of environment variable errors

**Key Lesson:** The most dangerous deployments are the ones that appear to work but use wrong configuration. Validate early, fail hard at build time rather than runtime.

---

### ⚖️ Trade-offs: Deployment Platform Comparison

**Vercel vs Docker Self-Hosting:**

| Factor | Vercel | Docker Self-Hosted |
|--------|--------|-------------------|
| **Setup Time** | 2 minutes (git push) | 2 hours (infrastructure setup) |
| **Scaling** | Automatic (transparent) | Manual (need orchestrator like K8s) |
| **Cost** | $20/month hobby → $150+/month team | $50-500/month servers (fixed) |
| **Cold Starts** | ~200ms (optimized) | ~500ms-2s (depends on orchestrator) |
| **Observability** | Built-in analytics, logs included | Must set up own logging (ELK, datadog) |
| **Deployment Speed** | 30 seconds | 5-10 minutes |
| **Vendor Lock-in** | High (Next.js specific optimizations) | Low (standard Docker) |
| **Environment Variables** | UI-based management | Must script/configure manually |

**When to choose Vercel:**
- Startup/MVP (time to market critical)
- Small team (no DevOps resources)
- Next.js specific features matter (ISR, Edge Functions)
- Global distribution important (built-in CDN)

**When to choose Docker:**
- Already using Kubernetes
- Significant cost at scale (>50M requests/month)
- Need total control over infrastructure
- Multi-language deployment (not just Node.js)
- Data residency requirements (specific countries)

**Vercel vs AWS Amplify:**

Amplify is cheaper for compute but requires more configuration. Vercel includes built-in edge functions and better Next.js integration. Both use similar underlying infrastructure (AWS Lambda). The real difference: Vercel's build system is optimized for Next.js (understands ISR, parallel routes), while Amplify is generic (treats Next.js like any Node.js app).

**Docker Multi-stage Build Trade-off:**
```
Single-stage: 1.2GB (includes all dependencies + build tools)
→ Fast to build locally (everything present)
→ Slow to deploy (large image, long upload)

Multi-stage: 350MB (production only)
→ Slow to build locally (downloads dependencies twice)
→ Fast to deploy (small image, quick upload)

Decision: Use multi-stage for production (saves 70% bandwidth), single-stage locally.
```

**Environment Variable Management Trade-off:**

Storing in version control:
- Pro: Can track changes, see history
- Con: Sensitive data exposure risk

Storing in platform UI:
- Pro: Secure, no accidental commits
- Con: Can't track changes, harder to debug

Solution: Store ALL non-secret values in .env files (committed), secrets in platform (not committed). Use git hooks to prevent committing secrets.

---

### 💬 Explain to Junior: Deployment Concepts & Interview Answers

**1. What is Vercel and why is it popular for Next.js?**

**Analogy:** If Next.js is a specialized racing bike, Vercel is the pit crew that knows exactly how to maintain it. Most hosting platforms are "generic tire shops"—they can handle any vehicle but won't optimize for your specific bike.

**Interview Answer Template:**
"Vercel is the company that created Next.js, so they've optimized their platform specifically for it. When you deploy to Vercel, it automatically understands your Next.js project structure—it knows which routes are API routes, which can be static, which need server-side rendering. It automatically parallelizes your build across multiple lambda functions and includes a global CDN for free. Most importantly, preview deployments are automatic—every pull request gets its own live URL for testing. The main advantage over other platforms is the zero-configuration approach—git push, and it just works."

**2. What's the difference between NEXT_PUBLIC_ and regular environment variables?**

**Analogy:** Think of your house. `NEXT_PUBLIC_` variables are like your address (publicly visible, printed on envelopes). Regular environment variables are like your WiFi password (secret, only for people in your house). If you accidentally print your WiFi password on envelopes, everyone will know it.

**Interview Answer Template:**
"NEXT_PUBLIC_ variables are embedded into the client-side JavaScript bundle at build time—they become literal values in the code that the browser downloads. This means they must be set before the build runs, and anyone can inspect them in browser DevTools. Regular environment variables are only available to server-side code (API routes, Server Components, getServerSideProps). They're never sent to the browser. So if I have a database URL, I'd never prefix it with NEXT_PUBLIC_—that would expose my database location to attackers. The naming convention makes this explicit: NEXT_PUBLIC_ = safe to embed in client code, no prefix = secret, server-only."

**3. How do you handle different configurations for staging vs production?**

**Analogy:** It's like having a practice concert and a real concert. The practice version has all the same songs but maybe fewer lights and smaller audience. The real concert uses professional equipment and charges money. You need completely different setups, but the same basic structure.

**Interview Answer Template:**
"I'd create separate `.env.staging` and `.env.production` files with environment-specific values. For example, staging uses Stripe test mode (test keys), production uses live payment processing. In my deployment setup, I'd use conditional environment selection—if building for production, load `.env.production`, if for staging, load `.env.staging`. I'd also add validation at build time: if a production build somehow gets a staging database URL, the build should fail immediately rather than deploy broken code. This catches configuration mistakes before they hit users. Most companies use their deployment platform's secrets management (Vercel's UI, AWS Secrets Manager) rather than committing to git."

**4. What's a Docker deployment and when would you use it instead of Vercel?**

**Analogy:** Vercel is like renting an apartment (Vercel handles everything). Docker is like buying a house (you have total control but also total responsibility). You'd buy a house if you want to renovate exactly how you want, or if you're comparing costs across 50 houses. For a one-bedroom apartment, renting is usually cheaper.

**Interview Answer Template:**
"Docker is a containerization tool that packages your entire application with its dependencies into a container. Instead of hoping the hosting platform has the right Node version and dependencies, Docker guarantees consistency—'if it runs in Docker on my laptop, it runs the same way in production.' I'd use Docker when: (1) deploying to Kubernetes or container orchestration, (2) running multiple services besides Next.js, (3) needing to stick with open-source infrastructure, (4) cost is critical (Docker is cheaper at massive scale). The Dockerfile is basically a recipe: start with Node 18, install dependencies, build the app, then run it. The multi-stage Dockerfile is smart—it builds the app in one container (with all dev tools), then copies only the essentials to a smaller final container, reducing size from 1GB to 300MB."

**5. What happens if your environment variables are wrong during deployment?**

**Interview Answer Template:**
"It depends on which variables are wrong. If NEXT_PUBLIC_API_URL is wrong, the build might succeed but the app will try to call the wrong API endpoint—users see a broken app. If a regular environment variable like DATABASE_URL is wrong, the API routes fail with connection errors. If you're not validating, you might not notice for hours. The best practice is to validate environment variables at build time: I'd use a schema validation library (like Zod) that checks during the build—'if DATABASE_URL doesn't look like a valid Postgres URL, fail the build.' This means bad config gets caught in CI/CD, not discovered by customers. For secrets like API keys, I use the platform's native secrets management rather than committing to git. And I use separate .env files per environment so staging can't accidentally use production keys."

**Interview Answer Checklist:**
✅ Explain NEXT_PUBLIC_ vs server variables
✅ Mention validation at build time
✅ Show awareness of staging vs production
✅ Know the difference between Vercel and Docker
✅ Understand that wrong env vars cause silent failures
✅ Know how to use platform secrets management

---

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

---

### 🔍 Deep Dive: Error Boundaries & V8 Exception Handling

**React Error Boundaries in Next.js App Router:**
Error boundaries work differently in App Router vs Pages Router. In App Router, `error.tsx` files create boundaries at specific route segments. When a Server Component throws, Next.js serializes the error and sends it to the Client Component's error boundary. This is crucial: Server-side errors become client-side Error objects, losing some context.

The error digest (`error.digest`) is a hash of the error stack. Next.js uses this to group similar errors in Sentry. For example, two different users with the same bug will have the same digest, letting you see it affects 1,000 users, not that you have 500 different errors.

**Error Serialization in Server Components:**
This is a common trap. When a Server Component throws an error like `new Error('Database connection failed')`, Next.js must serialize it to send to the client. Serialization removes the prototype—your custom error class becomes a plain object. Your `instanceof ApiError` checks fail. Solution: check `error.name` or `error.code` instead of `instanceof`.

```javascript
// ❌ Won't work after serialization
if (error instanceof ValidationError) { }

// ✅ Works after serialization
if (error.code === 'VALIDATION_ERROR') { }
```

**V8 Stack Trace Parsing:**
When Sentry captures an error, it parses the JavaScript stack trace to show you which file and line threw. V8 (Chrome's engine) uses a specific stack format. The stack trace includes source map information—Sentry uses `.map` files to map minified code back to original code. This is why you must upload source maps to Sentry during deployment.

Sentry's breadcrumb system records the last 100 user interactions before the error. This is invaluable for reproduction: you see "user clicked button → fetched data → error threw." For performance, Sentry samples breadcrumbs (stores 1 in 100) to avoid memory bloat.

**Error Monitoring Architecture:**
When your app throws an error:
1. Browser captures exception and stack trace
2. Error is queued in memory (up to 100 errors)
3. Sentry SDK batches them and sends to Sentry servers (every 2 seconds or when queue full)
4. Network error occurs? The SDK retries 3 times, then drops
5. Sentry deduplicates by fingerprint (grouping identical errors)
6. Sentry alerts you if error rate > threshold

The key: don't send 100% of errors. A production bug affecting 10,000 users generates 10,000 errors. Sending all would overwhelm Sentry. Instead, sample: send 10% of errors, but 100% of errors affecting new users.

**Structured Logging vs String Logging:**

String logging: `console.log('User login failed: ' + userId)`
- Can't parse programmatically
- Hard to search (grep is slow)
- No built-in context

Structured logging: `logger.error({ userId, reason: 'invalid_password' }, 'User login failed')`
- Can search/filter by any field
- Aggregatable (find all login failures by user)
- Correlatable (attach request ID, trace ID)

Structured logging tools like Pino output JSON, which log aggregation systems (ELK, Datadog) parse and make searchable. Without this, you're searching megabytes of text logs with grep.

**Correlation IDs for Request Tracing:**
In microservices, a single user request might touch 5 services. Without correlation IDs:
- Service A logs "User signup started"
- Service B logs "Email service error"
- Service C logs "Database timeout"
- You can't connect which user had the problem

With correlation IDs:
1. API gateway generates UUID for each request: `correlation-id: abc123`
2. Every service logs with this ID: `{ correlationId: 'abc123', action: 'signup' }`
3. Log aggregation system shows all logs for correlation-id=abc123
4. You see the complete request flow across all services

**Error Rate Monitoring:**
Sentry tracks error rates over time. The key metric: error rate per release.
```
Release v1.2.0: 5 errors / 1M requests = 0.0005% error rate (acceptable)
Release v1.2.1: 500 errors / 1M requests = 0.05% error rate (100x worse!)
```

This automatically triggers regression detection. Sentry sees v1.2.1 is worse and alerts you. This is how you catch bugs before users see them.

---

### 🐛 Real-World Scenario: E-Commerce Checkout Error Debugging

**Context:** Your e-commerce site's checkout is broken. Users see generic "Something went wrong" errors. You have 500 failed orders per hour, each costing $50 in lost revenue.

**Initial Situation:**
- No error tracking implemented
- Application logs in text files on server
- Users report errors in support tickets with vague descriptions
- Takes 2-3 hours to find the issue in logs
- No way to reproduce locally

**Metrics Before Monitoring:**
- MTTR (Mean Time to Recovery): 180 minutes
- MTTD (Mean Time to Detect): 30 minutes (someone must complain)
- Lost revenue per incident: ~$25,000
- Incidents per month: 3-4

**The Problem You Hit:**

Saturday night: "Something went wrong" errors spike to 1000/minute. Support gets flooded.

```
User reports: "Checkout failed after I entered my credit card"
Support tech: "Can you try again?" (No logs to check)
2 hours later: Someone logs into server, finds:
  "Error: pool.query is not a function"
```

Root cause: A database driver update broke connection pooling, but the error message was swallowed.

**Solution Implementation:**

1. **Set up Sentry with Next.js:**
```typescript
// lib/sentry.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Trace sample rate: Capture 100% of errors, but only 20% of normal transactions
  tracesSampleRate: 0.2,

  // Session replay: Capture 100% when error happens (record user actions)
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1, // 10% of all sessions

  // Before sending to Sentry, filter out known non-actionable errors
  beforeSend(event) {
    // Ignore ResizeObserver errors (common browser quirk)
    if (event.exception?.values?.[0]?.type === 'ResizeObserverError') {
      return null;
    }
    return event;
  },
});
```

2. **Add detailed error context to checkout:**
```typescript
// app/api/checkout/route.ts
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  const transactionId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { cartId, customerId, amount } = body;

    logger.info(
      {
        transactionId,
        cartId,
        customerId,
        amount,
        action: 'checkout_started'
      },
      'Checkout initiated'
    );

    // Payment processing
    const paymentResult = await processPayment({
      customerId,
      amount,
      transactionId,
    });

    if (!paymentResult.success) {
      logger.warn(
        {
          transactionId,
          paymentError: paymentResult.error,
          duration: Date.now() - startTime,
        },
        'Payment declined'
      );

      return NextResponse.json(
        {
          error: 'Payment declined. Please check your card details.',
          transactionId, // User can provide this to support
        },
        { status: 402 }
      );
    }

    // Save order
    const order = await prisma.order.create({
      data: {
        customerId,
        transactionId,
        amount,
        status: 'completed',
      },
    });

    logger.info(
      {
        transactionId,
        orderId: order.id,
        duration: Date.now() - startTime,
      },
      'Checkout completed successfully'
    );

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    const duration = Date.now() - startTime;

    // Critical: Log detailed error information
    logger.error(
      {
        transactionId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        duration,
      },
      'Checkout failed'
    );

    // Send to Sentry with context
    Sentry.captureException(error, {
      contexts: {
        checkout: {
          transactionId,
          duration,
          errorStage: 'payment_processing', // Which step failed
        },
      },
    });

    return NextResponse.json(
      {
        error: 'Checkout failed. Our support team has been notified.',
        transactionId, // User provides this to support
      },
      { status: 500 }
    );
  }
}
```

3. **Client-side error tracking:**
```typescript
// app/checkout/page.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';

export default function CheckoutPage() {
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          // ...checkout data
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        // If payment was declined (402), don't report to Sentry
        if (response.status === 402) {
          setError(data.error);
          return;
        }

        // Server error (500) - report to Sentry with context
        Sentry.captureException(new Error('Checkout failed'), {
          contexts: {
            checkout: {
              transactionId: data.transactionId,
              status: response.status,
            },
          },
        });

        setError(data.error);
        return;
      }

      const result = await response.json();
      // Success - redirect
      window.location.href = `/order-confirmation/${result.orderId}`;
    } catch (error) {
      // Network error
      Sentry.captureException(error);
      setError('Network error. Please check your connection.');
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>Complete Checkout</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

**Metrics After Implementation:**
- MTTR: 15 minutes (Sentry alert → look at transaction → fix)
- MTTD: 30 seconds (Sentry automatic detection)
- Lost revenue per incident: $250 (caught almost immediately)
- Incidents per month: 1 (issues caught in staging before production)

**Key Features That Helped:**
- Transaction ID visible to user → user can reference in support chat
- Session replay shows exactly what user did
- Structured logging shows step-by-step flow
- Error context (which stage failed) narrows debugging
- Sentry's error grouping prevents alert fatigue

---

### ⚖️ Trade-offs: Monitoring Solutions Comparison

**Sentry vs LogRocket vs Datadog:**

| Aspect | Sentry | LogRocket | Datadog |
|--------|--------|-----------|---------|
| **Primary Use** | Error tracking | Session replay | Full observability |
| **Cost** | $29/month → $999/month | $99/month → $799/month | $15/host/month |
| **Session Replay** | Optional (limited) | Excellent (core feature) | Basic |
| **Error Context** | Excellent | Good (connected to replays) | Good (but not replay) |
| **API Performance Monitoring** | Good | Limited | Excellent |
| **Log Aggregation** | Limited | Not included | Excellent |
| **Setup Complexity** | Very easy (2 lines) | Easy | Moderate |
| **Best For** | Frontend error tracking | Debugging user bugs | Infrastructure teams |

**When to choose each:**

**Sentry:**
- You want 90% of the benefit with 10% of the setup
- Focused on frontend/backend error tracking
- Budget <$200/month
- Team size: 5-20 people

**LogRocket:**
- You need to debug "it works in dev but not in prod"
- Session replay is critical (fintech, healthcare)
- Can afford $500+/month

**Datadog:**
- Already using it for infrastructure monitoring
- Need full stack observability
- High-volume applications (1M+ events/minute)
- Enterprise requirements

**Error Monitoring Sample Rate Trade-off:**

Send 100% of errors:
- Pro: See every error
- Con: Sentry quota fills quickly (costs $$$), log noise

Send 10% of errors:
- Pro: 90% cheaper
- Con: Might miss rare bugs affecting 1% of users

Solution: Adaptive sampling
- Send 100% of errors affecting NEW users
- Send 100% of critical errors (500+ errors in 5 min)
- Send 10% of routine errors

**Structured Logging vs Simple Logging:**

Simple: `console.log('User login failed')`
- Pro: Works immediately
- Con: No context, unsearchable at scale

Structured: `logger.error({ userId, reason }, 'User login failed')`
- Pro: Searchable, aggregatable, correlatable
- Con: Requires library (Pino, Winston, bunyan)

Decision: Use structured logging if application handles >100 requests/second.

**Local Console vs Centralized Logging:**

Local only (logs on server):
- Pro: Free
- Con: Lost when server restarts, unsearchable at scale

Centralized (ELK, Datadog):
- Pro: Persistent, searchable, correlatable across services
- Con: Costs money, requires infrastructure

Decision: Use centralized if you have >2 servers or >1000 users.

---

### 💬 Explain to Junior: Error Handling & Monitoring Interview Answers

**1. What's an error boundary and why do you need it?**

**Analogy:** An error boundary is like a airbag in a car. When one component crashes, the airbag (error boundary) catches it so the whole car doesn't shut down. Without it, a rendering error in one component breaks the entire page.

**Interview Answer Template:**
"An error boundary is a React component that catches errors in child components during rendering. If something goes wrong (division by zero, missing data), the error boundary catches it, logs it, and shows a fallback UI instead of crashing the whole page. In Next.js App Router, you create an `error.tsx` file in your route—this becomes the error boundary for that section. For example, if your dashboard has an error, the error.tsx catches it, shows 'Dashboard failed to load,' and the rest of the page still works. The key benefit: users see a helpful message instead of a blank screen. You should log errors to a service like Sentry so you know what's breaking in production."

**2. How do you handle errors in API routes?**

**Interview Answer Template:**
"I create a custom error class hierarchy (ValidationError, NotFoundError, UnauthorizedError) so different error types return appropriate HTTP status codes. I wrap API logic in try-catch, and in the catch, I call a centralized error handler. The error handler checks the error type and returns appropriate responses: ValidationError returns 400, NotFoundError returns 404, database errors return 500. I also log all errors to Sentry with context—which endpoint, which user, what data failed. This way, I can see 'batch of 500 POST /api/users failures at 3pm because database was down.' For user-facing errors, I return helpful messages ('Invalid email format'), but I never expose stack traces in production."

**3. What's the difference between NEXT_PUBLIC_SENTRY_DSN and SENTRY_DSN?**

**Analogy:** One is a public phone number (for customers to call), one is a secret line (for staff only).

**Interview Answer Template:**
"NEXT_PUBLIC_SENTRY_DSN is the public key that goes in the browser—it tells the JavaScript code where to send errors. Any user can see this in their browser's Network tab. SENTRY_DSN is the secret key that goes on the server—it's used for server-side error reporting (API routes, Server Components). The public key only allows sending errors, not reading data. The secret key can read historical errors, so you never expose it to the client. If I accidentally expose the secret key in the browser, an attacker could query my entire error history."

**4. How do you debug a production error that you can't reproduce locally?**

**Interview Answer Template:**
"Session replay is crucial for this. I set Sentry to capture 100% of sessions where errors happen, so I can watch the user's exact clicks and actions before the error occurred. I also add context to errors—which user, which feature, what state they were in. I make sure API endpoints log structured data (not just 'Error'), so I can search logs for that user's requests. I also add transaction IDs to tracking so I can trace a single request through the entire system. With all this, I can usually reproduce: 'Oh, they were on a slow 3G connection, clicked the button 3 times, and our code didn't handle concurrent requests.' Locally, I simulate slow networks and concurrent requests to test."

**5. What's a good error monitoring strategy?**

**Interview Answer Template:**
"First, differentiate: not all errors are the same. A payment declining is expected (user error), but a database connection failing is a bug. Expected errors should log to the database (user can see 'Card declined'), but not alert engineers. Unexpected errors should go to Sentry and page engineers at 2am. Second, add context: don't just log 'Error: undefined.' Log the full picture—which user, what were they doing, what data caused it. Third, use structured logging: log JSON objects that you can search, not string concatenation. Fourth, monitor error rates by release: when you deploy, watch the error rate spike. If it does, auto-rollback. Fifth, implement session replay for the top 10% of errors—you can't replay every error (costs too much), but you can replay the critical ones."

**Interview Answer Checklist:**
✅ Understand error boundaries (React, not JavaScript)
✅ Know custom error classes for API handling
✅ Differentiate public keys (browser) vs secret keys (server)
✅ Use context and structured logging
✅ Know how session replay helps debugging
✅ Implement error rate monitoring
✅ Understand sampling (not 100% of errors)

---

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

## Question 4: How Do You Optimize Images in Next.js Using next/image?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Netflix, Amazon, Vercel

### Question
Explain Next.js image optimization using the `next/image` component. How does automatic optimization work? What are the best practices for responsive images, blur placeholders, and optimizing Largest Contentful Paint (LCP)?

### Answer

**Next.js Image Optimization** - Automatic image optimization, lazy loading, modern format conversion (WebP/AVIF), responsive sizing, and blur placeholders to improve Core Web Vitals metrics.

**Key Points:**

1. **Automatic Optimization** - On-demand image optimization, format conversion to WebP/AVIF, quality adjustment, resizing based on device
2. **Lazy Loading** - Images load only when entering viewport, reducing initial bundle size and bandwidth
3. **Responsive Images** - Multiple sizes served based on device viewport using srcSet
4. **Blur Placeholders** - Low-quality image placeholders prevent layout shift and improve perceived performance
5. **Priority Loading** - Critical images (above-the-fold) load immediately to optimize LCP

---

### 🔍 Deep Dive: Image Optimization Pipeline & Browser Rendering

**Next.js Image Optimization Architecture:**
When you use `<Image src="/hero.jpg" width={800} height={600} />`, Next.js doesn't just serve the original file. Instead, it creates an optimization pipeline that runs entirely on-demand—no build-time processing. Here's the exact flow:

1. **First request:** Browser requests `/_next/image?url=/hero.jpg&w=828&q=75`
2. **Next.js checks cache:** Is this exact size/quality already optimized? If yes, serve from cache (instant). If no, continue.
3. **Sharp library processes image:** Next.js uses Sharp (libvips wrapper) to resize the image to exactly 828px width, convert to WebP (if browser supports it), and compress to quality=75.
4. **Response headers:** Next.js sends `Cache-Control: public, max-age=31536000, immutable` for the optimized image, meaning browsers cache it for 1 year.
5. **Subsequent requests:** Browser serves from cache (0ms latency).

The critical insight: this happens on-demand, not at build time. If you have 10,000 product images, Next.js doesn't optimize all 10,000 during build—it optimizes each one when first requested. This is why Vercel charges for image optimization (compute costs).

**WebP vs AVIF Format Selection:**
Next.js automatically detects browser capabilities via the `Accept: image/avif,image/webp,image/apng,image/*` header. The priority:
1. AVIF (best compression, ~30% smaller than WebP, but slower to encode)
2. WebP (good compression, ~25% smaller than JPEG, fast encoding)
3. Original format (fallback for old browsers)

The trade-off: AVIF encoding takes 5-10x longer than WebP. For most use cases, Next.js defaults to WebP because the encoding speed matters for on-demand optimization. You can force AVIF with `formats={['image/avif', 'image/webp']}`, but expect slower initial loads.

**Responsive Image srcSet Generation:**
When you specify `sizes="(max-width: 768px) 100vw, 50vw"`, Next.js generates multiple image sizes:
```html
<img
  srcset="
    /_next/image?url=/hero.jpg&w=640 640w,
    /_next/image?url=/hero.jpg&w=750 750w,
    /_next/image?url=/hero.jpg&w=828 828w,
    /_next/image?url=/hero.jpg&w=1080 1080w,
    /_next/image?url=/hero.jpg&w=1200 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

The browser chooses the optimal size: if viewport is 375px (iPhone), it downloads the 640w version (not the full 1200w). This saves bandwidth: 50KB instead of 300KB.

**Layout Shift Prevention (CLS Optimization):**
The `width` and `height` props are mandatory for a reason—they let Next.js calculate aspect ratio before the image loads. Without dimensions:
```
Before image loads: div has height=0 (collapsed)
After image loads: div expands to height=600px
Result: Content below shifts down → BAD CLS score
```

With dimensions:
```
Before image loads: div reserves height=600px (aspect ratio known)
After image loads: image fills reserved space
Result: No layout shift → GOOD CLS score (0)
```

The aspect ratio calculation: `padding-bottom = (height / width) * 100%`. For 800x600 image, Next.js applies `padding-bottom: 75%` to maintain space.

**Blur Placeholder Implementation:**
There are three placeholder strategies:

1. **blurDataURL (manual):** You provide a base64-encoded tiny image (20x20 pixels, ~1KB). Next.js embeds this directly in the HTML, so it shows instantly (no network request).

2. **placeholder="blur" (automatic, static imports only):** For local images imported with `import heroImg from './hero.jpg'`, Next.js automatically generates a tiny blur placeholder at build time and embeds it.

3. **placeholder="empty" (default for remote images):** No placeholder—image area is blank until loaded.

The base64 blur technique works because a 20x20 image is ~1KB, small enough to inline in HTML. When blurred with CSS `filter: blur(20px)`, it looks like a full-size blurred version. Once the real image loads, Next.js fades it in.

**Priority Loading for LCP:**
LCP (Largest Contentful Paint) measures when the largest visible element renders. For most websites, this is the hero image. If you lazy-load your hero image:
```
0ms: HTML loads
100ms: JavaScript loads
200ms: Image component mounts
300ms: Image starts downloading (LAZY LOADED)
1200ms: Image finishes → LCP = 1200ms (POOR)
```

With `priority={true}`:
```
0ms: HTML loads, image preload link injected
100ms: Image starts downloading (EAGER)
800ms: Image finishes → LCP = 800ms (GOOD)
```

Next.js adds `<link rel="preload" as="image" href="..." />` to the HTML head, telling the browser to download immediately.

**Image Sizing Algorithm:**
Next.js generates images at these widths: 640, 750, 828, 1080, 1200, 1920, 2048, 3840. Why these specific numbers? They're based on common device widths:
- 640: iPhone SE (375px × 2 DPR)
- 750: iPhone 12/13 (390px × 2 DPR)
- 828: iPhone 14 Pro (414px × 2 DPR)
- 1080: Desktop (1080px × 1 DPR)
- 1920: Full HD monitors
- 3840: 4K monitors

The browser picks the smallest image that's larger than the display width. For a 400px slot on a 2x DPR display (800px physical), the browser downloads the 828w version.

---

### 🐛 Real-World Scenario: E-Commerce Product Gallery Performance Crisis

**Context:** Your e-commerce site has 500 product images per category page. Users complain pages take 8-10 seconds to load, especially on mobile. LCP is 4.5 seconds (POOR), and CLS is 0.35 (POOR).

**Initial Metrics (Before Optimization):**
- Page load time: 8-10 seconds
- Total image size downloaded: 15MB (500 images × 30KB average)
- LCP: 4500ms (hero product image)
- CLS: 0.35 (images load, causing layout shifts)
- Mobile bounce rate: 68% (users leave before page loads)

**The Problem You Hit:**

You're using plain `<img>` tags:
```jsx
{products.map(product => (
  <img src={product.imageUrl} alt={product.name} />
))}
```

Issues discovered:
1. All 500 images start downloading immediately (no lazy loading)
2. Images are 3000×3000px (6MB each), but displayed at 300×300px
3. Images are PNG/JPEG (no modern formats)
4. No dimensions specified → massive CLS as images load
5. Hero image lazy loads (it's just another image in the list)

**Root Cause Analysis:**
- Browser downloads all images simultaneously → network congestion
- Massive bandwidth waste (downloading 3000px for 300px display)
- No lazy loading → 15MB downloaded even if user only sees 10 products
- No blur placeholders → white boxes flash before images load
- Hero image not prioritized → competes with 499 other images

**Solution Implementation:**

1. **Replace with next/image and add lazy loading:**
```tsx
// Before: ❌ All images load immediately
{products.map(product => (
  <img src={product.imageUrl} alt={product.name} />
))}

// After: ✅ Lazy load images, auto-optimize
{products.map((product, index) => (
  <Image
    src={product.imageUrl}
    alt={product.name}
    width={300}
    height={300}
    sizes="(max-width: 768px) 50vw, 300px"
    loading={index < 4 ? 'eager' : 'lazy'} // First 4 eager, rest lazy
    placeholder="blur"
    blurDataURL={product.blurDataUrl} // Generated server-side
  />
))}
```

2. **Generate blur placeholders server-side:**
```typescript
// lib/generate-blur.ts
import { getPlaiceholder } from 'plaiceholder';

export async function getProductsWithBlur(products) {
  return Promise.all(
    products.map(async (product) => {
      const { base64 } = await getPlaiceholder(product.imageUrl);
      return {
        ...product,
        blurDataUrl: base64, // Tiny base64 image
      };
    })
  );
}

// app/products/page.tsx
export default async function ProductsPage() {
  const products = await getProducts();
  const productsWithBlur = await getProductsWithBlur(products);

  return <ProductGrid products={productsWithBlur} />;
}
```

3. **Prioritize hero image:**
```tsx
// Hero product (above-the-fold)
<Image
  src={heroProduct.imageUrl}
  alt={heroProduct.name}
  width={800}
  height={600}
  priority={true} // ✅ Preload, don't lazy load
  placeholder="blur"
  blurDataURL={heroProduct.blurDataUrl}
/>
```

4. **Configure next.config.js for external images:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.shopify.com', 's3.amazonaws.com'],
    formats: ['image/avif', 'image/webp'], // Enable modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // Cache for 1 year
  },
};
```

5. **Add responsive sizing:**
```tsx
<Image
  src={product.imageUrl}
  alt={product.name}
  width={300}
  height={300}
  sizes="
    (max-width: 640px) 50vw,
    (max-width: 1024px) 33vw,
    300px
  "
  // Mobile: 50% of viewport, Tablet: 33% of viewport, Desktop: 300px fixed
/>
```

**Metrics After Implementation:**
- Page load time: 2.1 seconds (75% improvement)
- Total image size downloaded (initial): 800KB (15MB → 800KB, 95% reduction)
- LCP: 1.2 seconds (4.5s → 1.2s, 73% improvement)
- CLS: 0.02 (0.35 → 0.02, 94% improvement)
- Mobile bounce rate: 22% (68% → 22%, 67% reduction)

**Bandwidth Savings Breakdown:**
- Original: 500 images × 6MB = 3000MB (before compression)
- With lazy loading: Only 10 visible images × 30KB = 300KB
- With WebP: 300KB × 0.7 (30% smaller) = 210KB
- With proper sizing: 210KB × 0.5 (half the pixels) = 105KB
- **Total: 3000MB → 105KB initial load (28,571x reduction)**

**Key Techniques That Worked:**
1. Lazy loading reduced initial bandwidth by 98%
2. WebP conversion saved 30% on each image
3. Proper sizing (300px vs 3000px) saved 90% bandwidth
4. Blur placeholders eliminated CLS
5. Priority on hero image improved LCP by 73%

**Lesson Learned:** The combination of lazy loading + modern formats + proper sizing is exponentially more powerful than any single optimization. Each multiplies the previous savings.

---

### ⚖️ Trade-offs: Image Optimization Strategies

**next/image vs Plain <img> Tag:**

| Factor | next/image | Plain <img> |
|--------|-----------|-------------|
| **Setup Complexity** | Requires Next.js config | Works everywhere |
| **Automatic Optimization** | ✅ Auto WebP/AVIF conversion | ❌ Manual conversion needed |
| **Lazy Loading** | ✅ Built-in | ❌ Manual `loading="lazy"` |
| **Responsive Images** | ✅ Auto srcSet generation | ❌ Manual srcSet |
| **Layout Shift (CLS)** | ✅ Prevented (requires width/height) | ❌ Common issue |
| **Performance** | Excellent (optimized sizes) | Poor (full-size images) |
| **Bundle Size** | +30KB (Image component JS) | 0KB |
| **Browser Support** | All modern browsers | All browsers |

**When to use next/image:**
- E-commerce product images (need optimization)
- Blog hero images (LCP critical)
- User-uploaded content (unknown sizes)
- High-traffic pages (bandwidth costs matter)

**When to use plain <img>:**
- Tiny icons (<5KB, not worth optimization overhead)
- SVG images (don't need raster optimization)
- Base64 embedded images (already inlined)

**Blur Placeholder vs Empty Placeholder:**

**Blur placeholder:**
- Pro: Better perceived performance (users see something immediately)
- Pro: Eliminates layout shift
- Con: +1KB per image (base64 inline)
- Con: Build time increases (must generate placeholders)

**Empty placeholder:**
- Pro: No extra bytes
- Pro: No build time overhead
- Con: White boxes flash before images load (poor UX)
- Con: Potential layout shift if dimensions missing

**Decision:** Use blur for critical images (hero, above-fold), empty for below-fold.

**Priority Loading vs Lazy Loading:**

**priority={true} (eager):**
- Use for: Hero images, LCP elements, above-the-fold content
- Effect: Image preloaded in <head>, downloads immediately
- Trade-off: Competes with other critical resources (CSS, JS)

**loading="lazy" (default):**
- Use for: Below-fold images, galleries, thumbnails
- Effect: Image only downloads when 1000px from viewport
- Trade-off: Slight delay when scrolling fast

**Decision:** Priority for top 1-3 images, lazy for everything else.

**Local vs Remote Image Optimization:**

**Local images (import):**
- Pro: Automatic blur placeholder generation
- Pro: Build-time optimization possible
- Con: Increases build time
- Con: All images in git repo (bloat)

**Remote images (CDN URL):**
- Pro: No build time impact
- Pro: Easier content management
- Con: Must manually generate blur placeholders
- Con: Requires domain whitelist in next.config.js

**Image Format Priority:**

```
AVIF: 30% smaller than WebP, but 5-10x slower encoding
WebP: 25% smaller than JPEG, fast encoding
JPEG: Universal support, no encoding overhead
```

**Recommendation:**
- Production: WebP (best balance)
- High-end photography sites: AVIF (worth the encoding cost)
- Legacy browser support: JPEG fallback

**On-Demand vs Build-Time Optimization:**

**On-demand (Next.js default):**
- Pro: No build time impact (scales to millions of images)
- Pro: Only optimizes images that are actually viewed
- Con: First request is slow (300-500ms encoding)
- Con: Compute costs on Vercel ($0.40 per 1000 optimizations)

**Build-time (custom solution):**
- Pro: First request is instant (pre-optimized)
- Pro: No ongoing compute costs
- Con: Build time scales linearly (10,000 images = 30min build)
- Con: Can't handle user-uploaded content

**Decision:** Use on-demand for dynamic content, build-time for static marketing sites.

---

### 💬 Explain to Junior: Image Optimization Interview Answers

**1. Why can't you just use <img> tags in Next.js?**

**Analogy:** Using plain <img> is like serving a pizza the size of a dining table when someone ordered a personal pizza. Next.js Image is like a smart kitchen that automatically resizes the pizza to match the order.

**Interview Answer Template:**
"You CAN use plain <img> tags, but you lose massive performance benefits. Next.js Image component automatically: (1) converts images to modern formats like WebP (30% smaller), (2) resizes images to match the user's screen (don't send 3000px to a 300px display), (3) lazy loads images so they only download when visible, (4) prevents layout shift by reserving space. Without these, you're sending 10x more data than needed, hurting load times and Core Web Vitals. The trade-off is Next.js Image requires width/height props and adds ~30KB to your bundle, but for any non-trivial site, the bandwidth savings massively outweigh this cost."

**2. What's the difference between priority and lazy loading?**

**Analogy:** Priority loading is like calling ahead to a restaurant so your order is ready when you arrive. Lazy loading is like ordering when you get there.

**Interview Answer Template:**
"By default, Next.js lazy loads all images—they only download when the user scrolls within ~1000px of the image. This saves bandwidth, but if your hero image is lazy loaded, it won't start downloading until JavaScript loads and mounts the component. This delays LCP (Largest Contentful Paint). The `priority` prop tells Next.js to add a preload link in the HTML head, so the browser downloads the image immediately, even before JavaScript executes. Use `priority` for your above-the-fold images (hero, main product image), and lazy load everything else. If you priority-load 50 images, you've defeated the purpose—only priority-load the critical 1-3 images."

**3. What are blur placeholders and how do they work?**

**Analogy:** A blur placeholder is like showing a pixelated preview of a movie trailer while the full HD version loads. You see something immediately instead of a blank screen.

**Interview Answer Template:**
"A blur placeholder is a tiny (20×20 pixel), heavily compressed version of the image that's embedded directly in the HTML as base64. It's only ~1KB, so it shows instantly. When blurred with CSS, it looks like a blurred version of the full image. This improves perceived performance—users see something immediately instead of blank white boxes. It also prevents layout shift because the placeholder reserves the correct aspect ratio. For local images (imported), Next.js generates blur placeholders automatically at build time. For remote images (CDN URLs), you must generate them yourself using libraries like Plaiceholder. The trade-off: each placeholder adds ~1KB to your HTML, so only use it for important images."

**4. How does Next.js know what size image to serve?**

**Interview Answer Template:**
"Next.js uses the `sizes` prop combined with the browser's viewport to determine which image size to download. The `sizes` prop is a media query that tells the browser: 'On mobile (<768px), this image takes 100% of viewport width. On desktop, it takes 50%.' Based on this and the user's screen width, the browser picks the optimal size from the srcSet. For example, if I'm on a 375px iPhone and `sizes="100vw"`, the browser needs a 375px image. But my iPhone has 2× pixel density, so it actually needs 750px. Next.js generated images at 640w, 750w, 828w, etc., so the browser picks 750w. This ensures you never download a 3000px image when you only need 750px."

**5. What's LCP and how do images affect it?**

**Analogy:** LCP is like measuring how long it takes for the main actor to appear on stage. If the hero image is the main actor and it takes 5 seconds to load, the audience is staring at an empty stage.

**Interview Answer Template:**
"LCP (Largest Contentful Paint) measures when the largest visible element renders. For most websites, this is the hero image. If your LCP is slow (>2.5 seconds), Google considers your page slow, which hurts SEO rankings. Images affect LCP in several ways: (1) If you lazy load your hero image, it won't start downloading until JavaScript mounts, delaying LCP by hundreds of milliseconds. Use `priority` to preload critical images. (2) If you serve massive images (3MB hero image), LCP is delayed while the image downloads. Optimize with next/image to serve WebP at the right size. (3) Layout shifts hurt LCP—if the image area isn't reserved (no width/height), the browser repaints when the image loads, delaying LCP. Always specify dimensions."

**6. How do you handle images from external CDNs?**

**Interview Answer Template:**
"Next.js requires you to whitelist external image domains in `next.config.js` for security—this prevents someone from using your site to optimize random images from the internet (costing you money). You add the CDN domain to the `images.domains` array. For example, if you're pulling product images from Shopify's CDN, you'd add `'cdn.shopify.com'`. Next.js then proxies these images through `/_next/image?url=...` and optimizes them on-the-fly. The trade-off: the first request is slow (100-300ms to optimize), but subsequent requests are cached. For remote images, blur placeholders aren't automatic—you must generate them yourself, usually server-side at build time or when fetching data."

**Interview Answer Checklist:**
✅ Explain automatic format conversion (WebP/AVIF)
✅ Understand lazy loading vs priority loading
✅ Know how to prevent layout shift (width/height)
✅ Explain blur placeholders and when to use them
✅ Understand responsive images (sizes, srcSet)
✅ Know LCP optimization (priority, proper sizing)
✅ Handle external images (domains whitelist)

---

### Code Example

```tsx
// ==========================================
// 1. BASIC IMAGE USAGE
// ==========================================

import Image from 'next/image';

// Local image (automatic optimization + blur placeholder)
import heroImg from '@/public/hero.jpg';

export default function HomePage() {
  return (
    <div>
      {/* ✅ Local image with auto blur */}
      <Image
        src={heroImg}
        alt="Hero"
        placeholder="blur" // Automatic blur placeholder
        priority // LCP optimization
      />

      {/* ✅ Remote image with manual blur */}
      <Image
        src="https://example.com/product.jpg"
        alt="Product"
        width={800}
        height={600}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Manual
      />
    </div>
  );
}

// ==========================================
// 2. RESPONSIVE IMAGES
// ==========================================

export function ProductCard({ product }) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={400}
      height={400}
      sizes="
        (max-width: 640px) 100vw,
        (max-width: 1024px) 50vw,
        400px
      "
      // Mobile: full width, Tablet: half width, Desktop: 400px fixed
    />
  );
}

// ==========================================
// 3. PRIORITY VS LAZY LOADING
// ==========================================

export function HeroSection({ products }) {
  return (
    <div>
      {/* Above-the-fold hero: priority load */}
      <Image
        src={products[0].imageUrl}
        alt={products[0].name}
        width={1200}
        height={600}
        priority={true} // ✅ Preload immediately
        placeholder="blur"
        blurDataURL={products[0].blurDataUrl}
      />

      {/* Below-fold products: lazy load */}
      <div className="product-grid">
        {products.slice(1).map((product) => (
          <Image
            key={product.id}
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={300}
            loading="lazy" // Default behavior (can omit)
          />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. GENERATING BLUR PLACEHOLDERS
// ==========================================

import { getPlaiceholder } from 'plaiceholder';

export async function getServerSideProps() {
  const products = await fetchProducts();

  // Generate blur placeholders for all products
  const productsWithBlur = await Promise.all(
    products.map(async (product) => {
      const { base64, img } = await getPlaiceholder(product.imageUrl, {
        size: 10, // 10x10 pixel placeholder
      });

      return {
        ...product,
        blurDataUrl: base64,
        img, // Optional: contains width, height
      };
    })
  );

  return {
    props: {
      products: productsWithBlur,
    },
  };
}

// ==========================================
// 5. FILL MODE (BACKGROUND IMAGES)
// ==========================================

export function ProductHero({ backgroundImage }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Image
        src={backgroundImage}
        alt="Background"
        fill // Replaces layout="fill"
        style={{ objectFit: 'cover' }} // CSS object-fit
        priority
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1>Product Title</h1>
      </div>
    </div>
  );
}

// ==========================================
// 6. NEXT.CONFIG.JS CONFIGURATION
// ==========================================

// next.config.js
module.exports = {
  images: {
    // Allowed external image domains
    domains: [
      'cdn.shopify.com',
      's3.amazonaws.com',
      'images.unsplash.com',
    ],

    // Or use remotePatterns (more flexible)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/images/**',
      },
    ],

    // Image formats (in order of preference)
    formats: ['image/avif', 'image/webp'],

    // Device breakpoints for srcSet
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Icon sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,

    // Disable image optimization (not recommended)
    unoptimized: false,
  },
};

// ==========================================
// 7. PROGRESSIVE LOADING PATTERN
// ==========================================

'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProgressiveImage({ src, alt, blurDataURL }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setIsLoading(false)}
        className={`
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. IMAGE GALLERY WITH LAZY LOADING
// ==========================================

export function ImageGallery({ images }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <Image
          key={image.id}
          src={image.url}
          alt={image.alt}
          width={400}
          height={300}
          loading={index < 6 ? 'eager' : 'lazy'}
          // Load first 6 images eagerly (above fold),
          // rest lazy load
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ))}
    </div>
  );
}

// ==========================================
// 9. ART DIRECTION (DIFFERENT IMAGES PER BREAKPOINT)
// ==========================================

export function ArtDirectedImage() {
  return (
    <picture>
      <source
        media="(max-width: 768px)"
        srcSet="/_next/image?url=/mobile-hero.jpg&w=828&q=75"
      />
      <source
        media="(min-width: 769px)"
        srcSet="/_next/image?url=/desktop-hero.jpg&w=1920&q=75"
      />
      <Image
        src="/desktop-hero.jpg"
        alt="Hero"
        width={1920}
        height={1080}
        priority
      />
    </picture>
  );
}

// ==========================================
// 10. CUSTOM LOADER (CDN INTEGRATION)
// ==========================================

// Custom loader for Cloudinary
const cloudinaryLoader = ({ src, width, quality }) => {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  return `https://res.cloudinary.com/demo/image/upload/${params.join(',')}${src}`;
};

export function CloudinaryImage() {
  return (
    <Image
      loader={cloudinaryLoader}
      src="/sample.jpg"
      alt="Cloudinary"
      width={800}
      height={600}
    />
  );
}

// ==========================================
// 11. BATCH BLUR PLACEHOLDER GENERATION
// ==========================================

// scripts/generate-blur-placeholders.js
import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs/promises';

async function generateBlurPlaceholders() {
  const images = [
    '/images/hero1.jpg',
    '/images/hero2.jpg',
    '/images/hero3.jpg',
  ];

  const placeholders = {};

  for (const imagePath of images) {
    const { base64 } = await getPlaiceholder(`./public${imagePath}`);
    placeholders[imagePath] = base64;
  }

  await fs.writeFile(
    './lib/blur-placeholders.json',
    JSON.stringify(placeholders, null, 2)
  );

  console.log('✅ Generated blur placeholders');
}

generateBlurPlaceholders();

// Usage
import blurPlaceholders from '@/lib/blur-placeholders.json';

export function ImageWithStaticBlur() {
  return (
    <Image
      src="/images/hero1.jpg"
      alt="Hero"
      width={1200}
      height={600}
      placeholder="blur"
      blurDataURL={blurPlaceholders['/images/hero1.jpg']}
    />
  );
}
```

### Common Mistakes

- ❌ **Not specifying width/height** - Causes layout shift (CLS), hurts Core Web Vitals
- ❌ **Priority loading all images** - Defeats the purpose, slows down critical resources
- ❌ **Using fill without container dimensions** - Image won't display correctly
- ❌ **Forgetting to whitelist external domains** - Images from CDN won't load
- ✅ **Always specify dimensions** - Prevents layout shift, reserves space
- ✅ **Use priority for hero images only** - First 1-3 images, lazy load rest
- ✅ **Generate blur placeholders** - Improves perceived performance
- ✅ **Use responsive sizes** - Serve appropriate image size per device

### Follow-up Questions

1. **What's the difference between width/height props and fill mode?** Width/height specify exact dimensions (aspect ratio preserved). Fill mode makes image fill parent container (requires parent with position: relative and defined dimensions).

2. **How does Next.js handle retina displays?** Next.js automatically generates 2x versions of images. Browser's device pixel ratio determines which to download (828w for iPhone = 414px × 2 DPR).

3. **Can you use next/image with SVG?** Yes, but optimization is skipped (SVG is vector format). For icons, consider using plain <img> or inline SVG instead.

### Resources
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [next/image API Reference](https://nextjs.org/docs/app/api-reference/components/image)
- [Plaiceholder (blur generation)](https://plaiceholder.co/)
- [Core Web Vitals](https://web.dev/vitals/)

---

## Question 5: How Do You Optimize Fonts and Scripts in Next.js?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Google, Meta, Vercel, Shopify, Stripe

### Question
Explain Next.js font optimization using `next/font` and script optimization using `next/script`. How do you prevent FOUT (Flash of Unstyled Text), optimize third-party scripts, and improve FCP (First Contentful Paint)?

### Answer

**Font and Script Optimization** - Automatic font subsetting, self-hosting Google Fonts, zero layout shift, third-party script loading strategies (defer, lazy, worker), and performance monitoring.

**Key Points:**

1. **next/font Automatic Optimization** - Self-hosts Google Fonts, font subsetting, zero layout shift, preload critical fonts
2. **FOUT/FOIT Prevention** - Font display strategies (swap, optional, fallback), size-adjust for fallback fonts
3. **Script Loading Strategies** - beforeInteractive, afterInteractive, lazyOnload, worker (Web Worker isolation)
4. **Third-Party Scripts** - Google Analytics, Facebook Pixel, Stripe, Intercom optimization patterns
5. **Performance Metrics** - FCP improvement, CLS prevention, blocking time reduction

---

### 🔍 Deep Dive: Font Loading Pipeline & Browser Rendering Internals

**next/font Architecture (Google Fonts Self-Hosting):**
When you use `import { Inter } from 'next/font/google'`, Next.js doesn't just add a link to Google Fonts' CDN. Instead, at build time, it downloads the font files, hosts them locally, and generates optimized CSS. Here's the exact flow:

1. **Build time:** Next.js downloads `Inter-Regular.woff2` from Google Fonts' servers
2. **Font subsetting:** Next.js analyzes which characters your app actually uses (latin, latin-ext, cyrillic, etc.) and generates subset font files
3. **Self-hosting:** Font files are placed in `.next/static/media/` with cache-busting hashes
4. **CSS generation:** Next.js generates `@font-face` CSS with preload hints and size-adjust
5. **Runtime:** Browser downloads fonts from your domain (no third-party request), with immutable caching

The critical advantage: Google Fonts requires a DNS lookup to fonts.googleapis.com + fonts.gstatic.com (two separate domains). This adds 100-300ms latency. Self-hosting eliminates this—fonts come from the same origin as your HTML.

**Font Subsetting Deep Dive:**
The full `Inter` font family includes ~1500 glyphs (characters) covering 100+ languages. The file size: ~400KB. But if your site only uses English text, you only need ~200 glyphs. Next.js automatically creates a subset:

```
Full Inter font: 400KB (1500 glyphs)
Latin subset: 120KB (200 glyphs)
Latin-extended subset: 180KB (400 glyphs)
```

You specify the subset in `next/font`:
```typescript
const inter = Inter({
  subsets: ['latin'], // Download only latin characters
  weight: ['400', '700'], // Only regular and bold
});
```

This reduces font size by 70% (400KB → 120KB). The trade-off: if a user enters non-latin text (e.g., ñ in "español"), the character won't render (shows fallback font or ☐).

**FOUT vs FOIT (Flash of Unstyled Text vs Flash of Invisible Text):**

When a browser encounters a custom font:
1. **FOUT (font-display: swap):** Browser immediately shows text in fallback font (Arial), then swaps to custom font when loaded. Effect: text flashes from Arial → Inter.
2. **FOIT (font-display: block):** Browser hides text until custom font loads. Effect: blank text for 1-3 seconds, then Inter appears.
3. **font-display: optional:** Browser shows fallback font immediately. Custom font only applies if it loads within 100ms, otherwise fallback remains for the entire page load.

The Next.js default is `swap`—this is optimal for performance because users see text immediately (no blank content), and the flash is brief.

**Size-Adjust for Zero Layout Shift:**
Different fonts have different character widths. Arial's "Hello" is 50px wide, but Inter's "Hello" might be 48px wide. When the font swaps (FOUT), text reflows, causing CLS (layout shift).

Next.js solves this with `size-adjust`:
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2');
  size-adjust: 104%; /* Make Inter match Arial's width */
}
```

Now Arial's "Hello" (50px) and Inter's "Hello" (48px × 1.04 = 50px) are the same width. No reflow, no CLS.

**Preload vs Prefetch:**
Next.js automatically adds:
```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
```

This tells the browser: "This font is critical, download immediately." Without preload, the browser discovers fonts only after parsing CSS, delaying text rendering by 200-500ms.

**Script Loading Strategies (beforeInteractive, afterInteractive, lazyOnload):**

1. **beforeInteractive:** Script loads BEFORE page becomes interactive. Use for: critical polyfills, A/B testing (must run before first render).
   ```
   0ms: HTML loads
   100ms: beforeInteractive script downloads
   200ms: beforeInteractive script executes
   300ms: React hydrates (page interactive)
   ```

2. **afterInteractive (default):** Script loads AFTER page becomes interactive. Use for: analytics, chat widgets, non-critical third-party code.
   ```
   0ms: HTML loads
   100ms: React hydrates (page interactive)
   200ms: afterInteractive script downloads
   300ms: afterInteractive script executes
   ```

3. **lazyOnload:** Script loads during browser idle time (when CPU is free). Use for: non-critical widgets, social media embeds.
   ```
   0ms: HTML loads
   100ms: React hydrates (page interactive)
   200ms: User starts scrolling (browser busy)
   1000ms: Browser idle → lazyOnload script downloads
   ```

The key difference: `beforeInteractive` blocks interactivity (use sparingly), `afterInteractive` doesn't block, `lazyOnload` waits for idle time.

**Web Worker Script Loading (strategy="worker"):**
Next.js 13+ supports Partytown integration via `strategy="worker"`. This runs third-party scripts in a Web Worker, isolating them from the main thread.

Why this matters: Google Analytics runs on the main thread, competing with your React code for CPU time. If GA takes 50ms to execute, that's 50ms users can't interact with your page (blocking time). With Web Workers:
```
Main thread: React rendering (0ms blocked)
Web Worker thread: Google Analytics (isolated, no blocking)
```

The trade-off: Web Workers can't access the DOM directly. Partytown uses a proxy to forward DOM access requests to the main thread. This adds latency (10-30ms per DOM access), making worker scripts slightly slower, but they don't block the main thread.

**Third-Party Script Performance Impact:**
Google Tag Manager, Facebook Pixel, and similar scripts are notoriously slow. Example metrics:

```
Without GTM: FCP = 1.2s, TTI = 2.5s, TBT = 100ms
With GTM (default): FCP = 1.8s (+50%), TTI = 4.2s (+68%), TBT = 450ms (+350%)
With GTM (afterInteractive): FCP = 1.2s, TTI = 3.0s (+20%), TBT = 200ms (+100%)
With GTM (lazyOnload): FCP = 1.2s, TTI = 2.6s (+4%), TBT = 120ms (+20%)
```

The lesson: **never** load third-party scripts synchronously (inline <script> tag). Always use `next/script` with `afterInteractive` or `lazyOnload`.

**Font Loading Performance Metrics:**

FCP (First Contentful Paint): When text first appears. Slow fonts delay FCP.
```
Font preloaded: FCP = 1.0s
Font not preloaded: FCP = 1.5s (+50%)
```

CLS (Cumulative Layout Shift): Font swap causes layout shift if widths differ.
```
Without size-adjust: CLS = 0.15 (poor)
With size-adjust: CLS = 0.02 (good)
```

**Variable Fonts Optimization:**
Instead of loading separate files for each weight:
```
Inter-Regular.woff2: 120KB
Inter-Bold.woff2: 125KB
Total: 245KB
```

Use a variable font:
```
Inter-Variable.woff2: 180KB (includes all weights 100-900)
Savings: 245KB → 180KB (27% reduction)
```

Next.js supports variable fonts:
```typescript
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable
  weight: ['400', '700'], // Not needed for variable fonts
});
```

---

### 🐛 Real-World Scenario: SaaS Dashboard Font/Script Performance Crisis

**Context:** Your SaaS dashboard uses custom fonts (Inter) and multiple third-party scripts (Google Analytics, Intercom chat, Stripe). Users complain the page feels slow and "janky."

**Initial Metrics (Before Optimization):**
- FCP (First Contentful Paint): 2.8 seconds
- LCP (Largest Contentful Paint): 3.5 seconds
- CLS (Cumulative Layout Shift): 0.28 (poor)
- TBT (Total Blocking Time): 680ms (poor)
- Third-party script count: 7 scripts (GA, GTM, Intercom, Stripe, Hotjar, Facebook Pixel, Segment)

**The Problem You Hit:**

1. **Fonts loading slowly:**
   - Using Google Fonts CDN link: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">`
   - DNS lookup to fonts.googleapis.com: +150ms
   - Download CSS: +50ms
   - Discover font URLs in CSS: +100ms
   - Download fonts: +200ms
   - **Total delay: 500ms before text renders**

2. **FOUT causing layout shift:**
   - Browser shows Arial initially (50px width)
   - Inter loads (48px width)
   - All text reflows → CLS = 0.28

3. **Third-party scripts blocking main thread:**
   - All scripts loaded with `<script src="...">` (blocking)
   - Google Tag Manager: 300ms execution time (blocks rendering)
   - Intercom chat widget: 200ms execution time
   - Total blocking time: 680ms

4. **Race condition with Intercom:**
   - Intercom script loads before React hydration
   - Tries to mount chat widget, but DOM isn't ready
   - Throws error, re-initializes after hydration (double initialization)

**Root Cause Analysis:**
- Google Fonts CDN adds unnecessary network hops
- No font preloading → browser discovers fonts late
- No size-adjust → font swap causes layout shift
- Third-party scripts loaded synchronously → block rendering
- No script loading strategy → everything loads eagerly

**Solution Implementation:**

1. **Replace Google Fonts CDN with next/font:**
```typescript
// Before: ❌ Google Fonts CDN
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />

// After: ✅ next/font self-hosting
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true, // Automatic size-adjust
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

2. **Optimize third-party scripts:**
```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Critical: Load before page interactive */}
        <Script
          id="gtm"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXX');
            `,
          }}
        />
      </head>
      <body>
        {children}

        {/* Analytics: Load after page interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA-XXXXX');
          `}
        </Script>

        {/* Chat widget: Load during idle time */}
        <Script
          src="https://widget.intercom.io/widget/APP_ID"
          strategy="lazyOnload"
          onLoad={() => {
            console.log('Intercom loaded');
            window.Intercom('boot', { app_id: 'APP_ID' });
          }}
        />

        {/* Facebook Pixel: Lazy load */}
        <Script
          id="fb-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){...}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
      </body>
    </html>
  );
}
```

3. **Add font fallback optimization:**
```css
/* globals.css */
:root {
  --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  font-family: var(--font-inter);
}

/* Manual size-adjust (if not using adjustFontFallback) */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 104%; /* Match Inter's metrics */
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

4. **Defer non-critical Stripe:**
```tsx
// app/checkout/page.tsx
'use client';

import Script from 'next/script';
import { useState } from 'react';

export default function CheckoutPage() {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  return (
    <div>
      {/* Only load Stripe when user visits checkout */}
      <Script
        src="https://js.stripe.com/v3/"
        strategy="lazyOnload"
        onLoad={() => setStripeLoaded(true)}
      />

      {stripeLoaded ? (
        <StripeCheckoutForm />
      ) : (
        <div>Loading payment form...</div>
      )}
    </div>
  );
}
```

**Metrics After Implementation:**
- FCP: 1.1 seconds (2.8s → 1.1s, 61% improvement)
- LCP: 1.8 seconds (3.5s → 1.8s, 49% improvement)
- CLS: 0.03 (0.28 → 0.03, 89% improvement)
- TBT: 180ms (680ms → 180ms, 74% improvement)
- Font load time: 150ms (500ms → 150ms, 70% improvement)

**Breakdown of Improvements:**

1. **next/font self-hosting:**
   - Eliminated 150ms DNS lookup (fonts.googleapis.com)
   - Fonts preloaded in <head> → 200ms earlier discovery
   - Same-origin download → better caching

2. **Size-adjust (automatic):**
   - Prevented font swap layout shift
   - CLS improved from 0.28 → 0.03

3. **Script optimization:**
   - GTM: beforeInteractive (necessary for tracking)
   - GA: afterInteractive (doesn't block interactivity)
   - Intercom: lazyOnload (loads during idle, no blocking)
   - Stripe: lazyOnload + conditional (only on checkout page)
   - **Result: TBT reduced from 680ms → 180ms**

4. **Performance budget:**
   - Removed Hotjar, Segment, Facebook Pixel (not critical)
   - 7 scripts → 3 scripts
   - Page load reduced by 1.2 seconds

**Key Lesson:** Third-party scripts are the #1 cause of slow sites. Audit aggressively, load lazily, and consider removing non-essential scripts.

---

### ⚖️ Trade-offs: Font and Script Optimization Strategies

**next/font vs Google Fonts CDN:**

| Factor | next/font (Self-Hosted) | Google Fonts CDN |
|--------|------------------------|------------------|
| **Setup** | `import { Inter } from 'next/font/google'` | `<link href="fonts.googleapis.com">` |
| **DNS Lookup** | None (same origin) | +100-200ms (third-party) |
| **Caching** | 1 year immutable | Varies (Google controls) |
| **Font Subsetting** | Automatic | Manual (URL params) |
| **Layout Shift** | Prevented (size-adjust) | Common (no size-adjust) |
| **Privacy** | No third-party requests | Google tracks users |
| **Build Time** | +5-10 seconds (downloads fonts) | 0 seconds |
| **GDPR** | Compliant (no third-party) | May require consent |

**When to use next/font:**
- Production apps (performance matters)
- Privacy-conscious apps (GDPR compliance)
- Custom font families (not just Google Fonts)

**When to use CDN:**
- Prototypes (speed over optimization)
- Already using Google Fonts elsewhere (shared cache)

**font-display Strategies:**

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| **swap** | Show fallback immediately, swap when loaded | Best for most sites (default) |
| **optional** | Show fallback, only use custom font if loads <100ms | Performance-critical (news sites) |
| **block** | Hide text until font loads (max 3s) | Branding-critical (logos) |
| **fallback** | Show fallback, swap within 3s, or keep fallback | Compromise between swap/optional |

**Recommendation:** Use `swap` (default) for optimal balance.

**Script Loading Strategy Decision Tree:**

**beforeInteractive:**
- Use for: A/B testing (must run before first render), critical polyfills
- Trade-off: Blocks page interactivity (use sparingly)

**afterInteractive (default):**
- Use for: Analytics, error tracking, non-critical widgets
- Trade-off: Competes with React hydration (minor delay)

**lazyOnload:**
- Use for: Chat widgets, social media embeds, non-critical tracking
- Trade-off: May load too late (user leaves before chat widget appears)

**worker (Partytown):**
- Use for: Heavy third-party scripts (GTM, GA, Facebook Pixel)
- Trade-off: Setup complexity, slight latency for DOM access

**Inline Script vs External Script:**

**Inline:**
```html
<script>gtag('config', 'GA-XXX');</script>
```
- Pro: No network request, executes immediately
- Con: Can't be cached (increases HTML size)

**External:**
```html
<script src="/gtag.js"></script>
```
- Pro: Cached across pages (faster subsequent loads)
- Con: Extra network request (first load slower)

**Decision:** Inline if <5KB and critical, external otherwise.

**Variable Font vs Multiple Weights:**

**Multiple weights:**
```
Regular (400): 120KB
Bold (700): 125KB
Total: 245KB
```

**Variable font:**
```
Variable (100-900): 180KB
```

**Decision:** Use variable font if you need 3+ weights.

---

### 💬 Explain to Junior: Font and Script Optimization Interview Answers

**1. What's next/font and why should you use it?**

**Analogy:** Imagine ordering pizza from a restaurant across town (Google Fonts CDN) vs having a pizza oven in your house (next/font). The across-town order requires: (1) finding the restaurant's address (DNS lookup), (2) driving there (network latency), (3) waiting for them to make it. Your own oven: instant, no travel time.

**Interview Answer Template:**
"next/font is Next.js's built-in font optimization system. Instead of linking to Google Fonts' CDN, next/font downloads the fonts at build time and self-hosts them. This eliminates the DNS lookup to fonts.googleapis.com (saves 100-200ms), enables better caching (fonts are immutable for 1 year), and automatically generates font subsets (latin only vs full character set, saving 70% file size). It also prevents layout shift by automatically adding size-adjust to match the fallback font's width. The trade-off is a slightly longer build time (Next.js downloads fonts), but the runtime performance gain is massive—faster FCP, no third-party requests, and zero layout shift."

**2. What's the difference between FOUT and FOIT?**

**Interview Answer Template:**
"FOUT (Flash of Unstyled Text) is when the browser shows text in the fallback font (Arial) immediately, then swaps to the custom font when it loads. You see a brief flash as the font changes. FOIT (Flash of Invisible Text) is when the browser hides text until the custom font loads—users see blank space for 1-3 seconds. The choice is controlled by `font-display` in CSS: `swap` causes FOUT, `block` causes FOIT. Next.js defaults to `swap` because showing text immediately (even in Arial) is better than showing nothing. The downside of FOUT is layout shift if the fonts have different widths, but Next.js solves this with automatic size-adjust."

**3. What are the script loading strategies in next/script?**

**Interview Answer Template:**
"`beforeInteractive` loads the script before the page becomes interactive—it blocks React hydration. Use this only for critical things like A/B testing that must run before first render. `afterInteractive` (default) loads the script after the page becomes interactive—React hydrates first, then the script loads. Use this for analytics and tracking. `lazyOnload` loads the script during browser idle time (when CPU is free)—use this for non-critical widgets like chat or social media embeds. The key trade-off: beforeInteractive blocks the page (bad for performance), afterInteractive doesn't block but still competes with React, lazyOnload has zero performance impact but may load too late."

**4. How do you prevent layout shift when fonts load?**

**Interview Answer Template:**
"Layout shift happens when the fallback font and custom font have different character widths. Arial's 'Hello' might be 50px wide, but Inter's 'Hello' is 48px. When the font swaps, all text reflows, causing CLS. Next.js solves this with `size-adjust`—a CSS property that scales the fallback font to match the custom font's metrics. With `adjustFontFallback: true` in next/font, Next.js automatically calculates the size-adjust value so Arial and Inter have identical widths. Now when the font swaps, there's no reflow, and CLS stays at zero."

**5. Why are third-party scripts slow and how do you optimize them?**

**Interview Answer Template:**
"Third-party scripts like Google Analytics or Facebook Pixel are slow because: (1) they execute on the main thread, competing with your React code for CPU time, (2) they often load additional resources (more scripts, images, tracking pixels), and (3) they're outside your control (you can't optimize their code). To optimize, use next/script with the right strategy. For analytics, use `afterInteractive` so it doesn't block the initial render. For chat widgets, use `lazyOnload` so it loads during idle time. For heavy scripts like GTM, consider `strategy='worker'` (Partytown) to run them in a Web Worker, isolating them from the main thread. The key is to defer everything that's not critical."

**6. What's font subsetting and why does it matter?**

**Interview Answer Template:**
"Font subsetting is splitting a font into smaller files containing only specific character sets. The full Inter font includes 1500+ glyphs covering 100+ languages (400KB). But if your English-only site only needs 200 glyphs (letters A-Z, numbers, punctuation), you can subset to just those characters (120KB). Next.js does this automatically with the `subsets` option: `subsets: ['latin']` downloads only latin characters, saving 70% file size. The trade-off: if a user enters non-latin text (like ñ or 中), it won't render correctly. For most English-only sites, latin subset is perfect."

**Interview Answer Checklist:**
✅ Understand next/font self-hosting benefits
✅ Know FOUT vs FOIT (swap vs block)
✅ Explain script loading strategies (before, after, lazy)
✅ Understand size-adjust for zero layout shift
✅ Know how to defer third-party scripts
✅ Explain font subsetting and file size savings

---

### Code Example

```tsx
// ==========================================
// 1. NEXT/FONT WITH GOOGLE FONTS
// ==========================================

import { Inter, Roboto_Mono } from 'next/font/google';

// Load Inter font with optimization
const inter = Inter({
  subsets: ['latin'], // Only latin characters
  display: 'swap', // Show fallback immediately, swap when loaded
  weight: ['400', '700'], // Regular and bold only
  variable: '--font-inter', // CSS variable
  preload: true, // Preload in <head>
  adjustFontFallback: true, // Automatic size-adjust
});

// Load Roboto Mono for code blocks
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// Use in Tailwind CSS
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
};

// ==========================================
// 2. NEXT/FONT WITH LOCAL FONTS
// ==========================================

import localFont from 'next/font/local';

const customFont = localFont({
  src: [
    {
      path: '../public/fonts/custom-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/custom-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-custom',
});

export default function Layout({ children }) {
  return (
    <html className={customFont.variable}>
      <body>{children}</body>
    </html>
  );
}

// ==========================================
// 3. VARIABLE FONTS
// ==========================================

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Variable fonts support all weights (100-900)
  // No need to specify weight array
});

// Use in CSS
// styles.css
.heading {
  font-family: var(--font-inter);
  font-weight: 600; /* Any weight 100-900 works */
}

// ==========================================
// 4. SCRIPT LOADING STRATEGIES
// ==========================================

import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}

        {/* beforeInteractive: Blocks page interactive */}
        <Script
          id="ab-test"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.AB_TEST_VARIANT = Math.random() > 0.5 ? 'A' : 'B';
            `,
          }}
        />

        {/* afterInteractive: Loads after page interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA-XXX"
          strategy="afterInteractive"
        />

        {/* lazyOnload: Loads during idle time */}
        <Script
          src="https://widget.intercom.io/widget/APP_ID"
          strategy="lazyOnload"
          onLoad={() => console.log('Intercom loaded')}
          onError={(e) => console.error('Script failed to load', e)}
        />

        {/* worker: Runs in Web Worker (Partytown) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA-XXX"
          strategy="worker"
        />
      </body>
    </html>
  );
}

// ==========================================
// 5. CONDITIONAL SCRIPT LOADING
// ==========================================

'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export function ConditionalScripts() {
  const pathname = usePathname();

  // Only load Stripe on checkout page
  if (pathname === '/checkout') {
    return (
      <Script
        src="https://js.stripe.com/v3/"
        strategy="lazyOnload"
        onLoad={() => console.log('Stripe loaded')}
      />
    );
  }

  return null;
}

// app/layout.tsx
export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ConditionalScripts />
      </body>
    </html>
  );
}

// ==========================================
// 6. GOOGLE ANALYTICS OPTIMIZATION
// ==========================================

// app/layout.tsx
import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}

        {/* Load GA script after page interactive */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />

        {/* Initialize GA */}
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}

// Track page views in App Router
// app/analytics.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: pathname + (searchParams.toString() ? `?${searchParams}` : ''),
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// ==========================================
// 7. INTERCOM CHAT WIDGET OPTIMIZATION
// ==========================================

// app/layout.tsx
import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}

        {/* Load Intercom lazily */}
        <Script
          id="intercom"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){
                ic('reattach_activator');ic('update',w.intercomSettings);
              }else{var d=document;var i=function(){i.c(arguments);};i.q=[];
                i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){
                var s=d.createElement('script');s.type='text/javascript';s.async=true;
                s.src='https://widget.intercom.io/widget/${process.env.NEXT_PUBLIC_INTERCOM_APP_ID}';
                var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};
                if(document.readyState==='complete'){l();}else if(w.attachEvent){
                w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
            `,
          }}
        />

        {/* Initialize Intercom after script loads */}
        <Script id="intercom-init" strategy="lazyOnload">
          {`
            window.Intercom('boot', {
              app_id: '${process.env.NEXT_PUBLIC_INTERCOM_APP_ID}',
              // Add user data if logged in
            });
          `}
        </Script>
      </body>
    </html>
  );
}

// ==========================================
// 8. FACEBOOK PIXEL OPTIMIZATION
// ==========================================

import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}

        <Script id="fb-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  );
}

// ==========================================
// 9. FONT PRELOADING (CUSTOM)
// ==========================================

// app/layout.tsx
export default function Layout({ children }) {
  return (
    <html>
      <head>
        {/* Manually preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

// ==========================================
// 10. MEASURING FONT PERFORMANCE
// ==========================================

'use client';

import { useEffect } from 'react';

export function FontPerformanceMonitor() {
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.initiatorType === 'font') {
            console.log('Font loaded:', {
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize,
            });

            // Send to analytics
            if (typeof window.gtag !== 'undefined') {
              window.gtag('event', 'font_loaded', {
                font_name: entry.name,
                load_time: entry.duration,
              });
            }
          }
        }
      });

      observer.observe({ type: 'resource', buffered: true });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
```

### Common Mistakes

- ❌ **Using Google Fonts CDN** - Adds DNS lookup, slower than self-hosting with next/font
- ❌ **Loading all scripts with beforeInteractive** - Blocks page interactivity, hurts performance
- ❌ **No font-display strategy** - Causes FOIT (invisible text), delays FCP
- ❌ **Not subsetting fonts** - Downloads 400KB when only 120KB needed
- ✅ **Use next/font for self-hosting** - Faster, better caching, automatic optimization
- ✅ **Defer third-party scripts** - Use afterInteractive or lazyOnload
- ✅ **Subset fonts** - Only load character sets you need (latin vs full)
- ✅ **Use font-display: swap** - Show text immediately in fallback font

### Follow-up Questions

1. **What's the difference between preload and prefetch for fonts?** Preload downloads the resource immediately (high priority). Prefetch downloads during idle time for future navigation (low priority). Use preload for critical fonts.

2. **How does strategy="worker" improve performance?** Runs scripts in a Web Worker, isolating them from the main thread. This prevents third-party scripts from blocking React rendering, improving TTI and TBT.

3. **What's the trade-off between font-display swap and optional?** swap shows fallback immediately, then swaps to custom font (causes brief flash). optional only uses custom font if it loads within 100ms, otherwise keeps fallback for entire page load (no flash).

### Resources
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Next.js Script Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)
- [next/font API Reference](https://nextjs.org/docs/app/api-reference/components/font)
- [Partytown (Web Worker Scripts)](https://partytown.builder.io/)

---
