import React, { PropsWithChildren, useEffect } from 'react';
import { useMessaging } from '../../hooks/useMessaging';
import { MessageModel } from '../../models';
import { MessageItem } from './MessageItem';

import './style.css';

interface MessagingProviderProps {}

export const MessagingProvider = ({
    children,
}: PropsWithChildren<MessagingProviderProps>) => {
    const { messages, removeMessage } = useMessaging();

    const handleClickCloseItem = (item: MessageModel) => {
        removeMessage(item.id);
    };

    return (
        <React.Fragment>
            {children}
            <div className="messaging-container pt-3 pr-3">
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        record={message}
                        onClickClose={handleClickCloseItem}
                    />
                ))}
            </div>
        </React.Fragment>
    );
};
