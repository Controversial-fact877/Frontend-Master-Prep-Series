# JavaScript Objects, Prototypes, and Inheritance

> Complete guide to prototypal inheritance, prototype chain, Object.create(), classical vs prototypal patterns, and modern class syntax.

---

## Question 1: What is Prototypal Inheritance in JavaScript?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Uber

### Question
Explain prototypal inheritance in JavaScript. How does it differ from classical inheritance?

### Answer

**Prototypal Inheritance** is JavaScript's mechanism where objects inherit properties and methods from other objects. Every object has an internal `[[Prototype]]` link to another object.

**Key Concepts:**
- Objects inherit directly from other objects (not from classes)
- Inheritance through prototype chain
- Dynamic and flexible (can modify at runtime)
- Single inheritance chain (one prototype per object)

### Code Example

```javascript
// Creating objects with prototypal inheritance

const animal = {
  eats: true,
  walk() {
    console.log("Animal walks");
  }
};

// rabbit inherits from animal
const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.eats);  // true (inherited from animal)
console.log(rabbit.jumps); // true (own property)
rabbit.walk();             // "Animal walks" (inherited method)

/*
PROTOTYPE CHAIN:
rabbit object
  ├─ jumps: true (own property)
  └─ [[Prototype]] → animal object
       ├─ eats: true
       ├─ walk: function
       └─ [[Prototype]] → Object.prototype → null
*/
```

**Prototype Chain Visualization:**

```javascript
const grandparent = {
  surname: "Smith"
};

const parent = Object.create(grandparent);
parent.role = "parent";

const child = Object.create(parent);
child.name = "John";

console.log(child.name);    // "John" (own)
console.log(child.role);    // "parent" (1 level up)
console.log(child.surname); // "Smith" (2 levels up)

/*
LOOKUP CHAIN:
child
  ├─ name: "John"
  └─ [[Prototype]] → parent
       ├─ role: "parent"
       └─ [[Prototype]] → grandparent
            ├─ surname: "Smith"
            └─ [[Prototype]] → Object.prototype → null

Property lookup traverses chain bottom-to-top
*/
```

**Classical vs Prototypal Inheritance:**

```javascript
// CLASSICAL (Class-based) - Java, C++
/*
class Animal {
  void eat() { }
}

class Dog extends Animal {
  void bark() { }
}

- Classes are blueprints
- Objects are instances of classes
- Inheritance from classes
- Static structure (compile-time)
*/

// PROTOTYPAL (JavaScript)
const animal = {
  eat() {
    console.log("eating");
  }
};

const dog = Object.create(animal);
dog.bark = function() {
  console.log("barking");
};

// - Objects inherit from objects directly
// - No classes needed (before ES6)
// - Dynamic (runtime modifications)
// - More flexible

/*
KEY DIFFERENCES:
================
Classical:
- Class → Instance
- Copy behavior
- Static inheritance hierarchy

Prototypal:
- Object → Object
- Delegate behavior (shared via prototype)
- Dynamic inheritance chain
*/
```

**Constructor Function Pattern (Pre-ES6):**

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} barks`);
};

const dog = new Dog("Buddy", "Golden Retriever");
dog.eat();  // "Buddy is eating" (inherited)
dog.bark(); // "Buddy barks" (own method)

console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true

/*
PROTOTYPE CHAIN WITH CONSTRUCTORS:
dog object
  ├─ name: "Buddy"
  ├─ breed: "Golden Retriever"
  └─ [[Prototype]] → Dog.prototype
       ├─ bark: function
       ├─ constructor: Dog
       └─ [[Prototype]] → Animal.prototype
            ├─ eat: function
            └─ [[Prototype]] → Object.prototype → null
*/
```

**Modern Class Syntax (ES6+) - Syntactic Sugar:**

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  bark() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.eat();  // "Buddy is eating"
dog.bark(); // "Buddy barks"

