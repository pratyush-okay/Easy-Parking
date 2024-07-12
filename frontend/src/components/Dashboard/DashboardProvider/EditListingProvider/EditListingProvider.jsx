import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  IconButton,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import Map from "../../../Maps/EditMap/map";
import axios from "axios";
import CustomAlertDialog from "../../../CustomAlert/CustomAlertDialog";
// import ImagePreviewModal from "../../../__helperComponents/ImagePreviewModal";

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
  height: "90%",
};

const featureList = [
  "Disability Friendly",
  "24/7 Access",
  "CCTV",
  "Electric charging",
  "Combination Lock",
  "Security gate",
  "Car Wash",
];

function ParkingSpaceDetailModal({ parkingId, open, onClose, fetchData }) {
  const [details, setDetails] = useState(null);
  const [checkedFeatures, setCheckedFeatures] = useState({});
  const [currentCoord, setCurrentCoord] = useState({ lat: null, lng: null });
  const [selectedImage, setSelectedImage] = useState(null); // for previewing image
  const [imageFile, setImageFile] = useState(null); // for storing the image itself for uploading
  const [openImgPicker, setOpenImgPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  // const [openImgPreviewer, setOpenImgPreviewer] = useState(false);
  // const [ImgPreviewer_image, setImgPreviewer_image] = useState();
  console.log(openImgPicker);
  const handleOpenImgPicker = () => {
    setOpenImgPicker(true);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setSelectedImage(URL.createObjectURL(img));
      setImageFile(img); // Store the file itself to be uploaded
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/parking/byid/",
          { parking_id: parkingId }
        );
        const data = JSON.parse(response.data);
        setDetails(data[0].fields);
        // Initialize checkedFeatures based on the features from the response
        const featuresArray = data[0].fields.features.split(", ");
        const initialCheckedFeatures = featureList.reduce((acc, feature) => {
          acc[feature] = featuresArray.includes(feature); // Correctly initialize based on fetched data
          return acc;
        }, {});
        setCheckedFeatures(initialCheckedFeatures);
        setCurrentCoord({
          lat: data[0].fields.latitude,
          lng: data[0].fields.longitude,
        });
      } catch (error) {
        console.error("Failed to fetch parking details", error);
      }
    };

    const fetchImage = async () => {
      try {
        const formData_image = new FormData(); // Create a FormData instance
        formData_image.append("parking_id", parkingId);

        const response = await axios.post(
          "http://localhost:8000/image/parking/get",
          formData_image,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const imageUrl = response.data[0].image;
        setImageUrl(imageUrl);
        // console.log("image retrieved success");
        // console.log("---------image retrieved success  ----------------");
        // console.log(response.data[0].image);
      } catch (error) {
        console.error("Failed to fetch parking details", error);
      }
    };

    if (parkingId && open) {
      fetchDetails();
      fetchImage();
    }
  }, [parkingId, open]);

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFeatureChange = (feature) => {
    setCheckedFeatures((prevCheckedFeatures) => ({
      ...prevCheckedFeatures,
      [feature]: !prevCheckedFeatures[feature],
    }));
  };

  const handleEditDetails = async () => {
    const features = Object.keys(checkedFeatures).filter(
      (feature) => checkedFeatures[feature]
    );
    const updatedDetails = {
      ...details,
      features: features.join(", "),
      latitude: currentCoord.lat,
      longitude: currentCoord.lng,
    };
    try {
      const response = await axios.put(
        "http://localhost:8000/parking/update/",
        { parking_id: parkingId, ...updatedDetails }
      );

      // for uploading the image of the parking by its parking id (returned from create listing api)
      if (imageFile) {
        const formData_imageUpload = new FormData();
        formData_imageUpload.append("image", imageFile);
        formData_imageUpload.append("parking_id", parkingId);
        try {
          const response = await axios.post(
            "http://localhost:8000/image/parking/upload",
            formData_imageUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Upload successful");
          console.log(response);
          setSelectedImage(null); // Reset the preview image
        } catch (error) {
          CustomAlertDialog("Upload image failed");
          return; // Stop the form submission if there's an issue with the prices
        }
      }

      if (response.status === 200) {
        console.log("Parking details updated successfully:");
        fetchData();
      } else {
        console.error(
          "Failed to update parking details with status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Failed to update parking details", error);
    }
    handleClose();
  };

  const BASE_URL_backend = "http://localhost:8000";

  // const handleCloseImgPreviewer = () => {
  //   setOpenImgPreviewer(false);
  // };

  // useEffect(() => {
  //   if (selectedImage) {
  //     setImgPreviewer_image(selectedImage);
  //   } else {
  //     setImgPreviewer_image(`${BASE_URL_backend}${imageUrl}`);
  //   }
  //   console.log("ImgPreviewer_image:", ImgPreviewer_image);
  // }, [selectedImage, imageUrl]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
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

        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight={"600"}
        >
          Edit Parking Space
        </Typography>

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2} sx={{ height: "83%", overflowX: "scroll" }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              variant="outlined"
              value={details?.title || ""}
              onChange={handleInputChange}
              sx={{ mb: 1 }} // Add margin bottom
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              variant="outlined"
              value={details?.location || ""}
              onChange={handleInputChange}
              sx={{ mb: 1 }} // Add margin bottom
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              variant="outlined"
              value={details?.description || ""}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 1 }} // Add margin bottom
            />

            {/* <TextField
              fullWidth
              label="Spot Type"
              name="spot_type"
              variant="outlined"
              value={details?.spot_type || ""}
              onChange={handleInputChange}
              multiline
              rows={1}
              sx={{ mb: 1 }}
            /> */}
            <FormControl
              fullWidth
              margin="normal"
              sx={{ mb: 1 }}
              style={{ marginTop: "0" }}
            >
              <InputLabel id="spot-type-label">Spot Type</InputLabel>
              <Select
                labelId="spot-type-label"
                id="spot-type-select"
                name="spot_type" // Ensure the name matches the field expected by the event handler
                value={details?.spot_type || ""}
                onChange={handleInputChange}
                label="Spot Type"
              >
                <MenuItem value="covered">Covered</MenuItem>
                <MenuItem value="uncovered">Uncovered</MenuItem>
                <MenuItem value="garage">Garage</MenuItem>
                <MenuItem value="driveway">Driveway</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Map coor={currentCoord} setCurrentCoord={setCurrentCoord} />
          </Grid>

          <Grid item xs={6}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <Typography variant="h6">Features</Typography>
              <FormGroup row>
                {featureList.map((feature) => (
                  <FormControlLabel
                    key={feature}
                    control={
                      <Checkbox
                        checked={!!checkedFeatures[feature]}
                        onChange={() => handleFeatureChange(feature)}
                        name={feature}
                      />
                    }
                    label={feature}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Box
              textAlign="center"
              my={2}
              style={{ paddingTop: 0, marginTop: "4px" }}
            >
              <div
                style={{
                  cursor: selectedImage ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100px",
                  border: "1px dashed grey",
                }}
                onClick={selectedImage ? handleOpenImgPicker : undefined}
              >
                {!imageUrl ? (
                  // display empty or the selected image
                  selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Uploaded"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "140px",
                      }}
                    />
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography>Upload your image here</Typography>
                      <PhotoCamera style={{ marginLeft: "10px" }} />
                    </Box>
                  )
                ) : // display the selected image or the original image
                selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "140px",
                    }}
                  />
                ) : (
                  <img
                    src={`${BASE_URL_backend}${imageUrl}`}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "140px",
                    }}
                  />
                )}

                {/* {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                    }}
                  />
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography>Upload your image here</Typography>
                    <PhotoCamera style={{ marginLeft: "10px" }} />
                  </Box>
                )} */}
              </div>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                style={{
                  margin: "8px 0",
                  backgroundColor: "rgb(23, 62, 104)",
                }}
              >
                Upload Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price Daily"
              name="price_daily"
              variant="outlined"
              value={details?.price_daily || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price Hourly"
              name="price_hourly"
              variant="outlined"
              value={details?.price_hourly || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price Monthly"
              name="price_monthly"
              variant="outlined"
              value={details?.price_monthly || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Height (m)"
              name="parking_space_height"
              variant="outlined"
              value={details?.parking_space_height || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Width (m)"
              name="parking_space_width"
              variant="outlined"
              value={details?.parking_space_width || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Length (m)"
              name="parking_space_length"
              variant="outlined"
              value={details?.parking_space_length || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" onClick={handleEditDetails}>
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Using the ImagePreviewModal */}
      {/* {openImgPreviewer && ImgPreviewer_image && (
        <ImagePreviewModal
          open={openImgPreviewer}
          imageSrc={ImgPreviewer_image}
          handleClose={handleCloseImgPreviewer}
        />
      )} */}
    </Modal>
  );
}

export default ParkingSpaceDetailModal;
