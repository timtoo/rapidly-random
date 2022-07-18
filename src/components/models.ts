import { Die } from 'src/lib/die';
import { MODE_ID } from 'src/lib/modes'

export interface mode_type {
  readonly id: MODE_ID;
  readonly name: string;
  readonly material_icon: string;
  readonly override: object;
  readonly quick: number[];
  readonly mapping?: { [key: number]: string[] };
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
