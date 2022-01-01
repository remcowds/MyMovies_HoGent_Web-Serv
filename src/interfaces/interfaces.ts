import { ObjectSchema } from 'joi';
import type Koa from 'koa';

export interface ifServer {
	getApp(): Koa;
	start(): Promise<void>;
	stop(): void;
}
export interface TransformableInfo {
	level: string;
	message: string;
	[key: string]: any;
}

export interface ifError {
	name: string;
	message: string;
	stack?: string;
	code?: string;
	details?: {};
	status?: number;
}

export interface TransformableInfo {
	timestamp: string;
	name: string;
}
export interface resultFormatJoiError {
	[joinedPath: string]: {}[];
}
export interface ifSchema {
	query?: ObjectSchema;
	body?: ObjectSchema;
	params?: ObjectSchema;
}
export interface JwtPayload {
	[key: string]: any;
	iss?: string | undefined;
	sub?: string | undefined;
	aud?: string | string[] | undefined;
	exp?: number | undefined;
	nbf?: number | undefined;
	iat?: number | undefined;
	jti?: string | undefined;
}
export interface JwtPayload {
	//custom data toevoegen ([key: string]:any)
	userID?: string;
}

export interface ifUser {
	userEmail: string;
	userName: string;
	password: string;
	passwordHash: string;
}
export interface ifCategory {
	categoryID?: number;
	categoryName: string;
	description: string;
	linkCat: string;
}

export interface ifDirector {
	directorID?: number;
	directorLastName: string;
	directorFirstName: string;
	birthdate: string;
	country: string;
	linkDir: string;
}

export interface ifMovie {
	categoryID: number;
	directorID: number;
	title: string;
	yearOfRelease: number;
	rating: number;
	durationInMinutes: number;
	linkMov: string;
}

export interface ifMovieFormat {
	movieID: number;
	categoryID: number;
	directorID: number;
	title: string;
	yearOfRelease: number;
	rating: number;
	durationInMinutes: number;
	linkMov: string;
	categoryName: string;
	description: string;
	linkCat: string;
	directorLastName: string;
	directorFirstName: string;
	birthdate: string;
	country: string;
	linkDir: string;
}
