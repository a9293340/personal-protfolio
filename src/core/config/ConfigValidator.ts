/**
 * ConfigValidator - 配置驗證器
 * 
 * 功能：
 * 1. Schema 定義和驗證
 * 2. 類型檢查和約束
 * 3. 必填欄位檢查
 * 4. 自訂驗證規則
 * 5. 詳細錯誤報告
 * 
 * @author Claude
 * @version 1.0.0
 */

import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  MultiValidationResult,
  ValidatorFunction,
  SchemaDefinition,
  CustomValidateFunction
} from '../../types/config.js';

export class ConfigValidator {
  private schemas: Map<string, SchemaDefinition>;
  private customValidators: Map<string, ValidatorFunction>;

  constructor() {
    this.schemas = new Map();
    this.customValidators = new Map();
    
    this.registerBuiltInValidators();
  }

  /**
   * 註冊內建驗證器
   */
  private registerBuiltInValidators(): void {
    // 基本類型驗證器
    this.customValidators.set('string', (value: any): string | null => {
      return typeof value === 'string' ? null : 'Expected string';
    });
    
    this.customValidators.set('number', (value: any): string | null => {
      return typeof value === 'number' && !isNaN(value) ? null : 'Expected number';
    });
    
    this.customValidators.set('integer', (value: any): string | null => {
      return Number.isInteger(value) ? null : 'Expected integer';
    });
    
    this.customValidators.set('boolean', (value: any): string | null => {
      return typeof value === 'boolean' ? null : 'Expected boolean';
    });
    
    this.customValidators.set('array', (value: any): string | null => {
      return Array.isArray(value) ? null : 'Expected array';
    });
    
    this.customValidators.set('object', (value: any): string | null => {
      return value !== null && typeof value === 'object' && !Array.isArray(value) 
        ? null : 'Expected object';
    });
    
    // 範圍驗證器
    this.customValidators.set('min', (value: any, constraint: number): string | null => {
      if (typeof value === 'number') {
        return value >= constraint ? null : `Must be at least ${constraint}`;
      }
      if (typeof value === 'string' || Array.isArray(value)) {
        return value.length >= constraint ? null : `Length must be at least ${constraint}`;
      }
      return 'Cannot apply min constraint to this type';
    });
    
    this.customValidators.set('max', (value: any, constraint: number): string | null => {
      if (typeof value === 'number') {
        return value <= constraint ? null : `Must be at most ${constraint}`;
      }
      if (typeof value === 'string' || Array.isArray(value)) {
        return value.length <= constraint ? null : `Length must be at most ${constraint}`;
      }
      return 'Cannot apply max constraint to this type';
    });
    
    // 模式驗證器
    this.customValidators.set('pattern', (value: any, constraint: string): string | null => {
      if (typeof value !== 'string') {
        return 'Pattern can only be applied to strings';
      }
      const regex = new RegExp(constraint);
      return regex.test(value) ? null : `Must match pattern: ${constraint}`;
    });
    
    // 枚舉驗證器
    this.customValidators.set('enum', (value: any, constraint: any[]): string | null => {
      return constraint.includes(value) ? null : `Must be one of: ${constraint.join(', ')}`;
    });
    
    // URL 驗證器
    this.customValidators.set('url', (value: any): string | null => {
      if (typeof value !== 'string') {
        return 'URL must be a string';
      }
      try {
        new URL(value);
        return null;
      } catch {
        return 'Must be a valid URL';
      }
    });
    
    // Email 驗證器
    this.customValidators.set('email', (value: any): string | null => {
      if (typeof value !== 'string') {
        return 'Email must be a string';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : 'Must be a valid email address';
    });
    
    // 顏色驗證器
    this.customValidators.set('color', (value: any): string | null => {
      if (typeof value !== 'string') {
        return 'Color must be a string';
      }
      const colorRegex = /^#([0-9A-Fa-f]{3}){1,2}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/;
      return colorRegex.test(value) ? null : 'Must be a valid color (hex, rgb, rgba, hsl, hsla)';
    });
  }

  /**
   * 定義 Schema
   */
  defineSchema(name: string, schema: SchemaDefinition): ConfigValidator {
    this.validateSchemaStructure(schema);
    this.schemas.set(name, schema);
    return this;
  }

  /**
   * 驗證 Schema 結構
   */
  private validateSchemaStructure(schema: SchemaDefinition): void {
    if (!schema || typeof schema !== 'object') {
      throw new Error('Schema must be an object');
    }
    
    const validateNode = (node: any, path = ''): void => {
      if (!node || typeof node !== 'object') return;
      
      // 檢查是否為欄位定義
      if ('type' in node || 'required' in node || 'validator' in node) {
        if (node.type && typeof node.type !== 'string') {
          throw new Error(`Invalid type at ${path}: must be string`);
        }
        
        if (node.required !== undefined && typeof node.required !== 'boolean') {
          throw new Error(`Invalid required at ${path}: must be boolean`);
        }
        
        return;
      }
      
      // 遞歸檢查子節點
      for (const [key, value] of Object.entries(node)) {
        const currentPath = path ? `${path}.${key}` : key;
        validateNode(value, currentPath);
      }
    };
    
    validateNode(schema);
  }

  /**
   * 驗證配置
   */
  validate(schemaName: string, config: any): ValidationResult {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new Error(`Schema '${schemaName}' not found`);
    }
    
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    this.validateNode(config, schema, '', errors, warnings);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        totalErrors: errors.length,
        totalWarnings: warnings.length,
        errorsByType: this.groupErrorsByType(errors),
        warningsByType: this.groupErrorsByType(warnings as any)
      }
    };
  }

  /**
   * 驗證節點
   */
  private validateNode(
    value: any, 
    schema: SchemaDefinition, 
    path: string, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    // 檢查必填欄位
    if (schema.required && (value === undefined || value === null)) {
      errors.push({
        type: 'required',
        path,
        message: 'Required field is missing',
        value
      });
      return;
    }
    
    // 如果值為空且非必填，跳過驗證
    if (value === undefined || value === null) {
      return;
    }
    
    // 類型驗證
    if (schema.type) {
      const typeValidator = this.customValidators.get(schema.type);
      if (typeValidator) {
        const error = typeValidator(value);
        if (error) {
          errors.push({
            type: 'type',
            path,
            message: error,
            expected: schema.type,
            actual: typeof value,
            value
          });
          return; // 類型錯誤時不再繼續驗證
        }
      }
    }
    
    // 約束驗證
    if (schema.constraints) {
      for (const [constraintName, constraintValue] of Object.entries(schema.constraints)) {
        const validator = this.customValidators.get(constraintName);
        if (validator) {
          const error = validator(value, constraintValue);
          if (error) {
            errors.push({
              type: 'constraint',
              constraint: constraintName,
              path,
              message: error,
              value,
              expected: constraintValue
            });
          }
        }
      }
    }
    
    // 自訂驗證器
    if (schema.validator) {
      const validatorName = schema.validator;
      const validator = this.customValidators.get(validatorName);
      if (validator) {
        const error = validator(value);
        if (error) {
          errors.push({
            type: 'custom',
            validator: validatorName,
            path,
            message: error,
            value
          });
        }
      } else {
        warnings.push({
          type: 'unknown_validator',
          path,
          message: `Unknown validator: ${validatorName}`,
          value
        });
      }
    }
    
    // 自訂驗證函數
    if (typeof schema.validate === 'function') {
      try {
        const result = schema.validate(value);
        if (result !== null && result !== undefined && result !== true) {
          errors.push({
            type: 'custom_function',
            path,
            message: typeof result === 'string' ? result : 'Custom validation failed',
            value
          });
        }
      } catch (error) {
        errors.push({
          type: 'custom_function_error',
          path,
          message: `Validation function threw error: ${(error as Error).message}`,
          value
        });
      }
    }
    
    // 物件屬性驗證
    if (schema.type === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // 檢查定義的屬性
      if (schema.properties) {
        for (const [key, subSchema] of Object.entries(schema.properties)) {
          const subPath = path ? `${path}.${key}` : key;
          this.validateNode(value[key], subSchema, subPath, errors, warnings);
        }
      }
      
      // 檢查額外屬性
      if (schema.additionalProperties === false && schema.properties) {
        const allowedKeys = Object.keys(schema.properties);
        for (const key of Object.keys(value)) {
          if (!allowedKeys.includes(key)) {
            warnings.push({
              type: 'additional_property',
              path: path ? `${path}.${key}` : key,
              message: 'Additional property not defined in schema',
              value: value[key]
            });
          }
        }
      }
    }
    
    // 陣列元素驗證
    if (schema.type === 'array' && Array.isArray(value) && schema.items) {
      value.forEach((item, index) => {
        const subPath = `${path}[${index}]`;
        this.validateNode(item, schema.items!, subPath, errors, warnings);
      });
    }
  }

  /**
   * 按類型分組錯誤
   */
  private groupErrorsByType(errors: { type: string }[]): Record<string, number> {
    return errors.reduce((groups, error) => {
      const type = error.type;
      if (!groups[type]) {
        groups[type] = 0;
      }
      groups[type]++;
      return groups;
    }, {} as Record<string, number>);
  }

  /**
   * 註冊自訂驗證器
   */
  registerValidator(name: string, validator: ValidatorFunction): ConfigValidator {
    if (typeof validator !== 'function') {
      throw new Error('Validator must be a function');
    }
    
    this.customValidators.set(name, validator);
    return this;
  }

  /**
   * 取得已註冊的驗證器列表
   */
  getValidators(): string[] {
    return Array.from(this.customValidators.keys());
  }

  /**
   * 取得 Schema 列表
   */
  getSchemas(): string[] {
    return Array.from(this.schemas.keys());
  }

  /**
   * 取得 Schema 定義
   */
  getSchema(name: string): SchemaDefinition | null {
    return this.schemas.get(name) || null;
  }

  /**
   * 刪除 Schema
   */
  deleteSchema(name: string): boolean {
    return this.schemas.delete(name);
  }

  /**
   * 快速驗證 - 僅返回是否通過
   */
  isValid(schemaName: string, config: any): boolean {
    const result = this.validate(schemaName, config);
    return result.valid;
  }

  /**
   * 創建 Schema Builder
   */
  createSchema(): SchemaBuilder {
    return new SchemaBuilder(this);
  }

  /**
   * 驗證多個配置
   */
  validateMany(configs: Record<string, any>): MultiValidationResult {
    const results: Record<string, ValidationResult> = {};
    
    for (const [schemaName, config] of Object.entries(configs)) {
      try {
        results[schemaName] = this.validate(schemaName, config);
      } catch (error) {
        results[schemaName] = {
          valid: false,
          errors: [{
            type: 'custom_function_error',
            path: '',
            message: (error as Error).message,
          }],
          warnings: [],
          summary: {
            totalErrors: 1,
            totalWarnings: 0,
            errorsByType: { 'custom_function_error': 1 },
            warningsByType: {}
          }
        };
      }
    }
    
    return {
      results,
      summary: {
        total: Object.keys(configs).length,
        passed: Object.values(results).filter(r => r.valid).length,
        failed: Object.values(results).filter(r => !r.valid).length,
        totalErrors: Object.values(results).reduce((sum, r) => sum + (r.errors?.length || 0), 0),
        totalWarnings: Object.values(results).reduce((sum, r) => sum + (r.warnings?.length || 0), 0)
      }
    };
  }
}

