/**
 * 聯絡頁面配置
 * 
 * Config-Driven 聯絡方式和社交連結配置
 */

export const contactPageConfig = {
  meta: {
    title: "聯絡我 | Contact - 建立專業合作連結",
    description: "透過多種方式與我建立聯繫，討論技術合作、職涯機會或技術交流",
    keywords: "contact, collaboration, career opportunities, technical discussion"
  },
  
  layout: {
    type: "centered-two-column",
    maxWidth: "1000px",
    columns: {
      left: { width: "60%" },
      right: { width: "40%" }
    },
    gap: "var(--space-8)"
  },
  
  sections: [
    {
      id: "contact-hero",
      type: "section-header",
      position: { fullWidth: true, order: 1 },
      config: {
        title: "建立連結",
        subtitle: "技術交流 · 合作機會 · 職涯討論",
        description: "歡迎透過以下方式與我聯繫，一起探討技術趨勢和合作可能性",
        animation: "fade-in-up"
      }
    },
    
    {
      id: "contact-form",
      type: "gaming-contact-form",
      position: { column: "left", order: 2 },
      config: {
        style: "glassmorphism-card",
        title: "發送訊息",
        subtitle: "選擇聯絡主題，我會盡快回覆",
        
        fields: [
          {
            name: "name",
            type: "text",
            label: "您的姓名",
            placeholder: "請輸入姓名",
            required: true,
            validation: {
              minLength: 2,
              pattern: "name"
            }
          },
          {
            name: "email", 
            type: "email",
            label: "電子信箱",
            placeholder: "your.email@example.com",
            required: true,
            validation: {
              pattern: "email"
            }
          },
          {
            name: "subject",
            type: "select",
            label: "聯絡主題",
            required: true,
            options: [
              { value: "", label: "請選擇主題" },
              { value: "job-opportunity", label: "🚀 職涯機會", icon: "🚀" },
              { value: "technical-collaboration", label: "🤝 技術合作", icon: "🤝" },
              { value: "consulting", label: "💡 顧問諮詢", icon: "💡" },
              { value: "open-source", label: "❤️ 開源協作", icon: "❤️" },
              { value: "speaking", label: "🎤 演講邀請", icon: "🎤" },
              { value: "other", label: "💬 其他討論", icon: "💬" }
            ]
          },
          {
            name: "company",
            type: "text", 
            label: "公司/組織 (選填)",
            placeholder: "您的公司或組織名稱"
          },
          {
            name: "message",
            type: "textarea",
            label: "詳細訊息",
            placeholder: "請描述您的需求、專案內容或想討論的主題...",
            required: true,
            rows: 6,
            validation: {
              minLength: 20,
              maxLength: 1000
            }
          }
        ],
        
        submitButton: {
          text: "發送訊息",
          loadingText: "發送中...",
          successText: "發送成功!",
          style: "gaming-cta-button",
          animation: "glow-pulse"
        },
        
        // 表單處理
        handling: {
          method: "POST",
          endpoint: "/api/contact",
          successMessage: "謝謝您的訊息！我會在 24 小時內回覆。",
          errorMessage: "發送失敗，請稍後再試或直接寄信給我。",
          validationMessages: {
            name: "請輸入至少 2 個字元的姓名",
            email: "請輸入有效的電子信箱", 
            subject: "請選擇聯絡主題",
            message: "訊息內容請至少 20 個字元"
          }
        },
        
        // 動畫配置
        animations: {
          fieldFocus: "glow-border",
          fieldError: "shake-highlight",
          submitSuccess: "success-burst"
        }
      }
    },
    
    {
      id: "contact-info",
      type: "contact-info-card",
      position: { column: "right", order: 2 },
      config: {
        style: "gaming-info-panel",
        sections: [
          {
            type: "direct-contact",
            title: "直接聯絡",
            items: [
              {
                type: "email",
                icon: "📧", 
                label: "電子信箱",
                value: "{{personal.email}}",
                action: "mailto:{{personal.email}}"
              },
              {
                type: "location",
                icon: "📍",
                label: "所在地區", 
                value: "{{personal.location}}",
                description: "開放遠端工作機會"
              },
              {
                type: "timezone",
                icon: "🌍",
                label: "時區",
                value: "{{personal.timezone}}",
                description: "通常在工作時間內回覆"
              }
            ]
          },
          
          {
            type: "social-links",
            title: "社交平台",
            items: "{{data.social.platforms}}",
            style: "gaming-social-grid",
            animations: {
              hover: "icon-bounce",
              click: "ripple-effect"
            }
          },
          
          {
            type: "professional-profiles", 
            title: "專業檔案",
            items: [
              {
                platform: "LinkedIn",
                icon: "💼",
                url: "{{social.linkedin}}",
                description: "專業經歷與技能背景"
              },
              {
                platform: "GitHub",
                icon: "💻", 
                url: "{{social.github}}",
                description: "開源專案與代碼作品"
              },
              {
                platform: "Medium",
                icon: "📝",
                url: "{{social.medium}}",
                description: "技術文章與經驗分享"
              }
            ]
          }
        ]
      }
    },
    
    {
      id: "collaboration-interests",
      type: "interest-tags-grid",
      position: { fullWidth: true, order: 3 },
      config: {
        title: "合作興趣領域",
        subtitle: "我特別關注和樂於參與的技術領域",
        tags: [
          {
            text: "系統架構設計",
            category: "architecture",
            color: "var(--primary-gold)"
          },
          {
            text: "微服務架構",
            category: "architecture", 
            color: "var(--primary-gold)"
          },
          {
            text: "後端API開發",
            category: "backend",
            color: "var(--primary-blue)"
          },
          {
            text: "DevOps實踐",
            category: "devops",
            color: "var(--bright-gold)"
          },
          {
            text: "技術團隊領導",
            category: "leadership",
            color: "var(--primary-red)"
          },
          {
            text: "開源專案協作",
            category: "opensource",
            color: "var(--primary-green)"
          },
          {
            text: "技術諮詢顧問",
            category: "consulting", 
            color: "var(--purple-500)"
          },
          {
            text: "演講與分享",
            category: "speaking",
            color: "var(--orange-500)"
          }
        ],
        style: "floating-tags",
        animations: {
          entrance: "stagger-fade-in",
          hover: "tag-glow-grow"
        }
      }
    },
    
    {
      id: "response-expectations",
      type: "info-callout-card",
      position: { fullWidth: true, order: 4 },
      config: {
        style: "friendly-note",
        icon: "⏰",
        title: "回覆時間說明",
        content: {
          text: "我通常會在 **24-48 小時**內回覆訊息。如果是緊急事項，歡迎透過 LinkedIn 或 Email 直接聯繫。期待與您的交流！",
          highlight: true
        }
      }
    }
  ],
  
  // 響應式配置
  responsive: {
    mobile: {
      layout: {
        type: "single-column", 
        stackOrder: [
          "contact-hero",
          "contact-info",
          "contact-form", 
          "collaboration-interests",
          "response-expectations"
        ]
      },
      sections: {
        "contact-form": {
          config: {
            fields: {
              message: { rows: 4 }
            }
          }
        }
      }
    }
  }
};

export default contactPageConfig;