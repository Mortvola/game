import { Vec2, vec2 } from "wgpu-matrix";
import UniformGridSearch from "./UniformGridSearch";
import { lineCircleIntersection } from "../Renderer/Math";
import { GridNode } from "./GridNode";
import GridNodeSet from "./GridNodeSet";
import { Occupant } from "../Workers/PathPlannerTypes";

class JumpPointSearch extends UniformGridSearch {
  goalNode: GridNode | null | undefined = null;

  lines2: Vec2[] = [];

  findPath(s: Vec2, g: Vec2, goalRadius: number | null, target: Occupant | null, ignoreTerrain = false): Vec2[] {
    this.target = target;

    this.ignoreTerrain = ignoreTerrain;

    this.ignore = [];
    if (target) {
      this.ignore = [target.id];
    }

    this.lines = [];
    this.lines2 = [];

    const start = this.positionToGrid(s);
    const goal = this.positionToGrid(g);

    const gn = this.getNode(goal[0], goal[1]);

    if (!gn) {
      return [];
    }

    const openSet = new GridNodeSet();
    const closedSet = new GridNodeSet();

    this.goalNode = this.getNode(goal[0], goal[1]);

    if (!this.goalNode) {
      throw new Error('invalid goal node')
    }

    const startNode = this.getNode(start[0], start[1]);

    if (!startNode) {
      throw new Error('invalid start node')
    }

    startNode.gCost = 0;

    openSet.push(startNode);

    while (this.nodeBlocked(startNode)) {
      this.ignore = this.ignore.concat(startNode.occupants.map((o) => o.id))
    }

    while (!openSet.empty()) {
      openSet.sort();

      let currentNode = openSet.pop();

      if (currentNode) {
        closedSet.push(currentNode);

        if (currentNode === this.goalNode) {
          // Found goal
          let path: Vec2[] = [];

          while (currentNode) {
            path.push(this.gridToPosition(vec2.create(currentNode.x, currentNode.y)));
            currentNode = currentNode.parent
          }
          
          for (;;) {
            const l = path.length;
            path = this.smoothPath(path);

            if (path.length === l) {
              break;
            }
          }

          if (goalRadius) {
            if (path.length < 2) {
              console.log('malformed path');
            }

            path = this.trimPath(path, g, goalRadius);
          }

          return path;
          // return path;
        }

        const neighbors = this.getNeighbors(currentNode);

        for (const neighbor of neighbors) {
          const jumpPoint = this.findSuccessor(neighbor, currentNode);

          if (jumpPoint) {
            const cost = currentNode.gCost + this.costEstimate(
              currentNode.x, currentNode.y, jumpPoint.x, jumpPoint.y,
            );

            if (cost < jumpPoint.gCost) { // || !openSet.contains(neighborNode)) {
              jumpPoint.gCost = cost;
              jumpPoint.hCost = this.costEstimate(jumpPoint.x, jumpPoint.y, this.goalNode.x, this.goalNode.y);
              jumpPoint.parent = currentNode;

              // this.lines.push(vec4.create(jumpPoint.x / this.scale, 0.01, jumpPoint.y / this.scale, 1));
              // this.lines.push(vec4.create(currentNode.x / this.scale, 0.01, currentNode.y / this.scale, 1));

              // this.lines2.push(vec2.create(jumpPoint.x / this.scale, jumpPoint.y / this.scale));
              // this.lines2.push(vec2.create(currentNode.x / this.scale, currentNode.y / this.scale));

              if (!openSet.contains(jumpPoint)) {
                openSet.push(jumpPoint);
              }
            }
          }
        }
      }
    }

    // for (const p of closedSet.nodes) {
    //   console.log(`${p.x}, ${p.y}`)
    // }

    return [];
  }

