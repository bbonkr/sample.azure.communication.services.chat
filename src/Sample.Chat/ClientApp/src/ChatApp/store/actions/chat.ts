import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';
import { ApiResponseModel } from '../../models';
import {
    CreateThreadApiResponseModel,
    CreateThreadRequestModel,
    DeleteThreadApiResponseModel,
    DeleteThreadRequestModel,
    GetThreadsApiResponseModel,
    GetThreadsRequestModel,
    JoinThreadApiResponseModel,
    JoinThreadRequestModel,
    LeaveThreadApiResponseModel,
    LeaveThreadRequestModel,
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
