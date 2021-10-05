//sprite variables for the background
let bgBack;
let bgFar;
let bgMid;
let bgNear;
let bgPos = 0;
let bgSpeed = 0.1;

//global variables
const player = new PIXI.Container();
const playerSpeed = 3;
const keys = {};

const missiles = [];
const missileSpeed = 7;
const missileReloadTime = 1;
let missileReloading = false;

const enemies = [];
const enemySpeed = 3;
let enemySpawner;

function BgSetup() {
    bgPos = 0;
    bgSpeed = 0.1;

    bgBack = createBg(app.loader.resources["bgBackImg"].texture);
    bgFar = createBg(app.loader.resources["bgFarImg"].texture);
    bgMid = createBg(app.loader.resources["bgMidImg"].texture);
    bgNear = createBg(app.loader.resources["bgNearImg"].texture);
}

function createBg(texture) {
    let tiling = new PIXI.TilingSprite(texture, 800, 600);
    tiling.position.set(0, 0);
    app.stage.addChild(tiling);

    return tiling;
}

function moveBackground(delta) {
    bgPos = (bgPos - bgSpeed) * delta;

    bgBack.tilePosition.x = bgPos;
    bgFar.tilePosition.x = bgPos * 2;
    bgMid.tilePosition.x = bgPos * 5;
    bgNear.tilePosition.x = bgPos * 10;
}

// --- PLAYER SETUP AND MOVEMENT

function playerSetup(shipSprite) {
    playerShip = PIXI.Sprite.from(shipSprite);
    playerShip.width = 80;
    playerShip.height = 50;
    playerShip.anchor.set(0.5);
    player.addChild(playerShip);
    player.position.set(100, app.screen.height/2 - 25);
}


function playerRotate(cursorPos) {
    let angle = Math.atan2(
        cursorPos.y - player.position.y,
        cursorPos.x - player.position.x
    );
    player.rotation = angle;
}

function playerMove(delta) {
    //ship movement - arrow keys
    if(keys['37']) {
        player.x < 50 ? player.x : player.x -= playerSpeed * delta;
    }
    if(keys['38']) {
        player.y < 50 ? player.y : player.y -= playerSpeed * delta;
    }
    if(keys['39']) {
        player.x > 750 ? player.x : player.x += playerSpeed * delta;
    }
    if(keys['40']) {
        player.y > 550 ? player.y : player.y += playerSpeed * delta;
    }

    //ship movement - wasd
    if(keys['65']) {
        player.x < 50 ? player.x : player.x -= playerSpeed * delta;
    }
    if(keys['87']) {
        player.y < 50 ? player.y : player.y -= playerSpeed * delta;
    }
    if(keys['68']) {
        player.x > 750 ? player.x : player.x += playerSpeed * delta;
    }
    if(keys['83']) {
        player.y > 550 ? player.y : player.y += playerSpeed * delta;
    }
}

// --- SHOOTING AND MISSILE HANDLING
function shoot() {
    let missile = createMissile();
    missiles.push(missile);
    missileReloading = true;
    setTimeout(() => {
        missileReloading = false;
    }, missileReloadTime * 1000);
}

function createMissile() {
    let missile = new PIXI.Sprite.from(app.loader.resources["missileImg"].texture);
    missile.anchor.set(0.5);
    missile.position.x = player.position.x;
    missile.position.y = player.position.y;
    missile.rotation = player.rotation;
    missile.speed = missileSpeed;

    app.stage.addChild(missile);

    return missile;
}

function updateMissiles(delta) {
    missiles.forEach(missile => {
        missile.position.x += missile.speed * delta;

        if(missile.x < 0 || missile.x > 850 || missile.y < 0 || missile.y > 650) {
            app.stage.removeChild(missile);
            missiles.splice(missiles.indexOf(missile), 1);
        }
    });
}

// --- ENEMY SETUP AND MOVEMENT

function createEnemy() {
    let enemy = new PIXI.Sprite.from(app.loader.resources["enemyShipImg"].texture);
    enemy.width = 50;
    enemy.height = 80;
    enemy.anchor.set(0.5);
    enemy.position.x = 900;
    enemy.position.y = Math.floor(Math.random() * 500) + 50;
    enemy.rotation = -90 * (Math.PI / 180);
    enemy.speed = enemySpeed;

    app.stage.addChild(enemy);

    return enemy;
}

function updateEnemies(delta) {
    enemies.forEach(enemy => {
        enemy.position.x -= enemy.speed * delta;

        if(enemy.x < -50 || enemy.x > 950 || enemy.y < -50 || enemy.y > 650) {
            app.stage.removeChild(enemy);
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
}

//basic collision detection
function checkCollision() {
    enemies.forEach(enemy => {
        missiles.forEach(missile => {
            if(isCollided(enemy, missile)) {
                app.stage.removeChild(enemy, missile);
                enemies.splice(enemies.indexOf(enemy), 1);
                missiles.splice(missiles.indexOf(missile), 1);
            }
        });
        if(isCollided(enemy, player)) {
            gameOver();
        }
    });
}

function isCollided(a, b) {
    let aBox = a.getBounds();
    let bBox = b.getBounds();

    return aBox.x + aBox.width > bBox.x &&
           aBox.x < bBox.x + bBox.width &&
           aBox.y + aBox.height > bBox.y &&
           aBox.y < bBox.y + bBox.height; 
}

function cleanupStage() {
    app.stage.removeChildren();
    app.ticker.stop();
    app.ticker.remove();
    /* for (let i = app.stage.children.length - 1; i >= 0; i--) {
        app.stage.removeChild(app.stage.children[i]);
    } */
    bgPos = 0;
}

function runGame() {
    cleanupStage();
    BgSetup();

    playerSetup(app.loader.resources["playerShipImg"].texture);
    app.stage.addChild(player);

    //keyboard & mouse events
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);
    //gameDiv.addEventListener("pointerdown", shoot);

    //start enemy spawning
    enemySpawner = setInterval(() => {
            enemy = createEnemy();
            enemies.push(enemy);
    }, 2000);

    //game loop
    app.ticker.add((delta) => {

        /*//ship rotation
        //const cursorPosition = app.renderer.plugins.interaction.mouse.global;
        playerRotate(cursorPosition);*/
        moveBackground(delta);
        playerMove(delta);
        updateMissiles(delta);
        updateEnemies(delta);
        checkCollision();
        if(keys['32'] && !missileReloading) {
            shoot();
        }
    });
    app.ticker.start();
};

function gameOver() {

    const gameOverContainer = new PIXI.Container();
    const gameOverButton = createMenuButton(300, 80, 20, "GAME OVER...");
    gameOverButton.interactive = true;
    gameOverButton.position.set((app.renderer.width / 2) - (gameOverButton.width / 2), 200);
    gameOverButton.on('mousedown', menuScreen);

    gameOverContainer.addChild(gameOverButton);

    app.stage.removeChild(player);
    
    app.stage.addChild(gameOverContainer);
    
    setTimeout( () => {
        clearInterval(enemySpawner);
        menuScreen();
    }, 3000);
}