  trimPath(path: Vec2[], g: Vec2, goalRadius: number) {
    for (;;) {
      if (path.length < 2) {
        console.log('path is too short')
        break;
      }

      const result = lineCircleIntersection(g, goalRadius, path[0], path[1]);

      if (result === null || result.length === 1) {
        break;
      }

      if (result.length === 2) {
        // const d1 = vec2.distance(result[0], g);
        // const d2 = vec2.distance(result[1], g);

        // if (Math.abs(d1 - feetToMeters(2.5) * 2) > 0.0001
        //   || Math.abs(d2 - feetToMeters(2.5) * 2) > 0.0001
        // ) {
        //   console.log(`center: ${g}, radius: ${feetToMeters(2.5) * 2}`)
        //   console.log(`Points: ${path[0]}, ${path[1]}`)
        //   console.log(`dist 0: ${d1}`)
        //   console.log(`dist 1: ${d2}`)  
        // }

        // console.log(`${path[0]} - ${path[1]}`)
        const v1 = vec2.subtract(path[1], path[0]);
        let v2 = vec2.subtract(result[0], path[0])

        let dotProduct = vec2.dot(v1, v2);

        if (dotProduct < 0) {
          result[0] = result[1]
          v2 = vec2.subtract(result[0], path[0])
          dotProduct = vec2.dot(v1, v2);
        }

        const squaredLength = vec2.lenSq(v1);

        if (dotProduct < squaredLength) {
          // lineCircleIntersection(g, feetToMeters(2.5) * 2, path[0], path[1]);
          path[0] = result[0];

          const t = this.positionToGrid(path[0]);
          if (this.nodeBlocked(t[0], t[1])) {
            console.log('**** still blocked ***');
          }

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

  findSuccessor(node: GridNode | null | undefined, prev: GridNode): GridNode | null {
    if (!node) {
      return null;
    }

    if (this.nodeBlocked(node)) {
      return null;
    }

    if (node === this.goalNode) {
      return node;
    }

    const dx = node.x - prev.x;
    const dy = node.y - prev.y;

    if (dx !== 0 && dy !== 0) {
      // Diagonal travel
      if (
        (!this.nodeBlocked(node.x - dx, node.y + dy) && this.nodeBlocked(node.x - dx, node.y))
        || (!this.nodeBlocked(node.x + dx, node.y - dy) && this.nodeBlocked(node.x, node.y - dy))
      ) {
        return node;
      }

      const horizontal = this.getNode(node.x + dx, node.y);
      
      if (this.findSuccessor(horizontal, node)) {
        return node;
      }

      const vertical = this.getNode(node.x, node.y + dy);
      if (this.findSuccessor(vertical, node)) {
        return node;
      }
    }
    else if (dx !== 0) {
      // Horizontal travel

      // If the node above/below is blocked but the one forward and above/below is not
      // then add the current node as a jump point.
      if (
        (this.nodeBlocked(node.x, node.y + 1) && !this.nodeBlocked(node.x + dx, node.y + 1))
        || (this.nodeBlocked(node.x, node.y - 1) && !this.nodeBlocked(node.x + dx, node.y - 1))
      ) {
        return node;
      }
    }
    else {
      // Vertical travel

      // If the node left/righ is blocked but the one forward and left/right is not
      // then add the current node as a jump point.
      if (
        (this.nodeBlocked(node.x + 1, node.y) && !this.nodeBlocked(node.x + 1, node.y + dy))
        || (this.nodeBlocked(node.x - 1, node.y) && !this.nodeBlocked(node.x - 1, node.y + dy))
      ) {
        return node;
      }
    }

    const next = this.getNode(node.x + dx, node.y + dy)
    return this.findSuccessor(next, node)
  }

  getNeighbors(node: GridNode): GridNode[] {
    const neighbors: GridNode[] = [];

    // Is this node the starting node?
    if (node.parent) {
      // Not the starting node.

      // Get normalized directions of travel.
      const dx = (node.x - node.parent.x) / Math.max(Math.abs(node.x - node.parent.x), 1);
      const dy = (node.y - node.parent.y) / Math.max(Math.abs(node.y - node.parent.y), 1);

      if (dx !== 0 && dy !== 0) {
        // Diagonal travel
        let neighbor = this.getNode(node.x + dx, node.y + dy);
        if (neighbor && !this.nodeBlocked(neighbor)) {
          neighbors.push(neighbor);
        }

        neighbor = this.getNode(node.x, node.y + dy);
        if (neighbor && !this.nodeBlocked(neighbor)) {
          neighbors.push(neighbor);
        }

        neighbor = this.getNode(node.x + dx, node.y);
        if (neighbor && !this.nodeBlocked(neighbor)) {
          neighbors.push(neighbor);
        }

        if (this.nodeBlocked(node.x - dx, node.y)) {
          neighbor = this.getNode(node.x - dx, node.y + dy);

          if (neighbor) {
            neighbors.push(neighbor)
          }
        }

        if (this.nodeBlocked(node.x, node.y - dy)) {
          neighbor = this.getNode(node.x + dx, node.y - dy);

          if (neighbor) {
            neighbors.push(neighbor)
          }
        }
      }
      else if (dx !== 0) {
        // Horizontal travel
        let neighbor = this.getNode(node.x + dx, node.y);
        if (neighbor && !this.nodeBlocked(neighbor)) {
          neighbors.push(neighbor);
        }

        if (this.nodeBlocked(node.x, node.y + 1)) {
          let neighbor = this.getNode(node.x + dx, node.y + 1);

          if (neighbor) {
            neighbors.push(neighbor);
          }
        }

        if (this.nodeBlocked(node.x, node.y - 1)) {
          let neighbor = this.getNode(node.x + dx, node.y - 1);

          if (neighbor) {
            neighbors.push(neighbor);
          }
        }
      }
      else {
        // Vertical travel
        let neighbor = this.getNode(node.x, node.y + dy);
        if (neighbor && !this.nodeBlocked(neighbor)) {
          neighbors.push(neighbor);
        }

        if (neighbor && this.nodeBlocked(node.x + 1, node.y)) {
          let neighbor = this.getNode(node.x + 1, node.y + dy);

          if (neighbor) {
            neighbors.push(neighbor);
          }
        }

        if (neighbor && this.nodeBlocked(node.x - 1, node.y)) {
          let neighbor = this.getNode(node.x - 1, node.y + dy);

          if (neighbor) {
            neighbors.push(neighbor);
          }
        }
      }
    }
    else {
      // Node is the starting node
      for (let y = -1; y <= 1; y += 1) {
        for (let x = -1; x <= 1; x += 1) {
          if (x !== 0 || y !== 0) {
            const neighbor = this.getNode(node.x + x, node.y + y);

            if (neighbor && !this.nodeBlocked(neighbor)) {
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

// circle: -2.0625, 4.286639213562012, r: 1.524
// circle: 2.6785852909088135, 12.96423053741455, r: 1.524
// start: -2.6876509189605713, -12.308565139770508, 
// goal: -2.0802900791168213, 5.810535430908203, 

// const jumpPoint = new JumpPointSearch(512, 512, 16);

// const center1 = vec2.create(-2.0625, 4.286639213562012);
// const center2 = vec2.create(2.6785852909088135, 12.96423053741455);
// const radius = 1.46875;

// jumpPoint.fillCircle({}, center1, radius)
// jumpPoint.fillCircle({}, center2, radius);

// const s = vec2.create(-2.6876509189605713, -12.308565139770508);
// const g = vec2.create(-2.0802900791168213, 5.810535430908203);

// console.log(`distance s to 1: ${vec2.distance(center1, s)}`)
// console.log(`distance s to 2: ${vec2.distance(center2, s)}`)

// console.log(`distance g to 1: ${vec2.distance(center1, g)}`)
// console.log(`distance g to 2: ${vec2.distance(center2, g)}`)

// const result = jumpPoint.findPath(s, g, {})
// console.log(result);

// const result2 = jumpPoint.findPath(g, s, {})
// console.log(result2);

export default JumpPointSearch;
