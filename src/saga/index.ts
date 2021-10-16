import {all} from 'redux-saga/effects';

import land from './land';
import user from './user';

export default function* rootSage() {
  yield all([...land, ...user]);
}
