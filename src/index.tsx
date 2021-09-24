import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "@fontsource/roboto"
import {Provider} from 'react-redux'
import AppStore from './util/appState/Store'
import {BrowserRouter as Router} from 'react-router-dom'

ReactDOM.render(
  <Provider store={AppStore}>
    <Router>
    <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
