/**
 * 關於頁面組件
 * Step 3.1.1c: 關於我頁面
 */

import { BaseComponent } from '../core/components/BaseComponent.js';

export class AboutPage extends BaseComponent {
  async render() {
    return `
      <div class="about-page">
        <div style="max-width: 1000px; margin: 0 auto; padding: 20px;">
          
          <header style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #d4af37; font-size: 2.5rem; margin-bottom: 20px;">
              📋 關於我
            </h1>
            <p style="color: #ffffff; font-size: 1.2rem; opacity: 0.9;">
              後端工程師的成長軌跡
            </p>
          </header>
          
          <div style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #d4af37; margin-bottom: 20px;">🎯 職涯目標</h2>
            <p style="color: white; line-height: 1.6; margin-bottom: 15px;">
              從後端工程師向系統架構師發展，專注於大型分散式系統設計與實現。
            </p>
            <p style="color: white; line-height: 1.6;">
              結合遊戲化思維，將複雜的技術概念以直覺的方式呈現。
            </p>
          </div>
          
          <div style="background: rgba(52, 152, 219, 0.1); border: 2px solid #3498db; padding: 30px; border-radius: 12px;">
            <h2 style="color: #3498db; margin-bottom: 20px;">🛠️ 技術專長</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
              <div>
                <h3 style="color: #2ecc71; margin-bottom: 10px;">後端開發</h3>
                <ul style="color: white; margin: 0; padding-left: 20px;">
                  <li>Node.js / Express</li>
                  <li>Python / Django</li>
                  <li>RESTful API 設計</li>
                </ul>
              </div>
              <div>
                <h3 style="color: #e67e22; margin-bottom: 10px;">資料庫</h3>
                <ul style="color: white; margin: 0; padding-left: 20px;">
                  <li>MySQL / PostgreSQL</li>
                  <li>MongoDB / Redis</li>
                  <li>資料庫優化</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="#/" style="background: #d4af37; color: black; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ← 返回首頁
            </a>
          </div>
          
        </div>
      </div>
    `;
  }
}