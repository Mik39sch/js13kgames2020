export default class StageWriter
{
    constructor()
    {
        this.pathWidth = PIXCEL_SIZE+2;
        this.createMaze(300, 300);

        this.stageHeight = this.mImageData.length * PIXCEL_SIZE;
        this.stageWidth = this.mImageData[0].length * PIXCEL_SIZE;
    }
    
    greateMazeAsTorneko(width, height)
    {}

    createMaze(width, height)
    {
        // 奇数である必要がある
        if (0 !== width % this.pathWidth) width += (this.pathWidth - 1 - width % this.pathWidth);
        if (0 !== height % this.pathWidth) height += (this.pathWidth - 1 - height % this.pathWidth);

        this.mImageData = [];
        // 外壁
        for (let x=0;x<width+2;x++) {
            this.mImageData[x] = [];
            for(let y=0;y<height+2;y++) {
                if (0 === x || 0 === y || x === width+1 || y === height+1) {
                    this.mImageData[x][y] = 'A';
                } else {
                    this.mImageData[x][y] = '0';
                }
            }
        }
        // 棒倒し
        for (let x=this.pathWidth;x<width;x+=this.pathWidth) {
            for(let y=this.pathWidth;y<height;y+=this.pathWidth) {
                this.mImageData[x][y] = 'A';
                while(true) {
                    let direction;
                    let max = 3;
                    if (this.pathWidth === y) {
                        max = 2;
                    }
                    direction = getRandomInt(0, max);

                    let wallX = x;
                    let wallY = y;
                    switch (direction) {
                        case 0:     // 右
                            wallX++;
                            break;
                        case 1:     // 下
                            wallY++;
                            break;
                        case 2:     // 左
                            wallX--;
                            break;
                        case 3:     // 上
                            wallY--;
                            break;
                        default:
                            break;
                    }
                    if (this.mImageData[wallX][wallY] != 'A') {
                        this.mImageData[wallX][wallY] = 'A';
                        for (let i=0;i<this.pathWidth-1;i++) {
                            switch (direction) {
                                case 0:     // 右
                                    wallX++;
                                    break;
                                case 1:     // 下
                                    wallY++;
                                    break;
                                case 2:     // 左
                                    wallX--;
                                    break;
                                case 3:     // 上
                                    wallY--;
                                    break;
                                default:
                                    break;
                            }
                            this.mImageData[wallX][wallY] = 'A';
                        }
                        break;
                    }
                }
            }
        }
    }
}