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
                this.mCanvas.fillRect(col*PIXEL_SIZE + posX, row*PIXEL_SIZE + posY, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }
}