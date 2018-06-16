class Monster {
    constructor() {
        this.color = Colors.brownDark;

        var geom = new THREE.ConeBufferGeometry(10, 24, 20);
        var mat = new THREE.MeshLambertMaterial({
                color: this.color, 
                transparent: true,
                opacity: 0.95,
        });
        var obj = new THREE.Object3D();
        for (var d in RotateNormal) {
            var cone = new THREE.Mesh(geom.clone(), mat);
            var rotation = RotateNormal[d];
            cone.rotation.set(rotation.x, rotation.y, rotation.z);
            var translate = DirNormal[d];
            cone.position.set(translate.x * 15, translate.y * 15, translate.z * 15);
            obj.add(cone);
        }
        var p = floorMap.giveRandomPlace();
        this.coor = p;
        do {
            var dir = dirGenerator.randomDir();
        } while (floorMap.checkByCoor( p, dir));
        this.dir = dir;
        this.opdir = {x:-dir.x, y:-dir.y, z:-dir.z};
        obj.position.set(p.x + dir.x * cubeUnit, p.y + dir.y * cubeUnit, p.z + dir.z * cubeUnit);
        // console.log(obj.position);
        this.obj = obj;
        this.isMoving = false;
        this.moveDirIndex = 0;

        var that = this;
        this.tween = new TWEEN.Tween(this.obj.position)
                    .onStart(function(){ that.isMoving = true; })
                    .onComplete(function() { that.isMoving = false; })
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(function() {
                        var playerPos = player.obj.position;
                        var monsterPos = that.obj.position;
                        if (detectCollision(playerPos, monsterPos, 25)) {
                            YouLose();
                        }
                    });
    }

    update() {
        if (this.isMoving) { return; }
        // get the available directions
        var pp, dir, p = this.obj.position;
        while (true) {
            dir = dirGenerator.dirList[this.moveDirIndex];
            if (!floorMap.checkByCoor(p, dir)) {
                pp = floorMap.moveCoor(p, dir);
                if (floorMap.checkByCoor(pp, this.opdir)){
                    break;
                }
            }
            this.moveDirIndex = dirGenerator.generateDir(this.moveDirIndex);
        }
        // start the animation
        this.tween.to(pp)
        this.tween.start();
    }

}