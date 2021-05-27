import React, { useEffect } from 'react';
import { useChatApi } from '../../hooks/useChatApi';
import { useUserApi } from '../../hooks/useUserApi';
import { SendMessageContentType } from '../../models/ChatClient';
import { AuthProvider } from '../AuthProvider';
import { ChatForm } from './ChatForm';
import { ChatMessageItem } from './ChatMessageItem';

export interface ChatProps {
    onClose?: () => void;
}

export const Chat = ({ onClose }: ChatProps) => {
    const { user } = useUserApi();
    const {
        chatThreadClient,
        selectedThread,
        messages,
        getMessagesAsync,
        sendMessageRequest,
    } = useChatApi();

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

    const handleClickClose = () => {
        if (onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (chatThreadClient) {
            getMessagesAsync()
                .then(() => {
                    console.info('messages loaded');
                })
                .catch((err) => {
                    console.error('messages could not load.', err);
                });
        }
    }, [chatThreadClient]);

    return (
        <AuthProvider>
            <div className="is-flex-grow-1">
                <div>
                    <h2>
                        Chat <small>{selectedThread?.topic}</small>
                    </h2>

                    <button
                        className="delete"
                        aria-label="close"
                        onClick={handleClickClose}
                    ></button>
                </div>

                <ul className="is-flex-grow-1 is-scroll-y">
                    {messages
                        .sort((a, b) => (a.createdOn > b.createdOn ? 1 : -1))
                        .map((m) => (
                            <ChatMessageItem key={m.id} chatMessage={m} />
                        ))}
                </ul>

                <div>
                    <ChatForm onSendMessage={handleSendMessage} />
                </div>
            </div>
        </AuthProvider>
    );
};

export default Chat;
