import { getChildLogger } from '../core/logging';
import ServiceError from '../core/serviceError';
import { getKnex, tables } from '../data/indexData';
import { ifUser } from '../interfaces/interfaces';

const tableUser = tables.user;

export const getUserByID = async (email: string) => {
	try {
		const user: ifUser = await getKnex()(tableUser)
			.select()
			.where({ userEmail: email })
			.first();

		if (user) {
			return user;
		} else {
			throw ServiceError.notFound('No user found with email ' + email);
		}
	} catch (error) {
		const logger = getChildLogger('userRepo');
		logger.error('Error getting user: ' + error);
		throw error;
	}
};

export const createUser = async (
	userEmail: string,
	userName: string,
	passwordHash: string
) => {
	try {
		await getKnex()(tableUser).insert({
			userEmail,
			userName,
			passwordHash,
		});
	} catch (error) {
		const logger = getChildLogger('userRepo');
		logger.error('Error creating user: ' + error);
		throw new Error('failed to create: ' + error);
	}

	return await getUserByID(userEmail);
};

export const getAllUsers = async () => {
	return await getKnex()(tableUser).select();
};

export const updateUser = async (
	email: string,
	userName: string,
	passwordHash: string
) => {
	try {
		const ret = await getKnex()(tableUser)
			.where({ userEmail: email })
			.update({
				userName,
				passwordHash,
			});
		if (ret === 0) {
			throw ServiceError.notFound('No user fount with email ' + email);
		}
	} catch (error) {
		const logger = getChildLogger('userRepo');
		logger.error('Error updating user: ' + error);
		throw error;
	}
};

export const removeUser = async (email: string) => {
	try {
		const ret = await getKnex()(tableUser)
			.where({ userEmail: email })
			.del();
		if (ret === 0) {
			throw ServiceError.notFound(`User with email ${email} not found`);
		}
	} catch (error) {
		const logger = getChildLogger('userRepo');
		logger.error('Error deleting user', { error });
		throw error;
	}
};
