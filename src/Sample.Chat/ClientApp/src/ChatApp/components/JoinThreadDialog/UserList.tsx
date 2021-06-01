import { map } from 'lodash';
import React from 'react';
import { GetUserResponseModel } from '../../models/UserClient';

interface UserListProps {
    users: GetUserResponseModel[];
}

export const UserList = ({ users }: UserListProps) => {
    return (
        <div>
            <ul>
                {users.map((user) => (
                    <li>{user.displayName}</li>
                ))}
            </ul>
        </div>
    );
};
