class ColorGenerator {
    constructor() {
        this.red = 0xf25346;
        this.white = 0xd8d0d1;
        this.brown = 0x59332e;
        this.pink = 0xF5986E;
        this.brownDark = 0x23190f;
        this.blue = 0x68c3c0;
        this.colorList = [this.red, this.blue, this.brown, this.pink, this.brownDark, this.white];
        this.l = this.colorList.length;
        this.index = 0;
    }

    generate() {
        var color =  this.colorList[this.index];
        this.index = (this.index + 1) % this.l;
        return color;
    }
}
