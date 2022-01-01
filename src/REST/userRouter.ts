import Router from '@koa/router';
import type { Context } from 'koa';
import { requireAuthentication } from '../core/auth';
import * as userService from '../service/userService';

const login = async (ctx: Context) => {
	const { userEmail, password } = ctx.request.body;
	ctx.body = await userService.login(userEmail, password);
};

const register = async (ctx: Context) => {
	const { userEmail, userName, password } = ctx.request.body;
	ctx.body = await userService.register(userEmail, userName, password);
};

const getAllUsers = async (ctx: Context) => {
	ctx.body = await userService.getAllUsers();
};

const getUserByID = async (ctx: Context) => {
	ctx.body = await userService.getUserByID(ctx.params.id);
};

const updateUser = async (ctx: Context) => {
	ctx.body = await userService.updateUser(ctx.params.id, ctx.request.body);
};

const removeUser = async (ctx: Context) => {
	await userService.removeUser(ctx.params.id);
	ctx.status = 204;
};

export function installUserRouter(superRouter: Router) {
	const router = new Router({
		prefix: '/users',
	});

	router.post('/login', login);
	router.post('/register', register);

	//users: gevoelige informatie --> sws met auth
	router.get('/', requireAuthentication, getAllUsers);
	router.get('/:id', requireAuthentication, getUserByID);
	router.put('/:id', requireAuthentication, updateUser);
	router.delete('/:id', requireAuthentication, removeUser);

	superRouter.use(router.routes()).use(router.allowedMethods());
}
