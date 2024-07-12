import * as React from 'react';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

function PaymentConfirm() {

return(
<div>
    <Box>
    <h1>Your Booked Parking Space Information </h1>
    <h2>Please check your booked information before making a payment!</h2>
    <h3>Host Email: john@example.com <p></p>Location: 123 Main Street, Sydney, NSW <p></p>
    Spot Type: garage <p></p> Status: private <p></p> Features: Disabled accessible, security cameras installed.<p></p>
    Your Booking Duration: 5 Hours<p></p>
    Total Price: 50 AUD<p></p>
    </h3>
    </Box>
    <Link to="/payment">    
    <button className="button">
        Proceed to Pay
    </button></Link>
    <Link to="/booking">
    <button className="button">
        Cancel
    </button></Link>
    </div>
);
}

export default PaymentConfirm
