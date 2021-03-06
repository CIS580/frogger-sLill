
/* Global variables */
var canvas = document.getElementById('screen');
var instructionsDiv = document.getElementById('instructions');
var scoreDiv = document.getElementById('scoreDiv');
var levelDiv = document.getElementById('levelDiv');
var messageDiv = document.getElementById('messageDiv');
var timerDiv = document.getElementById('timerDiv');
var UpArrow = 38, DownArrow = 40, RightArrow = 39;
    
var background = new Image();
background.src = './assets/Background.png';
var life = new Image();
life.src = './assets/life.png';

var level = 1;
var score = 0;
var lives = 3;
var levelTimer = 0;
var levelTimerCounter = 60;
var timeSinceLastCar = 0;
var timeSinceLastLog = 0;
var endGame = 0;
var spawnCar;
var spawnLog;
var onLog = 0;
var regCarArr = [];
var logArr = [];

    // Unit collision function

var detection = 0;
function AABBIntersect(ax, ay, aX, aY, bx, by, bX, bY)
{
    //Checking upper left point
    if(ax > bx && ax < bX && ay > by && ay < bY)
    {
        detection = 1;

        if(player.aX > 400)
        {
            onLog = 1;
        }
    }
    //Checking lower right point
    else if (aX > bx && aX < bX && aY > by && aY < bY)
    {
        detection = 1;
    }
    else
    {
        detection = 0;
    }
}

instructionsDiv.innerHTML = "Reach the other side safely to advance to the next level";

function RegCar(lane)
{
    this.baseSpeed = 1;
    this.width = 60;
    this.height = 86;
    this.x;
    this.y;
    this.spritesheet  = new Image();
    this.spritesheet.src = encodeURI('assets/cars_mini.png');
    this.color = Math.floor(Math.random() * 5);

    switch (lane){
        case 1:
            this.x = 100;
            this.y = 555;
            break;
        case 2:
            this.x = 190;
            this.y = 555;
            break;
        case 3:
            this.x = 280;
            this.y = 555;
            break;
    }

    //Adjusted position properties used for collision detection
    this.ax = this.x + 5;
    this.ay = this.y;
    this.aX = this.x + 60;
    this.aY = this.y + 80;
}

RegCar.prototype.update = function(time) {
    this.y -= (this.baseSpeed * level);

    this.ay = this.y;
    this.aY = this.y + 80;
}

RegCar.prototype.render = function(time,ctx){

    ctx.drawImage(
    this.spritesheet,
    this.color * 60, 0, this.width, this.height, this.x, this.y, this.width, this.height);
}

function Log(lane)
{
    this.baseSpeed;
    this.width = 125;
    this.height = 210;
    this.x;
    this.y;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/log2.png');

    switch (lane) {
        case 1:
            this.x = 400;
            this.y = -200;
            break;
        case 2:
            this.x = 495;
            this.y = 550;
            break;
        case 3:
            this.x = 580;
            this.y = -200;
            break;
    }

    //Adjusted position properties used for collision detection
    this.ax = this.x;
    this.ay = this.y;
    this.aX = this.x + 105;
    this.aY = this.y + 200;
    
    if (lane == 2 || lane == 4)
    {
        this.baseSpeed = -0.25;
    }
    else
    {
        this.baseSpeed = 0.25;
    }
}

Log.prototype.update = function(time){
    if (this.baseSpeed < 0) {
        this.y += (this.baseSpeed - (level / 6));
    }
    else {
        this.y += (this.baseSpeed + (level / 6));
    }

    this.ay = this.y;
    this.aY = this.y + 150;
}

