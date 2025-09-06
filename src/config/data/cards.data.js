/**
 * 遊戲王風格卡牌數據
 * 
 * 基於 projects.data.js 生成的完整卡牌數據集
 */

import { projectsDataConfig } from './projects.data.js';
import { CardDataConverter } from './card.config.js';

/**
 * 自動生成的卡牌數據
 */
export const cardsData = CardDataConverter.convertAllProjects(projectsDataConfig);

/**
 * 卡牌收藏册配置
 */
export const cardCollectionConfig = {
  // 收藏册分類
  collections: {
    all: {
      name: "完整收藏",
      description: "所有專案卡牌的完整收藏",
      icon: "📚",
      cards: Object.keys(cardsData.cards)
    },
    legendary: {
      name: "傳說收藏",
      description: "最頂尖的架構設計專案",
      icon: "👑",
      cards: cardsData.metadata.cardsByRarity.legendary
    },
    superRare: {
      name: "超稀有收藏", 
      description: "卓越的技術實現專案",
      icon: "⭐",
      cards: cardsData.metadata.cardsByRarity.superRare
    },
    rare: {
      name: "稀有收藏",
      description: "優質的創新專案",
      icon: "💎", 
      cards: cardsData.metadata.cardsByRarity.rare
    },
    backend: {
      name: "後端專精",
      description: "後端開發相關專案",
      icon: "⚡",
      cards: Object.values(cardsData.cards)
        .filter(card => card.attribute === 'backend')
        .map(card => card.id)
    },
    architecture: {
      name: "架構大師",
      description: "系統架構設計專案", 
      icon: "🏛️",
      cards: Object.values(cardsData.cards)
        .filter(card => card.attribute === 'architecture')
        .map(card => card.id)
    },
    fullstack: {
      name: "全端戰士",
      description: "全端開發專案",
      icon: "🌟", 
      cards: Object.values(cardsData.cards)
        .filter(card => card.attribute === 'fullstack')
        .map(card => card.id)
    }
  },

  // 展示順序配置
  displayOrder: ["legendary", "superRare", "rare", "backend", "architecture", "fullstack", "all"],
  
  // 預設收藏册
  default: "all"
};

/**
 * 卡包系統配置
 */
export const cardPackConfig = {
  // 卡包類型
  packs: {
    starter: {
      name: "新手包",
      description: "包含基礎專案的入門卡包",
      icon: "📦",
      cardCount: 5,
      rarity: ["normal", "rare"],
      price: 100,
      guaranteedRarity: "rare"
    },
    professional: {
      name: "專業包",
      description: "中階開發者的進階卡包",
      icon: "💼", 
      cardCount: 8,
      rarity: ["rare", "superRare"],
      price: 300,
      guaranteedRarity: "superRare"
    },
    master: {
      name: "大師包",
      description: "頂尖架構師的傳說卡包",
      icon: "🎭",
      cardCount: 10, 
      rarity: ["superRare", "legendary"],
      price: 500,
      guaranteedRarity: "legendary"
    }
  },
  
  // 抽卡機率
  rarityProbability: {
    normal: 0.60,      // 60%
    rare: 0.30,        // 30%
    superRare: 0.09,   // 9%
    legendary: 0.01    // 1%
  }
};

/**
 * 卡牌統計信息
 */
export const cardStatistics = {
  // 總體統計
  total: {
    cards: cardsData.metadata.totalCards,
    byRarity: cardsData.metadata.cardsByRarity,
    byAttribute: Object.values(cardsData.cards).reduce((acc, card) => {
      acc[card.attribute] = (acc[card.attribute] || 0) + 1;
      return acc;
    }, {})
  },
  
  // 數值統計
  stats: {
    maxAttack: Math.max(...Object.values(cardsData.cards).map(c => c.attack)),
    maxDefense: Math.max(...Object.values(cardsData.cards).map(c => c.defense)),
    maxLevel: Math.max(...Object.values(cardsData.cards).map(c => c.level)),
    
    averageAttack: Math.round(
      Object.values(cardsData.cards).reduce((sum, c) => sum + c.attack, 0) / 
      cardsData.metadata.totalCards
    ),
    averageDefense: Math.round(
      Object.values(cardsData.cards).reduce((sum, c) => sum + c.defense, 0) / 
      cardsData.metadata.totalCards  
    ),
    averageLevel: Math.round(
      Object.values(cardsData.cards).reduce((sum, c) => sum + c.level, 0) / 
      cardsData.metadata.totalCards
    )
  }
};

/**
 * 取得指定卡牌的詳細資料
 */
export function getCardData(cardId) {
  return cardsData.cards[cardId] || null;
}

/**
 * 根據稀有度取得卡牌列表
 */
export function getCardsByRarity(rarity) {
  return cardsData.metadata.cardsByRarity[rarity]?.map(id => cardsData.cards[id]) || [];
}

/**
 * 根據屬性取得卡牌列表
 */
export function getCardsByAttribute(attribute) {
  return Object.values(cardsData.cards).filter(card => card.attribute === attribute);
}

/**
 * 取得精選卡牌
 */
export function getFeaturedCards() {
  return cardsData.featured.map(id => cardsData.cards[id]).filter(Boolean);
}

/**
 * 隨機抽取卡牌
 */
export function drawRandomCard(rarityFilter = null) {
  let availableCards = Object.values(cardsData.cards);
  
  if (rarityFilter) {
    availableCards = availableCards.filter(card => card.rarity === rarityFilter);
  }
  
  if (availableCards.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
}

/**
 * 模擬開卡包
 */
export function openCardPack(packType = 'professional') {
  const pack = cardPackConfig.packs[packType];
  if (!pack) return [];
  
  const drawnCards = [];
  const { cardCount, rarity, guaranteedRarity } = pack;
  
  // 保證稀有度卡牌
  if (guaranteedRarity) {
    const guaranteedCard = drawRandomCard(guaranteedRarity);
    if (guaranteedCard) {
      drawnCards.push(guaranteedCard);
    }
  }
  
  // 抽取其餘卡牌
  for (let i = drawnCards.length; i < cardCount; i++) {
    // 根據機率決定稀有度
    const rand = Math.random();
    let selectedRarity = 'normal';
    
    if (rand <= cardPackConfig.rarityProbability.legendary) {
      selectedRarity = 'legendary';
    } else if (rand <= cardPackConfig.rarityProbability.legendary + cardPackConfig.rarityProbability.superRare) {
      selectedRarity = 'superRare';
    } else if (rand <= 1 - cardPackConfig.rarityProbability.normal) {
      selectedRarity = 'rare';
    }
    
    // 確保稀有度在卡包允許範圍內
    if (!rarity.includes(selectedRarity)) {
      selectedRarity = rarity[Math.floor(Math.random() * rarity.length)];
    }
    
    const card = drawRandomCard(selectedRarity);
    if (card) {
      drawnCards.push(card);
    }
  }
  
  return drawnCards;
}

export default {
  cardsData,
  cardCollectionConfig, 
  cardPackConfig,
  cardStatistics,
  getCardData,
  getCardsByRarity,
  getCardsByAttribute,
  getFeaturedCards,
  drawRandomCard,
  openCardPack
};