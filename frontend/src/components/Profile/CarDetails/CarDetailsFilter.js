import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import CustomModal from "../../CustomModal.jsx";

import MakeABookingModal from "../../ViewListingDetail/MakeABookingModal";
import AlertContext from "../../CustomAlert/AlertContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const CarDetailsFilter = (props) => {
  const {customAlert} = React.useContext(AlertContext);
  const userEmail = props.userEmail;
  const [AllListings, setAllListings] = React.useState([]);
  const [carDetails, setCarDetails] = React.useState([]);
  const [filteredListings, setFilterListings] = React.useState([]);
  const [selectedParkingId, setSelectedParkingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  React.useEffect(() => {
    getCarSpace();
    getCarInfo();
  });
  console.log("userEmail:", userEmail);

  // Get car space details
  const getCarSpace = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/parking/all/",
        {}
      );
      const data = JSON.parse(response.data);
      //console.log("data:",data);
      const allListings = data.map((item) => ({
        parking_id: item.pk,
        start_date: item.fields.start_date,
        end_date: item.fields.end_date,
        location: item.fields.location, // Initialize location
        description: item.fields.description, // Initialize description
        price_daily: item.fields.price_daily,
        price_hourly: item.fields.price_hourly,
        price_monthly: item.fields.price_monthly,
        host_email: item.fields.host_email,
        parking_space_length: parseFloat(item.fields.parking_space_length),
        features: item.fields.features,
      }));
      setAllListings(allListings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Get default car details

  const getCarInfo = async () => {
    try {
      const getresponse = await axios.post(
        "http://127.0.0.1:8000/user/cardetails/get",
        {
          user_email: userEmail,
        }
      );
      const cars = JSON.parse(getresponse.data) || [];
      const defaultCar = cars.find((car) => car.fields.default === true);
      setCarDetails(defaultCar ? [defaultCar] : []);
      if (!defaultCar) {
        // Remind user to add their default car detail
        customAlert(
          "Please add your default car detail in profile to filter automatically your parking list. Otherwise it will not show your result based on your car details."
        );
      }
    } catch (error) {
      console.error("Error getting car details:", error);
    }
  };

  // copy from AllListings.js
  const handleOpenModal = (parkingId) => {
    setSelectedParkingId(parkingId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenBookingModal = (parkingId) => {
    setSelectedParkingId(parkingId);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  console.log("CarDetails:", carDetails);
  console.log("Parkingspce:", AllListings);

  /*************  Filter part ************/
  // Define carSize to numerical
  const carSize = {
    Sedan: 1.8,
    Large: 2.0,
    Van: 2.2,
  };

  const filterListings = () => {
    // console.log("cardetails.length:",carDetails.length);
    if (!carDetails.length) {
      return [];
    }
    // Change car type to car size
    const carSizeThreshold = carSize[carDetails[0].fields.vehicle_type];
    // console.log("carDetails[0].fields.vehicle_type",carDetails[0].fields.vehicle_type);

    const filteredListings = AllListings.filter((listing) => {
      // Check requirement matches
      const sizeMatch = listing.parking_space_length >= carSizeThreshold;
      // console.log("listing.parking_space_length",listing.parking_space_length);
      // console.log("carSizeThreshold",carSizeThreshold);
      // console.log("sizematch:",sizeMatch);
      // console.log("carDetails[0].fields.ev:",carDetails[0].fields.ev);
      if (carDetails[0].fields.ev) {
        // console.log("listing.features:",listing.features);
        return sizeMatch && listing.features.includes("Electric charging");
      } else {
        return sizeMatch;
      }
    });
    setFilterListings(filteredListings);
  };
  useEffect(() => {
    filterListings();
  });
  
  const tabs = {'details': 'Parking Space Details', 'reviews': 'Reviews'} // key: tab item, value: tab display

  console.log("filteredListings:", filteredListings);
  return (
    <div>
      {filteredListings.length === 0 ? (
        <p>
          No available parking spaces based on your default car details. You can
          try to set another car details default. Or waiting available parking
          spaces released, thank you!
        </p>
      ) : (
        <div className="home">
          <h1>
            Here are some available parking spaces based on your default car
            details.
          </h1>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              {filteredListings.map((listing, index) => (
                <Grid key={index} xs={12} sm={6} md={4} lg={3} item>
                  <Item sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography sx={{ mb: 2 }} variant="h5" component="div">
                        {listing.location}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 18, mb: 2 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {listing.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={async () =>
                          handleOpenModal(listing.parking_id)
                        }
                        size="small"
                      >
                        Details
                      </Button>
                      <Button
                        onClick={() => handleOpenBookingModal(listing)}
                        size="small"
                      >
                        {/* <Button onClick={() => handleBook(listing)} size="small"> */}
                        Book
                      </Button>
                    </CardActions>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      )}

      <CustomModal
        tabs={tabs}
        modalStatus={isModalOpen}
        closeModal={handleCloseModal}
        userId={props.userId}
        parkingId={selectedParkingId}
      />

      <MakeABookingModal
        userId={props.userId}
        parkingId={selectedParkingId}
        open={isBookingModalOpen}
        onClose={handleCloseBookingModal}
      />
    </div>
  );
};

export default CarDetailsFilter;
