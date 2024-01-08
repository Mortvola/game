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

const getTerrain = (p: Vec2): Occupant | null => {
  for (const t of terrain) {
    if (vec2.distance(p, t.center) <= t.radius) {
      return t;
    }
  }

  return null;
}

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
            type: t.name,
            dc: t.dc,
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
  let difficultColor = [1, 0.75, 0, 1];

  // let trimmed = false;
  // let trimPoint = 0;
  let distanceLeft = maxDistance;

  const newPath: PathPoint[] = [];

  if (maxDistance > 0) {
    const terrain = getTerrain(path[path.length - 1]);

    newPath.push({
      point: path[path.length - 1],
      difficult: !!terrain,
      type: terrain?.name ?? '',
      dc: terrain?.dc,
    });

    for (let i = path.length - 1; i > 0; i -= 1) {
      if (distanceLeft > 0) {
        const terrain = getTerrain(path[i - 1]);

        const newPoints = intersectTerrain(
          newPath[newPath.length - 1],
          {
            point: path[i - 1],
            difficult: !!terrain,
            type: terrain?.name ?? '',
            dc: terrain?.dc,
          },
        );

        for (let k = 1; k < newPoints.length; k += 1) {
          const distance = vec2.distance(newPath[newPath.length - 1].point, newPoints[k].point);

          let terrainFactor = 1.0;
          if (newPath[newPath.length - 1].difficult) {
            terrainFactor = 2.0;
          }

          if (distance * terrainFactor < distanceLeft) {
            totalDistance += distance;
            distanceLeft -= distance * terrainFactor;

            lines.push([
              newPath[newPath.length - 1].point[0], 0.1, newPath[newPath.length - 1].point[1], 1,
              ...(newPath[newPath.length - 1].difficult ? difficultColor : color),
            ])

            lines.push([
              newPoints[k].point[0], 0.1, newPoints[k].point[1], 1,
              ...(newPath[newPath.length - 1].difficult ? difficultColor : color),
            ])  

            newPath.push(newPoints[k])
          }
          else {
            // const remainingDistance = distanceLeft - totalDistance;

            if (distanceLeft > 0) {
              const v = vec2.normalize(vec2.subtract(newPoints[k].point, newPath[newPath.length - 1].point));
              const newPoint = vec2.add(newPath[newPath.length - 1].point, vec2.mulScalar(v, distanceLeft / terrainFactor));
        
              lines.push([
                newPath[newPath.length - 1].point[0], 0.1, newPath[newPath.length - 1].point[1], 1,
                ...(newPath[newPath.length - 1].difficult ? difficultColor : color),
              ])

              lines.push([
                newPoint[0], 0.1, newPoint[1], 1,
                ...(newPath[newPath.length - 1].difficult ? difficultColor : color),
              ])  

              newPath.push({
                point: newPoint,
                difficult: newPath[newPath.length - 1].difficult,
                type: newPath[newPath.length - 1].type,
                dc: newPath[newPath.length - 1].dc,
              });

              totalDistance += distanceLeft / terrainFactor;
              distanceLeft = 0;
            }

            color = [1, 0, 0, 1];

            lines.push([
              ...lines[lines.length - 1].slice(0, 4),
              ...color,
            ]);

            lines.push([
              newPoints[k].point[0], 0.1, newPoints[k].point[1], 1,
              ...color,
            ])
          }
        }
      }
      else {
        lines.push([
          path[i][0], 0.1, path[i][1], 1,
          ...color,
        ]);

        lines.push([
          path[i - 1][0], 0.1, path[i - 1][1], 1,
          ...color,
        ])
      }
    }
  }

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

