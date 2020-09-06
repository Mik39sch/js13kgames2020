export default class StageWriter
{
    constructor(canvasEl)
    {
        this.height = 400;
        this.width = 800;
        if (getRandomInt(1,1) % 2 !== 0) {
            this.createMazeAsTorneko(100, this.height);
        } else {
            this.createMaze(this.width, this.height);
        }

        this.canvasEl = canvasEl;
        this.canvasEl.height = this.height * PIXEL_SIZE + MESSAGE_WINDOW_HEIGHT;
        // this.canvasEl.width = this.width * PIXEL_SIZE;
        this.canvasEl.width = this.width * PIXEL_SIZE;

        this.canvas = this.canvasEl.getContext('2d', {alpha: false});
    }

    draw()
    {
        this.img.forEach((frameRow, row) => {
            frameRow.forEach((color, col) => {
                this.canvas.fillStyle = COLORS[color];
                this.canvas.fillRect(col*PIXEL_SIZE, row*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            });
        });
    }

    setImageData(y, x, val) {
        if (this.img[y] && this.img[y][x]) {
            this.img[y][x] = val;
        }
    }

    addRect(minX, minY, maxX, maxY) {
        let rect = {minX:minX, minY:minY, maxX:maxX, maxY:maxY, room:null};
        this.rectList.push(rect);
        return rect;
    }

    addRoom(minX, minY, maxX, maxY)
    {
        let room = {minX:minX, minY:minY, maxX:maxX, maxY:maxY};
        this.roomList.push(room);
        return room;
    }

    addPath(direction, rect0, rect1)
    {
        let path = { direction: direction, rect0: rect0, rect1: rect1 };
        this.pathList.push(path);
    }

    splitRect(parent)
    {
        let rectMargin = MINIMUM_ROOM_SIZE + (ROOM_MARGIN * 2);
        if (
            (parent.maxY - parent.minY <= rectMargin) ||
            (parent.maxX - parent.minX <= rectMargin) ||
            (parent.minX + rectMargin >= parent.maxX - rectMargin) ||
            (parent.minY + rectMargin >= parent.maxY - rectMargin)
            // (getRandomInt(0,20) === 0)
        ) {
            return;
        }

        let child = this.addRect(parent.minX, parent.minY, parent.maxX, parent.maxY);
        if (0 === getRandomInt(0,2)) {
            let sp = getRandomInt(parent.minX + rectMargin, parent.maxX - rectMargin);
            sp = parent.minX + rectMargin;
            parent.maxX = sp;
            child.minX = sp;
            this.addPath('vertical', parent, child);
        } else {
            let sp = getRandomInt(parent.minY + rectMargin, parent.maxY - rectMargin);
            sp = parent.minY + rectMargin;
            parent.maxY = sp;
            child.minY = sp;
            this.addPath('horizontal', parent, child);
        }
        this.splitRect(parent);
        this.splitRect(child);
    }

    makeRoom()
    {
        this.rectList.map(rect => {
            let w = getRandomInt(MINIMUM_ROOM_SIZE, rect.maxX - rect.minX - (ROOM_MARGIN * 2) + 1);
            let h = getRandomInt(MINIMUM_ROOM_SIZE, rect.maxY - rect.minY - (ROOM_MARGIN * 2) + 1);
            let minX = getRandomInt(rect.minX + ROOM_MARGIN, rect.maxX - ROOM_MARGIN - w + 1);
            let minY = getRandomInt(rect.minY + ROOM_MARGIN, rect.maxY - ROOM_MARGIN - h + 1);
            rect.room = this.addRoom(minX, minY, minX+w, minY+h);
        });
    }

    line(x0, y0, x1, y1, isPuls)
    {
        let min_x = Math.min(x0, x1),
            max_x = Math.max(x0, x1),
            min_y = Math.min(y0, y1),
            max_y = Math.max(y0, y1);

        if (min_x != max_x) {
            for (let i = min_x; i <= max_x; i++) {
                let x, y;
                if ((x0 <= x1) && (y0 >= y1)) {
                    x = i, y = max_y;
                } else if ((x0 > x1) && (y0 > y1)) {
                    x = i, y = min_y;
                } else if ((x0 > x1) && (y0 <= y1)) {
                    x = i, y = min_y;
                } else if ((x0 <= x1) && (y0 < y1)) {
                    x = i, y = max_y;
                }
                for (let j=0;j<CHARACTER_SIZE-1;j++) {
                    if (isPuls) {
                        this.setImageData(y+j, x, '0');
                    } else {
                        this.setImageData(y-j, x, '0');
                    }
                }
                if (DEBUG) {
                    this.setImageData(y, x, '6');
                }
            }
        }

        if (min_y != max_y) {
            for (let i = min_y; i <= max_y; i++) {
                let x, y;
                if ((x0 <= x1) && (y0 >= y1)) {
                    x = max_x, y = i;
                } else if ((x0 > x1) && (y0 > y1)) {
                    x = max_x, y = i;
                } else if ((x0 > x1) && (y0 <= y1)) {
                    x = min_x, y = i;
                } else if ((x0 <= x1) && (y0 < y1)) {
                    x = min_x, y = i;
                }

                for (let j=0;j<CHARACTER_SIZE-1;j++) {
                    if (isPuls) {
                        this.setImageData(y, x+j, '0');
                    } else {
                        this.setImageData(y, x-j, '0');
                    }
                }
                if (DEBUG) {
                    this.setImageData(y, x, '6');
                }
            }
        }
    }

    createMazeAsTorneko(width, height)
    {
        this.rectList = [];
        this.roomList = [];
        this.pathList = [];

        this.splitRect(this.addRect(0, 0, width, height));
        this.makeRoom();

        // 全体の枠組み
        this.img = [];
        for (let i=0;i<height+1;i++) {
            let tmp = [];
            for(let j=0;j<width+1;j++) {
                tmp.push('A');
            }
            this.img.push(tmp);
        }

        if (DEBUG) {
            for (let rectIdx=0;rectIdx<this.rectList.length;rectIdx++) {
                const rect = this.rectList[rectIdx];
                for (let x = rect.minX, y = rect.minY; x <= rect.maxX; x++) this.setImageData(y, x, '9');
                for (let x = rect.minX, y = rect.maxY; x <= rect.maxX; x++) this.setImageData(y, x, '9');
                for (let x = rect.minX, y = rect.minY; y <= rect.maxY; y++) this.setImageData(y, x, '9');
                for (let x = rect.maxX, y = rect.minY; y <= rect.maxY; y++) this.setImageData(y, x, '9');
            }
        }

        // 部屋描画
        for (let roomIdx=0;roomIdx<this.roomList.length;roomIdx++) {
            const room = this.roomList[roomIdx];
            for (let x = room.minX; x <= room.maxX; x++) {
                for (let y = room.minY; y <= room.maxY; y++) {
                    this.setImageData(y, x, '0');
                }
            }
            if (DEBUG) {
                for (let x = room.minX, y = room.minY; x <= room.maxX; x++) this.setImageData(y, x, '3');
                for (let x = room.minX, y = room.maxY; x <= room.maxX; x++) this.setImageData(y, x, '3');
                for (let x = room.minX, y = room.minY; y <= room.maxY; y++) this.setImageData(y, x, '3');
                for (let x = room.maxX, y = room.minY; y <= room.maxY; y++) this.setImageData(y, x, '3');
            }
        }

        // 通路描画
        for (let pathIdx=0;pathIdx<this.pathList.length;pathIdx++) {
            const path = this.pathList[pathIdx];
            let c0x, c0y, c1x, c1y;
            let isPuls = true;
            switch (path.direction) {
                case 'vertical':
                    c0x = path.rect0.maxX,
                    c0y = getRandomInt(path.rect0.room.minY + 1, path.rect0.room.maxY),
                    c1x = path.rect1.minX,
                    c1y = getRandomInt(path.rect1.room.minY + 1, path.rect1.room.maxY);
                    if (c0y > c1y) {
                        isPuls = false;
                    }

                    if (isPuls) {
                        if (c0y > path.rect0.room.maxY - CHARACTER_SIZE) {
                            c0y -= CHARACTER_SIZE;
                        }
                        if (c1y > path.rect1.room.maxY - CHARACTER_SIZE) {
                            c1y -= CHARACTER_SIZE;
                        }
                    } else {
                        if (c0y < path.rect0.room.minY + CHARACTER_SIZE) {
                            c0y += CHARACTER_SIZE;
                        }
                        if (c1y < path.rect1.room.minY + CHARACTER_SIZE) {
                            c1y += CHARACTER_SIZE;
                        }
                    }
                    this.line(c0x, c0y, c1x, c1y, true);
                    this.line(path.rect0.room.maxX, c0y, c0x, c0y, isPuls);
                    this.line(path.rect1.room.minX, c1y, c1x, c1y, isPuls);
                    break;
                case 'horizontal':
                    c0x = getRandomInt(path.rect0.room.minX + 1, path.rect0.room.maxX),
                    c0y = path.rect0.maxY,
                    c1x = getRandomInt(path.rect1.room.minX + 1, path.rect1.room.maxX),
                    c1y = path.rect1.minY;

                    if (c0x > c1x) {
                        isPuls = false;
                    }

                    if (isPuls) {
                        if (c0x > path.rect0.room.maxX - CHARACTER_SIZE) {
                            c0x -= CHARACTER_SIZE;
                        }
                        if (c1x > path.rect1.room.maxX - CHARACTER_SIZE) {
                            c1x -= CHARACTER_SIZE;
                        }
                    } else {
                        if (c0x < path.rect0.room.minX + CHARACTER_SIZE) {
                            c0x += CHARACTER_SIZE;
                        }
                        if (c1x < path.rect1.room.minX + CHARACTER_SIZE) {
                            c1x += CHARACTER_SIZE;
                        }
                    }
                    this.line(c0x, c0y, c1x, c1y, true);
                    this.line(c0x, path.rect0.room.maxY, c0x, c0y, isPuls);
                    this.line(c1x, path.rect1.room.minY, c1x, c1y, isPuls);
                    break;
            }
        }
    }

    // 迷路作成
    createMaze(width, height)
    {
        // 奇数である必要がある
        if (0 !== width % CHARACTER_SIZE) width += (CHARACTER_SIZE - width % CHARACTER_SIZE);
        if (0 !== height % CHARACTER_SIZE) height += (CHARACTER_SIZE - height % CHARACTER_SIZE);

        this.img = [];
        // 外壁
        this.img = [];
        for (let y=0;y<height+1;y++) {
            let tmp = [];
            for(let x=0;x<width+1;x++) {
                if (0 === x || 0 === y || x === width || y === height) {
                    tmp.push('A');
                } else {
                    tmp.push('0');
                }
            }
            this.img.push(tmp);
        }

        // 棒倒し
        for (let x=CHARACTER_SIZE;x<width;x+=CHARACTER_SIZE) {
            for(let y=CHARACTER_SIZE;y<height;y+=CHARACTER_SIZE) {
                this.setImageData(y, x, 'A');
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
                    this.setImageData(wallY, wallX, 'A');
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
                        this.setImageData(wallY, wallX, 'A');
                }
            }
        }
    }
}