const ErrorMsg = (props) => {
    const errorType = props.type
    switch(errorType) {
        case 'PasswordFormatInvalid':
          return <p className="FieldError">Password should have at least 8 characters</p>;
        case 'PasswordNotMatch':
          return <p className="FieldError">Passwords are different</p>;
        case 'PhoneFormatInvalid':
          return <p className="FieldError">Invalid format</p>;
        case 'AccountNumberInvalid':
            return <p className="FieldError">Account Number should be 8 digits.</p>;
        case 'BsbFormatInvalid':
          return <p className="FieldError">BSB should be 6 digits.</p>;
        default:
          return 'foo';
    }
}

export default ErrorMsg;