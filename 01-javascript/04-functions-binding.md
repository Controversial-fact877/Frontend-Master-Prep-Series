# JavaScript Functions, `this` Binding, and Context

> Comprehensive guide to function types, `this` keyword behavior, call/apply/bind methods, arrow functions, and function invocation patterns.

---

## Question 1: What is the `this` Keyword in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Netflix

### Question
Explain what `this` keyword is in JavaScript and how its value is determined.

### Answer

`this` is a special keyword that refers to the **execution context** in which a function is called. Its value is determined at **runtime** based on **how** the function is invoked, not where it's defined.

**Four Rules for `this` Binding (in order of precedence):**

1. **`new` Binding** → new object
2. **Explicit Binding** (call/apply/bind) → specified object
3. **Implicit Binding** → object before dot
4. **Default Binding** → global object (or undefined in strict mode)

### Code Example

```javascript
// Rule 1: Default Binding (no context)
function showThis() {
  console.log(this);
}

showThis(); // Window (browser) or global (Node.js)

"use strict";
function strictThis() {
  console.log(this);
}
strictThis(); // undefined (strict mode)

/*
DEFAULT BINDING:
- Function called without any context
- this → global object (non-strict)
- this → undefined (strict mode)
*/
```

```javascript
// Rule 2: Implicit Binding (object method)
const person = {
  name: "John",
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

person.greet(); // "Hello, I'm John"
// this → person (object before dot)

const greetFunc = person.greet;
greetFunc(); // "Hello, I'm undefined"
// this → global (lost implicit binding)

/*
IMPLICIT BINDING:
- Method called on an object
- this → that object
- Binding lost if function reference extracted
*/
```

```javascript
// Rule 3: Explicit Binding (call/apply/bind)
function introduce(age, city) {
  console.log(`I'm ${this.name}, ${age} years old, from ${city}`);
}

const user = { name: "Alice" };

introduce.call(user, 25, "NYC");
// I'm Alice, 25 years old, from NYC

introduce.apply(user, [25, "NYC"]);
// Same output (apply takes array)

const boundIntroduce = introduce.bind(user, 25);
boundIntroduce("NYC");
// I'm Alice, 25 years old, from NYC

