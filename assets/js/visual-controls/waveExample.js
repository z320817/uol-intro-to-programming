class WaveExample extends P5 {

	#canvas;
	#sound;
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

	constructor(canvas, sound) {
		super();

		this.#canvas = canvas;
		this.#sound = sound;
		console.log(this.#canvas)
		console.log(this.#sound)

		//set initial position of elements
		this.onResize();

		this.#configureWaveSettings(this.#sound, this.#canvas)

		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = height / 2.5;
	};

	#configureWaveSettings(audioElement, canvasElement) {
		this.#wave = new Wave(audioElement, canvasElement);

		this.#wave.addAnimation(new this.#wave.animations.Wave({
			lineWidth: 10,
			lineColor: "red",
			count: 20
		}));
	}

	#setupRenderingProcessor() {
		const { heightOffset } = this.configuration;

		this.#renderingProcessor = () => {
			push();
			console.log('worked')
			console.log(this.#wave)
			beginShape();


			endShape();

			pop();
		};
	}
}
