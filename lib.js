// This file contains util functions

// Return a new shallow copy of the given list
// shallowCopy([1, 2, 3]) => [1, 2, 3]
function shallowCopy(l) {
	return l.map(i => {
		return i;
	});
};

// Sleep n seconds without resorting to callback hell with window.setTimeout()
// await sleep(5)
function sleep(n) {
	return new Promise(resolve => {
		window.setTimeout(() => {
			resolve();
		}, n * 1000);
	});
}

// Get a random int from 0 to n exclusive
// randint(5) => 3
function randint(n) {
	return Math.floor(Math.random() * n);
}

// Get random element from array
// randchoice([1, 2, 3]) => 3
function randchoice(l) {
	return l[randint(l.length)];
}
