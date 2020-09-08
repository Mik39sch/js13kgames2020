import CharacterWriter from './CharacterWriter.js';
import StageWriter from './StageWriter.js';

export default class Game
{
    constructor(canvas, canvasEl)
    {
        this.mCanvas = canvas;
        this.prevTimestamp = 0;

        this.initialize = true;

        this.stage = new StageWriter(canvasEl);
        this.player = new CharacterWriter('player', 'top');
        this.message = messages.initial_message;
        this.eventKeys = {};

        this.hitPoint = 100;
        this.start();
    }

    start()
    {
        if (this.initialize) {
            this.gameover = false;
            this.gameclear = false;
            this.notFoundCount = 0;
            this.coinCount = 0;
            this.floor = 1;
            this.answer = null;
            this.player.equipment = [];
            this.message = messages.initial_message;
            this.hitPoint = 100;

            this.setEventListener('normal', this);

            this.initialize = false;
        }
        this.zombieCount = 0;
        if (this.stop) {
            this.mCanvas.clearRect(0, 0, this.stage.canvasEl.width, this.stage.canvasEl.height);
            this.stage.createMazeAsTorneko(this.stage.width, this.stage.height);
            this.mCanvas.beginPath();
        }

        this.stage.draw();
        this.holeList = {};
        this.thingList = {};
        this.hit = false;
        this.baseStage = JSON.parse(JSON.stringify(this.stage.img));
        this.currentStage = JSON.parse(JSON.stringify(this.baseStage));
        this.putCharacter(this.player);

        this.enemies = {};
        this.enemyMove = 5;
        this.stop = false;

        this.putExit();
        if (!this.player.equipment.includes("shovel")) {
            this.putShovel();
        }

        this.player.equipment = this.player.equipment.filter(eq=> eq !== 'key');

        this.player.newDirection = null;

        let msgEl = document.getElementById("message");
        msgEl.style.display = "flex";
        msgEl.style.width = this.stage.canvasEl.width;
        msgEl.style.height = this.stage.canvasEl.height;

        let self = this;

        if (this.gameover) {
            msgEl.innerHTML = "";

            if (this.floor > 404) {
                msgEl.innerHTML += "It been days since i was looking for an exit.<br>";
                msgEl.innerHTML += "I have reached the last floor 404. But i'm still not successful.<br>";
                msgEl.innerHTML += "I starved to death in this cave, and now i turned in to a zombie.<br>";
            } else if (this.zombieCount >= 50) {
                msgEl.innerHTML += "I couldn't move because of this zombies around me.<br>";
                msgEl.innerHTML += "One of them has bitten me and turned me into one.<br>";
            } else if (this.hitPoint <= 0) {
                msgEl.innerHTML += "Zombies have attacked me. I can't see anything.<br>";
                msgEl.innerHTML += "One of them has bitten me and turned me into one.<br>";
            }

            msgEl.innerHTML += "Next time a treasure hunter gets lost in this cave.<br>";
            msgEl.innerHTML += "I will prepare welcome party...<br>";
            msgEl.innerHTML += "<br>";
            msgEl.innerHTML += "Press any key to start a new game.";

            msgEl.classList.remove('fadeout');

            setTimeout(function(){
                self.setEventListener('continue', self);
            }, 1000);

        } else if (this.gameclear) {
            msgEl.innerHTML = "";

            msgEl.innerHTML += "I finally found the exit. I think this cave is very dangerous...<br>";
            msgEl.innerHTML += "But I was able to get a lot of money and I'm still alive!!<br>";
            msgEl.innerHTML += "I think it's okay to come back for more.<br>";
            msgEl.innerHTML += "<br>";
            msgEl.innerHTML += "Press any key to start a new game.";

            msgEl.classList.remove('fadeout');

            setTimeout(function(){
                self.setEventListener('continue', self);
            }, 1000);
        } else {
            msgEl.classList.add('fadeout');
            msgEl.innerText = `${this.floor}F`;
            setTimeout(function(){
                msgEl.style.display = "none";
            }, 5000);

            window.requestAnimationFrame(self.playing.bind(self));
        }
    }

