import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

function ParkingTypeFilter({parkingTypes, setParkingTypes}) {

    const handleChange = (event) => {
      setParkingTypes({
        ...parkingTypes,
        [event.target.name]: event.target.checked,
      });
    };
  
    return (
      <Box sx={{ width: '100%', maxWidth: 300, bgcolor: 'background.paper', p: 2, borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
            Parking Type
        </Typography>
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={parkingTypes.covered} onChange={handleChange} name="covered" />
              }
              label="Covered Parking"
            />
            <FormControlLabel
              control={
                <Checkbox checked={parkingTypes.uncovered} onChange={handleChange} name="uncovered" />
              }
              label="Uncovered Parking"
            />
            <FormControlLabel
              control={
                <Checkbox checked={parkingTypes.driveway} onChange={handleChange} name="driveway" />
              }
              label="Driveway Parking"
            />
            <FormControlLabel
              control={
                <Checkbox checked={parkingTypes.garage} onChange={handleChange} name="garage" />
              }
              label="Lockup Garage"
            />
          </FormGroup>
        </FormControl>
      </Box>
    );
  }

  export default ParkingTypeFilter;
  