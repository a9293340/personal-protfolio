/**
 * HexCoordSystem - 六角形座標系統
 * 
 * 基於 POC-001 遷移而來的六角形座標計算系統
 * 提供六角形網格的座標轉換和相關算法
 * 
 * 核心功能：
 * - 六角形座標與像素座標轉換
 * - 座標四捨五入和鄰居計算
 * - 距離計算和路徑查找
 * 
 * @author Claude
 * @version 2.0.0 (基於 POC-001 v1.0.0)
 */

// 六角形座標類型定義
export interface HexCoord {
  q: number;
  r: number;
}

export interface PixelCoord {
  x: number;
  y: number;
}

// 六角形網格方向（6個相鄰方向）
export const HEX_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },   // 右
  { q: 1, r: -1 },  // 右上
  { q: 0, r: -1 },  // 左上
  { q: -1, r: 0 },  // 左
  { q: -1, r: 1 },  // 左下
  { q: 0, r: 1 },   // 右下
];

export class HexCoordSystem {
  private size: number;
  private width: number;
  private height: number;

  /**
   * 建構函數
   * @param size 六角形的半徑（從中心到頂點的距離）
   */
  constructor(size: number = 30) {
    this.size = size;
    this.width = size * 2;
    this.height = Math.sqrt(3) * size;
  }

  /**
   * 獲取六角形的尺寸
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * 獲取六角形的寬度和高度
   */
  public getDimensions(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }

  /**
   * 六角形座標轉換為像素座標
   * 使用 flat-top 六角形佈局
   */
  public hexToPixel(hex: HexCoord): PixelCoord {
    const x = this.size * (3/2 * hex.q);
    const y = this.size * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r);
    return { x, y };
  }

  /**
   * 像素座標轉換為六角形座標
   */
  public pixelToHex(pixel: PixelCoord): HexCoord {
    const q = (2/3 * pixel.x) / this.size;
    const r = (-1/3 * pixel.x + Math.sqrt(3)/3 * pixel.y) / this.size;
    return this.hexRound({ q, r });
  }

  /**
   * 六角形座標四捨五入
   * 確保座標是有效的六角形網格座標
   */
  public hexRound(hex: HexCoord): HexCoord {
    let rq = Math.round(hex.q);
    let rr = Math.round(hex.r);
    let rs = Math.round(-hex.q - hex.r);

    const q_diff = Math.abs(rq - hex.q);
    const r_diff = Math.abs(rr - hex.r);
    const s_diff = Math.abs(rs - (-hex.q - hex.r));

    if (q_diff > r_diff && q_diff > s_diff) {
      rq = -rr - rs;
    } else if (r_diff > s_diff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }

  /**
   * 計算兩個六角形座標之間的距離
   */
  public hexDistance(a: HexCoord, b: HexCoord): number {
    return (Math.abs(a.q - b.q) + 
            Math.abs(a.q + a.r - b.q - b.r) + 
            Math.abs(a.r - b.r)) / 2;
  }

  /**
   * 獲取指定座標的鄰居座標
   */
  public getNeighbors(hex: HexCoord): HexCoord[] {
    return HEX_DIRECTIONS.map(dir => ({
      q: hex.q + dir.q,
      r: hex.r + dir.r,
    }));
  }

  /**
   * 獲取指定方向的鄰居座標
   */
  public getNeighbor(hex: HexCoord, direction: number): HexCoord {
    if (direction < 0 || direction >= HEX_DIRECTIONS.length) {
      throw new Error(`無效的方向索引: ${direction}`);
    }
    
    const dir = HEX_DIRECTIONS[direction];
    return {
      q: hex.q + dir.q,
      r: hex.r + dir.r,
    };
  }

  /**
   * 獲取指定半徑範圍內的所有座標
   */
  public getHexesInRange(center: HexCoord, radius: number): HexCoord[] {
    const results: HexCoord[] = [];
    
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      
      for (let r = r1; r <= r2; r++) {
        results.push({
          q: center.q + q,
          r: center.r + r,
        });
      }
    }
    
    return results;
  }

  /**
   * 計算從起點到終點的直線路徑
   */
  public getLinePath(start: HexCoord, end: HexCoord): HexCoord[] {
    const distance = this.hexDistance(start, end);
    const results: HexCoord[] = [];
    
    for (let i = 0; i <= distance; i++) {
      const t = distance === 0 ? 0 : i / distance;
      const lerpQ = start.q + (end.q - start.q) * t;
      const lerpR = start.r + (end.r - start.r) * t;
      
      results.push(this.hexRound({ q: lerpQ, r: lerpR }));
    }
    
    return results;
  }

  /**
   * 檢查兩個六角形座標是否相等
   */
  public hexEquals(a: HexCoord, b: HexCoord): boolean {
    return a.q === b.q && a.r === b.r;
  }

  /**
   * 將六角形座標轉換為字符串（用於鍵值）
   */
  public hexToString(hex: HexCoord): string {
    return `${hex.q},${hex.r}`;
  }

  /**
   * 從字符串解析六角形座標
   */
  public stringToHex(str: string): HexCoord {
    const parts = str.split(',').map(Number);
    if (parts.length !== 2 || parts.some(isNaN)) {
      throw new Error(`無法解析六角形座標: ${str}`);
    }
    
    return { q: parts[0], r: parts[1] };
  }

  /**
   * 計算六角形座標的第三個座標 s（用於驗證）
   */
  public getS(hex: HexCoord): number {
    return -hex.q - hex.r;
  }

  /**
   * 驗證六角形座標是否有效
   */
  public isValidHex(hex: HexCoord): boolean {
    const s = this.getS(hex);
    return Math.abs(hex.q + hex.r + s) < 1e-10; // 允許浮點誤差
  }

  /**
   * 旋轉六角形座標（圍繞原點）
   * @param hex 要旋轉的座標
   * @param steps 旋轉步數（每步60度，正數為順時針）
   */
  public rotateHex(hex: HexCoord, steps: number): HexCoord {
    const normalized = ((steps % 6) + 6) % 6; // 確保在 0-5 範圍內
    
    let { q, r } = hex;
    const s = this.getS(hex);
    
    for (let i = 0; i < normalized; i++) {
      [q, r] = [-s, -q];
      const newS = -q - r;
      [q, r] = [q, r];
    }
    
    return { q, r };
  }
}