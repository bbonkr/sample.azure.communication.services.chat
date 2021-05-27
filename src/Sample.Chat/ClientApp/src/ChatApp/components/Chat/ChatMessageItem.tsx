import React from 'react';
import { ChatMessage } from '@azure/communication-chat';
import { AcsHelper } from '../../lib/AcsHelper';
import { DateHelper } from '../../lib/DateHelper';

interface ChatMessageItemProps {
    chatMessage: ChatMessage;
}

export const ChatMessageItem = ({ chatMessage }: ChatMessageItemProps) => {
    console.info('chatMessage', chatMessage);
    const identifier = AcsHelper.parseIdentifier(chatMessage.sender);
    const chatMessageType = chatMessage.type.toLowerCase();

    if (chatMessageType === 'participantadded') {
        return (
            <div>
                <div>Participant added.</div>
                <div>{chatMessage.createdOn.toISOString()}</div>
            </div>
        );
    }

    if (chatMessageType === 'text') {
        return (
            <div>
                <div>{identifier?.id}</div>
                <div>{chatMessage.content?.message}</div>
                <div>{chatMessage.senderDisplayName}</div>
                <div>
                    {DateHelper.ensureDateValue(
                        chatMessage.createdOn,
                    )?.toISOString()}
                </div>
            </div>
        );
    }

    if (chatMessageType === 'html') {
        return (
            <div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: chatMessage.content?.message ?? '',
                    }}
                />
                <div>{chatMessage.senderDisplayName}</div>
                <div>
                    {DateHelper.ensureDateValue(
                        chatMessage.createdOn,
                    )?.toISOString()}
                </div>
            </div>
        );
    }

    return <React.Fragment></React.Fragment>;
};
