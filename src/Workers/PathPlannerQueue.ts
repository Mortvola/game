import { Vec2, vec2 } from "wgpu-matrix";
import Actor from "../Character/Actor";
import { AddOccupantdRequest, FindPathRequest, FindPathResponse, MessageType, Occupant, PopulateGridRequest } from "./PathPlannerTypes";

const worker: Worker = new Worker(new URL("../Workers/PathPlanner.ts", import.meta.url));

let requestId = 0;

type FindPathReturn = [Vec2[], number, number[][], boolean, number[][]];

type FindPathPromise = {
  resolve: ((value: FindPathReturn) => void),
}

type PopulateGridPromise = {
  resolve: (() => void),
}

type AddOccupantPromise = {
  resolve: (() => void)
}

const promises: Record<number, FindPathPromise | PopulateGridPromise | AddOccupantPromise> = {};


let processing = false;

let waiting: FindPathRequest | null = null;

worker.addEventListener('message', (evt: MessageEvent<MessageType>) => {
  if (evt.data.type === 'FindPath') {
    const data = evt.data as FindPathResponse;

    const promise = promises[evt.data.id] as FindPathPromise;

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

      delete promises[evt.data.id];  
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
  else if (evt.data.type === 'AddOccupant') {
    // const data = evt.data as AddOccupantResponse;

    const promise = promises[evt.data.id] as AddOccupantPromise;

    if (promise) {
      promise.resolve()

      delete promises[evt.data.id];  
    }
    else {
      console.log('promise not found')
    }
  }
})

export const getOccupants = (actor: Actor, participants: Actor[], others: Occupant[]): Occupant[] => {
  const occupants: Occupant[] = participants
    .filter((p) => p !== actor)
    .map((p) => {
      const point = p.getWorldPosition();

      return ({
        id: p.id,
        center: vec2.create(point[0], point[2]),
        radius: p.occupiedRadius + actor.occupiedRadius,
        type: 'Creature',
        name: '',
      })
    })

  return occupants.concat(others.map((o) => ({
    id: o.id,
    center: o.center,
    radius: o.radius + actor.occupiedRadius,
    type: o.type,
    name: o.name,
  })));
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

export const addOccupant = (
  occupant: Occupant,
) => {
  requestId += 1;

  const message: AddOccupantdRequest = {
    type: 'AddOccupant',
    id: requestId,
    occupant,
  };

  worker.postMessage(message);

  const promise: Promise<void> = new Promise((resolve, reject) => {
    promises[requestId] = { resolve };
  })

  return promise;
}

export const findPath2 = async (
  actor: Actor,
  start: Vec2,
  goal: Vec2,
  goalRadius: number | null,
  target: Actor | null,
): Promise<FindPathReturn> => {

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
      const promise = promises[waiting.id] as FindPathPromise

      if (promise) {
        promise.resolve([
          [],
          0,
          [],
          true,
          [],
        ])  
  
        delete promises[waiting.id];    
      }
    }

    waiting = message;
  }

  const promise: Promise<FindPathReturn> = new Promise((resolve, reject) => {
    promises[requestId] = { resolve };
  })

  return promise;
}
