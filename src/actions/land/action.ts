import {createAction} from 'typesafe-actions';

export const REQUEST_PURCHASE_LAND = 'REQUEST_PURCHASE_LAND';
export const requestPurchaseLand = createAction(REQUEST_PURCHASE_LAND)<any>();
