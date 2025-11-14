# JavaScript Arrays, Strings, and Data Structures

> Complete guide to array methods, string manipulation, Maps, Sets, WeakMaps, WeakSets, and modern collection APIs.

---

## Question 1: Essential Array Methods - map, filter, reduce

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10-15 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Uber, Netflix

### Question
Explain map(), filter(), and reduce(). Provide examples and explain when to use each.

### Answer

These are **higher-order functions** that take a callback and return new values without mutating the original array.

### Code Example

**map() - Transform Each Element:**

```javascript
// Syntax: array.map(callback(element, index, array))
// Returns: New array with transformed elements

const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

// Extract property from objects
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
];

const names = users.map(user => user.name);
console.log(names);  // ["Alice", "Bob", "Charlie"]

// With index
const indexed = numbers.map((num, index) => ({
  value: num,
  index: index
}));
console.log(indexed);
// [{ value: 1, index: 0 }, { value: 2, index: 1 }, ...]

/*
USE CASES:
- Transform data structure
- Extract specific properties
- Convert data types
- Return same length array with modifications
*/
```

**filter() - Select Elements:**

```javascript
// Syntax: array.filter(callback(element, index, array))
// Returns: New array with elements that pass the test

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Get even numbers
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens);  // [2, 4, 6, 8, 10]

// Filter objects
const users = [
  { name: "Alice", age: 17, active: true },
  { name: "Bob", age: 25, active: false },
  { name: "Charlie", age: 30, active: true }
];

const adults = users.filter(user => user.age >= 18);
const activeUsers = users.filter(user => user.active);
const activeAdults = users.filter(user => user.age >= 18 && user.active);

console.log(activeAdults);
// [{ name: "Charlie", age: 30, active: true }]

/*
USE CASES:
- Remove unwanted elements
- Search/find matching items
- Validation filtering
- Return subset of original array
*/
```

**reduce() - Reduce to Single Value:**

```javascript
// Syntax: array.reduce(callback(accumulator, current, index, array), initialValue)
// Returns: Single accumulated value

const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum);  // 15

// Find maximum
const max = numbers.reduce((acc, num) => Math.max(acc, num), -Infinity);
console.log(max);  // 5

// Count occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count);  // { apple: 3, banana: 2, orange: 1 }

// Group by property
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" }
];

const grouped = users.reduce((acc, user) => {
  const role = user.role;
  if (!acc[role]) acc[role] = [];
  acc[role].push(user);
  return acc;
}, {});

console.log(grouped);
/*
{
  admin: [{ name: "Alice", role: "admin" }, { name: "Charlie", role: "admin" }],
  user: [{ name: "Bob", role: "user" }]
}
*/

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flattened = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log(flattened);  // [1, 2, 3, 4, 5, 6]

// Build object from array
const keyValue = [["name", "John"], ["age", 30], ["city", "NYC"]];
const obj = keyValue.reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {});
console.log(obj);  // { name: "John", age: 30, city: "NYC" }

/*
USE CASES:
- Sum, average, min, max calculations
- Counting and grouping
- Flattening nested structures
- Converting arrays to objects
- Implementing other array methods
- Complex transformations
*/
```

**Chaining Methods:**

```javascript
const users = [
  { name: "Alice", age: 25, score: 85 },
  { name: "Bob", age: 17, score: 92 },
  { name: "Charlie", age: 30, score: 78 },
  { name: "David", age: 22, score: 95 }
];

// Get average score of adult users
const avgAdultScore = users
  .filter(user => user.age >= 18)        // Filter adults
  .map(user => user.score)                // Extract scores
  .reduce((sum, score, idx, arr) => {     // Calculate average
    return idx === arr.length - 1
      ? (sum + score) / arr.length
      : sum + score;
  }, 0);

console.log(avgAdultScore);  // 86

// Or cleaner:
const avgScore = users
  .filter(u => u.age >= 18)
  .reduce((sum, u, i, arr) => {
    sum += u.score;
    return i === arr.length - 1 ? sum / arr.length : sum;
  }, 0);
```

**Implementing map/filter with reduce:**

