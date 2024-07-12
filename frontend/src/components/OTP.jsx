import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate, useLocation } from "react-router-dom";
import ApiCallPost from "../action/ApiCallPost";
import CustomTextField from "./CustomTextField";
import AlertContext from "./CustomAlert/AlertContext";
 
const otp_length = 6;
 
const getOPTValid = (otp) => {
  return otp.length === otp_length;
};
 
const OtpVerify = (props) => {
  const { customAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();
  const state = useLocation();
  const userEmail = props.userEmail;
  const fromPage = state.state.from; // accessed by which page (login/register)
  const postBody = state.state.body; // data passed by previous page
  /* for debugging
  const fromPage = 'register';
  const postBody ={
    name: 'Iris',
    email: '123.ysheep@gmail.com',
    password: '00000000',
    user_type: 'host',
    phone: '+61450890519',
    accountNumber:  "12345678",
    bsb: "123456"
  }
  */
  const [email, setEmail] = useState(""); // if otp is accessed from login page, there is a email filed let user input
  const [emailSent, setEmailSent] = useState(false); // false if no otp is sent, otherwise
  const [otpInput, setOtpInput] = useState("");
 
  /* If has login or no email passed by access page, redirect to main page */
  React.useEffect(() => {
    if (userEmail) {
      navigate(`/`);
    }
  }, [userEmail]);
 
  /* send otp email (just do when the page is accessed by register page) */
  React.useEffect(() => {
    if (fromPage === "register") {
      sendOtpEmail(postBody.email);
    }
  }, [fromPage]);
 
  React.useEffect(() => {
    console.log(postBody);
  }, []);
 
  const sendOtpEmail = async (email) => {
    const body = { email };
    const data = await ApiCallPost("email/otp/", body, "", false);
    if (data === "Mail sent!!!!") {
      // mail sent successfully
      setEmailSent(true);
    } else {
      // mail sent failed
      customAlert(data);
      if (fromPage === "register") {
        navigate("/register");
      }
    }
  };
 
  const dataPost = async (e) => {
    const registerPostStatus = await registerDataPost(e);
    console.log(registerPostStatus);
    let accountPostStatus = 1;
    if (postBody.user_type === "host" && registerPostStatus) {
      accountPostStatus = await accountInfoDataPost(e);
    } else {
      navigate("/register");
    }
    if (registerPostStatus && accountPostStatus) {
      customAlert(`Hi ${postBody.name}, Welcome to join us !`);
      navigate("/login");
    } else {
      navigate("/register");
    }
  };
 
  const registerDataPost = async (e) => {
    /* POST register data to backend */
    e.preventDefault();
    const body = {
      name: postBody.name,
      email: postBody.email,
      phone: postBody.phone,
      password: postBody.password,
      user_type: postBody.user_type,
    };
    const data = await ApiCallPost("login/register/", body, "", false);
    if (data === "user successfully registered") {
      return 1;
    } else {
      customAlert(data);
      return 0;
    }
  };
 
  const accountInfoDataPost = async (e) => {
    /* POST account info to backend */
    e.preventDefault();
    const body = {
      account_no: postBody.accountNumber,
      bsb: postBody.bsb,
      user_email: postBody.email,
    };
    const data = await ApiCallPost("banking/bank/set", body, "", false);
    if (data) {
      return 1;
    } else {
      customAlert(data);
      return 0;
    }
  };
 
  const checkOtpAndPostData = async (e) => {
    e.preventDefault();
    /* check if otp is correct */
    const body = { otp: otpInput };
    const data = await ApiCallPost("email/otp/check/", body, "", false);
    if (data === "Correct OTP") {
      // correct
      if (fromPage === "register") {
        // POST data to backend
        dataPost(e);
      } else if (fromPage === "login") {
        navigate("/login/resetpwd", { state: { body: { email: email } } }); // After check OTP, user will be redirected to resetpwd page.
      }
    } else {
      // wrong
      customAlert(data);
      navigate(`/${fromPage}`);
    }
  };
 
  return (
    <div className="login-page-container">
    <div className="info-section">
      <div style={{ textAlign: "center" }}>
        <h1>AnyParking</h1>
        <p>Simplify your parking needs.</p>
      </div>
      <img src="/login2.png" alt="Login Visual" class="left-img" />
    </div>
    <div className="login-container">
      <div className="form-box">
        <h2 className="Center">OTP Validation</h2>
 
        {/* email input (just display when the page is accessed by login page) */}
        {fromPage === "login" && emailSent === false ? (
          <>
            <div className="DescriptionBlock">
              Please type your email in. <br />
              We will send an OTP to your preferable email.
            </div>
            <CustomTextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="btn"
              type="submit"
              onClick={() => sendOtpEmail(email)} // send otp email
            >
              send OTP
            </button>
          </>
        ) : null}
 
        {/* OTP input (just display when the otp is sent successfully) */}
        {emailSent ? (
          <>
            <div className="DescriptionBlock">
              6 digits OTP have been sent to your email <br />
              {fromPage === "register" ? postBody.email : email}
              , <br />
              please check your mail and enter the code below.
            </div>
            <div className="OtpInput">
              <OtpInput
                inputType="text"
                value={otpInput}
                onChange={setOtpInput}
                numInputs={otp_length}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <button
              className="btn"
              type="submit"
              disabled={!getOPTValid(otpInput)}
              onClick={(e) => checkOtpAndPostData(e)}
            >
              Submit
            </button>
          </>
        ) : fromPage === "register" ? (
          <div className="DescriptionBlock">Email sending ....</div>
        ) : null}
 
 
      </div>
    </div>
    </div>
  );
};
 
export default OtpVerify;