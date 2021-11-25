import { Die } from "./die";

// [string to parse]: [expecte dice object], [expected string], [compact string]
const test_dice: { [key: string]: [Die, string, string?] } = {
    d: [new Die(), "1d6", "d"],
    D6: [new Die(), "1d6", "d"],
    "1d6": [new Die(1, 6, 1), "1d6", "d"],
    "2D6": [new Die(1, 6, 2), "2d6", "2d"],
    "5d20": [new Die(1, 20, 5), "", ],
    "3d12": [new Die(1, 12, 3), "", ],
    "3d12+4": [new Die(1, 12, 3, 4), "", ],
    "3d12-5": [new Die(1, 12, 3, -5), "", ],
    "4d8x3": [new Die(1, 8, 4, 0, 3), "", ],
    "4d8×3": [new Die(1, 8, 4, 0, 3), "4d8x3", ],
    "4d8*3": [new Die(1, 8, 4, 0, 3), "4d8x3", ],
    "d8/2": [new Die(1, 8, 1, 0, 0.5), "1d8/2", ],
    "2d8÷2": [new Die(1, 8, 2, 0, 0.5), "2d8/2", ],
    "d/3": [new Die(1, 6, 1, 0, 1/3), "1d6/3", ],
    "10d100/4+5": [new Die(1, 100, 10, 5, 0.25), "", ],
    "4x(10d100/4+5)": [new Die(1, 100, 10, 5, 0.25, 4), "", ],
    "4x(10d100+5/4)": [new Die(1, 100, 10, 5, 0.25, 4), "4x(10d100/4+5)", ], 
    "3xd": [new Die(1, 6, 1, 0, 1, 3), "3x(1d6)", ],
    "1d6>2": [new Die(2, 6), "", "d>2"],
    "1D5>0": [new Die(0, 5), "1d5>0", "d>5"],
    "1D6>0x": [new Die(0, 6, 1, 0, 1, 1, true, false), "1d6>0x", "d6>0x"],
    "1d6xz": [new Die(0, 6, 1, 0, 1, 1, true, true), "", "d6xz"],
    "1d6>1z": [new Die(1, 6, 1, 0, 1, 1, false, false), "1d6", "d"], // zero mode ignored due to >1
    "3d6z": [new Die(0, 6, 3, 0, 1, 1, false, false), "3d6z", "3dz"], 
    "1d6>3": [new Die(3, 6, 1, 0, 1, 1, false, false), "", "d6>3"],
    "d12>8-4": [new Die(8, 12, 1, -4, 1, 1, false, false), "1d12>8-4", ],
    "d>2": [new Die(2, 6, 1, 0, 1, 1, false, false), "1d6>2", "d>2" ],
    "d-6>10": [new Die(-6, 10, 1, 0, 1, 1, false, false), "1d10>-6", "d10>-6"],
    "d-6>-10": [new Die(-10, -6, 1, 0, 1, 1, false, false), "1d-6>-10", "d-6>-10"],
    "d6>-10x": [new Die(-10, 6, 1, 0, 1, 1, true, false), "1d6>-10x", "d>-10x"],
  };
  
expect.extend({
    toEqualWithMessage(recieved, target, message) {
        const pass = recieved === target
        if (pass) {
            return {
                message: () => `expected ${recieved} not to equal ${target}: ${message}`,
                pass: true
            }
        }
        else {
            return {
                message: () => `expected ${recieved} to equal ${target}: ${message}`,
                pass: false
            }
        }
    }
})

it("test dice constructor and parser", () => {
    for (let ds in test_dice) {
        let d = new Die(ds);
        console.log(ds, ' : ', test_dice[ds][1] || ds, " = ", d.toString(), " ", JSON.stringify(ds))
        expect(test_dice[ds][1] || ds).toEqualWithMessage(d.toString(), "key:"+ds)
        expect(d.equals(test_dice[ds][0])).toEqualWithMessage(true, JSON.stringify(d)+" != "+JSON.stringify(test_dice[ds][0]))
    }
})

it("test functions for expected results", () => {
    let d = new Dice()
    expect(d.getResult()).toEqualWithMessage(-1, "unrolled result should always be -1")
    d.roll()
    expect(d.result()).not.toEqual(-1)
    expect(new Die().roll()).not.toEqual(-1)
})