(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var instructionsDiv = document.getElementById('instructions');
var scoreDiv = document.getElementById('scoreDiv');
var levelDiv = document.getElementById('levelDiv');
var player = new Player({ x: 15, y: 240 })

var background = new Image();
background.src = './assets/Background.png';

var timeSinceLastCar = 0;
var spawnCar;
var UpArrow = 38, DownArrow = 40, RightArrow = 39;
var level = 1;
var score = 0;
var regCarArr = [];

instructionsDiv.innerHTML = "Reach the other side safely to advance to the next level";
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function (timestamp) {

  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

function RegCar(lane)
{
    this.baseSpeed;
    this.width = 60;
    this.height = 86;
    this.x;
    this.y;
    this.spritesheet  = new Image();
    this.spritesheet.src = encodeURI('assets/cars_mini.png');
    this.color = Math.floor(Math.random() * 3);

    switch (lane){
        case 1:
            this.x = 100;
            this.y = 155;
            break;
        case 2:
            this.x = 150;
            this.y = 155;
            break;
        case 3:
            this.x = 200;
            this.y = 155;
            break;
    }
}

RegCar.prototype.update = function(time) {

}

RegCar.prototype.render = function(time,ctx){

    ctx.drawImage(
    this.spritesheet,
    this.color * 60, 0, this.width, this.height, this.x, this.y, this.width, this.height);
}

function raceCar(lane)
{
    this.baseSpeed;
    this.x;
    this.y;
    this.spritesheet  = new Image();
    this.spritesheet.src = encodeURI('assets/cars_racer.png');

    switch (lane){
        case 1:
            this.x = 100;
            this.y = 155;
            break;
        case 2:
            this.x = 150;
            this.y = 155;
            break;
        case 3:
            this.x = 200;
            this.y = 155;
            break;
    }
}

function gameOver()
{

}

function nextLevel()
{
    regCarArr = [];
    player.x = 10;
    player.y = 240;
    level += 1;
    levelDiv.innerHTML = level;
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
    
    timeSinceLastCar += elapsedTime;
    if(timeSinceLastCar > 2000)
    {
        timeSinceLastCar = 0;
        spawnCar = 1;
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
                        player.state = "up";
                    }
                    break;
                    //right
                case 39:
                case 68:
                    player.x += 85;
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
                        player.state = "down";
                    }

                    break;
            }
        }
    }
    else {
        window.onkeydown = null;
    }
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
    player.render(elapsedTime, ctx);


    for(i = 0; i < regCarArr.length; i++)
    {
        regCarArr[i].render(elapsedTime, ctx);
    }
    if(spawnCar == 1)
    {
        var carLane = (Math.floor(Math.random() * 3) * 1);
        var regCar = new RegCar(carLane);
        regCar.render(elapsedTime, ctx);
        regCarArr[regCarArr.length] = regCar;
        spawnCar = 0;
    }
}

},{"./game.js":2,"./player.js":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

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

},{}],3:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

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
  this.frameDelay = 1;
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
          this.inputLock = 1;
          this.timer += time;
          if (this.timer > MS_PER_FRAME) {
              this.timer = 0;
              if (this.frameDelay > 0)
              {
                  this.frameDelay -= 1;
              }
              else {
                  this.frame += 1;
                  this.frameDelay = 1;
              }
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
          ctx.drawImage(
              this.spritesheet,
              this.frame * 64, 0, this.width, this.height, this.x, this.y, this.width, this.height);
          break;

  }
}

},{}]},{},[1]);
