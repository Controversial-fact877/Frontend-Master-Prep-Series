# Web Security Interview Preparation

> **14+ questions covering vulnerabilities, authentication, secure coding, and security headers**

Master web security from fundamentals to advanced patterns. Essential for all frontend developers.

---

## 📚 Table of Contents

### 1️⃣ Common Vulnerabilities (1 file, ~5 Q&A)
| File | Topics | Difficulty |
|------|--------|------------|
| [01. Common Vulnerabilities](./01-common-vulnerabilities.md) | XSS, CSRF, SQL injection, clickjacking | 🟡 🔴 |

### 2️⃣ Authentication & Authorization (1 file, ~4 Q&A)
| File | Topics | Difficulty |
|------|--------|------------|
| [02. Authentication](./02-authentication.md) | JWT, OAuth, session management, password security | 🟡 🔴 |

### 3️⃣ Secure Coding Practices (1 file, ~3 Q&A)
| File | Topics | Difficulty |
|------|--------|------------|
| [03. Secure Coding](./03-secure-coding.md) | Input validation, sanitization, encryption | 🟡 |

### 4️⃣ Security Headers (1 file, ~2 Q&A)
| File | Topics | Difficulty |
|------|--------|------------|
| [04. Security Headers](./04-security-headers.md) | CSP, CORS, HSTS, X-Frame-Options | 🟡 🔴 |

**Total:** 14 Q&A (will expand to 50+)

---

## ⭐ Most Frequently Asked

1. **XSS Prevention** - Input sanitization and CSP (⭐⭐⭐⭐⭐)
2. **CSRF Protection** - Tokens and SameSite cookies (⭐⭐⭐⭐⭐)
3. **JWT vs Sessions** - Authentication strategies (⭐⭐⭐⭐⭐)
4. **Content Security Policy** - CSP headers (⭐⭐⭐⭐)
5. **CORS** - Cross-origin resource sharing (⭐⭐⭐⭐)

---

## 🎯 Learning Path

### Beginners (New to Security)
1. **Start:** Common Vulnerabilities - Understand XSS, CSRF
2. **Then:** Authentication - JWT basics
3. **Practice:** Secure Coding - Input validation
4. **Skip:** Advanced security headers initially

### Intermediate (1+ year experience)
1. **Master:** XSS and CSRF prevention
2. **Deep Dive:** Authentication - OAuth, JWT security
3. **Learn:** Security Headers - CSP, CORS
4. **Explore:** Secure coding patterns

### Advanced (2+ years experience)
1. **All Sections** - Complete mastery
2. **Focus:** Advanced threat modeling
3. **Master:** Security architecture
4. **Perfect:** Security auditing and penetration testing

---

## 🏆 Interview Readiness Checklist

### Junior Level (0-2 years)
- [ ] Understand XSS basics
- [ ] Know what CSRF is
- [ ] Can validate user input
- [ ] Understand HTTPS importance
- [ ] Basic authentication knowledge

### Mid Level (2-4 years)
- [ ] Can prevent XSS attacks
- [ ] Implement CSRF protection
- [ ] Understand JWT security
- [ ] Can configure CORS properly
- [ ] Know security best practices
- [ ] Can sanitize user input
- [ ] Understand OAuth flow

### Senior Level (4+ years)
- [ ] Can architect secure applications
- [ ] Expert in threat modeling
- [ ] Can implement OAuth/OpenID Connect
- [ ] Proficient with security headers
- [ ] Can conduct security audits
- [ ] Understand cryptography basics
- [ ] Can mentor on security practices
- [ ] Expert in secure coding patterns
- [ ] Can handle security incidents
- [ ] Understand compliance requirements (GDPR, etc.)

---

## 📊 Progress Tracking

**Core Security**
- [ ] 01. Common Vulnerabilities (5 Q&A)
- [ ] 02. Authentication (4 Q&A)

**Advanced Topics**
- [ ] 03. Secure Coding (3 Q&A)
- [ ] 04. Security Headers (2 Q&A)

---

## 🔑 Key Concepts

