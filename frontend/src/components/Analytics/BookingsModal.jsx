import React from "react";
import {
    Modal,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
    overflowY: "auto",
};

const CustomModal = ({
    modalStatus,
    closeModal,
    bookingsData,
    onDelete,
    admin,
}) => {
    const bookings = JSON.parse(bookingsData); // Assuming bookingsData is a JSON string

    return (
        <Modal open={modalStatus} onClose={closeModal}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    All Bookings
                </Typography>

                <List dense>
                    {bookings.map((booking, index) => (
                        <ListItem
                            key={booking.pk}
                            divider
                            secondaryAction={
                                <>

                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    onDelete(booking.pk)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
    
                                </>
                            }
                        >
                            <ListItemText
                                primary={`Booking ID: ${booking.pk}`}
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            User Email:{" "}
                                            {booking.fields.user_email}
                                        </Typography>
                                        <div>
                                            Start Date:{" "}
                                            {booking.fields.start_date}
                                        </div>
                                        <div>
                                            End Date: {booking.fields.end_date}
                                        </div>
                                        <div>
                                            Time: {booking.fields.start_time} to{" "}
                                            {booking.fields.end_time}
                                        </div>
                                        <div>
                                            Price: ${booking.fields.price}
                                        </div>
                                        {/* Add more details as needed */}
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
