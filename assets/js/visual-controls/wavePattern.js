//draw the waveform to the screen
class WavePattern extends P5 {

	#icons;
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
	constructor(currentAudioElement) {
		super();

		this.#audioElement = currentAudioElement;

		//set initial position of elements
		this.onResize();

		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = height / 2.5;
	};

	#setupRenderingProcessor() {
		const { heightOffset } = this.configuration;

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
				var y = map(wave[i], -1, 1, 0, height - heightOffset);

				vertex(x, y);
			}

			endShape();
			pop();
		};
	}
}