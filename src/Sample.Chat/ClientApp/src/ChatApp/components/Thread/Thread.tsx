import React, { useEffect, useState } from 'react';
import { useChatApi } from '../../hooks/useChatApi';
import { useMessaging } from '../../hooks/useMessaging';
import { useUserApi } from '../../hooks/useUserApi';
import { AuthProvider } from '../AuthProvider';
import { SendMessageContentType } from '../../models/ChatClient';
import { Chat } from '../Chat';

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
        selectedThread,
        selectThread,
        clearSelectedThread,
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

    const handleClickThread = (threadId: string) => () => {
        console.info('thread clicked. ', threadId);
        selectThread(threadId);
    };

    const handleCloseChat = () => {
        clearSelectedThread();
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
            <div className="is-flex ">
                <div className="">
                    <h2>Thread</h2>
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
                            <li key={t.id} onClick={handleClickThread(t.id)}>
                                {t.topic}
                                <ul>
                                    {t.participants.map((p) => (
                                        <li key={p.displayName}>
                                            {p.displayName}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedThread && <Chat onClose={handleCloseChat} />}
            </div>
        </AuthProvider>
    );
};

export default Thread;
