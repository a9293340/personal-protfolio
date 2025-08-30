import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 基礎配置
  root: '.',
  base: './',
  
  // 路徑別名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@config': resolve(__dirname, 'src/config'),
      '@core': resolve(__dirname, 'src/core'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@systems': resolve(__dirname, 'src/systems'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },

  // 開發服務器配置
  server: {
    port: 5173,
    host: true, // 允許外部訪問
    open: true, // 自動打開瀏覽器
  },

  // 預覽服務器配置
  preview: {
    port: 5173,
    host: true,
  },

  // 建構配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // 代碼分割策略
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // 代碼分塊 (後續會添加具體文件)
        manualChunks: {
          // 第三方庫分塊
          vendor: ['gsap'],
        },
        // 文件命名規則
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // 壓縮配置
    minify: 'esbuild',
    
    // 源碼映射
    sourcemap: false,
    
    // 清除輸出目錄
    emptyOutDir: true,
    
    // 警告閾值
    chunkSizeWarningLimit: 1000,
  },

  // 靜態資源處理
  assetsInclude: [
    '**/*.jpg',
    '**/*.jpeg', 
    '**/*.png',
    '**/*.gif',
    '**/*.svg',
    '**/*.mp3',
    '**/*.wav',
    '**/*.ogg',
  ],

  // CSS 配置
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // 全域 CSS 變數
      scss: {
        additionalData: `@import "@styles/variables.scss";`,
      },
    },
  },

  // 插件配置
  plugins: [],

  // 環境變數
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },

  // 優化配置
  optimizeDeps: {
    include: ['gsap'],
  },
});