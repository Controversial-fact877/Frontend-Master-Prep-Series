# The 'this' Keyword & Binding

> **Focus**: JavaScript fundamentals and advanced concepts

---

## Question 1: How does the 'this' keyword work in JavaScript?

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

<details>
<summary><strong>🔍 Deep Dive</strong></summary>

**`this` Resolution Algorithm:**

V8 determines `this` value using these rules (in order):

1. **new binding**: `new` keyword → new object
2. **Explicit binding**: `call`/`apply`/`bind` → specified object
3. **Implicit binding**: Method call → object before dot
4. **Default binding**: Standalone call → global (or undefined in strict mode)
5. **Lexical binding**: Arrow function → outer scope's `this`

```javascript
// Priority demonstration:
function show() {
  console.log(this.value);
}

const obj1 = { value: 1, show };
const obj2 = { value: 2 };

// Explicit > Implicit
obj1.show.call(obj2); // 2 (call wins over method)

// new > Explicit
const BoundShow = show.bind(obj1);
const instance = new BoundShow(); // undefined (new wins, 'this' = new object)
instance.value = 3;
new BoundShow(); // 3 (new binding)
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario</strong></summary>

**Problem:** React component methods lose `this` when passed as callbacks.

**Solution:**
```javascript
class TodoList extends React.Component {
  // ✅ Arrow function auto-binds
  handleDelete = (id) => {
    this.setState({ todos: this.state.todos.filter(t => t.id !== id) });
  };
}
```

</details>

<details>
<summary><strong>⚖️ Trade-offs</strong></summary>

| Approach | Memory | Performance | Use Case |
|----------|--------|-------------|----------|
| Arrow in class | High (per instance) | Fast | React methods |
| bind() in constructor | Medium | Fast | One-time setup |
| Arrow in render | High (re-created) | Slow | ❌ Avoid |

</details>

<details>
<summary><strong>💬 Explain to Junior</strong></summary>

**`this` = "Who called me?"**

```javascript
const person = {
  name: "Alice",
  greet() {
    console.log(this.name); // this = person
  }
};

person.greet(); // "Alice" (person called it)

const greet = person.greet;
greet(); // undefined (nobody called it, this = global)
```

**Rule:** `this` = object before the dot when function is called.

</details>

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

<details><summary><strong>🔍 Deep Dive</strong></summary>

**call vs apply performance:** `call` is faster (~5-10%) when you have individual arguments. V8 optimizes `call` better because it knows exact argument count at compile time.

</details>

<details><summary><strong>🐛 Real-World Scenario</strong></summary>

**Problem:** Borrowing array methods for array-like objects.

```javascript
const arrayLike = { 0: 'a', 1: 'b', length: 2 };
const result = Array.prototype.map.call(arrayLike, x => x.toUpperCase());
// ['A', 'B']
```

</details>

<details><summary><strong>⚖️ Trade-offs</strong></summary>

| Method | When to Use |
|--------|-------------|
| `call` | Known arguments |
| `apply` | Arguments in array |
| `bind` | Need persistent binding |

</details>

<details><summary><strong>💬 Explain to Junior</strong></summary>

**call/apply/bind = "Borrow a method"**

```javascript
const dog = { name: "Buddy", speak() { console.log(this.name); } };
const cat = { name: "Whiskers" };

dog.speak.call(cat); // "Whiskers" (cat borrows dog's method)
```

</details>

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

<details>
<summary><strong>🔍 Deep Dive: Arrow Function Internals</strong></summary>

**How V8 Handles Lexical `this`:**

Arrow functions don't have their own `[[ThisMode]]` internal slot. At compile time, V8:
1. Parses arrow function → marks as "lexical this"
2. Captures `this` from enclosing scope in hidden [[Environment]] reference
3. When invoked → doesn't create new execution context for `this`
4. Uses captured reference directly (no lookup needed)

**Memory Impact:**
- Regular function: 12 bytes overhead per instance (this binding slot)
- Arrow function: 8 bytes (no this slot, but closure overhead if capturing variables)

**V8 Optimization:**
- Arrow functions in hot loops get inlined aggressively (~40% more than regular functions)
- TurboFan specializes arrow functions better because `this` is immutable

</details>

<details>
<summary><strong>🐛 Real-World Scenario: React Event Handlers</strong></summary>

**Problem:** Performance degradation in dashboard with 500+ list items using arrow functions in render.

```javascript
// ❌ PROBLEM: Creates new function on every render
class TodoList extends React.Component {
  render() {
    return this.props.todos.map(todo => (
      <TodoItem
        key={todo.id}
        onClick={() => this.handleClick(todo.id)} // New function every render!
      />
    ));
  }
}
```

**Metrics:**
- Re-renders: 60 times/second during scrolling
- Functions created: 500 × 60 = 30,000/second
- GC pressure: 240KB/second allocation
- Frame drops: 18 FPS (target: 60 FPS)

**Solution 1 - Class property arrow function:**
```javascript
class TodoList extends React.Component {
  handleClick = (id) => {  // Lexical this, created once
    this.props.onToggle(id);
  }

