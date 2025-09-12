/**
 * 聯絡配置 - Contact Configuration
 *
 * Config-Driven 聯絡方式和郵件設定
 */

export const contactConfig = {
  // 主要聯絡資訊
  primary: {
    email: 'f102041332@gmail.com',
    name: 'Gaming Portfolio',
    timezone: 'Asia/Taipei',
    responseTime: '24-48 hours',
    preferredMethod: 'email',
  },

  // EmailJS 配置
  emailService: {
    provider: 'emailjs',
    serviceId: 'service_portfolio', // 您的 Service ID (請確認)
    templateId: 'template_contact', // 您的 Template ID (請確認)
    publicKey: 'pYTSA8KoCed7Se7sv', // 需要在 EmailJS 中設置

    // 郵件模板參數
    templateParams: {
      to_email: 'f102041332@gmail.com',
      from_name: '{{contact_name}}',
      from_email: '{{contact_email}}',
      subject: 'Portfolio Contact: {{contact_subject}}',
      message: '{{contact_message}}',
      company: '{{contact_company}}',
      reply_to: '{{contact_email}}',
    },
  },

  // 表單配置
  form: {
    fields: [
      {
        name: 'contact_name',
        type: 'text',
        label: '姓名 / Name',
        placeholder: '請輸入您的姓名',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
        },
      },
      {
        name: 'contact_email',
        type: 'email',
        label: '電子信箱 / Email',
        placeholder: 'your.email@example.com',
        required: true,
        validation: {
          pattern: 'email',
        },
      },
      {
        name: 'contact_subject',
        type: 'select',
        label: '聯絡主題 / Subject',
        placeholder: '請選擇聯絡主題',
        required: true,
        options: [
          { value: 'job_opportunity', label: '💼 工作機會 Job Opportunity' },
          { value: 'collaboration', label: '🤝 合作邀請 Collaboration' },
          {
            value: 'technical_discussion',
            label: '💡 技術討論 Technical Discussion',
          },
          { value: 'consultation', label: '📋 技術諮詢 Consultation' },
          { value: 'speaking', label: '🎤 演講邀請 Speaking Invitation' },
          { value: 'other', label: '💬 其他 Other' },
        ],
      },
      {
        name: 'contact_company',
        type: 'text',
        label: '公司 / Company',
        placeholder: '您的公司或組織 (選填)',
        required: false,
        validation: {
          maxLength: 100,
        },
      },
      {
        name: 'contact_message',
        type: 'textarea',
        label: '詳細訊息 / Message',
        placeholder: '請詳述您的需求或想法...',
        required: true,
        validation: {
          minLength: 20,
          maxLength: 1000,
        },
        rows: 6,
      },
    ],

    // 提交設定
    submission: {
      method: 'emailjs',
      showLoadingAnimation: true,
      preventDoubleSubmit: true,
      resetAfterSuccess: true,

      messages: {
        success: '✅ 訊息發送成功！我會在 24-48 小時內回覆您。',
        error: '❌ 發送失敗，請稍後再試或直接發送郵件到 f102041332@gmail.com',
        loading: '📤 正在發送訊息...',
        validation: '⚠️ 請檢查並修正表單中的錯誤',
      },
    },
  },

  // 聯絡方式展示
  contactMethods: [
    {
      type: 'email',
      icon: '📧',
      label: '電子信箱',
      value: 'f102041332@gmail.com',
      action: 'mailto:f102041332@gmail.com',
      primary: true,
    },
    {
      type: 'location',
      icon: '📍',
      label: '所在地區',
      value: '台灣',
      primary: false,
    },
    {
      type: 'timezone',
      icon: '🌍',
      label: '時區',
      value: 'GMT+8 (Asia/Taipei)',
      primary: false,
    },
  ],

  // 合作興趣標籤
  collaborationInterests: [
    {
      name: '系統架構設計',
      color: 'gold',
      priority: 1,
    },
    {
      name: '微服務架構',
      color: 'gold',
      priority: 1,
    },
    {
      name: '後端API開發',
      color: 'blue',
      priority: 2,
    },
    {
      name: 'DevOps實踐',
      color: 'bright-gold',
      priority: 1,
    },
    {
      name: '技術團隊領導',
      color: 'red',
      priority: 2,
    },
    {
      name: '開源專案協作',
      color: 'green',
      priority: 2,
    },
    {
      name: '技術諮詢顧問',
      color: 'purple',
      priority: 2,
    },
    {
      name: '演講與分享',
      color: 'orange',
      priority: 3,
    },
  ],

  // 回覆資訊
  responseInfo: {
    icon: '⏰',
    title: '回覆時間',
    description:
      '我通常會在 **24-48 小時**內回覆訊息。如果是緊急事項，歡迎透過 LinkedIn 或 Email 直接聯繫。期待與您的交流！',
    urgentContact: '緊急聯繫建議：LinkedIn 或 Email',
  },
};

export default contactConfig;
