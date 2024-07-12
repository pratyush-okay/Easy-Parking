import {
    Button,
    Modal,
    Box,
    Typography,
    Divider,
    IconButton,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  
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
  
  function ParkingSpaceDetailModal({ parkingId, open, onClose, fetchData }) {
  
    const handleClose = () => {
      onClose();
    };
  
  
    const handleDeleteDetails = (parkingId) => {
      console.log("Delete parking details", parkingId);
      const user_email = localStorage.getItem("UserEmail");
      console.log("user_email: ", user_email);
      const fetchDetails = async () => {
        try {
            const response = await axios.delete("http://localhost:8000/user/fav/delete", {
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    user_email: user_email,
                    name: parkingId
                }
            });
          fetchData();
          console.log("Favourite deleted successfully", response.data);
        } catch (error) {
          console.error("Failed to delete parking details", error);
        }
      };
    
      fetchDetails();
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
            <Button variant="contained" onClick={() => handleDeleteDetails(parkingId)}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }
  
  export default ParkingSpaceDetailModal;
  