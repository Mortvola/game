/* eslint-disable no-restricted-syntax */
import {
  Vec4, mat4, vec2, vec4,
} from 'wgpu-matrix';
import Camera from './Camera';
import Gpu from './Gpu';
import {
  degToRad, intersectionPlane,
} from './Math';
import ContainerNode, { isContainerNode } from './Drawables/ContainerNode';
import BindGroups, { lightsStructure } from './BindGroups';
import RenderPass from './RenderPass';
import Light, { isLight } from './Drawables/Light';
import CartesianAxes from './Drawables/CartesianAxes';
import Mesh from './Drawables/Mesh';
import { box } from './Drawables/Shapes/box';
// import Reticle from './Drawables/Reticle';
import Actor, { States } from './Character/Actor';
import Line from './Drawables/Line';
import Collidees from './Collidees';
import Participants, { ParticipantsState } from './Participants';
import { ActorInterface } from './ActorInterface';
import { ActionInfo, Delay, FocusInfo, WorldInterface } from './WorldInterface';
import { EpisodeInfo } from './Character/Actor';
import Script from './Script/Script';
import { Party } from './UserInterface/PartyList';
import Circle from './Drawables/Circle';
import MoveAction from './Character/Actions/MoveAction';
import { Occupant } from './Workers/PathPlannerTypes';
import DrawableNode from './Drawables/DrawableNode';

const requestPostAnimationFrame = (task: (timestamp: number) => void) => {
  requestAnimationFrame((timestamp: number) => {
    setTimeout(() => {
      task(timestamp);
    }, 0);
  });
};

class Renderer implements WorldInterface {
  initialized = false;

  gpu: Gpu;

  bindGroups: BindGroups;

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

  removeActors: ActorInterface[] = [];

  shot: DrawableNode;

  lights: Light[] = [];

  participants = new Participants();

  focused: Actor | null = null;

  path2: Line | null = null;

  path3: Line | null = null;

  path4: Line | null = null;

  // reticle: DrawableNode;

  reticlePosition = vec2.create(0, 0);

  inputMode: 'Mouse' | 'Controller' = 'Mouse';

  delays: Delay[] = [];

  collidees = new Collidees();

  scoreCallback: ((episode: EpisodeInfo) => void) | null = null;

  loggerCallback: ((message: string) => void) | null = null;
  
  focusCallback: ((focusInfo: FocusInfo | null) => void) | null = null;

  actionInfoCallback: ((actionInfo: ActionInfo | null) => void) | null = null;

  characterChangeCallback: ((character: Actor | null) => void) | null = null;

  animate = true;

  followActiveCharacter = false;

  endOfRound = true;

  circleAoE: Circle | null = null;

  occupants: Occupant[] = [];

  constructor(shot: DrawableNode, gpu: Gpu, bindGroups: BindGroups) {
    this.gpu = gpu;
    this.bindGroups = bindGroups;

    // this.reticle = reticle;

    this.aspectRatio[0] = 1.0;
    this.mainRenderPass.addDrawable(new DrawableNode(new CartesianAxes()), 'line');

    this.shot = shot;
    this.scene.addNode(shot, 'lit');

    this.updateTransforms();
  }

