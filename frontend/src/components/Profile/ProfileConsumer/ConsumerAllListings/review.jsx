import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
  Rating,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import AlertContext from "../../../CustomAlert/AlertContext";
import MyButton from "../../../MyButton";

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function ReviewModal({ parkingId, parkingDetails, open, onClose, fetchData }) {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const useremail = localStorage.getItem('UserEmail');
  const { customAlert } = React.useContext(AlertContext);

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setAnonymous(event.target.checked);
  };

  const handleSubmit = () => {
    let user_email = anonymous ? "Anonymous" : useremail;
    const data = {
      parking_id: parkingId,
      user_email: user_email,
      rating: rating,
      review: review
    };

    if (!rating || rating === '' || !review.trim()) {
        customAlert('Please provide a rating and review');
        return; 
      }
    

    axios.post('http://127.0.0.1:8000/reviews/create/', data)
      .then(response => {
        console.log('Review submitted successfully:', response.data);
        fetchData(); 
        onClose(); 
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Write a review {parkingDetails?.title}
        </Typography>

        <Divider sx={{ my: 2 }} />

       {/* Rating component for user to select a rating */}
       <Typography id="modal-modal-title" variant="h6" component="h3" gutterBottom>
          Give Rating 
        </Typography>
<Rating
  name="user-rating"
  value={rating}
  onChange={(event, newValue) => {
    setRating(newValue);
  }}
  sx={{ mb: 2 }} // Optional styling
/>

        <TextField
          label="Write a review"
          multiline
          rows={4}
          value={review}
          onChange={handleReviewChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={<Checkbox checked={anonymous} onChange={handleCheckboxChange} />}
          label="Add review anonymously"
        />

        <MyButton
          onClick={handleSubmit}
          sx={{width: '100%'}}
        >
          Add Review
        </MyButton>
      </Box>
    </Modal>
  );
}

export default ReviewModal;