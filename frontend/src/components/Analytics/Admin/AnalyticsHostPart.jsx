import React from "react";
import { Link, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import ProviderAnalytics from "../Provider/Analytics.jsx";
import MyButton from "../../MyButton.jsx";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import AlertContext from "../../CustomAlert/AlertContext";
import DeleteBooking from "./DeleteBooking.jsx";
import BookingsModal from "../BookingsModal.jsx";

function AnalyticsHostPart() {
  const { customAlert } = React.useContext(AlertContext);
  const state = useLocation();
  const users = state.state.allHost; // accessed by which page (login/register)
  const [selectedHost, setSelectedHost] = React.useState("");
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false); 
  const [userDetail, setUserDetail] = React.useState(null);
  const [searchBar, setSearchBar] = React.useState("");
  const [isBookingsOpen, setIsBookingsOpen] = React.useState(false); 
  const [deleteBookingId, setDeleteBookingId] = React.useState(null);
  const [openDeleteModalBooking, setOpenDeleteModalBooking] = React.useState(false);

  React.useEffect(() => {
    if (users) {
      setSelectedHost(users[0].email)
    }
  }, [users])

  const handleCloseDeleteModalBooking = async () => {
    setOpenDeleteModalBooking(false);
    setDeleteBookingId(null);
  };

  const handleDeleteBooking = (bookingId) => {
    setDeleteBookingId(bookingId);
    setOpenDeleteModalBooking(true); // Open the delete confirmation modal
  };

  /******************* Get All Users Info **************************/ 
  const [AllUserInfo, setAllUserInfo] = React.useState([]);
  const getUserInfo = async () => {
    try {
        const response = await axios.get(
          "http://127.0.0.1:8000/user/all/",
          {}
        );
        const data = JSON.parse(response.data);
        // console.log("data:",data);
        const allUserInfo = data.map((item) => ({
          user_id: item.pk,
          name:item.fields.name,
          email:item.fields.email,
          phone:item.fields.phone,
          role: item.fields.user_type,
        }));
        // console.log("allUserInfo:",allUserInfo);
        setAllUserInfo(allUserInfo);
        // console.log("AllUserInfo:",AllUserInfo);
      } catch (error) {
        console.error("Error getting user data:", error);
    }
  };
  React.useEffect(()=>{
    getUserInfo();
  },[]);

  /***************** View Desired User Detail *******************/ 
  const handaleDetailClick =(host_email) => {
    setSelectedHost(host_email);
    // Match user via email
    // console.log("hostemail123:",host_email);
    const userInfo =AllUserInfo.find((user)=>user.email === host_email);
    // console.log("userInfocheck:",userInfo);
    if (userInfo){
      setUserDetail(userInfo);
      // console.log("234UserDetail",userDetail);
      setIsDetailsOpen(true);
    }
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  /******************* Search Bar Part **************************/ 
  const handleSearchChange =(event) => {
    setSearchBar(event.target.value);
    // User can enter email or name to get desired users details (auto selected)
    const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(event.target.value.toLowerCase()) ||
    user.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSelectedHost(filteredUsers[0]?.email);
  }

  /******************* Get All Booking History *********************/ 
  const [AllBookingsInfo, setAllBookingsInfo] = React.useState([]);
  const getAllBooking = async()=>{
    try{
      const response = await axios.get("http://127.0.0.1:8000/booking/all/",
      {}
      );
      const data = JSON.parse(response.data);
      const bookingdata = data.map((item) => ({
        bookingid: item.pk,
        email:item.fields.user_email,
        parkingid: item.fields.parking_id,
        startdate: item.fields.start_date,
        enddate: item.fields.end_date,
        starttime: item.fields.start_time,
        endtime: item.fields.end_time,
        price: item.fields.price,
      }));
      setAllBookingsInfo(bookingdata);
      
    } catch(error){
      console.error("Error getting booking data:", error);
    }
  };
  React.useEffect(() => {
    getAllBooking();
  }, []);

 /******************* Getting All Parking **************************/ 
 const [AllParkingsInfo, setAllParkingsInfo] = React.useState([]);
 console.log(AllParkingsInfo);
  React.useEffect(() => {
    const getAllParking = async()=>{
      try{
        const response = await axios.get("http://localhost:8000/parking/all/",
        {}
        );
        const data = JSON.parse(response.data);
        const parkingdata = data.map((item) => ({
          parkingid: item.pk,
          hostemail:item.fields.host_email,
        }));
        setAllParkingsInfo(parkingdata);
        
      } catch(error){
        console.error("Error getting parking data:", error);
      }
    };
    getAllParking();
  }, []);


  /******************* Matching for host's parking spaces and booking history **********************/  
  const [matchID, setMatchID] = React.useState([]);
  const [matchedBooked, setMatchBooked] = React.useState([]);
  setMatchID([]);
  React.useEffect(() => {
    if (matchID.length > 0) {
      const matchbooking = AllBookingsInfo.filter((booking) => matchID.includes(booking.parkingid));
      setMatchBooked(matchbooking);
      setIsBookingsOpen(true);
    }
  }, [matchID, AllBookingsInfo]);

  
  const handleCloseBookingHistory = () => {
    setIsBookingsOpen(false);
  };

   /******************* Delete User **************************/ 
   const handleDelteUser =(host_email)=>{
    const message = ` Dear User,
    We regret to inform you that your account has been removed from our system due to a violation of our regulations and terms.
    We take the safety and compliance of all users very seriously. In order to ensure the security and proper functioning of our platform, we must take these measures.
    If you have any questions about our decision or need further explanation, please feel free to contact us.
    Thank you for your understanding and cooperation.
    
    Best regards,
    
    AnyParking
    `;

    // Delete user api part
    try{
      axios.delete("http://127.0.0.1:8000/user/delete",{
        data:{
          user_email:host_email
        }
      })
      customAlert("User deletion and email notification sent successfully!");
      const updatedUsers = users.filter(user => user.email !== host_email);
      state.state.allHost = updatedUsers;
      setSelectedHost(updatedUsers[0]?.email);
    } catch(error){
      console.error("Error deleting user data:", error);
    }


    // Upon deleteing user, it will send email to them
    try {
      axios.post("http://127.0.0.1:8000/email/notification/", {
        message: message,
        email: host_email,
      }); 
    } catch (error) {
      console.error("Error sending email to delted user:", error);
    };    
  }

  return (
    <>
      <div className="PagePath">
        <Link className="Link" to="/admin/analytics">
          {"Analytics"}
        </Link>
        &nbsp;{">"}&nbsp; Host ({users ? users.length : 0})
      </div>

      <div style={{ display: "flex" }}>
        <Box
          sx={{
            width: "25%",
            maxWidth: 360,
            height: "85vh",
            overflowX: "scroll",
          }}
        >
          <br></br>
          {/* Searching Bar */}
          <TextField
          label="Search"
          variant="outlined"
          value={searchBar}
          onChange={handleSearchChange}
          fullWidth
          />
          <List>
            {users && users.map((user, index) => {
              const email = user.email;
              const name = user.name;
              return (
                <ListItem
                  key={index}
                  disablePadding 
                  sx={{backgroundColor: selectedHost === email ? "#e5e5e5" : "white",}}
                >
                  <ListItemButton onClick={() => setSelectedHost(email)} disableRipple>
                    <ListItemText primary={name} secondary={email} />
                  </ListItemButton>
                </ListItem>
              );
            })}
            { !users
            ? 'There are no hosts.'
            : null
            }
          </List>
        </Box>

        <div style={{padding: '0px 20px'}}>
          {selectedHost ? (
            <>
              <h2>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{selectedHost} &nbsp;&nbsp;
                <MyButton onClick={() => handaleDetailClick(selectedHost)}>Details</MyButton>   &nbsp;&nbsp;
                <MyButton onClick={() => handleDelteUser(selectedHost)}>Delete This User</MyButton>
              </h2>
              <ProviderAnalytics userEmail={selectedHost} />
            </>
          ) : (
            "There are no hosts."
          )}
        </div>
      </div>
      {/* view users details */}
        <Dialog
          open={isDetailsOpen}
          onClose={handleCloseDetails}
        >
          <DialogTitle><b>{userDetail?.name}'s Details</b></DialogTitle>
          <DialogContent>
            <p><b>UserID:</b> {userDetail?.user_id}</p>
            <p><b>Name:</b> {userDetail?.name}</p>
            <p><b>Email:</b> {userDetail?.email}</p>
            <p><b>Phone: </b>{userDetail?.phone}</p>
            <p><b>Role: </b>{userDetail?.role}</p>
          </DialogContent>
          <DialogActions>
            <MyButton onClick={handleCloseDetails}>Close</MyButton>
          </DialogActions>
        </Dialog>
      
      {isBookingsOpen && (
        <BookingsModal
          modalStatus={isBookingsOpen}
          closeModal={handleCloseBookingHistory}
          bookingsData={matchedBooked}
          onDelete={handleDeleteBooking}
        />
      )}

      {openDeleteModalBooking && (
        <DeleteBooking
          bookingId={deleteBookingId}
          open={openDeleteModalBooking}
          onClose={() => handleCloseDeleteModalBooking(false)}
          fetchData={getAllBooking}
          fetchAnalyticsData={getUserInfo}
        />
      )}
    </>
  );
}

export default AnalyticsHostPart;
