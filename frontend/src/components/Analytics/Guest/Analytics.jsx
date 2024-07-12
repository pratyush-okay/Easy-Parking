import React from "react";
import { Container, Grid } from "@mui/material";
import UpperCard from "./UpperCard";
import BarChart from "./charts/BarChart";
import axios from "axios";
import BookingsModal from "../BookingsModal";
import DeleteBooking from "../Admin/DeleteBooking.jsx";

function AnalyticsDashboard(props) {
    const user_email = props.userEmail;
    const [openDeleteModalBooking, setOpenDeleteModalBooking] =
    React.useState(false);
    const [deleteBookingId, setDeleteBookingId] = React.useState(null);
    const [analyticsData, setAnalyticsData] = React.useState({});
    const [allBookings, setAllBookings] = React.useState([]);
    const [alUserBookings, setAllUserBookings] = React.useState([]);
    const [allParkings, setAllParkings] = React.useState([]);
    const [bookingPercentages, setBookingPercentages] = React.useState([]);
    const [allBookingstoId, setAllBookingstoId] = React.useState([]);
    const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
    console.log(allBookings);
    setAllParkings([]);
    const handleCloseDeleteModalBooking = async () => {
        setOpenDeleteModalBooking(false);
        setDeleteBookingId(null);
      };
    
      const handleDeleteBooking = (bookingId) => {
        setDeleteBookingId(bookingId);
        setOpenDeleteModalBooking(true); // Open the delete confirmation modal
      };

    console.log("user_email: ", user_email);

    const fetchData = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/analytics/guest",
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

    const fetchBookingData = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/booking/user/",
                {
                    user_email: user_email,
                }
            );
            setAllUserBookings(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    React.useEffect(() => {
        fetchBookingData();
    });


    React.useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                const response = await axios.get("http://localhost:8000/parking/all");
                console.log("All parkings: ", response.data);
                setAllBookings(JSON.parse(response.data));
            } catch (error) {
                console.error("Error fetching all bookings:", error);
            }
        };

        fetchAllBookings();
    }, []);

    const avgRating = parseFloat(analyticsData.avg_rating).toFixed(2);
    const AOV = parseFloat(analyticsData.AOV).toFixed(2);
    const booking_percentage = parseFloat(
        analyticsData.booking_percentage
    ).toFixed(2);



    React.useEffect(() => {

        if(analyticsData.booked_parking_ids){
            const parkingIds = Object.values(analyticsData.booked_parking_ids);
        
            const idToTitleMap = {};
            
            parkingIds.forEach(id => {
            const parking = allParkings.find(p => p.pk === id);
            if (parking) {
                idToTitleMap[id] = parking.fields.title;
            }
            });
            
            setAllBookingstoId(idToTitleMap);
            console.log(idToTitleMap);
        }
    }, [analyticsData, setAllBookingstoId]);


    console.log("analyticsData: ", typeof analyticsData.most_booked_parkings);
    React.useEffect(() => {

        if (analyticsData.most_booked_parkings) {
            const totalBookings = Object.values(
                analyticsData.most_booked_parkings
            ).reduce((acc, [, count]) => acc + count, 0);
    
            const bookingPercentages = Object.values(
                analyticsData.most_booked_parkings
            ).map(([bookingId, count]) => {
                const percentage = (count / totalBookings) * 100;
                return { bookingId, count, percentage };
            });
            console.log("bookingPercentages: ", bookingPercentages);
            setBookingPercentages(bookingPercentages);
        }
    }, [analyticsData, setBookingPercentages]);

    const toggleBookingModal = () => {
        // console.log("toggleBookingModal");
        setIsBookingModalOpen(!isBookingModalOpen);
    }



    return (
        <>
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4} lg={3} onClick={toggleBookingModal} >
                    <UpperCard
                        title={"Total Bookings"}
                        count={analyticsData.booking_count}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <UpperCard
                        title={"Booking Percentage"}
                        count={booking_percentage}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <UpperCard
                        title={"Average Order Value in AUD"}
                        count={AOV}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <UpperCard title={"User Satisfaction"} count={avgRating} />
                </Grid>

                <Grid container item xs={12} spacing={3}>
                    <BarChart bookingPercentages={bookingPercentages} allBookings={allBookingstoId} />
                </Grid>
            </Grid>
        </Container>

{isBookingModalOpen && (
    <BookingsModal
        modalStatus={isBookingModalOpen}
        closeModal={toggleBookingModal}
        bookingsData={alUserBookings}
        admin = {false}
        onDelete={handleDeleteBooking}
    />
)}


      {openDeleteModalBooking && (
        <DeleteBooking
          bookingId={deleteBookingId}
          open={openDeleteModalBooking}
          onClose={() => handleCloseDeleteModalBooking(false)}
          fetchData={fetchBookingData}
          fetchAnalyticsData={fetchData}
        />
      )}

</>
    );
}

export default AnalyticsDashboard;
