import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Typography } from '@mui/material';
import "./AddFavourite.css";
import AlertContext from "../../../../CustomAlert/AlertContext";

function AddFavourite({ userId,handleViewAllFavorites }) {
  const {customAlert} = React.useContext(AlertContext);
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const user_email = localStorage.getItem('UserEmail');

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAddFavourite = () => {
    const data = {
      user_email: user_email,
      location: location,
      latitude: 40.7128,
      longitude: -74.0060,
      name: name
    };

    console.log('data:', data);

    if (location === '' || name === '') {
      customAlert('Please fill in all fields');
      return;
    } else {
      try {
        axios.post('http://localhost:8000/user/fav/set', data)
          .then(response => {
            console.log('Favorite location added successfully:', response.data);
          })
          .catch(error => {
            console.error('Error adding favorite location:', error);
          });
      }
      catch (error) {
        console.error('Error adding favorite location:', error);
      }
        handleViewAllFavorites();
    }


  };

  return (
    <div className='addFavourite'>
      <Typography variant="h5" gutterBottom component="div">
        Add a new favorite location
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={handleNameChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Location"
        value={location}
        onChange={handleLocationChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddFavourite}
      >
        Add Favorite
      </Button>
      <div>
        Potentially a map on the side
      </div>
    </div>
  );
}

export default AddFavourite;

