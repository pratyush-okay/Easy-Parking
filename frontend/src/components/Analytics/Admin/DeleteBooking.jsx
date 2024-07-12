import {
    Button,
    Modal,
    Box,
    Typography,
    Divider,
    IconButton,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import ApiCallDelete from "../../../action/ApiCallDelete";

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
  
  function DeleteBooking({ bookingId, open, onClose, fetchData, fetchAnalyticsData }) {
  
    const handleClose = () => {
      onClose();
    };

    const fetchDetails = async (bookingId) => {
      
      console.log("Delete booking details", bookingId);
      const body = {booking_id: bookingId,}
      const data = await ApiCallDelete("booking/fulldelete/", body, "", false);
      if (data) {
        // data update successfully
        fetchData();
        if (fetchAnalyticsData)
          fetchAnalyticsData();
        console.log("Booking deleted successfully", data);
      }
    };
  
    const handleDeleteDetails = (bookingId) => {
      fetchDetails(bookingId);
      handleClose(); 
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
            Sure want to delete?
          </Typography>
  
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" onClick={() => handleDeleteDetails(bookingId)}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }
  
  export default DeleteBooking;
  