import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AlertContext from "../CustomAlert/AlertContext";
import MyButton from "../MyButton";
import CircularCountdownTimer from "./PaymentTimer";

export default function PaymentSection() {
  const { customAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();
  const location = useLocation();
  const booking_details = location.state.booking_details;
  console.log(booking_details);
  const UserEmail = localStorage.getItem("UserEmail");
  console.log(UserEmail);

  // Example total spending amount
  const totalSpending = booking_details.price;

  // Consumer message
  const message = ` Please check the payment receipt from AnyParking:

      Parking Location:  ${booking_details.location}
      Parking Description:  ${booking_details.description}
      Booking Duration:  ${booking_details.start_date} ${booking_details.start_time} to ${booking_details.end_date} ${booking_details.end_time}
      Total Price:  $${totalSpending} AUD
  `;
  // Provider message
  // Get consumer phone number
  const [consumerPhoneNumber, setConsumerPhoneNumber] = React.useState("");
  const getPhoneNumber = async () => {
    try {
      const phonenumresponse = await axios.post(
        "http://localhost:8000/user/byemail/",
        {
          email: UserEmail,
        }
      );

      //console.log(JSON.parse(phonenumresponse.data)[0].fields.phone);
      setConsumerPhoneNumber(JSON.parse(phonenumresponse.data)[0].fields.phone);
    } catch (error) {
      console.error("Error getting phone number:", error);
    }
  };
  React.useEffect(() => {
    getPhoneNumber();
  });

  const messageprovider = ` Please check the payment receipt and consumer's information from AnyParking:

      Consumer Name: ${UserEmail}
      Consumer Phone Number: ${consumerPhoneNumber}
      Parking Location:  ${booking_details.location}
      Parking Description:  ${booking_details.description}
      Booking Duration:  ${booking_details.start_date} ${booking_details.start_time} to ${booking_details.end_date} ${booking_details.end_time}
      Total Price:  $${totalSpending} AUD
`;
  console.log("booking_details:", booking_details);
  console.log(messageprovider);

  console.log(message);

  console.log(UserEmail);
  const [holder_name, setHolder_name] = React.useState("John Doe");
  const [account_no, setAccount_no] = React.useState("4929382976541035");
  const [exp, setExp] = React.useState("2027-09-15");
  const [cvv, setCvv] = React.useState("123");

  const handleHolerName = (e) => {
    setHolder_name(e.target.value);
  };
  const handleAccount = (e) => {
    setAccount_no(e.target.value);

  };
  const handleExp = (e) => {
    setExp(e.target.value);
  };
  const handleCvv = (e) => {
    setCvv(e.target.value);
  };

  const handlePayment = () => {
    const UserName = localStorage.getItem("UserName");
    console.log({ account_no, UserName, exp, cvv });
    if(account_no.length !== 16) {
      customAlert('The card number must be 16 digits!', 'Warning' )
    } else if (cvv.length !== 3) {
      customAlert('The cvv must be 3 digits!', 'Warning:' )
    } else {
      // verify sender card info (acc, expdate, cvv)
      axios
        .post("http://127.0.0.1:8000/banking/card/verify", {
          card_number: account_no,
          card_holder_name: holder_name,
          expiration_date: exp,
          cvv: cvv,
        })
        .then((response) => {
          console.log(response.data);
          // if verified, transfer
          axios
            .post("http://127.0.0.1:8000/banking/transfer/", {
              sender_card: account_no,
              receiver_email: booking_details.host_email,
              amount: booking_details.price,
            })
            .then((response) => {
              console.log(response.data);
              const data = {
                user_email: UserEmail,
                parking_id: booking_details.parking_id,
                start_date: booking_details.start_date,
                end_date: booking_details.end_date,
                start_time: booking_details.start_time,
                end_time: booking_details.end_time,
                price: booking_details.price,
              };
              // Upon pay successfully, create a booking
              axios
                .post("http://127.0.0.1:8000/booking/create/", data)
                .then((response) => {
                  console.log(response.data);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
  
              // Upon pay successfully, send receipt email
              axios.post("http://127.0.0.1:8000/email/receipt/", {
                message: message,
                email: UserEmail,
              });
              // Upon pay successfully, send receipt email to provider
              axios
                .post("http://127.0.0.1:8000/email/notification/", {
                  message: messageprovider,
                  email: booking_details.host_email,
                })
  
                .then((response) => {
                  console.log(response.data);
                  customAlert("Payment Success !");
                  navigate("/bookings");
                })
                .catch((error) => {
                  customAlert("Error:", error.message);
                });
            })
            .catch((error) => {
              customAlert(error.response.data);
            });
        })
        .catch((error) => {
          customAlert(error.response.data);
        });
    }
  };

  const handleTimerExpire = () => {
    customAlert(
      "The time limit gives all user a fair chance at spots. Try book again now.",
      "Sorry ... Time is up."
    );
    // Navigate away from the payment page or refresh the booking
    navigate("/"); // Update this with the appropriate path
  };

  return (
    <view
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ maxWidth: 400, m: 2 }}>
        <CardContent>
          {/* <view
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: " red",
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Payment Details
            </Typography>
            <CircularCountdownTimer onExpire={handleTimerExpire} />
          </view> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Payment Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularCountdownTimer onExpire={handleTimerExpire} />
              <Typography
                variant="body2" // Smaller text variant
                sx={{ mb: 0, color: "#666666", fontSize: "0.6rem" }}
              >
                Complete payment in
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Spending: ${totalSpending.toFixed(2)}
          </Typography>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              label="Card Holder Name"
              variant="outlined"
              value={holder_name}
              onChange={handleHolerName}
            />
            <TextField
              required
              id="sender"
              label="Card Number"
              variant="outlined"
              onChange={handleAccount}
              value={account_no}
            />

            <TextField
              required
              id="expiry-date"
              label="Expiry Date"
              onChange={handleExp}
              value={exp}
            />
            <TextField
              required
              id="cvv"
              label="CVV"
              variant="outlined"
              type="password"
              value={cvv}
              onChange={handleCvv}
            />
          </Box>
          <MyButton onClick={handlePayment}>Submit Payment</MyButton>
        </CardContent>
      </Card>
    </view>
  );
}