/*
EXPLICIT BINDING:
- Manually set this with call/apply/bind
- call: arguments passed individually
- apply: arguments passed as array
- bind: returns new function with fixed this
*/
```

```javascript
// Rule 4: new Binding (constructor)
function Person(name) {
  this.name = name;
  this.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const john = new Person("John");
john.greet(); // "Hello, I'm John"

/*
NEW BINDING:
- new creates empty object
- this → new object
- Object returned automatically
*/
```

**Arrow Functions (Special Case):**

```javascript
// Arrow functions don't have their own this
// They inherit this from enclosing scope (lexical this)

const obj = {
  name: "Object",

  regularMethod() {
    console.log(this.name); // "Object"

    setTimeout(function() {
      console.log(this.name); // undefined (setTimeout changes this)
    }, 100);

    setTimeout(() => {
      console.log(this.name); // "Object" (arrow function inherits this)
    }, 100);
  }
};

obj.regularMethod();

/*
ARROW FUNCTION this:
- No own this binding
- Lexically inherits from parent scope
- Cannot be changed with call/apply/bind
- Cannot be used as constructor
*/
```

### Common Mistakes

❌ **Wrong**: Extracting method loses context
```javascript
const obj = {
  value: 42,
  getValue() {
    return this.value;
  }
};

const getValue = obj.getValue;
console.log(getValue()); // undefined (lost this)
```

✅ **Correct**: Bind context when extracting
```javascript
const getValue = obj.getValue.bind(obj);
console.log(getValue()); // 42

// Or use arrow function wrapper
const getValue2 = () => obj.getValue();
console.log(getValue2()); // 42
```

❌ **Wrong**: Using arrow function as method
```javascript
const obj = {
  value: 42,
  getValue: () => this.value  // ❌ this is from outer scope
};

console.log(obj.getValue()); // undefined
```

✅ **Correct**: Use regular function for methods
```javascript
const obj = {
  value: 42,
  getValue() {
    return this.value;  // ✅ this → obj
  }
};

console.log(obj.getValue()); // 42
```

### Follow-up Questions
1. "What happens to `this` in nested functions?"
2. "How do arrow functions determine their `this`?"
3. "Can you change `this` binding in arrow functions?"
4. "What is the precedence order for `this` binding rules?"

### Resources
- [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [Understanding JavaScript `this` Keyword](https://www.javascripttutorial.net/javascript-this/)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/README.md)

---

## Question 2: Explain Implicit, Explicit, and Default Binding

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Uber

### Question
Explain the different types of `this` binding in JavaScript with examples of each.

### Answer

### **1. Default Binding**

Applied when no other rule matches. `this` refers to global object (or `undefined` in strict mode).

```javascript
function defaultBinding() {
  console.log(this === window); // true (browser, non-strict)
}

defaultBinding();

// Strict mode
"use strict";
function strictDefault() {
  console.log(this); // undefined
}

strictDefault();

/*
DEFAULT BINDING RULES:
- Standalone function call
- No object context
- Non-strict: this → global
- Strict: this → undefined
*/
```

### **2. Implicit Binding**

When function is called as a method of an object. `this` → that object.

```javascript
const calculator = {
  value: 0,

  add(num) {
    this.value += num;
    return this;
  },

  subtract(num) {
    this.value -= num;
    return this;
  },

  getValue() {
    return this.value;
  }
};

calculator.add(10).subtract(3);
console.log(calculator.getValue()); // 7

/*
IMPLICIT BINDING:
- Method called on object: obj.method()
- this → obj (object before dot)
- Can be chained (return this pattern)
*/
```

**Losing Implicit Binding:**

```javascript
const obj = {
  name: "Object",
  greet() {
    console.log(`Hello from ${this.name}`);
  }
};

// Case 1: Method reference
obj.greet(); // "Hello from Object" ✅

const greet = obj.greet;
greet(); // "Hello from undefined" ❌ (lost context)

// Case 2: Callback
setTimeout(obj.greet, 100); // "Hello from undefined" ❌

// Case 3: Passing to function
function execute(fn) {
  fn();
}
execute(obj.greet); // "Hello from undefined" ❌

/*
IMPLICIT BINDING LOST WHEN:
- Method assigned to variable
- Passed as callback
- Passed to another function

Solution: Use .bind() or arrow function wrapper
*/
```

### **3. Explicit Binding**

Manually specify `this` using `call()`, `apply()`, or `bind()`.

#### **call()** - Arguments passed individually

```javascript
function introduce(age, city) {
  console.log(`I'm ${this.name}, ${age}, from ${city}`);
}

const person1 = { name: "Alice" };
const person2 = { name: "Bob" };

introduce.call(person1, 25, "NYC");
// I'm Alice, 25, from NYC

introduce.call(person2, 30, "LA");
// I'm Bob, 30, from LA

/*
CALL SYNTAX:
func.call(thisArg, arg1, arg2, ...)
- First argument: thisArg (what this should be)
- Rest arguments: function arguments
*/
```

#### **apply()** - Arguments passed as array

```javascript
function sum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}

const context = { multiplier: 2 };

const args = [1, 2, 3, 4, 5];

const result = sum.apply(context, args);
console.log(result); // 15

// Modern alternative with spread
const result2 = sum.call(context, ...args);
console.log(result2); // 15

/*
APPLY SYNTAX:
func.apply(thisArg, [argsArray])
- First argument: thisArg
- Second argument: array of arguments

USE CASE: When you have arguments as array
*/
```

**Practical Example: Array-like to Array**

```javascript
function convertToArray() {
  // arguments is array-like, not real array
  return Array.prototype.slice.call(arguments);
}

const arr = convertToArray(1, 2, 3, 4);
console.log(Array.isArray(arr)); // true

// Modern way:
const arr2 = Array.from(arguments);
const arr3 = [...arguments];
```

#### **bind()** - Returns new function with fixed `this`

```javascript
const person = {
  firstName: "John",
  lastName: "Doe",

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
};

// Lose context
const getFullName = person.getFullName;
console.log(getFullName()); // "undefined undefined"

// Fix with bind
const boundGetFullName = person.getFullName.bind(person);
console.log(boundGetFullName()); // "John Doe"

// Use in callbacks
setTimeout(person.getFullName.bind(person), 100);
// "John Doe" ✅

/*
BIND SYNTAX:
const newFunc = func.bind(thisArg, arg1, arg2, ...)

KEY DIFFERENCES from call/apply:
- Returns new function (doesn't invoke immediately)
- Can preset arguments (partial application)
- Permanent binding (can't be changed)
*/
```

**Partial Application with bind:**

```javascript
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

/*
PARTIAL APPLICATION:
- Preset some arguments
- Returns function expecting remaining args
- null used when this doesn't matter
*/
```

### **4. Hard Binding Pattern**

```javascript
function hardBind(fn, obj) {
  return function(...args) {
    return fn.apply(obj, args);
  };
}

