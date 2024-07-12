import React from 'react';
import { Checkbox, FormControlLabel, FormGroup, Typography, Box } from '@mui/material';

function AmenityCheckSection({checked, setChecked}) {
  
    const handleChange = (event) => {
      setChecked({ ...checked, [event.target.name]: event.target.checked });
    };
  
    return (
      <Box sx={{ width: '100%', maxWidth: 300, bgcolor: 'background.paper', p: 2, borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Amenities
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={checked.disability} onChange={handleChange} name="disability" />}
            label="Disability Access"
          />
          <FormControlLabel
            control={<Checkbox checked={checked.access247} onChange={handleChange} name="access247" />}
            label="24/7 Access"
          />
          <FormControlLabel
            control={<Checkbox checked={checked.cctv} onChange={handleChange} name="cctv" />}
            label="CCTV"
          />
          <FormControlLabel
            control={<Checkbox checked={checked.evCharging} onChange={handleChange} name="evCharging" />}
            label="EV Charging"
          />
          <FormControlLabel
            control={<Checkbox checked={checked.combinationLock} onChange={handleChange} name="combinationLock" />}
            label="Combination Lock"
          />
          <FormControlLabel
            control={<Checkbox checked={checked.carwash} onChange={handleChange} name="carwash" />}
            label="Car Wash"
          />
          <FormControlLabel
            control={<Checkbox checked={checked.securityGate} onChange={handleChange} name="securityGate" />}
            label="Security Gate"
          />
        </FormGroup>
      </Box>
    );
  }
  
  export default AmenityCheckSection;