//container function for the visualisations
class VisualisationController {

	#visuals = [];
	#selectedVisual;

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

	constructor() { }

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
}
