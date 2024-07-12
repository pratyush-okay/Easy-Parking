// Import some relevant API
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';


// Reference for axios: https://www.youtube.com/watch?v=X3qyxo_UTR4
function OTP() {

    const navigate = useNavigate();
    const [email, setEmail]=useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage]=useState('');

    const handleChange =(e) => {
      if (e.target.id ==='email'){
        setEmail(e.target.value);
      } else if (e.target.id === 'verificationCode'){
        setVerificationCode(e.target.value);
      }
    };

    // Send OTP
    const handleSendOTP =async()=>{
      try{
        const response = await axios.post('http://127.0.0.1:8000/email/otp/',{email: email});
        // Response: main sent!!!
        const data = response.data;
        if (data==="Mail sent!!!!"){
          setMessage(<p class="sentsuccess">OTP sent to your email successfully!</p>);
        }
        else{
          setMessage(<p class="sentfail">Failed to send OTP, please try again later.</p>);
        }
      }catch (error) {
        console.error('Error message：', error);
        setMessage(<p class="sentfail">Failed to send OTP, please try again later.</p>);
      }  
    };

    // Check OTP
    const handleSubmit =async() => {
      try{
        const response = await axios.post('http://127.0.0.1:8000/email/otp/check/',{otp:verificationCode});
        const data =response.data;
        if(data==="Correct OTP"){
          setMessage(<p class="sentsuccess">Correct OTP.</p>);
          setTimeout(() =>{
          navigate('/adminlogin/resetpassword');},2000); // After check OTP, user will be redirected to resetpwd page.
        }
        else{
          setMessage(<p class="sentfail">Incorrect OTP, please try again later.</p>);
        }
      }catch(error){
        console.error('Error message：', error);
        setMessage(<p class="sentfail">Incorrect OTP, please try again later.</p>);
      }
    };



  
    return (
      <div>
        <br></br>
        <div class="container">      
        <h1>Verification Code</h1>
        <div>
          <TextField id="email" label="Email" variant="outlined" value={email} onChange={handleChange} required/><br></br><br></br>
          <button class="buttonotp" onClick={handleSendOTP}>Send OTP</button>
          </div><br></br>
          <div>
          <input class="code" type='text' maxLength="6" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}/><br></br><br></br>
          <button class="button" onClick={handleSubmit}>Submit!</button>
          <Link to="/adminlogin">
          <button className="button">
          Cancel
          </button>
          </Link>
          </div>
          <div>{message}</div>
        </div>
      </div>
    );
  }
  
  export default OTP;