import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MyButton from "../MyButton";

// Props are used to control the dialog's appearance and functionality
function CustomAlertDialog({
  open,
  handleClose,
  message,
  alertTitle = "Warning",
}) {
  if (!message) return null;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          boxShadow: "none",
          width: "20rem",
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ bgcolor: "rgb(23, 62, 104)", color: "white", p: 1.5 }}
      >
        {alertTitle}
      </DialogTitle>
      {/* <DialogTitle id="alert-dialog-title" sx={{ bgcolor: 'primary.main', color: 'white', p: 1.5 }}>
        Warning
    </DialogTitle> */}
      <DialogContent sx={{ p: 3, mt: 3 }}>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <MyButton
          onClick={handleClose}
        >
          OK
        </MyButton>
      </DialogActions>
    </Dialog>
  );
}

export default CustomAlertDialog;
