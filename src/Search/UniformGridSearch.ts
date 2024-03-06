import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import { Occupant } from "../Workers/PathPlannerTypes";
import { GridNode } from "./GridNode";

class UniformGridSearch {
  grid: GridNode[][];

  width: number;
  
  height: number;

  center: Vec2;

  scale: number;

  target: Occupant | null = null;

  lines: Vec4[] = [];

  ignore: number[] = [];

  ignoreTerrain = false;

  constructor(width: number, height: number, scale: number) {
    this.scale = scale;

    this.center = vec2.create(Math.floor(width / 2), Math.floor(height / 2))

    this.grid = Array.from({ length: height }, (_, y) => (
      Array.from({ length: width }, (_, x) => ({
        x,
        y,
        gCost: 0,
        hCost: 0,
        occupants: [],
        parent: null,
      }))
    ))

    this.width = width;
    this.height = height;

    this.clear(true);
  }

  clear(all: boolean) {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.grid[y][x].gCost = Number.MAX_VALUE;
        this.grid[y][x].hCost = Number.MAX_VALUE;
        this.grid[y][x].parent = null;

        if (all) {
          this.grid[y][x].occupants = [];
        }
      }
    }
  }

  findPath(s: Vec2, g: Vec2, goalRadius: number | null, target: Occupant | null, ignoreTerrain = false): Vec2[] {
    throw new Error('Not implemented')
  }

  getNode(x: number, y: number): GridNode | undefined {
    if (
      x < 0 || x >= this.width
      || y < 0 || y >= this.height
    ) {
      return undefined;
    }

    return this.grid[y][x]
  }

  nodeBlocked(x: number, y: number): boolean;
  nodeBlocked(node?: GridNode | null): boolean;
  nodeBlocked(arg1?: number | GridNode | null, arg2?: number): boolean {
    if (arg1 === null || arg1 === undefined) {
      return true;
    }

    let node = arg1 as GridNode;

    if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      const x = arg1;
      const y = arg2;
      if (
        x < 0 || x >= this.width
        || y < 0 || y >= this.height
      ) {
        return true;
      }
  
      node = this.grid[y][x];
    }

    if (
      node.occupants
        .filter((o) => (
          (!this.ignoreTerrain || o.type !== 'Terrain')
          && !this.ignore.includes(o.id)
        ))
        .length > 0
    ) {
      return true;
    }        

    return false;
  }

  // Line of sight algorithm from Movel AI News.
  LineOfSight(p1: Vec2, p2: Vec2) {
    let x0 = p1[0]
    let y0 = p1[1];
    let x1 = p2[0]
    let y1 = p2[1];

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    if (dx >= dy) {
      if (x0 > x1) {
        [x0, y0, x1, y1] = [x1, y1, x0, y0]
      }

      dy = y1 - y0;
      let s = 1;

      if (y0 > y1) {
        dy = -dy
        s = -1
      }
  
      let mNew = 2 * dy
      let slopeError = mNew - dx
  
      let y = y0;
  
      for (let x = x0; x < x1; x += 1) {
        if (this.nodeBlocked(x, y)) {
          return false
        }
  
        if (slopeError > 0) {
          y += s;
          slopeError -= 2 * dx
        }
  
        slopeError += mNew
      }  
    }
    else {
      if (y0 > y1) {
        [x0, y0, x1, y1] = [x1, y1, x0, y0]
      }

      dx = x1 - x0;
      let s = 1;

      if (x0 > x1) {
        dx = -dx
        s = -1
      }

      let mNew = 2 * dx
      let slopeError = mNew - dy
  
      let x = x0;

      for (let y = y0; y < y1; y += 1) {
        if (this.nodeBlocked(x, y)) {
          return false
        }
  
        if (slopeError > 0) {
          x += s;
          slopeError -= 2 * dy
        }
  
        slopeError += mNew
      }  
    }

    return true
  }

  fillCircle(occupant: Occupant, c: Vec2, r: number): number[][] {
    let debugLines: number[][] = [];

    const center = this.positionToGrid(c);
    const radius = Math.floor(r * this.scale + 0.5);

    let x = radius;
    let y = 0;
  
    // (-radius, 0) and (radius, 0) points.
    if (0 <= center[1] && center[1] < this.height) {
      const lines = this.horizontalLine(occupant, -x + center[0], x + center[0], center[1])
      debugLines = debugLines.concat(lines);
    }

    // (0, -radius) and (0, radius) points
    if (0 <= center[0] && center[0] < this.width) {
      if (0 <= x + center[1] && x + center[1] < this.height) {
        this.grid[x + center[1]][center[0]].occupants.push(occupant);
      }

      if (0 <= -x + center[1] && -x + center[1] < this.height) {
        this.grid[-x + center[1]][center[0]].occupants.push(occupant);
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
  
      let x1 = -x + center[0];
      let x2 = x + center[0];
      let y1 = y + center[1];
      let y2 = -y + center[1];

      if (0 <= y1 && y1 < this.height) {
        const lines = this.horizontalLine(occupant, x1, x2, y1)
        debugLines = debugLines.concat(lines);
      }

      if (0 <= y2 && y2 < this.height) {
        const lines = this.horizontalLine(occupant, x1, x2, y2)
        debugLines = debugLines.concat(lines);
      }

      if (x !== y) {
        x1 = -y + center[0];
        x2 = y + center[0];
        y1 = x + center[1];
        y2 = -x + center[1];
  
        if (0 <= y1 && y1 < this.height) {
          const lines = this.horizontalLine(occupant, x1, x2, y1)
          debugLines = debugLines.concat(lines);
        }

        if (0 <= y2 && y2 < this.height) {
          const lines = this.horizontalLine(occupant, x1, x2, y2)
          debugLines = debugLines.concat(lines);
        }
      }
    }

    return debugLines;
  }

  horizontalLine(occupant: Occupant, x1: number, x2: number, y: number): [number[], number[]] {
    x1 = Math.max(x1, 0);
    x2 = Math.min(x2, this.width - 1);

    for (let x = x1; x <= x2; x += 1) {
      this.grid[y][x].occupants.push(occupant);
    }

    return [[x1, y], [x2, y]]
  }

  smoothPath(path: Vec2[]): Vec2[] {
    const smoothedPath: Vec2[] = [];

    if (path.length > 0) {
      // Push on first point of the path
      smoothedPath.push(path[0]);

      if (path.length > 2) {
        for (let i = 1; i < path.length - 1; i += 1) {
          const blocked = !this.LineOfSight(
            this.positionToGrid(smoothedPath[smoothedPath.length - 1]),
            this.positionToGrid(path[i + 1]),
          );

          if (blocked) {
            smoothedPath.push(path[i]);
          }
        }  
      }

      // Push on the last point of the path.
      smoothedPath.push(path[path.length - 1]);

      // path = path.slice(0, -1);
    }

    return smoothedPath;
  }

  positionToGrid(position: Vec2): Vec2 {
    return vec2.create(
      Math.floor(position[0] * this.scale + 0.5) + this.center[0],
      Math.floor(position[1] * this.scale + 0.5) + this.center[1],
    );
  }

  gridToPosition(position: Vec2): Vec2 {
    return vec2.create(
      (position[0] - this.center[0]) / this.scale,
      (position[1] - this.center[1]) / this.scale,
    );
  }
}

export default UniformGridSearch;
