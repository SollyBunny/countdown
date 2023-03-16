
// Import
import { shallowCopy, sleep, randint, randchoice } from "./util.js"
import { parse } from "./eval.js"

// Init consts

const NUMSBIG = [25, 50, 75, 100];
const NUMSSMALL = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

export const BIG = 0;
export const SMALL = 1;

// Class

export class Game {
	constructor(els) {
		/* Context on els
			Order:
				0: Container (normally document.body)
				1: Input
				2: Input Error Message
				3: Input Succsess Message
				4: Input Answer
				5: Numbers containers
				6: Target
				7: Add Big Number
				8: Add Small Number
				9: Add Randoms
				10: Points
			Here be dragons:
				These can't be changed on the fly (static)
				Everything breaks if one of these elements dissapears (no error checking)
				The class attribute "running" will be added when the game is in said state
				Elements in numbers will get "used" classes
		*/
		
		this.els = els;
		if (this.els) {
			this.els[1].oninput = this.handleinput.bind(this); // add input handler to input (bind is used so this is set correctly)
			this.els[5] = Object.values(this.els[5].children); // set Numbers container to their children
			this.els[7].onclick = () => { this.numsadd(BIG) }; // add button handlers
			this.els[8].onclick = () => { this.numsadd(SMALL) };
			this.els[9].onclick = () => { this.numsrand() };
		}
		this.pts = 0;
		this.reset();
	}
	reset() {
		// Reset the current object
		this.num = undefined;
		this.nums = [];
		this.numsbig = shallowCopy(NUMSBIG);
		this.numssmall = shallowCopy(NUMSSMALL);
		this.target = undefined;
		this.running = false;
		// Reset UI
		if (!this.els) return;
		this.els[0].classList.remove("running");
		this.els[5].forEach(i => { // clear numbers
			i.innerHTML = "";
			i.classList.remove("used");
		});
		// Clear insides of UI
		this.els[1].value = this.els[2].innerHTML = this.els[3].innerHTML = this.els[4].innerHTML = this.els[6].innerHTML = "";
		// Reenable buttons
		this.els[7].disabled = this.els[8].disabled = this.els[9].disabled = false;
	}
	handleinput() {

		if (!this.running) { // make sure is running
			if (this.els)
				this.els[1].value = ""; // remove any input
			return;
		}
	
		const nums = shallowCopy(this.els[5]);
		nums.forEach(i => {
			i.classList.remove("used"); // remove used
		});

		let out = "";
		let err = "";
		let win = "";
	
		if (event.target.value.length !== 0) {
			// Sanitize user input
			event.target.value = event.target.value.replaceAll("/", "÷");
			event.target.value = event.target.value.replaceAll(/[\*\x\X]/g, "⋅");
			event.target.value = event.target.value.replaceAll(/[^0-9\+\-\⋅\÷\(\)]/g, "");
			// Parse it
			out = parse(event.target.value);
			// Highlight used numbers
			out[1].forEach(i => {
				const el = nums.find(m => {
					return m.innerHTML == i && !m.classList.contains("used");
				});
				if (!el) {
					err = `I'm not allowed the number ${i}`;
					return;
				}
				el.classList.add("used");
			});

			// Figure out responce
			out = out[0];
			if (err) { // if err is set don't do anything

			} else if (isNaN(out)) {
				out = "";
			} else if (!Number.isInteger(out)) {
				err = "Not a round number";
			} else if (out < 0) {
				err = "Negative number";
			} else if (out > this.target) {
				err = "Too big";
			} else if (out < this.target) {
				err = "Too small";
			} else if (out === this.target) {
				win = "I got it!";
				this.stop();
			}

		}

		this.num = out;
		this.els[2].innerHTML = out;
		this.els[3].innerHTML = err;
		this.els[4].innerHTML = win;
	}
	numsadd(type) {
		// Add number
		type = type === BIG ? this.numsbig : this.numssmall; // make type of this context
		if (type.length === 0) throw "This type is empty!"; // can't add any more of this type
		const n = randint(type.length); // pick random num
		const e = type[n];
		this.nums.push(e); // add to numbers
		type.splice(n, 1); // remove number from type
		// Update UI
		if (this.els) {
			this.els[5][this.nums.length - 1].innerHTML = e; // set numbers UI
			if (type.length === 0) { // disable button if empty
				if (type === this.numsbig)
					this.els[7].disabled = true;
				else
					this.els[8].disabled = true;
			}
		}
		// Start if enuf numbers
		if (this.nums.length >= 6)
			this.start();
		return e;
	}
	async numsrand() {
		// Add random numbers
		while (this.nums.length < 6) {
			try {
				this.numsadd(Math.random() > 0.5 ? BIG : SMALL);
			} catch (e) {
				continue;
			}
			if (this.els)
				await sleep(0.1);
		}
	}
	async targetnew() {
		// Generate a new target
		let nums = shallowCopy(this.nums);
		let a, b, c, d; // used to store temp vals
		while (nums.length > 1) {
			a = randint(nums.length); // pick operands
			b = randint(nums.length);
			if (a === b) continue;
			c = randint(4); // pick operator to attempt
			switch (c) {
				case 0: d = nums[a] * nums[b]; break;
				case 1: d = nums[a] / nums[b]; break;
				case 2: d = nums[a] + nums[b]; break;
				case 3: d = nums[a] - nums[b]; break;
			}
			if (!d) continue; // if d == 0 or d == NaN
			if (d < 0) continue; // if d is negative
			if (!Number.isInteger(d)) continue; // if d is not whole
			if (d > 2000) continue; // prevent very large numbers
			nums[a] = d;
			nums.splice(b, 1); // remove unused number
		}
		if (this.els) {
			// Cool animation
			for (let i = 0; i < 15; ++i) {
				this.els[6].innerHTML = randint(999);
				await sleep(0.1);
			}
			this.els[6].innerHTML = d;
		}
		this.target = d; // set and return
		return d;
	}
	async start() {
		this.running = true;
		// Update UI
		if (this.els) {
			this.els[0].classList.add("running");
			this.els[7].disabled = this.els[8].disabled = this.els[9].disabled = true;
			if (!this.target)
				await this.targetnew(); // make sure there is a target
			await sleep(1);
			this.els[1].focus(); // focus input after any animation is completed
			await sleep(29);
		} else {
			if (!this.target)
				await this.targetnew(); // make sure there is a target
			await sleep(30);
		}
		this.stop();
	}
	async stop() {
		if (this.num === this.target) {
			this.ptsadd(10);
		} else if (Math.abs(this.num - this.target) <= 5) {
			this.ptsadd(7);
		} else if (Math.abs(this.num - this.target) <= 10) {
			this.ptsadd(5);
		}
		this.running = false;
		this.reset();
	}
	async ptsadd(pts) {
		this.pts += pts;
		if (!this.els) {
			return;
		};
		let old = this.pts - pts;
		do { // Cool animation
			old += this.pts;
			old = Math.ceil(old / 2);
			await sleep(0.1);
			this.els[10].innerHTML = `${old}pts`;
		} while (old !== this.pts);
	}
}
