import React from "react";
import ErrorMsg from "./ErrorMsg";
import CustomTextField from "./CustomTextField";

const Bankaccount = (props) => {
  const setAccountNumber = props.setAccountNumber;
  const setBsb = props.setBsb;
  const accountNumber = props.accountNumber;
  const bsb = props.bsb;

  return (
    <>
      <p>Now set up your Bank Account Info to get paid !</p>
      <CustomTextField
        label="Account Number"
        autoFocus
        required
        type="number"
        margin="dense"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />

      {accountNumber && accountNumber.toString().length !== 8 ? (
        <ErrorMsg type="AccountNumberInvalid" />
      ) : null}
      <CustomTextField
        label="BSB"
        variant="outlined"
        required
        type="number"
        margin="dense"
        value={bsb}
        onChange={(e) => setBsb(e.target.value)}
      />
      {bsb && bsb.toString().length !== 6 ? (
        <ErrorMsg type="BsbFormatInvalid" />
      ) : null}
    </>
  );
};

export default Bankaccount;
