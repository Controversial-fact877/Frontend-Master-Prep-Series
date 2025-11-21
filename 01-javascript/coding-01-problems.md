# Coding Problems & Solutions

> **Focus**: JavaScript coding challenges with multiple approaches and algorithmic analysis

---

## Question 1: How do you reverse a string in JavaScript?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Apple

### Question
Explain multiple approaches to reverse a string in JavaScript. Compare their performance and use cases.

### Answer

**String reversal** is a fundamental operation with multiple implementation approaches, each with different trade-offs in readability, performance, and browser compatibility.

1. **Built-in Methods Approach**
   - Split to array, reverse, join
   - Most readable and maintainable
   - Handles Unicode correctly with spread
   - Best for most use cases

2. **Loop Approaches**
   - For loop (backward iteration)
   - For loop (forward with concatenation)
   - While loop
   - Better performance for large strings

3. **Recursive Approach**
   - Elegant but less practical
   - Stack overflow risk for long strings
   - Good for interviews/algorithms

4. **Functional Approach**
   - Using reduce
   - Declarative style
   - Slower but expressive

5. **Unicode Considerations**
   - Emoji and surrogate pairs
   - Combining characters
   - Right-to-left languages

### Code Example

```javascript
// 1. BUILT-IN METHODS (MOST COMMON)

// Basic approach
function reverse1(str) {
  return str.split('').reverse().join('');
}

console.log(reverse1('hello')); // 'olleh'
console.log(reverse1('JavaScript')); // 'tpircSavaJ'

// With spread operator (handles Unicode better)
function reverse2(str) {
  return [...str].reverse().join('');
}

console.log(reverse2('hello')); // 'olleh'
console.log(reverse2('😀🎉')); // '🎉😀' (preserves emoji)

// 2. FOR LOOP - BACKWARD ITERATION

function reverse3(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

console.log(reverse3('hello')); // 'olleh'

// Performance optimization: Array + join
function reverse4(str) {
  const arr = [];
  for (let i = str.length - 1; i >= 0; i--) {
    arr.push(str[i]);
  }
  return arr.join('');
}

console.log(reverse4('hello')); // 'olleh'

// 3. FOR LOOP - FORWARD WITH CONCATENATION

function reverse5(str) {
  let reversed = '';
  for (let i = 0; i < str.length; i++) {
    reversed = str[i] + reversed; // Prepend character
  }
  return reversed;
}

console.log(reverse5('hello')); // 'olleh'

// 4. WHILE LOOP

function reverse6(str) {
  let reversed = '';
  let i = str.length - 1;
  while (i >= 0) {
    reversed += str[i];
    i--;
  }
  return reversed;
}

console.log(reverse6('hello')); // 'olleh'

// 5. RECURSIVE APPROACH

function reverse7(str) {
  // Base case
  if (str === '') return '';

  // Recursive case: last char + reverse of rest
  return str[str.length - 1] + reverse7(str.slice(0, -1));
}

console.log(reverse7('hello')); // 'olleh'

// Alternative recursive (more elegant)
function reverse8(str) {
  return str ? reverse8(str.substring(1)) + str[0] : '';
}

console.log(reverse8('hello')); // 'olleh'

// 6. REDUCE METHOD

function reverse9(str) {
  return [...str].reduce((reversed, char) => char + reversed, '');
}

console.log(reverse9('hello')); // 'olleh'

// Alternative reduce
function reverse10(str) {
  return str.split('').reduce((acc, char) => char + acc, '');
}

console.log(reverse10('hello')); // 'olleh'

// 7. FOR...OF LOOP

function reverse11(str) {
  let reversed = '';
  for (const char of str) {
    reversed = char + reversed;
  }
  return reversed;
}

console.log(reverse11('hello')); // 'olleh'

// 8. UNICODE-AWARE REVERSAL

// ❌ WRONG: Breaks emoji with surrogate pairs
function wrongReverse(str) {
  return str.split('').reverse().join('');
}

console.log(wrongReverse('😀🎉')); // Broken emoji!

// ✅ CORRECT: Use spread or Array.from
function correctReverse(str) {
  return [...str].reverse().join('');
}

console.log(correctReverse('😀🎉')); // '🎉😀' (works!)

// Alternative: Array.from
function correctReverse2(str) {
  return Array.from(str).reverse().join('');
}

console.log(correctReverse2('😀🎉')); // '🎉😀'

// 9. HANDLING COMBINING CHARACTERS

const strWithCombining = 'café'; // 'e' + combining acute accent
console.log(strWithCombining.length); // 5 (not 4!)

// For complex Unicode, use Intl.Segmenter (modern browsers)
function reverseGraphemes(str) {
  if (!Intl.Segmenter) {
    // Fallback for older browsers
    return [...str].reverse().join('');
  }

  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const segments = Array.from(segmenter.segment(str), s => s.segment);
  return segments.reverse().join('');
}

console.log(reverseGraphemes('café')); // Correct reversal

// 10. PERFORMANCE COMPARISON

function benchmark(fn, input, iterations = 100000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn(input);
  }
  const end = performance.now();
  return (end - start).toFixed(2) + 'ms';
}

const testStr = 'The quick brown fox jumps over the lazy dog';

console.log('Built-in:', benchmark(reverse1, testStr)); // ~20ms
console.log('Spread:', benchmark(reverse2, testStr));    // ~22ms
console.log('For loop:', benchmark(reverse3, testStr));  // ~15ms
console.log('Array+join:', benchmark(reverse4, testStr)); // ~12ms (fastest!)
console.log('Reduce:', benchmark(reverse9, testStr));    // ~35ms (slowest)

// 11. IN-PLACE STRING REVERSAL (NOT POSSIBLE IN JS)

// JavaScript strings are immutable!
// ❌ Can't do this:
// str[0] = 'x'; // TypeError in strict mode

// For in-place, convert to array:
function reverseInPlace(str) {
  const arr = str.split('');
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]]; // Swap
    left++;
    right--;
  }

  return arr.join('');
}

console.log(reverseInPlace('hello')); // 'olleh'
```

### Common Mistakes

- ❌ **Mistake:** Not handling Unicode characters
  ```javascript
  '😀🎉'.split('').reverse().join(''); // Breaks emoji!
  ```

- ❌ **Mistake:** Using recursion for very long strings
  ```javascript
  reverse7('x'.repeat(10000)); // Stack overflow!
  ```

- ✅ **Correct:** Use spread operator and iterative approach
  ```javascript
  [...str].reverse().join(''); // Handles Unicode
  // Use loops for long strings (no stack overflow)
  ```

<details>
<summary><strong>🔍 Deep Dive: String Reversal Implementation Details</strong></summary>

**How JavaScript Stores Strings:**

```javascript
// JavaScript uses UTF-16 encoding internally

// ASCII character (1 code unit)
const ascii = 'A';
console.log(ascii.length); // 1
console.log(ascii.charCodeAt(0)); // 65

// Emoji (2 code units - surrogate pair)
const emoji = '😀';
console.log(emoji.length); // 2 (not 1!)
console.log(emoji.charCodeAt(0)); // 55357 (high surrogate)
console.log(emoji.charCodeAt(1)); // 56832 (low surrogate)

// Why split('') breaks emoji:
'😀'.split(''); // ['\uD83D', '\uDE00'] (splits surrogate pair!)
```

**V8 String Representation:**

```javascript
// V8 has multiple internal string representations:

// 1. SeqOneByteString: Latin-1 characters (fast)
const latin1 = 'hello'; // 1 byte per char

// 2. SeqTwoByteString: Unicode characters (slower)
const unicode = 'こんにちは'; // 2 bytes per char

// 3. ConsString: Concatenation tree (lazy)
let str = 'a';
for (let i = 0; i < 100; i++) {
  str += 'b'; // V8 creates ConsString, not immediate copy
}

// 4. SlicedString: Substring view (lazy)
const original = 'hello world';
const sliced = original.slice(0, 5); // Doesn't copy immediately

// Reversal forces materialization of ConsStrings!
```

**Performance Analysis:**

```javascript
// Benchmark: Different string sizes
function benchmarkAll(size) {
  const str = 'x'.repeat(size);
  const iterations = 1000;

  console.log(`\nString size: ${size}`);

  // Method 1: split-reverse-join
  console.time('split-reverse-join');
  for (let i = 0; i < iterations; i++) {
    str.split('').reverse().join('');
  }
  console.timeEnd('split-reverse-join');

  // Method 2: for loop with array
  console.time('for-loop-array');
  for (let i = 0; i < iterations; i++) {
    const arr = [];
    for (let j = str.length - 1; j >= 0; j--) {
      arr.push(str[j]);
    }
    arr.join('');
  }
  console.timeEnd('for-loop-array');

  // Method 3: for loop with string concat
  console.time('for-loop-string');
  for (let i = 0; i < iterations; i++) {
    let reversed = '';
    for (let j = str.length - 1; j >= 0; j--) {
      reversed += str[j];
    }
  }
  console.timeEnd('for-loop-string');
}

benchmarkAll(10);    // Small string
benchmarkAll(100);   // Medium string
benchmarkAll(1000);  // Large string
benchmarkAll(10000); // Very large string

// Results (approximate):
// Size 10:    split fastest (~8ms)
// Size 100:   split fastest (~15ms)
// Size 1000:  array loop fastest (~45ms)
// Size 10000: array loop fastest (~380ms)

// Why: String concatenation (+=) gets slower with size due to:
// - String immutability (creates new string each time)
// - O(n²) complexity for n concatenations
// - Array + join is O(n) because final allocation happens once
```

**Memory Usage:**

```javascript
// Memory analysis for 1000-char string

// Method 1: split-reverse-join
function memory1(str) {
  const arr = str.split('');        // Allocates array (1000 elements)
  const reversed = arr.reverse();   // In-place (no allocation)
  return reversed.join('');         // Allocates string (1000 chars)
}
// Total: ~2KB (array) + ~2KB (string) = ~4KB

// Method 2: for loop with +=
function memory2(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i]; // Allocates new string each time!
  }
  return reversed;
}
// Total: ~1MB+ (1000 intermediate strings!)
// 1 + 2 + 3 + ... + 1000 = ~500,000 characters allocated

// Method 3: array + join (best)
function memory3(str) {
  const arr = [];
  for (let i = str.length - 1; i >= 0; i--) {
    arr.push(str[i]);
  }
  return arr.join('');
}
// Total: ~2KB (array) + ~2KB (string) = ~4KB

// Winner: Array methods (minimal allocation)
```

**Unicode Complexity:**

```javascript
// Different Unicode scenarios

// 1. BMP (Basic Multilingual Plane) - 1 code unit
const bmp = 'A'; // U+0041
console.log([...bmp]); // ['A']

// 2. Astral plane - 2 code units (surrogate pair)
const astral = '𝕳'; // U+1D573 (mathematical bold H)
console.log(astral.length); // 2
console.log([...astral]); // ['𝕳'] (spread handles it!)

// 3. Combining characters
const combining = 'é'; // 'e' + combining acute
console.log(combining.length); // 2
console.log([...combining]); // ['e', '́'] (splits combining!)

// 4. Emoji with modifiers
const emojiWithModifier = '👋🏽'; // Wave + skin tone modifier
console.log(emojiWithModifier.length); // 4
console.log([...emojiWithModifier]); // ['👋', '🏽'] (splits!)

// 5. Emoji ZWJ sequences (Zero Width Joiner)
const family = '👨‍👩‍👧‍👦'; // Family emoji
console.log(family.length); // 11 (!)
console.log([...family]); // Splits into individual parts

// Proper Unicode reversal requires grapheme cluster awareness
// Use Intl.Segmenter for production code
```

