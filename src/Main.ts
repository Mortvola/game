import BindGroups from "./BindGroups";
import Gpu from "./Gpu";
import ModelManager from "./ModelManager";
import PipelineManager from "./Pipelines/PipelineManager";
import Renderer from "./Renderer";
import { WorldInterface } from "./types";

export const gpu = await Gpu.create();
export const bindGroups = new BindGroups(gpu);
export const pipelineManager = new PipelineManager(gpu, bindGroups);
export const modelManager = new ModelManager(pipelineManager);
export const renderer = await Renderer.create(gpu!, bindGroups);

export const getWorld = (): WorldInterface => renderer;
