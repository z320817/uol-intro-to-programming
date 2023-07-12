//draw the waveform to the screen
class WavePattern extends P5 {

	#renderingProcessor;

	static #configuration = {
		name: "wavepattern",
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

	constructor() {
		super();
		this.#setupRenderingProcessor();
	}

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => {
			push();
			noFill();
			stroke(255, 0, 0);
			strokeWeight(2);

			beginShape();
			//calculate the waveform from the fft.
			var wave = fourier.waveform();
			for (var i = 0; i < wave.length; i++) {
				//for each element of the waveform map it to screen
				//coordinates and make a new vertex at the point.
				var x = map(i, 0, wave.length, 0, width);
				var y = map(wave[i], -1, 1, 0, height);

				vertex(x, y);
			}

			endShape();
			pop();
		};
	}
}