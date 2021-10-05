function splashScreen() {
    let logo = new PIXI.Sprite.from(app.loader.resources["logoImg"].texture);
    logo.x = (app.renderer.width / 2) - (logo.width / 2);
    logo.y = (app.renderer.height / 2) - (logo.height / 2);
    app.stage.addChild(logo);

    setTimeout( () => {
        app.ticker.add((delta) => {
            logo.alpha -= 0.02 *delta;
        });
    }, 2000);

    setTimeout( () => {
        menuScreen();
    }, 3000);
}