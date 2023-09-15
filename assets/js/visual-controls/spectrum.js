class Spectrum extends P5 {

	#icons;
	#audioElement;
	#isEnabled = true;
	#renderingProcessor;

	static #configuration = {
		name: "spectrum",
		heightOffset: 0,
		lowerBorder: 0,
		spectrumControlPosition: (width, lowerBorder) => {
			return {
				spectrumControlIconX: width / 12,
				spectrumControlIconY: lowerBorder + 150,
				spectrumControlIconHeight: 32,
				spectrumControlIconWidth: 32,
			}
		},
		spectrumControlConfiguration: () => {

		}
	}

	get controlHitCheck() {
		return this.#controlHitCheck;
	}

	get configuration() {
		return Spectrum.#configuration;
	}

	get name() {
		return Spectrum.#configuration.name;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get onResize() {
		return Spectrum.onResize;
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
		this.configuration.heightOffset = (height / 2.5);
		this.configuration.lowerBorder = Number((height - this.configuration.heightOffset).toFixed(0));
	};

	controlRendering() {
		return this.#setupControllRendering();
	}

	setIsEnabled() {
		this.#isEnabled = !this.#isEnabled;
	}

	#controlHitCheck() {
		const { lowerBorder, spectrumControlPosition } = this.configuration;

		const { spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth } = spectrumControlPosition(width, lowerBorder);

		if (mouseX > spectrumControlIconX &&
			mouseX < spectrumControlIconX + spectrumControlIconWidth &&
			mouseY > spectrumControlIconY && mouseY < spectrumControlIconY + spectrumControlIconHeight) {

			return true;
		}

		return false;
	}

	#setupControllRendering() {
		push();
		const { lowerBorder, spectrumControlPosition } = this.configuration;

		const { spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth } = spectrumControlPosition(width, lowerBorder);

		noStroke();
		if (this.#isEnabled) {
			image(this.#icons.visualisation.spectrum.on, spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth);
		} else {
			image(this.#icons.visualisation.spectrum.off, spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth);
		}
		pop();
	}

	#setupRenderingProcessor() {
		const { lowerBorder } = this.configuration;

		this.#renderingProcessor = () => {
			push();
			this.onResize();
			var spectrum = this.#audioElement.fourier.analyze();
			noStroke();

			for (var i = 0; i < spectrum.length; i++) {

				//fade the colour of the bin from green to red
				var g = map(spectrum[i], 0, 255, 255, 0);
				fill(spectrum[i], g, 0);

				//draw each bin as a rectangle from the left of the screen
				//across
				var y = map(i, 0, spectrum.length, 0, lowerBorder);
				var w = map(spectrum[i], 0, 255, 0, width);

				rect(0, y, w, height / spectrum.length);
			}
			pop();
		};
	}
}