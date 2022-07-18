import { Die } from 'src/die';

export enum MODE_ID {
  default,
  binary,
  dice,
  hex,
  yesno,
  note,
}

export interface mode_type {
  readonly id: MODE_ID;
  readonly name: string;
  readonly material_icon: string;
  readonly override: object;
  readonly quick: number[];
  readonly mapping?: { [key: number]: string[] };
}

interface mode_def_type {
  [key: number]: mode_type;
}

export const MODE: mode_def_type = {
  [MODE_ID.default]: {
    id: MODE_ID.default,
    name: 'Normal',
    material_icon: 'tag', 
    override: {
      zerobase: false,
      exclusive: false,
    },
    quick: [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 50, 100, 256, 1000, 1000000,
    ],
  },
  [MODE_ID.binary]: {
    id: MODE_ID.binary,
    name: 'Binary',
    material_icon: 'share',
    override: {
      zerobase: true,
      exclusive: false,
    },
    quick: [2, 4, 8, 16, 32, 64, 256, 256 * 256],
  },
  [MODE_ID.dice]: {
    id: MODE_ID.dice,
    name: 'Dice',
    material_icon: 'casino',
    override: {
      zerobase: false,
      exclusive: false,
      min: 1,
    },
    quick: [2, 4, 6, 8, 10, 12, 20, 100],
  },
  [MODE_ID.hex]: {
    id: MODE_ID.hex,
    name: 'Hexadecimal',
    material_icon: 'hexagon',
    override: {
      zerobase: true,
      exclusive: true,
    },
    quick: [
      16, 32, 64, 128, 256, 1024, 2048, 4096, 8192, 65536, 1048576, 16777216,
    ],
  },
  [MODE_ID.yesno]: {
    id: MODE_ID.yesno,
    name: 'Yes/No',
    material_icon: 'help',
    override: {
      zerobase: true,
      exclusive: true,
    },
    mapping: {
      [2]: ['No', 'Yes'],
      [3]: ['No', 'Yes', 'Maybe'],
      [4]: ['No', 'Yes', 'Probably not', 'Probably'],
      [5]: ['No', 'Yes', 'Probably not', 'Probably', 'Whatever'],
    },
    quick: [2, 3, 4, 5],
  },
  [MODE_ID.note]: {
    id: MODE_ID.note,
    name: 'Music Note',
    material_icon: 'help',
    override: {
      zerobase: false,
      exclusive: false,
      min: 1,
      max: 12,
    },
    quick: [7, 12],
    mapping: {
      [7]: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
      ],
      [12]: [
        'A',
        'A#/Bb',
        'B',
        'C',
        'C#/Db',
        'D',
        'D#/Eb',
        'E',
        'F',
        'F#/Gb',
        'G',
        'G#/Ab',
      ],
    },
  },
};

export const yesno_answers = ['No', 'Yes', 'Maybe'];

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
