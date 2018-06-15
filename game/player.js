var RotateI = {t: 0};
var PreI = {t: 0};
var RotateAxis;
var RotateRadian;

class Player {
    // create the object
    constructor() {
        var obj = new THREE.Object3D();
        // create the body
        var geom = new THREE.BoxGeometry(50,50,50);
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.red, 
            shading: THREE.FlatShading,
            // transparent: true,
            // opacity: 0.7,
        });
        var body = new THREE.Mesh(geom, mat);
        body.castShadow = true;
        body.receiveShadow = true;

        var light = new THREE.DirectionalLight( 0xFFFFFF, 0.9 );
        light.position.set(20, 20 ,20);
        light.lookAt( new THREE.Vector3( 0, 0, 0));
        // var helper = new THREE.DirectionalLightHelper( light, 25 );
        light.target = obj;
        obj.add(light);

        // scene.add(helper);
        scene.add(light.target);

        camera.applyMatrix(new THREE.Matrix4().makeTranslation(0 , 200, 200));
        camera.lookAt( new THREE.Vector3( 0, 0, 0));
        
        obj.add(body);
        obj.add(camera);

        var p = floorMap.getBirthPlace(); // the coordinate the cube point
        this.cube = floorMap.coor2Pos(p); // record which cube that the player is attached on
        p.y += cubeUnit;
        obj.applyMatrix(new THREE.Matrix4().makeTranslation(p.x, p.y, p.z));
        
        this.obj = obj;

        // define the parameters
        this.velocity = 1;
        this.maxV = 2;
        this.power = 2;
        this.tween = new TWEEN.Tween(this.obj.position)
                    .onStart(function() { isMoving = true; })
                    .onComplete(function() { isMoving = false; })
                    .easing(TWEEN.Easing.Quadratic.Out);

        this.rotateTween = new TWEEN.Tween(RotateI)
                    .onStart(function() { isMoving = true; })
                    .onUpdate(function() { 
                        var deltaT = RotateI.t - PreI.t;
                        var q = new THREE.Quaternion().setFromAxisAngle(RotateAxis , RotateRadian * deltaT);
                        player.obj.applyQuaternion(q);
                        PreI.t = RotateI.t;
                    })
                    .onComplete(function() { 
                        Dir = player.produceDir(); 
                        console.log(Dir); 
                        isMoving = false; })
                    .to( {t: 1}, 500)
                    .easing(TWEEN.Easing.Back.Out);
                    
        this.chainTween = new TWEEN.Tween(this.obj.position)
                    .onStart(function() { isMoving = true; })
                    .easing(TWEEN.Easing.Quadratic.In);
        this.chainTween1 = new TWEEN.Tween(RotateI)
                    .onUpdate(function() { 
                        var deltaT = RotateI.t - PreI.t;
                        var q = new THREE.Quaternion().setFromAxisAngle(RotateAxis , RotateRadian * deltaT);
                        player.obj.applyQuaternion(q);
                        PreI.t = RotateI.t;
                    })
                    .to( {t: 1}, 500 )
                    .easing(TWEEN.Easing.Back.Out);
        this.chainTween2 = new TWEEN.Tween(this.obj.position)
                    .onComplete(function() { Dir = player.produceDir(); console.log(Dir); isMoving = false; })
                    .easing(TWEEN.Easing.Quadratic.Out);
        this.chainTween.chain(this.chainTween1, this.chainTween2);
    }
    
    produceDir() {
        var dir = {};
        var o = this.obj.localToWorld(new THREE.Vector3(0, 0, 0));
        // right
        var t = new THREE.Vector3(1, 0, 0);  
        t = this.obj.localToWorld(t).sub(o);
        dir.right = {x: Math.round(t.x), y: Math.round(t.y), z: Math.round(t.z)};
        // up
        t = new THREE.Vector3(0, 1, 0);  
        t = this.obj.localToWorld(t).sub(o);
        dir.up = {x: Math.round(t.x), y: Math.round(t.y), z: Math.round(t.z)};
        // front
        t = new THREE.Vector3(0, 0, 1);  
        t = this.obj.localToWorld(t).sub(o);
        dir.front = {x: Math.round(t.x), y: Math.round(t.y), z: Math.round(t.z)};
        // left
        t = new THREE.Vector3(-1, 0, 0);  
        t = this.obj.localToWorld(t).sub(o);
        dir.left = {x: Math.round(t.x), y: Math.round(t.y), z: Math.round(t.z)};
        // down
        t = new THREE.Vector3(0, -1, 0);  
        t = this.obj.localToWorld(t).sub(o);
        dir.down = {x: Math.round(t.x), y: Math.round(t.y), z: Math.round(t.z)};
        // back
        t = new THREE.Vector3(0, 0, -1);  
        t = this.obj.localToWorld(t).sub(o);
        dir.back = {x: Math.round(t.x), y: Math.round(t.y), z: Math.round(t.z)};

        t = dir.right;
        dir.rUpBack = dir.rDownFront = {x: t.x , y: t.y , z: t.z }; //{x: 1, y: 0, z: 0};//
        dir.rUpFront = dir.rDownBack = {x: -t.x , y: -t.y , z: -t.z };//{x: -1, y: 0, z: 0};//
        
        t = dir.front;
        dir.rDownLeft = dir.rUpRight = {x: t.x , y: t.y , z: t.z };//{x:0, y:0, z:1};//
        dir.rUpLeft = dir.rDownRight = {x: -t.x , y: -t.y , z: -t.z }; //{x:0, y:0, z:-1};
        
        return dir;
    }

    update() {
        // console.log(delta);
        if (isMoving) { return; }
        // check it!!!
        var x = this.obj.position.x, y = this.obj.position.y, z = this.obj.position.z;
        var rx = this.obj.rotation.x, ry = this.obj.rotation.y, rz = this.obj.rotation.z; 

        var move, dir, rotate, chain;
        var locatePos = floorMap.movePos(this.cube, Dir.up);
        
        if (moveUp) { 
            dir = Dir.back;
            if (floorMap.checkByPos(locatePos, dir)) {
                console.log('rotate 90');
                rotate = true;
                // change the data of cube position
                this.cube = floorMap.movePos(this.cube, Dir.back);
                this.cube = floorMap.movePos(this.cube, Dir.up);
                // set the rotate animation
                var d = Dir.rUpBack;
                RotateAxis = new THREE.Vector3(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
                RotateRadian =  (d.x + d.y + d.z) * Math.PI / 2;
                PreI.t = RotateI.t = 0;
            }
            else if (floorMap.checkByPos(this.cube, dir)) {
                console.log('move up');
                this.cube = floorMap.movePos(this.cube, dir);
                move = {x: x + dir.x * cubeUnit, y: y + dir.y * cubeUnit, z : z + dir.z * cubeUnit}; // backward
            }
            else {
                console.log('rotate 270');
                chain = true;
                var d = Dir.rDownBack;
                RotateAxis = new THREE.Vector3(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
                RotateRadian =  (d.x + d.y + d.z) * Math.PI / 2;
                PreI.t = RotateI.t = 0;
            }
        }
        if (moveDown) {
            dir = Dir.front;
            if (floorMap.checkByPos(locatePos, dir)) {
                console.log('rotate 90');
                rotate = true;
                this.cube = floorMap.movePos(this.cube, Dir.front);
                this.cube = floorMap.movePos(this.cube, Dir.up);
    
                var d = Dir.rUpFront;
                RotateAxis = new THREE.Vector3(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
                RotateRadian =  (d.x + d.y + d.z) * Math.PI / 2;
                PreI.t = RotateI.t = 0;
            }
            else if (floorMap.checkByPos(this.cube, dir)) {
                console.log('move down');
                this.cube = floorMap.movePos(this.cube, Dir.front);
                move = {x: x + dir.x * cubeUnit, y: y + dir.y * cubeUnit, z : z + dir.z * cubeUnit}; // forward
            }
            else {
                console.log('rotate 270');
                chain = true;

                var d = Dir.rDownFront;
                RotateAxis = new THREE.Vector3(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
                RotateRadian =  (d.x + d.y + d.z) * Math.PI / 2;
                PreI.t = RotateI.t = 0;
            }
        }
        if (moveLeft) {
            dir = Dir.left;
            if (floorMap.checkByPos(locatePos, dir)) {
                console.log('rotate 90');
                rotate = true;
                this.cube = floorMap.movePos(this.cube, dir);
                this.cube = floorMap.movePos(this.cube, Dir.up);

                var d = Dir.rUpLeft;
                RotateAxis = new THREE.Vector3(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
                RotateRadian =  (d.x + d.y + d.z) * Math.PI / 2;
                PreI.t = RotateI.t = 0;
            }
            else if (floorMap.checkByPos(this.cube, dir)) {
                console.log('move left');
                this.cube = floorMap.movePos(this.cube, dir);
                move = {x: x + dir.x * cubeUnit, y: y + dir.y * cubeUnit, z : z + dir.z * cubeUnit};  // left
            }
            else {
                console.log('rotate 270');
                chain = true;
                var d = Dir.rDownLeft;
                RotateAxis = new THREE.Vector3(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
                RotateRadian =  (d.x + d.y + d.z) * Math.PI / 2;
                PreI.t = RotateI.t = 0;
            }
        }
        if (moveRight) {
            dir = Dir.right;
            if (floorMap.checkByPos(locatePos, dir)) {
                console.log('rotate 90');
                rotate = true;
                this.cube = floorMap.movePos(this.cube, dir);
                this.cube = floorMap.movePos(this.cube, Dir.up);
                
                var d = Dir.rUpRight;
                RotateAxis = new THREE.Vector3(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
                RotateRadian =  (d.x + d.y + d.z) * Math.PI / 2;
                PreI.t = RotateI.t = 0;
            }
            else if (floorMap.checkByPos(this.cube, dir)) {
                console.log('move right');
                this.cube = floorMap.movePos(this.cube, dir);
                move = {x: x + dir.x * cubeUnit, y: y + dir.y * cubeUnit, z : z + dir.z * cubeUnit};  // right
            }
            else {
                console.log('rotate 270');
                chain = true;
                var d = Dir.rDownRight;
                RotateAxis = new THREE.Vector3(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z));
                RotateRadian =  (d.x + d.y + d.z) * Math.PI / 2;
                PreI.t = RotateI.t = 0;
            }
        }
        if (move) {
            console.log(this.cube);
            // var coor = floorMap.pos2Coor(this.cube.i, this.cube.j, this.cube.k);
            // this.light.position.set(coor.x, coor.y, coor.z);
            this.tween.to(move, 500);
            this.tween.start();
        }
        if (rotate) {
            this.rotateTween.start();
            console.log(this.cube);
        }
        if (chain) {
            var t = {x: x + dir.x * cubeUnit, y: y + dir.y * cubeUnit, z : z + dir.z * cubeUnit}; 
            this.chainTween.to(t, 500);
            var dir = Dir.down;
            t = {x: t.x + dir.x * cubeUnit, y: t.y + dir.y * cubeUnit, z : t.z + dir.z * cubeUnit}; 
            this.chainTween2.to(t, 500 );
            console.log(this.cube);
            this.chainTween.start();
        }
    }

    skill() {
        var color = Colors.pink;
        var cube = GeoFactory.getCube(color);
        var x = this.mesh.position.x, z = this.mesh.position.z;
        var j = Math.round((x + 1000) / 50), i = Math.round((z + 1000) / 50);
        var di, dj;
        switch (this.dir) {
            case 'up':
                di = -1; dj = 0; break;
            case 'down':
                di = 1; dj = 0; break;
            case 'left':
                di = 0; dj = -1; break;
            case 'right':
                di = 0; dj = 1; break;
        }
        for (var i=0; i<this.power; ++i) {
            var cube = getCube(Color.pink);
            cube.mesh.position.set()
            scene.add();
        }

    }
};


var moveDown = false;
var moveUp = false;
var moveLeft = false;
var moveRight = false;
var isMoving = false;
var skillCD = true;

var onKeyDown = function ( event ) {
    switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
            moveUp = true;
            player.dir = "up";
            break;
        case 37: // left
        case 65: // a
            moveLeft = true; 
            player.dir = "left";
            break;
        case 40: // down
        case 83: // s
            moveDown = true;
            player.dir = "down";
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            player.dir = "right";
            break;
        case 32: // space
            if ( skillCD === true ) {
                // player.skill();
            }
            break;
    }
};
var onKeyUp = function ( event ) {
    switch( event.keyCode ) {
        case 38: // up
        case 87: // w
            moveUp = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveDown = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }
};
document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );