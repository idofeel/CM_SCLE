import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import scle from './routes/scleView';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={scle} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;

