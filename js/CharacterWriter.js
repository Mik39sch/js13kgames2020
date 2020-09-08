export default class CharacterWriter
{
    constructor(index, direction)
    {
        this.index = index;
        if (!CHARACTER_DATA[index]) {
            this.index = 'player';
        }
        this.img = JSON.parse(JSON.stringify(CHARACTER_DATA[this.index][direction]));

        this.posY = 1;
        this.posX = 1;
        this.prePosY = null;
        this.prePosX = null;
        this.hit = false;
        this.equipment = [];
        this.digAction = false;
        this.attackAction = false;

        this.newDirection = null;
        this.currentDirection = direction;
        this.directionConst = {
            top:   {top:0,right:1,down:2,left:3},
            right: {top:3,right:0,down:1,left:2},
            down:  {top:2,right:3,down:0,left:1},
            left:  {top:1,right:2,down:3,left:0},
        };

        if (direction != 'top') {
            const turnCount = this.directionConst['top'][direction];
            if (turnCount > 0) for (let i=0; i<turnCount;i++) this.turn();
        }
    }

    turn()
    {
        this.img = JSON.parse(JSON.stringify(CHARACTER_DATA[this.index][this.currentDirection]));
    }

    dig()
    {
        let posY, posX;
        switch(this.currentDirection) {
            case 'top':
                posY = this.posY - HOLE_IMG.length;
                posX = this.posX+ 1;
                break;
            case 'right':
                posY = this.posY + 1;
                posX = this.posX + CHARACTER_SIZE;
                break;
            case 'down':
                posY = this.posY + CHARACTER_SIZE;
                posX = this.posX + 1;
                break;
            case 'left':
                posY = this.posY + 1;
                posX = this.posX - HOLE_IMG.length;
                break;
        }

        return {posY: posY, posX:posX, img: HOLE_IMG, put: false, clear: false, thing: null, count: 50};
    }
}