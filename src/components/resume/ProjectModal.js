/**
 * ProjectModal 組件 - CV 專案詳情彈窗
 *
 * 功能：
 * - 工作專案：顯示完整的專案資訊，無輪播
 * - 個人專案：顯示專案資訊 + 圖片輪播（精簡版）
 * - 響應式設計：桌面版 vs 手機版
 */

export class ProjectModal {
  constructor() {
    this.modal = null;
    this.currentProject = null;
    this.currentType = null; // 'work' or 'personal'
    this.currentImageIndex = 0;
  }

  /**
   * 顯示彈窗
   */
  show(project, type) {
    this.currentProject = project;
    this.currentType = type;
    this.currentImageIndex = 0;

    this.render();
    this.attachEvents();

    // 顯示動畫
    requestAnimationFrame(() => {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  /**
   * 關閉彈窗
   */
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
      if (this.modal && this.modal.parentNode) {
        this.modal.remove();
      }
      this.modal = null;
    }, 300);
  }

  /**
   * 渲染彈窗
   */
  render() {
    // 移除舊彈窗
    const oldModal = document.querySelector('.project-modal');
    if (oldModal) oldModal.remove();

    const html = this.currentType === 'work'
      ? this.renderWorkProject()
      : this.renderPersonalProject();

    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = html;
    this.modal = modalWrapper.firstElementChild;
    document.body.appendChild(this.modal);
  }

  /**
   * 渲染工作專案彈窗
   */
  renderWorkProject() {
    const p = this.currentProject;

    return `
      <div class="project-modal work-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="modal-close" aria-label="關閉">×</button>

          <div class="modal-header">
            <h2 class="modal-title">${p.name}</h2>
            <div class="modal-meta">
              <span class="project-category">${this.getCategoryName(p.category)}</span>
              <span class="project-rarity rarity-${p.rarity}">${this.getRarityName(p.rarity)}</span>
              ${p.timeline ? `<span class="project-period">${p.timeline.startDate} ~ ${p.timeline.endDate || 'now'}</span>` : ''}
            </div>
          </div>

          <div class="modal-body">
            <!-- 專案簡介 -->
            <section class="modal-section">
              <h3 class="section-title">專案簡介</h3>
              <p class="project-description">${p.shortDescription}</p>
            </section>

            <!-- 詳細說明 -->
            ${p.fullDescription ? `
              <section class="modal-section">
                <h3 class="section-title">詳細說明</h3>
                <div class="project-full-desc">${p.fullDescription.replace(/\n/g, '<br>')}</div>
              </section>
            ` : ''}

            <!-- 技術架構 -->
            ${p.techStack && p.techStack.length > 0 ? `
              <section class="modal-section">
                <h3 class="section-title">技術架構</h3>
                <div class="tech-stack-grid">
                  ${p.techStack.map(tech => `
                    <div class="tech-item">
                      <span class="tech-category">${tech.category}</span>
                      <div class="tech-list">
                        ${tech.items.map(item => `<span class="tech-tag">${item}</span>`).join('')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <!-- 挑戰與解決方案 -->
            ${p.challenges && p.challenges.length > 0 ? `
              <section class="modal-section">
                <h3 class="section-title">挑戰與解決方案</h3>
                <div class="challenges-list">
                  ${p.challenges.map(c => `
                    <div class="challenge-item">
                      <h4 class="challenge-title">💡 ${c.challenge}</h4>
                      <p class="challenge-solution">${c.solution}</p>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <!-- 核心成就 -->
            ${p.achievements && p.achievements.length > 0 ? `
              <section class="modal-section">
                <h3 class="section-title">核心成就</h3>
                <ul class="achievements-list">
                  ${p.achievements.map(achievement => {
                    const text = typeof achievement === 'string' ? achievement : achievement.challenge || achievement;
                    return `<li>${text}</li>`;
                  }).join('')}
                </ul>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 渲染個人專案彈窗（包含輪播）
   */
  renderPersonalProject() {
    const p = this.currentProject;
    const screenshots = p.images?.screenshots || [];

    return `
      <div class="project-modal personal-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="modal-close" aria-label="關閉">×</button>

          <div class="modal-header">
            <h2 class="modal-title">${p.title}</h2>
            <div class="modal-meta">
              <span class="project-category">${this.getCategoryName(p.category)}</span>
              <span class="project-rarity rarity-${p.rarity}">${this.getRarityName(p.rarity)}</span>
              ${p.completedDate ? `<span class="project-period">完成於 ${p.completedDate}</span>` : ''}
            </div>
          </div>

          <div class="modal-body">
            <!-- 圖片輪播（精簡版） -->
            ${screenshots.length > 0 ? `
              <section class="modal-section carousel-section">
                <div class="carousel-container">
                  <div class="carousel-images">
                    ${screenshots.map((img, idx) => `
                      <img
                        src="${img}"
                        alt="${p.title} - Screenshot ${idx + 1}"
                        class="carousel-image ${idx === 0 ? 'active' : ''}"
                        loading="lazy"
                      />
                    `).join('')}
                  </div>
                  ${screenshots.length > 1 ? `
                    <button class="carousel-btn prev" aria-label="上一張">‹</button>
                    <button class="carousel-btn next" aria-label="下一張">›</button>
                    <div class="carousel-indicators">
                      ${screenshots.map((_, idx) => `
                        <span class="indicator ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </section>
            ` : ''}

            <!-- 專案簡介 -->
            <section class="modal-section">
              <h3 class="section-title">專案簡介</h3>
              <p class="project-description">${p.description}</p>
            </section>

            <!-- 專案亮點 -->
            ${p.highlights && p.highlights.length > 0 ? `
              <section class="modal-section">
                <h3 class="section-title">專案亮點</h3>
                <ul class="highlights-list">
                  ${p.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
              </section>
            ` : ''}

            <!-- 技術棧 -->
            ${p.technologies && p.technologies.length > 0 ? `
              <section class="modal-section">
                <h3 class="section-title">技術棧</h3>
                <div class="tech-tags">
                  ${p.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </section>
            ` : ''}

            <!-- 專案連結 -->
            ${p.links && (p.links.demo || p.links.github) ? `
              <section class="modal-section">
                <h3 class="section-title">專案連結</h3>
                <div class="project-links">
                  ${p.links.demo ? `<a href="${p.links.demo}" target="_blank" class="project-link demo">🔗 線上展示</a>` : ''}
                  ${p.links.github ? `<a href="${p.links.github}" target="_blank" class="project-link github">💻 GitHub</a>` : ''}
                </div>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 綁定事件
   */
  attachEvents() {
    // 關閉按鈕
    const closeBtn = this.modal.querySelector('.modal-close');
    const overlay = this.modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => this.close());
    overlay.addEventListener('click', () => this.close());

    // ESC 鍵關閉
    this.handleEscape = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this.handleEscape);

    // 輪播功能（僅個人專案）
    if (this.currentType === 'personal') {
      this.attachCarouselEvents();
    }
  }

  /**
   * 綁定輪播事件
   */
  attachCarouselEvents() {
    const prevBtn = this.modal.querySelector('.carousel-btn.prev');
    const nextBtn = this.modal.querySelector('.carousel-btn.next');
    const indicators = this.modal.querySelectorAll('.indicator');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevImage());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextImage());
    }

    indicators.forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goToImage(index);
      });
    });
  }

