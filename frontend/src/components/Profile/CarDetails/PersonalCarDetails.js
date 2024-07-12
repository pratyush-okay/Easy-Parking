import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Grid,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import "./PersonalCarDetails.css";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AlertContext from "../../CustomAlert/AlertContext";
import MyButton from "../../MyButton";
import sedanImg from "./sedan.jpg";
import largeImg from "./4wd.jpg"
import vanIng from "./van.jpg"

const PersonalCarDetails = (props) => {
  const { customAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();
  const userEmail = props.userEmail;

  // Edit field
  const [nickNameEdit, setNickNameEdit] = React.useState("");
  const [regoEdit, setRegoEdit] = React.useState("");
  const [vehicleTypeEdit, setVehicleTypeEdit] = React.useState("");
  const [evEdit, setEvEdit] = React.useState("");
  const [editField, setEditField] = React.useState("");

  const [carDetails, setCarDetails] = React.useState([]);

  // Car images
  const carImages ={
    Sedan:sedanImg,
    Large:largeImg,
    Van:vanIng,
  }
  
  React.useEffect(() => {
    getCarInfo();
  });
  console.log("userEmail:", userEmail);

  // Get car details via user email
  const getCarInfo = async () => {
    try {
      const getresponse = await axios.post(
        "http://127.0.0.1:8000/user/cardetails/get",
        {
          user_email: userEmail,
        }
      );
      const cars = JSON.parse(getresponse.data) || [];
      const updatedCars = cars.map((car) => ({
        ...car,
        isDefault: car.fields.default,
      }));
      setCarDetails(updatedCars);
    } catch (error) {
      console.error("Error getting car details:", error);
    }
  };

  // Define maxinum rego length
  const maxregolength = 7;

  // Edit car details
  const handleEditCar = (index) => {
    console.log("index:", index);
    const car = carDetails[index];
    setNickNameEdit(car.fields.nickname);
    setRegoEdit(car.fields.rego);
    setVehicleTypeEdit(car.fields.vehicle_type);
    setEvEdit(car.fields.ev);
    setEditField(index);
  };

  // Update car details
  const handleSaveEdit = async (index) => {
    try {
      const updatedCarDetails = JSON.parse(JSON.stringify(carDetails));
      const oldNickname = updatedCarDetails[index].fields.nickname;
      console.log("oldnickname:", oldNickname);
      updatedCarDetails[index].fields.nickname = nickNameEdit;
      console.log("nickNameEdit:", nickNameEdit);
      updatedCarDetails[index].fields.rego = regoEdit;
      updatedCarDetails[index].fields.vehicle_type = vehicleTypeEdit;
      updatedCarDetails[index].fields.ev = evEdit;
      // console.log("updatedCarDetails:",updatedCarDetails)
      // console.log("updatedCarDetails[index]:",updatedCarDetails[index]);
      // console.log("123updatedCarDetails:",updatedCarDetails)
      const putresponse = await axios.put(
        "http://127.0.0.1:8000/user/cardetails/update",
        {
          user_email: userEmail,
          old_nickname: oldNickname,
          new_nickname: nickNameEdit,
          rego: regoEdit,
          vehicle_type: vehicleTypeEdit,
          ev: evEdit,
        }
      );
      console.log("Updated successfully!", putresponse.data);
      customAlert("Car details updated successfully!");
      setCarDetails([...updatedCarDetails]);
      setEditField("");
    } catch (error) {
      customAlert("Error updating car details: ", error);
    }
  };

  // Delete car details
  const handleDeleteCarDetail = async (nickname) => {
    try {
      await axios.delete("http://127.0.0.1:8000/user/cardetails/delete", {
        data: {
          user_email: userEmail,
          nickname: nickname,
        },
      });
      const updatedCarDetails = carDetails.filter(
        (car) => car.fields.nickname !== nickname
      );
      const deleteCar = carDetails.find(
        (car) => car.fields.nickname === nickname
      );
      // If deleted car is default car, we let the first car in the list becomes default car.
      if (deleteCar.isDefault && updatedCarDetails.length > 0) {
        updatedCarDetails[0].isDefault = true;
        await axios.put("http://127.0.0.1:8000/user/cardetails/default", {
          user_email: userEmail,
          nickname: updatedCarDetails[0].fields.nickname,
        });
      }
      setCarDetails(updatedCarDetails);
      console.log("Car details deleted successfully!");
      customAlert("Car details deleted successfully!");
    } catch (error) {
      console.error("Error deleting car details:", error);
    }
  };

  // Set Default car
  const handleSetDefaultCar = async (nickname) => {
    try {
      // Ensure there should be always one default car
      // Alert if user switch the default car, becuse there should be always one default car
      const originalDefaultCar = carDetails.find((car) => car.isDefault);
      if (
        originalDefaultCar &&
        originalDefaultCar.fields.nickname === nickname
      ) {
        customAlert(
          "This can not be edited because there should be always one default car, please try to set another new default car."
        );
        return;
      }

      // Unable original default car
      if (originalDefaultCar) {
        await axios.put("http://127.0.0.1:8000/user/cardetails/default", {
          user_email: userEmail,
          nickname: originalDefaultCar.fields.nickname,
        });
      }

      // Enable new default car
      const setdefaultresponce = await axios.put(
        "http://127.0.0.1:8000/user/cardetails/default",
        {
          user_email: userEmail,
          nickname: nickname,
        }
      );
      console.log(setdefaultresponce);
      const updatedCarDetails = carDetails.map((car) => ({
        ...car,
        isDefault: car.fields.nickname === nickname,
      }));
      setCarDetails(updatedCarDetails);
      // await setCarDetails(updatedCarDetails);
    } catch (error) {
      console.error("Error setting default car:", error);
    }
  };

  // Navigate to add car details page
  const handleAddData = async () => {
    navigate("/profile/addcardetails");
  };

  // Cancel: navigate user to their car detail
  const handleCancelEdit = async (index) => {
    setEditField("");
  };

  return (
    <div className="PersonalInfo">
      <div className="PagePath">
        <Link className="Link" to="/profile">
          {"Profile"}
        </Link>
        &nbsp;{">"}&nbsp;
        {"Vehicle"}
      </div>
      <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
      <Grid item xs={12} sm={6} style={{ maxWidth: '100%' }}>
        <img src="/road-trip-37.png" alt="profile" className="ProfileImg" style={{ width: '100%', height: 'auto' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
      <div>
        <h1>
          Your Vehicles
          <MyButton
            round
            size="sm"
            sx={{ float: "right" }}
            onClick={handleAddData}
          >
            <AddIcon />
          </MyButton>
        </h1>
        <ul>
          {/* Reference: https://legacy.reactjs.org/docs/lists-and-keys.html */}
          {carDetails.length > 0 &&
            carDetails.map((car, index) => (
              <li key={index}>
                {editField === index ? (
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Nickname"
                          value={nickNameEdit}
                          onChange={(e) => setNickNameEdit(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Rego"
                          value={regoEdit}
                          onChange={(e) => {
                            const regolength = e.target.value;
                            if (regolength.length > maxregolength) {
                              customAlert(
                                "Vehicle Plate Number should not exceed 7 characters"
                              );
                            } else {
                              setRegoEdit(e.target.value);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Select
                          value={vehicleTypeEdit}
                          label="Vehicle Type"
                          onChange={(e) => setVehicleTypeEdit(e.target.value)}
                        >
                          <MenuItem value={"Sedan"}>
                            Sedan (1.8 metres or less)
                          </MenuItem>
                          <MenuItem value={"Large"}>
                            Large 4WD (2 metres)
                          </MenuItem>
                          <MenuItem value={"Van"}>
                            Van (over 2.2 metres)
                          </MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12}>
                        <RadioGroup
                          aria-label="EV"
                          value={evEdit.toString()}
                          onChange={(e) => setEvEdit(e.target.value === "true")}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="EV: True"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="EV: False"
                          />
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <MyButton
                          size="sm"
                          variant="outlined"
                          color="red"
                          sx={{ marginRight: "10px" }}
                          onClick={() => handleCancelEdit(index)}
                        >
                          Cancel
                        </MyButton>
                        <MyButton
                          size="sm"
                          onClick={() => handleSaveEdit(index)}
                        >
                          Save
                        </MyButton>
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  <div>
                    <Grid item xs={6}>
                      <br></br>
                      <div style={{ float: "right", marginRight: "20px" }}>
                        <img src={carImages[car.fields.vehicle_type]} alt={car.fields.vehicle_type} width="175" className="carimage"/>
                      </div>
                    </Grid>
                    <p>Nickname: {car.fields.nickname}</p>
                    <p>Rego: {car.fields.rego}</p>
                    <p>Vehicle Type: {car.fields.vehicle_type}</p>
                    <p>EV: {car.fields.ev ? "True" : "False"}</p>
                    <MyButton
                      size="sm"
                      round
                      title="edit"
                      sx={{ marginRight: "10px" }}
                      onClick={() => handleEditCar(index)}
                    >
                      <EditIcon />
                    </MyButton>
                    <MyButton
                      size="sm"
                      round
                      title="delete"
                      color="red"
                      onClick={() => handleDeleteCarDetail(car.fields.nickname)}
                    >
                      <DeleteIcon />
                    </MyButton>
                    <Grid item xs={3}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={car.isDefault}
                            onChange={() =>
                              handleSetDefaultCar(car.fields.nickname)
                            }
                          />
                        }
                        label="Set as Default Car"
                      />
                    </Grid>
                  </div>
                )}
                <Divider />
              </li>
            ))}
        </ul>
      </div>
      </Grid>
      </Grid>
    </div>
  );
};

export default PersonalCarDetails;
