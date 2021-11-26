import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useEffect } from "react";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useHotkeys } from "react-hotkeys-hook";
import { Close } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type ConsoleDialogProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export default function ConsoleDialog(props: ConsoleDialogProps): JSX.Element {
  const handleClose = () => props.setState(false);
  //useHotkeys('`', () => props.setState(!props.state));

  function handleClear() {
    (props.inputRef?.current as HTMLInputElement).value = "";
    setTimeout(() => props.inputRef?.current?.focus(), 500);
  }

  useEffect(() => {
    console.log("console effect");
    setTimeout(() => props.inputRef?.current?.focus(), 500);
  });

  console.log("create console");
  return (
    <Dialog
      open={props.state}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="lg"
      onClose={handleClose}
      sx={{ opacity: "0.90" }}
      PaperProps={{ sx: { bottom: 0, position: "fixed" } }}
    >
      <DialogContent sx={{ paddingBottom: 0 }}>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel htmlFor="console-input">Console</InputLabel>
          <OutlinedInput
            id="console-input"
            placeholder="Dice hacking mode enabled..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear the input field"
                  onClick={handleClear}
                  edge="end"
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            }
            label="Console"
            fullWidth
            autoFocus
            inputRef={props.inputRef}
          />
        </FormControl>
        <Typography fontSize="60%" color="text.secondary">
          Sadly this doesn't work yet.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ marginRight: "1em" }}
          onClick={handleClose}
          variant="outlined"
        >
          Esc
        </Button>
      </DialogActions>
    </Dialog>
  );
}
