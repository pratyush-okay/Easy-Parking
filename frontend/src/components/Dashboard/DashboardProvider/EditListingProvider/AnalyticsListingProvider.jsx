import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  List,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflox: 'auto',
};

function AnalyticsListingProvider({ parkingId, open, onClose }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000//booking/parking/",
          {
            parking_id: parkingId,
          }
        );
        let data = JSON.parse(response.data);
        // Sort the bookings based on start_date and start_time
        data.sort((a, b) => {
          const dateTimeA = new Date(
            `${a.fields.start_date}T${a.fields.start_time}`
          );
          const dateTimeB = new Date(
            `${b.fields.start_date}T${b.fields.start_time}`
          );
          return dateTimeB - dateTimeA; // Descending order
        });
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };

    if (parkingId && open) {
      fetchBookings();
    }
  }, [parkingId, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="all-bookings-modal-title"
      aria-describedby="all-bookings-modal-description"
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
        <Typography id="all-bookings-modal-title" variant="h6" component="h2">
          All Bookings
        </Typography>
        <Divider sx={{ my: 2 }} />
        {/* {bookings.length > 0 ? (
          <List sx={{ maxHeight: "70%", overflow: "auto" }}>
            {bookings.map((booking) => (
              <ListItem key={booking.pk} divider>
                <ListItemText
                  primary={`${booking.fields.user_email}`}
                  secondary={`From ${booking.fields.start_date} ${booking.fields.start_time} to ${booking.fields.end_date} ${booking.fields.end_time} | Price: ${booking.fields.price}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          // <Typography
          //   id="all-bookings-modal-title"
          //   variant="h10"
          //   component="h2"
          // >
          //   No booking history
          // </Typography>
          <Typography variant="subtitle1" gutterBottom>
            No booking history
          </Typography>
        )} */}

        {bookings.length > 0 ? (
          <List>
            {bookings.map((booking) => (
              <Card key={booking.pk} sx={{ my: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar>
                      <EmailIcon />
                    </Avatar>
                  }
                  title={booking.fields.user_email}
                  // subheader={`Booking ID: ${booking.pk}`}
                />

                <CardContent sx={{ pt: 0 }}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <EventIcon color="action" />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="body1">
                        {`From ${booking.fields.start_date} at ${booking.fields.start_time} to ${booking.fields.end_date} at ${booking.fields.end_time}`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <MonetizationOnIcon color="action" />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">
                        {`$${booking.fields.price}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </List>
        ) : (
          // <Typography
          //   id="all-bookings-modal-title"
          //   variant="h10"
          //   component="h2"
          // >
          //   No booking history
          // </Typography>
          <Typography variant="subtitle1" gutterBottom>
            No booking history
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

export default AnalyticsListingProvider;