const obj = { value: 42 };

function getValue() {
  return this.value;
}

const bound = hardBind(getValue, obj);

// Cannot lose binding
console.log(bound()); // 42
console.log(bound.call(window)); // 42 (still bound!)

// This is essentially what .bind() does internally
```

### Common Mistakes

❌ **Wrong**: Thinking bind invokes function
```javascript
const obj = { name: "Test" };

function greet() {
  console.log(this.name);
}

obj.greet = greet.bind(obj); // Returns new function
// Need to call it:
obj.greet(); // "Test"
```

✅ **Correct**: Bind returns new function
```javascript
const boundGreet = greet.bind(obj);
boundGreet(); // "Test"
```

❌ **Wrong**: Re-binding bound function
```javascript
const obj1 = { name: "First" };
const obj2 = { name: "Second" };

function greet() {
  console.log(this.name);
}

const bound1 = greet.bind(obj1);
const bound2 = bound1.bind(obj2); // Doesn't work!

bound2(); // "First" (not "Second")
// First binding is permanent!
```

### Follow-up Questions
1. "When would you use call vs apply vs bind?"
2. "Can you chain bind calls?"
3. "How does explicit binding interact with arrow functions?"
4. "What's the performance difference between the three methods?"

### Resources
- [MDN: Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [MDN: Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

---

## Question 3: How Does `this` Work in Arrow Functions?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon, Netflix, Airbnb

### Question
Explain how `this` binding works in arrow functions and how it differs from regular functions.

### Answer

Arrow functions **do not have their own `this`**. They inherit `this` from the enclosing **lexical scope** at the time they are **defined** (not called).

**Key Differences:**

| Feature | Regular Function | Arrow Function |
|---------|-----------------|----------------|
| Own `this` | ✅ Yes | ❌ No |
| `this` determination | Runtime (how called) | Compile time (where defined) |
| Can use `call/apply/bind` | ✅ Yes | ❌ No effect on `this` |
| Can be constructor | ✅ Yes | ❌ No |
| Has `arguments` | ✅ Yes | ❌ No |

### Code Example

**Problem: Regular Function in Callback**

```javascript
const obj = {
  name: "Object",
  numbers: [1, 2, 3],

  printNumbers() {
    this.numbers.forEach(function(num) {
      // ❌ this is undefined (or global in non-strict)
      console.log(`${this.name}: ${num}`);
    });
  }
};

obj.printNumbers();
// Output: "undefined: 1", "undefined: 2", "undefined: 3"

/*
PROBLEM:
- forEach callback is regular function
- Called without context
- this → global/undefined (lost obj context)
*/
```

**Solution 1: Arrow Function**

```javascript
const obj = {
  name: "Object",
  numbers: [1, 2, 3],

  printNumbers() {
    this.numbers.forEach(num => {
      // ✅ Arrow function inherits this from printNumbers
      console.log(`${this.name}: ${num}`);
    });
  }
};

obj.printNumbers();
// Output: "Object: 1", "Object: 2", "Object: 3"

/*
SOLUTION:
- Arrow function has no own this
- Inherits this from printNumbers method
- printNumbers this → obj (implicit binding)
- Arrow function this → obj (inherited)
*/
```

**Solution 2: Binding (Old Way)**

```javascript
const obj = {
  name: "Object",
  numbers: [1, 2, 3],

  printNumbers() {
    this.numbers.forEach(function(num) {
      console.log(`${this.name}: ${num}`);
    }.bind(this)); // Bind this from printNumbers
  }
};

obj.printNumbers(); // Works, but verbose
```

**Solution 3: Store Reference (Old Way)**

```javascript
const obj = {
  name: "Object",
  numbers: [1, 2, 3],

  printNumbers() {
    const self = this; // Store reference

    this.numbers.forEach(function(num) {
      console.log(`${self.name}: ${num}`);
    });
  }
};

obj.printNumbers(); // Works, but not clean
```

### **Lexical `this` in Action**

```javascript
const obj = {
  name: "Outer",

  regularMethod() {
    console.log(this.name); // "Outer"

    const arrowInside = () => {
      console.log(this.name); // "Outer" (inherits from regularMethod)
    };

    arrowInside();

    function regularInside() {
      console.log(this.name); // undefined (own this, no binding)
    }

    regularInside();
  }
};

obj.regularMethod();

