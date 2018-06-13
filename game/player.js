class Player {
    // create the object
    constructor() {
        var obj = new THREE.Object3D();
        // create the body
        var geom = new THREE.BoxGeometry(50,50,50);
        var mat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
        var body = new THREE.Mesh(geom, mat);
        body.castShadow = true;
        body.receiveShadow = true;
        var p = floorMap.getBirthPlace(); // the coordinate the cube point
        this.cube = floorMap.coor2Pos(p); // record which cube that the player is attached on
        p.y += cubeUnit;
        // body.applyMatrix(new THREE.Matrix4().makeTranslation(p.x, p.y, p.z));
        // camera.applyMatrix(new THREE.Matrix4().makeTranslation(p.x , p.y + 150, p.z + 150));
        // camera.lookAt( new THREE.Vector3( p.x, p.y, p.z ));
        camera.applyMatrix(new THREE.Matrix4().makeTranslation(0 , 150, 150));
        camera.lookAt( new THREE.Vector3( 0, 0, 0));

        obj.add(body);
        obj.add(camera);

        var group = new THREE.Object3D();
        obj.applyMatrix(new THREE.Matrix4().makeTranslation(-25, 25, 0));
        group.add(obj);
        this.group = group;

        obj.applyMatrix(new THREE.Matrix4().makeTranslation(p.x + 25, p.y -25, p.z));
        this.obj = obj;

        // body.applyMatrix(new THREE.Matrix4().makeTranslation(0, 20, 0));
        
        // define the parameters
        this.velocity = 1;
        this.maxV = 2;
        this.dir = "down";
        this.power = 2;
        this.tween = new TWEEN.Tween(this.obj.position)
                    .onStart(function() { isMoving = true; })
                    .onComplete(function() { isMoving = false; })
                    .easing(TWEEN.Easing.Quadratic.Out);
                    // .easing(TWEEN.Easing.Quadratic.In);
                    // .onUpdate(function() { 
                    //     if (player.velocity < this.maxV) { player.velocity += 0.25; }
                    // });
        this.rotateTween = new TWEEN.Tween(this.obj.rotation)
                    .onStart(function() { isMoving = true; })
                    .onComplete(function() { isMoving = false; })
                    .easing(TWEEN.Easing.Quadratic.Out);
    }
    

    update() {
        // console.log(delta);
        if (isMoving) { return; }
        // check it!!!
        var x = this.obj.position.x, z = this.obj.position.z;
        var rx = this.obj.rotation.x, rz = this.obj.rotation.z;
        var move, dir, rotate;
        var locatePos = floorMap.movePos(this.cube, Dir.up);
        if (moveUp) { 
            dir = Dir.back;
            if (floorMap.checkByPos(locatePos, dir)) {
                console.log('rotate 90');
                rotate = { x: rx + Radian90 };
            }
            else if (floorMap.checkByPos(this.cube, dir)) {
                console.log('move straightly');
                this.cube = floorMap.movePos(this.cube, Dir.back);
                move = {z : z - cubeUnit}; // backward
            }
            else {
                console.log('rotate 270');
                rotate = { x: rx + 3 * Radian90 };
            }
        }
        if (moveDown) {
            dir = Dir.front;
            if (floorMap.checkByPos(locatePos, dir)) {
                console.log('rotate 90');
                rotate = { x: rx - Radian90 };
            }
            else if (floorMap.checkByPos(this.cube, dir)) {
                console.log('move straightly');
                this.cube = floorMap.movePos(this.cube, Dir.front);
                move = {z : z + cubeUnit}; // forward
            }
            else {
                console.log('rotate 270');
                rotate = { x: rx - 3 * Radian90 };
            }
        }
        if (moveLeft) {
            dir = Dir.left;
            if (floorMap.checkByPos(locatePos, dir)) {
                console.log('rotate 90');
                rotate = { z: rz - Radian90 };
            }
            else if (floorMap.checkByPos(this.cube, dir)) {
                console.log('move straightly');
                this.cube = floorMap.movePos(this.cube, Dir.left);
                move = { x: x - cubeUnit}; // left
            }
            else {
                console.log('rotate 270');
                rotate = { z: rz - 3 * Radian90 };
            }
        }
        if (moveRight) {
            dir = Dir.right;
            if (floorMap.checkByPos(locatePos, dir)) {
                console.log('rotate 90');
                rotate = { z: rz + Radian90 };
            }
            else if (floorMap.checkByPos(this.cube, dir)) {
                console.log('move straightly');
                this.cube = floorMap.movePos(this.cube, Dir.right);
                move = { x: x + cubeUnit}; // right
            }
            else {
                console.log('rotate 270');
                
                // chainTween = new TWEEN.Tween(this.obj.position)
                //     .to( {x: x + cubeUnit} )
                //     .onStart(function() { isMoving = true; })
                //     .onComplete(function() { isMoving = false; })
                //     .easing(TWEEN.Easing.Quadratic.Out);
                // chainTween1 = new TWEEN.Tween(this.obj.rotation)
                //     .to( {z: rz - Radian90} )
                //     .easing
                // chainTween2 = new TWEEN.Tween(this.obj.positioin)
                //     .to( {} )

            }
        }
        if (move) {
            this.tween.to(move, 500);
            this.tween.start();
        }
        if (rotate) {
            this.rotateTween.to(rotate, 500);
            this.rotateTween.start();
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