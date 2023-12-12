import React from 'react';
import './App.scss';
import { gpu, renderer } from './Renderer';
import { audioContext } from './Audio';
import { vec4 } from 'wgpu-matrix';
import { EpisodeInfo, WorkerMessage, worker } from './QStore';
import RewardChart from './Chart';

type DiretionKeys = {
  left: number,
  right: number,
  forward: number,
  backward: number,
}

let wins: number[] = []

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

  const [score, setScore] = React.useState<{ red: number, blue: number}>({ red: 0, blue: 0});
  const [percentWins, setPercentWins] = React.useState(0);
  const [rewards, setRewards] = React.useState<unknown[]>([["episode", "max", "mean", "min"]]);

  const scoreCallback = React.useCallback((episode: EpisodeInfo) => {
    wins.push(episode.winningTeam);

    if (wins.length > 1000) {
      wins = wins.slice(1)
    }

    const numWins = wins.reduce((accum, entry) => (
      accum + entry
    ), 0)

    setPercentWins(numWins / wins.length);

    setScore((prev) => ({ red: prev.red + episode.winningTeam, blue: prev.blue + (episode.winningTeam === 0 ? 1 : 0)}));
  }, []);

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
        renderer.setScoreCallback(scoreCallback)
      })()  
    }
  }, [scoreCallback])

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
      else {
        renderer?.interact()
      }
    }
  }

  const handlePointerMove: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();

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

  const updateDirection = () => {
    const direction = vec4.normalize(vec4.create(
      movement.current.right - movement.current.left,
      0,
      movement.current.backward - movement.current.forward,
      0,
    ))

    renderer?.updateDirection(direction);
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLCanvasElement> = (event) => {
    const upperKey = event.key.toUpperCase();
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
      // default:
      //   console.log(upperKey)
    }
  }

  const handleKeyUp: React.KeyboardEventHandler<HTMLCanvasElement> = (event) => {
    const upperKey = event.key.toUpperCase();
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
  }

  const handlePlayClick = () => {
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  }

  const [inputMode, setInputMode] = React.useState('Mouse');

  const handleInputModeClick = () => {
    renderer.toggleInputMode();
    setInputMode((prev) => prev === 'Controller' ? 'Mouse' : 'Controller')
  }

  // const [showOverlay, setShowOverlay] = React.useState<boolean>(false);

  // const handleFocus: React.FocusEventHandler<HTMLCanvasElement> = (event) => {
  //   setHasFocus(true);
  // }

  // const handleBlur = () => {
  //   setHasFocus(false);
  //   setShowOverlay(true);
  // }

  // const handleBlurredClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
  //   event.stopPropagation();
  //   setShowOverlay(false);
    
  //   const element = canvasRef.current;

  //   if (element) {
  //     element.focus();
  //   }
  // }

  const refocus = () => {
    // setShowOverlay(false);
    const element = canvasRef.current;

    if (element) {
      element.focus();
    }
  }

  const handleAnimateClick = () => {
    renderer.animate = !renderer.animate
  }

  const handleFollowClick = () => {
    renderer.followActiveCharacter = !renderer.followActiveCharacter
  }

  const [showGraph, setShowGraph] = React.useState<boolean>(false);

  const handleLearnClick = () => {
    setShowGraph(true);
    setRewards([["episode", "max", "mean", "min"]]);
    worker.postMessage('start');
  }

  return (
    <div className="App">
      <div className="upper-left">
        <button type="button" onClick={handlePlayClick}>play</button>
        <button type="button" onClick={handleInputModeClick} onFocus={(refocus)}>
          {
            inputMode === 'Mouse'
              ? 'Mouse & Keyboard'
              : 'Controller'
          }
        </button>
        {
          // showOverlay
          //   ? <div className="blurred-overlay" onClick={handleBlurredClick} />
          //   : null
        }
        <button onClick={handleAnimateClick}>animate</button>
        <button onClick={handleFollowClick}>
          {
            renderer.followActiveCharacter
              ? 'unfollow'
              : 'follow'
          }
        </button>
        <button onClick={handleLearnClick}>Learn</button>
      </div>
      <div className="score">
        <div>
          {
            `Red: ${score.red} Blue: ${score.blue}`
          }
        </div>
        <div>
          {
            `Wins: ${(percentWins * 100).toFixed(2)}%`
          }
        </div>
      </div>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        // onFocus={handleFocus}
        // onBlur={handleBlur}
      />
      <div className="lower-left">
        {
          showGraph
            ? (
              <div className="chart">
                <RewardChart data={rewards} />
              </div>    
            )
            : null
        }
      </div>
    </div>
  );
}

export default App;