**Algorithm Complexity:**

```javascript
// Time complexity analysis

// 1. split-reverse-join
function method1(str) {
  return str.split('').reverse().join('');
}
// Time: O(n) - split O(n), reverse O(n), join O(n)
// Space: O(n) - array allocation

// 2. for loop with string concat
function method2(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}
// Time: O(n²) - string concat is O(n) per iteration
// Space: O(n²) - intermediate strings

// 3. for loop with array
function method3(str) {
  const arr = [];
  for (let i = str.length - 1; i >= 0; i--) {
    arr.push(str[i]);
  }
  return arr.join('');
}
// Time: O(n) - push O(1) amortized, join O(n)
// Space: O(n) - array allocation

// 4. Recursive
function method4(str) {
  if (str === '') return '';
  return str[str.length - 1] + method4(str.slice(0, -1));
}
// Time: O(n²) - slice creates new string O(n) per call
// Space: O(n) - call stack depth
// Risk: Stack overflow for large n (typically n > 10,000)

// Best: method3 (for loop with array) - O(n) time, O(n) space
```

**V8 Optimization:**

```javascript
// V8's TurboFan JIT optimizations

// Cold function (first few calls)
function reverseOld(str) {
  return str.split('').reverse().join('');
}
// Interpreted mode: ~2x slower

// After ~10,000 calls, TurboFan optimizes:
// 1. Inlines split, reverse, join methods
// 2. Specializes for string type
// 3. Eliminates intermediate allocations where possible
// 4. Uses SIMD for array reversal

// Hot function performance approaches native code speed

// However, polymorphism kills optimization:
function reversePoly(str) {
  return str.split('').reverse().join('');
}

reversePoly('hello');  // String
reversePoly(123);      // Number (deoptimizes!)
// V8 can't optimize polymorphic functions as well
```

**Practical Production Code:**

```javascript
// ✅ Production-ready string reversal utility

/**
 * Reverses a string, handling Unicode correctly
 * @param {string} str - String to reverse
 * @returns {string} Reversed string
 */
function reverseString(str) {
  // Input validation
  if (typeof str !== 'string') {
    throw new TypeError('Expected string input');
  }

  // Empty or single char optimization
  if (str.length <= 1) return str;

  // Use Intl.Segmenter for proper grapheme handling (if available)
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(str), s => s.segment);
    return segments.reverse().join('');
  }

  // Fallback: spread operator (handles most Unicode)
  return [...str].reverse().join('');
}

// Performance optimized version for ASCII strings
function reverseStringASCII(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected string input');
  }

  if (str.length <= 1) return str;

  // For known ASCII, use faster array method
  const arr = [];
  for (let i = str.length - 1; i >= 0; i--) {
    arr.push(str[i]);
  }
  return arr.join('');
}

// Usage:
console.log(reverseString('hello'));        // 'olleh'
console.log(reverseString('😀🎉'));          // '🎉😀'
console.log(reverseString('👋🏽'));          // Correct emoji reversal
console.log(reverseStringASCII('hello'));   // 'olleh' (faster for ASCII)
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Emoji Display Bug in Chat App</strong></summary>

**Scenario:** Your chat application shows broken emojis when users reverse messages for fun. The "reverse message" feature corrupts emoji rendering, causing customer complaints and poor user experience.

**The Problem:**

```javascript
// ❌ BROKEN: Chat app's reverse message feature
class ChatMessage {
  constructor(text) {
    this.text = text;
  }

  reverse() {
    // Simple reverse using split
    return this.text.split('').reverse().join('');
  }
}

// User sends message with emoji
const msg = new ChatMessage('Hello 😀🎉 World!');
console.log(msg.reverse());
// Output: "!dlroW �� olleH" (broken emoji!)

// Production impact:
// - 450 bug reports/week about "broken emoji"
// - Users think app is low quality
// - Social media complaints about "buggy chat"
// - 12% of users stop using reverse feature
// - Emoji usage down 8% (users avoiding emoji in reversible messages)
```

**Debugging Process:**

```javascript
// Step 1: Reproduce the issue
const testCases = [
  'Hello 😀',           // Single emoji
  '😀🎉',                // Multiple emoji
  '👋🏽',                 // Emoji with skin tone
  '👨‍👩‍👧‍👦',                // Emoji ZWJ sequence
  'café',               // Combining character
  'Hello World',        // ASCII only (control)
];

function debugReverse(str) {
  console.log('Original:', str);
  console.log('Length:', str.length);
  console.log('Split:', str.split(''));
  console.log('Reversed:', str.split('').reverse().join(''));
  console.log('---');
}

testCases.forEach(debugReverse);

// Output reveals:
// - '😀' has length 2 (surrogate pair!)
// - split('') breaks surrogate pairs
// - Reversed surrogate pairs = invalid Unicode
```

**Solution 1: Use Spread Operator:**

```javascript
// ✅ FIX: Use spread operator instead of split
class ChatMessage {
  constructor(text) {
    this.text = text;
  }

  reverse() {
    // Spread handles Unicode code points correctly
    return [...this.text].reverse().join('');
  }
}

const msg = new ChatMessage('Hello 😀🎉 World!');
console.log(msg.reverse());
// Output: "!dlroW 🎉😀 olleH" ✅ (emoji preserved!)

// Works for:
// - Basic emoji: ✅
// - Multiple emoji: ✅
// - Emoji sequences: ⚠️ (partially - see Solution 3)
```

**Solution 2: Array.from Method:**

```javascript
// ✅ ALTERNATIVE: Array.from with proper Unicode handling
class ChatMessage {
  constructor(text) {
    this.text = text;
  }

  reverse() {
    return Array.from(this.text).reverse().join('');
  }
}

const msg = new ChatMessage('Hello 😀🎉 World!');
console.log(msg.reverse());
// Output: "!dlroW 🎉😀 olleH" ✅

// Same as spread operator for most cases
```

**Solution 3: Intl.Segmenter (Best for Complex Unicode):**

```javascript
// ✅ PRODUCTION-GRADE: Handle all Unicode scenarios
class ChatMessage {
  constructor(text) {
    this.text = text;
  }

  reverse() {
    // Check for Intl.Segmenter support (modern browsers)
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      // Use grapheme segmentation
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      const segments = Array.from(
        segmenter.segment(this.text),
        segment => segment.segment
      );
      return segments.reverse().join('');
    }

    // Fallback for older browsers
    return [...this.text].reverse().join('');
  }
}

// Test with complex emoji
const msg1 = new ChatMessage('Hello 😀🎉');
console.log(msg1.reverse()); // "🎉😀 olleH" ✅

const msg2 = new ChatMessage('Family 👨‍👩‍👧‍👦!');
console.log(msg2.reverse()); // "!👨‍👩‍👧‍👦 ylimaF" ✅ (ZWJ sequence preserved!)

const msg3 = new ChatMessage('Wave 👋🏽');
console.log(msg3.reverse()); // "👋🏽 evaW" ✅ (skin tone preserved!)

// Handles:
// - Basic emoji: ✅
// - Emoji with modifiers: ✅
// - ZWJ sequences: ✅
// - Combining characters: ✅
```

**Performance Comparison:**

```javascript
// Benchmark different approaches
function benchmark() {
  const testMessage = 'Hello 😀🎉 World! 👋🏽 How are you? 👨‍👩‍👧‍👦';
  const iterations = 10000;

  // Method 1: split (broken but fast)
  console.time('split (broken)');
  for (let i = 0; i < iterations; i++) {
    testMessage.split('').reverse().join('');
  }
  console.timeEnd('split (broken)'); // ~85ms

  // Method 2: spread
  console.time('spread');
  for (let i = 0; i < iterations; i++) {
    [...testMessage].reverse().join('');
  }
  console.timeEnd('spread'); // ~95ms (+12%)

  // Method 3: Array.from
  console.time('Array.from');
  for (let i = 0; i < iterations; i++) {
    Array.from(testMessage).reverse().join('');
  }
  console.timeEnd('Array.from'); // ~98ms (+15%)

  // Method 4: Intl.Segmenter
  console.time('Intl.Segmenter');
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  for (let i = 0; i < iterations; i++) {
    Array.from(segmenter.segment(testMessage), s => s.segment)
      .reverse()
      .join('');
  }
  console.timeEnd('Intl.Segmenter'); // ~320ms (+276%)

  // Trade-off: Correctness vs Performance
  // - split: Fastest but broken ❌
  // - spread: Good balance (12% slower, handles most emoji) ✅
  // - Intl.Segmenter: Slowest but most correct ✅
}

benchmark();
```

**Real Production Metrics:**

```javascript
// Before fix (split method):
// - Emoji rendering bugs: 450 reports/week
// - User complaints: "Broken emoji when reversed"
// - Feature usage: 5,000 reverses/day
// - Emoji usage in reversible messages: Low (users avoiding emoji)
// - App store rating mentions: "Emoji bug" in 8% of reviews
// - Customer support time: 15 hours/week

// After fix (spread operator):
// - Emoji rendering bugs: 5 reports/week (95% reduction) ✅
// - User complaints: Rare, mostly about complex emoji sequences
// - Feature usage: 8,500 reverses/day (+70%) ✅
// - Emoji usage in reversible messages: Normal ✅
// - App store rating: +0.3 stars
// - Customer support time: 1 hour/week (93% reduction)

// After upgrade to Intl.Segmenter:
// - Emoji rendering bugs: 0 reports/week ✅✅
// - Complex emoji sequences: Fully supported ✅
// - Performance: Acceptable (3x slower but still <50ms for typical message)
// - User satisfaction: 97% positive feedback
```

**Complete Production Implementation:**

```javascript
// ✅ FULL PRODUCTION SOLUTION

class ChatMessage {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      locale: 'en',
      useSegmenter: true,
      ...options
    };
  }

  reverse() {
    if (!this.text) return '';
    if (this.text.length === 1) return this.text;

    try {
      // Prefer Intl.Segmenter for accuracy
      if (
        this.options.useSegmenter &&
        typeof Intl !== 'undefined' &&
        Intl.Segmenter
      ) {
        const segmenter = new Intl.Segmenter(this.options.locale, {
          granularity: 'grapheme'
        });

        const segments = Array.from(
          segmenter.segment(this.text),
          s => s.segment
        );

        return segments.reverse().join('');
      }

      // Fallback: spread operator
      return [...this.text].reverse().join('');

    } catch (error) {
      // Error handling: log and return original
      console.error('Message reverse failed:', error);
      return this.text;
    }
  }

  // Feature flag for gradual rollout
  static isSegmenterSupported() {
    return typeof Intl !== 'undefined' && !!Intl.Segmenter;
  }
}

