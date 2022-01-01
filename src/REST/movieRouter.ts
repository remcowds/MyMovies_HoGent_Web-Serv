import Router from '@koa/router';
import type { Context } from 'koa';
import { requireAuthentication } from '../core/auth';
import * as movieService from '../service/movieService';

const getAllMovies = async (ctx: Context) => {
	ctx.body = await movieService.getAllMovies();
};

const getMovieByID = async (ctx: Context) => {
	ctx.body = await movieService.getMovieByID(ctx.params.id);
};

const createMovie = async (ctx: Context) => {
	ctx.body = await movieService.createMovie(ctx.request.body);
	ctx.status = 201;
};

const updateMovie = async (ctx: Context) => {
	ctx.body = await movieService.updateMovie(ctx.params.id, ctx.request.body);
};

const removeMovie = async (ctx: Context) => {
	await movieService.removeMovie(ctx.params.id);
	ctx.status = 204;
};

export function installMovieRouter(superRouter: Router) {
	const router = new Router({
		prefix: '/movies',
	});

	//bekijken mag iedereen, aanpassen, verwijderen en nieuwe maken niet
	router.get('/', getAllMovies);
	router.get('/:id', getMovieByID);
	router.put('/:id', requireAuthentication, updateMovie);
	router.post('/', requireAuthentication, createMovie);
	router.delete('/:id', requireAuthentication, removeMovie);

	superRouter.use(router.routes()).use(router.allowedMethods());
}
