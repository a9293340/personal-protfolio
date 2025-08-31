/**
 * 配置插值系統
 * 
 * 實現 {{變數}} 模板語法解析，支援嵌套物件和數組插值處理
 */

export interface InterpolationContext {
  [key: string]: any;
}

export interface InterpolationOptions {
  strict?: boolean;           // 嚴格模式：未找到變數時拋出錯誤
  defaultValue?: any;         // 默認值
  maxDepth?: number;          // 最大解析深度，防止循環引用
  allowFunctions?: boolean;   // 是否允許函數調用
  customResolvers?: Record<string, (path: string, context: InterpolationContext) => any>;
}

/**
 * 配置插值器類
 */
export class ConfigInterpolator {
  private static instance: ConfigInterpolator | null = null;
  private readonly variablePattern = /\{\{([^}]+)\}\}/g;
  private readonly functionPattern = /^(\w+)\(([^)]*)\)$/;
  
  private constructor() {}

  /**
   * 獲取單例實例
   */
  static getInstance(): ConfigInterpolator {
    if (!ConfigInterpolator.instance) {
      ConfigInterpolator.instance = new ConfigInterpolator();
    }
    return ConfigInterpolator.instance;
  }

  /**
   * 主要插值方法
   */
  interpolate(
    template: any, 
    context: InterpolationContext, 
    options: InterpolationOptions = {}
  ): any {
    const opts = {
      strict: false,
      maxDepth: 10,
      allowFunctions: false,
      ...options
    };

    try {
      return this.processValue(template, context, opts, 0, new Set());
    } catch (error) {
      if (opts.strict) {
        throw new Error(`Configuration interpolation failed: ${(error as Error).message}`);
      }
      console.warn('Configuration interpolation warning:', (error as Error).message);
      return template;
    }
  }

  /**
   * 處理任意類型的值
   */
  private processValue(
    value: any,
    context: InterpolationContext,
    options: InterpolationOptions,
    depth: number,
    visited: Set<any>
  ): any {
    // 防止無限遞歸
    if (depth > (options.maxDepth || 10)) {
      throw new Error(`Maximum interpolation depth (${options.maxDepth}) exceeded`);
    }

    // 防止循環引用
    if (visited.has(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return this.interpolateString(value, context, options);
    }

    if (Array.isArray(value)) {
      visited.add(value);
      const result = value.map(item => 
        this.processValue(item, context, options, depth + 1, visited)
      );
      visited.delete(value);
      return result;
    }

    if (value && typeof value === 'object') {
      visited.add(value);
      const result: any = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = this.processValue(val, context, options, depth + 1, visited);
      }
      visited.delete(value);
      return result;
    }

    return value;
  }

  /**
   * 插值字符串
   */
  private interpolateString(
    template: string,
    context: InterpolationContext,
    options: InterpolationOptions
  ): any {
    // 如果沒有插值模板，直接返回
    if (!template.includes('{{')) {
      return template;
    }

    let hasInterpolation = false;
    
    const result = template.replace(this.variablePattern, (match, expression) => {
      hasInterpolation = true;
      const trimmedExpr = expression.trim();
      
      try {
        const value = this.resolveExpression(trimmedExpr, context, options);
        
        // 如果整個字符串就是一個插值表達式，返回原始類型
        if (template === match) {
          return value;
        }
        
        // 否則轉換為字符串
        return this.valueToString(value);
      } catch (error) {
        if (options.strict) {
          throw error;
        }
        
        console.warn(`Failed to resolve variable: ${trimmedExpr}`, error);
        return options.defaultValue !== undefined ? 
          this.valueToString(options.defaultValue) : match;
      }
    });

    // 如果整個字符串就是一個插值且成功解析，返回解析後的值
    if (hasInterpolation && template.match(/^\{\{[^}]+\}\}$/)) {
      const expression = template.slice(2, -2).trim();
      try {
        return this.resolveExpression(expression, context, options);
      } catch (error) {
        if (options.strict) {
          throw error;
        }
        return options.defaultValue !== undefined ? options.defaultValue : template;
      }
    }

    return result;
  }

  /**
   * 解析表達式
   */
  private resolveExpression(
    expression: string,
    context: InterpolationContext,
    options: InterpolationOptions
  ): any {
    // 檢查是否是函數調用
    if (options.allowFunctions) {
      const funcMatch = expression.match(this.functionPattern);
      if (funcMatch) {
        return this.resolveFunction(funcMatch[1], funcMatch[2], context, options);
      }
    }

    // 檢查自定義解析器
    if (options.customResolvers) {
      for (const [prefix, resolver] of Object.entries(options.customResolvers)) {
        if (expression.startsWith(prefix + '.')) {
          return resolver(expression, context);
        }
      }
    }

    // 標準路徑解析
    return this.resolvePath(expression, context, options);
  }

  /**
   * 解析物件路徑
   */
  private resolvePath(
    path: string,
    context: InterpolationContext,
    options: InterpolationOptions
  ): any {
    const parts = path.split('.');
    let current: any = context;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // 處理數組索引
      const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        current = current?.[arrayName];
        if (!Array.isArray(current)) {
          throw new Error(`Expected array at path: ${parts.slice(0, i + 1).join('.')}`);
        }
        current = current[parseInt(index)];
      } else {
        current = current?.[part];
      }

      if (current === undefined) {
        if (options.strict) {
          throw new Error(`Variable not found: ${path}`);
        }
        return options.defaultValue;
      }
    }

    return current;
  }

  /**
   * 解析函數調用
   */
  private resolveFunction(
    funcName: string,
    argsString: string,
    context: InterpolationContext,
    options: InterpolationOptions
  ): any {
    const args = argsString ? this.parseArguments(argsString, context, options) : [];

    // 內建函數
    const builtInFunctions = this.getBuiltInFunctions();
    if (builtInFunctions[funcName]) {
      return builtInFunctions[funcName](...args);
    }

    // 上下文中的函數
    const contextFunction = this.resolvePath(funcName, context, options);
    if (typeof contextFunction === 'function') {
      return contextFunction(...args);
    }

    throw new Error(`Unknown function: ${funcName}`);
  }

  /**
   * 解析函數參數
   */
  private parseArguments(
    argsString: string,
    context: InterpolationContext,
    options: InterpolationOptions
  ): any[] {
    const args: any[] = [];
    const parts = argsString.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      
      // 字符串字面量
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        args.push(trimmed.slice(1, -1));
      }
      // 數字字面量
      else if (/^\d+(\.\d+)?$/.test(trimmed)) {
        args.push(parseFloat(trimmed));
      }
      // 布爾值
      else if (trimmed === 'true' || trimmed === 'false') {
        args.push(trimmed === 'true');
      }
      // 變數引用
      else {
        args.push(this.resolvePath(trimmed, context, options));
      }
    }

    return args;
  }

  /**
   * 獲取內建函數
   */
  private getBuiltInFunctions(): Record<string, (...args: any[]) => any> {
    return {
      // 字符串函數
      upper: (str: string) => String(str).toUpperCase(),
      lower: (str: string) => String(str).toLowerCase(),
      capitalize: (str: string) => String(str).charAt(0).toUpperCase() + String(str).slice(1),
      
      // 數組函數
      length: (arr: any) => Array.isArray(arr) ? arr.length : String(arr).length,
      join: (arr: any[], separator = ',') => Array.isArray(arr) ? arr.join(separator) : String(arr),
      slice: (arr: any[], start: number, end?: number) => 
        Array.isArray(arr) ? arr.slice(start, end) : String(arr).slice(start, end),
      
      // 數學函數
      max: (...nums: number[]) => Math.max(...nums),
      min: (...nums: number[]) => Math.min(...nums),
      round: (num: number) => Math.round(num),
      ceil: (num: number) => Math.ceil(num),
      floor: (num: number) => Math.floor(num),
      
      // 條件函數
      default: (value: any, defaultValue: any) => value !== undefined && value !== null ? value : defaultValue,
      if: (condition: any, trueValue: any, falseValue: any) => condition ? trueValue : falseValue,
      
      // 格式化函數
      formatDate: (date: string | Date, format = 'YYYY-MM-DD') => {
        const d = new Date(date);
        return this.formatDate(d, format);
      },
      formatNumber: (num: number, decimals = 0) => num.toFixed(decimals),
      
      // 實用函數
      keys: (obj: object) => Object.keys(obj),
      values: (obj: object) => Object.values(obj),
      entries: (obj: object) => Object.entries(obj)
    };
  }

  /**
   * 格式化日期
   */
  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day);
  }

  /**
   * 值轉字符串
   */
  private valueToString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  /**
   * 驗證配置模板
   */
  validateTemplate(template: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      this.findVariables(template).forEach(variable => {
        // 檢查變數語法是否正確
        if (!variable.trim()) {
          errors.push('Empty variable expression found');
        }
        
        // 檢查是否有未閉合的大括號
        if (variable.includes('{{') || variable.includes('}}')) {
          errors.push(`Invalid variable syntax: {{${variable}}}`);
        }
      });
    } catch (error) {
      errors.push(`Template validation error: ${(error as Error).message}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 查找模板中的所有變數
   */
  findVariables(template: any): string[] {
    const variables = new Set<string>();
    
    const collect = (value: any) => {
      if (typeof value === 'string') {
        const matches = value.matchAll(this.variablePattern);
        for (const match of matches) {
          variables.add(match[1].trim());
        }
      } else if (Array.isArray(value)) {
        value.forEach(collect);
      } else if (value && typeof value === 'object') {
        Object.values(value).forEach(collect);
      }
    };
    
    collect(template);
    return Array.from(variables);
  }
}

/**
 * 便捷函數：創建插值器實例
 */
export function createInterpolator(): ConfigInterpolator {
  return ConfigInterpolator.getInstance();
}

/**
 * 便捷函數：直接進行插值
 */
export function interpolateConfig(
  template: any,
  context: InterpolationContext,
  options?: InterpolationOptions
): any {
  const interpolator = ConfigInterpolator.getInstance();
  return interpolator.interpolate(template, context, options);
}

export default ConfigInterpolator;