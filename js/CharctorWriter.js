export default class CharctorWriter
{
    constructor(index, direction)
    {
        if (!CHARCTOR_DATAS[index]) {
            index = 'player';
        }
        this.mImageData = CHARCTOR_DATAS[index];

        this.posY = 1;
        this.posX = 1;

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
        let turnImg = JSON.parse(JSON.stringify(this.mImageData));;
        for (let row = 0; row < this.mImageData.length; row++) {
            for (let col = 0; col < this.mImageData[row].length; col++) {
                turnImg[row][col] = this.mImageData[this.mImageData.length-col-1][row];
            }
        }
        this.mImageData = turnImg;
    }
}

const CHARCTOR_DATAS = {
    'player': [
        ['F','F','2','2','2','F','F'],
        ['F','2','1','1','1','2','F'],
        ['2','1','2','1','2','1','2'],
        ['2','1','1','1','1','1','2'],
        ['2','1','1','1','1','1','2'],
        ['F','2','1','1','1','2','F'],
        ['F','F','2','2','2','F','F'],
    ],
    'enemy': [
        ['F','F','2','2','2','F','F'],
        ['F','2','2','2','2','2','F'],
        ['2','2','3','2','3','2','2'],
        ['2','2','2','2','2','2','2'],
        ['2','2','2','2','2','2','2'],
        ['F','2','2','2','2','2','F'],
        ['F','F','2','2','2','F','F'],
    ],
};