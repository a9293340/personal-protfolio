          <div class="layout-column" data-column="3"></div>
        `;
      
      case 'grid':
        return '<div class="layout-grid"></div>';
      
      default:
        return '<div class="layout-column" data-column="1"></div>';
    }
  }

  async render() {
    if (!this.pageConfig) return;

    // 清空現有內容
    this.clearSections();

    // 按配置渲染各個區塊
    await this.renderSections();

    // 應用頁面動畫
    this.applyPageAnimations();

    // 觸發頁面渲染完成事件
    eventBus.emit(EVENTS.PAGE_RENDERED, this.pageName);
  }

  async renderSections() {
    const { sections } = this.pageConfig;

    // 按順序載入區塊
    for (const sectionConfig of sections) {
      await this.renderSection(sectionConfig);
    }
  }

  async renderSection(sectionConfig) {
    const { id, type, position, config } = sectionConfig;

    try {
      // 動態載入區塊組件
      const SectionComponent = await this.loadSectionComponent(type);
      
      // 找到目標容器
      const targetColumn = this.container.querySelector(
        `[data-column="${position.column || 1}"]`
      );
      
      if (!targetColumn) {
        console.warn(`Target column not found for section ${id}`);
        return;
      }

      // 創建區塊容器
      const sectionElement = document.createElement('div');
      sectionElement.className = `section section--${type}`;
      sectionElement.setAttribute('data-section-id', id);
      sectionElement.style.order = position.order;

      targetColumn.appendChild(sectionElement);

      // 實例化區塊組件
      const sectionInstance = new SectionComponent(sectionElement, config);
      this.sections.set(id, sectionInstance);

    } catch (error) {
      console.error(`Failed to render section ${id}:`, error);
      this.renderErrorSection(sectionConfig);
    }
  }

  async loadSectionComponent(type) {
    const componentMap = {
      'character-status': () => import('../components/gaming/CharacterPanel/CharacterPanel.js'),
      'timeline': () => import('../components/common/Timeline/Timeline.js'),
      'radar-chart': () => import('../components/common/RadarChart/RadarChart.js'),
      'skill-tree': () => import('../components/gaming/SkillTree/SkillTree.js'),
      'project-grid': () => import('../components/gaming/ProjectGrid/ProjectGrid.js'),
      'yugioh-deck': () => import('../components/gaming/YugiohDeck/YugiohDeck.js')
    };

    if (componentMap[type]) {
      const module = await componentMap[type]();
      return module.default;
    }

    throw new Error(`Unknown section type: ${type}`);
  }

  updatePageMeta() {
    const { meta } = this.pageConfig;
    
    // 更新頁面標題
    if (meta.title) {
      document.title = meta.title;
    }

    // 更新 meta 標籤
    this.updateMetaTag('description', meta.description);
    this.updateMetaTag('keywords', meta.keywords?.join(', '));
    this.updateMetaTag('og:title', meta.title);
    this.updateMetaTag('og:description', meta.description);
    this.updateMetaTag('og:image', meta.ogImage);
  }

  updateMetaTag(name, content) {
    if (!content) return;

    let meta = document.querySelector(`meta[name="${name}"]`) ||
               document.querySelector(`meta[property="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (name.startsWith('og:')) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }

  applyPageAnimations() {
    const { animations } = this.pageConfig;
    
    if (!animations) return;

    if (animations.pageTransition) {
      this.applyPageTransition(animations.pageTransition);
    }

    if (animations.stagger) {
      this.applyStaggerAnimation(animations.stagger);
    }
  }

  applyPageTransition(transitionConfig) {
    const { type, duration, delay } = transitionConfig;
    
    this.element.style.animationName = type;
    this.element.style.animationDuration = `${duration}ms`;
    this.element.style.animationDelay = `${delay || 0}ms`;
    this.element.style.animationFillMode = 'both';
  }

  applyStaggerAnimation(staggerConfig) {
    if (!staggerConfig.enabled) return;

    const sections = this.container.querySelectorAll('.section');
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * staggerConfig.delay}ms`;
    });
  }

  clearSections() {
    this.sections.forEach(section => {
      if (typeof section.destroy === 'function') {
        section.destroy();
      }
    });
    this.sections.clear();
  }

  getPageNameFromPath(path) {
    if (!path || path === '/') return 'landing';
    return path.replace('/', '');
  }

  destroy() {
    this.clearSections();
    super.destroy();
  }
}
```

### 4.2 具體頁面實現範例
```javascript
// pages/Skills/Skills.js
import { BasePage } from '../../core/pages/BasePage.js';
import { eventBus, EVENTS } from '../../core/events/EventBus.js';

export default class SkillsPage extends BasePage {
  constructor(container, options) {
    super(container, { ...options, pageName: 'skills' });
    this.skillTreeInstance = null;
  }

  bindEvents() {
    super.bindEvents();

    // 監聽技能點擊事件
    eventBus.on(EVENTS.SKILL_CLICKED, this.handleSkillClick.bind(this));
    
    // 監聽鍵盤導航
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
  }

  async renderSection(sectionConfig) {
    await super.renderSection(sectionConfig);
    
    // 如果是技能樹區塊，儲存實例引用
    if (sectionConfig.type === 'skill-tree') {
      this.skillTreeInstance = this.sections.get(sectionConfig.id);
    }
  }

  handleSkillClick(skillData) {
    // 顯示技能詳情模態框
    this.showSkillDetailModal(skillData);
    
    // 播放音效
    eventBus.emit(EVENTS.SOUND_PLAY, 'skill-click');
    
    // 觸發粒子效果
    eventBus.emit(EVENTS.PARTICLE_BURST, {
      x: event.clientX,
      y: event.clientY,
      color: 'gold'
    });
  }

  handleKeyboardNavigation(event) {
    if (!this.skillTreeInstance) return;

    const { key } = event;
    
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault();
        this.skillTreeInstance.navigateWithKeyboard(key);
        break;
      
      case 'Enter':
        event.preventDefault();
        this.skillTreeInstance.activateCurrentSkill();
        break;
      
      case 'Escape':
        this.closeSkillDetailModal();
        break;
    }
  }

  showSkillDetailModal(skillData) {
    // 實現技能詳情模態框
    const modal = document.createElement('div');
    modal.className = 'skill-detail-modal';
    modal.innerHTML = this.generateSkillDetailHTML(skillData);
    
    document.body.appendChild(modal);
    
    // 模態框動畫
    modal.animate([
      { opacity: 0, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });

    // 綁定關閉事件
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeSkillDetailModal();
      }
    });
  }

  generateSkillDetailHTML(skillData) {
    return `
      <div class="modal-content">
        <div class="skill-header">
          <h2>${skillData.name}</h2>
          <button class="close-btn" onclick="this.closest('.skill-detail-modal').remove()">×</button>
        </div>
        <div class="skill-body">
          <p class="skill-description">${skillData.description}</p>
          
          <div class="skill-details">
            <h3>相關技能</h3>
            <div class="skill-tags">
              ${skillData.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
            
            ${skillData.projects ? `
              <h3>相關專案</h3>
              <ul class="project-list">
                ${skillData.projects.map(project => `<li>${project}</li>`).join('')}
              </ul>
            ` : ''}
            
            ${skillData.certifications ? `
              <h3>認證</h3>
              <ul class="certification-list">
                ${skillData.certifications.map(cert => `<li>${cert}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  closeSkillDetailModal() {
    const modal = document.querySelector('.skill-detail-modal');
    if (modal) {
      modal.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.8)' }
      ], {
        duration: 200,
        easing: 'ease-in'
      }).onfinish = () => {
        modal.remove();
      };
    }
  }

  destroy() {
    // 清理事件監聽器
    eventBus.off(EVENTS.SKILL_CLICKED, this.handleSkillClick);
    document.removeEventListener('keydown', this.handleKeyboardNavigation);
    
    // 關閉模態框
    this.closeSkillDetailModal();
    
    super.destroy();
  }
}
```

---

## 5. 建構與部署系統

### 5.1 Vite 配置
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 基礎配置
  base: '/', // GitHub Pages 部署路徑
  
  // 開發伺服器配置
  server: {
    port: 3000,
    open: true,
    cors: true
  },

  // 建構配置
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    // 資源處理
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    
    // 程式碼分割
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // 分離第三方庫
        manualChunks: {
          vendor: ['gsap'],
          utils: ['lodash-es']
        },
        
        // 文件命名
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|webp)$/i.test(assetInfo.name)) {
            return `assets/images/[name].[hash].${ext}`;
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name].[hash].${ext}`;
          }
          
          if (/\.(mp3|wav|ogg)$/i.test(assetInfo.name)) {
            return `assets/sounds/[name].[hash].${ext}`;
          }
          
          return `assets/[name].[hash].${ext}`;
        }
      }
    },
    
    // 壓縮配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@config': resolve(__dirname, 'src/config'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@core': resolve(__dirname, 'src/core'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@styles/globals/variables.scss";
          @import "@styles/globals/mixins.scss";
        `
      }
    },
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  },

  // 插件配置
  plugins: [
    // PWA 支援
    {
      name: 'generate-sw',
      generateBundle() {
        // 生成 Service Worker
        this.emitFile({
          type: 'asset',
          fileName: 'sw.js',
          source: generateServiceWorker()
        });
      }
    },
    
    // 配置檔案複製
    {
      name: 'copy-configs',
      generateBundle() {
        // 複製配置文件到 dist 目錄
        const configs = glob.sync('src/config/**/*.js');
        configs.forEach(configPath => {
          const content = fs.readFileSync(configPath, 'utf-8');
          const fileName = path.relative('src/config', configPath);
          
          this.emitFile({
            type: 'asset',
            fileName: `config/${fileName}`,
            source: content
          });
        });
      }
    }
  ],

  // 優化配置
  optimizeDeps: {
    include: ['gsap', 'lodash-es'],
    exclude: ['@config/*'] // 配置文件不預打包
  }
});

// Service Worker 生成器
function generateServiceWorker() {
  return `
    const CACHE_NAME = 'portfolio-v1';
    const urlsToCache = [
      '/',
      '/assets/css/main.css',
      '/assets/js/main.js',
      '/assets/images/avatar.jpg'
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => cache.addAll(urlsToCache))
      );
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            return response || fetch(event.request);
          }
        )
      );
    });
  `;
}
```