Log.prototype.render = function (time, ctx) {
    ctx.drawImage(
this.spritesheet,
0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
}


function gameOver()
{
    messageDiv.innerHTML = "Game Over";
    endGame = 1;
}

function nextLevel()
{
    scoreDiv.innerHTML += levelTimerCounter;
    logArr = [];
    regCarArr = [];
    player.x = 10;
    player.y = 240;
    player.ax = player.x;
    player.aX = player.x + 55;
    player.ay = player.y + 15;
    player.aY = player.y + 60;
    level += 1;
    levelDiv.innerHTML = level;
    levelTimer = 0;
    levelTimerCounter = 60;
}

function lifeLost()
{
    lives--;
    logArr = [];
    regCarArr = [];
    player.x = 10;
    player.y = 240;
    player.ax = player.x;
    player.aX = player.x + 55;
    player.ay = player.y + 15;
    player.aY = player.y + 60;
    detection = 0;
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
    player.update(elapsedTime);

    levelTimer += elapsedTime;
    if (levelTimer > 1000)
    {
        levelTimer = 0;
        levelTimerCounter--;
    }

    timeSinceLastCar += elapsedTime;
    if(timeSinceLastCar > 1000)
    {
        timeSinceLastCar = 0;
        spawnCar = 1;
    }

    timeSinceLastLog += elapsedTime;
    if (timeSinceLastLog > 500)
    {
        timeSinceLastLog = 0;
        spawnLog = 1
    }
    // TODO: Update the game objects
    //Movement events
    if (player.inputLock == 0) {
        window.onkeydown = function (event) {
            switch (event.keyCode) {
                //up
                case 38:
                case 87:
                    if (player.y < 60)
                    {
                        player.state = "up";
                    }
                    else {
                        player.y -= 85;
                        player.ay = player.y + 15;
                        player.aY = player.y + 60;
                        player.state = "up";
                    }
                    break;
                    //left
                case 37:
                case 65:
                    if (player.x < 50) {
                        player.state = "left";
                    }
                    else {
                        player.x -= 85;
                        player.ax = player.x;
                        player.aX = player.x + 55;
                        player.state = "left";
                    }
                    break;
                    //right
                case 39:
                case 68:
                    player.x += 85;
                    player.ax = player.x;
                    player.aX = player.x + 55;
                    player.state = "right";

                    if ((game.WIDTH - player.x) < 90)
                    {
                        nextLevel();
                    }
                    break;
                    //down
                case 40:
                case 83:
                    if ((game.HEIGHT - player.y) < 85) {
                        player.state = "down";
                    }
                    else {
                        player.y += 85;
                        player.ay = player.y + 15;
                        player.aY = player.y + 60;
                        player.state = "down";
                    }

                    break;
            }
        }
    }
    else {
        window.onkeydown = null;
    }

    for(i = 0; i < regCarArr.length; i++)
    {
        regCarArr[i].update(elapsedTime);

        //Testing for unit collision
        AABBIntersect(player.ax, player.ay, player.aX, player.aY, regCarArr[i].ax, regCarArr[i].ay, regCarArr[i].aX, regCarArr[i].aY);

        if (detection == 1)
        {
            lifeLost();
        }
    }
    for(k = 0; k < logArr.length; k++)
    {
        logArr[k].update(elapsedTime);

        //Testing for unit collision
        AABBIntersect(player.ax, player.ay, player.aX, player.aY, logArr[k].ax, logArr[k].ay, logArr[k].aX, logArr[k].aY);
    }

    if (onLog == 0 && (player.ax > 400 && player.aX > 400) )
    {
        lifeLost();
    }

    if (levelTimerCounter == 0)
    {
        lifeLost();
    }

    if (lives == 0)
    {
        gameOver();
    }

    onLog = 0;
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {

    //Clear previous frame
    ctx.clearRect(0, 0, game.HEIGHT, game.WIDTH);
    ctx.drawImage(background, 0, 0);

    //Render Cars
    if(spawnCar == 1)
    {
        var carLane = (Math.floor(Math.random() * 4) * 1);
        var regCar = new RegCar(carLane);
        regCarArr[regCarArr.length] = regCar;
        spawnCar = 0;
    }
    for(i = 0; i < regCarArr.length; i++)
    {
        if (regCarArr[i].y > -200)
        {
            regCarArr[i].render(elapsedTime, ctx);
        }
    }

    //Render Logs
    if (spawnLog == 1)
    {
        var logLane = (Math.floor(Math.random()*4) * 1);
        var log = new Log(logLane);
        logArr[logArr.length] = log;
        spawnLog = 0;
    }

    for(i = 0; i < logArr.length; i++)
    {
        if(logArr[i].y > -200)
        {
            logArr[i].render(elapsedTime, ctx);
        }
    }

    //Render Lives
    var xLoc = 45;
    for(i = 0; i < lives; i++)
    {
        ctx.drawImage(life, xLoc, 416);
        xLoc = xLoc + 13;
    }

    timerDiv.innerHTML = levelTimerCounter;
    player.render(elapsedTime, ctx);
}

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

   //Height/Width
  this.HEIGHT = screen.height;
  this.WIDTH = screen.width;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;

}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if (!this.paused) this.update(elapsedTime);

  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

const MS_PER_FRAME = 1000/8;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {

  var frogType = Math.floor(Math.random()*4);
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite' + frogType + '.png');
  this.timer = 0;
  this.frame = 0;
  this.inputLock = 0;

  //Adjusted position properties used for collision detection
  this.ax = position.x;
  this.ay = position.y + 15;
  this.aX = position.x + 55;
  this.aY = position.y + 60;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function (time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if (this.frame > 3) this.frame = 0;
      }
      break;
        // TODO: Implement your player's update by state
      case "up":
      case "down":
      case "right":
      case "left":
          this.inputLock = 1;
          this.timer += time;
          if (this.timer > MS_PER_FRAME) {
              this.timer = 0;
              this.frame += 1;
              if (this.frame > 3) {
                  this.frame = 0;
                  this.state = "idle";
                  this.inputLock = 0;
              }
          }         
          break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
      case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x , this.y, this.width, this.height
      );
      break;
        // TODO: Implement your player's rendering according to state
      case "up":
      case "down":
      case "right":
      case "left":
          ctx.drawImage(
              this.spritesheet,
              this.frame * 64, 0, this.width, this.height, this.x, this.y, this.width, this.height);
          break;

  }
}

var game = new Game(canvas, update, render);
var player = new Player({ x: 15, y: 240 });

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function (timestamp) {

    if (endGame == 0) {
        game.loop(timestamp);
        window.requestAnimationFrame(masterLoop);
    }
}
masterLoop(performance.now());
