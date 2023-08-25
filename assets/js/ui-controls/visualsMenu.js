//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class VisualsMenu extends P5 {
    #menuDisplayed = false;
    #controlsDisplayed = false;
    #visualisationController;

    /**
     * @param { VisualisationController } visualisationController
     */
    constructor(visualisationController) {
        super();

        this.onResize();
        this.#visualisationController = visualisationController;
    }

    static onResize() {
        this.configuration.heightOffset = height / 1.2;
        this.configuration.widthOffset = width / 20;
    };

    static #configuration = {
        heightOffset: 0,
        widthOffset: 0,
        visualsMenuPosition: (width, widthOffset, height, heightOffset, i) => {

            return {
				x: width / widthOffset,
				y:  heightOffset + i * height,
			}
		},
    }

    get configuration() {
        return VisualsMenu.#configuration;
    }


    get menuDisplayed() {
        return this.#menuDisplayed;
    }

    get controlsDisplayed() {
        return this.#controlsDisplayed;
    }

    get menu() {
        return this.#menu;
    }

    get controls() {
        return this.#controls;
    }

    get hide() {
        return this.#hideVisualsMenu;
    }

    get show() {
        return this.#showVisualsMenue;
    }
    
    get onResize() {
        return VisualsMenu.onResize;
    }

    //responds to keyboard presses
    //@param keycode the ascii code of the keypressed
    keyPressed(keycode) {
        if (keycode == 32) {
            this.#menuDisplayed = !this.#menuDisplayed;
        }

        if (keycode > 48 && keycode < 58) {
            var visNumber = keycode - 49;
            this.#visualisationController.selectedVisual = this.#visualisationController.visuals[visNumber].name;
        }
    };

    draw() {
        push();
        fill("white");
        stroke("black");
        strokeWeight(2);
        textSize(34);

        if (this.#menuDisplayed) {
            text("Select a visualisation:", 100, 30);
            this.#menu();
        }

        if (this.#controlsDisplayed) {
            text("Controls for visualisation:", 100, 30);
            this.#controls();
        }
        pop();
    };

    #menu() {
        //draw out menu items for each visualisation
        for (let i = 0; i < this.#visualisationController.visuals.length; i++) {
            const yLoc = 70 + i * 40;
            text((i + 1) + ":  " + this.#visualisationController.visuals[i].name, 100, yLoc);
        }
    };

    #controls() {
        const { heightOffset, widthOffset } = this.configuration;

        //draw out menu items for each visualisation
        for (let i = 0; i < this.#visualisationController.visuals.length; i++) {
            const yLoc = heightOffset + i * widthOffset;
            text((i + 1) + ":  " + this.#visualisationController.visuals[i].name, widthOffset, yLoc);
        }
    };

    #hideVisualsMenu() {
        this.#controlsDisplayed = false;
    }

    #showVisualsMenue() {
        this.#controlsDisplayed = true;
        this.#controls();
    }
}


