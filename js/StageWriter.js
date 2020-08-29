export default class StageWriter
{
    constructor()
    {
        let size = getRandomInt(300, 300);
        if (getRandomInt(0,0) % 2 === 0) {
            this.createMazeAsTorneko(size, size);
        } else {
            this.createMaze(size, size);
        }
        this.stageHeight = this.mImageData.length * PIXEL_SIZE;
        this.stageWidth = this.mImageData[0].length * PIXEL_SIZE;
    }

    setImageData(y, x, val) {
        if (this.mImageData[y] && this.mImageData[y][x]) {
            this.mImageData[y][x] = val;
        }
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
        if (0 === getRandomInt(0,2)) {
            let sp = getRandomInt(parent.minY + MINIMUM_ROOM_SIZE, parent.maxY - MINIMUM_ROOM_SIZE);
            parent.maxY = sp;
            child.minY = sp;
            this.addPath("h", parent, child);
        } else {
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
        this.rectList.map(rect => {
            let w = getRandomInt(MINIMUM_ROOM_SIZE, rect.maxX - rect.minX - (ROOM_MARGIN * 2) + 1);
            let h = getRandomInt(MINIMUM_ROOM_SIZE, rect.maxY - rect.minY - (ROOM_MARGIN * 2) + 1);
            let x = getRandomInt(rect.minX + ROOM_MARGIN, rect.maxX - ROOM_MARGIN - w + 1);
            let y = getRandomInt(rect.minY + ROOM_MARGIN, rect.maxY - ROOM_MARGIN - h + 1);
            rect.room = this.addRoom(x, y, x + w, y + h);
        });
    }

    line(x0, y0, x1, y1)
    {
        let min_x = Math.min(x0, x1),
            max_x = Math.max(x0, x1),
            min_y = Math.min(y0, y1),
            max_y = Math.max(y0, y1);
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
            for (let j=0;j<CHARACTER_SIZE-1;j++) {
                this.setImageData(index0, index1+j, '0');
            }
        }

        for (let i = min_y; i <= max_y; i++) {
            let index0, index1;
            if ((x0 <= x1) && (y0 >= y1)) {
                index0 = max_x, index1 = i;
            } else if ((x0 > x1) && (y0 > y1)) {
                index0 = max_x, index1 = i;
            } else if ((x0 > x1) && (y0 <= y1)) {
                index0 = min_x, index1 = i;
            } else if ((x0 <= x1) && (y0 < y1)) {
                index0 = min_x, index1 = i;
            }
            for (let j=0;j<CHARACTER_SIZE-1;j++) {
                this.setImageData(index0+j, index1, '0');
            }
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
                    this.setImageData(i, j, '0');
                }
            }
            for (let i = room.minX, j = room.minY; i <= room.maxX; i++) this.setImageData(i, j, 'A');;
            for (let i = room.minX, j = room.maxY; i <= room.maxX; i++) this.setImageData(i, j, 'A');;
            for (let i = room.minX, j = room.minY; j <= room.maxY; j++) this.setImageData(i, j, 'A');;
            for (let i = room.maxX, j = room.minY; j <= room.maxY; j++) this.setImageData(i, j, 'A');;
        }

        // 通路描画
        for (let pathIdx=0;pathIdx<this.pathList.length;pathIdx++) {
            const path = this.pathList[pathIdx];
            let c0x, c0y, c1x, c1y;
            switch (path.direction) {
                case 'w':
                    c0x = path.rect0.maxX,
                    c0y = getRandomInt(path.rect0.room.minY + 1, path.rect0.room.maxY-CHARACTER_SIZE),
                    c1x = path.rect1.minX,
                    c1y = getRandomInt(path.rect1.room.minY + 1, path.rect1.room.maxY-CHARACTER_SIZE);
                    // c0y = path.rect0.room.maxY-CHARACTER_SIZE+1;
                    // c1y = path.rect0.room.maxY-CHARACTER_SIZE+1;
                    this.line(c0x, c0y, c1x, c1y);
                    this.line(path.rect0.room.maxX, c0y, c0x, c0y);
                    this.line(path.rect1.room.minX, c1y, c1x, c1y);
                    break;
                case 'h':
                    c0x = getRandomInt(path.rect0.room.minX + 1, path.rect0.room.maxX-CHARACTER_SIZE),
                    c0y = path.rect0.maxY,
                    c1x = getRandomInt(path.rect1.room.minX + 1, path.rect1.room.maxX-CHARACTER_SIZE),
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
        if (0 !== width % CHARACTER_SIZE) width += (CHARACTER_SIZE - 1 - width % CHARACTER_SIZE);
        if (0 !== height % CHARACTER_SIZE) height += (CHARACTER_SIZE - 1 - height % CHARACTER_SIZE);

        this.mImageData = [];
        // 外壁
        for (let x=0;x<width+2;x++) {
            this.mImageData[x] = [];
            for(let y=0;y<height+2;y++) {
                if (0 === x || 0 === y || x === width+1 || y === height+1) {
                    this.setImageData(x, y, 'A');
                } else {
                    this.setImageData(x, y, '0');
                }
            }
        }
        // 棒倒し
        for (let x=CHARACTER_SIZE;x<width;x+=CHARACTER_SIZE) {
            for(let y=CHARACTER_SIZE;y<height;y+=CHARACTER_SIZE) {
                this.setImageData(x, y, 'A');
                while(true) {
                    let direction;
                    let max = 3;
                    if (CHARACTER_SIZE === y) {
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
                        this.setImageData(wallX, wallY, 'A');
                        for (let i=0;i<CHARACTER_SIZE-1;i++) {
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
                            this.setImageData(wallX, wallY, 'A');
                        }
                        break;
                    }
                }
            }
        }
    }
}