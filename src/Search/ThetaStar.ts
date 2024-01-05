import { Vec2, vec2 } from "wgpu-matrix";
import UniformGridSearch, { Element } from "./UniformGridSearch";

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

class ThetaStarSearch extends UniformGridSearch {
  findPath(s: Vec2, g: Vec2, goalRadius: number | null, target: { id: number }): Vec2[] {
    const start = this.positionToGrid(s);
    const goal =this.positionToGrid(g);
    
    const openSet = new Set();
    const closedSet = new Set();

    const goalNode = this.getNode(goal[0], goal[1]);

    if (!goalNode) {
      throw new Error('invalid goal node')
    }

    const startNode = this.getNode(start[0], start[1]);

    if (!startNode) {
      throw new Error('invalid start node')
    }

    startNode.gCost = 0;

    openSet.push(startNode);

    while (!openSet.empty()) {
      openSet.sort();

      let currentNode = openSet.pop();

      if (currentNode) {
        closedSet.push(currentNode);

        if (currentNode.actors.length === 1 && currentNode.actors[0] === target) {
          // Found goal
          const path: Vec2[] = [];

          while (currentNode) {
            path.push(this.gridToPosition(vec2.create(currentNode.x, currentNode.y)));
            currentNode = currentNode.parent
          }

          return path;
        }

        for (let y = -1; y <= 1; y += 1) {
          for (let x = -1; x <= 1; x += 1) {
            if (x === 0 && y === 0) {
              continue;
            }

            if (
              x + currentNode.x >= 0
              && x + currentNode.x < this.width
              && y + currentNode.y >= 0
              && y + currentNode.y < this.height
            ) {
              const neighbor = vec2.create(currentNode.x + x, currentNode.y + y);
              const neighborNode = this.getNode(neighbor[0], neighbor[1]);

              if (
                !neighborNode
                || this.nodeBlocked(neighborNode)
                || closedSet.contains(neighborNode)
              ) {
                continue;
              }

              if (currentNode.parent && this.LineOfSight(
                vec2.create(currentNode.parent.x, currentNode.parent.y),
                vec2.create(neighborNode.x, neighborNode.y),
              )) {
                const cost = currentNode.parent.gCost + this.costEstimate(
                  currentNode.parent.x, currentNode.parent.y, neighborNode.x, neighborNode.y,
                );
      
                if (cost < neighborNode.gCost) { // || !openSet.contains(neighborNode)) {
                  neighborNode.gCost = cost;
                  neighborNode.hCost = this.costEstimate(neighborNode.x, neighborNode.y, goalNode.x, goalNode.y);
                  neighborNode.parent = currentNode.parent;

                  if (!openSet.contains(neighborNode)) {
                    openSet.push(neighborNode);
                  }
                }
              } else {
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
}

// export const thetaStar = new ThetaStar(512, 512, 16);

// const actor = {} as Actor;
// pf.grid[Math.floor(5 * pf.scale) + pf.center[0]][Math.floor(3 * pf.scale) + pf.center[1]].actors.push(actor);

// const path = pf.findPath(vec2.create(0, 0), vec2.create(5, 3), actor);

// for (const p of path) {
//   console.log(`${p}`);
// }

export default ThetaStarSearch;
