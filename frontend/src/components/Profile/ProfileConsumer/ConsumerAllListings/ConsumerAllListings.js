import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BookCancelDialog from '../../../Book/BookCancel/BookCancelDialog.jsx';
import CustomModal from "../../../CustomModal.jsx";
import CustomListingCard from "../../../CustomListingCard.jsx";
import Review from "./review.jsx";
import BookExtend from '../../../Book/Extend/BookExtend.jsx'
import ApiCallPost from '../../../../action/ApiCallPost.jsx';

function ConsumerAllListings({ userEmail, onReviewRate }) {
    const [userParkings, setuserParkings] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const user_email = localStorage.getItem('UserEmail')
    const tabs = {'details': 'Parking Space Details', 'reviews': 'Reviews'} // key: tab item, value: tab display

    useEffect(() => {
        fetchAllBookings();
        fetchAllLikes();
    });


    /***** GET ALL BOOKINGS (by email) *****/
    const fetchAllBookings = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/booking/user/',
                {
                    "user_email": user_email,
                },
            );
            const data = JSON.parse(response.data); // No need to parse JSON here
            console.log(data);
            const promises = data.map(async item => {
                const userParking = {
                    booking_id: item.pk,
                    parking_id: item.fields.parking_id,
                    start_date: item.fields.start_date,
                    end_date: item.fields.end_date,
                    location: "",
                    description: "",
                    active: item.fields.active,
                    title: "",
                    coord: { lat: 0, lng: 0 }

                };
                try {
                    const response = await axios.post('http://localhost:8000/parking/byid/',
                        {
                            parking_id: userParking.parking_id,
                        },
                    );

                    const parkingData = JSON.parse(response.data);
                    userParking.location = parkingData[0].fields.location;
                    userParking.description = parkingData[0].fields.description;
                    userParking.title = parkingData[0].fields.title;
                    userParking.coord.lat = parkingData[0].fields.latitude;
                    userParking.coord.lng = parkingData[0].fields.longitude;

                } catch (error) {
                    console.error('Error fetching parking data:', error);
                }
                return userParking;
            });
            const userParkings = await Promise.all(promises);
            console.log('userParking', userParkings);
            setuserParkings(userParkings);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    /***** get fav parking from backend (by email) *****/
    const fetchAllLikes = async () => {
        const params = {
            user_email: user_email,
        };
        let data = await ApiCallPost("parking/likes/user/all", params, "", false);
        if (data) {
            data = JSON.parse(data).map(item => (item.fields.parking_id));
            setUserLikes(data);
        }
    };

    React.useEffect(() => {
        console.log('fav', userLikes)
    }, [userLikes])

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [currentReviewId, setCurrentReviewId] = useState(null);
  
    const handleReview = async (parking_id) => {
      setIsReviewModalOpen(true);
      setCurrentReviewId(parking_id);
    };

    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
    const [currentExtendId, setCurrentExtendId] = useState(null);

    const handleExtend = async (booking_id) => {
      setIsExtendModalOpen(true);
      setCurrentExtendId(booking_id);
    };

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [currentCancelId, setCurrentCancelId] = useState(null);

    const handleCancel = async (booking_id) => {
        setIsCancelModalOpen(true);
        setCurrentCancelId(booking_id);
    };
  

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentDetailId, setCurrentDetailId] = useState(null);
    const handleDetail = (parking_id) => {
        setCurrentDetailId(parking_id);
        setIsDetailModalOpen(true);
    };

    return (
        <>
        <h1>My Bookings</h1>
        <div className='home'>
            <Typography sx={{ mb: 2, mt: 2 }} variant="h6" component="div">
                Current Bookings: {userParkings.filter((bk) => bk.active === true).length}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    {userParkings.filter((bk) => bk.active === true).map((userParking, index) => (
                        <CustomListingCard
                            type='consumer'
                            userEmail={user_email}
                            listing={userParking}
                            extendId={userParking.booking_id}
                            cancelId={userParking.booking_id}
                            index={index}
                            handleDetail={handleDetail}
                            handleCancel={handleCancel}
                            handleExtend={handleExtend}
                            favBool={userLikes.indexOf(userParking.parking_id) > -1}
                            fetchAllLikes={fetchAllLikes}
                        />
                    ))}

                </Grid>
            </Box>
            <Typography sx={{ mb: 2, mt: 2 }} variant="h6" component="div">
                Previous Bookings: {userParkings.filter((bk) => bk.active === false).length}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    {userParkings.filter((bk) => bk.active === false).map((userParking, index) => (
                        <CustomListingCard
                            type='consumer'
                            userEmail={user_email}
                            listing={userParking}
                            index={index}
                            handleDetail={handleDetail}
                            handleReview={handleReview}
                            favBool={userLikes.indexOf(userParking.parking_id) > -1}
                            fetchAllLikes={fetchAllLikes}
                        />
                    ))}
                </Grid>
            </Box>

            {isDetailModalOpen && (
                <CustomModal
                    tabs={tabs}
                    type='mapImg'
                    modalStatus={isDetailModalOpen}
                    closeModal={() => setIsDetailModalOpen(false)}
                    parkingId={currentDetailId}
                />
            )}
            {isCancelModalOpen && (
                // <ConfirmationDialog booking_id={currentCancelId} />
                <BookCancelDialog
                    bookingId={currentCancelId}
                    open={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    fetchData={fetchAllBookings}
                />
            )}
            {isReviewModalOpen && (
                <Review
                    parkingId={currentReviewId}
                    open={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    fetchData={fetchAllBookings}
                />
            )}
            {isExtendModalOpen && (
                <BookExtend
                    open={isExtendModalOpen}
                    handleClose={() => setIsExtendModalOpen(false)}
                    booking_id={currentExtendId}
                    listing={userParkings}
                />
            )}
        </div>
        </>
    );
}

export default ConsumerAllListings;
