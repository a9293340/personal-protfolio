# 功能規格書 - 遊戲化個人網站

## 1. 總體架構

### 1.1 頁面路由結構
```
/                    # 首頁 (Landing Page)
/about               # 個人簡介 (Character Profile)  
/portfolio           # 工作產值 (Equipment Showcase)
/projects            # 個人專案 (Card Collection)
/skills              # 技能展示 (Skill Tree)
/contact             # 聯絡資訊 (Guild Contact)
```

### 1.2 全域功能組件
- **導航選單：** 浮動圓形選單，遊戲風格圖標
- **載入畫面：** 遊戏風格進度條與粒子效果
- **音效控制：** 右上角音量控制開關
- **主題背景：** 深色粒子動態背景

---

## 2. 首頁 (Landing Page)

### 2.1 視覺設計規格
**佈局結構：**
- **背景層：** 深色漸層 + 浮動粒子動畫
- **主體層：** 居中的角色介紹卡片
- **導航層：** 環形浮動導航選單

**核心元素：**
- **個人頭像：** 圓形頭像，外圍金色光環動畫
- **標題文字：** "Backend Engineer → Solution Architect"
- **子標題：** "Crafting scalable systems with AI integration"
- **導航入口：** 5個遊戲風格按鈕，對應主要頁面

### 2.2 互動行為規格

#### 2.2.1 滑鼠互動
```javascript
// 粒子跟隨效果
onMouseMove: {
  particles.followCursor(x, y, intensity: 0.3);
  cursor.glow.update(position);
}

// 導航按鈕懸停
onButtonHover: {
  scale: 1.1;
  glow: 'gold';  
  playSound: 'hover.mp3';
  showTooltip: true;
}

// 導航按鈕點擊
onButtonClick: {
  playSound: 'click.mp3';
  particle.burst(position);
  transition: 'fadeOut 800ms ease-out';
}
```

#### 2.2.2 載入動畫序列
1. **頁面淡入：** 背景由黑色漸變出現 (500ms)
2. **粒子系統啟動：** 粒子從中心擴散 (800ms)  
3. **頭像顯現：** 縮放+旋轉入場 (600ms, delay 300ms)
4. **文字打字效果：** 逐字顯示 (1200ms, delay 600ms)
5. **導航按鈕依序出現：** 彈跳入場 (每個間隔100ms)

---

## 3. 個人簡介 (About)

### 3.1 版面配置
**三欄式佈局：**
- **左欄 (30%)：** 角色狀態面板
- **中欄 (40%)：** 職涯發展時間軸  
- **右欄 (30%)：** 屬性雷達圖

### 3.2 角色狀態面板規格

#### 3.2.1 角色卡片設計
```css
.character-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #d4af37;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}
```

**內容元素：**
- **職業圖標：** 動態SVG圖標 (後端工程師 → 架構師)
- **等級顯示：** 根據工作年資計算 (Lv.{years_of_experience})
- **經驗值條：** 當前階段進度條動畫
- **專精領域標籤：** 彩色標籤組，可點擊展開說明

#### 3.2.2 屬性面板互動
```javascript
// 屬性值動畫
const attributes = {
  'Technical Skills': 85,
  'Architecture Thinking': 78,  
  'Team Collaboration': 82,
  'Problem Solving': 88,
  'AI Integration': 75
};

// 數值動畫效果
animateValue(startValue: 0, endValue: attribute.value, duration: 1000);
```

### 3.3 職涯時間軸規格

#### 3.3.1 時間軸視覺設計
- **主軸：** 垂直金色連線，帶發光效果
- **節點：** 圓形里程碑點，不同大小表示重要程度
- **內容卡片：** 懸浮卡片顯示詳細資訊

#### 3.3.2 滾動觸發動畫
```javascript
// 滾動監聽
onScroll: {
  const visibleNodes = getVisibleTimelineNodes();
  visibleNodes.forEach(node => {
    node.animate({
      opacity: [0, 1],
      transform: ['translateX(-50px)', 'translateX(0)'],
      duration: 600,
      easing: 'ease-out'
    });
  });
}
```

---

## 4. 技能展示 (Skills) - 核心功能

### 4.1 技能樹架構設計

#### 4.1.1 座標系統
```javascript
// 六角形網格座標系統
const HexGrid = {
  origin: { x: 0, y: 0 },           // 中心起始點
  hexSize: 40,                     // 六角形邊長
  spacing: 50,                     // 節點間距
  
  // 六角形座標轉換
  hexToPixel(q, r) {
    const x = hexSize * (3/2 * q);
    const y = hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x, y };
  }
};
```

