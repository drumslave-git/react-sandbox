import React, { Component } from 'react';
import { Router, useRouterHistory } from 'react-router';
import createHashHistory from 'react-router/node_modules/history/lib/createHashHistory';
import routes from './routes';

const history = useRouterHistory(createHashHistory)({ queryKey: false });

export default class Root extends Component {
  render() {
    return (
      <Router history={history} key={new Date()} routes={routes} />
    );
  }
}

