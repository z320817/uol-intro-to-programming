//constructor function to draw a
class Needles {

	#pad = 0;
	#plotWidth = 0;
	#plotHeight = 0;
	#dialRadius = 0;
	#renderingProcessor;

	static #configuration = {
		name: "needles",
		minAngle: 0,
		maxAngle: 0,
		plotsAcross: 2,
		plotsDown: 2,
		frequencyBins: ["bass", "lowMid", "highMid", "treble"]
	}

	get configuration() {
		return Needles.#configuration;
	}

	get name() {
		return Needles.#configuration.name;
	}

	get onResize() {
		return Needles.onResize;
	}

	get draw() {
		return this.#renderingProcessor;
	}

	constructor(PI, TWO_PI) {
		this.configuration.minAngle = PI + PI / 10;
		this.configuration.maxAngle = TWO_PI - PI / 10;
		this.onResize();
		//draws the needles UI
		this.#setupRenderingProcessor();
	}

	static onResize() {
		const { plotsAcross, plotsDown } = this.configuration;
		this.#pad = width / 20;
		this.#plotWidth = (width - this.#pad) / plotsAcross;
		this.#plotHeight = (height - this.#pad) / plotsDown;
		this.#dialRadius = (this.#plotWidth - this.#pad) / 2 - 5;
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
		textSize(12);
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
		this.#renderingProcessor = () => {
			const { plotsAcross, plotsDown, frequencyBins } = this.configuration;
			//create an array amplitude values from the fft.
			const spectrum = fourier.analyze();
			//iterator for selecting frequency bin.
			let currentBin = 0;
			push();
			fill('#f0f2d2');
			//nested for loop to place plots in 2*2 grid.
			for (let i = 0; i < plotsDown; i++) {
				for (let j = 0; j < plotsAcross; j++) {

					//calculate the size of the plots
					const x = this.#pad + j * this.#plotWidth;
					const y = this.#pad + i * this.#plotHeight;
					const w = this.#plotWidth - this.#pad;
					const h = this.#plotHeight - this.#pad;

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