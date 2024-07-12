import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register the necessary elements
ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({ booking_percentage,userParkingsIdsAndTitles }) {

    console.log("Booking percentage: ", booking_percentage);
    console.log("User parkings: ", userParkingsIdsAndTitles);

    if (!booking_percentage || !userParkingsIdsAndTitles) {
        return null; // Or some default component or message
      }

      const result = userParkingsIdsAndTitles.reduce((acc, parking) => {
        const id = parking.id;
        const rating = booking_percentage[id] || 0; // Use 0 if the rating is not found
        acc[id] = { rating, title: parking.title };
        return acc;
      }, {});

      console.log(result);

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Percentage Of Listings Booked All Time',
      },
    },
  };

  const data = {
    labels: Object.values(result).map(entry => `${entry.title} (${entry.rating.toFixed(1)}%)`), // Use the title and rating from each entry in the result object as labels
    datasets: [
      {
        label: 'Booking Percentage : ',
        data: Object.values(result).map(entry => entry.rating), // Use the rating from each entry in the result object
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