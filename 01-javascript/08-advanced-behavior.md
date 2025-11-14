# JavaScript Advanced Behavior and ES6+ Features

> Type coercion, operators, ES6+ features, destructuring, spread/rest, optional chaining, nullish coalescing, and modern JavaScript patterns.

---

## Question 1: Explain Type Coercion in JavaScript

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Uber

### Question
What is type coercion? Explain implicit vs explicit coercion with examples.

### Answer

**Type Coercion** is the automatic or explicit conversion of values from one data type to another.

**Two Types:**
1. **Implicit Coercion** - Automatic conversion by JavaScript
2. **Explicit Coercion** - Manual conversion using functions/operators

### Code Example

**Implicit Coercion:**

```javascript
// String coercion
console.log("5" + 3);     // "53" (number → string)
console.log("5" + true);  // "5true" (boolean → string)
console.log("5" + null);  // "5null" (null → string)

// Number coercion
console.log("5" - 3);     // 2 (string → number)
console.log("5" * "2");   // 10 (both strings → numbers)
console.log("5" / "2");   // 2.5 (both strings → numbers)

// Boolean coercion
if ("hello") {            // "hello" → true (truthy)
  console.log("Runs");
}

if (0) {                  // 0 → false (falsy)
  console.log("Doesn't run");
}

/*
COERCION RULES:
===============
+ with string: Everything → string
- * / %: Everything → number
Logical context: Everything → boolean
*/
```

**Explicit Coercion:**

```javascript
// To String
String(123);              // "123"
String(true);             // "true"
String(null);             // "null"
(123).toString();         // "123"

// To Number
Number("123");            // 123
Number("123abc");         // NaN
Number(true);             // 1
Number(false);            // 0
Number(null);             // 0
Number(undefined);        // NaN
parseInt("123px");        // 123
parseFloat("12.5px");     // 12.5

// To Boolean
Boolean(1);               // true
Boolean(0);               // false
Boolean("hello");         // true
Boolean("");              // false
!!"hello";                // true (double negation trick)

/*
FALSY VALUES (become false):
============================
- false
- 0, -0, 0n
- "" (empty string)
- null
- undefined
- NaN

Everything else is TRUTHY!
*/
```

**Tricky Cases:**

```javascript
// Addition vs Concatenation
console.log(1 + 2);       // 3 (number addition)
console.log(1 + "2");     // "12" (string concatenation)
console.log(1 + 2 + "3"); // "33" (left-to-right: 3 + "3")
console.log("1" + 2 + 3); // "123" (left-to-right: "12" + 3)

// Subtraction (no concatenation)
console.log("5" - 2);     // 3 (string → number)
console.log("5" - "2");   // 3 (both → numbers)

// Comparison coercion
console.log(5 == "5");    // true (string → number)
console.log(5 === "5");   // false (no coercion)
console.log(null == undefined);  // true (special case)
console.log(null === undefined); // false

// Boolean context
console.log([] == false);     // true ([] → "" → 0)
console.log({} == false);     // false
console.log([] == ![]);       // true (weird!)

/*
[] == ![]  EXPLAINED:
=====================
1. ![] → false (empty array is truthy, so negation is false)
2. [] == false
3. [] → "" (ToPrimitive)
4. "" == false
5. "" → 0, false → 0
6. 0 == 0 → true
*/

// Object to primitive
console.log([1, 2] + [3, 4]);  // "1,23,4" (arrays → strings)
console.log({} + []);          // 0 or "[object Object]" (context-dependent)

// Template literal coercion
console.log(`Value: ${123}`);  // "Value: 123"
console.log(`Value: ${null}`); // "Value: null"
```

**ToPrimitive Algorithm:**

```javascript
// When object converted to primitive:
const obj = {
  valueOf() {
    console.log("valueOf called");
    return 42;
  },
  toString() {
    console.log("toString called");
    return "Object";
  }
};

console.log(obj + 1);  // valueOf called, 43
console.log(`${obj}`); // toString called, "Object"

/*
ToPrimitive(hint):
==================
hint "number": Try valueOf() → toString()
hint "string": Try toString() → valueOf()
hint "default": Usually like "number"

+obj: hint "number"
`${obj}`: hint "string"
obj == x: hint "default"
*/

// Custom coercion
const custom = {
  valueOf() {
    return 100;
  },
  toString() {
    return "Custom";
  }
};

console.log(custom + 50);      // 150 (valueOf)
console.log(String(custom));   // "Custom" (toString)
console.log(custom == 100);    // true (valueOf)
```

