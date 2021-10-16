import {fork, take, call, SagaReturnType, takeLatest} from 'redux-saga/effects';
import {
  requestPurchaseLand,
  REQUEST_PURCHASE_LAND
} from '../actions/land/action';
import fetchPostJson from './fetchTools/fetchPostJson';
import fetchGetJson from './fetchTools/fetchGetJson';

function* purchaseLand(action: ReturnType<typeof requestPurchaseLand>) {
  console.log(action.payload);
  const results: SagaReturnType<typeof fetchPostJson> = yield call(
    fetchPostJson,
    `api/land/lands/`,
    action.payload
  );

  if (!(results instanceof Promise)) {
    console.log(results);
  }
}

const land = [takeLatest(REQUEST_PURCHASE_LAND, purchaseLand)];

export default land;
