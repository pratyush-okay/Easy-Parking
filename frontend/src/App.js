import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AlertProvider from './components/CustomAlert/AlertProvider.js';

//import Favourites from './components/Favourites/FavouritesHome'
// import Landingscreen from './pages/Landingscreen.jsx'
// import BookingSection from "./components/Book/BookingSection.jsx";
import OtpVerify from "./components/OTP.jsx";
import Profile from "./components/Profile/Profile.js";
import Register from "./components/Register.jsx";
import PersonalInfo from "./components/Profile/PersonalInfo";
import BankAccount from "./components/Profile/BankAccount.jsx"

import Login from "./components/LoginPage/login";
import ResetPwd from "./components/LoginPage/resetpassword";
import Resetpasswordadmin from "./components/LoginPage/Admin/resetpasswordadmin";
import Dashboard from "./components/Dashboard/DashBoard.js";
import Dashboardadmin from "./components/Dashboard/DasboardAdmin/DashBoardAdmin.js";
import Adminlogin from "./components/LoginPage/Admin/loginadmin";
import AdminOTP from "./components/LoginPage/Admin/OTPadmin";
import PaymentSection from "./components/Pay/PaymentSection.jsx";
import PaymentConfirm from "./components/Pay/PaymentConfirm";
import CreateASpace from "./components/CreateListing_asProvider/CreateASpace.jsx";
// import ViewListingDetailScreen from "./components/ViewListingDetail/ViewListingDetailScreen.jsx";
import NavBar from "./components/NavBar.jsx";
import CarDetails from "./components/Profile/CarDetails/PersonalCarDetails.js";
import AddCarDetails from "./components/Profile/CarDetails/AddCarDetails.js";
import ConsumerAllListings from "./components/Profile/ProfileConsumer/ConsumerAllListings/ConsumerAllListings.js";
import DashboardProvider from "./components/Dashboard/DashboardProvider/DashboardProvider.js";
import CarDetailsFilter from "./components/Profile/CarDetails/CarDetailsFilter.js";
import ProviderAnalytics from "./components/Analytics/Provider/Analytics.jsx";
import AdminAnalytics from "./components/Analytics/Admin/Analytics.jsx";
import Favourites from "./components/Profile/ProfileConsumer/Favourites/Favourites.jsx";
import ApiCallPost from "./action/ApiCallPost";
import AdminAnalyticsGuest from "./components/Analytics/Admin/AnalyticsGuestPart.jsx";
import AdminAnalyticsHost from "./components/Analytics/Admin/AnalyticsHostPart.jsx";
import AdminAnalyticsOverall from "./components/Analytics/Admin/AnalyticsOverallPart.jsx";
import DashboardVisitor from "./components/Dashboard/DashboardVisitor/DashboardVisitor.jsx"
import axios from "axios";

const App = () => {
  const [userType, setUserType] = React.useState(null);
  const [userEmail, setUserEmail] = React.useState(
    localStorage.getItem("UserEmail")
  );

  React.useEffect(() => {
    axios.get("http://localhost:8000/parking/all/")
    .then((response)=>{
      localStorage.setItem('allParkings', response.data);
    })
    console.log("token:", userEmail);
    const checkUserEmail = localStorage.getItem("UserEmail");
    if (checkUserEmail) {
      setUserEmail(checkUserEmail);
      getPersonalInfo(checkUserEmail);
    }
  }, [userEmail]);

   /* get peronal info from backend (GET) */
   const getPersonalInfo = async (email) => {
    const body = { email:email };
    const data = await ApiCallPost("user/byemail/", body, "", false);
    if (data) {
        const role = JSON.parse(data)[0].fields.user_type;
        setUserType(role);
    }
  };

  return (
    <BrowserRouter>
      <AlertProvider>

        <NavBar userEmail={userEmail} setUserEmail={setUserEmail} />

        <div className="main">
          <Routes>
            <Route path="/payment" element={<PaymentSection />} />
            <Route path="/paymentconfirm" element={<PaymentConfirm />} />

            {/* BOOKING (MAIN PAGE) */}
            { userType === 'host'
              ? <Route path="/" element={<DashboardProvider />} />
              : (userType === 'guest' ? <Route path="/" element={<Dashboard userEmail={userEmail}/>} />
              : (<Route path="/" element={<DashboardVisitor />} />)
            )}
            

            <Route path="/bookings" element={<ConsumerAllListings userEmail={userEmail}/>} />
            <Route path="/map" element={<Dashboard userEmail={userEmail} userType={userType}/>} />
            <Route path="/filtercardetails" element={<CarDetailsFilter userEmail={userEmail}/>}/>

            {/* PROFILE */}
            <Route path="/profile" element={<Profile userEmail={userEmail} />} />
            <Route
              path="/profile/personalinfo"
              element={<PersonalInfo userEmail={userEmail} />}
            />
            <Route
              path="/profile/bankaccount"
              element={<BankAccount userEmail={userEmail} />}
            />
            <Route
              path="/profile/cardetails"
              element={<CarDetails userEmail={userEmail} />}
            />

            <Route path="/profile/favourites" element={<Favourites userEmail={userEmail} />} />
            <Route
              path="/profile/addcardetails"
              element={<AddCarDetails userEmail={userEmail} />}
            />

            {/* REGISTER */}
            <Route
              path="/register"
              element={<Register userEmail={userEmail} />}
            />
            <Route path="/otp" element={<OtpVerify userEmail={userEmail} />} />

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                <Login userEmail={userEmail} setUserEmail={setUserEmail} />
              }
            />
            <Route path="/adminlogin/OTP" element={<AdminOTP />} />
            <Route path="/login/resetpwd" element={<ResetPwd />} />

            {/* ADMIN */}
            <Route path="/adminlogin" element={<Adminlogin />} />
            <Route
              path="/adminlogin/resetpassword"
              element={<Resetpasswordadmin />}
            />
            <Route path="/admindashboard" element={<Dashboardadmin />} />
            <Route path="/parking/create" element={<CreateASpace />} />
            <Route path="/provider/dashboard" element={<DashboardProvider />} />
            <Route path="/provider/analytics" element={<ProviderAnalytics userEmail={userEmail} />} />

            {/* ADMIN */}
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/analytics/guest" element={<AdminAnalyticsGuest />} />
            <Route path="/admin/analytics/host" element={<AdminAnalyticsHost />} />
            <Route path="/admin/analytics/overall" element={<AdminAnalyticsOverall />} />

            {/*
            <Route path="/parking/byid" element={<ViewListingDetailScreen />} />

            {/* 
            <Route path="/" element={<Landingscreen token{token} setToken={setToken}/>}/>
            <Route path="/:id" element={<Landingscreen token={token} setToken={setToken}/>}/>
            <Route path="/dashboard/:subRoute" element={<Dashboard token={token} setToken={setToken}/>}/>
            <Route path="/dashboard/:subRoute/:id" element={<Dashboard token={token} setToken={setToken}/>}/>
            */}
          </Routes>
        </div>

      </AlertProvider>
    </BrowserRouter>
  );
};
export default App;
