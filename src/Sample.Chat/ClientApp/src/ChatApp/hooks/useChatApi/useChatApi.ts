import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import throttle from 'lodash/throttle';
import {
    ChatThreadClient,
    ChatMessage,
    ChatClient,
} from '@azure/communication-chat';
import {
    ChatParticipant,
    CreateThreadRequestModel,
    DeleteThreadRequestModel,
    GetThreadResponseModel,
    GetThreadsRequestModel,
    JoinThreadRequestModel,
    LeaveThreadRequestModel,
    SendFileRequestModel,
    SendMessageRequestModel,
} from '../../models/ChatClient';
import { rootAction } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { ChatState } from '../../store/reducers/chat';
import { threadId } from 'worker_threads';

export const useChatApi = () => {
    const dispatch = useDispatch();

    const state = useSelector<RootState, ChatState>((s) => s.chat);

    const startChatClient = () => {
        const { chatClient } = state;
        if (chatClient) {
            // Must call startRealtimeNotifications() first
            chatClient
                .startRealtimeNotifications()
                .then(() => {
                    dispatch(
                        rootAction.chat.setIsChatRealTimeNotificationStarted(
                            true,
                        ),
                    );
                    console.info('Real-time notification started.');
                })
                .catch((err) => {
                    rootAction.chat.setIsChatRealTimeNotificationStarted(false);
                    console.error(
                        'Cloud not start real-time notification',
                        err,
                    );
                });
        }
    };

    const stopChatClient = () => {
        const { chatClient } = state;
        if (chatClient) {
            chatClient
                .stopRealtimeNotifications()
                .then(() => {
                    console.info('Real-time notification stopped.');
                })
                .catch((err) =>
                    console.error('Could not stop real-time notification.'),
                );
        }
    };

    const addChatMessages = (threadId: string, messages: ChatMessage[]) => {
        console.info('addChatMessages', threadId, state);
        if (threadId === state.selectedThread?.id) {
            dispatch(
                rootAction.chat.addChatMessages({
                    threadId: threadId,
                    messages,
                }),
            );
        }
    };

    const updateChatMessage = (message: ChatMessage) => {
        dispatch(rootAction.chat.updateChatMessage(message));
    };

    const deleteChatMessage = (message: Partial<Pick<ChatMessage, 'id'>>) => {
        dispatch(rootAction.chat.deleteChatMessage(message));
    };

    const getChatMessage = (ids: string[]): ChatMessage[] => {
        const { chatThreadClient } = state;
        const chatMessages: ChatMessage[] = [];
        if (chatThreadClient) {
            ids.forEach(async (id) => {
                const chatMessage = await chatThreadClient.getMessage(id);
                chatMessages.push(chatMessage);
            });
        }

        return chatMessages;
    };

    useEffect(() => {
        if (state.chatClient) {
            throttle(() => {
                console.info('state.chatClient: ', state.chatClient);
                startChatClient();
            }, 200);
        }

        return () => {};
    }, [state.chatClient]);

    const getMessagesAsync = async (startTime?: Date) => {
        const { chatThreadClient } = state;
        if (chatThreadClient) {
            const loadedMessage: ChatMessage[] = [];
            try {
                for await (const message of chatThreadClient.listMessages({
                    maxPageSize: 20,
                    startTime: startTime,
                })) {
                    loadedMessage.push(message);
                }
            } catch (err) {
                console.error(err);
            }
            if (loadedMessage.length > 0) {
                addChatMessages(chatThreadClient.threadId, loadedMessage);
            }
        }
    };

    useEffect(() => {
        const { chatClient, isChatRealTimeNotificationStarted } = state;
        if (chatClient && isChatRealTimeNotificationStarted) {
            chatClient.on('chatThreadCreated', (e) => {
                console.info('⚡ chatThreadCreated', e);
            });

            chatClient.on('chatThreadPropertiesUpdated', (e) => {
                console.info('⚡ chatThreadPropertiesUpdated', e);
            });

            chatClient.on('chatMessageReceived', (e) => {
                console.info('⚡ chatMessageReceived (e)', e);

                const chatMessage: ChatMessage = {
                    ...e,
                    content: {
                        message: e.message,
                    },
                    sequenceId: 'new message',
                };

                addChatMessages(e.threadId, [chatMessage]);
            });

            chatClient.on('chatThreadDeleted', (e) => {
                console.info('⚡ chatThreadDeleted', e);
            });

            chatClient.on('chatThreadPropertiesUpdated', (e) => {
                console.info('⚡ chatThreadPropertiesUpdated', e);
            });

            chatClient.on('chatMessageEdited', (e) => {
                console.info('⚡ chatMessageEdited', e);
            });

            chatClient.on('participantsAdded', (e) => {
                console.info('⚡ participantsAdded', e);
                dispatch(
                    rootAction.chat.addParticipants(
                        e.participantsAdded.map((participant) => ({
                            id: '', // participant.id.kind,
                            displayName: participant.displayName,
                        })),
                    ),
                );
            });

            chatClient.on('participantsRemoved', (e) => {
                console.info('⚡ participantsAdded', e);
            });
        }
    }, [state.chatClient, state.isChatRealTimeNotificationStarted]);

    useEffect(() => {
        if (state.chatClient) {
            if (state.selectedThread) {
                const threadId = state.selectedThread.id;
                var threadClient =
                    state.chatClient?.getChatThreadClient(threadId);

                dispatch(rootAction.chat.setChatThreadClient(threadClient));
            } else {
                dispatch(rootAction.chat.setChatThreadClient(undefined));
            }
        }
    }, [state.chatClient, state.selectedThread]);

    return {
        ...state,

        getThreadsRequest: (payload: GetThreadsRequestModel) =>
            dispatch(rootAction.chat.getThreads.request(payload)),
        createThreadRequest: (payload: CreateThreadRequestModel) =>
            dispatch(rootAction.chat.createThread.request(payload)),
        joinToThreadRequest: (payload: JoinThreadRequestModel) =>
            dispatch(rootAction.chat.joinThread.request(payload)),
        leaveFromThreadRequest: (payload: LeaveThreadRequestModel) =>
            dispatch(rootAction.chat.leaveThread.request(payload)),
        deleteThreadRequest: (payload: DeleteThreadRequestModel) =>
            dispatch(rootAction.chat.deleteThread.request(payload)),
        sendMessageRequest: (payload: SendMessageRequestModel) =>
            dispatch(rootAction.chat.sendMessage.request(payload)),
        sendFileRequest: (payload: SendFileRequestModel) =>
            dispatch(rootAction.chat.sendFile.request(payload)),
        getMessagesAsync,
        startChatClient,
        stopChatClient,

        selectThread: (id: string) => {
            const { threads } = state;
            const found = threads.find((x) => x.id === id);
            dispatch(rootAction.chat.clearChatMessages());
            dispatch(rootAction.chat.clearParticipants());
            dispatch(rootAction.chat.selectThreadId(id));
            dispatch(rootAction.chat.selectThread(found));
        },
        clearSelectedThread: () => {
            dispatch(rootAction.chat.clearChatMessages());
            dispatch(rootAction.chat.clearParticipants());
            dispatch(rootAction.chat.selectThreadId(undefined));
            dispatch(rootAction.chat.selectThread(undefined));
        },
        addChatMessages,
        updateChatMessage,
        deleteChatMessage,
    };
};

export type UseChatApi = ReturnType<typeof useChatApi>;
