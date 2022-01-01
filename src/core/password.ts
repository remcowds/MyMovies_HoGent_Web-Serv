import config from 'config';
import * as argon2 from 'argon2';

const ARGON_SALT_LENGTH: number = config.get('auth.argon.saltLength');
const ARGON_HASH_LENGTH: number = config.get('auth.argon.hashLength');
const ARGON_TIME_COST: number = config.get('auth.argon.timeCost');
const ARGON_MEMORY_COST: number = config.get('auth.argon.memoryCost');

const argonOptions = {
	type: argon2.argon2id,
	saltLength: ARGON_SALT_LENGTH,
	hashLength: ARGON_HASH_LENGTH,
	timeCost: ARGON_TIME_COST,
	memoryCost: ARGON_MEMORY_COST,
};

export const hashPassword = async (password: string) => {
	//returns hashed password
	return await argon2.hash(password, argonOptions);
};

export const verifyPassword = async (
	password: string,
	passwordHash: string
) => {
	//returns valid / not
	return await argon2.verify(passwordHash, password, argonOptions);
};
