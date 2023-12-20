import { Vec2, vec2 } from "wgpu-matrix";
import Actor from "./Character/Actor";
import { circleRectangleIntersectionTest } from "./Math";

type Node = {
  upperLeft: Vec2,
  lowerRight: Vec2,
  children: [Node | null, Node | null, Node | null, Node | null],
  actors: Actor[],
  level: number,
}

class QuadTree {
  root: Node;

  maxLevel: number;

  constructor(dimension: number, actors: Actor[], maxLevel: number) {
    this.maxLevel = maxLevel;

    this.root = {
      upperLeft: vec2.create(-dimension / 2, dimension / 2),
      lowerRight: vec2.create(dimension / 2, -dimension / 2),
      children: [null, null, null, null],
      actors,
      level: 0,
    }

    this.subdivide(this.root);
  }

  actorIntersections(actors: Actor[], upperLeft: Vec2, lowerRight: Vec2): Actor[] {
    const intersectedActors: Actor[] = [];

    for (const actor of actors) {
      const center = actor.getWorldPosition();
      const radius = actor.attackRadius * 2;

      const intersected = circleRectangleIntersectionTest(center, radius, upperLeft, lowerRight);

      if (intersected) {
        intersectedActors.push(actor);
      }
    }

    return intersectedActors;
  }

  subdivide(node: Node) {
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
        children: [null, null, null, null],
        actors: this.actorIntersections(node.actors, upperLeft, lowerRight),
        level: node.level + 1,
      }

      upperLeft = vec2.create(center[0], node.upperLeft[1]);
      lowerRight = vec2.create(node.lowerRight[0], center[1]);

      const upperRightNode: Node = {
        upperLeft,
        lowerRight,
        children: [null, null, null, null],
        actors: this.actorIntersections(node.actors, upperLeft, lowerRight),
        level: node.level + 1,
      }

      upperLeft = vec2.create(node.upperLeft[0], center[1]);
      lowerRight = vec2.create(center[0], node.lowerRight[1]);

      const lowerLeftNode: Node = {
        upperLeft,
        lowerRight,
        children: [null, null, null, null],
        actors: this.actorIntersections(node.actors, upperLeft, lowerRight),
        level: node.level + 1,
      }

      upperLeft = center;
      lowerRight = node.lowerRight;

      const lowerRightNode: Node = {
        upperLeft,
        lowerRight,
        children: [null, null, null, null],
        actors: this.actorIntersections(node.actors, upperLeft, lowerRight),
        level: node.level + 1,
      }

      node.children = [
        upperLeftNode,
        upperRightNode,
        lowerLeftNode,
        lowerRightNode,
      ]

      for (const child of node.children) {
        if (child) {
          this.subdivide(child);
        }
      }
    }
  }
}

export default QuadTree;
