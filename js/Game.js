import CharacterWriter from './CharacterWriter.js';

export default class Game
{
    constructor(inCanvas, stage)
    {
        this.mCanvas = inCanvas;
        this.prevTimestamp = 0;

        this.stage = stage;
        this.newFrames = {};
        this.preFrames = {};
        this.holeList = [];
        this.hit = false;

        this.player = new CharacterWriter('player', 'top');
        this.putCharacter(this.player);

        this.enemies = {};

        for (let i=0;i<5;i++) {
            this.enemies[i] = new CharacterWriter('enemy', 'down');
            this.putCharacter(this.enemies[i]);
        }

        this.enemyMove = 5;

        window.addEventListener("keydown", this.keyDown.bind(this));
        window.addEventListener("keyup", this.keyUp.bind(this));
    }

    playing(timestamp)
    {
        const elapsed = (timestamp - this.prevTimestamp) / 1000;
        if (elapsed <= FRAME_TIME && !this.hit){
            window.requestAnimationFrame(this.playing.bind(this));
            return;
        }

        // プレイヤーの動作
        this.newFrames = {};
        this.preFrames = {};
        this.moveCharacter(this.player, this.hit);

        // 敵の動作
        for (let i=0; i<Object.keys(this.enemies).length; i++) {
            this.enemies[i].newDirection = null;
            if (this.enemyMove === 0) {
                let constDirection = [null, 'top', 'down', 'right', 'left'];
                this.enemies[i].newDirection = constDirection[getRandomInt(0, 4)];
            }
            this.moveCharacter(this.enemies[i], false);
        }

        if (this.enemyMove === 0) {
            this.enemyMove = 5;
        } else {
            this.enemyMove--;
        }

        if (this.player.action) {
            let hole = this.player.dig();
            this.player.action = false;
            if (!this.checkHitWall(hole)) this.holeList.push(hole);
        }

        this.drawMain();
        this.prevTimestamp = timestamp;
        window.requestAnimationFrame(this.playing.bind(this));
    }

    putCharacter(character)
    {
        let minX = 0, maxX = this.stage.mImageData.length,
            minY = 0, maxY = this.stage.mImageData.length;
        character.posY = getRandomInt(minY, maxY);
        character.posX = getRandomInt(minX, maxX);
        if (this.checkHitWall(character)) {
            this.putCharacter(character);
        }
    }

    moveCharacter(character, hit)
    {
        if (!hit) {
            character.prePosX = character.posX;
            character.prePosY = character.posY;
            this.hit = false;
        }
        if (hit) {
            console.log('prev:'+character.prePosX+','+character.prePosY);
            console.log('now:'+character.posX+','+character.posY);
        }
        if (null !== character.newDirection) {
            if (character.currentDirection !== character.newDirection) {
                character.currentDirection = character.newDirection;
                character.turn();
            }
            switch (character.newDirection) {
                case 'top':
                    character.posY--;
                    break;
                case 'down':
                    character.posY++;
                    break;
                case 'right':
                    character.posX++;
                    break;
                case 'left':
                    character.posX--;
                    break;
            }

            if (this.checkHitWall(character)) {
                character.posY = character.prePosY;
                character.posX = character.prePosX;
            }
        }
        for (let row=0;row<character.mImageData.length; row++) {
            const currentPosY = character.posY + row;
            if (undefined === this.stage.mImageData[currentPosY]) {
                continue;
            }
            for (let col=0; col<character.mImageData[row].length; col++) {
                const currentPosX = character.posX + col;
                if (undefined === this.stage.mImageData[currentPosY][currentPosX]) {
                    continue;
                }
                let color = character.mImageData[row][col];
                if ('F' === color) {
                    color = this.stage.mImageData[currentPosY][currentPosX];
                }
                if (!this.newFrames[color]) {
                    this.newFrames[color] = [];
                }
                this.newFrames[color].push([currentPosY, currentPosX]);
                let stageColor = 'A';
                if (this.stage.mImageData[character.prePosY+row] && this.stage.mImageData[character.prePosY+row][character.prePosX+col]) {
                    stageColor = this.stage.mImageData[character.prePosY+row][character.prePosX+col];
                }
                if (!this.preFrames[stageColor]) {
                    this.preFrames[stageColor] = [];
                }
                this.preFrames[stageColor].push([character.prePosY+row, character.prePosX+col]);
            }
        }
    }

