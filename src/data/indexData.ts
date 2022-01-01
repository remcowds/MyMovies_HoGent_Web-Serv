import config from 'config';
import * as Knex from 'knex';
import { join } from 'path';
import { getLogger } from '../core/logging';

let knex: Knex.Knex;

const isDevelopment = config.get('env') === 'development';

export async function initializeData() {
	const logger = getLogger();

	const knexOptions = {
		client: config.get('connectionDB.client'),
		connection: {
			host: config.get('connectionDB.host'),
			port: config.get('connectionDB.port'),
			user: config.get('connectionDB.user'),
			password: config.get('connectionDB.password'),
			database: null,
		},
		// print all executed queries
		// debug: true,
		migrations: {
			tableName: 'knex_metadata',
			directory: join('src', 'data', 'migrations'),
		},
		seeds: {
			directory: join('src', 'data', 'seeds'),
		},
	};

	//instantie maken van Knex
	knex = Knex.knex(knexOptions as Knex.Knex.Config);

	// connectie testen + database creeren indien die nog niet bestaat
	try {
		await knex.raw('select 1');

		await knex.raw(
			`create database if not exists ${config.get('connectionDB.name')}`
		);
		// use created database
		await knex.destroy();
		knexOptions.connection.database = config.get('connectionDB.name');
		knex = Knex.knex(knexOptions as Knex.Knex.Config);
		//connectie opnieuw testen
		await knex.raw('select 1');
	} catch (error) {
		throw new Error('Connection failed:' + error);
	}

	//migrations
	let migrationsFailed: boolean = true;
	try {
		await knex.migrate.latest();
		migrationsFailed = false;
	} catch (error) {
		logger.error('Error migrating: ' + error);
	}

	//migrations failed -> undo de laatste
	if (migrationsFailed) {
		try {
			await knex.migrate.down();
		} catch (error) {
			logger.error('Error migrating down: ' + error);
		}

		throw new Error('Migrations failed');
	}

	//seeds enkel development!
	if (isDevelopment) {
		//alle seeds runnen
		try {
			await knex.seed.run();
		} catch (error) {
			logger.error('Error seeding: ' + error);
		}
	}

	return knex;
}

//getter voor knex
export function getKnex() {
	if (knex === null) {
		throw new Error('No instance of knex');
	}
	return knex;
}

//tabelnamen in een onwijzigbaar object
export const tables = Object.freeze({
	movie: 'movie',
	category: 'category',
	director: 'director',
	user: 'user',
});

export async function shutdownData() {
	await knex.destroy();
}
