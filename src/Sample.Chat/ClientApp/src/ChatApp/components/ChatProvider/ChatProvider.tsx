import React, { PropsWithChildren, useEffect } from 'react';
import { useChatApi } from '../../hooks/useChatApi';
interface ChatProviderProps {}

export const ChatProvider = ({
    children,
}: PropsWithChildren<ChatProviderProps>) => {
    const { stopChatClientAsync } = useChatApi();

    useEffect(() => {
        return () => {
            stopChatClientAsync()
                .then(() => {
                    console.info('Chat client stopped');
                })
                .catch((err) => {
                    console.error('Chat client could not stop.', err);
                });
        };
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
};
