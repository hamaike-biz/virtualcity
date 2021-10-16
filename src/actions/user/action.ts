import {createAction} from 'typesafe-actions';

export const REQUEST_ME = 'REQUEST_ME';
export const requestMe = createAction(REQUEST_ME)<void>();

export const SET_USER = 'SET_USER';
export const setUser = createAction(SET_USER)<any>();
