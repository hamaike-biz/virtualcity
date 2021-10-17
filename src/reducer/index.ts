import {combineReducers} from '@reduxjs/toolkit';
import user from './user';
import land from './land';

export const createRootReducer = () => {
  return combineReducers({user, land});
};
