# JavaScript Primitive Types & Type System

> **Focus**: Deep understanding of JavaScript's type system, V8 internals, and production debugging

---

## Question 1: What are primitive and non-primitive data types in JavaScript?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question

Explain the difference between primitive and non-primitive (reference) data types in JavaScript. List all primitive types and explain how they're stored in memory.

### Answer

JavaScript has **7 primitive types** and **1 reference type** (objects).

**Primitive Types (7):**
- `string` - Text data ("hello")
- `number` - Numeric data (42, 3.14, Infinity, NaN)
- `bigint` - Large integers (9007199254740991n)
- `boolean` - true/false
- `undefined` - Variable declared but not assigned
- `null` - Intentional absence of value
- `symbol` - Unique identifier (Symbol('id'))

**Key Differences:**

| Aspect | Primitives | Reference Types |
|--------|-----------|-----------------|
| Storage | Stack (value) | Heap (reference) |
| Mutability | Immutable | Mutable |
| Comparison | By value | By reference |
| Copy behavior | Copies value | Copies reference |
| Memory | Fixed size | Variable size |

### Code Example

```javascript
// ============================================
// 1. PRIMITIVES - VALUE SEMANTICS
// ============================================

let a = 10;
let b = a; // Copies the VALUE
b = 20;

console.log(a); // 10 (unchanged)
console.log(b); // 20

// ============================================
// 2. REFERENCE TYPES - REFERENCE SEMANTICS
// ============================================

let obj1 = { name: "John" };
let obj2 = obj1; // Copies the REFERENCE (points to same object)
obj2.name = "Jane";

console.log(obj1.name); // "Jane" (changed!)
console.log(obj2.name); // "Jane"

// Both variables point to the same object in heap memory
console.log(obj1 === obj2); // true (same reference)

// ============================================
// 3. PRIMITIVE IMMUTABILITY
// ============================================

let str = "hello";
str[0] = "H"; // Doesn't work (immutable)
console.log(str); // "hello" (unchanged)

// String methods return NEW strings
let upper = str.toUpperCase(); // Creates new string
console.log(str);   // "hello" (original unchanged)
console.log(upper); // "HELLO" (new string)

// ============================================
// 4. TYPEOF OPERATOR
// ============================================

console.log(typeof 42);           // "number"
console.log(typeof "text");       // "string"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" ⚠️ (historical bug!)
console.log(typeof Symbol('id')); // "symbol"
console.log(typeof 123n);         // "bigint"
console.log(typeof {});           // "object"
console.log(typeof []);           // "object"
console.log(typeof function(){}); // "function"

// ============================================
// 5. COMPARISON BEHAVIOR
// ============================================

// Primitives: compared by value
console.log(5 === 5);           // true
console.log("hi" === "hi");     // true

// Objects: compared by reference
console.log({} === {});         // false (different objects)
console.log([] === []);         // false (different arrays)

const arr1 = [1, 2, 3];
const arr2 = arr1;
console.log(arr1 === arr2);     // true (same reference)

// ============================================
// 6. SHALLOW VS DEEP COPY
// ============================================

// Shallow copy - copies top level only
const original = {
  name: "Alice",
  address: { city: "NYC" }
};

const shallow = { ...original };
shallow.name = "Bob";              // OK: primitive copied
shallow.address.city = "LA";       // Problem: nested object shared!

console.log(original.name);        // "Alice" (unchanged)
console.log(original.address.city);// "LA" (changed! ⚠️)

// Deep copy - copies everything recursively
const deep = JSON.parse(JSON.stringify(original));
deep.address.city = "SF";

console.log(original.address.city); // "LA" (unchanged)
console.log(deep.address.city);     // "SF"
```

<details>
<summary><strong>🔍 Deep Dive: V8 Engine Internals</strong></summary>

### How V8 Stores Primitives vs Objects

**Stack Storage (Primitives):**
```
Stack Frame:
┌──────────────┐
│ a = 10       │ ← Direct value storage
│ b = 20       │ ← Another direct value
│ str = "hi"   │ ← Small strings inline (Smi)
└──────────────┘
```

**Heap Storage (Objects):**
```
Stack Frame:        Heap Memory:
┌──────────────┐   ┌────────────────┐
│ obj → 0x1234 │──→│ { name: "John" }│
│ arr → 0x5678 │──→│ [1, 2, 3]      │
└──────────────┘   └────────────────┘
```

**Smi (Small Integer) Optimization:**
- V8 stores integers from -2^30 to 2^30-1 as "Smi" (tagged pointers)
- Smi = value << 1 | 1 (LSB set to 1 to mark as integer)
- No heap allocation needed!
- Faster than heap-allocated numbers

**String Internalization:**
- V8 interns string literals in a string table
- Same string literals share memory
```javascript
const s1 = "hello";
const s2 = "hello";
// Both point to same interned string in memory!
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Reference Bug</strong></summary>

### Production Bug: Mutating Shared State

**Scenario:** Your dashboard is showing wrong user data after updates.

```javascript
// ❌ BUG: Accidentally mutating Redux state
function reducer(state = { users: [] }, action) {
  switch (action.type) {
    case 'ADD_USER':
      // NEVER do this! Mutates original state
      state.users.push(action.payload);
      return state;

    default:
      return state;
  }
}

// Why this breaks:
// - Redux relies on reference checks: oldState === newState
// - If same reference, React won't re-render
// - Data updates but UI doesn't!
```

**Fix: Always create new references**
```javascript
// ✅ CORRECT: Create new array reference
function reducer(state = { users: [] }, action) {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload] // New array!
      };

    default:
      return state;
  }
}
```

**Debugging Tips:**
1. Use `Object.freeze(state)` in development to catch mutations
2. Enable Redux DevTools immutability check
3. Use Immer library for safe mutations
4. Always check `===` before/after state updates

</details>

<details>
<summary><strong>⚖️ Trade-offs: Value vs Reference Types</strong></summary>

### Performance Considerations

**Primitives (Stack):**
- ✅ **Pros:**
  - Fast allocation/deallocation (stack pointer bump)
  - Cache-friendly (locality of reference)
  - No garbage collection overhead
  - Predictable memory usage

- ❌ **Cons:**
  - Limited size (stack overflow risk)
  - Must copy entire value
  - Can't share data efficiently

**Objects (Heap):**
- ✅ **Pros:**
  - Can store large, complex data
  - Reference sharing (multiple variables, one object)
  - Dynamic sizing

- ❌ **Cons:**
  - Slower allocation (heap fragmentation)
  - Garbage collection pauses
  - Cache misses
  - Reference bugs (unintended mutations)

**When to Use What:**

Use primitives when:
- Data is small and simple
- Immutability is desired
- Performance is critical

Use objects when:
- Data is complex/nested
- Need to share state
- Size is unpredictable

</details>

<details>
<summary><strong>💬 Explain to Junior Developer</strong></summary>

"Think of primitives like **sticky notes** and objects like **filing cabinets**.

When you copy a sticky note (primitive), you write the exact same text on a new note. Changing the new note doesn't affect the original.

```javascript
let note1 = "Buy milk";
let note2 = note1;  // Copy the text
note2 = "Buy eggs"; // Change copy

// note1 still says "Buy milk"
```

But with a filing cabinet (object), copying gives you **a key to the same cabinet**, not a whole new cabinet!

```javascript
let cabinet1 = { item: "milk" };
let cabinet2 = cabinet1;  // Copy the key
cabinet2.item = "eggs";   // Open with key, change contents

