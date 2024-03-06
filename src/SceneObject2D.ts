import Material from "./Renderer/Materials/Material"
import { materialManager } from "./Renderer/Materials/MaterialManager"

class SceneObject2D {
  x: number

  y: number

  width: number

  height: number

  material: Material

  private constructor(x: number, y: number, width: number, height: number, material: Material) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.material = material;
  }

  static async create(x: number, y: number, width: number, height: number, materialDescriptor: number) {
    const material = await materialManager.get(materialDescriptor, '2D', [])

    return new SceneObject2D(x, y, width, height, material)
  }
}

export default SceneObject2D
