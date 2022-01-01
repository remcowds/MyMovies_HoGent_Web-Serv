import { ifMovie } from '../interfaces/interfaces';
import * as movieRepos from '../repository/movieRepos';

export const getAllMovies = async () => {
	//vanaf hier dus verwijzen naar repos
	return await movieRepos.getAllMovies();
};

export const getMovieByID = async (id: number) => {
	return await movieRepos.getMovieByID(id);
};

export const updateMovie = async (id: number, movie: ifMovie) => {
	return await movieRepos.updateMovie(id, movie);
};

export const createMovie = async (movie: ifMovie) => {
	return await movieRepos.createMovie(movie);
};

export const removeMovie = async (id: number) => {
	await movieRepos.removeMovie(id);
};
