# CI/CD and Deployment

> Continuous integration, deployment strategies, GitHub Actions, environment variables, and production best practices.

---

## Question 1: CI/CD for Frontend Applications

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain CI/CD pipeline for frontend apps. What are the key stages?

### Answer

**Pipeline Stages:**
1. **Lint** - Code quality checks
2. **Test** - Run unit/integration tests
3. **Build** - Create production bundle
4. **Deploy** - Push to hosting (Vercel, Netlify, S3)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

### Resources
- [GitHub Actions](https://docs.github.com/en/actions)

---

