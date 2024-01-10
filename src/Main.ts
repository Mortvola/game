import BindGroups from "./BindGroups";
import Gpu from "./Gpu";
import ModelManager from "./ModelManager";
import Renderer from "./Renderer";
import { WorldInterface } from "./WorldInterface";

export const gpu = await Gpu.create();
export const bindGroups = new BindGroups();
export const modelManager = new ModelManager();
export const renderer = await Renderer.create(gpu!, bindGroups);

export const getWorld = (): WorldInterface => renderer;