#### 4.1.2 技能樹數據結構
```javascript
const skillTreeData = {
  // 中央核心 - 起始點
  core: {
    id: 'backend-core',
    position: { q: 0, r: 0 },
    type: 'keystone',
    name: '後端核心',
    description: 'Backend Engineering Foundation',
    status: 'mastered',
    children: ['programming-languages', 'frameworks', 'databases']
  },
  
  // 主要分支定義
  branches: {
    // 🔧 後端核心分支
    'backend-core': {
      nodes: [
        {
          id: 'programming-languages',
          position: { q: 0, r: -1 },
          type: 'notable',
          name: 'Programming Languages',
          skills: ['Java', 'Python', 'Go', 'JavaScript'],
          status: 'mastered',
          children: ['advanced-java', 'python-ecosystem']
        },
        // ... 更多節點
      ]
    },
    
    // 🏗️ 系統架構分支  
    'system-architecture': {
      startFrom: 'frameworks',
      direction: 'northeast',
      nodes: [
        {
          id: 'microservices',
          position: { q: 2, r: -1 },
          type: 'keystone',
          name: 'Microservices Architecture',
          status: 'learning',
          prerequisites: ['frameworks', 'databases']
        }
        // ... 系統架構相關技能
      ]
    },
    
    // 🤖 AI/ML 工程分支
    'ai-ml-engineering': {
      startFrom: 'programming-languages', 
      direction: 'northwest',
      nodes: [
        {
          id: 'llm-development',
          position: { q: -2, r: -1 },
          type: 'notable',
          name: 'LLM Application Development',
          status: 'learning',
          skills: ['OpenAI API', 'Langchain', 'Vector Databases']
        },
        {
          id: 'prompt-engineering',
          position: { q: -3, r: -1 },
          type: 'notable', 
          name: 'Prompt Engineering',
          status: 'planning',
          skills: ['Chain of Thought', 'Few-shot Learning', 'Prompt Optimization']
        }
        // ... AI 相關技能
      ]
    }
    // ... 其他分支
  }
};
```

### 4.2 技能節點互動規格

#### 4.2.1 節點狀態與視覺樣式
```css
/* 已掌握狀態 */
.skill-node.mastered {
  background: radial-gradient(circle, #d4af37 0%, #b8941f 100%);
  border: 3px solid #f4d03f;
  box-shadow: 
    0 0 15px rgba(244, 208, 63, 0.8),
    inset 0 0 10px rgba(255, 255, 255, 0.2);
  animation: pulse-gold 2s ease-in-out infinite;
}

/* 可學習狀態 */  
.skill-node.available {
  background: radial-gradient(circle, #3498db 0%, #2980b9 100%);
  border: 2px solid #5dade2;
  box-shadow: 0 0 10px rgba(93, 173, 226, 0.5);
  cursor: pointer;
}

/* 未解鎖狀態 */
.skill-node.locked {
  background: #2c3e50;
  border: 1px solid #34495e;
  opacity: 0.4;
  cursor: not-allowed;
}

/* 關鍵石節點 */
.skill-node.keystone {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

/* 重要節點 */
.skill-node.notable {
  width: 45px; 
  height: 45px;
  border-width: 3px;
}

/* 普通節點 */
.skill-node.normal {
  width: 30px;
  height: 30px;  
  border-width: 2px;
}
```

#### 4.2.2 節點點擊行為
```javascript
// 技能節點點擊處理
function onSkillNodeClick(nodeId) {
  const node = getSkillNode(nodeId);
  
  // 狀態檢查
  if (node.status === 'locked') {
    // 顯示前置技能提示
    showPrerequisiteTooltip(node.prerequisites);
    playSound('error.mp3');
    shakeAnimation(nodeId);
    return;
  }
  
  if (node.status === 'mastered') {
    // 顯示技能詳情
    showSkillDetail(node);
    playSound('info.mp3');
    highlightConnectedNodes(node.children);
    return;
  }
  
  if (node.status === 'available') {
    // 學習技能動畫 (模擬)
    simulateSkillLearning(nodeId);
    playSound('levelup.mp3');
    particleBurst(node.position, 'gold');
    updateNodeStatus(nodeId, 'mastered');
    unlockNextNodes(node.children);
  }
}

// 技能學習動畫
function simulateSkillLearning(nodeId) {
  const node = document.getElementById(nodeId);
  
  // 學習動畫序列
  const animation = node.animate([
    { transform: 'scale(1)', filter: 'brightness(1)' },
    { transform: 'scale(1.3)', filter: 'brightness(1.5)' },
    { transform: 'scale(1.1)', filter: 'brightness(1.2)' },
    { transform: 'scale(1)', filter: 'brightness(1)' }
  ], {
    duration: 800,
    easing: 'ease-out'
  });
  
  // 光環擴散效果
  createRippleEffect(node.position, 'gold');
}
```

