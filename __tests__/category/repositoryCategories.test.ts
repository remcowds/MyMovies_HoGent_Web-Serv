import { Knex } from 'knex';
import supertest from 'supertest';
import { tables } from '../../src/data/indexData';
import { ifCategory } from '../../src/interfaces/interfaces';
import { login, withServer } from '../supertest.setup';

const url = '/api/categories';

describe('categories', () => {
	let request: supertest.SuperTest<supertest.Test>;
	let knexInstance: Knex;
	let loginHeader: string;

	withServer(
		({
			knex,
			supertest,
		}: {
			knex: Knex;
			supertest: supertest.SuperTest<supertest.Test>;
		}) => {
			knexInstance = knex;
			request = supertest;
		}
	);

	beforeAll(async () => {
		loginHeader = await login(request);
	});

	describe('GET /api/categories', () => {
		const testdata: ifCategory[] = [
			{
				categoryName: 'testCategory1',
				description: 'testDescription1',
				linkCat:
					'https://imagsfsdfes.unsplash.com/photo-1598389759169-4e0c192c6816?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80',
			},
			{
				categoryName: 'testCategory2',
				description: 'testDescription2',
				linkCat:
					'https://imagsfsdfes.unsplash.com/photo-1598389759169-4e0c192c6816?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80',
			},
			{
				categoryName: 'testCategory3',
				description: 'testDescription3',
				linkCat:
					'https://imagsfsdfes.unsplash.com/photo-1598389759169-4e0c192c6816?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80',
			},
		];

		const dataToDelete: string[] = [
			'testCategory1',
			'testCategory2',
			'testCategory3',
		];

		beforeAll(async () => {
			//data toevoegen
			await knexInstance(tables.category).insert(testdata);
		});

		afterAll(async () => {
			//data weer verwijderen + autoincrement resetten
			await knexInstance(tables.category)
				.whereRaw(`categoryName like 'testCategory%'`)
				.del();
			await knexInstance.raw(
				`alter table ${tables.category} AUTO_INCREMENT = 7`
			); //7 is de volgende
		});

		it('should 200', async () => {
			const response = await request.get(url);

			expect(response.status).toBe(200);
		});

		it('should return the categories', async () => {
			const response = await request.get(url);
			//de body bevat een array van categorieën waarvan er overeenkomen met de inserted testdata --> het werkt
			expect(response.body).toEqual(
				expect.arrayContaining([
					expect.objectContaining(testdata[0]),
					expect.objectContaining(testdata[1]),
					expect.objectContaining(testdata[2]),
				])
			);
		});
	});

	describe('GET /api/categories/:id', () => {
		it('should 200 and return the right category', async () => {
			const response = await request.get(`${url}/1`);

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				categoryID: 1,
				categoryName: 'Action',
				description: 'war, martial arts, guns',
				linkCat:
					'https://images.unsplash.com/photo-1598389759169-4e0c192c6816?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80',
			});
		});

		it('should 404 if the id is invalid', async () => {
			const response = await request.get(`${url}/999`);
			expect(response.status).toBe(404);
		});
	});

	describe('POST /api/categories', () => {
		const category: ifCategory = {
			categoryName: 'testCatName',
			description: 'testCatDescr',
			linkCat:
				'https://imagsfsdfes.unsplash.com/photo-1598389759169-4e0c192c6816?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80',
		};
		afterAll(async () => {
			await knexInstance(tables.category)
				.where({ categoryName: 'testCatName' })
				.del();
			await knexInstance.raw(
				`alter table ${tables.category} AUTO_INCREMENT = 7`
			); //7 is de volgende
		});

		it('should 201 and return the category', async () => {
			const response = await request
				.post(url)
				.send(category)
				.set('Authorization', loginHeader);

			expect(response.status).toBe(201);
			expect(response.body).toEqual(category);
		});

		it('should 400 if arguments are not good', async () => {
			const response = await request
				.post(url)
				.send({ yeet: 'niet' })
				.set('Authorization', loginHeader);

			expect(response.status).toBe(400);
		});
	});

	describe('PUT /api/categories/:id', () => {
		const category: ifCategory = {
			categoryName: 'testCatName',
			description: 'testCatDescr',
			linkCat:
				'https://imagsfsdfes.unsplash.com/photo-1598389759169-4e0c192c6816?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80',
		};

		const updatedCategory: ifCategory = {
			categoryName: 'uptestCatName',
			description: 'uptestCatDescr',
			linkCat:
				'https://imagsfsdfes.unsplash.com/photo-1598389759169-4e0c192c6816?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80',
		};

		beforeAll(async () => {
			await knexInstance(tables.category).insert(category);
		});

		afterAll(async () => {
			await knexInstance(tables.category)
				.where({ categoryName: 'uptestCatName' })
				.del();
			await knexInstance.raw(
				`alter table ${tables.category} AUTO_INCREMENT = 7`
			); //7 is de volgende
		});

		it('should 200 and return the updated category', async () => {
			const response = await request
				.put(`${url}/7`)
				.send(updatedCategory)
				.set('Authorization', loginHeader);

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				categoryID: 7,
				...updatedCategory,
			});
		});

		it('should 404', async () => {
			const response = await request
				.put(`${url}/999`)
				.send(category)
				.set('Authorization', loginHeader);

			expect(response.status).toBe(404);
		});
	});

	describe('DELETE /api/categories/:id', () => {
		const category: ifCategory = {
			categoryName: 'newCatddff2',
			description: 'descrfdsdqfsdfsqf',
			linkCat:
				'https://imagsfsdfes.unsplash.com/photo-1598389759169-4e0c192c6816?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80',
		};

		beforeAll(async () => {
			await knexInstance(tables.category).insert(category);
		});

		afterAll(async () => {
			await knexInstance.raw(
				`alter table ${tables.category} AUTO_INCREMENT = 7`
			); //7 is de volgende
		});

		it('should 204 and return nothing', async () => {
			const response = await request
				.delete(`${url}/7`)
				.set('Authorization', loginHeader);

			expect(response.body).not.toBeTruthy;
			expect(response.status).toBe(204);
		});
	});
});
