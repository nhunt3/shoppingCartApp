"use strict"
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
// import all (combined) reducers
import reducers from './reducers/index';
// import actions
import {addToCart} from './actions/cartActions';

// create the store
const middleware = applyMiddleware(thunk, logger);
// we will pass initial state from server store
const initialState = window.INITIAL_STATE;
const store = createStore(reducers, initialState, middleware);

import routes from './routes';

const Routes = (
    <Provider store={store}>
        <BrowserRouter>
            {routes}
        </BrowserRouter>
    </Provider>
);

render(Routes, document.getElementById('app'));
