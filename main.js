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
    this.coolDown = 50;
    this.coolCount = 0;
};

Background.prototype.draw = function () {
    this.ctx.fillStyle = rgbString(this);
    this.ctx.fillRect(0, 0, 1200, 600);
};

function rgbString(color) {
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getCanvasHeight() {
    return document.getElementById("land").height;
}
function getCanvasWidth() {
    return document.getElementById("land").width;
}

function getSwatchRgb() {
    return {
        r: parseInt(document.getElementById("r-val").value),
        g: parseInt(document.getElementById("g-val").value),
        b: parseInt(document.getElementById("b-val").value)
    }
}

Background.prototype.update = function () {
    if(document.getElementById("checkBox").checked) {
        this.randomUpdate();
    } else {
        let color = getSwatchRgb();
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
    }
};

Background.prototype.randomUpdate = function() {
    if(this.coolCount >= this.coolDown) {
        this.coolCount = 0;
        let bacterium = this.game.entities.filter(x => x instanceof Bacteria);
        let area = {};
        let max = 0;
        let maxBacteria;
        for(i in bacterium) {
            let bacteria = bacterium[i];
            let rgbKey = rgbString(bacteria);
            area[rgbKey] = area[rgbKey] || 1; //undefined is falsy
            area[rgbKey] += Math.PI * (bacteria.radius * bacteria.radius); // PI * r^2
            if(area[rgbKey] > max) {
                max = area[rgbKey];
                maxBacteria = bacteria;
            }
        }
        this.r += (this.r === maxBacteria.r) ? 0 : (this.r < maxBacteria.r) ? 1 : -1;
        this.g += (this.g === maxBacteria.g) ? 0 : (this.g < maxBacteria.g) ? 1 : -1;
        this.b += (this.b === maxBacteria.b) ? 0 : (this.b < maxBacteria.b) ? 1 : -1;
        let colorCount = 0;
        for(i in area) {
            colorCount++;
        }
        //Add some randomness
        if(colorCount > 1) {
            this.r += (Math.random() > 0.8) ? (Math.random() > 0.4 || this.r === 0) ? 5 : -5 : 0;
            this.g += (Math.random() > 0.8) ? (Math.random() > 0.4 || this.g === 0) ? 5 : -5 : 0;
            this.b += (Math.random() > 0.8) ? (Math.random() > 0.4 || this.b === 0) ? 5 : -5 : 0;
        }
    } else {
        this.coolCount++;
    }
}

AM.queueDownload("./assetmanager.js");
AM.downloadAll(function () {
    var canvas = document.getElementById("land");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.addEntity(new Background(gameEngine));
    for(let i = 0; i < 5; i++) {
        let color = {
            r: getRandomInt(256),
            g: getRandomInt(256),
            b: getRandomInt(256)
        }
        for(let j = 0; j < 8; j++) {
            let x = getRandomInt(getCanvasWidth() - 10);
            let y = getRandomInt(getCanvasHeight() - 10);
            gameEngine.addEntity(new Bacteria(gameEngine, x, y, 5, color));

        }
    }

    gameEngine.start();
    console.log("All Done!");
});