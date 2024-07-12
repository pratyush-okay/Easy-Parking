import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
});

const CustomTextField = (props) => {
  return (
      <CssTextField
        label={props.label}
        required={props.required}
        autoFocus={props.autoFocus}
        type={props.type}
        margin="dense"
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        error={props.error}
        name={props.name}
      />
  );
}

export default CustomTextField;