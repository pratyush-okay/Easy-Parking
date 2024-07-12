import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chip, Stack } from '@mui/material';

const FavoriteLocationsList = ({handleSelectedFavourite,userEmail}) => {
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  useEffect(() => {
    const fetchFavoriteLocations = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/user/fav/get', {
          user_email: userEmail,
        });
        setFavoriteLocations(JSON.parse(response.data));
      } catch (error) {
        console.error('Failed to fetch favorite locations:', error);
      }
    };

    fetchFavoriteLocations();
  }, [userEmail]); // Ensure userEmail is a dependency so useEffect runs if userEmail changes

  return (
    <Stack direction="row" spacing={1}>
      {favoriteLocations.map((location) => (
        <Chip
          key={location.pk}
          label={location.fields.name}
          variant="outlined"
          color="primary"
          size="small" // Make the chip smaller
          sx={{ fontSize: '0.75rem' }} // Adjust the font size within the chip
          onClick={() => handleSelectedFavourite({lat: location.fields.latitude, lng: location.fields.longitude})}
        />
      ))}
    </Stack>
  );
};

export default FavoriteLocationsList;
