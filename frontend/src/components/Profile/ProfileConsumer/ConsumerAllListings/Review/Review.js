import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox'; // Import Checkbox component
import FormControlLabel from '@mui/material/FormControlLabel'; // Import FormControlLabel component
import axios from 'axios'; // Import Axios library for making HTTP requests
import "./Review.css";

const Review = ({ parking,handleViewAllBookings }) => {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [anonymous, setAnonymous] = useState(false); // State for checkbox
  const useremail = localStorage.getItem('UserEmail');

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setAnonymous(event.target.checked);
  };

  const handleSubmit = () => {
    let user_email = anonymous ? -1 : useremail; // Set userId based on checkbox value
    const data = {
      parking_id: parking.parking_id,
      user_email: user_email,
      rating: rating,
      review: review
    };

    console.log(data);

    axios.post('http://127.0.0.1:8000/reviews/create/', data)
      .then(response => {
        console.log('Review submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });

      handleViewAllBookings();

  };

  return (
    <div className='review'>
      Write a review
      <Typography variant="h4" gutterBottom>
        {parking.description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {parking.location}
      </Typography>
      <div className='reviewFields'>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={rating}
          label="Rating"
          onChange={handleRatingChange}
          fullWidth
          sx={{ mb: 2 }} // Optional styling
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
        <TextField
          label="Write a review"
          multiline
          rows={4}
          value={review}
          onChange={handleReviewChange}
          fullWidth
          sx={{ mb: 2 }} // Optional styling
        />
        <FormControlLabel
          control={<Checkbox checked={anonymous} onChange={handleCheckboxChange} />}
          label="Add review anonymously"
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
      >
        Add Review
      </Button>
    </div>
  );
};

export default Review;
