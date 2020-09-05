import Game from './Game.js';

window.addEventListener("DOMContentLoaded", function(){
    let canvasEl = document.getElementById('canvas');
    let canvas = canvasEl.getContext("2d");
    let game = new Game(canvas, canvasEl);
});