### 5.2 GitHub Actions 部署配置
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint code
      run: npm run lint
      
    - name: Run tests
      run: npm run test
      
    - name: Build application
      run: npm run build
      env:
        NODE_ENV: production
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
        
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        cname: your-domain.com  # 可選：自定義域名
        
    - name: Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        configPath: './lighthouserc.json'
        uploadArtifacts: true
        temporaryPublicStorage: true
```

### 5.3 配置管理腳本
```javascript
// scripts/config-manager.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ConfigManager {
  constructor() {
    this.configDir = path.resolve(__dirname, '../src/config');
    this.outputDir = path.resolve(__dirname, '../dist/config');
  }

  // 驗證所有配置檔案
  async validateConfigs() {
    console.log('🔍 Validating configuration files...');
    
    const configFiles = this.getConfigFiles();
    const errors = [];

    for (const file of configFiles) {
      try {
        await this.validateConfigFile(file);
        console.log(`✅ ${file}`);
      } catch (error) {
        errors.push({ file, error: error.message });
        console.log(`❌ ${file}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      console.log(`\n💥 Found ${errors.length} configuration errors`);
      process.exit(1);
    }

    console.log('\n🎉 All configuration files are valid!');
  }

  async validateConfigFile(filePath) {
    const fullPath = path.join(this.configDir, filePath);
    
    // 檢查檔案是否存在
    if (!fs.existsSync(fullPath)) {
      throw new Error('File not found');
    }

    // 動態載入並驗證
    const config = await import(fullPath);
    
    if (filePath.includes('pages/')) {
      this.validatePageConfig(config.default);
    } else if (filePath.includes('data/')) {
      this.validateDataConfig(config.default);
    }
  }

  validatePageConfig(config) {
    const requiredFields = ['meta', 'layout', 'sections'];
    
    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // 驗證 meta 資訊
    if (!config.meta.title || !config.meta.description) {
      throw new Error('Meta title and description are required');
    }

    // 驗證區塊配置
    if (!Array.isArray(config.sections) || config.sections.length === 0) {
      throw new Error('At least one section is required');
    }

    config.sections.forEach((section, index) => {
      if (!section.id || !section.type) {
        throw new Error(`Section ${index} missing id or type`);
      }
    });
  }

  validateDataConfig(config) {
    // 根據不同類型進行驗證
    if (config.branches) {
      // 技能樹配置驗證
      this.validateSkillTreeConfig(config);
    } else if (config.projects) {
      // 專案配置驗證
      this.validateProjectsConfig(config);
    }
  }

  validateSkillTreeConfig(config) {
    if (!config.branches || Object.keys(config.branches).length === 0) {
      throw new Error('At least one skill branch is required');
    }

    Object.entries(config.branches).forEach(([branchId, branch]) => {
      if (!branch.name || !branch.nodes || !Array.isArray(branch.nodes)) {
        throw new Error(`Invalid branch configuration: ${branchId}`);
      }

      branch.nodes.forEach((node, index) => {
        if (!node.id || !node.name || !node.position) {
          throw new Error(`Invalid node in branch ${branchId}, index ${index}`);
        }
      });
    });
  }

  // 生成配置檔案類型定義
  generateTypes() {
    console.log('📝 Generating TypeScript definitions...');
    
    const typeDefinitions = this.generateTypeDefinitions();
    const outputFile = path.resolve(__dirname, '../src/types/config.d.ts');
    
    fs.writeFileSync(outputFile, typeDefinitions);
    console.log(`✅ Types generated: ${outputFile}`);
  }

  generateTypeDefinitions() {
    return `
// Auto-generated configuration types
// Do not edit manually

export interface PageConfig {
  meta: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
  };
  layout: {
    type: 'single-column' | 'two-column' | 'three-column' | 'grid';
    sidebar?: 'left' | 'right' | 'none';
    padding: 'none' | 'small' | 'standard' | 'large';
    maxWidth?: string;
  };
  sections: SectionConfig[];
  animations?: {
    pageTransition?: {
      type: string;
      duration: number;
      delay?: number;
    };
    stagger?: {
      enabled: boolean;
      delay: number;
    };
  };
}

export interface SectionConfig {
  id: string;
  type: string;
  position: {
    column?: number;
    order: number;
  };
  config: Record<string, any>;
}

// ... 更多類型定義
    `;
  }

  getConfigFiles() {
    const files = [];
    const walkDir = (dir, relativePath = '') => {
      const items = fs.readdirSync(path.join(this.configDir, relativePath));
      
      items.forEach(item => {
        const itemPath = path.join(relativePath, item);
        const fullPath = path.join(this.configDir, itemPath);
        
        if (fs.statSync(fullPath).isDirectory()) {
          walkDir(dir, itemPath);
        } else if (item.endsWith('.config.js')) {
          files.push(itemPath);
        }
      });
    };
    
    walkDir(this.configDir);
    return files;
  }
}

// CLI 介面
const manager = new ConfigManager();
const command = process.argv[2];

switch (command) {
  case 'validate':
    manager.validateConfigs();
    break;
  case 'types':
    manager.generateTypes();
    break;
  default:
    console.log('Available commands: validate, types');
}
```

---

## 6. 開發工具與最佳實踐

### 6.1 開發腳本
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.ts",
    "lint:fix": "eslint src --ext .js,.ts --fix",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "config:validate": "node scripts/config-manager.js validate",
    "config:types": "node scripts/config-manager.js types",
    "deploy": "npm run build && gh-pages -d dist",
    "analyze": "npm run build && npx vite-bundle-analyzer dist"
  }
}
```

### 6.2 代碼品質工具配置
```javascript
// .eslintrc.js
export default {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error'
  },
  globals: {
    'CONFIG_LOADER': 'readonly',
    'EVENT_BUS': 'readonly',
    'STATE_MANAGER': 'readonly'
  }
};
```

### 6.3 效能監控
```javascript
// core/monitoring/Performance.js
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0
    };
    
    this.init();
  }

  init() {
    // 監控頁面載入時間
    window.addEventListener('load', () => {
      this.measurePageLoadTime();
      this.measureCoreWebVitals();
    });
  }

  measurePageLoadTime() {
    const navigation = performance.getEntriesByType('navigation')[0];
    this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
  }

  measureCoreWebVitals() {
    // FCP - First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });
    });
    observer.observe({ entryTypes: ['paint'] });

    // LCP - Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.largestContentfulPaint = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID - First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }

  getMetrics() {
    return { ...this.metrics };
  }

  reportMetrics() {
    // 發送到分析服務
    if (window.gtag) {
      window.gtag('event', 'performance_metrics', {
        custom_map: this.metrics
      });
    }
    
    console.log('Performance Metrics:', this.metrics);
  }
}
```

---

## 7. 總結

### 7.1 架構優勢

#### Config-Driven 的優勢
✅ **內容管理簡化** - 修改內容只需編輯 JSON/JS 配置檔案  
✅ **類型安全** - TypeScript 介面確保配置正確性  
✅ **快速迭代** - 新增頁面或功能無需修改核心程式碼  
✅ **易於維護** - 配置與邏輯分離，降低維護成本  
✅ **版本控制友善** - 配置檔案變化清晰可追蹤  

#### 技術架構優勢
✅ **模組化設計** - 組件可重用，系統可擴展  
✅ **事件驅動** - 鬆耦合的組件通訊  
✅ **狀態管理** - 統一的應用狀態管理  
✅ **效能優化** - 懶載入、程式碼分割、快取策略  
✅ **開發體驗** - 熱重載、型別檢查、自動化測試  

### 7.2 使用建議

#### 日常內容更新流程
1. **修改配置檔案** - 編輯對應的 `.config.js` 檔案
2. **驗證配置** - 運行 `npm run config:validate`
3. **本地預覽** - `npm run dev` 檢查效果
4. **部署更新** - 推送到 GitHub，自動部署

#### 新增頁面流程
1. **創建頁面配置** - `src/config/pages/new-page.config.js`
2. **註冊路由** - 在 `setupRoutes()` 中添加路由
3. **創建頁面組件** - 繼承 `BasePage` 類別
4. **測試與部署** - 驗證功能後部署

### 7.3 擴展可能性

#### 未來功能擴展
🚀 **多語言支援** - 在配置中添加語言選項  
🚀 **主題切換** - 支援多種視覺主題  
🚀 **內容管理系統** - 可視化配置編輯器  
🚀 **A/B 測試** - 配置驅動的實驗功能  
🚀 **動態載入** - 運行時從 API 載入配置  

這個技術架構export interface SectionConfig {
  id: string;
  type: string;
  position: {
    column?: number;
    order: number;
  };
  config: Record<string, any>;
  visibility?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}

export interface SkillTreeConfig {
  settings: {
    centerPoint: { x: number; y: number };
    hexSize: number;
    spacing: number;
    maxZoom: number;
    minZoom: number;
    defaultZoom: number;
  };
  theme: SkillTreeTheme;
  branches: Record<string, SkillBranch>;
  learningPaths: LearningPath[];
}

export interface SkillNode {
  id: string;
  name: string;
  position: { q: number; r: number };
  type: 'normal' | 'notable' | 'keystone';
  status: 'locked' | 'available' | 'learning' | 'mastered';
  description: string;
  skills: string[];
  prerequisites: string[];
  unlocks: string[];
  learnedDate?: string;
  targetDate?: string;
  progress?: number;
  projects?: string[];
  certifications?: string[];
}

export interface ProjectConfig {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  technologies: string[];
  achievements: string[];
  media: ProjectMedia;
  links: ProjectLinks;
  dates: ProjectDates;
  gamification: ProjectGamification;
}
```

