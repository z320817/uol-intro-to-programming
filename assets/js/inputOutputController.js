//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class InputOutputController extends P5 {

	#playbackButton;
	#visualsMenu;
	#needlseUiOutput;
	#controlPannel;
	#audioElement;
	#mousePressedEventObserver;
	#keyPressedEventObserver;
	#renderingProcessor;

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
	constructor(visualisationController, soundSourceURL) {
		super();
		this.#instantiateUiControls(visualisationController, soundSourceURL);
		this.#setupEventObservers();
		//draws the playback button and potentially the menu
		this.#setupRenderingProcessor();
	}

	/**
	 * @param { VisualisationController } visualisationController, 
	 */
	/**
	 * @param { string } soundSourceURL, 
	 */
	#instantiateUiControls(visualisationController, soundSourceURL) {
		this.#audioElement = new AudioElement(soundSourceURL);
		this.#playbackButton = new PlaybackButton(this.#audioElement.audioElementRef);
		this.#visualsMenu = new VisualsMenu(visualisationController);
		this.#needlseUiOutput = new Needles(PI, TWO_PI);
		this.#controlPannel = new ControlPanel();
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


