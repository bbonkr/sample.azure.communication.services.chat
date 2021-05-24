import { combineReducers } from 'redux';
import { chatState } from './chat';
import { userState } from './user';

export const rootState = combineReducers({
    chat: chatState,
    user: userState,
});

export type RootState = ReturnType<typeof rootState>;
