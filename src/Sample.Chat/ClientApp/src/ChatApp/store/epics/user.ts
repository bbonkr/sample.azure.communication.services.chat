import { combineEpics, Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { filter, map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { RootState } from '../reducers';
import { Services } from '../../services';
import { RootAction, rootAction } from '../actions';

const loadUserEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.user.loadUser.request)),
        switchMap((action) =>
            from(api.user.getUser(action.payload)).pipe(
                map((value) => rootAction.user.loadUser.success(value)),
                catchError((error) =>
                    of(rootAction.user.loadUser.failure(error)),
                ),
            ),
        ),
    );

const createUserEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.user.createUser.request)),
        switchMap((action) =>
            from(api.user.createUser(action.payload)).pipe(
                mergeMap((value) =>
                    of(rootAction.user.createUser.success(value)),
                ),
                catchError((error) =>
                    of(rootAction.user.createUser.failure(error)),
                ),
            ),
        ),
    );

const deleteUserEpic: Epic<RootAction, RootAction, RootState, Services> = (
    action$,
    state$,
    api,
) =>
    action$.pipe(
        filter(isActionOf(rootAction.user.deleteUser.request)),
        switchMap((action) =>
            from(api.user.deleteUser(action.payload)).pipe(
                map((value) => rootAction.user.deleteUser.success(value)),
                catchError((error) =>
                    of(rootAction.user.deleteUser.failure(error)),
                ),
            ),
        ),
    );

export const userEpic = combineEpics(
    loadUserEpic,
    createUserEpic,
    deleteUserEpic,
);

export type UserEpic = ReturnType<typeof userEpic>;
