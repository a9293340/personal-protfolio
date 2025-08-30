/**
 * 3D 卡片翻轉動畫系統 V2
 * 使用簡化的實現解決點擊綁定和位置跳動問題
 */

class Card3DSystemV2 {
  constructor() {
    this.cards = new Map();
    this.cardCount = 0;
    this.initialize();
  }
  
  initialize() {
    console.log('初始化 3D 卡片系統 V2...');
    
    this.generateRarityDemo();
    this.generateProjectDemo();
    this.initializeEventListeners();
    
    console.log('3D 卡片系統 V2 初始化完成');
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
      container: cardContainer,
      data: cardData,
      isFlipped: false
    });
    
    this.cardCount++;
    
    // 添加點擊事件 - 直接綁定到卡片元素
    this.addClickHandler(card, cardData.id);
    
    return cardContainer;
  }
  
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
  
  // 簡化的點擊處理
  addClickHandler(cardElement, cardId) {
    cardElement.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止事件冒泡
      this.flipCard(cardId);
    });
    
    console.log(`卡片 ${cardId} 點擊事件綁定完成`);
  }
  
  flipCard(cardId) {
    const cardInstance = this.cards.get(cardId);
    if (!cardInstance) {
      console.error(`找不到卡片: ${cardId}`);
      return;
    }
    
    const { element } = cardInstance;
    const isCurrentlyFlipped = element.classList.contains('is-flipped');
    
    console.log(`翻轉卡片 ${cardId}，當前狀態: ${isCurrentlyFlipped ? '背面' : '正面'}`);
    
    // 使用新的 CSS 類名
    if (isCurrentlyFlipped) {
      element.classList.remove('is-flipped');
      cardInstance.isFlipped = false;
      console.log(`卡片 ${cardId} 翻轉到正面`);
    } else {
      element.classList.add('is-flipped');
      cardInstance.isFlipped = true;
      console.log(`卡片 ${cardId} 翻轉到背面`);
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
      delay += 100; // 增加延遲讓效果更明顯
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

// 全域控制函數 - 使用新的系統實例
function flipAllCards() {
  if (window.card3DSystemV2) {
    window.card3DSystemV2.flipAllCards();
  }
}

function addMoreCards() {
  if (window.card3DSystemV2) {
    window.card3DSystemV2.addStressTestCards(10);
  }
}

function removeCards() {
  if (window.card3DSystemV2) {
    window.card3DSystemV2.removeCards(10);
  }
}

function stressTest() {
  if (window.card3DSystemV2) {
    window.card3DSystemV2.runStressTest();
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('頁面載入完成，初始化 3D 卡片系統 V2...');
  
  window.card3DSystemV2 = new Card3DSystemV2();
  
  if (window.PerformanceMonitor) {
    window.performanceMonitor = new window.PerformanceMonitor();
    window.performanceMonitor.start();
  }
  
  console.log('V2 系統初始化完成!');
});