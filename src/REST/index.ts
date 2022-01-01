import Router from '@koa/router';
import { installCategoryRouter } from './categoryRouter';
import { installDirectorRouter } from './directorRouter';
import { installMovieRouter } from './movieRouter';
import { installUserRouter } from './userRouter';

import type Koa from 'koa';

export function installRest(app: Koa) {
	const router = new Router({
		prefix: '/api',
	});

	installMovieRouter(router);
	installCategoryRouter(router);
	installDirectorRouter(router);
	installUserRouter(router);

	app.use(router.routes()).use(router.allowedMethods());
}
