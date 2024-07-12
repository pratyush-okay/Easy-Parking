import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register the necessary elements
ChartJS.register(ArcElement, Tooltip, Legend);


function DoughnutChart({ booking_percentage }) {

    if (!booking_percentage) {
        return null; // Or some default component or message
      }
  // Function to generate data points from booking_percentage object
  const generateDataPoints = (bookingPercentage) => {
    return Object.values(bookingPercentage);
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Percentage Of Listings Booked All Time',
      },
    },
  };

  const data = {
    labels: Object.keys(booking_percentage), // Use the keys as labels
    datasets: [
      {
        label: '# of Votes',
        data: generateDataPoints(booking_percentage), // Use the function to set data
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
}

export default DoughnutChart;
