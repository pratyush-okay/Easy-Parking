import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import "./PersonalCarDetails.css";
import AlertContext from "../../CustomAlert/AlertContext";
import MyButton from "../../MyButton";

// Define maxinum rego length
const maxregolength = 7;

const PersonalCarDetails = (props) => {
  const { customAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();
  const userEmail = props.userEmail;
  const [nickName, setNickName] = React.useState("");
  const [rego, setRego] = React.useState("");
  const [vehicleType, setVehicleType] = React.useState("");
  const [ev, setEv] = React.useState(false);
  const [carDetails, setCarDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getresponse = await axios.post(
          "http://127.0.0.1:8000/user/cardetails/get",
          {
            user_email: userEmail,
          }
        );
        setCarDetails(JSON.parse(getresponse.data));
      } catch (error) {
        console.error("Error getting car details:", error);
      }
    };
    fetchData();
  }, [userEmail]);

  // Set car details
  const handleSetCarDetails = async () => {
    // Check car details whether empty or not
    if (!nickName || !rego || !vehicleType || ev === null) {
      customAlert("Please fill in all fields");
      return;
    }
    try {
      const setresponse = await axios.post(
        "http://localhost:8000/user/cardetails/set",
        {
          user_email: userEmail,
          nickname: nickName,
          rego: rego,
          vehicle_type: vehicleType,
          ev: ev,
          // To ensure first car detail will be default car
          default: carDetails.length === 0,
        }
      );
      console.log(setresponse);
      customAlert("Car details added successfully!");
      navigate("/profile/cardetails");
    } catch (error) {
      customAlert(
        "Try to add another nickname, this nickname is already exists in your car details."
      );
      console.error("Error adding car details:", error);
    }
  };

  return (
    <div className="PersonalInfo">
      <div className="PagePath">
        <Link className="Link" to="/profile">
          {"Profile"}
        </Link>
        &nbsp;{">"}&nbsp;
        <Link className="Link" to="/profile/cardetails">
          {"Vehicle"}
        </Link>
        &nbsp;{">"}&nbsp; Add your vehicle
      </div>
      <h2>Add Your Vehicles</h2>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <div className="PersonalCarDetails">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nickname"
                fullWidth
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
              />
            </Grid>
            {/* Check rego length format first*/}
            <Grid item xs={12}>
              <TextField
                label="Vechile Plate Number"
                fullWidth
                value={rego}
                onChange={(e) => {
                  const regolength = e.target.value;
                  if (regolength.length > maxregolength) {
                    customAlert(
                      "Vehicle Plate Number should not exceed 7 characters"
                    );
                  } else {
                    setRego(e.target.value);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel className="selectbox" id="vehiclesize">
                Vehicle Size
              </InputLabel>
              <Select
                labelId="vehiclesize"
                id="vehiclesize"
                value={vehicleType}
                label="Vehiclesize"
                fullWidth
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <MenuItem value={"Sedan"}>Sedan (1.8 metres or less)</MenuItem>
                <MenuItem value={"Large"}>Large 4WD (2 metres)</MenuItem>
                <MenuItem value={"Van"}>Van (over 2.2 metres)</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <InputLabel id="ev">EV</InputLabel>
              <RadioGroup
                aria-label="EV"
                value={ev.toString()}
                onChange={(e) => setEv(e.target.value === "true")}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <Link to="/profile/cardetails">
                <MyButton
                  color="red"
                  variant="outlined"
                  sx={{ marginRight: "10px" }}
                >
                  Cancel
                </MyButton>
              </Link>
              <MyButton onClick={handleSetCarDetails}>Add Vehicle</MyButton>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>
  );
};

export default PersonalCarDetails;
