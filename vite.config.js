const { defineConfig } = require('vite')

module.exports = defineConfig({
  root: 'app',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3900',
        changeOrigin: true,
        secure: false
      }
    },
    open: true
  }
})