// cabinet1.item is now "eggs" too! (same cabinet)
```

To actually duplicate a cabinet, you need to build a new one and copy each drawer:

```javascript
let newCabinet = { ...cabinet1 }; // Build new cabinet
```

**Key takeaway:** Primitives copy values, objects copy references (addresses)."

</details>

### Common Mistakes

❌ **Mistake 1:** Thinking `typeof null` returns "null"
```javascript
console.log(typeof null); // "object" (not "null"!)
```
This is a 25+ year old bug that can't be fixed without breaking the web.

❌ **Mistake 2:** Assuming arrays have their own type
```javascript
console.log(typeof []); // "object" (not "array")
// Use Array.isArray() instead
console.log(Array.isArray([])); // true
```

❌ **Mistake 3:** Shallow copying nested objects
```javascript
const obj = { nested: { count: 0 } };
const copy = { ...obj }; // Shallow copy!
copy.nested.count = 1;
console.log(obj.nested.count); // 1 (mutated! ⚠️)
```

✅ **Correct:** Deep copy when needed
```javascript
const deep = JSON.parse(JSON.stringify(obj));
// or use structuredClone() or libraries like lodash.cloneDeep
```

### Follow-up Questions

1. "What is the difference between `null` and `undefined`?"
2. "Why does `typeof null` return 'object'?"
3. "How would you check if a variable is an array?"
4. "What is the difference between shallow and deep copy?"
5. "Can you mutate a const object? Why or why not?"
6. "How does JavaScript store numbers in memory?"
7. "What happens when you exceed the stack size?"

### Resources

- [MDN: JavaScript Data Types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [V8 Blog: Fast Properties](https://v8.dev/blog/fast-properties)
- [JavaScript.info: Data Types](https://javascript.info/types)

---

## Question 2: What is the difference between null and undefined?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Netflix

### Question

Explain the difference between `null` and `undefined`. When should you use each? How does JavaScript treat them differently?

### Answer

Both represent "no value", but with different semantics:

**`undefined`:**
- Default value for uninitialized variables
- Function parameters without arguments
- Missing object properties
- Function without explicit return
- Automatically assigned by JavaScript

**`null`:**
- Explicitly assigned by programmer
- Represents intentional absence
- "I know there's no value here"
- Used in APIs to indicate "no object"

### Code Example

```javascript
// ============================================
// 1. UNDEFINED - AUTOMATIC
// ============================================

// Uninitialized variable
let x;
console.log(x); // undefined

// Missing function parameter
function greet(name) {
  console.log(name); // undefined if not passed
}
greet();

// Missing object property
const obj = { a: 1 };
console.log(obj.b); // undefined

// Function without return
function noReturn() {
  // no return statement
}
console.log(noReturn()); // undefined

// Explicit return undefined
function explicitUndefined() {
  return undefined;
}
console.log(explicitUndefined()); // undefined

// Array holes (sparse arrays)
const arr = [1, , 3]; // Middle element is undefined
console.log(arr[1]); // undefined
console.log(arr.length); // 3

// ============================================
// 2. NULL - INTENTIONAL
// ============================================

// Explicitly set to null
let user = null; // "No user logged in"
console.log(user); // null

// API responses
const response = {
  data: null,  // "No data available"
  error: null  // "No error occurred"
};

// Clearing references
let bigData = { /* large object */ };
bigData = null; // Help garbage collector

// DOM APIs return null
document.getElementById('nonexistent'); // null (not undefined!)

// RegExp match returns null
'hello'.match(/\d+/); // null (no match)

// Object.getPrototypeOf(Object.prototype)
console.log(Object.getPrototypeOf(Object.prototype)); // null (end of chain)

// ============================================
// 3. TYPE CHECKING
// ============================================

console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" ⚠️ (bug!)

// Equality checks
console.log(undefined == null);  // true (loose equality)
console.log(undefined === null); // false (strict equality)

// ============================================
// 4. CHECKING FOR BOTH
// ============================================

function processValue(value) {
  // Check for null OR undefined
  if (value == null) {  // Covers both!
    console.log('No value');
    return;
  }

  // Or more explicit:
  if (value === null || value === undefined) {
    console.log('No value');
    return;
  }

  console.log('Has value:', value);
}

processValue(undefined); // "No value"
processValue(null);      // "No value"
processValue(0);         // "Has value: 0"
processValue('');        // "Has value: "

// ============================================
// 5. NULLISH COALESCING (??)
// ============================================

// Returns right side if left is null OR undefined
const value1 = null ?? 'default';
console.log(value1); // "default"

const value2 = undefined ?? 'default';
console.log(value2); // "default"

const value3 = 0 ?? 'default';
console.log(value3); // 0 (not replaced!)

const value4 = '' ?? 'default';
console.log(value4); // "" (not replaced!)

// Compare with OR (||)
console.log(0 || 'default');  // "default" (0 is falsy)
console.log(0 ?? 'default');  // 0 (0 is not nullish)

// ============================================
// 6. OPTIONAL CHAINING (?.)
// ============================================

const user = {
  name: "Alice",
  address: {
    street: "Main St"
  }
};

// Safe property access
console.log(user?.address?.street); // "Main St"
console.log(user?.address?.city);   // undefined (not error!)
console.log(user?.contact?.email);  // undefined (contact doesn't exist)

// Without optional chaining (old way)
const email = user && user.contact && user.contact.email;

// ============================================
// 7. JSON SERIALIZATION
// ============================================

const obj = {
  a: undefined,
  b: null,
  c: 0,
  d: false
};

console.log(JSON.stringify(obj));
// {"b":null,"c":0,"d":false}
// Note: undefined is REMOVED, null is kept!

// In arrays
console.log(JSON.stringify([undefined, null, 0]));
// [null,null,0]
// undefined becomes null in arrays!

// ============================================
// 8. FUNCTION PARAMETERS
// ============================================

function greet(name = 'Guest') {
  // Default parameter only applies to undefined
  console.log(`Hello, ${name}!`);
}

greet();          // "Hello, Guest!" (undefined → default)
greet(undefined); // "Hello, Guest!" (undefined → default)
greet(null);      // "Hello, null!" (null doesn't trigger default!)

// Better: check for nullish
function greetBetter(name) {
  const finalName = name ?? 'Guest';
  console.log(`Hello, ${finalName}!`);
}

greetBetter(null);      // "Hello, Guest!"
greetBetter(undefined); // "Hello, Guest!"
```

<details>
<summary><strong>🔍 Deep Dive: Why typeof null === "object"?</strong></summary>

### The Historical Bug

In the first JavaScript implementation (1995):
- Values were represented as type tag + value
- Type tags: 000 (object), 001 (int), 010 (double), etc.
- `null` was represented as 0x00 (all zeros)
- 0x00 matched the "object" type tag!

```
Binary representation:
null:   00000000 00000000 00000000 00000000
         ^^^
         000 = object type tag!
```

**Why not fixed?**
- Billions of websites rely on this behavior
- Changing it would break `typeof null === "object"` checks
- TC39 proposed fix in 2013, rejected due to backward compatibility

**Workaround:**
```javascript
function isNull(value) {
  return value === null;
}

function isObject(value) {
  return typeof value === 'object' && value !== null;
}
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: API Response Handling</strong></summary>

### Production Bug: Confusing null vs undefined

**Scenario:** Your app crashes when parsing API responses.

```javascript
// ❌ BUG: Not handling null properly
function getUserEmail(userId) {
  const response = api.getUser(userId);

  // Assumes email always exists
  return response.user.email.toLowerCase(); // 💥 Crashes!
}

// API returns: { user: { email: null } } when no email
// Or: { user: null } when user not found
```

**Fix: Proper null/undefined checking**
```javascript
// ✅ CORRECT: Handle all cases
function getUserEmail(userId) {
  const response = api.getUser(userId);

  // Check each level
  if (!response?.user?.email) {
    return 'No email available';
  }

  return response.user.email.toLowerCase();
}

// Or with nullish coalescing
function getUserEmail(userId) {
  const response = api.getUser(userId);
  const email = response?.user?.email ?? 'No email';
  return email === 'No email' ? email : email.toLowerCase();
}
```

**Best Practice: Define API contracts**
```typescript
// Use TypeScript to document what can be null
interface User {
  id: string;
  email: string | null;  // Explicitly nullable
  name: string;          // Never null
}

interface ApiResponse {
  user: User | null;  // User might not exist
  error?: string;     // Error is optional
}
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: When to Use Each</strong></summary>

### Decision Matrix

**Use `undefined` when:**
- Variable hasn't been initialized yet
- Optional function parameters
- Letting JavaScript handle defaults
- Property doesn't exist

```javascript
function fetch(url, options) {
  // options is undefined if not passed
  const timeout = options?.timeout ?? 3000;
}
```

**Use `null` when:**
- Explicitly clearing a value
- API contracts (value exists but is empty)
- Garbage collection hints
- End of linked structures

```javascript
class LinkedList {
  constructor() {
    this.head = null; // Explicit: no head yet
  }
}

