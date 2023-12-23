import { Vec2, vec2 } from "wgpu-matrix";
import UniformGridSearch, { Element as Node } from "./UniformGridSearch";
import { feetToMeters, lineCircleIntersection2 } from "../Math";

class Set {
  private nodes: Node[] = [];

  push(v: Node) {
    this.nodes.push(v);
  }

  contains(v: Node): boolean {
    return this.nodes.some((c) => c.x === v.x && c.y === v.y)
  }

  empty(): boolean {
    return this.nodes.length === 0;
  }

  pop(): Node | null {
    return this.nodes.pop() ?? null;
  }

  sort() {
    this.nodes.sort((a, b) => (
      (b.gCost + b.hCost) - (a.gCost + a.hCost)
    ))
  }
}

class JumpPointSearch extends UniformGridSearch {
  goalNode: Node | null | undefined = null;

  findPath(s: Vec2, g: Vec2, target: Object): Vec2[] {
    const start = vec2.create(Math.floor(s[0] * this.scale + 0.5), Math.floor(s[1] * this.scale + 0.5))
    const goal = vec2.create(Math.floor(g[0] * this.scale + 0.5), Math.floor(g[1] * this.scale + 0.5))
    
    const openSet = new Set();
    const closedSet = new Set();

    this.goalNode = this.getNode(goal);

    if (!this.goalNode) {
      throw new Error('invalid goal node')
    }

    const startNode = this.getNode(start);

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

        if (currentNode === this.goalNode) {
          // Found goal
          let path: Vec2[] = [];

          while (currentNode) {
            path.push(vec2.create(currentNode.x / this.scale, currentNode.y / this.scale));
            currentNode = currentNode.parent
          }

          path = this.trimPath(path, g);

          // return this.smoothPath(path, target);
          return path;
        }

        const neighbors = this.getNeighbors(currentNode, target);

        for (const neighbor of neighbors) {
          const jumpPoint = this.findSuccessor(neighbor, currentNode, target);

          if (jumpPoint) {
            const cost = currentNode.gCost + this.costEstimate(
              currentNode.x, currentNode.y, jumpPoint.x, jumpPoint.y,
            );

            if (cost < jumpPoint.gCost) { // || !openSet.contains(neighborNode)) {
              jumpPoint.gCost = cost;
              jumpPoint.hCost = this.costEstimate(jumpPoint.x, jumpPoint.y, this.goalNode.x, this.goalNode.y);
              jumpPoint.parent = currentNode;

              if (!openSet.contains(jumpPoint)) {
                openSet.push(jumpPoint);
              }
            }
          }
        }
      }
    }

    return [];
  }

  trimPath(path: Vec2[], g: Vec2) {
    for (;;) {
      const result = lineCircleIntersection2(g, feetToMeters(2.5) * 2, path[0], path[1]);

      if (result === null || result.length === 1) {
        break;
      }

      if (result.length === 2) {
        const d1 = vec2.distance(result[0], g);
        const d2 = vec2.distance(result[1], g);

        if (Math.abs(d1 - feetToMeters(2.5) * 2) > 0.0001
          || Math.abs(d2 - feetToMeters(2.5) * 2) > 0.0001
        ) {
          console.log(`center: ${g}, radius: ${feetToMeters(2.5) * 2}`)
          console.log(`Points: ${path[0]}, ${path[1]}`)
          console.log(`dist 0: ${d1}`)
          console.log(`dist 1: ${d2}`)  
        }

        // console.log(`${path[0]} - ${path[1]}`)
        const v = vec2.subtract(path[1], path[0]);
        let v2 = vec2.subtract(result[0], path[0])

        let dotProduct = vec2.dot(v, v2);

        if (dotProduct < 0) {
          result[0] = result[1]
          v2 = vec2.subtract(result[0], path[0])
          dotProduct = vec2.dot(v, v2);
        }

        const squaredLength = vec2.lenSq(v);

        if (dotProduct < squaredLength) {
          lineCircleIntersection2(g, feetToMeters(2.5) * 2, path[0], path[1]);
          path[0] = result[0];
          break;
        }
        else {
          if (path.length === 2) {
            break;
          }

          path = path.slice(1);
        }
      }
    }

    return path;
  }

  findSuccessor(node: Node | null | undefined, prev: Node, target: Object): Node | null {
    if (!node) {
      return null;
    }

    if (this.nodeBlocked(node, target)) {
      return null;
    }

    if (node === this.goalNode) {
      return node;
    }

    const dx = node.x - prev.x;
    const dy = node.y - prev.y;

    if (dx !== 0 && dy !== 0) {
      // Diagonal travel
      const neighbor1 = this.getNode(vec2.create(node.x - dx, node.y + dy))
      const neighbor2 = this.getNode(vec2.create(node.x - dx, node.y))
      const neighbor3 = this.getNode(vec2.create(node.x + dx, node.y - dy))
      const neighbor4 = this.getNode(vec2.create(node.x, node.y - dy))

      if (
        (!this.nodeBlocked(neighbor1, target) && this.nodeBlocked(neighbor2, target))
        || (!this.nodeBlocked(neighbor3, target) && this.nodeBlocked(neighbor4, target))
      ) {
        return node;
      }

      const horizontal = this.getNode(vec2.create(node.x + dx, node.y));
      
      if (this.findSuccessor(horizontal, node, target)) {
        return node;
      }

      const vertical = this.getNode(vec2.create(node.x, node.y + dy));
      if (this.findSuccessor(vertical, node, target)) {
        return node;
      }
    }
    else if (dx !== 0) {
      // Horizontal travel

      // If the node above/below is blocked but the one forward and above/below is not
      // then add the current node as a jump point.
      const neighbor1 = this.getNode(vec2.create(node.x, node.y + 1))
      const neighbor2 = this.getNode(vec2.create(node.x + dx, node.y + 1))
      const neighbor3 = this.getNode(vec2.create(node.x, node.y - 1))
      const neighbor4 = this.getNode(vec2.create(node.x + dx, node.y - 1))
      if (
        (this.nodeBlocked(neighbor1, target) && !this.nodeBlocked(neighbor2, target))
        || (this.nodeBlocked(neighbor3, target) && !this.nodeBlocked(neighbor4, target))
      ) {
        return node;
      }
    }
    else {
      // Vertical travel

      // If the node left/righ is blocked but the one forward and left/right is not
      // then add the current node as a jump point.
      const neighbor1 = this.getNode(vec2.create(node.x + 1, node.y))
      const neighbor2 = this.getNode(vec2.create(node.x + 1, node.y + dy))
      const neighbor3 = this.getNode(vec2.create(node.x - 1, node.y))
      const neighbor4 = this.getNode(vec2.create(node.x - 1, node.y + dy))
      if (
        (this.nodeBlocked(neighbor1, target) && !this.nodeBlocked(neighbor2, target))
        || (this.nodeBlocked(neighbor3, target) && !this.nodeBlocked(neighbor4, target))
      ) {
        return node;
      }
    }

    const next = this.getNode(vec2.create(node.x + dx, node.y + dy))
    return this.findSuccessor(next, node, target)
  }

  getNeighbors(node: Node, target: Object): Node[] {
    const neighbors: Node[] = [];

    if (node.parent) {
      // Get normalized directions of travel.
      const dx = (node.x - node.parent.x) / Math.max(Math.abs(node.x - node.parent.x), 1);
      const dy = (node.y - node.parent.y) / Math.max(Math.abs(node.y - node.parent.y), 1);

      if (dx !== 0 && dy !== 0) {
        // Diagonal travel
        let neighbor = this.getNode(vec2.create(node.x + dx, node.y + dy));
        if (neighbor && !this.nodeBlocked(neighbor, target)) {
          neighbors.push(neighbor);
        }

        neighbor = this.getNode(vec2.create(node.x, node.y + dy));
        if (neighbor && !this.nodeBlocked(neighbor, target)) {
          neighbors.push(neighbor);
        }

        neighbor = this.getNode(vec2.create(node.x + dx, node.y));
        if (neighbor && !this.nodeBlocked(neighbor, target)) {
          neighbors.push(neighbor);
        }

        neighbor = this.getNode(vec2.create(node.x - dx, node.y));
        if (neighbor && this.nodeBlocked(neighbor, target)) {
          neighbor = this.getNode(vec2.create(node.x - dx, node.y + dy));

          if (neighbor) {
            neighbors.push(neighbor)
          }
        }

        neighbor = this.getNode(vec2.create(node.x, node.y - dy));
        if (neighbor && this.nodeBlocked(neighbor, target)) {
          neighbor = this.getNode(vec2.create(node.x + dx, node.y - dy));

          if (neighbor) {
            neighbors.push(neighbor)
          }
        }
      }
      else if (dx !== 0) {
        // Horizontal travel
        let neighbor = this.getNode(vec2.create(node.x + dx, node.y));
        if (neighbor && !this.nodeBlocked(neighbor, target)) {
          neighbors.push(neighbor);
        }

        neighbor = this.getNode(vec2.create(node.x, node.y + 1));
        if (neighbor && this.nodeBlocked(neighbor, target)) {
          let neighbor = this.getNode(vec2.create(node.x + dx, node.y + 1));

          if (neighbor) {
            neighbors.push(neighbor);
          }
        }

        neighbor = this.getNode(vec2.create(node.x, node.y - 1));
        if (neighbor && this.nodeBlocked(neighbor, target)) {
          let neighbor = this.getNode(vec2.create(node.x + dx, node.y - 1));

          if (neighbor) {
            neighbors.push(neighbor);
          }
        }
      }
      else {
        // Vertical travel
        let neighbor = this.getNode(vec2.create(node.x, node.y + dy));
        if (neighbor && !this.nodeBlocked(neighbor, target)) {
          neighbors.push(neighbor);
        }

        neighbor = this.getNode(vec2.create(node.x + 1, node.y));
        if (neighbor && this.nodeBlocked(neighbor, target)) {
          let neighbor = this.getNode(vec2.create(node.x + 1, node.y + dy));

          if (neighbor) {
            neighbors.push(neighbor);
          }
        }

        neighbor = this.getNode(vec2.create(node.x - 1, node.y));
        if (neighbor && this.nodeBlocked(neighbor, target)) {
          let neighbor = this.getNode(vec2.create(node.x - 1, node.y + dy));

          if (neighbor) {
            neighbors.push(neighbor);
          }
        }
      }
    }
    else {
      for (let y = -1; y <= 1; y += 1) {
        for (let x = -1; x <= 1; x += 1) {
          if (x !== 0 || y !== 0) {
            const neighbor = this.getNode(vec2.create(node.x + x, node.y + y));

            if (neighbor && !this.nodeBlocked(neighbor, target)) {
              neighbors.push(neighbor)
            }
          }
        }
      }
    }

    return neighbors;
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

// export const jumpPoint = new JumpPointSearch(512, 512, 16);

// const object = {};
// const object2 = {};
// const start = vec2.create(0, 4)
// const goal = vec2.create(0, -4);

// console.log(`start = ${start}`)
// console.log(`goal = ${goal}`)
// // jumpPoint.fillCircle(object, vec2.create(0, 0), 2);
// jumpPoint.grid[jumpPoint.center[1]][jumpPoint.center[0]].actors.push(object);

// const path = jumpPoint.findPath(start, goal, object2)

// console.log(`path length: ${path.length}`)
// for (const p of path) {
//   console.log(`${p}`)
// }

// const actor = {} as Actor;
// pf.grid[Math.floor(5 * pf.scale) + pf.center[0]][Math.floor(3 * pf.scale) + pf.center[1]].actors.push(actor);

// const path = pf.findPath(vec2.create(0, 0), vec2.create(5, 3), actor);

// for (const p of path) {
//   console.log(`${p}`);
// }

export default JumpPointSearch;
