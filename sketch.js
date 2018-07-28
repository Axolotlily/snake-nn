let bestSnakeCopy;
let world;
let scores;
let size = 400;
let loaded_data;

function preload(){
  var url = `http://127.0.0.1:5000/api/load/`;
  loaded_data = loadJSON(url);
}

function setup() {
  createCanvas(400, 400);
  frameRate(50);
  background(220);
  scores = [];  
  world = loadBest(loaded_data);
  console.log(`generation ${world.gen}`);
  console.log(world);
  world.start();
  var bestSnake = world.getBest();
  scores.push(bestSnake.score);
  bestSnakeCopy = new Board(width, height, 10, true);
  bestSnakeCopy.brain = bestSnake.brain.clone();
  // noLoop();
}

function draw() {
  // console.log('playing')
  bestSnakeCopy.update();
  textSize(32);
  text(`Gen: ${world.gen} -- Score: ${bestSnakeCopy.score}`, 10, 30);
  if (!bestSnakeCopy.snake.alive) {
    world.saveBest();
    console.log('creating new world...')
    world = world.reproduce();
    console.log(`World Created: generation ${world.gen}`);
    world.start();
    console.log('obtaining best snake')
    var bestSnake = world.getBest();
    scores.push(bestSnake.score);
    bestSnakeCopy = new Board(width, height, 10, true);
    bestSnakeCopy.brain = bestSnake.brain.clone();
    console.log(`${scores}`);
  }
}

changeDir = function () {
  if (keyIsDown(UP_ARROW)) {
    board.snake.setDirection([0, -1]);
  }
  if (keyIsDown(LEFT_ARROW)) {
    board.snake.setDirection([-1, 0]);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    board.snake.setDirection([1, 0]);
  }
  if (keyIsDown(DOWN_ARROW)) {
    board.snake.setDirection([0, 1]);
  }
}

loadBest = function (resp) {
  if (resp.success == true) {
    console.log('Loading World...');
    var gen = resp.gen;
    var newWorld = new World(size, gen, width, height);
    // console.log(newWorld);
    console.log(`Preparing to load ${newWorld.boards.length} brains...`);
    var netMatrices = resp.net;
    return loadBrains(newWorld, netMatrices);
  } else {
    return new World(size, 0, width, height);
  }
}

loadBrains = function(world, netMatrices){
  for (var i = 0; i < world.boards.length; i++) {
    console.log(`Loading brain ${i}...`)
    world.boards[i].brain.LoadForNet(netMatrices.whi, netMatrices.whh, netMatrices.woh);
  }
  return world;
}