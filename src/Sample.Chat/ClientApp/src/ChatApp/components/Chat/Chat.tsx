import React, { useEffect, useState } from 'react';
import { useChatApi } from '../../hooks/useChatApi';
import { useUserApi } from '../../hooks/useUserApi';
import { SendMessageContentType } from '../../models/ChatClient';
import { AuthProvider } from '../AuthProvider';
import { ChatForm } from './ChatForm';
import { ChatMessageItem } from './ChatMessageItem';
import { JoinThreadDialog } from '../JoinThreadDialog';

import './style.css';

export interface ChatProps {
    onClose?: () => void;
}

export const Chat = ({ onClose }: ChatProps) => {
    const { user } = useUserApi();
    const {
        chatClient,

        selectedThread,
        messages,
        getMessagesAsync,
        sendMessageRequest,
        clearSelectedThread,
    } = useChatApi();

    const [joinThreadDialogOpen, setJoinThreadDialogOpen] = useState(false);

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

    const handleClickInvite = () => {
        setJoinThreadDialogOpen((_) => true);
    };

    const handleClickClose = () => {
        if (onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (chatClient && selectedThread) {
            const chatThreadClient = chatClient.getChatThreadClient(
                selectedThread.id,
            );
            if (chatThreadClient) {
                getMessagesAsync(chatThreadClient)
                    .then(() => {
                        console.info('🔨 messages loaded');
                    })
                    .catch((err) => {
                        console.error('❌ messages could not load.', err);
                    });
            }
        }
    }, []);

    useEffect(() => {
        if (messages && messages.length > 0) {
            const appElement = document.querySelector('#app');
            if (appElement) {
                window.scrollTo({
                    top: appElement?.scrollHeight ?? 0,
                    behavior: 'smooth',
                });
            }
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            clearSelectedThread();
        };
    }, []);

    return (
        <AuthProvider>
            <div className="is-flex-grow-1 is-position-relative">
                <div className="hero is-fullheight is-position-absolute is-inset-0">
                    <div className="hero-head">
                        <header className="hero is-link is-bold">
                            <div className="hero-body">
                                <div className="container">
                                    <p className="title">
                                        {selectedThread?.topic}
                                    </p>

                                    <ul className="subtitle">
                                        {selectedThread?.participants.map(
                                            (p) => (
                                                <li key={p.id}>
                                                    {p.displayName}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                    {/* <button
                                        className="delete"
                                        aria-label="close"
                                        onClick={handleClickClose}
                                    ></button> */}
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
                            <ul className="is-flex-grow-1 is-scroll-y">
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
                        <ChatForm onSendMessage={handleSendMessage} />
                    </div>
                </div>
            </div>
            <JoinThreadDialog
                open={joinThreadDialogOpen}
                onClose={() => setJoinThreadDialogOpen((_) => false)}
                thread={selectedThread ?? undefined}
            />
        </AuthProvider>
    );
};

export default Chat;
