import React from "react";
import { Modal, Box, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "80%",
  overflowY: "auto", // Add scrolling for long lists
};

const CustomModal = ({ modalStatus, closeModal, parkingsData, onEdit, onDelete }) => {
  const parkings = JSON.parse(parkingsData);

  return (
    <Modal open={modalStatus} onClose={closeModal}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          All Listings
        </Typography>

        <List dense>
          {parkings.map((parking, index) => (
            <ListItem key={index} divider secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(parking.pk)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(parking.pk)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }>
              <ListItemText
                primary={parking.fields.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {parking.fields.location}
                    </Typography>
                    {/* Add more details as needed */}
                    <div>Price Daily: ${parking.fields.price_daily}</div>
                    <div>Features: {parking.fields.features}</div>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>

        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default CustomModal;
