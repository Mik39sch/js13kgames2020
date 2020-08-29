import CharacterWriter from './CharacterWriter.js';

export default class Game
{
    constructor(inCanvas, stage)
    {
        this.mCanvas = inCanvas;
        this.prevTimestamp = 0;

        this.stage = stage;
        this.stageFrame = {};
        this.characterFrame = {};
        this.preCharacterFrame = {};
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
        this.characterFrame = {};
        this.preCharacterFrame = {};
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
                if (!this.characterFrame[color]) {
                    this.characterFrame[color] = [];
                }
                this.characterFrame[color].push([currentPosY, currentPosX]);
                let stageColor = this.stage.mImageData[character.prePosY+row][character.prePosX+col];
                if (!this.preCharacterFrame[stageColor]) {
                    this.preCharacterFrame[stageColor] = [];
                }
                this.preCharacterFrame[stageColor].push([character.prePosY+row, character.prePosX+col]);
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
                                this.player.prePosY = this.player.posY;
                                this.player.prePosX = this.player.posX;
                                this.hit = true;
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
    }
}