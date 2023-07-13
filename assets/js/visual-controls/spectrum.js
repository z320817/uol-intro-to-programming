class Spectrum extends P5 {

	#renderingProcessor;

	static #configuration = {
		name: "spectrum",
		heightOffset: 0
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

	constructor() {
		super();
		this.configuration.heightOffset = height / 2.5;
		this.#setupRenderingProcessor();
	}

	#setupRenderingProcessor() {
		const { heightOffset } = this.configuration;

		this.#renderingProcessor = () => {
			push();
			var spectrum = fourier.analyze();
			noStroke();

			for (var i = 0; i < spectrum.length; i++) {

				//fade the colour of the bin from green to red
				var g = map(spectrum[i], 0, 255, 255, 0);
				fill(spectrum[i], g, 0);

				//draw each bin as a rectangle from the left of the screen
				//across
				var y = map(i, 0, spectrum.length, 0, height - heightOffset);
				var w = map(spectrum[i], 0, 255, 0, width);
				rect(0, y, w, height / spectrum.length);
			}
			pop();
		};
	}
}