#### 4.2.3 技能詳情彈窗
```javascript
// 技能詳情彈窗組件
function showSkillDetail(skill) {
  const modal = createModal({
    title: skill.name,
    className: 'skill-detail-modal',
    content: `
      <div class="skill-header">
        <img src="${skill.icon}" alt="${skill.name}" class="skill-icon">
        <div class="skill-meta">
          <h3>${skill.name}</h3>
          <span class="skill-type ${skill.type}">${skill.type.toUpperCase()}</span>
        </div>
      </div>
      
      <div class="skill-description">
        <p>${skill.description}</p>
      </div>
      
      <div class="skill-details">
        <h4>相關技能</h4>
        <div class="skill-tags">
          ${skill.skills.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
        
        <h4>學習時程</h4>
        <div class="timeline">
          <span class="date">${skill.learnedDate || 'Planning'}</span>
        </div>
        
        ${skill.projects ? `
        <h4>相關專案</h4>
        <div class="related-projects">
          ${skill.projects.map(p => `<a href="${p.link}">${p.name}</a>`).join('')}
        </div>
        ` : ''}
      </div>
    `,
    onClose: () => clearHighlights()
  });
  
  // 彈窗動畫
  modal.animate([
    { opacity: 0, transform: 'scale(0.8)' },
    { opacity: 1, transform: 'scale(1)' }
  ], { duration: 300, easing: 'ease-out' });
}
```

### 4.3 技能樹導航與視圖控制

#### 4.3.1 拖曳與縮放功能
```javascript
class SkillTreeViewport {
  constructor(container) {
    this.container = container;
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    // 滑鼠拖曳
    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.container.style.cursor = 'grabbing';
    });
    
    this.container.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      
      const deltaX = e.clientX - this.dragStart.x;
      const deltaY = e.clientY - this.dragStart.y;
      
      this.translateX += deltaX;
      this.translateY += deltaY;
      
      this.updateTransform();
      this.dragStart = { x: e.clientX, y: e.clientY };
    });
    
    this.container.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.container.style.cursor = 'grab';
    });
    
    // 滾輪縮放
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.3, Math.min(2, this.scale * scaleFactor));
      
      // 以滑鼠位置為縮放中心
      const rect = this.container.getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      
      this.translateX = centerX - (centerX - this.translateX) * (newScale / this.scale);
      this.translateY = centerY - (centerY - this.translateY) * (newScale / this.scale);
      this.scale = newScale;
      
      this.updateTransform();
    });
  }
  
  updateTransform() {
    const transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    document.querySelector('.skill-tree-grid').style.transform = transform;
  }
  
  // 重置視圖到中心
  resetView() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    
    // 平滑動畫重置
    document.querySelector('.skill-tree-grid').animate([
      { transform: document.querySelector('.skill-tree-grid').style.transform },
      { transform: 'translate(0px, 0px) scale(1)' }
    ], {
      duration: 500,
      easing: 'ease-out',
      fill: 'forwards'
    });
  }
}
```

#### 4.3.2 小地圖導航
```javascript
// 技能樹小地圖
class SkillTreeMinimap {
  constructor(skillTree, viewport) {
    this.skillTree = skillTree;
    this.viewport = viewport;
    this.minimapScale = 0.1;
    
    this.createMinimap();
  }
  
  createMinimap() {
    const minimap = document.createElement('div');
    minimap.className = 'skill-tree-minimap';
    minimap.innerHTML = `
      <div class="minimap-viewport"></div>
      <svg class="minimap-tree"></svg>
    `;
    
    // 繪製簡化的技能樹結構
    this.renderMinimapTree();
    
    // 顯示當前視窗範圍
    this.updateViewportIndicator();
    
    document.body.appendChild(minimap);
  }
  
  renderMinimapTree() {
    const svg = document.querySelector('.minimap-tree');
    const nodes = this.skillTree.getAllNodes();
    
    nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.position.x * this.minimapScale);
      circle.setAttribute('cy', node.position.y * this.minimapScale);
      circle.setAttribute('r', node.type === 'keystone' ? 3 : 1.5);
      circle.setAttribute('fill', this.getNodeColor(node.status));
      svg.appendChild(circle);
    });
  }
  
  getNodeColor(status) {
    switch (status) {
      case 'mastered': return '#d4af37';
      case 'available': return '#3498db';
      case 'locked': return '#7f8c8d';
      default: return '#95a5a6';
    }
  }
}
```

---

## 5. 工作產值展示 (Portfolio)

### 5.1 卡片展示系統

#### 5.1.1 專案卡片結構
```javascript
const projectCardData = {
  id: 'project-001',
  title: '微服務架構重構專案',
  category: 'System Architecture',
  rarity: 'legendary',        // common, rare, epic, legendary
  technologies: ['Spring Boot', 'Docker', 'Kubernetes', 'Redis'],
  description: '將單體應用重構為微服務架構，提升系統可擴展性',
  highlights: [
    '系統響應時間提升 40%',
    '支援 10x 更大的併發量',
    '部署時間從小時縮短至分鐘'
  ],
  images: ['screenshot1.jpg', 'architecture.png'],
  demoUrl: 'https://demo.example.com',
  githubUrl: 'https://github.com/user/project'
};
```

#### 5.1.2 卡片 3D 翻轉效果
```css
.project-card {
  width: 320px;
  height: 220px;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.project-card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
}

.card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
}

/* 稀有度邊框效果 */
.card-rarity-legendary {
  border: 3px solid #ff6b35;
  box-shadow: 0 0 30px rgba(255, 107, 53, 0.6);
  animation: legendary-glow 3s ease-in-out infinite;
}

.card-rarity-epic {
  border: 3px solid #9b59b6;
  box-shadow: 0 0 20px rgba(155, 89, 182, 0.5);
}

.card-rarity-rare {
  border: 3px solid #3498db;
  box-shadow: 0 0 15px rgba(52, 152, 219, 0.4);
}

.card-rarity-common {
  border: 2px solid #95a5a6;
  box-shadow: 0 0 10px rgba(149, 165, 166, 0.3);
}
```

#### 5.1.3 卡片互動行為
```javascript
class ProjectCard {
  constructor(cardData, container) {
    this.data = cardData;
    this.container = container;
    this.isFlipped = false;
    
    this.createElement();
    this.bindEvents();
  }
  
  createElement() {
    this.element = document.createElement('div');
    this.element.className = `project-card card-rarity-${this.data.rarity}`;
    this.element.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="card-header">
            <h3>${this.data.title}</h3>
            <span class="category-badge">${this.data.category}</span>
          </div>
          <div class="card-preview">
            <img src="${this.data.images[0]}" alt="${this.data.title}">
          </div>
          <div class="tech-tags">
            ${this.data.technologies.slice(0, 3).map(tech => 
              `<span class="tech-tag">${tech}</span>`
            ).join('')}
          </div>
        </div>
        
        <div class="card-back">
          <div class="card-details">
            <p>${this.data.description}</p>
            <div class="highlights">
              ${this.data.highlights.map(h => `<div class="highlight">✦ ${h}</div>`).join('')}
            </div>
            <div class="card-actions">
              <button class="btn-demo" onclick="window.open('${this.data.demoUrl}')">
                <i class="icon-play"></i> Demo
              </button>
              <button class="btn-code" onclick="window.open('${this.data.githubUrl}')">
                <i class="icon-code"></i> Code
              </button>
              <button class="btn-detail" onclick="this.showDetailModal()">
                <i class="icon-info"></i> Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.container.appendChild(this.element);
  }
  
  bindEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      
      this.flip();
      playSound('card-flip.mp3');
      
      // 粒子爆發效果
      const rect = this.element.getBoundingClientRect();
      createParticleEffect({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        count: 15,
        colors: ['#d4af37', '#f39c12']
      });
    });
    
    this.element.addEventListener('mouseenter', () => {
      this.element.style.transform = 'translateY(-5px)';
      playSound('card-hover.mp3');
    });
    
    this.element.addEventListener('mouseleave', () => {
      this.element.style.transform = 'translateY(0)';
    });
  }
  
  flip() {
    this.isFlipped = !this.isFlipped;
    const cardInner = this.element.querySelector('.card-inner');
    cardInner.style.transform = this.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
  }
  
  showDetailModal() {
    // 詳細資訊模態框
    const modal = new ProjectDetailModal(this.data);
    modal.show();
  }
}
```

### 5.2 專案分類與篩選

#### 5.2.1 分類選單
```javascript
const projectCategories = [
  { id: 'all', name: '全部專案', icon: 'grid' },
  { id: 'backend', name: '後端開發', icon: 'server' },
  { id: 'architecture', name: '系統架構', icon: 'sitemap' },
  { id: 'ai-ml', name: 'AI/ML', icon: 'robot' },
  { id: 'devops', name: 'DevOps', icon: 'cogs' },
  { id: 'mobile', name: '行動應用', icon: 'mobile' }
];

// 分類篩選功能
function filterProjects(categoryId) {
  const allCards = document.querySelectorAll('.project-card');
  
  allCards.forEach(card => {
    const cardCategory = card.dataset.category;
    
    if (categoryId === 'all' || cardCategory === categoryId) {
      // 顯示動畫
      card.animate([
        { opacity: 0, transform: 'scale(0.8)' },
        { opacity: 1, transform: 'scale(1)' }
      ], {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards'
      });
      card.style.display = 'block';
    } else {
      // 隱藏動畫
      card.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.8)' }
      ], {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards'
      }).onfinish = () => {
        card.style.display = 'none';
      };
    }
  });
}
```

---

## 6. 個人專案 (Projects)

### 6.1 遊戲王卡牌系統

#### 6.1.1 卡牌資料結構
```javascript
const cardData = {
  id: 'project-card-001',
  name: 'AI 聊天機器人',
  type: 'AI Application',
  rarity: 'SR',                    // N, R, SR, UR
  level: 7,
  attack: 2500,                    // 專案複雜度
  defense: 2100,                   // 程式碼品質
  attribute: 'AI',                 // 專案屬性
  description: '整合 OpenAI API 的智慧對話系統',
  effect: '可處理多輪對話，具備上下文理解能力',
  technologies: ['Python', 'FastAPI', 'OpenAI', 'PostgreSQL'],
  cardArt: 'ai-chatbot-art.jpg',
  foil: true,                      // 閃卡效果
  createdDate: '2024-03',
  githubUrl: 'https://github.com/user/ai-chatbot',
  demoUrl: 'https://chatbot-demo.vercel.app'
};
```

#### 6.1.2 卡牌視覺設計
```css
.yugioh-card {
  width: 240px;
  height: 350px;
  position: relative;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.yugioh-card:hover {
  transform: translateY(-10px) rotateX(5deg);
}

/* 稀有度邊框 */
.card-rarity-ur {
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
  background-size: 200% 200%;
  animation: rainbow-border 3s ease infinite;
}

.card-rarity-sr {
  background: linear-gradient(45deg, #c0392b, #e74c3c, #c0392b);
  background-size: 200% 200%;
  animation: sr-glow 2s ease infinite;
}

.card-rarity-r {
  background: linear-gradient(45deg, #8e44ad, #9b59b6, #8e44ad);
  background-size: 200% 200%;
  animation: rare-shine 2s ease infinite;
}

.card-rarity-n {
  background: #34495e;
  border: 2px solid #7f8c8d;
}

/* 卡牌內容區域 */
.card-content {
  background: #ecf0f1;
  margin: 8px;
  border-radius: 8px;
  height: calc(100% - 16px);
  position: relative;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  padding: 8px;
  text-align: center;
}

.card-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.card-type {
  font-size: 10px;
  opacity: 0.8;
}

.card-artwork {
  width: 100%;
  height: 140px;
  background-size: cover;
  background-position: center;
  border: 2px solid #bdc3c7;
  margin: 8px 0;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  font-weight: bold;
  color: #2c3e50;
}

.card-description {
  padding: 8px;
  font-size: 11px;
  line-height: 1.3;
  color: #2c3e50;
  background: #ffffff;
  margin: 8px;
  border-radius: 4px;
  min-height: 60px;
}

/* 閃卡效果 */
.card-foil::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: foil-shine 3s ease infinite;
  z-index: 10;
}

@keyframes foil-shine {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: -100%; }
}
```

#### 6.1.3 卡牌召喚動畫
```javascript
class YugiohCard {
  constructor(cardData, container) {
    this.data = cardData;
    this.container = container;
    this.isFlipped = false;
    this.element = null;
    
    this.createElement();
    this.bindEvents();
  }
  
  createElement() {
    this.element = document.createElement('div');
    this.element.className = `yugioh-card card-rarity-${this.data.rarity.toLowerCase()}`;
    if (this.data.foil) {
      this.element.classList.add('card-foil');
    }
    
    this.element.innerHTML = `
      <div class="card-content">
        <div class="card-header">
          <div class="card-name">${this.data.name}</div>
          <div class="card-type">[${this.data.type}]</div>
        </div>
        
        <div class="card-artwork" style="background-image: url('${this.data.cardArt}')"></div>
        
        <div class="card-level">
          ${'★'.repeat(this.data.level)}
        </div>
        
        <div class="card-description">
          <p><strong>Effect:</strong> ${this.data.effect}</p>
          <div class="tech-stack">
            <strong>Tech Stack:</strong> ${this.data.technologies.join(', ')}
          </div>
        </div>
        
        <div class="card-stats">
          <span class="attack">ATK/${this.data.attack}</span>
          <span class="defense">DEF/${this.data.defense}</span>
        </div>
        
        <div class="card-actions" style="display: none;">
          <button class="btn-summon" onclick="this.summonCard()">召喚</button>
          <button class="btn-detail" onclick="this.showDetails()">詳情</button>
        </div>
      </div>
    `;
    
    this.container.appendChild(this.element);
  }
  
  bindEvents() {
    this.element.addEventListener('click', () => {
      this.flipCard();
    });
    
    this.element.addEventListener('mouseenter', () => {
      this.hoverEffect();
    });
  }
  
  // 卡牌翻轉顯示操作選項
  flipCard() {
    if (this.isFlipped) return;
    
    this.isFlipped = true;
    playSound('card-flip.mp3');
    
    // 翻轉動畫
    this.element.animate([
      { transform: 'rotateY(0deg)' },
      { transform: 'rotateY(90deg)' },
      { transform: 'rotateY(0deg)' }
    ], {
      duration: 600,
      easing: 'ease-in-out'
    });
    
    // 顯示操作按鈕
    setTimeout(() => {
      this.element.querySelector('.card-actions').style.display = 'flex';
    }, 300);
  }
  
  // 召喚動畫 (展示專案)
  summonCard() {
    // 創建召喚特效
    this.createSummonEffect();
    
    // 卡牌放大並移動到場中央
    const battleField = document.querySelector('.battle-field');
    const cardClone = this.element.cloneNode(true);
    
    // 召喚動畫
    cardClone.animate([
      { 
        transform: 'scale(0.8) rotate(0deg)',
        opacity: 0.8
      },
      { 
        transform: 'scale(1.2) rotate(360deg)',
        opacity: 1,
        filter: 'brightness(1.5)'
      },
      { 
        transform: 'scale(1) rotate(360deg)',
        opacity: 1,
        filter: 'brightness(1)'
      }
    ], {
      duration: 1200,
      easing: 'ease-out'
    });
    
    battleField.appendChild(cardClone);
    playSound('summon.mp3');
    
    // 3秒後顯示專案詳情
    setTimeout(() => {
      this.showProjectDetail();
    }, 1500);
  }
  
  createSummonEffect() {
    // 魔法陣效果
    const magicCircle = document.createElement('div');
    magicCircle.className = 'magic-circle';
    magicCircle.innerHTML = `
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.8"/>
        <circle cx="100" cy="100" r="60" fill="none" stroke="#f39c12" stroke-width="1" opacity="0.6"/>
        <circle cx="100" cy="100" r="40" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.4"/>
        <!-- 魔法符號 -->
        <path d="M100,40 L120,80 L100,70 L80,80 Z" fill="#d4af37" opacity="0.7"/>
        <path d="M40,100 L80,120 L70,100 L80,80 Z" fill="#d4af37" opacity="0.7"/>
        <path d="M100,160 L120,120 L100,130 L80,120 Z" fill="#d4af37" opacity="0.7"/>
        <path d="M160,100 L120,80 L130,100 L120,120 Z" fill="#d4af37" opacity="0.7"/>
      </svg>
    `;
    
    const rect = this.element.getBoundingClientRect();
    magicCircle.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      pointer-events: none;
      z-index: 1000;
      animation: rotate 2s linear infinite;
    `;
    
    document.body.appendChild(magicCircle);
    
    // 2秒後移除特效
    setTimeout(() => {
      magicCircle.remove();
    }, 2000);
  }
  
  showProjectDetail() {
    const modal = new ProjectDetailModal(this.data);
    modal.show();
  }
}
```

### 6.2 卡組展示系統

#### 6.2.1 卡組分類
```javascript
const cardDecks = {
  'backend-deck': {
    name: '後端開發卡組',
    description: '展示後端開發相關專案',
    coverCard: 'microservices-architecture',
    cards: ['api-gateway', 'user-auth-system', 'payment-service', 'notification-system']
  },
  
  'ai-deck': {
    name: 'AI/ML 應用卡組', 
    description: '人工智慧與機器學習專案',
    coverCard: 'llm-chatbot',
    cards: ['prompt-optimizer', 'rag-system', 'ai-code-reviewer', 'sentiment-analyzer']
  },
  
  'fullstack-deck': {
    name: '全端開發卡組',
    description: '前後端整合專案',
    coverCard: 'portfolio-website',
    cards: ['task-management-app', 'e-commerce-platform', 'social-media-dashboard']
  }
};

