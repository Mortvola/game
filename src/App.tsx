import React from 'react';
import './App.scss';
import { gpu, renderer } from './Renderer';
import { audioContext } from './Audio';
import { vec4 } from 'wgpu-matrix';

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

  React.useEffect(() => {
    const element = canvasRef.current;

    if (element) {
      element.focus();
      (async () => {
        await renderer?.setCanvas(element);
        // renderer?.onSelect(handleSelect)
      })()  
    }
  }, [])

  const handlePointerDown: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      element.setPointerCapture(event.pointerId);
      // const rect = element.getBoundingClientRect();

      // const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
      // const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
      // renderer?.pointerDown(clipX, clipY);

      renderer?.interact()
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

  const handlePointerUp: React.PointerEventHandler<HTMLCanvasElement> = (event) => {
    const element = canvasRef.current;

    if (element) {
      element.releasePointerCapture(event.pointerId);
      // const rect = element.getBoundingClientRect();

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
      case ' ': {
        renderer.endTurn();
      }
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

  return (
    <div className="App">
      <button type="button" onClick={handlePlayClick}>play</button>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}

export default App;
