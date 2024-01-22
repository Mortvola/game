import { gpu } from "./Renderer/Gpu";
import { modelManager } from "./ModelManager";
import { pipelineManager } from "./Renderer/Pipelines/PipelineManager";
import Game from "./Renderer";
import { WorldInterface } from "./types";

await gpu.ready();
await pipelineManager.ready();
await modelManager.ready();
export const game = await Game.create();

export const getWorld = (): WorldInterface => game;