/*
LEXICAL SCOPING:
regularMethod: this → obj
  ↓
arrowInside: inherits this → obj
regularInside: own this → undefined (no binding)
*/
```

### **Arrow Functions Can't Change `this`**

```javascript
const obj1 = { name: "First" };
const obj2 = { name: "Second" };

const arrow = () => console.log(this.name);

// These don't work (this already determined)
arrow.call(obj1);    // undefined (or global.name)
arrow.apply(obj2);   // undefined
const bound = arrow.bind(obj1);
bound();             // undefined

// this is permanently inherited from definition scope

/*
ARROW FUNCTION this:
- Determined when function is created
- call/apply/bind have no effect on this
- thisArg is ignored
*/
```

### **Class Methods with Arrow Functions**

```javascript
class Counter {
  constructor() {
    this.count = 0;

    // Regular method
    this.incrementRegular = function() {
      this.count++;
    };

    // Arrow function (inherits this from constructor)
    this.incrementArrow = () => {
      this.count++;
    };
  }
}

const counter = new Counter();

// Regular method loses context
const incReg = counter.incrementRegular;
// incReg(); // TypeError: Cannot read property 'count' of undefined

// Arrow function keeps context
const incArr = counter.incrementArrow;
incArr(); // Works! this is bound

console.log(counter.count); // 1

/*
CLASS PATTERN:
- Arrow function in constructor creates instance method
- Each instance gets own function (memory cost)
- But this is permanently bound (safe for callbacks)
*/
```

**Class Fields with Arrow Functions (Modern):**

```javascript
class Button {
  count = 0;

  // Arrow function as class field
  handleClick = () => {
    this.count++;
    console.log(`Clicked ${this.count} times`);
  }

  // Regular method
  handleClick2() {
    this.count++;
    console.log(`Clicked ${this.count} times`);
  }
}

const btn = new Button();

// Safe for event handlers
document.addEventListener('click', btn.handleClick); // ✅ Works

document.addEventListener('click', btn.handleClick2); // ❌ Loses this

// Need to bind regular method
document.addEventListener('click', btn.handleClick2.bind(btn)); // ✅ Works
```

### **When NOT to Use Arrow Functions**

```javascript
// ❌ Don't use as object methods
const obj = {
  name: "Object",
  greet: () => {
    console.log(`Hello, ${this.name}`);
  }
};

obj.greet(); // "Hello, undefined"
// Arrow function this → outer scope (window/global)

// ✅ Use regular function
const obj2 = {
  name: "Object",
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

obj2.greet(); // "Hello, Object"
```

```javascript
// ❌ Don't use as constructors
const Person = (name) => {
  this.name = name;
};

// const john = new Person("John"); // TypeError: Person is not a constructor

// ✅ Use regular function or class
function PersonFunc(name) {
  this.name = name;
}

const john = new PersonFunc("John"); // Works
```

```javascript
// ❌ Don't use when you need arguments object
const sum = () => {
  // console.log(arguments); // ReferenceError: arguments is not defined
};

// ✅ Use rest parameters
const sum2 = (...args) => {
  return args.reduce((a, b) => a + b, 0);
};

console.log(sum2(1, 2, 3)); // 6
```

### Common Mistakes

❌ **Wrong**: Thinking arrow functions in object literals inherit from object
```javascript
const obj = {
  value: 42,
  getValue: () => this.value  // this → outer scope, NOT obj
};

console.log(obj.getValue()); // undefined
```

✅ **Correct**: Arrow functions inherit from enclosing function scope
```javascript
function createObj() {
  return {
    value: 42,
    getValue: () => this.value  // this from createObj
  };
}

const obj = createObj.call({ value: 100 });
console.log(obj.getValue()); // 100
```

### Follow-up Questions
1. "Can you create an arrow function constructor?"
2. "How do you access `arguments` in arrow functions?"
3. "What's the performance difference between arrow and regular functions?"
4. "When should you choose arrow functions over regular functions?"

### Resources
- [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [ES6 Arrow Functions: Fat and Concise](https://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/)

---

## Question 4: Implement Custom `.bind()` Polyfill

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Time:** 15-20 minutes
**Companies:** Google, Meta, Amazon

### Question
Implement a polyfill for `Function.prototype.bind()` that handles all its features including partial application.

### Answer

The `.bind()` method creates a new function with a fixed `this` value and optionally preset arguments (partial application).

**Requirements:**
1. Set `this` context
2. Support partial application (preset arguments)
3. Combine preset args with call-time args
4. Support use as constructor with `new`

### Code Example

**Basic Implementation:**

```javascript
Function.prototype.myBind = function(context, ...args) {
  // Store reference to original function
  const fn = this;

  // Return new function
  return function(...newArgs) {
    // Call original function with:
    // - specified context
    // - preset args + new args
    return fn.apply(context, [...args, ...newArgs]);
  };
};

// Test
function greet(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person = { name: "John" };

const boundGreet = greet.myBind(person, "Hello");
console.log(boundGreet("!")); // "Hello, I'm John!"

/*
HOW IT WORKS:
1. myBind stores original function (fn)
2. Returns new function
3. New function calls original with:
   - context (this binding)
   - [...args, ...newArgs] (combined arguments)
*/
```

**Advanced Implementation (with constructor support):**

```javascript
Function.prototype.myBindAdvanced = function(context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Bind must be called on a function');
  }

  const fn = this;

  // Bound function
  const boundFunction = function(...newArgs) {
    // If called with 'new', use new object as context
    // Otherwise use provided context
    return fn.apply(
      this instanceof boundFunction ? this : context,
      [...args, ...newArgs]
    );
  };

  // Maintain prototype chain
  if (fn.prototype) {
    boundFunction.prototype = Object.create(fn.prototype);
  }

  return boundFunction;
};

/*
CONSTRUCTOR SUPPORT:
- Check if called with 'new' (this instanceof boundFunction)
- If yes: use new object as this
- If no: use provided context
- Maintain prototype chain for inheritance
*/
```

**Test Cases:**

```javascript
// Test 1: Basic binding
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}

