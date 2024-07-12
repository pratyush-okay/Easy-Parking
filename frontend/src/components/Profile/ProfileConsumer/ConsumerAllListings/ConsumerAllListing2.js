import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import EditListingProvider from "../EditListingProvider/EditListingProvider.jsx";
import DeleteListing from "../EditListingProvider/DeleteListingProvider.js";
import ListingDetailProvider from "../ListingDetailProvider/ListingDetailProvider.jsx";
import PublishUnpublishLising from "../EditListingProvider/PublishUnpublishListing.js";
import CustomListingCard from "../../../CustomListingCard.jsx";

// import "./ConsumerAllListings.css";

function AllListingsProvider({
  userId,
  setSelectedParking,
  handleViewListingBooking,
  handleViewDetails,
}) {
  const [AllListings, setAllListings] = useState([]);
  const user_email = localStorage.getItem("UserEmail");

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/parking/all/");
      const data = JSON.parse(response.data);

      const allListings = data
        .filter((item) => item.fields.host_email === user_email)
        .map((item) => ({
          parking_id: item.pk,
          start_date: item.fields.start_date,
          end_date: item.fields.end_date,
          location: item.fields.location,
          description: item.fields.description,
          price_daily: item.fields.price_daily,
          price_hourly: item.fields.price_hourly,
          price_monthly: item.fields.price_monthly,
          host_email: item.fields.host_email,
          publish: item.fields.publish,
          title: item.fields.title,
          coord:{lat: item.fields.latitude, lng: item.fields.longitude}
        }));
      setAllListings(allListings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const publicListings = AllListings.filter(
    (listing) => listing.publish === true
  );
  const privateListings = AllListings.filter(
    (listing) => listing.publish === false
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState(null);
  const handleEdit = (parking_id) => {
    setCurrentEditingId(parking_id);
    setIsEditModalOpen(true);
  };

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentDetailId, setCurrentDetailId] = useState(null);
  const handleDetail = (parking_id) => {
    setCurrentDetailId(parking_id);
    setIsDetailModalOpen(true);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);

  const handleDelete = async (parking_id) => {
    setIsDeleteModalOpen(true);
    setCurrentDeleteId(parking_id);
  };

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [currentPublishId, setCurrentPublishId] = useState(null);
  const [publish, setPublish] = useState(false);

  const handlePublish = async (parking_id, publish) => {
    setIsPublishModalOpen(true);
    setCurrentPublishId(parking_id);
    setPublish(publish);
  };

  return (
    <div className="home">
      <Typography sx={{ mb: 2 }} variant="h6" component="div">
        Public Listings
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {publicListings.map((listing, index) => (
            <CustomListingCard
              listing={listing}
              index={index}
              handleDetail={handleDetail}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handlePublish={handlePublish}
            />
          ))}
        </Grid>
      </Box>
      <br />
      <Typography sx={{ mb: 2 }} variant="h6" component="div">
        Private Listings
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {privateListings.map((listing, index) => (
            <CustomListingCard
              listing={listing}
              index={index}
              handleDetail={handleDetail}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handlePublish={handlePublish}
            />
          ))}
        </Grid>
      </Box>
      Map on the right
      {isEditModalOpen && (
        <EditListingProvider
          userId={userId}
          parkingId={currentEditingId}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          fetchData={fetchData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteListing
          parkingId={currentDeleteId}
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          fetchData={fetchData}
        />
      )}
      {isDetailModalOpen && (
        <ListingDetailProvider
          parkingId={currentDetailId}
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
      {isPublishModalOpen && (
        <PublishUnpublishLising
          parkingId={currentPublishId}
          open={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          publish={publish}
          fetchData={fetchData}
        />
      )}
    </div>
  );
}

export default AllListingsProvider;
