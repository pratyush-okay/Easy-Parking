import React from 'react';
import ProfileConsumer from './ProfileConsumer/ProfileConsumer';
import { useNavigate } from "react-router-dom";
import AlertContext from "../CustomAlert/AlertContext";

const Profile = (props) => {
  const {customAlert} = React.useContext(AlertContext);

  const navigate = useNavigate();
  const userEmail = props.userEmail;

  /* has NOT login, redirect to login page */
  React.useEffect(() => {
    console.log("token:", userEmail);
    if (!userEmail) {
      customAlert('Please Login.')
      navigate('/login');
    }
  }, [userEmail, customAlert, navigate])

  return (
    <div>
      <ProfileConsumer />
    </div>
  );
};

export default Profile;
