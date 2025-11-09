# Vite and Modern Build Tools

> Vite architecture, HMR, plugin system, and comparison with Webpack.

---

## Question 1: Why Vite is Faster than Webpack

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Google, Meta

### Question
Explain why Vite is faster than traditional bundlers. How does it use ES modules?

### Answer

**Vite Advantages:**
1. Native ES modules in dev (no bundling)
2. esbuild for dependencies (10-100x faster)
3. On-demand compilation
4. Instant HMR

### Code Example

```javascript
// vite.config.js
export default {
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
};
```

**Webpack vs Vite:**
- **Webpack**: Bundles everything, slower startup
- **Vite**: Native ESM in dev, fast startup

### Resources
- [Vite Docs](https://vitejs.dev/)

---

*[File continues with Vite features, etc.]*

