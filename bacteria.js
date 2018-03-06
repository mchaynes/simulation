function Bacteria(game, x, y, radius=10, color) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.ctx = game.ctx;
    color = color || {
        r: getRandomInt(255),
        g: getRandomInt(255),
        b: getRandomInt(255)
    }
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.radius = 10;
    this.xv = 1 + getRandomInt(2);
    this.yv = 1 + getRandomInt(2);
    this.xv *= (Math.random() > 0.5) ? 1 : -1;
    this.yv *= (Math.random() > 0.5) ? 1 : -1;
}


Bacteria.prototype.update = function() {
    if(this.isAtRight() && this.xv > 0) {
        this.xv = -this.xv;
    }
    if(this.isAtLeft() && this.xv < 0) {
        this.xv = -this.xv;
    }
    if(this.isAtTop() && this.yv < 0) {
        this.yv = -this.yv;
    }
    if(this.isAtBottom() && this.yv > 0) {
        this.yv = -this.yv;
    }
    this.x += this.xv;
    this.y += this.yv;
    this.collide();
    if(this.radius === 0) {
        this.removeFromWorld = true;
    }
}

Bacteria.prototype.draw = function() {
    if(this.radius < 0) {
        this.removeFromWorld = true;
        return;
    }
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.fillStyle = rgbString(this);
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.font = "12px serif";
    ctx.lineWidth = 2;
    let tX = this.x - 5;
    let tY = this.y + 5;
    let text = Math.round(100 * this.fitness()) / 100;
    ctx.strokeText(text, tX, tY);
    ctx.fillText(text, tX, tY);
}

Bacteria.prototype.isAtBottom = function() {
    return this.y + (this.radius) > getCanvasHeight();
}
Bacteria.prototype.isAtRight = function() {
    return this.x + (this.radius) > getCanvasWidth(); 
}

Bacteria.prototype.isAtLeft = function() {
    return this.x - (this.radius) < 0;
}

Bacteria.prototype.isAtTop = function() {
    return this.y - (this.radius) < 0;
}

Bacteria.prototype.collide = function() {
    this.lastCollided = this.lastCollided || []; // instantiate if this is first update.
    let bacterium = this.game.entities.filter(x => x instanceof Bacteria);
    let collided = false;
    for(i in bacterium) {
        let bacteria = bacterium[i];
        if(bacteria !== this) {
            let dx = this.x - bacteria.x;
            let dy = this.y - bacteria.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if(distance < this.radius + bacteria.radius) {
                if(!this.lastCollided.includes(bacteria)) {
                    if(this.fitness() < bacteria.fitness()) {
                        bacteria.radius++;
                        this.radius--;
                    } else if(rgbString(this) !== rgbString(bacteria)) {
                        if(this.radius > 50) {
                            bacteria.r = this.r;
                            bacteria.g = this.g;
                            bacteria.b = this.b;
                        } else {
                            this.radius++;
                            bacteria.radius--;
                        }
                    }
                    collided = bacteria;
                    this.lastCollided.push(bacteria);
                } else {
                    this.lastCollided.pop(bacteria);
                }

            }
        }
    }
    if(collided && rgbString(this) !== rgbString(collided)) {
        this.xv = -this.xv;
        this.yv = -this.yv;
        this.x += 2 * this.xv;
        this.y += 2 * this.yv;
    }
}


Bacteria.prototype.fitness = function() {
    let b = this.game.background;
    let rDist = Math.abs(b.r - this.r);
    let gDist = Math.abs(b.g - this.g);
    let bDist = Math.abs(b.b - this.b);
    let total = rDist + gDist + bDist;

    return (total === 0) ? 100 : 100 / total;
}