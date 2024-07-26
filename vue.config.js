const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,  
  devServer: {
    proxy: {
      '/file': {
         target: 'https://firebasestorage.googleapis.com/URL',
         changeOrigin: true
       }
    }
  }    
})