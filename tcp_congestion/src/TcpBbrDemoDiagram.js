// TcpBbrDemoDiagram.js
import React, { useEffect, useRef } from 'react';

const TcpBbrDemoDiagram = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '14px Arial';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';

    // X-axis Timeline
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(750, 200);
    ctx.stroke();
    ctx.fillText('Time →', 700, 190);

    // Y-axis label
    ctx.save();
    ctx.translate(20, 140);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Congestion Window (CWND)', 0, 0);
    ctx.restore();

    // Phase 1: Startup
    ctx.fillStyle = 'blue';
    ctx.fillText('Startup Phase (Probing Bandwidth)', 80, 80);
    ctx.beginPath();
    ctx.moveTo(80, 180);
    ctx.lineTo(140, 130);
    ctx.lineTo(200, 90);
    ctx.stroke();

    // Phase 2: Drain
    ctx.fillStyle = 'purple';
    ctx.fillText('Drain Phase (Reduce inflight)', 220, 100);
    ctx.beginPath();
    ctx.moveTo(200, 90);
    ctx.lineTo(260, 130);
    ctx.stroke();

    // Phase 3: ProbeBW
    ctx.fillStyle = 'green';
    ctx.fillText('ProbeBW Phase (Maintain & Probe)', 280, 70);
    ctx.beginPath();
    ctx.moveTo(260, 130);
    ctx.lineTo(320, 110);
    ctx.lineTo(380, 120);
    ctx.lineTo(440, 100);
    ctx.lineTo(500, 110);
    ctx.stroke();

    // Phase 4: ProbeRTT
    ctx.fillStyle = 'red';
    ctx.fillText('ProbeRTT Phase (Measure Min RTT)', 520, 150);
    ctx.beginPath();
    ctx.moveTo(500, 110);
    ctx.lineTo(540, 150);
    ctx.lineTo(580, 150);
    ctx.stroke();

    // Return to ProbeBW
    ctx.fillStyle = 'orange';
    ctx.fillText('Back to ProbeBW', 600, 90);
    ctx.beginPath();
    ctx.moveTo(580, 150);
    ctx.lineTo(640, 110);
    ctx.lineTo(700, 100);
    ctx.stroke();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>TCP BBR Demo: CWND over BBR Phases</h3>
      <canvas ref={canvasRef} width={800} height={250} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  );
};

export default TcpBbrDemoDiagram;
