import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
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
    AddChatMessagesModel,
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
import { AcsHelper } from '../../lib/AcsHelper';
import {
    GetUserApiResponseModel,
    GetUserResponseModel,
} from '../../models/UserClient';

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

    const startChatClient = useCallback(
        debounce(() => {
            const { chatClient } = state;
            if (chatClient) {
                console.info(
                    '🔨 call: startChatClient',
                    new Date().toISOString(),
                );

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
                        rootAction.chat.setIsChatRealTimeNotificationStarted(
                            false,
                        );
                        console.error(
                            '❌ Cloud not start real-time notification',
                            err,
                        );
                    });
            }
        }, 300),
        [],
    );

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
            dispatch(
                rootAction.chat.updateThread({
                    id: e.threadId,
                    topic: e.properties.topic,
                }),
            );
        });

        chatClient.on('chatMessageEdited', (e) => {
            console.info('⚡ chatMessageEdited', e);
        });

        chatClient.on('participantsAdded', (e) => {
            console.info('⚡ participantsAdded', e);

            dispatch(
                rootAction.chat.addParticipants({
                    threadId: e.threadId,
                    participants: e.participantsAdded.map((participant) => ({
                        id: AcsHelper.parseIdentifier(participant.id)?.id ?? '', // participant.id.kind,
                        displayName: participant.displayName,
                    })),
                }),
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
        (model: AddChatMessagesModel) => {
            if (model.threadId === state.selectedThread?.id) {
                dispatch(rootAction.chat.addChatMessages(model));
            }
        },
        [state],
    );

    const updateChatMessage = (message: ChatMessage) => {
        dispatch(rootAction.chat.updateChatMessage(message));
    };

    const deleteChatMessage = (message: Partial<Pick<ChatMessage, 'id'>>) => {
        dispatch(rootAction.chat.deleteChatMessage(message));
    };

    const updateThreadListOrder = (threadId: string, updateOn?: Date) => {
        let thread = state.threads.find((x) => x.id === threadId);

        if (!thread) {
            // get thread
        } else {
            thread.updatedOn = updateOn ?? new Date();

            dispatch(rootAction.chat.updateThread(thread));
        }
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
    ): Promise<ChatMessage[]> => {
        const loadedMessage: ChatMessage[] = [];

        let now = new Date();

        now = dayjs(now).add(-1, 'M').toDate();
        try {
            for await (const message of chatThreadClient.listMessages({
                maxPageSize: 20,
                startTime: startTime ?? now,
            })) {
                loadedMessage.push(message);
            }
        } catch (err) {
            console.error('❌ getMessagesAsync', err);
        }
        if (loadedMessage.length > 0) {
            addChatMessages({
                threadId: chatThreadClient.threadId,
                messages: loadedMessage,
            });
        }

        return loadedMessage;
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
                } else {
                    updateThreadListOrder(r.threadId, r.createdOn);
                }

                dispatch(rootAction.chat.removeReceivedChatMessage(r.id));
            });
        }
    }, [state.receivedMessages]);

    useEffect(() => {
        if (state.selectedThread) {
        }
    }, [state.selectedThread]);

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
        sendMessageRequest: (payload: SendMessageRequestModel) => {
            dispatch(rootAction.chat.sendMessage.request(payload));
            updateThreadListOrder(payload.threadId);
        },
        sendFileRequest: (payload: SendFileRequestModel) =>
            dispatch(rootAction.chat.sendFile.request(payload)),
        getMessagesAsync,
        startChatClient,
        stopChatClient,
        addEventListeners,
        setChatThreadClient: (payload?: ChatThreadClient) =>
            dispatch(rootAction.chat.setChatThreadClient(payload)),
        selectThread: (id: string) => {
            dispatch(rootAction.chat.setChatThreadClient(undefined));
            const { threads } = state;
            const found = threads.find((x) => x.id === id);

            dispatch(rootAction.chat.clearChatMessages());
            // dispatch(rootAction.chat.clearParticipants());
            dispatch(rootAction.chat.selectThreadId(id));
            dispatch(rootAction.chat.selectThread(found));
        },
        clearSelectedThread: () => {
            dispatch(rootAction.chat.clearChatMessages());
            // dispatch(rootAction.chat.clearParticipants());
            dispatch(rootAction.chat.selectThreadId(undefined));
            dispatch(rootAction.chat.selectThread(undefined));
            dispatch(rootAction.chat.setChatThreadClient(undefined));
        },
        addChatMessages,
        updateChatMessage,
        deleteChatMessage,
        initializeChatClient: (payload: GetUserResponseModel) =>
            dispatch(rootAction.chat.initializeChatClient(payload)),
    };
};

export type UseChatApi = ReturnType<typeof useChatApi>;
