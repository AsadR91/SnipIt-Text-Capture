import React, { useRef, useState } from 'react';

function SnipCanvas({ image, onSnip }) {
  const canvasRef = useRef();
  const [rect, setRect] = useState(null);

  const startDrag = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setRect({ startX, startY, w: 0, h: 0 });
  };

  const duringDrag = e => {
    if (!rect) return;
    const rectBox = canvasRef.current.getBoundingClientRect();
    const w = (e.clientX - rectBox.left) - rect.startX;
    const h = (e.clientY - rectBox.top) - rect.startY;
    setRect({ ...rect, w, h });
  };

  const endDrag = () => {
    if (rect) {
      const ctx = canvasRef.current.getContext('2d');
      const { startX, startY, w, h } = rect;
      const imageData = ctx.getImageData(startX, startY, w, h);
      // create offscreen canvas
      const oc = document.createElement('canvas');
      oc.width = Math.abs(w); oc.height = Math.abs(h);
      const octx = oc.getContext('2d');
      octx.putImageData(imageData, 0, 0);
      onSnip(oc.toDataURL());
      setRect(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ background: `url(${image}) center/contain`, cursor: 'crosshair' }}
      onMouseDown={startDrag}
      onMouseMove={duringDrag}
      onMouseUp={endDrag}
    />
  );
}

export default SnipCanvas;
