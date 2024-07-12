import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import TextField from "@mui/material/TextField";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInHours,
  parseISO,
} from "date-fns";
import { MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";

import BookConfirmBtn from "./BookConfirm.jsx";

const BookingSection = ({
  userId,
  selectedParking,
  handleViewAllListings,
  dailyRate = null,
  hourlyRate = null,
  monthlyRate = null,
  parkingAvaliable,
}) => {
  // Define default props for your component
  BookingSection.defaultProps = {
    dailyRate: null,
    hourlyRate: null,
    monthlyRate: null,
  };

  console.log(selectedParking);

  const selectedParkingDetail = JSON.parse(localStorage.getItem('allParkings')).filter(item => item.pk === selectedParking)[0];
  console.log(selectedParkingDetail);

  const [bookingType, setBookingType] = useState("Hour");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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

  let price = 0;
  if (bookingType === "Month") {
    const rate =
      monthlyRate !== null ? monthlyRate : selectedParking.price_monthly;
    console.log(selectedParking.price_monthly);
    price = monthspan * rate;
  } else if (bookingType === "Day") {
    const rate = dailyRate !== null ? dailyRate : selectedParking.price_daily;
    price = dayspan * rate;
  } else {
    const rate =
      hourlyRate !== null ? hourlyRate : selectedParking.price_hourly;
    price = hourspan * rate;
  }
  console.log(monthspan, dayspan, hourspan, price);

  const booking_details = {
    user_id: userId,
    parking_id: selectedParking,
    start_date: start_date,
    end_date: end_date,
    start_time: start_time,
    end_time: end_time,
    price: price,
    description: selectedParkingDetail.fields.description,
    location: selectedParkingDetail.fields.location,
    host_email: selectedParkingDetail.fields.host_email,
  };

  const handleBookingTypeChange = (event) => {
    setBookingType(event.target.value);
  };

  console.log(bookingType);
  return (
    <>
      {/* <Box className="profile-actions" sx={{ mt: "2rem" }}>
        <ArrowBackIcon onClick={() => handleViewAllListings()} />
      </Box> */}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>${hourlyRate ? hourlyRate : "-"} / hour</div>
        <div>${dailyRate ? dailyRate : "-"} / daily</div>
        <div>${monthlyRate ? monthlyRate : "-"} / monthly</div>
      </div>
      <br />
      <Grid container columns={16}>
        <Grid item xs={16}>
          <TextField
            select
            label="Booking Type"
            value={bookingType}
            onChange={handleBookingTypeChange}
            fullWidth
          >
            <MenuItem value="Hour">Hour</MenuItem>
            <MenuItem value="Day">Day</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
          </TextField>
        </Grid>

        {/* <Box sx={{display: 'flex', justifyContent: 'center'}} m={'4rem 0 2rem 0'}>
        <Typography variant="h5" component="h2">
          Set your booking duration here
        </Typography>
      </Box> */}

        {bookingType === "Hour" && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={8}>
              <DateTimePicker
                label="Start Date"
                renderInput={(props) => <TextField {...props} />}
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                views={["year", "month", "day", "hours"]}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={8}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                views={["year", "month", "day", "hours"]}
                sx={{ width: "100%" }}
              />
            </Grid>
          </LocalizationProvider>
        )}
        {bookingType === "Day" && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={8}>
              <DatePicker
                renderInput={(props) => <TextField {...props} />}
                fullWidth
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={8}>
              <DatePicker
                renderInput={(props) => <TextField {...props} />}
                fullWidth
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
          </LocalizationProvider>
        )}
        {bookingType === "Month" && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={8}>
              <DatePicker
                renderInput={(props) => <TextField {...props} />}
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                views={["year", "month"]}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={8}>
              <DatePicker
                renderInput={(props) => <TextField {...props} />}
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                views={["year", "month"]}
                sx={{ width: "100%" }}
              />
            </Grid>
          </LocalizationProvider>
        )}
      </Grid>

      <Stack spacing={4} direction="row" mt="1rem">
        <BookConfirmBtn
          booking_details={booking_details}
          disabled={!parkingAvaliable}
        />
      </Stack>
    </>
  );
};

export default BookingSection;
