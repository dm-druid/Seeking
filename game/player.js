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
        
        // define the parameters
        this.velocity = 100;
    }
    
    update(delta, t) {
        // console.log(delta);
        var x = 0, z = 0;
        if (moveForward) { z -= this.velocity; }
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
        var cube = GeoFactory.getCube();
    }
};


var moveBackward = false;
var moveForward = false;
var moveLeft = false;
var moveRight = false;
var skillCD = true;

var onKeyDown = function ( event ) {
    switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
        case 65: // a
            moveLeft = true; 
            break;
        case 40: // down
        case 83: // s
            moveBackward = true;
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            break;
        case 32: // space
            if ( skillCD === true ) {
                player.skill();
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