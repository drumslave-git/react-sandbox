import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Tracker from '../components/Tracker';
import LangStrings from '../components/LangStrings';
import Charts from '../components/Charts';

const Root = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" component={Tracker} exact />
                <Route path="/lang" component={LangStrings} exact />
                <Route path="/charts" component={Charts} exact />
            </Switch>
        </Router>
    );
};

export default Root;

