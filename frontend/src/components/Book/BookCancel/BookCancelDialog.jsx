

import {
  Modal,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MyButton from "../../MyButton";
import axios from "axios";

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

function BookCancelDialog({ bookingId, open, onClose, fetchData }) {

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    // Handle the confirmation action here
    const data = {
      "booking_id": bookingId
    }
    axios.put('http://127.0.0.1:8000/booking/delete/', data)
    .then(response => {
      console.log(response.data);
      fetchData();
    })
    .catch(error => {
      console.error('Error:', error);
    });
    // handleViewAllListings();

    handleClose(); 
    fetchData();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom fontWeight={"600"}>
        Are you sure you want to cancel this booking?
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <MyButton onClick={() =>handleConfirm()}>
            confirm
          </MyButton>
        </Box>
      </Box>
    </Modal>
  );
}

export default BookCancelDialog;
