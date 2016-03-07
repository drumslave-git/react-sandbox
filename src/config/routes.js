import React from 'react';
import { Route, Router, browserHistory } from 'react-router';

import App from '../components/App.jsx';

let routes = (
    <Router history={browserHistory}>
        <Route path="/" component={App} />
    </Router>
)

export default routes;