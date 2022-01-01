import config from 'config';
import { ifUser, JwtPayload } from '../interfaces/interfaces';
import * as userRepos from '../repository/userRepos';
import { verifyPassword, hashPassword } from '../core/password';
import { generateJWT } from '../core/jwt';
import { verifyJWT } from '../core/jwt';
import ServiceError from '../core/serviceError';
import * as nodemailer from 'nodemailer';
import { getLogger } from '../core/logging';

//returns the token and the user's public attributes
const makeLoginData = async (user: ifUser) => {
	const token = await generateJWT(user);
	return {
		user: {
			userEmail: user.userEmail,
			userName: user.userName,
		},
		token,
	};
};

export const checkAndParseSession = async (authHeader: string | undefined) => {
	if (!authHeader) {
		throw ServiceError.unauthorized('Not signed in');
	}

	if (!authHeader.startsWith('Bearer ')) {
		throw ServiceError.validationFailed('Invalid auth token');
	}

	const authToken = authHeader.substr(7);

	//JWT verifieren
	try {
		const payload: JwtPayload = await verifyJWT(authToken);

		if (!payload.userID) {
			throw ServiceError.validationFailed('Invalid auth token');
		}

		const userID: string = payload.userID;

		return { userID, authToken };
	} catch (error) {
		throw ServiceError.validationFailed('Invalid auth token');
	}
};

export const login = async (email: string, password: string) => {
	//zien of de user er is, indien niet wordt error geworpen in repos
	const user = await userRepos.getUserByID(email);

	const passwordValid = await verifyPassword(password, user.passwordHash);

	if (!passwordValid) {
		throw ServiceError.validationFailed('wrong email / password');
	}
	return await makeLoginData(user);
};

const sendEmail = (email: string, name: string) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: config.get('gmail.gmail_adres'),
			pass: config.get('gmail.gmail_ww'),
		},
	});

	transporter.sendMail(
		{
			from: config.get('gmail.gmail_adres'),
			to: 'remcodesmedt31@hotmail.com',
			subject: 'Registration alert',
			text: `There has been a registration: \n\nUseremail: ${email} \n\nUsername: ${name}`,
		},
		(err, info) => {
			if (err) {
				getLogger().error(err);
			} else {
				getLogger().info('Mail sent.');
			}
		}
	);
};

export const register = async (
	email: string,
	name: string,
	password: string
) => {
	//ww hashen
	const passwordHash = await hashPassword(password);

	const user = await userRepos.createUser(email, name, passwordHash);

	//config variabelen leeg? -> geen mail sturen
	try {
		sendEmail(user.userEmail, user.userName);
	} catch (err) {
		getLogger().error(err);
	}

	return await makeLoginData(user);
};

export const getAllUsers = async () => {
	return await userRepos.getAllUsers();
};

export const getUserByID = async (email: string) => {
	return await userRepos.getUserByID(email);
};

export const updateUser = async (email: string, user: ifUser) => {
	const passwordHash = await hashPassword(user.password);

	return await userRepos.updateUser(email, user.userName, passwordHash);
};

export const removeUser = async (email: string) => {
	return await userRepos.removeUser(email);
};