### 3.2 組件系統架構

#### 3.2.1 基礎組件類別
```javascript
// core/components/BaseComponent.js
export class BaseComponent {
  constructor(element, config = {}) {
    this.element = element;
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = this.getInitialState();
    this.eventListeners = new Map();
    
    this.init();
  }

  // 配置合併
  mergeConfig(defaultConfig, userConfig) {
    return {
      ...defaultConfig,
      ...userConfig,
      // 深層合併嵌套物件
      ...Object.keys(defaultConfig).reduce((acc, key) => {
        if (typeof defaultConfig[key] === 'object' && 
            typeof userConfig[key] === 'object') {
          acc[key] = { ...defaultConfig[key], ...userConfig[key] };
        }
        return acc;
      }, {})
    };
  }

  // 預設配置 (由子類覆寫)
  getDefaultConfig() {
    return {};
  }

  // 初始狀態 (由子類覆寫)
  getInitialState() {
    return {};
  }

  // 初始化方法
  init() {
    this.createElement();
    this.bindEvents();
    this.render();
  }

  // 創建元素結構 (由子類實現)
  createElement() {
    throw new Error('createElement must be implemented by subclass');
  }

  // 綁定事件 (由子類實現)
  bindEvents() {
    // 基礎事件綁定
  }

  // 渲染方法 (由子類實現)
  render() {
    throw new Error('render must be implemented by subclass');
  }

  // 狀態更新
  setState(newState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.onStateChange(prevState, this.state);
    this.render();
  }

  // 狀態變化回調
  onStateChange(prevState, currentState) {
    // 由子類覆寫
  }

  // 事件綁定輔助方法
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    const key = `${element.constructor.name}-${event}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ element, event, handler });
  }

  // 銷毀組件
  destroy() {
    // 清理事件監聽器
    this.eventListeners.forEach(listeners => {
      listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    });
    
    // 清理 DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    // 清理狀態
    this.state = null;
    this.config = null;
  }
}
```

#### 3.2.2 技能樹組件實現
```javascript
// components/gaming/SkillTree/SkillTree.js
import { BaseComponent } from '../../../core/components/BaseComponent.js';
import { configLoader } from '../../../core/config/ConfigLoader.js';

export class SkillTree extends BaseComponent {
  getDefaultConfig() {
    return {
      container: null,
      interactive: true,
      enableZoom: true,
      enableDrag: true,
      animationDuration: 300,
      onSkillClick: null,
      onSkillHover: null
    };
  }

  getInitialState() {
    return {
      skillTreeData: null,
      viewport: {
        x: 0,
        y: 0,
        scale: 1
      },
      selectedSkill: null,
      hoveredSkill: null,
      loading: true
    };
  }

  async init() {
    // 載入技能樹配置
    const skillTreeConfig = await configLoader.loadDataConfig('skills');
    this.setState({ skillTreeData: skillTreeConfig, loading: false });
    
    super.init();
  }

  createElement() {
    this.element.innerHTML = `
      <div class="skill-tree-container">
        <div class="skill-tree-controls">
          <button class="zoom-in">+</button>
          <button class="zoom-out">-</button>
          <button class="reset-view">⌂</button>
        </div>
        <div class="skill-tree-viewport">
          <svg class="skill-tree-svg">
            <g class="connections-layer"></g>
            <g class="nodes-layer"></g>
          </svg>
        </div>
        <div class="skill-tree-minimap"></div>
      </div>
    `;

    // 設定 SVG 尺寸
    this.svg = this.element.querySelector('.skill-tree-svg');
    this.connectionsLayer = this.element.querySelector('.connections-layer');
    this.nodesLayer = this.element.querySelector('.nodes-layer');
    
    this.resizeSVG();
  }