  /**
   * 上一張圖片
   */
  prevImage() {
    const images = this.modal.querySelectorAll('.carousel-image');
    this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
    this.updateCarousel();
  }

  /**
   * 下一張圖片
   */
  nextImage() {
    const images = this.modal.querySelectorAll('.carousel-image');
    this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
    this.updateCarousel();
  }

  /**
   * 跳到指定圖片
   */
  goToImage(index) {
    this.currentImageIndex = index;
    this.updateCarousel();
  }

  /**
   * 更新輪播顯示
   */
  updateCarousel() {
    const images = this.modal.querySelectorAll('.carousel-image');
    const indicators = this.modal.querySelectorAll('.indicator');

    images.forEach((img, idx) => {
      img.classList.toggle('active', idx === this.currentImageIndex);
    });

    indicators.forEach((indicator, idx) => {
      indicator.classList.toggle('active', idx === this.currentImageIndex);
    });
  }

  /**
   * 取得分類名稱
   */
  getCategoryName(category) {
    const names = {
      fullstack: '全端開發',
      backend: '後端開發',
      frontend: '前端開發',
      architecture: '架構設計',
    };
    return names[category] || category;
  }

  /**
   * 取得稀有度名稱
   */
  getRarityName(rarity) {
    const names = {
      legendary: '傳說',
      superRare: '超稀有',
      rare: '稀有',
      normal: '普通',
    };
    return names[rarity] || rarity;
  }

  /**
   * 清理事件監聽
   */
  destroy() {
    if (this.handleEscape) {
      document.removeEventListener('keydown', this.handleEscape);
    }
  }
}

export default ProjectModal;
