class FloorMap {
    constructor(l, x, y, z) {
        // set the length of an edge
        this.n = l;
        // set the orgin coordinates
        // this point contains the smallest value of each axis
        this.ox = x;
        this.oy = y;
        this.oz = z;
        // init 3D map
        this.cubeMap = []; 
        for (var i=0; i<l; ++i){
            var arr2 = []
            for (var j=0; j<l; ++j) {
                var arr1 = []
                for (var k=0; k<l; ++k) {
                    arr1.push(0);
                }
                arr2.push(arr1);
            }
            this.cubeMap.push(arr2);
        }
    }

    get cubeUnit() {
        return 50;
    }

    pos2Coor(i, j, k) {
        var coord =  { 
            x: this.ox + i * this.cubeUnit,
            y: this.oy + j * this.cubeUnit,
            z: this.oz + k * this.cubeUnit
        };
        return coord;
    }

    coor2Pos(c) {
        var pos = {
            i: Math.floor((c.x - this.ox) / this.cubeUnit),
            j: Math.floor((c.y - this.oy) / this.cubeUnit),
            k: Math.floor((c.z - this.oz) / this.cubeUnit),
        }
        return pos;
    }

    movePos(pos, dir) {
        return {
            i: pos.i + dir.x, 
            j: pos.j + dir.y, 
            k: pos.k + dir.z,
        };
    }

    getCubeByPos(x, y, z) {
        return this.cubeMap[y][z][x];
    }

    giveCubePosition() {
        var points = [];
        var l = this.n;
        for (var i=0; i<l; ++i){
            for (var j=0; j<l; ++j) {
                for (var k=0; k<l; ++k) {
                    if (this.getCubeByPos(i, j, k) == 1) {
                        var pos = this.pos2Coor(i, j, k);
                        points.push(pos);
                    }
                }
            }
        }
        this.points = points;
        return points;
    }

    produceMap(routeNumber) {
        for (var k=0; k<routeNumber; ++k) {
            var nd = [this.n - 1, this.n - 1, this. n - 1]; // the number for each direction
            var dir = [];
            var r = 3; // random parameter
            for (var i=0; i< (this.n-1); ++i) {
                var t = getRandomInt(r);
                while (nd[t] <= 0) { t = getRandomInt(r); }
                dir.push(t); dir.push(t); dir.push(t);
                nd[t] -= 3;
            }
            // transfer the dir into cube coordinates
            var x = 0, y = 0, z = 0;
            for (var d of dir) {
                var delta;
                switch (d){
                    case 0: delta = Dir.right; break;
                    case 1: delta = Dir.up; break;
                    case 2: delta = Dir.front; break;
                }
                x += delta.x; y += delta.y; z += delta.z;
                this.cubeMap[y][z][x] = 1;
            }
        }
        return this.giveCubePosition();
    } 

    checkByCoor(cubeCoor, dir) {
        var p = this.coor2Pos(cubeCoor);
        return this.checkByPos(p, dir);
    }

    checkByPos(cubePos, dir) {
        var n = this.n;
        var i = cubePos.i + dir.x;
        var j = cubePos.j + dir.y;
        var k = cubePos.k + dir.z;
        if (i<0 || i>=n || j <0 || j>=n || k<0 || k>=n) { return false; }
        if (this.getCubeByPos(i, j, k) == 1) { return true; }
        return false;
    }

    getBirthPlace() {
        var cubeId = getRandomInt(this.points.length);
        while (this.checkByCoor(this.points[cubeId], Dir.up)) { cubeId = getRandomInt(this.points.length); }
        var p = this.points[cubeId];
        // var aboveCube = {x:p.x, y:p.y + this.cubeUnit, z:p.z};
        return p;
    }
}


class GeoFactory {
    constructor() {
        this.cubes = new Map(); // a dictionary
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
        var mat = new THREE.MeshPhongMaterial({
            overdraw: true, 
            color: color,
            transparent:true,
            opacity:.8,
        });
        var cube = new THREE.Mesh(geo, mat);
        this.cubes.set(color, cube);
        return cube;
    }

    static getCube(color) {
        if (this.cubes.has(color)) {
            return this.cubes.get(color);
        }
        else {
            return this.createCube(color);
        }
    }

}