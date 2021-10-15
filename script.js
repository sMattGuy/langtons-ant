//canvas setup
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
//ant
class Ant{
	xPos = 0;
	yPos = 0;
	facing = 0;
	//0 N, 1 E, 2 S, 3 W
	constructor(xPos,yPos){
		this.xPos = xPos;
		this.yPos = yPos;
	}
}
let ant = new Ant(25,25);
//sliders
//boid modifiers
let speedSlider = document.getElementById("maxSpeed");
let speedInfo = document.getElementById("speedDisplay");
speedInfo.innerHTML = speedSlider.value;

//canvas settings
let widthSlider = document.getElementById("maxWidth");
let widthInfo = document.getElementById("widthDisplay");
widthInfo.innerHTML = widthSlider.value;
let heightSlider = document.getElementById("maxHeight");
let heightInfo = document.getElementById("heightDisplay");
heightInfo.innerHTML = heightSlider.value;

//buttons
let startButton = document.getElementById("startGame");
let clearButton = document.getElementById("drawClear");

let iteration = 0;
//constants
let START = false;
let SPEED = speedSlider.value;
//canvas constants
let FIELDX = canvas.width;
let FIELDY = canvas.height;
//tile size
let TILESIZE = 10;
//canvas listen to get X and Y of mouse click to place flag

let drawArray = new Array(Math.floor(FIELDX/TILESIZE));

//canvas listen to get X and Y of mouse click to place flag
canvas.addEventListener('mousedown', e => {
		drawArray[ant.xPos][ant.yPos].ant = 0;
		ant.xPos = Math.floor(e.offsetX/TILESIZE);
		ant.yPos = Math.floor(e.offsetY/TILESIZE);
		drawArray[ant.xPos][ant.yPos].ant = 1;
});
speedSlider.oninput = function(){
	SPEED = parseInt(this.value);
	speedInfo.innerHTML = this.value;
}

//canvas sliders
widthSlider.oninput = function(){
	FIELDX = parseInt(this.value);
	canvas.width = this.value;
	widthInfo.innerHTML = this.value;
	createArray();
}
heightSlider.oninput = function(){
	FIELDY = parseInt(this.value);
	canvas.height = this.value;
	heightInfo.innerHTML = this.value;
	createArray();
}
startButton.oninput = function(){
	START = !START;
}
clearButton.onclick = function(){
	createArray();
};
function createArray(){
	drawArray = new Array(Math.floor(FIELDX/TILESIZE));
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		drawArray[i] = new Array(FIELDY/TILESIZE);
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			drawArray[i][j] = {'ant':0,'color':0};
		}
	}
	iteration = 0;
}

//frames
var frames = {
	speed: 17,
	max: -1,
	timer: '',
	run: function (func) {
		this.timer = setInterval(func, this.speed);
	},
	start: function (func, speed = 17) {
		this.speed = speed;
		this.run(func);
	}
}
//this is what loops the frames indefinietly
async function doFrames() {
	let speedCount = 0;
	frames.start(() => {
		draw();
		if(START && speedCount >= SPEED){
			updateGrid();
			iteration++;
			speedCount = 0;
		}
		speedCount++;
	}, frames.speed);
}

/*
	this is whats called on page load to kick start everything
	it creates the initial units and triggers the frames
*/
function init(){
	createArray();
	doFrames();
}

/*
	the canvas draw function, each section is divided up
	the for loop is what draws the actual units
*/
function draw(){
	ctx.fillStyle = '#eee';
	ctx.fillRect(0,0,FIELDX,FIELDY);
	//draw gridlines
	ctx.strokeStyle = 'rgba(25,25,25,0.03)';
	ctx.beginPath();
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			ctx.rect(i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
		}
	}
	ctx.stroke();
	//draw array
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			if(drawArray[i][j].color == 1){
				ctx.fillStyle = "black";
				ctx.fillRect(i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
			}
			if(drawArray[i][j].ant == 1){
				ctx.fillStyle = "red";
				ctx.fillRect(i*TILESIZE+3,j*TILESIZE+3,TILESIZE/2,TILESIZE/2);
			}
		}
	}
	ctx.fillStyle = "black";
	ctx.font = `12px Tahoma`;
	ctx.fillText(`Step:${iteration}`,0,10);
}
function updateGrid(){
	if(drawArray[ant.xPos][ant.yPos].color == 0){
		//white square
		//turn 90d clock wise flip color, move forward
		//set current tile to antless
		drawArray[ant.xPos][ant.yPos].ant = 0;
		drawArray[ant.xPos][ant.yPos].color = (drawArray[ant.xPos][ant.yPos].color + 1)%2;
		//turn ant
		ant.facing = (ant.facing + 1)%4;
		//move forward
		moveAnt();
		//set new ant tile
		drawArray[ant.xPos][ant.yPos].ant = 1;
	}
	else{
		//black square
		//turn 90d CC flip and move
		//set current tile to antless
		drawArray[ant.xPos][ant.yPos].ant = 0;
		drawArray[ant.xPos][ant.yPos].color = (drawArray[ant.xPos][ant.yPos].color + 1)%2;
		//turn ant
		ant.facing = ant.facing - 1;
		if(ant.facing < 0)
			ant.facing = 3;
		//move forward
		moveAnt();
		//set new ant tile
		drawArray[ant.xPos][ant.yPos].ant = 1;
	}
}
function moveAnt(){
	if(ant.facing == 0){
		//north
		ant.yPos--;
		if(ant.yPos < 0){
			ant.yPos = Math.floor(FIELDY/TILESIZE) - 1;
		}
	}
	else if(ant.facing == 1){
		//east
		ant.xPos++;
		if(ant.xPos >= Math.floor(FIELDX/TILESIZE)){
			ant.xPos = 0;
		}
	}
	else if(ant.facing == 2){
		//south
		ant.yPos++;
		if(ant.yPos >= Math.floor(FIELDY/TILESIZE)){
			ant.yPos = 0;
		}
	}
	else if(ant.facing == 3){
		//west
		ant.xPos--;
		if(ant.xPos < 0){
			ant.xPos = Math.floor(FIELDX/TILESIZE) - 1;
		}
	}
}