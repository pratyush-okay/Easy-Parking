import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: 'x',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'User Booking Percentages and Counts for Listings',
    },
  },
};

function BarChart({ bookingPercentages, allBookings }) {
  // Map bookingIds to titles using the idToTitleMap (allBookings prop)
  const labels = bookingPercentages.map(({ bookingId }) => allBookings[bookingId] || `Booking ${bookingId}`);
  // This will use the title if available in allBookings; otherwise, it falls back to `Booking ${bookingId}`

  const percentageData = {
    label: 'Booking Percentage',
    data: bookingPercentages.map(({ percentage }) => percentage),
    borderColor: 'rgba(53, 162, 235, 0.5)',
    backgroundColor: 'rgba(53, 162, 235, 0.5)',
  };

  const countData = {
    label: 'Booking Count',
    data: bookingPercentages.map(({ count }) => count),
    borderColor: 'rgba(255, 99, 132, 0.5)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
  };

  const data = {
    labels,
    datasets: [percentageData, countData],
  };

  return <Bar options={options} data={data} />;
}

export default BarChart;
