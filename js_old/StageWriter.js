export default class StageWriter
{
    constructor()
    {
        this.stageHeight = PIXEL_SIZE * 20 * 3 + PIXEL_SIZE;
        this.stageWidth = PIXEL_SIZE * 15 * 10;
        this.mImageData = this.baseStage();
    }

    baseStage()
    {
        let baseStage = [];
        for (let row=0; row < this.stageHeight/PIXEL_SIZE; row++ ) {
            let tmp = [];
            for (let col=0; col < this.stageWidth/PIXEL_SIZE; col++ ) {
                if (row === (this.stageHeight/PIXEL_SIZE) - 1 ||
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