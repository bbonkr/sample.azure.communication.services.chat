import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import {
    ChatClient,
    ChatMessage,
    ChatThreadClient,
} from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ApiResponseModel } from '../../models';
import {
    ChatParticipant,
    GetThreadResponseModel,
} from '../../models/ChatClient';
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
    })
    .handleAction([rootAction.chat.createThread.success], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload.data.id);
        if (index >= 0) {
            state.splice(index, 1, action.payload.data);
        } else {
            state.splice(0, 0, action.payload.data);
        }

        return [...state];
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

const chatClient = createReducer<ChatClient | null, RootAction>(null)
    .handleAction(
        [rootAction.user.loadUser.success, rootAction.user.createUser.success],
        (state, action) => {
            console.info(action.type);
            const { token, gatewayUrl } = action.payload.data;
            const tokenCredential = new AzureCommunicationTokenCredential(
                token,
            );
            const client = new ChatClient(gatewayUrl, tokenCredential);
            return client;
        },
    )
    .handleAction(
        [
            rootAction.user.loadUser.request,
            rootAction.user.loadUser.failure,
            rootAction.user.createUser.request,
            rootAction.user.createUser.failure,
            rootAction.user.clearUser,
        ],
        (_, __) => null,
    );

const selectedThread = createReducer<GetThreadResponseModel | null, RootAction>(
    null,
).handleAction(
    [rootAction.chat.selectThread],
    (state, action) => action.payload ?? null,
);

const selectedThreadId = createReducer<string | null, RootAction>(
    null,
).handleAction(
    [rootAction.chat.selectThreadId],
    (state, action) => action.payload ?? null,
);

const messages = createReducer<ChatMessage[], RootAction>([])
    .handleAction(
        [rootAction.chat.sendMessage.success, rootAction.chat.sendFile.success],
        (state, action) => {
            console.info(
                'redux: rootAction.chat.sendMessage.success, rootAction.chat.sendFile.success',
                action.payload.data,
            );
            action.payload.data.forEach((message) => {
                const index = state.findIndex((x) => x.id === message.id);
                if (index < 0) {
                    state.push(message);
                }
            });

            return [...state];
        },
    )
    .handleAction([rootAction.chat.addChatMessages], (state, action) => {
        action.payload.messages
            .sort((a, b) => (a.createdOn > b.createdOn ? 1 : -1))
            .forEach((m) => {
                const message = state.find((x) => x.id === m.id);
                if (!message) {
                    state.push(m);
                }
            });

        return [...state];
    })
    .handleAction([rootAction.chat.updateChatMessage], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload.id);
        if (index >= 0) {
            state.splice(index, 1, action.payload);
        }

        return [...state];
    })
    .handleAction([rootAction.chat.deleteChatMessage], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload.id);

        if (index >= 0) {
            state.splice(index, 1);
        }

        return [...state];
    })
    .handleAction([rootAction.chat.clearChatMessages], (_, __) => []);

export const chatThreadClient = createReducer<
    ChatThreadClient | null,
    RootAction
>(null).handleAction(
    [rootAction.chat.setChatThreadClient],
    (state, action) => action.payload ?? null,
);

export const participants = createReducer<ChatParticipant[], RootAction>([])
    .handleAction([rootAction.chat.addParticipants], (state, action) => {
        action.payload.forEach((p) => {
            const index = state.findIndex((x) => x.id === p.id);
            if (index < 0) {
                state.push(p);
            }
        });

        return [...state];
    })
    .handleAction([rootAction.chat.removeParticipant], (state, action) => {
        const index = state.findIndex((x) => x.id == action.payload.id);
        if (index >= 0) {
            state.splice(index, 1);
        }

        return [...state];
    })
    .handleAction([rootAction.chat.clearParticipants], (_, __) => []);

export const isChatRealTimeNotificationStarted = createReducer<
    boolean,
    RootAction
>(false).handleAction(
    [rootAction.chat.setIsChatRealTimeNotificationStarted],
    (_, action) => action.payload,
);

export const chatState = combineReducers({
    threads,
    isLoadingThreads,
    hasMoreThreads,
    chatError,
    chatClient,
    selectedThread,
    selectedThreadId,
    chatThreadClient,
    participants,
    messages,
    isChatRealTimeNotificationStarted,
});

export type ChatState = ReturnType<typeof chatState>;
