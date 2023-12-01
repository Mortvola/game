import { Vec2, Vec4, mat4, quat, vec2, vec3, vec4 } from "wgpu-matrix";
import Camera from "./Camera";
import Gpu from "./Gpu";
import { anglesOfLaunch, degToRad, gravity, minimumVelocity, timeToTarget } from "./Math";
import ContainerNode from "./Drawables/ContainerNode";
import BindGroups, { lightsStructure } from "./BindGroups";
import Circle from "./Drawables/Circle";
import RenderPass from "./RenderPass";
import Light, { isLight } from "./Drawables/LIght";
import CartesianAxes from "./Drawables/CartesianAxes";
import SceneNode from "./Drawables/SceneNode";
import Mesh from "./Drawables/Mesh";
import { box } from "./Drawables/Shapes/box";
import DrawableInterface from "./Drawables/DrawableInterface";
import Reticle from "./Drawables/Reticle";
import { audioContext, sound } from "./Audio";

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
  angle: number,
  player: Mesh,
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

  // cursor: SceneNode;

  turnIndicator: SceneNode;

  left = 0;
  
  right = 0;

  forward = 0;

  backward = 0;

  shots: ShotData[] = [];

  shot: Mesh;

  static launcherHeight = 2;

  players: Mesh[];

  playerTurn =  0;

  highlight: DrawableInterface | null = null

  constructor(players: Mesh[], shot: Mesh, reticle: Reticle) {
    this.aspectRatio[0] = 1.0;
    this.mainRenderPass.addDrawable(new CartesianAxes(), 'line');

    // this.cursor = new Circle(2, 0.1, vec4.create(1, 0, 0, 1));    
    const q = quat.fromEuler(degToRad(270), 0, 0, "xyz");
    // this.cursor.postTransforms.push(mat4.fromQuat(q));
    // this.cursor.translate = vec4.create(0, 0, 50);

    this.turnIndicator = new Circle(4, 0.1, vec4.create(1, 1, 1, 1));
    this.turnIndicator.postTransforms.push(mat4.fromQuat(q));

    // this.scene.addNode(this.cursor);
    // this.mainRenderPass.addDrawable(this.cursor, 'circle')

    this.scene.addNode(this.turnIndicator);
    this.mainRenderPass.addDrawable(this.turnIndicator, 'circle')

    this.players = players;

    for (const player of players) {
      this.scene.addNode(player);
      this.mainRenderPass.addDrawable(player, 'lit');  
    }

    this.playerTurn = this.players.length - 1;
    this.nextTurn();

    this.shot = shot;
    this.scene.addNode(shot);
    this.mainRenderPass.addDrawable(shot, 'lit');

    this.scene.addNode(reticle);
    this.mainRenderPass.addDrawable(reticle, 'reticle');
  }

  static async createParticipants(z: number, color: Vec4) {
    const players: Mesh[] = [];
    const numPlayers = 4;
    const spaceBetween = 12;
    const playerWidth = 4;

    for (let i = 0; i < numPlayers; i += 1 ) {
      const player = await Mesh.create(box(playerWidth, Renderer.launcherHeight, playerWidth, color))
      player.translate[0] = (i - ((numPlayers - 1) / 2)) * spaceBetween + Math.random() * (spaceBetween - (playerWidth / 2)) - (spaceBetween - (playerWidth / 2)) / 2;
      player.translate[1] = Renderer.launcherHeight / 2;  
      player.translate[2] = z + Math.random() * 10 - 5;

      players.push(player)
    }

    return players;
  }

  static async create() {
    const players = await Renderer.createParticipants(50, vec4.create(0, 0, 0.5, 1));

    const opponenets = await Renderer.createParticipants(-50, vec4.create(0.5, 0, 0, 1));

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

  nextTurn() {
    this.playerTurn = (this.playerTurn + 1) % this.players.length;

    this.turnIndicator.translate = vec3.copy(this.players[this.playerTurn].translate);
    this.turnIndicator.translate[1] = 0;
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

          // Update shot positions
          for (let i = 0; i < this.shots.length; i += 1) {
            const shot = this.shots[i];

            if (shot.startTime === null) {
              shot.startTime = timestamp;
            }
            else {
              const shotElapsedTime = (timestamp - shot.startTime) * 0.001;

              if (shotElapsedTime < shot.duration) {
                const player = shot.player;

                shot.position = vec4.create(
                  0,
                  Renderer.launcherHeight + shot.velocityVector[1] * shotElapsedTime + 0.5 * gravity * shotElapsedTime * shotElapsedTime,
                  0 + shot.velocityVector[0] * shotElapsedTime,
                  1
                )

                const translate1 = mat4.translation(
                  vec3.create(player.translate[0], 0, player.translate[2]),
                );
                const translate2 = mat4.translation(shot.position);

                const rotate = mat4.rotationY(shot.angle);

                const transform = mat4.identity();
                mat4.multiply(transform, translate1, transform)
                mat4.multiply(transform, rotate, transform)
                mat4.multiply(transform, translate2, transform)
            
                vec4.transformMat4(vec4.create(0, 0, 0, 1), transform, shot.position)
              }
              else {
                this.shots = [
                  ...this.shots.slice(0, i),
                  ...this.shots.slice(i + 1),
                ]

                i -= 1;
                this.nextTurn();
              }
            }
          }
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

  checkHighligh() {
    // Transform camera position (not including offset0) to camera space
    let ray = vec4.normalize(vec4.transformMat4(this.camera.position, mat4.inverse(this.camera.viewTransform)));
    ray[3] = 0;
    let origin = vec4.create(0, 0, 0, 1);

    // Transform from camera to world
    ray = vec4.transformMat4(ray, this.camera.viewTransform);
    origin = vec4.transformMat4(origin, this.camera.viewTransform);

    // console.log(`origin: ${origin}, ray: ${ray}`)

    const result = this.scene.modelHitTest(origin, ray);

    if (result) {
      if (!this.highlight || this.highlight !== result.drawable) {
        if (this.highlight) {
          this.mainRenderPass.removeDrawable(this.highlight,  'outline');

          this.highlight = null;    
        }

        this.highlight = result.drawable;

        this.mainRenderPass.addDrawable(this.highlight, 'outline');
      }
    }
    else if (this.highlight) {
      this.mainRenderPass.removeDrawable(this.highlight,  'outline');

      this.highlight = null;
    }
  }

  mouseWheel(deltaX: number, deltaY: number, x: number, y: number) {
    this.camera.changeRotation(-deltaX * 0.2)

    this.checkHighligh();
  }

  moveForward(v: number) {
    this.forward = v;

    this.camera.moveDirection = vec4.normalize(vec4.create(
      this.right - this.left,
      0,
      this.backward - this.forward,
      0,
    ))

    this.checkHighligh();
  }

  moveBackward(v: number) {
    this.backward = v;

    this.camera.moveDirection = vec4.normalize(vec4.create(
      this.right - this.left,
      0,
      this.backward - this.forward,
      0,
    ))

    this.checkHighligh();
  }

  moveRight(v: number) {
    this.right = v;

    this.camera.moveDirection = vec4.normalize(vec4.create(
      this.right - this.left,
      0,
      this.backward - this.forward,
      0,
    ))

    this.checkHighligh();
  }

  moveLeft(v: number) {
    this.left = v;

    this.camera.moveDirection = vec4.normalize(vec4.create(
      this.right - this.left,
      0,
      this.backward - this.forward,
      0,
    ))

    this.checkHighligh();
  }

  fire() {
    const player = this.players[this.playerTurn];

    const distance = vec2.distance(
      vec2.create(player.translate[0], player.translate[2]),
      vec2.create(this.camera.position[0], this.camera.position[2]),
    );

    // Transforms the position to world space.
    const emitterPosition = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      player.transform,
    );

    sound.panner.positionX.value = emitterPosition[0];
    sound.panner.positionY.value = emitterPosition[1];
    sound.panner.positionZ.value = emitterPosition[2];

    const listener = audioContext.listener;

    const listenerPosition = vec4.transformMat4(
      vec4.create(0, 0, 0, 1),
      this.camera.viewTransform,
    )

    listener.positionX.value = listenerPosition[0];
    listener.positionY.value = listenerPosition[1];
    listener.positionZ.value = listenerPosition[2];

    const listenerOrientation = vec4.transformMat4(
      vec4.create(0, 0, -1, 0),
      this.camera.viewTransform,
    )

    listener.forwardX.value = listenerOrientation[0];
    listener.forwardY.value = listenerOrientation[1];
    listener.forwardZ.value = listenerOrientation[2];

    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;

    sound.source = audioContext.createBufferSource();
    sound.source.connect(sound.volume);
    sound.source.buffer = sound.buffer;
    sound.source.start(audioContext.currentTime)

    // The endY is the negative height of the launcher.
    const minVelocity = minimumVelocity(distance, -Renderer.launcherHeight);

    const velocity = Math.max(50, minVelocity);

    const [lowAngle] = anglesOfLaunch(velocity, distance, -Renderer.launcherHeight);

    const timeLow = timeToTarget(distance, velocity, lowAngle);
    // const timeHigh = timeToTarget(distance, velocity, highAngle);

    const data: ShotData = {
      velocityVector: vec2.create(velocity * Math.cos(lowAngle), velocity * Math.sin(lowAngle)),
      startTime: null, // start time will be assigned at the next frame.
      duration: timeLow,
      position: vec4.create(0, Renderer.launcherHeight, 0, 1),
      angle: Math.atan2(this.camera.position[0] - player.translate[0], this.camera.position[2] - player.translate[2]),
      player,
    }

    // console.log(`distance: ${distance}, duration: ${data.duration}, v: ${minVelocity}, angle: ${radToDeg(lowAngle)}`)

    this.shots.push(data);
    
    // const rotationX = Math.atan2(this.camera.position[0], this.camera.position[2]); // Math.asin(this.camera.position[0] / distance);
    // console.log(radToDeg(rotationX));

    // console.log(`distance: ${distance}, velocity: ${velocity}, low angle: ${radToDeg(lowAngle)}, high angle: ${radToDeg(highAngle)}, time: ${timeLow}, ${timeHigh}`);
  }
}

export const gpu = await Gpu.create();
export const bindGroups = new BindGroups();
export const renderer = await Renderer.create();

export default Renderer;

