# JavaScript Core Concepts

> **Fundamentals every JavaScript developer must know - primitives, types, hoisting, scope, closures, and more**

---

## Question 1: What are primitive and non-primitive data types in JavaScript?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 3-5 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain the difference between primitive and non-primitive (reference) data types in JavaScript. List all primitive types.

### Answer

JavaScript has **7 primitive types** and **1 reference type** (objects).

1. **Primitives are Immutable**
   - Stored directly in the variable
   - Cannot be altered (any operation creates a new value)
   - Compared by value
   - Stored in stack memory

2. **Primitive Types (7)**
   - `string` - Text data ("hello")
   - `number` - Numeric data (42, 3.14)
   - `bigint` - Large integers (9007199254740991n)
   - `boolean` - true/false
   - `undefined` - Variable declared but not assigned
   - `null` - Intentional absence of value
   - `symbol` - Unique identifier (Symbol('id'))

3. **Reference Types are Mutable**
   - Objects, Arrays, Functions, Dates, RegExp, etc.
   - Stored as reference/pointer
   - Compared by reference (memory address)
   - Stored in heap memory

### Code Example

```javascript
// Primitives - stored by value
let a = 10;
let b = a; // Copy of value
b = 20;
console.log(a); // 10 (unchanged)
console.log(b); // 20

// Reference types - stored by reference
let obj1 = { name: "John" };
let obj2 = obj1; // Copy of reference (same object)
obj2.name = "Jane";
console.log(obj1.name); // "Jane" (changed!)
console.log(obj2.name); // "Jane"

// Primitive immutability
let str = "hello";
str[0] = "H"; // Doesn't work (immutable)
console.log(str); // "hello" (unchanged)

// typeof operator
console.log(typeof 42);           // "number"
console.log(typeof "text");       // "string"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (historical bug)
console.log(typeof Symbol('id')); // "symbol"
console.log(typeof 123n);         // "bigint"
console.log(typeof {});           // "object"
console.log(typeof []);           // "object"
console.log(typeof function(){}); // "function"
```

### Common Mistakes

- ❌ **Mistake:** Thinking `typeof null` returns "null"
  ```javascript
  console.log(typeof null); // "object" (not "null"!)
  ```
  - This is a historical bug in JavaScript that can't be fixed without breaking existing code

- ❌ **Mistake:** Assuming arrays have their own type
  ```javascript
  console.log(typeof []); // "object" (not "array")
  // Use Array.isArray() instead
  console.log(Array.isArray([])); // true
  ```

- ✅ **Correct:** Understanding value vs reference
  ```javascript
  // Always be aware of reference vs value semantics
  const original = { count: 0 };
  const copy = { ...original }; // Shallow copy
  copy.count = 1;
  console.log(original.count); // 0 (separate object)
  ```

### Follow-up Questions

- "What is the difference between `null` and `undefined`?"
- "Why does `typeof null` return 'object'?"
- "How would you check if a variable is an array?"
- "What is the difference between shallow and deep copy?"
- "Can you mutate a const object? Why or why not?"

### Resources

