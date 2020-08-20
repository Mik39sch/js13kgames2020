export default class StageWriter
{
    constructor()
    {
        this.stageHeight = PIXCEL_SIZE * 20 * 3 + PIXCEL_SIZE;
        this.stageWidth = PIXCEL_SIZE * 15 * 10;
        this.mImageData = this.baseStage();
    }

    baseStage()
    {
        let baseStage = [];
        for (let row=0; row < this.stageHeight/PIXCEL_SIZE; row++ ) {
            let tmp = [];
            for (let col=0; col < this.stageWidth/PIXCEL_SIZE; col++ ) {
                if (row === (this.stageHeight/PIXCEL_SIZE) - 1 ||
                    row === 40 && col > 50) {
                    tmp.push('A');
                } else {
                    tmp.push('0');
                }
            }
            baseStage.push(tmp);
        }
        return baseStage;
    }
}