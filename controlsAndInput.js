//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
class ControlsAndInput {
	constructor() {

		//playback button displayed in the top left of the screen
		this.playbackButton = new PlaybackButton();
		this.visualsMenu = new VisualsMenu();

		//make the window fullscreen or revert to windowed
		this.mousePressed = function () {
			if (!this.playbackButton.hitCheck()) {
				var fs = fullscreen();
				fullscreen(!fs);
			}
		};

		//responds to keyboard presses
		//@param keycode the ascii code of the keypressed
		this.keyPressed = function (keycode) {
			this.visualsMenu.keyPressed(keycode);
		};

		//draws the playback button and potentially the menu
		this.draw = function () {
			push();
			fill("white");
			stroke("black");
			strokeWeight(2);
			textSize(34);

			//playback button 
			this.playbackButton.draw();
			//only draw the menu if menu displayed is set to true.
			if (this.visualsMenu.menuDisplayed) {

				text("Select a visualisation:", 100, 30);
				this.menu();
			}
			pop();

		};

		this.menu = function () {
			//draw out menu items for each visualisation
			for (var i = 0; i < vis.visuals.length; i++) {
				var yLoc = 70 + i * 40;
				text((i + 1) + ":  " + vis.visuals[i].name, 100, yLoc);
			}
		};
	}
}


