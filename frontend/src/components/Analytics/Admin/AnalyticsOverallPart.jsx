import React from "react";
import { Grid } from "@mui/material";
import UpperCard from "./UpperCard";
import UpperCardMultipleColumn from "./UpperCardMultipleColumn.jsx";
import EarningsChart from "./charts/EarningsChart";
import axios from "axios";
import ListingsModal from "../ListingsModal";
import BookingsModal from "../BookingsModal.jsx";
import DeleteListing from "../../Dashboard/DashboardProvider/EditListingProvider/DeleteListingProvider.js";
import DeleteBooking from "./DeleteBooking.jsx";
import EditListing from "../../Dashboard/DashboardProvider/EditListingProvider/EditListingProvider.jsx";
function AnalyticsDashboard(props) {
  const [analyticsData, setAnalyticsData] = React.useState({});
  const [allBookings, setAllBookings] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [allParkings, setAllParkings] = React.useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [deleteParkingId, setDeleteParkingId] = React.useState(null);
  const [openDeleteModalBooking, setOpenDeleteModalBooking] =
    React.useState(false);
  const [deleteBookingId, setDeleteBookingId] = React.useState(null);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [EditParkingId, setEditParkingId] = React.useState(null);

  React.useEffect(() => {
    fetchAnalyticsData();
    fetchAllBookings();
  });

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/booking/all");
      const data = response.data;
      setAllBookings(data);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/analytics/admin");
      props.setAllHostCount(response.data.host_count);
      props.setAllGuestCount(response.data.guest_count);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/parking/all/");
        setAllParkings(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchBookingData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/booking/all/");
      setAllBookings(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchBookingData();
  }, []);

  const AOV = parseFloat(analyticsData.AOV).toFixed(2);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleBookingModal = () => {
    setIsBookingModalOpen(!isBookingModalOpen);
  };

  const handleDelete = (parkingId) => {
    setDeleteParkingId(parkingId);
    setOpenDeleteModal(true); // Open the delete confirmation modal
  };

  const handleDeleteBooking = (bookingId) => {
    setDeleteBookingId(bookingId);
    setOpenDeleteModalBooking(true); // Open the delete confirmation modal
  };

  const handleEdit = (parkingId) => {
    setEditParkingId(parkingId);
    setOpenEditModal(true); // Open the delete confirmation modal
  };

  const handleCloseEditModal = async (refreshListings = false) => {
    setOpenEditModal(false);
    setEditParkingId(null);

    if (refreshListings) {
      try {
        const response = await axios.get("http://localhost:8000/parking/all/");
        setAllParkings(response.data); // Refresh the parking listings
        await fetchAnalyticsData();
      } catch (error) {
        console.error("Error fetching updated parking data:", error);
      }
    }
  };

  // Function to close the delete confirmation modal and optionally refresh listings
  const handleCloseDeleteModal = async (refreshListings = false) => {
    setOpenDeleteModal(false);
    setDeleteParkingId(null);

    if (refreshListings) {
      try {
        const response = await axios.get("http://localhost:8000/booking/all/");
        setAllBookings(response.data); // Refresh the parking listings
        await fetchAnalyticsData();
      } catch (error) {
        console.error("Error fetching updated booking data:", error);
      }
    }
  };

  const handleCloseDeleteModalBooking = async (refreshListings = false) => {
    setOpenDeleteModalBooking(false);
    setDeleteBookingId(null);

    if (refreshListings) {
      try {
        const response = await axios.get("http://localhost:8000/parking/all/");
        setAllParkings(response.data); // Refresh the parking listings
        await fetchAnalyticsData();
      } catch (error) {
        console.error("Error fetching updated parking data:", error);
      }
    }
  };

  return (
    <>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ width: "100%" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3.5} onClick={toggleModal}>
          <UpperCardMultipleColumn
            title="Total Listings  |"
            title2="Active  |"
            title3="Inactive"
            count={analyticsData.listing_count}
            count2={analyticsData.pub_listing_count}
            count3={analyticsData.pvt_listing_count}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3.5} onClick={toggleBookingModal}>
          <UpperCard
            title="Total Bookings"
            count={analyticsData.booking_count}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3.5}>
          <UpperCard title="Average Order Value in AUD" count={AOV} />
        </Grid>

        <Grid item xs={8}>
          <EarningsChart monthly_income={analyticsData.monthly_income_dict} />
        </Grid>
      </Grid>

      {isModalOpen && (
        <ListingsModal
          modalStatus={isModalOpen}
          closeModal={toggleModal}
          parkingsData={allParkings}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {openDeleteModal && (
        <DeleteListing
          parkingId={deleteParkingId}
          open={openDeleteModal}
          onClose={() => handleCloseDeleteModal(false)}
          fetchData={() => {
            handleCloseDeleteModal(true);
          }}
        />
      )}

      {openEditModal && (
        <EditListing
          parkingId={EditParkingId}
          open={openEditModal}
          onClose={() => handleCloseEditModal(false)}
          fetchData={() => {
            handleCloseEditModal(true);
          }}
        />
      )}

      {isBookingModalOpen && (
        <BookingsModal
          modalStatus={isBookingModalOpen}
          closeModal={toggleBookingModal}
          bookingsData={allBookings}
          onDelete={handleDeleteBooking}
        />
      )}
      {openDeleteModalBooking && (
        <DeleteBooking
          bookingId={deleteBookingId}
          open={openDeleteModalBooking}
          onClose={() => handleCloseDeleteModalBooking(false)}
          fetchData={fetchBookingData}
          fetchAnalyticsData={fetchAnalyticsData}
        />
      )}
    </>
  );
}

export default AnalyticsDashboard;
