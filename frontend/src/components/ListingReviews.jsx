import React from "react";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Rating,
  Grid,
} from "@mui/material";
import axios from "axios";

// The review list with a fixed maximum height and auto overflow to make it scrollable.
const reviewListStyle = {
  overflow: "auto",
  my: 2,
};

const ListingDetails = ({ parkingId }) => {
  const [reviews, setReviews] = React.useState(null); //TODO: enable this

  // TODO: enable this part
  const fetchReviews = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/reviews/parking/",
        {
          parking_id: parkingId,
        }
      );

      const data = JSON.parse(response.data);
      console.log("review goes here");
      console.log(data);

      const allReviewsOfParking = data.map((item) => ({
        parking_id: item.fields.parking_id,
        rating: item.fields.rating,
        comment: item.fields.review,
        reviewer: item.fields.user_email,
      }));

      setReviews(allReviewsOfParking);
      console.log(allReviewsOfParking);
    } catch (error) {
      console.error("Failed to fetch parking details", error);
    }
  };

  React.useEffect(() => {
    // Only fetch details if parkingId is provided and modal is open
    fetchReviews();
  });

  return (
    <>
      {/* Feedback section  */}
      {reviews && reviews.length > 0 ? (
        <List sx={reviewListStyle}>
          {reviews.map((review) => (
            <React.Fragment key={review.id}>
              <ListItem
                alignItems="flex-start"
                style={{
                  height: "4rem",
                  paddingTop: "0px",
                }}
              >
                <ListItemText
                  primary={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        component="span"
                        variant="subtitle2"
                        style={{ fontWeight: "700" }}
                      >
                        {review.reviewer}
                      </Typography>
                      <Rating value={review.rating} readOnly />
                    </div>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {review.comment}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Grid container spacing={1} sx={{ padding: 2 }}>
          <Grid item xs={12} md={12} sx={{ marginTop: 1 }}>
            No Review.
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ListingDetails;
