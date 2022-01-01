import { getChildLogger } from '../core/logging';
import ServiceError from '../core/serviceError';
import { getKnex, tables } from '../data/indexData';
import { ifDirector } from '../interfaces/interfaces';

const tableDirector = tables.director;

export const getAllDirectors = async () => {
	return await getKnex()(tableDirector).select();
};

export const getDirectorByID = async (id: number) => {
	try {
		const director = await getKnex()(tableDirector)
			.select()
			.where({ directorID: id })
			.first();

		if (director) {
			return director;
		} else {
			throw ServiceError.notFound('No director found with id ' + id);
		}
	} catch (error) {
		const logger = getChildLogger('directorRepo');
		logger.error('Error getting director: ' + error);
		throw error;
	}
};

export const updateDirector = async (id: number, director: ifDirector) => {
	const { directorLastName, directorFirstName, birthdate, country, linkDir } =
		director;

	try {
		const ret = await getKnex()(tableDirector)
			.where({ directorID: id })
			.update({
				directorLastName,
				directorFirstName,
				birthdate,
				country,
				linkDir,
			});
		if (ret === 0)
			throw ServiceError.notFound('No director found with id ' + id);
	} catch (error) {
		const logger = getChildLogger('directorRepo');
		logger.error('Error updating director: ' + error);
		throw error;
	}

	return await getDirectorByID(id);
};

export const createDirector = async (director: ifDirector) => {
	const { directorLastName, directorFirstName, birthdate, country, linkDir } =
		director;

	try {
		const ret = await getKnex()(tableDirector).insert({
			directorLastName,
			directorFirstName,
			birthdate,
			country,
			linkDir,
		});
		if (ret) {
			return director;
		}
	} catch (error) {
		const logger = getChildLogger('directorRepo');
		logger.error('Error creating director: ' + error);
		throw error;
	}
};

export const removeDirector = async (id: number) => {
	try {
		const ret = await getKnex()(tableDirector)
			.where({ directorID: id })
			.del();
		if (ret === 0) {
			throw ServiceError.notFound(`Director with id ${id} not found`);
		}
	} catch (error) {
		const logger = getChildLogger('directorRepo');
		logger.error('Error removing director: ' + error);
		throw error;
	}
};
