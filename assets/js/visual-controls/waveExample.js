class WaveExample extends P5 {

	#canvas;
	#sound;
	#renderingProcessor;

	static #configuration = {
		name: "waveexample",
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

	constructor(canvas, sound) {
		super();

		this.#canvas = canvas;
		this.#sound = sound;
		this.#setupRenderingProcessor();
	}

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => { };
	}

	#createAudioElement() {
		var x = document.createElement("AUDIO");

		if (x.canPlayType("audio/mpeg")) {
			x.setAttribute("src", this.#sound);
		} else {
			x.setAttribute("src", this.#sound);
		}

		x.setAttribute("controls", "controls");
		document.body.appendChild(x);

		return x;
	}
}
