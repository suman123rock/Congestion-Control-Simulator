
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

const TcpRenoCwndChart = ({ congestionWindow, ssthreshData }) => {
  const data = {
    labels: congestionWindow.map(point => point.x),
    datasets: [
      {
        label: 'TCP Reno: Congestion Window (cwnd)',
        data: congestionWindow.map(point => point.y),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Slow Start Threshold (ssthresh)',
        data: ssthreshData.map(point => point.y),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        fill: false,
        borderDash: [5, 5]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'TCP Reno cwnd & ssthresh Over Time' }
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Time (seconds)' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Window Size' }
      }
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default TcpRenoCwndChart;
