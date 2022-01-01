const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN';

export default class ServiceError extends Error {
	code: string;
	details: {};

	constructor(code: string, message: string, details: {} = {}) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = 'ServiceError';
	}

	//statische methoden voor standaard errors
	static notFound(message: string, details: {} = {}) {
		return new ServiceError(NOT_FOUND, message, details);
	}

	static validationFailed(message: string, details: {} = {}) {
		return new ServiceError(VALIDATION_FAILED, message, details);
	}

	static unauthorized(message: string, details: {} = {}) {
		return new ServiceError(UNAUTHORIZED, message, details);
	}

	static forbidden(message: string, details: {} = {}) {
		return new ServiceError(FORBIDDEN, message, details);
	}

	//getters om te zien welk soort fout
	get isNotFound() {
		return this.code === NOT_FOUND;
	}

	get isValidationFailed() {
		return this.code === VALIDATION_FAILED;
	}

	get isUnauthorized() {
		return this.code === UNAUTHORIZED;
	}

	get isForbidden() {
		return this.code === FORBIDDEN;
	}
}
