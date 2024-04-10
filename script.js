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
const ant_array = new Array();
let ANT_COUNT = 1;
//sliders
//ant modifiers
let speedSlider = document.getElementById("maxSpeed");
let speedInfo = document.getElementById("speedDisplay");
speedInfo.innerHTML = speedSlider.value;

let antSlider = document.getElementById("maxAnts");
let antInfo = document.getElementById("antDisplay");
antInfo.innerHTML = antSlider.value;
//canvas settings
let widthSlider = document.getElementById("maxWidth");
let widthInfo = document.getElementById("widthDisplay");
widthInfo.innerHTML = widthSlider.value;
let heightSlider = document.getElementById("maxHeight");
let heightInfo = document.getElementById("heightDisplay");
heightInfo.innerHTML = heightSlider.value;
let tileSlider = document.getElementById("maxTile");
let tileInfo = document.getElementById("tileDisplay");
tileInfo.innerHTML = tileSlider.value;

//buttons
let startButton = document.getElementById("startGame");
let clearButton = document.getElementById("drawClear");
let gridButton = document.getElementById("showGrid");

let iteration = 0;
//constants
let draw_grid = true;
let START = false;
let SPEED = speedSlider.value;
//canvas constants
let FIELDX = canvas.width;
let FIELDY = canvas.height;
//tile size
let TILESIZE = 10;
//canvas listen to get X and Y of mouse click to place flag

let drawArray = new Array(Math.floor(FIELDX/TILESIZE));

speedSlider.oninput = function(){
	SPEED = parseInt(this.value);
	speedInfo.innerHTML = this.value;
}
antSlider.oninput = function(){
	ANT_COUNT = parseInt(this.value);
	antInfo.innerHTML = this.value;
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
tileSlider.oninput = function(){
	TILESIZE = parseInt(this.value);
	tileInfo.innerHTML = this.value;
	createArray();
}
startButton.oninput = function(){
	START = !START;
}
gridButton.oninput = function(){
	draw_grid = !draw_grid;
}
clearButton.onclick = function(){
	createArray();
};
function createArray(){
	drawArray = new Array(Math.floor(FIELDX/TILESIZE));
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		drawArray[i] = new Array(Math.floor(FIELDY/TILESIZE));
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			drawArray[i][j] = {'ant':0,'color':0};
		}
	}
	iteration = 0;
	for(let i=0;i<ant_array.length;i++){
		ant_array[i].xPos = Math.floor(Math.floor(FIELDX/TILESIZE)/2);
		ant_array[i].yPos = Math.floor(Math.floor(FIELDY/TILESIZE)/2);
		drawArray[ant_array[i].xPos][ant_array[i].yPos] = {'ant':1,'color':0};
	}
}

//frames
let speedCount = 0;
function doFrames() {
	draw();
	let current_ants = ANT_COUNT;
	if(current_ants != ant_array.length){
		let ant_diff = current_ants - ant_array.length;
		if(ant_diff > 0){
			// add ants
			while(ant_diff != 0){
				let new_x = Math.floor(Math.random()*(FIELDX/TILESIZE));
				let new_y = Math.floor(Math.random()*(FIELDY/TILESIZE));
				ant_array.push(new Ant(new_x, new_y));
				drawArray[new_x][new_y].ant = 1;
				ant_diff--;
			}
		}
		else{
			// remove ants
			while(ant_diff != 0){
				let dead_ant = ant_array.pop();
				drawArray[dead_ant.xPos][dead_ant.yPos].ant = 0;
				ant_diff++;
			}
		}
	}
	if(START && speedCount >= SPEED){
		updateGrid();
		iteration++;
		speedCount = 0;
	}
	speedCount++;
	window.requestAnimationFrame(doFrames);
}

/*
	this is whats called on page load to kick start everything
	it creates the initial units and triggers the frames
*/
function init(){
	ant_array.push(new Ant(25,25));
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
	if(draw_grid && TILESIZE >=5){
		ctx.strokeStyle = 'rgba(25,25,25,0.1)';
		for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
			for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
				ctx.strokeRect(i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
			}
		}
	}
	//draw array
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			if(drawArray[i][j].color == 1){
				ctx.fillStyle = "black";
				ctx.fillRect(i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
			}
			if(drawArray[i][j].ant == 1){
				ctx.fillStyle = "rgba(255,0,0,.5)";
				ctx.fillRect(i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
			}
		}
	}
	ctx.fillStyle = "red";
	ctx.font = `12px Tahoma`;
	ctx.fillText(`Step:${iteration}`,0,10);
}
function updateGrid(){
	for(let i=0;i<ant_array.length;i++){
		if(drawArray[ant_array[i].xPos][ant_array[i].yPos].color == 0){
			//white square
			//turn 90d clock wise flip color, move forward
			//set current tile to antless
			drawArray[ant_array[i].xPos][ant_array[i].yPos].ant = 0;
			drawArray[ant_array[i].xPos][ant_array[i].yPos].color = (drawArray[ant_array[i].xPos][ant_array[i].yPos].color + 1)%2;
			//turn ant
			ant_array[i].facing = (ant_array[i].facing + 1)%4;
			//move forward
			moveAnt(ant_array[i]);
			//set new ant tile
			drawArray[ant_array[i].xPos][ant_array[i].yPos].ant = 1;
		}
		else{
			//black square
			//turn 90d CC flip and move
			//set current tile to antless
			drawArray[ant_array[i].xPos][ant_array[i].yPos].ant = 0;
			drawArray[ant_array[i].xPos][ant_array[i].yPos].color = (drawArray[ant_array[i].xPos][ant_array[i].yPos].color + 1)%2;
			//turn ant
			ant_array[i].facing = ant_array[i].facing - 1;
			if(ant_array[i].facing < 0)
				ant_array[i].facing = 3;
			//move forward
			moveAnt(ant_array[i]);
			//set new ant tile
			drawArray[ant_array[i].xPos][ant_array[i].yPos].ant = 1;
		}
	}
}
function moveAnt(ant){
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
