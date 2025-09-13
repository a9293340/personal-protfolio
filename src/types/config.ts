/**
 * 配置系統相關類型定義
 */

// 基礎類型
export type ConfigValue =
  | string
  | number
  | boolean
  | null
  | ConfigObject
  | ConfigArray;
export interface ConfigObject {
  [key: string]: ConfigValue;
}
export type ConfigArray = ConfigValue[];

// 配置更新事件類型
export interface ConfigUpdateEvent {
  key: string;
  oldValue: ConfigValue;
  newValue: ConfigValue;
  action: 'created' | 'updated' | 'merged';
}

export interface ConfigDeleteEvent {
  key: string;
  oldValue: ConfigValue;
}

export interface ConfigClearEvent {
  oldConfigs: Map<string, ConfigValue>;
}

export interface ConfigImportEvent {
  data: ConfigObject;
  merge: boolean;
}

export interface VariableUpdateEvent {
  key: string;
  value: ConfigValue;
}

// 插值處理器類型
export type InterpolatorHandler = (match: string, key: string) => string;

// 配置統計信息類型
export interface ConfigStats {
  totalConfigs: number;
  totalVariables: number;
  totalInterpolators: number;
  configTypes: {
    objects: number;
    arrays: number;
    strings: number;
    numbers: number;
    booleans: number;
    others: number;
  };
}

// 配置驗證結果類型
export interface ValidationIssue {
  type: string;
  key?: string;
  message: string;
}

export interface ConfigValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

// Schema 驗證相關類型
export interface ValidationError {
  type:
    | 'required'
    | 'type'
    | 'constraint'
    | 'custom'
    | 'custom_function'
    | 'custom_function_error';
  path: string;
  message: string;
  value?: any;
  expected?: string;
  actual?: string;
  constraint?: string;
  validator?: string;
}

export interface ValidationWarning {
  type: 'unknown_validator' | 'additional_property';
  path: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    errorsByType: Record<string, number>;
    warningsByType: Record<string, number>;
  };
}

export interface MultiValidationResult {
  results: Record<string, ValidationResult>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    totalErrors: number;
    totalWarnings: number;
  };
}

// Schema 定義類型
export type ValidatorFunction = (value: any, constraint?: any) => string | null;
export type CustomValidateFunction = (
  value: any
) => string | boolean | null | undefined;

export interface SchemaConstraints {
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
  [key: string]: any;
}

export interface SchemaDefinition {
  type?: string;
  required?: boolean;
  constraints?: SchemaConstraints;
  validator?: string;
  validate?: CustomValidateFunction;
  properties?: Record<string, SchemaDefinition>;
  items?: SchemaDefinition;
  additionalProperties?: boolean;
}

// 載入器相關類型
export interface LoadOptions {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  transform?: (data: any) => any;
  validate?: boolean;
  schema?: string;
}

export interface LoadResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
  timestamp: number;
  cached?: boolean;
}

export interface BatchLoadResult {
  results: Record<string, LoadResult>;
  summary: {
    total: number;
    success: number;
    failed: number;
    cached: number;
  };
}

// 環境變數類型
export interface EnvironmentVariables extends ConfigObject {
  NODE_ENV: string;
  DEV: boolean;
  PROD: boolean;
}

export interface BrowserInfo extends ConfigObject {
  userAgent: string;
  language: string;
  platform: string;
  isMobile: boolean;
  isDesktop: boolean;
}

export interface TimeInfo extends ConfigObject {
  timestamp: number;
  year: number;
  month: number;
  date: number;
  isoString: string;
}
