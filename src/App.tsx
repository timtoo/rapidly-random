import React, { createRef, useRef, useState } from "react";
import "./App.css";
import {
  Button,
  Grid,
  Stack,
  Typography,
  Box,
  IconButton,
  Checkbox,
  CssBaseline,
  TextField,
  FormControlLabel,
  FormGroup,
  SvgIcon,
  FormControl,
  InputLabel,
  NativeSelect,
  Select,
  Grow,
  Tooltip,
  Chip,
  Avatar,
  FormLabel,
} from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { theme1 } from "./themes";
import Dice from "./dicesvg";
import { useLongPress } from "use-long-press";
import {
  Computer,
  InfoOutlined,
  Looks6,
  Hexagon,
  HexagonOutlined,
  ModeEdit,
} from "@mui/icons-material";
import { Die } from "./die";
import DisplayCard from "./DisplayCard";
import DisplayButton from "./DisplayButton";
import { useTheme } from "@emotion/react";
import ConsoleDialog from "./ConsoleDialog";
import { useHotkeys } from "react-hotkeys-hook";
import TextNumber from "./TextNumber";

const DEFAULT_QUANTITY: number = 1;
const DEFAULT_MIN: number = 1;
const DEFAULT_MAX: number = 10;
const MAX_QUANTITY: number = 100;
const MAX_HISTORY: number = MAX_QUANTITY * 5;

enum MODE {
  default,
  dice,
  hex,
}

const MODES: [number, string][] = [
  [0, "Normal"],
  [1, "Dice"],
  [2, "Hex"],
];

type rollHistoryType = {
  label: string;
  die: Die;
  mode: MODE;
  time: Date;
};

type saveStateDictType = {
  [key: string]: Die;
};

type stateType = {
  die: Die;
  rolls: rollHistoryType[]; // history of actual rolls (random results)
  lastTime: Date;
  history: rollHistoryType[]; // mode/range history
  newQuantity: number;
  needUpdate: number;
};

const initState: stateType = {
  die: new Die(
    DEFAULT_MIN,
    DEFAULT_MAX,
    DEFAULT_QUANTITY,
    0,
    1,
    1,
    false,
    false
  ),
  rolls: [],
  lastTime: new Date(),
  history: [],
  newQuantity: DEFAULT_QUANTITY, // don't change quanity directly or will
  needUpdate: 0,
};

// generate new randoms numbers to the front of the history list
function generate(
  state: stateType,
  mode: MODE,
  min?: number,
  max?: number
): stateType {
  const die = state.die;
  const newState = { ...state };

  if (min === undefined) min = die.min;
  if (max === undefined) max = die.max;

  // update number of dice requested
  if (state.newQuantity !== die.dice) newState.die.dice = state.newQuantity;

  die.roll();
  newState.rolls.unshift({
    label: die.toString(),
    die: die,
    mode: mode,
    time: new Date(),
  });
  newState.die = die.clone();

  // trim roll history
  if (newState.rolls.length > MAX_HISTORY) newState.rolls.pop();

  // add die to front of prevoius range list (removing duplicates)
  const prev_index = newState.history.findIndex(
    (i) => i.label === newState.rolls[0].label && i.mode === mode
  );
  if (prev_index >= 0) newState.history.splice(prev_index, 1);
  newState.history.unshift(newState.rolls[0]);

  newState.lastTime = newState.rolls[0].time;
  return newState;
}

const saveStateDictInit: saveStateDictType = {};

