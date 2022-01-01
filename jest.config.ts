/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	collectCoverageFrom: [
		'./src/repository/**/*.ts',
		'./src/service/**/*.ts',
		'./src/REST/**/*.ts',
	],
	coverageDirectory: '__tests__/coverage',
	testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
};
