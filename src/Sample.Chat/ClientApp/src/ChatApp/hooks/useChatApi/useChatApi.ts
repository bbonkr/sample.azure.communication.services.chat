import { useEffect, useState } from 'react';
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
import { ChatState, chatThreadClient } from '../../store/reducers/chat';

export const useChatApi = () => {
    const dispatch = useDispatch();

    const state = useSelector<RootState, ChatState>((s) => s.chat);

    const startChatClientAsync = async (): Promise<void> => {
        const { chatClient } = state;
        if (chatClient) {
            // Must call startRealtimeNotifications()
            await chatClient.startRealtimeNotifications();

            chatClient.on('chatThreadCreated', (e) => {
                console.info('⚡ chatThreadCreated', e);
            });

            chatClient.on('chatThreadPropertiesUpdated', (e) => {
                console.info('⚡ chatThreadPropertiesUpdated', e);
            });

            chatClient.on('chatMessageReceived', (e) => {
                console.info('⚡ chatMessageReceived', e);
                const chatMessage: ChatMessage = {
                    ...e,
                    content: {
                        message: e.message,
                    },
                    sequenceId: 'new message',
                };

                addChatMessages([chatMessage]);
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
    };

    const stopChatClientAsync = async (): Promise<void> => {
        const { chatClient } = state;
        if (chatClient) {
            await chatClient.stopRealtimeNotifications();
        }
    };

    const addChatMessages = (messages: ChatMessage[]) => {
        dispatch(rootAction.chat.addChatMessages(messages));
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
            throttle(async () => {
                try {
                    await startChatClientAsync();

                    console.info('Chat client prepared.');
                } catch (err) {
                    console.info('Chat client did not have prepared.', err);
                }
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
                addChatMessages(loadedMessage);
            }
        }
    };

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
        stopChatClientAsync: stopChatClientAsync,
        selectThread: (id: string) => {
            const { threads } = state;
            const found = threads.find((x) => x.id === id);
            dispatch(rootAction.chat.clearChatMessages());
            dispatch(rootAction.chat.clearParticipants());
            dispatch(rootAction.chat.selectThread(found));
        },
        clearSelectedThread: () => {
            dispatch(rootAction.chat.clearChatMessages());
            dispatch(rootAction.chat.clearParticipants());
            dispatch(rootAction.chat.selectThread(undefined));
        },
        addChatMessages,
        updateChatMessage,
        deleteChatMessage,
    };
};

export type UseChatApi = ReturnType<typeof useChatApi>;
