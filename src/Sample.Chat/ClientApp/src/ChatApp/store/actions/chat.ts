import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';
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
    SendFileApiResponseMode,
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
)<SendFileRequestModel, SendFileApiResponseMode, ApiResponseModel>();

export const appendThread =
    createAction('append-thread')<GetThreadResponseModel>();

export const removeThread = createAction('remove-thread')<string>();

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
};

export type ChatActions = ActionType<typeof chatActions>;