  bindEvents() {
    const viewport = this.element.querySelector('.skill-tree-viewport');
    
    // 拖曳功能
    if (this.config.enableDrag) {
      this.initDragBehavior(viewport);
    }
    
    // 縮放功能
    if (this.config.enableZoom) {
      this.initZoomBehavior(viewport);
    }
    
    // 控制按鈕
    this.bindControlButtons();
    
    // 視窗大小變化
    window.addEventListener('resize', () => this.resizeSVG());
  }

  render() {
    if (this.state.loading) {
      this.renderLoadingState();
      return;
    }

    this.renderSkillTree();
  }

  renderSkillTree() {
    const { skillTreeData } = this.state;
    
    // 清空現有內容
    this.connectionsLayer.innerHTML = '';
    this.nodesLayer.innerHTML = '';
    
    // 渲染連線
    this.renderConnections(skillTreeData);
    
    // 渲染技能節點
    this.renderSkillNodes(skillTreeData);
    
    // 更新視窗位置
    this.updateViewport();
  }

  renderSkillNodes(skillTreeData) {
    Object.values(skillTreeData.branches).forEach(branch => {
      branch.nodes.forEach(node => {
        const nodeElement = this.createSkillNode(node);
        this.nodesLayer.appendChild(nodeElement);
      });
    });
  }

  createSkillNode(nodeData) {
    const { x, y } = this.hexToPixel(nodeData.position.q, nodeData.position.r);
    
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('class', `skill-node skill-node--${nodeData.status}`);
    nodeGroup.setAttribute('transform', `translate(${x}, ${y})`);
    nodeGroup.setAttribute('data-skill-id', nodeData.id);
    
    // 技能節點圓圈
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const radius = nodeData.type === 'keystone' ? 30 : 
                   nodeData.type === 'notable' ? 22 : 18;
    
    circle.setAttribute('r', radius);
    circle.setAttribute('class', `skill-circle skill-circle--${nodeData.type}`);
    
    // 技能圖示
    if (nodeData.icon) {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      icon.setAttribute('href', `/assets/icons/skills/${nodeData.icon}.svg`);
      icon.setAttribute('x', -12);
      icon.setAttribute('y', -12);
      icon.setAttribute('width', 24);
      icon.setAttribute('height', 24);
      nodeGroup.appendChild(icon);
    }
    
    nodeGroup.appendChild(circle);
    
    // 綁定互動事件
    this.bindNodeEvents(nodeGroup, nodeData);
    
    return nodeGroup;
  }

  bindNodeEvents(nodeElement, nodeData) {
    nodeElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleSkillClick(nodeData);
    });
    
    nodeElement.addEventListener('mouseenter', () => {
      this.handleSkillHover(nodeData, true);
    });
    
    nodeElement.addEventListener('mouseleave', () => {
      this.handleSkillHover(nodeData, false);
    });
  }

  handleSkillClick(skillData) {
    this.setState({ selectedSkill: skillData });
    
    if (this.config.onSkillClick) {
      this.config.onSkillClick(skillData);
    }
    
    // 觸發自定義事件
    this.element.dispatchEvent(new CustomEvent('skillClick', {
      detail: { skill: skillData }
    }));
  }

  // 六角形座標轉換為像素座標
  hexToPixel(q, r) {
    const { hexSize } = this.state.skillTreeData.settings;
    const x = hexSize * (3/2 * q);
    const y = hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x, y };
  }

  // 縮放與平移控制
  updateViewport() {
    const { x, y, scale } = this.state.viewport;
    const transform = `translate(${x}, ${y}) scale(${scale})`;
    
    this.connectionsLayer.setAttribute('transform', transform);
    this.nodesLayer.setAttribute('transform', transform);
  }

  zoomTo(scale, centerX = 0, centerY = 0) {
    const { skillTreeData } = this.state;
    const { maxZoom, minZoom } = skillTreeData.settings;
    
    const newScale = Math.max(minZoom, Math.min(maxZoom, scale));
    const { viewport } = this.state;
    
    // 以指定點為中心進行縮放
    const newX = centerX - (centerX - viewport.x) * (newScale / viewport.scale);
    const newY = centerY - (centerY - viewport.y) * (newScale / viewport.scale);
    
    this.setState({
      viewport: {
        x: newX,
        y: newY,
        scale: newScale
      }
    });
  }

  // 重置視圖到中心
  resetView() {
    const { skillTreeData } = this.state;
    this.setState({
      viewport: {
        x: 0,
        y: 0,
        scale: skillTreeData.settings.defaultZoom
      }
    });
  }
}
```

### 3.3 狀態管理系統

#### 3.3.1 簡易狀態管理器
```javascript
// core/state/StateManager.js
class StateManager {
  constructor() {
    this.state = {};
    this.listeners = new Map();
    this.middleware = [];
  }

  // 設定初始狀態
  setInitialState(initialState) {
    this.state = { ...initialState };
  }

  // 獲取狀態
  getState(path = null) {
    if (!path) return this.state;
    
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }

  // 更新狀態
  setState(updates, options = {}) {
    const prevState = { ...this.state };
    
    // 應用中介軟體
    const processedUpdates = this.applyMiddleware(updates, prevState);
    
    // 更新狀態
    if (typeof processedUpdates === 'function') {
      this.state = processedUpdates(prevState);
    } else {
      this.state = { ...prevState, ...processedUpdates };
    }
    
    // 通知監聽器
    if (!options.silent) {
      this.notifyListeners(prevState, this.state, updates);
    }
  }

  // 訂閱狀態變化
  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    
    this.listeners.get(path).add(callback);
    
    // 返回取消訂閱函數
    return () => {
      const pathListeners = this.listeners.get(path);
      if (pathListeners) {
        pathListeners.delete(callback);
        if (pathListeners.size === 0) {
          this.listeners.delete(path);
        }
      }
    };
  }

  // 通知監聽器
  notifyListeners(prevState, currentState, updates) {
    this.listeners.forEach((callbacks, path) => {
      const prevValue = this.getValueFromPath(prevState, path);
      const currentValue = this.getValueFromPath(currentState, path);
      
      if (prevValue !== currentValue || this.pathAffectedByUpdates(path, updates)) {
        callbacks.forEach(callback => {
          callback(currentValue, prevValue, currentState);
        });
      }
    });
  }

  // 添加中介軟體
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  // 應用中介軟體
  applyMiddleware(updates, prevState) {
    return this.middleware.reduce(
      (processedUpdates, middleware) => 
        middleware(processedUpdates, prevState),
      updates
    );
  }

  getValueFromPath(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  pathAffectedByUpdates(path, updates) {
    const pathParts = path.split('.');
    let currentUpdates = updates;
    
    for (const part of pathParts) {
      if (typeof currentUpdates !== 'object' || currentUpdates === null) {
        return false;
      }
      if (!(part in currentUpdates)) {
        return false;
      }
      currentUpdates = currentUpdates[part];
    }
    
    return true;
  }
}

// 創建全域狀態管理器
export const stateManager = new StateManager();

// 設定初始狀態
stateManager.setInitialState({
  app: {
    currentPage: 'landing',
    loading: false,
    theme: 'dark',
    language: 'zh-TW'
  },
  user: {
    preferences: {
      enableSounds: true,
      enableAnimations: true,
      enableParticles: true
    }
  },
  skillTree: {
    selectedSkill: null,
    unlockedSkills: [],
    viewport: {
      x: 0,
      y: 0,
      scale: 1
    }
  },
  projects: {
    selectedProject: null,
    currentCategory: 'all',
    sortBy: 'date'
  }
});

