import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useStore } from '../../store';

export const App = () => {
    const store = useStore();
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route />
                    <Route path="/404"></Route>
                </Switch>
            </BrowserRouter>
        </Provider>
    );
};
