var stats;
var controls, clock;
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

window.onload = function() {
    document.getElementById('full-btn').addEventListener('click', function() {
        if (BigScreen.enabled) {
            BigScreen.toggle();
        }
        else {
            alert("The browser doesn't support this function.");
        }
    }, false);
    // start the game
    threeStart();
}

var scene,camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,renderer, container;
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
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(0xf7d9aa, 0.0008);

    // init the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(//THREE.OrthographicCamera
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane
    );
    // set the position
    camera.position.x = 0;
    camera.position.z = 500;
    camera.position.y = 500;
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

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
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    
    // resize the renderer if the window size changes
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    // update the camera's parameters
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
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
    var delta = (performance.now() - previousTime) / 1000;
    player.update(delta, previousTime);
    previousTime = performance.now();
    requestAnimationFrame(animate);
}

const cubeUnit = 50;

function initObject() {
    createFloor();
    createCharacter();
    // 
}

var geoFactory = new GeoFactory();
function createFloor() {
    // add the floor
    var floor = geoFactory.createFloor(Colors.blue);
    floor.rotation.x = -90 * Math.PI / 180;
    scene.add(floor);

    // add the maps
    var geo = new THREE.CubeGeometry(cubeUnit, cubeUnit, cubeUnit);
    geo.applyMatrix(new THREE.Matrix4().makeTranslation(-1000, 0, -1000));
    
    var floorGeometry = new THREE.Geometry();
    FloorMap.init();
    var positions = (surface[current]).giveFloorPosition();
    for (var i=0; i<positions.length; ++i){
        var cube = new THREE.Mesh(geo.clone());
        cube.position.x += positions[i][0];
        cube.position.z += positions[i][1];
        floorGeometry.mergeMesh(cube);
    }
    var material = new THREE.MeshPhongMaterial({
        overdraw: true, 
        color: Colors.pink,
        transparent:true,
        opacity:.8,
    });
    var floor = new THREE.Mesh(floorGeometry, material);
    floor.castShadow = true;
    floor.receiveShadow = true;
    scene.add(floor);
}

function createCharacter() {
    player = new Player();
    player.mesh.position.y = 50;
    scene.add(player.mesh);
}
