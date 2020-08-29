import CharacterWriter from './CharacterWriter.js';

export default class Game
{
    constructor(inCanvas, stage)
    {
        this.mCanvas = inCanvas;
        this.prevTimestamp = 0;

        this.stage = stage;
        this.currentFrame = JSON.parse(JSON.stringify(this.stage.mImageData));
        this.stageFrame = {};
        this.characterFrame = {};
        this.preCharacterFrame = {};
        this.currentFrame.forEach((frameRow, row) => {
            frameRow.forEach((color, col) => {
                if (!this.stageFrame[color]) {
                    this.stageFrame[color] = [];
                }
                this.stageFrame[color].push([row, col]);
                this.mCanvas.fillStyle = COLORS[color];
                this.mCanvas.fillRect(col*PIXEL_SIZE, row*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            });
        });

        this.player = new CharacterWriter('player', 'top');
        this.putCharacter(this.player);

        this.enemies = {};

        // for (let i=0;i<5;i++) {
        //     this.enemies[i] = new CharacterWriter('enemy', 'down');
        //     this.putCharacter(this.enemies[i]);
        // }

        this.enemyMove = 5;

        window.addEventListener("keydown", this.keyDown.bind(this));
        window.addEventListener("keyup", this.keyUp.bind(this));
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
        this.characterFrame = {};
        this.preCharacterFrame = {};
        this.moveCharacter(this.player);

        // // 敵の動作
        // for (let i=0; i<Object.keys(this.enemies).length; i++) {
        //     this.enemies[i].newDirection = null;
        //     if (this.enemyMove === 0) {
        //         let constDirection = [null, 'top', 'down', 'right', 'left'];
        //         this.enemies[i].newDirection = constDirection[getRandomInt(0, 4)];
        //     }
        //     this.moveCharacter(this.enemies[i]);
        // }

        // if (this.enemyMove === 0) {
        //     this.enemyMove = 5;
        // } else {
        //     this.enemyMove--;
        // }
        // this.checkHitEnemies();

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

    putCharacter(character)
    {
        let minX = 0, maxX = 100,
            minY = 0, maxY = 100;
        character.posY = getRandomInt(minY, maxY);
        character.posX = getRandomInt(minX, maxX);
        if (this.checkHitWall(character)) {
            this.putCharacter(character);
        }
    }

    moveCharacter(character)
    {
        let prePosX = character.posX;
        let prePosY = character.posY;
        if (null !== character.newDirection) {
            if (character.currentDirection !== character.newDirection) {
                const turnCount = character.directionConst[character.currentDirection][character.newDirection];
                character.currentDirection = character.newDirection;
                if (turnCount > 0) for (let i=0; i<turnCount;i++) character.turn();
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
                character.posY = prePosY;
                character.posX = prePosX;
            }
        }
        for (let row=0;row<character.mImageData.length; row++) {
            const currentPosY = character.posY + row;
            if (undefined === this.currentFrame[currentPosY]) {
                continue;
            }
            for (let col=0; col<character.mImageData[row].length; col++) {
                const currentPosX = character.posX + col;
                if (undefined === this.currentFrame[currentPosY][currentPosX]) {
                    continue;
                }
                let color = character.mImageData[row][col];
                if ('F' === color) {
                    color = this.currentFrame[currentPosY][currentPosX];
                }
                if (!this.characterFrame[color]) {
                    this.characterFrame[color] = [];
                }
                this.characterFrame[color].push([currentPosY, currentPosX]);

                let stageColor = this.currentFrame[prePosY+row][prePosX+col];
                if (!this.preCharacterFrame[stageColor]) {
                    this.preCharacterFrame[stageColor] = [];
                }
                this.preCharacterFrame[stageColor].push([prePosY+row, prePosX+col]);
                this.currentFrame[currentPosY][currentPosX] = color;
            }
        }
    }

    checkHitWall(character)
    {
        for (let row=0;row<character.mImageData.length; row++) {
            const currentPosY = character.posY + row;
            if (undefined === this.currentFrame[currentPosY]) {
                continue;
            }
            for (let col=0; col<character.mImageData[row].length; col++) {
                const currentPosX = character.posX + col;
                if (undefined === this.currentFrame[currentPosY][currentPosX]) {
                    continue;
                }
                if (
                    'F' !== character.mImageData[row][col] &&
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
                                // alert('hit!');
                                this.player.newDirection = null;
                                this.putCharacter(this.player);
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
        // Object.keys(this.stageFrame).forEach(color => {
        //     this.mCanvas.fillStyle = COLORS[color];
        //     this.stageFrame[color].forEach(pos => {
        //         this.mCanvas.fillRect(pos[1]*PIXEL_SIZE, pos[0]*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        //     })
        // });

        Object.keys(this.preCharacterFrame).forEach(color => {
            this.mCanvas.fillStyle = COLORS[color];
            this.preCharacterFrame[color].forEach(pos => {
                this.mCanvas.fillRect(pos[1]*PIXEL_SIZE, pos[0]*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            });
        });
        Object.keys(this.characterFrame).forEach(color => {
            this.mCanvas.fillStyle = COLORS[color];
            this.characterFrame[color].forEach(pos => {
                this.mCanvas.fillRect(pos[1]*PIXEL_SIZE, pos[0]*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            });
        });
        // this.currentFrame.forEach((frameRow, row) => {
        //     frameRow.forEach((frameCell, col) => {
        //         this.mCanvas.fillStyle = COLORS[frameCell];
        //         this.mCanvas.fillRect(col*PIXEL_SIZE, row*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        //     });
        // });
    }
}