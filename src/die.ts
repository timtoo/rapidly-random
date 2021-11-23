/* Handle dice notation parsing and rolls 

See: [Dice notation](https://en.wikipedia.org/wiki/Dice_notation)

Our notation can handle:

- standard: 3d6
- with optional multiplier: 3d6x5
- with optional modifier: 3d6+2 or 3d6x5+2
- with optional repeat: 4x(3d6+2)
- 1d6 is default, so these are equivalent: d, d6, 1d

We have several extensions to the above notation. 

The main addition is the ability to specify a lower bound (or a minimum value) on 
a dice rather than the assumed value of 1. This may be imagined by a rule stating
that if any dice roles are below the given value those dice are re-rolled until 
they meet or exceed the minimum value.

To optionally note this role, append immedately after the die number (ie. number 
of sides, or maximum value) a greater than sign (closing angle bracket) followed 
by the minimum value. For example:

- 3 to 6: 1d6>3
- 8 to 12: 1d6>3
- 8 to 12 minus 4 (effectively 4 to 8): d12>8-4
- 2 to 6: d>2

In addition we add the concept of flags to the end of the notation. A flag
is a single letter. There may be multiple flags, or no flags. 

The flags are:

- exclusive mode: x
- zero based mode: z 

Exclusive mode means the upper bound (die number) is one more than the highest
possible number. Zero based means we start counting at zero rather than one. 
These flags are redundant in that the range could be expressed in absolute 
numbers, but they add semantic meaning for some uses.

- 0 to 5: 1d6xz or 1d6>0x or 1d5>0 

Other notes:

- If the upper bound is is less than the lower, they will be swapped
- You can use negative numbers for upper and lower bounds (1d-1>-6)
- zero flag will not override explictly specified lower bound
    - 1d6>1z is still just 1d6 despite the zero base flag. 

*/


const DEFAULT_MIN:number = 1;
const DEFAULT_MAX:number = 6;
const DEFAULT_ROLLS:number = 1;
const DEFAULT_MULT:number = 1;
const DEFAULT_MOD:number = 0;
const DEFAULT_REPEAT:number = 1;

const MULTIPY_CHARS:string = "x×*";
const DIVIDE_CHARS:string = "/÷";

const DieRegExp = new RegExp(`\\b((?<repeat>\\d+)[${MULTIPY_CHARS}]\\(?)?(?<rolls>\\d*)[dD](?<max>-?\\d*)(\>(?<min>-?\\d+))?((?<mult>[${MULTIPY_CHARS}${DIVIDE_CHARS}]\\d+)(?<mod>[+-]\\d+)|(?<mod1>[+-]\\d+)(?<mult1>[${MULTIPY_CHARS}${DIVIDE_CHARS}]\\d+)|(?<mod2>[+-]\\d+)|(?<mult2>[${MULTIPY_CHARS}${DIVIDE_CHARS}]\\d+))?(?<flag1>[xXzZ])?(?<flag2>[xXzZ])?\\b`);


class Die {
    min: number;
    max: number;
    rolls: number;
    mod: number;
    mult: number;
    repeat: number;
    zerobase: boolean;
    exclusive: boolean;

    parsedText: string;
    rid: number;

    constructor(min:number|string=DEFAULT_MIN,
                max=DEFAULT_MAX, 
                rolls=DEFAULT_ROLLS, 
                mod=DEFAULT_MOD, 
                mult=DEFAULT_MULT, 
                repeat=DEFAULT_REPEAT
                ) {
        this.min = DEFAULT_MIN // default minimum allowed
        this.max = max; // sides of dice
        this.rolls = rolls; // number of times to roll dice
        this.mod = mod; // positive or negative modifier
        this.mult = mult; // multiplier (decimal to divide)
        this.repeat = repeat; // how many times to roll the above

        this.zerobase = false; // zero is lowest instead of one
        this.exclusive = false; // subtract 1 from highest dice number

        this.parsedText = '';

        if (typeof min === "string") {
            let result = this.parse(min);
            if (result === null) throw new Error("Invalid dice notation");
        }
        else { this.min = min; }

        this.rid = Math.random(); // meaningless random number
    }

    // the minimum and maximum possible range to roll
    // note: probabilty distribution may not be even if repeats?
    range(): [number, number] {
        let min = ((this.rolls * this.mult) + this.mod) * this.repeat;
        let max = ((this.max * this.rolls * this.mult) + this.mod) * this.repeat;
        if (this.exclusive) max--;
        return [min, max];
    } 

    one_roll(): number {

        let min = (this.min * this.rolls)
        let max = (this.max * this.rolls)

        let result = min

        if (!this.exclusive) max++;

        if (min < max) {
            result = Math.floor(Math.random() * (max - min)) + min;
        }
        result = Math.round(result * this.mult); // maybe should FLOOR?
        result += this.mod;

        return result;
    }

