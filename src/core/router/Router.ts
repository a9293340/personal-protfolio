/**
 * Router - 路由系統
 *
 * 功能：
 * 1. 路由註冊和匹配 - 管理所有頁面路由
 * 2. 歷史記錄管理 - 瀏覽器歷史處理
 * 3. 頁面切換動畫 - 流暢的過渡效果
 * 4. 路由守衛功能 - 權限和導航控制
 * 5. 懶載入支援 - 按需載入頁面組件
 *
 * @author Claude
 * @version 1.0.0
 */

import { EventEmitter } from '../events/EventEmitter.js';
import type { BaseComponent } from '../components/BaseComponent.js';

// 路由相關類型定義
export interface RouteParams {
  [key: string]: string;
}

export interface RouteQuery {
  [key: string]: string | string[];
}

export interface RouteLocation {
  path: string;
  params: RouteParams;
  query: RouteQuery;
  hash: string;
  fullPath: string;
}

export interface RouteGuard {
  (to: RouteLocation, from: RouteLocation): boolean | Promise<boolean> | string;
}

export interface RouteConfig {
  path: string;
  name?: string;
  component?: () => Promise<typeof BaseComponent> | typeof BaseComponent;
  redirect?: string;
  meta?: Record<string, any>;
  beforeEnter?: RouteGuard;
  children?: RouteConfig[];
}

export interface NavigationOptions {
  replace?: boolean;
  animation?: 'slide' | 'fade' | 'zoom' | 'none';
  animationDuration?: number;
  force?: boolean;
}

export interface RouterConfig {
  mode: 'hash' | 'history';
  base?: string;
  container?: string;
  scrollBehavior?: (
    to: RouteLocation,
    from: RouteLocation
  ) => { x: number; y: number } | null;
  beforeEach?: RouteGuard;
  afterEach?: (to: RouteLocation, from: RouteLocation) => void;
}

export interface NavigationGuardResult {
  allowed: boolean;
  redirect?: string;
  error?: string;
}

export class Router extends EventEmitter {
  private routes: Map<string, RouteConfig> = new Map();
  private currentRoute: RouteLocation | null = null;
  private config: RouterConfig;
  private isNavigating = false;
  private componentCache: Map<string, BaseComponent> = new Map();

  constructor(config: RouterConfig = { mode: 'hash' }) {
    super();
    this.config = config;
    this.initialize();
  }

  /**
   * ========================================
   * 路由註冊和匹配
   * ========================================
   */

  /**
   * 註冊單個路由
   */
  addRoute(route: RouteConfig): void {
    this.validateRoute(route);

    // 規範化路徑
    const normalizedPath = this.normalizePath(route.path);

    // 儲存路由配置
    this.routes.set(normalizedPath, { ...route, path: normalizedPath });

    // 處理子路由
    if (route.children && route.children.length > 0) {
      route.children.forEach(childRoute => {
        const childPath = this.joinPaths(normalizedPath, childRoute.path);
        this.addRoute({ ...childRoute, path: childPath });
      });
    }

    console.log(
      `✅ Route registered: ${normalizedPath} -> ${route.name || 'Anonymous'}`
    );
  }

  /**
   * 批量註冊路由
   */
  addRoutes(routes: RouteConfig[]): void {
    routes.forEach(route => this.addRoute(route));
  }

  /**
   * 移除路由
   */
  removeRoute(path: string): boolean {
    const normalizedPath = this.normalizePath(path);
    const existed = this.routes.has(normalizedPath);

    if (existed) {
      this.routes.delete(normalizedPath);
      console.log(`🗑️ Route removed: ${normalizedPath}`);
    }

    return existed;
  }

