import React, { useState } from 'react';
import './App.css';
import { Button, Grid, Stack, Typography, Box, IconButton, Checkbox, CssBaseline, TextField, FormControlLabel, FormGroup, SvgIcon, FormControl, InputLabel, NativeSelect, Select, Grow, Tooltip } from '@mui/material';
import { ThemeProvider, typography } from '@mui/system';
import { theme1 } from './themes';
import Dice from './dicesvg';
import { useLongPress } from 'use-long-press';
import { InfoOutlined } from '@mui/icons-material';

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

type saveStateType = {
  min: number,
  max: number,
  exclusive: boolean,
  zeroBase: boolean,
}

type saveStateDictType = {
  [key: string]: saveStateType
}

type stateType = {
  min: number,
  max: number,
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
  exclusive: false,
  zeroBase: false,
  randoms: [],
  lastTime: new Date(),
  previousRange: [],
  quantity: DEFAULT_QUANTITY,
  newQuantity: DEFAULT_QUANTITY,
}

const MODES: string[][] = [ 
    ['default', 'Normal'], 
    ['dice', 'Dice'],
    ['hex', 'Hex' ]
]

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
  return newState;
}

const saveStateDictInit: saveStateDictType = {}

function App() {

  const [state, setState] = useState(initState)
  const [mode, setMode] = useState("default")
  const [prevModeState, setPrevModeState] = useState(saveStateDictInit)

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

  function handleMaxButton(event: React.MouseEvent<HTMLElement>, value: number) {
    const newState = handleLimitChange(value, "upper_reset");
    setState(generate(newState));
  }
  
  function QuickButtons(props: {label: string}): JSX.Element {
    let values: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 50, 100, 256, 1000, 1000000];
    if (mode==='hex') 
      values = [16,32,64,128,256,1024,2048,4096,9182,65536,1048576,16777216]

    return (
      <>
      <Typography>{props.label}</Typography>
      <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
        {values.map((v) => (
        <Button key={v} variant="contained" sx={{margin:"1px"}} onClick={(e) => handleMaxButton(e, v)}
            color={state.max === v ? "secondary" : "primary"}>{v}</Button>))}
      </Box>
    </>
    );
  }

  function DisplayButton(props: any): JSX.Element {
    const [ttopen, setTtopen] = useState(false);
    const { value, index } = props
    const padding: string = (mode === 'dice') ? "1em 3em 1em 3em" : "1em 4em 1em 4em"
    const displayValue: string = (mode==='hex') ? value.toString(16) : value
    const bind = useLongPress((e, v=displayValue) => {
      e?.preventDefault()
      setTtopen(true);
      navigator.clipboard.writeText(displayValue)
    }, {captureEvent: true,
        threshold: 500,
        onCancel: () => setState(generate(state)),
        onFinish: () => setTimeout(() => setTtopen(false), 1500)
    });


    return (
      <Grow in={true}>
      <Tooltip arrow
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="Copied to clipboard!"
                open={ttopen}>
      <Button id={`rr${index}:${displayValue}`}
          sx={{height:"10em", padding:padding}} 
          variant={mode==='dice' ? "text" : "outlined"}
          {...bind}>{
            (mode==='dice' && (value>=1 && value <=6)) 
            ?
            <Dice.Die6img die={value} size="5em" style={{transform:"rotate("+(Math.random()*360)+"deg)"}}/>
            :
            <Typography component="h2" variant="h2">{displayValue}</Typography>
          }
      </Button>
      </Tooltip>
      </Grow>
    )
  }

  function handleModeChange(value: string) {
    console.log("mode change: ", value)
    console.log(MODES.map(i=>i[0]))
    
    // store previous mode settings
    if (MODES.find((e)=>e[0]===mode)) {
      setPrevModeState({...prevModeState, [mode]: {
        min: state.min,
        max: state.max,
        exclusive: state.exclusive,
        zeroBase: state.zeroBase,
      }})
      setMode(value);

      if (value === 'dice') {
        // nothing else makes sense for dice
        const newState: stateType = {...state, min:1, max:6, zeroBase:false, exclusive:false}
        setState(newState)
        generate(newState)
      }
      else {
        // restore previous mode settings so one can go back quickly
        if (value in prevModeState) {
          setState({...state, 
              min:prevModeState[value].min, 
              max:prevModeState[value].max, 
              zeroBase:prevModeState[value].zeroBase, 
              exclusive:prevModeState[value].exclusive
          })
        }
        // set these defaults if mode not already saved
        else if (value === 'hex') {
          setState({...state, min: 0, max: 256, zeroBase:true, exclusive:true})
        }
      }
    }
  }

  return (
    <ThemeProvider theme={theme1}>
    <div className="App">
      <CssBaseline/>
      <header className="App-header">
      <Typography component="h1" variant="h5" sx={{textAlign:"center", marginBottom:"0.5em"}}>Rapidly Random Numbers</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            { state.randoms.slice(0, state.quantity).map(
                (e:randomType, i) => <DisplayButton value={e.value} index={i}/>)}
            { (state.randoms.length !== 0) ? "" : (
              <DisplayButton value="Press Here!" />) }
          <Typography sx={{marginTop: "0.5em"}}><i>[{state.min} to {state.max}{state.exclusive ? ")" : "]"}</i></Typography>
          { (state.randoms.length === 0) ? "" : (<><Typography sx={{fontSize:"50%"}}>{state.lastTime.toString()}</Typography></>) }
          </Grid>
          { (state.randoms.length <= state.quantity) ? "" : (
            <Grid item xs={12}>
              <Typography noWrap color="secondary" sx={{paddingLeft:"1em", paddingRight:"1em"}}>Previous: <i>{state.randoms.slice(state.quantity,state.quantity+51).map((i) => i.value).join(", ")}</i></Typography>
            </Grid>
          )}
          { mode === 'dice' ? "" : (
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center" spacing={1}>
              <QuickButtons label="Highest Number:" />
            </Stack>
          </Grid>
          ) }
          <Grid item xs={12}>
  
            <Box display="flex" flexDirection="row" flexWrap="wrap" alignItems="center" justifyContent="center">

            <TextField type="number" id="set-min" size="small" value={state.min} 
                label="Lowest" sx={{width:"6em"}}
                disabled={mode==='dice'?true:false} 
                onChange={(e) => setState(handleLimitChange(parseInt(e.target.value), "lower"))}
                InputLabelProps={{shrink: true}} />
            <TextField type="number" id="set-max" size="small" value={state.max} 
                label="Highest" sx={{width:"6em"}}
                disabled={mode==='dice'?true:false} 
                onChange={(e) => setState(handleLimitChange(parseInt(e.target.value), "upper"))}
                InputLabelProps={{shrink: true}} />
            <TextField type="number" id="set-quantity" size="small" value={state.newQuantity} 
                label="Quantity" sx={{width:"6em"}}
                onChange={(e) => {setState({...state, newQuantity:parseInt(e.target.value)||DEFAULT_QUANTITY})}}
                InputLabelProps={{shrink: true}} />


<Select
native
            size="small"
    label="Mode"
    defaultValue={mode}
    onChange={(e) => handleModeChange(e.target.value)}
    inputProps={{
      name: 'mode',
      id: 'mode-select',
    }}
  >
    { MODES.map((v) => (<option value={v[0]}>{v[1]}</option>)) }
  </Select>

              <Box sx={{marginLeft:"1em", marginRight:"1em"}}>
            <FormControlLabel label="Exclusive" control={
              <Checkbox checked={state.exclusive} 
                  disabled={mode==='dice'?true:false} 
                  onChange={(e) => setState({...state, exclusive:e.target.checked})} 
              />}
            />
            <FormControlLabel label="Zero based" control={
              <Checkbox checked={state.zeroBase} 
                  disabled={mode==='dice'?true:false} 
                  onChange={(e) => setState({...state, zeroBase:e.target.checked, min:e.target.checked?0:DEFAULT_MIN})}
              />} 
            />
            </Box>
            </Box>
          </Grid>
        </Grid>   
        <br/><br/>
        <Tooltip placement="top"
          title={<>
            <b>Tips!</b>
            <ul>
              <li>Click/tap any number for <b>new number(s)</b></li>
              <li>Long press (click and hold) any number to copy to <b>clipboard</b></li>
              <li>Use hex mode 16777216 button for random HTML colour codes</li>
              <li>Use five dice to play Yahtzee?</li>
            </ul>
            Use your randomness for good.
          </>}>
        <InfoOutlined color="secondary" fontSize="small"/>     
        </Tooltip>
      </header>
    </div>
    </ThemeProvider>
  );
}

export default App;
