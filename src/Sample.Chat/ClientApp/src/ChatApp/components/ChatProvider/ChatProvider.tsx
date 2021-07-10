import React, { PropsWithChildren, useEffect } from 'react';
import { useChatApi } from '../../hooks/useChatApi';
import { useUserApi } from '../../hooks/useUserApi';
interface ChatProviderProps {}

export const ChatProvider = ({
    children,
}: PropsWithChildren<ChatProviderProps>) => {
    const { user } = useUserApi();
    const { stopChatClient, chatClient, initializeChatClient } = useChatApi();

    useEffect(() => {
        if (user && !chatClient) {
            initializeChatClient(user);
        }

        return () => {
            stopChatClient();
        };
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
};
