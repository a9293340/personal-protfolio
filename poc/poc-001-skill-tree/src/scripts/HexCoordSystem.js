/**
 * 簡化版六角形座標系統
 * 只保留最基本的座標轉換功能
 */
class HexCoordSystem {
  constructor(size = 30) {
    this.size = size;
    this.width = size * 2;
    this.height = Math.sqrt(3) * size;
  }

  /**
   * 六角形座標轉換為像素座標
   */
  hexToPixel(hex) {
    const x = this.size * (3/2 * hex.q);
    const y = this.size * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r);
    return { x, y };
  }

  /**
   * 像素座標轉換為六角形座標
   */
  pixelToHex(pixel) {
    const q = (2/3 * pixel.x) / this.size;
    const r = (-1/3 * pixel.x + Math.sqrt(3)/3 * pixel.y) / this.size;
    return this.hexRound({ q, r });
  }

  /**
   * 六角形座標四捨五入
   */
  hexRound(hex) {
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
   * 獲取六個鄰居座標
   */
  getNeighbors(hex) {
    const directions = [
      { q: 1, r: 0 },   // 右
      { q: 1, r: -1 },  // 右上
      { q: 0, r: -1 },  // 左上
      { q: -1, r: 0 },  // 左
      { q: -1, r: 1 },  // 左下
      { q: 0, r: 1 }    // 右下
    ];
    
    return directions.map(dir => ({
      q: hex.q + dir.q,
      r: hex.r + dir.r
    }));
  }

  /**
   * 計算六角形距離
   */
  hexDistance(a, b) {
    return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
  }

  /**
   * 生成六角形 SVG 路徑
   */
  getHexPath(center, size = this.size) {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i;
      const x = center.x + size * Math.cos(angle);
      const y = center.y + size * Math.sin(angle);
      vertices.push({ x, y });
    }
    
    let path = `M ${vertices[0].x} ${vertices[0].y}`;
    for (let i = 1; i < vertices.length; i++) {
      path += ` L ${vertices[i].x} ${vertices[i].y}`;
    }
    path += ' Z';
    return path;
  }
}