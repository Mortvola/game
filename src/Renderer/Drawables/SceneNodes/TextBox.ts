import { font } from '../../../Font';
import { materialManager } from '../../Materials/MaterialManager';
import { MaterialInterface } from '../../types';
import Mesh2D from '../Mesh2D';
import SceneNode2d from './SceneNode2d';

class TextBox extends SceneNode2d {
  mesh: Mesh2D

  private constructor(mesh: Mesh2D, material: MaterialInterface) {
    super()

    this.mesh = mesh
    this.material = material
  }

  static async create(text: string): Promise<TextBox> {
    const mesh = font.text(text)

    const material = await materialManager.get(18, 'Mesh2D', [])

    return new TextBox(mesh, material);
  }

  // addInstance(
  //   renderPass: RenderPass2DInterface,
  //   left: number,
  //   top: number,
  //   width: number,
  //   height: number,
  //   canvasWidth: number,
  //   canvasHeight: number,
  // ): void {
  //   if (this.material || this.color) {
  //     renderPass.addDrawable(
  //       this,
  //       canvasWidth,
  //       canvasHeight,
  //       { x: left, y: top, width, height },
  //     )
  //   }
  // }
}

export const isTextBox = (r: unknown): r is TextBox => (
  (r as TextBox).mesh !== undefined
)

export default TextBox;
