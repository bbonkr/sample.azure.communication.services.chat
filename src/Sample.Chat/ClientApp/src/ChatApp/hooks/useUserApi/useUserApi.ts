import { useSelector, useDispatch } from 'react-redux';
import {
    CreateUserRequestModel,
    DeleteUserRequestModel,
    GetUserRequestModel,
    GetUsersRequestModel,
} from '../../models/UserClient';
import { rootAction } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { UserState } from '../../store/reducers/user';

export const useUserApi = () => {
    const dispatch = useDispatch();
    const state = useSelector<RootState, UserState>((s) => s.user);
    return {
        ...state,

        getUserRequest: (payload: GetUserRequestModel) =>
            dispatch(rootAction.user.loadUser.request(payload)),
        createUserRequest: (payload: CreateUserRequestModel) =>
            dispatch(rootAction.user.createUser.request(payload)),
        deleteUserRequest: (payload: DeleteUserRequestModel) =>
            dispatch(rootAction.user.deleteUser.request(payload)),
        getUsersRequest: (payload: GetUsersRequestModel) =>
            dispatch(rootAction.user.getUsers.request(payload)),
    };
};

export type UseUserApi = ReturnType<typeof useUserApi>;
