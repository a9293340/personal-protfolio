/**
 * 流亡黯道風格技能樹 - 全新實現
 * 
 * 真正的 PoE 風格特點：
 * 1. 複雜的網狀連接結構
 * 2. 有機的節點分佈算法
 * 3. 多層次的技能路徑
 * 4. Config-Driven 數據結構
 * 
 * @author Claude
 * @version 1.0.0
 */

import { EventManager } from '../../../core/events/EventManager.js';

export class PoeStyleSkillTree extends EventManager {
  constructor(container, config = {}) {
    super();
    
    this.container = container;
    this.config = {
      // 渲染配置
      centerX: 1000,
      centerY: 1000,
      nodeSize: 45,
      subNodeSize: 30,
      gridSpacing: 80,
      branchLength: 400,
      
      // 六大分支角度 (度)
      branchAngles: [0, 60, 120, 180, 240, 300],
      
      // 顏色配置
      colors: {
        frontend: '#e74c3c',
        backend: '#3498db', 
        database: '#2ecc71',
        devops: '#9b59b6',
        ai: '#f39c12',
        architecture: '#34495e',
        center: '#d4af37',
        connection: '#4a9eff'
      },
      
      ...config
    };
    
    // 技能數據
    this.skillsData = null;
    this.skillNodes = new Map(); // 存儲所有技能節點
    this.subSkillNodes = new Map(); // 存儲所有子技能節點
    this.connections = new Map(); // 存儲所有連接線
    
    // DOM 容器
    this.skillTreeContainer = null;
    this.connectionsLayer = null;
    this.nodesLayer = null;
    this.subNodesLayer = null;
    
    // 分支結構
    this.branches = new Map();
  }
  
  /**
   * 初始化技能樹
   */
  async init() {
    console.log('🌳 PoeStyleSkillTree: 開始初始化');
    
    // 1. 創建 DOM 結構
    this.createDOMStructure();
    
    // 2. 載入技能數據
    await this.loadSkillsData();
    
    // 3. 分析並構建分支結構
    this.analyzeBranchStructure();
    
    // 4. 生成 PoE 風格節點網格
    this.generatePoeStyleGrid();
    
    // 5. 渲染技能樹
    this.renderSkillTree();
    
    // 6. 綁定事件
    this.bindEvents();
    
    console.log('✅ PoeStyleSkillTree: 初始化完成');
  }
  
  /**
   * 創建 DOM 結構
   */
  createDOMStructure() {
    // 清除現有內容
    this.container.innerHTML = '';
    
    // 創建外層視窗容器
    this.viewport = document.createElement('div');
    this.viewport.className = 'poe-viewport';
    this.viewport.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0a 70%);
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(74, 158, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 50%);
      cursor: grab;
    `;
    
    // 創建可拖曳的技能樹容器
    this.skillTreeContainer = document.createElement('div');
    this.skillTreeContainer.className = 'poe-skill-tree-container';
    this.skillTreeContainer.style.cssText = `
      position: absolute;
      width: 3000px;
      height: 3000px;
      transform-origin: center;
      will-change: transform;
      transform: translate(-500px, -500px);
      transition: none;
    `;
    
    // 創建連接線層 (最底層)
    this.connectionsLayer = document.createElement('div');
    this.connectionsLayer.className = 'poe-connections-layer';
    this.connectionsLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 3000px;
      height: 3000px;
      z-index: 1;
      pointer-events: none;
    `;
    
    // 創建主技能節點層 (中層)
    this.nodesLayer = document.createElement('div');
    this.nodesLayer.className = 'poe-nodes-layer';
    this.nodesLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 3000px;
      height: 3000px;
      z-index: 10;
    `;
    
    // 創建子技能節點層 (頂層)
    this.subNodesLayer = document.createElement('div');
    this.subNodesLayer.className = 'poe-sub-nodes-layer';
    this.subNodesLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 3000px;
      height: 3000px;
      z-index: 20;
    `;
    
    // 組裝結構
    this.skillTreeContainer.appendChild(this.connectionsLayer);
    this.skillTreeContainer.appendChild(this.nodesLayer);
    this.skillTreeContainer.appendChild(this.subNodesLayer);
    this.viewport.appendChild(this.skillTreeContainer);
    this.container.appendChild(this.viewport);
    
