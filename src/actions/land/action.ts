import {createAction} from 'typesafe-actions';

export const REQUEST_PURCHASE_LAND = 'REQUEST_PURCHASE_LAND';
export const requestPurchaseLand = createAction(REQUEST_PURCHASE_LAND)<any>();

export const REQUEST_ZONE_POSITIONS = 'REQUEST_ZONE_POSITIONS';
export const requestZonePositions = createAction(
  REQUEST_ZONE_POSITIONS
)<string>();
export const SUCCESS_ZONE_POSITIONS = 'SUCCESS_ZONE_POSITIONS';
export const successZonePositions = createAction(SUCCESS_ZONE_POSITIONS)<any>();
