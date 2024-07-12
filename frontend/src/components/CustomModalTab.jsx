import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: 'black',
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: '#cccccc',
  '&:hover': {
    color: '#999999',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: 'black',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'black',
  },
}));


export default function CustomizedTabs(props) {
  const currentTab = props.currentTab;
  const setCurrentTab = props.setCurrentTab;
  const tabs = props.tabs; // all of the tabs on the modal (type: dict) (passed by CustomModal.jsx)

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%'}}>
      <Box sx={{ bgcolor: '#fff' }}>
        <AntTabs 
          value={currentTab}
          onChange={handleChange} 
        >
          { Object.entries(tabs).map(([key, value]) => {
            return <AntTab value={key} label={value} />
          })}
        </AntTabs>
      </Box>
    </Box>
  );
}
