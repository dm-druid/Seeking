function startGame() {
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    document.getElementById('number').innerHTML = 'Score: ' + player.treasure.length;
    document.getElementById('target-number').innerHTML = '/ ' + routeNumber;
    var startButton = document.getElementById('start-button');
    startButton.style.visibility = 'hidden';
    var tween1 = new TWEEN.Tween(player.obj.rotation)
        .to({x:-0, y:-0, z:-0}, 1000)
        .onComplete(function() { 
            startFlag = true; 
        })
        .easing(TWEEN.Easing.Quadratic.Out);
    tween1.start();
}

var lose = false;
function stopAll() {
    // stop every tween animation
    player.tween.stop();
    player.rotateTween.stop();
    player.chainTween.stop();
    isMoving = true;
    lose = true;
    for (var m of monsters) {
        m.tween.stop();
    }
}

function YouLose() {
    stopAll();
    var loseWindow = document.getElementById('lose');
    loseWindow.style.visibility = "visible";
    loseWindow.addEventListener("click", function() {
        location.reload();
    }, false);
}

function YouWin() {
    isMoving = true;
    for (var m of monsters) {
        m.tween.stop();
    }
    var winWindow = document.getElementById('win');
    winWindow.style.visibility = "visible";
    winWindow.addEventListener("click", function() {
        location.reload();
    }, false);
}

