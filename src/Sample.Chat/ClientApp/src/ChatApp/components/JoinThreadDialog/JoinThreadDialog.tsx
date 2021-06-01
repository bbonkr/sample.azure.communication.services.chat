import React from 'react';
import { useUserApi } from '../../hooks/useUserApi';
import { Modal } from '../Layouts';
import { UserList } from './UserList';

interface JoinThreadDialogProps {
    open?: boolean;
    onClose?: () => void;
}

export const JoinThreadDialog = ({ open, onClose }: JoinThreadDialogProps) => {
    const { users } = useUserApi();

    return (
        <Modal title="Thread" open={open} onClose={onClose}>
            <p>Create or join thread</p>
            <UserList users={users} />
        </Modal>
    );
};
