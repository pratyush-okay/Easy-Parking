import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import IconButton from "@mui/material/IconButton";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Map from "./Maps/DisplayMap/small_map";
import MyButton from "./MyButton.jsx";
import ApiCallPost from "../action/ApiCallPost.jsx";

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  borderRadius: 5,
  margin: 10,
  height: 350,
  width: 300,
  cursor: "pointer",
  transition: `${theme.transitions.create(["background", "background-color"], {
    duration: theme.transitions.duration.complex,
  })}, transform 0.3s ease-in-out`, // Combine multiple transitions
  "&:hover": {
    backgroundColor: "rgb(237, 237, 237)",
    transform: "scale3d(1.03, 1.03, 1)",
  },
}));

const favoriteButtonStyle = {
  position: "relative",
  top: "-140px",
  float: "right",
};

const CustomListingCard = (props) => {
  const userEmail = props.userEmail;
  const listing = props.listing;
  const favBool = props.favBool;
  const fetchAllLikes = props.fetchAllLikes;
  const type = props.type;

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

  return (
    <>
      <Item variant="outlined">
        <CardMedia component={Map} alt="map preview" coor={listing.coord} />

        {/* Your other card content */}
        {type === "consumer" ? (
          <IconButton style={favoriteButtonStyle}>
            {favBool ? (
              <FavoriteOutlinedIcon
                sx={{ fontSize: 30, color: "#ee204d" }}
                onClick={() => disliked(listing.parking_id)}
              />
            ) : (
              <FavoriteTwoToneIcon
                sx={{ fontSize: 30 }}
                onClick={() => liked(listing.parking_id)}
              />
            )}
          </IconButton>
        ) : null}

        <CardContent
          onClick={() => props.handleDetail(listing.parking_id)}
          sx={{ display: "flow-root", height: "45%" }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              height: "20%",
              overflowY: "scroll",
              whiteSpace: "nowrap",
            }}
            component="div"
          >
            {listing.title}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: "bold",
              mb: 1,
              height: "15%",
              overflowY: "scroll",
              whiteSpace: "nowrap",
            }}
            component="div"
          >
            {listing.location}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              height: "60%",
              overflowX: "scroll",
            }}
            color="text.secondary"
            gutterBottom
          >
            {props.type === "provider" ? (
              listing.description
            ) : (
              <>
                <p>Booking duration:</p>
                {listing.start_date} to {listing.end_date}
              </>
            )}
          </Typography>
        </CardContent>

        <CardActions>
          {props.handleBook ? (
            <MyButton
              size="sm"
              onClick={() => props.handleBook(listing.parking_id)}
            >
              Book
            </MyButton>
          ) : null}

          {props.handleEdit ? (
            <>
              <MyButton
                size="sm"
                round
                title="edit"
                onClick={() => props.handleEdit(listing.parking_id)}
              >
                <EditIcon />
              </MyButton>
            </>
          ) : null}

          {props.handleReview ? (
            <MyButton
              size="sm"
              round
              title="review"
              onClick={() => props.handleReview(listing.parking_id)}
            >
              <RateReviewOutlinedIcon />
            </MyButton>
          ) : null}

          {listing.publish ? (
            props.type === "provider" ? (
              <MyButton
                size="sm"
                round
                title="unpublish"
                onClick={() => props.handlePublish(listing.parking_id, false)}
              >
                <PublishIcon sx={{ transform: "rotate(180deg)" }} />
              </MyButton>
            ) : null
          ) : props.type === "provider" ? (
            <MyButton
              size="sm"
              round
              title="publish"
              onClick={() => props.handlePublish(listing.parking_id, true)}
            >
              <PublishIcon />
            </MyButton>
          ) : null}

          {props.handleExtend ? (
            <MyButton
              size="sm"
              color="blue"
              round
              title="extend"
              onClick={() => props.handleExtend(props.extendId)}
            >
              <MoreTimeIcon />
            </MyButton>
          ) : null}

          {props.handleAnalytics ? (
            <>
              <MyButton
                size="sm"
                round
                title="Analytics"
                onClick={() => props.handleAnalytics(listing.parking_id)}
              >
                <AnalyticsIcon />
              </MyButton>
            </>
          ) : null}

          {props.handleDelete ? (
            <MyButton
              size="sm"
              round
              title="delete"
              color="red"
              onClick={() => props.handleDelete(listing.parking_id)}
            >
              <DeleteIcon />
            </MyButton>
          ) : null}
          {props.handleCancel ? (
            <MyButton
              size="sm"
              round
              title="delete"
              color="red"
              onClick={() => props.handleCancel(props.cancelId)}
            >
              <DeleteIcon />
            </MyButton>
          ) : null}
        </CardActions>
      </Item>
    </>
  );
};

export default CustomListingCard;
