import { getChildLogger } from '../core/logging';
import ServiceError from '../core/serviceError';
import { getKnex, tables } from '../data/indexData';
import { ifCategory } from '../interfaces/interfaces';

const tableCategory = tables.category;

export const getAllCategories = async () => {
	return await getKnex()(tableCategory).select();
};

export const getCategoryByID = async (id: number) => {
	try {
		const category = await getKnex()(tableCategory)
			.select()
			.where({ categoryID: id })
			.first();

		if (category) {
			return category;
		} else {
			throw ServiceError.notFound('No category found with id ' + id);
		}
	} catch (error) {
		const logger = getChildLogger('categoryRepo');
		logger.error('Error getting category: ' + error);
		throw error;
	}
};

export const updateCategory = async (id: number, category: ifCategory) => {
	const { categoryName, description, linkCat } = category;

	try {
		const ret = await getKnex()(tableCategory)
			.where({ categoryID: id })
			.update({
				categoryName,
				description,
				linkCat,
			});
		if (ret === 0)
			throw ServiceError.notFound('No category found with id ' + id);
	} catch (error) {
		const logger = getChildLogger('categoryRepo');
		logger.error('Error updating category: ' + error);
		throw error;
	}

	return await getCategoryByID(id);
};

export const createCategory = async (category: ifCategory) => {
	const { categoryName, description, linkCat } = category;

	try {
		const ret = await getKnex()(tableCategory).insert({
			categoryName,
			description,
			linkCat,
		});
		if (ret) {
			return category;
		}
	} catch (error) {
		const logger = getChildLogger('categoryRepo');
		logger.error('Error creating category', { error });
		throw error;
	}
};

export const removeCategory = async (id: number) => {
	try {
		const ret = await getKnex()(tableCategory)
			.where({ categoryID: id })
			.del();

		if (ret === 0) {
			throw ServiceError.notFound(`Category with id ${id} not found`);
		}
	} catch (error) {
		const logger = getChildLogger('categoryRepo');
		logger.error('Error deleting category', { error });
		throw error;
	}
};