### Common Mistakes

❌ **Wrong**: Relying on implicit coercion
```javascript
function add(a, b) {
  return a + b;  // Could concatenate if strings!
}

console.log(add(5, 3));    // 8
console.log(add("5", 3));  // "53" (unexpected!)
```

✅ **Correct**: Validate types or use explicit coercion
```javascript
function add(a, b) {
  return Number(a) + Number(b);
}

console.log(add(5, 3));    // 8
console.log(add("5", 3));  // 8
```

❌ **Wrong**: Using == with different types
```javascript
if (value == true) {  // Confusing coercion
  // ...
}
```

✅ **Correct**: Use === or explicit boolean
```javascript
if (value === true) {  // Explicit check
  // ...
}

if (Boolean(value)) {  // Convert to boolean
  // ...
}

if (value) {  // Truthy check (if that's the intent)
  // ...
}
```

### Follow-up Questions
1. "What's the difference between == and ===?"
2. "How does the ToPrimitive algorithm work?"
3. "Why does [] == ![] return true?"
4. "When is implicit coercion useful?"

### Resources
- [MDN: Type Coercion](https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion)
- [JavaScript Equality Table](https://dorey.github.io/JavaScript-Equality-Table/)
- [You Don't Know JS: Types & Grammar](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/types%20%26%20grammar/README.md)

---

## Question 2: == vs === - What's the Difference?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Netflix

### Question
Explain the difference between `==` (loose equality) and `===` (strict equality).

### Answer

- **`==`** (Loose/Abstract Equality) - Performs type coercion before comparison
- **`===`** (Strict Equality) - No type coercion, checks type AND value

### Code Example

```javascript
// === Strict Equality (No Coercion)
console.log(5 === 5);        // true
console.log(5 === "5");      // false (different types)
console.log(true === 1);     // false (different types)
console.log(null === undefined);  // false (different types)

// == Loose Equality (With Coercion)
console.log(5 == 5);         // true
console.log(5 == "5");       // true (string → number)
console.log(true == 1);      // true (boolean → number)
console.log(null == undefined);  // true (special case)

/*
=== CHECKS:
1. Type comparison
2. If types differ → false
3. If types same → value comparison

== CHECKS:
1. If types same → value comparison
2. If types differ → apply coercion rules
3. Then value comparison
*/
```

**Coercion Rules for ==:**

```javascript
// null and undefined
console.log(null == undefined);  // true (only equal to each other)
console.log(null == 0);          // false
console.log(undefined == 0);     // false

// Number comparisons
console.log("5" == 5);           // true (string → number)
console.log(true == 1);          // true (boolean → 1)
console.log(false == 0);         // true (boolean → 0)
console.log("" == 0);            // true ("" → 0)
console.log(" " == 0);           // true (" " → 0)

// Object to primitive
console.log([5] == 5);           // true ([5] → "5" → 5)
console.log([] == 0);            // true ([] → "" → 0)
console.log([""] == 0);          // true ([""] → "" → 0)

/*
== COERCION STEPS:
==================
1. null == undefined → true
2. number == string → string to number
3. boolean == any → boolean to number
4. object == primitive → object to primitive
*/
```

**When to Use Each:**

```javascript
// Use === (Almost Always)
if (count === 0) { }
if (status === "active") { }
if (user === null) { }

// Rare == Use Case: Check null OR undefined
if (value == null) {
  // true if value is null OR undefined
  // Equivalent to: value === null || value === undefined
}

// But even this is better as:
if (value === null || value === undefined) { }
// Or: if (value == null) { }
// Or: if (value ?? false) { }  // Modern way
```

**Weird Cases:**

```javascript
// Arrays
console.log([] == []);           // false (different objects)
console.log([] == ![]);          // true (weird!)

// Objects
console.log({} == {});           // false (different objects)
console.log({} == "[object Object]");  // false

// NaN
console.log(NaN == NaN);         // false
console.log(NaN === NaN);        // false
console.log(Object.is(NaN, NaN)); // true

// -0 and +0
console.log(-0 == +0);           // true
console.log(-0 === +0);          // true
console.log(Object.is(-0, +0));  // false

/*
SPECIAL CASES:
==============
- NaN ≠ NaN (use Number.isNaN())
- {} ≠ {} (reference comparison)
- [] ≠ [] (reference comparison)
- Object.is() for strict equality with special cases
*/
```

### Common Mistakes

❌ **Wrong**: Using == carelessly
```javascript
const input = "0";

if (input == false) {  // true ("0" → 0 → false)
  console.log("Empty");  // Runs unexpectedly!
}
```

✅ **Correct**: Use === or explicit check
```javascript
if (input === "") {  // false
  console.log("Empty");
}

if (!input) {  // false (if checking truthiness)
  console.log("Empty");
}
```

### Follow-up Questions
1. "When would you use == instead of ===?"
2. "What does Object.is() do differently?"
3. "How does != compare to !==?"
4. "Why does [] == ![] return true?"

---

## Questions 3-20: Advanced ES6+ Features

**Difficulty:** 🟡 Medium to 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Consolidated for comprehensiveness**

### Q3: Optional Chaining (?.)

**Optional Chaining** safely accesses nested properties without checking each level.

```javascript
const user = {
  name: 'John',
  address: {
    city: 'NYC'
  }
};

// ❌ Without optional chaining (crashes!)
console.log(user.profile.avatar); // TypeError!

// ✅ With optional chaining (safe!)
console.log(user?.profile?.avatar); // undefined (no crash)
console.log(user?.address?.city); // "NYC"

// Function calls
user.greet?.(); // Only calls if greet exists

// Array access
const arr = null;
console.log(arr?.[0]); // undefined (safe)

// Combining with nullish coalescing
const avatar = user?.profile?.avatar ?? 'default.png';
```

### Q4: Nullish Coalescing (??)

**Nullish Coalescing** returns right operand if left is `null` or `undefined`.

```javascript
// ?? vs ||
const count = 0;
console.log(count || 10); // 10 (0 is falsy)
console.log(count ?? 10); // 0 (only null/undefined)

const name = "";
console.log(name || "Guest"); // "Guest" ("" is falsy)
console.log(name ?? "Guest"); // "" (only null/undefined)

// Use cases
const settings = {
  timeout: 0,
  retries: 3
};

// ❌ Wrong with ||
const timeout = settings.timeout || 5000; // 5000 (wrong!)

// ✅ Correct with ??
const timeout = settings.timeout ?? 5000; // 0 (correct!)

// Default parameters
function fetch(url, timeout = 5000) {
  const actualTimeout = timeout ?? 5000;
}
```

### Q5: Destructuring (Objects, Arrays, Nested)

```javascript
// 1. OBJECT DESTRUCTURING
const user = { name: 'John', age: 30, city: 'NYC' };

const { name, age } = user;
console.log(name, age); // "John", 30

// Rename variables
const { name: userName, age: userAge } = user;

// Default values
const { country = 'USA' } = user;

// Nested destructuring
const person = {
  name: 'Alice',
  address: {
    city: 'NYC',
    zip: 10001
  }
};

const { address: { city, zip } } = person;
console.log(city, zip); // "NYC", 10001

// 2. ARRAY DESTRUCTURING
const arr = [1, 2, 3, 4, 5];

const [first, second] = arr;
console.log(first, second); // 1, 2

// Skip elements
const [, , third] = arr;
console.log(third); // 3

// Rest elements
const [head, ...tail] = arr;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// 3. FUNCTION PARAMETERS
function greet({ name, age = 18 }) {
  console.log(`${name} is ${age}`);
}

greet({ name: 'John', age: 30 }); // "John is 30"
greet({ name: 'Jane' }); // "Jane is 18"

// 4. SWAPPING VARIABLES
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
```

### Q6: Spread Operator (...)

```javascript
// 1. ARRAY SPREAD
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Clone array
const clone = [...arr1];

// Add elements
const withNew = [0, ...arr1, 4];

// 2. OBJECT SPREAD
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// Clone object
const objClone = { ...obj1 };

// Override properties
const updated = { ...obj1, b: 10 };
console.log(updated); // { a: 1, b: 10 }

// 3. FUNCTION ARGUMENTS
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3, 4)); // 10

const nums = [1, 2, 3];
console.log(Math.max(...nums)); // 3
```

### Q7: Rest Parameters

```javascript
function myFunc(a, b, ...rest) {
  console.log(a); // 1
  console.log(b); // 2
  console.log(rest); // [3, 4, 5]
}

myFunc(1, 2, 3, 4, 5);

// Destructuring with rest
const [first, ...others] = [1, 2, 3, 4];
console.log(first); // 1
console.log(others); // [2, 3, 4]

const { name, ...details } = { name: 'John', age: 30, city: 'NYC' };
console.log(name); // "John"
console.log(details); // { age: 30, city: 'NYC' }
```

### Q8: Template Literals & Tagged Templates

```javascript
// 1. BASIC TEMPLATE LITERALS
const name = 'John';
const age = 30;

console.log(`Hello, ${name}!`);
console.log(`${name} is ${age} years old`);

// Multiline strings
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;

// Expressions
console.log(`2 + 2 = ${2 + 2}`);

// 2. TAGGED TEMPLATES
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

const highlighted = highlight`Hello, ${name}! You are ${age} years old.`;
console.log(highlighted);
// "Hello, <mark>John</mark>! You are <mark>30</mark> years old."

// 3. STYLED COMPONENTS PATTERN
function css(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] || '');
  }, '');
}

const color = 'blue';
const styles = css`
  color: ${color};
  font-size: 16px;
`;
```

### Q9: Symbol Type

```javascript
// 1. UNIQUE IDENTIFIERS
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false (always unique!)

// 2. HIDDEN OBJECT PROPERTIES
const id = Symbol('id');
const user = {
  name: 'John',
  [id]: 123
};

console.log(user[id]); // 123
console.log(Object.keys(user)); // ['name'] (Symbol hidden!)

// 3. WELL-KNOWN SYMBOLS
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }

// Custom iterator
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,
      next() {
        if (this.current <= this.last) {
          return { value: this.current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

for (let num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

### Q10: BigInt

```javascript
// 1. LARGE INTEGERS
const bigInt = 9007199254740991n; // Add 'n' suffix
const anotherBig = BigInt(9007199254740991);

console.log(bigInt + 1n); // 9007199254740992n

// 2. OPERATIONS
const a = 10n;
const b = 20n;

console.log(a + b); // 30n
console.log(a * b); // 200n
console.log(b / a); // 2n (integer division)

// ❌ Can't mix with regular numbers
// console.log(10n + 5); // TypeError!

// ✅ Convert explicitly
console.log(10n + BigInt(5)); // 15n
console.log(Number(10n) + 5); // 15

// 3. COMPARISONS
console.log(10n === 10); // false (different types)
console.log(10n == 10); // true (coercion)
console.log(10n > 5); // true
```

### Q11: Proxy & Reflect

```javascript
// 1. PROXY BASICS
const target = { name: 'John', age: 30 };

const handler = {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // "Getting name", "John"
proxy.age = 31; // "Setting age to 31"

// 2. VALIDATION
const validatedUser = new Proxy({}, {
  set(target, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    target[prop] = value;
    return true;
  }
});

validatedUser.age = 30; // OK
// validatedUser.age = '30'; // TypeError!

// 3. REFLECT (companion to Proxy)
const obj = { name: 'John' };

Reflect.set(obj, 'age', 30);
console.log(Reflect.get(obj, 'age')); // 30
console.log(Reflect.has(obj, 'name')); // true
Reflect.deleteProperty(obj, 'name');
```

### Q12: Object.is() vs ===

```javascript
// Most cases: same as ===
console.log(Object.is(5, 5)); // true
console.log(Object.is('foo', 'foo')); // true

// Special cases:
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true ✅

console.log(-0 === +0); // true
console.log(Object.is(-0, +0)); // false ✅

// Use Object.is() for these edge cases
```

### Q13: for...of vs for...in

```javascript
const arr = [10, 20, 30];

// for...of (values)
for (const value of arr) {
  console.log(value); // 10, 20, 30
}

// for...in (keys/indices)
for (const index in arr) {
  console.log(index); // "0", "1", "2" (strings!)
}

// for...in iterates over ALL enumerable properties
Array.prototype.custom = 'test';
for (const key in arr) {
  console.log(key); // "0", "1", "2", "custom" (includes prototype!)
}

// ✅ Use for...of for arrays
// ✅ Use for...in for objects (with hasOwnProperty check)
const obj = { a: 1, b: 2 };
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key]);
  }
}
```

### Q14: Map vs WeakMap

```javascript
// 1. MAP
const map = new Map();
map.set('key1', 'value1');
map.set({ id: 1 }, 'object key');