// Clear expensive object
let bigCache = { /* GB of data */ };
bigCache = null; // Help GC
```

**Use neither (throw error) when:**
- Value is required
- Invalid state
- Programming error

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero'); // Don't return null!
  }
  return a / b;
}
```

### Performance Impact

**Checking for nullish:**
```javascript
// Fastest (V8 optimized)
if (value == null) { } // Covers both

// Slower (two comparisons)
if (value === null || value === undefined) { }

// Slowest (property access)
if (typeof value === 'undefined') { }
```

</details>

<details>
<summary><strong>💬 Explain to Junior Developer</strong></summary>

"Think of `undefined` as **'I don't know'** and `null` as **'I know there's nothing'**.

**undefined** is like a form field you haven't filled out yet:
```javascript
let phoneNumber; // undefined
// You haven't decided what to put there yet
```

**null** is like writing 'N/A' on the form:
```javascript
let phoneNumber = null; // explicitly no phone
// You KNOW they don't have a phone number
```

**Real-world example:**
```javascript
const person = {
  name: "Alice",
  email: "alice@example.com",
  phone: null,        // Has no phone (we know this!)
  // address: ???     // Undefined (not on object at all)
};

console.log(person.phone);   // null (we know she has no phone)
console.log(person.address); // undefined (we never asked!)
```

**Key difference:**
- `undefined` = **'not set yet'** or **'doesn't exist'**
- `null` = **'intentionally empty'** or **'no value'**
"

</details>

### Common Mistakes

❌ **Mistake 1:** Using `undefined` for intentional absence
```javascript
function findUser(id) {
  if (!userExists(id)) {
    return undefined; // ❌ Unclear intent
  }
  return user;
}
```

✅ **Better:** Use `null` for explicit "not found"
```javascript
function findUser(id) {
  if (!userExists(id)) {
    return null; // ✅ Clear: user doesn't exist
  }
  return user;
}
```

❌ **Mistake 2:** Checking with `==` when you want only `null`
```javascript
if (value == null) {
  // Matches BOTH null AND undefined!
}
```

✅ **Better:** Be explicit when needed
```javascript
if (value === null) {
  // Only matches null
}
```

❌ **Mistake 3:** Forgetting null in default parameters
```javascript
function greet(name = 'Guest') {
  console.log(name);
}
greet(null); // Prints "null" (null doesn't trigger default!)
```

✅ **Better:** Use nullish coalescing
```javascript
function greet(name) {
  const finalName = name ?? 'Guest';
  console.log(finalName);
}
greet(null); // Prints "Guest"
```

### Follow-up Questions

1. "Why does `typeof null` return 'object'?"
2. "When should you use `==` vs `===` with null/undefined?"
3. "How does JSON.stringify handle null vs undefined?"
4. "What is nullish coalescing and how is it different from ||?"
5. "Can you have an undefined property that passes `hasOwnProperty`?"
6. "How do default parameters handle null vs undefined?"

### Resources

