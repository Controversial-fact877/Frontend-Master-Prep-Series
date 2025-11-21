<details>
<summary><strong>🔍 Deep Dive: Equality Algorithms and Performance</strong></summary>

**The Complete Abstract Equality Algorithm (==):**

According to ECMAScript specification, the `==` operator follows these steps:

```javascript
// Abstract Equality Comparison Algorithm (simplified)
function abstractEquality(x, y) {
  // 1. If types are the same, use strict equality
  if (typeof x === typeof y) {
    return x === y;
  }

  // 2. null and undefined are equal to each other
  if ((x === null && y === undefined) || (x === undefined && y === null)) {
    return true;
  }

  // 3. Number and String: convert string to number
  if (typeof x === 'number' && typeof y === 'string') {
    return x === Number(y);
  }
  if (typeof x === 'string' && typeof y === 'number') {
    return Number(x) === y;
  }

  // 4. Boolean: convert to number (true → 1, false → 0)
  if (typeof x === 'boolean') {
    return Number(x) == y;
  }
  if (typeof y === 'boolean') {
    return x == Number(y);
  }

  // 5. Object and Primitive: convert object to primitive
  if ((typeof x === 'object' || typeof x === 'function') && isPrimitive(y)) {
    return ToPrimitive(x) == y;
  }
  if (isPrimitive(x) && (typeof y === 'object' || typeof y === 'function')) {
    return x == ToPrimitive(y);
  }

  // 6. Otherwise, not equal
  return false;
}

function isPrimitive(value) {
  return value !== Object(value);
}
```

**The Strict Equality Algorithm (===):**

```javascript
// Strict Equality Comparison Algorithm
function strictEquality(x, y) {
  // 1. If types differ, return false immediately
  if (typeof x !== typeof y) {
    return false;
  }

  // 2. If both undefined
  if (x === undefined && y === undefined) {
    return true;
  }

  // 3. If both null
  if (x === null && y === null) {
    return true;
  }

  // 4. If both numbers
  if (typeof x === 'number') {
    // NaN is not equal to itself
    if (isNaN(x) || isNaN(y)) {
      return false;
    }
    // -0 and +0 are equal
    if (x === 0 && y === 0) {
      return true; // Even if one is -0 and other is +0
    }
    // Normal number comparison
    return x === y;
  }

  // 5. If both strings, compare character by character
  if (typeof x === 'string') {
    return x === y; // Same characters in same order
  }

  // 6. If both booleans
  if (typeof x === 'boolean') {
    return x === y;
  }

  // 7. If both objects/functions
  // Only true if same reference
  return x === y;
}
```

**ToPrimitive Conversion Algorithm:**

```javascript
// ToPrimitive abstract operation
function ToPrimitive(obj, preferredType = 'default') {
  // If already primitive, return as-is
  if (typeof obj !== 'object') {
    return obj;
  }

  // Date objects prefer string conversion
  if (obj instanceof Date && preferredType === 'default') {
    preferredType = 'string';
  }

  // For most objects, prefer number
  if (preferredType === 'default') {
    preferredType = 'number';
  }

  // Try valueOf first for number preference
  if (preferredType === 'number') {
    if (typeof obj.valueOf === 'function') {
      const val = obj.valueOf();
      if (isPrimitive(val)) return val;
    }
    if (typeof obj.toString === 'function') {
      const str = obj.toString();
      if (isPrimitive(str)) return str;
    }
  }

  // Try toString first for string preference
  if (preferredType === 'string') {
    if (typeof obj.toString === 'function') {
      const str = obj.toString();
      if (isPrimitive(str)) return str;
    }
    if (typeof obj.valueOf === 'function') {
      const val = obj.valueOf();
      if (isPrimitive(val)) return val;
    }
  }

  throw new TypeError('Cannot convert object to primitive value');
}

// Examples of ToPrimitive in action:
const obj = {
  valueOf() { return 42; },
  toString() { return "hello"; }
};

console.log(obj == 42);     // true (valueOf returns 42)
console.log(obj == "hello"); // false (valueOf tried first, returns 42)

const arr = [5];
console.log(arr == 5); // true
// Steps: arr.valueOf() → [5] (not primitive)
//        arr.toString() → "5" (primitive!)
//        "5" == 5 → Number("5") == 5 → 5 == 5 → true
```

**V8 Performance Internals:**

```javascript
// Benchmark: 10 million comparisons
const iterations = 10000000;

// Test 1: Strict equality (same types)
console.time('=== same types');
let result1;
for (let i = 0; i < iterations; i++) {
  result1 = 5 === 5;
}
console.timeEnd('=== same types'); // ~12ms

// Test 2: Strict equality (different types)
console.time('=== different types');
let result2;
for (let i = 0; i < iterations; i++) {
  result2 = 5 === "5";
}
console.timeEnd('=== different types'); // ~13ms (fast type check, early return)

// Test 3: Loose equality (same types)
console.time('== same types');
let result3;
for (let i = 0; i < iterations; i++) {
  result3 = 5 == 5;
}
console.timeEnd('== same types'); // ~15ms (type check + comparison)

// Test 4: Loose equality (coercion needed)
console.time('== with coercion');
let result4;
for (let i = 0; i < iterations; i++) {
  result4 = 5 == "5";
}
console.timeEnd('== with coercion'); // ~85ms (string to number conversion!)

// Test 5: Loose equality (object conversion)
console.time('== object conversion');
let result5;
for (let i = 0; i < iterations; i++) {
  result5 = [5] == 5;
}
console.timeEnd('== object conversion'); // ~425ms (ToPrimitive is expensive!)

// Performance summary:
// ===: 1.2-1.5ns per comparison
// == (same types): 1.5-2ns per comparison
// == (primitive coercion): 8.5ns per comparison (5-7x slower)
// == (object coercion): 42.5ns per comparison (30-35x slower!)
```

**Memory Implications:**