// 添加日誌中介軟體 (開發環境)
if (process.env.NODE_ENV === 'development') {
  stateManager.addMiddleware((updates, prevState) => {
    console.log('State Update:', {
      prevState,
      updates,
      nextState: { ...prevState, ...updates }
    });
    return updates;
  });
}
```

### 3.4 事件系統

#### 3.4.1 事件巴士
```javascript
// core/events/EventBus.js
class EventBus {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
  }

  // 監聽事件
  on(event, callback, context = null) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event).push({ callback, context });
  }

  // 監聽一次性事件
  once(event, callback, context = null) {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, []);
    }
    
    this.onceEvents.get(event).push({ callback, context });
  }

  // 觸發事件
  emit(event, ...args) {
    // 處理持續監聽器
    if (this.events.has(event)) {
      const listeners = this.events.get(event);
      listeners.forEach(({ callback, context }) => {
        try {
          callback.apply(context, args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }

    // 處理一次性監聽器
    if (this.onceEvents.has(event)) {
      const onceListeners = this.onceEvents.get(event);
      onceListeners.forEach(({ callback, context }) => {
        try {
          callback.apply(context, args);
        } catch (error) {
          console.error(`Error in once event listener for ${event}:`, error);
        }
      });
      
      // 清除一次性監聽器
      this.onceEvents.delete(event);
    }
  }

  // 移除事件監聽器
  off(event, callback = null, context = null) {
    if (callback === null) {
      // 移除該事件的所有監聽器
      this.events.delete(event);
      this.onceEvents.delete(event);
      return;
    }

    // 移除特定的監聽器
    if (this.events.has(event)) {
      const listeners = this.events.get(event);
      const index = listeners.findIndex(
        listener => listener.callback === callback && 
                   (context === null || listener.context === context)
      );
      
      if (index > -1) {
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          this.events.delete(event);
        }
      }
    }
  }

  // 獲取事件監聽器數量
  listenerCount(event) {
    const persistentCount = this.events.has(event) ? 
      this.events.get(event).length : 0;
    const onceCount = this.onceEvents.has(event) ? 
      this.onceEvents.get(event).length : 0;
    
    return persistentCount + onceCount;
  }

  // 清除所有事件監聽器
  clear() {
    this.events.clear();
    this.onceEvents.clear();
  }
}

export const eventBus = new EventBus();

// 定義常用事件常數
export const EVENTS = {
  // 應用程式事件
  APP_INITIALIZED: 'app:initialized',
  PAGE_CHANGED: 'app:pageChanged',
  THEME_CHANGED: 'app:themeChanged',
  
  // 技能樹事件
  SKILL_CLICKED: 'skillTree:skillClicked',
  SKILL_UNLOCKED: 'skillTree:skillUnlocked',
  VIEWPORT_CHANGED: 'skillTree:viewportChanged',
  
  // 專案事件
  PROJECT_SELECTED: 'projects:projectSelected',
  PROJECT_CARD_FLIPPED: 'projects:cardFlipped',
  CATEGORY_CHANGED: 'projects:categoryChanged',
  
  // 音效事件
  SOUND_PLAY: 'audio:play',
  SOUND_STOP: 'audio:stop',
  VOLUME_CHANGED: 'audio:volumeChanged',
  
  // 動畫事件
  ANIMATION_START: 'animation:start',
  ANIMATION_END: 'animation:end',
  PARTICLE_BURST: 'animation:particleBurst'
};
```

### 3.5 路由系統

#### 3.5.1 簡易 SPA 路由器
```javascript
// core/router/Router.js
import { eventBus, EVENTS } from '../events/EventBus.js';
import { stateManager } from '../state/StateManager.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.basePath = '';
    this.hooks = {
      before: [],
      after: []
    };
  }

  // 註冊路由
  register(path, component, options = {}) {
    this.routes.set(path, {
      component,
      meta: options.meta || {},
      beforeEnter: options.beforeEnter,
      afterEnter: options.afterEnter
    });
  }

  // 初始化路由器
  init() {
    window.addEventListener('popstate', this.handlePopState.bind(this));
    this.navigate(this.getCurrentPath(), false);
  }

  // 導航到指定路徑
  async navigate(path, addToHistory = true) {
    const route = this.routes.get(path);
    
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return false;
    }

    // 執行前置鉤子
    const shouldContinue = await this.runBeforeHooks(path, route);
    if (!shouldContinue) return false;

    // 執行路由前置守衛
    if (route.beforeEnter) {
      const result = await route.beforeEnter(path);
      if (result === false) return false;
    }

    // 更新瀏覽器歷史
    if (addToHistory) {
      window.history.pushState({ path }, '', this.basePath + path);
    }

    // 載入並渲染組件
    await this.renderRoute(route, path);

    // 更新狀態
    stateManager.setState({
      app: { currentPage: this.getPageNameFromPath(path) }
    });

    // 執行後置鉤子
    await this.runAfterHooks(path, route);

    // 執行路由後置守衛
    if (route.afterEnter) {
      await route.afterEnter(path);
    }

    this.currentRoute = { path, route };
    eventBus.emit(EVENTS.PAGE_CHANGED, path);

    return true;
  }

  // 渲染路由
  async renderRoute(route, path) {
    const appContainer = document.getElementById('app');
    
    if (!appContainer) {
      throw new Error('App container not found');
    }

    // 顯示載入狀態
    stateManager.setState({ app: { loading: true } });

    try {
      // 動態載入組件
      let ComponentClass;
      
      if (typeof route.component === 'string') {
        // 字符串路徑，動態導入
        const module = await import(route.component);
        ComponentClass = module.default;
      } else {
        // 已經是組件類別
        ComponentClass = route.component;
      }

      // 清理舊組件
      if (this.currentComponent && typeof this.currentComponent.destroy === 'function') {
        this.currentComponent.destroy();
      }

      // 創建新組件實例
      this.currentComponent = new ComponentClass(appContainer, {
        path,
        meta: route.meta
      });

    } catch (error) {
      console.error(`Failed to load route component: ${path}`, error);
      this.showErrorPage(error);
    } finally {
      stateManager.setState({ app: { loading: false } });
    }
  }

  // 前置鉤子
  beforeEach(hook) {
    this.hooks.before.push(hook);
  }

  // 後置鉤子
  afterEach(hook) {
    this.hooks.after.push(hook);
  }

  async runBeforeHooks(path, route) {
    for (const hook of this.hooks.before) {
      const result = await hook(path, route);
      if (result === false) return false;
    }
    return true;
  }

  async runAfterHooks(path, route) {
    for (const hook of this.hooks.after) {
      await hook(path, route);
    }
  }

  // 處理瀏覽器返回/前進
  handlePopState(event) {
    const path = event.state?.path || this.getCurrentPath();
    this.navigate(path, false);
  }

  // 獲取當前路徑
  getCurrentPath() {
    return window.location.pathname.replace(this.basePath, '') || '/';
  }

  // 從路徑獲取頁面名稱
  getPageNameFromPath(path) {
    if (path === '/') return 'landing';
    return path.replace('/', '');
  }

  // 錯誤頁面
  showErrorPage(error) {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
      <div class="error-page">
        <h1>頁面載入失敗</h1>
        <p>抱歉，頁面載入時發生錯誤。</p>
        <button onclick="location.reload()">重新載入</button>
      </div>
    `;
  }
}

export const router = new Router();

// 路由配置
export function setupRoutes() {
  router.register('/', 'pages/Landing/Landing.js', {
    meta: { title: 'Home - Portfolio' }
  });

  router.register('/about', 'pages/About/About.js', {
    meta: { title: 'About - Backend Engineer' }
  });

  router.register('/skills', 'pages/Skills/Skills.js', {
    meta: { title: 'Skills - Interactive Skill Tree' }
  });

  router.register('/portfolio', 'pages/Portfolio/Portfolio.js', {
    meta: { title: 'Portfolio - My Projects' }
  });

  router.register('/projects', 'pages/Projects/Projects.js', {
    meta: { title: 'Projects - Card Collection' }
  });

  router.register('/contact', 'pages/Contact/Contact.js', {
    meta: { title: 'Contact - Get In Touch' }
  });

  // 全域前置守衛 - 更新頁面標題
  router.beforeEach((path, route) => {
    if (route.meta.title) {
      document.title = route.meta.title;
    }
    return true;
  });

  // 全域後置鉤子 - Google Analytics
  router.afterEach((path) => {
    if (window.gtag) {
      window.gtag('config', 'GA_TRACKING_ID', {
        page_path: path
      });
    }
  });
}
```

---

## 4. 配置驅動的頁面系統

### 4.1 頁面基礎類別
```javascript
// core/pages/BasePage.js
import { BaseComponent } from '../components/BaseComponent.js';
import { configLoader } from '../config/ConfigLoader.js';
import { eventBus, EVENTS } from '../events/EventBus.js';

export class BasePage extends BaseComponent {
  constructor(container, options = {}) {
    super(container, options);
    this.pageName = options.pageName || this.getPageNameFromPath(options.path);
    this.pageConfig = null;
    this.sections = new Map();
  }

  async init() {
    // 載入頁面配置
    this.pageConfig = await configLoader.loadPageConfig(this.pageName);
    
    // 設定頁面 meta 信息
    this.updatePageMeta();
    
    // 初始化父類
    super.init();
  }

  createElement() {
    const { layout } = this.pageConfig;
    
    this.element.innerHTML = `
      <div class="page page--${this.pageName}">
        <div class="page-container" 
             data-layout="${layout.type}"
             data-padding="${layout.padding}"
             style="max-width: ${layout.maxWidth || 'none'}">
          ${this.generateLayoutHTML(layout)}
        </div>
      </div>
    `;

    this.container = this.element.querySelector('.page-container');
  }

  generateLayoutHTML(layout) {
    switch (layout.type) {
      case 'single-column':
        return '<div class="layout-column" data-column="1"></div>';
      
      case 'two-column':
        return `
          <div class="layout-column" data-column="1"></div>
          <div class="layout-column" data-column="2"></div>
        `;
      
      case 'three-column':
        return `
          <div class="layout-column" data-column="1"></div>
          <div class="layout-column" data-column="2"></div>
          <div class# 技術架構文件 - 遊戲化個人網站

## 1. 架構總覽

### 1.1 系統架構圖
```
┌─────────────────────────────────────────────────────────┐
│                     用戶界面層                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Landing │ │  About  │ │ Skills  │ │Portfolio│  ...  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     組件層                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │SkillTree│ │ CardGrid│ │Particles│ │AudioMgr │  ...  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                 Config驅動層                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │PageConfig│ │SkillData│ │Projects │ │ Profile │  ...  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     核心層                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Router  │ │EventBus │ │StateManager│ Utils │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│              ┌─────────────────────┐                    │
│              │   Build System      │                    │
│              │      (Vite)         │                    │
│              └─────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### 1.2 核心設計原則

#### Config-Driven 架構
**理念：** 所有頁面內容、組件配置、樣式設定都透過 JSON 配置檔案控制，實現內容與程式碼分離。

**優勢：**
- 🔄 **內容更新簡單** - 只需修改配置檔案，無需改程式碼
- 🎯 **類型安全** - TypeScript 介面確保配置正確性
- 🚀 **快速擴展** - 新增頁面只需添加配置
- 🔧 **易於維護** - 配置集中管理，版本控制友善
- 🎨 **設計彈性** - 支援不同主題和佈局變化

---

## 2. 專案結構設計

### 2.1 目錄結構
```
src/
├── config/                     # 配置文件目錄
│   ├── pages/                  # 頁面配置
│   │   ├── landing.config.js
│   │   ├── about.config.js
│   │   ├── skills.config.js
│   │   ├── portfolio.config.js
│   │   └── projects.config.js
│   ├── data/                   # 數據配置
│   │   ├── profile.config.js
│   │   ├── skills.config.js
│   │   ├── projects.config.js
│   │   └── experience.config.js
│   ├── theme/                  # 主題配置
│   │   ├── colors.config.js
│   │   ├── typography.config.js
│   │   └── animations.config.js
│   └── site.config.js          # 全站配置
│
├── components/                 # 可重用組件
│   ├── common/                 # 通用組件
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Card/
│   │   └── Loader/
│   ├── gaming/                 # 遊戲風格組件
│   │   ├── SkillTree/
│   │   ├── ProjectCard/
│   │   ├── YugiohCard/
│   │   └── ParticleSystem/
│   └── layout/                 # 佈局組件
│       ├── Header/
│       ├── Navigation/
│       └── Footer/
│
├── pages/                      # 頁面組件
│   ├── Landing/
│   │   ├── index.js
│   │   ├── Landing.css
│   │   └── components/
│   ├── About/
│   ├── Skills/
│   ├── Portfolio/
│   └── Projects/
│
├── core/                       # 核心系統
│   ├── router/
│   ├── state/
│   ├── events/
│   ├── config/
│   └── utils/
│
├── systems/                    # 功能系統
│   ├── AudioManager/
│   ├── AnimationManager/
│   ├── PreloadManager/
│   └── ErrorBoundary/
│
├── assets/                     # 靜態資源
│   ├── images/
│   ├── sounds/
│   ├── fonts/
│   └── data/
│
└── styles/                     # 樣式文件
    ├── globals/
    ├── components/
    └── themes/
```

### 2.2 配置文件設計

#### 2.2.1 頁面配置範例 - About 頁面
```javascript
// config/pages/about.config.js
export const aboutPageConfig = {
  // 頁面基本信息
  meta: {
    title: "About - Backend Engineer",
    description: "了解我的技術背景與職涯發展",
    keywords: ["後端工程師", "系統架構", "技術領導"],
    ogImage: "/assets/images/about-og.jpg"
  },

  // 頁面佈局配置
  layout: {
    type: "three-column",          // 佈局類型
    sidebar: "left",               // 側邊欄位置
    padding: "standard",           // 內邊距大小
    maxWidth: "1200px"            // 最大寬度
  },

  // 動畫配置
  animations: {
    pageTransition: {
      type: "fadeInUp",
      duration: 800,
      delay: 0
    },
    stagger: {
      enabled: true,
      delay: 150
    }
  },

  // 頁面區塊配置
  sections: [
    {
      id: "character-panel",
      type: "character-status",
      position: { column: 1, order: 1 },
      config: {
        avatar: {
          src: "/assets/images/avatar.jpg",
          alt: "個人頭像",
          effects: ["glow", "rotate-hover"]
        },
        stats: {
          level: {
            current: 7,              // 工作年資
            label: "Backend Engineer",
            experience: 75           // 當前階段進度 %
          },
          attributes: [
            { name: "Technical Skills", value: 85, color: "gold" },
            { name: "Architecture Thinking", value: 78, color: "blue" },
            { name: "Team Collaboration", value: 82, color: "green" },
            { name: "Problem Solving", value: 88, color: "red" },
            { name: "AI Integration", value: 75, color: "purple" }
          ]
        },
        badges: [
          { name: "AWS Certified", icon: "aws", earned: true },
          { name: "Kubernetes Expert", icon: "k8s", earned: true },
          { name: "AI Specialist", icon: "ai", earned: false }
        ]
      }
    },
    {
      id: "career-timeline",
      type: "timeline",
      position: { column: 2, order: 1 },
      config: {
        title: "職涯發展歷程",
        items: [
          {
            id: "current-role",
            date: "2022 - Present",
            title: "Senior Backend Engineer",
            company: "Tech Company",
            description: "負責微服務架構設計與團隊技術指導",
            skills: ["Java", "Spring Boot", "Kubernetes", "AWS"],
            achievements: [
              "系統性能提升 40%",
              "導入 AI 輔助開發工具",
              "建立技術分享文化"
            ],
            type: "work",
            status: "current"
          }
          // ... 更多時間軸項目
        ]
      }
    },
    {
      id: "skills-radar",
      type: "radar-chart",
      position: { column: 3, order: 1 },
      config: {
        title: "技能雷達圖",
        data: [
          { skill: "Backend Development", value: 90 },
          { skill: "System Architecture", value: 80 },
          { skill: "Cloud Technologies", value: 75 },
          { skill: "AI/ML Integration", value: 70 },
          { skill: "DevOps", value: 65 },
          { skill: "Team Leadership", value: 75 }
        ],
        colors: {
          fill: "rgba(212, 175, 55, 0.2)",
          stroke: "#d4af37",
          point: "#f4d03f"
        }
      }
    }
  ],

  // 互動元素配置
  interactions: {
    enableParticles: true,
    enableSoundEffects: true,
    hoverEffects: ["glow", "lift", "particle-burst"],
    clickEffects: ["ripple", "sound-feedback"]
  },

  // 響應式配置
  responsive: {
    mobile: {
      layout: { type: "single-column" },
      sections: [
        { id: "character-panel", order: 1 },
        { id: "career-timeline", order: 2 },
        { id: "skills-radar", order: 3 }
      ]
    },
    tablet: {
      layout: { type: "two-column" },
      sections: [
        { id: "character-panel", position: { column: 1, order: 1 } },
        { id: "career-timeline", position: { column: 1, order: 2 } },
        { id: "skills-radar", position: { column: 2, order: 1 } }
      ]
    }
  }
};
```

#### 2.2.2 技能樹配置範例
```javascript
// config/data/skills.config.js
export const skillTreeConfig = {
  // 技能樹全域設定
  settings: {
    centerPoint: { x: 0, y: 0 },
    hexSize: 40,
    spacing: 50,
    maxZoom: 2.0,
    minZoom: 0.3,
    defaultZoom: 1.0
  },

  // 技能樹主題樣式
  theme: {
    connections: {
      active: { color: "#d4af37", width: 3, glow: true },
      inactive: { color: "#6c757d", width: 1, glow: false }
    },
    nodes: {
      mastered: {
        background: "radial-gradient(circle, #f4d03f 0%, #d4af37 70%)",
        border: "#f4d03f",
        glow: "0 0 15px rgba(244, 208, 63, 0.8)"
      },
      available: {
        background: "radial-gradient(circle, #3498db 0%, #2980b9 70%)",
        border: "#5dade2", 
        glow: "0 0 10px rgba(93, 173, 226, 0.5)"
      },
      locked: {
        background: "#2c3e50",
        border: "#34495e",
        glow: "none"
      }
    }
  },

  // 技能樹分支定義
  branches: {
    "backend-core": {
      name: "後端核心",
      color: "#d4af37",
      startPosition: { q: 0, r: 0 },
      icon: "server",
      description: "後端開發基礎技能",
      
      nodes: [
        {
          id: "programming-fundamentals",
          name: "程式設計基礎",
          position: { q: 0, r: 0 },
          type: "keystone",
          status: "mastered",
          description: "紮實的程式設計基礎與邏輯思維",
          skills: ["演算法", "資料結構", "設計模式"],
          learnedDate: "2018-09",
          experience: "5+ years",
          projects: ["personal-blog", "task-manager"],
          prerequisites: [],
          unlocks: ["java-mastery", "python-proficiency"]
        },
        {
          id: "java-mastery", 
          name: "Java 精通",
          position: { q: 0, r: -1 },
          type: "notable",
          status: "mastered",
          description: "深度掌握 Java 語言特性與生態系統",
          skills: ["Java 8+", "JVM 調優", "並發程式設計", "記憶體管理"],
          learnedDate: "2019-03",
          experience: "4+ years",
          certifications: ["Oracle Java Certified"],
          projects: ["microservices-project", "payment-gateway"],
          prerequisites: ["programming-fundamentals"],
          unlocks: ["spring-ecosystem", "jvm-optimization"]
        }
        // ... 更多技能節點
      ]
    },

    "ai-ml-engineering": {
      name: "AI/ML 工程",
      color: "#9b59b6",
      startPosition: { q: -2, r: -2 },
      icon: "robot",
      description: "人工智慧與機器學習應用開發",
      
      nodes: [
        {
          id: "llm-integration",
          name: "LLM 整合應用",
          position: { q: -2, r: -1 },
          type: "notable", 
          status: "learning",
          description: "大型語言模型的企業級整合與應用",
          skills: ["OpenAI API", "LangChain", "Vector DB", "RAG"],
          startedDate: "2024-01",
          targetDate: "2024-06",
          progress: 60,
          prerequisites: ["python-proficiency", "api-design"],
          unlocks: ["ai-agent-development", "prompt-optimization"]
        },
        {
          id: "prompt-engineering",
          name: "Prompt Engineering",
          position: { q: -3, r: -1 },
          type: "normal",
          status: "planning",
          description: "專業的 Prompt 設計與優化技能",
          skills: ["Few-shot Learning", "Chain of Thought", "Prompt 優化"],
          plannedDate: "2024-07",
          estimatedDuration: "2 months",
          prerequisites: ["llm-integration"],
          unlocks: ["ai-workflow-automation"]
        }
        // ... 更多 AI 相關技能
      ]
    }
    // ... 其他分支
  },

  // 學習路徑建議
  learningPaths: [
    {
      name: "後端工程師成長路線",
      description: "從初級到資深後端工程師的學習建議",
      steps: [
        "programming-fundamentals",
        "java-mastery", 
        "database-design",
        "api-development",
        "microservices-architecture",
        "cloud-technologies"
      ],
      estimatedDuration: "24 months"
    },
    {
      name: "AI 整合專家路線",
      description: "結合後端開發與 AI 技術的專業路線",
      steps: [
        "python-proficiency",
        "machine-learning-basics", 
        "llm-integration",
        "prompt-engineering",
        "ai-agent-development"
      ],
      estimatedDuration: "18 months"
    }
  ]
};
```

#### 2.2.3 專案配置範例
```javascript
// config/data/projects.config.js
export const projectsConfig = {
  // 專案展示設定
  displaySettings: {
    cardsPerPage: 9,
    defaultSort: "date",
    enableFiltering: true,
    enableSearch: true,
    animationDelay: 150
  },

  // 分類定義
  categories: [
    { 
      id: "backend", 
      name: "後端開發", 
      icon: "server",
      color: "#d4af37",
      description: "後端系統與API開發專案"
    },
    { 
      id: "ai-ml", 
      name: "AI/ML", 
      icon: "robot",
      color: "#9b59b6",
      description: "人工智慧與機器學習應用"
    },
    {
      id: "system-architecture",
      name: "系統架構", 
      icon: "sitemap",
      color: "#3498db",
      description: "大型系統架構設計與優化"
    }
  ],

  // 技術標籤定義
  technologies: {
    "Java": { color: "#f89820", category: "backend" },
    "Spring Boot": { color: "#6db33f", category: "backend" },
    "Python": { color: "#3776ab", category: "backend" },
    "Docker": { color: "#2496ed", category: "devops" },
    "Kubernetes": { color: "#326ce5", category: "devops" },
    "OpenAI": { color: "#00a67e", category: "ai" },
    "LangChain": { color: "#1c3c3c", category: "ai" }
  },

  // 專案列表
  projects: [
    {
      id: "microservices-ecommerce",
      title: "微服務電商平台",
      subtitle: "Enterprise E-commerce Platform",
      category: "system-architecture",
      rarity: "legendary",          // common, rare, epic, legendary
      
      // 基本資訊
      description: "基於微服務架構的大型電商平台，支援高併發與彈性擴展",
      shortDescription: "高併發微服務電商平台",
      
      // 技術資訊
      technologies: [
        "Java", "Spring Boot", "Spring Cloud", 
        "Docker", "Kubernetes", "Redis", "PostgreSQL", "Kafka"
      ],
      architecture: "Microservices",
      
      // 專案詳情
      details: {
        duration: "8 months",
        teamSize: 6,
        role: "Lead Backend Developer",
        status: "Production",
        scale: {
          users: "50K+ daily active users",
          requests: "1M+ requests/day", 
          uptime: "99.9%"
        }
      },

      // 成就與亮點
      achievements: [
        "系統響應時間提升 60%",
        "支援 10x 併發量提升", 
        "實現零停機部署",
        "建立完整的監控與告警體系"
      ],

      // 技術挑戰與解決方案
      challenges: [
        {
          problem: "高併發下的資料一致性問題",
          solution: "實作分散式鎖與事件溯源模式",
          impact: "確保資料強一致性，支援高併發交易"
        },
        {
          problem: "服務間通訊的效能瓶頸",
          solution: "導入 gRPC 與非同步訊息佇列",
          impact: "服務間通訊延遲降低 40%"
        }
      ],

      // 多媒體資源
      media: {
        coverImage: "/assets/projects/microservices-ecommerce/cover.jpg",
        screenshots: [
          "/assets/projects/microservices-ecommerce/dashboard.jpg",
          "/assets/projects/microservices-ecommerce/architecture.png"
        ],
        demoVideo: "/assets/projects/microservices-ecommerce/demo.mp4",
        architectureDiagram: "/assets/projects/microservices-ecommerce/arch.svg"
      },

      // 連結
      links: {
        demo: "https://ecommerce-demo.example.com",
        github: "https://github.com/username/microservices-ecommerce",
        documentation: "https://docs.ecommerce.example.com",
        caseStudy: "/case-studies/microservices-ecommerce"
      },

      // 時間資訊  
      dates: {
        started: "2023-06-01",
        completed: "2024-02-01",
        lastUpdated: "2024-03-15"
      },

      // SEO 與元數據
      meta: {
        keywords: ["微服務", "電商平台", "高併發", "系統架構"],
        ogImage: "/assets/projects/microservices-ecommerce/og-image.jpg"
      },

      // 遊戲化元素
      gamification: {
        cardStats: {
          complexity: 9,      // 專案複雜度 (1-10)
          innovation: 8,      // 創新程度 (1-10) 
          impact: 9           // 影響力 (1-10)
        },
        unlockConditions: [
          "完成 Java 精通技能",
          "掌握微服務架構設計",
          "具備雲端部署經驗"
        ]
      }
    },

    {
      id: "ai-code-assistant",
      title: "AI 程式碼助手",
      subtitle: "Intelligent Coding Assistant",
      category: "ai-ml", 
      rarity: "epic",
      
      description: "基於 GPT-4 的智能程式碼助手，提供程式碼生成、優化建議與錯誤檢測",
      shortDescription: "GPT-4 驅動的程式碼助手",
      
      technologies: [
        "Python", "FastAPI", "OpenAI GPT-4", 
        "LangChain", "ChromaDB", "Docker"
      ],
      architecture: "RAG + LLM",

      details: {
        duration: "4 months",
        teamSize: 3,
        role: "AI Integration Lead",
        status: "Beta",
        scale: {
          users: "500+ developers",
          codeGenerated: "10K+ lines/month",
          accuracy: "92%"
        }
      },

      achievements: [
        "程式碼生成準確率達 92%",
        "開發效率提升 35%",
        "支援 15+ 程式語言",
        "整合主流 IDE 插件"
      ],

      challenges: [
        {
          problem: "程式碼上下文理解不準確",
          solution: "建立專案級程式碼索引與 RAG 檢索",
          impact: "上下文理解準確率提升至 88%"
        }
      ],

      media: {
        coverImage: "/assets/projects/ai-code-assistant/cover.jpg",
        screenshots: [
          "/assets/projects/ai-code-assistant/vscode-demo.jpg",
          "/assets/projects/ai-code-assistant/chat-interface.jpg"
        ],
        demoVideo: "/assets/projects/ai-code-assistant/demo.mp4"
      },

      links: {
        demo: "https://ai-assistant-demo.example.com",
        github: "https://github.com/username/ai-code-assistant",
        marketplace: "https://marketplace.visualstudio.com/items?itemName=ai-assistant"
      },

      dates: {
        started: "2024-01-01", 
        completed: null,
        lastUpdated: "2024-03-20"
      },

      gamification: {
        cardStats: {
          complexity: 7,
          innovation: 9,
          impact: 8
        },
        unlockConditions: [
          "完成 LLM 整合應用技能",
          "掌握 Prompt Engineering", 
          "具備 RAG 系統開發經驗"
        ]
      }
    }
    // ... 更多專案
  ],

  // 專案統計
  statistics: {
    totalProjects: 12,
    categoriesCount: {
      "backend": 5,
      "ai-ml": 3,
      "system-architecture": 2,
      "fullstack": 2
    },
    rarityDistribution: {
      "legendary": 2,
      "epic": 3, 
      "rare": 4,
      "common": 3
    }
  }
};
```

---

## 3. 核心系統架構

### 3.1 配置管理系統

#### 3.1.1 配置載入器 (ConfigLoader)
```javascript
// core/config/ConfigLoader.js
class ConfigLoader {
  constructor() {
    this.configs = new Map();
    this.watchers = new Map();
    this.cache = new Map();
  }

  // 載入頁面配置
  async loadPageConfig(pageName) {
    const cacheKey = `page:${pageName}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const configModule = await import(`../config/pages/${pageName}.config.js`);
      const config = this.validatePageConfig(configModule.default);
      
      this.cache.set(cacheKey, config);
      return config;
    } catch (error) {
      console.error(`Failed to load page config: ${pageName}`, error);
      return this.getDefaultPageConfig(pageName);
    }
  }

  // 載入數據配置
  async loadDataConfig(dataName) {
    const cacheKey = `data:${dataName}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const configModule = await import(`../config/data/${dataName}.config.js`);
      const config = this.validateDataConfig(configModule.default);
      
      this.cache.set(cacheKey, config);
      return config;
    } catch (error) {
      console.error(`Failed to load data config: ${dataName}`, error);
      return this.getDefaultDataConfig(dataName);
    }
  }

  // 配置驗證
  validatePageConfig(config) {
    const requiredFields = ['meta', 'layout', 'sections'];
    
    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return config;
  }

  validateDataConfig(config) {
    // 根據不同數據類型進行驗證
    if (config.type === 'skillTree') {
      return this.validateSkillTreeConfig(config);
    } else if (config.type === 'projects') {
      return this.validateProjectsConfig(config);
    }
    
    return config;
  }

  // 熱重載支援 (開發環境)
  enableHotReload(configPath, callback) {
    if (process.env.NODE_ENV !== 'development') return;
    
    if (this.watchers.has(configPath)) {
      this.watchers.get(configPath).close();
    }

    const watcher = new FileWatcher(configPath);
    watcher.on('change', () => {
      this.cache.delete(configPath);
      callback();
    });
    
    this.watchers.set(configPath, watcher);
  }

  // 預設配置
  getDefaultPageConfig(pageName) {
    return {
      meta: {
        title: `${pageName} - Portfolio`,
        description: `${pageName} page description`
      },
      layout: {
        type: "single-column",
        padding: "standard"
      },
      sections: [],
      animations: {
        pageTransition: {
          type: "fadeIn",
          duration: 500
        }
      }
    };
  }
}

export const configLoader = new ConfigLoader();
```

#### 3.1.2 配置型別定義 (TypeScript)
```typescript
// core/config/types.ts
export interface PageConfig {
  meta: PageMeta;
  layout: LayoutConfig;
  sections: SectionConfig[];
  animations?: AnimationConfig;
  interactions?: InteractionConfig;
  responsive?: ResponsiveConfig;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

export interface LayoutConfig {
  type: 'single-column' | 'two-column' | 'three-column' | 'grid';
  sidebar?: 'left' | 'right' | 'none';
  padding: 'none' | 'small' | 'standard' | 'large';
  maxWidth?: string;
}

export interface Section