  render() {
    return this.props.todos.map(todo => (
      <TodoItem
        key={todo.id}
        onClick={() => this.handleClick(todo.id)}
      />
    ));
  }
}
```

**Solution 2 - useCallback hook:**
```javascript
function TodoList({ todos, onToggle }) {
  const handleClick = useCallback((id) => {
    onToggle(id);
  }, [onToggle]);

  return todos.map(todo => (
    <TodoItem key={todo.id} onClick={() => handleClick(todo.id)} />
  ));
}
```

**Result:** Frame rate: 58-60 FPS, GC pressure reduced by 85%

</details>

<details>
<summary><strong>⚖️ Trade-offs: Arrow vs Regular Functions</strong></summary>

| Aspect | Arrow Functions | Regular Functions |
|--------|----------------|-------------------|
| **this binding** | Lexical (outer scope) | Dynamic (call-site) |
| **Use as constructor** | ❌ Cannot use `new` | ✅ Can be constructors |
| **arguments object** | ❌ No own `arguments` | ✅ Has `arguments` |
| **Memory (per instance)** | 8 bytes (no this slot) | 12 bytes (has this slot) |
| **Performance** | 5-10% faster (fewer lookups) | Baseline |
| **Method definition** | Not suitable (lexical this) | Perfect for methods |
| **Callbacks** | Perfect (preserves context) | Needs bind/closure |
| **Code size** | Smaller (shorter syntax) | Larger |

**When to use Arrow:**
- ✅ Event handlers in classes
- ✅ Array methods (map, filter, reduce)
- ✅ Async callbacks (setTimeout, promises)
- ✅ When you want outer scope's `this`

**When to use Regular:**
- ✅ Object methods
- ✅ Constructor functions
- ✅ When you need dynamic `this`
- ✅ When you need `arguments` object

</details>

<details>
<summary><strong>💬 Explain to Junior</strong></summary>

**Analogy:** Arrow functions are like using "that/self" pattern automatically.

**Regular function with manual capture:**
```javascript
function Timer() {
  var self = this;  // Manually capture 'this'
  self.seconds = 0;

  setInterval(function() {
    self.seconds++;  // Use captured 'self'
    console.log(self.seconds);
  }, 1000);
}
```

**Arrow function (automatic capture):**
```javascript
function Timer() {
  this.seconds = 0;

  setInterval(() => {
    this.seconds++;  // 'this' automatically from Timer
    console.log(this.seconds);
  }, 1000);
}
```

**Key Insight:** Arrow functions remember the `this` value from where they were created, not where they're called. Think of it like taking a photo - the background (this) is captured at creation time and never changes.

**Common Gotcha:**
```javascript
const obj = {
  value: 42,
  getValue: () => this.value  // ❌ this is NOT obj!
};
```

Arrow function created at object literal level → `this` is outer scope (global), not `obj`. Object literals don't create new scope for `this`.

</details>

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

<details>
<summary><strong>🔍 Deep Dive: How Native bind() Works</strong></summary>

**V8 Implementation Details:**

When you call `fn.bind(context)`, V8 creates a **bound function exotic object** with these internal slots:

1. **[[BoundTargetFunction]]**: Reference to original function
2. **[[BoundThis]]**: Fixed `this` value
3. **[[BoundArguments]]**: Preset arguments list
4. **[[Call]]**: Internal method that combines everything

**Call Sequence:**
```
boundFn(newArgs)
  ↓
[[Call]] internal method invoked
  ↓
Retrieves: [[BoundTargetFunction]], [[BoundThis]], [[BoundArguments]]
  ↓
Combines: [[BoundArguments]] + newArgs
  ↓