- [MDN: null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)
- [MDN: undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [MDN: Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

---

## Question 3: What is Symbol in JavaScript and when would you use it?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Netflix

### Question

Explain the Symbol primitive type. What problems does it solve? When would you use it in production code?

### Answer

**Symbol** is a unique, immutable primitive type introduced in ES6 (ES2015). Every Symbol is guaranteed to be unique, making it perfect for:
- Creating private object properties
- Avoiding property name collisions
- Defining object metadata
- Implementing well-known protocols (iterators, etc.)

**Key Characteristics:**
1. Every Symbol() call creates a unique value
2. Symbols are immutable
3. Can be used as object property keys
4. Not enumerable in for...in loops
5. Not serialized by JSON.stringify()
6. Hidden from Object.keys() but accessible via Object.getOwnPropertySymbols()

### Code Example

```javascript
// ============================================
// 1. CREATING SYMBOLS - UNIQUENESS
// ============================================

const sym1 = Symbol();
const sym2 = Symbol();

console.log(sym1 === sym2); // false (ALWAYS unique!)

// Description is just for debugging
const sym3 = Symbol("userId");
const sym4 = Symbol("userId");
console.log(sym3 === sym4); // false (still unique!)

console.log(sym3.toString());      // "Symbol(userId)"
console.log(sym3.description);     // "userId"

// ============================================
// 2. SYMBOLS AS OBJECT KEYS - PRIVATE PROPERTIES
// ============================================

const PASSWORD = Symbol("password");
const user = {
  username: "alice",
  email: "alice@example.com",
  [PASSWORD]: "secret123"  // Symbol property
};

// Regular property access
console.log(user.username);  // "alice"

// Symbol property access
console.log(user[PASSWORD]); // "secret123"

// Can't access without the symbol
console.log(user.password);  // undefined
console.log(user["password"]); // undefined

// Symbol properties are hidden from enumeration
console.log(Object.keys(user));        // ["username", "email"]
console.log(JSON.stringify(user));     // {"username":"alice","email":"alice@example.com"}

// But can be accessed if you have the symbol reference
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(password)]

// ============================================
// 3. AVOIDING NAME COLLISIONS
// ============================================

// Library A adds a method
const libraryA = {
  getData: Symbol("getData")
};

const obj = {
  name: "My Object",
  [libraryA.getData]() {
    return "Data from Library A";
  }
};

// Library B can add its own method without conflict
const libraryB = {
  getData: Symbol("getData")
};

obj[libraryB.getData] = function() {
  return "Data from Library B";
};

// No collision! Both methods coexist
console.log(obj[libraryA.getData]()); // "Data from Library A"
console.log(obj[libraryB.getData]()); // "Data from Library B"

// ============================================
// 4. GLOBAL SYMBOL REGISTRY
// ============================================

// Symbol.for() creates/retrieves global symbols
const globalSym1 = Symbol.for("app.userId");
const globalSym2 = Symbol.for("app.userId");

console.log(globalSym1 === globalSym2); // true (same symbol!)

// Get key from symbol
console.log(Symbol.keyFor(globalSym1)); // "app.userId"

// Regular symbols not in registry
const localSym = Symbol("local");
console.log(Symbol.keyFor(localSym)); // undefined

// ============================================
// 5. WELL-KNOWN SYMBOLS - ITERATOR
// ============================================

// Make object iterable with Symbol.iterator
const range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,

      next() {
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

// Now works with for...of
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// And spread operator
console.log([...range]); // [1, 2, 3, 4, 5]

// ============================================
// 6. WELL-KNOWN SYMBOLS - TO PRIMITIVE
// ============================================

const money = {
  amount: 100,
  currency: "USD",

  // Custom type conversion
  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return this.amount;
    }
    if (hint === "string") {
      return `${this.amount} ${this.currency}`;
    }
    return this.amount; // default
  }
};

console.log(+money);        // 100 (number context)
console.log(`${money}`);    // "100 USD" (string context)
console.log(money + 50);    // 150 (default context)

// ============================================
// 7. REAL-WORLD USE CASE: PRIVATE CLASS FIELDS
// ============================================

// Before private fields (#), Symbols were used
const _balance = Symbol("balance");
const _validateAmount = Symbol("validateAmount");

class BankAccount {
  constructor(initialBalance) {
    this[_balance] = initialBalance;
  }

  [_validateAmount](amount) {
    return amount > 0 && Number.isFinite(amount);
  }

  deposit(amount) {
    if (this[_validateAmount](amount)) {
      this[_balance] += amount;
      return true;
    }
    return false;
  }

  getBalance() {
    return this[_balance];
  }
}

const account = new BankAccount(1000);
account.deposit(500);

console.log(account.getBalance());  // 1500

// Can't access private fields directly
console.log(account._balance);      // undefined
console.log(account.balance);       // undefined

// Even Object.keys won't show them
console.log(Object.keys(account));  // []

// ============================================
// 8. WELL-KNOWN SYMBOLS - ALL OF THEM
// ============================================

console.log(Symbol.iterator);       // Define iteration behavior
console.log(Symbol.toStringTag);    // Customize Object.prototype.toString()
console.log(Symbol.toPrimitive);    // Custom type conversion
console.log(Symbol.hasInstance);    // Customize instanceof behavior
console.log(Symbol.isConcatSpreadable); // Control Array.prototype.concat()
console.log(Symbol.species);        // Control constructor for derived objects
console.log(Symbol.match);          // String.prototype.match() behavior
console.log(Symbol.replace);        // String.prototype.replace() behavior
console.log(Symbol.search);         // String.prototype.search() behavior
console.log(Symbol.split);          // String.prototype.split() behavior
console.log(Symbol.unscopables);    // Exclude properties from with statement

// ============================================
// 9. CUSTOM TO STRING TAG
// ============================================

class ValidatedData {
  constructor(data) {
    this.data = data;
  }

  get [Symbol.toStringTag]() {
    return 'ValidatedData';
  }
}

const vd = new ValidatedData({ name: "Alice" });
console.log(Object.prototype.toString.call(vd)); // "[object ValidatedData]"
console.log(vd.toString()); // "[object ValidatedData]"

// ============================================
// 10. SYMBOLS IN REFLECTION
// ============================================

const obj = {
  regular: "prop",
  [Symbol("sym1")]: "value1",
  [Symbol("sym2")]: "value2"
};

// Regular reflection
console.log(Object.keys(obj));                    // ["regular"]
console.log(Object.getOwnPropertyNames(obj));     // ["regular"]

// Symbol reflection
console.log(Object.getOwnPropertySymbols(obj));   // [Symbol(sym1), Symbol(sym2)]

// All properties (including symbols)
console.log(Reflect.ownKeys(obj));                // ["regular", Symbol(sym1), Symbol(sym2)]
```

<details>
<summary><strong>🔍 Deep Dive: How V8 Implements Symbols</strong></summary>

### Symbol Implementation in V8

**Memory Structure:**
```cpp
// Simplified V8 internal structure
class Symbol : public Name {
  private:
    int32_t hash_field_;  // Cached hash
    Object description_;  // Optional description string
    int32_t flags_;       // Private, well-known, etc.
};
```

**Uniqueness Guarantee:**
- Each Symbol gets unique memory address
- Equality check is pointer comparison (O(1))
- No hash collisions possible

**Global Symbol Registry:**
```
Global Registry (Hash Table):
┌────────────────┬──────────────┐
│ "app.userId"   │ → Symbol@0x1 │
│ "app.sessionId"│ → Symbol@0x2 │
└────────────────┴──────────────┘
```

**Property Storage:**
- Symbol properties stored in separate "symbol table"
- Not included in fast property access paths
- Allows for true privacy (until Reflect/getOwnPropertySymbols)

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Library Conflicts</strong></summary>

### Production Problem: Third-Party Library Collision

**Scenario:** Two analytics libraries both add `track` method to objects.

```javascript
// ❌ PROBLEM: Name collision
const user = { name: "Alice" };

// Library A
user.track = function(event) {
  console.log("Library A tracking:", event);
};

// Library B overwrites it!
user.track = function(event) {
  console.log("Library B tracking:", event);
};

user.track("click"); // Only Library B works!
```

**Fix: Use Symbols for namespacing**
```javascript
// ✅ SOLUTION: Each library uses its own symbol
// Library A
const TRACK_A = Symbol("track");
user[TRACK_A] = function(event) {
  console.log("Library A tracking:", event);
};

// Library B
const TRACK_B = Symbol("track");
user[TRACK_B] = function(event) {
  console.log("Library B tracking:", event);
};

// Both methods coexist!
user[TRACK_A]("click"); // Library A
user[TRACK_B]("click"); // Library B
```

**Real Example: React Internal Properties**
```javascript
// React uses Symbols for internal properties
const element = <div>Hello</div>;

console.log(Object.getOwnPropertySymbols(element));
// Includes Symbol(react.element) and others
// Prevents user code from accidentally overwriting
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Symbols vs Other Privacy Methods</strong></summary>

### Comparison Matrix

**Symbols:**
- ✅ True uniqueness guarantee
- ✅ No string-based access
- ✅ Hidden from JSON serialization
- ❌ Discoverable via `Object.getOwnPropertySymbols()`
- ❌ Must pass symbol reference around
- ❌ Not truly private

**Private Fields (#):**
- ✅ Truly private (not accessible outside class)
- ✅ Clean syntax
- ❌ Only works in classes
- ❌ Can't be added dynamically
- ❌ Browser support (newer)

**Closures:**
- ✅ Truly private
- ✅ Works everywhere
- ❌ Memory overhead
- ❌ Can't add to existing objects
- ❌ No reflection possible

**WeakMap:**
- ✅ Truly private
- ✅ Garbage collection friendly
- ❌ Extra object needed
- ❌ More complex syntax
- ❌ Can't serialize

**When to Use Symbols:**
- Need unique property keys
- Avoid naming collisions (libraries)
- Implement well-known protocols
- Want discoverable "private" properties
- Working with plain objects (not classes)

</details>

<details>
<summary><strong>💬 Explain to Junior Developer</strong></summary>

"Think of Symbols as **special VIP badges** that are impossible to duplicate.

Imagine a nightclub where multiple companies are hosting events. Each company gives their guests a unique badge:

```javascript
const companyA_Badge = Symbol("VIP");
const companyB_Badge = Symbol("VIP");

// Even though both say "VIP", they're completely different badges!
console.log(companyA_Badge === companyB_Badge); // false
```

Now guests (objects) can have multiple \"VIP\" properties without confusion:

```javascript
const guest = {
  name: "Alice",
  [companyA_Badge]: "Gold Access",
  [companyB_Badge]: "Platinum Access"
};

// Each company's badge works independently
console.log(guest[companyA_Badge]); // "Gold Access"
console.log(guest[companyB_Badge]); // "Platinum Access"
```

**Why is this useful?**

If you write a library and add a method to user objects, you don't want to accidentally overwrite their existing methods:

```javascript
// Your library
const MY_LIBRARY_METHOD = Symbol("getData");
userObject[MY_LIBRARY_METHOD] = function() { };

// No collision with user's own 'getData' method!
```

**Key insight:** Symbols guarantee uniqueness without checking if a name is already taken."

</details>

### Common Mistakes

❌ **Mistake 1:** Trying to use new Symbol()
```javascript
const sym = new Symbol(); // ❌ TypeError: Symbol is not a constructor
```

✅ **Correct:** Call Symbol() directly
```javascript
const sym = Symbol();
```

❌ **Mistake 2:** Expecting Symbol properties in JSON
```javascript
const obj = {
  [Symbol("id")]: 123
};
console.log(JSON.stringify(obj)); // "{}" (symbol property ignored!)
```

❌ **Mistake 3:** Using Symbol.for() for privacy
```javascript
const SECRET = Symbol.for("secret"); // ❌ Global! Anyone can access
obj[SECRET] = "password";

// Anyone can do:
console.log(obj[Symbol.for("secret")]); // "password"
```

✅ **Better:** Use local Symbol for privacy
```javascript
const SECRET = Symbol("secret"); // Only accessible in this scope
```

### Follow-up Questions

1. "How are Symbols different from strings as object keys?"
2. "What are well-known Symbols? Name 3 and their use cases."
3. "How would you implement true privacy without Symbols?"
4. "Can Symbols be garbage collected?"
5. "What is Symbol.for() and when would you use it?"
6. "How do Symbols help with metaprogramming?"

### Resources

- [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [JavaScript.info: Symbol Type](https://javascript.info/symbol)
- [Exploring ES6: Symbols](https://exploringjs.com/es6/ch_symbols.html)

---

## Question 4: What is BigInt and when should you use it instead of Number?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐
**Time:** 6-8 minutes
**Companies:** Google, Meta, Stripe, Coinbase

### Question

Explain BigInt primitive type. What problem does it solve? What are its limitations and when should you use it in production?

### Answer

**BigInt** is a numeric primitive introduced in ES2020 for representing integers larger than 2^53 - 1 (Number.MAX_SAFE_INTEGER = 9,007,199,254,740,991).

**Why BigInt Exists:**
- JavaScript Number uses IEEE 754 double-precision (64-bit)
- Only 53 bits for integer precision
- Integers beyond 2^53 lose precision
- BigInt can represent arbitrarily large integers

**Key Characteristics:**
1. Created with `n` suffix or `BigInt()` constructor
2. Arbitrary precision (limited only by memory)
3. Cannot mix with Number in operations
4. No decimal/fractional values
5. Slower than Number for small values
6. Not serializable by JSON.stringify()

### Code Example

```javascript
// ============================================
// 1. THE PROBLEM - NUMBER PRECISION LIMITS
// ============================================

// Maximum safe integer
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

// Beyond this, precision is lost
console.log(9007199254740991 + 1);  // 9007199254740992 ✅ correct
console.log(9007199254740991 + 2);  // 9007199254740992 ❌ WRONG!
console.log(9007199254740991 + 3);  // 9007199254740994 ❌ WRONG!

// Check if integer is safe
console.log(Number.isSafeInteger(9007199254740991)); // true
console.log(Number.isSafeInteger(9007199254740992)); // false

// ============================================
// 2. BIGINT SOLVES THIS
// ============================================

// Create BigInt with 'n' suffix
const big1 = 9007199254740991n;
const big2 = big1 + 1n;
const big3 = big1 + 2n;
const big4 = big1 + 3n;

console.log(big2); // 9007199254740992n ✅ correct
console.log(big3); // 9007199254740993n ✅ correct
console.log(big4); // 9007199254740994n ✅ correct

// Create BigInt from string (for very large numbers)
const huge = BigInt("123456789012345678901234567890");
console.log(huge); // 123456789012345678901234567890n

// Create BigInt from Number
const fromNumber = BigInt(123);
console.log(fromNumber); // 123n

// ============================================
// 3. ARITHMETIC OPERATIONS
// ============================================

const a = 10n;
const b = 20n;

console.log(a + b);   // 30n
console.log(a - b);   // -10n
console.log(a * b);   // 200n
console.log(b / a);   // 2n (integer division, no decimals!)
console.log(b % a);   // 0n
console.log(b ** 10n);// 10240000000000n (exponentiation)

// Division truncates (no decimals)
console.log(7n / 2n); // 3n (not 3.5!)
console.log(8n / 3n); // 2n (not 2.666...)

// Negative numbers work
console.log(-5n * 3n); // -15n

// ============================================
// 4. CANNOT MIX BIGINT AND NUMBER
// ============================================

const num = 10;
const big = 20n;

// ❌ These all throw TypeError
// console.log(num + big);  // TypeError!
// console.log(num * big);  // TypeError!
// console.log(Math.max(num, big)); // TypeError!

// ✅ Must convert explicitly
console.log(BigInt(num) + big);  // 30n
console.log(num + Number(big));  // 30

// ⚠️ Be careful with Number() conversion
const tooBig = 9007199254740992n;
console.log(Number(tooBig)); // 9007199254740992 (might lose precision!)

// ============================================
// 5. COMPARISONS
// ============================================

// Strict equality (different types)
console.log(10n === 10);   // false (different types)
console.log(10n === 10n);  // true

// Loose equality (type coercion)
console.log(10n == 10);    // true (coerced to same type)

// Relational operators work across types
console.log(10n < 20);     // true
console.log(5n > 3);       // true
console.log(10n <= 10);    // true

// Sorting mixed array
const mixed = [5n, 10, 3n, 8, 1n];
mixed.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
console.log(mixed); // [1n, 3n, 5n, 8, 10]

// ============================================
// 6. TYPE CHECKING
// ============================================

console.log(typeof 42n);  // "bigint"
console.log(typeof 42);   // "number"

function isBigInt(value) {
  return typeof value === 'bigint';
}

console.log(isBigInt(10n));  // true
console.log(isBigInt(10));   // false

// ============================================
// 7. REAL-WORLD USE CASE: TIMESTAMPS
// ============================================

// High-precision timestamps (nanoseconds)
const nanoTimestamp = BigInt(Date.now()) * 1000000n;
console.log(nanoTimestamp); // 1700000000000000000n

// Twitter Snowflake IDs (64-bit)
const snowflakeId = 1234567890123456789n;
console.log(snowflakeId);

// ============================================
// 8. REAL-WORLD USE CASE: CRYPTOCURRENCY
// ============================================

// Ethereum wei (1 ETH = 10^18 wei)
const ONE_ETH_IN_WEI = 1000000000000000000n; // 10^18

function ethToWei(eth) {
  return BigInt(eth) * ONE_ETH_IN_WEI;
}

function weiToEth(wei) {
  return Number(wei) / Number(ONE_ETH_IN_WEI);
}

const ethAmount = ethToWei(5);
console.log(ethAmount); // 5000000000000000000n wei

// ============================================
// 9. BITWISE OPERATIONS
// ============================================

const x = 12n; // 1100 in binary
const y = 10n; // 1010 in binary

console.log(x & y);  // 8n  (1000 - AND)
console.log(x | y);  // 14n (1110 - OR)
console.log(x ^ y);  // 6n  (0110 - XOR)
console.log(~x);     // -13n (NOT)
console.log(x << 2n);// 48n (left shift)
console.log(x >> 2n);// 3n  (right shift)

// ============================================
// 10. JSON SERIALIZATION PROBLEM
// ============================================

const data = {
  id: 1234567890123456789n,
  amount: 1000n
};

// ❌ JSON.stringify doesn't support BigInt
try {
  JSON.stringify(data); // TypeError: BigInt value can't be serialized
} catch (e) {
  console.error(e.message);
}

// ✅ Solution 1: Convert to string
const serializable = {
  id: data.id.toString(),
  amount: data.amount.toString()
};
console.log(JSON.stringify(serializable)); // Works!

// ✅ Solution 2: Custom toJSON
BigInt.prototype.toJSON = function() {
  return this.toString();
};
console.log(JSON.stringify(data)); // Now works!

// ✅ Solution 3: Replacer function
const json = JSON.stringify(data, (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
);
console.log(json); // {"id":"1234567890123456789","amount":"1000"}

// ============================================
// 11. PERFORMANCE CONSIDERATIONS
// ============================================

// Small numbers: Number is faster
console.time('Number');
for (let i = 0; i < 1000000; i++) {
  let x = 10 + 20;
}
console.timeEnd('Number'); // ~2ms

console.time('BigInt');
for (let i = 0; i < 1000000; i++) {
  let x = 10n + 20n;
}
console.timeEnd('BigInt'); // ~15ms (slower!)

// Large numbers: BigInt is necessary
const large1 = 9007199254740991n;
const large2 = 9007199254740991n;
console.log(large1 + large2); // Accurate!

// ============================================
// 12. EDGE CASES AND LIMITATIONS
// ============================================

// No fractional values
// const fraction = 3.14n; // ❌ SyntaxError

// No Infinity or NaN
// const inf = Infinity; // OK for Number
// const infBig = Infinityn; // ❌ SyntaxError

// Math functions don't work
// console.log(Math.sqrt(25n)); // ❌ TypeError
// console.log(Math.max(10n, 20n)); // ❌ TypeError

// Unary plus doesn't work
// console.log(+10n); // ❌ TypeError

// But unary minus works
console.log(-10n); // -10n ✅
```

<details>
<summary><strong>🔍 Deep Dive: How BigInt Works Internally</strong></summary>

### BigInt Implementation

**Number (IEEE 754 Double):**
```
64 bits total:
[1 bit sign][11 bits exponent][52 bits mantissa]
                                ↑
                        Only 53 bits precision!
```

**BigInt (Arbitrary Precision):**
```
Stored as array of "digits" (typically 32-bit chunks):
BigInt: 12345678901234567890
       ↓
Chunks: [1234567890, 1234567890] (simplified)
        └─────┬────┘ └─────┬────┘
          Digit 0      Digit 1
```

**V8 Implementation:**
- Small BigInts (fit in 64 bits): stored inline
- Large BigInts: heap-allocated digit array
- Operations implemented in C++ for speed
- Karatsuba algorithm for multiplication
- Barrett reduction for modulo

**Why BigInt is Slower:**
- Heap allocation overhead
- Array operations vs CPU registers
- No hardware acceleration
- More complex algorithms

**Memory Usage:**
```javascript
// Number: always 8 bytes
let num = 123456789;

// BigInt: variable (roughly log10(n) bytes)
let big = 123456789n; // ~16 bytes minimum
let huge = 1234567890123456789012345678901234567890n; // ~24+ bytes
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Database ID Precision Loss</strong></summary>

### Production Bug: Lost Tweet IDs

**Scenario:** Twitter snowflake IDs losing precision when sent to JavaScript.

```javascript
// ❌ BUG: Server sends 64-bit integer
// Server response (JSON):
{
  "id": 1234567890123456789,  // 64-bit integer
  "text": "Hello world"
}

// JavaScript receives:
const tweet = JSON.parse(response);
console.log(tweet.id); // 1234567890123456770 ⚠️ PRECISION LOST!

// Why? Number can only safely represent up to 2^53-1
console.log(Number.isSafeInteger(1234567890123456789)); // false
```

**Fix 1: Server sends ID as string**
```javascript
// ✅ Server sends:
{
  "id": "1234567890123456789",  // String!
  "text": "Hello world"
}

// Client converts to BigInt
const tweet = JSON.parse(response);
const tweetId = BigInt(tweet.id);
console.log(tweetId); // 1234567890123456789n ✅ Accurate!
```

**Fix 2: Custom JSON parser**
```javascript
// ✅ Parse large integers as BigInt
function parseJsonWithBigInt(text) {
  return JSON.parse(text, (key, value) => {
    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
      return BigInt(value);
    }
    return value;
  });
}
```

**Real Example - PostgreSQL BIGINT:**
```javascript
// PostgreSQL BIGINT is 64-bit, can exceed Number.MAX_SAFE_INTEGER
const { rows } = await pool.query('SELECT id FROM users WHERE id > $1', [9007199254740991]);

// Without BigInt handling:
console.log(rows[0].id); // Precision loss! ⚠️

// With pg library configured for BigInt:
const pool = new Pool({
  types: {
    // Tell pg to return BIGINT as string
    getTypeParser: (id, format) => {
      if (id === 20) { // BIGINT type ID
        return val => BigInt(val);
      }
      return defaults.getTypeParser(id, format);
    }
  }
});
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: BigInt vs Number</strong></summary>

### Performance & Memory Comparison

| Aspect | Number | BigInt |
|--------|--------|--------|
| **Speed** | Fast (CPU native) | Slower (software) |
| **Memory** | 8 bytes (fixed) | Variable (grows) |
| **Precision** | 53 bits (±2^53) | Unlimited |
| **Decimals** | Yes (floating point) | No (integers only) |
| **Math lib** | Yes | No |
| **JSON** | Yes | No (needs custom) |
| **APIs** | All numeric APIs | Limited |

### When to Use Number

✅ Use Number when:
- Values fit in ±2^53
- Need floating-point math
- Performance is critical
- Working with standard APIs
- JSON serialization needed

```javascript
// Good use cases for Number:
const price = 19.99;
const percentage = 0.15;
const pixels = 1920;
const milliseconds = Date.now();
```

### When to Use BigInt

✅ Use BigInt when:
- Database IDs (64-bit integers)
- Cryptocurrency amounts (wei, satoshis)
- High-precision timestamps
- Large integer calculations
- Bitwise operations on large numbers

```javascript
// Good use cases for BigInt:
const userId = 1234567890123456789n; // Database ID
const ethWei = 1000000000000000000n; // 1 ETH in wei
const nanoseconds = 1700000000000000000n;
const hugeFactorial = factorial(100n); // 100!
```

### Hybrid Approach

```javascript
// Store as BigInt, display as Number
function displayCurrency(amountInCents) {
  // Store: BigInt for precision
  const cents = BigInt(amountInCents);

  // Display: Number for formatting
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(dollars);
}
```

</details>

<details>
<summary><strong>💬 Explain to Junior Developer</strong></summary>

"Think of Number as a **calculator** and BigInt as **pen and paper with unlimited space**.

**Number (Calculator):**
- Fast and convenient
- Has a limited display (53 digits)
- Can do decimals (3.14)
- Works with all buttons (Math functions)

```javascript
let calculator = 9007199254740991 + 2;
console.log(calculator); // Display shows wrong answer! 😱
```

**BigInt (Pen and Paper):**
- As many digits as you need
- Takes longer (writing by hand)
- No decimals (integers only)
- Limited functions (no sqrt, etc.)

```javascript
let paper = 9007199254740991n + 2n;
console.log(paper); // Correct answer! ✅
```

**When do you need pen and paper?**

1. **Database IDs** - like your user ID in a huge system
   ```javascript
   const userId = 1234567890123456789n; // Too big for calculator!
   ```

2. **Money in crypto** - 1 ETH = 1,000,000,000,000,000,000 wei
   ```javascript
   const oneEth = 1000000000000000000n; // Can't lose precision!
   ```

3. **Very exact counting** - when every single number matters
   ```javascript
   const exactCount = 999999999999999999n;
   ```

**Key rule:** Can't mix calculator math with paper math!
```javascript
const calc = 10;
const paper = 20n;
// calc + paper // ❌ Error! Convert first
BigInt(calc) + paper // ✅ Both on paper now
```
"

</details>

### Common Mistakes

❌ **Mistake 1:** Mixing BigInt and Number
```javascript
const result = 10n + 5; // ❌ TypeError!
```

✅ **Correct:** Convert explicitly
```javascript
const result = 10n + BigInt(5); // 15n ✅
const result2 = Number(10n) + 5; // 15 ✅
```

❌ **Mistake 2:** Expecting decimals
```javascript
console.log(7n / 2n); // 3n (not 3.5!)
```

✅ **Better:** Use Number for decimals
```javascript
console.log(7 / 2); // 3.5
```

❌ **Mistake 3:** JSON serialization
```javascript
JSON.stringify({ id: 123n }); // ❌ TypeError!
```

✅ **Correct:** Convert to string
```javascript
JSON.stringify({ id: 123n.toString() }); // ✅
```

❌ **Mistake 4:** Using Math functions
```javascript
Math.max(10n, 20n); // ❌ TypeError!
```

✅ **Correct:** Implement manually
```javascript
const max = (a, b) => a > b ? a : b;
console.log(max(10n, 20n)); // 20n
```

### Follow-up Questions

1. "Why doesn't JavaScript Number have more precision?"
2. "How would you implement JSON serialization for BigInt?"
3. "What are the performance implications of using BigInt?"
4. "Can you convert any Number to BigInt safely?"
5. "How do databases handle 64-bit integers differently than JavaScript?"
6. "What is the memory overhead of BigInt compared to Number?"

### Resources

- [MDN: BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [V8 Blog: BigInt](https://v8.dev/features/bigint)
- [JavaScript.info: BigInt](https://javascript.info/bigint)

---

## Question 5: What is the difference between typeof and instanceof?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question

Explain the difference between `typeof` and `instanceof` operators. When would you use each? What are their limitations?

### Answer

**`typeof`** - Returns a string indicating the primitive type of a value
**`instanceof`** - Tests whether an object is an instance of a specific constructor (checks prototype chain)

**Key Differences:**

| Aspect | typeof | instanceof |
|--------|--------|------------|
| **Works with** | Any value | Objects only |
| **Returns** | String type name | Boolean |
| **Checks** | Primitive type | Prototype chain |
| **Primitives** | Yes | No |
| **Objects** | Limited | Yes |
| **Cross-frame** | Yes | No |

### Code Example

```javascript
// ============================================
// 1. TYPEOF - PRIMITIVE TYPE CHECKING
// ============================================

// Primitives
console.log(typeof 42);              // "number"
console.log(typeof "hello");         // "string"
console.log(typeof true);            // "boolean"
console.log(typeof undefined);       // "undefined"
console.log(typeof Symbol('id'));    // "symbol"
console.log(typeof 123n);            // "bigint"

// Objects and functions
console.log(typeof {});              // "object"
console.log(typeof []);              // "object" ⚠️ (not "array"!)
console.log(typeof null);            // "object" ⚠️ (historical bug!)
console.log(typeof function(){});    // "function"
console.log(typeof class{});         // "function" (classes are functions)

// Typeof with undeclared variables (doesn't throw)
console.log(typeof undeclaredVar);   // "undefined" (safe!)
// console.log(undeclaredVar);       // ❌ ReferenceError!

// ============================================
// 2. TYPEOF - LIMITATIONS
// ============================================

// Can't distinguish object types
console.log(typeof []);              // "object"
console.log(typeof {});              // "object"
console.log(typeof new Date());      // "object"
console.log(typeof /regex/);         // "object"
console.log(typeof null);            // "object" ⚠️

// All objects are just "object"
const arr = [];
const date = new Date();
const regex = /test/;
console.log(typeof arr === typeof date === typeof regex); // true

// ============================================
// 3. INSTANCEOF - OBJECT TYPE CHECKING
// ============================================

// Built-in types
const arr = [1, 2, 3];
console.log(arr instanceof Array);   // true
console.log(arr instanceof Object);  // true (Array inherits from Object)

const date = new Date();
console.log(date instanceof Date);   // true
console.log(date instanceof Object); // true

const regex = /test/;
console.log(regex instanceof RegExp); // true
console.log(regex instanceof Object); // true

// Functions
function myFunc() {}
console.log(myFunc instanceof Function); // true
console.log(myFunc instanceof Object);   // true

// ============================================
// 4. INSTANCEOF - CUSTOM CLASSES
// ============================================

class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}

const animal = new Animal("Generic");
const dog = new Dog("Buddy", "Golden");

// Check instanceof
console.log(animal instanceof Animal);    // true
console.log(animal instanceof Dog);       // false
console.log(animal instanceof Object);    // true

console.log(dog instanceof Dog);          // true
console.log(dog instanceof Animal);       // true (inheritance!)
console.log(dog instanceof Object);       // true

// ============================================
// 5. INSTANCEOF - DOESN'T WORK WITH PRIMITIVES
// ============================================

// Primitives return false
console.log("hello" instanceof String);   // false (primitive!)
console.log(42 instanceof Number);        // false
console.log(true instanceof Boolean);     // false

// Only wrapper objects work
console.log(new String("hello") instanceof String); // true
console.log(new Number(42) instanceof Number);      // true
console.log(new Boolean(true) instanceof Boolean);  // true

// ============================================
// 6. COMBINING TYPEOF AND INSTANCEOF
// ============================================

function getDetailedType(value) {
  // Handle primitives with typeof
  const type = typeof value;

  if (type !== "object") {
    return type; // "string", "number", "boolean", etc.
  }

  // Handle null special case
  if (value === null) {
    return "null";
  }

  // Use instanceof for objects
  if (value instanceof Array) return "array";
  if (value instanceof Date) return "date";
  if (value instanceof RegExp) return "regexp";
  if (value instanceof Error) return "error";
  if (value instanceof Map) return "map";
  if (value instanceof Set) return "set";
  if (value instanceof WeakMap) return "weakmap";
  if (value instanceof WeakSet) return "weakset";
  if (value instanceof Promise) return "promise";

  return "object";
}

console.log(getDetailedType(42));            // "number"
console.log(getDetailedType("hello"));       // "string"
console.log(getDetailedType(null));          // "null"
console.log(getDetailedType([]));            // "array"
console.log(getDetailedType(new Date()));    // "date"
console.log(getDetailedType({}));            // "object"

// ============================================
// 7. RELIABLE TYPE CHECKING
// ============================================

// Most reliable: Object.prototype.toString
function getType(value) {
  return Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();
}

console.log(getType(42));              // "number"
console.log(getType("hello"));         // "string"
console.log(getType(null));            // "null"
console.log(getType(undefined));       // "undefined"
console.log(getType([]));              // "array" ✅
console.log(getType({}));              // "object"
console.log(getType(new Date()));      // "date" ✅
console.log(getType(/regex/));         // "regexp" ✅
console.log(getType(function(){}));    // "function"
console.log(getType(Promise.resolve())); // "promise" ✅

// ============================================
// 8. ARRAY CHECKING (BEST PRACTICES)
// ============================================

const arr = [1, 2, 3];

// ❌ Using typeof (not helpful)
console.log(typeof arr);               // "object"

// ⚠️ Using instanceof (can fail across frames)
console.log(arr instanceof Array);     // true (but unreliable across iframes)

// ✅ Using Array.isArray() (BEST)
console.log(Array.isArray(arr));       // true ✅ Most reliable!

// Why Array.isArray is best:
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const iframeArray = window.frames[window.frames.length - 1].Array;
const arr2 = new iframeArray(1, 2, 3);

console.log(arr2 instanceof Array);    // false ⚠️ (different Array constructor)
console.log(Array.isArray(arr2));      // true ✅ Works!

// ============================================
// 9. PROTOTYPE CHAIN AND INSTANCEOF
// ============================================

// Constructor functions
function Vehicle(type) {
  this.type = type;
}

function Car(brand) {
  Vehicle.call(this, 'car');
  this.brand = brand;
}

// Set up inheritance
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

const myCar = new Car('Toyota');

console.log(myCar instanceof Car);     // true
console.log(myCar instanceof Vehicle); // true (prototype chain!)
console.log(myCar instanceof Object);  // true

// Check prototype chain manually
console.log(Vehicle.prototype.isPrototypeOf(myCar));  // true
console.log(Object.prototype.isPrototypeOf(myCar));   // true

// ============================================
// 10. INSTANCEOF WITH NULL/UNDEFINED
// ============================================

console.log(null instanceof Object);      // false
console.log(undefined instanceof Object); // false

// They're primitives, not objects
console.log(typeof null);      // "object" ⚠️ (but instanceof knows better!)
console.log(typeof undefined); // "undefined"

// ============================================
// 11. MANIPULATING PROTOTYPE CHAIN
// ============================================

const obj = {};
console.log(obj instanceof Object);    // true

// Remove from prototype chain
Object.setPrototypeOf(obj, null);
console.log(obj instanceof Object);    // false (no longer in chain!)

// Check prototype directly
console.log(Object.getPrototypeOf(obj)); // null

// ============================================
// 12. CUSTOM INSTANCEOF BEHAVIOR
// ============================================

class MyClass {
  // Customize instanceof behavior
  static [Symbol.hasInstance](instance) {
    console.log('Custom instanceof check!');
    return instance.customMarker === true;
  }
}

const obj1 = { customMarker: true };
const obj2 = { customMarker: false };

console.log(obj1 instanceof MyClass); // Custom instanceof check! → true
console.log(obj2 instanceof MyClass); // Custom instanceof check! → false

// ============================================
// 13. TYPE GUARDS (TYPESCRIPT PATTERN IN JS)
// ============================================

function isString(value) {
  return typeof value === "string";
}

function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isDate(value) {
  return value instanceof Date && !isNaN(value.getTime());
}

function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    value.constructor === Object
  );
}

