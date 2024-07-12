import React from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MyButton from "./MyButton";

const MODAL_EXPIRED_DURATION = 10; // secs

const LogoutCheckModal = (props) => {
  const navigate = useNavigate();
  
  const [countDown, setCountDown] = React.useState(MODAL_EXPIRED_DURATION);


  /* logout */
  const logoutAction = () => {
    /* clearing out auth token in localStorage and state */
    localStorage.removeItem("UserEmail"); 
    // clear all localstorage
    localStorage.clear();
    props.setUserEmail(null);
    props.setUserType("none");
    props.handleClose(false);
    /* redirection */
    navigate("/login");
  };

    /* sets the timer & auto logout */
    const handleLogoutTimer = () => {
        console.log(countDown, props.open)
        if (countDown > 0 && props.open && props.logoutType === "auto") {
            const timer = setTimeout(() => {
                const temp = countDown;
                setCountDown(temp - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (countDown === 0 && props.open && props.logoutType === "auto") {
            /* logout if times up */
            logoutAction();
        }
    };
    React.useEffect(() => {
      if (props.open && props.userEmail) {
          handleLogoutTimer();
      } else {
          setCountDown(MODAL_EXPIRED_DURATION);
      }
    }, [countDown, props.open, props.userEmail])    
  
    const handleCancel = () => {
        props.handleClose();
    }

  return (
    <div>
      <Dialog
        open={props.open && props.userEmail ? true : false}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">
          {props.logoutType === "auto" ? "Session Timeout" : "Logout"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.logoutType === "auto" 
            ? (
              <>
                You are being time-out due to inactivity.
                <br />
                You will be logged off automatically in {countDown} secs.
              </>
            ) : (
              <>Are you sure To logout?</>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MyButton onClick={() => handleCancel()} variant='outlined'>Cancel</MyButton>
          <MyButton onClick={() => logoutAction()}>Logout</MyButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LogoutCheckModal;