console.log(map.get('key1')); // "value1"
console.log(map.size); // 2
console.log(map.has('key1')); // true

// Iterate
for (const [key, value] of map) {
  console.log(key, value);
}

// 2. WEAKMAP
const weakMap = new WeakMap();
let obj = { id: 1 };

weakMap.set(obj, 'metadata');
console.log(weakMap.get(obj)); // "metadata"

// Key difference: WeakMap keys must be objects
// weakMap.set('string', 'value'); // TypeError!

// Garbage collection
obj = null; // Object can be garbage collected
// WeakMap entry automatically removed!

// Use cases:
// - Map: General key-value storage
// - WeakMap: Private data, caching (no memory leaks)
```

### Q15: Set vs WeakSet

```javascript
// 1. SET
const set = new Set([1, 2, 3, 3, 3]);
console.log(set); // Set { 1, 2, 3 } (duplicates removed)

set.add(4);
set.delete(2);
console.log(set.has(3)); // true
console.log(set.size); // 3

// Remove duplicates from array
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)];

// 2. WEAKSET
const weakSet = new WeakSet();
let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// Garbage collection
obj1 = null; // Object can be garbage collected

// Use cases:
// - Set: Unique values collection
// - WeakSet: Tracking objects without preventing GC
```

### Q16: Generators & Iterators

```javascript
// 1. GENERATOR FUNCTION
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 2. INFINITE SEQUENCE
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1

