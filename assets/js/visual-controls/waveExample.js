class WaveExample extends P5 {

	#icons;
	#isEnabled;
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

		// Configure initial wave settings
		this.#configureWaveSettings(this.#audioElement, this.#waveCanvas)

		// Run rendering process to syncronize wave and p5 canvases
		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = height / 2.5;
	};

	controlRendering() {
		return this.#setupControllRendering();
	}

	setIsEnabled() {
		this.#isEnabled = !this.#isEnabled;
	}

	#setupControllRendering() {
		push();

		pop();
	}

	#createWaveCanvas() {
		// Create a canvas element
		this.#waveCanvas = document.createElement('canvas');
		// Set canvas width and height
		this.#waveCanvas.width = width;
		this.#waveCanvas.height = height - this.configuration.heightOffset;
		this.#waveCanvas.style.position = 'absolute';
		this.#waveCanvas.style.display = 'block';

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