function isFunction(value) {
  return typeof value === "function";
}

// Usage with type narrowing
function processValue(value) {
  if (isString(value)) {
    return value.toUpperCase(); // TypeScript knows it's string
  }

  if (isNumber(value)) {
    return value.toFixed(2); // TypeScript knows it's number
  }

  if (isArray(value)) {
    return value.length; // TypeScript knows it's array
  }

  throw new Error('Unsupported type');
}

// ============================================
// 14. PERFORMANCE COMPARISON
// ============================================

// Benchmark: typeof vs instanceof
const iterations = 1000000;
const obj = {};

console.time('typeof');
for (let i = 0; i < iterations; i++) {
  typeof obj;
}
console.timeEnd('typeof'); // ~2ms (very fast!)

console.time('instanceof');
for (let i = 0; i < iterations; i++) {
  obj instanceof Object;
}
console.timeEnd('instanceof'); // ~5ms (slower, checks prototype chain)

console.time('Array.isArray');
const arr = [];
for (let i = 0; i < iterations; i++) {
  Array.isArray(arr);
}
console.timeEnd('Array.isArray'); // ~3ms (optimized by engine)
```

<details>
<summary><strong>🔍 Deep Dive: How instanceof Works</strong></summary>

### instanceof Algorithm

**Step-by-step:**
```javascript
obj instanceof Constructor
```

1. Check if Constructor has `Symbol.hasInstance` method → use that
2. Get Constructor.prototype
3. Get obj's prototype (obj.[[Prototype]])
4. Walk up prototype chain:
   - If obj prototype === Constructor.prototype → return true
   - If obj prototype === null → return false
   - Otherwise, check next prototype in chain
5. Return false if not found

**Visual:**
```
Instance:              Constructor:
┌─────────┐           ┌──────────────┐
│  obj    │           │ Constructor  │
│         │           │              │
│[[Proto]]│──┐        │  prototype   │─┐
└─────────┘  │        └──────────────┘ │
             ↓                          │
        ┌─────────┐                     │
        │ Proto1  │<────────────────────┘
        │         │        Does this match?
        │[[Proto]]│──┐
        └─────────┘  │
             ↓
        ┌─────────┐
        │ Proto2  │
        │         │
        │[[Proto]]│── null (end)
        └─────────┘
