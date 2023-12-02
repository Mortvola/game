import { Vec2, Vec3, Vec4, mat4, vec2, vec3, vec4 } from "wgpu-matrix";
import Camera from "./Camera";
import Gpu from "./Gpu";
import { anglesOfLaunch, degToRad, gravity, intersectionPlane, minimumVelocity, timeToTarget } from "./Math";
import ContainerNode from "./Drawables/ContainerNode";
import BindGroups, { lightsStructure } from "./BindGroups";
import RenderPass from "./RenderPass";
import Light, { isLight } from "./Drawables/LIght";
import CartesianAxes from "./Drawables/CartesianAxes";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import { isDrawableInterface } from "./Drawables/DrawableInterface";
import Reticle from "./Drawables/Reticle";
import { playShot } from "./Audio";
import Actor from "./Actor";
import Trajectory from "./Drawables/Trajectory";
import Line from "./Drawables/Line";
import { diceRoll } from "./Dice";

const requestPostAnimationFrame = (task: (timestamp: number) => void) => {
  requestAnimationFrame((timestamp: number) => {
    setTimeout(() => {
      task(timestamp);
    }, 0);
  });
};

type ShotData = {
  velocityVector: Vec2,
  startTime: number | null,
  duration: number,
  position: Vec4,
  startPos: Vec3,
  orientation: Vec4,
  actor: Actor,
};

class Renderer {
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

  shots: ShotData[] = [];

  shot: Mesh;

  actors: Actor[];

  playerTurn =  0;

  focused: Actor | null = null

  trajectory: Trajectory | null = null;

  path: Line | null = null;

  constructor(players: Actor[], shot: Mesh, reticle: Reticle) {
    this.aspectRatio[0] = 1.0;
    this.mainRenderPass.addDrawable(new CartesianAxes(), 'line');

    this.actors = players;

    for (const actor of players) {
      this.scene.addNode(actor.mesh);
      this.scene.addNode(actor.circle);
      this.mainRenderPass.addDrawable(actor.mesh, 'lit'); 
      this.mainRenderPass.addDrawable(actor.circle, 'circle')
    }

    for (const actor of this.actors) {
      actor.initiativeRoll = diceRoll(20) + actor.abilityModifier(actor.dexterity)
    }

    this.actors.sort((a, b) => a.initiativeRoll - b.initiativeRoll);

    this.playerTurn = 0;

    this.actors[0].startTurn();

    this.shot = shot;
    this.scene.addNode(shot);

    this.scene.addNode(reticle);
    this.mainRenderPass.addDrawable(reticle, 'reticle');
  }

  static async createParticipants(z: number, color: Vec4, teamColor: Vec4): Promise<Actor[]> {
    const actors: Actor[] = [];
    const numPlayers = 4;
    const spaceBetween = 4;
    const playerWidth = 4;

    for (let i = 0; i < numPlayers; i += 1 ) {
      const actor = await Actor.create(i.toString(), color, teamColor);
      actor.mesh.translate[0] = (i - ((numPlayers - 1) / 2))
        * spaceBetween + Math.random()
        * (spaceBetween - (playerWidth / 2)) - (spaceBetween - (playerWidth / 2)) / 2;
      actor.mesh.translate[2] = z + Math.random() * 10 - 5;

      actor.circle.translate = vec3.copy(actor.mesh.translate);
      actor.circle.translate[1] = 0;  

      actors.push(actor)
    }

    return actors;
  }

  static async create() {
    const players: Actor[] = await Renderer.createParticipants(10, vec4.create(0, 0, 0.5, 1), vec4.create(0, 0.6, 0, 1));

    const opponenets: Actor[] = await Renderer.createParticipants(-10, vec4.create(0.5, 0, 0, 1), vec4.create(1, 0, 0, 1));

    const shot = await Mesh.create(box(0.25, 0.25, 0.25, vec4.create(1, 1, 0, 1)));

    const reticle = await Reticle.create(0.05);
  
    return new Renderer([...players, ...opponenets], shot, reticle);
  }

  async setCanvas(canvas: HTMLCanvasElement) {
    if (!gpu) {
      throw new Error('Could not acquire device');
    }

    if (this.context) {
      this.context.unconfigure();
    }

    this.context = canvas.getContext("webgpu");
    
    if (!this.context) {
      throw new Error('context is null');
    }

    this.context.configure({
      device: gpu.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: "opaque",
    });
    
    this.camera.computeViewTransform();

    this.start();

    this.initialized = true;
  }

