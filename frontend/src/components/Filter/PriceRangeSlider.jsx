import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';


function PriceRangeSlider({value, setValue}) {
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    // Custom styles for the Slider
    const sliderStyle = {
      color: 'primary.main', // Use MUI's color palette
      height: 8,
      '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active': {
          boxShadow: 'inherit',
        },
      },
      '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: 'primary.main',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
          transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
          transform: 'rotate(45deg)',
        },
      },
    };
  
    return (
      <Box width={300} sx={{flexDirection: 'row'}} >
        <Typography id="range-slider" gutterBottom>
          Price Range
        </Typography>
        <Slider
          getAriaLabel={() => 'Price range'}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          min={0}
          max={100}
          style={sliderStyle}
        />
      </Box>
    );
  }
  
export default PriceRangeSlider;