import { Vec2, vec2 } from "wgpu-matrix";
import Actor from "../Character/Actor";
import { FindPathRequest, FindPathResponse, MessageType, PopulateGridRequest, PopulateGridResponse } from "./PathPlanner";
import { getWorld } from "../Renderer";
import Line from "../Drawables/Line";

const worker: Worker = new Worker(new URL("../Workers/PathPlanner.ts", import.meta.url));

let requestId = 0;

export type Occupant = {
  id: number,
  center: Vec2,
  radius: number,
}

type FindPathPromise = {
  resolve: ((value: [Vec2[], number, number[][], boolean, number[][]]) => void),
}

const findPathPromises: Record<number, FindPathPromise> = {};

type PopulateGridPromise = {
  resolve: (() => void),
}

const populateGridPromises: Record<number, PopulateGridPromise> = {};


let processing = false;

let waiting: FindPathRequest | null = null;

worker.addEventListener('message', (evt: MessageEvent<MessageType>) => {
  if (evt.data.type === 'FindPath') {
    const data = evt.data as FindPathResponse;

    const promise = findPathPromises[evt.data.id]

    if (promise) {
      if (data.id <= requestId) {
        promise.resolve([
          data.path,
          data.distance,
          data.lines,
          false,
          data.dbl,
        ])  
      }
      else {
        promise.resolve([
          [],
          0,
          [],
          true,
          [],
        ])
      }  

      delete findPathPromises[evt.data.id];  
    }
    else {
      console.log('promise not found')
    }

    if (waiting) {
      worker.postMessage(waiting);
      waiting = null;
    }
    else {
      processing = false;
    }
  }
  else if (evt.data.type === 'PopulateGrid') {
    // const data = evt.data as PopulateGridResponse;

    // const world = getWorld();

    // if (world.path2) {
    //   world.mainRenderPass.removeDrawable(world.path2, 'line')
    //   world.path2 = null;
    // }

    // world.path2 = new Line(data.lines);
    // world.mainRenderPass.addDrawable(world.path2, 'line')

    // const data = evt.data as PopulateGridResponse;

    // const promise = populateGridPromises[evt.data.id]

    // if (promise) {
    //   if (data.id <= requestId) {
    //     promise.resolve()  
    //   }
    //   else {
    //     promise.resolve()
    //   }

    //   delete populateGridPromises[data.id];  
    // }
    // else {
    //   console.log('promise not found')
    // }

    processing = false;
  }
})

export const getOccupants = (actor: Actor, participants: Actor[], others: Occupant[]): Occupant[] => {
  const occupants = participants
    .filter((p) => p !== actor)
    .map((p) => {
      const point = p.getWorldPosition();

      return ({
        id: p.id,
        center: vec2.create(point[0], point[2]),
        radius: p.occupiedRadius + actor.occupiedRadius
      })
    })

  return occupants.concat(others.map((o) => ({ id: o.id, center: o.center, radius: o.radius + actor.occupiedRadius})));
}

export const populateGrid = (
  occupants: Occupant[],
) => {
  // requestId += 1;

  const message: PopulateGridRequest = {
    type: 'PopulateGrid',
    id: requestId,
    occupants,
  };

  worker.postMessage(message);

  // const promise: Promise<void> = new Promise((resolve, reject) => {
  //   populateGridPromises[requestId] = { resolve };
  // })

  // return promise;
}

export const findPath2 = async (
  actor: Actor,
  start: Vec2,
  goal: Vec2,
  goalRadius: number | null,
  target: Actor | null,
): Promise<[Vec2[], number, number[][], boolean, number[][]]> => {

  requestId += 1;

  const message: FindPathRequest = {
    type: 'FindPath',
    id: requestId,
    start,
    goal,
    goalRadius,
    target: target === null ? null : { id: target.id },
    maxDistance: actor.distanceLeft,
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
