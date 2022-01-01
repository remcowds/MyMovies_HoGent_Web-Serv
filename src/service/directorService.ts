import { ifDirector } from '../interfaces/interfaces';
import * as directorRepos from '../repository/directorRepos';

export const getAllDirectors = async () => {
	return await directorRepos.getAllDirectors();
};

export const getDirectorByID = async (id: number) => {
	return await directorRepos.getDirectorByID(id);
};

export const updateDirector = async (id: number, director: ifDirector) => {
	return await directorRepos.updateDirector(id, director);
};

export const createDirector = async (director: ifDirector) => {
	return await directorRepos.createDirector(director);
};

export const removeDirector = async (id: number) => {
	await directorRepos.removeDirector(id);
};
