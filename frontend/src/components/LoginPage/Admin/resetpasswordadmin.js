// Import some relevant API
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

// Reference for axios: https://www.youtube.com/watch?v=X3qyxo_UTR4
function ResetPwd(){
  const navigate =useNavigate();
  const [resetData, setResetData] =useState({
    email: localStorage.getItem('resetEmail')||'',
    new_password:'',
    confirm_password: '',
  });
  const [message, setMessage] =useState('');
  const [pwdMismatch, setpwdMismatch]=useState(false);
  // Reference: https://www.w3schools.com/react/react_useeffect.asp
  useEffect(()=>{
    setpwdMismatch(resetData.new_password!==resetData.confirm_password);},
    [resetData.new_password,resetData.confirm_password]);

  const handleChange =(e) =>{
    const {name, value}=e.target;
    setResetData({...resetData, [name]: value}); 
  };

  const handleResetPassword= async(e) =>{
    e.preventDefault();
    if (resetData.new_password ===resetData.confirm_password){ //add one more secure process
      try{
        const response =await axios.put("http://localhost:8000/login/reset/",{
          email:resetData.email,
          new_password: resetData.new_password,
        });
        if (response.status ===200){
          setMessage(<p class="loginsuccess">Passowrd changed successfully!</p>);
          setTimeout(()=>{
            navigate('/admindashboard');
          },2000);
        }else{
          setMessage(<p class="loginfail">Something went wrong.</p>);
        }
      }catch(error){
        console.error('Error message：', error);
        setMessage(<p class="loginfail">Something went wrong.</p>);
    }
    }else{
      setpwdMismatch(true); 
      setMessage(<p class="loginfail">Please enter your new password twice to confirm.</p>);
    }
  };
  return(
    <div>
      <div class="container">
        <h1>Reset Your Password!</h1>
        <h3>Your Email: {resetData.email}</h3>
        <form onSubmit={handleResetPassword}>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '40ch' },
            }}
            noValidate
            autoComplete="off"
          >
       
        <TextField input type ="password" name="new_password" value={resetData.new_password} label="New Password" onChange={handleChange} required /> <br></br>
        <TextField input type ="password" name="confirm_password" value={resetData.confirm_password} label="Confirm Password" onChange={handleChange} required error={pwdMismatch}/> <br></br>
          </Box>
          {message && <p>{message}</p>}
          <Button class="button" type="submit">
            Reset
          </Button>
          <Link to="/adminlogin">
          <Button class="button">
            Cancel
          </Button>
          </Link>
        </form>
      </div>
    </div> 
  );
}
export default ResetPwd;