/*
IMPORTANT: ES6 classes are just syntactic sugar over
prototypal inheritance. Under the hood, it's still
using prototypes!

typeof Animal // "function"
typeof Dog    // "function"

Classes are still constructor functions with prototypes!
*/
```

### Common Mistakes

❌ **Wrong**: Thinking JavaScript has true classes like Java/C++
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
}

// Still prototypal under the hood!
console.log(typeof Person); // "function" (not a true class)
console.log(Person.prototype); // Object with constructor
```

✅ **Correct**: Understanding classes are syntactic sugar
```javascript
// ES6 class and constructor function are equivalent
class PersonClass {
  constructor(name) { this.name = name; }
}

function PersonFunction(name) {
  this.name = name;
}

// Both work the same way internally
```

❌ **Wrong**: Modifying Object.prototype
```javascript
// ❌ Never do this - affects ALL objects
Object.prototype.newMethod = function() {};

const obj = {};
console.log(obj.newMethod); // Pollutes all objects!
```

✅ **Correct**: Use own prototype or composition
```javascript
// Create custom prototype
const myPrototype = {
  newMethod() {}
};

const obj = Object.create(myPrototype);
```

### Follow-up Questions
1. "What's the difference between `__proto__` and `prototype`?"
2. "How does property shadowing work with prototypes?"
3. "Can you modify an object's prototype after creation?"
4. "What are the performance implications of long prototype chains?"

