// Return whether n is a number or not
function _isNumber(n) {
	return !isNaN(Number(n));
}

// This function is designed to be as leniant as possible
function _parse(exp, i) {
	let usednums = [];
	let tokens = [];
	let m = "";
	let cur = undefined;
	let out;
	while (i < exp.length && m !== false) { // manual iterator so can move ptr around
		m = exp[i];
		switch (m) {
			case "0": 
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				if (cur === undefined) {
					cur = Number(m);
					usednums.push(cur);
				} else {
					cur *= 10;
					cur += Number(m);
					usednums[usednums.length - 1] = cur;
				}
				break;
			case "+":
			case "-":
			case "⋅":
			case "÷":
				tokens.push(cur || 0);
				tokens.push(m);
				cur = undefined;
				break;
			case "(": // find the next pair of brackets then recurse	
				++i;
				out = _parse(exp, i);
				usednums = usednums.concat(out[2]);
				i = out[1] - 1;
				cur = out[0];
				break;
			case ")":
				m = false; // set flag to exit
				break;
		}
		++i;
	}
	if (cur !== undefined) // add last token
		tokens.push(cur)

	// ⋅ / ÷
	m = 0;
	while (m < tokens.length - 2) { // manual iterator so ptr can be moved
		if (
			_isNumber(tokens[m]) && // check if matches format a operator b
			tokens[m + 1] === "⋅" &&
			_isNumber(tokens[m + 2])
		) { // do maths if so
			tokens[m] = tokens[m] * tokens[m + 2];
			tokens.splice(m + 1, 2); // delete the 2 now unused elements
		} else if (
			_isNumber(tokens[m]) && // check if matches format a operator b
			tokens[m + 1] === "÷" &&
			_isNumber(tokens[m + 2])			
		) {
			tokens[m] = tokens[m] / tokens[m + 2];
			tokens.splice(m + 1, 2); // delete the 2 now unused elements			
		} else {
			++m;
		}
	}

	// + / -
	m = 0;
	while (m < tokens.length - 2) { // manual iterator so ptr can be moved
		if (
			_isNumber(tokens[m]) && // check if matches format a operator b
			tokens[m + 1] === "+" &&
			_isNumber(tokens[m + 2])
		) { // do maths if so
			tokens[m] = tokens[m] + tokens[m + 2];
			tokens.splice(m + 1, 2); // delete the 2 now unused elements
		} else if (
			_isNumber(tokens[m]) && // check if matches format a operator b
			tokens[m + 1] === "-" &&
			_isNumber(tokens[m + 2])			
		) {
			tokens[m] = tokens[m] - tokens[m + 2];
			tokens.splice(m + 1, 2); // delete the 2 now unused elements			
		} else {
			++m;
		}
	}
	
	return [tokens[0], i, usednums];
}
function parse(exp) { // safe version of _parse to use externally
	try {
		const out = _parse(exp, 0);
		return [out[0], out[2]];
	} catch (e) {
		return NaN;
	}
}
