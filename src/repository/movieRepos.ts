import { getChildLogger } from '../core/logging';
import ServiceError from '../core/serviceError';
import { getKnex, tables } from '../data/indexData';
import { ifMovie, ifMovieFormat } from '../interfaces/interfaces';

const tableMovie = tables.movie;

const formatMovie = (movieToFormat: ifMovieFormat) => {
	const {
		categoryID,
		categoryName,
		description,
		linkCat,
		directorID,
		directorFirstName,
		directorLastName,
		birthdate,
		country,
		linkDir,
		...movie
	} = movieToFormat;
	return {
		...movie,
		category: {
			categoryID,
			categoryName,
			description,
			linkCat,
		},
		director: {
			directorID,
			lastName: directorLastName,
			firstName: directorFirstName,
			birthdate,
			country,
			linkDir,
		},
	};
};

export const getAllMovies = async () => {
	const movies = await getKnex()(tableMovie)
		.select()
		.join(
			tables.category,
			`${tables.category}.categoryID`,
			'=',
			`${tableMovie}.categoryID`
		)
		.join(
			tables.director,
			`${tables.director}.directorID`,
			'=',
			`${tableMovie}.directorID`
		)
		.orderBy('movieID');
	if (movies) {
		//joinen om category en director mee te kunnen geven als object (zie formatMovie)
		return movies.map(formatMovie);
	}
};

export const getMovieByID = async (id: number) => {
	try {
		const movie = await getKnex()(tableMovie)
			.select()
			.join(
				tables.category,
				`${tables.category}.categoryID`,
				'=',
				`${tableMovie}.categoryID`
			)
			.join(
				tables.director,
				`${tables.director}.directorID`,
				'=',
				`${tableMovie}.directorID`
			)
			.where('movieID', id)
			.first();

		if (movie) {
			return formatMovie(movie);
		} else {
			throw ServiceError.notFound('No movie found with id ' + id);
		}
	} catch (error) {
		const logger = getChildLogger('movieRepo');
		logger.error('Error getting movie: ' + error);
		throw error;
	}
};

export const updateMovie = async (id: number, movie: ifMovie) => {
	const {
		categoryID,
		directorID,
		title,
		yearOfRelease,
		rating,
		durationInMinutes,
		linkMov,
	} = movie;

	try {
		const ret = await getKnex()(tableMovie)
			.where(`${tableMovie}.movieID`, id)
			.update({
				categoryID,
				directorID,
				title,
				yearOfRelease,
				rating,
				durationInMinutes,
				linkMov,
			});
		if (ret === 0) {
			throw ServiceError.notFound('No movie found with id ' + id);
		}
	} catch (error) {
		const logger = getChildLogger('movieRepo');
		logger.error('Error updating movie: ' + error);
		throw error;
	}

	return await getMovieByID(id);
};

export const createMovie = async (movie: ifMovie) => {
	const {
		categoryID,
		directorID,
		title,
		yearOfRelease,
		rating,
		durationInMinutes,
		linkMov,
	} = movie;

	try {
		const ret = await getKnex()(tableMovie).insert({
			categoryID,
			directorID,
			title,
			yearOfRelease,
			rating,
			durationInMinutes,
			linkMov,
		});
		if (ret) {
			return movie;
		}
	} catch (error) {
		const logger = getChildLogger('movieRepo');
		logger.error('Error creating movie: ' + error);
		throw error;
	}
	return movie;
};

export const removeMovie = async (id: number) => {
	try {
		const ret = await getKnex()(tableMovie).where({ movieID: id }).del();
		if (ret === 0) {
			throw ServiceError.notFound(`Movie with id ${id} not found`);
		}
	} catch (error) {
		const logger = getChildLogger('movieRepo');
		logger.error('Error deleting movie: ' + error);
		throw error;
	}
};
