import { Vec2, vec2 } from "wgpu-matrix";
import Actor from "./Character/Actor";

type Element = {
  x: number,
  y: number,
  gCost: number,
  hCost: number,
  actors: Actor[],
  parent: Element | null,
}

class Set {
  private nodes: Element[] = [];

  push(v: Element) {
    this.nodes.push(v);
  }

  contains(v: Element): boolean {
    return this.nodes.some((c) => c.x === v.x && c.y === v.y)
  }

  empty(): boolean {
    return this.nodes.length === 0;
  }

  pop(): Element | null {
    return this.nodes.pop() ?? null;
  }

  sort() {
    this.nodes.sort((a, b) => (
      (b.gCost + b.hCost) - (a.gCost + a.hCost)
    ))
  }
}

class PathFinder {
  grid: Element[][];

  width: number;
  
  height: number;

  center: Vec2;

  scale: number;

  constructor(width: number, height: number, scale: number) {
    this.scale = scale;

    const xOffset = Math.floor(width / 2);
    const yOffset = Math.floor(height / 2);

    this.grid = Array.from({ length: height }, (_, y) => (
      Array.from({ length: width }, (_, x) => ({ x: x - xOffset, y: y - yOffset, gCost: 0, hCost: 0, actors: [], parent: null }))
    ))

    this.width = width;
    this.height = height;

    this.center = vec2.create(Math.trunc(width / 2), Math.trunc(height / 2))

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

  getNode(v: Vec2) {
    return this.grid[v[1] + this.center[0]][v[0] + this.center[0]]
  }

  findPath(s: Vec2, g: Vec2, target: Actor): Vec2[] {
    const start = vec2.create(Math.floor(s[0] * this.scale + 0.5), Math.floor(s[1] * this.scale + 0.5))
    const goal = vec2.create(Math.floor(g[0] * this.scale + 0.5), Math.floor(g[1] * this.scale + 0.5))
    
    const openSet = new Set();
    const closedSet = new Set();

    const goalNode = this.getNode(goal);

    const startNode = this.getNode(start);
    startNode.gCost = 0;
    // startNode.hCost = this.costEstimate(startNode.x, startNode.y, goalNode.x, goalNode.y);

    openSet.push(startNode);

    while (!openSet.empty()) {
      openSet.sort();

      let currentNode = openSet.pop();

      if (currentNode) {
        closedSet.push(currentNode);

        // const currentNode = this.getNode(currentNode);

        if (currentNode.actors.length === 1 && currentNode.actors[0] === target) {
          // Found goal
          const path: Vec2[] = [];

          while (currentNode) {
            path.push(vec2.create(currentNode.x / this.scale, currentNode.y / this.scale));
            currentNode = currentNode.parent
          }

          return path; // .reverse();
        }

        for (let y = -1; y <= 1; y += 1) {
          for (let x = -1; x <= 1; x += 1) {
            if (x === 0 && y === 0) {
              continue;
            }

            if (
              x + currentNode.x + this.center[0] >= 0
              && x + currentNode.x + this.center[0] < this.width
              && y + currentNode.y + this.center[1] >= 0
              && y + currentNode.y + this.center[1] < this.height
            ) {
              const neighbor = vec2.create(currentNode.x + x, currentNode.y + y);
              const neighborNode = this.getNode(neighbor);

              if (
                (neighborNode.actors.length > 0
                && (neighborNode.actors.length !== 1 || neighborNode.actors[0] !== target))
                || closedSet.contains(neighborNode)
              ) {
                continue;
              }

              const cost = currentNode.gCost + this.costEstimate(
                currentNode.x, currentNode.y, neighborNode.x, neighborNode.y,
              );

              if (cost < neighborNode.gCost) { // || !openSet.contains(neighborNode)) {
                neighborNode.gCost = cost;
                neighborNode.hCost = this.costEstimate(neighborNode.x, neighborNode.y, goalNode.x, goalNode.y);
                neighborNode.parent = currentNode;

                if (!openSet.contains(neighborNode)) {
                  openSet.push(neighborNode);
                }
              }
            }
          }
        }
      }
    }

    return [];
  }

  costEstimate(x1: number, y1: number, x2: number, y2: number): number {
    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);
  
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    // if (deltaX > deltaY) {
    //   return 14 * deltaY + 10 * (deltaX - deltaY);
    // }

    // return 14 * deltaX + 10 * (deltaY - deltaX);
  }

  fillCircle(actor: Actor, c: Vec2, r: number) {
    const center = vec2.create(Math.floor(c[0] * this.scale + 0.5), Math.floor(c[1] * this.scale + 0.5))
    const radius = Math.floor(r * this.scale + 0.5);

    const offset = vec2.add(center, this.center);

    let x = radius;
    let y = 0;
  
    // (-radius, 0) and (radius, 0) points.
    if (0 <= y + offset[1] && y + offset[1] < this.height) {
      if (0 <= x + offset[0] && x + offset[0] < this.width) {
        this.grid[y + offset[1]][x + offset[0]].actors.push(actor);
      }

      if (0 <= -x + offset[0] && -x + offset[0] < this.width) {
        this.grid[y + offset[1]][-x + offset[0]].actors.push(actor);
      }
    }

    // (0, -radius) and (0, radius) points
    if (0 <= y + offset[0] && y + offset[0] < this.width) {
      if (0 <= x + offset[1] && x + offset[1] < this.height) {
        this.grid[x + offset[1]][y + offset[0]].actors.push(actor);
      }

      if (0 <= -x + offset[1] && -x + offset[1] < this.height) {
        this.grid[-x + offset[1]][y + offset[0]].actors.push(actor);
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
        p = p + 2 & y - 2 * x + 1;
      }
  
      if (x < y) {
        break;
      }
  
      if (0 <= y + offset[1] && y + offset[1] < this.height) {
        this.horizontalLine(actor, -x + offset[0], x + offset[0], y + offset[1])
      }

      if (0 <= -y + offset[1] && -y + offset[1] < this.height) {
        this.horizontalLine(actor, -x + offset[0], x + offset[0], -y + offset[1])
      }

      if (x !== y) {
        if (0 < x + offset[1] && x + offset[1] < this.height) {
          this.horizontalLine(actor, -y + offset[0], y + offset[0], x + offset[1])
        }

        if (0 < -x + offset[1] && -x + offset[1] < this.height) {
          this.horizontalLine(actor, -y + offset[0], y + offset[0], -x + offset[1])
        }
      }
    }
  }

  horizontalLine(actor: Actor, x1: number, x2: number, y: number) {
    x1 = Math.max(x1, 0);
    x2 = Math.min(x2, this.width - 1);

    for (let x = x1; x <= x2; x += 1) {
      this.grid[y][x].actors.push(actor);
    }
  }
}

export const pf = new PathFinder(512, 512, 16);

// const actor = {} as Actor;
// pf.grid[Math.floor(5 * pf.scale) + pf.center[0]][Math.floor(3 * pf.scale) + pf.center[1]].actors.push(actor);

// const path = pf.findPath(vec2.create(0, 0), vec2.create(5, 3), actor);

// for (const p of path) {
//   console.log(`${p}`);
// }

export default PathFinder;
