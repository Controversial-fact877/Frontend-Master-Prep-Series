# End-to-End Testing

> Cypress, Playwright, E2E best practices, test strategies, and automation.

---

## Question 1: Cypress vs Playwright

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Meta, Netflix

### Question
Compare Cypress and Playwright. When to use each?

### Answer

| Feature | Cypress | Playwright |
|---------|---------|------------|
| Browsers | Chrome, Firefox, Edge | All + WebKit |
| Speed | Moderate | Faster |
| API | Simpler | More powerful |
| Network stubbing | Built-in | Via browser context |

```javascript
// Cypress
describe('Login', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// Playwright
test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="submit"]');
  await expect(page).toHaveURL(/dashboard/);
});
```

### Resources
- [Cypress](https://www.cypress.io/)
- [Playwright](https://playwright.dev/)

---

