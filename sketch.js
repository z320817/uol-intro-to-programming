//global for the controls and input 
let inputOutputController = null;

//store visualisations in a container
let visualisationController = null;

//letiable for p5 fast fourier transform
let fourier;

let sound;

const position = {
	left: "left",
	right: "right"
}
const icons = {
	inputOutputController: {
		sound: {
			whiteSound: null,
			blackSound: null,
		},
		visual: {
			whiteVisual: null,
			blackVisual: null,
		},
	},
	audioElement: {
		playBtn: {
			pressedBtn: null,
			releasedBtn: null,
		},
		timer: null,
		currentTime: null,
		adder: null,
		volume: {
			volumeOff: null,
			volumeOn: null,
		},
		frequencyChanger: {
			frequencyChanger: null,
			frequencyChangerUp: null,
			frequencyChangerDown: null,
		},
		mic: {
			micOff: null,
			micOn: null,
		},
		loop:
		{
			loop: null,
			noLoop: null
		}
	}
}

function preload() {
	soundFormats('mp3', 'ogg', 'wav');
	sound = loadSound('assets/music/stomper_reggae_bit.mp3');
	icons.inputOutputController.sound.whiteSound = loadImage('assets/images/inputOutputController/sound/white-sound.svg');
	icons.inputOutputController.sound.blackSound = loadImage('assets/images/inputOutputController/sound/black-sound.svg');
	icons.inputOutputController.visual.whiteVisual = loadImage('assets/images/inputOutputController/visual/white-visual.svg');
	icons.inputOutputController.visual.blackVisual = loadImage('assets/images/inputOutputController/visual/black-visual.svg');
	icons.audioElement.playBtn.pressedBtn = loadImage('assets/images/audioElement/playBtn/pressedBtn.svg');
	icons.audioElement.playBtn.releasedBtn = loadImage('assets/images/audioElement/playBtn/releasedBtn.svg');
	icons.audioElement.timer = loadImage('assets/images/audioElement/timer/timer.svg');
	icons.audioElement.currentTime = loadImage('assets/images/audioElement/timer/current.svg');
	icons.audioElement.volume.volumeOn = loadImage('assets/images/audioElement/volume/volumeOn.svg');
	icons.audioElement.volume.volumeOff = loadImage('assets/images/audioElement/volume/volumeOff.svg');
	icons.audioElement.adder = loadImage('assets/images/audioElement/adder/add.svg');
	icons.audioElement.frequencyChanger.frequencyChanger = loadImage('assets/images/audioElement/frequencyChanger/frequencyChanger.svg');
	icons.audioElement.frequencyChanger.frequencyChangerUp = loadImage('assets/images/audioElement/frequencyChanger/frequencyChangerUp.svg');
	icons.audioElement.frequencyChanger.frequencyChangerDown = loadImage('assets/images/audioElement/frequencyChanger/frequencyChangerDown.svg');
	icons.audioElement.mic.micOn = loadImage('assets/images/audioElement/mic/micOn.svg');
	icons.audioElement.mic.micOff = loadImage('assets/images/audioElement/mic/micOff.svg');
	icons.audioElement.loop.loop = loadImage('assets/images/audioElement/loop/loop.svg');
	icons.audioElement.loop.noLoop = loadImage('assets/images/audioElement/loop/noLoop.svg');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	// initialize audio decks
	inputOutputController = new InputOutputController(sound, icons, position);
}

function draw() {
	background(0);

	//draw the controls on top.
	inputOutputController.draw();
}

function mousePressed() {
	inputOutputController.mousePressed();
}

function mouseReleased() {
	inputOutputController.mouseReleased();
}

function keyPressed() {
	inputOutputController.keyPressed(keyCode);
}

//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