```javascript
// Memory allocation during coercion

// Scenario 1: String to number (temporary allocation)
function compareStrNum() {
  return "12345" == 12345;
  // Steps:
  // 1. Allocate temp number from string: ~8 bytes
  // 2. Compare numbers
  // 3. GC cleans up temp value
  // Memory spike: 8 bytes per call
}

// Scenario 2: Object to primitive (multiple allocations)
function compareObjNum() {
  return [1, 2, 3] == "1,2,3";
  // Steps:
  // 1. Call toString() on array: allocates string "1,2,3" (~16 bytes)
  // 2. Compare strings
  // 3. GC cleans up temp string
  // Memory spike: 16+ bytes per call
}

// Hot path implications:
// If called 1M times/second:
// compareStrNum: 8MB/sec temporary allocations
// compareObjNum: 16MB/sec temporary allocations
// GC pressure increases significantly!

// Solution: Use === and explicit conversion
function compareOptimized() {
  const num = Number("12345"); // Explicit, one-time conversion
  return num === 12345; // Fast strict equality, no allocation
}
```

**Special Cases Deep Dive:**

```javascript
// 1. NaN is not equal to anything (even itself)
console.log(NaN == NaN);   // false
console.log(NaN === NaN);  // false

// Why? IEEE 754 floating point spec defines NaN as "not a number"
// Any comparison with NaN should be false (undefined result)

// Proper NaN checks:
console.log(Number.isNaN(NaN));        // true ✅
console.log(Number.isNaN("hello"));    // false ✅
console.log(isNaN("hello"));           // true ❌ (converts to number first!)
console.log(Object.is(NaN, NaN));      // true ✅

// 2. +0 and -0 are equal in both == and ===
console.log(+0 == -0);   // true
console.log(+0 === -0);  // true

// But they're different in Object.is:
console.log(Object.is(+0, -0)); // false

// Why? For performance. Most code doesn't care about sign of zero.
// Object.is provides "true" equality when you need it.

// Real-world case where it matters:
function calculateSlope(x1, y1, x2, y2) {
  const slope = (y2 - y1) / (x2 - x1);

  // Horizontal line: slope = 0 / 5 = +0
  // Vertical line approaching from left: slope = 5 / 0 = +Infinity
  // Vertical line approaching from right: slope = 5 / -0 = -Infinity

  if (Object.is(slope, -0)) {
    return "Approaching from negative direction";
  }
  if (Object.is(slope, +0)) {
    return "Horizontal line";
  }
}

// 3. The infamous [] == ![]
console.log([] == ![]); // true (wat?!)

// Step-by-step breakdown:
// Step 1: Evaluate ![]
//   [] is truthy (all objects are truthy)
//   ![] → !true → false
// Step 2: Now we have [] == false
// Step 3: Boolean to number
//   false → 0
//   Now: [] == 0
// Step 4: Object to primitive
//   [].toString() → ""
//   Now: "" == 0
// Step 5: String to number
//   Number("") → 0
//   Now: 0 == 0
// Step 6: Finally!
//   0 == 0 → true

// More confusing cases:
console.log([] == 0);        // true ([] → "" → 0)
console.log([] == "");       // true ([] → "")
console.log("" == 0);        // true ("" → 0)
console.log(false == "");    // true (both → 0)
console.log(false == "0");   // true (both → 0)
console.log("" == "0");      // false (string comparison!)

// 4. null and undefined equality
console.log(null == undefined);  // true (special case in spec)
console.log(null === undefined); // false (different types)

// null and undefined ONLY equal each other with ==
console.log(null == 0);     // false
console.log(null == false); // false
console.log(null == "");    // false
console.log(null == null);  // true
console.log(null == undefined); // true ✅

console.log(undefined == 0);     // false
console.log(undefined == false); // false
console.log(undefined == "");    // false
console.log(undefined == null);  // true ✅
console.log(undefined == undefined); // true
```

**Object.is() - The "True" Equality:**

```javascript
// Object.is() is "SameValue" algorithm
// It differs from === in two cases:

// 1. NaN
console.log(NaN === NaN);        // false
console.log(Object.is(NaN, NaN)); // true ✅

// 2. +0 and -0
console.log(+0 === -0);          // true
console.log(Object.is(+0, -0));  // false ✅

// For everything else, it's the same as ===
console.log(5 === 5);              // true
console.log(Object.is(5, 5));      // true

console.log("hello" === "hello");  // true
console.log(Object.is("hello", "hello")); // true

console.log({} === {});            // false
console.log(Object.is({}, {}));    // false

// Use Object.is when:
// 1. Checking for NaN (better than Number.isNaN in some cases)
// 2. Distinguishing +0 from -0 (rare)
// 3. You want "truest" equality check

// Performance comparison:
const iterations = 10000000;

console.time('===');
for (let i = 0; i < iterations; i++) {
  5 === 5;
}
console.timeEnd('==='); // ~12ms

console.time('Object.is');
for (let i = 0; i < iterations; i++) {
  Object.is(5, 5);
}
console.timeEnd('Object.is'); // ~45ms (3-4x slower, but still fast)

// === is optimized at bytecode level
// Object.is is a function call (slight overhead)
```

**Transpilation Examples:**

```javascript
// How Babel transpiles equality checks for older browsers

// Your ES6 code:
const result = a === b;

// Transpiles to ES5 (no change, === is ES1):
var result = a === b;

// But Object.is polyfill:
if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Handle +0 and -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Handle NaN
      return x !== x && y !== y;
    }
  };
}

// Explanation of polyfill:
// If x === y is true:
//   If x is 0, check 1/x === 1/y
//   1/+0 = +Infinity, 1/-0 = -Infinity
//   So +0 and -0 will return false here ✅
// If x === y is false:
//   If both are NaN, x !== x and y !== y both true
//   (only NaN is not equal to itself)
//   Return true if both are NaN ✅
```

**V8 Optimization Levels:**

```javascript
// V8 has different optimization levels based on usage

// Cold code (first few executions):
function coldCompare(a, b) {
  return a === b;
}
// V8 uses Ignition interpreter
// ~5ns per comparison

// Warm code (after ~100 calls):
for (let i = 0; i < 100; i++) {
  coldCompare(5, 5);
}
// V8 still uses interpreter but marks for optimization
// ~3ns per comparison

// Hot code (after thousands of calls):
for (let i = 0; i < 10000; i++) {
  coldCompare(5, 5);
}
// V8 TurboFan optimizes to machine code
// Inlines the comparison
// ~1ns per comparison (fastest!)

// Deoptimization trigger:
coldCompare(5, "5"); // Different types!
// V8 deoptimizes back to interpreter
// Recompiles with type guards
// Performance drops to ~4ns temporarily

// Polymorphic code (multiple types):
function polyCompare(a, b) {
  return a === b;
}

polyCompare(5, 5);       // Number
polyCompare("a", "a");   // String
polyCompare(true, true); // Boolean

// V8 can optimize for up to 4 types (polymorphic IC)
// Beyond 4 types, becomes megamorphic (slow)
// Each comparison: ~7ns (slower than monomorphic)
```

