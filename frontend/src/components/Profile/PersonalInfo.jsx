import React from "react";
import { useNavigate, Link } from "react-router-dom";
import validator from "validator";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import ErrorMsg from "../ErrorMsg";
import ApiCallPut from "../../action/ApiCallPut";
import ApiCallPost from "../../action/ApiCallPost";
import AlertContext from "../CustomAlert/AlertContext";
import MyButton from "../MyButton.jsx";
import {FormControlLabel, Switch, Grid } from "@mui/material";


const validatePhoneNumber = (number) => {
  const isValidPhoneNumber = validator.isMobilePhone(number);
  return isValidPhoneNumber;
};

const PersonalInfo = (props) => {
  const {customAlert} = React.useContext(AlertContext);

  const navigate = useNavigate();
  const userEmail = props.userEmail;
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState(userEmail); // cant be changed
  const [phonenum, setPhonenum] = React.useState("");
  const [nameEdit, setNameEdit] = React.useState("");
  const [phonenumEdit, setPhonenumEdit] = React.useState("");
  const [editField, setEditField] = React.useState(""); // current seleted edit field
  const types = ["name", "phone"];
  const [disabled, setDisabled] = React.useState(false);
  const [usertype, setUserType] = React.useState("");

  /* has NOT login, redirect to login page */
  React.useEffect(() => {
    console.log("token:", userEmail);
    if (!userEmail) {
      navigate("/login");
    }
  });


  /* get peronal info from backend (GET) */
  const getPersonalInfo = async () => {
    const body = { email: userEmail };
    const data = await ApiCallPost("user/byemail/", body, "", false);
    if (data) {
      const dataName = JSON.parse(data)[0].fields.name;
      const dataPhone = JSON.parse(data)[0].fields.phone;
      const dataUserType = JSON.parse(data)[0].fields.user_type;
      const dataDisabled = JSON.parse(data)[0].fields.disabled;
      setName(dataName);
      setPhonenum(dataPhone);
      setNameEdit(dataName);
      setPhonenumEdit(dataPhone);
      setUserType(dataUserType);
      setDisabled(dataDisabled);
      // console.log("UserType",dataUserType);
    }
  };
  React.useEffect(() => {
    getPersonalInfo();
  });
  /* update personal info from backend (PUT) */
  const handleUpdate = async (e, type) => {
    e.preventDefault();
    const newValue = getEditValue(type);
    setValue(type, newValue);
    const body = {
      email: userEmail,
      name: name,
      phone: phonenum,
      disabled: disabled,
    };
    body[type] = newValue;
    console.log(body);
    const data = await ApiCallPut("user/update/", body, "", false);
    if (data) {
      // data update successfully
      customAlert(data);
      setEditField("");
      setValue(type, newValue);
    }
  };

  /* update disability status from backend (PUT) */
  const handleUpdateDisabled = async(e)=> {
    e.preventDefault();
    const body = {
      email: userEmail,
      name: name,
      phone: phonenum,
      disabled: !disabled,
    };
    console.log(body);
    const data = await ApiCallPut("user/update/", body, "", false);
    if (data) {
      // data update successfully
      customAlert(data);
      setDisabled(!disabled);
    }
  };
  
  const ErrorMsgHtml = () => {
    if (!validatePhoneNumber(phonenumEdit)) {
      return <ErrorMsg type="PhoneFormatInvalid" />;
    } else {
      return null;
    }
  };

  const getIsFormValid = (type) => {
    const value = getEditValue(type);
    if (type === "phone") return validatePhoneNumber(value);
    else return getEditValue(type);
  };

  const setEditValue = (valueType, value) => {
    switch (valueType) {
      case "name":
        return setNameEdit(value);
      case "phone":
        return setPhonenumEdit(value);
      default:
        return "Error";
    }
  };

  const getEditValue = (valueType) => {
    switch (valueType) {
      case "name":
        return nameEdit;
      case "phone":
        return phonenumEdit;
      default:
        return "Error";
    }
  };

  const setValue = (valueType, value) => {
    console.log(valueType, value);
    switch (valueType) {
      case "name":
        return setName(value);
      case "email":
        return setEmail(value);
      case "phone":
        return setPhonenum(value);
      default:
        return "Error";
    }
  };

  const getValue = (valueType) => {
    switch (valueType) {
      case "name":
        return name;
      case "email":
        return email;
      case "phone":
        return phonenum;
      default:
        return "Error";
    }
  };


  return (
    <>
      <div className="PersonalInfo">
        <div className="PagePath">
          <Link className="Link" to="/profile">
            {"Profile"}
          </Link>
          &nbsp;{">"}&nbsp; Personal Info
        </div>
        <Grid container spacing={2} alignItems="center" sx={{mt:4}}>
        <Grid item xs={12} sm={6} lg={6}>
                <img src="/personal-data-30.png" alt="profile" className="ProfileImg" style={{ width: '100%', maxWidth: '600px', height: 'auto' }} />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
        <h2>Personal Info</h2>
        <div>
          <div className="Section">
            <span className="FieldTitle">
              Email
            </span>
            <div className="FieldValue">{userEmail}</div>
            <hr />
          </div>
          {/* create all fields included in types Array */}
          {types.map((type) => {
            return (
              <div className="Section" key={type}>
                <span className="FieldTitle">
                  {type}
                </span>
                {editField === `${type}` ? (
                  /* if this type IS currently being EDITED... */
                  <>
                    {/* Link: to CANCEL editing */}
                    <span className="Link" onClick={() => setEditField("")}>
                      Cancel
                    </span>
                    {/* Form: to EDIT/SUBMIT the changes */}
                    <form>
                      {`${type}` === "phone" ? (
                        <>
                          <PhoneInput
                            className="PhoneInput"
                            value={getEditValue(`${type}`)}
                            onChange={(phone) => setEditValue(`${type}`, phone)}
                          />
                          <ErrorMsgHtml />
                        </>
                      ) : (
                        <input
                          type="text"
                          className="FieldValue"
                          value={getEditValue(`${type}`)}
                          onChange={(e) =>
                            setEditValue(`${type}`, e.target.value)
                          }
                        />
                      )}
                      <MyButton
                        type="Submit"
                        disabled={!getIsFormValid(`${type}`)}
                        onClick={(e) => handleUpdate(e, `${type}`)} // value need to be check !!!! havent done
                      >
                        Save
                      </MyButton>
                    </form>
                  </>
                ) : (
                  /* if this type IS NOT currently being EDITED... */
                  <>
                    {/* Link: to START editing */}
                    <span
                      className="Link"
                      onClick={() => setEditField(`${type}`)}
                    >
                      Edit
                    </span>
                    {/* display the current value of the type */}
                    <div className="FieldValue">{getValue(`${type}`)}</div>
                  </>
                )}
                <hr />
              </div>
            );
          })}
          {/* Disability Status*/}
          {usertype === "guest" && (
            <>
              <b> Disability Status </b><br></br>
              <FormControlLabel
                control={
                  <Switch
                  checked={disabled}
                  onChange={handleUpdateDisabled}
                  />
                }
              />
            </>
          )}
        </div>
        </Grid>
        </Grid>
      </div>
    </>
  );
};

export default PersonalInfo;
