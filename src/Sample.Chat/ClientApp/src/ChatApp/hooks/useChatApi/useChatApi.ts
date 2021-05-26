import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChatThreadClient, ChatMessage } from '@azure/communication-chat';
import {
    ChatParticipant,
    CreateThreadRequestModel,
    DeleteThreadRequestModel,
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

    const [participants, setParticipants] = useState<ChatParticipant[]>([]);
    const [chatThreadClient, setChatThreadClient] =
        useState<ChatThreadClient>();
    const [threadId, setThreadId] = useState<string>();
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const state = useSelector<RootState, ChatState>((s) => s.chat);

    useEffect(() => {
        if (state.chatClient) {
            state.chatClient.on('participantsAdded', (e) => {
                setParticipants((prevState) => {
                    e.participantsAdded.forEach((participant) => {
                        prevState.push({
                            displayName: participant.displayName,
                        });
                    });

                    return [...prevState];
                });
            });
        }
    }, [state.chatClient]);

    useEffect(() => {
        if (state.chatClient && threadId) {
            setMessages([]);
            setChatThreadClient((_) =>
                state.chatClient?.getChatThreadClient(threadId),
            );
        }
    }, [state.chatClient, threadId]);

    const getMessagesAsync = async () => {
        if (chatThreadClient) {
            const loadedMessage: ChatMessage[] = [];
            for await (const message of chatThreadClient.listMessages({
                maxPageSize: 20,
            })) {
                loadedMessage.push(message);
            }

            if (loadedMessage.length > 0) {
                setMessages((prevState) => [...loadedMessage, ...prevState]);
            }
        }
    };

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
    };
};

export type UseChatApi = ReturnType<typeof useChatApi>;
