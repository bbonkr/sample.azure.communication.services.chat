import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useStore } from '../../store';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Loading } from '../Loading';
import { MessagingProvider } from '../MessagingProvider';
import { ChatProvider } from '../ChatProvider';
import { appOptions } from '../../constants';

import 'bulma/css/bulma.css';
import './style.css';

const SignIn = React.lazy(() => import('../SignIn'));
const SignUp = React.lazy(() => import('../SignUp'));
const NotFound = React.lazy(() => import('../NotFound'));
const Thread = React.lazy(() => import('../Thread'));
const Header = React.lazy(() => import('../Layouts/Header'));
// const Chat = React.lazy(() => import('../Chat'));

const helmetContext = {};

export const App = () => {
    const store = useStore();

    return (
        <Provider store={store}>
            <ChatProvider>
                <HelmetProvider context={helmetContext}>
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
                </HelmetProvider>
            </ChatProvider>
        </Provider>
    );
};
