/**
 * 關於頁面配置
 * 
 * Config-Driven 個人簡介和背景資訊配置
 */

export const aboutPageConfig = {
  meta: {
    title: "關於我 | About - {{personal.displayName}}",
    description: "了解我的技術背景、職涯發展歷程以及從後端工程師到系統架構師的轉職路徑",
    keywords: "backend engineer, system architect, career development, technical background"
  },
  
  layout: {
    type: "three-column-responsive",
    maxWidth: "1200px",
    columns: {
      left: { width: "300px", sticky: true },
      center: { flex: 1 },
      right: { width: "250px", sticky: true }
    }
  },
  
  sections: [
    {
      id: "character-panel",
      type: "character-status-panel",
      position: { column: "left", order: 1 },
      config: {
        character: {
          name: "{{personal.displayName}}",
          title: "{{personal.jobTitle}}",
          level: "{{personal.experienceLevel}}",
          experience: "{{personal.totalExperience}}",
          location: "{{personal.location}}",
          avatar: {
            image: "{{personal.avatarImage}}",
            frameStyle: "hexagon-gold"
          }
        },
        stats: {
          primary: [
            { name: "技術實力", value: "{{stats.technical}}", icon: "⚡" },
            { name: "架構思維", value: "{{stats.architecture}}", icon: "🏗️" },
            { name: "團隊協作", value: "{{stats.teamwork}}", icon: "🤝" },
            { name: "問題解決", value: "{{stats.problemSolving}}", icon: "🧩" }
          ],
          secondary: [
            { name: "專案經驗", value: "{{stats.projectCount}}", suffix: "個專案" },
            { name: "技術棧", value: "{{stats.techStackCount}}", suffix: "種技術" },
            { name: "團隊規模", value: "{{stats.maxTeamSize}}", suffix: "人團隊" }
          ]
        },
        badges: "{{data.achievements.badges}}"
      }
    },
    
    {
      id: "career-timeline",
      type: "timeline-vertical",
      position: { column: "center", order: 1 },
      config: {
        title: "職涯發展歷程",
        subtitle: "從後端工程師到系統架構師的轉職軌跡",
        timeline: "{{data.career.timeline}}",
        style: {
          lineColor: "var(--primary-gold)",
          nodeStyle: "gaming-hex",
          cardStyle: "glassmorphism"
        },
        animations: {
          reveal: "scroll-triggered",
          stagger: "150ms"
        }
      }
    },
    
    {
      id: "technical-philosophy",
      type: "rich-content-card", 
      position: { column: "center", order: 2 },
      config: {
        title: "技術理念與方法",
        icon: "💡",
        content: {
          sections: [
            {
              heading: "架構設計原則",
              content: "{{content.architecture.principles}}"
            },
            {
              heading: "代碼品質追求",
              content: "{{content.codeQuality.philosophy}}"
            },
            {
              heading: "團隊協作方式",
              content: "{{content.teamwork.approach}}"
            }
          ]
        }
      }
    },
    
    {
      id: "skill-summary",
      type: "skill-category-grid",
      position: { column: "right", order: 1 },
      config: {
        title: "技能總覽",
        categories: [
          {
            name: "後端開發",
            icon: "🚀",
            skills: "{{data.skills.backend}}",
            color: "var(--primary-blue)"
          },
          {
            name: "系統架構",
            icon: "🏗️", 
            skills: "{{data.skills.architecture}}",
            color: "var(--primary-gold)"
          },
          {
            name: "DevOps",
            icon: "⚙️",
            skills: "{{data.skills.devops}}",
            color: "var(--bright-gold)"
          },
          {
            name: "資料庫",
            icon: "🗄️",
            skills: "{{data.skills.database}}",
            color: "var(--primary-blue)"
          }
        ],
        linkToSkillTree: "/skills"
      }
    },
    
    {
      id: "fun-facts",
      type: "achievement-showcase",
      position: { column: "right", order: 2 },
      config: {
        title: "趣味成就",
        achievements: [
          {
            title: "代碼行數統計",
            value: "{{stats.totalLinesOfCode}}",
            suffix: "+ 行",
            icon: "📝"
          },
          {
            title: "咖啡消耗量",
            value: "{{stats.coffeeConsumed}}",
            suffix: "杯/年",
            icon: "☕"
          },
          {
            title: "Bug修復數",
            value: "{{stats.bugsFixed}}",
            suffix: "個",
            icon: "🐛"
          },
          {
            title: "文檔撰寫",
            value: "{{stats.documentationPages}}",
            suffix: "頁",
            icon: "📚"
          }
        ]
      }
    }
  ],
  
  responsive: {
    mobile: {
      layout: {
        type: "single-column",
        stackOrder: [
          "character-panel",
          "career-timeline", 
          "technical-philosophy",
          "skill-summary",
          "fun-facts"
        ]
      }
    },
    tablet: {
      layout: {
        type: "two-column",
        columns: {
          left: { width: "350px" },
          right: { flex: 1 }
        }
      }
    }
  }
};

export default aboutPageConfig;