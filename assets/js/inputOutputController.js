//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class InputOutputController extends P5 {

	#visualisationController;
	#controlPannel;
	#playbackButton;
	#visualsMenu;
	#needlseUiOutput;
	#leftAudioElement;
	#rightAudioElement;
	#currentAudioElement;
	#mousePressedEventObserver;
	#mouseReleasedEventObserver;
	#keyPressedEventObserver;
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
		this.#playbackButton = new PlaybackButton(this.#leftAudioElement);
		this.#needlseUiOutput = new Needles(PI, TWO_PI, this.#leftAudioElement);
		this.#controlPannel = new ControlPanel(this.#icons);
	}

	#instantiateVisualisations() {
		this.#visualisationController = new VisualisationController();
		this.#visualisationController.add(new Spectrum(this.#leftAudioElement));
		this.#visualisationController.add(new WavePattern(this.#leftAudioElement));
		this.#visualisationController.add(new WaveExample(drawingContext.canvas, this.#leftAudioElement));
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

			if (!this.#playbackButton.hitCheck()) {
				// var fs = fullscreen();
				// fullscreen(!fs);
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
			this.#leftAudioElement.draw();

			push();
			fill("white");
			stroke("black");
			strokeWeight(2);
			textSize(34);

			// control panel UI 
			this.#controlPannel.draw();

			// needles UI ouput
			this.#needlseUiOutput.draw();

			// playback button 
			this.#playbackButton.draw();

			// audio elements
			this.#leftAudioElement.draw();
			this.#rightAudioElement.draw();

			//draw the selected visualisation
			this.#visualisationController.draw();

			// only draw the menu if menu displayed is set to true.
			if (this.#visualsMenu.menuDisplayed) {

				text("Select a visualisation:", 100, 30);
				this.#visualsMenu.menu();
			}

			if (this.#visualsMenu.controlsDisplayed) {

				text("Select a visualisation:", 100, 700);
				this.#visualsMenu.controls();
			}
			pop();
		};
	}
}


