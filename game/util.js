const sumReducer = (accumulator, currentValue) => accumulator + currentValue;

Array.prototype.contains = function(obj) {   
    var i = this.length;   
    while (i--) {   
      if (this[i] === obj) {   
        return i;  
      }   
    }   
    return false;   
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var DirNormal = {
    right:{x:1, y:0, z:0},
    up: {x:0, y:1, z:0},
    front: {x:0, y:0, z:1},
    left:{x:-1, y:0, z:0},
    down: {x:0, y:-1, z:0},
    back: {x:0, y:0, z:-1},
}


const Radian90 = Math.PI / 2;
var RotateNormal = {
    right : {x:0, y:0, z:-Radian90},
    up : {x:0, y:0, z:0},
    front : {x:Radian90, y:0, z:0},
    left : {x:0, y:0, z:Radian90},
    down : {x:0, y:0, z: 2*Radian90},
    back : {x:-Radian90, y:0, z:0},
}


class DirGenerator{

    constructor() {
        this.right = {x:1, y:0, z:0};
        this.up    = {x:0, y:1, z:0};
        this.front = {x:0, y:0, z:1};
        this.left  = {x:-1, y:0, z:0};
        this.down  = {x:0, y:-1, z:0};
        this.back  = {x:0, y:0, z:-1};
        this.dirList  = [this.right, this.up, this.front, this.down, this.back, this.left];
    }

    randomDir() {
        var i = getRandomInt(this.dirList.length);
        return this.dirList[i];
    }

    generateDir(i) {
        i = (i+1) % this.dirList.length;
        return i;
    }
} 

var dirGenerator = new DirGenerator();

function paintCube() {
    var cube = floorMap.getInstanceByPos(player.cube);
    var playerColor = cube.material.color;

    var type = floorMap.getCubeByPos(player.cube);
    console.log(type);
    var value;
    if (player.treasure.contains(type) !== false) {
        value = new THREE.Color(Colors.colorMap[type-1]);
    }
    else { 
        value = new THREE.Color(Colors.random());
    }
    var tween = new TWEEN.Tween(playerColor)
            .to(value, 500)
            .easing(TWEEN.Easing.Quartic.In)
            .start();
}

function detectCollision(pos1, pos2, radius) {
    var dist = Math.pow(pos1.x - pos2.x, 2) 
             + Math.pow(pos1.y - pos2.y, 2)
             + Math.pow(pos1.z - pos2.z, 2);
    if (dist < Math.pow(radius, 2)) {
        return true;
    }
    return false;
}

class ColorGenerator {
    constructor() {
        this.red = 0xf25346;
        this.white = 0xd8d0d1;
        this.brown = 0x59332e;
        this.pink = 0xF5986E;
        this.brownDark = 0x23190f;
        this.blue = 0x68c3c0;
        this.green = 0x537f60;
        this.purple = 0x8e4c59;
        this.yellow = 0xffde63;
        this.colorList = [this.red, this.blue, this.purple, this.white, this.green, this.brown, this.yellow, ];
        this.l = this.colorList.length;
        this.index = 0;
        this.colorMap = [this.red, this.green, this.blue, this.purple, this.yellow];
    }

    random() {
        var i = getRandomInt(this.colorList.length);
        var color = this.colorList[i];
        return color;
    }

    generate() {
        var color =  this.colorList[this.index];
        this.index = (this.index + 1) % this.l;
        return color;
    }
}
