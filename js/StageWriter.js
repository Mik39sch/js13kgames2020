export default class StageWriter
{
    constructor()
    {
        this.pathWidth = CHARACTER_DATA.player.length+1;

        let size = getRandomInt(100, 200);
        if (getRandomInt(0,100) % 2 === 0) {
            this.createMazeAsTorneko(size, size);
        } else {
            this.createMaze(size, size);
        }


        this.stageHeight = this.mImageData.length * PIXEL_SIZE;
        this.stageWidth = this.mImageData[0].length * PIXEL_SIZE;
    }

    addRect(minX, minY, maxX, maxY) {
        if (!this.rectList) this.rectList = [];
        let rect = {minX:minX, minY:minY, maxX:maxX, maxY:maxY, room:null};
        this.rectList.push(rect);
        return rect;
    }

    addRoom(minX, minY, maxX, maxY)
    {
        if (!this.roomList) this.roomList = [];
        let room = {minX:minX, minY:minY, maxX:maxX, maxY:maxY};
        this.roomList.push(room);
        return room;
    }

    addPath(direction, rect0, rect1)
    {
        if (!this.pathList) this.pathList = [];
        let path = { direction: direction, rect0: rect0, rect1: rect1 };
        this.pathList.push(path);
    }

    splitRect(parent)
    {
        if (
            (parent.maxY - parent.minY <= MINIMUM_ROOM_SIZE*2) ||
            (parent.maxX - parent.minX <= MINIMUM_ROOM_SIZE*2)
        ) return;

        let child = this.addRect(parent.minX, parent.minY, parent.maxX, parent.maxY);
        if (!parent.doneY) {
            let sp = getRandomInt(parent.minY + MINIMUM_ROOM_SIZE, parent.maxY - MINIMUM_ROOM_SIZE);
            parent.maxY = sp;
            child.minY = sp;
            this.addPath("h", parent, child);
        } else if (!parent.doneX) {
            let sp = getRandomInt(parent.minX + MINIMUM_ROOM_SIZE, parent.maxX - MINIMUM_ROOM_SIZE);
            parent.maxX = sp;
            child.minX = sp;
            this.addPath("w", parent, child);
        }
        this.splitRect(parent);
        this.splitRect(child);
    }

    makeRoom()
    {
        for (let rectIdx=0;rectIdx<this.rectList.length;rectIdx++) {
            const rect = this.rectList[rectIdx];
            let w = getRandomInt(MINIMUM_ROOM_SIZE, rect.maxX - rect.minX - (ROOM_MARGIN * 2) + 1);
            let h = getRandomInt(MINIMUM_ROOM_SIZE, rect.maxY - rect.minY - (ROOM_MARGIN * 2) + 1);
            let x = getRandomInt(rect.minX + ROOM_MARGIN, rect.maxX - ROOM_MARGIN - w + 1);
            let y = getRandomInt(rect.minY + ROOM_MARGIN, rect.maxY - ROOM_MARGIN - h + 1);
            rect.room = this.addRoom(x, y, x + w, y + h);
        }
    }

    line(x0, y0, x1, y1)
    {
        let min_x = Math.min(x0, x1),
            max_x = Math.max(x0, x1),
            min_y = Math.min(y0, y1),
            max_y = Math.max(y0, y1);
        // g_assert((min_x >= 0) && (max_x < width) && (min_y >= 0) && (max_y < height));

        for (let i = min_x; i <= max_x; i++) {
            let index0, index1;
            if ((x0 <= x1) && (y0 >= y1)) {
                index0 = i, index1 = max_y;
            } else if ((x0 > x1) && (y0 > y1)) {
                index0 = i, index1 = min_y;
            } else if ((x0 > x1) && (y0 <= y1)) {
                index0 = i, index1 = min_y;
            } else if ((x0 <= x1) && (y0 < y1)) {
                index0 = i, index1 = max_y;
            }
            this.mImageData[index0][index1] = '0';
            this.mImageData[index0][index1+1] = '0';
            this.mImageData[index0][index1+2] = '0';
            this.mImageData[index0][index1+3] = '0';
            this.mImageData[index0][index1-1] = '0';
            this.mImageData[index0][index1-2] = '0';
            this.mImageData[index0][index1-3] = '0';
        }

        for (let j = min_y; j <= max_y; j++) {
            let index0, index1;
            if ((x0 <= x1) && (y0 >= y1)) {
                index0 = max_x, index1 = j;
            } else if ((x0 > x1) && (y0 > y1)) {
                index0 = max_x, index1 = j;
            } else if ((x0 > x1) && (y0 <= y1)) {
                index0 = min_x, index1 = j;
            } else if ((x0 <= x1) && (y0 < y1)) {
                index0 = min_x, index1 = j;
            }
            this.mImageData[index0][index1] = '0';
            this.mImageData[index0+1][index1] = '0';
            this.mImageData[index0+2][index1] = '0';
            this.mImageData[index0+3][index1] = '0';
            this.mImageData[index0-1][index1] = '0';
            this.mImageData[index0-2][index1] = '0';
            this.mImageData[index0-3][index1] = '0';
        }
    }

    createMazeAsTorneko(width, height)
    {
        this.splitRect(this.addRect(0, 0, width, height));
        this.makeRoom();

        // 全体の枠組み
        this.mImageData = [];
        for (let i=0;i<height+1;i++) {
            let tmp = [];
            for(let j=0;j<width+1;j++) {
                tmp.push('A');
            }
            this.mImageData.push(tmp);
        }
        // 部屋描画
        for (let roomIdx=0;roomIdx<this.roomList.length;roomIdx++) {
            const room = this.roomList[roomIdx];
            for (let i = room.minX; i <= room.maxX; i++) {
                for (let j = room.minY; j <= room.maxY; j++) {
                    this.mImageData[i][j] = '0';
                }
            }
            for (let i = room.minX, j = room.minY; i <= room.maxX; i++) this.mImageData[i][j] = 'A';
            for (let i = room.minX, j = room.maxY; i <= room.maxX; i++) this.mImageData[i][j] = 'A';
            for (let i = room.minX, j = room.minY; j <= room.maxY; j++) this.mImageData[i][j] = 'A';
            for (let i = room.maxX, j = room.minY; j <= room.maxY; j++) this.mImageData[i][j] = 'A';
        }

        // 通路描画
        for (let pathIdx=0;pathIdx<this.pathList.length;pathIdx++) {
            const path = this.pathList[pathIdx];
            let c0x, c0y, c1x, c1y;
            switch (path.direction) {
                case 'w':
                    // g_assert(path.rect0.maxX == path.rect1.minX);
                    c0x = path.rect0.maxX,
                    c0y = getRandomInt(path.rect0.room.minY + 1, path.rect0.room.maxY),
                    c1x = path.rect1.minX,
                    c1y = getRandomInt(path.rect1.room.minY + 1, path.rect1.room.maxY);
                    this.line(c0x, c0y, c1x, c1y);
                    this.line(path.rect0.room.maxX, c0y, c0x, c0y);
                    this.line(path.rect1.room.minX, c1y, c1x, c1y);
                    break;
                case 'h':
                    // g_assert(path.rect0.maxY == path.rect1.minY);
                    c0x = getRandomInt(path.rect0.room.minX + 1, path.rect0.room.maxX),
                    c0y = path.rect0.maxY,
                    c1x = getRandomInt(path.rect1.room.minX + 1, path.rect1.room.maxX),
                    c1y = path.rect1.minY;
                    this.line(c0x, c0y, c1x, c1y);
                    this.line(c0x, path.rect0.room.maxY, c0x, c0y);
                    this.line(c1x, path.rect1.room.minY, c1x, c1y);
                    break;
            }
        }
    }

    // 迷路作成
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