// Usage with telemetry
function reverseMessage(text) {
  const startTime = performance.now();
  const msg = new ChatMessage(text);
  const reversed = msg.reverse();
  const duration = performance.now() - startTime;

  // Track metrics
  analytics.track('message_reversed', {
    length: text.length,
    hasEmoji: /\p{Emoji}/u.test(text),
    duration,
    segmenterUsed: ChatMessage.isSegmenterSupported()
  });

  return reversed;
}

// Client code
console.log(reverseMessage('Hello 😀🎉 World!'));
// Logs metrics + returns: "!dlroW 🎉😀 olleH"

// A/B test: measure impact
// Group A: spread operator
// Group B: Intl.Segmenter
// Metrics: bug reports, performance, satisfaction
```

**Browser Compatibility Check:**

```javascript
// Feature detection and polyfill strategy

function getReverseStrategy() {
  // Modern browsers: Intl.Segmenter
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return 'segmenter'; // Best: handles all Unicode
  }

  // ES6+ browsers: spread operator
  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    return 'spread'; // Good: handles most emoji
  }

  // Old browsers: Array.from
  if (Array.from) {
    return 'array-from'; // Okay: handles basic emoji
  }

  // Ancient browsers: fallback
  return 'split'; // Works but breaks emoji
}

function reverseWithStrategy(str) {
  const strategy = getReverseStrategy();

  switch (strategy) {
    case 'segmenter': {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(str), s => s.segment)
        .reverse()
        .join('');
    }

    case 'spread':
    case 'array-from':
      return [...str].reverse().join('');

    case 'split':
    default:
      // Warn user about potential emoji issues
      console.warn('Using legacy string reversal - emoji may not display correctly');
      return str.split('').reverse().join('');
  }
}

// Browser support:
// - Intl.Segmenter: Chrome 87+, Safari 14.1+, Firefox ❌ (polyfill needed)
// - Spread: All modern browsers
// - Array.from: IE 11+ (with polyfill)
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: String Reversal Approaches</strong></summary>

### Comparison Matrix

| Approach | Time | Space | Unicode | Readability | Use Case |
|----------|------|-------|---------|-------------|----------|
| **split-reverse-join** | O(n) | O(n) | ❌ Breaks emoji | ✅ Excellent | ASCII only |
| **Spread + reverse** | O(n) | O(n) | ✅ Most emoji | ✅ Excellent | Modern apps |
| **For loop + array** | O(n) | O(n) | ❌ Breaks emoji | ✅ Good | Performance critical |
| **For loop + string** | O(n²) | O(n²) | ❌ Breaks emoji | ⚠️ Okay | Never use |
| **Recursive** | O(n²) | O(n) | ❌ Breaks emoji | ⚠️ Elegant | Interviews only |
| **Reduce** | O(n) | O(n) | ✅ With spread | ⚠️ Functional | Functional style |
| **Intl.Segmenter** | O(n) | O(n) | ✅✅ All Unicode | ✅ Good | Production (modern) |

### Decision Guide

**For production applications:**
```javascript
// ✅ RECOMMENDED: Intl.Segmenter with fallback
function reverseProduction(str) {
  if (Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(str), s => s.segment)
      .reverse()
      .join('');
  }
  return [...str].reverse().join('');
}
// Why: Handles all Unicode correctly, graceful degradation
```

**For performance-critical code (ASCII strings):**
```javascript
// ✅ RECOMMENDED: For loop with array
function reverseFast(str) {
  const arr = [];
  for (let i = str.length - 1; i >= 0; i--) {
    arr.push(str[i]);
  }
  return arr.join('');
}
// Why: Fastest, minimal allocations, O(n) time
```

**For interviews/algorithms:**
```javascript
// ✅ RECOMMENDED: Show multiple approaches
// 1. Built-in (most practical)
const reverse1 = str => [...str].reverse().join('');

// 2. Two-pointer (shows algorithm knowledge)
function reverse2(str) {
  const arr = str.split('');
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr.join('');
}

// 3. Discuss trade-offs and Unicode issues
```

**For learning/teaching:**
```javascript
// ✅ RECOMMENDED: Start simple, build up
// 1. Show split-reverse-join (simplest)
str.split('').reverse().join('');

// 2. Explain why spread is better
[...str].reverse().join('');

// 3. Show manual loop (algorithm understanding)
let result = '';
for (let i = str.length - 1; i >= 0; i--) {
  result += str[i];
}

// 4. Discuss Unicode issues and Intl.Segmenter
```

### Performance vs Correctness Trade-off

```javascript
// Scenario: Chat app with 1M reversals/day

// Option 1: split-reverse-join (fast but broken)
// - Performance: 100ms for 1M operations
// - Unicode: ❌ Breaks emoji
// - User experience: Poor (broken emoji)
// - Maintenance cost: High (bug reports)
// ❌ NOT RECOMMENDED

// Option 2: Spread operator (balanced)
// - Performance: 112ms for 1M operations (+12%)
// - Unicode: ✅ Handles most emoji
// - User experience: Good
// - Maintenance cost: Low
// ✅ RECOMMENDED for most apps

// Option 3: Intl.Segmenter (best correctness)
// - Performance: 350ms for 1M operations (+250%)
// - Unicode: ✅✅ Handles all Unicode perfectly
// - User experience: Excellent
// - Maintenance cost: Very low
// ✅ RECOMMENDED for apps with heavy emoji/international use

// Decision matrix:
// - Simple app, ASCII only → split-reverse-join
// - Modern app, emoji support → spread operator
// - International app, complex Unicode → Intl.Segmenter
// - Performance critical, ASCII → for loop with array
```

### Memory Considerations

```javascript
// For very large strings (1MB+):

// ❌ BAD: String concatenation
function reverseBad(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i]; // O(n²) allocations!
  }
  return result;
}
// Memory: ~500MB for 1MB string (intermediate strings)

// ✅ GOOD: Array accumulation
function reverseGood(str) {
  const arr = [];
  for (let i = str.length - 1; i >= 0; i--) {
    arr.push(str[i]);
  }
  return arr.join('');
}
// Memory: ~2MB for 1MB string (one array, one result)

// For 10MB string:
// - Bad: ~50GB of allocations (will crash!)
// - Good: ~20MB of allocations (works fine)
```

### Browser Compatibility Trade-offs

```javascript
// ES5 (IE 11): Only split-reverse-join
str.split('').reverse().join('');
// + Works everywhere
// - Breaks emoji

// ES6 (2015+): Spread operator
[...str].reverse().join('');
// + Handles most Unicode
// + Clean syntax
// - Not in IE 11 without transpiling

// ES2021+: Intl.Segmenter
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
Array.from(segmenter.segment(str), s => s.segment).reverse().join('');
// + Handles all Unicode perfectly
// - Limited browser support (polyfill needed)
// - Performance cost

// Recommendation: Use spread with Intl.Segmenter fallback
```

</details>

<details>
<summary><strong>💬 Explain to Junior: String Reversal Simplified</strong></summary>

**Simple Analogy: Reversing a Line of People**

Imagine you have a line of people: Alice, Bob, Charlie, Diana

**Method 1: Everyone Swap Places (Built-in)**
```javascript
// Like saying "Everyone turn around and walk to the other end"
const line = "ABCD";
const reversed = line.split('').reverse().join('');
// "DCBA"

// What happens:
// 1. split('') → Separate everyone: ['A', 'B', 'C', 'D']
// 2. reverse() → Flip the order: ['D', 'C', 'B', 'A']
// 3. join('') → Stand back in line: "DCBA"
```

**Method 2: Build New Line from Back to Front (Loop)**
```javascript
// Like calling people from the end one by one
const line = "ABCD";
let newLine = '';

for (let i = line.length - 1; i >= 0; i--) {
  newLine += line[i];
}
// "DCBA"

// What happens:
// Call Diana → newLine = "D"
// Call Charlie → newLine = "DC"
// Call Bob → newLine = "DCB"
// Call Alice → newLine = "DCBA"
```

**Why Emoji Break:**

```javascript
// Emoji are like couples holding hands
const couple = '😀'; // Actually 2 code units holding hands!

// ❌ Wrong way (splits the couple)
couple.split(''); // ['\uD83D', '\uDE00'] - they're separated!
// Like separating a couple - they look broken: "??"

// ✅ Right way (keeps couple together)
[...couple]; // ['😀'] - they stay together!
// Like treating the couple as one unit
```

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Forgetting to join
const str = "hello";
const arr = str.split('').reverse();
console.log(arr); // ['o', 'l', 'l', 'e', 'h'] - still an array!

// ✅ Fix: Remember to join
const reversed = str.split('').reverse().join('');
console.log(reversed); // "olleh" ✅


// ❌ MISTAKE 2: Trying to modify string directly
const str = "hello";
str[0] = 'H'; // Doesn't work! Strings are immutable
console.log(str); // Still "hello"

// ✅ Fix: Create new string
const fixed = 'H' + str.slice(1);
console.log(fixed); // "Hello" ✅


// ❌ MISTAKE 3: Using recursion for long strings
function reverseRecursive(str) {
  if (str === '') return '';
  return str[str.length - 1] + reverseRecursive(str.slice(0, -1));
}

reverseRecursive('x'.repeat(10000)); // Stack overflow! 💥

// ✅ Fix: Use loop for long strings
function reverseLoop(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}
```

**Explaining to PM:**

"String reversal is like reversing a video:

**Without proper method:**
- Video plays backward but some frames are corrupted
- Audio is garbled
- Users complain about quality

**With proper method:**
- Everything plays smoothly in reverse
- All effects preserved (like emoji)
- Professional quality

**Business value:**
- User-facing features work correctly (no broken emoji)
- Fewer bug reports = less support cost
- Better app store ratings
- Users trust the app more

**Example:** WhatsApp's message search reverses text for RTL languages. If they used wrong method, Arabic/Hebrew would break. That would lose millions of users!"

**Practical Exercise:**

```javascript
// Challenge: Reverse these strings

// 1. Simple word
const word = "hello";
// Your answer: ?
// Correct: "olleh"

// 2. Sentence with spaces
const sentence = "hello world";
// Your answer: ?
// Correct: "dlrow olleh"

// 3. With emoji
const withEmoji = "Hi 😀";
// Your answer: ?
// Correct: "😀 iH" (using spread operator!)

