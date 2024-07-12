import React, { useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Importing the Close icon
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import axios from 'axios';
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInHours,
  parseISO,
} from "date-fns";
// import BookConfirmBtn from "../BookConfirm";
import AlertContext from "../../CustomAlert/AlertContext";

const cal_date = (startDate, endDate) => {
  const start_year = startDate.getFullYear();
  // getMonth() returns month from 0-11, adding 1 to get 1-12
  const start_month = (startDate.getMonth() + 1).toString().padStart(2, "0");
  const start_day = startDate.getDate().toString().padStart(2, "0");
  const start_date = `${start_year}-${start_month}-${start_day}`;

  // Format the time part to get the hour rounded down
  const start_hours = startDate.getHours().toString().padStart(2, "0");
  const start_time = `${start_hours}:00:00`;

  const end_year = endDate.getFullYear();
  // getMonth() returns month from 0-11, adding 1 to get 1-12
  const end_month = (endDate.getMonth() + 1).toString().padStart(2, "0");
  const end_day = endDate.getDate().toString().padStart(2, "0");
  const end_date = `${end_year}-${end_month}-${end_day}`;

  // Format the time part to get the hour rounded down
  const end_hours = endDate.getHours().toString().padStart(2, "0");
  const end_time = `${end_hours}:00:00`;

  const startDateTime = `${start_date}T${start_time}`;
  const endDateTime = `${end_date}T${end_time}`;

  // Parse the combined strings into Date objects
  const start = parseISO(startDateTime);
  const end = parseISO(endDateTime);

  // Calculate the monthspan/dayspan and total hours duration
  const monthspan = differenceInCalendarMonths(end, start);
  const dayspan = differenceInCalendarDays(end, start);
  const hourspan = differenceInHours(end, start);

  return {monthspan, dayspan, hourspan, start_date, end_date, start_time, end_time}
}

// Style for the modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
//   width: "50%",
  // height: "90%",
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function BookExtend({ open, handleClose, booking_id, listing }) {
  const { customAlert } = React.useContext(AlertContext);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  // console.log(listing, booking_id)

  const {monthspan, dayspan, hourspan, start_date, end_date, start_time, end_time} =  cal_date(startDate, endDate)
  console.log(monthspan, dayspan);
  const handleConfirm = () => {
    axios.post('http://localhost:8000/parking/byid/', {
      "parking_id": listing[0].parking_id
    }).then((response)=> {
      const data = JSON.parse(response.data)[0].fields;
      const price = data.price_hourly*hourspan;
      const extend_body = {
        booking_id: booking_id,
        start_date: start_date,
        end_date: end_date,
        start_time: start_time,
        end_time: end_time,
        price: price
      };
      console.log(extend_body);
      axios.put('http://127.0.0.1:8000/booking/update/', extend_body)
      .then((response)=>{
        customAlert(response.data);
      })
      .catch((error)=>{
        console.log(error);
      })
    })
    handleClose();
  }


  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 4,
            top: 4,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mt: "2rem", mb: "1rem" }}>
            Extend your booking here:
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Start Date"
              value={startDate}
              readOnly
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              views={["year", "month", "day", "hours"]}
              sx={{ mr: "2rem" }}
            />
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="End Date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              views={["year", "month", "day", "hours"]}
            />
          </LocalizationProvider>
      <Stack spacing={4} direction="row" mt={2} >
        {/* <BookConfirmBtn booking_details={booking_details} /> */}
        <Button variant="contained" onClick={handleConfirm}>Confirm</Button>
      </Stack> 
      </Box>
    </Modal>
  );
}

export default BookExtend;
