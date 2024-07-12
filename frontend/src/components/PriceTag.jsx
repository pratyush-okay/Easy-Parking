import React from "react";
import Chip from "@mui/material/Chip";

const K_WIDTH = 50;
const K_HEIGHT = 25;

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,
  textAlign: 'center',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const PriceTag = (props) => {
    return (
        <div style={greatPlaceStyle} onClick={props.onClick}>
            <Chip sx={{ width: K_WIDTH, height: K_HEIGHT }} color="primary" label={props.text} />
        </div>
    );
};
export default PriceTag;
