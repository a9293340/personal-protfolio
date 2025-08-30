/**
 * 3D 卡片翻轉動畫系統 V4
 * 使用 Flip.js 套件（純 JavaScript，不依賴 jQuery）
 */

class Card3DSystemV4 {
  constructor() {
    this.cards = new Map();
    this.cardCount = 0;
    this.initialize();
  }
  
  initialize() {
    console.log('初始化 3D 卡片系統 V4 (Flip.js)...');
    
    // 確保 Flip.js 套件已載入
    if (typeof Flip === 'undefined') {
      console.error('Flip.js 套件未載入');
      return;
    }
    
    this.generateRarityDemo();
    this.generateProjectDemo();
    this.initializeEventListeners();
    
    console.log('3D 卡片系統 V4 初始化完成');
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
    
    const card = document.createElement('div');
    card.className = `card card-${cardData.rarity}`;
    card.id = cardData.id;
    
    // 創建正面內容
    const frontContent = this.createFrontContent(cardData);
    card.innerHTML = frontContent;
    
    cardContainer.appendChild(card);
    
    // 使用 Flip.js 初始化卡片
    this.initFlipCard(card, cardData);
    
    // 註冊卡片實例
    this.cards.set(cardData.id, {
      element: card,
      container: cardContainer,
      data: cardData,
      isFlipped: false,
      flipInstance: null
    });
    
    this.cardCount++;
    
    return cardContainer;
  }
  
  initFlipCard(cardElement, cardData) {
    // 創建背面內容
    const backContent = this.createBackContent(cardData);
    
    try {
      // 使用 Flip.js 初始化
      const flipInstance = new Flip({
        selector: cardElement,
        back: backContent,
        speed: 600,
        axis: 'y'
      });
      
      // 保存 flip 實例
      const cardInstance = this.cards.get(cardData.id);
      if (cardInstance) {
        cardInstance.flipInstance = flipInstance;
      }
      
      // 添加點擊事件
      cardElement.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(`點擊卡片: ${cardData.id}`);
        this.flipCard(cardData.id);
      });
      
      console.log(`卡片 ${cardData.id} Flip.js 初始化完成`);
    } catch (error) {
      console.error(`初始化卡片 ${cardData.id} 失敗:`, error);
      // 如果套件失敗，回退到簡單的點擊處理
      this.fallbackFlipHandler(cardElement, cardData);
    }
  }
  
  fallbackFlipHandler(cardElement, cardData) {
    // 回退方案：使用簡單的 CSS class 切換
    cardElement.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(`點擊卡片 (fallback): ${cardData.id}`);
      
      const cardInstance = this.cards.get(cardData.id);
      if (cardInstance) {
        if (cardInstance.isFlipped) {
          cardElement.innerHTML = this.createFrontContent(cardData);
          cardInstance.isFlipped = false;
        } else {
          cardElement.innerHTML = this.createBackContent(cardData);
          cardInstance.isFlipped = true;
        }
      }
    });
    
    console.log(`卡片 ${cardData.id} 使用 fallback 模式`);
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
    
    const { element, flipInstance, isFlipped } = cardInstance;
    
    console.log(`翻轉卡片 ${cardId}，當前狀態: ${isFlipped ? '背面' : '正面'}`);
    
    try {
      if (flipInstance) {
        // 使用 Flip.js 翻轉
        flipInstance.flip();
        cardInstance.isFlipped = !isFlipped;
        console.log(`卡片 ${cardId} 使用 Flip.js 翻轉完成`);
      } else {
        // 使用 fallback 方法
        if (isFlipped) {
          element.innerHTML = this.createFrontContent(cardInstance.data);
          cardInstance.isFlipped = false;
        } else {
          element.innerHTML = this.createBackContent(cardInstance.data);
          cardInstance.isFlipped = true;
        }
        console.log(`卡片 ${cardId} 使用 fallback 翻轉完成`);
      }
    } catch (error) {
      console.error(`翻轉卡片 ${cardId} 失敗:`, error);
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
      const cardElement = cardContainer.querySelector('.card');
      const cardId = cardElement.id;
      
      // 清理 Flip 實例
      const cardInstance = this.cards.get(cardId);
      if (cardInstance && cardInstance.flipInstance) {
        try {
          cardInstance.flipInstance.destroy();
        } catch (error) {
          console.warn(`清理卡片 ${cardId} Flip 實例失敗:`, error);
        }
      }
      
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
        if (cardInstance.flipInstance) {
          try {
            cardInstance.flipInstance.destroy();
          } catch (error) {
            console.warn(`清理卡片 ${cardId} 失敗:`, error);
          }
        }
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
      }
    });
    
    console.log('全域事件監聽器初始化完成');
    console.log('快捷鍵: 空格鍵 = 翻轉所有卡片, T = 壓力測試');
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
  if (window.card3DSystemV4) {
    window.card3DSystemV4.flipAllCards();
  }
}

function addMoreCards() {
  if (window.card3DSystemV4) {
    window.card3DSystemV4.addStressTestCards(10);
  }
}

function removeCards() {
  if (window.card3DSystemV4) {
    window.card3DSystemV4.removeCards(10);
  }
}

function stressTest() {
  if (window.card3DSystemV4) {
    window.card3DSystemV4.runStressTest();
  }
}

// 初始化 - 不依賴 jQuery
document.addEventListener('DOMContentLoaded', () => {
  console.log('頁面載入完成，初始化 3D 卡片系統 V4...');
  
  window.card3DSystemV4 = new Card3DSystemV4();
  
  if (window.PerformanceMonitor) {
    window.performanceMonitor = new window.PerformanceMonitor();
    window.performanceMonitor.start();
  }
  
  console.log('V4 系統 (Flip.js) 初始化完成!');
});