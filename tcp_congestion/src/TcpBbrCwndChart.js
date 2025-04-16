// TcpBbrCwndChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TcpBbrCwndChart = ({ congestionWindow, btlBandwidthData, minRttData }) => {
  const alignedX = congestionWindow.map(point => point.x);

  const data = {
    labels: alignedX,
    datasets: [
      {
        label: 'CWND',
        data: congestionWindow.map(point => point.y),
        yAxisID: 'y1',
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Estimated Bandwidth (Mbps)',
        data: btlBandwidthData.map(point => point.y),
        yAxisID: 'y2',
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Min RTT (ms)',
        data: minRttData.map(point => point.y),
        yAxisID: 'y3',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Simulation Time' }
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'CWND' },
        beginAtZero: true
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Bandwidth (Mbps)' },
        beginAtZero: true,
        grid: { drawOnChartArea: false }
      },
      y3: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Min RTT (ms)' },
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        offset: true
      }
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'TCP BBR Metrics Over Time' }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default TcpBbrCwndChart;