import { GridNode } from "./GridNode";

class GridNodeSet {
  nodes: GridNode[] = [];

  push(v: GridNode) {
    this.nodes.push(v);
  }

  contains(v: GridNode): boolean {
    return this.nodes.some((c) => c.x === v.x && c.y === v.y)
  }

  empty(): boolean {
    return this.nodes.length === 0;
  }

  pop(): GridNode | null {
    return this.nodes.pop() ?? null;
  }

  sort() {
    this.nodes.sort((a, b) => (
      (b.gCost + b.hCost) - (a.gCost + a.hCost)
    ))
  }
}

export default GridNodeSet;
