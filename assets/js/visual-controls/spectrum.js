class Spectrum extends P5 {

	#icons;
	#audioElement;
	#isEnabled = true;
	#renderingProcessor;
	#blueLevel = 0;
	#blueLevelPosition = 0;
	#redLevel = 0;
	#redLevelPosition = 0;

	static #configuration = {
		name: "spectrum",
		heightOffset: 0,
		lowerBorder: 0,
		rightPositionOffset: 0,
		spectrumRedControlPosition: (width, height, heightOffset) => {
			return {
				spectrumControlY: (height - heightOffset) + 80,
				spectrumControlX: (width / 18),
				spectrumControlHeight: 32,
				spectrumControlWidth: 32,
			}
		},
		spectrumBlueControlPosition: (width, height, heightOffset) => {
			return {
				blueControlY: (height - heightOffset) + 80,
				blueControlX: (width / 18),
				blueControlHeight: 32,
				blueControlWidth: 32,
			}
		},
		spectrumIconPosition: (width, height, heightOffset) => {
			return {
				spectrumControlIconX: width / 12,
				spectrumControlIconY: height - heightOffset,
				spectrumControlIconHeight: 32,
				spectrumControlIconWidth: 32,
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
		const { heightOffset, spectrumBlueControlPosition } = this.configuration;

		const { blueControlX, blueControlY, blueControlHeight, blueControlWidth } = spectrumBlueControlPosition(width, height, heightOffset);

		if (mouseX > blueControlX &&
			mouseX < blueControlX + blueControlWidth &&
			mouseY > blueControlY + 5 && mouseY < blueControlY + blueControlHeight + 25) {

			return true;
		}

		return false;
	}

	#iconHitCheck() {
		const { heightOffset, spectrumIconPosition } = this.configuration;

		const { spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth } = spectrumIconPosition(width, height, heightOffset);

		if (mouseX > spectrumControlIconX &&
			mouseX < spectrumControlIconX + spectrumControlIconWidth &&
			mouseY > spectrumControlIconY && mouseY < spectrumControlIconY + spectrumControlIconHeight) {

			return true;
		}

		return false;
	}

	#setupControllRendering() {
		this.#iconRendering();
		this.#blueLevelControlRendering();
	}

	#iconRendering() {
		push();
		const { heightOffset, spectrumIconPosition } = this.configuration;

		const { spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth } = spectrumIconPosition(width, height, heightOffset);

		noStroke();
		textSize(14);
		fill(0);
		text(this.configuration.name, spectrumControlIconX - (spectrumControlIconWidth / 2), spectrumControlIconY + (spectrumControlIconWidth * 1.5));

		if (this.#isEnabled) {
			image(this.#icons.visualisation.spectrum.on, spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth);
		} else {
			image(this.#icons.visualisation.spectrum.off, spectrumControlIconX, spectrumControlIconY, spectrumControlIconHeight, spectrumControlIconWidth);
		}
		pop();
	}

	#blueLevelControlRendering = () => {
		push();
		const { heightOffset, spectrumBlueControlPosition, spectrumControlConfiguration } = this.configuration;

		const { blueControlX, blueControlY, blueControlHeight, blueControlWidth } = spectrumBlueControlPosition(width, height, heightOffset);

		const {
			lineMiddle
		} = spectrumControlConfiguration(blueControlY, blueControlHeight, this.#blueLevelPosition);

		noStroke();
		textSize(14);

		if (this.#isEnabled) {
			fill(0, 0, 255);
			text("Blue", blueControlX, blueControlY);
		} else {
			fill(150, 150, 150);
			text("Blue", blueControlX, blueControlY);
		}


		strokeWeight(3);
		stroke(0);
		line(blueControlX + (blueControlWidth / 2), blueControlY + 5, blueControlX + (blueControlWidth / 2), blueControlY + blueControlHeight + 25);

		if (this.#blueLevelPosition !== 0 && this.#blueLevelPosition < lineMiddle) {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChangerUp, blueControlX, this.#blueLevelPosition, blueControlHeight, blueControlWidth);
			noStroke();
		} else if (this.#blueLevelPosition !== 0 && this.#blueLevelPosition > lineMiddle) {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChangerDown, blueControlX, this.#blueLevelPosition, blueControlHeight, blueControlWidth);
			noStroke();
		}
		else {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChanger, blueControlX, lineMiddle, blueControlHeight, blueControlWidth);
			noStroke();
		}
		pop();
	}


	#setBlueLevel() {
		if (this.#isEnabled) {
			const currentY = mouseY.toFixed();

			const { heightOffset, spectrumBlueControlPosition, spectrumControlConfiguration } = this.configuration;

			const { blueControlY, blueControlHeight } = spectrumBlueControlPosition(width, height, heightOffset);

			const {
				lineStart, lineEnd, lineMiddle, upMiddle, downMiddle, step
			} = spectrumControlConfiguration(blueControlY, blueControlHeight, this.#blueLevelPosition);

			if (!this.#blueLevelPosition) {
				this.#blueLevelPosition = lineMiddle;
			}

			if (!this.#blueLevel) {
				this.#blueLevel = 150;
			}

			if (currentY - 20 <= upMiddle && this.#blueLevelPosition > lineStart) {
				this.#blueLevel += step;
				this.#blueLevelPosition -= 2;
			} else if (currentY >= downMiddle && this.#blueLevelPosition < lineEnd - 20) {
				this.#blueLevel -= step;
				this.#blueLevelPosition += 2;
			}

			if (this.#blueLevelPosition <= downMiddle && this.#blueLevelPosition >= upMiddle) {
				this.#blueLevel = 0;
				this.#blueLevelPosition = lineMiddle;
			}
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