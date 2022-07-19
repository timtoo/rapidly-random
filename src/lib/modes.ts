export enum MODE_ID {
  default = 0,
  binary = 1,
  dice = 2,
  hex = 3,
  yesno = 4,
  note = 5,
}

interface override_interface {
  zerobase?: boolean;
  exclusive?: boolean;
  min?: number;
  max?: number;
}

class ModeBase {
  readonly id: number = -1; // enum
  readonly name: string = ''; // display string
  readonly material_icon: string = '';
  readonly override: override_interface = {}; // zerobase, inclusive, maybe min/max default settings
  readonly quick: number[] = []; // array of numbers to offer as quick buttons
  readonly default_max: number = -1; // default quick active button, essentially; also default mapping
  readonly summable?: boolean = true; // values can be added together
  readonly mappings?: { [max: number]: string[] }; // results to display rather than numbers
  quick_label: string[] = []; // optional labels to use instead of numbers on quick buttons

  coonstructor() {
    this.createQuickLabels();
  }

  // generate quick button label strings if none have been provided
  private createQuickLabels() {
    if (this.quick.length != this.quick_label.length) {
      for (const i of this.quick) {
        this.quick_label.push(i.toString());
      }
    }
  }

  // turn the number into a formatted string; override as needed
  formatValue(v: number): string {
    return v.toLocaleString();
  }

  // Figure out if there are mappings and use those if they exist
  displayValue(v: number, max?: number): string {
    if (
      this.mappings &&
      max !== undefined &&
      Object.keys(this.mappings).includes(max.toString())
    ) {
      const mapping = this.mappings[max];
      console.log(v, ' ', max, ' ', this.mappings);
      if (!this.override.zerobase && v > 0) v--; // normalize for zerobase array
      //if (this.override.exclusive && max > 0) max--;
      if (v >= max) v = v % max;
      console.log(v, ' ', max, ' ', mapping);
      return mapping[v];
    } else {
      return this.formatValue(v);
    }
  }

  // override in case history string should be different from displayValue()
  historyValue(v: number, max?: number): string {
    return this.displayValue(v, max);
  }

  // if given multiple values, how to display them? depends on this.summable
  displayMulti(v: number[], max?: number): string {
    if (this.summable && v.length > 1) {
      return this._displayMultiWithTotal(v, max);
    } else {
      return this._displayMultiValsOnly(v, max);
    }
  }

  // return formated total, with individual values in brackets after
  _displayMultiWithTotal(v: number[], max?: number): string {
    const displayTotal = this.displayValue(v.reduce((p, c) => p + c));
    const displayVals = v.map((i) => this.displayValue(i, max));
    return displayTotal + ' (' + displayVals.join(',') + ')';
  }

  // alternate display without total
  _displayMultiValsOnly(v: number[], max?: number): string {
    const displayVals = v.map((i) => this.displayValue(i, max));
    return displayVals.join(',');
  }
}

class ModeNormal extends ModeBase {
  id = MODE_ID.default;
  name = 'Normal';
  material_icon = 'tag';
  override = {
    zerobase: false,
    exclusive: false,
  };
  quick = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 50, 100, 256, 1000, 1000000,
  ];
  default_max = 10;
}

class ModeBinary extends ModeBase {
  id = MODE_ID.binary;
  name = 'Binary';
  material_icon = 'share';
  override = {
    zerobase: true,
    exclusive: false,
  };
  quick = [2, 4, 8, 16, 32, 64, 256, 256 * 256];
  default_max = 256;

  displayValue(v: number, max: number): string {
    // to avoid constant leading zero in exclusive mode, modify max when passing in like:
    // props.roll.die.max - (props.roll.die.exclusive ? 1 : 0)
    return this.formatValue(v).padStart(max.toString(2).length, '0');
  }

  formatValue(v: number): string {
    return v.toString(2);
  }

  historyValue(v: number, max: number): string {
    return 'b' + this.displayValue(v, max);
  }
}

class ModeDice extends ModeBase {
  id = MODE_ID.binary;
  name = 'Dice';
  material_icon = 'casino';
  override = {
    zerobase: false,
    exclusive: false,
    min: 1,
  };
  quick = [2, 4, 6, 8, 10, 12, 20, 100];
  default_max = 6;
}

class ModeHex extends ModeBase {
  id = MODE_ID.hex;
  name = 'Hexidecimal';
  material_icon = 'hexagon';
  override = {
    zerobase: true,
    exclusive: true,
  };
  quick = [
    16, 32, 64, 128, 256, 1024, 2048, 4096, 8192, 65536, 1048576, 16777216,
  ];
  default_max = 256;

  formatValue(v: number): string {
    return v.toString(16);
  }

  historyValue(v: number, max: number): string {
    return 'x' + this.displayValue(v, max);
  }
}

class ModeYesNo extends ModeBase {
  id = MODE_ID.yesno;
  name = 'Yes/No';
  material_icon = 'help';
  override = {
    zerobase: true,
    exclusive: true,
  };
  summable = false;
  mappings = {
    [2]: ['No', 'Yes'],
    [3]: ['No', 'Yes', 'Maybe'],
    [4]: ['No', 'Yes', 'Probably not', 'Probably'],
    [5]: ['No', 'Yes', 'Probably not', 'Probably', 'Whatever'],
  };
  quick = [2, 3, 4, 5];
  default_max = 2;
}

class ModeNote extends ModeBase {
  id = MODE_ID.note;
  name = 'Musical Note';
  material_icon = 'music_note';
  override = {
    zerobase: false,
    exclusive: false,
    min: 1,
    max: 12,
  };
  summable = false;
  mappings = {
    [7]: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    [12]: [
      'A',
      'A♯/B♭',
      'B',
      'C',
      'C♯/D♭',
      'D',
      'D♯/E♭',
      'E',
      'F',
      'F♯/G♭',
      'G',
      'G♯/A♭',
    ],
  };
  quick = [7, 12];
  default_max = 2;
}
// &#x266d; - flat
// &#x266f; - sharp

export const MODE: { [mode: number]: ModeBase } = {
  [MODE_ID.default]: new ModeNormal(),
  [MODE_ID.binary]: new ModeBinary(),
  [MODE_ID.hex]: new ModeHex(),
  [MODE_ID.dice]: new ModeDice(),
  [MODE_ID.note]: new ModeNote(),
  [MODE_ID.yesno]: new ModeYesNo(),
};
