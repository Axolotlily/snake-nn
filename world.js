class World {
    constructor(amountOfSnakes, gen, width, height) {
        this.size = amountOfSnakes;
        this.gen = gen;
        this.width = width;
        this.height = height;
        this.boards = [];
        for (var i = 0; i < amountOfSnakes; i++) {
            this.boards.push(new Board(width, height, 10, false));
            this.boards[i].maxMoves = 50 * (this.gen + 1);
        }
    }

    getBest() {
        var best = this.boards[0];
        for (var i = 1; i < this.boards.length; i++) {
            if (this.boards[i].score > best.score) {
                best = this.boards[i];
            }
        }
        return best;
    }

    getIndexWorstOf(arr) {
        var worst = arr[0];
        var index = 0
        for (var i = 1; i < arr.length; i++) {
            if (arr[i].score < worst.score) {
                worst = arr[i];
                index = i
            }
        }
        return index;
    }

    isOneAlive() {
        for (var i = 0; i < this.boards.length; i++) {
            if (this.boards[i].snake.alive) {
                return true;
            }
        }
        return false;
    }

    start() {
        console.log(`Starting generation ${this.gen}`)
        for (var i = 0; i < this.boards.length; i++) {
            console.log(`Species ${i}`)
            while (this.boards[i].snake.alive) {
                this.boards[i].update();
            }
        }
    }

    getBest10() {
        var best10 = [];
        for (var i = 0; i < 20; i++) {
            best10.push(this.boards[i]);
        }
        for (var i = 2; i < this.boards.length; i++) {
            var index = this.getIndexWorstOf(best10)
            if (best10[index].score < this.boards[i].score) {
                best10[index] = this.boards[i];
            }
        }
        return best10;
    }

    reproduce() {
        var best10 = this.getBest10();
        var children = [];
        for (var i = 0; i < best10.length; i++) {
            var newBoard = best10[i].crossover(best10[(i + 1) % best10.length]);
            children.push(newBoard);
        }
        for (var i = 0; i < best10.length; i++) {
            for (var j = 0; j < floor(this.boards.length / best10.length); j++) {
                children.push(best10[i].clone());
            }
        }
        children = this.getRandomSubarray(children, this.size);
        for (var i = 0; i < children.length; i++) {
            children[i].mutate(0.2);
        }

        var newWorld = new World(1, this.gen + 1, this.width, this.height);
        newWorld.boards = children;
        newWorld.size = children.length;
        return newWorld;
    }

    getRandomSubarray(arr, size) {
        var shuffled = arr.slice(0),
            i = arr.length,
            temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, size);
    }

    saveBest() {
        var best = this.getBest();
        var saveString = best.brain.NetForSave();
        var url = `http://127.0.0.1:5000/api/save/`;
        httpPost(`${url}?json={"gen":${this.gen}, "net":${saveString}, "score":${best.score}}`);
    }

}