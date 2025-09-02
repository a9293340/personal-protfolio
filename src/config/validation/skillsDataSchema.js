/**
 * 技能數據驗證 Schema
 * 
 * 基於 Step 2.1.3 技能樹配置的完整性驗證
 * 確保所有技能節點、座標、前置關係都符合規範
 * 
 * @author Claude
 * @version 2.1.3
 */

/**
 * 六角形座標驗證器
 */
export class HexCoordinateValidator {
  static validate(coord) {
    if (!coord || typeof coord !== 'object') {
      return { valid: false, error: '座標必須是對象' };
    }
    
    if (!('q' in coord) || !('r' in coord)) {
      return { valid: false, error: '座標必須包含 q 和 r 屬性' };
    }
    
    if (!Number.isInteger(coord.q) || !Number.isInteger(coord.r)) {
      return { valid: false, error: 'q 和 r 必須是整數' };
    }
    
    // 驗證六角形座標的數學正確性 (q + r + s = 0)
    const s = -coord.q - coord.r;
    if (Math.abs(coord.q + coord.r + s) > 1e-10) {
      return { valid: false, error: '座標不符合六角形數學原理 (q + r + s ≠ 0)' };
    }
    
    return { valid: true };
  }
  
  static calculateDistance(coord1, coord2) {
    return (Math.abs(coord1.q - coord2.q) + 
            Math.abs(coord1.q + coord1.r - coord2.q - coord2.r) + 
            Math.abs(coord1.r - coord2.r)) / 2;
  }
}

/**
 * 技能節點驗證 Schema
 */
export const SkillNodeSchema = {
  // 必需字段
  required: ['id', 'name', 'category', 'level', 'status', 'coordinates'],
  
  // 字段類型驗證
  fields: {
    id: {
      type: 'string',
      pattern: /^[a-z-]+$/,
      minLength: 3,
      maxLength: 50,
      description: '技能ID，只能包含小寫字母和連字符'
    },
    
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 30,
      description: '技能名稱'
    },
    
    category: {
      type: 'string',
      enum: ['frontend', 'backend', 'database', 'devops', 'architecture', 'ai'],
      description: '技能類別必須是六大領域之一'
    },
    
    level: {
      type: 'integer',
      min: 1,
      max: 5,
      description: '技能等級 1-5'
    },
    
    status: {
      type: 'string',
      enum: ['mastered', 'available', 'learning', 'locked'],
      description: '技能狀態'
    },
    
    coordinates: {
      type: 'object',
      validator: HexCoordinateValidator.validate,
      description: '六角形座標'
    },
    
    prerequisites: {
      type: 'array',
      itemType: 'string',
      optional: true,
      description: '前置技能ID列表'
    },
    
    skills: {
      type: 'array',
      itemType: 'object',
      optional: true,
      itemSchema: {
        name: { type: 'string', required: true },
        proficiency: { type: 'integer', min: 0, max: 100, required: true }
      },
      description: '具體技能列表'
    },
    
    description: {
      type: 'string',
      maxLength: 200,
      optional: true,
      description: '技能描述'
    }
  }
};

/**
 * 技能數據配置驗證器
 */
export class SkillsDataValidator {
  constructor(config) {
    this.config = config;
    this.errors = [];
    this.warnings = [];
    this.skillIds = new Set();
  }
  
