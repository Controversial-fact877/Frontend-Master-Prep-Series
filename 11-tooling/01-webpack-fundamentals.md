# Webpack Fundamentals

> Core concepts, loaders, plugins, code splitting, optimization, and production configuration.

---

## Question 1: Webpack Core Concepts

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Amazon

### Question
Explain Webpack's core concepts: entry, output, loaders, and plugins.

### Answer

**Core Concepts:**
1. **Entry** - Starting point for bundling
2. **Output** - Where to emit bundles
3. **Loaders** - Transform non-JS files
4. **Plugins** - Custom build steps

### Code Example

```javascript
// webpack.config.js
module.exports = {
  // Entry point
  entry: './src/index.js',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js'
  },

  // Loaders
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },

  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin()
  ]
};
```

### Resources
- [Webpack Docs](https://webpack.js.org/concepts/)

---

*[File continues with code splitting, optimization, etc.]*

