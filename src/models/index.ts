import {rootReducer} from '../app/store';

export * from './common';
export * from './user';

export type RootState = ReturnType<typeof rootReducer>;