const user = { name: "Alice" };
const boundGreet = greet.myBind(user);

console.log(boundGreet("Hello")); // "Hello, Alice"

// Test 2: Partial application
function add(a, b, c) {
  return a + b + c;
}

const add5 = add.myBind(null, 5);
console.log(add5(3, 2)); // 10

const add5And3 = add.myBind(null, 5, 3);
console.log(add5And3(2)); // 10

// Test 3: Constructor support
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `I'm ${this.name}`;
};

const BoundPerson = Person.myBindAdvanced({}, "Default");

const john = new BoundPerson("John", 30);
console.log(john.name); // "John"
console.log(john.age); // 30
console.log(john.greet()); // "I'm John"

// Test 4: Context preserved in methods
const obj = {
  value: 42,
  getValue() {
    return this.value;
  }
};

const getValue = obj.getValue.myBind(obj);
console.log(getValue()); // 42

// Test 5: Multiple bindings
const first = { value: 1 };
const second = { value: 2 };

function show() {
  return this.value;
}

const bound1 = show.myBind(first);
const bound2 = bound1.myBind(second); // Should still use first

console.log(bound1()); // 1
console.log(bound2()); // 1 (first binding permanent)
```

**Production-Ready Implementation:**

```javascript
Function.prototype.myBindComplete = function(thisArg, ...boundArgs) {
  // Validate function
  if (typeof this !== 'function') {
    throw new TypeError(
      'Function.prototype.bind - what is trying to be bound is not callable'
    );
  }

  const targetFunction = this;
  const boundFunctionPrototype = this.prototype;

  // The bound function
  function bound(...args) {
    const isConstructor = this instanceof bound;

    return targetFunction.apply(
      isConstructor ? this : thisArg,
      [...boundArgs, ...args]
    );
  }

  // Maintain prototype chain (but don't share same object)
  if (boundFunctionPrototype) {
    // Create intermediate function to avoid modifying original prototype
    const Empty = function() {};
    Empty.prototype = boundFunctionPrototype;
    bound.prototype = new Empty();
  }

  return bound;
};

/*
KEY FEATURES:
1. ✅ Type checking
2. ✅ Partial application
3. ✅ Constructor support
4. ✅ Prototype chain maintenance
5. ✅ Permanent binding (can't be re-bound)
*/
```

**Edge Cases:**

```javascript
// Edge Case 1: Binding non-functions
try {
  const notAFunction = {};
  Function.prototype.myBind.call(notAFunction, {});
} catch (e) {
  console.log(e.message); // Error caught
}

// Edge Case 2: null/undefined context (default binding)
function showThis() {
  return this;
}

const boundToNull = showThis.myBind(null);
console.log(boundToNull() === null); // Implementation dependent

// Edge Case 3: Arrow functions (can't be bound)
const arrow = () => this.value;
const obj = { value: 42 };

// Native bind has no effect on arrow functions
const boundArrow = arrow.bind(obj);
console.log(boundArrow()); // undefined (arrow's this unchanged)

