// TcpCubicDemoDiagram.js
import React, { useEffect, useRef } from 'react';

const TcpCubicDemoDiagram = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '14px Arial';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';

    // Timeline X-axis
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(750, 200);
    ctx.stroke();
    ctx.fillText('Time →', 700, 190);

    // Y-Axis label for CWND
    ctx.save();
    ctx.translate(20, 140);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Congestion Window (cwnd)', 0, 0);
    ctx.restore();

    // Cubic growth curve
    ctx.fillStyle = 'blue';
    ctx.fillText('Cubic Growth after Loss', 100, 90);
    ctx.beginPath();
    ctx.moveTo(100, 180);
    ctx.bezierCurveTo(150, 160, 200, 130, 260, 100);
    ctx.stroke();

    ctx.fillStyle = 'red';
    ctx.fillText('Packet Loss → Reduction', 260, 90);
    ctx.beginPath();
    ctx.moveTo(260, 100);
    ctx.lineTo(300, 160);
    ctx.stroke();

    ctx.fillStyle = 'green';
    ctx.fillText('Concave Cubic Recovery', 310, 120);
    ctx.beginPath();
    ctx.moveTo(300, 160);
    ctx.bezierCurveTo(350, 130, 400, 110, 470, 100);
    ctx.stroke();

    ctx.fillStyle = 'purple';
    ctx.fillText('W_max Reached Again', 480, 90);
    ctx.beginPath();
    ctx.moveTo(470, 100);
    ctx.lineTo(530, 90);
    ctx.stroke();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>TCP Cubic Demo: CWND Cubic Curve</h3>
      <canvas ref={canvasRef} width={800} height={250} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  );
};

export default TcpCubicDemoDiagram;
