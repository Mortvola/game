import { isContainerNode } from "../Renderer/Drawables/SceneNodes/ContainerNode";
import { isDrawableNode } from "../Renderer/Drawables/SceneNodes/utils";
import { SceneNodeInterface, SceneObjectInterface } from "../Renderer/types";
import { ActorInterface, WorldInterface } from "../types";

class Animate implements ActorInterface {
  startTime: number | null = null;

  sceneObject: SceneObjectInterface;

  world: WorldInterface;

  initialFade = 1;

  constructor(
    sceneObject: SceneObjectInterface,
    world: WorldInterface,
  ) {
    this.sceneObject = sceneObject;
    this.world = world;
  }

  async update(elapsedTime: number, timestamp: number): Promise<boolean> {
    if (this.startTime === null) {
      this.startTime = timestamp;
      this.world.renderer.scene.addNode(this.sceneObject.sceneNode);

      const node = this.findSceneNode(this.sceneObject.sceneNode, 'SoularCoaster');

      if (isDrawableNode(node)) {
        node.material.updateProperty(GPUShaderStage.FRAGMENT, 'fade', this.initialFade)
      }
    }
    else {
      const animateElapsedTime = (timestamp - this.startTime) * 0.001;

      if (animateElapsedTime > 1) {
        this.world.renderer.scene.removeNode(this.sceneObject.sceneNode);

        return true;
      }

      const f = -2 * animateElapsedTime;

      const node = this.findSceneNode(this.sceneObject.sceneNode, 'SoularCoaster');

      if (isDrawableNode(node)) {
        node.material.updateProperty(GPUShaderStage.FRAGMENT, 'fade', this.initialFade + f)
      }
    }

    return false;
  }

  findSceneNode(node: SceneNodeInterface, name: string): SceneNodeInterface | undefined {
    let stack: SceneNodeInterface[] = [node];

    while (stack.length > 0) {
      let n = stack[0];
      stack = stack.slice(1);

      if (isContainerNode(n)) {
        stack = stack.concat(n.nodes)
      }
      else if (isDrawableNode(n)) {
        if (n.name === name) {
          return n;
        }
      } 
    }
  }
}

export default Animate;
