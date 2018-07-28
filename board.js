class Board {
    constructor(width, height, division = 10, draw = true) {
        this.score = 0;
        var startDir = random([
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1]
        ]);
        this.snake = new Snake(
            random([20, 40, 60, 80, 100, 120, 140, 160, 180, 190, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380]), 
            random([20, 40, 60, 80, 100, 120, 140, 160, 180, 190, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380]),
             startDir[0], startDir[1], draw);
        this.snake.addPiece();
        this.snake.addPiece();
        this.w = width;
        this.h = height;
        this.fruit = [Math.floor(Math.random() * width / 10) * 10,
            Math.floor(Math.random() * height / 10) * 10
        ];
        // this.fruit = [210, 210];
        this.brain = new NeuralNet(24, 18, 4);

        this.nonFruitMoves = 0;
        this.shouldDraw = draw;
        this.maxMoves = 100;
        this.lifetime = 0;
    }

    setDraw(draw) {
        this.shouldDraw = draw;
        this.snake.shouldDraw = draw;
    }

    checkBoundary() {
        if (0 > this.snake.body[0].x || this.snake.body[0].x > this.w ||
            0 > this.snake.body[0].y || this.snake.body[0].y > this.h) {
            this.snake.alive = false;
        }
        this.score++;
    }

    checkFruit() {
        if (this.fruit[0] == this.snake.body[0].x &&
            this.fruit[1] == this.snake.body[0].y) {
            this.snake.addPiece();

            this.fruit = [Math.floor(Math.random() * width / 10) * 10,
                Math.floor(Math.random() * height / 10) * 10
            ];
            this.score += 200;
            this.nonFruitMoves = 0;
            this.maxMoves += 100;
        }

    }

    update() {
        if (this.snake.alive) {
            this.draw();
            this.setDirection();
            this.snake.move();
            this.checkBoundary();
            this.checkFruit();
            this.nonFruitMoves += 1;
            if (this.nonFruitMoves > this.maxMoves) {
                this.snake.alive = false;
            }
        }
    }

    draw() {
        if (this.shouldDraw) {
            background(220);
            this.snake.draw();
            fill(255, 0, 0);
            rectMode(CENTER);
            rect(this.fruit[0], this.fruit[1], 10, 10);
        }
    }

    setDirection() {
        var dir = this.brain.output(this.snakeLook());
        var winner = max(dir);
        // console.log(dir, winner);
        if (dir[0] == winner) {
            this.snake.setDirection([1, 0]);
            return;
        }
        if (dir[1] == winner) {
            this.snake.setDirection([-1, 0]);
            return;
        }
        if (dir[2] == winner) {
            this.snake.setDirection([0, 1]);
            return;
        }
        if (dir[3] == winner) {
            this.snake.setDirection([0, -1]);
            return;
        }
    }

    snakeLook() {
        var vision = [];
        vision = vision.concat(this.lookDirection([1, 0]));
        vision = vision.concat(this.lookDirection([0, 1]));
        vision = vision.concat(this.lookDirection([-1, 0]));
        vision = vision.concat(this.lookDirection([0, -1]));
        vision = vision.concat(this.lookDirection([1, 1]));
        vision = vision.concat(this.lookDirection([1, -1]));
        vision = vision.concat(this.lookDirection([-1, 1]));
        vision = vision.concat(this.lookDirection([-1, -1]));
        // console.log(vision);
        return vision;
    }

    lookDirection(dir) {
        var visionInDirection = [0, 0, 0];
        var food = false;
        var tail = false;
        var distance = 1;

        var position = this.snake.getHeadPos();
        position[0] += dir[0];
        position[1] += dir[1];

        while (!(position[0] < 0 || position[1] < 0 || position[0] >= 400 || position[1] >= 400)) {

            //check for food at the position
            if (!food && position[0] == this.fruit[0] && position[1] == this.fruit[1]) {
                visionInDirection[0] = 1;
                food = true; // dont check if food is already found
            }

            //check for tail at the position
            if (!tail && this.snake.posIsTail(position[0], position[1])) {
                visionInDirection[1] = 1 / distance;
                tail = true; // dont check if tail is already found
            }

            //look further in the direction
            position[0] += dir[0];
            position[1] += dir[1];
            distance += 1;
        }

        //set the distance to the wall
        visionInDirection[2] = 1 / distance;

        return visionInDirection;
    }

    getMapObject(x, y) {
        if (x >= this.width || x <= 0 || y >= this.height || y <= 0) {
            return -2; // wall
        }
        if (this.snake.posIsTail(x, y)) {
            return -1; // tail
        }
        if (x == this.fruit[0] && y == this.fruit[1]) {
            return 2; // fruit
        }
        return 0; // nothing
    }

    clone() {
        var newBoard = new Board(this.w, this.h, 10, false);
        newBoard.brain = this.brain.clone();

        return newBoard;
    }

    mutate(mr) {
        this.brain.mutate(mr);
    }

    crossover(partner) {
        var newBoard = new Board(this.w, this.h, 10, false);
        newBoard.brain = this.brain.crossover(partner.brain);
        return newBoard;
    }
}