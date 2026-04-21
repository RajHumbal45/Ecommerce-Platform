import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from './rootReducer'
import { rootSaga } from './sagas/rootsaga'

export function makeStore() {
	const sagaMiddleware = createSagaMiddleware()

	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: false,
				immutableCheck: false
			}).concat(sagaMiddleware)
	})

	sagaMiddleware.run(rootSaga)

	return store
}

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const dispatch = store.dispatch

