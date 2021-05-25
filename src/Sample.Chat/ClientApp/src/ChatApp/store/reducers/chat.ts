import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { ApiResponseModel } from '../../models';
import { GetThreadResponseModel } from '../../models/ChatClient';
import { rootAction, RootAction } from '../actions';

export const isLoadingThreads = createReducer<boolean, RootAction>(false)
    .handleAction(
        [
            rootAction.chat.getThreads.request,
            rootAction.chat.createThread.request,
            rootAction.chat.joinThread.request,
            rootAction.chat.leaveThread.request,
            rootAction.chat.deleteThread.request,
            rootAction.chat.sendMessage.request,
            rootAction.chat.sendFile.request,
        ],
        (_, __) => true,
    )
    .handleAction(
        [
            rootAction.chat.getThreads.success,
            rootAction.chat.getThreads.failure,
            rootAction.chat.createThread.success,
            rootAction.chat.createThread.failure,
            rootAction.chat.joinThread.success,
            rootAction.chat.joinThread.failure,
            rootAction.chat.leaveThread.success,
            rootAction.chat.deleteThread.success,
            rootAction.chat.deleteThread.failure,
            rootAction.chat.sendMessage.success,
            rootAction.chat.sendMessage.failure,
            rootAction.chat.sendFile.success,
            rootAction.chat.sendFile.failure,
        ],
        (_, __) => false,
    );

export const threads = createReducer<GetThreadResponseModel[], RootAction>([])
    .handleAction([rootAction.chat.getThreads.success], (state, action) => {
        if (action.payload.data.currentPage === 1) {
            return [...action.payload.data.items];
        } else {
            return [...state, ...action.payload.data.items];
        }
    })
    .handleAction([rootAction.chat.appendThread], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload.id);
        if (index < 0) {
            return [action.payload, ...state];
        }
        return state;
    })
    .handleAction([rootAction.chat.removeThread], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload);
        if (index >= 0) {
            return [...state.splice(index, 1)];
        }
        return state;
    });

export const hasMoreThreads = createReducer<boolean, RootAction>(true)
    .handleAction([rootAction.chat.getThreads.success], (state, action) => {
        const { limit, items } = action.payload.data;
        const itemsCount = items.length;

        return itemsCount === limit;
    })
    .handleAction(
        [rootAction.chat.getThreads.failure],
        (state, action) => true,
    );

export const chatError = createReducer<ApiResponseModel | null, RootAction>(
    null,
)
    .handleAction(
        [
            rootAction.chat.getThreads.request,
            rootAction.chat.getThreads.success,
            rootAction.chat.createThread.request,
            rootAction.chat.createThread.success,
            rootAction.chat.joinThread.request,
            rootAction.chat.joinThread.success,
            rootAction.chat.leaveThread.request,
            rootAction.chat.leaveThread.success,
            rootAction.chat.deleteThread.request,
            rootAction.chat.deleteThread.success,
            rootAction.chat.sendMessage.request,
            rootAction.chat.sendMessage.success,
            rootAction.chat.sendFile.request,
            rootAction.chat.sendFile.success,
        ],
        (_, __) => null,
    )
    .handleAction(
        [
            rootAction.chat.getThreads.failure,
            rootAction.chat.createThread.failure,
            rootAction.chat.joinThread.failure,
            rootAction.chat.leaveThread.failure,
            rootAction.chat.deleteThread.failure,
            rootAction.chat.sendMessage.failure,
            rootAction.chat.sendFile.failure,
        ],
        (state, action) => action.payload,
    );

export const chatState = combineReducers({
    threads,
    isLoadingThreads,
    hasMoreThreads,
    chatError,
});

export type ChatState = ReturnType<typeof chatState>;
