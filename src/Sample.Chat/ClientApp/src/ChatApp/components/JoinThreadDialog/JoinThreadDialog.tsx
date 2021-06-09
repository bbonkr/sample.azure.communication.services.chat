import React, { useEffect, useMemo, useState } from 'react';
import throttle from 'lodash/throttle';
import { useUserApi } from '../../hooks/useUserApi';
import { GetThreadResponseModel } from '../../models/ChatClient';
import { Modal } from '../Layouts';
import { UserSearchForm } from './UserSearchForm';
import { UserList } from './UserList';
import { GetUserResponseModel } from '../../models/UserClient';
import { useChatApi } from '../../hooks/useChatApi';
import { TopicForm } from './TopicForm';

interface JoinThreadDialogProps {
    open?: boolean;
    thread?: GetThreadResponseModel;
    onClose?: () => void;
}

export const JoinThreadDialog = ({
    open,
    thread,
    onClose,
}: JoinThreadDialogProps) => {
    const USER_LIST_LIMIT = 10;
    const { user, users, getUsersRequest, hasMoreGetUsers, isLoadingUsers } =
        useUserApi();
    const { createThreadRequest, joinToThreadRequest, isLoadingThreads } =
        useChatApi();

    const [userListPage, setUserListPage] = useState(1);
    const [topic, setTopic] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<GetUserResponseModel[]>(
        [],
    );

    const canCreateOrJoin = useMemo(() => {
        if (!thread) {
            if (!topic) {
                return false;
            }
        }
        if (selectedUsers.length === 0) {
            return false;
        }

        return true;
    }, [thread, topic, selectedUsers]);

    const handleChangeSearchKeyword = throttle((keyword: string) => {
        if (!isLoadingUsers && keyword) {
            getUsersRequest({
                keyword: keyword,
                page: userListPage,
                limit: USER_LIST_LIMIT,
            });
        }
    }, 200);

    const handleChangeSelectedUser = (users: GetUserResponseModel[]) => {
        setSelectedUsers((_) => users);
    };

    const createThread = () => {
        if (user) {
            createThreadRequest({
                topic: topic,
                participantIds: [user.id, ...selectedUsers.map((x) => x.id)],
            });
        }
    };

    const joinThread = () => {
        if (thread && user) {
            joinToThreadRequest({
                threadId: thread.id,
                participantIds: [...selectedUsers.map((x) => x.id)],
            });
        }
    };

    const handleClickCreateOrJoin = () => {
        if (user) {
            if (thread) {
                joinThread();
            } else {
                createThread();
            }

            if (onClose) {
                onClose();
            }
        }
    };

    const handleChangeTopic = (topic: string) => {
        setTopic((_) => topic);
    };

    // useEffect(() => {
    //     console.info('change selected users', selectedUsers);
    // }, [selectedUsers]);

    return (
        <Modal
            title="Thread"
            open={open}
            onClose={onClose}
            footer={
                <div className="field is-grouped">
                    <button
                        className="button is-primary"
                        onClick={handleClickCreateOrJoin}
                        disabled={isLoadingThreads || !canCreateOrJoin}
                    >
                        {thread ? 'Invite' : 'Create'}
                    </button>
                    <button
                        className="button"
                        onClick={onClose}
                        disabled={isLoadingThreads}
                    >
                        Cancel
                    </button>
                </div>
            }
        >
            <p className="title">
                {thread ? `Join ${thread.topic}` : 'Create a new'} thread
            </p>

            {!thread && (
                <div className="p-3">
                    <TopicForm onChange={handleChangeTopic} />
                </div>
            )}

            <div className="p-3">
                <UserSearchForm onSearch={handleChangeSearchKeyword} />
            </div>
            <div className="p-3">
                <UserList
                    users={users.filter((x) => x.id !== user?.id)}
                    onChangeSelectedUser={handleChangeSelectedUser}
                />
            </div>
        </Modal>
    );
};
