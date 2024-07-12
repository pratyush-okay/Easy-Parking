import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "react-international-phone/style.css";
import { Grid, TextField } from '@mui/material';
import axios from 'axios';
import AlertContext from "../CustomAlert/AlertContext";
import MyButton from "../MyButton.jsx";

const Bankaccount = (props) => {
  const { customAlert } = React.useContext(AlertContext);

  const navigate = useNavigate();
  const userEmail = props.userEmail;

  const [accountNumber, setAccountNumber] = React.useState('');
  const [bsb, setBsb] = React.useState('');
  React.useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      const response = await axios.post('http://127.0.0.1:8000/banking/bank/get', {
        user_email: userEmail
      })
      console.log(response.data)
      const data = JSON.parse(response.data);
      if (data.length > 0) {
        setAccountNumber(data[0].fields.account_no);
        setBsb(data[0].fields.bsb); 
      }
    };

    fetchUserData(); // Call the function to fetch data
  });


  const [isReadOnlyAcc, setIsReadOnlyAcc] = React.useState(true); // To toggle read-only state
  const [isReadOnlyBSB, setIsReadOnlyBSB] = React.useState(true); // To toggle read-only state

  /* has NOT login, redirect to login page */
  React.useEffect(() => {
    console.log("token:", userEmail);
    if (!userEmail) {
      navigate('/login');
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault();

    if (accountNumber.toString().length !== 8 || bsb.toString().length !== 6) {
      console.log(accountNumber.toString().length, bsb.toString().length)
      customAlert('invalid length!!')
    } else {
      // Implement the save logic here
      console.log({ userEmail, accountNumber, bsb });
      const body = {
        "account_no": accountNumber,
        "bsb": bsb,
        "user_email": userEmail
      }
      axios.post('http://127.0.0.1:8000/banking/bank/set', body)
      .then(response => {
        customAlert('Account update successfully !')
      })
      .catch(error => {
        customAlert(error)
      });
  
      setIsReadOnlyAcc(true);
      setIsReadOnlyBSB(true);

    }

  };
  const handleEdit = (event) => {
    event.preventDefault();
    setIsReadOnlyAcc(false);
    setIsReadOnlyBSB(false);
  };

  return (
    <>
      <div className="PersonalInfo">
        <div className="PagePath">
          <Link className="Link" to="/profile">
            {"Profile"}
          </Link>
          &nbsp;{">"}&nbsp; Payment
        </div>
        <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
      <Grid item xs={12} sm={6} style={{ maxWidth: '100%' }}>
        <img src="/credit-card-95.png" alt="profile" className="ProfileImg" style={{ width: '100%', height: 'auto' }} />
      </Grid>
      <Grid item xs={12} sm={6}>
          <div className="BankAccount">
            <h2>Bank Account Info</h2>
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Account Number"
                    variant="outlined"
                    fullWidth
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    inputProps={{ maxLength: 8, 
                      readOnly: isReadOnlyAcc, style: {
                      backgroundColor: isReadOnlyAcc ? '#f3f3f3' : 'white',
                      color: isReadOnlyAcc ? '#686868' : 'black',
                      borderColor: isReadOnlyAcc ? '#cccccc' : '#ced4da',
                    } }} // Adjust maxLength according to your card number validation rules
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="BSB"
                    variant="outlined"
                    fullWidth
                    value={bsb}
                    onChange={(e) => setBsb(e.target.value)}
                    inputProps={{ maxLength: 6, readOnly: isReadOnlyBSB, style: {
                      backgroundColor: isReadOnlyAcc ? '#f3f3f3' : 'white',
                      color: isReadOnlyAcc ? '#686868' : 'black',
                      borderColor: isReadOnlyAcc ? '#cccccc' : '#ced4da',
                    } }}
                  />
                </Grid>

                <Grid item xs={12} >
                  <MyButton
                    onClick={handleSubmit}
                    sx={{marginRight: '10px'}}
                  >
                    Save
                  </MyButton>
                  <MyButton
                    onClick={handleEdit}
                  >
                    Edit
                  </MyButton>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      </Grid>
      </div> 
        
    </>
  );
};

export default Bankaccount;
