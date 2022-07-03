import { Die } from 'src/die';

export enum MODE {
  default,
  dice,
  binary,
  hex,
}

export const MODES: [number, string][] = [
  [0, 'Normal'],
  [1, 'Dice'],
  [2, 'Binary'],
  [3, 'Hex'],
];

export type rollHistoryType = {
  label: string;
  die: Die;
  mode: MODE;
  time: Date;
};

export type saveStateDictType = {
  [key: string]: Die;
};

export type stateType = {
  die: Die;
  rolls: rollHistoryType[]; // history of actual rolls (random results)
  lastTime: Date;
  history: rollHistoryType[]; // mode/range history
  newQuantity: number;
  needUpdate: number;
};
