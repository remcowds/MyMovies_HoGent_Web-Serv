import config from 'config';
import jwt, {
	JwtPayload,
	SignCallback,
	VerifyCallback,
	VerifyErrors,
} from 'jsonwebtoken';
import { ifUser } from '../interfaces/interfaces';
import { getLogger } from './logging';
import ServiceError from './serviceError';

const JWT_AUDIENCE: string = config.get('auth.jwt.audience');
const JWT_ISSUER: string = config.get('auth.jwt.issuer');
const JWT_SECRET: string = config.get('auth.jwt.secret');
const JWT_EXPIRATION_INTERVAL: number = config.get(
	'auth.jwt.expirationInterval'
);

export const generateJWT = (user: ifUser) => {
	const tokenData = {
		userID: user.userEmail,
	};

	const signOptions = {
		expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 100), //seconden
		audience: JWT_AUDIENCE,
		issuer: JWT_ISSUER,
		subject: 'auth',
	};

	return new Promise((resolve, reject) => {
		const callback: SignCallback = (err, token) => {
			if (err) {
				getLogger().error('Error signing new token: ' + err.message);
				return reject(err);
			}
			return resolve(token);
		};

		jwt.sign(tokenData, JWT_SECRET, signOptions, callback);
	});
};

export const verifyJWT = (authToken: string) => {
	const verifyOptions = {
		audience: JWT_AUDIENCE,
		issuer: JWT_ISSUER,
		subject: 'auth',
	};

	return new Promise<jwt.JwtPayload>((resolve, reject) => {
		jwt.verify(
			authToken,
			JWT_SECRET,
			verifyOptions,
			(err, decodedToken) => {
				if (err || !decodedToken) {
					getLogger().error(
						'Error while verifying token: ',
						err?.message
					);
					return reject(
						err ||
							ServiceError.unauthorized(
								'Token could not be parsed'
							)
					);
				}
				return resolve(decodedToken);
			}
		);
	});
};
