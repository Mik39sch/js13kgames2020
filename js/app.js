import StageWriter from './StageWriter.js';
import Game from './Game.js';

// メンバ変数定義
let canvasEl;
let canvas;

const EL_ID = 'canvas';

window.addEventListener("DOMContentLoaded", function(){
    canvasEl = document.getElementById(EL_ID);
    canvas = canvasEl.getContext("2d");

    let stageWriter = new StageWriter();

    canvasEl.width = stageWriter.stageWidth;
    canvasEl.height = stageWriter.stageHeight;

    let game = new Game(canvas, stageWriter);
    window.requestAnimationFrame(game.playing.bind(game));
});