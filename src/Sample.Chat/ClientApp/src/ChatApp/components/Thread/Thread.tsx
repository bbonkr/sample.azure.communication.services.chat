import React, { useEffect, useState } from 'react';
import { useChatApi } from '../../hooks/useChatApi';
import { useMessaging } from '../../hooks/useMessaging';
import { useUserApi } from '../../hooks/useUserApi';
import { AuthProvider } from '../AuthProvider';

export const Thread = () => {
    const limit = 20;
    const { user } = useUserApi();
    const { addMessage } = useMessaging();
    const {
        threads,
        isLoadingThreads,
        getThreadsRequest,
        createThreadRequest,
        chatError,
    } = useChatApi();

    const [page, setPage] = useState(1);

    const handleCreateThread = () => {
        if (user) {
            createThreadRequest({
                topic: `sample ${new Date().toISOString()}`,
                participantIds: [user?.id],
            });
        }
    };

    useEffect(() => {
        if (user?.email) {
            getThreadsRequest({ email: user?.email, page, limit });
        }
    }, []);

    useEffect(() => {
        if (chatError) {
            addMessage({
                id: `${+new Date()}`,
                title: 'Notification',
                detail: <p>{chatError.message}</p>,
                color: 'is-danger',
            });
        }
    }, [chatError]);

    return (
        <AuthProvider>
            <div>
                <p>Thread</p>
                <div>
                    <button
                        type="button"
                        className="button is-primary"
                        onClick={handleCreateThread}
                        disabled={isLoadingThreads}
                    >
                        New thread
                    </button>
                </div>
                <ul>
                    {threads.map((t) => (
                        <li key={t.id}>
                            {t.topic}
                            <ul>
                                {t.participants.map((p) => (
                                    <li key={p.displayName}>{p.displayName}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthProvider>
    );
};

export default Thread;