    playing(timestamp)
    {
        const elapsed = (timestamp - this.prevTimestamp) / 1000;
        if (elapsed <= FRAME_TIME && !this.hit){
            window.requestAnimationFrame(this.playing.bind(this));
            return;
        }

        if (this.stop) {
            return;
        }

        this.currentStage = JSON.parse(JSON.stringify(this.baseStage));

        this.newFrames = {};
        this.preFrames = {};

        if (!this.player.hit) {
            // プレイヤーの動作
            this.moveCharacter(this.player, this.hit);
        } else {
            this.player.hit = false;
        }

        // 敵の動作
        for (const [key, enemy] of Object.entries(this.enemies)) {
            if (enemy === undefined) continue;
            if (enemy.count >= 0) {
                enemy.count--;
                continue;
            }

            if (this.holeList[enemy.holeKey]) {
                this.zombieCount++;
                if (this.zombieCount === 50) {
                    this.gameover = true;
                    this.start();
                }
                this.holeList[enemy.holeKey].clear = true;
            }
            enemy.img.newDirection = null;
            if (this.enemyMove === 0) {
                let constDirection = ['top', 'down', 'left', 'right', null];
                let direction = constDirection[getRandomInt(0, 4)];
                if (direction === enemy.img.newDirection) direction = null;
                enemy.img.newDirection = direction;
            }
            this.moveCharacter(enemy.img, false);
        }

        if (this.enemyMove === 0) {
            this.enemyMove = 5;
        } else {
            this.enemyMove--;
        }

        if (this.player.digAction) {
            this.player.digAction = false;

            if (this.player.equipment.includes("shovel")) {
                let hole = this.player.dig();
                let hit = true;
                hit = this.checkHitWall(hole);

                if (!hit) {
                    for (let row=0;row<hole.img.length;row++) {
                        for (let col=0;col<hole.img[0].length;col++) {
                            if (this.checkHitThing(row, col, hole)) hit = true;
                            if (this.checkHitExit(row, col, hole)) hit = true;
                            if (hit) {
                                break;
                            }
                        }
                        if (hit) {
                            break;
                        }
                    }
                }

                if (!hit) {
                    this.holeList[getRandomInt(0,999)] = hole;
                }
            }
        }

        this.checkHit();

        this.drawMain();
        this.prevTimestamp = timestamp;
        window.requestAnimationFrame(this.playing.bind(this));
    }

