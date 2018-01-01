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
