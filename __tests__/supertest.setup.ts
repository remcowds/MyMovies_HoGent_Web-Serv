import createServer from '../src/createServer';
import { ifServer } from '../src/interfaces/interfaces';
import supertest, { SuperTest } from 'supertest';
import { getKnex } from '../src/data/indexData';

export function withServer(setter: Function) {
	let server: ifServer;

	beforeAll(async () => {
		server = await createServer();
		setter({
			knex: getKnex(),
			supertest: supertest(server.getApp().callback()),
		});
	});

	afterAll(async () => {
		await server.stop();
	});
}

export async function login(supertest: SuperTest<supertest.Test>) {
	const response = await supertest.post('/api/users/login').send({
		userEmail: 'remco.desmedt@student.hogent.be',
		password: 'remcodsmdt',
	});

	if (response.statusCode !== 200) {
		throw new Error(response.body.message || 'unknown error occured');
	}

	return `Bearer ${response.body.token}`;
}
