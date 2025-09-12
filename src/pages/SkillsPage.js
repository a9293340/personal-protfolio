/**
 * 技能樹頁面組件
 * Step 3.3.1: 整合完整技能樹系統
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import { PoeStyleSkillTree } from '../components/gaming/SkillTree/PoeStyleSkillTree.js';
import { MobileSkillTree } from '../components/gaming/SkillTree/MobileSkillTree.js';
import { skillsDataConfig } from '../config/data/skills.data.js';

export class SkillsPage extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.skillTree = null;
    this.mobileSkillTree = null;
    this.isMobile = false;
    this.isFullscreen = false;
  }

  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return {
      title: '技能樹',
      subtitle: '專業技能發展軌跡',
      icon: '🌟',
      enableFullscreen: true,
      skillTreeConfig: {
        // 自定義技能樹配置
        rendering: {
          skillSize: 50,
          skillSpacing: 100,
          connectionWidth: 2,
          gridSize: 1600,
          centerOffset: { x: 800, y: 800 }
        },
        interaction: {
          enableHover: true,
          enableClick: true,
          enableKeyboard: true,
          hoverDelay: 200,
          clickDelay: 150
        }
      }
    };
  }

  /**
   * 渲染頁面 HTML
   */
  async render() {
    const config = this.mergeConfig();
    
    return `
      <div class="skills-page">
        <!-- 頁面頭部 -->
        <header class="skills-header">
          <div class="skills-header-content">
            <h1 class="skills-title">
              <span class="title-icon">${config.icon}</span>
              <span class="title-text">${config.title}</span>
            </h1>
            <p class="skills-subtitle">${config.subtitle}</p>
            
            <!-- 控制面板 - 簡化版 -->
            <div class="skills-controls">
              <button class="control-btn" id="center-btn" title="重置視圖">
                <span class="btn-icon">🎯</span>
              </button>
              <button class="control-btn" id="help-btn" title="操作說明">
                <span class="btn-icon">❓</span>
              </button>
            </div>
          </div>
        </header>

        <!-- 技能樹容器 -->
        <main class="skills-main">
          <!-- 桌面端技能樹 -->
          <div class="skill-tree-wrapper desktop-only" id="desktop-skill-tree-wrapper">
            <div class="skill-tree-container" id="desktop-skill-tree-container">
              <!-- 桌面端 PoeStyleSkillTree 將在此渲染 -->
            </div>
          </div>
          
          <!-- 手機端技能樹 -->
          <div class="mobile-skill-tree-wrapper mobile-only" id="mobile-skill-tree-wrapper">
            <div class="mobile-skill-tree-container" id="mobile-skill-tree-container">
              <!-- 手機端 MobileSkillTree 將在此渲染 -->
            </div>
          </div>
          
          <!-- 載入指示器 -->
          <div class="skill-tree-loading" id="skill-tree-loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">載入技能樹中...</p>
          </div>
        </main>

        <!-- 技能詳情面板 -->
        <aside class="skill-details-panel" id="skill-details-panel">
          <div class="panel-content">
            <h3 class="panel-title">技能詳情</h3>
            <div class="panel-body" id="skill-details-content">
              <p class="hint-text">點擊技能節點查看詳細信息</p>
            </div>
          </div>
        </aside>

        <!-- 操作說明彈窗 -->
        <div class="help-modal" id="help-modal">
          <div class="modal-backdrop" id="help-backdrop"></div>
          <div class="modal-content">
            <header class="modal-header">
              <h3>操作說明</h3>
              <button class="close-btn" id="help-close-btn">✕</button>
            </header>
            <div class="modal-body">
              <div class="help-section">
                <h4>🖱️ 滑鼠操作</h4>
                <ul>
                  <li>拖曳：移動技能樹視圖</li>
                  <li>滾輪：縮放技能樹</li>
                  <li>點擊：選擇技能節點</li>
                  <li>懸停：顯示技能預覽</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>📱 觸控操作</h4>
                <ul>
                  <li>單指拖曳：移動視圖</li>
                  <li>雙指縮放：縮放技能樹</li>
                  <li>點擊：選擇技能節點</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>⌨️ 鍵盤操作</h4>
                <ul>
                  <li>方向鍵：移動視圖</li>
                  <li>Tab：技能節點間導航</li>
                  <li>Enter：選擇當前技能</li>
                  <li>ESC：取消選擇</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 移除返回首頁按鈕 - 使用 NavBar 或漢堡選單即可 -->
      </div>
    `;
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();
    
    try {
      // 設置全局實例供按鈕事件使用
      window.skillsPageInstance = this;
      
      // 檢測設備類型
      this.detectDevice();
      
      // 初始化技能樹
      await this.initializeSkillTree();
      
      // 綁定UI事件
      this.bindEvents();
      
      console.log('🌟 SkillsPage initialized');
      
    } catch (error) {
      console.error('❌ SkillsPage initialization failed:', error);
      this.showError('技能樹載入失敗');
    }
  }

  /**
   * 檢測設備類型
   */
  detectDevice() {
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isMobile = isMobile;
    
    console.log('📱 設備檢測:', isMobile ? '手機端' : '桌面端');
    
    // 添加對應的 CSS 類
    document.body.classList.toggle('mobile-device', isMobile);
    document.body.classList.toggle('desktop-device', !isMobile);
  }

  /**
   * 初始化技能樹組件
   */
  async initializeSkillTree() {
    const loading = document.getElementById('skill-tree-loading');
    
    try {
      // 顯示載入狀態
      loading.style.display = 'flex';
      
      if (this.isMobile) {
        await this.initializeMobileSkillTree();
      } else {
        await this.initializeDesktopSkillTree();
      }
      
      // 隱藏載入狀態
      loading.style.display = 'none';
      
      console.log('✅ SkillTree initialized successfully');
      
    } catch (error) {
      console.error('❌ SkillTree initialization failed:', error);
      loading.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">技能樹載入失敗</p>
          <button class="retry-btn" onclick="location.reload()">重新載入</button>
        </div>
      `;
      throw error;
    }
  }

  /**
   * 初始化桌面端技能樹
   */
  async initializeDesktopSkillTree() {
    const container = document.getElementById('desktop-skill-tree-container');
    
    if (!container) {
      throw new Error('桌面端技能樹容器不存在');
    }

    // 從 skillsDataConfig 提取技能樹數據
    const skillTreeData = skillsDataConfig.tree || {};
    this.skillsArray = this.extractSkillsFromTree(skillTreeData);
    
    console.log('🖥️ 桌面端 - 提取的技能數據:', this.skillsArray.length, '個技能');
    
    // 使用原本漂亮的 PoeStyleSkillTree
    this.skillTree = new PoeStyleSkillTree(container, {
      skillData: this.skillsArray,
      // 恢復原有的漂亮佈局參數
      centerX: 1000,  
      centerY: 1000,
      nodeSize: 120,      
      subNodeSize: 70,    
      gridSpacing: 250,   
      branchLength: 800   
    });

    // 監聽技能樹事件
    this.setupDesktopSkillTreeEvents();
    
    // 初始化技能樹
    await this.skillTree.init();
    
    console.log('✅ 桌面端 PoeStyleSkillTree 初始化完成');
  }

  /**
   * 初始化手機端技能樹
   */
  async initializeMobileSkillTree() {
    const container = document.getElementById('mobile-skill-tree-container');
    
    if (!container) {
      throw new Error('手機端技能樹容器不存在');
    }

    console.log('📱 手機端 - 初始化簡化版技能樹');
    
    // 建立手機端技能樹
    this.mobileSkillTree = new MobileSkillTree(container, {
      skillData: skillsDataConfig,
      enableAnimation: true
    });

    // 監聽手機端技能樹事件
    this.setupMobileSkillTreeEvents();
    
    // 初始化手機端技能樹
    await this.mobileSkillTree.init();
    
    console.log('✅ 手機端 MobileSkillTree 初始化完成');
  }

  /**
   * 從技能樹配置中提取技能數組
   */
  extractSkillsFromTree(treeData) {
    const skills = [];
    
    // 處理中心節點
    if (treeData.center) {
      skills.push({
        id: treeData.center.id,
        name: treeData.center.name,
        category: treeData.center.category,
        level: treeData.center.level,
        status: treeData.center.status,
        coordinates: treeData.center.coordinates || { q: 0, r: 0 },
        description: treeData.center.description,
        skills: treeData.center.skills || [],
        achievements: treeData.center.achievements || [],
        nextGoal: treeData.center.nextGoal
      });
    }
    
    // 處理其他層級的技能節點
    ['ring1', 'ring2', 'ring3'].forEach((ringName, ringIndex) => {
      const ring = treeData[ringName];
      if (ring && typeof ring === 'object') {
        // 如果 ring 是物件，遍歷其屬性
        Object.values(ring).forEach((skill, skillIndex) => {
          // 生成座標（如果沒有提供）
          const coordinates = skill.coordinates || this.generateCoordinates(ringIndex + 1, skillIndex);
          
          skills.push({
            id: skill.id,
            name: skill.name,
            category: skill.category,
            level: skill.level,
            status: skill.status,
            coordinates: coordinates,
            description: skill.description,
            prerequisites: skill.prerequisites || [],
            skills: skill.skills || [],
            nextSteps: skill.nextSteps || []
          });
        });
      }
    });
    
    console.log('🔍 提取技能數量:', skills.length);
    console.log('🔍 技能範例:', skills.slice(0, 3));
    
    return skills;
  }

  /**
   * 為技能生成座標（六角形佈局）
   */
  generateCoordinates(ring, index) {
    if (ring === 0) return { q: 0, r: 0 };
    
    // 六角形佈局：每層最多 6 * ring 個技能
    const maxSkillsInRing = ring * 6;
    const angleStep = 360 / Math.max(maxSkillsInRing, 6);
    const angle = (index * angleStep) * (Math.PI / 180);
    
    // 六角形座標
    const distance = ring * 2;
    const q = Math.round(distance * Math.cos(angle));
    const r = Math.round(distance * Math.sin(angle) * 2/3);
    
    return { q, r };
  }

  /**
   * 根據技能 ID 查找技能對象（桌面端用）
   */
  findSkillById(skillId) {
    if (!skillId || !this.skillsArray) {
      console.warn('⚠️ 無效的技能 ID 或技能陣列:', skillId);
      return null;
    }

    const skill = this.skillsArray.find(s => s.id === skillId);
    if (!skill) {
      console.warn('⚠️ 找不到技能:', skillId);
      return null;
    }

    return skill;
  }

  /**
   * 根據技能 ID 在配置數據中查找技能對象（手機端用）
   */
  findSkillByIdInData(skillId) {
    if (!skillId || !skillsDataConfig.tree) {
      console.warn('⚠️ 無效的技能 ID 或技能數據:', skillId);
      return null;
    }

    const allSkills = [
      skillsDataConfig.tree.center,
      ...(skillsDataConfig.tree.ring1 ? Object.values(skillsDataConfig.tree.ring1) : []),
      ...(skillsDataConfig.tree.ring2 ? Object.values(skillsDataConfig.tree.ring2) : []),
      ...(skillsDataConfig.tree.ring3 ? Object.values(skillsDataConfig.tree.ring3) : [])
    ].filter(Boolean);
    
    const skill = allSkills.find(s => s.id === skillId);
    if (!skill) {
      console.warn('⚠️ 在配置數據中找不到技能:', skillId);
      return null;
    }

    return skill;
  }

  /**
   * 根據子技能ID找到對應的父技能
   */
  findParentSkillBySubSkillId(subSkillId) {
    if (!subSkillId || !skillsDataConfig.tree) {
      console.warn('⚠️ 無效的子技能 ID 或技能數據:', subSkillId);
      return null;
    }

    console.log('🔍 查找子技能的父技能:', subSkillId);

    // 解析子技能ID格式：{parentSkillId}-sub-{index}
    const subSkillIdPattern = /^(.+)-sub-(\d+)$/;
    const match = subSkillId.match(subSkillIdPattern);
    
    if (match) {
      const parentSkillId = match[1];
      const subSkillIndex = parseInt(match[2], 10);
      
      console.log('🔍 解析結果 - 父技能ID:', parentSkillId, ', 子技能索引:', subSkillIndex);
      
      // 直接查找父技能
      const parentSkill = this.findSkillByIdInData(parentSkillId);
      if (parentSkill) {
        console.log('🔍 找到子技能', subSkillId, '的父技能:', parentSkill.name);
        return parentSkill;
      }
    }

    // 如果格式不匹配，fallback 到原來的查找方式
    const allSkills = [
      skillsDataConfig.tree.center,
      ...(skillsDataConfig.tree.ring1 ? Object.values(skillsDataConfig.tree.ring1) : []),
      ...(skillsDataConfig.tree.ring2 ? Object.values(skillsDataConfig.tree.ring2) : []),
      ...(skillsDataConfig.tree.ring3 ? Object.values(skillsDataConfig.tree.ring3) : [])
    ].filter(Boolean);
    
    // 在每個主技能的 skills 數組中查找子技能
    for (const mainSkill of allSkills) {
      if (mainSkill.skills && Array.isArray(mainSkill.skills)) {
        const subSkill = mainSkill.skills.find(sub => 
          sub.id === subSkillId || 
          sub.name === subSkillId ||
          (typeof sub === 'string' && sub === subSkillId)
        );
        if (subSkill) {
          console.log('🔍 (fallback) 找到子技能', subSkillId, '的父技能:', mainSkill.name);
          return mainSkill;
        }
      }
    }
    
    console.warn('⚠️ 找不到子技能對應的父技能:', subSkillId);
    return null;
  }

  /**
   * 查找相關技能
   */
  findRelatedSkills(currentSkill) {
    if (!currentSkill || !skillsDataConfig.tree) {
      return [];
    }

    const allSkills = [
      skillsDataConfig.tree.center,
      ...(skillsDataConfig.tree.ring1 ? Object.values(skillsDataConfig.tree.ring1) : []),
      ...(skillsDataConfig.tree.ring2 ? Object.values(skillsDataConfig.tree.ring2) : []),
      ...(skillsDataConfig.tree.ring3 ? Object.values(skillsDataConfig.tree.ring3) : [])
    ].filter(Boolean);

    const relatedSkills = [];

    for (const skill of allSkills) {
      if (skill.id === currentSkill.id) continue; // 跳過自己

      // 相關性評分
      let relationScore = 0;

      // 1. 同類別技能 (權重: 30)
      if (skill.category === currentSkill.category) {
        relationScore += 30;
      }

      // 2. 前置技能關係 (權重: 40)
      if (currentSkill.prerequisites && currentSkill.prerequisites.includes(skill.id)) {
        relationScore += 40; // 當前技能的前置技能
      }
      if (skill.prerequisites && skill.prerequisites.includes(currentSkill.id)) {
        relationScore += 35; // 以當前技能為前置的技能
      }

      // 3. 技能名稱關鍵字相似度 (權重: 20)
      const currentSkillKeywords = this.extractKeywords(currentSkill.name);
      const skillKeywords = this.extractKeywords(skill.name);
      const keywordSimilarity = this.calculateKeywordSimilarity(currentSkillKeywords, skillKeywords);
      relationScore += keywordSimilarity * 20;

      // 4. 子技能相似度 (權重: 10)
      if (currentSkill.skills && skill.skills) {
        const subSkillSimilarity = this.calculateSubSkillSimilarity(currentSkill.skills, skill.skills);
        relationScore += subSkillSimilarity * 10;
      }

      // 如果有一定相關性，加入結果
      if (relationScore > 10) {
        relatedSkills.push({
          skill,
          relationScore,
          relationReasons: this.getRelationReasons(currentSkill, skill, relationScore)
        });
      }
    }

    // 按相關性評分排序，取前6個
    return relatedSkills
      .sort((a, b) => b.relationScore - a.relationScore)
      .slice(0, 6);
  }

  /**
   * 提取關鍵字
   */
  extractKeywords(name) {
    return name.toLowerCase()
      .replace(/[/\-.]/g, ' ')
      .split(' ')
      .filter(word => word.length > 1);
  }

  /**
   * 計算關鍵字相似度
   */
  calculateKeywordSimilarity(keywords1, keywords2) {
    const commonKeywords = keywords1.filter(word => keywords2.includes(word));
    const totalKeywords = [...new Set([...keywords1, ...keywords2])].length;
    return totalKeywords > 0 ? commonKeywords.length / totalKeywords : 0;
  }

  /**
   * 計算子技能相似度
   */
  calculateSubSkillSimilarity(subSkills1, subSkills2) {
    if (!subSkills1 || !subSkills2) return 0;
    
    const names1 = subSkills1.map(s => s.name?.toLowerCase() || '');
    const names2 = subSkills2.map(s => s.name?.toLowerCase() || '');
    
    const commonSubSkills = names1.filter(name => 
      names2.some(name2 => name2.includes(name) || name.includes(name2))
    );
    
    return commonSubSkills.length / Math.max(names1.length, names2.length);
  }

  /**
   * 獲取關係原因
   */
  getRelationReasons(currentSkill, relatedSkill, score) {
    const reasons = [];
    
    if (relatedSkill.category === currentSkill.category) {
      reasons.push(`同屬 ${skillsDataConfig.categories[currentSkill.category]?.name || currentSkill.category} 領域`);
    }
    
    if (currentSkill.prerequisites && currentSkill.prerequisites.includes(relatedSkill.id)) {
      reasons.push('前置技能');
    }
    
    if (relatedSkill.prerequisites && relatedSkill.prerequisites.includes(currentSkill.id)) {
      reasons.push('進階技能');
    }
    
    if (score > 50) {
      reasons.push('高度相關');
    } else if (score > 30) {
      reasons.push('中度相關');
    }
    
    return reasons;
  }

  /**
   * 生成學習路徑建議
   */
  generateLearningPath(skill) {
    if (!skill) return null;

    const learningPath = {
      currentSkill: skill,
      prerequisites: [],
      nextSteps: [],
      recommendedResources: [],
      estimatedTime: '根據個人基礎而定',
      difficulty: this.calculateSkillDifficulty(skill)
    };

    // 查找前置技能
    if (skill.prerequisites && skill.prerequisites.length > 0) {
      learningPath.prerequisites = skill.prerequisites.map(prereqId => {
        const prereqSkill = this.findSkillByIdInData(prereqId);
        return prereqSkill || { id: prereqId, name: prereqId };
      });
    }

    // 查找後續技能
    const allSkills = [
      skillsDataConfig.tree.center,
      ...(skillsDataConfig.tree.ring1 ? Object.values(skillsDataConfig.tree.ring1) : []),
      ...(skillsDataConfig.tree.ring2 ? Object.values(skillsDataConfig.tree.ring2) : []),
      ...(skillsDataConfig.tree.ring3 ? Object.values(skillsDataConfig.tree.ring3) : [])
    ].filter(Boolean);

    learningPath.nextSteps = allSkills.filter(s => 
      s.prerequisites && s.prerequisites.includes(skill.id)
    ).slice(0, 4);

    // 根據技能類型生成學習資源建議
    learningPath.recommendedResources = this.generateLearningResources(skill);

    // 根據技能複雜度估算學習時間
    learningPath.estimatedTime = this.estimateLearningTime(skill);

    return learningPath;
  }

  /**
   * 計算技能難度
   */
  calculateSkillDifficulty(skill) {
    const level = skill.level || 1;
    const subSkillCount = skill.skills ? skill.skills.length : 0;
    const avgProficiency = skill.skills ? 
      skill.skills.reduce((sum, s) => sum + (s.proficiency || 0), 0) / skill.skills.length : 0;

    if (level >= 5 || avgProficiency >= 90) return '高級';
    if (level >= 4 || avgProficiency >= 75) return '中高級';
    if (level >= 3 || avgProficiency >= 60) return '中級';
    if (level >= 2 || avgProficiency >= 40) return '初中級';
    return '初級';
  }

  /**
   * 生成學習資源建議
   */
  generateLearningResources(skill) {
    const resources = [];
    const category = skill.category;

    // 根據技能類別提供不同的學習建議
    switch (category) {
      case 'frontend':
        resources.push(
          { type: '文檔', name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
          { type: '教程', name: 'Frontend Mentor', url: 'https://www.frontendmentor.io' },
          { type: '實踐', name: '創建響應式項目', url: '#' }
        );
        break;
      
      case 'backend':
        resources.push(
          { type: '文檔', name: '官方文檔', url: '#' },
          { type: '書籍', name: '系統設計相關書籍', url: '#' },
          { type: '實踐', name: 'API 設計練習', url: '#' }
        );
        break;
      
      case 'database':
        resources.push(
          { type: '教程', name: 'SQL 實戰練習', url: '#' },
          { type: '文檔', name: '數據庫官方文檔', url: '#' },
          { type: '實踐', name: '設計數據庫架構', url: '#' }
        );
        break;

      default:
        resources.push(
          { type: '搜尋', name: '在線教程', url: '#' },
          { type: '實踐', name: '動手練習', url: '#' },
          { type: '社群', name: '技術社群討論', url: '#' }
        );
    }

    return resources;
  }

  /**
   * 估算學習時間
   */
  estimateLearningTime(skill) {
    const level = skill.level || 1;
    const subSkillCount = skill.skills ? skill.skills.length : 0;
    
    const baseTime = level * 2; // 基礎時間
    const complexityTime = subSkillCount * 0.5; // 複雜度時間
    const totalWeeks = Math.ceil(baseTime + complexityTime);
    
    if (totalWeeks <= 2) return '1-2 週';
    if (totalWeeks <= 4) return '2-4 週';
    if (totalWeeks <= 8) return '1-2 個月';
    if (totalWeeks <= 12) return '2-3 個月';
    return '3+ 個月';
  }

  /**
   * 設置桌面端技能樹事件監聽
   */
  setupDesktopSkillTreeEvents() {
    if (!this.skillTree) return;

    // 主技能點擊事件 (修復事件名稱)
    this.skillTree.on('skill-click', (data) => {
      console.log('🖥️ 桌面端 - 主技能點擊事件:', data);
      const skill = this.findSkillByIdInData(data.skillId);
      this.showSkillDetails(skill);
    });

    // 子技能點擊事件 (新增)
    this.skillTree.on('sub-skill-click', (eventData) => {
      console.log('🖥️ 桌面端 - 子技能點擊事件:', eventData);
      
      // 安全地檢查事件數據結構
      const data = eventData.data || eventData;
      console.log('🔍 實際數據:', data);
      console.log('🔍 data.subSkillId:', data.subSkillId);
      console.log('🔍 data 的屬性:', Object.keys(data));
      
      // 子技能點擊時，需要找到對應的主技能然後顯示詳情
      const subSkillId = data.subSkillId;
      if (subSkillId) {
        const parentSkill = this.findParentSkillBySubSkillId(subSkillId);
        if (parentSkill) {
          this.showSkillDetails(parentSkill);
        } else {
          console.warn('⚠️ 找不到子技能對應的父技能:', subSkillId);
        }
      } else {
        console.warn('⚠️ 子技能點擊事件中沒有 subSkillId:', data);
      }
    });

    // 舊的事件監聽 (保留作為備用)
    this.skillTree.on('skill-selected', (data) => {
      console.log('🖥️ 桌面端 - 技能選擇事件 (舊):', data);
      const skill = this.findSkillByIdInData(data.skillId);
      this.showSkillDetails(skill);
    });

    // 技能懸停事件
    this.skillTree.on('skill-hover', (data) => {
      console.log('🖥️ 桌面端 - 技能懸停事件:', data);
      if (data.isEnter) {
        const skill = this.findSkillByIdInData(data.skillId);
        this.previewSkill(skill);
      }
    });

    // 技能樹初始化完成
    this.skillTree.on('skill-tree-initialized', (data) => {
      console.log(`🌟 桌面端技能樹載入完成: ${data.skillCount} 個技能, ${data.connections} 條連線`);
    });

    // 錯誤處理
    this.skillTree.on('skill-tree-error', (data) => {
      console.error('🚨 桌面端技能樹錯誤:', data.error);
      this.showError('技能樹運行錯誤: ' + data.error.message);
    });

    // 添加通用事件監聽器 (debug 用)
    console.log('🔧 設置桌面端技能樹事件監聽完成');
  }

  /**
   * 設置手機端技能樹事件監聽
   */
  setupMobileSkillTreeEvents() {
    if (!this.mobileSkillTree) return;

    // 技能點擊事件
    this.mobileSkillTree.on('skillClick', (event) => {
      console.log('📱 手機端 - 技能點擊事件:', event);
      const skill = this.findSkillByIdInData(event.data.skillId);
      this.showSkillDetails(skill);
    });

    // 分支展開/收合事件
    this.mobileSkillTree.on('branchToggle', (event) => {
      console.log('📱 手機端 - 分支切換:', event.data.categoryId, event.data.expanded ? '展開' : '收合');
    });
  }

  /**
   * 綁定UI事件
   */
  bindEvents() {
    // 重置視圖按鈕
    const centerBtn = document.getElementById('center-btn');
    if (centerBtn) {
      centerBtn.addEventListener('click', () => {
        this.centerView();
      });
    }

    // 說明按鈕
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.showHelp();
      });
    }

    // 說明彈窗關閉
    const helpCloseBtn = document.getElementById('help-close-btn');
    const helpBackdrop = document.getElementById('help-backdrop');
    
    if (helpCloseBtn) {
      helpCloseBtn.addEventListener('click', () => {
        this.hideHelp();
      });
    }

    if (helpBackdrop) {
      helpBackdrop.addEventListener('click', () => {
        this.hideHelp();
      });
    }

    // ESC 鍵關閉說明
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hideHelp();
      }
    });
  }

  /**
   * 顯示技能詳情
   */
  showSkillDetails(skill) {
    const detailsContent = document.getElementById('skill-details-content');
    if (!detailsContent) return;

    // 添加安全檢查
    if (!skill || typeof skill !== 'object') {
      console.warn('⚠️ 無效的技能詳情數據:', skill);
      detailsContent.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">技能數據載入失敗</p>
        </div>
      `;
      return;
    }

    const skillName = skill.name || skill.id || '未知技能';
    const skillStatus = skill.status || 'available';
    const skillDescription = skill.description || '暫無描述';
    const skillRequirements = skill.requirements || skill.prerequisites || [];
    const skillProjects = skill.relatedProjects || [];
    const skillLevel = skill.level || 1;

    // 狀態映射和顏色
    const statusInfo = {
      'mastered': { text: '已熟練', color: '#d4af37', icon: '🏆' },
      'learning': { text: '學習中', color: '#27ae60', icon: '📚' },
      'available': { text: '略懂', color: '#2980b9', icon: '💡' },
      'locked': { text: '待學習', color: '#666666', icon: '🔒' }
    };

    const status = statusInfo[skillStatus] || statusInfo['available'];

    detailsContent.innerHTML = `
      <div class="skill-detail">
        <header class="skill-detail-header">
          <div class="skill-detail-title-row">
            <h3 class="skill-name">${skillName}</h3>
            <button class="skill-detail-close" onclick="this.closest('.skill-details-panel').classList.remove('show')">✕</button>
          </div>
          <div class="skill-status-info">
            <span class="skill-status-badge" style="background-color: ${status.color}">
              ${status.icon} ${status.text}
            </span>
            <span class="skill-level-badge">Level ${skillLevel}</span>
          </div>
        </header>
        
        <div class="skill-detail-body">
          <div class="skill-description-section">
            <p class="skill-description">${skillDescription}</p>
          </div>

          ${skill.skills && skill.skills.length > 0 ? `
            <div class="sub-skills-section">
              <h5 class="section-title">🔧 子技能列表</h5>
              <div class="sub-skills-list">
                ${skill.skills.map(subSkill => `
                  <div class="sub-skill-item">
                    <div class="sub-skill-info">
                      <span class="sub-skill-name">${subSkill.name}</span>
                      <span class="sub-skill-percentage">${subSkill.proficiency}%</span>
                    </div>
                    <div class="proficiency-bar-container">
                      <div class="proficiency-bar">
                        <div class="proficiency-fill" 
                             style="width: ${subSkill.proficiency}%; background-color: ${this.getProficiencyColor(subSkill.proficiency)};">
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${skillRequirements.length > 0 ? `
            <div class="skill-requirements-section">
              <h5 class="section-title">📋 前置需求</h5>
              <ul class="requirements-list">
                ${skillRequirements.map(req => `<li class="requirement-item">${req}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${skillProjects.length > 0 ? `
            <div class="skill-projects-section">
              <h5 class="section-title">🚀 相關專案</h5>
              <div class="projects-grid">
                ${skillProjects.map(project => `
                  <div class="project-card">
                    <div class="project-name">${project.name || project}</div>
                    ${project.description ? `<div class="project-description">${project.description}</div>` : ''}
                    ${project.technologies ? `
                      <div class="project-tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${skill.experience ? `
            <div class="experience-section">
              <h5 class="section-title">💼 實務經驗</h5>
              <div class="experience-content">
                <div class="experience-years">
                  <span class="experience-label">經驗年資:</span>
                  <span class="experience-value">${skill.experience.years || '待更新'}</span>
                </div>
                ${skill.experience.highlights ? `
                  <div class="experience-highlights">
                    <span class="experience-label">重點成就:</span>
                    <ul class="highlights-list">
                      ${skill.experience.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <div class="skill-actions">
            <button class="action-button primary" onclick="window.skillsPageInstance.showRelatedSkills('${skill.id}')">
              🔗 查看相關技能
            </button>
            <button class="action-button secondary" onclick="window.skillsPageInstance.showLearningPath('${skill.id}')">
              🎯 學習路徑
            </button>
          </div>
        </div>
      </div>
    `;

    // 顯示側邊欄
    const panel = document.getElementById('skill-details-panel');
    if (panel) {
      panel.classList.add('show');
    }
  }

  /**
   * 獲取熟練度對應的顏色
   */
  getProficiencyColor(proficiency) {
    if (proficiency >= 90) return '#d4af37'; // 金色 - 專家
    if (proficiency >= 75) return '#27ae60'; // 綠色 - 熟練
    if (proficiency >= 50) return '#2980b9'; // 藍色 - 中等
    if (proficiency >= 25) return '#f39c12'; // 橙色 - 初級
    return '#e74c3c'; // 紅色 - 新手
  }

  /**
   * 預覽技能（懸停時）
   */
  previewSkill(skill) {
    // 添加安全檢查
    if (!skill || typeof skill !== 'object') {
      console.warn('⚠️ 無效的技能數據:', skill);
      return;
    }

    // 可以在這裡添加技能預覽邏輯
    const skillName = skill.name || skill.id || '未知技能';
    console.log('👀 預覽技能:', skillName);
    
    // 可以在未來添加更多預覽功能
    // 例如：顯示簡短的技能提示
  }

  /**
   * 顯示相關技能
   */
  showRelatedSkills(skillId) {
    console.log('🔗 查看相關技能:', skillId);
    
    const skill = this.findSkillByIdInData(skillId);
    if (!skill) {
      console.warn('⚠️ 找不到技能:', skillId);
      return;
    }

    const relatedSkills = this.findRelatedSkills(skill);
    console.log('🔍 找到相關技能:', relatedSkills);

    // 更新技能詳情面板內容
    const detailsContent = document.getElementById('skill-details-content');
    if (!detailsContent) return;

    detailsContent.innerHTML = `
      <div class="related-skills-view">
        <header class="related-skills-header">
          <div class="back-button-row">
            <button class="back-button" onclick="window.skillsPageInstance.showSkillDetails(window.skillsPageInstance.findSkillByIdInData('${skillId}'))">
              ← 回到技能詳情
            </button>
          </div>
          <h3 class="related-skills-title">「${skill.name}」相關技能</h3>
        </header>
        
        <div class="related-skills-content">
          ${relatedSkills.length > 0 ? `
            <div class="related-skills-list">
              ${relatedSkills.map((relatedItem, index) => `
                <div class="related-skill-item" onclick="window.skillsPageInstance.showSkillDetails(window.skillsPageInstance.findSkillByIdInData('${relatedItem.skill.id}'))">
                  <div class="related-skill-header">
                    <h4 class="related-skill-name">${relatedItem.skill.name}</h4>
                    <div class="relation-score">${Math.round(relatedItem.relationScore)}%</div>
                  </div>
                  <div class="related-skill-meta">
                    <span class="skill-category">${skillsDataConfig.categories[relatedItem.skill.category]?.name || relatedItem.skill.category}</span>
                    <span class="skill-level">Level ${relatedItem.skill.level || 1}</span>
                  </div>
                  <div class="relation-reasons">
                    ${relatedItem.relationReasons.map(reason => `<span class="reason-tag">${reason}</span>`).join('')}
                  </div>
                  <p class="related-skill-desc">${relatedItem.skill.description || '暫無描述'}</p>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="no-related-skills">
              <div class="no-results-icon">🔍</div>
              <p class="no-results-text">暫無找到高度相關的技能</p>
              <p class="no-results-hint">此技能可能是獨立技能或核心基礎技能</p>
            </div>
          `}
        </div>
      </div>
    `;

    // 顯示側邊欄
    const panel = document.getElementById('skill-details-panel');
    if (panel) {
      panel.classList.add('show');
    }
  }

  /**
   * 顯示學習路徑
   */
  showLearningPath(skillId) {
    console.log('🎯 查看學習路徑:', skillId);
    
    const skill = this.findSkillByIdInData(skillId);
    if (!skill) {
      console.warn('⚠️ 找不到技能:', skillId);
      return;
    }

    const learningPath = this.generateLearningPath(skill);
    console.log('📚 生成學習路徑:', learningPath);

    // 更新技能詳情面板內容
    const detailsContent = document.getElementById('skill-details-content');
    if (!detailsContent) return;

    detailsContent.innerHTML = `
      <div class="learning-path-view">
        <header class="learning-path-header">
          <div class="back-button-row">
            <button class="back-button" onclick="window.skillsPageInstance.showSkillDetails(window.skillsPageInstance.findSkillByIdInData('${skillId}'))">
              ← 回到技能詳情
            </button>
          </div>
          <h3 class="learning-path-title">「${skill.name}」學習路徑</h3>
        </header>
        
        <div class="learning-path-content">
          <!-- 技能概覽 -->
          <div class="skill-overview-section">
            <div class="skill-stats">
              <div class="stat-item">
                <span class="stat-label">難度等級</span>
                <span class="stat-value">${learningPath.difficulty}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">預估時間</span>
                <span class="stat-value">${learningPath.estimatedTime}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">技能等級</span>
                <span class="stat-value">Level ${skill.level || 1}</span>
              </div>
            </div>
          </div>

          <!-- 前置技能 -->
          ${learningPath.prerequisites.length > 0 ? `
            <div class="prerequisites-section">
              <h4 class="section-title">📋 前置技能要求</h4>
              <div class="prerequisites-list">
                ${learningPath.prerequisites.map(prereq => `
                  <div class="prerequisite-item" onclick="window.skillsPageInstance.showSkillDetails(window.skillsPageInstance.findSkillByIdInData('${prereq.id}'))">
                    <div class="prereq-name">${prereq.name}</div>
                    <div class="prereq-hint">點擊查看詳情</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="prerequisites-section">
              <h4 class="section-title">📋 前置技能要求</h4>
              <p class="no-prerequisites">此技能無特殊前置要求，可直接學習</p>
            </div>
          `}

          <!-- 學習資源 -->
          <div class="resources-section">
            <h4 class="section-title">📚 推薦學習資源</h4>
            <div class="resources-list">
              ${learningPath.recommendedResources.map(resource => `
                <div class="resource-item">
                  <div class="resource-header">
                    <span class="resource-type">${resource.type}</span>
                    <span class="resource-name">${resource.name}</span>
                  </div>
                  ${resource.url !== '#' ? `
                    <a href="${resource.url}" target="_blank" class="resource-link">前往學習</a>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 後續發展 -->
          ${learningPath.nextSteps.length > 0 ? `
            <div class="next-steps-section">
              <h4 class="section-title">🚀 後續發展方向</h4>
              <div class="next-steps-list">
                ${learningPath.nextSteps.map(nextSkill => `
                  <div class="next-step-item" onclick="window.skillsPageInstance.showSkillDetails(window.skillsPageInstance.findSkillByIdInData('${nextSkill.id}'))">
                    <div class="next-step-name">${nextSkill.name}</div>
                    <div class="next-step-category">${skillsDataConfig.categories[nextSkill.category]?.name || nextSkill.category}</div>
                    <div class="next-step-hint">點擊查看學習路徑</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="next-steps-section">
              <h4 class="section-title">🚀 後續發展方向</h4>
              <p class="no-next-steps">此技能已達到當前學習路徑終點，可考慮深入專精或跨領域發展</p>
            </div>
          `}

          <!-- 學習建議 -->
          <div class="learning-tips-section">
            <h4 class="section-title">💡 學習建議</h4>
            <div class="learning-tips">
              <div class="tip-item">
                <strong>實踐導向：</strong>通過實際專案來鞏固所學知識
              </div>
              <div class="tip-item">
                <strong>持續學習：</strong>技術發展迅速，需要持續跟進新發展
              </div>
              <div class="tip-item">
                <strong>社群參與：</strong>參與相關技術社群，與同行交流經驗
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 顯示側邊欄
    const panel = document.getElementById('skill-details-panel');
    if (panel) {
      panel.classList.add('show');
    }
  }

  // 移除全螢幕功能，統一介面設計

  /**
   * 重置視圖到中心
   */
  centerView() {
    if (this.skillTree && this.skillTree.viewportController) {
      this.skillTree.viewportController.centerView();
      console.log('🎯 視圖已重置到中心');
    }
  }

  /**
   * 顯示操作說明
   */
  showHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  /**
   * 隱藏操作說明
   */
  hideHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  }

  /**
   * 顯示錯誤訊息
   */
  showError(message) {
    console.error('🚨 SkillsPage Error:', message);
    
    // 可以在這裡添加錯誤提示UI
    const loading = document.getElementById('skill-tree-loading');
    if (loading) {
      loading.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">${message}</p>
          <button class="retry-btn" onclick="location.reload()">重新載入</button>
        </div>
      `;
      loading.style.display = 'flex';
    }
  }

  /**
   * 銷毀組件
   */
  destroy() {
    try {
      // 清理全局實例
      if (window.skillsPageInstance === this) {
        window.skillsPageInstance = null;
      }

      // 銷毀技能樹組件
      if (this.skillTree) {
        this.skillTree.destroy();
        this.skillTree = null;
      }
      
      // 銷毀視窗控制器
      if (this.viewportController) {
        this.viewportController.destroy();
        this.viewportController = null;
      }

      // 移除事件監聽器
      const buttons = ['center-btn', 'help-btn', 'help-close-btn', 'help-backdrop'];
      buttons.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.removeEventListener('click', this.boundEvents?.[id]);
        }
      });

      // 清理全局事件
      document.removeEventListener('keydown', this.boundEvents?.keydown);

      super.destroy();
      console.log('🌟 SkillsPage destroyed');
      
    } catch (error) {
      console.error('❌ SkillsPage destroy error:', error);
    }
  }
}