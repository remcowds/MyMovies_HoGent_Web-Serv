import Router from '@koa/router';
import type { Context } from 'koa';
import { requireAuthentication } from '../core/auth';
import * as categoryService from '../service/categoryService';
import Joi from 'joi';
import { validate } from './validation';

const getAllCategories = async (ctx: Context) => {
	ctx.body = await categoryService.getAllCategories();
};

const getCategoryByID = async (ctx: Context) => {
	ctx.body = await categoryService.getCategoryByID(ctx.params.id);
};

getCategoryByID.validationScheme = {
	params: Joi.object({
		id: Joi.number().invalid(0).positive(),
	}),
};

const updateCategory = async (ctx: Context) => {
	ctx.body = await categoryService.updateCategory(
		ctx.params.id,
		ctx.request.body
	);
};

updateCategory.validationScheme = {
	params: Joi.object({
		id: Joi.number().invalid(0).positive(),
	}),
	body: Joi.object({
		categoryName: Joi.string().alphanum().min(2).required(),
		description: Joi.string().allow(null), //mag null zijn maar niet undefined
		linkCat: Joi.string()
			.pattern(
				/[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
			)
			.required(),
	}),
};

const createCategory = async (ctx: Context) => {
	ctx.body = await categoryService.createCategory(ctx.request.body);
	ctx.status = 201;
};

createCategory.validationScheme = {
	body: Joi.object({
		categoryName: Joi.string().alphanum().min(2).required(),
		description: Joi.string().allow(null), //mag ook null zijn maar niet undefined
		linkCat: Joi.string()
			.pattern(
				/[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
			)
			.required(),
	}),
};

const removeCategory = async (ctx: Context) => {
	await categoryService.removeCategory(ctx.params.id);
	ctx.status = 204;
};

export function installCategoryRouter(superRouter: Router) {
	const router = new Router({
		prefix: '/categories',
	});

	//bekijken mag iedereen, aanpassen, verwijderen en nieuwe maken niet
	router.get('/', getAllCategories);
	router.get(
		'/:id',
		validate(getCategoryByID.validationScheme),
		getCategoryByID
	);
	router.put(
		'/:id',
		requireAuthentication,
		validate(updateCategory.validationScheme),
		updateCategory
	);
	router.post(
		'/',
		requireAuthentication,
		validate(createCategory.validationScheme),
		createCategory
	);
	router.delete(
		'/:id',
		requireAuthentication,
		validate(getCategoryByID.validationScheme), //gwn check op ID
		removeCategory
	);

	superRouter.use(router.routes()).use(router.allowedMethods());
}
