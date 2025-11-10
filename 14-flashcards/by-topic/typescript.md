# TypeScript Flashcards

> **50 TypeScript concepts for type-safe interviews**

**Time to review:** 25 minutes
**Best for:** TypeScript-focused roles, type system understanding

---

## Card 1: Type vs Interface
**Q:** When to use type vs interface?

**A:** Interface: extendable, better for object shapes, declaration merging. Type: unions, intersections, primitives, tuples. Prefer interface for objects.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #types #interface
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 2: Utility Types
**Q:** Name 5 built-in utility types.

**A:** Partial<T>, Required<T>, Readonly<T>, Pick<T, K>, Omit<T, K>, Record<K, T>, Exclude<T, U>, Extract<T, U>, NonNullable<T>, ReturnType<T>.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #utility-types
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 3: Generic Constraints
**Q:** How to constrain generic types?

**A:** Use `extends` keyword. Example: `function fn<T extends { length: number }>(arg: T)` - T must have length property.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #generics
**Frequency:** ⭐⭐⭐⭐

---

## Card 4: Union vs Intersection
**Q:** Difference between union (|) and intersection (&)?

**A:** Union: type can be A OR B. Intersection: type must be A AND B (combines properties). `string | number` vs `A & B`.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #types
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 5: Type Guards
**Q:** What are type guards and how to create them?

**A:** Functions that narrow types in conditional blocks. Use: typeof, instanceof, 'in' operator, or custom with 'is' keyword. Example: `function isString(x: any): x is string`.

**Difficulty:** 🔴 Hard
**Tags:** #typescript #type-guards
**Frequency:** ⭐⭐⭐⭐

---

## Card 6: any vs unknown vs never
**Q:** Difference between any, unknown, and never?

**A:** any: disables checking. unknown: safer any, requires checking before use. never: represents values that never occur (exhaustive checks).

**Difficulty:** 🟡 Medium
**Tags:** #typescript #types
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 7: Conditional Types
**Q:** What are conditional types?

**A:** Types determined by condition: `T extends U ? X : Y`. Like ternary for types. Used in advanced type transformations.

**Difficulty:** 🔴 Hard
**Tags:** #typescript #conditional-types
**Frequency:** ⭐⭐⭐

---

## Card 8: Mapped Types
**Q:** What are mapped types?

**A:** Create new types by transforming properties of existing types. Example: `{ [K in keyof T]: boolean }` - all properties become boolean.

**Difficulty:** 🔴 Hard
**Tags:** #typescript #mapped-types
**Frequency:** ⭐⭐⭐⭐

---

## Card 9: readonly Modifier
**Q:** Difference between readonly and const?

**A:** const: variable reference can't change. readonly: object property can't be reassigned. readonly is compile-time only.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #readonly
**Frequency:** ⭐⭐⭐⭐

---

## Card 10: Function Overloads
**Q:** How do function overloads work?

**A:** Multiple function signatures, one implementation. TypeScript picks correct overload based on arguments. Implementation must handle all cases.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #functions
**Frequency:** ⭐⭐⭐

---

## Card 11: keyof Operator
**Q:** What does keyof do?

**A:** Creates union type of all keys in an object type. Example: `keyof { a: number, b: string }` = `'a' | 'b'`.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #keyof
**Frequency:** ⭐⭐⭐⭐

---

## Card 12: typeof Operator
**Q:** How does typeof work in TypeScript?

**A:** Extracts type from value. `const x = { a: 1 }; type X = typeof x;`. Different from JavaScript typeof (runtime).

**Difficulty:** 🟡 Medium
**Tags:** #typescript #typeof
**Frequency:** ⭐⭐⭐⭐

---

## Card 13: Tuple Types
**Q:** What are tuple types?

**A:** Fixed-length array with known types at each position. Example: `[string, number, boolean]`. More specific than regular arrays.

**Difficulty:** 🟢 Easy
**Tags:** #typescript #tuples
**Frequency:** ⭐⭐⭐

---

## Card 14: Enum vs Union
**Q:** When to use enum vs string literal union?

**A:** Union: more flexible, tree-shakeable, no runtime code. Enum: generates runtime object, reverse mapping. Prefer unions usually.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #enum
**Frequency:** ⭐⭐⭐⭐

---

## Card 15: Abstract Classes
**Q:** What are abstract classes?

**A:** Base classes that can't be instantiated. Can have abstract methods (no implementation). Subclasses must implement abstract methods.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #classes
**Frequency:** ⭐⭐⭐

---

## Card 16: Type Assertion
**Q:** How to do type assertion?

**A:** Two syntaxes: `value as Type` or `<Type>value`. Tells compiler to treat value as specific type. Use sparingly.

**Difficulty:** 🟢 Easy
**Tags:** #typescript #assertion
**Frequency:** ⭐⭐⭐⭐

---

## Card 17: Index Signatures
**Q:** What are index signatures?

**A:** Define types for dynamic property names. Example: `{ [key: string]: number }` - any string key, number value.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #index-signature
**Frequency:** ⭐⭐⭐⭐

---

## Card 18: Discriminated Unions
**Q:** What are discriminated unions?

**A:** Unions with common literal property for narrowing. Example: `{ type: 'success', data: T } | { type: 'error', error: string }`.

**Difficulty:** 🔴 Hard
**Tags:** #typescript #unions
**Frequency:** ⭐⭐⭐⭐

---

## Card 19: infer Keyword
**Q:** What does infer do?

**A:** Extracts types in conditional types. Example: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never`.

**Difficulty:** 🔴 Hard
**Tags:** #typescript #infer
**Frequency:** ⭐⭐⭐

---

## Card 20: Namespace vs Module
**Q:** Namespace vs ES module?

**A:** Namespace: older TS feature, global scope organization. Module: modern ES6, file-based. Use modules (import/export).

**Difficulty:** 🟡 Medium
**Tags:** #typescript #modules
**Frequency:** ⭐⭐⭐

---

## Card 21: Declaration Files
**Q:** What are .d.ts files?

**A:** Type declaration files. Provide types for JavaScript libraries. Auto-generated or manually written. Located in @types packages.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #declarations
**Frequency:** ⭐⭐⭐⭐

---

## Card 22: strictNullChecks
**Q:** What does strictNullChecks do?

**A:** Makes null and undefined distinct types. Can't assign to other types without check. Prevents "cannot read property of undefined" errors.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #strict
**Frequency:** ⭐⭐⭐⭐

---

## Card 23: Non-null Assertion
**Q:** What is non-null assertion operator (!)?

**A:** Tells compiler value is not null/undefined. `value!.property`. Use sparingly - removes type safety.

**Difficulty:** 🟢 Easy
**Tags:** #typescript #operators
**Frequency:** ⭐⭐⭐

---

## Card 24: Optional Chaining
**Q:** How does optional chaining work?

**A:** `obj?.prop?.method?.()` - stops if undefined/null. Returns undefined. Safer than `obj && obj.prop && obj.prop.method()`.

**Difficulty:** 🟢 Easy
**Tags:** #typescript #optional-chaining
**Frequency:** ⭐⭐⭐⭐⭐

---

## Card 25: Nullish Coalescing
**Q:** Difference between ?? and ||?

**A:** `??` only checks null/undefined. `||` checks all falsy values (0, '', false). `value ?? default` safer than `value || default`.

**Difficulty:** 🟡 Medium
**Tags:** #typescript #operators
**Frequency:** ⭐⭐⭐⭐

---

[Continue with 25 more advanced TypeScript cards...]

---

[← Back to Flashcards](../README.md)