    putCharacter(character, posX, posY)
    {
        if (!posX) {
            let minX = 0, maxX = this.stage.img[0].length;
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
            if (undefined === this.baseStage[currentPosY]) {
                return true;
            }
            for (let col=0; col<character.img[row].length; col++) {
                const currentPosX = character.posX + col;
                if (undefined === this.baseStage[currentPosY][currentPosX]) {
                    return true;
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

    checkHitEnemies(row, col)
    {
        for (const [key, enemy] of Object.entries(this.enemies)) {
            if (enemy === undefined) continue;
            for (let eRow=0;eRow<enemy.img.img .length; eRow++) {
                for (let eCol=0; eCol<enemy.img.img[eRow].length; eCol++) {
                    if (
                        'F' !== this.player.img[row][col] &&
                        'F' !== enemy.img.img[eRow][eCol] &&
                        this.player.posY + row === enemy.img.posY + eRow &&
                        this.player.posX + col === enemy.img.posX + eCol
                    ) {
                        switch (this.player.newDirection) {
                            case 'top':
                                this.player.posY += 10;
                                break;
                            case 'down':
                                this.player.posY -= 10;
                                break;
                            case 'right':
                                this.player.posX -= 10;
                                break;
                            case 'left':
                                this.player.posX += 10;
                                break;
                        }
                        if (this.checkHitWall(this.player)) {
                            this.player.newDirection = null;
                            this.putCharacter(this.player);
                        }
                        this.player.hit = true;
                        this.message = messages.zombie_attack;
                        this.hitPoint -= 10;
                        if (this.hitPoint <= 0) {
                            this.gameover = true;
                            this.start();
                        }
                        return true;
                    }
                }
            }
        }
    }

    checkHitThing(row, col, target)
    {
        for (const [key, thing] of Object.entries(this.thingList)) {
            if (thing === undefined) continue;
            for (let eRow=0;eRow<thing.img .length; eRow++) {
                for (let eCol=0; eCol<thing.img[eRow].length; eCol++) {
                    if (
                        'F' !== target.img[row][col] &&
                        'F' !== thing.img[eRow][eCol] &&
                        target.posY + row === thing.posY + eRow &&
                        target.posX + col === thing.posX + eCol
                    ) {
                        if (target.index === 'player') thing.clear = true;
                        return true;
                    }
                }
            }
        }
    }

    checkHitExit(row, col, target)
    {
        for (let eRow=0;eRow<this.exit.img .length; eRow++) {
            for (let eCol=0; eCol<this.exit.img[eRow].length; eCol++) {
                if (
                    'F' !== target.img[row][col] &&
                    target.posY + row === this.exit.posY + eRow &&
                    target.posX + col === this.exit.posX + eCol
                ) {
                    return true;
                }
            }
        }
    }

    checkHit()
    {
        for (let row=0;row<this.player.img.length; row++) {
            for (let col=0; col<this.player.img[row].length; col++) {
                if (this.checkHitEnemies(row, col)) return true;
                if (this.checkHitThing(row, col, this.player)) return true;
                if (this.checkHitExit(row, col, this.player)) {
                    this.message = messages.up_or_stay;
                    this.stop = true;
                    this.answer = 'Yes';
                    this.setEventListener('question', this);
                    return true;
                }
            }
        }
        return false;
    }

    drawMain()
    {
        for (let [key, hole] of Object.entries(this.holeList)) {
            if (hole === undefined) continue;
            if (!hole.clear) {
                continue;
            }

            this.clearObject(hole.img, hole.posY, hole.posX);
            delete this.holeList[key];
        }

        for (let [key, thing] of Object.entries(this.thingList)) {
            if (thing === undefined) continue;
            if (thing.put) {
                if (thing.clear) {
                    this.clearObject(thing.img, thing.posY, thing.posX);
                    thing.clearFunc();
                    delete this.thingList[key];
                }
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

        if (!this.exit.put) {
            this.drawObject(this.exit.img, this.exit.posY, this.exit.posX);
            this.exit.put = true;
        }

        for (let [key, enemy] of Object.entries(this.enemies)) {
            if (enemy === undefined) continue;
            this.drawCharacter(enemy.img);
        }
        this.drawCharacter(this.player);

        for (let [key, hole] of Object.entries(this.holeList)) {
            if (hole === undefined) continue;
            if (hole.put) {
                hole.count--;
                if (hole.count === 0) {
                    this.notFoundCount++;
                    this.message = messages.not_found;
                    hole.clear = true;
                }
                continue;
            }
            this.drawObject(hole.img, hole.posY, hole.posX);

            let num = getRandomInt(0, 10);

            if (0 === num) {
                let enemy = new CharacterWriter('enemy', 'down');
                if (!this.checkHitWall(hole)) {
                    this.putCharacter(enemy, hole.posX, hole.posY);
                    this.enemies[getRandomInt(0, 999)] = {count: 30, img: enemy, holeKey: key};
                }
            } else if (1 === num) {
                this.thingList[getRandomInt(0, 999)] = {
                    count: 30,
                    img: COIN_IMG,
                    holeKey: key,
                    put: false,
                    clear: false,
                    posY: hole.posY,
                    posX: hole.posX,
                    clearFunc: () => {
                        this.message = messages.found_coin;
                        this.coinCount++;
                    }
                };
            } else if (2 === num) {
                this.thingList[getRandomInt(0, 999)] = {
                    count: 30,
                    img: ONIGIRI_IMG,
                    holeKey: key,
                    put: false,
                    clear: false,
                    posY: hole.posY,
                    posX: hole.posX,
                    clearFunc: () => {
                        this.message = messages.found_onigiri;
                        if (this.hitPoint < 100) this.hitPoint += 10;
                    }
                };
            } else if (3 === num) {
                if (!this.player.equipment.includes("sword")) {
                    this.thingList[getRandomInt(0, 999)] = {
                        count: 30,
                        img: SWORD_IMG,
                        holeKey: key,
                        put: false,
                        clear: false,
                        posY: hole.posY,
                        posX: hole.posX,
                        clearFunc: () => {
                            this.player.equipment.push('sword');
                            this.message = messages.found_sword;
                        }
                    };
                }
            } else if (0 === getRandomInt(0, 50)) {
                if (!this.player.equipment.includes("key")) {
                    this.thingList[getRandomInt(0, 999)] = {
                        count: 30,
                        img: KEY_IMG,
                        holeKey: key,
                        put: false,
                        clear: false,
                        posY: hole.posY,
                        posX: hole.posX,
                        clearFunc: () => {
                            this.message = messages.found_key;
                            this.player.equipment.push("key");
                        }
                    };
                }
            } else if (0 === getRandomInt(0, 50)) {
                if (this.floor > 1) {
                    this.stop = true;
                    this.start();
                    this.floor--;
                    this.message = messages.fall_down;
                }
            }

            hole.put = true;
        }

        this.mCanvas.fillStyle = WALL_COLOR;
        this.mCanvas.fillRect(0 ,this.stage.height*PIXEL_SIZE , this.stage.width*PIXEL_SIZE, MESSAGE_WINDOW_HEIGHT);
        this.mCanvas.font = "10pt monospace";
        this.mCanvas.textAlign = "left";
        this.mCanvas.textBaseline = "top";
        this.writeCountWindow();
        this.writeInformationWindow();
        this.writeMessageWindow();
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

    writeCountWindow(id)
    {
        let startPosition = 0;
        let margin = 5;
        this.mCanvas.strokeStyle = 'white';
        this.mCanvas.strokeRect(startPosition+margin ,this.stage.height*PIXEL_SIZE+margin, 150, MESSAGE_WINDOW_HEIGHT-margin*2);

        this.mCanvas.fillStyle = "white";

        this.mCanvas.fillText(
            `Not Found : ${this.notFoundCount}`,
            startPosition+margin*2,
            this.stage.height*PIXEL_SIZE+margin*2,
            this.stage.width*PIXEL_SIZE
        );
        this.mCanvas.fillText(
            `Coin      : ${this.coinCount}`,
            startPosition+margin*2,
            this.stage.height*PIXEL_SIZE + 20*1 +margin*2,
            this.stage.width*PIXEL_SIZE
        );
        this.mCanvas.fillText(
            `HP        : ${this.hitPoint}`,
            startPosition+margin*2,
            this.stage.height*PIXEL_SIZE + 20*2 +margin*2,
            this.stage.width*PIXEL_SIZE
        );
        this.mCanvas.fillText(
            `Floor     : ${this.floor}F`,
            startPosition+margin*2,
            this.stage.height*PIXEL_SIZE+20*3+margin*2,
            this.stage.width*PIXEL_SIZE
        );
        this.mCanvas.beginPath();
    }

    writeInformationWindow()
    {
        let margin = 5;
        let startPosition = 150+margin;
        this.mCanvas.strokeStyle = 'white';
        this.mCanvas.strokeRect(startPosition+margin ,this.stage.height*PIXEL_SIZE+margin, 150, MESSAGE_WINDOW_HEIGHT-margin*2);

        this.mCanvas.fillStyle = "white";

        this.mCanvas.fillText(
            `Equipment: `,
            startPosition+margin*2,
            this.stage.height*PIXEL_SIZE+margin*2,
            this.stage.width*PIXEL_SIZE
        );

        for (let i=0; i< this.player.equipment.length; i++) {
            const item = this.player.equipment[i];
            this.mCanvas.fillText(
                ` ${item}`,
                startPosition+margin*2,
                this.stage.height*PIXEL_SIZE+20*(i+1)+margin*2,
                this.stage.width*PIXEL_SIZE
            );
        }
        this.mCanvas.beginPath();
    }

    writeMessageWindow()
    {
        let margin = 5;
        let startPosition = (150+margin)*2;
        this.mCanvas.strokeStyle = 'white';
        this.mCanvas.strokeRect(startPosition+margin ,this.stage.height*PIXEL_SIZE+margin, this.stage.width*PIXEL_SIZE - startPosition - margin*2, MESSAGE_WINDOW_HEIGHT-margin*2);

        this.mCanvas.fillStyle = "white";
        this.mCanvas.beginPath();

        let height = this.stage.height*PIXEL_SIZE+margin*2;
        for (let i=0; i< this.message.length; i++) {
            const msg = this.message[i];
            height = (i === 0) ? height : height + 20;
            this.mCanvas.fillText(
                msg,
                startPosition+margin*2,
                height,
                this.stage.width*PIXEL_SIZE
            );
        }
    }

    putExit()
    {
        let roomIdx = getRandomInt(0, this.stage.roomList.length-1);
        let room = this.stage.roomList[roomIdx];

        let posY = getRandomInt(room.minY+CHARACTER_SIZE, room.maxY-CHARACTER_SIZE*2);
        let posX = getRandomInt(room.minX+CHARACTER_SIZE, room.maxX-CHARACTER_SIZE*2);

        let exit = {img:STAIRS_IMG, posY:posY, posX:posX, put:false, clear: false};
        if (this.checkHitWall(exit)) {
            this.putExit();
            return;
        }
        this.exit = exit;
        for (let row=0;row<this.player.img.length; row++) {
            for (let col=0; col<this.player.img[row].length; col++) {
                if (this.checkHitExit(row, col, this.player)) {
                    this.putExit();
                    return;
                }
            }
        }
    }

    putShovel()
    {
        let roomIdx = getRandomInt(0, this.stage.roomList.length-1);
        let room = this.stage.roomList[roomIdx];
        let posY = getRandomInt(room.minY, room.maxY-CHARACTER_SIZE);
        let posX = getRandomInt(room.minX, room.maxX-CHARACTER_SIZE);

        let shovel = {img:SHOVEL_IMG, posY:posY, posX:posX, put:false, clear: false, clearFunc: () => {
            this.player.equipment.push('shovel');
            this.message = messages.found_shovel;
        }};
        if (this.checkHitWall(shovel)) {
            this.putShovel();
            return;
        }
        this.thingList[getRandomInt(0, 999)] = shovel;
    }

    keyDown(e)
    {
        switch(e.keyCode) {
            case 37:    // arrowLeft
            case 65:    // A
                this.move('left');
                break;
            case 39:    // arrowRight
            case 68:    // D
                this.move('right');
                break;
            case 38:    // arrowUp
            case 87:    // W
                this.move('top');
                break;
            case 40:    // arrowDown
            case 83:    // S
                this.move('down');
                break;
            case 32:    // space
                this.actionEvent('dig');
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
                this.move(null);
                break;
        }
    }

    chooseAnswer()
    {
        if (this.answer === 'Yes') {
            this.message[1] = '  Yes';
            this.message[2] = '> No';
            this.answer = 'No';
        } else {
            this.message[1] = '> Yes';
            this.message[2] = '  No';
            this.answer = 'Yes';
        }
        this.mCanvas.fillStyle = WALL_COLOR;
        this.mCanvas.fillRect(0 ,this.stage.height*PIXEL_SIZE , this.stage.width*PIXEL_SIZE, MESSAGE_WINDOW_HEIGHT);
        this.mCanvas.font = "10pt monospace";
        this.mCanvas.textAlign = "left";
        this.mCanvas.textBaseline = "top";
        this.writeCountWindow();
        this.writeInformationWindow();
        this.writeMessageWindow();
    }

    selectAnswer()
    {
        if (this.answer === 'Yes') {
            if (this.player.equipment.includes("key")) {
                this.message = messages.up_stairs;
                this.floor++;
                this.answer = null;
                if (this.floor > 404) {
                    this.gameover = true;
                }
                if (0 === getRandomInt(0, 50)) {
                    this.gameclear = true;
                }
                this.start();
            } else {
                this.stop = false;
                this.player.posY = this.player.prePosY;
                this.player.posX = this.player.prePosX;
                this.player.newDirection = null;
                window.requestAnimationFrame(this.playing.bind(this));
                this.message = messages.not_found_key;
            }
        } else {
            this.stop = false;
            this.player.posY = this.player.prePosY;
            this.player.posX = this.player.prePosX;
            this.player.newDirection = null;
            window.requestAnimationFrame(this.playing.bind(this));
            this.message = messages.stay_floor;
        }
        this.setEventListener('normal', this);
    }

    keyUpQuestion(e)
    {
        switch(e.keyCode) {
            case 38:    // arrowUp
            case 87:    // W
            case 40:    // arrowDown
            case 83:    // S
                this.chooseAnswer();
                break;
            case 32:    // space
                this.selectAnswer();
                break;
        }
    }

    newGame(e)
    {
        this.initialize = true;
        this.start();
    }

    move(direction)
    {
        this.player.newDirection = direction;
    }

    actionEvent(action)
    {
        switch(action) {
            case 'dig':
                this.player.digAction = true;
                break;
            case 'attack':
                this.player.attackAction = true;
                break;
        }
    }

    setEventListener(eventType, user)
    {
        for (const [key, event] of Object.entries(user.eventKeys)) {
            handler.removeListener(event);
        }
        if (eventType === 'normal') {
            // キーボード操作
            user.eventKeys.keyup = handler.addListener(window, 'keyup', user.keyUp.bind(user), false);
            user.eventKeys.keydown = handler.addListener(window, 'keydown', user.keyDown.bind(user), false);

            //マウス操作
            user.eventKeys.mouseDownRight = handler.addListener(document.getElementById('ArrowRight'), 'mousedown', e => user.move('right'), false);
            user.eventKeys.mouseDownLeft = handler.addListener(document.getElementById('ArrowLeft'), 'mousedown', e => user.move('left'), false);
            user.eventKeys.mouseDownUp = handler.addListener(document.getElementById('ArrowUp'), 'mousedown', e => user.move('top'), false);
            user.eventKeys.mouseDownDown = handler.addListener(document.getElementById('ArrowDown'), 'mousedown', e => user.move('down'), false);

            user.eventKeys.mouseUpRight = handler.addListener(document.getElementById('ArrowRight'), 'mouseup', e => user.move(null), false);
            user.eventKeys.mouseUpLeft = handler.addListener(document.getElementById('ArrowLeft'), 'mouseup', e => user.move(null), false);
            user.eventKeys.mouseUpUp = handler.addListener(document.getElementById('ArrowUp'), 'mouseup', e => user.move(null), false);
            user.eventKeys.mouseUpDown = handler.addListener(document.getElementById('ArrowDown'), 'mouseup', e => user.move(null), false);

            user.eventKeys.mouseDownDig = handler.addListener(document.getElementById('a'), 'mousedown', e => user.actionEvent('dig'), false);
            user.eventKeys.mouseDownAttack = handler.addListener(document.getElementById('b'), 'mousedown', e => user.actionEvent('attack'), false);

            //タッチ操作
            user.eventKeys.touchStartRight = handler.addListener(document.getElementById('ArrowRight'), 'touchstart', e => user.move('right'), false);
            user.eventKeys.touchStartLeft = handler.addListener(document.getElementById('ArrowLeft'), 'touchstart', e => user.move('left'), false);
            user.eventKeys.touchStartUp = handler.addListener(document.getElementById('ArrowUp'), 'touchstart', e => user.move('top'), false);
            user.eventKeys.touchStartDown = handler.addListener(document.getElementById('ArrowDown'), 'touchstart', e => user.move('down'), false);

            user.eventKeys.touchEndRight = handler.addListener(document.getElementById('ArrowRight'), 'touchend', e => user.move(null), false);
            user.eventKeys.touchEndLeft = handler.addListener(document.getElementById('ArrowLeft'), 'touchend', e => user.move(null), false);
            user.eventKeys.touchEndUp = handler.addListener(document.getElementById('ArrowUp'), 'touchend', e => user.move(null), false);
            user.eventKeys.touchEndDown = handler.addListener(document.getElementById('ArrowDown'), 'touchend', e => user.move(null), false);

            user.eventKeys.touchStartDig = handler.addListener(document.getElementById('a'), 'touchstart', e => user.actionEvent('dig'), false);
            user.eventKeys.touchStartAttack = handler.addListener(document.getElementById('b'), 'touchstart', e => user.actionEvent('attack'), false);
            return;
        } else if (eventType === 'question') {
            user.eventKeys.keyup = handler.addListener(window, 'keyup', user.keyUpQuestion.bind(user), false);

            //マウス操作
            user.eventKeys.mouseUpUp = handler.addListener(document.getElementById('ArrowUp'), 'mouseup', e => user.chooseAnswer(), false);
            user.eventKeys.mouseUpDown = handler.addListener(document.getElementById('ArrowDown'), 'mouseup', e => user.chooseAnswer(), false);

            user.eventKeys.mouseDownDig = handler.addListener(document.getElementById('a'), 'mousedown', e => user.selectAnswer(), false);
            user.eventKeys.mouseDownAttack = handler.addListener(document.getElementById('b'), 'mousedown', e => user.selectAnswer(), false);

            //タッチ操作
            user.eventKeys.touchEndUp = handler.addListener(document.getElementById('ArrowUp'), 'touchend', e => user.chooseAnswer(), false);
            user.eventKeys.touchEndDown = handler.addListener(document.getElementById('ArrowDown'), 'touchend', e => user.chooseAnswer(), false);

            user.eventKeys.touchStartDig = handler.addListener(document.getElementById('a'), 'touchstart', e => user.selectAnswer(), false);
            user.eventKeys.touchStartAttack = handler.addListener(document.getElementById('b'), 'touchstart', e => user.selectAnswer(), false);
        } else if (eventType === 'continue') {
            user.eventKeys.keyup = handler.addListener(window, 'keyup', user.newGame.bind(user), false);

            //マウス操作
            user.eventKeys.mouseUpRight = handler.addListener(document.getElementById('ArrowRight'), 'mouseup', user.newGame.bind(user), false);
            user.eventKeys.mouseUpLeft = handler.addListener(document.getElementById('ArrowLeft'), 'mouseup', user.newGame.bind(user), false);
            user.eventKeys.mouseUpUp = handler.addListener(document.getElementById('ArrowUp'), 'mouseup', user.newGame.bind(user), false);
            user.eventKeys.mouseUpDown = handler.addListener(document.getElementById('ArrowDown'), 'mouseup', user.newGame.bind(user), false);

            user.eventKeys.mouseDownDig = handler.addListener(document.getElementById('a'), 'mousedown', user.newGame.bind(user), false);
            user.eventKeys.mouseDownAttack = handler.addListener(document.getElementById('b'), 'mousedown', user.newGame.bind(user), false);

            //タッチ操作
            user.eventKeys.touchEndRight = handler.addListener(document.getElementById('ArrowRight'), 'touchend', user.newGame.bind(user), false);
            user.eventKeys.touchEndLeft = handler.addListener(document.getElementById('ArrowLeft'), 'touchend', user.newGame.bind(user), false);
            user.eventKeys.touchEndUp = handler.addListener(document.getElementById('ArrowUp'), 'touchend', user.newGame.bind(user), false);
            user.eventKeys.touchEndDown = handler.addListener(document.getElementById('ArrowDown'), 'touchend', user.newGame.bind(user), false);

            user.eventKeys.touchStartDig = handler.addListener(document.getElementById('a'), 'touchstart', user.newGame.bind(user), false);
            user.eventKeys.touchStartAttack = handler.addListener(document.getElementById('b'), 'touchstart', user.newGame.bind(user), false);
        }
    }
}