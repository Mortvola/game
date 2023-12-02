import { Vec2, Vec4 } from "wgpu-matrix";
import { bindGroups, gpu } from "../Renderer";
import Drawable from "./Drawable";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { trajectoryShader } from "../shaders/trajectory";
import { gravity } from "../Math";

const defs = makeShaderDataDefinitions(trajectoryShader);

type TrajectoryData = {
  velocityVector: Vec2,
  duration: number,
  startPos: Vec4,
  orientation: Vec4,
  distance: number,
};

const label = 'trajectory';

class Trajectory extends Drawable {

  trajectoryStructure = makeStructuredView(defs.structs.Trajectory);

  trajectoryData: TrajectoryData;

  trajectoryBuffer: GPUBuffer;

  trajectoryBindGroup: GPUBindGroup;

  constructor(trajectoryData: TrajectoryData) {
    super();
  
    if (!gpu) {
      throw new Error('gpu not set')
    }
  
    this.trajectoryData = trajectoryData;

    this.trajectoryBuffer = gpu.device.createBuffer({
      label,
      size: this.trajectoryStructure.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.trajectoryBindGroup = gpu.device.createBindGroup({
      label,
      layout: bindGroups.bindGroupLayout2,
      entries: [
        { binding: 0, resource: { buffer: this.trajectoryBuffer }},
      ],
    });
  }

  render(passEncoder: GPURenderPassEncoder) {
    if (!gpu) {
      throw new Error('gpu device not set.')
    }

    const numSegments = this.trajectoryData.distance;

    // Update the trajectory information
    this.trajectoryStructure.set({
      numSegments: numSegments,
      startPosition: this.trajectoryData.startPos,
      velocity: this.trajectoryData.velocityVector,
      gravity: gravity,
      duration: this.trajectoryData.duration,
      orientation: this.trajectoryData.orientation,
    });

    gpu.device.queue.writeBuffer(this.trajectoryBuffer, 0, this.trajectoryStructure.arrayBuffer);

    passEncoder.setBindGroup(2, this.trajectoryBindGroup);

    // TODO: determine how many lines should be rendered based on length of arc?
    passEncoder.draw(numSegments);  
  }
}

export default Trajectory;
