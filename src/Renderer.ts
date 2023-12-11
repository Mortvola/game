/* eslint-disable no-restricted-syntax */
import {
  Vec4, mat4, vec2, vec4,
} from 'wgpu-matrix';
import Camera from './Camera';
import Gpu from './Gpu';
import {
  degToRad, intersectionPlane,
} from './Math';
import ContainerNode from './Drawables/ContainerNode';
import BindGroups, { lightsStructure } from './BindGroups';
import RenderPass from './RenderPass';
import Light, { isLight } from './Drawables/Light';
import CartesianAxes from './Drawables/CartesianAxes';
import Mesh from './Drawables/Mesh';
import { box } from './Drawables/Shapes/box';
import { isDrawableInterface } from './Drawables/DrawableInterface';
import Reticle from './Drawables/Reticle';
import Actor from './Actor';
import Trajectory from './Drawables/Trajectory';
import Line from './Drawables/Line';
import Collidees from './Collidees';
import Participants, { ParticipantsState } from './Participants';
import { ActorInterface } from './ActorInterface';
import { Delay, WorldInterface } from './WorldInterface';
import { EpisodeInfo, qLearn } from './QLearn';

const requestPostAnimationFrame = (task: (timestamp: number) => void) => {
  requestAnimationFrame((timestamp: number) => {
    setTimeout(() => {
      task(timestamp);
    }, 0);
  });
};

class Renderer implements WorldInterface {
  initialized = false;

  render = true;

  previousTimestamp: number | null = null;

  startFpsTime: number | null = null;

  framesRendered = 0;

  onFpsChange?: (fps: number) => void;

  camera = new Camera();

  aspectRatio = new Float32Array(1);

  context: GPUCanvasContext | null = null;

  depthTextureView: GPUTextureView | null = null;

  renderedDimensions: [number, number] = [0, 0];

  scene = new ContainerNode();

  mainRenderPass = new RenderPass();

  left = 0;

  right = 0;

  forward = 0;

  backward = 0;

  actors: ActorInterface[] = [];

  shot: Mesh;

  lights: Light[] = [];

  participants = new Participants();

  focused: Actor | null = null;

  trajectory: Trajectory | null = null;

  path: Line | null = null;

  reticle: Reticle;

  reticlePosition = vec2.create(0, 0);

  inputMode: 'Mouse' | 'Controller' = 'Mouse';

  delays: Delay[] = [];

  collidees = new Collidees();

  scoreCallback: ((episode: EpisodeInfo) => void) | null = null;

  animate = false;

  followActiveCharacter = true;

  constructor(shot: Mesh, reticle: Reticle) {
    this.reticle = reticle;

    this.aspectRatio[0] = 1.0;
    this.mainRenderPass.addDrawable(new CartesianAxes(), 'line');

    this.shot = shot;
    this.scene.addNode(shot);

    this.updateTransforms();
  }

