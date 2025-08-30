/**
 * Config-Driven 技能樹系統
 * 讀取配置文件，按照規則生成技能樹
 */
class SimpleSkillTree {
  constructor() {
    this.svg = document.getElementById('skillTreeSvg');
    this.hexSystem = new HexCoordSystem(30);
    this.config = window.SKILL_TREE_CONFIG;
    this.nodes = [];
    this.connections = [];
    this.skillTypeDisplay = document.getElementById('skillTypeDisplay');
    
    // SVG 視窗中心點和拖曳狀態
    this.centerX = 600;
    this.centerY = 400;
    this.isDragging = false;
    this.dragMode = false;
    this.lastPanPoint = { x: 0, y: 0 };
    this.currentPan = { x: 0, y: 0 };
    
    // UI 元素
    this.dragBtn = document.getElementById('dragBtn');
    this.overviewBtn = document.getElementById('overviewBtn');
    this.modal = document.getElementById('skillOverviewModal');
    this.closeModalBtn = document.getElementById('closeModal');
    
    this.initialize();
    this.initializeUI();
  }

  initialize() {
    console.log('初始化 Config-Driven 技能樹系統...');
    console.log('載入的配置:', this.config);
    
    // 生成背景六角網格
    this.createHexGrid();
    
    // 從配置生成技能樹
    this.generateFromConfig();
    
    // 生成連接線
    this.generateConnections();
    
    // 渲染到 SVG
    this.render();
    
    console.log('技能樹初始化完成');
  }

