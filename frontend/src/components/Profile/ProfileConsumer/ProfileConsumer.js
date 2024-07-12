import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import ConsumerAllListings from "./ConsumerAllListings/ConsumerAllListings";
import Favourites from "./Favourites/Favourites.jsx";
import Review from "./ConsumerAllListings/Review/Review.js";
import AddFavourites from "./Favourites/AddFavourite/AddFavourite.js";
import { useNavigate } from "react-router-dom";
import "./ProfileConsumer.css";
import CustomProfileCard from "../../CustomProfileCard.jsx";

function ProfileConsumer() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(11);
  const [userEmail, setUserEmail] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAllBooking, setshowAllBooking] = useState(false);
  const [review, setReview] = useState(false);
  const [AddFavourite, setAddFavourite] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const userType = localStorage.getItem("UserType");

  useEffect(() => {
    const userEmail = localStorage.getItem("UserEmail");
    console.log("token:", userEmail);
    const userId = localStorage.getItem("UserId");
    if (userEmail) {
      console.log(userEmail);
      setUserEmail(userEmail);
      setUserId(userId);
    }
  }, []);

  const handleViewAllFavorites = () => {
    setshowAllBooking(false);
    setShowFavorites(true);
    setReview(false);
    setAddFavourite(false);
  };

  const handleAddFavourite = () => {
    setAddFavourite(true);
    setshowAllBooking(false);
    setShowFavorites(false);
  };

  const handleViewAllBookings = () => {
    setShowFavorites(false);
    setshowAllBooking(true);
    setReview(false);
    setAddFavourite(false);
  };

  const handleReview = () => {
    setShowFavorites(false);
    setshowAllBooking(false);
    if (review) {
      setReview(false);
    } else {
      setReview(true);
    }
  };

  const handleReviewRate = (parking) => {
    setSelectedParking(parking);
    handleReview();
  };

  const directToPersonalInfo = () => {
    navigate("/profile/personalinfo");
  };

  const directToCarlInfo = () => {
    navigate("/profile/cardetails");
  };

  const directToSetPayment = () => {
    navigate("/profile/bankaccount");
  };

  const directToFavourites = () => {
    navigate("/profile/favourites");
  };

  const items = {
    host: {
      "Personal Info": directToPersonalInfo,
      "Payment": directToSetPayment,
    },
    guest: {
      "Personal Info": directToPersonalInfo,
      "Car Info": directToCarlInfo,
      "Favourite Locations": directToFavourites,
    },
    admin: {
      "Personal Info": directToPersonalInfo,
    },
  };

  const description = {
    "Personal Info": "Provide personal details and how we can reach you",
    "Payment": "Set your account",
    "Car Info": "Set and edit your cars",
    "Booking History": "View all of your boking history",
    "Favourite Locations": "Set and edit your favourite locations",
  };

  return (
    <>
      <Grid container justifyContent="center" spacing={3} sx={{width: '100%'}}>
        {Object.entries(items[userType]).map(([key, value]) => {
          return (
            <CustomProfileCard
              handleOnclick={value}
              title={key}
              description={description[key]}
            />
          );
        })}
      </Grid>

      {showAllBooking && (
        <div>
          <ConsumerAllListings
            userEmail={userEmail}
            onReviewRate={handleReviewRate}
          />
        </div>
      )}
      {showFavorites && (
        <div>
          <Favourites userId={userId} onAddFavourite={handleAddFavourite} />
        </div>
      )}
      {review && (
        <div>
          <Review
            userId={userId}
            parking={selectedParking}
            handleViewAllBookings={handleViewAllBookings}
          />
        </div>
      )}
      {AddFavourite && (
        <div>
          <AddFavourites
            userId={userId}
            handleViewAllFavorites={handleViewAllFavorites}
          />
        </div>
      )}
    </>
  );
}

export default ProfileConsumer;
