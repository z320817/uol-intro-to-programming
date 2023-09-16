//draw the waveform to the screen
class WavePattern extends P5 {

	#icons;
	#isFullScreen;
	#isEnabled;
	#audioElement;
	#renderingProcessor;

	static #configuration = {
		name: "wavepattern",
		heightOffset: 0
	}

	get configuration() {
		return WavePattern.#configuration;
	}

	get name() {
		return WavePattern.#configuration.name;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get onResize() {
		return WavePattern.onResize;
	}

	/**
	 * @param { icons } icons, 
	 */
	/**
	 * @param { AudioElement } currentAudioElement, 
	 */
	constructor(currentAudioElement, icons) {
		super();

		this.#icons = icons;
		this.#audioElement = currentAudioElement;

		//set initial position of elements
		this.onResize();

		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = this.#isFullScreen ? height : height - (height / 2.5);
	};

	/**
	 * @param { boolean } isFullScreen, 
	 */
	setFullScreen(isFullScreen) {
		this.#isFullScreen = isFullScreen;
		this.onResize();
	}

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

	#setupRenderingProcessor() {

		this.#renderingProcessor = () => {
			push();
			noFill();
			stroke(255, 0, 0);
			strokeWeight(2);

			beginShape();
			//calculate the waveform from the fft.
			var wave = this.#audioElement.fourier.waveform();
			for (var i = 0; i < wave.length; i++) {
				//for each element of the waveform map it to screen
				//coordinates and make a new vertex at the point.
				var x = map(i, 0, wave.length, 0, width);
				var y = map(wave[i], -1, 1, 0, this.configuration.heightOffset);

				vertex(x, y);
			}

			endShape();
			pop();
		};
	}
}