    checkHitWall(character)
    {
        for (let row=0;row<character.mImageData.length; row++) {
            const currentPosY = character.posY + row;
            if (undefined === this.stage.mImageData[currentPosY]) {
                continue;
            }
            for (let col=0; col<character.mImageData[row].length; col++) {
                const currentPosX = character.posX + col;
                if (undefined === this.stage.mImageData[currentPosY][currentPosX]) {
                    continue;
                }
                if (
                    'F' !== character.mImageData[row][col] &&
                    'A' === this.stage.mImageData[currentPosY][currentPosX]
                ) {
                    return true;
                }

                for (let holeCount=0;holeCount<this.holeList.length;holeCount++) {
                    const hole = this.holeList[holeCount];
                    for (let hRow=0;hRow<hole.mImageData.length; hRow++) {
                        for (let hCol=0; hCol<hole.mImageData[hRow].length; hCol++) {
                            if (
                                this.player.posY + row === hole.posY + hRow &&
                                this.player.posX + col === hole.posX + hCol
                            ) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    drawMain()
    {
        for (const [key, enemy] of Object.entries(this.enemies)) {
            this.drawCharacter(enemy);
        }
        this.drawCharacter(this.player);

        this.holeList.forEach(hole => {
            if (hole.put) {
                return;
            }
            const img = hole.mImageData;
            for (let row=0;row<img.length;row++) {
                for (let col=0;col<img[row].length;col++) {
                    let color = img[row][col];
                    if ('F' === color) {
                        color = this.stage.mImageData[hole.posY+row][hole.posX+col];
                    }
                    this.mCanvas.fillStyle = COLORS[color];
                    this.mCanvas.fillRect((hole.posX+col)*PIXEL_SIZE , (hole.posY+row)*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                    hole.put = true;
                }
            }
        });
    }

    drawCharacter(character)
    {
        for (let row=0;row<character.mImageData.length; row++) {
            const posY = character.prePosY + row;
            if (undefined === this.stage.mImageData[posY]) {
                continue;
            }
            for (let col=0; col<character.mImageData[row].length; col++) {
                const posX = character.prePosX + col;
                if (undefined === this.stage.mImageData[posY][posX]) {
                    continue;
                }
                let color = 'A';
                if (this.stage.mImageData[posY] && this.stage.mImageData[posY][posX]) {
                    color = this.stage.mImageData[posY][posX];
                }
                this.mCanvas.fillStyle = COLORS[color];
                this.mCanvas.fillRect(posX*PIXEL_SIZE, posY*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
        for (let row=0;row<character.mImageData.length; row++) {
            const posY = character.posY + row;
            if (undefined === this.stage.mImageData[posY]) {
                continue;
            }
            for (let col=0; col<character.mImageData[row].length; col++) {
                const posX = character.posX + col;
                if (undefined === this.stage.mImageData[posY][posX]) {
                    continue;
                }
                let color = character.mImageData[row][col];
                if ('F' === color) {
                    color = this.stage.mImageData[posY][posX];
                }
                this.mCanvas.fillStyle = COLORS[color];
                this.mCanvas.fillRect(posX*PIXEL_SIZE, posY*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
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
            case 38:    // arrowUp
            case 87:    // W
                this.player.newDirection = 'top';
                break;
            case 40:    // arrowDown
            case 83:    // S
                this.player.newDirection = 'down';
                break;
            case 32:    // space
                this.player.action = true;
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

}