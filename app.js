//basic canvas setup
const canvas = document.getElementById("maincanvas");
const app = new PIXI.Application({
    view: canvas,
    width: 800,
    height: 600,
    backgroundColor: 0x000000
});
const gameDiv = document.getElementById("game");
gameDiv.appendChild(app.view);

//registering keyboard inputs
function keysDown(e) {
    keys[e.keyCode] = true;
}
function keysUp(e) {
    keys[e.keyCode] = false;
}

// --- PRELOADING ASSETS
function preloader() {
    app.loader.add("logoImg", "assets/logo/PlaynGo-Logo.jpg")
              .add("bgBackImg", "assets/background/bkgd_0.png")
              .add("bgFarImg", "assets/background/bkgd_1.png")
              .add("bgMidImg", "assets/background/bkgd_2.png")
              .add("bgNearImg", "assets/background/bkgd_5.png")
              .add("bgNearestImg", "assets/background/bkgd_7.png")
              .add("playerShipImg", "assets/faction10/cruiser.png")
              .add("enemyShipImg", "assets/faction1/smallorange.png")
              .add("missileImg", "assets/missile/spr_missile_half.png")
    app.loader.onComplete.add(splashScreen);
    app.loader.load();

}

// --- START!
preloader();

