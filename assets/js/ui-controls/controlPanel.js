//constructor function to draw a
class ControlPanel extends P5 {

	#icons;
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

	get visualButtonHitCheck() {
		return ControlPanel.visualButtonHitCheck;
	}

	get musicButtonHitCheck() {
		return ControlPanel.musicButtonHitCheck;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get hitCheck() {
		return ControlPanel.hitCheck;
	}

	/**
	 * @param { icons } icons, 
	 */
	constructor(icons) {
		super();

		//icons reference
		this.#icons = icons;

		//set initial position of elements
		this.onResize();

		//draws the controll panel UI
		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = height / 2.5;
	};

	//checks for clicks on the music flow button, changes control flows.
	//@returns true if clicked false otherwise.
	static musicButtonHitCheck() {
		const { heightOffset, musicButtonPosition } = this.configuration;
		const {
			musicButtonX,
			musicButtonY,
			musicButtonWidth,
			musicButtonHeight
		} = musicButtonPosition(width, height, heightOffset);

		if (mouseX > musicButtonX &&
			mouseX < musicButtonX + musicButtonWidth &&
			mouseY > musicButtonY && mouseY < musicButtonY + musicButtonHeight) {
			this.#visualControlFlow = false;
			this.#musicControlFlow = true;

			return true;
		}

		return false;
	};


	//checks for clicks on the visuals flow button, changes control flows.
	//@returns true if clicked false otherwise.
	static visualButtonHitCheck() {
		const { heightOffset, musicButtonPosition, visualButtonPosition } = this.configuration;

		const {
			visualButtonX,
			visualButtonY,
			visualButtonWidth,
			visualButtonHeight
		} = visualButtonPosition(width, height, heightOffset)

		if (mouseX > visualButtonX &&
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
			noStroke();
			image(this.#icons.inputOutputController.visual.blackVisual, visualButtonX + visualButtonWidth / 2.4, visualButtonY + visualButtonHeight / 2.4, 32, 24);
		} else {
			fill('#B2BEB5');
			stroke('#000');
			rect(visualButtonX, visualButtonY, visualButtonWidth, visualButtonHeight);
			noStroke();
			image(this.#icons.inputOutputController.visual.whiteVisual, visualButtonX + visualButtonWidth / 2.4, visualButtonY + visualButtonHeight / 2.4, 32, 24);
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
			noStroke();
			image(this.#icons.inputOutputController.sound.blackSound, musicButtonX + musicButtonWidth / 2.4, musicButtonY + musicButtonHeight / 2.4, 24, 24);
		} else {
			fill('#36454F');
			stroke('#000');
			rect(musicButtonX, musicButtonY, musicButtonWidth, musicButtonHeight);
			noStroke();
			image(this.#icons.inputOutputController.sound.whiteSound, musicButtonX + musicButtonWidth / 2.4, musicButtonY + musicButtonHeight / 2.4, 24, 24);
		}

	}
}