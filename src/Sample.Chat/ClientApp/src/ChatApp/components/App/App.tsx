import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useStore } from '../../store';
import { Container } from '../Layouts';
import { NotFound } from '../NotFound';

const SignIn = React.lazy(() => import('../SignIn'));

export const App = () => {
    const store = useStore();
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Suspense fallback={<div>Loading ...</div>}>
                    <Container classNames={[]}>
                        <Switch>
                            <Route path="/signin" exact>
                                <SignIn />
                            </Route>
                            <Route path="/404">
                                <NotFound />
                            </Route>
                        </Switch>
                    </Container>
                </Suspense>
            </BrowserRouter>
        </Provider>
    );
};