function App() {
  function handleQuantityKeys(amount: number) {
    console.log("up " + mode);
    if (mode !== MODE.dice) {
      const control = quantityInputRef?.current as HTMLInputElement;
      control.value = "" + (+control.value + amount);
      setState((o) => ({ ...o, newQuantity: state.newQuantity - 1 }));
    }
  }

  const [state, setState] = useState(initState);
  const [mode, setMode] = useState(MODE.default);
  const [prevModeState, setPrevModeState] = useState(saveStateDictInit);
  const [ttopen, setttopen] = useState(false);
  const [consoleState, setConsoleState] = useState(false);
  const consoleInputRef = useRef<HTMLInputElement | null>(null);
  const quantityInputRef = useRef<HTMLInputElement | null>(null);

  useHotkeys("`", () => setConsoleState(!consoleState));
  //this is causing state update loop with the input field
  //useHotkeys('up', () => handleQuantityKeys(1));
  //  useHotkeys('down', () => setState({...state, newQuantity: state.newQuantity-1}));
  useHotkeys("h", () => setState(handleModeChange(MODE.hex)));
  useHotkeys("d", () => setState(handleModeChange(MODE.dice)));
  useHotkeys("n", () => setState(handleModeChange(MODE.default)));
  useHotkeys("enter", () => setState(generate(state, mode)));

  // wrapper to force state update (which might otherwise go unnoticed)
  function setStateForce(state: stateType) {
    const newState = { ...state, needUpdate: state.needUpdate++ };
    setState(newState);
  }

  // make sure the limit values are sane, then update state
  function handleLimitChange(
    value: number,
    type: "lower" | "upper_reset" | "upper"
  ): stateType {
    const newState: stateType = { ...state };
    console.log("handlellimit")

    // make sure lower
    if (type === "lower") {
      const closest_min: number = state.die.exclusive
        ? newState.die.max - 2
        : newState.die.max - 1;
      if (isNaN(value)) value = state.die.zerobase ? 0 : DEFAULT_MIN;
      if (value > closest_min) value = closest_min;
      newState.die.min = value;
    } else {
      const closest_max: number = state.die.exclusive
        ? newState.die.min + 2
        : newState.die.min + 1;
      if (isNaN(value)) value = DEFAULT_MAX;
      if (value < closest_max) {
        if (type === "upper_reset") {
          const default_min = state.die.zerobase ? 0 : DEFAULT_MIN;
          const min_max = state.die.exclusive
            ? default_min + 2
            : default_min + 1;
          if (value >= min_max) {
            newState.die.min = default_min;
          } else {
            value = closest_max;
          }
        } else {
          value = closest_max;
        }
      }
      newState.die.max = value;
    }
    return newState;
  }

  function handleMaxButton(
    event: React.MouseEvent<HTMLElement>,
    value: number
  ) {
    const newState = handleLimitChange(value, "upper_reset");
    setState(generate(newState, mode));
  }

  function QuickButtons(props: { label: string }): JSX.Element {
    let values: number[] = [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 50, 100, 256, 1000, 1000000,
    ];
    if (mode === MODE.hex)
      values = [
        16, 32, 64, 128, 256, 1024, 2048, 4096, 9182, 65536, 1048576, 16777216,
      ];
    if (mode === MODE.dice) values = [2, 4, 6, 8, 10, 12, 20, 100];

    return (
      <>
        <Typography color="text.secondary" fontSize="small">
          {props.label}
        </Typography>
        <br />
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {values.map((v) => (
            <Button
              key={v}
              variant="contained"
              sx={{ margin: "1px" }}
              onClick={(e) => handleMaxButton(e, v)}
              color={state.die.max === v ? "secondary" : "primary"}
            >
              {v}
            </Button>
          ))}
        </Box>
      </>
    );
  }

  function handleHistButton(
    event: React.MouseEvent<HTMLElement>,
    value: rollHistoryType
  ) {
    const newState = handleModeChange(value.mode);
    newState.die = value.die.clone();
    setState(generate(newState, value.mode));
  }

  function HistoryButtons(props: {
    label: string;
    values: rollHistoryType[];
  }): JSX.Element {
    const { label, values } = props;

    return (
      <>
        <Typography>{label}</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {values.map((v) => (
            <Chip
              key={v.label}
              variant={undefined}
              sx={{ marginRight: "0.3em", textTransform: "none" }}
              onClick={(e) => handleHistButton(e, v)}
              icon={
                v.mode === MODE.hex ? (
                  <HexagonOutlined />
                ) : v.mode === MODE.dice ? (
                  <Looks6 />
                ) : undefined
              }
              size="small"
              color={"secondary"}
              label={v.label}
            />
          ))}
        </Box>
      </>
    );
  }

  function setGenerateState() {
    console.log("set-generate-state");
    setState(generate(state, mode));
  }

  // pass through to last die.getThrow with some safety
  function getThrow(): number[] {
    if (state.rolls.length > 0) {
      return state.rolls[0].die.getThrow();
    }
    return [];
  }

  function handleModeChange(value: MODE): stateType {
    //console.log("mode change: ", value)
    //console.log(MODES.map(i=>i[0]))nod

    let newState: stateType = { ...state };

    // store previous mode settings
    if (value in MODE) {
      setPrevModeState({ ...prevModeState, [mode]: state.die });
      setMode(value);

      if (value in prevModeState) {
        newState.die = prevModeState[value];
      } else {
        if (value === MODE.dice) {
          // nothing else makes sense for dice at this point
          newState.die = new Die(1, 6);
          newState = generate(newState, mode);
        } else if (value == MODE.hex) {
          newState.die = new Die(0, 256);
          newState.die.exclusive = true;
          newState.die.zerobase = true;
        } else {
          newState.die = new Die(DEFAULT_MIN, DEFAULT_MAX, DEFAULT_QUANTITY);
        }
      }
    } else {
      console.log("error: unknown mode: " + value);
    }
    return newState;
  }

  // extract simple list from history of die objects
  function previousRandomValues(limit = 50): number[] {
    let result = [];
    for (const r of state.rolls.slice(1)) {
      for (const v of r.die.getThrow()) {
        result.push(v);
        if (result.length >= limit) break;
      }
      if (result.length >= limit) break;
    }
    return result;
  }

  // -------------------- LET THE SHOW BEGIN -------------------------
  return (
    <ThemeProvider theme={theme1}>
      <div className="App">
        <CssBaseline />
        <ConsoleDialog
          state={consoleState}
          setState={setConsoleState}
          inputRef={consoleInputRef}
        />
        <header className="App-header">
          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: "center", marginBottom: "0.5em" }}
          >
            Rapidly Random Numbers
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {getThrow().map((v, i) => (
                <DisplayButton
                  value={v}
                  index={i}
                  mode={mode}
                  die={state.die}
                  clickHandler={setGenerateState}
                />
              ))}
              {state.rolls.length !== 0 ? (
                ""
              ) : (
                <DisplayButton
                  value="Press Here!"
                  index={0}
                  mode={MODE.default}
                  die={state.die}
                  clickHandler={setGenerateState}
                />
              )}
              <Typography color="text.secondary" sx={{ marginTop: "0.5em" }}>
                <i>
                  {getThrow().length > 1
                    ? "Total: " + getThrow().reduce((p, c) => p + c) + " - "
                    : ""}{" "}
                  Range: {state.die.getRangeString(true, " to ")}
                </i>
              </Typography>
              {state.rolls.length === 0 ? (
                ""
              ) : (
                <>
                  <Typography sx={{ fontSize: "50%" }}>
                    {state.lastTime.toString()}
                  </Typography>
                </>
              )}
            </Grid>

            {state.rolls.length <= 1 ? (
              ""
            ) : (
              <Grid item xs={12}>
                <Typography
                  noWrap
                  color="secondary"
                  sx={{ paddingLeft: "1em", paddingRight: "1em" }}
                >
                  Previous: <i>{previousRandomValues().join(", ")}</i>
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="center" spacing={1}>
                <QuickButtons label="Highest Number:" />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
              >
            <TextNumber id="test" label="Test" size="small" width="8em" 
            value={state.die.min} 
                  dis={mode === MODE.dice}
                  onChange={(e) =>
                    setState(
                      handleLimitChange(parseInt(e.target.value), "lower")
                    )
                  }
            
            />
                <TextField
                  type="number"
                  id="set-min"
                  size="small"
                  value={state.die.min}
                  label="Lowest"
                  sx={{ width: "6em" }}
                  disabled={mode === MODE.dice ? true : false}
                  onChange={(e) =>
                    setState(
                      handleLimitChange(parseInt(e.target.value), "lower")
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="number"
                  id="set-max"
                  size="small"
                  value={state.die.max}
                  label="Highest"
                  sx={{ width: "6em" }}
                  disabled={mode === MODE.dice ? true : false}
                  onChange={(e) =>
                    setState(
                      handleLimitChange(parseInt(e.target.value), "upper")
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="number"
                  id="set-quantity"
                  size="small"
                  value={state.newQuantity}
                  inputRef={quantityInputRef}
                  label="Quantity"
                  sx={{ width: "6em" }}
                  onChange={(e) => {
                    setState((o) => ({
                      ...o,
                      newQuantity: parseInt(e.target.value) || DEFAULT_QUANTITY,
                    }));
                  }}
                  InputLabelProps={{ shrink: true }}
                />

                <FormControl>
                  <InputLabel htmlFor="mode-select">Mode</InputLabel>
                  <Select
                    native
                    size="small"
                    label="Mode"
                    defaultValue={mode}
                    onChange={(e) => {
                      setState(
                        handleModeChange(parseInt(e.target.value as string))
                      );
                    }}
                    inputProps={{
                      name: "mode",
                      id: "mode-select",
                    }}
                  >
                    {MODES.map((v, i) => (
                      <option key={i} value={v[0]}>
                        {v[1]}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ marginLeft: "1em", marginRight: "1em" }}>
                  <FormControlLabel
                    label="Exclusive"
                    control={
                      <Checkbox
                        checked={state.die.exclusive}
                        disabled={mode === MODE.dice ? true : false}
                        onChange={(e) => {
                          state.die.exclusive = e.target.checked;
                          setStateForce(state);
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Zero based"
                    control={
                      <Checkbox
                        checked={state.die.zerobase}
                        disabled={mode === MODE.dice ? true : false}
                        onChange={(e) => {
                          state.die.min = e.target.checked ? 0 : DEFAULT_MIN;
                          state.die.zerobase = e.target.checked;
                          setStateForce(state);
                        }}
                      />
                    }
                  />
                </Box>
              </Box>
            </Grid>

            {state.history.length <= 0 ? (
              ""
            ) : (
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="center" spacing={1}>
                  <HistoryButtons label="History:" values={state.history} />
                </Stack>
              </Grid>
            )}
          </Grid>

          <br />
          <br />
          <IconButton onClick={() => setttopen(!ttopen)}>
            <Tooltip
              placement="top"
              open={ttopen}
              title={
                <>
                  <b>Tips!</b>
                  <ul>
                    <li>
                      Click/tap any number for <b>new number(s)</b>
                    </li>
                    <li>
                      Long press (click and hold) any number to copy to{" "}
                      <b>clipboard</b>
                    </li>
                    <li>
                      Use hex mode 16777216 button for random HTML colour codes
                    </li>
                    <li>Use five dice to play Yahtzee?</li>
                    <li>` for console. Is that crazy?</li>
                  </ul>
                  Use your randomness for good.
                </>
              }
            >
              <InfoOutlined color="secondary" fontSize="small" />
            </Tooltip>
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => {
              setConsoleState(true);
            }}
          >
            <Computer fontSize="small" />
          </IconButton>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
