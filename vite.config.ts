import { defineConfig } from 'vite'
import { join, resolve } from 'path'
import vue from '@vitejs/plugin-vue'
// const root = join(__dirname, 'src/render')

export default defineConfig({
  // root,
  base: './',
  plugins: [
    vue(),
  ],
  server: {
    port: 3000,
    proxy: {}
  },
  build: {
    outDir: join(__dirname, 'dist'),//指定输出路径(相对于项目根目录)
    assetsDir: 'assets', // 指定生成静态资源的存放路径（相对于build.outDir）
    emptyOutDir: true,
    minify: false,
    commonjsOptions: {},
    sourcemap: true,
  }
})
