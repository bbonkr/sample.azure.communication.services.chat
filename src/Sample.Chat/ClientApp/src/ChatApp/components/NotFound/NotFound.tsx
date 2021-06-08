import React from 'react';
import { Section } from '../Layouts';

export const NotFound = () => {
    return (
        <Section classNames={['is-full-screen']}>
            <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                <h1 className="title">404 | Not Found</h1>
            </div>
        </Section>
    );
};

export default NotFound;