  static async create(gpu: Gpu, bindGroups: BindGroups) {
    const shot = new DrawableNode(await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1))));

    // const reticle = new DrawableNode(await Reticle.create(0.05));

    return new Renderer(shot, gpu, bindGroups);
  }

  async setCanvas(canvas: HTMLCanvasElement) {
    if (!this.gpu) {
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
      device: this.gpu.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'opaque',
    });

    this.camera.computeViewTransform();

    this.start();

    this.initialized = true;
  }

  startTurn() {
    if (this.participants.activeActor) {
      if (this.participants.activeActor.automated) {
        // this.mainRenderPass.removeDrawable(this.reticle, 'reticle');

        if (this.characterChangeCallback) {
          this.characterChangeCallback(null);
        }
      } else {
        // if (this.inputMode === 'Controller') {
        //   this.mainRenderPass.addDrawable(this.reticle, 'reticle');
        // }

        if (this.characterChangeCallback) {
          this.characterChangeCallback(this.participants.activeActor);
        }
      }

      this.participants.activeActor.startTurn(this);

      const point = this.participants.activeActor.getWorldPosition();

      if (this.animate && this.followActiveCharacter) {
        this.camera.moveCameraTo = point;
        this.camera.moveCameraStartTime = null;  
      }
    }
  }

  endTurn2(actor: Actor) {
    if (this.participants.activeActor && this.participants.activeActor === actor) {
      this.participants.activeActor.endTurn();

      if (this.focused) {
        this.focused = null;
      }

      if (this.actionInfoCallback) {
        this.actionInfoCallback(null);
      }

      // this.mainRenderPass.removeDrawable(this.reticle, 'reticle');

      // If one of the parties have been wiped out then end the round.
      if (
        this.participants.participants[0].length === 0
        || this.participants.participants[1].length === 0
      ) {
        this.endOfRound = true;
      }

      this.participants.turn = (this.participants.turn + 1) % this.participants.turns.length;
      this.startTurn();

      // Cause the focus information to update.
      this.updateFocus = true;
    }
  }

  endTurn() {
    if (!this.participants.activeActor.automated) {
      this.endTurn2(this.participants.activeActor);
    }
  }

  async updateActors(elapsedTime: number, timestamp: number) {
    // Update shot positions
    for (let i = 0; i < this.actors.length; i += 1) {
      const actor = this.actors[i];

      const remove = await actor.update(elapsedTime, timestamp, this);

      if (remove) {
        this.actors = [
          ...this.actors.slice(0, i),
          ...this.actors.slice(i + 1),
        ];

        i -= 1;
      }
    }

    for (const removedActor of this.removeActors) {
      const index = this.actors.findIndex((a) => a === removedActor);

      if (index !== -1) {
        this.actors = [
          ...this.actors.slice(0, index),
          ...this.actors.slice(index + 1),
        ];
      }

      this.participants.remove(removedActor as Actor);

      this.collidees.remove(removedActor as Actor);
      (removedActor as Actor).removeFromScene();
      this.scene.removeNode((removedActor as Actor).sceneNode);
    }

    this.removeActors = [];
  }

  async prepareTeams() {
    // Remove any current participants
    for (const actor of this.participants.turns) {
      actor.setAction(null);

      this.scene.removeNode(actor.sceneNode);
      actor.removeFromScene();

      this.collidees.remove(actor);
      this.actors.push(actor);
    }

    this.actors = [];

    if (this.focusCallback) {
      this.focusCallback(null);
    }

    // Set up teams.
    await this.participants.createTeams();

    this.participants.initiativeRolls();

    for (const actor of this.participants.turns) {
      this.scene.addNode(actor.sceneNode, 'lit');
      actor.addToScene(this.mainRenderPass);
      this.collidees.actors.push(actor);
      this.actors.push(actor);
    }

    this.scene.updateTransforms();

    this.startTurn();
  }

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
          // Get elapsed time in seconds.
          const elapsedTime = (timestamp - this.previousTimestamp) * 0.001;

          if (this.participants.state === ParticipantsState.needsPrep) {
            this.actors = [];
            console.log('*** starting new round ***');
            this.participants.state = ParticipantsState.preparing;
            this.prepareTeams()
          }

          this.camera.updatePosition(elapsedTime, timestamp);

          if (this.participants.state === ParticipantsState.ready) {
            await this.updateActors(elapsedTime, timestamp);
          }

          if (this.participants.state === ParticipantsState.ready && this.endOfRound) {
            let winningTeam: number | null = null;
            if (this.participants.participants[0].length === 0) {
              winningTeam = 1;
            }
            else if (this.participants.participants[1].length === 0) {
              winningTeam = 0;
            }
            
            if (winningTeam === 0) {
              const xp = Math.trunc((this.participants.parties[1].experiencePoints ?? 0) / this.participants.parties[0].members.length)
              for (let member of this.participants.parties[0].members) {
                if (member.included) {
                  member.character.experiencePoints += xp;
                }
              }

              if (this.loggerCallback) {
                this.loggerCallback(`Party members were awarded ${xp} experience points each.`);                 
              }
            }

            if (winningTeam !== null) {
              const episode: EpisodeInfo = {
                winningTeam,
              }  

              if (this.scoreCallback) {
                this.scoreCallback(episode);
              }  
            }

            this.participants.state = ParticipantsState.needsPrep;
            this.endOfRound = false;
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
    this.scene.resetTransforms();

    this.scene.updateTransforms();

    for (const node of this.scene.nodes) {
      if (isLight(node)) {
        this.lights.push(node);
      }
    };
  }

  drawScene() {
    if (!this.gpu) {
      throw new Error('device is not set');
    }

    if (!this.context) {
      throw new Error('context is null');
    }

    if (!this.bindGroups.camera) {
      throw new Error('uniformBuffer is not set');
    }

    // this.cursor.translate[0] = this.camera.position[0];
    // this.cursor.translate[2] = this.camera.position[2];

    this.updateTransforms();

    if (this.context.canvas.width !== this.renderedDimensions[0]
      || this.context.canvas.height !== this.renderedDimensions[1]
    ) {
      const depthTexture = this.gpu.device!.createTexture({
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
      this.gpu.device.queue.writeBuffer(this.bindGroups.camera.buffer[0], 0, this.camera.perspectiveTransform as Float32Array);
    } else {
      this.gpu.device.queue.writeBuffer(this.bindGroups.camera.buffer[0], 0, this.camera.orthographicTransform as Float32Array);
    }

    const inverseViewtransform = mat4.inverse(this.camera.viewTransform);
    this.gpu.device.queue.writeBuffer(this.bindGroups.camera.buffer[1], 0, inverseViewtransform as Float32Array);

    // Write the camera position

    const cameraPosition = vec4.transformMat4(vec4.create(0, 0, 0, 1), this.camera.viewTransform);
    this.gpu.device.queue.writeBuffer(this.bindGroups.camera.buffer[2], 0, cameraPosition as Float32Array);
    this.gpu.device.queue.writeBuffer(this.bindGroups.camera.buffer[3], 0, this.aspectRatio as Float32Array);

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

    this.gpu.device.queue.writeBuffer(this.bindGroups.camera.buffer[4], 0, lightsStructure.arrayBuffer);

    const commandEncoder = this.gpu.device.createCommandEncoder();

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

    this.gpu.device.queue.submit([commandEncoder.finish()]);
  }

  pointerDown(x: number, y: number) {
  }

  pointerMove(x: number, y: number) {
    // Pan the view if the mouse is near the edge of the window.
    if (this.inputMode === 'Mouse') {
      this.reticlePosition[0] = x;
      this.reticlePosition[1] = y;

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
      if (isContainerNode(actor.sceneNode)) {
        const result = actor.sceneNode.modelHitTest(origin, ray);

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

  updateFocus = true;
  prevActor: Actor | null = null;
  prevPoint: Vec4 | null = null;
  
  async checkActorFocus() {
    if (this.participants.activeActor) {
      let activeActor = this.participants.activeActor;
      const { actor, point } = this.cameraHitTest();

      if (
        this.updateFocus
        || (
          (actor ?? null) !== (this.prevActor ?? null)
          || ((point ?? null) === null && this.prevPoint !== null)
          || ((point ?? null) !== null && this.prevPoint === null)
          || (
            point !== undefined && this.prevPoint !== null && (
              point[0] !== this.prevPoint[0] || point[2] !== this.prevPoint[2]
            )
          )
        )
      ) {
        this.focused = actor ?? null;
        this.prevActor = actor ?? null;
        this.prevPoint = point ?? null;
        this.updateFocus = false;

        if (this.focusCallback) {
          if (this.focused) {
            this.focusCallback({
              name: this.focused.character.name,
              hitpoints: this.focused.character.hitPoints,
              temporaryHitpoints: this.focused.character.temporaryHitPoints,
              maxHitpoints: this.focused.character.maxHitPoints,
              armorClass: this.focused.character.armorClass,
              conditions: [
                ...this.focused.character.influencingActions.map((c) => ({ name: c.name, duration: c.duration })),
                ...this.focused.character.conditions.map((c) => ({ name: c, duration: 0 })),
              ]
            })  
          }
          else {
            this.focusCallback(null);
          }
        }  

        if (
          !activeActor.automated
          && activeActor.state !== States.scripting
        ) {
    
          const action = activeActor.getAction();

          if (action) {
            await action.prepareInteraction(actor ?? null, point ?? null, this)            
          }
        }
      }
    } else if (this.focused) {
      // this.mainRenderPass.removeDrawables(this.focused.sceneNode);
      this.focused = null;

      if (this.focusCallback) {
        this.focusCallback(null);
      }
    }
  }

  mouseWheel(deltaX: number, deltaY: number, x: number, y: number) {
    this.camera.changeRotation(-deltaX * 0.2);
  }

  updateDirection(direction: Vec4) {
    this.camera.moveDirection = direction;
  }

  interact() {
    if (
      this.participants.activeActor
      && !this.participants.activeActor.automated
      && this.participants.activeActor.state !== States.scripting
    ) {
      const activeActor = this.participants.activeActor;
      const script = new Script();

      const action = activeActor.getAction();

      if (action) {
        if (action.interact(script, this)) {
          if (action.time === 'Action') {
            if (activeActor.character.actionsLeft > 0) {
              activeActor.character.actionsLeft -= 1;
            }
          }
          else if (action.time === 'Bonus') {
            if (activeActor.character.bonusActionsLeft > 0) {
              activeActor.character.bonusActionsLeft -= 1;
            }
          }

          activeActor.setAction(null);

          if (activeActor.character.actionsLeft > 0) {
            activeActor.setDefaultAction();
          }
          else if (activeActor.distanceLeft > 0) {
            activeActor.setAction(new MoveAction(activeActor));
          }
          else if (this.actionInfoCallback) {
            this.actionInfoCallback(null)
          }
        }

        // Cause the focus to update.
        this.updateFocus =true;
      }

      if (script.entries.length > 0) {
        script.onFinish = () => {
          activeActor.state = States.idle;
        }
  
        this.actors.push(script);
        activeActor.state = States.scripting;
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

      // if (!this.participants.activeActor.automated) {
      //   this.mainRenderPass.addDrawable(this.reticle, 'reticle');
      // }
    } else {
      // this.mainRenderPass.removeDrawable(this.reticle, 'reticle');
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

  setLoggerCallback(callback: (message: string) => void) {
    this.loggerCallback = callback;
  }

  setFocusCallback(callback: (focusInfo: FocusInfo | null) => void) {
    this.focusCallback = callback;
  }

  setActionInfoCallback(callback: (actionInfo: ActionInfo | null) => void) {
    this.actionInfoCallback = callback;
  }

  setCharacterChangeCallback(callback: (actor: Actor | null) => void) {
    this.characterChangeCallback = callback;
  }

  setParties(parties: Party[]) {
    this.participants.setParties(parties);
  }
}

export default Renderer;