// 卡組選擇界面
function renderDeckSelector() {
  const deckSelector = document.querySelector('.deck-selector');
  
  Object.entries(cardDecks).forEach(([deckId, deck]) => {
    const deckElement = document.createElement('div');
    deckElement.className = 'deck-item';
    deckElement.innerHTML = `
      <div class="deck-cover">
        <img src="cards/${deck.coverCard}.jpg" alt="${deck.name}">
        <div class="deck-overlay">
          <h3>${deck.name}</h3>
          <p>${deck.description}</p>
          <span class="card-count">${deck.cards.length} 張卡片</span>
        </div>
      </div>
    `;
    
    deckElement.addEventListener('click', () => {
      openDeck(deckId);
      playSound('deck-open.mp3');
    });
    
    deckSelector.appendChild(deckElement);
  });
}

// 打開卡組動畫
function openDeck(deckId) {
  const deck = cardDecks[deckId];
  const cardContainer = document.querySelector('.card-container');
  
  // 清空現有卡片
  cardContainer.innerHTML = '';
  
  // 依序召喚卡片
  deck.cards.forEach((cardId, index) => {
    setTimeout(() => {
      const cardData = getCardData(cardId);
      const card = new YugiohCard(cardData, cardContainer);
      
      // 入場動畫
      card.element.style.opacity = '0';
      card.element.style.transform = 'translateY(50px) rotateX(-90deg)';
      
      card.element.animate([
        { 
          opacity: 0,
          transform: 'translateY(50px) rotateX(-90deg)'
        },
        { 
          opacity: 1,
          transform: 'translateY(0) rotateX(0deg)'
        }
      ], {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards'
      });
      
      playSound('card-draw.mp3');
    }, index * 200);
  });
}
```

---

## 7. 聯絡資訊 (Contact)

### 7.1 公會聯繫介面

#### 7.1.1 社群連結設計
```javascript
const socialLinks = [
  {
    platform: 'GitHub',
    url: 'https://github.com/username',
    icon: 'github',
    color: '#333',
    description: '查看我的程式碼作品'
  },
  {
    platform: 'LinkedIn', 
    url: 'https://linkedin.com/in/username',
    icon: 'linkedin',
    color: '#0077b5',
    description: '專業經歷與人脈連結'
  },
  {
    platform: 'Email',
    url: 'mailto:contact@example.com',
    icon: 'envelope',
    color: '#e74c3c',
    description: '直接聯繫討論合作機會'
  }
];

