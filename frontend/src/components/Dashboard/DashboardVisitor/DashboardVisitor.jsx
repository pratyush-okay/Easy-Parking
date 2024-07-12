import "../../LoginPage/login.css";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Map from "../../Map.jsx";
import TransCoorAddr from "../../TransCoorAddr.jsx";
import TuneIcon from "@mui/icons-material/Tune";
import SwapVertTwoToneIcon from "@mui/icons-material/SwapVertTwoTone";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import TextField from "@mui/material/TextField";
import SearchBar from "../../Search/Search.jsx";
import Button from "@mui/material/Button";
import { List, ListItem } from "@mui/material";
import { Grid } from "@mui/material";

import axios from "axios";
import MyButton from "../../MyButton.jsx";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";


function DashboardVisitor() {
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [AllListings, setAllListings] = useState(JSON.parse(localStorage.getItem('allParkings')));

  const [currentLocation, setCurrentLocation] = useState({
    lat: -33.9173, // Default location (UNSW), update based on actual use case
    lng: 151.2313,
  });
  const [currentAddr, setCurrentAddr] = useState("");
  const [selectedListingId, setLSelectedListingId] = React.useState(""); // current selected marker listing id

  const [selectedSearch, setSelectedSearch] = useState(null);

  

  const recenter = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = { lat: null, lng: null };
          setCurrentLocation(pos);
          pos.lat = position.coords.latitude;
          pos.lng = position.coords.longitude;
          setCurrentLocation(pos);
          setAdd(pos);
        },
        (error) => {
          console.error("Error obtaining geolocation:", error);
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  };

  const setAdd = async (coor) => {
    const add = await TransCoorAddr(coor, "coor_to_address");
    setCurrentAddr(add);
  };


  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    paddingLeft: 0,
    textAlign: "left",
    fontSize: 13,
    boxShadow: "none",
    backgroundColor: "transparent",
  }));

  const getAllListings = async ()=>{
    
      // Map and fetch images concurrently with initial data fetch
      const enrichedListingsData = await Promise.all(
        AllListings.map(async (item) => {
          const formData_image = new FormData();
          formData_image.append("parking_id", item.pk);
    
          // let imageUrl = "../../../../img/parkingImage_default.jpg"; // Default image
          let imageUrl = null; // Default image
          const BASE_URL_backend = "http://localhost:8000";
          try {
            const imageResponse = await axios.post(
              "http://localhost:8000/image/parking/get",
              formData_image,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
    
            if (imageResponse.data.length > 0) {
              imageUrl = `${BASE_URL_backend}${imageResponse.data[0].image}`;
            }
          } catch (imageError) {
            console.error(
              `Failed to fetch image for parking_id ${item.pk}:`,
              imageError
            );
          }
          console.log(
            `Image URL for ${item.pk}: ${imageUrl}, \n and the listing.imageUrl !== null is ${imageUrl !== null}`
          ); // Debug log
    
          return {
            ...item,
            imageUrl: imageUrl, // Add image URL to each listing
          };
        })
      );
      setAllListings(enrichedListingsData);
      console.log(enrichedListingsData);
  }

  useEffect(() => {
    recenter();
    getAllListings();
    console.log(AllListings);
  });

  return (
    <div className="map-main">
      {/* LEFT PART (LISTINGS QUERY RESULT) */}
      <Box className="map-left">
        {AllListings && (
          <>
            {/*********** query bar ***********/}

            <SearchBar
              currentAddr={currentAddr}
              setSelectedSearch={setSelectedSearch}
            />
            <Stack direction="row" spacing={1} alignItems="center" pt={"10px"}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="From"
                  value={startDateTime}
                  slotProps={{ textField: { size: "small" } }}
                  onChange={(newValue) => {
                    setStartDateTime(newValue);
                  }}
                  views={["year", "month", "day", "hours"]}
                  sx={{ width: "30%" }}
                />
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="To"
                  value={endDateTime}
                  slotProps={{ textField: { size: "small" } }}
                  onChange={(newValue) => {
                    setEndDateTime(newValue);
                  }}
                  views={["year", "month", "day", "hours"]}
                  sx={{ width: "30%" }}
                />
              </LocalizationProvider>
              <Button
                variant="outlined"
                sx={{ color: "#0b4f8b" }}
              >
                <TuneIcon sx={{ pr: "0.3rem" }} />
                Filters
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "#0b4f8b" }}
              >
                <SwapVertTwoToneIcon sx={{ pr: "0.3rem" }} />
                SortBy
              </Button>
            </Stack>

            {/*********** show listings  ***********/}
            <Box sx={{ overflowX: "scroll", height: "84%" }}>
            <List>
                {!AllListings.length ? (
                <>&nbsp;&nbsp;&nbsp;No listing is matched ... </>
                ) : null}

                {AllListings.map((listing, index) => (
                <ListItem
                    key={index}
                    divider
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    cursor: "pointer",
                    backgroundColor:
                        listing.parking_id === selectedListingId ? "#e5e5e5" : "white",
                    // opacity: listing.available ? 1 : 0.7, // Apply opacity directly here for entire item
                    }}
                >
                    <Grid
                    container
                    spacing={1}
                    >
                    {/****** IMG ******/}
                    <Grid item xs={12} md={4} sx={{ marginTop: 1 }}>
                        <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "140px",
                            borderRadius: "10px",
                            overflow: "hidden",
                        }}
                        >
                        <img
                            style={{
                            width: "100%",
                            height: "100px",
                            margin: 0,
                            objectFit: "cover",
                            borderRadius: "10px",
                            // opacity: listing.available ? 1 : 0.5, // Make image semi-transparent if unavailable
                            }}
                            src={
                            listing.imageUrl !== null
                                ? listing.imageUrl
                                : require("../../../img/parkingImage_default.jpg")
                            }
                            // src={require("../../../../img/parkingImage_default.jpg")}
                            alt="parking img"
                        />

                        </div>
                    </Grid>

                    <Grid item xs={6} md={8}>
                        {/****** TITLE ******/}
                        <Item
                        sx={{
                            fontSize: 16,
                            fontWeight: "bold",
                            // color: listing.available ? "black" : "red", // Text color based on availability
                        }}
                        >
                        {listing.fields.title}
                        </Item>

                        {/****** ADDRESS ******/}
                        <Item>
                        <RoomOutlinedIcon />
                        {listing.fields.location}
                        </Item>

                        <Item sx={{ height: "30%", overflowX: "scroll" }}>
                        {listing.fields.description}
                        </Item>

                        <Item>
                        {/* btn (Detail & Book)*/}
                        <Stack
                            spacing={1}
                            direction="row"
                            className="listing-query-btns"
                        >
                            <MyButton
                            size="sm"
                            variant="outlined"
                            // onClick={() => handleOpenModal(listing.parking_id)}
                            >
                            Details
                            </MyButton>

                        </Stack>
                        </Item>
                    </Grid>
                    </Grid>
                </ListItem>
                ))}
            </List>
            </Box>
          </>
        )}
      </Box>

      {/* RIGHT PART (MAP) */}
      <div className="map-right">
        <Map
        //   selectedFavorite={selectedFavorite}
        //   selectedParkingMap={selectedParkingMap}
          currentLocation={currentLocation}
          recenter={recenter}
          setLSelectedListingId={setLSelectedListingId}
          selectedSearch={selectedSearch}
        />
      </div>


    </div>
  );
}

export default DashboardVisitor;