- [MDN: JavaScript Data Types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [JavaScript.info: Data Types](https://javascript.info/types)

---

## Question 2: What is the difference between var, let, and const?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Apple

### Question
Explain the differences between `var`, `let`, and `const` in terms of scope, hoisting, and mutability.

### Answer

The three keywords differ in **scope**, **hoisting behavior**, and **reassignment**.

1. **Scope**
   - `var`: Function-scoped (or globally scoped)
   - `let`: Block-scoped
   - `const`: Block-scoped

2. **Hoisting**
   - `var`: Hoisted and initialized with `undefined`
   - `let`: Hoisted but NOT initialized (TDZ - Temporal Dead Zone)
   - `const`: Hoisted but NOT initialized (TDZ)

3. **Reassignment**
   - `var`: Can be reassigned
   - `let`: Can be reassigned
   - `const`: Cannot be reassigned (but objects can be mutated)

4. **Redeclaration**
   - `var`: Can be redeclared in same scope
   - `let`: Cannot be redeclared in same scope
   - `const`: Cannot be redeclared in same scope

### Code Example

```javascript
// 1. SCOPE DIFFERENCE
function scopeTest() {
  if (true) {
    var x = 10;  // Function-scoped
    let y = 20;  // Block-scoped
    const z = 30; // Block-scoped
  }
  console.log(x); // 10 (accessible)
  console.log(y); // ReferenceError: y is not defined
  console.log(z); // ReferenceError: z is not defined
}

// 2. HOISTING DIFFERENCE
console.log(a); // undefined (var is hoisted)
console.log(b); // ReferenceError: Cannot access 'b' before initialization
var a = 5;
let b = 10;

// 3. REASSIGNMENT
var varVar = 1;
varVar = 2; // ✅ OK

let letVar = 1;
letVar = 2; // ✅ OK

const constVar = 1;
constVar = 2; // ❌ TypeError: Assignment to constant variable

// 4. CONST WITH OBJECTS (Mutable)
const obj = { name: "John" };
obj.name = "Jane"; // ✅ OK (mutating object)
obj.age = 30;      // ✅ OK (adding property)
obj = {};          // ❌ TypeError: Assignment to constant variable

const arr = [1, 2, 3];
arr.push(4);       // ✅ OK (mutating array)
arr = [];          // ❌ TypeError: Assignment to constant variable

// 5. REDECLARATION
var x = 1;
var x = 2; // ✅ OK (var allows redeclaration)

let y = 1;
let y = 2; // ❌ SyntaxError: Identifier 'y' has already been declared

// 6. LOOP BEHAVIOR
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (var is function-scoped)

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Output: 0, 1, 2 (let creates new binding each iteration)
```

### Common Mistakes

- ❌ **Mistake:** Using `var` in modern JavaScript
  ```javascript
  // Avoid var - it has confusing scoping rules
  for (var i = 0; i < 3; i++) { /* ... */ }
  console.log(i); // 3 (leaked outside loop!)
  ```

- ❌ **Mistake:** Thinking `const` makes objects immutable
  ```javascript
  const obj = { count: 0 };
  obj.count++; // This works! const prevents reassignment, not mutation
  ```

- ✅ **Correct:** Use `let` for variables that change, `const` for constants
  ```javascript
  const PI = 3.14159; // Never changes
  let counter = 0;    // Will change

  // For objects/arrays that will be mutated, use const
  const users = [];
  users.push({ name: "John" }); // OK
  ```

### Follow-up Questions

- "What is the Temporal Dead Zone (TDZ)?"
- "Why does the var loop problem occur with setTimeout?"
- "How would you make an object truly immutable?"
- "When would you use let vs const?"
- "What happens if you use a variable before declaring it with let?"

### Resources

- [MDN: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [JavaScript.info: Variables](https://javascript.info/variables)

---

## Question 3: What is hoisting in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain what hoisting is in JavaScript and how it affects variable and function declarations.

### Answer

Hoisting is JavaScript's behavior of **moving declarations to the top** of their scope during the compilation phase.

1. **What Gets Hoisted**
   - Variable declarations (`var`, `let`, `const`)
   - Function declarations
   - Class declarations

2. **How Hoisting Works**
   - Only the declaration is hoisted, not the initialization
   - Happens during the creation phase of execution context
   - Code doesn't physically move - it's conceptual

3. **var Hoisting**
   - Hoisted and initialized with `undefined`
   - Can be accessed before declaration (returns `undefined`)

4. **let/const Hoisting**
   - Hoisted but NOT initialized
   - Accessing before declaration causes ReferenceError (TDZ)

5. **Function Hoisting**
   - Function declarations are fully hoisted (declaration + definition)
   - Function expressions are not hoisted

### Code Example

```javascript
// 1. VAR HOISTING
console.log(myVar); // undefined (not ReferenceError!)
var myVar = 5;
console.log(myVar); // 5

// How JavaScript interprets it:
var myVar; // Declaration hoisted
console.log(myVar); // undefined
myVar = 5; // Assignment stays in place

// 2. LET/CONST HOISTING (TDZ)
console.log(myLet); // ReferenceError: Cannot access 'myLet' before initialization
let myLet = 10;

console.log(myConst); // ReferenceError
const myConst = 20;

// 3. FUNCTION DECLARATION HOISTING
sayHello(); // "Hello!" (works!)

function sayHello() {
  console.log("Hello!");
}

// Function declaration is fully hoisted

// 4. FUNCTION EXPRESSION (NOT HOISTED)
sayHi(); // TypeError: sayHi is not a function

var sayHi = function() {
  console.log("Hi!");
};

// Only the var declaration is hoisted, not the function

// 5. CLASS HOISTING (TDZ)
const instance = new MyClass(); // ReferenceError

class MyClass {
  constructor() {
    this.value = 42;
  }
}

// 6. HOISTING IN DIFFERENT SCOPES
function outerFunc() {
  console.log(innerVar); // undefined (hoisted in function scope)
  var innerVar = 100;

  if (true) {
    console.log(blockVar); // ReferenceError (TDZ)
    let blockVar = 200;
  }
}

// 7. HOISTING WITH SAME NAME
console.log(typeof myFunc); // "function" (function hoisted first)

var myFunc = 5;

function myFunc() {
  return "I'm a function";
}

console.log(typeof myFunc); // "number" (variable assignment executed)
```

### Common Mistakes

- ❌ **Mistake:** Relying on hoisting behavior
  ```javascript
  // Bad practice - confusing and error-prone
  x = 5;
  console.log(x);
  var x;
  ```

- ❌ **Mistake:** Thinking let/const are not hoisted
  ```javascript
  // They ARE hoisted, but not initialized (TDZ)
  console.log(x); // ReferenceError (not undefined!)
  let x = 5;
  ```

- ✅ **Correct:** Declare variables at the top
  ```javascript
  // Clear and predictable
  const PI = 3.14159;
  let counter = 0;

  // Use them
  console.log(PI);
  counter++;
  ```

### Follow-up Questions

- "What is the Temporal Dead Zone (TDZ)?"
- "Why does function declaration hoist but function expression doesn't?"
- "What happens when you have a function and variable with the same name?"
- "How does hoisting work with nested functions?"
- "Why was hoisting designed this way?"

### Resources

- [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
- [JavaScript.info: Variable Scope](https://javascript.info/closure)
- [Understanding Hoisting in JavaScript](https://www.freecodecamp.org/news/what-is-hoisting-in-javascript/)

---

## Question 4: What is closure in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Apple, Netflix

### Question
Explain what a closure is in JavaScript. Provide practical examples of when and why you would use closures.

### Answer

A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

1. **Key Concept: Lexical Scoping**
   - Functions are executed using the scope chain that was in effect when they were defined
   - Inner functions have access to outer function variables

2. **Closure Formation**
   - Created when a function is defined inside another function
   - Inner function "closes over" outer function's variables
   - Variables remain accessible even after outer function returns

3. **Common Use Cases**
   - Data privacy (private variables)
   - Factory functions
   - Event handlers
   - Callbacks
   - Partial application and currying
   - Module pattern

4. **Memory Considerations**
   - Closures keep references to outer variables
   - Can lead to memory leaks if not careful
   - Variables aren't garbage collected while closure exists

### Code Example

```javascript
// 1. BASIC CLOSURE EXAMPLE
function createCounter() {
  let count = 0; // Private variable

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
console.log(counter.count);       // undefined (private!)

// 2. CLOSURE IN LOOPS (CLASSIC PROBLEM)
// ❌ Problem with var
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3 (all reference same i)
  }, 1000);
}

// ✅ Solution 1: Use let (creates new binding each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2
  }, 1000);
}

// ✅ Solution 2: Use IIFE to create closure
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // 0, 1, 2
    }, 1000);
  })(i);
}

// 3. DATA PRIVACY
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private

  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        return balance;
      }
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      return "Insufficient funds";
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
console.log(account.deposit(500));   // 1500
console.log(account.withdraw(200));  // 1300
console.log(account.balance);        // undefined (can't access directly!)

// 4. FUNCTION FACTORY
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// 5. EVENT HANDLER WITH CLOSURE
function createButton(label) {
  let clickCount = 0;

  const button = document.createElement('button');
  button.textContent = label;

  button.addEventListener('click', function() {
    clickCount++; // Closure over clickCount
    console.log(`${label} clicked ${clickCount} times`);
  });

  return button;
}

// 6. MODULE PATTERN
const calculator = (function() {
  // Private variables and functions
  let result = 0;

  function log(message) {
    console.log(`[Calculator] ${message}`);
  }

  // Public API
  return {
    add(n) {
      result += n;
      log(`Added ${n}, result: ${result}`);
      return this;
    },
    subtract(n) {
      result -= n;
      log(`Subtracted ${n}, result: ${result}`);
      return this;
    },
    getResult() {
      return result;
    }
  };
})();

calculator.add(10).add(5).subtract(3);
console.log(calculator.getResult()); // 12

// 7. PARTIAL APPLICATION
function multiply(a, b) {
  return a * b;
}

function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const multiplyBy5 = partial(multiply, 5);
console.log(multiplyBy5(4)); // 20
console.log(multiplyBy5(10)); // 50
```

### Common Mistakes

- ❌ **Mistake:** Closure in loop with var
  ```javascript
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
  }
  // Outputs: 3, 3, 3 (all closures reference same i)
  ```

- ❌ **Mistake:** Memory leaks from unused closures
  ```javascript
  function createElement() {
    const hugeData = new Array(1000000).fill('data');

    return function() {
      // hugeData is retained even if never used!
      console.log('Created');
    };
  }
  ```

- ✅ **Correct:** Clear unused references
  ```javascript
  function createElement() {
    let hugeData = new Array(1000000).fill('data');

    // Use the data
    const summary = hugeData.length;

    // Clear reference
    hugeData = null;

    return function() {
      console.log(`Created with ${summary} items`);
    };
  }
  ```

### Follow-up Questions

- "What is the difference between scope and closure?"
- "How do closures relate to memory management?"
- "Can you explain closure in the context of React hooks?"
- "What are the performance implications of using closures?"
- "How would you debug a closure-related memory leak?"

### Resources

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [JavaScript.info: Closure](https://javascript.info/closure)
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures)
- [Understanding Closures](https://www.freecodecamp.org/news/javascript-closures-explained-with-examples/)

---

## Question 5: What is the Temporal Dead Zone (TDZ)?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain the Temporal Dead Zone (TDZ) in JavaScript and how it relates to let and const declarations.

### Answer

The Temporal Dead Zone (TDZ) is the period between entering a scope and the variable being declared during which the variable cannot be accessed.

1. **What is TDZ**
   - Time from start of scope until variable declaration
   - Applies to `let`, `const`, and `class` declarations
   - Accessing variable in TDZ throws ReferenceError

2. **Why TDZ Exists**
   - Catch errors earlier (accessing uninitialized variables)
   - Make `const` behavior more consistent
   - Avoid confusing behavior of `var`

3. **How It Works**
   - Variables are hoisted but not initialized
   - Remain in TDZ until declaration line is executed
   - After declaration, variables become accessible

4. **Does NOT Apply To**
   - `var` declarations (initialized with `undefined`)
   - Function declarations (fully hoisted)
   - Function parameters

### Code Example

```javascript
// 1. BASIC TDZ EXAMPLE
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// Timeline:
// [ START OF SCOPE ]
// |-- TDZ starts
// |-- console.log(x) <- ReferenceError!
// |-- TDZ ends
// let x = 5;
// |-- Variable is now accessible

// 2. VAR HAS NO TDZ
console.log(y); // undefined (no TDZ)
var y = 10;

// 3. TDZ IN BLOCK SCOPE
{
  // TDZ starts
  console.log(a); // ReferenceError
  console.log(b); // ReferenceError

  let a = 1;
  // a's TDZ ends

  const b = 2;
  // b's TDZ ends

  console.log(a); // 1 (OK)
  console.log(b); // 2 (OK)
}

// 4. TYPEOF IN TDZ
console.log(typeof undeclaredVar); // "undefined" (OK)
console.log(typeof x); // ReferenceError! (x is in TDZ)
let x = 5;

// 5. FUNCTION PARAMETERS AND TDZ
function example(a = b, b = 2) {
  return [a, b];
}

example(); // ReferenceError: Cannot access 'b' before initialization
// b is in TDZ when a tries to use it

// Correct order:
function example2(a = 2, b = a) {
  return [a, b];
}

example2(); // [2, 2] (OK - a is initialized before b uses it)

// 6. TDZ IN NESTED SCOPES
let x = 'outer';

function test() {
  // TDZ starts for inner x
  console.log(x); // ReferenceError (looking for inner x, which is in TDZ)
  let x = 'inner';
  // TDZ ends
}

test();

// 7. CLASS AND TDZ
const instance = new MyClass(); // ReferenceError
class MyClass {}

// 8. TDZ WITH DESTRUCTURING
const { prop } = obj; // ReferenceError if obj is in TDZ
let obj = { prop: 'value' };

// 9. TEMPORAL ASPECT OF TDZ
function logValue() {
  console.log(value); // ReferenceError
}

let value = 42;

// logValue(); // Would throw error even though declaration is "before" call
// because execution happens before declaration during call

// 10. TDZ IN SWITCH STATEMENTS
switch (true) {
  case true:
    console.log(x); // ReferenceError
    let x = 1;
    break;
}
```

### Common Mistakes

- ❌ **Mistake:** Thinking let/const are not hoisted
  ```javascript
  {
    // x IS hoisted, but in TDZ
    console.log(x); // ReferenceError (not undefined!)
    let x = 5;
  }
  ```

- ❌ **Mistake:** Using typeof to check TDZ variables
  ```javascript
  console.log(typeof x); // ReferenceError!
  let x = 5;

  // typeof with undeclared variables is OK:
  console.log(typeof completelyUndeclared); // "undefined"
  ```

- ✅ **Correct:** Declare variables at the top of scope
  ```javascript
  function example() {
    // Declare all variables at top
    let x = 1;
    let y = 2;
    const z = 3;

    // Use them
    console.log(x, y, z); // No TDZ issues
  }
  ```

### Follow-up Questions

- "Why does `var` not have a TDZ?"
- "How does TDZ help prevent bugs?"
- "What happens if you try to use typeof on a TDZ variable?"
- "How does TDZ work with default parameters?"
- "Can you explain the difference between hoisting and TDZ?"

### Resources

- [MDN: Temporal Dead Zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz)
- [JavaScript.info: Variables](https://javascript.info/variables)
- [Understanding the Temporal Dead Zone](https://www.freecodecamp.org/news/what-is-the-temporal-dead-zone/)

---

## Question 6: What are lexical scope and block scope?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Microsoft

### Question
Explain lexical scope and block scope in JavaScript. How do they differ?

### Answer

Lexical scope means that a function's scope is determined by where it is defined in the code, not where it is called. Block scope means variables are only accessible within the block (curly braces) they're defined in.

1. **Lexical Scope (Static Scope)**
   - Determined at write-time (when code is written)
   - Functions carry their scope with them
   - Inner functions can access outer function variables
   - Enables closures

2. **Block Scope**
   - Variables scoped to nearest enclosing block `{}`
   - Introduced with ES6 (`let`, `const`)
   - More predictable than function scope
   - Prevents variable leakage

3. **Function Scope** (for comparison)
   - Variables scoped to entire function
   - Only `var` is function-scoped
   - `let` and `const` are block-scoped

### Code Example

```javascript
// 1. LEXICAL SCOPE EXAMPLE
const globalVar = 'global';

function outer() {
  const outerVar = 'outer';

  function inner() {
    const innerVar = 'inner';

    // inner() can access:
    console.log(innerVar);  // 'inner' (own scope)
    console.log(outerVar);  // 'outer' (lexical parent)
    console.log(globalVar); // 'global' (lexical grandparent)
  }

  inner();
  // console.log(innerVar); // ReferenceError (not accessible here)
}

outer();

// 2. BLOCK SCOPE WITH LET/CONST
{
  let blockScoped = 'I am block scoped';
  const alsoBlockScoped = 'Me too';
  var functionScoped = 'I am function scoped';
}

console.log(functionScoped);  // 'I am function scoped' (accessible!)
// console.log(blockScoped);  // ReferenceError
// console.log(alsoBlockScoped); // ReferenceError

// 3. BLOCK SCOPE IN IF STATEMENTS
if (true) {
  let x = 10;
  const y = 20;
  var z = 30;
}

// console.log(x); // ReferenceError
// console.log(y); // ReferenceError
console.log(z);    // 30 (var leaks out!)

// 4. BLOCK SCOPE IN LOOPS
for (let i = 0; i < 3; i++) {
  // New i binding for each iteration
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2

for (var j = 0; j < 3; j++) {
  // Same j shared across iterations
  setTimeout(() => console.log(j), 100);
}
// Output: 3, 3, 3

// 5. LEXICAL SCOPE IN CLOSURES
function createCounter(start) {
  let count = start; // Lexically scoped to createCounter

  return function() {
    count++; // Closure: accesses parent's lexical scope
    return count;
  };
}

const counter1 = createCounter(0);
const counter2 = createCounter(10);

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 11 (separate lexical scope)

// 6. NESTED BLOCKS
{
  let x = 1;

  {
    let x = 2; // Different variable (shadowing)
    console.log(x); // 2

    {
      let x = 3; // Another different variable
      console.log(x); // 3
    }

    console.log(x); // 2
  }

  console.log(x); // 1
}

// 7. SWITCH STATEMENTS (NO BLOCK SCOPE!)
switch (1) {
  case 1:
    let x = 'case 1';
    break;
  case 2:
    let x = 'case 2'; // SyntaxError: Identifier 'x' has already been declared
    break;
}

// Fix: Add blocks
switch (1) {
  case 1: {
    let x = 'case 1';
    break;
  }
  case 2: {
    let x = 'case 2'; // OK now
    break;
  }
}

// 8. LEXICAL SCOPE WITH ARROW FUNCTIONS
function Timer() {
  this.seconds = 0;

  setInterval(() => {
    this.seconds++; // Arrow function uses lexical 'this'
    console.log(this.seconds);
  }, 1000);
}

new Timer();

// 9. TRY-CATCH BLOCKS
try {
  let x = 1;
  throw new Error('test');
} catch (err) {
  let x = 2; // Different variable (block-scoped to catch)
  console.log(x); // 2
}

// console.log(x); // ReferenceError (neither x is accessible)
```

### Common Mistakes

- ❌ **Mistake:** Expecting var to be block-scoped
  ```javascript
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (var is NOT block-scoped!)
  ```

- ❌ **Mistake:** Confusing lexical scope with dynamic scope
  ```javascript
  const x = 'global';

  function func() {
    console.log(x); // Always 'global' (lexical)
    // NOT affected by where func is called
  }

  function test() {
    const x = 'local';
    func(); // Still logs 'global'
  }
  ```

- ✅ **Correct:** Use let/const for block scope
  ```javascript
  if (true) {
    let x = 10;    // Block-scoped
    const y = 20;  // Block-scoped
  }
  // x and y are not accessible here
  ```

### Follow-up Questions

- "What is the difference between lexical and dynamic scope?"
- "How does lexical scope enable closures?"
- "Why is block scope better than function scope?"
- "What is variable shadowing?"
- "How does 'this' relate to lexical scope?"

### Resources

- [MDN: Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope)
- [JavaScript.info: Variable Scope](https://javascript.info/closure)
- [Understanding Scope in JavaScript](https://www.freecodecamp.org/news/javascript-lexical-scope-tutorial/)

---

## Question 7: What is variable shadowing and illegal shadowing?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta

### Question
Explain variable shadowing and illegal shadowing in JavaScript. When does shadowing cause errors?

### Answer

**Variable shadowing** occurs when a variable declared in an inner scope has the same name as a variable in an outer scope, effectively "hiding" the outer variable.

**Illegal shadowing** happens when you try to shadow a `let` or `const` variable with a `var` declaration in the same scope, which is not allowed.

1. **Legal Shadowing**
   - let/const can shadow let/const
   - let/const can shadow var
   - var can shadow var in different function scopes

2. **Illegal Shadowing**
   - var cannot shadow let/const in the same scope
   - Results in SyntaxError

3. **Why It Matters**
   - Prevents accidental global pollution
   - Helps catch scoping errors
   - Maintains block scope integrity

### Code Example

```javascript
// 1. LEGAL SHADOWING - let shadows let
let x = 10;

{
  let x = 20; // Different variable (shadowing)
  console.log(x); // 20
}

console.log(x); // 10 (outer x unchanged)

// 2. LEGAL SHADOWING - let shadows var
var y = 10;

{
  let y = 20; // Legal shadowing
  console.log(y); // 20
}

console.log(y); // 10

// 3. LEGAL SHADOWING - var shadows var (function scope)
var z = 10;

function test() {
  var z = 20; // Legal (different function scope)
  console.log(z); // 20
}

test();
console.log(z); // 10

// 4. ILLEGAL SHADOWING - var shadows let/const
let a = 10;

{
  var a = 20; // SyntaxError: Identifier 'a' has already been declared
}

// 5. ILLEGAL SHADOWING - var shadows const
const b = 10;

{
  var b = 20; // SyntaxError: Identifier 'b' has already been declared
}

// 6. WHY ILLEGAL SHADOWING EXISTS
// let/const are block-scoped
// var is function-scoped
// var would "leak" into outer scope, conflicting with let/const

{
  let c = 10; // Block-scoped to this block
  {
    var c = 20; // Would leak to outer block! Not allowed
  }
}

// 7. NESTED FUNCTION SHADOWING (LEGAL)
let outer = 'outer';

function first() {
  let outer = 'first'; // Shadows global

  function second() {
    let outer = 'second'; // Shadows first()
    console.log(outer); // 'second'
  }

  second();
  console.log(outer); // 'first'
}

first();
console.log(outer); // 'outer'

// 8. PARAMETER SHADOWING
let value = 100;

function compute(value) { // Parameter shadows outer value
  console.log(value); // Uses parameter, not outer variable
}

compute(50); // 50
console.log(value); // 100 (unchanged)
```

### Common Mistakes

- ❌ **Mistake:** Trying to use var in block with let/const
  ```javascript
  let x = 1;
  {
    var x = 2; // SyntaxError!
  }
  ```

- ❌ **Mistake:** Unintentional shadowing causing confusion
  ```javascript
  let count = 0;

  function processItems(items) {
    let count = items.length; // Shadows outer count
    // Now can't access outer count
  }
  ```

- ✅ **Correct:** Use different variable names when shadowing is not needed
  ```javascript
  let globalCount = 0;

  function processItems(items) {
    let itemCount = items.length; // Clear distinction
    globalCount += itemCount;
  }
  ```

### Follow-up Questions

- "Why is var shadowing let/const illegal?"
- "How does shadowing relate to closures?"
- "What happens with shadowing in nested functions?"
- "Can function parameters shadow outer variables?"

### Resources

- [MDN: Variable Shadowing](https://developer.mozilla.org/en-US/docs/Glossary/Scope#shadowing)
- [JavaScript.info: Variable Scope](https://javascript.info/closure)

---

## Question 8: What are higher-order functions in JavaScript?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Apple

### Question
What are higher-order functions? Provide examples of built-in higher-order functions and explain how to create custom ones.

### Answer

A **higher-order function** is a function that either:
1. Takes one or more functions as arguments, OR
2. Returns a function as its result

Higher-order functions are a fundamental concept in functional programming and are widely used in JavaScript.

1. **Why Higher-Order Functions**
   - Code reusability
   - Abstraction
   - Function composition
   - More declarative code

2. **Built-in Higher-Order Functions**
   - Array methods: `map()`, `filter()`, `reduce()`, `forEach()`, `find()`, `some()`, `every()`
   - `setTimeout()`, `setInterval()`
   - Event listeners

3. **Benefits**
   - Separate concerns (what vs how)
   - Easier to test
   - More maintainable
   - Enables functional programming patterns

### Code Example

```javascript
// 1. FUNCTIONS THAT TAKE FUNCTIONS AS ARGUMENTS

// Array.map() - transforms array
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(num) {
  return num * 2;
});
console.log(doubled); // [2, 4, 6, 8, 10]

// Array.filter() - filters array
const evens = numbers.filter(function(num) {
  return num % 2 === 0;
});
console.log(evens); // [2, 4]

// Array.reduce() - reduces to single value
const sum = numbers.reduce(function(acc, num) {
  return acc + num;
}, 0);
console.log(sum); // 15

// 2. FUNCTIONS THAT RETURN FUNCTIONS

// Function factory
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// 3. CUSTOM HIGHER-ORDER FUNCTION

// Custom forEach implementation
function customForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}

customForEach([1, 2, 3], function(item, index) {
  console.log(`Index ${index}: ${item}`);
});

// 4. FUNCTION COMPOSITION

function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;

const addOneThenDouble = compose(multiplyByTwo, addOne);
console.log(addOneThenDouble(5)); // 12 (5 + 1 = 6, 6 * 2 = 12)

// 5. PRACTICAL EXAMPLE - LOGGER WRAPPER

function withLogging(fn) {
  return function(...args) {
    console.log(`Calling with args:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

const add = (a, b) => a + b;
const addWithLogging = withLogging(add);

addWithLogging(3, 4);
// Calling with args: [3, 4]
// Result: 7
// Returns: 7

// 6. CURRYING (HIGHER-ORDER PATTERN)

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
}

const sum3 = (a, b, c) => a + b + c;
const curriedSum = curry(sum3);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6

// 7. PRACTICAL - RETRY LOGIC

function retry(fn, maxAttempts) {
  return async function(...args) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        console.log(`Attempt ${attempt} failed, retrying...`);
      }
    }
  };
}

const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const fetchWithRetry = retry(fetchData, 3);

// 8. MEMOIZATION (HIGHER-ORDER PATTERN)

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('Returning cached result');
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveOperation = (n) => {
  console.log('Computing...');
  return n * n;
};

const memoized = memoize(expensiveOperation);

console.log(memoized(5)); // Computing... 25
console.log(memoized(5)); // Returning cached result 25
```

### Common Mistakes

- ❌ **Mistake:** Not returning value from callback
  ```javascript
  const numbers = [1, 2, 3];
  const doubled = numbers.map(num => {
    num * 2; // Missing return!
  });
  console.log(doubled); // [undefined, undefined, undefined]
  ```

- ❌ **Mistake:** Breaking closure scope
  ```javascript
  function createFunctions() {
    const funcs = [];
    for (var i = 0; i < 3; i++) {
      funcs.push(function() { return i; }); // All reference same i
    }
    return funcs;
  }

  const functions = createFunctions();
  console.log(functions[0]()); // 3 (not 0!)
  ```

- ✅ **Correct:** Use arrow functions and proper closures
  ```javascript
  const numbers = [1, 2, 3];
  const doubled = numbers.map(num => num * 2); // Implicit return
  console.log(doubled); // [2, 4, 6]
  ```

### Follow-up Questions

- "What is the difference between map() and forEach()?"
- "How does reduce() work internally?"
- "What is function currying?"
- "Explain the concept of function composition"
- "How do higher-order functions help with code reusability?"

### Resources

- [MDN: Higher-Order Functions](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)
- [JavaScript.info: Function Object](https://javascript.info/function-object)
- [Eloquent JavaScript: Higher-Order Functions](https://eloquentjavascript.net/05_higher_order.html)

---

## Question 9: What is a pure function?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Airbnb

### Question
Explain what a pure function is in JavaScript. Why are pure functions important and how do they differ from impure functions?

### Answer

A **pure function** is a function that:
1. Always returns the same output for the same input (deterministic)
2. Has no side effects (doesn't modify external state)

Pure functions are a key concept in functional programming.

1. **Characteristics of Pure Functions**
   - Deterministic (same input = same output)
   - No side effects
   - No external dependencies
   - Easier to test
   - Predictable behavior

2. **Side Effects (What Pure Functions Avoid)**
   - Modifying global variables
   - Modifying input parameters
   - Making HTTP requests
   - Writing to database
   - Logging to console
   - Modifying DOM
   - Getting current time

3. **Benefits of Pure Functions**
   - Easier to test (no mocking needed)
   - Easier to debug
   - Cacheable (memoization)
   - Parallelizable
   - Easier to reason about

### Code Example

```javascript
// 1. PURE FUNCTIONS - Same input = Same output, No side effects

// Pure: Simple calculation
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // Always 5
console.log(add(2, 3)); // Always 5

// Pure: Array transformation (doesn't modify input)
function double(numbers) {
  return numbers.map(n => n * 2);
}

const nums = [1, 2, 3];
console.log(double(nums)); // [2, 4, 6]
console.log(nums); // [1, 2, 3] (unchanged)

// Pure: String manipulation
function capitalize(str) {
  return str.toUpperCase();
}

// 2. IMPURE FUNCTIONS - Side effects or non-deterministic

// Impure: Modifies external state
let counter = 0;

function incrementCounter() {
  counter++; // Side effect: modifying global variable
  return counter;
}

console.log(incrementCounter()); // 1
console.log(incrementCounter()); // 2 (different output!)

// Impure: Non-deterministic (depends on external state)
function getCurrentTime() {
  return new Date().getTime(); // Different each call
}

// Impure: Modifies input parameter
function addToArray(arr, item) {
  arr.push(item); // Mutates input!
  return arr;
}

// Impure: Console logging
function calculateAndLog(a, b) {
  const result = a + b;
  console.log(result); // Side effect: I/O
  return result;
}

// 3. CONVERTING IMPURE TO PURE

// Impure version
let total = 0;

function addToTotal(value) {
  total += value; // Modifies external state
  return total;
}

// Pure version
function addToValue(currentTotal, value) {
  return currentTotal + value; // Returns new value, doesn't modify
}

let total2 = 0;
total2 = addToValue(total2, 5); // 5
total2 = addToValue(total2, 10); // 15

// 4. PURE ARRAY OPERATIONS

// Pure: map, filter, reduce
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2); // Pure: returns new array
const evens = numbers.filter(n => n % 2 === 0); // Pure
const sum = numbers.reduce((acc, n) => acc + n, 0); // Pure

console.log(numbers); // [1, 2, 3, 4, 5] (unchanged)

// Impure: push, pop, splice (modify original)
const arr = [1, 2, 3];
arr.push(4); // Impure: modifies arr

// 5. PURE OBJECT OPERATIONS

// Impure: mutates object
function updateUserAge(user, age) {
  user.age = age; // Mutates input!
  return user;
}

// Pure: returns new object
function setUserAge(user, age) {
  return { ...user, age }; // New object
}

const user = { name: 'John', age: 25 };
const updated = setUserAge(user, 26);

console.log(user.age); // 25 (unchanged)
console.log(updated.age); // 26

// 6. TESTING PURE VS IMPURE

// Pure function: Easy to test
function calculateDiscount(price, discountPercent) {
  return price * (1 - discountPercent / 100);
}

// Test (no setup needed)
console.assert(calculateDiscount(100, 10) === 90);
console.assert(calculateDiscount(100, 10) === 90); // Always same result

// Impure function: Harder to test
let tax = 0.1;

function calculateTotal(price) {
  return price * (1 + tax); // Depends on external variable
}

// Test (need to control external state)
tax = 0.1;
console.assert(calculateTotal(100) === 110); // Fragile!

// 7. MEMOIZATION WITH PURE FUNCTIONS

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Only works reliably with pure functions
const fibonacci = memoize(function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

// 8. PURE FUNCTIONS IN REACT

// Pure component (same props = same output)
function UserCard({ name, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

// Impure (uses external state)
let theme = 'dark';

function UserCardImpure({ name, age }) {
  return (
    <div className={theme}> {/* Depends on external state */}
      <h2>{name}</h2>
    </div>
  );
}
```

### Common Mistakes

- ❌ **Mistake:** Mutating input parameters
  ```javascript
  function addItem(arr, item) {
    arr.push(item); // Impure: mutates input!
    return arr;
  }
  ```

- ❌ **Mistake:** Depending on external state
  ```javascript
  let multiplier = 2;

  function multiply(n) {
    return n * multiplier; // Impure: depends on external variable
  }
  ```

- ✅ **Correct:** Return new values, don't mutate
  ```javascript
  function addItem(arr, item) {
    return [...arr, item]; // Pure: returns new array
  }

  function multiply(n, multiplier) {
    return n * multiplier; // Pure: all inputs are parameters
  }
  ```

### Follow-up Questions

- "What are side effects in JavaScript?"
- "How do pure functions relate to Redux reducers?"
- "Can async functions be pure?"
- "What is referential transparency?"
- "How do pure functions help with testing?"

### Resources

- [MDN: Pure Functions](https://developer.mozilla.org/en-US/docs/Glossary/Pure_function)
- [JavaScript.info: Function Purity](https://javascript.info/function-basics)
- [Understanding Pure Functions](https://www.freecodecamp.org/news/what-is-a-pure-function-in-javascript-acb887375dfe/)

---

## Question 10: What is memoization? Implement a custom memoize() function.

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Time:** 10-15 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Airbnb

### Question
Explain memoization in JavaScript. Implement a custom `memoize()` function that caches function results.

### Answer

**Memoization** is an optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again.

1. **How Memoization Works**
   - Store function results in a cache (usually Map or object)
   - On function call, check if result exists in cache
   - If cached, return cached result (fast)
   - If not cached, compute result, store in cache, return

2. **When to Use Memoization**
   - Expensive computations (factorial, fibonacci)
   - Recursive functions
   - API calls with same parameters
   - Pure functions only (same input = same output)

3. **Benefits**
   - Improved performance (avoid redundant calculations)
   - Reduced API calls
   - Better user experience (faster responses)

4. **Trade-offs**
   - Memory usage (cache stores results)
   - Only works with pure functions
   - Cache invalidation can be complex

### Code Example

```javascript
// 1. BASIC MEMOIZATION IMPLEMENTATION

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('Cache hit!');
      return cache.get(key);
    }

    console.log('Computing...');
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Test basic memoization
function expensiveSum(a, b) {
  // Simulate expensive operation
  for (let i = 0; i < 1000000000; i++) {}
  return a + b;
}

const memoizedSum = memoize(expensiveSum);

console.time('First call');
console.log(memoizedSum(5, 10)); // Computing... 15
console.timeEnd('First call'); // ~1000ms

console.time('Second call');
console.log(memoizedSum(5, 10)); // Cache hit! 15
console.timeEnd('Second call'); // ~0ms

// 2. MEMOIZED FIBONACCI (CLASSIC EXAMPLE)

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.time('Fib without memoization');
console.log(fibonacci(40)); // Very slow!
console.timeEnd('Fib without memoization'); // ~1000ms+

console.time('Fib with memoization');
console.log(memoizedFib(40)); // Much faster!
console.timeEnd('Fib with memoization'); // ~10ms

// 3. ADVANCED MEMOIZATION - WITH CUSTOM KEY FUNCTION

function memoizeWithKeyFn(fn, keyFn) {
  const cache = new Map();

  return function(...args) {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Custom key function for objects
const getUser = ({ id }) => {
  console.log(`Fetching user ${id}...`);
  return { id, name: `User ${id}`, email: `user${id}@example.com` };
};

const memoizedGetUser = memoizeWithKeyFn(
  getUser,
  (user) => user.id // Custom key: just use id
);

console.log(memoizedGetUser({ id: 1 })); // Fetching user 1...
console.log(memoizedGetUser({ id: 1 })); // (cached, no log)

// 4. MEMOIZATION WITH CACHE SIZE LIMIT (LRU)

function memoizeWithLimit(fn, limit = 100) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // Move to end (most recently used)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn.apply(this, args);

    // Remove oldest if limit reached
    if (cache.size >= limit) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

// 5. MEMOIZATION WITH EXPIRATION (TTL)

function memoizeWithTTL(fn, ttl = 5000) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log('Cache hit (not expired)');
      return cached.value;
    }

    console.log('Computing or cache expired...');
    const result = fn.apply(this, args);

    cache.set(key, {
      value: result,
      timestamp: Date.now()
    });

    return result;
  };
}

// Test TTL memoization
function getCurrentData(id) {
  return { id, timestamp: Date.now() };
}

const memoizedData = memoizeWithTTL(getCurrentData, 2000); // 2s TTL

console.log(memoizedData(1)); // Computing...
setTimeout(() => {
  console.log(memoizedData(1)); // Cache hit (not expired)
}, 1000);

setTimeout(() => {
  console.log(memoizedData(1)); // Computing or cache expired...
}, 3000);

// 6. MEMOIZATION CLASS-BASED

class Memoizer {
  constructor(fn) {
    this.fn = fn;
    this.cache = new Map();
  }

  call(...args) {
    const key = JSON.stringify(args);

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result = this.fn(...args);
    this.cache.set(key, result);
    return result;
  }

  clear() {
    this.cache.clear();
  }

  has(...args) {
    return this.cache.has(JSON.stringify(args));
  }

  delete(...args) {
    this.cache.delete(JSON.stringify(args));
  }
}

const sumMemoizer = new Memoizer((a, b) => a + b);
console.log(sumMemoizer.call(5, 10)); // 15
console.log(sumMemoizer.has(5, 10)); // true
sumMemoizer.clear();
console.log(sumMemoizer.has(5, 10)); // false

// 7. REACT USEMEMO HOOK PATTERN

// Simulated React useMemo behavior
function useMemo(factory, deps) {
  const cache = useMemo.cache || (useMemo.cache = new Map());
  const key = JSON.stringify(deps);

  if (cache.has(key)) {
    return cache.get(key);
  }

  const value = factory();
  cache.set(key, value);
  return value;
}

// Usage
function ExpensiveComponent({ items }) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a - b),
    [items]
  );

  return sortedItems;
}

// 8. PRACTICAL - API CALL MEMOIZATION

async function fetchUser(userId) {
  console.log(`Fetching user ${userId} from API...`);
  const response = await fetch(`https://api.example.com/users/${userId}`);
  return response.json();
}

const memoizedFetchUser = memoizeWithTTL(fetchUser, 60000); // 1 min cache

// First call: hits API
await memoizedFetchUser(123);

// Second call within 1 min: returns cached result
await memoizedFetchUser(123);

// 9. DEBUGGING MEMOIZED FUNCTIONS

function memoizeWithStats(fn) {
  const cache = new Map();
  const stats = { hits: 0, misses: 0 };

  const memoized = function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      stats.hits++;
      return cache.get(key);
    }

    stats.misses++;
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.stats = () => ({ ...stats });
  memoized.clear = () => cache.clear();

  return memoized;
}

const computeWithStats = memoizeWithStats((n) => n * n);

computeWithStats(5);
computeWithStats(5);
computeWithStats(10);

console.log(computeWithStats.stats()); // { hits: 1, misses: 2 }
```

### Common Mistakes

- ❌ **Mistake:** Memoizing impure functions
  ```javascript
  // Won't work correctly - result depends on external state
  let multiplier = 2;

  const compute = memoize((n) => n * multiplier);

  console.log(compute(5)); // 10
  multiplier = 3;
  console.log(compute(5)); // 10 (cached, but should be 15!)
  ```

- ❌ **Mistake:** Memory leaks from unbounded cache
  ```javascript
  const memoized = memoize(expensiveFunction);

  // Cache grows infinitely!
  for (let i = 0; i < 1000000; i++) {
    memoized(i);
  }
  ```

- ✅ **Correct:** Use memoization with pure functions and cache limits
  ```javascript
  const memoized = memoizeWithLimit(pureFn, 100);
  ```

### Follow-up Questions

- "When should you NOT use memoization?"
- "How does memoization relate to dynamic programming?"
- "What is the difference between memoization and caching?"
- "How would you implement WeakMap-based memoization?"
- "How does React's useMemo hook work?"

### Resources

- [MDN: Memoization](https://developer.mozilla.org/en-US/docs/Glossary/Memoization)
- [JavaScript.info: Decorators and Forwarding](https://javascript.info/call-apply-decorators)
- [Understanding Memoization](https://www.freecodecamp.org/news/memoization-in-javascript-and-react/)

---

## Question 11: What is the difference between == and ===?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Netflix

### Question
Explain the difference between loose equality (==) and strict equality (===). When should you use each?

### Answer

- **`==`** (Loose/Abstract Equality): Performs type coercion before comparison
- **`===`** (Strict Equality): No type coercion, checks both type and value

1. **How == Works**
   - If types are different, JavaScript converts them to the same type
   - Follows complex coercion rules
   - Can lead to unexpected behavior
   - Special case: `null == undefined` returns `true`

2. **How === Works**
   - If types are different, immediately returns `false`
   - No type conversion
   - More predictable and explicit
   - Recommended for most comparisons

3. **Coercion Rules for ==**
   - String to number: `"5" == 5` → `true`
   - Boolean to number: `true == 1` → `true`
   - Object to primitive: `[5] == 5` → `true`
   - `null == undefined` → `true` (special case)

4. **When to Use Each**
   - Use `===` almost always (best practice)
   - Use `==` only when intentionally checking for `null` or `undefined`
   - Most style guides enforce `===`

5. **Best Practices**
   - Default to `===` for clarity and safety
   - Avoid relying on coercion
   - Explicitly convert types when needed
   - Use linters to enforce `===`

### Code Example

```javascript
// 1. BASIC COMPARISONS

// === (Strict Equality)
console.log(5 === 5);           // true (same type, same value)
console.log(5 === "5");         // false (different types)
console.log(true === 1);        // false (different types)
console.log(null === undefined); // false (different types)

// == (Loose Equality)
console.log(5 == 5);            // true
console.log(5 == "5");          // true (string coerced to number)
console.log(true == 1);         // true (boolean coerced to number)
console.log(null == undefined);  // true (special case)

// 2. TYPE COERCION EXAMPLES

// String to number
console.log("10" == 10);        // true
console.log("10" === 10);       // false

// Boolean to number
console.log(true == 1);         // true (true → 1)
console.log(false == 0);        // true (false → 0)
console.log(true === 1);        // false

// Empty string to number
console.log("" == 0);           // true ("" → 0)
console.log("" === 0);          // false

// Null and undefined
console.log(null == undefined); // true (special case)
console.log(null === undefined); // false
console.log(null == 0);         // false
console.log(undefined == 0);    // false

// 3. ARRAY AND OBJECT COMPARISONS

// Arrays to primitives
console.log([1] == 1);          // true ([1] → "1" → 1)
console.log([1] === 1);         // false

console.log([] == 0);           // true ([] → "" → 0)
console.log([] === 0);          // false

console.log([""] == 0);         // true ([""] → "" → 0)

// Objects
console.log({} == {});          // false (different references)
console.log({} === {});         // false

// 4. TRICKY CASES

console.log(false == "");       // true (both → 0)
console.log(false == "0");      // true (both → 0)
console.log("" == "0");         // false (string comparison)

console.log(0 == "");           // true
console.log(0 == "0");          // true

// The infamous case
console.log([] == ![]);         // true!
/*
Explanation:
1. ![] → false (empty array is truthy)
2. [] == false
3. [] → "" (ToPrimitive)
4. "" == false
5. "" → 0, false → 0
6. 0 == 0 → true
*/

// 5. NaN COMPARISON (SPECIAL CASE)

console.log(NaN == NaN);        // false
console.log(NaN === NaN);       // false
console.log(Object.is(NaN, NaN)); // true (use Object.is for NaN)

// Check for NaN
console.log(Number.isNaN(NaN)); // true (correct way)
console.log(isNaN("hello"));    // true (converts to number first!)
console.log(Number.isNaN("hello")); // false (doesn't convert)

// 6. +0 AND -0

console.log(+0 == -0);          // true
console.log(+0 === -0);         // true
console.log(Object.is(+0, -0)); // false

// 7. PRACTICAL - NULL/UNDEFINED CHECK

// ❌ Bad: Checking both separately
if (value === null || value === undefined) {
  console.log("Value is nullish");
}

// ✅ Good: Using == for null check (rare acceptable use)
if (value == null) {
  // true if value is null OR undefined
  console.log("Value is nullish");
}

// ✅ Better: Modern nullish check
if (value ?? false) {
  console.log("Value is not null/undefined");
}

// 8. PRACTICAL - USER INPUT VALIDATION

function validateAge(age) {
  // User input might be string or number

  // ❌ Bad: Using ==
  if (age == 18) {
    return true; // Would match "18" too
  }

  // ✅ Good: Explicit conversion + ===
  if (Number(age) === 18) {
    return true;
  }

  // ✅ Better: Type check first
  if (typeof age === 'number' && age === 18) {
    return true;
  }
}

// 9. COMPARISON ALGORITHM

// === Algorithm:
// 1. If types differ → false
// 2. If both undefined → true
// 3. If both null → true
// 4. If both numbers and same value → true
// 5. If both strings and same characters → true
// 6. If both booleans and same → true
// 7. If both reference same object → true
// 8. Otherwise → false

// == Algorithm (simplified):
// 1. If same type → compare like ===
// 2. If null/undefined → true
// 3. If number/string → convert string to number
// 4. If boolean → convert boolean to number
// 5. If object/primitive → convert object to primitive
// 6. Otherwise → false
```

### Common Mistakes

- ❌ **Mistake:** Using == carelessly
  ```javascript
  const input = "0";

  if (input == false) { // true! (unexpected)
    console.log("Empty");
  }
  ```

- ❌ **Mistake:** Thinking == is "more flexible"
  ```javascript
  function isEqual(a, b) {
    return a == b; // Dangerous! Hidden coercion
  }

  console.log(isEqual("1", 1));    // true
  console.log(isEqual(true, 1));   // true
  console.log(isEqual([], ""));    // true (unexpected!)
  ```

- ✅ **Correct:** Use === by default
  ```javascript
  if (input === "") {
    console.log("Empty");
  }

  // Explicit conversion when needed
  if (Number(input) === 0) {
    console.log("Zero");
  }
  ```

### Follow-up Questions

- "What are the coercion rules for the == operator?"
- "Why does `[] == ![]` return true?"
- "When is it acceptable to use ==?"
- "What is Object.is() and how is it different?"
- "How does != differ from !==?"

### Resources

- [MDN: Equality Comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [JavaScript Equality Table](https://dorey.github.io/JavaScript-Equality-Table/)
- [Understanding == vs ===](https://www.freecodecamp.org/news/loose-vs-strict-equality-in-javascript/)

---

## Question 12: What is the difference between null and undefined?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain the difference between `null` and `undefined` in JavaScript. When would you use each?

### Answer

Both represent absence of value, but with different meanings:
- **`undefined`**: Variable declared but not assigned, or missing property
- **`null`**: Intentional absence of value (explicit)

1. **undefined Characteristics**
   - Default value for uninitialized variables
   - Default return value for functions
   - Missing object properties
   - Type: `undefined`
   - Represents "not yet defined"

2. **null Characteristics**
   - Must be explicitly assigned
   - Represents intentional absence
   - Type: `object` (historical bug)
   - Represents "intentionally empty"

3. **When Variables Become undefined**
   - Declared but not initialized
   - Function parameters not passed
   - Accessing non-existent object properties
   - Function without return statement

4. **When to Use null**
   - Explicitly clear a value
   - Indicate "no object" (API returns)
   - Reset object references
   - Intentionally empty state

5. **Checking for null/undefined**
   - Use `== null` to check both
   - Use `=== null` or `=== undefined` for specific check
   - Use nullish coalescing (`??`) for default values
   - Use optional chaining (`?.`) for safe access

### Code Example

```javascript
// 1. UNDEFINED - UNINITIALIZED VARIABLES

let x;
console.log(x);        // undefined
console.log(typeof x); // "undefined"

var y;
console.log(y);        // undefined

// 2. NULL - EXPLICIT ABSENCE

let user = null; // Explicitly "no user"
console.log(user);        // null
console.log(typeof user); // "object" (historical bug!)

// 3. FUNCTION RETURN VALUES

function noReturn() {
  // No return statement
}

console.log(noReturn()); // undefined

function explicitNull() {
  return null; // Explicit no value
}

console.log(explicitNull()); // null

// 4. FUNCTION PARAMETERS

function greet(name) {
  console.log(name); // undefined if not passed
}

greet(); // undefined

// 5. OBJECT PROPERTIES

const obj = { name: "John" };

console.log(obj.name);  // "John"
console.log(obj.age);   // undefined (property doesn't exist)
console.log(obj.city);  // undefined

// Explicit null
const user = {
  name: "Alice",
  email: null // Explicitly no email
};

console.log(user.email); // null

// 6. ARRAY ELEMENTS

const arr = [1, 2, 3];
console.log(arr[10]);    // undefined (index doesn't exist)

const arr2 = [1, null, 3];
console.log(arr2[1]);    // null (explicitly set)

// 7. CHECKING FOR NULL VS UNDEFINED

let value1;
let value2 = null;

// Checking undefined
console.log(value1 === undefined);  // true
console.log(typeof value1 === "undefined"); // true

// Checking null
console.log(value2 === null);       // true
console.log(value2 === undefined);  // false

// Checking both (nullish)
console.log(value1 == null);        // true
console.log(value2 == null);        // true

// 8. TYPE CHECKING

console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (bug!)

// Correct null check
console.log(null === null);         // true
console.log(value2 === null);       // true

// 9. PRACTICAL - DEFAULT VALUES

// ❌ Using undefined
function getUser(id) {
  if (id === 1) {
    return { name: "John" };
  }
  return undefined; // Don't do this
}

// ✅ Using null
function getUserBetter(id) {
  if (id === 1) {
    return { name: "John" };
  }
  return null; // Clear intent: no user found
}

// 10. NULLISH COALESCING

let username;
let savedName = null;

// ❌ Using || (treats 0, "", false as falsy)
const name1 = username || "Guest";    // "Guest"
const name2 = savedName || "Guest";   // "Guest"

// ✅ Using ?? (only null/undefined)
const name3 = username ?? "Guest";    // "Guest"
const name4 = savedName ?? "Guest";   // "Guest"

// Difference:
const count = 0;
console.log(count || 10);  // 10 (0 is falsy)
console.log(count ?? 10);  // 0 (0 is not null/undefined)

// 11. OPTIONAL CHAINING

const user = {
  name: "Alice",
  address: null
};

// ❌ Without optional chaining
console.log(user.address.city); // TypeError!

// ✅ With optional chaining
console.log(user.address?.city); // undefined (safe)
console.log(user.settings?.theme); // undefined

// 12. CLEARING REFERENCES

let largeObject = { /* huge data */ };

// Clear reference to allow garbage collection
largeObject = null;

// 13. API RESPONSES

// Common pattern: null means "no data"
function fetchUser(id) {
  const users = {
    1: { name: "Alice" },
    2: { name: "Bob" }
  };

  return users[id] || null; // null if not found
}

console.log(fetchUser(1)); // { name: "Alice" }
console.log(fetchUser(99)); // null (not found)

// 14. DESTRUCTURING WITH DEFAULTS

const { name = "Guest", age = 18 } = {};
console.log(name); // "Guest" (undefined → default)
console.log(age);  // 18

const { city = "NYC" } = { city: null };
console.log(city); // null (null doesn't trigger default!)

// Use nullish coalescing for true default
const { country } = { country: null };
console.log(country ?? "USA"); // "USA"

// 15. TYPEOF VS STRICT EQUALITY

function isUndefined(value) {
  // ✅ Method 1: Strict equality
  return value === undefined;

  // ✅ Method 2: typeof (safer for undeclared variables)
  return typeof value === "undefined";
}

function isNull(value) {
  // ✅ Only strict equality works
  return value === null;

  // ❌ typeof doesn't help
  // typeof null === "object"
}

// 16. JSON SERIALIZATION

const data = {
  name: "John",
  age: undefined,
  city: null
};

console.log(JSON.stringify(data));
// {"name":"John","city":null}
// undefined is omitted, null is preserved!
```

### Common Mistakes

- ❌ **Mistake:** Using typeof for null check
  ```javascript
  if (typeof value === "null") { // ❌ Never true!
    // typeof null is "object"
  }
  ```

- ❌ **Mistake:** Not distinguishing between null and undefined
  ```javascript
  function getUserAge(user) {
    return user.age; // undefined if missing, but could be null
  }

  // Better: be explicit
  function getUserAge(user) {
    return user.age !== undefined ? user.age : null;
  }
  ```

- ✅ **Correct:** Use appropriate checks
  ```javascript
  // Check specifically
  if (value === null) { }
  if (value === undefined) { }

  // Check either (nullish)
  if (value == null) { }

  // Use nullish coalescing
  const result = value ?? defaultValue;
  ```

### Follow-up Questions

- "Why does `typeof null` return 'object'?"
- "When should you explicitly return null?"
- "What is the difference between `== null` and `=== null`?"
- "How does JSON.stringify handle null vs undefined?"
- "What is nullish coalescing and when would you use it?"

### Resources

- [MDN: null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)
- [MDN: undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [JavaScript.info: null and undefined](https://javascript.info/types#null)

---

## Question 13: What is the difference between typeof and instanceof?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain the difference between `typeof` and `instanceof` operators. When would you use each?

### Answer

- **`typeof`**: Returns a string indicating the type of a value
- **`instanceof`**: Tests whether an object is an instance of a specific class/constructor

1. **typeof Operator**
   - Returns primitive type as string
   - Works with any value
   - Returns `"object"` for `null` (bug)
   - Returns `"function"` for functions
   - Cannot distinguish between object types

2. **instanceof Operator**
   - Tests prototype chain
   - Only works with objects
   - Can distinguish between different object types
   - Can be fooled by prototype manipulation
   - Doesn't work across different execution contexts (iframes)

3. **typeof Return Values**
   - `"string"`, `"number"`, `"boolean"`, `"undefined"`
   - `"object"`, `"function"`, `"symbol"`, `"bigint"`
   - Special case: `typeof null === "object"`

4. **instanceof Usage**
   - Check if object created by constructor
   - Check inheritance chain
   - Custom class instances
   - Built-in types (Array, Date, RegExp)

5. **When to Use Each**
   - Use `typeof` for primitive type checking
   - Use `instanceof` for object type checking
   - Use `Array.isArray()` for arrays specifically
   - Use `Object.prototype.toString.call()` for reliable type checking

### Code Example

```javascript
// 1. TYPEOF - PRIMITIVE TYPES

console.log(typeof 42);              // "number"
console.log(typeof "hello");         // "string"
console.log(typeof true);            // "boolean"
console.log(typeof undefined);       // "undefined"
console.log(typeof Symbol('id'));    // "symbol"
console.log(typeof 123n);            // "bigint"

// 2. TYPEOF - OBJECTS AND FUNCTIONS

console.log(typeof {});              // "object"
console.log(typeof []);              // "object" (arrays are objects!)
console.log(typeof null);            // "object" (historical bug!)
console.log(typeof function(){});    // "function"
console.log(typeof class{});         // "function" (classes are functions)

// 3. TYPEOF - LIMITATIONS

// Can't distinguish object types
console.log(typeof []);              // "object"
console.log(typeof {});              // "object"
console.log(typeof new Date());      // "object"
console.log(typeof /regex/);         // "object"

// null quirk
console.log(typeof null);            // "object" (not "null"!)

// 4. INSTANCEOF - OBJECT TYPE CHECKING

// Arrays
const arr = [1, 2, 3];
console.log(arr instanceof Array);   // true
console.log(arr instanceof Object);  // true (Array inherits from Object)

// Dates
const date = new Date();
console.log(date instanceof Date);   // true
console.log(date instanceof Object); // true

// RegExp
const regex = /test/;
console.log(regex instanceof RegExp); // true
console.log(regex instanceof Object); // true

// 5. INSTANCEOF - CUSTOM CLASSES

class Person {
  constructor(name) {
    this.name = name;
  }
}

class Employee extends Person {
  constructor(name, role) {
    super(name);
    this.role = role;
  }
}

const john = new Person("John");
const jane = new Employee("Jane", "Developer");

console.log(john instanceof Person);      // true
console.log(john instanceof Employee);    // false
console.log(john instanceof Object);      // true

console.log(jane instanceof Employee);    // true
console.log(jane instanceof Person);      // true (inheritance!)
console.log(jane instanceof Object);      // true

// 6. INSTANCEOF - DOESN'T WORK WITH PRIMITIVES

console.log("hello" instanceof String);   // false (primitive)
console.log(new String("hello") instanceof String); // true (object)

console.log(42 instanceof Number);        // false
console.log(new Number(42) instanceof Number); // true

console.log(true instanceof Boolean);     // false
console.log(new Boolean(true) instanceof Boolean); // true

// 7. COMBINING TYPEOF AND INSTANCEOF

function checkType(value) {
  // Use typeof for primitives
  if (typeof value !== "object") {
    return typeof value;
  }

  // Handle null
  if (value === null) {
    return "null";
  }

  // Use instanceof for objects
  if (value instanceof Array) return "array";
  if (value instanceof Date) return "date";
  if (value instanceof RegExp) return "regexp";
  if (value instanceof Error) return "error";

  return "object";
}

console.log(checkType(42));            // "number"
console.log(checkType("hello"));       // "string"
console.log(checkType(null));          // "null"
console.log(checkType([1, 2, 3]));     // "array"
console.log(checkType(new Date()));    // "date"
console.log(checkType({ a: 1 }));      // "object"

// 8. RELIABLE TYPE CHECKING

function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

console.log(getType(42));              // "number"
console.log(getType("hello"));         // "string"
console.log(getType(null));            // "null"
console.log(getType(undefined));       // "undefined"
console.log(getType([]));              // "array"
console.log(getType({}));              // "object"
console.log(getType(new Date()));      // "date"
console.log(getType(/regex/));         // "regexp"
console.log(getType(function(){}));    // "function"

// 9. ARRAY CHECKING (BEST PRACTICES)

const arr = [1, 2, 3];

// ❌ Using typeof
console.log(typeof arr);               // "object" (not helpful!)

// ❌ Using instanceof (can fail across frames)
console.log(arr instanceof Array);     // true (but can fail)

// ✅ Using Array.isArray()
console.log(Array.isArray(arr));       // true (reliable!)

// 10. PROTOTYPE CHAIN AND INSTANCEOF

function Animal(name) {
  this.name = name;
}

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const buddy = new Dog("Buddy", "Golden");

console.log(buddy instanceof Dog);     // true
console.log(buddy instanceof Animal);  // true (prototype chain!)
console.log(buddy instanceof Object);  // true

// 11. INSTANCEOF WITH NULL/UNDEFINED

try {
  console.log(null instanceof Object);      // false
  console.log(undefined instanceof Object); // false
} catch (e) {
  // No error, just false
}

// 12. MANIPULATING PROTOTYPE CHAIN

const obj = {};
console.log(obj instanceof Object);    // true

// Change prototype
Object.setPrototypeOf(obj, null);
console.log(obj instanceof Object);    // false (no longer in chain!)

// 13. PRACTICAL TYPE GUARDS (TYPESCRIPT PATTERN)

function isString(value) {
  return typeof value === "string";
}

function isArray(value) {
  return Array.isArray(value);
}

function isDate(value) {
  return value instanceof Date;
}

function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object
  );
}

// Use type guards
if (isString(someValue)) {
  console.log(someValue.toUpperCase());
}

if (isArray(someValue)) {
  console.log(someValue.length);
}
```

### Common Mistakes

- ❌ **Mistake:** Using typeof for arrays
  ```javascript
  const arr = [1, 2, 3];
  if (typeof arr === "array") { // ❌ Never true!
    // typeof arr is "object"
  }
  ```

- ❌ **Mistake:** Using instanceof for primitives
  ```javascript
  console.log("hello" instanceof String); // false (primitive!)
  // Only works with object wrappers
  ```

- ✅ **Correct:** Use appropriate checks
  ```javascript
  // For arrays
  if (Array.isArray(arr)) { }

  // For strings
  if (typeof value === "string") { }

  // For objects
  if (value !== null && typeof value === "object") { }
  ```

### Follow-up Questions

- "Why does `typeof null` return 'object'?"
- "How does instanceof work internally?"
- "What is the difference between `instanceof` and `isPrototypeOf()`?"
- "How would you implement a custom instanceof?"
- "What are the limitations of instanceof with iframes?"

### Resources

- [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- [MDN: instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
- [Understanding typeof vs instanceof](https://www.freecodecamp.org/news/javascript-typeof-vs-instanceof/)

---

## Question 14: What are truthy and falsy values in JavaScript?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain truthy and falsy values in JavaScript. List all falsy values.

### Answer

In JavaScript, values are converted to boolean (`true` or `false`) in boolean contexts (if statements, logical operators, etc.).

**Falsy Values** (only 8 values):
1. `false`
2. `0` (zero)
3. `-0` (negative zero)
4. `0n` (BigInt zero)
5. `""` (empty string)
6. `null`
7. `undefined`
8. `NaN`

**Everything else is truthy!**

1. **Common Truthy Values**
   - All numbers except 0, -0 (including negative numbers)
   - All strings except "" (including "0", "false")
   - All objects and arrays (even empty `{}` and `[]`)
   - Functions
   - `Infinity` and `-Infinity`

2. **Boolean Contexts**
   - if statements: `if (value)`
   - while loops: `while (condition)`
   - Logical operators: `&&`, `||`, `!`
   - Ternary operator: `condition ? a : b`

3. **Explicit Conversion**
   - `Boolean(value)` - convert to boolean
   - `!!value` - double negation trick
   - Comparison with boolean: avoid using `== true/false`

4. **Practical Use Cases**
   - Input validation
   - Default values
   - Short-circuit evaluation
   - Conditional rendering

5. **Common Pitfalls**
   - `"0"` is truthy (string, not number)
   - `[]` and `{}` are truthy (even when empty)
   - `"false"` is truthy (it's a string)

### Code Example

```javascript
// 1. ALL FALSY VALUES (ONLY 8!)

console.log(Boolean(false));      // false
console.log(Boolean(0));          // false
console.log(Boolean(-0));         // false
console.log(Boolean(0n));         // false
console.log(Boolean(""));         // false
console.log(Boolean(null));       // false
console.log(Boolean(undefined));  // false
console.log(Boolean(NaN));        // false

// 2. COMMON TRUTHY VALUES

console.log(Boolean(true));       // true
console.log(Boolean(1));          // true
console.log(Boolean(-1));         // true
console.log(Boolean("hello"));    // true
console.log(Boolean("0"));        // true (string!)
console.log(Boolean("false"));    // true (string!)
console.log(Boolean([]));         // true (array!)
console.log(Boolean({}));         // true (object!)
console.log(Boolean(function(){})); // true
console.log(Boolean(Infinity));   // true
console.log(Boolean(-Infinity));  // true

// 3. IF STATEMENT EXAMPLES

if (0) {
  console.log("Never runs"); // 0 is falsy
}

if ("") {
  console.log("Never runs"); // empty string is falsy
}

if (null) {
  console.log("Never runs"); // null is falsy
}

if ("0") {
  console.log("Runs!"); // "0" is truthy (string)
}

if ([]) {
  console.log("Runs!"); // empty array is truthy
}

if ({}) {
  console.log("Runs!"); // empty object is truthy
}

// 4. LOGICAL OPERATORS WITH TRUTHY/FALSY

// OR operator (||) - returns first truthy value
console.log(0 || "default");         // "default"
console.log("" || "fallback");       // "fallback"
console.log(null || undefined || 5); // 5
console.log(false || 0 || "");       // "" (all falsy, returns last)

// AND operator (&&) - returns first falsy value or last truthy
console.log(true && "value");        // "value"
console.log(1 && 2 && 3);           // 3 (all truthy, returns last)
console.log(1 && 0 && 2);           // 0 (first falsy)
console.log("" && "never");         // "" (first falsy)

// NOT operator (!) - converts to boolean and negates
console.log(!0);                    // true
console.log(!"");                   // true
console.log(!null);                 // true
console.log(!"hello");              // false
console.log(![]);                   // false (array is truthy)

// 5. DOUBLE NEGATION TRICK

console.log(!!0);                   // false
console.log(!!"hello");             // true
console.log(!![]);                  // true
console.log(!!null);                // false

// Same as Boolean()
console.log(Boolean(0));            // false
console.log(Boolean("hello"));      // true

// 6. COMMON TRAPS

// ❌ Trap 1: "0" is truthy!
if ("0") {
  console.log("Runs!"); // "0" is a non-empty string
}

// ❌ Trap 2: Empty arrays/objects are truthy!
if ([]) {
  console.log("Runs!"); // empty array is truthy
}

if ({}) {
  console.log("Runs!"); // empty object is truthy
}

// ❌ Trap 3: "false" is truthy!
const value = "false";
if (value) {
  console.log("Runs!"); // string "false" is truthy
}

// 7. PRACTICAL - INPUT VALIDATION

function validateInput(input) {
  if (!input) {
    return "Input is required"; // Catches "", null, undefined, 0
  }
  return "Valid input";
}

console.log(validateInput(""));        // "Input is required"
console.log(validateInput(null));      // "Input is required"
console.log(validateInput(undefined)); // "Input is required"
console.log(validateInput("hello"));   // "Valid input"

// ⚠️ Problem: Also catches 0 as invalid!
console.log(validateInput(0)); // "Input is required" (might not want this)

// Better: Be specific
function validateInputBetter(input) {
  if (input == null || input === "") {
    return "Input is required";
  }
  return "Valid input";
}

console.log(validateInputBetter(0)); // "Valid input" (0 is now valid)

// 8. DEFAULT VALUES

// ❌ Using || (problem with 0, false, "")
function setCount(count) {
  const finalCount = count || 10; // Problem if count is 0
  return finalCount;
}

console.log(setCount(5));    // 5
console.log(setCount(0));    // 10 (wanted 0, got 10!)
console.log(setCount(null)); // 10

// ✅ Using ?? (nullish coalescing)
function setCountBetter(count) {
  const finalCount = count ?? 10; // Only null/undefined trigger default
  return finalCount;
}

console.log(setCountBetter(5));    // 5
console.log(setCountBetter(0));    // 0 (correct!)
console.log(setCountBetter(null)); // 10

// 9. ARRAY/OBJECT CHECKS

const items = [];
const data = {};

// ❌ Wrong: Checking truthiness
if (items) {
  console.log("Has items"); // Runs even if empty!
}

// ✅ Correct: Check length/keys
if (items.length > 0) {
  console.log("Has items");
}

if (Object.keys(data).length > 0) {
  console.log("Has data");
}

// 10. COMPARING WITH BOOLEAN (AVOID!)

// ❌ Bad: Comparing with true/false
if (value == true) { // Complex coercion!
  // ...
}

// ✅ Good: Use truthy/falsy directly
if (value) {
  // ...
}

// ✅ Or be explicit
if (value === true) {
  // ...
}

// Examples of confusion:
console.log("0" == true);    // false (confusing!)
console.log("0" == false);   // true (confusing!)
console.log([] == true);     // false
console.log([] == false);    // true (wat!)

// 11. SHORT-CIRCUIT WITH FUNCTIONS

function expensive() {
  console.log("Called expensive function");
  return "result";
}

// Function only called if left side is truthy
const result1 = true && expensive();  // "Called expensive function"
const result2 = false && expensive(); // (not called)

// Function only called if left side is falsy
const result3 = true || expensive();  // (not called)
const result4 = false || expensive(); // "Called expensive function"
```

### Common Mistakes

- ❌ **Mistake:** Thinking "0" is falsy
  ```javascript
  if ("0") {
    console.log("Runs!"); // "0" is a truthy string
  }
  ```

- ❌ **Mistake:** Thinking empty array/object is falsy
  ```javascript
  if ([]) {
    console.log("Runs!"); // Empty array is truthy
  }

  if ({}) {
    console.log("Runs!"); // Empty object is truthy
  }
  ```

- ✅ **Correct:** Know the 8 falsy values and use appropriate checks
  ```javascript
  // Check array length
  if (arr.length > 0) { }

  // Check object keys
  if (Object.keys(obj).length > 0) { }

  // Use nullish coalescing for defaults
  const count = value ?? 0;
  ```

### Follow-up Questions

- "Why are empty arrays and objects truthy?"
- "What is the difference between `||` and `??`?"
- "How does short-circuit evaluation work?"
- "What are the pitfalls of using `|| for default values?"
- "Why should you avoid comparing with `== true`?"

### Resources

- [MDN: Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
- [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
- [JavaScript.info: Type Conversions](https://javascript.info/type-conversions)

---

## Question 15: Explain short-circuit evaluation with && and || operators

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon

### Question
How does short-circuit evaluation work with `&&` and `||` operators? Provide practical examples.

### Answer

**Short-circuit evaluation** means logical operators stop evaluating as soon as the result is determined.

1. **OR Operator (||)**
   - Returns first truthy value
   - If all values are falsy, returns last value
   - Right side not evaluated if left is truthy
   - Common for default values

2. **AND Operator (&&)**
   - Returns first falsy value
   - If all values are truthy, returns last value
   - Right side not evaluated if left is falsy
   - Common for conditional execution

3. **Why Short-Circuit**
   - Performance optimization
   - Avoid unnecessary computations
   - Prevent errors (null/undefined checks)
   - Enable conditional execution

4. **Return Values**
   - **Returns the actual value**, not just true/false!
   - `||` returns first truthy or last value
   - `&&` returns first falsy or last value

5. **Modern Alternatives**
   - `??` (nullish coalescing) - only null/undefined
   - `?.` (optional chaining) - safe property access

### Code Example

```javascript
// 1. OR (||) - RETURNS FIRST TRUTHY

console.log(false || "default");        // "default"
console.log(0 || "fallback");           // "fallback"
console.log("" || "empty");             // "empty"
console.log(null || undefined || "value"); // "value"

// Returns actual values, not true/false!
console.log(5 || 10);                   // 5 (first truthy)
console.log("hello" || "world");        // "hello"

// All falsy → returns last
console.log(false || 0 || "");          // "" (last value)
console.log(null || undefined);         // undefined

// 2. AND (&&) - RETURNS FIRST FALSY

console.log(true && "value");           // "value" (last truthy)
console.log(1 && 2 && 3);              // 3 (last truthy)
console.log(false && "never");          // false (first falsy)
console.log(0 && "never");              // 0 (first falsy)
console.log("" && "never");             // "" (first falsy)

// All truthy → returns last
console.log(5 && 10 && 15);            // 15

// 3. SHORT-CIRCUIT PREVENTS EXECUTION

function expensiveOperation() {
  console.log("Expensive operation called!");
  return "result";
}

// OR - right side NOT called if left is truthy
const result1 = true || expensiveOperation();  // true (not called)
const result2 = false || expensiveOperation(); // "result" (called)

// AND - right side NOT called if left is falsy
const result3 = false && expensiveOperation(); // false (not called)
const result4 = true && expensiveOperation();  // "result" (called)

// 4. DEFAULT VALUES WITH ||

function greet(name) {
  const finalName = name || "Guest"; // Default if name is falsy
  return `Hello, ${finalName}!`;
}

console.log(greet("Alice"));   // "Hello, Alice!"
console.log(greet(""));        // "Hello, Guest!"
console.log(greet(null));      // "Hello, Guest!"
console.log(greet(undefined)); // "Hello, Guest!"

// ⚠️ Problem: 0 and false also get default!
console.log(greet(0));         // "Hello, Guest!" (might not want this)
console.log(greet(false));     // "Hello, Guest!" (might not want this)

// 5. CONDITIONAL EXECUTION WITH &&

const user = { name: "Alice", role: "admin" };

// Execute only if user exists
user && console.log(`Welcome, ${user.name}!`); // Logs

// Execute only if user is admin
user.role === "admin" && console.log("Admin access granted"); // Logs

// Common in React
const hasData = true;
hasData && renderComponent(); // Only renders if hasData is truthy

// 6. CHAINING SHORT-CIRCUITS

// OR chain - first truthy wins
const value = getFromCache() || getFromDatabase() || "default";
// Only calls each function until one returns truthy

// AND chain - first falsy stops
const result = validateInput() && processData() && saveToDatabase();
// Stops at first falsy (failed validation)

// 7. PRACTICAL - NULL/UNDEFINED CHECK

const data = { user: { name: "Alice" } };

// ❌ Without short-circuit - crashes if data.user is null
// console.log(data.user.name); // TypeError if user is null

// ✅ With && short-circuit
console.log(data && data.user && data.user.name); // "Alice"

// Better with optional chaining
console.log(data?.user?.name); // "Alice"

// 8. DEFAULT VALUES - || VS ??

const count1 = 0;
const count2 = null;

// || treats 0 as falsy
console.log(count1 || 10);  // 10 (0 is falsy!)
console.log(count2 || 10);  // 10

// ?? only treats null/undefined as nullish
console.log(count1 ?? 10);  // 0 (keeps 0!)
console.log(count2 ?? 10);  // 10

const flag1 = false;
const flag2 = null;

console.log(flag1 || true);  // true (false is falsy)
console.log(flag1 ?? true);  // false (keeps false!)

console.log(flag2 || true);  // true
console.log(flag2 ?? true);  // true

// 9. PRACTICAL - CACHING

let cache = null;

function getData() {
  // Only compute if cache is empty
  cache = cache || expensiveComputation();
  return cache;
}

// Or with lazy evaluation
function getDataLazy() {
  return cache || (cache = expensiveComputation());
}

// 10. GUARD CLAUSES

function processUser(user) {
  // Early return if user is falsy
  if (!user) return;

  // Or using && for one-liner
  user && console.log(`Processing ${user.name}`);

  // Multiple guards
  user && user.isActive && processActiveUser(user);
}

// 11. COMBINING && AND ||

// Complex conditions
const canEdit = (isOwner || isAdmin) && isActive;

// Default with validation
const name = (input && input.trim()) || "Anonymous";

// 12. PERFORMANCE OPTIMIZATION

// ❌ Bad: Always executes both
function slowCheck() {
  return expensiveCheck1() | expensiveCheck2(); // Bitwise OR, no short-circuit!
}

// ✅ Good: Short-circuits
function fastCheck() {
  return expensiveCheck1() || expensiveCheck2(); // Stops at first truthy
}

// 13. EVENT HANDLER PATTERN

function handleClick(event) {
  // Prevent default only if condition is met
  shouldPreventDefault && event.preventDefault();

  // Call handler only if it exists
  onClick && onClick(event);

  // Chain multiple checks
  isEnabled && !isLoading && performAction();
}

// 14. API RESPONSE HANDLING

function processResponse(response) {
  // Extract data with defaults
  const data = response && response.data || [];
  const status = response && response.status || 500;
  const message = response && response.message || "Error occurred";

  return { data, status, message };
}

// Better with optional chaining and nullish coalescing
function processResponseBetter(response) {
  return {
    data: response?.data ?? [],
    status: response?.status ?? 500,
    message: response?.message ?? "Error occurred"
  };
}
```

### Common Mistakes

- ❌ **Mistake:** Using || with 0, false, or ""
  ```javascript
  const count = 0;
  const display = count || "No items"; // "No items" (wrong!)

  // Use ?? instead
  const display = count ?? "No items"; // 0 (correct!)
  ```

- ❌ **Mistake:** Forgetting operators return values
  ```javascript
  const result = true && "value";
  console.log(result); // "value", not true!
  ```

- ✅ **Correct:** Use appropriate operator
  ```javascript
  // For defaults with falsy values: use ||
  const name = input || "default";

  // For defaults with only null/undefined: use ??
  const count = value ?? 0;

  // For safe access: use ?.
  const city = user?.address?.city;
  ```

### Follow-up Questions

- "What is the difference between `||` and `??`?"
- "How does short-circuit evaluation improve performance?"
- "What is optional chaining (`?.`) and when should you use it?"
- "Can you use short-circuit for conditional execution?"
- "What are the pitfalls of using `||` for default values?"

### Resources

- [MDN: Logical OR (||)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR)
- [MDN: Logical AND (&&)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)
- [JavaScript.info: Logical Operators](https://javascript.info/logical-operators)

---

## Question 16: What is optional chaining (?.) in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain optional chaining (`?.`) operator. How does it work and when should you use it?

### Answer

**Optional chaining** (`?.`) allows you to safely access nested object properties without checking if each reference is null/undefined.

1. **What It Does**
   - Returns `undefined` if reference is null/undefined
   - Short-circuits the rest of the chain
   - Prevents "Cannot read property of undefined" errors
   - Works with properties, methods, and array indexes

2. **Three Forms**
   - `obj?.prop` - property access
   - `obj?.[expr]` - computed property access
   - `func?.()` - function call

3. **When to Use**
   - Accessing deeply nested properties
   - Optional API response fields
   - Optional callback functions
   - Dynamic property access

4. **When NOT to Use**
   - Required properties (hides bugs!)
   - Where null/undefined should error
   - Simple one-level access
   - Performance-critical code (slight overhead)

5. **Combination with ??**
   - `obj?.prop ?? defaultValue` - safe access with default
   - Common pattern for nested data with fallbacks

### Code Example

```javascript
// 1. BASIC PROPERTY ACCESS

const user = {
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "Boston"
  }
};

// ❌ Without optional chaining - crashes!
const user2 = { name: "Bob" }; // No address
// console.log(user2.address.city); // TypeError!

// ✅ With optional chaining
console.log(user2.address?.city); // undefined (safe!)

// Traditional way (verbose)
const city = user2.address && user2.address.city;

// Modern way (clean)
const city2 = user2.address?.city;

// 2. DEEPLY NESTED ACCESS

const data = {
  user: {
    profile: {
      settings: {
        theme: "dark"
      }
    }
  }
};

// ❌ Traditional - verbose!
const theme = data && data.user && data.user.profile &&
              data.user.profile.settings &&
              data.user.profile.settings.theme;

// ✅ Optional chaining - clean!
const theme2 = data?.user?.profile?.settings?.theme;

// If any part is null/undefined → undefined
const missing = data?.user?.profile?.missing?.prop; // undefined

// 3. OPTIONAL METHOD CALLS

const obj = {
  greet() {
    return "Hello!";
  }
};

// ✅ Method exists
console.log(obj.greet?.()); // "Hello!"

// ✅ Method doesn't exist
console.log(obj.missing?.()); // undefined (no error!)

// ❌ Without optional chaining
// console.log(obj.missing()); // TypeError!

// 4. OPTIONAL ARRAY ACCESS

const users = [
  { name: "Alice" },
  { name: "Bob" }
];

console.log(users[0]?.name);  // "Alice"
console.log(users[10]?.name); // undefined (index doesn't exist)

// With null array
const nullArray = null;
console.log(nullArray?.[0]);  // undefined (safe!)

// 5. COMPUTED PROPERTY ACCESS

const key = "address";
const user = { name: "Alice", address: "123 Main" };

// Traditional bracket notation
console.log(user[key]); // "123 Main"

// Optional computed access
console.log(user?.[key]); // "123 Main"

const nullObj = null;
console.log(nullObj?.[key]); // undefined (safe!)

// 6. COMBINING WITH NULLISH COALESCING

const user = { name: "Alice" };

// Get nested value with default
const city = user?.address?.city ?? "Unknown";
console.log(city); // "Unknown"

const theme = user?.settings?.theme ?? "light";
console.log(theme); // "light"

// Without optional chaining (verbose)
const city2 = (user && user.address && user.address.city) || "Unknown";

// 7. OPTIONAL CALLBACKS

function processData(data, onSuccess, onError) {
  try {
    const result = process(data);
    onSuccess?.(result); // Call only if function exists
  } catch (error) {
    onError?.(error); // Call only if function exists
  }
}

// Call without callbacks (no error!)
processData(someData);

// Call with only onSuccess
processData(someData, (result) => console.log(result));

// 8. OPTIONAL EVENT HANDLERS

class Button {
  constructor(options) {
    this.onClick = options.onClick;
    this.onHover = options.onHover;
  }

  handleClick(event) {
    // Call handler only if defined
    this.onClick?.(event);
  }

  handleHover(event) {
    this.onHover?.(event);
  }
}

// Create button without all handlers (no error!)
const btn = new Button({
  onClick: (e) => console.log("Clicked!")
  // onHover not provided - that's OK!
});

// 9. API RESPONSE HANDLING

async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // Safely access optional fields
  return {
    name: data?.name ?? "Unknown",
    email: data?.contact?.email ?? "No email",
    city: data?.address?.city ?? "Unknown",
    phone: data?.contact?.phone?.number ?? "No phone"
  };
}

// 10. REACT COMPONENT EXAMPLE

function UserProfile({ user }) {
  return (
    <div>
      <h1>{user?.name ?? "Guest"}</h1>
      <p>{user?.address?.city}</p>
      <img src={user?.avatar?.url ?? "/default-avatar.png"} />
      {user?.isAdmin && <AdminBadge />}
    </div>
  );
}

// Works even if user is null/undefined
<UserProfile user={null} /> // No crash!

// 11. SHORT-CIRCUITING

let count = 0;

function increment() {
  count++;
  return { value: count };
}

const obj = null;

// increment() is NOT called (short-circuit!)
console.log(obj?.prop?.nested?.increment());
console.log(count); // 0 (increment never called)

// 12. DELETE WITH OPTIONAL CHAINING

const config = {
  theme: "dark",
  settings: {
    notifications: true
  }
};

// Safe delete
delete config?.settings?.advanced; // No error even if doesn't exist
delete config?.missing?.prop; // No error

// 13. LIMITATIONS

// ❌ Can't use on left side of assignment
// obj?.prop = "value"; // SyntaxError!

// ✅ Must use regular access for assignment
if (obj) {
  obj.prop = "value";
}

// ❌ Doesn't work with optional construction
// const instance = new Constructor?.(); // SyntaxError!

// ✅ Use conditional instead
const instance = Constructor ? new Constructor() : null;

// 14. PERFORMANCE CONSIDERATION

// For tight loops, optional chaining has slight overhead
for (let i = 0; i < 1000000; i++) {
  // Slightly slower
  const value = obj?.prop?.nested;

  // Slightly faster (if you know obj exists)
  const value2 = obj.prop?.nested;
}

// In most cases, the overhead is negligible
```

### Common Mistakes

- ❌ **Mistake:** Using for required properties
  ```javascript
  // Bad - hides bugs!
  function processUser(user) {
    console.log(user?.name); // undefined if user is null - should error!
  }

  // Good - fail fast for required data
  function processUser(user) {
    if (!user) throw new Error("User required");
    console.log(user.name);
  }
  ```

- ❌ **Mistake:** Trying to use for assignment
  ```javascript
  obj?.prop = "value"; // SyntaxError!
  ```

- ✅ **Correct:** Use for optional access with defaults
  ```javascript
  const name = user?.name ?? "Guest";
  const city = user?.address?.city ?? "Unknown";
  ```

### Follow-up Questions

- "What's the difference between `?.` and `&&` for null checks?"
- "Can you use optional chaining on the left side of an assignment?"
- "How does optional chaining work with nullish coalescing?"
- "What are the performance implications of optional chaining?"
- "When should you NOT use optional chaining?"

### Resources

- [MDN: Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [JavaScript.info: Optional Chaining](https://javascript.info/optional-chaining)
- [TC39 Optional Chaining Proposal](https://github.com/tc39/proposal-optional-chaining)

---

## Question 17: What is nullish coalescing (??) operator?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain the nullish coalescing (`??`) operator. How is it different from the OR (`||`) operator?

### Answer

**Nullish coalescing** (`??`) returns the right operand when the left operand is `null` or `undefined`. Unlike `||`, it doesn't treat other falsy values (0, false, "") as triggers.

1. **What is Nullish**
   - Only `null` and `undefined` are nullish
   - All other values are NOT nullish (including 0, false, "")
   - Different from falsy (which includes 0, false, "", etc.)

2. **|| vs ??**
   - `||` returns right side for ANY falsy value
   - `??` returns right side ONLY for null/undefined
   - Use `||` when you want to filter all falsy values
   - Use `??` when 0, false, "" are valid values

3. **Common Use Cases**
   - Default values where 0 is valid
   - Boolean flags where false is valid
   - Strings where empty string is valid

4. **Assignment Variants**
   - `??=` - nullish coalescing assignment
   - Only assigns if current value is null/undefined

5. **Chaining and Precedence**
   - Cannot directly mix `??` with `&&` or `||`
   - Must use parentheses for clarity

### Code Example

```javascript
// 1. BASIC COMPARISON: || VS ??

// || returns right side for ANY falsy value
console.log(0 || 10);        // 10 (0 is falsy)
console.log("" || "default"); // "default" ("" is falsy)
console.log(false || true);   // true (false is falsy)

// ?? returns right side ONLY for null/undefined
console.log(0 ?? 10);        // 0 (0 is not nullish!)
console.log("" ?? "default"); // "" (empty string is not nullish!)
console.log(false ?? true);   // false (false is not nullish!)

// Both behave same for null/undefined
console.log(null || 10);      // 10
console.log(null ?? 10);      // 10
console.log(undefined || 10); // 10
console.log(undefined ?? 10); // 10

// 2. PRACTICAL - COUNT/NUMBER VALUES

function setCount(count) {
  // ❌ Wrong with ||: treats 0 as invalid
  const value1 = count || 5;
  console.log(value1); // 5 if count is 0!

  // ✅ Correct with ??: keeps 0
  const value2 = count ?? 5;
  console.log(value2); // 0 if count is 0
}

setCount(0);    // || gives 5, ?? gives 0
setCount(null); // Both give 5

// 3. PRACTICAL - BOOLEAN FLAGS

function enableFeature(isEnabled) {
  // ❌ Wrong with ||: treats false as disabled
  const enabled1 = isEnabled || true;
  console.log(enabled1); // true even if isEnabled is false!

  // ✅ Correct with ??: respects false
  const enabled2 = isEnabled ?? true;
  console.log(enabled2); // false if isEnabled is false
}

enableFeature(false);     // || gives true, ?? gives false
enableFeature(undefined); // Both give true

// 4. PRACTICAL - EMPTY STRING

function setName(name) {
  // ❌ Wrong with ||: treats "" as invalid
  const finalName1 = name || "Anonymous";
  console.log(finalName1); // "Anonymous" if name is ""

  // ✅ Correct with ??: keeps ""
  const finalName2 = name ?? "Anonymous";
  console.log(finalName2); // "" if name is ""
}

setName("");        // || gives "Anonymous", ?? gives ""
setName(undefined); // Both give "Anonymous"

// 5. REAL-WORLD EXAMPLE - USER SETTINGS

const userSettings = {
  volume: 0,          // 0 is valid!
  notifications: false, // false is valid!
  username: ""        // "" might be valid during editing
};

// ❌ Wrong with ||
const volume1 = userSettings.volume || 50;
const notifications1 = userSettings.notifications || true;
const username1 = userSettings.username || "Guest";

console.log(volume1);        // 50 (wanted 0!)
console.log(notifications1); // true (wanted false!)
console.log(username1);      // "Guest" (wanted ""!)

// ✅ Correct with ??
const volume2 = userSettings.volume ?? 50;
const notifications2 = userSettings.notifications ?? true;
const username2 = userSettings.username ?? "Guest";

console.log(volume2);        // 0 (correct!)
console.log(notifications2); // false (correct!)
console.log(username2);      // "" (correct!)

// 6. NULLISH COALESCING ASSIGNMENT (??=)

let config = {
  timeout: undefined,
  retries: 0,
  cache: null
};

// Only assign if current value is null/undefined
config.timeout ??= 5000;  // Assigned (was undefined)
config.retries ??= 3;     // NOT assigned (0 is not nullish)
config.cache ??= {};      // Assigned (was null)

console.log(config);
// { timeout: 5000, retries: 0, cache: {} }

// 7. COMBINING WITH OPTIONAL CHAINING

const user = {
  name: "Alice",
  settings: {
    theme: null,
    fontSize: 0
  }
};

// Get nested value with default
const theme = user?.settings?.theme ?? "light";
const fontSize = user?.settings?.fontSize ?? 14;

console.log(theme);    // "light" (theme was null)
console.log(fontSize); // 0 (fontSize was 0, not nullish!)

// 8. CHAINING NULLISH COALESCING

const value = input1 ?? input2 ?? input3 ?? "default";
// Returns first non-nullish value

const a = null;
const b = undefined;
const c = 0;
const d = "value";

const result = a ?? b ?? c ?? d ?? "default";
console.log(result); // 0 (first non-nullish!)

// 9. PRECEDENCE AND MIXING OPERATORS

// ❌ Cannot directly mix with && or ||
// const result = a ?? b || c; // SyntaxError!
// const result = a && b ?? c; // SyntaxError!

// ✅ Must use parentheses
const result1 = (a ?? b) || c;  // OK
const result2 = a ?? (b || c);  // OK
const result3 = (a && b) ?? c;  // OK

// 10. FUNCTION PARAMETERS WITH DEFAULTS

// Traditional default parameter
function greet1(name = "Guest") {
  console.log(`Hello, ${name}!`);
}

greet1();        // "Hello, Guest!"
greet1(null);    // "Hello, null!" (null passes through!)
greet1("");      // "Hello, !" ("" passes through!)

// Using ?? for more control
function greet2(name) {
  const finalName = name ?? "Guest";
  console.log(`Hello, ${finalName}!`);
}

greet2();        // "Hello, Guest!"
greet2(null);    // "Hello, Guest!"
greet2("");      // "Hello, !" ("" is not nullish)

// 11. API RESPONSE HANDLING

async function fetchUserData(id) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  return {
    id: data.id ?? -1,                    // -1 if missing
    name: data.name ?? "Unknown",         // "Unknown" if null/undefined
    age: data.age ?? 0,                   // 0 if null/undefined
    isActive: data.isActive ?? false,     // false if null/undefined
    score: data.score ?? 0,               // Keep 0 if it's 0
    verified: data.verified ?? false      // Keep false if it's false
  };
}

// 12. CONDITIONAL RENDERING (REACT)

function Component({ count, showZero }) {
  return (
    <div>
      {/* ❌ Wrong: hides when count is 0 */}
      {count || <EmptyState />}

      {/* ✅ Correct: shows 0 */}
      {count ?? <EmptyState />}

      {/* ✅ Best: explicit check */}
      {count !== undefined && count !== null ? count : <EmptyState />}
    </div>
  );
}

// 13. DECISION TABLE

const value = /* some value */;

// When to use ||
value || defaultValue  // Use when ANY falsy value should trigger default

// When to use ??
value ?? defaultValue  // Use when ONLY null/undefined should trigger default

// Examples:
const count = 0;
count || 10   // 10 (0 is replaced)
count ?? 10   // 0 (0 is kept)

const flag = false;
flag || true  // true (false is replaced)
flag ?? true  // false (false is kept)

const text = "";
text || "N/A"  // "N/A" ("" is replaced)
text ?? "N/A"  // "" ("" is kept)
```

### Common Mistakes

- ❌ **Mistake:** Using || when 0, false, or "" are valid
  ```javascript
  const volume = settings.volume || 50;  // Replaces 0 with 50!

  // Correct
  const volume = settings.volume ?? 50;  // Keeps 0
  ```

- ❌ **Mistake:** Mixing ?? with && or || without parentheses
  ```javascript
  const result = a ?? b || c;  // SyntaxError!

  // Correct
  const result = (a ?? b) || c;  // OK
  ```

- ✅ **Correct:** Use ?? for values where 0, false, "" are meaningful
  ```javascript
  const count = value ?? 0;
  const enabled = flag ?? false;
  const name = input ?? "";
  ```

### Follow-up Questions

- "What is the difference between `??` and `||`?"
- "What values are considered 'nullish'?"
- "Can you mix `??` with `&&` or `||`?"
- "What is `??=` (nullish coalescing assignment)?"
- "When should you use `??` vs `||`?"

### Resources

- [MDN: Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [JavaScript.info: Nullish Coalescing](https://javascript.info/nullish-coalescing-operator)
- [TC39 Nullish Coalescing Proposal](https://github.com/tc39/proposal-nullish-coalescing)

---

## Question 18: What is destructuring in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain array and object destructuring. Provide examples of practical use cases.

### Answer

**Destructuring** is a syntax for extracting values from arrays or properties from objects into distinct variables.

1. **Array Destructuring**
   - Extract by position
   - Skip elements with commas
   - Rest operator to collect remaining
   - Default values for missing elements
   - Swap variables easily

2. **Object Destructuring**
   - Extract by property name
   - Rename variables during extraction
   - Default values for missing properties
   - Nested destructuring
   - Rest operator to collect remaining properties

3. **Common Use Cases**
   - Function parameters
   - API response handling
   - Multiple return values
   - Swapping variables
   - Importing specific exports

4. **Benefits**
   - Cleaner code
   - Less repetitive
   - Self-documenting
   - Avoids intermediate variables

5. **Advanced Patterns**
   - Nested destructuring
   - Mixed array/object destructuring
   - Destructuring in loops
   - Dynamic property names

### Code Example

```javascript
// 1. BASIC ARRAY DESTRUCTURING

const numbers = [1, 2, 3, 4, 5];

// Traditional way
const first = numbers[0];
const second = numbers[1];

// Destructuring way
const [a, b, c] = numbers;
console.log(a, b, c); // 1, 2, 3

// Skip elements
const [x, , y] = numbers; // Skip second element
console.log(x, y); // 1, 3

// 2. REST IN ARRAY DESTRUCTURING

const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Get first and last
const [first, ...middle, last] = [1, 2, 3, 4, 5]; // ❌ SyntaxError!
// Rest must be last

// 3. DEFAULT VALUES IN ARRAYS

const [a = 1, b = 2, c = 3] = [10];
console.log(a, b, c); // 10, 2, 3

const [x = "default"] = [undefined];
console.log(x); // "default" (undefined triggers default)

const [y = "default"] = [null];
console.log(y); // null (null doesn't trigger default!)

// 4. SWAPPING VARIABLES

let a = 1, b = 2;

// Traditional swap
let temp = a;
a = b;
b = temp;

// Destructuring swap (no temp variable!)
[a, b] = [b, a];
console.log(a, b); // 2, 1

// 5. BASIC OBJECT DESTRUCTURING

const user = {
  name: "Alice",
  age: 25,
  city: "Boston"
};

// Traditional way
const name = user.name;
const age = user.age;

// Destructuring way
const { name, age, city } = user;
console.log(name, age, city); // "Alice", 25, "Boston"

// Order doesn't matter!
const { city: c, name: n } = user;
console.log(c, n); // "Boston", "Alice"

// 6. RENAMING DURING DESTRUCTURING

const user = { name: "Alice", age: 25 };

// Rename 'name' to 'username'
const { name: username, age: userAge } = user;
console.log(username, userAge); // "Alice", 25

// Common pattern for avoiding name conflicts
const { name: userName } = user;
const { name: productName } = product;

// 7. DEFAULT VALUES IN OBJECTS

const user = { name: "Alice" };

const { name, age = 18, city = "Unknown" } = user;
console.log(name, age, city); // "Alice", 18, "Unknown"

// With renaming AND defaults
const { name: n, age: a = 18 } = user;
console.log(n, a); // "Alice", 18

// 8. NESTED DESTRUCTURING

const user = {
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "Boston",
    coords: {
      lat: 42.3601,
      lng: -71.0589
    }
  }
};

// Nested destructuring
const {
  name,
  address: {
    city,
    coords: { lat, lng }
  }
} = user;

console.log(name, city, lat, lng);
// "Alice", "Boston", 42.3601, -71.0589

// Note: 'address' and 'coords' are NOT variables!
// console.log(address); // ReferenceError

// 9. REST IN OBJECT DESTRUCTURING

const user = {
  name: "Alice",
  age: 25,
  city: "Boston",
  country: "USA",
  email: "alice@example.com"
};

// Extract some, collect rest
const { name, age, ...otherInfo } = user;
console.log(name, age); // "Alice", 25
console.log(otherInfo);
// { city: "Boston", country: "USA", email: "alice@example.com" }

// 10. FUNCTION PARAMETERS

// Traditional
function greet(user) {
  console.log(`Hello, ${user.name}! You are ${user.age} years old.`);
}

// Destructured parameters
function greetBetter({ name, age }) {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

greetBetter({ name: "Alice", age: 25 });

// With defaults
function createUser({ name = "Guest", age = 18, role = "user" } = {}) {
  return { name, age, role };
}

console.log(createUser()); // { name: "Guest", age: 18, role: "user" }
console.log(createUser({ name: "Alice" })); // { name: "Alice", age: 18, role: "user" }

// 11. MULTIPLE RETURN VALUES

function getCoordinates() {
  return [42.3601, -71.0589];
}

const [latitude, longitude] = getCoordinates();

function getUserInfo() {
  return {
    name: "Alice",
    email: "alice@example.com",
    age: 25
  };
}

const { name, email } = getUserInfo();

// 12. API RESPONSE HANDLING

async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // Destructure with defaults
  const {
    name = "Unknown",
    email = "no-email",
    address: {
      city = "Unknown",
      country = "Unknown"
    } = {}
  } = data;

  return { name, email, city, country };
}

// 13. ARRAY OF OBJECTS

const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 }
];

// Destructure in map
const names = users.map(({ name }) => name);
console.log(names); // ["Alice", "Bob", "Charlie"]

// Destructure in forEach
users.forEach(({ name, age }) => {
  console.log(`${name} is ${age} years old`);
});

// Destructure in for...of
for (const { name, age } of users) {
  console.log(`${name}: ${age}`);
}

// 14. DYNAMIC PROPERTY NAMES

const key = "username";
const { [key]: value } = { username: "alice123" };
console.log(value); // "alice123"

const prop = "email";
const user = { email: "alice@example.com", name: "Alice" };
const { [prop]: emailValue } = user;
console.log(emailValue); // "alice@example.com"

// 15. MIXED ARRAY AND OBJECT DESTRUCTURING

const response = {
  data: {
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
    ],
    total: 2
  }
};

// Extract first user's name
const {
  data: {
    users: [{ name: firstName }],
    total
  }
} = response;

console.log(firstName, total); // "Alice", 2

// 16. REACT/JSX COMMON PATTERNS

// Component props destructuring
function UserCard({ name, age, avatar, onEdit }) {
  return (
    <div>
      <img src={avatar} />
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

// With defaults
function Button({
  text = "Click me",
  onClick = () => {},
  disabled = false,
  ...otherProps
}) {
  return <button onClick={onClick} disabled={disabled} {...otherProps}>{text}</button>;
}

// 17. IMPORTING MODULES

// Named imports (destructuring!)
import { useState, useEffect } from 'react';
import { formatDate, parseDate } from './utils';

// With renaming
import { default as React, Component as ReactComponent } from 'react';

// 18. OBJECT METHOD DESTRUCTURING

const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};

const { add, multiply } = calculator;
console.log(add(5, 3));      // 8
console.log(multiply(5, 3)); // 15
```

### Common Mistakes

- ❌ **Mistake:** Forgetting parentheses when destructuring statement
  ```javascript
  let a, b;
  { a, b } = { a: 1, b: 2 }; // ❌ SyntaxError!

  // Correct
  ({ a, b } = { a: 1, b: 2 }); // ✅ OK
  ```

- ❌ **Mistake:** Rest parameter not last
  ```javascript
  const [a, ...rest, b] = [1, 2, 3, 4]; // ❌ SyntaxError!

  // Correct
  const [a, b, ...rest] = [1, 2, 3, 4]; // ✅ OK
  ```

- ✅ **Correct:** Use destructuring for cleaner code
  ```javascript
  // Extract what you need
  const { name, email } = user;

  // Use defaults for safety
  const { age = 18, city = "Unknown" } = user;

  // Rest for remaining properties
  const { id, ...userData } = user;
  ```

### Follow-up Questions

- "How do you swap variables using destructuring?"
- "Can you use default values with destructuring?"
- "What is the difference between `undefined` and `null` in destructuring?"
- "How does destructuring work with nested objects?"
- "Can you rename variables during destructuring?"

### Resources

- [MDN: Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [JavaScript.info: Destructuring](https://javascript.info/destructuring-assignment)
- [ES6 Destructuring](https://www.freecodecamp.org/news/destructuring-in-javascript/)

---

## Question 19: What is the spread operator (...) in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain the spread operator (`...`). Provide examples of its use with arrays and objects.

### Answer

The **spread operator** (`...`) expands iterables (arrays, strings) or object properties into individual elements.

1. **Array Operations**
   - Copy arrays (shallow)
   - Concatenate arrays
   - Pass array as function arguments
   - Add elements easily

2. **Object Operations**
   - Copy objects (shallow)
   - Merge objects
   - Add/override properties
   - Clone with modifications

3. **Key Behaviors**
   - Creates shallow copies (nested objects are references!)
   - Later properties override earlier ones
   - Works with any iterable
   - Syntactically simple

4. **Common Use Cases**
   - Immutable updates
   - React state updates
   - Merging configurations
   - Function argument spreading

5. **Spread vs Rest**
   - Spread: **expands** into individual elements
   - Rest: **collects** individual elements into array

### Code Example

```javascript
// 1. ARRAY SPREADING - COPY

const original = [1, 2, 3];
const copy = [...original];

console.log(copy); // [1, 2, 3]
console.log(copy === original); // false (new array!)

copy.push(4);
console.log(original); // [1, 2, 3] (unchanged)
console.log(copy);     // [1, 2, 3, 4]

// 2. ARRAY SPREADING - CONCATENATE

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Traditional
const combined1 = arr1.concat(arr2);

// Spread
const combined2 = [...arr1, ...arr2];
console.log(combined2); // [1, 2, 3, 4, 5, 6]

// Add elements in between
const mixed = [0, ...arr1, 3.5, ...arr2, 7];
console.log(mixed); // [0, 1, 2, 3, 3.5, 4, 5, 6, 7]

// 3. ARRAY SPREADING - FUNCTION ARGUMENTS

function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];

// Traditional
sum.apply(null, numbers); // 6

// Spread
sum(...numbers); // 6

// With Math functions
const nums = [5, 2, 8, 1, 9];
console.log(Math.max(...nums)); // 9
console.log(Math.min(...nums)); // 1

// 4. OBJECT SPREADING - COPY

const user = { name: "Alice", age: 25 };
const userCopy = { ...user };

console.log(userCopy); // { name: "Alice", age: 25 }
console.log(userCopy === user); // false (new object!)

userCopy.age = 26;
console.log(user.age); // 25 (unchanged)

// 5. OBJECT SPREADING - MERGE

const defaults = { theme: "light", language: "en" };
const userSettings = { theme: "dark", notifications: true };

const settings = { ...defaults, ...userSettings };
console.log(settings);
// { theme: "dark", language: "en", notifications: true }
// userSettings.theme overrides defaults.theme

// 6. OBJECT SPREADING - ADD/OVERRIDE PROPERTIES

const user = { name: "Alice", age: 25 };

// Add property
const withEmail = { ...user, email: "alice@example.com" };

// Override property
const withNewAge = { ...user, age: 26 };

// Multiple changes
const updated = {
  ...user,
  age: 26,
  city: "Boston",
  isActive: true
};

// 7. SHALLOW COPY WARNING!

const original = {
  name: "Alice",
  address: {
    city: "Boston"
  }
};

const copy = { ...original };

// Top-level property: independent
copy.name = "Bob";
console.log(original.name); // "Alice" (unchanged)

// Nested object: SHARED REFERENCE!
copy.address.city = "NYC";
console.log(original.address.city); // "NYC" (changed!)

// Deep copy needed for nested objects
const deepCopy = {
  ...original,
  address: { ...original.address }
};

// 8. STRING SPREADING

const str = "hello";
const chars = [...str];
console.log(chars); // ["h", "e", "l", "l", "o"]

// Create array from string
const letters = [..."abc"];
console.log(letters); // ["a", "b", "c"]

// 9. SET AND MAP SPREADING

const set = new Set([1, 2, 3, 4, 5]);
const arr = [...set];
console.log(arr); // [1, 2, 3, 4, 5]

// Remove duplicates from array
const nums = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(nums)];
console.log(unique); // [1, 2, 3, 4]

// 10. REACT STATE UPDATES (IMMUTABLE PATTERN)

// Array state
const [items, setItems] = useState([1, 2, 3]);

// Add item
setItems([...items, 4]);

// Remove item
setItems(items.filter(item => item !== 2));

// Update item
setItems(items.map(item => item === 2 ? 20 : item));

// Object state
const [user, setUser] = useState({ name: "Alice", age: 25 });

// Update property
setUser({ ...user, age: 26 });

// Update nested property
setUser({
  ...user,
  address: {
    ...user.address,
    city: "NYC"
  }
});

// 11. FUNCTION DEFAULT PARAMETERS WITH SPREADING

function createUser(overrides = {}) {
  const defaults = {
    name: "Guest",
    age: 18,
    role: "user",
    active: true
  };

  return { ...defaults, ...overrides };
}

console.log(createUser());
// { name: "Guest", age: 18, role: "user", active: true }

console.log(createUser({ name: "Alice", role: "admin" }));
// { name: "Alice", age: 18, role: "admin", active: true }

// 12. COMBINING ARRAYS AND OBJECTS

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

// Add new user
const newUsers = [...users, { id: 3, name: "Charlie" }];

// Update user
const updatedUsers = users.map(user =>
  user.id === 2 ? { ...user, name: "Robert" } : user
);

// 13. SPREAD VS REST

// Spread: Expands array into individual elements
const nums = [1, 2, 3];
console.log(...nums); // 1 2 3 (three separate arguments)

// Rest: Collects individual elements into array
function sum(...numbers) { // rest parameter
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// 14. PRACTICAL - MERGING CONFIGURATIONS

const defaultConfig = {
  timeout: 5000,
  retries: 3,
  cache: true,
  headers: {
    "Content-Type": "application/json"
  }
};

const userConfig = {
  timeout: 10000,
  headers: {
    "Authorization": "Bearer token"
  }
};

// Naive merge (headers get completely replaced!)
const config1 = { ...defaultConfig, ...userConfig };
console.log(config1.headers);
// { Authorization: "Bearer token" }
// Lost Content-Type!

// Correct merge (deep merge headers)
const config2 = {
  ...defaultConfig,
  ...userConfig,
  headers: {
    ...defaultConfig.headers,
    ...userConfig.headers
  }
};
console.log(config2.headers);
// { "Content-Type": "application/json", "Authorization": "Bearer token" }
```

### Common Mistakes

- ❌ **Mistake:** Thinking spread creates deep copy
  ```javascript
  const original = { name: "Alice", address: { city: "Boston" } };
  const copy = { ...original };

  copy.address.city = "NYC";
  console.log(original.address.city); // "NYC" (changed!)
  ```

- ❌ **Mistake:** Wrong spread order
  ```javascript
  const defaults = { theme: "light" };
  const user = { theme: "dark" };

  // Wrong: defaults override user
  const settings = { ...user, ...defaults };
  // theme: "light" (wanted "dark"!)

  // Correct
  const settings = { ...defaults, ...user };
  // theme: "dark"
  ```

- ✅ **Correct:** Use spread for shallow copies and immutable updates
  ```javascript
  // Shallow copy is fine for primitives
  const newUser = { ...user, age: 26 };

  // Deep copy for nested objects
  const newConfig = {
    ...config,
    headers: { ...config.headers, newHeader: "value" }
  };
  ```

### Follow-up Questions

- "What is the difference between spread and rest operators?"
- "Does spread create a deep copy or shallow copy?"
- "How do you merge two objects with nested properties?"
- "Can you use spread with strings?"
- "What happens when spreading objects with duplicate keys?"

### Resources

- [MDN: Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript.info: Spread Operator](https://javascript.info/rest-parameters-spread#spread-syntax)

---

## Question 20: What are rest parameters in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain rest parameters (`...args`). How are they different from the `arguments` object?

### Answer

**Rest parameters** collect all remaining arguments into a real array using `...` syntax.

1. **What Rest Does**
   - Collects multiple arguments into array
   - Must be last parameter
   - Creates real Array (not array-like)
   - Named parameter (unlike arguments)

2. **Rest vs Arguments**
   - Rest is real array (has array methods)
   - Arguments is array-like object
   - Rest only collects remaining args
   - Arguments collects all args

3. **Common Use Cases**
   - Variable number of arguments
   - Wrapper functions
   - Flexible APIs
   - Collecting array elements

4. **Benefits**
   - Cleaner than arguments
   - Works with arrow functions
   - Real array (map, filter, reduce)
   - Better parameter names

5. **Limitations**
   - Must be last parameter
   - Can only have one rest parameter
   - Doesn't include named parameters

### Code Example

```javascript
// 1. BASIC REST PARAMETERS

function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum()); // 0 (empty array)

// 2. REST WITH NAMED PARAMETERS

function greet(greeting, ...names) {
  return `${greeting}, ${names.join(" and ")}!`;
}

console.log(greet("Hello", "Alice")); // "Hello, Alice!"
console.log(greet("Hi", "Bob", "Charlie")); // "Hi, Bob and Charlie!"
console.log(greet("Hey", "Alice", "Bob", "Charlie"));
// "Hey, Alice and Bob and Charlie!"

// 3. REST VS ARGUMENTS

// Old way: arguments object
function oldSum() {
  // arguments is array-like, not real array
  console.log(Array.isArray(arguments)); // false

  // Need to convert to array
  const args = Array.from(arguments);
  return args.reduce((total, num) => total + num, 0);
}

// Modern way: rest parameters
function modernSum(...numbers) {
  console.log(Array.isArray(numbers)); // true (real array!)
  return numbers.reduce((total, num) => total + num, 0);
}

// 4. REST MUST BE LAST

function example(first, ...rest, last) {
  // ❌ SyntaxError! Rest must be last parameter
}

function correct(first, second, ...rest) {
  // ✅ OK
  console.log(first);  // First arg
  console.log(second); // Second arg
  console.log(rest);   // Array of remaining args
}

correct(1, 2, 3, 4, 5);
// first: 1
// second: 2
// rest: [3, 4, 5]

// 5. REST IN ARROW FUNCTIONS

// ❌ arguments doesn't work in arrow functions
const arrowSum1 = () => {
  return arguments.reduce((a, b) => a + b); // ReferenceError!
};

// ✅ Rest parameters work perfectly
const arrowSum2 = (...numbers) => {
  return numbers.reduce((a, b) => a + b, 0);
};

console.log(arrowSum2(1, 2, 3, 4)); // 10

// 6. WRAPPER FUNCTIONS

function logAndExecute(fn, ...args) {
  console.log(`Calling function with args:`, args);
  return fn(...args); // Spread args back out
}

function add(a, b) {
  return a + b;
}

console.log(logAndExecute(add, 5, 3));
// Calling function with args: [5, 3]
// 8

// 7. ARRAY METHODS WITH REST

function findMax(...numbers) {
  return Math.max(...numbers);
}

function average(...numbers) {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function sortNumbers(...numbers) {
  return numbers.sort((a, b) => a - b);
}

console.log(findMax(5, 2, 9, 1)); // 9
console.log(average(1, 2, 3, 4)); // 2.5
console.log(sortNumbers(5, 2, 9, 1)); // [1, 2, 5, 9]

// 8. REST IN DESTRUCTURING

const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

const { name, age, ...otherProps } = {
  name: "Alice",
  age: 25,
  city: "Boston",
  email: "alice@example.com"
};

console.log(name);  // "Alice"
console.log(age);   // 25
console.log(otherProps); // { city: "Boston", email: "alice@example.com" }

// 9. PRACTICAL - FLEXIBLE API

class Calculator {
  add(...numbers) {
    return numbers.reduce((sum, n) => sum + n, 0);
  }

  multiply(...numbers) {
    return numbers.reduce((product, n) => product * n, 1);
  }
}

const calc = new Calculator();
console.log(calc.add(1, 2));           // 3
console.log(calc.add(1, 2, 3, 4, 5));  // 15
console.log(calc.multiply(2, 3, 4));   // 24

// 10. REST WITH DEFAULTS

function createUser(name, role = "user", ...permissions) {
  return {
    name,
    role,
    permissions
  };
}

console.log(createUser("Alice"));
// { name: "Alice", role: "user", permissions: [] }

console.log(createUser("Bob", "admin", "read", "write", "delete"));
// { name: "Bob", role: "admin", permissions: ["read", "write", "delete"] }
```

### Common Mistakes

- ❌ **Mistake:** Rest not last parameter
  ```javascript
  function wrong(...rest, last) { } // SyntaxError!
  ```

- ❌ **Mistake:** Multiple rest parameters
  ```javascript
  function wrong(...args1, ...args2) { } // SyntaxError!
  ```

- ✅ **Correct:** Rest as last parameter, spread when calling
  ```javascript
  function collect(first, ...rest) {
    // rest collects remaining args into array
  }

  function spread(a, b, c) {
    // ...
  }

  const args = [1, 2, 3];
  spread(...args); // spread expands array into args
  ```

### Follow-up Questions

- "What is the difference between rest parameters and the arguments object?"
- "Can you use rest parameters in arrow functions?"
- "Can rest parameters be combined with default parameters?"
- "What is the difference between rest and spread operators?"

### Resources

- [MDN: Rest Parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- [JavaScript.info: Rest Parameters](https://javascript.info/rest-parameters-spread)

---

## Question 21: What are default parameters in JavaScript?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain default parameters. How do they work and when should you use them?

### Answer

**Default parameters** allow named parameters to have default values if no value or `undefined` is passed.

1. **Basic Behavior**
   - Triggered by `undefined` (not by `null`!)
   - Evaluated at call time (not define time)
   - Can reference earlier parameters
   - Can be any expression

2. **vs Old Pattern**
   - Old: `value = value || default` (problematic with 0, false, "")
   - New: `function(value = default)` (only undefined triggers)

3. **Common Use Cases**
   - Optional function parameters
   - Configuration objects
   - API default values
   - Fallback values

### Code Example

```javascript
// 1. BASIC DEFAULT PARAMETERS
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greet());                    // "Hello, Guest!"
console.log(greet("Alice"));             // "Hello, Alice!"
console.log(greet("Bob", "Hi"));         // "Hi, Bob!"
console.log(greet(undefined, "Hey"));    // "Hey, Guest!"

// 2. UNDEFINED VS NULL
function test(value = "default") {
  console.log(value);
}

test();        // "default" (undefined triggers default)
test(undefined); // "default" (explicitly passing undefined)
test(null);    // null (null does NOT trigger default!)
test(0);       // 0 (0 does NOT trigger default)
test(false);   // false (false does NOT trigger default)
test("");      // "" (empty string does NOT trigger default)

// 3. OLD WAY VS NEW WAY
// ❌ Old problematic way
function oldWay(value) {
  value = value || "default"; // Problem: replaces 0, false, ""
  console.log(value);
}

oldWay(0);     // "default" (wanted 0!)
oldWay(false); // "default" (wanted false!)

// ✅ New correct way
function newWay(value = "default") {
  console.log(value);
}

newWay(0);     // 0 (correct!)
newWay(false); // false (correct!)

// 4. DEFAULT PARAMETERS WITH DESTRUCTURING
function createUser({ name = "Guest", age = 18, role = "user" } = {}) {
  return { name, age, role };
}

console.log(createUser());                          // { name: "Guest", age: 18, role: "user" }
console.log(createUser({ name: "Alice" }));         // { name: "Alice", age: 18, role: "user" }
console.log(createUser({ name: "Bob", age: 25 })); // { name: "Bob", age: 25, role: "user" }

// 5. REFERENCING EARLIER PARAMETERS
function makeArray(length = 10, value = length * 2) {
  return Array(length).fill(value);
}

console.log(makeArray(3));    // [6, 6, 6] (value defaults to length * 2)
console.log(makeArray(3, 10)); // [10, 10, 10]

// ❌ Can't reference later parameters
function wrong(a = b, b = 2) {
  // ReferenceError: Cannot access 'b' before initialization
}

// 6. FUNCTION CALL AS DEFAULT
function getDefaultName() {
  console.log("getDefaultName called");
  return "Guest";
}

function greet(name = getDefaultName()) {
  console.log(`Hello, ${name}!`);
}

greet("Alice");  // Doesn't call getDefaultName
greet();         // Calls getDefaultName, logs "Hello, Guest!"

// 7. REQUIRED PARAMETERS PATTERN
function required(paramName) {
  throw new Error(`Parameter ${paramName} is required`);
}

function createUser(name = required('name'), email = required('email')) {
  return { name, email };
}

// createUser(); // Error: Parameter name is required
createUser("Alice", "alice@example.com"); // OK
```

### Common Mistakes

- ❌ **Mistake:** Expecting null to trigger default
  ```javascript
  function test(value = "default") {
    console.log(value);
  }
  test(null); // null (not "default"!)
  ```

- ✅ **Correct:** Only undefined triggers defaults
  ```javascript
  function test(value = "default") {
    console.log(value);
  }
  test();         // "default"
  test(undefined); // "default"
  test(null);     // null
  ```

### Resources

- [MDN: Default Parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)

---

## Question 22: What are template literals in JavaScript?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain template literals (template strings). What are their advantages?

### Answer

**Template literals** are string literals allowing embedded expressions, multi-line strings, and string interpolation using backticks (\`).

1. **Features**
   - String interpolation with `${expression}`
   - Multi-line strings (no \n needed)
   - Expression evaluation
   - Tagged templates (advanced)

2. **Advantages**
   - Cleaner string concatenation
   - No escape characters for quotes
   - Embedded expressions
   - Better readability

### Code Example

```javascript
// 1. STRING INTERPOLATION
const name = "Alice";
const age = 25;

// Old way
const greeting1 = "Hello, " + name + "! You are " + age + " years old.";

// Template literal way
const greeting2 = `Hello, ${name}! You are ${age} years old.`;

// 2. EXPRESSIONS
const a = 5;
const b = 10;

console.log(`Sum: ${a + b}`);        // "Sum: 15"
console.log(`Product: ${a * b}`);    // "Product: 50"
console.log(`Comparison: ${a < b}`); // "Comparison: true"

// 3. MULTI-LINE STRINGS
// Old way
const html1 = "<div>\n" +
              "  <h1>Title</h1>\n" +
              "  <p>Content</p>\n" +
              "</div>";

// Template literal way
const html2 = `<div>
  <h1>Title</h1>
  <p>Content</p>
</div>`;

// 4. FUNCTION CALLS
function getGreeting(time) {
  return time < 12 ? "Good morning" : "Good afternoon";
}

const time = 10;
console.log(`${getGreeting(time)}, Alice!`); // "Good morning, Alice!"

// 5. NESTED TEMPLATES
const user = { name: "Alice", isAdmin: true };
const message = `User: ${user.name} (${user.isAdmin ? "Admin" : "User"})`;

// 6. TAGGED TEMPLATES (ADVANCED)
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return `${result}${str}<strong>${values[i] || ""}</strong>`;
  }, "");
}

const name = "Alice";
const score = 95;
const result = highlight`${name} scored ${score} points`;
// "<strong>Alice</strong> scored <strong>95</strong> points"
```

### Resources

- [MDN: Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

---

## Question 23: What is Symbol in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta

### Question
Explain the Symbol primitive type. When would you use it?

### Answer

**Symbol** is a unique, immutable primitive type used as object property keys. Each Symbol is guaranteed to be unique.

1. **Characteristics**
   - Every Symbol is unique
   - Immutable
   - Can be used as object keys
   - Not enumerable in for...in loops
   - Not serialized by JSON.stringify

2. **Use Cases**
   - Private object properties
   - Avoiding property name collisions
   - Defining object metadata
   - Well-known symbols (Symbol.iterator, etc.)

### Code Example

```javascript
// 1. CREATING SYMBOLS
const sym1 = Symbol();
const sym2 = Symbol();

console.log(sym1 === sym2); // false (each is unique!)

const sym3 = Symbol("description");
const sym4 = Symbol("description");
console.log(sym3 === sym4); // false (still unique despite same description!)

// 2. SYMBOL AS OBJECT KEY
const id = Symbol("id");
const user = {
  name: "Alice",
  [id]: 12345  // Symbol as property key
};

console.log(user[id]);  // 12345
console.log(user.id);   // undefined (not the same as string "id")

// 3. SYMBOLS ARE NOT ENUMERABLE
const secret = Symbol("secret");
const obj = {
  name: "Alice",
  age: 25,
  [secret]: "hidden value"
};

// Symbols hidden from normal enumeration
console.log(Object.keys(obj));        // ["name", "age"]
console.log(JSON.stringify(obj));     // {"name":"Alice","age":25}

// But can be accessed if you have the symbol
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(secret)]

// 4. GLOBAL SYMBOL REGISTRY
const globalSym1 = Symbol.for("app.id");
const globalSym2 = Symbol.for("app.id");

console.log(globalSym1 === globalSym2); // true (same symbol!)

console.log(Symbol.keyFor(globalSym1)); // "app.id"

// 5. WELL-KNOWN SYMBOLS
const iterableObj = {
  items: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => ({
        value: this.items[index++],
        done: index > this.items.length
      })
    };
  }
};

for (const item of iterableObj) {
  console.log(item); // 1, 2, 3
}
```

### Resources

- [MDN: Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

---

## Question 24: What is BigInt in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta

### Question
Explain BigInt. When would you use it instead of Number?

### Answer

**BigInt** is a numeric primitive for representing integers larger than 2^53 - 1 (Number.MAX_SAFE_INTEGER).

1. **Characteristics**
   - Can represent arbitrarily large integers
   - Created with `n` suffix or `BigInt()` function
   - Cannot mix with Number in operations
   - No decimal/fractional values

2. **Use Cases**
   - Large integer calculations
   - Cryptography
   - High-precision timestamps
   - Database IDs

### Code Example

```javascript
// 1. CREATING BIGINTS
const bigInt1 = 1234567890123456789012345678901234567890n;
const bigInt2 = BigInt("1234567890123456789012345678901234567890");

console.log(typeof bigInt1); // "bigint"

// 2. NUMBER LIMITATIONS
console.log(Number.MAX_SAFE_INTEGER);      // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER + 1);  // 9007199254740992
console.log(Number.MAX_SAFE_INTEGER + 2);  // 9007199254740992 (wrong!)

// 3. BIGINT SOLVES THIS
const bigNum1 = 9007199254740991n;
const bigNum2 = bigNum1 + 1n;
const bigNum3 = bigNum1 + 2n;

console.log(bigNum2); // 9007199254740992n (correct!)
console.log(bigNum3); // 9007199254740993n (correct!)

// 4. OPERATIONS
const a = 10n;
const b = 20n;

console.log(a + b);  // 30n
console.log(a * b);  // 200n
console.log(a - b);  // -10n
console.log(b / a);  // 2n (integer division!)

// 5. CANNOT MIX WITH NUMBER
const num = 10;
const big = 20n;

// console.log(num + big); // TypeError!

// Must convert:
console.log(BigInt(num) + big);  // 30n
console.log(num + Number(big));  // 30

// 6. COMPARISONS
console.log(10n === 10);   // false (different types)
console.log(10n == 10);    // true (type coercion)
console.log(10n < 20);     // true (works across types)
```

### Resources

- [MDN: BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

---

## Question 25: What is strict mode in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain strict mode (`"use strict"`). What does it do and why use it?

### Answer

**Strict mode** is an opt-in mode that enforces stricter parsing and error handling.

1. **What It Does**
   - Eliminates silent errors (throws instead)
   - Fixes mistakes that make optimization difficult
   - Prohibits problematic syntax
   - Disallows future reserved words

2. **Key Changes**
   - No implicit global variables
   - `this` is `undefined` in functions (not global)
   - No duplicate parameters
   - No octal literals
   - Can't delete undeletable properties

3. **How to Enable**
   - File/script level: `"use strict";` at top
   - Function level: `"use strict";` in function
   - Modules: Always strict (no need to declare)

### Code Example

```javascript
// 1. ENABLE STRICT MODE
"use strict";

// Now all code runs in strict mode

// 2. NO IMPLICIT GLOBALS
// ❌ Without strict mode
function sloppy() {
  x = 10; // Creates global variable (bad!)
}

// ✅ With strict mode
function strict() {
  "use strict";
  y = 10; // ReferenceError: y is not defined
}

// 3. THIS IN FUNCTIONS
function showThis() {
  "use strict";
  console.log(this); // undefined in strict mode
  // (window in non-strict)
}

showThis();

// 4. NO DUPLICATE PARAMETERS
// ❌ Allowed in non-strict
function duplicate(a, a, b) {
  return a + b; // Which 'a'?
}

// ✅ Error in strict mode
function duplicateStrict(a, a, b) {
  "use strict";
  // SyntaxError: Duplicate parameter name
}

// 5. CAN'T DELETE UNDELETABLE
"use strict";

delete Object.prototype; // TypeError (can't delete)

var x = 10;
delete x; // SyntaxError (can't delete variables)

// 6. NO OCTAL LITERALS
"use strict";

const num = 0o10; // ✅ OK (ES6 syntax)
const bad = 010;  // ❌ SyntaxError (old octal syntax)

// 7. MODULES ARE ALWAYS STRICT
// No need for "use strict" in modules
export function myFunction() {
  // Already in strict mode!
  x = 10; // ReferenceError
}
```

### Resources

- [MDN: Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)

---

## Question 26: Arrow Functions vs Regular Functions - What's the difference?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
What are the differences between arrow functions and regular functions?

### Answer

**Arrow functions** have different `this` binding, no `arguments`, cannot be constructors, and have concise syntax.

1. **Key Differences**
   - Lexical `this` (doesn't bind own `this`)
   - No `arguments` object
   - Cannot be used as constructors
   - No `prototype` property
   - Cannot be generators

2. **When to Use Arrow**
   - Callbacks and higher-order functions
   - Methods that don't need own `this`
   - Preserving outer `this` context

3. **When NOT to Use Arrow**
   - Object methods that need `this`
   - Event handlers that need `this`
   - Functions needing `arguments`
   - Constructor functions

### Code Example

```javascript
// 1. THIS BINDING
const obj = {
  name: "Alice",

  // Regular function: own 'this'
  regularMethod() {
    console.log(this.name); // "Alice"
  },

  // Arrow function: lexical 'this' (from surrounding scope)
  arrowMethod: () => {
    console.log(this.name); // undefined (this from outer scope)
  }
};

// 2. CALLBACKS
const numbers = [1, 2, 3];

// Regular function
numbers.map(function(n) {
  return n * 2;
});

// Arrow function (concise!)
numbers.map(n => n * 2);

// 3. ARGUMENTS OBJECT
function regularFunc() {
  console.log(arguments); // [1, 2, 3]
}

const arrowFunc = () => {
  console.log(arguments); // ReferenceError!
};

regularFunc(1, 2, 3);

// 4. CONSTRUCTOR
function RegularFunc() {
  this.value = 42;
}

const ArrowFunc = () => {
  this.value = 42;
};

new RegularFunc(); // OK
// new ArrowFunc(); // TypeError!

// 5. PRACTICAL - REACT COMPONENT
class Component {
  state = { count: 0 };

  // ❌ Regular method loses 'this' when passed as callback
  regularIncrement() {
    this.setState({ count: this.state.count + 1 });
  }

  // ✅ Arrow function preserves 'this'
  arrowIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <button onClick={this.arrowIncrement}>+</button>
    );
  }
}
```

### Resources

- [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

---

## Question 27: How does error handling work with try-catch-finally?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain try-catch-finally blocks. How do you handle errors in JavaScript?

### Answer

**try-catch-finally** provides structured error handling in JavaScript.

1. **Structure**
   - `try`: Code that might throw error
   - `catch`: Handle the error
   - `finally`: Always executes (optional)
   - Can throw custom errors

2. **Error Types**
   - `Error`: Generic error
   - `TypeError`: Wrong type
   - `ReferenceError`: Undefined variable
   - `SyntaxError`: Parse error
   - Custom errors

### Code Example

```javascript
// 1. BASIC TRY-CATCH
try {
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error("Error occurred:", error.message);
}

// 2. TRY-CATCH-FINALLY
try {
  console.log("Trying...");
  throw new Error("Something went wrong!");
} catch (error) {
  console.log("Caught:", error.message);
} finally {
  console.log("This always runs!");
}

// 3. THROWING CUSTOM ERRORS
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero!");
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.log(error.message); // "Cannot divide by zero!"
}

// 4. CUSTOM ERROR CLASS
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateAge(age) {
  if (age < 0) {
    throw new ValidationError("Age cannot be negative");
  }
}

try {
  validateAge(-5);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation failed:", error.message);
  }
}

// 5. ASYNC ERROR HANDLING
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error; // Re-throw if needed
  } finally {
    console.log("Fetch attempt completed");
  }
}
```

### Resources

- [MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

---

## Question 28: What are Object.keys(), Object.values(), and Object.entries()?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain these Object methods and when you'd use each.

### Answer

These methods extract keys, values, or key-value pairs from objects.

1. **Object.keys(obj)**
   - Returns array of object's own property names
   - Only enumerable properties
   - Same order as for...in loop

2. **Object.values(obj)**
   - Returns array of object's own property values

3. **Object.entries(obj)**
   - Returns array of [key, value] pairs
   - Useful for Object destructuring

### Code Example

```javascript
const user = {
  name: "Alice",
  age: 25,
  city: "Boston"
};

// 1. Object.keys()
console.log(Object.keys(user)); // ["name", "age", "city"]

// 2. Object.values()
console.log(Object.values(user)); // ["Alice", 25, "Boston"]

// 3. Object.entries()
console.log(Object.entries(user));
// [["name", "Alice"], ["age", 25], ["city", "Boston"]]

// 4. ITERATING OVER OBJECTS
Object.keys(user).forEach(key => {
  console.log(`${key}: ${user[key]}`);
});

// With entries (cleaner)
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// 5. CONVERTING OBJECT TO MAP
const map = new Map(Object.entries(user));

// 6. FILTERING OBJECT
const filtered = Object.fromEntries(
  Object.entries(user).filter(([key, value]) => typeof value === 'string')
);
// { name: "Alice", city: "Boston" }
```

### Resources

- [MDN: Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

---

## Question 29: What are find(), some(), and every() array methods?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐
**Time:** 5 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain these array methods and their differences.

### Answer

These methods search arrays but return different things.

1. **find()**
   - Returns **first element** that matches
   - Returns `undefined` if not found

2. **some()**
   - Returns **boolean** - true if ANY element matches
   - Short-circuits on first match

3. **every()**
   - Returns **boolean** - true if ALL elements match
   - Short-circuits on first non-match

### Code Example

```javascript
const numbers = [1, 2, 3, 4, 5];

// 1. find() - returns first match
const firstEven = numbers.find(n => n % 2 === 0);
console.log(firstEven); // 2

const notFound = numbers.find(n => n > 10);
console.log(notFound); // undefined

// 2. some() - returns boolean (ANY)
const hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven); // true

const hasNegative = numbers.some(n => n < 0);
console.log(hasNegative); // false

// 3. every() - returns boolean (ALL)
const allPositive = numbers.every(n => n > 0);
console.log(allPositive); // true

const allEven = numbers.every(n => n % 2 === 0);
console.log(allEven); // false

// 4. PRACTICAL EXAMPLES
const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 17, active: true },
  { name: "Charlie", age: 30, active: false }
];

// Find first adult
const firstAdult = users.find(u => u.age >= 18);
console.log(firstAdult.name); // "Alice"

// Check if any user is inactive
const hasInactive = users.some(u => !u.active);
console.log(hasInactive); // true

// Check if all users are adults
const allAdults = users.every(u => u.age >= 18);
console.log(allAdults); // false
```

### Resources

- [MDN: Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

---

## Question 30: How does the 'this' keyword work in JavaScript?

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Apple

### Question
Explain how `this` works in different contexts. What determines its value?

### Answer

**`this`** refers to the object that is executing the current function. Its value depends on HOW the function is called.

1. **Rules for `this`**
   - Default: global object (or undefined in strict mode)
   - Method call: object before the dot
   - Constructor: new object being created
   - Arrow function: lexical `this` from enclosing scope
   - Explicit: call/apply/bind

2. **Common Pitfalls**
   - Losing `this` when passing methods as callbacks
   - Arrow functions don't have own `this`
   - Event handlers set `this` to element

### Code Example

```javascript
// 1. GLOBAL CONTEXT
console.log(this); // window (browser) or global (Node)

function globalFunc() {
  console.log(this); // window (or undefined in strict mode)
}

// 2. METHOD CALL
const obj = {
  name: "Alice",
  greet() {
    console.log(this.name); // "Alice" (this = obj)
  }
};

obj.greet(); // this = obj

// 3. LOST THIS
const greet = obj.greet;
greet(); // undefined (this = global/undefined)

// 4. CONSTRUCTOR
function Person(name) {
  this.name = name; // this = new object
}

const alice = new Person("Alice");
console.log(alice.name); // "Alice"

// 5. ARROW FUNCTIONS
const obj2 = {
  name: "Bob",
  greet: () => {
    console.log(this.name); // undefined (lexical this from outer scope)
  },
  greetNormal() {
    const inner = () => {
      console.log(this.name); // "Bob" (arrow function inherits this)
    };
    inner();
  }
};

// 6. EXPLICIT BINDING
function greet() {
  console.log(`Hello, ${this.name}!`);
}

const user = { name: "Alice" };

greet.call(user);   // "Hello, Alice!"
greet.apply(user);  // "Hello, Alice!"

const boundGreet = greet.bind(user);
boundGreet();       // "Hello, Alice!"

// 7. EVENT HANDLERS
button.addEventListener('click', function() {
  console.log(this); // button element
});

button.addEventListener('click', () => {
  console.log(this); // lexical this (not button!)
});

// 8. CLASS METHODS
class Component {
  name = "MyComponent";

  regularMethod() {
    console.log(this.name); // Loses 'this' when passed as callback
  }

  arrowMethod = () => {
    console.log(this.name); // Preserves 'this'
  };
}

const comp = new Component();
setTimeout(comp.regularMethod, 100); // undefined
setTimeout(comp.arrowMethod, 100);   // "MyComponent"
```

### Resources

- [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [JavaScript.info: Object methods, "this"](https://javascript.info/object-methods)

---

[← Back to JavaScript README](./README.md) | [Next: Async JavaScript →](./02-async-javascript.md)

**Progress:** 30 of 30 core concept questions completed ✅

## Summary

This file covers 30 essential JavaScript core concepts:

**Basics (Q1-Q10):**
- Primitive & reference types
- var/let/const
- Hoisting
- Closures
- TDZ
- Lexical & block scope
- Variable shadowing
- Higher-order functions
- Pure functions
- Memoization

**Comparisons & Types (Q11-Q14):**
- == vs ===
- null vs undefined
- typeof vs instanceof
- Truthy & falsy values

**Modern Features (Q15-Q22):**
- Short-circuit evaluation
- Optional chaining (?.)
- Nullish coalescing (??)
- Destructuring
- Spread operator
- Rest parameters
- Default parameters
- Template literals

**Advanced Types (Q23-Q25):**
- Symbol
- BigInt
- Strict mode

**Functions & Context (Q26-Q30):**
- Arrow vs regular functions
- Error handling (try-catch)
- Object methods (keys/values/entries)
- Array search methods (find/some/every)
- this keyword

**Total:** 30/30 questions (100% complete!)
