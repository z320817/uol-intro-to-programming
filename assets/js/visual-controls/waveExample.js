class WaveExample extends P5 {

	#icons;
	#waveCanvas;
	#audioElement;
	#renderingProcessor;
	#wave;

	static #configuration = {
		name: "waveexample",
		heightOffset: 0
	}

	get configuration() {
		return WaveExample.#configuration;
	}

	get name() {
		return WaveExample.#configuration.name;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get onResize() {
		return WaveExample.onResize;
	}

	/**
	 * @param { canvas } canvas, 
	 */
	/**
	 * @param { icons } icons, 
	 */
	/**
	 * @param { AudioElement } currentAudioElement, 
	 */
	constructor(currentAudioElement, icons) {
		super();

		this.#icons = icons;
		this.#audioElement = currentAudioElement.waveAudioElement;

		//set initial position of elements
		this.onResize();

		// Create canvas to draw wave animations
		this.#createWaveCanvas();

		// Get audio reference for Wave
		// this.#getWaveAudioElement();

		// Configure initial wave settings
		this.#configureWaveSettings(this.#audioElement, this.#waveCanvas)

		// Run rendering process to syncronize wave and p5 canvases
		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = height / 2.5;
	};

	// #getWaveAudioElement() {
	// 	// Create an audio element
	// 	this.#sound = document.createElement('audio');

	// 	// Set the source of the audio
	// 	this.#sound.src = 'assets/music/stomper_reggae_bit.mp3'; // Replace with the actual path to your audio file

	// 	// Add controls for playback
	// 	this.#sound.controls = true;

	// 	// Append the audio element to the document body or another element
	// 	document.body.appendChild(this.#sound);

	// 	console.log(this.#sound)
	// }

	#createWaveCanvas() {
		// Create a canvas element
		this.#waveCanvas = document.createElement('canvas');
		// Set canvas width and height
		this.#waveCanvas.width = width;
		this.#waveCanvas.height = height - this.configuration.heightOffset;
		this.#waveCanvas.style.position = 'absolute';
		this.#waveCanvas.style.display = 'block';

		// if (this.#waveCanvas.getContext) {
		// 	const ctx = this.#waveCanvas.getContext("2d");

		// 	ctx.fillRect(25, 25, 100, 100);
		// 	ctx.clearRect(45, 45, 60, 60);
		// 	ctx.strokeRect(50, 50, 50, 50);
		// }

		// Add wave canvas to the main document section
		const main = document.querySelector("main");
		main.prepend(this.#waveCanvas);
	}

	#configureWaveSettings(audioElement, canvasElement) {
		this.#wave = new Wave(audioElement, canvasElement);
		this.#wave.addAnimation(new this.#wave.animations.Wave({
			lineWidth: 10,
			lineColor: "red",
			count: 20
		}));
	}

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => {
			push();

			this.onResize();

			pop();
		};
	}
}
