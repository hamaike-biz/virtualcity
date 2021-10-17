import {
  fork,
  take,
  call,
  SagaReturnType,
  takeLatest,
  put
} from 'redux-saga/effects';
import {
  requestPurchaseLand,
  requestZonePositions,
  successZonePositions,
  REQUEST_PURCHASE_LAND,
  REQUEST_ZONE_POSITIONS
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

function* getZonePositions(action: ReturnType<typeof requestZonePositions>) {
  console.log(action.payload);
  const results: SagaReturnType<typeof fetchGetJson> = yield call(
    fetchGetJson,
    `api/land/positions/${action.payload}/`
  );

  if (!(results instanceof Promise)) {
    console.log(results);
    yield put(successZonePositions(results.data.detail));
  }
}

const land = [
  takeLatest(REQUEST_PURCHASE_LAND, purchaseLand),
  takeLatest(REQUEST_ZONE_POSITIONS, getZonePositions)
];

export default land;
