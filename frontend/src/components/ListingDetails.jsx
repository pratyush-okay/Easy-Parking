import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import axios from "axios";
import BookingSection from "./Book/BookingSection";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import Map from "./Maps/DisplayMap/map";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  paddingLeft: 0,
  textAlign: "left",
  fontSize: 13,
  boxShadow: "none",
}));

const ListingDetails = ({ userId, parkingId, type, parkingAvaliable }) => {
  const [details, setDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const fetchDetails = async () => {
    try {
      const response = await axios.post("http://localhost:8000/parking/byid/", {
        parking_id: parkingId,
      });
      const data = JSON.parse(response.data);
      setDetails(data[0].fields);
    } catch (error) {
      console.error("Failed to fetch parking details", error);
    }
  };

  const fetchImage = async () => {
    try {
      const formData_image = new FormData(); // Create a FormData instance
      formData_image.append("parking_id", parkingId);

      const response = await axios.post(
        "http://localhost:8000/image/parking/get",
        formData_image,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = response.data[0].image;
      setImageUrl(imageUrl);
      // console.log("image retrieved success");
      // console.log("---------image retrieved success  ----------------");
      // console.log(response.data[0].image);
    } catch (error) {
      console.error("Failed to fetch parking details", error);
    }
  };

  useEffect(() => {
    // Only fetch details if parkingId is provided and modal is open
    if (parkingId) {
      fetchDetails();
      fetchImage();
    }
  });

  const BASE_URL_backend = "http://localhost:8000";

  return (
    <>
      {/* detail info of the space  */}
      <Grid container spacing={1} sx={{ padding: 2 }}>
        <Grid item xs={12} md={12} sx={{ marginTop: 1 }}>
          {imageUrl ? (
            <img
              style={{
                width: "100%",
                height: "250px",
                margin: 0,
                objectFit: "cover",
                borderRadius: "10px",
              }}
              src={`${BASE_URL_backend}${imageUrl}`}
              alt="parking img"
            />
          ) : (
            <img
              style={{
                width: "100%",
                height: "250px",
                margin: 0,
                objectFit: "cover",
                borderRadius: "10px",
              }}
              src={require("../img/parkingImage_default_large.jpg")}
              // src={require("../img/parking.jpg")}
              alt="parking img"
            />
          )}
        </Grid>

        <Grid item xs={6} md={6.5}>
          {/****** TITLE ******/}
          <Item sx={{ fontSize: 22, fontWeight: "bold" }}>
            {details?.title}
          </Item>

          {/****** ADDRESS ******/}
          <Item>
            <RoomOutlinedIcon />
            &nbsp;
            {details?.location}
          </Item>

          <Item>
            <DirectionsCarFilledOutlinedIcon />
            &nbsp; height {details?.parking_space_height} * width{" "}
            {details?.parking_space_width} * length{" "}
            {details?.parking_space_length}
          </Item>

          {/****** FEATURES ******/}
          <Item sx={{ maxHeight: "20%", overflowX: "scroll" }}>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ height: "100%" }}
            >
              {details &&
                details.features &&
                details.features.split(",").map((item, i) => {
                  return <Chip icon={<FaceIcon />} label={item} size="small" />;
                })}
            </Stack>
          </Item>

          {/****** DESCRIPTION ******/}
          <Item
            sx={{ minHeight: "20%", maxHeight: "22%", overflowX: "scroll" }}
          >
            {details?.description}
          </Item>
        </Grid>

        <Grid item xs={6} md={5.5}>
          {type === "booking" ? (
            /****** BOOKING SECTION ******/
            <Item
              sx={{
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                padding: 3,
              }}
            >
              <BookingSection
                userId={userId}
                selectedParking={parkingId}
                dailyRate={details ? details.price_daily : null}
                hourlyRate={details ? details.price_hourly : null}
                monthlyRate={details ? details.price_monthly : null}
                parkingAvaliable={parkingAvaliable}
              />
            </Item>
          ) : type === "mapImg" ? (
            /****** MAP IMG SECTION ******/
            <div style={{ height: "100%" }}>
              <Map
                coor={
                  details && { lat: details.latitude, lng: details.longitude }
                }
              />
            </div>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default ListingDetails;
