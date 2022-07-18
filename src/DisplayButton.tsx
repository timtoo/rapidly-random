import { Grow, Tooltip, Button, Typography, Zoom } from "@mui/material";
import { useLongPress } from "use-long-press";
import { useState } from "react";
import Dice from "./dicesvg";
import { useTheme } from "@emotion/react";
import { Die } from "./lib/die";

enum MODE {
  default,
  dice,
  hex
}

type DisplayCardProps = {
  value: number | string;
  index: number;
  mode: MODE;
  die: Die;
  clickHandler: any;
};

export default function DisplayButton(props: DisplayCardProps): JSX.Element {
  const { value, index, mode, die, clickHandler } = props;
  const [ttopen, setTtopen] = useState(false);
  const padding: string =
    mode === MODE.dice ? "1em 3em 1em 3em" : "1em 4em 1em 4em";
  const displayValue: string = mode === MODE.hex ? value.toString(16) : "" + value;
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
          variant={mode === MODE.dice ? "text" : "outlined"}
          {...bind}
        >
          {mode === MODE.dice && die.max <= 10 && value >= 1 && value <= 10 ? (
            value <= 6 && die.max === 6 ? (
              <Dice.Die6img
                die={value}
                size="5em"
                alt={"" + value + " die"}
                style={{ transform: "rotate(" + Math.random() * 360 + "deg)" }}
              />
            ) : (
              <Dice.Die10img
                die={value}
                size="5em"
                alt={"" + value + " die"}
                style={{ transform: "rotate(" + (Math.random() * 90 - 45) + "deg)" }}
              />
            )
          ) : (
            <Typography
              component="h2"
              variant="h2"
              sx={{
                transform:
                  mode === MODE.dice
                    ? "rotate(" + (Math.random() * 40 - 20) + "deg)"
                    : "none",
              }}
            >
              {displayValue}
            </Typography>
          )}
        </Button>
      </Tooltip>
    </Grow>
  );
}