  static async create() {
    // const participants = new Participants();
    // participants.createTeams();

    const shot = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));

    const reticle = await Reticle.create(0.05);

    return new Renderer(shot, reticle);
  }

  async setCanvas(canvas: HTMLCanvasElement) {
    if (!gpu) {
      throw new Error('Could not acquire device');
    }

    if (this.context) {
      this.context.unconfigure();
    }

    this.context = canvas.getContext('webgpu');

    if (!this.context) {
      throw new Error('context is null');
    }

    this.context.configure({
      device: gpu.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'opaque',
    });

    this.camera.computeViewTransform();

    this.start();

    this.initialized = true;
  }

  startTurn(timestamp: number) {
    if (this.participants.activeActor) {
      if (this.participants.activeActor.automated) {
        this.mainRenderPass.removeDrawable(this.reticle, 'reticle');
      } else if (this.inputMode === 'Controller') {
        this.mainRenderPass.addDrawable(this.reticle, 'reticle');
      }

      this.participants.activeActor.startTurn(timestamp, this);

      const point = this.participants.activeActor.getWorldPosition();

      if (this.animate && this.followActiveCharacter) {
        this.camera.moveCameraTo = point;
        this.camera.moveCameraStartTime = null;  
      }
    }
  }

  endTurn2(timestamp: number) {
    if (this.participants.activeActor) {
      this.participants.activeActor.endTurn();

      if (this.focused) {
        this.mainRenderPass.removeDrawable(this.focused.mesh, 'outline');
        this.focused = null;
      }

      if (this.trajectory) {
        this.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
        this.trajectory = null;
      }

      if (this.path) {
        this.mainRenderPass.removeDrawable(this.path, 'line');
      }

      this.mainRenderPass.removeDrawable(this.reticle, 'reticle');

      this.focused = null;

      this.participants.turn = (this.participants.turn + 1) % this.participants.turns.length;
      this.startTurn(timestamp);
    }
  }

  endTurn() {
    if (!this.participants.activeActor.automated) {
      // this.endTurn2();
    }
  }

  updateActors(elapsedTime: number, timestamp: number) {
    // Update shot positions
    for (let i = 0; i < this.actors.length; i += 1) {
      const actor = this.actors[i];

      const removeActors = actor.update(elapsedTime, timestamp, this);

      for (const removed of removeActors) {
        const index = this.actors.findIndex((a) => a === removed);

        if (index !== -1) {
          this.actors = [
            ...this.actors.slice(0, index),
            ...this.actors.slice(index + 1),
          ];

          // If the removed actor was earlier or at the current index
          // position in the array then decrement the i
          // to account for the removal.
          if (i >= index) {
            i -= 1;
          }
        }
      }
    }
  }

  async prepareTeams() {
    // Remove any current participants
    for (const actor of this.participants.turns) {
      this.scene.removeNode(actor.mesh);
      this.scene.removeNode(actor.circle);
      actor.removeFromScene();

      this.collidees.remove(actor);
      this.actors.push(actor);
    }

    this.actors = [];

    // Set up teams.
    await this.participants.createTeams();

    this.participants.initiativeRolls();

    for (const actor of this.participants.turns) {
      this.scene.addNode(actor.mesh);
      this.scene.addNode(actor.circle);
      actor.addToScene(this.mainRenderPass);
      this.collidees.actors.push(actor);
      this.actors.push(actor);
    }

    this.startTurn(0);
  }

  iterations = 2000;

  updateFrame = async (timestamp: number) => {
    if (this.render) {
      if (timestamp !== this.previousTimestamp) {
        if (this.startFpsTime === null) {
          this.startFpsTime = timestamp;
        }

        // Update the fps display every second.
        const fpsElapsedTime = timestamp - this.startFpsTime;

        // Update frames per second
        if (fpsElapsedTime > 1000) {
          const fps = this.framesRendered / (fpsElapsedTime * 0.001);
          this.onFpsChange && this.onFpsChange(fps);
          this.framesRendered = 0;
          this.startFpsTime = timestamp;
        }

        // Move the camera using the set velocity.
        if (this.previousTimestamp !== null) {
          const elapsedTime = (timestamp - this.previousTimestamp) * 0.001;

          if (this.participants.state === ParticipantsState.needsPrep) {
            this.participants.state = ParticipantsState.preparing;
            this.prepareTeams()
          }

          this.camera.updatePosition(elapsedTime, timestamp);

          this.updateActors(elapsedTime, timestamp);

          if (qLearn.finished) {
            let winningTeam = 0;
            if (this.participants.participants[0].length === 0) {
              winningTeam = 1;
            }
            
            const episode: EpisodeInfo = {
              iteration: qLearn.iteration,
              winningTeam,
              rho: qLearn.rho,
              alpha: qLearn.alpha,
              totalRewards: qLearn.totalReward,
          }

            if (this.scoreCallback) {
              this.scoreCallback(episode);
            }  

            this.participants.state = ParticipantsState.needsPrep;

            qLearn.next();
          }  

          this.checkActorFocus();
        }

        this.previousTimestamp = timestamp;

        this.drawScene();

        this.framesRendered += 1;
      }

      requestPostAnimationFrame(this.updateFrame);
    }
  };

  started = false;

  start(): void {
    if (!this.started) {
      this.started = true;
      requestPostAnimationFrame(this.updateFrame);
    }
  }

  stop(): void {
    this.render = false;
  }

  updateTransforms() {
    this.scene.nodes.forEach((node) => {
      node.computeTransform();

      if (isLight(node)) {
        this.lights.push(node);
      }
    });
  }

  drawScene() {
    if (!gpu) {
      throw new Error('device is not set');
    }

    if (!this.context) {
      throw new Error('context is null');
    }

    if (!bindGroups.camera) {
      throw new Error('uniformBuffer is not set');
    }

    // this.cursor.translate[0] = this.camera.position[0];
    // this.cursor.translate[2] = this.camera.position[2];

    this.updateTransforms();

    if (this.context.canvas.width !== this.renderedDimensions[0]
      || this.context.canvas.height !== this.renderedDimensions[1]
    ) {
      const depthTexture = gpu.device!.createTexture({
        size: { width: this.context.canvas.width, height: this.context.canvas.height },
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
      this.depthTextureView = depthTexture.createView();

      this.aspectRatio[0] = this.context.canvas.width / this.context.canvas.height;

      this.camera.perspectiveTransform = mat4.perspective(
        degToRad(45), // settings.fieldOfView,
        this.aspectRatio[0],
        this.camera.near, // zNear
        this.camera.far, // zFar
      );

      this.camera.orthographicTransform = mat4.ortho(
        -this.context.canvas.width / 80,
        this.context.canvas.width / 80,
        -this.context.canvas.height / 80,
        this.context.canvas.height / 80,
        // this.near, this.far,
        -200,

        200,
      );

      this.renderedDimensions = [this.context.canvas.width, this.context.canvas.height];
    }

    const view = this.context.getCurrentTexture().createView();

    if (this.camera.projection === 'Perspective') {
      gpu.device.queue.writeBuffer(bindGroups.camera.buffer[0], 0, this.camera.perspectiveTransform as Float32Array);
    } else {
      gpu.device.queue.writeBuffer(bindGroups.camera.buffer[0], 0, this.camera.orthographicTransform as Float32Array);
    }

    const inverseViewtransform = mat4.inverse(this.camera.viewTransform);
    gpu.device.queue.writeBuffer(bindGroups.camera.buffer[1], 0, inverseViewtransform as Float32Array);

    // Write the camera position

    const cameraPosition = vec4.transformMat4(vec4.create(0, 0, 0, 1), this.camera.viewTransform);
    gpu.device.queue.writeBuffer(bindGroups.camera.buffer[2], 0, cameraPosition as Float32Array);
    gpu.device.queue.writeBuffer(bindGroups.camera.buffer[3], 0, this.aspectRatio as Float32Array);

    // Update the light information
    lightsStructure.set({
      directional: vec4.transformMat4(
        vec4.create(1, 1, 1, 0),
        inverseViewtransform,
      ),
      directionalColor: vec4.create(1, 1, 1, 1),
      count: this.lights.length,
      lights: this.lights.map((light) => ({
        position: vec4.transformMat4(
          vec4.create(light.translate[0], light.translate[1], light.translate[2], 1),
          inverseViewtransform,
        ),
        color: light.lightColor,
      })),
    });

    gpu.device.queue.writeBuffer(bindGroups.camera.buffer[4], 0, lightsStructure.arrayBuffer);

    const commandEncoder = gpu.device.createCommandEncoder();

    this.mainRenderPass.render(view, this.depthTextureView!, commandEncoder);

    // if (this.selected.selection.length > 0) {
    //   // Transform camera position to world space.
    //   const origin = vec4.transformMat4(vec4.create(0, 0, 0, 1), this.camera.viewTransform);
    //   const centroid = this.selected.getCentroid();

    //   // We want to make the drag handles appear to be the same distance away
    //   // from the camera no matter how far the centroid is from the camera.
    //   const apparentDistance = 25;
    //   let actualDistance = vec3.distance(origin, centroid);
    //   const scale = actualDistance / apparentDistance;

    //   const mat = mat4.translate(mat4.identity(), centroid);
    //   mat4.scale(mat, vec3.create(scale, scale, scale), mat)

    //   if (this.transformer.spaceOrientation === 'Local') {
    //     mat4.multiply(mat, this.selected.selection[0].node.getRotation(), mat);
    //   }

    //   this.transformer.updateTransforms(mat)

    //   this.dragHandlesPass.pipelines = [];

    //   if (this.selected.selection[0].node.allowedTransformations & AllowedTransformations.Translation) {
    //     this.dragHandlesPass.addDrawables(this.transformer.translator);
    //   }

    //   if (this.selected.selection[0].node.allowedTransformations & AllowedTransformations.Scale) {
    //     this.dragHandlesPass.addDrawables(this.transformer.scaler);
    //   }

    //   if (this.selected.selection[0].node.allowedTransformations & AllowedTransformations.Rotation) {
    //     this.dragHandlesPass.addDrawables(this.transformer.rotator);
    //   }

    //   this.dragHandlesPass.render(view, this.depthTextureView!, commandEncoder);
    // }

    gpu.device.queue.submit([commandEncoder.finish()]);
  }

  pointerDown(x: number, y: number) {
  }

  pointerMove(x: number, y: number) {
    // Pan the view if the mouse is near the edge of the window.
    if (this.inputMode === 'Mouse') {
      // this.reticlePosition[0] = x;
      // this.reticlePosition[1] = y;

      // let panVector = vec4.create(0, 0, 0, 0);

      // const borderBoundary = 0.85;

      // if (y > borderBoundary) {
      //   if (x > borderBoundary) {
      //     panVector = vec4.create(1, 0, -1, 0);
      //   } else if (x < -borderBoundary) {
      //     panVector = vec4.create(-1, 0, -1, 0);
      //   } else {
      //     panVector = vec4.create(0, 0, -1, 0);
      //   }
      // } else if (y < -borderBoundary) {
      //   if (x > borderBoundary) {
      //     panVector = vec4.create(1, 0, 1, 0);
      //   } else if (x < -borderBoundary) {
      //     panVector = vec4.create(-1, 0, 1, 0);
      //   } else {
      //     panVector = vec4.create(0, 0, 1, 0);
      //   }
      // } else if (x > borderBoundary) {
      //   panVector = vec4.create(1, 0, 0, 0);
      // } else if (x < -borderBoundary) {
      //   panVector = vec4.create(-1, 0, 0, 0);
      // }

      // this.camera.moveDirection = vec4.normalize(panVector);
    }
  }

  pointerLeft() {
    this.camera.moveDirection = vec4.create(0, 0, 0, 0);
  }

  pointerUp(x: number, y: number) {
  }

  cameraHitTest(): { actor?: Actor, point?: Vec4 } {
    const { origin, ray } = this.camera.computeHitTestRay(this.reticlePosition[0], this.reticlePosition[1]);

    // Determine if an actor should be highlighted but
    // don't check the active actor.
    let best: {
      actor: Actor
      t: number,
    } | null = null;

    for (const actor of this.participants.turns) {
      if (isDrawableInterface(actor.mesh)) {
        const result = actor.mesh.hitTest(origin, ray);

        if (result) {
          if (best === null || result.t < best.t) {
            best = {
              actor,
              t: result.t,
            };
          }
        }
      }
    }

    if (best) {
      return { actor: best.actor };
    }

    const point = intersectionPlane(vec4.create(0, 0, 0, 1), vec4.create(0, 1, 0, 0), origin, ray);

    if (point) {
      return { point };
    }

    return {};
  }

  checkActorFocus() {
    if (this.participants.activeActor && !this.participants.activeActor.automated) {
      const { actor, point } = this.cameraHitTest();

      if (actor) {
        if (actor !== this.participants.activeActor) {
          if (!this.focused || this.focused !== actor) {
            if (this.focused) {
              this.mainRenderPass.removeDrawable(this.focused.mesh, 'outline');
              this.focused = null;
            }

            if (this.trajectory) {
              this.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
              this.trajectory = null;
            }

            this.focused = actor;

            this.mainRenderPass.addDrawable(this.focused.mesh, 'outline');

            // If the active actor has actions left then
            // render a trajectory from it to the highlighted actor.
            if (this.participants.activeActor.actionsLeft > 0) {
              const result = this.participants.activeActor.computeShotData(this.participants.activeActor);

              this.trajectory = new Trajectory({
                velocityVector: result.velocityVector,
                duration: result.duration,
                startPos: result.startPos,
                orientation: result.orientation,
                distance: result.distance,
              });

              this.mainRenderPass.addDrawable(this.trajectory, 'trajectory');

              if (this.path) {
                this.mainRenderPass.removeDrawable(this.path, 'line');
              }
            }
          }
        }
      } else if (point) {
        if (this.focused) {
          this.mainRenderPass.removeDrawable(this.focused.mesh, 'outline');
          this.focused = null;
        }

        if (this.trajectory) {
          this.mainRenderPass.removeDrawable(this.trajectory, 'trajectory');
          this.trajectory = null;
        }

        // Draw path to destination

        if (this.path) {
          this.mainRenderPass.removeDrawable(this.path, 'line');
        }

        if (this.participants.activeActor.distanceLeft > 0) {
          const { start, target } = this.computePath(this.participants.activeActor, point);

          this.path = new Line(
            start,
            target,
            vec4.create(1, 1, 1, 1),
          );

          this.mainRenderPass.addDrawable(this.path, 'line');
        }
      }
    } else if (this.focused) {
      this.mainRenderPass.removeDrawable(this.focused.mesh, 'outline');
      this.focused = null;
    }
  }

  mouseWheel(deltaX: number, deltaY: number, x: number, y: number) {
    this.camera.changeRotation(-deltaX * 0.2);
  }

  updateDirection(direction: Vec4) {
    this.camera.moveDirection = direction;
  }

  computePath(actor: Actor, dest: Vec4): { start: Vec4, target: Vec4, distance: number } {
    const target = vec2.create(dest[0], dest[2]);

    const position = actor.getWorldPosition();

    const start = vec2.create(position[0], position[2]);

    let distance = vec2.distance(start, target);

    if (distance > actor.distanceLeft) {
      distance = actor.distanceLeft;

      const ray = vec2.normalize(vec2.subtract(target, start));
      vec2.add(start, vec2.mulScalar(ray, distance), target);
    }

    position[1] = 0;

    return {
      start: position,
      target: vec4.create(target[0], 0, target[1], 1),
      distance,
    };
  }

  moveActor(actor: Actor) {
    const { origin, ray } = this.camera.computeHitTestRay(this.reticlePosition[0], this.reticlePosition[1]);
    const point = intersectionPlane(vec4.create(0, 0, 0, 1), vec4.create(0, 1, 0, 0), origin, ray);

    if (point) {
      const { target, distance } = this.computePath(actor, point);

      actor.moveTo = vec2.create(target[0], target[2]);
      actor.distanceLeft -= distance;

      // Travel the distance in one second.
      // This is purely for playability. It's no fun watching an actor dilly-dally as it moves
      // to its target location.
      actor.metersPerSecond = distance;

      if (this.path) {
        this.mainRenderPass.removeDrawable(this.path, 'line');
      }
    }
  }

  interact() {
    if (!this.participants.activeActor.automated) {
      if (this.focused) {
        if (this.focused !== this.participants.activeActor && this.participants.activeActor.actionsLeft > 0) {
          // this.attack(this.activeActor, this.focused);
        }
      } else {
        this.moveActor(this.participants.activeActor);
      }
    }
  }

  centerOn(x: number, y: number) {
    this.reticlePosition[0] = x;
    this.reticlePosition[1] = y;

    let { actor, point } = this.cameraHitTest();

    if (actor) {
      point = actor.getWorldPosition();
    }

    if (point) {
      this.camera.moveCameraTo = point;
      this.camera.moveCameraStartTime = null;
    }
  }

  toggleInputMode() {
    this.inputMode = this.inputMode === 'Mouse' ? 'Controller' : 'Mouse';

    if (this.inputMode === 'Controller') {
      this.reticlePosition[0] = 0;
      this.reticlePosition[1] = 0;

      if (!this.participants.activeActor.automated) {
        this.mainRenderPass.addDrawable(this.reticle, 'reticle');
      }
    } else {
      this.mainRenderPass.removeDrawable(this.reticle, 'reticle');
    }
  }

  zoomOut() {
    this.camera.offset += 1;
    this.camera.rotateX -= 1;
  }

  zoomIn() {
    this.camera.offset -= 1;
    this.camera.rotateX += 1;
  }

  setScoreCallback(callback: (episode: EpisodeInfo) => void) {
    this.scoreCallback = callback;
  }
}

export const gpu = await Gpu.create();
export const bindGroups = new BindGroups();
export const renderer = await Renderer.create();

export default Renderer;
