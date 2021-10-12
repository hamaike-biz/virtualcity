import {Reducer} from 'redux';
import {UserState} from '../models';
import {CommonActionTypeModel} from '../models';

const initialState: UserState = {
  me: undefined
};

const user: Reducer<UserState, CommonActionTypeModel> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default user;
