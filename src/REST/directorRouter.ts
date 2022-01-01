import Router from '@koa/router';
import type { Context } from 'koa';
import { requireAuthentication } from '../core/auth';
import * as directorService from '../service/directorService';

const getAllDirectors = async (ctx: Context) => {
	ctx.body = await directorService.getAllDirectors();
};

const getDirectorByID = async (ctx: Context) => {
	ctx.body = await directorService.getDirectorByID(ctx.params.id);
};

const updateDirector = async (ctx: Context) => {
	ctx.body = await directorService.updateDirector(
		ctx.params.id,
		ctx.request.body
	);
};

const createDirector = async (ctx: Context) => {
	ctx.body = await directorService.createDirector(ctx.request.body);
	ctx.status = 201;
};

const removeDirector = async (ctx: Context) => {
	await directorService.removeDirector(ctx.params.id);
	ctx.status = 204;
};

export function installDirectorRouter(superRouter: Router) {
	const router = new Router({
		prefix: '/directors',
	});

	//bekijken mag iedereen, aanpassen, verwijderen en nieuwe maken niet
	router.get('/', getAllDirectors);
	router.get('/:id', getDirectorByID);
	router.put('/:id', requireAuthentication, updateDirector);
	router.post('/', requireAuthentication, createDirector);
	router.delete('/:id', requireAuthentication, removeDirector);

	superRouter.use(router.routes()).use(router.allowedMethods());
}
