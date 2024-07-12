// Import some relevant API
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';



// NavigationBar
function Layout(){
    return(
        <div class="header">
            <h1 class="brandname">AnySpace</h1>
            <h2 class="navigationbar">
                <ul>
                    <li><Link to ='/adminlogin' class="navigationBarlink"> Home </Link></li>
                    <li><Link to ='/admindashboard' class="navigationBarlink"> Dashboard </Link></li>
                </ul>   
            </h2>
        </div>
    );
}


// Resetpassword
function Forgotpassword(){
  return(
    <Link to="/adminlogin/OTP" class = "resetPwdlink"> Forgot Password?
   </Link>
      
  );
}

// Reference for axios: https://www.youtube.com/watch?v=X3qyxo_UTR4
function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] =useState('');

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const response = await axios.post("http://localhost:8000/login/",
      {
        email: email,
        password: password,
      });
      const data = response.data;

      if (data ==="User Logged in successfully") {
        setMessage(<p class="loginsuccess">Welcome, you are logged in successfully! <br></br></p>);
        setTimeout(() =>{
          navigate('/admindashboard');},2000); // After logged in successfully, admin will be redirected to dashboard
      } 
      else {
        setMessage(<p class="loginfail">Invalid Credentials</p>);
    
      }
    } catch (error) {
      console.error('Error message：', error);
      setMessage(<p class="loginfail">Invalid Credentials</p>);
    }
  };

  return(
    <div>
    <Layout/>
   
    <div class="container">
    
    <br></br>
    <form onSubmit={handleSubmit}>
    <h1>Welcome to AnySpace Management System !</h1>
    <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '40ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField input type="text" value ={email} label="Email" variant="outlined" onChange={(e) => setEmail(e.target.value)} required /><br></br>
        <TextField input type="password" value ={password} label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)}required/><br></br>
        <Forgotpassword/>
      </Box><br></br>
      <button class="button" type="submit"> 
      Login
      </button>
    </form>
    {message && <p> {message}</p>}
    </div>
    </div>
  );
}

export default Login;

