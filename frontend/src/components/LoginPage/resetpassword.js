import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import CustomTextField from "../CustomTextField";

// Reference for axios: https://www.youtube.com/watch?v=X3qyxo_UTR4
function ResetPwd() {
  const navigate = useNavigate();
  const state = useLocation();
  const userEmailFromLastPage = state.state.body.email; // email passed by previous page
  const [resetData, setResetData] = useState({
    email: userEmailFromLastPage || "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [pwdMismatch, setpwdMismatch] = useState(false);
  // Reference: https://www.w3schools.com/react/react_useeffect.asp
  useEffect(() => {
    setpwdMismatch(resetData.new_password !== resetData.confirm_password);
  }, [resetData.new_password, resetData.confirm_password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetData({ ...resetData, [name]: value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetData.new_password === resetData.confirm_password) {
      //add one more secure process
      try {
        const response = await axios.put("http://localhost:8000/login/reset/", {
          email: resetData.email,
          new_password: resetData.new_password,
        });
        if (response.status === 200) {
          setMessage(
            <p class="loginsuccess">Passowrd changed successfully!</p>
          );
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setMessage(<p class="loginfail">Something went wrong.</p>);
        }
      } catch (error) {
        console.error("Error message：", error);
        setMessage(<p class="loginfail">Something went wrong.</p>);
      }
    } else {
      setpwdMismatch(true);
      setMessage(
        <p class="loginfail">
          Please enter your new password twice to confirm.
        </p>
      );
    }
  };
  return (
    <>
          <div className="login-page-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="info-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginLeft: '20px' }}>
            <h1>AnyParking</h1>
            <p>Simplify your parking needs.</p>
          </div>
          <img src="/login2.png" alt="Login Visual" style={{ maxWidth: "80%", height: "auto", borderRadius: '15px' }} />
        </div>
    <div className="login-container"> {/* Add this wrapper */}
      <img src="/Anyspace_parking_logo.png" alt="Logo" className="logo" />
      
      <form onSubmit={handleResetPassword}>
        <div className="form-box">
          <h1>Reset Your Password!</h1>
          <h3>Your Email: {resetData.email}</h3>
          
            <CustomTextField
              required
              type="password"
              name="new_password"
              value={resetData.new_password}
              label="New Password"
              onChange={(e) => handleChange(e)}
            />
            <CustomTextField
              required
              type="password"
              name="confirm_password"
              value={resetData.confirm_password}
              label="Confirm Password"
              onChange={(e) => handleChange(e)}
              error={pwdMismatch}
            />
          {message && <p>{message}</p>}

          <button className="btn" type="submit">
            Reset
          </button>

          <Link to="/login">
            <button className="btn">Cancel</button>
          </Link>
        </div>
      </form>
      </div>
      </div>


    </>
  );
}
export default ResetPwd;
