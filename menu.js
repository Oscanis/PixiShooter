//sprite variables for the menu background
let bgMenuBack;
let bgMenuFar;
let bgMenuMid;
let bgMenuNear;
let bgMenuPos = 0;
let bgMenuSpeed = -0.1;

function menuBgSetup() {
    bgMenuBack = createBg(app.loader.resources["bgBackImg"].texture);
    bgMenuFar = createBg(app.loader.resources["bgFarImg"].texture);
    bgMenuMid = createBg(app.loader.resources["bgMidImg"].texture);
    bgMenuNear = createBg(app.loader.resources["bgNearestImg"].texture);
}

function createMenuButton(width, height, round, bText) {
    const buttonContainer = new PIXI.Container();
    
    const button = new PIXI.Graphics();
    button.beginFill(0xcccccc);
    button.lineStyle(4, 0x555555, .3);
    button.drawRoundedRect(0, 0, width, height, round);
    button.endFill();
    buttonContainer.addChild(button);

    const buttonText = new PIXI.Text(bText);
    buttonText.style = new PIXI.TextStyle({
        fill: 0x000000
    });
    buttonText.x = (buttonContainer.width / 2) - (buttonText.width / 2);
    buttonText.y = (buttonContainer.height / 2) - (buttonText.height / 2);
    buttonContainer.addChild(buttonText);

    return buttonContainer;
}

function moveMenuBackground(delta) {
    bgMenuPos = (bgMenuPos - bgMenuSpeed) * delta;

    bgMenuBack.tilePosition.x = bgMenuPos;
    bgMenuFar.tilePosition.x = bgMenuPos * 2;
    bgMenuMid.tilePosition.x = bgMenuPos * 4;
    bgMenuNear.tilePosition.x = bgMenuPos * 7;
}

function startGame() {
    cleanupMenu();
    runGame();
}

function exitGame() {
    app.destroy();
    window.open("https://www.playngo.com", "_self");
}

function cleanupMenu() {
    app.stage.removeChildren();
    app.ticker.stop();
    app.ticker.remove();
    /* for (let i = app.stage.children.length - 1; i >= 0; i--) {
        app.stage.removeChild(app.stage.children[i]);
    } */
    bgMenuPos = 0;
}

function menuScreen() {

    if(!bgMenuBack)
        menuBgSetup();

    const menuContainer = new PIXI.Container();

    const button1 = createMenuButton(300, 80, 20, "GAME 1");
    button1.interactive = true;

    const button2 = createMenuButton(300, 80, 20, "GAME 2");
    button2.interactive = true;
    
    const button3 = createMenuButton(300, 80, 20, "GAME 3");
    button3.interactive = true;
    
    const button4 = createMenuButton(300, 80, 20, "EXIT");
    button4.interactive = true;

    button1.position.set((app.renderer.width / 2) - (button1.width / 2), 100);
    button2.position.set((app.renderer.width / 2) - (button2.width / 2), 200);
    button3.position.set((app.renderer.width / 2) - (button3.width / 2), 300);
    button4.position.set((app.renderer.width / 2) - (button4.width / 2), 400);

    button1.on('mousedown', startGame);
    button2.on('mousedown', startGame);
    button3.on('mousedown', startGame);
    button4.on('mousedown', exitGame);

    menuContainer.addChild(button1, button2, button3, button4);
    app.stage.addChild(menuContainer);

      
    app.ticker.add((delta) => {
        moveMenuBackground(delta);
      });
    app.ticker.start();
}