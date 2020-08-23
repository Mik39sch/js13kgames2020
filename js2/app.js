import StageWriter from './StageWriter.js';
import CharctorWriter from './CharctorWriter.js';
import Game from './Game.js';

// メンバ変数定義
let canvasEl;
let canvas;

const EL_ID = 'canvas2';

window.addEventListener("DOMContentLoaded", function(){
    canvasEl = document.getElementById(EL_ID);
    canvas = canvasEl.getContext("2d");

    let stageWriter = new StageWriter();
    let player = new CharctorWriter('player', 'top');

    let enemies = {};
    let minX = 1, maxX = 100/2,
        minY = 1, maxY = 50/2;
    for (let i=0;i<1;i++) {
        if (0 === i % 4) {
            minX = 1, maxX = 100/2;
            minY = 1, maxY = 50/2;
        } else if (1 === i % 4) {
            minX = 1, maxX = 100/2;
            minY = 50/2, maxY = 50;
        } else if (2 === i % 4) {
            minX = 100/2, maxX = 100;
            minY = 1, maxY = 50/2;
        } else if (3 === i % 4) {
            minX = 100/2, maxX = 100;
            minY = 50/2, maxY = 50;
        }
        enemies[i] = new CharctorWriter('enemy', 'down');
        enemies[i].posY = getRandomInt(minY, maxY);
        enemies[i].posX = getRandomInt(minX, maxX);
    }

    canvasEl.width = stageWriter.stageWidth;
    canvasEl.height = stageWriter.stageHeight;

    let game = new Game(canvas, stageWriter, player, enemies);
    window.requestAnimationFrame(game.playing.bind(game));
});