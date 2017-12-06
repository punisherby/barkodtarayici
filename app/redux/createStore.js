/**
 * Index - this is where everything
 *  starts - but offloads to app.js
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
/* global __DEV__ */
import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

// Consts and Libs
//import { AppStyles } from '@theme/';
//import Analytics from '@lib/analytics';

// All redux reducers (rolled into one mega-reducer)
import rootReducer from '@redux/index';

// Load middleware
let middleware = [
  thunk, // Allows action creators to return functions (not just plain objects)
];

if (__DEV__) {
  // Dev-only middleware
  middleware = [
    ...middleware,
    createLogger(), // Logs state changes to the dev console
  ];
}

// Init redux store (using the given reducer & middleware)
export default store = compose(
  applyMiddleware(...middleware),
)(createStore)(rootReducer);