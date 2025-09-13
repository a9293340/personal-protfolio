/**
 * 技能樹配置 Schema 定義
 * 用於驗證技能樹配置的結構和內容
 */

import type { SchemaDefinition } from '@/types/config.js';

export const skillTreeSchema: SchemaDefinition = {
  type: 'object',
  required: true,
  properties: {
    // 元數據
    meta: {
      type: 'object',
      required: true,
      properties: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: true },
        version: { type: 'string', required: true },
        lastUpdated: { type: 'string', required: false },
      },
    },

    // 技能領域定義
    domains: {
      type: 'object',
      required: true,
      properties: {
        frontend: {
          type: 'object',
          required: true,
          properties: {
            color: { type: 'string', validator: 'color', required: true },
            direction: {
              type: 'number',
              constraints: { min: 0, max: 360 },
              required: true,
            },
            name: { type: 'string', required: true },
            description: { type: 'string', required: false },
          },
        },
        backend: {
          type: 'object',
          required: true,
          properties: {
            color: { type: 'string', validator: 'color', required: true },
            direction: {
              type: 'number',
              constraints: { min: 0, max: 360 },
              required: true,
            },
            name: { type: 'string', required: true },
            description: { type: 'string', required: false },
          },
        },
        database: {
          type: 'object',
          required: true,
          properties: {
            color: { type: 'string', validator: 'color', required: true },
            direction: {
              type: 'number',
              constraints: { min: 0, max: 360 },
              required: true,
            },
            name: { type: 'string', required: true },
            description: { type: 'string', required: false },
          },
        },
      },
    },

    // 熟練度等級
    proficiencyLevels: {
      type: 'object',
      required: true,
      properties: {
        expert: {
          type: 'object',
          required: true,
          properties: {
            symbol: {
              type: 'string',
              constraints: { min: 1, max: 1 },
              required: true,
            },
            name: { type: 'string', required: true },
            opacity: {
              type: 'number',
              constraints: { min: 0, max: 1 },
              required: true,
            },
            color: { type: 'string', validator: 'color', required: true },
            description: { type: 'string', required: false },
          },
        },
        intermediate: {
          type: 'object',
          required: true,
          properties: {
            symbol: {
              type: 'string',
              constraints: { min: 1, max: 1 },
              required: true,
            },
            name: { type: 'string', required: true },
            opacity: {
              type: 'number',
              constraints: { min: 0, max: 1 },
              required: true,
            },
            color: { type: 'string', validator: 'color', required: true },
            description: { type: 'string', required: false },
          },
        },
        learning: {
          type: 'object',
          required: true,
          properties: {
            symbol: {
              type: 'string',
              constraints: { min: 1, max: 1 },
              required: true,
            },
            name: { type: 'string', required: true },
            opacity: {
              type: 'number',
              constraints: { min: 0, max: 1 },
              required: true,
            },
            color: { type: 'string', validator: 'color', required: true },
            description: { type: 'string', required: false },
          },
        },
      },
    },

    // 技能節點
    skills: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            required: true,
            constraints: { pattern: '^[a-z0-9-]+$' }, // 只允許小寫字母、數字、連字符
          },
          name: { type: 'string', required: true },
          domain: {
            type: 'string',
            required: true,
            constraints: {
              enum: [
                'frontend',
                'backend',
                'database',
                'cloud-devops',
                'ai',
                'architecture',
              ],
            },
          },
          level: {
            type: 'string',
            required: true,
            constraints: { enum: ['major', 'minor'] },
          },
          position: {
            type: 'object',
            required: true,
            properties: {
              q: { type: 'integer', required: true },
              r: { type: 'integer', required: true },
            },
          },
          proficiency: {
            type: 'string',
            required: true,
            constraints: { enum: ['expert', 'intermediate', 'learning'] },
          },
          difficulty: {
            type: 'integer',
            required: true,
            constraints: { min: 1, max: 5 },
          },
          description: { type: 'string', required: false },
          relatedSkills: {
            type: 'array',
            required: false,
            items: { type: 'string' },
          },
        },
      },
    },

    // 視覺配置
    visual: {
      type: 'object',
      required: false,
      properties: {
        layout: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              constraints: { enum: ['hexagonal', 'grid', 'circular'] },
            },
            centerPosition: {
              type: 'object',
              properties: {
                q: { type: 'integer' },
                r: { type: 'integer' },
              },
            },
            maxRadius: { type: 'integer', constraints: { min: 1 } },
            nodeSize: { type: 'integer', constraints: { min: 10 } },
            nodeSpacing: { type: 'integer', constraints: { min: 20 } },
          },
        },

        animation: {
          type: 'object',
          properties: {
            enableTransitions: { type: 'boolean' },
            duration: { type: 'integer', constraints: { min: 0 } },
            easing: { type: 'string' },
            stagger: { type: 'integer', constraints: { min: 0 } },
          },
        },

        interaction: {
          type: 'object',
          properties: {
            enableZoom: { type: 'boolean' },
            enablePan: { type: 'boolean' },
            enableTooltips: { type: 'boolean' },
            zoomRange: {
              type: 'array',
              items: { type: 'number', constraints: { min: 0.1, max: 10 } },
              constraints: { min: 2, max: 2 }, // 確保恰好有兩個元素
            },
          },
        },
      },
    },

    // 行為配置
    behavior: {
      type: 'object',
      required: false,
      properties: {
        responsive: {
          type: 'object',
          properties: {
            mobile: { type: 'object' },
            tablet: { type: 'object' },
            desktop: { type: 'object' },
          },
        },

        interactions: {
          type: 'object',
          properties: {
            hoverEffects: { type: 'boolean' },
            clickToExpand: { type: 'boolean' },
            keyboardNavigation: { type: 'boolean' },
            touchGestures: { type: 'boolean' },
          },
        },
      },
    },
  },

  // 不允許額外屬性
  additionalProperties: false,
};

export default skillTreeSchema;
