import React from 'react';
import { GetThreadResponseModel } from '../../models/ChatClient';

interface ThreadListItemProps {
    thread: GetThreadResponseModel;
}

export const ThreadListItem = ({ thread }: ThreadListItemProps) => {
    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">{thread.topic}</p>
            </header>
            <div className="card-content">
                <div className="content">
                    <div className="is-flex is-flex-wrap-wrap">
                        {thread.participants.map((p) => (
                            <span key={p.id} className="tag is-info mr-1 mt-1">
                                {p.displayName}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
