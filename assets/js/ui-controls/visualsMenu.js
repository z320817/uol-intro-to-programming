//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class VisualsMenu extends P5 {

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
                y: heightOffset + i * height,
            }
        },
    }

    get configuration() {
        return VisualsMenu.#configuration;
    }

    get controlsDisplayed() {
        return this.#controlsDisplayed;
    }

    get hide() {
        return this.#hideVisualsMenu;
    }

    get show() {
        return this.#showVisualsMenu;
    }

    get onResize() {
        return VisualsMenu.onResize;
    }

    //responds to keyboard presses
    //@param keycode the ascii code of the keypressed
    keyPressed(keycode) {
        if (keycode > 48 && keycode < 58) {
            var visNumber = keycode - 49;
            this.#visualisationController.selectedVisual = this.#visualisationController.visuals[visNumber].name;
        }
    };

    draw() {
        push();
        if (this.#controlsDisplayed) {
            for (let i = 0; i < this.#visualisationController.visuals.length; i++) {
                this.#visualisationController.visuals[i].controlRendering();
            }
        }
        pop();
    };

    #hideVisualsMenu() {
        this.#controlsDisplayed = false;
    }

    #showVisualsMenu() {
        this.#controlsDisplayed = true;
    }
}


