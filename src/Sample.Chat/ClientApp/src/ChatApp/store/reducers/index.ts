import { combineReducers } from 'redux';
import { chatState } from './chat';
import { userState } from './user';
import { messagingState } from './messaging';

export const rootState = combineReducers({
    chat: chatState,
    user: userState,
    messaging: messagingState,
});

export type RootState = ReturnType<typeof rootState>;
