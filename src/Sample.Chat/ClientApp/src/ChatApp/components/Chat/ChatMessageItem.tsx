import React from 'react';
import { ChatMessage } from '@azure/communication-chat';
import { AcsHelper } from '../../lib/AcsHelper';
import { DateHelper } from '../../lib/DateHelper';
import { GetUserResponseModel } from '../../models/UserClient';
import dayjs from 'dayjs';

interface ChatMessageItemProps {
    chatMessage: ChatMessage;
    user?: GetUserResponseModel;
    showDisplayName?: boolean;
}

export const ChatMessageItem = ({
    chatMessage,
    user,
    showDisplayName,
}: ChatMessageItemProps) => {
    // console.info('chatMessage', chatMessage);
    const identifier = AcsHelper.parseIdentifier(chatMessage.sender);
    const chatMessageType = chatMessage.type.toLowerCase();

    const isMessageType =
        chatMessageType === 'text' ||
        chatMessageType === 'html' ||
        chatMessageType === 'richtext/html';

    const isMyMessage = identifier?.id === user?.id;

    return (
        <li
            className={`chat-message-item ${
                !isMessageType ? 'system' : isMyMessage ? 'my' : 'other'
            }`}
        >
            {showDisplayName && isMessageType && (
                <div
                    className={`displayname has-background-white `}
                    title={chatMessage.senderDisplayName}
                >
                    {isMyMessage
                        ? 'me'
                        : chatMessage.senderDisplayName
                              ?.split(' ')
                              .map((s) => s[0])
                              .filter((_, index) => index < 2)
                              .join(' ')}
                </div>
            )}

            <div
                className={`chat-message-item-content ${
                    !isMessageType
                        ? ''
                        : isMyMessage
                        ? 'has-background-success'
                        : 'has-background-info'
                }`}
            >
                {chatMessageType === 'participantadded' && (
                    <div
                        className="has-text-black-bis"
                        title={'message from system'}
                    >
                        Participant added.
                    </div>
                )}

                {chatMessageType === 'topicUpdated' && (
                    <div
                        className="has-text-black-bis"
                        title={'message from system'}
                    >
                        Topic updated.
                    </div>
                )}

                {chatMessageType === 'text' && (
                    <div
                        className="has-text-white-bis chat-message-content"
                        title={`message from ${
                            isMyMessage ? 'me' : chatMessage.senderDisplayName
                        }`}
                    >
                        {chatMessage.content?.message}
                    </div>
                )}

                {(chatMessageType === 'html' ||
                    chatMessageType === 'richtext/html') && (
                    <div
                        className="has-text-white-bis chat-message-content"
                        title={`message from ${
                            isMyMessage ? 'me' : chatMessage.senderDisplayName
                        }`}
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
                {/* {DateHelper.ensureDateValue(
                    chatMessage.createdOn,
                )?.toISOString()} */}
                {dayjs(chatMessage.createdOn).format('YYYY-MM-DD HH:mm:ss')}
            </span>
        </li>
    );
};
