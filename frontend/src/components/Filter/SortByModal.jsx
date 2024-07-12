import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function SortByModal({isOpen, onClose, onApplySortBy}) {
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('ascending');

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
  };

  const handleApplySortBy = () => {
    onApplySortBy({
      sortBy,
      order,
    });
    onClose();
  };

  return (
    <div>
      <Dialog onClose={onClose} open={isOpen}>
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <DialogTitle>Sort Options</DialogTitle>
        <List>
          <ListItem>
            <RadioGroup value={sortBy} onChange={handleSortChange}>
              <FormControlLabel value="price" control={<Radio />} label="Price" />
              <FormControlLabel value="rating" control={<Radio />} label="Rating" />
              <FormControlLabel value="distance" control={<Radio />} label="Distance" />
            </RadioGroup>
          </ListItem>
          <ListItem>
            <Box sx={{ pt: 2 }}>
              <RadioGroup row value={order} onChange={handleOrderChange}>
                <FormControlLabel value="ascending" control={<Radio />} label="Ascending" />
                <FormControlLabel value="descending" control={<Radio />} label="Descending" />
              </RadioGroup>
            </Box>
          </ListItem>
        </List>

        <Button onClick={handleApplySortBy} variant="contained" sx={{ mt: 2 }}>
          Apply SortBy
        </Button>
      </Dialog>
    </div>
  );
}

export default SortByModal;
