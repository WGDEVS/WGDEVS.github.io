var TICK_LENGTH_MS = 1000;

var timer;
var mainCanvas;
var mainCanvasContex;

var csharpPanel = document.getElementById("csharpPanel");

function tickEvent() {
	
	//mainCanvasContex.fillStyle = "#FF0000";
	//mainCanvasContex.fillRect(0,0,10,10);
}

function startTimer(){
	timer = setInterval(function(){tickEvent()}, TICK_LENGTH_MS);
}

function init() {
	//mainCanvas = document.getElementById("mainCanvas");
	//mainCanvasContex = mainCanvas.getContext("2d");
	
	//startTimer();
}

window.onload = function() {
	initTopbar();
}

// Topbar
function initTopbar(){
	
}

// ->Sun
var topSun;
var TOP_SUN_HEIGHT_FACTOR = 0.2;

function initSun(){
	topSun = document.getElementById("topSun");
	topSun.height(20000);
}