// 4. Only reverse words, not entire string
const sentence2 = "hello world";
// Expected: "olleh dlrow"
// Solution:
sentence2.split(' ').map(word => [...word].reverse().join('')).join(' ');
```

**Key Rules for Juniors:**

1. **Always use spread `[...]` for Unicode safety**
   ```javascript
   [...str].reverse().join(''); // Safe ✅
   ```

2. **Never use string concatenation in loops for performance**
   ```javascript
   // ❌ Slow: result += char
   // ✅ Fast: arr.push(char), then arr.join('')
   ```

3. **Remember: Strings are immutable**
   ```javascript
   str[0] = 'x'; // Doesn't work!
   str = 'x' + str.slice(1); // Create new string ✅
   ```

4. **For production: Handle edge cases**
   ```javascript
   if (!str) return ''; // Empty string
   if (str.length === 1) return str; // Single char
   return [...str].reverse().join(''); // Normal case
   ```

5. **Test with emoji!**
   ```javascript
   reverseString('Hello 😀'); // Should return '😀 olleH'
   ```

</details>

### Follow-up Questions

- "How would you reverse only the words in a sentence, not the entire string?"
- "What is the time complexity of each reversal approach?"
- "Why does `split('')` break emoji but spread operator doesn't?"
- "How would you reverse a string in place (if strings were mutable)?"
- "What is the difference between code units and code points in JavaScript?"

### Resources

- [MDN: String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN: Array.reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
- [Unicode in JavaScript](https://mathiasbynens.be/notes/javascript-unicode)
- [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

---

## Question 2: How do you remove duplicates from an array?

**Difficulty:** 🟢 Easy
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon, Microsoft, Apple

### Question
Explain multiple approaches to remove duplicates from an array in JavaScript. Compare their performance and use cases.

### Answer

**Removing duplicates** is a common operation with several implementation approaches, each optimized for different scenarios and data types.

1. **Set Approach**
   - Convert to Set, back to array
   - Fastest for primitives
   - Doesn't work for object comparison
   - Most concise syntax

2. **Filter + IndexOf**
   - Keep first occurrence
   - Works with complex logic
   - Slower for large arrays
   - Compatible with older browsers

3. **Reduce Approach**
   - Custom accumulation logic
   - Flexible for complex rules
   - Clear intent
   - Moderate performance

4. **Object/Map Approach**
   - Fast lookup O(1)
   - Good for large datasets
   - Can track additional data
   - Works with objects as keys (Map)

5. **For Loop**
   - Maximum control
   - Best performance for specific cases
   - More verbose
   - Easy to optimize

### Code Example

```javascript
// 1. SET APPROACH (MOST COMMON)

// Basic Set approach
function removeDuplicates1(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates1([1, 2, 2, 3, 4, 4, 5]));
// [1, 2, 3, 4, 5]

// Alternative: Array.from
function removeDuplicates2(arr) {
  return Array.from(new Set(arr));
}

console.log(removeDuplicates2([1, 2, 2, 3, 4, 4, 5]));
// [1, 2, 3, 4, 5]

// Works with strings
console.log(removeDuplicates1(['a', 'b', 'b', 'c']));
// ['a', 'b', 'c']

// ⚠️ Doesn't work with objects (reference comparison)
console.log(removeDuplicates1([{id: 1}, {id: 1}]));
// [{id: 1}, {id: 1}] - Still has duplicates!

// 2. FILTER + INDEXOF

function removeDuplicates3(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

console.log(removeDuplicates3([1, 2, 2, 3, 4, 4, 5]));
// [1, 2, 3, 4, 5]

// How it works:
// - indexOf returns FIRST occurrence index
// - Keep item only if current index === first occurrence
// [1, 2, 2, 3] → keep 1 (index 0 === indexOf 0)
//              → keep 2 (index 1 === indexOf 1)
//              → skip 2 (index 2 !== indexOf 1)
//              → keep 3 (index 3 === indexOf 3)

// 3. FILTER + INCLUDES (Keep Last Occurrence)

function removeDuplicates4(arr) {
  return arr.filter((item, index) => !arr.slice(index + 1).includes(item));
}

console.log(removeDuplicates4([1, 2, 2, 3, 4, 4, 5]));
// [1, 2, 3, 4, 5]

// Keeps LAST occurrence instead of first
// Useful when newer items should override older

// 4. REDUCE APPROACH

function removeDuplicates5(arr) {
  return arr.reduce((unique, item) => {
    return unique.includes(item) ? unique : [...unique, item];
  }, []);
}

console.log(removeDuplicates5([1, 2, 2, 3, 4, 4, 5]));
// [1, 2, 3, 4, 5]

// More efficient reduce (avoid spread)
function removeDuplicates6(arr) {
  return arr.reduce((unique, item) => {
    if (!unique.includes(item)) {
      unique.push(item);
    }
    return unique;
  }, []);
}

// 5. FOR LOOP WITH INCLUDES

function removeDuplicates7(arr) {
  const unique = [];
  for (const item of arr) {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  }
  return unique;
}

console.log(removeDuplicates7([1, 2, 2, 3, 4, 4, 5]));
// [1, 2, 3, 4, 5]

// 6. OBJECT/MAP FOR TRACKING

// Using object for lookup
function removeDuplicates8(arr) {
  const seen = {};
  const result = [];

  for (const item of arr) {
    if (!seen[item]) {
      seen[item] = true;
      result.push(item);
    }
  }

  return result;
}

console.log(removeDuplicates8([1, 2, 2, 3, 4, 4, 5]));
// [1, 2, 3, 4, 5]

// Using Map (better for non-string keys)
function removeDuplicates9(arr) {
  const seen = new Map();
  const result = [];

  for (const item of arr) {
    if (!seen.has(item)) {
      seen.set(item, true);
      result.push(item);
    }
  }

  return result;
}

// 7. REMOVE DUPLICATES FROM ARRAY OF OBJECTS

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' }, // Duplicate
  { id: 3, name: 'Charlie' }
];

// By property (id)
function removeDuplicatesByKey(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

console.log(removeDuplicatesByKey(users, 'id'));
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]

// Using Map (preserves last occurrence)
function removeDuplicatesByKeyMap(arr, key) {
  const map = new Map();
  for (const item of arr) {
    map.set(item[key], item); // Overwrites with latest
  }
  return Array.from(map.values());
}

// By JSON serialization (deep equality)
function removeDuplicatesDeep(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const serialized = JSON.stringify(item);
    if (seen.has(serialized)) {
      return false;
    }
    seen.add(serialized);
    return true;
  });
}

console.log(removeDuplicatesDeep(users));
// Removes exact duplicates based on all properties

// 8. CASE-INSENSITIVE STRING DEDUPLICATION

const words = ['Apple', 'banana', 'APPLE', 'Banana', 'cherry'];

function removeDuplicatesCaseInsensitive(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const lower = item.toLowerCase();
    if (seen.has(lower)) {
      return false;
    }
    seen.add(lower);
    return true;
  });
}

console.log(removeDuplicatesCaseInsensitive(words));
// ['Apple', 'banana', 'cherry']

// 9. DEDUPLICATE WITH CUSTOM COMPARATOR

function removeDuplicatesCustom(arr, compareFn) {
  return arr.filter((item, index, self) => {
    return index === self.findIndex(t => compareFn(t, item));
  });
}

// Example: Deduplicate points by distance from origin
const points = [
  { x: 1, y: 1 },
  { x: 2, y: 0 },
  { x: 0, y: 2 },
  { x: 1, y: 1 }
];

const uniquePoints = removeDuplicatesCustom(
  points,
  (a, b) => a.x === b.x && a.y === b.y
);

console.log(uniquePoints);
// [{ x: 1, y: 1 }, { x: 2, y: 0 }, { x: 0, y: 2 }]

// 10. PERFORMANCE COMPARISON

function benchmark(fn, arr, iterations = 1000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn(arr);
  }
  const end = performance.now();
  return (end - start).toFixed(2) + 'ms';
}

const testArray = Array.from({ length: 1000 }, (_, i) => i % 100);
// Array with 1000 items, 100 unique values

console.log('Set:', benchmark(removeDuplicates1, testArray));          // ~8ms (fastest!)
console.log('Filter+indexOf:', benchmark(removeDuplicates3, testArray)); // ~45ms
console.log('Reduce:', benchmark(removeDuplicates5, testArray));        // ~50ms
console.log('For+includes:', benchmark(removeDuplicates7, testArray));  // ~48ms
console.log('Map:', benchmark(removeDuplicates9, testArray));           // ~10ms (fast!)

// Winner: Set approach (8ms)
// Runner-up: Map approach (10ms)
// Avoid: filter+indexOf for large arrays

// 11. IN-PLACE DEDUPLICATION (MODIFY ORIGINAL)

function removeDuplicatesInPlace(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--; // Adjust index after removal
      }
    }
  }
  return arr;
}

const numbers = [1, 2, 2, 3, 4, 4, 5];
removeDuplicatesInPlace(numbers);
console.log(numbers); // [1, 2, 3, 4, 5] (original modified)

// ⚠️ O(n²) time, avoid for large arrays

// 12. OPTIMIZED IN-PLACE WITH SET

function removeDuplicatesInPlace2(arr) {
  const seen = new Set();
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < arr.length; readIndex++) {
    if (!seen.has(arr[readIndex])) {
      seen.add(arr[readIndex]);
      arr[writeIndex] = arr[readIndex];
      writeIndex++;
    }
  }

  arr.length = writeIndex; // Truncate array
  return arr;
}

const numbers2 = [1, 2, 2, 3, 4, 4, 5];
removeDuplicatesInPlace2(numbers2);
console.log(numbers2); // [1, 2, 3, 4, 5]

// O(n) time, O(n) space for Set

// 13. PRESERVE ORDER VS SORT

// Preserve original order (Set approach)
console.log([...new Set([3, 1, 2, 1, 3, 2])]);
// [3, 1, 2] (order preserved)

// Sort for deduplication (different result)
function removeDuplicatesSorted(arr) {
  return [...new Set(arr)].sort((a, b) => a - b);
}

console.log(removeDuplicatesSorted([3, 1, 2, 1, 3, 2]));
// [1, 2, 3] (sorted)

// 14. DEDUPLICATE NESTED ARRAYS

const matrix = [
  [1, 2],
  [3, 4],
  [1, 2],
  [5, 6]
];

// Using JSON serialization
function removeDuplicatesNested(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const key = JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

console.log(removeDuplicatesNested(matrix));
// [[1, 2], [3, 4], [5, 6]]
```

### Common Mistakes

- ❌ **Mistake:** Using Set for object arrays without considering reference equality
  ```javascript
  [...new Set([{id: 1}, {id: 1}])]; // Still has 2 objects!
  ```

- ❌ **Mistake:** Using filter+indexOf for large arrays (O(n²))
  ```javascript
  arr.filter((item, i) => arr.indexOf(item) === i); // Slow!
  ```

- ✅ **Correct:** Use Set for primitives, Map/object for complex deduplication
  ```javascript
  // Primitives: Set
  [...new Set([1, 2, 2, 3])]; // ✅

  // Objects: Map with key
  const map = new Map();
  arr.forEach(item => map.set(item.id, item));
  Array.from(map.values()); // ✅
  ```

<details>
<summary><strong>🔍 Deep Dive: Deduplication Algorithms</strong></summary>

**Set Internal Implementation:**

```javascript
// V8's Set uses a hash table internally

// When you create a Set:
const set = new Set([1, 2, 2, 3]);

// V8 internal structure (simplified):
// {
//   hashtable: {
//     hash(1): { value: 1, next: null },
//     hash(2): { value: 2, next: null },
//     hash(3): { value: 3, next: null }
//   },
//   size: 3
// }

// Add operation: O(1) average
set.add(4); // Computes hash(4), adds to bucket

// Has operation: O(1) average
set.has(2); // Computes hash(2), looks up bucket

// Why Set is fast:
// - Hash table lookup: O(1) average
// - No array scanning needed
// - Collision handling with chaining

// For primitives, Set uses SameValueZero equality:
set.add(NaN);
set.add(NaN); // Doesn't add duplicate
console.log(set.has(NaN)); // true

// NaN === NaN → false (normally)
// But Set treats NaN as equal to NaN
```

**Performance Analysis:**

```javascript
// Time complexity comparison

// 1. Set approach: O(n)
function setApproach(arr) {
  return [...new Set(arr)];
}
// - Iterate array: O(n)
// - Add to Set: O(1) per item → O(n) total
// - Convert to array: O(n)
// Total: O(n)

// 2. filter + indexOf: O(n²)
function filterApproach(arr) {
  return arr.filter((item, i) => arr.indexOf(item) === i);
}
// - Filter iterates: O(n)
// - indexOf searches: O(n) per item
// Total: O(n) × O(n) = O(n²)

// 3. Map approach: O(n)
function mapApproach(arr) {
  const map = new Map();
  arr.forEach(item => map.set(item, true));
  return Array.from(map.keys());
}
// - Iterate array: O(n)
// - Map.set: O(1) per item → O(n) total
// - Array.from: O(n)
// Total: O(n)

// 4. Nested loops (in-place): O(n²)
function nestedLoops(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) arr.splice(j--, 1);
    }
  }
  return arr;
}
// - Outer loop: O(n)
// - Inner loop: O(n) per outer iteration
// - splice: O(n) in worst case
// Total: O(n³) worst case!

