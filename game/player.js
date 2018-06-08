class Player {
    // create the mesh
    constructor() {
        this.mesh = new THREE.Object3D();
        // create the body
        var geomCockpit = new THREE.BoxGeometry(40,40,50);
        var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
        var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);
        this.mesh.add(camera);
        
        // define the parameters
        this.velocity = 100;
        this.dir = "down";
        this.power = 2;
        this.tween = new TWEEN.Tween(this.mesh.position)
                    .onStart(function() { isMoving = true; })
                    .onStop(function() { isMoving = false; })
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(function() { console.log(this.x); });
    }
    

    update(delta, t) {
        // console.log(delta);
        if (isMoving) { return; }
        // check it!!!
        var x = this.mesh.position.x, z = this.mesh.position.z;
        if (moveForward) { 
            // this.tween.to({z : z - cubeUnit}, 1000);
            // this.tween.start();
            z -= this.velocity;
        }
        
        if (moveBackward) { z += this.velocity; }
        if (moveLeft) { x -= this.velocity; }
        if (moveRight) { x += this.velocity; }
        x = this.mesh.position.x + x * delta;
        z = this.mesh.position.z + z * delta;
        if (surface[current].check(x, z)) {
        // this.mesh.translateX(x * delta);
        // this.mesh.translateZ(z * delta);
            this.mesh.position.x = x;
            this.mesh.position.z = z;
        }
        // this.mesh.position.y = 50 + Math.sin(t/100) * 5;
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


var moveBackward = false;
var moveForward = false;
var moveLeft = false;
var moveRight = false;
var isMoving = false;
var skillCD = true;

var onKeyDown = function ( event ) {
    switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
            moveForward = true;
            player.dir = "up";
            break;
        case 37: // left
        case 65: // a
            moveLeft = true; 
            player.dir = "left";
            break;
        case 40: // down
        case 83: // s
            moveBackward = true;
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
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveBackward = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }
};
document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );