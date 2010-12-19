var xsize = 50;
var ysize = 35;
var gridsize = 15;
var pad = 1;
var speed = 1;

var ctx;
var snake;
var food;
function init() {
    ctx = document.getElementById('gameboard').getContext('2d'); 
    document.onkeydown = keyListener;
    reset();
    setInterval(loop, 100/speed);
}

function Snake() {
    this.dir = 'r';
    this.body = new Array(new Gridbox(0,3),
                          new Gridbox(1,3),
                          new Gridbox(2,3),
                          new Gridbox(3,3));
    
    this.head = this.body[this.body.length-1];

    this.update = function(theSnake) {
        // remove tail, add new this.head in correct direction
        if (!this.gotFood())
            this.body.shift();
        
        var newHead;
        switch (this.dir) {
            case 'l':
                newHead = new Gridbox(this.head.x-1, this.head.y);
                break;
            case 'r':
                newHead = new Gridbox(this.head.x+1, this.head.y);
                break;
            case 'u':
                newHead = new Gridbox(this.head.x, this.head.y-1);
                break;
            case 'd':
                newHead = new Gridbox(this.head.x, this.head.y+1);
                break;
        }
        this.body.push(newHead);
        this.head = newHead;
    }

    this.gotFood = function() {
        if (food.equals(this.head)) {
            food = getNewFood();
            return true;
        }
        else
            return false;
    }
    
    this.draw = function() {
        ctx.fillStyle = "rgb(200,0,0)";
        this.body.forEach(function (gb) {
            gb.draw();
        });
    }

    this.coversPoint = function(gb) {
        for (var i=0; i<this.body.length; i++)
            if (gb.equals(this.body[i]))
                return true;

        return false;
    }
}

function Gridbox(x, y) {
    this.x = x;
    this.y = y;

    this.equals = function(gb) {
        if (this.x != gb.x)
            return false;
        else if (this.y != gb.y)
            return false;
        else
            return true;
    }

    this.draw = function() {
        ctx.fillRect(this.x*gridsize + pad, this.y*gridsize + pad, 
                     gridsize - pad, gridsize - pad);
    }
}

function reset() {
    snake = new Snake();
    food = getNewFood();
}

function loop() {
    ctx.clearRect(0, 0, xsize*gridsize, ysize*gridsize);
    ctx.strokeRect(0, 0, xsize*gridsize, ysize*gridsize);

    drawFood();
    snake.update();
    snake.draw();

    if (hasCollided(snake))
        reset();
} 


function keyListener(e) {
    var second = snake.body[snake.body.length-2];
    if (e.keyCode==37 && !(snake.head.x > second.x))
        snake.dir = 'l';
    else if (e.keyCode==38 && !(snake.head.y > second.y))
        snake.dir = 'u';
    else if (e.keyCode==39 && !(snake.head.x < second.x))
        snake.dir = 'r';
    else if (e.keyCode==40 && !(snake.head.y < second.y))
        snake.dir = 'd';
}

function getNewFood() {
    var x = Math.floor(Math.random()*xsize);
    var y = Math.floor(Math.random()*ysize);

    while (snake.coversPoint(new Gridbox(x, y))) {
        var x = Math.floor(Math.random()*xsize);
        var y = Math.floor(Math.random()*ysize);
    }

    return new Gridbox(x, y);
}

function drawFood() {
    ctx.fillStyle = "rgb(0,0,200)";
    food.draw();
}

function hasCollided(snake) {
    // check walls
    if (snake.head.x < 0 || snake.head.x >= xsize)
        return true;
    else if (snake.head.y < 0 || snake.head.y >= ysize)
        return true;
    else 
        for (var i=0; i<snake.body.length-1; i++)
            if (snake.head.equals(snake.body[i]))
                return true;

    return false;
}    
