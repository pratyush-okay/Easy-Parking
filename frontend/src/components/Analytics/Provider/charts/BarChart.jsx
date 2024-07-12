import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



function BarChart({ parking_review_dict, parking_avg_rating_dict }) {

    // Function to extract parking IDs and average ratings from the provided data
    const extractData = (reviewData, ratingData) => {
      if (!reviewData || !ratingData) {
        return { labels: [], datasets: [] }; 
      }
  
      const parkingIDs = reviewData.map(item => item.parking_id);
      const avgRatings = ratingData.map(item => parseFloat(item.avg_rating));
      const numReviews = reviewData.map(item => item.num_reviews); // Extract number of reviews
      return {
        labels: parkingIDs,
        datasets: [
          {
            label: 'Average Rating',
            data: avgRatings,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          },
          {
            label: 'Number of Reviews', // New dataset for number of reviews
            data: numReviews,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          }
        ],
      };
    };
  
    const options = {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: true, // Display legend
          position: 'top', // Set legend position
        },
        title: {
          display: true,
          text: 'Average Review Rating by Parking ID',
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const parkingId = data.labels[tooltipItem.dataIndex]; // Get the parking ID from labels
              const reviewData = parking_review_dict.find(item => item.parking_id === parkingId); // Find the review data for the corresponding parking ID
              return `Number of Reviews: ${reviewData ? reviewData.num_reviews : 'N/A'}`;
            },
          },
        },
      },
    };
    // Extract data from provided props
    const data = extractData(parking_review_dict, parking_avg_rating_dict);
  
    return <Bar options={options} data={data} />;
  }
  
  export default BarChart;
  
