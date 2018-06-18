import React, {Component} from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import routeOptions from './ruter'
import App from './components/App'

import Header from './components/Header'

// import { Provider } from 'react-redux';
// import store from '../shared/app/redux/store';
// import App from '../shared/app/app.jsx';


let routes = routeOptions.routes.map(({ path, component, exact }, i) =>
    <Route key={Math.random() + 'ROUTE_'} exact={exact} path={path} component={component} />
);

render((
    <Router>
        <App>
            <Switch>
                {routes}
            </Switch>
        </App>
    </Router>
), document.getElementById('app'));


