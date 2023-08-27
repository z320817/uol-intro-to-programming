//displays and handles clicks on the playback button.
class PlaybackButton extends P5 {

	#playing = false;
	#renderingProcessor;
	#audioElementRef;

	static #configuration = {
		x: 20,
		y: 20,
		width: 20,
		height: 20
	}

	/**
	 * @param { MediaElement } audioElementRef, 
	 */
	constructor(audioElementRef) {
		super();

		this.#audioElementRef = audioElementRef;
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

	//checks for clicks on the button, starts or pauses playabck.
	//@returns true if clicked false otherwise.
	static hitCheck() {
		const { x, y, width, height } = this.configuration;

		if (mouseX > x &&
			mouseX < x + width &&
			mouseY > y &&
			mouseY < y + height) {

			if (this.#audioElementRef.time()) {
				this.#audioElementRef.stop();
				this.#playing = false;
			} else {
				this.#audioElementRef.play();
				getAudioContext().resume();
				this.#playing = true;
			}

			return true;
		}
		return false;
	};

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => {
			const { x, y, width, height } = this.configuration;

			if (this.#playing) {
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