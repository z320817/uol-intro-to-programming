//constructor function to draw a
class Needles extends P5 {

	#plotWidth = 0;
	#plotHeight = 0;
	#dialRadius = 0;
	#pad = 0;
	#renderingProcessor;

	static #configuration = {
		minAngle: 0,
		maxAngle: 0,
		plotsAcross: 2,
		plotsDown: 2,
		frequencyBins: ["bass", "lowMid", "highMid", "treble"],
		heightOffset: 0,
		needlesUiPosition: (width, height, heightOffset) => {

			return {
				canvasOffcetX: width / 1.8,
				canvasOffcetY: height - heightOffset + 10,
				canvasWidth: width / 2.4,
				canvasHeight: heightOffset / 1.2
			}
		},
	}

	get configuration() {
		return Needles.#configuration;
	}

	get onResize() {
		return Needles.onResize;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	constructor(PI, TWO_PI) {
		super();
		this.configuration.minAngle = PI + PI / 10;
		this.configuration.maxAngle = TWO_PI - PI / 10;

		//set initial position of elements
		this.onResize();
		//draws the needles UI
		this.#setupRenderingProcessor();
	}

	static onResize() {
		this.configuration.heightOffset = height / 2.5;
		const { plotsAcross, plotsDown, needlesUiPosition, heightOffset } = this.configuration;
		const { canvasHeight, canvasWidth } = needlesUiPosition(width, height, heightOffset)

		this.#pad = 20;
		this.#plotWidth = canvasWidth / plotsAcross;
		this.#plotHeight = canvasHeight / plotsDown;
		this.#dialRadius = this.#plotWidth / 2 - this.#pad;
	};

	#needle(energy, centreX, bottomY) {
		const { minAngle, maxAngle } = this.configuration;
		push();
		stroke('#333333');
		//translate so 0 is at the bottom of the needle
		translate(centreX, bottomY);
		//map the energy to the angle for the plot
		const theta = map(energy, 0, 255, minAngle, maxAngle);

		//calculate x and y coorindates from angle for the length of needle
		const x = this.#dialRadius * cos(theta);
		const y = this.#dialRadius * sin(theta);

		//draw the needle
		line(0, 0, x, y);
		pop();
	};

	#ticks(centreX, bottomY, freqLabel) {
		const { minAngle, } = this.configuration;
		// 8 ticks from pi to 2pi
		let nextTickAngle = minAngle;
		push();
		stroke('#333333');
		fill('#333333');
		translate(centreX, bottomY);
		//draw the semi circle for the botttom of the needle
		arc(0, 0, 20, 20, PI, 2 * PI);
		textAlign(CENTER);
		textSize(14);
		text(freqLabel, 0, -(this.#plotHeight / 2));

		for (let i = 0; i < 9; i++) {
			//for each tick work out the start and end coordinates of
			//based on its angle from the needle's origin.
			const x = this.#dialRadius * cos(nextTickAngle);
			const x1 = (this.#dialRadius - 5) * cos(nextTickAngle);

			const y = (this.#dialRadius) * sin(nextTickAngle);
			const y1 = (this.#dialRadius - 5) * sin(nextTickAngle);

			line(x, y, x1, y1);
			nextTickAngle += PI / 10;
		}
		pop();
	};

	#setupRenderingProcessor() {
		const { heightOffset } = this.configuration;

		this.#renderingProcessor = () => {
			const { plotsAcross, plotsDown, needlesUiPosition, frequencyBins } = this.configuration;
			const { canvasHeight, canvasWidth, canvasOffcetX, canvasOffcetY } = needlesUiPosition(width, height, heightOffset)

			//create an array amplitude values from the fft.
			const spectrum = fourier.analyze();
			//iterator for selecting frequency bin.
			let currentBin = 0;
			push();
			fill('#f0f2d2');
			stroke('#000');
			//nested for loop to place plots in 2*2 grid.
			for (let i = 0; i < plotsDown; i++) {
				for (let j = 0; j < plotsAcross; j++) {

					//calculate the size of the plots
					const x = (j * this.#plotWidth) + width / canvasWidth + canvasOffcetX + this.#pad;
					const y = (i * this.#plotHeight) + height / canvasHeight + canvasOffcetY + this.#pad;
					const w = this.#plotWidth - this.#pad;
					const h = this.#plotHeight - this.#pad;
					console.log("x", x);
					console.log("y", y);
					console.log("w", w);
					console.log("h", h);


					//draw a rectangle at that location and size
					rect(x, y, w, h);
					//add on the ticks
					this.#ticks(x + w / 2, y + h, frequencyBins[currentBin]);

					const energy = fourier.getEnergy(frequencyBins[currentBin]);

					//add the needle
					this.#needle(energy, x + w / 2, y + h);
					currentBin++;
				}
			}

			pop();
		};
	}
}