  createHexGrid() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'hexGrid');
    pattern.setAttribute('x', '0');
    pattern.setAttribute('y', '0');
    pattern.setAttribute('width', '60');
    pattern.setAttribute('height', '52');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');

    const hexPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hexPath.setAttribute('d', 'M30,4 L52,17 L52,39 L30,52 L8,39 L8,17 Z');
    hexPath.setAttribute('fill', 'none');
    hexPath.setAttribute('stroke', 'rgba(255,255,255,0.08)');
    hexPath.setAttribute('stroke-width', '1');
    
    pattern.appendChild(hexPath);
    defs.appendChild(pattern);
    this.svg.appendChild(defs);

    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'url(#hexGrid)');
    this.svg.appendChild(background);
  }

  generateFromConfig() {
    // 1. 添加中心節點
    const centerNode = {
      id: 'center',
      hex: { q: 0, r: 0 },
      name: '',
      type: 'center',
      skillLevel: 'center',
      color: '#d4af37'
    };
    this.nodes.push(centerNode);

    // 2. 重新計算所有技能的位置，確保六個方向均勻分佈
    this.redistributeSkillsByDirection();

    console.log(`從配置生成了 ${this.nodes.length} 個節點`);
  }

  redistributeSkillsByDirection() {
    // 按技能類型分組
    const skillsByType = {};
    this.config.skills.forEach(skill => {
      if (!skillsByType[skill.type]) {
        skillsByType[skill.type] = { major: [], minor: [] };
      }
      skillsByType[skill.type][skill.skillLevel].push(skill);
    });

    // 已佔用的位置記錄（避免重疊）
    const occupiedPositions = new Set();
    occupiedPositions.add('0,0'); // 中心點

    // 為每個技能類型重新分配座標
    Object.keys(skillsByType).forEach(type => {
      const typeInfo = this.config.types[type];
      const direction = typeInfo.direction; // 0, 60, 120, 180, 240, 300 度
      const majorSkills = skillsByType[type].major;
      const minorSkills = skillsByType[type].minor;

      // 使用六角座標系統的正確方向向量
      const hexDirections = [
        { q: 1, r: 0 },   // 0度 - 右
        { q: 0, r: -1 },  // 60度 - 右上  
        { q: -1, r: -1 }, // 120度 - 左上
        { q: -1, r: 0 },  // 180度 - 左
        { q: 0, r: 1 },   // 240度 - 左下
        { q: 1, r: 1 }    // 300度 - 右下
      ];
      
      const dirIndex = direction / 60;
      const baseDirection = hexDirections[dirIndex];

      // 排序大技能按難度
      majorSkills.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));

      // 分配大技能位置（沿著六角方向延伸）
      majorSkills.forEach((skill, index) => {
        const distance = 2 + index * 2; // 距離中心 2, 4, 6...
        const q = baseDirection.q * distance;
        const r = baseDirection.r * distance;
        
        // 確保位置不重疊
        let finalQ = q, finalR = r;
        let attempts = 0;
        while (occupiedPositions.has(`${finalQ},${finalR}`) && attempts < 10) {
          // 如果位置被佔用，嘗試鄰近位置
          const offset = Math.floor(attempts / 2) + 1;
          const side = attempts % 2 === 0 ? 1 : -1;
          if (dirIndex % 2 === 0) {
            finalQ = q + offset * side;
          } else {
            finalR = r + offset * side;
          }
          attempts++;
        }
        
        occupiedPositions.add(`${finalQ},${finalR}`);
        const node = this.createNodeFromSkill(skill, { q: finalQ, r: finalR });
        this.nodes.push(node);
      });

      // 分配小技能位置（圍繞對應的大技能，使用六角鄰居）
      const minorsByMajor = {};
      minorSkills.forEach(skill => {
        const relatedMajorId = skill.relatedTo?.[0];
        if (!minorsByMajor[relatedMajorId]) {
          minorsByMajor[relatedMajorId] = [];
        }
        minorsByMajor[relatedMajorId].push(skill);
      });

      Object.keys(minorsByMajor).forEach(majorId => {
        const relatedMajor = majorSkills.find(m => m.id === majorId);
        const minorsForMajor = minorsByMajor[majorId];
        
        if (relatedMajor) {
          const majorIndex = majorSkills.indexOf(relatedMajor);
          const majorDistance = 2 + majorIndex * 2;
          const majorQ = baseDirection.q * majorDistance;
          const majorR = baseDirection.r * majorDistance;
          
          // 找到大技能的實際位置（考慮可能的偏移）
          let actualMajorQ = majorQ, actualMajorR = majorR;
          const majorNode = this.nodes.find(n => n.id === majorId);
          if (majorNode) {
            actualMajorQ = majorNode.hex.q;
            actualMajorR = majorNode.hex.r;
          }
          
          // 獲取大技能周圍的六角鄰居位置
          const neighborOffsets = [
            { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
            { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
          ];
          
          minorsForMajor.forEach((skill, minorIndex) => {
            // 從可用的鄰居位置中選擇
            let placed = false;
            for (let i = 0; i < neighborOffsets.length && !placed; i++) {
              const offsetIndex = (minorIndex + i) % neighborOffsets.length;
              const offset = neighborOffsets[offsetIndex];
              const q = actualMajorQ + offset.q;
              const r = actualMajorR + offset.r;
              
              if (!occupiedPositions.has(`${q},${r}`)) {
                occupiedPositions.add(`${q},${r}`);
                const node = this.createNodeFromSkill(skill, { q, r });
                this.nodes.push(node);
                placed = true;
              }
            }
            
            // 如果直接鄰居都被佔用，嘗試距離2的位置
            if (!placed) {
              for (let distance = 2; distance <= 3 && !placed; distance++) {
                for (let i = 0; i < neighborOffsets.length && !placed; i++) {
                  const offset = neighborOffsets[i];
                  const q = actualMajorQ + offset.q * distance;
                  const r = actualMajorR + offset.r * distance;
                  
                  if (!occupiedPositions.has(`${q},${r}`)) {
                    occupiedPositions.add(`${q},${r}`);
                    const node = this.createNodeFromSkill(skill, { q, r });
                    this.nodes.push(node);
                    placed = true;
                  }
                }
              }
            }
          });
        }
      });
    });
  }

  createNodeFromSkill(skillConfig, hexCoord) {
    const typeInfo = this.config.types[skillConfig.type];
    return {
      id: skillConfig.id,
      hex: hexCoord,
      name: skillConfig.name,
      type: skillConfig.type,
      skillLevel: skillConfig.skillLevel,
      color: typeInfo.color,
      proficiency: skillConfig.proficiency,
      description: skillConfig.description,
      difficulty: skillConfig.difficulty,
      relatedTo: skillConfig.relatedTo || []
    };
  }

  generateConnections() {
    const centerNode = this.nodes.find(n => n.type === 'center');
    const majorSkills = this.nodes.filter(n => n.skillLevel === 'major');
    const minorSkills = this.nodes.filter(n => n.skillLevel === 'minor');

    // 規則1: 中心點連到最近的各type大技能
    Object.keys(this.config.types).forEach(type => {
      const typeMajorSkills = majorSkills.filter(n => n.type === type);
      if (typeMajorSkills.length > 0) {
        // 找到離中心最近的大技能
        let closest = typeMajorSkills[0];
        let minDistance = this.hexSystem.hexDistance(centerNode.hex, closest.hex);
        
        typeMajorSkills.forEach(skill => {
          const distance = this.hexSystem.hexDistance(centerNode.hex, skill.hex);
          if (distance < minDistance) {
            minDistance = distance;
            closest = skill;
          }
        });
        
        this.connections.push({
          from: centerNode.hex,
          to: closest.hex,
          type: 'center-to-major',
          skillType: type
        });
      }
    });

    // 規則2: 大技能連到同type的其他大技能(按difficulty排序)
    Object.keys(this.config.types).forEach(type => {
      const typeMajorSkills = majorSkills.filter(n => n.type === type);
      
      // 按照 difficulty 排序 (基本 -> 高階)
      typeMajorSkills.sort((a, b) => {
        const diffA = a.difficulty || 1;
        const diffB = b.difficulty || 1;
        return diffA - diffB;
      });
      
      // 依序連接：基本 -> 中階 -> 高階
      for (let i = 0; i < typeMajorSkills.length - 1; i++) {
        this.connections.push({
          from: typeMajorSkills[i].hex,
          to: typeMajorSkills[i + 1].hex,
          type: 'major-to-major',
          skillType: type
        });
      }
    });

    // 規則3: 大技能延伸到相關的小技能
    minorSkills.forEach(minorSkill => {
      if (minorSkill.relatedTo && minorSkill.relatedTo.length > 0) {
        // 找到相關的大技能
        minorSkill.relatedTo.forEach(relatedId => {
          const relatedMajor = majorSkills.find(n => n.id === relatedId);
          if (relatedMajor) {
            this.connections.push({
              from: relatedMajor.hex,
              to: minorSkill.hex,
              type: 'major-to-minor',
              skillType: minorSkill.type
            });
          }
        });
      }
    });

    // 規則4: 移除小技能之間的連接，保持樹狀結構
    // 不再創建小技能之間的連接，避免蛛網式連接

    console.log(`生成了 ${this.connections.length} 條連接線`);
  }

  render() {
    // 先畫連接線
    this.renderConnections();
    
    // 再畫節點
    this.renderNodes();
  }

  renderConnections() {
    this.connections.forEach(conn => {
      const fromPixel = this.hexSystem.hexToPixel(conn.from);
      const toPixel = this.hexSystem.hexToPixel(conn.to);
      
      const fromX = fromPixel.x + this.centerX;
      const fromY = fromPixel.y + this.centerY;
      const toX = toPixel.x + this.centerX;
      const toY = toPixel.y + this.centerY;
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromX);
      line.setAttribute('y1', fromY);
      line.setAttribute('x2', toX);
      line.setAttribute('y2', toY);
      
      // 根據連接類型和技能領域設置不同樣式
      const skillTypeColor = conn.skillType ? this.config.types[conn.skillType].color : '#666';
      
      switch (conn.type) {
        case 'center-to-major':
          line.setAttribute('stroke', skillTypeColor);
          line.setAttribute('stroke-width', '3');
          line.setAttribute('opacity', '0.8');
          break;
        case 'major-to-major':
          line.setAttribute('stroke', skillTypeColor);
          line.setAttribute('stroke-width', '2');
          line.setAttribute('opacity', '0.7');
          break;
        case 'major-to-minor':
          line.setAttribute('stroke', skillTypeColor);
          line.setAttribute('stroke-width', '1.5');
          line.setAttribute('opacity', '0.6');
          break;
        default:
          line.setAttribute('stroke', '#555');
          line.setAttribute('stroke-width', '1');
          line.setAttribute('opacity', '0.6');
      }
      
      this.svg.appendChild(line);
    });
  }

  renderNodes() {
    this.nodes.forEach(node => {
      const pixel = this.hexSystem.hexToPixel(node.hex);
      const centerX = pixel.x + this.centerX;
      const centerY = pixel.y + this.centerY;
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', centerX);
      circle.setAttribute('cy', centerY);
      
      if (node.type === 'center') {
        // 中心節點
        circle.setAttribute('r', '10');
        circle.setAttribute('fill', '#d4af37');
        circle.setAttribute('stroke', '#f4d03f');
        circle.setAttribute('stroke-width', '3');
      } else if (node.skillLevel === 'major') {
        // 大技能節點 - 不受熟練度影響
        circle.setAttribute('r', '7');
        circle.setAttribute('fill', node.color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
      } else {
        // 小技能節點 - 根據熟練度調整透明度
        circle.setAttribute('r', '4');
        const proficiencyInfo = this.config.proficiencyLevels[node.proficiency] || 
                               this.config.proficiencyLevels['O']; // 預設為熟練
        
        circle.setAttribute('fill', node.color);
        circle.setAttribute('fill-opacity', proficiencyInfo.opacity);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '1');
        
        // 根據熟練度添加不同的視覺效果
        if (node.proficiency === 'O') {
          // 熟練 - 完全不透明 + 發光效果
          circle.style.filter = 'drop-shadow(0 0 3px ' + node.color + ')';
        } else if (node.proficiency === '*') {
          // 略懂 - 70% 透明度
          circle.style.filter = 'none';
        } else if (node.proficiency === 'X') {
          // 待學習 - 40% 透明度 + 虛線邊框
          circle.setAttribute('stroke-dasharray', '2,2');
        }
      }
      
      // 設置樣式和事件
      circle.style.cursor = 'pointer';
      circle.style.transition = 'all 0.2s ease';
      
      // 滑鼠事件
      circle.addEventListener('mouseenter', () => {
        const currentR = parseFloat(circle.getAttribute('r'));
        circle.setAttribute('r', currentR * 1.4);
        
        if (node.name) {
          this.showSkillCard(centerX, centerY, node);
        }
        
        // 顯示技能類型名稱
        if (node.type !== 'center') {
          this.showSkillType(node.type);
        }
      });
      
      circle.addEventListener('mouseleave', () => {
        if (node.type === 'center') {
          circle.setAttribute('r', '10');
        } else if (node.skillLevel === 'major') {
          circle.setAttribute('r', '7');
        } else {
          circle.setAttribute('r', '4');
        }
        
        this.hideSkillCard();
        this.hideSkillType();
      });
      
      circle.addEventListener('click', () => {
        console.log('點擊技能:', node.name || '中心點', '類型:', node.type, '級別:', node.skillLevel, '熟練度:', node.proficiency);
      });
      
      this.svg.appendChild(circle);
    });
  }

  showSkillCard(x, y, node) {
    this.hideSkillCard();
    
    const typeInfo = this.config.types[node.type];
    
    // 決定卡片內容
    let cardContent = [];
    let cardWidth = 200;
    let cardHeight = 60;
    
    if (node.skillLevel === 'major') {
      // 大技能卡片：顯示技能名稱與類別
      cardContent = [
        { text: node.name, style: 'title', color: node.color },
        { text: typeInfo ? typeInfo.name : node.type, style: 'category', color: '#ccc' }
      ];
      cardHeight = 50;
    } else {
      // 小技能卡片：顯示名稱、熟練度、描述(如果有)
      const proficiencyInfo = this.config.proficiencyLevels[node.proficiency] || 
                             this.config.proficiencyLevels['O'];
      
      cardContent = [
        { text: node.name, style: 'title', color: node.color },
        { text: `熟練度: ${proficiencyInfo.name}`, style: 'proficiency', color: this.getProficiencyColor(node.proficiency) }
      ];
      
      if (node.description) {
        cardContent.push({ text: node.description, style: 'description', color: '#aaa' });
        cardHeight = 80;
        cardWidth = Math.max(cardWidth, node.description.length * 6);
      }
    }
    
    // 調整卡片位置，避免超出邊界
    let cardX = x - cardWidth / 2;
    let cardY = y - cardHeight - 15;
    
    // 邊界檢查
    const svgRect = this.svg.getBoundingClientRect();
    if (cardX < 10) cardX = 10;
    if (cardX + cardWidth > svgRect.width - 10) cardX = svgRect.width - cardWidth - 10;
    if (cardY < 10) cardY = y + 15; // 如果上方空間不夠，顯示在下方
    
    // 創建卡片背景
    const cardBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    cardBg.setAttribute('id', 'skill-card-bg');
    cardBg.setAttribute('x', cardX);
    cardBg.setAttribute('y', cardY);
    cardBg.setAttribute('width', cardWidth);
    cardBg.setAttribute('height', cardHeight);
    cardBg.setAttribute('fill', 'rgba(0,0,0,0.95)');
    cardBg.setAttribute('stroke', node.color);
    cardBg.setAttribute('stroke-width', '2');
    cardBg.setAttribute('rx', '6');
    cardBg.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
    
    this.svg.appendChild(cardBg);
    
    // 創建卡片內容
    let textY = cardY + 18;
    cardContent.forEach((content, index) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('id', `skill-card-text-${index}`);
      text.setAttribute('x', cardX + 10);
      text.setAttribute('y', textY);
      text.setAttribute('fill', content.color);
      
      switch (content.style) {
        case 'title':
          text.setAttribute('font-size', '14');
          text.setAttribute('font-weight', 'bold');
          break;
        case 'category':
        case 'proficiency':
          text.setAttribute('font-size', '11');
          text.setAttribute('font-weight', '500');
          break;
        case 'description':
          text.setAttribute('font-size', '10');
          text.setAttribute('font-weight', '400');
          break;
      }
      
      text.textContent = content.text;
      this.svg.appendChild(text);
      
      textY += content.style === 'title' ? 18 : 14;
    });
  }

  hideSkillCard() {
    // 移除卡片背景
    const cardBg = document.getElementById('skill-card-bg');
    if (cardBg) cardBg.remove();
    
    // 移除所有卡片文字
    let textIndex = 0;
    let textElement = document.getElementById(`skill-card-text-${textIndex}`);
    while (textElement) {
      textElement.remove();
      textIndex++;
      textElement = document.getElementById(`skill-card-text-${textIndex}`);
    }
  }

  getProficiencyColor(proficiency) {
    switch (proficiency) {
      case 'O': return '#4caf50'; // 綠色 - 熟練
      case '*': return '#ff9800'; // 橙色 - 略懂
      case 'X': return '#f44336'; // 紅色 - 待學習
      default: return '#4caf50';
    }
  }

  showSkillType(skillType) {
    if (this.skillTypeDisplay && this.config.types[skillType]) {
      const typeInfo = this.config.types[skillType];
      this.skillTypeDisplay.textContent = typeInfo.name;
      this.skillTypeDisplay.style.borderColor = typeInfo.color;
      this.skillTypeDisplay.style.color = typeInfo.color;
      this.skillTypeDisplay.classList.add('show');
    }
  }

  hideSkillType() {
    if (this.skillTypeDisplay) {
      this.skillTypeDisplay.classList.remove('show');
    }
  }

  initializeUI() {
    // 拖曳模式按鈕
    this.dragBtn.addEventListener('click', () => {
      this.toggleDragMode();
    });

    // 技能總攬按鈕
    this.overviewBtn.addEventListener('click', () => {
      this.showSkillOverview();
    });

    // 關閉彈窗
    this.closeModalBtn.addEventListener('click', () => {
      this.hideSkillOverview();
    });

    // 點擊彈窗外部關閉
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideSkillOverview();
      }
    });

    // SVG 拖曳事件
    this.initializeDragEvents();
  }

  toggleDragMode() {
    this.dragMode = !this.dragMode;
    
    if (this.dragMode) {
      this.dragBtn.classList.add('active');
      this.svg.style.cursor = 'grab';
      document.body.classList.add('dragging');
    } else {
      this.dragBtn.classList.remove('active');
      this.svg.style.cursor = 'default';
      document.body.classList.remove('dragging');
    }
  }

  initializeDragEvents() {
    let startPan = { x: 0, y: 0 };
    
    const handleMouseDown = (e) => {
      if (!this.dragMode) return;
      
      this.isDragging = true;
      this.svg.style.cursor = 'grabbing';
      
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      startPan = {
        x: clientX - this.currentPan.x,
        y: clientY - this.currentPan.y
      };
      
      e.preventDefault();
    };
    
    const handleMouseMove = (e) => {
      if (!this.isDragging || !this.dragMode) return;
      
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      this.currentPan = {
        x: clientX - startPan.x,
        y: clientY - startPan.y
      };
      
      this.updateViewBox();
      e.preventDefault();
    };
    
    const handleMouseUp = () => {
      if (this.isDragging && this.dragMode) {
        this.isDragging = false;
        this.svg.style.cursor = 'grab';
      }
    };
    
    // 滑鼠事件
    this.svg.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 觸摸事件（移動端）
    this.svg.addEventListener('touchstart', handleMouseDown, { passive: false });
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
    
    // 滾輪縮放
    this.svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      // 這裡可以添加縮放功能
    });
  }

  updateViewBox() {
    const viewBoxX = -this.currentPan.x;
    const viewBoxY = -this.currentPan.y;
    this.svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} 1200 800`);
  }

  showSkillOverview() {
    this.generateSkillOverviewContent();
    this.modal.style.display = 'flex';
  }

  hideSkillOverview() {
    this.modal.style.display = 'none';
  }

  generateSkillOverviewContent() {
    const tabsContainer = document.getElementById('modalTabs');
    const contentContainer = document.getElementById('modalTabContent');
    
    // 清空現有內容
    tabsContainer.innerHTML = '';
    contentContainer.innerHTML = '';
    
    // 生成頁籤和內容
    Object.keys(this.config.types).forEach((typeKey, index) => {
      const typeInfo = this.config.types[typeKey];
      
      // 創建頁籤按鈕
      const tabBtn = document.createElement('button');
      tabBtn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
      tabBtn.textContent = typeInfo.name;
      tabBtn.style.color = typeInfo.color;
      tabBtn.addEventListener('click', () => this.switchTab(typeKey));
      tabsContainer.appendChild(tabBtn);
      
      // 創建內容區域
      const tabContent = document.createElement('div');
      tabContent.className = `tab-content ${index === 0 ? 'active' : ''}`;
      tabContent.id = `tab-${typeKey}`;
      
      // 按熟練度分組技能
      const skillsByProficiency = this.groupSkillsByProficiency(typeKey);
      
      Object.keys(skillsByProficiency).forEach(proficiency => {
        const proficiencyData = this.config.proficiencyLevels[proficiency];
        const skills = skillsByProficiency[proficiency];
        
        if (skills.length > 0) {
          const section = document.createElement('div');
          section.className = 'proficiency-section';
          
          const title = document.createElement('div');
          title.className = 'proficiency-title';
          title.style.color = this.getProficiencyColor(proficiency);
          title.innerHTML = `
            <span>${proficiencyData.name}</span>
            <span style="font-size: 12px; opacity: 0.7;">(${skills.length} 項技能)</span>
          `;
          section.appendChild(title);
          
          const skillList = document.createElement('div');
          skillList.className = 'skill-list';
          
          skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.style.borderLeftColor = typeInfo.color;
            skillItem.innerHTML = `
              <div style="font-weight: bold;">${skill.name}</div>
              ${skill.description ? `<div style="opacity: 0.7; margin-top: 4px;">${skill.description}</div>` : ''}
            `;
            skillList.appendChild(skillItem);
          });
          
          section.appendChild(skillList);
          tabContent.appendChild(section);
        }
      });
      
      contentContainer.appendChild(tabContent);
    });
  }

  groupSkillsByProficiency(typeKey) {
    const typeSkills = this.config.skills.filter(skill => skill.type === typeKey);
    const grouped = {
      'O': [],  // 熟練
      '*': [],  // 略懂
      'X': []   // 待學習
    };
    
    typeSkills.forEach(skill => {
      const proficiency = skill.proficiency || 'O';
      if (grouped[proficiency]) {
        grouped[proficiency].push(skill);
      }
    });
    
    return grouped;
  }

  switchTab(typeKey) {
    // 更新頁籤狀態
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn:nth-child(${Object.keys(this.config.types).indexOf(typeKey) + 1})`).classList.add('active');
    
    // 更新內容顯示
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`tab-${typeKey}`).classList.add('active');
  }
}

// 當頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
  new SimpleSkillTree();
});