**Comparison Table - Performance Summary:**

| Operation | Cold (ns) | Warm (ns) | Hot (ns) | Notes |
|-----------|-----------|-----------|----------|-------|
| `a === b` (same type) | 5 | 3 | 1.2 | Fastest |
| `a === b` (diff type) | 5 | 3 | 1.3 | Fast early return |
| `a == b` (same type) | 6 | 4 | 1.5 | Type check overhead |
| `a == b` (primitive coercion) | 15 | 10 | 8.5 | String→Number etc |
| `a == b` (object coercion) | 80 | 60 | 42.5 | ToPrimitive slow |
| `Object.is(a, b)` | 20 | 12 | 4.5 | Function call overhead |

**Key Takeaways:**
- Always use `===` unless you specifically need coercion
- `===` is 5-35x faster than `==` depending on types
- Object coercion with `==` causes significant GC pressure
- V8 optimizes monomorphic `===` to ~1ns (incredibly fast)
- Use `Object.is()` only when you need NaN or ±0 checks

</details>

<details>
<summary><strong>🐛 Real-World Scenario: E-commerce Inventory Bug</strong></summary>

**Scenario:** Your e-commerce platform shows "Out of Stock" for items that are actually available. Investigation reveals a critical bug in the inventory check logic caused by loose equality comparison. This is costing $15k/week in lost sales.

**The Problem:**

```javascript
// ❌ BUGGY CODE: Inventory check failing
function isProductAvailable(product) {
  // product.stock comes from API as string "0" or "5" etc
  // threshold is hardcoded as number 0

  if (product.stock == 0) {
    return false; // Out of stock
  }
  return true; // Available
}

// Real API response:
const product1 = { name: "T-Shirt", stock: "5" };   // String from API
const product2 = { name: "Shoes", stock: "0" };     // String from API
const product3 = { name: "Hat", stock: "" };        // Empty string (bug in API)
const product4 = { name: "Jacket", stock: null };   // null (deleted inventory)

// Testing:
console.log(isProductAvailable(product1)); // true ✅ (expected: available)
console.log(isProductAvailable(product2)); // false ✅ (expected: out of stock)
console.log(isProductAvailable(product3)); // false ❌ (expected: show error!)
console.log(isProductAvailable(product4)); // false ❌ (expected: show error!)

// The bug:
// "" == 0 → true (empty string coerced to 0)
// null == 0 → false... wait, that's correct?
// But: null == undefined → true, and we're checking == 0

// Actually worse bug:
const product5 = { name: "Pants", stock: false }; // Boolean bug in data
console.log(isProductAvailable(product5)); // false (false == 0 → true!)

// Production impact:
// - Products with stock: "5" showing as available ✅
// - Products with stock: "0" showing as unavailable ✅
// - Products with stock: "" showing as unavailable ❌ (should error)
// - Products with stock: false showing as unavailable ❌ (data corruption!)
// - Products with stock: null showing as available ❌ (deleted inventory shows!)
```

**Production Metrics Before Fix:**

```javascript
// Week 1 analysis (before fix):
const metrics = {
  totalProducts: 15000,
  productsWithIssues: 1250, // 8.3% have data quality issues

  // Breakdown of issues:
  emptyStringStock: 450,    // "" treated as out of stock
  nullStock: 200,           // null (deleted) showed as available!
  booleanStock: 100,        // false (corrupted data) showed as unavailable
  otherBadData: 500,        // Other coercion issues

  // Business impact:
  falseOutOfStock: 450,     // Items available but shown as out of stock
  falseInStock: 200,        // Items unavailable but shown as in stock!

  // Financial:
  lostSales: 15000,         // $15k/week (customers abandon when seeing "out of stock")
  customerComplaints: 85,   // Per week
  supportTickets: 120,      // "Why is X out of stock?" "I ordered Y but it's unavailable"
  refunds: 8500,            // Refunds for null-stock items ordered

  // Developer time:
  debugHours: 16,           // Hours per week investigating "stock issues"
  dataFixHours: 12          // Manual data cleanup
};

// Error logs:
// [ERROR] Order placed for product_id: 12345, but stock is null
// [ERROR] Customer charged for out-of-stock item (stock: null)
// [WARN] Product showing as unavailable, stock value: "" (empty string)
// [WARN] Stock value is boolean: false, product: Jacket

console.log(`Lost revenue: $${metrics.lostSales}/week`);
console.log(`Refunds issued: $${metrics.refunds}/week`);
console.log(`Net loss: $${metrics.lostSales + metrics.refunds}/week`);
// Net loss: $23,500/week
```

**Debugging Process:**

