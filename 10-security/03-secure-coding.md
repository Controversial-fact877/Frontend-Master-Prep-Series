# Secure Coding Practices

> Input validation, sanitization, secure API calls, dependency security, and frontend security best practices.

---

## Question 1: Input Validation and Sanitization

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Google, Meta, Amazon

### Question
How do you prevent injection attacks through input validation?

### Answer

**Key Principles:**
1. Validate on both client and server
2. Sanitize user input
3. Use parameterized queries
4. Encode output

```javascript
// ❌ Dangerous: Direct HTML insertion
element.innerHTML = userInput;

// ✅ Safe: Use textContent
element.textContent = userInput;

// ✅ Safe: Sanitize with DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Input validation
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// SQL Injection prevention (server-side)
// ❌ Dangerous
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Safe: Parameterized query
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```

### Resources
- [OWASP Secure Coding](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

---

