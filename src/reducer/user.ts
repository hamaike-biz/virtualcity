import {Reducer} from 'redux';
import {UserState} from '../models';
import {CommonActionTypeModel} from '../models';
import {SET_USER} from '../actions/user/action';

const initialState: UserState = {
  me: undefined,
  user: undefined
};

const user: Reducer<UserState, CommonActionTypeModel> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

export default user;
