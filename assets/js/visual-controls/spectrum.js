class Spectrum extends P5 {

	#icons;
	#isFullScreen;
	#audioElement;
	#isEnabled = true;
	#blueLevel = 0;
	#blueLevelPosition = 0;
	#redLevel = 0;
	#redLevelPosition = 0;
	#greenLevel = 0;
	#greenLevelPosition = 0;
	#renderingProcessor;

	static #configuration = {
		name: "spectrum",
		heightOffset: 0,
		lowerBorder: 0,
		spectrumRedControlPosition: (width, height, heightOffset) => {
			return {
				redControlY: (height - heightOffset) + 80,
				redControlX: (width / 12),
				redControlHeight: 32,
				redControlWidth: 32,
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
		spectrumGreenControlPosition: (width, height, heightOffset) => {
			return {
				greenControlY: (height - heightOffset) + 80,
				greenControlX: (width / 9),
				greenControlHeight: 32,
				greenControlWidth: 32,
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

	get blueControlHitCheck() {
		return this.#blueControlHitCheck;
	}

	get redControlHitCheck() {
		return this.#redControlHitCheck;
	}

	get greenControlHitCheck() {
		return this.#greenControlHitCheck;
	}

	get iconHitCheck() {
		return this.#iconHitCheck;
	}

	get setBlueLevel() {
		return this.#setBlueLevel;
	}

	get setRedLevel() {
		return this.#setRedLevel;
	}

	get setGreenLevel() {
		return this.#setGreenLevel;
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
		if (this.#isFullScreen) {
			this.configuration.heightOffset = (height / 4);
		}
		this.configuration.lowerBorder = height + (height / 2.5);
	};

	/**
	 * @param { boolean } isFullScreen, 
	 */
	setFullScreen(isFullScreen) {
		this.#isFullScreen = isFullScreen;
		this.onResize();
	}

	controlRendering() {
		return this.#setupControllRendering();
	}

	setIsEnabled() {
		this.#isEnabled = !this.#isEnabled;
	}

	#redControlHitCheck() {
		const { heightOffset, spectrumRedControlPosition } = this.configuration;

		const { redControlX, redControlY, redControlHeight, redControlWidth } = spectrumRedControlPosition(width, height, heightOffset);

		if (mouseX > redControlX &&
			mouseX < redControlX + redControlWidth &&
			mouseY > redControlY + 5 && mouseY < redControlY + redControlHeight + 25) {

			return true;
		}

		return false;
	}

	#blueControlHitCheck() {
		const { heightOffset, spectrumBlueControlPosition } = this.configuration;

		const { blueControlX, blueControlY, blueControlHeight, blueControlWidth } = spectrumBlueControlPosition(width, height, heightOffset);

		if (mouseX > blueControlX &&
			mouseX < blueControlX + blueControlWidth &&
			mouseY > blueControlY + 5 && mouseY < blueControlY + blueControlHeight + 25) {

			return true;
		}

		return false;
	}

	#greenControlHitCheck() {
		const { heightOffset, spectrumGreenControlPosition } = this.configuration;

		const { greenControlX, greenControlY, greenControlHeight, greenControlWidth } = spectrumGreenControlPosition(width, height, heightOffset);

		if (mouseX > greenControlX &&
			mouseX < greenControlX + greenControlWidth &&
			mouseY > greenControlY + 5 && mouseY < greenControlY + greenControlHeight + 25) {

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
		this.#redLevelControlRendering();
		this.#greenLevelControlRendering();
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

	#redLevelControlRendering = () => {
		push();
		const { heightOffset, spectrumRedControlPosition, spectrumControlConfiguration } = this.configuration;

		const { redControlX, redControlY, redControlHeight, redControlWidth } = spectrumRedControlPosition(width, height, heightOffset);

		const {
			lineMiddle
		} = spectrumControlConfiguration(redControlY, redControlHeight, this.#redLevelPosition);

		noStroke();
		textSize(14);

		if (this.#isEnabled) {
			fill(255, 0, 0);
			text("Red", redControlX, redControlY);
		} else {
			fill(150, 150, 150);
			text("Red", redControlX, redControlY);
		}


		strokeWeight(3);
		stroke(0);
		line(redControlX + (redControlWidth / 2), redControlY + 5, redControlX + (redControlWidth / 2), redControlY + redControlHeight + 25);

		if (this.#redLevelPosition !== 0 && this.#redLevelPosition < lineMiddle) {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChangerUp, redControlX, this.#redLevelPosition, redControlHeight, redControlWidth);
			noStroke();
		} else if (this.#redLevelPosition !== 0 && this.#redLevelPosition > lineMiddle) {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChangerDown, redControlX, this.#redLevelPosition, redControlHeight, redControlWidth);
			noStroke();
		}
		else {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChanger, redControlX, lineMiddle, redControlHeight, redControlWidth);
			noStroke();
		}
		pop();
	}

	#greenLevelControlRendering = () => {
		push();
		const { heightOffset, spectrumGreenControlPosition, spectrumControlConfiguration } = this.configuration;

		const { greenControlX, greenControlY, greenControlHeight, greenControlWidth } = spectrumGreenControlPosition(width, height, heightOffset);

		const {
			lineMiddle
		} = spectrumControlConfiguration(greenControlY, greenControlHeight, this.#greenLevelPosition);

		noStroke();
		textSize(14);

		if (this.#isEnabled) {
			fill(0, 255, 0);
			text("Green", greenControlX, greenControlY);
		} else {
			fill(150, 150, 150);
			text("Green", greenControlX, greenControlY);
		}


		strokeWeight(3);
		stroke(0);
		line(greenControlX + (greenControlWidth / 2), greenControlY + 5, greenControlX + (greenControlWidth / 2), greenControlY + greenControlHeight + 25);

		if (this.#greenLevelPosition !== 0 && this.#greenLevelPosition < lineMiddle) {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChangerUp, greenControlX, this.#greenLevelPosition, greenControlHeight, greenControlWidth);
			noStroke();
		} else if (this.#greenLevelPosition !== 0 && this.#greenLevelPosition > lineMiddle) {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChangerDown, greenControlX, this.#greenLevelPosition, greenControlHeight, greenControlWidth);
			noStroke();
		}
		else {
			stroke(0);
			strokeWeight(5);
			image(this.#icons.audioElement.frequencyChanger.frequencyChanger, greenControlX, lineMiddle, greenControlHeight, greenControlWidth);
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

	#setRedLevel() {
		if (this.#isEnabled) {
			const currentY = mouseY.toFixed();

			const { heightOffset, spectrumRedControlPosition, spectrumControlConfiguration } = this.configuration;

			const { redControlY, redControlHeight } = spectrumRedControlPosition(width, height, heightOffset);

			const {
				lineStart, lineEnd, lineMiddle, upMiddle, downMiddle, step
			} = spectrumControlConfiguration(redControlY, redControlHeight, this.#redLevelPosition);

			if (!this.#redLevelPosition) {
				this.#redLevelPosition = lineMiddle;
			}

			if (!this.#redLevel) {
				this.#redLevel = 150;
			}

			if (currentY - 20 <= upMiddle && this.#redLevelPosition > lineStart) {
				this.#redLevel += step;
				this.#redLevelPosition -= 2;
			} else if (currentY >= downMiddle && this.#redLevelPosition < lineEnd - 20) {
				this.#redLevel -= step;
				this.#redLevelPosition += 2;
			}

			if (this.#redLevelPosition <= downMiddle && this.#redLevelPosition >= upMiddle) {
				this.#redLevel = 0;
				this.#redLevelPosition = lineMiddle;
			}
		}
	}

	#setGreenLevel() {
		if (this.#isEnabled) {
			const currentY = mouseY.toFixed();

			const { heightOffset, spectrumGreenControlPosition, spectrumControlConfiguration } = this.configuration;

			const { greenControlY, greenControlHeight } = spectrumGreenControlPosition(width, height, heightOffset);

			const {
				lineStart, lineEnd, lineMiddle, upMiddle, downMiddle, step
			} = spectrumControlConfiguration(greenControlY, greenControlHeight, this.#greenLevelPosition);

			if (!this.#greenLevelPosition) {
				this.#greenLevelPosition = lineMiddle;
			}

			if (!this.#greenLevel) {
				this.#greenLevel = 150;
			}

			if (currentY - 20 <= upMiddle && this.#greenLevelPosition > lineStart) {
				this.#greenLevel += step;
				this.#greenLevelPosition -= 2;
			} else if (currentY >= downMiddle && this.#greenLevelPosition < lineEnd - 20) {
				this.#greenLevel -= step;
				this.#greenLevelPosition += 2;
			}

			if (this.#greenLevelPosition <= downMiddle && this.#greenLevelPosition >= upMiddle) {
				this.#greenLevel = 0;
				this.#greenLevelPosition = lineMiddle;
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
				var g = this.#greenLevel ? this.#greenLevel : map(spectrum[i], 0, 255, 255, 0);
				fill(this.#redLevel, g, this.#blueLevel);

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