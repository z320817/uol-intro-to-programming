//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class VisualsMenu extends P5 {
    #menuDisplayed = false;
    #visualisationController;

    /**
     * @param { VisualisationController } visualisationController
     */
    constructor(visualisationController) {
        super();
        this.#visualisationController = visualisationController;
    }

    get menuDisplayed() {
        return this.#menuDisplayed;
    }

    get menu() {
        return this.#menu;
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
        pop();
    };

    #menu() {
        //draw out menu items for each visualisation
        for (let i = 0; i < this.#visualisationController.visuals.length; i++) {
            const yLoc = 70 + i * 40;
            text((i + 1) + ":  " + this.#visualisationController.visuals[i].name, 100, yLoc);
        }
    };
}


