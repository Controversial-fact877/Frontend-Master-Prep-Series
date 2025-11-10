# Security Headers and HTTPS

> HTTP security headers, CSP, CORS, HTTPS, SSL/TLS, and secure communication.

---

## Question 1: Content Security Policy (CSP)

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Google, Meta, Amazon

### Question
What is Content Security Policy and how does it prevent XSS?

### Answer

**CSP** - HTTP header that controls which resources the browser can load.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.example.com; frame-ancestors 'none';
```

**Directives:**
- `default-src 'self'` - Only load resources from same origin
- `script-src` - Control JavaScript sources
- `style-src` - Control CSS sources
- `img-src` - Control image sources
- `connect-src` - Control fetch/XHR/WebSocket
- `frame-ancestors` - Control embedding in iframes

```javascript
// Next.js configuration
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};

// Express.js
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://trusted.cdn.com"
  );
  next();
});
```

**Benefits:**
- Blocks inline scripts (prevents XSS)
- Controls resource origins
- Prevents clickjacking

### Resources
- [CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## Question 2: CORS (Cross-Origin Resource Sharing)

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7 minutes
**Companies:** Google, Meta, Amazon

### Question
How does CORS work and how do you configure it?

### Answer

**CORS** - Mechanism that allows restricted resources to be requested from another domain.

**How it works:**
1. Browser sends preflight OPTIONS request
2. Server responds with allowed origins/methods/headers
3. If allowed, browser sends actual request

```javascript
// Express.js CORS configuration
const cors = require('cors');

// Simple CORS (allow all)
app.use(cors());

// Configured CORS
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies
  maxAge: 86400 // Cache preflight for 24h
}));

// Dynamic origin
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://example.com', 'https://app.example.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Manual CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://example.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

### Resources
- [CORS MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## Question 3: Essential Security Headers

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Google, Meta

### Question
What are the essential HTTP security headers?

### Answer

```javascript
// Express.js with helmet
const helmet = require('helmet');
app.use(helmet());

// Manual configuration
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Force HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');

  next();
});

// Next.js configuration
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
        ]
      }
    ];
  }
};
```

**Key headers:**
1. **X-Frame-Options** - Prevent clickjacking
2. **X-Content-Type-Options** - Prevent MIME sniffing
3. **Strict-Transport-Security** - Force HTTPS
4. **Content-Security-Policy** - Control resource loading
5. **Referrer-Policy** - Control referrer information

### Resources
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)

---
