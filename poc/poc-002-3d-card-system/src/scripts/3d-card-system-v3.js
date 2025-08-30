/**
 * 3D 卡片翻轉動畫系統 V3
 * 完全使用 jQuery Flip 套件實現
 */

class Card3DSystemV3 {
  constructor() {
    this.cards = new Map();
    this.cardCount = 0;
    this.initialize();
  }
  
  initialize() {
    console.log('初始化 3D 卡片系統 V3 (jQuery Flip)...');
    
    // 確保 jQuery 和 Flip 套件已載入
    if (typeof $ === 'undefined') {
      console.error('jQuery 未載入');
      return;
    }
    
    if (typeof $.fn.flip === 'undefined') {
      console.error('jQuery Flip 套件未載入');
      return;
    }
    
    this.generateRarityDemo();
    this.generateProjectDemo();
    this.initializeEventListeners();
    
    console.log('3D 卡片系統 V3 初始化完成');
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
    
    // 創建背面內容
    const backContent = this.createBackContent(cardData);
    
    // 設置卡片內容為正面
    card.innerHTML = frontContent;
    
    cardContainer.appendChild(card);
    
    // 使用 jQuery Flip 初始化卡片
    this.initFlipCard($(card), frontContent, backContent, cardData);
    
    // 註冊卡片實例
    this.cards.set(cardData.id, {
      element: card,
      $element: $(card),
      container: cardContainer,
      data: cardData,
      isFlipped: false,
      frontContent: frontContent,
      backContent: backContent
    });
    
    this.cardCount++;
    
    return cardContainer;
  }
  
  initFlipCard($card, frontContent, backContent, cardData) {
    // 設置卡片的前面和背面內容
    $card.data('front', frontContent);
    $card.data('back', backContent);
    
    // 初始化 jQuery Flip
    $card.flip({
      axis: 'y',
      reverse: false,
      trigger: 'manual', // 手動觸發
      speed: 600
    });
    
    // 添加點擊事件
    $card.on('click', (e) => {
      e.stopPropagation();
      console.log(`點擊卡片: ${cardData.id}`);
      this.flipCard(cardData.id);
    });
    
    console.log(`卡片 ${cardData.id} jQuery Flip 初始化完成`);
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
    
    const { $element, isFlipped, frontContent, backContent } = cardInstance;
    
    console.log(`翻轉卡片 ${cardId}，當前狀態: ${isFlipped ? '背面' : '正面'}`);
    
    if (isFlipped) {
      // 翻回正面
      $element.html(frontContent);
      $element.revertFlip();
      cardInstance.isFlipped = false;
      console.log(`卡片 ${cardId} 翻轉到正面`);
    } else {
      // 翻到背面 - 設置背面內容然後翻轉
      $element.flip({
        content: backContent
      });
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
      const cardElement = cardContainer.querySelector('.card');
      const cardId = cardElement.id;
      
      // 清理 jQuery Flip 實例
      const cardInstance = this.cards.get(cardId);
      if (cardInstance && cardInstance.$element) {
        cardInstance.$element.off('click');
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
        if (cardInstance.$element) {
          cardInstance.$element.off('click');
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
  if (window.card3DSystemV3) {
    window.card3DSystemV3.flipAllCards();
  }
}

function addMoreCards() {
  if (window.card3DSystemV3) {
    window.card3DSystemV3.addStressTestCards(10);
  }
}

function removeCards() {
  if (window.card3DSystemV3) {
    window.card3DSystemV3.removeCards(10);
  }
}

function stressTest() {
  if (window.card3DSystemV3) {
    window.card3DSystemV3.runStressTest();
  }
}

// 初始化
$(document).ready(() => {
  console.log('jQuery 準備完成，初始化 3D 卡片系統 V3...');
  
  window.card3DSystemV3 = new Card3DSystemV3();
  
  if (window.PerformanceMonitor) {
    window.performanceMonitor = new window.PerformanceMonitor();
    window.performanceMonitor.start();
  }
  
  console.log('V3 系統 (jQuery Flip) 初始化完成!');
});