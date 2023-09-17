//draw the waveform to the screen
class WavePattern extends P5 {

	#icons;
	#isFullScreen;
	#isRendered = true;
	#isEnabled;
	#audioElement;
	#blueLevel = 0;
	#blueLevelPosition = 0;
	#redLevel = 255;
	#redLevelPosition = 0;
	#greenLevel = 0;
	#greenLevelPosition = 0;
	#visualisationController;
	#renderingProcessor;

	static #configuration = {
		name: "wavepattern",
		heightOffset: 0,
		lowerBorder: 0,
		waveRedControlPosition: (width, height, heightOffset) => {
			return {
				redControlY: (height - heightOffset) + 80,
				redControlX: (width / 4),
				redControlHeight: 32,
				redControlWidth: 32,
			}
		},
		waveBlueControlPosition: (width, height, heightOffset) => {
			return {
				blueControlY: (height - heightOffset) + 80,
				blueControlX: (width / 4.5),
				blueControlHeight: 32,
				blueControlWidth: 32,
			}
		},
		waveGreenControlPosition: (width, height, heightOffset) => {
			return {
				greenControlY: (height - heightOffset) + 80,
				greenControlX: (width / 3.6),
				greenControlHeight: 32,
				greenControlWidth: 32,
			}
		},
		waveIconPosition: (width, height, heightOffset) => {
			return {
				waveControlIconX: width / 4,
				waveControlIconY: height - heightOffset,
				waveControlIconHeight: 42,
				waveControlIconWidth: 32,
			}
		},
		waveControlConfiguration: (waveControlY, waveControlHeight, blueLevel) => {
			const lineStart = Number(waveControlY.toFixed()) + 5;
			const lineEnd = Number(waveControlY.toFixed()) + waveControlHeight + 25;
			const lineLength = lineEnd - lineStart;
			const lineMiddle = (lineStart + (lineLength / 2)).toFixed() - waveControlHeight / 2;
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
		return WavePattern.#configuration;
	}

	get isEnabled() {
		return this.#isEnabled;
	}

	get name() {
		return WavePattern.#configuration.name;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	get onResize() {
		return WavePattern.onResize;
	}

	/**
	 * @param { icons } icons, 
	 */
	/**
	 * @param { AudioElement } currentAudioElement, 
	 */
	/**
	 * @param { VisualisationController } visualisationController
	 */
	constructor(visualisationController, currentAudioElement, icons) {
		super();

		this.#visualisationController = visualisationController;
		this.#icons = icons;
		this.#audioElement = currentAudioElement;

		//set initial position of elements
		this.onResize();

		this.#setupRenderingProcessor();
		this.#isRendered = false;
	}

	static onResize() {
		if (this.#isFullScreen || this.#isRendered) {
			this.configuration.heightOffset = (height / 4);
		}
		this.configuration.lowerBorder = this.#isFullScreen ? height + (height / 8) : height - (height / 2.5);
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

		if (this.#isEnabled) {
			this.#visualisationController.selectedVisual = this.configuration.name;
		}
	}

	setDisabled() {
		this.#isEnabled = false;
	}

	#redControlHitCheck() {
		const { heightOffset, waveRedControlPosition } = this.configuration;

		const { redControlX, redControlY, redControlHeight, redControlWidth } = waveRedControlPosition(width, height, heightOffset);

		if (mouseX > redControlX &&
			mouseX < redControlX + redControlWidth &&
			mouseY > redControlY + 5 && mouseY < redControlY + redControlHeight + 25) {

			return true;
		}

