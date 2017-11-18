"use strict"
import axios from 'axios';
import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
//import {match, RouterContext} from 'react-router';
import {StaticRouter} from 'react-router-dom';

import reducers from './src/reducers/index';
import routes from './src/routes';

function handleRender(req, res) {
    axios.get('http://localhost:3001/books')
    .then(function(response) {
        //var myHtml = JSON.stringify(response.data);
        //res.render('index', {myHtml});

        // Step 1: create a redux store on the server
        const store = createStore(reducers, {books: {books: response.data}});

        // Step 2: get initial state from store
        const initialState = JSON.stringify(store.getState())
            .replace(/<\/script/g, '<\\/script')
            .replace(/<!--/g, '<\\!--');

        //Step 3: implement react-router on the server to intercept
        // client requests and define what to do with them
        const context = {};
        console.log("What does the context look like? ", context.url);
        const reactComponent = renderToString(
            <Provider store={store}>
                <StaticRouter
                    location={req.url}
                    context={context}>
                    {routes}
                </StaticRouter>
            </Provider>
        );

        if (context.url) {
            // can use the `context.status` that
            // we added in RedirectWithStatus
            redirect(context.status, context.url)
        } else {
            res.status(200).render('index', {reactComponent, initialState})
        }

        // const Routes = {
        //   routes: routes,
        //   location: req.url
        // };
        //
        // match(Routes, function(error, redirect, props) {
        //     if (error) {
        //         res.status(500).send('Error fulfilling the request');
        //     }
        //     else if (redirect) {
        //         res.status(302, redirect.pathname + redirect.search)
        //     }
        //     else if (props) {
        //         const reactComponent = renderToString(
        //             <Provider store={store}>
        //                 <RouterContext {...props} />
        //             </Provider>
        //         );
        //
        //         res.status(200).render('index', {reactComponent, initialState});
        //     }
        //     else {
        //         res.status(404).send('Not Found');
        //     }
        // });


    })
    .catch(function(err) {
        console.log('#Initial server-side rendering error', err);
    });
}

module.exports = handleRender;