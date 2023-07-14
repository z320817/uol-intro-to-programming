class AudioElement extends P5 {

    #renderingProcessor;
    #audioElement;

    static #configuration = {
        name: "spectrum",
        heightOffset: 0,
        audioControlsPosition: (width, height, heightOffset) => {

			return {
				x: width / 54,
				y: height - heightOffset + 10,
				size: width / 4,
			}
		},
    }

    get configuration() {
        return AudioElement.#configuration;
    }

    get name() {
        return AudioElement.#configuration.name;
    }

    get draw() {
        return this.#renderingProcessor;
    }

    get onResize() {
        return AudioElement.onResize;
    }

    get audioElementRef() {
        return this.#audioElement;
    }

    /**
	 * @param { string } soundSourceURL
	 */
    constructor(soundSourceURL) {
        super();

        //set initial position of elements
        this.onResize();
        this.#createAudioControl(soundSourceURL);
        this.#setupRenderingProcessor();
    }

    static onResize() {
        this.configuration.heightOffset = height / 4;
    };

    /**
	 * @param { string } soundSourceURL
	 */
    #createAudioControl(soundSourceURL) {
        const { heightOffset } = this.configuration;
        const { size, x, y } = this.configuration.audioControlsPosition(width, height, heightOffset);

        this.#audioElement = createAudio(soundSourceURL);
        this.#audioElement.position(x, y);
        this.#audioElement.size(size);

        // Show the audio controls
        this.#audioElement.showControls();
        this.#audioElement.connect()
    }

    #setupRenderingProcessor() {
        const { heightOffset } = this.configuration;
        const { size, x, y } = this.configuration.audioControlsPosition(width, height, heightOffset);

        this.#renderingProcessor = () => {
            if (!this.#audioElement) {
                this.audioElement.position(x, y);
                this.audioElement.size(size);
            } else {
                return this.#audioElement;
            }
        };
    }
}
