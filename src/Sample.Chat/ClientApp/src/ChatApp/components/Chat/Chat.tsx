import React from 'react';
import { AuthProvider } from '../AuthProvider';
export const Chat = () => {
    return (
        <AuthProvider>
            <div>
                <p>Chat</p>
            </div>
        </AuthProvider>
    );
};

export default Chat;
