/**
 * PersonalProjectModal.js - 個人專案詳情模態框
 *
 * 功能特色：
 * - 遊戲王風格詳情展示
 * - 專案技術棧、圖片、連結展示
 * - 響應式設計
 * - 鍵盤導航支援
 * - 平滑進出動畫
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class PersonalProjectModal extends BaseComponent {
  constructor(config = {}) {
    super();

    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = { ...this.getInitialState() };

    // DOM 元素
    this.element = null;
    this.backdrop = null;
    this.modal = null;
    this.closeBtn = null;

    // 狀態
    this.isVisible = false;
    this.currentProject = null;

    // 動畫
    this.showAnimation = null;
    this.hideAnimation = null;

    console.log('📋 [PersonalProjectModal] 模態框初始化');
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      size: {
        maxWidth: '90vw',
        maxHeight: '90vh',
        minWidth: '320px',
      },
      animation: {
        duration: 0.4,
        backdropOpacity: 0.85,
      },
      zIndex: 10000,
      closeOnBackdrop: true,
      closeOnEscape: true,
    };
  }

  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      isAnimating: false,
    };
  }

  /**
   * 顯示模態框
   */
  async show(project) {
    if (this.isVisible || this.state.isAnimating) {
      return;
    }

    console.log(`📋 [PersonalProjectModal] 顯示專案詳情: ${project.title}`);

    this.currentProject = project;
    this.state.isAnimating = true;

    // 創建模態框（如果不存在）
    if (!this.element) {
      this.createElement();
    }

    // 更新內容
    this.updateContent(project);

    // 顯示模態框
    document.body.appendChild(this.element);
    this.bindEvents();

    // 播放顯示動畫
    await this.playShowAnimation();

    this.isVisible = true;
    this.state.isAnimating = false;

    // 設置焦點到關閉按鈕
    if (this.closeBtn) {
      this.closeBtn.focus();
    }
  }

  /**
   * 隱藏模態框
   */
  async hide() {
    if (!this.isVisible || this.state.isAnimating) {
      return;
    }

    console.log('📋 [PersonalProjectModal] 隱藏模態框');

    this.state.isAnimating = true;

    // 播放隱藏動畫
    await this.playHideAnimation();

    // 移除模態框
    this.unbindEvents();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.isVisible = false;
    this.state.isAnimating = false;
    this.currentProject = null;
  }

  /**
   * 創建 DOM 元素
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
    `;

    this.element.innerHTML = `
      <div style="
        width: 95vw;
        height: 90vh;
        background: linear-gradient(145deg, rgba(15, 15, 25, 0.98), rgba(25, 15, 35, 0.95));
        border-radius: 16px;
        border: 3px solid rgba(212, 175, 55, 0.6);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.15), transparent);
        ">
          <h2 style="
            margin: 0;
            color: #d4af37;
            font-size: 1.8rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.8rem;
          "></h2>
          <button style="
            background: transparent;
            border: 2px solid rgba(212, 175, 55, 0.6);
            color: #d4af37;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
          ">×</button>
        </div>
        
        <div style="
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        ">
          <div class="project-details">
            <!-- 內容將動態插入 -->
          </div>
        </div>
      </div>
    `;

    // 獲取子元素引用
    this.backdrop = this.element;
    this.modal = this.element.querySelector('div');
    this.closeBtn = this.element.querySelector('button');
    this.titleEl = this.element.querySelector('h2');
    this.contentEl = this.element.querySelector('.project-details');

    // 隱藏 webkit scrollbar
    const scrollableDiv = this.element.querySelector(
      'div[style*="overflow-y: auto"]'
    );
    scrollableDiv.style.setProperty('-webkit-scrollbar-width', '0');
    scrollableDiv.addEventListener('scroll', function () {
      this.style.setProperty('::-webkit-scrollbar', 'display: none');
    });

    const style = document.createElement('style');
    style.textContent = `
      div[style*="overflow-y: auto"]::-webkit-scrollbar {
        width: 0 !important;
        background: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 更新模態框內容
   */
  updateContent(project) {
    // 更新標題
    if (this.titleEl) {
      this.titleEl.innerHTML = `
        ${this.getRarityIcon(project.rarity)}
        ${project.title}
      `;
    }

    // 更新詳情內容
    if (this.contentEl) {
      this.contentEl.innerHTML = this.generateProjectDetails(project);

      // 初始化輪播功能
      this.initializeCarousel(project);

      // 應用響應式布局
      this.applyResponsiveLayout();
    }

    // 應用稀有度樣式
    this.applyRarityStyles(project);
  }

  /**
   * 生成專案詳情 HTML
   */
  generateProjectDetails(project) {
    return `
      <div style="width: 100%; color: white;">
        <!-- 圖片輪播區域 -->
        ${this.generateImageCarousel(project)}
        
        <div class="modal-info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;">
          <div style="background: rgba(255,255,255,0.08); padding: 2rem; border-radius: 12px; width: 100%; box-sizing: border-box; max-width: 100%; overflow: hidden;">
            <h4 style="color: #d4af37; font-size: 1.3rem; margin-bottom: 1.5rem;">基本資訊</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
              <span>類型：</span>
              <span>${this.getCategoryLabel(project.category)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
              <span>稀有度：</span>
              <span style="color: ${this.getRarityColor(project.rarity)};">
                ${this.getRarityIcon(project.rarity)} ${this.getRarityLabel(project.rarity)}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
              <span>狀態：</span>
              <span style="color: ${this.getStatusColor(project.status)};">
                ${this.getStatusLabel(project.status)}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>完成時間：</span>
              <span>${project.completedDate}</span>
            </div>
          </div>
          
          ${
            project.cardData
              ? `
            <div style="background: rgba(255,255,255,0.08); padding: 2rem; border-radius: 12px; width: 100%; box-sizing: border-box; max-width: 100%; overflow: hidden;">
              <h4 style="color: #4169e1; font-size: 1.3rem; margin-bottom: 1.5rem;">卡牌數據</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; padding: 0.8rem; background: rgba(0,0,0,0.3); border-radius: 6px;">
                  <span>ATK：</span>
                  <span style="color: #ff6b6b; font-weight: bold;">${project.cardData.attack || '???'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.8rem; background: rgba(0,0,0,0.3); border-radius: 6px;">
                  <span>DEF：</span>
                  <span style="color: #4ecdc4; font-weight: bold;">${project.cardData.defense || '???'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.8rem; background: rgba(0,0,0,0.3); border-radius: 6px;">
                  <span>Level：</span>
                  <span style="color: #ffd93d; font-weight: bold;">${project.cardData.level || '?'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.8rem; background: rgba(0,0,0,0.3); border-radius: 6px;">
                  <span>Type：</span>
                  <span style="font-size: 0.8rem;">${project.cardData.type || 'Unknown'}</span>
                </div>
              </div>
            </div>
          `
              : ''
          }
        </div>
        
        <div style="background: rgba(255,255,255,0.06); padding: 2.5rem; border-radius: 12px; margin-bottom: 3rem; width: 100%; box-sizing: border-box; max-width: 100%; overflow: hidden;">
          <h4 style="color: white; font-size: 1.3rem; margin-bottom: 1.5rem;">專案描述</h4>
          <p style="color: rgba(255,255,255,0.85); line-height: 1.8; font-size: 1.1rem;">${project.description}</p>
        </div>
        
        ${
          project.technologies && project.technologies.length > 0
            ? `
          <div style="margin-bottom: 3rem; width: 100%; box-sizing: border-box; max-width: 100%; overflow: hidden;">
            <h4 style="color: white; font-size: 1.3rem; margin-bottom: 1.5rem;">🔧 技術棧</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
              ${project.technologies
                .map(
                  tech => `
                <div style="background: ${this.getTechColor(tech)}; color: white; padding: 0.8rem 1.2rem; border-radius: 8px; text-align: center; font-weight: 500; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${this.getTechIcon(tech)} ${tech}</div>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
        
        ${
          project.links && Object.keys(project.links).length > 0
            ? `
          <div style="width: 100%; box-sizing: border-box; max-width: 100%; overflow: hidden;">
            <h4 style="color: white; font-size: 1.3rem; margin-bottom: 1.5rem;">🔗 相關連結</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
              ${Object.entries(project.links)
                .map(
                  ([type, url]) => `
                <a href="${url}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1.2rem 2rem; background: linear-gradient(135deg, rgba(22,33,62,0.8), rgba(26,26,46,0.8)); border: 2px solid rgba(212,175,55,0.4); border-radius: 12px; color: #d4af37; text-decoration: none; font-size: 1.1rem; font-weight: 600;">
                  ${this.getLinkIcon(type)} ${this.getLinkLabel(type)}
                </a>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * 轉換圖片路徑（處理 Vite 靜態資源）
   */
  resolveImagePath(path) {
    if (!path) return '';

    // 圖片已統一存放於 public/images/ 目錄
    // 路徑格式：/images/personal-projects/project-id/image.png
    // Vite 會自動處理 public/ 目錄下的靜態資源
    if (path.startsWith('/images/')) {
      return path;
    }

    // 如果是完整 URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return path;
  }

  /**
   * 生成圖片輪播 HTML
   */
  generateImageCarousel(project) {
    // 檢查是否有截圖
    const hasScreenshots =
      project.images?.screenshots && project.images.screenshots.length > 0;

    if (!hasScreenshots) {
      // 沒有圖片時顯示占位符
      return `
        <div style="
          width: 100%;
          height: 300px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 3rem;
          border: 2px dashed rgba(212,175,55,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1rem;
        ">
          <div style="
            font-size: 3rem;
            opacity: 0.6;
            color: #d4af37;
          ">📸</div>
          <div style="
            color: rgba(255,255,255,0.7);
            text-align: center;
            font-size: 1.1rem;
          ">暫無專案截圖<br><small style="opacity: 0.6;">(開發中的專案將在完成後補充)</small></div>
        </div>
      `;
    }

    // 有圖片時顯示輪播
    const screenshots = project.images.screenshots;
    const carouselId = `carousel-${project.id}`;

    return `
      <div class="image-carousel" id="${carouselId}" style="
        width: 100%;
        height: 400px;
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
        margin-bottom: 3rem;
        border: 2px solid rgba(212,175,55,0.4);
        position: relative;
        overflow: hidden;
      ">
        <!-- 輪播圖片容器 -->
        <div class="carousel-track" style="
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          transition: transform 0.5s ease-in-out;
        ">
          ${screenshots
            .map(
              (screenshot, index) => `
            <div class="carousel-slide" data-index="${index}" style="
              min-width: 100%;
              height: 100%;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0,0,0,0.5);
            ">
              <img
                src="${this.resolveImagePath(screenshot)}"
                alt="${project.title} 截圖 ${index + 1}"
                style="
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                  border-radius: 8px;
                "
                onerror="this.parentElement.innerHTML='<div style=\\'color: rgba(255,255,255,0.5); text-align: center;\\'><div style=\\'font-size: 3rem; margin-bottom: 1rem;\\'>🖼️</div><div>圖片載入失敗</div><small style=\\'opacity: 0.6; display: block; margin-top: 0.5rem;\\'>路徑: ${screenshot}</small></div>';"
              />
            </div>
          `
            )
            .join('')}
        </div>

        <!-- 上一張/下一張按鈕 -->
        ${
          screenshots.length > 1
            ? `
          <button class="carousel-btn carousel-prev" data-action="prev" style="
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(212,175,55,0.8);
            border: none;
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
          ">
            ‹
          </button>
          <button class="carousel-btn carousel-next" data-action="next" style="
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(212,175,55,0.8);
            border: none;
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
          ">
            ›
          </button>

          <!-- 指示器 -->
          <div class="carousel-indicators" style="
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
          ">
            ${screenshots
              .map(
                (_, index) => `
              <div class="carousel-indicator" data-index="${index}" style="
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${index === 0 ? 'rgba(212,175,55,1)' : 'rgba(255,255,255,0.4)'};
                cursor: pointer;
                transition: all 0.3s ease;
              "></div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        <!-- 圖片計數器 -->
        <div class="carousel-counter" style="
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.7);
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-size: 14px;
          z-index: 10;
        ">
          <span class="carousel-current">1</span> / ${screenshots.length}
        </div>
      </div>
    `;
  }

  /**
   * 初始化輪播功能
   */
  initializeCarousel(project) {
    const hasScreenshots =
      project.images?.screenshots && project.images.screenshots.length > 0;

    if (!hasScreenshots || project.images.screenshots.length <= 1) {
      return; // 沒有圖片或只有一張圖片，不需要輪播功能
    }

    const carouselId = `carousel-${project.id}`;
    const carousel = this.element.querySelector(`#${carouselId}`);

    if (!carousel) {
      console.warn(`[PersonalProjectModal] 找不到輪播元素: ${carouselId}`);
      return;
    }

    let currentIndex = 0;
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const counter = carousel.querySelector('.carousel-current');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    // 更新輪播位置
    const updateCarousel = index => {
      currentIndex = Math.max(0, Math.min(index, slides.length - 1));
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // 更新指示器
      indicators.forEach((indicator, i) => {
        indicator.style.background =
          i === currentIndex ? 'rgba(212,175,55,1)' : 'rgba(255,255,255,0.4)';
      });

      // 更新計數器
      if (counter) {
        counter.textContent = currentIndex + 1;
      }
    };

    // 上一張
    const goPrev = () => {
      updateCarousel(currentIndex - 1);
    };

    // 下一張
    const goNext = () => {
      updateCarousel(currentIndex + 1);
    };

    // 跳轉到指定張
    const goTo = index => {
      updateCarousel(index);
    };

    // 綁定按鈕事件
    if (prevBtn) {
      prevBtn.addEventListener('click', e => {
        e.stopPropagation(); // 阻止事件冒泡
        goPrev();
      });

      // Hover 效果
      prevBtn.addEventListener('mouseenter', () => {
        prevBtn.style.background = 'rgba(212,175,55,1)';
        prevBtn.style.transform = 'translateY(-50%) scale(1.1)';
      });
      prevBtn.addEventListener('mouseleave', () => {
        prevBtn.style.background = 'rgba(212,175,55,0.8)';
        prevBtn.style.transform = 'translateY(-50%) scale(1)';
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', e => {
        e.stopPropagation(); // 阻止事件冒泡
        goNext();
      });

      // Hover 效果
      nextBtn.addEventListener('mouseenter', () => {
        nextBtn.style.background = 'rgba(212,175,55,1)';
        nextBtn.style.transform = 'translateY(-50%) scale(1.1)';
      });
      nextBtn.addEventListener('mouseleave', () => {
        nextBtn.style.background = 'rgba(212,175,55,0.8)';
        nextBtn.style.transform = 'translateY(-50%) scale(1)';
      });
    }

    // 綁定指示器事件
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', e => {
        e.stopPropagation(); // 阻止事件冒泡
        goTo(index);
      });

      // Hover 效果
      indicator.addEventListener('mouseenter', () => {
        if (index !== currentIndex) {
          indicator.style.background = 'rgba(255,255,255,0.7)';
        }
      });
      indicator.addEventListener('mouseleave', () => {
        if (index !== currentIndex) {
          indicator.style.background = 'rgba(255,255,255,0.4)';
        }
      });
    });

    // 鍵盤導航（只在模態框可見時生效）
    this.carouselKeyHandler = e => {
      if (!this.isVisible || !carousel.offsetParent) return;

      if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    };
    document.addEventListener('keydown', this.carouselKeyHandler);

    console.log(`✅ [PersonalProjectModal] 輪播初始化完成: ${carouselId}`);
  }

  /**
   * 應用響應式布局
   */
  applyResponsiveLayout() {
    console.log(
      '🔧 [PersonalProjectModal] 應用響應式布局，視窗寬度:',
      window.innerWidth
    );

    const infoGrid = this.element.querySelector('.modal-info-grid');
    const contentContainer = this.element.querySelector(
      'div[style*="padding: 30px"]'
    );

    console.log('📱 [PersonalProjectModal] 找到元素:', {
      infoGrid: !!infoGrid,
      contentContainer: !!contentContainer,
    });

    if (infoGrid) {
      const isMobile = window.innerWidth <= 768;
      console.log('📱 [PersonalProjectModal] 是手機版:', isMobile);

      infoGrid.style.gridTemplateColumns = isMobile ? '1fr' : '1fr 1fr';
      infoGrid.style.gap = isMobile ? '1.5rem' : '2rem';

      // 手機版對齊修復
      if (isMobile) {
        infoGrid.style.justifyItems = 'stretch';
        infoGrid.style.alignItems = 'start';
        infoGrid.style.width = '100%';
        infoGrid.style.maxWidth = '100%';
        console.log('✅ [PersonalProjectModal] 已應用手機版布局');
      } else {
        infoGrid.style.justifyItems = 'stretch';
        infoGrid.style.alignItems = 'start';
      }
    }

    // 調整內容容器的 padding
    if (contentContainer) {
      const isMobile = window.innerWidth <= 768;
      contentContainer.style.padding = isMobile ? '20px' : '30px';
      console.log(
        '✅ [PersonalProjectModal] 已調整內容 padding:',
        isMobile ? '20px' : '30px'
      );
    }
  }

  /**
   * 應用稀有度樣式
   */
  applyRarityStyles(project) {
    if (this.modal && project.rarity) {
      // 清除舊的稀有度類名
      this.modal.classList.remove('common', 'rare', 'epic', 'legendary');

      // 添加新的稀有度類名
      this.modal.classList.add(project.rarity);
    }
  }

  /**
   * 播放顯示動畫
   */
  async playShowAnimation() {
    return new Promise(resolve => {
      this.showAnimation = gsap.timeline({
        onComplete: resolve,
      });

      // 背景淡入
      this.showAnimation.fromTo(
        this.element,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: this.config.animation.duration * 0.5,
          ease: 'power2.out',
        }
      );

      // 模態框縮放進入
      this.showAnimation.fromTo(
        this.modal,
        {
          scale: 0.8,
          y: 50,
        },
        {
          scale: 1,
          y: 0,
          duration: this.config.animation.duration,
          ease: 'back.out(1.7)',
        },
        this.config.animation.duration * 0.2
      );

      // 內容淡入
      const content = this.element.querySelector('.modal-content');
      if (content) {
        this.showAnimation.fromTo(
          content,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: this.config.animation.duration * 0.8,
            ease: 'power2.out',
          },
          this.config.animation.duration * 0.4
        );
      }
    });
  }

  /**
   * 播放隱藏動畫
   */
  async playHideAnimation() {
    return new Promise(resolve => {
      this.hideAnimation = gsap.timeline({
        onComplete: resolve,
      });

      // 模態框縮放退出
      this.hideAnimation.to(this.modal, {
        scale: 0.8,
        y: -50,
        duration: this.config.animation.duration * 0.6,
        ease: 'back.in(1.7)',
      });

      // 背景淡出
      this.hideAnimation.to(
        this.element,
        {
          opacity: 0,
          duration: this.config.animation.duration * 0.6,
          ease: 'power2.in',
        },
        this.config.animation.duration * 0.2
      );
    });
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    // 關閉按鈕
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.hide());
    }

    // 背景點擊關閉（只有點擊背景本身才關閉，避免事件冒泡導致誤關閉）
    if (this.config.closeOnBackdrop && this.backdrop) {
      this.backdropClickHandler = e => {
        // 只有當點擊的是背景元素本身（不是模態框內容）時才關閉
        if (e.target === this.backdrop) {
          this.hide();
        }
      };
      this.backdrop.addEventListener('click', this.backdropClickHandler);
    }

    // ESC 鍵關閉
    if (this.config.closeOnEscape) {
      this.escHandler = e => {
        if (e.key === 'Escape') {
          this.hide();
        }
      };
      document.addEventListener('keydown', this.escHandler);
    }

    // 窗口大小改變時重新應用響應式布局
    this.resizeHandler = () => {
      this.applyResponsiveLayout();
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  /**
   * 解綁事件
   */
  unbindEvents() {
    if (this.escHandler) {
      document.removeEventListener('keydown', this.escHandler);
      this.escHandler = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.backdropClickHandler && this.backdrop) {
      this.backdrop.removeEventListener('click', this.backdropClickHandler);
      this.backdropClickHandler = null;
    }

    if (this.carouselKeyHandler) {
      document.removeEventListener('keydown', this.carouselKeyHandler);
      this.carouselKeyHandler = null;
    }
  }

  // 輔助方法
  getRarityIcon(rarity) {
    const icons = {
      normal: '⚪',
      rare: '🔸',
      superRare: '💎',
      legendary: '⭐',
    };
    return icons[rarity] || icons.normal;
  }

  getRarityLabel(rarity) {
    const labels = {
      normal: '普通',
      rare: '稀有',
      superRare: '超稀有',
      legendary: '傳說',
    };
    return labels[rarity] || labels.normal;
  }

  getRarityColor(rarity) {
    const colors = {
      normal: '#8e8e8e',
      rare: '#4169e1',
      superRare: '#9400d3',
      legendary: '#ffd700',
    };
    return colors[rarity] || colors.normal;
  }

  getCategoryLabel(category) {
    const labels = {
      frontend: '前端',
      backend: '後端',
      fullstack: '全端',
      mobile: '移動端',
      ai: 'AI/ML',
      blockchain: '區塊鏈',
    };
    return labels[category] || '通用';
  }

  getStatusLabel(status) {
    const labels = {
      completed: '已完成',
      inProgress: '進行中',
      archived: '已封存',
    };
    return labels[status] || status;
  }

  getStatusColor(status) {
    const colors = {
      completed: '#4ecdc4',
      inProgress: '#ffd93d',
      archived: '#8e8e8e',
    };
    return colors[status] || '#ffffff';
  }

  getLinkIcon(type) {
    const icons = {
      demo: '🚀',
      github: '🐙',
      article: '📝',
      store: '🏪',
      website: '🌐',
    };
    return icons[type] || '🔗';
  }

  getLinkLabel(type) {
    const labels = {
      demo: 'Demo',
      github: 'GitHub',
      article: '文章',
      store: 'App Store',
      website: '網站',
    };
    return labels[type] || type;
  }

  getTechColor(tech) {
    const techName = tech.toLowerCase();

    // 語言類別
    if (techName.includes('javascript') || techName.includes('js'))
      return 'linear-gradient(135deg, #f7df1e, #e6c200)';
    if (techName.includes('typescript') || techName.includes('ts'))
      return 'linear-gradient(135deg, #3178c6, #235bb7)';
    if (techName.includes('python'))
      return 'linear-gradient(135deg, #3776ab, #306998)';
    if (techName.includes('java'))
      return 'linear-gradient(135deg, #ed8b00, #c97400)';
    if (techName.includes('html'))
      return 'linear-gradient(135deg, #e34f26, #c4372d)';
    if (techName.includes('css'))
      return 'linear-gradient(135deg, #1572b6, #0f5a8c)';

    // 框架類別
    if (techName.includes('react'))
      return 'linear-gradient(135deg, #61dafb, #21a9c7)';
    if (techName.includes('vue'))
      return 'linear-gradient(135deg, #4fc08d, #349268)';
    if (techName.includes('angular'))
      return 'linear-gradient(135deg, #dd0031, #b8002a)';
    if (techName.includes('node'))
      return 'linear-gradient(135deg, #339933, #2b7d2b)';
    if (techName.includes('express'))
      return 'linear-gradient(135deg, #404040, #333333)';

    // 工具類別
    if (techName.includes('vite'))
      return 'linear-gradient(135deg, #646cff, #535bf2)';
    if (techName.includes('webpack'))
      return 'linear-gradient(135deg, #8dd6f9, #1c78c0)';
    if (techName.includes('docker'))
      return 'linear-gradient(135deg, #2496ed, #1975c1)';
    if (techName.includes('git'))
      return 'linear-gradient(135deg, #f05032, #d63319)';

    // 動畫/設計類別
    if (techName.includes('gsap'))
      return 'linear-gradient(135deg, #88ce02, #6ba000)';
    if (techName.includes('three'))
      return 'linear-gradient(135deg, #049ef4, #026db3)';
    if (techName.includes('canvas'))
      return 'linear-gradient(135deg, #ff6b6b, #e55555)';

    // API類別
    if (techName.includes('api'))
      return 'linear-gradient(135deg, #ff9500, #e6850e)';
    if (techName.includes('audio'))
      return 'linear-gradient(135deg, #9d4edd, #7209b7)';
    if (techName.includes('web'))
      return 'linear-gradient(135deg, #6366f1, #4f46e5)';

    // 預設顏色
    return 'linear-gradient(135deg, #6366f1, #4f46e5)';
  }

  getTechIcon(tech) {
    const techName = tech.toLowerCase();

    // 語言圖示
    if (techName.includes('javascript') || techName.includes('js')) return '⚡';
    if (techName.includes('typescript') || techName.includes('ts')) return '🔷';
    if (techName.includes('python')) return '🐍';
    if (techName.includes('java')) return '☕';
    if (techName.includes('html')) return '📄';
    if (techName.includes('css')) return '🎨';

    // 框架圖示
    if (techName.includes('react')) return '⚛️';
    if (techName.includes('vue')) return '💚';
    if (techName.includes('angular')) return '🅰️';
    if (techName.includes('node')) return '🚀';
    if (techName.includes('express')) return '🛤️';

    // 工具圖示
    if (techName.includes('vite')) return '⚡';
    if (techName.includes('webpack')) return '📦';
    if (techName.includes('docker')) return '🐳';
    if (techName.includes('git')) return '📝';

    // 動畫/設計圖示
    if (techName.includes('gsap')) return '✨';
    if (techName.includes('three')) return '🎮';
    if (techName.includes('canvas')) return '🎭';

    // API圖示
    if (techName.includes('api')) return '🔌';
    if (techName.includes('audio')) return '🔊';
    if (techName.includes('web')) return '🌐';

    // 預設圖示
    return '⚙️';
  }

  /**
   * 銷毀組件
   */
  destroy() {
    console.log('🗑️ [PersonalProjectModal] 銷毀模態框');

    // 停止動畫
    if (this.showAnimation) {
      this.showAnimation.kill();
    }
    if (this.hideAnimation) {
      this.hideAnimation.kill();
    }

    // 解綁事件
    this.unbindEvents();

    // 移除 DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    super.destroy();
  }
}
