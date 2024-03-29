import ContainerNode from "./Renderer/Drawables/SceneNodes/ContainerNode";
import { ParticleSystemInterface, SceneObjectInterface } from "./Renderer/types";

class SceneObject implements SceneObjectInterface {
  particleSystems: ParticleSystemInterface[] = []

  children: SceneObject[] = []

  sceneNode = new ContainerNode()

  async update(time: number, elapsedTime: number): Promise<void> {
    for (const ps of this.particleSystems) {
      await ps.update(time, elapsedTime, this.sceneNode)
    }
  }
}

export default SceneObject;