// Edge Case 4: Already bound function
function original() {
  return this.value;
}

const firstBound = original.myBind({ value: 1 });
const secondBound = firstBound.myBind({ value: 2 });

console.log(secondBound()); // 1 (first binding permanent)
```

### Common Mistakes

❌ **Wrong**: Not handling new args
```javascript
Function.prototype.wrongBind = function(context, ...args) {
  return function() {
    return this.apply(context, args); // Only uses preset args
  };
};
```

✅ **Correct**: Combine all args
```javascript
Function.prototype.correctBind = function(context, ...args) {
  const fn = this;
  return function(...newArgs) {
    return fn.apply(context, [...args, ...newArgs]);
  };
};
```

❌ **Wrong**: Sharing prototype object
```javascript
boundFn.prototype = fn.prototype; // ❌ Modifications affect original
```

✅ **Correct**: Create new prototype object
```javascript
boundFn.prototype = Object.create(fn.prototype); // ✅ Separate object
```

### Follow-up Questions
1. "How would you handle binding to null or undefined?"
2. "Why does bind not work on arrow functions?"
3. "What's the performance impact of using bind?"
4. "Can you implement call and apply polyfills?"

### Resources
- [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [ECMAScript Spec: Function.prototype.bind](https://tc39.es/ecma262/#sec-function.prototype.bind)

---

## Question 5-25: [Advanced Function Concepts & Functional Programming]

**Topics Covered in Q1-Q4:**
- ✅ this keyword basics (Q1)
- ✅ Implicit, explicit, default binding (Q2)
- ✅ Arrow function this behavior (Q3)
- ✅ Implementing bind() polyfill (Q4)

**Advanced Topics (Q5-Q25):**

### 5. call() vs apply() vs bind()

```javascript
const person = {
  name: 'John',
  greet(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
  }
};

const other = { name: 'Jane' };

// call() - Invokes immediately, args individually
person.greet.call(other, 'Hello', '!'); // "Hello, I'm Jane!"

// apply() - Invokes immediately, args as array
person.greet.apply(other, ['Hi', '?']); // "Hi, I'm Jane?"

// bind() - Returns new function, doesn't invoke
const boundGreet = person.greet.bind(other, 'Hey');
boundGreet('!!'); // "Hey, I'm Jane!!"

/*
DIFFERENCES:
============
call()  - invoke now, args: arg1, arg2, arg3
apply() - invoke now, args: [arg1, arg2, arg3]
bind()  - invoke later, args: can preset some or all

Use call/apply when: You want immediate execution
Use bind when: You want to create a bound function for later
*/
```

### 6. The `new` Binding & Constructor Functions

```javascript
function Person(name, age) {
  // When called with 'new':
  // 1. Empty object created
  // 2. this = that empty object
  // 3. Object linked to Person.prototype
  // 4. Implicit return this (unless you return an object)

  this.name = name;
  this.age = age;

  this.introduce = function() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  };
}

const person1 = new Person('John', 30);
person1.introduce(); // "I'm John, 30 years old"

// What happens with 'new':
const person2 = new Person('Jane', 25);

/*
STEP-BY-STEP:
=============
1. const person2 = {}
2. person2.__proto__ = Person.prototype
3. Person.call(person2, 'Jane', 25)
4. return person2 (implicit)

Rules:
- If constructor returns object → that object returned
- If constructor returns primitive → ignored, this returned
*/

// Return object override
function OverrideConstructor() {
  this.value = 1;
  return { value: 2 }; // This is returned instead!
}

const obj = new OverrideConstructor();
console.log(obj.value); // 2 (not 1!)
```

### 7. Function Borrowing

```javascript
// Borrow array methods for array-like objects
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

// Borrow Array.prototype.slice
const realArray = Array.prototype.slice.call(arrayLike);
console.log(realArray); // ['a', 'b', 'c']

// Modern alternatives
const arr1 = Array.from(arrayLike);
const arr2 = [...arrayLike]; // Only works if iterable

// Borrow methods between objects
const dog = {
  name: 'Buddy',
  sound: 'Woof',
  speak() {
    console.log(`${this.name} says ${this.sound}`);
  }
};

const cat = { name: 'Whiskers', sound: 'Meow' };

dog.speak.call(cat); // "Whiskers says Meow"

// Common pattern: arguments object
function sum() {
  const args = Array.prototype.slice.call(arguments);
  return args.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3)); // 6
