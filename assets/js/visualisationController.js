//container class for the visualisations
class VisualisationController extends P5 {

	#visuals = [];
	#selectedVisual;
	#renderingProcessor;

	get draw() {
		return this.#renderingProcessor;
	}

	get visuals() {
		return this.#visuals;
	}

	/**
	 * @param { string } name
	 */
	set visuals(name) {
		this.#visuals.push(name);
	}

	/**
	 * @param { string } name
	 */
	set selectedVisual(name) {
		for (var i = 0; i < this.visuals.length; i++) {
			if (name == this.visuals[i].name) {
				this.#selectedVisual = this.visuals[i];
			}
		}
	}

	get selectedVisual() {
		return this.#selectedVisual;
	}

	get add() {
		return this.#add;
	}

	constructor() {
		super();

		// Draws selected visualisation
		this.#setupRenderingProcessor();
	}

	/**
	 * @param { P5 } visualisation
	 */
	#add(visualisation) {
		this.visuals = visualisation;

		//if selectedVisual is null set the new visual as the 
		//current visualiation
		if (this.#selectedVisual == null) {
			this.selectedVisual = visualisation.name;
		}
	}

	#setupRenderingProcessor() {
		this.#renderingProcessor = () => {

			push();

			//draw the selected visualisation
			this.#selectedVisual.draw();

			pop();
		};
	}
}
