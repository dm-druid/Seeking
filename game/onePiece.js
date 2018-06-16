class OnePiece {
    constructor(type) {
        this.type = type;
        var factorR = 0, factorG = 0, factorB = 0;
        switch (type) {
            case 1: factorR = 1; factorG = 0; factorB = 0; break;
            case 2: factorR = 0; factorG = 1; factorB = 0; break;
            case 3: factorR = 0; factorG = 0; factorB = 1; break;
            case 1: factorR = 1; factorG = 1; factorB = 0; break;
            case 2: factorR = 0; factorG = 1; factorB = 1; break;
            case 3: factorR = 1; factorG = 0; factorB = 1; break;
            default: factorR = factorG = factorB = 1; break;
        }
        // start generate the treasure object
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
            var vx = (( x / n ) + 0.5) * factorR;
            var vy = (( y / n ) + 0.5) * factorG;
            var vz = (( z / n ) + 0.5) * factorB;
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
        var mesh = new THREE.Mesh( geometry, material );

        var p = floorMap.giveRandomPlace();
        this.coor = p;
        do {
            var dir = dirGenerator.randomDir();
        } while (floorMap.checkByCoor( p, dir));

        this.dir = dir;
        mesh.position.set(p.x + dir.x * cubeUnit, p.y + dir.y * cubeUnit, p.z + dir.z * cubeUnit);
        this.obj = mesh;
    }

    update() {
        this.obj.rotation.x += 0.05;
        this.obj.rotation.y += 0.01;
        this.obj.rotation.z += 0.02;
        var playerPos = player.obj.position;
        var onePos = this.obj.position;
        if (detectCollision(playerPos, onePos, 25)) {
            player.treasure.push(this.type);
            document.getElementById('number').innerHTML = 'Score: ' + player.treasure.length;
            scene.remove(this.obj);
            onePieces.splice(onePieces.contains(this), 1);
        }
    }

}