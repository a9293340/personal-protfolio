/**
 * EmailService - EmailJS 郵件發送服務
 * 
 * 處理聯絡表單的實際郵件發送功能
 */

import emailjs from '@emailjs/browser';
import { contactConfig } from '../config/data/contact/contact.config.js';

export class EmailService {
  constructor() {
    this.config = contactConfig.emailService;
    this.isInitialized = false;
    
    // 初始化 EmailJS
    this.initialize();
  }
  
  /**
   * 初始化 EmailJS
   */
  initialize() {
    try {
      // 初始化 EmailJS 公開金鑰
      if (this.config.publicKey && this.config.publicKey !== 'your_public_key') {
        emailjs.init(this.config.publicKey);
        this.isInitialized = true;
        console.log('📧 EmailJS initialized successfully');
      } else {
        console.warn('⚠️ EmailJS not configured - using demo mode');
        this.isInitialized = false;
      }
    } catch (error) {
      console.error('❌ EmailJS initialization failed:', error);
      this.isInitialized = false;
    }
  }
  
  /**
   * 發送聯絡郵件
   * @param {Object} formData - 表單數據
   * @returns {Promise<Object>} 發送結果
   */
  async sendContactEmail(formData) {
    try {
      // 如果 EmailJS 未正確配置，使用模擬模式
      if (!this.isInitialized) {
        return this.simulateEmailSend(formData);
      }
      
      // 準備模板參數
      const templateParams = this.prepareTemplateParams(formData);
      
      console.log('📤 Sending email via EmailJS...', {
        serviceId: this.config.serviceId,
        templateId: this.config.templateId,
        params: templateParams
      });
      
      // 發送郵件
      const result = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      );
      
      console.log('✅ Email sent successfully:', result);
      
      return {
        success: true,
        message: '郵件發送成功！',
        data: result
      };
      
    } catch (error) {
      console.error('❌ Email send failed:', error);
      
      return {
        success: false,
        message: '郵件發送失敗：' + error.message,
        error: error
      };
    }
  }
  
  /**
   * 準備 EmailJS 模板參數
   * @param {Object} formData - 表單數據
   * @returns {Object} 模板參數
   */
  prepareTemplateParams(formData) {
    const templateParams = {};
    
    console.log('📧 Preparing template params with formData:', formData);
    console.log('📧 Config templateParams:', this.config.templateParams);
    
    // 直接映射表單數據到模板參數（匹配 EmailJS 模板中的參數名稱）
    templateParams.to_email = this.config.templateParams.to_email;
    templateParams.contact_name = formData.contact_name || '';
    templateParams.contact_email = formData.contact_email || '';
    templateParams.contact_subject = this.getSubjectLabel(formData.contact_subject);
    templateParams.contact_company = formData.contact_company || '';
    templateParams.contact_message = formData.contact_message || '';
    templateParams.reply_to = formData.contact_email || '';
    templateParams.time = new Date().toLocaleString('zh-TW', { 
      timeZone: 'Asia/Taipei',
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    console.log('📧 Final template params:', templateParams);
    
    return templateParams;
  }
  
  /**
   * 獲取主題標籤
   * @param {string} subjectValue - 主題值
   * @returns {string} 主題標籤
   */
  getSubjectLabel(subjectValue) {
    const subjectOptions = contactConfig.form.fields
      .find(field => field.name === 'contact_subject')?.options || [];
    
    const option = subjectOptions.find(opt => opt.value === subjectValue);
    return option ? option.label : subjectValue;
  }
  
  /**
   * 格式化訊息內容
   * @param {Object} formData - 表單數據
   * @returns {string} 格式化的訊息
   */
  formatMessage(formData) {
    const lines = [
      `姓名：${formData.contact_name}`,
      `信箱：${formData.contact_email}`,
      `主題：${this.getSubjectLabel(formData.contact_subject)}`
    ];
    
    if (formData.contact_company) {
      lines.push(`公司：${formData.contact_company}`);
    }
    
    lines.push('', '詳細訊息：', formData.contact_message);
    
    return lines.join('\n');
  }
  
  /**
   * 模擬郵件發送（用於測試或未配置 EmailJS 時）
   * @param {Object} formData - 表單數據
   * @returns {Promise<Object>} 模擬結果
   */
  async simulateEmailSend(formData) {
    console.log('🔄 Simulating email send (EmailJS not configured):', formData);
    
    // 模擬發送延遲
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: '✨ 模擬發送成功！（實際未發送郵件，請配置 EmailJS）',
      data: {
        status: 200,
        text: 'Demo mode - email would be sent to: f102041332@gmail.com'
      }
    };
  }
  
  /**
   * 檢查 EmailJS 配置狀態
   * @returns {Object} 配置狀態
   */
  getConfigStatus() {
    return {
      isInitialized: this.isInitialized,
      hasServiceId: !!(this.config.serviceId && this.config.serviceId !== 'service_portfolio'),
      hasTemplateId: !!(this.config.templateId && this.config.templateId !== 'template_contact'),
      hasPublicKey: !!(this.config.publicKey && this.config.publicKey !== 'your_public_key'),
      targetEmail: this.config.templateParams.to_email
    };
  }
}

// 創建全域實例
export const emailService = new EmailService();