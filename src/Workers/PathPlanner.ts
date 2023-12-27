/* eslint-disable no-restricted-globals */

import { Vec2, vec2 } from "wgpu-matrix";
import JumpPointSearch from "../Search/JumpPointSearch";

type Occupant = {
  center: Vec2,
  radius: number,
}

const findPath = (
  start: Vec2, goal: Vec2, target: Object | null, occupants: Occupant[], maxDistance: number,
): [Vec2[], number, number[][]] => {
  let path: Vec2[] = [];
  const lines: number[][] = [];

  const pathFinder = new JumpPointSearch(512, 512, 16)

  for (const a of occupants) {
    pathFinder.fillCircle(a, a.center, a.radius);
  }

  path = pathFinder.findPath(start, goal, target);

  // Trim the path to the extent the character can move in a single turn.
  let totalDistance = 0;
  let trimmed = false;
  let trimPoint = 0;
  let color = [1, 1, 1, 1];
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

type Message = {
  start: Vec2,
  goal: Vec2,
  target: Object | null,
  occupants: Occupant[],
  maxDistance: number,
  id: number,
}

self.onmessage = (event: MessageEvent<Message>) => {
  const [path, distance, lines] = findPath(
    event.data.start, event.data.goal, event.data.target, event.data.occupants, event.data.maxDistance,
  );

  postMessage({
    type: 'FindPath',
    path,
    distance,
    lines,
    id: event.data.id,
  })
}

