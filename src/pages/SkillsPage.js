/**
 * 技能樹頁面組件
 * Step 3.1.1c: 技能展示頁面
 */

import { BaseComponent } from '../core/components/BaseComponent.js';

export class SkillsPage extends BaseComponent {
  async render() {
    return `
      <div class="skills-page">
        <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
          
          <header style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #3498db; font-size: 2.5rem; margin-bottom: 20px;">
              🌟 技能樹
            </h1>
            <p style="color: #ffffff; font-size: 1.2rem; opacity: 0.9;">
              專業技能發展軌跡
            </p>
          </header>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
            
            <!-- Backend Skills -->
            <div style="background: rgba(46, 204, 113, 0.1); border: 2px solid #2ecc71; padding: 25px; border-radius: 12px;">
              <h2 style="color: #2ecc71; margin-bottom: 20px;">🖥️ 後端開發</h2>
              <div class="skill-tree">
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #d4af37;">●</span>
                  <span style="color: white; margin-left: 10px;">Node.js 專家級</span>
                </div>
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #d4af37;">●</span>
                  <span style="color: white; margin-left: 10px;">API 設計大師</span>
                </div>
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #3498db;">○</span>
                  <span style="color: #bdc3c7; margin-left: 10px;">微服務架構 (學習中)</span>
                </div>
              </div>
            </div>
            
            <!-- Database Skills -->
            <div style="background: rgba(230, 126, 34, 0.1); border: 2px solid #e67e22; padding: 25px; border-radius: 12px;">
              <h2 style="color: #e67e22; margin-bottom: 20px;">🗃️ 資料庫</h2>
              <div class="skill-tree">
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #d4af37;">●</span>
                  <span style="color: white; margin-left: 10px;">SQL 優化專家</span>
                </div>
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #d4af37;">●</span>
                  <span style="color: white; margin-left: 10px;">NoSQL 設計</span>
                </div>
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #3498db;">○</span>
                  <span style="color: #bdc3c7; margin-left: 10px;">分散式資料庫 (規劃中)</span>
                </div>
              </div>
            </div>
            
            <!-- System Design -->
            <div style="background: rgba(155, 89, 182, 0.1); border: 2px solid #9b59b6; padding: 25px; border-radius: 12px;">
              <h2 style="color: #9b59b6; margin-bottom: 20px;">🏗️ 系統設計</h2>
              <div class="skill-tree">
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #3498db;">○</span>
                  <span style="color: #bdc3c7; margin-left: 10px;">大型系統架構 (目標)</span>
                </div>
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #95a5a6;">○</span>
                  <span style="color: #7f8c8d; margin-left: 10px;">負載均衡 (未解鎖)</span>
                </div>
                <div class="skill-node" style="margin-bottom: 15px;">
                  <span style="color: #95a5a6;">○</span>
                  <span style="color: #7f8c8d; margin-left: 10px;">容器化部署 (未解鎖)</span>
                </div>
              </div>
            </div>
            
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <div style="background: rgba(52, 152, 219, 0.1); border: 2px solid #3498db; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <p style="color: #3498db; font-weight: bold; margin-bottom: 10px;">
                💡 技能樹說明
              </p>
              <p style="color: white; font-size: 0.9rem;">
                <span style="color: #d4af37;">● 金色</span> = 已掌握 | 
                <span style="color: #3498db;">○ 藍色</span> = 學習中 | 
                <span style="color: #95a5a6;">○ 灰色</span> = 未解鎖
              </p>
            </div>
            <a href="#/" style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ← 返回首頁
            </a>
          </div>
          
        </div>
      </div>
    `;
  }
}