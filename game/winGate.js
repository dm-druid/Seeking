var loadComplete;

class WinGate {
    constructor() {
        var loader = new THREE.FontLoader();
        var obj = new THREE.Object3D();
        this.obj = obj;
        var that = this;
        var font = loader.load('font/droid_serif_bold.typeface.json', function ( font ) {
            var Geo = new THREE.TextGeometry( 'Win!', {
                font: font,
                size: 20,
                height: 10,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 4,
                bevelSegments: 5
            });
            var mat = new THREE.MeshLambertMaterial({
                color: Colors.purple, 
                transparent: true,
                opacity: 0.95,
            });
            var mesh = new THREE.Mesh(Geo, mat);
            mesh.position.set(-30, 0 ,0);
            
            loadComplete = true;
            that.obj.add(mesh);
            var p = floorMap.giveFinalPlace();
            that.obj.position.set(p.x, p.y +50, p.z);
        });
        
    }

    update() {
        if (loadComplete) {
            this.obj.rotation.y += 0.02;
        }
        var playerPos = player.obj.position;
        var winPos = this.obj.position;
        if (detectCollision(playerPos, winPos, 25) && player.treasure.length == routeNumber) {
            YouWin();
        }
    }
}