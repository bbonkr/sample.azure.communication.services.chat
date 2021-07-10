import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useStore } from '../../store';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Loading } from '../Loading';
import { MessagingProvider } from '../MessagingProvider';
import { ChatProvider } from '../ChatProvider';
import { appOptions } from '../../constants';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import 'bulma/css/bulma.css';
import './style.css';

const SignIn = React.lazy(() => import('../SignIn'));
const SignUp = React.lazy(() => import('../SignUp'));
const NotFound = React.lazy(() => import('../NotFound'));
const Thread = React.lazy(() => import('../Thread'));
const Header = React.lazy(() => import('../Layouts/Header'));

const helmetContext = {};

export const App = () => {
    const store = useStore();
    const persistor = persistStore(store, {}, () => {
        persistor.persist();
    });

    return (
        <HelmetProvider context={helmetContext}>
            <Provider store={store}>
                <PersistGate loading={<Loading />} persistor={persistor}>
                    <ChatProvider>
                        <Helmet
                            title="Chat"
                            titleTemplate="%s - Chat Sample App"
                            defaultTitle="Chat Sample App"
                        />
                        <MessagingProvider>
                            <BrowserRouter>
                                <Suspense fallback={<Loading />}>
                                    <Header appOptions={appOptions} />
                                    <Switch>
                                        <Route path="/" exact>
                                            <Thread />
                                        </Route>
                                        <Route path="/signin" exact>
                                            <SignIn />
                                        </Route>
                                        <Route path="/signup" exact>
                                            <SignUp />
                                        </Route>
                                        <Route path="/404">
                                            <NotFound />
                                        </Route>
                                        <Route path="/threads" exact>
                                            <Thread />
                                        </Route>
                                        {/* <Route path="/chats/:id" exact>
                                        <Chat />
                                    </Route> */}
                                        <Route path="/loading">
                                            <Loading />
                                        </Route>
                                        <Route path="*">
                                            <Redirect to="/404" />
                                        </Route>
                                    </Switch>
                                </Suspense>
                            </BrowserRouter>
                        </MessagingProvider>
                    </ChatProvider>
                </PersistGate>
            </Provider>
        </HelmetProvider>
    );
};
