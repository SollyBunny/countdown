
// Import
import { Game } from "./game.mjs"

let pts = 0;

// Init game
const game = new Game([
	document.body,
	document.getElementById("input"),
	document.getElementById("inputans"),
	document.getElementById("inputerr"),
	document.getElementById("inputwin"),
	document.getElementById("numbers"),
	document.getElementById("target"),
	document.getElementById("addbig"),
	document.getElementById("addsmall"),
	document.getElementById("addrand"),
	document.getElementById("pts")
]);

// Handle resize
const e_clock = document.getElementById("clock");
window.onresize = () => {
	// Change clock size
	let w = e_clock.parentNode.clientWidth;
	const h = e_clock.parentNode.clientHeight;
	if (w > h) { // if aspect ratio > 1
		w = `${h * 0.9}px`;
	} else {
		w = `${w * 0.9}px`;
	}
	e_clock.style.width = e_clock.style.height = w;
};
window.onresize(); // resize init