		return false;
	}

	#blueControlHitCheck() {
		const { heightOffset, waveBlueControlPosition } = this.configuration;

		const { blueControlX, blueControlY, blueControlHeight, blueControlWidth } = waveBlueControlPosition(width, height, heightOffset);

		if (mouseX > blueControlX &&
			mouseX < blueControlX + blueControlWidth &&
			mouseY > blueControlY + 5 && mouseY < blueControlY + blueControlHeight + 25) {

			return true;
		}

		return false;
	}

	#greenControlHitCheck() {
		const { heightOffset, waveGreenControlPosition } = this.configuration;

		const { greenControlX, greenControlY, greenControlHeight, greenControlWidth } = waveGreenControlPosition(width, height, heightOffset);

		if (mouseX > greenControlX &&
			mouseX < greenControlX + greenControlWidth &&
			mouseY > greenControlY + 5 && mouseY < greenControlY + greenControlHeight + 25) {

			return true;
		}

		return false;
	}

	#iconHitCheck() {
		const { heightOffset, waveIconPosition } = this.configuration;

		const { waveControlIconX, waveControlIconY, waveControlIconHeight, waveControlIconWidth } = waveIconPosition(width, height, heightOffset);

		if (mouseX > waveControlIconX &&
			mouseX < waveControlIconX + waveControlIconWidth &&
			mouseY > waveControlIconY && mouseY < waveControlIconY + waveControlIconHeight) {

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
		const { heightOffset, waveIconPosition } = this.configuration;

		const { waveControlIconX, waveControlIconY, waveControlIconHeight, waveControlIconWidth } = waveIconPosition(width, height, heightOffset);

		noStroke();
		textSize(14);
		fill(0);
		text(this.configuration.name, waveControlIconX - (waveControlIconWidth / 2), waveControlIconY + (waveControlIconWidth * 1.5));

		if (this.#isEnabled) {
			image(this.#icons.visualisation.wave.on, waveControlIconX, waveControlIconY, waveControlIconHeight, waveControlIconWidth);
		} else {
			image(this.#icons.visualisation.wave.off, waveControlIconX, waveControlIconY, waveControlIconHeight, waveControlIconWidth);
		}
		pop();
	}

	#blueLevelControlRendering = () => {
		push();
		const { heightOffset, waveBlueControlPosition, waveControlConfiguration } = this.configuration;

		const { blueControlX, blueControlY, blueControlHeight, blueControlWidth } = waveBlueControlPosition(width, height, heightOffset);

		const {
			lineMiddle
		} = waveControlConfiguration(blueControlY, blueControlHeight, this.#blueLevelPosition);

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
		const { heightOffset, waveRedControlPosition, waveControlConfiguration } = this.configuration;

		const { redControlX, redControlY, redControlHeight, redControlWidth } = waveRedControlPosition(width, height, heightOffset);

		const {
			lineMiddle
		} = waveControlConfiguration(redControlY, redControlHeight, this.#redLevelPosition);

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
		const { heightOffset, waveGreenControlPosition, waveControlConfiguration } = this.configuration;

		const { greenControlX, greenControlY, greenControlHeight, greenControlWidth } = waveGreenControlPosition(width, height, heightOffset);

		const {
			lineMiddle
		} = waveControlConfiguration(greenControlY, greenControlHeight, this.#greenLevelPosition);

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

			const { heightOffset, waveBlueControlPosition, waveControlConfiguration } = this.configuration;

			const { blueControlY, blueControlHeight } = waveBlueControlPosition(width, height, heightOffset);

			const {
				lineStart, lineEnd, lineMiddle, upMiddle, downMiddle, step
			} = waveControlConfiguration(blueControlY, blueControlHeight, this.#blueLevelPosition);

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

			const { heightOffset, waveRedControlPosition, waveControlConfiguration } = this.configuration;

			const { redControlY, redControlHeight } = waveRedControlPosition(width, height, heightOffset);

			const {
				lineStart, lineEnd, lineMiddle, upMiddle, downMiddle, step
			} = waveControlConfiguration(redControlY, redControlHeight, this.#redLevelPosition);

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
				this.#redLevel = 255;
				this.#redLevelPosition = lineMiddle;
			}
		}
	}

	#setGreenLevel() {
		if (this.#isEnabled) {
			const currentY = mouseY.toFixed();

			const { heightOffset, waveGreenControlPosition, waveControlConfiguration } = this.configuration;

			const { greenControlY, greenControlHeight } = waveGreenControlPosition(width, height, heightOffset);

			const {
				lineStart, lineEnd, lineMiddle, upMiddle, downMiddle, step
			} = waveControlConfiguration(greenControlY, greenControlHeight, this.#greenLevelPosition);

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

		this.#renderingProcessor = () => {
			push();
			noFill();
			stroke(this.#redLevel, this.#greenLevel, this.#blueLevel);
			strokeWeight(2);

			beginShape();
			//calculate the waveform from the fft.
			var wave = this.#audioElement.fourier.waveform();
			for (var i = 0; i < wave.length; i++) {
				//for each element of the waveform map it to screen
				//coordinates and make a new vertex at the point.
				var x = map(i, 0, wave.length, 0, width);
				var y = map(wave[i], -1, 1, 0, this.configuration.lowerBorder);

				vertex(x, y);
			}

			endShape();
			pop();
		};
	}
}