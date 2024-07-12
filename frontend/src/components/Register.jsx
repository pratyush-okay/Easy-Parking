import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import validator from "validator";
import Radio from "@mui/material/Radio";
import ErrorMsg from "./ErrorMsg";
import CustomTextField from "./CustomTextField";
import RegisterBankAccount from "./RegisterBankAccount.jsx";
import MyButton from "./MyButton";

const validatePhoneNumber = (number) => {
  const isValidPhoneNumber = validator.isMobilePhone(number);
  return isValidPhoneNumber;
};

function Register(props) {
  const navigate = useNavigate();
  const userEmail = props.userEmail;
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState(userEmail);
  const [password, setPassword] = React.useState({
    value: "",
    isTouched: false,
  });
  const [passwordConfirmed, setPasswordConfirmed] = React.useState("");
  const [phonenum, setPhonenum] = React.useState({
    value: "",
    isTouched: false,
  });
  const [role, setRole] = React.useState("guest");
  const [page, setPage] = React.useState(0); // 0: register, 1: card details (if role is provider)
  const [accountNumber, setAccountNumber] = React.useState("");
  const [bsb, setBsb] = React.useState("");

  /* CHECK user login status, if has login redirect to main page */
  React.useEffect(() => {
    console.log("token:", userEmail);
    if (userEmail) {
      navigate("/");
    }
  });

  /* CHECK form value ( 0: invalid, 1: valid ) */
  const getIsFormValid = () => {
    if (page === 0) {
      return (
        name &&
        password.value.length >= 8 &&
        password.value === passwordConfirmed &&
        validatePhoneNumber(phonenum.value) &&
        email
      );
    } else {
      return (
        accountNumber.toString().length === 8 && bsb.toString().length === 6
      );
    }
  };

  /* REDIRECT to otp page */
  const navgateToOtpPage = (e) => {
    e.preventDefault();
    let body;
    if (role === "guest") {
      // if enroll as a guest ...
      body = {
        name,
        email,
        phone: phonenum.value,
        password: password.value,
        user_type: role,
      };
    } else {
      // if enroll as a provider ...
      body = {
        name,
        email,
        phone: phonenum.value,
        password: password.value,
        user_type: role,
        // also pass account info
        accountNumber: accountNumber,
        bsb: bsb,
      };
    }
    navigate("/otp", { state: { from: "register", body } });
  };

  /* either next page (just for provider) or redirect to otp page (for provider and consumer) */
  const handleContinue = (e) => {
    e.preventDefault();
    if (role === "guest") {
      if (page === 0) navgateToOtpPage(e);
    } else if (role === "host") {
      if (page === 0) setPage(1);
      else navgateToOtpPage(e);
    }
  };

  return (
    <>
      <div className="login-page-container">
        <div className="info-section">
          <div style={{ textAlign: "center" }}>
            <h1>AnyParking</h1>
            <p>Simplify your parking needs.</p>
          </div>
          <img src="/login2.png" alt="Login Visual" class="left-img" />
        </div>
        <div className="login-container">
          <form onSubmit={(e) => handleContinue(e)}>
            <div className="form-box">
              <h2>Sign Up</h2>
              {page === 0 ? (
                <>
                  {/* register form */}
                  <div className="Row">
                    Register As a...
                    <label>
                      <Radio
                        color="default"
                        name="role"
                        value="guest"
                        checked={role === "guest"}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      guest
                    </label>
                    <label>
                      <Radio
                        color="default"
                        type="radio"
                        name="role"
                        value="host"
                        checked={role === "host"}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      host
                    </label>
                  </div>
                  <CustomTextField
                    label="Name"
                    autoFocus
                    required
                    type="text"
                    margin="dense"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <PhoneInput
                    className="PhoneInput"
                    defaultCountry="au"
                    value={phonenum.value}
                    onChange={(phone) =>
                      setPhonenum({
                        ...phonenum,
                        value: phone,
                      })
                    }
                    onBlur={() => {
                      setPhonenum({
                        ...phonenum,
                        isTouched: true,
                      });
                    }}
                  />
                  {phonenum.isTouched &&
                  !validatePhoneNumber(phonenum.value) ? (
                    <ErrorMsg type="PhoneFormatInvalid" />
                  ) : null}
                  <CustomTextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <CustomTextField
                    label="Password"
                    required
                    type="password"
                    value={password.value}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        value: e.target.value,
                      })
                    }
                    onBlur={() => {
                      setPassword({
                        ...password,
                        isTouched: true,
                      });
                    }}
                  />
                  {password.isTouched && password.value.length < 8 ? (
                    <ErrorMsg type="PasswordFormatInvalid" />
                  ) : null}
                  <CustomTextField
                    label="Password Confirmed"
                    required
                    type="password"
                    value={passwordConfirmed}
                    onChange={(e) => setPasswordConfirmed(e.target.value)}
                  />
                  {password.isTouched &&
                  password.value !== passwordConfirmed ? (
                    <ErrorMsg type="PasswordNotMatch" />
                  ) : null}
                </>
              ) : (
                <>
                  {/* bank account form */}
                  <RegisterBankAccount
                    setAccountNumber={setAccountNumber}
                    setBsb={setBsb}
                    accountNumber={accountNumber}
                    bsb={bsb}
                  />
                </>
              )}

              <MyButton
                type="submit"
                disabled={!getIsFormValid()}
                size="lg"
                sx={{ width: "100%" }}
              >
                <b>CREATE ACCOUNT</b>
              </MyButton>
              <Link className="link" to="/login">
                {"Have an account? Sign In"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