```

**V8 Optimization:**
- Inline caching for common instanceof checks
- Fast path for built-in types (Array, Date, etc.)
- Slow path for custom constructors
- Special handling for Symbol.hasInstance

**Why instanceof is slower than typeof:**
- typeof: Simple tag check (one CPU instruction)
- instanceof: Prototype chain walk (multiple memory accesses)

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Cross-Frame instanceof Bug</strong></summary>

### Production Bug: iframe Array Detection Fails

**Scenario:** Your dashboard embeds widgets in iframes, and array detection fails.

```javascript
// ❌ BUG: Main page code
function processData(data) {
  if (data instanceof Array) {
    return data.map(x => x * 2);
  }
  throw new Error('Expected array');
}

// Widget in iframe sends array
const iframe = document.getElementById('widget');
const iframeArray = iframe.contentWindow.someArray;

processData(iframeArray); // ❌ Error! Not recognized as array
```

**Why it fails:**
```javascript
// Different execution contexts have different Array constructors
const mainArray = Array;
const iframeArray = iframe.contentWindow.Array;

console.log(mainArray === iframeArray); // false! Different constructors

// Arrays from iframe fail instanceof
const arr = iframe.contentWindow.Array(1, 2, 3);
console.log(arr instanceof Array);      // false ⚠️
console.log(Array.isArray(arr));       // true ✅
```

**Fix: Always use Array.isArray()**
```javascript
// ✅ CORRECT: Works across frames
function processData(data) {
  if (Array.isArray(data)) {  // Works!
    return data.map(x => x * 2);
  }
  throw new Error('Expected array');
}
```

**Other cross-frame issues:**
```javascript
// All of these fail across frames:
iframe.contentWindow.someDate instanceof Date;     // false
iframe.contentWindow.someRegex instanceof RegExp;  // false
iframe.contentWindow.someError instanceof Error;   // false

