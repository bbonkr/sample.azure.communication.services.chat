import React, { useEffect, useState } from 'react';
import { GetUserResponseModel } from '../../models/UserClient';

interface UserListProps {
    users: GetUserResponseModel[];
    onChangeSelectedUser?: (selected: GetUserResponseModel[]) => void;
}

export const UserList = ({ users, onChangeSelectedUser }: UserListProps) => {
    const [selectedUsers, setSelectedUsers] = useState<GetUserResponseModel[]>(
        [],
    );

    const handleChangeCheck =
        (user: GetUserResponseModel) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            setSelectedUsers((prevState) => {
                if (checked) {
                    prevState.push(user);
                } else {
                    const index = prevState.findIndex((x) => x.id === user.id);
                    if (index >= 0) {
                        prevState.splice(index, 1);
                    }
                }

                return [...prevState];
            });
        };

    useEffect(() => {
        if (onChangeSelectedUser) {
            onChangeSelectedUser(selectedUsers);
        }
    }, [selectedUsers]);

    return (
        <ul>
            {users.length === 0 ? (
                <li>Search result is empty. Please try another keyword.</li>
            ) : (
                users.map((user) => (
                    <li className="mb-3" key={user.id}>
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                onChange={handleChangeCheck(user)}
                            />{' '}
                            {user.displayName}
                        </label>
                    </li>
                ))
            )}
        </ul>
    );
};
