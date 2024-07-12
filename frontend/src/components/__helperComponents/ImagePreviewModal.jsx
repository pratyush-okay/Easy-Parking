// ImagePreviewModal.js
import React from "react";
import { Box, Modal, Backdrop, Fade, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: "16px",
};

const ImagePreviewModal = ({ open, imageSrc, handleClose }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
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
            {/* <CloseIcon /> */}
            <CancelIcon />
          </IconButton>
          <img
            src={imageSrc}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default ImagePreviewModal;
