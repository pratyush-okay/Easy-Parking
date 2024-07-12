import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Importing the Close icon
import axios from "axios";
import BookingSection from "../Book/BookingSection";
// import BookingSection_mycopy from "../Book/BookingSection_mycopy";

// Style for the modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  // height: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function MakeABookingModal({ userId, parkingId, open, onClose }) {
  const [details, setDetails] = useState(null);

  const fetchDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/parking/byid/",
        {
          parking_id: parkingId,
        }
      );
      const data = JSON.parse(response.data);
      setDetails(data[0].fields);
    } catch (error) {
      console.error("Failed to fetch parking details", error);
    }
  };

  useEffect(() => {
    // Only fetch details if parkingId is provided and modal is open
      fetchDetails();
  });

  // Function to handle the click on the close button
  const handleClose = () => {
    onClose();
    // setBookingMode(false);
  };

  return (
    <Modal
      open={open}
      // onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Close Button */}
        <h1>Booking</h1>
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

        {/* main modal content */}
        <BookingSection
          userId={userId}
          selectedParking={parkingId}
          handleViewAllListings={handleClose}
          dailyRate={details ? details.price_daily : null}
          hourlyRate={details ? details.price_hourly : null}
          monthlyRate={details ? details.price_monthly : null}
        />
      </Box>
    </Modal>
  );
}

export default MakeABookingModal;
