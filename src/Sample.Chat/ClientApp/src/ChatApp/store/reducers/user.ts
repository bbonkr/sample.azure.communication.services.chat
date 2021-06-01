import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { ApiResponseModel } from '../../models';
import { GetUserResponseModel } from '../../models/UserClient';
import { rootAction, RootAction } from '../actions';

export const isLoadingUser = createReducer<boolean, RootAction>(false)
    .handleAction(
        [
            rootAction.user.loadUser.request,
            rootAction.user.createUser.request,
            rootAction.user.deleteUser.request,
        ],
        (_, __) => true,
    )
    .handleAction(
        [
            rootAction.user.loadUser.success,
            rootAction.user.loadUser.failure,
            rootAction.user.createUser.success,
            rootAction.user.createUser.failure,
            rootAction.user.deleteUser.success,
            rootAction.user.deleteUser.failure,
        ],
        (_, __) => false,
    );

export const user = createReducer<GetUserResponseModel | null, RootAction>(null)
    .handleAction(
        [rootAction.user.loadUser.success, rootAction.user.createUser.success],
        (state, action) => action.payload.data,
    )
    .handleAction(
        [
            rootAction.user.loadUser.request,
            rootAction.user.loadUser.failure,
            rootAction.user.createUser.request,
            rootAction.user.createUser.failure,
            rootAction.user.deleteUser.request,
            rootAction.user.deleteUser.request,
            rootAction.user.deleteUser.success,
            rootAction.user.deleteUser.failure,
            rootAction.user.clearUser,
        ],
        (_, __) => null,
    );

export const userError = createReducer<ApiResponseModel | null, RootAction>(
    null,
)
    .handleAction(
        [
            rootAction.user.loadUser.failure,
            rootAction.user.createUser.failure,
            rootAction.user.deleteUser.failure,
        ],
        (_, action) => action.payload,
    )
    .handleAction(
        [
            rootAction.user.loadUser.request,
            rootAction.user.loadUser.success,
            rootAction.user.createUser.request,
            rootAction.user.createUser.success,
            rootAction.user.deleteUser.request,
            rootAction.user.deleteUser.success,
            rootAction.user.clearUser,
        ],
        (_, __) => null,
    );

const users = createReducer<GetUserResponseModel[], RootAction>(
    [],
).handleAction([rootAction.user.getUsers.success], (state, action) => {
    if (action.payload.data.currentPage === 1) {
        return action.payload.data.items;
    } else {
        return [...(state ?? []), ...action.payload.data.items];
    }
});

const isLoadingUsers = createReducer<boolean, RootAction>(false)
    .handleAction([rootAction.user.getUsers.request], (_, __) => true)
    .handleAction(
        [rootAction.user.getUsers.success, rootAction.user.getUsers.failure],
        (_, __) => false,
    );

const getUsersError = createReducer<ApiResponseModel | null, RootAction>(null)
    .handleAction(
        [rootAction.user.getUsers.failure],
        (_, action) => action.payload,
    )
    .handleAction(
        [rootAction.user.getUsers.request, rootAction.user.getUsers.success],
        (_, __) => null,
    );

const hasMoreGetUsers = createReducer<boolean, RootAction>(true)
    .handleAction([rootAction.user.getUsers.success], (_, action) => {
        return action.payload.data.items.length >= action.payload.data.limit;
    })
    .handleAction([rootAction.user.getUsers.failure], (_, __) => true);

export const userState = combineReducers({
    isLoadingUser,
    user,
    userError,
    users,
    isLoadingUsers,
    getUsersError,
    hasMoreGetUsers,
});

export type UserState = ReturnType<typeof userState>;
