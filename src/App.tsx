import React, { useState } from 'react';
import './App.css';
import { Button, Grid, Slider, Stack, Typography, Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowLeft, ArrowRight } from '@mui/icons-material';

const styles = {

}

const MAX_HISTORY = 100;
interface stateType {
  min: number,
  max: number,
  sliderValue: number,
  exclusive: boolean,
  randomNumber: number|null,
  lastTime: Date,
  previousNumbers: number[][],
  previousRange: number[][],
}

const initState: stateType = {
  min: 1,
  max: 100,
  sliderValue: 10,
  exclusive: false,
  randomNumber: null,
  lastTime: new Date(),
  previousNumbers: [],
  previousRange: [],
}

function generate(state: stateType, min?: number, max?: number): stateType {

  if (min === undefined) min = state.min;
  if (max === undefined) max = state.max;

  const newState = {...state, min: min, max: max};

  if (state.exclusive) max--;

  newState.randomNumber = Math.floor(Math.random() * (max + 1 - min) + min);
  newState.previousNumbers.unshift([newState.randomNumber, min, max]);
  while (newState.previousNumbers.length>MAX_HISTORY) newState.previousNumbers.pop();
  newState.lastTime = new Date();
  newState.sliderValue = newState.max;
  return newState;
}

function App() {

  const [state, setState] = useState(initState)

  function handleSliderChange(event: Event, value: number|number[], thumb: number) {
    console.log("thumb ", thumb, ": ", value);
    setState({...state, sliderValue:value as number, max: value as number});
  }

  function handleMaxButton(event: React.MouseEvent<HTMLElement>, value: number) {
    setState(generate(state, state.min, value));
  }

  console.log("slider render", state)
  return (
    <div className="App">
      <header className="App-header">
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <Button sx={{height:"10em", padding:"1em"}} onClick={() => setState(generate(state))}><Typography component="h2" variant="h2">{state.randomNumber === null ? "?" : state.randomNumber}</Typography></Button>
          <Typography><i>{state.min} to {state.max} (inclusive)</i></Typography>
          { (state.randomNumber === null) ? "" : (<><Typography sx={{fontSize:"50%"}}>{state.lastTime.toString()}</Typography></>) }
          </Grid>
          { (state.previousNumbers.length === 0) ? "" : (
            <Grid item xs={12}>
              <Typography>Previous: {state.previousNumbers.slice(1,11).map((i) => i[0]).join(", ")}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center" spacing={1}>
              
              <Typography>Highest Number:</Typography>
              <Box sx={{display: "flex", flexDirection: "row"}}>
              {[2, 6, 10, 12, 20, 50, 100, 1000, 10000, 100000, 1000000].map((v) => (
                  <Button variant="contained" onClick={(e) => handleMaxButton(e, v)}
                      color={state.max === v ? "secondary" : "primary"}>{v}</Button>))}
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12}>
              <Stack direction="row" justifyContent="center">
                <IconButton sx={{marginTop:-1}} aria-label="decrease highest number" disabled={state.sliderValue <= state.min}><ArrowLeft/></IconButton>
            <Slider marks={false} disableSwap
                sx={{width:"50%"}}
                min={1} 
                max={100}
                value={state.sliderValue}
                valueLabelDisplay="on"
                onChange={handleSliderChange}/>
                <IconButton sx={{marginTop:-1}} aria-label="increase highest number" disabled={state.sliderValue >= 100} onClick={() => setState({...state, sliderValue:state.sliderValue+1})}><ArrowRight/></IconButton>
            </Stack>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
