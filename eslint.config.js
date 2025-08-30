import js from '@eslint/js';

export default [
  // 基礎 JS 規則
  js.configs.recommended,
  
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        // 瀏覽器全域變數
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        
        // 計時器函數
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        
        // 事件和動畫
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        
        // 其他常用瀏覽器 API
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        
        // 自訂全域變數
        __DEV__: 'readonly',
        __PROD__: 'readonly',
        
        // 第三方庫
        gsap: 'readonly',
      },
    },
    
    rules: {
      // 代碼品質
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'no-console': 'off', // 開發階段允許 console
      'no-debugger': 'warn',
      
      // ES6+ 特性
      'prefer-const': 'warn',
      
      // 安全性
      'no-eval': 'error',
    },
  },
  
  // 忽略文件
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'poc/',
      '**/*.min.js',
      'vite.config.js', // 配置文件可以有較寬鬆的規則
      '.eslintrc.js',
    ],
  },
];