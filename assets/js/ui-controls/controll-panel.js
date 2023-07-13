//constructor function to draw a
class ControllPanel extends P5 {

	#renderingProcessor;

	static #configuration = {
		heightOffset: 0,
	}

	get configuration() {
		return ControllPanel.#configuration;
	}

	get onResize() {
		return ControllPanel.onResize;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	constructor() {
		super();

		//set initial position of elements
		this.onResize();

		//draws the controll panel UI
		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = height / 2.5;
	};

	#setupRenderingProcessor() {
		const { heightOffset } = this.configuration;

		this.#renderingProcessor = () => {

			rect(0, height - heightOffset, width, heightOffset);
		};
	}
}