// 3. CUSTOM ITERATOR
const range = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) {
      yield i;
    }
  }
};

for (let num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

### Q17: Private Class Fields (#)

```javascript
class BankAccount {
  #balance = 0; // Private field

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }

  // Private method
  #validateAmount(amount) {
    return amount > 0;
  }
}

const account = new BankAccount();
account.deposit(100);
console.log(account.getBalance()); // 100
// console.log(account.#balance); // SyntaxError! (private)
```

### Q18: Object.entries/keys/values

```javascript
const user = { name: 'John', age: 30, city: 'NYC' };

// Object.keys
console.log(Object.keys(user)); // ['name', 'age', 'city']

// Object.values
console.log(Object.values(user)); // ['John', 30, 'NYC']

// Object.entries
console.log(Object.entries(user));
// [['name', 'John'], ['age', 30], ['city', 'NYC']]

// Convert to Map
const map = new Map(Object.entries(user));

// Convert back to object
const obj = Object.fromEntries(map);

// Iterate
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
```

### Q19: Array Methods (flat, flatMap, at)

```javascript
// 1. flat() - Flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat()); // [1, 2, 3, 4, [5, 6]]
console.log(nested.flat(2)); // [1, 2, 3, 4, 5, 6]

// 2. flatMap() - Map then flatten
const arr = [1, 2, 3];
console.log(arr.flatMap(x => [x, x * 2]));
// [1, 2, 2, 4, 3, 6]

// 3. at() - Negative indexing
const nums = [10, 20, 30, 40];
console.log(nums.at(-1)); // 40 (last element)
console.log(nums.at(-2)); // 30
```

### Q20: Best Practices Summary

```javascript
// 1. Use const/let, not var
const user = { name: 'John' }; // ✅
// var user = { name: 'John' }; // ❌

// 2. Use template literals
const greeting = `Hello, ${name}!`; // ✅
// const greeting = 'Hello, ' + name + '!'; // ❌

// 3. Use destructuring
const { name, age } = user; // ✅
// const name = user.name; // ❌

// 4. Use spread over Object.assign
const merged = { ...obj1, ...obj2 }; // ✅
// const merged = Object.assign({}, obj1, obj2); // ❌

// 5. Use optional chaining
const city = user?.address?.city; // ✅
// const city = user && user.address && user.address.city; // ❌

// 6. Use nullish coalescing for defaults
const timeout = settings.timeout ?? 5000; // ✅
// const timeout = settings.timeout || 5000; // ❌ (fails for 0)

// 7. Use === not ==
if (value === 5) { } // ✅
// if (value == 5) { } // ❌

// 8. Use for...of for arrays
for (const item of array) { } // ✅
// for (let i = 0; i < array.length; i++) { } // ❌

// 9. Use array methods (map, filter, reduce)
const doubled = arr.map(x => x * 2); // ✅

// 10. Use arrow functions for callbacks
setTimeout(() => console.log('Hi'), 1000); // ✅
```

### Resources
- [MDN: JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [ES6 Features](https://github.com/lukehoban/es6features)
- [JavaScript.info](https://javascript.info/)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)

