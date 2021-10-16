import {
  fork,
  take,
  TakeEffect,
  ForkEffect,
  takeLatest,
  call,
  put,
  SagaReturnType
} from 'redux-saga/effects';
import {REQUEST_ME, requestMe} from '../actions/user/action';
import fetchGetJson from './fetchTools/fetchGetJson';

function* getMe(action: ReturnType<typeof requestMe>) {
  const results: SagaReturnType<typeof fetchGetJson> = yield call(
    fetchGetJson,
    `api/user/users/`
  );
  if (!(results instanceof Promise)) {
    console.log(results);
  }
}

const user = [takeLatest(REQUEST_ME, getMe)];

export default user;
