import React from "react";
import axios from "axios";

const AutoCarFilter = (props) => {
  const userEmail = props.userEmail;
  const [AllListings, setAllListings] = React.useState([]);
  const [carDetails, setCarDetails] = React.useState([]);

  React.useEffect(() => {
    getCarSpace();
    getCarInfo();
  });

  React.useEffect(() => {
    filterListings();
  });

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
        title: item.fields.title,
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
    } catch (error) {
      console.error("Error getting car details:", error);
    }
  };

  /*************  Filter part ************/
  // Define carSize to numerical
  const carSize = {
    Sedan: 1.8,
    Large: 2.0,
    Van: 2.2,
  };

  const filterListings = () => {
    console.log("cardetails.length:",carDetails.length);
    if (!carDetails.length) {
      return [];
    }
    // Change car type to car size
    const carSizeThreshold = carSize[carDetails[0].fields.vehicle_type];
    console.log(carSizeThreshold);
    const filteredListings = AllListings.filter((listing) => {
      // Check requirement matches
      const sizeMatch = listing.parking_space_length >= carSizeThreshold;
      if (carDetails[0].fields.ev) {
        return sizeMatch && listing.features.includes("Electric charging");
      } else {
        return sizeMatch;
      }
    });
    props.setFilterListings(filteredListings);
    console.log(filteredListings);
  };

};

export default AutoCarFilter;
