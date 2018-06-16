var stats;
var controls, clock;
var Colors = new ColorGenerator();

var rotateControl = 0;
var startFlag = false;
var routeNumber = 5;


window.onload = function() {
    // full screen control
    document.getElementById('full-btn').addEventListener('click', function() {
        if (BigScreen.enabled) {
            BigScreen.toggle();
        }
        else {
            alert("The browser doesn't support this function.");
        }
    }, false);

    document.getElementById('start-button').addEventListener('click', startGame ,false);
    threeStart();
}
// var cone;
var onePiece;
function testFunc() {
    var triangles = 100;
    var geometry = new THREE.BufferGeometry();
    var positions = [];
    var normals = [];
    var colors = [];
    var color = new THREE.Color();

    var n = 50, n2 = n / 2;	// triangles spread in the cube
    var d = 10, d2 = d / 2;	// individual triangle size
    var pA = new THREE.Vector3();
    var pB = new THREE.Vector3();
    var pC = new THREE.Vector3();
    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();
                
    for ( var i = 0; i < triangles; i ++ ) {
        // positions
        var x = Math.random() * n - n2;
        var y = Math.random() * n - n2;
        var z = Math.random() * n - n2;
        var ax = x + Math.random() * d - d2;
        var ay = y + Math.random() * d - d2;
        var az = z + Math.random() * d - d2;
        var bx = x + Math.random() * d - d2;
        var by = y + Math.random() * d - d2;
        var bz = z + Math.random() * d - d2;
        var cx = x + Math.random() * d - d2;
        var cy = y + Math.random() * d - d2;
        var cz = z + Math.random() * d - d2;
        positions.push( ax, ay, az );
        positions.push( bx, by, bz );
        positions.push( cx, cy, cz );
        // flat face normals
        pA.set( ax, ay, az );
        pB.set( bx, by, bz );
        pC.set( cx, cy, cz );
        cb.subVectors( pC, pB );
        ab.subVectors( pA, pB );
        cb.cross( ab );
        cb.normalize();
        var nx = cb.x;
        var ny = cb.y;
        var nz = cb.z;
        normals.push( nx, ny, nz );
        normals.push( nx, ny, nz );
        normals.push( nx, ny, nz );
        // colors
        var vx = 0;//( x / n ) + 0;
        var vy = 0;//( y / n ) + 0;
        var vz = ( z / n ) + 0.5;
        color.setRGB( vx, vy, vz );
        colors.push( color.r, color.g, color.b );
        colors.push( color.r, color.g, color.b );
        colors.push( color.r, color.g, color.b );
    }
    function disposeArray() { this.array = null; }
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
    geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ).onUpload( disposeArray ) );
    geometry.computeBoundingSphere();
                
    var material = new THREE.MeshPhongMaterial( {
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    } );
    mesh = new THREE.Mesh( geometry, material );
    var p = floorMap.getBirthPlace();
    mesh.position.set(p.x, p.y + 50, p.z);
    scene.add( mesh );
    onePiece = mesh;
}

function testColor() {
    //change the color
    // var playerColor = player.obj.children[1].material.color;
    var cube = floorMap.getInstanceByPos(player.cube);
    var playerColor = cube.material.color;
    console.log(playerColor);
    console.log(cube);
    var value = new THREE.Color(Colors.generate());
    var tween = new TWEEN.Tween(playerColor)
            .to(value, 500)
            .easing(TWEEN.Easing.Quartic.In)
            .start();
}

// var fieldOfView, aspectRatio, nearPlane, farPlane,
var scene, camera, renderer, HEIGHT, WIDTH;
var player;

function threeStart() {
    createScene();
    createLights();
    initObject();
    renderer.clear();
    // Initiate function or other initializations here
    animate();
}

