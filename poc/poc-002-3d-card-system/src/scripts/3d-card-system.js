/**
 * 3D 卡片翻轉動畫系統
 * 核心類別和功能實現
 */

class Card3DSystem {
  constructor() {
    this.cards = new Map(); // 儲存所有卡片實例
    this.cardCount = 0;
    this.flipAnimationDuration = 600; // 翻轉動畫時長
    this.maxCards = 100; // 最大卡片數量限制
    
    this.initialize();
  }
  
  initialize() {
    console.log('初始化 3D 卡片系統...');
    
    // 生成展示卡片
    this.generateRarityDemo();
    this.generateProjectDemo();
    
    // 初始化事件監聽
    this.initializeEventListeners();
    
    console.log('3D 卡片系統初始化完成');
  }
  
  /**
   * 生成稀有度展示卡片
   */
  generateRarityDemo() {
    const container = document.getElementById('rarityDemo');
    const { RARITY_DEMO_CARDS } = window.CARD_CONFIG;
    
    RARITY_DEMO_CARDS.forEach(cardData => {
      const cardElement = this.createCard(cardData);
      container.appendChild(cardElement);
    });
    
    console.log(`生成 ${RARITY_DEMO_CARDS.length} 張稀有度展示卡片`);
  }
  
  /**
   * 生成專案展示卡片
   */
  generateProjectDemo() {
    const container = document.getElementById('projectDemo');
    const { PROJECT_CARDS } = window.CARD_CONFIG;
    
    PROJECT_CARDS.forEach(cardData => {
      const cardElement = this.createCard(cardData);
      container.appendChild(cardElement);
    });
    
    console.log(`生成 ${PROJECT_CARDS.length} 張專案展示卡片`);
  }
  
  /**
   * 創建單張卡片
   */
  createCard(cardData) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    
    const card = document.createElement('div');
    card.className = `card card-${cardData.rarity}`;
    card.id = cardData.id;
    
    // 創建正面
    const frontFace = this.createCardFace(cardData, 'front');
    card.appendChild(frontFace);
    
    // 創建背面  
    const backFace = this.createCardFace(cardData, 'back');
    card.appendChild(backFace);
    
    cardContainer.appendChild(card);
    
    // 註冊卡片實例
    this.cards.set(cardData.id, {
      element: card,
      data: cardData,
      isFlipped: false
    });
    
    this.cardCount++;
    
    // 添加點擊事件
    this.addCardEventListeners(card, cardData);
    
