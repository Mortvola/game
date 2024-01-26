import { modelManager } from "./ModelManager";
import Game from "./Game";
import { WorldInterface } from "./types";

await modelManager.ready();
export const game = await Game.create();

export const getWorld = (): WorldInterface => game;
