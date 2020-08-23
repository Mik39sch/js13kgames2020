import CharctorWriter from './CharctorWriter.js';

export default class Game
{
    constructor(inCanvas, stage)
    {
        this.mCanvas = inCanvas;
        this.prevTimestamp = 0;

        this.stage = stage;
        this.currentFrame = JSON.parse(JSON.stringify(this.stage.mImageData));

        this.player = new CharctorWriter('player', 'top');
        this.putCharactor(this.player);

        this.enemies = {};

        for (let i=0;i<5;i++) {
            this.enemies[i] = new CharctorWriter('enemy', 'down');
            this.putCharactor(this.enemies[i]);
        }

        this.enemyMove = 5;

        window.addEventListener("keydown", this.keyDown.bind(this));
        window.addEventListener("keyup", this.keyUp.bind(this));

        this.currentFrame = JSON.parse(JSON.stringify(this.stage.mImageData));
    }

    playing(timestamp)
    {
        const elapsed = (timestamp - this.prevTimestamp) / 1000;
        if (elapsed <= FRAME_TIME){
            window.requestAnimationFrame(this.playing.bind(this));
            return;
        }

        // プレイヤーの動作
        this.currentFrame = JSON.parse(JSON.stringify(this.stage.mImageData));
        this.moveCharactor(this.player);

        // 敵の動作
        for (let i=0; i<Object.keys(this.enemies).length; i++) {
            this.enemies[i].newDirection = null;
            if (this.enemyMove === 0) {
                let constDirection = [null, 'top', 'down', 'right', 'left'];
                this.enemies[i].newDirection = constDirection[getRandomInt(0, 4)];
            }
            this.moveCharactor(this.enemies[i]);
        }

        if (this.enemyMove === 0) {
            this.enemyMove = 5;
        } else {
            this.enemyMove--;
        }
        this.checkHitEnemies();

        this.draw();
        this.prevTimestamp = timestamp;
        window.requestAnimationFrame(this.playing.bind(this));
    }

    keyDown(e)
    {
        switch(e.keyCode) {
            case 37:    // arrowLeft
            case 65:    // A
                this.player.newDirection = 'left';
                break;
            case 39:    // arrowRight
            case 68:    // D
                this.player.newDirection = 'right';
                break;
            // case 32:    // space
            case 38:    // arrowUp
            case 87:    // W
                this.player.newDirection = 'top';
                break;
            case 40:    // arrowDown
            case 83:    // S
                this.player.newDirection = 'down';
                break;
        }
    }

    keyUp(e)
    {
        switch(e.keyCode) {
            case 37:    // arrowLeft
            case 65:    // A
            case 39:    // arrowRight
            case 68:    // D
            case 38:    // arrowUp
            case 87:    // W
            case 40:    // arrowDown
            case 83:    // S
                this.player.newDirection = null;
                break;
        }
    }

    putCharactor(charactor)
    {
        let minX = 0, maxX = 100,
            minY = 0, maxY = 100;
        charactor.posY = getRandomInt(minY, maxY);
        charactor.posX = getRandomInt(minX, maxX);
        if (this.checkHitWall(charactor)) {
            this.putCharactor(charactor);
        }
    }

    moveCharactor(charactor)
    {
        if (null !== charactor.newDirection) {
            if (charactor.currentDirection !== charactor.newDirection) {
                const turnCount = charactor.directionConst[charactor.currentDirection][charactor.newDirection];
                charactor.currentDirection = charactor.newDirection;
                if (turnCount > 0) for (let i=0; i<turnCount;i++) charactor.turn();
            }

            let prePosX = charactor.posX;
            let prePosY = charactor.posY;
            switch (charactor.newDirection) {
                case 'top':
                    charactor.posY--;
                    break;
                case 'down':
                    charactor.posY++;
                    break;
                case 'right':
                    charactor.posX++;
                    break;
                case 'left':
                    charactor.posX--;
                    break;
            }

            if (this.checkHitWall(charactor)) {
                charactor.posY = prePosY;
                charactor.posX = prePosX;
            }
        }
        for (let row=0;row<charactor.mImageData.length; row++) {
            const currentPosY = charactor.posY + row;
            if (undefined === this.currentFrame[currentPosY]) {
                continue;
            }
            for (let col=0; col<charactor.mImageData[row].length; col++) {
                const currentPosX = charactor.posX + col;
                if (undefined === this.currentFrame[currentPosY][currentPosX]) {
                    continue;
                }
                let color = charactor.mImageData[row][col];
                if ('F' === color) {
                    color = this.currentFrame[currentPosY][currentPosX];
                }
                this.currentFrame[currentPosY][currentPosX] = color;
            }
        }
    }

    checkHitWall(charactor)
    {
        for (let row=0;row<charactor.mImageData.length; row++) {
            const currentPosY = charactor.posY + row;
            if (undefined === this.currentFrame[currentPosY]) {
                continue;
            }
            for (let col=0; col<charactor.mImageData[row].length; col++) {
                const currentPosX = charactor.posX + col;
                if (undefined === this.currentFrame[currentPosY][currentPosX]) {
                    continue;
                }
                if (
                    'F' !== charactor.mImageData[row][col] &&
                    'A' === this.currentFrame[currentPosY][currentPosX]
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    checkHitEnemies()
    {
        for (let row=0;row<this.player.mImageData.length; row++) {
            for (let col=0; col<this.player.mImageData[row].length; col++) {
                for (let enemyCount=0;enemyCount<Object.keys(this.enemies).length;enemyCount++) {
                    for (let eRow=0;eRow<this.enemies[enemyCount].mImageData.length; eRow++) {
                        for (let eCol=0; eCol<this.enemies[enemyCount].mImageData[eRow].length; eCol++) {
                            if (
                                'F' !== this.player.mImageData[row][col] &&
                                'F' !== this.enemies[enemyCount].mImageData[row][col] &&
                                this.player.posY + row === this.enemies[enemyCount].posY + eRow &&
                                this.player.posX + col === this.enemies[enemyCount].posX + eCol
                            ) {
                                alert('hit!');
                                this.player.newDirection = null;
                                this.putCharactor(this.player);
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    draw()
    {
        for (let row = 0; row < this.currentFrame.length; row++) {
            for (let col = 0; col < this.currentFrame[row].length; col++) {
                this.mCanvas.fillStyle = COLORS[this.currentFrame[row][col]];
                this.mCanvas.fillRect(col*PIXCEL_SIZE, row*PIXCEL_SIZE, PIXCEL_SIZE, PIXCEL_SIZE);
            }
        }
    }
}