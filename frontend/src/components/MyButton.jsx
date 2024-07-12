import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

const MyButton = (props) => {
  const btnVariant = props?.variant;
  const btnColor = props?.color;
  const btnSize = props?.size;
  const btnRound = props?.round;

  let style = {
    boxShadow: "none",
    textTransform: "none",
    fontSize: btnSize === "sm" ? 13 : btnSize === "lg" ? 15 : 14,
    minWidth: btnRound === true ? "0px" : "80px",
    padding: btnRound === true ? "3px 6px" : "6px 12px",
    border: "1px solid",
    borderRadius: btnRound === true ? 100 : 7,
    lineHeight: btnSize === "sm" ? 1.3 : btnSize === "lg" ? 2.4 : 1.8,
    color:
      btnVariant === "filled"
        ? "rgb(255, 255, 255)"
        : btnColor === "red" && btnVariant === "outlined"
          ? "rgb(186, 21, 9)"
          : btnVariant === "outlined"
            ? "rgb(23, 62, 104)"
            : "rgb(255, 255, 255)",
    backgroundColor:
      btnColor === "primary" && btnVariant === "filled"
        ? "rgb(23, 62, 104)"
        : btnVariant === "outlined"
          ? "rgb(255, 255, 255)"
          : btnColor === "red"
            ? "rgb(186, 21, 9)"
            : btnColor === "secondary"
              ? ""
              : "rgb(23, 62, 104)",
    borderColor:
      btnColor === "primary"
        ? "rgb(23, 62, 104)"
        : btnColor === "red" && btnVariant === "outlined"
          ? "rgb(186, 21, 9)"
          : btnColor === "red"
            ? "rgb(186, 21, 9)"
            : btnColor === "secondary"
              ? ""
              : "rgb(23, 62, 104)",
    "&:hover": {
      backgroundColor:
        btnColor === "primary" && btnVariant === "filled"
          ? "rgb(55, 86, 120)"
          : btnVariant === "outlined"
            ? "rgb(237, 237, 237)"
            : btnColor === "red"
              ? "rgb(191, 98, 92)"
              : btnColor === "secondary"
                ? ""
                : "rgb(55, 86, 120)",
      boxShadow: "none",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgb(217, 218, 219)",
    },
  };

  const BootstrapButton = styled(Button)(style);

  return (
    <Tooltip
      title={props.title}
      placement="top"
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -12],
              },
            },
          ],
        },
      }}
    >
      <span>
        {/* This span should directly wrap the button */}
        <BootstrapButton
          variant="contained"
          type={props.type}
          onClick={props?.onClick}
          disabled={props?.disabled}
          sx={props.sx}
          Ripple
        >
          {props.children}
        </BootstrapButton>
      </span>
    </Tooltip>
  );
};

export default MyButton;
