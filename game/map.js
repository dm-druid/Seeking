var surface = [];
current = 0;
class FloorMap {
    constructor(s) {
        this.row = s.length;
        this.col = s[0].length;
        this.data = s;
    }

    get cubeUnit() {
        return 50;
    }

    static getLocation(x, z) {
        var j = Math.round((x + 1000) / 50);
        var i = Math.round((z + 1000) / 50);
    }

    giveFloorPosition() {
        var points = []
        for (var i=0; i<this.row; ++i) {
            for (var j=0; j<this.col; ++j) {
                if (this.data[i][j] === 'x') {
                    points.push([j * this.cubeUnit, i * this.cubeUnit]);
                }
            }
        }
        return points;
    } 

    check(x, z) {
        // console.log(x, z);
        var j = Math.round((x + 1000) / 50);
        var i = Math.round((z + 1000) / 50);
        if (this.data[i][j] === 'x') {
            return true;
        }
        return false;
    }

    static init() {
        for (var i=0; i<mapStrings.length; ++i) {
            surface.push(new FloorMap(mapStrings[i]));
        }
    }
}

var mapStrings = [
    [
        ".....x..................................",
        "...xxxxx................................",
        ".......x................................",
        ".......x................................",
        ".......xxxxxxxx.........................",
        ".............xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................xxxxxxxxxxxxxxxxxxxx",
        "......................x.....x...........",
        ".....xxxxxxxxxxxxxxxxxxx................",
        "...xxxxx................................",
        ".......x................................",
        ".......x................................",
        ".......xxxxxxxx.........................",
        ".............xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................xxxxxxxxxxxxxxxxxxxx",
        "....................xxx.....x...........",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................xxxxxxxxxxxxxxxxxxxx",
        "......................x.....x...........",
    ],
    [
        ".....x..................................",
        "...xxxxx................................",
        ".......x................................",
        ".......x................................",
        ".......xxxxxxxx.........................",
        ".............xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................x...................",
        "....................xxxxxxxxxxxxxxxxxxxx",
        "......................x.....x...........",
    ],
]


class GeoFactory {
    constructor() {
        this.cubes = new Map();
    }

    createFloor(color) {
        var geo = new THREE.PlaneGeometry(2000, 2000, 20, 20);
        var mat = new THREE.MeshPhongMaterial({
            color:color,
            transparent:true,
            opacity:.3,
            shading:THREE.FlatShading,
        });
        var floor = new THREE.Mesh(geo, mat);
        floor.receiveShadow = true;
        return floor;
    }

    createCube(color) {
        var geo = new THREE.CubeGeometry(cubeUnit, cubeUnit, cubeUnit);
        var material = new THREE.MeshPhongMaterial({
            overdraw: true, 
            color: color,
            transparent:true,
            opacity:.8,
        });
        var cube = new THREE.Mesh(floorGeometry, material);
        this.cubes.set(color, cube);
        return cube;
    }

    static getCube(color) {
        return this.cubes.get(color);
    }

}