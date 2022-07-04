import { Die } from 'src/die';

export enum MODE {
  default,
  dice,
  binary,
  hex,
}

export const MODES: [number, string][] = [
  [MODE.default, 'Normal'],
  [MODE.dice, 'Dice'],
  [MODE.binary, 'Binary'],
  [MODE.hex, 'Hex'],
];

export const MODE_ICON = {
  [MODE.default]: 'star',
  [MODE.hex]: 'hexagon',
  [MODE.dice]: 'casino',
  [MODE.binary]: 'share',
}

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
