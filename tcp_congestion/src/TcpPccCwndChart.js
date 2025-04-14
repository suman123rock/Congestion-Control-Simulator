// TcpPccCwndChart.js
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

const TcpPccCwndChart = ({ congestionWindow, utilityData }) => {
  const alignedX = congestionWindow.map(point => point.x);
  
  const data = {
    labels: alignedX,
    datasets: [
      {
        label: 'Congestion Window (CWND)',
        data: congestionWindow.map(point => point.y),
        yAxisID: 'y1',
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Utility (×1000)',
        data: utilityData.map(point => point.y * 1000),
        yAxisID: 'y2',
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    //maintainAspectRatio: false,  // important!
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Simulation Time',
        }
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'CWND'
        },
        beginAtZero: true
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Utility (×1000)'
        },
        beginAtZero: false,
        suggestedMin: -10,
        //suggestedMax adjusted to reflect the y2
        suggestedMax: 10,
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options}  />
    </div>
  );
};

export default TcpPccCwndChart;
