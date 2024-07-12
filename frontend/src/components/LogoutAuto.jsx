import React from "react";

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const SESSION_EXPIRED_DURATION = 3600000; // 5000ms = 5secs

const LogoutAuto = (props) => {
  let timer;

  /* adds event listeners to the window */
  React.useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  });

  /* sets the timer & auto logout */
  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      props.setLogoutType("auto");
      resetTimer();
      /* clean up listener */
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      props.setModalState(true);
    }, SESSION_EXPIRED_DURATION);
  };

  /* resets the timer */
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };
};

export default LogoutAuto;
