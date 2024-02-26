import React from 'react';
import './App.scss';
import { game } from '../Main';
import { vec4 } from 'wgpu-matrix';
import DefineParties from './DefineParty';
import { restoreParties, storeParties } from '../Character/CharacterStorage';
import Messages from './Messages';
import Focused from './Focused';
import { CreatureActorInterface, FocusInfo, Party } from '../types';
import { gpu } from "../Renderer/Gpu";

type DiretionKeys = {
  left: number,
  right: number,
  forward: number,
  backward: number,
}

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const movement = React.useRef<DiretionKeys>({
    left: 0,
    right: 0,
    forward: 0,
    backward: 0,
  })

  const [pointerLocked, setPointerLocked] = React.useState<boolean>(false)

  React.useEffect(() => {
    const element = canvasRef.current;

    if (element) {
      element.focus();

      (async () => {
        await game.setCanvas(element);
      })()

      const lockChange = () => {
        setPointerLocked(document.pointerLockElement === element)
      }

      document.addEventListener('pointerlockchange', lockChange, )

      return (() => {
        document.removeEventListener('pointerlockchange', lockChange)
      })
    }
  }, [])

  const [messages, setMessages] = React.useState<{ id: number, message: string }[]>([]);

  const loggerCallback = React.useCallback((message: string) => {
    setMessages((prev) => (
      [
        ...prev,
        {
          id: prev.length === 0 ? 0 : prev[prev.length - 1].id + 1,
          message,
        }
      ]
      .slice(-4)
    ));  
  }, [])

  React.useEffect(() => {
    const element = canvasRef.current;

    if (element) {
      element.focus();
      (async () => {
        game.setLoggerCallback(loggerCallback);
      })()  
    }
  }, [loggerCallback])

  const handlePointerDown: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      // element.setPointerCapture(event.pointerId);
      if (!pointerLocked) {
        element.requestPointerLock()
      }
      else {
        // const rect = element.getBoundingClientRect();

        // const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
        // const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
        // game?.pointerDown(clipX, clipY);

        if (event.metaKey) {
          // game?.centerOn(clipX, clipY)
        }
        else if (!event.ctrlKey) {
          game?.interact()
        }
      }
    }
  }

  const [pointPosition, setPointerPosition] = React.useState<{ x: number, y: number }>({ x: 0, y: 0})

  const handlePointerMove: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();

      if (!pointerLocked) {
        setPointerPosition({ x: event.clientX, y: event.clientY })

        const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
        const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
        game?.pointerMove(clipX, clipY);  
      }
      else {
        setPointerPosition((prev) => {
          const newPoint = { x: prev.x + event.movementX, y: prev.y + event.movementY}

          const clipX = ((newPoint.x - rect.left) / element.clientWidth) * 2 - 1;
          const clipY = 1 - ((newPoint.y - rect.top) / element.clientHeight) * 2;  

          game?.pointerMove(clipX, clipY);  
  
          return newPoint
        })
      }
    }
  }

  const handlePointerLeave: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    game?.pointerLeft();
  }

  const handlePointerUp: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      // element.releasePointerCapture(event.pointerId);
      // // const rect = element.getBoundingClientRect();

      // const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
      // const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
      // game?.pointerUp(clipX, clipY);
    }
  }

  const handleWheel: React.WheelEventHandler<HTMLCanvasElement> = (event) => {
    game?.mouseWheel(event.deltaX, event.deltaY, event.clientX, event.clientY)

    event.stopPropagation();
  }

  React.useEffect(() => {
    const element = canvasRef.current;

    if (element) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const dpr = Math.max(devicePixelRatio, 2);

          const width = entry.devicePixelContentBoxSize?.[0].inlineSize ??
            entry.contentBoxSize[0].inlineSize * dpr;
          const height = entry.devicePixelContentBoxSize?.[0].blockSize ??
            entry.contentBoxSize[0].blockSize * dpr;

          const canvas = entry.target as HTMLCanvasElement;
          canvas.width = Math.max(1, Math.min(width, gpu.device.limits.maxTextureDimension2D ?? 1));
          canvas.height = Math.max(1, Math.min(height, gpu?.device.limits.maxTextureDimension2D ?? 1));

          const scaleX = canvas.width / entry.contentRect.width * window.devicePixelRatio
          const scaleY = canvas.height / entry.contentRect.height * window.devicePixelRatio

          // console.log(visualViewport?.scale)
          // console.log(`inner: ${window.innerWidth}, ${window.innerHeight}, canvas ${canvas.width}, ${canvas.height}, content: ${entry.contentRect.width}, ${entry.contentRect.height}`)
          game?.renderer.canvasResize(canvas.width, canvas.height, scaleX, scaleY, entry.contentRect.width, entry.contentRect.height)
        }
      })

      try {
        resizeObserver.observe(element, { box: 'device-pixel-content-box' });
      }
      catch (error) {
        resizeObserver.observe(element, { box: 'content-box' });
      }

      return () => resizeObserver.disconnect();
    }
  }, []);

  const updateDirection = React.useCallback(() => {
    const direction = vec4.normalize(vec4.create(
      movement.current.right - movement.current.left,
      0,
      movement.current.backward - movement.current.forward,
      0,
    ))

    game?.updateDirection(direction);
  }, [])

  const handleKeyDown = React.useCallback((key: string) => {
    const upperKey = key.toUpperCase();
    switch (upperKey) {
      case 'E':
        movement.current.forward = 1;
        updateDirection()
        break;
      case 'D':
        movement.current.backward = 1;
        updateDirection()
        break;
      case 'F':
        movement.current.right = 1;
        updateDirection()
        break;
      case 'S':
        movement.current.left = 1;
        updateDirection()
        break;
      case ' ':
        game.endTurn();
        break;
      case 'ARROWDOWN':
        game.zoomOut();
        break;
      case 'ARROWUP':
        game.zoomIn();
        break;
    }
  }, [updateDirection])

  const handleKeyUp = React.useCallback((key: string) => {
    const upperKey = key.toUpperCase();
    switch (upperKey) {
      case 'E':
        movement.current.forward = 0;
        updateDirection()
        break;
      case 'D':
        movement.current.backward = 0;
        updateDirection()
        break;
      case 'F':
        movement.current.right = 0;
        updateDirection()
        break;
      case 'S':
        movement.current.left = 0;
        updateDirection()
        break;
    }
  }, [updateDirection])

  React.useEffect(() => {
    document.body.onkeydown = (e) => {
      handleKeyDown(e.key)
    }

    document.body.onkeyup = (e) => {
      handleKeyUp(e.key)
    }
  }, [handleKeyDown, handleKeyUp])

  const [inputMode, setInputMode] = React.useState('Mouse');

  const handleInputModeClick = () => {
    game.toggleInputMode();
    setInputMode((prev) => prev === 'Controller' ? 'Mouse' : 'Controller')
  }

  const [showPartyDefs, setShowPartyDefs] = React.useState<boolean>(false);
  const [parties, setParties] = React.useState<Party[]>([
    { members: [], automate: false },
    { members: [], automate: false },
  ]);

  const handleDefinePartiesClick = () => {
    setShowPartyDefs(true);
  }

  const handleHideParties = () => {
    setShowPartyDefs(false);
  }

  const handlePartySave = (parties: Party[]) => {
    setShowPartyDefs(false);
    setParties(parties);
    game.setParties(parties);

    storeParties(parties);
  }

  React.useEffect(() => {
    const parties = restoreParties();
    setParties(parties);
    game.setParties(parties);
  }, [])

  return (
    <div
      className="App"
    >
      <div className="upper-left">
        <div className="controls">
          <button type="button" onClick={handleDefinePartiesClick}>Define Party</button>
          {/* <button type="button" onClick={handlePlayClick}>play</button> */}
          <button type="button" onClick={handleInputModeClick}>
            {
              inputMode === 'Mouse'
                ? 'Mouse & Keyboard'
                : 'Controller'
            }
          </button>
        </div>
      </div>
      <div className="upper-center" />
      <div className="upper-right" />
      {
        showPartyDefs
          ? (
            <DefineParties parties={parties} onHide={handleHideParties} onSave={handlePartySave} />
          )
          : null
      }
      <canvas
        ref={canvasRef}
        tabIndex={0}
        autoFocus
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onWheel={handleWheel}
      />
      <div className="lower-left" />
      <div className="lower-center" />
      <div className="lower-right">
        <Messages messages={messages} />
      </div>
    </div>
  );
}

export default App;
