const sumReducer = (accumulator, currentValue) => accumulator + currentValue;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var DirUp = {
    // name : 'DirUp',
    right : {x:1, y:0, z:0},
    up : {x:0, y:1, z:0},
    front : {x:0, y:0, z:1},
    left : {x:-1, y:0, z:0},
    down : {x:0, y:-1, z:0},
    back : {x:0, y:0, z:-1},
}

class ColorGenerator {
    constructor() {
        this.red = 0xf25346;
        this.white = 0xd8d0d1;
        this.brown = 0x59332e;
        this.pink = 0xF5986E;
        this.brownDark = 0x23190f;
        this.blue = 0x68c3c0;
        this.colorList = [this.pink, this.red, this.blue, this.brown, this.brownDark, this.white];
        this.l = this.colorList.length;
        this.index = 0;
    }

    generate() {
        var color =  this.colorList[this.index];
        this.index = (this.index + 1) % this.l;
        return color;
    }
}
