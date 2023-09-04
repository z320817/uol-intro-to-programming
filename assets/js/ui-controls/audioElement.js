class AudioElement extends P5 {

    controls = {
        play: () => { },
        pause: () => { },
        stop: () => { },
        time: () => { },
        duration: () => { },
    };
    amplitude = new p5.Amplitude();
    fourier = new p5.FFT();
    waveAudioElement;
    currentAudioElement;
    isPlaying = false;

    #p5audioElement;
    #p5audioControlsIsHidden = false;
    #waveControlsIsHidden = true;
    #controlsAreHidden = false;
    #sound;
    #icons;
    #renderingProcessor;

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

        progressBarPosition: (width, height, heightOffset) => {

            return {
                progressBarX: width / 14,
                progressBarY: height - heightOffset + 20,
                progressBarWidth: (width / 8),
                progressBarHeight: heightOffset / 6
            }
        },
    }

    get peaks() {
        return this.#sound.getPeaks(width);
    }

    get configuration() {
        return AudioElement.#configuration;
    }

    get name() {
        return AudioElement.#configuration.name;
    }

    get onResize() {
        return AudioElement.onResize;
    }


    get playControlHitCheck() {
        return AudioElement.playControlHitCheck;
    }

    get draw() {
        return this.#renderingProcessor;
    }

    /**
     * @param { sound } sound
     */
    /**
     * @param { icons } icons
     */
    constructor(sound, icons) {
        super();
        this.#sound = sound;
        this.#icons = icons;

        //set initial position of elements
        this.onResize();
        this.#createP5AudioControl(this.#sound.url);
        this.#createWaveAudioControl(this.#sound.url);
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
        return this.controls;
    }

    getCurrentAudioElement() {
        return this.currentAudioElement;
    }

    #setCurrentAudioControls() {
        if (this.#waveControlsIsHidden) {
            this.controls.play = () => {
                this.#p5audioElement.play();
                getAudioContext().resume();
                this.isPlaying = true;
            };
            this.controls.pause = () => {
                this.#p5audioElement.pause();
                this.isPlaying = false;
            };
            this.controls.stop = () => {
                this.#p5audioElement.stop();
                this.isPlaying = stop;
            };
            this.controls.time = () => {
                const time = this.#p5audioElement.time();
                return this.#p5audioElement.time();
            };
            this.controls.duration = () => {
                return this.#p5audioElement.duration();
            };

            this.currentAudioElement = this.#p5audioElement;
        }

        if (this.#p5audioControlsIsHidden) {
            this.controls.play = () => {
                this.waveAudioElement.play();
                this.isPlaying = true;
            };
            this.controls.pause = () => {
                this.waveAudioElement.pause();
                this.isPlaying = false;
            };
            this.controls.stop = () => {
                this.waveAudioElement.stop();
                this.isPlaying = false;
            };
            this.controls.time = () => {
                return this.waveAudioElement.currentTime.toFixed(2);;
            };
            this.controls.duration = () => {
                return this.waveAudioElement.duration;
            };

            this.currentAudioElement = this.waveAudioElement;
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
        this.waveAudioElement = document.createElement('audio');

        // Set the source of the audio
        this.waveAudioElement.src = soundSourceURL;
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
        if (this.controlsAreHidden) {
            return;
        } else {
            const { heightOffset, playControlPosition } = this.configuration;

            const {
                playControlWidth, playControlHeight, playControlX, playControlY
            } = playControlPosition(width, height, heightOffset)

            if (!this.isPlaying) {
                noStroke();
                image(this.#icons.audioElement.playBtn.releasedBtn, playControlX + playControlWidth / 2.4, playControlY + playControlHeight / 2.4, 32, 24);
            } else {
                noStroke();
                image(this.#icons.audioElement.playBtn.pressedBtn, playControlX + playControlWidth / 2.4, playControlY + playControlHeight / 2.4, 32, 24);
            }
        }
    }

    #progressBarRendering = () => {
        const { heightOffset, progressBarPosition } = this.configuration;

        const {
            progressBarHeight, progressBarWidth, progressBarX, progressBarY
        } = progressBarPosition(width, height, heightOffset)



        const spacing = this.peaks.length / progressBarWidth;
        const peakStep = Math.ceil(progressBarWidth / spacing);
        const progressBarSpacing = progressBarWidth / peakStep;

        let x1 = progressBarX - progressBarSpacing / 2;
        let x2 = progressBarX - progressBarSpacing / 2;

        const progressBarLength = Math.ceil(progressBarWidth);
        let currentPeakIndex = 0;

        if (this.controlsAreHidden) {
            return;
        } else {
            fill(0);
            rect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

            for (let i = 0; i < progressBarLength; i += progressBarSpacing) {
                let currentPeakValue = Math.abs(this.peaks[currentPeakIndex]) * 500;
                x1 += progressBarSpacing;
                let y1 = progressBarY + progressBarHeight;
                x2 += progressBarSpacing;
                let y2 = progressBarY + currentPeakValue;
                stroke(255);
                line(x1, y1, x2, y2);

                if (currentPeakIndex <= progressBarLength) {
                    currentPeakIndex += peakStep;
                } else {
                    currentPeakIndex = 0;
                }

            }

        }
    }

    #setupRenderingProcessor() {
        this.#renderingProcessor = () => {
            this.#playControlRendering();
            this.#progressBarRendering();
        };
    }

    #hideAudioElement() {
        this.controlsAreHidden = true;
    }

    #showAudioElement() {
        this.controlsAreHidden = false;
    }
}
