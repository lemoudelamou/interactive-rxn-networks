import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip, Legend, LineElement, PointElement);

const Chart = ({ chartData, logScale = false, isLineChart = false }) => {
  if (!chartData) return null;

  const ChartComponent = isLineChart ? Line : Bar;

  return (
    <div className="chart-container-data">
      <ChartComponent
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const value = tooltipItem.raw;
                  return `${tooltipItem.dataset.label}: ${value.toExponential ? value.toExponential(2) : value.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              type: logScale ? 'logarithmic' : 'linear',
              position: 'left',
              ticks: {
                callback: function (value) {
                  return value.toExponential ? value.toExponential(2) : value.toFixed(2);
                },
                maxTicksLimit: 15, 
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Chart;