```javascript
// Step 1: Reproduce the bug locally
const testCases = [
  { stock: "5", expected: true, description: "String '5' should be available" },
  { stock: "0", expected: false, description: "String '0' should be unavailable" },
  { stock: 0, expected: false, description: "Number 0 should be unavailable" },
  { stock: 5, expected: true, description: "Number 5 should be available" },
  { stock: "", expected: "ERROR", description: "Empty string is invalid data" },
  { stock: null, expected: "ERROR", description: "null is deleted inventory" },
  { stock: undefined, expected: "ERROR", description: "undefined is missing data" },
  { stock: false, expected: "ERROR", description: "Boolean is corrupted data" },
];

function debugIsProductAvailable(product) {
  console.log('\n---');
  console.log('Stock value:', JSON.stringify(product.stock));
  console.log('Type:', typeof product.stock);
  console.log('stock == 0:', product.stock == 0);
  console.log('stock === 0:', product.stock === 0);

  if (product.stock == 0) {
    return false;
  }
  return true;
}

testCases.forEach(test => {
  const result = debugIsProductAvailable({ stock: test.stock });
  const passed = result === test.expected;
  console.log(`${passed ? '✅' : '❌'} ${test.description}`);
});

// Output reveals the issue:
// ---
// Stock value: ""
// Type: string
// stock == 0: true ❌ (empty string coerced to 0!)
// stock === 0: false
// ❌ Empty string is invalid data

// ---
// Stock value: null
// Type: object
// stock == 0: false ✅ (surprisingly correct, but...)
// stock === 0: false
// But null should trigger error, not "available"!

// Step 2: Analyze API data
async function analyzeStockData() {
  const products = await fetchAllProducts(); // 15,000 products

  const analysis = {
    validNumber: 0,
    validString: 0,
    emptyString: 0,
    null: 0,
    undefined: 0,
    boolean: 0,
    object: 0
  };

  products.forEach(p => {
    const type = typeof p.stock;
    if (type === 'number') analysis.validNumber++;
    else if (type === 'string') {
      if (p.stock === '') analysis.emptyString++;
      else analysis.validString++;
    }
    else if (p.stock === null) analysis.null++;
    else if (p.stock === undefined) analysis.undefined++;
    else if (type === 'boolean') analysis.boolean++;
    else analysis.object++;
  });

  console.table(analysis);
  // ┌─────────────────┬────────┐
  // │ validNumber     │ 12,350 │
  // │ validString     │ 2,200  │
  // │ emptyString     │ 450    │
  // │ null            │ 200    │
  // │ undefined       │ 50     │
  // │ boolean         │ 100    │
  // │ object          │ 0      │
  // └─────────────────┴────────┘

  // Insight: 8.3% of products have invalid stock data!
}

// Step 3: Find root cause
// API returns stock as string: "5" instead of number: 5
// Empty string "" when data missing (should be null)
// null when inventory deleted (should be caught)
// Boolean false from old migration (corrupted data)
```

**Solution 1: Strict Equality + Type Validation:**

```javascript
// ✅ FIX: Use strict equality and validate types
function isProductAvailable(product) {
  const { stock } = product;

  // Validate stock type
  if (typeof stock !== 'number' && typeof stock !== 'string') {
    throw new Error(`Invalid stock type: ${typeof stock}, value: ${JSON.stringify(stock)}`);
  }

  // Convert to number if string
  const stockNum = typeof stock === 'string' ? Number(stock) : stock;

  // Check if conversion failed
  if (Number.isNaN(stockNum)) {
    throw new Error(`Invalid stock value: ${stock}`);
  }

  // Strict equality check
  if (stockNum === 0) {
    return false; // Out of stock
  }

  if (stockNum < 0) {
    throw new Error(`Negative stock value: ${stockNum}`);
  }

  return true; // Available
}

// Now handles all edge cases:
console.log(isProductAvailable({ stock: "5" }));   // true ✅
console.log(isProductAvailable({ stock: "0" }));   // false ✅
console.log(isProductAvailable({ stock: 5 }));     // true ✅
console.log(isProductAvailable({ stock: 0 }));     // false ✅

// Throws errors for invalid data:
// isProductAvailable({ stock: "" });     // Error: Invalid stock value
// isProductAvailable({ stock: null });   // Error: Invalid stock type
// isProductAvailable({ stock: false });  // Error: Invalid stock type
// isProductAvailable({ stock: -5 });     // Error: Negative stock value
```

**Solution 2: Schema Validation with Zod:**

```javascript
// ✅ BETTER: Use schema validation library
import { z } from 'zod';

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  stock: z.union([
    z.number().int().nonnegative(),
    z.string().regex(/^\d+$/).transform(Number)
  ]),
  price: z.number().positive()
});

function isProductAvailable(product) {
  // Validate and transform
  const validated = productSchema.parse(product);

  // Now stock is guaranteed to be valid number
  return validated.stock > 0;
}

// Usage:
try {
  const product = { id: 1, name: "T-Shirt", stock: "5", price: 29.99 };
  const available = isProductAvailable(product);
  console.log(available); // true
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.errors);
    // Log to error tracking service
    logError('Invalid product data', { error, product });
  }
}

// Catches all invalid data at validation layer:
// isProductAvailable({ stock: "" });     // ZodError: Invalid stock format
// isProductAvailable({ stock: null });   // ZodError: Expected number | string
// isProductAvailable({ stock: false });  // ZodError: Expected number | string
```

**Solution 3: API Contract Enforcement:**

```javascript
// ✅ BEST: Fix at source - enforce API contract
// Backend API response normalization:

// Express.js middleware
function normalizeProductData(req, res, next) {
  if (res.locals.products) {
    res.locals.products = res.locals.products.map(product => {
      // Ensure stock is number
      let stock = product.stock;

      // Handle string → number
      if (typeof stock === 'string') {
        stock = stock.trim();
        if (stock === '') {
          throw new Error(`Product ${product.id} has empty stock`);
        }
        stock = Number(stock);
      }

      // Handle null/undefined → error
      if (stock == null) {
        throw new Error(`Product ${product.id} has null/undefined stock`);
      }

      // Handle boolean → error
      if (typeof stock === 'boolean') {
        throw new Error(`Product ${product.id} has boolean stock: ${stock}`);
      }

      // Validate number
      if (!Number.isInteger(stock) || stock < 0) {
        throw new Error(`Product ${product.id} has invalid stock: ${stock}`);
      }

      return {
        ...product,
        stock // Guaranteed to be valid non-negative integer
      };
    });
  }
  next();
}

app.use('/api/products', normalizeProductData);

// Frontend can now trust the data:
function isProductAvailable(product) {
  // No validation needed - API contract guarantees valid number
  return product.stock > 0;
}
```

**Solution 4: Database Schema Fix:**

```sql
-- ✅ ALSO FIX: Database schema to prevent bad data

-- Old schema (allows any type):
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  stock TEXT,  -- ❌ TEXT allows anything!
  price DECIMAL(10,2)
);

-- New schema (enforces correct type):
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,  -- ✅ Only non-negative integers
  price DECIMAL(10,2) NOT NULL,
  CHECK (stock >= 0),  -- Extra safety
  CHECK (price > 0)
);

-- Migration to fix existing data:
UPDATE products
SET stock = 0
WHERE stock IS NULL
   OR stock = ''
   OR CAST(stock AS SIGNED) < 0;

-- Delete corrupted entries:
DELETE FROM products
WHERE stock NOT REGEXP '^[0-9]+$';
```

