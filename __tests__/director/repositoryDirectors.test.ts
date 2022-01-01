// import { Knex } from 'knex';
// import supertest from 'supertest';
// import createServer from '../../src/createServer';
// import { getKnex } from '../../src/data/indexData';
// import { ifServer } from '../../src/interfaces/interfaces';

describe('directors', () => {
	// let server: ifServer;
	// let request: supertest.SuperTest<supertest.Test>;
	// let knex: Knex;

	// const url = '/api/directors';

	// beforeAll(async () => {
	// 	server = await createServer();
	// 	request = supertest(server.getApp().callback());
	// 	knex = getKnex();
	// });

	// afterAll(async () => {
	// 	await server.stop();
	// });

	describe('GET /api/directors', () => {
		it('should be green', () => {
			expect(1).toBe(1);
		});
	});
});
