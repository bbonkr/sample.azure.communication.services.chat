import React, { useEffect } from 'react';
import { MessageModel } from '../../models';

interface MessageItemProps {
    record: MessageModel;
    onClickClose?: (item: MessageModel) => void;
}

export const MessageItem = ({ record, onClickClose }: MessageItemProps) => {
    const handleClick = () => {
        if (onClickClose) {
            onClickClose(record);
        }
    };

    useEffect(() => {
        if (record.duration) {
            const timeout =
                typeof record.duration === 'boolean'
                    ? 2000
                    : typeof record.duration === 'string' &&
                      record.duration === 'long'
                    ? 5000
                    : typeof record.duration === 'string' &&
                      record.duration === 'short'
                    ? 3000
                    : record.duration;

            window.setTimeout(() => {
                if (onClickClose) {
                    onClickClose(record);
                }
            }, timeout);
        }
    }, []);

    return (
        <article className={`message ${record.color ?? ''} mb-3`}>
            <div className="message-header">
                <p>{record.title}</p>
                <button
                    className="delete"
                    aria-label="delete"
                    onClick={handleClick}
                ></button>
            </div>
            <div className="message-body">{record.detail}</div>
        </article>
    );
};