**Comprehensive Fix - All Layers:**

```javascript
// Layer 1: Database constraint (prevents bad data at source)
// Layer 2: API validation (catches issues before response)
// Layer 3: Frontend validation (defense in depth)

// Frontend with all fixes:
import { z } from 'zod';

const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  stock: z.number().int().nonnegative(),
  price: z.number().positive()
});

async function fetchProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();

    // Validate response
    const product = productSchema.parse(data);
    return product;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log validation error
      console.error('API returned invalid product data:', error);
      logToErrorTracking('Invalid product API response', { id, error });
      throw new Error('Product data validation failed');
    }
    throw error;
  }
}

function isProductAvailable(product) {
  // Type guaranteed by schema, safe to use strict equality
  return product.stock > 0;
}

// Usage with error handling:
async function displayProduct(id) {
  try {
    const product = await fetchProduct(id);
    const available = isProductAvailable(product);

    if (available) {
      showAddToCartButton();
    } else {
      showOutOfStockMessage();
    }
  } catch (error) {
    showErrorMessage('Unable to load product');
  }
}
```

**Real Metrics After Fix:**

```javascript
// Week 1 after deployment:
const metricsAfterFix = {
  totalProducts: 15000,
  productsWithIssues: 0,  // ✅ All fixed at database level

  // Data quality:
  validProducts: 15000,   // 100%

  // Business impact:
  falseOutOfStock: 0,     // ✅ Fixed
  falseInStock: 0,        // ✅ Fixed

  // Financial recovery:
  lostSales: 0,           // $0/week (was $15k)
  customerComplaints: 8,  // 90% reduction (was 85)
  supportTickets: 15,     // 87% reduction (was 120)
  refunds: 0,             // $0/week (was $8.5k)

  // Developer time recovered:
  debugHours: 0,          // (was 16/week)
  dataFixHours: 0,        // (was 12/week)

  // New monitoring:
  validationErrors: 0,    // Caught at API layer
  schemaViolations: 0     // Prevented by database
};

// Financial impact:
const weeklyRecovery = 15000 + 8500; // $23.5k/week
const annualRecovery = weeklyRecovery * 52; // $1.22M/year

console.log('Weekly revenue recovered: $' + weeklyRecovery);
console.log('Annual revenue impact: $' + annualRecovery);

// Developer time saved:
const hoursPerWeek = 16 + 12; // 28 hours
const annualHours = hoursPerWeek * 52; // 1,456 hours
const developerCostPerHour = 75;
const annualDeveloperSavings = annualHours * developerCostPerHour; // $109,200

console.log('Developer time saved annually: ' + annualHours + ' hours');
console.log('Developer cost savings: $' + annualDeveloperSavings);

// Customer satisfaction:
const satisfactionBefore = 72; // %
const satisfactionAfter = 94;  // %
const improvement = satisfactionAfter - satisfactionBefore; // +22%

console.log('Customer satisfaction improvement: +' + improvement + '%');
```

**Key Lessons:**

1. **Never use `==` for critical business logic** - Type coercion can hide data quality issues
2. **Validate at all layers** - Database, API, Frontend (defense in depth)
3. **Use strict equality `===`** - Catches type mismatches immediately
4. **Schema validation is essential** - Use Zod, Yup, or similar for runtime validation
5. **Monitor data quality** - Track validation errors to catch issues early
6. **Fix at source** - Database constraints prevent bad data from entering system

</details>

<details>
<summary><strong>⚖️ Trade-offs: == vs === in Different Scenarios</strong></summary>

**Comparison Matrix:**

| Aspect | `==` (Loose) | `===` (Strict) | `Object.is()` |
|--------|--------------|----------------|---------------|
| **Type coercion** | ✅ Yes (automatic) | ❌ No | ❌ No |
| **Performance** | ⚠️ Slower (5-35x) | ✅ Fastest | ⚠️ Slower (3-4x) |
| **Predictability** | ❌ Complex rules | ✅ Simple | ✅ Simple |
| **null == undefined** | ✅ true | ❌ false | ❌ false |
| **NaN == NaN** | ❌ false | ❌ false | ✅ true |
| **+0 == -0** | ✅ true | ✅ true | ❌ false |
| **Memory overhead** | ⚠️ Allocations | ✅ None | ✅ None |
| **ESLint warnings** | ⚠️ Discouraged | ✅ Encouraged | ✅ OK |
| **Interview answer** | ❌ Know but avoid | ✅ Default choice | ⚠️ Special cases |

---

### Pattern 1: Checking for Null or Undefined

```javascript
// Scenario: Check if value is null or undefined

// Pattern A: Using ==
function isNullish(value) {
  return value == null;
}

// Pattern B: Using === (explicit)
function isNullishExplicit(value) {
  return value === null || value === undefined;
}

// Pattern C: Using nullish coalescing awareness
function isNullishModern(value) {
  return value ?? null === null; // Clever but unclear
}
```

| Aspect | `== null` | `=== null \|\| === undefined` | Recommendation |
|--------|-----------|-------------------------------|----------------|
| **Readability** | ⚠️ Requires knowledge | ✅ Very explicit | Use `==` here |
| **Performance** | ✅ Faster (one check) | ⚠️ Two checks | `==` wins |
| **Coverage** | ✅ Both null & undefined | ✅ Both | Same |
| **Intent** | ⚠️ Less clear | ✅ Very clear | Depends on team |

**Recommendation:**
```javascript
// ✅ ACCEPTABLE: One of few cases where == is OK
if (value == null) {
  // Handles both null and undefined
}

// ✅ ALTERNATIVE: Modern approach
if (value === null || value === undefined) {
  // More explicit, better for beginners
}

// ✅ MODERN: Use nullish coalescing operator
const result = value ?? defaultValue;
// Shorter and clearer than checking null/undefined
```

---

### Pattern 2: User Input Validation

