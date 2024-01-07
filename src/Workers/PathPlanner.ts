/* eslint-disable no-restricted-globals */

import { Vec2, vec2 } from "wgpu-matrix";
import JumpPointSearch from "../Search/JumpPointSearch";
import { AddOccupantResponse, AddOccupantdRequest, FindPathRequest, FindPathResponse, MessageType, Occupant, PopulateGridRequest, PopulateGridResponse } from "./PathPlannerTypes";

const pathFinder = new JumpPointSearch(512, 512, 4)

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

const populateGrid = (occupants: Occupant[]): number[][] => {
  let debugLines: number[][] = [];

  pathFinder.clear(true);

  for (const occupant of occupants) {
    const lines = pathFinder.fillCircle(occupant, occupant.center, occupant.radius);
    debugLines = debugLines.concat(lines)
  }

  let dbl = debugLines.map((p) => {
    const p2 = pathFinder.gridToPosition(p);

    return (
      [
        p2[0], 0.1, p2[1], 1,
        1, 1, 1, 1,
      ]
    )
  })

  return dbl;
}

const addOccupant = (occupant: Occupant) => {
  pathFinder.fillCircle(occupant, occupant.center, occupant.radius);
}

const findPath = (
  start: Vec2,
  goal: Vec2,
  goalRadius: number | null,
  target: { id: number } | null,
  maxDistance: number,
): [Vec2[], number, number[][], number[][]] => {
  let path: Vec2[] = [];

  // const dbl = populateGrid(occupants);
  pathFinder.clear(false);

  path = pathFinder.findPath(start, goal, goalRadius, target);

  // Trim the path to the extent the character can move in a single turn.
  return [...trimPath(path, maxDistance), []];
}

self.onmessage = (event: MessageEvent<MessageType>) => {
  if (event.data.type === 'FindPath') {
    const data = event.data as FindPathRequest;

    const [path, distance, lines, dbl] = findPath(
      data.start, data.goal, data.goalRadius, data.target, data.maxDistance,
    );  

    const response: FindPathResponse = {
      type: data.type,
      id: data.id,
      path,
      distance,
      lines,
      dbl,
    };
    
    postMessage(response)  
  }
  else if (event.data.type === 'PopulateGrid') {
    const data = event.data as PopulateGridRequest;

    const lines = populateGrid(data.occupants);

    const response: PopulateGridResponse = {
      type: data.type,
      id: data.id,
      lines,
    }

    postMessage(response)  
  }
  else if (event.data.type === 'AddOccupant') {
    const data = event.data as AddOccupantdRequest;

    addOccupant(data.occupant);

    const response: AddOccupantResponse = {
      type: data.type,
      id: data.id,
    }

    postMessage(response)  
  }
}

