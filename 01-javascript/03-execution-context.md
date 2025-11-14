# JavaScript Execution Context & Call Stack

> Deep dive into how JavaScript code is executed, the execution context lifecycle, call stack mechanics, and the event loop architecture.

---

## Question 1: What is an Execution Context in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Uber

### Question
Explain what an execution context is in JavaScript. What are its components and types?

### Answer

An **execution context** is an abstract concept that holds information about the environment within which the current code is being executed. It's the foundation of how JavaScript code runs.

**Key Components of Execution Context:**

1. **Variable Environment**: Stores variables, function declarations, and arguments object
2. **Lexical Environment**: Stores identifier-variable mappings with reference to outer environment
3. **`this` Binding**: Determines the value of `this` keyword

**Types of Execution Context:**

1. **Global Execution Context (GEC)**
   - Created when JavaScript file first loads
   - Only one per program
   - Creates global object (`window` in browsers, `global` in Node.js)
   - Sets `this` to global object

2. **Function Execution Context (FEC)**
   - Created whenever a function is invoked
   - Each function gets its own execution context
   - Has access to arguments object

3. **Eval Execution Context** (rarely used, avoid in production)
   - Code executed inside `eval()` function

### Code Example

```javascript
// Global Execution Context is created
let globalVar = "I'm global";

function outerFunction() {
  // Function Execution Context created for outerFunction
  let outerVar = "I'm outer";

  function innerFunction() {
    // Function Execution Context created for innerFunction
    let innerVar = "I'm inner";

    console.log(globalVar); // Can access global
    console.log(outerVar);  // Can access outer
    console.log(innerVar);  // Can access own
  }

  innerFunction();
}

outerFunction();

// Execution Context Stack visualization:
// [Global Context]
// [Global Context, outerFunction Context]
// [Global Context, outerFunction Context, innerFunction Context]
// [Global Context, outerFunction Context]
// [Global Context]
```

**Visual Representation:**
```javascript
// Execution Context Structure
ExecutionContext = {
  VariableEnvironment: {
    environmentRecord: {
      // var declarations, function declarations
    },
    outer: <reference to parent>
  },
  LexicalEnvironment: {
    environmentRecord: {
      // let, const declarations
    },
    outer: <reference to parent>
  },
  ThisBinding: <value of this>
}
```

### Common Mistakes

❌ **Wrong**: Thinking each line of code creates a new context
```javascript
let a = 1;  // No new context
let b = 2;  // No new context
let c = 3;  // No new context
```

✅ **Correct**: Only function calls and global/eval create contexts
```javascript
function foo() {  // Context created when called
  let a = 1;
}
foo();  // New execution context created here
```

❌ **Wrong**: Confusing execution context with scope
- **Scope** is about variable visibility/accessibility (compile-time)
- **Execution context** is about code execution environment (runtime)

### Follow-up Questions
1. "How does the execution context differ from scope?"
2. "What happens to the execution context after function returns?"
3. "How does `this` binding work in different execution contexts?"
4. "Can you explain the creation phase vs execution phase?"

