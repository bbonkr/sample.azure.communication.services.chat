import React, { PropsWithChildren, useEffect } from 'react';
import { useChatApi } from '../../hooks/useChatApi';
interface ChatProviderProps {}

export const ChatProvider = ({
    children,
}: PropsWithChildren<ChatProviderProps>) => {
    const { stopChatClient } = useChatApi();

    useEffect(() => {
        return () => {
            stopChatClient();
        };
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
};
