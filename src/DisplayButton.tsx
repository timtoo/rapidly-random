import { Grow, Tooltip, Button, Typography, Zoom } from "@mui/material";
import { useLongPress } from "use-long-press";
import { useState } from "react";
import Dice from "./dicesvg";
import { useTheme } from "@emotion/react";

type DisplayCardProps = {
  value: number | string;
  index: number;
  mode: string;
  clickHandler: any;
};

export default function DisplayButton(props: DisplayCardProps): JSX.Element {
  const { value, index, mode, clickHandler } = props;
  const [ttopen, setTtopen] = useState(false);
  const padding: string =
    mode === "dice" ? "1em 3em 1em 3em" : "1em 4em 1em 4em";
  const displayValue: string = mode === "hex" ? value.toString(16) : "" + value;
  const bind = useLongPress(
    (e, v = displayValue) => {
      e?.preventDefault();
      setTtopen(true);
      navigator.clipboard.writeText(displayValue);
    },
    {
      captureEvent: true,
      threshold: 500,
      onCancel: clickHandler,
      onFinish: () => setTimeout(() => setTtopen(false), 1500),
    }
  );

  //const theme = useTheme();
  //console.log("***theme***", theme);

  return (
    <Grow in={true}>
      <Tooltip
        arrow
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title="Copied to clipboard!"
        open={ttopen}
      >
        <Button
          id={`rr${index}:${displayValue}`}
          sx={{ height: "10em", padding: padding }}
          variant={mode === "dice" ? "text" : "outlined"}
          {...bind}
        >
          {mode === "dice" && value >= 1 && value <= 6 ? (
            <Dice.Die6img
              die={value}
              size="5em"
              style={{ transform: "rotate(" + Math.random() * 360 + "deg)" }}
            />
          ) : (
            <Typography component="h2" variant="h2">
              {displayValue}
            </Typography>
          )}
        </Button>
      </Tooltip>
    </Grow>
  );
}
