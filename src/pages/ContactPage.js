/**
 * 聯絡頁面組件
 * Step 3.1.1c: 聯絡方式頁面
 */

import { BaseComponent } from '../core/components/BaseComponent.js';

export class ContactPage extends BaseComponent {
  async render() {
    return `
      <div class="contact-page">
        <div style="max-width: 1000px; margin: 0 auto; padding: 20px;">
          
          <header style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #e74c3c; font-size: 2.5rem; margin-bottom: 20px;">
              📬 聯絡方式
            </h1>
            <p style="color: #ffffff; font-size: 1.2rem; opacity: 0.9;">
              期待與您的技術交流
            </p>
          </header>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 40px;">
            
            <!-- Email -->
            <div style="background: rgba(231, 76, 60, 0.1); border: 2px solid #e74c3c; padding: 25px; border-radius: 12px; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 15px;">📧</div>
              <h2 style="color: #e74c3c; margin-bottom: 15px;">電子郵件</h2>
              <p style="color: white; margin-bottom: 15px;">最直接的聯絡方式</p>
              <div style="background: rgba(231, 76, 60, 0.2); padding: 10px; border-radius: 6px; margin-top: 15px;">
                <span style="color: #e74c3c; font-weight: bold;">your.email@example.com</span>
              </div>
            </div>
            
            <!-- GitHub -->
            <div style="background: rgba(149, 165, 166, 0.1); border: 2px solid #95a5a6; padding: 25px; border-radius: 12px; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 15px;">💻</div>
              <h2 style="color: #95a5a6; margin-bottom: 15px;">GitHub</h2>
              <p style="color: white; margin-bottom: 15px;">查看我的代碼作品</p>
              <div style="background: rgba(149, 165, 166, 0.2); padding: 10px; border-radius: 6px; margin-top: 15px;">
                <span style="color: #95a5a6; font-weight: bold;">github.com/yourname</span>
              </div>
            </div>
            
            <!-- LinkedIn -->
            <div style="background: rgba(52, 152, 219, 0.1); border: 2px solid #3498db; padding: 25px; border-radius: 12px; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 15px;">💼</div>
              <h2 style="color: #3498db; margin-bottom: 15px;">LinkedIn</h2>
              <p style="color: white; margin-bottom: 15px;">專業履歷與經歷</p>
              <div style="background: rgba(52, 152, 219, 0.2); padding: 10px; border-radius: 6px; margin-top: 15px;">
                <span style="color: #3498db; font-weight: bold;">linkedin.com/in/yourname</span>
              </div>
            </div>
            
          </div>
          
          <!-- 聯絡表單 -->
          <div style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #d4af37; margin-bottom: 25px; text-align: center;">✉️ 快速聯絡</h2>
            
            <form class="contact-form" style="max-width: 600px; margin: 0 auto;">
              <div style="margin-bottom: 20px;">
                <label style="color: white; display: block; margin-bottom: 8px; font-weight: bold;">姓名</label>
                <input type="text" 
                       style="width: 100%; padding: 12px; border: 2px solid #d4af37; border-radius: 6px; background: rgba(26, 26, 46, 0.8); color: white; font-size: 1rem;"
                       placeholder="請輸入您的姓名">
              </div>
              
              <div style="margin-bottom: 20px;">
                <label style="color: white; display: block; margin-bottom: 8px; font-weight: bold;">電子郵件</label>
                <input type="email" 
                       style="width: 100%; padding: 12px; border: 2px solid #d4af37; border-radius: 6px; background: rgba(26, 26, 46, 0.8); color: white; font-size: 1rem;"
                       placeholder="your.email@example.com">
              </div>
              
              <div style="margin-bottom: 20px;">
                <label style="color: white; display: block; margin-bottom: 8px; font-weight: bold;">訊息內容</label>
                <textarea 
                       style="width: 100%; padding: 12px; border: 2px solid #d4af37; border-radius: 6px; background: rgba(26, 26, 46, 0.8); color: white; font-size: 1rem; min-height: 120px; resize: vertical;"
                       placeholder="請輸入您想說的話..."></textarea>
              </div>
              
              <div style="text-align: center;">
                <button type="button" 
                        class="send-button"
                        style="background: #d4af37; color: black; border: none; padding: 15px 30px; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.3s;">
                  📤 發送訊息
                </button>
              </div>
            </form>
          </div>
          
          <div style="text-align: center;">
            <div style="background: rgba(231, 76, 60, 0.1); border: 2px solid #e74c3c; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <p style="color: #e74c3c; font-weight: bold; margin-bottom: 10px;">
                🤝 合作邀請
              </p>
              <p style="color: white; font-size: 0.9rem;">
                對於技術合作、職位機會或任何形式的交流，我都非常歡迎！
              </p>
            </div>
            <a href="#/" style="background: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ← 返回首頁
            </a>
          </div>
          
        </div>
      </div>
    `;
  }

  async init() {
    await super.init();
    
    // 添加表單提交處理
    this.bindFormEvents();
  }

  bindFormEvents() {
    const sendButton = document.querySelector('.send-button');
    
    if (sendButton) {
      sendButton.addEventListener('click', this.handleFormSubmit.bind(this));
      
      // 添加hover效果
      sendButton.addEventListener('mouseenter', (e) => {
        e.target.style.background = '#f4d03f';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.3)';
      });
      
      sendButton.addEventListener('mouseleave', (e) => {
        e.target.style.background = '#d4af37';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    // 這裡是示例，實際應用中需要真正的表單提交邏輯
    alert('📧 謝謝您的訊息！這是一個示例表單，實際版本會真正發送郵件。');
    
    // 清空表單
    const form = document.querySelector('.contact-form');
    if (form) {
      form.reset();
    }
  }
}