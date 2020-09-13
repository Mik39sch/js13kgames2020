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
        this.message = JSON.parse(JSON.stringify(messages.initial_message));
        this.eventKeys = {};
        this.attackCount = 0;
        this.killCount = 0;
        this.hitEnemyKey = false;

        this.maxHitPoint = 100;
        this.hitCount = 0;
        this.swordHitPoint = 0;
        this.title = true;
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
            this.message = JSON.parse(JSON.stringify(messages.initial_message));
            this.maxHitPoint = 100;
            this.hitPoint = this.maxHitPoint;
            this.killCount = 0;
            this.setEventListener('normal', this);

            this.initialize = false;
        }
        this.hitEnemyKey = false;
        this.zombieCount = 0;
        if (this.stop) {
            this.mCanvas.clearRect(0, 0, this.stage.canvasEl.width, this.stage.canvasEl.height);
            this.stage.createMazeAsTorneko(this.stage.width, this.stage.height);
            this.mCanvas.beginPath();
        }

        this.stage.draw();
        this.holeList = {};
        this.thingList = {};
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

        if (this.title) {
            msgEl.innerHTML = "";

            msgEl.innerHTML += '<h1 style="margin:15px">Lost<br>Treasures</h1>';

            msgEl.innerHTML += "One day... There was a treasures hunter.<br>";
            msgEl.innerHTML += "He heard a rumor that there was some treasures in the cave.<br>";
            msgEl.innerHTML += "So he went to the cave but... He was lost!<br>";
            msgEl.innerHTML += "You need to navigate to the exit for him.<br>";
            msgEl.innerHTML += "<br>";
            msgEl.innerHTML += "ArrowKeys: move<br>";
            msgEl.innerHTML += "SpaceKeys: dig *if you have a shovel<br>";
            msgEl.innerHTML += "EnterKeys: attack *if you have a sword<br>";

            msgEl.innerHTML += "<br>";
            msgEl.innerHTML += "Press any key to start a new game.";

            msgEl.classList.remove('fadeout');
            this.title = false;

            setTimeout(function(){
                self.setEventListener('continue', self);
            }, 1000);
        } else if (this.gameover) {
            msgEl.innerHTML = "";
            this.title = true;

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
            this.title = true;
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
            msgEl.innerText = `Stage ${this.floor}`;
            setTimeout(function(){
                msgEl.style.display = "none";
            }, 5000);

            window.requestAnimationFrame(self.playing.bind(self));
        }
    }

    playing(timestamp)
    {
        if (this.stop) {
            return;
        }

        this.currentStage = JSON.parse(JSON.stringify(this.baseStage));

        let type = 'normal';
        if (this.player.attackAction === true && this.player.equipment.includes("sword")) {
            if (this.attackCount === 2) {
                type = 'attack1';
            } else if (this.attackCount === 1) {
                type = 'attack2';
            } else {
                this.player.attackAction = false;
                type = 'normal';
            }
            this.attackCount--;
        } else if (this.player.digAction === true && this.player.equipment.includes("shovel")) {
            type = 'dig';
            this.player.digAction = false;
        } else if (this.player.hit) {
            type = 'hit';
            if (this.checkHitWall(this.player)) {
                this.player.newDirection = null;
                this.putCharacter(this.player);
            }
            this.player.hit = false;
        }

        // プレイヤーの動作
        this.moveCharacter({
            character: this.player,
            actionType: type
        });

        if (this.player.hit) {
            window.requestAnimationFrame(this.playing.bind(this));
            return;
        }

        // 敵の動作
        for (const [key, enemy] of Object.entries(this.enemies)) {
            if (enemy === undefined) continue;
            if (enemy.count >= 0) {
                enemy.count--;
                continue;
            }
            if (this.hitEnemyKey === key) {
                enemy.clear = true;
                this.hitEnemyKey = false;
                continue;
            }

            if (this.holeList[enemy.holeKey]) {
                this.zombieCount++;
                if (this.zombieCount === 50) {
                    this.gameover = true;
                    this.start();
                    return;
                }
                this.holeList[enemy.holeKey].clear = true;
            }

            if (type !== 'attack2') {
                enemy.img.newDirection = null;
                if (this.enemyMove === 0) {
                    let constDirection = ['top', 'down', 'left', 'right', null];
                    let direction = constDirection[getRandomInt(0, 4)];
                    if (direction === enemy.img.newDirection) direction = null;
                    enemy.img.newDirection = direction;
                }
                if (type === 'attack1') {
                    enemy.img.newDirection = null;
                }
                this.moveCharacter({
                    character:enemy.img,
                    actionType:'normal'
                });
            }
        }
        if (this.enemyMove === 0) {
            this.enemyMove = 5;
        } else {
            this.enemyMove--;
        }

        if (type === 'dig' || type==='attack1') {
            let obj;
            if (type === 'dig') {
                obj = this.player.dig();
            } else {
                obj = this.player.attack();
            }

            let hit = false;
            if (type === 'dig') {
                hit = this.checkHitWall(obj);
            }

            if (!hit) {
                for (let row=0;row<obj.img.length;row++) {
                    for (let col=0;col<obj.img[0].length;col++) {
                        if (type === 'dig') {
                            if (
                                this.checkHitThing(row, col, obj) ||
                                this.checkHitExit(row, col, obj)
                            ) {
                                hit = true;
                                break;
                            }
                        }

                        if (type === 'attack1') {
                            this.hitEnemyKey = this.checkHitEnemies(row, col, obj);
                            if (this.hitEnemyKey !== false) {
                                this.killCount++;
                                this.message = JSON.parse(JSON.stringify(messages.kill_zombie));
                                if (this.killCount % 10 === 0) {
                                    this.message.push(messages.lvup[0]);
                                    this.maxHitPoint += 10;
                                }
                                this.swordHitPoint--;
                                if (this.swordHitPoint === 0) {
                                    this.message.push(messages.broken_sword[0]);
                                    this.player.equipment = this.player.equipment.filter(eq=> eq !== 'sword');
                                }
                                break;
                            }
                        }

                    }
                    if (type === 'dig' && hit) {
                        break;
                    }
                    if (type === 'attack1' && this.hitEnemyKey !== false) {
                        break;
                    }
                }
            }

            if (type === 'dig' && !hit) {
                this.holeList[getRandomInt(0,999)] = obj;
            }
        } else if(type !== 'hit'){
            this.checkHit();
        }
        this.drawMain();
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

    moveCharacter({character, actionType})
    {
        character.prePosX = character.posX;
        character.prePosY = character.posY;

        let moveDistance = 1;
        let direction = character.currentDirection;
        if (null === character.newDirection) {
            moveDistance = 0;
            switch(actionType) {
                case 'attack1':
                    moveDistance = 2;
                    break;
                case 'attack2':
                    moveDistance = -2;
                    break;
                case 'hit':
                    moveDistance = -10;
                    break;
            }
        } else {
            direction = character.newDirection;
            if (character.currentDirection !== character.newDirection) {
                character.currentDirection = character.newDirection;
                character.turn();
            }
        }

        switch (direction) {
            case 'top':
                character.posY -= moveDistance;
                break;
            case 'down':
                character.posY += moveDistance;
                break;
            case 'right':
                character.posX += moveDistance;
                break;
            case 'left':
                character.posX -= moveDistance;
                break;
        }

        if (this.checkHitWall(character)) {
            character.posY = character.prePosY;
            character.posX = character.prePosX;
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

    checkHitEnemies(row, col, object)
    {
        for (const [key, enemy] of Object.entries(this.enemies)) {
            if (enemy === undefined) continue;
            for (let eRow=0;eRow<enemy.img.img .length; eRow++) {
                for (let eCol=0; eCol<enemy.img.img[eRow].length; eCol++) {
                    if (
                        'F' !== object.img[row][col] &&
                        'F' !== enemy.img.img[eRow][eCol] &&
                        object.posY + row === enemy.img.posY + eRow &&
                        object.posX + col === enemy.img.posX + eCol
                    ) {
                        if (object.index === 'player') {
                            object.hit = true;
                            this.hitCount = 2;
                            this.message = JSON.parse(JSON.stringify(messages.zombie_attack));
                            this.hitPoint -= 10;
                            if (this.hitPoint <= 0) {
                                this.gameover = true;
                                this.start();
                            }
                        }
                        return key;
                    }
                }
            }
        }
        return false;
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
                if (false !== this.checkHitEnemies(row, col, this.player)) return true;
                if (this.checkHitThing(row, col, this.player)) return true;
                if (this.checkHitExit(row, col, this.player)) {
                    this.message = JSON.parse(JSON.stringify(messages.up_or_stay));
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
                    if (this.holeList[thing.holeKey]) this.holeList[thing.holeKey].clear = true;
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
            if (enemy.clear === true) {
                this.clearObject(enemy.img.img, enemy.img.posY, enemy.img.posX);
                delete this.enemies[key];
                continue;
            }
            this.drawCharacter(enemy.img);
        }
        this.drawCharacter(this.player);

        for (let [key, hole] of Object.entries(this.holeList)) {
            if (hole === undefined) continue;
            if (hole.put) {
                hole.count--;
                if (hole.count === 0) {
                    this.notFoundCount++;
                    this.message = JSON.parse(JSON.stringify(messages.not_found));
                    hole.clear = true;
                }
                continue;
            }
            this.drawObject(hole.img, hole.posY, hole.posX);

            if (!this.player.equipment.includes("key") && 0 === getRandomInt(0, 10)) {
                this.thingList[getRandomInt(0, 999)] = {
                    count: 30,
                    img: KEY_IMG,
                    holeKey: key,
                    put: false,
                    clear: false,
                    posY: hole.posY,
                    posX: hole.posX,
                    clearFunc: () => {
                        this.message = JSON.parse(JSON.stringify(messages.found_key));
                        this.player.equipment.push("key");
                    }
                };
            } else if (0 === getRandomInt(0, 10)) {
                let enemy = new CharacterWriter('enemy', 'down');
                if (!this.checkHitWall(hole)) {
                    this.putCharacter(enemy, hole.posX, hole.posY);
                    this.enemies[getRandomInt(0, 999)] = {count: 30, img: enemy, holeKey: key};
                }
            } else if (!this.player.equipment.includes("sword") && 0 === getRandomInt(0, 10)) {
                this.thingList[getRandomInt(0, 999)] = {
                    count: 30,
                    img: SWORD_IMG,
                    holeKey: key,
                    put: false,
                    clear: false,
                    posY: hole.posY,
                    posX: hole.posX,
                    clearFunc: () => {
                        if (!this.player.equipment.includes("sword")) {
                            this.player.equipment.push('sword');
                        }
                        this.message = JSON.parse(JSON.stringify(messages.found_sword));
                    }
                };
                this.swordHitPoint = getRandomInt(1, 10);
            } else if (this.hitPoint < this.maxHitPoint && 0 === getRandomInt(0, 10)) {
                this.thingList[getRandomInt(0, 999)] = {
                    count: 30,
                    img: ONIGIRI_IMG,
                    holeKey: key,
                    put: false,
                    clear: false,
                    posY: hole.posY,
                    posX: hole.posX,
                    clearFunc: () => {
                        this.message = JSON.parse(JSON.stringify(messages.found_onigiri));
                        if (this.hitPoint < this.maxHitPoint) this.hitPoint += 10;
                    }
                };
            } else if (1 === getRandomInt(0, 10)) {
                this.thingList[getRandomInt(0, 999)] = {
                    count: 30,
                    img: COIN_IMG,
                    holeKey: key,
                    put: false,
                    clear: false,
                    posY: hole.posY,
                    posX: hole.posX,
                    clearFunc: () => {
                        this.message = JSON.parse(JSON.stringify(messages.found_coin));
                        this.coinCount++;
                    }
                };
            } else if (0 === getRandomInt(0, 100)) {
                this.stop = true;
                this.floor++;
                this.start();
                this.message = JSON.parse(JSON.stringify(messages.fall_down));
                return;
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
            `HP        : ${this.hitPoint}/${this.maxHitPoint}`,
            startPosition+margin*2,
            this.stage.height*PIXEL_SIZE + 20*2 +margin*2,
            this.stage.width*PIXEL_SIZE
        );
        this.mCanvas.fillText(
            `Stage     : ${this.floor}`,
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
            this.message = JSON.parse(JSON.stringify(messages.found_shovel));
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
            case 13:    // Enter
                this.actionEvent('attack');
                break;
            case 32:    // space
                this.actionEvent('dig');
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
        this.setEventListener('normal', this);
        if (this.answer === 'Yes') {
            if (this.player.equipment.includes("key")) {
                this.message = JSON.parse(JSON.stringify(messages.up_stairs));
                this.floor++;
                this.answer = null;
                if (this.floor > 404) {
                    this.gameover = true;
                }
                if (0 === getRandomInt(0, 30)) {
                    this.gameclear = true;
                }
                this.start();
            } else {
                this.stop = false;
                this.player.posY = this.player.prePosY;
                this.player.posX = this.player.prePosX;
                this.player.newDirection = null;
                window.requestAnimationFrame(this.playing.bind(this));
                this.message = JSON.parse(JSON.stringify(messages.not_found_key));
            }
        } else {
            this.stop = false;
            this.player.posY = this.player.prePosY;
            this.player.posX = this.player.prePosX;
            this.player.newDirection = null;
            window.requestAnimationFrame(this.playing.bind(this));
            this.message = JSON.parse(JSON.stringify(messages.stay_floor));
        }
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
                this.attackCount = 2;
                break;
        }
    }

    setEventListener(eventType, user)
    {
        for (const [key, event] of Object.entries(user.eventKeys)) {
            handler.removeListener(event);
            delete user.eventKeys[key];
        }
        if (eventType === 'normal') {
            user.eventKeys.keyup = handler.addListener(window, 'keyup', user.keyUp.bind(user), false);
            user.eventKeys.keydown = handler.addListener(window, 'keydown', user.keyDown.bind(user), false);
        } else if (eventType === 'question') {
            user.eventKeys.keyup = handler.addListener(window, 'keyup', user.keyUpQuestion.bind(user), false);
        } else if (eventType === 'continue') {
            user.eventKeys.keyup = handler.addListener(window, 'keyup', user.newGame.bind(user), false);
        }
    }
}