/* eslint-disable no-restricted-globals */

import { Vec2, vec2 } from "wgpu-matrix";
import JumpPointSearch from "../Search/JumpPointSearch";
import {
  AddOccupantResponse, AddOccupantdRequest, FindPathRequest, FindPathResponse,
  MessageType, Occupant, PathPoint, PopulateGridRequest, PopulateGridResponse,
} from "./PathPlannerTypes";
import { lineSegmentCircleIntersection } from "../Math";

const pathFinder = new JumpPointSearch(512, 512, 4)

let terrain: Occupant[] = [];

const isInTerrain = (p: Vec2): boolean => {
  for (const t of terrain) {
    if (vec2.distance(p, t.center) <= t.radius) {
      return true;
    }
  }

  return false;
}

const intersectTerrain = (p1: PathPoint, p2: PathPoint): PathPoint[] => {
  let points: PathPoint[] = [p1, p2];

  for (let i = 0; i < points.length - 1; i += 1) {
    for (const t of terrain) {
      const [result, inside] = lineSegmentCircleIntersection(t.center, t.radius, points[i].point, points[i + 1].point)

      // points[i].difficult = points[i].difficult ? points[i].difficult : inside[0];
      // points[i + 1].difficult = points[i + 1].difficult ? points[i + 1].difficult : inside[1];
      
      if (result.length > 2) {
        points = [
          ...points.slice(0, i + 1),
          ...result.slice(1, -1).map((p, index) => ({
            point: p,
            difficult: index === 0 ? !inside[index] : inside[index],
          })),
          ...points.slice(i + 1),
        ]
      }
    }  
  }

  return points;
}

const trimPath = (path: Vec2[], maxDistance: number): [PathPoint[], number, number[][]] => {
  if (path.length < 2) {
    return [[], 0, []];
  }

  let totalDistance = 0;
  const lines: number[][] = [];
  let color = [1, 1, 1, 1];
  let difficultColor = [0, 0, 1, 1];

  let trimmed = false;
  // let trimPoint = 0;
  let distanceLeft = maxDistance;

  const newPath: PathPoint[] = [];

  newPath.push({ point: path[path.length - 1], difficult: isInTerrain(path[path.length - 1]) });

  for (let i = path.length - 1; i > 0; i -= 1) {
    const distance = vec2.distance(path[i], path[i - 1]);

    // First point of line segment
    lines.push([
      path[i][0], 0.1, path[i][1], 1,
      ...(newPath[newPath.length - 1].difficult ? difficultColor : color),
    ])

    if (totalDistance + distance < distanceLeft) {
      totalDistance += distance;

      const newPoints = intersectTerrain(
        newPath[newPath.length - 1],
        { point: path[i - 1], difficult: isInTerrain(path[i - 1]) },
      );
      
      // Terminate the current line at the first new point from the terrain intersection.
      // (this may or may not be the same next point before the terrain intersection)
      lines.push([
        newPoints[1].point[0], 0.1, newPoints[1].point[1], 1,
        ...(newPath[newPath.length - 1].difficult ? difficultColor : color),
      ])

      newPath.push(...newPoints);

      // Generate the lines along the new points from the terrain 
      // intersection (if any).
      for (let k = 1; k < newPoints.length - 1; k += 1) {
        const p1 = newPoints[k];
        const p2 = newPoints[k + 1]

        lines.push([
          p1.point[0], 0.1, p1.point[1], 1,
          ...(p1.difficult ? difficultColor : color),
        ])    

        lines.push([
          p2.point[0], 0.1, p2.point[1], 1,
          ...(p1.difficult ? difficultColor : color),
        ])
      }
    }
    else if (!trimmed) {
      const remainingDistance = distanceLeft - totalDistance;
      const v = vec2.normalize(vec2.subtract(path[i - 1], path[i]));
      const newPoint = vec2.add(path[i], vec2.mulScalar(v, remainingDistance));

      const newPoints = intersectTerrain(
        newPath[newPath.length - 1],
        { point: newPoint, difficult: isInTerrain(newPoint) },
      );

      // Terminate the current line at the first new point from the terrain intersection.
      // (this may or may not be the same new next point before the terrain intersection)
      lines.push([
        newPoints[1].point[0], 0.1, newPoints[1].point[1], 1,
        ...(newPath[newPath.length - 1].difficult ? difficultColor : color),
      ])

      newPath.push(...newPoints);

      // Generate the lines along the new points from the terrain 
      // intersection (if any).
      for (let k = 1; k < newPoints.length - 1; k += 1) {
        const p1 = newPoints[k];
        const p2 = newPoints[k + 1]

        lines.push([
          p1.point[0], 0.1, p1.point[1], 1,
          ...(p1.difficult ? difficultColor : color),
        ])    

        lines.push([
          p2.point[0], 0.1, p2.point[1], 1,
          ...(p1.difficult ? difficultColor : color),
        ])
      }

      path = [
        ...path.slice(0, i),
        newPoint,
        ...path.slice(i),
      ]

      // trimPoint = i;

      i += 1;

      // lines.push([
      //   path[i - 1][0], 0.1, path[i - 1][1], 1,
      //   ...color,
      // ])  

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
  // if (trimPoint !== 0) {
  //   path = path.slice(trimPoint);
  // }

  return [newPath.reverse(), totalDistance, lines];
}

const populateGrid = (occupants: Occupant[]): number[][] => {
  let debugLines: number[][] = [];

  pathFinder.clear(true);
  terrain = [];

  for (const occupant of occupants) {
    const lines = pathFinder.fillCircle(occupant, occupant.center, occupant.radius);
    debugLines = debugLines.concat(lines)

    if (occupant.type === 'Terrain') {
      terrain.push(occupant)
    }
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

  if (occupant.type === 'Terrain') {
    terrain.push(occupant)
  }
}

const findPath = (
  start: Vec2,
  goal: Vec2,
  goalRadius: number | null,
  target: Occupant | null,
  maxDistance: number,
  ignoreTerrain = false,
): [PathPoint[], number, number[][], number[][]] => {
  let path: Vec2[] = [];

  // const dbl = populateGrid(occupants);
  pathFinder.clear(false);

  path = pathFinder.findPath(start, goal, goalRadius, target, ignoreTerrain);

  // Trim the path to the extent the character can move in a single turn.
  return [...trimPath(path, maxDistance), []];
}

self.onmessage = (event: MessageEvent<MessageType>) => {
  if (event.data.type === 'FindPath') {
    const data = event.data as FindPathRequest;

    const [path, distance, lines, dbl] = findPath(
      data.start, data.goal, data.goalRadius, data.target, data.maxDistance, data.ignoreTerrain,
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

