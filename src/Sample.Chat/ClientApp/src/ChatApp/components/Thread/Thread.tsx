import React, { useEffect, useState } from 'react';
import { useChatApi } from '../../hooks/useChatApi';
import { useMessaging } from '../../hooks/useMessaging';
import { useUserApi } from '../../hooks/useUserApi';
import { AuthProvider } from '../AuthProvider';
import { SendMessageContentType } from '../../models/ChatClient';
import { Chat } from '../Chat';
import { JoinThreadDialog } from '../JoinThreadDialog';
import { ThreadListItem } from './ThreadListItem';

export const Thread = () => {
    const limit = 20;
    const { user } = useUserApi();
    const { addMessage } = useMessaging();
    const {
        chatClient,
        threads,
        isLoadingThreads,
        getThreadsRequest,
        createThreadRequest,
        chatError,
        selectedThread,
        selectedThreadId,
        selectThread,
        clearSelectedThread,
        startChatClient,
        addEventListeners,
        isChatRealTimeNotificationStarted,
        isAddedChatClientEvents,
    } = useChatApi();

    const [page, setPage] = useState(1);
    const [joinThreadDialogOpen, setJoinThreadDialogOpen] = useState(false);

    const handleCreateThread = () => {
        if (user) {
            // createThreadRequest({
            //     topic: `sample ${new Date().toISOString()}`,
            //     participantIds: [user?.id],
            // });
            setJoinThreadDialogOpen((_) => true);
        }
    };

    const handleClickThread =
        (threadId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            console.info('thread clicked. ', threadId);
            selectThread(threadId);
        };

    const handleCloseChat = () => {
        clearSelectedThread();
    };

    const handleCloseJoinThreadDialog = () => {
        setJoinThreadDialogOpen((_) => false);
    };

    useEffect(() => {
        startChatClient();

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

    useEffect(() => {
        if (chatClient && isChatRealTimeNotificationStarted) {
            console.info(
                '🔨 isChatRealTimeNotificationStarted',
                isChatRealTimeNotificationStarted,
            );
            addEventListeners(chatClient);
        }
    }, [isChatRealTimeNotificationStarted]);

    useEffect(() => {
        console.info('selectedThreadId', selectedThread?.id, selectedThreadId);
    }, [selectedThread, selectedThreadId]);

    return (
        <AuthProvider>
            <div className="is-flex is-prevent-height-100">
                <div className="is-flex-1 is-scroll-y">
                    <div className="p-3">
                        <div className="mt-3">
                            <button
                                type="button"
                                className="button is-primary"
                                onClick={handleCreateThread}
                                disabled={isLoadingThreads}
                            >
                                New thread
                            </button>
                        </div>
                        <hr className="mt-3" />

                        <ul>
                            {threads.map((t) => (
                                <li className="mt-3" key={t.id}>
                                    <a
                                        href="#chat"
                                        onClick={handleClickThread(t.id)}
                                    >
                                        <ThreadListItem thread={t} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="is-flex-3 is-scroll-y chat-container">
                    {selectedThread && <Chat onClose={handleCloseChat} />}
                </div>
            </div>
            <JoinThreadDialog
                open={joinThreadDialogOpen}
                onClose={handleCloseJoinThreadDialog}
            />
        </AuthProvider>
    );
};

export default Thread;