// 社群連結渲染
function renderSocialLinks() {
  const container = document.querySelector('.social-links');
  
  socialLinks.forEach((link, index) => {
    const linkElement = document.createElement('div');
    linkElement.className = 'social-link-item';
    linkElement.innerHTML = `
      <div class="social-icon" style="--accent-color: ${link.color}">
        <i class="fab fa-${link.icon}"></i>
      </div>
      <div class="social-info">
        <h3>${link.platform}</h3>
        <p>${link.description}</p>
      </div>
      <div class="social-action">
        <button onclick="window.open('${link.url}')" class="btn-connect">
          連接
        </button>
      </div>
    `;
    
    // 延遲入場動畫
    setTimeout(() => {
      linkElement.animate([
        { opacity: 0, transform: 'translateX(-50px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
    }, index * 150);
    
    container.appendChild(linkElement);
  });
}
```

#### 7.1.2 互動特效
```css
.social-link-item {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border-radius: 12px;
  padding: 20px;
  margin: 12px 0;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.social-link-item:hover {
  transform: translateX(10px);
  border-color: var(--accent-color);
  box-shadow: 0 5px 20px rgba(var(--accent-color), 0.3);
}

.social-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.btn-connect {
  background: var(--accent-color);
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-connect:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 10px rgba(var(--accent-color), 0.4);
}
```

---

## 8. 全域系統功能

### 8.1 音效系統

#### 8.1.1 音效管理器
```javascript
class AudioManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.3;
    
    this.loadSounds();
    this.createVolumeControl();
  }
  
  loadSounds() {
    const soundFiles = [
      'click.mp3',
      'hover.mp3', 
      'card-flip.mp3',
      'card-draw.mp3',
      'summon.mp3',
      'levelup.mp3',
      'error.mp3',
      'success.mp3'
    ];
    
    soundFiles.forEach(file => {
      const audio = new Audio(`/assets/sounds/${file}`);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds[file.replace('.mp3', '')] = audio;
    });
  }
  
  play(soundName) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Audio play failed:', e));
    }
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }
  
  toggle() {
    this.enabled = !this.enabled;
    this.updateVolumeIcon();
  }
  
  createVolumeControl() {
    const control = document.createElement('div');
    control.className = 'audio-control';
    control.innerHTML = `
      <button class="volume-toggle" onclick="audioManager.toggle()">
        <i class="fas fa-volume-up"></i>
      </button>
      <input type="range" class="volume-slider" 
             min="0" max="1" step="0.1" value="${this.volume}"
             onchange="audioManager.setVolume(this.value)">
    `;
    
    document.body.appendChild(control);
  }
  
  updateVolumeIcon() {
    const icon = document.querySelector('.volume-toggle i');
    icon.className = this.enabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
  }
}