  endTurn() {
    if (this.actors.length > 0) {
      this.playerTurn = (this.playerTurn + 1) % this.actors.length;

      this.actors[this.playerTurn].startTurn();
    }
  }

  moveActors(elapsedTime: number) {
    for (const actor of this.actors) {
      if (actor.moveTo) {
        const distanceToTarget = vec2.distance(
          vec2.create(
            actor.mesh.translate[0],
            actor.mesh.translate[2],
          ),
          actor.moveTo,
        );

        if (actor.metersPerSecond * elapsedTime > distanceToTarget) {
          actor.mesh.translate[0] = actor.moveTo[0];
          actor.mesh.translate[2] = actor.moveTo[1];
          
          actor.circle.translate = vec3.copy(actor.mesh.translate);
          actor.circle.translate[1] = 0;  
    
          actor.moveTo = null;
        }
        else {
          let v = vec3.create(
            actor.moveTo[0] - actor.mesh.translate[0],
            0,
            actor.moveTo[1] - actor.mesh.translate[2],
          );

          v = vec3.normalize(v);

          v = vec3.mulScalar(v, elapsedTime * actor.metersPerSecond);

          actor.mesh.translate[0] += v[0];
          actor.mesh.translate[2] += v[2];  

          actor.circle.translate = vec3.copy(actor.mesh.translate);
          actor.circle.translate[1] = 0;  
        }
      }
    }
  }

  detectCollision(p1 : Vec4, p2: Vec4, filter?: (actor: Actor) => boolean): { actor: Actor, point: Vec4 } | null {
    const ray = vec4.subtract(p2, p1);
    let best: {
      actor: Actor,
      t: number,
    } | null = null;

    for (const actor of this.actors) {
      if (filter && !filter(actor)) {
        continue;
      }
      
      if (isDrawableInterface(actor.mesh)) {
        const result = actor.mesh.hitTest(p1, ray);

        if (result && result.t <= 1) {
          if (best === null || best.t > result.t) {
            best = {
              actor: actor,
              t: result.t,
            }
          }
        }
      }
    }

    if (best) {
      return {
        actor: best.actor,
        point: vec4.add(p1, vec4.mulScalar(ray, best.t)),
      }
    }

    return null;
  }

  moveShots(elapsedTime: number, timestamp: number) {
    // Update shot positions
    for (let i = 0; i < this.shots.length; i += 1) {
      const shot = this.shots[i];

      if (shot.startTime === null) {
        shot.startTime = timestamp;
      }
      else {
        const shotElapsedTime = (timestamp - shot.startTime) * 0.001;

        if (shotElapsedTime < shot.duration) {
          const xPos = shot.velocityVector[0] * shotElapsedTime;

          const xz = vec4.mulScalar(shot.orientation, xPos)

          const newPosition = vec4.create(
            shot.startPos[0] + xz[0],
            shot.startPos[1] + shot.velocityVector[1] * shotElapsedTime + 0.5 * gravity * shotElapsedTime * shotElapsedTime,
            shot.startPos[2] + xz[2],
            1
          )

          const result = this.detectCollision(shot.position, newPosition, (actor: Actor) => actor !== shot.actor);

          if (result) {
            shot.position = result.point;

            result.actor.hitPoints -= 10;

            if (result.actor.hitPoints <= 0) {
              console.log('actor destroyed')
            }

            this.shots = [
              ...this.shots.slice(0, i),
              ...this.shots.slice(i + 1),
            ]
  
            this.mainRenderPass.removeDrawable(this.shot, 'lit');

            i -= 1;  
          }
          else {
            shot.position = newPosition;
          }
        }
        else {
          this.shots = [
            ...this.shots.slice(0, i),
            ...this.shots.slice(i + 1),
          ]

          this.mainRenderPass.removeDrawable(this.shot, 'lit');

          i -= 1;
        }
      }
    }
  }

