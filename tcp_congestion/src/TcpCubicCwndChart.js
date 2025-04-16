// TcpCubicCwndChart.js
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
  Legend,
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

const TcpCubicCwndChart = ({ congestionWindow }) => {
  const data = {
    labels: congestionWindow.map(point => point.x),
    datasets: [
      {
        label: 'TCP Cubic: Congestion Window (cwnd)',
        data: congestionWindow.map(point => point.y),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'TCP Cubic Congestion Window Over Time'
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Time (s)' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'CWND' }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default TcpCubicCwndChart;
