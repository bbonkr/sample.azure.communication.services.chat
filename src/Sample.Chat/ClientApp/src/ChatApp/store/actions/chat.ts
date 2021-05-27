import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import { ChatParticipant } from '../../models/ChatClient';
import { ApiResponseModel } from '../../models';
import {
    CreateThreadApiResponseModel,
    CreateThreadRequestModel,
    DeleteThreadApiResponseModel,
    DeleteThreadRequestModel,
    GetThreadResponseModel,
    GetThreadsApiResponseModel,
    GetThreadsRequestModel,
    JoinThreadApiResponseModel,
    JoinThreadRequestModel,
    LeaveThreadApiResponseModel,
    LeaveThreadRequestModel,
    SendFileApiResponseModel,
    SendFileRequestModel,
    SendMessageApiResponseModel,
    SendMessageRequestModel,
} from '../../models/ChatClient';

export const getThreads = createAsyncAction(
    'get-threads/request',
    'get-threads/success',
    'get-threads/failure',
)<GetThreadsRequestModel, GetThreadsApiResponseModel, ApiResponseModel>();

export const createThread = createAsyncAction(
    'create-thread/request',
    'create-thread/success',
    'create-thread/failure',
)<CreateThreadRequestModel, CreateThreadApiResponseModel, ApiResponseModel>();

export const joinThread = createAsyncAction(
    'join-thread/request',
    'join-thread/success',
    'join-thread/failure',
)<JoinThreadRequestModel, JoinThreadApiResponseModel, ApiResponseModel>();

export const leaveThread = createAsyncAction(
    'leave-thread/request',
    'leave-thread/success',
    'leave-thread/failure',
)<LeaveThreadRequestModel, LeaveThreadApiResponseModel, ApiResponseModel>();

export const deleteThread = createAsyncAction(
    'delete-thread/request',
    'delete-thread/success',
    'delete-thread/failure',
)<DeleteThreadRequestModel, DeleteThreadApiResponseModel, ApiResponseModel>();

export const sendMessage = createAsyncAction(
    'send-message/request',
    'send-message/success',
    'send-message/failure',
)<SendMessageRequestModel, SendMessageApiResponseModel, ApiResponseModel>();

export const sendFile = createAsyncAction(
    'send-file/request',
    'send-file/success',
    'send-file/failure',
)<SendFileRequestModel, SendFileApiResponseModel, ApiResponseModel>();

export const appendThread =
    createAction('append-thread')<GetThreadResponseModel>();

export const removeThread = createAction('remove-thread')<string>();

export const selectThread =
    createAction('select-thread')<GetThreadResponseModel | undefined>();

export const setChatThreadClient = createAction('set-chat-thread-client')<
    ChatThreadClient | undefined
>();

export const addParticipants = createAction('add-chat-participants')<
    ChatParticipant[]
>();
export const removeParticipant = createAction('remove-chat-participant')<
    Partial<Pick<ChatParticipant, 'id'>>
>();

export const clearParticipants = createAction('clear-chat-participants')();

export const addChatMessages =
    createAction('add-chat-messages')<ChatMessage[]>();

export const updateChatMessage = createAction(
    'update-chat-message',
)<ChatMessage>();

export const deleteChatMessage = createAction('delete-chat-message')<
    Partial<Pick<ChatMessage, 'id'>>
>();

export const clearChatMessages = createAction('clear-chat-message')();

export const clearSentMessageIds = createAction('clear-sent-message-ids')();

export const chatActions = {
    getThreads,
    createThread,
    joinThread,
    leaveThread,
    deleteThread,
    sendMessage,
    sendFile,
    appendThread,
    removeThread,
    selectThread,
    setChatThreadClient,
    addParticipants,
    removeParticipant,
    clearParticipants,
    addChatMessages,
    updateChatMessage,
    deleteChatMessage,
    clearChatMessages,
    clearSentMessageIds,
};

export type ChatActions = ActionType<typeof chatActions>;
