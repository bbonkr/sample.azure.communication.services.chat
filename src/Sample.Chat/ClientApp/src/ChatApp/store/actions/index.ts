import { ActionType } from 'typesafe-actions';
import { chatActions } from './chat';
import { userActions } from './user';

export const rootAction = {
    chat: chatActions,
    user: userActions,
};

export type RootAction = ActionType<typeof rootAction>;
