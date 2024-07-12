/* eslint-disable */
import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Switch,
  OutlinedInput,
  InputAdornment,
  Box,
  IconButton,
  FormHelperText,
  FormControl,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import MyButton from "../MyButton.jsx";

import "./CreateASpaceCss.css";
import ImagePreviewModal from "../__helperComponents/ImagePreviewModal";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Map from "../Maps/EditMap/map.jsx";
import TransCoorAddr from "../TransCoorAddr.jsx";
import AlertContext from "../CustomAlert/AlertContext.js";

function CreateASpace() {
  const { customAlert } = React.useContext(AlertContext);

  const [selectedImage, setSelectedImage] = useState(null); // for previewing image
  const [imageFile, setImageFile] = useState(null); // for storing the image itself for uploading
  const [open, setOpen] = useState(false);

  const [currentLocation, setCurrentLocation] = useState({
    // `Location` for centering the marker in the map view
    lat: null,
    lng: null,
  });
  const [currentAddr, setCurrentAddr] = useState("");
  const [currentCoord, setCurrentCoord] = useState({ lat: null, lng: null }); // `Coordinates` for marking lat, lng of the parking space address

  const navigate = useNavigate();

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setSelectedImage(URL.createObjectURL(img));
      setImageFile(img); // Store the file itself to be uploaded
    }
  };

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

  const setAdd = async (add) => {
    const coor = await TransCoorAddr(add, "address_to_coor");
    setCurrentCoord(coor);
    console.log(coor);
  };

  useEffect(() => {
    recenter();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [priceChecked, setPriceChecked] = useState({
    hourly: false,
    daily: false,
    monthly: false,
  });

  const [prices, setPrices] = useState({
    hourly: null,
    daily: null,
    monthly: null,
  });

  const handlePriceCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPriceChecked((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePriceInputChange = (event) => {
    const { name, value } = event.target;
    setPrices((prev) => ({ ...prev, [name]: value }));
  };

  const [featureChecks, setFeatureChecks] = useState({
    "Disability Friendly": false,
    "24/7 Access": false,
    CCTV: false,
    "Electric charging": false,
    "Combination Lock": false,
    "Security gate": false,
    "Car Wash": false,
  });

  const handleFeatureChange = (event) => {
    const { name, checked } = event.target;
    setFeatureChecks((prev) => ({ ...prev, [name]: checked }));
  };

  const host_email = localStorage.getItem("UserEmail");
  const [formData, setFormData] = useState({
    host_email: host_email,
    location: "",
    title: "",
    description: "",
    spot_type: "",
    status: "",
    features: "",
    hourly: false,
    daily: false,
    monthly: false,
    price_hourly: 0.0,
    price_daily: 0.0,
    price_monthly: 0.0,
    parking_space_height: null,
    parking_space_width: null,
    parking_space_length: null,
    latitude: currentCoord.lat,
    longitude: currentCoord.lng,
  });

  const [formErrors, setFormErrors] = useState({});

  const validateField = (name, value) => {
    let errors = { ...formErrors };
    switch (name) {
      case "title":
        errors.title = value.trim() ? "" : "Please enter a Title";
        break;
      case "location":
        errors.location = value.trim() ? "" : "Please enter an Address";
        break;
      case "width":
        const numericValue = parseFloat(value.trim());
        if (isNaN(numericValue)) {
          errors.width = "Enter a number";
        } else {
          errors.width = numericValue !== 0 ? "" : "not allowed";
        }
        break;
      case "length":
        const numericValue2 = parseFloat(value.trim());
        if (isNaN(numericValue2)) {
          errors.length = "Enter a number";
        } else {
          errors.length = numericValue2 !== 0 ? "" : "not allowed";
        }
        break;
      case "height":
        const numericValue3 = parseFloat(value.trim());
        if (isNaN(numericValue3)) {
          errors.height = "Enter a number";
        } else {
          errors.height = numericValue3 !== 0 ? "" : "not allowed";
        }
        break;
      case "spot_type":
        errors.spot_type = value.trim() ? "" : "Please enter a spot type";
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const [publish_state, setPublish_state] = useState(false);

  const handleSubmit_checkPricing = () => {
    const priceOptions = ["hourly", "daily", "monthly"];
    let isAnyPriceValid = false; // Flag to indicate if at least one valid price is entered
    let invalidPriceMessage = ""; // Store a message for the first invalid price found
    for (const option of priceOptions) {
      if (priceChecked[option]) {
        const priceValue = parseFloat(prices[option]);
        if (isNaN(priceValue) || priceValue <= 0) {
          invalidPriceMessage = `Please enter a valid, positive price for the ${option} price option.`;
          break; // Exit the loop on finding the first invalid price
        }
        isAnyPriceValid = true; // A valid price was found, set flag to true
      }
    }
    if (!isAnyPriceValid) {
      return (
        invalidPriceMessage ||
        "Please select and fill in at least one pricing option (hourly, daily, or monthly) with a valid, positive price."
      );
    }
    return ""; // No errors found
  };

  const validateAllFields_beforeSubmit = () => {
    let errors = {};
    if (!formData.title.trim()) errors.title = "Please enter a Title";
    if (!formData.location.trim()) errors.location = "Please enter an Address";
    if (!formData.spot_type.trim())
      errors.spot_type = "Please enter a spot type";

    const width = parseFloat(formData.parking_space_width);
    if (isNaN(width) || width <= 0)
      errors.width = "Please enter a valid, positive number for width.";
    const length = parseFloat(formData.parking_space_length);
    if (isNaN(length) || length <= 0)
      errors.length = "Please enter a valid, positive number for length.";
    const height = parseFloat(formData.parking_space_height);
    if (isNaN(height) || height <= 0)
      errors.height = "Please enter a valid, positive number for height.";

    // const priceErrorMessage = handleSubmit_checkPricing();
    // if (priceErrorMessage) errors.pricing = priceErrorMessage;
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform comprehensive validation
    const newErrors = validateAllFields_beforeSubmit();
    setFormErrors(newErrors);

    // Check if there are any validation errors
    if (Object.keys(newErrors).length > 0) {
      customAlert("Please check your input data before submitting.");
      return;
    }

    // Validate that at least one pricing option is selected
    const priceErrorMessage = handleSubmit_checkPricing();
    if (priceErrorMessage) {
      customAlert(priceErrorMessage);
      return; // Stop the form submission if there's an issue with the prices
    }

    const parsedWidth = parseFloat(formData.parking_space_width);
    const parsedHeight = parseFloat(formData.parking_space_height);
    const parsedLength = parseFloat(formData.parking_space_length);
    formData.parking_space_height = parsedHeight;
    formData.parking_space_width = parsedWidth;
    formData.parking_space_length = parsedLength;

    // Construct the features string based on checked items
    const featuresString = Object.entries(featureChecks)
      .filter(([key, value]) => value)
      .map(([key]) => key)
      .join(", ");

    const submissionData = {
      ...formData,
      features: featuresString,
      latitude: currentCoord.lat,
      longitude: currentCoord.lng,
    };

    // Update formData with price information based on what's been checked
    Object.keys(priceChecked).forEach((key) => {
      submissionData[key] = priceChecked[key]; // Set the boolean value (hourly, daily, monthly)

      if (priceChecked[key]) {
        const priceKey = `price_${key}`;
        submissionData[priceKey] = parseFloat(prices[key] || 0);
      }
    });

    console.log(formData);

    console.log("subbb", submissionData);

    try {
      const response = await axios.post(
        "http://localhost:8000/parking/create/",
        submissionData
      );
      console.log(response.data);
      const this_parking_id = response.data.parkingId_pk; // get parking id from the previous response.data
      console.log("the new parking has parking id:", this_parking_id);

      // set publish state using parking id(returned from create space api)
      if (publish_state) {
        try {
          // publish this space based on this parking id
          const response_publish = await axios.put(
            "http://localhost:8000/parking/publish/",
            { parking_id: this_parking_id }
          );
          console.log(response_publish.data);
        } catch (error) {
          console.error("Error during submission (publishing):", error);
          customAlert("Submission failed! Please try again.");
          return; // Stop the form submission if there's an issue with the prices
        }
      }

      // for uploading the image of the parking by its parking id (returned from create listing api)
      if (imageFile) {
        const formData_imageUpload = new FormData();
        formData_imageUpload.append("image", imageFile);
        formData_imageUpload.append("parking_id", this_parking_id);
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
          setSelectedImage(null); // Reset the preview image
        } catch (error) {
          customAlert("Upload failed");
          return; // Stop the form submission if there's an issue with the prices
        }
      }

      customAlert("Your parking space is created successfully!");
      // inform guest there is a new parking released
      sendRecommendationEmail();
      navigate("/");
    } catch (error) {
      console.error("Error during submission:", error);
      customAlert("Submission failed!");
      return; // Stop the form submission if there's an issue with the prices
    }
  };

  const getAllBookings = async()=>{
    try{
      const response = await axios.get("http://127.0.0.1:8000/booking/all/",
      {}
      );
      const data = JSON.parse(response.data);
      const bookingdata = {};
      data.map((item) => {
        bookingdata[item.pk] = item.fields.user_email;
      });
      return bookingdata;
    } catch(error){
      console.error("Error getting booking data:", error);
    }
  };

  const getAllParkings = async()=>{
    try{
      const response = await axios.post("http://localhost:8000/parking/byhost/",
      {host_email: host_email}
      );
      const data = JSON.parse(response.data);
      let parkingids = [];
      data.map((item) => (parkingids.push(item.pk)));
      return parkingids;
    } catch(error){
      console.error("Error getting listing data:", error);
    }
  };

  const getInformedEmailList = async () => {
    const allBookings = await getAllBookings();
    const allParkings = await getAllParkings();
    let emailInformed = []
    allParkings.map((pid) => {
      if (allBookings[pid] != undefined)
      emailInformed.push(allBookings[pid])
    });
    emailInformed = Array.from(new Set(emailInformed));
    return emailInformed
  }

  const sendEmail = (email, msg) => {
    try {
      axios.post("http://127.0.0.1:8000/email/notification/", {
        message: msg,
        email: email,
      }); 
    } catch (error) {
      console.error("Error sending email to delted user:", error);
    };
  }

  const sendRecommendationEmail = async () => {
    const emails = await getInformedEmailList();
    const msg = `
    Hi User,
    
    Exciting news! Your preferred parking provider, ${host_email},
    has just released new parking spots.
    Don't miss out—book now for hassle-free parking.
    
    Best regards,
    AnyParking`;

    emails.map((email) => {
      sendEmail(email, msg)
    });
  }

  return (
    <Container>
      <Grid
        container
        spacing={2}
        style={{
          display: "flex",
          alignItems: "stretch",
          marginTop: "0px",
          // padding: "20px",
        }}
      >
        {/* Left Column with Paper Component */}
        <Grid item xs={8} style={{ display: "flex" }}>
          <Paper
            elevation={3}
            style={{
              width: "100%",
              padding: "20px",
              borderRight: "2px solid rgba(0, 0, 0, 0.12)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              className="labels"
              style={{ paddingTop: 0 }}
            >
              Title *
            </Typography>
            <TextField
              className="inputFields"
              placeholder="e.g. Spacious park space at Martin Place"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  title: e.target.value,
                });
              }}
              onBlur={(e) => validateField("title", e.target.value)}
              error={!!formErrors.title}
              helperText={formErrors.title}
            />

            <Typography variant="h6" className="labels">
              Address *
            </Typography>
            <TextField
              className="inputFields"
              placeholder="e.g. 1 Martin Pl, Sydney NSW 2000"
              fullWidth
              margin="normal"
              value={formData.location}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  location: e.target.value,
                });
              }}
              onBlur={(e) => validateField("location", e.target.value)}
              error={!!formErrors.location}
              helperText={formErrors.location}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="search"
                      onClick={() => {
                        setAdd(formData.location);
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography variant="h6" className="labels">
              Size of space *
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth error={!!formErrors.width}>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    endAdornment={
                      <InputAdornment position="end">meter</InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "Width",
                      type: "number",
                      min: 0, //set minimum value to 0
                      onWheel: (event) => event.target.blur(), // Blur input on wheel to prevent changes
                    }}
                    placeholder="Width"
                    fullWidth
                    value={formData.parking_space_width}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parking_space_width: e.target.value,
                        // parking_space_width: parseFloat(e.target.value || 0),
                      })
                    }
                    onBlur={(e) => validateField("width", e.target.value)}
                  />
                  <FormHelperText id="outlined-width-helper-text">
                    {formErrors.width}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth error={!!formErrors.length}>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    endAdornment={
                      <InputAdornment position="end">meter</InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "Length",
                      type: "number",
                      min: 0, //set minimum value to 0
                      onWheel: (event) => event.target.blur(), // Blur input on wheel to prevent changes
                    }}
                    placeholder="Length"
                    fullWidth
                    value={formData.parking_space_length}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parking_space_length: e.target.value,
                        // parking_space_length: parseFloat(e.target.value || 0),
                      })
                    }
                    onBlur={(e) => validateField("length", e.target.value)}
                  />
                  <FormHelperText id="outlined-width-helper-text">
                    {formErrors.length}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth error={!!formErrors.height}>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    endAdornment={
                      <InputAdornment position="end">meter</InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "Height",
                      type: "number",
                      min: 0, //set minimum value to 0
                      onWheel: (event) => event.target.blur(), // Blur input on wheel to prevent changes
                    }}
                    placeholder="Height"
                    fullWidth
                    value={formData.parking_space_height}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parking_space_height: e.target.value,
                        // parking_space_height: parseFloat(e.target.value || 0),
                      })
                    }
                    onBlur={(e) => validateField("height", e.target.value)}
                  />
                  <FormHelperText id="outlined-width-helper-text">
                    {formErrors.height}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="h6" className="labels">
              Spot Type *
            </Typography>
            {/* <TextField
              className="inputFields"
              placeholder="e.g. covered / uncovered / garage / driveway"
              fullWidth
              margin="normal"
              value={formData.spot_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  spot_type: e.target.value,
                })
              }
              onBlur={(e) => validateField("spot_type", e.target.value)}
              error={!!formErrors.spot_type}
              helperText={formErrors.spot_type}
            /> */}
            <FormControl
              fullWidth
              margin="normal"
              error={!!formErrors.spot_type}
            >
              <InputLabel id="spot-type-label">Spot Type</InputLabel>
              <Select
                labelId="spot-type-label"
                id="spot-type-select"
                value={formData.spot_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    spot_type: e.target.value,
                  })
                }
                onBlur={(e) => validateField("spot_type", e.target.value)}
                label="Spot Type"
              >
                <MenuItem value="covered">Covered</MenuItem>
                <MenuItem value="uncovered">Uncovered</MenuItem>
                <MenuItem value="garage">Garage</MenuItem>
                <MenuItem value="driveway">Driveway</MenuItem>
              </Select>
              {formErrors.spot_type && (
                <FormHelperText>{formErrors.spot_type}</FormHelperText>
              )}
            </FormControl>

            <Typography
              variant="h6"
              className="labels"
              style={{ paddingTop: "14px" }}
            >
              Features
            </Typography>
            <Grid container rowSpacing={1} columnSpacing={1}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={featureChecks["Disability Friendly"]}
                      onChange={handleFeatureChange}
                      name={"Disability Friendly"}
                    />
                  }
                  // label="Disability Friendly"
                  label={
                    <Typography
                      component="span"
                      style={{ fontStyle: "italic" }}
                    >
                      Disability Friendly
                    </Typography>
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={featureChecks["24/7 Access"]}
                      onChange={handleFeatureChange}
                      name={"24/7 Access"}
                    />
                  }
                  label="24/7 Access"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={featureChecks["CCTV"]}
                      onChange={handleFeatureChange}
                      name={"CCTV"}
                    />
                  }
                  label="CCTV"
                />
              </Grid>

              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={featureChecks["Electric charging"]}
                      onChange={handleFeatureChange}
                      name={"Electric charging"}
                    />
                  }
                  label="Electric charging"
                />
              </Grid>

              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={featureChecks["Combintion Lock"]}
                      onChange={handleFeatureChange}
                      name={"Combintion Lock"}
                    />
                  }
                  label="Combintion Lock"
                />
              </Grid>

              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={featureChecks["Security gate"]}
                      onChange={handleFeatureChange}
                      name={"Security gate"}
                    />
                  }
                  label="Security gate"
                />
              </Grid>

              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={featureChecks["Car Wash"]}
                      onChange={handleFeatureChange}
                      name={"Car Wash"}
                    />
                  }
                  label="Car Wash"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" className="labels">
              Add a description
            </Typography>
            <TextField
              className="inputFields"
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    outline: "none",
                    borderColor: "primary.main",
                  },
                },
              }}
              value={formData.description}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  description: e.target.value,
                });
              }}
            />

            <Typography
              variant="h6"
              className="labels"
              style={{ paddingTop: "8px" }}
            >
              Upload an image
            </Typography>
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
                  minHeight: "200px",
                  border: "1px dashed grey",
                }}
                onClick={selectedImage ? handleOpen : undefined}
              >
                {selectedImage ? (
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
                )}
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
          </Paper>
        </Grid>

        {/* Right Column with Paper Component */}
        <Grid item xs={4} style={{ display: "flex" }}>
          <Paper
            elevation={3}
            style={{
              width: "100%",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Map
              currentLocation={currentLocation}
              coor={currentCoord}
              setCurrentCoord={setCurrentCoord}
            />

            <Typography
              variant="h6"
              className="labels"
              style={{ paddingTop: 20 }}
            >
              Price *
            </Typography>

            <div className="priceCheckboxItems">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={priceChecked.hourly}
                    onChange={handlePriceCheckboxChange}
                    name="hourly"
                    style={{ alignSelf: "center" }}
                  />
                }
                label="Hourly"
              />
              <TextField
                label="Price per time unit"
                variant="outlined"
                name="hourly"
                value={prices.hourly}
                onChange={handlePriceInputChange}
                disabled={!priceChecked.hourly}
                type="number"
                InputLabelProps={{ shrink: true }}
                margin="normal"
                inputProps={{
                  min: 0, // Ensure only non-negative numbers can be entered
                  onWheel: (event) => event.target.blur(), // Blur input on wheel to prevent changes
                }}
              />
            </div>

            <div className="priceCheckboxItems">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={priceChecked.daily}
                    onChange={handlePriceCheckboxChange}
                    name="daily"
                    style={{ alignSelf: "center" }}
                  />
                }
                label="Daily"
              />
              <TextField
                label="Price per time unit"
                variant="outlined"
                name="daily"
                value={prices.daily}
                onChange={handlePriceInputChange}
                disabled={!priceChecked.daily}
                type="number"
                InputLabelProps={{ shrink: true }}
                margin="normal"
                inputProps={{
                  min: 0, // Ensure only non-negative numbers can be entered
                  onWheel: (event) => event.target.blur(), // Blur input on wheel to prevent changes
                }}
              />
            </div>

            <div className="priceCheckboxItems">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={priceChecked.monthly}
                    onChange={handlePriceCheckboxChange}
                    name="monthly"
                    style={{ alignSelf: "center" }}
                  />
                }
                label="Monthly"
              />
              <TextField
                label="Price per time unit"
                variant="outlined"
                name="monthly"
                value={prices.monthly}
                onChange={handlePriceInputChange}
                disabled={!priceChecked.monthly}
                type="number"
                InputLabelProps={{ shrink: true }}
                margin="normal"
                inputProps={{
                  min: 0, // Ensure only non-negative numbers can be entered
                  onWheel: (event) => event.target.blur(), // Blur input on wheel to prevent changes
                }}
              />
            </div>

            <Typography variant="h6" className="labels">
              Publish *
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  // checked={formData.status === "public"}
                  checked={publish_state === true}
                  onChange={(e) => {
                    // save the publish state, call the publish api on submit
                    setPublish_state(e.target.checked ? true : false);
                  }}
                />
              }
              label="Publish this space"
            />
            {/* <Typography variant="h6" className="labels">
              Status *
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === "public"}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      status: e.target.checked ? "public" : "private",
                    });
                  }}
                />
              }
              label="Release to Public"
            /> */}

            <MyButton onClick={handleSubmit} size="lg">
              Save Space
            </MyButton>
          </Paper>
        </Grid>
      </Grid>

      {/* Using the ImagePreviewModal */}
      <ImagePreviewModal
        open={open}
        imageSrc={selectedImage}
        handleClose={handleClose}
      />
    </Container>
  );
}

export default CreateASpace;