```javascript
// Scenario: Form input might be string or number

// Pattern A: Using == (dangerous!)
function validateAge(age) {
  if (age == 18) {
    return "Exactly 18";
  }
  return "Not 18";
}

validateAge(18);    // "Exactly 18" ✅
validateAge("18");  // "Exactly 18" ❌ Should validate type!
validateAge("18.0"); // "Exactly 18" ❌ Float coerced to int

// Pattern B: Explicit conversion + ===
function validateAgeExplicit(age) {
  const ageNum = Number(age);

  if (Number.isNaN(ageNum)) {
    throw new Error("Invalid age");
  }

  if (ageNum === 18) {
    return "Exactly 18";
  }
  return "Not 18";
}

// Pattern C: Type check first
function validateAgeStrict(age) {
  if (typeof age !== 'number') {
    throw new Error("Age must be a number");
  }

  if (age === 18) {
    return "Exactly 18";
  }
  return "Not 18";
}
```

| Pattern | Pros | Cons | Use When |
|---------|------|------|----------|
| **`==`** | Short | Hides type issues | ❌ Never for validation |
| **Convert + `===`** | Flexible | May accept bad input | ✅ User input processing |
| **Type check + `===`** | Type safe | Strict | ✅ Internal APIs |

---

### Pattern 3: Array/Object Checks

```javascript
// Scenario: Check if array contains value

const numbers = [1, 2, 3, 4, 5];

// Pattern A: indexOf with ==
// (not possible - indexOf uses ===)

// Pattern B: includes (uses SameValueZero, similar to ===)
numbers.includes(3);  // true
numbers.includes("3"); // false ✅ No coercion

// Pattern C: find with ==
numbers.find(n => n == "3"); // 3 ❌ Finds it with coercion

// Pattern D: find with ===
numbers.find(n => n === 3);  // 3 ✅ Type-safe
```

**Recommendation:**
```javascript
// ✅ BEST: Use strict methods
const hasNumber = numbers.includes(3); // Built-in strict check
const found = numbers.find(n => n === 3); // Explicit strict check

// ❌ AVOID: Loose equality in array operations
const foundLoose = numbers.find(n => n == "3"); // Type confusion!
```

---

### Pattern 4: Switch Statements

```javascript
// Switch uses strict equality (===) internally

const value = "1";

switch (value) {
  case 1:
    console.log("Number one"); // Not triggered
    break;
  case "1":
    console.log("String one"); // ✅ Triggered
    break;
}

// Can't change this behavior - switch is always strict
// This is good! Predictable.

// Pattern A: Emulate loose with conversion
switch (Number(value)) {
  case 1:
    console.log("One"); // ✅ Triggered after conversion
    break;
}

// Pattern B: Use if/else with ==
if (value == 1) {
  console.log("One"); // Triggered, but less clear
}
```

**Recommendation:** Switch uses `===` by default. Convert explicitly if needed.

---

### Pattern 5: Performance-Critical Code

```javascript
// Scenario: Comparing millions of values

// Benchmark setup
const iterations = 10000000;
const values = Array.from({ length: iterations }, (_, i) => i);

// Pattern A: Strict equality (fast)
console.time('=== comparison');
let count1 = 0;
for (const val of values) {
  if (val === 5000000) count1++;
}
console.timeEnd('=== comparison'); // ~35ms

// Pattern B: Loose equality same types (slightly slower)
console.time('== comparison same type');
let count2 = 0;
for (const val of values) {
  if (val == 5000000) count2++;
}
console.timeEnd('== comparison same type'); // ~42ms

// Pattern C: Loose equality with coercion (much slower)
const stringValues = values.map(String);
console.time('== comparison with coercion');
let count3 = 0;
for (const val of stringValues) {
  if (val == 5000000) count3++;
}
console.timeEnd('== comparison with coercion'); // ~280ms (8x slower!)
```

| Operation | Time (10M iterations) | Relative Speed |
|-----------|----------------------|----------------|
| `===` | 35ms | 1x (baseline) |
| `==` (same type) | 42ms | 1.2x slower |
| `==` (with coercion) | 280ms | 8x slower |

**Recommendation:** Always use `===` in hot paths.

---

### Pattern 6: Conditional Logic

```javascript
// Scenario: Multiple conditions

const user = { age: null, name: "", verified: false };

// Pattern A: Using == for null check
if (user.age == null) {
  console.log("Age not provided"); // ✅ Catches null and undefined
}

// Pattern B: Using === for explicit checks
if (user.age === null || user.age === undefined) {
  console.log("Age not provided"); // ✅ Same result, more explicit
}

// Pattern C: Using !== for "has value" check
if (user.name !== "") {
  console.log("Name provided"); // ✅ Explicit check
}

// Pattern D: Dangerous - truthy check
if (user.name) {
  console.log("Name provided"); // ✅ Works, but doesn't distinguish "" from undefined
}

// Pattern E: Very dangerous - == with falsy
if (user.verified == true) {
  console.log("Verified"); // false (correct)
}
if (user.verified == false) {
  console.log("Not verified"); // true (correct)
}
// BUT:
const verified2 = 0; // Bug in data
if (verified2 == false) {
  console.log("Not verified"); // true ❌ (0 coerced to false!)
}
```

**Decision Matrix:**

| Goal | Best Pattern | Reason |
|------|-------------|--------|
| Check null/undefined | `== null` or `=== null \|\| === undefined` | Clear intent |
| Check empty string | `=== ""` | Explicit |
| Check boolean | `=== true` or `=== false` | Avoid coercion bugs |
| Check number | `=== 0`, etc | Avoid "", false coercion |
| Check "has value" | `!= null` or `?? ` | Modern approach |

---

### Pattern 7: API Response Handling

```javascript
// Scenario: API returns inconsistent types

// API response examples:
const response1 = { status: 200, count: "5" };   // String (bad API)
const response2 = { status: 200, count: 5 };     // Number (good API)
const response3 = { status: 200, count: null };  // null (no data)

// Pattern A: Using == (hides type issues)
function getCount(response) {
  if (response.count == 5) {
    return "Five items";
  }
  return "Other";
}

getCount(response1); // "Five items" (works but hides bug)
getCount(response2); // "Five items" (works)
getCount(response3); // "Other" (works)

// Pattern B: Type validation + ===
function getCountSafe(response) {
  const count = typeof response.count === 'string'
    ? Number(response.count)
    : response.count;

  if (Number.isNaN(count) || count === null) {
    throw new Error("Invalid count");
  }

  if (count === 5) {
    return "Five items";
  }
  return "Other";
}

// Pattern C: Schema validation (best)
import { z } from 'zod';

const responseSchema = z.object({
  status: z.number(),
  count: z.union([
    z.number(),
    z.string().transform(Number)
  ]).nullable()
});

function getCountBest(response) {
  const validated = responseSchema.parse(response);

  if (validated.count === 5) {
    return "Five items";
  }
  return "Other";
}
```

