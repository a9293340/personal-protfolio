/**
 * 3D 卡片翻轉動畫系統 - Web Component 版本
 * 使用 flip-card-wc 專業套件
 */

class Card3DSystemWC {
  constructor() {
    this.cards = new Map();
    this.cardCount = 0;
    this.initialize();
  }
  
  initialize() {
    console.log('初始化 3D 卡片系統 - Web Component 版本...');
    
    this.generateRarityDemo();
    this.generateProjectDemo();
    this.initializeEventListeners();
    
    console.log('Web Component 版本初始化完成');
  }
  
  generateRarityDemo() {
    const container = document.getElementById('rarityDemo');
    const { RARITY_DEMO_CARDS } = window.CARD_CONFIG;
    
    container.innerHTML = ''; // 清空容器
    
    RARITY_DEMO_CARDS.forEach(cardData => {
      const cardElement = this.createCard(cardData);
      container.appendChild(cardElement);
    });
    
    console.log(`生成 ${RARITY_DEMO_CARDS.length} 張稀有度展示卡片`);
  }
  
  generateProjectDemo() {
    const container = document.getElementById('projectDemo');
    const { PROJECT_CARDS } = window.CARD_CONFIG;
    
    container.innerHTML = ''; // 清空容器
    
    PROJECT_CARDS.forEach(cardData => {
      const cardElement = this.createCard(cardData);
      container.appendChild(cardElement);
    });
    
    console.log(`生成 ${PROJECT_CARDS.length} 張專案展示卡片`);
  }
  
  createCard(cardData) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    
    // 創建 flip-card Web Component
    const flipCard = document.createElement('flip-card');
    flipCard.id = cardData.id;
    flipCard.className = `card card-${cardData.rarity}`;
    flipCard.setAttribute('variant', 'hover'); // 設置懸停翻轉模式
    
    // 設置 CSS 變數來控制卡片樣式
    flipCard.style.setProperty('--flip-card-height', '200px');
    flipCard.style.setProperty('--flip-card-transition-duration', '600ms');
    flipCard.style.setProperty('--flip-card-border-radius', '15px');
    flipCard.style.setProperty('--flip-card-box-shadow', '0 8px 32px rgba(0,0,0,0.3)');
    
    // 設置背景色為透明，移除白色背景
    flipCard.style.setProperty('--flip-card-background-color-front', 'transparent');
    flipCard.style.setProperty('--flip-card-background-color-back', 'transparent');
    
    // 強制固定高度，防止內容變化時高度跳動
    flipCard.style.height = '200px';
    flipCard.style.minHeight = '200px';
    flipCard.style.maxHeight = '200px';
    
    // 創建正面內容
    const frontContent = document.createElement('div');
    frontContent.setAttribute('slot', 'front');
    frontContent.innerHTML = this.createFrontContent(cardData);
    
    // 創建背面內容
    const backContent = document.createElement('div');
    backContent.setAttribute('slot', 'back');
    backContent.innerHTML = this.createBackContent(cardData);
    
    // 將內容添加到 flip-card
    flipCard.appendChild(frontContent);
    flipCard.appendChild(backContent);
    
    cardContainer.appendChild(flipCard);
    
    // 添加點擊事件監聽 - 打開模態框
    this.addClickListeners(flipCard, cardData);
    
    // 添加霧感邊框效果的事件監聽
    this.addGlowEffectListeners(flipCard, cardContainer, cardData.rarity);
    
    // 等待 Web Component 初始化後修改內部樣式
    setTimeout(() => {
      this.fixWebComponentBackground(flipCard);
    }, 100);
    
    // 註冊卡片實例
    this.cards.set(cardData.id, {
      element: flipCard,
      container: cardContainer,
      data: cardData,
      isFlipped: false
    });
    
    this.cardCount++;
    
    console.log(`卡片 ${cardData.id} Web Component 創建完成`);
    
