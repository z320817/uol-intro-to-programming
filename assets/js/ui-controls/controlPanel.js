//constructor function to draw a
class ControlPanel extends P5 {

	#renderingProcessor;
	#visualControlFlow = true;
	#musicControlFlow = false;

	static #configuration = {
		heightOffset: 0,
		musicButtonPosition: (width, height, heightOffset) => {

			return {
				musicButtonX: 20 + width / 4,
				musicButtonY: height - heightOffset + 10,
				musicButtonWidth: width / 4,
				musicButtonHeight: heightOffset / 4
			}
		},
		visualButtonPosition: (width, height, heightOffset) => {

			return {
				visualButtonX: 10,
				visualButtonY: height - heightOffset + 10,
				visualButtonWidth: width / 4,
				visualButtonHeight: heightOffset / 4
			}
		}
	}

	get configuration() {
		return ControlPanel.#configuration;
	}

	get onResize() {
		return ControlPanel.onResize;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get hitCheck() {
		return ControlPanel.hitCheck;
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

	//checks for clicks on the button, changes control flows.
	//@returns true if clicked false otherwise.
	static hitCheck() {
		const { heightOffset, musicButtonPosition, visualButtonPosition } = this.configuration;
		const {
			musicButtonX,
			musicButtonY,
			musicButtonWidth,
			musicButtonHeight
		} = musicButtonPosition(width, height, heightOffset);

		const {
			visualButtonX,
			visualButtonY,
			visualButtonWidth,
			visualButtonHeight
		} = visualButtonPosition(width, height, heightOffset)

		if (mouseX > musicButtonX &&
			mouseX < musicButtonX + musicButtonWidth &&
			mouseY > musicButtonY && mouseY < musicButtonY + musicButtonHeight) {
			this.#visualControlFlow = false;
			this.#musicControlFlow = true;

			return true;
		} else if (mouseX > visualButtonX &&
			mouseX < visualButtonX + visualButtonWidth &&
			mouseY > visualButtonY && mouseY < visualButtonY + visualButtonHeight) {
			this.#visualControlFlow = true;
			this.#musicControlFlow = false;

			return true;
		}

		return false;
	};


	#setupRenderingProcessor() {
		const { heightOffset } = this.configuration;

		this.#renderingProcessor = () => {
			//main control panel area
			rect(0, height - heightOffset, width, heightOffset + 10);

			this.#visualFlowBtn();
			this.#musicFlowBtn();
		};
	}

	//visual flow control button UI
	#visualFlowBtn = () => {
		const { heightOffset, visualButtonPosition } = this.configuration;
		const {
			visualButtonX,
			visualButtonY,
			visualButtonWidth,
			visualButtonHeight
		} = visualButtonPosition(width, height, heightOffset)

		if (!this.#visualControlFlow) {
			fill('#B2BEB5');
			stroke('#fff');
			rect(visualButtonX, visualButtonY, visualButtonWidth, visualButtonHeight);
		} else {
			fill('#B2BEB5');
			stroke('#000');
			rect(visualButtonX, visualButtonY, visualButtonWidth, visualButtonHeight);
		}

	}

	//music flow control button UI
	#musicFlowBtn = () => {
		const { heightOffset, musicButtonPosition } = this.configuration;
		const {
			musicButtonX,
			musicButtonY,
			musicButtonWidth,
			musicButtonHeight
		} = musicButtonPosition(width, height, heightOffset);

		if (!this.#musicControlFlow) {
			fill('#36454F');
			stroke('#fff');
			rect(musicButtonX, musicButtonY, musicButtonWidth, musicButtonHeight);
		} else {
			fill('#36454F');
			stroke('#000');
			rect(musicButtonX, musicButtonY, musicButtonWidth, musicButtonHeight);
		}

	}
}