**Recommendation:** Never rely on `==` to paper over API inconsistencies. Validate and normalize at boundaries.

---

### Pattern 8: Testing and Assertions

```javascript
// Test framework comparisons

// Jest
expect(value).toBe(expected);          // Uses Object.is() internally
expect(value).toEqual(expected);       // Deep equality check
expect(value).toStrictEqual(expected); // Strict deep equality

// Manual assertions
function assertEqual(actual, expected) {
  if (actual === expected) {
    console.log("✅ Pass");
  } else {
    console.log("❌ Fail:", actual, "!==", expected);
  }
}

// Loose equality assertion (almost never use)
function assertLooseEqual(actual, expected) {
  if (actual == expected) {
    console.log("✅ Pass");
  } else {
    console.log("❌ Fail:", actual, "!=", expected);
  }
}

// Examples:
assertEqual(5, 5);        // ✅ Pass
assertEqual(5, "5");      // ❌ Fail (good - catches type difference)
assertLooseEqual(5, "5"); // ✅ Pass (bad - hides type difference)
```

**Recommendation:** Tests should use strict equality (`===` / `Object.is()`) to catch type bugs.

---

### Summary Table: When to Use Each

| Scenario | Use `==` | Use `===` | Use `Object.is()` |
|----------|---------|-----------|-------------------|
| **Null/undefined check** | ✅ `x == null` | ✅ `x === null \|\| x === undefined` | ❌ Overkill |
| **User input validation** | ❌ Never | ✅ After conversion | ❌ Overkill |
| **Business logic** | ❌ Never | ✅ Always | ⚠️ Rarely |
| **Performance-critical** | ❌ Never | ✅ Always | ❌ Slower |
| **Array operations** | ❌ Never | ✅ Always | ⚠️ For NaN |
| **Testing** | ❌ Never | ✅ Default | ✅ Special cases |
| **API responses** | ❌ Never | ✅ After validation | ❌ Overkill |
| **Checking NaN** | ❌ Doesn't work | ❌ Doesn't work | ✅ Works |
| **Checking ±0** | ❌ Can't distinguish | ❌ Can't distinguish | ✅ Distinguishes |

---

### Decision Flowchart:

```
Do you need to check for null OR undefined?
├─ Yes → Use `value == null` OR `value === null || value === undefined`
│         (Modern: use `??` operator instead)
└─ No ↓

Do you need to distinguish +0 from -0?
├─ Yes → Use Object.is(value1, value2)
└─ No ↓

Do you need to check for NaN?
├─ Yes → Use Number.isNaN(value) OR Object.is(value, NaN)
└─ No ↓

Default → Use === (strict equality)
```

**General Rule:** Use `===` 99% of the time. The only common exception is `value == null`.

</details>

<details>
<summary><strong>💬 Explain to Junior: Equality Simplified</strong></summary>

**Simple Analogy: Matching Socks**

Imagine you're matching socks from the laundry:

**`===` (Strict Equality) - Exact Match Only:**
```javascript
// Both must be EXACTLY the same
const sock1 = "red crew sock size 10";
const sock2 = "red crew sock size 10";

sock1 === sock2; // true ✅ (exactly the same)

const sock3 = "red crew sock size 10";
const sock4 = "red ankle sock size 10"; // Different style!

sock3 === sock4; // false ❌ (not exactly the same)
```

**`==` (Loose Equality) - "Close Enough" Match:**
```javascript
// JavaScript tries to make them match
const sock1 = "red size 10";
const sock2 = 10; // A number!

sock1 == sock2; // JavaScript says: "Hmm, let me try to make these match"
// Converts "red size 10" to a number... NaN
// NaN == 10? false

// But:
const sock5 = "10";
const sock6 = 10;

sock5 == sock6; // true ✅
// JavaScript: "10" → convert to number → 10
// 10 == 10? Yes!
```

**Why `===` is Better:**

```javascript
// Scenario: Checking if user entered exactly "0"

const userInput = "0"; // User typed zero

// With == (loose):
if (userInput == 0) {
  console.log("User entered zero");
  // true ✅ (but input was string "0", not number 0!)
  // This hides that you're comparing different types
}

// With === (strict):
if (userInput === 0) {
  console.log("User entered zero");
  // false ❌ (catches the type mismatch)
}

// Better approach:
if (Number(userInput) === 0) {
  console.log("User entered zero");
  // true ✅ (explicit conversion, then strict check)
}
```

---

**Common Beginner Mistakes:**

**Mistake 1: Expecting `==` to be "helpful"**

```javascript
const count = 0; // Number zero

// ❌ Mistake: Using ==
if (count == false) {
  console.log("Count is false");
  // true ❌ (0 coerced to false!)
  // But 0 is a valid count, not "false"!
}

// ✅ Correct: Using ===
if (count === false) {
  console.log("Count is false");
  // false ✅ (number vs boolean, correctly returns false)
}

// Better: Be explicit about what you're checking
if (count === 0) {
  console.log("Count is zero"); // Clear intent!
}
```

**Mistake 2: Using `==` with objects/arrays**

```javascript
// Objects and arrays NEVER equal each other (even with ==)
// They're only equal if they're the SAME object (same reference)

const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];

console.log(arr1 == arr2);  // false ❌
console.log(arr1 === arr2); // false ❌

// Why? Different objects in memory
// arr1 points to memory location A
// arr2 points to memory location B
// A !== B

// Same reference:
const arr3 = arr1; // Points to same memory location as arr1
console.log(arr1 === arr3); // true ✅ (same reference)
```

**Mistake 3: Not understanding `null` vs `undefined`**

