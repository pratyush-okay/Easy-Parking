import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const SearchBar = ({setSelectedSearch}) => {
  const [currentAddr, setCurrentAddr] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Function to fetch autocomplete suggestions
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`https://us1.locationiq.com/v1/autocomplete.php?key=pk.504d44009c3f2a304b814266e5430e4c&q=${currentAddr}&limit=5`);
      setSuggestions(response.data);
      setAnchorEl(document.getElementById('input-base')); // Adjusted anchor element
    } catch (error) {
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setCurrentAddr(e.target.value);
  };

  // Handle search button click
  const handleSearch = () => {
    // Fetch suggestions only when search button is clicked
    fetchSuggestions();
  };

  // Handle selection from autocomplete
  const handleSelectSuggestion = (suggestion) => {
    // Do something with the selected suggestion
    setSelectedSearch({coord: {lat: suggestion.lat, lng: suggestion.lon}});
    setCurrentAddr(suggestion.display_name); // Optionally, you can update the input field with the selected suggestion
    setAnchorEl(null); // Close the dropdown after selection
  };

  return (
    <Paper
      component="form"
      sx={{ m: "3px", p: "3px", display: "flex", alignItems: "center"}}
      fullWidth
      className="query-bar"
    >
      <InputBase
        id="input-base" // Added id for the input base
        sx={{ ml: 1, flex: 1 }}
        placeholder="Address, Suburb or City"
        value={currentAddr}
        onChange={handleInputChange}
      />
      <Button sx={{ p: "10px", color: "#0b4f8b" }} onClick={handleSearch} id="search-button">
        Search
      </Button>
      {/* Display dropdown with autocomplete suggestions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          marginTop: '12px', // Add margin top
          marginLeft: '0px', // Remove margin left
        }}
        getContentAnchorEl={null}
      >
        {suggestions.map((suggestion, index) => (
          <MenuItem key={index} onClick={() => handleSelectSuggestion(suggestion)}>
            {suggestion.display_name}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default SearchBar;
