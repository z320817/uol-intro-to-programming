class AudioElement extends P5 {

    #renderingProcessor;
    #p5audioElement;
    #waveAudioElement;
    #isPlaying;
    #p5audioControlsIsHidden = false;
    #waveControlsIsHidden = false;
    #controlsAreHidden = false;
    #icons;

    static #configuration = {
        name: "spectrum",
        heightOffset: 0,
        playControlPosition: (width, height, heightOffset) => {

            return {
                playControlX: width / 54,
                playControlY: height - heightOffset + 10,
                playControlWidth: (width / 4) / 6,
                playControlHeight: heightOffset / 6
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

    hide() {
        return this.#hideAudioElement();
    }

    show() {
        return this.#showAudioElement();
    }

    get onResize() {
        return AudioElement.onResize;
    }

    get p5audioElementTime() {
        return this.#p5audioElement.time();
    }

    get waveAudioElementTime() {
        return this.#waveAudioElement.time;
    }

    get p5audioElement() {
        return this.#p5audioElement;
    }

    get waveAudioElement() {
        return this.#waveAudioElement;
    }

    get playControlHitCheck() {
        return AudioElement.playControlHitCheck;
    }

    /**
     * @param { string } soundSourceURL
     */
    /**
     * @param { icons } icons
     */
    constructor(soundSourceURL, icons) {
        super();

        this.#icons = icons;

        //set initial position of elements
        this.onResize();
        this.#createP5AudioControl(soundSourceURL);
        this.#createWaveAudioControl(soundSourceURL);
        this.#setupRenderingProcessor();
    }

    static onResize() {
        this.configuration.heightOffset = height / 4;
    };

    /**
     * @param { string } soundSourceURL
     */
    #createP5AudioControl(soundSourceURL) {
        this.#p5audioElement = createAudio(soundSourceURL);
        this.#p5audioElement.connect();
    }

    /**
     * @param { string } soundSourceURL
     */
    #createWaveAudioControl(soundSourceURL) {
        // Create an audio element
        this.#waveAudioElement = document.createElement('audio');

        // Set the source of the audio
        this.#waveAudioElement.src = soundSourceURL;
    }

    // if (this.#audioElementRef.time()) {
    //     this.#audioElementRef.stop();
    //     this.#playing = false;
    // } else {
    //     this.#audioElementRef.play();
    //     getAudioContext().resume();
    //     this.#playing = true;
    // }

    #renderPlayControl() {

    }

    //checks for clicks on the visuals flow button, changes control flows.
    //@returns true if clicked false otherwise.
    static playControlHitCheck() {
        const { heightOffset, playControlPosition } = this.configuration;

        const {
            playControlWidth, playControlHeight, playControlX, playControlY
        } = playControlPosition(width, height, heightOffset)

        if (mouseX > playControlX &&
            mouseX < playControlX + playControlWidth &&
            mouseY > playControlY && mouseY < playControlY + playControlHeight) {
            this.#isPlaying = !this.#isPlaying;

            return true;
        }

        return false;
    };

    //play control button UI
    #playControlRendering = () => {
        if (this.#controlsAreHidden) {
            return;
        } else {
            const { heightOffset, playControlPosition } = this.configuration;

            const {
                playControlWidth, playControlHeight, playControlX, playControlY
            } = playControlPosition(width, height, heightOffset)

            if (!this.#isPlaying) {
                noStroke();
                image(this.#icons.audioElement.playBtn.releasedBtn, playControlX + playControlWidth / 2.4, playControlY + playControlHeight / 2.4, 32, 24);
            } else {
                noStroke();
                image(this.#icons.audioElement.playBtn.pressedBtn, playControlX + playControlWidth / 2.4, playControlY + playControlHeight / 2.4, 32, 24);
            }
        }
    }

    #setupRenderingProcessor() {
        this.#renderingProcessor = () => {
            this.#playControlRendering();
        };
    }

    #hideAudioElement() {
        this.#controlsAreHidden = true;
    }

    #showAudioElement() {
        this.#controlsAreHidden = false;
    }
}
