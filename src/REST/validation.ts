import Joi, { any, object, ValidationError, ValidationOptions } from 'joi';
import type { Context } from 'koa';
import ServiceError from '../core/serviceError';
import { ifSchema, resultFormatJoiError } from '../interfaces/interfaces';

const JOI_OPTIONS: ValidationOptions = {
	abortEarly: true, //indien 1 fout direct stoppen
	allowUnknown: false,
	convert: true,
	presence: 'required',
};

const formatJoiError = (error: ValidationError) =>
	error.details.reduce(
		(resultObj: resultFormatJoiError, { message, path, type }) => {
			const joinedPath = path.join('.') || 'value';
			if (!resultObj[joinedPath]) {
				resultObj[joinedPath] = [];
			}
			resultObj[joinedPath].push({
				type,
				message,
			});

			return resultObj;
		},
		{}
	);

export const validate = (schema: ifSchema) => {
	if (!schema) {
		schema = {
			query: undefined,
			body: undefined,
			params: undefined,
		};
	}

	return (ctx: Context, next: Function) => {
		const errors = {
			query: {},
			body: {},
			params: {},
		};

		//query valideren
		if (schema.query) {
			if (!Joi.isSchema(schema.query)) {
				schema.query = Joi.object(schema.query || {});
			}

			const { error: queryErrors, value: queryValue } =
				schema.query.validate(ctx.query, JOI_OPTIONS);

			if (queryErrors) {
				errors.query = formatJoiError(queryErrors);
			} else {
				ctx.query = queryValue;
			}
		}
		//body
		if (schema.body) {
			if (!Joi.isSchema(schema.body)) {
				schema.body = Joi.object(schema.body || {});
			}

			const { error: bodyErrors, value: bodyValues } =
				schema.body.validate(ctx.request.body, JOI_OPTIONS);

			if (bodyErrors) {
				errors.body = formatJoiError(bodyErrors);
			} else {
				ctx.request.body = bodyValues;
			}
		}
		//params
		if (schema.params) {
			if (!Joi.isSchema(schema.params)) {
				schema.params = Joi.object(schema.params || {});
			}

			const { error: paramsErrors, value: paramsValue } =
				schema.params.validate(ctx.params, JOI_OPTIONS);

			if (paramsErrors) {
				errors.params = formatJoiError(paramsErrors);
			} else {
				ctx.params = paramsValue;
			}
		}

		//indien er errors zijn
		if (
			Object.entries(errors.body).length !== 0 ||
			Object.entries(errors.query).length !== 0 ||
			Object.entries(errors.params).length !== 0
		) {
			throw ServiceError.validationFailed('Validation failed');
		}

		//return, niet await omdat er na de next niets meer gedaan moet worden
		return next();
	};
};
