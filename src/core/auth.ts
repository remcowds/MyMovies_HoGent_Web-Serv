import type { Context } from 'koa';
import * as userService from '../service/userService';

//aangemeld zijn afdwingen
export async function requireAuthentication(ctx: Context, next: Function) {
	const { authorization } = ctx.headers;

	const { authToken, ...session } = await userService.checkAndParseSession(
		authorization
	);

	ctx.state.session = session;
	ctx.state.authToken = authToken;

	return next();
}