    return cardContainer;
  }
  
  /**
   * 創建卡片面
   */
  createCardFace(cardData, side) {
    const face = document.createElement('div');
    face.className = `card-face card-${side}`;
    
    if (side === 'front') {
      face.innerHTML = this.createFrontContent(cardData);
    } else {
      face.innerHTML = this.createBackContent(cardData);
    }
    
    return face;
  }
  
  /**
   * 創建卡片正面內容
   */
  createFrontContent(cardData) {
    return `
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
    `;
  }
  
  /**
   * 創建卡片背面內容
   */
  createBackContent(cardData) {
    const rarityConfig = window.CARD_CONFIG.RARITY_CONFIG[cardData.rarity];
    
    return `
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
    `;
  }
  
  /**
   * 添加卡片事件監聽器
   */
  addCardEventListeners(cardElement, cardData) {
    console.log(`綁定事件到卡片: ${cardData.id}`);
    
    // 只在卡片容器上綁定一次點擊事件
    cardElement.addEventListener('click', (e) => {
      console.log(`點擊了卡片: ${cardData.id}`);
      this.flipCard(cardData.id);
    });
    
    // hover 效果已在 CSS 中處理，移除 JavaScript 處理避免衝突
    
    // 觸摸支援
    let touchStartTime = 0;
    
    cardElement.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
    });
    
    cardElement.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touchDuration = Date.now() - touchStartTime;
      
      // 短觸摸翻轉，長觸摸顯示詳情
      if (touchDuration < 500) {
        this.flipCard(cardData.id);
      } else {
        this.showCardDetails(cardData.id);
      }
    });
  }
  
  /**
   * 翻轉卡片
   */
  flipCard(cardId) {
    const cardInstance = this.cards.get(cardId);
    if (!cardInstance) {
      console.error(`找不到卡片: ${cardId}`);
      return;
    }
    
    const { element } = cardInstance;
    const isCurrentlyFlipped = element.classList.contains('flipped');
    
    console.log(`翻轉卡片 ${cardId}，當前狀態: ${isCurrentlyFlipped ? '背面' : '正面'}`);
    
    if (isCurrentlyFlipped) {
      element.classList.remove('flipped');
      cardInstance.isFlipped = false;
      console.log(`卡片 ${cardId} 翻轉到正面`);
    } else {
      element.classList.add('flipped');
      cardInstance.isFlipped = true;
      console.log(`卡片 ${cardId} 翻轉到背面`);
    }
    
    // 觸發性能監控
    if (window.performanceMonitor) {
      window.performanceMonitor.recordFlipAnimation();
    }
  }
  
  /**
   * 卡片懸停處理 (已廢用，直接在 CSS 中處理)
   */
  onCardHover(cardId, isHovering) {
    // 移除此方法，避免與直接的 CSS 樣式衝突
  }
  
  /**
   * 顯示卡片詳情
   */
  showCardDetails(cardId) {
    const cardInstance = this.cards.get(cardId);
    if (!cardInstance) return;
    
    const { data } = cardInstance;
    
    // 創建詳情彈窗 (簡單實現)
    alert(`${data.title}\n\n${data.description}\n\n稀有度: ${window.CARD_CONFIG.RARITY_CONFIG[data.rarity].name}`);
  }
  
  /**
   * 翻轉所有卡片
   */
  flipAllCards() {
    console.log('翻轉所有卡片...');
    
    let delay = 0;
    this.cards.forEach((cardInstance, cardId) => {
      setTimeout(() => {
        this.flipCard(cardId);
      }, delay);
      delay += 50; // 漸進延遲效果
    });
  }
  
  /**
   * 增加壓力測試卡片
   */
  addStressTestCards(count = 10) {
    if (this.cardCount + count > this.maxCards) {
      console.warn(`卡片數量將超過限制 (${this.maxCards})，調整數量為 ${this.maxCards - this.cardCount}`);
      count = this.maxCards - this.cardCount;
    }
    
    const container = document.getElementById('stressTestDemo');
    const { generateStressTestCards } = window.CARD_CONFIG;
    
    const newCards = generateStressTestCards(count);
    
    newCards.forEach(cardData => {
      const cardElement = this.createCard(cardData);
      container.appendChild(cardElement);
    });
    
    console.log(`增加 ${count} 張壓力測試卡片，總數: ${this.cardCount}`);
    
    // 更新效能監控
    if (window.performanceMonitor) {
      window.performanceMonitor.updateCardCount(this.cardCount);
    }
  }
  
  /**
   * 移除卡片
   */
  removeCards(count = 10) {
    const container = document.getElementById('stressTestDemo');
    const stressCards = container.children;
    
    const removeCount = Math.min(count, stressCards.length);
    
    for (let i = 0; i < removeCount; i++) {
      const cardContainer = stressCards[stressCards.length - 1];
      const cardElement = cardContainer.querySelector('.card');
      const cardId = cardElement.id;
      
      // 從記錄中移除
      this.cards.delete(cardId);
      this.cardCount--;
      
      // 從 DOM 中移除
      container.removeChild(cardContainer);
    }
    
    console.log(`移除 ${removeCount} 張卡片，剩餘: ${this.cardCount}`);
    
    // 更新效能監控
    if (window.performanceMonitor) {
      window.performanceMonitor.updateCardCount(this.cardCount);
    }
  }
  
  /**
   * 執行壓力測試
   */
  runStressTest() {
    console.log('開始壓力測試...');
    
    // 清空壓力測試區域
    const container = document.getElementById('stressTestDemo');
    container.innerHTML = '';
    
    // 清理壓力測試卡片記錄
    this.cards.forEach((cardInstance, cardId) => {
      if (cardId.startsWith('stress-')) {
        this.cards.delete(cardId);
        this.cardCount--;
      }
    });
    
    // 添加大量卡片
    this.addStressTestCards(30);
    
    // 自動翻轉測試
    setTimeout(() => {
      this.flipAllCards();
    }, 1000);
    
    // 連續翻轉測試
    setTimeout(() => {
      let flipCount = 0;
      const flipInterval = setInterval(() => {
        this.flipAllCards();
        flipCount++;
        
        if (flipCount >= 5) {
          clearInterval(flipInterval);
          console.log('壓力測試完成');
        }
      }, 1500);
    }, 3000);
  }
  
  /**
   * 初始化全域事件監聽器
   */
  initializeEventListeners() {
    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case ' ': // 空格鍵翻轉所有卡片
          e.preventDefault();
          this.flipAllCards();
          break;
        case 't': // T 鍵壓力測試
        case 'T':
          this.runStressTest();
          break;
      }
    });
    
    console.log('事件監聽器初始化完成');
    console.log('快捷鍵: 空格鍵 = 翻轉所有卡片, T = 壓力測試');
  }
  
  /**
   * 獲取系統狀態
   */
  getSystemStatus() {
    return {
      totalCards: this.cardCount,
      flippedCards: Array.from(this.cards.values()).filter(card => card.isFlipped).length,
      maxCards: this.maxCards,
      animationDuration: this.flipAnimationDuration
    };
  }
}

// 全域控制函數
function flipAllCards() {
  if (window.card3DSystem) {
    window.card3DSystem.flipAllCards();
  }
}

function addMoreCards() {
  if (window.card3DSystem) {
    window.card3DSystem.addStressTestCards(10);
  }
}

function removeCards() {
  if (window.card3DSystem) {
    window.card3DSystem.removeCards(10);
  }
}

function stressTest() {
  if (window.card3DSystem) {
    window.card3DSystem.runStressTest();
  }
}

// 測試翻轉函數 (用於調試)
function testFlip() {
  if (window.card3DSystem) {
    const firstCardId = Array.from(window.card3DSystem.cards.keys())[0];
    console.log('測試翻轉第一張卡片:', firstCardId);
    window.card3DSystem.flipCard(firstCardId);
  }
}

// 當頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('頁面載入完成，初始化 3D 卡片系統...');
  
  window.card3DSystem = new Card3DSystem();
  
  // 啟動效能監控
  if (window.PerformanceMonitor) {
    window.performanceMonitor = new window.PerformanceMonitor();
    window.performanceMonitor.start();
  }
  
  // 添加全域測試函數
  window.testFlip = testFlip;
  console.log('初始化完成! 可以在 Console 中輸入 testFlip() 來測試翻轉');
});