/**
 * 路由配置文件
 * Step 3.1.1d: 統一管理所有路由
 */

import { HomePage } from '../pages/HomePage.js';
import { AboutPage } from '../pages/AboutPage.js';
import { SkillsPage } from '../pages/SkillsPage.js';
import { WorkProjectsPage } from '../pages/WorkProjectsPage.js';
import { PersonalProjectsPage } from '../pages/PersonalProjectsPage.js';
import { ContactPage } from '../pages/ContactPage.js';

/**
 * 路由配置
 * 每個路由包含：路径、組件、標題、描述等信息
 */
export const routesConfig = [
  {
    path: '/',
    component: HomePage,
    title: '遊戲化個人作品集 | Gaming Portfolio',
    meta: {
      description:
        '融合遊戲元素的個人作品集網站，展現後端工程師向系統架構師發展的專業軌跡',
      keywords:
        'portfolio, backend engineer, system architect, gaming, homepage',
      icon: '🎮',
    },
  },
  {
    path: '/about',
    component: AboutPage,
    title: '關於我 | Gaming Portfolio',
    meta: {
      description: '了解我的技術背景、職涯發展與專業理念',
      keywords: 'about, backend engineer, career, professional background',
      icon: '📋',
    },
  },
  {
    path: '/skills',
    component: SkillsPage,
    title: '技能樹 | Gaming Portfolio',
    meta: {
      description: '以遊戲化方式展示我的技術技能發展軌跡',
      keywords: 'skills, technical expertise, skill tree, backend technologies',
      icon: '🌟',
    },
  },
  {
    path: '/work-projects',
    component: WorkProjectsPage,
    title: '工作專案時間軸 | Gaming Portfolio',
    meta: {
      description: '以互動時間軸展示工作專案發展歷程，體驗專業項目開發軌跡',
      keywords:
        'work projects, timeline, professional development, interactive timeline',
      icon: '⏱️',
    },
  },
  {
    path: '/personal-projects',
    component: PersonalProjectsPage,
    title: '個人專案卡牌收藏 | Gaming Portfolio',
    meta: {
      description: '遊戲王風格個人專案展示，體驗召喚特效與卡牌收藏系統',
      keywords:
        'personal projects, yugioh cards, summoning animation, portfolio showcase',
      icon: '🎴',
    },
  },
  {
    path: '/contact',
    component: ContactPage,
    title: '聯絡方式 | Gaming Portfolio',
    meta: {
      description: '與我取得聯繫，討論技術合作或職位機會',
      keywords: 'contact, collaboration, career opportunities, communication',
      icon: '📬',
    },
  },
];

/**
 * 404 錯誤頁面配置
 */
export const notFoundConfig = {
  path: '/404',
  component: class NotFoundPage {
    async render() {
      return `
        <div class="not-found-page" style="text-align: center; padding: 60px 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            
            <div style="font-size: 6rem; margin-bottom: 20px;">🎯</div>
            
            <h1 style="color: #e74c3c; font-size: 2.5rem; margin-bottom: 20px;">
              404 - 頁面未找到
            </h1>
            
            <p style="color: white; font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9;">
              看起來你想要訪問的頁面不存在，或是路徑可能有誤。
            </p>
            
            <div style="background: rgba(231, 76, 60, 0.1); border: 2px solid #e74c3c; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
              <h3 style="color: #e74c3c; margin-bottom: 15px;">🧭 建議的導航</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <a href="#/" style="background: rgba(212, 175, 55, 0.2); border: 1px solid #d4af37; color: #d4af37; padding: 10px; text-decoration: none; border-radius: 6px; display: block;">🏠 首頁</a>
                <a href="#/about" style="background: rgba(212, 175, 55, 0.2); border: 1px solid #d4af37; color: #d4af37; padding: 10px; text-decoration: none; border-radius: 6px; display: block;">📋 關於</a>
                <a href="#/skills" style="background: rgba(212, 175, 55, 0.2); border: 1px solid #d4af37; color: #d4af37; padding: 10px; text-decoration: none; border-radius: 6px; display: block;">🌟 技能</a>
                <a href="#/work-projects" style="background: rgba(212, 175, 55, 0.2); border: 1px solid #d4af37; color: #d4af37; padding: 10px; text-decoration: none; border-radius: 6px; display: block;">⏱️ 工作專案</a>
                <a href="#/personal-projects" style="background: rgba(212, 175, 55, 0.2); border: 1px solid #d4af37; color: #d4af37; padding: 10px; text-decoration: none; border-radius: 6px; display: block;">🎴 個人專案</a>
              </div>
            </div>
            
            <a href="#/" style="background: #d4af37; color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem;">
              🎮 回到首頁
            </a>
            
          </div>
        </div>
      `;
    }

    async init() {
      console.log('🚫 404 Page initialized');
    }

    destroy() {
      console.log('🚫 404 Page destroyed');
    }
  },
  title: '404 - 頁面未找到 | Gaming Portfolio',
  meta: {
    description: '頁面未找到，請返回首頁或使用導航',
    keywords: '404, page not found, error',
    icon: '🚫',
  },
};

/**
 * 獲取所有路由配置
 * @returns {Array} 所有路由配置
 */
export function getAllRoutes() {
  return [...routesConfig, notFoundConfig];
}

/**
 * 根據路径查找路由配置
 * @param {string} path - 路径
 * @returns {Object|null} 路由配置或null
 */
export function findRouteByPath(path) {
  return routesConfig.find(route => route.path === path) || null;
}

/**
 * 獲取導航菜單配置
 * @returns {Array} 導航菜單項目
 */
export function getNavigationItems() {
  return routesConfig
    .filter(route => route.path !== '/') // 排除首頁
    .map(route => ({
      path: route.path,
      title: route.meta.icon + ' ' + route.title.split(' | ')[0],
      icon: route.meta.icon,
      name: route.title.split(' | ')[0],
    }));
}

/**
 * 驗證路由配置
 * @returns {boolean} 配置是否有效
 */
export function validateRoutesConfig() {
  try {
    // 檢查是否有重複路径
    const paths = routesConfig.map(route => route.path);
    const uniquePaths = [...new Set(paths)];

    if (paths.length !== uniquePaths.length) {
      console.error('❌ Duplicate routes found:', paths);
      return false;
    }

    // 檢查是否有首頁路由
    const hasHomePage = routesConfig.some(route => route.path === '/');
    if (!hasHomePage) {
      console.error('❌ No home page route found');
      return false;
    }

    // 檢查每個路由是否有必要屬性
    for (const route of routesConfig) {
      if (!route.path || !route.component || !route.title) {
        console.error('❌ Invalid route config:', route);
        return false;
      }
    }

    console.log('✅ Routes configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Error validating routes config:', error);
    return false;
  }
}

/**
 * 獲取路由統計信息
 * @returns {Object} 統計信息
 */
export function getRouteStats() {
  return {
    totalRoutes: routesConfig.length,
    regularRoutes: routesConfig.length - 1, // 排除404頁面
    hasNotFoundPage: true,
    navigationItems: getNavigationItems().length,
  };
}
