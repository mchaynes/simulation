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
    this.convergeCount = 0;
    this.coolCount = 0;
};

Background.prototype.draw = function () {
    this.ctx.fillStyle = rgbString(this);
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
};



Background.prototype.randomUpdate = function() {
    if(this.coolCount >= this.coolDown) {
        this.coolCount = 0;
        //Add some randomness
        this.r += (Math.random() > 0.5) ? (Math.random() > 0.5 || this.r === 0) ? 10 : -10 : 0;
        this.g += (Math.random() > 0.5) ? (Math.random() > 0.5 || this.g === 0) ? 10 : -10 : 0;
        this.b += (Math.random() > 0.5) ? (Math.random() > 0.5 || this.b === 0) ? 10 : -10 : 0;
        
    } else {
        this.coolCount++;
    }
}

Background.prototype.convergeOnMax = function() {
    if(this.convergeCount >= this.coolDown) {
        this.convergeCount = 0;
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
    } else {
        this.convergeCount++;
    }
}
Background.prototype.update = function () {
    let converge = document.getElementById("converge").checked;
    let random = document.getElementById("random").checked;
    if(random) {
        this.randomUpdate();
    } 
    if(converge) {
        this.convergeOnMax();
    }
    if(converge || random) {
        document.getElementById("r-val").value = this.r;
        document.getElementById("g-val").value = this.g;
        document.getElementById("b-val").value = this.b;
    } else {
        let color = getSwatchRgb();
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
    }
}

Background.prototype.getState = function() {
    return {
        r: this.r,
        g: this.g,
        b: this.b
    }
}


function Game() {

}

Game.prototype.ready = function() {
    var canvas = document.getElementById("land");
    var ctx = canvas.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight * 0.75;
    var gameEngine;
    let resetting = this.gameEngine;
    if(this.gameEngine) {
        this.gameEngine.entities = [];
        gameEngine = this.gameEngine;
    } else {
        gameEngine = new GameEngine();
    }
    gameEngine.init(ctx);
    let background = new Background(gameEngine);
    gameEngine.addEntity(background);
    for(let i = 0; i < 15; i++) {
        let color = {
            r: getRandomInt(256),
            g: getRandomInt(256),
            b: getRandomInt(256)
        }
        for(let j = 0; j < 3; j++) {
            let radius = 5;
            let x = getRandomInt(getCanvasWidth() - 10);
            let y = getRandomInt(getCanvasHeight() - 10);
            let onTopOfOther = true;

            gameEngine.addEntity(new Bacteria(gameEngine, x, y, radius, color));

        }
    }
    gameEngine.shouldUpdate = false;
    if(!resetting) {
        gameEngine.start();
    }
    this.gameEngine = gameEngine;
    console.log("All Done!");
}
Game.prototype.start = function() {
    this.gameEngine.shouldUpdate = true;
}

Game.prototype.pause = function() {
    this.gameEngine.shouldUpdate = false;
}

var game = new Game();