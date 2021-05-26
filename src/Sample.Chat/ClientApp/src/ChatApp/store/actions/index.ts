import { ActionType } from 'typesafe-actions';
import { chatActions } from './chat';
import { userActions } from './user';
import { messagingActions } from './messaging';

export const rootAction = {
    chat: chatActions,
    user: userActions,
    messaging: messagingActions,
};

export type RootAction = ActionType<typeof rootAction>;