// 全域音效管理器
const audioManager = new AudioManager();

// 全域音效播放函數
function playSound(soundName) {
  audioManager.play(soundName);
}
```

### 8.2 粒子效果系統

#### 8.2.1 粒子管理器
```javascript
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    
    this.initCanvas();
    this.startAnimation();
  }
  
  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'particle-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 5;
    `;
    
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticle(x, y, options = {}) {
    const particle = {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * (options.velocityRange || 4),
      vy: (Math.random() - 0.5) * (options.velocityRange || 4),
      life: options.life || 1,
      decay: options.decay || 0.02,
      size: options.size || Math.random() * 3 + 1,
      color: options.color || '#d4af37',
      trail: options.trail || false
    };
    
    this.particles.push(particle);
  }
  
  burst(x, y, count = 20, options = {}) {
    for (let i = 0; i < count; i++) {
      this.createParticle(x, y, {
        ...options,
        velocityRange: options.velocityRange || 8,
        size: Math.random() * 4 + 2
      });
    }
  }
  
  update() {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // 重力
      particle.life -= particle.decay;
      
      return particle.life > 0;
    });
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }
  
  startAnimation() {
    const animate = () => {
      this.update();
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// 全域粒子系統
const particleSystem = new ParticleSystem();

// 便利函數
function createParticleEffect(options) {
  const { x, y, count = 15, colors = ['#d4af37', '#f39c12'] } = options;
  
  for (let i = 0; i < count; i++) {
    particleSystem.createParticle(x, y, {
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityRange: 6,
      life: Math.random() * 0.5 + 0.5,
      size: Math.random() * 3 + 1
    });
  }
}
```

