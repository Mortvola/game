/* eslint-disable no-restricted-syntax */
import { Vec4, vec2, vec4 } from 'wgpu-matrix';
import { intersectionPlane } from './Renderer/Math';
import { isContainerNode } from './Renderer/Drawables/SceneNodes/ContainerNode';
import Line from './Renderer/Drawables/Line';
import Collidees from './Collidees';
import Participants, { ParticipantsState } from './Participants';
import Script from './Script/Script';
import { Occupant } from './Workers/PathPlannerTypes';
import { ActionInfo, ActorInterface, CreatureActorInterface, FocusInfo, States, WorldInterface, EpisodeInfo, Party } from './types';
import Renderer from './Renderer/Renderer';
import SceneNode2d from './Renderer/Drawables/SceneNodes/SceneNode2d';
import { sceneObjectlManager } from './SceneObjectManager';
import FlexBox from './Renderer/Drawables/SceneNodes/FlexBox';
import { font } from './Font';
import TextBox from './Renderer/Drawables/SceneNodes/TextBox';
import Material from './Renderer/Materials/Material';

const requestPostAnimationFrame = (task: (timestamp: number) => void) => {
  requestAnimationFrame((timestamp: number) => {
    setTimeout(() => {
      task(timestamp);
    }, 0);
  });
};

class Game implements WorldInterface {
  initialized = false;

  renderer: Renderer;

  render = true;

  previousTimestamp: number | null = null;

  startFpsTime: number | null = null;

  framesRendered = 0;

  onFpsChange?: (fps: number) => void;

  left = 0;

  right = 0;

  forward = 0;

  backward = 0;

  actors: ActorInterface[] = [];

  removeActors: ActorInterface[] = [];

  // lights: Light[] = [];

  participants = new Participants();

  focused: CreatureActorInterface | null = null;

  path2: Line | null = null;

  path3: Line | null = null;

  path4: Line | null = null;

  reticle: SceneNode2d;

  reticlePosition = vec2.create(0, 0);

  inputMode: 'Mouse' | 'Controller' = 'Mouse';

  collidees = new Collidees();

  scoreCallback: ((episode: EpisodeInfo) => void) | null = null;

  loggerCallback: ((message: string) => void) | null = null;
  
  focusCallback: ((focusInfo: FocusInfo | null) => void) | null = null;

  actionInfoCallback: ((actionInfo: ActionInfo | null) => void) | null = null;

  characterChangeCallback: ((character: CreatureActorInterface | null) => void) | null = null;

  animate = true;

  followActiveCharacter = false;

  endOfRound = true;

  occupants: Occupant[] = [];

  constructor(renderer: Renderer, reticle: SceneNode2d) {
    this.renderer = renderer;

    this.renderer.camera.offset = 18;
    this.renderer.camera.position = vec4.create(0, 0, 20, 1);

    this.reticle = reticle;
    // this.renderer.scene2d.nodes.push(this.reticle)
  }

  static async create() {
    const renderer = await Renderer.create();
    
    // const reticle = await DrawableNode.create(await Reticle.create(-reticleWidth / 2, reticleHeight / 2, reticleWidth, reticleHeight))
    const r = await sceneObjectlManager.getSceneObject2d('Reticle')

    const reticle = new SceneNode2d()
    reticle.x = r.x;
    reticle.y = r.y;
    reticle.width = r.width
    reticle.height = r.height
    reticle.material = r.material

    const game = new Game(renderer, reticle);

    await game.addUI()

    return game;
  }

  async addUI() {
    const green = new SceneNode2d()

    green.width = 53
    green.height = 53
    green.color = [0, 0.5, 0, 1]
    green.margin = { left: 8, top: 24, right: 4, bottom: 24 }
    green.border = { color: [1, 1, 1, 1], width: 1 }
    green.nodes.push(await TextBox.create('Range'));

    const blue = new SceneNode2d()

    blue.width = 53
    blue.height = 53
    blue.color = [0, 0.0, 0.5, 1]
    blue.margin = { left: 4, top: 4, right: 8, bottom: 4 }
    blue.border = { color: [1, 1, 1, 1], width: 1 }
    blue.nodes.push(await TextBox.create('Melee'))

    const flex = new FlexBox()

    flex.color = [0.25, 0, 0, 1]
    flex.border = { color: [1, 1, 1, 1], width: 1 }

    flex.nodes.push(green, blue)
    
    // this.renderer.scene2d.addNode(flex)
    this.renderer.scene2d.addNode(flex)
  }

  async setCanvas(canvas: HTMLCanvasElement) {
    this.renderer.setCanvas(canvas);

    this.start();

    this.initialized = true;
  }

