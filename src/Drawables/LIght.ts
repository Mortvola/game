import { vec4, Vec4 } from 'wgpu-matrix';
import SceneNode, { AllowedTransformations } from './SceneNode';

class Light extends SceneNode {
  lightColor = vec4.create(1, 1, 1, 1);

  allowedTransformations = AllowedTransformations.Translation;

  computeCentroid(): Vec4 {
    return vec4.create(0, 0, 0, 1);
  }
}

export const isLight = (r: unknown): r is Light => (
  (r as Light).lightColor !== undefined
)

export default Light;
