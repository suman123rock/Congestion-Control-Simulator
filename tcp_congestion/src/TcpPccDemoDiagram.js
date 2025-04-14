import React, { useEffect, useRef } from 'react';

const TcpPccDemoDiagram = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Styles
    ctx.font = '14px Arial';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';

    // Timeline X-axis
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(750, 200);
    ctx.stroke();
    ctx.fillText('Time →', 710, 190);

    // Y-Axis label for CWND
    ctx.save();
    ctx.translate(20, 140);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Congestion Window (cwnd)', 0, 0);
    ctx.restore();

    // PCC CWND Growth via Utility
    ctx.fillStyle = 'blue';
    ctx.fillText('↑ Utility → Increase cwnd', 120, 80);
    ctx.beginPath();
    ctx.moveTo(100, 180);   // start low
    ctx.lineTo(160, 140);
    ctx.lineTo(220, 100);   // rising cwnd
    ctx.stroke();

    // Drop in utility → decrease cwnd
    ctx.fillStyle = 'red';
    ctx.fillText('↓ Utility → Decrease cwnd', 240, 150);
    ctx.beginPath();
    ctx.moveTo(220, 100);
    ctx.lineTo(260, 160);   // drop
    ctx.stroke();

    // Utility ↑ again → increase cwnd again
    ctx.fillStyle = 'green';
    ctx.fillText('Positive Utility → Increase cwnd', 280, 90);
    ctx.beginPath();
    ctx.moveTo(260, 160);
    ctx.lineTo(320, 120);
    ctx.lineTo(380, 100);
    ctx.stroke();

    // Slight utility drop → slow cwnd
    ctx.fillStyle = 'orange';
    ctx.fillText('Slight Utility Drop → Reduce', 400, 130);
    ctx.beginPath();
    ctx.moveTo(380, 100);
    ctx.lineTo(420, 140);
    ctx.stroke();

    // Smooth Recovery
    ctx.fillStyle = 'purple';
    ctx.fillText('Recovered Utility → Grow Again', 440, 110);
    ctx.beginPath();
    ctx.moveTo(420, 140);
    ctx.lineTo(500, 120);
    ctx.lineTo(580, 100);
    ctx.stroke();

    // Label utility behavior
    ctx.fillStyle = '#555';
    ctx.fillText('Utility Feedback Driven Adaptation', 300, 230);
    //ctx.fillText('(not fixed phases like Reno)', 330, 250);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>TCP PCC Demo: CWND Adaptation via Utility Feedback</h3>
      <canvas ref={canvasRef} width={800} height={270} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  );
};

export default TcpPccDemoDiagram;
