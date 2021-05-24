import { combineEpics } from 'redux-observable';
import { chatEpic } from './chat';
import { userEpic } from './user';

export const rootEpic = combineEpics(userEpic, chatEpic);

export type RootEpic = ReturnType<typeof rootEpic>;
