var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game) {
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.coolDown = 10;
    this.coolCount = 0;
};

Background.prototype.draw = function () {
    this.ctx.fillStyle = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    console.log(this.ctx.fillStyle);
    this.ctx.fillRect(0, 0, 1200, 600);
};

Background.prototype.update = function () {
    if(this.coolCount >= this.coolDown) {
        this.coolCount = 0;
        this.r += (Math.random() > 0.8) ? (Math.random() > 0.4 || this.r === 0) ? 5 : -5 : 0;
        this.g += (Math.random() > 0.8) ? (Math.random() > 0.4 || this.g === 0) ? 5 : -5 : 0;
        this.b += (Math.random() > 0.8) ? (Math.random() > 0.4 || this.b === 0) ? 5 : -5 : 0;
    } else {
        this.coolCount++;
    }
    
};

// inheritance 
function Cheetah(game, x, y, color) {
    this.animation = this.pantsAnimation;
    this.speed = 1;
    this.ctx = game.ctx;
    Entity.call(this, game, 15, 220);
}

Cheetah.prototype = new Entity();
Cheetah.prototype.constructor = Cheetah;

Cheetah.prototype.update = function () {

}

Cheetah.prototype.draw = function () {
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(100, 75, 10, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
         
}


AM.queueDownload("./assetmanager.js");
AM.downloadAll(function () {
    var canvas = document.getElementById("land");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.addEntity(new Background(gameEngine));
    gameEngine.addEntity(new Cheetah(gameEngine));
    gameEngine.start();

    console.log("All Done!");
});