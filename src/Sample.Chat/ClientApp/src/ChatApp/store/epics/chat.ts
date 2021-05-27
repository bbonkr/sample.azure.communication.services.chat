import { combineEpics, Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { filter, map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { RootState } from '../reducers';
import { Services } from '../../services';
import { RootAction, rootAction } from '../actions';

const getThreadsEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.chat.getThreads.request)),
        switchMap((action) =>
            from(api.chat.getThreads(action.payload)).pipe(
                map((value) => rootAction.chat.getThreads.success(value)),
                catchError((error) =>
                    of(rootAction.chat.getThreads.failure(error)),
                ),
            ),
        ),
    );

const createThreadEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.chat.createThread.request)),
        switchMap((action) =>
            from(api.chat.createThread(action.payload)).pipe(
                map((value) => rootAction.chat.createThread.success(value)),
                catchError((error) =>
                    of(rootAction.chat.createThread.failure(error)),
                ),
            ),
        ),
    );

const joinThreadEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.chat.joinThread.request)),
        switchMap((action) =>
            from(api.chat.joinToThread(action.payload)).pipe(
                map((value) => rootAction.chat.joinThread.success(value)),
                catchError((error) =>
                    of(rootAction.chat.joinThread.failure(error)),
                ),
            ),
        ),
    );

const leaveThreadEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.chat.leaveThread.request)),
        switchMap((action) =>
            from(api.chat.leaveFromThread(action.payload)).pipe(
                map((value) => rootAction.chat.leaveThread.success(value)),
                catchError((error) =>
                    of(rootAction.chat.leaveThread.failure(error)),
                ),
            ),
        ),
    );

const deleteThreadEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.chat.deleteThread.request)),
        switchMap((action) =>
            from(api.chat.deleteThread(action.payload)).pipe(
                // map((value) => rootAction.chat.deleteThread.success(value)),
                mergeMap((value) =>
                    of(
                        rootAction.chat.deleteThread.success(value),
                        rootAction.chat.removeThread(action.payload.threadId),
                    ),
                ),
                catchError((error) =>
                    of(rootAction.chat.deleteThread.failure(error)),
                ),
            ),
        ),
    );

const sendMessageEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.chat.sendMessage.request)),
        switchMap((action) =>
            from(api.chat.sendMessage(action.payload)).pipe(
                map((value) => rootAction.chat.sendMessage.success(value)),
                catchError((error) =>
                    of(rootAction.chat.sendMessage.failure(error)),
                ),
            ),
        ),
    );

const sendFileEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.chat.sendFile.request)),
        switchMap((action) =>
            from(api.chat.sendFile(action.payload)).pipe(
                map((value) => rootAction.chat.sendFile.success(value)),
                catchError((error) =>
                    of(rootAction.chat.sendFile.failure(error)),
                ),
            ),
        ),
    );

export const chatEpic = combineEpics(
    getThreadsEpic,
    createThreadEpic,
    joinThreadEpic,
    leaveThreadEpic,
    deleteThreadEpic,
    sendMessageEpic,
    sendFileEpic,
);

export type ChatEpic = ReturnType<typeof chatEpic>;