  /**
   * 驗證完整配置
   */
  validate() {
    this.errors = [];
    this.warnings = [];
    this.skillIds.clear();
    
    // 1. 基本結構驗證
    this.validateStructure();
    
    // 2. 技能節點驗證
    this.validateSkillNodes();
    
    // 3. 前置關係驗證
    this.validatePrerequisites();
    
    // 4. 座標分布驗證
    this.validateCoordinateDistribution();
    
    // 5. 類別平衡性驗證
    this.validateCategoryBalance();
    
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      stats: this.generateStats()
    };
  }
  
  /**
   * 驗證基本結構
   */
  validateStructure() {
    if (!this.config) {
      this.errors.push('配置對象不能為空');
      return;
    }
    
    const requiredSections = ['metadata', 'categories', 'proficiencyLevels', 'tree'];
    requiredSections.forEach(section => {
      if (!this.config[section]) {
        this.errors.push(`缺少必需的配置區段: ${section}`);
      }
    });
    
    // 驗證技能樹結構
    if (this.config.tree) {
      const requiredRings = ['center', 'ring1', 'ring2', 'ring3'];
      requiredRings.forEach(ring => {
        if (!this.config.tree[ring]) {
          this.errors.push(`技能樹缺少: ${ring}`);
        }
      });
    }
  }
  
  /**
   * 驗證技能節點
   */
  validateSkillNodes() {
    if (!this.config.tree) return;
    
    // 驗證中心節點
    if (this.config.tree.center) {
      this.validateSingleNode(this.config.tree.center, 'center');
      this.skillIds.add(this.config.tree.center.id);
    }
    
    // 驗證各環節點
    ['ring1', 'ring2', 'ring3'].forEach(ring => {
      if (this.config.tree[ring] && Array.isArray(this.config.tree[ring])) {
        this.config.tree[ring].forEach((node, index) => {
          this.validateSingleNode(node, `${ring}[${index}]`);
          
          // 檢查ID重複
          if (this.skillIds.has(node.id)) {
            this.errors.push(`重複的技能ID: ${node.id} 在 ${ring}[${index}]`);
          } else {
            this.skillIds.add(node.id);
          }
        });
      }
    });
  }
  
  /**
   * 驗證單個技能節點
   */
  validateSingleNode(node, location) {
    if (!node || typeof node !== 'object') {
      this.errors.push(`${location}: 節點必須是對象`);
      return;
    }
    
    // 檢查必需字段
    SkillNodeSchema.required.forEach(field => {
      if (!(field in node)) {
        this.errors.push(`${location}: 缺少必需字段 ${field}`);
      }
    });
    
    // 驗證各字段
    Object.entries(SkillNodeSchema.fields).forEach(([field, schema]) => {
      if (field in node) {
        this.validateField(node[field], schema, `${location}.${field}`);
      }
    });
  }
  
  /**
   * 驗證字段值
   */
  validateField(value, schema, location) {
    // 類型驗證
    if (schema.type === 'string' && typeof value !== 'string') {
      this.errors.push(`${location}: 應該是字符串，實際是 ${typeof value}`);
      return;
    }
    
    if (schema.type === 'integer' && (!Number.isInteger(value))) {
      this.errors.push(`${location}: 應該是整數，實際是 ${typeof value}`);
      return;
    }
    
    if (schema.type === 'array' && !Array.isArray(value)) {
      this.errors.push(`${location}: 應該是數組，實際是 ${typeof value}`);
      return;
    }
    
    // 枚舉值驗證
    if (schema.enum && !schema.enum.includes(value)) {
      this.errors.push(`${location}: 值 "${value}" 不在允許的枚舉中: [${schema.enum.join(', ')}]`);
    }
    
    // 範圍驗證
    if (schema.min !== undefined && value < schema.min) {
      this.errors.push(`${location}: 值 ${value} 小於最小值 ${schema.min}`);
    }
    
    if (schema.max !== undefined && value > schema.max) {
      this.errors.push(`${location}: 值 ${value} 大於最大值 ${schema.max}`);
    }
    
    // 字符串長度驗證
    if (schema.type === 'string') {
      if (schema.minLength && value.length < schema.minLength) {
        this.errors.push(`${location}: 字符串長度 ${value.length} 小於最小長度 ${schema.minLength}`);
      }
      
      if (schema.maxLength && value.length > schema.maxLength) {
        this.errors.push(`${location}: 字符串長度 ${value.length} 大於最大長度 ${schema.maxLength}`);
      }
      
      if (schema.pattern && !schema.pattern.test(value)) {
        this.errors.push(`${location}: 字符串 "${value}" 不符合規定格式`);
      }
    }
    
    // 自定義驗證器
    if (schema.validator) {
      const result = schema.validator(value);
      if (!result.valid) {
        this.errors.push(`${location}: ${result.error}`);
      }
    }
  }
  
  /**
   * 驗證前置關係
   */
  validatePrerequisites() {
    if (!this.config.tree) return;
    
    // 收集所有技能節點
    const allNodes = [];
    
    if (this.config.tree.center) allNodes.push(this.config.tree.center);
    ['ring1', 'ring2', 'ring3'].forEach(ring => {
      if (this.config.tree[ring] && Array.isArray(this.config.tree[ring])) {
        allNodes.push(...this.config.tree[ring]);
      }
    });
    
    // 驗證前置關係
    allNodes.forEach(node => {
      if (node.prerequisites && Array.isArray(node.prerequisites)) {
        node.prerequisites.forEach(prereqId => {
          if (!this.skillIds.has(prereqId)) {
            this.errors.push(`技能 ${node.id} 的前置技能 ${prereqId} 不存在`);
          }
        });
      }
    });
  }
  
  /**
   * 驗證座標分布
   */
  validateCoordinateDistribution() {
    if (!this.config.tree) return;
    
    const center = { q: 0, r: 0 };
    const coordinates = [];
    
    // 收集所有座標
    const allNodes = [];
    if (this.config.tree.center) allNodes.push(this.config.tree.center);
    ['ring1', 'ring2', 'ring3'].forEach(ring => {
      if (this.config.tree[ring] && Array.isArray(this.config.tree[ring])) {
        allNodes.push(...this.config.tree[ring]);
      }
    });
    
    allNodes.forEach(node => {
      if (node.coordinates) {
        coordinates.push({
          id: node.id,
          coord: node.coordinates,
          distance: HexCoordinateValidator.calculateDistance(center, node.coordinates)
        });
      }
    });
    
    // 檢查座標重複
    const coordStrings = coordinates.map(c => `${c.coord.q},${c.coord.r}`);
    const uniqueCoords = new Set(coordStrings);
    
    if (uniqueCoords.size !== coordinates.length) {
      this.warnings.push(`發現 ${coordinates.length - uniqueCoords.size} 個重複座標`);
    }
    
    // 檢查環的距離一致性
    this.validateRingDistances();
  }
  
  /**
   * 驗證環距離一致性
   */
  validateRingDistances() {
    if (!this.config.tree) return;
    
    const center = { q: 0, r: 0 };
    
    // Ring1 應該距離較近 (1-2)
    if (this.config.tree.ring1) {
      this.config.tree.ring1.forEach(node => {
        const distance = HexCoordinateValidator.calculateDistance(center, node.coordinates);
        if (distance > 4) {
          this.warnings.push(`Ring1 節點 ${node.id} 距離中心過遠: ${distance}`);
        }
      });
    }
    
    // Ring3 應該距離最遠 (8+)
    if (this.config.tree.ring3) {
      this.config.tree.ring3.forEach(node => {
        const distance = HexCoordinateValidator.calculateDistance(center, node.coordinates);
        if (distance < 8) {
          this.warnings.push(`Ring3 節點 ${node.id} 距離中心過近: ${distance}`);
        }
      });
    }
  }
  
  /**
   * 驗證類別平衡性
   */
  validateCategoryBalance() {
    if (!this.config.categories || !this.config.tree) return;
    
    const categoryCount = {};
    const expectedCategories = Object.keys(this.config.categories);
    
    // 統計各類別節點數量
    expectedCategories.forEach(cat => categoryCount[cat] = 0);
    
    const allNodes = [];
    if (this.config.tree.center) allNodes.push(this.config.tree.center);
    ['ring1', 'ring2', 'ring3'].forEach(ring => {
      if (this.config.tree[ring] && Array.isArray(this.config.tree[ring])) {
        allNodes.push(...this.config.tree[ring]);
      }
    });
    
    allNodes.forEach(node => {
      if (node.category && categoryCount.hasOwnProperty(node.category)) {
        categoryCount[node.category]++;
      } else {
        this.errors.push(`技能 ${node.id} 的類別 ${node.category} 未在 categories 中定義`);
      }
    });
    
    // 檢查平衡性 (每個類別應該有相近的節點數量)
    const counts = Object.values(categoryCount);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    
    if (maxCount - minCount > 2) {
      this.warnings.push(`技能類別不平衡: 最多 ${maxCount} 個節點，最少 ${minCount} 個節點`);
    }
  }
  
  /**
   * 生成統計信息
   */
  generateStats() {
    if (!this.config.tree) return {};
    
    const stats = {
      totalNodes: this.skillIds.size,
      nodesByRing: {},
      nodesByCategory: {},
      nodesByStatus: {}
    };
    
    // 按環統計
    ['center', 'ring1', 'ring2', 'ring3'].forEach(ring => {
      if (ring === 'center') {
        stats.nodesByRing[ring] = this.config.tree.center ? 1 : 0;
      } else if (this.config.tree[ring]) {
        stats.nodesByRing[ring] = this.config.tree[ring].length;
      }
    });
    
    return stats;
  }
}

/**
 * 便捷驗證函數
 */
export function validateSkillsData(config) {
  const validator = new SkillsDataValidator(config);
  return validator.validate();
}

export default {
  SkillNodeSchema,
  HexCoordinateValidator,
  SkillsDataValidator,
  validateSkillsData
};