import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useChatApi } from '../../hooks/useChatApi';
import { useUserApi } from '../../hooks/useUserApi';
import { SendMessageContentType } from '../../models/ChatClient';
import { AuthProvider } from '../AuthProvider';
import { ChatForm } from './ChatForm';
import { ChatMessageItem } from './ChatMessageItem';
import { JoinThreadDialog } from '../JoinThreadDialog';

import './style.css';
import { Modal } from '../Layouts';
import { setChatThreadClient } from '../../store/actions/chat';
import { ChatThreadClient } from '@azure/communication-chat';

export interface ChatProps {
    onClose?: () => void;
}

export const Chat = ({ onClose }: ChatProps) => {
    const { user } = useUserApi();
    const {
        threads,
        chatClient,
        selectedThread,
        messages,
        getMessagesAsync,
        sendMessageRequest,
        sendFileRequest,
        clearSelectedThread,
        leaveFromThreadRequest,
        setChatThreadClient,
    } = useChatApi();

    const [joinThreadDialogOpen, setJoinThreadDialogOpen] = useState(false);
    const [leaveThreadModalOpen, setLeaveThreadModalOpen] = useState(false);
    // Thread has been created on
    const [threadCreatedOn, setThreadCreatedOn] = useState<Date>();
    const [chatMessageStart, setChatMessageStart] = useState<Date>(() =>
        dayjs().add(-1, 'd').toDate(),
    );
    const [latestMessageId, setLatestMessageId] = useState('');

    const [threadClient, setThreadClient] = useState<ChatThreadClient>();

    const handleSendMessage = (message: string) => {
        console.info(
            'handleSendMessage:  user, selectedThread',
            user,
            selectedThread,
        );
        if (user && selectedThread) {
            const payload = {
                threadId: selectedThread.id,
                senderId: user.id,
                content: message,
                contentType: SendMessageContentType.Text,
            };

            sendMessageRequest(payload);
        }
    };

    const handleSendFiles = (files: File[]) => {
        if (files && user && selectedThread) {
            sendFileRequest({
                files: files,
                senderId: user?.id,
                threadId: selectedThread?.id,
            });
        }
    };

    const handleClickInvite = () => {
        setJoinThreadDialogOpen((_) => true);
    };

    const handleClickLeaveThread = () => {
        setLeaveThreadModalOpen((_) => true);
    };

    const handleClickClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleLeaveThreadModalClose = () => {
        setLeaveThreadModalOpen((_) => false);
    };

    const handleClickLeaveThreadActual = () => {
        if (selectedThread && user) {
            leaveFromThreadRequest({
                threadId: selectedThread?.id,
                participantIds: [user.id],
            });
        }
    };

    const handleClickGetPreviousChatMessages = () => {
        if (threadClient) {
            const start = dayjs(chatMessageStart).add(-1, 'd').toDate();
            setChatMessageStart((_) => start);

            getMessagesAsync(threadClient, start)
                .then(() => {
                    console.info('🔨 messages loaded');
                })
                .catch((err) => {
                    console.error('❌ messages could not load.', err);
                });
        }
    };

    useEffect(() => {
        if (chatClient && selectedThread) {
            const chatThreadClient = chatClient.getChatThreadClient(
                selectedThread.id,
            );
            if (chatThreadClient) {
                setChatThreadClient(chatThreadClient);
                setThreadClient((_) => chatThreadClient);

                const getThreadCreateOn = async () => {
                    const threadProperties =
                        await chatThreadClient.getProperties();
                    setThreadCreatedOn((_) => threadProperties.createdOn);
                };
                getThreadCreateOn();

                getMessagesAsync(chatThreadClient, chatMessageStart)
                    .then(() => {
                        console.info('🔨 messages loaded');
                    })
                    .catch((err) => {
                        console.error('❌ messages could not load.', err);
                    });
            }
        }
    }, [selectedThread]);

    useEffect(() => {
        if (messages && messages.length > 0) {
            if (latestMessageId !== messages[messages.length - 1].id) {
                setLatestMessageId((_) => messages[messages.length - 1].id);

                const scrollElement = document.querySelector('.chat-container');
                console.info('scroll element: ', scrollElement);
                if (scrollElement) {
                    const scrollHeight = scrollElement.scrollHeight;
                    console.info('scroll to: ', scrollHeight);
                    window.setTimeout(() => {
                        scrollElement.scrollTo({
                            top: scrollHeight,
                            left: 0,
                            behavior: 'smooth',
                        });
                    }, 200);
                }
            }
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            clearSelectedThread();
        };
    }, []);

    useEffect(() => {
        if (threads && selectedThread) {
            const found = threads.find((x) => x.id === selectedThread?.id);
            if (!found) {
                if (onClose) {
                    onClose();
                }
            }
        }
    }, [threads, selectedThread]);

    return (
        <AuthProvider>
            <div className="hero chat-container-height">
                <div className="hero-head">
                    <header className="hero is-link is-bold">
                        <div className="hero-body">
                            <div className="container">
                                <p className="title">{selectedThread?.topic}</p>

                                <div className="is-flex is-flex-wrap-wrap mb-3">
                                    {selectedThread?.participants.map((p) => (
                                        <span
                                            key={p.id}
                                            className="tag is-dark mr-1 mt-1"
                                        >
                                            {p.displayName}
                                        </span>
                                    ))}
                                </div>

                                <div className="field is-grouped">
                                    <div className="control">
                                        <button
                                            className="button"
                                            onClick={handleClickInvite}
                                        >
                                            Invite
                                        </button>
                                    </div>
                                    <div className="control">
                                        <button
                                            className="button"
                                            onClick={handleClickLeaveThread}
                                        >
                                            Leave
                                        </button>
                                    </div>
                                    <div className="control">
                                        <button
                                            className="button"
                                            onClick={handleClickClose}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
                <div className="hero-body has-background-light is-align-items-flex-start">
                    <div className="chat-container">
                        <ul className="is-flex is-flex-direction-column is-flex-grow-1 is-scroll-y ">
                            <li className="chat-message system">
                                <button
                                    className="button"
                                    disabled={
                                        !threadCreatedOn ||
                                        threadCreatedOn > chatMessageStart
                                    }
                                    onClick={handleClickGetPreviousChatMessages}
                                >
                                    Load more
                                </button>
                            </li>
                            {messages
                                .sort((a, b) =>
                                    a.createdOn > b.createdOn ? 1 : -1,
                                )
                                .map((m) => (
                                    <ChatMessageItem
                                        key={m.id}
                                        chatMessage={m}
                                        user={user ?? undefined}
                                    />
                                ))}
                        </ul>
                    </div>
                </div>
                <div className="hero-footer">
                    <ChatForm
                        onSendMessage={handleSendMessage}
                        onSendFile={handleSendFiles}
                    />
                </div>
            </div>

            <JoinThreadDialog
                open={joinThreadDialogOpen}
                onClose={() => setJoinThreadDialogOpen((_) => false)}
                thread={selectedThread ?? undefined}
            />
            <Modal
                open={leaveThreadModalOpen}
                title="Confirmation"
                footer={
                    <div className="field is-grouped">
                        <button
                            className="button is-warning"
                            onClick={handleClickLeaveThreadActual}
                        >
                            Leave
                        </button>
                        <button
                            className="button"
                            onClick={handleLeaveThreadModalClose}
                        >
                            No
                        </button>
                    </div>
                }
                onClose={handleLeaveThreadModalClose}
            >
                Do you leave this thread?
            </Modal>
        </AuthProvider>
    );
};

export default Chat;
