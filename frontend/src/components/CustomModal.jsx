import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomModalTab from "./CustomModalTab";
import ListingDetails from "./ListingDetails.jsx";
import ListingReviews from "./ListingReviews.jsx";

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

const CustomModal = (props) => {
  const modalStatus = props.modalStatus;
  const closeModal = props.closeModal;
  const userId = props.userId;
  const parkingId = props.parkingId;
  const type = props.type;
  const tabs = props.tabs; // all of the tabs on the modal (type: dict)
  const parkingAvaliable = props.parkingAvaliable;
  const [currentTab, setCurrentTab] = React.useState("details");

  return (
    <Modal open={modalStatus} onClose={closeModal}>
      <Box sx={modalStyle}>
        {/******* modal tab (details/reviews) *******/}
        {tabs ? (
          <CustomModalTab
            tabs={tabs}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        ) : null}

        {/******* close modal btn ********/}
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* main content */}
        {currentTab === "details" ? (
          <ListingDetails
            userId={userId}
            parkingId={parkingId}
            type={type}
            parkingAvaliable={parkingAvaliable}
          />
        ) : null}

        {currentTab === "reviews" ? (
          <ListingReviews userId={userId} parkingId={parkingId} />
        ) : null}
      </Box>
    </Modal>
  );
};

export default CustomModal;

/** USAGE

import React from "react";
import CustomModal from "./CustomModal.jsx";

const TestModal = () => {
  const [modalStatus, setModalStatus] = React.useState(true);

  const closeModal = () => {
    setModalStatus(false);
  }
  const tabs = {'details': 'Parking Space Details', 'reviews': 'Reviews'} // key: tab item, value: tab display
  return (
    <>
      <CustomModal
        tabs={tabs}
        type='booking'
        modalStatus={modalStatus}
        closeModal={closeModal}
        userId='123.ysheep@gmail.com'
        parkingId='37'
      />
    </>
  );
};

export default TestModal;


 */
