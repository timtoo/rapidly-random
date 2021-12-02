import { Ref, useRef, useState } from 'react';
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { InputProps as StandardInputProps } from "@mui/material/Input";

type TextNumberProps = {
  id: string;
  label: string;
  value: number;
  dis: boolean;
  size?: "medium" | "small" | undefined;
  width?: string | number;
  onChange?: StandardInputProps["onChange"];
  buttonColor?: "error" | "secondary" | "inherit" | "default" | "primary" | "info" | "success" | "warning" | undefined;
  inputRef?: Ref<any>;
};

export default function TextNumber(props: TextNumberProps) {
  const {
    id,
    label,
    value,
    size,
    dis = false,
    width = "",
    buttonColor = "secondary",
    onChange,
    inputRef,
  } = props;

  const [inputValue, setInputValue] = useState(value)
  
  function handleButton(value: number) {
    console.log(`handle button for ${id}: ${value}`);
    setInputValue(inputValue+value);
  }

  return (
    <FormControl sx={{ width: { width } }} size={size}>
      <InputLabel htmlFor={id + "-input"}>{label}</InputLabel>
      <OutlinedInput
        id={id + "-input"}
        label={label}
        value={inputValue}
        onChange={onChange}
        disabled={dis}
        inputRef={inputRef}
        startAdornment={
          <InputAdornment position="start">
            <IconButton
              color={buttonColor}
              aria-label="decrement"
              onClick={(e) => handleButton(-1)}
              edge="start"
            >
              <RemoveCircle />
            </IconButton>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              color={buttonColor}
              aria-label="increment"
              onClick={(e) => handleButton(1)}
              edge="end"
            >
              <AddCircle />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
