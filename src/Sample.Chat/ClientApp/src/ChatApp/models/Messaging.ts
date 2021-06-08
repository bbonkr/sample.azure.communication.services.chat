import React from 'react';
import { ColorStyles } from './BulmaStyles';

type Duration = 'long' | 'short';

export interface MessageModel {
    id: string;
    title: string;
    detail: React.ReactNode;
    color?: ColorStyles;
    duration?: boolean | number | Duration;
}
