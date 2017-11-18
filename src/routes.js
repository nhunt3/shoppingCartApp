"use strict"
import React from 'react';
import {render} from 'react-dom';
import {Route, Switch} from 'react-router-dom';

import BooksList from './components/pages/booksList';
import Cart from './components/pages/cart';
import BooksForm from './components/pages/booksForm';
import Menu from './components/menu';
import Footer from './components/footer';

// RETRIVES COMPONENTS BASED ON STATUS
const Status = function ({ code, children }){
    return (
        <Route render={function({ staticContext }) {
            if (staticContext)
                staticContext.status = code
            return children
        }}/>
    )
};

//NOT-FOUND COMPONENT
const NotFound = function(){
    return (
        <Status code={404}>
            <div>
                <h2> Sorry, cannot find this page</h2>
            </div>
        </Status>
    )
};

// CLIENT-SERVER SHARED ROUTES
const routes = (
    <div>
        <Menu />
        <Switch>
            <Route exact={true} path="/" component={BooksList}/>
            <Route path="/admin" component={BooksForm}/>
            <Route path="/cart" component={Cart}/>
            <Route component={NotFound}/>
        </Switch>
        <Footer />
    </div>
);

export default routes;