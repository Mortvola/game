import { Vec2, Vec4, vec2, vec4 } from "wgpu-matrix";
import Actor from "../Character/Actor";
import { circleRectangleIntersectionTest, lineCircleIntersection, lineRectangleClip } from "../Renderer/Math";

enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

type Node = {
  upperLeft: Vec2,
  lowerRight: Vec2,
  children: Node[],
  actors: Actor[],
  level: number,
  neighbors: Node[][],

  gCost: number,
  hCost: number,

  parent: Node | null,
}

class Set {
  private nodes: Node[] = [];

  push(v: Node) {
    this.nodes.push(v);
  }

  contains(v: Node): boolean {
    return this.nodes.some((c) => c === v)
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

class QuadTree {
  root: Node;

  maxLevel: number;

  lines: Vec4[];

  occupied: Vec4[];

  blocked: Vec4[];

  path: Vec4[] = [];

  smoothedPath: Vec4[] = [];

  searcher: Actor;

  constructor(dimension: number, searcher: Actor, actors: Actor[], maxLevel: number) {
    this.maxLevel = maxLevel;
    this.searcher = searcher;

    this.root = {
      upperLeft: vec2.create(-dimension / 2, dimension / 2),
      lowerRight: vec2.create(dimension / 2, -dimension / 2),
      children: [],
      actors,
      level: 0,
      neighbors: [],
      gCost: Number.MAX_VALUE,
      hCost: Number.MAX_VALUE,
      parent: null,
    }

    const results = this.subdivide(this.root);
    this.lines = results[0];
    this.occupied = results[1];
    this.blocked = results[2];
  }

  actorIntersections(actors: Actor[], upperLeft: Vec2, lowerRight: Vec2): Actor[] {
    const intersectedActors: Actor[] = [];

    for (const actor of actors) {
      const center = actor.getWorldPosition();
      const radius = actor.attackRadius * 2;

      // console.log(`center: ${center}`)

      const intersected = circleRectangleIntersectionTest(vec2.create(center[0], center[2]), radius, upperLeft, lowerRight);

      if (intersected) {
        intersectedActors.push(actor);
      }
    }

    return intersectedActors;
  }

  subdivide(node: Node): [Vec4[], Vec4[], Vec4[]] {
    const lines: Vec4[] = [];
    const occupied: Vec4[] = [];
    const blocked: Vec4[] = [];

    if (node.level < this.maxLevel && node.actors.length > 0) {
      const center = vec2.create(
        (node.lowerRight[0] + node.upperLeft[0]) / 2,
        (node.upperLeft[1] + node.lowerRight[1]) / 2,
      )

      let upperLeft = node.upperLeft;
      let lowerRight = center;

      const upperLeftNode: Node = {
        upperLeft,
        lowerRight,
        children: [],
        actors: this.actorIntersections(node.actors, upperLeft, lowerRight),
        level: node.level + 1,
        neighbors: [[], [], [], []],
        gCost: Number.MAX_VALUE,
        hCost: Number.MAX_VALUE,
        parent: null,
      }

      upperLeft = vec2.create(center[0], node.upperLeft[1]);
      lowerRight = vec2.create(node.lowerRight[0], center[1]);

      const upperRightNode: Node = {
        upperLeft,
        lowerRight,
        children: [],
        actors: this.actorIntersections(node.actors, upperLeft, lowerRight),
        level: node.level + 1,
        neighbors: [[], [], [], []],
        gCost: Number.MAX_VALUE,
        hCost: Number.MAX_VALUE,
        parent: null,
      }

      upperLeft = vec2.create(node.upperLeft[0], center[1]);
      lowerRight = vec2.create(center[0], node.lowerRight[1]);

      const lowerLeftNode: Node = {
        upperLeft,
        lowerRight,
        children: [],
        actors: this.actorIntersections(node.actors, upperLeft, lowerRight),
        level: node.level + 1,
        neighbors: [[], [], [], []],
        gCost: Number.MAX_VALUE,
        hCost: Number.MAX_VALUE,
        parent: null,
      }

      upperLeft = center;
      lowerRight = node.lowerRight;

      const lowerRightNode: Node = {
        upperLeft,
        lowerRight,
        children: [],
        actors: this.actorIntersections(node.actors, upperLeft, lowerRight),
        level: node.level + 1,
        neighbors: [[], [], [], []],
        gCost: Number.MAX_VALUE,
        hCost: Number.MAX_VALUE,
        parent: null,
      }

      upperLeftNode.neighbors[Direction.East].push(upperRightNode);
      upperLeftNode.neighbors[Direction.South].push(lowerLeftNode);

      upperRightNode.neighbors[Direction.West].push(upperLeftNode);
      upperRightNode.neighbors[Direction.South].push(lowerRightNode);

      lowerLeftNode.neighbors[Direction.North].push(upperLeftNode);
      lowerLeftNode.neighbors[Direction.East].push(lowerRightNode);
      
      lowerRightNode.neighbors[Direction.West].push(lowerLeftNode);
      lowerRightNode.neighbors[Direction.North].push(upperRightNode);


      if (node.neighbors.length > 0) {
        // Find which of the children nodes share edges with
        // the parent's neightbors and add them
        // as neighbors to the child.
        for (const neighbor of node.neighbors[Direction.North]) {
          // Remove the current node as a neighbor
          const index = neighbor.neighbors[Direction.South].findIndex((n) => n === node);
          if (index !== -1) {
            neighbor.neighbors[Direction.South] = [
              ...neighbor.neighbors[Direction.South].slice(0, index),
              ...neighbor.neighbors[Direction.South].slice(index + 1),
            ]
          }

          if (
            neighbor.lowerRight[0] >= upperLeftNode.upperLeft[0]
            && neighbor.upperLeft[0] <= upperLeftNode.lowerRight[0]
          ) {
            upperLeftNode.neighbors[Direction.North].push(neighbor);
            neighbor.neighbors[Direction.South].push(upperLeftNode);
          }

          if (
            neighbor.lowerRight[0] >= upperRightNode.upperLeft[0]
            && neighbor.upperLeft[0] <= upperRightNode.lowerRight[0]
          ) {
            upperRightNode.neighbors[Direction.North].push(neighbor);
            neighbor.neighbors[Direction.South].push(upperRightNode);
          }
        }

        for (const neighbor of node.neighbors[Direction.South]) {
          // Remove the current node as a neighbor
          const index = neighbor.neighbors[Direction.North].findIndex((n) => n === node);
          if (index !== -1) {
            neighbor.neighbors[Direction.North] = [
              ...neighbor.neighbors[Direction.North].slice(0, index),
              ...neighbor.neighbors[Direction.North].slice(index + 1),
            ]
          }

          if (
            neighbor.lowerRight[0] >= lowerLeftNode.upperLeft[0]
            && neighbor.upperLeft[0] <= lowerLeftNode.lowerRight[0]
          ) {
            lowerLeftNode.neighbors[Direction.South].push(neighbor);
            neighbor.neighbors[Direction.North].push(lowerLeftNode);
          }

          if (
            neighbor.lowerRight[0] >= lowerRightNode.upperLeft[0]
            && neighbor.upperLeft[0] <= lowerRightNode.lowerRight[0]
          ) {
            lowerRightNode.neighbors[Direction.South].push(neighbor);
            neighbor.neighbors[Direction.North].push(lowerRightNode);
          }
        }

        for (const neighbor of node.neighbors[Direction.East]) {
          // Remove the current node as a neighbor
          const index = neighbor.neighbors[Direction.West].findIndex((n) => n === node);
          if (index !== -1) {
            neighbor.neighbors[Direction.West] = [
              ...neighbor.neighbors[Direction.West].slice(0, index),
              ...neighbor.neighbors[Direction.West].slice(index + 1),
            ]
          }

          if (
            neighbor.upperLeft[1] >= upperRightNode.lowerRight[1]
            && neighbor.lowerRight[1] <= upperRightNode.upperLeft[1]
          ) {
            upperRightNode.neighbors[Direction.East].push(neighbor);
            neighbor.neighbors[Direction.West].push(upperRightNode);
          }

          if (
            neighbor.upperLeft[1] >= lowerRightNode.lowerRight[1]
            && neighbor.lowerRight[1] <= lowerRightNode.upperLeft[1]
          ) {
            lowerRightNode.neighbors[Direction.East].push(neighbor);
            neighbor.neighbors[Direction.West].push(lowerRightNode);
          }
        }

        for (const neighbor of node.neighbors[Direction.West]) {
          // Remove the current node as a neighbor
          const index = neighbor.neighbors[Direction.East].findIndex((n) => n === node);
          if (index !== -1) {
            neighbor.neighbors[Direction.East] = [
              ...neighbor.neighbors[Direction.East].slice(0, index),
              ...neighbor.neighbors[Direction.East].slice(index + 1),
            ]
          }

          if (
            neighbor.upperLeft[1] >= upperLeftNode.lowerRight[1]
            && neighbor.lowerRight[1] <= upperLeftNode.upperLeft[1]
          ) {
            upperLeftNode.neighbors[Direction.West].push(neighbor);
            neighbor.neighbors[Direction.East].push(upperLeftNode);
          }

          if (
            neighbor.upperLeft[1] >= lowerLeftNode.lowerRight[1]
            && neighbor.lowerRight[1] <= lowerLeftNode.upperLeft[1]
          ) {
            lowerLeftNode.neighbors[Direction.West].push(neighbor);
            neighbor.neighbors[Direction.East].push(lowerLeftNode);
          }
        }

        // Only leaves have neighbors
        node.neighbors = [];
      }

      node.children = [
        upperLeftNode,
        upperRightNode,
        lowerLeftNode,
        lowerRightNode,
      ]

      for (const child of node.children) {
        if (child) {
          let l = this.subdivide(child);

          lines.push(...l[0]);
          occupied.push(...l[1])
          blocked.push(...l[2]);
        }
      }
    } else {
      node.actors = node.actors.filter((a) => a !== this.searcher);

      if (node.actors.length === 0) {
        lines.push(vec4.create(node.upperLeft[0], 0, node.upperLeft[1], 1))
        lines.push(vec4.create(node.lowerRight[0], 0, node.upperLeft[1], 1))
  
        lines.push(vec4.create(node.lowerRight[0], 0, node.upperLeft[1], 1))
        lines.push(vec4.create(node.lowerRight[0], 0, node.lowerRight[1], 1))
  
        lines.push(vec4.create(node.lowerRight[0], 0, node.lowerRight[1], 1))
        lines.push(vec4.create(node.upperLeft[0], 0, node.lowerRight[1], 1))
  
        lines.push(vec4.create(node.upperLeft[0], 0, node.lowerRight[1], 1))
        lines.push(vec4.create(node.upperLeft[0], 0, node.upperLeft[1], 1))  
      }
      else {
        occupied.push(vec4.create(node.upperLeft[0], 0, node.upperLeft[1], 1))
        occupied.push(vec4.create(node.lowerRight[0], 0, node.upperLeft[1], 1))
  
        occupied.push(vec4.create(node.lowerRight[0], 0, node.upperLeft[1], 1))
        occupied.push(vec4.create(node.lowerRight[0], 0, node.lowerRight[1], 1))
  
        occupied.push(vec4.create(node.lowerRight[0], 0, node.lowerRight[1], 1))
        occupied.push(vec4.create(node.upperLeft[0], 0, node.lowerRight[1], 1))
  
        occupied.push(vec4.create(node.upperLeft[0], 0, node.lowerRight[1], 1))
        occupied.push(vec4.create(node.upperLeft[0], 0, node.upperLeft[1], 1))  
      }

      if (node.neighbors[Direction.North].length === 0) {
        lines.push(vec4.create(node.upperLeft[0], 0, node.upperLeft[1], 1))
        lines.push(vec4.create(node.lowerRight[0], 0, node.upperLeft[1], 1))
      }

      if (node.neighbors[Direction.South].length === 0) {
        lines.push(vec4.create(node.upperLeft[0], 0, node.lowerRight[1], 1))
        lines.push(vec4.create(node.lowerRight[0], 0, node.lowerRight[1], 1))
      }

      if (node.neighbors[Direction.East].length === 0) {
        lines.push(vec4.create(node.lowerRight[0], 0, node.upperLeft[1], 1))
        lines.push(vec4.create(node.lowerRight[0], 0, node.lowerRight[1], 1))
      }

      if (node.neighbors[Direction.West].length === 0) {
        lines.push(vec4.create(node.upperLeft[0], 0, node.upperLeft[1], 1))
        lines.push(vec4.create(node.upperLeft[0], 0, node.lowerRight[1], 1))
      }
    }

    return [lines, occupied, blocked];
  }

  getLeaf(s: Vec2, node: Node): Node | null {
    if (s[0] >= node.upperLeft[0] && s[0] < node.lowerRight[0]
      && s[1] >= node.lowerRight[1] && s[1] < node.upperLeft[1]
    ) {
      if (node.children.length === 0) {
        return node;
      }
    
      for (const child of node.children) {
        const leaf = this.getLeaf(s, child);

        if (leaf) {
          return leaf;
        }
      }
    }

    return null;
  }

  nodeBlocked(node: Node, searcher: Actor, target: Actor): boolean {
    const test =  (node.actors.length > 0
      && (node.actors.length !== 1 || (node.actors[0] !== target && node.actors[0] !== searcher)))

    return test;
  }

  getCenter(node: Node): Vec2 {
    return vec2.create(
      (node.upperLeft[0] + node.lowerRight[0]) / 2,
      (node.upperLeft[1] +  node.lowerRight[1]) / 2,
    )
  }

  findPath(s: Vec2, goal: Vec2, searcher: Actor, target: Actor): Vec2[] {
    // Find start node.

    const openSet = new Set();
    const closedSet = new Set();

    const startNode = this.getLeaf(s, this.root);

    if (startNode) {
      startNode.gCost = 0;

      openSet.push(startNode);

      while (!openSet.empty()) {
        openSet.sort();

        let currentNode = openSet.pop();

        if (currentNode) {
          console.log(`current: (${currentNode.upperLeft[0]}, ${currentNode.upperLeft[1]}) - (${currentNode.lowerRight[0]}, ${currentNode.lowerRight[1]})`)
          closedSet.push(currentNode);

          const actors = currentNode.actors.filter((a) => a !== searcher);
          if (actors.length === 1 && actors[0] === target) {
            // Found goal
            const wp = searcher.getWorldPosition();

            let path: Vec2[] = [];
            
            // Adjust last position so that it is sufficiently far from the target's center
            // const center4 = target.getWorldPosition();
            // const center = vec2.create(center4[0], center4[2])
            // const p1 = this.getCenter(currentNode.parent!);
            // const p2 = this.getCenter(currentNode);
            // const intersections = lineCircleIntersection(center, target.attackRadius * 2, p1, p2);

            // if (intersections) {
            //   if (intersections.length === 2) {
            //     const d1 = vec2.distance(intersections[0], p2);
            //     const d2 = vec2.distance(intersections[1], p2);

            //     if (d1 < d2) {
            //       path.push(intersections[0]);
            //     }
            //     else {
            //       path.push(intersections[1]);
            //     }
            //   } else {
            //     path.push(intersections[0]);
            //   }

            //   const t = vec2.distance(center, path[0]);
            //   if (t < target.attackRadius * 2) {
            //     console.log(`distance delta = ${target.attackRadius * 2 - t}`)
            //   }

            //   currentNode = currentNode.parent;
            // }

            while (currentNode && currentNode !== startNode) {
              path.push(this.getCenter(currentNode));

              currentNode = currentNode.parent
            }

            if (path.length > 0) {
              path.push(vec2.create(wp[0], wp[2]))
            }

            let smoothedPath: Vec2[] = [];

            if (path.length > 0) {
              for (let i = 0; i < path.length - 1; i += 1) {
                this.path.push(vec4.create(path[i][0], 0, path[i][1], 1))
                this.path.push(vec4.create(path[i + 1][0], 0, path[i + 1][1], 1))
              }

              smoothedPath.push(path[0]);

              if (path.length > 2) {
                for (let i = 1; i < path.length - 1; i += 1) {
                  const blocked = this.lineOfSightBlocked(this.root, smoothedPath[smoothedPath.length - 1], path[i + 1], target);
  
                  if (blocked) {
                    smoothedPath.push(path[i]);
                  }
                }  
              }

              smoothedPath.push(path[path.length - 1]);

              for (let i = 0; i < smoothedPath.length - 1; i += 1) {
                this.smoothedPath.push(vec4.create(smoothedPath[i][0], 0, smoothedPath[i][1], 1))
                this.smoothedPath.push(vec4.create(smoothedPath[i + 1][0], 0, smoothedPath[i + 1][1], 1))
              }

              path = path.slice(0, -1);
            }
            
            return smoothedPath;
          }

          for (const direction of currentNode.neighbors) {
            for (const neighborNode of direction) {
              if (
                this.nodeBlocked(neighborNode, searcher, target)
                || closedSet.contains(neighborNode)
              ) {
                continue;
              }

              let currentPoint = this.getCenter(currentNode);

              if (currentNode === startNode) {
                const wp = searcher.getWorldPosition();
                currentPoint = vec2.create(wp[0], wp[2]);
              }

              // if (currentNode.parent && this.lineOfSight(
              //   this.root,
              //   currentPoint,
              //   this.getCenter(neighborNode),
              // )) {
              //   const cost = currentNode.parent.gCost + this.costEstimate(
              //     currentPoint,
              //     this.getCenter(neighborNode),
              //   );
      
              //   if (cost < neighborNode.gCost) {
              //     neighborNode.gCost = cost;
              //     neighborNode.hCost = this.costEstimate(
              //       this.getCenter(neighborNode), goal,
              //     );
              //     neighborNode.parent = currentNode.parent;

              //     if (!openSet.contains(neighborNode)) {
              //       openSet.push(neighborNode);
              //     }
              //   }
              // } else
              {
                const cost = currentNode.gCost + this.costEstimate(
                  currentPoint, this.getCenter(neighborNode),
                );
  
                if (cost < neighborNode.gCost) { // || !openSet.contains(neighborNode)) {
                  neighborNode.gCost = cost;
                  neighborNode.hCost = this.costEstimate(
                    this.getCenter(neighborNode), goal,
                  );
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

  costEstimate(p1: Vec2, p2: Vec2): number {
    const deltaX = Math.abs(p1[0] - p2[0]);
    const deltaY = Math.abs(p1[1] - p2[1]);
  
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    // if (deltaX > deltaY) {
    //   return 14 * deltaY + 10 * (deltaX - deltaY);
    // }

    // return 14 * deltaX + 10 * (deltaY - deltaX);
  }

  // Line of sight algorithm from Movel AI News.
  lineOfSightBlocked(node: Node, p1: Vec2, p2: Vec2, target: Actor): boolean {
    if (node.children.length === 0) {
      // This is a leaf node

      if (node.actors.length === 0) {
        // Nothing to collide with the line
        return false;
      }

      for (const actor of node.actors) {
        if (actor !== target) {
          const center = actor.getWorldPosition();

          if (lineCircleIntersection(center, actor.attackRadius * 2, p1, p2) !== null) {
            return true;
          }
        }
      }

      // Nothing intersected the line.
      return false;
    }

    // Pass the line to each of the chlidren that have actors.
    for (const child of node.children) {
      const line = lineRectangleClip(p1, p2, child.upperLeft, child.lowerRight);

      if (line) {
        const blocked = this.lineOfSightBlocked(child, line[0], line[1], target);

        if (blocked) {
          return true;
        }  
      }
    }

    return false;
  }  
}

export default QuadTree;
