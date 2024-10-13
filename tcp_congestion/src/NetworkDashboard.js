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

const NetworkDashboard = ({ throughput, packetLoss, latency, congestionWindow }) => {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
  // function to create chart data for each metric
  const createChartData = (data, label, color) => ({
    datasets: [{
      label,
      data,
      borderColor: color,
      backgroundColor: color + '40',
      fill: true,
      tension: 0.4
    }]
  });
  // array of charts with corresponding data, label, and color
  const charts = [
    { data: throughput, label: 'Throughput', color: 'rgb(75, 192, 192)' },
    { data: packetLoss, label: 'Packet Loss (%)', color: 'rgb(255, 99, 132)' },
    { data: latency, label: 'Latency (ms)', color: 'rgb(255, 205, 86)' },
    { data: congestionWindow, label: 'Congestion Window Size', color: 'rgb(54, 162, 235)' }
  ];

  return (
    <div className="network-dashboard">
      {charts.map((chart, index) => (
        <div key={index} className="chart-container">
          <Line 
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: {
                  display: true,
                  text: chart.label
                }
              },
              scales: {
                ...commonOptions.scales,
                y: {
                  ...commonOptions.scales.y,
                  title: {
                    ...commonOptions.scales.y.title,
                    text: chart.label
                  }
                }
              }
            }}
            data={createChartData(chart.data, chart.label, chart.color)}
          />
        </div>
      ))}
    </div>
  );
};

export default NetworkDashboard;