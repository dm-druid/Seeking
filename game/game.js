var stats;
var controls, clock;
var Colors = new ColorGenerator();

var rotateControl = 0;

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
    // rotate control
    document.getElementById('rotate').addEventListener('click', function() {
        rotateControl = 0.1 - rotateControl;
    }, false);
    // start the game
    threeStart();
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
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
    // simulate the sun's light
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
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

var previousTime = performance.now();
function animate() {
    renderer.render(scene, camera);
    // var delta = (performance.now() - previousTime) / 1000;
    player.update();//delta, previousTime);
    // previousTime = performance.now();
    TWEEN.update();
    // wholeMesh.rotation.y += rotateControl / 180 * Math.PI;
    requestAnimationFrame(animate);
}

const cubeUnit = 50;

function initObject() {
    createFloor();
    createCharacter();
    // 
}

var geoFactory = new GeoFactory();
var wholeMesh;
const Radian90 = 90 * Math.PI / 180;

// var floorRotationMat = [
//     new THREE.Matrix4().makeRotationX(0),       // up
//     new THREE.Matrix4().makeRotationX(r90),     // front
//     new THREE.Matrix4().makeRotationZ(-r90),    // right
//     new THREE.Matrix4().makeRotationX(2*r90),   // down
//     new THREE.Matrix4().makeRotationX(-r90),    // back
//     new THREE.Matrix4().makeRotationZ(r90),     // left
// ];
//     // [0,0,0], [1,0,0], [0,0,-1],[2*r90,0,0],[-r90,0,0], [0,0,r90]];
// var floorTranslation = [
//     new THREE.Matrix4().makeTranslation(0, 0, 0),       // up
//     new THREE.Matrix4().makeTranslation(0, -trh, trh),  // front
//     new THREE.Matrix4().makeTranslation(trh, -trh, 0),  // right
//     new THREE.Matrix4().makeTranslation(0, -trh*2, 0),  // down
//     new THREE.Matrix4().makeTranslation(0, -trh, -trh), // back
//     new THREE.Matrix4().makeTranslation(-trh, -trh, 0), // left
// ];
//     //[0,0,0], [0,0,trh], [trh,0,0], [0,-trh,0], [0,0,-trh], [-trh,0,0]];


var floorMap;
function createFloor() {
    wholeMesh = new THREE.Object3D();
    var floorGeometry = new THREE.Geometry();
    var geo = new THREE.CubeGeometry(cubeUnit, cubeUnit, cubeUnit);

    // get the floor cube positions
    floorMap = new FloorMap(10, 0, 0, 0); // 0 -> cubes' number of each edge; (0,0,0) -> origin
    var cubeCoords = floorMap.produceMap(5); // 10 -> random 10 paths int the cube map
    // add the cubeGeo into mesh
    for (var coord of cubeCoords){
        var cube = new THREE.Mesh(geo.clone());
        cube.position.x += coord.x;
        cube.position.y += coord.y;
        cube.position.z += coord.z;
        floorGeometry.mergeMesh(cube);
    }

    var material = new THREE.MeshPhongMaterial({
        overdraw: true, 
        color: Colors.generate(), //Colors.white,//
        transparent:true,
        opacity:.7,
    });
    var floor = new THREE.Mesh(floorGeometry, material);
    floor.castShadow = true;
    floor.receiveShadow = true;
    wholeMesh.add(floor);
    scene.add(wholeMesh);
}

function createCharacter() {
    player = new Player();
    scene.add(player.obj);
    // scene.add(player.group);
}
