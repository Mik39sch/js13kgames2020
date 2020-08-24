import StageWriter from './StageWriter.js';
import Game from './Game.js';

// メンバ変数定義
let canvasEl;
let canvas;

const EL_ID = 'canvas2';

window.addEventListener("DOMContentLoaded", function(){
    canvasEl = document.getElementById(EL_ID);
    canvas = canvasEl.getContext("2d");

    let stageWriter = new StageWriter();

    canvasEl.width = stageWriter.stageWidth;
    canvasEl.height = stageWriter.stageHeight;

    let game = new Game(canvas, stageWriter);
    window.requestAnimationFrame(game.playing.bind(game));



    let el = document.getElementById('canvas');
    let c = el.getContext('2d');
    el.w = 30;
    el.h = 30;

    let rectList = [];
    let roomList = [];
    let minimumSize = 5;
    let addRect = function(minX, minY, maxX, maxY) {
        let rect = {minX:minX, minY:minY, maxX:maxX, maxY:maxY, room:null};
        rectList.push(rect);
        return rect;
    };
    let addRoom = function(minX, minY, maxX, maxY)
    {
        let room = {minX:minX, minY:minY, maxX:maxX, maxY:maxY};
        roomList.push(room);
        return room;
    };
    let splitStage = function(parent) {
        if (
            (parent.maxY - parent.minY <= minimumSize*2) ||
            (parent.maxX - parent.minX <= minimumSize*2)
        ) {
            return;
        }
        let child = addRect(parent.minX, parent.minY, parent.maxX, parent.maxY);
        if (0 === getRandomInt(0,2)) {
            let sp = getRandomInt(parent.minY + minimumSize, parent.maxY - minimumSize);
            parent.maxY = sp;
            child.minY = sp;
            splitStage(parent);
        } else {
            let sp = getRandomInt(parent.minX + minimumSize, parent.maxX - minimumSize);
            parent.maxX = sp;
            child.minX = sp;
            splitStage(parent);
        }
    }

    const margin = 2;
    let makeRoom = function()
    {
        for (let rectIdx=0;rectIdx<rectList.length;rectIdx++) {
            const rect = rectList[rectIdx];
            let w = getRandomInt(minimumSize, rect.maxX - rect.minX - (margin * 2) + 1);
            let h = getRandomInt(minimumSize, rect.maxY - rect.minY - (margin * 2) + 1);
            let x = getRandomInt(rect.minX + margin, rect.maxX - margin - w + 1);
            let y = getRandomInt(rect.minY + margin, rect.maxY - margin - h + 1);
            rect.room = addRoom(x, y, x + w, y + h);
        }
    }

    splitStage(addRect(0, 0, el.w, el.h));

    let st = [];
    for (let i=0;i<el.h+1;i++) {
        let tmp = [];
        for(let j=0;j<el.w+1;j++) {
            if (0 === i || 0 === j || i === el.h || j === el.w) {
                tmp.push('#000000');
            } else {
                tmp.push('#FFFFFF');
            }
        }
        st.push(tmp);
    }
    for (let rectIdx=0;rectIdx<rectList.length;rectIdx++) {
        const rect = rectList[rectIdx];
        for (let i=rect.minX, j=rect.minY; i<=rect.maxX; i++) st[i][j] = '#000000';
        for (let i=rect.minX, j=rect.maxY; i<=rect.maxX; i++) st[i][j] = '#000000';
        for (let i=rect.minX, j=rect.minY; j<=rect.maxY; j++) st[i][j] = '#000000';
        for (let i=rect.maxX, j=rect.minY; j<=rect.maxY; j++) st[i][j] = '#000000';
    }

    for (let roomIdx=0;roomIdx<roomList.length;roomIdx++) {
        const room = roomList[roomIdx];
        for (let i=room.minY;i<room.maxY+1;i++) {
            for(let j=room.minX;j<room.maxX;j++) {
                if (0 === i || 0 === j || i === maxY-1 || j === maxX-1) {
                    st[i][j] = '#000000';
                } else {
                    st[i][j] = '#FFFFFF';
                }
            }
        }
    }

    for (let i=0;i<st.length;i++) {
        for(let j=0;j<st[i].length;j++) {
            c.fillStyle = st[i][j];
            c.fillRect(j*PIXEL_SIZE, i*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
    }
});