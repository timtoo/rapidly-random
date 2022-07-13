import { Die } from 'src/die';

export enum MODE_ID {
  default,
  binary,
  dice,
  hex,
  yesno,
}

export interface mode_type {
  readonly id: MODE_ID,
  readonly name: string,
  readonly material_icon: string,
  readonly override: object
}

interface mode_def_type {
  [key: number]: mode_type
}

export const MODE: mode_def_type = {
  [MODE_ID.default]: {
    id: MODE_ID.default,
    name: 'Normal',
    material_icon: 'tag',
    override: {
      zerobase: false,
      exclusive: false
    } 
  },
  [MODE_ID.binary]: {
    id: MODE_ID.binary,
    name: 'Binary',
    material_icon: 'share',
    override: {
      zerobase: true,
      exclusive: false
    } 
  },
  [MODE_ID.dice]: {
    id: MODE_ID.dice,
    name: 'Dice',
    material_icon: 'casino',
    override: {
      zerobase: false,
      exclusive: false,
      min: 1
    } 
  },
  [MODE_ID.hex]: {
    id: MODE_ID.hex,
    name: 'Hexadecimal',
    material_icon: 'hexagon',
    override: {
      zerobase: true,
      exclusive: true
    } 
  },
  [MODE_ID.yesno]: {
    id: MODE_ID.yesno,
    name: 'Yes/No',
    material_icon: 'help',
    override: {
      zerobase: true,
      exclusive: true
    } 
  },
}

export type rollHistoryType = {
  label: string;
  die: Die;
  mode: MODE_ID;
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
