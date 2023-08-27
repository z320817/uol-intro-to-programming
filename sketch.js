//global for the controls and input 
let inputOutputController = null;
//store visualisations in a container
let visualisationController = null;
//letiable for p5 fast fourier transform
let fourier;

let sound;
let icons = {
	inputOutputController: {
		sound: {
			whiteSound: null,
			blackSound: null,
		}
	}
}

function preload() {
	sound = loadSound('assets/music/stomper_reggae_bit.mp3');
	icons.inputOutputController.sound.whiteSound = loadImage('assets/images/inputOutputController/sound/white-sound.svg');
	icons.inputOutputController.sound.blackSound = loadImage('assets/images/inputOutputController/sound/black-sound.svg');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	visualisationController = new VisualisationController();
	inputOutputController = new InputOutputController(visualisationController, sound.url);

	//instantiate the fft object
	fourier = new p5.FFT();

	//create a new visualisation container and add visualisations

	visualisationController.add(new Spectrum());
	visualisationController.add(new WavePattern());
}

function draw() {
	background(0);
	//draw the selected visualisation
	visualisationController.selectedVisual.draw();
	//draw the controls on top.
	inputOutputController.draw();
}

function mouseClicked() {
	inputOutputController.mousePressed();
}

function keyPressed() {
	inputOutputController.keyPressed(keyCode);
}

//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	if (visualisationController.selectedVisual.onResize) {
		visualisationController.selectedVisual.onResize();
	}
}
