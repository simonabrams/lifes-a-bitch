/**
 *   utilities
 */

// generate a random number between two numbers
export function randRange(min, max) {
	return Math.round((min + (max - min)) * Math.random());
}

// set sentence case
export function sentenceCase(sentence) {
	let str = sentence;
	if ((str === null) || (str === '')) {
		return false;
	}
	str = str.toString();
	return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// handles the data returned by the server
export function processResponse(func) {
	return () => {
		// if the response is ready
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status === 200) {
				// parses JSON data
				const jsonResponse = JSON.parse(this.responseText);
				const data = jsonResponse;
				func(data);
			} else {
				console.log('error with the request!');
			}
		}
		// try {
		// }
		// catch(e) {
		//     console.log("Caught Exception: " + e.description);
		// }
	};
}