### 8.3 載入系統

#### 8.3.1 預載入管理器
```javascript
class PreloadManager {
  constructor() {
    this.resources = [];
    this.loaded = 0;
    this.total = 0;
    
    this.createLoadingScreen();
  }
  
  addResource(url, type = 'image') {
    this.resources.push({ url, type, loaded: false });
    this.total++;
  }
  
  loadAll() {
    return Promise.all(
      this.resources.map(resource => this.loadResource(resource))
    );
  }
  
  loadResource(resource) {
    return new Promise((resolve, reject) => {
      if (resource.type === 'image') {
        const img = new Image();
        img.onload = () => {
          resource.loaded = true;
          this.loaded++;
          this.updateProgress();
          resolve(img);
        };
        img.onerror = reject;
        img.src = resource.url;
      } else if (resource.type === 'audio') {
        const audio = new Audio();
        audio.oncanplaythrough = () => {
          resource.loaded = true;
          this.loaded++;
          this.updateProgress();
          resolve(audio);
        };
        audio.onerror = reject;
        audio.src = resource.url;
      }
    });
  }
  
  updateProgress() {
    const progress = (this.loaded / this.total) * 100;
    const progressBar = document.querySelector('.loading-progress-fill');
    const progressText = document.querySelector('.loading-percentage');
    
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    if (progressText) {
      progressText.textContent = `${Math.round(progress)}%`;
    }
    
    if (progress === 100) {
      setTimeout(() => this.hideLoadingScreen(), 500);
    }
  }
  
  createLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
      <div class="loading-content">
        <div class="loading-title">Loading Adventure</div>
        <div class="loading-progress">
          <div class="loading-progress-fill"></div>
        </div>
        <div class="loading-percentage">0%</div>
        <div class="loading-tips">
          <p>正在載入技能樹數據...</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(loadingScreen);
  }
  
  hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: 800,
        easing: 'ease-out'
      }).onfinish = () => {
        loadingScreen.remove();
      };
    }
  }
}
```

