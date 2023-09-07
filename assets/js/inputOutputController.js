//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class InputOutputController extends P5 {

	#visualisationController;
	#controlPannel;
	#playbackButton;
	#visualsMenu;
	#needlseUiOutput;
	#audioElement;
	#mousePressedEventObserver;
	#mouseReleasedEventObserver;
	#keyPressedEventObserver;
	#sound;
	#icons;
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

	/**
	 * @param { sound } sound, 
	 */
	/**
	 * @param { icons } icons, 
	 */
	constructor(sound, icons) {
		super();
		// Save preloaded icons reference
		this.#icons = icons;
		this.#sound = sound;

		// Instatiate audio controls
		this.#instatiateAudioControls();

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
		this.#audioElement = new AudioElement(this.#sound, this.#icons);
	}

	#instantiateUiControls() {
		this.#playbackButton = new PlaybackButton(this.#audioElement);
		this.#needlseUiOutput = new Needles(PI, TWO_PI, this.#audioElement);
		this.#controlPannel = new ControlPanel(this.#icons);
	}

	#instantiateVisualisations() {
		this.#visualisationController = new VisualisationController();
		this.#visualisationController.add(new Spectrum(this.#audioElement));
		this.#visualisationController.add(new WavePattern(this.#audioElement));
		this.#visualisationController.add(new WaveExample(drawingContext.canvas, this.#audioElement));
	}

	#instatiateVisualisationControls() {
		this.#visualsMenu = new VisualsMenu(this.#visualisationController);
	}

	#setupEventObservers() {
		//make the window fullscreen or revert to windowed
		this.#mousePressedEventObserver = () => {

			if (!this.#playbackButton.hitCheck()) {
				// var fs = fullscreen();
				// fullscreen(!fs);
			}

			if (this.#controlPannel.visualButtonHitCheck()) {
				this.#audioElement.hide();
				this.#visualsMenu.show();
			}

			if (this.#controlPannel.musicButtonHitCheck()) {
				this.#audioElement.show();
				this.#visualsMenu.hide();
			}

			if (this.#audioElement.playControlHitCheck()) {
				if (!this.#audioElement.isPlaying) {
					this.#audioElement.controls.play();
					this.#audioElement.setVolumeLevel(true);
				} else {
					this.#audioElement.controls.pause();
					this.#audioElement.setVolumeLevel(true);
				}
			}

			if (this.#audioElement.volumeControlBarHitCheck()) {
				this.#audioElement.volumeChanged = true;
				this.#audioElement.setVolumeLevel();
			}

			if (this.#audioElement.volumeControlIconHitCheck()) {
				const isMuted = !Boolean(this.#audioElement.controls.getVolume());

				if (isMuted) {
					this.#audioElement.controls.setVolume(1);
					this.#audioElement.setVolumeLevel(true);
				} else {
					this.#audioElement.controls.setVolume(0);
					this.#audioElement.setVolumeLevel(true);
				}
			}
		};

		// this response to mouse release events
		this.#mouseReleasedEventObserver = () => {
			if (this.#audioElement.volumeControlBarHitCheck()) {
				this.#audioElement.volumeChanged = false;
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

			// control panel UI 
			this.#controlPannel.draw();

			// needles UI ouput
			this.#needlseUiOutput.draw();

			// playback button 
			this.#playbackButton.draw();

			// audio element
			this.#audioElement.draw();

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