// Solution: Use duck typing or Object.prototype.toString
function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]';
}
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Type Checking Strategies</strong></summary>

### Comparison of Type Checking Methods

| Method | Speed | Reliability | Cross-frame | Primitives | Custom Types |
|--------|-------|-------------|-------------|------------|--------------|
| **typeof** | ⚡️⚡️⚡️ Fastest | ⚠️ Limited | ✅ Yes | ✅ Yes | ❌ No |
| **instanceof** | ⚡️⚡️ Fast | ⚠️ Frame issue | ❌ No | ❌ No | ✅ Yes |
| **Array.isArray()** | ⚡️⚡️ Fast | ✅ Reliable | ✅ Yes | N/A | N/A |
| **toString.call()** | ⚡️ Slower | ✅ Most reliable | ✅ Yes | ✅ Yes | ⚠️ Can spoof |
| **constructor** | ⚡️⚡️ Fast | ⚠️ Changeable | ⚠️ Issues | ❌ No | ✅ Yes |
| **Duck typing** | ⚡️ Slowest | ⚠️ Unreliable | ✅ Yes | ❌ No | ✅ Yes |

### Decision Matrix

**Use typeof when:**
- Checking primitive types
- Need fastest performance
- Checking for undefined (safe for undeclared vars)
- Simple type checks in hot paths

