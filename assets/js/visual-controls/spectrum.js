class Spectrum extends P5 {

	#icons;
	#audioElement;
	#isEnabled = true;
	#renderingProcessor;
	#blueLevel = 0;
	#blueLevelPosition = 0;

	static #configuration = {
		name: "spectrum",
		heightOffset: 0,
		lowerBorder: 0,
		rightPositionOffset: 0,
		spectrumControlPosition: (width, height, heightOffset) => {
			return {
				spectrumControlIconX: width / 12,
				spectrumControlIconY: height - heightOffset,
				spectrumControlIconHeight: 32,
				spectrumControlIconWidth: 32,
				spectrumControlY: (height - heightOffset) + 80,
				spectrumControlX: (width / 12) - 20,
				spectrumControlHeight: 32,
				spectrumControlWidth: 32,
			}
		},
		spectrumControlConfiguration: (spectrumControlY, spectrumControlHeight, blueLevel) => {
			const lineStart = Number(spectrumControlY.toFixed()) + 5;
			const lineEnd = Number(spectrumControlY.toFixed()) + spectrumControlHeight + 25;
			const lineLength = lineEnd - lineStart;
			const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - spectrumControlHeight / 2;
			const upMiddle = lineMiddle - 1;
			const downMiddle = lineMiddle + 1;
			const step = Number((blueLevel / lineLength).toFixed());

			return { lineStart, lineEnd, lineMiddle, upMiddle, downMiddle, step };
		}
	}

	get controlHitCheck() {
		return this.#controlHitCheck;
	}

	get iconHitCheck() {
		return this.#iconHitCheck;
	}

	get setBlueLevel() {
		return this.#setBlueLevel;
	}

	get configuration() {
		return Spectrum.#configuration;
	}

	get name() {
		return Spectrum.#configuration.name;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get onResize() {
		return Spectrum.onResize;
	}

	/**
	 * @param { icons } icons, 
	 */
	/**
	 * @param { AudioElement } currentAudioElement, 
	 */
	constructor(currentAudioElement, icons) {
		super();

		this.#icons = icons;
		this.#audioElement = currentAudioElement;

		//set initial position of elements
		this.onResize();

		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = height / 4;
		this.configuration.lowerBorder = Number((height - (height / 2.5)).toFixed(0));
	};

	controlRendering() {
		return this.#setupControllRendering();
	}

	setIsEnabled() {
		this.#isEnabled = !this.#isEnabled;
	}

	#controlHitCheck() {
		const { heightOffset, spectrumControlPosition } = this.configuration;

		const { spectrumControlX, spectrumControlY, spectrumControlHeight, spectrumControlWidth } = spectrumControlPosition(width, height, heightOffset);

		if (mouseX > spectrumControlX &&
			mouseX < spectrumControlX + spectrumControlWidth &&
			mouseY > spectrumControlY + 5 && mouseY < spectrumControlY + spectrumControlHeight + 25) {

			return true;
		}

		return false;
	}

	#iconHitCheck() {
		const { heightOffset, spectrumControlPosition } = this.configuration;

		const { spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth } = spectrumControlPosition(width, height, heightOffset);

		if (mouseX > spectrumControlIconX &&
			mouseX < spectrumControlIconX + spectrumControlIconWidth &&
			mouseY > spectrumControlIconY && mouseY < spectrumControlIconY + spectrumControlIconHeight) {

			return true;
		}

		return false;
	}

	#setupControllRendering() {
		push();
		const { heightOffset, spectrumControlPosition } = this.configuration;

		const { spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth } = spectrumControlPosition(width, height, heightOffset);

		noStroke();
		if (this.#isEnabled) {
			image(this.#icons.visualisation.spectrum.on, spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth);
		} else {
			image(this.#icons.visualisation.spectrum.off, spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth);
		}

		this.#colorLevelControlRendering();
		pop();
	}

	#setBlueLevel() {
		if (this.#isEnabled) {
			const currentY = mouseY.toFixed();

			const { heightOffset, spectrumControlPosition, spectrumControlConfiguration } = this.configuration;

			const { spectrumControlY, spectrumControlHeight } = spectrumControlPosition(width, height, heightOffset);

			const {
				lineStart, lineEnd, lineMiddle, upMiddle, downMiddle, step
			} = spectrumControlConfiguration(spectrumControlY, spectrumControlHeight, this.#blueLevelPosition);

			if (!this.#blueLevelPosition) {
				this.#blueLevelPosition = lineMiddle;
			}

			if (!this.#blueLevel) {
				this.#blueLevel = 150;
			}

			if (currentY - 20 <= upMiddle && this.#blueLevelPosition > lineStart) {
				this.#blueLevel -= step;
				this.#blueLevelPosition -= 2;
			} else if (currentY >= downMiddle && this.#blueLevelPosition < lineEnd - 20) {
				this.#blueLevel += step;
				this.#blueLevelPosition += 2;
			}

			if (this.#blueLevelPosition <= downMiddle && this.#blueLevelPosition >= upMiddle) {
				this.#blueLevel = 0;
				this.#blueLevelPosition = lineMiddle;
			}
		}
	}

	#colorLevelControlRendering = () => {

		const { heightOffset, spectrumControlPosition, spectrumControlConfiguration } = this.configuration;

		const { spectrumControlX, spectrumControlIconX, spectrumControlIconY, spectrumControlY, spectrumControlHeight, spectrumControlWidth } = spectrumControlPosition(width, height, heightOffset);

		const {
			lineMiddle
		} = spectrumControlConfiguration(spectrumControlY, spectrumControlHeight, this.#blueLevelPosition);

		textSize(14);
		fill(0);
		text(this.configuration.name, spectrumControlIconX - (spectrumControlWidth / 2), spectrumControlIconY + (spectrumControlWidth * 1.5));

		strokeWeight(3);
		stroke(0);
		line(spectrumControlX + (spectrumControlWidth / 2), spectrumControlY + 5, spectrumControlX + (spectrumControlWidth / 2), spectrumControlY + spectrumControlHeight + 25);

		if (this.#blueLevelPosition !== 0 && this.#blueLevelPosition < lineMiddle) {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChangerUp, spectrumControlX, this.#blueLevelPosition, spectrumControlHeight, spectrumControlWidth);
			noStroke();
		} else if (this.#blueLevelPosition !== 0 && this.#blueLevelPosition > lineMiddle) {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChangerDown, spectrumControlX, this.#blueLevelPosition, spectrumControlHeight, spectrumControlWidth);
			noStroke();
		}
		else {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChanger, spectrumControlX, lineMiddle, spectrumControlHeight, spectrumControlWidth);
			noStroke();
		}
	}

	#setupRenderingProcessor() {
		const { lowerBorder } = this.configuration;

		this.#renderingProcessor = () => {
			push();

			var spectrum = this.#audioElement.fourier.analyze();
			noStroke();

			for (var i = 0; i < spectrum.length; i++) {

				//fade the colour of the bin from green to red
				var g = map(spectrum[i], 0, 255, 255, 0);
				fill(spectrum[i], g, this.#blueLevel);

				//draw each bin as a rectangle from the left of the screen
				//across
				var y = map(i, 0, spectrum.length, 0, lowerBorder);
				var w = map(spectrum[i], 0, 255, 0, width);

				rect(0, y, w, height / spectrum.length);
			}
			pop();
		};
	}
}