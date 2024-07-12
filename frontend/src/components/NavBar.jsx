import React from "react";
import UserIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { Dropdown, Navbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ApiCallPost from "../action/ApiCallPost";
import LogoutAuto from "./LogoutAuto.jsx";
import LogoutCheckModal from "./LogoutCheckModal.jsx";
import MyButton from "./MyButton.jsx";

const NavBar = (props) => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [userType, setUserType] = React.useState("none");
  const [modalState, setModalState] = React.useState(false);
  const [logoutType, setLogoutType] = React.useState("click"); // click / auto

  const userEmail = props.userEmail;
  

  const pages = {
    guest: {
      "My Bookings": "/bookings",
    },
    host: {
      "Create New Listing": "/parking/create",
      "My Listings": "/provider/dashboard",
      "Analytics": "/provider/analytics",
    },
    admin: {
      "Analytics": "/admin/analytics",
    },
    none: {
    },
  };

  React.useEffect(() => {
    if (userEmail) {
      getPersonalInfo();
    }
  });

  const handleClose = () => {
    setModalState(false);
  };

  /* get peronal info from backend (GET) */
  const getPersonalInfo = async () => {
    const body = { email: userEmail };
    const data = await ApiCallPost("user/byemail/", body, "", false);
    if (data) {
      const dataName = JSON.parse(data)[0].fields.name;
      const role = JSON.parse(data)[0].fields.user_type;
      setName(dataName);
      setUserType(role);
    }
  };

  const handleLogoutClick = () => {
    setLogoutType("click");
    setModalState(true);
  };


  return (
    <div className="navbar-border navbar-fix">
      <Navbar fluid rounded>
        {/* 1st Part - Title */}
        <Navbar.Brand>
          <Link to="/" className="flex items-center space-x-2">
            {/* If you're uncommenting the CarIcon, make sure it has appropriate styling to fit your needs */}
            {/* <CarIcon className="mr-3 h-6 sm:h-9"/> */}
            <img
              src="/Anyspace_parking_logo.png"
              alt="car"
              className="h-8 sm:h-10"
            />
            <span className="self-center whitespace-nowrap text-xl dark:text-white">
              AnyParking
            </span>
          </Link>
        </Navbar.Brand>

        {/* 2nd Part - Pages */}
        <Navbar.Collapse style={{ flexGrow: 0.9 }}>
          {Object.entries(pages[userType]).map(([key, value]) => {
            return (
              <Link to={value} key={key}>
                <Navbar.Link active>{key}</Navbar.Link>
              </Link>
            );
          })}
        </Navbar.Collapse>

        {/* 3rd Part - User Icon */}
        <div className="flex md:order-2">
          {userEmail ? (
            /* has logged in */
            <>
              <Dropdown
                arrowIcon={false}
                inline
                label={<UserIcon className="mr-3 h-6 sm:h-9" />}
              >
                <Dropdown.Header>
                  <span className="block text-sm">
                    {name} ({userType})
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {props.userEmail}
                  </span>
                </Dropdown.Header>
                <Link to="/profile">
                  <Dropdown.Item>Your Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />

                <Dropdown.Item>
                  <MyButton
                    onClick={() => handleLogoutClick()}
                    className="padding-0"
                  >
                    Sign out
                  </MyButton>
                </Dropdown.Item>
              </Dropdown>
              <Navbar.Toggle />
            </>
          ) : (
            /* hasn't logged in */
            <>
              <Navbar.Collapse>
                  <MyButton
                    onClick={() => {navigate('/login')}}
                  >
                    Log in
                  </MyButton>
                  <MyButton
                    onClick={() => {navigate('/register')}}
                    variant='outlined'
                  >
                    Sign up
                  </MyButton>
              </Navbar.Collapse>
            </>
          )}
        </div>
      </Navbar>

      {userEmail ? (
        /* has logged in, check duration of inactivity (auto logout) */
        <LogoutAuto
          setModalState={setModalState}
          setLogoutType={setLogoutType}
        />
      ) : null}
      <LogoutCheckModal
        setUserEmail={props.setUserEmail}
        setUserType={setUserType}
        open={modalState}
        handleClose={handleClose}
        logoutType={logoutType}
        userType={userType}
        userEmail={userEmail}
      />
    </div>
  );
};

export default NavBar;
