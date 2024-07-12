import React, { useState, useEffect } from "react";
import AllListings from "./AllListings/AllListings.js";
import BookingSection from "../../Book/BookingSection.jsx";
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
import FilterModal from "../../Filter/FilterModal.jsx";
import SortByModal from "../../Filter/SortByModal.jsx";
import Favourites from "./AllFavourites.jsx";

function Dashboard(props) {
  const userEmail = props.userEmail;
  const userType = props.userType;

  const [sortBy, setSortBy] = useState("price");
  const [order, setOrder] = useState("ascending");

  const [price, setPrice] = useState([0, 100]); // Default range
  const [distance, setDistance] = useState([0, 100]);
  const [checked, setChecked] = useState({
    disability: false,
    access247: false,
    cctv: false,
    evCharging: false,
    combinationLock: false,
    carwash: false,
    securityGate: false,
  });
  const [parkingTypes, setParkingTypes] = React.useState({
    covered: true,
    uncovered: true,
    driveway: true,
    garage: true,
  });

  const [isFilterApply, setIsFilterApply] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortByModalOpen, setIsSortByModalOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());

  const [userId, setUserId] = useState(11);
  const [currentLocation, setCurrentLocation] = useState({
    lat: -33.9173, // Default location (UNSW), update based on actual use case
    lng: 151.2313,
  });
  const [currentAddr, setCurrentAddr] = useState("");
  const [selectedListingId, setLSelectedListingId] = React.useState(""); // current selected marker listing id
  const [allListings, setAllListings] = useState(true);
  const [listingBooking, setlistingBooking] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedParkingMap, setSelectedParkingMap] = useState(null);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  const [selectedSearch, setSelectedSearch] = useState(null);
  const [filterCarAuto, setFilterCarAuto] = React.useState(false);

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

  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    if (userEmail) {
      setUserId(userId);
    }
  },[userEmail]);

  useEffect(() => {
    recenter();
  });

  const handleViewAllListings = () => {
    setAllListings(true);
    setlistingBooking(false);
  };

  const handleViewListingBooking = () => {
    setAllListings(false);
    setlistingBooking(true);
  };

  const handleViewDetails = () => {
    setAllListings(false);
    setlistingBooking(false);
  };

  const handleSelectedParkingMap = (parking) => {
    setSelectedParkingMap(parking);
    setAllListings(true);
  };

  const handleSelectedFavourite = (parking) => {
    setSelectedFavorite(parking);
    setAllListings(true);
  };

  const handleFilterPopUp = () => {
    setIsFilterModalOpen(true);
  };
  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const onApplyFilters = ({
    price,
    distance,
    checked,
    parkingTypes,
    filterCarAuto,
  }) => {
    setPrice(price);
    setDistance(distance);
    setChecked(checked);
    setParkingTypes(parkingTypes);
    setFilterCarAuto(filterCarAuto);
  };

  const handleSortBy = () => {
    setIsSortByModalOpen(true);
  };
  const handleCloseSortByModal = () => {
    setIsSortByModalOpen(false);
  };

  const onApplySortBy = ({ sortBy, order }) => {
    setSortBy(sortBy);
    setOrder(order);
  };

  return (
    <div className="map-main">
      {/* LEFT PART (LISTINGS QUERY RESULT) */}
      <Box className="map-left">
        {allListings && (
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
                onClick={handleFilterPopUp}
              >
                <TuneIcon sx={{ pr: "0.3rem" }} />
                Filters
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "#0b4f8b" }}
                onClick={handleSortBy}
              >
                <SwapVertTwoToneIcon sx={{ pr: "0.3rem" }} />
                SortBy
              </Button>
            </Stack>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              sx={{ margin: "5px" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Favourites
                  handleSelectedFavourite={handleSelectedFavourite}
                  userEmail={userEmail}
                />
              </Stack>
            </Box>
            {/*********** show listings  ***********/}
            <Box sx={{ overflowX: "scroll", height: "84%" }}>
              <AllListings
                userId={userId}
                setSelectedParking={setSelectedParking}
                handleViewListingBooking={handleViewListingBooking}
                handleViewDetails={handleViewDetails}
                handleSelectedParkingMap={handleSelectedParkingMap}
                selectedListingId={selectedListingId}
                userEmail={userEmail}
                userType={userType}
                currentLocation={currentLocation}
                isFilterApply={isFilterApply}
                filter={{
                  price,
                  distance,
                  checked,
                  parkingTypes,
                  filterCarAuto,
                }} // all var in filterModal
                sortby={{ sortBy, order }}
                duration={{ startDateTime, endDateTime }}
              />
            </Box>
          </>
        )}
      </Box>

      {/* RIGHT PART (MAP) */}
      <div className="map-right">
        <Map
          selectedFavorite={selectedFavorite}
          selectedParkingMap={selectedParkingMap}
          currentLocation={currentLocation}
          recenter={recenter}
          setLSelectedListingId={setLSelectedListingId}
          selectedSearch={selectedSearch}
        />
      </div>

      {/* Booking modal */}
      {listingBooking && (
        <BookingSection
          userId={userId}
          selectedParking={selectedParking}
          handleViewAllListings={handleViewAllListings}
        />
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={onApplyFilters}
        setIsFilterApply={setIsFilterApply}
      />
      <SortByModal
        isOpen={isSortByModalOpen}
        onClose={handleCloseSortByModal}
        onApplySortBy={onApplySortBy}
      />
    </div>
  );
}

export default Dashboard;