  /**
   * 匹配路由
   */
  matchRoute(path: string): { route: RouteConfig; params: RouteParams } | null {
    const normalizedPath = this.normalizePath(path);

    // 精確匹配
    if (this.routes.has(normalizedPath)) {
      return {
        route: this.routes.get(normalizedPath)!,
        params: {},
      };
    }

    // 參數匹配
    for (const [routePath, routeConfig] of this.routes) {
      const params = this.matchParams(routePath, normalizedPath);
      if (params) {
        return {
          route: routeConfig,
          params,
        };
      }
    }

    return null;
  }

  /**
   * 參數匹配
   */
  private matchParams(
    routePath: string,
    actualPath: string
  ): RouteParams | null {
    const routeSegments = routePath.split('/');
    const pathSegments = actualPath.split('/');

    if (routeSegments.length !== pathSegments.length) {
      return null;
    }

    const params: RouteParams = {};

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const pathSegment = pathSegments[i];

      if (routeSegment.startsWith(':')) {
        // 參數段
        const paramName = routeSegment.substring(1);
        params[paramName] = decodeURIComponent(pathSegment);
      } else if (routeSegment !== pathSegment) {
        // 不匹配
        return null;
      }
    }

    return params;
  }

  /**
   * ========================================
   * 歷史記錄管理
   * ========================================
   */

  /**
   * 初始化路由系統
   */
  private initialize(): void {
    // 監聽瀏覽器歷史變化
    window.addEventListener('popstate', this.handlePopState.bind(this));

    if (this.config.mode === 'hash') {
      window.addEventListener('hashchange', this.handleHashChange.bind(this));
    }

    // 初始路由
    this.handleInitialRoute();
  }

  /**
   * 處理初始路由
   */
  private handleInitialRoute(): void {
    const currentPath = this.getCurrentPath();
    this.navigate(currentPath, { replace: true });
  }

  /**
   * 處理瀏覽器後退/前進
   */
  private handlePopState(event: PopStateEvent): void {
    if (event.state && event.state.routerPath) {
      this.navigate(event.state.routerPath, { replace: true });
    } else {
      const currentPath = this.getCurrentPath();
      this.navigate(currentPath, { replace: true });
    }
  }

  /**
   * 處理 Hash 變化
   */
  private handleHashChange(): void {
    if (this.config.mode === 'hash') {
      const currentPath = this.getCurrentPath();
      this.navigate(currentPath, { replace: true });
    }
  }

  /**
   * 獲取當前路徑
   */
  private getCurrentPath(): string {
    if (this.config.mode === 'hash') {
      return window.location.hash.substring(1) || '/';
    } else {
      const base = this.config.base || '';
      const path = window.location.pathname;
      return path.startsWith(base) ? path.substring(base.length) : path;
    }
  }

  /**
   * ========================================
   * 頁面導航
   * ========================================
   */

  /**
   * 導航到指定路徑
   */
  async navigate(path: string, options: NavigationOptions = {}): Promise<void> {
    if (this.isNavigating && !options.force) {
      console.warn('Navigation in progress, skipping');
      return;
    }

    this.isNavigating = true;

    try {
      // 創建目標路由位置
      const to = this.createRouteLocation(path);
      const from = this.currentRoute || this.createRouteLocation('/');

      // 路由守衛檢查
      const guardResult = await this.runRouteGuards(to, from);
      if (!guardResult.allowed) {
        if (guardResult.redirect) {
          return this.navigate(guardResult.redirect, options);
        }
        throw new Error(
          guardResult.error || 'Navigation blocked by route guard'
        );
      }

      // 觸發離開事件
      if (this.currentRoute) {
        this.emit('router:beforeLeave', { from: this.currentRoute, to });
      }

      // 載入組件
      const component = await this.loadRouteComponent(to);

      // 頁面切換動畫
      await this.performPageTransition(from, to, component, options);

      // 更新瀏覽器歷史
      this.updateBrowserHistory(to, options);

      // 更新當前路由
      this.currentRoute = to;

      // 觸發導航完成事件
      this.emit('router:navigated', { from, to });

      // 執行後置守衛
      if (this.config.afterEach) {
        this.config.afterEach(to, from);
      }
    } catch (error) {
      this.emit('router:error', { error, path });
      throw error;
    } finally {
      this.isNavigating = false;
    }
  }

  /**
   * 創建路由位置對象
   */
  private createRouteLocation(path: string): RouteLocation {
    const [pathname, search, hash] = this.parsePath(path);
    const matchResult = this.matchRoute(pathname);

    return {
      path: pathname,
      params: matchResult?.params || {},
      query: this.parseQuery(search),
      hash: hash || '',
      fullPath: path,
    };
  }

  /**
   * 解析路徑
   */
  private parsePath(path: string): [string, string, string] {
    const hashIndex = path.indexOf('#');
    const queryIndex = path.indexOf('?');

    let pathname = path;
    let search = '';
    let hash = '';

    if (hashIndex >= 0) {
      hash = path.substring(hashIndex);
      pathname = path.substring(0, hashIndex);
    }

    if (queryIndex >= 0 && (hashIndex < 0 || queryIndex < hashIndex)) {
      search = pathname.substring(queryIndex);
      pathname = pathname.substring(0, queryIndex);
    }

    return [pathname, search, hash];
  }

  /**
   * 解析查詢參數
   */
  private parseQuery(search: string): RouteQuery {
    const query: RouteQuery = {};

    if (search && search.startsWith('?')) {
      const params = new URLSearchParams(search);
      for (const [key, value] of params) {
        if (key in query) {
          const existing = query[key];
          if (Array.isArray(existing)) {
            existing.push(value);
          } else {
            query[key] = [existing as string, value];
          }
        } else {
          query[key] = value;
        }
      }
    }

    return query;
  }

  /**
   * ========================================
   * 路由守衛功能
   * ========================================
   */

  /**
   * 執行路由守衛
   */
  private async runRouteGuards(
    to: RouteLocation,
    from: RouteLocation
  ): Promise<NavigationGuardResult> {
    try {
      // 全域前置守衛
      if (this.config.beforeEach) {
        const result = await this.executeGuard(
          this.config.beforeEach,
          to,
          from
        );
        if (typeof result === 'string') {
          return { allowed: false, redirect: result };
        }
        if (!result) {
          return {
            allowed: false,
            error: 'Blocked by global beforeEach guard',
          };
        }
      }

      // 路由級別守衛
      const matchResult = this.matchRoute(to.path);
      if (matchResult?.route.beforeEnter) {
        const result = await this.executeGuard(
          matchResult.route.beforeEnter,
          to,
          from
        );
        if (typeof result === 'string') {
          return { allowed: false, redirect: result };
        }
        if (!result) {
          return {
            allowed: false,
            error: 'Blocked by route beforeEnter guard',
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        error: `Route guard error: ${(error as Error).message}`,
      };
    }
  }

  /**
   * 執行單個守衛
   */
  private async executeGuard(
    guard: RouteGuard,
    to: RouteLocation,
    from: RouteLocation
  ): Promise<boolean | string> {
    try {
      const result = await guard(to, from);
      return result;
    } catch (error) {
      console.error('Route guard error:', error);
      return false;
    }
  }

  /**
   * ========================================
   * 組件載入
   * ========================================
   */

  /**
   * 載入路由組件
   */
  private async loadRouteComponent(
    route: RouteLocation
  ): Promise<BaseComponent | null> {
    const matchResult = this.matchRoute(route.path);
    if (!matchResult) {
      throw new Error(`No route found for path: ${route.path}`);
    }

    const routeConfig = matchResult.route;

    // 檢查重定向
    if (routeConfig.redirect) {
      throw new Error(`Route redirected to: ${routeConfig.redirect}`);
    }

    // 檢查組件
    if (!routeConfig.component) {
      return null; // 無組件路由
    }

    // 檢查快取
    const cacheKey = `${route.path}-${JSON.stringify(route.params)}`;
    if (this.componentCache.has(cacheKey)) {
      return this.componentCache.get(cacheKey)!;
    }

    try {
      // 載入組件
      let ComponentClass: typeof BaseComponent;

      if (typeof routeConfig.component === 'function') {
        // 懶載入
        this.emit('router:componentLoading', { route });
        ComponentClass = await routeConfig.component();
      } else {
        ComponentClass = routeConfig.component;
      }

      // 創建組件實例 - 這裡需要具體的組件實現類，不能直接實例化抽象類
      // 實際使用中，ComponentClass 應該是 BaseComponent 的具體實現
      const componentInstance = new (ComponentClass as any)(
        '#router-view',
        { ...route.params, ...route.query },
        {}
      );

      // 快取組件
      this.componentCache.set(cacheKey, componentInstance);

      this.emit('router:componentLoaded', {
        route,
        component: componentInstance,
      });

      return componentInstance;
    } catch (error) {
      this.emit('router:componentError', { route, error });
      throw new Error(
        `Failed to load component for route ${route.path}: ${(error as Error).message}`
      );
    }
  }

  /**
   * ========================================
   * 頁面切換動畫
   * ========================================
   */

  /**
   * 執行頁面過渡動畫
   */
  private async performPageTransition(
    from: RouteLocation,
    to: RouteLocation,
    component: BaseComponent | null,
    options: NavigationOptions
  ): Promise<void> {
    const containerSelector = this.config.container || '#router-view';
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) {
      throw new Error('Router view container not found');
    }

    const animation = options.animation || 'fade';
    const duration = options.animationDuration || 300;

    try {
      // 觸發切換開始事件
      this.emit('router:transitionStart', { from, to, animation });

      // 執行動畫
      switch (animation) {
        case 'slide':
          await this.slideTransition(container, component, duration);
          break;
        case 'zoom':
          await this.zoomTransition(container, component, duration);
          break;
        case 'fade':
          await this.fadeTransition(container, component, duration);
          break;
        default:
          // 無動畫
          await this.noTransition(container, component);
      }

      // 觸發切換完成事件
      this.emit('router:transitionEnd', { from, to, animation });
    } catch (error) {
      this.emit('router:transitionError', { from, to, error });
      // 降級為無動畫切換
      await this.noTransition(container, component);
    }
  }

  /**
   * 滑動切換動畫
   */
  private async slideTransition(
    container: HTMLElement,
    component: BaseComponent | null,
    duration: number
  ): Promise<void> {
    return new Promise(resolve => {
      // 淡出當前內容
      container.style.transform = 'translateX(-100%)';
      container.style.transition = `transform ${duration}ms ease-out`;

      setTimeout(() => {
        // 更新內容
        if (component) {
          container.innerHTML = '';
          component.init();
        }

        // 滑入新內容
        container.style.transform = 'translateX(100%)';

        requestAnimationFrame(() => {
          container.style.transform = 'translateX(0)';

          setTimeout(() => {
            container.style.transition = '';
            resolve();
          }, duration);
        });
      }, duration);
    });
  }

  /**
   * 縮放切換動畫
   */
  private async zoomTransition(
    container: HTMLElement,
    component: BaseComponent | null,
    duration: number
  ): Promise<void> {
    return new Promise(resolve => {
      container.style.transform = 'scale(0.8)';
      container.style.opacity = '0';
      container.style.transition = `all ${duration}ms ease-out`;

      setTimeout(() => {
        if (component) {
          container.innerHTML = '';
          component.init();
        }

        container.style.transform = 'scale(1)';
        container.style.opacity = '1';

        setTimeout(() => {
          container.style.transition = '';
          resolve();
        }, duration);
      }, duration / 2);
    });
  }

  /**
   * 淡入淡出動畫
   */
  private async fadeTransition(
    container: HTMLElement,
    component: BaseComponent | null,
    duration: number
  ): Promise<void> {
    return new Promise(resolve => {
      container.style.opacity = '0';
      container.style.transition = `opacity ${duration}ms ease-out`;

      setTimeout(() => {
        if (component) {
          container.innerHTML = '';
          component.init();
        }

        container.style.opacity = '1';

        setTimeout(() => {
          container.style.transition = '';
          resolve();
        }, duration);
      }, duration / 2);
    });
  }

  /**
   * 無動畫切換
   */
  private async noTransition(
    container: HTMLElement,
    component: BaseComponent | null
  ): Promise<void> {
    if (component) {
      container.innerHTML = '';
      await component.init();
    }
  }

  /**
   * ========================================
   * 瀏覽器歷史更新
   * ========================================
   */

  /**
   * 更新瀏覽器歷史
   */
  private updateBrowserHistory(
    route: RouteLocation,
    options: NavigationOptions
  ): void {
    const url = this.buildUrl(route.fullPath);
    const state = { routerPath: route.fullPath };

    if (options.replace) {
      window.history.replaceState(state, '', url);
    } else {
      window.history.pushState(state, '', url);
    }
  }

  /**
   * 建構 URL
   */
  private buildUrl(path: string): string {
    if (this.config.mode === 'hash') {
      return `${window.location.pathname}${window.location.search}#${path}`;
    } else {
      const base = this.config.base || '';
      return `${base}${path}`;
    }
  }

  /**
   * ========================================
   * 工具方法
   * ========================================
   */

  /**
   * 規範化路徑
   */
  private normalizePath(path: string): string {
    // 移除尾部斜線，但保留根路徑
    return path === '/' ? '/' : path.replace(/\/$/, '');
  }

  /**
   * 連接路徑
   */
  private joinPaths(parent: string, child: string): string {
    const cleanParent = parent.replace(/\/$/, '');
    const cleanChild = child.replace(/^\//, '');
    return cleanParent + '/' + cleanChild;
  }

  /**
   * 驗證路由配置
   */
  private validateRoute(route: RouteConfig): void {
    if (!route.path) {
      throw new Error('Route must have a path');
    }

    if (route.redirect && route.component) {
      throw new Error('Route cannot have both redirect and component');
    }
  }

  /**
   * ========================================
   * 公開 API
   * ========================================
   */

  /**
   * 前進導航
   */
  push(path: string, options?: NavigationOptions): Promise<void> {
    return this.navigate(path, { ...options, replace: false });
  }

  /**
   * 替換導航
   */
  replace(path: string, options?: NavigationOptions): Promise<void> {
    return this.navigate(path, { ...options, replace: true });
  }

  /**
   * 瀏覽器後退
   */
  back(): void {
    window.history.back();
  }

  /**
   * 瀏覽器前進
   */
  forward(): void {
    window.history.forward();
  }

  /**
   * 跳轉指定步數
   */
  go(delta: number): void {
    window.history.go(delta);
  }

  /**
   * 獲取當前路由
   */
  getCurrentRoute(): RouteLocation | null {
    return this.currentRoute;
  }

  /**
   * 獲取所有路由
   */
  getRoutes(): RouteConfig[] {
    return Array.from(this.routes.values());
  }

  /**
   * 清理資源
   */
  destroy(): void {
    window.removeEventListener('popstate', this.handlePopState.bind(this));
    window.removeEventListener('hashchange', this.handleHashChange.bind(this));

    this.componentCache.clear();
    this.routes.clear();
    this.removeAllListeners();
  }
}

/**
 * 全域路由實例
 */
export let router: Router | null = null;

/**
 * 創建路由器
 */
export function createRouter(config: RouterConfig = { mode: 'hash' }): Router {
  router = new Router(config);
  return router;
}

/**
 * 獲取路由器實例
 */
export function getRouter(): Router {
  if (!router) {
    throw new Error('Router not initialized. Call createRouter() first.');
  }
  return router;
}
