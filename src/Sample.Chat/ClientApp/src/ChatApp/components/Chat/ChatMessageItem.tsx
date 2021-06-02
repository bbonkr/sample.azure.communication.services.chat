import React from 'react';
import { ChatMessage } from '@azure/communication-chat';
import { AcsHelper } from '../../lib/AcsHelper';
import { DateHelper } from '../../lib/DateHelper';
import { GetUserResponseModel } from '../../models/UserClient';

interface ChatMessageItemProps {
    chatMessage: ChatMessage;
    user?: GetUserResponseModel;
}

export const ChatMessageItem = ({
    chatMessage,
    user,
}: ChatMessageItemProps) => {
    // console.info('chatMessage', chatMessage);
    const identifier = AcsHelper.parseIdentifier(chatMessage.sender);
    const chatMessageType = chatMessage.type.toLowerCase();

    const isMessageType =
        chatMessageType === 'text' || chatMessageType === 'html';

    const isMyMessage = identifier?.id === user?.id;

    return (
        <li
            className={`chat-message ${
                !isMessageType ? 'system' : isMyMessage ? 'my' : 'other'
            }`}
        >
            <div
                className={`${
                    !isMessageType
                        ? ''
                        : isMyMessage
                        ? 'has-background-success'
                        : 'has-background-info'
                }`}
            >
                {chatMessageType === 'participantadded' && (
                    <div className="has-text-black-bis">Participant added.</div>
                )}

                {chatMessageType === 'topicUpdated' && (
                    <div className="has-text-black-bis">Topic updated.</div>
                )}

                {chatMessageType === 'text' && (
                    <div className="has-text-white-bis">
                        {chatMessage.content?.message}
                    </div>
                )}

                {chatMessageType === 'html' && (
                    <div
                        className="has-text-white-bis"
                        dangerouslySetInnerHTML={{
                            __html: chatMessage.content?.message ?? '',
                        }}
                    />
                )}
            </div>
            <span
                className={`time is-size-7 ${
                    isMyMessage ? 'has-text-right' : ''
                }`}
            >
                {DateHelper.ensureDateValue(
                    chatMessage.createdOn,
                )?.toISOString()}
            </span>
        </li>
    );
};
