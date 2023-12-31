//displays and handles clicks on the playback button.
class PlaybackButton extends P5 {

	#renderingProcessor;
	#audioElement;

	static #configuration = {
		x: 20,
		y: 20,
		width: 20,
		height: 20
	}

	/**
	 * @param { audioElement } audioElement, 
	 */
	constructor(audioElement) {
		super();

		this.#audioElement = audioElement;
		//draws the playback button UI
		this.#setupRenderingProcessor();
	}

	get configuration() {
		return PlaybackButton.#configuration;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get hitCheck() {
		return PlaybackButton.hitCheck;
	}

	get playSound() {
		return PlaybackButton.playSound;
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

	static playSound() {
		if (this.#audioElement.isPlaying) {
			this.#audioElement.controls.pause();
		} else {
			this.#audioElement.controls.play();
		}
	}

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => {
			const { x, y, width, height } = this.configuration;

			if (this.#audioElement.isPlaying) {
				rect(x, y, width / 2 - 2, height);
				rect(x + (width / 2 + 2), y, width / 2 - 2, height);
			}
			else {
				stroke('#000');
				triangle(x, y, x + width, y + height / 2, x, y + height);
			}
		};
	}
}