    roll(): number {
        let result = this.one_roll();
        if (this.repeat > 1) {
            for (let i=1; i < this.repeat; i++) {
                result += this.one_roll();
            }
        }
        return result;
    }

    clone() {
        const d = new Die(
            this.min,
            this.max,
            this.rolls,
            this.mod,
            this.mult,
            this.repeat,
        )
        d.exclusive = this.exclusive;
        d.zerobase = this.zerobase;
        return d;
    }

    toString(compact=false): string {
        let value = `${this.rolls}d${this.max}`

	//if (this.min !== 1) value += ">" + this.min;
	//if (this.min !== 1 || (this.min === 0 && (! this.zerobase))) value += ">" + this.min;
	if (this.min !== 1) {
		if (!(this.min === 0 && this.zerobase)) value += ">" + this.min;
	}
        if (this.mult>1) value += 'x' + this.mult
        if (this.mult>0 && this.mult<1) value += '/' + Math.round(1/this.mult)

        if (this.mod>0) value += '+' + this.mod;
        if (this.mod<0) value += this.mod;

        if (this.repeat>1) value = `${this.repeat}x(${value})`;

        if (compact) {
            if (this.max === 6) value = value.replace('d6', 'd');
            if (this.rolls === 1) value = value.replace('1d', 'd');
        }

	if (this.exclusive) value += 'x';
	if (this.min === 0 && this.zerobase) value += 'z';

        return value
    }

    parse(s: string): Die | null {
        const match = DieRegExp.exec(s);

        if (match) {
            console.log(match.groups)
            this.parsedText = s;
            this.repeat = match.groups?.repeat ? +match.groups.repeat : DEFAULT_REPEAT;
            this.rolls = match.groups?.rolls ? +match.groups.rolls : DEFAULT_ROLLS;
            this.mod = +(match.groups?.mod2 || match.groups?.mod1 || match.groups?.mod || DEFAULT_MOD);
            this.max = match.groups?.max ? +match.groups.max : DEFAULT_MAX;
            this.min = match.groups?.min ? +match.groups.min : DEFAULT_MIN;

            if (this.min > this.max) [this.min, this.max] = [this.max, this.min]

            this.mult = DEFAULT_MULT;
            let mult:string|undefined = match.groups?.mult2 || match.groups?.mult1 || match.groups?.mult;
            if (mult) {
                (DIVIDE_CHARS.indexOf(mult[0]) >=0) 
                        ? this.mult = 1/+mult.slice(1) 
                        : this.mult = +mult.slice(1);
            }

            this.exclusive = false;
            this.zerobase = false;

            [match.groups?.flag1, match.groups?.flag2].map((e) => {
                if (e) {
                    if (e.toLowerCase() === 'x') this.exclusive = true;
                    if (e.toLowerCase() === 'z') this.zerobase = true;
                    if (this.zerobase && match.groups?.min === undefined) {
                        this.min = 0
                    }
                }
                return e;
            })

            this.rid = Math.random();
            return this;
        }
        return null;
    }

}

const test_dice: { [key: string]: Die} = {
        'd': 		new Die(),
        'd6': 		new Die(),
        '1d6': 		new Die(),
        '2d6': 		new Die(6,2),
        '5d20': 	new Die(20,5),
        '3d12': 	new Die(12,3),
        '3d12+4': 	new Die(12,3,4),
        '3d12-5': 	new Die(12,3,-5),
        '4d8x3': 	new Die(8,4,0,3),
        'd8/2': 	new Die(8,1,0,0.5),
        'd/3': 		new Die(6,1,0,0.3333333333),
        '10d100/4+5': 	new Die(100,10,5,0.25),
        '4x(10d100/4+5)': new Die(100,10,5,0.25,4),
        '4x(10d100+5/4)': new Die(100,10,5,0.25,4), // wrong, but we got it
        '3xd':	 	new Die(6,1,0,1,3),
        '1d6>2': 	new Die(),
        '1d5>0': 	new Die(),
        '1d6>0x': 	new Die(),
        '1d6xz': 	new Die(),
        '1d6>1z': 	new Die(),
        '1d6>3': 	new Die(),
        'd12>8-4': 	new Die(),
        'd>2': 		new Die(),
        'd-6>10': 		new Die(),
        'd-6>-10': 		new Die(),
}

function testdie(): void {

    for (let ds in test_dice) {
	    let d = new Die(ds);
            console.log(ds, '=', d.toString() )
            console.log(JSON.stringify(d))
            console.log("")
    }
}

if (typeof require !== 'undefined' && require.main === module) {
    testdie();
}

export { Die, DieRegExp };
