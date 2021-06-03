import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import debounce from 'lodash/debounce';
import {
    ChatMessage,
    ChatClient,
    ChatThreadClient,
} from '@azure/communication-chat';
import {
    ParticipantsAddedEvent,
    ChatMessageReceivedEvent,
} from '@azure/communication-signaling';
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

export const useChatApi = () => {
    const dispatch = useDispatch();

    const state = useSelector<RootState, ChatState>((s) => s.chat);

    //#region chat client event listeners
    const handleChatMessageReceived = useCallback(
        (e: ChatMessageReceivedEvent) => {
            console.info('⚡ chatMessageReceived (e)', e);

            const chatMessage: ChatMessage = {
                ...e,
                content: {
                    message: e.message,
                },
                sequenceId: 'new message',
            };

            // addChatMessages(e.threadId, [chatMessage]);
            dispatch(rootAction.chat.addReceivedChatMessage(e));
        },
        [state],
    );
    //#endregion

    const startChatClient = debounce(() => {
        const { chatClient } = state;
        if (chatClient) {
            console.info('🔨 call: startChatClient', new Date().toISOString());

            // Must call startRealtimeNotifications() first
            chatClient
                .startRealtimeNotifications()
                .then(() => {
                    dispatch(
                        rootAction.chat.setIsChatRealTimeNotificationStarted(
                            true,
                        ),
                    );
                    console.info('🔨 Real-time notification started.');

                    // addEventListeners(state, dispatch);
                })
                .catch((err) => {
                    rootAction.chat.setIsChatRealTimeNotificationStarted(false);
                    console.error(
                        '❌ Cloud not start real-time notification',
                        err,
                    );
                });
        }
    }, 300);

    const addEventListeners = (chatClient: ChatClient) => {
        chatClient.on('chatThreadCreated', (e) => {
            console.info('⚡ chatThreadCreated', e);
        });

        chatClient.on('chatThreadPropertiesUpdated', (e) => {
            console.info('⚡ chatThreadPropertiesUpdated', e);

            e.threadId;
        });

        chatClient.on('chatMessageReceived', handleChatMessageReceived);

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
            console.info('⚡ participantsRemoved', e);
        });

        console.info('🔨 chatclient event is ready');

        dispatch(rootAction.chat.setIsAddedChatClientEvents(true));
    };

    const stopChatClient = () => {
        const { chatClient } = state;
        if (chatClient) {
            chatClient
                .stopRealtimeNotifications()
                .then(() => {
                    console.info('🔨 Real-time notification stopped.');
                })
                .catch((err) =>
                    console.error('❌ Could not stop real-time notification.'),
                );
        }
    };

    const addChatMessages = useCallback(
        (threadId: string, messages: ChatMessage[]) => {
            console.info(
                'addChatMessages',
                threadId,
                state.selectedThreadId,
                state.selectedThread,
                threadId === state.selectedThread?.id,
                threadId === state.selectedThreadId,
            );
            if (threadId === state.selectedThread?.id) {
            }
            dispatch(
                rootAction.chat.addChatMessages({
                    threadId: threadId,
                    messages,
                }),
            );
        },
        [state],
    );

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

    const getMessagesAsync = async (
        chatThreadClient: ChatThreadClient,
        startTime?: Date,
    ) => {
        const loadedMessage: ChatMessage[] = [];
        try {
            for await (const message of chatThreadClient.listMessages({
                maxPageSize: 20,
                startTime: startTime,
            })) {
                loadedMessage.push(message);
            }
        } catch (err) {
            console.error('❌ getMessagesAsync', err);
        }
        if (loadedMessage.length > 0) {
            addChatMessages(chatThreadClient.threadId, loadedMessage);
        }
    };

    useEffect(() => {
        if (state.receivedMessages) {
            state.receivedMessages.forEach((r) => {
                if (r.threadId === state.selectedThreadId) {
                    const chatMessage: ChatMessage = {
                        ...r,
                        content: {
                            message: r.message,
                        },
                        sequenceId: 'new message',
                    };

                    dispatch(
                        rootAction.chat.addChatMessages({
                            threadId: r.threadId,
                            messages: [chatMessage],
                        }),
                    );
                }

                dispatch(rootAction.chat.removeReceivedChatMessage(r.id));
            });
        }
    }, [state.receivedMessages]);

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
        addEventListeners,

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
