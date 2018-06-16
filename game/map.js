class FloorMap {
    constructor(l, x, y, z) {
        // set the length of an edge
        this.n = l;
        // set the orgin coordinates
        // this point contains the smallest value of each axis
        this.ox = x;
        this.oy = y;
        this.oz = z;
        this.birthPlace = undefined;
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
        // init 3D map for cube instance
        this.instanceMap = []; 
        for (var i=0; i<l; ++i){
            var arr2 = []
            for (var j=0; j<l; ++j) {
                var arr1 = []
                for (var k=0; k<l; ++k) {
                    arr1.push(0);
                }
                arr2.push(arr1);
            }
            this.instanceMap.push(arr2);
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

    moveCoor(coor, dir) {
        return {
            x: coor.x + dir.x * this.cubeUnit,
            y: coor.y + dir.y * this.cubeUnit,
            z: coor.z + dir.z * this.cubeUnit,
        }
    }

    getCubeByPos(p) {
        return this.cubeMap[p.j][p.k][p.i];
    }

    getInstanceByPos(p) {
        return this.instanceMap[p.j][p.k][p.i];
    }

    assignInstanceByCoor(coord, cube) {
        var p = this.coor2Pos(coord);
        // console.log(p);
        this.instanceMap[p.j][p.k][p.i] = cube;
    }

    giveCubePosition() {
        var points = [];
        var l = this.n;
        for (var i=0; i<l; ++i){
            for (var j=0; j<l; ++j) {
                for (var k=0; k<l; ++k) {
                    if (this.getCubeByPos({i:i, j:j, k:k}) > 0) {
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
        this.cubeMap[0][0][0] = 1;
        // var ddir = [
        //     [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        //     [2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 1, 1, 1, 2, 2, 2],
        //     [2, 2, 2, 1, 1, 1, 0, 0, 0, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        // ];
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
            console.log(dir);
            // var dir = ddir[k];
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
                this.cubeMap[y][z][x] = k + 1;
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
        if (this.getCubeByPos({i:i, j:j, k:k}) > 0) { return true; }
        return false;
    }

    getBirthPlace() {
        if (!this.birthPlace) {
            var n = Math.floor(this.n / 2);
            var cubeCoor;
            do {
                var cubeId = getRandomInt(this.points.length);
                cubeCoor = this.points[cubeId];
                var p = this.coor2Pos(cubeCoor);
                console.log(p);
            } while (p.i > n || p.j > n || p.k > n || this.checkByPos(p, Dir.up));
            this.birthPlace = cubeCoor;
        }
        // var p = this.pos2Coor(2, 3, 0);
        return this.birthPlace;;
    }

    giveRandomPlace() {
        var cubeId = getRandomInt(this.points.length);
        var p = this.points[cubeId];
        while (this.checkByCoor(this.points[cubeId], Dir.up) || p == this.getBirthPlace()) { 
            cubeId = getRandomInt(this.points.length); 
            p = this.points[cubeId];
        }
        // var p = this.pos2Coor(2, 3, 0);
        return p;
    }

    giveFinalPlace() {
        var p = this.pos2Coor(this.n - 1, this.n - 1 , this.n - 1);
        return p;
    }
}

