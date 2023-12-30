/* eslint-disable no-restricted-globals */

import { Vec2, vec2 } from "wgpu-matrix";
import JumpPointSearch from "../Search/JumpPointSearch";

type Occupant = {
  center: Vec2,
  radius: number,
}

const trimPath = (path: Vec2[], maxDistance: number): [Vec2[], number, number[][]] => {
  let totalDistance = 0;
  const lines: number[][] = [];
  let color = [1, 1, 1, 1];
  let trimmed = false;
  let trimPoint = 0;
  let distanceLeft = maxDistance;

  for (let i = path.length - 1; i > 0; i -= 1) {
    const distance = vec2.distance(path[i], path[i - 1]);

    lines.push([
      path[i][0], 0.1, path[i][1], 1,
      ...color,
    ])

    if (totalDistance + distance < distanceLeft) {
      totalDistance += distance;

      lines.push([
        path[i - 1][0], 0.1, path[i - 1][1], 1,
        ...color,
      ])  
    }
    else if (!trimmed) {
      const remainingDistance = distanceLeft - totalDistance;
      const v = vec2.normalize(vec2.subtract(path[i - 1], path[i]));
      const newPoint = vec2.add(path[i], vec2.mulScalar(v, remainingDistance));

      path = [
        ...path.slice(0, i),
        newPoint,
        ...path.slice(i),
      ]

      trimPoint = i;

      i += 1;

      lines.push([
        path[i - 1][0], 0.1, path[i - 1][1], 1,
        ...color,
      ])  

      totalDistance += remainingDistance;

      trimmed = true;
      color = [1, 0, 0, 1];
    }
    else {
      lines.push([
        path[i - 1][0], 0.1, path[i - 1][1], 1,
        ...color,
      ])  
    }
  }

  // Do the trimming
  if (trimPoint !== 0) {
    path = path.slice(trimPoint);
  }

  return [path, totalDistance, lines];
}

const findPath = (
  start: Vec2, goal: Vec2, goalRadius: number | null, target: Object | null, occupants: Occupant[], maxDistance: number,
): [Vec2[], number, number[][], number[][]] => {
  let path: Vec2[] = [];
  let debugLines: number[][] = [];

  const pathFinder = new JumpPointSearch(512, 512, 4)

  for (const a of occupants) {
    const lines = pathFinder.fillCircle(a, a.center, a.radius);
    debugLines = debugLines.concat(lines)
  }

  let dbl = debugLines.map((p) => (
    [
      (p[0] - pathFinder.center[0]) / pathFinder.scale, 0.1, (p[1] - pathFinder.center[1]) / pathFinder.scale, 1,
      1, 1, 1, 1,
    ]
  ))

  path = pathFinder.findPath(start, goal, goalRadius, target);

  // Trim the path to the extent the character can move in a single turn.
  return [...trimPath(path, maxDistance), dbl];
}

export type MessageRequest = {
  type: string,
  start: Vec2,
  goal: Vec2,
  goalRadius: number | null,
  target: Object | null,
  occupants: Occupant[],
  maxDistance: number,
  id: number,
}

self.onmessage = (event: MessageEvent<MessageRequest>) => {
  const [path, distance, lines, dbl] = findPath(
    event.data.start, event.data.goal, event.data.goalRadius, event.data.target, event.data.occupants, event.data.maxDistance,
  );

  postMessage({
    type: 'FindPath',
    path,
    distance,
    lines,
    id: event.data.id,
    dbl,
  })
}

