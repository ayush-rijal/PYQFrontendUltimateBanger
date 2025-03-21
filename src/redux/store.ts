
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './services/apiSlice';
import { qapiSlice } from './services/qapiSlice';
import authReducer from './features/authSlice';  //can be named anyting like authSlice but here default export is reducer itself so it would be suita;e
import { tdapiSlice } from './services/tdapislice';

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		[qapiSlice.reducerPath]: qapiSlice.reducer,
		[tdapiSlice.reducerPath]:tdapiSlice.reducer,
		auth: authReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(apiSlice.middleware, qapiSlice.middleware, tdapiSlice.middleware),
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<(typeof store)['getState']>;
export type AppDispatch = (typeof store)['dispatch'];

