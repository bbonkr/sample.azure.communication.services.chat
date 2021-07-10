import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import { ChatMessageReceivedEvent } from '@azure/communication-signaling';
import {
    AddChatMessagesModel,
    AddParticipantsModel,
    ChatParticipant,
    ClearParticipantsModel,
    RemoveParticipantModel,
} from '../../models/ChatClient';
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
import {
    GetUserApiResponseModel,
    GetUserResponseModel,
} from '../../models/UserClient';

const getThreads = createAsyncAction(
    'get-threads/request',
    'get-threads/success',
    'get-threads/failure',
)<GetThreadsRequestModel, GetThreadsApiResponseModel, ApiResponseModel>();

const createThread = createAsyncAction(
    'create-thread/request',
    'create-thread/success',
    'create-thread/failure',
)<CreateThreadRequestModel, CreateThreadApiResponseModel, ApiResponseModel>();

const joinThread = createAsyncAction(
    'join-thread/request',
    'join-thread/success',
    'join-thread/failure',
)<JoinThreadRequestModel, JoinThreadApiResponseModel, ApiResponseModel>();

const leaveThread = createAsyncAction(
    'leave-thread/request',
    'leave-thread/success',
    'leave-thread/failure',
)<LeaveThreadRequestModel, LeaveThreadApiResponseModel, ApiResponseModel>();

const deleteThread = createAsyncAction(
    'delete-thread/request',
    'delete-thread/success',
    'delete-thread/failure',
)<DeleteThreadRequestModel, DeleteThreadApiResponseModel, ApiResponseModel>();

const sendMessage = createAsyncAction(
    'send-message/request',
    'send-message/success',
    'send-message/failure',
)<SendMessageRequestModel, SendMessageApiResponseModel, ApiResponseModel>();

const sendFile = createAsyncAction(
    'send-file/request',
    'send-file/success',
    'send-file/failure',
)<SendFileRequestModel, SendFileApiResponseModel, ApiResponseModel>();

const initializeChatClient = createAction(
    'initialize-chat-client/request',
)<GetUserResponseModel>();

const appendThread = createAction('append-thread')<GetThreadResponseModel>();

const updateThread =
    createAction('update-thread')<
        Pick<GetThreadResponseModel, 'id'> & Partial<GetThreadResponseModel>
    >();

const removeThread = createAction('remove-thread')<string>();

const selectThread =
    createAction('select-thread')<GetThreadResponseModel | undefined>();

const selectThreadId = createAction('select-thread-id')<string | undefined>();

const setChatThreadClient = createAction('set-chat-thread-client')<
    ChatThreadClient | undefined
>();

const addParticipants = createAction(
    'add-chat-participants',
)<AddParticipantsModel>();

const removeParticipant = createAction(
    'remove-chat-participant',
)<RemoveParticipantModel>();

const clearParticipants = createAction(
    'clear-chat-participants',
)<ClearParticipantsModel>();

const addChatMessages =
    createAction('add-chat-messages')<AddChatMessagesModel>();

const updateChatMessage = createAction('update-chat-message')<ChatMessage>();

const deleteChatMessage = createAction('delete-chat-message')<
    Partial<Pick<ChatMessage, 'id'>>
>();

const clearChatMessages = createAction('clear-chat-message')();

const clearSentMessageIds = createAction('clear-sent-message-ids')();

const setIsReadyChatClient = createAction(
    'set-chat-client-is-ready',
)<boolean>();

const setIsChatRealTimeNotificationStarted = createAction(
    'set-chat-client-started',
)<boolean>();

const setIsAddedChatClientEvents = createAction(
    'set-is-added-chat-client-events',
)<boolean>();

const addReceivedChatMessage = createAction(
    'add-received-chat-message',
)<ChatMessageReceivedEvent>();

const removeReceivedChatMessage = createAction(
    'remove-received-chat-message',
)<string>();

const clearReceivedChatMessage = createAction('clear-received-chat-message')();

export const chatActions = {
    getThreads,
    createThread,
    joinThread,
    leaveThread,
    deleteThread,
    sendMessage,
    sendFile,
    appendThread,
    updateThread,
    removeThread,
    selectThread,
    selectThreadId,
    setChatThreadClient,
    addParticipants,
    removeParticipant,
    clearParticipants,
    addChatMessages,
    updateChatMessage,
    deleteChatMessage,
    clearChatMessages,
    clearSentMessageIds,
    setIsReadyChatClient,
    setIsChatRealTimeNotificationStarted,
    setIsAddedChatClientEvents,

    // received message
    addReceivedChatMessage,
    removeReceivedChatMessage,
    clearReceivedChatMessage,

    initializeChatClient,
};

export type ChatActions = ActionType<typeof chatActions>;
