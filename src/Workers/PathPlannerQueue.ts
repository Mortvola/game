import { Vec2, vec2 } from "wgpu-matrix";
import Actor from "../Character/Actor";
import { MessageRequest } from "./PathPlanner";

const worker: Worker = new Worker(new URL("../Workers/PathPlanner.ts", import.meta.url));

let requestId = 0;

export type Occupant = {
  center: Vec2,
  radius: number,
}

type MessageResponse = {
  type: string,
  path: Vec2[],
  distance: number,
  lines: number[][],
  id: number,
  dbl: number[][],
}

type FindPathPromise = {
  resolve: ((value: [Vec2[], number, number[][], boolean, number[][]]) => void),
}

const findPathPromises: Record<number, FindPathPromise> = {};

let processing = false;

let waiting: MessageRequest | null = null;

worker.addEventListener('message', (evt: MessageEvent<MessageResponse>) => {
  if (evt.data.type === 'FindPath') {
    const promise = findPathPromises[evt.data.id]

    if (promise) {
      promise.resolve([
        evt.data.path,
        evt.data.distance,
        evt.data.lines,
        false,
        evt.data.dbl,
      ])
  
      delete findPathPromises[evt.data.id];  
    }

    if (waiting) {
      worker.postMessage(waiting);
      waiting = null;
    }
    else {
      processing = false;
    }
  }
})

export const getOccupants = (actor: Actor, target: Actor | null, participants: Actor[], others: Occupant[]) => {
  const occupants = participants.filter((p) => p !== target && p !== actor).map((p) => {
    const point = p.getWorldPosition();

    return ({
      center: vec2.create(point[0], point[2]),
      radius: p.occupiedRadius + actor.occupiedRadius
    })
  })

  return occupants.concat(others.map((o) => ({ center: o.center, radius: o.radius + actor.occupiedRadius})));
}

export const findPath2 = async (
  actor: Actor, start: Vec2, goal: Vec2, goalRadius: number | null, target: Actor | null, occupants: Occupant[],
): Promise<[Vec2[], number, number[][], boolean, number[][]]> => {

  requestId += 1;

  const message: MessageRequest = {
    type: 'start',
    start,
    goal,
    goalRadius,
    target: target === null ? null : {},
    occupants,
    maxDistance: actor.distanceLeft,
    id: requestId,
  };

  if (!processing) {
    worker.postMessage(message);
    processing = true;
  }
  else {
    if (waiting) {
      const promise = findPathPromises[waiting.id]

      promise.resolve([
        [],
        0,
        [],
        true,
        [],
      ])  

      delete findPathPromises[waiting.id];  
    }

    waiting = message;
  }

  const promise: Promise<[Vec2[], number, number[][], boolean, number[][]]> = new Promise((resolve, reject) => {
    findPathPromises[requestId] = { resolve };
  })

  return promise;
}
