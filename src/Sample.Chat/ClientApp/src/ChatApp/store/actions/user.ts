import { ActionType, createAction, createAsyncAction } from 'typesafe-actions';
import { ApiResponseModel } from '../../models';
import {
    GetUserRequestModel,
    GetUserApiResponseModel,
    CreateUserRequestModel,
    CreateUserApiResponseModel,
    DeleteUserRequestModel,
    DeleteUserApiResponse,
    GetUsersRequestModel,
    GetUsersApiResponseModel,
} from '../../models/UserClient';

export const loadUser = createAsyncAction(
    'load-user/request',
    'load-user/success',
    'load-user/failure',
)<GetUserRequestModel, GetUserApiResponseModel, ApiResponseModel>();

export const createUser = createAsyncAction(
    'create-user/request',
    'create-user/success',
    'create-user/failure',
)<CreateUserRequestModel, CreateUserApiResponseModel, ApiResponseModel>();

export const deleteUser = createAsyncAction(
    'delete-user/request',
    'delete-user/success',
    'delete-user/failure',
)<DeleteUserRequestModel, DeleteUserApiResponse, ApiResponseModel>();

export const getUsers = createAsyncAction(
    'get-users/request',
    'get-users/success',
    'get-users/failure',
)<GetUsersRequestModel, GetUsersApiResponseModel, ApiResponseModel>();

export const clearUser = createAction('clear-user')();

export const userActions = {
    loadUser,
    createUser,
    deleteUser,
    getUsers,
    clearUser,
};

export type UserActions = ActionType<typeof userActions>;
