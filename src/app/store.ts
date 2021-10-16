import {configureStore, applyMiddleware} from '@reduxjs/toolkit';
import {createRootReducer} from '../reducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../saga';

export const rootReducer = createRootReducer();
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
  devTools: true
});

sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
