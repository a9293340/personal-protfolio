/**
 * 專案展示頁面組件
 * Step 3.1.1c: 專案展示頁面
 */

import { BaseComponent } from '../core/components/BaseComponent.js';

export class ProjectsPage extends BaseComponent {
  async render() {
    return `
      <div class="projects-page">
        <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
          
          <header style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #2ecc71; font-size: 2.5rem; margin-bottom: 20px;">
              🚀 專案展示
            </h1>
            <p style="color: #ffffff; font-size: 1.2rem; opacity: 0.9;">
              技術實力的具體展現
            </p>
          </header>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-bottom: 40px;">
            
            <!-- 專案 1 -->
            <div class="project-card" style="background: rgba(46, 204, 113, 0.1); border: 2px solid #2ecc71; padding: 25px; border-radius: 12px; transition: transform 0.3s, box-shadow 0.3s;">
              <h2 style="color: #2ecc71; margin-bottom: 15px;">🏗️ 微服務架構系統</h2>
              <div style="margin-bottom: 20px;">
                <span style="background: rgba(52, 152, 219, 0.2); color: #3498db; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">Node.js</span>
                <span style="background: rgba(230, 126, 34, 0.2); color: #e67e22; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">Docker</span>
                <span style="background: rgba(155, 89, 182, 0.2); color: #9b59b6; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">MongoDB</span>
              </div>
              <p style="color: white; line-height: 1.6; margin-bottom: 15px;">
                設計並實現了高可用性的微服務架構，支援千萬級用戶訪問，採用容器化部署策略。
              </p>
              <div style="color: #2ecc71; font-weight: bold;">
                狀態: 已完成 ✅
              </div>
            </div>
            
            <!-- 專案 2 -->
            <div class="project-card" style="background: rgba(52, 152, 219, 0.1); border: 2px solid #3498db; padding: 25px; border-radius: 12px; transition: transform 0.3s, box-shadow 0.3s;">
              <h2 style="color: #3498db; margin-bottom: 15px;">⚡ 高效能 API 閘道</h2>
              <div style="margin-bottom: 20px;">
                <span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">Go</span>
                <span style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">Redis</span>
                <span style="background: rgba(241, 196, 15, 0.2); color: #f1c40f; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">Nginx</span>
              </div>
              <p style="color: white; line-height: 1.6; margin-bottom: 15px;">
                打造低延遲、高吞吐量的 API 閘道，整合認證、限流、監控等功能。
              </p>
              <div style="color: #f39c12; font-weight: bold;">
                狀態: 開發中 🔄
              </div>
            </div>
            
            <!-- 專案 3 -->
            <div class="project-card" style="background: rgba(155, 89, 182, 0.1); border: 2px solid #9b59b6; padding: 25px; border-radius: 12px; transition: transform 0.3s, box-shadow 0.3s;">
              <h2 style="color: #9b59b6; margin-bottom: 15px;">🎮 遊戲化作品集</h2>
              <div style="margin-bottom: 20px;">
                <span style="background: rgba(52, 152, 219, 0.2); color: #3498db; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">JavaScript</span>
                <span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">CSS3</span>
                <span style="background: rgba(230, 126, 34, 0.2); color: #e67e22; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; display: inline-block;">Vite</span>
              </div>
              <p style="color: white; line-height: 1.6; margin-bottom: 15px;">
                融合流亡黯道與遊戲王風格的互動式作品集網站，展現創新設計思維。
              </p>
              <div style="color: #f39c12; font-weight: bold;">
                狀態: 目前頁面 🎯
              </div>
            </div>
          
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <div style="background: rgba(46, 204, 113, 0.1); border: 2px solid #2ecc71; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <p style="color: #2ecc71; font-weight: bold; margin-bottom: 10px;">
                🌟 專案特色
              </p>
              <p style="color: white; font-size: 0.9rem;">
                每個專案都體現了對技術的深度理解和創新應用，從系統架構到用戶體驗都精心設計。
              </p>
            </div>
            <a href="#/" style="background: #2ecc71; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ← 返回首頁
            </a>
          </div>
          
        </div>
      </div>
    `;
  }

  async init() {
    await super.init();
    
    // 添加卡片hover效果
    this.addProjectCardEffects();
  }

  addProjectCardEffects() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      });
      
      card.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      });
    });
  }
}