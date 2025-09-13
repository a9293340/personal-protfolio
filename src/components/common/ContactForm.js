/**
 * ContactForm.js - 遊戲化聯絡表單組件
 *
 * 功能特色：
 * - 遊戲風格的表單設計
 * - 完整的表單驗證
 * - 動畫效果和互動反饋
 * - 響應式設計支援
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';
import { emailService } from '../../services/EmailService.js';
import { contactConfig } from '../../config/data/contact/contact.config.js';

export class ContactForm extends BaseComponent {
  constructor(config = {}) {
    super();

    // 使用外部配置而不是內部硬編碼配置
    const externalConfig = {
      title: contactConfig.primary?.name || '聯絡我們',
      fields: contactConfig.form.fields,
      handling: contactConfig.form.submission,
    };

    this.config = this.mergeConfig(externalConfig, config);

    // 表單狀態
    this.formData = {};
    this.validationErrors = {};
    this.isSubmitting = false;

    // 明確初始化 state
    this.state = this.getInitialState();

    console.log('📝 [ContactForm] 聯絡表單組件初始化');
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      style: 'glassmorphism-card',
      title: '發送訊息',
      subtitle: '選擇聯絡主題，我會盡快回覆',

      fields: [
        {
          name: 'name',
          type: 'text',
          label: '您的姓名',
          placeholder: '請輸入姓名',
          required: true,
          validation: { minLength: 2 },
        },
        {
          name: 'email',
          type: 'email',
          label: '電子信箱',
          placeholder: 'your.email@example.com',
          required: true,
        },
        {
          name: 'subject',
          type: 'select',
          label: '聯絡主題',
          required: true,
          options: [
            { value: '', label: '請選擇主題' },
            { value: 'job-opportunity', label: '🚀 職涯機會' },
            { value: 'technical-collaboration', label: '🤝 技術合作' },
            { value: 'consulting', label: '💡 顧問諮詢' },
            { value: 'open-source', label: '❤️ 開源協作' },
            { value: 'speaking', label: '🎤 演講邀請' },
            { value: 'other', label: '💬 其他討論' },
          ],
        },
        {
          name: 'company',
          type: 'text',
          label: '公司/組織 (選填)',
          placeholder: '您的公司或組織名稱',
        },
        {
          name: 'message',
          type: 'textarea',
          label: '詳細訊息',
          placeholder: '請描述您的需求、專案內容或想討論的主題...',
          required: true,
          rows: 6,
          validation: { minLength: 20, maxLength: 1000 },
        },
      ],

      submitButton: {
        text: '發送訊息',
        loadingText: '發送中...',
        successText: '發送成功!',
        style: 'gaming-cta-button',
        animation: 'glow-pulse',
      },

      handling: {
        successMessage: '謝謝您的訊息！我會在 24 小時內回覆。',
        errorMessage: '發送失敗，請稍後再試或直接寄信給我。',
      },
    };
  }

  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      currentStep: 1,
      isValid: false,
      showErrors: false,
    };
  }

  /**
   * 渲染表單
   */
  async render() {
    this.createElement();
    this.initializeForm();

    // 使用 setTimeout 確保 DOM 完全構建後再綁定事件
    setTimeout(() => {
      this.bindEvents();
    }, 0);

    return this.element;
  }

  /**
   * 創建表單元素
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'contact-form-container';

    this.element.innerHTML = `
      <div class="contact-form-card" style="
        background: rgba(46, 26, 46, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        padding: 2rem;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
      ">
        <!-- 背景裝飾 -->
        <div class="form-glow" style="
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
          animation: formGlow 4s ease-in-out infinite alternate;
          pointer-events: none;
        "></div>
        
        <!-- 表單標題 -->
        <div class="form-header" style="
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        ">
          <h3 style="
            color: var(--primary-gold);
            font-size: 1.8rem;
            margin: 0 0 0.5rem 0;
            font-weight: 600;
          ">${this.config.title}</h3>
          
          <p style="
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
            font-size: 0.95rem;
          ">${this.config.subtitle}</p>
        </div>
        
        <!-- 表單內容 -->
        <form class="contact-form" style="position: relative; z-index: 2;">
          <div class="form-fields">
            ${this.renderFormFields()}
          </div>
          
          <div class="form-actions" style="
            margin-top: 2rem;
            text-align: center;
          ">
            ${this.renderSubmitButton()}
          </div>
          
          <!-- 成功/錯誤訊息 -->
          <div class="form-message" style="
            margin-top: 1rem;
            text-align: center;
            min-height: 1.5rem;
            position: relative;
          ">
            <div class="success-message" style="display: none;"></div>
            <div class="error-message" style="display: none;"></div>
          </div>
        </form>
      </div>
    `;

    // 添加表單樣式
    this.addFormStyles();
  }

  /**
   * 渲染表單欄位
   */
  renderFormFields() {
    return this.config.fields
      .map((field, index) => {
        const isRequired = field.required ? ' *' : '';
        const fieldId = `field_${field.name}`;

        return `
        <div class="form-field" style="
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.6s ease-out ${index * 0.1}s both;
        ">
          <label for="${fieldId}" style="
            display: block;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
          ">
            ${field.label}${isRequired}
          </label>
          
          ${this.renderFieldInput(field, fieldId)}
          
          <div class="field-error" style="
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            min-height: 1rem;
            opacity: 0;
            transition: opacity 0.3s ease;
          "></div>
        </div>
      `;
      })
      .join('');
  }

  /**
   * 渲染欄位輸入元素
   */
  renderFieldInput(field, fieldId) {
    const baseStyles = `
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(26, 26, 46, 0.8);
      border: 2px solid rgba(212, 175, 55, 0.3);
      border-radius: 0.5rem;
      color: white;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    `;

    switch (field.type) {
      case 'select':
        return `
          <select id="${fieldId}" name="${field.name}" style="${baseStyles}">
            ${field.options
              .map(
                option =>
                  `<option value="${option.value}">${option.label}</option>`
              )
              .join('')}
          </select>
        `;

      case 'textarea':
        return `
          <textarea 
            id="${fieldId}" 
            name="${field.name}"
            placeholder="${field.placeholder || ''}"
            rows="${field.rows || 4}"
            style="${baseStyles} resize: vertical;"
          ></textarea>
        `;

      default:
        return `
          <input 
            type="${field.type}" 
            id="${fieldId}" 
            name="${field.name}"
            placeholder="${field.placeholder || ''}"
            style="${baseStyles}"
          />
        `;
    }
  }

  /**
   * 渲染提交按鈕
   */
  renderSubmitButton() {
    return `
      <button type="button" class="submit-button" 
              onmouseenter="console.log('📝 Button hover detected')"
              onclick="event.preventDefault(); event.stopPropagation(); console.log('📝 Inline onclick triggered'); window.contactFormSubmit && window.contactFormSubmit(event); return false;" 
              style="
        background: linear-gradient(135deg, var(--primary-gold), var(--bright-gold));
        color: black;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        min-width: 160px;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
      ">
        <span class="button-text">${this.config.submitButton.text}</span>
        
        <!-- 載入動畫 -->
        <div class="loading-spinner" style="
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.3);
          border-top: 2px solid black;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        
        <!-- 按鈕發光效果 -->
        <div class="button-glow" style="
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: translateX(-200%);
          transition: transform 0.6s ease;
        "></div>
      </button>
    `;
  }

  /**
   * 初始化表單
   */
  initializeForm() {
    // 初始化表單數據
    this.config.fields.forEach(field => {
      this.formData[field.name] = '';
    });

    // 設置表單驗證
    this.setupFormValidation();
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    console.log('📝 Binding events...');

    // 表單提交事件
    const form = this.element.querySelector('.contact-form');
    console.log('📝 Form element found:', !!form);

    if (form) {
      form.addEventListener('submit', e => this.handleSubmit(e));
      console.log('📝 Submit event listener added to form');

      // 同時也綁定到按鈕的 click 事件作為備用
      const submitButton = form.querySelector('.submit-button');
      if (submitButton) {
        submitButton.addEventListener('click', e => {
          console.log('📝 Button click event triggered');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.handleSubmit(e);
        });
        console.log('📝 Button click event listener added');
      }

      // 設置全局提交函數供 inline onclick 使用
      window.contactFormSubmit = e => {
        console.log('📝 Global submit function called');
        this.handleSubmit(e);
      };
      console.log('📝 Global submit function set');
    } else {
      console.error('❌ Form element not found!');
    }

    // 欄位變化事件 - 添加實時監控
    this.element.addEventListener('input', e => {
      console.log(
        `📝 INPUT event: field ${e.target.name} = "${e.target.value}"`
      );
      this.handleFieldChange(e);
    });
    this.element.addEventListener('change', e => {
      console.log(
        `📝 CHANGE event: field ${e.target.name} = "${e.target.value}"`
      );
      this.handleFieldChange(e);
    });
    this.element.addEventListener('keyup', e => {
      if (e.target.name) {
        console.log(
          `📝 KEYUP event: field ${e.target.name} = "${e.target.value}"`
        );
      }
    });

    // 欄位焦點事件
    this.element.addEventListener('focus', e => this.handleFieldFocus(e), true);
    this.element.addEventListener('blur', e => this.handleFieldBlur(e), true);

    // 按鈕懸停效果
    const submitButton = this.element.querySelector('.submit-button');
    if (submitButton) {
      submitButton.addEventListener('mouseenter', () =>
        this.handleButtonHover(true)
      );
      submitButton.addEventListener('mouseleave', () =>
        this.handleButtonHover(false)
      );
    }
  }

  /**
   * 設置表單驗證
   */
  setupFormValidation() {
    this.validationRules = {};

    this.config.fields.forEach(field => {
      const rules = [];

      // 必填驗證
      if (field.required) {
        rules.push({
          type: 'required',
          message: `請填寫${field.label.replace(' *', '')}`,
        });
      }

      // 長度驗證
      if (field.validation?.minLength) {
        rules.push({
          type: 'minLength',
          value: field.validation.minLength,
          message: `${field.label}至少需要 ${field.validation.minLength} 個字元`,
        });
      }

      if (field.validation?.maxLength) {
        rules.push({
          type: 'maxLength',
          value: field.validation.maxLength,
          message: `${field.label}不能超過 ${field.validation.maxLength} 個字元`,
        });
      }

      // 電子信箱驗證
      if (field.type === 'email') {
        rules.push({
          type: 'email',
          message: '請輸入有效的電子信箱格式',
        });
      }

      this.validationRules[field.name] = rules;
    });
  }

  /**
   * 處理欄位變化
   */
  handleFieldChange(e) {
    const field = e.target;
    const fieldName = field.name;

    if (
      fieldName &&
      Object.prototype.hasOwnProperty.call(this.formData, fieldName)
    ) {
      this.formData[fieldName] = field.value;
      this.validateField(fieldName, field.value);
    }
  }

  /**
   * 處理欄位焦點
   */
  handleFieldFocus(e) {
    const field = e.target;
    if (field.matches('input, select, textarea')) {
      field.style.borderColor = 'var(--bright-gold)';
      field.style.boxShadow = '0 0 0 2px rgba(244, 208, 63, 0.2)';
    }
  }

  /**
   * 處理欄位失焦
   */
  handleFieldBlur(e) {
    const field = e.target;
    if (field.matches('input, select, textarea')) {
      field.style.borderColor = 'rgba(212, 175, 55, 0.3)';
      field.style.boxShadow = 'none';
    }
  }

  /**
   * 處理按鈕懸停
   */
  handleButtonHover(isHover) {
    const button = this.element.querySelector('.submit-button');
    const glow = this.element.querySelector('.button-glow');

    if (isHover) {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
      if (glow) glow.style.transform = 'translateX(200%)';
    } else {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
      if (glow) glow.style.transform = 'translateX(-200%)';
    }
  }

  /**
   * 驗證單個欄位
   */
  validateField(fieldName, value) {
    const rules = this.validationRules[fieldName] || [];
    const errors = [];

    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (!value || value.trim() === '') {
            errors.push(rule.message);
          }
          break;

        case 'minLength':
          if (value && value.length < rule.value) {
            errors.push(rule.message);
          }
          break;

        case 'maxLength':
          if (value && value.length > rule.value) {
            errors.push(rule.message);
          }
          break;

        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (value && !emailRegex.test(value)) {
            errors.push(rule.message);
          }
          break;
        }
      }
    }

    // 更新驗證狀態
    if (errors.length > 0) {
      this.validationErrors[fieldName] = errors[0]; // 只顯示第一個錯誤
    } else {
      delete this.validationErrors[fieldName];
    }

    // 顯示/隱藏錯誤訊息
    this.updateFieldError(fieldName);

    return errors.length === 0;
  }

  /**
   * 更新欄位錯誤顯示
   */
  updateFieldError(fieldName) {
    const fieldContainer = this.element
      .querySelector(`[name="${fieldName}"]`)
      ?.closest('.form-field');
    const errorElement = fieldContainer?.querySelector('.field-error');

    if (errorElement) {
      const error = this.validationErrors[fieldName];

      if (error && this.state?.showErrors) {
        errorElement.textContent = error;
        errorElement.style.opacity = '1';
      } else {
        errorElement.style.opacity = '0';
      }
    }
  }

  /**
   * 驗證整個表單
   */
  validateForm() {
    let isValid = true;

    console.log('📝 Validating form data:', this.formData);
    console.log(
      '📝 Available validation rules:',
      Object.keys(this.validationRules || {})
    );

    // 驗證所有欄位
    for (const fieldName in this.formData) {
      const value = this.formData[fieldName];
      console.log(`📝 Validating field: ${fieldName} = "${value}"`);

      const fieldIsValid = this.validateField(fieldName, value);
      console.log(`📝 Field ${fieldName} validation result: ${fieldIsValid}`);

      if (!fieldIsValid) {
        console.log(
          `❌ Field ${fieldName} validation failed. Error: ${this.validationErrors[fieldName]}`
        );
        isValid = false;
      } else {
        console.log(`✅ Field ${fieldName} validation passed`);
      }
    }

    // 更新 state
    this.state = { ...this.state, isValid, showErrors: true };

    // 更新所有欄位的錯誤顯示
    if (this.validationRules) {
      Object.keys(this.validationRules).forEach(fieldName => {
        this.updateFieldError(fieldName);
      });
    }

    return isValid;
  }

  /**
   * 處理表單提交
   */
  async handleSubmit(e) {
    console.log('📝 Form submit event triggered', e.type);

    // 強制阻止所有默認行為
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log('📝 All default behaviors prevented');

    if (this.isSubmitting) {
      console.log('⚠️ Already submitting, ignoring');
      return false;
    }

    // 更新表單數據
    const formElement =
      e.target.form || this.element.querySelector('.contact-form');
    console.log('📝 Form element for FormData:', formElement);

    if (!formElement) {
      console.error('❌ No form element found for FormData');
      return false;
    }

    // 直接從表單元素收集數據
    const _formData = new FormData(formElement);
    console.log('📝 FormData created successfully');

    // 清空並重新收集表單數據
    this.formData = {};

    // 遍歷配置的字段來確保收集所有數據
    this.config.fields.forEach(field => {
      const element = formElement.querySelector(`[name="${field.name}"]`);
      console.log(`📝 Looking for field: ${field.name}`);
      console.log(`📝 Found element:`, element);

      if (element) {
        let value = element.value || '';

        // 處理瀏覽器自動填入的情況
        if (!value) {
          // 強制獲取可能被瀏覽器自動填入的值
          const computedValue = window
            .getComputedStyle(element)
            .getPropertyValue('color');
          if (
            computedValue === 'rgb(0, 0, 0)' ||
            element.matches(':-webkit-autofill')
          ) {
            // 可能是自動填入的字段，嘗試觸發 change 事件
            element.focus();
            element.blur();
            value = element.value || '';
          }
        }

        console.log(`📝 Element type: ${element.type || element.tagName}`);
        console.log(`📝 Element value property: "${element.value}"`);
        console.log(
          `📝 Element getAttribute('value'): "${element.getAttribute('value')}"`
        );
        console.log(`📝 Element defaultValue: "${element.defaultValue}"`);
        console.log(`📝 Element textContent: "${element.textContent}"`);

        // 對於 textarea，檢查 textContent
        let actualValue = value;
        if (element.tagName.toLowerCase() === 'textarea') {
          actualValue = element.textContent || element.value || '';
          console.log(`📝 Using textarea textContent: "${actualValue}"`);
        }

        this.formData[field.name] = actualValue;
        console.log(`📝 Form field: ${field.name} = ${actualValue}`);
      } else {
        console.warn(`⚠️ Field element not found: ${field.name}`);
      }
    });

    console.log('📝 Final formData:', this.formData);

    // 驗證表單
    console.log('📝 Starting form validation...');
    const isValid = this.validateForm();
    console.log('📝 Form validation result:', isValid);

    if (!isValid) {
      console.log('⚠️ Form validation failed');
      console.log('⚠️ Validation errors:', this.validationErrors);

      // 顯示第一個驗證錯誤
      const firstErrorField = Object.keys(this.validationErrors)[0];
      const firstError = this.validationErrors[firstErrorField];
      const errorMessage = firstError || '請檢查並修正表單中的錯誤';

      // 使用 alert 確保用戶看到錯誤
      window.alert(`❌ 表單驗證失敗\n\n${errorMessage}`);

      // 也嘗試在頁面上顯示錯誤訊息
      this.showFormMessage(errorMessage, 'error');

      // 顯示所有字段的錯誤
      Object.keys(this.validationErrors).forEach(fieldName => {
        this.updateFieldError(fieldName);
      });

      return;
    }

    console.log('✅ Form validation passed');

    // 開始提交
    this.isSubmitting = true;
    this.setSubmitButtonState('loading');

    try {
      // 觸發提交事件
      this.emit('formSubmit', this.formData);

      // 檢查 EmailJS 配置狀態
      const configStatus = emailService.getConfigStatus();
      console.log('📧 EmailJS Config Status:', configStatus);

      // 使用 EmailJS 發送郵件
      console.log('📤 Sending email with data:', this.formData);
      const emailResult = await emailService.sendContactEmail(this.formData);
      console.log('📧 Email send result:', emailResult);

      if (emailResult.success) {
        // 提交成功
        this.setSubmitButtonState('success');
        this.showFormMessage(emailResult.message, 'success');
        this.emit('formSuccess', this.formData);
      } else {
        // 提交失敗
        throw new Error(emailResult.message);
      }

      // 重置表單
      setTimeout(() => {
        this.resetForm();
      }, 2000);
    } catch (error) {
      console.error('❌ [ContactForm] 表單提交失敗:', error);

      this.setSubmitButtonState('error');
      this.showFormMessage(this.config.handling.errorMessage, 'error');
      this.emit('formError', error);
    } finally {
      setTimeout(() => {
        this.isSubmitting = false;
        this.setSubmitButtonState('normal');
      }, 3000);
    }

    // 明確返回 false 防止默認行為
    return false;
  }

  /**
   * 設置提交按鈕狀態
   */
  setSubmitButtonState(state) {
    const button = this.element.querySelector('.submit-button');
    const buttonText = this.element.querySelector('.button-text');
    const spinner = this.element.querySelector('.loading-spinner');

    if (!button || !buttonText || !spinner) return;

    switch (state) {
      case 'loading':
        button.disabled = true;
        buttonText.style.opacity = '0';
        spinner.style.display = 'block';
        break;

      case 'success':
        button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        buttonText.textContent = this.config.submitButton.successText;
        buttonText.style.opacity = '1';
        spinner.style.display = 'none';
        break;

      case 'error':
        button.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        buttonText.textContent = '發送失敗';
        buttonText.style.opacity = '1';
        spinner.style.display = 'none';
        break;

      default:
        button.disabled = false;
        button.style.background =
          'linear-gradient(135deg, var(--primary-gold), var(--bright-gold))';
        buttonText.textContent = this.config.submitButton.text;
        buttonText.style.opacity = '1';
        spinner.style.display = 'none';
    }
  }

  /**
   * 顯示表單訊息
   */
  showFormMessage(message, type) {
    console.log(`📝 Showing form message: ${type} - ${message}`);

    const successEl = this.element.querySelector('.success-message');
    const errorEl = this.element.querySelector('.error-message');

    console.log('📝 Message elements found:', {
      success: !!successEl,
      error: !!errorEl,
    });

    if (!successEl || !errorEl) {
      console.error('❌ Message elements not found!');
      // 使用 alert 作為後備方案
      window.alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
      return;
    }

    // 隱藏所有訊息
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    // 顯示對應訊息
    const targetEl = type === 'success' ? successEl : errorEl;
    const color = type === 'success' ? '#27ae60' : '#e74c3c';

    targetEl.textContent = message;
    targetEl.style.color = color;
    targetEl.style.display = 'block';
    targetEl.style.animation = 'fadeInUp 0.5s ease-out';

    console.log(`📝 Message displayed: ${message}`);
  }

  /**
   * 重置表單
   */
  resetForm() {
    const form = this.element.querySelector('.contact-form');
    if (form) {
      form.reset();

      // 清空狀態
      this.formData = {};
      this.validationErrors = {};
      // 更新 state
      this.state = { ...this.state, showErrors: false };

      // 隱藏訊息
      this.element.querySelector('.success-message').style.display = 'none';
      this.element.querySelector('.error-message').style.display = 'none';

      // 重新初始化
      this.initializeForm();
    }
  }

  /**
   * 添加表單樣式
   */
  addFormStyles() {
    if (!document.querySelector('#contact-form-styles')) {
      const style = document.createElement('style');
      style.id = 'contact-form-styles';
      style.textContent = `
        @keyframes formGlow {
          0% { opacity: 0.3; transform: rotate(0deg); }
          100% { opacity: 0.6; transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .contact-form input:focus,
        .contact-form select:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--bright-gold) !important;
          box-shadow: 0 0 0 2px rgba(244, 208, 63, 0.2) !important;
        }
        
        .contact-form select option {
          background: rgba(26, 26, 46, 1);
          color: white;
        }
        
        /* 響應式設計 */
        @media (max-width: 768px) {
          .contact-form-card {
            padding: 1.5rem !important;
          }
          
          .form-header h3 {
            font-size: 1.5rem !important;
          }
          
          .form-field {
            margin-bottom: 1rem !important;
          }
          
          .submit-button {
            width: 100%;
            padding: 0.875rem 1.5rem !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * 銷毀組件
   */
  destroy() {
    console.log('🗑️ [ContactForm] 銷毀聯絡表單組件');

    // 重置狀態
    this.isSubmitting = false;
    this.formData = {};
    this.validationErrors = {};

    super.destroy();
  }
}
