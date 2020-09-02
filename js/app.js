import StageWriter from './StageWriter.js';
import Game from './Game.js';

window.addEventListener("DOMContentLoaded", function(){
    let canvasEl = document.getElementById('character');
    let canvas = canvasEl.getContext("2d");

    let stageEl = document.getElementById('stage');

    let stageWriter = new StageWriter(stageEl);
    stageWriter.draw();

    canvasEl.width = stageWriter.canvasEl.width;
    canvasEl.height = stageWriter.canvasEl.height;

    let wrapperEl = document.getElementById('wrapper');
    wrapperEl.style.height = `${stageWriter.canvasEl.height}px`;

    let game = new Game(canvas, stageWriter);
    window.requestAnimationFrame(game.playing.bind(game));
});