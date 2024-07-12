import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import "./Review.css";
const FormContainer = styled(Box)({
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
});

const Review = () => {
  const parking = [
    {
      location: 'Parking Location 1',
      description: 'Parking Description 1',
    },];
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = () => {
    // Handle submission logic here
    console.log('Rating:', rating);
    console.log('Review:', review);
  };

  return (
    <div className='review'>
      <FormContainer>
        <Typography variant="h4" gutterBottom>
          {parking[0].location}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {parking[0].description}
        </Typography>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={rating}
          label="Rating"
          onChange={handleRatingChange}
          fullWidth
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Add Review
        </Button>
      </FormContainer>
    </div>
  );
};

export default Review;

