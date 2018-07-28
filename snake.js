let pieceSize = 10;

class Snake {
    constructor(startX, startY, startDirX = 1, startDirY = 0, shouldDraw = true) {
        this.body = [new Piece(startX, startY)];
        this.dir = [startDirX, startDirY];
        this.piecesToAdd = 0;
        this.alive = true;
        this.shouldDraw = shouldDraw;
    }

    draw() {
        if (this.shouldDraw) {
            for (var i = 0; i < this.body.length; i++) {
                if(i == 0){
                    this.body[i].draw(0);
                } else {
                    this.body[i].draw(255);
                }
            }
        }
    }

    addPiece() {
        this.piecesToAdd++
    }

    setDirection(dir) {
        if ((this.dir[0] != 0 && dir[0] != 0) ||
            (this.dir[1] != 0 && dir[1] != 0)) {
            return;
        }
        this.dir = dir;
    }

    move() {
        if (!this.alive) {
            return;
        }
        var lastPos = this.body[this.body.length - 1].getPos();
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].setPos(this.body[i - 1].getPos());
        }
        this.body[0].move(this.dir);
        // console.log(this.body[0]);
        if (this.piecesToAdd > 0) {
            this.body.push(new Piece(lastPos[0], lastPos[1]));
            this.piecesToAdd--;
        }
        this.checkCollision();
        this.draw();
    }

    checkCollision() {
        for (var i = 0; i < this.body.length; i++) {
            for (var j = 0; j < this.body.length; j++) {
                if (i != j && this.body[i].equals(this.body[j])) {
                    // console.log("killed");
                    this.alive = false;
                }
            }
        }
    }

    posIsTail(x, y) {
        for (var i = 1; i < this.body.length; i++) {
            if (this.body[i].x == x && this.body[i].y == y) {
                return true;
            }
        }
        return false;
    }

    getHeadPos() {
        return this.body[0].getPos();
    }
}

class Piece {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getPos() {
        return [this.x, this.y]
    }

    setPos(pos) {
        this.x = pos[0];
        this.y = pos[1];
    }

    move(dir) {
        this.x += dir[0] * pieceSize;
        this.y += dir[1] * pieceSize;
    }

    draw(color) {
        fill(color);
        rectMode(CENTER);
        rect(this.x, this.y, pieceSize, pieceSize);
    }

    equals(piece) {
        return this.x == piece.x && this.y == piece.y;
    }
}