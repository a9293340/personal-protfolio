/**
 * 3D 卡片翻轉動畫系統 - 最終版本
 * 使用完全穩定的原生實現，不依賴任何外部套件
 */

class Card3DSystemFinal {
  constructor() {
    this.cards = new Map();
    this.cardCount = 0;
    this.initialize();
  }
  
  initialize() {
    console.log('初始化 3D 卡片系統 - 最終版本（純原生實現）...');
    
    this.generateRarityDemo();
    this.generateProjectDemo();
    this.initializeEventListeners();
    
    console.log('3D 卡片系統最終版本初始化完成');
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
    
    // 創建卡片包裝器
    const cardWrapper = document.createElement('div');
    cardWrapper.className = `card-wrapper card-${cardData.rarity}`;
    cardWrapper.id = cardData.id;
    
    // 創建前面
    const frontDiv = document.createElement('div');
    frontDiv.className = 'card-side card-front';
    frontDiv.innerHTML = this.createFrontContent(cardData);
    
    // 創建背面
    const backDiv = document.createElement('div');
    backDiv.className = 'card-side card-back';
    backDiv.innerHTML = this.createBackContent(cardData);
    
    cardWrapper.appendChild(frontDiv);
    cardWrapper.appendChild(backDiv);
    cardContainer.appendChild(cardWrapper);
    
    // 添加點擊事件
    this.addClickHandler(cardWrapper, cardData.id);
    
    // 註冊卡片實例
    this.cards.set(cardData.id, {
      element: cardWrapper,
      container: cardContainer,
      frontDiv: frontDiv,
      backDiv: backDiv,
      data: cardData,
      isFlipped: false
    });
    
    this.cardCount++;
    
    return cardContainer;
  }
  
  addClickHandler(cardElement, cardId) {
    cardElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(`點擊卡片: ${cardId}`);
      this.flipCard(cardId);
    });
    
    // 防止子元素觸發事件
    const childElements = cardElement.querySelectorAll('*');
    childElements.forEach(child => {
      child.style.pointerEvents = 'none';
    });
    
    console.log(`卡片 ${cardId} 事件綁定完成`);
  }
  
  createFrontContent(cardData) {
    return `
      <div class="card-content">
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
      <div class="card-content">
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
    
    console.log(`翻轉卡片 ${cardId}，當前狀態: ${isFlipped ? '背面' : '正面'}`);
    
    if (isFlipped) {
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
      const cardElement = cardContainer.querySelector('.card-wrapper');
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

// 全域控制函數
function flipAllCards() {
  if (window.card3DSystemFinal) {
    window.card3DSystemFinal.flipAllCards();
  }
}

function addMoreCards() {
  if (window.card3DSystemFinal) {
    window.card3DSystemFinal.addStressTestCards(10);
  }
}

function removeCards() {
  if (window.card3DSystemFinal) {
    window.card3DSystemFinal.removeCards(10);
  }
}

function stressTest() {
  if (window.card3DSystemFinal) {
    window.card3DSystemFinal.runStressTest();
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('頁面載入完成，初始化 3D 卡片系統最終版本...');
  
  window.card3DSystemFinal = new Card3DSystemFinal();
  
  if (window.PerformanceMonitor) {
    window.performanceMonitor = new window.PerformanceMonitor();
    window.performanceMonitor.start();
  }
  
  console.log('最終版本系統初始化完成!');
});