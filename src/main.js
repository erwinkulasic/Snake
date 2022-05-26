
const Game = function () {
    let canvas = document.getElementById("root");
    let info = document.getElementById('info');
    let context = canvas.getContext("2d");

    let data = {
        score: 4,
        snake: {
            tails: [],
            direction: 1,
            position: { x: 4, y: 4 },
            size: 20,
            isAlive: true
        },
        food: {
            position: { x: 4, y: 4 },
        },
        map: {
            size: 400
        }
    }

    const getRandomPosition = () => {
        return {
            x: Math.floor(Math.random() * data.snake.size),
            y: Math.floor(Math.random() * data.snake.size)
        }
    }

    const relocateFood = () => {
        if (
            data.snake.position.x === data.food.position.x &&
            data.snake.position.y === data.food.position.y
        ) {
            data.food.position = getRandomPosition();
            info.innerText = `Score ${++data.score - 4}`;
        }
    }

    const snakeBoundary = () => {
        const { x, y } = { 
            x: data.snake.position.x * data.snake.size, 
            y: data.snake.position.y * data.snake.size
        };

        if (x < 0
            || x >= data.map.size
            || y < 0
            || y >= data.map.size
        ) {
            data.snake.isAlive = false;
        }
    }

    const movementSnake = (direction) => direction === 1 ? data.snake.position.x++
        : direction === 2 ? data.snake.position.x--
        : direction === 3 ? data.snake.position.y--
        : data.snake.position.y++

    const relocatedTails = () => {
        for (let i = 0; i < data.snake.tails.length - 1; i++) {
            data.snake.tails[i] = data.snake.tails[i + 1];
        }

        data.snake.tails[data.score - 1] = { x: data.snake.position.x, y: data.snake.position.y };
    }

    const drawCell = (x, y, color) => {
        context.fillStyle = color;
        context.fillRect(x * data.snake.size, y * data.snake.size, data.snake.size, data.snake.size);
    }

    const visualization = () => {
        if (data.snake.tails.length < 0) {
            return;
        }

        for (let i = 0; i < data.snake.tails.length; i++) {
            const tail = data.snake.tails[i];

            if(tail) {
                drawCell(tail.x, tail.y, 'white');
            }
        }

        drawCell(data.food.position.x, data.food.position.y, '#222222');
    }

    const gameOver = () => {
        context.fillStyle = "#A1A1A1";
        context.font = "20px Jost";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillText("Game Over", data.map.size / 2, data.map.size / 2);
        context.font = "14px Jost";
        context.fillText("esc", data.map.size / 2, (data.map.size / 2) + 30);
    }

    const onUpdate = function () {
        context.clearRect(0, 0, data.map.size, data.map.size);

        if (data.snake.isAlive) {
            snakeBoundary();
            movementSnake(data.snake.direction);
            relocateFood();
            relocatedTails();
            visualization();
        } else {
            gameOver();
        }
    }

    document.addEventListener('keydown', ({ keyCode }) => {
        if (keyCode === 27) {
            window.location.reload();
        }

        if (keyCode === 68 && data.snake.direction !== 2) { //right
            data.snake.direction = 1;
        }
        if (keyCode === 87 && data.snake.direction !== 4) { //UP
            data.snake.direction = 3;
        }
        if (keyCode === 65 && data.snake.direction !== 1) { //LEFT
            data.snake.direction = 2;
        }
        if (keyCode === 83 && data.snake.direction !== 3) { //DOWN
            data.snake.direction = 4;
        }
    }, false);

    let touchPosition = {
        xDown: 0,
        yDown: 0
    }

    document.addEventListener('touchmove', ({ touches }) => {

        const x = touches[0].clientX;
        const y = touches[0].clientY;

        var xDiff = touchPosition.xDown - x;
        var yDiff = touchPosition.yDown - y;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0 && data.snake.direction !== 1) {
                data.snake.direction = 2;
            } else if (xDiff < 0 && data.snake.direction !== 2) {
                data.snake.direction = 1;
            }
        } else {
            if (yDiff > 0 && data.snake.direction !== 4) {
                data.snake.direction = 3;
            } else if (yDiff < 0 && data.snake.direction !== 3) {
                data.snake.direction = 4;
            }
        }
    }, false);

    document.addEventListener('touchstart', ({ touches }) => {
        const x = touches[0].clientX;
        const y = touches[0].clientY;

        if(!data.snake.isAlive) {
            window.location.reload();
        }

        touchPosition.xDown = x;
        touchPosition.yDown = y;

    }, false);

    if (window.innerWidth < 400) {
        canvas.width = 360;
        canvas.height = 360;
        data.map.size = 360;
        data.snake.size = 18;
    }

    window.focus();
    setInterval(onUpdate, 1000 / 10)
}

Game();