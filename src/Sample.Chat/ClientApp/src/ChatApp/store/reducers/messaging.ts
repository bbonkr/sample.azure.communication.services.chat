import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { rootAction, RootAction } from '../actions';
import { MessageModel } from '../../models';

const messages = createReducer<MessageModel[], RootAction>([])
    .handleAction([rootAction.messaging.addMessage], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload.id);

        if (index >= 0) {
            return [...state];
        } else {
            return [...state, action.payload];
        }
    })
    .handleAction([rootAction.messaging.removeMessage], (state, action) => {
        const item = state.find((x) => x.id === action.payload);
        if (item) {
            const next = state.filter((x) => x.id !== item.id);
            console.info('removeMessage: id,  next', action.payload, next);
            return [...next];
        }

        return state;
    })
    .handleAction([rootAction.chat.clearChatMessages], (_, __) => []);

export const messagingState = combineReducers({ messages });

export type MessagingState = ReturnType<typeof messagingState>;
