import React from "react";
import { Stack, List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import MyButton from "../../../MyButton";
import CustomModal from "../../../CustomModal.jsx";
import MakeABookingModal from "../../../ViewListingDetail/MakeABookingModal";
import { getDistance } from "geolib";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AlertContext from "../../../CustomAlert/AlertContext";
import ApiCallPost from "../../../../action/ApiCallPost.jsx";

const favoriteButtonStyle = {};

function transformDateTime(data) {
  const newFormat = {};

  // Creating a Date object from the ISO string
  const startDate = new Date(data.startDateTime);
  const endDate = new Date(data.endDateTime);

  // Formatting the dates (YYYY-MM-DD) and times (HH:mm:ss)
  newFormat.start_date = startDate.toISOString().split("T")[0]; // Splits and takes the date part
  newFormat.end_date = endDate.toISOString().split("T")[0]; // Splits and takes the date part
  newFormat.start_time = startDate.toISOString().split("T")[1].slice(0, 8); // Splits, takes time, and removes milliseconds
  newFormat.end_time = endDate.toISOString().split("T")[1].slice(0, 8); // Splits, takes time, and removes milliseconds

  return newFormat;
}

function AllListings({
  userId,
  setSelectedParking,
  handleViewListingBooking,
  handleViewDetails,
  handleSelectedParkingMap,
  selectedListingId,
  userEmail,
  userType,
  currentLocation,
  filter,
  sortby,
  isFilterApply,
  duration,
}) {
  const { customAlert } = React.useContext(AlertContext);
  const [AllListings, setAllListings] = useState([]);
  const [selectedParkingId, setSelectedParkingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [userLikes, setUserLikes] = useState([]);
  const [isDisabled,setIsDisabled] = useState(false);
  const duration_body = transformDateTime(duration);

  const DistanceCalculator = (currentLocation, destLocation) => {
    // Calculate distance
    const distance = getDistance(currentLocation, destLocation);
    // Convert distance from meters to kilometers
    const distanceInKm = distance / 1000;
    return distanceInKm;
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

  const handleCardOnclick = (parkingId) => {
    setSelectedParkingId(parkingId);
    handleSelectedParkingMap(parkingId);
  };

  /***** get fav parking from backend (by email) *****/
  const fetchAllLikes = async () => {
    const params = {
      user_email: userEmail,
    };
    let data = await ApiCallPost("parking/likes/user/all", params, "", false);
    if (data) {
      data = JSON.parse(data).map((item) => item.fields.parking_id);
      setUserLikes(data);
    }
  };

  /***** liked a parking *****/
  const liked = async (parkingId) => {
    const params = {
      user_email: userEmail,
      parking_id: parkingId,
    };
    let data = await ApiCallPost("parking/likes/user/add", params, "", false);
    if (data) {
      fetchAllLikes();
    }
  };

  /***** disliked a parking *****/
  const disliked = async (parkingId) => {
    const params = {
      user_email: userEmail,
      parking_id: parkingId,
    };
    let data = await ApiCallPost(
      "parking/likes/user/remove",
      params,
      "",
      false
    );
    if (data) {
      fetchAllLikes();
    }
  };
  

  // Get all listings
  useEffect(() => {
    const getAlllistings = async () => {
      try {
        const params = {
          user_email: userEmail,
        };
        let likesData = await ApiCallPost("parking/likes/user/all", params, "", false);
        if (likesData) {
          likesData = JSON.parse(likesData).map((item) => item.fields.parking_id);
          setUserLikes(likesData);
        }
  
        // Get disability status
        const response = await axios.post(
          "http://localhost:8000/user/byemail/",
          {
            email: userEmail,
          }
        );
        // console.log("response:",response); # for debug
        const userData = JSON.parse(response.data)[0];
        setIsDisabled(userData.fields.disabled);
        // console.log('disabled:',isDisabled); # for debug
        // console.log('useremail:',userEmail); # for debug

        
        // Disability Status: true
        if (userData.fields.disabled) {
          // Get all parking listings with disability friendy listings
          const responseparking = await axios.get("http://localhost:8000/parking/all/");
          const listingsData = JSON.parse(responseparking.data);
          // console.log('listingsData:',listingsData); # for debug
          const filteredListingsbydisability = listingsData.filter((listing) =>
            listing.fields.features.includes("Disability Friendly")
          );

          // Map and fetch images concurrently with initial data fetch
          const enrichedListingsData = await Promise.all(
            filteredListingsbydisability.map(async (item) => {
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
          console.log("Enriched listings data:", enrichedListingsData); // Debug log
  
          if (isFilterApply) {
            // If filters are applied, fetch additional data required for filtering
            const carDetailsResponse = axios.post(
              "http://127.0.0.1:8000/user/cardetails/get",
              {
                user_email: userEmail,
              }
            );
            const reviewsResponse = axios.get(
              "http://127.0.0.1:8000/reviews/all/"
            );
            const availabilityResponse = axios.post(
              "http://127.0.0.1:8000/parking/available/all",
              {
                start_date: duration_body.start_date,
                end_date: duration_body.end_date,
                start_time: duration_body.start_time,
                end_time: duration_body.end_time,
              }
            );
  
            const [carDetailsResult, reviewsResult, availabilityResult] =
              await Promise.all([
                carDetailsResponse,
                reviewsResponse,
                availabilityResponse,
              ]);
            const carDetails = JSON.parse(carDetailsResult.data) || [];
            const reviews = JSON.parse(reviewsResult.data);
            const availability = availabilityResult.data;
  
            let allListings = enrichedListingsData.map((item) => {
              // let allListings = listingsData.map((item) => {
              const reviewsForItem = reviews.filter(
                (review) => review.fields.parking_id === item.pk
              );
              const ratings = reviewsForItem.map((r) =>
                parseInt(r.fields.rating)
              );
              const averageRating = ratings.length
                ? ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length
                : 0;
  
              const featureList_mappings = {
                "24/7 Access": "access247",
                CCTV: "cctv",
                "Security gate": "securityGate",
                "Electrical charging": "evCharging",
                "Combination lock": "combinationLock",
                "Car Wash": "carwash",
                "Disability Friendly": "disability",
              };
  
              return {
                parking_id: item.pk,
                start_date: item.fields.start_date,
                end_date: item.fields.end_date,
                location: item.fields.location,
                description: item.fields.description,
                price_daily: item.fields.price_daily,
                price_hourly: item.fields.price_hourly,
                price_monthly: item.fields.price_monthly,
                host_email: item.fields.host_email,
                title: item.fields.title,
                features: item.fields.features
                  .split(", ")
                  .map((feature) => featureList_mappings[feature]),
                spot_type: item.fields.spot_type,
                distance: DistanceCalculator(currentLocation, {
                  latitude: item.fields.latitude,
                  longitude: item.fields.longitude,
                }),
                lat: item.fields.latitude,
                lng: item.fields.longitude,
                rating: averageRating,
                parking_space_length: parseFloat(
                  item.fields.parking_space_length
                ),
                available: !availability[item.pk],    // the api true/false means overlap or not
                imageUrl: item.imageUrl,
              };
            });
  
            // Apply sorting
            allListings.sort((a, b) => {
              // Sort by availability first (unavailable at the end)
              if (a.available && !b.available) {
                return -1; // a comes first
              } else if (!a.available && b.available) {
                return 1; // b comes first
              }
              // If both have the same availability, sort by the specified field
              if (sortby.sortBy === "price") {
                return sortby.order === "ascending"
                  ? a.price_hourly - b.price_hourly
                  : b.price_hourly - a.price_hourly;
              } else if (sortby.sortBy === "distance") {
                return sortby.order === "ascending"
                  ? a.distance - b.distance
                  : b.distance - a.distance;
              } else if (sortby.sortBy === "rating") {
                return sortby.order === "ascending"
                  ? a.rating - b.rating
                  : b.rating - a.rating;
              }
              return 1;
            });
  
            // Apply filtering
            allListings = allListings.filter((item) => {
              const carSize = {
                Sedan: 1.8,
                Large: 2.0,
                Van: 2.2,
              };
              if (carDetails.length === 0 && filter.filterCarAuto) return false;
              return (
                // item.available &&
                item.price_hourly >= filter.price[0] &&
                item.price_hourly <= filter.price[1] &&
                item.distance >= filter.distance[0] &&
                item.distance <= filter.distance[1] &&
                filter.parkingTypes[item.spot_type] &&
                Object.keys(filter.checked).every(
                  (key) =>
                    filter.checked[key] === false || item.features.includes(key)
                ) &&
                (!filter.filterCarAuto ||
                  item.parking_space_length >=
                    carSize[carDetails[0].fields.vehicle_type])
              );
            });
  
            setAllListings(allListings);
          } else {
            // Simpler listing processing when no filters are applied
            setAllListings(
              enrichedListingsData.map((item) => ({
                parking_id: item.pk,
                start_date: item.fields.start_date,
                end_date: item.fields.end_date,
                location: item.fields.location,
                description: item.fields.description,
                price_daily: item.fields.price_daily,
                price_hourly: item.fields.price_hourly,
                price_monthly: item.fields.price_monthly,
                host_email: item.fields.host_email,
                title: item.fields.title,
                available: true, // Assuming availability since detailed checks are not required
                imageUrl: item.imageUrl,
              }))
            );
          }

       // Disability Status: false
        } else { 
          const fetchData = async () => {
            try {
              const response = await axios.get("http://localhost:8000/parking/all/");
              const listingsData = JSON.parse(response.data);
      
              // Map and fetch images concurrently with initial data fetch
              const enrichedListingsData = await Promise.all(
                listingsData.map(async (item) => {
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
              console.log("Enriched listings data:", enrichedListingsData); // Debug log
      
              if (isFilterApply) {
                // If filters are applied, fetch additional data required for filtering
                const carDetailsResponse = axios.post(
                  "http://127.0.0.1:8000/user/cardetails/get",
                  {
                    user_email: userEmail,
                  }
                );
                const reviewsResponse = axios.get(
                  "http://127.0.0.1:8000/reviews/all/"
                );
                const availabilityResponse = axios.post(
                  "http://127.0.0.1:8000/parking/available/all",
                  {
                    start_date: duration_body.start_date,
                    end_date: duration_body.end_date,
                    start_time: duration_body.start_time,
                    end_time: duration_body.end_time,
                  }
                );
      
                const [carDetailsResult, reviewsResult, availabilityResult] =
                  await Promise.all([
                    carDetailsResponse,
                    reviewsResponse,
                    availabilityResponse,
                  ]);
                const carDetails = JSON.parse(carDetailsResult.data) || [];
                const reviews = JSON.parse(reviewsResult.data);
                const availability = availabilityResult.data;
      
                let allListings = enrichedListingsData.map((item) => {
                  // let allListings = listingsData.map((item) => {
                  const reviewsForItem = reviews.filter(
                    (review) => review.fields.parking_id === item.pk
                  );
                  const ratings = reviewsForItem.map((r) =>
                    parseInt(r.fields.rating)
                  );
                  const averageRating = ratings.length
                    ? ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length
                    : 0;
      
                  const featureList_mappings = {
                    "24/7 Access": "access247",
                    CCTV: "cctv",
                    "Security gate": "securityGate",
                    "Electrical charging": "evCharging",
                    "Combination lock": "combinationLock",
                    "Car Wash": "carwash",
                    "Disability Friendly": "disability",
                  };
      
                  return {
                    parking_id: item.pk,
                    start_date: item.fields.start_date,
                    end_date: item.fields.end_date,
                    location: item.fields.location,
                    description: item.fields.description,
                    price_daily: item.fields.price_daily,
                    price_hourly: item.fields.price_hourly,
                    price_monthly: item.fields.price_monthly,
                    host_email: item.fields.host_email,
                    title: item.fields.title,
                    features: item.fields.features
                      .split(", ")
                      .map((feature) => featureList_mappings[feature]),
                    spot_type: item.fields.spot_type,
                    distance: DistanceCalculator(currentLocation, {
                      latitude: item.fields.latitude,
                      longitude: item.fields.longitude,
                    }),
                    lat: item.fields.latitude,
                    lng: item.fields.longitude,
                    rating: averageRating,
                    parking_space_length: parseFloat(
                      item.fields.parking_space_length
                    ),
                    available: !availability[item.pk],    // the api true/false means overlap or not
                    imageUrl: item.imageUrl,
                  };
                });
      
                // Apply sorting
                allListings.sort((a, b) => {
                  // Sort by availability first (unavailable at the end)
                  if (a.available && !b.available) {
                    return -1; // a comes first
                  } else if (!a.available && b.available) {
                    return 1; // b comes first
                  }
                  // If both have the same availability, sort by the specified field
                  if (sortby.sortBy === "price") {
                    return sortby.order === "ascending"
                      ? a.price_hourly - b.price_hourly
                      : b.price_hourly - a.price_hourly;
                  } else if (sortby.sortBy === "distance") {
                    return sortby.order === "ascending"
                      ? a.distance - b.distance
                      : b.distance - a.distance;
                  } else if (sortby.sortBy === "rating") {
                    return sortby.order === "ascending"
                      ? a.rating - b.rating
                      : b.rating - a.rating;
                  }
                  return 1;
                });
      
                // Apply filtering
                allListings = allListings.filter((item) => {
                  const carSize = {
                    Sedan: 1.8,
                    Large: 2.0,
                    Van: 2.2,
                  };
                  if (carDetails.length === 0 && filter.filterCarAuto) return false;
                  return (
                    // item.available &&
                    item.price_hourly >= filter.price[0] &&
                    item.price_hourly <= filter.price[1] &&
                    item.distance >= filter.distance[0] &&
                    item.distance <= filter.distance[1] &&
                    filter.parkingTypes[item.spot_type] &&
                    Object.keys(filter.checked).every(
                      (key) =>
                        filter.checked[key] === false || item.features.includes(key)
                    ) &&
                    (!filter.filterCarAuto ||
                      item.parking_space_length >=
                        carSize[carDetails[0].fields.vehicle_type])
                  );
                });
      
                setAllListings(allListings);
              } else {
                // Simpler listing processing when no filters are applied
                setAllListings(
                  enrichedListingsData.map((item) => ({
                    parking_id: item.pk,
                    start_date: item.fields.start_date,
                    end_date: item.fields.end_date,
                    location: item.fields.location,
                    description: item.fields.description,
                    price_daily: item.fields.price_daily,
                    price_hourly: item.fields.price_hourly,
                    price_monthly: item.fields.price_monthly,
                    host_email: item.fields.host_email,
                    title: item.fields.title,
                    available: true, // Assuming availability since detailed checks are not required
                    imageUrl: item.imageUrl,
                  }))
                );
              }
            } catch (error) {
              console.error("Error fetching parking listings:", error);
            }
          };
          fetchData();
        }
      } catch (error) {
        console.error("Error getting disability status:", error);
      }
    };
    getAlllistings();
  }, [isFilterApply, sortby, filter, userEmail, currentLocation, isDisabled, duration_body.end_date, duration_body.end_time, duration_body.start_date, duration_body.start_time]);



  const handleOpenModal = (parkingId) => {
    setSelectedParkingId(parkingId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenBookingModal = (parkingId) => {
    if (localStorage.getItem("UserType") === "guest") {
      setSelectedParkingId(parkingId);
      setIsBookingModalOpen(true);
    } else {
      customAlert("Please log in first!!");
    }
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };
  const tabs = { details: "Parking Space Details", reviews: "Reviews" }; // key: tab item, value: tab display

  return (
    <>
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
              opacity: listing.available ? 1 : 0.7, // Apply opacity directly here for entire item
            }}
            onClick={() => handleCardOnclick(listing.parking_id)}
          >
            <Grid
              container
              onClick={() => handleViewDetails(listing.parking_id)}
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
                      opacity: listing.available ? 1 : 0.5, // Make image semi-transparent if unavailable
                    }}
                    src={
                      listing.imageUrl !== null
                        ? listing.imageUrl
                        : require("../../../../img/parkingImage_default.jpg")
                    }
                    // src={require("../../../../img/parkingImage_default.jpg")}
                    alt="parking img"
                  />
                  {!listing.available && (
                    <img
                      src={require("../../../../img/unavaliableIcon.jpg")}
                      alt="Unavailable"
                      style={{
                        position: "absolute",
                        top: "0", // Cover the entire image area
                        left: "0",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        // objectFit: "cover",
                        opacity: 0.7, // Ensures the stamp appears semi-transparently over the parking image
                      }}
                    />
                  )}
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
                  {listing.title}
                </Item>

                {/****** ADDRESS ******/}
                <Item>
                  <RoomOutlinedIcon />
                  {listing.location}
                </Item>

                <Item sx={{ height: "30%", overflowX: "scroll" }}>
                  {listing.description}
                </Item>

                <Item>
                  {/* btn (Detail & Book)*/}
                  <Stack
                    spacing={1}
                    direction="row"
                    className="listing-query-btns"
                  >
                    <MyButton
                      onClick={() => handleOpenModal(listing.parking_id)}
                      size="sm"
                      variant="outlined"
                    >
                      Details
                    </MyButton>

                    {userEmail && userType === 'guest'? (
                      <MyButton
                        onClick={() => handleOpenBookingModal(listing)}
                        size="sm"
                        // disabled={!listing.available} // Disable button if not available
                      >
                        Book
                      </MyButton>
                    ) : (
                      <></>
                    )}
                    {userEmail && userType === 'guest'? (
                      <IconButton style={favoriteButtonStyle}>
                        {userLikes.includes(listing.parking_id) ? (
                          <FavoriteOutlinedIcon
                            sx={{ fontSize: 25, color: "#ee204d" }}
                            onClick={() => disliked(listing.parking_id)}
                          />
                        ) : (
                          <FavoriteTwoToneIcon
                            sx={{ fontSize: 25 }}
                            onClick={() => liked(listing.parking_id)}
                          />
                        )}
                      </IconButton>
                    ) : null}
                  </Stack>
                </Item>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>

      <CustomModal
        tabs={tabs}
        modalStatus={isModalOpen}
        closeModal={handleCloseModal}
        userId={userId}
        parkingId={selectedParkingId}
        type="booking"
        parkingAvaliable={() => {
          const selectedParking = AllListings.find(
            (listing) => listing.parking_id === selectedParkingId
          );
          return selectedParking.available;
        }}
      />

      <MakeABookingModal
        userId={userId}
        parkingId={selectedParkingId}
        open={isBookingModalOpen}
        onClose={handleCloseBookingModal}
      />
    </>
  );
}

export default AllListings;
