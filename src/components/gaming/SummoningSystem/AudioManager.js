// @ts-nocheck
/**
 * AudioManager.js - 動態音效生成系統
 *
 * 功能特色:
 * 1. Web Audio API 音效合成
 * 2. 召喚階段動態音效 (魔法陣、粒子流、爆發、召喚)
 * 3. 環境背景音效系統
 * 4. 音效層次管理 (BGM、SFX、UI)
 * 5. 設備性能適配
 * 6. 用戶偏好控制
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class AudioManager extends BaseComponent {
  constructor(containerId, config = {}) {
    super();

    // 初始化配置和狀態
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = { ...this.getInitialState() };

    this.audioContext = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.uiGain = null;

    // 音效狀態管理
    this.isInitialized = false;
    this.isEnabled = true;
    this.masterVolume = 0.7;
    this.sfxVolume = 0.8;
    this.bgmVolume = 0.5;
    this.uiVolume = 0.6;

    // 音效快取
    this.soundCache = new Map();
    this.activeNodes = new Set();

    // 召喚階段音效配置
    this.summoningPhases = {
      magicCircle: {
        frequency: 220,
        duration: 2000,
        type: 'mystical',
        volume: 0.6,
      },
      energyGather: {
        frequency: 330,
        duration: 1500,
        type: 'energy',
        volume: 0.7,
      },
      particleBurst: {
        frequency: 440,
        duration: 1000,
        type: 'burst',
        volume: 0.9,
      },
      cardSummoning: {
        frequency: 550,
        duration: 3500,
        type: 'summoning',
        volume: 0.8,
      },
      transition: {
        frequency: 330,
        duration: 500,
        type: 'transition',
        volume: 0.5,
      },
    };
  }

  getDefaultConfig() {
    return {
      enabled: true,
      masterVolume: 0.7,
      sfxVolume: 0.8,
      bgmVolume: 0.5,
      uiVolume: 0.6,
      autoInit: false, // 需要用戶互動才能啟動
      enableEnvironmentalSounds: true,
      enableSummoningSounds: true,
      enableUISounds: true,
      deviceOptimization: true,
    };
  }

  getInitialState() {
    return {
      isPlaying: false,
      currentPhase: null,
      activeSounds: [],
      audioContextState: 'suspended',
      errorMessage: null,
      deviceCapability: 'unknown',
    };
  }

  /**
   * 設置狀態 (自定義狀態管理)
   */
  setState(newState) {
    if (!this.state) {
      this.state = {};
    }
    Object.assign(this.state, newState);
  }

  async init() {
    try {
      await this.detectDeviceCapability();
      await this.setupAudioContext();
      await this.initializeGainNodes();
      this.bindEventListeners();

      this.isInitialized = true;
      this.setState({
        audioContextState: this.audioContext?.state || 'suspended',
        deviceCapability: this.state.deviceCapability,
      });

      console.log('✅ [AudioManager] AudioManager initialized successfully');
      this.emit('audioManagerReady', {
        capability: this.state.deviceCapability,
        contextState: this.audioContext?.state,
      });
    } catch (error) {
      console.error(
        '❌ [AudioManager] Failed to initialize AudioManager:',
        error
      );
      this.setState({ errorMessage: error.message });
      throw error;
    }
  }

  async detectDeviceCapability() {
    const capability = {
      webAudioAPI: false,
      audioContext: false,
      userGesture: false,
      performance: 'low',
    };

    // 檢測 Web Audio API 支援
    if (
      typeof AudioContext !== 'undefined' ||
      typeof webkitAudioContext !== 'undefined'
    ) {
      capability.webAudioAPI = true;
    }

    // 檢測設備性能
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
      const renderer = gl.getParameter(gl.RENDERER);
      if (renderer && renderer.includes('Intel')) {
        capability.performance = 'medium';
      } else if (
        renderer &&
        (renderer.includes('NVIDIA') || renderer.includes('AMD'))
      ) {
        capability.performance = 'high';
      }
    }

    // 移動設備檢測
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      capability.performance =
        capability.performance === 'high' ? 'medium' : 'low';
    }

    this.setState({ deviceCapability: capability });
    console.log(
      '🔍 [AudioManager] Device audio capability detected:',
      capability
    );
  }

  async setupAudioContext() {
    try {
      // 創建 AudioContext (兼容性處理)
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported');
      }

      this.audioContext = new AudioContextClass();

      // 某些瀏覽器需要用戶手勢才能啟動音頻
      if (this.audioContext.state === 'suspended') {
        console.log(
          '⏳ [AudioManager] AudioContext suspended, waiting for user gesture'
        );
      }
    } catch (error) {
      console.error('❌ [AudioManager] Failed to setup AudioContext:', error);
      throw error;
    }
  }

  async initializeGainNodes() {
    if (!this.audioContext) return;

    try {
      // 創建主增益節點
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.audioContext.destination);

      // 創建分層增益節點
      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.audioContext.createGain();
      this.bgmGain.gain.value = this.bgmVolume;
      this.bgmGain.connect(this.masterGain);

      this.uiGain = this.audioContext.createGain();
      this.uiGain.gain.value = this.uiVolume;
      this.uiGain.connect(this.masterGain);

      console.log('🎚️ [AudioManager] Audio gain nodes initialized');
    } catch (error) {
      console.error(
        '❌ [AudioManager] Failed to initialize gain nodes:',
        error
      );
      throw error;
    }
  }

  bindEventListeners() {
    // 監聽用戶手勢以啟動 AudioContext
    const enableAudioContext = async () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        try {
          await this.audioContext.resume();
          this.setState({ audioContextState: 'running' });
          this.emit('audioContextResumed');
          console.log('▶️ [AudioManager] AudioContext resumed by user gesture');
        } catch (error) {
          console.error('Failed to resume AudioContext:', error);
        }
      }
    };

    // 綁定多種用戶互動事件
    ['click', 'touchstart', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, enableAudioContext, { once: true });
    });

    // 監聽頁面可見性變化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.audioContext) {
        this.pauseAllSounds();
      }
    });
  }

  /**
   * 播放召喚階段音效
   */
  async playPhaseSound(phaseName) {
    if (!this.isEnabled || !this.config.enableSummoningSounds) return;

    try {
      await this.ensureAudioContextRunning();

      const phaseConfig = this.summoningPhases[phaseName];
      if (!phaseConfig) {
        console.warn(`Unknown phase: ${phaseName}`);
        return;
      }

      this.setState({ currentPhase: phaseName, isPlaying: true });
      this.emit('phaseAudioStart', { phase: phaseName });

      let soundNode;
      switch (phaseConfig.type) {
        case 'mystical':
          soundNode = await this.generateMysticalSound(phaseConfig);
          break;
        case 'energy':
          soundNode = await this.generateEnergySound(phaseConfig);
          break;
        case 'burst':
          soundNode = await this.generateBurstSound(phaseConfig);
          break;
        case 'summoning':
          soundNode = await this.generateSummoningSound(phaseConfig);
          break;
        case 'transition':
          soundNode = await this.generateTransitionSound(phaseConfig);
          break;
        default:
          soundNode = await this.generateGenericSound(phaseConfig);
      }

      if (soundNode) {
        this.activeNodes.add(soundNode);

        // 設置音效結束清理
        setTimeout(() => {
          this.cleanupSoundNode(soundNode);
          if (this.state.currentPhase === phaseName) {
            this.setState({ isPlaying: false, currentPhase: null });
            this.emit('phaseAudioEnd', { phase: phaseName });
          }
        }, phaseConfig.duration);
      }

      console.log(`Playing phase sound: ${phaseName}`);
    } catch (error) {
      console.error(`Failed to play phase sound ${phaseName}:`, error);
      this.setState({ errorMessage: error.message });
    }
  }

  /**
   * 生成神秘魔法音效 (魔法陣階段)
   */
  async generateMysticalSound(config) {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // 基礎波形：正弦波 + 少量方波混合
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(
      config.frequency,
      this.audioContext.currentTime
    );

    // 頻率調制產生神秘感
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.type = 'triangle';
    lfo.frequency.value = 3; // 3Hz 調制
    lfoGain.gain.value = 10; // 調制深度

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    lfo.start();

    // 低通濾波器增加溫暖感
    filter.type = 'lowpass';
    filter.frequency.value = config.frequency * 2;
    filter.Q.value = 1;

    // 包絡曲線：緩慢淡入淡出
    const duration = config.duration / 1000;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      config.volume * 0.8,
      this.audioContext.currentTime + 0.5
    );
    gainNode.gain.setValueAtTime(
      config.volume * 0.8,
      this.audioContext.currentTime + duration - 0.5
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + duration
    );

    // 連接音頻節點
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);

    return { oscillator, gainNode, filter, lfo, lfoGain };
  }

  /**
   * 生成能量聚集音效 (粒子流階段)
   */
  async generateEnergySound(config) {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // 鋸齒波產生能量感
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(
      config.frequency,
      this.audioContext.currentTime
    );

    // 高通濾波器突出高頻能量
    filter.type = 'highpass';
    filter.frequency.value = config.frequency * 0.8;
    filter.Q.value = 2;

    // 動態增益變化模擬能量聚集
    const duration = config.duration / 1000;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      config.volume,
      this.audioContext.currentTime + duration * 0.7
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + duration
    );

    // 頻率上升效果
    oscillator.frequency.exponentialRampToValueAtTime(
      config.frequency * 1.5,
      this.audioContext.currentTime + duration * 0.8
    );

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);

    return { oscillator, gainNode, filter };
  }

  /**
   * 生成爆發音效 (星塵爆發階段)
   */
  async generateBurstSound(config) {
    if (!this.audioContext) return null;

    // 使用雜訊生成器模擬爆發
    const bufferSize = this.audioContext.sampleRate * (config.duration / 1000);
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    // 生成白雜訊
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    source.buffer = buffer;

    // 帶通濾波器塑造爆發頻譜
    filter.type = 'bandpass';
    filter.frequency.value = config.frequency;
    filter.Q.value = 5;

    // 快速衰減模擬爆發特性
    const duration = config.duration / 1000;
    gainNode.gain.setValueAtTime(config.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);

    source.start();

    return { source, gainNode, filter };
  }

  /**
   * 生成召喚音效 (卡牌召喚階段)
   */
  async generateSummoningSound(config) {
    if (!this.audioContext) return null;

    // 複合音效：基頻 + 泛音
    const fundamentalOsc = this.audioContext.createOscillator();
    const harmonicOsc = this.audioContext.createOscillator();
    const subOsc = this.audioContext.createOscillator();

    const fundamentalGain = this.audioContext.createGain();
    const harmonicGain = this.audioContext.createGain();
    const subGain = this.audioContext.createGain();
    const masterGain = this.audioContext.createGain();

    // 設置頻率關係
    fundamentalOsc.type = 'triangle';
    fundamentalOsc.frequency.value = config.frequency;

    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.value = config.frequency * 1.5; // 五度

    subOsc.type = 'sine';
    subOsc.frequency.value = config.frequency * 0.5; // 低八度

    // 設置音量比例
    fundamentalGain.gain.value = 0.6;
    harmonicGain.gain.value = 0.3;
    subGain.gain.value = 0.4;

    // 包絡設計：模仿宏偉的召喚感
    const duration = config.duration / 1000;
    masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    masterGain.gain.linearRampToValueAtTime(
      config.volume * 0.7,
      this.audioContext.currentTime + 1
    );
    masterGain.gain.setValueAtTime(
      config.volume * 0.7,
      this.audioContext.currentTime + duration - 1
    );
    masterGain.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + duration
    );

    // 連接音頻圖
    fundamentalOsc.connect(fundamentalGain);
    harmonicOsc.connect(harmonicGain);
    subOsc.connect(subGain);

    fundamentalGain.connect(masterGain);
    harmonicGain.connect(masterGain);
    subGain.connect(masterGain);
    masterGain.connect(this.sfxGain);

    // 啟動振盪器
    const startTime = this.audioContext.currentTime;
    fundamentalOsc.start(startTime);
    harmonicOsc.start(startTime);
    subOsc.start(startTime);

    fundamentalOsc.stop(startTime + duration);
    harmonicOsc.stop(startTime + duration);
    subOsc.stop(startTime + duration);

    return {
      fundamentalOsc,
      harmonicOsc,
      subOsc,
      fundamentalGain,
      harmonicGain,
      subGain,
      masterGain,
    };
  }

  /**
   * 生成轉場音效 (轉場準備階段)
   */
  async generateTransitionSound(config) {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.value = config.frequency;

    const duration = config.duration / 1000;
    gainNode.gain.setValueAtTime(
      config.volume * 0.5,
      this.audioContext.currentTime
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);

    return { oscillator, gainNode };
  }

  /**
   * 生成通用音效
   */
  async generateGenericSound(config) {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = config.frequency;

    const duration = config.duration / 1000;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      config.volume,
      this.audioContext.currentTime + 0.1
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);

    return { oscillator, gainNode };
  }

  /**
   * 播放 UI 音效 (按鈕點擊等)
   */
  async playUISound(type = 'click', volume = 0.3) {
    if (!this.isEnabled || !this.config.enableUISounds) return;

    try {
      await this.ensureAudioContextRunning();

      const soundConfig = {
        click: { frequency: 800, duration: 100 },
        hover: { frequency: 600, duration: 150 },
        error: { frequency: 200, duration: 300 },
        success: { frequency: 1000, duration: 200 },
      }[type] || { frequency: 440, duration: 150 };

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.value = soundConfig.frequency;

      const duration = soundConfig.duration / 1000;
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(this.uiGain);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration);

      console.debug(`Played UI sound: ${type}`);
    } catch (error) {
      console.error(`Failed to play UI sound ${type}:`, error);
    }
  }

  /**
   * 設置音量
   */
  setVolume(type, value) {
    const clampedValue = Math.max(0, Math.min(1, value));

    switch (type) {
      case 'master':
        this.masterVolume = clampedValue;
        if (this.masterGain) {
          this.masterGain.gain.setValueAtTime(
            clampedValue,
            this.audioContext.currentTime
          );
        }
        break;
      case 'sfx':
        this.sfxVolume = clampedValue;
        if (this.sfxGain) {
          this.sfxGain.gain.setValueAtTime(
            clampedValue,
            this.audioContext.currentTime
          );
        }
        break;
      case 'bgm':
        this.bgmVolume = clampedValue;
        if (this.bgmGain) {
          this.bgmGain.gain.setValueAtTime(
            clampedValue,
            this.audioContext.currentTime
          );
        }
        break;
      case 'ui':
        this.uiVolume = clampedValue;
        if (this.uiGain) {
          this.uiGain.gain.setValueAtTime(
            clampedValue,
            this.audioContext.currentTime
          );
        }
        break;
    }

    this.emit('volumeChanged', { type, value: clampedValue });
    console.debug(`Volume changed: ${type} = ${clampedValue}`);
  }

  /**
   * 啟用/禁用音效
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;

    if (!enabled) {
      this.pauseAllSounds();
    }

    this.emit('audioEnabledChanged', { enabled });
    console.log(`Audio ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 暫停所有音效
   */
  pauseAllSounds() {
    this.activeNodes.forEach(nodeGroup => {
      this.cleanupSoundNode(nodeGroup);
    });
    this.activeNodes.clear();

    this.setState({ isPlaying: false, currentPhase: null });
    this.emit('allSoundsPaused');
  }

  /**
   * 確保 AudioContext 正在運行
   */
  async ensureAudioContextRunning() {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      this.setState({ audioContextState: 'running' });
    }
  }

  /**
   * 清理音頻節點
   */
  cleanupSoundNode(nodeGroup) {
    if (!nodeGroup) return;

    try {
      Object.values(nodeGroup).forEach(node => {
        if (node && typeof node.disconnect === 'function') {
          node.disconnect();
        }
        if (node && typeof node.stop === 'function') {
          try {
            node.stop();
          } catch (e) {
            // 節點可能已經停止
          }
        }
      });

      this.activeNodes.delete(nodeGroup);
    } catch (error) {
      console.warn('Error cleaning up sound node:', error);
    }
  }

  /**
   * 獲取音頻狀態信息
   */
  getAudioStatus() {
    return {
      isInitialized: this.isInitialized,
      isEnabled: this.isEnabled,
      audioContextState: this.audioContext?.state || 'not-initialized',
      masterVolume: this.masterVolume,
      sfxVolume: this.sfxVolume,
      bgmVolume: this.bgmVolume,
      uiVolume: this.uiVolume,
      activeSoundsCount: this.activeNodes.size,
      deviceCapability: this.state.deviceCapability,
    };
  }

  /**
   * 銷毀音頻管理器
   */
  destroy() {
    try {
      // 停止所有音效
      this.pauseAllSounds();

      // 關閉 AudioContext
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
      }

      // 清理引用
      this.audioContext = null;
      this.masterGain = null;
      this.sfxGain = null;
      this.bgmGain = null;
      this.uiGain = null;
      this.soundCache.clear();

      console.log('AudioManager destroyed');
    } catch (error) {
      console.error('Error destroying AudioManager:', error);
    } finally {
      super.destroy();
    }
  }
}
