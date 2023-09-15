class AudioElement extends P5 {

    controls = {
        play: () => { },
        pause: () => { },
        stop: () => { },
        time: () => { },
        duration: () => { },
        setVolume: () => { },
        getVolume: () => { },
    };
    amplitude = new p5.Amplitude();
    fourier = new p5.FFT();
    mic = new p5.AudioIn();
    recorder = new p5.SoundRecorder();
    recordFile = new p5.SoundFile();

    fileInput;
    waveAudioElement;
    currentAudioElement;
    isPlaying = false;
    isRecordInProgress = false;
    volumeChanged = false;

    #p5audioElement;
    #p5audioControlsIsHidden = false;
    #waveControlsIsHidden = true;
    #volumeLevel = 1;
    #currentVolumeLine = 1;
    #lowMidFreqLevel = 0;
    #bassFreqLevel = 0;
    #heighMidFreqLevel = 0;
    #trebleFreqLevel = 0;
    #bassFilter;
    #lowMidFilter;
    #heighMidFilter;
    #trebleFilter;
    #bassCutoff = 100;
    #lowMidCutoff = 400;
    #heighMidCutoff = 1000;
    #trebleCutoff = 4000;
    #isLooped = false;
    #frequencyBins = ["bass", "lowMid", "highMid", "treble"];
    #sound;
    #icons;
    #position;
    #renderingProcessor;

    static #configuration = {
        name: "spectrum",
        heightOffset: 0,
        rightPositionOffset: 0,
        looperPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let looperX = width / 24;

            if (currentPosition === position.right) {
                looperX += rightPositionOffset;
            }

            return {
                looperX: looperX,
                looperY: (height - heightOffset) + 70,
                looperHeight: 32,
                looperWidth: 28,
            }
        },
        timerPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let timerX = width / 20;

            if (currentPosition === position.right) {
                timerX += rightPositionOffset;
            }

            return {
                timerX: timerX,
                timerY: (height - heightOffset) - 35,
                timerHeight: 32,
                timerWidth: 32,
            }
        },
        playControlPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let playControlX = (width / 54) - 10;

            if (currentPosition === position.right) {
                playControlX += rightPositionOffset;
            }

            return {
                playControlX: playControlX,
                playControlY: height - heightOffset / 1.14,
                playControlWidth: 32,
                playControlHeight: 32
            }
        },
        adderControlPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let adderX = width / 9;

            if (currentPosition === position.right) {
                adderX += rightPositionOffset;
            }

            return {
                adderX: adderX,
                adderY: height - heightOffset + 70,
                adderWidth: 32,
                adderHeight: 32
            }
        },
        lowMidFreqControlPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let freqX = width / 11;

            if (currentPosition === position.right) {
                freqX += rightPositionOffset;
            }

            return {
                freqX: freqX,
                freqY: height - heightOffset + 140,
                freqWidth: 32,
                freqHeight: 32
            }
        },
        bassFreqControlPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let freqX = width / 5.6;

            if (currentPosition === position.right) {
                freqX += rightPositionOffset;
            }

            return {
                freqX: freqX,
                freqY: height - heightOffset + 140,
                freqWidth: 32,
                freqHeight: 32
            }
        },
        heighMidFreqControlPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let freqX = width / 22;

            if (currentPosition === position.right) {
                freqX += rightPositionOffset;
            }

            return {
                freqX: freqX,
                freqY: height - heightOffset + 140,
                freqWidth: 32,
                freqHeight: 32
            }
        },
        trebleFreqControlPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let freqX = width / 7.4;

            if (currentPosition === position.right) {
                freqX += rightPositionOffset;
            }

            return {
                freqX: freqX,
                freqY: height - heightOffset + 140,
                freqWidth: 32,
                freqHeight: 32
            }
        },
        progressBarPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let progressBarX = width / 22;

            if (currentPosition === position.right) {
                progressBarX += rightPositionOffset;
            }

            return {
                progressBarX: progressBarX,
                progressBarY: height - heightOffset + 20,
                progressBarWidth: (width / 6),
                progressBarHeight: heightOffset / 6
            }
        },
        volumeControlPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let volumeControlX = (width / 54) - 10;

            if (currentPosition === position.right) {
                volumeControlX += rightPositionOffset;
            }

            return {
                volumeControlX: volumeControlX,
                volumeControlY: height - heightOffset / 8,
                volumeControlIconWidth: heightOffset / 8,
                volumeControlIconHeight: heightOffset / 8,
                volumeControlWidth: (width / 6),
                volumeControlHeight: heightOffset / 6
            }
        },
        micControlPosition: (width, height, heightOffset, currentPosition, rightPositionOffset) => {

            let micX = width / 5;

            if (currentPosition === position.right) {
                micX += rightPositionOffset;
            }

            return {
                micX: micX,
                micY: height - heightOffset + 70,
                micWidth: 32,
                micHeight: 32
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

    get volumeControlBarHitCheck() {
        return AudioElement.volumeControlBarHitCheck;
    }

    get volumeControlIconHitCheck() {
        return AudioElement.volumeControlIconHitCheck;
    }

    get adderControlHitCheck() {
        return AudioElement.adderControlHitCheck;
    }

    get lowMidFreqControlHitCheck() {
        return AudioElement.lowMidFreqControlHitCheck;
    }

    get bassFreqControlHitCheck() {
        return AudioElement.bassFreqControlHitCheck;
    }

    get heighMidFreqControlHitCheck() {
        return AudioElement.heighMidFreqControlHitCheck;
    }

    get trebleFreqControlHitCheck() {
        return AudioElement.trebleFreqControlHitCheck;
    }

    get micControlHitCheck() {
        return AudioElement.micControlHitCheck;
    }

    get looperControlHitCheck() {
        return AudioElement.looperControlHitCheck;
    }

    get draw() {
        return this.#renderingProcessor;
    }

    /**
     * @param { string } position, 
     */
    /**
     * @param { sound } sound
     */
    /**
     * @param { icons } icons
     */
    constructor(sound, icons, currentPosition) {
        super();
        this.#sound = sound;
        this.#icons = icons;
        this.#position = currentPosition;

        //set initial position of elements
        this.onResize();
        this.#createP5AudioControl(this.#sound.url);
        this.#createWaveAudioControl(this.#sound.url);
        this.#setCurrentAudioControls();
        this.#setupRenderingProcessor();
        this.#createFileInput();
        this.#createFrequencyFilters();
    }

    hide() {
        return this.#hideAudioElement();
    }

    show() {
        return this.#showAudioElement();
    }

    setRecordInProgress() {
        return this.#setRecordInProgress();
    }

    setIsLooped() {
        this.#isLooped = !this.#isLooped;
        this.controls.setLoop();
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

    /**
     * @param { Number } level
     */
    setVolumeLevel(level) {
        return this.#setVolumeLevel(level);
    }

    setLowMidFreqLevel() {
        const currentY = mouseY.toFixed();
        const { heightOffset, rightPositionOffset, lowMidFreqControlPosition } = this.configuration;
        const {
            freqY, freqHeight
        } = lowMidFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const lineStart = Number(freqY.toFixed()) + 5;
        const lineEnd = Number(freqY.toFixed()) + freqHeight + 25;
        const lineLength = lineEnd - lineStart;
        const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - freqHeight / 2;
        const upMiddle = lineMiddle - 1;
        const downMiddle = lineMiddle + 1;
        const step = Number((this.#lowMidCutoff / lineLength).toFixed());
        const degree = this.#lowMidCutoff / step;

        if (!this.#lowMidFreqLevel) {
            this.#lowMidFreqLevel = lineMiddle;
        }

        if (currentY - 20 <= upMiddle && this.#lowMidFreqLevel > lineStart) {
            this.#lowMidFreqLevel -= 2;
            this.#lowMidCutoff -= degree;
            this.#lowMidFilter.set(this.#lowMidCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#lowMidFilter);
        } else if (currentY >= downMiddle && this.#lowMidFreqLevel < lineEnd - 20) {
            this.#lowMidFreqLevel += 2;
            this.#lowMidCutoff += degree;
            this.#lowMidFilter.set(this.#lowMidCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#lowMidFilter);
        }

        if (this.#lowMidFreqLevel <= downMiddle && this.#lowMidFreqLevel >= upMiddle) {
            this.#lowMidFreqLevel = lineMiddle;
            this.#removeFilter(this.#lowMidFilter);
            this.#lowMidFilter = new p5.LowPass();
            this.#lowMidCutoff = 400;
            this.#lowMidFilter.freq(this.#lowMidCutoff);
        }
    }

    setBassFreqLevel() {
        const currentY = mouseY.toFixed();
        const { heightOffset, rightPositionOffset, bassFreqControlPosition } = this.configuration;
        const {
            freqY, freqHeight
        } = bassFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const lineStart = Number(freqY.toFixed()) + 5;
        const lineEnd = Number(freqY.toFixed()) + freqHeight + 25;
        const lineLength = lineEnd - lineStart;
        const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - freqHeight / 2;
        const upMiddle = lineMiddle - 1;
        const downMiddle = lineMiddle + 1;
        const step = Number((this.#bassCutoff / lineLength).toFixed());
        const degree = this.#bassCutoff / step;

        if (!this.#bassFreqLevel) {
            this.#bassFreqLevel = lineMiddle;
        }

        if (currentY - 20 <= upMiddle && this.#bassFreqLevel > lineStart) {
            this.#bassFreqLevel -= 2;
            this.#bassCutoff -= degree;
            this.#bassFilter.set(this.#bassCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#bassFilter);
        } else if (currentY >= downMiddle && this.#bassFreqLevel < lineEnd - 20) {
            this.#bassFreqLevel += 2;
            this.#bassCutoff += degree;
            this.#bassFilter.set(this.#bassCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#bassFilter);
        }

        if (this.#bassFreqLevel <= downMiddle && this.#bassFreqLevel >= upMiddle) {
            this.#bassFreqLevel = lineMiddle;
            this.#removeFilter(this.#bassFilter);
            this.#bassFilter = new p5.LowPass();
            this.#bassCutoff = 100;
            this.#bassFilter.freq(this.#bassCutoff);
        }
    }

    setHeighMidFreqLevel() {
        const currentY = mouseY.toFixed();
        const { heightOffset, rightPositionOffset, heighMidFreqControlPosition } = this.configuration;
        const {
            freqY, freqHeight
        } = heighMidFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const lineStart = Number(freqY.toFixed()) + 5;
        const lineEnd = Number(freqY.toFixed()) + freqHeight + 25;
        const lineLength = lineEnd - lineStart;
        const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - freqHeight / 2;
        const upMiddle = lineMiddle - 1;
        const downMiddle = lineMiddle + 1;
        const step = Number((this.#heighMidCutoff / lineLength).toFixed());
        const degree = this.#heighMidCutoff / step;

        if (!this.#heighMidFreqLevel) {
            this.#heighMidFreqLevel = lineMiddle;
        }

        if (currentY - 20 <= upMiddle && this.#heighMidFreqLevel > lineStart) {
            this.#heighMidFreqLevel -= 2;
            this.#heighMidCutoff -= degree;
            this.#heighMidFilter.set(this.#heighMidCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#heighMidFilter);
        } else if (currentY >= downMiddle && this.#heighMidFreqLevel < lineEnd - 20) {
            this.#heighMidFreqLevel += 2;
            this.#heighMidCutoff += degree;
            this.#heighMidFilter.set(this.#heighMidCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#heighMidFilter);
        }

        if (this.#heighMidFreqLevel <= downMiddle && this.#heighMidFreqLevel >= upMiddle) {
            this.#heighMidFreqLevel = lineMiddle;
            this.#removeFilter(this.#heighMidFilter);
            this.#heighMidFilter = new p5.LowPass();
            this.#heighMidCutoff = 1000;
            this.#heighMidFilter.freq(this.#heighMidCutoff);
        }
    }

    setTrebleMidFreqLevel() {
        const currentY = mouseY.toFixed();
        const { heightOffset, rightPositionOffset, trebleFreqControlPosition } = this.configuration;
        const {
            freqY, freqHeight
        } = trebleFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const lineStart = Number(freqY.toFixed()) + 5;
        const lineEnd = Number(freqY.toFixed()) + freqHeight + 25;
        const lineLength = lineEnd - lineStart;
        const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - freqHeight / 2;
        const upMiddle = lineMiddle - 1;
        const downMiddle = lineMiddle + 1;
        const step = Number((this.#trebleCutoff / lineLength).toFixed());
        const degree = this.#trebleCutoff / step;

        if (!this.#trebleFreqLevel) {
            this.#trebleFreqLevel = lineMiddle;
        }

        if (currentY - 20 <= upMiddle && this.#trebleFreqLevel > lineStart) {
            this.#trebleFreqLevel -= 2;
            this.#trebleCutoff -= degree;
            this.#trebleFilter.set(this.#trebleCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#trebleFilter);
        } else if (currentY >= downMiddle && this.#trebleFreqLevel < lineEnd - 20) {
            this.#trebleFreqLevel += 2;
            this.#trebleCutoff += degree;
            this.#trebleFilter.set(this.#trebleCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#trebleFilter);
        }

        if (this.#trebleFreqLevel <= downMiddle && this.#trebleFreqLevel >= upMiddle) {
            this.#trebleFreqLevel = lineMiddle;
            this.#removeFilter(this.#trebleFilter);
            this.#trebleFilter = new p5.LowPass();
            this.#trebleCutoff = 4000;
            this.#trebleFilter.freq(this.#trebleCutoff);
        }
    }

    /**
     * @param { filter } filter
     */
    #removeFilter(filter) {
        this.currentAudioElement.disconnect(filter);
        this.currentAudioElement.connect();
        filter.dispose();
    }

    #setCurrentAudioControls() {
        if (this.#waveControlsIsHidden) {
            this.controls.play = () => {
                this.#p5audioElement.play();
                getAudioContext().resume();
                this.#volumeLevel = this.controls.getVolume();
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
                return time;
            };
            this.controls.duration = () => {
                const duration = this.#p5audioElement.duration();

                if (duration === Infinity) {
                    return 0;
                } else {
                    return duration
                }
            };
            this.controls.setVolume = (level) => {
                return this.#p5audioElement.volume(level);
            };
            this.controls.getVolume = () => {
                return this.#p5audioElement.volume();
            };
            this.controls.setLoop = () => {
                this.#p5audioElement.loop();
            }

            this.currentAudioElement = this.#p5audioElement;
        }

        if (this.#p5audioControlsIsHidden) {
            this.controls.play = () => {
                this.waveAudioElement.play();
                this.#volumeLevel = this.controls.getVolume();
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
            this.controls.setVolume = (level) => {
                return this.waveAudioElement.volume(level);
            };
            this.controls.getVolume = () => {
                return this.waveAudioElement.volume;
            };
            this.controls.setLoop = () => {
                if (this.#isLooped) {
                    this.waveAudioElement.loop = true;
                } else {
                    this.waveAudioElement.loop = false;
                }
            }

            this.currentAudioElement = this.waveAudioElement;
        }
    }

    static onResize() {
        this.configuration.heightOffset = height / 4;
        this.configuration.rightPositionOffset = ((width / 54) - 10) + (width / 4);
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
    playControlHitCheck() {
        const { heightOffset, rightPositionOffset, playControlPosition } = this.configuration;

        const {
            playControlWidth, playControlHeight, playControlX, playControlY
        } = playControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        // console.log(this.#position)

        if (mouseX > playControlX &&
            mouseX < playControlX + playControlWidth &&
            mouseY > playControlY && mouseY < playControlY + playControlHeight) {

            return true;
        }

        return false;
    };

    //checks for clicks on the songs adder button
    //@returns true if clicked false otherwise.
    adderControlHitCheck() {
        const { heightOffset, rightPositionOffset, adderControlPosition } = this.configuration;

        const {
            adderX, adderY, adderHeight, adderWidth
        } = adderControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        if (mouseX > adderX &&
            mouseX < adderX + adderWidth &&
            mouseY > adderY && mouseY < adderY + adderHeight) {

            return true;
        }

        return false;
    };

    //checks for clicks on the loop button
    //@returns true if clicked false otherwise.
    looperControlHitCheck() {
        const { heightOffset, rightPositionOffset, looperPosition } = this.configuration;
        const {
            looperHeight, looperWidth, looperX, looperY
        } = looperPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        if (mouseX > looperX &&
            mouseX < looperX + looperWidth &&
            mouseY > looperY && mouseY < looperY + looperHeight) {

            return true;
        }

        return false;
    };

    lowMidFreqControlHitCheck() {
        const { heightOffset, rightPositionOffset, lowMidFreqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = lowMidFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        if (mouseX > freqX &&
            mouseX < freqX + freqWidth &&
            mouseY > freqY + 5 && mouseY < freqY + freqHeight + 25) {

            return true;
        }

        return false;
    };

    bassFreqControlHitCheck() {
        const { heightOffset, rightPositionOffset, bassFreqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = bassFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        if (mouseX > freqX &&
            mouseX < freqX + freqWidth &&
            mouseY > freqY + 5 && mouseY < freqY + freqHeight + 25) {

            return true;
        }

        return false;
    };

    heighMidFreqControlHitCheck() {
        const { heightOffset, rightPositionOffset, heighMidFreqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = heighMidFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        if (mouseX > freqX &&
            mouseX < freqX + freqWidth &&
            mouseY > freqY + 5 && mouseY < freqY + freqHeight + 25) {

            return true;
        }

        return false;
    };

    trebleFreqControlHitCheck() {
        const { heightOffset, rightPositionOffset, trebleFreqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = trebleFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        if (mouseX > freqX &&
            mouseX < freqX + freqWidth &&
            mouseY > freqY + 5 && mouseY < freqY + freqHeight + 25) {

            return true;
        }

        return false;
    };

    //checks for clicks on volume icon.
    volumeControlBarHitCheck() {
        const { heightOffset, rightPositionOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlHeight, volumeControlWidth, volumeControlX, volumeControlY, volumeControlIconWidth
        } = volumeControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        const leftEdge = volumeControlX + volumeControlIconWidth + (heightOffset / 6);
        const rightEdge = volumeControlX + volumeControlWidth - (heightOffset / 48);

        if (mouseX > leftEdge &&
            mouseX < rightEdge &&
            mouseY > volumeControlY && mouseY < volumeControlY + volumeControlHeight) {

            return true;
        }

        return false;
    };

    //checks for clicks on volumebar.
    volumeControlIconHitCheck() {
        const { heightOffset, rightPositionOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlX, volumeControlY, volumeControlIconWidth, volumeControlIconHeight
        } = volumeControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        const leftEdge = volumeControlX;
        const rightEdge = volumeControlX + volumeControlIconWidth;

        if (mouseX > leftEdge &&
            mouseX < rightEdge &&
            mouseY > volumeControlY && mouseY < volumeControlY + volumeControlIconHeight) {

            return true;
        }

        return false;
    };

    micControlHitCheck() {
        const { heightOffset, rightPositionOffset, micControlPosition } = this.configuration;

        const {
            micY, micX, micHeight, micWidth
        } = micControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        if (mouseX > micX &&
            mouseX < micX + micWidth &&
            mouseY > micY + 5 && mouseY < micY + micHeight) {

            return true;
        }

        return false;
    };

    #setVolumeFromVolumeControl() {
        const { heightOffset, rightPositionOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlWidth, volumeControlX, volumeControlIconWidth
        } = volumeControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        const leftEdge = volumeControlX + volumeControlIconWidth;
        const rightEdge = volumeControlX + volumeControlWidth - (heightOffset / 48);

        let maxLines = (((volumeControlWidth - volumeControlIconWidth) / 2) - 100).toFixed();

        const currentX = Math.floor(mouseX.toFixed() - (leftEdge));
        const length = Math.ceil(rightEdge - leftEdge);
        const linesInUnitofLenght = (maxLines / length).toFixed(3);
        this.#currentVolumeLine = Math.ceil(linesInUnitofLenght * currentX);
        this.#volumeLevel = Math.abs((linesInUnitofLenght * currentX / maxLines).toFixed(1));

        this.controls.setVolume(this.#volumeLevel);
    }

    #setVolumeFromAudioElement() {
        const { heightOffset, rightPositionOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlWidth, volumeControlIconWidth
        } = volumeControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        let maxLines = (((volumeControlWidth - volumeControlIconWidth) / 2) - 100).toFixed();
        this.#volumeLevel = this.controls.getVolume();
        this.#currentVolumeLine = (maxLines * this.#volumeLevel).toFixed();

        this.controls.setVolume(this.#volumeLevel);
    }

    async #setRecordInProgress() {
        this.isRecordInProgress = !this.isRecordInProgress;

        if (this.isRecordInProgress) {
            userStartAudio();
            this.mic.start();
            this.recorder.setInput(this.mic);
            this.recorder.record(this.recordFile);
        } else {
            this.recorder.stop();
            try {
                const result = await this.#saveRecordedFile();
                const wavArrayBuffer = toWav(this.recordFile.buffer);
                const wavBlob = new Blob([new Uint8Array(wavArrayBuffer)], { type: 'audio/wav' });
                const wavFile = new File([wavBlob], 'record.wav', { type: 'audio/wav' });
                const songFile = {
                    data: "/assets/music/record.wav",
                    file: wavFile,
                    name: 'record.wav',
                    size: wavFile.size,
                    subtype: "wav",
                    type: "audio"
                }
                this.#handleNewSongFile(songFile);
            } catch (error) {
                console.error(error);
            }

        }
    }

    #saveRecordedFile() {
        return new Promise((resolve, reject) => {
            let timeout = 1000;
            const interval = 100;

            const timer = setInterval(() => {
                if (this.recordFile.isLoaded()) {
                    clearInterval(timer);
                    resolve(true);
                }

                if (timeout <= 0) {
                    clearInterval(timer);
                    reject(false);
                }

                timeout -= interval;
            }, interval);
        });
    }

    /**
     * @param { boolean } isFromAudioElement
     */
    #setVolumeLevel(isFromAudioElement) {

        if (this.volumeChanged) {
            this.#setVolumeFromVolumeControl();
        }

        if (isFromAudioElement) {
            this.#setVolumeFromAudioElement();
        }
    }

    /**
     * @param { file } file
     */
    #handleNewSongFile = (file) => {
        if (['audio', 'audio/wav', 'audio/mp3', 'audio/ogg'].includes(file.type)) {

            if (this.isPlaying) {
                this.controls.stop();
            }

            sound = loadSound(file.file, () => {
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage(file);
                    navigator.serviceWorker.addEventListener('message', event => {

                        if (event.data === file.data) {
                            this.#sound = sound;
                            this.#createP5AudioControl(file.data);
                            this.#createWaveAudioControl(file.data);
                            this.#setCurrentAudioControls();
                        }
                    });
                } else {
                    alert('Service worker is not ready. Please open this page in new tab.');
                }
            }, () => { }, () => {
                this.controls.stop();
            });
        } else {
            alert('Please select an audio file (e.g., MP3 or WAV).');
        }
    }

    #lowMidFreqRendering = () => {
        const { heightOffset, rightPositionOffset, lowMidFreqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = lowMidFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const lineStart = (freqY + 5);
        const lineEnd = (freqY + freqHeight + 25);
        const lineLength = lineEnd - lineStart;
        const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - freqHeight / 2;

        textSize(14);
        fill(0);
        text(this.#frequencyBins[1], freqX - 3, freqY - 5);

        strokeWeight(3);
        stroke(0);
        line(freqX + (freqWidth / 2), freqY + 5, freqX + (freqWidth / 2), freqY + freqHeight + 25);

        if (this.#lowMidFreqLevel !== 0 && this.#lowMidFreqLevel < lineMiddle) {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChangerUp, freqX, this.#lowMidFreqLevel, freqHeight, freqWidth);
            noStroke();
        } else if (this.#lowMidFreqLevel !== 0 && this.#lowMidFreqLevel > lineMiddle) {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChangerDown, freqX, this.#lowMidFreqLevel, freqHeight, freqWidth);
            noStroke();
        }
        else {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChanger, freqX, lineMiddle, freqHeight, freqWidth);
            noStroke();
        }
    }

    #heighMidFreqRendering = () => {
        const { heightOffset, rightPositionOffset, heighMidFreqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = heighMidFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const lineStart = (freqY + 5);
        const lineEnd = (freqY + freqHeight + 25);
        const lineLength = lineEnd - lineStart;
        const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - freqHeight / 2;

        textSize(14);
        fill(0);
        text(this.#frequencyBins[2], freqX - 3, freqY - 5);

        strokeWeight(3);
        stroke(0);
        line(freqX + (freqWidth / 2), freqY + 5, freqX + (freqWidth / 2), freqY + freqHeight + 25);

        if (this.#heighMidFreqLevel !== 0 && this.#heighMidFreqLevel < lineMiddle) {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChangerUp, freqX, this.#heighMidFreqLevel, freqHeight, freqWidth);
            noStroke();
        } else if (this.#heighMidFreqLevel !== 0 && this.#heighMidFreqLevel > lineMiddle) {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChangerDown, freqX, this.#heighMidFreqLevel, freqHeight, freqWidth);
            noStroke();
        }
        else {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChanger, freqX, lineMiddle, freqHeight, freqWidth);
            noStroke();
        }
    }

    #bassFreqRendering = () => {
        const { heightOffset, rightPositionOffset, bassFreqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = bassFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const lineStart = (freqY + 5);
        const lineEnd = (freqY + freqHeight + 25);
        const lineLength = lineEnd - lineStart;
        const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - freqHeight / 2;

        textSize(14);
        fill(0);
        text(this.#frequencyBins[0], freqX - 3, freqY - 5);

        strokeWeight(3);
        stroke(0);
        line(freqX + (freqWidth / 2), freqY + 5, freqX + (freqWidth / 2), freqY + freqHeight + 25);

        if (this.#bassFreqLevel !== 0 && this.#bassFreqLevel < lineMiddle) {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChangerUp, freqX, this.#bassFreqLevel, freqHeight, freqWidth);
            noStroke();
        } else if (this.#bassFreqLevel !== 0 && this.#bassFreqLevel > lineMiddle) {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChangerDown, freqX, this.#bassFreqLevel, freqHeight, freqWidth);
            noStroke();
        }
        else {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChanger, freqX, lineMiddle, freqHeight, freqWidth);
            noStroke();
        }
    }


    #trebleFreqRendering = () => {
        const { heightOffset, rightPositionOffset, trebleFreqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = trebleFreqControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const lineStart = (freqY + 5);
        const lineEnd = (freqY + freqHeight + 25);
        const lineLength = lineEnd - lineStart;
        const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - freqHeight / 2;

        textSize(14);
        fill(0);
        text(this.#frequencyBins[3], freqX - 3, freqY - 5);

        strokeWeight(3);
        stroke(0);
        line(freqX + (freqWidth / 2), freqY + 5, freqX + (freqWidth / 2), freqY + freqHeight + 25);

        if (this.#trebleFreqLevel !== 0 && this.#trebleFreqLevel < lineMiddle) {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChangerUp, freqX, this.#trebleFreqLevel, freqHeight, freqWidth);
            noStroke();
        } else if (this.#trebleFreqLevel !== 0 && this.#trebleFreqLevel > lineMiddle) {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChangerDown, freqX, this.#trebleFreqLevel, freqHeight, freqWidth);
            noStroke();
        }
        else {
            stroke(0);
            strokeWeight(5);
            image(this.#icons.audioElement.frequencyChanger.frequencyChanger, freqX, lineMiddle, freqHeight, freqWidth);
            noStroke();
        }
    }


    #adderRendering = () => {
        const { heightOffset, rightPositionOffset, adderControlPosition } = this.configuration;

        const {
            adderX, adderY, adderHeight, adderWidth
        } = adderControlPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        noStroke();
        image(this.#icons.audioElement.adder, adderX, adderY, adderHeight, adderWidth);
    }

    #micRendering = () => {
        const { heightOffset, rightPositionOffset, micControlPosition } = this.configuration;

        const {
            micY, micX, micHeight, micWidth
        } = micControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        let maxSize = micWidth + 2;
        let minSize = micWidth - 2;
        let pulsatingSize = minSize + sin(frameCount * 0.05) * (maxSize - minSize);


        if (this.isRecordInProgress) {
            noStroke();
            image(this.#icons.audioElement.mic.micOn, micX, micY, pulsatingSize, pulsatingSize);
        } else {
            noStroke();
            image(this.#icons.audioElement.mic.micOff, micX, micY, micHeight, micWidth);
        }
    }

    //timer counter UI
    #looperRendering = () => {
        const { heightOffset, rightPositionOffset, looperPosition } = this.configuration;
        const {
            looperHeight, looperWidth, looperX, looperY
        } = looperPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        if (this.#isLooped) {
            noStroke();
            image(this.#icons.audioElement.loop.loop, looperX, looperY, looperHeight, looperWidth);
        } else {
            noStroke();
            image(this.#icons.audioElement.loop.noLoop, looperX, looperY, looperHeight, looperWidth);
        }
    }

    //timer counter UI
    #timerRendering = () => {
        const timeInSeconds = this.controls.duration().toFixed(2);
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = (timeInSeconds - (60 * minutes)).toFixed();
        const currentTimeInSeconds = this.controls.time().toFixed(2);
        const currentMinutes = Math.floor(currentTimeInSeconds / 60);
        const currentSeconds = (currentTimeInSeconds - (60 * currentMinutes)).toFixed();

        const { heightOffset, rightPositionOffset, timerPosition, progressBarPosition } = this.configuration;

        const {
            progressBarWidth
        } = progressBarPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        const {
            timerX, timerY, timerWidth, timerHeight
        } = timerPosition(width, height, heightOffset, this.#position, rightPositionOffset);

        textSize(16);
        fill(0);
        // total time
        text(minutes, timerX + 35, timerY + timerHeight + 5);
        text(":", timerX + 45, timerY + timerHeight + 5);
        text(seconds, timerX + 50, timerY + timerHeight + 5);
        // current time
        text(currentMinutes, timerX + progressBarWidth - 45, timerY + timerHeight + 5);
        text(":", timerX + progressBarWidth - 35, timerY + timerHeight + 5);
        text(currentSeconds, timerX + progressBarWidth - 30, timerY + timerHeight + 5);

        noStroke();
        image(this.#icons.audioElement.timer, timerX, timerY + 15, timerWidth, timerHeight);
        image(this.#icons.audioElement.currentTime, timerX + progressBarWidth - 80, timerY + 15, timerWidth, timerHeight);
    }

    //play control button UI
    #playControlRendering = () => {
        const { heightOffset, rightPositionOffset, playControlPosition } = this.configuration;

        const {
            playControlWidth, playControlHeight, playControlX, playControlY
        } = playControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        if (!this.isPlaying) {
            noStroke();
            image(this.#icons.audioElement.playBtn.releasedBtn, playControlX, playControlY, playControlWidth, playControlHeight);
        } else {
            noStroke();
            image(this.#icons.audioElement.playBtn.pressedBtn, playControlX, playControlY, playControlWidth, playControlHeight);
        }
    }

    //volume control button UI
    #volumeControlRendering = () => {
        const { heightOffset, rightPositionOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlHeight, volumeControlWidth, volumeControlX, volumeControlY, volumeControlIconHeight, volumeControlIconWidth
        } = volumeControlPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        let maxLines = (((volumeControlWidth - volumeControlIconWidth) / 2) - 100).toFixed();
        let initialXForSoundBar = volumeControlX;
        let initialYForSoundBar = volumeControlY + volumeControlHeight;

        for (let i = 0; i < maxLines; i++) {
            let x = map(i, 0, maxLines, 0, volumeControlWidth);
            let lineHeight = map(i, 0, maxLines, 0, volumeControlHeight);

            if (this.#volumeLevel !== 0) {
                if (i <= this.#currentVolumeLine) {
                    stroke("#8F9779");
                    line(initialXForSoundBar + x, initialYForSoundBar, initialXForSoundBar + x, initialYForSoundBar - lineHeight);
                    noStroke();
                } else {
                    stroke(0);
                    line(initialXForSoundBar + x, initialYForSoundBar, initialXForSoundBar + x, initialYForSoundBar - lineHeight);
                    noStroke();
                }
            } else {
                stroke(0);
                line(initialXForSoundBar + x, initialYForSoundBar, initialXForSoundBar + x, initialYForSoundBar - lineHeight);
                noStroke();
            }
        }

        if (this.#volumeLevel !== 0) {
            noStroke();
            image(this.#icons.audioElement.volume.volumeOn, volumeControlX, volumeControlY, volumeControlIconWidth, volumeControlIconHeight);
        } else {
            noStroke();
            image(this.#icons.audioElement.volume.volumeOff, volumeControlX, volumeControlY, volumeControlIconWidth, volumeControlIconHeight);
        }
    }

    #progressBarRendering = () => {
        const { heightOffset, rightPositionOffset, progressBarPosition } = this.configuration;

        const {
            progressBarHeight, progressBarWidth, progressBarX, progressBarY
        } = progressBarPosition(width, height, heightOffset, this.#position, rightPositionOffset)

        const spacing = this.peaks.length / progressBarWidth;
        const peakStep = Math.ceil(progressBarWidth / spacing);
        const progressBarSpacing = progressBarWidth / peakStep;

        let x1 = progressBarX - progressBarSpacing / 2;
        let x2 = progressBarX - progressBarSpacing / 2;

        let progressPos = map(this.controls.time(), 0, this.controls.duration(), 0, progressBarWidth);
        let progressStart = progressBarX;
        let currentProgress = progressStart + progressPos;

        const progressBarLength = Math.ceil(progressBarWidth);
        let currentPeakIndex = 0;


        fill(0);
        rect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        for (let i = 0; i < progressBarLength; i += progressBarSpacing) {

            let currentPeakValue = Math.abs(this.peaks[currentPeakIndex]) * 500;
            x1 += progressBarSpacing;
            let y1 = progressBarY + progressBarHeight;
            x2 += progressBarSpacing;
            let y2 = progressBarY + currentPeakValue;
            stroke(255);
            strokeWeight(3);
            line(x1, y1, x2, y2);
            noStroke();

            if (currentPeakIndex <= progressBarLength) {
                currentPeakIndex += peakStep;
            } else {
                currentPeakIndex = 0;
            }
        }


        if (this.isPlaying) {
            stroke("#FF0000");
            strokeWeight(3);
            line(progressStart + progressPos, progressBarY, progressStart + progressPos, progressBarY + progressBarHeight);
            noStroke();
        } else {
            stroke("#FFCCCC");
            strokeWeight(3);
            line(currentProgress, progressBarY, currentProgress, progressBarY + progressBarHeight);
            noStroke();
        }

    }


    #hideAudioElement() {
        this.controlsAreHidden = true;
    }

    #showAudioElement() {
        this.controlsAreHidden = false;
    }

    #createFrequencyFilters() {
        this.#bassFilter = new p5.LowPass();
        this.#lowMidFilter = new p5.LowPass();
        this.#heighMidFilter = new p5.LowPass();
        this.#trebleFilter = new p5.LowPass();
        this.#bassFilter.freq(this.#bassCutoff);
        this.#lowMidFilter.freq(this.#lowMidCutoff);
        this.#heighMidFilter.freq(this.#heighMidCutoff);
        this.#trebleFilter.freq(this.#trebleCutoff);
    }

    #createFileInput() {
        this.fileInput = createFileInput(this.#handleNewSongFile);
        this.fileInput.style("display", "none");
    }

    #setupRenderingProcessor() {
        this.#renderingProcessor = () => {
            if (this.controlsAreHidden) {
                return;
            } else {
                this.#playControlRendering();
                this.#progressBarRendering();
                this.#timerRendering();
                this.#volumeControlRendering();
                this.#adderRendering();
                this.#lowMidFreqRendering();
                this.#heighMidFreqRendering();
                this.#trebleFreqRendering();
                this.#bassFreqRendering();
                this.#micRendering();
                this.#looperRendering();
            }
        };
    }
}
