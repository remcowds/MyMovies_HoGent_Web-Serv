import winston, { Logger } from 'winston';
import { TransformableInfo } from '../interfaces/interfaces';

const { combine, timestamp, colorize, printf, json } = winston.format;

let logger: Logger;

export const initializeLogger = (conf: {
	level: string;
	disabled: boolean;
	isProduction: boolean;
	defaultMeta: object;
}) => {
	logger = winston.createLogger({
		level: conf.level,
		defaultMeta: conf.defaultMeta,
		format: conf.isProduction
			? format('Production')
			: format('Development'),
		transports: [new winston.transports.Console()],
	});

	logger.info('logger has been initialized');
};

export const getLogger = () => {
	if (!logger) throw new Error('You have to init the logger first');
	return logger;
};

export const getChildLogger = (name: string, meta = {}) => {
	const prevName = logger.defaultMeta.name;
	return logger.child({
		name: prevName ? `${prevName}.${name}` : name,
		prevName,
		...meta,
	});
};

const format = (devProd: string) => {
	const formatMessage = (conf: {
		level: string;
		message: string;
		timestamp: string;
		name: string;
	}) =>
		`${conf.timestamp} | ${conf.name ?? `${devProd} server`} | ${
			conf.level
		} | ${conf.message}`;

	const format = (e: winston.Logform.TransformableInfo) => {
		return formatMessage(e as TransformableInfo);
	};

	return combine(colorize(), timestamp(), printf(format));
};
