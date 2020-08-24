export default class Game
{
    constructor(inCanvas, stage, charactor)
    {
        this.mCanvas = inCanvas;
        this.prevTimestamp = 0;

        this.stage = stage;
        this.charactor = charactor;

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
        if (
            (this.charactor.isTurn && this.charactor.posX > this.stage.stageWidth - this.charactor.mImageData[0].length * PIXEL_SIZE) ||
            (!this.charactor.isTurn && this.charactor.posX <= 0)
        ) {
            this.charactor.moving = false;
        }

        this.prevTimestamp = timestamp;
        let prevPosY = this.charactor.posY;
        let standingPos = this.charactor.getStandingPosition();

        if (this.charactor.jumping) {
            this.charactor.posY =
                (0.5 * 0.4 * this.charactor.jumpTimer * this.charactor.jumpTimer - 10 * this.charactor.jumpTimer) +
                (this.charactor.jumpstartPos - PIXEL_SIZE * this.charactor.mImageData.length);
            this.charactor.posY = this.charactor.posY - (this.charactor.posY % PIXEL_SIZE);
            this.charactor.jumpTimer++;
        } else if (!this.charactor.standing) {
            this.charactor.posY += PIXEL_SIZE;
        }

        // 足場判定
        let canStanding = false;
        for (let i=0;i < standingPos["x"].length;i++){
            if (
                !this.stage.mImageData[standingPos["y"]] ||
                !this.stage.mImageData[standingPos["y"]][standingPos["x"][i]]
            ) {
                continue;
            }

            // 1か所でも足場があれば乗る
            if (
                prevPosY < this.charactor.posY &&
                "A" === this.stage.mImageData[standingPos["y"]][standingPos["x"][i]]
            ) {
                this.charactor.posY = this.charactor.posY - PIXEL_SIZE;
                this.charactor.jumping = false;
                this.charactor.standing = true;
            }

            // 足場が一つもなければ落ちる
            if ("A" === this.stage.mImageData[standingPos["y"]][standingPos["x"][i]]) {
                canStanding = true;
            }
        }

        if (prevPosY === this.charactor.posY && !canStanding) this.charactor.standing = false;

        if (this.charactor.moving) {
            if (this.charactor.isTurn) {
                this.charactor.posX += PIXEL_SIZE;
            } else {
                this.charactor.posX -= PIXEL_SIZE;
            }
        }

        this.putCharactor();
        this.draw();

        window.requestAnimationFrame(this.playing.bind(this));
    }

    keyDown(e)
    {
        switch(e.keyCode) {
            case 37:    // arrowLeft
            case 65:    // A
                this.charactor.turn(false);
                this.charactor.moving = true;
                break;
            case 39:    // arrowRight
            case 68:    // D
                this.charactor.turn(true);
                this.charactor.moving = true;
                break;
            case 32:    // space
            case 38:    // arrowUp
            case 87:    // W
                if (this.charactor.jumping) return;

                this.charactor.jumping = true;
                this.charactor.jumpTimer = 0;
                let standingPos = this.charactor.getStandingPosition();
                this.charactor.jumpstartPos = standingPos["y"] * PIXEL_SIZE;
                break;
            case 40:    // arrowDown
            case 83:    // S
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
                this.charactor.moving = false;
                break;
            case 32:    // space
            case 38:    // arrowUp
            case 87:    // W
                break;
            case 40:    // arrowDown
            case 83:    // S
                break;
        }
    }

    putCharactor()
    {
        this.currentFrame = JSON.parse(JSON.stringify(this.stage.mImageData));
        for (let row=0;row<this.charactor.mImageData.length; row++) {
            const currentPosY = this.charactor.posY/PIXEL_SIZE + row;
            if (!this.currentFrame[currentPosY]) {
                continue;
            }
            for (let col=0; col<this.charactor.mImageData[row].length; col++) {
                const currentPosX = this.charactor.posX/PIXEL_SIZE + col;
                if (!this.currentFrame[currentPosY][currentPosX]) {
                    continue;
                }
                let color = this.charactor.mImageData[row][col];
                if ('F' === color) {
                    color = this.stage.mImageData[currentPosY][currentPosX];
                }
                this.currentFrame[currentPosY][currentPosX] = color;
            }
        }
    }

    draw()
    {
        for (let row = 0; row < this.currentFrame.length; row++) {
            for (let col = 0; col < this.currentFrame[row].length; col++) {
                this.mCanvas.fillStyle = COLORS[this.currentFrame[row][col]];
                this.mCanvas.fillRect(col*PIXEL_SIZE, row*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }
}