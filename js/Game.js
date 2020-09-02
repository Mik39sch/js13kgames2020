import CharacterWriter from './CharacterWriter.js';

export default class Game
{
    constructor(inCanvas, stage)
    {
        this.mCanvas = inCanvas;
        this.prevTimestamp = 0;

        this.stage = stage;
        this.holeList = {};
        this.thingList = {};
        this.hit = false;
        this.baseStage = JSON.parse(JSON.stringify(this.stage.img));
        this.currentStage = JSON.parse(JSON.stringify(this.baseStage));

        this.player = new CharacterWriter('player', 'top');
        this.putCharacter(this.player);

        this.enemies = {};
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

        this.currentStage = JSON.parse(JSON.stringify(this.baseStage));

        this.newFrames = {};
        this.preFrames = {};
        // プレイヤーの動作
        this.moveCharacter(this.player, this.hit);

        // 敵の動作
        for (const [key, enemy] of Object.entries(this.enemies)) {
            if (enemy.count >= 0) {
                enemy.count--;
                continue;
            }

            if (this.holeList[enemy.holeKey]) {
                this.holeList[enemy.holeKey].clear = true;
            }
            enemy.img.newDirection = null;
            if (this.enemyMove === 0) {
                let constDirection = [null, 'top', 'down', 'right', 'left'];
                enemy.img.newDirection = constDirection[getRandomInt(0, 4)];
            }
            this.moveCharacter(enemy.img, false);
        }

        if (this.enemyMove === 0) {
            this.enemyMove = 5;
        } else {
            this.enemyMove--;
        }

        if (this.player.action) {
            let hole = this.player.dig();
            this.player.action = false;
            if (!this.checkHitWall(hole)) this.holeList[getRandomInt(0,999)] = hole;
        }

        this.drawMain();
        this.prevTimestamp = timestamp;
        window.requestAnimationFrame(this.playing.bind(this));
    }

    putCharacter(character, posX, posY)
    {
        if (!posX) {
            let minX = 0, maxX = this.stage.img.length;
            posX = getRandomInt(minX, maxX);
        }
        if (!posY) {
            let minY = 0, maxY = this.stage.img.length;
            posY = getRandomInt(minY, maxY);
        }
        character.posY = posY;
        character.posX = posX;
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
        for (let row=0;row<character.img.length; row++) {
            const currentPosY = character.posY + row;
            if (undefined === this.currentStage[currentPosY]) {
                continue;
            }
            for (let col=0; col<character.img[row].length; col++) {
                const currentPosX = character.posX + col;
                if (undefined === this.currentStage[currentPosY][currentPosX]) {
                    continue;
                }
                let color = character.img[row][col];
                if ('F' !== color) {
                    this.currentStage[currentPosY][currentPosX] = color;
                }
            }
        }
    }

    checkHitWall(character)
    {
        for (let row=0;row<character.img.length; row++) {
            const currentPosY = character.posY + row;
            if (undefined === this.stage.img[currentPosY]) {
                continue;
            }
            for (let col=0; col<character.img[row].length; col++) {
                const currentPosX = character.posX + col;
                if (undefined === this.stage.img[currentPosY][currentPosX]) {
                    continue;
                }

                if ('F' !== character.img[row][col]) {
                    if ('A' === this.baseStage[currentPosY][currentPosX]) {
                        return true;
                    }

                    if (character.index !== 'player') {
                        continue;
                    }

                    if ('2' === this.baseStage[currentPosY][currentPosX] || 'C' === this.baseStage[currentPosY][currentPosX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    drawMain()
    {
        for (let [key, hole] of Object.entries(this.holeList)) {
            if (!hole.clear) {
                continue;
            }

            this.clearObject(hole.img, hole.posY, hole.posX);
            delete this.holeList[key];
        }

        for (let [key, thing] of Object.entries(this.thingList)) {
            if (thing.put) {
                continue;
            }
            if (thing.count >= 0) {
                thing.count--;
                if (thing.count === 0) {
                    this.holeList[thing.holeKey].clear = true;
                }
                continue;
            }

            this.drawObject(thing.img, thing.posY, thing.posX);
            thing.put = true;
        }

        for (let [key, enemy] of Object.entries(this.enemies)) {
            this.drawCharacter(enemy.img);
        }
        this.drawCharacter(this.player);

        for (let [key, hole] of Object.entries(this.holeList)) {
            if (hole.put) {
                hole.count--;
                if (hole.count === 0) {
                    hole.clear = true;
                }
                continue;
            }
            this.drawObject(hole.img, hole.posY, hole.posX);
            let num = getRandomInt(0, 100);
            if (0 === num % 13) {
                let enemy = new CharacterWriter('enemy', 'down');
                this.putCharacter(enemy, hole.posX, hole.posY);
                this.enemies[getRandomInt(0, 999)] = {count: 30, img: enemy, holeKey: key};
            } else if (0 === num % 15) {
                this.thingList[getRandomInt(0, 999)] = {
                    count: 30,
                    img: COIN_IMG,
                    holeKey: key,
                    put: false,
                    clear: false,
                    posY: hole.posY,
                    posX: hole.posX
                };
            }

            hole.put = true;
        }
    }

    drawObject(object, posY, posX)
    {
        for (let row=0;row<object.length;row++) {
            for (let col=0;col<object[row].length;col++) {
                let color = object[row][col];
                let paintColor = color;
                if ('F' === color) {
                    color = this.baseStage[posY+row][posX+col];
                    paintColor = this.currentStage[posY+row][posX+col];
                }
                this.baseStage[posY+row][posX+col] = color;
                this.mCanvas.fillStyle = COLORS[paintColor];
                this.mCanvas.fillRect((posX+col)*PIXEL_SIZE , (posY+row)*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }

    clearObject(object, posY, posX)
    {
        for (let row=0;row<object.length;row++) {
            for (let col=0;col<object[row].length;col++) {
                let color = this.stage.img[posY+row][posX+col];
                this.baseStage[posY+row][posX+col] = color;
                this.mCanvas.fillStyle = COLORS[color];
                this.mCanvas.fillRect((posX+col)*PIXEL_SIZE , (posY+row)*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }

    drawCharacter(character)
    {
        for (let row=0;row<character.img.length; row++) {
            const posY = character.prePosY + row;
            if (undefined === this.currentStage[posY]) {
                continue;
            }
            for (let col=0; col<character.img[row].length; col++) {
                const posX = character.prePosX + col;
                if (undefined === this.currentStage[posY][posX]) {
                    continue;
                }
                this.mCanvas.fillStyle = COLORS[this.currentStage[posY][posX]];
                this.mCanvas.fillRect(posX*PIXEL_SIZE, posY*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
        for (let row=0;row<character.img.length; row++) {
            const posY = character.posY + row;
            if (undefined === this.currentStage[posY]) {
                continue;
            }
            for (let col=0; col<character.img[row].length; col++) {
                const posX = character.posX + col;
                if (undefined === this.currentStage[posY][posX]) {
                    continue;
                }
                this.mCanvas.fillStyle = COLORS[this.currentStage[posY][posX]];
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