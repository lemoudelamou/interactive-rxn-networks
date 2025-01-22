import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ChartDataLabels
);

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
                  return `${tooltipItem.dataset.label}: ${
                    value.toExponential ? value.toExponential(2) : value.toFixed(2)
                  }`;
                },
              },
            },
            datalabels: {
              display: true,
              align: 'top', 
              color: '#000', 
              font: {
                size: 10, 
              },
              formatter: function (value, context) {
                const label = context.chart.data.labels[context.dataIndex];
                return !isNaN(label) ? Number(label).toFixed(2) : label;
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false, 
              },
              ticks: {
                display: false,
                callback: function (value) {
                  const label = this.getLabelForValue(value);
                  return !isNaN(label) ? Number(label).toFixed(2) : label;
                },
              },
            },
            y: {
              beginAtZero: true,
              type: logScale ? 'logarithmic' : 'linear',
              ticks: {
                callback: function (value) {
                  return value.toExponential ? value.toExponential(2) : value.toFixed(2);
                },
                maxTicksLimit: 10,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Chart;
