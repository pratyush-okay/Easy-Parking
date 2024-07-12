import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Rating,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { List, ListItem, ListItemText } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Map from "../../../Maps/DisplayMap/map";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    height: "80%",
};

const reviewListStyle = {
    maxHeight: "260px",
    overflow: "auto",
    bgcolor: "background.paper",
    my: 2,
};

function ListingDetailProvider({ parkingId, open, onClose }) {
    const [details, setDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [tab, setTab] = React.useState("details");
    const [currentCoord, setCurrentCoord] = useState({ lat: null, lng: null });

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8000/parking/byid/",
                    {
                        parking_id: parkingId,
                    }
                );
                const data = JSON.parse(response.data);
                // setCurrentCoord({ lat: data[0].fields.latitude, lng: data[0].fields.longitude });
                // console.log("sdfsdf",currentCoord);
                setDetails(data[0].fields);
                if (data[0].fields.latitude && data[0].fields.longitude) {
                    setCurrentCoord({
                        lat: data[0].fields.latitude,
                        lng: data[0].fields.longitude,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch parking details", error);
            }
        };

        const fetchReviewsForParkings = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8000/reviews/parking/",
                    {
                        parking_id: parkingId,
                    }
                );
                const data = JSON.parse(response.data);
                console.log(data);
                setReviews(data);
            } catch (error) {
                console.error("Failed to fetch parking details", error);
            }
        };

        if (parkingId && open) {
            fetchDetails();
            fetchReviewsForParkings();
        }
    }, [parkingId, open]);

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                {/* modal tab (details/reviews) */}
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    textColor="#000000"
                    sx={{ borderBottom: "1px solid #e8e8e8" }}
                >
                    <Tab value="details" label="Parking Space Details" />
                    <Tab value="reviews" label="Reviews" />
                </Tabs>

                {/* close modal btn */}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {tab === "details" ? (
                    <>
                        {/* display listing info */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Title:</strong> {details?.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Location:</strong>{" "}
                                    {details?.location}
                                </Typography>
                                <Accordion
                                    sx={{
                                        bgcolor: "background.paper",
                                        boxShadow: "none",
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant="body2">
                                            More Details
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            <strong>Description:</strong>{" "}
                                            {details?.description}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            <strong>Spot Type:</strong>{" "}
                                            {details?.spot_type}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            <strong>Features:</strong>{" "}
                                            {details?.features}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            <strong>Price Daily:</strong>{" "}
                                            {details?.price_daily}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            <strong>Price Hourly:</strong>{" "}
                                            {details?.price_hourly}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            <strong>Price Monthly:</strong>{" "}
                                            {details?.price_monthly}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            <strong>Height:</strong>{" "}
                                            {details?.parking_space_height}m
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            <strong>Width:</strong>{" "}
                                            {details?.parking_space_width}m
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            <strong>Length:</strong>{" "}
                                            {details?.parking_space_length}m
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{ height: "600px" }}>
                                    <Map coor={currentCoord} />
                                </div>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        {reviews.length === 0 ? (
                            <Typography
                                variant="body2"
                                style={{ textAlign: "center" }}
                            >
                                No reviews yet
                            </Typography>
                        ) : (
                            <List
                                sx={reviewListStyle}
                                style={{ marginTop: "0px" }}
                            >
                                {reviews.map((review) => (
                                    <React.Fragment key={review.pk}>
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
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Typography
                                                            component="span"
                                                            variant="subtitle2"
                                                            style={{
                                                                fontWeight:
                                                                    "700",
                                                            }}
                                                        >
                                                            {review.fields
                                                                .user_email ===
                                                            "-1"
                                                                ? "Anonymous"
                                                                : review.fields
                                                                      .user_email}
                                                        </Typography>
                                                        <Rating
                                                            value={parseFloat(
                                                                review.fields
                                                                    .rating
                                                            )}
                                                            readOnly
                                                        />
                                                    </div>
                                                }
                                                secondary={
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {review.fields.review}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </>
                )}
            </Box>
        </Modal>
    );
}

export default ListingDetailProvider;
