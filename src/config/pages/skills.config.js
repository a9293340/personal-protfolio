/**
 * 技能頁面配置
 * 
 * Config-Driven 技能樹展示和互動配置
 */

export const skillsPageConfig = {
  meta: {
    title: "技能樹 | Skills - 從後端到架構師的技術路徑",
    description: "互動式技能樹展示，探索從後端工程師到系統架構師的完整技術發展路徑",
    keywords: "skill tree, backend development, system architecture, technical skills, career path"
  },
  
  layout: {
    type: "full-viewport",
    maxWidth: "none",
    overflow: "hidden"
  },
  
  sections: [
    {
      id: "skill-tree-main",
      type: "interactive-skill-tree",
      position: { order: 1 },
      config: {
        // 技能樹核心配置
        treeData: "{{data.skills.tree}}",
        centerNode: "backend-foundation",
        
        // 視覺配置
        visual: {
          gridType: "hexagonal",
          nodeSize: {
            desktop: 60,
            tablet: 50, 
            mobile: 40
          },
          spacing: {
            desktop: 120,
            tablet: 100,
            mobile: 80
          },
          colors: {
            mastered: "var(--primary-gold)",
            available: "var(--primary-blue)", 
            locked: "var(--gray-600)",
            connecting: "var(--primary-gold)"
          }
        },
        
        // 互動功能
        interaction: {
          enableZoom: true,
          enablePan: true,
          enableKeyboard: true,
          zoomRange: { min: 0.3, max: 2.0 },
          panBoundary: { margin: 200 },
          clickToFocus: true,
          hoverTooltip: true
        },
        
        // 動畫配置
        animations: {
          nodeReveal: "scale-fade-in",
          connectionDraw: "line-draw",
          levelUp: "skill-mastery-burst",
          focus: "zoom-highlight",
          durations: {
            nodeReveal: "400ms",
            connectionDraw: "800ms", 
            levelUp: "1200ms",
            focus: "300ms"
          }
        },
        
        // 路徑建議
        pathSuggestions: {
          enabled: true,
          algorithms: ["shortest", "recommended", "alternative"],
          highlightColor: "var(--bright-gold)",
          animateTransition: true
        }
      }
    },
    
    {
      id: "skill-detail-panel",
      type: "skill-detail-sidebar",
      position: { side: "right", width: "350px" },
      config: {
        defaultState: "minimized",
        expandTrigger: "skillNodeClick",
        content: {
          sections: [
            "skill-info",
            "prerequisites", 
            "learning-resources",
            "practical-applications",
            "related-projects"
          ]
        },
        animations: {
          expand: "slide-from-right",
          collapse: "slide-to-right",
          contentSwitch: "fade-cross"
        }
      }
    },
    
    {
      id: "skill-tree-controls",
      type: "floating-control-panel",
      position: { side: "bottom-right", margin: "var(--space-4)" },
      config: {
        controls: [
          {
            type: "view-mode",
            options: ["overview", "detailed", "learning-path"],
            default: "overview"
          },
          {
            type: "filter",
            categories: ["all", "mastered", "available", "planned"],
            default: "all"
          },
          {
            type: "zoom-controls", 
            buttons: ["zoom-in", "zoom-out", "reset-view"]
          },
          {
            type: "path-finder",
            placeholder: "搜尋技能或路徑...",
            suggestions: true
          }
        ],
        style: "glassmorphism",
        collapsed: false
      }
    },
    
    {
      id: "progress-indicator",
      type: "skill-progress-bar",
      position: { side: "top", height: "60px" },
      config: {
        metrics: [
          {
            label: "整體進度",
            value: "{{stats.skillProgress.overall}}",
            max: 100,
            color: "var(--primary-gold)"
          },
          {
            label: "後端技能",
            value: "{{stats.skillProgress.backend}}",
            max: 100,
            color: "var(--primary-blue)"
          },
          {
            label: "架構技能", 
            value: "{{stats.skillProgress.architecture}}",
            max: 100,
            color: "var(--bright-gold)"
          }
        ],
        showPercentage: true,
        animateOnLoad: true
      }
    }
  ],
  
  // 鍵盤快速鍵
  keyboardShortcuts: {
    "Space": "toggle-detail-panel",
    "Escape": "close-all-panels", 
    "ArrowKeys": "navigate-nodes",
    "Plus": "zoom-in",
    "Minus": "zoom-out", 
    "Home": "reset-view",
    "F": "toggle-fullscreen",
    "?": "show-help"
  },
  
  // 狀態持久化
  persistence: {
    saveViewport: true,
    saveProgress: true,
    saveFilters: true,
    storageKey: "skillTreeState"
  },
  
  // 響應式配置
  responsive: {
    mobile: {
      sections: {
        "skill-tree-main": {
          config: {
            interaction: {
              enableKeyboard: false,
              zoomRange: { min: 0.5, max: 1.5 }
            }
          }
        },
        "skill-detail-panel": {
          position: { side: "bottom", height: "40vh" },
          config: {
            defaultState: "hidden",
            expandTrigger: "skillNodeClick"
          }
        },
        "skill-tree-controls": {
          position: { side: "bottom", fullWidth: true },
          config: {
            collapsed: true,
            controls: ["filter", "path-finder"]
          }
        }
      }
    },
    tablet: {
      sections: {
        "skill-detail-panel": {
          position: { side: "right", width: "300px" }
        }
      }
    }
  }
};

export default skillsPageConfig;