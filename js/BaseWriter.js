export default class BaseWriter
{
    constructor(inCanvas, index)
    {
        this.mCanvas = inCanvas;
        this.mImageData = [0];
    }

    draw(posX, posY)
    {
        for (let row = 0; row < this.mImageData.length; row++) {
            for (let col = 0; col < this.mImageData[row].length; col++) {
                this.mCanvas.fillStyle = COLORS[this.mImageData[row][col]];
                this.mCanvas.fillRect(col*PIXCEL_SIZE + posX, row*PIXCEL_SIZE + posY, PIXCEL_SIZE, PIXCEL_SIZE);
            }
        }
    }
}