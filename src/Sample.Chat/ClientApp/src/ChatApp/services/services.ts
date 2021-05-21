import { UserClient } from '../lib/UserClient';
import { ChatClient } from '../lib/ChatClient';

export const services = {
    user: new UserClient(),
    chat: new ChatClient(),
};

export type Services = typeof services;
