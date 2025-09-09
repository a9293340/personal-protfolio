/**
 * Hero 區域組件
 * Step 3.1.3a: 建立 Hero 組件結構
 * 使用 Config-Driven 架構從配置檔載入數據
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';
import { getHeroConfig } from '../../config/data/hero.data.js';

export class Hero extends BaseComponent {
  constructor(options = {}) {
    super(options);
    
    // Hero 狀態
    this.state = {
      isTypingActive: false,
      currentTextIndex: 0,
      isAnimationComplete: false
    };
  }
  
  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    // 從配置檔載入數據
    const heroConfig = getHeroConfig();
    
    // 返回配置 (可以在這裡覆蓋或調整)
    return {
      ...heroConfig,
      // 這裡可以加入組件特定的默認值，如果需要的話
    };
  }
  
  /**
   * 渲染 Hero HTML
   */
  async render() {
    const config = this.mergeConfig();
    
    return `
      <section class="hero-section" id="hero-section">
        <div class="hero-container">
          
          <!-- 個人介紹區域 -->
          <div class="hero-content">
            
            <!-- 主標題區 -->
            <div class="hero-main">
              <h1 class="hero-title">
                <span class="title-greeting">👋 Hello, I'm</span>
                <span class="title-name">${config.name}</span>
                <span class="title-role">${config.title}</span>
              </h1>
              
              <!-- 動態打字機效果區域 -->
              <div class="hero-typing">
                <span class="typing-text" id="typing-text">${config.subtitle}</span>
                <span class="typing-cursor" id="typing-cursor">|</span>
              </div>
            </div>
            
            <!-- CTA 按鈕組 -->
            <div class="hero-actions">
              ${config.ctaButtons.map(button => `
                <button class="cta-button ${button.primary ? 'primary' : 'secondary'}" 
                        data-action="${button.action}">
                  <span class="button-icon">${button.icon}</span>
                  <span class="button-text">${button.text}</span>
                </button>
              `).join('')}
            </div>
            
          </div>
          
          <!-- 背景裝飾元素 -->
          <div class="hero-decorations">
            <div class="decoration-grid"></div>
            <div class="decoration-particles"></div>
          </div>
          
        </div>
      </section>
    `;
  }
  
  /**
   * 初始化組件
   */
  async init() {
    await super.init();
    
    // 綁定 CTA 按鈕事件
    this.bindCTAEvents();
    
    // 啟動打字機效果
    this.startTypingEffect();
    
    console.log('🦸 Hero component initialized');
  }
  
  /**
   * 綁定 CTA 按鈕事件
   */
  bindCTAEvents() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        this.handleCTAClick(action);
      });
    });
  }
  
  /**
   * 處理 CTA 按鈕點擊
   */
  handleCTAClick(action) {
    // 發送路由事件
    window.location.hash = `#/${action}`;
    console.log(`🎯 Navigating to: ${action}`);
  }
  
  /**
   * 啟動增強版打字機效果
   */
  startTypingEffect() {
    const config = this.mergeConfig();
    const typingTextElement = document.getElementById('typing-text');
    
    if (!typingTextElement) {
      console.warn('⚠️ Typing text element not found');
      return;
    }
    
    let currentGroupIndex = 0;
    let currentSentenceIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let isBackspacing = false;
    let backspaceCount = 0;
    let hasBackspacedThisSentence = false; // 每句話只能回刪一次
    
    const processText = (rawText) => {
      // 檢查文字是否存在，避免錯誤
      if (!rawText || typeof rawText !== 'string') {
        console.warn('⚠️ Invalid text provided to processText:', rawText);
        return '';
      }
      // 處理高亮標籤，將 <highlight>text</highlight> 轉換為帶樣式的 HTML
      return rawText.replace(/<highlight>(.*?)<\/highlight>/g, 
        '<span class="highlight-text">$1</span>'
      );
    };
    
    const typeText = () => {
      const currentGroup = config.typingTexts[currentGroupIndex];
      
      // 安全檢查：確保當前組和句子存在
      if (!currentGroup || !currentGroup.sentences || currentSentenceIndex >= currentGroup.sentences.length) {
        console.warn('⚠️ Invalid text group or sentence at:', currentGroupIndex, currentSentenceIndex);
        // 重置到下一組的開始
        currentGroupIndex = (currentGroupIndex + 1) % config.typingTexts.length;
        currentSentenceIndex = 0;
        currentCharIndex = 0;
        hasBackspacedThisSentence = false;
        this.typingTimeout = setTimeout(typeText, config.animations.loopDelay);
        return;
      }
      
      const currentSentence = currentGroup.sentences[currentSentenceIndex];
      const currentSpeed = currentGroup.speeds[currentSentenceIndex] || 100;
      const processedText = processText(currentSentence);
      
      if (isBackspacing) {
        // 回刪效果
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedText;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        if (backspaceCount > 0) {
          const truncatedText = plainText.substring(0, plainText.length - backspaceCount);
          const truncatedHTML = processText(currentSentence).substring(0, truncatedText.length);
          typingTextElement.innerHTML = truncatedHTML;
          backspaceCount--;
          this.typingTimeout = setTimeout(typeText, config.animations.deleteSpeed);
        } else {
          isBackspacing = false;
          // 繼續從當前位置打字
          this.typingTimeout = setTimeout(typeText, currentSpeed);
        }
        return;
      }
      
      if (!isDeleting) {
        // 打字階段
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedText;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        if (currentCharIndex <= plainText.length) {
          // 逐字顯示，保持 HTML 格式
          let displayText = '';
          let htmlIndex = 0;
          let charCount = 0;
          
          while (htmlIndex < processedText.length && charCount < currentCharIndex) {
            if (processedText[htmlIndex] === '<') {
              // 找到完整的HTML標籤
              const tagEnd = processedText.indexOf('>', htmlIndex);
              displayText += processedText.substring(htmlIndex, tagEnd + 1);
              htmlIndex = tagEnd + 1;
            } else {
              displayText += processedText[htmlIndex];
              htmlIndex++;
              charCount++;
            }
          }
          
          typingTextElement.innerHTML = displayText;
          currentCharIndex++;
          
          // 隨機觸發回刪效果 (每句話最多一次)
          if (!hasBackspacedThisSentence && currentCharIndex > 3 && currentCharIndex < plainText.length - 3) {
            if (Math.random() < config.animations.backspaceProbability) {
              isBackspacing = true;
              hasBackspacedThisSentence = true; // 標記已經回刪過
              backspaceCount = Math.floor(Math.random() * config.animations.backspaceCount) + 1;
              this.typingTimeout = setTimeout(typeText, currentSpeed * 2);
              return;
            }
          }
          
          this.typingTimeout = setTimeout(typeText, currentSpeed);
        } else {
          // 當前句子打完，檢查是否還有下一句
          if (currentSentenceIndex + 1 < currentGroup.sentences.length) {
            // 還有下一句，切換到下一句
            currentSentenceIndex++;
            currentCharIndex = 0;
            hasBackspacedThisSentence = false; // 重置回刪標記
            this.typingTimeout = setTimeout(typeText, config.animations.sentencePause);
          } else {
            // 當前組的所有句子都打完，暫停後開始淡出刪除
            this.typingTimeout = setTimeout(() => {
              isDeleting = true;
              typingTextElement.style.transition = `opacity ${config.animations.fadeOutDuration}ms ease`;
              typingTextElement.style.opacity = '0.3';
              setTimeout(typeText, config.animations.fadeOutDuration);
            }, config.animations.groupPause);
          }
        }
      } else {
        // 刪除階段 (快速清空)
        typingTextElement.innerHTML = '';
        typingTextElement.style.opacity = '1';
        typingTextElement.style.transition = 'none';
        
        // 重置狀態，切換到下一組
        isDeleting = false;
        currentSentenceIndex = 0;
        currentCharIndex = 0;
        hasBackspacedThisSentence = false; // 重置回刪標記
        currentGroupIndex = (currentGroupIndex + 1) % config.typingTexts.length;
        
        // 延遲後開始下一組
        this.typingTimeout = setTimeout(typeText, config.animations.loopDelay);
      }
    };
    
    // 開始打字效果
    typeText();
    
    console.log('⌨️ Enhanced typing effect started');
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    // 清理打字機動畫定時器
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
    
    super.destroy();
    console.log('🦸 Hero component destroyed');
  }
}