// Benchmark results for n=10,000:
// Set: ~2ms
// Map: ~3ms
// filter+indexOf: ~850ms (425x slower!)
// nested loops: ~2500ms (1250x slower!)
```

**Memory Usage:**

```javascript
// Memory footprint comparison

const arr = Array.from({ length: 10000 }, (_, i) => i % 100);
// 10,000 items, 100 unique

// Method 1: Set
function memorySet(arr) {
  const set = new Set(arr);      // ~400 bytes overhead + 100 items
  return [...set];                // ~400 bytes array
}
// Total: ~800 bytes + data

// Method 2: filter + indexOf
function memoryFilter(arr) {
  return arr.filter((item, i) => arr.indexOf(item) === i);
}
// No extra data structures
// But: Creates filtered array (~400 bytes)
// Total: ~400 bytes + data

// Method 3: Map
function memoryMap(arr) {
  const map = new Map();          // ~500 bytes overhead + 100 entries
  arr.forEach(item => map.set(item, true));
  return Array.from(map.keys());  // ~400 bytes array
}
// Total: ~900 bytes + data

// Method 4: Object tracker
function memoryObject(arr) {
  const seen = {};                // ~200 bytes overhead + 100 props
  const result = [];              // ~400 bytes
  for (const item of arr) {
    if (!seen[item]) {
      seen[item] = true;
      result.push(item);
    }
  }
  return result;
}
// Total: ~600 bytes + data

