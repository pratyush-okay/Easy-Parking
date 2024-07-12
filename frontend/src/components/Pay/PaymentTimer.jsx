// CircularCountdownTimer.jsx
import React, { useState, useEffect } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const TimerBox = styled(Box)({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const TimerText = styled(Typography)({
  position: "absolute",
  color: "black", // Changed color to black
  fontWeight: "bold",
  fontSize: "0.75rem", // Adjust font size as needed
});

const CircularCountdownTimer = ({ onExpire }) => {
  const totalTime = 180; // Total time in seconds
  const [timeLeft, setTimeLeft] = useState(totalTime * 10); // Multiply by 10 to get deciseconds

  useEffect(() => {
    // Exit early when we reach 0
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    // Save intervalId to clear the interval when the component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 100); // Decrease every 100ms for a smoother animation

    // Clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // Add timeLeft as a dependency to re-run the effect when we update it
  }, [timeLeft, onExpire]);

  const normalizedTimeLeft = (timeLeft / (totalTime * 10)) * 100;

  return (
    <TimerBox sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={50} // Adjust the size to be smaller
        thickness={5}
        sx={{ color: "#BED0E7" }} // Set the default background to light blue
      />
      <CircularProgress
        variant="determinate"
        value={100 - normalizedTimeLeft}
        size={50} // Keep the same size for the foreground circle
        thickness={5}
        sx={{ color: "primary.main", position: "absolute", left: 0 }} // Override the primary color for the animated path
      />
      <TimerText>
        {`${Math.floor(timeLeft / 10 / 60)}:${Math.floor((timeLeft / 10) % 60).toLocaleString("en-US", { minimumIntegerDigits: 2 })}`}
      </TimerText>
    </TimerBox>
  );
};

export default CircularCountdownTimer;
