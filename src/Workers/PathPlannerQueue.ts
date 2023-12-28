import { Vec2, vec2 } from "wgpu-matrix";
import Actor from "../Character/Actor";

const worker: Worker = new Worker(new URL("../Workers/PathPlanner.ts", import.meta.url));

let requestId = 0;

type Occupant = {
  center: Vec2,
  radius: number,
}

type MessageRequest = {
  start: Vec2,
  goal: Vec2,
  target: Object | null,
  occupants: Occupant[],
  maxDistance: number,
  id: number,
}

type MessageResponse = {
  type: string,
  path: Vec2[],
  distance: number,
  lines: number[][],
  id: number,
}

type FindPathPromise = {
  resolve: ((value: [Vec2[], number, number[][], boolean]) => void),
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

export const findPath2 = async (
  actor: Actor, start: Vec2, goal: Vec2, target: Actor | null, participants: Actor[],
): Promise<[Vec2[], number, number[][], boolean]> => {
  const occupants = participants.filter((p) => p !== target && p !== actor).map((p) => {
    const point = p.getWorldPosition();

    return ({
      center: vec2.create(point[0], point[2]),
      radius: p.occupiedRadius + actor.occupiedRadius
    })
  })

  requestId += 1;

  const message = {
    type: 'start',
    start,
    goal,
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
      ])  

      delete findPathPromises[waiting.id];  
    }

    waiting = message;
  }

  const promise: Promise<[Vec2[], number, number[][], boolean]> = new Promise((resolve, reject) => {
    findPathPromises[requestId] = { resolve };
  })

  return promise;
}

export const queueFindPath = async (
  actor: Actor, start: Vec2, goal: Vec2, target: Actor | null, participants: Actor[],
): Promise<[Vec2[], number, number[][], boolean]> => {
  const result = await findPath2(actor, start, goal, target, participants)
  
  return result;
}