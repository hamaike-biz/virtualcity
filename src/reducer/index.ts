import {combineReducers} from '@reduxjs/toolkit';
import user from './user';

export const createRootReducer = () => {
  return combineReducers({user});
};