// Winner for memory: filter+indexOf (but slowest!)
// Winner for balance: Set (fast + reasonable memory)
```

**Object Deduplication Strategies:**

```javascript
// Strategy 1: JSON serialization (slow but works)
function dedupeJSON(arr) {
  const seen = new Set();
  return arr.filter(obj => {
    const key = JSON.stringify(obj); // O(m) where m = object size
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
// Time: O(n × m) where m = avg object size
// Space: O(n × m)
// Issues:
// - Doesn't handle circular refs
// - Doesn't handle functions
// - Property order matters: {a:1,b:2} !== {b:2,a:1}

// Strategy 2: By key field (fast, common pattern)
function dedupeByKey(arr, key) {
  const map = new Map();
  for (const obj of arr) {
    map.set(obj[key], obj); // Last occurrence wins
  }
  return Array.from(map.values());
}
// Time: O(n)
// Space: O(unique items)
// Best for: Arrays of objects with unique ID

// Strategy 3: Custom hash function
function dedupeCustomHash(arr, hashFn) {
  const map = new Map();
  for (const obj of arr) {
    const hash = hashFn(obj);
    if (!map.has(hash)) {
      map.set(hash, obj);
    }
  }
  return Array.from(map.values());
}

// Example: Hash by specific fields
const users = [
  { id: 1, name: 'Alice', email: 'alice@ex.com' },
  { id: 2, name: 'Bob', email: 'bob@ex.com' },
  { id: 1, name: 'Alice Updated', email: 'alice@ex.com' }
];

dedupeCustomHash(users, u => `${u.id}-${u.email}`);
// Only keeps unique id+email combinations

// Strategy 4: Deep equality (slowest but most accurate)
function deepEquals(obj1, obj2) {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === 'object' && typeof val2 === 'object') {
      if (!deepEquals(val1, val2)) return false;
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
}

function dedupeDeep(arr) {
  return arr.filter((item, index, self) => {
    return index === self.findIndex(t => deepEquals(t, item));
  });
}
// Time: O(n² × m) where m = object depth
// Very slow but handles all edge cases
```

**Hash Collision Analysis:**

```javascript
// Understanding hash collisions in Set/Map

// Simple hash function (V8 uses better algorithms)
function simpleHash(value) {
  if (typeof value === 'number') {
    return value % 1000; // Simple modulo
  }
  if (typeof value === 'string') {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  }
  return 0;
}

// Example collisions:
console.log(simpleHash(1));    // 1
console.log(simpleHash(1001)); // 1 (collision!)
console.log(simpleHash(2001)); // 1 (collision!)

// V8's Set handles collisions with chaining:
// Bucket 1: 1 → 1001 → 2001 (linked list)

// Lookup time:
// - No collision: O(1)
// - With collision: O(k) where k = items in bucket
// - Average case: O(1) with good hash function
// - Worst case: O(n) with bad hash function (all items in one bucket)

// V8 uses MurmurHash3 or SipHash for better distribution
```

**Cache Locality and Performance:**

```javascript
// Modern CPU cache impact on deduplication

// Scenario: Deduplicate sorted vs unsorted array

const sorted = Array.from({ length: 100000 }, (_, i) => i % 1000).sort();
const unsorted = Array.from({ length: 100000 }, (_, i) => Math.floor(Math.random() * 1000));

// Set approach (hash table)
console.time('Set-sorted');
[...new Set(sorted)];
console.timeEnd('Set-sorted'); // ~4ms

console.time('Set-unsorted');
[...new Set(unsorted)];
console.timeEnd('Set-unsorted'); // ~8ms (2x slower!)

// Why: Sorted array has better cache locality
// - CPU prefetcher can predict access patterns
// - Cache hits are more frequent
// - Branch predictor works better

// For sorted arrays, can use optimized algorithm:
function dedupeSorted(arr) {
  if (arr.length === 0) return [];

  const result = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      result.push(arr[i]);
    }
  }
  return result;
}

console.time('dedupeSorted');
dedupeSorted(sorted);
console.timeEnd('dedupeSorted'); // ~1ms (4x faster than Set!)

// But: Only works for sorted arrays
// And: Sorting takes O(n log n), so not always worth it
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Shopping Cart Duplicate Bug</strong></summary>

**Scenario:** Your e-commerce site allows duplicate products in the cart due to race conditions when users click "Add to Cart" rapidly. This causes incorrect totals and inventory issues.

**The Problem:**

```javascript
// ❌ BROKEN: Shopping cart without deduplication
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    // Race condition: User clicks button rapidly
    this.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// User clicks "Add to Cart" 5 times rapidly (double-clicks + lag)
const cart = new ShoppingCart();
const product = { id: 1, name: 'Widget', price: 99.99 };

for (let i = 0; i < 5; i++) {
  cart.addItem(product);
}

console.log(cart.items.length); // 5 (5 duplicate entries!)
console.log(cart.getTotal());   // $499.95 (user expects $99.99!)

// Production impact:
// - Users charged incorrectly: 230 complaints/week
// - Refund requests: $12,000/week
// - Inventory oversold: 45 items/week
// - Support tickets: 180/week
// - Cart abandonment: +15% (users see wrong total)
```

**Debugging:**

```javascript
// Step 1: Log cart state
function debugCart(cart) {
  console.log('Cart items:', cart.items);
  console.log('Unique products:', new Set(cart.items.map(i => i.id)).size);
  console.log('Total items:', cart.items.length);

  // Find duplicates
  const duplicates = cart.items.filter((item, index, self) => {
    return self.findIndex(t => t.id === item.id) !== index;
  });
  console.log('Duplicates:', duplicates);
}

// Output shows multiple items with same ID
// Cause: Rapid button clicks + async API calls

// Step 2: Reproduce
async function testRapidClicks() {
  const cart = new ShoppingCart();
  const product = { id: 1, name: 'Widget', price: 99.99 };

  // Simulate 5 rapid clicks
  await Promise.all([
    cart.addItem(product),
    cart.addItem(product),
    cart.addItem(product),
    cart.addItem(product),
    cart.addItem(product)
  ]);

  console.log('Items after rapid clicks:', cart.items.length);
  // Shows 5 duplicate entries
}
```

**Solution 1: Merge Duplicates by ID:**

```javascript
// ✅ FIX: Merge duplicate products, sum quantities
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity = 1) {
    // Check if product already exists
    const existingIndex = this.items.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
      // Product exists: increase quantity
      this.items[existingIndex].quantity += quantity;
    } else {
      // New product: add to cart
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity
      });
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

// Test: User clicks rapidly
const cart = new ShoppingCart();
const product = { id: 1, name: 'Widget', price: 99.99 };

for (let i = 0; i < 5; i++) {
  cart.addItem(product);
}

console.log(cart.items.length);  // 1 (single entry) ✅
console.log(cart.items[0].quantity); // 5 (correct quantity) ✅
console.log(cart.getTotal());    // $499.95 (correct!) ✅
```

**Solution 2: Use Map for O(1) Lookup:**

```javascript
// ✅ BETTER: Use Map for faster duplicate detection
class ShoppingCart {
  constructor() {
    this.itemsMap = new Map(); // id → item
  }

  addItem(product, quantity = 1) {
    const existingItem = this.itemsMap.get(product.id);

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      this.itemsMap.set(product.id, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity
      });
    }
  }

  getItems() {
    return Array.from(this.itemsMap.values());
  }

  getTotal() {
    let total = 0;
    for (const item of this.itemsMap.values()) {
      total += item.price * item.quantity;
    }
    return total;
  }

  removeItem(productId) {
    this.itemsMap.delete(productId);
  }

  updateQuantity(productId, quantity) {
    const item = this.itemsMap.get(productId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.itemsMap.delete(productId);
      }
    }
  }
}

// Performance: O(1) for add/remove/update
// vs O(n) with array.find()
```

**Solution 3: Debounce Button Clicks:**

```javascript
// ✅ ALSO FIX FRONTEND: Prevent rapid clicks

// Utility: debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// React component example
function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const cart = useCart();

  // Debounced add to cart
  const addToCart = debounce(async () => {
    setIsAdding(true);
    try {
      await cart.addItem(product);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setIsAdding(false);
    }
  }, 300);

  return (
    <button
      onClick={addToCart}
      disabled={isAdding}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}

// Alternative: Disable button while adding
function ProductCardDisabled({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const cart = useCart();

  const handleAddToCart = async () => {
    if (isAdding) return; // Guard clause

    setIsAdding(true);
    try {
      await cart.addItem(product);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={isAdding}>
      {isAdding ? <Spinner /> : 'Add to Cart'}
    </button>
  );
}
```

**Production Implementation:**

```javascript
// ✅ FULL PRODUCTION SOLUTION

class ShoppingCart {
  constructor() {
    this.itemsMap = new Map();
    this.listeners = [];
  }

  addItem(product, quantity = 1) {
    // Validation
    if (!product || !product.id) {
      throw new Error('Invalid product');
    }
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const existingItem = this.itemsMap.get(product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.itemsMap.set(product.id, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        addedAt: Date.now()
      });
    }

    this.notifyListeners();
    this.saveToStorage();

    // Analytics
    trackEvent('cart_item_added', {
      productId: product.id,
      quantity,
      totalItems: this.getItemCount()
    });
  }

  removeItem(productId) {
    const removed = this.itemsMap.delete(productId);
    if (removed) {
      this.notifyListeners();
      this.saveToStorage();
    }
    return removed;
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    const item = this.itemsMap.get(productId);
    if (item) {
      item.quantity = quantity;
      this.notifyListeners();
      this.saveToStorage();
    }
  }

  getItems() {
    return Array.from(this.itemsMap.values());
  }

  getTotal() {
    let total = 0;
    for (const item of this.itemsMap.values()) {
      total += item.price * item.quantity;
    }
    return Number(total.toFixed(2)); // Avoid floating point errors
  }

  getItemCount() {
    let count = 0;
    for (const item of this.itemsMap.values()) {
      count += item.quantity;
    }
    return count;
  }

  clear() {
    this.itemsMap.clear();
    this.notifyListeners();
    this.saveToStorage();
  }

  // Persistence
  saveToStorage() {
    try {
      const data = JSON.stringify(Array.from(this.itemsMap.entries()));
      localStorage.setItem('cart', data);
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('cart');
      if (data) {
        const entries = JSON.parse(data);
        this.itemsMap = new Map(entries);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }

  // Observers pattern
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getItems()));
  }
}

// Usage in React
function useCart() {
  const [items, setItems] = useState([]);
  const cartRef = useRef(new ShoppingCart());

  useEffect(() => {
    const cart = cartRef.current;
    cart.loadFromStorage();

    const unsubscribe = cart.subscribe(setItems);
    return unsubscribe;
  }, []);

  return {
    items,
    addItem: (product, quantity) => cartRef.current.addItem(product, quantity),
    removeItem: (id) => cartRef.current.removeItem(id),
    updateQuantity: (id, qty) => cartRef.current.updateQuantity(id, qty),
    total: cartRef.current.getTotal(),
    itemCount: cartRef.current.getItemCount(),
    clear: () => cartRef.current.clear()
  };
}
```

**Real Metrics After Fix:**

```javascript
// Before (no deduplication):
// - Duplicate item complaints: 230/week
// - Refund requests: $12,000/week
// - Inventory oversold: 45 items/week
// - Support tickets: 180/week
// - Cart abandonment: 28%

// After (Map-based deduplication):
// - Duplicate item complaints: 0/week ✅
// - Refund requests: $200/week (95% reduction) ✅
// - Inventory oversold: 0 items/week ✅
// - Support tickets: 15/week (92% reduction) ✅
// - Cart abandonment: 13% (54% improvement) ✅
// - User satisfaction: +87%
// - Revenue increase: $8,000/week (fewer abandoned carts)

// Technical improvements:
// - Add to cart: O(1) instead of O(n)
// - 3x faster cart operations
// - LocalStorage persistence
// - Real-time UI updates
// - Analytics integration
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Deduplication Approaches</strong></summary>

### Comparison Matrix

| Approach | Time | Space | Primitives | Objects | Order | Use Case |
|----------|------|-------|------------|---------|-------|----------|
| **Set** | O(n) | O(n) | ✅ Perfect | ❌ By ref | ✅ Preserved | Best general |
| **filter+indexOf** | O(n²) | O(1) | ✅ Works | ❌ By ref | ✅ Preserved | Small arrays |
| **reduce** | O(n²) | O(n) | ✅ Works | ❌ By ref | ✅ Preserved | Functional style |
| **Map** | O(n) | O(n) | ✅ Perfect | ✅ By key | ✅ Preserved | Object arrays |
| **Object tracker** | O(n) | O(n) | ✅ Works | ✅ By key | ✅ Preserved | String/number keys |
| **JSON.stringify** | O(n×m) | O(n×m) | ✅ Works | ✅ Deep | ✅ Preserved | Deep equality |
| **For loop** | Varies | Varies | ✅ Custom | ✅ Custom | ✅ Flexible | Custom logic |

### Decision Guide

**For primitive arrays (numbers, strings):**
```javascript
// ✅ RECOMMENDED: Set (fastest, cleanest)
const unique = [...new Set(array)];

// When: Known primitives, order matters, performance critical
```

**For object arrays with unique key:**
```javascript
// ✅ RECOMMENDED: Map by key
const map = new Map();
array.forEach(item => map.set(item.id, item));
const unique = Array.from(map.values());

// When: Objects have unique identifier (id, email, etc.)
```

**For object arrays with deep equality:**
```javascript
// ✅ RECOMMENDED: JSON.stringify (be aware of limitations)
const seen = new Set();
const unique = array.filter(item => {
  const key = JSON.stringify(item);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

// When: Need deep equality, objects are JSON-safe
// Limitations: No functions, circular refs, property order matters
```

**For custom comparison logic:**
```javascript
// ✅ RECOMMENDED: Custom filter with findIndex
const unique = array.filter((item, index, self) => {
  return index === self.findIndex(t => customEquals(t, item));
});

// When: Complex comparison rules, non-standard equality
```

**For large datasets:**
```javascript
// ✅ RECOMMENDED: Map/Set for O(1) lookups
const seen = new Map();
const unique = [];
for (const item of array) {
  const key = getUniqueKey(item);
  if (!seen.has(key)) {
    seen.set(key, true);
    unique.push(item);
  }
}

// When: 10,000+ items, performance critical
```

### Performance vs Correctness Trade-off

```javascript
// Scenario: E-commerce product catalog (100,000 products)

// Option 1: Set (fast but wrong for objects)
const unique1 = [...new Set(products)];
// - Performance: 5ms
// - Correctness: ❌ Keeps duplicate objects (reference comparison)
// - Use case: ❌ Not suitable for object arrays

// Option 2: Map by ID (fast and correct)
const map = new Map();
products.forEach(p => map.set(p.id, p));
const unique2 = Array.from(map.values());
// - Performance: 8ms
// - Correctness: ✅ Dedupes by ID correctly
// - Use case: ✅ RECOMMENDED for most cases

// Option 3: JSON.stringify (slow but thorough)
const seen = new Set();
const unique3 = products.filter(p => {
  const key = JSON.stringify(p);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
// - Performance: 450ms
// - Correctness: ✅ Deep equality (JSON-safe objects only)
// - Use case: ⚠️ Only when deep equality truly needed

// Option 4: filter+indexOf (terrible for large arrays)
const unique4 = products.filter((p, i) =>
  products.findIndex(t => t.id === p.id) === i
);
// - Performance: 18,000ms (18 seconds!)
// - Correctness: ✅ Works
// - Use case: ❌ Never use for large arrays

// Winner: Map by ID (8ms, correct)
```

### Memory Trade-offs

```javascript
// For 1,000,000 item array with 100,000 unique values

// Approach 1: Set (most memory)
const unique = [...new Set(array)];
// - Set: ~1.6MB (hash table + values)
// - Array: ~800KB (unique items)
// - Total: ~2.4MB

// Approach 2: filter+indexOf (least memory)
const unique = array.filter((item, i) => array.indexOf(item) === i);
// - Temporary array: ~800KB
// - Total: ~800KB
// - But: 1000x slower!

// Approach 3: Map (similar to Set)
const map = new Map();
array.forEach(item => map.set(item, true));
const unique = Array.from(map.keys());
// - Map: ~1.8MB
// - Array: ~800KB
// - Total: ~2.6MB

// Trade-off: Memory vs Speed
// - Set/Map: 3x more memory, but 1000x faster
// - For large datasets: Speed wins (memory is cheap)
// - For embedded/mobile: Consider filter (if array is small)
```

### First vs Last Occurrence

```javascript
// Keep FIRST occurrence (most common)
const uniqueFirst = array.filter((item, i) => array.indexOf(item) === i);
// [1, 2, 2, 3] → [1, 2, 3] (keeps first 2)

// Keep LAST occurrence (useful for updates)
const uniqueLast = array.filter((item, i) => array.lastIndexOf(item) === i);
// [1, 2, 2, 3] → [1, 2, 3] (keeps last 2)

// When to keep last:
// - Merging update streams (newer data wins)
// - Processing event logs (final state matters)
// - Deduplicating with timestamps (latest entry wins)

// Example: User preferences updates
const preferences = [
  { userId: 1, theme: 'light', updatedAt: 100 },
  { userId: 2, theme: 'dark', updatedAt: 200 },
  { userId: 1, theme: 'dark', updatedAt: 300 } // Updated preference
];

// Keep last by userId
const map = new Map();
preferences.forEach(pref => map.set(pref.userId, pref));
const latest = Array.from(map.values());
// [{ userId: 2, ... }, { userId: 1, theme: 'dark', updatedAt: 300 }]
// Correctly keeps latest preference for user 1
```

</details>

<details>
<summary><strong>💬 Explain to Junior: Removing Duplicates Simplified</strong></summary>

**Simple Analogy: Guest List for Party**

Imagine you're inviting people to a party, but you have a messy list with duplicate names:

```javascript
const guestList = ['Alice', 'Bob', 'Alice', 'Charlie', 'Bob', 'Diana'];

// Method 1: Use a Set (like a bouncer checking names)
const uniqueGuests = [...new Set(guestList)];
console.log(uniqueGuests);
// ['Alice', 'Bob', 'Charlie', 'Diana']

// The Set is like a bouncer with a clipboard:
// "Alice" - adds to list
// "Bob" - adds to list
// "Alice" - "Already here, skip!"
// "Charlie" - adds to list
// "Bob" - "Already here, skip!"
// "Diana" - adds to list
```

**Why Set is Like Magic:**

```javascript
// Without Set (tedious manual checking)
const uniqueManual = [];
for (const guest of guestList) {
  // Check if already in list
  if (!uniqueManual.includes(guest)) {
    uniqueManual.push(guest);
  }
}

// With Set (automatic!)
const uniqueSet = [...new Set(guestList)];

// Both give same result, but Set is:
// - Faster (no manual checking)
// - Cleaner (one line!)
// - Smarter (uses hash table internally)
```

**The Object Problem:**

```javascript
// ❌ Set doesn't work for objects!
const guests = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Alice', age: 25 } // Duplicate!
];

const uniqueAttempt = [...new Set(guests)];
console.log(uniqueAttempt.length); // Still 3! ❌

// Why? Set compares by reference (memory address), not content
// Like saying "Is this the EXACT SAME piece of paper?"
// Even if two papers have same text, they're different papers!

// ✅ Solution: Use Map with a key
const map = new Map();
guests.forEach(guest => map.set(guest.name, guest));
const uniqueGuests = Array.from(map.values());
// Now correctly has 2 unique guests ✅
```

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Not converting Set back to array
const set = new Set([1, 2, 2, 3]);
console.log(set); // Set {1, 2, 3} - not an array!

// ✅ Fix: Convert to array
const array = [...set]; // or Array.from(set)
console.log(array); // [1, 2, 3] ✅


// ❌ MISTAKE 2: Using slow method for large arrays
const bigArray = Array.from({ length: 10000 }, (_, i) => i % 100);

// Slow way (don't do this!)
const uniqueSlow = bigArray.filter((item, i) => bigArray.indexOf(item) === i);
// Takes forever! Checks every item against every other item

// Fast way
const uniqueFast = [...new Set(bigArray)];
// 100x faster!


// ❌ MISTAKE 3: Expecting Set to work with nested arrays/objects
const arrays = [[1, 2], [3, 4], [1, 2]];
const uniqueArrays = [...new Set(arrays)];
console.log(uniqueArrays.length); // Still 3! ❌

// Why? [1,2] and [1,2] are different arrays (different memory)

// ✅ Fix: Use JSON.stringify
const seen = new Set();
const unique = arrays.filter(arr => {
  const key = JSON.stringify(arr);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
console.log(unique); // [[1, 2], [3, 4]] ✅
```

**Practical Example:**

```javascript
// Shopping cart: User adds same product multiple times
const cartItems = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 },
  { id: 1, name: 'Laptop', price: 999 } // Duplicate!
];

// ❌ Wrong: Use Set
const wrongUnique = [...new Set(cartItems)];
console.log(wrongUnique.length); // Still 3! Doesn't work

// ✅ Right: Use Map with ID as key
const map = new Map();
cartItems.forEach(item => {
  const existing = map.get(item.id);
  if (existing) {
    // Increase quantity instead of adding duplicate
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    map.set(item.id, { ...item, quantity: 1 });
  }
});
const uniqueCart = Array.from(map.values());
console.log(uniqueCart);
// [
//   { id: 1, name: 'Laptop', price: 999, quantity: 2 },
//   { id: 2, name: 'Mouse', price: 29, quantity: 1 }
// ] ✅
```

**Explaining to PM:**

"Removing duplicates is like cleaning a mailing list:

**Without deduplication:**
- Send 1000 emails to 500 people (500 duplicates)
- Waste money on duplicate sends
- Annoy customers with double emails
- Poor user experience

**With deduplication:**
- Send 500 emails to 500 people
- Save 50% on email costs
- Better customer experience
- Professional appearance

**Business value:**
- Shopping cart: No duplicate items → correct totals → fewer refunds
- Email lists: No duplicates → lower costs → better delivery rates
- Search results: No duplicates → better UX → higher engagement
- Analytics: Accurate unique user counts → better insights

**Example:** Spotify's 'Recently Played' list. If they didn't deduplicate, you'd see the same song 50 times if you put it on repeat. Deduplication gives you a clean, diverse list!"

**Visual Flow:**

```javascript
// Before: Messy array
[1, 2, 2, 3, 4, 4, 5]

// Step 1: Create Set (removes duplicates automatically)
new Set([1, 2, 2, 3, 4, 4, 5]) → Set {1, 2, 3, 4, 5}

// Step 2: Convert back to array
[...Set] → [1, 2, 3, 4, 5]

// After: Clean array ✅
```

**Key Rules for Juniors:**

1. **For primitive arrays: Use Set**
   ```javascript
   [...new Set(array)]
   ```

2. **For object arrays: Use Map with unique key**
   ```javascript
   const map = new Map();
   array.forEach(obj => map.set(obj.id, obj));
   Array.from(map.values());
   ```

3. **Always convert Set back to array**
   ```javascript
   [...set] or Array.from(set)
   ```

4. **Test with duplicates!**
   ```javascript
   removeDuplicates([1, 1, 1, 2, 2, 3]); // Should return [1, 2, 3]
   ```

5. **Remember: Objects need special handling**
   ```javascript
   // Set compares by reference, not content
   ```

</details>

### Follow-up Questions

- "How do you remove duplicates from an array of objects?"
- "What is the time complexity of the Set approach vs filter+indexOf?"
- "How would you keep the last occurrence instead of the first?"
- "What are the limitations of using JSON.stringify for deep equality?"
- "How do you remove duplicates case-insensitively?"

### Resources

- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

---

## Question 3: How do you count character frequency in a string?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Create a function that counts the frequency of each character in a string. Explain multiple approaches including object mapping and Map usage.

### Answer

**Character frequency counting** is a common string manipulation problem with applications in data analysis, compression, and text processing.

1. **Approaches**
   - Object as hash map (classic approach)
   - Map data structure (modern approach)
   - Array for ASCII/Unicode range
   - Reduce method (functional approach)

2. **Considerations**
   - Case sensitivity
   - Space handling
   - Special characters
   - Unicode support
   - Performance for large strings

3. **Use Cases**
   - Anagram detection
   - Text analysis
   - Compression algorithms
   - Password strength checking
   - Spam detection

### Code Example

```javascript
// 1. OBJECT APPROACH (MOST COMMON)

function charFrequency1(str) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}

console.log(charFrequency1("hello"));
// { h: 1, e: 1, l: 2, o: 1 }

console.log(charFrequency1("mississippi"));
// { m: 1, i: 4, s: 4, p: 2 }

// 2. MAP APPROACH (MODERN)

function charFrequency2(str) {
  const freq = new Map();

  for (const char of str) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  return freq;
}

const result = charFrequency2("hello");
console.log(result);
// Map(4) { 'h' => 1, 'e' => 1, 'l' => 2, 'o' => 1 }

// Convert Map to object if needed
console.log(Object.fromEntries(result));
// { h: 1, e: 1, l: 2, o: 1 }

// 3. REDUCE APPROACH (FUNCTIONAL)

function charFrequency3(str) {
  return str.split('').reduce((freq, char) => {
    freq[char] = (freq[char] || 0) + 1;
    return freq;
  }, {});
}

console.log(charFrequency3("hello"));
// { h: 1, e: 1, l: 2, o: 1 }

// 4. CASE-INSENSITIVE VERSION

function charFrequencyCaseInsensitive(str) {
  const freq = {};

  for (const char of str.toLowerCase()) {
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}

console.log(charFrequencyCaseInsensitive("Hello World"));
// { h: 1, e: 1, l: 3, o: 2, ' ': 1, w: 1, r: 1, d: 1 }

// 5. IGNORE SPACES AND SPECIAL CHARACTERS

function charFrequencyAlphaOnly(str) {
  const freq = {};

  for (const char of str.toLowerCase()) {
    // Only count letters
    if (char >= 'a' && char <= 'z') {
      freq[char] = (freq[char] || 0) + 1;
    }
  }

  return freq;
}

console.log(charFrequencyAlphaOnly("Hello, World! 123"));
// { h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1 }

// 6. SORTED BY FREQUENCY

function charFrequencySorted(str) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Convert to array, sort by frequency (descending)
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [char, count]) => {
      obj[char] = count;
      return obj;
    }, {});
}

console.log(charFrequencySorted("mississippi"));
// { i: 4, s: 4, p: 2, m: 1 }

// 7. WITH ARRAY (FOR ASCII ONLY)

function charFrequencyArray(str) {
  const freq = new Array(256).fill(0); // ASCII range

  for (const char of str) {
    freq[char.charCodeAt(0)]++;
  }

  // Convert to object for readability
  const result = {};
  for (let i = 0; i < freq.length; i++) {
    if (freq[i] > 0) {
      result[String.fromCharCode(i)] = freq[i];
    }
  }

  return result;
}

console.log(charFrequencyArray("hello"));
// { h: 1, e: 1, l: 2, o: 1 }

// 8. FIND MOST FREQUENT CHARACTER

function mostFrequentChar(str) {
  const freq = {};
  let maxChar = '';
  let maxCount = 0;

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;

    if (freq[char] > maxCount) {
      maxCount = freq[char];
      maxChar = char;
    }
  }

  return { char: maxChar, count: maxCount };
}

console.log(mostFrequentChar("mississippi"));
// { char: 'i', count: 4 } or { char: 's', count: 4 }

// 9. PERFORMANCE COMPARISON

function benchmark(fn, str, iterations = 10000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn(str);
  }
  const end = performance.now();
  return (end - start).toFixed(2) + 'ms';
}

const testStr = "the quick brown fox jumps over the lazy dog".repeat(10);

console.log('Object:', benchmark(charFrequency1, testStr));      // ~45ms
console.log('Map:', benchmark(charFrequency2, testStr));         // ~48ms
console.log('Reduce:', benchmark(charFrequency3, testStr));      // ~65ms
console.log('Array:', benchmark(charFrequencyArray, testStr));   // ~35ms (fastest for ASCII!)

// 10. UNICODE-SAFE VERSION

function charFrequencyUnicode(str) {
  const freq = new Map();

  // Use spread to handle Unicode correctly
  for (const char of [...str]) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  return Object.fromEntries(freq);
}

console.log(charFrequencyUnicode("Hello 😀🎉"));
// { H: 1, e: 1, l: 2, o: 1, ' ': 1, '😀': 1, '🎉': 1 }

// 11. CHARACTER HISTOGRAM

function charHistogram(str) {
  const freq = charFrequency1(str);

  for (const [char, count] of Object.entries(freq)) {
    console.log(`${char}: ${'█'.repeat(count)} (${count})`);
  }
}

charHistogram("hello");
// h: █ (1)
// e: █ (1)
// l: ██ (2)
// o: █ (1)

// 12. ANAGRAM DETECTION USING FREQUENCY

function areAnagrams(str1, str2) {
  if (str1.length !== str2.length) return false;

  const freq1 = charFrequency1(str1.toLowerCase());
  const freq2 = charFrequency1(str2.toLowerCase());

  // Compare frequency maps
  for (const char in freq1) {
    if (freq1[char] !== freq2[char]) return false;
  }

  return true;
}

console.log(areAnagrams("listen", "silent")); // true
console.log(areAnagrams("hello", "world"));   // false

// 13. FIRST NON-REPEATING CHARACTER

function firstNonRepeating(str) {
  const freq = {};

  // Count frequencies
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Find first with count 1
  for (const char of str) {
    if (freq[char] === 1) return char;
  }

  return null;
}

console.log(firstNonRepeating("swiss")); // 'w'
console.log(firstNonRepeating("aabbcc")); // null

// 14. TOP K FREQUENT CHARACTERS

function topKFrequent(str, k) {
  const freq = charFrequency1(str);

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([char, count]) => ({ char, count }));
}

console.log(topKFrequent("mississippi", 2));
// [{ char: 'i', count: 4 }, { char: 's', count: 4 }]
```

**Time Complexity:**
- Object/Map approach: O(n) where n is string length
- Space: O(k) where k is number of unique characters

**Space Complexity:**
- Object/Map: O(k) for k unique characters
- Array approach: O(256) for ASCII or O(65536) for Unicode BMP

### Common Mistakes

- ❌ **Mistake:** Not handling empty strings
  ```javascript
  function charFreq(str) {
    const freq = {};
    for (const char of str) { // Works, but no validation
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  }
  charFreq(""); // {} (works, but should validate)
  ```

- ❌ **Mistake:** Using `str.split('')` for Unicode strings
  ```javascript
  "😀🎉".split(''); // Breaks emoji!
  // Use [...str] or for...of instead
  ```

- ✅ **Correct:** Validate input and handle Unicode
  ```javascript
  function charFreq(str) {
    if (!str || typeof str !== 'string') return {};

    const freq = {};
    for (const char of str) { // Handles Unicode correctly
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  }
  ```

<details>
<summary><strong>🔍 Deep Dive: Character Frequency Optimization</strong></summary>

**Hash Map Performance:**

```javascript
// Object vs Map performance for character counting

// Test with 1 million character string
const testStr = "abcdefghij".repeat(100000);

// Object approach
console.time('Object');
const freq1 = {};
for (const char of testStr) {
  freq1[char] = (freq1[char] || 0) + 1;
}
console.timeEnd('Object'); // ~15ms

// Map approach
console.time('Map');
const freq2 = new Map();
for (const char of testStr) {
  freq2.set(char, (freq2.get(char) || 0) + 1);
}
console.timeEnd('Map'); // ~18ms

// Array approach (fastest for ASCII)
console.time('Array');
const freq3 = new Array(256).fill(0);
for (const char of testStr) {
  freq3[char.charCodeAt(0)]++;
}
console.timeEnd('Array'); // ~8ms

// Winner: Array approach (2x faster for ASCII)
// But: Object is most flexible and readable
```

**Memory Layout:**

```javascript
// V8 internal representation

// Object property storage
const freq = { a: 5, b: 3, c: 10 };
// V8 uses:
// - Hidden class (shape) for property layout
// - Properties array for values
// - Fast property access for first ~10 properties
// - Slow dictionary mode for >100 properties

// Map storage
const freqMap = new Map([['a', 5], ['b', 3], ['c', 10]]);
// V8 uses:
// - Hash table with linked list for collisions
// - Separate storage for keys and values
// - Maintains insertion order

// Array storage (ASCII)
const freqArray = new Array(256);
// V8 uses:
// - Contiguous memory block
// - Direct index access (fastest)
// - Fixed size (wasteful for sparse data)
```

**Cache Locality Impact:**

```javascript
// Sequential access (better cache performance)
function sequentialCount(str) {
  const freq = new Map();

  // Process characters in order (cache-friendly)
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  return freq;
}

// Random access (worse cache performance)
function randomCount(str) {
  const freq = new Map();
  const indices = [...Array(str.length).keys()].sort(() => Math.random() - 0.5);

  // Process in random order (cache misses)
  for (const i of indices) {
    const char = str[i];
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  return freq;
}

// Sequential: Better CPU cache hits
// Random: More cache misses = slower
```

**Algorithmic Optimizations:**

```javascript
// Early termination for specific queries

// Find if any character repeats (don't need full count)
function hasRepeatingChar(str) {
  const seen = new Set();

  for (const char of str) {
    if (seen.has(char)) return true; // Early exit!
    seen.add(char);
  }

  return false;
}

// Time: O(n) worst case, O(k) average where k << n
// Space: O(min(n, unique_chars))

// Find first character with frequency > threshold
function findFrequentChar(str, threshold) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
    if (freq[char] > threshold) return char; // Early exit!
  }

  return null;
}

// Time: O(n) worst case, but often much less
```

**SIMD Optimization (Advanced):**

```javascript
// Modern CPUs can process multiple characters in parallel
// V8 may use SIMD for certain string operations

// Hypothetical SIMD-optimized counting (not directly accessible in JS)
// V8 internal optimization for character comparisons

function countSpecificChar(str, target) {
  let count = 0;

  // V8 can optimize this loop with SIMD
  for (let i = 0; i < str.length; i++) {
    if (str[i] === target) count++;
  }

  return count;

  // V8 TurboFan may:
  // 1. Process 16 characters at once (SSE)
  // 2. Use vector comparison instructions
  // 3. Reduce loop overhead
}

// Manual SIMD (if available via WebAssembly)
// Can achieve 4-8x speedup for large strings
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Password Strength Checker Bug</strong></summary>

**Scenario:** Your password strength checker fails to properly count character types, allowing weak passwords that don't meet security requirements.

**The Problem:**

```javascript
// ❌ BUGGY: Incorrect character type counting
function checkPasswordStrength(password) {
  const freq = {};
  let lowercase = 0;
  let uppercase = 0;
  let digits = 0;
  let special = 0;

  for (const char of password) {
    freq[char] = (freq[char] || 0) + 1;

    // BUG: Using string comparison instead of charCode
    if (char >= 'a' && char <= 'z') lowercase++;
    if (char >= 'A' && char <= 'Z') uppercase++;
    if (char >= '0' && char <= '9') digits++;
    // BUG: Missing special character counting!
  }

  // Requirements: At least 1 of each type
  const isStrong = lowercase > 0 && uppercase > 0 && digits > 0 && special > 0;

  return { isStrong, freq, lowercase, uppercase, digits, special };
}

// Test weak password
console.log(checkPasswordStrength("Password1"));
// {
//   isStrong: false,  // Should be false (no special chars)
//   special: 0        // Correct!
// }

// But this passes when it shouldn't:
console.log(checkPasswordStrength("password123"));
// {
//   isStrong: false,  // Correct
//   lowercase: 8,
//   uppercase: 0,     // Correct
//   digits: 3,
//   special: 0
// }

// Production impact:
// - Weak passwords accepted: 230/day
// - Account compromises: 15/month
// - Password reset requests: 450/week
// - Security team escalations: 8/week
```

**Solution:**

```javascript
// ✅ FIXED: Proper character type counting
function checkPasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  const freq = {};
  const types = {
    lowercase: 0,
    uppercase: 0,
    digits: 0,
    special: 0
  };

  for (const char of password) {
    freq[char] = (freq[char] || 0) + 1;

    const code = char.charCodeAt(0);

    if (code >= 97 && code <= 122) {       // a-z
      types.lowercase++;
    } else if (code >= 65 && code <= 90) { // A-Z
      types.uppercase++;
    } else if (code >= 48 && code <= 57) { // 0-9
      types.digits++;
    } else {
      types.special++;
    }
  }

  // Check requirements
  const isStrong =
    types.lowercase > 0 &&
    types.uppercase > 0 &&
    types.digits > 0 &&
    types.special > 0 &&
    password.length >= 8;

  // Calculate strength score
  const score =
    (types.lowercase > 0 ? 25 : 0) +
    (types.uppercase > 0 ? 25 : 0) +
    (types.digits > 0 ? 25 : 0) +
    (types.special > 0 ? 25 : 0);

  return {
    isStrong,
    score,
    types,
    frequency: freq,
    length: password.length
  };
}

// Test cases
console.log(checkPasswordStrength("password123"));
// { isStrong: false, score: 50, types: { lowercase: 8, uppercase: 0, digits: 3, special: 0 } }

console.log(checkPasswordStrength("Password123!"));
// { isStrong: true, score: 100, types: { lowercase: 7, uppercase: 1, digits: 3, special: 1 } }

console.log(checkPasswordStrength("P@ss1"));
// { isStrong: false, score: 100 } // All types but too short
```

**Production Metrics After Fix:**

```javascript
// Before fix:
// - Weak passwords accepted: 230/day
// - Account compromises: 15/month
// - Password reset requests: 450/week
// - User complaints: 35/week

// After fix:
// - Weak passwords accepted: 0/day ✅
// - Account compromises: 1/month (95% reduction) ✅
// - Password reset requests: 180/week (60% reduction) ✅
// - Security incidents: 0 critical
// - User satisfaction: +78%
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Character Counting Approaches</strong></summary>

### Comparison Matrix

| Approach | Time | Space | Unicode | Readability | Use Case |
|----------|------|-------|---------|-------------|----------|
| **Object** | O(n) | O(k) | ✅ Good | ✅ Excellent | General purpose |
| **Map** | O(n) | O(k) | ✅ Perfect | ✅ Good | Modern code |
| **Array (ASCII)** | O(n) | O(256) | ❌ ASCII only | ⚠️ Okay | Performance critical |
| **Reduce** | O(n) | O(k) | ✅ Good | ⚠️ Functional | Functional style |

### Decision Guide

**For general text processing:**
```javascript
// ✅ Use Object (simplest, most compatible)
const freq = {};
for (const char of str) {
  freq[char] = (freq[char] || 0) + 1;
}
```

**For modern applications:**
```javascript
// ✅ Use Map (better for non-string keys, maintains order)
const freq = new Map();
for (const char of str) {
  freq.set(char, (freq.get(char) || 0) + 1);
}
```

**For ASCII performance:**
```javascript
// ✅ Use Array (2x faster for ASCII-only text)
const freq = new Array(256).fill(0);
for (const char of str) {
  freq[char.charCodeAt(0)]++;
}
```

</details>

<details>
<summary><strong>💬 Explain to Junior: Character Frequency Simplified</strong></summary>

**Simple Analogy: Counting Candies**

Imagine you have a bag of mixed candies and want to count how many of each color:

```javascript
// Candies: "RRBGGRRRBY" (R=Red, B=Blue, G=Green, Y=Yellow)

function countCandies(bag) {
  const count = {};

  for (const candy of bag) {
    // If we haven't seen this candy, start at 0
    // Then add 1
    count[candy] = (count[candy] || 0) + 1;
  }

  return count;
}

console.log(countCandies("RRBGGRRRBY"));
// { R: 6, B: 2, G: 2, Y: 1 }
```

**How the Counting Works:**

```javascript
// Step by step:
const bag = "RRB";
const count = {};

// First R:
count['R'] = (count['R'] || 0) + 1;  // undefined || 0 = 0, then + 1 = 1
// count = { R: 1 }

// Second R:
count['R'] = (count['R'] || 0) + 1;  // 1 || 0 = 1, then + 1 = 2
// count = { R: 2 }

// First B:
count['B'] = (count['B'] || 0) + 1;  // undefined || 0 = 0, then + 1 = 1
// count = { R: 2, B: 1 }
```

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Forgetting to initialize
function wrong(str) {
  const freq = {};
  for (const char of str) {
    freq[char]++; // NaN! (undefined + 1 = NaN)
  }
  return freq;
}

// ✅ Correct:
function correct(str) {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1; // Initialize to 0 if undefined
  }
  return freq;
}


// ❌ MISTAKE 2: Using array methods unnecessarily
function slow(str) {
  return str.split('').reduce((freq, char) => {
    freq[char] = (freq[char] || 0) + 1;
    return freq;
  }, {});
}
// Slower due to split + reduce overhead

// ✅ Better:
function fast(str) {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}
```

**Key Rules:**
1. **Initialize to 0 if undefined:** `(freq[char] || 0)`
2. **Use for...of loop** for clean iteration
3. **Test with duplicates:** "aabbcc" should give { a: 2, b: 2, c: 2 }

</details>

### Follow-up Questions

- "How would you find the most frequent character?"
- "How can you use character frequency to detect anagrams?"
- "What's the time complexity of this operation?"
- "How would you handle case-insensitive counting?"

### Resources

- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

---