    // 初始化拖曳狀態
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.currentTransform = { x: -500, y: -500, scale: 1 };
  }
  
  /**
   * 載入技能數據
   */
  async loadSkillsData() {
    if (this.config.skillData) {
      this.skillsData = this.config.skillData;
      console.log('📊 使用傳入的技能數據:', this.skillsData.length, '個技能');
    } else {
      throw new Error('❌ 未提供技能數據');
    }
  }
  
  /**
   * 分析分支結構
   */
  analyzeBranchStructure() {
    // 初始化六大分支
    const branchCategories = {
      frontend: { name: '前端開發', angle: 0, skills: [], color: this.config.colors.frontend },
      architecture: { name: '系統架構', angle: 60, skills: [], color: this.config.colors.architecture },
      ai: { name: 'AI工程', angle: 120, skills: [], color: this.config.colors.ai },
      devops: { name: 'DevOps', angle: 180, skills: [], color: this.config.colors.devops },
      database: { name: '資料庫', angle: 240, skills: [], color: this.config.colors.database },
      backend: { name: '後端開發', angle: 300, skills: [], color: this.config.colors.backend }
    };
    
    // 分配技能到分支
    this.skillsData.forEach(skill => {
      if (skill.id === 'backend-engineer-core') {
        // 中心節點特殊處理
        this.centerSkill = skill;
        return;
      }
      
      const category = skill.category || 'backend';
      if (branchCategories[category]) {
        branchCategories[category].skills.push(skill);
      } else {
        branchCategories.backend.skills.push(skill);
      }
    });
    
    this.branches = new Map(Object.entries(branchCategories));
    
    console.log('🌿 分支結構分析完成:', this.branches);
  }
  
  /**
   * 生成 PoE 風格節點網格
   */
  generatePoeStyleGrid() {
    const { centerX, centerY } = this.config;
    
    // 為每個分支生成複雜的網格路徑
    this.branches.forEach((branch, categoryKey) => {
      if (!branch.skills.length) return;
      
      const angle = branch.angle * (Math.PI / 180);
      const branchColor = branch.color;
      
      // 生成主幹路徑
      const mainPath = this.generateMainBranchPath(angle, branch.skills.length);
      
      // 為每個技能分配位置
      branch.skills.forEach((skill, index) => {
        const pathPoint = mainPath[index];
        const x = centerX + pathPoint.x;
        const y = centerY + pathPoint.y;
        
        // 存儲主技能節點信息
        skill._renderInfo = {
          x, y, 
          category: categoryKey,
          color: branchColor,
          branchIndex: index,
          pathConnections: this.calculateConnections(skill, index, branch.skills)
        };
        
        // 為子技能生成圍繞位置
        if (skill.skills && skill.skills.length > 0) {
          skill.skills.forEach((subSkill, subIndex) => {
            const subPosition = this.generateSubSkillPosition(x, y, subIndex, skill.skills.length, angle);
            subSkill._renderInfo = {
              x: subPosition.x,
              y: subPosition.y,
              parentSkill: skill,
              color: branchColor,
              abbreviation: this.generateAbbreviation(subSkill.name)
            };
          });
        }
      });
    });
    
    // 設置中心節點信息
    if (this.centerSkill) {
      this.centerSkill._renderInfo = {
        x: centerX,
        y: centerY,
        category: 'center',
        color: this.config.colors.center,
        isCenter: true
      };
      
      // 中心節點不顯示子技能 - 保持簡潔
    }
  }
  
  /**
   * 生成主分支路徑 - PoE 風格有機曲線（更分散）
   */
  generateMainBranchPath(angle, skillCount) {
    const path = [];
    const baseDistance = 280; // 大幅增加起始距離，避免中心擁擠
    const maxDistance = this.config.branchLength * 1.2; // 增加最大距離
    const stepDistance = (maxDistance - baseDistance) / Math.max(skillCount - 1, 1);
    
    for (let i = 0; i < skillCount; i++) {
      // 基礎距離遞增，更大的間距
      const distance = baseDistance + (i * stepDistance * 1.3); // 增加步長
      
      // 添加有機變化，創造更自然的曲線
      const waveFrequency = 0.4 + Math.random() * 0.2; // 減少波動頻率變化
      const organicVariation = Math.sin(i * waveFrequency) * 60; // 增加蛇形彎曲幅度
      const sideVariation = (i % 2 === 0 ? 1 : -1) * Math.cos(i * 0.3) * 50; // 增加左右擺動
      
      // 計算最終位置
      const baseX = Math.cos(angle) * distance;
      const baseY = Math.sin(angle) * distance;
      
      // 添加垂直於主方向的變化，創造更豐富的路徑
      const perpAngle = angle + Math.PI / 2;
      const randomOffset = (Math.random() - 0.5) * 20; // 添加隨機偏移
      const finalX = baseX + Math.cos(perpAngle) * (sideVariation + randomOffset) + Math.cos(angle + 0.3) * organicVariation;
      const finalY = baseY + Math.sin(perpAngle) * (sideVariation + randomOffset) + Math.sin(angle + 0.3) * organicVariation;
      
      path.push({ x: finalX, y: finalY });
    }
    
    return path;
  }
  
  /**
   * 生成子技能位置 - 更合理的分佈
   */
  generateSubSkillPosition(parentX, parentY, index, total, branchAngle) {
    const baseRadius = 100; // 大幅增加基礎半徑，讓子技能更分散
    
    // 根據子技能數量調整分佈策略
    let angle, radius;
    
    if (total <= 3) {
      // 少量子技能：扇形分佈
      const startAngle = branchAngle - Math.PI / 3;
      const angleStep = (Math.PI * 2 / 3) / Math.max(total - 1, 1);
      angle = startAngle + (angleStep * index);
      radius = baseRadius + Math.random() * 20; // 添加隨機變化
    } else if (total <= 6) {
      // 中等數量：半圓分佈
      const startAngle = branchAngle - Math.PI * 0.6;
      const angleStep = (Math.PI * 1.2) / (total - 1);
      angle = startAngle + (angleStep * index);
      radius = baseRadius + (index % 2) * 20; // 增加交錯距離
    } else {
      // 大量子技能：完整圓形分佈
      angle = (2 * Math.PI * index) / total + Math.random() * 0.2; // 添加隨機偏移
      radius = baseRadius + (index % 2) * 15; // 更明顯的交錯
    }
    
    return {
      x: parentX + Math.cos(angle) * radius,
      y: parentY + Math.sin(angle) * radius
    };
  }
  
  /**
   * 計算連接關係
   */
  calculateConnections(skill, index, branchSkills) {
    const connections = [];
    
    // 連接到中心節點 (第一個技能)
    if (index === 0) {
      connections.push({
        type: 'center',
        targetId: 'backend-engineer-core'
      });
    }
    
    // 連接到前一個技能 (形成主幹)
    if (index > 0) {
      connections.push({
        type: 'branch',
        targetId: branchSkills[index - 1].id
      });
    }
    
    // 可選：交叉連接到其他分支 (創造網狀結構)
    if (index > 1 && Math.random() > 0.7) {
      connections.push({
        type: 'cross',
        targetId: branchSkills[index - 2].id
      });
    }
    
    return connections;
  }
  
  /**
   * 生成技能縮寫
   */
  generateAbbreviation(skillName) {
    if (skillName.length <= 2) return skillName;
    
    // 中文處理
    if (/[\u4e00-\u9fa5]/.test(skillName)) {
      return skillName.substring(0, 2);
    }
    
    // 英文處理
    const words = skillName.split(/[\s/-]/);
    if (words.length >= 2) {
      return words.slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
    }
    
    // 提取大寫字母
    const upperCaseLetters = skillName.match(/[A-Z]/g);
    if (upperCaseLetters && upperCaseLetters.length >= 2) {
      return upperCaseLetters.slice(0, 2).join('');
    }
    
    return skillName.substring(0, 2).toUpperCase();
  }
  
  /**
   * 渲染技能樹
   */
  renderSkillTree() {
    // 1. 渲染中心節點
    this.renderCenterNode();
    
    // 2. 渲染主技能節點
    this.renderMainSkillNodes();
    
    // 3. 渲染子技能節點
    this.renderSubSkillNodes();
    
    // 4. 渲染連接線
    this.renderConnections();
    
    console.log('🎨 技能樹渲染完成');
  }
  
  /**
   * 渲染中心節點
   */
  renderCenterNode() {
    if (!this.centerSkill) return;
    
    const skill = this.centerSkill;
    const { x, y, color } = skill._renderInfo;
    
    const node = document.createElement('div');
    node.className = 'poe-center-node';
    node.id = skill.id;
    node.dataset.skillId = skill.id;
    
    const size = this.config.nodeSize * 1.5; // 中心節點更大
    
    node.style.cssText = `
      position: absolute;
      left: ${x - size/2}px;
      top: ${y - size/2}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 5px solid ${color};
      background: radial-gradient(circle at 30% 30%, ${color}60, ${color}20);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      z-index: 15;
      box-shadow: 
        0 0 40px ${color}90, 
        inset 0 0 20px ${color}40,
        0 0 60px rgba(212, 175, 55, 0.4),
        0 0 80px ${color}30;
      transition: all 0.3s ease;
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transform: translateZ(0) scale(1);
      will-change: transform;
      image-rendering: pixelated;
      backface-visibility: hidden;
    `;
    
    // 技能名稱 - 中心節點更大的字體
    const nameElement = document.createElement('div');
    nameElement.textContent = skill.name;
    nameElement.style.cssText = `
      font-size: 20px;
      margin-bottom: 6px;
      text-shadow: 0 0 10px ${color}, 0 2px 4px rgba(0,0,0,0.9);
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: antialiased;
      font-weight: 700;
      letter-spacing: 0.8px;
      padding: 0 8px;
    `;
    node.appendChild(nameElement);
    
    // 等級信息
    if (skill.level) {
      const levelElement = document.createElement('div');
      levelElement.textContent = `Lv.${skill.level}`;
      levelElement.style.fontSize = '11px';
      levelElement.style.opacity = '0.9';
      node.appendChild(levelElement);
    }
    
    this.nodesLayer.appendChild(node);
    this.skillNodes.set(skill.id, node);
  }
  
  /**
   * 渲染主技能節點
   */
  renderMainSkillNodes() {
    this.branches.forEach((branch) => {
      branch.skills.forEach((skill) => {
        const { x, y, color } = skill._renderInfo;
        
        const node = document.createElement('div');
        node.className = 'poe-skill-node';
        node.id = skill.id;
        node.dataset.skillId = skill.id;
        node.dataset.category = skill.category;
        
        const size = this.config.nodeSize;
        
        node.style.cssText = `
          position: absolute;
          left: ${x - size/2}px;
          top: ${y - size/2}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 4px solid ${color};
          background: 
            radial-gradient(circle at 30% 30%, ${color}40, transparent 70%),
            radial-gradient(circle at center, #2c2c54 0%, #1a1a2e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          cursor: pointer;
          z-index: 12;
          padding: 6px;
          box-sizing: border-box;
          box-shadow: 
            0 0 25px ${color}80, 
            inset 0 0 20px ${color}20,
            0 0 40px ${color}40,
            0 4px 8px rgba(0,0,0,0.6),
            inset 0 2px 0 rgba(255,255,255,0.1);
          transition: all 0.3s ease;
          text-rendering: geometricPrecision;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0) scale(1);
          will-change: transform;
          backface-visibility: hidden;
        `;
        
        // 技能名稱 - 適應更大節點的字體大小
        const nameElement = document.createElement('div');
        nameElement.textContent = skill.name;
        nameElement.style.cssText = `
          font-size: ${skill.name.length > 10 ? '14px' : skill.name.length > 6 ? '16px' : '18px'};
          line-height: 1.2;
          margin-bottom: 4px;
          word-break: keep-all;
          text-shadow: 0 0 6px ${color}, 0 2px 4px rgba(0,0,0,0.8);
          text-rendering: geometricPrecision;
          -webkit-font-smoothing: antialiased;
          font-weight: 600;
          letter-spacing: 0.5px;
          white-space: normal;
          text-align: center;
          padding: 0 4px;
          max-width: ${size - 20}px;
        `;
        node.appendChild(nameElement);
        
        // 等級信息
        if (skill.level) {
          const levelElement = document.createElement('div');
          levelElement.textContent = `Lv.${skill.level}`;
          levelElement.style.cssText = `
            font-size: 12px;
            opacity: 0.95;
            text-shadow: 0 0 3px ${color}60, 0 1px 2px rgba(0,0,0,0.7);
            text-rendering: geometricPrecision;
            -webkit-font-smoothing: antialiased;
            font-weight: 500;
            color: #f0f0f0;
          `;
          node.appendChild(levelElement);
        }
        
        this.nodesLayer.appendChild(node);
        this.skillNodes.set(skill.id, node);
      });
    });
  }
  
  /**
   * 渲染子技能節點
   */
  renderSubSkillNodes() {
    // 不渲染中心節點的子技能，保持中心簡潔
    
    // 只渲染各分支的子技能
    this.branches.forEach((branch) => {
      branch.skills.forEach((skill) => {
        if (skill.skills && skill.skills.length > 0) {
          skill.skills.forEach((subSkill, index) => {
            this.createSubSkillNode(subSkill, skill, index);
          });
        }
      });
    });
  }
  
  /**
   * 創建子技能節點
   */
  createSubSkillNode(subSkill, parentSkill, index) {
    const { x, y, color, abbreviation } = subSkill._renderInfo;
    
    const node = document.createElement('div');
    node.className = 'poe-sub-skill-node';
    node.id = `${parentSkill.id}-sub-${index}`;
    node.dataset.skillId = `${parentSkill.id}-sub-${index}`;
    node.dataset.parentId = parentSkill.id;
    
    const size = this.config.subNodeSize;
    
    node.style.cssText = `
      position: absolute;
      left: ${x - size/2}px;
      top: ${y - size/2}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 3px solid ${color};
      background: 
        radial-gradient(circle at 30% 30%, ${color}35, transparent 60%),
        radial-gradient(circle at center, #2c2c54 0%, #1a1a2e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 9px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      z-index: 25;
      padding: 3px;
      box-sizing: border-box;
      box-shadow: 
        0 0 15px ${color}70,
        inset 0 0 10px ${color}20,
        0 0 25px ${color}30,
        0 2px 4px rgba(0,0,0,0.6),
        inset 0 1px 0 rgba(255,255,255,0.1);
      transition: all 0.3s ease;
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transform: translateZ(0) scale(1);
      will-change: transform;
      backface-visibility: hidden;
    `;
    
    // 顯示完整名稱或智能縮寫 - 適應更大的子節點
    const textElement = document.createElement('div');
    textElement.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
      height: 100%;
    `;
    
    if (subSkill.name.length <= 8) {
      // 短名稱直接顯示
      textElement.innerHTML = `<span style="
        font-size: 12px;
        text-shadow: 0 0 4px ${color}, 0 1px 2px rgba(0,0,0,0.8);
        line-height: 1.2;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        font-weight: 600;
        letter-spacing: 0.3px;
        padding: 0 2px;
      ">${subSkill.name}</span>`;
    } else {
      // 長名稱顯示縮寫
      textElement.innerHTML = `<span style="
        font-size: 14px;
        text-shadow: 0 0 4px ${color}, 0 1px 2px rgba(0,0,0,0.8);
        line-height: 1.1;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        font-weight: 700;
        letter-spacing: 0.5px;
      ">${abbreviation}</span>`;
    }
    node.appendChild(textElement);
    
    // 懸停效果
    node.addEventListener('mouseenter', () => {
      node.style.transform = 'scale(1.4)';
      node.style.zIndex = '30';
      node.style.boxShadow = `
        0 0 20px ${color}90,
        inset 0 0 12px ${color}40,
        0 2px 4px rgba(0,0,0,0.8)
      `;
      this.showSubSkillTooltip(node, subSkill, parentSkill);
    });
    
    node.addEventListener('mouseleave', () => {
      node.style.transform = 'scale(1)';
      node.style.zIndex = '25';
      node.style.boxShadow = `
        0 0 12px ${color}60,
        inset 0 0 8px ${color}25,
        0 1px 3px rgba(0,0,0,0.5)
      `;
      this.hideSubSkillTooltip();
    });
    
    this.subNodesLayer.appendChild(node);
    this.subSkillNodes.set(`${parentSkill.id}-sub-${index}`, node);
  }
  
  /**
   * 渲染連接線
   */
  renderConnections() {
    // 渲染主技能間的連接
    this.branches.forEach((branch) => {
      branch.skills.forEach((skill, index) => {
        const connections = skill._renderInfo.pathConnections;
        
        connections.forEach((connection) => {
          if (connection.type === 'center') {
            // 連接到中心
            this.createConnection(
              this.centerSkill._renderInfo.x,
              this.centerSkill._renderInfo.y,
              skill._renderInfo.x,
              skill._renderInfo.y,
              'center-connection'
            );
          } else if (connection.type === 'branch') {
            // 連接到分支中的前一個技能
            const targetSkill = branch.skills.find(s => s.id === connection.targetId);
            if (targetSkill) {
              this.createConnection(
                targetSkill._renderInfo.x,
                targetSkill._renderInfo.y,
                skill._renderInfo.x,
                skill._renderInfo.y,
                'branch-connection'
              );
            }
          }
        });
      });
    });
    
    // 渲染子技能連接線
    this.renderSubSkillConnections();
  }
  
  /**
   * 渲染子技能連接線
   */
  renderSubSkillConnections() {
    // 不渲染中心節點的子技能連接，保持中心簡潔
    
    // 分支子技能連接
    this.branches.forEach((branch) => {
      branch.skills.forEach((skill) => {
        if (skill.skills && skill.skills.length > 0) {
          skill.skills.forEach((subSkill) => {
            // 確保子技能有渲染信息才建立連接
            if (subSkill._renderInfo && skill._renderInfo) {
              this.createConnection(
                skill._renderInfo.x,
                skill._renderInfo.y,
                subSkill._renderInfo.x,
                subSkill._renderInfo.y,
                'sub-connection'
              );
            }
          });
        }
      });
    });
  }
  
  /**
   * 創建連接線
   */
  createConnection(x1, y1, x2, y2, type) {
    const line = document.createElement('div');
    line.className = `poe-connection ${type}`;
    
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    const color = this.config.colors.connection;
    const opacity = type === 'sub-connection' ? '0.7' : '0.9';
    const thickness = type === 'center-connection' ? '4px' : type === 'sub-connection' ? '2px' : '3px';
    
    // 創建外層發光效果
    const glowLine = document.createElement('div');
    glowLine.className = `poe-connection-glow ${type}-glow`;
    glowLine.style.cssText = `
      position: absolute;
      left: ${x1}px;
      top: ${y1 - 2}px;
      width: ${distance}px;
      height: ${thickness === '4px' ? '8px' : thickness === '3px' ? '6px' : '4px'};
      background: linear-gradient(90deg, 
        transparent 0%, 
        ${color}20 20%, 
        ${color}30 50%, 
        ${color}20 80%, 
        transparent 100%);
      transform-origin: 0 50%;
      transform: rotate(${angle}deg);
      pointer-events: none;
      z-index: 0;
      filter: blur(2px);
      opacity: ${parseFloat(opacity) * 0.6};
    `;
    
    // 創建主連接線
    line.style.cssText = `
      position: absolute;
      left: ${x1}px;
      top: ${y1}px;
      width: ${distance}px;
      height: ${thickness};
      background: linear-gradient(90deg, 
        transparent 0%, 
        ${color}${Math.floor(parseFloat(opacity) * 255).toString(16)} 15%, 
        ${color}ff 50%, 
        ${color}${Math.floor(parseFloat(opacity) * 255).toString(16)} 85%, 
        transparent 100%);
      transform-origin: 0 50%;
      transform: rotate(${angle}deg);
      pointer-events: none;
      z-index: 1;
      box-shadow: 
        0 0 ${thickness === '4px' ? '8px' : '4px'} ${color}60,
        0 0 ${thickness === '4px' ? '16px' : '8px'} ${color}30;
      border-radius: 1px;
    `;
    
    this.connectionsLayer.appendChild(glowLine);
    this.connectionsLayer.appendChild(line);
  }
  
  /**
   * 顯示子技能提示
   */
  showSubSkillTooltip(element, subSkill, parentSkill) {
    this.hideSubSkillTooltip(); // 先隱藏現有的
    
    const tooltip = document.createElement('div');
    tooltip.className = 'poe-tooltip';
    
    tooltip.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 4px; color: #fff;">${subSkill.name}</div>
      <div style="font-size: 11px; color: #ccc;">熟練度: ${subSkill.proficiency || 0}%</div>
      <div style="font-size: 11px; color: #999;">屬於: ${parentSkill.name}</div>
    `;
    
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 8px;
      font-size: 12px;
      color: white;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
    `;
    
    // 位置計算
    const rect = element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    
    tooltip.style.left = `${rect.left - containerRect.left + 40}px`;
    tooltip.style.top = `${rect.top - containerRect.top - 10}px`;
    
    this.container.appendChild(tooltip);
    this.currentTooltip = tooltip;
  }
  
  /**
   * 隱藏子技能提示
   */
  hideSubSkillTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }
  
  /**
   * 綁定事件
   */
  bindEvents() {
    // 拖曳功能
    this.setupDragAndZoom();
    
    // 技能節點點擊事件
    this.skillNodes.forEach((node, skillId) => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emit('skill-click', { skillId, element: node });
      });
      
      node.addEventListener('mouseenter', () => {
        node.style.transform = 'scale(1.1)';
        this.emit('skill-hover', { skillId, element: node });
      });
      
      node.addEventListener('mouseleave', () => {
        node.style.transform = 'scale(1)';
      });
    });
    
    // 子技能節點點擊事件
    this.subSkillNodes.forEach((node, subSkillId) => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        this.emit('sub-skill-click', { subSkillId, element: node });
      });
    });
  }
  
  /**
   * 設置拖曳和縮放功能
   */
  setupDragAndZoom() {
    // 滑鼠拖曳
    this.viewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // 只處理左鍵
      
      this.isDragging = true;
      this.dragStart = {
        x: e.clientX - this.currentTransform.x,
        y: e.clientY - this.currentTransform.y
      };
      
      this.viewport.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      
      this.currentTransform.x = e.clientX - this.dragStart.x;
      this.currentTransform.y = e.clientY - this.dragStart.y;
      
      this.updateTransform();
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.viewport.style.cursor = 'grab';
      }
    });
    
    // 滾輪縮放
    this.viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.3, Math.min(2, this.currentTransform.scale * delta));
      
      // 計算縮放中心點
      const rect = this.viewport.getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      
      // 調整位置以保持縮放中心
      const scaleDiff = newScale - this.currentTransform.scale;
      this.currentTransform.x -= centerX * scaleDiff;
      this.currentTransform.y -= centerY * scaleDiff;
      this.currentTransform.scale = newScale;
      
      this.updateTransform();
    });
    
    // 觸控支持
    let touchStartDistance = 0;
    let touchStartScale = 1;
    
    this.viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        // 單指拖曳
        this.isDragging = true;
        this.dragStart = {
          x: e.touches[0].clientX - this.currentTransform.x,
          y: e.touches[0].clientY - this.currentTransform.y
        };
      } else if (e.touches.length === 2) {
        // 雙指縮放
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistance = Math.sqrt(dx * dx + dy * dy);
        touchStartScale = this.currentTransform.scale;
      }
      e.preventDefault();
    });
    
    this.viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        // 單指拖曳
        this.currentTransform.x = e.touches[0].clientX - this.dragStart.x;
        this.currentTransform.y = e.touches[0].clientY - this.dragStart.y;
        this.updateTransform();
      } else if (e.touches.length === 2) {
        // 雙指縮放
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scale = (distance / touchStartDistance) * touchStartScale;
        this.currentTransform.scale = Math.max(0.3, Math.min(2, scale));
        this.updateTransform();
      }
      e.preventDefault();
    });
    
    this.viewport.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }
  
  /**
   * 更新變換
   */
  updateTransform() {
    this.skillTreeContainer.style.transform = 
      `translate(${this.currentTransform.x}px, ${this.currentTransform.y}px) scale(${this.currentTransform.scale})`;
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    this.hideSubSkillTooltip();
    this.skillNodes.clear();
    this.subSkillNodes.clear();
    this.connections.clear();
    this.branches.clear();
    
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    console.log('🗑️ PoeStyleSkillTree: 已銷毀');
  }
}

export default PoeStyleSkillTree;