import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from "@mui/material";
import React, { useRef, useEffect } from "react";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useHotkeys } from "react-hotkeys-hook";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

type ConsoleDialogProps = {
  state: boolean,
  setState: React.Dispatch<React.SetStateAction<boolean>>,
  inputRef: React.MutableRefObject<HTMLInputElement | null>
};

export default function ConsoleDialog(props: ConsoleDialogProps): JSX.Element {
  const handleClose = () => props.setState(false);
  //useHotkeys('`', () => props.setState(!props.state));

  useEffect(() => {
      console.log("console effect")
      setTimeout(() => props.inputRef?.current?.focus(), 500);
  })

  console.log("create console")
  return (
    <Dialog
      open={props.state}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="lg"
      onClose={handleClose}
      sx={{opacity:"0.95"}}
      PaperProps={{sx:{top:0, position:"fixed"}}}
    >
      <DialogContent sx={{paddingBottom:0}}>
          <TextField placeholder="Dice hacking mode enabled..." 
                label="Console" variant="outlined" fullWidth autoFocus
          inputRef={props.inputRef}></TextField>
          <Typography fontSize="60%" color="text.secondary">Sadly this doesn't work yet.</Typography>
      </DialogContent>
      <DialogActions>
        <Button sx={{marginRight:"1em"}} onClick={handleClose} variant="outlined">Esc</Button>
      </DialogActions>
    </Dialog>
  );
}
