import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PriceRangeSlider from './PriceRangeSlider';
import DistanceRangeSlider from './DistanceRangeSlider';
import AmenityCheckSection from './AmenityCheckSection';
import ParkingTypeFilter from './ParkingTypeFilter';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const FilterModal = ({ isOpen, onClose, onApplyFilters, setIsFilterApply }) => {
  const [price, setPrice] = useState([0, 100]); // Default range
  const [distance, setDistance] = useState([0, 100]);
  const [checked, setChecked] = useState({
    disability: false,
    access247: false,
    cctv: false,
    evCharging: false,
    combinationLock: false,
    carwash: false,
    securityGate: false
  });
  const [parkingTypes, setParkingTypes] = useState({
    covered: true,
    uncovered: true,
    driveway: true,
    garage: true,
  });
  const [filterCarAuto, setFilterCarAuto] = React.useState(false);
  const handleFilterCarAutoChange = (event) => {
    setFilterCarAuto(event.target.checked);
  };

  const handleCancelFilters = () => {
    setIsFilterApply(false);
    setParkingTypes({
      covered: false,
      uncovered: false,
      driveway: false,
      garage: false,
    })

    setChecked({
      disability: false,
      access247: false,
      cctv: false,
      evCharging: false,
      combinationLock: false,
      carwash: false,
      securityGate: false
    });
    onClose();
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      price,
      distance,
      checked,
      parkingTypes,
      filterCarAuto
    });
    setIsFilterApply(true);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h5" component="h1" sx={{p: "1rem 0"}}>
          Filter Options
        </Typography>
        <Box sx={{display: 'flex', gap: 3}}>
          <PriceRangeSlider value={price} setValue={setPrice}/>
          <DistanceRangeSlider value={distance} setValue={setDistance}/>
        </Box>
        <Box sx={{display: 'flex', gap: 3}}>
          <ParkingTypeFilter parkingTypes={parkingTypes} setParkingTypes={setParkingTypes}/>
          <AmenityCheckSection checked={checked} setChecked={setChecked}/>
        </Box>
        {/*********** filter (car temporarily) ***********/}
        <Stack direction="row" spacing={1} alignItems="center" sx={{height: '6%', borderBottom: '1px solid #e5e5e5'}}>
          &nbsp;&nbsp;&nbsp;Car Details Auto Filter:&nbsp;&nbsp;
          <Typography>Off</Typography>
          <Switch
            defaultChecked
            color="warning"
            checked={filterCarAuto}
            onChange={handleFilterCarAutoChange}/>
          <Typography>On</Typography>
        </Stack>
        <Button onClick={handleApplyFilters} variant="contained" sx={{ mt: 2, mr: 2 }}>
          Apply
        </Button>
        <Button onClick={handleCancelFilters} variant="contained" sx={{ mt: 2 }}>
          Clear
        </Button>
      </Box>
    </Modal>
  );
};

export default FilterModal;