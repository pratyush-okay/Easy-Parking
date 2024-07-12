import React from 'react';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Earnings chart by date',
    },
  },
};

function EarningsChart({ monthly_income }) {
  if (!monthly_income) {
    return null; // Or some default component or message
  }

  // Extract labels and data from monthly_income object
  const labels = Object.keys(monthly_income);
  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Income',
        data: labels.map(month => parseFloat(monthly_income[month])),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export default EarningsChart;
