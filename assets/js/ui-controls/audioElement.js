class AudioElement extends P5 {

    #renderingProcessor;
    #p5audioElement;
    #waveAudioElement;
    #currentAudioElement;
    #isPlaying = false;
    #p5audioControlsIsHidden = false;
    #waveControlsIsHidden = true;
    #controlsAreHidden = false;
    #controls = {
        play: () => { },
        pause: () => { },
        stop: () => { },
        time: () => { },
    };
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

    get onResize() {
        return AudioElement.onResize;
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

    get controls() {
        return this.#controls;
    }

    get isPlaying() {
        return this.#isPlaying;
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
        this.#setCurrentAudioControls();
        this.#setupRenderingProcessor();
    }

    hide() {
        return this.#hideAudioElement();
    }

    show() {
        return this.#showAudioElement();
    }

    requestP5audioControls() {
        this.#p5audioControlsIsHidden = false;
        this.#waveControlsIsHidden = true;

        this.#setCurrentAudioControls();

        return this.getAudioControls();
    };

    requestWaveAudioControls() {
        this.#waveControlsIsHidden = false;
        this.#p5audioControlsIsHidden = true;

        this.#setCurrentAudioControls();

        return this.getAudioControls();
    };

    getAudioControls() {
        return this.#controls;
    }

    getCurrentAudioElement() {
        return this.#currentAudioElement;
    }

    #setCurrentAudioControls() {
        if (this.#waveControlsIsHidden) {
            this.#controls.play = () => {
                this.#p5audioElement.play();
                getAudioContext().resume();
                this.#isPlaying = true;
            };
            this.#controls.pause = () => {
                this.#p5audioElement.pause();
                this.#isPlaying = false;
            };
            this.#controls.stop = () => {
                this.#p5audioElement.stop();
                this.#isPlaying = stop;
            };
            this.#controls.time = () => {
                return this.#p5audioElement.time();
            };

            this.#currentAudioElement = this.#p5audioElement;
        }

        if (this.#p5audioControlsIsHidden) {
            this.#controls.play = () => {
                this.#waveAudioElement.play();
                this.#isPlaying = true;
            };
            this.#controls.pause = () => {
                this.#waveAudioElement.pause();
                this.#isPlaying = false;
            };
            this.#controls.stop = () => {
                this.#waveAudioElement.stop();
                this.#isPlaying = false;
            };
            this.#controls.time = () => {
                return this.#waveAudioElement.currentTime.toFixed(2);;
            };

            this.#currentAudioElement = this.#waveAudioElement;
        }
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
