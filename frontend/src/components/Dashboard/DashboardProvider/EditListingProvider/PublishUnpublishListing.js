import React, { useState, useEffect } from "react";
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

function PublishUnpublishListing({ parkingId, open, onClose, publish, fetchData }) {
  const [action, setAction] = useState('');

  useEffect(() => {
    setAction(publish ? 'Publish' : 'Unpublish');
  }, [publish]);

  const handleClose = () => {
    onClose();
  };

  console.log("asdiahdolas ass dadsad",parkingId);

  const handleAction = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/parking/publish/`, {
        parking_id: parkingId,
      });
      console.log(`Parking ${publish ? 'published' : 'unpublished'} successfully`, response.data);
      fetchData();
      handleClose();
    } catch (error) {
      console.error(`Failed to ${publish ? 'publish' : 'unpublish'} parking details`, error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          Are you sure you want to {action} this listing?
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" onClick={handleAction}>
            {action}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default PublishUnpublishListing;
