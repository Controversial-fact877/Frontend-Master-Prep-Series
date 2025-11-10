# Testing React Components

> React Testing Library, testing hooks, async testing, mocking, and best practices.

---

## Question 1: React Testing Library Best Practices

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Meta, Google, Netflix

### Question
How do you test React components with React Testing Library? What are the best practices?

### Answer

**React Testing Library** - Test components like users interact with them.

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button click updates count', async () => {
  // Arrange
  render(<Counter />);

  // Act
  const button = screen.getByRole('button', { name: /increment/i });
  await userEvent.click(button);

  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**Best Practices:**
- ✅ Query by role, label, text (not test IDs)
- ✅ Test behavior, not implementation
- ✅ Use `userEvent` over `fireEvent`
- ❌ Don't test implementation details
- ❌ Don't test third-party libraries

### Resources
- [React Testing Library](https://testing-library.com/react)

---