### OWASP Top 10 (Frontend Relevant)
```
1. Injection (XSS, SQL Injection)
   - Sanitize input
   - Use parameterized queries

2. Broken Authentication
   - Secure session management
   - Strong password policies

3. Sensitive Data Exposure
   - Encrypt data in transit (HTTPS)
   - Don't store sensitive data client-side

4. XML External Entities (XXE)
   - Disable XML external entity processing

5. Broken Access Control
   - Proper authorization checks
   - Principle of least privilege

6. Security Misconfiguration
   - Secure defaults
   - Remove unnecessary features

7. Cross-Site Scripting (XSS)
   - Output encoding
   - Content Security Policy

8. Insecure Deserialization
   - Validate serialized data
   - Use safe serialization

9. Using Components with Vulnerabilities
   - Keep dependencies updated
   - Regular security audits

10. Insufficient Logging & Monitoring
    - Log security events
    - Monitor for attacks
```

### Authentication Methods
- **Session-based** - Server-side session storage
- **Token-based (JWT)** - Stateless authentication
- **OAuth 2.0** - Third-party authorization
- **OpenID Connect** - Identity layer on OAuth

### Security Headers
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 1; mode=block
```

### Common Mistakes
- Not validating user input
- Storing secrets in client code
- Not using HTTPS
- Weak CORS configuration
- Not sanitizing HTML
- Using eval() with user input
- Exposing sensitive data in URLs
- Not implementing rate limiting

---

## 💡 Security Best Practices

### DO's ✅
- Validate all user input server-side
- Sanitize output before rendering
- Use HTTPS everywhere
- Implement Content Security Policy
- Use HttpOnly and Secure cookies
- Implement CSRF protection
- Keep dependencies updated
- Use strong authentication
- Implement rate limiting
- Log security events

### DON'Ts ❌
- Trust user input
- Store sensitive data in localStorage
- Use eval() with user data
- Expose API keys in client code
- Skip input validation
- Use weak CORS policies
- Ignore security headers
- Store passwords in plain text
- Skip security testing
- Ignore vulnerability reports

---

## 🛠️ Security Tools & Libraries

### Testing Tools
- **OWASP ZAP** - Security testing
- **Burp Suite** - Web vulnerability scanner
- **Snyk** - Dependency vulnerability scanning
- **npm audit** - Node.js security audits

### Security Libraries
- **DOMPurify** - XSS sanitization
- **helmet** - Express security headers
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT implementation

### Monitoring
- **Sentry** - Error and security monitoring
- **LogRocket** - Frontend monitoring
- **CloudFlare** - DDoS protection and WAF

---

## 📈 Security Implementation

### XSS Prevention
```javascript
// ❌ Dangerous
element.innerHTML = userInput;

// ✅ Safe
element.textContent = userInput;
// OR use DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput);
```

### CSRF Prevention
```javascript
// Include CSRF token in requests
fetch('/api/data', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  },
  credentials: 'same-origin'
});
```

### Secure Cookie Configuration
```javascript
// Set secure cookies
res.cookie('token', token, {
  httpOnly: true,  // Prevent XSS
  secure: true,    // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000  // 1 hour
});
```

---

## 📚 Resources

### Official Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN - Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Articles & Guides
- [Web Security Academy](https://portswigger.net/web-security)
- [Security Headers](https://securityheaders.com/)
- [Content Security Policy](https://content-security-policy.com/)

### Tools
- [OWASP ZAP](https://www.zaproxy.org/)
- [Snyk](https://snyk.io/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

---

## 🎓 Interview Tips

### Common Security Questions
1. **"How do you prevent XSS attacks?"**
   - Discuss input validation, output encoding, CSP

2. **"Explain CSRF and how to prevent it"**
   - CSRF tokens, SameSite cookies, origin validation

3. **"JWT vs Session-based auth - trade-offs?"**
   - Discuss stateless vs stateful, scalability, security

4. **"How would you implement OAuth?"**
   - Authorization flow, token management, security considerations

5. **"What security headers would you implement?"**
   - CSP, HSTS, X-Frame-Options, X-Content-Type-Options

---

[← Back to Main README](../README.md) | [Start Learning →](./01-common-vulnerabilities.md)

**Total:** 14 questions across all security topics (will expand to 50+) ✅
