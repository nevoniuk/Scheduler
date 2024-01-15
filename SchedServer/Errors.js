module.exports = class NoReportsError extends Error {
	constructor(message) {
		super(message);
		this.name = "NoReportsError"
	}
}
