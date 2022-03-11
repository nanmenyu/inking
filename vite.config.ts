import { defineConfig } from 'vite'
// import { join, resolve } from 'path'
import vue from '@vitejs/plugin-vue'
// const root = join(__dirname, 'src/render')
// import path from 'path'

export default defineConfig({
  // root,
  base: './',
  plugins: [
    vue(),
  ],
  server: {
    port: 3000,
  },
  // 全局css 
  css: {
    preprocessorOptions: {
      scss: {
        // 全局的scss ，跨域放多个，例如：主题的变量，和一些混合等
        additionalData: `@import "./src/style/mixin/mixin.scss";`,
      }
    }
  },
  // build: {
  //   outDir: join(__dirname, 'dist_electron/bundled'),//指定输出路径(相对于项目根目录)
  //   assetsDir: 'assets', // 指定生成静态资源的存放路径（相对于build.outDir）
  //   emptyOutDir: true,
  //   minify: false,
  //   commonjsOptions: {},
  //   sourcemap: true,
  // }
})
