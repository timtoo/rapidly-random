import { Die } from 'src/die';

export enum MODE {
  default,
  binary,
  dice,
  hex,
  yesno,
}

export const MODES: [number, string][] = [
  [MODE.default, 'Normal'],
  [MODE.binary, 'Binary'],
  [MODE.dice, 'Dice'],
  [MODE.hex, 'Hex'],
  [MODE.yesno, 'Yes/No'],
];

export const MODE_ICON: {
  [key: number]: string;
} = {
  [MODE.default]: 'tag',
  [MODE.hex]: 'hexagon',
  [MODE.dice]: 'casino',
  [MODE.binary]: 'share',
  [MODE.yesno]: 'help',
};

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
