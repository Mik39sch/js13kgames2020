export default class Game
{
    constructor(inCanvas, stage, charactor, enemies)
    {
        this.mCanvas = inCanvas;
        this.prevTimestamp = 0;

        this.stage = stage;
        this.charactor = charactor;
        this.enemies = enemies;

        this.direction = null;

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

        if (null !== this.direction) {
            let prePosX = this.charactor.posX;
            let prePosY = this.charactor.posY;
            switch (this.direction) {
                case 'top':
                    this.charactor.posY--;
                    break;
                case 'down':
                    this.charactor.posY++;
                    break;
                case 'right':
                    this.charactor.posX++;
                    break;
                case 'left':
                    this.charactor.posX--;
                    break;
            }

            if (this.checkHit()) {
                this.charactor.posY = prePosY;
                this.charactor.posX = prePosX;
            }
        }

        this.currentFrame = JSON.parse(JSON.stringify(this.stage.mImageData));
        for (let i=0; i<Object.keys(this.enemies).length; i++) {
            this.putCharactor(this.enemies[i]);
        }
        this.putCharactor(this.charactor);
        this.draw();

        window.requestAnimationFrame(this.playing.bind(this));
    }

    keyDown(e)
    {
        switch(e.keyCode) {
            case 37:    // arrowLeft
            case 65:    // A
                this.direction = 'left';
                break;
            case 39:    // arrowRight
            case 68:    // D
                this.direction = 'right';
                break;
            // case 32:    // space
            case 38:    // arrowUp
            case 87:    // W
                this.direction = 'top';
                break;
            case 40:    // arrowDown
            case 83:    // S
                this.direction = 'down';
                break;
        }
        if (this.direction) {
            const turnCount = this.charactor.direction[this.charactor.currentDirection][this.direction];
            this.charactor.currentDirection = this.direction;
            if (turnCount > 0) for (let i=0; i<turnCount;i++) this.charactor.turn();
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
                this.direction = null;
                break;
        }
    }

    putCharactor(charactor)
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
                let color = charactor.mImageData[row][col];
                if ('F' === color) {
                    color = this.stage.mImageData[currentPosY][currentPosX];
                }
                this.currentFrame[currentPosY][currentPosX] = color;
            }
        }
    }

    checkHit()
    {
        for (let row=0;row<this.charactor.mImageData.length; row++) {
            const currentPosY = this.charactor.posY + row;
            if (undefined === this.currentFrame[currentPosY]) {
                continue;
            }
            for (let col=0; col<this.charactor.mImageData[row].length; col++) {
                const currentPosX = this.charactor.posX + col;
                if (undefined === this.currentFrame[currentPosY][currentPosX]) {
                    continue;
                }
                if (
                    'F' !== this.charactor.mImageData[row][col] &&
                    'A' === this.currentFrame[currentPosY][currentPosX]
                ) {
                    return true;
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