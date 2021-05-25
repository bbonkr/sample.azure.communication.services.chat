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

export const userState = combineReducers({
    isLoadingUser,
    user,
    userError,
});

export type UserState = ReturnType<typeof userState>;
