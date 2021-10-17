import {Reducer} from 'redux';
import {LandState} from '../models';
import {CommonActionTypeModel} from '../models';
import {SUCCESS_ZONE_POSITIONS} from '../actions/land/action';

const initialState: LandState = {
  positions: undefined
};

const land: Reducer<LandState, CommonActionTypeModel> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SUCCESS_ZONE_POSITIONS:
      return {
        ...state,
        positions: action.payload
      };
    default:
      return state;
  }
};

export default land;
