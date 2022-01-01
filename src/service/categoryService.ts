import { ifCategory } from '../interfaces/interfaces';
import * as categoryRepos from '../repository/categoryRepos';

export const getAllCategories = async () => {
	return await categoryRepos.getAllCategories();
};

export const getCategoryByID = async (id: number) => {
	return await categoryRepos.getCategoryByID(id);
};

export const updateCategory = async (id: number, category: ifCategory) => {
	return await categoryRepos.updateCategory(id, category);
};

export const createCategory = async (category: ifCategory) => {
	return await categoryRepos.createCategory(category);
};

export const removeCategory = async (id: number) => {
	await categoryRepos.removeCategory(id);
};
