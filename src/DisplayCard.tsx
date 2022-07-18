import { useState } from "react";
import {
  Grow,
  Tooltip,
  Button,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { useLongPress } from "use-long-press";
import Dice from "./dicesvg";
import { Die } from "./lib/die";

type DisplayCardProps = {
  value: number | string;
  index: number;
  mode: string;
  die: Die;
  clickHandler: any;
};

export default function DisplayCard(props: DisplayCardProps): JSX.Element {
  const { value, index, mode, die, clickHandler } = props;
  const [ttopen, setTtopen] = useState(false);
  const padding: string =
    mode === "dice" ? "1em 3em 1em 3em" : "1em 4em 1em 4em";
  const displayValue: string =
    mode === "hex" ? value.toString(16) : (value as string);
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
        <Card
          id={`rr${index}:${displayValue}`}
          component="div"
          sx={{
            minWidth: "4em",
            height: "10em",
            width: "fit-content",
            verticalAlign: "middle",
          }}
          variant={mode === "dice" ? undefined : "outlined"}
          {...bind}
        >
          <CardActionArea
            sx={{ padding: padding, verticalAlign: "middle", height: "100%" }}
          >
            <CardContent>
              {mode === "dice" && die.max === 6 && value >= 1 && value <= 6 ? (
                <Dice.Die6img
                  die={value}
                  size="5em"
                  style={{
                    transform: "rotate(" + Math.random() * 360 + "deg)",
                  }}
                />
              ) : (
                <Typography component="h2" variant="h2">
                  {displayValue}
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      </Tooltip>
    </Grow>
  );
}
