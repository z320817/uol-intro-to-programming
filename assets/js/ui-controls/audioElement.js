class AudioElement extends P5 {

    #renderingProcessor;
    #audioElement;

    static #configuration = {
        name: "spectrum",
        heightOffset: 0
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

        
        this.#audioElement = createAudio(soundSourceURL);
        this.#audioElement.position(20, 50);
        this.#audioElement.size(300);

        // Show the audio controls
        this.#audioElement.showControls();
        this.#audioElement.connect()

        this.#setupRenderingProcessor();
    }

    static onResize() {
        this.configuration.heightOffset = height / 4;
    };

    #setupRenderingProcessor() {
        const { heightOffset } = this.configuration;

        this.#renderingProcessor = () => {
            if (!this.#audioElement) {
                this.audioElement.position(20, 50);
                this.audioElement.size(300);

                // Show the audio controls
                this.audioElement.showControls();
            } else {
                return this.#audioElement;
            }
        };
    }
}