  updateFrame = (timestamp: number) => {
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

          // this.updateTimeOfDay(elapsedTime);
          this.camera.updatePosition(elapsedTime);

          this.moveShots(elapsedTime, timestamp);

          // Move actors
          this.moveActors(elapsedTime)

          this.checkHighlight();
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

  drawScene() {
    if (!gpu) {
      throw new Error('device is not set')
    }

    if (!this.context) {
      throw new Error('context is null');
    }

    if (!bindGroups.camera) {
      throw new Error('uniformBuffer is not set');
    }

    const lights: Light[] = [];

    // this.cursor.translate[0] = this.camera.position[0];
    // this.cursor.translate[2] = this.camera.position[2];

    if (this.shots.length > 0) {
      this.shot.translate[0] = this.shots[0].position[0];
      this.shot.translate[1] = this.shots[0].position[1];
      this.shot.translate[2] = this.shots[0].position[2];
    }

    this.scene.nodes.forEach((node) => {
      node.computeTransform()

      if (isLight(node)) {
        lights.push(node);
      }
    })

    if (this.context.canvas.width !== this.renderedDimensions[0]
      || this.context.canvas.height !== this.renderedDimensions[1]
    ) {
        const depthTexture = gpu.device!.createTexture({
          size: {width: this.context.canvas.width, height: this.context.canvas.height},
          format: "depth24plus",
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.depthTextureView = depthTexture.createView();

        this.aspectRatio[0] = this.context.canvas.width / this.context.canvas.height;

        this.camera.perspectiveTransform = mat4.perspective(
            degToRad(45), // settings.fieldOfView,
            this.aspectRatio[0],
            this.camera.near,  // zNear
            this.camera.far,   // zFar
        );

        this.camera.orthographicTransform = mat4.ortho(
          -this.context.canvas.width / 80,
          this.context.canvas.width / 80,
          -this.context.canvas.height / 80,
          this.context.canvas.height/ 80,
          // this.near, this.far,
          -200, 200,
        );
    
        this.renderedDimensions = [this.context.canvas.width, this.context.canvas.height]
    }


    const view = this.context.getCurrentTexture().createView();

    if (this.camera.projection === 'Perspective') {
      gpu.device.queue.writeBuffer(bindGroups.camera.buffer[0], 0, this.camera.perspectiveTransform as Float32Array);      
    }
    else {
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
      count: lights.length,
      lights: lights.map((light) => ({
        position: vec4.transformMat4(
          vec4.create(light.translate[0], light.translate[1], light.translate[2], 1),
          inverseViewtransform,
        ),
        color: light.lightColor,
      })),
    });

    gpu.device.queue.writeBuffer(bindGroups.camera.buffer[4], 0, lightsStructure.arrayBuffer);

    const commandEncoder = gpu.device.createCommandEncoder();

    this.mainRenderPass.render(view, this.depthTextureView!, commandEncoder)

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
  }

  pointerUp(x: number, y: number) {
  }

  checkHighlight() {
    const activeActor = this.actors[this.playerTurn];

    // Transform camera position (not including offset0) to camera space
    let ray = vec4.normalize(vec4.transformMat4(this.camera.position, mat4.inverse(this.camera.viewTransform)));
    ray[3] = 0;
    let origin = vec4.create(0, 0, 0, 1);

    // Transform from camera to world
    ray = vec4.transformMat4(ray, this.camera.viewTransform);
    origin = vec4.transformMat4(origin, this.camera.viewTransform);

    // Determine if an actor should be highlighted but
    // don't check the active actor.
    let best: {
      actor: Actor
      t: number,
    } | null = null;

    for (let actor of this.actors) {
      if (actor !== activeActor && isDrawableInterface(actor.mesh)) {
        const result = actor.mesh.hitTest(origin, ray)
        
        if (result) {
          if (best === null || result.t < best.t) {
            best = {
              actor,
              t: result.t,
            }
          }
        }    
      }
    }

    if (best) {
      if (!this.focused || this.focused !== best.actor) {
        if (this.focused) {
          this.mainRenderPass.removeDrawable(this.focused.mesh,  'outline');
          this.focused = null;           
        }

        if (this.trajectory) {
          this.mainRenderPass.removeDrawable(this.trajectory, 'trajectory')
          this.trajectory = null;
        }  

        this.focused = best.actor;

        this.mainRenderPass.addDrawable(this.focused.mesh, 'outline');

        // If the active actor has actions left then
        // render a trajectory from it to the highlighted actor.
        if (activeActor.actionsLeft > 0) {
          const result = this.computeShotData(activeActor, this.focused);

          this.trajectory = new Trajectory({
            velocityVector: result.velocityVector,
            duration: result.duration,
            startPos: result.startPos,
            orientation: result.orientation,
            distance: result.distance,
          })
  
          this.mainRenderPass.addDrawable(this.trajectory, 'trajectory')  

          if (this.path) {
            this.mainRenderPass.removeDrawable(this.path, 'line');
          }    
        }
      }
    }
    else { 
      if (this.focused) {
        this.mainRenderPass.removeDrawable(this.focused.mesh,  'outline');
        this.focused = null;

        if (this.trajectory) {
          this.mainRenderPass.removeDrawable(this.trajectory, 'trajectory')
          this.trajectory = null;
        }
      }

      // Draw path to destination

      if (this.path) {
        this.mainRenderPass.removeDrawable(this.path, 'line');
      }

      if (activeActor.distanceLeft > 0) {
        const { start, target } = this.computePath(activeActor, this.camera.position);

        this.path = new Line(
          start,
          target,
          vec4.create(1, 1, 1, 1),
        )
  
        this.mainRenderPass.addDrawable(this.path, 'line')  
      }
    }
  }

  mouseWheel(deltaX: number, deltaY: number, x: number, y: number) {
    this.camera.changeRotation(-deltaX * 0.2)
  }

  updateDirection(direction: Vec4) {
    this.camera.moveDirection = direction;
  }

  computeShotData(actor: Actor, targetActor: Actor) {
    // Transforms the position to world space.
    const target = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      targetActor.mesh.transform,
    );
    target[1] = targetActor.chestHeight;

    const startPos = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      actor.mesh.transform,
    )
    startPos[1] = actor.chestHeight;

    const distance = vec2.distance(
      vec2.create(startPos[0], startPos[2]),
      vec2.create(target[0], target[2]),
    );

    // The endY is the negative height of the launcher.
    const minVelocity = minimumVelocity(distance, target[1] - startPos[1]);

    const velocity = Math.max(50, minVelocity);

    const [lowAngle] = anglesOfLaunch(velocity, distance, target[1] - startPos[1]);

    const timeLow = timeToTarget(distance, velocity, lowAngle);

    const angle = Math.atan2(target[0] - actor.mesh.translate[0], target[2] - actor.mesh.translate[2]);
    const rotate = mat4.rotationY(angle);

    const orientation = vec3.normalize(vec4.transformMat4(vec4.create(0, 0, 1, 0), rotate))
    orientation[3] = 0;
   
    return ({
      velocityVector: vec2.create(velocity * Math.cos(lowAngle), velocity * Math.sin(lowAngle)),
      startTime: null, // start time will be assigned at the next frame.
      duration: timeLow,
      startPos,
      orientation,
      distance,
    })
  }