---

## 9. 效能優化規格

### 9.1 懶加載策略
```javascript
// 圖片懶加載
class LazyLoader {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { rootMargin: '50px' }
    );
  }
  
  observe(elements) {
    elements.forEach(el => this.observer.observe(el));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        this.observer.unobserve(img);
      }
    });
  }
}

// 內容分塊載入
class ChunkedLoader {
  constructor() {
    this.chunks = new Map();
  }
  
  defineChunk(name, loadFunction) {
    this.chunks.set(name, {
      loaded: false,
      loading: false,
      loadFunction
    });
  }
  
  async loadChunk(name) {
    const chunk = this.chunks.get(name);
    if (!chunk || chunk.loaded || chunk.loading) return;
    
    chunk.loading = true;
    try {
      await chunk.loadFunction();
      chunk.loaded = true;
      chunk.loading = false;
    } catch (error) {
      chunk.loading = false;
      console.error(`Failed to load chunk ${name}:`, error);
    }
  }
}
```

### 9.2 動畫效能優化
```javascript
// 動畫節流
class AnimationThrottler {
  constructor() {
    this.rafId = null;
    this.callbacks = new Set();
  }
  
  add(callback) {
    this.callbacks.add(callback);
    this.start();
  }
  
  remove(callback) {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }
  
  start() {
    if (this.rafId) return;
    
    const animate = () => {
      this.callbacks.forEach(callback => callback());
      this.rafId = requestAnimationFrame(animate);
    };
    
    this.rafId = requestAnimationFrame(animate);
  }
  
  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

// 視窗外動畫暫停
class VisibilityManager {
  constructor() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }
  
  pauseAnimations() {
    document.querySelectorAll('.animated').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }
  
  resumeAnimations() {
    document.querySelectorAll('.animated').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
}
```

---

## 10. 開發與測試規範

### 10.1 代碼組織結構
```
src/
├── components/           # 可重用組件
│   ├── SkillTree/       # 技能樹組件
│   ├── ProjectCard/     # 專案卡片組件
│   └── ParticleSystem/  # 粒子系統組件
├── pages/               # 頁面組件
│   ├── Landing.js
│   ├── About.js
│   ├── Skills.js
│   ├── Portfolio.js
│   └── Contact.js
├── systems/             # 系統管理器
│   ├── AudioManager.js
│   ├── AnimationManager.js
│   └── PreloadManager.js
├── data/               # 數據文件
│   ├── skillTree.js
│   ├── projects.js
│   └── profile.js
├── assets/             # 靜態資源
│   ├── images/
│   ├── sounds/
│   └── fonts/
└── styles/             # 樣式文件
    ├── global.css
    ├── components/
    └── themes/
```

### 10.2 測試檢查清單
```javascript
// 功能測試清單
const testCases = {
  skillTree: [
    '技能節點點擊響應',
    '技能狀態正確顯示',
    '技能路徑連線正確',
    '拖曳縮放功能正常',
    '技能詳情彈窗顯示'
  