```javascript
// map implementation using reduce
Array.prototype.myMap = function(callback) {
  return this.reduce((acc, item, index, array) => {
    acc.push(callback(item, index, array));
    return acc;
  }, []);
};

// filter implementation using reduce
Array.prototype.myFilter = function(callback) {
  return this.reduce((acc, item, index, array) => {
    if (callback(item, index, array)) {
      acc.push(item);
    }
    return acc;
  }, []);
};

// Test
const nums = [1, 2, 3, 4, 5];
console.log(nums.myMap(x => x * 2));      // [2, 4, 6, 8, 10]
console.log(nums.myFilter(x => x % 2 === 0));  // [2, 4]
```

### Common Mistakes

❌ **Wrong**: Forgetting to return in map
```javascript
const doubled = [1, 2, 3].map(num => {
  num * 2;  // ❌ No return!
});
console.log(doubled);  // [undefined, undefined, undefined]
```

✅ **Correct**: Always return in map
```javascript
const doubled = [1, 2, 3].map(num => num * 2);
// Or with explicit return:
const doubled2 = [1, 2, 3].map(num => {
  return num * 2;
});
```

❌ **Wrong**: Forgetting initial value in reduce
```javascript
const nums = [];
const sum = nums.reduce((acc, num) => acc + num);  // ❌ Error!
// TypeError: Reduce of empty array with no initial value
```

✅ **Correct**: Always provide initial value
```javascript
const sum = nums.reduce((acc, num) => acc + num, 0);  // 0
```

❌ **Wrong**: Mutating in map/filter
```javascript
const users = [{ name: "Alice" }, { name: "Bob" }];

const modified = users.map(user => {
  user.role = "admin";  // ❌ Mutates original!
  return user;
});

console.log(users[0].role);  // "admin" (original mutated!)
```

✅ **Correct**: Return new objects
```javascript
const modified = users.map(user => ({
  ...user,
  role: "admin"
}));

console.log(users[0].role);  // undefined (original unchanged)
```

### Follow-up Questions
1. "How would you implement your own map/filter/reduce?"
2. "What's the time complexity of these methods?"
3. "Can you break out of a reduce early?"
4. "What's the difference between forEach and map?"