  addShot(actor: Actor) {
    if (this.focused) {
      const result = this.computeShotData(actor, this.focused);

      const data: ShotData = {
        velocityVector: result.velocityVector,
        duration: result.duration,
        orientation: result.orientation,
        startPos: result.startPos,
        position: result.startPos,
        startTime: null, // start time will be assigned at the next frame.
        actor,
      }

      this.shots.push(data);
      
      // Transforms the position to world space.
      const emitterPosition = vec4.transformMat4(
        vec4.create(0, actor.chestHeight, 0, 1),
        actor.mesh.transform,
      );

      playShot(emitterPosition);

      this.mainRenderPass.addDrawable(this.shot, 'lit');

      // Remove any previously drawn trajectory.
      if (this.trajectory) {
        this.mainRenderPass.removeDrawable(this.trajectory, 'trajectory')
        this.trajectory = null;
      }

      actor.actionsLeft -= 1;
    }
  }

  computePath(actor: Actor, dest: Vec4): { start: Vec4, target: Vec4, distance: number } {
    let target = vec2.create(dest[0], dest[2]);

    const position = actor.getWorldPosition();

    const start = vec2.create(position[0], position[2]);

    let distance = vec2.distance(start, target)

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
    const { origin, ray} = this.camera.computeHitTestRay(0, 0);

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

  takeAction() {
    const actor = this.actors[this.playerTurn];

    if (this.focused) {
      if (this.focused !== actor) {
        this.addShot(actor)
      }
    }
    else {
      this.moveActor(actor);
    }
  }
}

export const gpu = await Gpu.create();
export const bindGroups = new BindGroups();
export const renderer = await Renderer.create();

export default Renderer;

