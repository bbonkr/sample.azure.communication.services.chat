import React from 'react';
import { AuthProvider } from '../AuthProvider';

export const Thread = () => {
    return (
        <AuthProvider>
            <div>
                <p>Thread</p>
            </div>
        </AuthProvider>
    );
};

export default Thread;
