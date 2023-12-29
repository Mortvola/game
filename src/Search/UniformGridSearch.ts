import { debug } from "console";
import { Vec2, Vec4, vec2 } from "wgpu-matrix";

export type Element = {
  x: number,
  y: number,
  gCost: number,
  hCost: number,
  actors: Object[],
  parent: Element | null,
}

class UniformGridSearch {
  grid: Element[][];

  width: number;
  
  height: number;

  center: Vec2;

  scale: number;

  lines: Vec4[] = [];

  constructor(width: number, height: number, scale: number) {
    this.scale = scale;

    this.center = vec2.create(Math.floor(width / 2), Math.floor(height / 2))

    this.grid = Array.from({ length: height }, (_, y) => (
      Array.from({ length: width }, (_, x) => ({
        x: x - this.center[0],
        y: y - this.center[1],
        gCost: 0,
        hCost: 0,
        actors: [],
        parent: null,
      }))
    ))

    this.width = width;
    this.height = height;

    this.clear();
  }

  clear() {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.grid[y][x].gCost = Number.MAX_VALUE;
        this.grid[y][x].hCost = Number.MAX_VALUE;
        this.grid[y][x].parent = null;
        this.grid[y][x].actors = [];
      }
    }
  }

  findPath(s: Vec2, g: Vec2, target: Object | null): Vec2[] {
    throw new Error('Not implemented')
  }

  getNode(v: Vec2): Element | undefined {
    const x = v[0] + this.center[0];
    const y = v[1] + this.center[0];

    if (
      x < 0 || x >= this.width
      || y < 0 || y >= this.height
    ) {
      return undefined;
    }

    return this.grid[y][x]
  }

  nodeBlocked(node: Element | null | undefined, target?: Object | null): boolean {
    if (node === null || node === undefined) {
      return true;
    }

    return (node.actors.length > 0
      && (node.actors.length !== 1 || node.actors[0] !== target))
  }

  // Line of sight algorithm from Movel AI News.
  LineOfSight(p1: Vec2, p2: Vec2, target: Object | null) {
    let x0 = p1[0]
    let y0 = p1[1];
    const x1 = p2[0]
    const y1 = p2[1];

    let dy = y1 - y0
    let dx = x1 - x0;

    let f = 0

    const s: number[] = [1, 1];

    if (dy < 0) {
        dy = -dy
        s[1] = -1
    }

    if (dx < 0) {
        dx = -dx
        s[0] = -1
    }

    if (dx >= dy) {
      while (x0 !== x1) {
        f = f + dy;

        if (f >= dx ) {
          const node = this.getNode(
            vec2.create(
              x0 + Math.floor((s[0] - 1) / 2),
              y0 + Math.floor((s[1] - 1) / 2),
            )
          );

          if (this.nodeBlocked(node, target)) { 
              return false
          }

          y0 = y0 + s[1]
          f = f - dx
        }

        const node = this.getNode(
          vec2.create(
            x0 + Math.floor((s[0] - 1) / 2),
            y0 + Math.floor((s[1] - 1) / 2),
          )
        );

        if (f !== 0 && this.nodeBlocked(node, target)) {
            return false
        }

        if (dy === 0) {
          const node1 = this.getNode(
            vec2.create(
              x0 + Math.floor((s[0] - 1) / 2),
              y0,
            )
          );

          const node2 = this.getNode(
            vec2.create(
              x0 + Math.floor((s[0] - 1) / 2),
              y0 - 1,
            )
          );

          if (this.nodeBlocked(node1, target) && this.nodeBlocked(node2, target)) {
            return false
          }
        }

        x0 = x0 + s[0];
      }
    } else {
      while (y0 !== y1) {
        f = f + dx
        if (f >= dy) {
          const node = this.getNode(
            vec2.create(
              x0 + Math.floor((s[0] - 1) / 2),
              y0 + Math.floor((s[1] - 1) / 2),
            )
          );

          if (this.nodeBlocked(node, target)) {
              return false;
          }

          x0 = x0 + s[0]
          f = f - dy
        }

        const node = this.getNode(
          vec2.create(
            x0 + Math.floor((s[0] - 1) / 2),
            y0 + Math.floor((s[1] - 1) / 2),
          )
        );

        if (f !== 0 && this.nodeBlocked(node, target)) {
          return false;
        }

        if (dx === 0) {
          const node1 = this.getNode(
            vec2.create(
              x0 + Math.floor((s[0] - 1) / 2),
              y0,
            )
          );

          const node2 = this.getNode(
            vec2.create(
              x0 + Math.floor((s[0] - 1) / 2),
              y0 - 1,
            )
          );

          if (this.nodeBlocked(node1, target) && this.nodeBlocked(node2, target)) {
            return false
          }
        }

        y0 = y0 + s[1];
      }
    }

    return true
  }

  fillCircle(actor: Object, c: Vec2, r: number): number[][] {
    let debugLines: number[][] = [];

    const center = vec2.create(
      Math.floor(c[0] * this.scale + 0.5) + this.center[0],
      Math.floor(c[1] * this.scale + 0.5) + this.center[1],
    )
    // const center = this.positionToGrid(c);
    const radius = Math.floor(r * this.scale + 0.5);

    let x = radius;
    let y = 0;
  
    // (-radius, 0) and (radius, 0) points.
    if (0 <= y + center[1] && y + center[1] < this.height) {
      const lines = this.horizontalLine(actor, -x + center[0], x + center[0], y + center[1])
      debugLines = debugLines.concat(lines);
    }

    // (0, -radius) and (0, radius) points
    if (0 <= y + center[0] && y + center[0] < this.width) {
      if (0 <= x + center[1] && x + center[1] < this.height) {
        this.grid[x + center[1]][y + center[0]].actors.push(actor);
      }

      if (0 <= -x + center[1] && -x + center[1] < this.height) {
        this.grid[-x + center[1]][y + center[0]].actors.push(actor);
      }
    }
    
    let p = 1 - radius;
  
    while (x > y) {
      y += 1;
  
      if (p <= 0) {
        p = p + 2 * y + 1;
      }
      else {
        x -= 1;
        p = p + 2 * y - 2 * x + 1;
      }
  
      if (x < y) {
        break;
      }
  
      if (0 <= y + center[1] && y + center[1] < this.height) {
        const lines = this.horizontalLine(actor, -x + center[0], x + center[0], y + center[1])
        debugLines = debugLines.concat(lines);
      }

      if (0 <= -y + center[1] && -y + center[1] < this.height) {
        const lines = this.horizontalLine(actor, -x + center[0], x + center[0], -y + center[1])
        debugLines = debugLines.concat(lines);
      }

      if (x !== y) {
        if (0 <= x + center[1] && x + center[1] < this.height) {
          const lines = this.horizontalLine(actor, -y + center[0], y + center[0], x + center[1])
          debugLines = debugLines.concat(lines);
        }

        if (0 <= -x + center[1] && -x + center[1] < this.height) {
          const lines = this.horizontalLine(actor, -y + center[0], y + center[0], -x + center[1])
          debugLines = debugLines.concat(lines);
        }
      }
    }

    return debugLines;
  }

  horizontalLine(actor: Object, x1: number, x2: number, y: number): [number[], number[]] {
    x1 = Math.max(x1, 0);
    x2 = Math.min(x2, this.width - 1);

    for (let x = x1; x <= x2; x += 1) {
      this.grid[y][x].actors.push(actor);
    }

    return [[x1, y], [x2, y]]
  }

  smoothPath(path: Vec2[], target: Object | null): Vec2[] {
    const smoothedPath: Vec2[] = [];

    if (path.length > 0) {
      smoothedPath.push(path[0]);

      if (path.length > 2) {
        for (let i = 1; i < path.length - 1; i += 1) {
          const blocked = !this.LineOfSight(
            vec2.create(Math.floor(smoothedPath[smoothedPath.length - 1][0] * this.scale), Math.floor(smoothedPath[smoothedPath.length - 1][1] * this.scale)),
            vec2.create(Math.floor(path[i + 1][0] * this.scale), Math.floor(path[i + 1][1] * this.scale)),
            target,
          );

          if (blocked) {
            smoothedPath.push(path[i]);
          }
        }  
      }

      smoothedPath.push(path[path.length - 1]);

      // path = path.slice(0, -1);
    }

    return smoothedPath;
  }

  positionToGrid(position: Vec2): Vec2 {
    return vec2.create(
      Math.floor(position[0] * this.scale + 0.5),
      Math.floor(position[1] * this.scale + 0.5),
    );
  }
}

export default UniformGridSearch;