function createScene() {
    // init the scene
    var HEIGHT = window.innerHeight;
    var WIDTH = window.innerWidth;
    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(0xf7d9aa, 0.003);

    // init the camera
    var aspectRatio = WIDTH / HEIGHT;
    var fieldOfView = 60;
    var nearPlane = 1;
    var farPlane = 10000;
    camera = new THREE.PerspectiveCamera(//THREE.OrthographicCamera
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane
    );

    // init renderer
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true, 
    });
    // set the size of the renderer
    renderer.setSize(WIDTH, HEIGHT);  
    // enable the shadowMap
    renderer.shadowMap.enabled = true;
    // add the renderer
    var container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    
    // resize the renderer if the window size changes
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    // update the camera's parameters
    var HEIGHT = window.innerHeight;
    var WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
    // HemisphereLight -> gradient color; para-> skyColor, goundColor, intensity
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .6)
    // simulate the sun's light
    shadowLight = new THREE.DirectionalLight(0xffffff, .4);
    // set the position of sun light
    shadowLight.position.set(150, 350, 350);
    // allow shadow cast
    shadowLight.castShadow = true;
    // define the visible area of shadow 
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    // shadow resolution
    shadowLight.shadow.mapSize.width = 1024;
    shadowLight.shadow.mapSize.height = 1024;

    // add to the scene
    scene.add(hemisphereLight);  
    scene.add(shadowLight);
}

function animate() {
    renderer.render(scene, camera);
    // var delta = (performance.now() - previousTime) / 1000;
    if (startFlag) {
        if (!lose) {
            player.update();
        }
        for (var m of monsters) {
            m.update();
        }
        for (var o of onePieces) {
            o.update();
        }
        winGate.update();
    }
    else {
        // console.log(player.obj.rotation);
        // player.obj.position = {x: 500, y:5000, z:600};
        player.obj.rotation.y += 0.01;
        // player.obj.rotation.x += 0.005;
    }
    TWEEN.update();
    requestAnimationFrame(animate);
}

const cubeUnit = 50;
var Dir;

function initObject() {
    createFloor();
    createCharacter();
    paintCube();
    createMonsters();
    createOnePieces();
    createWinGate();
}

// var wholeMesh;
var floorMap;

function createFloor() {
    Dir = DirNormal;
    // wholeMesh = new THREE.Object3D();
    var floorGroup = new THREE.Object3D();
    // var floorGeometry = new THREE.Geometry();
    var geo = new THREE.BoxBufferGeometry(cubeUnit, cubeUnit, cubeUnit);//CubeGeometry(cubeUnit, cubeUnit, cubeUnit);
    var mat = new THREE.MeshPhongMaterial({
        overdraw: true, 
        color: Colors.pink, //Colors.white,//
        transparent:true,
        opacity:.9,
    });

    // get the floor cube positions
    floorMap = new FloorMap(10, 0, 0, 0); // 0 -> cubes' number of each edge; (0,0,0) -> origin
    var cubeCoords = floorMap.produceMap(routeNumber); // 10 -> random 10 paths int the cube map
    // add the cubeGeo into mesh
    for (var coord of cubeCoords){
        var cube = new THREE.Mesh(geo.clone(), mat.clone());
        cube.position.x += coord.x;
        cube.position.y += coord.y;
        cube.position.z += coord.z;
        // floorGeometry.mergeMesh(cube);
        cube.castShadow = false;
        cube.receiveShadow = false;
        floorGroup.add(cube);
        floorMap.assignInstanceByCoor(coord, cube);
    }

    // var floor = new THREE.Mesh(floorGeometry, material);
    
    scene.add(floorGroup);
}

function createCharacter() {
    player = new Player();
    Dir = player.produceDir();
    scene.add(player.obj);
}

var monsters = []
function createMonsters() {
    // console.log(player.obj.position);
    for (var i=0; i < 3 * routeNumber; ++i) {
        var monster = new Monster();
        monsters.push(monster);
        scene.add(monster.obj);
    }
}

var onePieces = []
function createOnePieces() {
    for (var i=1; i <= routeNumber; ++i) {
        var onePiece = new OnePiece(i);
        onePieces.push(onePiece);
        scene.add(onePiece.obj);
    }
}
var winGate;
function createWinGate() {
    winGate = new WinGate();
    scene.add(winGate.obj);
}