import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import {
    ChatClient,
    ChatMessage,
    ChatThreadClient,
} from '@azure/communication-chat';
import { ChatMessageReceivedEvent } from '@azure/communication-signaling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ApiResponseModel } from '../../models';
import {
    ChatParticipant,
    GetThreadResponseModel,
} from '../../models/ChatClient';
import { rootAction, RootAction } from '../actions';

const threadCompFn = (
    a: GetThreadResponseModel,
    b: GetThreadResponseModel,
): number =>
    (a.updatedOn ?? a.createdOn) > (b.updatedOn ?? b.createdOn) ? -1 : 1;

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
            return [...action.payload.data.items].sort(threadCompFn);
        } else {
            return [...state, ...action.payload.data.items].sort(threadCompFn);
        }
    })
    .handleAction([rootAction.chat.appendThread], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload.id);
        if (index < 0) {
            return [action.payload, ...state].sort(threadCompFn);
        }
        return state;
    })
    .handleAction([rootAction.chat.updateThread], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload.id);
        if (index >= 0) {
            state.splice(index, 1, { ...state[index], ...action.payload });
        }
        return state.sort(threadCompFn);
    })
    .handleAction([rootAction.chat.removeThread], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload);
        if (index >= 0) {
            state.splice(index, 1);
            return [...state].sort(threadCompFn);
        }
        return state;
    })
    .handleAction(
        [
            rootAction.chat.createThread.success,
            rootAction.chat.joinThread.success,
        ],
        (state, action) => {
            const index = state.findIndex(
                (x) => x.id === action.payload.data.id,
            );
            if (index >= 0) {
                state.splice(index, 1, action.payload.data);
            } else {
                state.splice(0, 0, action.payload.data);
            }

            return [...state].sort(threadCompFn);
        },
    )
    .handleAction([rootAction.chat.leaveThread.success], (state, action) => {
        const index = state.findIndex((x) => x.id === action.payload.data.id);

        if (index >= 0) {
            state.splice(index, 1);
        }

        return [...state].sort(threadCompFn);
    })
    .handleAction([rootAction.chat.addParticipants], (state, action) => {
        const thread = state.find((x) => x.id === action.payload.threadId);
        if (thread) {
            const index = state.findIndex(
                (x) => x.id === action.payload.threadId,
            );
            action.payload.participants.forEach((participant) => {
                const participantIndex = thread.participants.findIndex(
                    (x) => x.id === participant.id,
                );
                if (participantIndex < 0) {
                    thread.participants.push(participant);
                }
            });

            state.splice(index, 1, thread);
        }

        return [...state];
    })
    .handleAction([rootAction.chat.removeParticipant], (state, action) => {
        const thread = state.find((x) => x.id === action.payload.threadId);
        if (thread) {
            const index = state.findIndex(
                (x) => x.id === action.payload.threadId,
            );
            action.payload.participants.forEach((participant) => {
                const participantIndex = thread.participants.findIndex(
                    (x) => x.id === participant.id,
                );
                if (participantIndex >= 0) {
                    thread.participants.splice(participantIndex, 1);
                }
            });

            state.splice(index, 1, thread);
        }

        return [...state];
    })
    .handleAction([rootAction.chat.clearParticipants], (state, action) => {
        const thread = state.find((x) => x.id === action.payload.threadId);
        if (thread) {
            const index = state.findIndex(
                (x) => x.id === action.payload.threadId,
            );

            thread.participants = [];

            state.splice(index, 1, thread);
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
            if (state) {
                return state;
            }
            const { token, gatewayUrl } = action.payload.data;
            const tokenCredential = new AzureCommunicationTokenCredential(
                token,
            );
            const client = new ChatClient(gatewayUrl, tokenCredential);

            return client;
        },
    )
    .handleAction([rootAction.chat.initializeChatClient], (state, action) => {
        if (state) {
            return state;
        }
        const { token, gatewayUrl } = action.payload;
        const tokenCredential = new AzureCommunicationTokenCredential(token);
        const client = new ChatClient(gatewayUrl, tokenCredential);

        return client;
    })
    .handleAction(
        [
            rootAction.user.loadUser.request,
            rootAction.user.loadUser.failure,
            rootAction.user.createUser.request,
            rootAction.user.createUser.failure,
            rootAction.user.clearUser,
        ],
        (state, __) => {
            if (state) {
                state.stopRealtimeNotifications();
            }
            return null;
        },
    );

const selectedThread = createReducer<GetThreadResponseModel | null, RootAction>(
    null,
)
    .handleAction(
        [rootAction.chat.selectThread],
        (state, action) => action.payload ?? null,
    )
    .handleAction([rootAction.chat.addParticipants], (state, action) => {
        if (state && state?.id === action.payload.threadId) {
            action.payload.participants.forEach((participant) => {
                const participantIndex = state.participants.findIndex(
                    (x) => x.id === participant.id,
                );
                if (participantIndex < 0) {
                    state.participants.push(participant);
                }
            });

            return { ...state };
        }

        return state;
    })
    .handleAction([rootAction.chat.removeParticipant], (state, action) => {
        if (state && state?.id === action.payload.threadId) {
            action.payload.participants.forEach((participant) => {
                const participantIndex = state.participants.findIndex(
                    (x) => x.id === participant.id,
                );
                if (participantIndex >= 0) {
                    state.participants.splice(participantIndex, 1);
                }
            });

            return { ...state };
        }

        return state;
    })
    .handleAction([rootAction.chat.clearParticipants], (state, action) => {
        if (state && state?.id === action.payload.threadId) {
            state.participants = [];

            return { ...state };
        }

        return state;
    });

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

const isChatClientReady = createReducer<boolean, RootAction>(false)
    .handleAction([rootAction.chat.setIsReadyChatClient], (_, action) => true)
    .handleAction([rootAction.user.clearUser], (_, __) => false);

export const isChatRealTimeNotificationStarted = createReducer<
    boolean,
    RootAction
>(false)
    .handleAction(
        [rootAction.chat.setIsChatRealTimeNotificationStarted],
        (state, action) => action.payload,
    )
    .handleAction([rootAction.user.clearUser], (_, __) => false);

const isAddedChatClientEvents = createReducer<boolean, RootAction>(false)
    .handleAction(
        [rootAction.chat.setIsAddedChatClientEvents],
        (state, action) => action.payload,
    )
    .handleAction([rootAction.user.clearUser], (_, __) => false);

const receivedMessages = createReducer<ChatMessageReceivedEvent[], RootAction>(
    [],
)
    .handleAction([rootAction.chat.addReceivedChatMessage], (state, action) => {
        const found = state.find((x) => x.id === action.payload.id);
        if (!found) {
            state.push(action.payload);
        }

        return [...state];
    })
    .handleAction(
        [rootAction.chat.removeReceivedChatMessage],
        (state, action) => {
            const index = state.findIndex((x) => x.id === action.payload);

            if (index >= 0) {
                state.splice(index, 1);
            }

            return [...state];
        },
    )
    .handleAction([rootAction.chat.clearReceivedChatMessage], (_, __) => []);

export const chatState = combineReducers({
    threads,
    isLoadingThreads,
    hasMoreThreads,
    chatError,
    chatClient,
    selectedThread,
    selectedThreadId,
    chatThreadClient,
    messages,
    isChatClientReady,
    isChatRealTimeNotificationStarted,
    isAddedChatClientEvents,
    receivedMessages,
});

export type ChatState = ReturnType<typeof chatState>;
