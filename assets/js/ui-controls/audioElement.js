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
    fileInput;
    waveAudioElement;
    currentAudioElement;
    isPlaying = false;
    volumeChanged = false;

    #p5audioElement;
    #p5audioControlsIsHidden = false;
    #waveControlsIsHidden = true;
    #controlsAreHidden = false;
    #volumeLevel = 1;
    #currentVolumeLine = 1;
    #lowMidFreqLevel = 0;
    #bassFilter;
    #lowMidFilter;
    #highMidFilter;
    #trebleFilter;
    #bassCutoff = 100;
    #lowMidCutoff = 400;
    #highMidCutoff = 1000;
    #trebleCutoff = 4000;
    #frequencyBins = ["bass", "lowMid", "highMid", "treble"];
    #sound;
    #icons;
    #renderingProcessor;

    static #configuration = {
        name: "spectrum",
        heightOffset: 0,
        timerPosition: (width, height, heightOffset) => {

            return {
                timerX: width / 20,
                timerY: (height - heightOffset) - 35,
                timerHeight: 32,
                timerWidth: 32,
            }
        },
        playControlPosition: (width, height, heightOffset) => {

            return {
                playControlX: (width / 54) - 10,
                playControlY: height - heightOffset / 1.14,
                playControlWidth: 32,
                playControlHeight: 32
            }
        },
        adderControlPosition: (width, height, heightOffset) => {

            return {
                adderX: (width / 9),
                adderY: height - heightOffset + 70,
                adderWidth: 32,
                adderHeight: 32
            }
        },
        freqControlPosition: (width, height, heightOffset) => {

            return {
                freqX: (width / 9),
                freqY: height - heightOffset + 140,
                freqWidth: 32,
                freqHeight: 32
            }
        },
        progressBarPosition: (width, height, heightOffset) => {

            return {
                progressBarX: width / 22,
                progressBarY: height - heightOffset + 20,
                progressBarWidth: (width / 6),
                progressBarHeight: heightOffset / 6
            }
        },
        volumeControlPosition: (width, height, heightOffset) => {

            return {
                volumeControlX: (width / 54) - 10,
                volumeControlY: height - heightOffset / 8,
                volumeControlIconWidth: heightOffset / 8,
                volumeControlIconHeight: heightOffset / 8,
                volumeControlWidth: (width / 6),
                volumeControlHeight: heightOffset / 6
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
        this.#createFileInput();
        this.#createFrequencyFilters();
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

    /**
     * @param { Number } level
     */
    setVolumeLevel(level) {
        return this.#setVolumeLevel(level);
    }

    setlowMidFreqLevel() {
        const currentY = mouseY.toFixed();
        const { heightOffset, freqControlPosition } = this.configuration;
        const {
            freqY, freqHeight
        } = freqControlPosition(width, height, heightOffset);

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

        if (currentY - (step * 3) <= upMiddle && this.#lowMidFreqLevel > lineStart) {
            this.#lowMidFreqLevel -= step;
            this.#lowMidCutoff -= degree;
            this.#lowMidFilter.set(this.#lowMidCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#lowMidFilter);
        } else if (currentY >= downMiddle && this.#lowMidFreqLevel < (lineEnd - (step * 3))) {
            this.#lowMidFreqLevel += step;
            this.#lowMidCutoff += degree;
            this.#lowMidFilter.set(this.#lowMidCutoff);
            this.currentAudioElement.disconnect();
            this.currentAudioElement.connect(this.#lowMidFilter);
        }

        if (currentY >= upMiddle && currentY <= downMiddle) {
            this.#lowMidFreqLevel = lineMiddle;
            this.#removeFilter(this.#lowMidFilter);
            this.#lowMidFilter = new p5.LowPass();
            this.#lowMidCutoff = 400;
            this.#lowMidFilter.freq(this.#lowMidCutoff);
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
                return this.#p5audioElement.time();
            };
            this.controls.duration = () => {
                return this.#p5audioElement.duration();
            };
            this.controls.setVolume = (level) => {
                return this.#p5audioElement.volume(level);
            };
            this.controls.getVolume = () => {
                return this.#p5audioElement.volume();
            };

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

    //checks for clicks on the songs adder button
    //@returns true if clicked false otherwise.
    static adderControlHitCheck() {
        const { heightOffset, adderControlPosition } = this.configuration;

        const {
            adderX, adderY, adderHeight, adderWidth
        } = adderControlPosition(width, height, heightOffset)

        if (mouseX > adderX &&
            mouseX < adderX + adderWidth &&
            mouseY > adderY && mouseY < adderY + adderHeight) {

            return true;
        }

        return false;
    };

    static lowMidFreqControlHitCheck() {
        const { heightOffset, freqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = freqControlPosition(width, height, heightOffset)

        if (mouseX > freqX &&
            mouseX < freqX + freqWidth &&
            mouseY > freqY + 5 && mouseY < freqY + freqHeight + 25) {

            return true;
        }

        return false;
    };

    //checks for clicks on volume icon.
    static volumeControlBarHitCheck() {
        const { heightOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlHeight, volumeControlWidth, volumeControlX, volumeControlY, volumeControlIconWidth
        } = volumeControlPosition(width, height, heightOffset)

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
    static volumeControlIconHitCheck() {
        const { heightOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlX, volumeControlY, volumeControlIconWidth, volumeControlIconHeight
        } = volumeControlPosition(width, height, heightOffset)

        const leftEdge = volumeControlX;
        const rightEdge = volumeControlX + volumeControlIconWidth;

        if (mouseX > leftEdge &&
            mouseX < rightEdge &&
            mouseY > volumeControlY && mouseY < volumeControlY + volumeControlIconHeight) {

            return true;
        }

        return false;
    };

    #setVolumeFromVolumeControl() {
        const { heightOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlWidth, volumeControlX, volumeControlIconWidth
        } = volumeControlPosition(width, height, heightOffset)

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
        const { heightOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlWidth, volumeControlIconWidth
        } = volumeControlPosition(width, height, heightOffset)

        let maxLines = (((volumeControlWidth - volumeControlIconWidth) / 2) - 100).toFixed();
        this.#volumeLevel = this.controls.getVolume();
        this.#currentVolumeLine = (maxLines * this.#volumeLevel).toFixed();

        this.controls.setVolume(this.#volumeLevel);
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
        if (file.type === 'audio') {

            if (this.isPlaying) {
                this.controls.stop();
            }

            sound = loadSound(file.file, () => {
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage(file);
                    navigator.serviceWorker.addEventListener('message', event => {

                        if (event.data) {

                            this.#sound = sound;
                            this.#createP5AudioControl(file.data);
                            this.#createWaveAudioControl(file.data);
                            this.#setCurrentAudioControls();
                            this.#setupRenderingProcessor();
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

    handleRecordingFromMic() {
        // const reader = new FileReader();
        // reader.onload = (event) => {
        //     localStorage.setItem("file", event.target.result);
        // }

        // const blob = new Blob([file.file], { type: file.type });

        // reader.readAsDataURL(blob);

        // // Extract the data portion (after the comma)
        // const data = dataURI.split(',')[1];

        // // Decode the base64-encoded data
        // const decodedData = atob(data);

        // // Convert the decoded data to a Uint8Array
        // const uint8Array = new Uint8Array(decodedData.length);
        // for (let i = 0; i < decodedData.length; i++) {
        // uint8Array[i] = decodedData.charCodeAt(i);
        // }


        // console.log(dataURItoBlob(localStorage.getItem("file")));
    }

    #freqRendering = () => {
        const { heightOffset, freqControlPosition } = this.configuration;

        const {
            freqX, freqY, freqHeight, freqWidth
        } = freqControlPosition(width, height, heightOffset);

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

        if (this.#lowMidFreqLevel) {
            noStroke();
            image(this.#icons.audioElement.frequencyChanger, freqX, this.#lowMidFreqLevel, freqHeight, freqWidth);
        } else {
            noStroke();
            image(this.#icons.audioElement.frequencyChanger, freqX, lineMiddle, freqHeight, freqWidth);
        }
    }

    #adderRendering = () => {
        const { heightOffset, adderControlPosition } = this.configuration;

        const {
            adderX, adderY, adderHeight, adderWidth
        } = adderControlPosition(width, height, heightOffset);

        noStroke();
        image(this.#icons.audioElement.adder, adderX, adderY, adderHeight, adderWidth);
    }

    //timer counter UI
    #timerRendering = () => {
        const timeInSeconds = this.controls.duration().toFixed(2);
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = (timeInSeconds - (60 * minutes)).toFixed();
        const currentTimeInSeconds = this.controls.time().toFixed(2);
        const currentMinutes = Math.floor(currentTimeInSeconds / 60);
        const currentSeconds = (currentTimeInSeconds - (60 * currentMinutes)).toFixed();

        const { heightOffset, timerPosition, progressBarPosition } = this.configuration;

        const {
            progressBarWidth
        } = progressBarPosition(width, height, heightOffset);

        const {
            timerX, timerY, timerWidth, timerHeight
        } = timerPosition(width, height, heightOffset);

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
        const { heightOffset, playControlPosition } = this.configuration;

        const {
            playControlWidth, playControlHeight, playControlX, playControlY
        } = playControlPosition(width, height, heightOffset)

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
        const { heightOffset, volumeControlPosition } = this.configuration;

        const {
            volumeControlHeight, volumeControlWidth, volumeControlX, volumeControlY, volumeControlIconHeight, volumeControlIconWidth
        } = volumeControlPosition(width, height, heightOffset)

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
        const { heightOffset, progressBarPosition } = this.configuration;

        const {
            progressBarHeight, progressBarWidth, progressBarX, progressBarY
        } = progressBarPosition(width, height, heightOffset)

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
        this.#highMidFilter = new p5.LowPass();
        this.#trebleFilter = new p5.LowPass();
        this.#bassFilter.freq(this.#bassCutoff);
        this.#lowMidFilter.freq(this.#lowMidCutoff);
        this.#highMidFilter.freq(this.#highMidCutoff);
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
                this.#freqRendering();
            }
        };
    }
}
