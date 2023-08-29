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
	#keyPressedEventObserver;
	#renderingProcessor;
	#icons;
	#soundSourceURL;
	audioElementRef;

	get mousePressed() {
		return this.#mousePressedEventObserver;
	}

	get keyPressed() {
		return this.#keyPressedEventObserver;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	/**
	 * @param { VisualisationController } visualisationController, 
	 */
	/**
	 * @param { string } soundSourceURL, 
	 */
	/**
	 * @param { icons } icons, 
	 */
	constructor(soundSourceURL, icons) {
		super();
		// Save preloaded icons reference
		this.#icons = icons;
		this.#soundSourceURL = soundSourceURL;

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


	#instantiateUiControls() {
		this.#playbackButton = new PlaybackButton(this.#audioElement.audioElementRef);
		this.#needlseUiOutput = new Needles(PI, TWO_PI);
		this.#controlPannel = new ControlPanel(this.#icons);
	}

	#instatiateAudioControls() {
		this.#audioElement = new AudioElement(this.#soundSourceURL);
		this.audioElementRef = this.#audioElement.audioElementRef;
	}

	#instatiateVisualisationControls() {
		this.#visualsMenu = new VisualsMenu(this.#visualisationController);
	}

	#instantiateVisualisations() {
		this.#visualisationController = new VisualisationController();
		this.#visualisationController.add(new Spectrum());
		this.#visualisationController.add(new WavePattern());
		this.#visualisationController.add(new WaveExample(drawingContext.canvas, this.audioElementRef.audioSourceNode));
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
		};

		//responds to keyboard presses
		//@param keycode the ascii code of the keypressed
		this.#keyPressedEventObserver = (keycode) => {
			this.#visualsMenu.keyPressed(keycode);
		};
	}

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => {
			//draw the selected visualisation
			this.#visualisationController.selectedVisual.draw();
			push();
			fill("white");
			stroke("black");
			strokeWeight(2);
			textSize(34);
			//control panel UI 
			this.#controlPannel.draw();
			//needles UI ouput
			this.#needlseUiOutput.draw();
			//playback button 
			this.#playbackButton.draw();
			//audio element
			this.#audioElement.draw();
			//only draw the menu if menu displayed is set to true.
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


