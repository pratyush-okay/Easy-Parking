import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CustomTextField from "../CustomTextField";
import AlertContext from "../CustomAlert/AlertContext";
import MyButton from "../MyButton";
// Reference for axios: https://www.youtube.com/watch?v=X3qyxo_UTR4

function Login(props) {
  const navigate = useNavigate();
  const userEmail = props.userEmail;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { customAlert } = React.useContext(AlertContext);

  /* CHECK user login status, if has login redirect to main page */
  React.useEffect(() => {
    if (props.userEmail) {
      console.log("token:", userEmail);
      customAlert("You have logged in.");
      navigate("/");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginresponse = await axios.post("http://localhost:8000/login/", {
        email: email,
        password: password,
      });
      const logindata = loginresponse.data;

      if (logindata === "User Logged in successfully") {
        // store the email in local storage
        console.log(logindata);
        console.log(email);
        localStorage.setItem("UserEmail", email);
        props.setUserEmail(email);

        const response = await axios.post(
          "http://localhost:8000/user/byemail/",
          {
            email: email,
          }
        );

        console.log(JSON.parse(response.data)[0].fields.name);
        console.log(JSON.parse(response.data)[0].fields.user_type);
        console.log(JSON.parse(response.data)[0].pk);

        const allParkingResponse = await axios.get(
          "http://localhost:8000/parking/all/"
        );
        localStorage.setItem("allParkings", allParkingResponse.data);

        localStorage.setItem(
          "UserName",
          JSON.parse(response.data)[0].fields.name
        );
        localStorage.setItem(
          "UserType",
          JSON.parse(response.data)[0].fields.user_type
        );
        localStorage.setItem("UserId", JSON.parse(response.data)[0].pk);

        setMessage(
          <p className="loginsuccess">
            Welcome, you are logged in successfully! <br></br>
          </p>
        );
        setTimeout(() => {
          navigate("/");
        }, 2000); // After logged in successfully, user will be redirected to dashboard
      } else {
        setMessage(<p className="loginfail">Invalid Credentials</p>);
      }
    } catch (error) {
      console.error("Error message：", error);
      setMessage(<p className="loginfail">Invalid Credentials</p>);
    }
  };

  return (
    <>
      <div className="login-page-container">
        <div className="info-section">
          <div style={{ textAlign: "center" }}>
            <h1>AnyParking</h1>
            <p>Simplify your parking needs.</p>
          </div>
          <img src="/login2.png" alt="Login Visual" class="left-img" />
        </div>
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            <div className="form-box">
              <h1>Welcome to AnyParking!</h1>
              <CustomTextField
                type="text"
                autoFocus
                value={email}
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <CustomTextField
                type="password"
                value={password}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <MyButton type="submit" size="lg" sx={{ width: "100%" }}>
                <b>LOGIN</b>
              </MyButton>
              {message && <div>{message}</div>}
              <Link
                to="/otp"
                className="link"
                state={{ from: "login", body: {} }}
              >
                Forgot Password?
              </Link>
              <Link className="link" to="/register">
                New Member? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
