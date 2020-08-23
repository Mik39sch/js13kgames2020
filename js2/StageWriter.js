export default class StageWriter
{
    constructor()
    {
        this.createStage(15);

        this.stageHeight = this.mImageData.length * PIXCEL_SIZE;
        this.stageWidth = this.mImageData[0].length * PIXCEL_SIZE;
    }

    createStage(blockCount)
    {
        this.mImageData = [];
        const rowLength = 100;
        const colLength = 100;

        for (let i=0;i<rowLength+2;i++) {
            this.mImageData[i] = [];
            for (let j=0;j<colLength+2;j++) {
                if (0 === i || rowLength+1 === i || 0 === j || colLength+1 === j) {
                    this.mImageData[i][j] = 'A';
                    continue;
                }
                this.mImageData[i][j] = '0';
            }
        }

        // let minX = 10, maxX = (rowLength-10)/2,
        //     minY = 10, maxY = (colLength-10)/2;
        // for (let i=0; i<blockCount; i++) {
        //     if (0 === i % 4) {
        //         minX = 10, maxX = (rowLength-10)/2;
        //         minY = 10, maxY = colLength/2;
        //     } else if (1 === i % 4) {
        //         minX = 10, maxX = (rowLength-10)/2;
        //         minY = (colLength-10)/2, maxY = (colLength-10);
        //     } else if (2 === i % 4) {
        //         minX = (rowLength-10)/2, maxX = (rowLength-10);
        //         minY = 10, maxY = (colLength-10)/2;
        //     } else if (3 === i % 4) {
        //         minX = (rowLength-10)/2, maxX = (rowLength-10);
        //         minY = (colLength-10)/2, maxY = (colLength-10);
        //     }
        //     this.setBlock(...this.getBlockPos(minX, maxX, minY, maxY));
        // }
    }

    getBlockPos(minX, maxX, minY, maxY)
    {
        return [getRandomInt(minX, maxX), getRandomInt(minY, maxY)];
    }

    setBlock(row, col)
    {
        for (let i=0; i<2; i++) {
            if (undefined === this.mImageData[row+i]) {
                continue;
            }
            for (let j=0; j<15; j++) {
                if (undefined === this.mImageData[row+i][col+j]) {
                    continue;
                }
                this.mImageData[row+i][col+j] = 'A';
            }
        }
    }
}