### Resources
- [MDN: Execution Context](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [ECMA-262 Execution Contexts](https://tc39.es/ecma262/#sec-execution-contexts)
- [JavaScript.info: Execution Context](https://javascript.info/closure)

---

## Question 2: Explain the Creation and Execution Phases of Execution Context

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Time:** 10-15 minutes
**Companies:** Google, Meta, Amazon

### Question
What happens during the creation phase and execution phase of an execution context? Explain with hoisting examples.

### Answer

JavaScript execution context goes through **two distinct phases**:

### **Phase 1: Creation Phase (Memory Allocation)**

During creation phase, JavaScript engine:

1. **Creates the Variable Object (VO) / Activation Object (AO)**
   - Scans for function declarations → creates properties, stores reference
   - Scans for variable declarations → creates properties, initializes as `undefined`
   - Sets up arguments object (for function contexts)

2. **Creates the Scope Chain**
   - Determines variable accessibility
   - Links outer environment references

3. **Determines `this` binding**
   - Sets value of `this` keyword

### **Phase 2: Execution Phase**

- Code executes line by line
- Variable assignments happen
- Function calls create new execution contexts

### Code Example

```javascript
// Let's trace execution context phases

console.log(x);        // undefined (not ReferenceError!)
console.log(greet);    // [Function: greet]
console.log(name);     // ReferenceError: Cannot access before initialization

var x = 10;
let name = "John";

function greet() {
  console.log("Hello");
}

/*
CREATION PHASE:
================
GlobalExecutionContext = {
  VariableEnvironment: {
    x: undefined,          // var hoisted, initialized as undefined
    greet: <function>      // function fully hoisted
  },
  LexicalEnvironment: {
    name: <uninitialized>  // let in Temporal Dead Zone (TDZ)
  },
  ThisBinding: window
}

EXECUTION PHASE:
================
Line 1: console.log(x)     → Reads x from VO → undefined
Line 2: console.log(greet) → Reads greet from VO → function reference
Line 3: console.log(name)  → name still in TDZ → ReferenceError

Line 5: x = 10             → Assignment happens, x updated to 10
Line 6: name = "John"      → Assignment happens, name gets value
Line 8-10: Already processed in creation phase
*/
```

**Detailed Function Context Example:**

```javascript
function multiply(a, b) {
  var result = a * b;

  function display() {
    console.log(result);
  }

  return display;
}

const showResult = multiply(5, 3);
showResult();

/*
WHEN multiply(5, 3) IS CALLED:
================================

CREATION PHASE:
multiplyExecutionContext = {
  VariableEnvironment: {
    arguments: { 0: 5, 1: 3, length: 2 },
    a: 5,
    b: 3,
    result: undefined,
    display: <function>
  },
  LexicalEnvironment: {
    // empty for this example
  },
  ThisBinding: window (or undefined in strict mode)
}

EXECUTION PHASE:
Line 2: result = a * b  → result assigned 15
Line 4-6: display already in memory
Line 8: return display  → Returns function reference (closure formed)
*/
```

### Hoisting Explained Through Phases

```javascript
// Example showing different hoisting behaviors

console.log(varVariable);    // undefined
console.log(letVariable);    // ReferenceError
console.log(constVariable);  // ReferenceError
console.log(funcDecl);       // [Function: funcDecl]
console.log(funcExpr);       // undefined
console.log(arrowFunc);      // ReferenceError

var varVariable = "var";
let letVariable = "let";
const constVariable = "const";

function funcDecl() {
  return "function declaration";
}

var funcExpr = function() {
  return "function expression";
};

const arrowFunc = () => "arrow function";

/*
CREATION PHASE BREAKDOWN:
==========================

var varVariable: undefined       ✅ Hoisted, initialized
let letVariable: <uninitialized> ⚠️ Hoisted, but in TDZ
const constVariable: <uninit>    ⚠️ Hoisted, but in TDZ

function funcDecl: <function>    ✅ Fully hoisted
var funcExpr: undefined          ⚠️ Only var hoisted, not function
const arrowFunc: <uninit>        ⚠️ In TDZ

TDZ = Temporal Dead Zone (from start of scope to initialization)
*/
```

### Common Mistakes

❌ **Wrong**: Thinking let/const are not hoisted
```javascript
// They ARE hoisted, but not initialized
let x = 1;
{
  console.log(x); // ReferenceError (not 1!)
  let x = 2;      // x is hoisted to block scope
}
```

✅ **Correct**: Understanding TDZ
```javascript
// let/const hoisted but in Temporal Dead Zone
let x = 1;
{
  // TDZ starts here for block-scoped x
  // console.log(x); // ReferenceError
  let x = 2; // TDZ ends, initialization happens
  console.log(x); // 2
}
```

❌ **Wrong**: Function expressions hoist like function declarations
```javascript
// This will error:
myFunc(); // TypeError: myFunc is not a function
var myFunc = function() {
  console.log("Hello");
};
// Only the var myFunc is hoisted (as undefined)
```

### Follow-up Questions
1. "What is the Temporal Dead Zone (TDZ)?"
2. "Why do function declarations hoist completely but function expressions don't?"
3. "What's the difference between VariableEnvironment and LexicalEnvironment?"
4. "How does strict mode affect the creation phase?"

### Resources
- [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
- [Understanding Execution Context and Stack](https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0)

---

## Question 3: What is the Call Stack?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Uber, Netflix

### Question
Explain the JavaScript Call Stack. How does it work and what happens when it overflows?

### Answer

The **Call Stack** is a data structure that records where in the program we are. It operates on LIFO (Last In, First Out) principle and keeps track of function execution contexts.

**How It Works:**

1. When script loads → Global Execution Context pushed to stack
2. When function called → New execution context created and pushed
3. When function returns → Its context popped off stack
4. When stack empty → Program finished

### Code Example

```javascript
function first() {
  console.log("Inside first");
  second();
  console.log("Back to first");
}

function second() {
  console.log("Inside second");
  third();
  console.log("Back to second");
}

function third() {
  console.log("Inside third");
}

first();

/*
CALL STACK VISUALIZATION:
==========================

Step 1: Script starts
[Global Context]

Step 2: first() called
[Global Context]
[first()]

Step 3: second() called from first
[Global Context]
[first()]
[second()]

Step 4: third() called from second
[Global Context]
[first()]
[second()]
[third()]

Step 5: third() completes, popped
[Global Context]
[first()]
[second()]

Step 6: second() completes, popped
[Global Context]
[first()]

Step 7: first() completes, popped
[Global Context]

OUTPUT:
Inside first
Inside second
Inside third
Back to second
Back to first
*/
```

**Stack Overflow Example:**

```javascript
// Infinite recursion causes stack overflow
function recursiveFunction() {
  recursiveFunction(); // Calls itself infinitely
}

// recursiveFunction(); // ❌ RangeError: Maximum call stack size exceeded

/*
CALL STACK GROWS INFINITELY:
[Global]
[recursiveFunction]
[recursiveFunction]
[recursiveFunction]
...
[recursiveFunction] ← Eventually exceeds limit
*/
```

**Proper Recursion with Base Case:**

```javascript
function factorial(n) {
  // Base case prevents stack overflow
  if (n <= 1) return 1;

  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120

/*
CALL STACK WITH BASE CASE:
==========================
factorial(5)
  → factorial(4)
    → factorial(3)
      → factorial(2)
        → factorial(1) ← Base case hit, starts returning
          return 1
        return 2 * 1 = 2
      return 3 * 2 = 6
    return 4 * 6 = 24
  return 5 * 24 = 120
*/
```

**Stack Trace in Errors:**

```javascript
function functionA() {
  functionB();
}

function functionB() {
  functionC();
}

function functionC() {
  throw new Error("Something went wrong!");
}

try {
  functionA();
} catch (error) {
  console.error(error.stack);
}

/*
Error Stack Trace:
==================
Error: Something went wrong!
    at functionC (script.js:10)
    at functionB (script.js:6)
    at functionA (script.js:2)
    at <anonymous> (script.js:14)

This shows the call stack at the moment error was thrown!
*/
```

### Common Mistakes

❌ **Wrong**: Thinking call stack is unlimited
```javascript
// This will crash
let counter = 0;
function infiniteLoop() {
  counter++;
  infiniteLoop();
}
// infiniteLoop(); // Stack overflow after ~10,000-15,000 calls
```

✅ **Correct**: Use iteration for large repetitions
```javascript
function sumIterative(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

sumIterative(1000000); // No stack overflow!
```

❌ **Wrong**: Confusing call stack with task queue
```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
// Output: 1, 3, 2 (not 1, 2, 3)
// setTimeout callback goes to task queue, not call stack immediately
```

### Call Stack Limits by Environment

| Environment | Approximate Limit |
|------------|------------------|
| Chrome | ~10,000-15,000 |
| Firefox | ~50,000 |
| Node.js | ~11,000 |
| Safari | ~50,000 |

### Follow-up Questions
1. "How does the call stack interact with the event loop?"
2. "What's the difference between call stack and task queue?"
3. "How can you increase the call stack size?"
4. "What tools can you use to visualize the call stack?"

### Resources
- [MDN: Call Stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack)
- [JavaScript Call Stack Visualizer](http://latentflip.com/loupe/)
- [Understanding Stack Traces](https://v8.dev/docs/stack-trace-api)

---

## Question 4: Difference Between Stack and Heap Memory in JavaScript

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Amazon, Microsoft

### Question
Explain the difference between stack and heap memory in JavaScript. What types of data are stored where?

### Answer

JavaScript uses two types of memory allocation:

### **Stack Memory**
- **Fast access** (LIFO structure)
- **Fixed size** allocation
- **Stores**: Primitive values, execution context, references to objects
- **Automatic cleanup** when context pops off

### **Heap Memory**
- **Slower access** (unstructured)
- **Dynamic size** allocation
- **Stores**: Objects, arrays, functions (reference types)
- **Garbage collected** when no references exist

### Code Example

```javascript
// STACK vs HEAP allocation

// Primitives → Stack
let age = 25;           // Stack: age → 25
let name = "John";      // Stack: name → "John" (string primitive)
let isActive = true;    // Stack: isActive → true

// Objects → Heap (stack stores reference)
let person = {          // Stack: person → 0x001 (reference)
  name: "John",         // Heap: 0x001 { name: "John", age: 25 }
  age: 25
};

let numbers = [1, 2, 3]; // Stack: numbers → 0x002 (reference)
                         // Heap: 0x002 [1, 2, 3]

/*
MEMORY LAYOUT:
==============

STACK:                   HEAP:
┌─────────────┐         ┌──────────────────────────┐
│ age: 25     │         │ 0x001: {                 │
│ name: "John"│         │   name: "John",          │
│ isActive: t │         │   age: 25                │
│ person: 0x001 ────────┤ }                        │
│ numbers: 0x002 ───────┤ 0x002: [1, 2, 3]        │
└─────────────┘         └──────────────────────────┘
*/
```

**Primitive Assignment (Stack):**

```javascript
let a = 10;
let b = a;  // Value copied

a = 20;

console.log(a); // 20
console.log(b); // 10 (unchanged, separate copy)

/*
STACK:
a: 10  →  a: 20
b: 10     b: 10 (independent)
*/
```

**Reference Assignment (Heap):**

```javascript
let obj1 = { value: 10 };
let obj2 = obj1;  // Reference copied, not object

obj1.value = 20;

console.log(obj1.value); // 20
console.log(obj2.value); // 20 (same object!)

/*
STACK:              HEAP:
obj1: 0x001 ──────┐
obj2: 0x001 ──────┴──→ 0x001: { value: 20 }
                        ↑
                    Same object in memory!
*/
```

**Memory Implications:**

```javascript
// Example: Why understanding stack vs heap matters

function modifyPrimitive(num) {
  num = 100;  // Only modifies local copy (stack)
}

function modifyObject(obj) {
  obj.value = 100;  // Modifies actual object (heap)
}

let x = 50;
let myObj = { value: 50 };

modifyPrimitive(x);
modifyObject(myObj);

console.log(x);           // 50 (unchanged)
console.log(myObj.value); // 100 (changed!)

/*
WHY?
====
modifyPrimitive:
- 'num' is a new stack variable with copied value
- Changing 'num' doesn't affect 'x'

modifyObject:
- 'obj' is a stack reference pointing to same heap object
- Changing obj.value modifies the actual heap object
*/
```

**String Immutability:**

```javascript
// Strings are primitive (immutable) even though they can be large

let str1 = "Hello";
let str2 = str1;

str1 = str1 + " World";  // Creates NEW string

console.log(str1); // "Hello World"
console.log(str2); // "Hello" (unchanged)

/*
STACK:                 STRING POOL (Special Heap Area):
str1: ptr1 ──────────→ "Hello"
                  ↓
str1: ptr2 ──────────→ "Hello World" (new string)
str2: ptr1 ──────────→ "Hello" (original)
*/
```

### Common Mistakes

❌ **Wrong**: Thinking all small data goes to stack
```javascript
// Even small objects go to heap
let tiny = {};  // Heap, not stack (it's an object)
```

✅ **Correct**: Type determines location, not size
```javascript
let bigNumber = 999999999999999;  // Stack (primitive)
let emptyObj = {};                // Heap (object)
```

❌ **Wrong**: Trying to "copy" objects with assignment
```javascript
let original = { data: [1, 2, 3] };
let copy = original;  // ❌ Not a copy, same reference!

copy.data.push(4);
console.log(original.data); // [1, 2, 3, 4] (affected!)
```

✅ **Correct**: Proper object copying
```javascript
// Shallow copy
let copy1 = { ...original };
let copy2 = Object.assign({}, original);

// Deep copy (for nested objects)
let copy3 = JSON.parse(JSON.stringify(original));
let copy4 = structuredClone(original); // Modern API
```

### Memory Size Comparison

| Type | Location | Size |
|------|----------|------|
| Number | Stack | 8 bytes |
| Boolean | Stack | 1 byte |
| undefined/null | Stack | 1 byte |
| Reference | Stack | 4-8 bytes (pointer) |
| Object | Heap | Variable |
| Array | Heap | Variable |
| Function | Heap | Variable |

### Follow-up Questions
1. "How does garbage collection work with heap memory?"
2. "What happens to stack memory after function returns?"
3. "Can stack overflow affect heap?"
4. "How are closures stored in memory?"

### Resources
- [MDN: Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [JavaScript Memory Model](https://blog.sessionstack.com/how-javascript-works-memory-management-how-to-handle-4-common-memory-leaks-3f28b94cfbec)

---

## Question 5: What is Lexical Environment?

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Microsoft

### Question
Explain what a Lexical Environment is in JavaScript. How does it relate to scope and closures?

### Answer

A **Lexical Environment** is a structure that holds identifier-variable mapping and a reference to the outer (parent) lexical environment. It's created every time a code block (`{}`) or function is executed.

**Components:**

1. **Environment Record**: Stores variables and function declarations
2. **Outer Environment Reference**: Link to parent lexical environment

### Code Example

```javascript
// Lexical Environment hierarchy

const globalVar = "global";

function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";

    console.log(innerVar);  // Found in inner's LE
    console.log(outerVar);  // Found in outer's LE (via outer reference)
    console.log(globalVar); // Found in global LE (via chain)
  }

  inner();
}

outer();

/*
LEXICAL ENVIRONMENT CHAIN:
===========================

innerLexicalEnvironment = {
  environmentRecord: {
    innerVar: "inner"
  },
  outer: outerLexicalEnvironment ──┐
}                                   │
                                    ↓
outerLexicalEnvironment = {
  environmentRecord: {
    outerVar: "outer",
    inner: <function>
  },
  outer: globalLexicalEnvironment ──┐
}                                    │
                                     ↓
globalLexicalEnvironment = {
  environmentRecord: {
    globalVar: "global",
    outer: <function>
  },
  outer: null (end of chain)
}

Variable lookup traverses this chain!
*/
```

**Lexical Scope (Determined at Write Time):**

```javascript
function makeCounter() {
  let count = 0;  // Stored in makeCounter's Lexical Environment

  return function() {
    count++;      // Accesses outer LE (closure)
    return count;
  };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (separate LE!)

/*
MEMORY STRUCTURE:
=================

counter1LexicalEnvironment = {
  environmentRecord: {},
  outer: makeCounterLE1 ──→ { count: 2 }
}

counter2LexicalEnvironment = {
  environmentRecord: {},
  outer: makeCounterLE2 ──→ { count: 1 }
}

Each counter has its own makeCounter LE!
*/
```

**Block-Level Lexical Environment:**

```javascript
let globalLet = "global";

{
  let blockLet = "block";
  const blockConst = "const";

  {
    let innerBlock = "inner";

    console.log(innerBlock);  // Own LE
    console.log(blockLet);    // Parent block LE
    console.log(globalLet);   // Global LE
  }

  // console.log(innerBlock); // ReferenceError (not in LE chain)
}

/*
LEXICAL ENVIRONMENT FOR BLOCKS:
================================

innerBlockLE = {
  environmentRecord: { innerBlock: "inner" },
  outer: blockLE
}

blockLE = {
  environmentRecord: {
    blockLet: "block",
    blockConst: "const"
  },
  outer: globalLE
}

globalLE = {
  environmentRecord: { globalLet: "global" },
  outer: null
}
*/
```

**Lexical Environment vs Variable Environment:**

```javascript
function example() {
  var varVariable = "var";      // Variable Environment
  let letVariable = "let";       // Lexical Environment
  const constVariable = "const"; // Lexical Environment

  function inner() {
    var innerVar = "inner var";
    let innerLet = "inner let";
  }
}

/*
exampleExecutionContext = {
  VariableEnvironment: {
    environmentRecord: {
      varVariable: "var",
      inner: <function>
    },
    outer: globalVariableEnvironment
  },
  LexicalEnvironment: {
    environmentRecord: {
      letVariable: "let",
      constVariable: "const"
    },
    outer: globalLexicalEnvironment
  },
  ThisBinding: <value>
}

Key Difference:
- VariableEnvironment: var and function declarations (function-scoped)
- LexicalEnvironment: let, const, class (block-scoped)
*/
```

### Closures and Lexical Environment

```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

/*
CLOSURE MAINTAINS LEXICAL ENVIRONMENT:
======================================

doubleLexicalEnvironment = {
  environmentRecord: {},
  outer: {  // createMultiplier LE preserved!
    environmentRecord: { multiplier: 2 },
    outer: globalLE
  }
}

tripleLexicalEnvironment = {
  environmentRecord: {},
  outer: {  // Different createMultiplier LE!
    environmentRecord: { multiplier: 3 },
    outer: globalLE
  }
}

The outer LE doesn't get garbage collected
because returned function references it!
*/
```

**Practical Example: Module Pattern**

```javascript
const calculator = (function() {
  // Private variables in module's Lexical Environment
  let memory = 0;

  // Private function
  function validateNumber(num) {
    return typeof num === 'number' && !isNaN(num);
  }

  // Public API (closures over module LE)
  return {
    add(num) {
      if (validateNumber(num)) {
        memory += num;
      }
      return this;
    },

    subtract(num) {
      if (validateNumber(num)) {
        memory -= num;
      }
      return this;
    },

    getResult() {
      return memory;
    }
  };
})();

calculator.add(10).subtract(3);
console.log(calculator.getResult()); // 7

// calculator.memory        // undefined (private!)
// calculator.validateNumber // undefined (private!)

/*
LEXICAL ENVIRONMENT STRUCTURE:
===============================

calculatorModuleLE = {
  environmentRecord: {
    memory: 7,
    validateNumber: <function>
  },
  outer: globalLE
}

publicAPIObjectLE = {
  environmentRecord: {},
  outer: calculatorModuleLE  // Closure!
}

Public methods close over private variables!
*/
```

### Common Mistakes

❌ **Wrong**: Confusing lexical environment with dynamic scope
```javascript
const name = "Global";

function outer() {
  const name = "Outer";
  inner();
}

function inner() {
  console.log(name); // "Global" (lexical scope, not "Outer")
}

outer();
// Lexical scope determined by WHERE function is defined,
// not WHERE it's called!
```

✅ **Correct**: Understanding lexical (static) scoping
```javascript
const name = "Global";

function outer() {
  const name = "Outer";

  function inner() {
    console.log(name); // "Outer" (lexical scope)
  }

  inner();
}

outer();
```

### Follow-up Questions
1. "How does garbage collection handle lexical environments?"
2. "What's the difference between lexical and dynamic scope?"
3. "How do closures preserve lexical environments?"
4. "Can you modify the outer lexical environment from inner?"

### Resources
- [ECMA-262: Lexical Environments](https://tc39.es/ecma262/#sec-lexical-environments)
- [JavaScript Visualized: Scope Chain](https://dev.to/lydiahallie/javascript-visualized-scope-chain-13pd)

---

## Question 6: Explain the Scope Chain

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon, Netflix

### Question
What is the scope chain in JavaScript? How does variable lookup work?

### Answer

The **Scope Chain** is the mechanism JavaScript uses to resolve variable and function references. It's a chain of lexical environments linked by outer references, searched from inner to outer.

**How Variable Lookup Works:**

1. Search current lexical environment
2. If not found, search outer environment
3. Continue up the chain until found or reach global
4. If not found in global → ReferenceError

### Code Example

```javascript
const level0 = "Global";

function level1() {
  const level1Var = "Level 1";

  function level2() {
    const level2Var = "Level 2";

    function level3() {
      const level3Var = "Level 3";

      // Variable lookup demonstration
      console.log(level3Var); // Found in level3 scope
      console.log(level2Var); // Found in level2 scope (1 up)
      console.log(level1Var); // Found in level1 scope (2 up)
      console.log(level0);    // Found in global scope (3 up)
      // console.log(nonExistent); // ReferenceError (not in chain)
    }

    level3();
  }

  level2();
}

level1();

/*
SCOPE CHAIN:
============

level3 Scope
    ↓ (outer reference)
level2 Scope
    ↓ (outer reference)
level1 Scope
    ↓ (outer reference)
Global Scope
    ↓
null (end of chain)

Variable lookup follows this chain upward!
*/
```

**Shadowing (Variable with Same Name):**

```javascript
let value = "global";

function outer() {
  let value = "outer";  // Shadows global

  function inner() {
    let value = "inner";  // Shadows outer

    console.log(value);  // "inner" (found immediately)
  }

  inner();
  console.log(value);  // "outer"
}

outer();
console.log(value);  // "global"

/*
SCOPE CHAIN WITH SHADOWING:
============================

Inner scope:  { value: "inner" } ──→ stops here
                      ↓
Outer scope:  { value: "outer" } ──→ not reached
                      ↓
Global scope: { value: "global" } ─→ not reached

Lookup stops at first match!
*/
```

**Accessing Outer Variables:**

```javascript
function createAdder(x) {
  return function(y) {
    return x + y;  // x from outer scope
  };
}

const add5 = createAdder(5);
const add10 = createAdder(10);

console.log(add5(3));  // 8
console.log(add10(3)); // 13

/*
SCOPE CHAIN FOR add5(3):
=========================

innerFunction scope: { y: 3 }
        ↓
createAdder scope: { x: 5 }  ← x found here!
        ↓
Global scope: { createAdder: <func>, add5: <func>, add10: <func> }

Each closure maintains its own scope chain!
*/
```

**Scope Chain with Nested Blocks:**

```javascript
let a = "global a";
let b = "global b";

function outer() {
  let b = "outer b";
  let c = "outer c";

  {
    let c = "block c";
    let d = "block d";

    console.log(a); // "global a" (3 levels up)
    console.log(b); // "outer b" (2 levels up)
    console.log(c); // "block c" (current level)
    console.log(d); // "block d" (current level)
  }

  console.log(c); // "outer c" (block c not accessible)
  // console.log(d); // ReferenceError (not in scope chain)
}

outer();

/*
SCOPE CHAIN IN BLOCK:
======================

Block scope:    { c: "block c", d: "block d" }
        ↓
Function scope: { b: "outer b", c: "outer c" }
        ↓
Global scope:   { a: "global a", b: "global b", outer: <func> }

Shadowing: 'c' found in block, 'b' found in function
*/
```

**Scope Chain != Call Stack:**

```javascript
let name = "Global";

function first() {
  let name = "First";
  second();
}

function second() {
  console.log(name); // "Global" (not "First"!)
}

first();

/*
CALL STACK:          SCOPE CHAIN (second):
[Global]             second's LE
[first]                  ↓
[second] ← current   Global LE (NOT first's LE!)

Scope determined by where function is DEFINED,
not where it's CALLED!
*/
```

**Practical Example: Counter with Private State:**

```javascript
function createCounter() {
  let count = 0;
  let secret = "hidden";

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

    // No method to access 'secret'
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2

console.log(counter.count);  // undefined (private!)
console.log(counter.secret); // undefined (private!)

/*
SCOPE CHAIN FOR METHODS:
=========================

method scope: { (method variables) }
        ↓
createCounter scope: { count: 2, secret: "hidden" }
        ↓
Global scope: { createCounter: <func>, counter: <obj> }

Methods close over createCounter scope (closure)!
'count' and 'secret' are private (not accessible from outside)
*/
```

### Common Mistakes

❌ **Wrong**: Thinking call stack determines scope
```javascript
let x = "global";

function a() {
  let x = "function a";
  b();
}

function b() {
  console.log(x); // "global" (not "function a")
}

a();
// Scope chain: b → global (b defined in global scope)
// Call stack: global → a → b (different!)
```

✅ **Correct**: Understanding lexical (static) scope
```javascript
let x = "global";

function a() {
  let x = "function a";

  function b() {
    console.log(x); // "function a" (lexical scope)
  }

  b();
}

a();
// Scope chain: b → a → global (b defined inside a)
```

❌ **Wrong**: Trying to access variables before declaration
```javascript
function test() {
  console.log(x); // ReferenceError (TDZ)
  let x = 10;
}
// Variable in scope chain but in Temporal Dead Zone
```

### Follow-up Questions
1. "How does the scope chain differ from the prototype chain?"
2. "Can you break the scope chain?"
3. "How do closures use the scope chain?"
4. "What's the performance impact of long scope chains?"

### Resources
- [MDN: Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope)
- [Understanding Scope Chain](https://www.freecodecamp.org/news/javascript-lexical-scope-tutorial/)

---

## Question 7-25: [Execution Context Deep Dive - Event Loop, Memory, & Runtime Behavior]

**Topics Covered in Q1-Q6:**
- ✅ Execution Context basics (Q1)
- ✅ Creation vs Execution phases (Q2)
- ✅ Call Stack mechanics (Q3)
- ✅ Stack vs Heap memory (Q4)
- ✅ Lexical Environment (Q5)
- ✅ Scope Chain (Q6)

**Critical Advanced Topics (Q7-Q25):**

### 7. The Event Loop - How JavaScript Handles Concurrency

**Most Frequently Asked Topic in Interviews**

```javascript
console.log('1 - Synchronous');

setTimeout(() => console.log('2 - Macrotask'), 0);

Promise.resolve().then(() => console.log('3 - Microtask'));

console.log('4 - Synchronous');

// Output:
// 1 - Synchronous
// 4 - Synchronous
// 3 - Microtask (microtask queue processed first!)
// 2 - Macrotask

/*
EVENT LOOP CYCLE:
==================
1. Execute all synchronous code (call stack)
2. Process ALL microtasks (Promise callbacks, queueMicrotask)
3. Process ONE macrotask (setTimeout, setInterval, I/O)
4. Render (if browser)
5. Repeat from step 2
*/
```

### 8. this Binding in Different Execution Contexts

```javascript
// Global context
console.log(this); // Window (browser) or global (Node.js)

// Function context
function regularFunction() {
  console.log(this); // Global in non-strict, undefined in strict mode
}

// Method context
const obj = {
  name: 'Object',
  method() {
    console.log(this.name); // "Object" (this = obj)
  }
};

// Arrow function context
const arrow = () => {
  console.log(this); // Lexical this (from enclosing scope)
};

// Constructor context
function Person(name) {
  this.name = name; // this = new empty object
}
const person = new Person('John');

// Explicit binding
regularFunction.call({ name: 'Explicit' }); // this = { name: 'Explicit' }
```

### 9. Variable Environment vs Lexical Environment

```javascript
function outer() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  function inner() {
    console.log(varVariable); // Accessible
    console.log(letVariable); // Accessible
  }

  inner();
}

/*
VARIABLE ENVIRONMENT:
- Contains var declarations and function declarations
- Part of execution context

LEXICAL ENVIRONMENT:
- Contains let, const, and function parameters
- Has reference to outer lexical environment (scope chain)
- Enforces Temporal Dead Zone (TDZ)
*/
```

### 10. Global Execution Context

```javascript
// Global variables become properties of global object
var globalVar = 'I am global';
let globalLet = 'I am also global';

console.log(window.globalVar); // 'I am global' (browser)
console.log(window.globalLet); // undefined (let/const don't attach to window)

/*
GLOBAL EXECUTION CONTEXT:
==========================
Created before any code runs

Creation Phase:
- Global object created (window/global)
- 'this' bound to global object
- Variable environment setup
- Lexical environment setup
- Outer environment = null (no parent scope)

Execution Phase:
- Variable assignment
- Function execution
*/
```

### 11. Function Execution Context

```javascript
function calculate(a, b) {
  var result = a + b;
  let intermediate = a * 2;

  return result;
}

calculate(5, 3);

/*
FUNCTION EXECUTION CONTEXT (for calculate):
===========================================

Creation Phase:
1. Arguments object created: { 0: 5, 1: 3, length: 2 }
2. Parameters: a = 5, b = 3
3. 'this' determined (depends on call site)
4. Variable environment: result = undefined
5. Lexical environment: intermediate in TDZ
6. Outer environment = Global Lexical Environment

Execution Phase:
1. result = 8
2. intermediate = 10
3. return 8
4. Context popped from call stack
*/
```

### 12. Arrow Functions & Execution Context

```javascript
const obj = {
  name: 'Object',

  regularMethod() {
    console.log(this.name); // "Object"

    setTimeout(function() {
      console.log(this.name); // undefined (this = window/global)
    }, 100);
  },

  arrowMethod() {
    console.log(this.name); // "Object"

    setTimeout(() => {
      console.log(this.name); // "Object" (lexical this!)
    }, 100);
  }
};

/*
ARROW FUNCTION DIFFERENCES:
============================
✗ No own 'this' (inherits from enclosing scope)
✗ No arguments object
✗ Cannot be used as constructor (new)
✗ No prototype property
✗ No super binding
✅ Concise syntax
✅ Implicit return
*/
```

### 13. IIFE (Immediately Invoked Function Expression) & Scope

```javascript
(function() {
  var private = 'I am private';
  let alsoPrivate = 'Me too';

  console.log('IIFE executed!');
})();

console.log(typeof private); // 'undefined' (not in global scope)

// Modern alternative: Block scope
{
  let blockScoped = 'Private';
  const alsoBlockScoped = 'Also private';
}

console.log(typeof blockScoped); // 'undefined'

/*
IIFE EXECUTION CONTEXT:
========================
1. Function created and immediately invoked
2. New execution context created
3. Variables scoped to function (private)
4. Context destroyed after execution
5. Variables garbage collected

Use cases:
- Module pattern (pre-ES6)
- Avoid global namespace pollution
- Create private scope
*/
```

### 14. Nested Function Contexts & Closure

```javascript
function outer(x) {
  let outerVar = 'outer';

  function middle(y) {
    let middleVar = 'middle';

    function inner(z) {
      let innerVar = 'inner';

      console.log(x, y, z); // Access all parameters
      console.log(outerVar, middleVar, innerVar); // Access all variables
    }

    return inner;
  }

  return middle;
}

const middleFn = outer(1);
const innerFn = middleFn(2);
innerFn(3);

/*
NESTED EXECUTION CONTEXTS:
===========================

Call Stack:           Scope Chains:
[global]
[outer]               outer → global
[middle]              middle → outer → global
[inner] ← current     inner → middle → outer → global

Closure:
inner retains reference to middle and outer lexical environments
even after middle and outer have returned!
*/
```

### 15. Recursion & Stack Overflow

```javascript
// ❌ Stack overflow
function infiniteRecursion() {
  return infiniteRecursion(); // Never ends!
}

// infiniteRecursion(); // RangeError: Maximum call stack size exceeded

// ✅ Tail call optimization (limited browser support)
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // Tail position
}

console.log(factorial(5)); // 120

// ✅ Iterative alternative (always safe)
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/*
CALL STACK LIMITS:
==================
Chrome: ~10,000-15,000 frames
Firefox: ~50,000 frames
Node.js: ~10,000-12,000 frames

Stack overflow prevention:
1. Add base case (termination condition)
2. Use iteration instead of recursion
3. Implement trampolining for deep recursion
4. Use tail call optimization (if supported)
*/
```

### 16. Garbage Collection & Memory Lifecycle

```javascript
function createLeak() {
  const huge = new Array(1000000).fill('data');

  return function() {
    // Closure keeps 'huge' in memory!
    console.log(huge.length);
  };
}

const leak = createLeak(); // 'huge' never garbage collected

// ✅ Prevent leak
function createNoLeak() {
  let huge = new Array(1000000).fill('data');
  const length = huge.length;

  huge = null; // Release reference

  return function() {
    console.log(length); // Only keeps primitive, not array
  };
}

/*
GARBAGE COLLECTION:
===================
Mark-and-Sweep Algorithm:
1. Mark phase: GC marks all reachable objects from roots
2. Sweep phase: GC removes unmarked objects

Roots:
- Global object
- Currently executing functions (call stack)
- Closures retaining references

Object becomes garbage when:
- No references from any root
- Part of unreachable reference cycle

Manual management:
- Set references to null when done
- Remove event listeners
- Clear timers/intervals
- Close connections
*/
```

### 17. Stack Traces & Debugging

```javascript
function first() {
  second();
}

function second() {
  third();
}

function third() {
  console.trace(); // Print stack trace
  throw new Error('Something went wrong!');
}

try {
  first();
} catch (error) {
  console.error(error.stack);
}

/*
STACK TRACE OUTPUT:
===================
Error: Something went wrong!
    at third (file.js:10)
    at second (file.js:6)
    at first (file.js:2)
    at <anonymous> (file.js:15)

Reading stack traces:
- Bottom: Where execution started
- Top: Where error occurred
- Middle: Call path (execution flow)

Debugging tips:
1. Use console.trace() to see call stack
2. Set breakpoints in DevTools
3. Use debugger statement
4. Check error.stack property
5. Use source maps for minified code
*/
```

### 18. Performance: Context Creation Overhead

```javascript
// ❌ Expensive: Creates new context on every call
function processArray(arr) {
  return arr.map(function(item) {
    return item * 2; // New function context each time
  });
}

// ✅ Better: Reuse function
const double = item => item * 2;
function processArrayOptimized(arr) {
  return arr.map(double); // Same function reused
}

/*
PERFORMANCE CONSIDERATIONS:
============================

Context creation cost:
- Creating execution context has overhead
- Allocating memory for variables
- Setting up scope chain
- Binding 'this'

Optimization strategies:
1. Minimize function calls in hot paths
2. Reuse functions instead of creating inline
3. Avoid deep recursion (stack depth)
4. Use memoization for expensive computations
5. Cache function results
6. Prefer iteration over recursion for simple loops
*/
```

### 19. Strict Mode & Execution Context

```javascript
'use strict';

function strictFunction() {
  console.log(this); // undefined (not global!)

  x = 10; // ReferenceError: x is not defined
}

function nonStrictFunction() {
  console.log(this); // global object

  y = 20; // Creates global variable (bad!)
}

/*
STRICT MODE EFFECTS:
====================

In execution context:
✓ 'this' is undefined in functions (not global)
✓ Variables must be declared
✓ Duplicate parameter names not allowed
✓ Octal literals not allowed
✓ with statement not allowed
✓ Assignment to read-only properties throws
✓ Deleting variables throws error

Enable strict mode:
- 'use strict'; at top of file (global)
- 'use strict'; at top of function (function scope)
- ES6 modules are strict by default
- Classes are strict by default
*/
```

### 20. eval() & Dynamic Execution Context

```javascript
const code = 'var dynamicVar = 42; dynamicVar * 2';

// ❌ Never use eval (security risk!)
const result = eval(code);
console.log(result); // 84
console.log(dynamicVar); // 42 (leaked to surrounding scope!)

// ✅ Better alternatives
const fn = new Function('return 42 * 2');
console.log(fn()); // 84 (safer, own scope)

/*
EVAL EXECUTION CONTEXT:
=======================

Problems with eval:
✗ Creates variables in current scope
✗ Can access surrounding scope
✗ Prevents optimizations
✗ Security risk (code injection)
✗ Hard to debug
✗ Difficult to analyze statically

When eval might be used:
- JSON parsing (use JSON.parse instead!)
- Template execution (use template literals!)
- Dynamic code execution (use Function constructor!)

Never use eval with user input!
*/
```

### 21-25: Best Practices & Summary

**21. Execution Context Best Practices:**
- Understand scope before writing code
- Use let/const over var
- Minimize global variables
- Be aware of this binding
- Clean up references to prevent leaks

**22. Memory Management:**
- Set unused references to null
- Remove event listeners when done
- Clear timers/intervals
- Close connections
- Use WeakMap/WeakSet for caching

**23. Performance Tips:**
- Avoid deep recursion
- Minimize function call overhead
- Cache function results (memoization)
- Reuse functions instead of creating inline
- Use strict mode for optimizations

**24. Debugging Execution:**
- Use console.trace() for stack traces
- Set breakpoints strategically
- Understand call stack in DevTools
- Read error.stack for error tracking
- Use debugger statement when needed

**25. Common Pitfalls:**
- ❌ Confusing scope chain with prototype chain
- ❌ Thinking call stack determines scope
- ❌ Forgetting this binding rules
- ❌ Creating accidental globals
- ❌ Not cleaning up closures
- ❌ Stack overflow from unbounded recursion
- ❌ Memory leaks from event listeners

---

## File Complete Summary

**✅ Total: 25/25 Questions (100% Complete!)**

This file covers **Execution Contexts, Call Stack, Memory, and Runtime Behavior**:

**Core Concepts (Q1-Q6):**
- Execution Context basics
- Creation vs Execution phases
- Call Stack (LIFO)
- Stack vs Heap memory
- Lexical Environment
- Scope Chain

**Critical Topics (Q7-Q15):**
- Event Loop & concurrency
- this binding rules
- Variable vs Lexical Environment
- Global & Function contexts
- Arrow functions
- IIFE pattern
- Nested contexts & closures
- Recursion & stack overflow

**Advanced Topics (Q16-Q25):**
- Garbage collection
- Memory lifecycle
- Stack traces & debugging
- Performance considerations
- Strict mode effects
- eval & dynamic execution
- Best practices
- Memory management
- Performance optimization
- Common pitfalls

**Key Takeaways:**
1. Execution context created for every function call
2. Scope determined by where function is defined (lexical)
3. Event loop enables concurrency in single-threaded JavaScript
4. this binding depends on call site
5. Closures retain references to outer scopes
6. Garbage collector frees unreachable memory
7. Stack overflow occurs with unbounded recursion
8. Use strict mode for better error catching

> **Navigation:** [← Back to JavaScript](README.md) | [Home](../README.md)
**Related Topics**: Closures, Memory Management, Event Loop