  startTurn() {
    if (this.participants.activeActor) {
      if (this.participants.activeActor.automated) {
        // this.renderer.scene.removeNode(this.reticle);

        if (this.characterChangeCallback) {
          this.characterChangeCallback(null);
        }
      } else {
        // if (this.inputMode === 'Controller') {
          // this.renderer.scene.addNode(this.reticle);
        // }

        if (this.characterChangeCallback) {
          this.characterChangeCallback(this.participants.activeActor);
        }
      }

      this.participants.activeActor.startTurn();

      const point = this.participants.activeActor.getWorldPosition();

      if (this.animate && this.followActiveCharacter) {
        this.renderer.camera.moveCameraTo = point;
        this.renderer.camera.moveCameraStartTime = null;  
      }
    }
  }

  endTurn2(actor: CreatureActorInterface) {
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

      const remove = await actor.update(elapsedTime, timestamp);

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

      this.participants.remove(removedActor as CreatureActorInterface);

      this.collidees.remove(removedActor as CreatureActorInterface);
      this.renderer.scene.removeNode((removedActor as CreatureActorInterface).sceneObject.sceneNode);
    }

    this.removeActors = [];
  }

  async prepareTeams() {
    // Remove any current participants
    for (const actor of this.participants.turns) {
      actor.setAction(null);

      this.renderer.scene.removeNode(actor.sceneObject.sceneNode);

      this.collidees.remove(actor);
      this.actors.push(actor);
    }

    this.actors = [];

    if (this.focusCallback) {
      this.focusCallback(null);
    }

    // Set up teams.
    await this.participants.createTeams(this);

    this.participants.initiativeRolls();

    for (const actor of this.participants.turns) {
      this.renderer.scene.addNode(actor.sceneObject.sceneNode);
      this.collidees.actors.push(actor);
      this.actors.push(actor);
    }

    // this.renderer.scene.updateTransforms(undefined, this);

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

          for (const particleSystem of this.renderer.particleSystems) {
            particleSystem.update(timestamp, elapsedTime, this.renderer.scene)
          }

          this.renderer.camera.updatePosition(elapsedTime, timestamp);

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

        this.renderer.drawScene(timestamp);

        this.previousTimestamp = timestamp;
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

  pointerDown(x: number, y: number) {
  }

  pointerDeltaMove(xDelta: number, yDelta: number) {
    this.pointerMove(this.reticlePosition[0] + xDelta, this.reticlePosition[1] + yDelta)
  }

  pointerMove(x: number, y: number) {
    // Pan the view if the mouse is near the edge of the window.
    if (this.inputMode === 'Mouse') {
      this.reticlePosition[0] = x;
      this.reticlePosition[1] = y;

      this.reticle.x = this.reticlePosition[0] - (this.reticle.width as number) / 2
      this.reticle.y = this.reticlePosition[1] + (this.reticle.height as number) / 2 * this.renderer.aspectRatio[0]
      
      const { origin, ray } = this.renderer.camera.computeHitTestRay(this.reticlePosition[0], this.reticlePosition[1]);

      const point = intersectionPlane(vec4.create(0, 0, 0, 1), vec4.create(0, 1, 0, 0), origin, ray);

      if (point) {
        this.renderer.camera.setRotatePoint(point)
      }

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
    this.renderer.camera.moveDirection = vec4.create(0, 0, 0, 0);
  }

  pointerUp(x: number, y: number) {
  }

  cameraHitTest(): { actor?: CreatureActorInterface, point?: Vec4 } {
    const { origin, ray } = this.renderer.camera.computeHitTestRay(this.reticlePosition[0], this.reticlePosition[1]);

    // Determine if an actor should be highlighted but
    // don't check the active actor.
    let best: {
      actor: CreatureActorInterface
      t: number,
    } | null = null;

    for (const actor of this.participants.turns) {
      if (isContainerNode(actor.sceneObject.sceneNode)) {
        const result = actor.sceneObject.sceneNode.modelHitTest(origin, ray);

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
  prevActor: CreatureActorInterface | null = null;
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
            await action.prepareInteraction(actor ?? null, point ?? null)            
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
    this.renderer.camera.changeRotation(-deltaX * 0.2, 0);
  }

  updateDirection(direction: Vec4) {
    this.renderer.camera.moveDirection = direction;
  }

  async interact() {
    if (
      this.participants.activeActor
      && !this.participants.activeActor.automated
      && this.participants.activeActor.state !== States.scripting
    ) {
      const activeActor = this.participants.activeActor;
      const script = new Script(this);

      const action = activeActor.getAction();

      if (action) {
        if (await action.interact(script)) {
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
            activeActor.setMoveAction();
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
      this.renderer.camera.moveCameraTo = point;
      this.renderer.camera.moveCameraStartTime = null;
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
    this.renderer.camera.offset += 1;
    this.renderer.camera.rotateX -= 1;
  }

  zoomIn() {
    this.renderer.camera.offset -= 1;
    this.renderer.camera.rotateX += 1;
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

  setCharacterChangeCallback(callback: (actor: CreatureActorInterface | null) => void) {
    this.characterChangeCallback = callback;
  }

  setParties(parties: Party[]) {
    this.participants.setParties(parties);
  }
}

export default Game;
