import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { getAuthStatus } from './actions/authActions';

export const history = createBrowserHistory();

export const componentWillMount = () => {
  store.dispatch(getAuthStatus());
};

componentWillMount();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}> 
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
