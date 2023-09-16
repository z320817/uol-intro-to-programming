//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class InputOutputController extends P5 {

	#visualisationController;
	#controlPannel;
	#playbackButton;
	#fullScreenButton;
	#visualsMenu;
	#needlseUiOutput;
	#leftAudioElement;
	#rightAudioElement;
	#currentAudioElement;
	#mousePressedEventObserver;
	#mouseReleasedEventObserver;
	#keyPressedEventObserver;
	#spektrumVisualisation;
	#waveVisualisation;
	#waveExampleVisualisation;
	#isFullScreen = false;
	#sound;
	#icons;
	#position;
	#renderingProcessor;

	get mousePressed() {
		return this.#mousePressedEventObserver;
	}

	get mouseReleased() {
		return this.#mouseReleasedEventObserver;
	}

	get keyPressed() {
		return this.#keyPressedEventObserver;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get currentAudioElement() {
		return this.#currentAudioElement;
	}

	/**
	 * @param { position } position, 
	 */
	/**
	 * @param { sound } sound, 
	 */
	/**
	 * @param { icons } icons, 
	 */
	constructor(sound, icons, position) {
		super();
		// Save preloaded icons reference
		this.#icons = icons;
		this.#sound = sound;
		this.#position = position;

		// Instatiate audio controls
		this.#instatiateAudioControls();

		// Set cuurent audio element
		this.#setCurrentAudioElement(position.left);

		// Instatiate ui controls
		this.#instantiateUiControls();

		// Instatiate visualisations
		this.#instantiateVisualisations();

		// Instatiate visualisation controls
		this.#instatiateVisualisationControls();

		// Creates event observers and handlers
		this.#setupEventObservers();

		// Draws the playback button and potentially the menu
		this.#setupRenderingProcessor();
	}

	#instatiateAudioControls() {
		this.#leftAudioElement = new AudioElement(this.#sound, this.#icons, this.#position.left);
		this.#rightAudioElement = new AudioElement(this.#sound, this.#icons, this.#position.right);
	}

	#instantiateUiControls() {
		this.#playbackButton = new PlaybackButton(this.#currentAudioElement);
		this.#fullScreenButton = new FullScreenButton(this.#isFullScreen, this.#icons);
		this.#needlseUiOutput = new Needles(PI, TWO_PI, this.#currentAudioElement);
		this.#controlPannel = new ControlPanel(this.#icons);
	}

	#instantiateVisualisations() {
		this.#visualisationController = new VisualisationController();
		this.#spektrumVisualisation = new Spectrum(this.#currentAudioElement, this.#icons);
		this.#waveVisualisation = new WavePattern(this.#currentAudioElement, this.#icons);
		this.#waveExampleVisualisation = new WaveExample(this.#currentAudioElement, this.#icons);
		this.#visualisationController.add(this.#spektrumVisualisation);
		this.#visualisationController.add(this.#waveVisualisation);
		this.#visualisationController.add(this.#waveExampleVisualisation);
	}

	#instatiateVisualisationControls() {
		this.#visualsMenu = new VisualsMenu(this.#visualisationController);
	}

	#setCurrentAudioElement(position) {
		if (position === this.#position.left) {
			this.#currentAudioElement = this.#leftAudioElement;
		} else {
			this.#currentAudioElement = this.#rightAudioElement;
		}
	}

	#setupEventObservers() {
		//make the window fullscreen or revert to windowed
		this.#mousePressedEventObserver = () => {

			if (this.#controlPannel.rightAudioElementHitCheck()) {
				this.#setCurrentAudioElement(position.right);
			}

			if (this.#controlPannel.leftAudioElementHitCheck()) {
				this.#setCurrentAudioElement(position.left)
			}

			if (this.#playbackButton.hitCheck()) {
				this.#playbackButton.playSound();
			}

			if (this.#fullScreenButton.hitCheck()) {
				this.#isFullScreen = !this.#isFullScreen;
				this.#fullScreenButton.setFullScreen(this.#isFullScreen);
				fullscreen(this.#isFullScreen);
				this.#waveVisualisation.setFullScreen(this.#isFullScreen)
			}

			if (this.#controlPannel.visualButtonHitCheck()) {
				this.#leftAudioElement.hide();
				this.#rightAudioElement.hide();
				this.#visualsMenu.show();
			}

			if (this.#controlPannel.musicButtonHitCheck()) {
				this.#leftAudioElement.show();
				this.#rightAudioElement.show();
				this.#visualsMenu.hide();
			}

			if (this.#visualsMenu.controlsDisplayed) {
				if (this.#spektrumVisualisation.iconHitCheck()) {
					this.#spektrumVisualisation.setIsEnabled();
				}

				if (this.#spektrumVisualisation.blueControlHitCheck()) {
					this.#spektrumVisualisation.setBlueLevel();
				}

				if (this.#spektrumVisualisation.redControlHitCheck()) {
					this.#spektrumVisualisation.setRedLevel();
				}

				if (this.#spektrumVisualisation.greenControlHitCheck()) {
					this.#spektrumVisualisation.setGreenLevel();
				}
			}

			if (!this.#visualsMenu.controlsDisplayed) {
				if (this.#currentAudioElement.playControlHitCheck()) {
					if (!this.#currentAudioElement.isPlaying) {
						this.#currentAudioElement.controls.play();
						this.#currentAudioElement.setVolumeLevel(true);
					} else {
						this.#currentAudioElement.controls.pause();
						this.#currentAudioElement.setVolumeLevel(true);
					}
				}

				if (this.#currentAudioElement.volumeControlBarHitCheck()) {
					this.#currentAudioElement.volumeChanged = true;
					this.#currentAudioElement.setVolumeLevel();
				}

				if (this.#currentAudioElement.volumeControlIconHitCheck()) {
					const isMuted = !Boolean(this.#currentAudioElement.controls.getVolume());

					if (isMuted) {
						this.#currentAudioElement.controls.setVolume(1);
						this.#currentAudioElement.setVolumeLevel(true);
					} else {
						this.#currentAudioElement.controls.setVolume(0);
						this.#currentAudioElement.setVolumeLevel(true);
					}
				}

				if (this.#currentAudioElement.adderControlHitCheck()) {
					this.#currentAudioElement.fileInput.elt.click();
				}

				if (this.#currentAudioElement.looperControlHitCheck()) {
					this.#currentAudioElement.setIsLooped();
				}

				if (this.#currentAudioElement.lowMidFreqControlHitCheck()) {
					this.#currentAudioElement.setLowMidFreqLevel();
				}

				if (this.#currentAudioElement.bassFreqControlHitCheck()) {
					this.#currentAudioElement.setBassFreqLevel();
				}

				if (this.#currentAudioElement.heighMidFreqControlHitCheck()) {
					this.#currentAudioElement.setHeighMidFreqLevel();
				}

				if (this.#currentAudioElement.trebleFreqControlHitCheck()) {
					this.#currentAudioElement.setTrebleMidFreqLevel();
				}

				if (this.#currentAudioElement.micControlHitCheck()) {
					this.#currentAudioElement.setRecordInProgress();
				}
			}
		};

		// this response to mouse release events
		this.#mouseReleasedEventObserver = () => {
			if (this.#currentAudioElement.volumeControlBarHitCheck()) {
				this.#currentAudioElement.volumeChanged = false;
			}
		}

		//responds to keyboard presses
		//@param keycode the ascii code of the keypressed
		this.#keyPressedEventObserver = (keycode) => {
			this.#visualsMenu.keyPressed(keycode);
		};
	}

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => {
			push();
			fill("white");
			stroke("black");
			strokeWeight(2);
			textSize(34);

			// playback button 
			this.#playbackButton.draw();

			// full screen button
			this.#fullScreenButton.draw();

			//draw the selected visualisation
			this.#visualisationController.draw();


			if (!this.#isFullScreen) {
				// control panel UI 
				this.#controlPannel.draw();

				// needles UI ouput
				this.#needlseUiOutput.draw();

				// audio elements
				this.#leftAudioElement.draw();
				this.#rightAudioElement.draw();

				if (this.#visualsMenu.controlsDisplayed) {
					this.#visualsMenu.draw();
				}
			}

			pop();
		};
	}
}


