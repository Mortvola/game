import React from 'react';
import './App.scss';
import { gpu, renderer } from './Renderer';
import { audioContext } from './Audio';

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

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
      const rect = element.getBoundingClientRect();

      const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
      const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
      renderer?.pointerDown(clipX, clipY);  
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
      const rect = element.getBoundingClientRect();

      const clipX = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1;
      const clipY = 1 - ((event.clientY - rect.top) / element.clientHeight) * 2;
      renderer?.pointerUp(clipX, clipY);
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

  const handleKeyDown: React.KeyboardEventHandler<HTMLCanvasElement> = (event) => {
    const upperKey = event.key.toUpperCase();
    switch (upperKey) {
      case 'E':
        renderer?.moveForward(1)
        break;
      case 'D':
        renderer?.moveBackward(1)
        break;
      case 'F':
        renderer?.moveRight(1)
        break;
      case 'S':
        renderer?.moveLeft(1)
        break;
      case 'G': {
        renderer?.takeAction()
        break;
      }
      case 'N': {
        renderer.endTurn();
      }
    }
  }

  const handleKeyUp: React.KeyboardEventHandler<HTMLCanvasElement> = (event) => {
    const upperKey = event.key.toUpperCase();
    switch (upperKey) {
      case 'E':
        renderer?.moveForward(0)
        break;
      case 'D':
        renderer?.moveBackward(0)
        break;
      case 'F':
        renderer?.moveRight(0)
        break;
      case 'S':
        renderer?.moveLeft(0)
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
