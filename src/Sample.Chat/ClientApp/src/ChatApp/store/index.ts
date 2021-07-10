import { useMemo } from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootAction } from './actions';
import { rootEpic } from './epics';
import { rootState, RootState } from './reducers';
import { services, Services } from '../services';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const isProduction = process.env.NODE_ENV === 'production';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
    // blacklist: [],
};

const persistedReducer = persistReducer<RootState, RootAction>(
    persistConfig,
    rootState,
);

function makeStore(initialState?: RootState) {
    const epicMiddleware = createEpicMiddleware<
        RootAction,
        RootAction,
        RootState,
        Services
    >({
        dependencies: services,
    });

    const middlewares = [epicMiddleware];
    const enhancer = isProduction
        ? composeWithDevTools(applyMiddleware(...middlewares))
        : compose(applyMiddleware(...middlewares));

    const created = createStore(persistedReducer, initialState, enhancer);

    epicMiddleware.run(rootEpic);

    return created;
}

type Store = ReturnType<typeof makeStore>;

let store: Store | undefined;

export const initializeStore = (preloadedState?: RootState) => {
    let _store = store ?? makeStore(preloadedState);

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = makeStore({
            ...(store.getState() ?? {}),
            ...(preloadedState ?? {}),
        });
        // Reset the current store
        store = undefined;
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store;
    // Create the store once in the client
    if (!store) store = _store;

    return _store;
};

export function useStore(initialState?: RootState) {
    const store = useMemo(() => initializeStore(initialState), [initialState]);
    return store;
}
