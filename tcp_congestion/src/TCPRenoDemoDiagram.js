import React, { useEffect, useRef } from 'react';

const TcpRenoDemoDiagram = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Styles
    ctx.font = '14px Arial';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';

    // Timeline
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(750, 200);
    ctx.stroke();
    ctx.fillText('Time →', 700, 190);

    // Y Axis label
    ctx.save();
    ctx.translate(20, 140);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Congestion Window (cwnd)', 0, 0);
    ctx.restore();

    // Slow Start
    ctx.fillStyle = 'blue';
    ctx.fillText('Slow Start', 100, 90);
    ctx.beginPath();
    ctx.moveTo(100, 180);
    ctx.lineTo(180, 120);
    ctx.lineTo(260, 80);
    ctx.stroke();

    // Congestion Avoidance
    ctx.fillStyle = 'green';
    ctx.fillText('Congestion Avoidance', 270, 70);
    ctx.beginPath();
    ctx.moveTo(260, 80);
    ctx.lineTo(320, 70);
    ctx.lineTo(380, 60);
    ctx.lineTo(440, 55);
    ctx.stroke();

    // Packet Loss → Fast Retransmit
    ctx.fillStyle = 'red';
    ctx.fillText('Packet Loss (1) → Fast Retransmit', 450, 100);
    ctx.beginPath();
    ctx.moveTo(440, 55);
    ctx.lineTo(480, 150);
    ctx.stroke();

    // Fast Recovery
    ctx.fillStyle = 'orange';
    ctx.fillText('Fast Recovery (cwnd = ssthresh + 3)', 480, 130);
    ctx.beginPath();
    ctx.moveTo(480, 150);
    ctx.lineTo(540, 100);
    ctx.lineTo(600, 80);
    ctx.stroke();

    // Return to Congestion Avoidance
    ctx.fillStyle = 'purple';
    ctx.fillText('Return to Congestion Avoidance', 610, 70);
    ctx.beginPath();
    ctx.moveTo(600, 80);
    ctx.lineTo(670, 70);
    ctx.lineTo(740, 60);
    ctx.stroke();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>TCP Reno Demo: cwnd Behavior Over Time</h3>
      <canvas ref={canvasRef} width={800} height={250} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  );
};

export default TcpRenoDemoDiagram;