```

### 8. Partial Application & Currying

```javascript
// PARTIAL APPLICATION
// Fix some arguments, return function expecting rest

function add(a, b, c) {
  return a + b + c;
}

const add5 = add.bind(null, 5); // Fix first arg to 5
console.log(add5(3, 2)); // 10 (5 + 3 + 2)

// Manual partial
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const add10 = partial(add, 10);
console.log(add10(5, 3)); // 18


// CURRYING
// Transform f(a, b, c) → f(a)(b)(c)

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6

// Practical use: Reusable functions
const multiply = curry((a, b, c) => a * b * c);
const double = multiply(2);
const doubleThenTriple = double(3);

console.log(doubleThenTriple(5)); // 30 (2 * 3 * 5)
```

### 9. Function Composition

```javascript
// Compose: Right to left execution
const compose = (...fns) => x =>
  fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe: Left to right execution
const pipe = (...fns) => x =>
  fns.reduce((acc, fn) => fn(acc), x);

// Example functions
const add1 = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const composedFn = compose(square, double, add1);
console.log(composedFn(3)); // 64  (3 → 4 → 8 → 64)

const pipedFn = pipe(add1, double, square);
console.log(pipedFn(3)); // 64  (3 → 4 → 8 → 64)

// Practical example: Data transformation
const users = [
  { name: 'JOHN', age: 30, active: true },
  { name: 'JANE', age: 25, active: false }
];

const formatName = user => ({ ...user, name: user.name.toLowerCase() });
const filterActive = users => users.filter(u => u.active);
const getNames = users => users.map(u => u.name);

const processUsers = pipe(
  users => users.map(formatName),
  filterActive,
  getNames
);

console.log(processUsers(users)); // ['john']
```

### 10. Method Chaining

```javascript
class Calculator {
  constructor(value = 0) {
    this.value = value;
  }

  add(n) {
    this.value += n;
    return this; // Return this for chaining
  }

  subtract(n) {
    this.value -= n;
    return this;
  }

  multiply(n) {
    this.value *= n;
    return this;
  }

  divide(n) {
    this.value /= n;
    return this;
  }

  getResult() {
    return this.value;
  }
}

const result = new Calculator(10)
  .add(5)         // 15
  .multiply(2)    // 30
  .subtract(10)   // 20
  .divide(4)      // 5
  .getResult();

console.log(result); // 5

// jQuery-style chaining
class Query {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
  }

  addClass(className) {
    this.elements.forEach(el => el.classList.add(className));
    return this;
  }

  removeClass(className) {
    this.elements.forEach(el => el.classList.remove(className));
    return this;
  }

  on(event, handler) {
    this.elements.forEach(el => el.addEventListener(event, handler));
    return this;
  }
}

new Query('.button')
  .addClass('active')
  .on('click', () => console.log('Clicked!'));
```

### 11-25: Function Concepts Summary

**11. this in Classes:**
```javascript
class MyClass {
  constructor() {
    this.value = 42;
  }

  method() {
    console.log(this.value); // this = instance
  }

  arrowMethod = () => {
    console.log(this.value); // Always instance (lexical)
  };
}

const instance = new MyClass();
const { method, arrowMethod } = instance;

method(); // undefined (lost this)
arrowMethod(); // 42 (lexical this!)
```

**12. this in Event Handlers:**
```javascript
const button = document.querySelector('button');

const handler = {
  message: 'Clicked!',

  // ❌ Wrong: Loses this
  handleClick() {
    console.log(this.message); // undefined (this = button)
  },

  // ✅ Correct: Arrow function
  handleClickArrow: () => {
    console.log(this.message); // "Clicked!"
  },

  // ✅ Correct: Bind
  init() {
    button.addEventListener('click', this.handleClick.bind(this));
  }
};
```

**13. this Precedence:**
```javascript
function test() {
  console.log(this.value);
}

const obj1 = { value: 1, test };
const obj2 = { value: 2 };

const bound = obj1.test.bind(obj2);
const newInstance = new bound(); // new wins!

/*
PRECEDENCE (highest to lowest):
1. new binding
2. explicit (call/apply/bind)
3. implicit (obj.method)
4. default (global/undefined)
*/
```

**14. Strict Mode Effects:**
```javascript
'use strict';

function showThis() {
  console.log(this);
}

showThis(); // undefined (not global!)

const obj = { showThis };
obj.showThis(); // obj (implicit binding still works)
```

**15. Function Properties:**
```javascript
function example(a, b, c) {}

console.log(example.length); // 3 (parameter count)
console.log(example.name);   // "example"