Calls: [[BoundTargetFunction]].apply([[BoundThis]], combinedArgs)
```

**Constructor Support:**
When `new boundFn()` is called:
- Ignores [[BoundThis]]
- Creates new object
- Sets prototype chain to [[BoundTargetFunction]].prototype
- Calls [[BoundTargetFunction]] as constructor

**Performance Characteristics:**
- Native bind: 1 allocation (bound function object)
- Closure bind: 2 allocations (closure + scope object)
- Call overhead: ~2-3ns per bound call (negligible)

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Partial Application Bug</strong></summary>

**Problem:** API client with inconsistent authentication headers causing 401 errors.

```javascript
// ❌ BUGGY CODE
class APIClient {
  constructor(baseURL, authToken) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  request(method, endpoint, data) {
    return fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${this.authToken}` },
      body: JSON.stringify(data)
    });
  }
}

const client = new APIClient('https://api.example.com', 'token123');

// Creating specialized methods
const get = client.request.bind(client, 'GET');  // ✅ Context bound
const post = client.request.bind(client, 'POST'); // ✅ Context bound

// BUG: Token rotation happens
client.authToken = 'newToken456';  // Token updated

// These still use OLD token (captured at bind time)
get('/users');  // ❌ Uses 'token123' → 401 Unauthorized
post('/posts', { title: 'Hello' });  // ❌ Uses 'token123' → 401
```

**Why it happens:**
- `bind()` captures `this` reference, not property values
- Properties are looked up at call time
- But if you capture property in closure, it's fixed:

```javascript
// This would capture old value forever:
const getBad = () => client.request('GET', ...); // Closure captures current client
```

**Solution: Use proper method binding**
```javascript
class APIClient {
  constructor(baseURL, authToken) {
    this.baseURL = baseURL;
    this.authToken = authToken;

    // Bind methods once, properties still dynamic
    this.get = this.request.bind(this, 'GET');
    this.post = this.request.bind(this, 'POST');
    this.put = this.request.bind(this, 'PUT');
    this.delete = this.request.bind(this, 'DELETE');
  }

  request(method, endpoint, data) {
    // this.authToken looked up at call time (always current)
    return fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${this.authToken}` },
      body: JSON.stringify(data)
    });
  }

  rotateToken(newToken) {
    this.authToken = newToken;
  }
}

const client = new APIClient('https://api.example.com', 'token123');

client.get('/users');  // ✅ Uses 'token123'

client.rotateToken('newToken456');

client.get('/users');  // ✅ Uses 'newToken456' (dynamic lookup)
```

**Metrics:**
- Bug affected 12% of API calls after token rotation
- Average: 3 failed requests before token refresh detected
- Fix: 0 failed requests, seamless token rotation

</details>

<details>
<summary><strong>⚖️ Trade-offs: bind vs Alternatives</strong></summary>

| Approach | Memory | Performance | Flexibility | Use Case |
|----------|--------|-------------|-------------|----------|
| **Native .bind()** | 1 allocation per bind | Fast (optimized) | ❌ Permanent binding | Event handlers, callbacks |
| **Arrow function** | 1 closure allocation | Fastest (inline) | ❌ Fixed at creation | React class methods, simple callbacks |
| **Wrapper function** | 1 function + scope | Slightly slower | ✅ Can change logic | Dynamic behavior needed |
| **call/apply** | 0 allocation | Fastest (no binding) | ✅ Full control | One-time calls, known context |

**bind() Advantages:**
- ✅ Partial application (preset arguments)
- ✅ Can be used as constructor
- ✅ Clear intent (permanent binding)
- ✅ Works with existing functions

**bind() Disadvantages:**
- ❌ Cannot be unbound (first binding wins)
- ❌ Memory overhead (creates new function)
- ❌ Debugging harder (stack shows bound function)
- ❌ Doesn't work on arrow functions

**When to use bind:**
- Event listeners: `element.addEventListener('click', this.handler.bind(this))`
- Partial application: `const add5 = add.bind(null, 5)`
- Method extraction: `const log = console.log.bind(console)`

**When NOT to use bind:**
- Inside render methods (use arrow or cache)
- Arrow functions (no effect)
- Hot paths (prefer call/apply for performance)

</details>

<details>
<summary><strong>💬 Explain to Junior</strong></summary>

**Analogy:** `bind()` is like creating a custom stamp.

**Original function (rubber stamp):**
```javascript
function greet(greeting) {
  return `${greeting}, ${this.name}!`;
}
```

You can stamp on different surfaces (contexts):
```javascript
greet.call({ name: 'Alice' }, 'Hello');  // "Hello, Alice!"
greet.call({ name: 'Bob' }, 'Hi');      // "Hi, Bob!"
```

**bind() creates a specialized stamp:**
```javascript
const greetAlice = greet.bind({ name: 'Alice' });
```

Now you have a stamp that ALWAYS says "Alice", no matter what:
```javascript
greetAlice('Hello');  // "Hello, Alice!"
greetAlice('Hi');     // "Hi, Alice!"

// Even if you try to change it:
greetAlice.call({ name: 'Bob' }, 'Hey');  // Still "Hey, Alice!"
```

**Partial Application (pre-filling ink colors):**
```javascript
const sayHelloToAlice = greet.bind({ name: 'Alice' }, 'Hello');

// Both context AND first argument are locked:
sayHelloToAlice();  // "Hello, Alice!"
```

**Key Points:**
1. **bind() doesn't call** the function - it creates a new function
2. **First binding wins** - can't rebind a bound function
3. **Preset arguments** come before new arguments
4. **Constructor mode** respects `new` keyword

**Common Mistake:**
```javascript
const obj = {
  value: 42,
  getValue: function() { return this.value; }
};

// ❌ Loses context
setTimeout(obj.getValue, 1000);  // undefined

// ✅ Preserves context
setTimeout(obj.getValue.bind(obj), 1000);  // 42
```

</details>

### Resources
- [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [ECMAScript Spec: Function.prototype.bind](https://tc39.es/ecma262/#sec-function.prototype.bind)

---

