import { Vec4, Mat4 } from 'wgpu-matrix';
import Drawable from './Drawable';
import { bindGroups } from '../BindGroups';
import { gpu } from '../Gpu';

const label = 'reticle';

class Reticle extends Drawable {
  radius = new Float32Array(1);

  bindGroup2: GPUBindGroup;

  bindGroup3: GPUBindGroup;

  uniformBuffer3: GPUBuffer;

  private constructor(radius: number, bitmap: ImageBitmap) {
    super()

    this.radius[0] = radius;

    this.uniformBuffer3 = gpu.device.createBuffer({
      label: 'radius',
      size: Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup3 = gpu.device.createBindGroup({
      label: 'radius',
      layout: bindGroups.getBindGroupLayout3(gpu.device),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer3 }},
      ],
    });

    const texture = gpu.device.createTexture({
      format: 'rgba8unorm',
      size: [bitmap.width, bitmap.height],
      usage: GPUTextureUsage.TEXTURE_BINDING |
             GPUTextureUsage.COPY_DST |
             GPUTextureUsage.RENDER_ATTACHMENT,
    });

    gpu.device.queue.copyExternalImageToTexture(
      { source: bitmap },
      { texture },
      { width: bitmap.width, height: bitmap.height },
    );

    const sampler = gpu.device.createSampler();
    
    this.bindGroup2 = gpu.device.createBindGroup({
      label,
      layout: bindGroups.getBindGroupLayout2(gpu.device),
      entries: [
        { binding: 0, resource: { buffer: this.colorBuffer }},
        { binding: 1, resource: sampler },
        { binding: 2, resource: texture.createView() },
      ],
    });
  }

  static async create(radius: number): Promise<Reticle> {
    const url = '/reticle.png';
    const res = await fetch(url);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob, { colorSpaceConversion: 'none' });

    return new Reticle(radius, bitmap);
  }

  render(passEncoder: GPURenderPassEncoder) {
    gpu.device.queue.writeBuffer(this.uniformBuffer3, 0, this.radius);

    passEncoder.setBindGroup(2, this.bindGroup2);
    passEncoder.setBindGroup(3, this.bindGroup3);

    passEncoder.draw(6);  
  }

  hitTest(p: Vec4, viewTransform: Mat4): { point: Vec4, t: number, drawable: Drawable} | null {
    // Transform point from model space to world space to camera space.
    // let t = mat4.multiply(mat4.inverse(viewTransform), this.getTransform());

    // let point = vec4.create(t[12], t[13], t[14], t[15])

    // const p2 = intersectionPlane(point, vec4.create(0, 0, 1, 0), vec4.create(0, 0, 0, 1), p);
  
    // if (p2) {
    //   const d = vec2.distance(point, p2)

    //   if (d < Math.abs(this.radius[0] * t[14])) {
    //     // Transform point to world space
    //     const wp = vec4.transformMat4(p2, viewTransform);

    //     return { point: wp, t: 1.0, drawable: this };
    //   }
    // }

    return null;
  }
}

export default Reticle;