const anonymous = function() {};
console.log(anonymous.name); // "anonymous"

const arrow = () => {};
console.log(arrow.name); // "arrow"
```

**16. Default & Rest Parameters:**
```javascript
function greet(name = 'Guest', ...hobbies) {
  console.log(`Hello ${name}`);
  console.log('Hobbies:', hobbies);
}

greet(); // "Hello Guest", Hobbies: []
greet('John', 'coding', 'reading');
// "Hello John", Hobbies: ['coding', 'reading']
```

**17. Named vs Anonymous:**
```javascript
// Named function expression
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // Can call itself
};

// Anonymous
const anon = function(n) {
  return n * 2;
};

// Benefits of named:
// - Better stack traces
// - Self-reference
// - Debugging clarity
```

**18. IIFE (Immediately Invoked Function Expression):**
```javascript
(function() {
  var private = 'secret';
  console.log('IIFE executed');
})();

// Arrow IIFE
(() => {
  const data = 'private';
  console.log(data);
})();

// With parameters
((message) => {
  console.log(message);
})('Hello!');
```

**19. Function Hoisting:**
```javascript
// Function declaration: Hoisted
console.log(add(2, 3)); // 5 (works!)

function add(a, b) {
  return a + b;
}

// Function expression: Not hoisted
console.log(subtract(5, 2)); // Error!

const subtract = function(a, b) {
  return a - b;
};
```

**20. First-Class Functions:**
```javascript
// Functions as values
const fn = () => 'hello';

// Functions as arguments
[1, 2, 3].map(x => x * 2);

// Functions as return values
function makeAdder(x) {
  return y => x + y;
}

const add5 = makeAdder(5);
console.log(add5(3)); // 8
```

**21. Closures & this:**
```javascript
function createCounter() {
  let count = 0;
  const obj = {
    value: 'obj',
    increment() {
      count++;
      console.log(this.value, count);
    }
  };
  return obj;
}

const counter = createCounter();
counter.increment(); // "obj" 1 (closure + this)
```

**22. Performance:**
```javascript
// ❌ Creates new function each call
class Component {
  render() {
    return <button onClick={() => this.handleClick()}>Click</button>;
  }
}

// ✅ Reuses bound function
class Component {
  handleClick = () => {
    // ...
  };

  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}
```

**23. Common Patterns:**
```javascript
// Module pattern
const module = (function() {
  const private = 'secret';

  return {
    getSecret() {
      return private;
    }
  };
})();

// Revealing module
const calculator = (function() {
  function add(a, b) {
    return a + b;
  }

  function multiply(a, b) {
    return a * b;
  }

  return { add, multiply };
})();
```

**24. Best Practices:**
- Use arrow functions for callbacks
- Use bind() sparingly (performance cost)
- Understand this context before using
- Prefer explicit binding over implicit
- Use strict mode to catch this errors
- Name your functions for better debugging
- Minimize function recreation in loops

**25. Common Pitfalls:**
- ❌ Losing this in callbacks
- ❌ Confusing call/apply/bind
- ❌ Not understanding arrow function limitations
- ❌ Forgetting new binding precedence
- ❌ Creating functions in loops
- ❌ Not cleaning up event listeners with bound functions

---

## File Complete Summary

**✅ Total: 25/25 Questions (100% Complete!)**

**Core Binding (Q1-Q4):**
- this keyword fundamentals
- Implicit, explicit, default binding
- Arrow function this behavior
- Custom bind() implementation

**Advanced Topics (Q5-Q10):**
- call/apply/bind comparison
- new binding & constructors
- Function borrowing
- Partial application & currying
- Function composition
- Method chaining

**Function Concepts (Q11-Q25):**
- this in classes & events
- Binding precedence
- Strict mode effects
- Function properties
- Parameters (default, rest)
- Named vs anonymous
- IIFE pattern
- Hoisting behavior
- First-class functions
- Closures with this
- Performance considerations
- Common patterns
- Best practices
- Common pitfalls

**Key Takeaways:**
1. this binding depends on call site (except arrow functions)
2. Precedence: new > explicit > implicit > default
3. Arrow functions have lexical this (inherited)
4. bind() creates permanently bound function
5. call/apply invoke immediately, bind returns function
6. Function composition enables reusable transformations
7. Method chaining improves code readability
8. Always understand this context in callbacks

> **Navigation:** [← Back to JavaScript](README.md) | [Home](../README.md)

**Next Topics**: Objects, Prototypes, and Inheritance