    return cardContainer;
  }
  
  // 添加點擊事件監聽器 - 打開模態框
  addClickListeners(flipCard, cardData) {
    flipCard.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(`點擊卡片 ${cardData.id}，打開模態框`);
      this.openModal(cardData);
    });
    
    console.log(`卡片 ${cardData.id} 點擊監聽器設置完成`);
  }
  
  // 添加霧感邊框效果監聽器
  addGlowEffectListeners(flipCard, cardContainer, rarity) {
    // 只對稀有、超稀有、傳說卡片添加效果
    if (!['rare', 'epic', 'legendary'].includes(rarity)) {
      return;
    }
    
    flipCard.addEventListener('mouseenter', () => {
      cardContainer.classList.add(`glow-${rarity}`);
      console.log(`添加 ${rarity} 霧感效果`);
    });
    
    flipCard.addEventListener('mouseleave', () => {
      cardContainer.classList.remove(`glow-${rarity}`);
      console.log(`移除 ${rarity} 霧感效果`);
    });
    
    console.log(`${rarity} 卡片霧感效果監聽器設置完成`);
  }
  
  // 修復 Web Component 內部的白色背景
  fixWebComponentBackground(flipCard) {
    try {
      const shadowRoot = flipCard.shadowRoot;
      if (shadowRoot) {
        // 查找並修改內部的背景樣式
        const flipCardDiv = shadowRoot.querySelector('.flip-card');
        const frontSide = shadowRoot.querySelector('.flip-card__side--front');
        const backSide = shadowRoot.querySelector('.flip-card__side--back');
        
        if (flipCardDiv) {
          flipCardDiv.style.background = 'transparent';
        }
        if (frontSide) {
          frontSide.style.backgroundColor = 'transparent';
        }
        if (backSide) {
          backSide.style.backgroundColor = 'transparent';
        }
        
        // 添加覆蓋樣式
        const style = document.createElement('style');
        style.textContent = `
          .flip-card {
            height: 200px !important;
            min-height: 200px !important;
            max-height: 200px !important;
            overflow: visible !important;
            z-index: 0 !important;
          }
          .flip-card__side--front,
          .flip-card__side--back {
            background-color: transparent !important;
            height: 200px !important;
            min-height: 200px !important;
            max-height: 200px !important;
            overflow: visible !important;
            z-index: 0 !important;
          }
          .flip-card__side--front > div,
          .flip-card__side--back > div {
            background: transparent !important;
            height: 100%;
            overflow: visible !important;
            z-index: 0 !important;
          }
        `;
        shadowRoot.appendChild(style);
        
        console.log('Web Component 背景修復完成');
      }
    } catch (error) {
      console.warn('無法修改 Web Component 內部樣式:', error);
    }
  }
  
  createFrontContent(cardData) {
    return `
      <div class="card-face card-front">
        <div class="card-header">
          <div class="card-icon">${cardData.icon}</div>
          <div>
            <div class="card-title">${cardData.title}</div>
            <div class="card-subtitle">${cardData.subtitle}</div>
          </div>
        </div>
        <div class="card-body">
          <div class="tech-tags">
            ${cardData.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
          </div>
        </div>
        <div class="card-footer">
          <div class="card-stats">
            ${cardData.stats.map(stat => `
              <div class="stat">
                <span class="stat-icon">${stat.icon}</span>
                <span>${stat.label}: ${stat.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  createBackContent(cardData) {
    const rarityConfig = window.CARD_CONFIG.RARITY_CONFIG[cardData.rarity];
    
    return `
      <div class="card-face card-back">
        <div class="card-header">
          <div class="card-icon">🔍</div>
          <div>
            <div class="card-title">詳細資訊</div>
            <div class="card-subtitle" style="color: ${rarityConfig.color};">
              ${rarityConfig.name}稀有度
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-description">
            ${cardData.description}
          </div>
        </div>
        <div class="card-footer">
          <div class="card-stats">
            <div class="stat">
              <span class="stat-icon">✨</span>
              <span>稀有度: ${rarityConfig.name}</span>
            </div>
            <div class="stat">
              <span class="stat-icon">🎯</span>
              <span>機率: ${(rarityConfig.probability * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  flipCard(cardId) {
    const cardInstance = this.cards.get(cardId);
    if (!cardInstance) {
      console.error(`找不到卡片: ${cardId}`);
      return;
    }
    
    const { element, isFlipped } = cardInstance;
    
    console.log(`程式控制翻轉卡片 ${cardId}，當前狀態: ${isFlipped ? '背面' : '正面'}`);
    
    // 對於懸停模式，我們需要模擬懸停事件
    if (isFlipped) {
      // 移除懸停狀態
      element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      cardInstance.isFlipped = false;
    } else {
      // 觸發懸停狀態
      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      cardInstance.isFlipped = true;
    }
    
    // 觸發性能監控
    if (window.performanceMonitor) {
      window.performanceMonitor.recordFlipAnimation();
    }
  }
  
  flipAllCards() {
    console.log('翻轉所有卡片...');
    
    let delay = 0;
    this.cards.forEach((cardInstance, cardId) => {
      setTimeout(() => {
        this.flipCard(cardId);
      }, delay);
      delay += 100;
    });
  }
  
  addStressTestCards(count = 10) {
    if (this.cardCount + count > 100) {
      console.warn(`卡片數量將超過限制，調整數量`);
      count = 100 - this.cardCount;
    }
    
    const container = document.getElementById('stressTestDemo');
    const { generateStressTestCards } = window.CARD_CONFIG;
    
    const newCards = generateStressTestCards(count);
    
    newCards.forEach(cardData => {
      const cardElement = this.createCard(cardData);
      container.appendChild(cardElement);
    });
    
    console.log(`增加 ${count} 張壓力測試卡片，總數: ${this.cardCount}`);
    
    if (window.performanceMonitor) {
      window.performanceMonitor.updateCardCount(this.cardCount);
    }
  }
  
  removeCards(count = 10) {
    const container = document.getElementById('stressTestDemo');
    const stressCards = container.children;
    
    const removeCount = Math.min(count, stressCards.length);
    
    for (let i = 0; i < removeCount; i++) {
      const cardContainer = stressCards[stressCards.length - 1];
      const flipCard = cardContainer.querySelector('flip-card');
      const cardId = flipCard.id;
      
      this.cards.delete(cardId);
      this.cardCount--;
      
      container.removeChild(cardContainer);
    }
    
    console.log(`移除 ${removeCount} 張卡片，剩餘: ${this.cardCount}`);
    
    if (window.performanceMonitor) {
      window.performanceMonitor.updateCardCount(this.cardCount);
    }
  }
  
  runStressTest() {
    console.log('開始壓力測試...');
    
    const container = document.getElementById('stressTestDemo');
    container.innerHTML = '';
    
    // 清理壓力測試卡片記錄
    this.cards.forEach((cardInstance, cardId) => {
      if (cardId.startsWith('stress-')) {
        this.cards.delete(cardId);
        this.cardCount--;
      }
    });
    
    this.addStressTestCards(30);
    
    setTimeout(() => {
      this.flipAllCards();
    }, 1000);
    
    setTimeout(() => {
      let flipCount = 0;
      const flipInterval = setInterval(() => {
        this.flipAllCards();
        flipCount++;
        
        if (flipCount >= 3) {
          clearInterval(flipInterval);
          console.log('壓力測試完成');
        }
      }, 2000);
    }, 3000);
  }
  
  initializeEventListeners() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          this.flipAllCards();
          break;
        case 't':
        case 'T':
          this.runStressTest();
          break;
        case 'Escape':
          this.closeModal();
          break;
      }
    });
    
    // 初始化模態框事件監聽器
    this.initializeModalListeners();
    
    console.log('全域事件監聽器初始化完成');
    console.log('快捷鍵: 空格鍵 = 翻轉所有卡片, T = 壓力測試, Escape = 關閉模態框');
  }
  
  // 初始化模態框事件監聽器
  initializeModalListeners() {
    const modal = document.getElementById('cardModal');
    const closeBtn = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
    
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          this.closeModal();
        }
      });
    }
    
    console.log('模態框事件監聽器初始化完成');
  }
  
  // 打開模態框並填入卡片數據
  openModal(cardData) {
    const modal = document.getElementById('cardModal');
    const rarityConfig = window.CARD_CONFIG.RARITY_CONFIG[cardData.rarity];
    
    if (!modal) {
      console.error('找不到模態框元素');
      return;
    }
    
    // 填入卡片預覽
    const cardPreview = modal.querySelector('.modal-card-preview');
    if (cardPreview) {
      cardPreview.innerHTML = `
        <div class="card-face card-preview card-${cardData.rarity}">
          <div class="card-header">
            <div class="card-icon">${cardData.icon}</div>
            <div>
              <div class="card-title">${cardData.title}</div>
              <div class="card-subtitle">${cardData.subtitle}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="tech-tags">
              ${cardData.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }
    
    // 填入模態框標題
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
      modalTitle.textContent = cardData.title;
    }
    
    // 填入稀有度徽章
    const rarityBadge = modal.querySelector('.modal-rarity');
    if (rarityBadge) {
      rarityBadge.textContent = rarityConfig.name;
      rarityBadge.className = `modal-rarity rarity-${cardData.rarity}`;
      rarityBadge.style.color = rarityConfig.color;
    }
    
    // 填入描述
    const description = modal.querySelector('.modal-description');
    if (description) {
      description.textContent = cardData.description || '這是一個優秀的技術專案，展現了紮實的工程實力與創新思維。';
    }
    
    // 填入技術標籤
    const tagsList = modal.querySelector('.modal-tags-list');
    if (tagsList) {
      tagsList.innerHTML = cardData.tags.map(tag => 
        `<span class="modal-tag">${tag}</span>`
      ).join('');
    }
    
    // 填入統計數據
    const statsList = modal.querySelector('.modal-stats-list');
    if (statsList) {
      const allStats = [
        ...cardData.stats,
        { icon: '✨', label: '稀有度', value: rarityConfig.name },
        { icon: '🎯', label: '獲得機率', value: `${(rarityConfig.probability * 100).toFixed(1)}%` }
      ];
      
      statsList.innerHTML = allStats.map(stat => `
        <div class="modal-stat">
          <span class="modal-stat-icon">${stat.icon}</span>
          <div class="modal-stat-content">
            <span class="modal-stat-label">${stat.label}</span>
            <span class="modal-stat-value">${stat.value}</span>
          </div>
        </div>
      `).join('');
    }
    
    // 顯示模態框
    modal.style.display = 'flex';
    // 強制重繪以觸發 CSS 動畫
    modal.offsetHeight;
    modal.classList.add('show');
    
    // 防止背景滾動
    document.body.style.overflow = 'hidden';
    
    console.log(`模態框已打開，顯示卡片: ${cardData.title}`);
  }
  
  // 關閉模態框
  closeModal() {
    const modal = document.getElementById('cardModal');
    
    if (!modal || !modal.classList.contains('show')) {
      return;
    }
    
    modal.classList.remove('show');
    
    // 動畫結束後隱藏模態框
    setTimeout(() => {
      modal.style.display = 'none';
      // 恢復背景滾動
      document.body.style.overflow = '';
    }, 300);
    
    console.log('模態框已關閉');
  }
  
  getSystemStatus() {
    return {
      totalCards: this.cardCount,
      flippedCards: Array.from(this.cards.values()).filter(card => card.isFlipped).length,
      animationDuration: 600
    };
  }
}

// 全域控制函數
function flipAllCards() {
  if (window.card3DSystemWC) {
    window.card3DSystemWC.flipAllCards();
  }
}

function addMoreCards() {
  if (window.card3DSystemWC) {
    window.card3DSystemWC.addStressTestCards(10);
  }
}

function removeCards() {
  if (window.card3DSystemWC) {
    window.card3DSystemWC.removeCards(10);
  }
}

function stressTest() {
  if (window.card3DSystemWC) {
    window.card3DSystemWC.runStressTest();
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('頁面載入完成，初始化 3D 卡片系統 Web Component 版本...');
  
  window.card3DSystemWC = new Card3DSystemWC();
  
  if (window.PerformanceMonitor) {
    window.performanceMonitor = new window.PerformanceMonitor();
    window.performanceMonitor.start();
  }
  
  console.log('Web Component 系統初始化完成!');
});