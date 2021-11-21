import React, { useState } from 'react';
import './App.css';
import { Button, Grid, Slider, Stack, Typography, Box, IconButton, Checkbox, CssBaseline, TextField } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { ThemeProvider } from '@mui/system';
import { theme1 } from './themes';

const DEFAULT_QUANTITY: number = 1
const DEFAULT_MIN: number = 1;
const DEFAULT_MAX: number = 10;
const MAX_QUANTITY: number = 100;
const MAX_HISTORY: number = MAX_QUANTITY * 5;

type randomType = {
  value: number,
  min: number, 
  max: number,
  time: Date,
  exclusive: boolean,
}

type stateType = {
  min: number,
  max: number,
  sliderValue: number,
  exclusive: boolean,
  zeroBase: boolean,
  randoms: randomType[],
  lastTime: Date,
  previousRange: number[][],
  quantity: number,
  newQuantity: number,
}

const initState: stateType = {
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
  sliderValue: DEFAULT_MAX,
  exclusive: false,
  zeroBase: false,
  randoms: [],
  lastTime: new Date(),
  previousRange: [],
  quantity: DEFAULT_QUANTITY,
  newQuantity: DEFAULT_QUANTITY,
}

// generate new randoms numbers to the front of the history list
function generate(state: stateType, min?: number, max?: number): stateType {

  if (min === undefined) min = state.min;
  if (max === undefined) max = state.max;

  const newState = {...state, min: min, max: max};
  const exclusive_max = state.exclusive ? max - 1 : max

  if (state.newQuantity !== state.quantity) newState.quantity = state.newQuantity;

  for (let i=0; i < newState.quantity; i++) {
    newState.randoms.unshift({
      value: Math.floor(Math.random() * (exclusive_max + 1 - min) + min),
      min: min, 
      max: max,
      time: new Date(),
      exclusive: state.exclusive,
    })
    if (newState.randoms.length > MAX_HISTORY) newState.randoms.pop();
  }

  newState.lastTime = newState.randoms[0].time;
  newState.sliderValue = max;
  return newState;
}


function App() {

  const [state, setState] = useState(initState)

  // make sure the limit values are sane, then update state
  function handleLimitChange(value: number, type: "lower"|"upper_reset"|"upper"): stateType {
    const newState: stateType = {...state};

    if (type === 'lower') {
      const closest_min: number = state.exclusive ? newState.max - 2 : newState.max - 1;
      if (isNaN(value)) value = state.zeroBase ? 0 : DEFAULT_MIN;
      if (value > closest_min) value = closest_min;
      newState.min = value
    }
    else {
      const closest_max: number = state.exclusive ? newState.min + 2 : newState.min + 1;
      if (isNaN(value)) value = DEFAULT_MAX;
      if (value < closest_max) {
        if (type === "upper_reset") {
          const default_min = state.zeroBase ? 0 : DEFAULT_MIN;
          const min_max = state.exclusive ? default_min + 2 : default_min + 1;
          if (value >= min_max) {
            newState.min = default_min;
          }
          else {
            value = closest_max;
          }
        }
        else {
          value = closest_max;
        }      
      }
      newState.max = value
    }
    return newState;
  }

  function handleSliderChange(value: number|number[], thumb: number): stateType {
    console.log("thumb ", thumb, ": ", value);
    const newState: stateType = {...state}
    if (thumb < 0) newState.min = value as number;
    else {
      newState.sliderValue = value as number;
      newState.max = value as number;
    }
    return newState;
  }

  function handleMaxButton(event: React.MouseEvent<HTMLElement>, value: number) {
    const newState = handleLimitChange(value, "upper_reset");
    setState(generate(newState));
  }

  type QuickButtonProps = {
    children: React.ReactNode,
    values: number[]
  }
  
  function QuickButtons({values, children}: QuickButtonProps): JSX.Element {
    return (
      <>
      <Typography>{children}</Typography>
      <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
        {values.map((v) => (
        <Button key={v} variant="contained" sx={{margin:"1px"}} onClick={(e) => handleMaxButton(e, v)}
            color={state.max === v ? "secondary" : "primary"}>{v}</Button>))}
      </Box>
    </>
    );
  }

  function DisplayButton(props: any) {
    return (
      <Button sx={{height:"10em", padding:"1em 5em 1em 5em"}} 
          variant="outlined" 
          onClick={() => setState(generate(state))}>
        <Typography component="h2" variant="h2">{props.children}</Typography>
      </Button>
    )
  }

  console.log("slider render", state)
  return (
    <ThemeProvider theme={theme1}>
    <div className="App">
      <CssBaseline/>
      <header className="App-header">
      <Typography component="h1" variant="h5" sx={{textAlign:"center", marginBottom:"0.5em"}}>Rapidly Random Numbers</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            { state.randoms.slice(0, state.quantity).map((e:randomType) => (
              <DisplayButton>{e.value}</DisplayButton>
            ))}
            { (state.randoms.length !== 0) ? "" : (
              <DisplayButton>Press Here!</DisplayButton>) }
          <Typography sx={{marginTop: "0.5em"}}><i>{state.min} to {state.max} (inclusive)</i></Typography>
          { (state.randoms.length === 0) ? "" : (<><Typography sx={{fontSize:"50%"}}>{state.lastTime.toString()}</Typography></>) }
          </Grid>
          { (state.randoms.length <= state.quantity) ? "" : (
            <Grid item xs={12}>
              <Typography>Previous: {state.randoms.slice(state.quantity,state.quantity+11).map((i) => i.value).join(", ")}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center" spacing={1}>
              <QuickButtons values={[2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 50, 100, 256, 1000, 10000, 100000, 1000000]}>
                Highest Number:
              </QuickButtons>
            </Stack>
          </Grid>
          <Grid item xs={12}>
              <Stack direction="row" justifyContent="center">
                <IconButton sx={{marginTop:-0.5}} aria-label="decrease highest number" disabled={state.sliderValue <= state.min} onClick={(e) => setState(handleSliderChange(state.sliderValue-1, 0))}><ArrowLeft/></IconButton>
            <Slider marks={false} disableSwap
                sx={{width:"50%"}}
                min={2} 
                max={100}
                value={state.sliderValue}
                valueLabelDisplay="auto"
                onChange={(e,v,t) => setState(handleSliderChange(v, t))}/>
                <IconButton sx={{marginTop:-0.5}} aria-label="increase highest number" disabled={state.sliderValue >= 100} onClick={(e) => setState(handleSliderChange(state.sliderValue+1, 0))}><ArrowRight/></IconButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Checkbox></Checkbox>

          </Grid>
          <Grid item xs={12}>
            <TextField type="number" id="set-min" size="small" value={state.min} 
                label="Lowest" sx={{width:"6em"}}
                onChange={(e) => setState(handleLimitChange(parseInt(e.target.value), "lower"))}
                InputLabelProps={{shrink: true}} />
            <TextField type="number" id="set-max" size="small" value={state.max} 
                label="Highest" sx={{width:"6em"}}
                onChange={(e) => setState(handleLimitChange(parseInt(e.target.value), "upper"))}
                InputLabelProps={{shrink: true}} />
            <TextField type="number" id="set-quantity" size="small" value={state.newQuantity} 
                label="Quantity" sx={{width:"6em"}}
                onChange={(e) => {setState({...state, newQuantity:parseInt(e.target.value)||DEFAULT_QUANTITY})}}
                InputLabelProps={{shrink: true}} />
          </Grid>
        </Grid>
      </header>
    </div>
    </ThemeProvider>
  );
}

export default App;