/**
 * Schema Builder - 用於便捷建構 Schema
 */
class SchemaBuilder {
  private validator: ConfigValidator;
  private schema: SchemaDefinition;

  constructor(validator: ConfigValidator) {
    this.validator = validator;
    this.schema = {};
  }

  type(type: string): SchemaBuilder {
    this.schema.type = type;
    return this;
  }

  required(required = true): SchemaBuilder {
    this.schema.required = required;
    return this;
  }

  constraints(constraints: Record<string, any>): SchemaBuilder {
    this.schema.constraints = { ...this.schema.constraints, ...constraints };
    return this;
  }

  min(min: number): SchemaBuilder {
    if (!this.schema.constraints) this.schema.constraints = {};
    this.schema.constraints.min = min;
    return this;
  }

  max(max: number): SchemaBuilder {
    if (!this.schema.constraints) this.schema.constraints = {};
    this.schema.constraints.max = max;
    return this;
  }

  pattern(pattern: string): SchemaBuilder {
    if (!this.schema.constraints) this.schema.constraints = {};
    this.schema.constraints.pattern = pattern;
    return this;
  }

  enum(values: any[]): SchemaBuilder {
    if (!this.schema.constraints) this.schema.constraints = {};
    this.schema.constraints.enum = values;
    return this;
  }

  properties(properties: Record<string, SchemaDefinition>): SchemaBuilder {
    this.schema.properties = properties;
    return this;
  }

  items(items: SchemaDefinition): SchemaBuilder {
    this.schema.items = items;
    return this;
  }

  validate(validateFn: CustomValidateFunction): SchemaBuilder {
    this.schema.validate = validateFn;
    return this;
  }

  build(name?: string): SchemaDefinition {
    if (name) {
      this.validator.defineSchema(name, this.schema);
    }
    return this.schema;
  }
}