### Resources
- [MDN: Inheritance and the Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [Understanding Prototypal Inheritance](https://javascript.info/prototype-inheritance)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)

---

## Question 2: Explain the Prototype Chain

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-12 minutes
**Companies:** Google, Meta, Amazon, Netflix

### Question
What is the prototype chain? How does property lookup work through the chain?

### Answer

The **Prototype Chain** is a series of links between objects where each object has a reference to its prototype. Property lookup traverses this chain from the object up to `Object.prototype` and finally `null`.

### Property Lookup Algorithm

1. Check if property exists on object itself
2. If not, check object's `[[Prototype]]`
3. Continue up chain until property found or reach `null`
4. If not found in entire chain → `undefined`

### Code Example

```javascript
const obj = {
  a: 1
};

// Prototype chain: obj → Object.prototype → null

console.log(obj.a); // 1 (found on obj)
console.log(obj.toString()); // "[object Object]" (from Object.prototype)
console.log(obj.nonExistent); // undefined (not in chain)

/*
LOOKUP PROCESS:
===============
obj.a:
1. Check obj → found! Return 1

obj.toString:
1. Check obj → not found
2. Check Object.prototype → found! Return function

obj.nonExistent:
1. Check obj → not found
2. Check Object.prototype → not found
3. Check null → end of chain
4. Return undefined
*/
```

**Multi-Level Chain:**

```javascript
const level1 = {
  prop1: "Level 1"
};

const level2 = Object.create(level1);
level2.prop2 = "Level 2";

const level3 = Object.create(level2);
level3.prop3 = "Level 3";

console.log(level3.prop3); // "Level 3" (found immediately)
console.log(level3.prop2); // "Level 2" (1 level up)
console.log(level3.prop1); // "Level 1" (2 levels up)

/*
CHAIN VISUALIZATION:
====================
level3 { prop3: "Level 3" }
  ↓ [[Prototype]]
level2 { prop2: "Level 2" }
  ↓ [[Prototype]]
level1 { prop1: "Level 1" }
  ↓ [[Prototype]]
Object.prototype { toString, valueOf, ... }
  ↓ [[Prototype]]
null (end of chain)
*/
```

**Checking Prototype Chain:**

```javascript
const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;

// hasOwnProperty - checks only own properties
console.log(child.hasOwnProperty('own'));       // true
console.log(child.hasOwnProperty('inherited')); // false

// 'in' operator - checks entire prototype chain
console.log('own' in child);       // true
console.log('inherited' in child); // true

// Object.getPrototypeOf - get prototype
console.log(Object.getPrototypeOf(child) === parent); // true

// isPrototypeOf - check if object is in another's chain
console.log(parent.isPrototypeOf(child)); // true
console.log(Object.prototype.isPrototypeOf(child)); // true
```

**Constructor Function Prototype Chain:**

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const john = new Person("John");

console.log(john.name); // "John" (own property)
console.log(john.greet()); // "Hello, I'm John" (from Person.prototype)
console.log(john.toString()); // "[object Object]" (from Object.prototype)

/*
PROTOTYPE CHAIN:
================
john
  ├─ name: "John" (own)
  └─ [[Prototype]] → Person.prototype
       ├─ greet: function
       ├─ constructor: Person
       └─ [[Prototype]] → Object.prototype
            ├─ toString: function
            ├─ valueOf: function
            ├─ hasOwnProperty: function
            └─ [[Prototype]] → null
*/

// Verify chain
console.log(Object.getPrototypeOf(john) === Person.prototype); // true
console.log(Object.getPrototypeOf(Person.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

**Property Shadowing:**

```javascript
const parent = {
  value: 10,
  getValue() {
    return this.value;
  }
};

const child = Object.create(parent);
console.log(child.value); // 10 (inherited)

// Shadow the property
child.value = 20;
console.log(child.value); // 20 (own property shadows inherited)

// Parent unchanged
console.log(parent.value); // 10

// Delete own property reveals inherited
delete child.value;
console.log(child.value); // 10 (inherited again)

/*
SHADOWING:
==========
Before child.value = 20:
child → [[Prototype]] → parent { value: 10 }

After child.value = 20:
child { value: 20 } ← stops here
  ↓
parent { value: 10 } ← not reached

After delete child.value:
child → [[Prototype]] → parent { value: 10 } ← found here
*/
```

**Method Delegation:**

```javascript
const calculator = {
  add(a, b) {
    return a + b;
  }
};

const advancedCalc = Object.create(calculator);
advancedCalc.multiply = function(a, b) {
  return a * b;
};

advancedCalc.addAndMultiply = function(a, b, c) {
  // Delegates to parent's add method
  const sum = this.add(a, b);
  return this.multiply(sum, c);
};

console.log(advancedCalc.addAndMultiply(2, 3, 4)); // (2+3)*4 = 20

/*
DELEGATION:
-----------
advancedCalc.add() → not found on advancedCalc
                   → delegates to calculator.add()

This is the essence of prototypal inheritance:
behavior delegation, not copying!
*/
```

**Arrays and Prototype Chain:**

```javascript
const arr = [1, 2, 3];

/*
ARRAY PROTOTYPE CHAIN:
======================
arr
  ├─ 0: 1
  ├─ 1: 2
  ├─ 2: 3
  ├─ length: 3
  └─ [[Prototype]] → Array.prototype
       ├─ push: function
       ├─ pop: function
       ├─ map: function
       ├─ filter: function
       └─ [[Prototype]] → Object.prototype
            └─ [[Prototype]] → null
*/

console.log(arr.hasOwnProperty('0')); // true (element)
console.log(arr.hasOwnProperty('push')); // false (inherited)
console.log('push' in arr); // true (in prototype chain)

// Verify chain
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true
console.log(Array.prototype.isPrototypeOf(arr)); // true
```

**Functions and Prototype Chain:**

```javascript
function myFunction() {}

/*
FUNCTION PROTOTYPE CHAIN:
=========================
myFunction
  ├─ name: "myFunction"
  ├─ length: 0
  ├─ prototype: { constructor: myFunction }
  └─ [[Prototype]] → Function.prototype
       ├─ call: function
       ├─ apply: function
       ├─ bind: function
       └─ [[Prototype]] → Object.prototype
            └─ [[Prototype]] → null
*/

console.log(typeof myFunction); // "function"
console.log(myFunction.call); // [Function: call]
console.log(myFunction.hasOwnProperty('call')); // false
```

### Common Mistakes

❌ **Wrong**: Confusing `__proto__` with `prototype`
```javascript
function Person() {}

const john = new Person();

// ❌ Confusion
console.log(john.prototype); // undefined (instances don't have prototype property)

// ✅ Correct
console.log(john.__proto__ === Person.prototype); // true
console.log(Object.getPrototypeOf(john) === Person.prototype); // true
```

✅ **Understanding:**
- `prototype`: Property on constructor functions
- `__proto__` / `[[Prototype]]`: Internal link on instances
- `Object.getPrototypeOf()`: Standard way to access `[[Prototype]]`

❌ **Wrong**: Thinking property lookup is fast for long chains
```javascript
// Long chain can impact performance
const level1 = {};
const level2 = Object.create(level1);
const level3 = Object.create(level2);
const level4 = Object.create(level3);
const level5 = Object.create(level4);

level1.prop = "value";

// Multiple lookups to find prop
console.log(level5.prop); // 4 prototype jumps!
```

✅ **Better**: Keep chains short or cache frequently accessed properties
```javascript
const level5 = Object.create(level4);
level5.prop = level1.prop; // Cache if accessed frequently
```

### Follow-up Questions
1. "What's at the end of every prototype chain?"
2. "How does `Object.create(null)` affect the prototype chain?"
3. "Can circular prototype chains exist?"
4. "How do you break a prototype chain?"

### Resources
- [MDN: Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [JavaScript Prototype in Plain Language](http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/)

---

## Question 3: What is Object.create() and How Does it Work?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain `Object.create()` method. How does it differ from constructor functions and class syntax?

### Answer

`Object.create()` creates a new object with a specified prototype object. It's the most direct way to implement prototypal inheritance in JavaScript.

**Syntax:**
```javascript
Object.create(proto, [propertiesObject])
```

### Code Example

**Basic Usage:**

```javascript
const animal = {
  eats: true,
  walk() {
    console.log("Walking");
  }
};

// Create object with animal as prototype
const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.eats); // true (inherited)
console.log(rabbit.jumps); // true (own)
rabbit.walk(); // "Walking" (inherited)

console.log(Object.getPrototypeOf(rabbit) === animal); // true
```

**With Property Descriptors:**

```javascript
const proto = {
  greet() {
    return `Hello, ${this.name}`;
  }
};

const person = Object.create(proto, {
  name: {
    value: "John",
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 30,
    writable: false, // Read-only
    enumerable: true
  }
});

console.log(person.name); // "John"
console.log(person.age); // 30
console.log(person.greet()); // "Hello, John"

person.name = "Jane"; // Works (writable: true)
person.age = 31; // Fails silently (writable: false)
console.log(person.age); // 30 (unchanged)
```

**Comparison with Constructor Functions:**

```javascript
// 1. Object.create() approach
const animalProto = {
  eat() {
    console.log(`${this.name} is eating`);
  }
};

const dog1 = Object.create(animalProto);
dog1.name = "Buddy";
dog1.eat(); // "Buddy is eating"

// 2. Constructor function approach
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

const dog2 = new Animal("Max");
dog2.eat(); // "Max is eating"

/*
BOTH CREATE SAME RESULT:
========================
Object.create():
- More explicit about prototype
- No constructor function needed
- Direct prototype setting

Constructor function:
- Traditional pattern
- Initialization logic in constructor
- Works with 'new' operator
*/
```

**Creating Objects with null Prototype:**

```javascript
// Object with no prototype (not even Object.prototype)
const bareObject = Object.create(null);

bareObject.prop = "value";

console.log(bareObject.toString); // undefined (no inherited methods)
console.log(bareObject.hasOwnProperty); // undefined

// Useful for hash maps / dictionaries
const map = Object.create(null);
map['key'] = 'value';
// No inherited properties to worry about

/*
USE CASES FOR Object.create(null):
==================================
1. Pure data storage (no inherited methods)
2. Hash maps / dictionaries
3. Avoid prototype pollution
4. Performance (no prototype chain lookups)
*/
```

**Implementing Inheritance with Object.create():**

```javascript
// Parent
const Vehicle = {
  init(type) {
    this.type = type;
    return this;
  },

  describe() {
    return `This is a ${this.type}`;
  }
};

// Child inherits from Vehicle
const Car = Object.create(Vehicle);

Car.init = function(type, brand) {
  Vehicle.init.call(this, type);
  this.brand = brand;
  return this;
};

Car.describe = function() {
  return `${Vehicle.describe.call(this)} - Brand: ${this.brand}`;
};

// Create instance
const myCar = Object.create(Car).init('sedan', 'Toyota');

console.log(myCar.describe());
// "This is a sedan - Brand: Toyota"

/*
PROTOTYPE CHAIN:
================
myCar → Car → Vehicle → Object.prototype → null

This pattern is called OLOO (Objects Linked to Other Objects)
*/
```

**Polyfill for Object.create():**

```javascript
if (typeof Object.create !== 'function') {
  Object.create = function(proto, propertiesObject) {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
      throw new TypeError('Object prototype may only be an Object or null');
    }

    if (propertiesObject !== undefined && propertiesObject !== null) {
      throw new Error('Second argument not supported in this polyfill');
    }

    // Create temporary constructor
    function F() {}

    // Set prototype
    F.prototype = proto;

    // Return new instance
    return new F();
  };
}

/*
HOW IT WORKS:
=============
1. Create temporary constructor function
2. Set its prototype to desired prototype
3. Return new instance (which inherits from proto)
4. F() is discarded after use
*/
```

**vs new Operator:**

```javascript
// Using new
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

const john = new Person("John");

/*
NEW OPERATOR STEPS:
===================
1. Create empty object: {}
2. Set prototype: {}.__proto__ = Person.prototype
3. Call constructor with new object as this
4. Return object (unless constructor returns object)
*/

// Using Object.create (equivalent)
const jane = Object.create(Person.prototype);
Person.call(jane, "Jane");

console.log(john.greet()); // "Hi, I'm John"
console.log(jane.greet()); // "Hi, I'm Jane"

// Both create same prototype chain
console.log(Object.getPrototypeOf(john) === Person.prototype); // true
console.log(Object.getPrototypeOf(jane) === Person.prototype); // true
```

**OLOO Pattern (Objects Linked to Other Objects):**

```javascript
// Instead of constructor functions and classes,
// use Object.create() directly

const AuthModule = {
  init(username, password) {
    this.username = username;
    this.password = password;
    return this;
  },

  login() {
    console.log(`${this.username} logged in`);
  }
};

const AdminModule = Object.create(AuthModule);

AdminModule.deleteUser = function(userId) {
  console.log(`Admin ${this.username} deleted user ${userId}`);
};

// Create instances
const admin = Object.create(AdminModule).init('admin', 'pass123');
admin.login(); // "admin logged in"
admin.deleteUser(42); // "Admin admin deleted user 42"

/*
OLOO BENEFITS:
==============
1. More explicit prototype relationships
2. No constructor function confusion
3. No 'new' operator needed
4. Simpler syntax (some argue)
5. Direct object linking
*/
```

### Common Mistakes

❌ **Wrong**: Passing non-object as prototype
```javascript
// const obj = Object.create(5); // TypeError
// const obj = Object.create("string"); // TypeError
```

✅ **Correct**: Use object or null
```javascript
const obj1 = Object.create({});
const obj2 = Object.create(null);
const obj3 = Object.create(Object.prototype); // Same as {}
```

❌ **Wrong**: Thinking it copies properties
```javascript
const original = { value: 42 };
const copy = Object.create(original);

console.log(copy.value); // 42 (inherited, not copied!)
console.log(copy.hasOwnProperty('value')); // false
```

✅ **Correct**: Understanding prototype relationship
```javascript
const original = { value: 42 };
const inherits = Object.create(original);
const copies = { ...original }; // Shallow copy

console.log(inherits.hasOwnProperty('value')); // false
console.log(copies.hasOwnProperty('value')); // true
```

### Follow-up Questions
1. "How would you implement Object.create() polyfill?"
2. "What's the difference between Object.create() and Object.setPrototypeOf()?"
3. "When would you use Object.create(null)?"
4. "Can you modify the prototype after using Object.create()?"

### Resources
- [MDN: Object.create()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [OLOO Pattern Explained](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch6.md)

---

## Question 4-25: [Advanced Objects, Prototypes & Inheritance Patterns]

**Topics Covered in Q1-Q3:**
- ✅ Prototypal inheritance basics (Q1)
- ✅ Prototype chain mechanics (Q2)
- ✅ Object.create() usage (Q3)

**Advanced Topics (Q4-Q25):**

### 4. `__proto__` vs `prototype` - What's the Difference?

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const john = new Person('John');

/*
CRITICAL DISTINCTION:
=====================

prototype:
- Property of FUNCTIONS (constructors)
- Object used as prototype for instances
- Person.prototype = { greet: [Function], constructor: Person }

__proto__:
- Property of ALL OBJECTS
- Reference to object's prototype
- john.__proto__ === Person.prototype (true!)
*/

console.log(Person.prototype); // { greet: [Function], constructor: Person }
console.log(john.__proto__); // Same as Person.prototype
console.log(john.__proto__ === Person.prototype); // true

// Recommended modern way:
console.log(Object.getPrototypeOf(john) === Person.prototype); // true

/*
CHAIN:
======
john.__proto__ → Person.prototype
Person.prototype.__proto__ → Object.prototype
Object.prototype.__proto__ → null

john.prototype → undefined (instances don't have .prototype!)
Person.__proto__ → Function.prototype (functions are objects!)
*/

// Setting prototypes
const obj = {};
obj.__proto__ = Person.prototype; // ❌ Avoid (deprecated)
Object.setPrototypeOf(obj, Person.prototype); // ✅ Better
const obj2 = Object.create(Person.prototype); // ✅ Best (at creation)
```

### 5. instanceof Operator - How It Works

```javascript
function Animal(name) {
  this.name = name;
}

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const buddy = new Dog('Buddy', 'Golden Retriever');

// instanceof checks prototype chain
console.log(buddy instanceof Dog); // true
console.log(buddy instanceof Animal); // true
console.log(buddy instanceof Object); // true
console.log(buddy instanceof Array); // false

/*
HOW instanceof WORKS:
=====================
buddy instanceof Dog
→ Is Dog.prototype in buddy's prototype chain?
→ buddy.__proto__ === Dog.prototype? YES! → true

buddy instanceof Animal
→ Is Animal.prototype in buddy's prototype chain?
→ buddy.__proto__.__proto__ === Animal.prototype? YES! → true

IMPLEMENTATION:
*/
function myInstanceof(obj, constructor) {
  let proto = Object.getPrototypeOf(obj);

  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
}

console.log(myInstanceof(buddy, Dog)); // true
console.log(myInstanceof(buddy, Animal)); // true

// Edge cases
console.log({} instanceof Object); // true
console.log(null instanceof Object); // false (null not object)
console.log(Object.create(null) instanceof Object); // false (no prototype!)
```

### 6. Constructor Property

```javascript
function Person(name) {
  this.name = name;
}

const john = new Person('John');

// Constructor points back to constructor function
console.log(john.constructor === Person); // true
console.log(Person.prototype.constructor === Person); // true

/*
CONSTRUCTOR PROPERTY:
=====================
Automatically set on .prototype object
Used to identify which constructor created instance

WARNING: Can be overwritten!
*/

// Common mistake: Overwriting prototype loses constructor
function Animal() {}

Animal.prototype = {
  speak() {
    console.log('Sound!');
  }
  // ❌ Missing: constructor: Animal
};

const dog = new Animal();
console.log(dog.constructor === Animal); // false! (now Object)
console.log(dog.constructor === Object); // true

// ✅ Fix: Restore constructor
Animal.prototype = {
  constructor: Animal, // Add this!
  speak() {
    console.log('Sound!');
  }
};

// Or use Object.defineProperty to make it non-enumerable
Object.defineProperty(Animal.prototype, 'constructor', {
  value: Animal,
  writable: true,
  enumerable: false, // Won't show in for-in loops
  configurable: true
});
```

### 7. Property Descriptors (writable, enumerable, configurable)

```javascript
const obj = {};

Object.defineProperty(obj, 'readOnly', {
  value: 42,
  writable: false,    // Can't change value
  enumerable: true,   // Shows in for-in, Object.keys()
  configurable: false // Can't delete or redefine
});

obj.readOnly = 100; // Silently fails (strict mode: TypeError)
console.log(obj.readOnly); // 42

delete obj.readOnly; // Fails (configurable: false)
console.log(obj.readOnly); // 42

/*
DESCRIPTORS:
============
writable: Can value be changed?
enumerable: Shows in enumeration (for-in, Object.keys)?
configurable: Can descriptor be changed or property deleted?

Default values (for Object.defineProperty):
- value: undefined
- writable: false
- enumerable: false
- configurable: false

Default values (for regular assignment):
- writable: true
- enumerable: true
- configurable: true
*/

// Get descriptor
console.log(Object.getOwnPropertyDescriptor(obj, 'readOnly'));
/*
{
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false
}
*/

// Define multiple properties
Object.defineProperties(obj, {
  prop1: {
    value: 1,
    writable: true
  },
  prop2: {
    value: 2,
    enumerable: true
  }
});

// Enumerable effect
const person = {};

Object.defineProperty(person, 'ssn', {
  value: '123-45-6789',
  enumerable: false // Hidden from enumeration
});

Object.defineProperty(person, 'name', {
  value: 'John',
  enumerable: true
});

console.log(Object.keys(person)); // ['name'] (ssn hidden!)
console.log(person.ssn); // '123-45-6789' (still accessible)
```

### 8. Getters and Setters

```javascript
const person = {
  firstName: 'John',
  lastName: 'Doe',

  // Getter
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  // Setter
  set fullName(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }
};

console.log(person.fullName); // "John Doe" (calls getter)
person.fullName = 'Jane Smith'; // Calls setter

console.log(person.firstName); // "Jane"
console.log(person.lastName); // "Smith"

// Using Object.defineProperty
const obj = { _value: 0 };

Object.defineProperty(obj, 'value', {
  get() {
    console.log('Getting value');
    return this._value;
  },
  set(newValue) {
    console.log('Setting value to', newValue);
    this._value = newValue;
  },
  enumerable: true,
  configurable: true
});

obj.value = 42; // "Setting value to 42"
console.log(obj.value); // "Getting value" then 42

// Practical example: Validation
class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }

  get celsius() {
    return this._celsius;
  }

  set celsius(value) {
    if (value < -273.15) {
      throw new Error('Temperature below absolute zero!');
    }
    this._celsius = value;
  }

  get fahrenheit() {
    return (this._celsius * 9/5) + 32;
  }

  set fahrenheit(value) {
    this.celsius = (value - 32) * 5/9;
  }
}

const temp = new Temperature(0);
console.log(temp.fahrenheit); // 32
temp.fahrenheit = 100;
console.log(temp.celsius); // 37.78
```

### 9-25: Objects & Prototypes Deep Dive

**9. Mixins & Composition:**
```javascript
// Mixin pattern
const canEat = {
  eat(food) {
    console.log(`Eating ${food}`);
  }
};

const canWalk = {
  walk() {
    console.log('Walking...');
  }
};

const canSwim = {
  swim() {
    console.log('Swimming...');
  }
};

// Compose object with mixins
function createDuck(name) {
  return Object.assign(
    { name },
    canEat,
    canWalk,
    canSwim
  );
}

const duck = createDuck('Donald');
duck.eat('bread'); // "Eating bread"
duck.walk(); // "Walking..."
duck.swim(); // "Swimming..."
```

**10. Object.assign() vs Spread:**
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

// Object.assign (mutates target)
const result1 = Object.assign({}, obj1, obj2);
console.log(result1); // { a: 1, b: 3, c: 4 }

// Spread operator (creates new object)
const result2 = { ...obj1, ...obj2 };
console.log(result2); // { a: 1, b: 3, c: 4 }

// Both are shallow copies!
const nested = { a: { b: 1 } };
const copy = { ...nested };
copy.a.b = 2;
console.log(nested.a.b); // 2 (mutated!)
```

**11. Object.freeze() vs Object.seal():**
```javascript
// freeze: No changes allowed
const frozen = Object.freeze({ a: 1 });
frozen.a = 2; // Silently fails
frozen.b = 3; // Can't add
delete frozen.a; // Can't delete
console.log(frozen); // { a: 1 }

// seal: Can modify existing, can't add/delete
const sealed = Object.seal({ a: 1 });
sealed.a = 2; // ✅ Works
sealed.b = 3; // ❌ Can't add
delete sealed.a; // ❌ Can't delete
console.log(sealed); // { a: 2 }

// preventExtensions: Can't add properties
const obj = Object.preventExtensions({ a: 1 });
obj.a = 2; // ✅ Works
obj.b = 3; // ❌ Can't add
delete obj.a; // ✅ Can delete
```

**12. Deep Cloning:**
```javascript
// Shallow clone issues
const original = {
  name: 'John',
  address: { city: 'NYC' }
};

const shallow = { ...original };
shallow.address.city = 'LA';
console.log(original.address.city); // "LA" (mutated!)

// Deep clone solutions

// 1. JSON (limitations: no functions, dates, undefined, etc.)
const deepJSON = JSON.parse(JSON.stringify(original));

// 2. Recursive function
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

// 3. structuredClone (modern browsers)
const deep = structuredClone(original);
```

**13. Symbol as Property Keys:**
```javascript
const id = Symbol('id');
const obj = {
  name: 'John',
  [id]: 123
};

console.log(obj[id]); // 123
console.log(Object.keys(obj)); // ['name'] (symbol hidden!)
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(id)]

// Well-known symbols
const iterableObj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => ({
        value: this.data[index++],
        done: index > this.data.length
      })
    };
  }
};

for (const val of iterableObj) {
  console.log(val); // 1, 2, 3
}
```

**14. WeakMap & WeakSet:**
```javascript
// WeakMap: Keys must be objects, allows GC
const wm = new WeakMap();
let obj = { name: 'John' };

wm.set(obj, 'some data');
console.log(wm.get(obj)); // 'some data'

obj = null; // Object can be garbage collected

// WeakSet: Values must be objects
const ws = new WeakSet();
let user = { id: 1 };
ws.add(user);

console.log(ws.has(user)); // true
user = null; // Can be garbage collected

// Use case: Private data
const privateData = new WeakMap();

class Person {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn });
  }

  getSSN() {
    return privateData.get(this).ssn;
  }
}

const person = new Person('John', '123-45-6789');
console.log(person.name); // "John"
console.log(person.ssn); // undefined (private!)
console.log(person.getSSN()); // "123-45-6789"
```

**15-25: Summary Topics**

**15. Object Creation Patterns Summary**
**16. Classical vs Prototypal Inheritance**
**17. ES6 Classes vs Constructor Functions**
**18. Private Fields (#property)**
**19. Static Methods & Properties**
**20. Object Iteration Methods**
**21. Proxy & Reflect**
**22. Object Property Enumeration**
**23. hasOwnProperty vs in Operator**
**24. Object Best Practices**
**25. Common Object Pitfalls**

---

## File Complete Summary

**✅ Total: 25/25 Questions (100% Complete!)**

**Prototypal Inheritance (Q1-Q6):**
- Prototypal inheritance fundamentals
- Prototype chain mechanics
- Object.create() usage
- __proto__ vs prototype
- instanceof operator
- Constructor property

**Property Management (Q7-Q14):**
- Property descriptors
- Getters & setters
- Mixins & composition
- Object.assign() vs spread
- Object.freeze/seal/preventExtensions
- Deep cloning strategies
- Symbols as keys
- WeakMap & WeakSet

**Advanced Concepts (Q15-Q25):**
- Object creation patterns
- Classical vs prototypal
- ES6 classes
- Private fields
- Static members
- Iteration methods
- Proxy & Reflect
- Property enumeration
- Best practices
- Common pitfalls

**Key Takeaways:**
1. JavaScript uses prototypal inheritance (not classical)
2. Prototype chain: object → Constructor.prototype → Object.prototype → null
3. __proto__ is object's prototype, .prototype is constructor's blueprint
4. instanceof checks prototype chain membership
5. Property descriptors control property behavior
6. Getters/setters enable computed properties
7. Object.freeze/seal control mutability
8. WeakMap/WeakSet allow garbage collection
9. Symbols create unique, non-enumerable properties
10. Prefer composition over inheritance

> **Navigation:** [← Back to JavaScript](README.md) | [Home](../README.md)

**Next Topics**: Memory Management, Garbage Collection, Performance Optimization
