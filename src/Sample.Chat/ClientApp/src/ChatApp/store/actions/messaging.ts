import { ActionType, createAction } from 'typesafe-actions';
import { MessageModel } from '../../models';

const addMessage = createAction('add-message')<MessageModel>();

const removeMessage = createAction('remove-message')<string>();

export const messagingActions = {
    addMessage,
    removeMessage,
};

export type MessagingActions = ActionType<typeof messagingActions>;