**Use instanceof when:**
- Checking custom class instances
- Need inheritance information
- Working within same execution context
- Type checking in class methods

**Use Array.isArray() when:**
- Checking for arrays specifically
- Working with cross-frame data
- Need reliable array detection

**Use Object.prototype.toString when:**
- Need most reliable type detection
- Working with cross-frame objects
- Checking built-in types accurately

</details>

<details>
<summary><strong>💬 Explain to Junior Developer</strong></summary>

"Think of `typeof` as asking **'What basic category is this?'** and `instanceof` as asking **'Was this made by a specific factory?'**

**typeof - Simple Categories:**
```javascript
typeof "hello"  // "string" - It's text
typeof 42       // "number" - It's a number
typeof {}       // "object" - It's some kind of object
typeof []       // "object" - Also some kind of object ⚠️
```

Like sorting mail: letter, package, envelope. Very basic categories.

**instanceof - Specific Factory:**
```javascript
const car = new Car();
car instanceof Car    // true - Made by Car factory
car instanceof Vehicle // true - Car factory uses Vehicle factory
car instanceof Object  // true - Everything uses Object factory at base
```

Like checking if a toy was made by LEGO, Fisher-Price, or Mattel.

**Key differences:**

1. **typeof works with everything:**
   ```javascript
   typeof 5      // "number" ✅
   typeof "hi"   // "string" ✅
   typeof null   // "object" ⚠️ (weird bug!)
   ```

2. **instanceof only works with objects:**
   ```javascript
   "hi" instanceof String   // false (not an object!)
   [1,2] instanceof Array   // true ✅
   ```

3. **instanceof checks the family tree:**
   ```javascript
   class Animal {}
   class Dog extends Animal {}

   const dog = new Dog();
   dog instanceof Dog     // true - Direct factory
   dog instanceof Animal  // true - Parent factory
   dog instanceof Object  // true - Grandparent factory
   ```

**Best practice:** Use `typeof` for simple stuff, `instanceof` for checking if something was made by your class/constructor."

</details>

### Common Mistakes

❌ **Mistake 1:** Using typeof for arrays
```javascript
const arr = [1, 2, 3];
if (typeof arr === "array") { // ❌ Never true! typeof returns "object"
  // This never runs
}
```

✅ **Correct:** Use Array.isArray()
```javascript
if (Array.isArray(arr)) { // ✅
  // This runs
}
```

❌ **Mistake 2:** Using instanceof for primitives
```javascript
console.log("hello" instanceof String); // false (primitive!)
console.log(42 instanceof Number);      // false
```

✅ **Correct:** Use typeof for primitives
```javascript
console.log(typeof "hello" === "string"); // true ✅
console.log(typeof 42 === "number");      // true ✅
```

❌ **Mistake 3:** Trusting typeof null
```javascript
if (typeof value === "object") {
  value.toString(); // ❌ Crashes if value is null!
}
```

✅ **Correct:** Check for null explicitly
```javascript
if (typeof value === "object" && value !== null) { // ✅
  value.toString();
}
```

❌ **Mistake 4:** Using instanceof across iframes
```javascript
const iframeArray = iframe.contentWindow.Array(1, 2, 3);
if (iframeArray instanceof Array) { // ❌ false (different Array constructor)
  // This never runs
}
```

✅ **Correct:** Use Array.isArray()
```javascript
if (Array.isArray(iframeArray)) { // ✅ true
  // This runs
}
```

### Follow-up Questions

1. "Why does `typeof null` return 'object'?"
2. "How does instanceof work internally (what algorithm)?"
3. "What is the difference between `instanceof` and `isPrototypeOf()`?"
4. "How would you implement a custom type checker?"
5. "What are the limitations of instanceof with iframes?"
6. "Why is Array.isArray() more reliable than instanceof Array?"
7. "How can Symbol.hasInstance customize instanceof behavior?"

### Resources

- [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- [MDN: instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
- [V8 Blog: Fast Properties](https://v8.dev/blog/fast-properties)

---

