/**
 * Config 系統入口文件
 * 
 * 統一匯出所有配置相關類別和類型
 */

// 核心類別
import { ConfigManager } from './ConfigManager.js';
import { ConfigValidator } from './ConfigValidator.js';
import { ConfigLoader } from './ConfigLoader.js';

export { ConfigManager, ConfigValidator, ConfigLoader };

// 類型定義
export type {
  ConfigValue,
  ConfigObject,
  ConfigArray,
  ConfigUpdateEvent,
  ConfigDeleteEvent,
  ConfigClearEvent,
  ConfigImportEvent,
  VariableUpdateEvent,
  InterpolatorHandler,
  ConfigStats,
  ConfigValidationResult,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  MultiValidationResult,
  ValidatorFunction,
  SchemaDefinition,
  CustomValidateFunction,
  SchemaConstraints,
  LoadOptions,
  LoadResult,
  BatchLoadResult,
  EnvironmentVariables,
  BrowserInfo,
  TimeInfo
} from '../../types/config.js';

/**
 * 創建完整的配置系統實例
 */
export function createConfigSystem(options: {
  enableValidator?: boolean;
  enableLoader?: boolean;
  defaultLoadOptions?: Partial<import('../../types/config.js').LoadOptions>;
} = {}) {
  const manager = new ConfigManager();
  const validator = options.enableValidator !== false ? new ConfigValidator() : undefined;
  const loader = options.enableLoader !== false ? new ConfigLoader(manager, validator) : undefined;
  
  // 設定預設載入選項
  if (loader && options.defaultLoadOptions) {
    loader.setDefaultOptions(options.defaultLoadOptions);
  }
  
  return {
    manager,
    validator,
    loader
  };
}

/**
 * 全域配置系統實例
 * 提供便捷的全域存取
 */
let globalConfigSystem: any = null;

/**
 * 取得全域配置系統
 */
export function getGlobalConfig() {
  if (!globalConfigSystem) {
    globalConfigSystem = createConfigSystem();
  }
  return globalConfigSystem;
}

/**
 * 設定全域配置系統
 */
export function setGlobalConfig(system: any): void {
  globalConfigSystem = system;
}

/**
 * 便捷函數：快速存取全域 ConfigManager
 */
export function getConfig() {
  return getGlobalConfig().manager;
}

/**
 * 便捷函數：快速存取全域 ConfigValidator
 */
export function getValidator() {
  const system = getGlobalConfig();
  if (!system.validator) {
    throw new Error('ConfigValidator is not enabled in global config system');
  }
  return system.validator;
}

/**
 * 便捷函數：快速存取全域 ConfigLoader
 */
export function getLoader() {
  const system = getGlobalConfig();
  if (!system.loader) {
    throw new Error('ConfigLoader is not enabled in global config system');
  }
  return system.loader;
}