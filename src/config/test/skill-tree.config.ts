/**
 * 技能樹測試配置
 * 基於 POC-001 的技能樹配置，但使用新的 Config-Driven 架構
 */

import type { ConfigObject } from '@/types/config.js';

export const skillTreeConfig: ConfigObject = {
  meta: {
    title: '技能樹系統',
    description: '展示技術技能發展路徑',
    version: '1.0.0',
    lastUpdated: '{{time.isoString}}'
  },
  
  // 技能領域定義
  domains: {
    frontend: { 
      color: '#e74c3c', 
      direction: 0,
      name: '前端領域',
      description: 'HTML、CSS、JavaScript 及相關框架'
    },
    backend: { 
      color: '#3498db', 
      direction: 300,
      name: '後端領域',
      description: 'Node.js、Python、Java 等後端技術'
    },
    database: { 
      color: '#2ecc71', 
      direction: 240,
      name: '資料庫領域',
      description: 'SQL、NoSQL 資料庫設計與優化'
    },
    'cloud-devops': { 
      color: '#9b59b6', 
      direction: 180,
      name: '雲端服務與 DevOps',
      description: 'AWS、Docker、Kubernetes 等基礎設施'
    },
    ai: { 
      color: '#f39c12', 
      direction: 120,
      name: 'AI 使用領域',
      description: 'Prompt Engineering 和 AI 工具整合'
    },
    architecture: { 
      color: '#1abc9c', 
      direction: 60,
      name: '架構規劃領域',
      description: '系統架構設計與技術決策'
    }
  },
  
  // 熟練度等級
  proficiencyLevels: {
    expert: { 
      symbol: 'O', 
      name: '熟練', 
      opacity: 1.0,
      color: '#d4af37',
      description: '深度理解並能獨立應用'
    },
    intermediate: { 
      symbol: '*', 
      name: '略懂', 
      opacity: 0.7,
      color: '#3498db',
      description: '基本理解並能在指導下應用'
    },
    learning: { 
      symbol: 'X', 
      name: '待學習', 
      opacity: 0.4,
      color: '#95a5a6',
      description: '尚未掌握，計劃學習'
    }
  },
  
  // 技能節點配置
  skills: [
    // Frontend 技能
    {
      id: 'html-css',
      name: 'HTML/CSS',
      domain: 'frontend',
      level: 'major',
      position: { q: 2, r: 0 },
      proficiency: 'expert',
      difficulty: 1,
      description: 'Web 前端基礎技術',
      relatedSkills: ['responsive-design', 'css-preprocessors']
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      domain: 'frontend',
      level: 'major',
      position: { q: 4, r: 0 },
      proficiency: 'expert',
      difficulty: 2,
      description: 'JavaScript 核心語言特性',
      relatedSkills: ['typescript', 'es6-features']
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      domain: 'frontend',
      level: 'minor',
      position: { q: 5, r: -1 },
      proficiency: 'expert',
      difficulty: 3,
      description: 'JavaScript 的類型化超集',
      relatedSkills: ['javascript']
    },
    
    // Backend 技能
    {
      id: 'nodejs',
      name: 'Node.js',
      domain: 'backend',
      level: 'major',
      position: { q: 1, r: -2 },
      proficiency: 'expert',
      difficulty: 2,
      description: 'JavaScript 運行時環境',
      relatedSkills: ['express', 'api-design']
    },
    
    // AI 技能
    {
      id: 'prompt-engineering',
      name: 'Prompt Engineering',
      domain: 'ai',
      level: 'major',
      position: { q: -1, r: 2 },
      proficiency: 'expert',
      difficulty: 1,
      description: '有效提示詞設計與優化',
      relatedSkills: ['ai-integration', 'context-management']
    }
  ],
  
  // 視覺配置
  visual: {
    layout: {
      type: 'hexagonal',
      centerPosition: { q: 0, r: 0 },
      maxRadius: 10,
      nodeSize: 40,
      nodeSpacing: 60
    },
    
    animation: {
      enableTransitions: true,
      duration: 300,
      easing: 'ease-in-out',
      stagger: 50
    },
    
    interaction: {
      enableZoom: true,
      enablePan: true,
      enableTooltips: true,
      zoomRange: [0.5, 3.0]
    },
    
    theme: {
      background: '{{config.theme.background.primary}}',
      gridColor: 'rgba(255, 255, 255, 0.1)',
      connectionColor: '{{config.theme.colors.accent}}',
      textColor: '{{config.theme.colors.text.primary}}'
    }
  },
  
  // 行為配置
  behavior: {
    // 響應式配置
    responsive: {
      mobile: {
        nodeSize: 30,
        nodeSpacing: 45,
        fontSize: '0.8rem'
      },
      tablet: {
        nodeSize: 35,
        nodeSpacing: 50,
        fontSize: '0.9rem'
      },
      desktop: {
        nodeSize: 40,
        nodeSpacing: 60,
        fontSize: '1rem'
      }
    },
    
    // 互動行為
    interactions: {
      hoverEffects: true,
      clickToExpand: true,
      keyboardNavigation: true,
      touchGestures: '{{browser.isMobile}}'
    }
  }
};

export default skillTreeConfig;