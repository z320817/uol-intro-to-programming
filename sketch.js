//global for the controls and input 
var inputOutputController = null;
//store visualisations in a container
var visualisationController = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;

function preload() {
	sound = loadSound('assets/music/stomper_reggae_bit.mp3');
	let audioElement = createAudio(sound.url);
	audioElement.position(20, 50);
	audioElement.size(300);

	// Show the audio controls
	audioElement.showControls();
	audioElement.connect()
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);

	visualisationController = new VisualisationController();
	inputOutputController = new InputOutputController(visualisationController);

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