```javascript
// null = explicitly empty
// undefined = not set yet

let a;          // undefined (no value assigned)
let b = null;   // null (explicitly set to "nothing")

console.log(a == b);  // true ✅ (special case: null and undefined are "equal" with ==)
console.log(a === b); // false ❌ (different types)

// But they're NOT equal to anything else:
console.log(null == 0);     // false
console.log(null == false); // false
console.log(null == "");    // false
console.log(null == null);  // true
console.log(null == undefined); // true ✅ (only exception!)
```

---

**Practical Examples for Beginners:**

**Example 1: Age Validation**

```javascript
function canDrink(age) {
  // ❌ BAD: Using ==
  if (age == 21) {
    return "Can drink";
  }
  return "Cannot drink";
}

canDrink(21);   // "Can drink" ✅
canDrink("21"); // "Can drink" ❌ (accepts string!)
canDrink("21.0"); // "Can drink" ❌ (accepts string with decimal!)

// ✅ GOOD: Using === with explicit conversion
function canDrinkBetter(age) {
  // Convert to number first
  const ageNum = Number(age);

  // Check if valid number
  if (Number.isNaN(ageNum)) {
    return "Invalid age";
  }

  // Strict check
  if (ageNum === 21) {
    return "Can drink";
  }
  return "Cannot drink";
}

canDrinkBetter(21);     // "Can drink" ✅
canDrinkBetter("21");   // "Can drink" ✅ (converted explicitly)
canDrinkBetter("abc");  // "Invalid age" ✅ (caught bad input)
```

**Example 2: Form Validation**

```javascript
// User submits form with checkbox

// ❌ BAD: Loose equality
function processForm(data) {
  if (data.agreeToTerms == true) {
    console.log("User agreed");
  }
}

// Dangerous because:
processForm({ agreeToTerms: true });   // Works ✅
processForm({ agreeToTerms: 1 });      // Works ❌ (1 == true)
processForm({ agreeToTerms: "true" }); // Doesn't work (bug!)

// ✅ GOOD: Strict equality
function processFormBetter(data) {
  if (data.agreeToTerms === true) {
    console.log("User agreed");
  } else {
    console.log("User did not agree");
  }
}

processFormBetter({ agreeToTerms: true });   // "User agreed" ✅
processFormBetter({ agreeToTerms: 1 });      // "User did not agree" ✅ (caught!)
processFormBetter({ agreeToTerms: "true" }); // "User did not agree" ✅ (caught!)
```

**Example 3: Finding in Array**

```javascript
const ids = [1, 2, 3, 4, 5];

// ❌ BAD: Using == in find
const found1 = ids.find(id => id == "3");
console.log(found1); // 3 (works, but accepted string)

// ✅ GOOD: Using === in find
const found2 = ids.find(id => id === 3);
console.log(found2); // 3 (only accepts numbers)

// Why it matters:
const mixedIds = [1, 2, "3", 4, 5]; // Bug: one ID is string

const found3 = mixedIds.find(id => id == 3);
console.log(found3); // "3" ❌ (found string, might cause bugs later)

const found4 = mixedIds.find(id => id === 3);
console.log(found4); // undefined ✅ (correctly didn't find number 3)
```

---

**Visual Comparison Table:**

| Code | `==` Result | `===` Result | Why? |
|------|------------|--------------|------|
| `5 == 5` | `true` | `true` | Same type, same value |
| `5 == "5"` | `true` | `false` | `==` converts "5" to 5 |
| `0 == false` | `true` | `false` | `==` converts false to 0 |
| `"" == false` | `true` | `false` | `==` converts both to 0 |
| `null == undefined` | `true` | `false` | Special case in spec |
| `[1] == 1` | `true` | `false` | `==` converts [1] → "1" → 1 |
| `[] == 0` | `true` | `false` | `==` converts [] → "" → 0 |

---

**Explaining to a PM:**

"Think of `===` like a bouncer at an exclusive club:

**With `===` (strict bouncer):**
- Name must match EXACTLY
- ID must match EXACTLY
- Any difference? You're not getting in

**With `==` (lenient bouncer):**
- Name close enough? Sure!
- ID looks similar? OK!
- Oh, that's your cousin? They're basically you, come in!

**Why strict is better for code:**

1. **Catches bugs early:** If someone passes wrong type, `===` catches it immediately
2. **Clearer code:** Other developers know exactly what types you expect
3. **Faster:** Computer doesn't have to do conversion work
4. **No surprises:** `===` always does what you expect

**Business value:**
- Fewer bugs in production (saves $$ on emergency fixes)
- Easier to train new developers (simpler rules)
- Code runs slightly faster (especially at scale)
- Less time spent debugging weird edge cases

**Example:** In our e-commerce site, using `==` caused a bug where products with stock value `""` (empty string) showed as out of stock. This cost us $15k/week in lost sales. Switching to `===` forced us to fix the data quality issue properly."

---

**Memory Device: "Triple = Triple Check"**

```javascript
// === checks THREE things:
// 1. Same TYPE?
// 2. Same VALUE?
// 3. No conversion!

// == checks TWO things:
// 1. Can I convert these?
// 2. Are they equal after conversion?

// Remember: More checks = safer = use ===
```

---

**Quick Self-Test:**

```javascript
// What do these output? (Try to guess before looking at answers)

console.log(5 === 5);           // ?
console.log(5 === "5");         // ?
console.log(0 === false);       // ?
console.log("" === false);      // ?
console.log(null === undefined); // ?

// Answers:
console.log(5 === 5);           // true ✅
console.log(5 === "5");         // false (different types)
console.log(0 === false);       // false (number vs boolean)
console.log("" === false);      // false (string vs boolean)
console.log(null === undefined); // false (different types)

// Now with ==:
console.log(5 == "5");          // true (string converted to number)
console.log(0 == false);        // true (both converted to 0)
console.log("" == false);       // true (both converted to 0)
console.log(null == undefined); // true (special rule)
```

---

**Golden Rules for Beginners:**

1. **Always use `===` by default** - 99% of the time, this is correct
2. **Only use `==` for `null` check** - `if (value == null)` is acceptable
3. **Convert types explicitly** - `Number()`, `String()`, `Boolean()`
4. **Never use `==` with booleans** - `if (x == true)` is a code smell
5. **Objects never `==` other objects** - Unless same reference

**When in doubt, use `===`!**

</details>
