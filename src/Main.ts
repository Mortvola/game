import { sceneObjectlManager } from "./SceneObjectManager";
import Game from "./Game";
import { WorldInterface } from "./types";

await sceneObjectlManager.ready();
export const game = await Game.create();

export const getWorld = (): WorldInterface => game;
