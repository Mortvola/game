import React from 'react';
import './App.scss';
import { gpu, renderer } from '../Renderer';
import { vec4 } from 'wgpu-matrix';
import DefineParties from './DefineParty';
import { restoreParties, storeParties } from '../Character/CharacterStorage';
import { WorkerMessage, worker, workerQueue } from '../WorkerQueue';
import Messages from './Messages';
import { Party } from './PartyList';
import ActionBar from './Actions/ActionBar';
import { ActionInfo, FocusInfo } from '../WorldInterface';
import StatusBar from './StatusBar/StatusBar';
import Focused from './Focused';
import Actor from '../Character/Actor';

type DiretionKeys = {
  left: number,
  right: number,
  forward: number,
  backward: number,
}

function App() {
  const [hasFocus, setHasFocus] = React.useState<boolean>(false); 
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const movement = React.useRef<DiretionKeys>({
    left: 0,
    right: 0,
    forward: 0,
    backward: 0,
  })

  React.useEffect(() => {
    const element = canvasRef.current;

    if (element) {
      element.focus();

      (async () => {
        await renderer.setCanvas(element);
      })()  
    }
  }, [])

  const [rewards, setRewards] = React.useState<unknown[]>([["episode", "max", "mean", "min"]]);

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

  const [focus, setFocus] = React.useState<FocusInfo | null>(null);

  const focusCallback = React.useCallback((focusInfo: FocusInfo | null) => {
    setFocus(focusInfo);
  }, [])

  const [actionInfoStyle, setActionInfoStyle] = React.useState<React.CSSProperties>({});
  const [actionInfo, setActionInfo] = React.useState<ActionInfo | null>(null);

  const actionInfoCallback = React.useCallback((actionInfo: ActionInfo | null) => {
    setActionInfo(actionInfo);
  }, [])

  const [actor, setActor] = React.useState<Actor | null>(null);

  const characterChangeCallback = React.useCallback((actor: Actor | null) => {
    setActor(actor)
  }, [])

  React.useEffect(() => {
    const listener = (evt: MessageEvent<WorkerMessage>) => {
      if (evt.data.type === 'Rewards' && evt.data.rewards) {
        const newRewards = evt.data.rewards;

        type Stats = {
          min: number | null,
          max: number | null,
          sum: number,
        }

        const stats = newRewards.reduce<Stats>((stats, value) => {
          if (stats.max === null || stats.max < value[1]) {
            stats.max = value[1];
          }

          if (stats.min === null || stats.min > value[1]) {
            stats.min = value[1];
          }

          stats.sum += value[1];

          return stats;
        }, { min: null, max: null, sum: 0});

        setRewards((prev) => {
          let rewards = [
            ...prev,
            [newRewards[0][0], stats.max, stats.sum / newRewards.length, stats.min],
          ];

          const maxLength = 1001; // Number of entries plus one for titles.

          if (rewards.length > maxLength) {
            rewards = [
              rewards[0],
              ...rewards.slice(rewards.length - maxLength + 2)
            ]
          }

          return rewards;
        })
      }
      else if (evt.data.type === 'Finished') {
        workerQueue.finished();
      }
    }

    worker.addEventListener("message", listener);
    
    return (() => {
      worker.removeEventListener('message', listener);
    })
  }, []);

  React.useEffect(() => {
    const element = canvasRef.current;

    if (element) {
      element.focus();
      (async () => {
        renderer.setLoggerCallback(loggerCallback);
        renderer.setFocusCallback(focusCallback);
        renderer.setActionInfoCallback(actionInfoCallback)
        renderer.setCharacterChangeCallback(characterChangeCallback)
      })()  
    }
  }, [loggerCallback, focusCallback, characterChangeCallback, actionInfoCallback])

  const handlePointerDown: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      element.setPointerCapture(event.pointerId);
      const rect = element.getBoundingClientRect();

      const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
      const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
      // renderer?.pointerDown(clipX, clipY);

      if (event.metaKey) {
        renderer?.centerOn(clipX, clipY)
      }
      else if (!event.ctrlKey) {
        renderer?.interact()
      }
    }
  }

  const handlePointerMove: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();

      setActionInfoStyle({ left: event.clientX + 10, top: event.clientY + 10 })
      const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
      const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
      renderer?.pointerMove(clipX, clipY);
    }
  }

  const handlePointerLeave: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    renderer?.pointerLeft();
  }

  const handlePointerUp: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      // element.releasePointerCapture(event.pointerId);
      // // const rect = element.getBoundingClientRect();

      // const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
      // const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
      // renderer?.pointerUp(clipX, clipY);
    }
  }

  const handleWheel: React.WheelEventHandler<HTMLCanvasElement> = (event) => {
    renderer?.mouseWheel(event.deltaX, event.deltaY, event.clientX, event.clientY)

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
          canvas.width = Math.max(1, Math.min(width, gpu?.device.limits.maxTextureDimension2D ?? 1));
          canvas.height = Math.max(1, Math.min(height, gpu?.device.limits.maxTextureDimension2D ?? 1));
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

    renderer?.updateDirection(direction);
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
        renderer.endTurn();
        break;
      case 'ARROWDOWN':
        renderer.zoomOut();
        break;
      case 'ARROWUP':
        renderer.zoomIn();
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
    renderer.toggleInputMode();
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
    renderer.setParties(parties);

    storeParties(parties);
  }

  React.useEffect(() => {
    const parties = restoreParties();
    setParties(parties);
    renderer.setParties(parties);
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
      <div className="upper-center">
        <Focused focused={focus} />
      </div>
      <div className="upper-right">
      </div>
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onWheel={handleWheel}
      />
      <div className={`action`} style={actionInfoStyle}>
        <div>
          <div>
            {
              actionInfo
                ? actionInfo.action
                : null
            }
          </div>
          <div>
            {
              (actionInfo?.percentSuccess ?? null) !== null
                ? `${actionInfo?.percentSuccess ?? 0}%`
                : null
            }
          </div>
        </div>
        {
          actionInfo?.description
            ? actionInfo.description
            : null
        }
      </div>
      <div className="lower-left">
        {
          actor
            ? actor.character.influencingActions.map((c) => (
              <div>{`${c.name} (${c.duration / 6})`}</div>
            ))
            : null
        }
        {
          actor
            ? actor.character.conditions.map((c) => (
              <div>{c}</div>
            ))
            : null
        }
        {
          actor?.character.concentration
            ? <div>{`Concetrating: ${actor.character.concentration.name} (${actor.character.concentration.duration / 6})`}</div>
            : null
        }
        {
          actor?.character
            ? (
              <div>
                <div>{actor.character.name}</div>
                {`${actor.character.hitPoints}/${actor.character.maxHitPoints}`}
                {
                  actor.character.temporaryHitPoints
                    ? ` + ${actor.character.temporaryHitPoints}`
                    : ''
                }
              </div>
            )
            : null
        }
      </div>
      <div
        className="lower-center"
      >
        {
          actor
            ? (
              <div>
                <StatusBar character={actor.character} />
                <ActionBar actor={actor} />
              </div>
            )
            : null
        }
      </div>
      <div className="lower-right">
        <Messages messages={messages} />
      </div>
    </div>
  );
}

export default App;
