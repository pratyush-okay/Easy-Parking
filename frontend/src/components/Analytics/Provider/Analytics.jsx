import React from "react";
import { Container, Grid } from "@mui/material";
import UpperCard from "./UpperCard";
import EarningsChart from "./charts/EarningsChart";
import DoughnutChart from "./charts/DoughtnutChart";
import BarChart from "./charts/BarChart";
import axios from "axios";
import ListingsModal from "../ListingsModal";
import BookingsModal from "../BookingsModal.jsx";
import DeleteListing from "../../Dashboard/DashboardProvider/EditListingProvider/DeleteListingProvider.js";
import EditListing from "../../Dashboard/DashboardProvider/EditListingProvider/EditListingProvider.jsx";
import DeleteBooking from "../Admin/DeleteBooking.jsx";

function AnalyticsDashboard(props) {
  console.log("props: dlfsldfslfsldfgsljdfgsljhdfgsdf", props.userEmail);
  const user_email = props.userEmail;

  const [analyticsData, setAnalyticsData] = React.useState({});
  const [allBookings, setAllBookings] = React.useState([]);
  const [allParkings, setAllParkings] = React.useState([]);
  const [allUserParkings, setAllUserParkings] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [deleteParkingId, setDeleteParkingId] = React.useState(null);
  const [openDeleteModalBooking, setOpenDeleteModalBooking] =
    React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [EditParkingId, setEditParkingId] = React.useState(null);
  const [deleteBookingId, setDeleteBookingId] = React.useState(null);
  const [allUserBookings, setAllUserBookings] = React.useState([]);

  console.log(allBookings);
  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/analytics/host",
        {
          user_email: user_email,
        }
      );
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  });

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/booking/all");
      setAllBookings(JSON.parse(response.data));
      const matchedBookings = JSON.parse(response.data).filter((booking) => {
        const isMatched =
          Array.isArray(analyticsData.booking_ids) &&
          analyticsData.booking_ids.includes(booking.pk);
        return isMatched;
      });
      setAllUserBookings(JSON.stringify(matchedBookings));
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    }
  };

  const fetchDataParking = async () => {
    try {
      const response = await axios.get("http://localhost:8000/parking/all/");
      setAllParkings(JSON.parse(response.data));

      const parkingsArray = JSON.parse(response.data);
      const filteredParkings = parkingsArray.filter(
        (parking) => parking.fields.host_email === user_email
      );
      console.log("Filtered parkings: ", filteredParkings);

      setAllUserParkings(JSON.stringify(filteredParkings));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchAllBookings();
    fetchDataParking();
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = (parkingId) => {
    setDeleteParkingId(parkingId);
    setOpenDeleteModal(true); // Open the delete confirmation modal
  };

  const handleEdit = (parkingId) => {
    setEditParkingId(parkingId);
    setOpenEditModal(true); // Open the delete confirmation modal
  };

  function calculateAverageRating(ratings) {
    if (!Array.isArray(ratings) || ratings.length === 0) {
      return 0;
    }
    const filteredRatings = ratings.filter((entry) => entry.avg_rating !== 0);
    const sum = filteredRatings.reduce(
      (acc, entry) => acc + parseFloat(entry.avg_rating),
      0
    );
    const average = sum / filteredRatings.length;

    return average.toFixed(2);
  }

  const userRating = calculateAverageRating(
    analyticsData.parking_avg_rating_dict
  );

  const AOV = parseFloat(analyticsData.AOV).toFixed(2);

  const userParkings = allParkings.filter((parking) => {
    return parking.fields.host_email === user_email;
  });

  const userParkingsIdsAndTitles = userParkings.map((parking) => ({
    id: parking.pk,
    title: parking.fields.title,
  }));

  const handleCloseEditModal = async (refreshListings = false) => {
    setOpenEditModal(false);
    setEditParkingId(null);

    if (refreshListings) {
      fetchDataParking();
    }
  };

  // Function to close the delete confirmation modal and optionally refresh listings
  const handleCloseDeleteModal = async (refreshListings = false) => {
    setOpenDeleteModal(false);
    setDeleteParkingId(null);

    if (refreshListings) {
      fetchDataParking();
      await fetchData();
    }
  };
  const handleCloseDeleteModalBooking = async (refreshListings = false) => {
    setOpenDeleteModalBooking(false);
    setDeleteBookingId(null);

    if (refreshListings) {
      fetchAllBookings();
      await fetchData();
    }
  };

  const toggleBookingModal = () => {
    setIsBookingModalOpen(!isBookingModalOpen);
  };
  const handleDeleteBooking = (bookingId) => {
    setDeleteBookingId(bookingId);
    setOpenDeleteModalBooking(true); // Open the delete confirmation modal
  };

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid
            onClick={() => {
              toggleModal();
            }}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <UpperCard
              title={"Total Listings"}
              count={analyticsData.total_lisitngs}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} onClick={toggleBookingModal}>
            <UpperCard
              title={"Total Bookings"}
              count={analyticsData.total_bookings_count}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <UpperCard title={"Average Order Value in AUD"} count={AOV} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <UpperCard title={"Your rating"} count={userRating} />
          </Grid>

          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12} md={8}>
              <EarningsChart monthly_income={analyticsData.monthly_income} />
            </Grid>

            <Grid item xs={12} md={4} container spacing={2}>
              <Grid item xs={12}>
                <DoughnutChart
                  booking_percentage={analyticsData.booking_percentage}
                  userParkingsIdsAndTitles={userParkingsIdsAndTitles}
                />
              </Grid>
              <Grid item xs={12}>
                <BarChart
                  parking_review_dict={analyticsData.parking_review_dict}
                  parking_avg_rating_dict={
                    analyticsData.parking_avg_rating_dict
                  }
                  userParkingsIdsAndTitles={userParkingsIdsAndTitles}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {isModalOpen && (
        <ListingsModal
          modalStatus={isModalOpen}
          closeModal={toggleModal}
          parkingsData={allUserParkings}
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
          bookingsData={allUserBookings}
          onDelete={handleDeleteBooking}
        />
      )}
      {openDeleteModalBooking && (
        <DeleteBooking
          bookingId={deleteBookingId}
          open={openDeleteModalBooking}
          onClose={() => handleCloseDeleteModalBooking(false)}
          fetchData={() => {
            handleCloseDeleteModalBooking(true);
          }}
        />
      )}
    </>
  );
}

export default AnalyticsDashboard;
