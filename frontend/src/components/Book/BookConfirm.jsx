import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
// import axios from "axios";
import { Link } from "react-router-dom";
import AlertContext from "../CustomAlert/AlertContext";
import MyButton from "../MyButton";
function BookConfirmBtn({ booking_details, parkingAvaliable = true }) {
  const { customAlert } = React.useContext(AlertContext);
  const userEmail = localStorage.getItem('UserEmail');
  const userType = localStorage.getItem('UserType');
  console.log(booking_details);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    
    const start_date = booking_details.start_date;
    const start_time = booking_details.start_time;
    const end_date = booking_details.end_date;
    const end_time = booking_details.end_time;
    // Combine date and time strings into full datetime strings
    const endDateTimeStr = `${end_date}T${end_time}`;
    const startDateTimeStr = `${start_date}T${start_time}`;

    // Convert datetime strings to Date objects
    const endDateObj = new Date(endDateTimeStr);
    const startDateObj = new Date(startDateTimeStr);
    if (localStorage.getItem("UserType") === "guest") {
      if (startDateObj < endDateObj) {
        setOpen(true);
      } else {
        // setAlertOpen(true);
        customAlert("Invalid Duration!!");
      }
    } else {
      customAlert("Please log in first!!");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const data = {
  //   user_email: UserEmail,
  //   parking_id: booking_details.parking_id,
  //   start_date: booking_details.start_date,
  //   end_date: booking_details.end_date,
  //   start_time: booking_details.start_time,
  //   end_time: booking_details.end_time,
  //   price: booking_details.price,
  // };
  const handleConfirm = () => {
    // Handle the confirmation action here
    // axios
    //   .post("http://127.0.0.1:8000/booking/create/", data)
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });

    setOpen(false);
  };

  return (
    <>
      {/* <Button variant="outlined" sx={{ width: '25%' }}>Cancel</Button> */}
      <MyButton
        onClick={handleClickOpen}
        sx={{ width: "100%" }}
        disabled={!parkingAvaliable || userType !== 'guest'}
        title={!userEmail ? 'please login first' :userType !== 'guest' ? 'only guest can make bookings' :!parkingAvaliable ? 'parking not available' : null}
      >
        Book
      </MyButton>

      {/* <Button
        variant="outlined"
        sx={{ width: "25%" }}
        color="error"
      >
        Cancel
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Book Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography paragraph={true} mb={0}>
              Location: {booking_details.location}{" "}
            </Typography>
            <Typography paragraph={true} mb={0}>
              Start from: {booking_details.start_date}{" "}
              {booking_details.start_time}
            </Typography>
            <Typography paragraph={true} mb={0}>
              End at: {booking_details.end_date} {booking_details.end_time}
            </Typography>
            <Typography paragraph={true} mb={0}>
              Total Price: {booking_details.price} AUD
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MyButton
            onClick={handleClose}
            color="red"
            variant="outlined"
            size="sm"
          >
            Cancel
          </MyButton>
          <Link to="/payment" state={{ booking_details }}>
            <MyButton onClick={handleConfirm} size="sm">
              Pay
            </MyButton>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BookConfirmBtn;
