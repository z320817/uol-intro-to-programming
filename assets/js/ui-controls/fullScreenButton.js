//displays and handles clicks on the playback button.
class FullScreenButton extends P5 {

	#isFullScreen;
	#icons;
	#renderingProcessor

	static #configuration = {
		x: 60,
		y: 20,
		width: 20,
		height: 20
	}

	/**
	 * @param { icons } icons, 
	 */
	/**
	 * @param { boolean } isFullScreen, 
	 */
	constructor(isFullScreen, icons) {
		super();

		this.#icons = icons;
		this.#isFullScreen = isFullScreen;
		this.#setupRenderingProcessor();
	}

	get configuration() {
		return FullScreenButton.#configuration;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get hitCheck() {
		return FullScreenButton.hitCheck;
	}

	//checks for clicks on the button, starts or pauses playabck.
	//@returns true if clicked false otherwise.
	static hitCheck() {
		const { x, y, width, height } = this.configuration;

		if (mouseX > x &&
			mouseX < x + width &&
			mouseY > y &&
			mouseY < y + height) {

			return true;
		}
		return false;
	};

	/**
	 * @param { boolean } isFullScreen, 
	 */
	setFullScreen(isFullScreen) {
		this.#isFullScreen = isFullScreen;
	}

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => {
			const { x, y, width, height } = this.configuration;

			if (this.#isFullScreen) {
				image(this.#icons.fullScreen.on, x, y, height, width);
			}
			else {
				image(this.#icons.fullScreen.off, x, y, height, width);
			}
		};
	}
}