### Resources
- [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [MDN: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [MDN: Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

---

## Question 2: Map vs Object - When to Use Which?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain the differences between Map and Object in JavaScript. When should you use each?

### Answer

**Map** is a collection of keyed data items, like Object, but with key differences in behavior and capabilities.

**Key Differences:**

| Feature | Map | Object |
|---------|-----|--------|
| Key Types | Any type | String/Symbol only |
| Key Order | Insertion order | Not guaranteed* |
| Size | `map.size` | Manual counting |
| Iteration | Built-in iterators | Need `Object.keys()` etc. |
| Performance | Better for frequent add/delete | Better for simple storage |
| JSON | Not serializable | Direct `JSON.stringify()` |
| Prototype | No inherited keys | Has prototype chain |

*Modern JS maintains insertion order for string keys

### Code Example

**Map Basics:**

```javascript
// Creating Maps
const map = new Map();

// Setting values
map.set('name', 'John');
map.set(1, 'number key');
map.set(true, 'boolean key');

// Objects as keys (powerful feature!)
const objKey = { id: 1 };
map.set(objKey, 'object value');

// Getting values
console.log(map.get('name'));     // "John"
console.log(map.get(1));          // "number key"
console.log(map.get(objKey));     // "object value"

// Size
console.log(map.size);  // 4

// Checking existence
console.log(map.has('name'));  // true
console.log(map.has('age'));   // false

// Deleting
map.delete('name');
console.log(map.has('name'));  // false

// Clear all
map.clear();
console.log(map.size);  // 0
```

**Object as Key (Map's Superpower):**

```javascript
// Map: Objects as keys
const map = new Map();

const user1 = { name: "Alice" };
const user2 = { name: "Bob" };

map.set(user1, "User 1 data");
map.set(user2, "User 2 data");

console.log(map.get(user1));  // "User 1 data"
console.log(map.get(user2));  // "User 2 data"

// Object: Can't use objects as keys effectively
const obj = {};
obj[user1] = "User 1 data";  // Converts to string "[object Object]"
obj[user2] = "User 2 data";  // Same key! Overwrites!

console.log(Object.keys(obj));  // ["[object Object]"]
console.log(obj[user1]);        // "User 2 data" (overwritten!)
```

**Iteration:**

```javascript
const map = new Map([
  ['name', 'John'],
  ['age', 30],
  ['city', 'NYC']
]);

// forEach
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// for...of (natural iteration)
for (const [key, value] of map) {
  console.log(`${key}: ${value}`);
}

// Keys
for (const key of map.keys()) {
  console.log(key);
}

// Values
for (const value of map.values()) {
  console.log(value);
}

// Entries
for (const [key, value] of map.entries()) {
  console.log(key, value);
}

// Object iteration (more complex)
const obj = { name: 'John', age: 30, city: 'NYC' };

// Need Object methods
for (const key of Object.keys(obj)) {
  console.log(`${key}: ${obj[key]}`);
}

// Or Object.entries
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}
```

**Converting Between Map and Object:**

```javascript
// Object to Map
const obj = { a: 1, b: 2, c: 3 };
const map = new Map(Object.entries(obj));

console.log(map);  // Map(3) { 'a' => 1, 'b' => 2, 'c' => 3 }

// Map to Object
const mapToObj = Object.fromEntries(map);
console.log(mapToObj);  // { a: 1, b: 2, c: 3 }

// Or manually:
const obj2 = {};
for (const [key, value] of map) {
  obj2[key] = value;
}
```

**When to Use Map:**

```javascript
// 1. Non-string keys
const userRoles = new Map();
userRoles.set(userObject, 'admin');  // Object as key

// 2. Frequent additions/deletions
const cache = new Map();
cache.set(key1, value1);
cache.delete(key1);  // Faster than delete obj[key1]

// 3. Need size
console.log(cache.size);  // Direct property

// 4. Need iteration order
const ordered = new Map();
ordered.set('first', 1);
ordered.set('second', 2);
ordered.set('third', 3);
// Guaranteed to iterate in insertion order

// 5. No prototype pollution
const safeMap = new Map();
safeMap.set('__proto__', 'safe');  // No issues
safeMap.set('constructor', 'safe');

// vs Object (can be dangerous):
const obj = {};
obj['__proto__'] = 'danger';  // Can cause issues
```

**When to Use Object:**

```javascript
// 1. Simple key-value storage with string keys
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// 2. JSON serialization needed
const data = { name: 'John', age: 30 };
const json = JSON.stringify(data);  // Works!

// Map requires conversion:
const map = new Map([['name', 'John']]);
// JSON.stringify(map);  // "{}" (loses data!)
const mapJson = JSON.stringify(Object.fromEntries(map));  // Must convert

// 3. Property access syntax
console.log(config.apiUrl);    // Clean
console.log(config['apiUrl']); // Or bracket notation

// vs Map:
console.log(map.get('apiUrl'));  // Must use .get()

// 4. Object literal syntax
const settings = {
  theme: 'dark',
  language: 'en',
  notifications: true
};

// vs Map (more verbose):
const mapSettings = new Map([
  ['theme', 'dark'],
  ['language', 'en'],
  ['notifications', true]
]);
```

**Performance Comparison:**

```javascript
// Benchmark: Frequent additions/deletions
const map = new Map();
const obj = {};

console.time('Map operations');
for (let i = 0; i < 1000000; i++) {
  map.set(i, i);
  map.delete(i);
}
console.timeEnd('Map operations');

console.time('Object operations');
for (let i = 0; i < 1000000; i++) {
  obj[i] = i;
  delete obj[i];
}
console.timeEnd('Object operations');

// Map is generally faster for add/delete operations
```

### Common Mistakes

❌ **Wrong**: Using bracket notation with Map
```javascript
const map = new Map();
map['key'] = 'value';  // ❌ Wrong! Sets property, not Map entry

console.log(map.get('key'));  // undefined
console.log(map['key']);      // 'value' (property, not Map entry)
```

✅ **Correct**: Use .set() and .get()
```javascript
map.set('key', 'value');
console.log(map.get('key'));  // 'value'
```

❌ **Wrong**: Expecting Map to work with JSON.stringify
```javascript
const map = new Map([['a', 1]]);
console.log(JSON.stringify(map));  // "{}" (empty!)
```

✅ **Correct**: Convert to Object first
```javascript
const obj = Object.fromEntries(map);
console.log(JSON.stringify(obj));  // '{"a":1}'
```

### Follow-up Questions
1. "What about WeakMap? How is it different?"
2. "Can you use functions as Map keys?"
3. "How do you clone a Map?"
4. "What's the time complexity of Map operations?"

### Resources
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Map vs Object in JavaScript](https://www.javascripttutorial.net/es6/javascript-map-vs-object/)

---

## Questions 3-20: Data Structures & Array Methods

**Difficulty:** 🟡 Medium to 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Consolidated for comprehensiveness**

### Q3: Set - Unique Values Collection

```javascript
// 1. BASIC SET OPERATIONS
const set = new Set([1, 2, 3, 3, 3]);
console.log(set); // Set(3) { 1, 2, 3 }

set.add(4);
set.add(4); // Duplicate ignored
console.log(set.size); // 4

set.delete(2);
console.log(set.has(3)); // true

// 2. REMOVE DUPLICATES FROM ARRAY
const arr = [1, 2, 2, 3, 3, 4, 5, 5];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3, 4, 5]

// 3. SET OPERATIONS
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...setA, ...setB]);
console.log(union); // Set(6) { 1, 2, 3, 4, 5, 6 }

// Intersection
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log(intersection); // Set(2) { 3, 4 }

// Difference
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log(difference); // Set(2) { 1, 2 }

// 4. ITERATION
for (const value of set) {
  console.log(value);
}

set.forEach(value => console.log(value));
```

### Q4: WeakMap & WeakSet

```javascript
// 1. WEAKMAP (keys must be objects)
const weakMap = new WeakMap();

let user = { name: 'John' };
weakMap.set(user, 'metadata');

console.log(weakMap.get(user)); // "metadata"

// Garbage collection
user = null; // Object can be garbage collected
// WeakMap entry automatically removed!

// Use case: Private data
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { password: 'secret' });
    this.name = name;
  }

  getPassword() {
    return privateData.get(this).password;
  }
}

// 2. WEAKSET (values must be objects)
const weakSet = new WeakSet();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

obj1 = null; // Can be garbage collected

// Use case: Track visited objects
const visitedNodes = new WeakSet();

function traverse(node) {
  if (visitedNodes.has(node)) return;
  visitedNodes.add(node);
  // Process node...
}
```

### Q5: Array find, findIndex, some, every

```javascript
const users = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false },
  { id: 3, name: 'Charlie', age: 35, active: true }
];

// 1. find() - Returns first matching element
const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: 'Bob', ... }

const notFound = users.find(u => u.id === 999);
console.log(notFound); // undefined

// 2. findIndex() - Returns index of first match
const index = users.findIndex(u => u.name === 'Charlie');
console.log(index); // 2

const noIndex = users.findIndex(u => u.id === 999);
console.log(noIndex); // -1

// 3. some() - Returns true if ANY element matches
const hasInactive = users.some(u => !u.active);
console.log(hasInactive); // true

const hasTeens = users.some(u => u.age < 18);
console.log(hasTeens); // false

// 4. every() - Returns true if ALL elements match
const allActive = users.every(u => u.active);
console.log(allActive); // false

const allAdults = users.every(u => u.age >= 18);
console.log(allAdults); // true

// 5. PRACTICAL EXAMPLES
// Check if array includes value
const nums = [1, 2, 3, 4, 5];
console.log(nums.some(n => n > 3)); // true (includes 4, 5)

// Validate all items
const scores = [85, 92, 78, 95, 88];
console.log(scores.every(s => s >= 70)); // true (all passed)
```

### Q6: String Methods

```javascript
// 1. SEARCH & FIND
const str = 'Hello World';

console.log(str.indexOf('World')); // 6
console.log(str.lastIndexOf('o')); // 7
console.log(str.includes('World')); // true
console.log(str.startsWith('Hello')); // true
console.log(str.endsWith('World')); // true

// 2. EXTRACT
console.log(str.slice(0, 5)); // "Hello"
console.log(str.substring(6, 11)); // "World"
console.log(str.substr(6, 5)); // "World" (deprecated)
console.log(str.charAt(0)); // "H"
console.log(str[0]); // "H"

// 3. MODIFY
console.log(str.toLowerCase()); // "hello world"
console.log(str.toUpperCase()); // "HELLO WORLD"
console.log(str.trim()); // Removes whitespace
console.log(str.replace('World', 'Universe')); // "Hello Universe"
console.log(str.replaceAll('o', 'O')); // "HellO WOrld"

// 4. SPLIT & JOIN
const words = str.split(' '); // ["Hello", "World"]
console.log(words.join('-')); // "Hello-World"

// 5. REPEAT & PAD
console.log('Hi'.repeat(3)); // "HiHiHi"
console.log('5'.padStart(3, '0')); // "005"
console.log('5'.padEnd(3, '0')); // "500"

// 6. TEMPLATE LITERALS
const name = 'John';
const age = 30;
console.log(`${name} is ${age} years old`);
```

### Q7: Regular Expressions

```javascript
// 1. BASIC REGEX
const pattern = /hello/i; // i = case insensitive
console.log(pattern.test('Hello World')); // true

// 2. MATCH & EXEC
const str = 'The year is 2024';
const matches = str.match(/\d+/); // Find digits
console.log(matches); // ["2024"]

// Global flag
const text = 'cat bat rat';
const allMatches = text.match(/\w+at/g);
console.log(allMatches); // ["cat", "bat", "rat"]

// 3. REPLACE WITH REGEX
const sentence = 'hello world';
const capitalized = sentence.replace(/\b\w/g, match => match.toUpperCase());
console.log(capitalized); // "Hello World"

// 4. VALIDATION
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailRegex.test('user@example.com')); // true

const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
console.log(phoneRegex.test('123-456-7890')); // true

// 5. EXTRACT GROUPS
const dateStr = '2024-01-15';
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const [, year, month, day] = dateStr.match(dateRegex);
console.log(year, month, day); // "2024" "01" "15"
```

### Q8: Array flat & flatMap

```javascript
// 1. flat() - Flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];

console.log(nested.flat()); // [1, 2, 3, 4, [5, 6]]
console.log(nested.flat(2)); // [1, 2, 3, 4, 5, 6]
console.log(nested.flat(Infinity)); // Flatten all levels

// Remove empty slots
const withHoles = [1, 2, , 4, 5];
console.log(withHoles.flat()); // [1, 2, 4, 5]

// 2. flatMap() - Map then flatten (1 level)
const arr = [1, 2, 3];

const doubled = arr.flatMap(x => [x, x * 2]);
console.log(doubled); // [1, 2, 2, 4, 3, 6]

// Split strings
const sentences = ['Hello world', 'How are you'];
const words = sentences.flatMap(s => s.split(' '));
console.log(words); // ["Hello", "world", "How", "are", "you"]

// Filter & map combined
const numbers = [1, 2, 3, 4, 5];
const evenDoubled = numbers.flatMap(n =>
  n % 2 === 0 ? [n * 2] : []
);
console.log(evenDoubled); // [4, 8]
```

### Q9: Array at, includes, indexOf

```javascript
const arr = [10, 20, 30, 40, 50];

// 1. at() - Negative indexing (modern)
console.log(arr.at(0)); // 10 (first)
console.log(arr.at(-1)); // 50 (last)
console.log(arr.at(-2)); // 40

// vs traditional
console.log(arr[arr.length - 1]); // 50 (more verbose)

// 2. includes() - Check existence
console.log(arr.includes(30)); // true
console.log(arr.includes(100)); // false

// With NaN (better than indexOf)
console.log([1, 2, NaN].includes(NaN)); // true
console.log([1, 2, NaN].indexOf(NaN)); // -1

// 3. indexOf() - Find index
console.log(arr.indexOf(30)); // 2
console.log(arr.indexOf(100)); // -1

// From index
console.log(arr.indexOf(20, 2)); // -1 (search from index 2)

// 4. lastIndexOf() - Find from end
const dup = [1, 2, 3, 2, 1];
console.log(dup.lastIndexOf(2)); // 3
```

### Q10: Array slice, splice, concat

```javascript
const arr = [1, 2, 3, 4, 5];

// 1. slice() - Extract portion (doesn't mutate)
const sliced = arr.slice(1, 4);
console.log(sliced); // [2, 3, 4]
console.log(arr); // [1, 2, 3, 4, 5] (unchanged)

// Negative indices
console.log(arr.slice(-2)); // [4, 5]

// Clone array
const clone = arr.slice();

// 2. splice() - Modify array (MUTATES!)
const nums = [1, 2, 3, 4, 5];

// Remove elements
const removed = nums.splice(2, 2); // Remove 2 from index 2
console.log(removed); // [3, 4]
console.log(nums); // [1, 2, 5]

// Insert elements
nums.splice(2, 0, 3, 4); // Insert at index 2
console.log(nums); // [1, 2, 3, 4, 5]

// Replace elements
nums.splice(2, 1, 99); // Replace 1 element at index 2
console.log(nums); // [1, 2, 99, 4, 5]

// 3. concat() - Merge arrays (doesn't mutate)
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = arr1.concat(arr2, [5, 6]);
console.log(merged); // [1, 2, 3, 4, 5, 6]

// Modern: spread operator
const merged2 = [...arr1, ...arr2, 5, 6];
```

### Q11: Array sort & reverse

```javascript
// 1. sort() - Sort array (MUTATES!)
const nums = [3, 1, 4, 1, 5, 9, 2, 6];

// Default: lexicographic (string) sort
nums.sort();
console.log(nums); // [1, 1, 2, 3, 4, 5, 6, 9]

// ❌ Wrong for numbers
const wrong = [10, 5, 40, 25, 1000, 1];
wrong.sort();
console.log(wrong); // [1, 10, 1000, 25, 40, 5] (wrong!)

// ✅ Correct: compare function
const numbers = [10, 5, 40, 25, 1000, 1];
numbers.sort((a, b) => a - b); // Ascending
console.log(numbers); // [1, 5, 10, 25, 40, 1000]

// Descending
numbers.sort((a, b) => b - a);
console.log(numbers); // [1000, 40, 25, 10, 5, 1]

// Sort objects
const users = [
  { name: 'Charlie', age: 35 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

users.sort((a, b) => a.age - b.age); // By age
users.sort((a, b) => a.name.localeCompare(b.name)); // By name

// 2. reverse() - Reverse array (MUTATES!)
const arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr); // [5, 4, 3, 2, 1]

// Non-mutating reverse
const reversed = [...arr].reverse();
```

### Q12: Array fill, copyWithin, entries

```javascript
// 1. fill() - Fill with value (MUTATES!)
const arr = new Array(5).fill(0);
console.log(arr); // [0, 0, 0, 0, 0]

// Fill range
arr.fill(1, 2, 4); // Fill 1 from index 2 to 4
console.log(arr); // [0, 0, 1, 1, 0]

// 2. copyWithin() - Copy portion (MUTATES!)
const nums = [1, 2, 3, 4, 5];
nums.copyWithin(0, 3); // Copy from 3 to 0
console.log(nums); // [4, 5, 3, 4, 5]

// 3. entries() - Key-value iterator
const fruits = ['apple', 'banana', 'orange'];

for (const [index, fruit] of fruits.entries()) {
  console.log(index, fruit);
}
// 0 "apple"
// 1 "banana"
// 2 "orange"

// Convert to array
console.log([...fruits.entries()]);
// [[0, "apple"], [1, "banana"], [2, "orange"]]
```

### Q13: Object Static Methods

```javascript
// 1. Object.keys/values/entries
const user = { name: 'John', age: 30, city: 'NYC' };

console.log(Object.keys(user)); // ["name", "age", "city"]
console.log(Object.values(user)); // ["John", 30, "NYC"]
console.log(Object.entries(user));
// [["name", "John"], ["age", 30], ["city", "NYC"]]

// 2. Object.fromEntries - Reverse of entries
const entries = [['a', 1], ['b', 2]];
const obj = Object.fromEntries(entries);
console.log(obj); // { a: 1, b: 2 }

// 3. Object.assign - Merge objects
const target = { a: 1 };
const source = { b: 2, c: 3 };
Object.assign(target, source);
console.log(target); // { a: 1, b: 2, c: 3 }

// Modern: spread
const merged = { ...target, ...source };

// 4. Object.freeze - Make immutable
const frozen = Object.freeze({ name: 'John' });
frozen.name = 'Jane'; // Silently fails (strict mode: error)
console.log(frozen.name); // "John"

// 5. Object.seal - Prevent add/delete
const sealed = Object.seal({ name: 'John' });
sealed.age = 30; // Can't add
delete sealed.name; // Can't delete
sealed.name = 'Jane'; // Can modify ✅

// 6. Object.is - Strict equality with special cases
console.log(Object.is(NaN, NaN)); // true
console.log(NaN === NaN); // false

console.log(Object.is(+0, -0)); // false
console.log(+0 === -0); // true
```

### Q14: Typed Arrays & ArrayBuffer

```javascript
// 1. ARRAYBUFFER - Raw binary data
const buffer = new ArrayBuffer(16); // 16 bytes
console.log(buffer.byteLength); // 16

// 2. TYPED ARRAY VIEWS
const int8 = new Int8Array(buffer);
const int16 = new Int16Array(buffer);
const float32 = new Float32Array(buffer);

int8[0] = 42;
console.log(int8[0]); // 42

// 3. COMMON TYPED ARRAYS
const uint8 = new Uint8Array([1, 2, 3, 4]);
console.log(uint8); // Uint8Array(4) [1, 2, 3, 4]

// Operations like normal arrays
const doubled = uint8.map(x => x * 2);
console.log(doubled); // Uint8Array(4) [2, 4, 6, 8]

// 4. USE CASE: Binary data, WebGL, Canvas
const imageData = new Uint8ClampedArray(4); // RGBA pixel
imageData[0] = 255; // Red
imageData[1] = 0;   // Green
imageData[2] = 0;   // Blue
imageData[3] = 255; // Alpha
```

### Q15: Performance Best Practices

```javascript
// 1. AVOID ARRAY MODIFICATIONS IN LOOPS
// ❌ Bad
const arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; i++) { // Recalculates length!
  console.log(arr[i]);
}

// ✅ Good
const len = arr.length;
for (let i = 0; i < len; i++) {
  console.log(arr[i]);
}

// ✅ Better: for...of
for (const item of arr) {
  console.log(item);
}

// 2. USE MAP/FILTER/REDUCE INSTEAD OF LOOPS
// ❌ Bad
const nums = [1, 2, 3, 4, 5];
const doubled = [];
for (let i = 0; i < nums.length; i++) {
  doubled.push(nums[i] * 2);
}

// ✅ Good
const doubled2 = nums.map(x => x * 2);

// 3. AVOID ARRAY.push IN LOOPS (pre-allocate)
// ❌ Slow for large arrays
const result = [];
for (let i = 0; i < 1000000; i++) {
  result.push(i);
}

// ✅ Faster (if size known)
const result2 = new Array(1000000);
for (let i = 0; i < 1000000; i++) {
  result2[i] = i;
}

// 4. USE SET FOR UNIQUENESS CHECKS
// ❌ O(n) lookup
const arr2 = [1, 2, 3, 4, 5];
if (arr2.includes(3)) { } // O(n)

// ✅ O(1) lookup
const set = new Set(arr2);
if (set.has(3)) { } // O(1)

// 5. CACHE LENGTH & CALCULATIONS
// ❌ Bad
for (let i = 0; i < array.length; i++) {
  const result = expensiveCalculation();
  // ...
}

// ✅ Good
const cachedResult = expensiveCalculation();
const len2 = array.length;
for (let i = 0; i < len2; i++) {
  // Use cachedResult
}
```

### Q16: Array-like Objects & Conversion

```javascript
// 1. ARRAY-LIKE OBJECTS
function sum() {
  console.log(arguments); // Array-like, not array
  console.log(Array.isArray(arguments)); // false

  // Convert to array
  const args = Array.from(arguments);
  return args.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3)); // 6

// 2. NODELIST (from DOM)
// const divs = document.querySelectorAll('div'); // NodeList
// const divArray = Array.from(divs);

// 3. ARRAY.FROM WITH MAPPING
const range = Array.from({ length: 5 }, (_, i) => i);
console.log(range); // [0, 1, 2, 3, 4]

// Create alphabet
const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);
console.log(alphabet); // ["A", "B", "C", ...]

// 4. SPREAD OPERATOR
const nodeList = document.querySelectorAll('div');
const divArray2 = [...nodeList];
```

### Q17: Immutable Array Operations

```javascript
// ❌ MUTATING OPERATIONS
const arr = [1, 2, 3];
arr.push(4);      // Mutates
arr.pop();        // Mutates
arr.splice(1, 1); // Mutates
arr.sort();       // Mutates
arr.reverse();    // Mutates

// ✅ IMMUTABLE ALTERNATIVES
const original = [1, 2, 3];

// Add to end
const withAdded = [...original, 4];

// Add to beginning
const withPrepended = [0, ...original];

// Remove from end
const withoutLast = original.slice(0, -1);

// Remove from beginning
const withoutFirst = original.slice(1);

// Remove from middle
const removeAtIndex = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1)
];

// Sort
const sorted = [...original].sort((a, b) => a - b);

// Reverse
const reversed = [...original].reverse();

// Update at index
const updateAt = (arr, index, value) => [
  ...arr.slice(0, index),
  value,
  ...arr.slice(index + 1)
];
```

### Q18: Advanced Array Patterns

```javascript
// 1. CHUNK ARRAY
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3));
// [[1, 2, 3], [4, 5, 6], [7]]

// 2. PARTITION ARRAY
function partition(arr, predicate) {
  return arr.reduce(([pass, fail], elem) =>
    predicate(elem)
      ? [[...pass, elem], fail]
      : [pass, [...fail, elem]],
    [[], []]
  );
}

const [evens, odds] = partition([1, 2, 3, 4, 5], x => x % 2 === 0);
console.log(evens, odds); // [2, 4] [1, 3, 5]

// 3. GROUP BY
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' }
];

console.log(groupBy(users, u => u.role));
// { admin: [...], user: [...] }

// 4. SHUFFLE ARRAY
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 5. DEEP FLATTEN
function deepFlatten(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item)
      ? acc.concat(deepFlatten(item))
      : acc.concat(item),
    []
  );
}

console.log(deepFlatten([1, [2, [3, [4, 5]]]]));
// [1, 2, 3, 4, 5]
```

### Q19: Memory & Performance Optimization

```javascript
// 1. LARGE ARRAYS - Use generators
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

// Instead of: Array.from({ length: 1000000 }, (_, i) => i)
for (const num of range(0, 1000000)) {
  // Process one at a time (less memory)
}

// 2. AVOID MEMORY LEAKS
// ❌ Bad: Keeping references
const cache = [];
function addToCache(data) {
  cache.push(data); // Never cleaned!
}

// ✅ Good: Use WeakMap for objects
const cache2 = new WeakMap();
function cacheData(key, value) {
  cache2.set(key, value); // Auto-cleaned when key GC'd
}

// 3. BATCH OPERATIONS
// ❌ Bad: Many small operations
for (let i = 0; i < 1000; i++) {
  updateDOM(data[i]);
}

// ✅ Good: Batch update
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createNode(data[i]));
}
document.body.appendChild(fragment);
```

### Q20: Best Practices Summary

```javascript
// 1. Prefer const for arrays (reference immutability)
const arr = [1, 2, 3]; // ✅
// let arr = [1, 2, 3]; // ❌ (unless reassigning)

// 2. Use array methods over loops
const doubled = arr.map(x => x * 2); // ✅
// Manual loop // ❌

// 3. Avoid mutating operations
const sorted = [...arr].sort(); // ✅
// arr.sort(); // ❌

// 4. Use Set for unique values
const unique = [...new Set(arr)]; // ✅

// 5. Use Map for key-value with object keys
const map = new Map(); // ✅
// const obj = {}; // ❌ (only string keys)

// 6. Cache array length in loops
const len = arr.length; // ✅

// 7. Use destructuring
const [first, ...rest] = arr; // ✅

// 8. Use spread over concat/slice
const merged = [...arr1, ...arr2]; // ✅
// const merged = arr1.concat(arr2); // ❌

// 9. Use includes over indexOf
arr.includes(5); // ✅
// arr.indexOf(5) !== -1; // ❌

// 10. Use at() for negative indexing
arr.at(-1); // ✅
// arr[arr.length - 1]; // ❌
```

### Resources
- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [JavaScript.info: Data Types](https://javascript.info/data-types)

