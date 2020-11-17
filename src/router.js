import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import scle from './routes/scleView';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/scle" exact component={scle} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
